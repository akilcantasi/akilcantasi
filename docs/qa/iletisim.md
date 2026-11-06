# QA: İletişim sekmesi

Kapsam: src/tabs/IletisimTab.tsx, src/iletisim/*, src/lib/mesh.ts, src/lib/mesh/*, server/server.mjs ve InfoPointServer.java içindeki pano bölümleri.

## Test edilenler
- [x] Tüm bölümler (`?comm=pano, iyiyim, kayip, duyuru, sos, mors, sms, baglan`) ve ana sayfa
- [x] Bilgi noktası var: Node sunucusu geçici veri klasöründe, iki tarayıcı bağlamı (A yazar, B görür; otomatik yenileme)
- [x] Profildeki "bilgi noktası adresi" ile farklı kökenden bağlanma (CORS)
- [x] Bilgi noktası yok: "bağlı değilsiniz" kartı, açıklamalar, giden kutusu, sayaç, boş durumlar
- [x] Oturum ortasında sunucu kapanır: kayıt giden kutusunda kalır, önbellekteki pano görünür, sayfa yenilense de bekler; sunucu aynı portta geri gelince kayıt gider, board.json yeniden yüklenir
- [x] Hız sınırı (429 + Retry-After): kullanıcıya açık mesaj, kayıt "gönderilmeyi bekliyor"
- [x] Uzun metin (600 karakter sınırı) ve Türkçe karakterler (Ç Ğ İ ı Ö Ş Ü) bozulmadan gidip geliyor; 360 px'te taşma yok
- [x] HTML düz metin olarak gösteriliyor; fazla boş satırlar sıkıştırılıyor
- [x] Kayıp → bulundu: onay/vazgeç, süzgeçler, ilan sahibinin adı korunuyor, sunucu bulundu → aranıyor geri dönüşünü reddediyor
- [x] Çevrimdışı kayıp ilanını bulundu işaretleme (giden kutusunda tek kayıt)
- [x] Taklit mesh eklentisi (iki telefon): ilan bilgi noktası olmadan ulaşıyor, "yakın cihazdan" etiketi, komşu sayısı, "bulundu" mesh'te yayılıyor, mesh kaydı sonra bilgi noktasına aktarılıyor
- [x] SOS: beyaz/kırmızı ekran yanıp sönüyor, bip sesi, Esc / dokunma / Durdur ile kapanma, sürekli ışık
- [x] Düdük (üç kısa ses, ~3 kHz), siren, bölümden çıkınca ses durması (taklit AudioContext)
- [x] Mors: Türkçe harf sadeleştirme, bilinmeyen karakter, metin↔Mors, ışık/ses oynatma, tam ekran
- [x] SMS: konumlu şablonlar, konum izni yok hatası, elle düzenleme, kopyalama, numara temizleme, 112 notu, iOS `&body=` biçimi
- [x] Android taklidi: fener SOS/sürekli/Mors ile yanıp sönüyor, flaş yoksa uyarı, seçenek kapalıyken yanmıyor, erişim noktası ayarları
- [x] Kalıcılık (profil, önbellek, giden kutusu) yeniden yüklemede
- [x] Yerleşim 360×640, 390×844, 1280×800: yatay taşma yok, dokunma hedefleri ≥ 44 px
- [x] Konsol hatası yok; `e2e/iletisim-check.mjs` ve `e2e/mesh-check.mjs` geçiyor

## Bulunan ve düzeltilen hatalar
1. **Mors: `·` / `−` / `|` ile yazılan kod oynatılmıyordu.** Çeviri doğruydu ama `morseToSteps` yalnızca `.` `-` `/` tanıyordu; ışık/ses düğmeleri hiçbir şey yapmıyordu. (morse.ts)
2. **Reddedilen kayıt "Gönderildi" diyordu.** Sunucu 4xx ile reddettiğinde kayıt giden kutusundan atılıyor ama kullanıcı başarı görüyordu. Artık hata mesajı gösteriliyor. (outbox.ts, client.ts)
3. **Hız sınırı / ağ kopması sessizdi.** Sonuç yalnızca "bağlanınca gönderilecek" diyordu, oysa bağlıydı. Artık nedeni yazıyor ("Çok sık gönderim…", "Bağlantı yok") ve hemen yeniden deneme planlanıyor. (client.ts, BoardSections.tsx)
4. **Mesh'te "bulundu" hiç yayılmıyordu.** Mesh kimliğe göre tekilleştirdiği için aynı kimlikli güncelleme atılıyordu; alıcı da bilinen kimlikleri yok sayıyordu. Güncelleme `_bulundu` ekli kimlikle gidiyor, alıcı asıl ilana bağlıyor; ilan sahibinin giden kutusundaki kopya da güncelleniyor. (board.ts, client.ts)
5. **Bulundu işaretleyenin adı ilanın sahibinin adının yerine geçiyordu** (çevrimdışı ve mesh yolunda). Artık ilan sahibinin adı korunuyor. (BoardSections.tsx)
6. **Mesh komşu sayısı geç güncelleniyordu** (15 sn'lik yoklamayı bekliyordu). Artık `onPeers` ile hemen güncelleniyor. (client.ts)
7. **SMS: şablon değişince elle düzenlenen metin bir kare boyunca kalıyordu** (useEffect ile sıfırlama). Düzenleme artık üretilen metne bağlı, eşzamanlı düşüyor. (OfflineTools.tsx)

Birim testleri tests/iletisim.test.ts dosyasına eklendi ("QA düzeltmeleri").

## Kalan konular
- InfoPointServer.java derlenip çalıştırılmadı (bu ortamda Android yok). Kod okundu: pano kuralları Node sunucusuyla aynı. Mesh "bulundu" düzeltmesi yalnızca istemcide.
- Mesh'le gelen "bulundu" kaydı bilgi noktasına ilk kez aktarılırsa sunucu onu doğrudan "bulundu" durumunda oluşturuyor. Bu beklenen davranış.
- Gerçek ses/flaş/tam ekran yalnızca taklitlerle denendi; cihazda elle denenmeli.
- Paylaşılan makinede yük yüksek olduğu için e2e zaman aşımları cömert tutuldu.

## E2E komutu
```
node e2e/qa-iletisim.mjs http://localhost:5199/ /tmp/qa-iletisim
node e2e/iletisim-check.mjs
node e2e/mesh-check.mjs
```

## Denetim 2026-11

Kapsam: İletişim sekmesi (pano, hızlı SMS, SMS giden kutusu, yakınlar, SOS/Mors, bağlantı, bilgi noktası kartı) ve Araçlar'daki enkaz modu / enkaz arama. Android eklentileri `page.addInitScript` ile taklit edildi; 360×640, 390×844, 1280×800, Android "büyük yazı" (yazı boyutları ×1,3) ve güvenli alan (`--safe-area-inset-top/bottom`) ile bakıldı.

### Denetlenenler
- [x] Pano: gönder, süz, kayıp ilanı → bulundu, durum bildirimi, giden kutusu, yeniden deneme, hız sınırı (qa-iletisim)
- [x] Hızlı SMS: 112 tek dokunuş, 3 sn içinde vazgeç, kuyruk, şebeke yok (yeniden deneme), SMS izni yok → SMS uygulaması (sms-kutusu-check, hizli-sms-check)
- [x] Yakınlar: ekleme, aynı numara, boş/geçersiz numara, en çok 8 kişi, kalıcılık
- [x] Mesh durumu, bilgi noktası başlat/durdur/QR/adres/bağlı cihaz sayısı (mesh-check, native-infopoint-check)
- [x] Mors, SOS ışık/ses, düdük/siren
- [x] Enkaz modu: Bluetooth kapalı → aç, izin yok → izin ver, yeniden başlatmadan durum güncellemesi, "Şimdi ses çal", işaret kodu AK-XXXXXX, SMS bağlantısı, hazır yanıtlar, son konum, arka plan konum kaydı (varsayılan kapalı), bildirimden açılış
- [x] Enkaz arama: Bluetooth kapalı/izin yok, sinyal izi (yaklaşıyor/uzaklaşıyor), hazır mesaj → ulaştı, kişinin yanıtı, 112 bildirimi
- [x] Düğme etiketleri: "iki düğme de 112 diyor" şikâyeti

### Düzeltilenler
1. **Enkaz arama: telefondan telefona mesaj ile 112 düğmeleri karışıyordu** ("iki düğme de 112 diyor"). Hazır mesajların hemen altında "112'ye SMS ile bildir" ve "112'yi ara" duruyordu; kullanıcı bunları enkazdaki telefona mesaj sanıyordu. Artık iki ayrı bölüm var: "Enkazdaki telefona mesaj" (Bluetooth, şebekesiz) ve "Bu işareti bildirin (şebeke gerekir)": "112'ye SMS gönder", "112'yi telefonla ara", "Başka numaraya SMS". Bip düğmesi göstergeye taşındı ("Yaklaştıkça sıklaşan bip sesi"). Mesaj bölümü tanımsız `.col` sınıfı yüzünden flex değildi; düzeltildi. (enkaz-arama/index.tsx)
2. **Enkaz modu: "Bluetooth'u aç" / "İzin ver" sonrası ekran güncellenmiyordu.** Arayüz yalnız yerel olaya güveniyordu. Artık düğmeden sonra durum hemen ve 1,2 sn sonra yeniden okunuyor. Ayrıca olay birleştirmede servis alanları (reklam, sonSes…) servis yokken eski haliyle kalıyordu; artık olayda olmayan servis alanları siliniyor. (enkaz/index.tsx)
3. **"Şimdi ses çal" basınca tepki yoktu** (servis olayı gecikince). Düğme dokunur dokunmaz "Çalıyor…" olur ve durum yenilenir. (enkaz/index.tsx)
4. **SMS izni yokken enkaz modu başlatılınca 112 ve yakınlara SMS sessizce gitmiyordu.** Artık SMS uygulaması gitmeyen numaralarla hazır açılıyor. (enkaz/index.tsx)
5. **Enkaz arama: Bluetooth kapalı / izin yok hatasında yalnız "Yeniden dene" vardı.** Düğme artık "Bluetooth'u aç" ya da "İzin ver" diyor ve ardından taramayı başlatıyor. Ayarlardan dönünce (izin verildiyse) ve Bluetooth bildirim panelinden açılınca tarama kendiliğinden başlıyor; izin penceresi döngüye girmesin diye ayarlardan dönüşte önce `durum().izinler` okunuyor. (enkaz-arama/index.tsx)
6. **Kurtarma kayıtları tek dokunuşla siliniyordu** ("Son 72 saatte duyulanlar → Temizle", enkaz modundaki "Kayıtları sil"). Satır içi onay eklendi.
7. **Kırmızı kullanımı (Şafak):** enkaz modunu kapatma düğmesi, "Uzaklaşıyorsunuz" yazısı ve zayıf sinyal çubuğu kırmızıydı; tehlike değil. Kapatma düğmesi sakin çerçeve + kehribar dolum, uzaklaşma ve zayıf sinyal kehribar oldu. Kırmızı yalnız SOS/112 denetimlerinde, ağır yaralı yanıtlarında ve hatalarda kaldı.
8. **İletişim ana ekranı: kart ok işareti (›) 12,5 px'e eziliyordu** (`.cm-card span` kuralı). SVG ok, 20 px. (IletisimTab.tsx, common.tsx)
9. **SOS anahtarları açıkken yeşildi**, uygulamanın diğer anahtarları kehribar. Kehribar yapıldı. (common.tsx)
10. **İyiyim bildirimi:** ad yokken gönder düğmesi pasif ama nedeni yazmıyordu; ipucu eklendi. Kayıtlı yakınlar varken "SMS göndermek için numara girin" diyordu; "Yakınlarıma SMS (n)" düğmesi eklendi. (BoardSections.tsx)
11. **Bağlan bölümü** ana ekranda "yakın cihaz ağı"nı vaat ediyordu ama bölümde bilgi yoktu; durum kartı eklendi (açık · n cihaz / açılıyor / yalnız Android). (BoardSections.tsx)
12. **Yakınlarım notu Android'de yanlıştı** ("SMS uygulamasında açılır"); Android'de uygulama kendisi gönderiyor. Nota göre değişiyor. (HizliSms.tsx)
13. SMS bölümünün başlığı ana ekrandaki kartla uyumlu: "Ayrıntılı SMS". (OfflineTools.tsx)
14. **Bilgi noktası kartı:** durum yoklaması sürerken yenileme gelirse ikinci bir zamanlayıcı zinciri başlıyordu (yoklama katlanıyordu); nesil sayacı eklendi. Başlat/durdur sürerken ikinci dokunuş engellendi. (PaylasTab.tsx)
15. Test kararlılığı: qa-iletisim'deki SOS bip denetimi yük altında yarışa giriyordu; bekleme eklendi.

### Kalanlar
- Yerel taraf (Bluetooth, ses, SMS gönderici) yalnız taklitle denendi; gerçek cihazda bakılmalı.
- Enkaz bölümünde "!" (Bluetooth kapalı) simgesi kırmızı kaldı: işaret yayılmıyor, gerçek tehlike sayıldı.
- Profildeki tek "Aile / yakın numarası" alanı ile Yakınlarım listesi hâlâ iki ayrı kayıt (özellik korunarak İyiyim'e yakınlar düğmesi eklendi). İleride tek listeye taşınabilir.

### E2E
```
node e2e/enkaz-check.mjs            # 23 adım (9'u yeni: durum güncellemesi, ses, SMS izni, arama etiketleri, silme onayı)
node e2e/qa-iletisim.mjs            # "Denetim 2026-11" bölümü eklendi
node e2e/hizli-sms-check.mjs ; node e2e/sms-kutusu-check.mjs ; node e2e/iletisim-check.mjs
node e2e/mesh-check.mjs ; node e2e/native-infopoint-check.mjs ; node e2e/konum-arama-check.mjs
```

## Öneriler turu 2026-11: imzalı kayıtlar ve kayıp ilanı sahipliği

### Ne değişti
- **Cihaz kimliği.** Her cihaz bir kez Ed25519 anahtar çifti üretir (`src/iletisim/imza.ts`, `ac.comm.kimlik`). Yeni pano kayıtları `pub`, `sig`, `ts` alanlarıyla imzalanır. Kanonik biçim tek dosyada: `server/imza-kanonik.mjs` (istemci ve sunucu ortak).
- **Kayıp ilanı sahipliği.** "Bulundu" ve yeniden "aranıyor" ayrı, imzalı bir güncellemedir (`upd: {st, ts, sig}`), ilanı veren cihazın anahtarıyla. "Bulundu olarak işaretle" ve "Yeniden “aranıyor” yap" düğmeleri yalnız ilan sahibinde görünür; diğerleri "Durumunu yalnızca ilanı veren telefon (ad) değiştirebilir" notunu görür.
- **Node bilgi noktası** imzasız ya da yanlış imzalı durum değişikliğini 403 ve Türkçe hatayla reddeder; bozuk imzalı yeni kaydı da reddeder. Eski (imzasız) ilanlarda eski davranış sürer: herkes "bulundu" diyebilir.
- **Android bilgi noktası** (InfoPointServer.java) Ed25519'u platformdan kullanır (Android 13 / API 33+); yoksa güncellemeyi biçim ve zaman denetimiyle saklayıp aktarır (gelecekteki zaman ≤ 24 sa). Her durumda istemci doğrular: tutmayan güncelleme yok sayılır, ilan "Aranıyor" kalır ve "doğrulanamadı" yazar. Java ilanın kendi imzasını doğrulamaz (kanonik JSON'u birebir kurmak gerekirdi); bunu istemciler yapar.
- **Arayüz.** Geçerli imza: küçük, sakin "✓ doğrulandı". İmzası tutmayan: kehribar "doğrulanamadı" ve açıklama (kırmızı değil). İmzasız eski kayıt: değişiklik yok.
- **Bilgi noktası imzası.** Node bilgi noktası kendi anahtarını `data/.bilgi-noktasi-anahtari.json` dosyasında tutar (gizli dosya, `/data/` altından sunulmaz), `local` kayıtları `bpub`/`bsig` ile imzalar ve `/api/status` yanıtında `pub` verir. İstemci anahtarı adres başına ilk görüşte sabitler (TOFU, `ac.comm.bnpin`); imza tutar ve anahtar sabitse "bu bilgi noktasından" etiketi çıkar. Anahtar değişirse etiket yerine "doğrulanamadı" ve bağlantı kartında uyarı; Bağlan ekranında "Yeni anahtarı kabul et".
- **Mesh.** İmza alanları mesh çerçevelerinde taşınır (docs/MESH.md › İmzalı kayıtlar).
- **Geriye uyum.** İmzasız board.json, önbellek ve giden kutusu kayıtları aynen yüklenir ve gösterilir.

### Doğrulama
- `npx vitest run tests/imza.test.ts tests/server.test.ts tests/mesh.test.ts tests/iletisim.test.ts`
- `sh tools/pano-sinama/calistir.sh` (Java pano kuralları; Node'da üretilen imzanın Java'da doğrulanması; Ed25519 yokken sakla-ve-aktar)
- `node e2e/iletisim-check.mjs` (sahibi "bulundu" yapar; ikinci bağlamda düğme yok, sahte POST 403; bilgi noktası anahtarı sabitleme ve değişim uyarısı)
- `node e2e/qa-iletisim.mjs http://localhost:5199/` (sahibi bulundu → aranıyor → bulundu; mesh'te imzalı güncelleme ve sahte güncellemenin yok sayılması; mesh köprüsü)

### Bilinen sınırlamalar
- Anahtar telefonda saklanır; uygulama verisi silinirse eski ilanların durumu değiştirilemez (yeni ilan verilebilir).
- Kimlik kapma: bir ilanın kimliği, aslı bir bilgi noktasına ulaşmadan başka anahtarla oraya gönderilirse o bilgi noktasında ilk gelen kazanır. İstemci bir kaydın anahtarını ilk gördüğü haliyle tutar.
- Eski sürümlü bir telefondan (mesh) geçen kayıt imzasını kaybeder ve "imzasız" görünür.
- Android 13 öncesi bilgi noktasında sahte durum güncellemesi sunucuda saklanabilir; istemciler yok sayar ve ilanı "Aranıyor" gösterir.
- Android bilgi noktası kendi duyurularını imzalamaz (eski "bilgi noktasından" etiketi sürer).
