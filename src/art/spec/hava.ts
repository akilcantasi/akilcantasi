// Hava olayları (fırtına, sıcak, soğuk, çığ, toz, hortum, dolu) rehberlerinin çizim tarifleri.
// Üslup: ayrıntılı düz (flat) çizim, Kızılay/AFAD broşürü gibi; 4:3 tuval.
export const SPEC: Record<string, string> = {
  // sicak-carpmasi
  'hava-golgeye-al': 'Yandan görünüş: güneşli parkta yardımcı, bilinci bulanık kişinin kolunu omzuna alıp belinden sararak onu ağacın gölgesine yürütüyor. Gölgeye doğru turuncu ok; gökyüzünde parlak güneş.',
  'hava-soguk-suya-daldir': 'Yandan görünüş: kişi boynuna kadar soğuk su ve buz dolu küvette ya da büyük leğende yatıyor, başı dışarıda; yanında diz çökmüş yardımcı bir eliyle başını destekliyor. Suyun içinde buz parçaları.',
  'hava-islat-yelpazele': 'Yandan görünüş: gölgede yatan kişinin üzerine bir yardımcı şişeden su döküyor, diğeri karton ya da havluyla sürekli yelpazeliyor; hava akımı çizgileri.',
  'hava-buz-noktalari': 'Önden görünüş: sırtüstü yatan kişi; boynunun iki yanında, iki koltuk altında ve iki kasığında beze sarılı buz torbaları; bu noktalar mavi halkalarla vurgulu.',

  // firtina-yildirim
  'hava-yildirim-iceri-gir': 'Yandan görünüş: koyu bulutlu gökyüzünde şimşek; açık arazide yürüyen kişi koşarak sağlam bir binanın kapısından içeri giriyor (turuncu ok). Yanda camları kapalı araba da yeşil onaylı.',
  'hava-fisten-cek': 'Fırtına ÖNCESİ, iç mekân: pencereden uzakta yaklaşan koyu bulutlar görünüyor, şimşek ya da yağmur yok. Bir el televizyonun fişini prizden çekiyor, fişte dışa doğru turuncu ok. Pencerenin önünde, balkondan içeri alınmış saksı ve sandalye. (firtina-yildirim adım 3 için.)',
  'hava-iceride-fise-dokunma': 'Fırtına sırasında iç mekân: pencerede şimşek. Kişi pencere ve kapıdan uzakta, odanın ortasında bir sandalyede ya da koltukta oturuyor, ellerini kucağında tutuyor. Yanda prize takılı televizyon ve kablosuna uzanan el kırmızı yasakla; küçük ikinci çerçevede kapalı musluk ve duş başlığı kırmızı yasakla. Kimse fiş çekmiyor. (firtina-yildirim adım 2 için.)',
  'hava-yalniz-agac-yasak': 'Yandan görünüş: açık çayırda tek başına duran büyük ağacın altına sığınmış kişi ve tepeye yaklaşan şimşek, kırmızı "yasak". Küçük çerçevede kişi tepeden aşağı, alçak yere iniyor, yeşil onay.',
  'hava-sudan-cik': 'Yandan görünüş: göl ya da deniz kıyısı, koyu bulut ve şimşek; yüzücüler sudan kıyıya doğru çıkıyor (turuncu ok), sahilde boş havlu.',
  'hava-30-dakika-bekle': 'İç mekân: pencereden uzaklaşan fırtına bulutu görülüyor; masada duran saat ve köşede "30 dk"; kapıda bekleyen kişi.',

  // hava-kar-firtinasi
  'hava-tek-odada-toplan': 'İç mekân: pencerede gece tipisi; yanan sobanın yanında yaşlı kadın ve çocuk battaniyeye sarılmış oturuyor; aynı kişi (mavi mont) kullanılmayan odanın kapısını kapatıyor, kapıya turuncu ok.',
  'hava-kat-kat-giyin': 'Önden görünüş: kişi üst üste giyilmiş tişört, kazak ve mont katmanlarıyla; başında bere, elinde eldiven, ayağında kalın çorap. Yakada görünen katmanlara tek etiket "3 kat".',
  'hava-soba-guvenli': 'İç mekân, yandan: yanan soba ile koltuk, perde ve çamaşırlar arasında geniş boşluk (ölçü oku); pencere hafif aralık, dışarı hava akımı çizgisi. Sobanın hemen yanına asılmış çamaşır ayrı küçük çerçevede kırmızı "yasak".',
  'hava-baca-kar-temizle': 'Yandan görünüş: karla kaplı evin dış duvarındaki kombi çıkışı/bacanın önü, kürekli kişi tarafından kardan temizleniyor; borudan çıkan duman çizgisi. Temizlenen ağıza turuncu ok.',
  'hava-arac-egzoz-kar': 'Yandan görünüş: karla kaplı yol kenarında duran araba; kişi arabanın arkasında diz çökmüş, egzoz borusunun önündeki karı eliyle temizliyor. Antende kırmızı bez; köşede saat ve "10 dk".',

  // hava-cig
  'hava-cig-yana-kac': 'Karşıdan yamaç: solda aşağı yuvarlanan, kabarık kar bulutu biçiminde çığ (içinde aşağı oklar); kişi akışın yanına, sağa doğru koşuyor (turuncu ok).',
  'hava-cig-nefes-boslugu': 'Kesit görünüş: kar altında gömülü kişi bir eliyle ağzını ve burnunu kapatmış, yüzünün önünde küçük bir hava boşluğu var (mavi halka); diğer kolu yüzeye doğru dik uzanıyor, yanında yukarı turuncu ok.',
  'hava-cig-son-gorulen-yer': 'Yandan görünüş: çığ sonrası karlı yamaç; arkadaş kişinin son görüldüğü yere sopa ya da renkli bez saplıyor, öbür eliyle telefonda "112" arıyor. İşaretten aşağı doğru kesik çizgili akış oku.',
  'hava-cig-sonda-kurek': 'Kesit görünüş: karın içinde yatan kişiye dik saplanmış sonda değiyor; kurtarıcı çukurun kenarında diz çökmüş, kürekle kazıyıp önce kişinin yüzünü açmış (yüz çukurda görünüyor).',

  // hava-toz-firtinasi
  'hava-pencereleri-kapat': 'Önden görünüş: dışarıda turuncu-kahverengi toz bulutu; içeride kişi pencereyi kapatıp kolunu indiriyor. Pencereye turuncu ok.',
  'hava-toz-maske': 'Yakın plan, 3/4 profil: tozlu sokakta kişi yüzüne iyi oturan beyaz FFP2/N95 maske ve gözlük takmış; arkada kahverengi toz perdesi.',
  'hava-toz-arac-yol-disi': 'Yandan görünüş: kahverengi toz bulutlu karayolu; araba asfaltın tamamen dışına, toprak banket ötesine çekilmiş, farları ve stop lambaları sönük. Yolun ortasında durmuş araç kırmızı "yasak".',

  // hava-hortum
  'hava-hortum-ic-oda': 'Ev içi: solda pencereli oda (camdan hortum görünüyor), sağda penceresiz fayanslı iç oda/banyo yeşil onaylı; kişi çocuğun elinden tutup iç odaya geçiyor, turuncu ok.',
  'hava-hortum-comel-bas-koru': 'Yandan görünüş: iç odada yere çömelmiş kişi, başını ve ensesini iki koluyla örtmüş; sırtının üstüne şilte örtülmüş.',
  'hava-hortum-hendek': 'Yandan görünüş: arka planda hortum; yol kenarındaki hendekte yüzüstü yatan kişi, elleriyle başını ve boynunu örtmüş. Yoldaki araç boş.',
  'hava-kopuk-tel-yasak': 'Yandan görünüş: devrik direk ve yerde kıvılcım çıkaran kopuk tel (çevresi kırmızımsı); kişi telden uzaklaşıp sola yürüyor, turuncu ok.',

  // hava-sicak-dalgasi
  'hava-sicak-saatler': 'Yandan görünüş: pencereden bakan kişi dışarıdaki kavurucu güneşli boş sokağa bakıyor; duvarda saat ve "10–16" etiketi. Dışarı çıkan küçük figür kırmızı "yasak".',
  'hava-su-ic': 'Yakın plan: yaşlı bir kişi gölgede oturmuş bardaktan su içiyor; masada su sürahisi.',
  'hava-perde-kapat': 'Bölünmüş sahne: solda gündüz güneş varken kişi panjuru/perdeyi kapatıyor; sağda gece ay varken aynı kişi pencereyi açıyor, içeri serin hava çizgileri.',
  'hava-komsu-kontrol': 'Önden görünüş: kapı aralığında, elinde su şişesiyle bir komşu yaşlı kadına bakıyor ve konuşuyor; yaşlı kadın yelpazeyle serinleniyor.',
  'hava-arac-cocuk-yasak': 'Yandan görünüş: güneşte park etmiş arabanın arka koltuğunda çocuk koltuğunda bebek ve camın ardında köpek, araç üstünde sıcaklık dalgaları; büyük kırmızı "yasak" işareti.',

  // hava-dolu
  'hava-dolu-iceri-gir': 'Yandan görünüş: iri dolu taneleri yağıyor; kişi başını montuyla örterek sağlam binanın kapısından içeri giriyor (turuncu ok).',
  'hava-dolu-bas-koru': 'Yakın plan: açıkta kalmış kişi çantasını başının üstüne kaldırmış, kollarıyla başını koruyarak yürüyor; çevresinde zıplayan dolu taneleri.',
  'hava-dolu-arac-ici': 'Araç içi yan kesit: yol dışında durmuş araç, camlara çarpan dolu; içeride yetişkin camlardan uzak, öne eğilmiş, gözleri kapalı ve yanındaki çocuğu bedeniyle koruyor.',
  'sicak-yan-yatir': 'Gölgede, sıcak çarpması rehberinin yaralısı derlenme pozisyonunda yan yatmış, nefes alıyor (mavi nefes çizgileri). (sicak-carpmasi adım 8 için; recovery-position yerine.)',
  'firtina-kpr': 'Kalp masajı, yandan: fırtına rehberindeki kişi (turkuaz üst, topuz) yıldırım çarpan kişinin yanında diz çökmüş, kollar düz, omuzlar ellerin üstünde; aşağı ok, "100–120/dk". (firtina-yildirim adım 8 için.)',
  'cig-kpr': 'Kalp masajı, karda yandan: çığdan çıkarılan kırmızı montlu kişi sırtüstü; kurtarıcı arkadaş (turkuaz, at kuyruğu) diz çökmüş, kollar düz; aşağı ok, "100–120/dk". (hava-cig adım 10 için.)',
  'hava-alt-gecit-yasak': 'Yandan görünüş: üstünden araç geçen köprünün altındaki, suyla dolmuş alt geçide girmek üzere olan araba kırmızı "yasak" işaretli; yukarıda dolu ve yağmur.',
};
