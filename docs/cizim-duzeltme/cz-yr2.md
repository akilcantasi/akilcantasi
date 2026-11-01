# Çizim düzeltme — cz-yr2 (yaralanma-2.tsx)

10 rehber. Her rehberin başında `src/art/scenes/yaralanma-2.tsx` içinde bir oyuncu sabiti var (SAP, YARA, DON, GUN, ISH, ATS, KUD, KEN, SU, KRA); bütün sahneler ve yakın plan ellerin manşet rengi/teni (`sleeveOf`, `skinOf`) bundan geliyor. Ortak `hospital-go`, `wash-hands`, `remove-rings`, `lie-cover-blanket`, `cold-compress` ve başka ajanın `yaralanma-kanama-bastirma` / `yaralanma-yukari-kaldirma` sahneleri oyuncu tutarlılığını bozduğu için rehbere özel kopyalarla değiştirildi (parametrik `GoClinicScene`, `WashScene`, `CallScene`, `DrinkScene`). Yeni kimliklerin spec satırları `src/art/spec/yaralanma.ts`'ye eklendi. Hiçbir çizim null yapılmadı (gereksiz olanlar zaten null'dı).

## yaralanma-saplanan-cisim
Oyuncular: yaralı açık tenli, kahve saçlı, şortlu adam; yardımcı uzun koyu saçlı kadın (camgöbeği).
- 1: çubuğu çeken el mor manşetten yardımcının manşetine/tenine çevrildi.
- 3: el teni yardımcıyla eşlendi.
- 7: `lie-cover-blanket` (farklı yaralı, küçük figürler) yerine `yaralanma-saplanan-ortme`: aynı adam sırtüstü, bilinci açık (acı yüzü), gövdesi battaniyeli, uyluktaki çubuk rulo bezlerle sabit; yardımcı odaklı yüzle omzunda.
- 112 için ortak `call-112` korundu (camgöbeği manşet, ten 1 = yardımcı).

## yaralanma-yara-temizleme
Oyuncular: dizi sıyrılmış çocuk (mavi üst, haki şort); yardımcı esmer adam (camgöbeği).
- 1: `yaralanma-yara-el-yikama` (yardımcının elleri).
- 2: başka ajanın çapraz eldivenli kolları yerine `yaralanma-yara-bastirma`: aynı dize tek el bezle bastırıyor.
- 4, 6: yıkama ve bant aynı diz yakın planına (`Knee`) taşındı; eller yardımcının.
- 10: `yaralanma-yara-saglik` (yardımcı çocuğu destekliyor).

## yaralanma-soguk-isirigi
Oyuncular: açık tenli kadın (mavi mont); yardımcı adam.
- 2: mont rengi mavi oyuncu rengine eşlendi. 3: `yaralanma-donma-yuzuk` (aynı ten + manşet).
- 5: iki etiket + termometreden "30 dk" kaldırıldı (adım metninde yok); su altındaki elin gri görünümü azaltıldı.
- 8: anlaşılmayan "karla ovma" yasak eki kaldırıldı. 9: `yaralanma-donma-saglik`.

## yaralanma-gunes-yanigi
Oyuncular: kızarık omuzlu şortlu adam; topuzlu yardımcı kadın. (Önceden 3 adımda 3 farklı kişi vardı.)
- 1: ölçek büyütüldü. 2: aynı adam sandalyede, yardımcı arkadan ıslak bezi omzuna koyuyor (eski düz uzanmış "işaret eden" kol gitti).
- 3: `yaralanma-gunes-su-icme` (aynı adam). 7: `yaralanma-gunes-saglik`.

## yaralanma-ishal
Oyuncular: yaşlı adam; yardımcı kadın. 1: gülümseme → nötr. 3: üç etiket → tek "1 L" + düz yazı "6 şeker", "½ tuz". 6: `yaralanma-ishal-el-yikama` (yaşlı adamın elleri). 8: `yaralanma-ishal-saglik`.

## yaralanma-yuksek-ates
Oyuncular: hardal tişörtlü kız çocuk; başörtülü esmer anne (camgöbeği).
- 2: anne yardımcı oyuncuya çevrildi; havada süzülen termometre yerine "38 °C" etiketi.
- 4: minik iki yatak yerine iki büyük kare, aynı kız: solda kalın yorgan + ✗, sağda ince tişört + belde çarşaf + ✓.
- 7: `yaralanma-ates-112` (annenin eli). 8: döküntü teni çocukla eşlendi. 9: `yaralanma-ates-saglik` (anne çocuğun elinden tutuyor).

## yaralanma-kuduz-isirik
Oyuncu: at kuyruklu esmer kadın (kiremit üst). 2: ten eşlendi. 4: `yaralanma-isirik-bastirma` (kendi eliyle ön koldaki yaraya bez). 5: `yaralanma-kuduz-saglik`. 8: oyuncu sabitine bağlandı.

## yaralanma-kene
Oyuncu: açık renkli kapalı giysili yürüyüşçü adam. 6: `yaralanma-kene-el-yikama`. 8: `yaralanma-kene-saglik`. 10: oyuncu sabitine bağlandı.

## yaralanma-su-toplama
Oyuncu: yeşil üstlü, haki pantolonlu yürüyüşçü kadın (kendi bakıyor). 2, 3, 5: camgöbeği "yardımcı" elleri kadının yeşil manşetine ve tenine, ayak teni de ona çevrildi. 8: `yaralanma-ayak-saglik`.

## yaralanma-kramp-zorlanma
Oyuncu: mavi tişörtlü, lacivert şortlu esmer adam (kendi uyguluyor). 2, 7: eller ve bacak teni/şort ona eşlendi. 6: `cold-compress` yerine `yaralanma-kas-soguk` (uyluğa beze sarılı buz, kendi eli, 20 dk). 8: başka ajanın kızıl saçlı kadın sahnesi yerine `yaralanma-kas-yukari` (aynı adam kanepede, sargılı baldır yastıklarda).

## Kalan şüpheler
- Saplanan-ortme'de yatan figür yatay olduğu için yüksekliğin %60'ını doldurmuyor; battaniye biraz kutu gibi.
- Yara-temizleme 2'de bez dizin üst kenarında; yara bezin altında kaldığı için kanama izi küçük.
- Güneş 2'de yardımcı sandalye arkalığının arkasında; okunuyor ama biraz kalabalık.
- Kuduz 8'deki iğne simgesi hâlâ takvimin yanında süzülen bir simge (ikon olarak bırakıldı).
