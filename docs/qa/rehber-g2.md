# Rehber görsel QA — g2

Tarih: 2026-11-01. 21 rehber; her rehberin başlığı, her adım kartı (çizim + metin) ve "Yapmayın" listesi görüntülenip incelendi. Kaymış çizim yok; dosyada düzeltme gerekmedi. `npx vitest run tests/guides.test.ts` geçti (191/191).

## Rehber bazında sonuç

- hayatta-kalma-sicak: OK. Not: özet ve 7.–8. adımlar 112 diyor ama 112 bandı yok (hayati kategori değil). Bant eklenip eklenmeyeceği içerik kararı, değiştirilmedi.
- hayatta-kalma-dere-gecme: OK (akıntı yönü, sopa ve yüzme pozisyonu çizimlerle tutarlı).
- hayatta-kalma-vahsi-hayvan: OK.
- hayatta-kalma-dugumler: OK.
- afet-cantasi: OK.
- iletisim: OK. Küçük not: 8. adım çiziminde "6× / 1 dk" rozeti var, metin yalnızca "kısa düdükleri aralıklarla" diyor. Çelişki yok ama metinle birebir değil.
- hazirlik-ev-sabitleme: OK.
- hazirlik-aile-afet-plani: OK.
- hazirlik-arac-kiti: OK.
- hazirlik-belgeler: OK.
- hazirlik-ilk-yardim-cantasi: OK.
- hazirlik-is-okul: OK.
- hazirlik-evcil-hayvan: OK. Not: 6. adım çizimi fotoğrafın yanında sağlık karnesini (5. adımın konusu) de gösteriyor; sorun değil.
- ilk-yardim-ilk-degerlendirme: OK (112 bandı var).
- kanama: OK (turnike yaranın üst tarafında, dizden uzakta; doğru).
- temel-yasam-destegi: OK.
- ilk-yardim-cocuk-kpr: Metin OK. 5. adım çiziminde sorun var, aşağıya bakın.
- ilk-yardim-bebek-kpr: Metin OK. 8. adım çiziminde sorun var, aşağıya bakın.
- ilk-yardim-oed: OK.
- derlenme-pozisyonu: OK.
- hava-yolu-tikanmasi: OK.

Taşma ya da kırpılma yok. Yabancı acil numara yok. Hayati ilk yardım rehberlerinin hepsinde 112 bandı görünüyor.

## Yeniden çizilmesi gereken resimler

| art id | rehber | adım | sorun |
|---|---|---|---|
| ilk-yardim-cocuk-kpr-tek-el | ilk-yardim-cocuk-kpr | 5 | Kurtarıcının dizi/bacağı çocuğun gövdesinin üstünde duruyor; çocuğun üstüne diz çökmüş gibi görünüyor. Bası yapan kol tam dik değil. Kurtarıcı çocuğun yanında diz çökmeli, el topuğu alt sternumda olmalı. |
| ilk-yardim-bebek-kpr-tek-el | ilk-yardim-bebek-kpr | 8 | Bası yapan el topuğu göğsün üst kısmında, boyna yakın duruyor. Metin "aynı noktaya" (alt sternum, meme uçlarının hemen altı) diyor. El aşağı taşınmalı. Bebeğin yüz yönü de biraz garip. |
