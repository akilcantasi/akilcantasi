# Bağımsız doğrulama: enerji-aa

Tarih: 2026-11-07. Dosya: src/content/guides/enerji.ts. Kategori: "Enerji ve şarj" (yeni).
Rehberler (temel): enerji-sarj-yollari, enerji-telefon-tasarruf, enerji-powerbank, enerji-arac, enerji-gunes, enerji-kurmali, enerji-kalem-pil, enerji-laptop-ups, enerji-jenerator, enerji-sarj-noktasi, enerji-sarj-hatalari, enerji-hazirlik.
Rehberler (kendin yap, etiket "KENDİN YAP"): enerji-ky-aku-usb, enerji-ky-gunes-usb, enerji-ky-bisiklet, enerji-ky-ruzgar-su, enerji-ky-termoelektrik, enerji-ky-18650, enerji-ky-efsaneler, enerji-ky-komsu.

WebSearch ve WebFetch kullanıldı.
Erişilebilen kaynaklar: CPSC (Safety Alert 5123 "Portable Generator Hazards", 2021 fırtına bülteni, "Carbon Monoxide from Generators Can Kill in Minutes" başlığı, blk_media_portgen), ABD Enerji Bakanlığı "Keeping Mobile Devices Charged", AAA "Silent battery drains", Argonne Ulusal Laboratuvarı rölanti çizelgesi, Anker (blog ve destek), Avustralya ACCC power bank rehberi, New York DHSES lityum pil rehberi, Singapur CPSO, Apple (pil sıcaklığı sayfası; pirinç uyarısı PetaPixel alıntısı), Samsung Wireless PowerShare, APC Back-UPS SSS, Eton FRX3 ürün sayfası, Survivor kurmalı radyo kılavuzu, Busch & Müller E-Werk, Seeed Studio dinamo ölçümü, Hokkaido Wilds dinamo devresi, TI LM2596 veri sayfası, BioLite (EEPower), SP1848 TEG satıcı verisi, DW01A teknik özeti, Practical Sailor (BCI voltaj tablosu), EnerSys akü kılavuzu, Illinois Üniversitesi "Ask the Van", Marco Arment ve Joe Wein AA pil testleri, BudgetLightForum panel ölçümü, REI solar rehberi, Turkcell afet sayfası, Habertürk ve Para Dergi (operatörler, Şubat 2023), BirGün (Hatay çadır kent elektriği), ANKA (İzmir mobil şarj araçları), İstiklal (AFAD çanta listesi alıntısı).
Erişilemeyenler: FCC/FEMA ipuçları sayfası (istemci hatası), teknoblog (istemci hatası), Energizer E91 veri sayfasındaki grafik değerleri (metin olarak okunamadı).
AFAD ve Kızılay'ın kendi sitelerinde "mobil şarj istasyonu" duyurusu bulunamadı.

## Sayıların dayanağı
- Powerbank: Anker — hücre 3,7 V, USB 5 V; yükseltici %85–90 verimli; 10 000 mAh'lik powerbankın kullanılabilir karşılığı ~6 000–6 500 mAh. Rehberde "%60–70" ve "× 0,65". Watt-saat: 10 000 × 3,7 ÷ 1 000 = 37 Wh; × 0,6–0,7 = 22–26 Wh. Telefon pili ~12–20 Wh (3 300–5 000 mAh × ~3,85 V).
  - Görev "10 000 mAh ≈ 2 tam şarj" diyordu. Bu yalnızca ~3 000 mAh'lik telefonda doğru. 4 000 mAh için ~1,5 yazıldı (daha korumacı).
