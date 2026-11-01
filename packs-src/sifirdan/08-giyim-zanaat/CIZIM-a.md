# Çizim raporu — 08-giyim-zanaat, harf a (batch sc-08a)

Dosya: `scenes-a.tsx`. `scenes.tsx` zaten A ve B'yi birleştiriyordu; dokunulmadı.
Yalnızca kendi 23 rehberimin `art` dizileri ve kendi kimliklerimin spec satırları değişti. Spec açıklamaları çizime göre sadeleştirildi (73 satır).

## Oyuncular (CAST)
- Ayşe: kadın, ten 1, kırmızı başörtüsü, mor üst, lacivert uzun etek. Rehberleri: yün yıkama, kirmen, dokuma, boya, hasır-kilim.
- Elif: kadın, ten 0, kahverengi at kuyruğu, hardal üst, kot. Rehberleri: ısırgan, örgü, dikiş, keçe, halat yardımcısı.
- Mehmet: erkek, ten 2, siyah saç, bıyık, yeşil üst, haki pantolon. Rehberleri: ıhlamur, halat, çarık, kış giysisi, sap, bileme, geçme.
- Can: erkek, ten 3, siyah saç, kiremit üst, koyu pantolon. Rehberleri: deri, tabaklama 1-2, ham deri, taş, kemik, oyma.

Yakın planlarda eller ilgili oyuncunun teni ve kol rengiyle çizildi. Eldivenli eller (ısırgan, ceviz, kül suyu, kıl çekme) mavi kauçuk eldiven olarak gösteriliyor.

Malzeme renkleri paket genelinde aynı: yün, ahşap, deri, ham deri, çakmaktaşı, demir ve su.

## Çizilen adımlar (adım no 1'den)
| Rehber | Çizilenler |
|---|---|
| yun-yikama | 4 bekletme, 8 kurutma, 9 tarama |
| kirmen | 1 yapı, 4 çevirme, 5 durdur-çek |
| isirgan-kenevir | 3 soyma, 4 havuzlama, 9 tarama |
| ihlamur-kabugu | 2 soyma (adım 1'den taşındı), 3 batırma, 6 ayırma |
| halat | 1 ters burma, 5 kurulum, 6 ayraç |
| dokuma-tezgahi | 3 çözgü, 4 ağızlık, 8 kirkit |
| orgu | 1 şiş yapma, 4 düz ilmek, 8 tığ |
| bitki-boyasi | 2 ceviz, 6 ısıtma, 8 kurutma |
| hasir-kilim | 3 hasır örme, 6 kilim kirkit, 7 desen |
| dikis-yama | 4 geri dikiş, 6 yama, 9 deri dikişi |
| deri-yuzme | 5 kazıma, 6 tuzlama, 9 çerçeve |
| tabaklama-kul | 2 kül suyu, 5 kıl çekme, 6 kazıma |
| tabaklama-mese | 3 fıçı, 5 güçlendirme, 6 kesit |
| ham-deri | 2 çerçeve, 4 sırım, 6 bağlama |
| carik | 2 çizim, 5 toplama, 7 bağlama |
| kece | 3 yün yayma, 4 ovma, 6 çimdik testi |
| kis-giysisi | 1 katman, 2 pamuk yasağı, 7 uç koruma |
| tas-alet | 1 taş seçme, 4 vurma, 7 bastırma |
| kemik-boynuz | 3 oluk, 4 sürtme, 5 iğne/biz |
| alet-sapi | 1 lif yönü, 4 oturtma, 5 kama |
| bileme | 4 açı, 5 sürme, 8 kayış |
| agac-oyma | 2 yarma, 4 güvenli yön, 6 lif yönü |
| civisiz-birlestirme | 1 kuru-yaş, 3 kama, 5 kavela |

Kategori kapakları (6): lif, deri, ağaç, çömlek, metal, taşıt. Hepsi insansız, sade nesne sahnesi.

Toplam 75 sahne: 69 rehber çizimi ve 6 kapak.

## Null yapılan kimlikler
Rehber başına 3 sınırı ya da düşük değer nedeniyle şunlar null yapıldı:

yun-ayiklama, kirmen-baglama, kirmen-sarma, lif-kirma, lif-dovme, ters-burma (ıhlamurda; halatta duruyor), halat-uc-baglama, dokuma-cerceve, dokuma-gucu, orgu-ilmek-dizme, orgu-kapatma, boya-mordan, boya-sogan, hasir-toplama, dikis-teyel, dikis-kenar, tabak-batirma, tabak-yikama, mese-ezme, mese-yaglama, carik-delik, kece-kalip, kece-rulo, kis-terleme, kis-kurutma, tas-koruma, sap-sarma, bileme-capak, oyma-balta, gecme-yarim.

Deri yüzme sahnelerinin ikisi bilerek null yapıldı: deri-kesim-hatti (asılı hayvan) ve deri-soyma. Pakette kan, iç organ ya da hayvan gövdesi yok. Silah çizilmedi; bıçak ve balta yalnız alet olarak görünüyor.

## Kalan şüpheler
- **orgu-duz-ilmek ve orgu-tig:** Örgü bilmeyen biri için hâlâ soyut. Doğru, ama "2 saniyede anlaşılır" sınırında. Gerekirse null yapılabilir.
- **dokuma-agizlik:** Çubuğun iplikleri bir alttan bir üstten geçişi zor seçiliyor. Asıl anlatılan, mekiğin iki ip takımı arasından geçişi; o görünüyor.
- **deri-cerceve ve hamderi-cerceve:** Aynı kalıp ve neredeyse aynı görünüyorlar. Ham deride yarı saydamlık çok belli değil.
- **tabak-kazima:** Kıl dokusu küçük. Sahne deri-kazima ile neredeyse aynı (kasıtlı tutarlılık).
- **tas-vurma:** 40° açı yayı şematik. Uyluk koyu bir zemin gibi okunuyor.
- **kategori kapakları:** b ajanı da kapak çizmişse aynı kimlikte birleşimde B'nin sahnesi geçerli olur (`...A, ...B`).
