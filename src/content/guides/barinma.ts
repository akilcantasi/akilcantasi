// Rehber kategorisi: Barınma
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "barinma",
  "title": "Barınma",
  "hint": "Çadır, ısınma, hijyen",
  "art": "cat-barinma",
  "color": "#a3a3a3",
  "order": 10
};

export const GUIDES: Guide[] = [
  {
    "id": "cadir-barinma",
    "title": "Geçici barınma ve çadır güvenliği",
    "tag": "BARINMA",
    "summary": "Çadırı hasarlı binalardan ve dere yatağından uzak, güvenli bir yere kurun, yerden yalıtın, havalandırın ve içinde ateş yakmayın.",
    "steps": [
      "Çadırı hasarlı binalardan, duvarlardan, direklerden ve elektrik tellerinden uzağa kurun.",
      "Dere yataklarını, çukurları, su birikintisi olan yerleri ve heyelan riski olan yamaçları seçmeyin.",
      "Çadırlar arasında en az 2 metre bırakın. Park etmiş araçlardan ve binalardan en az 6 metre uzak durun.",
      "Zemini yalıtın: altına palet, karton, köpük ya da battaniye serin. Soğuk yerden gelir.",
      "Çadırın çevresine yağmur suyunun akması için sığ bir kanal açın.",
      "Çadırı gündüz havalandırın. Nem ve yoğuşma hastalık yapar.",
      "Aydınlatma için el feneri kullanın; mum, gaz lambası ve tüp lamba kullanmayın.",
      "Tuvalet ve çöp alanı su kaynağından ve çadırlardan uzak olsun.",
      "Çocukları ve yaşlıları yalnız bırakmayın. Çadırınızın yerini ailenize ve kamp görevlisine bildirin."
    ],
    "dont": [
      "Çadırın içinde yemek pişirmeyin; mangal, kömür, tüplü ısıtıcı ya da jeneratör kullanmayın.",
      "Çadırda mum yakıp uyumayın; yangın çıkabilir.",
      "Çadırda uzatma kablosuyla ısıtıcı ya da çok sayıda cihaz çalıştırmayın.",
      "Hasarlı bir binaya geceyi geçirmek için girmeyin."
    ],
    "keywords": [
      "çadır",
      "çadır kurma",
      "çadır nereye kurulur",
      "çadır güvenliği",
      "barınma",
      "barınak",
      "geçici barınma",
      "çadır kent",
      "çadırkent",
      "gece dışarıda",
      "dışarıda kaldık",
      "eve giremiyoruz",
      "cadir kurmak"
    ],
    "sources": [
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "Ready.gov — Earthquakes",
      "Amerikan Kızılhaçı — Winter storm safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: HSGM Afetlerde Çevre Sağlığı Uygulamaları (Şubat 2024 sunumu: çadırlar arası ve yol ile en az 2 m, araç/bina/bahçe duvarına en az 6 m, mum-petrol lambası-tüp lamba yerine fener, çadırda yemek pişirmeme, uzatma kablosu yok); Ready.gov. 'Çadırda yemek pişirmeyin' HSGM'ye göre eklendi."
    },
    "art": [
      "barinma-cadir-guvenli-yer",
      "barinma-cadir-yasak-yer",
      "barinma-cadir-mesafe",
      "barinma-zemin-yalitim",
      null,
      "barinma-cadir-havalandirma",
      "barinma-fener-mum-yasak",
      null,
      null
    ]
  },
  {
    "id": "toplanma-alani",
    "title": "Toplanma alanı ve aile buluşma planı",
    "tag": "HAZIRLIK",
    "summary": "Afetten önce en yakın toplanma alanınızı öğrenin ve ailece nerede buluşacağınızı kararlaştırın.",
    "steps": [
      "Evinize en yakın toplanma alanını önceden öğrenin: e-Devlet'te AFAD'ın \"Afet ve Acil Durum Toplanma Alanı Sorgulama\" hizmetine bakın.",
      "Ailece iki buluşma yeri belirleyin: biri evin yakınında, biri mahallenin dışında.",
      "Başka şehirde yaşayan bir yakını \"haber kişisi\" seçin. Herkes durumunu ona bildirsin.",
      "Önemli telefon numaralarını kâğıda yazın; her aile üyesi yanında taşısın.",
      "Çocuklarınızın okulunun afet planını öğrenin; çocukları kimin alacağını kararlaştırın.",
      "Afet sonrası toplanma alanına yürüyerek gidin. Bina, duvar, direk ve tellerden uzak durun.",
      "Toplanma alanında görevlilere kendinizi ve ulaşamadığınız yakınlarınızı bildirin.",
      "Evden ayrılırsanız kapıya nereye gittiğinizi yazan bir not bırakın."
    ],
    "dont": [
      "Toplanma alanına araçla gitmeyin; yolları ve kurtarma ekiplerinin geçişini kapatırsınız.",
      "Hasarlı binaların dibinde beklemeyin.",
      "Buluşma planını yalnızca telefonda saklamayın; pil bitebilir."
    ],
    "keywords": [
      "toplanma alanı",
      "toplanma alanı nerede",
      "en yakın toplanma alanı",
      "toplanma alanı sorgulama",
      "e-devlet toplanma alanı",
      "toplanma",
      "buluşma noktası",
      "aile buluşma planı",
      "afet planı",
      "nereye gideyim",
      "ailemi bulamıyorum",
      "haber kişisi",
      "güvenli alan"
    ],
    "sources": [
      "e-Devlet — AFAD \"Afet ve Acil Durum Toplanma Alanı Sorgulama\"",
      "AFAD — Acil Toplanma Alanları",
      "Ready.gov — Earthquakes"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: turkiye.gov.tr AFAD hizmet listesi (\"Afet ve Acil Durum Toplanma Alanı Sorgulama\" adı birebir), Ready.gov Earthquakes (buluşma yeri planı, hasarlı binadan uzak durma)."
    },
    "art": [
      "barinma-toplanma-sorgu",
      "barinma-aile-iki-bulusma",
      "barinma-haber-kisisi",
      "barinma-numara-kagidi",
      null,
      "go-assembly-area",
      null,
      "barinma-kapiya-not"
    ],
    "alsoIn": [
      "hazirlik"
    ]
  },
  {
    "id": "barinma-acil-tuvalet",
    "title": "Acil tuvalet ve atıkların güvenli toplanması",
    "tag": "BARINMA",
    "summary": "Tuvalet kullanılamıyorsa poşet geçirilmiş kovayla geçici tuvalet yapın, her kullanımdan sonra üstünü toprakla örtün ve ellerinizi yıkayın.",
    "steps": [
      "Depremden sonra kanalizasyon hasarlı olabilir. Yetkililer sağlam diyene kadar sifon çekmeyin.",
      "Kapaklı bir kovaya ya da klozetin içine iki kat sağlam çöp poşeti geçirin.",
      "Her kullanımdan sonra dışkının üstünü bir avuç toprak, talaş ya da kedi kumuyla örtün.",
      "Kapağı hep kapalı tutun; sinekler hastalık taşır.",
      "Poşet yarıya dolunca ağzını sıkıca bağlayın, ikinci bir poşete koyun ve görevlilerin gösterdiği toplama yerine bırakın.",
      "Tuvaletten sonra ellerinizi sabun ve suyla yıkayın. Su yoksa alkollü el dezenfektanı kullanın.",
      "Dışarıda tuvalet yapmak zorundaysanız su kaynaklarından en az 30 metre uzakta küçük bir çukur kazın ve üstünü toprakla örtün.",
      "Ortak tuvaletleri her gün sulandırılmış çamaşır suyuyla temizleyin; ishalli biri kullandıysa hemen temizleyin.",
      "Kampta tuvaletlerin aydınlatılmış, kilitlenebilir ve kadın-erkek ayrı olmasını görevlilerden isteyin."
    ],
    "dont": [
      "Dereye, göle ya da su kaynağının yakınına tuvalet yapmayın.",
      "Dışkılı poşeti açıkta ya da çadırın yanında bırakmayın.",
      "Çamaşır suyunu tuz ruhu, amonyak ya da başka temizlik ürünüyle karıştırmayın."
    ],
    "keywords": [
      "tuvalet",
      "tuvalet yok",
      "acil tuvalet",
      "tuvalet nereye yapılır",
      "sifon çekilmiyor",
      "sifon çekebilir miyim",
      "kova tuvalet",
      "seyyar tuvalet",
      "dışkı",
      "çiş",
      "kanalizasyon",
      "tuvalete gidemiyorum",
      "wc",
      "tuvalet ihtiyacı"
    ],
    "sources": [
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "T.C. Sağlık Bakanlığı — Afetlerde genel sağlık önerileri",
      "Hacettepe Ü. Halk Sağlığı AD — Sahra tuvaleti bilgi notu",
      "CDC — Clean Hands: About Handwashing",
      "CDC — Sanitation and wastewater after emergencies",
      "NPS — Leave No Trace Seven Principles"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Hacettepe Ü. Halk Sağlığı sahra tuvaleti notu (dışkı üstüne toprak atma, çukurun yeraltı suyu ve kuyuları kirletmemesi), HSGM 2024 (kapaklı çöp kovası ve torba, tuvalet-musluk ≤100 m); CDC, NPS. Sudan 30 m eşiği için Türk kaynağında sayı bulunamadı; değişiklik yok."
    },
    "art": [
      "barinma-sifon-yasak",
      "barinma-kova-poset",
      "barinma-toprak-serp",
      null,
      "barinma-poset-bagla",
      "wash-hands",
      "barinma-dis-cukur",
      null,
      null
    ]
  },
  {
    "id": "barinma-guvenli-isitma",
    "title": "Çadır ve konteynerde güvenli ısıtma (soba ve ısıtıcı)",
    "tag": "BARINMA",
    "summary": "Çadır ve konteynerde yalnızca prize doğrudan takılan elektrikli ısıtıcı ya da bacası dışarı çıkan soba kullanın, havalandırmayı açık tutun, mangal ve tüplü ısıtıcı yakmayın.",
    "steps": [
      "En güvenli seçenek prize doğrudan takılan elektrikli ısıtıcıdır.",
      "Isıtıcıyı uzatma kablosu ya da çoklu prizle çalıştırmayın.",
      "Soba kullanıyorsanız borusu mutlaka dışarı çıksın. Borunun çadırdan geçtiği yerde yanmaz bir koruma olsun.",
      "Sobayı düz ve yanmaz bir zemine koyun. Çadır bezinden, yataktan ve giysilerden en az 1 metre uzak tutun.",
      "Havalandırma deliklerini ve kapı aralığını tamamen kapatmayın; içeri temiz hava girmeli.",
      "Yatmadan önce sobayı söndürün, elektrikli ısıtıcıyı kapatın.",
      "Pilli karbonmonoksit alarmı varsa uyku alanının yakınına takın.",
      "Yanınızda yangın söndürücü ya da bir kova kum bulundurun.",
      "Baş ağrısı, baş dönmesi, bulantı ya da uyku hali olursa herkesi hemen temiz havaya çıkarın ve 112'yi arayın."
    ],
    "dont": [
      "Çadırda ya da konteynerde mangal, kömürlü kova, tüplü ısıtıcı veya jeneratör yakmayın.",
      "Isınmak için ocağı ya da fırını açık bırakmayın.",
      "Sobayı benzin ya da tinerle tutuşturmayın.",
      "Sobanın üstünde ya da dibinde çamaşır kurutmayın."
    ],
    "keywords": [
      "soba güvenli mi",
      "çadır sobası",
      "çadırda ısıtıcı",
      "konteyner ısıtma",
      "konteynerde soba",
      "elektrikli ısıtıcı",
      "soba borusu",
      "çadır yanar mı",
      "çadırı nasıl ısıtırım",
      "ısıtıcı çadır",
      "soba nasıl yakılır",
      "cadir sobasi"
    ],
    "sources": [
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "USFA (FEMA) — Heating fire safety",
      "Amerikan Kızılhaçı — Winter storm safety",
      "CPSC — Carbon Monoxide Information Center",
      "CDC — Winter weather safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: HSGM 2024 (ısınmada en uygun seçenek elektrikli ısıtıcı, çadırda uzatma kablosu ve petrol yakıtlı ocak yok); USFA/FEMA, Amerikan Kızılhaçı, CPSC, CDC. Çelişki yok; baca geçiş koruması uzman onayı bekliyor."
    },
    "art": [
      "barinma-elektrikli-isitici",
      "barinma-uzatma-yasak",
      "barinma-soba-baca-disari",
      "barinma-soba-mesafe",
      "barinma-havalandirma-acik",
      null,
      "barinma-co-alarm",
      null,
      null
    ]
  },
  {
    "id": "barinma-kis-cadir",
    "title": "Kışın çadırda kalmak",
    "tag": "BARINMA",
    "summary": "Kışın çadırda yatağı yerden yükseltip yalıtın, kuru ve katmanlı giyinin, çatıdaki karı temizleyin ve aşırı üşüyen kişiyi erken fark edin.",
    "steps": [
      "Yatağı yerden yükseltin (palet, tahta, sedir) ve altına köpük, karton ya da battaniye serin.",
      "Kapı ve pencere aralıklarını rüzgâra karşı kapatın, ama bir havalandırma aralığı bırakın.",
      "Gevşek ve katmanlı giyinin: içte ince, ortada yün ya da polar, dışta rüzgâr geçirmez bir kat.",
      "Başınızı, ellerinizi ve ayaklarınızı örtün. Gece bere ve kuru çorapla yatın.",
      "Islanan giysiyi hemen değiştirin; ıslak giysi vücudu çok hızlı soğutur.",
      "Sıcak içecekler için ve düzenli yemek yiyin.",
      "Çadırın üstünde biriken karı sık sık süpürün; karın ağırlığı çadırı çökertebilir.",
      "Yaşlıları, bebekleri ve hastaları sık sık kontrol edin; onlar daha çabuk üşür.",
      "Titreme, sersemlik, peltek konuşma ya da aşırı uyku hali görürseniz kişiyi sıcak bir yere alın ve 112'yi arayın.",
      "Çadır çok soğuksa ısıtılan ortak çadıra, konteynere ya da yakınlarınızın yanına geçin."
    ],
    "dont": [
      "Isınmak için çadırda mangal ya da tüplü ısıtıcı yakmayın.",
      "Alkolle ısınmaya çalışmayın; vücudun ısı kaybını artırır.",
      "Islak giysiyle ya da ıslak uyku tulumunda uyumayın."
    ],
    "keywords": [
      "kışın çadır",
      "kış çadır",
      "çadırda kış",
      "çadır çok soğuk",
      "çadırda donuyoruz",
      "çadırda soğuk",
      "çadıra kar yağdı",
      "kar çadırı çökertir",
      "kışın çadırda kalmak",
      "kış barınma",
      "cadirda kis"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Winter storm safety",
      "NHS — Hypothermia",
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Amerikan Kızılhaçı Winter Storm (katmanlı ve kuru giyim, sıcak içecek, alkolden kaçınma, hipotermi belirtileri, risk grupları), NHS Hypothermia (belirtiler, ıslak giysiyi çıkarma, acil yardım, alkol yok). Yerden yükseltme ve kar yükü uyarısı yeniden doğrulanamadı."
    },
    "art": [
      "barinma-zemin-yalitim",
      null,
      "barinma-katmanli-giyim",
      "barinma-bere-corap",
      null,
      "barinma-sicak-icecek",
      "barinma-kar-temizle",
      null,
      null,
      null
    ]
  },
  {
    "id": "barinma-kamp-hijyen",
    "title": "Kampta hijyen ve bulaşıcı hastalıklardan korunma",
    "tag": "BARINMA",
    "summary": "Kampta salgını önlemek için elleri sık yıkayın, yalnızca güvenli su için, çöpü ve tuvaleti düzenli tutun ve ishal, ateş ya da döküntüyü hemen sağlık ekibine bildirin.",
    "steps": [
      "Ellerinizi sabun ve suyla en az 20 saniye yıkayın: tuvaletten sonra, yemekten ve yemek hazırlamadan önce, bebek bezi değiştirdikten sonra.",
      "Su ya da sabun yoksa en az %60 alkollü el dezenfektanı kullanın.",
      "Yalnızca şişe ya da arıtılmış su için. Dişlerinizi de bu suyla fırçalayın.",
      "İshal, ateş, döküntü ya da gözlerde sararma görürseniz hemen kamp sağlık birimine bildirin.",
      "Kanlı dışkı, çok sık sulu ishal, içememe, çökük gözler ya da aşırı halsizlik varsa beklemeden sağlık ekibine götürün.",
      "İshali olan kişiye bol sıvı içirin; sağlık ekibinin verdiği ağızdan sıvı tuzunu (ORS) kullanın.",
      "Öksürürken ve hapşırırken ağzınızı dirseğinizle kapatın. Çadırı her gün havalandırın.",
      "Çöpü kapaklı kovada ve poşette toplayın. Çadırda yiyeceği açıkta bırakmayın.",
      "Su birikintilerini kurutun, su kaplarının kapağını kapalı tutun; sivrisinek ve sinek ürer.",
      "Çamaşırları sık yıkayın. Bit görülürse giysileri yıkayın ve dikiş yerlerini ütüleyin."
    ],
    "dont": [
      "Havlu, bardak ve diş fırçasını ortak kullanmayın.",
      "Bebek bezini ve dışkıyı açığa ya da dereye atmayın.",
      "İshali ya da ateşi olan kişi ortak yemek hazırlamasın."
    ],
    "keywords": [
      "salgın",
      "bulaşıcı hastalık",
      "kampta hastalık",
      "çadırkentte hijyen",
      "kampta hijyen",
      "hijyen",
      "el yıkama",
      "ishal salgını",
      "ishal",
      "bit",
      "uyuz",
      "kolera",
      "sıvı tuzu",
      "ors",
      "bulasici hastalik"
    ],
    "sources": [
      "Hacettepe Ü. Halk Sağlığı AD — Afet bölgelerinde enfeksiyon önleme (2023)",
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "CDC — Clean Hands: About Handwashing",
      "WHO — Diarrhoeal disease fact sheet"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC Clean Hands (ne zaman yıkanır, en az 20 sn, ≥%60 alkol), WHO Diarrhoeal disease fact sheet (ORS, kanlı dışkı ve sıvı kaybı belirtilerinde sağlık başvurusu, güvenli su ve sanitasyon). Bit için ütü ve vektör kontrolü yeniden doğrulanamadı."
    },
    "art": [
      "wash-hands",
      "barinma-el-dezenfektan",
      "barinma-dis-fircalama",
      null,
      "hospital-go",
      null,
      "barinma-dirsek-oksurme",
      "barinma-cop-kapakli",
      null,
      null
    ]
  },
  {
    "id": "barinma-sicak-kalma",
    "title": "Isıtma yokken evde sıcak kalmak",
    "tag": "BARINMA",
    "summary": "Isıtma yoksa tek ve küçük bir odada toplanın, katmanlı ve kuru giyinin, yerden yalıtın, birbirinize yakın durun ve sıcak içecek için.",
    "steps": [
      "Evin ya da barınağın en küçük, rüzgâr almayan bölümünde toplanın; diğer odaların kapısını kapatın.",
      "Cam ve kapı aralıklarını battaniye, karton ya da naylonla kapatın.",
      "Gevşek ve katmanlı giyinin; birkaç ince kat, tek kalın kattan daha sıcak tutar.",
      "Başınızı, boynunuzu, ellerinizi ve ayaklarınızı örtün.",
      "Soğuk yere doğrudan oturmayın ve yatmayın; altınıza karton, köpük ya da battaniye serin.",
      "Birbirinize yakın oturup uyuyun ve battaniyeleri paylaşın.",
      "Sıcak içecekler için ve düzenli yiyin.",
      "Folyo battaniye varsa giysilerin üstünden sarın.",
      "Islanırsanız hemen kuru giysi giyin.",
      "Bunlar yetmezse ısıtılan bir toplanma yerine, komşuya ya da yakınlarınıza gidin."
    ],
    "dont": [
      "Isınmak için kapalı alanda mangal, ocak, fırın ya da jeneratör kullanmayın; karbonmonoksit öldürür.",
      "Isınmak için alkol içmeyin; vücudun ısı kaybını artırır.",
      "Sıcak su şişesini beze sarmadan tene değdirmeyin; yanık yapar."
    ],
    "keywords": [
      "sıcak kalmak",
      "nasıl sıcak kalırım",
      "battaniye yok",
      "ısıtma yok",
      "kalorifer yok",
      "soba yok",
      "doğalgaz yok soğuk",
      "evde çok soğuk",
      "ev buz gibi",
      "yakacak yok",
      "odun yok",
      "elektrik yok soğuk",
      "sicak kalmak"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Winter storm safety",
      "CDC — Winter weather safety",
      "USFA (FEMA) — Heating fire safety",
      "NHS — Hypothermia"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Amerikan Kızılhaçı Winter Storm (sızıntı kapatma, katmanlı giyim, sıcak içecek, alkol yok, ocak/fırınla ısınmama, jeneratör dışarıda), CDC Winter Weather (cama naylon), USFA (fırınla ısınmama), NHS Hypothermia (sıcak su şişesi uyarısı, alkol yok)."
    },
    "art": [
      "barinma-tek-oda",
      "barinma-cam-naylon",
      "barinma-katmanli-giyim",
      null,
      null,
      "barinma-birlikte-battaniye",
      "barinma-sicak-icecek",
      "barinma-folyo-battaniye",
      null,
      null
    ]
  }
];
