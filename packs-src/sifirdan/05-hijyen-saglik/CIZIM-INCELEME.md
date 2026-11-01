# Hijyen ve sağlık: çizimlerin bağımsız incelemesi (batch si-05)

Paket: `sifirdan-hijyen-saglik`. 23 rehber ve 3 kategori kapağı, toplam 72 çizim incelendi.

## Sonuç
- İYİ: 56
- ZAYIF: 13 (hepsi yeniden çizildi ya da düzeltildi)
- KÖTÜ: 3 (hepsi yeniden çizildi)
- null yapılan: 0

Derleme 0 uyarı, `check-sifirdan 05-hijyen-saglik` "hata yok" veriyor. Değişen bütün rehberlerin son paftasına bakıldı.

## KÖTÜ → yeniden çizildi
- **sf-hs-degnek-olcu**: değnek koltuk altında değildi, kolun dışında dirsek hizasında duruyordu. "5 cm" ölçüsü boşlukta kalıyordu. Şimdi belden yukarı, önden yakın plan çizildi: çatal koltuk altının hemen altında, el tutamakta. Boşluğu iki turuncu çizgi ve "5 cm" gösteriyor.
- **sf-hs-ors-cimdik**: alttan gelen el ayağa benziyordu, deri kıvrımı parmakların üstünü örtüyordu. Şimdi el yandan geliyor, başparmak ve işaret parmağı kaldırılmış deri kıvrımını çimdikliyor.
- **sf-hs-cop-yakma-yasak**: yakılan şeyler (lastik, plastik, kablo) yasak halkasının altında görünmüyordu. Şimdi yatık bir lastiğin içinde ateş yanıyor, önünde plastik şişe ve kablo duruyor, kara duman yükseliyor.

## ZAYIF → düzeltildi
- **sf-hs-tuvalet-kesit**: çukur dibiyle yeraltı suyu arasına konan "1,5 m", adım 4'teki "1,5 m genişlik" ile karışıyordu. Şimdi "1,5 m" çukurun ağzında yatay genişlik oku olarak duruyor, yanında "2 m+" derinlik oku var.
- **sf-hs-cop-ortme**: "10 cm" oku bir katmanı gösteriyordu ama kalınlığı ölçmüyordu. Şimdi üstteki toprak katının kalınlığı turuncu köşeli bir parantezle işaretli, etiket ve ok bu paranteze gidiyor.
- **sf-hs-ates-sivi, sf-hs-bakim-kapak, sf-hs-yatak-besleme, sf-hs-dogum-ten-tene**: hastanın arkasındaki yastıklar beyaz "yelken" ya da hayalet gibi görünüyordu. Bunların yerine eğik, dikişli yastıklar çizildi (`Pillow` yardımcısı). Doğum sahnesinde annenin sırtı artık yastıklara yaslanıyor. Battaniye ayaklarda bitiyor; eskiden ayakların ötesine sivri bir üçgen halinde taşıyordu.
- **sf-hs-dogum-seti**: bebek başlığı baret gibi görünüyordu. Şimdi ponponlu, ribanalı örgü bere.
- **sf-hs-sedye-battaniye**: aşamalar okunmuyordu. Üç aşama numaralandı (1-2-3), genişlikler tutarlı hale getirildi (tam battaniye, ⅔, üç kat), onay işareti bitmiş sedyenin yanına alındı.
- **sf-hs-bez-kova**: köşedeki küçük yasak resmi okunmuyordu, kaldırıldı. Sahnede yalnız raftaki kapaklı kova ve yerde emekleyen bebek kaldı.
- **sf-hs-karantina-oda**: kapı önündeki anlamsız tabak/kâse kaldırıldı.
- **sf-hs-gebe-beslenme**: karın çıkıntısı kucakta ayrı bir torba gibi duruyordu. Karın göbek hizasına taşındı, kadın masaya yaklaştırıldı.
- **sf-hs-kompost-idrar**: oturak deliğini örten dev turuncu ok kısaltıldı ve inceltildi.
- **sf-hs-camasir-kazan**: kadın sopayı başının üstünden tutuyordu ve öndeki kol omzuna katlanmıştı. Sopa göğüs hizasına indirildi, iki el sopanın üstünde.

spec.ts'te güncellenen açıklamalar: tuvalet-kesit, cop-ortme, cop-yakma-yasak, bez-kova, degnek-olcu, sedye-battaniye, karantina-oda.

## Kalan küçük şüpheler (İYİ sayıldı)
- `camasir-kazan`: başörtülü kadının yüzü profilde küçük kalıyor. Bu, kit'in başörtüyü çizme biçiminden geliyor.
- `bez-kova`: kit'in emekleyen bebeği biraz yaşlı görünüyor.
- `cop-yakma-yasak`: yasak halkası lastiğin bir kısmını kesiyor ama şişe ve kablo seçiliyor.
- `ates-cizelge`: termometre çizelgenin yanında bağımsız bir simge gibi duruyor. Okunuyor.
