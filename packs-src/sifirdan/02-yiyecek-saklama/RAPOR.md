# Sıfırdan: Yiyecek saklama — RAPOR

Paket: sifirdan-yiyecek-saklama (kısa kod ys). 39 rehber, 4 kategori (order 110–113). Denetim: hata yok.

Not: Çalışma sırasında ortak WebSearch kotası doldu. Sonraki konular (zeytin, sirke, tarhana, bulgur, erişte, öğütme, buzhane, bal, tuz, kurut, ekmek oranları) yalnız önceden bilinen URL'lerden WebFetch ile ve sınırlı biçimde teyit edilebildi. Aşağıda "TEK/ZAYIF" yazanlar uzman incelemesi ve ikinci kaynak ister.

## Konu değişiklikleri
- Eklendi: sf-ys-et-guvenligi (trişin, soğuk zincir, kıyma hijyeni). Bütün et rehberlerinin temeli.
- Bölündü: Pastırma → pastirma-1 (tuzlama/pres) + pastirma-2 (çemen/kurutma); Peynir → peynir-1 (maya, teleme) + peynir-2 (salamura) + lor-cokelek; Ekmek → ekmek (ekşi mayalı, bazlama) + yufka-lavas; Balık → balik-tuzlama (lakerda) + balik-kurutma (çiroz); Salamura ve zeytin → salamura + zeytin.
- Birleştirildi: Botulizm ve küf tek rehber (meyve-sebze kategorisinin başında).

## Rehber başına kaynaklar
- sf-ys-et-guvenligi: USDA FSIS Jerky, CDC Trichinellosis, NCHFP Jerky.
- sf-ys-et-kurutma: NCHFP Jerky, USDA FSIS Jerky.
- sf-ys-pastirma-1: Kayseri Pastırması CI belgesi, TÜBİTAK Turk J Vet Anim Sci 25(6).
- sf-ys-pastirma-2: aynı iki kaynak.
- sf-ys-kavurma: YÖK tezi (C. sporogenes kavurmada sağ kalıyor), WHO Botulism, FSIS Smoking. Geleneksel adımlar için resmi tarif yok (ZAYIF).
- sf-ys-sucuk: WHO, CDC, FSIS, Kayseri CI. Sucuk tuz/kurutma sayısı bilerek verilmedi.
- sf-ys-balik-tuzlama: Sinop Lakerdası CI, GOV.UK/FSA parazit dondurma, UC ANR.
- sf-ys-balik-kurutma: ICAR-CIFT, UC ANR, CNN Türk (çiroz), GOV.UK.
- sf-ys-tutsuleme: Alaska Üniv. Extension, UC ANR, USDA FSIS, FAO/Torry, GOV.UK.
- sf-ys-tutsu-firini: aynı kaynaklar; çadır/kanal ölçüleri kaynakta yok, sayı verilmedi.
- sf-ys-botulizm: WHO, NCHFP Ensuring Safe Canned Foods, BfR (yağda sebze), NTV/uzman (10 dk kaynatma).
- sf-ys-meyve-kurutma: Clemson HGIC, NCHFP Packaging/Storing, TOB Aydın (kerevet/aflatoksin).
- sf-ys-sebze-kurutma: NDSU FN1588, Clemson, NCHFP.
- sf-ys-pestil-kome: Gümüşhane Üniv. pestil-köme, Antep Muskası CI.
- sf-ys-pekmez: Pekmez CI belgesi, TGK Üzüm Pekmezi Tebliği, Antep CI (briks ≥68–70).
- sf-ys-tursu: NCHFP Dill Pickles, NCHFP Sauerkraut, FAO combined methods bölüm 5.
- sf-ys-salamura: FAO bölüm 5 (%6–10 → %16), NCHFP.
- sf-ys-zeytin: FAO, WHO, NCHFP; zeytine özgü %10 salamura ve sele yöntemi kaynakla doğrulanamadı (ZAYIF).
- sf-ys-sirke: FAO, NCHFP (yalnız %5 asitlik bağlamı); yapım süreci kaynakla doğrulanamadı (ZAYIF).
- sf-ys-tarhana: FAO, Clemson, NCHFP (genel kurutma/fermantasyon); TGK Tarhana Tebliği'ne erişilemedi (ZAYIF).
- sf-ys-sut-kaynatma: CDC Raw milk, FDA Raw milk, FAO APH 85.
- sf-ys-yogurt: FAO APH 85 (80 °C, 37–45 °C, %5 maya, 4+ saat), FDA.
- sf-ys-kurut-kes: FAO APH 85, Clemson (ZAYIF; kurut/keşe özgü sayı yok).
- sf-ys-peynir-1: FAO APH 85 peynir bölümü, FDA, CDC.
- sf-ys-peynir-2: FAO, CDC, FDA; %12–14 salamura doğrulanamadı.
- sf-ys-lor-cokelek: FAO APH 85 (iki bölüm).
- sf-ys-tereyagi-sadeyag: FAO APH 85 (TEK kaynak).
- sf-ys-eksi-maya: King Arthur Baking (TEK resmi olmayan kaynak), FAO.
- sf-ys-ekmek: King Arthur (ZAYIF; hamur oranları yaygın fırıncı oranları).
- sf-ys-yufka-lavas: NCHFP, King Arthur (ZAYIF; geleneksel uygulama).
- sf-ys-bulgur: Wikipedia Bulgur, FAO Bull. 109 (nem).
- sf-ys-eriste: NCHFP, Clemson (ZAYIF).
- sf-ys-ogutme: FAO Bull. 109 (ZAYIF; el değirmeni ve çavdar mahmuzu genel bilgi).
- sf-ys-tahil-saklama: FAO Bull. 109 (5 bölüm).
- sf-ys-kiler: FAO combined methods bölüm 2, FAO Bull. 109.
- sf-ys-kumda-saklama: FAO bölüm 2 (TEK).
- sf-ys-buzhane: Wikipedia Ice house (TEK, ZAYIF).
- sf-ys-bal: WHO (yalnız bebek botulizmi). Kristalleşme ve deli bal bilgisi doğrulanamadı (ZAYIF).
- sf-ys-tuz: Wikipedia Sea salt (TEK, ZAYIF).

