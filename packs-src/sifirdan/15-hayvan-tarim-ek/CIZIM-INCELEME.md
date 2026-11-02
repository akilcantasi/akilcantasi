# 15-hayvan-tarim-ek — bağımsız çizim incelemesi (si-15)

Paket: sifirdan-hayvan-tarim-ek · 16 rehber · 48 rehber sahnesi + 2 kategori kapağı = 50 çizim.
Kontroller: derleme 0 uyarı / 0 hata; `check-sifirdan` → hata yok; tsc temiz.

## Sayılar (ilk durum)
- İYİ: 37
- ZAYIF: 10
- KÖTÜ: 3
- null yapılan: 0 (ZAYIF ve KÖTÜ olanların hepsi yeniden çizildi ve İYİ oldu)

## KÖTÜ → yeniden çizildi
- `sf-ht-dogum-cekme-yonu` (dogum-zor 8): kuzu görünmüyordu, yalnızca koyunun arkasında beyaz bir parça vardı. İki yakın plan denemesi okunmadı. Şemaya çevrildi; dili 7. adımdaki normal geliş şemasıyla aynı: soluk koyun silueti ve rahim, kuzunun iki ön ayağı ile başı dışarıda, yukarıdan gelen eldivenli el iki ayağı birlikte tutuyor, arka ayaklara doğru aşağı kıvrılan yay ok. Köşede ✗ işaretli ek resim: düz yukarı çekme. Spec güncellendi.
- `sf-ht-kopek-kovalama-hayir` (kopek-bekci-suru 5): çobanın eli tasmaya yetişmiyordu, ok elin üstündeydi ve beden çarpıktı. Yeni hâli: tek dizi yerde çoban, bir eli tasmada, öbür eli köpeğin sırtında, "hayır" diyen yüz ifadesi (`speak`), geri yönde ok. Spec güncellendi.
- `sf-ht-grisu-malc-cukur` (gri-su 5): kova adamın ellerinden ayrı, havada duruyordu. Artık kova bir eli kenarda, öbür eli dipte, iki elle tutuluyor ve devrilip çanağa dökülüyor.

## ZAYIF → düzeltildi
- Köpek başı (`dogHead` ve yavru): sarkık kulak yüzün ortasını kaplıyordu, kafa ters dönmüş gibi duruyordu. Kulak geriye alındı, göz açıldı. Bu düzeltme `iz-kosum`, `kopek-yavru-suru`, `iz-burun-yerde`, `kopek-otur`, `kopek-gel` ve kapak-hayvan sahnelerini düzeltti.
- `sf-ht-kopek-guvenli-kose`: yukarıdan bakışta yavru tanınmıyordu, perdedeki aralık koyunun geçeceği kadar genişti. Yavru yeniden çizildi (gövde, maskeli baş, kulaklar, kuyruk); aralık daraltıldı.
- `sf-ht-kedi-ambar`: "beklenti" adımını anlatmıyordu (kedi bir deliğe bakıyordu). Yeni hâli: kedi küçük fareye bakıyor (✓ "30 g"), arkada iri sıçan (✗ "300 g"). Metindeki sayılarla birebir aynı. Spec güncellendi.
- `sf-ht-at-ayak-kaldirma` ve `sf-ht-toynak-baglama` (ortak `LiftScene`): kaldırılan toynak kutu gibiydi, kişinin başı hayvanın başına değiyordu. Toynak yuvarlak, tabanı görünür hâle getirildi. Kişi belden daha çok eğiliyor; yüzü kuyruğa dönük ve başı hayvanın başından uzakta. Ayak verme okunun yeri kaydırıldı. Bir yakın plan denemesi okunmadığı için bırakıldı.
- `sf-ht-baltalik-parsel`: metinde 20 parsel, çizimde "1–6" yazıyordu. Başlıklar "1, 2, 3, …, 19, 20" yapıldı. Spec güncellendi.
- `sf-ht-at-baski-birak`: ok eşeğin başını kapatıyordu; ipin altına alındı.
- `sf-ht-kopek-gel`: ok köpeğin yüzünü kapatıyordu; zemine indirildi.
- `sf-ht-kedi-kum-eldiven`: kürek sapı parmaklara paralel duruyordu. Sap açısı ve el yönü değiştirildi. Tutuş hâlâ biraz yapay ama okunuyor.

## İYİ bırakılanlar (değişmedi)
Ödül, iz yiyecek adımları, kap saklama, yandan yürütme, kazıyıcı, toynak kesimi, güvercin (3), doğum belirtileri / bölme / normal geliş, el koni, U/Z bacak, yeni doğan (3), ipekböceği (3), pancar (3), kütük kesimi, sürgün, fidanlık (3), gri su kaynakları ve hangi bitki, kuraklık (3), kapak-tarım.

## Notlar
- `pancar-dilim` adımındaki "78–82 °C" ve `fidan-soguklatma` adımındaki "3 ay" o adımın metninde geçmiyor, bir sonraki adımdan geliyor. Rehberle çelişmedikleri için bırakıldı.
- Kalan küçük şüpheler: kum küreğini tutan elin parmakları sapı tam sarmıyor; kapak-tarımda pancar sıraları yalnızca yeşil ovaller.
