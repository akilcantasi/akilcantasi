// Rehber kategorisi: Nükleer ve kimyasal
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "nukleer",
  "title": "Nükleer ve kimyasal",
  "hint": "Radyasyon, zehirli gaz",
  "art": "cat-nukleer",
  "color": "#e6c229",
  "order": 5
};

export const GUIDES: Guide[] = [
  {
    "id": "nukleer-radyasyon",
    "title": "Nükleer kaza ve radyasyon",
    "tag": "NÜKLEER",
    "summary": "Hemen sağlam bir binaya girin, en az 24 saat içeride kalın ve resmi duyuruları dinleyin.",
    "steps": [
      "İÇERİ GİRİN: En yakın sağlam binaya hemen girin. Tuğla ya da beton bina en iyisidir; araç iyi korumaz.",
      "Bodruma ya da binanın ortasındaki bir odaya geçin. Dış duvarlardan, pencerelerden ve çatıdan uzak durun.",
      "Kapı ve pencereleri kapatın. Klimayı, aspiratörü ve havalandırmayı kapatın.",
      "Dışarıdan geldiyseniz dış giysilerinizi ve ayakkabınızı silkelemeden, dikkatlice çıkarın. Bu, bulaşmanın büyük kısmını giderir.",
      "Çıkardığınız giysileri poşete koyup ağzını bağlayın. Poşeti insanlardan ve hayvanlardan uzak bir yere bırakın.",
      "Ilık suyla ve sabunla duş alın, saçınızı şampuanla yıkayın. Saç kremi kullanmayın. Cildinizi ovalamayın.",
      "Duş yoksa ellerinizi, yüzünüzü ve açık cildinizi ıslak bezle silin. Burnunuzu sümkürün, göz kapaklarınızı ve kulaklarınızı silin.",
      "İÇERİDE KALIN: Yetkililer aksini söyleyene kadar en az 24 saat dışarı çıkmayın.",
      "DİNLEYİN: Pilli radyo, televizyon ya da telefondan AFAD, valilik ve Nükleer Düzenleme Kurumu (NDK) duyurularını takip edin.",
      "Kapalı ambalajlı yiyecek ve şişe suyu tüketin. Dışarıda açıkta kalmış yiyecekleri yemeyin."
    ],
    "dont": [
      "İyot tabletini yetkililer açıkça söylemeden almayın; her durumda işe yaramaz ve herkes için uygun değildir.",
      "İyot tableti yerine iyotlu tuz, tentürdiyot ya da başka iyotlu ürün içmeyin; korumaz, zarar verebilir.",
      "Çocukları okuldan almak için dışarı çıkmayın; okullar da korunma planı uygular.",
      "Çıkardığınız kirli giysileri yeniden giymeyin.",
      "Yakında bina varken araçta beklemeyin.",
      "Musluk suyunu kaynatarak radyasyondan temizlendiğini sanmayın; kaynatmak radyoaktif maddeyi gidermez."
    ],
    "keywords": [
      "nükleer",
      "radyasyon",
      "radyoaktif",
      "reaktör",
      "nükleer santral",
      "santral kazası",
      "çernobil",
      "akkuyu",
      "nükleer kaza",
      "nükleer saldırı",
      "atom bombası",
      "radyoaktif serpinti",
      "serpinti",
      "iyot tableti",
      "radyasyon yağmuru",
      "nukleer",
      "radyasyon sizintisi"
    ],
    "sources": [
      "CDC — What to Do: Get Inside / Stay Inside / Stay Tuned",
      "CDC — How to Self-Decontaminate after a Radiation Emergency",
      "CDC — Potassium Iodide (KI)",
      "HHS REMM — External contamination (saç kremi kullanılmaz)",
      "AFAD — KBRN Tehditlerine Karşı Korunma",
      "NDK — Kamuoyu Bilgilendirme Notu (RESA radyasyon erken uyarı ağını NDK işletir), ndk.gov.tr",
      "Norveç Radyasyon ve Nükleer Güvenlik Kurumu (DSA) — Türkçe broşürler: Nükleer kazalarda iyot tablet kullanımı; Kendinizi nasıl korursunuz"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: NDK kamuoyu notu (RESA'yı NDK işletir; TAEK/TENMAK analiz yapar), DSA Türkçe broşürleri (yalnızca yetkili talimatıyla iyot, başka iyot ürünü yerine konmaz, içeride kalma genelde kısa, saç kremi yok, ovalamadan yıka), CDC, HHS REMM; #9'a NDK eklendi, iyotlu tuz/tentürdiyot içme yasağı eklendi (DSA: iyot tableti yerine başka iyot ürünü alınmaz; tuz/tentürdiyot ifadesi uzman onayı bekler). AFAD KBRN sayfası robots nedeniyle açılamadı." },
    "art": [
      "nukleer-bina-gir",
      "nukleer-bina-ortasi",
      null,
      "nukleer-giysi-cikar",
      null,
      "nukleer-dus-sampuan",
      null,
      "nukleer-iceride-24-saat",
      "battery-radio",
      null
    ]
  },
  {
    "id": "kimyasal-sizinti",
    "title": "Kimyasal sızıntı ve zehirli gaz",
    "tag": "KİMYASAL",
    "summary": "Bulutun ve kokunun geldiği yerden yana doğru uzaklaşın; içerideyseniz kapı-pencereleri kapatıp üst kattaki penceresi az bir iç odaya geçin.",
    "steps": [
      "Dışarıdaysanız bulut ya da kokudan hemen uzaklaşın. Rüzgârı yandan alacak şekilde yürüyün, mümkünse yüksek bir yere doğru gidin.",
      "Ağzınızı ve burnunuzu ıslak bir bezle kapatın.",
      "En yakın binaya girin. Kapı ve pencereleri kapatıp kilitleyin.",
      "Klimayı, kombiyi, aspiratörü ve havalandırmayı kapatın.",
      "Mümkün olan en üst kattaki, penceresi az bir iç odaya geçin. Çoğu zehirli gaz havadan ağırdır ve aşağıda toplanır.",
      "Kapı altına ıslak havlu sıkıştırın. Pencere ve menfez kenarlarını naylon ve bantla kapatın.",
      "Kimyasal üzerinize bulaştıysa giysileri hemen çıkarın; başınızdan geçen giysiyi keserek çıkarın. Cildi ve gözleri bol akan suyla en az 15 dakika yıkayın.",
      "Nefes darlığı, öksürük ya da göz yanması varsa 112'yi arayın. Danışmak için Zehir Danışma: 114.",
      "Radyodan ya da telefondan duyuruları izleyin. \"Tehlike geçti\" denmeden dışarı çıkmayın."
    ],
    "dont": [
      "Bodruma inmeyin; ağır gazlar orada toplanır.",
      "Merak edip olay yerine yaklaşmayın.",
      "Bulaşan kimyasalı ovalamayın; akan suyla yıkayın.",
      "Araç içinde korunmaya çalışmayın; araçlar gaz geçirir."
    ],
    "callEmergency": true,
    "keywords": [
      "kimyasal",
      "zehirli gaz",
      "gaz bulutu",
      "kimyasal sızıntı",
      "kimyasal sizinti",
      "klor gazı",
      "klor kokusu",
      "klor gazı kokusu",
      "amonyak",
      "fabrika patladı",
      "fabrikadan duman",
      "keskin koku",
      "göz yanıyor boğaz yanıyor",
      "kimyasal bulaştı",
      "kbrn",
      "tanker devrildi",
      "kimyasal saldırı"
    ],
    "sources": [
      "CDC — What to Do in a Chemical Emergency",
      "CDC — What to Do to Shelter in Place for a Chemical Emergency",
      "AFAD — KBRN Tehditlerine Karşı Korunma",
      "UZEM — Ulusal Zehir Danışma Merkezi (114)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: CDC kimyasal acil durum yanıtı, CDC kimyasal yerinde korunma" },
    "art": [
      "nukleer-kimyasal-yana-kac",
      "nukleer-kimyasal-islak-bez",
      null,
      null,
      "nukleer-ust-kat-ic-oda",
      "nukleer-kapi-havlu-bant",
      "nukleer-kimyasal-yikama",
      "call-112",
      null
    ],
    "alsoIn": [
      "zehirlenme"
    ]
  },
  {
    "id": "nukleer-salgin",
    "title": "Salgın hastalık ve biyolojik tehdit",
    "tag": "SALGIN",
    "summary": "Resmi duyurulara uyun, ellerinizi sık yıkayın, hastaysanız evde ve ayrı odada kalın, hastaya bakarken maske takın.",
    "steps": [
      "Sağlık Bakanlığı ve valilik duyurularını takip edin. Söylentilere değil, resmi kaynaklara güvenin.",
      "Ellerinizi sabun ve suyla en az 20 saniye yıkayın. Su yoksa en az %60 alkollü el dezenfektanı kullanın.",
      "Öksürürken ve hapşırırken ağzınızı dirseğinizin içiyle ya da mendille kapatın. Mendili hemen atın.",
      "Elinizle gözünüze, burnunuza ve ağzınıza dokunmayın.",
      "Ateş, öksürük ya da ishal varsa evde kalın. Mümkünse ailenizden ayrı bir odada durun.",
      "Hastayla aynı odadaysanız ikiniz de maske takın. Odayı sık sık havalandırın.",
      "Hastanın tabağını, bardağını ve havlusunu ayırın. Kapı kolu gibi sık dokunulan yerleri silin.",
      "Nefes darlığı, göğüs ağrısı, bilinç bulanıklığı ya da sıvı alamama varsa 112'yi arayın.",
      "Şüpheli toz, paket ya da madde görürseniz dokunmayın, sallamayın. Odadan çıkıp kapıyı kapatın, ellerinizi yıkayın ve 112'yi arayın."
    ],
    "dont": [
      "Antibiyotik ya da başka ilacı kendi başınıza almayın; doktorun önerdiğini kullanın.",
      "Hastayken kalabalığa, toplu taşımaya ya da ziyarete gitmeyin.",
      "Şüpheli paketi açmayın, koklamayın, başka yere taşımayın.",
      "Doğrulanmamış haberleri ve \"mucize tedavileri\" paylaşmayın."
    ],
    "keywords": [
      "salgın",
      "salgin",
      "pandemi",
      "epidemi",
      "biyolojik",
      "biyolojik saldırı",
      "bulaşıcı hastalık",
      "virüs yayılıyor",
      "karantina",
      "izolasyon",
      "kolera",
      "şarbon",
      "şüpheli toz",
      "zarfta beyaz toz",
      "grip salgını"
    ],
    "sources": [
      "WHO/PAHO — Salgınlarda maske: kim, ne zaman, nasıl",
      "CDC — About Handwashing (Clean Hands)",
      "T.C. Sağlık Bakanlığı — Bulaşıcı hastalıklardan korunma duyuruları"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: CDC el yıkama (20 sn, en az %60 alkol); şüpheli toz adımı bu oturumda kaynaktan doğrulanamadı" },
    "art": [
      null,
      "wash-hands",
      "nukleer-dirsege-oksur",
      null,
      "nukleer-hasta-ayri-oda",
      "nukleer-hasta-bakim-maske",
      null,
      null,
      "nukleer-salgin-supheli-paket"
    ]
  },
  {
    "id": "nukleer-korunma-odasi",
    "title": "Evde korunma odası hazırlama",
    "tag": "KBRN",
    "summary": "Penceresi az bir iç oda seçin, içine su, yiyecek, ilaç ve radyo koyun; uyarı gelince kapı-pencere boşluklarını naylon ve bantla kapatın.",
    "steps": [
      "Odayı önceden seçin: penceresi az ya da hiç olmayan, dış duvarlardan uzak, herkese yetecek bir iç oda. Banyosu olan oda iyidir.",
      "Kimyasal sızıntı için üst kattaki bir odayı, radyasyon için bodrumu ya da binanın ortasını seçin.",
      "Odada bir kapatma seti hazır tutun: geniş bant, makas, havlular ve pencere boyutunda kesilip üstüne yazı yazılmış kalın naylon.",
      "Odaya su, kapalı ambalajlı yiyecek, ilaçlarınız, el feneri, pilli radyo, şarj aleti ve çöp poşeti koyun.",
      "Uyarı gelince herkesi ve evcil hayvanları içeri alın. Kapı ve pencereleri kapatıp kilitleyin.",
      "Klimayı, kombiyi, aspiratörü kapatın; şömine kapağını kapatın.",
      "Odaya girin. Pencereleri naylonla kaplayıp kenarlarını bantlayın, menfezleri bantla kapatın.",
      "Kapının çevresini bantlayın ya da alt boşluğa ıslak havlu sıkıştırın.",
      "Bölge dışındaki bir yakınınıza nerede olduğunuzu mesajla bildirin. Radyoyu açık tutun.",
      "Yetkililer \"tehlike geçti\" diyene kadar odada kalın. Bu birkaç saat ya da birkaç gün sürebilir."
    ],
    "dont": [
      "Odada mangal, soba ya da jeneratör yakmayın.",
      "Kimyasal sızıntıda bodrumu korunma odası yapmayın.",
      "Yetkililer söylemeden odadan çıkmayın; dışarısı içeriden daha tehlikeli olabilir."
    ],
    "keywords": [
      "korunma odası",
      "sığınak odası",
      "siginak odasi",
      "güvenli oda",
      "yerinde korunma",
      "evde sığınak",
      "odayı kapatma",
      "pencereyi naylonla kapatma",
      "bantla kapatma",
      "kbrn odası",
      "evde kal uyarısı",
      "nükleer sığınak"
    ],
    "sources": [
      "CDC — What to Do to Shelter in Place for a Chemical Emergency",
      "CDC — Preparing for a Radiation Emergency",
      "AFAD — KBRN Tehditlerine Karşı Korunma"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: CDC kimyasal yerinde korunma (oda, set, bant, süre, yakına haber), CDC radyasyon Get Inside (bodrum/orta, şömine kapağı)" },
    "art": [
      "nukleer-ic-oda-sec",
      null,
      "nukleer-kapatma-seti",
      "nukleer-oda-malzemeleri",
      null,
      null,
      "nukleer-pencere-naylon-bant",
      "nukleer-kapi-havlu-bant",
      null,
      null
    ],
    "alsoIn": [
      "hazirlik"
    ]
  },
  {
    "id": "nukleer-patlama-sonrasi",
    "title": "Patlama sonrası güvenlik",
    "tag": "PATLAMA",
    "summary": "Güvenliyse bölgeden hemen uzaklaşın, eşya için durmayın, olay yerine geri dönmeyin ve yetkililerin talimatlarına uyun.",
    "steps": [
      "Güvenliyse bölgeden hemen uzaklaşın. Eşya almak ya da telefonla konuşmak için durmayın.",
      "Binadaysanız asansörü kullanmayın. Çatlamış, çökmüş merdiven ve zeminlerden kaçınarak çıkın.",
      "Duman varsa eğilerek ilerleyin. Ağzınızı ve burnunuzu bir bezle kapatın.",
      "Bakmak, video çekmek ya da toplanmak için olay yerine geri dönmeyin. İkinci bir tehlike olabilir.",
      "Yangından, gaz kokusundan, kopmuş elektrik tellerinden ve yıkılabilecek duvarlardan uzak durun.",
      "Sahipsiz çanta, paket ya da şüpheli bir şey görürseniz dokunmayın. Uzaklaşıp görevliye ya da 112'ye bildirin.",
      "Güvenli bir yere ulaşınca 112'yi arayın. Yerinizi ve yaralıları bildirin.",
      "Ailenize kısa mesajla haber verin. Telefon hatlarını acil aramalar için boş bırakın.",
      "Enkaz altında kaldıysanız düdük çalın ya da borulara vurun. Toz yutmamak için bağırmayı son çare olarak kullanın.",
      "Nefes darlığı, göğüs ağrısı ya da işitme kaybı varsa sağlık ekibine görünün. Yetkililerin talimatlarına uyun."
    ],
    "dont": [
      "Olay yerindeki parçalara ve eşyalara dokunmayın, almayın.",
      "Fotoğraf ya da video çekmek için bölgede kalmayın.",
      "Doğrulanmamış haberleri ve görüntüleri paylaşmayın.",
      "Yaralı değilseniz hastaneye gitmeyin; acil servisleri yaralılara bırakın."
    ],
    "callEmergency": true,
    "keywords": [
      "patlama",
      "patlama oldu",
      "bomba",
      "bomba patladı",
      "bir şey patladı",
      "bombalı saldırı",
      "terör saldırısı",
      "saldırı oldu",
      "infilak",
      "sahipsiz paket",
      "şüpheli çanta",
      "patlama sesi",
      "patlamadan sonra",
      "patlama sonrasi"
    ],
    "sources": [
      "FEMA Ready.gov — Explosions",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: Ready.gov Explosions (uzaklaş, asansör yok, zayıf merdiven, eğil, ağız-burun, fener/düdük/boru, bağırma son çare, mesaj)" },
    "art": [
      "nukleer-patlama-uzaklas",
      "nukleer-patlama-merdiven",
      null,
      "nukleer-geri-donme-yasak",
      null,
      "nukleer-supheli-paket",
      null,
      "sms-send",
      "nukleer-patlama-duduk",
      null
    ]
  },
  {
    "id": "nukleer-maske-kullanimi",
    "title": "Maskeyi doğru takmak (N95 / FFP2)",
    "tag": "MASKE",
    "summary": "Maskeyi temiz ellerle takın, burun telini sıkıştırın ve her takışta hava kaçağı kontrolü yapın; toz maskesi gaza karşı korumaz.",
    "steps": [
      "Toz, kül ve mikroba karşı N95, FFP2 ya da FFP3 maske kullanın. Bu maskeler gazı ve kimyasal buharı tutmaz.",
      "Takmadan önce ellerinizi yıkayın. Islak, kirli ya da yırtık maskeyi kullanmayın.",
      "Maskeyi, burun teli üstte olacak şekilde çenenizin altına yerleştirin.",
      "Üst lastiği başınızın arkasına, alt lastiği ensenize, kulaklarınızın altına geçirin. Lastikleri çaprazlamayın.",
      "Burun telini iki elinizin parmaklarıyla burnunuzun şekline göre bastırın.",
      "Kontrol edin: maskeyi iki elinizle kapatıp nefes verin. Kenarlardan hava kaçıyorsa ya da gözlüğünüz buğulanıyorsa yeniden ayarlayın.",
      "Sakal hava kaçağına yol açar. Mümkünse tıraşlı olun.",
      "Çıkarırken maskenin önüne dokunmayın. Önce alt, sonra üst lastiği başınızın arkasından çekerek çıkarın, sonra ellerinizi yıkayın.",
      "Maske ıslanırsa, kirlenirse, nefes almak zorlaşırsa ya da lastikleri gevşerse yenisini takın."
    ],
    "dont": [
      "Toz maskesinin gazdan, duman gazından ya da karbonmonoksitten koruduğunu sanmayın.",
      "Maskeyi yıkamayın; fırında ya da mikrodalgada ısıtmayın.",
      "Maskeyi çenenize indirip yeniden takmayın.",
      "Bebeklere maske takmayın."
    ],
    "keywords": [
      "maske",
      "maske nasıl takılır",
      "n95",
      "ffp2",
      "ffp3",
      "toz maskesi",
      "solunum maskesi",
      "maske takma",
      "maske kontrolü",
      "maske hava kaçırıyor",
      "respiratör",
      "gaz maskesi"
    ],
    "sources": [
      "CDC/NIOSH — Filtering Facepiece Respirator donning/doffing (2010-133)",
      "CDC/NIOSH — Understanding the Difference: Surgical Mask vs N95",
      "WHO/PAHO — Salgınlarda maske kullanımı"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NIOSH 2010-133 takma-çıkarma, NIOSH cerrahi maske/N95 farkı (her takışta kontrol, ıslak/kirli/zor nefeste at)" },
    "art": [
      null,
      null,
      "nukleer-maske-cene",
      "nukleer-maske-lastikler",
      "nukleer-maske-burun-teli",
      "nukleer-maske-kacak-kontrol",
      null,
      "nukleer-maske-cikar",
      null
    ],
    "alsoIn": [
      "hazirlik"
    ]
  }
];
