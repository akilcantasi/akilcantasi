# Rehber görsel QA — g4

Tarih: 2026-11-01. Her rehberin başlık, adım kartları ve "Yapmayın" listesi görüntülenip incelendi (390 px mobil görünüm). `npx vitest run tests/guides.test.ts` geçti (191/191).

## Rehberler

- ozel-gruplar-acil-dogum — OK. Çizimler adımlarla uyumlu, 112 bandı var. Not (tıbbi, değiştirilmedi): 9. adım "kordonu kesmeyin, bağlamayın" diyor, Yapmayın listesi "112 görevlisi söylemedikçe" diyor; ikisi uyumlu ama 9. adıma da "112 söylemedikçe" eklenebilir, uzman bakmalı.
- ozel-gruplar-yasli — OK. 112 bandı var. 10. adımdaki genel "stay-calm-talk" çiziminde yaşlı biri yok; kabul edilebilir.
- ozel-gruplar-engelli-hareket — Yapmayın listesinde dil düzeltmesi: "Yangın ya da deprem sonrası asansöre binmeyin." → "Yangında ya da depremden sonra asansöre binmeyin." 6. adım çiziminde sorun var (aşağıda).
- ozel-gruplar-engelli-gorme-isitme — OK. 5. adım çiziminde küçük sorun var (aşağıda).
- ozel-gruplar-engelli-zihinsel — OK. Not: 8. adım 112'den söz ediyor ama `callEmergency` yok, bu yüzden 112 bandı görünmüyor; arama koşullu olduğu için kabul edilebilir.
- ozel-gruplar-kronik-hastalik — OK. 112 bandı var.
- ozel-gruplar-evcil-hayvan — OK.
- psikoloji-ilk-yardim — OK.
- psikoloji-panik-atak — OK. Küçük düzen notu: 1. adımda "5–20" satır sonunda tireden bölünüyor ("5–" / "20"). 5. adımın çiziminde kişinin başı kadraj dışında (bilerek ayaklara odaklanılmış olabilir).
- psikoloji-cocukla-konusma — OK.
- psikoloji-cocuk-stres-belirtileri — OK. 4. adım çiziminde küçük sorun var (aşağıda).
- psikoloji-yas — OK.
- psikoloji-uyku-stres — OK. 6. adım "Yatakta" diyor ama çizimde ayakta/oturan biri var; kabul edilebilir.
- psikoloji-gonullu-tukenmislik — OK.
- psikoloji-travma-tepkileri — OK.
- psikoloji-intihar-dusuncesi — OK. 112 bandı var.

Kaymış çizim yok; `art` dizilerinde değişiklik yapılmadı.

## Yeniden çizilmesi gereken çizimler

| Çizim | Rehber | Adım | Sorun |
|---|---|---|---|
| ozel-gruplar-sandalye-merdiven | ozel-gruplar-engelli-hareket | 6 | Alttaki yardımcı sandalyeyi ön çerçeveden/ayaklık yakınından tutuyor; bu, 5. adımdaki "kolçak ya da ayaklıktan tutup kaldırmayın" uyarısıyla çelişiyor. Üstteki yardımcının elleri de tutamaklara tam değmiyor. |
| psikoloji-cocuk-karin-agrisi | psikoloji-cocuk-stres-belirtileri | 4 | Ağrı çizgileri karında değil dizlerin yanında duruyor; karın ağrısı yerine diz ağrısı ya da yara gibi okunuyor. |
| ozel-gruplar-isitme-dikkat | ozel-gruplar-engelli-gorme-isitme | 5 (küçük) | İşitme engelli kişinin kulağının yanında ses dalgaları var; kişi sesi duyuyormuş gibi görünüyor. Bunun yerine dokunma ya da dikkat işareti olmalı. |
| psikoloji-ayak-yere | psikoloji-panik-atak | 5 (isteğe bağlı) | Kişinin başı kadrajın dışında kalıyor. |
