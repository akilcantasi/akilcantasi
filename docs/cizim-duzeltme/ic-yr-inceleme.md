# ic-yr — yaralanma 2. tur inceleme (2026-11-01/02)

Sahne dosyaları: `src/art/scenes/yaralanma-1.tsx`, `src/art/scenes/yaralanma-2.tsx`. Spec: `src/art/spec/yaralanma.ts` (yalnızca değişen kimliklerin açıklamaları güncellendi). Rehber `art` dizilerine dokunulmadı; yeni null yok.

Toplam 110 çizim incelendi. İlk bakışta: 89 İYİ, 12 ZAYIF, 9 KÖTÜ. 21 ZAYIF/KÖTÜ çizimin hepsi yeniden çizildi ya da düzeltildi (14 sahne kimliği ve 5 rehberde kullanılan ortak `coverScene`). Son paftalarda hepsi İYİ.

## Ortak değişiklik: `coverScene` (yaralanma-1)
Eski hali: büyük boş odada minik iki figür ve "kırmızı tümsek" gibi duran battaniye; yardımcının başı yaralınınkiyle karışıyordu. Yeni hali yakın plan (`s` 1.75, `gy` 150). Yaralı sırtüstü yatıyor, başı solda, ayakları çerçevenin dışında. Battaniye vücut hattını izliyor ve omuz kenarı kıvrık. Yardımcı başın arkasında, topuklarının üstünde dik diz çökmüş. Elleri dizlerinde, konuşuyor. Yaralının yüzünün üstünden geçen kol yok. Bu sahneyi kullananlar: yanik 6, ezilme 6, omurga 5, karin 7, uzuv 9.

## Rehber başına
| Rehber | Çizim | İYİ | ZAYIF | KÖTÜ | Değişen |
|---|---|---|---|---|---|
| burun-kanamasi | 4 | 3 | 1 | 0 | 1: öne eğ oku yüzün içinden/pencereye gidiyordu → başın üstünden öne-aşağı kıvrılan ok |
| yanik | 6 | 4 | 0 | 2 | 1: tahta gibi battaniye + yardımcı kaldırıldı; tek fikir: yerde yan yatıp yuvarlanan kişi, büyük ölçek, alev + dönme oku. 6: coverScene |
| kirik-burkulma | 5 | 4 | 1 | 0 | 2: havada süzülen yasak işareti → bezin ortasından çıkan kemik ucu + üstüne inen kırmızı ok ve ✗; eller yanlarda turuncu oklarla |
| ezilme-yaralanmasi | 5 | 2 | 2 | 1 | 2: tabela gibi havada duran dev defter → yardımcının elinde küçük defter, konuşma dalgası, köşede saat "14:20". 4: yerdeki minik telefon kaldırıldı. 6: coverScene |
| yaralanma-bas-travmasi | 5 | 4 | 1 | 0 | 8: minik figürler, telefonuna bakan yetişkin → sahne 1.25× büyütüldü, telefon kucakta "112", genç yatağa oturtuldu, battaniye bacakları örtüyor |
| yaralanma-omurga | 6 | 4 | 1 | 1 | 2: küçük figürler → yakın plan, yardımcı başın arkasında konuşuyor; yasak karesi büyütüldü. 5: coverScene |
| yaralanma-goz | 5 | 5 | 0 | 0 | — |
| yaralanma-dis | 5 | 5 | 0 | 0 | — |
| yaralanma-gogus | 5 | 5 | 0 | 0 | — |
| yaralanma-karin | 5 | 2 | 1 | 2 | 2: minik figürler, karında anlamsız sarı örtü → yakın plan, dizler bükük, altında rulo battaniye, yardımcı başın arkasında. 6: minik figürleri örten dev yasak işareti → yakın plan bardak su + ekmek, üstünde yasak. 7: coverScene |
| yaralanma-uzuv-kopmasi | 6 | 4 | 1 | 1 | 1: elleri iç içe geçmiş, kesik kol gibi okunan sahne → yaralının eli soldan geliyor, parmak uçları bezin dışında görünüyor; eldivenli iki el yukarıdan kesişmeden bastırıyor (`yaralanma-kanama-bastirma`'ya dokunulmadı). 9: coverScene |
| yaralanma-saplanan-cisim | 5 | 4 | 0 | 1 | 7: küçük figür ve kutu gibi battaniye → yakın plan; göğüsten kalçaya battaniye, uyluktaki çubuk ve rulo bezler açıkta, yardımcı başın arkasında |
| yaralanma-yara-temizleme | 6 | 6 | 0 | 0 | — |
| yaralanma-soguk-isirigi | 5 | 4 | 1 | 0 | 2: havada süzülen siyah eldiven kaldırıldı |
| yaralanma-gunes-yanigi | 5 | 5 | 0 | 0 | — |
| yaralanma-ishal | 6 | 6 | 0 | 0 | — (2'deki göz simgesi sınırda ama okunuyor) |
| yaralanma-yuksek-ates | 6 | 6 | 0 | 0 | — (8: yatık bardak, doğru "bardak testi" görünümü) |
| yaralanma-kuduz-isirik | 4 | 3 | 0 | 1 | 8: havada iğne, tabela, kart tutan kişi → yakın plan duvar takvimi: dört aşı günü turuncu çerçeveli ve içinde şırınga, geçmiş ikisi yeşil tikli; rakam yok |
| yaralanma-kene | 6 | 6 | 0 | 0 | — |
| yaralanma-su-toplama | 5 | 4 | 0 | 1 | 5: eli tamamen örten mavi "balon" havlu ve konu dışı çoraplar → kişinin kendi eli katlanmış kuru bezle parmak diplerini kuruluyor |
| yaralanma-kramp-zorlanma | 5 | 5 | 0 | 0 | — |

## Null yapılanlar
Yok. Bütün ZAYIF/KÖTÜ çizimler birkaç denemede İYİ oldu.

## Bilinen şüphelerin durumu
- saplanan-ortme küçük figür: çözüldü (yakın plan).
- kuduz 8 havadaki iğne: çözüldü (takvim yakın planı).
- uzuv 1 parmak: el ve parmak uçları artık görünüyor. Bezin altındaki eksik parmak çizilmedi; adım metni genel "yaraya bastırın" dediği için yeterli.
- yanik 1 battaniye: battaniye ve yardımcı kaldırıldı, tek fikir.

## Kalan küçük şüpheler
- coverScene yakın planlarında yardımcının bacakları sol kenarda biraz kesiliyor.
- Saplanan-ortme'de battaniye kenarı sol rulo beze değiyor; çubuğa değmiyor.
- Kuduz 8'de rakam yok, bu yüzden "gün" fikri ızgaradan çıkarılıyor.
