// Rehber kategorisi: Deprem
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "deprem",
  "title": "Deprem",
  "hint": "Çök-Kapan-Tutun, enkaz",
  "art": "cat-deprem",
  "color": "#f5a524",
  "order": 0
};

export const GUIDES: Guide[] = [
  {
    "id": "deprem-aninda",
    "title": "Deprem anında: Çök, Kapan, Tutun",
    "tag": "DEPREM",
    "summary": "Deprem başladığında olduğunuz yerde kalın ve sarsıntı bitene kadar Çök-Kapan-Tutun yapın.",
    "steps": [
      "Koşmayın. Sarsıntı bitene kadar olduğunuz yerde kalın.",
      "ÇÖK: Hemen ellerinizin ve dizlerinizin üzerine çökün.",
      "KAPAN: Sağlam bir masanın altına girin. Başınızı ve ensenizi kollarınızla koruyun.",
      "TUTUN: Masanın ayağını sıkıca tutun. Sarsıntı bitene kadar bırakmayın.",
      "Masa yoksa dolgun bir koltuk, kanepe ya da içi dolu baza gibi sağlam, alçak bir eşyanın yanına çökün. O da yoksa üstünde raf ya da asılı eşya olmayan bir iç duvarın dibine çökün. Başınızı ve ensenizi kollarınızla koruyun.",
      "Pencerelerden, camlardan ve sabitlenmemiş dolaplardan uzak durun.",
      "Yataktaysanız yatakta kalın. Başınızı yastıkla koruyun.",
      "Dışarıdaysanız binalardan, ağaçlardan, direklerden ve elektrik tellerinden uzak, açık bir alanda çökün.",
      "Araçtaysanız yolu kapatmadan sağa yanaşın; binalardan, ağaçlardan ve tellerden uzakta durup el frenini çekin ve sarsıntı bitene kadar araçta kalın. Köprüde ya da çıkışa uzak bir tüneldeyseniz aracı durdurun, anahtarı üstünde bırakıp inin; tünelde aracın yanına çökün.",
      "Deniz kıyısındaysanız sarsıntı biter bitmez hızla yürüyerek yüksek bir yere ya da kıyıdan içeriye gidin; tsunami gelebilir."
    ],
    "dont": [
      "Sarsıntı sürerken binadan çıkmaya ya da başka odaya koşmaya çalışmayın.",
      "Asansöre binmeyin.",
      "Merdivenlere ve balkona koşmayın.",
      "Pencereden ya da balkondan atlamayın.",
      "Kapı eşiğinde durmayın; kapı eşiği daha sağlam değildir ve düşen eşyadan korumaz. Masa altı daha güvenlidir.",
      "\"Çök-Kapan-Tutun yapmayın, cenin pozisyonunda yatın\" diyen paylaşımlara uymayın. AFAD'ın anlattığı \"hayat üçgeni\", Çök-Kapan-Tutun'u sağlam bir eşyanın yanında yapmaktır; ayrı bir yöntem değildir."
    ],
    "keywords": [
      "deprem",
      "deprem oluyor",
      "deprem anı",
      "deprem anında",
      "deprem sırasında",
      "zelzele",
      "sarsıntı",
      "sallanıyor",
      "her yer sallanıyor",
      "yer sarsılıyor",
      "çök kapan tutun",
      "cok kapan tutun",
      "masa altı",
      "depremde nereye saklanılır",
      "deprem olurken",
      "hayat üçgeni",
      "kapı eşiği deprem"
    ],
    "sources": [
      "AFAD — Deprem Anında Neler Yapmalısınız? (masa altı ya da dolgun koltuk, kanepe, içi dolu sandık yanında Çök-Kapan-Tutun)",
      "AFAD — Okulda Deprem Anı ve Tahliye Tatbikatı Aşamaları (2022)",
      "AFAD — Deprem anında ve sonrasında yapılması gerekenler (Anadolu Ajansı alıntısı, memurlar.net)",
      "CDC — Stay Safe During an Earthquake",
      "ShakeOut — Drop, Cover, and Hold On",
      "Earthquake Country Alliance — Step 5: Drop, Cover, and Hold On",
      "Ready.gov — Earthquakes"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD deprem anı metni (AA/memurlar.net, cumhuriyet.com.tr alıntıları: asansör, balkon/merdiven, pencereden atlama, araçta durup içeride bekleme), AFAD okul tatbikat belgesi; CDC, ShakeOut. Masa yoksa adımı ve hayat üçgeni maddesi AFAD ile uyumlu; diğer adımlarda çelişki bulunmadı."
    },
    "art": [
      null,
      "deprem-cok",
      "deprem-kapan-masa",
      "deprem-tutun-masa",
      "deprem-koltuk-yani",
      null,
      "deprem-yatak-yastik",
      "deprem-acik-alan",
      "deprem-arac-dur",
      null
    ]
  },
  {
    "id": "deprem-sonrasi",
    "title": "Deprem sonrası ilk dakikalar",
    "tag": "DEPREM",
    "summary": "Sarsıntı bitince yaraları kontrol edin, ayakkabı giyin, gaz ve elektriği kapatın ve binadan dikkatle çıkıp toplanma alanına gidin.",
    "steps": [
      "Önce kendinizi, sonra yanınızdakileri yaralanmaya karşı kontrol edin.",
      "Ayakkabı giyin. Yerde cam kırıkları olabilir.",
      "Gaz kokusu alırsanız ateş yakmayın, elektrik düğmesine dokunmayın. Kapı ve pencereyi açıp binayı hemen terk edin.",
      "Güvenliyse doğalgaz vanasını ve su vanasını kapatın; gaz kokusu yoksa elektrik şalterini de indirin. Sobayı ve ısıtıcıyı söndürün.",
      "Artçı sarsıntılar olacaktır. Her artçıda yeniden Çök-Kapan-Tutun yapın.",
      "Binadan asansörle değil, merdivenden, sakin ve dikkatli şekilde çıkın.",
      "Afet çantanızı alıp yürüyerek toplanma alanına gidin.",
      "Hasarlı binaya eşya almak için bile geri girmeyin.",
      "Telefonu yalnızca acil durumlar için kullanın. Ailenize kısa mesaj atın.",
      "Pilli radyodan ya da telefondan AFAD ve valilik duyurularını izleyin."
    ],
    "dont": [
      "Asansör kullanmayın.",
      "Kibrit, çakmak ya da mum yakmayın; gaz kaçağı olabilir.",
      "Kopmuş elektrik tellerine yaklaşmayın.",
      "Hasarlı binaların ve duvarların dibinde beklemeyin.",
      "Telefon hatlarını uzun konuşmalarla meşgul etmeyin.",
      "Kapattığınız doğalgazı kendiniz açmayın; tesisatı ve cihazları önce yetkili firmaya ya da gaz dağıtım şirketine (187) kontrol ettirin."
    ],
    "keywords": [
      "deprem sonrası",
      "deprem sonrasi",
      "deprem bitti",
      "deprem durdu",
      "sarsıntı bitti",
      "depremden sonra",
      "artçı",
      "artçı deprem",
      "artci",
      "depremden sonra ne yapılır",
      "deprem oldu şimdi ne yapacağım",
      "binadan çıkış",
      "toplanma alanına gitmek"
    ],
    "sources": [
      "AFAD — Deprem Anında ve Sonrasında Yapılması Gerekenler",
      "AFAD — Deprem sonrası öneriler (TRT Haber, memurlar.net, cumhuriyet.com.tr alıntıları)",
      "DASK — Dersimiz Deprem atölye belgesi (deprem sonrası vana ve sigorta kapatma)",
      "Bursagaz — Depreme karşı uyarılar (ana kesme vanasını kapatma, 187, yetkili kontrol)",
      "Ready.gov — Earthquakes"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD (TRT Haber: ocağı ve su vanasını, gaz kokusu yoksa şalteri kapatın; operatörden arama yerine SMS; memurlar.net/cumhuriyet: sarsıntı geçince elektrik, gaz, su vanaları, soba söndürme), DASK, Bursagaz; Ready.gov. Şalter adımına 'gaz kokusu yoksa' koşulu ve kapatılan gazı yetkiliye açtırma uyarısı eklendi."
    },
    "art": [
      "deprem-yara-kontrol",
      "deprem-ayakkabi-cam",
      null,
      "gas-valve-off",
      null,
      "deprem-sonrasi-merdiven",
      "deprem-sonrasi-toplanma",
      null,
      "sms-send",
      null
    ]
  },
  {
    "id": "enkaz-altinda",
    "title": "Enkaz altında kalırsanız",
    "tag": "DEPREM",
    "summary": "Sakin kalın, ağzınızı kapatın, gücünüzü koruyun ve bağırmak yerine vurarak ya da düdükle yerinizi bildirin.",
    "steps": [
      "Sakin kalmaya çalışın. Gücünüzü koruyun.",
      "Ağzınızı ve burnunuzu bir bezle ya da giysinizle kapatın. Tozu solumayın.",
      "Gereksiz hareket etmeyin. Toz kaldırmayın.",
      "Bağırmak yerine düdük çalın ya da boruya, duvara vurarak ses çıkarın.",
      "Dışarıdaki sesleri dinleyin. Kurtarıcılar sessizlik istediğinde ses verin; o anda sizi dinliyorlar.",
      "Telefonunuz çekiyorsa 112'yi arayın ya da yerinizi kısa mesajla bildirin.",
      "Telefonun pilini koruyun. Ekranı kapalı tutun.",
      "Kanayan bir yeriniz varsa üzerine bastırın.",
      "Suyunuz varsa az az için."
    ],
    "dont": [
      "Kibrit ya da çakmak yakmayın; gaz kaçağı olabilir.",
      "Sürekli bağırmayın; gücünüz tükenir, toz yutarsınız.",
      "Üzerinizdeki sağlam görünmeyen parçaları itip çekmeyin; çökebilir."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "enkaz",
      "enkaz altı",
      "enkaz altında",
      "enkaz altinda",
      "göçük altında",
      "sıkıştım",
      "mahsur kaldım",
      "bina çöktü üstüme",
      "yıkıntı altında",
      "altında kaldım",
      "sesimi duyan var mı",
      "kurtarın beni",
      "beton altında"
    ],
    "sources": [
      "AFAD — Afet Bilinci Eğitimi",
      "AFAD — Enkaz altında öneriler (memurlar.net, cumhuriyet.com.tr alıntıları)",
      "Ready.gov — Earthquakes (If you are trapped)",
      "CDC — Stay Safe During an Earthquake"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD alıntıları (paniklememe, kibrit/çakmak yakmama, toz kaldırmama, ağız-burun kapatma, boru/duvara vurma ya da ıslık, bağırmak son çare, enerji tasarrufu, riskli hareketten kaçınma, telefonu acil dışında kullanmama); Ready.gov. Çelişki yok, değişiklik yapılmadı."
    },
    "art": [
      null,
      "deprem-enkaz-agiz-kapat",
      null,
      "deprem-enkaz-vurma",
      "deprem-enkaz-dinle",
      "call-112",
      null,
      null,
      null
    ]
  },
  {
    "id": "enkaz-kurtarma",
    "title": "Enkazdan kurtarma yaparken (gönüllüler için)",
    "tag": "DEPREM",
    "summary": "Kurtarmaya yardım ederken önce kendi güvenliğinizi sağlayın, ağır hasarlı yapıya girmeyin ve profesyonel ekiplerin talimatına uyun.",
    "steps": [
      "Önce kendi güvenliğiniz: ağır hasarlı ya da çökmek üzere olan yapıya asla girmeyin.",
      "Kask, iş eldiveni, toz maskesi ve sağlam ayakkabı kullanın.",
      "Gaz kokusu, akan su ve kopuk elektrik kabloları olup olmadığına bakın.",
      "112'ye haber verin. AFAD, itfaiye ya da UMKE ekibi geldiyse onların talimatına uyun.",
      "Önce yüzeydeki, kolay ulaşılabilen kişilere yardım edin.",
      "Herkesten sessizlik isteyin. Seslenin, vurun ve cevap için durup dinleyin.",
      "Enkazı küçük parçalar halinde kaldırın. Ağır parçayı kaldıraç ve takozla, azar azar yükseltin. Kolon ve kirişe dokunmayın.",
      "Çıkardığınız kişiyi gereksiz yere hareket ettirmeyin; boyun ya da sırt yaralanması olabilir.",
      "Aradığınız yerleri işaretleyin. Kimin nerede olduğunu yetkililere bildirin. Nöbetleşe çalışıp dinlenin."
    ],
    "dont": [
      "Tek başınıza çalışmayın; yanınızda mutlaka biri olsun.",
      "Kolon, kiriş ya da taşıyıcı duvar kesmeyin, yerinden oynatmayın.",
      "Enkaz üzerinde ateş yakmayın, sigara içmeyin.",
      "Uzun süre sıkışmış birini aceleyle çekip çıkarmayın; [[ezilme-yaralanmasi|\"Ezilme yaralanması\" rehberine]] bakın."
    ],
    "callEmergency": true,
    "keywords": [
      "enkaz kurtarma",
      "arama kurtarma",
      "gönüllü kurtarma",
      "gonullu",
      "enkaz kaldırma",
      "enkazdan çıkarma",
      "enkazdan insan çıkarmak",
      "enkazda yardım etmek",
      "enkazda ses var",
      "komşu enkaz altında",
      "komşum enkaz altında",
      "enkazdan ses geliyor",
      "kurtarıcı",
      "takoz kaldıraç"
    ],
    "sources": [
      "AFAD — Afet Bilinci Eğitimi",
      "FEMA CERT — Light Search and Rescue Operations"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: önceki CERT kontrolü korundu (bu oturumda CERT sayfası yeniden açılamadı); Ready.gov enkaz çevresinde dikkat uyarısı."
    },
    "art": [
      "deprem-kurtarma-girme",
      "deprem-kurtarma-koruyucu",
      null,
      "call-112",
      null,
      "deprem-kurtarma-sessizlik",
      "deprem-kurtarma-takoz",
      null,
      "deprem-kurtarma-isaretle"
    ]
  },
  {
    "id": "deprem-kalabalik-alan",
    "title": "Kalabalık yerde deprem: AVM, okul, stadyum, toplu taşıma",
    "tag": "DEPREM",
    "summary": "Kapılara koşmayın; olduğunuz yerde çöküp başınızı koruyun ve sarsıntı bitince görevlileri dinleyerek yavaşça çıkın.",
    "steps": [
      "Kapılara ve çıkışlara koşmayın. Herkes aynı kapıya koşar; ezilme tehlikesi olur.",
      "Olduğunuz yerde çökün. Başınızı ve ensenizi kollarınızla koruyun.",
      "Mağazada raflardan, camlardan ve asılı tabelalardan uzaklaşın. Alışveriş arabasının ya da giysi askısının yanına çökün.",
      "Stadyum, sinema ya da salondaysanız koltuğunuzun önüne çökün ya da öne eğilip başınızı kollarınızla koruyun.",
      "Okuldaysanız sıranın altına girip sıranın ayağını tutun. Öğretmenin söylediğini yapın.",
      "Otobüs, metro ya da trendeyseniz oturun ya da yere çökün ve tutamağa sıkıca tutunun.",
      "Görevli söylemeden metro ya da trenden raylara ve tünele inmeyin.",
      "Sarsıntı bitince görevlilerin yönlendirmesiyle yavaşça, yürüyerek çıkın. Asansöre binmeyin.",
      "Dışarıda binalardan uzak, açık bir alanda bekleyin. Çocuğunuzu elinden tutun."
    ],
    "dont": [
      "Sarsıntı sürerken çıkışa doğru koşmayın, insanları itmeyin.",
      "Asansör ve yürüyen merdiven kullanmayın.",
      "Cam vitrinlerin ve yüksek rafların dibinde durmayın.",
      "Metroda acil kapı kolunu çekip raylara inmeyin."
    ],
    "keywords": [
      "avm deprem",
      "alışveriş merkezinde deprem",
      "avmde deprem",
      "stadyumda deprem",
      "maçta deprem",
      "sinemada deprem",
      "konserde deprem",
      "metroda deprem",
      "otobüste deprem",
      "trende deprem",
      "marmarayda deprem",
      "kalabalıkta deprem",
      "markette deprem",
      "okulda deprem",
      "sınıfta deprem"
    ],
    "sources": [
      "CDC — Stay Safe During an Earthquake (crowded places, stadium)",
      "Earthquake Country Alliance — Step 5 (store, stadium/theater)",
      "AFAD — Deprem anında öneriler (cumhuriyet.com.tr alıntısı: gerekmedikçe metro ve trenden inmeyin, tutunun, personele uyun)",
      "Metro İstanbul / İBB AKOM — Metroda deprem önerileri (karar.com, 2020)",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD (metro/trenden gerekmedikçe inmeme, sıkıca tutunma, personel talimatı), Metro İstanbul/İBB AKOM (tutamağa tutunma, anons olmadıkça aracı terk etmeme, görevli talimatı, yürüyen merdivende el bandına tutunma); CDC, ECA Step 5. Değişiklik gerekmedi."
    },
    "art": [
      "deprem-kalabalik-kosma",
      null,
      "deprem-magaza-raf",
      "deprem-stadyum-koltuk",
      null,
      "deprem-metro-tutun",
      null,
      "deprem-kalabalik-cikis",
      null
    ]
  },
  {
    "id": "deprem-hasarli-bina",
    "title": "Hasarlı binaya geri girilir mi?",
    "tag": "DEPREM",
    "summary": "Hasar tespiti yapılıp yetkililer izin vermeden hasarlı binaya girmeyin; şüphedeyseniz dışarıda kalın.",
    "steps": [
      "Artçılar sürerken ve yetkililer izin vermeden binaya girmeyin.",
      "Önce dışarıdan bakın: eğilme, çökmüş kat, kopan sıva ve dış duvar parçaları.",
      "Kolon ya da kirişte çatlak, eğilmiş bina, ilk kez sıkışan kapı-pencere ya da hasarlı merdiven görürseniz girmeyin.",
      "Gaz kokusu ya da tıslama sesi varsa uzaklaşın ve 112'ye bildirin.",
      "Hasar tespit sonucunu öğrenin. Binaları Çevre, Şehircilik ve İklim Değişikliği Bakanlığı ekipleri inceler; sonuç e-Devlet'ten, valilik sitesinden ya da muhtarlıktaki listeden öğrenilebilir.",
      "\"Acil yıkılacak\" ya da \"yıkık\" denen binaya hiçbir şekilde girmeyin. \"Ağır hasarlı\" binada oturulmaz; eşya almak için bile ancak uzman raporu izin verirse girilir.",
      "\"Orta hasarlı\" binada onarım ve güçlendirme yapılmadan oturmayın.",
      "Eşya almanız gerekiyorsa yalnızca yetkililerin izniyle, kolluk gözetiminde ve raporda yazan süre içinde (ör. 30 dakika ya da 2 saat) girin. Artçı olursa hemen çıkın.",
      "Girerken kask, eldiven ve sağlam ayakkabı giyin. Işık için el feneri kullanın; çakmak ya da mum yakmayın.",
      "Hasarsız ya da az hasarlı denen binada bile yeni çatlak görürseniz çıkın ve yeniden inceleme isteyin."
    ],
    "dont": [
      "\"Bir şey olmaz\" deyip eşya almak için hasarlı binaya girmeyin.",
      "Hasarlı binanın dibinde ya da balkon altında beklemeyin.",
      "Kolon, kiriş ya da duvara monte parçaları sökmeyin; titreşim binayı çökertebilir.",
      "Elektriği ve gazı kontrol ettirmeden açmayın."
    ],
    "keywords": [
      "hasarlı bina",
      "hasarli bina",
      "eve girebilir miyim",
      "evime dönebilir miyim",
      "eve geri girmek",
      "binaya girmek güvenli mi",
      "evde çatlak var",
      "kolonda çatlak",
      "duvar çatladı",
      "hasar tespit",
      "ağır hasarlı",
      "orta hasarlı",
      "az hasarlı",
      "eşya almak için girmek",
      "bina oturulabilir mi"
    ],
    "sources": [
      "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı — Hasar tespit sınıfları",
      "İçişleri ve Çevre Bakanlıkları — Hasarlı yapılara giriş genelgesi (2023, AFAD; NTV haberi)",
      "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Kilis İl Md. — Hasar tespit soru-cevap (2023)",
      "FLASH — Inspect your home after a disaster"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: ÇŞİDB Kilis soru-cevap (hasar sınıfları; orta hasarlı güçlendirmeden kullanılamaz; sonuçlar e-Devlet, hasartespit.csb.gov.tr, valilik, muhtarlık), 2023 AFAD genelgesi (yıkık/acil yıkılacağa giriş yasak; ağır hasarlıda uzman raporuna göre 30 dk ya da 2 saat, kolluk gözetimi; sabit eşya sökme ve titreşim yasak). Ağır hasarlı için 'hiçbir şekilde' ifadesi genelgeye göre düzeltildi."
    },
    "art": [
      null,
      "deprem-bina-dis-kontrol",
      "deprem-bina-kolon-catlak",
      null,
      "deprem-hasar-tespit",
      "deprem-bina-yasak",
      null,
      null,
      "deprem-bina-fener",
      null
    ]
  },
  {
    "id": "deprem-cocuklar",
    "title": "Depremde bebek ve çocukları korumak",
    "tag": "DEPREM",
    "summary": "Yanınızdaki bebeği göğsünüze alıp Çök-Kapan-Tutun yapın; başka odadaki çocuğa koşmayın, ona seslenerek ne yapacağını söyleyin.",
    "steps": [
      "Yanınızdaki bebeği ya da küçük çocuğu kucağınıza alın, göğsünüze bastırın ve birlikte çökün.",
      "Çocuğu vücudunuzla örtün. Mümkünse masa altına girin, bir kolunuzla kendi başınızı koruyun.",
      "Emziriyorsanız oturduğunuz ya da yattığınız yerde kalın. İkinizi yastık ya da battaniyeyle koruyun.",
      "Çocuk başka odadaysa sarsıntı sürerken ona koşmayın. Olduğunuz yerde çökün.",
      "Çocuğa sakin sesle \"Çök, kapan, tutun!\" diye seslenin. Birlikte yüksek sesle sayın.",
      "Sarsıntı bitince 60'a kadar sayıp kalkın. Üstünüze ve çevrenize bakarak çocuğa gidin.",
      "Çocuğa ayakkabı giydirin ve elinden tutun. Kalabalıkta kaybolmasın diye adınızı ve telefonunuzu cebine koyun.",
      "Çocuğa güvende olduğunu söyleyin, sarılın ve yanınızdan ayırmayın.",
      "Önceden: karyolayı ve çocuk yatağını pencereden uzağa koyun, üstüne ağır tablo ya da raf asmayın.",
      "Çocuğunuzla Çök-Kapan-Tutun tatbikatını oyun gibi, sık sık yapın."
    ],
    "dont": [
      "Sarsıntı sürerken çocuğu kucaklayıp merdivene ya da dışarı koşmayın.",
      "Bebeği kucağınızda tutarken ayakta kalmayın; düşersiniz.",
      "Çocuğu korkutacak şekilde bağırmayın; sakin sesle yönlendirin.",
      "Çocuğu kalabalık toplanma alanında yalnız bırakmayın."
    ],
    "keywords": [
      "depremde bebek",
      "bebekle deprem",
      "depremde çocuk",
      "çocuğumu nasıl korurum deprem",
      "deprem çocuk odası",
      "bebek kucakta deprem",
      "emzirirken deprem",
      "karyola deprem",
      "çocuklara çök kapan tutun öğretmek",
      "cocuk deprem",
      "deprem tatbikatı çocuk",
      "çocuk depremden korktu"
    ],
    "sources": [
      "ShakeOut — Earthquake Safety for Young Children and Infants",
      "ShakeOut BC — Infants and Young Children Fact Sheet",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC (başka odaya koşmama), ShakeOut (yılda en az bir tatbikat). Bebek/emzirme ve 60'a kadar sayma adımları ShakeOut bebek notundan; bu oturumda belge açılamadı."
    },
    "alsoIn": [
      "ozel-gruplar"
    ],
    "art": [
      "deprem-bebek-gogus",
      null,
      null,
      "deprem-cocuga-seslen",
      null,
      null,
      "deprem-cocuk-el-tut",
      "deprem-cocuk-sakinlestir",
      "deprem-karyola",
      null
    ]
  },
  {
    "id": "deprem-yuksek-bina",
    "title": "Yüksek katta ya da gökdelende deprem",
    "tag": "DEPREM",
    "summary": "Binadan çıkmaya çalışmayın; pencere ve dış duvarlardan uzakta Çök-Kapan-Tutun yapın, asansöre binmeyin.",
    "steps": [
      "Olduğunuz katta kalın. Merdivene ve çıkışa koşmayın.",
      "Pencerelerden, cam cephelerden ve dış duvarlardan uzaklaşın.",
      "Sağlam bir masanın altına girip Çök-Kapan-Tutun yapın. Masa yoksa dolgun bir koltuk ya da kanepe gibi sağlam, alçak bir eşyanın yanına çökün.",
      "Yüksek binalar uzun süre salınabilir. Sarsıntı tamamen bitene kadar yerinizde kalın.",
      "Yangın alarmı ya da tavandaki fıskiyeler çalışabilir. Panik yapmayın.",
      "Asansördeyseniz bütün kat düğmelerine basın ve ilk açılan katta inin. Kapı açılmazsa alarm düğmesine basıp bekleyin.",
      "Sarsıntı bitince asansör kullanmayın, merdivenden inin.",
      "Merdivende tırabzanı tutun, itişmeden sırayla inin. Düşmüş eşyalara ve kırık camlara dikkat edin.",
      "Mahsur kalırsanız boruya ya da metal bir yere vurarak ses verin."
    ],
    "dont": [
      "Sarsıntı sürerken merdivenlere koşmayın.",
      "Balkona çıkmayın, pencereden sarkmayın ya da atlamayın.",
      "Deprem sonrası asansöre binmeyin.",
      "Cam cephenin önünde beklemeyin."
    ],
    "keywords": [
      "yüksek katta deprem",
      "yuksek katta deprem",
      "gökdelende deprem",
      "rezidansta deprem",
      "plazada deprem",
      "ofiste deprem",
      "iş yerinde deprem",
      "apartman üst kat deprem",
      "yüksek bina deprem",
      "asansörde deprem",
      "asansorde deprem",
      "10. katta deprem",
      "bina sallanıyor yüksek kat"
    ],
    "sources": [
      "CDC — Stay Safe During an Earthquake (high-rise)",
      "ShakeOut — Recommended Earthquake Safety Actions (high-rise)",
      "Metro İstanbul / İBB AKOM — Asansörde deprem (tüm kat düğmeleri, ilk durduğu katta inme, interkom; karar.com, 2020)",
      "AFAD — Deprem anında öneriler (balkon, asansör; memurlar.net alıntısı)",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Metro İstanbul/İBB AKOM (asansörde tutamağa tutun, tüm kat düğmelerine bas, ilk durduğu katta in, ara katta kalırsa interkom), AFAD (asansör ve balkon yasağı); CDC, ECA. Masa yoksa adımı AFAD'ın dolgun koltuk/kanepe yanı önerisiyle uyumlu hale getirildi."
    },
    "art": [
      null,
      "deprem-yuksek-pencere-uzak",
      "deprem-yuksek-masa",
      null,
      null,
      "deprem-asansor-dugme",
      "deprem-yuksek-merdiven-asansor",
      "deprem-merdiven-in",
      "deprem-yuksek-vurma"
    ]
  }
];
