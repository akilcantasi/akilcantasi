# Çizim raporu — 03-tarim-hayvancilik, harf a (batch sc-03a)

Dosya: `scenes-a.tsx` (oyuncular, malzeme renkleri, yardımcılar dosya başında).

## Oyuncular (CAST)
- ADAM: bıyıklı çiftçi, buğday ten (skin 1), koyu kısa saç, yeşil gömlek, haki pantolon. Toprak tanıma, kompost, gübre, patates, buğday ekimi.
- KADIN: başörtülü (mor), esmer (skin 2), kiremit gömlek, uzun koyu etek. Fide, filiz, ekim takvimleri, üç kardeş, buğday hasadı, sulama.
- GENC: at kuyruklu genç kadın, açık ten (skin 0), camgöbeği tişört, kot. Tohum saklama, atalık tohum, zararlılar, sera.
- Teras ve ekim nöbeti çizimlerinde kişi yok (düzen ve kesit çizimleri).
- Ortak malzeme renkleri: TOPRAK/TOPRAKD (üst toprak), ALT (alt toprak), KUM, MIL, KIL, KOMPOST, SAMAN, GUBRE, TANE (buğday), ODUN, DEMIR (K.metal), su için K.water.

## Rehber başına çizilen adımlar (adım no 1'den)
- toprak-tanima: 4 şerit, 5 kavanoz çalkalama, 6 kavanoz katları. Null: toprak-ornek, toprak-avuc.
- tohum-saklama: 3 kavanoz, 6 çimlenme testi, 8 sayım (değişmedi).
- atalik-tohum: 4 elle tozlama, 5 ip ile işaret, 7 domates tohumu mayalama. Null: tohum-mesafe.
- fide: 3 ekim derinliği, 6 dipten sulama, 9 derin dikim. Null: fide-harc, fide-alistirma.
- kompost: 3 katlar, 4 sıkma testi, 5 sıcaklık (demir çubuk). Null: aktarma, olgun.
- gubre: 1 yığın, 4 serpme, 8 kül serpme. Null: yesil-gubre.
- filiz: 3 ıslatma, 4 kavanoz ters, 6 hazır filiz. Null: mikro-yesillik.
- ekim-takvimi-yaz: 2 toprak sıcaklığı (el), 6 fide gece örtüsü, 7 Doğu vadisi. Null: harita-ege-akdeniz (Türkiye haritası güvenilir çizilemez), ekim-defteri.
- ekim-takvimi-kis: 1 kar altında buğday fidesi, 7 sarımsak + saman. Null: harita-kisilik (harita).
- patates: 4 dikim, 5 boğaz doldurma, 8 hasat. Null: tohumluk, filiz.
- uc-kardes: 1 tümsekler, 3 fasulye ekimi, 5 olgun üçlü (kabak sahnesi 4. adımdan 5. adıma taşındı). Null: uc-kardes-misir.
- bugday-ekim: 3 eleme, 5 elle serpme (köşede boyuna/enine planı), 6 örtme derinliği. Null: tarla-surme.
- bugday-hasat: 2 orak, 3 demet kurutma, 6 savurma. Null: bugday-olgunluk, harman-dovme.
- ekim-nobeti: 3 dört parsel, 7 birlikte ekim. Null: bitki-aileleri (tablo), bahce-kroki.
- zararlilar: 2 elle toplama, 4 yaprak altına püskürtme, 6 tül örtü. Null: sabunlu-su, faydali-bocek.
- sulama: 5 çanak, 6 testi, 9 malç. Null: karik-sulama, sise-damla.
- teras: 2 A-çerçeve, 4 duvar, 5 kesit (değişmedi).
- sera: 2 soğuk çerçeve, 4 sıcak yastık, 5 havalandırma. Null: soguk-cerceve-yer, tunel-sera.
- Kategori kapakları: dördü de çizildi (toprak-tohum, bahçe-tarla, meyve, hayvan).

spec.ts: çizilen bütün kimliklerin açıklamaları çizime göre sadeleştirildi (çok panelli kurgular tek sahneye indirildi). Null yapılanların spec satırları duruyor.

## Kalan şüpheler
- orak-bicme: kesim yönü oku yok; "25 cm" ölçüsü başaktan kesim yerine. Elde tutulan demet biraz şematik.
- soguk-cerceve / havalandırma: kapak ince bir cam şerit olarak görünüyor, küçük ekranda kasa biraz basık okunabilir; havalandırmadaki dayama taşı çok küçük.
- uc-kardes-fasulye: diz çöken kadının eteği büyük bir kütle gibi; "15 cm" ölçüsü küçük.
- teras-kesit: iki basamaklı kesit şematik; ilk bakışta sade ama anlaşılır.
- yaprak-alti-puskurtme: sprey şişesi elle tutuluyor, şişe ucu biraz büyük.
- Ölçü çizgileri (Dim) ince; etiketler okunuyor.
