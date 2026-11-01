// Çizim şartnamesi: Bebek, yaşlı ve özel ihtiyaç (ozel-gruplar)
export const SPEC: Record<string, string> = {
  // Bebek bakımı
  'ozel-gruplar-bebek-kanguru': 'Önden görünüş: sırt çantalı bir anne, göğsünde kumaş kanguruda yüzü annesine dönük bebek taşıyor; bebeğin yüzü açık, başı annenin göğsünde. Arka planda çadır kent. Kanguruya yeşil onay işareti.',
  'ozel-gruplar-bebek-bere': 'Yakın plan yandan: anne, bereli bebeğini göğsünün önünde dik tutuyor (bebek yüzü dışarı bakıyor, anne bir eliyle poposunu, öbür eliyle sırtını destekliyor). Bebeğin başındaki örgü bereye turuncu ok.',
  'ozel-gruplar-bebek-ense-kontrol': 'Yakın plan yandan: anne, göğsünün önünde dik tuttuğu bebeğin ensesine ön elinin parmaklarıyla dokunuyor (kol bebeğin üstünden geçmiyor). Köşede iki küçük simge: ter damlası yanında "−1 kat", kar tanesi yanında "+1 kat".',
  'ozel-gruplar-bebek-saglik-git': 'Yandan görünüş: endişeli anne, bereli bebeğini göğsünde dik tutarak yürüyor; önünde hilalli beyaz sağlık çadırı ve ona doğru turuncu ok.',
  'ozel-gruplar-bebek-sirtustu-uyku': 'Yukarıdan görünüş: bebek düz, sert bir yatak/minder üzerinde sırtüstü uyuyor, yüzü açık, üzeri göğüs hizasına kadar ince battaniyeyle örtülü. Yanında yastık ve kabarık yorgan yok; köşede kırmızı yasak işaretli yastık simgesi ve bebeğe yeşil onay.',
  // Beslenme
  'ozel-gruplar-emzirme': 'Önden görünüş: çadırda bir minderde oturan anne bebeği emziriyor; örtü yalnızca annenin omzunda, bebeğin başı ve yüzü açık. Bebeğin ağzı memeye doğru tutuşla yerleşmiş, karnı annenin karnına dönük. Yanında su şişesi. Sıcak, sakin renkler.',
  'ozel-gruplar-mama-olcu': 'Yakın plan masa üstü: kapağı açık toz mama kutusu, eldeki ölçek kaşığı düz bir bıçak sırtıyla sıyrılıyor; yanında şişe su ve temiz boş bardak (biberon YOK). Ölçeğe turuncu ok. Köşede iki küçük ölçek: silme düz dolu ölçek yeşil onay, tepeleme ölçek kırmızı çarpı.',
  'ozel-gruplar-bardakla-besleme': 'Yandan görünüş: aynı anne sandalyede, kucağında dik oturan bebeğe küçük temiz bir bardağı alt dudağına değdirerek tutuyor; bardak hafif eğik. Bardağa yeşil onay; köşede üstü kırmızı yasakla çizili biberon (biberon yerine bardak).',
  // Hamile
  'ozel-gruplar-hamile-bildir': 'Önden görünüş: karnı belirgin hamile kadın, çadır kentte yeleği üzerinde kırmızı hilal olan sağlık görevlisiyle konuşuyor, eli karnında. Görevli not alıyor.',
  'ozel-gruplar-hamile-bebek-hareket': 'Yakın plan: oturan hamile kadının iki eli karnının üzerinde, dikkatle hissediyor; karnın üstünde küçük hareket dalgası simgesi ve soru işareti. Yanında sağlık çadırına doğru turuncu ok.',
  'ozel-gruplar-hamile-su': 'Yandan görünüş: gölgede bir sandalyede oturan hamile kadın şişeden su içiyor; yanında birkaç dolu su şişesi. Şişeye yeşil onay.',
  'ozel-gruplar-hamile-belgeler': 'Yakın plan: eller şeffaf, ağzı kilitli su geçirmez poşete gebelik kartı, ultrason fotoğrafı ve tahlil kağıtlarını koyuyor. Poşete turuncu ok.',
  // Acil doğum
  'ozel-gruplar-dogum-hazirlik': 'Yukarıdan görünüş: yere serili temiz çarşaf, yanında katlanmış temiz havlular, battaniye, tek kullanımlık eldiven ve su şişesi düzenli şekilde. Yeşil onay.',
  'ozel-gruplar-dogum-bas-destek': 'Yandan, saygılı ve örtülü sahne: yarı oturur pozisyonda, dizleri bükük, beli örtüyle örtülü anne. Örtünün altından bebeğin başı çıkmış görünüyor; diz çökmüş eldivenli yardımcının açık avucu başı alttan hafifçe destekliyor. Ellerin yanında net bir "çekme" yasağı simgesi: bebeği dışa çeken el oku, üstü kırmızı çizili.',
  'ozel-gruplar-dogum-kurulama': 'Yakın plan önden: yeni doğmuş bebek annenin göğsünde yüzüstü; yardımcının sağ kenardan gelen tek eli kuru sarı havluyla bebeğin sırtını kuruluyor (ovma oku). Solda bir kenara bırakılmış ıslak havlu. Annenin alt gövdesi battaniyeyle örtülü.',
  'ozel-gruplar-ten-tene': 'Önden görünüş: yarı oturur anne (omuzları açık, göğsü ve bebeğin gövdesi battaniyenin altında), bebek yüzüstü annenin göğsünde, yüzü yana dönük ve açık, başında bere. Sıcaklık simgesi, yeşil onay. Çıplaklık görünmüyor.',
  'ozel-gruplar-dogum-kordon-kesme': 'Yakın plan: bebek annenin çıplak göğsünde ten tene, üstü havluyla örtülü. Göbek kordonu bütün, kesilmemiş ve bağlanmamış, gevşek halde bebekten anneye uzanıyor; yanında ağzı kapalı bir poşette plasenta, bebeğin yanında. Kenarda bir makas, makasın üstünde kırmızı yasak; kordona çekme okunun da üstü çizili.',
  // Yaşlı
  'ozel-gruplar-yasli-kapi': 'Önden görünüş: koridorda genç komşu, aralanan kapıdaki bastonlu yaşlı kadınla konuşuyor ve ona su şişesi uzatıyor.',
  'ozel-gruplar-yasli-esyalar': 'Yukarıdan görünüş: masa üstünde sırt çantasının yanına konmuş gözlük, açıkça tanınan kulak arkası işitme cihazı, ilaç kutuları ve ilaç listesi kağıdı; çantanın yanında katlanmış yürüteç ve baston. Soru işareti ya da belirsiz simge yok. Eşyalardan çantaya turuncu oklar.',
  'ozel-gruplar-yasli-su': 'Yandan görünüş: dizleri battaniyeli yaşlı kadın sandalyede oturuyor, yanındaki genç komşu ona bir bardak su uzatıyor. Bardağa turuncu ok.',
  'ozel-gruplar-yasli-yuruyus': 'Yandan görünüş: akşam, enkazdan temizlenmiş patika; yaşlı kadın bir elinde el fenerini tutuyor, yolu kendisi aydınlatıyor. Genç komşu yanında, yaşlının koluna girmiş, onu kolundan tutarak yürütüyor.',
  'ozel-gruplar-yasli-sohbet': 'İç mekân, yandan: yaşlı kadın ve genç komşu karşılıklı sandalyelerde oturmuş sohbet ediyor; komşu konuşuyor (boş konuşma balonu), yaşlı kadın sakin.',
  // Hareket engeli
  'ozel-gruplar-sandalye-kilitle': 'Yandan görünüş: oda içinde tekerlekli sandalyedeki kişi dik oturuyor, gövdesinden öne eğilmiş, iki eliyle ensesini ve başını kavrayıp kollarıyla örtüyor; iki kolu da başta, havada kol yok, gövde yana devrilmiyor. Tekerlek freni kilitli; turuncu ok fren koluna işaret ediyor. Pencere ve raftan uzakta.',
  'ozel-gruplar-sandalye-duduk': 'Yandan görünüş: oda içinde tekerlekli sandalyedeki aynı kişi düdük çalıyor; düdükten çıkan ses dalgaları. Arkada kapı.',
  'ozel-gruplar-sandalye-sor': 'Önden görünüş: toplanma alanında ayakta duran yardımcı hafifçe eğilmiş, tekerlekli sandalyedeki kişiye göz hizasında soru soruyor (boş konuşma balonu ve soru işareti); sandalyedeki kişi eliyle bir yeri gösteriyor.',
  'ozel-gruplar-sandalye-merdiven': 'Yandan görünüş: merdivenden iniş. Tekerlekli sandalye arka tekerlekleri üzerinde yaklaşık 30 derece geriye yatırılmış; arkadaki yardımcı üst basamakta itme kollarından tutuyor, öndeki yardımcı alt basamakta sandalyenin sabit çerçevesinden tutuyor (ayaklıktan ya da kol dayamasından değil). Yanda kırmızı yasak işaretli asansör simgesi.',
  'ozel-gruplar-sandalye-esya': 'Önden görünüş: tahliye sırasında yardımcı kişi, tekerlekli sandalyedeki kişinin yanında koltuk değneğini ve şarj aletini taşıyor. Eşyalara yeşil onay.',
  // Görme ve işitme
  'ozel-gruplar-gorme-rehberlik': 'Yandan görünüş: beyaz bastonlu görme engelli kişi, rehberin dirseğinin hemen ÜSTÜNDEN kolunu kavramış (omuzdan değil); rehberin kolu gövdesinin yanında, dirseği hafif bükük. Rehber yarım adım önde yürüyor. Tutan ele turuncu ok.',
  'ozel-gruplar-gorme-basamak': 'Yandan görünüş: AŞAĞI inen üç basamağın en üstünde iki kişi birlikte durmuş. Görme engelli kişi rehberin dirseğinin üstünden tutuyor; rehber başını ona çevirmiş konuşuyor, konuşma balonunda "3 basamak iniyoruz". Basamaklar izleyiciden bakınca aşağıya doğru iniyor.',
  'ozel-gruplar-isitme-dikkat': 'Yandan görünüş: yardımcı, arkası dönük işitme engelli kişinin omzuna hafifçe dokunuyor; kişi dönüyor. Dokunan ele turuncu ok.',
  'ozel-gruplar-isitme-yazma': 'Yakın plan: yüz yüze iki kişi; yardımcı telefon ekranını gösteriyor, ekranda büyük yazıyla "BİNA HASARLI. BENİMLE GEL." Karşıdaki kişi başını sallıyor.',
  'ozel-gruplar-isitme-duduk': 'Yakın plan: işitme engelli kişi (aynı oyuncu) boynuna iple asılı düdüğü çalıyor; düdükten çıkan ses dalgaları.',
  // Zihinsel / otizm / demans
  'ozel-gruplar-zihinsel-el-ele': 'Önden görünüş: kalabalık toplanma alanında anne, otizmli çocuğuyla el ele yürüyor; çocuk kulaklık takmış ve sevdiği peluş oyuncağı tutuyor. Tutuşan ellere turuncu ok.',
  'ozel-gruplar-kimlik-bileklik': 'Yakın plan: çocuk ya da yaşlı bileğinde renkli bir kimlik bilekliği; bileklikte okunaksız kısa çizgiler (yazı alanı), telefon simgesi ve küçük bilgi "i" simgesi. Bilekliğe yeşil onay.',
  'ozel-gruplar-zihinsel-sakin-kose': 'Yandan görünüş: çadırın sakin bir köşesinde, gürültü önleyici kulaklıklı çocuk battaniye üzerinde oturuyor, yanında annesi sessizce oturuyor; dışarıda bulanık kalabalık.',
  'ozel-gruplar-kayip-teslim': 'Önden görünüş: gönüllü, şaşkın görünen yaşlı adamın koluna girmiş, onu AFAD yelekli görevlinin bulunduğu masaya getiriyor. Görevliye doğru turuncu ok.',
  // Kronik hastalık
  'ozel-gruplar-ilac-canta': 'Yukarıdan görünüş: açık bel çantasına ilaç kutuları, şeker ölçüm cihazı, insülin kalemi ve katlanmış reçete konuyor. Çantaya turuncu ok.',
  'ozel-gruplar-saglik-karti': 'Yakın plan: el, üzerinde kalp, damla ve hap simgeleri olan katlanmış bir sağlık bilgi kartını gömlek cebine koyuyor. Kartta yazı yok, sadece simgeler.',
  'ozel-gruplar-kurtarmaya-soyle': 'Önden görünüş: enkaz yanında oturan kişi, baretli kurtarma görevlisine elindeki insülin kalemini gösteriyor; görevli dinliyor. Kaleme turuncu ok.',
  'ozel-gruplar-insulin-serin': 'Yakın plan: insülin kalemi beze sarılı halde serin bir termos/soğuk çantada, yanında beze sarılı buz paketi (insüline doğrudan değmiyor). Yanda güneş altındaki insülin kalemi kırmızı yasak işaretli.',
  // Evcil hayvan
  'ozel-gruplar-evcil-tahliye': 'Önden görünüş: sırt çantalı aile toplanma alanına yürüyor; baba köpeği tasmayla, kız çocuk kedi taşıma kafesini taşıyor. Arka planda yeşil toplanma alanı tabelası.',
  'ozel-gruplar-evcil-kafes': 'Yakın plan: baba bir elinde kapısı kilitli plastik taşıma kafesini taşıyor (içinde korkmuş kedi), öbür elinde yanında oturan köpeğin tasmasına bağlı kayışı sıkıca tutuyor. Kafes kilidine yeşil onay.',
  'ozel-gruplar-evcil-kunye': 'Yakın plan: köpek tasmasındaki metal künye (üzerinde telefon simgesi) ve kafes üstüne yapıştırılmış, telefon simgeli etiket. Künyeye turuncu ok.',
  'ozel-gruplar-evcil-canta': 'Yukarıdan görünüş: evcil hayvan çantasının içi: mama paketi, su şişesi, katlanır su kabı, ilaç kutusu, aşı kartı, yedek tasma ve hayvanın küçük bir fotoğrafı. Köşede "3 gün".',
};
