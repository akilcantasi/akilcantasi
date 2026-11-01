// Rehber kategorisi: Fırtına, sıcak, soğuk
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "hava",
  "title": "Fırtına, sıcak, soğuk",
  "hint": "Yıldırım, sıcak çarpması",
  "art": "cat-hava",
  "color": "#7dd3fc",
  "order": 8
};

export const GUIDES: Guide[] = [
  {
    "id": "sicak-carpmasi",
    "title": "Sıcak çarpması",
    "tag": "İLK YARDIM",
    "summary": "Sıcakta bilinci bulanıklaşan, vücudu çok ısınan kişi için 112'yi arayın, onu serin yere alıp hemen soğutun.",
    "steps": [
      "Sıcakta cildi çok sıcak olan, bilinci bulanıklaşan, tuhaf davranan, kusan ya da nöbet geçiren kişide sıcak çarpmasından şüphelenin ve 112'yi arayın.",
      "Kişiyi gölgeye ya da serin bir yere alın.",
      "Fazla giysilerini çıkarın.",
      "Hemen soğutun: mümkünse boynuna kadar soğuk suya sokun, başını dışarıda tutun ve yanından ayrılmayın.",
      "Bu mümkün değilse vücudunu bol suyla ıslatın ve sürekli yelpazeleyin.",
      "Boynuna, koltuk altlarına ve kasıklarına bezle sarılmış soğuk ya da buz koyun.",
      "Ambulans gelene ya da kişi kendine gelene kadar soğutmaya devam edin.",
      "Bilinci kapanır ama nefes alırsa yan yatırın. Nefes almıyorsa kalp masajına başlayın."
    ],
    "dont": [
      "Bilinci bulanık ya da kapalı kişiye su ya da başka bir şey içirmeyin.",
      "Ateş düşürücü ilaç vermeyin; sıcak çarpmasında işe yaramaz.",
      "Alkol ya da kafeinli içecek vermeyin.",
      "Suya sokulan kişiyi bir an bile yalnız bırakmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "sıcak çarpması",
      "sicak carpmasi",
      "güneş çarpması",
      "gunes carpmasi",
      "güneş çarptı",
      "sıcak çarptı",
      "sıcaktan bayıldı",
      "sıcakta bayıldı",
      "güneşte bayıldı",
      "sıcak bitkinliği",
      "vücudu yanıyor sıcaktan",
      "sıcaktan fenalaştı",
      "hararet bastı"
    ],
    "sources": [
      "NHS — Heat exhaustion and heatstroke",
      "ABD NWS — Heat illness (sıcak çarpmasında sıvı verme)",
      "American Red Cross — Extreme heat safety",
      "ERC Kılavuzları 2021 — İlk Yardım (soğuk suya daldırma)",
      "T.C. Sağlık Bakanlığı — Güneş/sıcak çarpmasında yapılması gerekenler (2025)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı 8 Temmuz 2025 önerileri (serin ve hava akımlı yer, sıkı giysiyi gevşet, soğuk suyla soğut, bilinç kapalıysa su verme, gecikmeden sağlık kuruluşu); NHS, NWS, American Red Cross; Bakanlık ifadesiyle uyum için 'su içirmeyin' maddesi 'bilinci bulanık ya da kapalı kişiye' diye daraltıldı. ERC 2025 daldırma önerisi açılamadı." },
    "art": [
      "call-112",
      "hava-golgeye-al",
      null,
      "hava-soguk-suya-daldir",
      "hava-islat-yelpazele",
      "hava-buz-noktalari",
      null,
      "sicak-yan-yatir"
    ]
  },
  {
    "id": "firtina-yildirim",
    "title": "Fırtına ve yıldırım",
    "tag": "HAVA",
    "summary": "Gök gürültüsü duyduğunuzda yıldırım tehlikesi vardır: hemen sağlam bir binaya ya da kapalı bir araca girin.",
    "steps": [
      "Gök gürültüsü duyuyorsanız yıldırım düşebilir. Hemen sağlam bir binaya ya da kapalı bir araca girin.",
      "İçeride pencere ve kapılardan uzak durun. Fişe takılı aletlere ve kablolara dokunmayın; duş ve musluk kullanmayın.",
      "Fırtına gelmeden uçabilecek eşyaları içeri alın ve elektrikli aletlerin fişini çekin.",
      "Açıkta kaldıysanız tepeden, sırttan ve açık araziden inin. Tek başına duran ağaçtan, direkten ve metal çitten uzaklaşın.",
      "Gruptaysanız aranızı açın; yıldırım birinden diğerine geçmesin.",
      "Denizden, gölden ve havuzdan hemen çıkın. Çadır yıldırıma karşı korumaz.",
      "Son gök gürültüsünden sonra 30 dakika bekleyin, sonra dışarı çıkın.",
      "Yıldırım çarpan kişiye dokunmak güvenlidir: 112'yi arayın, nefes almıyorsa kalp masajına başlayın."
    ],
    "dont": [
      "Ağacın altına sığınmayın.",
      "Fırtınada devrilebilecek duvar, tabela, iskele ve ağaçların yanında beklemeyin.",
      "Kopmuş elektrik tellerine yaklaşmayın."
    ],
    "keywords": [
      "fırtına",
      "firtina",
      "yıldırım",
      "yildirim",
      "şimşek",
      "gök gürültüsü",
      "kasırga",
      "rüzgar",
      "kuvvetli rüzgar",
      "yıldırım çarptı",
      "sağanak",
      "gök gürlüyor",
      "çatı uçtu"
    ],
    "sources": [
      "ABD NWS — Lightning Safety: Outdoors",
      "ABD NWS — Lightning Safety: Indoors (fırtına sırasında fiş çekmeyin)",
      "MGM — Meteorolojik Uyarılar",
      "MGM — Yıldırım broşürü"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MGM Yıldırım broşürü (kapalı bina en iyi koruma, açıkta güvenli yer yok, tek ağaç/direkten uzak dur, grupta ayrılın, banyo-duş yok, araçta camları kapat, son gök gürültüsünden sonra en az 30 dk, yıldırım mağduru elektrik yükü taşımaz, dokunmak güvenli); NWS Lightning Safety. Değişiklik yok." },
    "art": [
      "hava-yildirim-iceri-gir",
      "hava-iceride-fise-dokunma",
      "hava-fisten-cek",
      "hava-yalniz-agac-yasak",
      null,
      "hava-sudan-cik",
      "hava-30-dakika-bekle",
      "firtina-kpr"
    ]
  },
  {
    "id": "hava-kar-firtinasi",
    "title": "Kar fırtınası ve dondurucu soğukta evde güvenlik",
    "tag": "HAVA",
    "summary": "Zorunlu değilse dışarı çıkmayın, evde tek bir odada toplanın, kat kat giyinin ve soba-ısıtıcıları güvenli kullanın.",
    "steps": [
      "Zorunlu olmadıkça dışarı çıkmayın. MGM ve AFAD uyarılarını takip edin: sarı uyarı dikkatli olun, turuncu tehlikeli, kırmızı çok tehlikeli demektir.",
      "Evin tek bir odasında toplanın. Kullanmadığınız odaların kapılarını kapatın.",
      "Kapı altlarına havlu sıkıştırın, perdeleri kapatın.",
      "Kat kat, bol ve hafif giysiler giyin; başınızı ve ayaklarınızı örtün. Terlerseniz bir kat çıkarın.",
      "Düzenli yemek yiyin. Sıcak, kafeinsiz ve alkolsüz içecekler için.",
      "Sobayı ve ısıtıcıyı yanıcı eşyalardan uzak tutun, odayı ara ara havalandırın. Kapalı yerde mangal ya da jeneratör yakmayın.",
      "Güvenli olunca baca ve kombi çıkışının önünü kardan temizleyin.",
      "Yaşlı, bebekli ve yalnız yaşayan komşularınızı arayıp kontrol edin.",
      "Titreme, uyuşukluk, konuşma bozukluğu ya da parmaklarda beyazlaşma ve his kaybı varsa kişiyi ısıtın, 112'yi arayın.",
      "Araçta mahsur kaldıysanız araçtan ayrılmayın. Egzozun önünü kardan temizleyin; motoru saatte yaklaşık 10 dakika çalıştırın ve camı biraz aralayın."
    ],
    "dont": [
      "Ocağı ya da fırını ısınmak için açık bırakmayın.",
      "Kar yemeyin; vücut ısınızı düşürür.",
      "Ara vermeden ağır kar küremeyin; kalbi zorlar.",
      "Çatıdaki buz sarkıtlarının altından geçmeyin."
    ],
    "keywords": [
      "kar fırtınası",
      "kar firtinasi",
      "tipi",
      "yoğun kar",
      "kar yağışı",
      "dondurucu soğuk",
      "aşırı soğuk",
      "soğuk hava dalgası",
      "kutup soğuğu",
      "ayaz",
      "buzlanma",
      "kar yolu kapattı",
      "karda mahsur kaldık",
      "araçta mahsur kar",
      "elektrik kesildi kış"
    ],
    "sources": [
      "ABD NWS — Winter Weather Safety (fırtına sırasında)",
      "CDC — Winter Weather: Prepare Your Home",
      "AFAD — Buzlanma, don ve çığ uyarıları",
      "MGM — MeteoUyarı nedir (sarı, turuncu, kırmızı uyarı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MGM MeteoUyarı (sarı: potansiyel tehlikeli, turuncu: tehlikeli, kırmızı: çok tehlikeli); NWS Winter Weather Safety. 1. adıma MGM uyarı renklerinin anlamı eklendi." },
    "art": [
      null,
      "hava-tek-odada-toplan",
      null,
      "hava-kat-kat-giyin",
      null,
      "hava-soba-guvenli",
      "hava-baca-kar-temizle",
      null,
      null,
      "hava-arac-egzoz-kar"
    ]
  },
  {
    "id": "hava-cig",
    "title": "Çığ",
    "tag": "HAVA",
    "summary": "Çığa yakalanırsanız yana kaçıp yüzeyde kalmaya çalışın; biri gömüldüyse 112'yi arayın ve yardım beklemeden son görüldüğü yerden aramaya başlayın.",
    "steps": [
      "Çığ uyarısı varsa dik, karlı yamaçlara ve vadi tabanlarına gitmeyin. AFAD ve MGM uyarılarına uyun.",
      "Çığa yakalanırsanız yana doğru kaçmaya çalışın.",
      "Kayak ve sopa gibi eşyaları bırakın. Yüzeyde kalmak için kollarınız ve bacaklarınızla çabalayın.",
      "Çığ yavaşlarken bir elinizle ağzınızı ve burnunuzu kapatıp yüzünüzün önünde nefes boşluğu açın. Diğer elinizi yüzeye doğru uzatın.",
      "Gömüldüyseniz sakin kalın, nefesinizi ve gücünüzü koruyun. Sesler yaklaşınca bağırın.",
      "Biri gömüldüyse önce yeni çığ tehlikesine bakın. Kişinin son görüldüğü yeri işaretleyin ve 112'yi arayın.",
      "Yardım çağırmak için oradan ayrılmayın. İlk 10 dakika hayatidir; hemen aramaya başlayın.",
      "Son görüldüğü yerin aşağısında, kar üstünde eldiven ya da eşya gibi izlere bakın.",
      "Çığ vericisi, sonda ve kürek varsa hemen kullanın. Kişiyi bulunca önce yüzünü ve ağzını açın.",
      "Çıkarılan kişi nefes almıyorsa temel yaşam desteğine başlayın. Islak giysilerini değiştirip sıcak tutun."
    ],
    "dont": [
      "Yardım getirmek için gömülü arkadaşınızı bırakıp uzaklaşmayın.",
      "Çığ riski olan yamaçta tek başınıza yürümeyin ya da kaymayın.",
      "Kar saçaklarının (korniş) üstüne ve altına girmeyin.",
      "Çatıdan kar ve buz düşebilecek yerlerin altında durmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "çığ",
      "cig",
      "çığ düştü",
      "cig dustu",
      "çığ altında kaldı",
      "çığa yakalandım",
      "karın altında kaldı",
      "kar kütlesi",
      "kayakta çığ",
      "çığ vericisi",
      "çığ sondası",
      "çığ riski"
    ],
    "sources": [
      "SLF/KAT (İsviçre) — Çığ kazası bilgi kartı 2026",
      "Avalanche.org — Companion rescue",
      "AFAD — Çığ ve buzlanma uyarıları",
      "MGM — Çığ broşürü"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MGM Çığ broşürü (yavaş ve alçak kenara kaç, kayak ve batonları at, yüzme hareketiyle üstte kal, bir elle ağız-burnu koru, diğer eli yüzeye uzat, nefes boşluğunu genişlet); Avalanche.org companion rescue. 4. adım MGM'ye göre 'bir el ağız-burun, diğer el yüzeye' olarak düzeltildi. Arkadaş kurtarma adımları MGM'de yok." },
    "art": [
      null,
      "hava-cig-yana-kac",
      null,
      "hava-cig-nefes-boslugu",
      null,
      "hava-cig-son-gorulen-yer",
      null,
      null,
      "hava-cig-sonda-kurek",
      "cig-kpr"
    ],
    "alsoIn": [
      "doga"
    ]
  },
  {
    "id": "hava-toz-firtinasi",
    "title": "Toz fırtınası",
    "tag": "HAVA",
    "summary": "İçeride kalıp kapı ve pencereleri kapatın; dışarı çıkmanız gerekirse FFP2/N95 maske takın, araçtaysanız yoldan çıkıp durun ve ışıkları söndürün.",
    "steps": [
      "İçeride kalın. Kapı ve pencereleri kapatın.",
      "Klima varsa iç hava (devridaim) modunda çalıştırın.",
      "Dışarı çıkmanız gerekiyorsa kısa tutun. İyi oturan FFP2 ya da N95 maske takın; yoksa ağzınızı ve burnunuzu ıslak bezle kapatın.",
      "Gözlük takın. Gözünüze toz kaçarsa ovalamayın, temiz suyla yıkayın.",
      "Ağır iş ve spor yapmayın. Astım ya da KOAH hastasıysanız ilacınızı yanınızda tutun, doktorunuzun verdiği planı uygulayın.",
      "Araç kullanıyorsanız görüş düşünce yavaşlayın ve mümkünse yoldan tamamen çıkıp durun.",
      "Yol dışında durunca tüm ışıkları kapatın, el frenini çekin, ayağınızı frenden çekin.",
      "Yoldan çıkamıyorsanız yavaşça, farlar açık, yol çizgisini izleyerek ilerleyin. Yolun üstünde durmayın.",
      "Nefes darlığı, göğüs ağrısı ya da geçmeyen hırıltı olursa 112'yi arayın."
    ],
    "dont": [
      "Yolun üstünde durmayın; arkadan gelen araç çarpabilir.",
      "Yol kenarında dururken fren lambası ya da farlar yanık kalmasın; arkadakiler sizi takip edip çarpabilir.",
      "Çocukları, yaşlıları ve hastaları dışarıda tutmayın."
    ],
    "keywords": [
      "toz fırtınası",
      "toz firtinasi",
      "kum fırtınası",
      "çöl tozu",
      "toz bulutu",
      "toz taşınımı",
      "afrika tozu",
      "hava tozlu",
      "çamur yağmuru",
      "tozdan nefes alamıyorum",
      "görüş sıfır toz"
    ],
    "sources": [
      "ABD NWS — Dust Storm Safety",
      "NSW Health (Avustralya) — Dust storms",
      "MGM — Toz taşınımı uyarıları"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NWS Dust Storm Safety (yoldan çık, ışıkları kapat, el freni, ayak frenden, yolda durma, çıkamazsan farlar açık orta çizgiyi izle). Sağlık maddeleri bu oturumda ayrıca doğrulanamadı." },
    "art": [
      "hava-pencereleri-kapat",
      null,
      "hava-toz-maske",
      null,
      null,
      "hava-toz-arac-yol-disi",
      null,
      null,
      "call-112"
    ]
  },
  {
    "id": "hava-hortum",
    "title": "Hortum (tornado)",
    "tag": "HAVA",
    "summary": "Hortum yaklaşırken sağlam bir binanın en alt katındaki penceresiz iç odaya geçin, çömelip başınızı ve boynunuzu koruyun.",
    "steps": [
      "Hemen sağlam bir binaya girin. Bodruma ya da en alt kattaki penceresiz bir iç odaya, banyoya ya da koridora geçin.",
      "Pencerelerden, camlı kapılardan ve dış duvarlardan uzak durun.",
      "Yere çömelin, başınızı ve boynunuzu kollarınızla koruyun. Varsa yorgan, şilte ya da kaskla üstünüzü örtün.",
      "Konteyner, prefabrik, çadır ve baraka güvenli değildir. Vakit varsa sağlam bir binaya geçin.",
      "Okul ve AVM gibi yerlerde spor salonu, yemekhane gibi geniş salonlardan uzak durun; görevlilere uyun.",
      "Araçtaysanız en yakın sağlam binaya gidin.",
      "Gidemiyorsanız araçta eğilip başınızı koruyun ya da araçtan çıkıp hendek gibi alçak bir yere yatın, başınızı kollarınızla örtün.",
      "Denizde oluşan hortum karaya geçebilir. Kıyıdaysanız uzaklaşıp sağlam bir binaya girin.",
      "Hortum geçince kopmuş tellerden, gaz kokusundan ve hasarlı binalardan uzak durun. Yaralılar için 112'yi arayın."
    ],
    "dont": [
      "Hortumu izlemek ya da video çekmek için dışarıda kalmayın.",
      "Köprü ya da üst geçit altına sığınmayın.",
      "Pencereleri açmak için vakit kaybetmeyin."
    ],
    "keywords": [
      "hortum",
      "tornado",
      "hortum geliyor",
      "hortum çıktı",
      "su hortumu",
      "denizde hortum",
      "hortum uyarısı",
      "girdap rüzgar",
      "hortum oldu",
      "hortumda ne yapilir"
    ],
    "sources": [
      "ABD NWS — Tornado Safety: During",
      "AFAD — Afet Bilinci Eğitimi",
      "MGM — Meteorolojik Uyarılar"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NWS Tornado Safety — During (bodrum/iç oda, pencereden uzak, spor salonu-yemekhane gibi geniş salonlardan kaçın, prefabrik/çadır güvenli değil, araçta eğil ya da hendeğe yat)." },
    "art": [
      "hava-hortum-ic-oda",
      null,
      "hava-hortum-comel-bas-koru",
      null,
      null,
      null,
      "hava-hortum-hendek",
      null,
      "hava-kopuk-tel-yasak"
    ]
  },
  {
    "id": "hava-sicak-dalgasi",
    "title": "Aşırı sıcak (sıcak hava dalgası)",
    "tag": "HAVA",
    "summary": "En sıcak saatlerde dışarı çıkmayın, susamayı beklemeden su için, evi serin tutun; yaşlıları ve çocukları her gün kontrol edin.",
    "steps": [
      "10.00–16.00 arası zorunlu değilse dışarı çıkmayın. Bu saatlerde ağır iş ve spor yapmayın.",
      "Susamayı beklemeden gün boyu sık sık su için. Doktorunuz sıvıyı kısıtladıysa ona danışın.",
      "Alkolden, çok şekerli ve kafeinli içeceklerden uzak durun.",
      "Gündüz perde ve panjurları kapatın. Gece hava serinleyince pencereleri açın.",
      "Açık renkli, bol giysi ve şapka giyin. Ilık duşla ya da ıslak bezle serinleyin.",
      "Evde klima yoksa günün bir kısmını klimalı, serin bir yerde geçirin.",
      "Doktorun verdiği ilaçları ona danışmadan bırakmayın.",
      "65 yaş üstü, kronik hasta ve yalnız yaşayan yakınlarınızı ve komşularınızı her gün arayın.",
      "Çocukları ve hayvanları park halindeki araçta bir dakika bile bırakmayın.",
      "Baş dönmesi, bulantı, kramp, çok terleme olursa serin yere geçip dinlenin, su için. Bilinç bulanıklaşırsa 112'yi arayın."
    ],
    "dont": [
      "Çok sıcakta vantilatörü tek önlem sanmayın; serin bir yere gidin.",
      "Öğle güneşinde bebek ve çocukları dışarıda bekletmeyin.",
      "Bebek arabasının üstünü battaniyeyle örtmeyin; içi çok ısınır."
    ],
    "keywords": [
      "sıcak hava dalgası",
      "sicak hava dalgasi",
      "aşırı sıcak",
      "asiri sicak",
      "aşırı sıcaklar",
      "kavurucu sıcak",
      "bunaltıcı sıcak",
      "sıcaktan bunaldım",
      "çok sıcak",
      "40 derece",
      "yaz sıcağı",
      "serinleme",
      "evde klima yok sıcak",
      "sıcaklar"
    ],
    "sources": [
      "WHO — Climate change, heat and health (halk için öneriler)",
      "NHS — Heatwave: how to cope in hot weather",
      "T.C. Sağlık Bakanlığı — Aşırı sıcak hava uyarıları"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı sıcak hava uyarısı (mecbur kalmadıkça 10.00–16.00 arası dışarı çıkmayın; açık renkli rahat giysi, şapka; sıvı alın), WHO, NHS. Değişiklik yok." },
    "art": [
      "hava-sicak-saatler",
      "hava-su-ic",
      null,
      "hava-perde-kapat",
      null,
      null,
      null,
      "hava-komsu-kontrol",
      "hava-arac-cocuk-yasak",
      null
    ]
  },
  {
    "id": "hava-dolu",
    "title": "Dolu",
    "tag": "HAVA",
    "summary": "Dolu başlayınca sağlam bir binaya ya da araca girin, pencerelerden uzak durun ve dolu bitene kadar dışarı çıkmayın.",
    "steps": [
      "Hemen sağlam bir binaya girin. Dolu tamamen bitene kadar dışarı çıkmayın.",
      "İçeride pencerelerden, cam kapılardan ve çatı pencerelerinden uzak durun. Perdeleri kapatın.",
      "Açıktaysanız başınızı çanta, mont ya da kollarınızla koruyarak en yakın binaya gidin.",
      "Araçtaysanız güvenli bir yerde yolun dışına çekip durun. Dolu bitene kadar araçtan inmeyin.",
      "Araçta camlardan uzak durun, gözlerinizi kapatın, öne eğilin ya da koltuğa uzanın. Çocuğu bedeninizle koruyun.",
      "Doluyla gelen sele dikkat edin. Alt geçitlerden, dere yataklarından ve çukur yerlerden uzak durun.",
      "Gök gürültüsü varsa yıldırım tehlikesi de vardır. Fişe takılı aletlere ve musluğa dokunmayın.",
      "Dolu bitince kırık camlara, sarkan dallara ve kopmuş elektrik tellerine dikkat ederek çıkın."
    ],
    "dont": [
      "Aracınızı ya da bahçenizi korumak için dolu yağarken dışarı çıkmayın.",
      "Köprü ya da üst geçit altında durup yolu kapatmayın.",
      "Tek başına duran ağacın altına sığınmayın."
    ],
    "keywords": [
      "dolu",
      "dolu yağıyor",
      "dolu yagiyor",
      "dolu yağışı",
      "iri dolu",
      "ceviz büyüklüğünde dolu",
      "doluya yakalandım",
      "dolu arabaya",
      "dolu arabada",
      "arabadayken dolu",
      "dolu fırtınası",
      "buz yağıyor"
    ],
    "sources": [
      "ABD Kuzey Dakota Acil Durum Hizmetleri / NWS — Hail Safety",
      "MGM — Kuvvetli sağanak ve dolu uyarıları",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: NWS Lightning Safety Indoors (fırtınada fiş çekme yerine aletlere dokunmama). Dolu sayfası (Ready.gov) bu oturumda açılamadı; diğer maddeler önceki kaynağa dayanıyor." },
    "art": [
      "hava-dolu-iceri-gir",
      null,
      "hava-dolu-bas-koru",
      null,
      "hava-dolu-arac-ici",
      "hava-alt-gecit-yasak",
      null,
      null
    ]
  }
];
