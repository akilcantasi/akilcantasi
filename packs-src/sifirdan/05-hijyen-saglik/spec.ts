// Sıfırdan: Hijyen ve sağlık — çizim açıklamaları (detaylı düz illüstrasyon, 4:3)
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  'sf-hs-tuvalet-kapak': 'Yandan geniş plan: solda yükseltide taş kuyu, ortada tahta tuvalet kulübesi, yanında direkli bidonlu el yıkama yeri. Kuyu ile tuvalet arasında turuncu çift yönlü ok ve "30 m".',
  'sf-hs-temizlik-kapak': 'Güneşli avlu: ipte kuruyan bezler ve giysiler, önde köpüklü çamaşır leğeni ve üst üste kalıp sabunlar.',
  'sf-hs-bakim-kapak': 'İç mekân, yandan: yer yatağında yastıklara yaslanmış hasta adam; diz çökmüş bakıcı kadın bardakla su içiriyor. Pencere açık, duvarda ateş çizelgesi kâğıdı.',

  // Çukur tuvalet
  'sf-hs-tuvalet-yer': 'Eğimli arazi, yandan: yokuşun üstünde taş kuyu, aşağıda tuvalet kulübesi; aralarında turuncu çift yönlü ok ve "30 m", kulübenin yanında yeşil onay.',
  'sf-hs-tuvalet-kesit': 'Toprak kesiti: dikdörtgen çukur, ağızdan aşağı taş örgü; çukurun ağzında yatay genişlik oku "1,5 m", yanında derinlik oku "2 m+"; altta mavi yeraltı suyu. Solda kazılmış toprak yığını.',
  'sf-hs-tuvalet-zemin': 'Yakın kesit: çukurun ağzına yan yana dizilmiş kütükler (uçtan görünüş), üstünde sıkıştırılmış toprak kat ve tahta kapak. Zeminin yerden yüksekliği ölçü okuyla "15 cm"; yağmur damlaları ve zeminden dışarı akan mavi oklar.',

  // Kompost tuvalet
  'sf-hs-kompost-iki-hazne': 'Yandan kesit: toprak üstünde iki bölmeli taş hazne; sol bölme kül katlı dışkıyla dolu, üstündeki delik taş kapakla kapalı ve asma kilit simgeli; sağ bölme kullanımda, üstünde oturak kutusu. Sağda çatıdan çıkan havalandırma borusu, arkada kulübe duvarı.',
  'sf-hs-kompost-idrar': 'Oturak kesiti: önde sarı huni, hortumla dışarıdaki bidona gidiyor (sarı oklar); arkada ayrı dışkı deliği aşağıdaki hazneye iniyor (turuncu ok aşağı).',
  'sf-hs-kompost-agac': 'Bahçe: dibine koyu kompost serilmiş meyve ağacı ve yeşil onay; sağda marul ve havuç tarhı kırmızı yasak işaretli.',

  // Kireç
  'sf-hs-kirec-tanima': 'Yan yana iki kova: solda taş gibi parça parça sönmemiş kireç, üstünde kırmızı sıcaklık çizgileri ve kırmızı çarpı; sağda yumuşak hamur hâlinde söndürülmüş kireç ve yeşil onay.',
  'sf-hs-kirec-sondurme': 'Açık havada yandan: gözlüklü, eldivenli, ağzı bezli adam su dolu metal kaba kürekle kireç ekliyor; kaptan buhar yükseliyor, turuncu ok kirecin suya gittiğini gösteriyor. Köşede kireç yığınına kovadan su dökülen küçük resim kırmızı yasak işaretli.',
  'sf-hs-kirec-kova': 'Yakın plan: kireç bulamaçlı açık kova, eldivenli el uzun sopayla karıştırıyor, turuncu karıştırma oku; yanda kireç torbası ve saat simgesiyle "2 saat".',

  // Çöp
  'sf-hs-cop-ayirma': 'Önden dört kap: yeşil kovada yiyecek artığı ve kabuklar; tahta kasada cam kavanoz, teneke ve ip; gri kovada kalan çöp; kırmızı kovada pil ve ilaç.',
  'sf-hs-cop-ortme': 'Çöp çukuru kesiti: çöp ve ince toprak katmanları üst üste; kürek en üste toprak döküyor; "10 cm" etiketi ve ok, üstteki toprak katının kalınlığını gösteren turuncu köşeli parantezi işaret ediyor. Sağda toprak yığını.',
  'sf-hs-cop-yakma-yasak': 'Yere yatık bir lastiğin içinde ateş yanıyor, önünde plastik şişe ve kablo; kara duman yükseliyor; üstünde büyük kırmızı yasak işareti.',

  // Sinek ve kemirgen
  'sf-hs-sinek-kapan': 'Daldan iple asılı şeffaf şişe kapan: üst kısmı ters çevrilip huni gibi geçirilmiş, dipte meyve parçaları ve sıvı; sinekler turuncu oklarla huniden içeri giriyor, ikisi içeride.',
  'sf-hs-fare-depo': 'Kiler duvarı: raflarda teneke, kapaklı cam kavanozlar ve kapaklı kova, yeşil onay; yerde ağzı açık dökülmüş çuval ve fare kırmızı yasak işaretli.',
  'sf-hs-fare-temizlik': 'İki bölüm: solda fare pisliğini kuru süpürgeyle süpürüp toz kaldırmak kırmızı yasak işaretli; sağda eldivenli el pisliğin üstüne sprey şişeyle sıvı püskürtüyor, yanda ıslak bez, yeşil onay.',

  // El yıkama yeri
  'sf-hs-elyikama-bidon': 'Yakın plan: bidonun kapağının altına, yan yüzüne, bir el kızdırılmış çiviyle delik açıyor; kapaktan deliğe ölçü oku ve "12 cm".',
  'sf-hs-elyikama-pedal': 'Tam düzenek: iki çatallı direk, üstte yatay çubuğa asılı bidon, kapağından yerdeki pedal çubuğuna inen ip. Pedalın kalkık ucunda aşağı basma oku, yerden yüksekliği "15 cm".',
  'sf-hs-elyikama-kullanim': 'Yakın plan: eğilmiş bidondan ince su akıyor, altında köpüklü eller birbirini ovuyor; saat simgesi ve "20 sn".',

  // Kül suyu
  'sf-hs-kul-secim': 'İki bölüm: solda açık gri temiz odun külü ve kütük, yeşil onay; sağda plastik, boyalı tahta parçalı kara kül, kırmızı çarpı.',
  'sf-hs-kul-fici': 'Kesit: taşların üstüne yükseltilmiş tahta fıçı; dipte çakıl, üstünde saman, onun üstünde kül; dipteki musluğun altında kahverengi sıvı toplanan cam kap.',
  'sf-hs-kul-yumurta': 'İki cam kap kahverengi kül suyu: solda tepesi sıvının üstünde yüzen yumurta ve yeşil onay; sağda dibe batmış yumurta, kabın altında alev (kaynatarak koyulaştır).',

  // Sabun
  'sf-hs-sabun-kazan': 'Açık ateşte demir kazan, yandan: gözlüklü, eldivenli adam uzun tahta kaşıkla karıştırıyor; turuncu karıştırma oku.',
  'sf-hs-sabun-test': 'Üç tabak: solda saydam, sıkı sabun ve yeşil onay; ortada ufalanmış beyaz parçalar ve üstünde "+" ile sarı yağ damlası; sağda ipliksi yapışkan sabun ve "+" ile kahverengi kül suyu damlası.',
  'sf-hs-sabun-kalip': 'Tahta kalıpta sertleşmiş sabun, bir el bıçakla kalıplara kesiyor; üstte rafta kurumaya dizilmiş sabunlar.',

  // Çamaşır
  'sf-hs-camasir-ayirma': 'Duvar dibinde iki leğen: soldaki kırmızı leğende lekeli bezler, üstünde kırmızı ünlem; sağdaki mavi leğende gündelik giysiler.',
  'sf-hs-camasir-kazan': 'Açık ateşte kazanda kaynayan bezler; başörtülü kadın uzun sopayla karıştırıyor; "55 °C+" etiketi.',
  'sf-hs-camasir-gunes': 'Güneşli avlu: iple gerilmiş ipte asılı bezler ve giysiler. Köşede gölgede tıkıştırılmış nemli bez küçük resimde kırmızı yasak işaretli.',

  // Bit, pire, uyuz
  'sf-hs-bit-sirke': 'Büyüteç içinde siyah saç telleri ve saç diplerine yapışmış beyaz sirkeler, bir bit.',
  'sf-hs-bit-tarama': 'İç mekân, yandan: sandalyede oturan uzun saçlı kızın saçını arkasında duran annesi sık dişli tarakla tarıyor; turuncu ok kökten uca, aşağı.',
  'sf-hs-uyuz-yerler': 'Solda önden duran aynı kız: bileklerde, ellerde, dirseklerde ve belde kırmızı noktalar. Sağda büyütülmüş el: parmak aralarında kırmızı kabarcıklar ve ince tünel çizgisi, turuncu halka içinde.',

  // Diş
  'sf-hs-dis-misvak-cigneme': 'Yakın plan: misvak çubuğunun ucunda kabuğu soyulmuş açık renkli kısım, en uçta lif lif açılmış fırça; soyulan kısmın üstünde ölçü oku ve "1 cm".',
  'sf-hs-dis-misvak-firca': 'Diş şeması: üstte diş eti, aşağı sarkan büyük bir ön diş; misvağın lifleri dişe dik değiyor; turuncu ok diş etinden dişin ucuna, aşağı. Yeşil onay.',
  'sf-hs-dis-bez': 'Yakın plan: üst diş sırası; işaret parmağına sarılmış beyaz bez bir dişi siliyor.',

  // Kadın hijyeni
  'sf-hs-ped-dikis': 'Yakın plan: mor pamuklu bezden kanatlı ped, kenarında kesikli dikiş çizgisi, kanatlarda çıtçıt; bir el iğne ve iplikle dikiyor.',
  'sf-hs-ped-islatma': 'Yakın plan: temiz su dolu leğende ıslanan iki ped; yanda ikinci küçük leğen ve sabun.',
  'sf-hs-ped-gunes': 'Hasır perdelerle çevrili güneşli köşede ipte asılı pedler. Köşede başka giysinin altına gizlenmiş ped küçük resimde kırmızı yasak işaretli.',

  // Bebek bezi
  'sf-hs-bez-katlama': 'Şema: solda köşegeni kesikli çizgiyle gösterilmiş kare pamuklu bez, turuncu ok, sağda üçgen katlanmış bez.',
  'sf-hs-bez-kova': 'İç mekân: kapaklı bez kovası duvardaki yüksek rafta, yeşil onay; aşağıda yerde emekleyen bebek kovaya ulaşamıyor.',
  'sf-hs-bez-kazan': 'Açık ateşte kazanda kaynayan beyaz bezler ve karıştırma sopası; yanda durulama leğeni.',

  // Yara bakımı
  'sf-hs-yara-tuzlu-su': 'Yakın plan: ateşte kaynayan tencere ("1 L"), bir el çay kaşığıyla tuz ekliyor; yanda kapaklı tuz kabı ve "9 g".',
  'sf-hs-yara-yikama': 'Yakın plan: paçası sıvanmış bacakta kaval kemiği üstünde yara; bir el bardaktan tuzlu suyu yaranın üstüne döküyor, su aşağıdaki leğene akıyor; turuncu ok akış yönü.',
  'sf-hs-yara-sarma': 'Aynı bacak: yaranın üstü temiz bezle çapraz sarılmış, ayak ve parmaklar açıkta; yeşil onay.',

  // Enfeksiyon
  'sf-hs-enf-yerel': 'Yakın plan: ön kolda kızarık, şiş yara çevresi, ortasında sarı irin; üstünde kırmızı sıcaklık çizgileri, köşede kırmızı uyarı üçgeni.',
  'sf-hs-enf-sinir-cizme': 'Yakın plan: bir el kalemle ön koldaki kızarıklığın sınırını kesikli çizgiyle çiziyor; "14:00" etiketi. Ek karede kızarıklık çizginin dışına taşmış, turuncu ok taşan kısmı gösteriyor.',
  'sf-hs-enf-nabiz': 'Yakın plan: avucu yukarı dönük bilekte, başparmak tarafında yardımcının bitişik parmakları nabız yokluyor; saat simgesi ve "30 sn".',

  // Ateşli hasta
  'sf-hs-ates-sivi': 'İç mekân, yandan: açık pencere; yer yatağında yastıklara yaslanmış hasta adam, diz çökmüş bakıcı kadın bardakla su içiriyor.',
  'sf-hs-ates-ince-ortu': 'İki bölüm: solda tek ince örtüyle yatan aynı hasta ve yeşil onay; sağda kalın yorganlar altında terleyen hasta ve kırmızı çarpı.',
  'sf-hs-ates-cizelge': 'Duvara iliştirilmiş çizelge kâğıdı: sütun başlarında termometre ve damla simgeleri, satırlarda yazılar; bir el kalemle yazıyor. Yanda termometre.',

  // Sıvı kaybı / ORS
  'sf-hs-ors-hazirlama': 'Yakın plan: "1 L" sürahide su; ortada şeker kabı ve altında 6 silme çay kaşığı şeker ("6"); sağda tuz kabı ve yarım çay kaşığı tuz ("½").',
  'sf-hs-ors-cimdik': 'Yakın plan: çocuğun karın derisi iki parmakla çimdiklenip kaldırılmış; saat simgesi ve "2 sn+".',
  'sf-hs-ors-kasik': 'İç mekân, yandan: başörtülü anne diz çökmüş, yerde oturan oğluna kaşıkla ORS veriyor; öteki elinde bardak.',

  // Atel ve değnek
  'sf-hs-atel-baglama': 'Yakın plan: ön kolun iki yanında dolgulu tahta atel, kırık yerinin (kırmızı zikzak) üstünden ve altından iki bez bağla bağlanmış; parmaklar açıkta, yeşil onay.',
  'sf-hs-atel-kontrol': 'İki parmak ucu: solda bir parmak tırnağa bastırıyor, tırnak beyaz; turuncu ok; sağda tırnak yeniden pembe; saat simgesi ve "2 sn".',
  'sf-hs-degnek-olcu': 'Önden, belden yukarı yakın plan: adamın koltuk altında çatallı dal değnek; çatalın üstü koltuk altının biraz altında, aradaki boşluk iki turuncu çizgi ve "5 cm" ile gösterilmiş; el, kalça hizasındaki tutamağı tutuyor.',

  // Sedye
  'sf-hs-sedye-battaniye': 'Yukarıdan, numaralı (1-2-3) üç aşama: battaniye ve üçte bir hizasında sırık, katlama oku; katlanmış kat, ikinci sırık ve ters yönde katlama oku; iki sırık arasında katlanmış bitmiş sedye ve yeşil onay.',
  'sf-hs-sedye-ceket': 'Yukarıdan: önü ilikli üç ceket arka arkaya dizilmiş, iki sırık kolların içinden geçiyor.',
  'sf-hs-sedye-yokus': 'Yokuş, yandan: iki kişi sedyeyi yokuş yukarı taşıyor, battaniyeyle örtülü hastanın başı yukarı tarafta; turuncu ok yokuş yukarı.',

  // Yatalak hasta
  'sf-hs-yatak-baski-noktalari': 'Yandan: döşekte sırt üstü yatan yaşlı kadın; başın arkası, kürek kemiği, dirsek, kuyruk sokumu ve topukta kırmızı noktalar.',
  'sf-hs-yatak-topuk': 'Yakın plan: döşekte yatan hastanın baldırının altında yastık, topuk döşeğe değmiyor; turuncu ok topuk ile döşek arasındaki boşluğu gösteriyor, yeşil onay.',
  'sf-hs-yatak-besleme': 'Yandan: yastıklarla sırtı dik oturtulmuş yaşlı kadın; yanında diz çökmüş bakıcı adam elinde kâse, kaşıkla yemek veriyor.',

  // Gebelik ve doğum
  'sf-hs-gebe-beslenme': 'İç mekân: karnı belirgin gebe kadın masada oturmuş çorba içiyor; masada yumurta, yeşillik ve su sürahisi.',
  'sf-hs-dogum-seti': 'Yukarıdan açık kutu: katlanmış naylon örtü, kaynatılmış bezler, havlu, sabun, kâğıtta yeni jilet, iki parça kalın ip, bebek başlığı ve battaniyesi.',
  'sf-hs-dogum-ten-tene': 'Yandan: yatakta yarı oturan annenin göğsünde başlıklı yenidoğan; ikisinin üstü battaniyeyle örtülü, yalnız bebeğin başı görünüyor; anne bebeği tutuyor.',

  // Karantina
  'sf-hs-karantina-plan': 'Yandan, üç bölge: solda kırmızı zeminli, kırmızı çatılı hasta evi; ortada sarı zeminli temaslı çadırı; sağda yeşil zeminli, yeşil çatılı sağlıklı ev. Bölgeler kesikli çizgiyle ayrılmış, sınırlarda el yıkama düzenekleri.',
  'sf-hs-karantina-oda': 'İç mekân: açık pencerenin altında yatakta yatan hasta adam; kapı kapalı.',
  'sf-hs-karantina-bakici': 'Önden: ağzı ve burnu bezle kapalı, eldivenli bakıcı kadın kapalı kapının yanında duruyor; yanında el yıkama düzeneği.',

  // Ölüm ve defin
  'sf-hs-defin-kayit': 'Yakın plan: açık defterde sütunlar ve satırlar; bir el yazıyor; yanda ağzı bağlı bez torba ve "12" numaralı etiket.',
  'sf-hs-defin-yer': 'Eğimli arazi, yandan: yokuşun üstünde taş kuyu, aşağıda yan yana tekil mezarlar ve sade mezar taşları; aralarında turuncu çift yönlü ok ve "200 m+".',
  'sf-hs-defin-derinlik': 'Toprak kesiti: mezar çukurunun dibinde ayrıntısız beyaz kefen, üstü toprakla dolu ve tümsekli; derinlikte ölçü oku ve "1,5 m"; dip ile mavi yeraltı suyu arasında ölçü oku ve "2 m+".',
};
