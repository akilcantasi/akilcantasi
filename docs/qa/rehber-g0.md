# Rehber görsel QA — g0

Tarih: 2026-11-01. 23 rehber, tüm adım kartları, başlık ve "Yapmayın" listeleri incelendi. Kaydırılmış resim dizisi bulunmadı; `art` dizilerinde değişiklik gerekmedi. `npx vitest run tests/guides.test.ts` geçti (191/191).

## Rehberler

- cadir-barinma: OK
- toplanma-alani: OK
- barinma-acil-tuvalet: OK
- barinma-guvenli-isitma: Adım 8 yazım düzeltildi ("Yanında" → "Yanınızda"). Not: 9. adım 112 içeriyor ama 112 bandı (callEmergency) yok; koşullu olduğu için değiştirilmedi, karar içerik ekibinde.
- barinma-kis-cadir: OK. Not: 9. adımda 112 var, band yok (koşullu; değiştirilmedi).
- barinma-kamp-hijyen: OK
- barinma-sicak-kalma: OK
- deprem-aninda: OK
- deprem-sonrasi: OK
- enkaz-altinda: OK (112 bandı var)
- enkaz-kurtarma: OK (112 bandı var)
- deprem-kalabalik-alan: OK
- deprem-hasarli-bina: OK. Not: 4. adımda 112 var, band yok (koşullu; değiştirilmedi).
- deprem-cocuklar: OK
- deprem-yuksek-bina: OK
- hipotermi: OK (112 bandı var)
- doga-kaybolma: OK (112 bandı var)
- hayvan-isirigi: Adım 4 anlatım düzeltildi ("Yılan ve akrepte ısırılan kolu…" → "Yılan ısırığında ve akrep sokmasında o kolu…"). 114 doğru kullanılmış.
- doga-hava-degisimi: OK. Not: 9. adımda 112 var, band yok (koşullu; değiştirilmedi).
- doga-yalniz-yaralanma: OK. İçerik sorusu (değiştirilmedi): 6. adımda yalıtım için "ip" sayılmış; yalıtım malzemesi olarak tuhaf, kontrol edilmeli.
- guvenlik-kayip-cocuk: OK (112 bandı var, ALO 183 doğru)
- guvenlik-yardim-dolandiriciligi: OK
- guvenlik-cadir-kent: OK (112 bandı var, ALO 183 / KADES doğru)

## Yeniden çizilmesi önerilen resimler

| art id | rehber | adım | sorun |
|---|---|---|---|
| doga-yilan-hareketsiz | hayvan-isirigi | 4 | Isırılan bacak yastıklarla yukarı kaldırılmış görünüyor; ısırılan uzuv yükseltilmemeli, kalp hizasında ve hareketsiz tutulmalı. |
| barinma-folyo-battaniye | barinma-sicak-kalma | 8 | Kişi dışarıda karda çizilmiş; rehber "evde" sıcak kalma (küçük sorun). |
| hayatta-kalma-katman-giyin | doga-hava-degisimi | 8 | Metin "ıslanmadan giyin" diyor, resimde yağmur zaten yağıyor (küçük sorun). |
| guvenlik-banka-ara | guvenlik-yardim-dolandiriciligi | 8 | Dolandırılmış kişi neşeli gülümsüyor; duruma uymuyor (küçük sorun). |

Taşma, kırpılma ya da yabancı acil numara görülmedi.
