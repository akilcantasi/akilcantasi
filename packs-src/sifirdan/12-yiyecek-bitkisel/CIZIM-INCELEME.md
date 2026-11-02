# 12-yiyecek-bitkisel: bağımsız çizim incelemesi (batch si-12)

56 çizim incelendi: 53 rehber sahnesi ve 3 kategori kapağı.
- İYİ: 45
- ZAYIF: 7
- KÖTÜ: 4

Düzeltmelerden sonra pakette 55 çizim kaldı; tere ve rezene karşılaştırmaları tek ortak sahnede birleşti. Derleme 0 uyarı verdi, `check-sifirdan` "hata yok" dedi. Bütün paftalar ve kapaklar son halleriyle görüldü.

## Ana ilke: karşılaştırmalarda "yenir" kartı yok
Önceki turda yenen tarafa onay konmamıştı. Ama zehirli panelin yanında işaretsiz duran yenen panel yine "bu yenir" diye okunuyordu. Benzer bitkilerde bu, yanlış teşhise yol açar. Bu riskin olduğu sahnelerde yenen panel kaldırıldı. Yalnız zehirli bitki(ler) kaldı: büyük kırmızı yasak ve "EMİN DEĞİLSEN YEME" şeridi.

## KÖTÜ (yeniden çizildi)
- **sf-ybt-cirisi-ayir:** Bilen yaşlının eli çirişi gösteriyordu ve çiriş, zehirli demetlerle kasıtlı olarak benzer çizilmişti. Bu açık bir "yenir" kartıydı. Yeni çizimde iki panel var: acı çiğdem ve akçöpleme, ikisinde de yasak var. Çiriş hiç çizilmedi.
- **sf-ybt-salkim-ayrim:** İşaretsiz beyaz akasya salkımı vardı, ama metne göre mor salkım beyaz da olabilir. Yeni çizimde iki panel var: mor salkım (mor ve beyaz salkım, bakla) ve altın yağmuru, ikisinde de yasak var.
- **sf-ybt-rezene-baldiran:** Yenen tarafta şemsiye çiçekli bir ot vardı; bu, baldıranla karışma riskinin ta kendisi. Sahne kaldırıldı. Yerine yeni `sf-ybt-semsiye-yasak` sahnesi geldi ve kıyı rehberinde 5. adımdan 6. adıma ("baldıran olabilir") taşındı. 5. adım artık null.
- **sf-ybt-ot-kaynatma:** Akış anlaşılmıyordu: yeşil sıvı süzgeçten yere akıyordu, ayrıca anlamsız bir ok ve ikinci bir tencere vardı. Yeni çizimde eğik tencere suyu süzgece döküyor, ot süzgeçte kalıyor, su alttaki kaba damlıyor.

## ZAYIF (yeniden çizildi ya da sadeleştirildi)
- **sf-ybt-tere-baldiran:** İşaretsiz su teresi paneli vardı. Yerine `sf-ybt-semsiye-yasak` kondu: dere kenarında parçalı yapraklı, lekeli gövdeli, beyaz şemsiye çiçekli ot, yasak ve EMİN şeridiyle.
- **sf-ybt-zakkum-defne:** İşaretsiz defne paneli vardı; metne göre karayemiş de defneye benzer. Yeni çizimde yalnız zakkum dalı var (üçlü yapraklar, pembe çiçekler), büyük yasak ve EMİN şeridiyle.
- **sf-ybt-liken-ayrim:** İşaretsiz "yenen liken" paneli vardı. Yeni çizimde iki panel var: sarı-turuncu taş likeni ve sakal liken, ikisinde de yasak var. Sahne 1. adımdan (genel tanım) 3. adıma ("sarı/sakal likeni toplamayın") taşındı. 1. adım artık null.
- **sf-ybt-keciboynuzu:** Yerdeki kırık bakla ve tohumların üstündeki çarpı metinde yoktu ve kafa karıştırıyordu; kaldırıldı.
- **sf-ybt-ceviz-kurutma:** Metinde olmayan "küflü iç" tabağı ve çarpısı kaldırıldı.
- **sf-ybt-madimak, sf-ybt-borulce:** Makaslar havada süzülüyordu. Makası tutan toplayıcı eli eklendi (`HoldAt`). Börülcede ok elin üstünden alındı.

## Dokunulmayan karşılaştırmalar (İYİ)
Yenen panelleri zehirli olanla karışacak kadar benzemiyor, ayırt edici özellik net:
- çam / porsuk: kozalak ve demet iğne karşısında kırmızı kadeh meyve;
- buğday / delice;
- böğürtlen / güzelavrat: bileşik tane karşısında tek parlak tane ve yıldız çanak.

## Spec ve rehber değişiklikleri
- spec: cirisi-ayir, salkim-ayrim, zakkum-defne, liken-ayrim, keciboynuzu, ceviz-kurutma, ot-kaynatma, madimak ve borulce güncellendi. `sf-ybt-semsiye-yasak` eklendi. tere-baldiran ve rezene-baldiran silindi.
- guides `art`:
  - sulak[3] → semsiye-yasak;
  - kiyi[4] null, kiyi[5] → semsiye-yasak;
  - liken[0] null, liken[2] → liken-ayrim.

## Null yapılanlar
Yeni bir null yok. Yalnız iki çizim adım değiştirdi: rezene sahnesi 5. adımdan 6. adıma, liken sahnesi 1. adımdan 3. adıma geçti.

## Kalan küçük şüpheler
- kapak-mevsim: kış şeridindeki boş kar kutusu biraz sönük.
- kapak-yer: su blokları köşeli.
- kamış: kök (rizom) çamurun içinde değil, üstünde duruyor.

Hepsi anlaşılır olduğu için bırakıldı.
