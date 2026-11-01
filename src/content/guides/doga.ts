// Rehber kategorisi: Orman ve doğa
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "doga",
  "title": "Orman ve doğa",
  "hint": "Kaybolma, yılan, arı",
  "art": "cat-doga",
  "color": "#4caf6a",
  "order": 3
};

export const GUIDES: Guide[] = [
  {
    "id": "hipotermi",
    "title": "Hipotermi (aşırı üşüme)",
    "tag": "İLK YARDIM",
    "summary": "Aşırı üşüyen kişiyi soğuktan koruyun, ıslak giysilerini değiştirin ve gövdesini yavaşça ısıtın; 112'yi arayın.",
    "steps": [
      "Kişiyi soğuktan çıkarın. Çıkaramıyorsanız rüzgârdan ve yağmurdan koruyun; altına battaniye ya da mont serin.",
      "Hipotermiden şüpheleniyorsanız 112'yi arayın. Titreme durduysa, kişi uyuşuk, sakar, saçma konuşuyor ya da bilinci bulanıksa hiç beklemeyin.",
      "Islak giysilerini nazikçe çıkarın, kuru giysi giydirin.",
      "Battaniye, uyku tulumu ya da folyo battaniyeyle sarın. Başını ve boynunu da örtün.",
      "Gövdeyi ısıtın: boyun, göğüs ve kasığa beze sarılı ılık termofor ya da ılık su şişesi koyun.",
      "Bilinci açık ve yutabiliyorsa ılık, şekerli bir içecek verin. Alkollü ya da kafeinli içecek vermeyin.",
      "Kişiyi yatar halde tutun ve nazikçe taşıyın. Ani, sert hareket ettirmeyin.",
      "Nefes almıyorsa ya da normal nefes almıyorsa kalp masajına başlayın."
    ],
    "art": [
      "doga-hipotermi-koruma",
      "call-112",
      "doga-hipotermi-kuru-giysi",
      "doga-hipotermi-sarma",
      "doga-hipotermi-govde-isitma",
      null,
      null,
      "doga-hipotermi-kpr"
    ],
    "dont": [
      "Alkol ya da sigara vermeyin.",
      "Kol ve bacaklarını ovmayın, masaj yapmayın; kalbi zorlar.",
      "Sıcak banyoya sokmayın, ısı lambası ya da sobayla hızlı ısıtmayın; cilde doğrudan sıcak termofor değdirmeyin.",
      "Kapalı çadırda mangal ya da kömür sobası yakmayın; karbonmonoksit zehirler.",
      "Yardım gelene dek kişiyi yalnız bırakmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "hipotermi",
      "hipotermi belirtileri",
      "üşüme",
      "üşüyor",
      "aşırı üşüdü",
      "donma",
      "donuyor",
      "soğuktan",
      "titreme",
      "titriyor",
      "titremesi durdu",
      "ısınma",
      "ısınmak",
      "ısıtma",
      "dudakları morardı",
      "vücut ısısı düştü"
    ],
    "sources": [
      "Mayo Clinic — Hipotermi ilk yardımı",
      "NHS — Hypothermia"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: resmî Türk metnine erişilemedi; Acıbadem 'Donma vakalarında ilk yardım' (ovma ve masaj yok, alkol yok, şekerli sıcak içecek, aşırı sıcak suya sokma yok, yavaş ısıtma) ile uyumlu; değişiklik yok. Termofor maddesi uzman listesinde açık." },
    "alsoIn": [
      "hava",
      "hayatta-kalma"
    ]
  },
  {
    "id": "doga-kaybolma",
    "title": "Ormanda ya da dağda kaybolursanız",
    "tag": "DOĞA",
    "summary": "Durun, sakinleşin ve olduğunuz yerde kalın. Görünür ve duyulur olun; sizi bulmaları kolaylaşır.",
    "steps": [
      "DUR: Yürümeyi bırakın. Panikle yürümek sizi daha da uzaklaştırır.",
      "DÜŞÜN: Nereden geldiğinizi, en son nerede yolu gördüğünüzü hatırlayın.",
      "Telefon çekiyorsa 112'yi arayın ya da konumunuzu bir yakınınıza mesajla gönderin (Harita → \"Konumumu söyle\"). Sonra pili korumak için düşük güç moduna alın.",
      "Yerinizi bilmiyorsanız olduğunuz yerde kalın. Arama ekipleri sizi son görüldüğünüz yerin yakınında arar.",
      "Duyulur olun: 1 dakika boyunca 10 saniyede bir düdük çalın (6 ses), sonra 1 dakika bekleyin. Ekipler gelene dek tekrarlayın. Art arda 3 kısa düdük de yardım çağrısı olarak bilinir.",
      "Görünür olun: açık bir alanda durun, parlak renkli bir giysiyi ağaca asın ya da yere serin.",
      "Hava kararmadan rüzgâr ve yağmurdan korunacak bir yer hazırlayın. Yere kalın yaprak ve dal serip üzerine oturun; soğuk yerden gelir.",
      "Sıcak kalın: ıslak giysileri değiştirin, tüm katmanları giyin, başınızı örtün.",
      "Suyu idareli ama düzenli için. Akan su bulursanız mümkünse kaynatıp için."
    ],
    "art": [
      "doga-kaybolma-dur",
      null,
      "call-112",
      "doga-kaybolma-yerinde-kal",
      "doga-kaybolma-duduk",
      "doga-kaybolma-parlak-bez",
      "doga-kaybolma-zemin",
      null,
      null
    ],
    "dont": [
      "Hava kararınca yürümeye devam etmeyin; düşme ve yaralanma riski artar.",
      "Bilmediğiniz mantarları ve bitkileri yemeyin.",
      "Kestirme diye dik yamaçlardan ve dere yataklarından inmeyin.",
      "Grubunuzdan ayrılmayın; birlikte kalın."
    ],
    "callEmergency": true,
    "keywords": [
      "kayboldum",
      "kaybolmak",
      "kayıp",
      "yolumu kaybettim",
      "yolu kaybettim",
      "yön bulamıyorum",
      "ormanda kayboldum",
      "dağda kayboldum",
      "ormanda",
      "dağda",
      "doğada",
      "kamp",
      "yürüyüş",
      "trekking",
      "mahsur kaldım",
      "gece ormanda",
      "nerede olduğumu bilmiyorum",
      "yolu bulamıyorum"
    ],
    "sources": [
      "Uluslararası Alp tehlike işareti (dakikada 6 işaret, 1 dakika ara)",
      "Scottish Mountain Rescue — Dağ güvenliği",
      "Mountain Rescue England and Wales — Güvenlik önerileri",
      "AKUT Bursa ve Türkiye Dağcılık Federasyonu önerileri (NTV Seyahat)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: AKUT Bursa ve TDF önerileri (yerinizi ayrıntılı tarif edin, jandarma ve sağlık ekibini arayın, taşla şekil ve renkli işaret yapın, sisli havada emin değilseniz yürümeyin); Türkiye'de tek acil numara 112 (İçişleri). #5'e 3 kısa düdük de eklendi (hayatta-kalma-isaret ile uyum)." }
  },
  {
    "id": "hayvan-isirigi",
    "title": "Yılan, akrep ve arı sokması",
    "tag": "DOĞA",
    "summary": "Sakin kalın, ısırılan bölgeyi hareket ettirmeyin. Nefes darlığı ya da şişlik yayılıyorsa hemen 112.",
    "steps": [
      "Hayvandan uzaklaşın. Yakalamaya ya da öldürmeye çalışmayın.",
      "Kişiyi sakinleştirin ve oturtun ya da yatırın. Hareket zehrin yayılmasını hızlandırır.",
      "Yüzük, saat, bilezik gibi sıkan eşyaları şişlik başlamadan çıkarın.",
      "Yılan ısırığında ve akrep sokmasında o kolu ya da bacağı hareketsiz tutun; hemen 112'yi arayın.",
      "Arı sokmasında iğne kaldıysa hemen çıkarın: tırnak ya da bir kartla kazıyın. Cımbızla sıkmayın.",
      "Arı ve akrep sokmasında bölgeyi su ve sabunla yıkayın, sonra beze sarılı soğuk uygulayın.",
      "Nefes darlığı, yüzde ve dudakta şişlik, baş dönmesi olursa hemen 112'yi arayın. Kişinin adrenalin kalemi varsa kullanmasına yardım edin.",
      "Danışmak için Ulusal Zehir Danışma Merkezi: 114."
    ],
    "art": [
      "doga-yilan-uzaklas",
      null,
      "remove-rings",
      "doga-yilan-hareketsiz",
      "doga-ari-igne-kazima",
      null,
      "doga-alerji-sislik",
      "call-114"
    ],
    "dont": [
      "Yılan ısırığını kesmeyin, ağızla emmeyin.",
      "Turnike uygulamayın. Yılan ısırığına buz ya da soğuk uygulamayın; arı ve akrep sokmasında da buzu cilde doğrudan değdirmeyin.",
      "Alkol vermeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "yılan",
      "yılan soktu",
      "yılan ısırdı",
      "akrep",
      "akrep soktu",
      "arı",
      "arı soktu",
      "eşek arısı",
      "böcek soktu",
      "sokma",
      "zehirli hayvan",
      "örümcek",
      "arı alerjisi",
      "engerek"
    ],
    "sources": [
      "UZEM — Ulusal Zehir Danışma Merkezi (114)",
      "NHS — Snake bites",
      "NHS — Insect bites and stings",
      "Amerikan Dermatoloji Akademisi (AAD) — Arı sokması",
      "MEB İlk Yardım — Böcek sokmaları ve hayvan ısırıklarında ilk yardım (ilkyardim.meb.gov.tr)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB İlk Yardım PDF (akrepte bölgeyi oynatma, su-sabunla yıka, 15 dk soğuk, 112; yılanda uzan, hareket etme, takıları çıkar, 112, buz/soğuk yok, kesme-emme-turnike yok; arıda yıka, iğneyi kartla çıkar, soğuk); #6'ya su-sabunla yıkama eklendi, 'yapmayın'da yılana buz/soğuk yasağı açıkça yazıldı." },
    "alsoIn": [
      "zehirlenme"
    ]
  },
  {
    "id": "doga-hava-degisimi",
    "title": "Dağda hava aniden bozulursa ya da sis basarsa",
    "tag": "DOĞA",
    "summary": "Hava bozulmaya başlayınca beklemeden geri dönün; gök gürlüyorsa zirve ve sırtlardan inin, sis basarsa durup yerinizi belirleyin ve patikadan ayrılmayın.",
    "steps": [
      "Bulutlar kararıyor, rüzgâr sertleşiyor ya da hava hızla soğuyorsa hemen geri dönün. Zirve bekleyebilir.",
      "Gök gürültüsü duyarsanız zirveden, sırttan ve açık yamaçtan hemen aşağı inin. Tek başına duran ağacın altına ve kaya çıkıntısına sığınmayın.",
      "Açıkta kaldıysanız alçak bir yerde ayaklarınızı birleştirip çömelin, başınızı eğin. Yere uzanmayın. Grup olarak aranıza en az 5 metre koyun.",
      "Son gök gürültüsünden sonra en az 30 dakika bekleyin.",
      "Sis basarsa durun. Haritada ya da telefonda yerinizi belirleyin.",
      "Patikadan ayrılmayın. Göremediğiniz yerde kestirme denemeyin; sis uçurumları ve yarları gizler.",
      "Grubu bir arada tutun; birbirinizi görebileceğiniz mesafede yürüyün.",
      "Yağmurluğu ve sıcak katmanları ıslanmadan giyin.",
      "Yolu bulamıyorsanız korunaklı bir yerde durun, 112'yi arayın ve olduğunuz yerde bekleyin."
    ],
    "art": [
      "doga-hava-geri-don",
      "doga-hava-sirttan-in",
      "doga-hava-comelme",
      null,
      "doga-hava-sis-dur",
      null,
      null,
      "doga-hava-yagmurluk",
      "call-112"
    ],
    "dont": [
      "Hava bozarken 'az kaldı' diye zirveye devam etmeyin.",
      "Fırtınada sırtta, tek ağacın altında, tel çit ya da metal direk yanında durmayın.",
      "Sis kalkmadan kestirme yoldan inmeye çalışmayın.",
      "Yola çıkmadan MGM hava tahminine bakmayı ve rotanızı birine söylemeyi atlamayın."
    ],
    "keywords": [
      "dağda hava bozdu",
      "hava aniden bozuldu",
      "sis bastı",
      "sisli dağ",
      "sis içinde kaldım",
      "dağda sis",
      "dağda fırtına",
      "dağda gök gürültüsü",
      "zirvede şimşek",
      "görüş yok dağda",
      "hava kapandı",
      "dagda sis",
      "bulutun içinde kaldım"
    ],
    "sources": [
      "ABD Orman Servisi — Yıldırım güvenliği",
      "NWS — Lightning safety outdoors",
      "Mountain Rescue England and Wales — Güvenlik önerileri",
      "UIAA — Kötü görüşte yön bulma",
      "AKUT Bursa ve Türkiye Dağcılık Federasyonu önerileri (NTV Seyahat)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: AKUT Bursa ve TDF önerileri (rota ve dönüş saatini yetkililere bildirin, sisli havada emin değilseniz yürümeyin) ile uyumlu; değişiklik yok. Yıldırım değerleri: USFS Lightning (alçak yerde ayaklar bitişik çömel, grupta en az 15 ft aralık, sırt/zirveden in, 30 dk), NWS Lightning outdoors (sırt/tepe ve tek ağaçtan uzak dur, dağıl, 30 dk)" }
  },
  {
    "id": "doga-yalniz-yaralanma",
    "title": "Doğada tek başınıza yaralanırsanız",
    "tag": "DOĞA",
    "summary": "Güvenli yere geçin, kanamayı bastırarak durdurun ve 112'yi arayın; sonra sıcak kalın, görünür olun ve olduğunuz yerde bekleyin.",
    "steps": [
      "Önce kendinizi güvene alın. Düşme ya da taş düşmesi riski varsa birkaç adım uzaklaşın, sonra kımıldamayın.",
      "Ciddi kanama varsa yaraya temiz bir bezle sıkıca ve sürekli bastırın.",
      "112'yi arayın. Yerinizi, yaranızı ve yalnız olduğunuzu söyleyin. Arama çekmiyorsa bir yakınınıza konumunuzu mesajla gönderin.",
      "Telefonun pilini koruyun: düşük güç modunu açın, gereksiz uygulamaları kapatın.",
      "Kırık ya da burkulma varsa o kolu ya da bacağı hareket ettirmeyin. Dal ve bezle sabitleyin.",
      "Soğuk zeminden ayrılın: altınıza çanta, ip ya da yaprak serin. Tüm giysilerinizi giyin, başınızı örtün.",
      "Görünür ve duyulur olun: parlak bir giysiyi açığa serin, düdükle düzenli aralıklarla ses verin.",
      "Suyunuzu küçük yudumlarla, düzenli için. Yiyeceğinizi bölün.",
      "Yürüyebilseniz bile ekiplere söylediğiniz yerden ayrılmayın. Ekipler son bildirdiğiniz konuma gelir."
    ],
    "art": [
      null,
      "doga-yaralanma-bastirma",
      "call-112",
      null,
      "doga-yaralanma-atel",
      "doga-yaralanma-zemin",
      "doga-yaralanma-duduk",
      null,
      null
    ],
    "dont": [
      "Yaralıyken karanlıkta yürümeye çalışmayın.",
      "Ağrıyı bastırmak için alkol içmeyin.",
      "Kanayan yaradaki bezi kaldırıp bakmayın; kanarsa üstüne bir bez daha koyup bastırmaya devam edin.",
      "Telefonun pilini oyun, video ya da sürekli aramayla tüketmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "tek başıma yaralandım",
      "doğada yaralandım",
      "dağda düştüm",
      "yürüyüşte düştüm",
      "dağda yaralandım",
      "ormanda yaralandım",
      "yalnızım yaralıyım",
      "kimse yok yaralandım",
      "patikada düştüm",
      "dağda ayağım kırıldı",
      "tek basima yaralandim"
    ],
    "sources": [
      "Scottish Mountain Rescue — Dağ güvenliği",
      "St John Ambulance — Severe bleeding",
      "Mountain Rescue England and Wales — Güvenlik önerileri",
      "AKUT Bursa ve Türkiye Dağcılık Federasyonu önerileri (NTV Seyahat)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: AKUT Bursa ve TDF önerileri (yerinizi ayrıntılı tarif edin, şarjı koruyun, görünür işaret yapın) ile uyumlu; değişiklik yok. Bezi kaldırmama maddesi Türkiye'deki ilk yardım eğitimiyle uyumlu, uzman listesinde açık." }
  }
];
