# Çizim raporu (b): sifirdan-yapi, batch sc-06b

Dosya: `scenes-b.tsx`. 18 rehber, 54 sahne (rehber başına 3). Kategori kapakları a ajanında.
Kontroller: `check-sifirdan.ts 06-yapi` → hata yok; derleme 0 uyarı; `tsc` (scenes-b) temiz.
Paftalar: `/tmp/sc-06b/sheets/<rehber-id>.png`; hepsinin son hali görüldü.

## Oyuncular (`CAST`)
- kirec: bıyıklı esmer usta, haki pantolon, uzun kol; söndürmede gözlüklü ve yeşil eldivenli.
- merdiven: açık tenli, kahverengi saçlı genç adam.
- dam: yaşlı köylü (oldman, kiremit üst).
- sindil: koyu saçlı, bıyıklı usta.
- kar: at kuyruklu kadın, turuncu (helper2) kışlık üst.
- kece: başörtülü esmer kadın, uzun etek.
- Yakın planlarda el tenleri `HAND` sabitinde, rehber içinde sabit.

Malzeme renkleri `M` sabitinde paket geneli: kerpiç, kil, odun/kütük, taş, harç, kireç, saman/saz, kar, keçe, yün, demir, kiremit.

## Rehber başına çizilen adımlar (1 tabanlı)
| Rehber | Çizilen | null yapılan eski kimlikler |
|---|---|---|
| kutuk-doldurma | 1 yosun, 2 kama, 3 sıva | — |
| harcsiz-tas | 4 dizme (✓ şaşırtma / ✗ düz derz), 6 şev + şablon, 7 bağlayıcı taş 50 cm/1 m | kuru-temel, kuru-dolgu |
| kirec | 2 ocak kesiti, 4 iyi/az pişmiş taş, 5 güvenli söndürme | kirec-cukur |
| tas-duvar | 5 bağlayıcı taş ¾, 8 hatıl 1,5 m, 9 köşe 1,5 m / açıklık arası 1 m | tasd-orgu, tasd-kose |
| ahsap-iskelet | 3 zıvana, 6 çapraz (✓ / ✗ yana yatan), 8 hımış | iskelet-kavela |
| merdiven | 2 geçmeli basamak (✓/✗), 3 1:4 açı, 6 üç nokta | merdiven-uzanti, merdiven-iskele |
| cati-egim | 1 saz/kiremit/şındıl eğimleri, 3 makas (✓ / ✗ bağ kirişsiz), 5 saçak 50 cm | cati-olcu |
| toprak-dam | 1 YENİ `sf-yp-dam-yasak` (toprak damlı ev yasak, hafif çatı ✓), 5 katlar ≤15 cm, 8 loğ taşı | dam-kiris, dam-egim, dam-kenar (dam-katlar 3. adımdan 5. adıma taşındı) |
| saz-cati | 2 eğim 45°+, 4 saçakta dizme, 5 bindirme 15–20 cm | saz-mahya |
| sindil | 3 rende ile yarma, 7 şaşırtma, 8 tek çivi (✓/✗) | sindil-dizme |
| kiremit | 4 kalıp + tel kesici, 7 fırın 875–900°C, 10 bindirme 6,5 cm | kiremit-cubuk, kiremit-ates |
| kapi | 2 kasa + lento, 4 kanat çaprazı yönü, 5 mil menteşe | kapi-pim, kapi-mandal |
| pencere | 1 yer ve ölçü, 4 yağlı kâğıt, 7 kepenk | pencere-cerceve, pencere-zar |
| kar-barinak | 3 çubuklar + 2 sa, 4 alçak giriş/yüksek seki/30 cm, 7 havalandırma deliği | kar-yigin |
| yurt | 2 kafes, 5 kuşak, 7 keçe örtü | yurt-parcalar, yurt-sirik |
| kece | 2 dövme, 4 çapraz serme, 7 yuvarlama | kece-desen, kece-sarma |
| cit | 2 zikzak, 6 dal örgü, 7 yırtıcıya karşı 60 cm duvar + tel | cit-direk |
| ahir-kumes | 2 yön (güney açık), 7 tünek, 8 folluk | ahir-alan, kumes-yirtici |

Toprak dam: kullanıcı isteğine uygun olarak çatı-eğim karşılaştırmasından toprak dam çıkarıldı; toprak dam rehberinin ilk adımında toprak damlı ev kırmızı yasakla, hafif ahşap çatılı ev yeşil onayla çizildi. Kalan iki çizim yalnız bakım (≤15 cm katman, loğ taşı) gösteriyor.

spec.ts: kendi kimliklerimin açıklamaları çizime göre güncellendi, `sf-yp-dam-yasak` eklendi, kullanılmayan 28 kimliğim silindi.

## Kalan şüpheler
- kiremit-kalip: yaylı tel kesici üstten görünüşte biraz soyut; anlaşılmazsa null yapılabilir.
- saz-bindirme ve kiremit-dizme eğik kesitler; teknik okur için açık, sıradan okur için biraz şematik.
- ahsap-iskelet-himis: dal örgü bölmesindeki çamur sıvası biraz biçimsiz.
- kece-yuvarlama: kadının kolları denge için açık; hafif garip ama okunur.
- sindil-civi: "iki şındıldan geçen çivi" üst üste binen iki şındıl olarak yorumlandı (FAO).
