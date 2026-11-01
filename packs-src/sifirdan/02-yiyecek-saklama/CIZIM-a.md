# Çizim raporu (a) — sifirdan-yiyecek-saklama, batch sc-02a

Dosya: `scenes-a.tsx`. 20 rehber × 3 çizim = 60 sahne + 4 kategori kapağı = 64 sahne.
`scenes.tsx` zaten A ve B'yi birleştiriyordu; dokunulmadı.

## Oyuncular (dosya başında `CAST`, `HASAN/RIZA/AYSE/ZEYNEP`, yakın plan elleri `EL`)
- HASAN (et): adam, ten 1, kısa siyah saç, bıyık, kiremit (#c6574e) uzun kollu üst, koyu pantolon. Et güvenliği, et kurutma, pastırma 1-2, kavurma, sucuk.
- RIZA (balık, tütsü): adam, ten 2, kısa koyu saç, lacivert (#2f5d8a) uzun kollu kazak, haki pantolon. Balık tuzlama, balık kurutma, tütsüleme, tütsü fırını.
- AYSE (meyve-sebze): kadın, ten 1, hardal yazma, yeşil (#6c9c5a) uzun kollu üst, gri-mor uzun etek. Meyve kurutma, sebze kurutma, pestil-köme, pekmez.
- ZEYNEP (fermente, güvenlik): kadın, ten 0, koyu topuz, mor (#8f6fc2) uzun kollu üst, koyu pantolon. Botulizm, turşu, salamura, zeytin, sirke, tarhana.
- Malzeme renkleri `MAT` sabitinde (et, yağ, tuz, tahta, toprak küp, sırlı küp, demir, kalaylı bakır, cam, salamura, ip, şıra, pekmez, tarhana hamuru…). Hepsi export edildi; b ajanı aynı değerleri kullanabilir.

## Rehber başına (çizilen adım no → kimlik; geri kalanlar null)
- et-guvenligi: 1 et-serin-asma, 4 trisin-yasak, 5 et-pismis-kesit. Null: 8 el-yikama-bicak.
- et-kurutma: 2 et-serit-kesme, 4 et-kaynatma, 5 et-kurutma-askisi. Null: 8 et-bukme-testi. (Kesme sahnesi 1. adımdaydı, metindeki "0,5 cm" 2. adım olduğu için oraya taşındı.)
- pastirma-1: 3 yarma, 4 tuz, 8 pres. Null: 7 pastirma-asma (sahne çemenli, süzdürme adımına uymuyor).
- pastirma-2: 3 cemen-kaplama, 5 cemen-siyirma, 6 pastirma-asma. Null: 1 cemen-hamuru.
- kavurma: 3 kavurma-kazan, 5 kavurma-kup, 8 kavurma-isitma. Null: 1 kavurma-dograma.
- sucuk: 1 sucuk-cig-yasak, 6 sucuk-doldurma, 7 sucuk-asma. Null: 3 sucuk-kiyma.
- balik-tuzlama: 1 taze-secim, 2 dilimleme, 5 lakerda-katman (değişmedi).
- balik-kurutma: 2 tuza-gomme, 5 ciroz-ip, 9 ciroz-atesleme. Null: 1 balik-yarma.
- tutsuleme: 1 sicak-soguk, 5 odun, 6 termometre. Null: 2 tutsu-salamura.
- tutsu-firini: 2 cadiri, 3 izgara, 6 soguk-tutsu-kanal. Null: 4 tutsu-koz.
- botulizm: 5 yagda-sarimsak-yasak, 6 kabarik-kapak, 7 konserve-kaynatma. Null: 1 botulizm-havasiz, 2 botulizm-az-asitli (soyut tablo/simge).
- meyve-kurutma: 4 kerevet-tul, 5 meyve-ip, 8 kavanoz-sallama. Null: 2 meyve-dilimleme, 7 meyve-kuruluk-testi.
- sebze-kurutma: 2 domates, 3 biber-ip, 4 patlican-oyma. Null: 8 sebze-kuruluk-testi.
- pestil-kome: 3 herle, 5 pestil-serme, 7 kome-batirma (değişmedi).
- pekmez: 4 sira-aktarma, 5 pekmez-kazan, 6 pekmez-kivam. Null: 1 uzum-ezme, 2 pekmez-topragi.
- tursu: 1 salatalik-uc, 2 salamura-tartma, 5 tursu-agirlik. Null: 7 tursu-kuf-alma.
- salamura: 2 yaprak-rulo, 3 yaprak-kavanoz, 7 tuz-alma (değişmedi).
- zeytin: 1 zeytin-cizme, 3 zeytin-salamura, 4 zeytin-sele. Null: 2 zeytin-su-degistirme (rehberin önermediği yol).
- sirke: 1 uzum-ezme, 3 bez-ortu, 6 sirke-anasi (değişmedi).
- tarhana: 5 serme, 6 ovma, 7 eleme. Null: 2 tarhana-yogurma.
- Kapaklar: sf-ys-et-kapak, sf-ys-meyve-sebze-kapak, sf-ys-sut-kapak, sf-ys-tahil-kiler-kapak.

Null yapılan kimliklerin spec satırları silinmedi (b ajanıyla çakışmamak ve ileride kullanılabilsin diye).

## spec.ts sadeleştirmeleri
Çizilenle birebir olsun diye kendi kimliklerimin açıklamaları güncellendi. Başlıcaları: eldiven kaldırıldı (çemen kaplama); kavurma ısıtma, konserve kaynatma, ciroz ateşleme sahnelerindeki "küçük resim" kaldırıldı, yerine saat/sıcaklık etiketi; sucuk doldurmada huniyi iten el kaldırıldı (dolum yönü okla); meyve ve sebze kapağından pekmez kazanı çıkarıldı.

## Kalan şüpheler
- sf-ys-balik-dilimleme: yan yatmış başsız palamut yukarıdan profil olarak çizildi; dilimlerin "steak" olduğu yeterince açık olmayabilir.
- sf-ys-lakerda-katman: dilim kesitleri pembe kutucuklar, sırt derisi mavi şerit; balık olduğu etiket olmadan zayıf okunabilir.
- sf-ys-soguk-tutsu-kanal: hendek toprağın içinde değil yamaç yüzeyinde koyu bant olarak görünüyor.
- sf-ys-tarhana-ovma: iki avuç birbirinden biraz ayrık; "ovma" hareketi tam okunmayabilir.
- sf-ys-sut-kapak: battaniyeye sarılı tencere kırmızı ekoseli bir yumak gibi duruyor.
- Paket genelinde kişiler profilde ve küçük; yüz ifadeleri `neutral`.
