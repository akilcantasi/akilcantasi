# QA — platform

Kapsam: `server/*` (Node bilgi noktası), `android/`, `capacitor.config.ts`, `package.json`
betikleri, `vite.config.ts`, Windows betikleri (`onizle.cmd`, `apk-derle.cmd`,
`tools/onizle.ps1`, `tools/apk-derle.ps1`, yeni `paketleri-yerlestir.cmd` +
`tools/paketleri-yerlestir.ps1`), `tools/pi/*`, `README.md`, eski `e2e/` betikleri.

## Denetlenenler

- [x] `npm run build` başarılı (tsc + vite). Uyarı: yalnızca iki zararsız "dinamik içe aktarma
      parçaya taşınmadı" notu (`library.ts`, `guides-search.ts`; zaten ana pakette).
- [x] Paket boyutu / kod bölme: giriş betiği tek dosya, `modulepreload` yok. Harita (maplibre
      1,1 MB), transformers.js, ONNX Runtime wasm (26,9 MB), wllama wasm (8,8 MB), araçlar, İletişim
      bölümleri ve galeri ayrı parçalar; ihtiyaç olunca yüklenir.
- [x] İlk yükleme: 1,71 MB → **1,57 MB** (gzip 552 → **502 KB**). Kalanın ~%60'ı rehber
      çizimleri (sahne bileşenleri), ~%30'u rehber metinleri.
- [x] `npx cap sync android`: `@capacitor-community/text-to-speech@8.0.2` bulundu,
      `capacitor.settings.gradle`, `capacitor.build.gradle` ve `capacitor.plugins.json`'a eklendi;
      eklentinin `TTS_SERVICE` `<queries>` girdisi kendi manifestinde (birleşir).
- [x] Manifest izinleri: INTERNET, RECORD_AUDIO, MODIFY_AUDIO_SETTINGS, WAKE_LOCK, konum
      (kaba/ince), ACCESS/CHANGE_WIFI_STATE, BLUETOOTH(+ADMIN ≤30), BLUETOOTH_SCAN/ADVERTISE/
      CONNECT, NEARBY_WIFI_DEVICES (`neverForLocation`, Google Nearby belgesiyle aynı).
- [x] Tüm Java dosyaları taklit sınıflara karşı `javac` ile derlendi (değişiklikten sonra da).
- [x] Sunucu: `/api/status`, `/api/packs` (alt klasör, `.tar`, Türkçe adlar, `_` klasörleri
      atlanır), `/data/*` Range 206 / HEAD / 416 / 403, `/api/board` GET/POST, APK indirme,
      COOP/COEP/CORP/CSP tüm yanıtlarda, wasm MIME, SPA geri dönüşü. `tests/server.test.ts` 23/23.
- [x] Uygulama Node sunucusundan 390×844, 360×640, 1280×800'de açıldı: crossOriginIsolated,
      CSP ihlali / konsol hatası yok, yatay taşma yok, Paketler aracı `data/zim`, `data/models`,
      `data/ses` paketlerini listeliyor.
- [x] Eski e2e betikleri güncellendi ve geçti: `download-check.mjs` 15/15,
      `native-infopoint-check.mjs`, `sanitize-check.mjs`, `mesh-check.mjs`;
      `real-data-check.mjs` gerçek verilerle (Kütüphane, Harita, Rehber, Paketler geçti; Fener
      bölümü bellek darlığında sekme çökmesine dayanıklı hâle getirildi).
- [x] PowerShell betikleri satır satır okundu (bu ortamda PowerShell çalıştırılamadı).
- [x] Whisper `.tar` düzeni: betiğin ürettiği düzen (kökte json, `onnx/` altında modeller, ustar)
      uygulamanın `listTar` + `planWhisperPack` işlevleriyle açıldı → `missing: []`.
- [x] `tools/pi/*.sh` `bash -n` + shellcheck temiz, `captive.mjs` `node --check`.
- [x] `npx tsc --noEmit` temiz, `npx vitest run` 1271/1271.

## Bulunan ve düzeltilen hatalar

1. **CSP, başka bir http sunucusuna bağlanmayı engelliyordu** (`connect-src … https:`). İletişim'de
   elle girilen başka bir bilgi noktası (`http://192.168.x.x:8080`) ve LAN aynalarından indirme
   tarayıcıda "CSP ihlali" ile başarısız oluyordu; `download-check` bu yüzden kalıyordu.
   `connect-src`'ye `http:` eklendi (`https:` zaten açık olduğundan güvenliği azaltmaz).
2. **`board.json` paket gibi indirilebiliyordu:** `/data//board.json` ve `/data/board%2Ejson`
   ham yol karşılaştırmasını atlatıyordu. Artık çözülmüş yol karşılaştırılıyor; testlere eklendi.
