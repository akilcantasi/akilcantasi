// Sıfırdan: Barınak ve yapı — çizim açıklamaları
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  'sf-yp-kapak-yer': "Yandan görünüm: hafif yamaçta düzlenmiş yerde, taş subasman üstünde tek katlı küçük kerpiç ev; sol üstte güneş, yanda ağaç.",
  'sf-yp-kapak-toprak': "Önden görünüm: güneşte sıra sıra kuruyan kerpiçler, önde yerde iki gözlü boş tahta kalıp, arkada kerpiç duvar; kişi yok.",
  'sf-yp-kapak-ahsap': "Önden görünüm: taş temel üstünde, köşelerde kütük uçları görünen kütük ev, kapı ve şındıl çatı; yanda çam.",
  'sf-yp-kapak-cati': "Önden görünüm: taş subasmanlı küçük ev, dik şındıl çatı, ahşap kapı ve küçük pencere; yanda ağaç.",

  // Yer seçimi
  'sf-yp-yer-taskin': "Yandan kesit: çakıllı kuru dere düzlüğünde ağaç gövdesinde çamur izi ve kesik mavi eski taşkın çizgisi; düzlükteki çadırda kırmızı çarpı, yüksek sekideki evde yeşil onay.",
  'sf-yp-yer-heyelan': "Yamaç görünümü: tepede kaşık biçimli kopma oyuğu, yamaçta çatlaklar ve eğilmiş ağaç, sızıntılı ıslak leke; yamaç eteğindeki evde kırmızı çarpı, çatlaklara turuncu ok.",
  'sf-yp-yer-cukur': "Yandan kesit: bir kişi kürekle yaklaşık 1 m derin deneme çukuru kazmış; üstte koyu bitkisel toprak, altta açık renkli sert katman. Kısa etiket \"1 m\".",
  'sf-yp-yer-guney': "Kuşbakışı harita: güneye bakan yamaçta ev, kuzeyden gelen mavi rüzgâr okları yamaçta kesiliyor, güneyde güneş simgesi. Pusula oku \"K\".",

  // Güneş yönü
  'sf-yp-gunes-cubuk': "Yandan görünüm: düz yerde dik çubuk ve öğle saatindeki kısa gölgesi; güneş yüksekte, gölge yönünde \"K\" etiketli turuncu ok.",
  'sf-yp-gunes-plan': "Kuşbakışı plan: doğu-batı doğrultusunda uzun dikdörtgen ev; güney cephesinde dört pencere, kuzeyde bir küçük pencere; altta güneş, üstte \"K\" oku.",
  'sf-yp-gunes-acilar': "Yandan kesit: güney cepheli ev; yüksekten gelen yaz güneşi ışını \"yaz ~74°\" ve alçaktan gelen kış ışını \"kış ~28°\" etiketli iki turuncu ok.",
  'sf-yp-gunes-sacak': "Yandan kesit (1,5 m = 120 birim): pencere altından saçak ucuna \"1,5 m\", saçak duvardan \"50 cm\" dışarıda; ölçü çizgileri kesikli yardımcı çizgilerle saçak ucuna ve pencere altına bağlı. Dik yaz ışını saçak ucunu sıyırıp pencere altına düşüyor; alçak kış ışını pencereden odaya giriyor.",
  'sf-yp-gunes-kutle': "İç kesit: kış güneşi pencereden girip kalın kerpiç iç duvara ve toprak döşemeye vuruyor; duvardan odaya doğru dalgalı turuncu ısı okları.",

  // Temel
  'sf-yp-temel-hendek': "Yandan kesit: bitkisel toprak kaldırılmış, sert katmana kazılmış hendek; üstte kesik çizgiyle gelecek duvar, hendek genişliği duvarın \"2 kat\"ı, derinlik \"80 cm\".",
  'sf-yp-temel-tas': "Yakın plan: iki el büyük, düz yüzlü taşı hendeğe uzun yüzü duvar boyunca yatacak biçimde harca yerleştiriyor; aralara küçük taşlar sıkıştırılmış.",
  'sf-yp-temel-subasman': "Yandan kesit: taş temel toprak yüzünden yükselmiş, üstünde naylon nem kesici, hatıl ve kerpiç duvar; toprak ile taş temel üstü arasında \"50 cm\" ölçüsü ve yeşil onay.",
  'sf-yp-temel-hatil': "Eğik görünüş: taş temel üstünde naylon şerit, iki boyuna 10×10 kadron, üstlerinde 50 cm arayla enine kadronlar, arası taş kırığıyla dolu; \"50 cm\" ölçüsü.",
  'sf-yp-temel-sicrama': "Yandan kesit: saçaktan düşen damla, duvar dibinde dışa eğimli taş şeride çarpıyor; su turuncu okla evden uzağa akıyor.",

  // Deprem
  'sf-yp-deprem-plan': "Kuşbakışı iki plan yan yana: solda dikdörtgen simetrik plan yeşil onaylı, sağda L biçimli plan kırmızı \"yasak\" işaretli.",
  'sf-yp-deprem-cati': "Yan yana iki ev: solda kalın toprak damlı ev, üstünde kırmızı yük okları ve kırmızı çarpı; sağda hafif ahşap makaslı şındıl çatılı ev, yeşil onay.",
  'sf-yp-deprem-hatil': "Eğik görünüş: kerpiç evin duvarlarını temel üstü, pencere altı, pencere üstü ve çatı altında çevreleyen dört kesintisiz hatıl turuncu renkle; hatıllar köşeden dönüyor.",
  'sf-yp-deprem-bosluk': "Önden duvar görünüşü: köşe ile kapı arasında \"1 m\", kapı ile pencere arasında \"1 m\" ölçüleri; açıklıkların üstünde lento.",
  'sf-yp-deprem-lento': "Yakın plan: pencere üstünde ahşap lento iki yanda duvara giriyor; giriş boyunda \"20 cm\" ölçüsü.",

  // Döşeme
  'sf-yp-doseme-katlar': "Yandan kesit: duvar dibinde taban çukuru, en altta \"10 cm\" ölçülü çakıl katı; üstünde ahşap tokmak ve aşağı ok (sıkıştırma).",
  'sf-yp-doseme-tokmak': "Yandan görünüm: bir kişi iki eliyle ağır tahta tokmağı tutmuş, ince toprak katını dövüyor; tokmak yanında aşağı turuncu ok.",
  'sf-yp-doseme-ahsap': "Yandan kesit: taş ayaklara oturan ahşap döşeme kirişleri yerden yüksekte, altta hava boşluğu ve tel kaplı havalandırma deliği; \"45 cm\" ölçüsü.",

  // Yalıtım
  'sf-yp-yalitim-tavan': "Kesit: ev tavanı üstünde kirişler, tahta döşeme, kalın saman katı ve çamur kaplaması; içeriden yukarı çıkan ısı okları samanda duruyor.",
  'sf-yp-yalitim-kilsaman': "Yakın plan: iki el bir avuç samanı kil şerbeti dolu kovaya bulayıp sıkıştırıyor; yanında kil-saman yığını.",
  'sf-yp-yalitim-cift-duvar': "Düşey duvar kesiti: içte ve dışta birer dal örgü yüz, arasında kuru saman dolgu, iki yüz çamur sıvalı; \"iç\", \"dış\", \"saman\", \"çamur\" yazıları.",
  'sf-yp-yalitim-baca': "Yan kesit: tavandan geçen soba borusu; boru çevresinde taş ve çamurla ayrılmış halka, saman yalıtım bu halkadan uzakta. Boruya değen saman örneği kırmızı \"yasak\".",

  // Bakım
  'sf-yp-bakim-cati': "Yandan görünüm: çatıda iple emniyetli bir kişi kaymış şındılı yerine koyuyor; altta merdiven sağlam dayalı.",
  'sf-yp-bakim-dip': "Yakın plan: kerpiç duvarın dibinde oyulma ve yosun lekeleri; dibe biriken su kırmızı halka içinde; turuncu ok suyun evden uzağa akacağı yönü gösteriyor.",
  'sf-yp-bakim-curuk': "Yakın plan: yumruk bıçağı ahşap kirişteki koyu, süngerimsi lekeye bastırıyor; bıçak derin girmiş; kırmızı halka.",
  'sf-yp-bakim-bocek': "Yakın plan iki bölmeli: solda ahşapta küçük delikler ve altında un gibi talaş; sağda taş temel üstünde topraktan ince termit tünelleri.",
  'sf-yp-bakim-dikme': "Yandan görünüm, kişi yok: iki duvar arasındaki kirişin ortasında koyu çürük yer; çürüğün iki yanında birer geçici dikme, dikmelerde yukarı turuncu oklar.",

  // Toprak testi
  'sf-yp-test-elle': "Yakın plan: iki avuç arasında ıslak toprak ovalanıyor; yanda iki küçük simge: pürüzlü kum taneleri ve parlak yapışkan kil.",
  'sf-yp-test-kavanoz': "Yakın plan: el, üçte biri toprak üçte ikisi su dolu şeffaf kavanozu çalkalıyor; yanda tuz tutamı. Etiket \"1 sa + 8 sa\".",
  'sf-yp-test-katlar': "Yakın plan: dinlenmiş kavanozda alttan üste kum, silt, kil katları ve üstte duru su; yanda cetvel, katlara \"kum\", \"silt\", \"kil\" yazıları.",
  'sf-yp-test-cubuk': "Üstten görünüm: 60 cm'lik tahta oluk içinde kurumuş çamur çubuk, bir ucunda büzülmeden açılan boşluk; boşlukta çift yönlü turuncu ölçü oku, üstte \"60 cm\".",
  'sf-yp-test-dusurme': "Yandan görünüm: bir kişi küçük deneme kerpicini elinde tutmuş, sert taş zemine bırakıyor; aşağı turuncu ok, \"60 cm\" ölçüsü.",

  // Kerpiç 1
  'sf-yp-kerpic-cukur': "Yandan görünüm: sığ çamur çukuru, yanında ayıklanmış taşlar ve kökler küçük bir yığında; bir kişi kürekle toprağı gevşetiyor.",
  'sf-yp-kerpic-cigneme': "Yandan görünüm: paçaları sıvalı usta çamur çukurunda ayakla çiğniyor; başörtülü yardımcı kovadan su döküyor.",
  'sf-yp-kerpic-saman': "Yakın plan: el kıyılmış samanı çamurun üstüne serpiyor; yanda saman demeti.",
  'sf-yp-kerpic-kivam': "Yakın plan: açık avuçta sıkılmış, parmak izli çamur topağı biçimini koruyor; yeşil onay.",

  // Kerpiç 2
  'sf-yp-kerpic-kalip': "Üstten görünüm: iki gözlü, iki ucu tutamaklı tahta kerpiç kalıbı; iki ölçü de aynı (sol) gözün iç kenarlarına dayalı: yatay \"30 cm\", dikey \"25 cm\".",
  'sf-yp-kerpic-doldurma': "Yandan görünüm: diz çökmüş kişi çamur topağını kalıba fırlatıyor, sonra ıslak tahta ile üstünü sıyırıyor; turuncu hareket okları.",
  'sf-yp-kerpic-cekme': "Yakın plan: iki el kalıbı tutamaklarından düz yukarı çekiyor, altta biçimini koruyan ıslak kerpiç; yukarı turuncu ok.",
  'sf-yp-kerpic-dikine': "Yandan görünüm: kurutma alanında dikine çevrilmiş kerpiç sıraları, aralarında hava boşluğu; güneş, \"10 gün\" etiketi.",
  'sf-yp-kerpic-istif': "Yandan görünüm: aralıklı, en çok dört sıra istiflenmiş kerpiç yığını, üstü tahta ve naylonla yağmurdan örtülü; \"1 ay\" etiketi.",

  // Kerpiç duvar
  'sf-yp-kerpic-kalinlik': "Üstten duvar kesiti: dış duvarda bir sıra enine 30'luk kerpiç ve bir sıra 15'lik kerpiç (1,5 boy, \"47 cm\"), iç duvarda bir kerpiç boyu (\"30 cm\").",
  'sf-yp-kerpic-sasirtma': "Önden duvar görünüşü: şaşırtmalı dizilmiş kerpiçler yeşil onaylı; yanda düz derzli küçük duvar, derz kırmızı çizgi ve kırmızı çarpı.",
  'sf-yp-kerpic-cekul': "Yandan görünüm: usta duvarın yanında çekül sarkıtıyor, sırada gergin ip; çekül ipi duvara paralel, yeşil onay.",
  'sf-yp-kerpic-hatil': "Eğik görünüş: kerpiç duvarın üstünde iki boyuna kadronlu ahşap hatıl, 50 cm arayla enine bağlar, arası taş kırığı; \"50 cm\" ölçüsü.",
  'sf-yp-kerpic-bosluk': "Önden duvar görünüşü: köşeden 1 m içeride pencere, pencere üstünde iki yana 20 cm giren lento; ölçü okları.",

  // Cob
  'sf-yp-cob-temel': "Yakın plan: taş temelin pürüzlü üstüne bir el fırçayla kil şerbeti sürüyor; temel toprağın üstünde yükseliyor.",
  'sf-yp-cob-topak': "Yakın plan: iki el yaklaşık 20 cm çapında samanlı çamur topağını duvarın üstüne bastırıyor; aşağı turuncu ok.",
  'sf-yp-cob-kat': "Yandan kesit: taş temel üstünde bir günlük cob katı, üstü naylonla örtülü; \"60 cm\" ölçüsü ve \"1 gün\" saat simgesi.",
  'sf-yp-cob-kasa': "Önden görünüm: taş temel üstünde yükselmekte olan cob duvarın içine yerleştirilmiş tahta pencere kasası, çevresi çamurla örülmüş.",
  'sf-yp-cob-duzeltme': "Yandan görünüm: bir kişi yarı ıslak cob duvarın taşan yüzünü testereyle kesiyor; duvar yüzünde parmak kalınlığında kurutma delikleri.",

  // Sıkıştırma toprak
  'sf-yp-sikistirma-avuc': "Yakın plan: açık avuçta sıkılmış nemli toprak topağı, yüzeyi hafif parlak; yeşil onay.",
  'sf-yp-sikistirma-kalip': "Perspektif: duvar hattında iki kalın tahta yüzden oluşan kalıp, karşılıklı bağlayıcı çubuklar ve aralayıcılar; kalıp yüksekliğinde \"50–70 cm\".",
  'sf-yp-sikistirma-tokmak': "Kalıp kesiti: iki tahta yüz arasında dövülmüş katlar; üstte solda gevşek \"10 cm\" kat, sağda tokmakla dövülmüş \"5 cm\" kat; tokmak ve aşağı turuncu ok.",
  'sf-yp-sikistirma-hatil': "Eğik görünüş: taş temel üstünde sıkıştırma toprak duvar parçası; köşelerde ve pencere kenarlarında ahşap dikmeler, üstte bunlara bağlı kesintisiz ahşap hatıl.",

  // Dal örgü
  'sf-yp-dal-cubuk': "Önden görünüm: ahşap iskelet panelinde alt kirişten üst kirişe uzanan düşey ince çubuklar.",
  'sf-yp-dal-orme': "Önden görünüm: düşey çubukların arasından bir önden bir arkadan geçen yatay dal sıraları; en üstte örülmekte olan yeşil dal ve yolunu gösteren turuncu oklar.",
  'sf-yp-dal-sivama': "Yandan görünüm: örgünün iki yanında usta ve yardımcı avuçlarıyla çamuru örgüye bastırıyor; karşılıklı turuncu oklar.",
  'sf-yp-dal-badana': "Önden görünüm: kurumuş çamur sıvalı duvara bir kişi geniş fırçayla beyaz kireç badanası sürüyor.",

  // Sıva
  'sf-yp-siva-kaba': "Yakın plan: el, kerpiç duvara samanlı kaba çamur sıvayı bastırarak sürüyor, yüzey pürüzlü.",
  'sf-yp-siva-perdah': "Yakın plan: ıslak mala ile ince çamur sıva perdahlanıyor, yüzey düzgün ve parlak.",
  'sf-yp-siva-kirec': "Yakın plan: 1 kova kireç kaymağı ve 3 kova kum, altta karıştırma teknesi; \"1 : 3\" etiketi.",
  'sf-yp-siva-nemleme': "Yandan görünüm: usta yeni kireç sıvalı duvara elle ince su serpiyor; duvarın üstü güneşe karşı hasırla gölgelenmiş, yerde kova.",

  // Gömük ev
  'sf-yp-gomuk-set': "Yandan kesit: zemin seviyesindeki taş evin kuzey duvarına dıştan eğimli toprak set yığılmış, güney yüzü açık ve pencereli; güneş, yeşil onay.",
  'sf-yp-gomuk-yamac': "Yandan kesit: yamaca gömülmüş ev, arkasında yamacı tutan taş istinat duvarı, yalnız güney yüzü açık; toprak itmesini gösteren oklar.",
  'sf-yp-gomuk-tonoz': "Yan yana iki kesit: solda taş tonoz tavanlı oda, üstünde ince toprak ve ot, yeşil onay; sağda düz tahta tavan üstüne kalın toprak, kırmızı yük okları ve kırmızı çarpı.",
  'sf-yp-gomuk-drenaj': "Kesit: gömük duvarın dışında siyah su yalıtım katı, duvar dibinde çakıllı drenaj hendeği, yüzey suyu üstte hendekle yana çevriliyor; mavi su okları.",
  'sf-yp-gomuk-hava': "Kesit: toprağa gömülmüş evin iki ucunda yükselen iki havalandırma bacası; birinden giren, odadan geçip öbüründen çıkan hava turuncu oklarla.",

  // Kütük seçme
  'sf-yp-kutuk-agac': "Kış ortamı: düz gövdeli çam yeşil onaylı, eğri ve çok dallı ağaç kırmızı çarpılı; karlı zemin.",
  'sf-yp-kutuk-cap': "Yakın plan: kütüğün ince ucunda iki el şerit ölçü tutuyor; \"25–30 cm\" etiketi.",
  'sf-yp-kutuk-soyma': "Yandan görünüm: usta sehpalar üstündeki kütüğün kabuğunu soyma bıçağıyla kendine doğru çekerek soyuyor; kütüğün bir yanı soyulmuş, öbür yanı kabuklu; turuncu ok.",
  'sf-yp-kutuk-istif': "Önden görünüm: taş takozlara oturan kirişler üstünde, aralıklı tek sıra dizilmiş soyulmuş kütük uçları; üstte sundurma örtüsü; \"6 ay\" etiketi.",

  // Köşe geçme
  'sf-yp-gecme-taban': "Yakın plan: taş temel üstüne oturan taban kütüğünün alt yüzü düz yontulmuş; düz yüz turuncu ile vurgulu.",
  'sf-yp-gecme-pergel': "Şema: alt kütüğün ucu (daire, yarıçapı \"r\") üstünde çapraz duran üst kütük; pergel \"r\" kadar açık, bir ucu alt kütükte, öbürü üst kütüğün yüzünde oyuk çizgisini (turuncu kesik yay) çiziyor.",
  'sf-yp-gecme-oyma': "Şema: üst kütüğün alt yüzündeki yarım ay oyuk alt kütüğe oturuyor (turuncu çizgi), yeşil onay; yanda oyuğu alttaki kütüğün üstüne açılmış, su toplayan örnek kırmızı çarpılı.",
  'sf-yp-gecme-kavela': "Kesit: üst üste iki kütük, üst kütükten alttakine inen ahşap çivi (kavela) deliği ve çivi; köşeden \"60 cm\" ölçüsü.",
  'sf-yp-gecme-oturma': "Önden görünüm: kütük duvardaki kapı kasasının üstünde boş bırakılmış oturma payı; boşlukta \"6–10 cm\" ölçüsü.",

  // Kütük doldurma
  'sf-yp-doldurma-yosun': "Kütük duvar, uçları sağda görünür: alttaki kütüğün üstüne serilmiş yeşil yosun şeridi, üst kütük iplerle üstüne indiriliyor; aşağı ok.",
  'sf-yp-doldurma-kama': "Kütük duvar: iki kütük arasındaki geniş aralığa çakılmış ince yarık ahşap kamalar, çivi başları; aralığı gösteren ok.",
  'sf-yp-doldurma-sivama': "Kütük duvar: kamaların üstü kil-saman dolguyla kapatılmış, el dolguyu aralık boyunca bastırıyor; yatay ok.",

  // Harçsız taş
  'sf-yp-kuru-dizme': "Önden görünüş: her taş alttaki iki taşın arasındaki derzi kapatıyor; düz derz örneği küçük kutuda kırmızı \"yasak\".",
  'sf-yp-kuru-sev': "Önden kesit: duvar yukarı doğru iki yandan eşit inceliyor; iki yüz, aradaki küçük dolgu taşları, tepe taşı; iki yanda şev şablonu ve gergin ipler.",
  'sf-yp-kuru-baglayici': "Kesit: duvarın tüm genişliğini geçen uzun bağlayıcı taş, iki yüzden biraz taşıyor; yerden \"50 cm\" ve \"1 m\" hizalarında.",

  // Kireç
  'sf-yp-kirec-ocak': "Kesit: toprak sete gömülü taş astarlı kireç ocağı; içte kat kat kireç taşı ve odun, altta ateşlik ağzı ve alevler, üstü kille sıvalı; \"900°C+\" etiketi.",
  'sf-yp-kirec-tas': "Yakın plan iki taş: solda kırılmış iyi pişmiş kireç, içi beyaz ve gözenekli (yeşil onay); sağda ortası gri ve sert kalmış taş (kırmızı \"yasak\").",
  'sf-yp-kirec-sondurme': "Yandan görünüm: gözlüklü, eldivenli, uzun kollu usta geriye eğilmiş, teknedeki sönmemiş kirece kovadan su döküyor; tekneden buhar yükseliyor; geri çekilme oku.",

  // Harçlı taş duvar
  'sf-yp-tasd-baglayici': "Duvar kesiti: 50 cm kalın harçlı duvarda yüzden kalınlığın dörtte üçüne uzanan bağlayıcı taş; \"50 cm\" ve \"¾\" ölçüleri.",
  'sf-yp-tasd-hatil': "Önden görünüş: taş duvarda en çok 1,5 m arayla yatay ahşap hatıllar; ölçü oku \"1,5 m\".",
  'sf-yp-tasd-bosluk': "Önden duvar görünüşü: köşe ile ilk pencere arasında \"1,5 m\" dolu duvar, açıklıklar duvarın küçük bir kısmı.",

  // Ahşap iskelet
  'sf-yp-iskelet-dikme': "Yakın perspektif: taş temel üstündeki taban kirişinde yuva, dikmenin alt ucundaki zıvana dili yuvaya iniyor; aşağı ok, \"zıvana\" etiketi.",
  'sf-yp-iskelet-capraz': "Önden görünüş: taş temel üstünde dikme-kiriş çatkısı, panellerde iki yöne çaprazlar (yeşil onay); yanında çaprazsız, yana yatmış küçük çatkı (kırmızı çarpı).",
  'sf-yp-iskelet-himis': "Önden görünüş: taş temel üstündeki ahşap iskeletin bölmeleri kerpiçle doldurulmuş; bir bölmede dal örgü, alt kısmı düzgün kenarlı çamur sıvayla kapanmış (hımış).",

  // Merdiven
  'sf-yp-merdiven-basamak': "Yakın plan: basamak ucu dikmedeki delikten geçmiş, ahşap çiviyle sabit (yeşil onay); yanında yalnız yüzeye çivilenmiş basamak (kırmızı çarpı).",
  'sf-yp-merdiven-aci': "Yandan görünüm: eve dayalı merdiven; duvar boyunca yükseklik \"4\", ayağın duvara uzaklığı \"1\" ölçüleri.",
  'sf-yp-merdiven-uc-nokta': "Yandan görünüm: merdivene çıkan kişi iki eli ve bir ayağı basamakta; üç temas noktası turuncu halkalarla, \"3 nokta\" etiketi.",

  // Çatı eğim
  'sf-yp-cati-egimler': "Üç küçük ev yan yana: saz 45°, kiremit 40°, şındıl 35° eğimli çatı; her birinde açı yayı, açı etiketi ve malzeme adı. Toprak dam gösterilmez (yeni yapıda önerilmiyor).",
  'sf-yp-cati-makas': "Önden görünüm: kerpiç duvarlar üstünde iki mertek ve yatay bağ kirişinden makas, bağ kirişi yeşil vurgulu (onay); solda bağ kirişsiz çatının dışa yatırdığı iki kerpiç duvar (kırmızı oklar, çarpı).",
  'sf-yp-cati-sacak': "Yandan kesit: kerpiç duvar ve hatıl üstünde çatı saçağı duvardan \"50 cm\" taşıyor; damlalar duvardan uzağa, çakıl şeride düşüyor.",

  // Toprak dam
  'sf-yp-dam-yasak': "İki ev yan yana: solda kalın toprak damlı, duvarı çatlamış kerpiç ev, deprem titreşim çizgileri ve büyük kırmızı yasak işareti; sağda hafif ahşap beşik çatılı ev, yeşil onay. Yeni yapıda toprak dam yapılmaz.",
  'sf-yp-dam-katlar': "Kesit: alttan üste kalın kirişler, sırıklar, ot/saz katı, su yalıtım katı ve en çok 15 cm toprak; \"≤15 cm\" ölçüsü.",
  'sf-yp-dam-log': "Yandan görünüm: yaşlı köylü düz toprak damın üstünde sapından tuttuğu silindir taşını (loğ taşı) yuvarlıyor; hareket oku.",

  // Saz çatı
  'sf-yp-saz-egim': "Yandan görünüm: 45°'den dik çatı makası ve mertekler üstünde lata kesitleri; açı yayı ve \"45°+\" etiketi.",
  'sf-yp-saz-dizme': "Saçakta mertek ve latalar; demetler dipleri aşağıda yan yana dizilmiş, iple lataya bağlı; bir el yeni demetin ipini çekiyor.",
  'sf-yp-saz-bindirme': "Eğik kesit: mertek ve latalar üstünde her sıra demet alttakinin üstüne binmiş; toplam kalınlıkta \"15–20 cm\" ölçüsü.",

  // Şındıl
  'sf-yp-sindil-yarma': "Yandan görünüm: usta dik duran kütük parçasının üstüne rende bıçağını koymuş, sapını tutuyor, öbür elindeki tokmakla vuruyor; ayrılan ince levha, aşağı ok.",
  'sf-yp-sindil-bindirme': "Üstten görünüm: çatıda sıra sıra şındıl; her sıranın aralıkları alttaki sırayla şaşırtılmış, bir derzin üstteki şındılın ortasına geldiği turuncu kesikli çizgiyle gösterilmiş.",
  'sf-yp-sindil-civi': "İki yakın kesit: solda çivi yalnız üst şındıldan geçip lataya giriyor (yeşil onay); sağda çivi üst üste iki şındıldan geçiyor (kırmızı çarpı).",

  // Kiremit
  'sf-yp-kiremit-kalip': "Üstten görünüm: kum serpilmiş zeminde boş ince tahta kiremit kalıbı; iç kenarlara dayalı \"27 cm\" ve \"17 cm\" ölçüleri.",
  'sf-yp-kiremit-firin': "Kesit: taş fırın, altta ateşlik ve ızgara, üstte dikine ve aralıklı dizilmiş kiraz kırmızısı kiremitler, alevler aralardan yükseliyor; \"875–900°C\" etiketi.",
  'sf-yp-kiremit-dizme': "Eğik kesit: mertek ve latalar üstünde dişleriyle asılı, birbirine binen kiremitler; bindirme turuncu çerçeveli ve \"6,5 cm\" ölçülü; bir kiremit çivili.",

  // Kapı
  'sf-yp-kapi-kasa': "Önden görünüm: kerpiç duvardaki kapı boşluğunda ahşap kasa, üstünde iki yana taşan lento (turuncu vurgu); \"1 m\", \"2,1 m\" ve \"20 cm\" ölçüleri.",
  'sf-yp-kapi-kanat': "Arkadan görünüm: dikine tahtalar, iki yatay kuşak, menteşe tarafının (solda menteşeler) altından kilit tarafının üstüne yükselen çapraz; yönü turuncu okla.",
  'sf-yp-kapi-mil': "Yakın plan: kanadın menteşe dikmesinin üst mili üst kirişteki deliğe, alt mili eşik taşındaki yuvaya giriyor; miller turuncu halkalı, dönüş oku.",

  // Pencere
  'sf-yp-pencere-yeri': "Önden görünüm: kerpiç evde köşeden \"1 m\" içeride, üstünde lento olan küçük gözlü pencere; \"0,90×1,20\" etiketi, güneş.",
  'sf-yp-pencere-yagli': "İç görünüm: küçük gözlere bölünmüş çerçevede kâğıt kaplı gözler; el fırçayla gözlere yağ sürüyor, yağlanan gözler ışıkla parlıyor.",
  'sf-yp-pencere-kepenk': "İç görünüm: pencerenin içine kapatılmış iki kanatlı tahta kepenk; kayıt yuvalarından geçen sürgü, sürgü yönü turuncu okla.",

  // Kar barınağı
  'sf-yp-kar-cubuk': "Kar yığınına her yandan batırılmış kısa çubuklar; \"2 sa\" saat etiketi.",
  'sf-yp-kar-kesit': "Kesit: kar barınağının alçak giriş tüneli, içeride girişten yüksek oturma sekisi ve sekide oturan kişi, kubbe tavan, tavan kalınlığında \"30 cm\"; soğuk havanın girişe çöktüğü mavi ok.",
  'sf-yp-kar-delik': "Aynı kesit: kubbe tavanda açılmış havalandırma deliği, deliğe sokulmuş çubuk, turuncu halka; yukarı çıkan hava turuncu okla.",

  // Yurt
  'sf-yp-yurt-kafes': "Yakın plan: çapraz söğüt çubuklarının kesiştiği yerlerde düğümler (biri turuncu halkalı); kafesin açıldığını gösteren iki yöne ok.",
  'sf-yp-yurt-kusak': "Üç-çeyrek görünüm: daire biçiminde açılmış kafes duvar, kapı kasası, tepe çemberine giden çatı sırıkları; duvarın üst kenarını saran kırmızı kuşak, iki yandan içe ok.",
  'sf-yp-yurt-kece': "Üç-çeyrek görünüm: iskeletin üstüne keçeler örtülmüş, duvar ve çatıda sıkı bağlanmış ipler; tepe deliği açık, önde kapı.",

  // Keçe
  'sf-yp-kece-dovme': "Yandan görünüm: başörtülü kadın diz çökmüş, kamış hasır üstündeki kabarık yünü iki sopayla dövüyor; aşağı ok.",
  'sf-yp-kece-serme': "Üstten görünüm: kamış hasır üstünde iki kat yün; üst katın lifleri dikey, sağ alt köşesi kıvrılmış ve altındaki yatay lifli kat görünüyor; lif yönleri turuncu oklarla.",
  'sf-yp-kece-yuvarlama': "Yandan görünüm: başörtülü kadın diz çökmüş, iki eliyle içinde yün olan hasır ruloyu ileri itip yuvarlıyor; rulonun ucunda sarmal; dönüş ve ilerleme okları.",

  // Çit
  'sf-yp-cit-zikzak': "Üstten görünüm: çimenin üstünde direksiz, zikzak çizen sırık çit; her kolda üst üste sırıklar, uçları köşelerde birbirinin üstüne çaprazlanmış.",
  'sf-yp-cit-orgu': "Önden görünüm: sivri uçlu sık kazıkların arasından bir önden bir arkadan örülmüş dallar.",
  'sf-yp-cit-yirtici': "Yandan görünüm: kümesin alt kısmı \"60 cm\" dolu taş duvar, üstü sık tel, içeride tavuk; dışarıda tilki kırmızı yasak işaretiyle.",

  // Ahır ve kümes
  'sf-yp-ahir-yon': "Kuşbakışı: ağılın kuzey, batı ve doğu duvarı kapalı, güney yüzü açık ve çitli avluya bakıyor; içeride koyunlar; güneyde güneş, kuzeyden gelen soğuk rüzgâr mavi oklarla, \"K\" işareti.",
  'sf-yp-kumes-tunek': "Kümes içi yandan: yerden yüksekte çerçeve üstünde uçtan görünen üç yuvarlak tünek sırığı, her birinde bir tavuk; yükseklik \"60–100 cm\", iki sırık merkezi arası \"35–40 cm\" ölçüleri.",
  'sf-yp-kumes-folluk': "Kümes içi önden: yerden yarım metre yüksek rafta samanlı, içi karanlık folluk kutuları; birinde yumurta, birinde tavuk; önde basamak çıtası; \"45–60 cm\" ölçüsü.",
};
