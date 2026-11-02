# 16-onarim-teknik: çizimlerin bağımsız incelemesi (batch si-16)

Paket: sifirdan-onarim-teknik. 14 rehber, 41 rehber çizimi (`sf-ot-anten-hat-uzaklik` iki rehberde) ve 2 kategori kapağı. Toplam 43 çizim incelendi.

## Sınıflama (ilk bakış)
- İYİ: 24
- ZAYIF: 13
- KÖTÜ: 6

KÖTÜ olanlar: `sf-ot-olcum-kablo`, `sf-ot-olcum-govde` (kablolar birbirine dolanmış, ne nereye değiyor okunmuyor), `sf-ot-canta-fermuar-pense` (sürgünün altında kapalı diş yok, boşluğu gösteren oklar, kumaş yarıda kesik), `sf-ot-yapistirma-kaynak` (çatlak, kaynak dikişi ve şerit karışık), `sf-ot-teknik-kapak` (anten teli havada bitiyor, kişi elini çenesine koymuş garip pozda), `sf-ot-pas-sirke` (1. adımda, "sabunlu suyla yıkayın" metninin yanında sirke leğeni duruyordu).

ZAYIF olanlar: `sf-ot-sap-cakma` (çekiç havada, tutan el yok), `sf-ot-ege-vurus` (açı yayı elin altında kalıyordu, ikinci el garipti), `sf-ot-ege-balta` (eğe pahın üstünde değil, havadaydı; 25° yayı okunmuyordu), `sf-ot-pas-kum-kovasi` (aletin yalnız sapı görünüyordu, kürek olduğu anlaşılmıyordu), `sf-ot-ayakkabi-yapistirici` (5. adımdaki "10–15 dk" ve pencere 3. adıma konmuştu), `sf-ot-ayakkabi-bastirma` (köşede 7–8. adımın "24 saat" karesi vardı), `sf-ot-canta-kutu-dikis` (bindirme görünmüyordu, iki kayış uç uca duruyordu), `sf-ot-zincir-olcme` (3. adımın "+15–20 mm" etiketi vardı), `sf-ot-yapistirma-bant` (7. adımın "24 saat" saati vardı), `sf-ot-anten-orta-yalitkan` (koaksiyel ve silikon 5. adımın içeriği, ama 4. adıma bağlıydı), `sf-ot-yelken-ip-elde` (yelken izleyiciye dönük, rüzgâr yandan geliyordu), `sf-ot-kiyi-iskandil` (ip elde değildi, salın içinden geçiyordu), `sf-ot-onarim-kapak` (kalabalık ama okunuyor; değiştirilmedi).

## Ne değişti
- sap-cakma: çekici sağdan gelen ikinci el tutuyor; çekiç başı çubuğun tam üstünde.
- ege-vurus: ikinci el kaldırıldı. Açı yayı büyüdü ve alt yüzün kesik uzantısı eklendi. Pah yaklaşık 36° oldu.
- ege-balta: gerçek 25° geometrisi kuruldu (pahlar ±12,5°). Büyük açı yayı eklendi, eğe üst pahın üstüne yatırıldı, sapından el tutuyor. "sap" etiketi "sap tarafı" oldu.
- pas-kum-kovasi: parlak kürek ağzı kumun hemen üstünde görünüyor; kova alçaltıldı.
- pas-sirke: çizim değişmedi; guides.ts'te 1. adımdan 2. adıma (sirkeli suda bekletme) taşındı.
- ayakkabi-yapistirici: saat ve pencere çıkarıldı. ayakkabi-bastirma: köşe karesi çıkarıldı.
- canta-fermuar-pense: baştan çizildi. Sürgünün üstünde fermuar açık, altında dişler birbirine geçmiş. Pense sürgünün dar arka köşesinde, çenelere iki yandan küçük sıkma okları var. El sağ alttan geliyor.
- canta-kutu-dikis: açık kayış koyu kayışın üstüne bindirildi. Alttaki ucun kenarı kesik çizgiyle gösteriliyor ve 4–5 cm ölçüsü bindirmenin iki kenarına bağlandı.
- zincir-olcme: "+15–20 mm = değiştir" etiketi çıkarıldı.
- yapistirma-kaynak: baştan çizildi. Solda kabarık kaynak dikişi, sağda açık çatlak. Kaynak noktasında kızgın uç (sağ alttan gelen el) ve plastik şerit (üstten gelen el) birleşiyor; ok kaynak yönünü gösteriyor.
- yapistirma-bant: "24 saat" saati çıkarıldı.
- olcum-kablo: baştan çizildi. Solda fiş, sağda açık cihazdaki vida; kablo üstten kavis yapıyor. Üstten gelen el kabloyu büküyor. Ölçü aleti altta ortada; siyah uç fiş bacağında, kırmızı uç vidada. Köşedeki priz çıkarıldı.
- olcum-govde: baştan çizildi. Fiş bacakları kırmızı kıskaçla birleşik, cihazın düğmesi açık (yeşil). Siyah uç kıskaçta, kırmızı uç metal gövdede. Kablolar aletin altından iki yana dolanıyor, ekranda "OL" ve onay işareti var. Köşedeki "bip yasak" karesi çıkarıldı.
- anten-orta-yalitkan: çizim değişmedi; 4. adımdan 5. adıma (koaksiyel bağlantısı ve silikon) taşındı. 4. adım null oldu.
- yelken-ip-elde: yelken yarı yandan çizildi: üstteki sırık eğik, yelken rüzgârla sağa şişkin. İki alt köşe ipi iki elde.
- kiyi-iskandil: ip elde ve salın kenarının dışından iniyor; sal kısaltıldı.
- teknik-kapak: baştan çizildi. Anten teli çamla kulübe çatısındaki kısa direk arasında, iki yalıtkanla gerili. Kıyı çizgisi kavisli. Saldaki can yelekli kişi yelkenin iki alt köşe ipini tutuyor.
- spec.ts: yukarıdaki sahnelerin açıklamaları çizime göre güncellendi.

## Null yapılanlar
Hiçbir çizim kaldırılmadı. Yalnız iki çizim doğru adıma taşındığı için şu indeksler null oldu: pas'ın 1. adımı ve anten'in 4. adımı.

## Son durum
Bütün çizimler İYİ sayıldı (onarim-kapak sınırda; okunuyor). Kontroller: check-sifirdan "hata yok"; derleme 0 uyarı, 0 hata; sahne dosyası tsc'den temiz geçiyor. Bütün rehberlerin son paftalarına bakıldı (`/tmp/si-16/sheets`).
