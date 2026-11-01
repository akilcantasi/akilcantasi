# Çizim raporu (b) — sc-02b

Dosya: `scenes-b.tsx`. Kapsam: süt ürünleri ve tahıl-ekmek-kiler kategorilerindeki 19 rehber. Kategori kapakları (a) ajanında.

## Oyuncular (`CAST`)
- SUT: başörtülü kadın (ten 1, mor üst, uzun lacivert etek). Bütün süt rehberlerinde aynı kişi, yakın planlarda aynı ten ve mor kol.
- FIRIN: topuzlu esmer kadın (ten 2, hardal üst). Ekşi maya, ekmek, yufka, erişte ve bal rehberlerinde.
- AMBAR: bıyıklı adam (ten 1, yeşil üst, kahve pantolon). Bulgur, öğütme, tahıl saklama, kiler, kum, buzhane ve tuz rehberlerinde.
- YARDIM: koyu tenli adam (kiremit üst). Yalnız buz kesmede, ipi tutan ikinci kişi.

Malzeme renkleri dosya başındaki `C` sabitinde: süt, peynir suyu, tereyağı, sadeyağ, buğday, un, bal, kum, saman, buz, taş ve ahşap. Salamuranın rengi `BRINE`.

## Rehber başına çizilenler (adım no → kimlik)
- sut-kaynatma: 4 kaynatma (taşmaya gelen süt, ocak düğmesini kısan el) · 5 termometre (63 °C / 30 dk) · 6 soğutma (soğuk su leğeni). Null: 2 sağım hijyeni.
- yogurt: 2 parmak testi · 3 maya açma · 4 battaniyeye sarma. Null: 1 ısıtma (süt kaynatmayla aynı resim), 8 süzme.
- kurut-kes: 1 tülbentte süzme · 3 top yapma · 5 kerevette tülle kurutma. Null: 9 ezme.
- peynir-1: 5 kesim testi · 6 pıhtıyı küp kesme (1–2 cm) · 7 teleme baskısı. Null: 3 şirden, 4 maya katma.
- peynir-2: 1 tuzlama · 3 tenekede salamura (kesit) · 6 maşayla alma, elle almaya yasak. Null yok.
- lor-cokelek: 2 lor kümeleri (90 °C) · 4 delikli kepçe · 6 çökeleği asarak süzme. Null: 5 çökelek ayrışma.
- tereyagi-sadeyag: 2 yayık · 4 tereyağı yıkama · 7 sadeyağ kıvamı (kesit, dipte tortu). Null: 6 eritme, 8 süzme.
- eksi-maya: 2 besleme (50 + 50 + 50 g) · 5 iki katına çıkma (lastik bant) · 8 bozuk maya. Null: 1 karıştırma.
- ekmek: 3 yoğurma · 6 parmak testi · 8 bazlama sacda. Null: 2 malzemeler, 7 vurma testi. Vurma iki denemede okunmadı (ters somun kâseye benziyordu), yerine bazlama çizildi.
- yufka-lavas: 4 oklavayla açma · 5 sacın üstüne serme (yukarıdan) · 9 su serpme. Null: 7 tandır lavaşı, 8 kurutma.
- bulgur: 3 serip tırmıklama · 4 tane kırma testi · 5 dibek. Null: 2 kaynatma, 8 eleme.
- eriste: 5 şerit kesme · 6 bezde kurutma · 7 kırılma testi. Null: 1 hamur.
- ogutme: 2 el değirmeni · 4 sürtme taşı · 5 eleme. Null: 1 ayıklama.
- tahil-saklama: 1 tane kırma testi (bulgurla ortak sahne) · 3 küp, varil, kavanoz · 7 yerden 40–50 cm. Null: 5 bakliyata kül, 8 fare yalıtımı.
- kiler: 2 havalandırma kesiti (eski "kiler-kesit" ile birleşti) · 5 soğan ve sarımsak örgüsü · 8 toprak yığını. Null: 1 kiler kesiti.
- kumda-saklama: 2 yaprak kesme (2–3 cm) · 3 kum nem testi · 5 kum katmanları. Null: 1 sebze seçimi.
- buzhane: 1 yer seçimi · 2 kesit (drenaj oku) · 5 buz kesme (beldeki ipi kıyıdaki kişi tutuyor). Null: 6 saman katmanı (kesitte görünüyor).
- bal: 3 kuru ve ıslak kaşık · 4 akışkan ve kristal bal (ikisi de doğru) · 5 ılık suda eritme (ateş yok). Null: 1 kavanoz rafı.
- tuz: 2 temiz kıyıdan su alma (fabrika bacası çarpılı) · 5 kristaller, dipte bir parmak sıvı · 6 acı suyu ayırma. Null: 3 süzme, 4 kaynatma (kristal sahnesinde ateş var).

Toplam: 57 adım çizildi, 56 benzersiz sahne. 26 adım null yapıldı.

## spec.ts güncellemeleri
Çizimle uyumlu olması için 14 açıklama yeniden yazıldı: sut-kaynatma, yogurt-maya, kurut-suzme, yayik, maya-besleme, ekmek-yogurma, yufka-sac, tane-kirma-testi, un-eleme, kiler-havalandirma, toprak-yigini, buz-kesme, tuz-kristal, bazlama-sac. Kullanılmayan kimlikler spec'te bırakıldı.

## Kalan şüpheler
- yogurt-parmak-testi: uzatılan parmak yumruğun ortasından çıkıyor; serçe parmak olduğu tam anlaşılmıyor, işaret parmağı gibi okunabilir.
- tane-kirma-testi: dişlemeyi bir azı dişi simgesi anlatıyor; ağızla ısırma doğrudan çizilmedi.
- buzhane-yer: "kuzeye bakan" bilgisi görselde yok; çizim yalnız gölgeli, ağaçlı yamaçtaki taş kubbeyi gösteriyor.
- sut-kaynatma: kaşığı tutan el yok, kaşık tencerede duruyor; ocağı kısan el ve ok var.
- el-degirmeni: tutamak üst taşın yan kenarında; geleneksel değirmende tutamak üst yüzde olur.
- buz-kesme: kesen kişi buz kenarında diz çökmüş; ipin bele bağlandığı nokta küçük ölçekte belli belirsiz.
