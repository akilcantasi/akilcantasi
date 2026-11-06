// Rehber kategorisi: Yaralanma ve hastalık
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "yaralanma",
  "title": "Yaralanma ve hastalık",
  "hint": "Yanık, kırık, göz, baş, ateş, ishal",
  "art": "cat-yaralanma",
  "color": "#fb7185",
  "order": 1.5
};

const CHECKED = '2026-11-01';

export const GUIDES: Guide[] = [
  {
    "id": "burun-kanamasi",
    "title": "Burun kanaması",
    "tag": "YARALANMA",
    "summary": "Oturup öne eğilin ve burnun yumuşak kısmını 10–15 dakika bırakmadan sıkın.",
    "steps": [
      "Kişiyi oturtun ve başını öne eğdirin.",
      "Burnun yumuşak kısmını, burun deliklerinin hemen üstünden iki parmakla sıkın.",
      "Ağzından nefes almasını, ağzına gelen kanı yutmayıp tükürmesini söyleyin.",
      "10–15 dakika hiç bırakmadan sıkmaya devam edin.",
      "15 dakika sonra hâlâ kanıyorsa sıkmayı sürdürün ve sağlık kuruluşuna gidin ya da 112'yi arayın.",
      "Kanama çok fazlaysa, kişi halsiz ya da başı dönüyorsa, nefes almakta zorlanıyorsa ya da kanama başa darbeden sonra başladıysa hemen 112'yi arayın.",
      "Kanama durunca 24 saat burnunu sümkürmesin, kurcalamasın, sıcak içecek ve alkol içmesin, ağır kaldırmasın."
    ],
    "dont": [
      "Başı geriye yatırmayın; kan yutulur ve kusturabilir.",
      "Kişiyi sırtüstü düz yatırmayın.",
      "Burnun içine pamuk ya da kâğıt tıkıştırmayın.",
      "Kanama durdu mu diye sık sık bırakıp bakmayın."
    ],
    "keywords": [
      "burun kanaması",
      "burnum kanıyor",
      "burnu kanıyor",
      "burundan kan geliyor",
      "burun kanamasi",
      "burun kanıyor",
      "burnundan kan",
      "burun kanaması durmuyor",
      "çocuğun burnu kanıyor"
    ],
    "sources": [
      "ERC Kılavuzları 2021 — İlk Yardım",
      "NHS — Nosebleed",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı Temel İlkyardım Kitabı 2011 (oturtma, başı öne eğme, burun kanatlarını sıkma; kitapta 5 dk), NHS Nosebleed (10–15 dk). Daha uzun süre güvenlik açısından korundu; değişiklik yok." },
    "art": [
      "yaralanma-burun-one-egil",
      "yaralanma-burun-sikma",
      null,
      "yaralanma-burun-sure",
      "call-112",
      null,
      null
    ]
  },
  {
    "id": "yanik",
    "title": "Yanık",
    "tag": "YARALANMA",
    "summary": "Yanığı hemen serin, akan suyla 20 dakika soğutun ve streç filmle ya da temiz bir örtüyle gevşekçe kapatın.",
    "steps": [
      "Kişiyi ısı kaynağından uzaklaştırın. Giysisi yanıyorsa yere yatırıp yuvarlayın ya da battaniyeyle söndürün.",
      "Yanığı hemen serin, akan suyla 20 dakika soğutun. Aradan zaman geçtiyse de (3 saate kadar) soğutun.",
      "Yüzük, saat, bilezik gibi sıkan eşyaları şişlik başlamadan çıkarın.",
      "Yanığa yapışmamış giysileri çıkarın. Yapışanları olduğu gibi bırakın.",
      "Soğuttuktan sonra yanığı streç filmle ya da temiz, tüy bırakmayan bir bezle gevşekçe örtün.",
      "Kişiyi üşütmeyin. Yanık olmayan yerlerini örtün. Bu, özellikle çocuklarda önemlidir.",
      "Kişinin avucundan büyük yanıklarda, beyaz ya da kömürleşmiş yanıklarda, yüz, el, ayak, eklem ve cinsel bölge yanıklarında ve küçük çocuklarda 112'yi arayın.",
      "Elektrik ve kimyasal yanıklarında 112'yi arayın.",
      "Kimyasal yanıkta mümkünse eldiven takın, kuru tozu silkeleyin, bulaşmış giysiyi çıkarın ve bol, akan suyla en az 20 dakika, yardım gelene kadar yıkayın.",
      "Dumandan etkilendiyse, sesi kısıldıysa ya da nefes darlığı varsa hemen 112'yi arayın."
    ],
    "dont": [
      "Buz ya da buzlu su koymayın.",
      "Diş macunu, yoğurt, tereyağı, salça, yağ sürmeyin.",
      "Su toplamış kabarcıkları patlatmayın.",
      "Yanığa pamuk ya da tüylü bez koymayın.",
      "Elektrik çarpan kişiye akım kesilmeden dokunmayın."
    ],
    "critical": true,
    "keywords": [
      "yanık",
      "yandı",
      "elim yandı",
      "yanma",
      "haşlandı",
      "kaynar su döküldü",
      "sıcak su döküldü",
      "yağ sıçradı",
      "alev aldı",
      "yanık su topladı",
      "yanik",
      "kimyasal yanık",
      "elektrik yanığı",
      "elektrik çarpması",
      "ütü yanığı",
      "soba yanığı"
    ],
    "sources": [
      "ERC Kılavuzları 2021 — İlk Yardım (yanık soğutma 20 dk)",
      "NHS — Burns and scalds",
      "NHS — Acid and chemical burns",
      "ICRC — First Aid",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)",
      "Türk Kızılay — yanık ilk yardım açıklaması (DHA, 2025)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı Temel İlkyardım Kitabı 2011 (musluk suyu altında en az 20 dk; kimyasalda en az 15–20 dk yıkama, giysiyi çıkarma), ehliyet ilk yardım müfredatı (en az 20 dk, buz yok, kabarcık patlatmama, yapışan giysi, diş macunu/yağ yok), Türk Kızılay açıklaması (15–20 dk; yoğurt, diş macunu, yumurta akı yok); NHS. ERC 2025 yanık soğutmayı kapsamından çıkardı (ILCOR: süre belirtilmiyor). Değişiklik yok." },
    "art": [
      "yaralanma-yanik-yuvarlanma",
      "yaralanma-yanik-sogutma",
      "remove-rings",
      null,
      "yaralanma-yanik-strec",
      "yaralanma-yanik-ortme",
      "call-112",
      null,
      null,
      null
    ]
  },
  {
    "id": "kirik-burkulma",
    "title": "Kırık, çıkık ve burkulma",
    "tag": "YARALANMA",
    "summary": "Yaralı bölgeyi düzeltmeye çalışmadan, bulduğunuz şekilde sabitleyin.",
    "steps": [
      "Kişiyi gereksiz yere hareket ettirmeyin.",
      "Açık yara varsa üzerini temiz bir bezle örtün. Kemik görünüyorsa üstüne değil, çevresine bastırın.",
      "Yaralı bölgeyi bulduğunuz şekilde sabitleyin. Düzeltmeye çalışmayın.",
      "Tahta, karton ya da katlanmış dergiyle atel yapın. Kırığın altındaki ve üstündeki eklemleri de içine alın.",
      "Ateli sıkı ama kan dolaşımını kesmeyecek şekilde bağlayın. Parmak uçlarının rengini ve hissini kontrol edin.",
      "Burkulmada ilk 2–3 gün bölgeyi dinlendirin. Beze sarılı buzu 2–3 saatte bir, en fazla 20 dakika uygulayın.",
      "Burkulan yeri gün içinde hafifçe sarın ve mümkün olduğunca yastık üstünde yukarıda tutun.",
      "Boyun, sırt, kalça ya da uyluk kırığı şüphesinde kişiyi kımıldatmayın ve 112'yi arayın.",
      "Kırılma sesi duyulduysa, şekil bozukluğu, uyuşma, morarma ya da soğukluk varsa, hiç yük veremiyorsa sağlık kuruluşuna gidin. Kemik deriden dışarı çıktıysa ya da kanama çoksa 112'yi arayın."
    ],
    "dont": [
      "Kırık ya da çıkık kemiği yerine oturtmaya çalışmayın.",
      "Buzu doğrudan cilde koymayın.",
      "İlk günlerde yaralı bölgeyi ovmayın, masaj yapmayın, sıcak uygulamayın.",
      "Yaralının yaralı uzvu üzerine yük vermesine izin vermeyin."
    ],
    "keywords": [
      "kırık",
      "kırıldı",
      "kolum kırıldı",
      "kolu kırıldı",
      "bacağı kırıldı",
      "kemik kırığı",
      "çıkık",
      "omzum çıktı",
      "burkulma",
      "burkuldu",
      "ayak bileği burkuldu",
      "bileğim burkuldu",
      "incinme",
      "atel",
      "atel nasıl yapılır",
      "kirik",
      "burkulma sislik"
    ],
    "sources": [
      "ERC Kılavuzları 2021 — İlk Yardım",
      "NHS — Sprains and strains",
      "NHS — Broken arm or wrist",
      "Mayo Clinic — Fractures: First aid",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ehliyet ilk yardım müfredatı (ateli üst ve alt eklemi içine alacak şekilde, sıkı ama dolaşımı kesmeden, parmak ucu renk/ısı/his kontrolü, açık kırıkta temiz bez ve kemiği itmeme, çıkığı oturtmama, burkulmada soğuk-yükseltme-bandaj), NHS, Mayo. ERC 2025 bu konuları kapsamından çıkardı. Değişiklik yok." },
    "art": [
      null,
      "yaralanma-kirik-acik-yara",
      null,
      "yaralanma-kirik-atel",
      null,
      "cold-compress",
      "yaralanma-kirik-yukari",
      "call-112",
      null
    ]
  },
  {
    "id": "ezilme-yaralanmasi",
    "title": "Ezilme yaralanması (uzun süre sıkışma)",
    "tag": "YARALANMA",
    "summary": "Uzun süre ağır yük altında kalan kişi, yük kalkınca aniden kötüleşebilir; mümkünse sağlık ekibiyle birlikte kurtarın.",
    "steps": [
      "112'yi arayın. \"Uzun süre sıkışmış yaralı var\" deyin.",
      "Kişiyle konuşun, sakinleştirin. Ne kadar süredir sıkışık olduğunu öğrenip not edin.",
      "Bilin: Kol ya da bacak uzun süre ezilirse, yük kalkınca biriken zararlı maddeler kana karışır. Bu, kalbi durdurabilir ve böbrekleri bozabilir.",
      "Sağlık ekibine ulaşmak mümkünse, uzun süre ezilmiş uzvun üzerindeki yükü onlar gelmeden kaldırmayın. Ekip kurtarmadan önce tedaviye başlayabilir.",
      "Ortam tehlikeliyse (yangın, çökme, su) ya da sağlık ekibine ulaşılamıyorsa kişiyi yine de kurtarın. Onu tehlikede bırakmayın.",
      "Kurtardıktan sonra kişiyi yatırın, üstünü örtün, hareketsiz tutun. Kanayan yere bastırın.",
      "Kişi iyi görünse bile mutlaka hastaneye ulaştırın. Durumu saatler içinde ağırlaşabilir.",
      "Koyu renkli idrar, idrar yapamama, halsizlik ya da düzensiz nabız tehlike işaretidir; sağlık ekibine söyleyin.",
      "Bilinci kapanır ve normal nefes almazsa temel yaşam desteğine (kalp masajı) başlayın."
    ],
    "dont": [
      "Kişi iyi görünüyor diye hastaneye götürmekten vazgeçmeyin.",
      "Ezilen uzvu ovmayın, masaj yapmayın, ısıtmayın.",
      "Sağlık ekibi ulaşılabilirken uzun süre ezilmiş uzvun üzerindeki yükü aceleyle kaldırmayın.",
      "Kurtarma sırasında kendi güvenliğinizi tehlikeye atmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "ezilme",
      "ezildi",
      "crush",
      "crush sendromu",
      "ezilme sendromu",
      "sıkışma",
      "sıkıştı",
      "sıkışmış",
      "bacağı sıkıştı",
      "kolu sıkıştı",
      "altında kaldı",
      "ağır yük",
      "enkaz yaralısı",
      "böbrek",
      "koyu idrar"
    ],
    "sources": [
      "Türk Kızılay — İlk Yardım",
      "Sağlık Bakanlığı — UMKE Eğitim Materyalleri",
      "ERC Kılavuzları 2021 — İlk Yardım",
      "Sever MS ve ark., NEJM 2006 — Management of crush-related injuries after disasters (ikincil özet)",
      "ERA — Crush önerileri (Türkçe tam metin)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ERA/ISN Crush Önerileri Türkçe tam metin (Sever ve ark.; çıkarma işlemi uzman kurtarıcılara bırakılır, kurtarma zamanı sağlık ekibiyle planlanır, kurtarma öncesi damar yolundan sıvı sağlık ekibince, turnike yalnız hayati kanamada, taburcu sonrası 3 gün idrar rengi/miktarı izlemi), UMKE sunumu aktaran Türkiye Gazetesi haberi (enkaz kaldırma profesyonel ekiplerce). ERC 2025 ezilmeyi ele almıyor. Değişiklik yok; ağızdan sıvı konusu uzmana bırakıldı." },
    "art": [
      "call-112",
      "yaralanma-ezilme-saat-not",
      null,
      "yaralanma-ezilme-bekleme",
      null,
      "yaralanma-ezilme-ortme",
      null,
      null,
      "yaralanma-ezilme-kpr"
    ]
  },
  {
    "id": "yaralanma-bas-travmasi",
    "title": "Başa darbe, kafa travması ve beyin sarsıntısı",
    "tag": "YARALANMA",
    "summary": "Başını çarpan kişiyi dinlendirin ve en az 24 saat yalnız bırakmayın; tehlike belirtilerinden biri varsa hemen 112'yi arayın.",
    "steps": [
      "Bayıldıysa ve uyanmıyorsa, uyanık kalamıyorsa ya da nöbet geçiriyorsa hemen 112'yi arayın.",
      "Boyun da yaralanmış olabilir. Kişiyi gereksiz yere kımıldatmayın, başını ve boynunu düz tutun.",
      "Şu durumlarda da 112'yi arayın: 1 metreden ya da 5 basamaktan yüksek bir yerden düşme, trafik kazası gibi hızlı darbe, kulak ya da burundan açık renkli sıvı, kulaktan kan ya da kulak arkasında morluk, kafada çökme ya da yarada cisim, yeni uyuşma ya da güçsüzlük.",
      "Görme ya da işitme bozulduysa, yürüme, denge, konuşma ya da anlama bozulduysa, davranışı değiştiyse ya da 1 yaşından küçük bebeğin başında şişlik, morluk ya da kesik varsa yine 112'yi arayın.",
      "Kusuyorsa, başı dönüyorsa, kan sulandırıcı ilaç kullanıyorsa ya da darbe sırasında alkollüyse sağlık kuruluşuna götürün.",
      "Oyunu, sporu ya da işi hemen bıraktırın ve dinlendirin.",
      "Şişen yere beze sarılı soğuk uygulayın.",
      "İlk 24 saat yanında bir yetişkin kalsın. Baş ağrısı artarsa, kusma başlarsa ya da uyandırmak zorlaşırsa hemen 112'yi arayın.",
      "İyileşene kadar araç kullanmasın, alkol almasın. En az 3 hafta temaslı spor yapmasın."
    ],
    "dont": [
      "Başını çarpan kişiyi ilk 24 saat yalnız bırakmayın.",
      "Kendisi araç kullanarak hastaneye gitmesine izin vermeyin.",
      "Alkol ya da uyku ilacı vermeyin.",
      "Kafaya saplanmış bir cisim varsa çıkarmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "başını çarptı",
      "kafasını çarptı",
      "kafasını vurdu",
      "başını vurdu",
      "kafa travması",
      "kafa darbesi",
      "beyin sarsıntısı",
      "başa darbe",
      "kafasına bir şey düştü",
      "kafasi carpti",
      "basini vurdu",
      "kafa üstü düştü",
      "başını yere vurdu",
      "kafasında şişlik"
    ],
    "sources": [
      "ERC Kılavuzları 2025 — İlk Yardım (beyin sarsıntısı)",
      "NHS — Head injury and concussion"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ehliyet ilk yardım müfredatı (bilinç kontrolü, baş-boyun-gövde aynı hizada, ağızdan bir şey vermeme), ERC 2025 First Aid (sarsıntıda aktiviteden çıkarma ve sağlık profesyoneline yönlendirme), NHS. Değişiklik yok." },
    "art": [
      "call-112",
      "yaralanma-bas-boyun-sabitleme",
      null,
      null,
      null,
      "yaralanma-bas-dinlenme",
      "yaralanma-bas-soguk",
      "yaralanma-bas-refakat",
      null
    ]
  },
  {
    "id": "yaralanma-omurga",
    "title": "Boyun ve sırt (omurga) yaralanması şüphesi",
    "tag": "YARALANMA",
    "summary": "Yüksekten düşme, trafik kazası ya da sığ suya atlama sonrası kişiyi kımıldatmayın, başını sabit tutun ve 112'yi arayın.",
    "steps": [
      "112'yi arayın.",
      "Kişiye kıpırdamamasını söyleyin. Tehlike yoksa olduğu yerden taşımayın.",
      "Başının arkasına diz çökün. İki elinizle başını iki yandan nazikçe tutun; baş gövdeyle düz bir çizgide kalsın.",
      "Başı zorla düzeltmeye çalışmayın. Kişi direniyorsa ya da ağrı artıyorsa olduğu gibi tutun.",
      "Üstünü örtün, üşütmeyin. Konuşarak sakin tutun.",
      "Boyun ya da sırt ağrısı, kol ve bacaklarda uyuşma, karıncalanma ya da güçsüzlük olup olmadığını sorun; sağlık ekibine söyleyin.",
      "Yalnızca hayati tehlikede (yangın, çökme, su) taşıyın. Baş, boyun ve gövdeyi birlikte, tek parça hareket ettirin.",
      "Kusarsa ya da ağzı kanla dolarsa başını ve gövdesini birlikte yana çevirin.",
      "Normal nefes almıyorsa sırtüstü yatırıp kalp masajına başlayın."
    ],
    "dont": [
      "Boyunluk ya da sert bir şeyi zorla takmayın.",
      "Kişiyi oturtmaya ya da ayağa kaldırmaya çalışmayın.",
      "Başını öne, arkaya ya da yana çevirmeyin.",
      "Motosiklet kaskını zorunlu olmadıkça çıkarmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "omurga",
      "omurilik",
      "boyun kırığı",
      "boynu kırıldı",
      "bel kırığı",
      "sırtını incitti",
      "boynunu incitti",
      "boyun yaralanması",
      "sığ suya atladı",
      "yüksekten düştü",
      "felç kalabilir",
      "bacaklarını hissetmiyor",
      "omurga kirigi",
      "boyun travmasi"
    ],
    "sources": [
      "ERC Kılavuzları 2025 — İlk Yardım (omurga yaralanması)",
      "ERC 2025 — Guidelines for Everyone",
      "Mayo Clinic — Spinal injury: First aid"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ehliyet ilk yardım müfredatı (oturtmama, yürütmeme, baş-boyun-gövde blok hâlinde, zorunlu olmadıkça oynatmama), ERC 2025 First Aid tam metni (başın arkasında diz çökerek elle sabitleme, güvensiz ortam dışında taşımama, zorla pozisyon vermeme, ilk yardımcı boyunluk kullanmasın, travmada derlenme pozisyonu yok). Değişiklik yok." },
    "art": [
      "call-112",
      "yaralanma-omurga-kimildatma",
      "yaralanma-omurga-bas-tutma",
      null,
      "yaralanma-omurga-ortme",
      null,
      "yaralanma-omurga-tek-parca",
      null,
      "yaralanma-omurga-kpr"
    ]
  },
  {
    "id": "yaralanma-goz",
    "title": "Göz yaralanması (kimyasal, toz, batan cisim)",
    "tag": "YARALANMA",
    "summary": "Göze kimyasal kaçtıysa hemen bol, temiz suyla en az 20 dakika yıkayın; göze bir şey battıysa çıkarmayın, bastırmadan örtüp 112'yi arayın.",
    "steps": [
      "Göze kimyasal kaçtıysa göz kapaklarını açık tutup göze en az 20 dakika ılık, temiz, akan su dökün.",
      "Başı yaralı göz aşağıda kalacak şekilde yana eğin; su sağlam göze akmasın. Su akışı sert olmasın.",
      "Yıkarken birine 112'yi aratın. Kimyasalın kutusunu yanınıza alın.",
      "Toz ya da kirpik gibi küçük bir şey kaçtıysa gözü ovuşturmayın; temiz suyla yıkayın.",
      "Göze bir cisim battıysa ya da saplandıysa çıkarmayın. Kişiyi sırtüstü yatırın ya da arkaya yaslayın.",
      "Göze bastırmadan, üstüne karton bardak gibi bir koruyucu kapatıp bantlayın.",
      "Sağlam gözünü de kapalı tutmasını isteyin; iki göz birlikte hareket eder.",
      "Göze hızla bir şey çarptıysa, görme bozulduysa, gözden kan ya da irin geliyorsa ya da gözünü açamıyorsa hemen acile gidin."
    ],
    "dont": [
      "Gözü ovuşturmayın.",
      "Batan cismi çıkarmayın, göze bastırmayın.",
      "Göze temiz su dışında bir şey koymayın: süt, limon, çay, yoğurt.",
      "İyileşene kadar kontakt lens takmayın, göz makyajı yapmayın.",
      "Kendiniz araç kullanarak acile gitmeyin."
    ],
    "keywords": [
      "göz yaralanması",
      "gözüme kimyasal kaçtı",
      "gözüne bir şey kaçtı",
      "gözüme toz kaçtı",
      "gözüne çamaşır suyu kaçtı",
      "gözüme bir şey battı",
      "gözüne cam battı",
      "gözüne çapak kaçtı",
      "göz yanması",
      "göze darbe",
      "gozume bir sey kacti",
      "gözüme deterjan kaçtı",
      "gözü kızardı yaralandı"
    ],
    "sources": [
      "NHS — Eye injuries",
      "ERC Kılavuzları 2021 — İlk Yardım"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ehliyet ilk yardım müfredatı (kimyasalda bol suyla uzun süre, yaralı göz aşağıda iç köşeden dış köşeye yıkama), NHS Eye injuries. ERC 2025 kimyasal göz yaralanmasını kapsamından çıkardı. Değişiklik yok." },
    "art": [
      "yaralanma-goz-yikama",
      null,
      "call-112",
      "yaralanma-goz-toz",
      null,
      "yaralanma-goz-bardak",
      null,
      "hospital-go"
    ]
  },
  {
    "id": "yaralanma-dis",
    "title": "Diş çıkması, diş kırılması ve ağız yaralanması",
    "tag": "YARALANMA",
    "summary": "Yerinden çıkan kalıcı dişi kökünden değil beyaz kısmından tutun, hemen yerine takın ya da süte koyun ve hemen diş hekimine gidin.",
    "steps": [
      "Dişi bulun. Beyaz taç kısmından tutun; köküne dokunmayın.",
      "Süt dişiyse yerine takmayın. Dişi yanınıza alıp diş hekimine gidin.",
      "Diş kirliyse sütle, serum fizyolojikle ya da kişinin kendi tükürüğüyle hafifçe çalkalayın. Ovmayın, silmeyin.",
      "Kalıcı dişse hemen yuvasına geri takın. Dişin önü öne baksın.",
      "Takınca temiz bir bez ya da mendili ısırarak dişi yerinde tutmasını söyleyin.",
      "Takamıyorsanız dişi bir bardak süte koyun. Süt yoksa serum fizyolojik ya da kişinin bardağa tükürdüğü tükürük kullanın. Diş kurumasın.",
      "Hemen diş hekimine ya da acile gidin; ilk 60 dakika çok önemlidir. Diş kırıldıysa kırık parçayı da süt içinde götürün.",
      "Dudak, dil ya da diş eti kanıyorsa temiz bir bezle 10 dakika bastırın. Şişlik için dışarıdan beze sarılı soğuk tutun.",
      "Kanama durmuyorsa, nefes almakta zorlanıyorsa ya da çenesi şekil değiştirdiyse 112'yi arayın."
    ],
    "dont": [
      "Dişi kökünden tutmayın.",
      "Dişi fırçalamayın; sabun ya da alkolle temizlemeyin.",
      "Dişi kâğıt mendile sarıp kuru bırakmayın.",
      "Dişi suda bekletmeyin; süt, tükürük ya da serum fizyolojik kullanın.",
      "Süt dişini yerine takmaya çalışmayın.",
      "Bilinci bulanık kişinin ağzına diş yerleştirmeyin; yutabilir."
    ],
    "keywords": [
      "diş çıktı",
      "dişi düştü",
      "dişim kırıldı",
      "diş kırılması",
      "dişi yerinden çıktı",
      "ön dişi kırıldı",
      "diş darbe",
      "dis cikti",
      "dis kirildi",
      "ağız yaralanması",
      "dudağı patladı",
      "dili kanıyor",
      "diş eti kanıyor",
      "çene darbesi"
    ],
    "sources": [
      "NHS — Knocked-out tooth",
      "T.C. Sağlık Bakanlığı — Dental travmalara acil müdahale rehberi (AA/Habertürk haberi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı dental travma rehberi (köke dokunmama, kurutmama, sade süt, 60 dakika içinde diş hekimi, kırık parça da sütte), NHS Knocked-out tooth. #7: \"30–60 dakika\" → \"60 dakika\", kırık parçanın sütte götürülmesi eklendi." },
    "art": [
      "yaralanma-dis-tutma",
      null,
      null,
      "yaralanma-dis-yerlestirme",
      null,
      "yaralanma-dis-sut",
      null,
      "yaralanma-agiz-bastirma",
      "call-112"
    ]
  },
  {
    "id": "yaralanma-gogus",
    "title": "Göğüs yaralanması",
    "tag": "YARALANMA",
    "summary": "Göğüs yaralanmasında 112'yi arayın, kişiyi rahat nefes alacağı şekilde yarı oturur tutun ve açık göğüs yarasını hava geçirmez şekilde kapatmayın.",
    "steps": [
      "112'yi arayın.",
      "Kişiyi en rahat nefes aldığı şekilde, genellikle yarı oturur hâlde tutun.",
      "Göğüste açık yara varsa açık bırakın. Üstünü naylon ya da bantla kapatmayın. Eski eğitimlerdeki \"üç kenarı bantlı örtü\" artık önerilmiyor. Örtü koyduysanız ve nefes darlığı artarsa örtüyü hemen kaldırın.",
      "Yara çok kanıyorsa temiz bir bezle elle bastırın; bezi dört yandan bantlayıp kapatmayın.",
      "Göğse saplanmış bir cisim varsa çıkarmayın; çevresine bez koyup sabitleyin.",
      "Nefes darlığının artıp artmadığını, dudakların morarıp morarmadığını izleyin.",
      "Bilinci kapanır ve normal nefes almazsa kalp masajına başlayın."
    ],
    "dont": [
      "Açık göğüs yarasını hava geçirmeyecek şekilde kapatmayın.",
      "Saplanan cismi çıkarmayın.",
      "Kaburga kırığında göğsü sıkıca sarmayın; nefesi kısıtlar.",
      "Yiyecek, içecek vermeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "göğüs yaralanması",
      "göğüs yarası",
      "göğsünden bıçaklandı",
      "göğsüne darbe",
      "kaburga kırığı",
      "kaburgası kırıldı",
      "akciğer delindi",
      "göğüsten hava kaçıyor",
      "gogus yarasi",
      "kaburga kirildi",
      "göğsü ezildi",
      "nefes alınca göğsü ağrıyor"
    ],
    "sources": [
      "ERC Kılavuzları 2025 — İlk Yardım (açık göğüs yarası)",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)",
      "ICRC — First Aid"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı Temel İlkyardım Kitabı 2011 ve ehliyet ilk yardım müfredatı (yarı oturur pozisyon, saplanan cismi çıkarmama; açık yarada üç kenarı bantlı örtü öğretiliyor), ERC 2025 First Aid (yarayı açık bırak, örtme, gerekirse doğrudan bası). Türk müfredatıyla çelişki ERC 2025 lehine çözüldü; #3'e eski yöntemin artık önerilmediği ve örtü varsa nefes darlığında kaldırma eklendi." },
    "art": [
      "call-112",
      "yaralanma-gogus-yari-oturur",
      "yaralanma-gogus-acik-yara",
      null,
      null,
      "yaralanma-gogus-izle",
      "yaralanma-gogus-kpr"
    ]
  },
  {
    "id": "yaralanma-karin",
    "title": "Karın yaralanması",
    "tag": "YARALANMA",
    "summary": "Karın yaralanmasında 112'yi arayın; dışarı çıkan organları geri itmeyin, nemli temiz bir bezle gevşekçe örtün.",
    "steps": [
      "112'yi arayın.",
      "Kişiyi sırtüstü yatırın, dizlerini bükün. Boyun ya da sırt yaralanması olabilirse kıpırdatmayın. Ağrıyı artırıyorsa en rahat ettiği şekilde bırakın.",
      "Organlar dışarı çıktıysa geri itmeyin, üstüne bastırmayın.",
      "Üstünü temiz suyla ıslatılmış temiz bir bezle gevşekçe örtün. Varsa üstüne streç film koyun.",
      "Karna saplanmış cisim varsa çıkarmayın; çevresine bez koyup sabitleyin.",
      "Yiyecek, içecek vermeyin.",
      "Üstünü örtüp üşütmeyin. Solukluk, soğuk terleme ve hızlı nabız şok belirtisidir; ekibe söyleyin.",
      "Darbeden sonra dışarıda yara olmasa bile şiddetli karın ağrısı, karında sertlik ya da kan kusma varsa 112'yi arayın."
    ],
    "dont": [
      "Dışarı çıkan organları geri itmeyin.",
      "Organların üstüne kuru pamuk, kâğıt ya da tüylü bez koymayın.",
      "Yiyecek, içecek vermeyin.",
      "Saplanan cismi çıkarmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "karın yaralanması",
      "karından bıçaklandı",
      "karnından yaralandı",
      "bağırsak dışarı çıktı",
      "organ dışarı çıktı",
      "karnına darbe",
      "karın yarası",
      "karin yarasi",
      "karnina darbe",
      "iç kanama",
      "karnı sertleşti"
    ],
    "sources": [
      "American Red Cross — Abdominal Injury",
      "ICRC — First Aid",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı Temel İlkyardım Kitabı 2011 ve ehliyet ilk yardım müfredatı (sırtüstü dizler bükük, organları geri itmeme, nemli temiz bezle örtme, ağızdan bir şey vermeme, saplanan cismi çıkarmama). Değişiklik yok." },
    "art": [
      "call-112",
      "yaralanma-karin-diz-bukuk",
      null,
      "yaralanma-karin-nemli-bez",
      null,
      "yaralanma-yeme-icme-yasak",
      "yaralanma-karin-ortme",
      null
    ]
  },
  {
    "id": "yaralanma-uzuv-kopmasi",
    "title": "Parmak ya da uzuv kopması",
    "tag": "YARALANMA",
    "summary": "Önce kanamayı durdurun ve 112'yi arayın; kopan parçayı nemli temiz beze sarıp poşete koyun, poşeti buzlu suya koyun.",
    "steps": [
      "Yaraya temiz bir bezle sert ve kesintisiz bastırın.",
      "112'yi arayın ya da birine aratın.",
      "Kol ya da bacak koptuysa ya da kanama bastırmayla durmuyorsa, turnike varsa yaranın 5–7 cm üstüne takın; eklemin üstüne takmayın. Saatini not edin.",
      "Kopan parçayı bulun. Ovarak temizlemeye çalışmayın.",
      "Parçayı temiz suyla ya da serum fizyolojikle nemlendirilmiş temiz bir beze sarın.",
      "Sarılı parçayı su geçirmez bir poşete koyup ağzını kapatın.",
      "Bu poşeti, içinde buz ve su olan ikinci bir poşete ya da kaba koyun. Parça buza doğrudan değmesin.",
      "Poşete kişinin adını ve saati yazın. Parçayı kişiyle birlikte aynı hastaneye gönderin.",
      "Kişiyi yatırın, üstünü örtün, sakin tutun."
    ],
    "dont": [
      "Kopan parçayı doğrudan buza değdirmeyin, buzluğa koymayın.",
      "Parçayı suya batırıp bırakmayın.",
      "Parçayı aramak için kanamayı durdurmayı ertelemeyin.",
      "Yarım kopmuş parçayı koparmayın; yerinde tutup sarın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "parmak koptu",
      "parmağı koptu",
      "parmağım koptu",
      "uzuv kopması",
      "kol koptu",
      "bacak koptu",
      "kopan parça",
      "kopan parmak nasıl saklanır",
      "parmak kopmasi",
      "makineye kaptırdı",
      "ampütasyon"
    ],
    "sources": [
      "MedlinePlus (NIH) — Amputation, traumatic",
      "British Red Cross — Bleeding heavily",
      "ERC Kılavuzları 2025 — İlk Yardım (kopan parça, turnike)",
      "T.C. Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ERC 2025 First Aid tam metni (önce ciddi kanama, nemli bezle sarma, su geçirmez poşet, buzlu ya da buz-su içeren ikinci poşet, buza doğrudan temas yok, ad ve saat etiketi, kişiyle aynı hastaneye; turnike yaranın 5–7 cm üstü, eklem üstü değil, saati yazma), Sağlık Bakanlığı Temel İlkyardım Kitabı 2011 (kapalı poşet, buzlu ikinci kap). Değişiklik yok." },
    "art": [
      "yaralanma-uzuv-bastirma",
      "call-112",
      null,
      null,
      "yaralanma-kopan-parca-sarma",
      null,
      "yaralanma-kopan-parca-buzlu-su",
      "yaralanma-kopan-parca-etiket",
      "yaralanma-uzuv-ortme"
    ]
  },
  {
    "id": "yaralanma-saplanan-cisim",
    "title": "Saplanan cisim (bıçak, çubuk, cam)",
    "tag": "YARALANMA",
    "summary": "Saplanan cismi çıkarmayın; çevresinden bastırarak kanamayı durdurun, cismi sabitleyin ve 112'yi arayın.",
    "steps": [
      "Cismi çıkarmayın. Cisim kanamayı tıkıyor olabilir.",
      "112'yi arayın.",
      "Kanama varsa cismin iki yanından, yaranın kenarlarına bastırın. Cismin üstüne bastırmayın.",
      "Cismin çevresine rulo yapılmış bez ya da sargı koyarak sabitleyin.",
      "Sargıyı cismin üstünden değil, çevresinden dolayarak bağlayın.",
      "Cismi kısaltmaya, kırmaya ya da oynatmaya çalışmayın.",
      "Kişiyi rahat bir pozisyonda, hareketsiz tutun; üstünü örtün.",
      "Yiyecek, içecek vermeyin. Bilincini ve nefesini izleyin."
    ],
    "dont": [
      "Cismi çekip çıkarmayın.",
      "Cismi oynatmayın, kırmayın.",
      "Cismin üstüne bastırmayın.",
      "Göze batan cisimde göze bastırmayın; [[yaralanma-goz|\"Göz yaralanması\" rehberine]] bakın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "saplanan cisim",
      "bıçak saplandı",
      "çubuk saplandı",
      "demir saplandı",
      "cam saplandı",
      "çivi battı",
      "vücuda saplanan",
      "saplanmış bıçak çıkarılır mı",
      "saplanan cisim cikarilir mi",
      "kazık battı",
      "saplandı"
    ],
    "sources": [
      "British Red Cross — Bleeding heavily (saplanan cisim)",
      "NHS — Cuts and grazes"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ehliyet ilk yardım müfredatı (saplanan cismi çıkarmama, olduğu yerde sabitleme), British Red Cross, NHS. Değişiklik yok." },
    "art": [
      "yaralanma-saplanan-cikarma-yasak",
      "call-112",
      "yaralanma-saplanan-iki-yandan",
      "yaralanma-saplanan-sabitleme",
      null,
      null,
      "yaralanma-saplanan-ortme",
      null
    ]
  },
  {
    "id": "yaralanma-yara-temizleme",
    "title": "Yara temizliği ve enfeksiyon belirtileri",
    "tag": "YARALANMA",
    "summary": "Küçük yarayı temiz, akan suyla yıkayıp temiz bir pansumanla örtün; kızarıklık, şişlik, irin ya da ateş olursa sağlık kuruluşuna gidin.",
    "steps": [
      "Ellerinizi sabunla yıkayın. Varsa eldiven giyin.",
      "Kanama varsa temiz bir bezle bastırarak durdurun.",
      "Kanama durmuyorsa ya da fışkırıyorsa, yara çok büyük ya da derinse, içinde cam gibi bir şey saplıysa ya da yaranın ötesinde his kaybı varsa yıkamayın; 112'yi arayın.",
      "Yarayı temiz, akan suyla bol bol yıkayın. Musluk suyu, şişe suyu ya da kaynatılıp soğutulmuş su kullanın.",
      "Yaranın çevresindeki deriyi sabunlu suyla, yaradan dışa doğru silerek temizleyin.",
      "Yarayı temiz bir pansumanla ya da yara bandıyla örtün.",
      "Pansumanı ıslandığında ya da kirlendiğinde temiz elle değiştirin. Yarayı temiz ve kuru tutun.",
      "Enfeksiyon belirtilerini izleyin: artan kızarıklık, şişlik, sıcaklık, artan ağrı, irin.",
      "Yara çevresinde yayılan kızarıklık, ateş, titreme ya da halsizlik varsa aynı gün sağlık kuruluşuna gidin. Bilinç bulanıklığı, çok hızlı nefes ya da alaca, morumsu cilt varsa 112'yi arayın.",
      "Yarada toprak ya da kir kaldıysa, yara 5 cm'den büyükse, yüzde ya da avuç içindeyse, insan ya da hayvan ısırığıysa ya da tetanoz aşınız güncel değilse sağlık kuruluşuna gidin."
    ],
    "dont": [
      "Yaraya kahve, tütün, diş macunu, kül ya da salça koymayın.",
      "Pansumanı kirli elle değiştirmeyin.",
      "Yaraya batmış ve kolay çıkmayan kiri zorla kazımayın.",
      "Enfeksiyon belirtilerini görmezden gelmeyin."
    ],
    "keywords": [
      "yara temizliği",
      "yara nasıl temizlenir",
      "yara iltihaplandı",
      "yara mikrop kaptı",
      "yarada irin",
      "yara cerahat",
      "yara şişti kızardı",
      "enfeksiyon",
      "pansuman",
      "pansuman nasıl yapılır",
      "yara bandı",
      "tetanoz",
      "yara iltihap",
      "sıyrık",
      "yara enfeksiyonu"
    ],
    "sources": [
      "NHS — Cuts and grazes",
      "NHS — Sepsis"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NHS Cuts and grazes (yıkama, çevre deriyi dışa doğru silme, örtme, 111 ve 999/acil ölçütleri, 5 cm). Acil durumda yıkamama adımı eklendi. NHS Sepsis (çok hızlı nefes, bilinç bulanıklığı, mavi/soluk/alaca cilt)." },
    "art": [
      "yaralanma-yara-el-yikama",
      "yaralanma-yara-bastirma",
      null,
      "yaralanma-yara-yikama",
      null,
      "yaralanma-yara-bandi",
      null,
      "yaralanma-yara-enfeksiyon",
      null,
      "yaralanma-yara-saglik"
    ]
  },
  {
    "id": "yaralanma-soguk-isirigi",
    "title": "Soğuk ısırığı (doku donması)",
    "tag": "YARALANMA",
    "summary": "Donan bölgeyi ovmadan koruyun; yeniden donma riski yoksa 37–39 °C ılık suda yaklaşık 30 dakika ısıtın ve sağlık kuruluşuna ulaşın.",
    "steps": [
      "Kişiyi sıcak, rüzgârsız bir yere alın. Islak giysileri kurularıyla değiştirin. Titriyorsa önce bütün vücudunu ısıtın.",
      "Belirtileri tanıyın: soluk, beyaz-gri ya da mumsu deri, uyuşma, sertlik. En çok el ve ayak parmakları, burun ve kulaklar etkilenir.",
      "Yüzük, saat gibi sıkan eşyaları çıkarın.",
      "Bölge yeniden donabilecekse ısıtmayın; donmuş hâlde koruyarak sağlık ekibine ulaşın. Donmuş ayakla mümkünse yürütmeyin.",
      "Yeniden donma riski yoksa bölgeyi 37–39 °C ılık suya batırın. Termometre yoksa suyu sağlam elinizle deneyin; rahat ılık olmalı, yakmamalı.",
      "Bölge yumuşayıp kızarana ya da morumsu olana kadar, genellikle 30 dakika suda tutun. Isınırken ağrı olabilir.",
      "Ilık su yoksa bölgeyi koltuk altında ya da başka birinin teninde ısıtın.",
      "Isınan bölgeyi ovmadan, hafifçe bastırarak kurulayın. Parmak aralarına temiz bez koyup gevşekçe sarın.",
      "Kabarcıkları patlatmayın. Kişiyi sağlık kuruluşuna ulaştırın."
    ],
    "dont": [
      "Donan yeri karla ya da elle ovmayın, masaj yapmayın.",
      "Soba, ateş, saç kurutma makinesi ya da çok sıcak suyla ısıtmayın; uyuşuk deri yanar.",
      "Isıttığınız bölgenin yeniden donmasına izin vermeyin.",
      "Alkol vermeyin."
    ],
    "keywords": [
      "soğuk ısırığı",
      "soguk isirigi",
      "parmaklarım dondu",
      "ayak parmakları dondu",
      "parmak donması",
      "doku donması",
      "kulağı dondu",
      "burnu dondu",
      "parmaklar morardı soğuktan",
      "parmaklar beyazladı",
      "ayağım dondu",
      "elim dondu"
    ],
    "sources": [
      "NHS — Frostbite",
      "Mayo Clinic — Frostbite: First aid",
      "Wilderness Medical Society — Frostbite önerileri (37–39 °C)",
      "Acıbadem — Soğuk ısırığı (37–39 °C)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Acıbadem Soğuk ısırığı sayfası (37–39 °C ılık su, yaklaşık 15–30 dk, ovmama, doğrudan yüksek ısı yok), ehliyet ilk yardım müfredatı (sıcak yere alma, ıslak giysiyi değiştirme, ovmama, ateş/soba yok, alkol yok), NHS, Mayo. Değişiklik yok." },
    "alsoIn": ["doga"],
    "art": [
      null,
      "yaralanma-donma-belirti",
      "yaralanma-donma-yuzuk",
      null,
      "yaralanma-donma-ilik-su",
      null,
      null,
      "yaralanma-donma-sarma",
      "yaralanma-donma-saglik"
    ]
  },
  {
    "id": "yaralanma-gunes-yanigi",
    "title": "Güneş yanığı",
    "tag": "YARALANMA",
    "summary": "Gölgeye geçin, cildi serin suyla soğutun ve bol su için; yaygın su toplama, ateş, titreme ya da baş dönmesi varsa sağlık kuruluşuna gidin.",
    "steps": [
      "Hemen gölgeye ya da içeri geçin.",
      "Yanan deriyi serin duşla ya da ılık-serin suya batırılmış bezle soğutun.",
      "Bol su için. Alkol almayın.",
      "Gerginlik için deriye nemlendirici ya da güneş sonrası losyon sürebilirsiniz.",
      "İyileşene kadar yanan yeri güneşe çıkarmayın; bol, açık renkli giysiyle örtün.",
      "Su toplayan kabarcıkları patlatmayın.",
      "Su toplama, şişlik, ateş, titreme, bulantı, baş ağrısı, kas krampı, baş dönmesi ya da halsizlik varsa sağlık kuruluşuna gidin. Bebeğin ya da küçük çocuğun derisi yandıysa da gidin.",
      "Bilinç bulanıklığı, tuhaf davranış ya da bayılma varsa sıcak çarpması olabilir: 112'yi arayın."
    ],
    "dont": [
      "Buz ya da buzlu su koymayın.",
      "Yoğurt, salça, diş macunu ya da yağ sürmeyin.",
      "Kabarcıkları patlatmayın.",
      "Yanık geçmeden yeniden güneşe çıkmayın.",
      "Soyulan deriyi koparmayın; dar giysi giymeyin."
    ],
    "keywords": [
      "güneş yanığı",
      "gunes yanigi",
      "güneşte yandım",
      "güneşte yandı",
      "güneşten yandı",
      "sırtım güneşte yandı",
      "deniz yanığı",
      "güneşten kızardı",
      "güneşte su topladı",
      "plajda yandı"
    ],
    "sources": [
      "NHS — Sunburn (nhs.uk/conditions/sunburn)",
      "NHS (Royal Devon) — Sunburn bilgilendirme"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NHS Sunburn (serinletme, buz/vazelin yok, kabarcık patlatmama, başvuru ölçütleri, bebek/çocuk)." },
    "alsoIn": ["hava"],
    "art": [
      "yaralanma-gunes-golge",
      "yaralanma-gunes-serin-bez",
      "yaralanma-gunes-su-icme",
      null,
      null,
      null,
      "yaralanma-gunes-saglik",
      "call-112"
    ]
  },
  {
    "id": "yaralanma-ishal",
    "title": "İshal ve sıvı kaybı",
    "tag": "YARALANMA",
    "summary": "İshalde en önemlisi sıvı kaybını önlemektir: sık sık ağızdan sıvı tuz (ORS) ya da temiz sıvı için, tehlike belirtilerinde sağlık kuruluşuna gidin.",
    "steps": [
      "Sık sık, küçük yudumlarla sıvı için. Bulantı varsa azar azar ama sürekli için.",
      "Ağızdan sıvı tuz (ORS) paketi varsa paketin üstündeki tarife göre temiz suda hazırlayın.",
      "Paket yoksa evde yapın: 1 litre temiz içme suyuna 6 silme çay kaşığı şeker ve yarım silme çay kaşığı tuz koyup karıştırın.",
      "Bebeği emzirmeye ya da mamayla beslemeye devam edin. Mamayı sulandırmayın.",
      "İştah olunca yemeye devam edin. Yağlı, baharatlı yiyecekler, meyve suyu ve gazlı içecekten kaçının.",
      "Tuvaletten sonra ve yemekten önce ellerinizi sabunla yıkayın. İçme suyunu güvenli hâle getirin.",
      "Sıvı kaybı belirtilerini izleyin: koyu ve az idrar, çocukta bezin az ıslanması, çökmüş gözler, halsizlik, içmekte zorlanma.",
      "Dışkıda kan varsa, sürekli kusup sıvı tutamıyorsa, 1 yaşından küçük bebekte, çocukta sıvı kaybı belirtisi varsa ya da ishal 7 günden uzun sürerse sağlık kuruluşuna gidin.",
      "Uyandırmakta zorlanma, bilinç bulanıklığı, hızlı nefes ya da morumsu, alaca deri varsa 112'yi arayın."
    ],
    "dont": [
      "Tuzu ve şekeri göz kararı koymayın; fazla tuz zararlıdır.",
      "İshal sürüyor diye sıvıyı kesmeyin.",
      "Bebeğin emzirmesini kesmeyin.",
      "Doktora danışmadan çocuklara ishal kesici ilaç vermeyin."
    ],
    "keywords": [
      "ishal",
      "ishal oldum",
      "ishal oldu",
      "amel",
      "sürgün",
      "sulu dışkı",
      "ishal kusma",
      "sıvı kaybı",
      "susuz kalma",
      "ors",
      "ağızdan sıvı tuz",
      "tuzlu şekerli su",
      "evde ors",
      "ishal bebek",
      "kolera",
      "ishal durmuyor"
    ],
    "sources": [
      "WHO — Cholera outbreaks: soru-cevap (evde ORS tarifi)",
      "UNICEF — Kolera bilgilendirmesi",
      "WHO — Diarrhoeal disease",
      "NHS — Diarrhoea and vomiting"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: WHO Cholera outbreaks S-C (1 L su, 6 çay kaşığı şeker, ½ çay kaşığı tuz); NHS Diarrhoea and vomiting (meyve suyu/gazlı içecek, mama sulandırmama, 7 gün, kanlı ishal, 112 belirtileri)." },
    "art": [
      "yaralanma-su-icme",
      "yaralanma-ors-paket",
      "yaralanma-ors-ev-tarifi",
      null,
      null,
      "yaralanma-ishal-el-yikama",
      null,
      "yaralanma-ishal-saglik",
      "call-112"
    ]
  },
  {
    "id": "yaralanma-yuksek-ates",
    "title": "Yüksek ateş (yetişkin ve çocuk)",
    "tag": "YARALANMA",
    "summary": "Ateşi olan kişiye sık sık sıvı verip dinlendirin, kalın örtmeyin; tehlike belirtilerinde ve 3 aydan küçük bebekte 38 °C ve üzeri ateşte hemen sağlık kuruluşuna başvurun.",
    "steps": [
      "Ateşi ölçün. 38 °C ve üzeri yüksek ateştir.",
      "3 aydan küçük bebekte 38 °C ya da üzeri, 3–6 aylık bebekte 39 °C ya da üzeri ateş varsa hemen sağlık kuruluşuna başvurun.",
      "Sık sık sıvı verin. Bebeği emzirmeye devam edin.",
      "Kalın giydirmeyin, kat kat örtmeyin. İnce giysi yeterli.",
      "Dinlendirin ve sık sık kontrol edin; gece de yanında olun.",
      "Ateş düşürücü ilaç kullanacaksanız yaşa ve kiloya uygunluğunu eczacıya ya da doktora sorun.",
      "Hemen 112'yi arayın: ense sertliği, ışıktan rahatsız olma, nefes darlığı, morumsu ya da gri dudak, alaca deri, el ve ayakların çok soğuk olması, uyandırmakta zorlanma, bilinç bulanıklığı, nöbet.",
      "Döküntü varsa üstüne cam bardak bastırın. Döküntü bardağın altında solmuyorsa hemen 112'yi arayın.",
      "Ateş 5 gün ya da daha uzun sürerse, çocuk sıvı almıyorsa, idrarı azaldıysa ya da durumu kötüleşiyorsa sağlık kuruluşuna gidin."
    ],
    "dont": [
      "Kat kat giydirip terletmeye çalışmayın.",
      "Soğuk suyla, alkolle ya da sirkeyle silmeyin; çocuğu soyup üşütmeyin.",
      "16 yaşından küçüklere aspirin vermeyin.",
      "Bebekteki ateşi \"diş çıkarıyor\" diye geçiştirmeyin."
    ],
    "keywords": [
      "yüksek ateş",
      "ateşi var",
      "ateşim var",
      "ateşlendi",
      "ateşi yükseldi",
      "ateş düşmüyor",
      "çocuğun ateşi var",
      "bebeğin ateşi var",
      "bebek ateşi",
      "39 derece ateş",
      "harareti var",
      "atesi var",
      "ateş kaç derece",
      "termometre",
      "ateşi çıktı"
    ],
    "sources": [
      "NHS — Fever in children",
      "NHS — High temperature (fever) in adults"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NHS Fever in children (38 °C, 3 ay/38 °C, 3–6 ay/39 °C, 5 gün, soymama/silmeme, aspirin <16 yaş, bardak testi, 999 belirtileri); NHS Fever in adults." },
    "art": [
      "yaralanma-ates-olcme",
      "yaralanma-ates-bebek",
      null,
      "yaralanma-ates-ince-giysi",
      null,
      null,
      "yaralanma-ates-112",
      "yaralanma-ates-bardak-testi",
      "yaralanma-ates-saglik"
    ]
  },
  {
    "id": "yaralanma-kuduz-isirik",
    "title": "Köpek, kedi ve hayvan ısırığı (kuduz riski)",
    "tag": "YARALANMA",
    "summary": "Köpek, kedi ya da başka bir hayvan ısırdıysa ya da tırmaladıysa yarayı hemen bol su ve sabunla en az 15 dakika yıkayın ve aynı gün sağlık kuruluşuna gidin; kuduz aşısı gerekebilir.",
    "steps": [
      "Hayvandan uzaklaşın; yeniden ısırılmayın.",
      "Yarayı hemen bol akan su ve sabunla en az 15 dakika yıkayın.",
      "Yıkadıktan sonra varsa alkol ya da iyotlu antiseptik sürün.",
      "Çok kanıyorsa temiz bir bezle bastırın ve yarayı örtün. Kanama durmuyorsa 112'yi arayın.",
      "Aynı gün, en kısa sürede bir sağlık kuruluşuna gidin. Kuduz ve tetanoz aşısı gerekebilir. Aradan zaman geçmiş olsa bile gidin.",
      "Tırmalama ya da salyanın yaraya, göze, ağza, burna değmesi de kuduz riskidir. Göz, ağız ya da burun bulaştıysa bol suyla yıkayın. Yarasa ısırdıysa ya da tırmaladıysa da sağlık kuruluşuna gidin; aşı gerekip gerekmediğine hekim karar verir.",
      "Hayvanı öldürmeyin. Kedi ve köpekler 10 gün gözlenir; hayvanın yerini, sahibini, aşısını öğrenin ve hekime söyleyin.",
      "Hekimin verdiği aşı takvimine aksatmadan uyun.",
      "Hasta, garip davranan ya da ölü hayvanlara yaklaşmayın; il ya da ilçe tarım ve orman müdürlüğüne bildirin."
    ],
    "dont": [
      "Yarayı yıkamadan bırakmayın; aradan zaman geçtiyse de yıkayın.",
      "Yaraya kahve, tütün, salça gibi şeyler koymayın.",
      "Isıran köpeği ya da kediyi öldürmeyin; 10 gün gözlem gerekebilir.",
      "\"Küçük bir tırmık\" diye sağlık kuruluşuna gitmeyi ertelemeyin.",
      "Aşıları yarıda bırakmayın."
    ],
    "keywords": [
      "köpek ısırdı",
      "kedi ısırdı",
      "köpek ısırığı",
      "kedi tırmaladı",
      "sokak köpeği ısırdı",
      "hayvan ısırdı",
      "hayvan ısırığı",
      "kuduz",
      "kuduz aşısı",
      "kuduz riski",
      "kuduz şüpheli ısırık",
      "kopek isirdi",
      "kedi tirmaladi",
      "yarasa ısırdı",
      "tilki ısırdı",
      "inek ısırdı"
    ],
    "sources": [
      "WHO — Rabies fact sheet",
      "CDC — About rabies",
      "T.C. Sağlık Bakanlığı HSGM — Kuduz Profilaksi Rehberi",
      "Kuduz Hastalığından Korunma ve Kuduz Hastalığı ile Mücadele Yönetmeliği (Tarım ve Orman Bakanlığı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: HSGM Kuduz Profilaksi Rehberi (derhal bol akarsu ve sabunla yıkama, zaman geçse de yıkama, ardından alkol ya da iyotlu antiseptik, kedi-köpekte 10 gün gözlem, tırmalama/salya riskli temas; evde yarasa teması profilaksi gerektirmiyor, mağara teması vaka bazlı), Kuduz Yönetmeliği md. 10–12 (bildirim aynı gün il/ilçe müdürlüğüne, ısıran hayvan 10 gün gözlem), WHO (15 dk). #6'daki kesin \"yarasayla temas kuduz riskidir\" ifadesi HSGM'ye uyumlu hâle getirildi." },
    "alsoIn": ["doga"],
    "art": [
      null,
      "yaralanma-isirik-yikama",
      null,
      "yaralanma-isirik-bastirma",
      "yaralanma-kuduz-saglik",
      null,
      null,
      "yaralanma-asi-takvimi",
      null
    ]
  },
  {
    "id": "yaralanma-kene",
    "title": "Kene tutunması ve KKKA",
    "tag": "YARALANMA",
    "summary": "Vücuda kene tutunduysa çıplak elle dokunmadan, ezmeden, deriye en yakın yerden tutup çekerek çıkarın; 10 gün içinde ateş, halsizlik ya da kusma olursa hemen sağlık kuruluşuna gidin.",
    "steps": [
      "Keneyi en kısa sürede çıkarın. Kendiniz çıkaramıyorsanız en yakın sağlık kuruluşuna gidin.",
      "Çıplak elle dokunmayın. Eldiven, bez ya da poşet kullanın.",
      "İnce uçlu bir cımbızla keneyi deriye en yakın yerinden tutun.",
      "Çevirmeden, sarsmadan, yavaş ve sabit bir kuvvetle deriden uzağa doğru çekin.",
      "Ağız parçası deride kalırsa kurcalamayın.",
      "Isırık yerini ve ellerinizi sabun ve suyla ya da alkolle temizleyin.",
      "Keneyi ezmeyin. Kapalı bir kaba koyun ya da banta sarıp atın.",
      "Tarihi not edin. 10 gün içinde ateş, halsizlik, iştahsızlık, baş ağrısı, kas ağrısı, bulantı, kusma ya da ishal olursa hemen sağlık kuruluşuna gidip keneyi söyleyin.",
      "Morarma, burun, diş eti ya da başka yerden kanama başlarsa 112'yi arayın.",
      "Kırsalda açık renkli, kapalı giysi giyin; paçaları çorabın içine sokun. Dönüşte koltuk altı, kasık, diz arkası, kulak arkası ve saç diplerini kontrol edin."
    ],
    "dont": [
      "Keneye kolonya, alkol, gaz yağı, deterjan dökmeyin; sigara bastırmayın.",
      "Keneyi patlatmayın, ezmeyin.",
      "Çıplak elle tutmayın.",
      "Belirti çıkarsa \"geçer\" diye beklemeyin."
    ],
    "keywords": [
      "kene",
      "kene ısırdı",
      "kene yapıştı",
      "kene tutundu",
      "kene nasıl çıkarılır",
      "kene çıkarma",
      "kkka",
      "kırım kongo",
      "kırım kongo kanamalı ateşi",
      "kene isirdi",
      "kene cikarma",
      "vücudumda kene var",
      "kene kafası kaldı"
    ],
    "sources": [
      "CDC — After a tick bite / Removing a tick",
      "T.C. Sağlık Bakanlığı HSGM — KKKA eğitim sunumu (2023)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: HSGM KKKA okul sağlığı sunumu 2023 (çıplak elle dokunmama, bez/eldiven/poşetle en kısa sürede çıkarma, yapamıyorsa sağlık kuruluşu, 10 gün içinde halsizlik, iştahsızlık, ateş, ağrı, bulantı, kusma, ishalde başvuru; sigara, kolonya, gaz yağı yok; ezmeme), Sağlık Bakanlığı açıklaması (memurlar.net). Değişiklik yok." },
    "alsoIn": ["doga"],
    "art": [
      null,
      "yaralanma-kene-eldiven",
      "yaralanma-kene-cimbiz",
      "yaralanma-kene-cekme",
      null,
      "yaralanma-kene-el-yikama",
      null,
      "yaralanma-kene-saglik",
      null,
      "yaralanma-kene-kontrol"
    ]
  },
  {
    "id": "yaralanma-su-toplama",
    "title": "Ayakta su toplaması ve ayak bakımı",
    "tag": "YARALANMA",
    "summary": "Su toplamış kabarcığı patlatmayın, yumuşak bir yara bandıyla örtün; çok yürürken ayakları kuru tutun ve sürtünen yeri erkenden bantlayın.",
    "steps": [
      "Ayakta yanma ya da sürtünme hissedince hemen durup bakın.",
      "Kızaran ama henüz su toplamamış yeri yara bandı ya da flasterle kaplayın.",
      "Kabarcığı patlatmayın. Yumuşak bir yara bandı ya da dolgulu pansumanla örtün.",
      "Kabarcık kendiliğinden patladıysa ellerinizi yıkayın ve sıvının akmasını bekleyin. Üstteki deriyi soymayın; temizleyip örtün.",
      "Ayaklarınızı her gün yıkayıp parmak araları dâhil iyice kurulayın.",
      "Islanan ya da terleyen çorabı değiştirin. Kalın, teri emen çorap giyin, yedek çorap taşıyın.",
      "Ayağa uygun, rahat ayakkabı giyin. Yeni ayakkabıyı önce kısa sürelerle alıştırın.",
      "Kabarcık sıcaksa, çevresi kızarıyorsa ya da içinde sarı-yeşil irin varsa sağlık kuruluşuna gidin.",
      "Şeker hastasıysanız ayaklarınızı her gün kontrol edin; küçük bir yarayı bile sağlık kuruluşuna gösterin."
    ],
    "dont": [
      "Kabarcığı iğneyle patlatmayın.",
      "Üstteki deriyi koparmayın.",
      "Islak çorapla yürümeye devam etmeyin.",
      "Enfekte kabarcığı görmezden gelmeyin.",
      "Mümkünse kabarcığa yol açan ayakkabıyı iyileşene kadar giymeyin."
    ],
    "keywords": [
      "ayağım su topladı",
      "ayak su toplaması",
      "ayakta su toplama",
      "ayakkabı vurdu",
      "topuk su topladı",
      "su kabarcığı",
      "ayak kabarcığı",
      "su toplaması",
      "uzun yürüyüş ayak",
      "ayak bakımı",
      "ayak vurması",
      "ayak su toplamasi",
      "nasır"
    ],
    "sources": [
      "NHS — Blisters"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NHS Blisters (patlatmama, yumuşak/dolgulu pansuman, patlayınca el yıkama ve sıvıyı akıtma, deriyi soymama, çorap/ayakkabı önlemleri, enfeksiyon belirtileri)." },
    "art": [
      "yaralanma-ayak-kontrol",
      "yaralanma-ayak-bantlama",
      "yaralanma-kabarcik-bant",
      null,
      "yaralanma-ayak-kurulama",
      null,
      null,
      "yaralanma-ayak-saglik",
      null
    ]
  },
  {
    "id": "yaralanma-kramp-zorlanma",
    "title": "Kas krampı ve kas zorlanması",
    "tag": "YARALANMA",
    "summary": "Krampta kası nazikçe gerip ovun; kas zorlanmasında ilk 2–3 gün dinlendirin, beze sarılı soğuk uygulayın, sarın ve yukarıda tutun.",
    "steps": [
      "Kramp girdiyse hareketi bırakın ve kası yavaşça gerin. Baldır krampında ayak ucunu kendinize doğru çekin.",
      "Kası hafifçe ovun. Ayağa kalkıp bacağa yük vermek de rahatlatabilir.",
      "Sıcakta uzun süre çalıştıysanız gölgede dinlenip su için.",
      "Kramp 10 dakikadan uzun sürüyorsa, uykunuzu bölüyorsa ya da bacakta şişlik, uyuşma varsa sağlık kuruluşuna danışın.",
      "Kas zorlandıysa ya da çektiyse işi, sporu bırakın; zorlanan kasa yük vermeyin.",
      "Beze sarılı buz ya da donmuş sebze poşetini 2–3 saatte bir, en fazla 20 dakika uygulayın.",
      "Gün içinde bölgeyi bir sargıyla destekleyin; dolaşımı kesecek kadar sıkmayın.",
      "Mümkün olduğunca bölgeyi yastık üstünde yukarıda tutun.",
      "İlk 2–3 gün sıcak uygulama, sıcak banyo, alkol ve masajdan kaçının.",
      "Kırılma sesi duyulduysa, şekil bozukluğu, uyuşma, karıncalanma, morarma ya da soğukluk varsa hemen acile gidin. Ağrı ya da şişlik artıyorsa, hiç yük veremiyorsanız sağlık kuruluşuna gidin."
    ],
    "dont": [
      "Zorlanan kasa ilk günlerde masaj yapmayın.",
      "İlk 2–3 gün sıcak uygulamayın.",
      "Buzu doğrudan cilde koymayın.",
      "Ağrıya rağmen spora ya da ağır işe devam etmeyin."
    ],
    "keywords": [
      "kramp",
      "kramp girdi",
      "bacağıma kramp girdi",
      "baldır krampı",
      "kas krampı",
      "kas kasılması",
      "kas çekmesi",
      "kas zorlanması",
      "kas yırtığı",
      "adale çekmesi",
      "kasım çekti",
      "kramp girdi ne yapmalı",
      "gece krampı",
      "bacak kasıldı"
    ],
    "sources": [
      "NHS — Leg cramps",
      "NHS — Sprains and strains"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NHS Leg cramps (germe/ovma, yük verme, 10 dk, uyku, şişlik/uyuşma); NHS Sprains and strains (PRICE, 20 dk/2–3 saat, sıcak-alkol-masajdan kaçınma, acil ve 111 ölçütleri)." },
    "art": [
      "yaralanma-kramp-germe",
      "yaralanma-kramp-ovma",
      null,
      null,
      null,
      "yaralanma-kas-soguk",
      "yaralanma-kas-sargi",
      "yaralanma-kas-yukari",
      null,
      null
    ]
  }
];
