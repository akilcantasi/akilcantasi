// Rehber kategorisi: Doğada hayatta kalma
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "hayatta-kalma",
  "title": "Doğada hayatta kalma",
  "hint": "Su bulma, yön bulma, ateş, barınak",
  "art": "cat-hayatta-kalma",
  "color": "#86efac",
  "order": 4
};

export const GUIDES: Guide[] = [
  {
    "id": "hayatta-kalma-su-bulma",
    "title": "Doğada su bulma",
    "tag": "HAYATTA KALMA",
    "summary": "Akan su sesini dinleyin, aşağıya, vadilere ve yeşil bitki örtüsüne yönelin; yağmur ve çiy toplayın, bulduğunuz suyu arıtmadan içmeyin.",
    "steps": [
      "Durun ve dinleyin. Akan suyun sesi uzaktan duyulur.",
      "Aşağıya bakın. Su yokuş aşağı akar; vadilere, dere yataklarına ve yamaç diplerine yönelin.",
      "Yeşil ve sık bitki örtüsü, sazlık ve nemli toprak yakında su olduğunu gösterir. Hayvan izleri ve sabah-akşam kuşların uçtuğu yön de suya götürebilir.",
      "Kaynak suyunu yerden çıktığı yerden alın. Durgun gölet yerine akan suyu, büyük nehir yerine küçük dereyi seçin.",
      "Yağmur suyu toplayın: naylonu ya da brandayı ağaçlara gerin, ortasına küçük bir taş koyun, altına bir kap yerleştirin.",
      "Sabah çiyini toplayın: güneş doğmadan çimenlerin üstünden temiz bir bezle geçin, bezi kaba sıkın.",
      "Kuru dere yatağında, dönemecin dış kenarının dibini kazın. Toprak nemliyse çukura yavaşça su sızabilir.",
      "Bulduğunuz her suyu içmeden önce arıtın. En güvenlisi kaynatmaktır."
    ],
    "art": [
      "hayatta-kalma-su-dinle",
      "hayatta-kalma-su-vadi",
      null,
      null,
      "hayatta-kalma-yagmur-toplama",
      "hayatta-kalma-ciy-toplama",
      null,
      "boil-water"
    ],
    "dont": [
      "Kar ve buzu eritmeden yemeyin; vücudunuzu soğutur ve susuzluğu artırır.",
      "Deniz suyu ya da idrar içmeyin; susuzluğu artırır.",
      "Tanımadığınız ya da zehirli olabilecek bitkilerin üstünden çiy toplamayın.",
      "Su ararken yolunuzu kaybedecek kadar uzaklaşmayın; geçtiğiniz yerleri işaretleyin."
    ],
    "keywords": [
      "ormanda su nasıl bulunur",
      "doğada su bulma",
      "dogada su bulma",
      "su kaynağı bulmak",
      "susuz kaldım ormanda",
      "dağda su yok",
      "içecek su bulamıyorum",
      "yağmur suyu toplama",
      "çiy toplama",
      "pınar bulma",
      "dere bulma",
      "ormanda su",
      "su bulamiyorum"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Hayatta Kalma El Kitabı (su bulma)",
      "CDC — Doğada içme suyu arıtma",
      "Ready.gov — Water (acil durumda su arıtma)",
      "T.C. Sağlık Bakanlığı — Gıda ve içme suyu güvenliği broşürü (deprem.saglik.gov.tr)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı deprem GİS broşürü (suyu tamamen kaynatıp en az 1 dk sürdürün); değişiklik yok. Arazi ipuçları için Türk resmî kaynağı bulunamadı." }
  },
  {
    "id": "hayatta-kalma-su-aritma",
    "title": "Dere ve kaynak suyunu içilir hale getirme",
    "tag": "HAYATTA KALMA",
    "summary": "Doğadan aldığınız suyu 1 dakika fokur fokur kaynatın; kaynatamıyorsanız tablet, filtre ya da son çare olarak güneşle (SODIS) arıtın.",
    "steps": [
      "En güvenli yol kaynatmaktır: suyu fokur fokur 1 dakika kaynatın. 2000 metreden yüksekte 3 dakika kaynatın.",
      "Bulanık suyu önce bir kapta dinlendirin, sonra temiz bir bezden süzün.",
      "Kaynatamıyorsanız su arıtma tableti ya da klor kullanın. Paketteki miktara ve bekleme süresine tam uyun.",
      "Tablet ve klor bazı parazitleri öldürmekte zayıftır. Mümkünse suyu önce süzün ya da kaynatın.",
      "Su filtresi varsa kullanın. Çoğu filtre virüsleri tutmaz; filtreden sonra tablet eklemek daha güvenlidir.",
      "Hiçbiri yoksa güneşle arıtın (SODIS): berrak suyu şeffaf plastik (PET) şişeye doldurun, tam güneşte 6 saat yatay bırakın.",
      "Gökyüzü yarıdan fazla bulutluysa şişeyi 2 gün güneşte tutun. Sürekli yağmurda bu yöntem işe yaramaz.",
      "SODIS için en fazla 2 litrelik şişe kullanın. Cam ya da renkli şişe ve bulanık su kullanmayın.",
      "Arıtılmış suyu temiz ve kapaklı bir kapta saklayın."
    ],
    "art": [
      "boil-water",
      "hayatta-kalma-su-suzme",
      "hayatta-kalma-su-tablet",
      null,
      null,
      "hayatta-kalma-sodis",
      null,
      null,
      null
    ],
    "dont": [
      "Yakıt, kimyasal ya da maden atığı karışmış suyu kaynatsanız da içmeyin; kaynatma ve tablet kimyasalı gidermez.",
      "Berrak göründü diye arıtmadan içmeyin.",
      "Arıtılmış suyu kirli kaba ya da kirli eline değdirmeyin."
    ],
    "keywords": [
      "dere suyu içilir mi",
      "kaynak suyu içilir mi",
      "nehir suyu arıtma",
      "doğada su arıtma",
      "dogada su aritma",
      "sodis",
      "güneşle su arıtma",
      "su arıtma tableti",
      "dere suyunu kaynatma",
      "kamp suyu",
      "göl suyu içilir mi",
      "pet şişe güneş"
    ],
    "sources": [
      "CDC — Doğa yürüyüşü ve kampta su arıtma seçenekleri",
      "Akvopedia / Eawag — Güneşle su arıtma (SODIS)",
      "Ready.gov — Water (1 dk kaynatma, klor)",
      "T.C. Sağlık Bakanlığı — Gıda ve içme suyu güvenliği broşürü (deprem.saglik.gov.tr)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı deprem GİS broşürü (en az 1 dk kaynatma, kokusuz katkısız çamaşır suyuyla dezenfeksiyon); değişiklik yok. 2000 m üstü 3 dk ve SODIS değerleri Türk kaynağında yok (önceki Ready.gov/CDC kontrolü)." }
  },
  {
    "id": "hayatta-kalma-yon-gunes",
    "title": "Güneş ve gölge çubuğuyla yön bulma",
    "tag": "HAYATTA KALMA",
    "summary": "Yere dik bir çubuk saplayın, gölgenin ucunu iki kez işaretleyin; ilk işaret batı, ikincisi doğudur.",
    "steps": [
      "Güneşli bir yerde düz zemine 1 metre kadar bir çubuğu dik saplayın.",
      "Gölgenin ucuna bir taş koyun. Bu ilk taş batıyı gösterir.",
      "15–20 dakika bekleyin. Gölgenin yeni ucuna ikinci taşı koyun. Bu doğudur.",
      "İki taşı birleştiren çizgi batı-doğu çizgisidir.",
      "İlk taş solunuzda, ikinci taş sağınızda olacak şekilde durun. Karşınız kuzeydir.",
      "Ne kadar uzun beklerseniz sonuç o kadar doğru olur.",
      "Kabaca bilin: güneş doğudan doğar, batıdan batar; yazın kuzeydoğudan doğup kuzeybatıdan batar. Türkiye'de güneş en tepeye çıktığında tam güneydedir; bu an batı illerinde saat 13'e, doğu illerinde saat 12'ye yakındır.",
      "Bulduğunuz yönü yere büyük bir okla çizin."
    ],
    "art": [
      "hayatta-kalma-golge-cubuk-1",
      null,
      "hayatta-kalma-golge-cubuk-2",
      null,
      "hayatta-kalma-golge-cubuk-kuzey",
      null,
      null,
      "hayatta-kalma-yon-ok"
    ],
    "dont": [
      "Ağaçtaki yosuna bakarak yön bulmayın; yosun her tarafta, nemli ve gölgeli yerde biter.",
      "Bulutlu havada bu yönteme güvenmeyin.",
      "Kaybolduysanız yön buldum diye bilmediğiniz araziye yürümeyin; çoğu zaman yerinizde kalmak daha güvenlidir."
    ],
    "keywords": [
      "güneşle yön bulma",
      "gölge çubuğu",
      "çubukla yön bulma",
      "pusulasız yön bulma",
      "kuzey ne tarafta",
      "kuzeyi bulma",
      "gölgeyle yön bulma",
      "yosun kuzeyi gösterir mi",
      "yosunla yön bulma",
      "gunesle yon bulma",
      "pusulasiz yon"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Hayatta Kalma El Kitabı (gölge ucu yöntemi)",
      "Forces News (İngiliz Ordusu) — Pusulasız kuzey bulma",
      "Forest Preserve District of Will County — Yosun ve yön efsanesi",
      "NOAA GML — Güneş konumu hesap formülleri (Türkiye için öğle anı hesabı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: gölge ucu geometrisi (ilk işaret batı); Türkiye için güneş öğle anı NOAA güneş konumu formülleriyle hesaplandı (Edirne ~13:15, Ankara ~12:50, Van ~12:05, UTC+3); Wikipedia Time in Turkey (2016'dan beri kalıcı UTC+3)." }
  },
  {
    "id": "hayatta-kalma-yon-yildiz",
    "title": "Kutup Yıldızı ile yön bulma",
    "tag": "HAYATTA KALMA",
    "summary": "Büyükayı'nın kepçe ağzındaki iki yıldızın çizgisini uzatıp Kutup Yıldızı'nı bulun; tam altı kuzeydir.",
    "steps": [
      "Açık bir gecede kuzey göğünde Büyükayı'yı (Büyük Kepçe) bulun: kepçeye benzeyen 7 parlak yıldız.",
      "Kepçenin ağzındaki, uçta duran iki yıldızı bulun. Büyükayı gece boyunca döner; kepçe ters de görünebilir, yöntem yine işler.",
      "Bu iki yıldız arasındaki uzaklığı aklınızda tutun. Kepçenin açık tarafına doğru bu uzaklığın yaklaşık 5 katı ilerleyin.",
      "Orada tek başına duran, çok parlak olmayan yıldız Kutup Yıldızı'dır. Türkiye'den bakınca ufuk ile tepe arasının yarısından biraz aşağıdadır.",
      "Kutup Yıldızı'na dönün. Tam altında ufka indiğiniz yer kuzeydir.",
      "Büyükayı görünmüyorsa W biçimli Kraliçe (Kassiopeia) takımyıldızını arayın. Sonbahar akşamlarında Büyükayı kuzey ufkuna çok yaklaşır ve dağ, ağaç arkasında kalabilir. Kutup Yıldızı, Kassiopeia ile Büyükayı'nın arasındadır.",
      "Kuzeyi yere bir okla işaretleyin; yürümek için sabahı bekleyin."
    ],
    "art": [
      "hayatta-kalma-buyukayi",
      null,
      "hayatta-kalma-kutup-yildizi-bulma",
      null,
      "hayatta-kalma-kutup-kuzey",
      "hayatta-kalma-kassiopeia",
      "hayatta-kalma-yon-ok-gece"
    ],
    "dont": [
      "Gökteki en parlak yıldızı Kutup Yıldızı sanmayın; Kutup Yıldızı sönükçedir.",
      "Bulutlu gecede tahminle yön seçmeyin.",
      "Gece karanlıkta yürümeyin; yönü işaretleyip sabahı bekleyin."
    ],
    "keywords": [
      "kutup yıldızı",
      "kutup yildizi",
      "kutup yıldızını bulma",
      "yıldızlarla yön bulma",
      "büyükayı",
      "büyük ayı",
      "büyük kepçe",
      "gece yön bulma",
      "demirkazık",
      "kuzey yıldızı",
      "yildizla yon bulma"
    ],
    "sources": [
      "BBC Sky at Night — Kutup Yıldızı nasıl bulunur",
      "ABD Ordusu FM 21-76 — Hayatta Kalma El Kitabı (yıldızlarla yön)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: Wikipedia Polaris (kadir ~2, kutba 0,66°, Dubhe-Merak gösterici); yükseklik = enlem (Türkiye 36–42°, yani yarıdan az); Merak dik açıklık +56° → 36–42°K'de en alçakta ufkun 2–8° üstü (hesap). 5 kat kuralı erişilebilir kaynakta doğrulanamadı." }
  },
  {
    "id": "hayatta-kalma-yon-saat",
    "title": "Akrepli kol saatiyle yön bulma",
    "tag": "HAYATTA KALMA",
    "summary": "Saati düz tutup akrebi güneşe çevirin; akrep ile saat 1 arasındaki açının ortası güneyi gösterir.",
    "steps": [
      "Akrepli (analog) saati avucunuzda ya da yerde düz tutun.",
      "Saati çevirerek akrebi (kısa ibreyi) güneşe doğrultun.",
      "Türkiye yıl boyu ileri saattedir, bu yüzden saat 12 yerine çoğu yerde saat 1'i kullanın. Erzurum, Van gibi en doğu illerde 12'yi, Malatya, Elazığ gibi aradaki illerde 12 ile 1'in ortasını kullanın.",
      "Akrep ile bu sayı (çoğu yerde 1) arasındaki küçük açının tam ortası güneyi gösterir.",
      "Güneyin tam tersi kuzeydir. Yönü yere bir okla çizin.",
      "Dijital saatiniz ya da telefonunuz varsa bir kâğıda ya da toprağa saat yüzü çizip aynı şeyi yapın.",
      "Sabah 7'den önce ya da akşam 6'dan sonra bu yöntemi kullanmayın. Yazın güneş geç battığı için o saatlerde sonuç ters çıkar, kuzeyi güney sanırsınız.",
      "Bu yöntem kabadır, özellikle yazın 30–40 derece şaşabilir. Bulduğunuz yönü gölge çubuğuyla doğrulayın."
    ],
    "art": [
      "hayatta-kalma-saat-duz",
      "hayatta-kalma-saat-akrep-gunes",
      null,
      "hayatta-kalma-saat-guney",
      "hayatta-kalma-yon-ok",
      null,
      null,
      null
    ],
    "dont": [
      "Güneş görünmüyorken tahminle kullanmayın.",
      "Bu yöntemi pusula kadar kesin sanmayın; mümkünse gölge çubuğuyla doğrulayın.",
      "Ağaçtaki yosuna bakarak yön bulmayın."
    ],
    "keywords": [
      "saatle yön bulma",
      "kol saatiyle yön",
      "saat ile yön bulma",
      "akrep güneş",
      "saat ile güney",
      "analog saat pusula",
      "saatle yon bulma",
      "saat yöntemi"
    ],
    "sources": [
      "Forces News (İngiliz Ordusu) — Analog saatle yön bulma",
      "ABD Ordusu FM 21-76 — Hayatta Kalma El Kitabı (saat yöntemi, yaz saati düzeltmesi)",
      "Wikipedia — Time in Turkey (2016'dan beri kalıcı UTC+3)",
      "NOAA GML — Güneş konumu hesap formülleri (Türkiye için hata hesabı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: Wikipedia Time in Turkey (2016'dan beri kalıcı UTC+3); NOAA güneş konumu formülleriyle İstanbul ve Van için saat saat hata hesabı: öğle anı İstanbul ~13:05, Van ~12:05; yazın hata 30–50°, güneş saati 18'den sonra (yazın saat ~19, doğuda ~18) sonuç ~160–180° ters." }
  },
  {
    "id": "hayatta-kalma-pusula-harita",
    "title": "Pusula ve haritayla yön bulma",
    "tag": "HAYATTA KALMA",
    "summary": "Haritayı pusulaya göre çevirip kuzeye yöneltin, pusulanın kenarıyla rotayı çizin, kırmızı iğneyi oka oturtup yön okunun gösterdiği yere yürüyün.",
    "steps": [
      "Haritayı düz tutun, pusulayı üstüne koyun. Haritanın kuzeyi pusulanın kırmızı iğnesiyle aynı yöne bakana dek haritayı çevirin.",
      "Çevredeki tepe, dere, yol gibi belirgin yerleri haritada bulun. Nerede olduğunuzu doğrulayın.",
      "Pusulanın uzun kenarını bulunduğunuz yer ile gideceğiniz yer arasına koyun. Yön oku gideceğiniz yeri göstermeli.",
      "Pusulayı kımıldatmadan döner kadranı çevirin; kadranın içindeki çizgiler haritanın kuzey-güney çizgilerine paralel olsun ve kadrandaki kuzey oku haritanın kuzeyine (üstüne) baksın.",
      "Pusulayı göğsünüzün önünde düz tutun. Kırmızı iğne kadrandaki kuzey okunun içine oturana dek kendi çevrenizde dönün.",
      "Şimdi yön oku gideceğiniz yeri gösterir. O doğrultuda bir ağaç ya da kaya seçin, ona yürüyün, sonra tekrarlayın.",
      "Pusulayı telefon, bıçak, araba gibi metal ve mıknatıslı eşyalardan uzak tutun.",
      "1 kilometreden uzun yürüyecekseniz haritanın kenarındaki manyetik sapma değerine göre düzeltme yapın. Türkiye'de sapma yaklaşık 6 derece doğudur; düzeltmezseniz her kilometrede yaklaşık 100 metre kayarsınız."
    ],
    "art": [
      "hayatta-kalma-harita-yonlendir",
      null,
      "hayatta-kalma-pusula-kenar",
      "hayatta-kalma-pusula-kadran",
      "hayatta-kalma-pusula-igne",
      "hayatta-kalma-pusula-hedef",
      null,
      null
    ],
    "dont": [
      "Pusulayı metal eşya ya da araç yanında okumayın.",
      "Göremediğiniz uzak bir hedefe gözünüzü kapatıp yürümeyin; kısa ara hedefler seçin.",
      "Sisli havada pusulaya bakmadan 'doğru gidiyorum' diye yürümeyin."
    ],
    "keywords": [
      "pusula nasıl kullanılır",
      "pusula kullanma",
      "pusula ile yön bulma",
      "harita ve pusula",
      "haritayı yönlendirme",
      "kerteriz",
      "pusula okuma",
      "pusulayla yürüme",
      "manyetik sapma",
      "pusula nasil kullanilir"
    ],
    "sources": [
      "DNT (Norveç Doğa Yürüyüşü Derneği) — Harita ve pusula kullanımı",
      "UIAA — Kötü görüşte yön bulma",
      "NOAA NCEI — Manyetik sapma hesaplayıcı (WMM-2025)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NOAA NCEI WMM-2025 sapma hesabı (Edirne 41K/27D 5,9°D; Kayseri 39K/35D 6,1°D; Doğubayazıt 39K/44D 6,2°D, Kasım 2026). Taban plakalı pusula adımları DNT/OS sayfalarına erişilemediği için yeniden doğrulanamadı; adımlar standart yöntemle uyumlu." }
  },
  {
    "id": "hayatta-kalma-ates",
    "title": "Kamp ateşini güvenle yakmak ve söndürmek",
    "tag": "HAYATTA KALMA",
    "summary": "Ateşi yalnızca gerçekten gerekiyorsa, rüzgârsız havada, temizlenmiş küçük bir alanda yakın; hiç yalnız bırakmayın ve soğuyana dek suyla söndürün.",
    "steps": [
      "Ateşi yalnızca hayati bir gerekçeyle yakın: ısınmak, su kaynatmak ya da işaret vermek. Ormanda izin verilen ocak yerleri dışında ateş yakmak yasaktır; yaz ve sonbaharda valilikler ormana 4 km'ye kadar ateş yakmayı da yasaklar.",
      "Kuru, sıcak ya da rüzgârlı havada ateş yakmayın. Tek kıvılcım orman yangını çıkarabilir.",
      "Açık, düz ve üstünde dal olmayan bir yer seçin. Çadır, ağaç ve çalılardan en az 5 metre uzak durun.",
      "Çevresinde 3 metre çapında bir alanı yaprak ve kuru ottan çıplak toprağa kadar temizleyin. Ateşi taşlarla çevirin ya da küçük bir çukurda yakın.",
      "Ateşi küçük tutun. Önce kuru ince çalı çırpı, sonra parmak kalınlığında dallar, en son kalın odun ekleyin.",
      "Yanınızda mutlaka bol su ve toprağı karıştıracak bir sopa ya da kürek bulundurun.",
      "Ateşi bir an bile yalnız bırakmayın. Uyumadan ya da ayrılmadan önce söndürün.",
      "Söndürürken bol su dökün, külü sopayla karıştırın, yine su dökün. Elinizin tersini yaklaştırın; hâlâ sıcaksa bırakmayın.",
      "Ateş kontrolden çıkarsa söndürmeye uğraşmayın; rüzgârın tersine, yangının yanından uzaklaşın, yokuş yukarı kaçmayın ve 112'yi arayın."
    ],
    "art": [
      null,
      "hayatta-kalma-ates-ruzgar-yasak",
      null,
      "hayatta-kalma-ates-alani",
      "hayatta-kalma-ates-yakma",
      null,
      null,
      "hayatta-kalma-ates-sondurme",
      "call-112"
    ],
    "dont": [
      "Kapalı çadırda ya da barınakta ateş, mangal, kömür yakmayın; karbonmonoksit öldürür.",
      "Benzin, tiner gibi yakıtlarla tutuşturmayın.",
      "Ağaç kökü, kuru ot ya da yaprak yığını üstünde yakmayın.",
      "Közün üstünü yalnızca toprakla örtüp gitmeyin; altında saatlerce yanabilir."
    ],
    "keywords": [
      "kamp ateşi",
      "ateş yakma",
      "ateş nasıl yakılır",
      "odun ateşi yakmak",
      "kamp ateşi söndürme",
      "ateşi söndürme",
      "çıra tutuşturma",
      "ateş yakamıyorum",
      "ates nasil yakilir",
      "kamp atesi"
    ],
    "sources": [
      "ABD Orman Servisi (Smokey Bear) — Kamp ateşi güvenliği",
      "6831 sayılı Orman Kanunu md. 76 ve valilik orman yangını genelgeleri",
      "OGM — Orman yangınlarını önleme",
      "Antalya Valiliği orman yangını genelgesi (BirGün, birgun.net/haber/...-448845)",
      "Ankara, İstanbul, Aydın valilikleri 2026 ormana giriş yasağı haberleri"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Orman Kanunu md. 76 ('Ormanlarda izin verilen ve ocak yeri olarak belirlenen yerler dışında ateş yakmak yasaktır', Antalya Valiliği genelgesinden alıntı), valilik genelgeleri (ormana 4 km'ye kadar ateş yasağı, 2026'da Ankara/İstanbul/Aydın vb. giriş yasakları), orman yangını ihbarı 112; #1 yasa ifadesi netleştirildi ve 4 km valilik yasağı eklendi. Mesafe/söndürme değerleri Smokey Bear'dan." }
  },
  {
    "id": "hayatta-kalma-barinak",
    "title": "Doğada acil barınak yapmak",
    "tag": "HAYATTA KALMA",
    "summary": "Hava kararmadan güvenli bir yer seçin, önce zemini kalın yaprakla yalıtın, sonra rüzgârı ve yağmuru kesen küçük bir barınak kurun.",
    "steps": [
      "Hava kararmadan en az 1 saat önce barınağa başlayın.",
      "Yer seçin: rüzgârdan korunaklı, düz ve kuru. Dere ve kuru dere yatağından, taş düşen yamaçtan, kuru ve ölü ağaçların altından uzak durun.",
      "Tepe ve sırtlar rüzgârlıdır, vadi tabanı gece en soğuk yerdir. Yamacın ortalarında korunaklı bir düzlük seçin.",
      "Önce zemini yalıtın: yere en az bir karış kalınlığında kuru yaprak, çam dalı ya da ot serin. Soğuk en çok yerden gelir.",
      "Devrik bir ağaç, kaya ya da iki ağaç arasına bağlanmış bir sırık bulun; üstüne eğik dallar dayayın.",
      "Branda, naylon ya da folyo battaniye varsa rüzgârı kesecek şekilde gerin. Girişi rüzgârın tersine bakmalı.",
      "Dalların üstünü kalın bir yaprak ve dal katıyla örtün; yağmuru ve rüzgârı kessin.",
      "Barınağı küçük tutun: içine girip uzanacak kadar. Küçük barınak daha kolay ısınır.",
      "Barınağın yakınına parlak renkli bir bez asın; ekipler sizi kolay bulsun."
    ],
    "art": [
      null,
      "hayatta-kalma-barinak-yer",
      null,
      "hayatta-kalma-zemin-yalitim",
      "hayatta-kalma-barinak-dal",
      "hayatta-kalma-barinak-branda",
      null,
      null,
      "hayatta-kalma-barinak-bez"
    ],
    "dont": [
      "Kuru dere yatağına kurmayın; ani bir yağmur sel getirebilir.",
      "Kapalı barınakta ateş, mangal ya da kömür yakmayın.",
      "Çürük ve ölü ağaçların altında kalmayın; dal düşebilir.",
      "Islak toprağa doğrudan uzanmayın."
    ],
    "keywords": [
      "barınak yapma",
      "ormanda barınak",
      "acil barınak",
      "doğada sığınak yapmak",
      "dallardan barınak",
      "branda ile barınak",
      "ormanda kalacak yer yapmak",
      "barinak nasil yapilir",
      "doğada kulübe yapmak",
      "yapraklarla barınak"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Hayatta Kalma El Kitabı (barınaklar)",
      "Trail Hiking Australia — Hayatta kalma öncelikleri"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: erişilebilir resmi kaynak bulunamadı (FM 21-76, NPS açılmadı). İçerik genel hayatta kalma bilgisiyle uyumlu, belirgin hata yok; uzman bakmalı." }
  },
  {
    "id": "hayatta-kalma-isaret",
    "title": "Kurtarma ekiplerine işaret vermek",
    "tag": "HAYATTA KALMA",
    "summary": "Açık bir alanda kalın, parlak bir bez serin, yere büyük V ya da X yapın; düdük, ayna ve kol işaretiyle görünür ve duyulur olun.",
    "steps": [
      "Açık bir alanda kalın. Sık ağaçların altında sizi havadan göremezler.",
      "Parlak renkli giysi, branda ya da folyo battaniyeyi açık alana serin ya da yükseğe asın.",
      "Yere taş, dal ya da kazılmış toprakla büyük bir işaret yapın. Her kolu en az 3 metre olsun ve zeminden belirgin ayrılsın.",
      "V harfi: yardım gerekiyor. X harfi: tıbbi yardım gerekiyor. Ok: o yöne gidiyoruz. SOS de yazabilirsiniz.",
      "Düdük ya da fenerle dakikada 6 kısa ses ya da ışık verin, 1 dakika bekleyin, tekrarlayın. 3 kısa düdük de yardım çağrısı olarak bilinir.",
      "Güneşte ayna kullanın: aynayı gözünüzün yanında tutun, öbür elinizle V yapın, yansıyan ışığı parmaklarınızın arasından uçağa ya da tepeye çevirin.",
      "Ayna yoksa telefon ekranı ya da parlak bir metal kullanın.",
      "Helikopter geçerken iki kolunuzu Y şeklinde havaya kaldırın: 'Yardım lazım'. El sallamayın.",
      "Size ses gelse bile ekipler yanınıza gelene dek işaret vermeyi sürdürün."
    ],
    "art": [
      null,
      "hayatta-kalma-parlak-bez",
      "hayatta-kalma-yer-isareti",
      null,
      "whistle-signal",
      "hayatta-kalma-ayna",
      null,
      "hayatta-kalma-helikopter-y",
      null
    ],
    "dont": [
      "Helikoptere el sallamayın; 'iyiyim' ya da selam sanılabilir.",
      "Kuru ya da rüzgârlı havada işaret ateşi yakmayın.",
      "Fenerin ve telefonun pilini boşa harcamayın; aralıklı kullanın.",
      "İşaret yaptığınız yerden ayrılmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "kurtarma işareti",
      "yardım işareti vermek",
      "helikoptere işaret",
      "aynayla işaret",
      "sos işareti",
      "yere sos yazmak",
      "imdat işareti",
      "düdük işareti",
      "helikopter beni görsün",
      "kurtarma ekibine görünmek",
      "isaret vermek"
    ],
    "sources": [
      "ICAO yer-hava görsel işaret kodu (Finlandiya AIP GEN 3.6)",
      "Mountain Rescue England and Wales — Güvenlik önerileri",
      "Teton County Search and Rescue — Helikopter işaretleri",
      "AKUT Bursa ve Türkiye Dağcılık Federasyonu önerileri (NTV Seyahat)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: AKUT Bursa ve TDF önerileri (büyük renkli yazılar, taşlardan şekiller, ışıkla işaret; düdük çantada bulunsun) ile uyumlu; değişiklik yok. Düdük sayısı ve yer-hava kodu için Türk resmî kaynağı yok (FAA AIM, Alp işareti)." }
  },
  {
    "id": "hayatta-kalma-yabani-yiyecek",
    "title": "Doğada yiyecek: neden bilmediğiniz şeyi yememelisiniz",
    "tag": "HAYATTA KALMA",
    "summary": "Yiyecek en son önceliktir; tanımadığınız mantar, bitki ve meyveyi asla yemeyin, önce barınak, sıcaklık ve suya odaklanın.",
    "steps": [
      "Yiyecek için telaşlanmayın. İnsan yiyeceksiz haftalarca yaşayabilir; soğuk ve susuzluk çok daha hızlı öldürür.",
      "Öncelik sırası: önce güvenlik ve ilk yardım, sonra barınak ve sıcaklık, sonra su, en son yiyecek.",
      "Tanımadığınız hiçbir mantarı yemeyin. Zehirli mantar pişirince ya da kurutunca da zehirli kalır.",
      "Tanımadığınız bitki, meyve, kök ve tohumu yemeyin. Ölümcül zehirli türler yenebilenlere çok benzer.",
      "Halk testlerine güvenmeyin: gümüş kaşığın kararmaması, böceğin yemesi, güzel koku bir şeyin zehirsiz olduğunu göstermez.",
      "Yanınızdaki yiyeceği bölün; az ama düzenli yiyin. Suyunuz azsa yemeği de azaltın.",
      "Bilmediğiniz bir mantar ya da bitki yediyseniz belirti beklemeden 114'ü ya da 112'yi arayın. En tehlikeli zehirlenmelerde belirtiler 6 saatten sonra başlar.",
      "Yediğiniz mantar ya da bitkiden bir parça saklayın; sağlık ekibine gösterin."
    ],
    "art": [
      null,
      "hayatta-kalma-oncelik-sirasi",
      "hayatta-kalma-mantar-yasak",
      "hayatta-kalma-bitki-yasak",
      null,
      null,
      "call-114",
      null
    ],
    "dont": [
      "Az bir parça tadarak 'deneme' yapmayın; bazı mantarlarda çok küçük bir parça bile öldürür.",
      "Hiçbir yabani mantarı çiğ yemeyin.",
      "Hayvanların yediği bitkinin insan için de güvenli olduğunu düşünmeyin.",
      "Belirtiler geçti diye sağlık kuruluşuna gitmekten vazgeçmeyin; bazı zehirler sonradan karaciğere zarar verir."
    ],
    "keywords": [
      "ormanda ne yenir",
      "doğada yiyecek bulma",
      "yabani bitki yenir mi",
      "aç kaldım ormanda",
      "ormanda yiyecek",
      "yenilebilir bitki",
      "yabani meyve yenir mi",
      "dağda aç kaldım",
      "hayatta kalma öncelikleri",
      "dogada yiyecek"
    ],
    "sources": [
      "T.C. Sağlık Bakanlığı — Mantar zehirlenmelerine karşı uyarı",
      "Tarım ve Orman Bakanlığı (Ordu İl Müd.) — Mantar zehirlenmelerine dikkat (ordu.tarimorman.gov.tr PDF)",
      "Sağlık Bakanlığı mantar uyarısı (Habertürk, 2462956)",
      "Trail Hiking Australia — Hayatta kalma öncelikleri (üçler kuralı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Tarım ve Orman Bak. Ordu İl Müd. PDF (yendikten 6 saat sonra gelişen belirtiler karaciğer-böbrek hasarı ve ölüm tehlikesi; zehirlerin çoğu ısıya dayanıklı; gümüş kaşık ve tuzlu/sirkeli su efsane; UZEM 114), Sağlık Bakanlığı uyarısı (114, 7/24); değişiklik yok." }
  },
  {
    "id": "hayatta-kalma-soguk-gece",
    "title": "Dışarıda soğuk bir gece geçirmek",
    "tag": "HAYATTA KALMA",
    "summary": "Rüzgârdan korunun, altınıza kalın yalıtım serin, kuru kalın ve tüm katmanları giyin; titreme durursa bu hipotermidir, 112'yi arayın.",
    "steps": [
      "Hava kararmadan rüzgârı kesen bir yer bulun ya da barınak yapın.",
      "Altınıza kalın bir kat serin: çanta, kuru yaprak, çam dalı, karton. Çıplak toprağa, taşa ya da kara oturup yatmayın.",
      "Islak giysileri kurularıyla değiştirin. Islaklık vücut ısısını çok hızlı çalar.",
      "Tüm katmanları giyin. Başınızı, boynunuzu ve ellerinizi örtün.",
      "Folyo battaniye ya da büyük naylon poşet varsa gövdenize sarın; yüzünüzü açık bırakın.",
      "Birden fazla kişiyseniz birbirinize sokulun; sırt sırta ya da yan yana yatın.",
      "Yatmadan önce bir şeyler yiyin ve ılık bir şey için. Vücut ısıyı yiyecekten üretir.",
      "Üşürseniz kol ve bacaklarınızı kımıldatın, ama terleyecek kadar yorulmayın.",
      "Titreme durur, uyuşukluk, sakarlık ya da konuşma bozukluğu başlarsa bu hipotermidir: 112'yi arayın, [[hipotermi|Hipotermi rehberine]] bakın."
    ],
    "art": [
      null,
      "hayatta-kalma-zemin-yalitim",
      null,
      "hayatta-kalma-katman-giyin",
      "hayatta-kalma-folyo-battaniye",
      "hayatta-kalma-sokulma",
      null,
      null,
      "call-112"
    ],
    "dont": [
      "Isınmak için alkol içmeyin; sıcaklık hissi verir ama vücut ısısını düşürür.",
      "Kapalı barınakta ya da çadırda mangal, kömür, ocak yakmayın; karbonmonoksit öldürür.",
      "Kar yemeyin; susarsanız eritip için.",
      "Islak giysiyle uyumayın."
    ],
    "keywords": [
      "dışarıda gece geçirmek",
      "soğukta gece kalmak",
      "ormanda gece geçirmek",
      "dağda gece kalmak",
      "gece donmamak için",
      "açıkta gece geçirmek",
      "soğuk gece hayatta kalma",
      "disarida gece",
      "gece açıkta kaldım"
    ],
    "sources": [
      "NHS — Hypothermia",
      "Mayo Clinic — Hipotermi ilk yardımı",
      "Trail Hiking Australia — Hayatta kalma öncelikleri"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: resmî Türk metnine erişilemedi; Acıbadem 'Donma vakalarında ilk yardım' (alkol yok, şekerli sıcak içecek, ovma yok, ıslak ortamdan uzaklaştır) ve NHS ile uyumlu; değişiklik yok." },
    "alsoIn": [
      "doga"
    ]
  },
  {
    "id": "hayatta-kalma-sicak",
    "title": "Gölgesiz sıcakta hayatta kalmak",
    "tag": "HAYATTA KALMA",
    "summary": "Öğle sıcağında hareket etmeyin, gölge yapıp dinlenin, başınızı ve cildinizi örtün, susadıkça için; kafa karışıklığı başlarsa 112.",
    "steps": [
      "Günün en sıcak saatlerinde (10.00–16.00) yürümeyin. Sabah erken ve akşamüstü hareket edin.",
      "Gölge yoksa yapın: branda, giysi ya da folyo battaniyeyi dallara ya da taşlara gerin. Altında hava dolaşsın.",
      "Kızgın toprağa ya da taşa doğrudan oturmayın; altınıza çanta ya da dal koyun.",
      "Başınızı ve ensenizi örtün. Açık renkli, bol, uzun kollu giysi giyin.",
      "Susadıkça su için; suyu saklayıp susuz kalmayın. Yanında biraz tuzlu bir şey de yiyin.",
      "Bir bezi ıslatıp başınıza ve boynunuza koyun. İçme suyunuz azsa bunun için harcamayın.",
      "Baş dönmesi, bulantı, kas krampı ya da aşırı halsizlik olursa hemen gölgede uzanın, serinleyin, su için. Kusarsa ya da yarım saatte düzelmezse 112'yi arayın.",
      "Kafa karışıklığı, saçma konuşma, bayılma ya da nöbet varsa bu sıcak çarpması olabilir: 112'yi arayın ve kişiyi hemen soğutun."
    ],
    "art": [
      "hayatta-kalma-sicak-saat",
      "hayatta-kalma-golgelik",
      null,
      "hayatta-kalma-sicak-ortu",
      null,
      "hayatta-kalma-islak-bez",
      null,
      "call-112"
    ],
    "dont": [
      "Gömleğinizi çıkarmayın; cildiniz yanar ve daha çok su kaybedersiniz.",
      "Alkol ve çok şekerli içecek içmeyin.",
      "Öğle sıcağında yokuş tırmanmayın, ağır iş yapmayın.",
      "Suyu 'sonraya' saklayıp susuzluktan bayılacak hale gelmeyin."
    ],
    "keywords": [
      "gölgesiz sıcak",
      "güneşin altında mahsur kaldım",
      "sıcakta hayatta kalma",
      "çölde hayatta kalma",
      "sıcakta yürüyüş",
      "güneşte susuz kaldım",
      "gölge yok",
      "gölge yapmak",
      "yazın dağda sıcak",
      "sicakta hayatta kalma"
    ],
    "sources": [
      "ABD Milli Parklar Servisi (Grand Canyon) — Sıcakta güvenli yürüyüş",
      "NHS — Heat exhaustion and heatstroke",
      "NWS — Heat illness",
      "T.C. Sağlık Bakanlığı — Sıcak hava uyarısı (BirGün, 547323: 10.00–16.00 arası dışarı çıkmayın)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı sıcak hava uyarısı ('güneş etkisinin en güçlü olduğu 10.00-16.00 saatleri arasında dışarıya çıkmayın', açık renkli giysi, şapka, gölge, egzersizi sabah erken/akşam); değişiklik yok. Sıcak çarpması belirtileri NHS/NWS'den." },
    "alsoIn": [
      "hava"
    ]
  },
  {
    "id": "hayatta-kalma-dere-gecme",
    "title": "Dere ve nehirden geçmek",
    "tag": "HAYATTA KALMA",
    "summary": "Mümkünse geçmeyin; zorundaysanız diz altındaki sığ ve geniş bir yerden, çanta kemerleri açık, sopayla, yüzünüz akıntıya dönük geçin.",
    "steps": [
      "Mümkünse geçmeyin. Geri dönmek ya da köprü aramak çoğu zaman en iyisidir.",
      "Su dizinizi geçiyorsa ya da hızlı, bulanık, köpüklü akıyorsa kesinlikle girmeyin.",
      "Kar suyuyla beslenen dere sabah erken en alçaktır. Yağmurla kabaran dere genelde birkaç saatte ya da bir günde iner; suyun çekilmesini bekleyin.",
      "Akıntının aşağısına bakın: şelale, kütük yığını, büyük kaya varsa oradan geçmeyin. Düşerseniz nereden çıkacağınızı belirleyin.",
      "Derenin en geniş, kollara ayrıldığı yerini seçin. Orada su genelde sığ ve yavaştır.",
      "Çantanızın bel ve göğüs kemerini açın. Düşerseniz çantadan hemen kurtulabilmelisiniz.",
      "Ayakkabıyla geçin. Sağlam bir sopayı akıntının yukarısına dayayın, yüzünüz akıntıya dönük, yan adımlarla ilerleyin.",
      "Bir ayağınız sağlam basmadan diğerini kaldırmayın. Suya değil karşı kıyıya bakın.",
      "Suya düşerseniz sırtüstü dönün, ayaklarınızı akıntı yönüne ve yüzeye uzatın, çapraz biçimde kıyıya yüzün."
    ],
    "art": [
      "hayatta-kalma-dere-geri-don",
      "hayatta-kalma-dere-diz",
      null,
      null,
      null,
      "hayatta-kalma-dere-kemer",
      "hayatta-kalma-dere-sopa",
      null,
      "hayatta-kalma-dere-dusme"
    ],
    "dont": [
      "Taşkın ya da sel suyuna girmeyin; diz altındaki hızlı su bile insanı devirebilir.",
      "Yalınayak geçmeyin.",
      "Kendinizi ipe bağlayıp geçmeyin; düşerseniz ip sizi su altında tutabilir.",
      "Kaygan taşların üstünden atlayarak geçmeye çalışmayın."
    ],
    "keywords": [
      "dereden geçmek",
      "nehirden karşıya geçmek",
      "dere geçişi",
      "akıntıda yürümek",
      "dereyi nasıl geçerim",
      "nehir geçişi",
      "dereden karşıya",
      "dereden gecmek",
      "çay geçmek",
      "akarsudan geçmek"
    ],
    "sources": [
      "ABD Milli Parklar Servisi (Mount Rainier) — Nehir geçişinde dikkat",
      "STF (İsveç Turizm Derneği) — Dağda dere geçişi"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "NPS ve STF: diz üstü suya girmeme, sabah erken geçiş, geniş/kollara ayrılan yer, aşağıyı kontrol, çanta kemerini açma, sopa, yüz akıntıya, yalınayak geçmeme. Düşünce sırtüstü ayak önde: genel su güvenliği kuralı. Bağımsız doğrulama: NPS/STF sayfalarına bu turda erişilemedi; 'sabah en alçak' kuralı yalnız kar suyuyla sınırlandı." }
  },
  {
    "id": "hayatta-kalma-vahsi-hayvan",
    "title": "Ayı, yaban domuzu ve köpek sürüsüyle karşılaşma",
    "tag": "HAYATTA KALMA",
    "summary": "Koşmayın; sakin konuşup yavaşça geri çekilin ve hayvana kaçacak yol bırakın. Isırılırsanız yarayı 15 dakika sabunlu suyla yıkayıp aynı gün sağlık kuruluşuna gidin.",
    "steps": [
      "Koşmayın. Koşmak hayvanın sizi kovalamasına yol açar.",
      "Ayı görürseniz sakin ve alçak sesle konuşun; insan olduğunuzu anlasın. Yavaşça, yan yan geri çekilin.",
      "Ayıya kaçacak yol bırakın. Anne ayı ile yavrusunun arasına asla girmeyin. Ağaca tırmanmayın.",
      "Boz ayı saldırırsa yüzüstü yere yatın, ellerinizi ensenizde kenetleyin, bacaklarınızı açın, çantanızı çıkarmayın. Ayı gidene dek kıpırdamayın.",
      "Saldırı sürerse ya da ayı çadırınıza girerse elinizdeki her şeyle yüzüne vurarak karşı koyun.",
      "Yaban domuzu görürseniz sakince uzaklaşın ve ona yol bırakın. Yavrulu dişiye hiç yaklaşmayın.",
      "Köpek sürüsü yaklaşırsa durun, kollarınızı göğsünüzde birleştirin, gözlerine bakmayın, bağırmayın. Sonra yavaşça uzaklaşın.",
      "Köpek saldırırsa aranıza çanta, mont ya da sopa koyun. Yere düşerseniz top gibi kıvrılın, ellerinizle ensenizi ve kulaklarınızı koruyun.",
      "Isırılır ya da tırmalanırsanız yarayı hemen bol akan su ve sabunla 15 dakika yıkayın. Aynı gün sağlık kuruluşuna gidin (kuduz aşısı). Ciddi yarada 112'yi arayın.",
      "Yiyeceği çadırda tutmayın; artıkları kapalı poşette, kamp yerinden uzakta saklayın."
    ],
    "art": [
      "hayatta-kalma-hayvan-kosma-yasak",
      "hayatta-kalma-ayi-geri-cekil",
      null,
      "hayatta-kalma-ayi-yuzustu",
      null,
      null,
      "hayatta-kalma-kopek-dur",
      null,
      "hayatta-kalma-isirik-yika",
      null
    ],
    "dont": [
      "Hayvanı beslemeyin, fotoğraf için yaklaşmayın.",
      "Ayıdan koşarak kaçmayın, ağaca tırmanmayın.",
      "Köpek ya da yabani hayvan ısırığını 'küçük' diye önemsemeyin; kuduz ölümcüldür ve aşıyla önlenir.",
      "Isırık yarasını yıkamadan kapatmayın."
    ],
    "keywords": [
      "ayı",
      "ayı gördüm",
      "ayı saldırısı",
      "boz ayı",
      "yaban domuzu",
      "domuz saldırdı",
      "köpek sürüsü",
      "sokak köpekleri saldırdı",
      "köpek kovaladı",
      "vahşi hayvan",
      "yabani hayvan saldırısı",
      "ayi gordum"
    ],
    "sources": [
      "ABD Milli Parklar Servisi — Ayı güvenliği",
      "T.C. Sağlık Bakanlığı — Kuduz Profilaksi Rehberi",
      "Singapur NParks — Yaban domuzu önerileri",
      "Iowa State Üniv. CFSPH — Köpek ısırığını önleme",
      "MEB İlk Yardım — Böcek sokmaları ve hayvan ısırıklarında ilk yardım (ilkyardim.meb.gov.tr)",
      "WHO — Rabies fact sheet"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB İlk Yardım PDF (kedi-köpek ısırığında 10-15 dk su ve sabunla yıkama, kanamada bası, kuduz ve tetanos aşısı için sağlık kuruluşu, ciddi yarada 112); değişiklik yok. Ayı/domuz/köpek sürüsü davranışı için Türk resmî kaynağı bulunamadı (NPS)." }
  },
  {
    "id": "hayatta-kalma-dugumler",
    "title": "Temel düğümler",
    "tag": "HAYATTA KALMA",
    "summary": "Dört düğüm çoğu işi görür: ip ucunda sekiz, kaymayan halka için izbarço, iki ipi eklemek için camadan ya da ıskota, ağaca bağlamak için kazık bağı.",
    "steps": [
      "Sekiz düğümü: ipin ucunda bir halka yapın, ucu ipin arkasından dolayın, öndeki halkadan geçirip sıkın. 8 şekli çıkar; ipin delikten kaçmasını önler.",
      "İzbarço (kaymayan halka): ipte küçük bir halka yapın. Ucu alttan bu halkadan geçirin, ipin arkasından dolayın, aynı halkadan geri indirip sıkın.",
      "İzbarçoyu bir ağaca, kazığa ya da bele halka yapmak için kullanın. Yük altında kaymaz, sonra kolay çözülür. Yüksüz kalınca gevşeyebilir; ara ara kontrol edin.",
      "Camadan (iki ipi eklemek): sağ ucu sol ucun üstünden dolayın, sonra sol ucu sağın üstünden dolayın. İki uç aynı yandan çıkmalı.",
      "Camadanı yalnızca aynı kalınlıkta iplerde ve hafif işlerde kullanın.",
      "Iskota bağı (farklı kalınlıkta ipler): kalın ipin ucunu U gibi katlayın. İnce ipi alttan U'dan geçirin, U'nun arkasından dolayın, kendi altından geçirip sıkın.",
      "Kazık bağı (ipi ağaca bağlamak): ipi ağaca bir kez dolayın, kendi üstünden çaprazlayın, bir kez daha dolayıp ucu son turun altından çıkarın.",
      "Brandayı iki ağaç arasına germek için bir uçta kazık bağı, öbür uçta izbarço yapıp ipi çekin. Kazık bağı kayabilir; ucunu ana ipe iki yarım bağla sabitleyin.",
      "Her düğümü sıkıca çekerek deneyin. Uçta en az bir karış ip bırakın."
    ],
    "art": [
      "hayatta-kalma-dugum-sekiz",
      "hayatta-kalma-dugum-izbarco",
      null,
      "hayatta-kalma-dugum-camadan",
      null,
      "hayatta-kalma-dugum-iskota",
      "hayatta-kalma-dugum-kazik",
      null,
      null
    ],
    "dont": [
      "İnsanı taşımak, indirmek ya da tırmanmak için doğaçlama düğüme ve eski ipe güvenmeyin.",
      "Camadanı farklı kalınlıktaki iplerde ya da ağır yükte kullanmayın; çözülebilir.",
      "Yük altında gergin ipin önünde durmayın; koparsa yüzünüze çarpar."
    ],
    "keywords": [
      "düğüm nasıl atılır",
      "düğüm atmak",
      "ip bağlama",
      "izbarço",
      "camadan",
      "kazık bağı",
      "sekiz düğümü",
      "ıskota bağı",
      "iki ipi birleştirmek",
      "brandayı bağlamak",
      "halat bağlama",
      "sağlam düğüm",
      "dugum nasil atilir"
    ],
    "sources": [
      "Boğaziçi Üniversitesi Yelken Kulübü — Düğümler",
      "Küre Ansiklopedi — Gemici bağları",
      "Animated Knots — Bowline, Square Knot, Sheet Bend, Clove Hitch"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: Animated Knots (izbarço adımları ve yüksüzken gevşemesi; camadan ağır/kritik yükte kullanılmaz; ıskota farklı kalınlık, kalın ip U olur; kazık bağı kayar, yarım bağla sabitlenir). Türkçe adlar önceki denizcilik kaynaklarından." }
  }
];
