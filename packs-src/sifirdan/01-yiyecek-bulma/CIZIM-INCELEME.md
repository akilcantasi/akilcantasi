# 01-yiyecek-bulma: bağımsız çizim incelemesi (batch si-01)

83 sahne incelendi: 79 rehber sahnesi ve 4 kategori kapağı.

| Sınıf | Sayı |
|---|---|
| İYİ | 58 |
| ZAYIF | 17 |
| KÖTÜ | 8 |

Bütün ZAYIF ve KÖTÜ sahneler yeniden çizildi ya da düzeltildi. Son paftalarda hepsi İYİ. Null yapılan sahne yok.

## KÖTÜ → yeniden çizildi
- **cigdem-sogan** (zehirli-benzerler, kok-yumru): eski çizimde kol kadının bedenine bağlı değildi, çerçeve köşesinden geliyordu. Artık kadının kendi kolu var (IK), ezilmiş yaprağı burnuna tutuyor.
- **test-dudak**: aynı kopuk kol sorunu vardı. Kadın artık kendi eliyle parçayı dudağına değdiriyor.
- **catal-yem**: çatal kanca balığın boğazında gövdeyle paralel duruyordu. Metin "yan döner" diyor; çubuk artık boğazda enine.
- **kerevit-tutma**: el kuyruktan tutuyordu. Artık sırttan, kıskaçların hemen gerisinden tutuyor. Köşedeki "yanlış" kutusu da netleşti: el kıskacın ucundan tutuyor.
- **sarbon-les**: beyaz bir yığın ve boşta duran bir yasak halkası vardı. Yeniden çizildi: yünlü, şişmiş ölü koyun, kaskatı bacaklar, X göz, burundan kan, tek büyük çarpı.
- **eldiven-maske**: eldivenler havada süzülüyordu. Artık kadın eldivenli ellerini kaldırmış, kolları bedenine bağlı.
- **balik-fileto**: kesim çizgisi ve ok başa doğruydu. Metin "omurga boyunca kuyruğa" diyor; çizgi ve ok kuyruğa çevrildi.
- **tetik-dort**: taş havada duruyordu ve "4" biçimi okunmuyordu. Doğru geometriyle yeniden çizildi: taşın bir ucu yerde, öbür ucu kaldıracın tepesinde. Aynı düzenek `Fig4Trap` yardımcısıyla **dusen-tas-kurulu** sahnesinde de kullanılıyor.

## ZAYIF → düzeltildi
- **ebegumeci**: yapraklar yıldız gibi sivriydi; yuvarlak ve dalgalı kenarlı yapıldı.
- **semizotu-sutlegen**: koparılan uç süt damlası gibi soluk görünüyordu; yeşil yapıldı.
- **palamut-soyma**: kötü palamutlar havada süzülüyordu. Yerine taş üstünde kararmış, lekeli içler kondu.
- **palamut-kaynatma**: ikinci tencere ve aktarım oku 5. adımı anlatıyordu ve adım 4 ile karışıyordu. Artık tek kapaklı tencere ve "20 dk" var.
- **midye-secme**: elde tutulan açık midye okunmuyordu. Kumda ağzı açık bir ölü midye çizildi.
- **kanca-diken**: diken küt bir topuz gibiydi; sivri ve geriye kıvrık yapıldı.
- **kanca-tahta**: diken saptan büyük bir muz gibiydi; küçültüldü ve geriye kıvrıldı.
- **kerevit-ip**: kerevit çerçevenin altında kesiliyordu; artık tamamı görünüyor, yemi kıskaçlarıyla tutuyor.
- **safak-hayvan** ve **ruzgar-yonu**: karacanın başı bacakların arasında kayboluyordu, başsız at gibi görünüyordu. `Deer` başı yeniden çizildi (burun, kulak, göz, öne uzanan boyun). Tavşan da karacanın önünden çekildi.
- **kus-haslama**: el kuşun ayaklarına değmiyordu, kuş suyun üstünde duruyordu. Artık el ayakları kavrıyor ve kuş tencereye batmış görünüyor.
- **tavsan-deri-yarma**: hayvan böceğe benziyordu. Uzun kulaklar (iç tarafı pembe), burun ve uzun arka bacaklar eklendi.
- **organ-kist**: köpek kutusu 3. adım metninde geçmiyordu ve köpek kırpılmıştı. Sahne, kist hidatik ve köpek uyarısının yazdığı **4. adıma taşındı** (3. adım artık null). Köpek yeniden çizildi, önüne organ parçası kondu.
- **ilmek-yukseklik**: metinde olmayan kazık, tel yayı ve ok kaldırıldı.
- **tas-havuz**: duvarın kıyıya bağlandığı belli değildi. Solda kara şeridi ve denizde çekilme oku eklendi.
- **cekirge-temizleme**: arka bacak bir çubuğa benziyordu. Kalın uyluklu, dikenli bir sıçrama bacağı çizildi.
- **dusen-tas-kurulu**: tetik-dort ile aynı düzeneğe geçirildi (yukarıya bakın).

## Diğer değişiklikler
- **spec.ts**: değişen 14 sahnenin açıklaması çizimle eşleştirildi.
- **guides.ts**: yalnız `sf-yb-ic-organ` rehberinin `art` dizisi değişti (organ-kist 3. adımdan 4. adıma).

## Kontroller
- Derleme: 0 uyarı, 0 hata.
- `check-sifirdan`: hata yok.

## Kalan küçük notlar
- **palamut-kaynatma**: kapağın altında suyun mavi kenarı görünüyor. Kit `Pot`'tan geliyor, anlamı bozmuyor.
- **kus-haslama**: kuşun başı suyun içinde. Görünen kısım gövde ve kuyruk; okunuyor ama şematik.
