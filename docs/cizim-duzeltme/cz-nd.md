# Çizim düzeltme — batch cz-nd (nükleer + doğa)

Sahne dosyası: `src/art/scenes/nukleer-doga.tsx`. Dosyanın başına rehber başına oyuncu sabitleri eklendi (HIP, KAY, ISR, HAV, YAL, RAD, KIM, SAL, PAT, MSK). Rehberlerin bütün sahneleri bu sabitleri yayıyor. Ortak sahneler (categories-common, hayatta-kalma-*) oyuncu tutarlılığını bozduğu için insan içerenlerin yerine rehbere özel kopyalar yazıldı. Yalnızca el ve telefon gösteren ortak sahneler korundu (call-112, call-114, remove-rings, wash-hands, battery-radio, sms-send). Yeni yardımcılar: WhistleScene, GroundScene, CprScene, SuspectScene.

Yüz ifadeleri: yardım eden ve acil durumdaki kişilerde `calm` (gülümseme) kaldırıldı; yerine `neutral` ya de `worried` kondu, ısırılan kişide `pain` kullanıldı. Not: kitteki `neutral` ağzı da hafif kıvrık.

## hipotermi
- Oyuncular: üşüyen adam (açık ten, kahverengi saç, mavi) ve yardımcı kadın (at kuyruğu, siyah saç, teal).
- 1, 3, 4, 5: oyuncular birleştirildi. 5. adımdaki yaralı kadındı, adam yapıldı.
- 8: `cpr-adult` yerine `doga-hipotermi-kpr` çizildi. Aynı oyuncular ve doğru KPR duruşu var; zemin karlı.

## doga-kaybolma
- Oyuncu: tek yürüyüşçü kadın (at kuyruğu, kahverengi saç, teal).
- 1: adam kadına çevrildi. "wifi" gibi okunan nefes dalgaları kaldırıldı; yüz `worried`.
- 5, 6, 7: yeni sahneler `doga-kaybolma-duduk`, `doga-kaybolma-parlak-bez` ve `doga-kaybolma-zemin` (önceden kadın/adam karışıktı).

## hayvan-isirigi
- Oyuncular: ısırılan adam (mavi) ve yardımcı kadın (teal, koyu ten).
- 1: uzaklaşan kişi ve ekteki yanlış davranan kişi ısırılan adam yapıldı.
- 4 (`doga-yilan-hareketsiz`) yeniden çizildi:
  - kişiler büyütüldü;
  - yardımcı bir eliyle bacağı sabit tutuyor, diğer eliyle telefonla arıyor;
  - destek ruloları yeşilden kahverengi monta çevrildi, buz ya da soğuk paket gibi okunmuyor;
  - spec'e "buz değil" notu eklendi.
- 6. adım (su-sabun + beze sarılı soğuk) çizimsiz kaldı. Hiçbir sahne yılan ısırığına soğuk uygulamıyor.

## doga-hava-degisimi
- Oyuncular: yürüyüşçü adam (teal) ve arkadaşı (hardal).
- 1, 2, 3, 5: yüzler ve oyuncular düzeltildi. 5. adımdaki kadın adam yapıldı.
- 8: yeni sahne `doga-hava-yagmurluk`. Aynı adam sarı yağmurluğunun fermuarını çekiyor.

## doga-yalniz-yaralanma
- Oyuncu: yaralı adam (koyu ten, mavi, haki pantolon).
- 2 (`doga-yaralanma-bastirma`) yeniden çizildi. Eski çizimde başka birine ait gibi duran tepeden iki kopuk kol vardı. Yenisinde yandan, oturan adam öne eğilmiş, baldırdaki bezi kendi iki eliyle bastırıyor.
- 6, 7: yeni sahneler `doga-yaralanma-zemin` ve `doga-yaralanma-duduk`.

## nukleer-radyasyon
- Oyuncular: anne (uzun siyah saç, teal) ve kızı.
- 2: kesitteki 5 farklı kişi yerine anne ve kızı bodrumda; orta kattaki iç oda boş ve onaylı.
- 4, 6, 8: adam ve farklı aile üyeleri anneye/kıza çevrildi.
- 6: duşta saç köpükle örtülü (uzun saç blok gibi görünüyordu).

## kimyasal-sizinti ve nukleer-korunma-odasi
- Ortak oyuncular: kadın (topuz, siyah saç, teal) ve oğlu.
- Kimyasal 2: yeni sahne `nukleer-kimyasal-islak-bez`.
- Kimyasal 7: yeni sahne `nukleer-kimyasal-yikama`. Akan su artık çıplak ön kola ve ele dökülüyor (giysiler çıkarılmış olmalı).
- Kimyasal 5: üst kattaki iç odada aynı kadın ve oğlu.
- Korunma odası 7: pencereyi bantlayan adam aynı kadına çevrildi.

## nukleer-salgin
- Oyuncular: hasta adam (mavi), bakıcı kadın (teal) ve çocuk.
- 3: dirseğe öksüren kişi hasta adam yapıldı.
- 5, 6: bakıcı ve hasta aynı kişiler. Önceden 6. adımda yaşlı bir adam vardı.
- 9: yeni sahne `nukleer-salgin-supheli-paket` (bakıcı kadın). `nukleer-supheli-paket` patlama rehberine kaldı.

## nukleer-patlama-sonrasi
- Oyuncu: kadın (uzun siyah saç, teal).
- 1, 4, 6: aynı kadın. 4. adımdaki kız çıkarıldı.
- 2: yeni sahne `nukleer-patlama-merdiven`. Asansör yasaklı, kadın merdivenden aşağı iniyor.
- 9: yeni sahne `nukleer-patlama-duduk`. Enkaz altında, beton tavan ve boru ile.

## nukleer-maske-kullanimi
- Oyuncu: tek kadın (topuz, mor). Önceden 5 adımda 5 farklı kişi vardı.
- 8 (`nukleer-maske-cikar`) yeniden çizildi. Havada kopuk duran eller yerine kollar başın arkasında lastikleri tutuyor.

## Değiştirilen art dizisi ve spec kimlikleri
- Spec'e yeni kimlikler eklendi; `doga-kaybolma-dur`, `doga-yilan-hareketsiz` ve `doga-yaralanma-bastirma` açıklamaları güncellendi.
- Hiçbir çizim null yapılmadı (önceki null'lar korundu).

## Kalan şüpheler
- `nukleer-dirsege-oksur`: kapalı göz ifadesi küçük boyda gülümseme gibi okunabiliyor.
- `doga-yilan-hareketsiz`: telefon tutan kol yüzün önünden geçiyor.
- `tests/guides.test.ts` başka bir batch'in `sicak-yan-yatir` kimliği yüzünden kırmızı. Kendi rehberlerimdeki bütün art kimliklerinin tanımlı olduğunu ayrıca doğruladım.
