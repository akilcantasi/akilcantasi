// Sel, heyelan ve tsunami kategorisinin çizimleri. Üslup: ayrıntılı düz renkli çizim (Kızılay/AFAD broşürü gibi), 4:3.
export const SPEC: Record<string, string> = {
  // sel
  'sel-yuksege-cik': 'Yandan bina kesiti: zemin kat sel suyuyla dolmaya başlamış; aile merdivenden üst kata çıkıyor, yukarı yönlü yeşil ok. Pencereden dışarıda yükselen kahverengi su.',
  'sel-akan-su-yasak': 'Dış mekân, yandan: sokakta hızla akan çamurlu su (akıntı çizgileri); suya yürüyerek giren kişinin dizine kadar su, üstünde kırmızı yasak. Su derinliğinde "15 cm" etiketi.',
  'sel-arac-yasak': 'Yandan görünüş: su basmış alt geçidin önünde duran araba ve "geri dön" anlamında kavisli turuncu ok; suya girmiş ve akıntıyla yan yatmış ikinci araba kırmızı yasakla. Su derinliğinde "30 cm" etiketi.',
  'sel-cati-isaret': 'Dışarıdan görünüş: etrafı su basmış tek katlı evin çatısında kişi açık renkli bir bezi sallıyor ve düdük çalıyor; uzaktan bir kurtarma botu yaklaşıyor.',
  'sel-elektrik-teli': 'Sokak: kopup sel suyuna düşmüş elektrik teli, suyun üstünde şimşek simgesi ve kırmızı uyarı üçgeni; kişi geri çekilip uzaktan dolaşıyor (yeşil ok).',
  // heyelan
  'sel-heyelan-isaretler': 'Yamaç ve ev, yandan: toprakta yeni çatlaklar, eğilmiş ağaç ve direk, yamaç dibinde kabaran toprak, evin duvarında çatlak; her işaretin yanında küçük sarı uyarı üçgeni. Yamaçtan ses dalgası.',
  'sel-heyelan-yana-kac': 'Yukarıdan-yandan görünüş: yamaçtan aşağı kayan toprak ve kaya dili; kişi kayma yolunun dışına yana doğru koşuyor (yeşil ok), aşağı doğru koşan figür kırmızı yasakla.',
  'sel-heyelan-top-ol': 'Yandan yakın plan: kişi yerde dizlerini karnına çekmiş top gibi kıvrılmış, iki koluyla başını ve ensesini sarmış; arka planda düşen taşlar ve çamur.',
  'sel-camur-top-ol': 'sel-heyelan-top-ol ile aynı sahne, sel-camur-akisi rehberinin kişisiyle (siyah atkuyruklu kadın): yerde top gibi kıvrılmış, iki koluyla başını ve ensesini sarmış.',
  // sel-tsunami
  'sel-tsunami-kiyidan-uzaklas': 'Sahil, geniş açı: insanlar plajdan ve sahil yolundan iç kesime, tepeye doğru yürüyor; arkada sakin görünen deniz, ön planda yeşil "tsunami tahliye yolu" tabelası (dalga ve yokuş simgesi, yazısız).',
  'sel-tsunami-deniz-cekiliyor': 'Kıyı, yandan: deniz alışılmadık şekilde geri çekilmiş, kumda çırpınan balıklar ve açıkta kalmış kayalar; ufukta yükselen dalga çizgisi. Kıyıya inen figür kırmızı yasakla, tepeye koşan figür yeşil okla.',
  'sel-tsunami-yokus': 'Yandan arazi kesiti: kıyıda alçak yerleşim, ileride yüksek tepe; aile yürüyerek tepeye çıkıyor (yukarı yeşil ok), kıyı yolunda tıkanmış araçlar.',
  'sel-tsunami-bina-ust-kat': 'Kesit: kıyıdaki çok katlı betonarme bina; insanlar merdivenden üst katlara çıkıyor, üst katlarda yeşil onay; zemin kat hizasında gelen dalga.',
  'sel-tsunami-donme': 'Sahil: dalga geri çekilmiş, enkazla dolu kıyı; kıyıya geri yürüyen kişi kırmızı yasakla, tepedeki insanlar bekliyor. Arkada ikinci bir dalga çizgisi.',
  // sel-akintiya-kapilma
  'sel-akinti-sirtustu': 'Yandan görünüş: kahverengi akan suda kişi sırtüstü süzülüyor, kolları yana açık, yüzü yukarıda; sakin nefes çizgileri. Akıntı yönünde dalgalı oklar.',
  'sel-akinti-ayaklar-onde': 'Yukarıdan görünüş: akıntıda sırtüstü kişi, ayakları akıntı yönünde önde ve yüzeye yakın; ilerideki bir kayaya ayaklarıyla dokunup itiyor. Akış okları.',
  'sel-akinti-capraz': 'Yukarıdan dere görünüşü, akıntı yönü mavi oklarla: kişi sırtüstü, AYAKLARI ÖNDE ve akıntı yönünde (başı akıntının geldiği tarafta); gövdesi kıyıya doğru açılı, kıyıya çapraz (yaklaşık 45 derece) yeşil kesikli ilerleme çizgisi. Ayrı küçük çerçevede akıntıya karşı dik yüzen figür kırmızı yasakla.',
  'sel-akinti-ayaga-kalkma': 'Su altı kesiti, yandan: akan suda ayağa kalkmaya çalışan kişinin ayağı taşlar arasına sıkışmış, kırmızı yasak; yanında sığ, sakin kıyı suyunda ayağa kalkan kişi yeşil onayla.',
  'sel-akinti-ip-at': 'Dere kıyısı: kurtarıcı kıyıda sağlam durup akıntıdaki kişiye ip atıyor, yanında biri telefonla 112 arıyor; suya atlayan figür küçük çerçevede kırmızı yasakla.',
  // sel-sonrasi-temizlik
  'sel-sonrasi-dis-kontrol': 'Dış mekân: çamur izli evin önünde kişi binayı dışarıdan inceliyor; duvarda çatlak, sarkan kablo ve burnuna el götürerek gaz kokusu kontrol eden kişi. Kapıya giden yol kesikli çizgiyle.',
  'sel-sonrasi-koruyucu': 'Önden görünüş: temizlik yapan kişi lastik çizme, kalın lastik eldiven, koruyucu gözlük ve N95 maske takmış, elinde kürek; her ekipmanda küçük yeşil onay.',
  'sel-sonrasi-gida-at': 'Mutfak: çamurlu dolaptan çıkarılan paketli gıdalar ve şişmiş, ezik konserveler çöp torbasına atılıyor; atılan ürünlerin üstünde kırmızı çarpı.',
  'sel-sonrasi-camasir-suyu': 'Yakın plan: lastik eldivenli bir el kova içine bir su bardağı çamaşır suyu döküyor, kovada "4 L" etiketi; arkada açık pencere. Köşede amonyak şişesi ile çamaşır suyu şişesi yan yana kırmızı yasakla.',
  // sel-camur-akisi
  'sel-camur-dere-yatagi': 'Vadi tabanı, yandan: dere yatağında kurulu çadır ve park etmiş araba kırmızı yasakla; aile yağmur altında yamaç yolundan yükseğe çıkıyor (yeşil ok). Gökyüzünde yoğun yağmur.',
  'sel-camur-dere-bulanik': 'Yakın plan: berrak dere suyu birden kahverengi çamura dönüyor (sol berrak, sağ bulanık), suyla birlikte dal ve taşlar. Kıyıdaki kişi dereye dik açıyla, dereden uzağa ve yokuş yukarı yürüyor; dere boyunca paralel yürümüyor. Uzaklaşma yönünde turuncu ok.',
  'sel-camur-yana-kac': 'Yukarıdan görünüş: vadiden aşağı inen çamur ve kaya akıntısı; kişi akış yolundan yana, yüksek ve düz bir alana kaçıyor (yeşil ok), akışın önünde vadi aşağı koşan figür kırmızı yasakla.',
  'sel-camur-ust-kat': 'Ev kesiti: zemin kata çamur doluyor; aile üst katta, çamurun geldiği yamaca bakmayan odada. Yukarı yönlü yeşil ok merdivende.',
  // sel-arac
  'sel-arac-tavan': 'Yandan görünüş: hızlı akan suda kısmen batmış araba; sürücü açık yan camdan çıkıp aracın tavanına tırmanıyor, tavanda diz çökmüş diğer yolcu elini uzatıyor. Yukarı turuncu ok.',
  'sel-arac-kemer': 'Araç içi yakın plan: su göğüs altına kadar yükselmiş; sürücü kendi eliyle emniyet kemerinin tokasına basıp kemeri çözüyor, tokanın etrafında turuncu vurgu halkası.',
  'sel-arac-cam': 'Araç içi, yandan: dışarıdaki su kapı hizasında, camın alt kenarının altında; yan cam tümüyle suyun üstünde. Sürücü yan camı açmak için düğmeye basıyor, küçük çerçevede cam kırma çekici yan camın köşesine vuruyor. Camın üstünde camın indiğini gösteren aşağı turuncu ok, kapı kolu kırmızı yasakla.',
  // sel-uyarisi
  'sel-uyari-radyo': 'Ev içi: masada pilli radyo ve telefon; telefon ekranında turuncu-kırmızı uyarı simgesi ve yağmur bulutu (yazısız). Pencereden şiddetli yağmur görülüyor.',
  'sel-uyari-bodrum-cik': 'Bina kesiti: bodrum kat dairesinden aile çantalarıyla merdivenden yukarı ve dışarı çıkıyor; yakındaki dere yatağında su yükseliyor. Yukarı yeşil ok.',
  'sel-uyari-belge-poset': 'Yakın plan: eller kimlik kartı, belgeler ve ilaç kutusunu kilitli şeffaf su geçirmez poşete koyuyor; yanında hazır afet çantası.',
  'sel-sonrasi-el-yika': 'wash-hands sahnesinin sel-sonrasi-temizlik rehberine özel kopyası: musluk altında sabunla yıkanan iki el; ten ve kol rengi rehberin kişisiyle aynı.',
  'sel-uyari-esya-yukari': 'Oda içi: kişi televizyonu ve belge kutusunu yüksek rafa kaldırıyor; yerdeki halı rulo yapılmış, duvarda olası su seviyesini gösteren kesikli mavi çizgi.',
};
