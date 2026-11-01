# Hijyen ve sağlık: çizim raporu (a, batch sc-05)

Paket: `sifirdan-hijyen-saglik`. 23 rehber ve 3 kategori kapağı çizildi, toplam 72 sahne. Her rehberde 3 sahne var, kalan adımlar `null`. Sahnelerin hepsi `scenes-a.tsx` dosyasında. `spec.ts` çizilen 72 kimliğe göre yeniden yazıldı; çizilmeyen kimlikler spec'ten çıkarıldı. Derleme 0 uyarı, `check-sifirdan` "hata yok" veriyor; paket boyutu yaklaşık 843 KB.

## Oyuncular (`scenes-a.tsx` başındaki CAST sabitleri)
- KRC (kireç): esmer adam, gözlüklü, ağzı bezli, mavi eldivenli.
- SAB (sabun): açık tenli adam, gözlüklü, eldivenli.
- CAM (çamaşır): başörtülü kadın, hardal üst giysi, uzun etek.
- BIT_ANNE ve BIT_KIZ: topuzlu anne ve uzun siyah saçlı kızı. Uyuz sahnesinde de aynı kız var.
- ATES_H ve ATES_B: hasta adam (mavi) ve topuzlu bakıcı kadın (camgöbeği). Bakım kapağında da onlar var.
- SIVI_ANNE ve SIVI_COCUK: yeşil başörtülü anne ve oğlu.
- ATEL: koyu tenli adam.
- SED_A, SED_B, SED_P: sedyede iki taşıyıcı ve hasta.
- YAT_H ve YAT_B: yatalak yaşlı kadın ve bakıcı adam.
- GEBE: uzun saçlı kadın. Hem gebe hem doğumdan sonraki anne o.
- KAR_H ve KAR_B: karantinadaki hasta adam ve bakıcı kadın.

Bunlar paket genelinde hep aynı renkte: toprak, koyu toprak, dışkı, kireç, kül, kül suyu, demir kazan, tahta, ip ve su (`K.water`).

## Rehber başına çizilen adımlar (adım no 1'den başlar)
- cukur-tuvalet: 1 yer (30 m), 4 kesit (2 m+ ve 1,5 m), 6 zemin (15 cm).
- kompost-tuvalet: 1 iki hazne, 4 idrar ayırma, 9 ağaç ve sebze karşılaştırması.
- kirec: 1 sönmemiş ve söndürülmüş kireç, 3 söndürme (suya kireç eklenir; tersi yasak ek resimde), 5 kova (2 saat).
- cop: 1 dört kap, 6 örtme (10 cm), 8 yakma yasağı.
- sinek-kemirgen: 3 sinek kapanı, 4 kiler, 8 kuru süpürme ile ıslatarak toplama karşılaştırması.
- el-yikama: 3 bidon deliği (12 cm), 6 pedal düzeneği (15 cm), 9 kullanım (20 sn).
- kul-suyu: 1 kül seçimi, 3 süzme fıçısı kesiti, 7 yumurta testi.
- sabun: 3 kazanda karıştırma, 5 bıçak testi, 8 kalıp kesme.
- camasir: 1 ayırma, 5 kaynatma (55 °C+), 7 güneşte kurutma.
- bit-pire-uyuz: 1 sirke (büyüteç), 2 ıslak tarama, 7 uyuz bölgeleri.
- dis: 2 misvak ucu (1 cm), 3 misvakla silme yönü, 6 parmağa sarılı bez.
- kadin-hijyeni: 2 ped dikişi, 5 ıslatma, 7 güneşte kurutma.
- bebek-bezi: 2 katlama, 7 kovanın yüksekte durması, 8 kaynatma.
- yara-bakimi: 1 tuzlu su (1 L, 9 g), 5 yıkama, 7 sarma.
- enfeksiyon: 1 yerel belirtiler, 2 sınır çizme (14:00), 8 nabız (30 sn).
- atesli-hasta: 2 sıvı verme, 3 ince örtü ile kalın yorgan karşılaştırması, 5 çizelge.
- sivi-kaybi: 1 ORS (1 L, 6, ½), 4 deri çimdik testi (2 sn+), 6 kaşıkla verme.
- atel-degnek: 3 bağlama, 4 tırnak testi (2 sn), 6 değnek ölçüsü (5 cm).
- sedye: 2 battaniye katlama, 3 ceketli sedye, 8 yokuşta baş yukarıda.
- yatalak-hasta: 2 baskı noktaları, 4 topuk boşta, 7 dik oturtup besleme.
- gebelik-dogum: 3 beslenme, 5 doğum seti, 7 ten tene temas (ikisi de battaniye altında; yalnız bebeğin başlıklı başı görünür).
- karantina: 1 üç bölge planı, 2 hasta odası, 4 maskeli ve eldivenli bakıcı.
- olum-defin: 2 kayıt defteri, 6 mezar yeri (200 m+), 7 derinlik kesiti (1,5 m ve 2 m+; ayrıntısız beyaz kefen).

## Bilerek null bırakılanlar
- Hassas sahneler:
  - defin-koruyucu: insanlar cesedi hazırlıyor.
  - gobek-bakimi: bebeğin çıplak karnı.
  - gebe-tehlike: simge listesi.
  - enf-sepsis ve enf-cocuk: belirti listesi, ağır hasta görüntüsü.
- Soyut ya da metinle yeterli adımlar: ölümü doğrulama, gelenekler, kuluçka süreleri, uyarı ve yönlendirme adımları.
- Sahnesi olan ama 3 sınırı yüzünden seçilmeyenler:
  - tuvalet-kul, tuvalet-kapama
  - kirec-serpme, kirec-badana
  - cop-cukur
  - fare-delik
  - elyikama-direk, elyikama-cukur
  - kul-dokme
  - sabun-yag, sabun-tuz
  - camasir-ovma, camasir-torba
  - bit-giysi, uyuz-torba
  - dis-calkalama
  - ped-torba
  - bez-temizleme, bez-gunes
  - yara-bez-kaynatma, yara-karsilastirma
  - ates-yatak, ates-el
  - ors-belirti
  - atel-dolgu, degnek-kullanim
  - sedye-deneme, sedye-tasima
  - yatak-cevirme, yatak-eklem
  - karantina-kova, karantina-kontrol
  - defin-isaret

## Kalan şüpheler
- Haç biçiminde çizilen mezar işaretleri sade yuvarlak taşlarla değiştirildi. Dinî simge yok.
- elyikama-pedal: düzenek basılmamış hâlde. Ok basma yönünü gösteriyor, akan su yok. "15 cm" ölçü oku küçük kaldı.
- yatak-topuk: yakın plan elle çizildi. Ayak orantısı biraz büyük ama mesaj (topuk havada) okunuyor.
- bez-kova: kit'in `POSE.crawl` duruşu bebekte biraz tuhaf duruyor. Köşedeki küçük resim kalabalık.
- gebe-beslenme: gebelik, elle eklenen bir karın çıkıntısıyla gösterildi. Figür sahne yüksekliğinin %45'i kadar, yani ölçek kurallardaki %60–80'in altında.
- uyuz-yerler: bel ve kasıktaki noktalar kolların arkasında az görünüyor. Kasık bilerek işaretlenmedi.
- sedye-battaniye: katlama şeması soyut. Metinle birlikte okunması gerekiyor.
- Metindeki sayılar (200 m, 1,5 m, 2 m, 9 g, 75 ml/kg ve benzeri) RAPOR.md'deki kaynak şüphelerini taşıyor. Çizimler metni birebir izliyor.