3. **Telefon bilgi noktasında CSP yoktu** (`InfoPointServer.java`): Node sunucusuyla aynı CSP
   eklendi (ZIM içeriği betik çalıştıramasın).
4. **`apk-derle.ps1` Node 20'yi yeterli sayıyordu**; Capacitor 8 CLI Node 22+ ister
   (`npx cap sync` başarısız olurdu). Eşik 22 yapıldı.
5. **Çizim şartnamesi metinleri (~200 KB) ana pakete giriyordu**: yalnızca galeri kullanıyor.
   `src/art/spec-index.ts`'e taşındı; `_ornek` sahneleri glob'dan çıkarıldı. (Kapsam dışı küçük
   değişiklik: `src/art/registry.ts`, `src/art/Gallery.tsx`, `tests/guides.test.ts` içe aktarımı.)
6. **Eski e2e betikleri kaldırılmış `nav-paylas`'ı kullanıyordu** (`real-data-check`,
   `download-check`, `native-infopoint-check`): Araçlar → Paketler ve paylaşım'a geçirildi; silme
   onayı `confirm()` yerine satır içi `pack-delete-yes`; harita isteği sayımı işçi istekleri dahil
   bağlamdan yapılıyor; ekran görüntüsü zaman aşımları denetimi düşürmüyor.
7. `onizle.ps1`: sunucu 10 sn'de yanıt vermezse kullanıcı sessiz kalıyordu; adres yazdırılıyor.
8. README tamamen güncellendi (6 sekme, 168 rehber, İletişim, Araçlar, çoklu ZIM, Fener
   model/ses, mesh, Pi, yardımcı betikler, Qwen2.5-3B lisans notu, bilinen sınırlamalar);
   `server/README.md` (`.tar`, alt klasörler, pano uç noktaları, CSP) ve `tools/pi/README.md`.

## Yeni: `paketleri-yerlestir.cmd` + `tools/paketleri-yerlestir.ps1`

- Gerçek İndirilenler klasörünü kayıt defterinden bulur (taşınmış olabilir), yoksa
  `%USERPROFILE%\Downloads`. Seçenekler: `-Deneme`, `-Kaynak`, `-Hedef`.
- 11 bilinen `.zim`/`.gguf` dosyasını `data\zim\` / `data\models\` içine taşır; hedefte aynı ad
  varsa dokunmaz.
- Whisper: 7 dosyanın hepsi varsa ve `config.json` `model_type: whisper` ise `d_model`'den boyutu
  bulur (base/small…), dosyaları `data\ses\_whisper-<boyut>-hazirlik\` içine taşır, `tar.exe`'yi
  orada yalnızca göreli ASCII adlarla çalıştırır (Türkçe karakterli yol sorunu olmasın),
  `--format ustar`, `tar -tf` ile 7 girdiyi doğrular, sonra hazırlık klasörünü kaldırır. Hata olursa
  dosyalar hazırlık klasöründe kalır ve yeri yazdırılır.
- Taşıdıkları dışında hiçbir şeyi silmez; sonunda özet ve sayaçlar yazar.

## Kalan sorunlar

- İlk yüklemede ~1,57 MB JS (gzip ~500 KB): rehber çizimleri eşzamanlı `import.meta.glob` ile
  ana pakette. Tembel yükleme `Art` bileşeninin eşzamansız olmasını gerektirir (Rehber/Fener
  kapsamı); yerel/LAN yüklemede kabul edilebilir.
- PowerShell betikleri Windows'ta çalıştırılmadı; yalnızca okunarak ve yapısal denetimle
  (BOM, CRLF, parantez dengesi, `"$ad:"` tuzağı) doğrulandı.
- `e2e/fener-check.mjs` (eski, Fener kapsamı): küçük deneme modeliyle motor `error` durumuna düşüyor
  ve "metin akış hâlinde büyüdü" / "rehber modu etiketi yok" denetimleri kalıyor; `qa-fener.mjs`
  bunun yerini alıyor.
- Bu test ortamında internet olmadığından isteğe bağlı çevrimiçi katalog isteği
  (`https://akilcantasi.com/packs/packs-manifest.json`) konsolda ağ hatası verir; uygulama hatası değil.
- `tests/iletisim.test.ts` "giden kutusu" testi çalışma sırasında bir ara kaldı (başka bir ajan
  düzenliyordu); son çalıştırmada tüm testler geçti.

- `real-data-check.mjs` Fener bölümü: gerçek Qwen 0.5B ile cevap üretirken Chromium sekmesi
  çöküyor ("Target crashed"; 2 çekirdek / 8 GB ortam, aynı anda çalışan başka QA ajanları).
  Kütüphane, Harita, Rehber, Paketler ve model seçimi geçiyor. Fener kapsamına bildirildi;
  daha boş bir makinede yeniden denenmeli.