## Açık kalan şüpheler
1. Kür tuzu (nitrit) olmadan pastırma ve sucuk: geleneksel üretim nitritle yapılıyor. Kür tuzu yokken güvenli bir yol önerilemedi. Rehberler bu yüzden "pişirerek yiyin" diyor; uzman görüşü gerekli.
2. Kavurma: oda sıcaklığında yağ altında saklama geleneksel ama sporlar sağ kalıyor (YÖK tezi). Önerilen: 10 °C altı, her seferinde iyice ısıtma. Güvenli saklama süresi bulunamadı.
3. Ev konservesini 10 dk kaynatma: WHO toksinin >85 °C 5 dk ile bozulduğunu söylüyor, 10 dk Türk uzman görüşü. Bunu "güvence" gibi sunmamaya çalıştım.
4. Çiğ sütten peynir ve Brusella: Sağlık Bakanlığı'nın "taze peynir salamurada en az 3 ay" önerisi sayfaya erişilemediği için (robots) doğrulanamadı ve rehbere yazılmadı. Rehber pastörize süt öneriyor.
5. Sebzeyi güneşte kurutma: ABD kaynakları önermiyor, Türk geleneği yapıyor. Güneşte kurutma + fırında/soba üstünde bitirme önerildi.
6. Lakerda ve tuzlu balıkta parazit: dondurucu yoksa pişirerek yemek öneriliyor; geleneksel lakerda çiğ yenir.
7. Zeytin salamura oranı (%10), sele zeytin tuz oranı, beyaz peynir salamurası (%12–14), ekmek oranları ve sirke süreci kaynakla doğrulanmadı.
8. Tuz: Türkiye'de deniz suyundan tuz üretiminin yasal durumu araştırılamadı; `note` eklenmedi. Gerekirse eklenmeli.
9. Sirke, yasak kuralı gereği alkol aşamasını "içilmez, metanol riski" uyarısıyla geçiyor.

## Uzmana sorulacaklar
- Gıda mühendisi: kür tuzsuz kuru et ürünleri, kavurmanın oda sıcaklığında saklanması, zeytin ve peynir salamura oranları.
- Halk sağlığı / enfeksiyon: Brusella için peynir bekletme süresi; ev konservesini kaynatma önerisi.
- Su ürünleri: lakerda/çirozda Anisakis ve histamin riski.
