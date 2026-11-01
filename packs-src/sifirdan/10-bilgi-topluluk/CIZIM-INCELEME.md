# 10-bilgi-topluluk: çizimlerin bağımsız incelemesi (batch si-10)

Kapsam: 43 rehber ve 4 kategori kapağı, toplam 133 çizim. Bütün paftalar ve kapaklar görüldü. Değişen rehberlerin son paftaları da görüldü.
Kontroller: derleme 0 uyarı / 0 hata; `check-sifirdan` → hata yok; tsc'de paket dosyalarında hata yok.

## Sınıflama (ilk bakış)
- İYİ: 116
- ZAYIF: 15
- KÖTÜ: 2

ZAYIF ve KÖTÜ olan 17 çizimin hepsi yeniden çizildi ve İYİ oldu. Null yapılan çizim yok.

## Ne değişti
### Metinle çelişenler (bilinen)
- sf-bt-ruzgar-olcek (ZAYIF): ölçek 0–3 dört kareydi, şimdi 0–4 beş kare. Kareler: 0 duman dik, 1 duman eğik, 2 yapraklar kıpırdar, 3 dallar sallanır, 4 gövde eğilir. Spec güncellendi.
- sf-bt-takvim-golge-tasi (ZAYIF): ayda bir taş yerine her hafta bir taş, 27 taş. Taşlar 40° enlem için hesaplandı. Gündönümlerinde sıkışık, ekinoks çevresinde seyrek. Direk 96 px. Spec güncellendi.

### a dosyası
- sf-bt-gunes-saati-kurulum (ZAYIF): kadran yalnız kenarından görünüyordu, soyut kalıyordu. Yeni çizimde kadran hafif açıyla görünüyor ve 24 saat çizgisi seçiliyor. En alttaki 12 çizgisi kalın ve "12" yazılı. Anlamsız dikme kaldırıldı. Ortak `DialSide` yardımcısı yazıldı. Spec güncellendi.
- sf-bt-zaman-kapak (ZAYIF): sarı elips çanak antene benziyordu. Kapak aynı `DialSide` ile saat çizgili kadran olarak yeniden çizildi. Spec güncellendi.
- sf-bt-kayit-iki-kisi (ZAYIF): kadının kolları X biçiminde dolanıyordu. Kadın şimdi yandan duruyor, bir elinde pano, öbüründe kalem. Raf küçültüldü, kişiler rafın iki yanına alındı.
- sf-bt-bilgi-karsilastirma (ZAYIF): kolları "kanat" gibi açıktı. Okuyan kadın yandan çizildi, kâğıdı önünde tutuyor. Takip eden adam başı eğik, kopyaya bakıyor.
- sf-bt-isik-ayna-nisan (KÖTÜ): ayna görünmüyordu, el ağızda gibiydi. Yuvarlak ayna gözün hemen altında, elde net. Işık V parmaklarının arasından hedefe gidiyor.
- sf-bt-ulak-geri-okuma (ZAYIF): mesajı veren kişinin eli boştu. Şimdi ikisinin de elinde aynı kâğıt var; ulak yüksek sesle geri okuyor.

### b dosyası
- sf-bt-karar-anlasma (ZAYIF): yumruk gibi duran el yerine kalemi kıstıran el (`pinch`).
- sf-bt-nobet-selam (ZAYIF): geriye kalkık garip kol ve ok kaldırıldı. İkinci nöbetçi eli ağzında, yerleşime doğru sesleniyor (Waves).
- sf-bt-cocuk-alan (ZAYIF): ateş ve dere oyun alanının hemen yanındaydı, metinle çelişiyordu. İkisi de kaldırıldı; çit bütün alanı çeviriyor.
- sf-bt-cocuk-iki-yetiskin (ZAYIF): anlamsız kesik çizgi yerine "≥ 2" etiketi.
- sf-bt-bakim-pozisyon (KÖTÜ): yan yatan figür küçük ve karışıktı. Yeni çizimde kişi sırtüstü ve büyük. Başın, dirseğin ve baldırın altında yastık var, topuklar boşta. Üstte çevirme oku ve "2 saat".
- sf-bt-kopru-kutuk-doseme (ZAYIF): metinde olmayan döşeme tahtaları kaldırıldı.
- sf-bt-kopru-yuk-testi (ZAYIF): ip, kıyıdakilerin ellerine değmiyordu. İp artık iki kişinin elinden geçip yürüyen kişinin beline gidiyor.
- sf-bt-kamp-tuvalet-mesafe (ZAYIF): ne olduğu anlaşılmayan kahverengi kutu yerine kapısında ay olan tuvalet kulübesi.
- sf-bt-kis-istif (ZAYIF): tekerleğe benzeyen yuvarlak destekler yerine yassı taşlar.

## Null yapılanlar
Yok.

## Kalan küçük notlar
- sf-bt-yukseklik-golgeler: ağacın ışını tepe noktasının biraz altından başlıyor. Gölge oranları doğru, İYİ sayıldı.
- Eşek çizimleri kaba ama okunuyor.
