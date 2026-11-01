# Sıfırdan: Barınak ve yapı (sifirdan-yapi) — yazım raporu

36 rehber, 4 kategori (sf-yp-yer 7, sf-yp-toprak 9, sf-yp-ahsap-tas 8, sf-yp-cati 12). order 140–143. Denetim: `check-sifirdan.ts 06-yapi` → hata yok.

Not: Görevde 5 kategori önerildi, ama SIFIRDAN_YAZIM.md paket başına en çok 4 kategori istiyor. Bu yüzden "Çatı, kapı, pencere" ile "Yardımcı yapılar" tek kategoride birleşti: "Çatı, kapı ve ek yapılar".

## Rehber başına kaynaklar

| Rehber | Kaynaklar |
|---|---|
| sf-yp-yer-secimi | FAO Farm dwellings; FAO Foundations; Wikipedia Landslide; Wikipedia Earth shelter |
| sf-yp-gunes-yonu | Wikipedia Passive solar; Wikipedia Earth shelter; FAO Dwellings; FAO Walls. Güneş açıları enlemden hesaplandı. |
| sf-yp-temel | 1975 yönetmeliği Bölüm 11; 1998 yönetmeliği (DergiPark makalesi); FAO Foundations; FAO damp-proofing; Building Conservation (kireç) |
| sf-yp-deprem | 1975 yönetmeliği Bölüm 11; 1998 yönetmeliği; FSM tezi (TBDY 2018) |
| sf-yp-doseme | FAO Floors; FAO Earth; FAO Foundations |
| sf-yp-yalitim | FAO Climate; FAO Earth; USFS Building with Logs; Wikipedia Yurt; FAO Roofing |
| sf-yp-bakim | Henry Ford log bakımı; FAO Wood; ECHO; Wikipedia Wood preservation |
| sf-yp-toprak-testi | FAO Earth; NPS; ECHO; GreenHomeBuilding |
| sf-yp-kerpic-1 | FAO Earth; ECHO; GreenHomeBuilding; 1975 yönetmeliği |
| sf-yp-kerpic-2 | FAO Earth; ECHO; GreenHomeBuilding; 1975 yönetmeliği; FSM tezi (TS 2514) |
| sf-yp-kerpic-duvar | 1975; 1998; ECHO; FAO Walls |
| sf-yp-yigma-toprak | FAO Earth; Mother Earth News; California BK103 ve BK105; 1975 |
| sf-yp-sikistirma-toprak | FAO Earth; FAO Walls; Bhutan Rammed Earth Manual |
| sf-yp-dal-orgu | Wikipedia Wattle and daub; FAO Walls; Wikipedia Wood preservation |
| sf-yp-siva | Building Conservation; Wikipedia Lime plaster; Henry Ford; ECHO; Wikipedia Wattle and daub |
| sf-yp-gomuk-ev | Wikipedia Earth shelter; Wikipedia Sod roof; FAO Foundations |
| sf-yp-kutuk-secme | USFS Building with Logs; FAO Poles and timber; FAO Wood |
| sf-yp-kutuk-gecme | USFS Building with Logs; Henry Ford |
| sf-yp-kutuk-doldurma | Henry Ford; USFS |
| sf-yp-harcsiz-tas | Peak District NP; FAO Walls; 1975 |
| sf-yp-kirec | Wikipedia Lime kiln; Ballenberg Müzesi; FAO bricks/lime; Building Conservation; Wikipedia Lime plaster |
| sf-yp-tas-duvar | FAO Walls; 1975; 1998; Building Conservation; FAO (puzolan) |
| sf-yp-ahsap-iskelet | Wikipedia Timber framing; FAO Foundations; FAO Wood; Wikipedia Wattle and daub |
| sf-yp-merdiven | OSHA ladder kartı; Wikipedia Ladder; Wikipedia Timber framing |
| sf-yp-cati-egim | FAO Roofing; 1975; 1998; FAO Walls; FAO damp-proofing |
| sf-yp-toprak-dam | 1975; 1998; FAO Roofing; Wikipedia Sod roof |
| sf-yp-saz-cati | FAO Roofing; FAO Organic materials |
| sf-yp-sindil | Wikipedia Wood shingle; USFS; FAO Roofing; Wikipedia Wood preservation |
| sf-yp-kiremit | FAO Burnt-clay bricks; FAO Roofing; 1975 |
| sf-yp-kapi | 1975; 1998; Wikipedia Hinge; USFS |
| sf-yp-pencere | Wikipedia Window; 1998; 1975; Wikipedia Passive solar |
| sf-yp-kar-barinak | Wikipedia Snow cave; Wikipedia Quinzhee; Wikipedia Igloo |
| sf-yp-yurt | Wikipedia Yurt; Wikipedia Felt |
| sf-yp-kece | Wikipedia Ala kiyiz; Wikipedia Felt |
| sf-yp-cit | Wikipedia Split-rail fence; Wikipedia Wattle and daub; FAO Poultry; Wikipedia Wood preservation |
| sf-yp-ahir-kumes | FAO Sheep and goat housing; FAO Poultry; FAO Dwellings |

