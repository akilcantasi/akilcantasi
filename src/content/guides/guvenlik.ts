// Rehber kategorisi: Güvenlik ve düzen
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "guvenlik",
  "title": "Güvenlik ve düzen",
  "hint": "Kayıp çocuk, dolandırıcılık, çadır kent",
  "art": "cat-guvenlik",
  "color": "#94a3b8",
  "order": 15
};

export const GUIDES: Guide[] = [
  {
    "id": "guvenlik-kayip-cocuk",
    "title": "Kayıp çocuk ve kayıp yakın",
    "tag": "GÜVENLİK",
    "summary": "Çocuğunuz kaybolursa hemen 112'ye ya da en yakın görevliye bildirin; yalnız bir çocuk bulursanız yanından ayrılmayın ve ALO 183'e ya da polise, jandarmaya teslim edin.",
    "steps": [
      "Çocuğunuz kaybolduysa hemen 112'yi arayın ya da en yakın polis, jandarma veya AFAD görevlisine söyleyin.",
      "Çocuğun adını, yaşını, boyunu, giysisini ve son görüldüğü yeri anlatın. Telefonunuzdaki son fotoğrafını gösterin.",
      "Bir yetişkin son görüldüğü yerde beklesin. Diğerleri yakın çevreyi arasın.",
      "Yalnız bir çocuk bulursanız yanından ayrılmayın. ALO 183'ü arayın ya da çocuğu polise, jandarmaya veya Aile ve Sosyal Hizmetler görevlisine teslim edin.",
      "Çocuğun adını, yaşını, anne-babasının adını, bulduğunuz yeri, tarihi ve saati yazın.",
      "Çocuğu kimliği doğrulanmamış birine vermeyin. Teslim ettiğiniz görevlinin adını ve kurumunu not edin.",
      "Bulduğunuz çocuğun fotoğrafını, adını ve bulunduğu yeri sosyal medyada paylaşmayın.",
      "Kayıp bir yakınınızı arıyorsanız valilik, AFAD ve Kızılay bilgi noktalarına ve hastanelerin danışmasına başvurun. Kayıp çocuğunuzu ALO 183'e de bildirin.",
      "Önceden: çocuğun cebine ya da koluna adınızı ve telefonunuzu yazın. Kaybolursa olduğu yerde kalmasını ve yelekli görevliye gitmesini öğretin."
    ],
    "dont": [
      "Bulduğunuz çocuğu kendi evinize ya da başka bir yere götürmeyin; yetkililere teslim edin.",
      "\"Akrabasıyım\" diyen birine görevli onayı ve kimlik olmadan çocuğu vermeyin.",
      "Çocuğun fotoğrafını ve kaldığı yeri internette paylaşmayın; kötü niyetli kişilere yol açar."
    ],
    "callEmergency": true,
    "keywords": [
      "kayıp çocuk",
      "çocuğum kayboldu",
      "çocuk kayboldu",
      "çocuğumu bulamıyorum",
      "kaybolan çocuk",
      "yalnız çocuk buldum",
      "sahipsiz çocuk",
      "refakatsiz çocuk",
      "alo 183",
      "183",
      "kayıp yakın",
      "yakınımı bulamıyorum",
      "cocugum kayboldu",
      "kayip cocuk"
    ],
    "sources": [
      "UNICEF Türkiye — Depremden Etkilenen Çocukların Korunmasına İlişkin Rehber",
      "Aile ve Sosyal Hizmetler Bakanlığı — ALO 183 Şiddetle Mücadele Hattı",
      "İçişleri Bakanlığı — 112 Acil Çağrı"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: ASHB ALO 183 Sosyal Destek Hattı (aile.gov.tr SSS), 2023 depreminde ASHB'nin refakatsiz çocuk ihbarlarını ALO 183 ve sorgu ekranı üzerinden kaydetmesi (Cumhuriyet, 2054316); #8'e kayıp çocuğu ALO 183'e bildirme eklendi. UNICEF Türkiye rehberi açılamadı."
    },
    "art": [
      "call-112",
      "guvenlik-cocuk-tarif",
      null,
      "guvenlik-cocuk-gorevliye",
      null,
      null,
      "guvenlik-paylasma-yasak",
      null,
      "guvenlik-cocuk-bileklik"
    ]
  },
  {
    "id": "guvenlik-yardim-dolandiriciligi",
    "title": "Yardım ve bağış dolandırıcılığı",
    "tag": "GÜVENLİK",
    "summary": "Bağışı yalnızca resmi kurumların kendi kanallarından yapın; kişisel IBAN'a, bağlantılara ve kod isteyenlere karşı dikkatli olun.",
    "steps": [
      "Bağışı yalnızca AFAD, Kızılay gibi bilinen kurumların kendi sitesinden ya da resmi hesaplarından yapın.",
      "Kampanyayı başka bir yoldan doğrulayın: kurumun sitesine adresi kendiniz yazarak girin ya da kurumu arayın.",
      "Yardım toplayan kişi ya da dernekten valilik ya da kaymakamlıktan aldığı yardım toplama iznini sorun. Emin olamazsanız il sivil toplumla ilişkiler müdürlüğüne danışın.",
      "Kişi adına açılmış bir IBAN'a \"acil yardım\" diye para göndermeyin.",
      "SMS, e-posta ya da sosyal medyadan gelen bağış bağlantılarına tıklamayın.",
      "Kart bilgisi, şifre ya da telefonunuza gelen doğrulama kodunu kimseyle paylaşmayın.",
      "\"Yardım çıktı, ev verilecek\" deyip ücret, kimlik fotokopisi ya da kod isteyenlere inanmayın. Resmi yardım için para istenmez.",
      "Dolandırıldıysanız hemen bankanızı arayın ve kartınızı kapattırın. Sonra polise ya da jandarmaya şikâyette bulunun."
    ],
    "dont": [
      "\"Hemen gönderin\" diye baskı yapan, duygusal fotoğraflı paylaşımlara düşünmeden para göndermeyin.",
      "Bir arkadaşınız paylaştı diye kampanyayı doğru saymayın; beğeni sayısı güven göstermez.",
      "Kapınıza gelen ve kimlik göstermeyen \"görevliye\" para ya da belge vermeyin."
    ],
    "keywords": [
      "bağış dolandırıcılığı",
      "sahte bağış",
      "sahte yardım kampanyası",
      "yardım dolandırıcılığı",
      "dolandırıldım",
      "dolandırıcı",
      "iban",
      "nereye bağış yapayım",
      "bağış yapmak istiyorum",
      "sahte link",
      "yardım toplama izni",
      "bagis dolandiriciligi",
      "sahte bagis"
    ],
    "sources": [
      "2860 sayılı Yardım Toplama Kanunu",
      "TÜSEV — Yardım Toplama Bilgi Notu (2024)",
      "Bağış güvenliği uyarıları (2023 depremleri sonrası)",
      "TOKİ — Deprem bölgesi dolandırıcılık uyarısı (2023)",
      "FTC — Donate wisely and avoid charity scams"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: 2860 sayılı Kanun ve TÜSEV Yardım Toplama Bilgi Notu (izin yetkisi kaymakamlık ve valilikte, başvuruları il sivil toplumla ilişkiler müdürlükleri değerlendirir); siviltoplum.gov.tr'de halka açık izin sorgu ekranı doğrulanamadığı için #3 buna göre değiştirildi. Diğer adımlar FTC ile uyumlu."
    },
    "art": [
      "guvenlik-resmi-bagis",
      null,
      "guvenlik-izin-sorgu",
      "guvenlik-iban-yasak",
      "guvenlik-sahte-link",
      "guvenlik-kod-paylasma",
      null,
      "guvenlik-banka-ara"
    ]
  },
  {
    "id": "guvenlik-cadir-kent",
    "title": "Çadır kentte kişisel güvenlik (kadın ve çocuk)",
    "tag": "GÜVENLİK",
    "summary": "Geceleri tek gitmeyin, fener taşıyın, çocukları yalnız bırakmayın; tehlikede 112'yi, şiddet ve istismar için ALO 183'ü arayın.",
    "steps": [
      "Gece tuvalete ya da suya tek gitmeyin. Bir yakınınızla ya da komşu kadınlarla birlikte gidin.",
      "Yanınızda fener taşıyın. Karanlık, ıssız yollardan değil, aydınlık yoldan yürüyün.",
      "Tuvaletler kadın ve erkek için ayrı mı, kapılar içeriden kilitleniyor mu, yolu aydınlık mı bakın. Değilse kamp yönetimine söyleyin.",
      "Çocukları tuvalete ya da dağıtım noktasına yalnız göndermeyin. Yanlarında hep bir yetişkin olsun.",
      "Çocuklara tanımadıkları biriyle hiçbir yere gitmemeyi öğretin. Korkarlarsa size ya da yelekli görevliye söylesinler.",
      "Çadırınızı tanıdığınız ailelerin yakınına kurun. Komşularınızla birbirinize göz kulak olun.",
      "Yardım karşılığı sizden para, iyilik ya da cinsel bir şey isteyen olursa reddedin ve bildirin. Yardım ücretsizdir.",
      "Tehlikede hemen 112'yi arayın. Şiddet ve istismar için ALO 183'ü ya da KADES uygulamasını kullanın, kamp güvenliğine bildirin."
    ],
    "dont": [
      "Gece çadır aralarında ve ıssız alanlarda tek dolaşmayın.",
      "Yaşadığınız ya da gördüğünüz tacizi, istismarı utanıp saklamayın; bildirmek sizi ve başkalarını korur.",
      "Çocukları tanımadığınız birinin bakımına bırakmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "çadır kentte güvenlik",
      "çadır kent güvenliği",
      "kamp güvenliği",
      "kadın güvenliği",
      "çocuk güvenliği çadır",
      "taciz",
      "tacize uğradım",
      "istismar",
      "şiddet ihbar",
      "güvenli tuvalet",
      "gece tuvalete gitmek",
      "kades",
      "konteyner kent güvenlik",
      "cadir kent guvenlik"
    ],
    "sources": [
      "IASC — Toplumsal Cinsiyete Dayalı Şiddet Kılavuzu (aydınlatma, ayrı ve kilitli tuvalet)",
      "UNFPA / ReliefWeb — 16 Actions for Women and Girls' Safety in Emergencies",
      "Aile ve Sosyal Hizmetler Bakanlığı — ALO 183",
      "Emniyet Genel Müdürlüğü — KADES"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: KADES uygulamasının adı ve EGM/İçişleri tarafından hâlâ kullanıldığı (İçişleri Bakanı açıklaması, DHA 2888167: 9,7 milyon indirme), ASHB ALO 183; değişiklik yok. IASC/UNFPA açılamadı."
    },
    "art": [
      "guvenlik-kamp-birlikte",
      "guvenlik-kamp-fener",
      "guvenlik-kamp-tuvalet",
      "guvenlik-kamp-cocuk-yetiskin",
      null,
      null,
      null,
      "call-112"
    ]
  },
  {
    "id": "guvenlik-bos-ev",
    "title": "Tahliyeden sonra boş evi güvene alma",
    "tag": "GÜVENLİK",
    "summary": "Evden ayrılırken gazı, suyu, elektriği kapatın, değerli eşyaları alın, kilitleyin ve izin olmadan geri dönmeyin.",
    "steps": [
      "Zaman varsa ya da yetkililer söylediyse gazı, suyu ve elektriği ana vanadan ve şalterden kapatın.",
      "Fişleri prizden çekin. Ocak ve sobanın tamamen söndüğünden emin olun.",
      "Değerli eşyaları, önemli belgeleri ve ilaçlarınızı yanınıza alın.",
      "Kapı ve pencereleri kilitleyin. Anahtarı yanınıza alın.",
      "Komşunuza ve muhtara ayrıldığınızı ve nereye gittiğinizi söyleyin.",
      "Yağma ya da şüpheli kişi görürseniz kendiniz müdahale etmeyin; 112'yi arayın.",
      "Yetkililer izin vermeden eve dönmeyin. Hasarlı binaya yalnızca görevli izniyle ve kısa süre için girin.",
      "Döndüğünüzde gaz kokusu, yeni çatlak ya da su birikintisi varsa içeri girmeyin. Işık düğmesine dokunmayın, uzaklaşıp yetkililere haber verin."
    ],
    "dont": [
      "Hırsızla ya da yağmacıyla kendiniz yüzleşmeyin.",
      "\"Girilemez\" ya da ağır hasarlı denen binaya eşya almak için girmeyin.",
      "Evinizin boş olduğunu ve adresini sosyal medyada paylaşmayın."
    ],
    "keywords": [
      "boş ev",
      "evden ayrılırken",
      "evi boşaltırken",
      "tahliye ev güvenliği",
      "evi kilitleme",
      "yağma",
      "yağmacı",
      "hırsız",
      "evime hırsız girer mi",
      "eşyalarımı almak",
      "hasarlı eve girmek",
      "bos ev",
      "yagma ihbar"
    ],
    "sources": [
      "AFAD — Hasarlı binalardan eşya tahliyesi genelgesi (2023)",
      "Amerikan Kızılhaçı — Tahliye ve eve dönüş",
      "CDC — Natural disasters: safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC Natural disasters safety (hasarlı binaya yetkili güvenli demeden girme, gaz kokusunda çık ve kıvılcım çıkarma, suda durarak şaltere dokunma). AFAD genelgesi ve Ready.gov/Kızılhaç tahliye sayfaları açılamadı."
    },
    "art": [
      "gas-valve-off",
      null,
      "guvenlik-ev-degerli",
      "guvenlik-ev-kilit",
      "guvenlik-ev-komsu",
      "call-112",
      "guvenlik-ev-girilemez",
      null
    ]
  },
  {
    "id": "guvenlik-yanlis-bilgi",
    "title": "Yalan haberi ve yanlış bilgiyi tanıma",
    "tag": "GÜVENLİK",
    "summary": "Paylaşmadan önce durun, bilgiyi AFAD ve valilik gibi resmi kaynaklardan doğrulayın.",
    "steps": [
      "Bir haberi paylaşmadan önce durun. Kaynağı kim, resmi bir kurum mu, bakın.",
      "Bilgiyi AFAD, valilik, Kızılay ve İçişleri Bakanlığı'nın resmi hesaplarından doğrulayın.",
      "\"Saat şu kadarda büyük deprem olacak\" gibi mesajlara inanmayın. Depremin zamanı önceden bilinemez.",
      "Tarihi, yeri belli olmayan ve \"herkese iletin\" diyen mesajlara şüpheyle bakın.",
      "Fotoğraf ya da videonun eski, başka bir afetten ya da başka bir ülkeden olabileceğini unutmayın.",
      "Bir yardım çağrısını paylaşmadan önce kişiyi ve adresi doğrulayın. Eski çağrılar ekipleri boşa yorar.",
      "Dezenformasyonla Mücadele Merkezi'nin (DMM) açıklamalarına bakın.",
      "Yanlış bir şey paylaştıysanız silin ve doğrusunu paylaşın."
    ],
    "dont": [
      "Panik yaratan mesajları \"ne olur ne olmaz\" diye iletmeyin.",
      "Sesli mesajları ve ekran görüntülerini kaynak saymayın.",
      "Doğrulanmamış isim ve adresleri yardım çağrısı diye yaymayın."
    ],
    "keywords": [
      "yalan haber",
      "yanlış bilgi",
      "sahte haber",
      "dezenformasyon",
      "bu haber doğru mu",
      "deprem tahmini",
      "deprem olacak mı",
      "büyük deprem geliyor",
      "dmm",
      "paylaşmalı mıyım",
      "asılsız haber",
      "yalan haber nasil anlasilir",
      "yanlis bilgi"
    ],
    "sources": [
      "Cumhurbaşkanlığı İletişim Başkanlığı — Dezenformasyonla Mücadele Merkezi (DMM)",
      "AFAD — Resmi duyurular",
      "USGS — Can you predict earthquakes?"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: DMM'nin 2025–2026'da deprem ve AFAD iddialarını yalanlamayı sürdürdüğü (CNN Türk, TRT Haber haberleri); depremin önceden bilinemeyeceği USGS; değişiklik yok."
    },
    "art": [
      "guvenlik-paylasmadan-dur",
      "guvenlik-resmi-kaynak",
      "guvenlik-deprem-tahmin-yasak",
      null,
      "guvenlik-eski-foto",
      null,
      null,
      null
    ]
  }
];
