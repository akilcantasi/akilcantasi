// Sıfırdan: Yiyecek saklama — çizim açıklamaları (ayrıntılı düz çizim, 4:3)
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  'sf-ys-et-kapak': 'Önden: saçak altında ipte asılı çemenli pastırma ve çiroz balıkları, önde toprak küp, sağda dumanı tüten küçük tütsü çadırı. İnsan yok.',
  'sf-ys-meyve-sebze-kapak': 'Önden: güneşli avluda yerden yüksek kerevette kayısılar, sarkan kırmızı biber dizileri, turşu ve biber kavanozları. Canlı turuncu-kırmızı tonlar.',
  'sf-ys-sut-kapak': 'Önden: tahta masada tahta kaşıklı yoğurt kâsesi, tülbentte asılı damlayan süzme, teneke içinde beyaz peynir kalıpları ve ahşap yayık. Açık mavi duvar.',
  'sf-ys-tahil-kiler-kapak': 'Önden: taş duvarlı kilerde rafta un çuvalları, sırlı küpler, asılı soğan ve sarımsak dizileri; alt rafta somun ekmek ve el değirmeni.',

  // Et güvenliği
  'sf-ys-et-serin-asma': 'Yandan: bir kişi kesilmiş et parçalarını serin, gölgeli bir odada kancalara asıyor, pencereden serin hava giriyor (açık mavi oklar). Duvarda termometre, etiket "4 °C".',
  'sf-ys-trisin-yasak': 'İki bölme: solda yaban domuzu, üstünde tütsü dumanında asılı kuru et şeritleri ve şeritlerin üstünde kırmızı yasak işareti; sağda ateşte tavada pişen et, yeşil onay.',
  'sf-ys-et-pismis-kesit': 'Yakın plan: tahtada ikiye kesilmiş iki et parçası; soldakinin içi tamamen grileşmiş, termometre saplı, berrak su damlası, yeşil onay; sağdakinin içi pembe, kırmızı çarpı. Etiket "71 °C".',
  'sf-ys-el-yikama-bicak': 'Yandan: bir kişi leğende sıcak su ve sabunla kıyma makinesi parçalarını ve bıçağı yıkıyor; çiğ et tahtası ile pişmiş yemek tabağı ayrı yerlerde duruyor.',

  // Et kurutma
  'sf-ys-et-serit-kesme': 'Yakın plan, yukarıdan: bir el eti bastırıyor, diğer el bıçakla yağsız eti ince şeritlere kesiyor; kesilmiş şeritler yanda. Şerit kalınlığı işareti "0,5 cm".',
  'sf-ys-et-kaynatma': 'Yakın plan: ateş üstündeki tencerede tuzlu suyla kaynayan et şeritleri, buhar; yanında "5 dk" saat.',
  'sf-ys-et-kurutma-askisi': 'Yandan: odun sobasının yanındaki tel askıda birbirine değmeden asılı ince et şeritleri; turuncu oklar sıcak havanın şeritlere yükseldiğini gösteriyor. Etiket "60 °C".',
  'sf-ys-et-bukme-testi': 'Yakın plan: iki el bir kuru et şeridini büküyor, bükülen yerde çatlaklar var ama parça kopmamış; yeşil onay. Yanında küçük resim: ikiye kopan aşırı kuru şerit.',

  // Pastırma
  'sf-ys-pastirma-yarma': 'Yukarıdan: tahtada duran büyük sığır kası, bir el eti bastırıyor, diğer el bıçakla yüzeye 45 derece açıyla paralel derin yarıklar açıyor. Açı yayı ve "45°".',
  'sf-ys-pastirma-tuz': 'Yakın plan: iki el kaba tuzu etin yarıklarının içine ve yüzeye bastırıyor; yanda tuz kâsesi.',
  'sf-ys-pastirma-asma': 'Önden: gölgeli saçak altında iplerle asılı, çemenle kaplı pastırma parçaları; yanda esinti.',
  'sf-ys-pastirma-pres': 'Yandan: iki düz tahta arasına dizilmiş pastırma etleri, üst tahtanın üstünde iri taşlar; turuncu oklar aşağı doğru baskıyı gösteriyor. Etiket "12–24 sa".',
  'sf-ys-cemen-hamuru': 'Yukarıdan: büyük leğende kızıl-kahve koyu çemen hamuru, yanında küçük kaplarda çemen otu unu, dövülmüş sarımsak ve toz kırmızı biber; bir el tahta kaşıkla karıştırıyor.',
  'sf-ys-cemen-kaplama': 'Yakın plan: tahtadaki etin yarısı kalın kırmızı çemen hamuruyla kaplanmış, bir el hamuru yüzeye sürüyor; yanda çemen kâsesi.',
  'sf-ys-cemen-siyirma': 'Yakın plan, yandan: bir el tahta spatulayla pastırmanın üstündeki fazla çemeni sıyırıyor, geride ince düzgün bir kat kalıyor; turuncu ok sıyırma yönü. Etiket "2–3 mm".',

  // Kavurma
  'sf-ys-kavurma-dograma': 'Yukarıdan: tahtada ceviz büyüklüğünde doğranmış kırmızı et ve ayrı kapta küçük doğranmış beyaz kuyruk yağı; eller bıçakla doğruyor.',
  'sf-ys-kavurma-kazan': 'Yandan: odun ateşi üstünde geniş kalın dipli kazanda kızarmış et parçaları ve berrak yağ; bir kişi uzun kepçeyle karıştırıyor. Kazanda su kalmamış, et kahverengi.',
  'sf-ys-kavurma-kup': 'Kesit görünüm: toprak küpün içinde sıkıca basılmış kavurma ve üstünde kalın beyaz yağ tabakası; turuncu ok yağ katmanını gösteriyor, etiket "2 parmak".',
  'sf-ys-kavurma-isitma': 'Yakın plan: ateş üstündeki tavada cızırdayarak ısınan kavurma, buhar; yanında "10 dk" saat.',

  // Sucuk
  'sf-ys-sucuk-cig-yasak': 'İki bölme: solda tabakta çiğ ev yapımı sucuk dilimleri, üzerinde kırmızı yasak işareti; sağda ateşte tavada pişen sucuk dilimleri, yeşil onay.',
  'sf-ys-sucuk-kiyma': 'Yandan: soğuk bir odada el kıyma makinesinden kıyma çıkıyor, yanında karıştırma kabında sarımsak, kırmızı biber ve kimyon; elleri kızarmış soğuk havada çalışan bir kişi.',
  'sf-ys-sucuk-doldurma': 'Yakın plan: huniden geçen kıyma bağırsağı dolduruyor (altta turuncu ok dolum yönü); sağdan bir el iğneyle hava kabarcığını deliyor, turuncu ok iğneyi gösteriyor.',
  'sf-ys-sucuk-asma': 'Önden: serin odada sinek telli pencere, sırığa at nalı biçiminde asılmış sucuklar.',

  // Balık
  'sf-ys-balik-taze-secim': 'Yakın plan: iki balık alt alta; üstte parlak gözlü, kırmızı solungaçlı taze palamut yeşil onaylı, altta donuk gözlü, solgun bayat balık kırmızı çarpılı.',
  'sf-ys-balik-dilimleme': 'Yukarıdan: tahtada yan yatmış, başı ve kuyruğu alınmış palamut gövdesi bıçakla kalın dilimlere kesiliyor. Kısa etiket "6–8 cm".',
  'sf-ys-lakerda-katman': 'Kesit görünüm: kapta en altta tuz katı, üstünde balık dilimleri, aralarda ve en üstte kaba tuz. Etiket "%20 tuz".',
  'sf-ys-balik-yarma': 'Yukarıdan: bir kişi uskumruyu sırtından açıp kelebek gibi yassılaştırıyor, iç organlar ayrı kapta.',
  'sf-ys-balik-tuza-gomme': 'Yandan kesit: ahşap kasada kaba tuz katları arasına yarı gömülü balıklar, yukarıdan bir el tuz serpiyor.',
  'sf-ys-ciroz-ip': 'Önden: iki direk arasında yerden yüksekte gerili ipe kuyruklarından asılmış kuru balıklar; ipin üstünden balıkları örten yarı saydam tül.',
  'sf-ys-ciroz-atesleme': 'Yakın plan: bir el maşayla kuyruğundan tuttuğu kuru balığı közün üstünde içi pişene kadar ısıtıyor. Etiket "63 °C".',

  // Tütsü
  'sf-ys-tutsu-sicak-soguk': 'İki bölmeli karşılaştırma: solda ateşin hemen üstünde varilde asılı balık, "71 °C" etiketi; sağda ateşi aşağıda, duman boruyla gelen sandıkta asılı balık, "32 °C altı" etiketi.',
  'sf-ys-tutsu-salamura': 'Yandan: büyük kovada tuzlu suya batırılmış balık parçaları, yanında tartı ve tuz torbası; kova üstünde ağırlık olarak tabak.',
  'sf-ys-tutsu-odun': 'İki bölme: solda meşe ve elma kütükleri (üstte elma) yeşil onaylı; sağda reçine damlayan çam kütükleri ve çam ağacı, kırmızı yasak işaretli.',
  'sf-ys-tutsu-termometre': 'Yakın plan: tahtada tütsülenmiş balığın en kalın yerine saplanmış kadranlı termometre; turuncu ok kadranı gösteriyor, etiket "71 °C".',
  'sf-ys-tutsu-cadiri': 'Yandan: sırıklardan kurulmuş üçayak tütsü çadırı, üstü bez ve yapraklı dallarla örtülü, altta köz görünen kapı, tepeden duman çıkıyor.',
  'sf-ys-tutsu-izgara': 'Kesit görünüm: çadırın içinde dipte küçük köz ateşi, yukarıda çapraz çubuklardan ızgarada et şeritleri; alev ızgaraya ulaşmıyor, gri oklar yükselen dumanı gösteriyor.',
  'sf-ys-tutsu-koz': 'Yakın plan: bir el köz yığınının üstüne yaş talaş ve küçük yaş odun parçaları koyuyor; alev yok, yoğun beyaz duman yükseliyor.',
  'sf-ys-soguk-tutsu-kanal': 'Yandan kesit: yamacın dibinde toprağa kazılmış ateş çukuru; oradan toprağın altından yamaç boyunca uzanan kapalı kanal yukarıdaki tahta sandığa çıkıyor; sandıkta asılı balıklar, tepeden duman. Kanalın içinde açık renk oklar.',

  // Botulizm
  'sf-ys-botulizm-havasiz': 'Önden: üç kap yan yana: kapalı kavanozda sebze, yağ içinde sarımsak, kapalı teneke; her birinin üstünde küçük ılık termometre simgesi ve uyarı üçgeni.',
  'sf-ys-botulizm-az-asitli': 'İki gruplu tablo çizimi: solda fasulye, bezelye, mantar, et, balık kırmızı çerçevede; sağda turşu, reçel, pekmez, elma yeşil çerçevede. Etiket "pH 4,6".',
  'sf-ys-yagda-sarimsak-yasak': 'Yakın plan: güneşli pencere önünde zeytinyağı dolu kavanozda sarımsak dişleri ve otlar; üzerinde kırmızı yasak işareti.',
  'sf-ys-kabarik-kapak': 'Yakın plan: kapağı kabarmış, içi kabarcıklı bulanık kavanoz ve şişmiş teneke, üstte kırmızı uyarı üçgeni; turuncu ok ikisini kalın, ağzı bağlı torbaya gösteriyor.',
  'sf-ys-konserve-kaynatma': 'Yakın plan: ateş üstündeki tencerede fokur fokur kaynayan konserve sebze yemeği, buhar; yanında "10 dk" saat.',

  // Meyve kurutma
  'sf-ys-meyve-dilimleme': 'Yukarıdan: tahtada ikiye bölünmüş, çekirdeği çıkarılmış kayısılar ve ince halka kesilmiş elmalar; eller bıçakla kesiyor.',
  'sf-ys-kerevet-tul': 'Yandan: yerden yüksek ayaklar üstünde tahta kerevet, üstünde tek kat dizili kayısılar, üzerinde gergin tül; köşede toprağa serilmiş kayısılar küçük resimde kırmızı çarpılı.',
  'sf-ys-meyve-ip': 'Önden: güneşli duvar önünde ipe dizili elma halkaları ve incirler, aralarında boşluk; bir kadın iğneyle yeni halkaları ipe geçiriyor.',
  'sf-ys-meyve-kuruluk-testi': 'Yakın plan: iki el kuru kayısıyı katlıyor; esnek ve yapışmıyor, nem çıkmıyor. Yeşil onay.',
  'sf-ys-kavanoz-sallama': 'Yakın plan: gevşek dolu kuru meyve kavanozu sallanıyor (sallama çizgileri); yanında içinde buğu oluşmuş ikinci kavanoz kırmızı çarpılı. Etiket "7–10 gün".',

  // Sebze kurutma
  'sf-ys-domates-kurutma': 'Yukarıdan: tahta kerevette kesik yüzü yukarı bakan, üstüne tuz serpilmiş yarım domatesler, köşede güneş.',
  'sf-ys-biber-ip': 'Önden: evin duvarında ipe dizilmiş kırmızı biberler ve bamyalar, uzun demetler halinde asılı.',
  'sf-ys-patlican-oyma': 'Yakın plan: tahtada patlıcan, bir el sapından tutuyor, diğer el kaşıkla içini oyuyor; arkada ipe dizilmiş oyulmuş patlıcanlar asılı.',
  'sf-ys-sebze-kuruluk-testi': 'Yakın plan: bir el kuru fasulye parçasını büküyor ve parça çıt diye kırılıyor; yanında gevrek kuru domates. Yeşil onay.',

  // Pestil, pekmez
  'sf-ys-herle-karistirma': 'Yakın plan: ateş üstündeki kazanda koyu mor şıra; sağdan bir el kaptan ince ince unlu su döküyor, soldan bir el uzun tahta kaşıkla karıştırıyor.',
  'sf-ys-pestil-serme': 'Yukarıdan: tahtaya gerilmiş beyaz bez üzerinde ince ve düzgün yayılmış koyu pestil tabakası, bir el tahta spatulayla yayıyor. Etiket "2–3 mm".',
  'sf-ys-kome-batirma': 'Yandan: bir kadın ipe dizili ceviz içlerini kazandaki bulamaca batırıyor; arkada asılı kurumakta olan köme dizileri.',
  'sf-ys-uzum-ezme': 'Yandan: tahta teknede üzümler eziliyor, bir kişi temiz ayakkabısız ayakla ya da tokmakla eziyor; dipteki delikten şıra kovaya akıyor.',
  'sf-ys-pekmez-topragi': 'Yakın plan: bir el beyaz toz halindeki pekmez toprağını ölçü kabıyla şıra dolu kazana ekliyor.',
  'sf-ys-sira-aktarma': 'Yakın plan: dinlenmiş şıra kabından berrak üst kısım kepçeyle yandaki kaba aktarılıyor; dipte bulanık tortu kırmızı çarpılı, turuncu ok aktarma yönünü gösteriyor.',
  'sf-ys-pekmez-kazan': 'Yandan: odun ateşi üstünde geniş kazanda kaynayan şıra, bir kadın köpüğü delikli kepçeyle alıyor.',
  'sf-ys-pekmez-kivam': 'Yakın plan: kaşıktan bal gibi koyu akan pekmez ve soğuk tabağa damlatılmış, yayılmayan pekmez damlası. Yeşil onay.',

  // Turşu, salamura, zeytin
  'sf-ys-salatalik-uc': 'Yakın plan: tahtada salatalık, bıçak çiçek ucunu incecik kesiyor; turuncu ok kesilen uca işaret ediyor.',
  'sf-ys-salamura-tartma': 'Önden: terazide kâsede tuz, yanında 1 litrelik ölçü kabında su. Etiket "1 L + 75 g".',
  'sf-ys-tursu-agirlik': 'Kesit görünüm: cam kavanozda dik dizilmiş salatalıklar, tamamen salamuranın altında; üstte tabak ve su dolu küçük kavanoz ağırlık olarak duruyor, ağız bezle örtülü.',
  'sf-ys-tursu-kuf-alma': 'Yakın plan: bir el kaşıkla turşu kabının yüzeyindeki beyaz zarı alıyor.',
  'sf-ys-yaprak-rulo': 'Yukarıdan: üst üste konmuş haşlanmış asma yaprakları iki elle sıkıca rulo yapılıyor; yanında hazır rulolar.',
  'sf-ys-yaprak-kavanoz': 'Kesit görünüm: kavanozda dik dizilmiş yaprak ruloları tamamen tuzlu suyun altında, üstte ağırlık.',
  'sf-ys-tuz-alma': 'Yandan: leğende tatlı suda bekletilen salamura yaprak ruloları ve biberler, bir el sürahiyle temiz su döküyor.',
  'sf-ys-zeytin-cizme': 'Yakın plan: tahtada yeşil zeytinler, bir el bıçakla zeytine çizik atıyor; çizilmiş zeytinler ve yanda taşla hafifçe kırılmış zeytinler.',
  'sf-ys-zeytin-su-degistirme': 'Yandan: kovadaki zeytinlerin eski suyu dökülüyor, yanında temiz su dolu sürahi; küçük takvim simgesi "her gün".',
  'sf-ys-zeytin-salamura': 'Kesit görünüm: sırlı küpte zeytinler tamamen tuzlu suyun altında, üstte tahta kapak ve taş ağırlık. Etiket "1 L + 120 g".',
  'sf-ys-zeytin-sele': 'Yandan: hasır sepette kaba tuzla karışık siyah zeytinler, sepetin altından koyu acı su tepsiye damlıyor.',

  // Sirke
  'sf-ys-sirke-uzum-ezme': 'Yakın plan: geniş ağızlı kavanozda üzümler, üstten tutulan tahta tokmakla eziliyor; aşağı ok.',
  'sf-ys-sirke-bez-ortu': 'Yakın plan: kavanozun ağzı sık bezle örtülmüş ve iple bağlanmış, yanda ipin düğümü.',
  'sf-ys-sirke-anasi': 'Kesit görünüm: kavanozdaki sıvının üstünde jöle gibi açık renkli kalın zar (sirke anası); turuncu ok zarı gösteriyor.',

  // Tarhana
  'sf-ys-tarhana-yogurma': 'Yukarıdan: büyük leğende ezilmiş domates-biber, yoğurt ve un; iki el hamuru yoğuruyor.',
  'sf-ys-tarhana-serme': 'Yukarıdan: güneşli avluda temiz beyaz bezlerin üstüne serpiştirilmiş küçük tarhana hamuru parçaları.',
  'sf-ys-tarhana-ovma': 'Yakın plan: biri avuç içi yukarı, diğeri üstünde iki el yarı kuru tarhanayı ovarak ufalıyor; zıt yönlü iki ok; ince taneler alttaki beze dökülüyor.',
  'sf-ys-tarhana-eleme': 'Yakın plan: iki el kalbur eleği tutuyor; elekte iri parçalar, ince tarhana alttaki bezdeki yığına dökülüyor.',

  // Süt
  'sf-ys-sagim-hijyen': 'Yandan: temiz giyimli bir kişi ineğin memesini temiz bezle siliyor, yanında kaynatılmış temiz kova; ilk sağımın ayrı küçük kaba sağıldığı görülüyor.',
  'sf-ys-sut-kaynatma': 'Yakın plan, önden: gaz ocağında kabarıp taşmaya gelen süt tenceresi, içinde tahta kaşık; bir el ocağın düğmesini çevirip ateşi kısıyor, turuncu ok çevirme yönünü gösteriyor.',
  'sf-ys-sut-termometre': 'Yakın plan: süt tenceresine daldırılmış termometre "63 °C" gösteriyor, yanında "30 dk" kum saati.',
  'sf-ys-sut-sogutma': 'Yandan: süt tenceresi soğuk su dolu leğene oturtulmuş, turuncu oklar ısının suya geçtiğini gösteriyor.',
  'sf-ys-yogurt-isitma': 'Yandan: ocakta kabarmaya başlayan süt tenceresi, yanında termometre "80 °C".',
  'sf-ys-yogurt-parmak-testi': 'Yakın plan: serçe parmak ılık sütün içinde, yanında "10 saniye" etiketi ve küçük termometre "40–45 °C".',
  'sf-ys-yogurt-maya': 'Yakın plan, yandan: kâsede ılık sütle açılan yoğurt mayası, bir el kaşıkla karıştırıyor; turuncu ok kâseden yandaki süt tenceresine gidiyor.',
  'sf-ys-yogurt-sarma': 'Yandan: kapağı kapalı yoğurt tenceresi kalın yün battaniyeye sarılmış (kapak üstten görünüyor, bir kenar üstüne katlanmış), sobanın yanında duruyor. Etiket "4–8 saat".',
  'sf-ys-suzme-tulbent': 'Yandan: tülbende konmuş yoğurt bir çubuğa asılmış, altta kaba damlayan sarımsı su.',
  'sf-ys-kurut-suzme': 'Yandan: sırığa asılı tülbent bohçasında koyulaşmış süzme yoğurt, altta kâseye sarımsı su damlıyor.',
  'sf-ys-kurut-top': 'Yakın plan: ıslak eller tuzlu süzmeden ceviz büyüklüğünde toplar yuvarlıyor, tepside dizili toplar.',
  'sf-ys-kurut-kurutma': 'Yandan: yerden yüksek tahta üstünde aralıklı dizilmiş beyaz kurut topları, üstü tülle örtülü, güneşli ve rüzgârlı dam.',
  'sf-ys-kurut-ezme': 'Yakın plan: ılık suda bekletilmiş kurut topu bir kâsede tahta tokmakla eziliyor.',
  'sf-ys-sirden': 'Yakın plan: tahtada kurutulmuş kuzu şirdeni parçaları ve tuzlu suyla dolu küçük kavanozda bekleyen şirden parçası.',
  'sf-ys-maya-katma': 'Yandan: ılık süt kazanına bir el kaşıkla sulandırılmış peynir mayası döküyor, diğer el karıştırıyor.',
  'sf-ys-kesim-testi': 'Yakın plan: bıçak pıhtıya sokulup kaldırılmış, pıhtı temiz biçimde yarılmış ve arasından yeşilimsi berrak peynir suyu görünüyor. Yeşil onay.',
  'sf-ys-pihti-kesme': 'Yukarıdan: kazandaki pıhtı uzun bıçakla dama tahtası gibi küplere kesilmiş.',
  'sf-ys-teleme-baski': 'Yandan: tülbente sarılı teleme iki tahta arasında, üstünde taş ağırlık; alttan peynir suyu süzülüyor.',
  'sf-ys-peynir-tuzlama': 'Yukarıdan: kalıplara kesilmiş beyaz peynirlerin yüzüne bir el kuru tuz serpiyor.',
  'sf-ys-peynir-teneke': 'Kesit görünüm: tenekede dizili beyaz peynir kalıpları tamamen salamuranın altında, üstte tabak ağırlık.',
  'sf-ys-peynir-masa': 'Yakın plan: üstten gelen elin tuttuğu temiz maşayla salamuradan peynir alınıyor; yanda elle alma küçük resimde kırmızı çarpılı.',
  'sf-ys-lor-kumeler': 'Yandan: tencerede ısınan peynir suyunun yüzeyinde beyaz yumuşak kümeler.',
  'sf-ys-lor-kepce': 'Yakın plan: delikli kepçe beyaz lor kümelerini alıp tülbent serilmiş süzgece koyuyor.',
  'sf-ys-cokelek-ayrisma': 'Yandan: tencerede ısıtılan ayranda beyaz pıhtı ve sarı-yeşil su ayrılmış.',
  'sf-ys-cokelek-suzme': 'Yandan: tülbentte asılı çökelek, altındaki kaba su damlıyor; yanında tuz kabı.',
  'sf-ys-yayik': 'Yandan: yere diz çökmüş kadın önündeki yatay tahta yayığı iki eliyle ileri geri çalkalıyor; iki yönlü turuncu oklar.',
  'sf-ys-tereyagi-yikama': 'Yakın plan: eller leğende soğuk suyla tereyağı topağını yoğuruyor, su bulanık; yanında berrak su ile ikinci leğen.',
  'sf-ys-sadeyag-eritme': 'Yandan: kısık ateşte kalın dipli tencerede köpürerek eriyen tereyağı.',
  'sf-ys-sadeyag-kivam': 'Yakın plan: tencerede berrak saman sarısı yağ, dipte açık kahverengi tortu, yüzeyde ince köpük. Yeşil onay.',
  'sf-ys-sadeyag-suzme': 'Yandan: ılımış sadeyağ tülbentli süzgeçten kuru cam kavanoza dökülüyor, tortu tülbentte kalıyor.',

  // Ekşi maya, ekmek, yufka
  'sf-ys-maya-karistirma': 'Yukarıdan: cam kavanozda un ve su kaşıkla karıştırılıyor, yanında terazide "50 g" un.',
  'sf-ys-maya-besleme': 'Yakın plan: cam kavanozda ekşi maya; bir kısmı oklarla yandaki kâseye alınıyor, un torbası ve su bardağından kavanoza ok. Etiket "50 + 50 + 50 g".',
  'sf-ys-maya-iki-kat': 'Önden: iki kavanoz; solda beslemeden hemen sonra, sağda 6–8 saat sonra kabarcıklarla iki katına çıkmış maya. Kavanozda lastik bantla işaretlenmiş ilk seviye.',
  'sf-ys-maya-bozuk': 'Yakın plan: üstünde pembe-turuncu çizgiler ve tüylü küf olan maya kavanozu, kırmızı çarpı.',
  'sf-ys-ekmek-hamur': 'Yukarıdan: leğende un, yanında su, tuz ve ekşi maya kapları; terazi.',
  'sf-ys-ekmek-yogurma': 'Yandan: bir kadın masadaki hamuru avuç içleriyle ileri iterek yoğuruyor; turuncu ok itme yönünü gösteriyor.',
  'sf-ys-parmak-testi': 'Yakın plan: parmak kabarmış hamura bastırıyor, çukur yavaşça geri doluyor. Yeşil onay.',
  'sf-ys-ekmek-vurma': 'Yandan: fırından çıkmış koyu kabuklu somunun altına parmakla vuruluyor, ses dalgası simgesi.',
  'sf-ys-bazlama-sac': 'Yandan: odun ateşi üstündeki sacda kabarmış bazlama, bir el tahta saplı spatulayla çeviriyor; turuncu ok çevirme yönü.',
  'sf-ys-yufka-acma': 'Yukarıdan: unlu tahtada uzun ince oklavayla açılan incecik yufka, kenarından ışık geçiyor.',
  'sf-ys-yufka-sac': 'Yukarıdan: altında ateş olan yuvarlak kızgın sac; iki el oklavayı tutuyor, oklavadan açılan yufka sacın üstüne seriliyor, turuncu ok yönü gösteriyor.',
  'sf-ys-lavas-tandir': 'Yandan kesit: toprak tandırın iç duvarına yapıştırılmış lavaşlar, dipte köz; bir kişi uzun maşayla birini alıyor.',
  'sf-ys-yufka-kurutma': 'Önden: gölgeli havadar odada iplere ya da temiz bezlere serilmiş kurumuş yufkalar.',
  'sf-ys-yufka-islatma': 'Yakın plan: el kuru yufkaya avuçla su serpiyor, yanında bezle örtülü yufka yığını.',

  // Bulgur, erişte, öğütme
  'sf-ys-bulgur-kaynatma': 'Yandan: odun ateşinde büyük kazanda kaynayan buğday; küçük resimde ikiye kesilmiş pişmiş tane, ortası beyaz değil.',
  'sf-ys-bulgur-serme': 'Yukarıdan: düz damda temiz bezler üstüne ince serilmiş haşlanmış buğday, bir kişi tahta tırmıkla karıştırıyor.',
  'sf-ys-tane-kirma-testi': 'Yakın plan: üstte diş simgesi ve aşağı ok; solda çıt diye ikiye kırılmış kuru buğday tanesi yeşil onaylı, sağda ezilip yassılaşmış nemli tane kırmızı çarpılı.',
  'sf-ys-dibek': 'Yandan: taş dibekte buğday, bir kişi ağır tahta tokmakla dövüyor.',
  'sf-ys-bulgur-eleme': 'Önden: iki farklı elek; birinde iri pilavlık bulgur, altta ince köftelik bulgur yığını.',
  'sf-ys-eriste-hamur': 'Yukarıdan: leğende un, kırılmış yumurtalar ve tuz; eller sert hamur yoğuruyor.',
  'sf-ys-eriste-kesme': 'Yukarıdan: üst üste konmuş yarı kuru yufkalar bıçakla ince şeritler halinde kesiliyor.',
  'sf-ys-eriste-kurutma': 'Yukarıdan: gölgede temiz bezlere ince serilmiş erişte şeritleri.',
  'sf-ys-eriste-kirma-testi': 'Yakın plan: bir el kuru erişte şeridini büküyor, şerit esnemeden kırılıyor. Yeşil onay.',
  'sf-ys-tahil-ayiklama': 'Yukarıdan: tepside yayılmış buğday, eller taşları ve kararmış taneleri ayırıyor.',
  'sf-ys-el-degirmeni': 'Yandan: iki yuvarlak taştan el değirmeni; üst taşın üst yüzüne dikilmiş tahta tutamak bir el tarafından çevriliyor, diğer el ortadaki delikten tane döküyor; kenardan un beze dökülüyor.',
  'sf-ys-surtme-tasi': 'Yandan: diz çökmüş bir kişi düz alt taş üzerinde elindeki yuvarlak taşla taneyi ileri geri ezerek öğütüyor.',
  'sf-ys-un-eleme': 'Yakın plan: iki el kâsenin üstünde eleği tutuyor; ince un kâseye dökülüyor, elekte iri parçalar kalıyor.',

  // Tahıl saklama, kiler
  'sf-ys-kup-varil': 'Önden: ağzına kadar dolu sırlı küp, contalı metal varil ve cam kavanoz yan yana, kapakları sıkı kapalı.',
  'sf-ys-bakliyat-kul': 'Yukarıdan: kapta nohut ve fasulyeye bir el avuçla temiz odun külü karıştırıyor.',
  'sf-ys-ambar-yuksek': 'Yandan: taş zemin üstünde tahta ızgara, üstünde duvardan ayrık duran çuvallar ve küpler. Etiket "40–50 cm".',
  'sf-ys-fare-yalitim': 'Yakın plan: ambar kapısının altına çakılmış metal şerit ve duvardaki deliği tel kafesli harçla kapatan el; köşede farenin geçtiği "0,5 cm" çatlak simgesi.',
  'sf-ys-kiler-kesit': 'Yandan kesit: evin kuzey tarafında yarı toprağa gömülü kiler, raflarda sandıklar, soğan örgüleri, kavanozlar.',
  'sf-ys-kiler-havalandirma': 'Yandan kesit: toprak altındaki kiler; raflarda kavanozlar ve sandıklar, asılı soğanlar. Alçakta giriş borusu (mavi ok: soğuk hava girer), tavanda çıkış bacası (kırmızı ok: sıcak hava çıkar).',
  'sf-ys-sogan-orgu': 'Önden: kuru yapraklarından örülmüş soğan ve sarımsak demetleri kiler duvarına asılı.',
  'sf-ys-toprak-yigini': 'Yandan kesit: patates yığını, üstünde saman katı, onun üstünde toprak katı; tepede samanla tıkalı hava bacası. Etiketler "saman", "toprak".',
  'sf-ys-kok-sebze-secim': 'Yukarıdan: tahtada sağlam havuç, pancar, şalgam; yanında yaralı, çürük bir havuç kırmızı çarpılı.',
  'sf-ys-yaprak-kesme': 'Yakın plan: bıçak havucun yapraklarını kökün biraz üstünden kesiyor; toprağı silkelenmiş, yıkanmamış havuç.',
  'sf-ys-kum-nem-testi': 'Yakın plan: avuçta sıkılan nemli kum biçim almış, su damlamıyor. Yeşil onay.',
  'sf-ys-kum-katman': 'Kesit görünüm: tahta sandıkta kum katları arasında birbirine değmeden dizilmiş havuç ve pancarlar.',

  // Buzhane
  'sf-ys-buzhane-yer': 'Önden: gölgeli yamaçta ağaçların gölgesindeki taş kubbeli buzhane girişi. Etiket "kuzey yamacı".',
  'sf-ys-buzhane-kesit': 'Yandan kesit: derin taş duvarlı çukur, dibi konik ve drenaj kanalı dışarı akıyor; içinde saman katları arasında buz blokları, üstte kalın çatı.',
  'sf-ys-buz-kesme': 'Yandan: kalın göl buzunda diz çökmüş bir kişi testereyle buz bloğu kesiyor; beline bağlı ipi kıyıda duran ikinci kişi tutuyor; kıyıda kızak.',
  'sf-ys-buz-saman-katman': 'Yakın plan kesit: buz blokları sıkı istiflenmiş, aralarında ve üstünde kalın saman tabakası.',

  // Bal
  'sf-ys-bal-kavanoz': 'Önden: serin karanlık rafta ağzı sıkı kapalı cam bal kavanozları.',
  'sf-ys-bal-kuru-kasik': 'Yakın plan: kuru kaşıkla bal alınıyor yeşil onaylı; yanında ıslak kaşık kırmızı çarpılı.',
  'sf-ys-bal-kristal': 'Önden: iki kavanoz; biri akışkan altın sarısı bal, diğeri donuk beyazımsı kristalleşmiş bal; ikisinde de yeşil onay.',
  'sf-ys-bal-benmari': 'Yandan: kapağı açık bal kavanozu ılık su dolu tencerede duruyor, bir el suya dokunuyor; ateş yok.',

  // Tuz
  'sf-ys-deniz-suyu-alma': 'Yandan: temiz kayalık kıyıda bir kişi bidonla berrak deniz suyu dolduruyor; uzakta liman ve fabrika bacası kırmızı çarpılı.',
  'sf-ys-tuz-suzme': 'Yandan: deniz suyu sık dokulu bezden geniş kaba süzülüyor.',
  'sf-ys-tuz-kaynatma': 'Yandan: odun ateşi üstünde geniş sığ tepside kaynayan deniz suyu, kenarlarda beyaz kristaller.',
  'sf-ys-tuz-kristal': 'Yakın plan, yandan: kısık odun ateşi üstünde geniş sığ tepside beyaz tuz kristal yığını ve dipte kalan ince su katı. Turuncu ok kalan sıvıyı gösteriyor, etiket "1 parmak".',
  'sf-ys-tuz-ayirma': 'Yandan: sırıkta asılı tülbent bohçasında tuz kristalleri; alttaki kaba acı su damlıyor, kap kırmızı çarpılı.',
};
