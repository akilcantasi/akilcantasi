# Çizim raporu — 04-su-dezenfeksiyon, harf a (batch sc-04a)

Dosya: `scenes-a.tsx`. Toplam 58 sahne: 18 rehberde 54 çizim ve 4 kategori kapağı. Her rehberde en fazla 3 çizim var.
Kontrol sonuçları:
- Derleme: 0 uyarı, 0 hata.
- `check-sifirdan`: hata yok.
- `scenes-a.tsx` için tsc: hata yok.

## Oyuncu kadrosu (dosya başında `CAST`)
| Ad | Tarif | Rehberler |
|---|---|---|
| KOYLU | Bıyıklı köylü adam, yeşil üst, haki pantolon. | kaynak-arama, kuyu-agzi, kum-filtre-3 |
| KUYUCU | Esmer usta, kiremit rengi üst. | kuyu-kazma (yukarıdaki kişi), sarnic |
| KAZICI | Genç adam, camgöbeği üst, kot pantolon. Kuyuya inerken kask ve emniyet kemeri takıyor. Klorlamada gözlük ve sarı eldiven takıyor. | kuyu-yer, kuyu-kazma, kuyu-klor, kum-filtre-1, kum-filtre-2 |
| KADIN | Başörtülü kadın, hardal üst, uzun etek. | makara, tasima, dinlendirme |
| GENC | At kuyruklu genç kadın, mor üst. | kalite, seramik |

Kuyu-yer rehberinde KUYUCU ile KAZICI birlikte görünüyor.

Malzeme renkleri pakette sabit (`M`):
- su: mavi
- bulanık su: kahve
- çamur: koyu kahve
- kil: kiremit
- kum: açık sarı ve noktalı
- çakıl: gri taneli
- beton: açık gri
- bidon: sarı

## Rehber başına çizilen adımlar
| Rehber | Çizilen adım ve sahne | Kaldırılan sahne |
|---|---|---|
| kaynak-arama | 2 vadi kesiti; 3 yeşil şerit; 7 debi ölçme | patika (yukarıdan bakış belirsiz) |
| kaptaj | 4 kesit; 6 çıkış duvarı; 8 çit ve hendek | cakil (yakın plan el, kesit aynı bilgiyi veriyor) |
| kuyu-yer | 1 mesafe "30 m"; 3 çukur ile tümsek; 7 ekip ve sehpa | bilezik |
| kuyu-kazma | 2 kemer ve halat; 3 mum testi; 5 yukarıdan aşağı kaplama | cap, ust-kaplama (en fazla 3 kuralı) |
| kuyu-agzi | 1 yükseltilmiş bilezik ve eğimli taban; 4 ark "4 m+"; 5 taşan kapak | taban |
| kuyu-klor | 1 yukarıdan fırçalama; 4 çözeltiyi dökme; 5 karıştırma "30 dk" | hacim (formül kartı) |
| makara | 2 çıkrık ve kol; 3 tek ve çift makara şeması; 6 temiz kova ve ip ile yerde sürüklenen ip | cikrik-kol |
| yagmur | 3 oluk ve elek; 4 ilk yağmur ayırıcı; 7 kapalı depo | yagmur-hesap |
| sarnic | 3 sıva; 5 çökeltme bölmesi; 6 sarnıç kesiti | sarnic-hesap |
| tasima | 2 bidon ile açık kova; 3 omuz sırığı; 7 musluklu kap | yuk-kaldirma |
| su-ozet | 1 çoklu bariyer şeması; 3 kaynatma "1 dk"; 9 yakıtlı su yasağı | dinlendirme-suzme, klor-depo |
| kalite | 1 çevre denetimi; 2 şişeyi ışığa tutma; 4 yosunlu gölet yasağı | salgin-tuvalet |
| dinlendirme | 1 üç küp; 2 bez süzgeç; 3 üst suyu aktarma | — |
| kum-filtre-1 | 2 boru "5 cm"; 3 kum yıkama; 4 filtre kesiti | katman, tabla (kesit ikisini de gösteriyor) |
| kum-filtre-2 | 2 doldurma "12–18 L"; 5 çıkış; 6 üst kumu bulandırma | — |
| kum-filtre-3 | 1 iki havuzun planı; 2 havuz kesiti "1 m / 1 m"; 7 kazıma "1–2 cm" | havuz-vana |
| seramik | 1 yoğurma; 3 fırın; 5 kovaya oturmuş çömlek | seramik-akis, komur-katman |
| sodis | 2 şişe seçimi; 3 yazı testi (yukarıdan); 4 çatıda "6 saat" | — |

Kategori kapakları:
- su-bulma: çatılı çıkrıklı kuyu ve bidonlar.
- aritma: kum filtresi, seramik filtre ve PET şişe.
- dezenfeksiyon: kaynayan tencerede makas, yanında bez ve sabun.
- dezenfektan: "%5" şişe, ölçü kabı, "%0,5" kova ve eldiven.

`guides.ts` dosyasında yalnızca bu 18 rehberin `art` dizileri değişti. Bazı sahneler daha uygun adıma taşındı:
- vadi: 1. adımdan 2. adıma
- kaptaj-kesit: 1. adımdan 4. adıma
- cikrik: 1. adımdan 2. adıma
- biokum-kesit: 1. adımdan 4. adıma

`spec.ts` dosyasında çizilen 58 kimliğin açıklaması çizime göre sadeleştirildi. Kullanılmayan kimliklerin spec satırları yerinde bırakıldı.

## Kalan şüpheler
- Kuyu kesitlerinde (kemer, havalandırma, kaplama, klor) insanlar küçük kalıyor (yüksekliğin yaklaşık %40'ı). Kesit görünüşü bunu gerektiriyor.
- kaptaj-cit ve havuz-filtre-plan yukarıdan bakış. Anlaşılır görünüyorlar ama soyut kalıyorlar.
- Omuz sırığı yan görünüşte boynun önünden geçiyor gibi duruyor. Kabul edilebilir buldum.
- kum-filtre-1, 4. adım: kesitte 4 kısa katman yazısı var ("su", "kum", "ince çakıl", "iri çakıl"). Bu, "tek etiket" kuralının istisnası.
- makara-tek-cift bir kuvvet şeması ("10" ve "5"). Okur için biraz teknik olabilir.
