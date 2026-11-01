# Rehber görsel QA — g1

Tarih: 2026-11-01. 21 rehber, her adım kartı (çizim + metin), başlık ve "Yapmayın" listesi görüntülenip incelendi. `npx vitest run tests/guides.test.ts` geçti (191/191). Taşma, kesilme ya da yabancı acil numara bulunmadı; 112 bandı sicak-carpmasi, hava-cig ve hayatta-kalma-isaret'te görünüyor.

## Rehber bazında sonuç

- guvenlik-bos-ev: OK.
- guvenlik-yanlis-bilgi: 5. adım emir kipinde değildi; "Fotoğraf ya da videonun eski, başka bir afetten ya da başka bir ülkeden olabileceğini unutmayın." olarak düzeltildi.
- sicak-carpmasi: OK. Görüş (değiştirilmedi): "Yapmayın"daki "su ya da başka bir şey içirmeyin" mutlak; bilinci yerinde kişiye sıvı verilip verilmeyeceği tıbbi denetimde netleştirilmeli.
- firtina-yildirim: Çizimler OK. Görüş: 3. adım ("Fırtına gelmeden ... fişini çekin") hazırlık adımı, içeride yapılacaklardan (2. adım: "fişe takılı aletlere dokunmayın") sonra geliyor; sıra mantıken 3→2 olmalı. İçerik kararı, değiştirilmedi.
- hava-kar-firtinasi: OK. Not: 9. adım 112 diyor ama `callEmergency` yok (bant görünmüyor); koşullu olduğu için değiştirilmedi.
- hava-cig: OK.
- hava-toz-firtinasi: `hava-toz-arac-yol-disi` çizimi (yoldan çıkmış araç) 7. adımdan 6. adıma ("yoldan tamamen çıkıp durun") taşındı; 7. adım (ışıklar/el freni) çizimsiz bırakıldı.
- hava-hortum: OK. Görüş: 4. adım ("Konteyner ... vakit varsa sağlam bir binaya geçin") çömelme adımından sonra geliyor; 1. adımın hemen ardından gelmesi daha mantıklı. Değiştirilmedi.
- hava-sicak-dalgasi: OK.
- hava-dolu: OK.
- hayatta-kalma-su-bulma: OK.
- hayatta-kalma-su-aritma: 8. adımdaki "Cam ya da renkli şişe ve bulanık su olmaz." → "... kullanmayın." olarak düzeltildi. Görüş: 2. adım (dinlendir/süz) kaynatmadan önce yapılacak işlem ama 1. adımdan sonra geliyor; ayrıca WHO şeffaf cam şişeyi de SODIS için uygun sayar, "cam şişe kullanmayın" ifadesi tıbbi denetimde kontrol edilmeli. Değiştirilmedi.
- hayatta-kalma-yon-gunes: OK.
- hayatta-kalma-yon-yildiz: OK.
- hayatta-kalma-yon-saat: OK (4. adım açıortay çizimi doğru).
- hayatta-kalma-pusula-harita: OK.
- hayatta-kalma-ates: OK. Görüş: 9. adımdaki "rüzgârın tersine ... uzaklaşın" belirsiz (rüzgâra karşı mı, rüzgârla aynı yönde mi?); güvenlik içeriği olduğu için değiştirilmedi, netleştirilmeli.
- hayatta-kalma-barinak: OK.
- hayatta-kalma-isaret: OK.
- hayatta-kalma-yabani-yiyecek: OK (114 ve 112 doğru).
- hayatta-kalma-soguk-gece: OK. Not: özet ve 9. adım 112 diyor ama `callEmergency` yok; koşullu, değiştirilmedi.

## Yeniden çizilmesi gereken çizimler

| Çizim | Rehber | Adım | Sorun |
|---|---|---|---|
| hava-buz-noktalari | sicak-carpmasi | 6 | Kollar omuzun üstünden çıkıyor, gövde çok kısa; buz paketleri boyun/koltuk altı/kasık yerine göğüs ve kalçada gibi duruyor. Küçük, isteğe bağlı. |

Diğer tüm çizimler kendi adım metniyle uyumlu.
