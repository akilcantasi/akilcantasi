# QA — Android (yerel taraf)

Kapsam: `android/**` (`android/app/src/main/cpp/llama.cpp/` hariç), `capacitor.config.ts`,
`.github/workflows/apk.yml`, `tools/enkaz-sinama/**`, `tools/indirici-sinama/**`,
`tools/fener-sinama/**`, `docs/ENKAZ.md`, `docs/MESH.md`.

Önceki turlar: `docs/qa/platform.md` (Android yapılandırması, bilgi noktası), ardından
sertleştirme turu (InfoPointServer anahtarı/LAN süzgeci/bağlantı sınırları, PaketIndirici https +
alan listesi, SMS sınırları, `/_paket/` yalnız localhost, Guncelleyici denetimleri,
`allowBackup=false`).

## Denetim 2026-11

Bu makinede Android SDK yok; gradle derlemesi yapılamadı. Doğrulama: üç Java sınama düzeneği
(taklit sınıflarla `javac` + çalıştırma), tüm Java dosyalarının JDK derleyici arayüzüyle
ayrıştırılması ve Android sınıfları olmadan tür denetimi (yalnız "Android simgesi bulunamadı"
türü hatalar kaldı; kendi sınıflarımıza ait hiçbir hata yok). Asıl derleme CI'da yapılacak.
Kullanılan tüm API'ler minSdk 24'te var (yeni API'ler sürüm denetimli).

### Denetlenenler

- [x] **Manifest.** Dışa açık bileşenler: yalnız `MainActivity` (MAIN/LAUNCHER, veri/derin bağlantı
  süzgeci yok) ve `AcilisAlici` (yalnız korumalı `BOOT_COMPLETED` / `MY_PACKAGE_REPLACED`; başka
  uygulama bu eylemleri gönderemez, gönderse de yalnız zaten açık olanları sürdürür). Servisler,
  `SmsAlici`, `Guncelleyici$Sonuc`, `EnkazTarayici$Alici`, FileProvider dışa kapalı.
- [x] **Çalışırken kaydedilen alıcı:** tek alıcı `EnkazServisi.btAlici`
  (`BluetoothAdapter.ACTION_STATE_CHANGED`). Bu korumalı bir sistem yayını: Android 14 bayrak
  kuralının dışında, başka uygulama gönderemez. Değiştirilmedi (`RECEIVER_NOT_EXPORTED`, yayını
  Bluetooth sürecinden alamama riski taşıyor).
- [x] **PendingIntent'ler:** bildirim/eylem niyetleri `FLAG_IMMUTABLE`. Değiştirilebilir olanlar
  (SMS gönderildi/teslim, arka plan BLE taraması, PackageInstaller sonucu) sistem ek bilgi
  yazdığı için zorunlu; hepsi açık bileşenli (başka yere yönlendirilemez).
- [x] **FileProvider:** yalnız `cache/share/` (APK paylaşım kopyası). Dar.
- [x] **Açık metin:** `usesCleartextTraffic=true` WebView'ın aynı ağdaki http bilgi noktalarına
  bağlanması için gerekli. Java tarafında açık metin kullanan yok (indirici ve güncelleyici
  yalnız https). Ağ güvenliği yapılandırması IP aralığı tanımlayamadığı için daraltılamıyor.
- [x] **İzinler:** bildirilen her izin kullanılıyor (konum, BT, NEARBY_WIFI, SEND_SMS, ön plan
  servis türleri, REQUEST_INSTALL_PACKAGES, UPDATE_PACKAGES_WITHOUT_USER_ACTION, pil muafiyeti,
  titreşim…). Eksik izin bulunmadı. Uygulama SMS **okumaz** (RECEIVE_SMS yok).
- [x] **Derin bağlantı / `ac_arac`:** `[a-z-]{1,24}` denetimi, JS yalnız `enkaz` ve
  `enkaz-arama`'ya gider. Capacitor niyet verisini (`getIntentUri`) saklar ama WebView'ı oraya
  yönlendirmez (`@capacitor/app` yok). Başka uygulama WebView'da adres açtıramaz.
- [x] **WebView / Capacitor:** başka adrese gidiş Capacitor'ün `launchIntent`'iyle dış tarayıcıda
  açılır (`allowNavigation` yok). Yayın derlemesinde WebView hata ayıklaması kapalı (yalnız
  debuggable derlemede açık). `targetSdk 36` → `allowFileAccess` varsayılan kapalı.
  `allowMixedContent: true` gerekli (https://localhost'tan http bilgi noktasına fetch);
  CSP `script-src 'self'` olduğu için http betiği yüklenemez. Yanıltıcı açıklama düzeltildi.
- [x] **Her @PluginMethod:** Capacitor, eklenti yönteminden sızan istisnayı yeniden fırlatıp
  uygulamayı çökertir (`Bridge.callPluginMethod`); bu yüzden tüm yöntemler tek tek okundu.
  Çökme yolu bulunmadı: sayılar `getInt/getDouble` ile (tür tutmazsa varsayılan), dosya adları
  `isPackName`, sayfa adresleri `izinliAdres`, SMS `smsSiniri`, harita etiketi `Uri.encode`,
  yeni iş parçacıkları kendi istisnalarını yakalıyor. Bir yol açığı bulundu (aşağıda 2).
- [x] **AkilMeshPlugin:** yük boyutu sınırlı; JSON çözümü JS'te (`decodeFrame`, sınırlı);
  sel ve komşu adı için düzeltme (aşağıda 3). Komşu adları arayüzde zaten gösterilmiyor (yalnız sayı).
- [x] **SmsAlici:** gelen SMS işlemez; yalnız sistemin gönderim/teslim sonuçları ve yeniden deneme
  alarmı (dışa kapalı, `BROADCAST_SMS` gerekmez). Teslim raporu PDU'su `try` içinde çözülüyor.
- [x] **SmsKuyrugu / SmsGonderici:** kalıcı yazma geçici dosya + yeniden adlandırma (yarım yazım
  olmaz). `isle` eşzamanlı çağrılara karşı `synchronized`. Kopya gönderim yalnız iki durumda:
  3 dakika içinde "gönderildi" sonucu gelmezse ve çok parçalı mesajın bir parçası geçici hata
  verirse (Android tek parçayı yeniden göndertmiyor). Acil mesaj için bilerek "kaybolmasın,
  gerekirse iki kez gitsin". `tools/sms-sinama` geçiyor.
- [x] **EnkazIsareti.hamdanAyikla:** sınırlar doğru (yapı `ham[i..i+uz]` içinde olmalı, kesik
  veri sınaması var). `coz` uzunluğu, sürümü, enlem/boylam aralığını denetliyor.
- [x] **fener_jni.cpp:** yol `isPackName`'den geçiyor; `token_to_piece` taşmada büyük arabellekle
  yeniden; `max_tokens` bağlamla sınırlı (`pos + 1 >= n_ctx`); istem bağlamı aşarsa hata; yarım
  UTF-8 karakter bekletiliyor; `durdur` silinmiş motora dokunmuyor (`g_live`), `sohbet` ve
  `bosalt` tek iş parçacığında sırayla. `tools/fener-sinama` gerçek Qwen 0.5B ile geçti.
- [x] **İş parçacıkları:** PaketIndirici `start` kilit tutarken eski işi bekliyor ama `onChange`
  kullanılmadığı için kilitlenme yok. Enkaz servisi durumu ana iş parçacığında.
- [x] **Kaynaklar:** uyanıklık kilitleri (indirme 12 sa sınırlı; bilgi noktası 6 sa sınırlı;
  enkaz modu ve uyandıran ivmeölçeri olmayan sarsıntı nöbeti bilerek süresiz, servis kapanınca
  bırakılıyor), AudioTrack `finally` ile bırakılıyor, konum dinleyicileri `finally`'de kaldırılıyor,
  BLE tarama/yayın servis ve eklenti kapanınca duruyor, kurtarıcı mesajı yayını 3 dk sonra duruyor.
- [x] **Android 14/15 ön plan servisleri:** türler ve izinleri bildirilmiş; enkaz modu açılışta
  izin verilmeyen türü (konum, medya) azaltarak deniyor; indirme `onTimeout`'ta kapanıyor
  (dataSync 6 sa); `dataSync`/`mediaPlayback` açılış alıcısından başlatılmıyor.
- [x] **Bildirim izni (API 33+):** enkaz, indirme, SMS akışlarında isteniyor; sarsıntı nöbeti
  bildirim kapalıysa açılmıyor (soru görünmezse iptal edilemez).
- [x] **Bluetooth/konum kapalı, izin yok:** durum metni dönüyor; enkaz servisi 15 sn'de bir yeniden
  deniyor ve Bluetooth açılınca hemen başlıyor.
- [x] **apk.yml:** girdiler kabuğa doğrudan yazılmıyor (`SURUM_GIRDI` denetimli, `yayinla` yalnız
  `if:` ifadesinde); gizli değişkenler yalnız ortamdan. Hata ayıklama anahtarı sorunu düzeltildi
  (aşağıda 1).
- [x] **Önceki turun sertleştirmeleri yeniden okundu** (InfoPointServer, PaketIndirici, SMS
  sınırları, MainActivity, KonumKaydi, Guncelleyici). Hata bulunmadı; yalnız PaketIndirici'nin
  https + alan listesi değişikliği `tools/indirici-sinama`'yı bozmuştu (aşağıda 8).

### Düzeltilenler

1. **[güvenlik-orta] `apk.yml`: imza anahtarı yoksa hata ayıklama anahtarıyla imzalı APK
   yayınlanıyordu.** Artık "İmza anahtarı" adımı, yayınlanacak bir çalıştırmada (etiket ya da
   `yayinla` ≠ hayir) `APK_KEYSTORE_B64` yoksa ya da parola eksikse / çözülemiyorsa işi durduruyor.
   Sürüm sayfası adımında ikinci güvence: anahtar yoksa ya da `apksigner` sertifikası
   `CN=Android Debug` ise yayınlamıyor. `yayinla=hayir` hâlâ geçici anahtarla derleyip iş çıktısı
   olarak saklıyor. `apksigner` birden çok build-tools sürümünde yanlış çağrılıyordu (glob); en
   yeni sürüm seçiliyor. Doğrulama: YAML ayrıştırma + her `run` için `bash -n`.
2. **[güvenlik-orta] `PaketIndirici.cancel`: dosya adı denetlenmiyordu.** `paketIptal({file:
   "../x"})` paket klasörü dışındaki `x.part` / `x.durum` dosyalarını silebiliyordu. Artık
   `isPackName` dışı adlar yok sayılıyor. Sınama: `tools/indirici-sinama` ("'../' ile paket
   klasörü dışındaki dosya silinmez").
3. **[güvenlik-orta] Mesh: kimlik doğrulamasız komşu çerçeve yağdırıp arayüzü kilitleyebiliyordu.**
   `MeshPeer.jetonAl`: komşu başına jeton kovası (bir anda 120, sonra saniyede 20 çerçeve; tam
   eşitleme ~30 çerçeve). Aşan çerçeve JS'e gitmeden atılıyor; listede olmayan uç noktanın yükü
   atılıyor. Komşunun reklam adı temizleniyor (düğüm kimliği biçimi, denetim/biçim karakterleri,
   40 karakter, vekil çifti bölünmez). Sınama: `tools/enkaz-sinama` (mesh bölümü, 11 madde).
4. **[güvenlik-orta] Enkaz işareti etiketi temizlenmeden bildirim başlığına giriyordu.** Sahte
   işaret yön çevirme (U+202E) ya da denetim karakterleriyle bildirimi yanıltabilirdi; genişletilmiş
   reklamla 200+ baytlık etiket gelebilirdi. `EnkazIsareti.etiketCoz` artık bu karakterleri atıyor,
   40 karakterle sınırlıyor. Sınama: `tools/enkaz-sinama`.
5. **[hata] Uydu durumlu konum araması uygulama arka plandayken de saniyede bir GPS
   kullanıyordu.** Harita sekmesi açık kalınca JS durdurmuyordu; "her zaman" konum izni verilmişse
   ya da Android 7'de pil bitiyordu. `AkilCantasiPlugin.handleOnPause` aramayı duraklatıyor,
   `handleOnResume` sürdürüyor; JS'in `konumIzleDurdur`'u bunu iptal ediyor. (`KonumIzleyici`
   istenen durumu hemen tutuyor, ana iş parçacığı sırası beklenmiyor.) İz kaydı (WebView
   konumu) etkilenmiyor.
6. **[hata] Fener GPU'su yanlışlıkla kalıcı kapanabiliyordu.** "GPU deneniyor" işareti model
   yüklendiği andan ilk cevaba kadar duruyordu; arada Android süreci arka planda kapatırsa (büyük
   model yüklüyken sık) sonraki açılışta çökme sayılıp GPU kalıcı kapanıyordu (geri açma yolu
   yok). Artık işaret yalnız GPU kodu çalışırken (yükleme ve ilk cevap) duruyor. Çökme koruması aynı.
7. **[hata] Boyutu yaklaşık bilinen paket telefon belleğini sıfıra kadar doldurabiliyordu.** JS
   yaklaşık boyutu yerel indiriciye vermiyor; yer denetimi yalnız boyut verilince yapılıyordu.
   Artık kaynak ölçülüp gerçek boyut öğrenilince de denetleniyor ve en az 64 MB boş bırakılıyor
   (SMS kuyruğu, konum kaydı yazılabilsin). Sınama: `tools/indirici-sinama` (5. bölüm).
8. **[hata] `tools/indirici-sinama` geçmiyordu** (önceki turun https + alan listesi değişikliğinden
   sonra düz http yerel sunucu reddediliyordu). Düzenek artık HTTPS sunucu, kendinden imzalı
   sertifika ve hosts dosyasıyla `akilcantasi.com`'u 127.0.0.1'e yönlendiriyor (gerçek siteye
   bağlanmaz, vekil kapalı). Alan listesi, düz http, IP, `file:` ve benzer alan adı denemeleri eklendi.
9. **[tasarım] `capacitor.config.ts`:** `allowMixedContent` açıklaması yanlıştı (dosya içe aktarma
   değil, LAN bilgi noktası fetch'i); düzeltildi. Davranış aynı.

Belgeler: `docs/MESH.md` (yük sınırı, ad temizliği), `docs/ENKAZ.md` (etiket temizliği, kimlik
doğrulama olmadığı, sınamalar).

### Bilinen açık konu: Android 7–10'da paketlerin değiştirilebilmesi

`PaketIndirici.packsDir` = `getExternalFilesDir("packs")` →
`Android/data/org.akilcantasi.app/files/packs` (uygulamaya özel dış depo; yoksa iç depo).

- **Android 11+ (API 30+):** başka uygulamalar `Android/data`'ya erişemez (tüm dosyalara erişim
  izniyle bile). Sorun yok.
- **Android 7–9 (API 24–28):** depolama izni (`WRITE_EXTERNAL_STORAGE`) olan her uygulama bu
  klasörü okuyup **değiştirebilir**. **Android 10:** eski depolama kipindeki (legacy) uygulamalar da.
- Etki: SHA-256 yalnız indirme sırasında denetleniyor, açılışta değil. Değiştirilmiş GGUF yerel
  llama.cpp ayrıştırıcısına ve Jinja şablon yorumlayıcısına (süreç içi yerel kod; uygulamanın SMS,
  konum izinleriyle) gider; ZIM/PMTiles/GeoJSON/JSON yanıltıcı içerik ya da çökme olabilir;
  `.durum` dosyasıyla yarım indirmenin adresi değiştirilebilir (yine yalnız izinli alanlar).
- Taşıma yapılmadı (kullanıcıların indirdiği paketler kaybolurdu). Öneriler: (a) indirme bitince
  boyut + değiştirilme zamanı + ilk/son 1 MB'ın SHA-256'sı iç depoya (SharedPreferences)
  yazılıp GGUF yüklenmeden önce karşılaştırılması; (b) API ≤ 29'da yalnız **yeni** indirilen
  GGUF'ların iç depoya konması (eskiler yerinde kalır).

### Kalan / başka kapsam

- **Alan listesi zayıf bir sınır:** `github.com` ve `huggingface.co`'ya herkes dosya koyabilir.
  Sayfaya sızan bir betik izinli alandan kendi dosyasını indirtebilir (SHA-256'yı da kendisi
  verir). Gerçek çözüm imzalı paket kataloğu (aşağıda öneri).
- **Sahte kurtarıcı mesajı:** BLE imzasız; işaret kimliği herkese açık. Sürekli farklı numarayla
  mesaj yayan biri enkazdaki telefonu titretip konuşturarak pilini tüketebilir. Kurulumsuz
  çalışma için bilerek imzasız; uyarı sıklığı sınırı öneri olarak bırakıldı.
- **Kurtarıcı taraması** (`EnkazTarayici.aramaBaslat`, LOW_LATENCY) uygulama arka plandayken de
  sürüyor; duyulanlar kaydedildiği için bilerek dokunulmadı.
- `fener_jni.cpp`: model açıklaması (`llama_model_desc`) geçersiz UTF-8 içerirse `NewStringUTF`
  yalnız CheckJNI açık (hata ayıklama) derlemede durdurur; yayın derlemesinde sorun değil.
- `EnkazServisi.mesajDuyur`: servis 900 ms içinde kapanırsa `ToneGenerator` bırakılmıyor (çok küçük).
- `android/app/src/main/assets/capacitor.config.json` eski (`backgroundColor` #0B0E13); `npx cap
  sync` (CI'da var) yeniden üretir.
- `WIFI_MODE_FULL_HIGH_PERF` Android 14'te işlevsiz (bilgi noktası Wi-Fi kilidi); erişim noktası
  telefonun kendisiyse etkisi yok.
- `apk.yml`: üçüncü taraf eylemler etiketle (`@v4`), OpenCL depoları sabitlenmeden klonlanıyor
  (tedarik zinciri). Sabitlemek için doğru etiket/SHA'yı ağdan doğrulamak gerekir; yapılmadı.

### Komutlar ve sonuçlar

```
sh tools/enkaz-sinama/calistir.sh        # Hepsi geçti (işaret, etiket, sarsıntı, mesh)
sh tools/indirici-sinama/calistir.sh     # TÜMÜ OK (HTTPS, alan listesi, yol, yer denetimi)
sh tools/fener-sinama/calistir.sh /tmp/llama.cpp <qwen2.5-0.5b-instruct-q4_k_m.gguf>   # hepsi geçti
sh tools/sms-sinama/calistir.sh          # hepsi geçti (değiştirilmedi)
npx tsc --noEmit                          # temiz
npx vitest run tests/kisisel-bilgi.test.ts
```