- Powerbank saklama: Anker destek "en az 3–4 ayda bir boşalt-doldur". Rehberde "3 ayda bir".
- Rölanti yakıtı: Argonne — 1 L motor 0,16, 2 L motor 0,32 galon/saat (≈0,6–1,2 L/saat). Rehberde "küçük araç saatte yaklaşık 1 litre".
- Akü voltajı: BCI (Practical Sailor) — dinlenmiş 12,6 V+ dolu, 12,2 V %50. Rehberde "12,2 V'ta bırakın".
- Jeneratör: CPSC — evden en az 20 ft (≈6 m), açık kapı/pencere yetmez, tente altında kuru zemin, dış mekân tipi kalın kablo, kablo gücü toplam yükten büyük, soğuyunca yakıt, prize bağlama (backfeed) yasağı, pilli CO alarmı; "dakikalar içinde öldürebilir" CPSC bülten başlığı.
- Güneş paneli: BudgetLightForum ölçümü — "20 W" panel tam güneşte ~4,9 V × 1,55 A ≈ 7,5 W, yarı saydam örtü altında 0,06 A. REI — güneşe dik açı, sık çevirme, önce powerbank, "garanti değil".
- Kurmalı radyo: Survivor kılavuzu — dakikada 100–120 tur, 1 dk kurma ≈ 5–6 dk radyo, telefona tam şarj garantisi yok. Eton FRX3 — 1–2 dk kurma "birkaç dakika" radyo/ışık. NBC'deki "1 dk = 40 dk konuşma" iddiası yazarınca doğrulanmamış; kullanılmadı.
- Kalem pil: Marco Arment testi — 4 alkalin AA ≈ 0,70, 4 NiMH AA ≈ 1,21 kez "%20→%100" dolum (~1,4 Ah iPhone 4). ≈3 Wh → bugünkü 12–20 Wh telefonda ~%15–25. Joe Wein: alkalin yüksek akımda kapasitesinin ~¼'ünü verir.
- Bisiklet dinamosu: Seeed — 6 V 3 W dinamo 5 km/s 0,56 W, 15 km/s 1,89 W, 30 km/s 4,09 W. B&M E-Werk ~8 km/s'ten itibaren şarj. Hokkaido Wilds ~%1/km (Xperia Z). Rehberde "1 saat ≈ %10–20".
- TEG: BioLite — USB sürekli 2 W (tepe 4 W); 20 dk şarj ≈ 60 dk konuşma. SP1848 — en yüksek 150 °C; ΔT 100 °C'de boşta ~4,8 V. Satıcı akım değerleri çelişkili; watt verilmedi.
- LM2596: TI — giriş 40 V'a kadar, 3 A, ayarlı 1,2–37 V, 12→5 V %80 verim. "10 W panel ≈ 5 Wh/saat": gerçek ~6–7 W × %80.
- Limon: Illinois — limon pili ~1 mA; telefon şarjı ~1 A → ~1 000 kat.
- UPS: APC — aküde çalışma ışığı; ~2 dk kala hızlı yanıp sönme; sürekli ses = aşırı yük, cihazları birer birer takma; UPS bilgisayarı kaydedip kapatmak içindir.
- Lityum pil güvenliği: NY DHSES (yastık/yatak/koltukta şarj etmeme, dolunca çıkarma, 0 °C altında ve 105 °F üstünde şarj etmeme), Singapur CPSO (şişmiş pili şarj etmeme, pile müdahale etmeme), ACCC (yanmaz yüzey, sıcak araçta bırakmama, dumanda ortamı boşaltma), CPSC (gevşek 18650 hücre uyarısı).
- Apple: 0–35 °C çalışma, 16–22 °C ideal; soğukta geçici düşüş, 35 °C üstü kalıcı zarar; ıslak iPhone pirince konmaz.

## Türkiye'ye özgü bilgiler
- 6 Şubat 2023: operatörler mobil baz istasyonu ve jeneratörle iletişim sağladı, Wi-Fi ve ankesörlüler ücretsizdi (Habertürk); Türk Telekom mağazalarında powerbank desteği (Para Dergi). Hatay çadır kentlerinde jeneratör, çadırlara aydınlatma ve priz (BirGün).
- İzmir Büyükşehir: güneş paneli ve jeneratörlü, mobil şarj istasyonlu iletişim araçları; AFAD koordinasyonunda toplanma alanlarında (ANKA).
- AFAD çanta listesi: pilli radyo, el feneri, yedek pil (İstiklal alıntısı). Powerbank AFAD listesinde açıkça yok; Turkcell afet sayfası "taşınabilir şarj cihazını hazır bulundurun" diyor.
- Doğrulanamadı: camilerde, muhtarlıklarda ya da hastanelerde jeneratör ve şarj imkânının düzenli olarak sunulduğu. Rehber yalnızca "sorun; olabilir" diyor.

