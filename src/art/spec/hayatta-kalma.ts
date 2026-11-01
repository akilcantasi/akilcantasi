// Çizim şartnamesi: Doğada hayatta kalma rehberleri.
// Hepsi detaylı düz (flat) çizim, 4:3 tuval, Kızılay/AFAD broşür üslubu.
export const SPEC: Record<string, string> = {
  // --- su bulma ---
  'hayatta-kalma-su-dinle': 'Önden: ormanda kıpırdamadan duran, elini kulağının arkasına koymuş dinleyen sırt çantalı yetişkin. Ağaçların arasından ona doğru gelen turuncu ses dalgaları; uzakta belli belirsiz bir dere.',
  'hayatta-kalma-su-vadi': 'Yandan, geniş açı: tepeden vadi tabanına inen yamaç; vadide sık yeşil bitki örtüsü ve kıvrılan küçük bir dere. Yamaçtan dereye doğru aşağı inen turuncu ok, yamaçta yürüyen küçük bir figür.',
  'hayatta-kalma-yagmur-toplama': 'Önden: iki ağaç arasına dört köşesinden gerilmiş naylon branda; ortasında küçük bir taş brandayı çukurlaştırmış, yağmur damlaları brandaya düşüp ortadan aşağıdaki kova/kaba damlıyor. Taştan kaba turuncu ok.',
  'hayatta-kalma-ciy-toplama': 'Yandan, sabah alacakaranlığı: öne eğilmiş kişi iki eliyle açık renkli bezi diz boyu çiyli çimenlerin üstünde sürüyor; sürme yönünde turuncu ok, bezin önündeki otlarda çiy damlaları. Ufukta doğmamış güneşin pembe ışığı.',
  // --- su arıtma ---
  'hayatta-kalma-su-suzme': 'Yakın plan: alttan gelen elin tuttuğu, dibinde tortu birikmiş (dinlendirilmiş) kap yavaşça eğiliyor; üstteki su, ağzına temiz bez gerilmiş ikinci kaba dökülüyor. Alttaki kapta berrak su ve yeşil onay.',
  'hayatta-kalma-su-tablet': 'Yakın plan: el, su dolu mataraya bir arıtma tableti atıyor; yanında tablet paketi, paketin üstündeki talimat satırlarına bakan göz simgesi. Köşede saat simgesi ve "paketteki süre" etiketi; sabit dakika ya da saat yazısı yok. Matara kapağı yanda.',
  'hayatta-kalma-sodis': 'Yandan: güneşli bir kayanın ya da oluklu metal levhanın üstünde yatay yatırılmış, berrak su dolu iki şeffaf, renksiz PET şişe; tepede parlak güneş ve şişelere inen ışınlar, köşede "6 saat". Yanda ayrı küçük çerçevede iki yanlış örnek, her biri kırmızı yasakla çizili: belirgin yeşil ya da kahverengi renkli bir cam şişe ve içi çamurlu, bulanık kahverengi su dolu bir şişe.',
  // --- yön bulma: güneş ---
  'hayatta-kalma-golge-cubuk-1': 'Yandan, düz ve güneşli toprak: yaklaşık 1 m boyunda dik saplanmış çubuk ve yere düşen gölgesi; kişi çubuğu yere saplamış, iki eliyle dik tutuyor. Henüz taş ya da harf işareti yok (taş koymak sonraki adım).',
  'hayatta-kalma-golge-cubuk-2': 'Yukarıdan: çubuk, birinci taş ve gölgenin kaymış yeni ucuna konan ikinci taş; iki gölge çizgisi soluk ve koyu tonda. Birinci taşta "B", ikincide "D" etiketi; köşede "15–20 dk" saat simgesi.',
  'hayatta-kalma-golge-cubuk-kuzey': 'Yukarıdan, açık şema: iki taşı birleştiren yere çizilmiş çizgi (B–D); kişi çizginin güney tarafında, birinci taş (B) solunda, ikinci taş (D) sağında duruyor, yüzü kuzeye dönük. Kişinin baktığı yönde büyük turuncu ok ve "K" etiketi.',
  'hayatta-kalma-yon-ok': 'Yukarıdan: toprağa sopayla çizilmiş büyük bir ok ve ucunda "K" harfi; ok taşlarla çevrelenmiş. Yanında çömelmiş, sopayı tutan kişi.',
  'hayatta-kalma-yon-ok-gece': 'Gece aynı sahne: yıldızlı gök altında toprağa taşlarla çizilmiş kuzey oku ve "K"; yanında çömelmiş, sopayla çizen kişi (Kutup Yıldızı rehberi; yürümek için sabahı bekle).',
  // --- yön bulma: yıldız ---
  'hayatta-kalma-buyukayi': 'Gece gökyüzü, koyu lacivert zemin: Büyükayı\'nın 7 yıldızı kepçe biçiminde ince çizgilerle birleştirilmiş; altta ağaç siluetleri ve gökyüzüne bakan bir kişi silueti. Kepçenin ağzındaki iki yıldız hafif turuncu halkayla vurgulu.',
  'hayatta-kalma-kutup-yildizi-bulma': 'Gece gökyüzü şeması: Büyükayı kepçesi, dört yıldızlı kase ve kasenin bir köşesinden çıkan üç yıldızlı sap. Gösterici iki yıldız, kasenin sapa bağlı OLMAYAN uç kenarındaki iki yıldızdır: alttaki Merak, üstteki Dubhe; bu ikisi turuncu halkayla işaretli (kasenin alt kenarındaki yıldızlar değil). Kesikli turuncu çizgi Merak yıldızından Dubhe yıldızına gider ve kasenin açık (üst) tarafından dışarı, sapın ters yönüne doğru uzar; iki yıldız arası mesafe çizgi boyunca 5 kez çentikle işaretli, "×5". Çizginin ucunda tek başına duran, orta parlaklıkta Kutup Yıldızı beyaz halkayla vurgulu.',
  'hayatta-kalma-kutup-kuzey': 'Gece, yandan: kişi ayakta, kolunu Kutup Yıldızı\'na doğru kaldırmış; yıldızdan ufka dikey inen kesikli çizgi, ufukla kesiştiği yerde yere çizilmiş turuncu ok ve "K" etiketi. Yıldız ufkun biraz üstünde, gökyüzünün yarısından aşağıda.',
  'hayatta-kalma-kassiopeia': 'Gece gökyüzü şeması: bir yanda W biçimli Kassiopeia, karşı yanda Büyükayı kepçesi; aralarının ortasında halkayla vurgulu Kutup Yıldızı. İki takımyıldızı ile yıldız arasında ince kesikli çizgiler.',
  // --- yön bulma: saat ---
  'hayatta-kalma-saat-duz': 'Yakın plan, üstten: açık avuç içinde düz duran akrep-yelkovanlı kol saati; arka planda güneşli toprak. Saat yüzü net, rakamlar okunur.',
  'hayatta-kalma-saat-akrep-gunes': 'Yakın plan, üstten: düz tutulan analog saat, akrep (kısa ibre) gökteki güneşe doğru çevrilmiş; akrepten güneşe uzanan turuncu kesikli çizgi. Köşede küçük güneş.',
  'hayatta-kalma-saat-guney': 'Yakın plan, üstten: avuçta düz tutulan analog saat, akrep 4 rakamını gösteriyor ve akrebin doğrultusunda, saatin kenarının hemen dışında güneş duruyor (akrep güneşe bakıyor). "1" rakamı yuvarlakla vurgulu, "12" soluk. Akrep (4) ile 1 arasındaki küçük açı hafif sarı dilimle boyalı; dilimin tam ortasından (2 ile 3 arası, 2:30 konumu) dışarı uzanan kalın turuncu ok ve "G" etiketi.',
  // --- pusula ve harita ---
  'hayatta-kalma-harita-yonlendir': 'Üstten: yere ya da kaya üstüne serilmiş topoğrafik harita, üstünde şeffaf tabanlı pusula; haritanın kuzey çizgileri ile kırmızı iğne aynı yöne bakıyor. Haritayı çeviren iki el ve dönme oku.',
  'hayatta-kalma-pusula-kenar': 'Yakın plan, üstten: haritada şeffaf tabanlı pusulanın uzun kenarı iki nokta arasına konmuş (başlangıçta küçük daire, hedefte bayrak); pusulanın yön oku bayrağı gösteriyor, turuncu vurgulu.',
  'hayatta-kalma-pusula-kadran': 'Yakın plan, üstten: pusula haritada sabit; parmaklar döner kadranı çeviriyor (dairesel turuncu ok), kadranın içindeki paralel kırmızı-siyah çizgiler haritanın kuzey-güney ızgara çizgileriyle hizalı.',
  'hayatta-kalma-pusula-igne': 'Önden: kişi pusulayı göğsünün önünde iki eliyle düz tutuyor, aşağı bakıyor; büyütülmüş ek kare: kırmızı manyetik iğne kadrandaki kuzey okunun (yuva) tam içinde, yeşil onay işareti.',
  'hayatta-kalma-pusula-hedef': 'Arkadan: pusulayı önünde tutan kişi; pusulanın yön okunun hizasında ileride belirgin tek bir ağaç turuncu halkayla işaretli, kişiden ağaca kesikli yürüme çizgisi.',
  // --- ateş ---
  'hayatta-kalma-ates-ruzgar-yasak': 'Yandan: kuru sarı otlu, rüzgârda eğilen ağaçlı alan; ortada yeni yakılmış küçük ateşten kuru otlara savrulan kıvılcımlar. Ateşin üstünde büyük kırmızı yasak işareti; köşede rüzgâr çizgileri.',
  'hayatta-kalma-ates-alani': 'Yukarıdan: yaprak ve kuru otları süpürülüp çıplak toprağa kadar temizlenmiş yuvarlak alan, ortada taşlarla çevrili ateş yeri. Alanın çapını gösteren ölçü oku ve "3 m"; yanda su kovası.',
  'hayatta-kalma-ates-yakma': 'Yakın plan, yandan: taş halkanın içinde üç kademe yakıt — en altta kuru ince çalı çırpı ve kuru ot, üstünde parmak kalınlığında dallar çadır biçiminde, yanda bekleyen kalın odunlar. Kibritle alttan tutuşturan el; küçük alev. Kademelere 1-2-3 numaraları.',
  'hayatta-kalma-ates-sondurme': 'Üç küçük kare yan yana: (1) ateşe kovadan bol su dökülüyor, buhar; (2) sopayla kül ve köz karıştırılıyor; (3) elin tersi küllerin üstüne yaklaştırılmış, yeşil onay işareti. Kareler arasında turuncu oklar.',
  // --- barınak ---
  'hayatta-kalma-barinak-yer': 'Yandan, geniş açı: solda kuru dere yatağı, ortada kuru ölü ağacın altı, sağ üstte taş düşen yamaç — üçünde kırmızı yasak işareti; ortada yamacın korunaklı düzlüğünde canlı ağaçların yanında küçük barınak ve yeşil onay işareti.',
  'hayatta-kalma-zemin-yalitim': 'Yandan kesit: yere serilmiş kalın kuru yaprak ve çam dalı katmanı (kalınlık oku ile "1 karış"), üstünde oturan montlu kişi. Çıplak toprağa doğru inen mavi soğuk okları katmanda kesiliyor.',
  'hayatta-kalma-barinak-dal': 'Yandan, kesitli: iki ağaç arasına bel yüksekliğinde yatay bağlanmış bir sırık. Uzun dallar sırığa dayanıp öbür uçları yere değecek şekilde yaklaşık 45 derece eğik dizilmiş, sık ve aralıksız; sırık, dallar ve zemin bir yanı kapalı üçgen kesit oluşturuyor. Dalların ÜSTÜNDE kalın yaprak ve çalı örtü katmanı. Üçgenin altında, alçak tarafta yaprak döşekte uzanmış kişi. Dallar sırıktan saçak gibi sarkmıyor, yaprak örtü havada durmuyor.',
  'hayatta-kalma-barinak-branda': 'Önden 3/4: iki ağaç arasına gerilmiş ip, üstünden aşırılıp eğik açıyla yere kazıklanmış branda (tek yüzlü çatı); girişi rüzgârın tersine bakıyor. Rüzgâr çizgileri brandanın sırtına çarpıyor, turuncu okla rüzgâr yönü.',
  'hayatta-kalma-barinak-bez': 'Yandan: kişi ayakta, ağaç dalına parlak kırmızı bir bez asıyor; hemen yanında branda barınak, gökyüzünde küçük helikopter.',
  'hayatta-kalma-parlak-bez': 'Yandan: açık bir alanda parlak turuncu-kırmızı bez/mont bir ağaç dalına asılmış ve yere geniş serilmiş. Yanındaki kişi diz çökmüş, iki eliyle yerdeki bezin köşesini düzeltiyor; kolları aşağıda, el sallamıyor, tek kolunu kaldırmıyor. Yukarıda gökyüzünde küçük bir helikopter silueti.',
  // --- işaret ---
  'hayatta-kalma-yer-isareti': 'Yukarıdan (kuş bakışı): açık çayırda taş ve dallarla yapılmış büyük "V" harfi; bir kolunun yanında çift uçlu ölçü oku ve "3 m".',
  'hayatta-kalma-ayna': 'Yandan: kişi bir eliyle aynayı gözünün hemen yanında tutuyor, öbür kolu ileri uzanmış, iki parmağı V yapmış; aynadan yansıyan ışık demeti parmakların arasından uzaktaki küçük uçağa gidiyor (turuncu ışın). Arkada güneş.',
  'hayatta-kalma-helikopter-y': 'Önden: açık alanda duran kişi iki kolunu yukarı Y biçiminde kaldırmış; tepede yaklaşan helikopter. Yanda küçük ek kare: bir kol yukarı bir kol aşağı ("yardım gerekmiyor") ve el sallayan figür üzerinde kırmızı yasak işareti.',
  // --- yabani yiyecek ---
  'hayatta-kalma-oncelik-sirasi': 'Soldan sağa dört büyük simge, aralarında turuncu oklar: 1 kırmızı hilalli ilk yardım çantası, 2 barınak/çadır ve alev (sıcaklık), 3 su damlası ve matara, 4 elma ve ekmek (yiyecek, daha küçük çizilmiş). Altlarında 1-2-3-4 numaraları.',
  'hayatta-kalma-mantar-yasak': 'Yakın plan: orman zemininde birkaç farklı, büyük çizilmiş yabani mantar ve üstlerinde büyük kırmızı yasak işareti. Yanda ateş üstünde tavada pişen mantar da kırmızı yasak işaretli (pişince de zehirli).',
  'hayatta-kalma-bitki-yasak': 'Yakın plan, omuzdan yukarı: kişi solundaki çalıdan kopardığı parlak mor meyveyi parmaklarıyla ağzına götürüyor; el ve ağzın üstünde kırmızı yasak işareti.',
  // --- soğuk gece ---
  'hayatta-kalma-katman-giyin': 'Önden, dağ yolunda: gökyüzü bulutlanmış, ilk yağmur damlaları düşüyor (güneş yok). Kişi içlik ve poların üstüne kapüşonlu yağmurluğu giyip fermuarını çekiyor; bere ve eldivenli, boynu atkılı. Yanda katmanları gösteren küçük ayrık çizim (içlik, polar, yağmurluk). Yeşil onay işareti.',
  'hayatta-kalma-folyo-battaniye': 'Yandan: yaprak döşek üstünde oturan, gümüş folyo battaniyeye gövdesinden sarınmış kişi; yüzü açık, başında bere. Folyodan yansıyan ışık parıltıları.',
  'hayatta-kalma-sokulma': 'Yukarıdan: barınağın yaprak döşeğinde yan yana, birbirine sokulmuş iki kişi (başları açık, gözleri kapalı), boyunlarından ayaklarına kadar ikisini birden örten tek battaniye.',
  // --- sıcak ---
  'hayatta-kalma-sicak-saat': 'Yandan: çorak arazide gölgede oturup dinlenen kişi; gökte tepede yakıcı güneş; köşede saat simgesi ve "10–16" etiketi; güneşin altında yürüyen küçük figür üzerinde kırmızı yasak işareti.',
  'hayatta-kalma-golgelik': 'Yandan: iki çalı ya da taş arasına gerilmiş açık renkli branda/giysi, yerden bir miktar yüksekte; altında çantasının üstünde oturan kişi; brandanın altından geçen hava akımı okları.',
  'hayatta-kalma-sicak-ortu': 'Önden: açık renkli, bol, uzun kollu giysi, geniş kenarlı şapka ve enseyi örten bez giymiş yürüyüşçü; yeşil onay işareti. Yanda tişörtü çıkarmış, güneşte kızarmış figür üzerinde kırmızı yasak işareti.',
  'hayatta-kalma-islak-bez': 'Yakın plan: kişi ıslatılmış bezi ensesine ve başına koyuyor, bezden su damlaları; yanında az suyu olan matara.',
  // --- dere geçme ---
  'hayatta-kalma-dere-geri-don': 'Yandan: hızlı, köpüklü akan derenin kıyısında duran yürüyüşçü dönüp geri yürüyor; dereye girme yönünde kırmızı yasak işareti, geri dönüş yönünde yeşil ok; uzakta küçük bir köprü.',
  'hayatta-kalma-dere-diz': 'Yandan karşılaştırma, iki kare: solda su diz altında, yavaş akıyor — yeşil onay; sağda su dizin üstünde, hızlı ve köpüklü — kırmızı yasak. Diz hizasında yatay kesikli çizgi.',
  'hayatta-kalma-dere-kemer': 'Yakın plan: sırt çantalı kişinin elleri bel kemerinin tokasını ve göğüs kayışını açıyor; tokalarda turuncu "açık" okları.',
  'hayatta-kalma-dere-sopa': 'Yukarıdan ve hafif yandan: akıntı soldan sağa akıyor (mavi oklar). Sığ derede ayakkabılı yürüyüşçü YÜZÜ VE GÖVDESİYLE akıntının geldiği yöne (sola) dönük, izleyiciye bakmıyor; sağlam sopayı önünde, akıntının yukarısında dereye dayamış, iki eliyle tutuyor. Karşı kıyıya doğru yan adım okları (turuncu), akıntıya dik yönde.',
  'hayatta-kalma-dere-dusme': 'Yandan: akıntıda sırtüstü yüzen kişi, ayakları akıntı yönünde önde ve su yüzeyinde, kolları yanda; kıyıya çapraz uzanan turuncu ok. Ayakların önünde kayalar.',
  // --- vahşi hayvan ---
  'hayatta-kalma-hayvan-kosma-yasak': 'Yandan: patikada uzakta bir boz ayı; ondan koşarak kaçan figür üzerinde kırmızı yasak işareti; yanında sakin duran, kollarını hafif açmış figür yeşil onaylı.',
  'hayatta-kalma-ayi-geri-cekil': 'Yandan: uzakta duran boz ayı. Kişi yüzü ve gövdesi ayıya dönük, bir ayağı geride, ayıdan UZAKLAŞAN yönde yavaşça yan-geri adım atıyor; ağzından alçak ses dalgaları. Turuncu ok kişinin ayaklarından başlayıp ayıdan uzağa, geriye ve yana doğru gidiyor; ayının üstünde ya da ayıya doğru ok yok.',
  'hayatta-kalma-ayi-yuzustu': 'Yukarıdan: yerde yüzüstü yatan, sırt çantası sırtında, elleri ensesinde kenetli, bacakları iki yana açık kişi; yanında boz ayı silueti. Ensedeki ellere ve açık bacaklara turuncu vurgu okları.',
  'hayatta-kalma-isirik-yika': 'Yakın plan: kolu sıvanmış, koyu tenli ön kol (rehberdeki kişi, camgöbeği kol) bol akan musluk suyu altında yıkanıyor; yanında sabun, köşede "15 dk" saat simgesi.',
  'hayatta-kalma-kopek-dur': 'Önden: kişi dimdik duruyor, kolları göğsünde çapraz, bakışı aşağı ve yana; önünde havlayan iki-üç sokak köpeği. Kişinin yanında küçük yeşil onay; köşede koşan figür üzerinde kırmızı yasak işareti.',
  // --- düğümler ---
  'hayatta-kalma-dugum-sekiz': 'Yakın plan, düz arka plan: kalın renkli ipte sekiz (kropi) düğümünün üç aşaması soldan sağa — halka, ucun ipin arkasından dolanması, ucun halkadan geçip 8 şeklinin oluşması. İp ucu turuncu, ana ip mavi; ucun izlediği yol okla.',
  'hayatta-kalma-dugum-izbarco': 'Yakın plan, dört aşama: ipte küçük halka; uç halkadan alttan yukarı çıkıyor; uç ana ipin arkasından dolanıyor; uç aynı küçük halkadan aşağı iniyor ve sıkılmış kaymayan büyük halka. İp ucu turuncu, ana ip mavi, yönler oklarla.',
  'hayatta-kalma-dugum-camadan': 'Yakın plan, iki büyük sıra: üstte bitmiş camadan — turuncu ve mavi ipin iç içe geçmiş iki kıvrımı, iki kısa uç da üst yanda (aynı yanda), yeşil onay; altta aynı düğüm ama kısa uçlar ters yanlarda (biri üstte biri altta), kırmızı çarpı. Uzun kollar çerçeve dışına uzanır.',
  'hayatta-kalma-dugum-iskota': 'Yakın plan, üç aşama: kalın mavi ip U biçiminde katlanmış; ince turuncu ip alttan U\'nun içinden geçiyor, U\'nun arkasından dolanıyor, kendi altından geçip sıkılıyor. Yönler oklarla.',
  'hayatta-kalma-dugum-kazik': 'Yakın plan: ağaç gövdesi ya da kazık; ip bir kez dolanmış, kendi üstünden çaprazlanmış, ikinci tur ve ucun son turun altından çıkışı; bitmiş kazık bağı. İp ucu turuncu, yönler oklarla.',
};
