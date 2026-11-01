// Rehber kategorisi: Zehirlenme
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "zehirlenme",
  "title": "Zehirlenme",
  "hint": "Yutma, gaz, sokma · 114",
  "art": "cat-zehirlenme",
  "color": "#ab7df8",
  "order": 6
};

export const GUIDES: Guide[] = [
  {
    "id": "karbonmonoksit",
    "title": "Karbonmonoksit zehirlenmesi",
    "tag": "İLK YARDIM",
    "summary": "Soba, şofben, mangal ya da jeneratörden çıkan kokusuz gaz öldürebilir; hemen pencereleri açıp herkesi temiz havaya çıkarın ve 112'yi arayın.",
    "steps": [
      "Şüphelenirseniz hemen kapı ve pencereleri açın, herkesi temiz havaya çıkarın.",
      "Belirtiler: baş ağrısı, baş dönmesi, bulantı, kusma, halsizlik, uyku hali, bilinç bulanıklığı. Aynı yerde birkaç kişide birden olması uyarıcıdır.",
      "112'yi arayın.",
      "Güvenliyse sobayı, şofbeni, mangalı, ısıtıcıyı ya da jeneratörü söndürün.",
      "Bilinci kapalı ama nefes alıyorsa yan yatırın. Nefes almıyorsa kalp masajına başlayın.",
      "Belirtiler geçse bile hastaneye gidin.",
      "Önleme: evde, balkonda, çadırda, konteynerde ve kapalı yerde mangal, kömür, jeneratör ya da tüplü ısıtıcı kullanmayın.",
      "Soba, kombi, şofben ve bacayı her yıl yetkili ustaya temizletip kontrol ettirin. Bacalı şofbeni banyoya koydurmayın. Lodoslu havada sobayı çok dikkatli kullanın; baca tepebilir.",
      "Jeneratörü yalnızca açık havada, kapı, pencere ve menfezlerden en az 6 metre uzakta çalıştırın.",
      "Yatak odalarının yakınına pilli karbonmonoksit dedektörü takın, pilini düzenli kontrol edin."
    ],
    "dont": [
      "Kömür sobası yanarken uyumayın; sobanın havasını kısmayın.",
      "Jeneratörü kapı ve pencere açık olsa bile evin, garajın ya da çadırın içinde çalıştırmayın.",
      "Kapalı garajda ya da karla kapanmış araçta motoru çalışır hâlde beklemeyin.",
      "Baş ağrısını \"yorgunluktur\" diye geçiştirmeyin.",
      "Ortam havalandırılıp sağlık ekibi ya da itfaiye izin vermeden içeri geri dönmeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "karbonmonoksit",
      "karbon monoksit",
      "karbonmonoksit zehirlenmesi",
      "soba zehirlenmesi",
      "sobadan zehirlendi",
      "soba gazı",
      "kömür sobası",
      "mangal zehirlenmesi",
      "jeneratör",
      "gaz zehirlenmesi",
      "çadırda soba",
      "tüplü ısıtıcı",
      "baca tepti",
      "co dedektörü",
      "karbonmonoksit alarmi"
    ],
    "sources": [
      "CDC — Carbon Monoxide Poisoning: Basics",
      "NHS — Carbon monoxide poisoning",
      "Sağlık Bakanlığı — Karbonmonoksit Zehirlenmeleri",
      "Hacettepe Üniv. Halk Sağlığı AD — Soru ve Yanıtlarla Karbon Monoksit Zehirlenmeleri Bilgi Notu 2025/26 (halksagligi.hacettepe.edu.tr)",
      "MEB İlk Yardım — Zehirlenmelerde İlk Yardım modülü (eskisehirisg.meb.gov.tr aynası)",
      "Türk Kızılay Esenyurt İlk Yardım Eğitim Merkezi — Zehirlenmelerde ilk yardım"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Hacettepe Halk Sağlığı CO bilgi notu (kaynaklar: soba, şofben, kombi, baca, lodos; mangal ev/balkon/çadırda yok; jeneratör pencereden ≥6 m; yatak odasına pilli CO dedektörü; 112), MEB ve Kızılay ilk yardım (temiz hava, 112, derlenme pozisyonu, sağlık kuruluşuna nakil), CDC, NHS; şofben özete ve #4'e, balkon #7'ye eklendi; soba-şofben-baca bakımı ve lodos için yeni adım #8 eklendi." },
    "art": [
      "zehirlenme-co-temiz-hava",
      null,
      "call-112",
      null,
      "zehirlenme-co-yan-yatir",
      null,
      "zehirlenme-co-cadirda-mangal-yasak",
      null,
      "zehirlenme-jenerator-6-metre",
      "zehirlenme-co-dedektor"
    ],
    "alsoIn": [
      "barinma"
    ]
  },
  {
    "id": "zehirlenme",
    "title": "Zehirlenme (yutma, solunum, temas)",
    "tag": "ZEHİRLENME",
    "summary": "Kişiyi zehirden uzaklaştırın ve 114 Zehir Danışma ya da 112'yi arayın. Kendiliğinden kusturmayın.",
    "steps": [
      "Kendinizi tehlikeye atmadan kişiyi zehrin olduğu yerden uzaklaştırın. Gaz varsa temiz havaya çıkarın.",
      "Nefes almıyorsa 112'yi arayın ve kalp masajına başlayın.",
      "Ulusal Zehir Danışma Merkezi 114'ü ya da 112'yi arayın. Hangi maddenin, ne kadar ve ne zaman alındığını söyleyin.",
      "Ağızda kalan maddeyi tükürtün, ağzı suyla çalkalatın.",
      "Ciltle temas ettiyse giysileri çıkarın, bölgeyi bol akan suyla en az 15 dakika yıkayın.",
      "Göze kaçtıysa göz kapağını açık tutup gözü bol suyla, burun tarafından dışa doğru en az 15 dakika yıkayın.",
      "Maddenin kutusunu ya da şişesini hastaneye yanınızda götürün.",
      "Bilinci kapalı ama nefes alıyorsa yan yatırın (derlenme pozisyonu)."
    ],
    "dont": [
      "Kendiliğinden kusturmaya çalışmayın.",
      "Süt, yoğurt ya da başka bir \"panzehir\" vermeyin.",
      "114 ya da doktor söylemedikçe yiyecek ya da içecek vermeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "zehirlenme",
      "zehir",
      "zehirlendi",
      "zehirlendim",
      "zehirli madde",
      "zehir içti",
      "ilaç içti",
      "çok ilaç içti",
      "çamaşır suyu içti",
      "kimyasal içti",
      "zehirli bitki",
      "ilaç zehirlenmesi",
      "114",
      "uzem",
      "zehir danışma"
    ],
    "sources": [
      "UZEM — Ulusal Zehir Danışma Merkezi (114)",
      "NHS — Poisoning",
      "ABD EPA — First Aid in Case of Pesticide Exposure",
      "BfR — Risiko Vergiftungsunfälle bei Kindern",
      "MEB İlk Yardım — Zehirlenmelerde İlk Yardım modülü (eskisehirisg.meb.gov.tr aynası)",
      "Türk Kızılay Esenyurt İlk Yardım Eğitim Merkezi — Zehirlenmelerde ilk yardım"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB ilk yardım modülü ve Kızılay (kesinlikle kusturma yok, yiyecek-içecek verme, 114 UZEM 24 saat, 112, derlenme pozisyonu; cilt 20 dk, göz 10 dk yıkama — rehberdeki 'en az 15 dk' ile çelişmiyor), değişiklik yok. Önceki: NHS Poisoning (kusturma, yiyecek-içecek verme, ambalajı götür, derlenme pozisyonu, CPR), EPA (göz/cilt en az 15 dk), BfR (kusturma yok)." },
    "art": [
      null,
      "zehirlenme-kpr",
      "call-114",
      null,
      "flush-water-15",
      "zehirlenme-goz-yika",
      "zehirlenme-kutuyu-goster",
      "zehirlenme-yan-yatir"
    ]
  },
  {
    "id": "zehirlenme-mantar",
    "title": "Yabani mantar zehirlenmesi",
    "tag": "ZEHİRLENME",
    "summary": "Yabani mantar yedikten sonra bulantı, kusma, ishal ya da baş dönmesi olursa beklemeden acil servise gidin; 114'ü arayın.",
    "steps": [
      "Yabani mantar yedikten sonra bulantı, kusma, karın ağrısı, ishal, terleme ya da baş dönmesi başlarsa hemen en yakın acil servise gidin.",
      "Bilinç bulanıklığı, nöbet ya da durmayan kusma varsa 112'yi arayın. Danışmak için 114'ü arayın.",
      "Aynı yemekten yiyen herkesi, belirtisi olmasa bile hastaneye götürün.",
      "Kalan mantarı, yemeği ya da artıklarını bir poşete koyup yanınızda götürün. Mümkünse fotoğrafını çekin.",
      "Mantarı ne zaman yediğinizi ve belirtilerin ne zaman başladığını doktora söyleyin.",
      "Belirtilerin yemekten 6 saat ya da daha sonra başlaması en tehlikeli türlerin işareti olabilir. Hemen hastaneye gidin.",
      "Kusma ve ishal geçse bile iyileştiğinizi düşünmeyin. Karaciğer ve böbrek hasarı sessizce sürebilir; doktor söylemeden hastaneden ayrılmayın.",
      "Önleme: doğadan mantar toplamayın, yemeyin. Bandrollü, etiketli kültür mantarı alın."
    ],
    "dont": [
      "Kusturmaya çalışmayın; süt, yoğurt, ayran ya da halk ilacı vermeyin.",
      "Gümüş kaşık, soğan ya da sirke gibi \"zehirli mi\" testlerine güvenmeyin; işe yaramaz.",
      "Pazarda ya da yol kenarında satılan yabani mantarı almayın.",
      "Pişirmenin zehri yok ettiğini sanmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "mantar",
      "mantar zehirlenmesi",
      "mantar zehirlenmesi belirtileri",
      "yabani mantar",
      "zehirli mantar",
      "mantar yedik",
      "mantar yedi kusuyor",
      "dağdan mantar topladık",
      "ormandan mantar",
      "köy mantarı",
      "mantar zehirlenmesi ne yapmali",
      "mantar zehirlenmesi kac saatte"
    ],
    "sources": [
      "T.C. Sağlık Bakanlığı — Mantar zehirlenmelerine karşı uyarı (haberturk.com, 14.05.2019)",
      "Düzce İl Sağlık Müdürlüğü — mantar uyarısı (ntv.com.tr, 06.05.2025)",
      "UZEM — Ulusal Zehir Danışma Merkezi (114)",
      "NHS — Poisoning",
      "Mushroom poisoning (Wikipedia, kaynaklı derleme): gümüş testi, pişirme ve amatoksin gecikmesi"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı uyarısı (Habertürk 14.05.2019: belirtiler 2–6 saatte; bazı türlerde 6 saat sonra karaciğer-böbrek bozukluğu, ölüm; doğadan mantar yemeyin, bandrollü kültür mantarı; 114 UZEM 7/24, panzehir hastanelerde), Düzce İl Sağlık Müdürlüğü (NTV 06.05.2025, aynı metin); '6 saat ya da daha sonra' eşiği Bakanlık metniyle uyumlu, değişiklik yok. Önceki: amatoksinde 6–12 saat belirtisiz dönem ve sonrası karaciğer hasarı; 'zehirli mantar gümüşü karartır' ve 'pişirince zararsız olur' inançları yanlış (α-amanitin ısıya dayanıklı); NHS kusturmama. Sağlık Bakanlığı sayfasına bu turda erişilemedi." },
    "art": [
      "zehirlenme-mantar-acil",
      "call-114",
      null,
      "zehirlenme-mantar-ornek",
      null,
      "zehirlenme-mantar-saat",
      null,
      "zehirlenme-mantar-toplama-yasak"
    ],
    "alsoIn": [
      "doga"
    ]
  },
  {
    "id": "zehirlenme-gida",
    "title": "Gıda zehirlenmesi (ishal, kusma)",
    "tag": "ZEHİRLENME",
    "summary": "Bol sıvı alın ve dinlenin; kanlı ishal, yüksek ateş, sıvı tutamama ya da susuzluk belirtisi varsa doktora gidin.",
    "steps": [
      "Sık sık, küçük yudumlarla su için. Eczaneden ağızdan sıvı tuzu (ORS) alıp paketteki tarife göre hazırlayın.",
      "Kusma varsa birkaç dakika bekleyip yine az az içmeye devam edin.",
      "Dinlenin. İştahınız gelince pilav, muz, haşlanmış patates, ekmek gibi hafif şeyler yiyin.",
      "Bebeği emzirmeye ve çocuğa sıvı vermeye devam edin.",
      "Tuvaletten sonra ve yemekten önce ellerinizi sabunla yıkayın. Hasta kişi başkasına yemek hazırlamasın.",
      "Kanlı ishal, 3 günden uzun süren ishal, 39 dereceye yakın ya da daha yüksek ateş, sıvı tutamayacak kadar kusma varsa doktora gidin.",
      "Susuzluk belirtisi varsa hemen sağlık kuruluşuna gidin: çok az idrar, ağız kuruluğu, ayağa kalkınca baş dönmesi.",
      "Bebek, yaşlı, hamile ve kronik hastalar daha çabuk kötüleşir; onları erken doktora götürün.",
      "Çift ya da bulanık görme, göz kapağı düşmesi, yutma ya da konuşma güçlüğü, kas güçsüzlüğü ya da nefes darlığı olursa hemen 112'yi arayın. Bu botulizm olabilir.",
      "Şüpheli yiyeceği atın. Aynı yemeği yiyen başkaları da hastaysa sağlık kuruluşuna bildirin."
    ],
    "dont": [
      "Doktor önermeden ishal kesici ya da antibiyotik kullanmayın.",
      "Kola, gazoz ya da hazır meyve suyunu sıvı tuzu yerine koymayın.",
      "Kapağı şişmiş, kabarmış ya da köpüren konserveyi tatmayın; açmadan atın."
    ],
    "keywords": [
      "gıda zehirlenmesi",
      "gida zehirlenmesi",
      "besin zehirlenmesi",
      "yemekten zehirlendik",
      "yemekten zehirlendim",
      "bozuk yemek",
      "bozuk yiyecek yedi",
      "ishal",
      "kusma ishal",
      "mide bulantısı",
      "karın ağrısı ishal",
      "botulizm",
      "konserve zehirlenmesi",
      "tavuktan zehirlendi"
    ],
    "sources": [
      "CDC — Symptoms of Food Poisoning",
      "CDC — Botulism: Signs and Symptoms",
      "CDC — Preventing Botulism",
      "WHO — Diyare ve ağızdan sıvı tedavisi (ORS)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: CDC gıda zehirlenmesi (kanlı ishal, >3 gün, >102°F≈38,9 °C ateş, sıvı tutamama, susuzluk belirtileri); CDC botulizm (çift/bulanık görme, göz kapağı düşmesi, yutma-konuşma güçlüğü, kas güçsüzlüğü, nefes güçlüğü = acil; toksin tadılamaz, şüphede at)." },
    "art": [
      "zehirlenme-gida-yudum-su",
      null,
      null,
      null,
      "wash-hands",
      "zehirlenme-gida-doktor",
      null,
      null,
      "call-112",
      "zehirlenme-gida-konserve-at"
    ],
    "alsoIn": [
      "su-gida"
    ]
  },
  {
    "id": "zehirlenme-cocuk-yutma",
    "title": "Çocuk ilaç ya da temizlik maddesi yuttu",
    "tag": "ZEHİRLENME",
    "summary": "Ağzında kalanı çıkarın, hemen 114 Zehir Danışma'yı ya da 112'yi arayın; kusturmayın, süt vermeyin.",
    "steps": [
      "Ürünü çocuğun elinden alın. Ağzında kalanı parmağınızla nazikçe çıkarın.",
      "Hemen 114'ü arayın. Nefes almakta zorlanıyorsa, bilinci bulanıksa ya da nöbet geçiriyorsa 112'yi arayın.",
      "Kutuyu ya da şişeyi elinizde tutun: ürünün adını, ne kadar ve ne zaman yuttuğunu, çocuğun yaşını ve kilosunu söyleyin.",
      "Düğme pil ya da mıknatıs yuttuysa, burnuna ya da kulağına soktuysa hemen acil servise gidin. Düğme pil 2 saat içinde yemek borusunu yakabilir; belirti çıkmasını beklemeyin.",
      "Ağzını suyla çalkalatıp tükürtün.",
      "Göze kaçtıysa bol akan suyla 15 dakika yıkayın. Cilde döküldüyse giysiyi çıkarıp cildi yıkayın.",
      "Hastaneye giderken ürünün kutusunu ya da fotoğrafını yanınızda götürün.",
      "Bilinci kapalı ama nefes alıyorsa yan yatırın. Nefes almıyorsa 112'yi arayıp görevlinin söylediği gibi temel yaşam desteğine başlayın.",
      "Önleme: ilaçları ve temizlik ürünlerini kilitli, yüksek bir dolapta, kendi kabında saklayın."
    ],
    "dont": [
      "Kusturmayın; boğazına parmak sokmayın, tuzlu su vermeyin.",
      "Süt, yoğurt ya da başka \"panzehir\" vermeyin.",
      "Belirti yok diye beklemeyin; bazı ilaçlar saatler sonra etki eder.",
      "Çamaşır suyu, kireç çözücü gibi ürünleri su ya da meşrubat şişesine koymayın."
    ],
    "callEmergency": true,
    "keywords": [
      "çocuk yuttu",
      "cocuk yuttu",
      "bebek yuttu",
      "çocuk ilaç yuttu",
      "çocuk ilaç içti",
      "çocuk çamaşır suyu içti",
      "çocuk deterjan yuttu",
      "bulaşık tableti yuttu",
      "çocuk pil yuttu",
      "düğme pil",
      "mıknatıs yuttu",
      "çocuk zehirlendi",
      "kireç çözücü içti",
      "çocuk kolonya içti"
    ],
    "sources": [
      "UZEM — Ulusal Zehir Danışma Merkezi (114)",
      "BfR (Alman Federal Risk Değerlendirme Enstitüsü) — Çocukları zehirlenmelerden koruyun / Risiko Vergiftungsunfälle bei Kindern",
      "National Capital Poison Center (ABD) — Button Battery Ingestion Triage and Treatment Guideline",
      "NHS — Poisoning"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB ilk yardım modülü ve Kızılay (kusturma yok, yiyecek-içecek verme, 114 UZEM, 112), değişiklik yok; düğme pil ayrıntıları için Türk kaynağı bulunamadı. Önceki: NCPC düğme pil kılavuzu (yemek borusunda ~2 saatte ciddi yanık, belirti olmasa da hemen röntgen/acil, kusturma yok, mıknatıs eşlik ederse risk artar), BfR (kusturmayın, pilde röntgen her zaman gerekli, burun-ağız kontrolü), NHS Poisoning." },
    "art": [
      null,
      "call-114",
      "zehirlenme-cocuk-kutu",
      "zehirlenme-dugme-pil",
      null,
      null,
      null,
      "zehirlenme-cocuk-yan-yatir",
      "zehirlenme-kilitli-dolap"
    ],
    "alsoIn": [
      "ozel-gruplar"
    ]
  },
  {
    "id": "zehirlenme-metanol",
    "title": "Sahte içki (metil alkol) zehirlenmesi",
    "tag": "ZEHİRLENME",
    "summary": "Kaçak ya da şüpheli içki içtikten sonra görme bozukluğu, bulantı, karın ağrısı ya da nefes darlığı olursa hemen 112'yi arayın; belirtiler saatlerce, bazen bir günden fazla gecikebilir.",
    "steps": [
      "Kaçak, bandrolsüz ya da şüpheli içki içtiyseniz ve kendinizi kötü hissediyorsanız hemen 112'yi arayın ya da acile gidin.",
      "Belirtiler: bulanık ya da sisli görme, ışığa hassasiyet, bulantı, kusma, karın ağrısı, baş dönmesi, hızlı ve derin nefes.",
      "Belirtiler genellikle içtikten 6–24 saat sonra başlar; normal alkolle birlikte içildiyse 30 saate kadar gecikebilir. \"Akşamdan kalmalık\" sanıp beklemeyin; erken tedavi görmeyi ve hayatı kurtarır.",
      "Aynı şişeden içen herkese haber verin. Belirtisi olmasa da hastaneye gitsinler.",
      "Doktora ne içtiğinizi, ne zaman ve nereden aldığınızı açıkça söyleyin.",
      "Kalan içkiyi ve şişeyi atmayın; hastaneye ya da yetkililere verin.",
      "Bilinci kapalı ama nefes alıyorsa yan yatırın. Nefes almıyorsa kalp masajına başlayın.",
      "Önleme: yalnızca bandrollü, kapağı açılmamış, ruhsatlı yerden alınmış içki için. Sahte içki tadından, kokusundan ya da renginden anlaşılmaz; çok ucuz ve kaynağı belirsiz içkiden uzak durun."
    ],
    "dont": [
      "Belirtileri geçirmek için yeniden alkol içmeyin; tedaviyi hastane yapar.",
      "Kusturmaya çalışmayın; süt, ayran ya da yoğurt vermeyin.",
      "Kolonya, el dezenfektanı ya da temizlik alkolünü asla içmeyin.",
      "Utandığınız için hastaneye gitmeyi ertelemeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "sahte içki",
      "sahte icki",
      "sahte alkol",
      "metil alkol",
      "metanol",
      "kaçak içki",
      "kacak icki",
      "bandrolsüz rakı",
      "sahte rakı",
      "içkiden zehirlendi",
      "içki içti gözü görmüyor",
      "alkol zehirlenmesi",
      "kolonya içti"
    ],
    "sources": [
      "Methanol toxicity (Wikipedia, kaynaklı tıbbi derleme)",
      "NHS — Poisoning",
      "MSF — Methanol Poisoning Initiative (önceki kontrol; bu turda erişilemedi)",
      "UZEM — Ulusal Zehir Danışma Merkezi (114)",
      "Prof. Dr. Ahmet Aydın (Yeditepe Üniv. Farmasötik Toksikoloji) / DHA, 15.12.2025 — belirtiler en erken 6 saat sonra, görme bulanıklığı ilk belirti, tat-koku-renkten anlaşılmaz",
      "Doç. Dr. Aynur Şahin (KTÜ Acil Tıp, tıbbi toksikolog) / Diken, 21.12.2021 — etil alkolle birlikte alınırsa belirtiler 30 saate kadar gecikebilir; bandrol-barkod kontrolü; tadından anlaşılmaz"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Prof. Dr. Ahmet Aydın/DHA 2025, Doç. Dr. Aynur Şahin/Diken 2021 (Türk toksikologlar); #3 '12–24 saat' → '6–24 saat, normal alkolle birlikte 30 saate kadar', özet buna göre genelleştirildi; #8 'kokusu ya da tadı tuhaf içkiden uzak durun' → 'tadından, kokusundan ya da renginden anlaşılmaz' (eski ifade tadı normalse güvenli sanılmasına yol açabilirdi). Sağlık Bakanlığı/UZEM metni bulunamadı. Önceki: methanol toxicity derlemesi (görme bulanıklığı, ışığa hassasiyet, kar fırtınası görme; görme bozukluğu 12. saatten itibaren, ikinci evre 10–30 saat; tedavi hastanede fomepizol/etanol), NHS Poisoning (kusturma yok). MSF/WHO sayfalarına bu turda erişilemedi." },
    "art": [
      "call-112",
      "zehirlenme-metanol-bulanik-gorme",
      null,
      "zehirlenme-ayni-sise",
      null,
      null,
      "zehirlenme-metanol-yan-yatir",
      "zehirlenme-bandrol-kontrol"
    ]
  },
  {
    "id": "zehirlenme-tarim-ilaci",
    "title": "Tarım ilacı (pestisit) zehirlenmesi",
    "tag": "ZEHİRLENME",
    "summary": "Kişiyi ilaçlı alandan çıkarın, bulaşan giysileri çıkarıp cildi sabunlu suyla yıkayın, ilacın etiketiyle 114'ü ya da 112'yi arayın.",
    "steps": [
      "Kişiyi ilaçlanan tarladan, seradan ya da depodan temiz havaya çıkarın. Korunmasız içeri girmeyin.",
      "Bilinci kapalıysa, nefes almakta zorlanıyorsa ya da nöbet geçiriyorsa 112'yi arayın.",
      "Diğer durumlarda 114 Zehir Danışma'yı arayın. İlacın etiketini okuyun ya da fotoğrafını çekin.",
      "Eldiven giyip bulaşan giysi ve ayakkabıları çıkarın.",
      "Cildi ve saçı bol su ve sabunla iyice yıkayın.",
      "Göze kaçtıysa göz kapağını açık tutup temiz akan suyla en az 15 dakika yıkayın.",
      "Yuttuysa ağzını çalkalatın. Etiket ya da 114 söylemedikçe kusturmayın.",
      "Şu belirtilerde hemen 112'yi arayın: aşırı terleme, salya, kusma, ishal, kas seğirmesi, nefes darlığı.",
      "Bulaşmış giysileri ayrı yıkayın ya da atın.",
      "Önleme: ilacı kendi kabında, kilitli yerde saklayın. Boş ilaç kutusunu su ya da yiyecek kabı yapmayın."
    ],
    "dont": [
      "Kendinizi korumadan ilaçlı alana ya da kapalı depoya girmeyin.",
      "Süt, yoğurt ya da ayran vermeyin.",
      "İlaçlama yaparken yemek yemeyin, su içmeyin, sigara içmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "tarım ilacı",
      "tarim ilaci",
      "pestisit",
      "böcek ilacı",
      "bocek ilaci",
      "zirai ilaç",
      "ilaçlama zehirlenmesi",
      "tarla ilaçladı fenalaştı",
      "serada zehirlendi",
      "fare zehiri",
      "ot ilacı",
      "haşere ilacı içti",
      "ilaçlamadan sonra fenalaştı"
    ],
    "sources": [
      "ABD EPA — First Aid in Case of Pesticide Exposure",
      "UZEM — Ulusal Zehir Danışma Merkezi (114)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: EPA First Aid in Case of Pesticide Exposure (temiz hava, korunmasız girme, giysi çıkar, cilt-saç sabunlu su, göz en az 15 dk, etiket ya da zehir danışma söylemedikçe kusturma, bilinç kaybı/nefes güçlüğü/nöbette acil)." },
    "art": [
      "zehirlenme-tarla-temiz-hava",
      null,
      "zehirlenme-pestisit-etiket",
      "zehirlenme-eldivenle-giysi-cikar",
      null,
      "zehirlenme-tarim-goz-yika",
      null,
      null,
      null,
      "zehirlenme-pestisit-kilitli"
    ]
  }
];
