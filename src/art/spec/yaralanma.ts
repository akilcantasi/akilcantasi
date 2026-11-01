// Kategori çizimleri: Yaralanma ve hastalık
// Ayrıntılı düz (flat) çizim, Kızılay/AFAD broşürü tarzı, 4:3 tuval.
// Turuncu ok = yapılacak hareket, kırmızı "yasak" = yapılmayacak, yeşil tik = doğru.
export const SPEC: Record<string, string> = {
  // Burun kanaması
  'yaralanma-burun-one-egil': 'Yandan: sandalyede oturan yetişkin, gövdesi ve başı öne eğik; burnundan birkaç kırmızı damla aşağıya, kucağındaki peçeteye düşüyor. Başın üstünden öne-aşağı kıvrılan turuncu ok (başı öne eğ), yeşil tik.',
  'yaralanma-burun-sikma': 'Yakın plan yüz (3/4 profil): kişi oturuyor, başı ÖNE eğik (geride ya da dik değil). Kendi başparmağı ve işaret parmağı burnun yumuşak alt kısmını, burun deliklerinin hemen üstünden sıkıyor; parmaklar göz hizasındaki kemikli üst kısımda değil. Parmakların iki yanında içe doğru küçük turuncu oklar, ağızdan nefes çizgileri.',
  'yaralanma-burun-sure': 'Yakın plan: burun-sikma ile aynı kişi, başı öne eğik, aynı tutuşla burnunun yumuşak kısmını sıkmayı sürdürüyor; yanında büyük duvar saati, kadranın çeyreği turuncu; altında "10–15 dk".',

  // Yanık
  'yaralanma-yanik-yuvarlanma': 'Yakın plan, tek fikir: giysisinin sırtında alev olan kişi yerde yan yatmış, elleriyle yüzünü kapatmış, yuvarlanıyor; gövdeyi saran kavisli turuncu ok. Yardımcı ve battaniye yok.',
  'yaralanma-yanik-sogutma': 'Yakın plan: kızarmış ön kol mutfak musluğunun altında, serin su kola akıyor (ince mavi akış, damlalar); buz yok. Köşede "20 dk" yazan saat simgesi, yeşil tik.',
  'yaralanma-yanik-strec': 'Yakın plan: soğutulmuş, kızarık ön kolun üzerine streç film boyuna doğru gevşekçe seriliyor (sarmal sıkı sarma değil); yardımcının elleri filmi düz tutuyor. Yanında streç film rulosu.',
  'yaralanma-yanik-ortme': 'yanik rehberinin oyuncularıyla, yakın plan: sırtüstü yatan yaralının (baş solda) üstü göğüsten ayağa battaniyeyle örtülü; yardımcı başın arkasında topukları üstüne diz çökmüş, konuşuyor.',

  // Kırık, burkulma
  'yaralanma-kirik-acik-yara': 'Yakın plan: baldırda açık yara, üstüne temiz beyaz bez örtülmüş, bezin ortasından kemik ucu çıkıyor; yardımcının elleri bezin iki yanına bastırıyor (turuncu oklar). Kemiğin tam üstüne inen kırmızı ok ve ✗: üstüne bastırma.',
  'yaralanma-kirik-atel': 'Yukarıdan: yerde uzanmış ön kol; altına katlanmış kalın karton atel konmuş, atel dirsekten bileğe kadar uzanıyor; üç yerden bezle bağlanmış, düğümler kırık noktasının üstünde değil. Parmak uçları açıkta, yeşil tik.',
  'yaralanma-yukari-kaldirma': 'Yandan: kanepede sırtüstü uzanan kişi, sargılı ayak bileği/baldırı iki yastığın üstünde kalp hizasının üzerinde; yukarı doğru turuncu ok. Yanında beze sarılı soğuk paket.',
  'yaralanma-kirik-yukari': 'Yandan: kirik-burkulma rehberindeki kadın kanepede sırtüstü uzanıyor, sargılı ayak bileği iki yastığın üstünde kalp hizasının üzerinde; yukarı doğru turuncu ok.',

  // Ezilme
  'yaralanma-ezilme-saat-not': 'Yarım yıkılmış duvarın molozu altında bacağı sıkışmış, bilinci açık yaralı; yanında diz çökmüş yardımcı elinde küçük defter, konuşuyor. Köşede saat simgesi ve "14:20" etiketi.',
  'yaralanma-ezilme-bekleme': 'Bacağı beton parçasının altında sıkışmış yaralı yerde; yardımcı yükü kaldırmıyor, başının yanında diz çökmüş, elini omzuna koyup konuşuyor. Beton parçasının üstünde kırmızı yasak işareti; arkada yaklaşan UMKE ekibi silueti.',
  'yaralanma-ezilme-ortme': 'ezilme rehberinin oyuncularıyla, yakın plan: sırtüstü yatan yaralının üstü battaniyeyle örtülü; yardımcı başın arkasında diz çökmüş, konuşuyor.',
  'yaralanma-ezilme-kpr': 'ezilme rehberinin oyuncularıyla yetişkin kalp masajı: yan görünüş, yardımcı göğüs hizasında diz çökmüş, kollar dik, omuzlar ellerin tam üstünde; aşağı ok, "100–120/dk".',

  // Başa darbe
  'yaralanma-bas-boyun-sabitleme': 'Yandan: yerde sırtüstü yatan genç (başa darbe rehberi); başının arkasında topukları üstüne diz çökmüş yardımcı öne eğilmiş, iki elini başın iki yanına koymuş, başı gövdeyle düz bir çizgide tutuyor. Baştan ayaklara kesik yeşil çizgi, yeşil tik.',
  'yaralanma-bas-dinlenme': 'İç mekân: oyun ya da spor kıyafetli genç kanepede rahatça oturmuş ya da uzanmış dinleniyor; elinde soğuk paket yok. Kenarda bırakılmış top. Yanında yetişkin elini omzuna koymuş.',
  'yaralanma-bas-soguk': 'Yakın plan: oturan kişi alnının yanındaki şişliğe beze sarılı buz torbasını tutuyor (buz cilde doğrudan değmiyor); şişlik hafif yuvarlak çizgiyle belirgin. Süre etiketi yok. (yaralanma-bas-travmasi adım 7 için; cold-compress kol ve bilek içindir.)',
  'yaralanma-bas-refakat': 'Gece, yatak odası: yatakta uzanan kişi; yanında sandalyede oturan yetişkin onu izliyor, elinde telefon. Duvarda saat, köşede "24 sa".',

  // Omurga
  'yaralanma-omurga-kimildatma': 'Yakın plan: olduğu yerde sırtüstü yatan yaralı; yardımcı başın arkasında topukları üstüne diz çökmüş, kıpırdamamasını söylüyor. Sağ üstte kare: iki kişinin yaralıyı kaldırmaya uzanması kırmızı yasakla çizili.',
  'yaralanma-omurga-bas-tutma': 'yaralanma-bas-boyun-sabitleme ile aynı kompozisyon, omurga rehberinin oyuncularıyla: başın arkasında diz çökmüş yardımcı başı iki yandan tutuyor; baş-gövde düz hat.',
  'yaralanma-omurga-ortme': 'omurga rehberinin oyuncularıyla, yakın plan: sırtüstü yatan yaralının üstü battaniyeyle örtülü; yardımcı başın arkasında diz çökmüş, konuşarak sakin tutuyor.',
  'yaralanma-omurga-kpr': 'omurga rehberinin oyuncularıyla yetişkin kalp masajı: yan görünüş, kollar dik, omuzlar ellerin üstünde; aşağı ok, "100–120/dk".',
  'yaralanma-omurga-tek-parca': 'Yandan, acil taşıma: yaralı bir battaniyenin üstünde sırtüstü; yardımcı başın arkasında çömelmiş, battaniyenin baş tarafını iki eliyle toplamış, yaralıyı vücut ekseni boyunca geriye çekiyor. Baş-gövde-bacak tek hat (yeşil kesik çizgi), çekme yönünde tek turuncu ok. Yardımcının elleri yaralının yüzüne/boynuna değmiyor.',

  // Göz
  'yaralanma-goz-yikama': 'Yakın plan: lavabo başında kişinin başı yaralı göz tarafına belirgin biçimde yana eğik, yaralı göz aşağıda; yüz ifadesi rahatsız, gülümseme yok. Yardımcı iki parmağıyla göz kapaklarını açık tutuyor, öbür eliyle sürahiden göze ince, yumuşak bir su akışı döküyor (sert su çubuğu değil); su burundan dışa, yanaktan aşağı akıyor, sağlam göze akmıyor. Köşede "20 dk".',
  'yaralanma-goz-toz': 'Yakın plan yüz: kişi gözünü ovuşturmak üzere kaldırdığı eli kırmızı yasakla çizili; yanında ikinci küçük kare: aynı kişi göz banyosu kabı ya da bardakla gözünü temiz suyla yıkıyor, yeşil tik.',
  'yaralanma-goz-bardak': 'Yakın plan: sırtüstü yatan kişinin yaralı gözünün üstüne ters çevrilmiş karton bardak kapatılmış, bardak göze değmiyor; bardak iki şerit bantla alına ve yanağa tutturulmuş. İçeride küçük saplanmış cisim belli belirsiz görülüyor; sağlam göz kapalı.',

  // Diş
  'yaralanma-dis-tutma': 'Yakın plan: iki parmak yerinden çıkmış bir dişi beyaz taç kısmından tutuyor; dişin sarımsı kökü açıkta. Köke işaret eden küçük kırmızı yasak, taçta yeşil tik.',
  'yaralanma-dis-yerlestirme': 'Yakın plan, önden: yetişkinin eli dişi taçtan tutarak ön dişlerdeki boş yuvaya, ön yüzü öne bakacak şekilde yerleştiriyor; yuvaya doğru turuncu ok. Yanında küçük ikinci kare: kişi dişlerinin arasında katlanmış beyaz bir bezi ısırıyor, bez dudakların arasından dışarı taşıyor; ağzın üstünde bant gibi görünen bir şey yok.',
  'yaralanma-dis-sut': 'Yakın plan masa: içinde sütün içinde bir diş görünen büyük bir bardak (yeşil tik); yanda kâğıt mendile sarılı kuru diş kırmızı yasakla çizili.',
  'yaralanma-agiz-bastirma': 'Yakın plan yüz (3/4): kişi patlamış alt dudağına katlanmış temiz bezi parmaklarıyla bastırıyor; diğer elinde yanağının dışına tuttuğu beze sarılı soğuk paket. Köşede "10 dk".',

  // Göğüs
  'yaralanma-gogus-yari-oturur': 'Yandan: yaralı yerde duvara ya da yardımcının dizlerine yaslanmış yarı oturur hâlde, dizleri hafif bükük; elini göğsünde tutuyor. Yardımcı yanında diz çökmüş, telefonla 112\'yi arıyor.',
  'yaralanma-gogus-acik-yara': 'İki kare (ERC 2025). Sol kare: göğüsteki açık yaranın üstüne naylon parçası konup ÜÇ kenarından bantlanmış (eski yöntem), kırmızı yasakla çizili. Sağ kare: aynı yara ÜSTÜ AÇIK bırakılmış, üstünde hiçbir şey yok ve kimse bastırmıyor; yeşil kesik halka ve yeşil onay.',
  'yaralanma-gogus-izle': 'Yandan görünüş: göğüs yaralısı duvara ya da çantaya sırtını yaslamış, YARI OTURUR halde; yardımcı yanında diz çökmüş, kişinin yüzüne ve dudaklarına bakıyor. Dudaklar küçük turuncu halkayla vurgulu (renk izleniyor), göğüste nefes çizgileri. Kişi düz yatırılmamış; saat ya da "10 sn" simgesi yok. (yaralanma-gogus adım 6 için.)',
  'yaralanma-gogus-kpr': 'göğüs rehberinin oyuncularıyla yetişkin kalp masajı: yan görünüş, kollar dik, omuzlar ellerin üstünde; aşağı ok, "100–120/dk".',

  // Karın
  'yaralanma-karin-diz-bukuk': 'Yakın plan, yandan: sırtüstü yatan yaralı (baş solda), dizleri bükülü ve altına rulo yapılmış battaniye konmuş. Başın arkasında diz çökmüş yardımcı konuşuyor. Yeşil tik.',
  'yaralanma-karin-nemli-bez': 'Yukarıdan, yakın plan: karın yarasının üstü ıslak (mavi damlacıklı) temiz bir bezle gevşekçe örtülmüş; üstüne streç film serilmiş. Yanda organları geri iten el çizimi kırmızı yasakla çizili.',
  'yaralanma-yeme-icme-yasak': 'Yakın plan: masada bir bardak su ve bir dilim ekmek; ikisinin üstünde büyük kırmızı yasak işareti.',
  'yaralanma-karin-ortme': 'karın rehberinin oyuncularıyla, yakın plan: sırtüstü yatan yaralının üstü battaniyeyle örtülü; yardımcı başın arkasında diz çökmüş, konuşuyor.',

  // Kopma
  'yaralanma-kanama-bastirma': 'Yakın plan: yardımcının eldivenli iki eli üst üste, katlanmış temiz bir bezi ön koldaki kanayan yaranın üstüne sertçe bastırıyor; iki kol yukarıdan V biçiminde gelir, birbirini kesmez; aşağı doğru turuncu ok.',
  'yaralanma-uzuv-bastirma': 'Yakın plan: yaralının eli soldan uzanıyor (parmak uçları görünür); el üstündeki yaraya katlanmış temiz bez konmuş, yardımcının eldivenli iki eli yukarıdan, kesişmeden bezi sertçe bastırıyor; aşağı turuncu ok, kan damlaları.',
  'yaralanma-uzuv-ortme': 'uzuv kopması rehberinin oyuncularıyla, yakın plan: sırtüstü yatan yaralının üstü battaniyeyle örtülü; yardımcı başın arkasında diz çökmüş, konuşarak sakin tutuyor.',
  'yaralanma-kopan-parca-sarma': 'Yakın plan: masada açılmış, suyla nemlendirilmiş temiz bez (mavi damlacıklar); eldivenli eller kopan bir parmağı bezin içine sarıyor. Yanında serum fizyolojik şişesi.',
  'yaralanma-kopan-parca-buzlu-su': 'Kesit görünümlü şeffaf kap: içinde buz parçaları ve su; ortada ağzı kapalı küçük poşet ve poşetin içinde beze sarılı parmak. Poşet ile buz arasındaki su tabakası vurgulu; yanda doğrudan buz üstüne konmuş çıplak parça kırmızı yasakla çizili.',
  'yaralanma-kopan-parca-etiket': 'Yakın plan: buzlu su kabındaki kapalı poşetin (içinde beze sarılı parmak) üstündeki etikete el kalemle yazıyor; etikette "Ad Soyad" ve "14:20".',

  // Saplanan cisim
  'yaralanma-saplanan-cikarma-yasak': 'Yakın plan: uyluğa saplanmış bir metal çubuk; çubuğu kavrayıp çekmeye çalışan el kırmızı yasakla çizili, dışa doğru ok da kırmızı.',
  'yaralanma-saplanan-iki-yandan': 'Yakın plan: uyluğa saplanmış çubuğun iki yanında yardımcının iki eli bezle yaranın kenarlarına bastırıyor; çubuğa dokunulmuyor. Ellerden aşağı turuncu oklar.',
  'yaralanma-saplanan-sabitleme': 'Yakın plan: saplanmış çubuğun iki yanına rulo yapılmış bezler yerleştirilmiş; bir sargı bezi rulolar üzerinden bacağın çevresine dolanmış, çubuğun üstünden geçmiyor. Yeşil tik.',
  'yaralanma-saplanan-ortme': 'saplanan cisim rehberinin oyuncularıyla, yakın plan: sırtüstü yatan, bilinci açık (acı çeken yüz) yaralının gövdesi göğüsten kalçaya battaniyeyle örtülü; uyluğundaki kısa çubuk iki yanındaki rulo bezlerle sabit, açıkta. Yardımcı başın arkasında diz çökmüş, konuşuyor.',

  // Yara temizliği
  'yaralanma-yara-yikama': 'Yakın plan: dizinde sıyrık olan bacak; yardımcı şişeden temiz suyu yaranın üstüne bol bol döküyor, su aşağı akıyor; yanında sabun kalıbı.',
  'yaralanma-yara-bandi': 'Yakın plan: aynı bükülü dizde temizlenmiş sıyrığın üstüne yardımcının elleri (aynı kenardan gelir) yara bandını yapıştırıyor; yanında açılmış pansuman paketi.',
  'yaralanma-yara-el-yikama': 'yara temizliği rehberinin yardımcısının elleri (camgöbeği manşet, esmer ten) musluk altında sabunla köpüklendiriliyor; köşede "20 sn".',
  'yaralanma-yara-bastirma': 'Yakın plan: çocuğun bükülü dizindeki sıyrığa yardımcının tek eli katlanmış temiz bezi bastırıyor (kol tek kenardan); aşağı turuncu ok.',
  'yaralanma-yara-saglik': 'yara temizliği rehberinin oyuncularıyla: yardımcı, dizi yaralı çocuğu sırtından destekleyerek hilalli sağlık çadırına yürütüyor; turuncu ok.',
  'yaralanma-yara-enfeksiyon': 'Yakın plan, iki kare yan yana: solda temiz, iyileşen yara (yeşil tik); sağda kızarık, şiş, ortasında sarımsı irin olan, çevresine kırmızı alan yayılan yara ve küçük termometre (uyarı üçgeni).',

  // Soğuk ısırığı
  'yaralanma-donma-belirti': 'Yakın plan: eldiveni çıkarılmış el; parmak uçları beyaz-gri, mumsu görünümde, geri kalan el kızarık. Arka planda kar, çam ağaçları, kışlık mont kolu.',
  'yaralanma-donma-ilik-su': 'İç mekân, yakın plan: kişinin eli ılık su dolu leğene batırılmış; leğenin kenarında mutfak termometresi (38°); buhar yok. Köşede tek etiket "37–39 °C".',
  'yaralanma-donma-sarma': 'Yakın plan: ısıtılmış elin parmaklarının ARASINA küçük katlanmış gazlı bez parçaları yerleştirilmiş (parmakların üstünde değil); gevşek bir sargı avuç ve parmakları birlikte, bileğe değil ele sarıyor.',
  'yaralanma-donma-yuzuk': 'Yakın plan: soğuk ısırığı rehberindeki kadının eli (mavi mont manşeti); parmaktaki yüzük yukarı, bilekteki saat yana çıkarılıyor; turuncu oklar.',
  'yaralanma-donma-saglik': 'soğuk ısırığı rehberinin oyuncularıyla: yardımcı, kadını sırtından destekleyerek hilalli sağlık çadırına götürüyor; turuncu ok.',

  // Güneş yanığı
  'yaralanma-gunes-golge': 'Plajda omuzları ve sırtı kızarmış kişi güneşten, şemsiyenin ya da ağacın gölgesine yürüyor; gölgeye doğru turuncu ok. Gökyüzünde güneş.',
  'yaralanma-gunes-serin-bez': 'İç mekân: plajdaki aynı kızarık omuzlu adam sandalyede oturuyor; yardımcı arkasından serin suya batırılmış bezi omzuna koyuyor; yerde su leğeni. Buz yok.',
  'yaralanma-gunes-su-icme': 'Önden: güneş yanığı rehberindeki adam şeffaf bardaktan küçük yudumlarla su içiyor; yanında sürahi, bardaktan ağza küçük turuncu ok.',
  'yaralanma-gunes-saglik': 'güneş yanığı rehberinin oyuncularıyla: yardımcı, yanık adamı sırtından destekleyerek hilalli sağlık çadırına yürütüyor; turuncu ok.',
  'yaralanma-su-icme': 'Önden: ishal rehberindeki yaşlı adam (gülümsemeyen, nötr yüz) elinde açıkça görünen şeffaf bir su bardağını dudaklarına götürmüş, küçük yudumlarla içiyor; bardağın içinde su seviyesi belirgin. Yanında su sürahisi. Bardaktan ağza küçük turuncu ok.',

  // İshal
  'yaralanma-ors-paket': 'Masada üzerinde "ORS" yazan sıvı tuz paketi; bir el paketi tutuyor, göz simgesi paketin arkasındaki tarif satırlarına bakıyor. Yanında çizgileri (dereceleri) olan ölçülü bir kap ve temiz su; litre ya da mililitre sayısı yazılı değil.',
  'yaralanma-ors-ev-tarifi': 'Masada 1 litrelik ölçü çizgili sürahi temiz su; yanında silme dolu 6 çay kaşığı şeker yan yana dizili ve yarım silme çay kaşığı tuz. Tek etiket "1 L"; kaşık gruplarının yanında düz yazı "6 şeker" ve "½ tuz". Kaşıkların üstü düz (silme) gösterilmiş.',
  'yaralanma-ishal-el-yikama': 'ishal rehberindeki yaşlı adamın elleri (mavi uzun kollu manşet) musluk altında sabunla köpüklendiriliyor; köşede "20 sn".',
  'yaralanma-ishal-saglik': 'ishal rehberinin oyuncularıyla: yardımcı kadın, yaşlı adamı sırtından destekleyerek hilalli sağlık çadırına götürüyor; turuncu ok.',

  // Ateş
  'yaralanma-ates-olcme': 'Yakın plan: yetişkin eli dijital ateş ölçeri çocuğun koltuk altına ya da alnına tutuyor; ekranda "38,5 °C".',
  'yaralanma-ates-bebek': 'Anne kucağında çok küçük, yeni doğmuş görünümlü bebek (birkaç haftalık; oturamayan, başı annenin koluna dayalı, kundaklı); anne ateş rehberinin yardımcısı (başörtülü, camgöbeği üst); yanlarında "38 °C" etiketi; sağlık kuruluşu yönünü gösteren turuncu ok ve kırmızı hilalli bina. Havada termometre yok.',
  'yaralanma-ates-ince-giysi': 'İki kare, yakın plan yatakta yatan aynı kız çocuk: solda kalın, kat kat yorgana boynuna kadar sarılmış, terliyor, köşede kırmızı ✗; sağda ince tişörtlü, ince çarşaf yalnızca belden aşağıda, köşede yeşil tik.',
  'yaralanma-ates-112': 'Yakın plan: ateş rehberindeki annenin eli (camgöbeği manşet, esmer ten) telefonda 112 arıyor.',
  'yaralanma-ates-saglik': 'ateş rehberinin oyuncularıyla: anne kız çocuğun elinden tutup hilalli sağlık çadırına yürüyor; turuncu ok.',
  'yaralanma-ates-bardak-testi': 'Yakın plan: ciltte küçük kırmızı-mor noktalı döküntü; şeffaf cam bardağın YAN yüzü döküntünün üstüne bastırılmış. Bardağın altındaki noktalar bardağın dışındakilerle AYNI koyulukta ve renkte (solmuyor); bardak altında daha soluk nokta yok. Köşede "112".',

  // Kuduz
  'yaralanma-isirik-yikama': 'Yakın plan: ön kolda köpek ısırığı izleri; kol musluk altında, el sabunla köpüklendirilmiş, su akıyor. Köşede "15 dk" saat simgesi ve sabun kalıbı.',
  'yaralanma-asi-takvimi': 'Yakın plan duvar takvimi (rakam yok): dört aşı günü turuncu çerçeveli, içlerinde şırınga simgesi; geçmiş iki aşı günü yeşil tikli.',
  'yaralanma-isirik-bastirma': 'Yakın plan: kuduz rehberindeki kadının (kiremit kol, esmer ten) ön kolundaki ısırık yarasına kendi diğer eli katlanmış temiz bezi bastırıyor; aşağı turuncu ok, bezin altından bir damla kan.',
  'yaralanma-kuduz-saglik': 'kuduz rehberindeki kadın hilalli sağlık çadırına yürüyor; turuncu ok.',

  // Kene
  'yaralanma-kene-eldiven': 'Yakın plan: eldiven giyen iki el; yanda çıplak parmakla keneye dokunan el kırmızı yasakla çizili.',
  'yaralanma-kene-cimbiz': 'Çok yakın plan, yandan: deriye tutunmuş kene; ince uçlu cımbız keneyi deriye en yakın yerinden, başından kavramış; gövdeden sıkılmamış. Yeşil tik.',
  'yaralanma-kene-cekme': 'Çok yakın plan, yandan: ince uçlu cımbız keneyi deriye en yakın yerden, ağız ve baş kısmından tutuyor; kenenin şişkin gövdesi cımbızın dışında, sıkılmıyor. Cımbız keneyi deriden dik ve düz biçimde çekiyor, yukarı doğru tek düz turuncu ok; yanında dönen ok ve kolonya şişesi kırmızı yasakla çizili.',
  'yaralanma-kene-kontrol': 'Önden: açık renkli uzun kollu giysi giymiş, paçaları çorabın içine sokulmuş yürüyüşçü; yanında vücut silueti üzerinde koltuk altı, kasık, diz arkası, kulak arkası ve saç dipleri küçük daireyle işaretli.',
  'yaralanma-kene-el-yikama': 'kene rehberindeki yürüyüşçünün elleri (açık renkli uzun kol) musluk altında sabunla köpüklendiriliyor; köşede "20 sn".',
  'yaralanma-kene-saglik': 'kene rehberindeki açık renkli giysili yürüyüşçü hilalli sağlık çadırına yürüyor; turuncu ok.',

  // Ayak bakımı
  'yaralanma-ayak-kontrol': 'Patikada taşa oturmuş yürüyüşçü ayakkabısını ve çorabını çıkarmış, topuğundaki kızarıklığa bakıyor; yanında sırt çantası.',
  'yaralanma-ayak-bantlama': 'Yakın plan: topukta kızarık bölge; eller üstüne flaster/yara bandını düzgünce yapıştırıyor, kırışık yok.',
  'yaralanma-kabarcik-bant': 'Yakın plan: topukta su dolu kabarcık; üstüne yumuşak dolgulu yara bandı konuyor. Yanda kabarcığa iğne batıran el kırmızı yasakla çizili.',
  'yaralanma-ayak-kurulama': 'Yakın plan, üstten: yıkanmış ıslak ayak havlunun üstünde; kişinin kendi eli katlanmış kuru bezle parmak diplerini kuruluyor.',
  'yaralanma-ayak-saglik': 'su toplama rehberindeki yürüyüşçü kadın (yeşil üst, haki pantolon) hilalli sağlık çadırına yürüyor; turuncu ok.',

  // Kramp ve kas zorlanması
  'yaralanma-kramp-germe': 'Yandan: yerde bacağı düz uzatılmış oturan kişi, eliyle ayak ucunu kendine doğru çekiyor; baldırın gerildiğini gösteren kavisli turuncu ok.',
  'yaralanma-kramp-ovma': 'Yakın plan: eller baldır kasını yumuşakça ovuyor; küçük dairesel oklar.',
  'yaralanma-kas-sargi': 'Yakın plan: uyluğa elastik sargı tek parça, spiral biçimde, her tur bir öncekinin yarısını örterek (üst üste binerek) sarılıyor; ayrı ayrı paralel bant şeritleri yok. Sargının altında parmak sığacak boşluk gösteriliyor.',
  'yaralanma-kas-soguk': 'Yakın plan: kramp rehberindeki adamın uyluğuna (lacivert şort, esmer ten) beze sarılı buz paketi konmuş; kendi eli (mavi manşet) bastırıyor; köşede "20 dk".',
  'yaralanma-kas-yukari': 'Yandan: kramp rehberindeki adam kanepede sırtüstü uzanıyor; sargılı baldırı iki yastığın üstünde kalp hizasından yukarıda; yukarı turuncu ok.',
};
