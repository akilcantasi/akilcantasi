# Çizim raporu — 08-giyim-zanaat, harf b (batch sc-08b)

Sahne dosyası: `scenes-b.tsx`. Kategori kapakları a ajanında. 22 rehber, 66 sahne çizildi (rehber başına 3).

## Oyuncular (CAST, dosya başında)
- carver: kaşık/kase. Adam, buğday ten, kahve saç, yeşil üst.
- basket: sepet (yalnız eller ve nesne çizildi).
- turner: torna. Adam, esmer, bıyıklı, hardal üst.
- potter: kil, çömlek şekli, pişirme, sır. Kadın, topuz siyah saç, mor üst.
- maker: tutkal, reçine, katran. Adam, açık ten, kızıl saç, kiremit üst.
- smith: demirci ocağı, dövme, su verme, hurda, döküm. Adam, esmer, bıyıklı, gri-mavi pamuklu uzun kol. Her sahnede deri önlük, koruyucu gözlük ve eldiven var (`Smith()`). Yakın planlarda eller `Mitt` eldiveniyle çizildi.
- cart: tekerlek, el arabası, kağnı. Adam, sarışın, yeşil üst.
- sled: kızak. Kadın, kızıl uzun saç, mavi üst.
- raft: sal ve kürek. Adam, hardal üst. Salda her zaman can yeleği giyiyor (`Vest()`).
- bike: bisiklet. Koyu tenli kadın, camgöbeği kol.

Malzeme renkleri paket genelinde aynı (`M` sabiti): ham kil, kuru kil, pişmiş toprak, demir, ahşap, su (K.water).

## Rehber başına çizilen adımlar (adım no 1'den)
- kasik-kase: 3 kasik-cizim, 6 kasik-oyma, 7 kase-kor. Null: 2 (yarma), 4 (çentik).
- sepet: 4 taban, 5 ikili-orgu, 6 dikme. Null: 1 (kesme), 8 (ağız).
- yay-tornasi: 3 torna-yay, 4 torna-direk, 7 torna-kesme. Null: 1 (mantık), 2 (tezgâh).
- kil-hazirlama: 2 düğüm testi, 4 süzme, 7 yoğurma. Null: 1 (bulma), 6 (katkı).
- comlek-sekil: 2 sucuk, 4 sıvama, 7 tokmak. Null: 3 (çizme).
- comlek-pisirme: 3 ön ısıtma, 4 dizme, 5 ateş. Null: 7 (çınlama).
- sir: 1 kurşun yasak, 2 perdah, 8 deneme. Null: 4 (süt).
- tutkal: 3 pişirme, 4 süzme, 6 su banyosu. Null: 7 (balık kesesi).
- recine: 2 güvenlik, 6 kömür, 8 çubuk. Null: 1 (toplama), 4 (süzme).
- odun-katrani: 2 kaplar, 4 sıvama, 5 ateş. Null: 3 (gömme), 7 (toplama).
- demirci-ocagi: 2 kesit, 6 örs yüksekliği, 9 koruyucu. Null: 3 (körük), 5 (demir sokma).
- dovme: 1 renkler, 4 vuruş, 8 siyah-sıcak. Null: 5 (sivriltme).
- su-verme: 4 mıknatıs, 5 daldırma, 8 meneviş renkleri. Null: 3 (kap), 7 (eğe testi).
- hurda-alet: 1 seçim, 2 galvaniz yasak, 4 kapalı kap yasak. Null: 5 (deneme), 8 (çivi).
- dokum: 3 su patlaması, 7 kalıp, 8 koruyucu. Null: 1 (açık hava), 4 (ön ısıtma).
- tekerlek: 1 kalas, 3 pergel, 7 pim. Null: 5 (göbek), 6 (aks tipleri).
- el-arabasi-kagni: 1 yük, 5 kaldırma, 6 kağnı parçaları. Null: 2 (çatı), 8 (boyunduruk; öküz çizimi riskli).
- kizak: 3 çatı, 4 bağlama, 6 çekme. Null: 1 (bükme), 8 (yokuş).
- sal: 1 akıntı yasak, 4 çapraz sırık, 7 oturma (can yelekli). Null: 3 (dizme), 6 (bidon).
- kurek: 1 ölçü, 3 çizim, 4 kesit. Null: 8 (bağlama).
- bisiklet-lastik: 2 sökme, 3 delik bulma, 7 yama. Null: 5 (dış yoklama), 9 (şişirme).
- bisiklet-bakim: 1 kontrol, 3 zincir yağ, 5 fren pabucu. Null: 6 (fren ayarı).

spec.ts'te çizime göre sadeleştirilen açıklamalar: kaşık oyma, kase kor, sepet örgü/dikme, üç torna sahnesi, kil süzme/yoğurma, sucuk, sıvama, tokmak, pişirme ön ısıtma/ateş, tutkal süzme, reçine güvenlik/çubuk, üç katran sahnesi, ocak sahneleri, dövme renk/vuruş, su verme sahneleri, galvaniz, kapalı kap, döküm sahneleri, tekerlek pim, el arabası, kağnı, sal oturma, kürek ölçü, bisiklet sahneleri.

## Kalan şüpheler
- dovme-siyah-sicak: uzanan çıplak el yasakla çizildi; bu sahnede eldiven yok. Gösterilen şey yasak davranış olduğu için böyle bırakıldı.
- torna-yay ve torna-kesme parçayı uçtan gösteriyor. Teknik olarak doğru ama torna bilmeyen biri için soyut kalabilir.
- Dökme ve süzme akışları (kil süzme, tutkal süzme, katran ateş) biraz hortum gibi görünebilir.
- katran-ates: alevler kabın çevresindeki odunların çoğunu örtüyor.
- elarabasi-yuk: ok kalınlıkları farkı küçük ekranda zayıf kalabilir.
- kurek-cizim ve kurek-kesit iki ölçü yazısı taşıyor. Bunlar etiket değil ölçü yazısı; "tek etiket" kuralını esnetiyor.