## e2e komutu

```
npm run build
node e2e/qa-platform.mjs                       # sunucu, derleme, Android, Windows betikleri, 3 ekran boyutu
node e2e/download-check.mjs
node server/server.mjs --data /home/claude/packs --port 8090 &
node e2e/real-data-check.mjs http://localhost:8090/ /tmp/realshots
node e2e/native-infopoint-check.mjs http://localhost:8090/
```

## Denetim 2026-11 (kabuk ve web derlemesi)

Ayrıntı: `docs/qa/a11y.md` → "Denetim 2026-11". Platformu ilgilendirenler:

- [x] **Site verileri engelli tarayıcı** (kiosk/gizlilik ayarı): uygulama artık açılıyor
      (`src/depolama-koruma.ts`), "veri saklamaya izin vermiyor" uyarısı görünüyor.
- [x] **Masaüstü kaydırma çubuğu** (Windows önizleme, Raspberry Pi tarayıcısı): yan boşluklar eşit,
      başlık kartlarla hizalı (`html.kaydirma-cubugu` + `scrollbar-gutter`).
- [x] **index.html:** `color-scheme: dark`, açılış ekranı (betik inene kadar logo + "açılıyor…"),
      `noscript` notu; CSP ile uyumlu (satır içi yalnız stil, `style-src 'unsafe-inline'` zaten açık).
