# Çizim incelemesi — 08-giyim-zanaat (batch si-08)

Bu incelemede 141 çizime bakıldı: 45 rehberde 135 çizim ve 6 kategori kapağı. Bütün paftalar çekilip açıldı. Değişen rehberlerin paftaları yeniden çekildi ve kontrol edildi.

| Sınıf | Sayı |
|---|---|
| İYİ | 118 |
| ZAYIF | 21 (19'u yeniden çizildi ya da düzeltildi, 2'si null yapıldı) |
| KÖTÜ | 2 (ikisi de yeniden çizildi) |

Paketin son durumu: 139 çizim (133 rehber çizimi ve 6 kapak).
- `check-sifirdan`: hata yok.
- Derleme: 0 uyarı.

## Kategori kapakları
Kapakları yalnız a ajanı çizmişti (`scenes-a.tsx`). b ajanı aynı kimliklerle kapak çizmemişti, yani çakışan kapak yok; her kategoride tek bir kapak var. Altı kapak da aynı dilde çizilmiş: insansız, sade nesne sahnesi, yazısız.

Tek düzeltme lif kapağında yapıldı. Kirmen, dokuma tezgâhının üstüne yatan çapraz bir çubuk gibi görünüyordu. Yerine dik mil, altta yatay kol ve milin üstünde sarılı ip yumağı çizildi.

## KÖTÜ → yeniden çizildi
- **sf-gz-torna-yay:** Yayın iki ucunda birer el vardı; keskiyi tutan el yoktu. Yeni çizimde sol el yayı ileri geri çekiyor, sağ el alet dayamasına dayalı keskiyi tutuyor.
- **sf-gz-comlek-sivama:** Sahne, üstünde topuz olan bir sütun gibi anlamsız (ve uygunsuz) bir şekle dönüşmüştü. Yeni çizim çömleği önden gösteriyor: ağızda yeni eklenen iki sucuk var, solda birleşim çizgisi dikey izlerle sıvanmış, işaret parmağı birleşimi aşağı doğru sıvıyor.

## ZAYIF → düzeltildi
- **yun-kurutma:** Yün güneşte duruyordu. Artık büyük ağacın gölgesinde; güneş yasağı sol üst köşeye taşındı.
- **kirmen-durdur-cek:** Gri tümsekler diz yerine geçmişti. Etekli, kıvrımlı, aşağı inen iki diz çizildi.
- **ihlamur-batirma:** Demet suyun üstünde yüzüyor gibiydi. Yarı saydam su örtüsüyle demet ve taş suyun altına alındı.
- **ters-burma:** Şematik ve anlaşılmazdı. İki yumruk demeti ters yönlere buruyor; ortada kendiliğinden kıvrılan halka görünüyor; iki elin üstünde ters dönüş okları var.
- **boya-ceviz:** Robot pençesine benzeyen eldiven çizimi kaldırıldı. Yerine ateşteki kazanda ceviz kabukları, kabuk yığını ve "1 saat" çizildi.
- **boya-isitma:** Kazandaki çileler alev gibi görünüyordu. Krem yün çileleri çubuktan sarkıyor, alt yarıları boya banyosunda.
- **tabak-kul-suyu:** Kepçe, eldiven ve sopa birbirine karışmıştı. Yerde kül yığını, kovaya ok, karıştırma sopası ve yasak (boyalı/çivili tahta ve kömür) bırakıldı.
- **carik-cizim:** "burun 5–6" etiketinde birim yoktu ve hiçbir yeri göstermiyordu. Buruna ölçü çizgisi eklendi, etiket "5–6 cm" oldu.
- **tas-vurma:** Uyluk düz koyu bir zemin gibi okunuyordu. Diz ve baldırıyla yandan bir uyluk çizildi.
- **sap-oturtma:** Kollar iki ayrı kenardan geliyordu. İki el artık aynı yandan geliyor.
- **comlek-tokmak:** Tokmak tahtası çömleğe değmiyordu. Tahta duvara yaslandı.
- **sir-perdah:** El pençe gibi görünüyordu. Avuç taşı çömleğe bastırıyor.
- **dovme-siyah-sicak:** Büyük yasak halkası eli örtüyordu. El açıkta kaldı, köşeye kırmızı çarpı kondu.
- **dokum-su-patlama:** Yasak halkası potayı örtüyordu. Damla potaya düşüyor (ok), metal sıçrıyor, köşede çarpı var.
- **tekerlek-pim:** Anlamsız yağ kabı ve fırça kaldırıldı.
- **kizak-cati:** Ölçü, traversler arasını gösteriyordu ama metin patenler arasını söylüyor. Ölçü çizgisi artık bir traversin boyunca patenden patene uzanıyor.
- **kizak-baglama:** Doğru taraf işaretsizdi. Yeşil onay eklendi.
- **kurek-kesit:** "6–8 mm" yazısı hiçbir yeri göstermiyordu. Kenarda ölçü çizgisi ve bağlantı çizgisi eklendi.

## Null yapılanlar
- **sf-gz-dokuma-agizlik** (dokuma-tezgahi 4): Ağızlık çubuğunun bir alttan bir üstten geçişi ve iki ip takımı, dokuma bilmeyen biri için 2 saniyede okunmuyor. Rehberde çözgü ve kirkit sahneleri kaldı.
- **sf-gz-orgu-duz-ilmek** (orgu 4): Şiş üstündeki ilmekler soyut kalıyor. Rehberde şiş yapma ve tığ zinciri sahneleri kaldı.

İki sahnenin kodu `scenes-a.tsx`'ten, açıklaması `spec.ts`'ten silindi; böylece derlemede kullanılmayan sahne uyarısı kalmadı.

## Spec
Değişen 20 sahnenin açıklaması çizime göre güncellendi.

## Kalan küçük şüpheler
- **dokuma-agizlik ve orgu-duz-ilmek:** null bırakıldı. İleride daha iyi bir anlatım bulunursa yeniden eklenebilir.
- **bileme-aci:** Bıçak uçtan kesit olarak çizildiği için sap görünmüyor. Açı doğru okunuyor; bu yüzden olduğu gibi bırakıldı.
- **torna-yay ve torna-kesme:** İkisi de uçtan görünüş. Torna bilmeyen biri için biraz şematik kalıyor ama artık doğru.
