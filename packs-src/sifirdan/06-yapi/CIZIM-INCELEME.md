# 06-yapi çizim incelemesi (batch si-06)

Toplam 112 çizim incelendi: 36 rehberde 108 adım çizimi ve 4 kategori kapağı. Kapaklar ayrı bir paftada çekildi.
Paftalar `/tmp/si-06/sheets/` klasöründe. Değişen her rehberin son paftası görüldü.

## Sonuç (ilk bakışta)
- İYİ: 100
- ZAYIF: 10. Hepsi yeniden çizildi ya da düzeltildi; son halleri İYİ.
- KÖTÜ: 2. İkisi de yeniden çizildi; son halleri İYİ.
- null yapılan: 0

## Ne değişti
- **sf-yp-kerpic-kalip** (kerpic-2, 1. adım), ZAYIF. "30 cm" çerçevenin dışındaydı ve bir göze tam oturmuyordu; "25 cm" ise öbür gözün içindeydi. Hangi kenarı ölçtükleri belli değildi. Şimdi iki ölçü de aynı (sol) gözün iç kenarlarına dayanıyor: yatay 30 cm, dikey 25 cm. Gözler 30:25 oranında.
- **sf-yp-gunes-sacak** (gunes-yonu 6), ZAYIF. "50 cm" saçak ucundan uzaktaydı ve metindeki 1,5 m yükseklik çizimde yoktu.
  - Kesit yeniden çizildi: pencere altından saçak ucuna "1,5 m", saçak "50 cm"; ölçüler kesikli yardımcı çizgilerle bağlı.
  - Yaz ışını saçak ucunu sıyırıp pencere altına düşüyor. Kış ışını içeri giriyor.
- **sf-yp-doseme-katlar** (doseme 3), ZAYIF. Çizim "15 cm" gösteriyordu; bu ölçü 2. adıma ait ve 2. adımın çizimi yok. Metin "en az 10 cm çakıl" diyor ve bu çizimde yoktu. Kum, naylon ve toprak katları da sonraki adımlara aitti. Şimdi tek an çiziliyor: çukurda "10 cm" çakıl katı, üstünde tokmak ve aşağı ok.
- **sf-yp-bakim-dikme** (bakim 10), ZAYIF. Usta çürük kirişin altında diz çökmüştü; metin bunu yasaklıyor. Dikme de çürüğün yanında değildi. Şimdi kişi yok: çürüğün iki yanında birer geçici dikme ve yukarı oklar var.
- **sf-yp-iskelet-himis** (ahsap-iskelet 8), ZAYIF. Dal örgü bölmesindeki çamurun üst kenarı tırtıklı ve biçimsizdi. Şimdi düzgün dalgalı.
- **sf-yp-cati-makas** (cati-egim 3), ZAYIF. ✗ örneğindeki "duvarlar" çimende duran iki ince çubuğa benziyordu. Şimdi dışa yatmış iki kerpiç duvar var, üstlerinde mertekler duruyor.
- **sf-yp-kiremit-kalip** (kiremit 4), KÖTÜ. Yaylı tel kesici ve el soyut bir U'ya dönmüştü. Metin yalnızca 27 × 17 cm iç ölçülü bir çerçeve istiyor. Şimdi kum üstünde boş çerçeve var; iç kenarlara dayalı "27 cm" ve "17 cm".
- **sf-yp-kumes-tunek** (ahir-kumes 7), KÖTÜ. Tünek sırıkları tavukların altında kaldığı için çizim bir sehpaya benziyordu. "35–40 cm" ölçüsü de hiçbir şeye bağlı değildi. Şimdi sırıklar uçtan, açık renkli halkalar olarak tavukların önünde görünüyor. Aralık ölçüsü kesikli çizgilerle iki sırığın merkezine bağlı.
- **sf-yp-kece-serme** (kece 4), ZAYIF. İki kat üst üste değil, yan yana iki sayfa gibi görünüyordu. Şimdi üst katın (dikey lifler) köşesi kıvrılmış; altındaki yatay lifli kat görünüyor.
- **sf-yp-kece-yuvarlama** (kece 7), ZAYIF. Kadın etekle tek ayak üstünde, kolları açık ve çarpık duruyordu. Şimdi diz çökmüş, iki eliyle ruloyu itiyor. Oyuncu aynı.
- **sf-yp-cit-zikzak** (cit 2), ZAYIF. Önden görünüş balıksırtı bir desen gibi okunuyordu. Şimdi üstten görünüş: çimende zikzak çizen, üst üste sırıklar; uçları köşelerde çaprazlanıyor.
- **sf-yp-kapak-toprak** (kapak), ZAYIF. Diz çökmüş usta, ok ve kalıp birbirine karışıyordu. Şimdi kişi yok: sıra sıra kuruyan kerpiçler, yerde boş kalıp, arkada kerpiç duvar.

spec.ts'te bu 12 kimliğin açıklamaları yeni çizime göre güncellendi. guides.ts'teki `art` dizilerine dokunulmadı.

## Bakılıp bırakılanlar
- gecme-pergel: şematik, ama kesit mantığı doğru: pergelin bir ucu alt kütükte, öbürü üst kütüğe çizgi çiziyor.
- dam-log: yaşlı adam sola dönük ve silindiri önünde itiyor; ok yönü doğru.
- doldurma-yosun: üstteki iki kısa çubuk ip; kütük iple indiriliyor.
- sikistirma-hatil: hatıl duvar genişliğinde ve biraz düz dama benziyor; teknik olarak doğru.
- temel-hendek: "2 kat" ölçüsü 2. adıma ait, ama aynı rehberden ve çelişmiyor.

## Kontroller
- `check-sifirdan.ts 06-yapi` sonucu: hata yok.
- Derleme sonucu: 0 uyarı, 0 hata. 112 çizim.
