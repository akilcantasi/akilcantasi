# Çizim raporu (a): Ateş, ısınma ve pişirme (sc-07)

Dosya: `scenes-a.tsx`. 79 sahne var: 76 adım çizimi ve 3 kategori kapağı. 26 rehberin hepsi çizildi; rehber başına en çok 3 çizim var. Derleme uyarısı yok, `check-sifirdan` sonucu "hata yok", tsc temiz.

## Oyuncular (CAST)
- `ates`: esmer, siyah saçlı adam, camgöbeği uzun kollu üst, haki pantolon. Çakmaktaşı, mercek, yay matkabı, kav ve köz rehberlerinde (yakın plan ellerde de aynı ten ve kol).
- `odun`: bıyıklı, kahverengi saçlı adam, hardal gömlek. Odun yarma.
- `isik`: atkuyruklu kadın, yeşil üst. Meşale.
- `ev`: kısa saçlı adam, mavi üst. Karbonmonoksit (uyuyan kişi) ve kütle soba sürgüsündeki el.
- `firin`: başörtülü kadın, kiremit üst, uzun etek. Kubbe fırın, tandır, sac ve su damlası elleri.

Paket genelinde aynı malzeme renkleri sabit `M` nesnesinden gelir: kerpiç, kil, tuğla, ateş tuğlası, taş, odun ve kesik yüz, yapı ahşabı, demir, sac, kül, köz, toprak, yanmaz dolgu (`yalitim`) ve saman.

## Rehber başına çizilen adımlar (1 tabanlı)
- çakmaktaşı: 2, 5, 7. Null: 4 (tutuş, vuruş çizimiyle aynı), 1, 3, 6, 8.
- mercek: 2, 5.
- yay matkabı: 2 (parçalar ölçüleriyle; 1. adımdan bu adıma taşındı), 5, 7. Null: 8 (kor).
- kav: 2, 3, 5. Null: 1 (bez kesme), 7 (lif yuvası).
- köz taşıma: 1, 4, 5. Null: 3 (mantar).
- odun seçimi: 1, 5. Null: 2 (üç sütunlu tür tablosu, çizimle anlaşılmıyor).
- odun kurutma: 3, 4, 8 (kalas, örtü ve açık yanlar tek sahnede). Null: 6, 9.
- odun kömürü: 2 (çukur kesiti, 1,2 m), 4 (20+20 cm), 7. Null: 5 (yakma).
- aydınlatma: 3, 6, 7. Null: 1 (kandil yapımı), 5 (mum).
- ocak yeri: 2 (90 cm ve siperle 30 cm), 3 (taban kesiti, 45 cm taşma), 5. Null: 1 (plan).
- baca: 1 (90 cm, 60 cm, 3 m), 5 (kil yüksük, 30 cm ve 45 cm), 7 (10–12 mm). Null: 2 (kesit oranı), 3 (eğim).
- yangın güvenliği: 2, 3, 4. Null: 1.
- karbonmonoksit: 1, 2, 5. Null: 3 (sürgü kapak), 7 (belirtiler).
- şömine: 1 (1/10), 3 (Rumford, ≥30 cm), 6 (40/20 cm). Null: 4 (boğaz), 9 (siper).
- roket soba: 1, 3, 5. Kesit sahnesinde L kanal her yerde aynı genişlikte; "12 cm" ve "30–36 cm" (adım 2'nin ölçüsü) aynı sahnede. Yalıtım sahnesi hafif dolgu (✓) ile ağır tuğlayı (✗) karşılaştırıyor. Tencere boşluğu "3 cm". Null: 2, 4.
- kütle soba: 1 (≥800 kg), 3 (180°), 8. Null: 7 (yakış).
- roket kütle ısıtıcı: 3, 5, 6. Metindeki gibi ölçü etiketi yok. Null: 4 (yükselticinin yalıtımı J sahnesinde zaten görünüyor), 8.
- yer ısıtma: 1, 3, 7. Null: 4, 5.
- kubbe fırın 1: 2, 4, 5 (100% ve %63). Null: 7, 8.
- kubbe fırın 2: 4, 7, 8. Null: 2, 5.
- tandır: 3, 5, 8. Null: 2 (çamur), 7 (beyazlama).
- toprak fırın: 1 (30–45 cm, 0,5–1 m), 5, 7. Null: 2, 3.
- sac: 1, 5, 7. Null: 4, 6.
- saman kutu: 3, 4, 7. Null: 1, 2.
- güneş fırını: 1, 4, 6. Null: 3, 5.
- kap güvenliği: 2, 4, 7. Null: 1, 5.

Değişen sahnelerin spec.ts açıklamaları çizimle uyumlu hale getirildi. Örnekler: kapaklar sadeleşti; tandırdaki kolluk ayrıntısı çıkarıldı; köz kesitine kül kürekle dökülüyor.

## Kalan şüpheler
- yay-durus: kalabalık bir sahne. Bilek ile baldır teması küçük ölçekte seçilmiyor; duruş genel olarak doğru.
- baca-yukseklik: etiketler en az değerleri gösteriyor. Çizim ölçekli değil; bacanın 60 cm kuralına göre yükseldiği görünüyor.
- baca-yuksuk ve komur-ortu-katman: ikişer etiketle sıkışık ama okunuyor.
- kap-kapali-yasak ve kap-galvaniz-yasak: yasak halkası nesnelerin bir kısmını örtüyor.
- tandir-ekmek: kadının eğilip tandıra uzanması biraz sert duruyor.
