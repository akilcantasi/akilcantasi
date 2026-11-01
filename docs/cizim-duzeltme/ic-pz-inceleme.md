# Çizim inceleme (2. tur): ic-pz (psikoloji ve zehirlenme)

Sahne dosyası: `src/art/scenes/psikoloji-zehirlenme.tsx`. Spec: `src/art/spec/zehirlenme.ts` (3 satır güncellendi). Rehber `art` dizilerinde değişiklik yok.

Not: Makine çok yüklüydü. Bu yüzden çekimler, `e2e/all-guides-shot.mjs` ile aynı işi yapan bir kopyayla alındı (`/tmp/ic-pz/fast.mjs`). Kopya `networkidle` beklemiyor, kimlikleri birebir eşliyor ve uzun zaman aşımı kullanıyor. Son paftalar: `/tmp/ic-pz/sheets/`.

## Rehber başına sonuç (ilk bakışta İYİ / ZAYIF / KÖTÜ, sonra ne yapıldı)

| Rehber | Çizim | İYİ | ZAYIF | KÖTÜ | Değişiklik |
|---|---|---|---|---|---|
| psikoloji-ilk-yardim | 5 | 4 | 1 | 0 | 8 (BAĞLANTI KUR): yardımcının kolu kadının başına/ensesine uzanıyordu. Artık ikisi yan yana yürüyor, yardımcının eli kadının sırtında (goHealth kalıbı). |
| psikoloji-panik-atak | 5 | 4 | 1 | 0 | 2 (oturun/dayanın): figür küçüktü (%45). s 1.18'den 1.5'e çıktı, dayandığı dolap sırtının arkasına alındı. |
| psikoloji-cocukla-konusma | 4 | 4 | 0 | 0 | — |
| psikoloji-cocuk-stres-belirtileri | 5 | 5 | 0 | 0 | — |
| psikoloji-yas | 5 | 5 | 0 | 0 | — |
| psikoloji-uyku-stres | 4 | 4 | 0 | 0 | — (5: göz bantlı yatan kişi küçük ama okunuyor) |
| psikoloji-gonullu-tukenmislik | 4 | 4 | 0 | 0 | — |
| psikoloji-travma-tepkileri | 5 | 5 | 0 | 0 | — |
| psikoloji-intihar-dusuncesi | 4 | 4 | 0 | 0 | — Hiçbir sahnede yöntem ya da araç yok (kontrol edildi). |
| karbonmonoksit | 6 | 6 | 0 | 0 | — |
| zehirlenme | 6 | 5 | 0 | 1 | 6 (göz yıkama) baştan çizildi, aşağıya bakın. |
| zehirlenme-mantar | 5 | 5 | 0 | 0 | — |
| zehirlenme-gida | 5 | 5 | 0 | 0 | — |
| zehirlenme-cocuk-yutma | 5 | 5 | 0 | 0 | — |
| zehirlenme-metanol | 5 | 4 | 0 | 1 | 2 (belirtiler) yeniden çizildi. |
| zehirlenme-tarim-ilaci | 5 | 3 | 0 | 2 | 4 (eldivenle giysi çıkarma) ve 6 (göz yıkama) yeniden çizildi. |

Toplam 78 çizim incelendi. 6'sı yeniden çizildi (göz yıkama fabrikası iki rehberi birlikte düzeltiyor). Bu turda null yapılan yok.

## Değişen sahneler
- **`gozYika` (zehirlenme-goz-yika, zehirlenme-tarim-goz-yika):** Eski çizimde profil vardı, göz görünmüyordu, su saçın ve kulağın üstünden geçiyordu, kapağı tutan el de yoktu. Yeni çizim önden, büyük bir yüz yakın planı:
  - baş yaralı göz tarafına yatık, sağlam göz kapalı;
  - yardımcının eli (teal kol) sağ alttan geliyor: başparmak alt kapağı aşağı, işaret parmağı üst kapağı yukarı çekiyor; göz kocaman açık;
  - musluk suyu iç köşeye düşüyor, dış köşeye akıyor, yanaktan süzülüyor;
  - turuncu ok akış yönünü gösteriyor; köşede "15 dk" etiketi var.
  - Tarım rehberinde aynı yaşlı çiftçi çiziliyor: kel, gri bıyık, aynı mavi üst.
- **zehirlenme-metanol-bulanik-gorme:** Bağırıyor gibi görünen küçük "pain" yüzlü ek kare kaldırıldı. Yerine ön planda endişeli adam (omuz-baş) var; bulanık şişe ve bardağa bakıyor. Önce alnına el koymayı ve baş dönmesi sarmalını denedim; el yüzü kapattı, sarmal da hale gibi okundu. İkisi de çıkarıldı.
- **zehirlenme-eldivenle-giysi-cikar:** Eski çizimde yardımcının kolu çiftçinin bacağına dolanıyordu, ne yapıldığı okunmuyordu. Yeni çizimde:
  - uzun yeşil eldivenli yardımcı, lekeli ceketi şeffaf poşete koyuyor (aşağı ok);
  - lekeli çizmeler poşetin yanında;
  - çiftçi atlet ve çorapla bekliyor.
- **psikoloji-baglanti:** Yardımcının kolu artık kadının başına uzanmıyor. İkisi yürüyor, eli kadının sırtında.
- **psikoloji-oturma:** Figür büyütüldü, dayanma yüzeyi eklendi.

## Kalan şüpheler
- Göz yıkamada musluktan inen su alnın önünden geçiyor. Okunuyor, ama tek bakışta "yüze su dökülüyor" gibi de algılanabilir.
- Metanol 2'de "bulanık görme" yalnızca bulanık nesneler ve endişeli yüzle anlatılıyor. Kesin ama sade.
- psikoloji-uyku-stres 5: göz bandı ve kulak tıkacı küçük.
- psikoloji-ilk-yardim 1: arka plandaki çömelmiş kadın küçük, ama "bak" sahnesi için derinlik kasıtlı.
- Ortak `call-112` ve `wash-hands` sahnelerine dokunulmadı.
