// Sıfırdan paketi: Yiyecek bulma — hayvansal kaynaklar (kurbağa, kerevit, salyangoz, elle ve gece balıkçılığı,
// buz deliği, balık tanıma, kıyı canlıları, larva ve böcek, korunan hayvanlar, parazit ve leş güvenliği)
// Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  "id": "sifirdan-yiyecek-hayvansal",
  "name": "Sıfırdan: Yiyecek bulma — hayvansal kaynaklar",
  "desc": "Kurbağa, kerevit, salyangoz, elle ve gece balıkçılığı, buz deliği, yengeç, deniz kestanesi, ahtapot, arı larvası ve çekirge. Zehirli benzerler, koruma altındaki hayvanlar, parazit, kene ve ölü hayvan riskleri için uyarılarla.",
  "version": 1
};

export const CATEGORIES: CategoryMeta[] = [
  {
    "id": "sf-yh-kurbaga",
    "title": "Kurbağa, kerevit, salyangoz",
    "hint": "Kurbağayı tanıma, gece yakalama, temizleme, pişirme; kerevit kapanı; salyangoz",
    "art": "sf-yh-kapak-kurbaga",
    "color": "#86efac",
    "order": 180
  },
  {
    "id": "sf-yh-balik",
    "title": "Balık ve deniz canlıları",
    "hint": "Elle balık, gece oltası, buz deliği, balık tanıma, zehirli balık, yengeç, ahtapot",
    "art": "sf-yh-kapak-balik",
    "color": "#7dd3fc",
    "order": 181
  },
  {
    "id": "sf-yh-guvenlik",
    "title": "Böcek, yumurta ve av güvenliği",
    "hint": "Arı larvası, çekirge, korunan hayvanlar, kene, sülük, ölü hayvan",
    "art": "sf-yh-kapak-guvenlik",
    "color": "#fcd34d",
    "order": 182
  }
];

