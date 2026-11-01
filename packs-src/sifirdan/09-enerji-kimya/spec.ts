// Sıfırdan: Enerji ve kimya — çizim açıklamaları (detaylı düz illüstrasyon, 4:3)
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  'sf-ek-makine-kapak': 'Yandan kırsal avlu: bir kişi uzun sırıkla kayayı kaldırıyor, yanda ağaca asılı makarada sandık. Sade arka plan.',
  'sf-ek-su-ruzgar-kapak': 'Yandan: oluktan su alan üstten dolan çark derenin kıyısında dönüyor, arkada çok kanatlı rüzgâr pompası. Mavi ve yeşil tonlar.',
  'sf-ek-elektrik-kapak': 'İç mekân önden: rafta akü, aküye yakın sigortalı kırmızı-siyah kablolar, duvarda şarj kontrolcüsü; pencereden güneş paneli görünüyor; yanan LED lamba.',
  'sf-ek-kimya-kapak': 'Yandan açık hava atölyesi: gözlüklü kişi taş ocak üstündeki demir kazanı sopayla karıştırıyor; yanda mum, mürekkep şişesi ve kâğıt. Mor vurgu.',

  // Kaldıraç
  'sf-ek-kaldirac-kollar': 'Yandan şema: uzun bir sırık, altında üçgen destek noktası, bir ucunda taş yük, öbür ucunda aşağı bastıran el. Destekten ele uzun mavi ok "kuvvet kolu", destekten yüke kısa kırmızı ok "yük kolu".',
  'sf-ek-kaldirac-ornek': 'Yandan: bir kişi 2 m\'lik sırığın ucuna iki eliyle bastırıyor, sırığın öbür ucu büyük bir kayanın altında, kayaya 20 cm uzakta düz bir taş destek. Etiketler "1,8 m" ve "0,2 m", kaya yukarı turuncu ok.',
  'sf-ek-kaldirac-takoz': 'Yandan: kişi sırıkla kayayı birkaç santim kaldırmış (sırığın ucu kayanın altında); çömelmiş ikinci kişi alttaki takozun üstüne ikinci takozu yandan eliyle sürüyor, eli yükün dışında; turuncu itme oku.',
  'sf-ek-kaldirac-elarabasi': 'Yandan: el arabası, taşlar tekerleğe yakın, kişi kollardan kaldırıyor; kolların yanında turuncu yukarı ok.',

  // Palanga
  'sf-ek-palanga-sabit': 'Önden iki küçük şema yan yana: solda dala asılı tek sabit makara, ip aşağı çekiliyor, yük yukarı, "1×" etiketi; sağda yüke bağlı hareketli makara (ipin bir ucu dalda, öbür ucu daldaki yön makarasından geçip aşağı çekiliyor), iki ip kolu yükü taşıyor, "2×" etiketi. İki panelde de ipi tutan el alt kenardan geliyor.',
  'sf-ek-palanga-kollar': 'Önden: dala asılı iki makaralı üst blok, yüke bağlı iki makaralı alt blok; ipin ölü ucu üst blokta, alt bloğu taşıyan dört ip kolu numaralı (1–4). Kişi üstten inen serbest ucu çekiyor, "4×" etiketi.',
  'sf-ek-palanga-baglama': 'Yandan: kalın, canlı bir ağaç dalına sapanla bağlanmış üst makara; dalın gövdeye yakın kısmı seçilmiş. Yanında kuru ince dal üstünde kırmızı yasak işareti.',
  'sf-ek-palanga-emniyet': 'Yandan: dala asılı basit palanga (sabit + hareketli makara); bir kişi serbest ucu çekiyor, ipin devamı yerde kazığa iki tur sarılı, ikinci kişi ucunu tutuyor; kazık çevresinde turuncu sarma oku.',
  'sf-ek-palanga-yasak': 'Önden: havada asılı ağır sandık, altında duran bir kişi silueti üzerinde kırmızı yasak işareti; yanda güvenli mesafede çeken kişi yeşil onayla.',

  // Rampa
  'sf-ek-rampa-oran': 'Yandan şema: kamyon kasasına dayalı kalas rampa, dikey yükseklik "1 m" (kırmızı), rampa boyu "4 m" (mavi); rampada sandık ve yukarı doğru turuncu ok.',
  'sf-ek-rampa-merdane': 'Yandan: taş blok aynı kalınlıkta üç yuvarlak kütüğün üstünde, kişi arkadan itiyor; sıradaki kütük bloğun önünde yerde bekliyor; hareket yönünde turuncu ok.',
  'sf-ek-rampa-emniyet-ipi': 'Yandan: rampada yukarı çekilen sandık; önde iki kişi çekme ipinde, arkada sandığa bağlı ikinci ip yerdeki kazığa sarılı ve üçüncü kişi tutuyor. Emniyet ipi yeşil vurgulu.',
  'sf-ek-rampa-yasak': 'Yandan: rampada sandık; rampanın alt ucunda, yükün kayacağı hatta duran kişi üzerinde kırmızı yasak işareti; sandıktan kişiye doğru kırmızı "kayma" oku.',

  // Bocurgat
  'sf-ek-bocurgat-oran': 'Uç görünüş (yakın plan): kütük tambur kesiti ve mile bağlı dirsekli kol; kol yarıçapı "50 cm" mavi, tambur yarıçapı "10 cm" kırmızı; tamburdan sarkan ipte kova, dönüş yönünde turuncu yay ok, "5×" etiketi.',
  'sf-ek-bocurgat-kuyu': 'Yandan: taş kuyu ağzının iki yanında çatallı ağaç direkler, üstünde kütük tambur; yaşlı adam dirsekli kolu çeviriyor, ip kuyuya iniyor, ipin yanında yukarı turuncu ok.',
  'sf-ek-bocurgat-mandal': 'Yakın plan: testere dişli çark ve dişlere dayanan ağır tahta dil (mandal); serbest dönüş yönünde turuncu yay ok, geri dönüş yönünde kırmızı yay ok ve kırmızı çarpı.',
  'sf-ek-bocurgat-yatay': 'Yukarıdan: dikey milli bocurgat, iki kişi çapraz kolları itiyor; ip tambura üç tur sarılı, üçüncü kişi boşalan ucu gergin tutarak geride topluyor. Uzakta çekilen kütük.',

  // Ağırlık ve sarkaç
  'sf-ek-agirlik-mil': 'Mil ucu görünüşü: duvardaki tahta yatağa takılı mil, mile sarılı ipte asılı taş ağırlık; aynı mil üstünde dört kanatlı tahta hava freni. İniş yönünde turuncu ok, dönüş yönünde turuncu yay ok.',
  'sf-ek-sarkac-kurulum': 'Önden: kapı kasasının üst kirişine çakılı çividen sarkan ince ip, ucunda yuvarlak taş; kişi taşı eliyle tutup hafifçe yana çekmiş; dikey kesik çizgi ve küçük açı yayı.',
  'sf-ek-sarkac-olcu': 'Yakın plan yandan: şerit metre çividen taşın ortasına kadar uzanıyor, "99,4 cm" etiketi; salınım yayının iki ucu arasında "1 sn".',
  'sf-ek-sarkac-sayma': 'Önden: kişi sarkaca bakıp parmaklarıyla sayıyor, yanında yere düşen bir çubuğun gölgesi; "60" etiketi.',

  // Çamaşır
  'sf-ek-camasir-kova': 'Yakın plan kesit: kapaklı kova, kapağın ortasındaki delikten geçen sopa ve ucunda delikli ters huni (piston); kova yarıya kadar su ve çamaşır; deliklerden çıkan su için mavi oklar, sopada yukarı-aşağı turuncu oklar.',
  'sf-ek-camasir-piston': 'Yakın plan: sopanın ucuna çakılmış ters huni, kenarında delikler; deliklerden çıkan su için küçük mavi oklar.',
  'sf-ek-camasir-calkalama': 'Yandan: kişi ayakta, iki eliyle sopayı kovada aşağı yukarı itiyor; yukarı-aşağı turuncu çift ok, "3–5 dk".',
  'sf-ek-camasir-burma': 'Yandan: ıslak çarşafın bir ucu direğe bağlı, kişi öbür uca geçirilmiş sopayı iki eliyle çeviriyor, su damlıyor; dönme yönünde turuncu ok.',

  // Zir
  'sf-ek-zir-testiler': 'Önden: iki sırsız toprak testi yan yana, küçüğü büyüğün içine girecek boyda; yanında kum yığını ve su kovası.',
  'sf-ek-zir-kesit': 'Yandan kesit: büyük testinin içinde küçük testi, arada ve altta ıslak kum (koyu kahve), iç testide domates ve biber, üstte ıslak bez.',
  'sf-ek-zir-golge': 'Yandan: ağaç gölgesinde, rüzgâr çizgileri arasında duran zir yeşil onayla; güneş altında duran zir kırmızı çarpıyla.',
  'sf-ek-zir-sulama': 'Yakın plan kesit: iki testinin ağzı, el maşrapayla aradaki kuma su döküyor; "günde 1–3" etiketi.',

  // Su çarkı
  'sf-ek-su-carki-dusu': 'Yandan: dere yatağından ayrılan oluk; oluğun başı ile çarkın alt ucu arasında dikey ölçü oku "düşü"; bir kişi su dolu şeffaf hortumla seviye alıyor.',
  'sf-ek-su-debi-kova': 'Yakın plan: oluğun ucundan akan su 10 litrelik kovaya doluyor; yanında saat simgesi, "2 sn" ve "5 L/sn" etiketleri.',
  'sf-ek-su-carki-ustten': 'Yandan: üstten dolan kovalı çark, oluk suyu çarkın tepesine döküyor, sağ yandaki dolu kovalar aşağı iniyor; dönüş yönünde turuncu ok, "2 m+" düşü ölçüsü.',
  'sf-ek-su-carki-alttan': 'Yandan: hızlı akan düz derede alttan çarpan düz kanatlı çark, akış yönünde mavi oklar, çark dönüş yönünde turuncu ok.',
  'sf-ek-su-carki-savak': 'Yakın plan: oluğun başında tahta sürgülü kapak (savak), kişi kapağı indiriyor, su yan kanaldan dereye geri akıyor.',

  // Su değirmeni
  'sf-ek-degirmen-genel': 'Yandan kesit: tepede ark ve küçük havuz, havuzdan değirmen binasının altına inen eğimli oluk, binanın altında yatay çark, üst katta taşlar. Su akış yönü mavi oklar.',
  'sf-ek-degirmen-oluk': 'Yakın plan: giderek daralan tahta oluğun ağzından güçlü su fışkırması, kanatlara çarpıyor.',
  'sf-ek-degirmen-cark': 'Hafif üstten: kalın göbek çevresinde eğik kanatlar, göbekten yukarı çıkan dikey mil; soldan oluk ağzından fışkıran su; dönüş yönünde turuncu ok.',
  'sf-ek-degirmen-tas': 'Yandan kesit: alt taş "sabit", ortasındaki delikten geçen mil üst taşın gözüne demir köprüyle bağlı; taşlar arası ince boşluk; mil aşağıda çarka iner. Üst taşta turuncu dönüş oku.',
  'sf-ek-degirmen-ambar': 'Yandan: üst taşın üstünde tahta huni (ambar), altındaki eğik oluktan tahıl akıyor, oluğa dokunan sallanan çubuk; çevreye un dökülüyor.',

  // Yel değirmeni / rüzgâr pompası
  'sf-ek-yel-cok-kanat': 'Önden: kafes kule tepesinde 16 kanatlı rüzgâr çarkı ve kuyruk; kule dibinden su deposuna giden boru.',
  'sf-ek-yel-bez-yelken': 'Önden: Ege tipi beyaz taş gövdeli yel değirmeni, sekiz kirişe gerili üçgen beyaz bezler, üçü sarılmış.',
  'sf-ek-yel-kuyruk': 'Yukarıdan: rüzgâr çarkı ve arkasındaki büyük kuyruk kanadı; rüzgâr yönü mavi oklar, çarkın rüzgâra döndüğünü gösteren turuncu yay ok.',
  'sf-ek-yel-pompa-cubugu': 'Yandan kesit: kule tepesinde yandan görünen çark, dişli kutusu, krank ve karşı ağırlık; krankı kuyudaki pompa silindirine bağlayan uzun dikey çubuk; çıkış borusu depoya gider; çubukta yukarı-aşağı turuncu oklar.',
  'sf-ek-yel-firtina': 'Önden: kuyruğu katlanmış, çarkı rüzgâra yandan bakan durdurulmuş rüzgâr pompası, fren kolu çekili; arka planda koyu bulutlar. Kuleye çıkan kişi silueti kırmızı yasakla.',

  // El pompası
  'sf-ek-pompa-emme': 'Yandan kesit: üstte kollu emme pompası (tulumba), boru su yüzeyine iniyor; su yüzeyi ile pompa arası kırmızı ölçü ve "≤ 7 m" etiketi.',
  'sf-ek-pompa-derin-kuyu': 'Yandan kesit: derin kuyuda suyun içinde duran pistonlu silindir, yukarıdaki pompa koluna uzun çubukla bağlı; "≈30 m" etiketi.',
  'sf-ek-pompa-dip-klape': 'Yakın plan kesit: emme borusunun dibinde süzgeç ve tek yönlü klape; su yukarı mavi ok, aşağı dönüşte kırmızı çarpı.',
  'sf-ek-pompa-doldurma': 'Yandan: pompa solda (kolu sola bakıyor), kişi sağda; kovayı iki eliyle eğip pompanın üst ağzına temiz su döküyor.',
  'sf-ek-pompa-kuyu-agzi': 'Yandan: kapaklı kuyu ağzı, çevresinde dışarı eğimli beton tabla, döküntü su kuyudan uzağa akıyor (mavi ok); yeşil onay.',

  // Koç pompası
  'sf-ek-koc-genel': 'Yandan şema: dere üstünde küçük bent, bentten aşağı inen düz besleme borusu, dipte pompa gövdesi, pompadan tepedeki depoya çıkan ince boru. Etiketler "düşü" ve "çıkış yüksekliği".',
  'sf-ek-koc-boru': 'Yandan: düz, dirseksiz çelik besleme borusu; boru boyunda ölçü oku "düşünün 3–7 katı". Yanda kıvrımlı hortum kırmızı çarpıyla.',
  'sf-ek-koc-klapeler': 'Yakın plan kesit: besleme borusundan gelen su pompa gövdesinde; gövdenin üstünde ağırlıkla aşağı sarkıp açık duran atık klapesi ve çevresinden fışkıran su; yanında yukarı açılan çıkış klapesi, üstünde içinde bisiklet iç lastiği olan kapalı hava odası ve yandan çıkış borusu; su akışı mavi oklar.',
  'sf-ek-koc-hava-odasi': 'Kesit: çıkış klapesinin üstünde kapalı boru hava odası, içinde biraz şişirilmiş bisiklet iç lastiği; üstten çıkış borusu.',
  'sf-ek-koc-calistirma': 'Yakın plan: parmak atık klapesinin sapına aşağı bastırıyor, klapeden su sıçrıyor; "30–100/dk" etiketi.',

  // Mikro hidro
  'sf-ek-hidro-dusu-hortum': 'Yandan: yamaçta iki kişi; üstteki su dolu şeffaf hortumun ucunu yerde tutuyor, hortum yamaçta yatıp aşağıdaki kazığa çıkıyor; alttaki kişi hortumu kazıkta tutuyor, su seviyesi üst uçla aynı; seviye kesik çizgisi ile kazık dibi arasında "1 basamak" ölçüsü.',
  'sf-ek-hidro-turbin-tipleri': 'Üç küçük panel yan yana: kaşıklı çark ve ince fışkırma "yüksek düşü"; silindir kafesli çapraz akış türbini "orta"; boru içinde pervane "alçak".',
  'sf-ek-hidro-boru': 'Yandan: yamaçtan inen kalın boru, tepede hava firarı, altta vana ve türbin kutusu; kişi vanayı yavaşça çeviriyor, "yavaş" etiketi.',
  'sf-ek-hidro-baglanti': 'Şema: su çarkı–jeneratör (G) → diyot → aküye yakın sigorta → akü artısı (kırmızı); eksi siyah; akü hattından sapma denetleyicisi ve ona bağlı ısıtıcı direnç (turuncu ok); "akü hep bağlı" yeşil etiket.',

  // Rüzgâr türbini
  'sf-ek-turbin-yer': 'Yandan: tepede yüksek direk üstünde türbin; ağacın tepesi ile kanat ucu arasında "9 m+" ölçüsü; solda çatıya kurulmuş türbin kırmızı çarpıyla.',
  'sf-ek-turbin-direk': 'Yandan: menteşeli (yerde beton takozda) direk yarı kaldırılmış, dik kaldırma kolu, koldan kazığa bağlı el vincine giden halat; direğin ortasından üç kazığa çelik gergi halatları; kaldırma yönünde turuncu yay ok.',
  'sf-ek-turbin-bosaltma': 'Şema: türbin–jeneratör (G) → köprü diyot (~/=) → aküye yakın sigorta → akü; akü hattından kontrolcü ve ısıtıcı direnç; "akü hep bağlı" yeşil etiket.',
  'sf-ek-turbin-fren': 'Yakın plan: duvarda üç kutuplu fren anahtarı, el anahtarı "fren" konumuna çeviriyor; yanında numaralı sıra "1 fren, 2 akü".',
  'sf-ek-turbin-yasak': 'Önden: dönen kanatların altında oynayan çocuk ve köpek üzerinde kırmızı yasak işareti; direğin çevresinde kesik çizgili güvenlik dairesi.',

  // Kablolama
  'sf-ek-kablo-kesit': 'Yakın plan: üç kablonun kesit yüzleri yan yana, "4 mm²", "10 mm²", "35 mm²"; yanında akü ile yük arasında gidiş-dönüş kablo, toplam boy oku.',
  'sf-ek-kablo-sigorta-yeri': 'Şema: akü artı kutbunun hemen üstünde ana sigorta, artı hattan ayrılan iki kolda ayrı küçük sigortalar, lamba ve telefon şarjı; eksi dönüş siyah; ana sigortayı gösteren turuncu ok.',
  'sf-ek-kablo-pabuc': 'Yakın plan: ince telli kablonun ucuna pabuç geçirilmiş, sıkma pensesi sıkıyor; yanında gevşek, telleri dağılmış bağlantı kırmızı çarpıyla.',
  'sf-ek-kablo-kisa-devre': 'Yakın plan: akünün iki kutbuna aynı anda değen İngiliz anahtarı kıvılcımla, kırmızı yasak işareti; yanda masaya çıkarılmış yüzük ve saat, yeşil onay.',
  'sf-ek-kablo-sira': 'Yakın plan akü üstü: "1" ile kırmızı kablo artıya bağlı, "2" ile siyah kablo eksiye iniyor (turuncu ok).',

  // Akü
  'sf-ek-aku-olcum': 'Yakın plan: voltmetre uçları akü kutuplarında (kırmızı artıya, siyah eksiye), ekranda "12,24"; "%50" etiketi.',
  'sf-ek-aku-yarim': 'Görsel: iki akü ikonu, birinin içi yarıya kadar dolu yeşil "en çok %50 kullan", öbürü neredeyse boş kırmızı çarpıyla.',
  'sf-ek-aku-havadar': 'İç mekân: açık pencere, yerde şarjdaki akü ve duvardaki şarj cihazı; aküden yükselen gaz pencereye (gri ok); yanda alev simgesi kırmızı yasakla.',
  'sf-ek-aku-su': 'Kesit: üç hücreli sulu akü, plakalar ve plakaların üstünde turuncu kesik seviye çizgisi; sağ hücrenin kapağı açık, damıtık su şişesinden su dökülüyor.',
  'sf-ek-aku-kutup': 'Yakın plan: tortulu kutup başı, eski diş fırçasıyla karbonatlı su sürülüyor; yanda temizlenmiş ve vazelinlenmiş kutup yeşil onayla.',

  // Güneş paneli
  'sf-ek-panel-seri': 'Şema: iki panel; A artısı ortadaki bağlayıcıyla B eksisine bağlı; çıkış kutusuna A eksisi (siyah) ve B artısı (kırmızı); her panelde "20 V · 5 A", üstte "40 V · 5 A".',
  'sf-ek-panel-paralel': 'Şema: iki panel, artılar birlikte (kırmızı), eksiler birlikte (siyah) çıkış kutusuna bağlı; her panelde "20 V · 5 A", üstte "20 V · 10 A".',
  'sf-ek-panel-sigorta': 'Şema: paralel iki panelin birleşik artı hattında sigorta, "15 A" etiketi; üstte "(5 + 5) × 1,25 → 15 A".',
  'sf-ek-panel-ortu': 'Yandan: kişi panelin üstünü kalın koyu bir battaniyeyle örtmüş, konnektörleri birleştiriyor; güneş ışınları battaniyede kesiliyor.',
  'sf-ek-panel-golge': 'Önden: çatıda güneye bakan eğik panel, yanındaki bacanın gölgesi panele düşüyor ve kırmızı çarpı; yanında gölgesiz yerleştirilmiş panel yeşil onay.',

  // Şarj kontrolcüsü
  'sf-ek-kontrol-secim': 'Önden: iki kontrolcü kutusu yan yana "PWM" ve "MPPT"; altında pedal, rüzgâr ve su ikonları için ayrı kutu "sapma kontrolcüsü".',
  'sf-ek-kontrol-aku-once': 'Şema: kontrolcü (panel, akü, yük uçları); akü kabloları aküye yakın sigortayla takılı, "1" rozeti; panel kabloları henüz boşta.',
  'sf-ek-kontrol-panel-sonra': 'Şema: "2" rozetiyle panel kabloları (artıda sigorta) kontrolcüye takılı; panelin üstü örtülü; akü zaten bağlı.',
  'sf-ek-kontrol-yuk': 'Şema: kontrolcünün yük çıkışına bağlı LED lamba; panel ve akü bağlı.',
  'sf-ek-kontrol-sokme': 'Şema: sökme sırası "1 panel" (ayrılan panel kablosu), "2 akü"; panel bağlıyken akünün ayrılması kırmızı çarpıyla.',

  // İnvertör
  'sf-ek-invertor-toplam': 'Önden: lamba, telefon şarjı, dizüstü ve küçük buzdolabı ikonları, her birinin üstünde watt değeri; buzdolabının yanında kısa süreli büyük turuncu sıçrama oku "kalkış".',
  'sf-ek-invertor-dalga': 'İki küçük grafik yan yana: düzgün sinüs dalgası yeşil onayla "tam sinüs", basamaklı kare dalga turuncu uyarıyla "modifiye".',
  'sf-ek-invertor-kablo': 'Yandan: akünün hemen yanında invertör, aralarında kısa ve kalın iki kablo, "1–2 m" etiketi; uzakta ince uzun kablolu invertör kırmızı çarpıyla.',
  'sf-ek-invertor-sigorta': 'Yakın plan: akünün yanında invertör, kısa kalın kablolar; akü artı kutbunun hemen üstünde büyük sigorta, invertör anahtarı "0" (kapalı); "≤ 2 m" etiketi.',
  'sf-ek-invertor-priz': 'İç mekân: solda invertörün kendi prizine takılı lamba yeşil onayla; sağda invertör çıkışından duvar prizine giden kablo, büyük kırmızı yasak işareti.',

  // Pedal
  'sf-ek-pedal-dinamo': 'Yakın plan: bisiklet tekerine dayanan şişe dinamo ve göbek dinamo, ön lambaya giden ince kablo; "3–6 W" etiketi.',
  'sf-ek-pedal-motor-test': 'Yakın plan: masada DC motor, el milini parmaklarıyla çeviriyor (turuncu dönüş oku), uçlarına bağlı voltmetrede "12 V".',
  'sf-ek-pedal-kurulum': 'Yandan: arka tekeri havada sehpaya sabitlenmiş bisiklet, arka lastiğe bastırılmış motor mili, motordan çıkan kablolar; kişi pedal çeviriyor.',
  'sf-ek-pedal-diyot': 'Yakın plan şema: motor artı ucunda Schottky diyot, ok yönü aküye doğru; ardından sigorta. Geri akış yönünde kırmızı çarpı.',
  'sf-ek-pedal-semasi': 'Şema: motor → diyot → sigorta → sapma kontrolcüsü + boşaltma direnci → akü → USB çevirici → telefon. Telefona doğrudan motordan giden kablo kırmızı çarpıyla.',

  // Alternatör
  'sf-ek-alt-adaylar': 'Üç nesne yan yana: koşu bandı DC motoru, çamaşır makinesi fırçasız motoru, araba alternatörü; her birinin altında küçük etiket.',
  'sf-ek-alt-matkap-test': 'Yandan: matkap mandreni motor miline takılı, kişi matkabı çalıştırıyor, voltmetre "14 V"; not defterinde devir-voltaj listesi.',
  'sf-ek-alt-kasnak': 'Yandan: oluktan su alan su çarkının milinde büyük kasnak, açık kayışla jeneratörün küçük kasnağına bağlı; çarkın yanında "yavaş", jeneratörde "hızlı" etiketi, dönüş okları.',
  'sf-ek-alt-baglanti': 'Şema: alternatörün kalın B+ ucu sigortayla akü artısına, gövdesi akü eksisine, uyarma ucu anahtar ve küçük şarj lambası üzerinden akü artısına.',
  'sf-ek-alt-kopru-diyot': 'Şema: fırçasız motordan çıkan üç kablo ("3 tel"), soğutucu üstündeki köprü diyota giriyor, çıkışta kırmızı "+" ve siyah "−".',

  // Pil paketi
  'sf-ek-pil-hazir': 'Yakın plan masa: powerbank kabloyla telefonu dolduruyor, yanında aküsü takılı akülü matkap; üstte yeşil onay "olduğu gibi kullan".',
  'sf-ek-pil-ayikla': 'Yakın plan: şişmiş, ezik ve paslı hücreler kırmızı çarpıyla bir metal kutuda; voltmetre bir hücrede "1,6 V" gösteriyor ve kırmızı çarpı.',
  'sf-ek-pil-punta': 'Yakın plan: hücrelere nikel şerit punta kaynağıyla bağlanıyor, yeşil onay; yanda hücreye havya dokundurulan el kırmızı yasakla.',
  'sf-ek-pil-bms': 'Yakın plan: seri bağlı dört hücrelik paket, her hücre ara noktasına ince tellerle bağlı küçük koruma devresi kartı "BMS".',
  'sf-ek-pil-sarj-kutu': 'Yandan: metal kutunun içinde taş zemin üstünde şarj olan paket, kapı yakınında; yanında yatak üstünde şarj kırmızı yasak işaretiyle.',

  // Termoelektrik
  'sf-ek-teg-plaka': 'Yakın plan kesit: soba yan yüzü (içinde ateş) → kalın alüminyum plaka → ince modül → kanatçıklı soğutucu, iki uzun sıkma cıvatası; sıcak tarafta kırmızı ısı dalgaları, soğutucu tarafında mavi dalgalar.',
  'sf-ek-teg-sogutucu': 'Yandan: sobaya bağlı modülün dış yüzünde büyük kanatçıklı soğutucu ve üstünden geçen su kabı; "fark = elektrik" etiketi ve sıcak/soğuk renk geçişi.',
  'sf-ek-teg-baglanti': 'Şema: seri bağlı üç modül → küçük DC–DC çevirici kartı → USB kablosu → telefon.',
  'sf-ek-teg-kablo': 'Yandan: kablolar sobadan uzak, duvar boyunca tutturulmuş, yeşil onay; sobanın borusuna sarılmış kablo kırmızı yasakla.',

  // Kimyasal güvenlik
  'sf-ek-kg-koruyucu': 'Önden: kişi koruyucu gözlük, lastik eldiven, uzun kollu giysi ve kapalı ayakkabıyla; yanında temiz su kovası ve musluklu 20 litrelik su bidonu.',
  'sf-ek-kg-kap': 'Önden: demir kazan, kalın plastik kova ve toprak küp yeşil onayla; alüminyum tencere kırmızı çarpıyla ve üstünde kabarcık simgesi.',
  'sf-ek-kg-suya-ekle': 'Yandan: gözlüklü ve eldivenli kadın masadaki su dolu kalın plastik kovaya kaşıkla katı kostiği az az ekliyor, turuncu ok kovaya doğru, yeşil onay; sağ üstte küçük kutuda kostik yığınının üstüne sürahiden su dökülmesi kırmızı yasakla.',
  'sf-ek-kg-cilt-yikama': 'İki karelik sıra: önce kuru bezle koldaki tozu silkeleyen el, sonra kolu akan su altında tutan kişi; "en az 15 dk" etiketi.',
  'sf-ek-kg-goz-yikama': 'Yakın plan önden: yaralının başı yana eğik; yardımcının eldivenli elindeki sürahiden dökülen su burun kökünden alttaki gözün üstünden dışa doğru akıyor; "30 dk" saat etiketi.',

  // Kireç
  'sf-ek-kirec-sirke': 'Yandan: gözlüklü ve eldivenli kadın diz çökmüş, kırık kireç taşının açık renkli yüzüne damlalıkla sirke damlatıyor; yüzeyde köpük kabarcıkları.',
  'sf-ek-kirec-kirma': 'Yandan: kişi gözlükle balyozla taş kırıyor; yanında ceviz ile yumruk arası boyda kırılmış taş yığını, "2–6 cm".',
  'sf-ek-kirec-ocak': 'Yandan kesit: yamaca gömülü taş örgülü kuyu ocak, altta yamaca açılan ateş ağzı ve yanan odun, üstte katman katman kireç taşı ve yakıt; yukarı kırmızı sıcak hava oku, üstte duman, "900 °C+" etiketi.',
  'sf-ek-kirec-sondurme': 'Yandan: açık havada metal tekne, gözlüklü ve eldivenli kişi kürekle suya kireç ekliyor, yüzü tekneden uzak; buhar ve sıçrama çizgileri.',
  'sf-ek-kirec-kuyu': 'Yandan kesit: toprağa kazılmış çukurda beyaz kireç kaymağı, üstü kum katmanıyla örtülü.',

  // Alçı
  'sf-ek-alci-tirnak': 'Yakın plan: tırnakla çizilmiş beyaz alçı taşı, belirgin çizik; yanında camsı levhalı alçı taşı parçası.',
  'sf-ek-alci-kavurma': 'Yandan: ateş üstünde demir sac, kişi tahta kürekle beyaz tozu karıştırıyor; tozun yüzeyinden buhar.',
  'sf-ek-alci-buhar': 'İki kare: solda kabaran, buhar çıkaran toz "devam"; sağda sakin, buharsız toz "hazır" yeşil onay.',
  'sf-ek-alci-karistirma': 'Yandan: gözlüklü ve eldivenli kadın masadaki su kovasına kepçeyle alçı tozunu serpiyor (turuncu ok aşağı), yeşil onay; sağ üstte küçük kutuda toza su dökülmesi kırmızı yasakla.',
  'sf-ek-alci-yasak': 'Yandan: donmakta olan alçı kovası, içine sokulan el üzerinde büyük kırmızı yasak işareti; kovadan ısı dalgaları "60 °C+".',

  // Odun kömürü
  'sf-ek-komur-cukur': 'Yandan kesit: yaklaşık 1 m derin çukurda sıkı dizilmiş odunlar, aralarında ince dallar.',
  'sf-ek-komur-ortme': 'Yandan kesit: çukurda dizili odunlar, bir uçta alev; üstte yaprak katmanı ve toprak katmanı (ölçü çizgisi, "20+20 cm"); solda hava deliği (mavi ok), sağda duman deliğinden çıkan duman.',
  'sf-ek-komur-yigin': 'Yandan: ortasında baca deliği olan koni biçimli odun yığını, dışı toprak ve çimle sıvanmış; gözlüklü, eldivenli kişi uzun sırığın ucundaki ateşi tepedeki baca deliğine veriyor.',
  'sf-ek-komur-duman': 'İki kare: solda yığından çıkan kalın beyaz duman "devam", sağda ince mavimsi duman "kapat" ve kişi delikleri toprakla tıkıyor.',
  'sf-ek-komur-co': 'Önden: penceresi kapalı odada yanan mangal ve yerde baygın yatan kişi, tavanda duman; büyük kırmızı yasak işareti.',

  // Aktif kömür
  'sf-ek-aktif-yuzey': 'Yakın plan büyüteç: solda odun kömürü parçasının içi az gözenekli, sağda aktif kömür süngerimsi çok gözenekli; etiketler "2–5 m²/g" ve "500–3000 m²/g".',
  'sf-ek-aktif-yapar-yapmaz': 'İki sütun: solda koku ve tat simgeleri yeşil onayla; sağda mikrop, virüs ve metal simgeleri kırmızı çarpıyla.',
  'sf-ek-aktif-kirma': 'Yakın plan: taş üstünde bez torbaya eldivenli elle tutulan tahta tokmak vuruyor; yanda kevgirde nohut iriliğinde kömür parçaları, altından kararmış su damlıyor.',
  'sf-ek-aktif-kutu': 'Yandan: kapağında küçük delik olan metal kutu kor yatağı üstünde, delikten ince duman; "1 sa" saat etiketi.',
  'sf-ek-aktif-filtre': 'Kesit: sehpa üstünde kova filtre, yukarıdan aşağı su, ince kum, kömür, çakıl katmanları (yazılı); alttaki musluktan akan su ocaktaki kaynayan tencereye gidiyor.',

  // Potas
  'sf-ek-potas-fici': 'Yandan kesit: dibi delikli tahta fıçı, dipte çakıl, üstünde saman, üstünde sıkıştırılmış kül, ortası çukur; fıçı taşın üstünde, altında toplama kabı.',
  'sf-ek-potas-suzme': 'Yandan: kişi kül fıçısının ağzına kovayla yavaşça su döküyor, alttaki kaba kahverengi sıvı damlıyor.',
  'sf-ek-potas-kaynatma': 'Yandan: ateş üstünde kül suyu kaynayan demir kazan, buhar; gözlük ve eldivenli kadın uzaktan uzun saplı kepçeyle karıştırıyor.',
  'sf-ek-potas-etiket': 'Yakın plan: ağzı sıkı kapalı cam olmayan kavanoz, üzerinde "POTAS — YAKAR" etiketi.',

  // Tuz
  'sf-ek-tuz-su-alma': 'Yukarıdan sahil şeridi: limandan ve kanalizasyon çıkışından uzaktaki temiz kayalık koydan su alan kişi yeşil onay; liman yanında su alma kırmızı çarpı.',
  'sf-ek-tuz-havuz': 'Yukarıdan: naylon serili sığ havuzlarda deniz suyu, güneş ve rüzgâr simgeleri; havuz kenarında beyaz kristaller.',
  'sf-ek-tuz-kazan': 'Yandan: ateş üstünde geniş sığ tava, kaynayan su, yüzeyde ve dipte tuz kristalleri.',
  'sf-ek-tuz-toplama': 'Yakın plan: tavadaki tuz kristalleri tahta kepçeyle alınıp kabın üstündeki süzgece konuyor; turuncu ok tavadan süzgece.',
  'sf-ek-tuz-aci-su': 'Yandan: başörtülü kadın tavadaki ağdalı sıvıyı toprağa döküyor, "acı su" etiketi; sağ üstte küçük kutuda bu sıvının tuz kabına damlaması kırmızı yasakla.',

  // Mum
  'sf-ek-mum-balmumu': 'Yandan kesit: kazanda su, içinde bez torbada petek artığı; erimiş sarı mum su yüzeyinde toplanıyor.',
  'sf-ek-mum-su-banyosu': 'Yandan kesit: büyük tencerede su, içinde küçük kapta eriyen balmumu; "62–64 °C" etiketi. Yanda doğrudan alev üstünde mum kabı kırmızı çarpıyla.',
  'sf-ek-mum-fitil': 'Yakın plan: üç kat pamuk ipliği örülürken eller; yanında ince ve kalın fitil örnekleri.',
  'sf-ek-mum-daldirma': 'Yandan: yaşlı kadın fitil demetinin asılı olduğu çubuğu ocaktaki erimiş mum kabına daldırıyor; yukarı-aşağı turuncu ok; yanda askıda kalınlaşmış mumlar.',
  'sf-ek-mum-kalip': 'Kesit: kâğıt rulo kalıp, ortasında çubuğa bağlanmış gergin fitil, eriyen mum dökülüyor; üstte çöken orta kısım ve doldurma oku.',

  // Yağ
  'sf-ek-yag-dibek': 'Yandan: büyük taş dibek, kişi iki eliyle tuttuğu ağır tokmakla zeytinleri ezerek koyu hamur yapıyor; yukarı–aşağı oklar.',
  'sf-ek-yag-pres': 'Yandan: taş taban üstünde üst üste hasır torbalar, üstünde tahta; solda dikmeye takılı uzun kaldıraç kolu tahtaya basıyor, kolun ucunda asılı taş; tabandan tekneye akan yağ, aşağı turuncu ok.',
  'sf-ek-yag-ayirma': 'Kesit: derin kapta üstte sarı yağ katmanı, altta koyu karasu; kepçe yağı üstten alıyor.',
  'sf-ek-yag-ceviz': 'Yandan: havanda dövülen ceviz içi, yanında bez torbada sıkılan hamurdan damlayan yağ.',
  'sf-ek-yag-saklama': 'Önden: serin, karanlık kilerde ağzına kadar dolu koyu renk şişeler yeşil onay; güneşli pencere önünde yarı dolu şeffaf şişe kırmızı çarpı.',

  // Kâğıt
  'sf-ek-kagit-kabuk': 'Yakın plan: kaynatılmış dalın kabuğu soyuluyor, bıçakla dış kahverengi kabuk kazınıp beyaz iç kabuk ayrılıyor.',
  'sf-ek-kagit-dovme': 'Yandan: düz taş üstünde lifler tahta tokmakla dövülüyor; yanda su dolu bardakta bulut gibi dağılan lifler.',
  'sf-ek-kagit-kalip': 'Yakın plan: sinek teli gerili tahta çerçeve ve üstüne oturan boş sınır çerçeve, ikisi ayrı ayrı gösterilmiş.',
  'sf-ek-kagit-daldirma': 'Yandan: hamurlu su dolu tekne, kişi kalıbı eğik daldırıp düz kaldırıyor; kalıptan süzülen su ve sağa-sola sallama oku.',
  'sf-ek-kagit-pres': 'Yandan: yaprak yığını iki tahta arasında, üstünde taşlar; tahtadan süzülen su. Arka planda tahtaya yapıştırılmış kuruyan yapraklar.',

  // Mürekkep
  'sf-ek-murekkep-is': 'Yandan: yanan yağ kandili, alevin bir karış üstünde tutulan toprak tabak, tabağın altında siyah is katmanı.',
  'sf-ek-murekkep-yuzdurme': 'Kesit: su dolu bardakta üstte yüzen ince is, dipte iri parçalar; kaşık üstteki isi alıyor.',
  'sf-ek-murekkep-ezme': 'Yakın plan: düz taş üstünde siyah macun, el küçük bir taşla dairesel hareketlerle eziyor; turuncu dairesel ok.',
  'sf-ek-murekkep-mazi': 'Önden: yuvarlak meşe mazıları, havanda toz edilmiş mazı ve su dolu kavanozda kahverengi sıvı.',
  'sf-ek-murekkep-kararma': 'Yakın plan: kâğıtta iki yazı satırı, ilki soluk gri "yeni", ikincisi koyu mor-siyah "birkaç saat sonra"; arada saat simgesi.',

  // Cam
  'sf-ek-cam-ocak': 'Yandan kesit: ateş tuğlası kubbeli ocak, içinde parlayan pota, alttan körükle hava veren kişi; termometre simgesi "1100 °C+". Yanda açık kamp ateşi kırmızı çarpıyla.',
  'sf-ek-cam-toplama': 'Önden: battaniyeye sarılmış pencere camı, kasada şişe ve kavanozlar, eldivenli eller dikkatle taşıyor.',
  'sf-ek-cam-sise-kesme': 'Üç kare: şişenin çevresine kesiciyle tek çizgi; çizgiye sıcak su dökülüyor; soğuk suya batırılınca şişenin çizgiden ayrılması.',
  'sf-ek-cam-tavlama': 'Basit grafik: sıcaklık-zaman çizgisi, yüksek sıcaklıktan "≈550–600 °C" düzlüğe ve oradan yavaş eğimli iniş; yanında hızlı inen çizgi ve çatlak cam simgesi kırmızı.',
  'sf-ek-cam-yagli-kagit': 'Önden: tahta pencere çerçevesine gerili yağlanmış yarı saydam kâğıt, içeri süzülen yumuşak ışık.',

  // Fermantasyon
  'sf-ek-ferm-uc-tur': 'Üç sütunlu şema: maya simgesi → ekmek ve gaz kabarcıkları; turşu kavanozu → asit simgesi; geniş ağızlı küp ve hava okları → sirke şişesi.',
  'sf-ek-ferm-bez': 'Yakın plan: toprak küpün ağzına iple bağlanmış bez, bezden içeri giren mavi hava okları, yeşil onay; yanda elma dilimli, sıkı vidalı kapaklı kavanoz kırmızı çarpıyla.',
  'sf-ek-ferm-kuf': 'Yakın plan: sıvı yüzeyinde tüylü yeşil-siyah küf lekeleri, büyük kırmızı çarpı ve çöp kovası simgesi.',
  'sf-ek-ferm-tursu': 'Kesit: kavanozda sebzeler tuzlu suyun altında, üstte ağırlık taşı; yüzeyde suyun dışında kalan sebze kırmızı çarpıyla.',
  'sf-ek-ferm-sise-yasak': 'Yakın plan: içi köpüren elma dilimleriyle dolu, sıkı vidalı kapağı kabarmış cam kavanoz, camda çatlaklar, kapak üstünde basınç çizgileri; büyük kırmızı yasak işareti. (İçki şişesi çağrışımından kaçınmak için kavanoz.)',

  // Biyogaz
  'sf-ek-biyogaz-tank': 'Kesit: yarı gömülü tank, dibe inen eğik besleme borusu, yandan taşma borusu, üstte gaz çıkışı; içte bulamaç ve üstte gaz boşluğu.',
  'sf-ek-biyogaz-besleme': 'Yandan: kişi kovada gübreyi suyla karıştırıyor, bulamacı besleme borusunun huni ağzına döküyor; yanında taş ve deterjan kutusu kırmızı çarpıyla.',
  'sf-ek-biyogaz-su-tuzagi': 'Şema: tanktan ocağa giden boru hattı, en alçak noktada şeffaf su toplama kabı ve boşaltma vanası; boru içinde yoğuşma damlaları.',
  'sf-ek-biyogaz-sabun': 'Yakın plan: boru bağlantısına fırçayla sabunlu su sürülüyor, kabarcıklar çıkan bağlantı kırmızı çemberle "kaçak".',
  'sf-ek-biyogaz-girme-yasak': 'Yandan kesit: gaz dolu tank, açık kapağından merdivenle inen kişi büyük kırmızı yasak işaretiyle; yanda dışarıda telefonla 112\'yi arayan kadın yeşil onay.',

  // Odun gazı
  'sf-ek-gazojen-kesit': 'Kesit şema: üstten doldurulan silindir kazan, odun katmanı, alt kısımda kızgın kömür ve ızgara, yandan hava girişi, alttan gaz çıkışı; gaz okları gri, etiket "CO + H₂".',
  'sf-ek-gazojen-odun': 'Yakın plan: parmak boğumu ile 5 cm küp arası kesilmiş kuru odun parçaları yeşil onay; talaş ve yaş odun kırmızı çarpıyla.',
  'sf-ek-gazojen-acik-hava': 'Yandan iki yarı: solda açık arazide, ağaçtan uzakta gazojen ve çevresinde yeşil kesik güvenlik dairesi, yeşil onay; sağda garaj içinde dumanlı gazojen kırmızı yasakla.',
  'sf-ek-gazojen-durdurma': 'Yandan: durdurulmuş gazojenden çıkan gri gaz bulutu, kişi uzaklaşıyor; saat simgesi "20 dk".',
  'sf-ek-gazojen-co': 'Yandan: dumanlı garajdan çıkarılan, elini başına götüren baş dönmeli kişi; yardımcısı onu sırtından destekleyip açık havaya götürüyor, kulağında telefon; sağa turuncu ok, "112" etiketi.',
};
