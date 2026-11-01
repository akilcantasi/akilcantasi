# 10-bilgi-topluluk — çizim raporu (harf a, batch sc-10a)

Dosya: `scenes-a.tsx` (66 rehber sahnesi + 4 kategori kapağı = 70 sahne). `scenes.tsx` zaten A ve B'yi birleştiriyordu; değiştirilmedi.
Derleme: 0 uyarı, 0 hata. `check-sifirdan`: hata yok. 22 rehberin hepsinin son paftası görüldü.

## Oyuncular (CAST, dosya başında)
- usta: orta yaşlı adam, camgöbeği üst, haki pantolon (ölçü, terazi, takvim, yükseklik, şakul)
- ciftci: başörtülü esmer kadın, hardal üst (mevsim, bulut, rüzgâr)
- katip / katip2: kızıl topuzlu kadın (mor) + koyu tenli genç adam (yeşil) (kayıt, bilgiyi koruma)
- ogretmen / ogrenci: siyah saçlı kadın + at kuyruklu kız (okuma-yazma)
- telsizci / telsizci2: esmer adam (kiremit) + sarışın kadın (yeşil) (PMR, amatör, haberleşme kapağı)
- isaretci: at kuyruklu esmer kadın, mor üst (mors, ışık-ayna)
- koylu: bıyıklı, kır saçlı adam (duman-ses)
- ulak, ulak2, merkez: iki ulak (yeşil üst, sarı kol bandı) + başörtülü yaşlı kadın
- seyis: bıyıklı adam, hardal üst (eşek)
- Malzeme renkleri `M` sabitinde: ahşap, ip, taş, kâğıt, eşek, çuval ve keçe.

## Rehber başına çizilen adımlar (adım numaraları 1'den başlar)
- sf-gunes-saati: 1 kuzey (gölge uçları 40° enlem ve -12° sapma ile hesaplandı), 3 kadran (24 çizgi, 15° arayla), 6 kurulum (çubuk 40°, kadran çubuğa dik). Null: okuma.
- sf-takvim-tutma: 2 çentik, 4 ay evreleri (kuzey yarıküre, büyüyen ayın sağı aydınlık), 7 gölge taşları (taş aralıkları 40° enlemde öğle gölgesinden hesaplandı, ayda bir taş).
- sf-mevsim-belirtileri: 3 kırağı (fideye yasak işareti), 4 toprak sıkma, 7 hasat tanesi. Null: yaşlı anlatır.
- sf-hava-tahmini-bulut: 2 sirrus, 3 hale, 5 kümülonimbus.
- sf-hava-tahmini-ruzgar: 1 şerit, 2 ölçek, 3 sırt (arkadan bakış). Null: tablo.
- sf-uzunluk-olculeri: 1 ana çubuk, 4 kulaç ≈ boy (sadeleştirildi), 6 adım 100 m. Null: düğümlü ip.
- sf-terazi-yapma: 2 asma terazi, 5 su şişesi ve 1 kg taş (adım 4'ten 5'e taşındı), 7 kantar. Null: orta nokta, kefe değiştirme.
- sf-dik-aci-3-4-5: 1 13 düğümlü ip, 4 üçgen (3-4-5 ölçekte tam; düğümler kenarlarda 3, 4 ve 5 aralık), 7 köşegenler.
- sf-su-terazisi-sakul: 3 şakulle duvar kontrolü, 5 hortum terazisi (adım 4'ten 5'e taşındı), 6 A-terazisi. Null: şakul yapımı, eş yükselti.
- sf-harita-cizme: 2 kuzey oku ve çizgi ölçek (adım 1'den 2'ye taşındı), 7 kesişim, 8 işaretler. Null: adım defteri.
- sf-yukseklik-olcme: 1 çubuk, 2 benzer gölgeler, 5 45° üçgen (nişan çizgisi tam 45°; uzaklık + göz yüksekliği = boy).
- sf-kayit-tutma: 1 üç defter, 2 düzeltme, 6 iki kişi sayım. Null: envanter sayfası.
- sf-okuma-yazma-ogretme: 2 ses, 4 hece e+l→el, 6 kum tepsisi. Null: yetişkin.
- sf-temel-aritmetik: 2 demet 23, 5 çerçevede 6×7 (sayılar tam), 6 paylaştırma 20÷4. Null: taş sayma, çerçeve.
- sf-bilgiyi-koruma: 3 üç kopya, 4 karşılaştırma, 6 sandık. Null: yazma.
- sf-pmr446-telsiz: 2 plan etiketi, 4 konuşma (bir karış), 7 tepe ve görüş hattı. Null: kanal tablosu.
- sf-amator-telsiz: 1 istasyon, 4 kayıt defteri, 7 anten ve elektrik hattı. Null: çağrı işareti (gerçek bir çağrı işaretine benzememesi için).
- sf-mors-kodu: 1 zaman kuralı (A, 3, N, 7, E birim ızgarada), 2 A–Z tablosu (ITU kodları tek tek kontrol edildi), 6 SOS fener. Null: alıştırma.
- sf-isik-ayna-haberlesme: 1 iki tepe, 4 ayna ve V nişanı, 7 gece fener kapağı. Null: kod kartı, kapak.
- sf-duman-ses-isaret: 1 üç ateş, 4 gaz tüpü çanı, 6 beyaz duman. Null: alarm tablosu, ateş yığını.
- sf-ulak-posta: 1 form, 2 geri okuma, 3 iki ulak. Null: devir noktası.
- sf-esek-at-bakimi: 1 su, 7 toynak (yakın plan taban), 8 semer, keçe ve "≤ %20". Null: yem, sundurma.
- Kapaklar: zaman (güneş saati), haberleşme (tepede telsiz ve karşı tepede ayna parıltısı), topluluk (ağaç önünde 5 kişi), doğa (dağ önünde kulübeler ve odun). Spec sadeleştirildi: tekerlekli sandalye, ulak ve eşek kapaklardan çıkarıldı.

spec.ts: kullanılmayan 24 kimlik silindi; çizilen sahnelerin açıklamaları çizimle uyumlu olacak şekilde güncellendi.

## Kalan şüpheler
- Rüzgâr ölçeği 0–3 dört kare. Metin "0–4 arası ölçek" diyor ama dört belirti sayıyor.
- Gölge taşı sahnesi ayda bir taş gösteriyor, metin "her hafta" diyor. Bu, okunabilirlik için yapılmış bir sadeleştirme.
- Güneş saati kurulum sahnesi doğru (kadran kenardan görünüyor) ama ilk bakışta soyut kalabilir.
- Eşek çizimi elde yapıldı; oranları kaba.
- Toynak sahnesinde kişinin yalnız eli görünüyor; tüm bedeni çizilmedi.
- Ayna sahnesinde ayna yüzün hemen altında küçük kalıyor.
- Yükseklik/gölgeler sahnesinde ağacın ışını tepe noktası yerine taç içinden başlıyor.
- guides.ts'teki art dizileri, satır başına tam eşleşen değiştirmelerle güncellendi (python ile tek seferde, yalnız kendi 18 satırım).
