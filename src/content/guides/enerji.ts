// Rehber kategorisi: Enerji ve şarj
// Elektrik kesintisinde telefonu (ve bu uygulamayı) şarjlı tutmanın yolları; ikinci bölümde
// "kendin yap" projeleri. Rehber biçimi: src/content/types.ts
// Doğrulama notları: docs/dogrulama/enerji-aa.md
//
// Not: Bu kategorideki rehberler `critical` değildir. `critical` hayati ilk yardım içindir;
// Fener'de en üstteki rehber kritikse "önce 112'yi arayın" bandı çıkar. Yangın, karbonmonoksit
// ve elektrik çarpması tehlikesi olan rehberlerde bunun yerine `note` uyarı bandı kullanılır.
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "enerji",
  "title": "Enerji ve şarj",
  "hint": "Kesintide telefon şarjı, powerbank, güneş, kendin yap",
  "art": "cat-enerji",
  "color": "#a3e635",
  "order": 14.5
};

export const GUIDES: Guide[] = [
  {
    "id": "enerji-sarj-yollari",
    "title": "Elektrik yok: telefon şarjı için tüm yollar",
    "tag": "ENERJİ",
    "summary": "Elektrik yokken önce telefonun şarjını koruyun, sonra en güvenli kaynaktan başlayarak powerbank, araç, güneş paneli ve ortak şarj noktalarını kullanın.",
    "steps": [
      "Önce şarjı koruyun: güç tasarrufunu açın, ekranı kısın. Ayrıntı için [[enerji-telefon-tasarruf|\"Kesintide telefonun şarjını uzatma\" rehberine]] bakın.",
      "Dolu bir powerbankınız varsa ilk onu kullanın; en kolay ve en güvenli yol budur.",
      "Araç varsa açık havada, motor çalışırken USB girişinden ya da çakmaklık adaptöründen şarj edin. Kapalı garajda motoru asla çalıştırmayın.",
      "Güneşli havada katlanır güneş paneliyle önce powerbankı doldurun, telefonu sonra powerbanktan şarj edin.",
      "Dizüstü bilgisayarın USB girişinden ya da başka bir telefondan kısa süreli şarj alın.",
      "Kurmalı radyo, dinamo ya da kalem pilli şarj aparatı yalnızca kısa bir arama ya da birkaç mesaj kadar şarj verir; tam dolum beklemeyin.",
      "Ortak şarj noktası olup olmadığını sorun: toplanma alanı, çadır kent, muhtarlık ya da belediye hizmet noktası.",
      "Jeneratör kullanılacaksa yalnızca açık havada, kapı ve pencerelerden en az 6 metre uzakta çalışsın; içeride karbonmonoksit öldürür.",
      "Elinizde malzeme varsa [[enerji-ky-aku-usb|\"Kendin yap: aküden USB şarjı\"]] gibi projelere bakın; önce şarj efsanelerine kanmayın."
    ],
    "dont": [
      "Elektrik direğine, sokak lambasına ya da kopmuş tele kablo bağlamayın; şebeke elektriği öldürür.",
      "Şişmiş, ezilmiş ya da ıslanmış powerbankı ve telefonu şarj etmeyin.",
      "Aracı ya da jeneratörü garajda, evde, çadırda veya pencerenin dibinde çalıştırmayın."
    ],
    "keywords": [
      "telefon şarjı bitti",
      "şarjım bitti",
      "sarjim bitti",
      "telefonum kapandı şarjı yok",
      "elektrik yokken şarj",
      "elektrik yok telefon şarjı",
      "elektrik kesildi telefonumu nasıl şarj ederim",
      "elektrik kesildi telefonu nasıl şarj ederim",
      "elektriksiz şarj",
      "elektriksiz telefon şarjı",
      "prizsiz şarj",
      "kesintide şarj",
      "kesintide telefon şarjı",
      "telefon sarj etme yollari",
      "şarj etmenin yolları",
      "cereyan yokken şarj"
    ],
    "sources": [
      "ABD Enerji Bakanlığı (energy.gov) — Keeping Mobile Devices Charged",
      "CPSC — Portable Generator Hazards (Safety Alert 5123)",
      "REI — How to Choose Solar Chargers and Portable Power",
      "Turkcell — Afet tedbirleri (taşınabilir şarj cihazı, SMS)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Özet rehber: energy.gov (araçla şarj havadar yerde, uçak modu), CPSC 5123 (jeneratör yalnız dışarıda), REI (güneşte önce powerbank), Turkcell afet sayfası. Ayrıntılar alt rehberlerde."
    },
    "art": [
      null,
      "enerji-powerbank-telefon",
      "tesisat-araba-disarida",
      "tesisat-panel-powerbank",
      "enerji-laptop-usb",
      null,
      "enerji-sarj-noktasi",
      null,
      null
    ]
  },
  {
    "id": "enerji-telefon-tasarruf",
    "title": "Kesintide telefonun şarjını uzatma",
    "tag": "ENERJİ",
    "summary": "Güç tasarrufunu açın, ekranı kısın, beklerken uçak moduna geçin ve bu uygulamada Düşük güç ayarını açın.",
    "steps": [
      "Telefonun güç tasarrufu (düşük güç) modunu hemen açın.",
      "Ekran parlaklığını en aza indirin; ekranın kısa sürede kendiliğinden kapanmasını ayarlayın.",
      "Beklerken telefonu uçak moduna alın; belirlediğiniz saatlerde, örneğin saat başı, açıp mesajlara bakın.",
      "Kullanmadığınız uygulamaları kapatın; Wi-Fi, Bluetooth ve konumu gerekmedikçe kapalı tutun.",
      "Bu uygulamada Araçlar → Ayarlar → Düşük güç seçeneğini açın. Ekran koyulaşır, harita daha az çizer, Fener asistanı kapanır.",
      "Arama yerine kısa mesaj gönderin; zorunlu aramaları kısa tutun.",
      "Video, oyun, canlı yayın ve fener ışığını yalnızca gerektiğinde kullanın.",
      "Telefonu soğukta iç cebinizde, sıcakta gölgede tutun. Soğukta pil geçici olarak çabuk biter, sıcak ise pile kalıcı zarar verir.",
      "Kalan süreyi Araçlar → Pil ve şarj aracından izleyin."
    ],
    "dont": [
      "Telefonu ısıtmak için sobaya, ateşe ya da sıcak taşa yaklaştırmayın.",
      "Şarjı azken uzun video ya da canlı yayın açmayın.",
      "Telefonu güneşte, sıcak araç içinde bırakmayın."
    ],
    "keywords": [
      "şarjı uzatmak",
      "telefonun şarjı çabuk bitiyor",
      "şarj nasıl uzar",
      "şarjı idareli kullanmak",
      "düşük güç modu",
      "güç tasarrufu modu",
      "uçak modu şarj",
      "sarj tasarrufu",
      "batarya tasarrufu",
      "pil ömrünü uzatmak",
      "telefonun şarjı yetmiyor",
      "düşük güç ayarı"
    ],
    "sources": [
      "ABD Enerji Bakanlığı (energy.gov) — Keeping Mobile Devices Charged (parlaklık, uçak modu, uygulamaları kapatma, kısa görüşme)",
      "Turkcell — Afet tedbirleri (SMS ve internet tabanlı mesaj, kısa görüşme)",
      "Apple — Pil ömrünü ve kullanım süresini en üst düzeye çıkarma (0–35 °C, soğukta geçici düşüş, 35 °C üstü kalıcı zarar)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "energy.gov (parlaklık, uçak modu, uygulama kapatma, kısa görüşme), Turkcell (SMS tercih), Apple pil sayfası (sıcaklık). Uygulamanın Düşük güç ve Pil ve şarj araçlarının adları koddan doğrulandı."
    },
    "art": [
      "tesisat-tasarruf-modu",
      "hazirlik-pil-tasarruf",
      "enerji-ucak-modu",
      null,
      "enerji-dusuk-guc",
      "sms-send",
      null,
      null,
      null
    ]
  },
  {
    "id": "enerji-powerbank",
    "title": "Powerbank seçimi, kapasite hesabı ve bakımı",
    "tag": "ENERJİ",
    "summary": "Güvenilir markadan bir powerbank alın; üzerinde yazan mAh'in yaklaşık üçte ikisinin telefona ulaştığını bilin ve kullanmasanız da 3 ayda bir doldurun.",
    "steps": [
      "Bilinen bir markadan, faturalı ve CE işaretli bir powerbank alın; çok ucuz, markasız olanlardan kaçının.",
      "Gerçek kapasiteyi bilin: powerbankta yazan mAh'in yaklaşık %60–70'i telefona ulaşır. Kalanı, pil 3,7 V'tan 5 V'a yükseltilirken ve ısı olarak kaybolur.",
      "Kolay hesap: powerbank mAh × 0,65 ÷ telefon pili mAh. Örnek: 10 000 mAh powerbank, 4 000 mAh'lik telefonu yaklaşık 1,5 kez, 3 000 mAh'lik telefonu yaklaşık 2 kez doldurur.",
      "Watt-saat hesabı: mAh × 3,7 ÷ 1 000 = Wh. 10 000 mAh yaklaşık 37 Wh eder; bunun yaklaşık 22–26 Wh'i telefona ulaşır. Telefon pilleri çoğunlukla yaklaşık 12–20 Wh'tir.",
      "Telefonunuzu en az 2 kez dolduracak kapasite seçin; 20 000 mAh daha ağırdır ama daha uzun dayanır.",
      "Powerbankı tamamen bitirmeden doldurun; elektrik gelince ilk iş onu şarj edin.",
      "Kullanmasanız da en az 3 ayda bir boşaltıp yeniden doldurun.",
      "Serin ve kuru yerde saklayın; güneşte ya da park hâlindeki sıcak araçta bırakmayın.",
      "Şişen, aşırı ısınan, koku ya da duman çıkaran powerbankı hemen çıkarın, yanmaz bir yüzeye koyun ve bir daha kullanmayın."
    ],
    "dont": [
      "Yatak, yastık ya da koltuk üstünde şarj etmeyin; sert ve yanmaz bir yüzey kullanın.",
      "Düşen, ezilen ya da ıslanan powerbankı kullanmaya devam etmeyin.",
      "Kutudaki mAh'in tamamının telefona gideceğini sanmayın."
    ],
    "keywords": [
      "powerbank seçimi",
      "powerbank kaç kere şarj eder",
      "powerbank kaç şarj eder",
      "powerbank kac sarj eder",
      "10000 mah kaç şarj",
      "10000 mah powerbank",
      "20000 mah powerbank",
      "mah hesabı",
      "mah wh hesaplama",
      "powerbank kapasitesi",
      "hangi powerbank alınır",
      "powerbank bakımı",
      "powerbank saklama",
      "powerbank ne kadar dayanır"
    ],
    "sources": [
      "Anker — Why a 10000mAh power bank isn't actually 10000mAh (3,7 V hücre, 5 V çıkış, %85–90 dönüşüm, 10 000 mAh ≈ 6 000–6 500 mAh)",
      "Anker Destek — Uzun süre kullanılmayacak powerbankın saklanması (3–4 ayda bir boşalt-doldur)",
      "Avustralya ACCC (productsafety.gov.au) — Power banks guide (yanmaz yüzey, sıcak araç, hasarlı powerbank)",
      "New York Eyaleti DHSES — Lithium-ion battery consumer safety guide"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Anker (3,7→5 V, %85–90 verim, 10 000 mAh ≈ 6 000–6 500 mAh kullanılır; 3–4 ayda bir doldurma), ACCC ve NY DHSES (yüzey, sıcaklık, hasar). '2 tam şarj' yalnız ~3 000 mAh telefonda geçerli; 4 000–5 000 mAh için ~1–1,5 olarak yazıldı."
    },
    "art": [
      null,
      "enerji-kapasite",
      "enerji-powerbank-telefon",
      null,
      null,
      null,
      "enerji-takvim-3ay",
      null,
      "tesisat-siskin-powerbank"
    ]
  },
  {
    "id": "enerji-arac",
    "title": "Araçta telefon şarjı: motor, akü ve yakıt",
    "tag": "ENERJİ",
    "summary": "Aracı açık havada çalıştırıp USB ya da çakmaklık adaptöründen şarj edin; motor kapalıyken uzun şarj aküyü bitirir, kapalı garajda motor karbonmonoksitle öldürür.",
    "note": "Aracı kapalı garajda, kapısı açık olsa bile çalıştırmayın. Egzozdaki karbonmonoksit kokusuzdur ve öldürür.",
    "steps": [
      "Aracı açık havaya çıkarın. Kapalı ya da yarı kapalı garajda, kapı açık olsa bile motoru çalıştırmayın.",
      "Egzoz borusunun önünde kar, çamur ya da enkaz olmadığından emin olun.",
      "Telefonu aracın USB girişine ya da çakmaklığa takılan 12 V USB adaptörüne bağlayın.",
      "Motor kapalıyken yalnızca kısa süre şarj edin; radyo, far ve iç lambayı kapatın. Çakmaklık kontak kapalıyken de aküden çeker; akü zayıflarsa araç çalışmayabilir.",
      "Uzun şarj için motoru açık havada çalıştırın ve araçtan uzaklaşmayın.",
      "Şarjı toplu yapın: tüm telefon ve powerbankları aynı anda bağlayın, dolunca motoru kapatın. Rölantide küçük bir araç saatte yaklaşık 1 litre yakıt yakar.",
      "Deponun en az yarısını dolu tutun; tahliye gerekebilir ve akaryakıt istasyonları çalışmayabilir.",
      "Motor çalışırken araçta uyumayın. Baş ağrısı, baş dönmesi ya da bulantı olursa hemen temiz havaya çıkın ve 112'yi arayın."
    ],
    "dont": [
      "Aracı garajda, çadırın ya da açık bir pencerenin dibinde çalıştırmayın.",
      "Motor kapalıyken saatlerce şarj etmeyin; araç çalışmaz hâle gelebilir.",
      "Isınmak ya da şarj etmek için çalışan araçta uyumayın."
    ],
    "keywords": [
      "arabada şarj motor çalışmalı mı",
      "motor kapalıyken şarj",
      "kontak kapalıyken şarj",
      "araba aküsü biter mi",
      "araçta şarj aküyü bitirir mi",
      "rölantide şarj",
      "rölantide yakıt",
      "garajda araba çalıştırmak",
      "garajda motor çalıştırmak",
      "araçta şarj yakıt",
      "çakmaklık usb adaptörü",
      "araç usb girişi",
      "arabada sarj motor"
    ],
    "sources": [
      "ABD Enerji Bakanlığı (energy.gov) — Keeping Mobile Devices Charged (aracı havadar yerde, garajdan çıkararak şarj)",
      "CDC — Carbon Monoxide Poisoning (bitişik garajda araç çalıştırmama)",
      "AAA — Silent battery drains (12 V soket kontak kapalıyken aküden çeker)",
      "Argonne Ulusal Laboratuvarı — Idling worksheet (1–2 L motor rölantide saatte 0,16–0,32 galon ≈ 0,6–1,2 L)",
      "Amerikan Kızılhaçı — Power outage safety (deponun yarısını dolu tutma)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "energy.gov (havadar yer, garajdan çıkar), CDC/CPSC (açık kapı yetmez), AAA (12 V soket kontak kapalıyken çeker), Argonne (rölanti 0,6–1,2 L/saat → 'yaklaşık 1 L'). 'Günde kısa çalıştırma' süresi için kaynak yok; süre verilmedi."
    },
    "art": [
      "tesisat-araba-disarida",
      null,
      "tesisat-usb-sarj",
      null,
      null,
      null,
      null,
      "enerji-arac-uyuma-yasak"
    ]
  },
  {
    "id": "enerji-gunes",
    "title": "Güneş paneliyle telefon şarjı: gerçekçi beklentiler",
    "tag": "ENERJİ",
    "summary": "Katlanır paneli gölgesiz yerde güneşe dik tutun, önce powerbankı doldurun ve kutudaki watt değerinin çoğu zaman yaklaşık yarısını bekleyin.",
    "steps": [
      "Katlanır güneş panelini gölgesiz, açık bir yere koyun; yüzü güneşe dik baksın.",
      "Güneş ilerledikçe paneli sık sık, örneğin 1–2 saatte bir, yeniden güneşe çevirin.",
      "Panelle önce powerbankı doldurun, telefonu sonra powerbanktan şarj edin. Bulut geçince panelin gücü düşer; powerbank bu kesintiyi karşılar.",
      "Gerçekçi olun: kutudaki watt en iyi koşuldadır. 20 W yazan bir katlanır panel tam güneşte çoğu zaman yaklaşık yarısını ya da daha azını verir.",
      "Bulutlu havada, gölgede ya da cam arkasında güç çok düşer; şarj neredeyse durabilir. Paneli pencere içine değil, dışarıya koyun.",
      "Paneli güneşte bırakın ama telefonu ve powerbankı gölgede tutun; piller sıcakta bozulur.",
      "Güneşli bir günde iyi bir panel bir telefonu ya da küçük bir powerbankı doldurabilir; bulutlu günde bunun çok azını bekleyin.",
      "Kabloları ve bağlantıları yağmurdan koruyun; ıslak fişi takmayın."
    ],
    "dont": [
      "Paneli cam arkasına koyup tam güç beklemeyin.",
      "Powerbankı ya da telefonu güneşin altında bırakmayın.",
      "Islak paneli ya da kabloyu cihaza takmayın."
    ],
    "keywords": [
      "katlanır güneş paneli",
      "güneş paneli kaç watt verir",
      "bulutlu havada güneş paneli",
      "cam arkasında güneş paneli",
      "güneş paneli telefonu doldurur mu",
      "güneş enerjisiyle telefon şarjı",
      "güneş paneli açısı",
      "solar panel telefon",
      "taşınabilir güneş paneli",
      "gunes paneli telefon"
    ],
    "sources": [
      "REI — How to Choose Solar Chargers and Portable Power (güneşe dik açı, sık çevirme, bulut, önce powerbank)",
      "BudgetLightForum — AUKEY 20 W katlanır panel ölçümü (tam güneşte ~4,9 V × 1,55 A ≈ 7,5 W; yarı saydam örtü altında 0,06 A)",
      "Avustralya ACCC — Power banks guide (powerbankı sıcakta bırakmama)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "REI (açı, bulut, powerbank tampon, 'garanti değil'), BudgetLightForum ölçümü (20 W panel ≈ 7,5 W; örtü altında neredeyse sıfır). Cam arkası için doğrudan ölçüm yok; yarı saydam örtü testine dayanılarak 'çok düşer' denildi."
    },
    "art": [
      "tesisat-panel-gunese",
      null,
      "tesisat-panel-powerbank",
      null,
      "enerji-panel-bulut",
      "tesisat-pil-golgede",
      null,
      null
    ]
  },
  {
    "id": "enerji-kurmali",
    "title": "Kurmalı radyo, el dinamosu ve bisiklet dinamosu",
    "tag": "ENERJİ",
    "summary": "Kurmalı radyoyu önce haber dinlemek için kullanın; birkaç dakikalık kurma ancak birkaç dakikalık radyo ya da kısa bir arama kadar şarj verir.",
    "steps": [
      "Kurmalı (dinamolu) radyoyu önce kendi pilini doldurmak ve haber dinlemek için kullanın.",
      "Kolu düzenli ve orta hızda çevirin; kılavuzlar genelde dakikada yaklaşık 100–120 tur önerir.",
      "Gerçekçi olun: 1–2 dakika kurma genelde birkaç dakika radyo ya da ışık sağlar.",
      "Telefonu bağlarsanız uzun süre çevirin; birkaç dakikalık kurma ancak kısa bir arama ya da birkaç mesaj kadar şarj verir. Tam dolum beklemeyin.",
      "Radyonun güneş paneli varsa gündüz güneşe bırakın; kolu çevirmeye daha az gerek kalır.",
      "Kolu evdekilerle sırayla çevirin; zorlamayın, dişliler kırılabilir.",
      "Bisikletinizde göbek dinamosu varsa hazır bir dinamo-USB dönüştürücüyle sürerken powerbank doldurabilirsiniz. Ayrıntı: [[enerji-ky-bisiklet|\"Kendin yap: bisiklet dinamosundan USB şarjı\"]]."
    ],
    "dont": [
      "Kurmalı aletle telefonu tam doldurmayı beklemeyin.",
      "Radyoyu yağmurda ıslak bırakmayın."
    ],
    "keywords": [
      "kurmalı radyo",
      "kurmali radyo",
      "dinamolu radyo",
      "el dinamosu",
      "kollu şarj aleti",
      "çevirmeli şarj aleti",
      "kurmalı şarj",
      "dinamo ile telefon şarjı",
      "elle çevirerek şarj",
      "kurmalı el feneri"
    ],
    "sources": [
      "Eton (Amerikan Kızılhaçı FRX3) — SSS: 1–2 dakika kurma birkaç dakika radyo ya da ışık sağlar",
      "Survivor kurmalı radyo kılavuzu (OpticsPlanet) — dakikada 100–120 tur; 1 dakika kurma ≈ 5–6 dakika radyo; telefonu tam şarj garantisi yok",
      "Busch & Müller — E-Werk dinamo-USB dönüştürücü (yaklaşık 8 km/s ve üstünde şarj)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Eton FRX3 SSS ve Survivor kılavuzu (tur hızı, kurma/radyo süresi, telefonda tam şarj garantisi yok), Busch & Müller E-Werk (8 km/s). 'Dakikalar kurma → dakikalar konuşma' için sayısal üretici verisi yok; sayı verilmedi."
    },
    "art": [
      "battery-radio",
      "enerji-kurmali",
      null,
      null,
      null,
      null,
      "enerji-bisiklet-dinamo"
    ]
  },
  {
    "id": "enerji-kalem-pil",
    "title": "Kalem pille telefon şarjı",
    "tag": "ENERJİ",
    "summary": "Kalem pil kutulu USB şarj aparatı acil bir arama ya da birkaç mesaj için yeter; 4 alkalin pil bugünkü bir telefonu yalnızca yaklaşık %15–25 doldurur.",
    "steps": [
      "Kalem pil (AA) kutulu bir USB şarj aparatı kullanın; çoğuna 2 ya da 4 pil girer.",
      "Pilleri kutudaki işarete göre takın: artı (+) ve eksi (−) uçları doğru yöne baksın.",
      "Gerçekçi olun: 4 alkalin kalem pil bugünkü bir telefonu yalnızca yaklaşık %15–25 doldurur; bu birkaç mesaja ve kısa bir aramaya yeter.",
      "Şarjlı (NiMH) kalem pil kullanın: telefon gibi çok akım çeken cihazlarda alkalinden belirgin şekilde fazla şarj verir.",
      "Şarj ederken telefonu kapatın ya da uçak moduna alın; pillerin verdiği az enerji boşa gitmesin.",
      "Biten pilleri çıkarın; eski ve yeni pili, farklı marka pili birlikte takmayın.",
      "Yedek pilleri paketinde, serin ve kuru yerde saklayın."
    ],
    "dont": [
      "Alkalin pilleri şarj etmeye çalışmayın; akabilir ya da patlayabilir.",
      "Akmış, ısınmış ya da şişmiş pili kullanmayın.",
      "Pilleri cepte anahtar ve bozuk parayla birlikte taşımayın."
    ],
    "keywords": [
      "kalem pille şarj",
      "kalem pille sarj",
      "pille telefon şarj etmek",
      "aa pil ile şarj",
      "pil kutulu şarj aleti",
      "kalem pil şarj aparatı",
      "pilli şarj cihazı",
      "4 kalem pil kaç şarj",
      "kalem pil telefon",
      "aaa pil ile şarj"
    ],
    "sources": [
      "Marco Arment — Charging an iPhone with AA batteries (4 alkalin AA: 0,70; 4 NiMH AA: 1,21 '%20–100' dolum, ~1,4 Ah'lik telefonda)",
      "Joe Wein — Eneloop NiMH ile telefon besleme (alkalin yüksek akımda kapasitesinin yaklaşık dörtte birini verir)",
      "Energizer — E91 AA teknik veri (kapasite yükle düşer; 0,8 V'a deşarj)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Ölçüm: 4 alkalin AA ≈ 0,7 × %80 × ~5,3 Wh ≈ 3 Wh; bugünkü telefon 12–20 Wh → ~%15–25. NiMH ~1,7 kat. Kaynak üretici değil, bağımsız testler; sayılar 'yaklaşık' ve korumacı."
    },
    "art": [
      "enerji-kalem-pil",
      null,
      null,
      null,
      "enerji-ucak-modu",
      null,
      null
    ]
  },
  {
    "id": "enerji-laptop-ups",
    "title": "Dizüstü bilgisayar, UPS ve başka telefondan güç alma",
    "tag": "ENERJİ",
    "summary": "Dizüstü bilgisayarın USB girişi iyi bir yedektir; UPS kısa süre içindir, telefondan telefona şarj ise yalnızca acil bir arama içindir.",
    "steps": [
      "Dizüstü bilgisayarın pili doluysa telefonu bilgisayarın USB girişine takın.",
      "Bilgisayarın ekran parlaklığını kısın ve diğer programları kapatın. Bazı dizüstüler uykudayken de USB'den şarj verir; denemeden güvenmeyin.",
      "Evdeki UPS (kesintisiz güç kaynağı) bilgisayarı güvenle kapatmak için yapılmıştır; süresi kısadır. Telefon için powerbank daha iyidir.",
      "UPS'e yalnızca telefon şarj aletini takın; ısıtıcı, su ısıtıcısı, ütü gibi güçlü cihazları takmayın.",
      "UPS sürekli öterse aşırı yük vardır: cihazları çıkarın, birer birer yeniden takın.",
      "UPS'in ışığı hızlı yanıp sönmeye başlarsa pil bitmek üzeredir; işinizi bitirip kapatın.",
      "Telefonunuzda ters kablosuz şarj varsa (ör. Samsung'da Wireless PowerShare) iki telefonu kılıfsız, sırt sırta ve ortalayarak koyun.",
      "Kabloyla da olabilir: bazı Android telefonlar USB-C – USB-C kabloyla birbirine şarj verir; hangisinin vereceğini bildirim menüsünden seçin.",
      "Telefondan telefona şarjda verim düşüktür ve verenin şarjı hızla azalır; yalnızca acil bir arama ya da mesaj için kullanın."
    ],
    "dont": [
      "UPS'e ısıtıcı, ütü, su ısıtıcısı gibi güçlü cihaz takmayın.",
      "Sürekli öten UPS'i kullanmaya devam etmeyin.",
      "Kendi telefonunuzun şarjını başkasına verirken tamamen bitirmeyin."
    ],
    "keywords": [
      "laptoptan şarj",
      "laptoptan sarj",
      "bilgisayardan telefon şarjı",
      "dizüstü bilgisayardan şarj",
      "ups ile şarj",
      "kesintisiz güç kaynağı",
      "ups ötüyor",
      "ups bip sesi",
      "telefondan telefona şarj",
      "ters kablosuz şarj",
      "kablosuz güç paylaşımı",
      "powershare",
      "otg kablo ile şarj"
    ],
    "sources": [
      "APC (Schneider Electric) — Back-UPS ES sorun giderme SSS (aküde çalışma, ~2 dk kala hızlı yanıp sönme, sürekli ses = aşırı yük)",
      "Samsung — Wireless PowerShare kullanımı (sırt sırta, ortalama, kılıfı çıkarma, pil belli düzeyin altına inince durur)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "APC SSS (UPS bilgisayarı kapatmak içindir, aşırı yükte cihazları birer birer takma, hızlı yanıp sönme), Samsung PowerShare sayfası. USB-C kabloyla telefondan telefona şarjın her modelde olduğu doğrulanamadı; 'bazı telefonlar' denildi."
    },
    "art": [
      "enerji-laptop-usb",
      null,
      "enerji-ups",
      null,
      null,
      null,
      "enerji-telefon-telefona",
      null,
      null
    ]
  },
  {
    "id": "enerji-jenerator",
    "title": "Jeneratörden telefon şarjı",
    "tag": "ENERJİ",
    "summary": "Jeneratörü yalnızca açık havada, kapı ve pencerelerden en az 6 metre uzakta çalıştırın; şarj aletlerini dış mekân tipi sağlam bir uzatma kablosuyla bağlayın.",
    "note": "Jeneratörün egzozundaki karbonmonoksit dakikalar içinde öldürebilir. Ev, garaj, bodrum, balkon ve çadır içinde asla çalıştırmayın; açık pencere yetmez.",
    "steps": [
      "Jeneratörü yalnızca açık havada çalıştırın; ev, garaj, bodrum, balkon, depo ya da çadır içinde asla çalıştırmayın.",
      "Kapı, pencere ve havalandırma deliklerinden en az 6 metre uzağa koyun; egzozu binalardan ve çadırlardan uzağa çevirin.",
      "Kuru bir zemine, yanları açık bir tente altına koyun; yağmurda açıkta çalıştırmayın.",
      "Şarj aletlerini doğrudan jeneratöre ya da dış mekâna uygun, sağlam, topraklı bir uzatma kablosuna takın.",
      "Uzatma kablosunun taşıyabileceği gücün, takılı cihazların toplamından yüksek olduğundan emin olun.",
      "Jeneratörü evin prizine ya da sigorta kutusuna asla bağlamayın; hatta çalışan teknisyenleri ve komşuları çarpabilir.",
      "Yakıt eklemeden önce jeneratörü kapatın ve soğumasını bekleyin; yakıtı evin dışında, onaylı bidonda saklayın.",
      "Evde pilli karbonmonoksit alarmı kullanın. Baş ağrısı, baş dönmesi ya da bulantı olursa herkesi temiz havaya çıkarın ve 112'yi arayın.",
      "Uzun süreli kullanım için [[tesisat-jenerator|\"Jeneratör güvenliği\" rehberini]] okuyun."
    ],
    "dont": [
      "Kapıyı ya da pencereyi açarak jeneratörü içeride çalıştırmayın.",
      "Jeneratörü duvardaki prize takarak evi beslemeye çalışmayın.",
      "Çalışan ya da sıcak jeneratöre yakıt koymayın."
    ],
    "keywords": [
      "jeneratörden şarj",
      "jeneratörden sarj",
      "jenaratörden şarj",
      "jeneratörle telefon şarjı",
      "jeneratöre şarj aleti takmak",
      "jeneratörle powerbank doldurmak",
      "jeneratör uzatma kablosu",
      "jeneratörden telefon"
    ],
    "sources": [
      "CPSC — Portable Generator Hazards (Safety Alert 5123): yalnız dışarıda, açık kapı/pencere yetmez, dış mekân tipi kablo, soğuyunca yakıt, prize bağlamama",
      "CPSC — Carbon Monoxide from Generators Can Kill in Minutes",
      "CPSC — Keep Your Family Safe as Dangerous Storms Spread (evden en az 20 ft ≈ 6 m)",
      "CDC — Carbon Monoxide Poisoning"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "CPSC 5123 ve basın bültenleri: 20 ft (≈6 m), garaj/bodrum/sundurma yasağı, açık pencere yetmez, tente altında kuru zemin, dış mekân tipi kalın kablo ve kablo gücü > toplam yük, soğuyunca yakıt, backfeed yasağı, pilli CO alarmı."
    },
    "art": [
      "tesisat-jenerator-disarida",
      "tesisat-jenerator-mesafe",
      "tesisat-jenerator-tente",
      null,
      null,
      "tesisat-priz-baglama-yasak",
      "tesisat-yakit-soguk",
      "barinma-co-alarm",
      null
    ]
  },
  {
    "id": "enerji-sarj-noktasi",
    "title": "Afetten sonra telefon şarjı için ortak noktalar",
    "tag": "ENERJİ",
    "summary": "Toplanma alanında, çadır kentte ya da belediye ve operatör noktalarında şarj imkânı sorun; kendi kablonuzu götürün, sıranıza uyun ve prizi paylaşın.",
    "steps": [
      "Toplanma alanında, çadır kentte ya da konteyner kentte görevlilere şarj noktası olup olmadığını sorun. 6 Şubat 2023 depremlerinden sonra çadır kentlere jeneratörle aydınlatma ve priz çekildi.",
      "Bazı büyükşehir belediyeleri toplanma alanları için güneş paneli ve jeneratörle çalışan, şarj istasyonlu mobil iletişim araçları hazırlamıştır; bunlar AFAD koordinasyonunda çalışır.",
      "Muhtarlığa, hastaneye ve belediye hizmet noktalarına sorun; jeneratörü olan yerlerde şarj imkânı olabilir.",
      "GSM operatörlerinin mağazalarını ve mobil baz istasyonu araçlarını takip edin; 2023 depremlerinde bazı mağazalarda powerbank desteği verildi.",
      "Kendi kablonuzu ve varsa çok girişli bir USB şarj başlığı götürün; bir priz birkaç telefona yetsin.",
      "Sıra varsa önce telefonu doldurun, powerbankı sonra; telefon yeterince dolunca yeri başkasına bırakın.",
      "Telefonunuzun başında bekleyin; kalabalıkta telefon ve powerbank kaybolabilir.",
      "Hasta, yaşlı ve tek başına kalan çocuklara öncelik verin.",
      "Şarj noktalarının yeri değişebilir; duyuruları pilli radyodan ve resmî hesaplardan takip edin."
    ],
    "dont": [
      "Başkasının şarj kablosunu ya da fişini izinsiz çıkarmayın.",
      "Islak, çamurlu prize ya da üst üste takılmış çoklu prizlere telefon bağlamayın.",
      "Telefonunuzu ortak noktada başıboş bırakmayın."
    ],
    "keywords": [
      "şarj noktası",
      "sarj noktasi",
      "ortak şarj noktası",
      "şarj istasyonu nerede",
      "nerede telefon şarj edebilirim",
      "telefonu nerede şarj ederim",
      "çadır kentte şarj",
      "toplanma alanında şarj",
      "mobil şarj istasyonu",
      "deprem bölgesinde şarj",
      "afette şarj noktası",
      "telefon şarj ettirecek yer"
    ],
    "sources": [
      "BirGün — Hatay'da çadır kent ve sokaklarda elektrik (jeneratör, çadırlara aydınlatma ve priz), Şubat 2023",
      "ANKA — İzmir Büyükşehir: güneş paneli ve jeneratörlü, mobil şarj istasyonlu iletişim araçları, AFAD koordinasyonunda toplanma alanlarında",
      "Para Dergi — Türk Telekom: mobil baz istasyonları, mağazalarda powerbank desteği (6 Şubat 2023)",
      "Habertürk — Operatörlerin ortak açıklaması: mobil baz istasyonları, jeneratör, ücretsiz Wi-Fi ve ankesörlü telefon (Şubat 2023)",
      "Turkcell — Afet tedbirleri (mobil baz istasyonu, jeneratör)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Türkiye haber kaynakları: Hatay çadır kentlerinde jeneratör ve priz (BirGün), İzmir'in AFAD koordinasyonlu mobil şarj araçları (ANKA), operatör mobil baz ve powerbank desteği (Para Dergi, Habertürk). AFAD ya da Kızılay'ın resmî 'mobil şarj istasyonu' duyurusu bulunamadı; bu yüzden kesin kurum adı verilmedi."
    },
    "art": [
      "go-assembly-area",
      null,
      null,
      null,
      "enerji-coklu-usb",
      "enerji-sarj-noktasi",
      null,
      null,
      "battery-radio"
    ]
  },
  {
    "id": "enerji-sarj-hatalari",
    "title": "Şarjda yapılan tehlikeli hatalar",
    "tag": "ENERJİ",
    "summary": "Şarjı sert ve yanmaz bir yüzeyde yapın; şişmiş pili, ıslak cihazı ve markasız aletleri kullanmayın, akü ve elektrik hattına doğaçlama kablo bağlamayın.",
    "steps": [
      "Şarjı yatak, yastık ya da koltuk üstünde değil, sert ve yanmaz bir yüzeyde yapın; telefonu ve powerbankı yastık altına koymayın.",
      "Şişmiş, çatlamış, ezilmiş ya da çok ısınan pili ve powerbankı şarj etmeyin; yanmaz bir yere koyup ayırın.",
      "Islak telefonu ya da şarj aletini kurumadan takmayın; yağmurda açıkta şarj etmeyin. Telefonu pirince gömmeyin; kuru ve havadar bir yerde bekletin.",
      "Markasız, çok ucuz şarj aletleri yerine cihazın kendi aletini ya da güvenilir markalı bir aleti kullanın.",
      "Aküye, elektrik direğine ya da sokak lambasına çıplak kabloyla bağlanmaya çalışmayın; ölümcül elektrik çarpması ya da yangın olabilir.",
      "Şarj olan cihazı başında olmadan saatlerce bırakmayın; dolunca fişten çekin.",
      "0 °C altında ya da çok sıcakta şarj etmeyin; cihazı önce oda sıcaklığına getirin.",
      "Duman, koku ya da cızırtı fark ederseniz fişi çekin ve cihazdan uzaklaşın; alev varsa ortamı boşaltın ve 112'yi arayın."
    ],
    "dont": [
      "Şişmiş pili delmeyin, sıkmayın, şarj etmeyin.",
      "Kopmuş elektrik teline yaklaşmayın; en az 20 metre uzak durun.",
      "Çoklu prizleri birbirine takarak uzatmayın."
    ],
    "keywords": [
      "şarj güvenliği",
      "sarj guvenligi",
      "şarjda yangın",
      "telefon şarjdayken ısınıyor",
      "yastık altında şarj",
      "ıslak telefonu şarj etmek",
      "telefon suya düştü şarj",
      "şarj aleti yandı",
      "şarjda patlama",
      "ucuz şarj aleti",
      "lityum pil yangını"
    ],
    "sources": [
      "New York Eyaleti DHSES — Lithium-ion battery consumer safety guide (yastık/yatak/koltuk, dolunca çıkarma, 0 °C altında şarj etmeme, şişme)",
      "Singapur CPSO — Safety tips on lithium-ion batteries (şişmiş pili şarj etmeme, yastık altı, üretici şarj aleti)",
      "Avustralya ACCC — Power banks guide (yanmaz yüzey, dumanda ortamı boşaltma)",
      "Apple — iPhone'da sıvı algılandı uyarısı (pirince koymama, 30 dakika sonra tekrar deneme)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "NY DHSES, Singapur CPSO, ACCC (yüzey, şişme, gözetimsiz şarj, sıcaklık, duman), Apple (pirinç yok). Kopmuş tel mesafesi tesisat rehberiyle aynı (20 m, Kızılhaç 35 ft'ten fazla)."
    },
    "art": [
      "enerji-yastik-yasak",
      "tesisat-siskin-powerbank",
      "enerji-islak-telefon-yasak",
      null,
      "enerji-direk-yasak",
      null,
      null,
      null
    ]
  },
  {
    "id": "enerji-hazirlik",
    "title": "Kesintiye hazırlık: yedek güç çantası",
    "tag": "ENERJİ",
    "summary": "Afet çantanızda en az 2 dolu powerbank, kablolar, araç adaptörü, küçük bir güneş paneli ve kurmalı radyo bulundurun; hepsini 3 ayda bir doldurup deneyin.",
    "steps": [
      "Afet çantanıza en az 2 dolu powerbank ve her telefona uygun şarj kablosu koyun.",
      "Araç için 12 V çakmaklık USB adaptörü ve kablosunu bagajda tutun.",
      "Mümkünse küçük katlanır bir güneş paneli ve kurmalı ya da pilli bir radyo ekleyin.",
      "Yedek kalem pilleri ve pil kutulu şarj aparatını ayrı bir poşette saklayın.",
      "Kabloları ve powerbankları su geçirmez bir poşete koyun.",
      "3 ayda bir powerbankları kullanıp yeniden doldurun; radyoyu ve feneri deneyin.",
      "Önemli numaraları kâğıda yazın; bu uygulamanın haritasını ve paketlerini önceden indirin.",
      "Fırtına ya da planlı kesinti duyurusunda tüm telefonları ve powerbankları önceden doldurun."
    ],
    "dont": [
      "Powerbankları yazın sıcak araçta bırakmayın.",
      "Çantaya şişmiş, eski ya da akmış pil koymayın."
    ],
    "keywords": [
      "şarj çantası",
      "sarj cantasi",
      "kesintiye hazırlık",
      "elektrik kesintisine hazırlık",
      "afet çantasına powerbank",
      "kaç powerbank lazım",
      "planlı kesintiye hazırlık",
      "yedek şarj",
      "acil durum şarj seti"
    ],
    "sources": [
      "AFAD — Afet ve acil durum çantası (pilli radyo, el feneri, yedek pil; haber alıntısı: İstiklal)",
      "Turkcell — Afet tedbirleri (taşınabilir şarj cihazını hazır bulundurma)",
      "Ready.gov (FEMA) — Build a Kit (şarj aleti ve yedek pil)",
      "Anker Destek — powerbankı 3–4 ayda bir doldurma"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "AFAD çanta listesi (radyo, fener, yedek pil), Turkcell (taşınabilir şarj cihazı), Ready.gov Kit, Anker (3–4 ay). '2 powerbank' sayısı resmî bir kaynakta yok; görevin önerisi, makul olduğu için bırakıldı."
    },
    "art": [
      "enerji-sarj-cantasi",
      null,
      null,
      "enerji-kalem-pil",
      null,
      "enerji-takvim-3ay",
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-aku-usb",
    "title": "Kendin yap: aküden USB şarjı",
    "tag": "KENDİN YAP",
    "summary": "12 V aküye sigortalı bir çakmaklık soketi ve USB adaptörü bağlayıp güvenli bir şarj kutusu yapın; aküyü yarısının altına boşaltmayın.",
    "note": "Akü kısa devre olursa kablolar kızarır, akü patlayabilir. Kutuplara metal değdirmeyin, mutlaka sigorta takın. Şebeke elektriğine hiçbir şey bağlamayın.",
    "steps": [
      "Malzemeler: 12 V akü (araç, motosiklet ya da kuru/jel akü), dişi çakmaklık soketi, 12 V USB adaptörü, kırmızı ve siyah kablo, akü maşası, hat tipi sigorta yuvası ve 5–10 A sigorta, multimetre, izole bant.",
      "Aküyü multimetreyle ölçün: birkaç saat dinlenmiş akü 12,6 V ve üstündeyse dolu, yaklaşık 12,2 V ise yarı doludur.",
      "Sigorta yuvasını kırmızı (+) kabloya, akü ucuna olabildiğince yakın takın.",
      "Kırmızı kabloyu soketin orta ucuna (+), siyah kabloyu soketin dış gövdesine (−) bağlayın; açık kalan uçları izole bantla sarın.",
      "Kırmızı maşayı artı (+), siyah maşayı eksi (−) kutba takın; maşaları birbirine değdirmeyin.",
      "USB adaptörünü sokete takın ve çıkışı multimetreyle ölçün; yaklaşık 5 V görmelisiniz. Sonra telefonu bağlayın.",
      "Aküyü yarısının altına boşaltmayın: dinlenmiş voltaj yaklaşık 12,2 V'a inince şarjı bırakın. Varsa 12 V düşük voltaj koruma modülü ekleyin.",
      "Aküyü havadar yerde kullanın; yanında ateş yakmayın, sigara içmeyin, kıvılcım çıkarmayın.",
      "İş bitince maşaları çıkarın ve kutupların üstünü kapatın."
    ],
    "dont": [
      "Kutupları tornavida, anahtar ya da telle birbirine değdirmeyin.",
      "Sigortasız bağlantı yapmayın.",
      "Çatlak, sızdıran ya da şişmiş aküyü kullanmayın; asit yakar."
    ],
    "keywords": [
      "aküden usb şarj yapmak",
      "akü ile usb şarj kutusu",
      "akü çakmaklık soketi",
      "12v akü usb",
      "motosiklet aküsünden şarj",
      "jel akü şarj kutusu",
      "akü kendin yap",
      "düşük voltaj koruma",
      "akü sigortası",
      "aku usb kutusu"
    ],
    "sources": [
      "Battery Council International (Practical Sailor alıntısı) — 12 V kurşun asit akü: 12,6 V+ dolu, 12,2 V %50",
      "EnerSys — Kurşun asit akü kullanım kılavuzu (hidrojen, havalandırma, kıvılcım, metal alet, asit)",
      "AAA — Silent battery drains (12 V soket aküden çeker)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "BCI voltaj tablosu (12,6 V dolu, 12,2 V yarı), EnerSys kılavuzu (havalandırma, kıvılcım, metal nesne, asit). Sigortanın artı kabloya aküye yakın takılması yaygın uygulama; bu oturumda yetkili belge açılamadı. Sigorta değeri (5–10 A) yaklaşık."
    },
    "art": [
      "enerji-aku-usb-kutu",
      "enerji-multimetre-aku",
      "enerji-sigorta",
      null,
      "tesisat-aku-masa",
      "enerji-multimetre-usb",
      null,
      "tesisat-aku-kivilcim-yasak",
      null
    ]
  },
  {
    "id": "enerji-ky-gunes-usb",
    "title": "Kendin yap: küçük güneş panelinden USB şarjı",
    "tag": "KENDİN YAP",
    "summary": "12 V'luk küçük bir paneli LM2596 tipi düşürücü modülle 5 V'a indirip USB'ye bağlayın; telefondan önce powerbankı doldurun.",
    "note": "Ayarlanmamış modül 5 V'tan yüksek voltaj verip telefonu bozabilir. Telefonu bağlamadan önce çıkışı mutlaka multimetreyle ölçün.",
    "steps": [
      "Malzemeler: 12 V'luk küçük güneş paneli (ya da hazır USB güneş regülatörü), LM2596 tipi ayarlı düşürücü (buck) modül, USB dişi soket, ince kablo, 2–3 A sigorta, multimetre, powerbank.",
      "Paneli güneşe koyun ve boştaki voltajını ölçün; 12 V'luk panel boşta 20 V'u geçebilir. Bu değer modülün en yüksek giriş voltajının (LM2596'da 40 V) altında olmalı.",
      "Panelin artı (+) ucunu sigortadan geçirip modülün IN+ girişine, eksi (−) ucunu IN− girişine bağlayın.",
      "Telefon bağlı değilken modülün ayar vidasını çevirip çıkışı 5,0–5,1 V'a getirin; multimetreyle doğrulayın.",
      "Modülün OUT+ ucunu USB soketin 1. pinine (+5 V), OUT− ucunu 4. pinine (GND) lehimleyin; uçları makaronla kapatın.",
      "Önce powerbankı bağlayın, telefonu değil. Bulut geçince voltaj düşer; powerbank bu dalgalanmayı karşılar.",
      "Bahçe lambalarından sökülen paneller çok küçüktür; telefon için yetmez, ancak birkaçı birleştirilirse çok yavaş doldurur.",
      "Modül ısınır: havadar ve gölge bir kutuya koyun, yağmurdan koruyun.",
      "Gerçekçi olun: 10 W'lık bir panel iyi güneşte saatte yaklaşık 5 Wh ya da daha az verir; bu bir telefon pilinin yaklaşık dörtte biri ile üçte biri kadardır."
    ],
    "dont": [
      "Paneli doğrudan telefona bağlamayın.",
      "Çıkışı ölçmeden telefon ya da powerbank takmayın.",
      "Bağlantıları açıkta ve ıslak bırakmayın."
    ],
    "keywords": [
      "güneş panelinden usb yapmak",
      "kendin yap güneş şarjı",
      "buck converter",
      "lm2596",
      "voltaj düşürücü modül",
      "panelden usb şarj devresi",
      "bahçe lambası paneli",
      "12v panelden 5v",
      "güneş paneli regülatörü",
      "gunes paneli usb devre"
    ],
    "sources": [
      "Texas Instruments — LM2596 veri sayfası (giriş 40 V'a kadar, 3 A, ayarlı çıkış 1,2–37 V; 12 V'tan 5 V'ta ~%80 verim)",
      "REI — Solar chargers (panellerde çoğu zaman düzenleyici devre yoktur; önce powerbank)",
      "BudgetLightForum — 20 W katlanır panel ölçümü (gerçek güç etiketin yaklaşık yarısı)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "TI LM2596 veri sayfası (40 V giriş, 3 A, %80 verim 12→5 V), REI, BLF ölçümü. 10 W panelden ~5 Wh/saat hesabı: gerçek ~6–7 W × %80. USB-A pin 1 = VBUS, pin 4 = GND standarttır. Bahçe lambası paneli için sayısal kaynak yok; sayı verilmedi."
    },
    "art": [
      "enerji-buck",
      null,
      null,
      "enerji-multimetre-usb",
      null,
      "tesisat-panel-powerbank",
      null,
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-bisiklet",
    "title": "Kendin yap: bisiklet dinamosundan USB şarjı",
    "tag": "KENDİN YAP",
    "summary": "Bisiklet dinamosunun alternatif akımını köprü diyot, kondansatör ve 5 V regülatörle USB'ye çevirin ya da hazır bir dönüştürücü kullanın; sürerken önce powerbankı doldurun.",
    "note": "Dinamo hızlandıkça voltajı yükselir; hızlı inişte devre ve telefon bozulabilir. İnişte bağlantıyı çıkarın.",
    "steps": [
      "En kolay yol: göbek dinamosu için yapılmış hazır bir dinamo-USB dönüştürücü alın; bazıları yaklaşık 8 km/s hızdan itibaren şarj verir.",
      "Kendiniz yapacaksanız malzemeler: köprü diyot (en az 50 V, 1 A), kondansatör (ör. 2 200 µF, en az 50 V), 5 V regülatör ya da düşürücü modül, USB soket, kablo, multimetre, powerbank.",
      "Dinamonun iki ucunu köprü diyotun ~ uçlarına bağlayın; köprünün + ve − uçlarını kondansatöre ve regülatör girişine bağlayın. Kondansatörün eksi bacağı eksiye gelsin.",
      "Tekeri döndürüp regülatör çıkışını multimetreyle ölçün; yaklaşık 5 V olmalı. Sonra USB sokete bağlayın.",
      "Önce powerbankı doldurun; hız değiştikçe ve durunca şarj kesilir, powerbank bunu karşılar.",
      "Gerçekçi olun: tipik 6 V 3 W'lık dinamo yaklaşık 15 km/s'te 2 W, 30 km/s'te 4 W civarı verir; bir saatlik sürüş telefonu ancak yaklaşık %10–20 doldurur.",
      "Kabloları kadroya bağlayın; tekere ve zincire değmesin. Devreyi su geçirmez bir kutuya koyun."
    ],
    "dont": [
      "Dinamoyu doğrudan telefona bağlamayın; dinamo değişken alternatif akım verir.",
      "Hızlı inişte telefonu bağlı bırakmayın.",
      "Sürerken telefonla uğraşmayın."
    ],
    "keywords": [
      "bisiklet dinamosu",
      "bisiklet dinamosu ile şarj",
      "dinamo usb",
      "göbek dinamosu şarj",
      "bisikletle telefon şarjı",
      "bisikletten şarj",
      "dinamo köprü diyot",
      "pedalla şarj",
      "şişe dinamo"
    ],
    "sources": [
      "Busch & Müller — E-Werk ürün sayfası (göbek dinamosu, ~8 km/s ve üstünde şarj)",
      "Seeed Studio — Bisiklet dinamosu 6 V 3 W ölçümü (5 km/s 0,56 W; 15 km/s 1,89 W; 30 km/s 4,09 W)",
      "Hokkaido Wilds — Kendin yap bisiklet dinamosu USB şarjı (köprü doğrultucu, kondansatör, regülatör; uzun inişte yüksek voltaj uyarısı; ~%1/km)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Seeed ölçümleri (güç-hız), B&M (8 km/s), Hokkaido Wilds devresi ve iniş uyarısı. %10–20/saat: 15 km/s × ~%1/km (Xperia Z) ve ~2 Wh/saat ÷ 12–20 Wh ile tutarlı. Parça voltaj değerleri (50 V) korumacı seçildi."
    },
    "art": [
      "enerji-bisiklet-dinamo",
      null,
      "enerji-dinamo-devre",
      "enerji-multimetre-usb",
      null,
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-ruzgar-su",
    "title": "Kendin yap: eski motordan küçük rüzgâr ya da su türbini",
    "tag": "KENDİN YAP",
    "summary": "Eski bir yazıcı ya da koşu bandı motorunu pervane veya su çarkıyla döndürüp elektrik üretin; bu çoğunlukla bir öğrenme projesidir, telefonu düzenli doldurmayı beklemeyin.",
    "note": "Bu daha çok bir deneme projesidir. Dönen kanatlardan uzak durun; dereye girmeyin, çarkı kıyıdan bağlayın. Elektrik hattı yakınına direk dikmeyin.",
    "steps": [
      "Malzemeler: eski yazıcı ya da koşu bandı motoru (fırçalı DC motor) veya step motor, pervane ya da su çarkı, köprü diyot (step motorda her sargıya bir tane), kondansatör, 5 V düşürücü modül, multimetre, powerbank.",
      "Motor milini elle hızlıca çevirip uçlardaki voltajı multimetreyle ölçün; hızlandıkça voltaj artar.",
      "Fırçalı DC motor doğru akım verir. Step motorun her sargısı alternatif akım verir; her sargıyı ayrı köprü diyottan geçirip çıkışları birleştirin.",
      "Pervaneyi rüzgârı engelsiz alan, yere sağlam bağlanmış alçak bir direğe takın; çatıya ve elektrik hattı yakınına kurmayın.",
      "Su çarkını sığ ve yavaş akan bir dereye, kıyıdan bağlayarak koyun; suya girmeyin.",
      "Çıkışı düşürücü modülle 5 V'a ayarlayın, multimetreyle ölçün ve önce powerbankı bağlayın.",
      "Gerçekçi olun: küçük yazıcı motorları çoğu zaman ancak birkaç LED yakar; telefon için daha büyük bir motor ve sürekli güçlü rüzgâr ya da akış gerekir."
    ],
    "dont": [
      "Fırtınada türbinin yanına gitmeyin.",
      "Taşkın ya da hızlı akan suya çark koymaya çalışmayın.",
      "Ölçmeden telefon bağlamayın."
    ],
    "keywords": [
      "rüzgar türbini yapmak",
      "ruzgar turbini yapmak",
      "kendin yap rüzgar türbini",
      "dc motordan elektrik",
      "step motor jeneratör",
      "su çarkı elektrik",
      "dereden elektrik üretmek",
      "yazıcı motoru jeneratör",
      "mini hidroelektrik",
      "koşu bandı motoru jeneratör"
    ],
    "sources": [
      "Hackaday — Investigating the generative properties of a stepper motor (okur ölçümleri: 1 500 dev/dk'da ~14 V, 200 mA; küçük step motorlar ancak birkaç LED yakar)",
      "Instructables — Low-tech wind turbine with old printer motor"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Kaynaklar hobi/topluluk düzeyinde (Hackaday, Instructables); yetkili kurum kaynağı yok. Bu yüzden sayı verilmedi, yalnızca 'birkaç LED' ve 'öğrenme projesi' denildi. Uzman incelemesi gerekir."
    },
    "art": [
      null,
      null,
      null,
      "enerji-turbin",
      "enerji-su-carki",
      "enerji-multimetre-usb",
      null
    ]
  },
  {
    "id": "enerji-ky-termoelektrik",
    "title": "Kendin yap: sobanın ısısından elektrik (termoelektrik)",
    "tag": "KENDİN YAP",
    "summary": "Sıcak soba yüzeyi ile soğutulmuş yüz arasındaki farktan elektrik üreten bir TEG modülüyle küçük bir şarj yapabilirsiniz; en iyi durumda birkaç watt bekleyin.",
    "note": "Modül 150 °C'yi geçerse bozulur. Soba ve ateş yanık ve karbonmonoksit tehlikesi taşır; kapalı çadırda ya da odada ateş, mangal yakmayın.",
    "steps": [
      "Hazır çözüm: termoelektrik kamp ocakları ateşten yaklaşık 2 W USB şarj verir; üreticiye göre 20 dakika şarj yaklaşık 1 saat konuşma sağlar.",
      "Kendiniz yapacaksanız malzemeler: TEG modülü (ör. SP1848), ısı macunu, sobaya oturan düz metal levha, alüminyum soğutucu ya da su dolu metal kap, 5 V yükseltici modül, multimetre, powerbank.",
      "Modülün sıcak yüzünü levhaya, soğuk yüzünü soğutucuya macunla bastırarak sıkıştırın; iki yüz arasındaki fark büyüdükçe güç artar.",
      "Sıcak yüzü 150 °C'nin altında tutun; modülü doğrudan aleve değdirmeyin.",
      "Soğuk tarafı su dolu kapla serin tutun; su ısındıkça değiştirin.",
      "Çıkışı multimetreyle ölçün: tek modül 100 °C farkta boşta yaklaşık 4,8 V verir, yük bağlayınca düşer. Bu yüzden 5 V yükseltici modül kullanın.",
      "Gerçekçi olun: tek modül en iyi durumda birkaç watt, çoğu zaman daha azını verir; telefonu doldurmak saatler sürer.",
      "Önce powerbankı doldurun; ateş azalınca şarj durur."
    ],
    "dont": [
      "Modülü doğrudan aleve koymayın.",
      "Kapalı çadırda ya da odada ateş, mangal, soba yakmayın.",
      "Sıcak levhaya ve modüle çıplak elle dokunmayın."
    ],
    "keywords": [
      "termoelektrik jeneratör",
      "termoelektrik şarj",
      "peltier ile elektrik",
      "peltier şarj",
      "peltier sarj",
      "teg modülü",
      "sobadan elektrik",
      "ateşten şarj",
      "ısıdan elektrik üretmek",
      "biolite"
    ],
    "sources": [
      "BioLite CampStove (EEPower haberi) — USB çıkışı sürekli 2 W, en çok 4 W; 20 dakika şarj ≈ 60 dakika konuşma (iPhone 4S)",
      "SP1848-27145 TEG modülü satıcı verisi — en yüksek 150 °C; ΔT 100 °C'de boşta ~4,8 V"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "BioLite üretici verisi (EEPower), SP1848 satıcı tablosu (150 °C, ΔT'ye göre boşta voltaj). Satıcı sayfasında akım değerleri çelişkili; akım ve watt verilmedi, 'birkaç watt ya da daha az' denildi."
    },
    "art": [
      null,
      "enerji-teg",
      null,
      "enerji-teg-alev-yasak",
      null,
      "enerji-multimetre-usb",
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-18650",
    "title": "Söküm pillerden powerbank yapmak: neden önerilmez",
    "tag": "KENDİN YAP",
    "summary": "Eski dizüstü ya da elektronik sigara pillerinden powerbank yapmayın; geçmişi bilinmeyen lityum pil yangın çıkarabilir. Güvenilir markalı hazır bir powerbank kullanın.",
    "note": "Söküm 18650 lityum pillerle yapılan paketler kısa devre, aşırı ısınma ve yangın riski taşır. Afet sırasında bu tür denemeler yapmayın.",
    "steps": [
      "Söküm pillerin geçmişini bilemezsiniz; içten hasarlı bir pil şarjda ısınıp alev alabilir.",
      "Gevşek, kılıfsız pillerin uçları anahtar ya da bozuk paraya değerse kısa devre olur, ısınır ve yanar.",
      "Güvenli yol: güvenilir markalı, hazır bir powerbank alın.",
      "Pil kutusu kullanacaksanız yalnızca yeni, markalı, koruma devreli pil ve hazır, kapalı bir 18650 powerbank kutusu kullanın.",
      "Ezik, şişmiş, kılıfı yırtık, paslı ya da ısınan pili asla kullanmayın; ayrı, yanmaz bir kapta saklayın.",
      "TP4056 gibi tek hücre şarj modüllerini yalnızca koruma devreli (ör. DW01) sürümleriyle ve başında durarak kullanın; bu bir hobi işidir, afet anında denemeyin.",
      "Kullanılmış lityum pilleri çöpe atmayın; pil toplama kutularına bırakın.",
      "Pil duman çıkarırsa ondan uzaklaşın, ortamı boşaltın ve 112'yi arayın."
    ],
    "dont": [
      "Söküm pilleri seri ya da paralel bağlayıp kendi paketinizi yapmayın.",
      "Farklı yaşta, markada ve doluluktaki pilleri birlikte kullanmayın.",
      "Pilleri cepte ya da çantada anahtarla birlikte taşımayın."
    ],
    "keywords": [
      "18650 powerbank yapmak",
      "18650 pil",
      "laptop pilinden powerbank",
      "söküm pil",
      "eski pillerden powerbank",
      "powerbank yapımı",
      "powerbank yapmak",
      "tp4056",
      "elektronik sigara pili",
      "lityum pil kendin yap"
    ],
    "sources": [
      "CPSC — Gevşek 18650 lityum iyon hücre uyarısı (Engadget haberi): açık uçlar metale değince kısa devre, yangın, patlama",
      "Singapur CPSO — Hasarlı pili kullanmama, pile müdahale etmeme",
      "Avustralya ACCC — Power banks guide (güvenilir satıcı, hasarlı powerbank)",
      "DW01A koruma entegresi teknik özeti (aşırı şarj ~4,3 V, aşırı deşarj ~2,4 V, aşırı akım koruması)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "CPSC gevşek 18650 uyarısı (Engadget alıntısı), Singapur CPSO (pile müdahale etmeme), ACCC. Görev 'güvenli sunamıyorsan neden yapılmaması gerektiğini anlat' dediği için yapım adımı verilmedi."
    },
    "art": [
      "enerji-18650-yasak",
      null,
      "enerji-powerbank-telefon",
      null,
      "tesisat-siskin-powerbank",
      null,
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-efsaneler",
    "title": "Şarjla ilgili efsaneler: işe yaramayan ve tehlikeli yöntemler",
    "tag": "KENDİN YAP",
    "summary": "Limon ve patates telefon doldurmaz, elektrik direğinden ve sokak lambasından şarj öldürür; işe yarayan yöntemlere zaman ayırın.",
    "steps": [
      "Limon, patates ya da meyveyle telefon şarj edilmez: bir limon pili yaklaşık 1 miliamper verir, telefon bunun yaklaşık bin katını çeker.",
      "Elektrik direğinden, sokak lambasından ya da kopmuş telden şarj almaya çalışmayın; şebeke elektriği öldürür. Kopmuş telden en az 20 metre uzak durun ve 112'yi arayın.",
      "Pili ovmak, ısıtmak ya da dondurucuya koymak onu doldurmaz; ısıtmak pili şişirip yangın çıkarabilir.",
      "Telefona yüklenen 'şarj uygulamaları' pili doldurmaz; yalnızca tasarruf ayarları süreyi uzatır.",
      "Araç aküsüne telefonu çıplak kabloyla doğrudan bağlamayın; 12 V telefonu bozar, kısa devre aküyü patlatabilir.",
      "Islak telefonu pirince gömmek onu kurtarmaz; kapatın, kuru ve havadar yerde bekletin, kurumadan şarj etmeyin.",
      "9 V pille şarj ancak uygun bir dönüştürücüyle olur ve çok az şarj verir.",
      "Gerçekten işe yarayanlar: powerbank, açık havada araç, güneş paneli ile powerbank, kurmalı radyo ve ortak şarj noktaları. Bkz. [[enerji-sarj-yollari|\"Elektrik yok: telefon şarjı için tüm yollar\"]]."
    ],
    "dont": [
      "Elektrik hattına, direğe ya da lambaya kablo bağlamaya kalkmayın.",
      "Pili ateşte, sobada ya da mikrodalgada ısıtmayın."
    ],
    "keywords": [
      "limonla şarj",
      "limonla sarj",
      "limon pili",
      "patatesle telefon şarjı",
      "meyveden elektrik",
      "sokak lambasından şarj",
      "elektrik direğinden şarj",
      "şarj efsaneleri",
      "pili ısıtmak",
      "telefonu pirince koymak",
      "9v pil ile şarj"
    ],
    "sources": [
      "Illinois Üniversitesi Fizik Bölümü — Ask the Van: Lemon batteries (limon pili yaklaşık 1 mA)",
      "Apple — Sıvı algılandı uyarısı (pirince koymama; haber alıntısı: PetaPixel)",
      "EnerSys — Kurşun asit akü güvenliği (kısa devre, kıvılcım, patlama)",
      "Amerikan Kızılhaçı — Power outage safety (düşen telden uzak durma)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "Illinois (limon ~1 mA; telefon şarjı ~1 A = ~1 000 kat), Apple (pirinç), EnerSys (kısa devre), tesisat rehberindeki 20 m mesafe. 'Dondurucu/ovma' ve 'şarj uygulaması' efsaneleri için yetkili kaynak yok; fizik açısından açık, uzman onayı gerekir."
    },
    "art": [
      "enerji-limon-yasak",
      "enerji-direk-yasak",
      null,
      null,
      "enerji-aku-telefon-yasak",
      "enerji-islak-telefon-yasak",
      null,
      null
    ]
  },
  {
    "id": "enerji-ky-komsu",
    "title": "Kendin yap: komşular için telefon şarjı köşesi",
    "tag": "KENDİN YAP",
    "summary": "Araç ya da jeneratörden beslenen, çok girişli USB başlıklı bir masa kurun; güç kaynağını kalabalıktan uzak tutun, sıra listesi yapın ve gücü aşmayın.",
    "note": "Araç ya da jeneratör kullanıyorsanız yalnızca açık havada çalıştırın; kalabalığı egzozdan ve jeneratörden en az 6 metre uzak tutun.",
    "steps": [
      "Malzemeler: çok girişli USB şarj başlığı, USB-C, Lightning ve mikro USB kablolar, dış mekâna uygun topraklı uzatma kablosu, masa, kâğıt, kalem, bant.",
      "Güç kaynağını seçin: araç için 12 V çok girişli USB adaptörü; jeneratör varsa topraklı tek bir çoklu priz.",
      "Jeneratörü ya da çalışan aracı kalabalıktan, kapı ve pencerelerden en az 6 metre uzağa koyun; kabloyu yürüme yolundan geçirmeyin.",
      "Masayı kuru, gölge ve yağmurdan korunan bir yere kurun; prizleri yerden yükseğe koyun.",
      "Kâğıda sıra listesi yapın; her telefon için bir süre ya da hedef doluluk belirleyin.",
      "Telefonların arkasına bantla isim yazın; telefonu yalnızca sahibine teslim edin.",
      "Adaptörün ve başlığın üzerinde yazan toplam watt değerini aşmayın; ara ara elinizle ısınmayı kontrol edin.",
      "Hasta, yaşlı, tek başına kalan çocuklar ve tıbbi cihaz kullananlara öncelik verin.",
      "Kapatırken önce prizleri çıkarın, sonra aracı ya da jeneratörü kapatın; yakıtı ancak soğuyunca ekleyin."
    ],
    "dont": [
      "Çoklu prizleri birbirine takarak uzatmayın.",
      "Jeneratörü kalabalığın, çadırın ya da pencerenin dibine koymayın.",
      "Islak zeminde priz ve kablo bırakmayın."
    ],
    "keywords": [
      "şarj köşesi kurmak",
      "sarj kosesi",
      "komşulara şarj",
      "mahallede şarj noktası kurmak",
      "çoklu usb şarj başlığı",
      "ortak şarj istasyonu kurmak",
      "jeneratörle şarj istasyonu",
      "arabadan herkese şarj",
      "toplu şarj"
    ],
    "sources": [
      "CPSC — Portable Generator Hazards (Safety Alert 5123): dışarıda, açıklıklardan uzak, dış mekân tipi kablo, kablo gücü > toplam yük, soğuyunca yakıt",
      "CPSC — Keep Your Family Safe (evden en az 20 ft ≈ 6 m)",
      "Singapur CPSO — Lityum pil güvenliği (şarj sırasında gözetim)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-07",
      "note": "CPSC 5123 ve bülten (6 m, kablo, yakıt), CPSO (gözetim). Sıra, isim etiketi, öncelik düzeni topluluk düzeni önerisidir; resmî kaynak yok."
    },
    "art": [
      "enerji-coklu-usb",
      null,
      "tesisat-jenerator-mesafe",
      "enerji-sarj-noktasi",
      null,
      null,
      null,
      null,
      null
    ]
  }
];
