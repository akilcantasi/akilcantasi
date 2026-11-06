// Rehber kategorisi: Yangın
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "yangin",
  "title": "Yangın",
  "hint": "Duman, kaçış, orman yangını",
  "art": "cat-yangin",
  "color": "#ff7043",
  "order": 2
};

export const GUIDES: Guide[] = [
  {
    "id": "yangin",
    "title": "Yangın ve duman: binadan kaçış",
    "tag": "YANGIN",
    "summary": "Yangında herkesi uyarın, hemen dışarı çıkın, dumanın altından eğilerek ilerleyin ve dışarıdan 112'yi arayın.",
    "steps": [
      "\"Yangın var!\" diye bağırarak herkesi uyarın.",
      "Hemen dışarı çıkın. Eşya almak için durmayın; kaçmak için 2 dakikanız bile olmayabilir.",
      "Dumanda eğilerek ya da emekleyerek ilerleyin. Temiz hava yere yakındır. Elinizin altındaysa ağzınızı ve burnunuzu ıslak bir bezle kapatın ama bunun için oyalanmayın.",
      "Kapıyı açmadan önce elinizin tersiyle dokunun. Sıcaksa açmayın, başka çıkış kullanın.",
      "Çıkarken kapıları arkanızdan kapatın; yangın ve duman yavaşlar.",
      "Dışarı çıkınca 112'yi arayın. Adresi ve içeride kimse kalıp kalmadığını söyleyin.",
      "Yangın küçükse, söndürücünüz varsa ve çıkış arkanızdaysa söndürmeyi deneyebilirsiniz. Emin değilseniz çıkın.",
      "Çıkamıyorsanız bir odaya girip kapıyı kapatın, kapı altını ıslak havluyla tıkayın, 112'yi arayın ve pencereden işaret verin.",
      "Giysiniz tutuşursa durun, yere yatın, yüzünüzü ellerinizle kapatın ve yuvarlanın."
    ],
    "dont": [
      "Asansör kullanmayın.",
      "Dışarı çıktıktan sonra eşya ya da evcil hayvan için içeri geri girmeyin.",
      "Saklanmak için dolaba ya da yatak altına girmeyin.",
      "Sıcak kapıyı açmayın.",
      "Yanan yağa ve elektrik yangınına su dökmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "yangın",
      "yangin",
      "yangın var",
      "yangın çıktı",
      "ev yanıyor",
      "evde yangın",
      "ev yangını",
      "bina yanıyor",
      "duman",
      "dumandan kaçış",
      "her yer duman",
      "alev",
      "ateş aldı",
      "itfaiye",
      "yangından kaçış"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Fire / If a fire starts (redcross.org)",
      "ABD İtfaiye İdaresi (USFA) — Home fire escape plans",
      "AFAD — Afet Bilinci Eğitimi",
      "AFAD yangın anı uyarıları (Ulusal Kanal haberi, ulusal.com.tr): 112'ye ihbar, eğilerek ilerleme, ağız-burnu ıslak bezle kapatma, saklanmama, kapı altına ıslak bez"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD yangın uyarıları (ulusal.com.tr alıntısı), Prof. Dr. Asım Kalkan/AA (asansör, kapı altına ıslak bez), Amerikan Kızılhaçı, USFA; #3'e AFAD'ın 'ağız ve burnu ıslak bezle kapatın' önerisi oyalanmadan koşuluyla eklendi."
    },
    "art": [
      null,
      null,
      "yangin-emekle",
      "yangin-kapi-dokun",
      "yangin-kapi-kapat",
      "call-112",
      null,
      "yangin-oda-havlu",
      "yangin-dur-yat-yuvarlan"
    ]
  },
  {
    "id": "orman-yangini",
    "title": "Orman yangını",
    "tag": "ORMAN YANGINI",
    "summary": "Yangını görünce 112'ye bildirin ve rüzgârın tersine, yangının yanından uzaklaşın. Yokuş yukarı kaçmayın.",
    "steps": [
      "Duman ya da alev görürseniz hemen 112'yi arayın ve yeri tarif edin.",
      "Yangına kendiniz müdahale etmeyin; hemen uzaklaşın.",
      "Rüzgârın estiği yönün tersine ve yangının yan tarafına doğru kaçın.",
      "Yokuş yukarı kaçmayın; yangın yokuş yukarı çok hızlı ilerler.",
      "Yetkililer tahliye derse hemen ayrılın. Tehlike hissederseniz uyarıyı beklemeden ayrılın.",
      "Araçtaysanız camları ve havalandırmayı kapatın, farları yakın, dumansız yöne yavaşça sürün.",
      "Araçla yolunuz kesildiyse bitki olmayan açık bir yerde durun. Farları açık bırakıp motoru kapatın, aracın tabanına eğilip üstünüzü battaniye ya da montla örtün.",
      "Yayaysanız ve yolunuz kesildiyse zaten yanmış bir alana, çıplak toprağa ya da kayalığa geçin. Yüzüstü yatıp yüzünüzü kapatın.",
      "Deniz kıyısındaysanız ve kara yolu kesildiyse teknelerin yanaşabileceği iskeleye ya da sahile gidin.",
      "Ağzınızı ve burnunuzu nemli bir bezle kapatın."
    ],
    "dont": [
      "Fotoğraf ya da video çekmek için durmayın.",
      "Dar ve tek çıkışlı vadilere, yangına doğru giden yollara girmeyin.",
      "Ormanda ateş yakmayın, sigara atmayın, cam şişe bırakmayın.",
      "Yangın geçerken araçtan inip koşmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "orman yangını",
      "orman yangini",
      "orman yanıyor",
      "ağaçlar yanıyor",
      "dağ yanıyor",
      "tepe yanıyor",
      "anız yangını",
      "makilik yanıyor",
      "yangın köye yaklaşıyor",
      "yangın yaklaşıyor",
      "dağda duman görüyorum",
      "177",
      "yangın ihbar"
    ],
    "sources": [
      "OGM — Orman Yangınlarıyla Mücadele",
      "AFAD — Afet Bilinci Eğitimi",
      "Amerikan Kızılhaçı — Wildfire",
      "CAL FIRE — Ready for Wildfire: Go! Evacuation Guide",
      "TEMA Vakfı — Orman yangınları sırasında (112/177 ihbar, araçla orman yolundan kaçmama, deniz kenarında teknelerin alabileceği noktada toplanma)",
      "ÇSGB — Orman Yangını ile Mücadelede İSG Rehberi (ağız-burnu ıslak bezle kapatma, eğilerek hareket)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: TEMA (orman yangınları sırasında), ÇSGB orman yangını rehberi, CAL FIRE, Amerikan Kızılhaçı; deniz kıyısında tekneyle tahliye adımı eklendi (#9). Far açık/motor kapalı ayrıntısı Türk kaynaklarında yok, hâlâ doğrulanamadı."
    },
    "alsoIn": [
      "doga"
    ],
    "art": [
      "call-112",
      null,
      "yangin-orman-ruzgar",
      "yangin-orman-yokus",
      "yangin-orman-tahliye",
      null,
      null,
      "yangin-orman-yanmis-alan",
      null,
      null
    ]
  },
  {
    "id": "yangin-sondurucu",
    "title": "Yangın söndürücü (tüp) nasıl kullanılır",
    "tag": "YANGIN",
    "summary": "Yalnızca küçük yangında ve çıkış arkanızdayken: pimi çekin, hortumu ateşin dibine doğrultun, kolu sıkın, sağa sola süpürün.",
    "steps": [
      "Önce herkesi uyarın ve 112'nin arandığından emin olun.",
      "Yalnızca yangın küçükse (çöp kovası, tava kadar) ve çıkış arkanızdaysa söndürmeyi deneyin.",
      "Ateşe yaklaşık 2 metre uzakta durun. Rüzgâr arkanızdan essin.",
      "ÇEK: Pimi çekin. Hortumu kendinize değil, ateşe doğru tutun.",
      "DOĞRULT: Hortumu alevlere değil, ateşin dibine doğrultun.",
      "SIK: Kolu yavaşça ve eşit şekilde sıkın.",
      "SÜPÜR: Hortumu sağa sola süpürür gibi hareket ettirin.",
      "Ateş sönse de yeniden alevlenebilir. Ateşe sırtınızı dönmeden geri çekilin ve izleyin.",
      "Tüp bittiyse ya da yangın büyüyorsa hemen çıkın ve kapıyı kapatın.",
      "Kullandığınız tüpü yeniden doldurtun. Tüpün basınç göstergesini ara ara kontrol edin."
    ],
    "dont": [
      "Duman dolu odada ya da tavana ulaşmış yangında söndürmeye çalışmayın.",
      "Yangınla çıkış kapısı arasında kalmayın.",
      "Hortumu alevlerin üst kısmına sıkmayın.",
      "Tüp boşaldıktan sonra yangınla uğraşmaya devam etmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "yangın söndürücü",
      "yangin sondurucu",
      "yangın tüpü",
      "yangin tupu",
      "tüp nasıl kullanılır",
      "söndürme tüpü",
      "kkt tüpü",
      "abc tüpü",
      "pimi çek",
      "pass yöntemi",
      "tüp sıkmak",
      "yangın tüpü kullanımı"
    ],
    "sources": [
      "ABD İtfaiye İdaresi (USFA) — Fire extinguishers",
      "AFAD — Afet Bilinci Eğitimi",
      "Ankara İtfaiyesi — Alev alan yağa su dökülmemeli (KKT'li söndürücüyle yaklaşık 2 metreden müdahale), ankara.bel.tr, 13.03.2025",
      "Sivas Cumhuriyet Üniv. ve Ardahan Üniv. yangın söndürme cihazı kullanma talimatları (pimi çek, rüzgârı arkaya al, hortumu yangının çıkış noktasına doğrult, tetiğe bas, sağa-sola tara, 6 aylık kontrol)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Ankara İtfaiyesi (≈2 m), Cumhuriyet ve Ardahan Üniv. kullanma talimatları, USFA PASS; mesafe '2–3 metre' → 'yaklaşık 2 metre' (Türk kaynaklarında 1–2 m, OSHA 1,8–2,4 m)."
    },
    "art": [
      null,
      "yangin-tup-cikis-arkada",
      null,
      "yangin-tup-pim",
      "yangin-tup-dogrult",
      "yangin-tup-sik",
      "yangin-tup-supur",
      null,
      null,
      null
    ]
  },
  {
    "id": "yangin-yag",
    "title": "Mutfakta yağ yangını (tava, fritöz)",
    "tag": "YANGIN",
    "summary": "Yanan yağa asla su dökmeyin; ocağı kapatın ve tavanın üstünü kapakla ya da yangın battaniyesiyle örtün.",
    "steps": [
      "Yanan yağa asla su dökmeyin. Su, yanan yağı patlatır gibi etrafa saçar.",
      "Ocağı kapatın.",
      "Tavanın üstünü kapakla ya da metal bir tepsiyle örtün. Kapağı kendinizden uzağa doğru kaydırın.",
      "Kapak yoksa yangın battaniyesiyle ya da suyu iyice sıkılmış nemli bir mutfak beziyle örtün.",
      "Tavayı yerinden oynatmayın, taşımayın, lavaboya götürmeyin.",
      "Tava tamamen soğuyana kadar kapağı açmayın.",
      "Fırında yangın çıkarsa fırını kapatın ve kapağını kapalı tutun.",
      "Ateş sönmezse ya da büyürse hemen çıkın, kapıyı kapatın ve 112'yi arayın."
    ],
    "dont": [
      "Su dökmeyin; suyu damlayan, sırılsıklam bez atmayın.",
      "Un, şeker ya da başka toz yiyecek dökmeyin.",
      "Yanan tavayı dışarı ya da lavaboya taşımayın.",
      "Ocakta yemek varken mutfaktan ayrılmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "yağ yangını",
      "yag yangini",
      "tava yanıyor",
      "tavada yağ alev aldı",
      "yağ tutuştu",
      "kızgın yağ yandı",
      "fritöz yanıyor",
      "mutfak yangını",
      "mutfakta yangın",
      "ocak yanıyor",
      "fırın yanıyor",
      "yangın battaniyesi"
    ],
    "sources": [
      "ABD İtfaiye İdaresi (USFA) — Cooking fire safety",
      "NFPA — Cooking safety",
      "AFAD — Afet Bilinci Eğitimi",
      "Ankara İtfaiyesi — Alev alan yağa su dökülmemeli, ankara.bel.tr, 13.03.2025 (kapak yoksa nemli bez ya da kalın havlu)",
      "İstanbul İtfaiyesi tencere yangını uyarısı (manisahaberleri.com alıntısı): su dökme, ocağı kapat, kapak/tepsi/nemli mutfak bezi/yangın battaniyesiyle ört, tencereyi oynatma, sönmezse çık-kapıyı kapat-112"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Ankara ve İstanbul İtfaiyesi uyarıları, USFA; ÇELİŞKİ düzeltildi: yasak listesi 'ıslak bez atmayın' diyordu, Türk itfaiyeleri kapak yoksa nemli bez/havluyla örtmeyi öğretiyor → #4'e 'suyu iyice sıkılmış nemli mutfak bezi' eklendi, yasak 'sırılsıklam bez' olarak daraltıldı."
    },
    "art": [
      "yangin-yag-su-yasak",
      "yangin-yag-ocak-kapat",
      "yangin-yag-kapak",
      "yangin-yag-battaniye",
      null,
      null,
      null,
      "call-112"
    ]
  },
  {
    "id": "yangin-elektrik",
    "title": "Elektrik yangını (priz, kablo, cihaz)",
    "tag": "YANGIN",
    "summary": "Elektrik yangınına su dökmeyin; güvenliyse fişi çekin ya da şalteri indirin, hemen sönmezse çıkıp 112'yi arayın.",
    "steps": [
      "Su dökmeyin. Su elektriği iletir, çarpılırsınız.",
      "Yanan cihaza, kabloya ve prize dokunmayın.",
      "Güvenliyse sigorta kutusundan ana şalteri indirin ya da fişi kuru bir elle, kablosundan değil fişten tutarak çekin.",
      "Elektrik kesilince küçük yangını ABC tozlu ya da karbondioksitli söndürücüyle söndürün.",
      "Duman ve alev hemen azalmazsa binadan çıkın, kapıyı kapatın ve 112'yi arayın.",
      "Dumanı solumamak için eğilerek uzaklaşın.",
      "Sönse bile elektrikçiye kontrol ettirmeden o hattı ve cihazı kullanmayın."
    ],
    "dont": [
      "Su ya da sulu söndürücü kullanmayın.",
      "Şalter inmeden yangına yaklaşmayın.",
      "Isıtıcı gibi yüksek güçlü cihazları uzatma kablosuna takmayın.",
      "Yanık kokusu gelen, ısınan ya da kıvılcım çıkaran prizi kullanmaya devam etmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "elektrik yangını",
      "elektrik yangini",
      "priz yanıyor",
      "priz alev aldı",
      "kablo yanıyor",
      "kablodan duman",
      "sigorta kutusu yanıyor",
      "elektrik panosu yanıyor",
      "televizyon yanıyor",
      "çamaşır makinesi yanıyor",
      "ısıtıcı alev aldı",
      "cihaz duman çıkarıyor"
    ],
    "sources": [
      "ABD İtfaiye İdaresi (USFA) — Fire extinguishers (C sınıfı)",
      "ABD İtfaiye İdaresi (USFA) — Appliances and electrical",
      "AFAD — Afet Bilinci Eğitimi",
      "Ardahan Üniv. yangın söndürme cihazı kullanma talimatı (elektrikte önce akımı kes)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Ardahan Üniv. söndürücü talimatı (önce elektriği kes), Ankara İtfaiyesi (KKT'li söndürücü), USFA; değişiklik yok. İstanbul İtfaiyesi sayfası açılamadı."
    },
    "art": [
      "yangin-elektrik-su-yasak",
      null,
      "yangin-elektrik-salter",
      "yangin-elektrik-tup",
      "call-112",
      null,
      null
    ]
  },
  {
    "id": "yangin-arac",
    "title": "Araç yangını",
    "tag": "YANGIN",
    "summary": "Araçta duman ya da alev görürseniz güvenli yere çekip motoru kapatın, herkesi indirip en az 30 metre uzaklaşın ve 112'yi arayın.",
    "steps": [
      "Güvenli olur olmaz yolun kenarına çekip durun. Dörtlüleri yakın.",
      "Motoru kapatın.",
      "Herkesi araçtan indirin. Eşya almak için durmayın.",
      "Araçtan en az 30 metre uzaklaşın ve trafikten uzak durun.",
      "112'yi arayın.",
      "Kaputu ya da bagajı açmayın. İçeri hava girerse yangın büyür.",
      "Yangın küçükse ve araçta söndürücü varsa kaputu açmadan, kaput kenarındaki aralıktan ya da ön ızgaradan sıkabilirsiniz. Alev büyükse, araç elektrikliyse ya da emin değilseniz uzak durup itfaiyeyi bekleyin.",
      "Araç elektrikli ya da hibritse 112'ye söyleyin. Pil yangını sönmüş gibi görünüp yeniden alevlenebilir."
    ],
    "dont": [
      "Eşya almak için yanan araca geri dönmeyin.",
      "Kaputu açmayın.",
      "Tünelde aracın içinde beklemeyin; yürüyerek en yakın acil çıkışa gidin.",
      "Yanan aracın arkasında ya da yanında, yol üzerinde durmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "araç yangını",
      "arac yangini",
      "araba yanıyor",
      "araba yaniyor",
      "arabadan duman çıkıyor",
      "kaputtan duman",
      "motor yanıyor",
      "araç alev aldı",
      "otomobil yangını",
      "elektrikli araç yanıyor",
      "otobüs yanıyor",
      "lpg araç yangın"
    ],
    "sources": [
      "ABD İtfaiye İdaresi (USFA) — Vehicle fires",
      "NHTSA — Electric and hybrid vehicles",
      "Erzurum BB İtfaiyesi — Araç yangını güvenlik tavsiyesi (itfaiye.erzurum.bel.tr; İstanbul İtfaiyesi'nin aynı başlıklı sayfası açılamadı): kaputu açmadan kenarından ya da ızgaradan kuru tozlu/köpüklü söndürücü sık, tereddütte müdahale etme"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Erzurum İtfaiyesi araç yangını tavsiyesi, USFA Vehicle fires, NHTSA; ÇELİŞKİ uyumlandı: #7 'kendiniz söndürmeye çalışmayın' idi, Türk itfaiyesi küçük yangında kaputu açmadan aralıktan söndürücü sıkmayı öğretiyor → küçük yangında kaput aralığından sıkma, büyük/elektrikli/emin değilse uzak durma."
    },
    "alsoIn": [
      "ulasim"
    ],
    "art": [
      "yangin-arac-kenara-cek",
      null,
      "yangin-arac-in",
      "yangin-arac-uzaklas",
      "call-112",
      "yangin-arac-kaput-yasak",
      null,
      null
    ]
  },
  {
    "id": "yangin-yuksek-bina",
    "title": "Apartman ve yüksek binada yangından kaçış",
    "tag": "YANGIN",
    "summary": "Yangın dairenizdeyse hemen çıkın; başka kattaysa koridor ve merdiven dumansızsa çıkın, değilse kapıyı kapatıp dairede bekleyin ve 112'ye yerinizi söyleyin.",
    "steps": [
      "Yangın sizin dairenizdeyse hemen çıkın. Kapıyı arkanızdan kapatın ama kilitlemeyin, komşuları uyarın.",
      "Yangın başka bir kattaysa kapınıza elinizin tersiyle dokunun. Sıcaksa açmayın.",
      "Kapı sıcak değilse yavaşça açın. Koridor ve merdiven dumansızsa çıkın.",
      "Asansöre binmeyin, merdivenden inin.",
      "Merdivende yoğun duman varsa o merdivenden geçmeyin. Başka merdiven yoksa dairenize dönün.",
      "Dairede kalmanız gerekirse aranızdaki bütün kapıları kapatın, kapı altını ıslak havluyla tıkayın.",
      "112'yi arayın. Adresi, katı ve daire numaranızı söyleyin.",
      "Pencereden açık renkli bir bez ya da fenerle işaret verin. Camı kırmayın.",
      "Yere yakın durun; duman tavanda toplanır."
    ],
    "dont": [
      "Asansör kullanmayın.",
      "Pencereden ya da balkondan atlamayın; itfaiyeyi bekleyin.",
      "Dumanla dolu merdivene ve koridora girmeyin.",
      "Çatıya çıkmayın; duman yukarı çıkar ve çatı kapısı kilitli olabilir.",
      "Yangın kapılarını takozla açık tutmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "apartmanda yangın",
      "apartman yangını",
      "apartman yanıyor",
      "binada yangın",
      "üst katta yangın",
      "alt katta yangın",
      "merdiven duman dolu",
      "koridor duman",
      "yüksek binada yangın",
      "gökdelende yangın",
      "rezidansta yangın",
      "yangın merdiveni",
      "dairede mahsur kaldım yangın"
    ],
    "sources": [
      "Toronto İtfaiyesi — High-rise fire safety",
      "Ready.gov — Home fires",
      "Prof. Dr. Asım Kalkan / Anadolu Ajansı, 09.02.2025 — Yangında dumandan zehirlenmemek için öneriler (asansör yok, kapı altına ıslak bez, çömelerek ilerleme)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AA/Prof. Dr. Asım Kalkan (asansör yok, kapı altı ıslak bez, alt katta yangında üst kat pencerelerini açmama), AFAD uyarıları (dolaba saklanmama, pencereden dikkat çekme); değişiklik yok. Önceki: Toronto İtfaiyesi yüksek bina rehberi (kendi dairede yangında çık, kapıyı kapat kilitleme, asansör/çatı yok, dairede kalınca ıslak havlu, 911'e yerini söyle, açık renkli bezle işaret, yere yakın dur), Ready.gov Home fires (kapı kontrolü, mahsur kalınca yapılacaklar)"
    },
    "art": [
      "yangin-bina-kapi-kapat",
      "yangin-bina-kapi-dokun",
      null,
      null,
      "yangin-bina-merdiven",
      "yangin-bina-oda-havlu",
      "call-112",
      "yangin-bina-pencere-isaret",
      null
    ]
  },
  {
    "id": "yangin-duman-solunmasi",
    "title": "Duman soluyan kişiye ilk yardım",
    "tag": "YANGIN",
    "summary": "Kişiyi güvenliyse temiz havaya çıkarın ve 112'yi arayın; normal nefes almıyorsa kalp masajına başlayın.",
    "steps": [
      "Kendinizi tehlikeye atmadan kişiyi dumanlı yerden temiz havaya çıkarın.",
      "112'yi arayın.",
      "Bilinci kapalıysa ve normal nefes almıyorsa kalp masajına başlayın ([[temel-yasam-destegi|\"Temel yaşam desteği\" rehberi]]).",
      "Bilinci kapalı ama nefes alıyorsa yan yatırın (derlenme pozisyonu).",
      "Bilinci açıksa oturtun, sıkı giysilerini gevşetin.",
      "Astımı varsa kendi kullandığı inhaleri kullanmasına yardım edin.",
      "Yanında kalın, yalnız bırakmayın. Durumu hızla kötüleşebilir.",
      "Ses kısıklığı, nefes darlığı, hırıltı, durmayan öksürük, ağız-burunda is, siyah balgam, göğüs ağrısı, bilinç bulanıklığı ya da baş dönmesi varsa ambulansla hastaneye gitmeli.",
      "İyi görünse bile 24–36 saat bu belirtileri izleyin. Biri başlarsa 112'yi arayın.",
      "Yanık varsa 20 dakika serin akan suyla soğutun ([[yanik|\"Yanık\" rehberi]])."
    ],
    "dont": [
      "Dumanlı yere korunmasız girmeyin; siz de bayılabilirsiniz.",
      "Kişiyi yalnız bırakmayın.",
      "Belirtisi olan kişiyi kendi aracıyla hastaneye göndermeyin; araç kullanmasın.",
      "\"Geçer\" deyip ses kısıklığını ve nefes darlığını önemsiz saymayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "duman soludu",
      "duman yuttu",
      "dumandan zehirlenme",
      "dumandan etkilendi",
      "yangında duman soludu",
      "duman zehirlenmesi",
      "dumandan bayıldı",
      "is soludu",
      "dumandan öksürüyor",
      "sesi kısıldı dumandan",
      "dumandan nefes alamıyor"
    ],
    "sources": [
      "WebMD — Smoke inhalation first aid",
      "St John Ambulance — Carbon monoxide poisoning",
      "NHS — Burns and scalds",
      "NSW Sağlık (ACI) — Smoke inhalation fact sheet",
      "Prof. Dr. Asım Kalkan / Anadolu Ajansı, 09.02.2025 — Yangında dumandan zehirlenmemek için öneriler"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AA/Prof. Dr. Asım Kalkan (temiz alana çıkar, ağız çevresinde is ya da burun kılı yanığında solunum yolu ödemi riski → hemen hastane), MEB ilk yardım zehirlenme modülü aynası (temiz hava, derlenme pozisyonu, 112, sağlık kuruluşuna nakil); değişiklik yok. Önceki: WebMD (temiz hava, yan yatırma, CPR, inhaler, yalnız bırakma, kendi aracıyla gitmesin, uyarı belirtileri), St John Ambulance CO zehirlenmesi (bilinç bulanıklığı, göğüs ağrısı), NHS yanık (20 dk). 24–36 saat süresi bu turda yeniden doğrulanamadı."
    },
    "alsoIn": [
      "ilk-yardim"
    ],
    "art": [
      "yangin-duman-temiz-hava",
      "call-112",
      "yangin-duman-kpr",
      "yangin-duman-derlenme",
      "yangin-duman-oturt",
      null,
      null,
      null,
      null,
      null
    ]
  },
  {
    "id": "yangin-giysi-tutustu",
    "title": "Giysiniz tutuşursa: Dur, Yat, Yuvarlan",
    "tag": "YANGIN",
    "summary": "Koşmayın; durun, yere yatın, yüzünüzü ellerinizle kapatın ve alevler sönene kadar yuvarlanın.",
    "steps": [
      "DUR: Koşmayın. Koşmak alevi büyütür.",
      "YAT: Hemen yere yatın.",
      "Yüzünüzü ellerinizle kapatın.",
      "YUVARLAN: Alevler sönene kadar ileri geri yuvarlanın.",
      "Başkasının giysisi yanıyorsa onu yere yatırın ve battaniye, palto ya da halıyla örterek alevi boğun.",
      "Alev sönünce yanan yeri hemen 20 dakika serin akan suyla soğutun.",
      "Yanık yere yapışmamış takı ve giysileri çıkarın; yapışanı çekmeyin.",
      "Büyük yanıkta ya da yüz, el, cinsel bölge yanıklarında 112'yi arayın."
    ],
    "dont": [
      "Koşmayın, kollarınızı sallamayın.",
      "Yanıklı deriye yapışan giysiyi çekip koparmayın.",
      "Yanığa yoğurt, diş macunu, yağ sürmeyin.",
      "Naylon ya da sentetik örtüyle alevi boğmaya çalışmayın.",
      "Yanığı buzla ya da buzlu suyla soğutmayın; kişiyi üşütmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "giysim tutuştu",
      "elbisem yanıyor",
      "üstüm alev aldı",
      "kıyafet yanıyor",
      "giysi alev aldı",
      "saçım tutuştu",
      "dur yat yuvarlan",
      "dur yere yat yuvarlan",
      "üstü yanan kişi",
      "üzerinde alev"
    ],
    "sources": [
      "Ready.gov — Home fires (Stop, Drop and Roll)",
      "NHS — Burns and scalds",
      "St John Ambulance — Severe burn",
      "AFAD yangın anı uyarıları (ulusal.com.tr alıntısı): koşmayın, yere yatıp yuvarlanın, battaniyeyle alevi boğun, yanığı soğuk suya tutun"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD uyarıları (koşma, yat-yuvarlan, battaniye, soğuk su); değişiklik yok. Önceki: Ready.gov (dur, yere yat, yüzü ellerle kapat, yuvarlan), NHS ve St John Ambulance (20 dk serin akan su, yapışmayanı çıkar yapışanı bırak, krem/yağ sürme, yüz/cinsel bölge/büyük yanıkta acil, aşırı soğutmadan kaçın)"
    },
    "art": [
      "yangin-giysi-dur",
      "yangin-giysi-yat",
      null,
      "yangin-giysi-yuvarlan",
      "yangin-giysi-battaniye",
      null,
      null,
      null
    ]
  },
  {
    "id": "yangin-kacis-plani",
    "title": "Evde yangından korunma ve kaçış planı",
    "tag": "YANGIN",
    "summary": "Evin her katına duman dedektörü takın, her ay test edin ve ailenizle iki çıkışlı kaçış planını yılda iki kez prova edin.",
    "steps": [
      "Evin her katına, yatak odalarının içine ve önüne duman dedektörü takın.",
      "Dedektörü her ay test düğmesine basarak deneyin. Çalışmıyorsa pilini değiştirin.",
      "Her odadan iki çıkış yolu belirleyin: kapı ve pencere.",
      "Evin dışında herkesin bileceği bir buluşma noktası seçin.",
      "Kaçış planını ailenizle yılda iki kez prova edin. Yangında kaçmak için 2 dakikanız olabilir.",
      "Mutfakta yangın battaniyesi, evde ABC tozlu söndürücü bulundurun ve kullanmayı öğrenin.",
      "Ocakta yemek varken mutfaktan ayrılmayın.",
      "Isıtıcıları perde, yatak ve mobilyadan en az 1 metre uzak tutun.",
      "Yatakta sigara içmeyin. Çakmak ve kibriti çocukların ulaşamayacağı yerde tutun."
    ],
    "dont": [
      "Yemek yaparken öten dedektörün pilini çıkarmayın.",
      "Isıtıcıları ve yüksek güçlü cihazları uzatma kablosuna takmayın.",
      "Çıkış kapılarının ve pencerelerin önünü eşyayla kapatmayın.",
      "Balkon ve merdiven boşluğunda yanıcı eşya biriktirmeyin."
    ],
    "keywords": [
      "duman dedektörü",
      "duman dedektoru",
      "yangın alarmı evde",
      "yangın kaçış planı",
      "yangından korunma",
      "yangin onlemi",
      "evde yangın önlemi",
      "yangın tatbikatı",
      "yangın battaniyesi almak",
      "ısıtıcı yangın riski",
      "yangın çıkmaması için"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Home Fire Safety",
      "Ready.gov — Home fires"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Amerikan Kızılhaçı (her kat + yatak odası içi/önü dedektör, aylık test, yılda iki prova, 2 dakika), Ready.gov (her odadan iki çıkış, ısıtıcıdan 3 ft ≈ 1 m, ocak başından ayrılmama)"
    },
    "alsoIn": [
      "hazirlik"
    ],
    "art": [
      null,
      "yangin-plan-dedektor",
      "yangin-plan-iki-cikis",
      "yangin-plan-bulusma",
      null,
      "yangin-plan-tup-battaniye",
      null,
      null,
      null
    ]
  }
];
