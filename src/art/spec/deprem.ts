// Deprem kategorisinin çizimleri. Üslup: ayrıntılı düz renkli çizim (Kızılay/AFAD broşürü gibi), 4:3.
export const SPEC: Record<string, string> = {
  // deprem-aninda
  'deprem-cok': 'Yandan görünüş: oturma odasında yetişkin, ayaktan dizlerinin ve ellerinin üzerine çöküyor; aşağı doğru turuncu ok. Arkada sallanan avize ve titreme çizgileri.',
  'deprem-kapan-masa': 'Yandan görünüş: pencere olmayan bir iç duvarın önünde sağlam ahşap masa; yetişkin masanın altında ellerinin ve dizlerinin üzerinde, bir koluyla başını ve ensesini örtüyor, öbür eliyle masa ayağını tutuyor. Sahnede pencere, cam ya da cam dolap yok. Masanın üstünde ve çevresinde titreme çizgileri; başı koruyan kola yeşil onay.',
  'deprem-tutun-masa': 'Yakın plan, yandan: masa altında çökmüş kişinin bir eli masa ayağını sıkıca kavrıyor, diğer kolu başını örtüyor. Kavrayan elin çevresinde turuncu vurgu halkası.',
  'deprem-yatak-yastik': 'Yukarıdan-yandan görünüş: yatakta yüzüstü yatan kişi iki eliyle yastığı başının ve ensesinin üstüne bastırıyor. Duvarda sallanan tablo yok, yanında titreme çizgileri; yastığa yeşil onay.',
  'deprem-acik-alan': 'Dış mekân, geniş açı: kişi açık alanda çökmüş, kollarıyla başını koruyor; arka planda uzakta bina, ağaç ve elektrik direği. Kişiyle bunlar arasında mesafeyi gösteren kesikli çift yönlü ok.',
  'deprem-arac-dur': 'Yandan görünüş: araba yol kenarında, binalardan, ağaçlardan ve tellerden uzak açık alanda durmuş; içerideki sürücü el freni kolunu çekiyor (yakın plan çerçeve).',
  'deprem-koltuk-yani': 'Yandan görünüş: masa olmayan oturma odasında dolgun, alçak bir kanepenin hemen yanında kişi dizlerinin üzerine çökmüş, iki koluyla başını ve ensesini örtüyor (Çök-Kapan-Tutun). Titreme çizgileri; başı koruyan kola yeşil onay.',
  // deprem-sonrasi
  'deprem-yara-kontrol': 'Önden görünüş: dağınık odada yetişkin önce kendi kollarına bakıyor, yanında oturan çocuğun omzuna elini koymuş, ona bakıyor. Yerde düşmüş birkaç eşya.',
  'deprem-ayakkabi-cam': 'Yakın plan: yerde cam kırıkları; kişi oturup kalın tabanlı ayakkabısını giyiyor. Çıplak ayak simgesinin üstünde kırmızı yasak, ayakkabıda yeşil onay.',
  // enkaz-altinda
  'deprem-enkaz-agiz-kapat': 'Yakın plan, 3/4 profil: enkaz boşluğunda yarı uzanmış kişi tişörtünün yakasını ağzına ve burnuna çekmiş; çevrede beton parçaları ve havada toz zerrecikleri.',
  'deprem-enkaz-vurma': 'Yandan görünüş: beton parçalarının altındaki dar boşlukta kişi elindeki küçük bir taşla metal boruya vuruyor; borudan dışarı yayılan ses dalgaları ve "3×" etiketi. Ağzında düdük asılı.',
  'deprem-enkaz-dinle': 'Kesit görünüm: üstte enkaz yığınının üstünde kasklı bir kurtarıcı dizlerinin üstüne çökmüş, öne eğilip kulağını enkaza yaklaştırmış; bir elinin işaret parmağı dudaklarında ("sessizlik"). Altta enkaz boşluğundaki kişi yüzüstü, yumruğuyla zemine vurup ses veriyor (yumruğun yanında ses dalgaları). İkisi arasında kesikli çizgi.',
  // enkaz-kurtarma
  'deprem-kurtarma-girme': 'Dış mekân: yana yatmış, katları çökmüş bina; girişin önünde kırmızı yasak işareti. Gönüllü binanın uzağında durmuş, binaya bakıyor.',
  'deprem-kurtarma-koruyucu': 'Önden görünüş: gönüllü baştan aşağı: sarı kask, toz maskesi, kalın iş eldivenleri, uzun kollu giysi ve kalın tabanlı bot. Her ekipmanın yanında küçük yeşil onay.',
  'deprem-kurtarma-sessizlik': 'Enkaz başında bir kurtarıcı yumruğunu kaldırmış (sessizlik işareti), çevredeki insanlar durmuş ve susmuş; bir gönüllü enkaza eğilip dinliyor. Kulağın yanında ses dalgası simgesi.',
  'deprem-kurtarma-takoz': 'Yandan yakın plan: uzun demir kaldıraç, yerdeki üst üste tahtaların (dayanak noktası) üstünden geçip ucu beton parçasının altına girmiş; tek gönüllü kaldıracın öbür ucuna bastırıyor, beton parçası birkaç santim kalkmış. Zeminde bir tahta takoz, kalkan parçanın altına doğru turuncu okla. Kimsenin eli ya da ayağı yükün altında değil. Kaldırma yönünde turuncu ok; arkadaki kolon kırmızı yasakla işaretli.',
  'deprem-kurtarma-isaretle': 'Önden görünüş: gönüllü sağlam bir duvara sprey boyayla sade bir işaret ve yanına "ARANDI" ile saat yazıyor; diğer elinde not defteri. Arkada enkaz. Büyük, karmaşık kod ya da resmi işaretleme sistemi gibi görünen semboller yok.',
  // deprem-kalabalik-alan
  'deprem-kalabalik-kosma': 'Alışveriş merkezi girişi: kapıya doğru itişerek koşan kalabalık, üstünde kırmızı yasak işareti. Ön planda bir kişi olduğu yerde çökmüş, başını koruyor, yeşil onaylı.',
  'deprem-magaza-raf': 'Market içi, yandan: yüksek raflardan düşen kutular; kişi raflardan uzaklaşmış, alışveriş arabasının yanında çökmüş, kollarıyla başını örtüyor. Raftan uzağa turuncu ok.',
  'deprem-stadyum-koltuk': 'Tribün, yandan: koltuklar sahaya (sola) bakıyor. Kişi kendi koltuğunun önüne, öndeki sıranın koltuğuyla arasına dizlerinin üzerine çökmüş, öne kapanmış, bir eli ensesinde. Titreme çizgileri. Tek kişi, büyük.',
  'deprem-metro-tutun': 'Metro vagonu içi: biri koltukta oturan, biri yere çökmüş iki yolcu. Oturan yolcu bir eliyle koltuk tutamağını ya da yanındaki dikey direği sıkıca kavramış, öbür koluyla başını koruyor; çömelen yolcu iki eliyle dikey direğe sarılmış. Ellerin direği kavradığı açıkça görünüyor; boşta el yok. Kavrayan ellerde turuncu vurgu; kapı kapalı.',
  'deprem-kalabalik-cikis': 'Sarsıntı sonrası: yelekli görevli kolunu uzatmış çıkışı gösteriyor; insanlar tek sıra, sakin, yürüyerek çıkıyor. Çıkış tabelasına doğru yeşil ok.',
  // deprem-hasarli-bina
  'deprem-bina-dis-kontrol': 'Dış mekân: kişi binanın dışında, güvenli mesafede durup binaya bakıyor; binada eğilme, dökülmüş sıva ve çatlak dış duvar. Gözden binaya kesikli bakış çizgisi.',
  'deprem-bina-kolon-catlak': 'Yakın plan: solda betonarme kolonda çapraz derin çatlak ve dökülen beton, içinden görünen eğilmiş demir; sağda binanın karanlık giriş kapısı üstünde kırmızı yasak (girme).',
  'deprem-hasar-tespit': 'Önden görünüş: kask ve yelek giymiş iki teknik eleman binanın önünde ellerinde tablet/form, binayı inceliyor; ön planda bir kişinin elindeki telefonda e-Devlet tarzı sorgulama ekranı (yazısız simgeler).',
  'deprem-bina-yasak': 'Bina girişine gerilmiş kırmızı-beyaz şerit, kapıda kırmızı yasak işareti ve kapıya yapıştırılmış kırmızı etiket; binanın önünde geri dönen bir aile.',
  'deprem-bina-fener': 'Yandan görünüş: kask, eldiven ve botlu kişi, görevli eşliğinde hasarlı daireye el feneriyle giriyor; fenerden ışık huzmesi. Kişinin başı ve kaskı açıkça görünüyor, hiçbir kutu yüzü örtmüyor. Çakmak ve mum simgeleri kırmızı yasakla, ayrı küçük kutu içinde sağ üst köşede.',
  // deprem-cocuklar
  'deprem-bebek-gogus': 'Yandan görünüş: anne sağlam bir masanın ALTINDA topuklarının üstüne çökmüş, öne kapanmış; bebeği iki koluyla göğsüne bastırmış, başı bebeğin üstüne eğik. Masanın kenarı ve ayakları belirgin. Titreme çizgileri, yeşil onay.',
  'deprem-cocuga-seslen': 'Bölünmüş sahne: solda koridorda çökmüş baba elini ağzına tutup sesleniyor (ses dalgaları); sağda odasında masa altına çökmüş çocuk başını koruyor. Aradaki kapıya koşan figür kırmızı yasakla.',
  'deprem-cocuk-el-tut': 'Önden görünüş: dışarıda yetişkin, ayakkabılı çocuğun elini sıkıca tutuyor; çocuğun ceket cebinden küçük bir isim-telefon kartı görünüyor. Arkada toplanma alanı tabelası.',
  'deprem-cocuk-sakinlestir': 'Yetişkin çocuğun göz hizasına çömelmiş, ona sarılıyor; çocuk battaniyeye sarılı. Arkada açık alanda bekleyen insanlar; küçük kalp simgesi.',
  'deprem-karyola': 'Çocuk odası, önden: beşik pencereden uzakta iç duvarın yanında, beşiğin üstünde boş duvar; pencerenin dibindeki beşik ve beşik üstüne asılı ağır tablo küçük çerçevede kırmızı yasakla.',
  // deprem-yuksek-bina
  'deprem-yuksek-pencere-uzak': 'Ofis içi, yandan: cam cepheli yüksek kat; kişi pencereden iç tarafa doğru uzaklaşıyor (turuncu ok) ve masaya doğru gidiyor. Camda titreme çizgileri, dışarıda şehir silueti.',
  'deprem-asansor-dugme': 'Asansör içi, yakın plan: el bütün kat düğmelerine sırayla basıyor (düğmeler yanıyor); yanında açılan kapıdan dışarı çıkış oku.',
  'deprem-merdiven-in': 'Yangın merdiveni, yandan: insanlar tek sıra, tırabzanı tutarak sakin şekilde aşağı iniyor; basamaklarda birkaç düşmüş parça. Aşağı yönlü yeşil ok.',
  'deprem-yuksek-masa': 'deprem-kapan-masa ile aynı sahne, deprem-yuksek-bina rehberinin kişisiyle (kızıl uzun saçlı kadın): masa altında Çök-Kapan-Tutun.',
  'deprem-yuksek-merdiven-asansor': 'Solda kırmızı yasaklı asansör kapısı; sağda aynı kadın tırabzanı tutarak merdivenden aşağı iniyor; aşağı yönlü turuncu ok.',
  'deprem-yuksek-vurma': 'deprem-enkaz-vurma ile aynı sahne, deprem-yuksek-bina rehberinin kişisiyle: mahsur kalan kişi boruya taşla vuruyor, ses dalgaları, "3×".',
  'deprem-sonrasi-merdiven': 'Solda kırmızı yasaklı asansör kapısı; sağda deprem-sonrasi rehberinin yetişkini tırabzanı tutarak merdivenden aşağı iniyor; aşağı yönlü turuncu ok.',
  'deprem-sonrasi-toplanma': 'Dış mekân: deprem-sonrasi rehberinin yetişkini ve çocuğu sırt çantalarıyla el ele yürüyor; önlerinde yeşil toplanma alanı tabelası; turuncu ok.',
};
