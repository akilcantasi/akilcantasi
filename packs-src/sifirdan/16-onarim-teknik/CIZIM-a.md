# 16-onarim-teknik — çizim raporu (harf a, batch sc-16)

Paket: sifirdan-onarim-teknik. 14 rehber, 41 rehber çizimi ve 2 kategori kapağı, toplam 43 sahne. Hepsi `scenes-a.tsx` içinde. `scenes.tsx` yalnız A'yı birleştiriyor. Hiçbir çizim null yapılmadı. Rehberlerdeki `art` dizileri değişmedi; spec'te seçilen adımlar çizildi. Spec satırları çizime göre sadeleştirildi.

## Oyuncular (CAST)
- Rıza usta: adam, camgöbeği üst, buğday ten, bıyık, haki pantolon. Rehberler: sap, eğe, pas ve zincir-rulman (el yakın planlarında aynı ten ve kol rengi). Gerekli yerlerde gri eldiven.
- Zeynep: kadın, mor üst, esmer ten. Ayakkabı, çanta ve yapıştırma rehberlerinde yalnız elleri görünüyor.
- Emre: adam, hardal üst, açık ten, kahverengi saç. Cihaz arızası 1–2.
- Selin: kadın, yeşil üst, kızıl at kuyruğu. Kristal radyo ve anten.
- Kemal: adam, camgöbeği üst, esmer ten. Kızı Ela: kiremit üst. Yelken ve kıyı rehberlerinde ikisi de turuncu can yelekli.

Malzeme renkleri pakette sabit: ahşap K.wood, çelik gri, pas kiremit, bakır tel turuncu-kahve, ip saman sarısı, can yeleği turuncu.

## Rehber başına çizilenler
- sap-degistirme: 2 matkapla delme, 3 ters baş ve iki takozla çakma (göz kesitte), 7 sapın ucunu kütüğe vurma (köşede çekiçle başa vurma yasak).
- ege-bileme: 1 mengenede çapa (köşede kucakta tutma yasak), 4 pahın üstünde eğe ve 30–45°, 7 balta ağzı kesiti (25°, 5–7 cm).
- pas: 1 sirkeli leğen ve 24 saat (köşede sirke + çamaşır suyu yasak), 3 çelik yünle ovma, 7 yağlı kum kovası. Kazma yerine kürek çizildi.
- ayakkabi: 2 zımparalama, 3 yapıştırıcı, 10–15 dk ve pencere, 6 burundan topuğa bastırma (köşede iple sarılı bot, 24 saat).
- canta: 2 pense ile sürgü sıkma, 6 kare + çarpı dikiş (4–5 cm).
- zincir-rulman: 1 dönen zincire bezli el yasak (köşede prizden çekilmiş fiş), 2 şerit metreyle 1 m ölçme, 6 rulmanı çevirme ve oynatma. Spec'teki dişli karşılaştırması ve gres kesiti çıkarıldı.
- yapistirma: 3 plastik kodları ve seramik/epoksi (cam kâse çıkarıldı), 4 sıcak şişle plastik kaynağı, 6 bantlı kupa kum kabında, 24 saat.
- cihaz-guvenlik: 1 fiş prizden çekilmiş, boş priz ve kişinin elindeki fiş (köşede prizdeyken açma yasak), 4 kablo yoklama (köşede boş priz), 7 mikrodalga ve CRT yasak.
- cihaz-olcum: 2 COM/VΩ soketleri (A çarpılı), 4 kablo sürekliliği (fiş masada, köşede boş priz), 8 gövde kaçak denetimi, ekranda OL (köşede bip yasak).
- kristal-1: 4 bobin (9 cm, 60 sarım, 20/40 ara uç), 6 parçalar, 9 devre. Devre: anten → bobin üstü ve kondansatör; toprak → bobin altı, kondansatörün öbür ucu ve kulaklığın ikinci ucu; diyot üst hattan kulaklığın birinci ucuna, katot bandı kulaklık tarafında. Metindeki bağlantılarla birebir.
- kristal-2: 1 iki çam arasında anten (30 m+), 3 hat uzaklığı (anten rehberiyle ortak sahne), 5 toprak çubuğu (1 m+) ve sulama.
- anten: 3 dipol ölçüleri, 4 orta yalıtkan ve silikon, 7 hat uzaklığı (≥ 2 × boy).
- yelken: 1 salda adam ve çocuk can yelekli, kıyıda el sallayan kadın; 2 rüzgâr yönü iki panel; 5 köşe ipleri elde (köşede düğümlü ip yasak). Saldaki herkes can yelekli.
- kiyi: 5 hizalama (güverteden bakış), 6 sürüklenme iki panel, 7 iskandil ipi ve sığlık.
- Kapaklar: onarım (tezgâhta eğeyle bileme, alet panosu), teknik (anten teli, kulübe, can yelekli kişiyle yelkenli sal; spec'teki radyo masası ve uzak elektrik hattı çıkarıldı).

## Kalan şüpheler
- sf-ot-ege-vurus: Kesit çizimi. Açı yayı küçük ve plakanın içinde kalıyor; uzman olmayan biri için açıyı okumak biraz zor.
- sf-ot-canta-fermuar-pense: Önden görünüşte "üst ve alt plakayı sıkma" anlatılamıyor. Çizim pense sapının sıkıldığını gösteriyor.
- sf-ot-olcum-kablo ve sf-ot-olcum-govde: Ölçü kabloları ve cihaz kablosu birlikte biraz kalabalık.
- sf-ot-yelken-ip-elde: Kare yelken izleyiciye dönük çizildi (yandan bakışta gerçekte kenardan görünürdü). Köşedeki "düğümlü ip" karesi küçük.
- Spec'te istenen "eğe geri gelirken kaldırılır" kesik oku çizilmedi; yalnız ileri vuruş oku var.

Kontroller: check-sifirdan "hata yok"; derleme 0 uyarı, 0 hata; sahne dosyası tsc'den temiz geçiyor.
