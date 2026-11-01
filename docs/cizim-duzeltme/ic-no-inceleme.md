# ic-no — 2. tur bağımsız inceleme (nukleer-doga, ozel-gruplar, barinma, hazirlik, su-gida)

44 rehber, 237 çizim incelendi (çizimi olan adımlar). Yeni sahne kimliği yok; null yapılan çizim yok.
Sahne dosyaları: `src/art/scenes/{nukleer-doga,ozel-gruplar,barinma,hazirlik,su-gida}.tsx`. Spec: `barinma.ts`, `doga.ts`, `hazirlik.ts` (yalnız değişen kimlikler).

Not: makine yükü çok yüksekti (load ~30). `e2e/all-guides-shot.mjs` `networkidle` beklerken zaman aşımına düştü; çekimler aynı mantığı `load` + uzun bekleme + sayfa başına yeniden deneme ile yapan geçici bir kopya (/tmp/ic-no/shot.mjs) ile alındı. Repo'daki betik değiştirilmedi.

## Rehber başına sonuç (ilk değerlendirme: İYİ / ZAYIF / KÖTÜ → son durum)

| Rehber | İYİ | ZAYIF | KÖTÜ | Değişiklik |
|---|---|---|---|---|
| hipotermi | 4 | 2 | 0 | 4 `doga-hipotermi-sarma`: figür küçüktü, yüz kapşon/bereyle kapanıyordu, anlamsız ok vardı → s 1.4, bere başın tepesinde (yüz açık), ok kaldırıldı |
| doga-kaybolma | 5 | 1 | 0 | — (7: yaprak yatağı kütük gibi duruyor, kabul) |
| hayvan-isirigi | 6 | 0 | 0 | — |
| doga-hava-degisimi | 5 | 0 | 1 | 2 `doga-hava-sirttan-in`: minik figürler, kesik yasak işaretleri → uzun yamaç, büyük iki yürüyüşçü aşağı iniyor, tepedeki tek ağaçta yasak; spec güncellendi (kaya çıkarıldı) |
| doga-yalniz-yaralanma | 4 | 1 | 0 | — (6: yaprak yatağı, kabul) |
| nukleer-radyasyon | 5 | 1 | 0 | 4 `nukleer-giysi-cikar`: mont dize kadar inen yeşil çuval gibiydi → kalça boyu mont, omuzlardan sıyrılıyor |
| kimyasal-sizinti | 5 | 1 | 0 | — (1: kuşbakışı figür küçük ama şema okunuyor) |
| nukleer-salgin | 5 | 0 | 0 | — |
| nukleer-korunma-odasi | 5 | 0 | 0 | — |
| nukleer-patlama-sonrasi | 6 | 0 | 0 | — |
| nukleer-maske-kullanimi | 5 | 0 | 0 | — |
| ozel-gruplar-bebek-bakimi | 4 | 1 | 1 | 3 `ozel-gruplar-bebek-ense-kontrol`: annenin eli bebeğin yanağındaydı (ense değil) → `momUpright` nape dokunuşu geriye alındı, el artık ensede. 2 (bere) kabul |
| ozel-gruplar-bebek-beslenme | 5 | 0 | 0 | — |
| ozel-gruplar-hamile | 5 | 0 | 0 | — |
| ozel-gruplar-acil-dogum | 6 | 0 | 0 | — |
| ozel-gruplar-yasli | 6 | 0 | 0 | — |
| ozel-gruplar-engelli-hareket | 5 | 0 | 0 | — |
| ozel-gruplar-engelli-gorme-isitme | 5 | 0 | 0 | — |
| ozel-gruplar-engelli-zihinsel | 4 | 0 | 0 | — |
| ozel-gruplar-kronik-hastalik | 5 | 0 | 0 | — |
| ozel-gruplar-evcil-hayvan | 5 | 0 | 0 | — |
| cadir-barinma | 6 | 0 | 0 | — |
| toplanma-alani | 6 | 0 | 0 | — |
| barinma-acil-tuvalet | 5 | 1 | 0 | 1 `barinma-sifon-yasak`: iki farklı kişiden iki el + iki yasak → tek el, tek yasak |
| barinma-guvenli-isitma | 6 | 0 | 0 | — |
| barinma-kis-cadir | 3 | 1 | 1 | 4 `barinma-bere-corap`: tulum üstünde garip oturuş + boru gibi ıslak çorap → yer yatağında sırtüstü yatan anne, bere, battaniye, kuru yün çoraplar, gece penceresi. 6 `barinma-sicak-icecek` (aşağıda) |
| barinma-kamp-hijyen | 5 | 1 | 0 | 7 `barinma-dirsek-oksurme`: kol bütün yüzü kapatıyordu → dirsek ağız-burun hizasında, gözler görünüyor |
| barinma-sicak-kalma | 4 | 2 | 0 | 2 `barinma-cam-naylon`: naylon ve bant görünmüyordu, anlamsız ok/çizgiler → belirgin naylon, gri geniş bant, bant rulosu; 7 `barinma-sicak-icecek`: iki kişi battaniye "fasulye koltuk" gibiydi → tek kişi önden, battaniyeye sarılı, iki eliyle buharı tüten kupa |
| afet-cantasi | 6 | 0 | 0 | — |
| iletisim | 6 | 0 | 0 | — |
| hazirlik-ev-sabitleme | 5 | 0 | 0 | — |
| hazirlik-aile-afet-plani | 4 | 0 | 1 | 9 `hazirlik-tatbikat`: anne+çocuk masa altında birbirine dolanmış → tek kişi (aynı anne) masa altında Çök-Kapan-Tutun, masa ayağını tutuyor; spec güncellendi |
| hazirlik-arac-kiti | 5 | 0 | 0 | — |
| hazirlik-belgeler | 4 | 0 | 0 | — |
| hazirlik-ilk-yardim-cantasi | 5 | 0 | 0 | — |
| hazirlik-is-okul | 4 | 0 | 0 | — |
| hazirlik-evcil-hayvan | 4 | 0 | 0 | — |
| su-aritma | 5 | 1 | 0 | — (2: iki el iki yönden, ama aynı kol rengi ve iş net; kabul) |
| gida-guvenligi | 5 | 0 | 0 | — |
| su-gida-su-depolama | 6 | 0 | 0 | — |
| su-gida-evdeki-gizli-su | 6 | 0 | 0 | — |
| su-gida-pisirmeden-beslenme | 5 | 0 | 0 | — |
| su-gida-sicakta-gida | 4 | 0 | 0 | — |
| su-gida-toplu-mutfak | 6 | 0 | 0 | — |

Toplam ilk değerlendirme: 216 İYİ, 16 ZAYIF, 5 KÖTÜ. 10 sahne yeniden çizildi (`barinma-sicak-icecek` iki rehberde, 11 çizim yeri). Null: 0.

## Kalan şüpheler (kabul edilen ZAYIF'lar)
- hipotermi 3: ıslak mont yeşil bir leke gibi; hareket okunuyor.
- doga-kaybolma 7 / doga-yalniz-yaralanma 6: yaprak yatağı kütüğe benziyor.
- kimyasal-sizinti 1: kuşbakışı kişi küçük.
- ozel-gruplar-bebek-bakimi 2: anne bebeği önünde tutuyor; kol sarışı biraz yapay.
- barinma-sicak-icecek: battaniye pelerin gibi duruyor ama "battaniyeye sarılı, sıcak içecek" net.
- barinma-bere-corap: yatan figür sahnenin altında, üstte boşluk var.

## Kontroller
- `npx tsc --noEmit | grep scenes/(nukleer-doga|ozel-gruplar|barinma|hazirlik|su-gida)` boş.
- `npx vitest run tests/guides.test.ts`: 191/191 geçti.