- [x] **Manifest:** 192/512 maskable PNG simgeler (`public/icon-maskable-192.png`, `-512.png`,
      `icon-maskable.svg`'den), `id`, `scope`. theme-color/background-color = `--bg` (#0e1b2c).
- [x] **Geri tuşu:** tarayıcıda uygulama içinde geri gider (`src/gecmis.ts`).
- [x] **Dış istekler:** çevrimdışında hiç yok; çevrimiçinde tek istek isteğe bağlı katalog
      (`https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/packs-manifest.json`),
      `src/lib/packs-ui.tsx` usePackRows → `refreshRemoteManifest()`: Rehber, Harita, Kütüphane,
      Kurulum, Paketler ve Hava ekranına her girişte, kullanıcı bir şeye basmadan. Oturum başına bir
      kez yapılmalı (Kütüphane/paket kapsamı).
- [ ] **Android geri tuşu** (kalan): `MainActivity` geri tuşunu WebView geçmişine bağlamıyor
      (`@capacitor/app` yok); her ekranda uygulama arka plana gidiyor. `OnBackPressedCallback` ile
      `WebView.canGoBack()/goBack()` eklenmeli (a11y.md'de tarif).
- `e2e/qa-platform.mjs` derleme bölümüne PWA denetimleri eklendi (viewport-fit, theme-color = --bg,
  color-scheme, açılış ekranı, noscript, manifest renkleri ve 4 PNG simgenin boyutu).

## Denetim 2026-11 — bağımsız gözden geçirme sonrası düzeltmeler

Altı denetim ajanının değişiklikleri bağımsız bir gözden geçirmeden geçti; bulunan sorunlar düzeltildi:

- **Mesh aktarımı:** Gelen çok iletili çerçeve diğer komşulara artık ileti başına ayrı çerçeve yerine toplu itiliyor (`src/lib/mesh/node.ts` `pushMany`). Önceden zincirde (C–A–B) 500 iletilik bir eşitleme B'nin gelen çerçeve sınırına (MeshPeer: 120 + 20/sn) takılıp iletilerin çoğu düşüyordu. Sınama: `tests/mesh.test.ts`.
- **Kurulum çökme döngüsü:** Kurulum ekranı çökerse artık "tamamlandı" sayılıp kapanıyor (`kurulumuKapat`). Önceden açılışta kapanıp yeniden açılan bir döngüye girebiliyordu.
- **Hata kartı:** Sekme içindeki hata kartı, aynı sekmede başka ekrana geçilince (geri tuşu, "← Araçlar") sıfırlanıyor (`HataSiniri sifirla`).
- **İndirme:** Yarım dosya yalnız bir ayna beklenenden fazla veri gönderdiyse siliniyor. Başlıktaki boyutu farklı olan eski bir ayna, başka aynadan inmiş yarım dosyayı artık silmiyor (`download-core.ts`).
- **Geri tuşu ve katmanlar:** Geri tuşu artık ekranın üstündeki pencereyi önce kapatıyor (`src/gecmis.ts` `useGeriKapat`). Bu pencereler: PDF okuyucu, harita sayfaları, Fener model paneli, sözlük büyük gösterimi. İlk ekranda pencere açıkken eklenen bir koruma kaydı, uygulamanın kapanmasını önlüyor. Sınama: `tests/gecmis.test.ts`, `e2e/qa-a11y.mjs` (e2).
- **Android geri tuşu:** `MainActivity`'ye WebView geçmişinde geri gitme eklendi. Geçmiş bitince Android'in olağan davranışı sürüyor.
- **Küçük düzeltmeler:**
  - Hesap aracında "Gün" kutusunu silip yeni sayı yazınca "17" oluşması.
  - Rehber aramasında 3 harflik kökün başka kelimenin başını bulması ("yan" → "yangın").
  - Enkaz aramada bozuk kayıtlı hedefin doğrulanması.
  - Telefon bilgi noktasında gizli dosya yasağı.
  - Yüksek kontrastta tema rengi.
  - 112 düğmelerinde beyaz yazı karşıtlığı.
  - Uzak paket kataloğu artık her sekme açılışında değil, oturumda 6 saatte bir deneniyor.

## Öneriler 2026-11 — service worker (tarayıcı / bilgi noktası)

Bilgi noktasından (Windows / Raspberry Pi) tarayıcıyla bir kez açılan uygulama, bağlantı kopsa da yeniden açılır.

- **Üretim:** `vite.config.ts` → `tools/sw/sw-eklentisi.ts` derleme sonunda `dist/sw.js` yazar (bağımlılık yok).
  - **Önceden önbellek (~1,6 MB):** index.html, giriş betiği ve statik içe aktarımları, CSS, latin/latin-ext woff2
    yazı tipleri, simgeler, manifest.
  - **Çalışma anında:** diğer `/assets/` parçaları ve `/fonts/` (harita yazı tipi) ilk kullanımda saklanır.
    `main.tsx` açılıştan sonra araçları önceden yüklediği için hepsi çevrimdışı açılır.
  - **Asla saklanmaz:** `/data/`, `/api/`, `/download/`, `packs-manifest.json`, Range istekleri; .zim/.gguf/.pmtiles/
    .wasm/.tar/.apk; 3 MB'tan büyük ya da boyu bilinmeyen yanıtlar.
  - **Gezinme:** önce ağdan (4 sn sınır), sunucunun COOP/COEP başlıkları olduğu gibi gelir. Ağ yoksa önbellekteki
    index.html verilir; o da aynı başlıklarla saklandığı için `crossOriginIsolated` (Fener'in çok iş parçacıklı
    WebAssembly'si) çevrimdışı da korunur.
  - **Sürüm:** önbellek adı `akil-kabuk-<içerik özeti>`; yeni sürüm etkinleşince eskiler silinir.
- **Güncelleme akışı (güvenli olan):** yeni SW kendiliğinden devralmaz, bekler. Sayfanın altında küçük bir not çıkar:
  "Yeni sürüm hazır. [Yenile] [Sonra]". Yenile → yeni sürüme geçilir, sayfa yenilenir. Basılmazsa sekme kapanıp
  açılınca geçilir. Açık kalan ekran saatte bir yeni sürüm denetler.
- **Kayıt** (`src/sw-kayit.ts`, `main.tsx`): yalnız üretim derlemesi, yalnız güvenli bağlam (https ya da localhost).
  **Android uygulamasında (Capacitor) kaydedilmez**; eski bir kayıt varsa silinir.
- **CSP:** derleme ve sunucu CSP'sinde `worker-src 'self' blob:` zaten var. `server.mjs` `sw.js`'yi `no-cache` ile
  sunuyordu; sunucuda değişiklik gerekmedi.
- **Sınır:** tarayıcılar SW'yi yalnız güvenli bağlamda çalıştırır. Telefonlar bilgi noktasına
  `http://192.168.x.x:8080` ile girdiğinde SW yoktur. Orada önceki önlem (araç parçalarının önceden yüklenmesi,
  sayfa açık kaldıkça) geçerlidir. SW, bilgi noktasının kendi ekranında (`http://localhost:8080`, Pi kiosk) ve
  https kurulumlarda çalışır.
- **Testler:** `tests/sw.test.ts` (kurallar, önceden önbellek seçimi, sürüm, üretilen betiğin `vm` içinde çalışması),
  `e2e/sw-check.mjs`. e2e akışı: derleme kopyası `server.mjs` ile sunulur, ilk açılış, `context.setOffline(true)` ile
  yeniden yükleme, çevrimdışı araç, önbellekte `/data/`·`/api/` yok, yeni sürüm notu + Yenile, Capacitor taklidinde kayıt yok.

```
npm run build && node e2e/sw-check.mjs          # ya da: npx vite build --outDir /tmp/d && node e2e/sw-check.mjs /tmp/d
```