## Bölme, birleştirme, ekleme
- 103 (kerpiç tuğla) ikiye bölündü: kerpic-1 (çamur hazırlama) ve kerpic-2 (kalıplama, kurutma).
- 112 ikiye bölündü: kirec (kireç yakma ve söndürme) ve tas-duvar (harçlı taş duvar).
- 108–110 (kütük) üç ayrı rehber olarak yazıldı. Katalogdaki diğer maddeler birer rehber oldu.
- Yeni rehber eklenmedi.

## Deprem doğrulaması ve açık şüpheler
1. **TBDY 2018 ve kerpiç.** FSM tezine göre TBDY 2018 kerpiçe yapı malzemesi olarak izin vermiyor. TBDY 2018 metnini (mevzuat.gov.tr) okuyamadım; site robots engeli verdi. Rehberlerdeki sayısal kerpiç kuralları 1975 Bölüm 11 ile 1997/98 yönetmeliğinden (DergiPark makalesi) alındı. ÇŞİDB'nin kerpiçe özel bir yayınını bulamadım; bulunan ÇŞİDB PDF'i yığma bina risk değerlendirmesiydi ve kerpiç için yalnız "mühendislik raporu" diyordu. **Uzman, TBDY 2018 Bölüm 11'i okuyup teyit etmeli.**
2. **Yönetmelikler arası çelişkiler.** Hep tutucu olan değer kullanıldı:
   - Pencere: 1975 "1,40 × 0,90", 1998 "0,90 × 1,20" diyor. 0,90 × 1,20 m alındı.
   - Boşluklar arası dolu duvar: 1975 60 cm, 1998 1,0 m diyor. 1,0 m alındı.
   - Saçak: 1975 "en az 0,50 m", 1998 makalesi "en fazla 50 cm", FAO "~0,6 m" diyor. Rehberlerde 50–60 cm yazdım.
3. **Dış kerpiç duvar kalınlığı.** 1975 metninde kesir net okunamadı; 1998 makalesi "1,5 kerpiç boyu" diyor. TS 2515'e göre deprem bölgesinde en az 47 cm.
4. **Kaynakta ayrıntısı olmayan, genel uygulama bilgisiyle yazılan adımlar:**
   - kuru taş duvarda "bir üstte iki" kuralı;
   - kapı çaprazının yönü, deri menteşe ve demir pim menteşe;
   - pencere zarının hazırlanması;
   - keçede katları çapraz serme ve çimdik testi;
   - yurt kafes düğümü;
   - kiremit "kiraz kırmızısı" renk ölçütü (FAO tuğla verisi kiremide uygulandı);
   - kireç taşında sirke testi.
5. **Yasal not.** Orman Kanunu (6831) notunu mevzuat.gov.tr'den doğrulayamadım; erişim engellendi. Not madde numarası vermeden yazıldı. Yapı ruhsatına (3194 İmar Kanunu) ilişkin bir not eklenmedi; gerekip gerekmediğine editör karar versin.
6. **Arama sınırı.** Oturumun web arama kotası doldu. Bu yüzden Türkçe toprak dam ve loğ taşı, keçe ile topak ev ve kar barınağında karbonmonoksit için ayrı Türkçe ve resmî kaynak aranamadı. Karbonmonoksit ve çığ uyarıları güvenlik yönünde eklendi.

## Uzmana sorulacaklar
- İnşaat mühendisi: TBDY 2018'de kerpiç ve yığma taş için güncel hüküm var mı? Bu rehberlerdeki 1975/1998 ölçüleri hayatta kalma koşulunda savunulabilir mi?
- Toprak dam: 3.–4. derece bölgelerde bile tavsiye edilmeli mi, yoksa tamamen "yapmayın" mı denmeli?
- Gömük ev: yan basınç için güvenli derinlik ve duvar kalınlığı.
