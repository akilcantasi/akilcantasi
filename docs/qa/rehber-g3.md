# Rehber görsel QA — g3

Tarih: 2026-11-01. 20 rehber, her adım kartı (çizim + metin), başlık ve "Yapmayın" listesi görüntülenip incelendi. Dosyada düzeltme gerekmedi; `npx vitest run tests/guides.test.ts` geçti (191/191).

## Rehber bazında sonuç

- ilk-yardim-bebek-bogulma: OK. (6. adım çiziminde iki başparmakla sarma tekniği belirsiz; aşağıya bakın.)
- ilk-yardim-suda-bogulma: OK.
- ilk-yardim-elektrik-carpmasi: OK. Not: 7. adım ("yan yatırın") çizimsiz; mevcut `recovery-position` uygun düşer, isteğe bağlı eklenebilir.
- ilk-yardim-sok: OK.
- ilk-yardim-anafilaksi: OK.
- ilk-yardim-astim: OK.
- ilk-yardim-kalp-krizi: OK.
- ilk-yardim-inme: OK.
- ilk-yardim-seker-dusmesi: OK.
- nobet: Metin/çizim OK. Görüş: `callEmergency` yok, 112 bandı görünmüyor; oysa 4., 6., 8., 9. adımlar 112 diyor. Bant eklenip eklenmeyeceği içerik kararı, değiştirilmedi.
- ilk-yardim-bayilma: Metin/çizim OK. Görüş: nöbet ile aynı, 112 bandı yok; 4., 6., 8. adımlar 112 diyor. Değiştirilmedi.
- nukleer-radyasyon: OK.
- kimyasal-sizinti: OK (112 ve 114 doğru kullanılmış).
- nukleer-salgin: OK.
- nukleer-korunma-odasi: OK.
- nukleer-patlama-sonrasi: Metin OK; 2. adım çiziminde yön çelişkisi (aşağıya bakın).
- nukleer-maske-kullanimi: OK.
- ozel-gruplar-bebek-bakimi: OK.
- ozel-gruplar-bebek-beslenme: Çizimler OK. Görüş: 10. adım (elleri ve kapları yıkayın) mamanın hazırlanmasından (6–7. adım) sonra geliyor; mantıken hazırlıktan önce olmalı. Sıra içerik kararı olduğu için değiştirilmedi.
- ozel-gruplar-hamile: OK.

Kaydırma (adım/çizim kayması), yazım hatası, yabancı acil numara, taşma ya da kesilme bulunmadı.

## Yeniden çizilmesi gereken çizimler

| Çizim id | Rehber | Adım | Sorun |
|---|---|---|---|
| no-elevator | nukleer-patlama-sonrasi | 2 | Kişi merdiveni yukarı çıkar gibi sağa dönük, ok ise aşağı-sola gösteriyor; aşağı inerek tahliye net değil. Kişi aşağı inerken çizilmeli. |
| ilk-yardim-bebek-gogus-basisi | ilk-yardim-bebek-bogulma | 6 | Hafif: eller göğsü sarıyor, ama iki başparmağın göğüs kemiğinin alt yarısında olduğu net seçilmiyor. Bilek/el tek bir elin yukarıdan bastırması gibi okunabiliyor. |