export const GUIDES: PackGuide[] = [
  // ───────────────────────── KURBAĞA, KEREVİT, SALYANGOZ ─────────────────────────
  {
    "id": "sf-yh-kurbaga-tanima",
    "category": "sf-yh-kurbaga",
    "title": "Kurbağa 1: yenen tür ve zehirli benzerleri",
    "tag": "KURBAĞA",
    "summary": "Yalnız suyun içinde ya da hemen kıyısında yaşayan, ıslak ve parlak derili, uzun arka bacaklı su kurbağasını alın; kuru ve siğilli karakurbağasına, küçük yeşil ağaç kurbağasına, semendere ve parlak renkli kurbağaya dokunmayın.",
    "note": "Türkiye'de kurbağa avı 1380 sayılı Su Ürünleri Kanunu'na dayanan ticari su ürünleri tebliğiyle düzenlenir; izne, ile göre değişen ilkbahar yasak dönemine ve ağırlık sınırına bağlıdır, bazı illerde ve endemik türlerde tamamen yasaktır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Türkiye'de yenen kurbağa su kurbağasıdır (ova kurbağası, Pelophylax). Göl, gölet, sulama kanalı, çeltik tarlası ve yavaş akan derelerde yaşar; ürkünce hemen suya atlar. Avrupa'ya bacağı için ihraç edilen tür budur.",
      "Su kurbağasını tanıyın: deri ıslak ve parlaktır; rengi zeytin yeşili, kahverengi ya da gridir; sırtta koyu lekeler ve çoğu zaman ortada açık yeşil bir çizgi vardır. Arka bacaklar uzun ve çizgilidir, arka ayak parmakları perdelidir. Büyükleri burun ucundan gövde sonuna 10–15 cm olur.",
      "Karakurbağasını ayırın (Bufo ve yeşil benekli gece kurbağası): deri kuru, mat ve siğil siğildir; gözlerin hemen arkasında iki yanda şişkin, uzunca bez kabartısı vardır. Kısa bacaklarla yürür ya da kısa sıçrar; çoğu zaman sudan uzakta, bahçede, taş altında, geceleri yol kenarında görülür.",
      "Karakurbağasının derisindeki bezler kalbi etkileyen bir zehir salar. Eti, derisi ve yumurtası yenmez: yiyenlerde kalp ritmi bozulmuş, nefes güçleşmiş ve 6–24 saat içinde ölüm görülmüştür. Pişirmek güvenli yapmaz.",
      "Ağaç kurbağasını ayırın (Hyla): küçüktür (3–5 cm), parlak yaprak yeşilidir, parmak uçlarında yuvarlak yapışkan diskler vardır; çalı, saz ve ağaç üzerinde durur. Yiyecek değeri yoktur; almayın.",
      "Orman ve dağ kurbağalarını almayın: kahverengi, karada nemli ormanda ve dağ derelerinde gezen, gözünün arkasında koyu bir leke taşıyan kurbağalar. Bunların bazıları yalnız Türkiye'de yaşar ve koruma altındadır (ör. Bolkar Dağları'ndaki Toros kurbağası).",
      "Semendere ve parlak renkli olanlara dokunmayın: siyah-sarı lekeli, kuyruklu semenderler; turuncu, kırmızı ya da sarı karınlı ve sırtında belirgin X işareti olan kurbağalar zehirlidir.",
      "Emin değilseniz almayın. Hangi kurbağa olursa olsun dokunduktan sonra ellerinizi sabunla yıkayın; gözünüze ve ağzınıza dokunmayın. Sağlıklı görünen kurbağa da salmonella taşır. 5 yaş altı çocuklar kurbağa ellemesin.",
      "Üreme döneminde (ilkbahar ve yaz başı, su ısınınca) birbirine sarılmış çiftlere ve suda jöle gibi yumurta kümelerine dokunmayın. Çukurova'da (Seyhan ve Ceyhan deltaları) yapılan bir çalışmada aşırı toplama yüzünden su kurbağası sayısının yaklaşık yüzde 20 azaldığı bulunmuştur; kaynağı ancak üremeye dokunmamak ve küçükleri bırakmak korur."
    ],
    "art": [
      null,
      "sf-yh-kurbaga-su",
      "sf-yh-kurbaga-kara",
      null,
      "sf-yh-kurbaga-agac",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Karakurbağasını ve semenderi yemeyin, çocukların ve köpeklerin ağzına almasına izin vermeyin.",
      "Kurbağayı ve yumurtasını çiğ yemeyin.",
      "Çiğ kurbağa etini ya da derisini yaraya, göze lapa olarak koymayın; deri altına yerleşen tenya larvası bu yolla da geçer.",
      "Kurbağaya dokunduktan sonra ellerinizi yıkamadan yemek yemeyin."
    ],
    "keywords": [
      "kurbağa yenir mi",
      "hangi kurbağa yenir",
      "su kurbağası nasıl tanınır",
      "karakurbağası zehirli mi",
      "karakurbagasi ayirt etme",
      "ağaç kurbağası zehirli mi",
      "kurbağa türleri türkiye",
      "ova kurbağası",
      "kurbaga bacagi hangi tur",
      "semender zehirli"
    ],
    "sources": [
      "Wikipedia — Marsh frog (Pelophylax ridibundus): görünüş, boy, yaşam alanı, Türkiye (https://en.wikipedia.org/wiki/Marsh_frog)",
      "Wikipedia — Bufotoxin: yenince zehirlenme ve ölüm (https://en.wikipedia.org/wiki/Bufotoxin)",
      "Wikipedia — European green toad: parotoid bezleri, gece etkinliği (https://en.wikipedia.org/wiki/European_green_toad)",
      "ABD Ordusu FM 21-76 — Bölüm 8, amfibiler: karakurbağası, parlak renkli ve X işaretli kurbağa (https://www.wilderness-survival.net/food-1.php)",
      "CDC — Reptiles and amphibians: salmonella, 5 yaş altı çocuklar (https://www.cdc.gov/healthy-pets/about/reptiles-and-amphibians.html)",
      "Wikipedia — Sparganosis: çiğ kurbağa eti ve lapa yoluyla bulaşma (https://en.wikipedia.org/wiki/Sparganosis)",
      "TURJAF — Türkiye'de kurbağa avcılığı ve ihracatı: il bazlı yasak dönemler, Rana holtzi yasağı (https://agrifoodscience.com/index.php/TURJAF/article/download/654/304/5818)",
      "Yeni Akit / Oryx 2020 — Seyhan-Ceyhan deltası su kurbağası %20 azalışı, 30 g altı toplamama önerisi (https://www.yeniakit.com.tr/haber/eulu-akademisyenden-kurbaga-avciligi-uyarisi-1260616.html)",
      "Lexpera — 6/1 Ticari su ürünleri tebliği 2024/20 içindekiler: madde 44 'Kurbağa, kara salyangozu ve sülük avcılığı' (madde metni ücretli, okunamadı) (https://www.lexpera.com.tr/mevzuat/tebligler/6-1-numarali-ticari-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-2024-20)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Oryx/Yeni Akit haberi açıldı; '%20 azalma' doğru, 'üç yılda' süresi kaynakta yok, düzeltildi. 2024/20 tebliğinin kurbağa maddesinin (44) yalnız başlığı doğrulandı, metni okunamadı; bu yüzden not tarih vermeden tutucu bırakıldı. Tür tanıma (Pelophylax, Bufo/Bufotes, Hyla, Rana, semender) önceki kaynaklarla tutarlı; Türkiye'ye özgü ayrım ölçütleri biyologça gözden geçirilmeli." }
  },
  {
    "id": "sf-yh-kurbaga-yakalama",
    "category": "sf-yh-kurbaga",
    "title": "Kurbağa 2: gece fenerle yakalama",
    "tag": "KURBAĞA",
    "summary": "Ilık, rüzgârsız ve karanlık bir gecede iki kişi kıyıda sessizce yürüyün; biri feneri kurbağanın gözüne sabit tutarken diğeri arkadan yaklaşıp kurbağayı belinden kavrasın.",
    "note": "Türkiye'de olağan koşullarda kurbağa avı izne ve ile göre değişen yasak döneme bağlıdır; amatör balıkçılıkta avlanmak için her türlü ışık kullanmak yasaktır (Amatör su ürünleri tebliği 2024/21, madde 8). Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Yeri gündüz bulun: sığ kıyısı, çamurlu düzlüğü ve kenarında saz, kamış, söğüt ya da sık ot olan durgun ya da yavaş akan su. Gündüz kurbağalar suda ve otların arasındadır; gece kıyıya çıkar ve kolay görünür.",
      "Ilık, rüzgârsız ve karanlık bir gece seçin. Dolunayda kurbağa kendini açıkta hisseder, ürkek olur; aysız ya da bulutlu gecede yaklaşmak kolaydır.",
      "Hazırlanın: çizme ya da suya dayanıklı ayakkabı, el feneri ya da kafa lambası, kapaklı kova ya da ağzı bağlanan bez torba, varsa uzun saplı kepçe. İki kişi gidin; gece su kenarında yalnız dolaşmayın.",
      "Kıyı boyunca yavaş ve sessiz yürüyün. Kurbağa ayak titreşimini hisseder; sert basmayın, suyu çalkalamayın, konuşmayı kısın.",
      "Feneri kıyıda ve su yüzünde yavaşça gezdirin. Kurbağanın gözleri ışıkta iki parlak nokta gibi görünür.",
      "Kurbağayı bulunca ışığı doğrudan gözlerine tutun ve kıpırdatmayın. Işık gözünü kamaştırır; çoğu kurbağa yerinde kalır. Feneri tutan kişi olduğu yerde durur.",
      "Diğer kişi ışığın arkasından, gölgesini kurbağanın üstüne düşürmeden yaklaşsın. Elinizi yavaşça arkadan getirip hızla, arka bacakların hemen önünden, belden kavrayın. Kepçe kullanıyorsanız arkadan ve üstten kapatın; kurbağa ileri ve suya doğru sıçrar.",
      "Kurbağayı hemen kapaklı kovaya koyun; dibine ıslak ot koyun, kovayı serin ve gölgede tutun. Ertesi gün temizleyecekseniz bile canlı ve serin tutun.",
      "Yalnız o gün yiyeceğiniz kadar alın. Avuç içinden küçük, yarım yumurtadan hafif (yaklaşık 30 gramın altı) kurbağaları ve karnı yumurtayla şişkin dişileri suya bırakın.",
      "Elinizi göremediğiniz otun ve deliğin içine sokmayın; kıyıda yılan da kurbağa avlar. Önce feneri ve bir sopayı kullanın."
    ],
    "art": [
      null,
      null,
      null,
      null,
      null,
      "sf-yh-kurbaga-fener",
      "sf-yh-kurbaga-kavrama",
      null,
      null,
      null
    ],
    "dont": [
      "Gece bilmediğiniz, derin ya da çamurlu suya girmeyin; dibi görünmeyen kıyıda yürümeyin.",
      "Kıyıda yürüyen, kuru ve siğilli derili karakurbağasını toplamayın.",
      "Canlı kurbağayı başka bir göle, dereye taşımayın; hastalık yayılır.",
      "Kurbağayı güneşte, kapalı sıcak kapta bekletmeyin; ölür ve eti çabuk bozulur."
    ],
    "keywords": [
      "kurbağa nasıl yakalanır",
      "gece kurbağa avı",
      "fenerle kurbağa yakalama",
      "kurbaga yakalamak",
      "kurbağa avı nasıl yapılır",
      "kurbağa toplamak",
      "kurbağa elle yakalama",
      "gece fener kurbağa"
    ],
    "sources": [
      "Missouri Koruma Dairesi — Getting started frog hunting: gece ışıkla yaklaşma, ay ışığı, titreşim, ekipman (https://mdc.mo.gov/hunting-trapping/species/frog/getting-started-frog-hunting)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 — madde 8 ışık yasağı (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)",
      "TURJAF — Türkiye'de kurbağa avcılığı: il bazlı yasak dönemler, üreme dönemi mayıs-haziran (https://agrifoodscience.com/index.php/TURJAF/article/download/654/304/5818)",
      "ABD Ordusu FM 21-76 — Bölüm 8: kurbağa su kenarından ayrılmaz, gece ışıkla yakalama (https://www.wilderness-survival.net/food-1.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yöntem MDC ve FM 21-76 ile tutarlı; mızrak/zıpkın yok. 30 g altı kurbağayı bırakma eklendi (eski 3/1 tebliğde asgari 30 g; Oryx yazarlarının önerisi de 30 g); güncel 2024/20 madde 44 metni okunamadığından yasal sınır olarak değil, koruma önlemi olarak yazıldı. Belden kavrama tekniği tek kaynaklı kaldı." }
  },
  {
    "id": "sf-yh-kurbaga-temizleme",
    "category": "sf-yh-kurbaga",
    "title": "Kurbağa 3: öldürme, temizleme ve hijyen",
    "tag": "KURBAĞA",
    "summary": "Kurbağayı başının tepesine sert bir yüzeyde tek güçlü darbeyle bayıltın ve ara vermeden beynini sivri uçla yok edin; yalnız baş kesmek yetmez. Ayrı bir tahtada, mümkünse eldivenle derisini bacaklardan sıyırın, deriyi ve iç organları gömün, bıçağı ve ellerinizi sabunla yıkayın.",
    "note": "Türkiye'de olağan koşullarda kurbağa avı izne, yasak döneme ve ağırlık sınırına bağlıdır (Ticari su ürünleri tebliği 2024/20, madde 44); bu bilgi yalnız gerçek hayatta kalma durumu içindir. Kurbağa salmonella ve insana geçen tenya larvası taşır; çiğ et ve deriyle teması en aza indirin.",
    "steps": [
      "Yeri hazırlayın: yalnız bu işe ayırdığınız bir tahta ya da düz taş, keskin bıçak ya da makas, kaba bez, temiz su ve atıklar için bir çukur. Varsa eldiven giyin; elinizde kesik ya da çatlak varsa mutlaka örtün.",
      "Bayıltın: kurbağayı belinden ya da arka bacaklarından tutun, başını sert, düz ve kımıldamayan bir yüzeye (tahta, düz taş; yumuşak toprak olmaz) koyun. Başın tepesine, iki gözün hemen arkasına, kafadan geniş düz yüzlü bir taş ya da sopayla dik, tek ve güçlü bir darbe vurun. Ya da kurbağayı ters çevirip başının tepesini tahtanın sert kenarına sertçe çarpın. Kurbağa kıpırdamıyorsa hemen sonraki adıma geçin; kıpırdıyorsa hemen bir darbe daha vurun.",
      "Ara vermeden beyni yok edin: burnunu parmağınızla aşağı bükün; kafatasının arkasında, boyunla birleştiği yerde yumuşak bir çukur hissedersiniz. Bıçağın ya da sivri bir şişin ucunu oradan öne doğru 1–2 cm sokup sağa sola çevirin; sonra ucu çıkarmadan gövdeye doğru çevirip omuriliği kesin. Başı keserseniz kesilen başı da hemen taşla ezin: kurbağanın beyni kesilmiş başta bir süre canlı kalabilir, yalnız baş kesmek yetmez. Bundan sonra bacakların seğirmesi ve tuz değince kıpırdaması sinir tepkisidir.",
      "Ön ve arka ayakları bilekten kesip atın. Sonra beli çepeçevre, yalnız deriyi kesecek biçimde kesin.",
      "Bel kesiğinden deriyi tutun; kaygan ise bezle ya da kerpetenle tutun. Çorap çıkarır gibi bacaklardan aşağı doğru sıyırın.",
      "Arka bacakları belden ikisi birlikte kesip gövdeden ayırın, sonra ortadan ikiye bölün. Bacak arasında kalan iç organ parçalarını kesip atın. Büyük kurbağada sırt ve ön bacak etini de alabilirsiniz; karın boşluğunu açarsanız bağırsakları delmeden çıkarın.",
      "Deriyi, başı ve iç organları yemeyin. Hepsini çukura gömün ya da ateşte yakın; köpeğe ve kediye vermeyin.",
      "Etleri temiz suyla birkaç kez yıkayın; çamur, deri parçası ve kan kalmasın.",
      "Bıçağı, tahtayı ve ellerinizi sabun ve suyla yıkayın. Çiğ kurbağaya değen kaba, tahtaya ve ele pişmiş yiyecek değmesin.",
      "Eti aynı gün pişirin. Ilıkta 2 saatten (32 °C üstü sıcakta 1 saatten) fazla bekletmeyin; beklemesi gerekiyorsa üstünü örtüp en serin yerde tutun (soğuk su kabı, kar)."
    ],
    "art": [
      null,
      null,
      null,
      null,
      "sf-yh-kurbaga-deri",
      "sf-yh-kurbaga-bacak",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kurbağanın derisini canlıyken yüzmeyin; önce bayıltıp beynini yok edin.",
      "Kurbağayı canlı canlı soğukta, buzda ya da karda bekleterek, dondurarak, tuza ya da kaynar suya atarak öldürmeye çalışmayın; acı çeker.",
      "Yalnız başını kesip bırakmayın; kesilen başta beyin bir süre yaşar, başı da hemen ezin.",
      "Kurbağa derisini ve iç organlarını yemeyin.",
      "Çiğ kurbağa etini kestiğiniz tahtada pişmiş yiyecek ya da sebze doğramayın.",
      "Elinizdeki açık yarayla eldivensiz temizlik yapmayın."
    ],
    "keywords": [
      "kurbağa nasıl temizlenir",
      "kurbağa derisi yüzme",
      "kurbağa bacağı çıkarma",
      "kurbağa nasıl öldürülür",
      "kurbaga temizleme",
      "kurbağa bacağı hazırlama",
      "kurbağa kesmek",
      "kurbağa hijyen"
    ],
    "sources": [
      "Honest Food — How to clean a frog: ayaklar, bel kesiği, deriyi sıyırma, bacakları ayırma, deriyi yememe (https://honest-food.net/how-to-clean-a-frog/)",
      "CDC — Reptiles and amphibians: salmonella ve el yıkama (https://www.cdc.gov/healthy-pets/about/reptiles-and-amphibians.html)",
      "Wikipedia — Sparganosis: çiğ kurbağa eti ve yara lapası (https://en.wikipedia.org/wiki/Sparganosis)",
      "British Columbia Çevre Bakanlığı — Individual American Bullfrog Euthanasia by BC Residents (SOP): sert yüzeyde başın tepesine darbe, ardından beyin yok etme (pithing), baş kesme tek başına kabul edilmez, soğutma-dondurma kabul edilmez (https://portalext.nrs.gov.bc.ca/documents/processed_files/Individual%20American%20Bullfrog%20Euthanasia%20by%20BC%20Residents_FINAL.pdf)",
      "FoodSafety.gov — 4 steps to food safety: bozulabilir yiyecek dışarıda en çok 2 saat, 32 °C üstünde 1 saat (https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: BC hükümeti kurbağa ötanazi SOP'u (AVMA ilkelerine dayanır) açıldı. Önceki metin 'darbe + baş kesme' idi; SOP'a göre baş kesme tek başına kabul edilmez, mutlaka beyin yok etme izlemeli; soğutma ve dondurma da kabul edilmez. Adım 2–3 buna göre yeniden yazıldı (darbe yeri, sert yüzey, ikinci darbe, foramen magnumdan 1–2 cm şiş, omurilik). Temizleme sırası Honest Food ile tutarlı. 'Kesilen başı taşla ezme' SOP'taki şişle yok etmenin sahadaki karşılığı olarak eklendi; veteriner görüşü alınmalı." }
  },
  {
    "id": "sf-yh-kurbaga-pisirme",
    "category": "sf-yh-kurbaga",
    "title": "Kurbağa 4: parazit ve iyi pişirme",
    "tag": "KURBAĞA",
    "summary": "Kurbağa eti tenya larvası ve başka parazitler taşıyabilir; bacakları kemiğin dibine kadar beyaz ve opak olana, et kemikten kolayca ayrılana dek pişirin; çiğ, yarı pişmiş ya da yalnız tuz-sirkeyle hazırlanmış kurbağa yemeyin.",
    "note": "Uzman gözetimi olmadan çiğ ya da az pişmiş kurbağa yemek tenya larvası (sparganoz) ve salmonella hastalığına yol açabilir; deri altında gezen şişlik ya da gözde şişlik olursa sağlık kuruluşuna gidin.",
    "steps": [
      "Kurbağa eti insana geçen bir tenya larvası (sparganum) ve başka kurtçuklar taşıyabilir. Larva deri altında, kasta ya da gözde gezen bir şişlik yapar. Korunmanın yolu eti iyi pişirmektir.",
      "Haşlayın: bacakları alacak kadar suyu kaynatın, bacakları atın, su yeniden kaynayınca et beyazlaşıp kemikten kolayca ayrılana dek pişirmeyi sürdürün.",
      "Pişip pişmediğini en kalın yerden, uyluktan kemiğe kadar keserek bakın: et her yerde beyaz ve opak olmalı; pembe, saydam yer ya da kanlı su kalmamalı. Termometre varsa kemiğe değmeden en kalın yerden ölçün; iç sıcaklık en az 74 °C olsun.",
      "Kızartacak ya da közleyecekseniz önce haşlayın, sonra yağda ya da közde kızartın. Doğrudan közde dışı yanar, kemik dibi çiğ kalabilir.",
      "Güveç ya da çorba: haşlanmış bacakları sebze, yabani ot ya da tahılla birlikte pişirin. Haşlama suyunu da kullanabilirsiniz.",
      "Tuzlama, sirkeye yatırma, kurutma ve tütsüleme tek başına parazitleri güvenilir biçimde öldürmez. Saklayacaksanız eti önce tam pişirin.",
      "Pişmeden tadına bakmayın. Pişmiş eti çiğ etin durduğu kaba ya da tahtaya koymayın.",
      "Kurbağanın yaşadığı göletten arıtmadan su içmeyin: aynı tenya larvası sudaki çok küçük canlılarla da geçer. Suyu kaynatın ya da arıtın.",
      "Kurbağa yedikten sonraki haftalarda deri altında yer değiştiren, kaşınan bir şişlik, gözde şişme ya da kızarıklık olursa sağlık kuruluşuna gidin ve kurbağa yediğinizi söyleyin."
    ],
    "art": [
      null,
      "sf-yh-kurbaga-haslama",
      "sf-yh-kurbaga-pisme-kontrol",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kurbağayı çiğ ya da yarı pişmiş yemeyin.",
      "Eti yalnız sirke, limon ya da tuzla 'pişirmeyi' denemeyin.",
      "Kurbağa yaşayan gölet suyunu arıtmadan içmeyin.",
      "Pişirmeden kurutup saklamayın."
    ],
    "keywords": [
      "kurbağa nasıl pişirilir",
      "kurbağa bacağı pişirme",
      "kurbağa parazit",
      "kurbağa eti tenya",
      "kurbaga eti pisirme",
      "kurbağa çiğ yenir mi",
      "sparganoz",
      "kurbağa kızartma"
    ],
    "sources": [
      "CDC DPDx — Sparganosis: az pişmiş ara konak eti ve kopepodlu su (https://www.cdc.gov/dpdx/sparganosis/index.html)",
      "Wikipedia — Sparganosis: çiğ kurbağa ve yılan eti, korunma (https://en.wikipedia.org/wiki/Sparganosis)",
      "CDC — Angiostrongylus: çiğ ya da az pişmiş salyangoz, kurbağa yemeyin (https://www.cdc.gov/angiostrongylus/about/index.html)",
      "FoodSafety.gov — Safe minimum internal temperatures: tavşan ve geyik (yabani ya da çiftlik) 71 °C, kümes hayvanı ve artıklar 74 °C; kurbağa için ayrı satır yok (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "CDC — Diphyllobothrium: tuzlama, tütsü ve turşu paraziti öldürmez (https://www.cdc.gov/diphyllobothrium/about/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FoodSafety.gov tablosu açıldı; 'yabani av' satırı yok, 'Rabbit and venison' 71 °C, kümes hayvanı ve artıklar 74 °C; kurbağa için değer yok. Kurbağa salmonella da taşıdığından tutucu olan 74 °C'ye çıkarıldı (önce 71 °C). Sparganoz ve Angiostrongylus uyarıları önceki CDC kaynaklarıyla tutarlı. Tuz-sirke-tütsünün yetmediği bilgisi balık tenyasından genellenmiş, öyle kaldı (tutucu yönde)." }
  },
  {
    "id": "sf-yh-kerevit-kapan",
    "category": "sf-yh-kurbaga",
    "title": "Kerevit kapanı: yapma, yemleme ve temizleme",
    "tag": "KEREVİT",
    "summary": "Pet bidondan huni ağızlı bir kapan yapıp içine bez torbada balık artığı koyun, akşam taşlı dibe bırakıp sabah kaldırın; küçükleri ve yumurtalıları bırakın, kalanları kırmızılaşıp eti opak olana dek kaynatın.",
    "note": "Türkiye'de olağan koşullarda kerevit avı izne, yasak döneme (eski tebliğlerde 1 Kasım–30 Haziran) ve boy sınırına (10 cm) bağlıdır; ticari avda yemle kerevit avlamak, amatör balıkçılıkta pinter ve sepet kullanmak yasaktır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Kerevit (tatlı su istakozu) temiz, durgun ya da yavaş akan, taşlı ve kıyısı oyuklu sularda yaşar; geceleri beslenir. Gündüz sığ sudaki taşların altına bakarak orada kerevit olup olmadığını anlayın.",
      "Kapanı yapın: 5 litrelik pet bidonun ya da büyük pet şişenin üstten dörtte birini kesin. Kestiğiniz huni biçimli parçayı ters çevirip ağzı içeri bakacak biçimde gövdeye geçirin; kenarlarından tel ya da iple dikin. Huni ağzı bir kerevitin rahatça geçeceği kadar geniş olsun.",
      "Gövdeye kızgın bir telle ya da bıçak ucuyla çok sayıda küçük delik açın; su girsin, kapan batsın, yemin kokusu yayılsın.",
      "Yem: balık başı, balık iç organı, et ya da kemik artığı. Yemi bir bez parçasına sarıp ya da delikli küçük bir kaba koyup kapanın dibine bağlayın; kerevit yemi bitiremesin, koku sabaha dek sürsün.",
      "Kapanın içine bir taş koyup ağırlaştırın, sağlam bir ip bağlayın. Akşamüstü yarım metre ile bir buçuk metre derinliğe, taşlı dibe ya da kıyı oyuğunun yanına bırakın; ipin ucunu kıyıdaki bir köke bağlayın.",
      "Sabah erken kaldırın. Kerevitleri sırtlarından, kıskaçların gerisinden tutarak kovaya alın. Avuç içinden kısa olanları ve karnının altında yumurta taşıyan dişileri suya geri bırakın.",
      "Kerevitleri temiz suda birkaç kez çalkalayarak çamurdan arındırın. Bağırsaklarını boşaltmak isterseniz temiz su dolu bir kapta 12–24 saat bekletin, suyu birkaç kez değiştirin ve kabı gölgede tutun. Suya tuz katmanın yararı yoktur.",
      "Ölmüş ya da kötü kokan kerevitleri atın. Canlıları kaynayan suya atıp kabuk tamamen kırmızılaşana ve et beyaz, opak olana dek pişirin. Çiğ, tuzlu ya da sirkeli kerevit akciğere yerleşen bir parazit bulaştırabilir.",
      "Pişince kuyruğu gövdeden çevirerek ayırın, kabuğunu soyun. Kuyruk etinin sırtındaki ince koyu bağırsağı çekip çıkarın. Kıskaç etini taşla kabuğu kırarak alın.",
      "Kapanı ve canlı kereviti başka bir göle ya da dereye taşımayın; kerevit hastalıkları bu yolla yayılır. Kapanı kullandığınız suda bırakın ya da kurutup öyle taşıyın."
    ],
    "art": [
      null,
      "sf-yh-kerevit-sise-kapan",
      null,
      null,
      "sf-yh-kerevit-kapan-kurma",
      null,
      null,
      null,
      "sf-yh-kerevit-bagirsak",
      null
    ],
    "dont": [
      "Kereviti çiğ ya da yarı pişmiş yemeyin.",
      "Kirli, kokan, köpüklü sudan kerevit toplamayın.",
      "Kapanı kontrol etmeden günlerce suda bırakmayın; içindeki kerevitler ölür ve bozulur.",
      "Kapanı ya da kereviti bir sudan diğerine taşımayın."
    ],
    "keywords": [
      "kerevit kapanı",
      "kerevit kapanı yapımı",
      "pet şişe kerevit tuzağı",
      "kerevit yemi",
      "kerevit temizleme",
      "kerevit nasıl pişirilir",
      "tatlı su istakozu tuzak",
      "kerevit bagirsagi",
      "kerevit kapan"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8: kerevit gece etkin, gündüz taş altında, iç organ yemi (https://www.wilderness-survival.net/food-1.php)",
      "LSU AgCenter — Kerevit arındırma mitleri: tuz yararsız, 12–24 saat temiz su (https://apps.lsuagcenter.com/news_archive/2014/february/headline_news/Myths-persist-about-saltwater-purges-tail-curl-for-cooking-crawfish.htm)",
      "CDC — Paragonimiasis: çiğ, tuzlu, turşu kerevit; en az 63 °C (https://www.cdc.gov/paragonimus/about/index.html)",
      "Ankara İl Tarım Md. — 3/1 Ticari su ürünleri tebliği broşürü: kerevit yasak dönemi, 10 cm, yem yasağı, araç dezenfeksiyonu (https://ankara.tarimorman.gov.tr/Belgeler/liftet/Ticari%20Ama%C3%A7l%C4%B1%20Su%20%C3%9Cr%C3%BCnleri%20Avc%C4%B1l%C4%B1k.pdf)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 — madde 13 iç sularda pinter ve sepet yasağı (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC Paragonimus sayfası açıldı: 63 °C ve çiğ-tuzlu-turşu kerevit riski teyit. Diğer sayılar (12–24 saat arındırma, eski tebliğ 10 cm ve 1 Kasım–30 Haziran) yazar kaynaklarıyla tutarlı, yeniden açılmadı; 2024/20 madde 43 yalnız başlıkla (Lexpera) doğrulandı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: FM 21-76 gece etkinliği, taş altı, iç organ yemi; LSU tuzlu arındırma yararsız, anlamlı arındırma 12–24 saat temiz su; CDC 63 °C ve çiğ-tuzlu-turşu riski; eski ticari tebliğ (2012–2016) 1 Kasım–30 Haziran yasak, 10 cm, yemle av yasağı, araçları sudan suya taşıma yasağı; amatör tebliğ 2024/21 pinter-sepet yasağı. Güncel ticari tebliğin (2024/20) kerevit maddesi (madde 43) ücretli erişim nedeniyle okunamadı." }
  },
  {
    "id": "sf-yh-salyangoz",
    "category": "sf-yh-kurbaga",
    "title": "Salyangoz toplama, aç bırakarak arındırma ve pişirme",
    "tag": "SALYANGOZ",
    "summary": "Yağmurdan sonra temiz yerlerden büyük kabuklu bahçe salyangozlarını toplayın, birkaç gün aç bırakıp sonra temiz yeşillikle besleyerek bağırsaklarını boşaltın, kaynatıp iç organ ucunu atın ve iyice pişirin; asla çiğ yemeyin.",
    "note": "Türkiye'de kara salyangozu toplama su ürünleri mevzuatıyla düzenlenir (ticari tebliğde kurbağa ve sülükle aynı madde); izne bağlıdır ve yaz başında yasak dönem uygulanır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Toplanacak tür: büyük, krem-kahverengi şeritli kabuklu bahçe ve orman salyangozu (Türk salyangozu, Helix). Kabuk çapı 3–6 cm olur. Karadeniz, Marmara, Ege ve İç Anadolu'da yaygındır.",
      "Yağmurdan sonra, akşamüstü ya da sabah erken, havanın nemli olduğu saatlerde toplayın: çalı dipleri, taş duvarlar, yaprak döküntüsü, gölgeli bahçe kenarları. Eldiven giyin ya da sonra ellerinizi iyice yıkayın.",
      "Toplamayın: kabuksuz sümüklüböcek, kırık kabuklu ya da kokan salyangoz; yol kenarı, çöplük, lağım yakını, ilaçlanmış tarla, bağ ve bahçe. Gölet ve dere salyangozlarını almayın.",
      "Arındırma: salyangozları hava alan, kapağı delikli bir kaba (sepet, delikli kova, tülle örtülü sandık) koyun. İlk 2 gün yem vermeyin, her gün biraz su serpin.",
      "Sonraki günlerde yalnız temiz bildiğiniz yeşillik, havuç ya da biraz un verin. Dışkıları verdiğiniz yemin rengine dönünce (havuçta turuncu) bağırsakları temizlenmiş demektir. Kabı her gün temizleyin.",
      "Her gün ölüleri ayıklayın: dokununca tepki vermeyen, kabuğundan sarkan ya da kötü kokan salyangozu atın.",
      "Kabukları temiz suyla yıkayın. Salyangozları kaynayan suya atın ve et kabuktan kolayca çıkana dek kaynatın. Bu ilk suyu dökün.",
      "Eti iğne ya da sivri çöple çevirerek çıkarın. Kıvrık ucundaki koyu renkli iç organ kısmını kesip atın.",
      "Etleri tuz ve sirkeli suda ovup birkaç kez yıkayın; sümük gider. Sonra yeniden haşlayın ve güveçte, sebzeyle ya da yağda soteleyerek iyice pişirin.",
      "Salyangozu asla çiğ ya da yarı pişmiş yemeyin; insana geçen kurtçuk ve parazit taşıyabilir. Pişmemiş salyangoza dokunduktan sonra ellerinizi yıkayın; salyangozun gezdiği yeşillikleri iyice yıkayın."
    ],
    "art": [
      null,
      "sf-yh-salyangoz-toplama",
      null,
      "sf-yh-salyangoz-arindirma",
      null,
      null,
      null,
      "sf-yh-salyangoz-et-cikarma",
      null,
      null
    ],
    "dont": [
      "Salyangozu çiğ ya da az pişmiş yemeyin.",
      "Arındırmadan pişirmeyin; bağırsaktaki yaprak ve toprak, zehirli bir ot yemişse onun kalıntısı ete geçer.",
      "Sümüklüböcek ve su salyangozu toplamayın.",
      "İlaçlanmış bahçe ve tarladan, yol kenarından toplamayın."
    ],
    "keywords": [
      "salyangoz toplama",
      "salyangoz yenir mi",
      "salyangoz nasıl pişirilir",
      "salyangoz arındırma",
      "salyangoz aç bırakma",
      "bahçe salyangozu yemek",
      "helix salyangoz",
      "salyangoz temizleme",
      "salyangoz parazit"
    ],
    "sources": [
      "Küre Ansiklopedi — Türk salyangozu (Helix lucorum): yayılış, boy, Türkiye'deki parazit bulguları, haziran-temmuz yasakları (https://kureansiklopedi.com/tr/detay/turk-salyangozu-helix-lucorum-424a5)",
      "Michelin Guide — Ingredient: snails (escargot): 2 gün aç, sonra havuçla dışkı turuncu olana dek (https://guide.michelin.com/en/article/features/ingredient-snails-escargot)",
      "Mother Earth News — Snails and slugs: arındırma, kaynatma, parazit, çıplak elle tutmama (https://www.motherearthnews.com/real-food/snails-and-slugs-ze0z1906znad/)",
      "CDC — Angiostrongylus (rat lungworm): çiğ salyangoz, eldiven, sebze yıkama (https://www.cdc.gov/angiostrongylus/about/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Ölçüler ve parazit uyarıları yazar kaynaklarıyla tutarlı; 2024/20 madde 44 başlığında kara salyangozunun geçtiği Lexpera içindekilerinden teyit edildi. Kaynatma süresi sayısız kaldı (tutucu). Değişiklik yok. Yazar notu — Kaynaklarla teyit: Küre Helix lucorum 30–60 mm, Türkiye bölgeleri, %70–90 nemde etkin, Van'da %22 trematod larvası, haziran-temmuz av yasakları; Michelin 2 gün aç + havuç; Mother Earth kaynatma ve pişirme, çıplak elle tutmama; CDC çiğ salyangoz ve eldiven. Kaynatma süresi için sayısal kaynak bulunamadı; 'et kolayca çıkana dek' yazıldı. Güncel tebliğin salyangoz hükmü (madde 44) okunamadı." }
  },

  // ───────────────────────── BALIK VE DENİZ CANLILARI ─────────────────────────
  {
    "id": "sf-yh-elle-balik",
    "category": "sf-yh-balik",
    "title": "Elle balık yakalama: taş altı, sığ su, kuruyan gölcük",
    "tag": "ELLE BALIK",
    "summary": "Yalnız sığ ve yavaş suda, taşın ya da oyuğun altındaki balığa arkadan yaklaşıp karnını okşayarak elinizi solungaçlarına ilerletin ve hızla kavrayıp kuru yere atın; göremediğiniz deliğe elinizi sokmayın.",
    "note": "Türkiye'de olağan koşullarda dere ve göl yatağını değiştirerek ya da bentle kurutarak balık toplamak, zehir, kireç, karpit ve balık sersemleten bitki kullanmak yasaktır (Amatör su ürünleri tebliği 2024/21, madde 13); iç sularda av yasakları ve boy sınırları vardır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Güvenlik önce: yalnız dizden sığ, akıntısı zayıf ve dibini gördüğünüz suya girin. Ayakkabıyla girin; kırık cam, keskin taş ve kaygan yosun vardır. Soğuk suda uzun kalmayın; titreme başlayınca çıkıp ısının.",
      "Balığın saklandığı yerler: büyük taşların altı ve gölgesi, kıyıdaki oyuklar, suya sarkan kökler, sığ derenin derin cepleri. Balıklar gündüz bu gölgelerde, başları akıntıya karşı durur.",
      "Akıntının aşağısından, yani balığın arkasından yaklaşın. Yavaş yürüyün, taş yuvarlamayın, gölgenizi suya düşürmeyin.",
      "Gıdıklama: taşın ya da oyuğun yanına diz çökün. Avucunuz yukarı, parmaklarınız yukarı kıvrık olacak biçimde elinizi yavaşça taşın altına sokun. Balığın kuyruğuna değince parmak ucunuzla karnını hafifçe okşayın ve elinizi yavaş yavaş başına doğru ilerletin.",
      "Eliniz solungaçların altına gelince hızla kavrayın ve balığı tek hareketle kıyıya, kuru yere fırlatın. Hemen başına sert bir darbe vurup öldürün.",
      "Kuruyan gölcükler: yazın dere çekilince ana sudan ayrı kalan küçük birikintilerde balıklar sıkışır. İki kişi bir bezi, çuvalı ya da sepeti gölcüğün bir köşesinden ötekine sürerek balıkları köşeye toplayıp alttan kaldırın.",
      "Elinizi göremediğiniz deliğe sokmayın; içinde yılan, yengeç, kerevit ya da keskin dal olabilir. Önce bir sopayla yoklayın.",
      "Büyük yayın balığının deliğine elinizi ya da ayağınızı sokmayın: balık eli sıkıca kavrar, su altında çıkamayabilirsiniz. Boğulma ve parmak kopması görülmüştür.",
      "Kısa sürede sonuç alamazsanız soğuk suda ısrar etmeyin; elle yakalama çok enerji harcatır. Olta ve kapanı kurup bekleyin.",
      "Balığı hemen temizleyin ve et opaklaşıp kolayca lif lif ayrılana dek pişirin (iç sıcaklık en az 63 °C)."
    ],
    "art": [
      null,
      "sf-yh-elle-balik-yeri",
      null,
      "sf-yh-elle-gidiklama",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Derin, akıntılı ya da bulanık suya girmeyin; tek başınıza suya girmeyin.",
      "Zehir, kireç, karpit ya da bitki ezmesiyle balık sersemletmeyin; su bütün canlılar ve sizin için zehirlenir.",
      "Görmediğiniz deliğe, kovuğa elinizi sokmayın.",
      "Tatlı su balığını çiğ yemeyin."
    ],
    "keywords": [
      "elle balık yakalama",
      "elle balık tutmak",
      "taş altından balık",
      "balık gıdıklama",
      "sığ suda balık yakalama",
      "oltasız balık tutma",
      "elle alabalik yakalama",
      "dere balığı elle"
    ],
    "sources": [
      "Wikipedia — Trout tickling: elin taş altına sokulması, karnı okşayarak solungaca ilerleme, kavrayıp kuru yere atma (https://en.wikipedia.org/wiki/Trout_tickling)",
      "Wikipedia — Noodling: yayın deliğinde boğulma, yaralanma, sopayla yoklama, iki kişi (https://en.wikipedia.org/wiki/Noodling)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 — madde 13 yatak değiştirme, zehir, karpit, kireç yasağı (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)",
      "CDC — Diphyllobothrium: tatlı su balığı 63 °C (https://www.cdc.gov/diphyllobothrium/about/index.html)",
      "ABD Ordusu FM 21-76 — Bölüm 8: tatlı su balığını parazit için pişirin (https://www.wilderness-survival.net/food-1.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC Diphyllobothrium sayfası açıldı: 63 °C teyit. Yasal not amatör tebliğle tutarlı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: Trout tickling adımları (avuç yukarı, kuyruktan başa okşama, solungaç altında kavrama, darbe, kuru yere atma); Noodling tehlikeleri ve sopayla yoklama; amatör tebliğ madde 13(3) zehir-karpit-kireç-bitki ve 13(7) yatak değiştirip kurutma yasağı; CDC 63 °C. Akıntının aşağısından yaklaşma kaynakta yok, balığın akıntıya dönük durmasından çıkarım." }
  },
  {
    "id": "sf-yh-gece-balik",
    "category": "sf-yh-balik",
    "title": "Gece balıkçılığı: kamış olta ve fener",
    "tag": "GECE BALIĞI",
    "summary": "Hava kararmadan kamış oltaları dipte beslenen balıkların uğradığı çukur ve dönemeçlere kokulu yemle kurun, uçlarına zil bağlayıp bekleyin; feneri suya değil ayağınıza tutun.",
    "note": "Türkiye'de olağan koşullarda amatör balıkçılıkta balık çekmek için her türlü ışık kullanmak yasaktır; yalnız can ve mal güvenliği için 50 watta kadar ışık serbesttir (Amatör su ürünleri tebliği 2024/21, madde 8). Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Kamış olta yapın: 3–4 m uzunlukta düz, esnek bir kamış ya da ince söğüt dalı seçin. Ucuna kamış boyunda misina ya da ince sağlam ip bağlayın. İpin ucuna iğneyi, iğnenin bir karış yukarısına küçük bir ağırlık (delikli taş, kurşun parçası) bağlayın.",
      "Gece yayın, sazan ve benzeri dipte beslenen balıklar kıyıya yaklaşır. Yeri gündüz seçin: derin bir çukurun kenarı, akıntının yavaşladığı dönemeç, suya giren ağaç kökleri.",
      "Yem: solucan, kurtçuk, ciğer ya da balık iç organı. Dipte beslenen balıklar kokulu yeme gelir.",
      "Oltaları hava kararmadan kurun; yemi dibe indirin. Kamışı yere çakılı çatallı bir sopaya yaslayın ve dibini kıyıdaki bir köke ya da kazığa bağlayın; büyük balık kamışı suya çekebilir.",
      "Kamışın ucuna küçük bir zil, birbirine değen iki teneke kapak ya da beyaz bir bez bağlayın; karanlıkta vurgunu duyar ya da görürsünüz. Birkaç kamışı yan yana kurup aralarında bekleyin.",
      "Feneri balığa değil, kendi ayağınıza ve kıyıya tutun. Işığı suya tutmak balığı ürkütür; kullanmadığınızda kapatın.",
      "Gerçek açlık durumunda ışıkla toplama: sığ ve durgun suya kıyıdan fener tutulunca küçük balıklar ışığa toplanır. Bunları ince gözlü kepçe ya da bezle alttan kaldırarak alın; büyük balık için yem olarak da kullanın.",
      "Vurgun gelince kamışı hızla yukarı kaldırın ve balığı kıyıya doğru geri yürüyerek çekin. Büyük balıkta ipi parmağınıza dolamayın; ip parmağı keser.",
      "Gece su kenarında tek kalmayın. Kaygan ve çamurlu kıyıdan, dik yardan uzak durun; ıslak giysiyle soğukta beklemeyin."
    ],
    "art": [
      "sf-yh-kamis-olta",
      null,
      null,
      null,
      "sf-yh-kamis-zil",
      null,
      "sf-yh-fener-kepce",
      null,
      null
    ],
    "dont": [
      "Akü, jeneratör ya da elektrikle balık sersemletmeyin; hem yasak hem ölümcüldür.",
      "Karanlıkta suya girmeyin; kıyıdan çalışın.",
      "Misinayı parmağınıza ya da bileğinize dolamayın.",
      "Yakaladığınız balığı sabaha dek ılık suda, kovada bekletmeyin; hemen öldürüp temizleyin."
    ],
    "keywords": [
      "gece balık tutma",
      "gece balıkçılığı",
      "kamış olta yapımı",
      "fenerle balık",
      "zilli olta",
      "dip oltası gece",
      "gece yayın balığı",
      "kamis olta"
    ],
    "sources": [
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 — madde 8 ışık yasağı ve 50 W istisnası (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)",
      "5/1 Ticari su ürünleri tebliği 2020/20 — madde 13: iç sularda ışıkla avcılık yasağı (https://faolex.fao.org/docs/pdf/tur207882.pdf)",
      "ABD Ordusu FM 21-76 — Bölüm 8: balık ve yem (https://www.wilderness-survival.net/food-1.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Yasal not (ışık yasağı, 50 W istisnası) yazar kaynağıyla tutarlı; yöntem silah veya zıpkın içermiyor. Kamış ölçüleri tek kaynaklı pratik bilgi olarak kaldı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: amatör tebliğ madde 8(8) avlanma amaçlı her türlü ışık yasağı, 50 W güvenlik ışığı istisnası, madde 8(7) elektrik akımı yasağı; ticari tebliğ 2020/20 madde 13 iç sularda ışıkla avcılık yasağı. Kamış ölçüleri, zil ve dipte beslenen balığın gece kıyıya gelmesi genel balıkçılık bilgisi; ikinci bağımsız kaynakla doğrulanmadı." }
  },
  {
    "id": "sf-yh-buz-balik",
    "category": "sf-yh-balik",
    "title": "Buz deliğinden balık tutma",
    "tag": "BUZ",
    "summary": "Buza ancak yürüyerek tek kişi için en az 15 cm sağlam şeffaf buz varsa, ipe bağlı ve arkadaşla çıkın; küçük bir delik açıp kısa oltayla yemi dibe yakın tutun, buz kırılırsa geldiğiniz yöne dönüp tekmeleyerek çıkın ve sürünerek uzaklaşın.",
    "note": "Uzman gözetimi olmadan buza çıkmak ölümcül olabilir: buz kırılırsa soğuk su dakikalar içinde kas gücünü alır. Türkiye'de iç sularda av yasakları ve boy sınırları geçerlidir; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Buzun kalınlığını ölçmeden çıkmayın. Tek kişinin yürümesi için en az 15 cm sağlam, şeffaf-mavi buz; birkaç kişi için en az 20 cm gerekir. Beyaz, karlı buz bunun yarısı kadar dayanıklıdır; kalınlığı iki katı olmalı. Gri buza hiç basmayın.",
      "Kıyıdan başlayıp birkaç adımda bir deneyin: balta, keski ya da sivri demir çubukla delik açın ve kalınlığı bir dal üzerine işaretleyerek ölçün. Dere ağızları, sazlıklar, kaynak çıkan yerler, köprü altları ve kıyıya yakın koyu lekeler incedir.",
      "Yanınızda bulunsun: belinize bağlı 10–15 m ip ve ipin öbür ucunu kıyıda tutan bir arkadaş; boynunuzda iki sivri çivili tahta tutamak (buza saplamak için); kuru yedek giysi. Asla tek başınıza çıkmayın.",
      "Deliği açın: balta ya da keskiyle bir karış çapında delik. Buz parçalarını kepçe ya da elle temizleyin. Deliği gerekmedikçe büyütmeyin; kenarı zayıflar.",
      "Kısa olta: yarım metrelik bir çubuğa ip sarın, uca küçük iğne ve ağırlık bağlayın. Yemi (solucan, kurtçuk, balık eti) dibe indirip biraz yukarıda tutun. Soğukta balık yavaştır; ipi ara ara hafifçe oynatın.",
      "Bayraklı düzenek: deliğin üstüne çapraz bir çubuk koyun, ipi ona bağlayın ve ipe bir bez parçası iliştirin. Balık çekince bez oynar ya da suya iner; böylece birkaç deliği aynı anda izlersiniz.",
      "Islanmayın ve üşümeyin: diz çökerken altınıza dal, post ya da çuval koyun; ıslak eldiveni hemen değiştirin. Rüzgâra karşı bir siper kurun.",
      "Buz kırılırsa: yardım için bağırın, nefesinizi toplayın, çırpınmayın. Geldiğiniz yöne dönün, kollarınızı buzun üstüne uzatın, tutamakları saplayın ve ayaklarınızla tekme atarak gövdenizi buzun üstüne kaydırın.",
      "Çıkınca ayağa kalkmayın. Kollarınızı ve bacaklarınızı açıp ağırlığınızı yayarak yuvarlanın ya da sürünün; delikten uzaklaşın.",
      "Sudan çıkan kişiyi hemen ısıtın: ıslak giysileri çıkarın, kurulayın, kuru giysi ve battaniyeye sarın, ateş yakın; ana uygulamadaki hipotermi rehberini uygulayın."
    ],
    "art": [
      "sf-yh-buz-kalinlik",
      null,
      null,
      null,
      null,
      "sf-yh-buz-bayrak",
      null,
      "sf-yh-buz-kurtulma",
      null,
      null
    ],
    "dont": [
      "Kalınlığını ölçmediğiniz buza basmayın; 'dün sağlamdı' diye güvenmeyin.",
      "Tek başınıza ve ipsiz buza çıkmayın.",
      "Buza düşen birini kurtarmak için koşarak yanına gitmeyin; yere yatıp ip, dal ya da sırık uzatın.",
      "Islak giysiyle buzda beklemeyin."
    ],
    "keywords": [
      "buz deliğinden balık tutma",
      "buzda balık avı",
      "buz kalınlığı ne kadar olmalı",
      "buz kırılırsa ne yapmalı",
      "donmuş gölde balık",
      "buz balikciligi",
      "buza düşmek",
      "göl buzu güvenli mi"
    ],
    "sources": [
      "Minnesota DNR — Ice thickness guidelines: yürüyerek balık için en az 10 cm, beyaz buzda iki kat (https://www.dnr.state.mn.us/safety/ice/thickness.html)",
      "Kanada Kızılhaçı — Know the facts about ice safety: tek kişi 15 cm, grup 20 cm, renkler, kendini kurtarma (https://redcross.ca/about-us/red-cross-stories/2014/know-the-facts-about-ice-safety-this-winter)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: İki kaynak arasındaki çelişkide tutucu değer (15 cm tek kişi, 20 cm grup) seçilmiş, uygun bulundu. Kurtarma adımları Kızılhaç ile tutarlı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: Kanada Kızılhaçı tek kişi 15 cm, grup 20 cm, mavi en sağlam, beyaz yarı dayanıklı, gri buza çıkılmaz, kendini kurtarma (yardım çağır, öne uzan, tekme at, kalkmadan yuvarlan/sürün); Minnesota DNR 10 cm yürüme, beyaz buzda iki kat. İki kaynak çelişince tutucu olan 15 cm seçildi. İp uzunluğu, delik çapı ve bayraklı düzenek kaynaksız pratik ayrıntı." }
  },
  {
    "id": "sf-yh-tatlisu-balik",
    "category": "sf-yh-balik",
    "title": "Türkiye tatlı su balıklarını tanıma ve güvenli yeme",
    "tag": "BALIK TANIMA",
    "summary": "Türkiye'nin tatlı su balıklarının eti yenir; ama bıyıklı balığın yumurtasını yemeyin, turna, sudak ve alabalık gibi balıkları tenya için iyice pişirin, kirli sudan ve ölü bulunmuş balıktan uzak durun.",
    "note": "Uzman gözetimi olmadan tanımadığınız balığın yumurta ve iç organlarını yemeyin. Türkiye'de olağan koşullarda iç sularda türlere göre av yasakları ve boy sınırları vardır.",
    "steps": [
      "Türkiye tatlı sularında eti zehirli balık yok denecek kadar azdır; asıl tehlikeler parazit, bozulma, kirli su ve bazı balıkların yumurtasıdır. Bütün tatlı su balıklarını iyice pişirin.",
      "Sazangiller (sazan, kızılkanat, tatlısu kefali, siraz, inci kefali): pullu, ağzında diş yok, eti bol kılçıklı. Kılçığı yumuşatmak için sırtına sık, ince kesikler atıp kızartın ya da uzun süre pişirin.",
      "Bıyıklı balık (Barbus): ağzının üstünde iki çift bıyık, aşağı bakan ağız, uzun gövde. Eti yenir, yumurtası yenmez: yumurtasını yiyenlerde 2–4 saat içinde kusma, şiddetli karın ağrısı ve ishal başlar, 12–36 saat sürer. Temizlerken yumurtalığı bütün olarak çıkarıp gömün.",
      "Yayın balığı: pulsuz, kaygan, geniş yassı başlı, uzun bıyıklı; çok büyüyebilir. Eti yenir. Göğüs ve sırt yüzgeçlerindeki sert ışınlar batar; balığı başın arkasından, bezle kavrayın.",
      "Turna, sudak ve tatlısu levreği: sivri dişli avcı balıklar. Turnanın ağzına elinizi sokmayın; dişleri derin keser. Bu balıklar ve alabalık balık tenyası taşıyabilir.",
      "Balık tenyasına karşı: balığı et opaklaşıp lif lif ayrılana dek, iç sıcaklık en az 63 °C olacak biçimde pişirin. Tuzlamak, tütsülemek ve sirkeye yatırmak tenyayı öldürmez; çiğ balık, lakerda ya da tuzlu balık yapacaksanız ancak -20 °C'de en az 7 gün dondurulmuş balık kullanın.",
      "Tazeliği anlayın: gözler parlak ve dolgun, solungaçlar kırmızı, et parmakla basınca geri gelmeli, koku temiz su kokusu olmalı. Gözleri çökük, solungacı gri ya da kahve, karnı şişmiş, kötü kokan balığı atın.",
      "Ölü bulunan balığı ve kirli sudan çıkan balığı yemeyin: köpüklü, yağlı, kötü kokan su; toplu balık ölümlerinin görüldüğü yer; maden, sanayi ya da tarım ilacı akan kanal.",
      "Balığı yakalar yakalamaz öldürün, kanını akıtın, serin ve gölgede tutun. Sıcakta birkaç saatte bozulur; en kısa sürede temizleyip pişirin."
    ],
    "art": [
      null,
      "sf-yh-balik-sazangil",
      "sf-yh-biyikli-yumurta",
      null,
      "sf-yh-turna-dis",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Bıyıklı balığın yumurtasını yemeyin; pişmiş olsa bile denemeyin.",
      "Tatlı su balığını çiğ, tuzlu ya da tütsülenmiş olarak, önceden dondurmadan yemeyin.",
      "Toplu balık ölümü görülen sudan balık, su ve kabuklu almayın.",
      "Turna ve yayının ağzına çıplak elinizi sokmayın."
    ],
    "keywords": [
      "tatlı su balıkları türkiye",
      "hangi balık zehirli",
      "bıyıklı balık yumurtası",
      "balık yumurtası zehirli mi",
      "balık tenyası",
      "göl balığı yenir mi",
      "turna balığı",
      "yayın balığı tutma",
      "balık tazeliği nasıl anlaşılır",
      "biyikli balik havyari"
    ],
    "sources": [
      "Acta Biomedica — Barbel cholera: bıyıklı balık yumurtasıyla zehirlenme, 2–4 saat, 12–36 saat (https://mattioli1885journals.com/index.php/actabiomedica/article/view/7606)",
      "Wikipedia — Common barbel: yumurtanın zehirliliği (https://en.wikipedia.org/wiki/Common_barbel)",
      "CDC — Diphyllobothrium: alabalık, levrek, turna; 63 °C, dondurma süreleri, tuzlama-tütsü yetmez (https://www.cdc.gov/diphyllobothrium/about/index.html)",
      "ABD Ordusu FM 21-76 — Bölüm 8: yayın dikenleri, tatlı su balığını pişirme (https://www.wilderness-survival.net/food-1.php)",
      "FoodSafety.gov — Balık 63 °C ya da et opak ve kolay ayrılana dek (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC Diphyllobothrium sayfası açıldı: 63 °C, -20 °C'de 7 gün dondurma, tuzlama-tütsü-turşunun öldürmediği ve alabalık-levrek-turna teyit. Bıyıklı balık yumurtası süreleri yeniden açılmadı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: Acta Biomedica bıyıklı balık yumurtası 2–4 saatte kusma-ishal, 12–36 saat; Wikipedia barbel yumurtası zehirli; CDC alabalık-levrek-turnada tenya, 63 °C, -20 °C'de 7 gün, tuzlama-tütsü-turşu öldürmez; FM yayın dikenleri. Pişirmenin barbel yumurtası zehrini yok edip etmediği kaynakta yok; tutucu olarak 'pişmiş de yemeyin' yazıldı. Türk sazangil türlerinin tanımı genel balık bilgisi; Türkçe ihtiyoloji kaynağıyla karşılaştırılmadı." }
  },
  {
    "id": "sf-yh-deniz-zehirli",
    "category": "sf-yh-balik",
    "title": "Denizde zehirli ve dikenli balıklar: balon balığı, trakonya, iskorpit",
    "tag": "ZEHİRLİ BALIK",
    "summary": "Karnını şişiren, ağzında gaga gibi dişleri olan hiçbir balon balığını yemeyin (en tehlikelisi yanında gümüş şerit olan benekli balon balığı); trakonya ve iskorpitin dikenine dikkat edin, batarsa yeri yakmayacak kadar sıcak suya en az 30 dakika daldırın.",
    "note": "Balon balığı zehri için panzehir yoktur, pişirmekle bozulmaz; Türkiye'de ölümler görülmüştür. Türkiye'de balon balığı gıda olarak satılmaz; Tarım ve Orman Bakanlığı yakalananları limanlarda kuyruk başına ödemeyle toplatıp imha ettirir. Dudakta karıncalanma ya da nefes güçlüğü başlarsa hemen 112.",
    "callEmergency": true,
    "steps": [
      "Balon balığını tanıyın (Lagocephalus): Akdeniz ve Ege kıyılarında yaygınlaştı. Sırtı gri-kahve ve koyu benekli, karnı beyaz, yanlarında boydan boya gümüş bir şerit; ağzında papağan gagası gibi iki büyük diş plakası; tehlikede karnını şişirir. Çoğu yarım metreye yaklaşır, bazıları 1 metreyi bulur. Kıyılarımızda gümüş şeridi olmayan, daha küçük başka balon balığı türleri de vardır; gaga dişli ve karnını şişiren her balığı zehirli sayın.",
      "Hiçbir balon balığını yemeyin, kedi ve köpeğe de vermeyin. Zehri yumurtalıkta en yoğundur, ama deride, karaciğerde ve ette de bulunur. Zehir ısıyla bozulmaz: temizleyerek, pişirerek ya da kurutarak güvenli hale getirmeye çalışmayın. Oltaya takılırsa ağzına elinizi sokmadan, misinayı keserek bırakın; dişleri parmağı keser.",
      "Balon balığı yedikten sonra dudakta ve dilde karıncalanma, uyuşma başlarsa (çoğu zaman 30 dakika içinde, bazen 4 saate kadar) hemen 112'yi arayın. Felç nefes kaslarına yayılabilir; nefes durursa suni solunum gerekir.",
      "Trakonya (Trachinus): gündüz sığ, kumlu dipte gömülü yatar, yalnız gözleri görünür. Sırt yüzgecinin ön dikenleri ve solungaç kapağındaki diken zehirlidir. Sığ kumlu kıyıda ayakkabıyla yürüyün, ayaklarınızı kumda sürterek ilerleyin.",
      "İskorpit ve lipsoz: kayalıkta yaşayan, iri ve dikenli başlı, kırmızı-kahve, derisinde saçaklar olan balıklar. Sırt yüzgeci dikenleri zehirlidir. Eti yenir; tutarken kalın bez kullanın, temizlerken önce dikenli yüzgeçleri makasla kesip atın.",
      "Trakonya ve iskorpit eti yenir; zehir yalnız dikenlerdedir. Temizlerken dikenleri keserken balığı bezle bastırın.",
      "Diken batarsa: yaralı yeri hemen, yakmayacak kadar sıcak suya (önce dirseğinizle ya da başkasının eliyle deneyin) en az 30 dakika, ağrı azalana dek daldırın. Daldıramıyorsanız sıcak suya batırılmış bez koyun. Su soğudukça sıcak su ekleyin.",
      "Ağrı azalınca yarada kırık diken kalmış mı bakın, varsa çıkarın; yarayı sabunlu suyla yıkayıp örtün. Suya sirke, idrar ya da tuz katmanın yararı yoktur.",
      "Nefes darlığı, bayılma, kalp çarpıntısı, yayılan şişlik olursa ya da ağrı geçmezse hemen 112'yi arayın ya da sağlık kuruluşuna gidin."
    ],
    "art": [
      "sf-yh-balon-baligi",
      null,
      null,
      "sf-yh-trakonya-kum",
      null,
      null,
      "sf-yh-sicak-su-daldirma",
      null,
      null
    ],
    "dont": [
      "Balon balığının hiçbir yerini yemeyin; 'iyi temizlenirse yenir' sözüne inanmayın.",
      "Kumsalda ve kayalıkta yalınayak yürümeyin.",
      "Diken batan yeri kaynar suya sokmayın; deri yanar, özellikle uyuşmuş yerde fark etmezsiniz.",
      "Yaraya idrar, sirke ya da bilinmeyen merhem sürmeyin."
    ],
    "keywords": [
      "balon balığı zehirli mi",
      "balon balığı nasıl tanınır",
      "trakonya sokması",
      "iskorpit dikeni",
      "zehirli balık dikeni batması",
      "balık dikeni sıcak su",
      "zehirli deniz balıkları türkiye",
      "balon baligi yenir mi",
      "trakonya batti ne yapmali"
    ],
    "sources": [
      "Wikipedia — Lagocephalus sceleratus: gümüş şerit, 40 cm, zehrin dağılımı, Türkiye'de ölümler (https://en.wikipedia.org/wiki/Lagocephalus_sceleratus)",
      "Wikipedia — Tetrodotoxin: dudak-dil karıncalanması, 30 dk – 4 saat, panzehir yok (https://en.wikipedia.org/wiki/Tetrodotoxin)",
      "Wikipedia — Weever: kumda gömülü yaşam, sırt ve solungaç dikeni, sirke-idrar yararsız (https://en.wikipedia.org/wiki/Weever)",
      "NHS — Jellyfish and other sea creature stings, treatment: dayanılabilecek en sıcak suda en az 30 dk, dikeni cımbızla çıkarma, idrar dökmeme, nefes darlığında acil (https://www.nhs.uk/conditions/jellyfish-and-other-sea-creature-stings/treatment/)",
      "Küre Ansiklopedi — Balon balığı (Lagocephalus sceleratus): yanlarda gümüşi bant, erişkin 50–60 cm, 100 cm'ye dek (https://kureansiklopedi.com/tr/detay/balon-baligi-lagocephalus-sceleratus-71562)",
      "Tarım ve Orman Bakanlığı — İstilacı balon balığı avcılığı destekleme: L. sceleratus ve diğer balon balığı türleri, kuyruk başına ödeme (https://tarimorman.gov.tr/BSGM/Haber/281/Tarim-Ve-Orman-Bakani-Yumakli-Istilaci-Balon-Baligi-Avciligi-Destekleme-Tutarlarinda-Yuzde-400e-Varan-Artis-Karari-Verildi)",
      "BirGün — İstilacı balon balıkları: 88 limanda teslim ve imha, zehir pişirmekle yok edilemez (https://www.birgun.net/haber/istilaci-balon-baliklari-yeni-bir-zehirli-deniz-yirticisi-mi-581994)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: sıcak su süresi NHS'e göre 15 dk'dan en az 30 dk'ya çıkarıldı. Balon balığı boyu kaynaklarda çelişiyor (Wikipedia 40 cm, Küre 50–60 cm ve 1 m'ye dek); '40 cm'ye dek' yanıltıcı olduğundan büyük boy yazıldı. Yalnız gümüş şeritli türü değil bütün balon balıklarını yasaklayan ifadeye geçildi (Bakanlık 'diğer balon balığı türleri'ni de topluyor). Zehrin ısıya dayanıklılığı BirGün'de var. Satış/tüketim yasağının yasal dayanağı (gıda hijyeni mevzuatı) tam metinle doğrulanamadı; not uygulamayı (toplama-imha) anlatıyor." }
  },
  {
    "id": "sf-yh-yengec-kestanesi",
    "category": "sf-yh-balik",
    "title": "Yengeç ve deniz kestanesi toplama",
    "tag": "YENGEÇ",
    "summary": "Temiz, açık kayalık kıyıda yengeci sırtından tutup kaynatarak, iç organlarını atarak yiyin; deniz kestanesini eldivenle kayadan kaldırıp alt yüzünden açın, yalnız turuncu yumurtalıklarını alın.",
    "note": "Türkiye'de olağan koşullarda deniz canlılarının avı su ürünleri tebliğleriyle düzenlenir; türlere göre boy sınırı, yasak dönem ve araç yasakları vardır, deniz kestanesi avcılığı ticari tebliğde ayrı bir maddeyle (2024/20, madde 29) düzenlenir, bazı türler (ör. pina) tamamen korunur. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Yeri kıyı rehberindeki gibi seçin: açık denize bakan, dalga alan, temiz kayalık kıyı. Liman, dere ağzı, lağım çıkışı yakınından ve rengi değişmiş sudan toplamayın.",
      "Kaya yengeci geceleri kayaların üstüne ve suyun kenarına çıkar; gece fenerle bakın. Gündüz taşların altına bakın: taşı kendinize doğru değil, karşı yöne kaldırın ve işiniz bitince yerine koyun.",
      "Yengeci sırtından, arka bacakların üstünden tutun; kıskaçlar oraya yetişmez. Büyük kıskaçlı yengeci önce bir sopayla bastırıp sonra tutun.",
      "Yemle yengeç: balık başını ya da iç organını bir ipe bağlayıp kayalar arasına ya da dalga kıyısına sarkıtın. Yengeç yeme tutununca yavaşça çekin ve altından kepçe ya da bezle alın.",
      "Yengeçleri canlı tutun; ölmüş olanı atın. Kaynayan suda kabuk tamamen kırmızılaşıp et beyaz ve opak olana dek pişirin. Dere ve göl yengeçlerini kesinlikle çiğ, tuzlu ya da sirkeli yemeyin; akciğere yerleşen parazit taşırlar.",
      "Pişen yengeci açın; kabuk içindeki sarımsı-yeşil yağı ve iç organları yemeyin. Midye zehri ve kirlilik buralarda birikir, pişirmek yok etmez. Bacak, kıskaç ve gövde etini yiyin.",
      "Deniz kestanesi: sığ kayalıklarda, kaya oyuklarında ve deniz çayırında yaşar. Kalın eldiven ya da katlanmış bez ve ayakkabı olmadan dokunmayın; dikenler kolayca batar ve deride kırılır.",
      "Kestaneyi bıçak ucuyla kayadan kaldırın. Ağzının bulunduğu yumuşak alt yüzden makas ya da bıçakla daire biçiminde kesip kapağı açın. İçindeki koyu sıvıyı ve sindirim kısmını deniz suyunda çalkalayıp atın. Yenen kısım içerde yıldız gibi dizilmiş beş turuncu şerittir.",
      "Kestaneyi yalnız temiz sudan alın ve tazeyken yiyin; çiğ yemek çiğ midye kadar risk taşır. Şeritler küçük ve boşsa o mevsim toplamayı bırakın.",
      "Diken batarsa görünen uçları cımbızla çıkarın, yarayı sabunlu suyla yıkayın. Eklem yakınına batan, kızaran, şişen ya da günlerce ağrıyan yara için sağlık kuruluşuna gidin."
    ],
    "art": [
      null,
      null,
      "sf-yh-yengec-tutma",
      null,
      null,
      null,
      null,
      "sf-yh-kestane-acma",
      null,
      null
    ],
    "dont": [
      "Yengecin sarı-yeşil iç yağını ve organlarını yemeyin.",
      "Dere ve göl yengecini çiğ ya da az pişmiş yemeyin.",
      "Deniz kestanesine çıplak elle, kayalıkta yalınayak dokunmayın.",
      "Kirli, kapalı koy ve liman suyundan kabuklu toplamayın."
    ],
    "keywords": [
      "yengeç yakalama",
      "yengeç nasıl tutulur",
      "yengeç pişirme",
      "deniz kestanesi toplama",
      "deniz kestanesi nasıl açılır",
      "deniz kestanesi yenir mi",
      "deniz kestanesi dikeni batması",
      "yengec temizleme",
      "kaya yengeci"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8: yengeçler gece etkin, dalga kıyısına yem (https://www.wilderness-survival.net/food-1.php)",
      "Washington Sağlık Dairesi — Paralytic shellfish poisoning: yengeç bağırsağı ve yağında birikim, pişirme ve dondurma yok etmez (https://doh.wa.gov/community-and-environment/shellfish/recreational-shellfish/illnesses/biotoxins/paralytic-shellfish-poisoning)",
      "CDC — Paragonimiasis: tatlı su yengeci çiğ, tuzlu, sirkeli; 63 °C (https://www.cdc.gov/paragonimus/about/index.html)",
      "Wikipedia — Paracentrotus lividus: yaşam yeri, yenen kısım yumurtalık (https://en.wikipedia.org/wiki/Paracentrotus_lividus)",
      "FoodSafety.gov — Yengeç eti opak ve beyaz olana dek (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC Paragonimus 63 °C teyit. Not, 2024/20 içindekilerinde madde 29 'Deniz salyangozu, deniz patlıcanı ve denizkestanesi avcılığı' başlığı (Lexpera) görülerek netleştirildi; madde metni okunamadı, tarih ve boy yazılmadı. Yazar notu — Kaynaklarla teyit: FM yengeç gece etkin, dalga kıyısında yem; Washington DOH PSP yengeç bağırsağında ve yağında birikir, pişirme-dondurma yok etmez; CDC tatlı su yengeci 63 °C; Paracentrotus sığ kayalık ve deniz çayırı, yenen kısım gonad; FoodSafety yengeç opak. Deniz kestanesi ve yengeç için güncel Türk tebliğ maddeleri (2024/20 madde 29–30) ücretli erişim nedeniyle okunamadı. Deniz kestanesinin açılma yöntemi geleneksel uygulama, kaynakla doğrulanmadı." }
  },
  {
    "id": "sf-yh-ahtapot-kalamar",
    "category": "sf-yh-balik",
    "title": "Ahtapot ve kalamarı kıyıdan yakalama, temizleme",
    "tag": "AHTAPOT",
    "summary": "Ahtapotu kaya deliğinin önüne ipe bağlı yengeçle sarkıtıp yavaşça çekerek yakalayın, gözlerinin arasından hemen öldürüp iç torbasını, gözlerini ve gagasını çıkarın, taşa vurarak yumuşatıp uzun pişirin; kalamarı kalemini ve derisini çıkarıp çok kısa ya da çok uzun pişirin.",
    "note": "Türkiye'de olağan koşullarda ahtapot avı ticari tebliğde ayrı bir maddeyle (2024/20, madde 31) düzenlenir ve ahtapotta zaman yasağı uygulanır; kalamar ve ahtapotta araç kısıtları vardır, amatör balıkçılıkta avlanmak için ışık kullanmak yasaktır. Tarih ve ağırlık sınırını yerel tarım müdürlüğünden öğrenin; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Ahtapot sığ, kayalık ve taş oyuklu kıyılarda, kaya deliklerinde yaşar. Bir deliğin önünde yenmiş midye ve yengeç kabuğu yığını varsa içinde ahtapot olabilir.",
      "İple yakalama: bir yengeci ya da balık parçasını ipe sıkıca bağlayıp deliğin önüne, kayaların arasına sarkıtın. Ahtapot yeme sarılınca ipi yavaş ve sürekli çekin; ani çekerseniz bırakır. Su yüzüne gelince altından kepçe ya da bezle alın.",
      "Ahtapot kabı: ağzı dar, içi karanlık bir testiyi ya da kalın bir bidonu ipe bağlayıp kayalık dibe bırakın; ahtapot sığınmak için içine girer. 1–2 günde bir yavaşça çekip bakın.",
      "Tutunca kollarını yüzünüzden uzak tutun; kolların ortasındaki gaga ısırabilir. Hemen öldürün: bıçağı iki gözün arasından, hemen arkalarındaki beyne saplayıp çevirin; renk solar, kollar gevşer.",
      "Kalamar: gece ışığa ve küçük balıklara gelir; kıyıdan kalamar zokası ya da parlak bir parçayla çekilir. Çıkarınca mürekkep fışkırtır; yüzünüzden uzak tutun.",
      "Ahtapotu temizleyin: başı gözlerin üstünden, kolları gözlerin altından kesin; gözleri atın. Baş torbasını ters çevirip içindeki organları mürekkep kesesini patlatmadan çıkarın. Kolların birleştiği yerdeki gagayı çevresinden kesip atın.",
      "Ahtapotu yumuşatın: balıkçıların yaptığı gibi 40–50 kez taşa vurun, sonra iyice yıkayın. Güneşte 2–3 saat asmak da yardımcı olur.",
      "Kalamarı temizleyin: kolları başla birlikte gövdeden çekip ayırın; gövdedeki saydam kemiği (kalem) çekip çıkarın, deriyi soyun. Kolları gözlerin hemen üstünden kesin, ortadaki gagayı çıkarın.",
      "Pişirme: ahtapotu kapağı kapalı tencerede, kendi suyunda ya da az suyla, kısık ateşte yaklaşık 30 dakika, çatal kolayca girene dek pişirin. Kalamarı ya et beyazlaşınca hemen alacak kadar kısa ya da uzun süre pişirin; arada lastik gibi sertleşir.",
      "Bütün deniz ürünlerini et beyaz ve opak olana dek pişirin; temiz olmayan kıyıdan toplananı yemeyin."
    ],
    "art": [
      null,
      "sf-yh-ahtapot-ip",
      null,
      null,
      null,
      "sf-yh-ahtapot-temizleme",
      null,
      "sf-yh-kalamar-temizleme",
      null,
      null
    ],
    "dont": [
      "Ahtapotu yüzünüze, boynunuza yaklaştırmayın; gaga ısırığı enfekte olabilir.",
      "Mürekkep kesesini ve iç organları yemeyin.",
      "Kayalıkta dalga vuran kıyıya eğilip tek başınıza uzanmayın; dalga sürükler.",
      "Kalamarı ve ahtapotu çiğ yemeyin."
    ],
    "keywords": [
      "ahtapot yakalama",
      "ahtapot nasıl yakalanır",
      "ahtapot temizleme",
      "ahtapot nasıl öldürülür",
      "ahtapot yumuşatma",
      "kalamar temizleme",
      "kalamar yakalama kıyıdan",
      "ahtapot pisirme",
      "kalamar kalemi"
    ],
    "sources": [
      "Kopiaste — How to clean an octopus: 40–50 kez taşa vurma, güneşte 2–3 saat, baş-göz kesimi, gaga, mürekkep kesesi, 30 dk pişirme (https://www.kopiaste.org/2007/11/how-to-clean-an-octopus/)",
      "CIA Foodies — Cleaning octopus and squid: göz, gaga, kalamar kalemi, deri, mürekkep (https://www.ciafoodies.com/cleaning-octopus-and-squid/)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 — madde 8 ışık yasağı (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)",
      "FoodSafety.gov — Deniz ürünü et opak olana dek (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama ve düzeltme notu sondadır. Yazar notu — Kaynaklarla teyit: Kopiaste 40–50 vuruş, güneşte 2–3 saat, göz üstü ve altı kesim, torbayı ters çevirme, mürekkep kesesi, gaga, 30 dk kendi suyunda; CIA Foodies göz, gaga, kalamar kalemi ve deri; amatör tebliğ ışık yasağı. Ahtapotu gözler arasından öldürme, iple ve testiyle yakalama ve kalamarın kısa-uzun pişirme kuralı ikinci kaynakla doğrulanmadı; ahtapot için güncel tebliğ maddesi (2024/20 madde 31) okunamadı. Bağımsız doğrulama: 2024/20 içindekilerinde madde 31 'Ahtapot avcılığı' başlığı (Lexpera) ve 2020/20 tebliğinde 'ahtapot avcılığına getirilen zaman yasağı' ifadesi (FAOLEX) görüldü; not buna göre netleştirildi, tarih ve ağırlık yazılmadı." }
  },

  // ───────────────────────── BÖCEK, YUMURTA VE AV GÜVENLİĞİ ─────────────────────────
  {
    "id": "sf-yh-ari-larvasi",
    "category": "sf-yh-guvenlik",
    "title": "Arı larvası: erkek arı peteğinden yiyecek",
    "tag": "ARI LARVASI",
    "summary": "En güvenli kaynak kendi kovanınızdan kestiğiniz erkek arı yavru peteğidir; larvaları soğutup peteğden çıkarın ve hemen kavurun ya da haşlayın, yaban ve eşek arısı yuvasına yaklaşmayın.",
    "note": "Uzman gözetimi olmadan yaban arısı ve eşek arısı yuvasına yaklaşmayın; toplu sokma ölümcül olabilir. Arı sokmasına alerjisi olan kişi kovan işine hiç katılmasın.",
    "callEmergency": true,
    "steps": [
      "Kaynak kendi kovanınız olsun. Arıcılar varroa akarını azaltmak için erkek arı yavrusu peteğini keser; bu petek atılmak yerine yiyecek olur. Kovanın yaşaması için yeterli işçi arı yavrusu ve bal bırakın.",
      "Erkek arı yavru peteğini tanıyın: gözleri işçi gözlerinden iridir ve kapakları kubbe gibi kabarıktır; çoğu zaman çerçevenin alt ve kenar kısımlarındadır. Kovanı Arıcılık rehberindeki gibi sakin, güneşli bir günde dumanla açın.",
      "Kapalı erkek yavru peteğini bıçakla kesin ve hemen serin bir yere götürün; yavru çabuk bozulur.",
      "Peteği bir süre soğukta bekletin (kar, soğuk su dolu kabın içinde kapalı kap); larvalar sertleşir ve kolay ayrılır. Göz kapaklarını bıçakla kazıyın, peteği tahtaya ters vurarak larvaları dökün ya da tek tek çekin.",
      "Larvaları aynı gün pişirin: tavada az yağla kavurun ya da kaynar suda haşlayıp sonra kızartın. Çiğ yemeyin. Dondurabiliyorsanız aylarca saklanır.",
      "İlk kez yiyorsanız az yiyin. Arı ürünlerine, kabuklu deniz ürünlerine ya da böceklere alerjisi olan yemesin.",
      "Varroa ya da başka ilaç uygulanmış kovanın yavrusunu yemeyin.",
      "Yaban arısı ve eşek arısı yuvası: gri, kâğıt gibi yuvalar ağaçta, çatı altında ya da toprak içindedir. Bazı halklar bu larvaları yer, ama yuvayı sökmek çok sayıda sokmaya yol açar. Bu yuvalara dokunmayın.",
      "Sokulursanız iğneyi tırnakla kazıyarak çıkarın, soğuk uygulayın. Nefes darlığı, yüzde, dudakta, boğazda şişme, baş dönmesi olursa hemen 112'yi arayın."
    ],
    "art": [
      null,
      "sf-yh-erkek-ari-petegi",
      null,
      "sf-yh-larva-cikarma",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Yaban arısı ve eşek arısı yuvasını sökmeye çalışmayın.",
      "Larvayı çiğ yemeyin; kesilmiş peteği sıcakta bekletmeyin.",
      "Kovandaki bütün yavruyu almayın; kovan çöker.",
      "İlaçlı kovandan larva yemeyin."
    ],
    "keywords": [
      "arı larvası yenir mi",
      "erkek arı yavrusu yemek",
      "arı yavrusu protein",
      "erkek arı peteği kesme",
      "yaban arısı larvası",
      "ari larvasi pisirme",
      "arı kurtçuğu yemek",
      "varroa erkek arı peteği"
    ],
    "sources": [
      "New Atlas — Bee brood as a food source: varroa için erkek yavru kesimi, protein, pişmiş-kurutulmuş tüketim, 10 aya dek dondurma (https://newatlas.com/bee-brood-food-source/46662/)",
      "ZHAW Herren 2019 — Erkek arı yavrusunun gıda güvenliği: varroa kesimi, hızlı dondurma, mikrobiyal bulgular (https://srv-clst-301-data66.zhaw.ch/bitstream/11475/18197/1/2019_Herren_Preliminary%20results%20of%20survey%20on%20food%20safety%20aspects%20of%20drone%20brood.pdf)",
      "Bu paket ailesi — Arıcılık 1 ve 2 rehberleri (03-tarim-hayvancilik): kovan açma ve duman"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Yasak ihlali yok (içki, ilaç dozu yok); alerji ve 112 uyarısı yerinde. Kaynaklar yeniden açılmadı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: New Atlas erkek yavru varroa kontrolü yan ürünü, protein, pişmiş ya da kurutulmuş, 10 aya dek dondurma; ZHAW erkek yavru kesiminin yaygın varroa uygulaması olduğu, toplandıktan sonra birkaç saat içinde -20 °C'ye alma. Alerji ve ilaç kalıntısı uyarıları tutucu ekleme; kaynakta yer almıyor." }
  },
  {
    "id": "sf-yh-cekirge",
    "category": "sf-yh-guvenlik",
    "title": "Çekirge toplama; zehirli tırtıl ve böcekler",
    "tag": "ÇEKİRGE",
    "summary": "Çekirgeyi serin sabah saatlerinde, uyuşukken elle ya da bezle toplayın; başını, kanatlarını ve dikenli bacaklarını ayıklayıp iyice pişirin. Çam kese böceği tırtılına, yağ böceğine, parlak renkli ve tüylü böceklere dokunmayın.",
    "note": "Uzman gözetimi olmadan tanımadığınız böceği yemeyin: yağ böceği yutulursa bağırsak ve böbreği ağır hasarlar, öldürebilir. Kabuklu deniz ürünü alerjisi olan böcek yemesin.",
    "steps": [
      "Çekirge ve cırcır böceği yaz sonu ve sonbaharda kuru otlakta, tarla kenarında boldur. Sabah erken, çiy kurumadan ve hava serinken toplayın; soğukta yavaştırlar, iyi sıçrayamazlar.",
      "Elle avuçlayın ya da bir bezi, ceketi otların üstünde süpürür gibi gezdirip içine dolanları toplayın. Ağzı bağlanan bir torbaya koyun.",
      "İlaçlanmış tarla, bağ, bahçe ve yol kenarından toplamayın. Çekirge sürüsüne karşı ilaç atılan yerlerden de almayın; ölü ya da sendeleyen çekirgeyi atın.",
      "Torbadaki çekirgeleri kaynar suya atarak ya da ateşin yanında ısıtarak öldürün.",
      "Başını çekip koparın; bağırsak çoğu zaman başla birlikte çıkar. Kanatları ve arka bacakların dikenli alt kısmını koparın; dikenler boğaza takılır.",
      "Sert kabuklu böcekler parazit taşır: çekirgeyi kaynatın, kızgın taşta ya da tavada kavurun, közleyin. Çiğ yemeyin.",
      "Kavrulmuş çekirgeyi ezip una ya da çorbaya katabilirsiniz.",
      "Çam kese böceği tırtılı: çamlarda beyaz, ipeksi torba yuvalar; ilkbaharda yerde uç uca dizilip yürüyen tüylü tırtıllar. Tüyleri deride döküntü, gözde ağır tahriş yapar. Dokunmayın, yuvayı dürtmeyin, köpekleri uzak tutun. Tüy değerse sabunlu suyla yıkayın; göze kaçtıysa bol suyla yıkayıp sağlık kuruluşuna gidin.",
      "Yağ böceği (kantarit taşıyan böcekler): uzun, yumuşak gövdeli; siyah, parlak mavi-yeşil ya da kırmızı-siyah çizgili; çiçeklerde ve otlarda bulunur. Vücut sıvısı deride kabarcık yapar; yutulursa bağırsağı ve böbreği ağır hasarlar, öldürebilir. Topladığınız çekirgelerin arasına karışmasın.",
      "Genel kural: tüylü tırtılları; parlak renkli, kötü kokan, sokan ya da ısıran böcekleri; ölü bulunan böceği yemeyin."
    ],
    "art": [
      null,
      "sf-yh-cekirge-bez",
      null,
      null,
      null,
      null,
      null,
      "sf-yh-cam-kese-yasak",
      "sf-yh-yag-bocegi-yasak",
      null
    ],
    "dont": [
      "Çekirgeyi ve sert kabuklu böceği çiğ yemeyin.",
      "Çam kese böceği yuvasını çıplak elle ya da sopayla bozmayın.",
      "Parlak renkli, uzun gövdeli böcekleri toplanan çekirgenin arasına karıştırmayın.",
      "Kabuklu deniz ürünlerine alerjiniz varsa böcek yemeyin."
    ],
    "keywords": [
      "çekirge toplama",
      "çekirge nasıl yenir",
      "çekirge pişirme",
      "çam kese böceği",
      "tırtıl zehirli mi",
      "zehirli böcekler",
      "yağ böceği",
      "kantarit",
      "cekirge yemek"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8: sert kabuklu böceklerde parazit, pişirin (https://www.wilderness-survival.net/food-1.php)",
      "Wikipedia — Pine processionary (çam kese böceği): torba yuvalar, nisanda sıra yürüyüş, tüylerin deri ve gözde etkisi, köpekler (https://en.wikipedia.org/wiki/Pine_processionary)",
      "Wikipedia — Cantharidin: yağ böcekleri, yutulunca bağırsak ve böbrek hasarı, öldürücü doz (https://en.wikipedia.org/wiki/Cantharidin)",
      "Bu paket ailesi — Böcek yeme rehberi (01-yiyecek-bulma, sf-yb-bocek)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Kantarit ve çam kese böceği uyarıları yazar kaynaklarıyla tutarlı. Ciddi sağlık riski (kantarit) nedeniyle eksik olan note alanı eklendi. Yazar notu — Kaynaklarla teyit: FM 21-76 sert kabuklu böcekte parazit, pişirin; Pine processionary çam üzerinde ipek yuvalar, nisanda sıra yürüyüş, tüylerde kaşıntılı döküntü ve göz tahrişi, köpek zehirlenmesi; Cantharidin yağ böceklerinde, yutulunca sindirim ve idrar yolu hasarı, 10–65 mg ölümcül. Sabah serinliğinde toplama ve bezle süpürme kaynakla doğrulanmadı; geleneksel uygulama." }
  },
  {
    "id": "sf-yh-kus-yumurtasi-koruma",
    "category": "sf-yh-guvenlik",
    "title": "Kuş yumurtası ve yuva: koruma altındaki türler",
    "tag": "YUMURTA",
    "summary": "Yabani kuş yumurtası toplamak olağan koşullarda yasaktır; gerçek açlıkta bile yırtıcı kuş, leylek, baykuş ve sulak alan kuşlarının yuvasına dokunmayın, önce başıboş evcil kümes hayvanlarına yönelin.",
    "note": "Türkiye 1984'ten beri Bern Sözleşmesi'ne taraftır; 4915 sayılı Kara Avcılığı Kanunu (madde 4) yabani hayvanların yumurta ve yavrularını toplamayı, yuvalarını dağıtmayı yasaklar ve korunan kuşların her yumurtası için türün tazminat bedeli istenir. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Önce başka yolları düşünün: boşalmış köylerdeki başıboş tavuk, ördek, kaz ve güvercinler daha kolay, daha bol ve yasal açıdan daha az sorunlu yumurta kaynağıdır. Bunları toplayıp kümes kurun (Tavuk 1 rehberi).",
      "Asla dokunmayın: kartal, şahin, atmaca, doğan ve baykuş yuvaları; leylek, flamingo, kelaynak, kaşıkçı, pelikan gibi kuşların yuvaları. Bunlar en ağır koruma altındadır, tazminatları da en yüksektir.",
      "Kalabalık kolonilere girmeyin (sazlıkta balıkçıl kolonisi, kayalıkta martı ve karabatak kolonisi). Ürken kuşlar yuvadan kalkınca yumurta soğur, yırtıcılar yavrulara saldırır; bütün koloni zarar görür.",
      "Deniz kaplumbağası yuvalarına (kumsalda kum altında) ve kaplumbağa yumurtalarına dokunmayın; nesli tehlikededir.",
      "Gerçek açlık durumunda yaygın türlerin yuvasından alacaksanız yuvayı boşaltmayın: 2–3 yumurta bırakıp işaretleyin ve sonraki günlerde yalnız yeni konan yumurtaları alın (Kuş yumurtası toplama rehberi).",
      "Kuluçkaya yatılmış yumurtayı almayın: yumurta sıcaksa, kuş yuvadan kalkmıyorsa ya da yumurta suda dik durup yüzüyorsa içinde civciv gelişiyor ya da yumurta eskidir; yerinde bırakın.",
      "Hasta görünen ya da ölü kuş bulunan yerden yumurta ve kuş almayın; kuş gribi bulaşabilir. Yuvaya ve yumurtaya çıplak elle dokunmayın, sonra ellerinizi sabunla yıkayın.",
      "Yumurtayı akı ve sarısı tamamen katılaşana dek pişirin; çiğ ya da rafadan yemeyin.",
      "Kuş yakalamayı ve yavru almayı bu rehber önermez. Kuşların çoğu koruma altındadır; avlanabilen türler, dönemler ve yöntemler yasayla sınırlıdır."
    ],
    "art": [
      null,
      "sf-yh-yuva-yasak",
      null,
      null,
      null,
      "sf-yh-yumurta-kulucka",
      null,
      null,
      null
    ],
    "dont": [
      "Yırtıcı kuş, leylek, baykuş ve sulak alan kuşlarının yuvasına yaklaşmayın.",
      "Yuvayı tamamen boşaltmayın, yuvayı dağıtmayın.",
      "Yumurta için ağaca, yara, kayalığa tırmanmayın.",
      "Ölü kuş bulunan yerden yumurta toplamayın."
    ],
    "keywords": [
      "kuş yumurtası yasak mı",
      "yabani kuş yumurtası toplamak",
      "korunan kuşlar",
      "yuva bozmak cezası",
      "bern sözleşmesi kuş",
      "4915 kara avcılığı yumurta",
      "kus yumurtasi toplama cezasi",
      "leylek yuvası"
    ],
    "sources": [
      "4915 sayılı Kara Avcılığı Kanunu — madde 2, 4, 6, 21 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)",
      "Wikipedia — Bern Convention: Türkiye 1984'te onayladı, Ek II ve III (https://en.wikipedia.org/wiki/Berne_Convention_on_the_Conservation_of_European_Wildlife_and_Natural_Habitats)",
      "Sözcü / DHA 2024 — 2024-2025 av dönemi tazminat bedelleri: yırtıcılar, leylek, flamingo, baykuş, yumurta başına tazminat (https://www.sozcu.com.tr/bu-kus-ve-surungen-turlerine-zarar-verenlere-100-bin-tl-ceza-p81881)",
      "ABD Ordusu FM 21-76 — Bölüm 8: 2–3 yumurta bırakıp işaretleme (https://www.wilderness-survival.net/food-1.php)",
      "CDC — Bird flu prevention: hasta ya da ölü kuşa dokunmama (https://www.cdc.gov/bird-flu/prevention/index.html)",
      "FoodSafety.gov — Yumurta akı ve sarısı katılaşana dek (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: 4915 PDF'i açıldı: madde 4 'yavru ve yumurtaları toplanamaz, yuvaları dağıtılamaz, memeliler kış uykusunda rahatsız edilemez' teyit; madde 2 yaban hayvanı tanımı (memeli, kuş, sürüngen). Bern madde 6 metni yine açılmadı. Değişiklik yok. Yazar notu — Kaynaklarla teyit: 4915 madde 4 yumurta ve yavru toplama, yuva dağıtma yasağı, kış uykusu; Bern Türkiye onayı 2 Mayıs 1984, yürürlük 1 Eylül 1984; DHA tazminat listesi (doğangiller 100.000 TL, leylekgiller 40.000 TL, yumurta başına tür bedeli); FM 2–3 yumurta bırakma; CDC kuş gribi; FoodSafety yumurta. Bern madde 6'nın (yumurta toplama yasağı) tam metni açılamadı; deniz kaplumbağası yuvası için ayrı kaynak açılmadı." }
  },
  {
    "id": "sf-yh-yenmeyecek-hayvanlar",
    "category": "sf-yh-guvenlik",
    "title": "Yenmeyecek hayvanlar: koruma altındakiler ve hastalık taşıyanlar",
    "tag": "KORUNAN TÜR",
    "summary": "Kaplumbağa, kirpi, kertenkele, yılan, yarasa, semender ve kuşların çoğu hem yasayla korunur hem de salmonella, kuduz ya da kuş gribi taşır; açlıkta bile önce balık, kabuklu, böcek, bitki ve evcil hayvan kaynaklarına yönelin.",
    "note": "Türkiye'de kara hayvanlarının çoğu 4915 sayılı Kara Avcılığı Kanunu ve Bern Sözleşmesi ile koruma altındadır; öldürmek ve toplamak idari para cezası, tür başına tazminat ve bazı durumlarda 2–5 yıl hapis gerektirir.",
    "steps": [
      "Kaplumbağa (tosbağa) ve su kaplumbağası: koruma altındadır ve çok yavaş çoğalır. Sağlıklı görünse de salmonella taşır. Toplamayın, yemeyin; dokunduktan sonra ellerinizi sabunla yıkayın.",
      "Kirpi: Merkez Av Komisyonu kararlarında avına izin verilen memeliler yalnız yaban tavşanı, çakal, tilki ve yaban domuzudur; kirpi bu listede yoktur. Bahçedeki salyangoz ve böcekleri yer. Kış uykusundaki memeliyi rahatsız etmek de yasaktır (4915, madde 4). Üzerinde pire ve kene taşır; çıplak elle tutmayın.",
      "Kertenkele, keler ve yılan: koruma altındadır, salmonella taşır. Engerek ısırığı ölümcül olabilir; yılanı yakalamaya ya da öldürmeye çalışmayın, uzaklaşın.",
      "Yarasa: kuduz taşıyabilir. Yerde sürünen, gündüz uçan ya da ölü yarasaya kesinlikle dokunmayın. Isırık ya da tırmık olursa yarayı hemen en az 15 dakika sabun ve suyla yıkayın ve sağlık kuruluşuna gidin; kuduz belirti başlayınca ölümcüldür.",
      "Tilki, çakal, kurt, sokak köpeği ve kedi: kuduzun başlıca taşıyıcılarıdır. Etleri için avlamayın, leşlerini kesmeyin.",
      "Semender ve parlak renkli kurbağalar: derileri zehirlidir; yemeyin, çocuklar ellemesin.",
      "Kuşların çoğu koruma altındadır; yırtıcılar, leylek, baykuş ve sulak alan kuşları için yüksek tazminat ve hapis cezası vardır. Hasta ya da ölü kuşa dokunmayın; kuş gribi taşıyabilir.",
      "Bunların yerine: balık, kerevit, salyangoz, çekirge, yenebilir bitki ve evcil hayvan yetiştiriciliği (tavuk, tavşan, keçi) hem daha güvenli hem daha sürdürülebilirdir. Bu paketteki ve Tarım-hayvancılık paketindeki rehberlere bakın."
    ],
    "art": [
      "sf-yh-korunan-hayvanlar",
      null,
      null,
      "sf-yh-yarasa-yasak",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kaplumbağa, kirpi, kertenkele, yılan ve kuş yuvası toplamayın.",
      "Yarasaya, tilkiye ve sahipsiz köpeğe çıplak elle dokunmayın.",
      "5 yaş altı çocukların sürüngen ve kurbağa ellemesine izin vermeyin.",
      "Kış uykusundaki hayvanın yuvasını bozmayın."
    ],
    "keywords": [
      "kaplumbağa yenir mi",
      "kirpi yenir mi",
      "kertenkele yenir mi",
      "yılan eti yenir mi",
      "koruma altındaki hayvanlar",
      "yarasa kuduz",
      "hangi hayvanlar yenmez",
      "kirpi koruma altında mı",
      "kaplumbaga toplamak yasak"
    ],
    "sources": [
      "4915 sayılı Kara Avcılığı Kanunu — madde 2, 4 (koruma, kış uykusu), 21 (cezalar) (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)",
      "Sözcü / DHA 2024 — Kaplumbağa, sürüngen ve kuş tazminat bedelleri, 2–5 yıl hapis (https://www.sozcu.com.tr/bu-kus-ve-surungen-turlerine-zarar-verenlere-100-bin-tl-ceza-p81881)",
      "CDC — Reptiles and amphibians: salmonella, 5 yaş altı (https://www.cdc.gov/healthy-pets/about/reptiles-and-amphibians.html)",
      "WHO — Rabies fact sheet: 15 dk sabunlu yıkama, belirti sonrası ölümcül (https://www.who.int/news-room/fact-sheets/detail/rabies)",
      "CDC — Bird flu prevention (https://www.cdc.gov/bird-flu/prevention/index.html)",
      "Habertürk — MAK kararı: avına izin verilen 4 memeli yaban tavşanı, çakal, tilki, yaban domuzu (https://www.haberturk.com/31-kus-ve-4-memeli-turu-av-listesinde-3611490)",
      "Wikipedia — Bern Convention: Türkiye tarafı (https://en.wikipedia.org/wiki/Berne_Convention_on_the_Conservation_of_European_Wildlife_and_Natural_Habitats)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama ve düzeltme notu sondadır. Yazar notu — Kaynaklarla teyit: 4915 madde 2 yaban hayvanı tanımı (memeli, kuş, sürüngen), madde 4 koruma ve kış uykusu, madde 21 2–5 yıl hapis; DHA tazminat listesinde kaplumbağa türleri, engerekler ve listede olmayan bütün sürüngenler, kuşlar; CDC salmonella; WHO kuduz 15 dk yıkama ve ölümcüllük; CDC kuş gribi. Kirpinin koruma statüsü (MAK kararı) belgeyle doğrudan açılmadı; uzmana sorulmalı. Bağımsız doğrulama: 4915 PDF'i açıldı; madde 4 (yumurta, yavru, yuva, kış uykusu) teyit, hapis yalnız zehirleme ve türü tehlikeye sokan avda (madde 21) olduğundan nottaki 'bazı durumlarda' kaydı doğru. Kirpi tazminat listelerinde bulunamadı; 'koruma altındadır' yerine doğrulanabilen 'av listesinde yoktur' (Habertürk, MAK 4 memeli) yazıldı." }
  },
  {
    "id": "sf-yh-parazit-korunma",
    "category": "sf-yh-guvenlik",
    "title": "Avı temizlerken sülük, kene ve parazitten korunma",
    "tag": "KENE SÜLÜK",
    "summary": "Hayvan keserken eldiven giyin ve yaralarınızı örtün; keneyi cımbızla deriye en yakın yerden düz çekin ve ezmeyin; sülüğü tırnakla ağzından ayırın; iç organları köpeklere vermeyin ve suyu arıtmadan içmeyin.",
    "note": "Uzman gözetimi olmadan kene ve hayvan kanı kaynaklı ateşli hastalık tedavi edilemez: kene tutunmasından ya da hayvan kesiminden sonraki günlerde ateş, halsizlik, kas ağrısı, kanama olursa hemen sağlık kuruluşuna gidin (Kırım-Kongo kanamalı ateşi).",
    "steps": [
      "Hayvan keserken ve temizlerken eldiven giyin; yoksa elinize temiz bir plastik torba geçirin. Eldeki her kesik ve çatlağı örtün. Hayvan kanı ve dokusu Kırım-Kongo kanamalı ateşi gibi ağır hastalıkları bulaştırabilir.",
      "İşlem sırasında bir şey yemeyin, içmeyin, ağzınıza ve gözünüze dokunmayın. Bitince bıçağı, tahtayı ve ellerinizi sabun ve suyla yıkayın.",
      "Uzun kollu, açık renkli giysi giyin, paçaları çorabın içine sokun; açık renkte kene kolay görünür. Avdan, otluk ve çalılıktan dönünce bütün vücudu, özellikle koltuk altı, kasık, diz arkası, bel ve saç diplerini kontrol edin.",
      "Kene tutunmuşsa: ince uçlu cımbızla, deriye en yakın yerden, gövdesini sıkmadan tutun. Çevirmeden ve sarsmadan, düzgün ve sürekli bir kuvvetle yukarı çekin. Cımbız yoksa eldivenli parmakla aynı biçimde çekin.",
      "Keneyi çıplak parmakla ezmeyin; kapalı bir kaba koyun, bantla sarın ya da yakın. Isırık yerini ve ellerinizi sabunla yıkayın. Keneye yağ, gaz, oje sürmeyin, kızgın şey değdirmeyin; kene içindekini deriye boşaltabilir.",
      "Sülük: suya girip çıktıktan sonra bacaklarınıza bakın. Sülüğün dar ağız ucunu bulun, altındaki deriyi gerin ve tırnağınızı ya da ince bir kâğıdı ağzın altına kaydırarak ayırın, sülüğü hemen uzağa fırlatın. Sülüğü çekip koparmayın; tuz, ateş, sigara değdirmeyin, kusarak yarayı mikroplar.",
      "Sülük yarası bir süre kanar; temiz bezle bastırın, yıkayıp örtün, bezi kanama durana dek değiştirin. Kızarıklık, akıntı, ateş ya da yüzde şişme, nefes güçlüğü olursa sağlık kuruluşuna gidin.",
      "Kaynak ve gölet suyunu süzüp arıtmadan içmeyin; küçük sülükler suyla ağıza, burna, boğaza girip yapışabilir. Sürekli burun kanaması ya da boğazda takılma hissi olursa hekime gidin.",
      "Kist hidatik (köpek tenyası): kesilen hayvanın iç organlarını, özellikle kistli ciğeri köpeklere çiğ vermeyin; gömün ya da yakın. Köpeğe ve toprağa dokunduktan sonra, yemekten önce ellerinizi yıkayın; yeşillikleri iyice yıkayın.",
      "Ölü bulunan ya da hasta görünen hayvanı hiç işlemeyin (Ölü bulunan hayvan rehberi)."
    ],
    "art": [
      null,
      null,
      null,
      "sf-yh-kene-cikarma",
      null,
      "sf-yh-suluk-cikarma",
      null,
      null,
      "sf-yh-ic-organ-kopek-yasak",
      null
    ],
    "dont": [
      "Keneyi çıplak elle koparmayın ve ezmeyin; üzerine yağ, gaz, ateş uygulamayın.",
      "Sülüğü zorla çekmeyin; tuz ve ateşle düşürmeye çalışmayın.",
      "Kesilen hayvanın çiğ iç organlarını köpeklere vermeyin.",
      "Eldiven olmadan, elinizdeki açık yarayla hayvan kesmeyin."
    ],
    "keywords": [
      "kene nasıl çıkarılır",
      "kene çıkarma",
      "kırım kongo kene",
      "sülük nasıl çıkarılır",
      "sülük yapıştı",
      "kist hidatik köpek",
      "av temizlerken eldiven",
      "kene ezilir mi",
      "suluk cikarma"
    ],
    "sources": [
      "CDC — Removing a tick: cımbız, düz çekme, ezmeme, yağ-oje-ısı kullanmama (https://www.cdc.gov/ticks/after-a-tick-bite/index.html)",
      "WHO — Crimean-Congo haemorrhagic fever: kene ve kesim sırasında kan-doku teması, eldiven, açık renk giysi (https://www.who.int/news-room/fact-sheets/detail/crimean-congo-haemorrhagic-fever)",
      "Healthline — How to remove a leech: tırnakla ayırma, tuz-ateş kullanmama, yara bakımı, ağız ve burun sülüğü (https://www.healthline.com/health/how-to-remove-a-leech)",
      "Wikipedia — Leech: hirudin ve uzayan kanama, alerji (https://en.wikipedia.org/wiki/Leech)",
      "Wikipedia — Limnatis nilotica: ağız, burun ve boğaza yerleşen sülük, Orta Doğu (https://en.wikipedia.org/wiki/Limnatis_nilotica)",
      "WHO — Echinococcosis: köpek dışkısındaki yumurta, kesimde iç organların imhası (https://www.who.int/news-room/fact-sheets/detail/echinococcosis)",
      "CDC — Bird flu prevention: av temizlerken yememe, içmeme (https://www.cdc.gov/bird-flu/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC kene çıkarma sayfası açıldı: cımbızla deriye yakın tutma, çevirmeden düz çekme, parmakla ezmeme, vazelin-ısı-oje kullanmama teyit. Değişiklik yok. Yazar notu — Kaynaklarla teyit: CDC kene çıkarma ve yasaklı halk yöntemleri; WHO KKKA kene ve kesim sırasında bulaşma, eldiven, açık renk giysi; Healthline sülük ayırma, tuz-ateşin kusturması, yara bakımı; Wikipedia hirudin kanaması; Limnatis ağız-burun yerleşimi; WHO echinococcosis kesimde iç organ imhası. Limnatis'in Türkiye'de bulunduğu kaynakta açıkça yazmıyor (Orta Doğu ve Güney Avrupa)." }
  },
  {
    "id": "sf-yh-olu-hayvan",
    "category": "sf-yh-guvenlik",
    "title": "Ölü bulunan hayvan: neden yenmez, istisnalar",
    "tag": "LEŞ",
    "summary": "Nasıl öldüğünü bilmediğiniz hayvanı yemeyin, açmayın, çıplak elle tutmayın; şarbon, kuduz ve kuş gribi pişirmeden önce size bulaşır. Tek istisna, görünür bir dış nedenle (çarpışma, düşme) öldüğünü kendi gözünüzle gördüğünüz ya da sık baktığınız tuzakta yeni ölmüş, belirtisiz otçul hayvandır; etçil, yarasa ve kuş hiçbir zaman istisna değildir.",
    "note": "Uzman gözetimi olmadan ölü bulunmuş hayvanın etini yemeyin, leşini açmayın: şarbon, kuduz ve kuş gribi ölümcüldür.",
    "steps": [
      "Neden öldüğünü bilmediğiniz hayvanı yemeyin. Hastalıktan, zehirden ya da bozulmadan ölmüş olabilir; kesip temizlerken mikrop size geçer, pişirmek bunu geri almaz.",
      "Şarbon belirtileri: önceden hasta görünmeden aniden ölmüş hayvan; burun, ağız ya da makattan pıhtılaşmamış koyu kan sızması; ölünce kaskatı kesilmemiş gövde. Böyle leşi kesinlikle açmayın: hava alan mikrop toprağı yıllarca bulaştıran sporlara döner. Leşi derin gömün ya da yakın, oraya hayvan sokmayın.",
      "Kuduz: tilki, köpek, kedi, kurt, çakal ve yarasa leşi kuduz taşıyabilir. Virüs salya, beyin ve sinir dokusundadır; taze leşte canlı kalabilir. Bu leşleri kesmeyin, başını açmayın; sopayla, kürekle ya da eldivenle taşıyın.",
      "Kuş gribi: hasta ya da ölü yabani kuşa, özellikle aynı yerde birden çok ölü kuş varsa, dokunmayın. Kaldırmak zorundaysanız eldiven ya da ters çevrilmiş poşetle, ağzınızı ve gözünüzü örterek alın ve gömün.",
      "Bir yerde birden çok ölü hayvan, ölü balık ya da kuş varsa orada zehir, salgın ya da kirli su vardır. O yerden su, balık, kabuklu ve ot almayın.",
      "Bozulma: şişmiş, kokmuş, gözleri çökmüş, kurtlanmış, yeşil ya da gri renk almış hayvanı yemeyin. Pişirmek bozulmuş etteki bütün zehirleri yok etmez.",
      "İstisnalar dar ve hepsi birlikte aranır. İstisna 1: kendi tuzağınızda, en çok birkaç saat önce canlı gördüğünüz, hâlâ taze ve hastalık belirtisi olmayan otçul hayvan. İstisna 2: sağlıklı davranırken öldüğünü kendi gözünüzle gördüğünüz ve ölüm nedeni gözle görülen bir dış etken olan (çarpışma, düşme) otçul hayvan. Görünür bir neden olmadan aniden yere yığılan hayvan istisna değildir; bu şarbon belirtisidir. Etçiller (tilki, köpek, kedi, kurt, çakal), yarasa, kuş ve kemirgen hiçbir zaman istisna değildir. Bunlarda da hızlı davranın: hemen kanını akıtın, iç organlarını çıkarın, serin yere alın.",
      "İstisnalarda da iç organları kontrol edin: ciğerde beyaz noktalar, kist, irin, büyümüş koyu dalak, sızan koyu kan görürseniz hayvanı yemeyin, gömün (Hayvan hastalıkları ve et güvenliği rehberi).",
      "Hiçbir leşi çıplak elle tutmayın. Deriye leş sıvısı değdiyse sabun ve suyla yıkayın, giysiyi çıkarıp yıkayın. Yaraya, ağza ya da göze değdiyse 15 dakika sabunlu suyla yıkayıp sağlık kuruluşuna gidin ve hayvanı anlatın.",
      "Leş etini köpeklere de vermeyin; hastalığı köpek size taşır."
    ],
    "art": [
      null,
      "sf-yh-les-isaretler",
      "sf-yh-les-sopa",
      "sf-yh-olu-kus-eldiven",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Ölü bulunan hayvanın etini, derisini, yününü ya da boynuzunu almayın.",
      "Şarbon şüpheli leşi açmayın, kesmeyin.",
      "Tilki, köpek, kedi ve yarasa leşinin başını açmayın.",
      "Ölü kuşa çıplak elle dokunmayın."
    ],
    "keywords": [
      "ölü hayvan yenir mi",
      "leş yemek",
      "yolda ölü hayvan eti",
      "ölü bulunan hayvan",
      "şarbon leş belirtileri",
      "ölü tilki kuduz",
      "ölü kuş dokunmak",
      "kuş gribi ölü kuş",
      "olu hayvan eti"
    ],
    "sources": [
      "WOAH — Anthrax: ani ölüm, pıhtılaşmamış kan, ölü katılığı yok, leşi açmama, yakma ya da derin gömme, etle insana bulaşma (https://www.woah.org/en/disease/anthrax/)",
      "Worms & Germs Blog (Ontario Veteriner Koleji) — Rabies and roadkill: salya ve sinir dokusu, taze leşte canlı virüs, sopayla taşıma, yıkama (https://wormsandgermsblog.com/2009/10/articles/diseases/rabies/rabies-and-roadkill)",
      "WHO — Rabies fact sheet: 15 dk sabunlu yıkama, çiğ et yoluyla çok nadir bulaşma (https://www.who.int/news-room/fact-sheets/detail/rabies)",
      "CDC — Bird flu prevention: ölü ve hasta kuşa korunmasız dokunmama, eldiven ya da ters poşet (https://www.cdc.gov/bird-flu/prevention/index.html)",
      "Bu paket ailesi — Hayvan hastalıkları ve et güvenliği rehberi (01-yiyecek-bulma, sf-yb-et-hastalik)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama ve düzeltme notu sondadır. Yazar notu — Kaynaklarla teyit: WOAH ani ölüm, deliklerden pıhtılaşmamış kan, ölü katılığı yok, açınca spor, yakma ya da derin gömme, leş etinden ölüm; Worms & Germs taze leşte canlı virüs, salya ve sinir dokusu, sopayla taşıma, deri ve yara yıkama; WHO 15 dk yıkama; CDC kuş gribi eldiven ve ters poşet. İstisna ölçütleri (görülen ölüm, sık bakılan tuzak) tutucu yazar kararı; kaynak doğrudan böyle bir liste vermiyor. Bağımsız doğrulama: 'sağlıklı davranırken öldüğünü gördüğünüz hayvan' istisnası WOAH'ın şarbon tanımıyla (önceden hasta görünmeden ani ölüm) çelişiyordu; istisna görünür dış nedenle (çarpışma, düşme) sınırlandı, etçiller, yarasa, kuş ve kemirgen istisnadan çıkarıldı (kuduz ve kuş gribi), tuzakta 'en çok birkaç saat' kaydı eklendi." }
  }
];