## Rehber notları
- enerji-sarj-yollari: Özet rehber. Alt rehberlere [[bağlantı]] verir.
- enerji-telefon-tasarruf: energy.gov, Turkcell, Apple. "Düşük güç" ve "Pil ve şarj" adları src/tools/ayarlar ve src/tools/registry.ts'ten doğrulandı. Düşük güç Fener'i kapatır; adımda yazıldı.
- enerji-powerbank: Yukarıdaki sayılar. "CE işareti" Türkiye ve AB'de elektronikte zorunlu işarettir. "En az 2 kez dolduracak kapasite" önerisi kaynakta yok; makul öneri.
- enerji-arac: energy.gov, CDC/CPSC (garaj), AAA (soket kontak kapalıyken çeker), Argonne (yakıt), Kızılhaç (depo yarı dolu). "Günde kısa çalıştırma" için süre veren yetkili kaynak bulunamadı; süre yazılmadı.
- enerji-gunes: REI, BLF ölçümü. Cam arkası için doğrudan ölçüm yok; örtü testine dayanılarak "çok düşer" yazıldı.
- enerji-kurmali: Eton, Survivor kılavuzu, B&M.
- enerji-kalem-pil: Bağımsız testler (üretici değil). Sayı korumacı. "Alkalin pil şarj edilmez" genel üretici uyarısıdır.
- enerji-laptop-ups: APC, Samsung. USB-C kabloyla telefondan telefona şarj her modelde yok; "bazı telefonlar" yazıldı.
- enerji-jenerator: CPSC 5123 ve bültenler. tesisat-jenerator rehberine bağlantı var; ikisi tutarlı (6 m, backfeed, yakıt).
- enerji-sarj-noktasi: Türkiye haberleri. Kurum adı yalnız kaynakta geçtiği kadar (AFAD koordinasyonu, İzmir örneği).
- enerji-sarj-hatalari: NY DHSES, CPSO, ACCC, Apple. Kopmuş tel mesafesi tesisat rehberleriyle aynı: 20 m.
- enerji-hazirlik: AFAD, Turkcell, Ready.gov, Anker. "2 powerbank" görevin önerisi.
- enerji-ky-aku-usb: BCI, EnerSys, AAA. Sigortanın artı kabloya aküye yakın takılması yaygın uygulama; bu oturumda yetkili belge açılamadı. 5–10 A sigorta yaklaşık.
- enerji-ky-gunes-usb: TI LM2596, REI, BLF. USB-A pin 1 = VBUS, pin 4 = GND (USB standardı). "12 V panel boşta 20 V'u geçebilir" yaygın panel değeri (Voc ~21–22 V); veri sayfası açılmadı.
- enerji-ky-bisiklet: Seeed, B&M, Hokkaido Wilds. Parça voltajları (50 V) korumacı seçildi; inişte bağlantıyı çıkarma uyarısı kaynaktan.
- enerji-ky-ruzgar-su: Yalnızca hobi kaynakları (Hackaday, Instructables). Sayı yok; "öğrenme projesi" diye sunuldu.
- enerji-ky-termoelektrik: BioLite, SP1848. Watt yok; "birkaç watt ya da daha az".
- enerji-ky-18650: Görev "güvenli sunamıyorsan neden yapılmaması gerektiğini anlat" dediği için yapım adımı verilmedi. CPSC, CPSO, ACCC, DW01A.
- enerji-ky-efsaneler: Illinois, Apple, EnerSys. "Dondurucu/ovma" ve "şarj uygulaması" efsaneleri için yetkili kaynak yok; fizik açısından açık.
- enerji-ky-komsu: CPSC 5123, CPSO. Sıra, isim etiketi ve öncelik düzeni topluluk önerisidir.

## critical alanı
Hiçbir enerji rehberi `critical: true` değil. Tip açıklamasına ve docs/agents/REHBER_YAZIM.md'ye göre `critical` hayati ilk yardım içindir; Fener'de en üstteki rehber kritikse "Hayati durum olabilir: önce 112'yi arayın" bandı çıkar. "Telefonumu nasıl şarj ederim" gibi planlama sorularında bu band yanıltıcı olur. Yangın, karbonmonoksit ve elektrik çarpması tehlikesi olan rehberlerde (enerji-arac, enerji-jenerator, enerji-ky-aku-usb, enerji-ky-gunes-usb, enerji-ky-bisiklet, enerji-ky-ruzgar-su, enerji-ky-termoelektrik, enerji-ky-18650, enerji-ky-komsu) bunun yerine `note` uyarı bandı var. tests/guides-enerji.test.ts bu sorunun bandı açmadığını denetler.

## Arama ile ilgili not
tests/arama-kalitesi.test.ts ve tests/guides-tesisat.test.ts "şarj", "powerbank", "powerbank şişti", "şarjım bitiyor", "güneş paneli ile şarj" sorgularında ilk sırada tesisat-gunes-powerbank bekliyor. Bu testler başka kategorilere ait olduğu için değiştirilmedi. Enerji başlıkları ve anahtar kelimeleri bu sorguları çalmayacak şekilde ayarlandı (ör. başlıklarda "şarj" yerine "şarjı"). Enerji rehberleri bu sorgularda ilk 5'te çıkıyor.

## Uzman incelemesi gereken noktalar
- DIY elektrik adımları (sigorta yeri ve değeri, düşük voltaj koruma, dinamo devresi parça değerleri, LM2596 bağlantısı) bir elektrik/elektronik uzmanınca gözden geçirilmeli.
- Kalem pil ve bisiklet dinamosu yüzdeleri bağımsız testlere dayanıyor.
- Ortak şarj noktaları için AFAD ya da Kızılay'dan resmî bir kaynak bulunursa enerji-sarj-noktasi güncellenmeli.

## Resimler
Yeni sahneler: src/art/scenes/enerji.tsx (33 çizim, şartname src/art/spec/enerji.ts). Ayrıca mevcut tesisat-*, barinma-co-alarm, battery-radio, go-assembly-area, sms-send ve hazirlik-pil-tasarruf çizimleri yeniden kullanıldı. Galeri (?art=, f:enerji) 390 px'de gözle denetlendi. Bazı sahneler (enerji-sarj-noktasi, enerji-aku-telefon-yasak) sade; çizim turunda iyileştirilebilir.
