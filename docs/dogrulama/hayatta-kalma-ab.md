# Bağımsız doğrulama: hayatta-kalma-ab

Tarih: 2026-11-01. WebSearch kotası bittiği için yalnızca WebFetch kullanıldı. Erişilebilen kaynaklar: NPS "Staying Safe Around Bears", NPS Grand Canyon "Hike Smart", NHS Heat exhaustion and heatstroke, NHS Hypothermia, NWS Heat illness, WHO Rabies fact sheet, FAA AIM bölüm 6-2, Animated Knots (Bowline, Square Knot, Sheet Bend, Clove Hitch). Erişilemeyenler: MREW, CDC, NPS nehir geçişi sayfaları, STF, NZ DOC/MSC, AFAD/Kızılay/Sağlık Bakanlığı.

## hayatta-kalma-isaret
- Doğrulanan: FAA AIM 6-2 (yer-hava kodu var, işaret verirken açıkta durun, işareti tekrarlayın). V/X/ok anlamları, ≥2,5 m sembol boyu, dakikada 6 düdük (MREW) ve Y kol işareti önceki ajanın kaynaklarına dayanıyor; bu turda sayfalara erişilemedi. Metin genel bilgiyle tutarlı olduğu için değiştirilmedi.
- Değişiklik: yalnızca `checked` notu.
- Doğrulanamadı: MREW'in dakikada 6 sinyal kuralı ve ICAO sembol boyu (doğrudan kaynak açılamadı).
- Resim sorunları:
  - Adım 2, `hayatta-kalma-parlak-bez`: kişi helikoptere tek kolunu kaldırıp el sallıyor. Bu hem adım 8'deki "el sallamayın" uyarısıyla çelişiyor hem de tek kol yukarı, yer-hava kodunda "yardım gerekmiyor / her şey yolunda" anlamına gelebiliyor. Resimde kişi ya hiç olmasın ya da iki kolu Y şeklinde havada olsun.
  - Adım 3, `hayatta-kalma-yer-isareti`: kişi yine tek kolunu kaldırmış. Kollar aşağıda olmalı ya da Y yapılmalı.
  - Adım 5, `whistle-signal`: "3×" rozeti, ana talimat olan "dakikada 6"yla çelişiyor. Rozet "6× / dk" olmalı.

## hayatta-kalma-yabani-yiyecek
- Doğrulanan: genel zehirlenme ilkeleri. Türk resmî kaynaklarına (Sağlık Bak., UZEM) bu turda erişilemedi; önceki ajanın notları korundu.
- Değişiklik (güvenlik): adım 7 "…bulantı, kusma… olursa 112'yi ya da 114'ü arayın" → "Bilmediğiniz bir mantar ya da bitki yediyseniz belirti beklemeden 114'ü ya da 112'yi arayın. En tehlikeli zehirlenmelerde belirtiler 6 saatten sonra başlar." Gerekçe: amatoksin (ölümcül mantar) zehirlenmesinde belirtiler geç başlar ve erken tedavi hayat kurtarır. Belirti beklemek tehlikeli bir eksiklikti.
- Uzman bakmalı: "6 saatten sonra" ifadesi bir toksikologça ya da UZEM metniyle teyit edilmeli.
- Resim: adım 7 `call-114` ekranda 114 gösteriyor, uygun. Diğerleri uygun.

## hayatta-kalma-soguk-gece
- Doğrulanan: NHS Hypothermia (ıslak giysiyi çıkar, başı ört, ılık-alkolsüz-şekerli içecek, alkol yok, konuşma bozukluğu/uyuşukluk, acil arama).
- Değişiklik: adım 2'deki yalıtım listesinde "ip" vardı (ip yalıtım sağlamaz) → "çanta, kuru yaprak, çam dalı, karton". Kaynaklarda MREW yerine NHS Hypothermia yazıldı; `checked` güncellendi.
- Resimler uygun (2, 4, 5, 6, 9).

## hayatta-kalma-sicak
- Doğrulanan: NPS Grand Canyon (10.00–16.00 yürümeyin, susadıkça için, sık dinlenip yiyin, ıslak kalın), NHS ve NWS (sıcak bitkinliği ve sıcak çarpması belirtileri; bitkinlik 30 dakikada geçmezse, 1 saatten uzun sürerse ya da kusma olursa acil yardım).
- Değişiklik (eksik): adım 7'nin sonuna "Kusarsa ya da yarım saatte düzelmezse 112'yi arayın." eklendi. Kaynaklarda CDC yerine NHS ve NWS yazıldı (CDC sayfası açılmadı).
- Not: NWS, sıcak çarpmasında kişiye sıvı verilmemesini söylüyor. Adım 8 su vermeyi önermiyor, bu yüzden çelişki yok.
- Resimler uygun (1, 2, 4, 6, 8).

