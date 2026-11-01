// Rehber kategorisi: Elektrik, gaz ve su
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "tesisat",
  "title": "Elektrik, gaz ve su",
  "hint": "Gaz kaçağı, kesinti, jeneratör, şarj",
  "art": "cat-tesisat",
  "color": "#fbbf24",
  "order": 14
};

export const GUIDES: Guide[] = [
  {
    "id": "tesisat-gaz-kacagi",
    "title": "Evde gaz kokusu ve gaz kaçağı",
    "tag": "TESİSAT",
    "summary": "Gaz kokusu alırsanız elektrik düğmelerine dokunmayın, ateş yakmayın, pencereleri açın, vanayı kapatın, dışarı çıkın ve dışarıdan 187'yi arayın.",
    "steps": [
      "Elektrik düğmelerine, prizlere ve zillere dokunmayın: açık olanı kapatmayın, kapalı olanı açmayın.",
      "Çakmak, kibrit ya da sigara yakmayın; ocağı yakmayın.",
      "Kapı ve pencereleri açıp içeriyi havalandırın.",
      "Doğalgaz sayaç vanasını ya da tüpün vanasını kapatın.",
      "Evdekileri dışarı çıkarın. Asansör kullanmayın.",
      "Evin içinde telefonla konuşmayın. Dışarıda güvenli bir yerden 187 Doğalgaz Acil hattını arayın.",
      "Yangın, patlama ya da fenalaşan biri varsa 112'yi arayın.",
      "Komşuları zile basmadan, kapıya elle vurarak uyarın.",
      "Görevliler \"güvenli\" diyene kadar içeri girmeyin."
    ],
    "dont": [
      "Kaçağın yerini çakmak ya da kibritle aramayın.",
      "Ev içinde elektrik şalterini indirip kaldırmayın; kıvılcım çıkabilir.",
      "Koku geçti diye tesisatı kendiniz tamir etmeyin."
    ],
    "keywords": [
      "gaz kokusu",
      "gaz kaçağı",
      "gaz kokuyor",
      "evde gaz kokusu",
      "doğalgaz kokusu",
      "doğalgaz kaçağı",
      "doğalgaz acil",
      "187",
      "çürük yumurta kokusu",
      "sarımsak kokusu",
      "ocak gaz kaçırıyor",
      "kombi gaz kokusu",
      "dogalgaz kokusu",
      "gaz kacagi"
    ],
    "sources": [
      "Enerya — Doğal Gaz Acil 187 (7/24, konutta gaz kokusu)",
      "Amerikan Kızılhaçı — Earthquake (gaz kaçağında düğme/ateş yasağı, evden çıkıp güvenli yerden arama)",
      "Calor Gas — Emergency (düğme, cep telefonu, ateş yasağı; vanayı kapat; havalandır)",
      "İGDAŞ — 187 Doğalgaz Acil uyarıları (Milliyet haberi: sayaç ve cihaz vanası, havalandırma, telefon/priz/kibrit yok)",
      "Bursagaz — Depreme karşı uyarılar (187'yi bina dışından arama, kapı zili/telefon kullanmama)",
      "Karabük Ü. İSG — Sıvılaştırılmış petrol gazı ve güvenli kullanımı"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: İGDAŞ (Milliyet: önce sayaç vanası, kapı-pencere açma, elektrik düğmesi/telefon/kibrit yok, Alo 187), Bursagaz (187'yi dışarıdan arama, zil/telefon/asansör yok), Enerya 187; Calor Gas. Vana adımı 'sayaç vanası' olarak netleştirildi."
    },
    "art": [
      "tesisat-dugme-yasak",
      "tesisat-ates-yasak",
      "tesisat-pencere-ac",
      "tesisat-gaz-vana",
      null,
      "tesisat-disaridan-187",
      null,
      null,
      null
    ]
  },
  {
    "id": "tesisat-elektrik-kesintisi",
    "title": "Elektrik kesintisinde yapılacaklar",
    "tag": "TESİSAT",
    "summary": "Elektrik kesilince mum yerine el feneri kullanın, cihazların fişini çekin, buzdolabını kapalı tutun ve arızayı 186'ya bildirin.",
    "steps": [
      "Aydınlatma için el feneri ya da pilli lamba kullanın; mum yakmayın.",
      "Buzdolabı dışındaki cihazların fişini çekin; elektrik gelince oluşan dalgalanma onları bozabilir. Bir lambayı açık bırakın; elektrik gelince anlarsınız.",
      "Buzdolabını ve dondurucuyu açmayın. Kapalı buzdolabı yaklaşık 4 saat, dolu dondurucu yaklaşık 48 saat soğuk tutar.",
      "Arızayı 186'yı arayarak elektrik dağıtım şirketine bildirin.",
      "Telefonda güç tasarrufu modunu açın ve ekran parlaklığını kısın.",
      "Duyuruları pilli radyodan takip edin.",
      "Evde elektrikle çalışan tıbbi cihaz kullanan biri varsa kesinti uzarsa onu elektriği olan bir yere götürün.",
      "Jeneratör, mangal ve kamp ocağını yalnızca açık havada kullanın.",
      "Yaşlı ve yalnız yaşayan komşularınızı kontrol edin.",
      "Yere düşmüş elektrik telinden en az 20 metre uzak durun ve 112'yi arayın."
    ],
    "dont": [
      "Isınmak için gaz ocağını ya da fırını açık bırakmayın.",
      "Jeneratörü evin prizine bağlamayın.",
      "Evde hasar varsa atan sigortayı elektrikçi bakmadan kaldırmayın."
    ],
    "keywords": [
      "elektrik kesintisi",
      "elektrik kesildi",
      "elektrikler gitti",
      "elektrik gitti",
      "elektrik yok",
      "elektrikler ne zaman gelecek",
      "cereyan kesildi",
      "cereyan yok",
      "karanlıkta kaldık",
      "elektrik arıza",
      "186",
      "elektrik kesintisi ne yapmalı"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Power outage safety",
      "CDC — Protect Yourself During a Power Outage",
      "SEDAŞ ve UEDAŞ — 186 arıza ihbar / çağrı merkezi",
      "BEDAŞ — 186 çağrı merkezi ve mobil uygulaması (kesinti ve tehlikeli durum ihbarı)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: 186 dağıtım şirketi arıza hattı (SEDAŞ, UEDAŞ, BEDAŞ); Amerikan Kızılhaçı, CDC. Süre değerleri (4/48 saat) için Türk kaynağı bulunamadı; değişiklik yok."
    },
    "art": [
      "tesisat-fener-mum",
      "tesisat-fis-cek",
      "tesisat-buzdolabi-kapali",
      "tesisat-186-ara",
      null,
      "battery-radio",
      null,
      null,
      null,
      "tesisat-dusen-tel"
    ]
  },
  {
    "id": "tesisat-jenerator",
    "title": "Jeneratör güvenliği",
    "tag": "TESİSAT",
    "summary": "Jeneratörü yalnızca açık havada, kapı ve pencerelerden en az 6 metre uzakta çalıştırın; evin, garajın ya da çadırın içinde asla çalıştırmayın.",
    "steps": [
      "Jeneratörü yalnızca açık havada çalıştırın. Ev, garaj, bodrum, kapalı balkon, depo ya da çadır içinde asla çalıştırmayın.",
      "Kapı, pencere ve havalandırma deliklerinden en az 6 metre uzağa koyun. Egzozu evden ve çadırlardan uzağa çevirin.",
      "Pilli karbonmonoksit alarmı kullanın. Alarm öterse hemen dışarı çıkın ve 112'yi arayın.",
      "Jeneratörü kuru bir zemine, yanları açık bir tente altına koyun. Yağmurda açıkta çalıştırmayın.",
      "Jeneratöre ıslak elle dokunmayın.",
      "Cihazları doğrudan jeneratöre takın ya da dış mekâna uygun, sağlam, topraklı, kalın bir uzatma kablosu kullanın.",
      "Jeneratörü evin prizine ya da sigorta kutusuna bağlamayın; hatta elektrik verip çalışan teknisyenleri çarpabilir. Bina bağlantısını yalnızca elektrikçi yapsın.",
      "Yakıt eklemeden önce jeneratörü kapatın ve soğumasını bekleyin.",
      "Yakıtı onaylı bir bidonda, yaşam alanının dışında ve ateşten uzakta saklayın.",
      "Baş ağrısı, baş dönmesi, bulantı ya da uyku hali olursa herkesi temiz havaya çıkarın ve 112'yi arayın."
    ],
    "dont": [
      "Kapıyı ya da pencereyi açarak jeneratörü içeride çalıştırmayın; açık pencere yetmez.",
      "Çalışan ya da sıcak jeneratöre yakıt koymayın.",
      "Kesik, ezik ya da yıpranmış kablo kullanmayın."
    ],
    "keywords": [
      "jeneratör",
      "jenaratör",
      "jenerator",
      "jeneratör nereye konur",
      "jeneratör içeride",
      "jeneratör bağlama",
      "jeneratörü prize takmak",
      "seyyar jeneratör",
      "benzinli jeneratör",
      "dizel jeneratör",
      "jeneratöre benzin"
    ],
    "sources": [
      "CDC — Carbon Monoxide Poisoning: About (20 ft, pilli CO dedektörü)",
      "CDC — Protect Yourself During a Power Outage",
      "Amerikan Kızılhaçı — Safe generator use"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC CO About (20 ft ≈ 6 m, açık kapı/pencere yetmez, belirtiler), CDC Power Outage, Amerikan Kızılhaçı Safe generator use (backfeed, kablo, ıslaklık, yakıt)."
    },
    "art": [
      "tesisat-jenerator-disarida",
      "tesisat-jenerator-mesafe",
      "barinma-co-alarm",
      "tesisat-jenerator-tente",
      null,
      null,
      "tesisat-priz-baglama-yasak",
      "tesisat-yakit-soguk",
      null,
      null
    ]
  },
  {
    "id": "tesisat-boru-patlamasi",
    "title": "Su borusu patladı",
    "tag": "TESİSAT",
    "summary": "Boru patlayınca hemen ana su vanasını kapatın, su elektriğe ulaştıysa güvenliyse şalteri indirin ve tesisatçıyı ya da 185'i arayın.",
    "steps": [
      "Hemen ana su vanasını kapatın. Genelde su sayacının yanındadır; kolu boruya dik çevirin ya da saat yönünde sonuna kadar döndürün.",
      "Su prizlere ya da sigorta kutusuna ulaştıysa, kuru bir yerde duruyorsanız ana şalteri indirin. Islak zemindeyseniz dokunmayın ve 186'yı arayın.",
      "Borularda kalan suyu boşaltmak için soğuk su musluklarını açın.",
      "Patlayan boru sıcak su borusuysa kombiyi ya da termosifonu kapatın.",
      "Akan suyu kova ve havluyla toplayın; eşyaları yukarı kaldırın.",
      "Kaçak sayaçtan önce, sokak tarafındaysa 185'i (su arıza) arayın; açılmazsa belediyenin 153 hattını arayın.",
      "Ev içindeki boruyu tesisatçıya tamir ettirin.",
      "Hasarın fotoğrafını çekin; sigortanız varsa bildirin.",
      "Kışın açıkta kalan boruları yalıtın; boruların donması patlamaya yol açar."
    ],
    "dont": [
      "Islak zemindeyken prize, şaltere ya da elektrikli cihaza dokunmayın.",
      "Donmuş boruyu çakmak, pürmüz ya da açık ateşle ısıtmayın.",
      "Su emmiş, sarkmış tavanın altında durmayın."
    ],
    "keywords": [
      "boru patladı",
      "su borusu patladı",
      "boru patlaması",
      "tesisat patladı",
      "su kaçağı",
      "ana su vanası",
      "su vanası nerede",
      "tavandan su akıyor",
      "borudan su fışkırıyor",
      "185",
      "su arıza",
      "boru dondu",
      "boru patladi"
    ],
    "sources": [
      "CDC — Protect Yourself from Electrical Hazards After a Disaster",
      "Amerikan Kızılhaçı — Frozen pipes (yalıtım, açık ateşle çözmeme)",
      "İSU ve SASKİ — ALO 185; İSKİ — 185 arıza hattı; ASKİ — 153 çağrı merkezi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: İSKİ 185 (7/24 arıza ve tesisat bildirimi, karar.com), İSU/SASKİ ALO 185, 186 elektrik arıza; CDC, Amerikan Kızılhaçı. Vana ve boşaltma adımları için yetkili kaynak bulunamadı; değişiklik yok."
    },
    "art": [
      "tesisat-su-vanasi-kapat",
      "tesisat-boru-salter",
      "tesisat-musluk-ac",
      null,
      "tesisat-kova-havlu",
      null,
      null,
      null,
      "tesisat-boru-yalitim"
    ]
  },
  {
    "id": "tesisat-arabada-sarj",
    "title": "Araçta ya da aküden telefon şarjı",
    "tag": "TESİSAT",
    "summary": "Telefonu aracın USB ya da çakmaklık çıkışından, araç açık havadayken ve motor çalışırken şarj edin; aküye yalnızca maşalı bir adaptörle bağlanın.",
    "steps": [
      "Aracı yalnızca açık havada çalıştırın. Kapalı garajda ya da egzozu karla tıkanmışken çalıştırmayın.",
      "Telefonu aracın USB girişine ya da çakmaklığa takılan 12 V şarj adaptörüne bağlayın.",
      "Uzun şarj için motoru çalıştırın. Motor kapalıyken uzun süre şarj etmek aküyü bitirebilir.",
      "Motor çalışırken araçta uyumayın ve camı biraz aralık tutun.",
      "Powerbankınızı da araçta doldurun; böylece aracı daha az çalıştırırsınız.",
      "Araç dışındaki bir aküden şarj için akü maşalı 12 V–USB adaptör ya da invertör kullanın: kırmızı maşa artı (+), siyah maşa eksi (−) kutba.",
      "Akünün yanında sigara içmeyin ve kıvılcım çıkarmayın; akü patlayıcı gaz çıkarabilir.",
      "Yakıtı idareli kullanın; tahliye gerekebilir diye deponun en az yarısını dolu tutun."
    ],
    "dont": [
      "Telefonu çıplak kabloyla doğrudan akü kutuplarına bağlamayın.",
      "Aracı kapalı garajda, çadırın ya da pencerenin dibinde çalıştırmayın.",
      "Çatlak, sızdıran ya da şişmiş aküye dokunmayın; asit yakar."
    ],
    "keywords": [
      "araçta şarj",
      "arabadan telefon şarj etmek",
      "aküden şarj",
      "akü ile telefon şarjı",
      "akü",
      "çakmaklık şarj",
      "araba şarjı",
      "invertör",
      "akü maşası",
      "otomobilde şarj",
      "araçta telefon sarj"
    ],
    "sources": [
      "CDC — Carbon Monoxide Poisoning: About (garajda araç çalıştırma)",
      "Amerikan Kızılhaçı — Power outage safety",
      "Wikipedia — Lead–acid battery (hidrojen çıkışı, kıvılcımla patlama)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC CO About (kapı açık olsa da bitişik garajda çalıştırmama), Amerikan Kızılhaçı (depo yarı dolu), kurşun-asit akü hidrojen riski. Akü maşalı adaptör adımı için yetkili kaynak bulunamadı."
    },
    "art": [
      "tesisat-araba-disarida",
      "tesisat-usb-sarj",
      null,
      null,
      null,
      "tesisat-aku-masa",
      "tesisat-aku-kivilcim-yasak",
      null
    ]
  },
  {
    "id": "tesisat-gunes-powerbank",
    "title": "Güneş paneli ve powerbank kullanımı",
    "tag": "TESİSAT",
    "summary": "Güneş panelini gölgesiz yerde doğrudan güneşe çevirin, önce powerbankı doldurun, telefonda tasarruf modunu açın ve pilleri sıcaktan koruyun.",
    "steps": [
      "Telefonda güç tasarrufu modunu açın, ekran parlaklığını kısın, kullanmadığınız uygulamaları kapatın.",
      "Şebeke çekmiyorsa telefonu uçak moduna alın; belirli saatlerde açıp mesajlarınıza bakın.",
      "Güneş panelini gölgesiz bir yere, yüzü doğrudan güneşe bakacak şekilde koyun. Gün içinde güneşe doğru çevirin.",
      "Panelle önce powerbankı doldurun, telefonu powerbanktan şarj edin; bulut geçtikçe panelin gücü düşer.",
      "Panel güneşte dursun, powerbank ve telefon gölgede kalsın; piller sıcakta bozulur.",
      "Powerbankı her fırsatta tam doldurun. Elektrik gelince ilk iş onu şarj edin.",
      "Şişen, aşırı ısınan, koku ya da duman çıkaran powerbankı hemen çıkarın, yanmaz bir yüzeye koyun ve bir daha kullanmayın.",
      "Şarjı yatak, yastık ya da çadır bezi üstünde değil, sert ve yanmaz bir yüzeyde yapın."
    ],
    "dont": [
      "Şişmiş powerbankı delmeyin, sıkmayın, şarj etmeyin.",
      "Powerbankı güneşte ya da sıcak araç içinde bırakmayın.",
      "Islak paneli, kabloyu ya da powerbankı birbirine takmayın."
    ],
    "keywords": [
      "güneş paneli",
      "güneş paneli ile şarj",
      "güneşle şarj",
      "solar şarj",
      "solar panel",
      "powerbank",
      "power bank",
      "powerbank şişti",
      "şarj",
      "telefon şarjı",
      "taşınabilir şarj cihazı",
      "şarjım bitiyor",
      "pil tasarrufu",
      "telefon şarjı nasıl idare edilir",
      "gunes paneli"
    ],
    "sources": [
      "Ready.gov (FEMA) — Build a Kit (yedek pil ve şarj)",
      "Amerikan Kızılhaçı — Power outage safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Ready.gov Build a Kit (şarj cihazı ve yedek pil). Lityum pil ve panel uyarıları için erişilebilir yetkili kaynak (CPSC, USFA, LFB) bulunamadı."
    },
    "art": [
      "tesisat-tasarruf-modu",
      null,
      "tesisat-panel-gunese",
      "tesisat-panel-powerbank",
      "tesisat-pil-golgede",
      null,
      "tesisat-siskin-powerbank",
      null
    ]
  },
  {
    "id": "tesisat-tup-guvenligi",
    "title": "LPG tüpü (tüp gaz) güvenliği",
    "tag": "TESİSAT",
    "summary": "Tüpü dik, havadar ve ısıdan uzak tutun, kaçağı sabunlu suyla kontrol edin; kokuda vanayı kapatın, havalandırın ve dışarı çıkın.",
    "steps": [
      "Gaz kokusu alırsanız tüpün vanasını hemen kapatın. Ateş yakmayın, elektrik düğmelerine dokunmayın, kapı ve pencereleri açın.",
      "Tüp gazı havadan ağırdır, yere çöker. Herkesi dışarı çıkarın ve dışarıdan 112'yi arayın.",
      "Tüpü her zaman dik kullanın ve dik taşıyın; yatırmayın, yuvarlamayın.",
      "Tüpü bodrumda, merdiven altında ya da kapalı dolapta kullanmayın ve saklamayın; havadar bir yerde tutun.",
      "Tüpü sobadan, ocaktan ve güneşten uzak tutun.",
      "Hortumu ve bağlantıları sabunlu suyla kontrol edin: kabarcık çıkıyorsa kaçak var.",
      "Hortum çatlak, sertleşmiş ya da ezikse değiştirin; kelepçeler sıkı olsun.",
      "İşiniz bitince ocağın düğmesiyle birlikte tüpün vanasını da kapatın.",
      "Ezik, paslı ya da vanası hasarlı tüpü kabul etmeyin; bayiye geri verin.",
      "Çadırda ve konteynerde tüplü ısıtıcı ya da tüp lamba kullanmayın."
    ],
    "dont": [
      "Kaçağı çakmak ya da kibritle aramayın.",
      "Gazı bitmek üzere olan tüpü yatırmayın, ters çevirmeyin.",
      "Tüpü sıcak su ya da ateşle ısıtıp gazını artırmaya çalışmayın."
    ],
    "keywords": [
      "tüp",
      "tüp gaz",
      "lpg",
      "lpg tüpü",
      "mutfak tüpü",
      "piknik tüpü",
      "tüplü ocak",
      "tüp kokuyor",
      "tüp kaçırıyor",
      "tüp hortumu",
      "tüp vanası",
      "tüp patlar mı",
      "tup gaz"
    ],
    "sources": [
      "Boğaziçi Ü. İSG — Gaz tüpleri taşıma, kullanma ve depolama talimatı",
      "Karabük Ü. İSG — Sıvılaştırılmış petrol gazı ve güvenli kullanımı",
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "Calor Gas — Storing gas bottles / Emergency / BBQ safety",
      "CDC — Protect Yourself During a Power Outage (çadırda fener/kamp ocağı yasağı)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Karabük Ü. İSG LPG notu (havadan ağır, tabana yayılır; zemin katta ve kapalı yerde değil havadar yerde saklama; güneş/ısıdan uzak; hasarlı tüp kullanmama; kaçakta alevleri söndür, şalter ve telefon yok, alanı boşalt, güvenli yerden itfaiyeyi ara — eski 110 artık 112), HSGM 2024 (çadırda tüp lamba yok); Calor Gas. LPG'de 187 değil 112 doğru; değişiklik yok."
    },
    "art": [
      "tesisat-tup-vana-kapat",
      null,
      "tesisat-tup-dik",
      "tesisat-tup-bodrum-yasak",
      null,
      "tesisat-sabunlu-su-testi",
      null,
      null,
      "tesisat-ezik-tup-yasak",
      null
    ]
  },
  {
    "id": "tesisat-hasarli-elektrik",
    "title": "Selden ya da depremden sonra hasarlı elektrik tesisatı",
    "tag": "TESİSAT",
    "summary": "Su basmış ya da hasarlı evde ıslak zemindeyken hiçbir elektrik düğmesine dokunmayın, ana şalteri ancak kuru ve güvenli bir yerdeyseniz indirin, elektrikçi bakmadan elektriği açmayın.",
    "steps": [
      "Su basmış bir evde ıslak zemine basarken şaltere, prize ya da cihaza dokunmayın.",
      "Sigorta kutusu kuru bir yerdeyse ve oraya kuru zeminden ulaşabiliyorsanız ana şalteri indirin.",
      "Ulaşamıyorsanız eve girmeyin. 186'yı arayıp elektriği dışarıdan kestirin.",
      "Kıvılcım, yanık kokusu ya da duman varsa dışarı çıkın; yangın başladıysa 112'yi arayın.",
      "Yere düşmüş ya da sarkan elektrik telinden en az 20 metre uzak durun ve 112'yi arayın.",
      "Telin değdiği suya, çite ya da araca yaklaşmayın.",
      "Suya batmış prizleri, uzatmaları ve cihazları elektrikçi kontrol etmeden kullanmayın.",
      "Elektriği yeniden açmadan önce tesisatı yetkili bir elektrikçiye kontrol ettirin.",
      "Depremde hasar gören binaya, hasar tespiti yapılmadan elektrik için girmeyin.",
      "Karanlıkta el feneri kullanın; mum ve çakmak yakmayın, gaz kaçağı olabilir."
    ],
    "dont": [
      "Islak elle ya da çıplak ayakla elektrikli cihaza dokunmayın.",
      "Sigorta atıyorsa zorla kaldırmayın; önce elektrikçi baksın.",
      "Islanmış cihazı \"kurudu\" diye kendiniz çalıştırmayın."
    ],
    "keywords": [
      "su bastı elektrik",
      "sel sonrası elektrik",
      "deprem sonrası elektrik",
      "hasarlı elektrik",
      "priz ıslandı",
      "sigorta kutusu ıslandı",
      "elektrik teli koptu",
      "düşen elektrik teli",
      "kopan tel",
      "elektrik direği devrildi",
      "prizden kıvılcım",
      "sigorta atıyor",
      "elektrik tesisatı hasarlı"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Flood safety / Power outage safety",
      "CDC — Protect Yourself from Electrical Hazards After a Disaster",
      "NWS — Flood After"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC elektrik tehlikeleri (şaltere suya girerek gitmeme, elektrikçi denetimi, cihazlar tam kurumadan kullanmama, düşen tel), Amerikan Kızılhaçı Flood/Power outage (35 ft, fener), NWS Flood After."
    },
    "art": [
      "tesisat-islak-zemin-yasak",
      "tesisat-hasarli-salter",
      "tesisat-186-ara",
      null,
      "tesisat-dusen-tel",
      null,
      "tesisat-islak-cihaz-yasak",
      "tesisat-elektrikci-kontrol",
      null,
      null
    ]
  }
];