## hayatta-kalma-dere-gecme
- Doğrulanamadı: NPS Mount Rainier, STF ve NZ sayfalarına erişilemedi. Diz derinliği, sabah geçişi, kemerleri açma, sopa ve yüzü akıntıya dönme, düşünce sırtüstü ve ayaklar akıntı yönünde durma, standart arazi bilgisiyle tutarlı.
- Değişiklik (hata): adım 3 "Yağmur ya da kar suyuyla kabaran dere sabah erken en alçaktır" → "Kar suyuyla beslenen dere sabah erken en alçaktır. Yağmurla kabaran dere genelde birkaç saatte ya da bir günde iner; suyun çekilmesini bekleyin." Sabah en alçak olma kuralı yalnızca kar erimesi için geçerli; yağmur taşkını günün saatine bağlı değil.
- Uzman bakmalı: "birkaç saatte ya da bir günde iner" süresi bir dağ kurtarma kaynağıyla teyit edilmeli.
- Resim sorunu: adım 7, `hayatta-kalma-dere-sopa`: kişi izleyiciye bakıyor, yani gövdesi akıntıya dik duruyor. Metin "yüzünüz akıntıya dönük" diyor. Kişi akıntının geldiği yöne (sola) dönük, sopa önünde ve yukarı akışta, yan adım okları karşı kıyıya doğru çizilmeli. Diğer resimler (1, 2, 6, 9) uygun.

## hayatta-kalma-vahsi-hayvan
- Doğrulanan: NPS (alçak sesle konuşun, yavaşça ve yana doğru çekilin, koşmayın, ağaca çıkmayın; boz ayıda yüzüstü yatın, eller ensede, bacaklar açık, çanta sırtta; saldırı sürerse ya da çadırda saldırırsa karşı koyun). WHO kuduz bilgi notu (yarayı en az 15 dakika sabun ve suyla yıkayın, sonra sağlık kuruluşuna gidin). Türkiye'de yalnızca boz ayı olduğu için kara ayı ayrımı gerekmiyor.
- Değişiklik: adım 8'deki yazım hatası "arayıza" → "aranıza". Kaynaklara WHO eklendi; `checked` güncellendi.
- Doğrulanamadı: köpek sürüsüyle ilgili adımlar (CFSPH) ve yaban domuzu (NParks), bu turda erişilemedi.
- Resim sorunu: adım 2, `hayatta-kalma-ayi-geri-cekil`: kişi ayıya doğru adım atıyor gibi görünüyor ve ok ayının üzerinde. Kişi ayıya dönük durmalı, yana ya da geriye adım atmalı, ok kişinin hareketini göstermeli. Tehlikeli değil ama yanıltıcı. Diğer resimler (1, 4, 7, 9) uygun; adım 4'teki duruş NPS ile birebir.

## hayatta-kalma-dugumler
- Doğrulanan: Animated Knots. İzbarço adımları doğru; izbarço yüksüzken gevşeyebilir. Camadan kritik yükte ya da iki ipi eklemek için güvenilmez (metindeki uyarı yerinde). Iskota farklı kalınlıktaki ipler için kullanılır ve U'yu kalın ip oluşturur. Kazık bağı kayabilir, yarım bağla sabitlenmelidir.
- Değişiklik: adım 3'e "Yüksüz kalınca gevşeyebilir; ara ara kontrol edin." eklendi. Adım 8'e "Kazık bağı kayabilir; ucunu ana ipe iki yarım bağla sabitleyin." eklendi. Kaynak ve `checked` güncellendi.
- Uzman bakmalı: düğüm resimlerinin topolojisini (sekiz, izbarço, camadan, ıskota, kazık) bir denizci ya da izci eğitmeni karede kare kontrol etmeli. Genel görünümleri doğru ama ip geçişlerinin üst/alt ayrıntısı küçük çizimde kesin teyit edilemedi. "Yarım bağ" için ayrı bir resim ya da adım gerekebilir.

## Testler
`npx vitest run tests/guides.test.ts`: 191/191 geçti. `art` uzunlukları değişmedi; hiçbir resim null yapılmadı.
