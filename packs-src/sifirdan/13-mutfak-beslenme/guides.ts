// Sıfırdan paketi: Mutfak, beslenme ve ilaçsız sağlık
// Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-mutfak-beslenme',
  name: 'Sıfırdan: Mutfak, beslenme ve ilaçsız sağlık',
  desc: 'Yabani malzemeyle ölçülü tarifler, kıtlıkta kalori ve vitamin planı, bebek ve çocuk beslenmesi, ilaç azalınca kronik hastalıkta beslenme ve korunma. İlaç dozu içermez; doktorun önerdiği ilacın yerini tutmaz.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'sf-mb-mutfak',
    title: 'Yabani mutfak',
    hint: 'Kurbağa, salyangoz, kerevit, ısırgan, ebegümeci, palamut, kuşburnu, kıt unla ekmek',
    art: 'sf-mb-mutfak-kapak',
    color: '#a3c46c',
    order: 188,
  },
  {
    id: 'sf-mb-kitlik',
    title: 'Kıtlıkta beslenme',
    hint: 'Kalori ve stok, vitamin eksikliği, açlık sonrası beslenme, bebek ve çocuk',
    art: 'sf-mb-kitlik-kapak',
    color: '#e8b04a',
    order: 189,
  },
  {
    id: 'sf-mb-saglik',
    title: 'İlaçsız sağlık',
    hint: 'Diyabet, tansiyon, astım, sıtma, gözlük, diş ağrısı, uyku',
    art: 'sf-mb-saglik-kapak',
    color: '#7fb8d6',
    order: 190,
  },
];

const CHECKED = '2026-11-02';

export const GUIDES: PackGuide[] = [
  // ───────────────────────── Yabani mutfak ─────────────────────────
  {
    "id": "sf-mb-kurbaga-salyangoz",
    "category": "sf-mb-mutfak",
    "title": "Kurbağa bacağı ve salyangoz pişirme",
    "tag": "KURBAĞA SALYANGOZ",
    "summary": "Salyangozu 10 gün arındırıp yaklaşık 2 saat kaynatın, kurbağa bacağını eti kemikten ayrılıp içi bembeyaz olana kadar pişirin; ikisini de asla az pişmiş yemeyin.",
    "note": "Kurbağa ve salyangoz çiğ ya da az pişmiş yenirse beyne ve göze yerleşebilen parazitler bulaştırır; her parçayı tam pişirin. Kurbağa toplama Türkiye'de su ürünleri mevzuatına bağlıdır; yakalama için 'Kerevit ve kurbağa yakalama' rehberine bakın.",
    "steps": [
      "Yalnız canlı hayvan pişirin. Ölü bulunan kurbağayı, kötü kokan ya da kabuğu kırık salyangozu atın.",
      "Çiğ salyangoza ve sümüklüböceğe toplarken de her zaman eldivenle dokunun; salgısında parazit olabilir. Salyangozu arındırın: delikli kapaklı bir kovaya koyun. İlk 7 gün temiz marul, lahana ya da sebze yaprağı ve biraz su verin; son 3 gün yalnız su verin. Her gün kovayı temizleyin, ölenleri atın.",
      "Arınmış salyangozları eldivenle tutun. 12 salyangoz için 2 yemek kaşığı tuz katılmış suda 30 dakika bekletin, sonra bol suyla durulayın.",
      "Salyangozları kaynar suya atın; kısık ateşte yaklaşık 2 saat kaynatın. Soğuyunca etini iğne ya da çatalla çıkarın, kuyruktaki koyu renkli kıvrık iç organ kısmını kesip atın.",
      "Çıkan eti soğan ve yağla tavada ya da çorbada 15 dakika daha pişirin. Her parça buharı tüten sıcaklıkta olmalı.",
      "Kurbağanın derisini soyun, iç organlarını atın. Arka bacakları kalçadan kesin, ayakları atın, eti temiz suda yıkayın.",
      "Bacakları kaynar suda haşlayın ya da tavada her yüzü altın rengi olana kadar kızartın. Et kemikten kolayca ayrılmalı, içi baştan sona beyaz ve donuk olmalı; pembe ya da yarı saydam yer kalmamalı. Termometre varsa en kalın yer 74°C olmalı.",
      "Çiğ eti kestiğiniz tahtayı ve bıçağı pişmiş yiyecekte kullanmadan önce sabunla yıkayıp kaynar sudan geçirin.",
      "İşiniz bitince ellerinizi sabunla yıkayın; bu arada gözünüze ve ağzınıza dokunmayın."
    ],
    "art": [null, "sf-mb-salyangoz-kova", null, "sf-mb-salyangoz-cikarma", null, null, "sf-mb-kurbaga-pismis", null, null],
    "dont": [
      "Salyangoz ve kurbağayı çiğ, az pişmiş, sirkede ya da tuzda bekletilmiş olarak yemeyin; parazit ölmez.",
      "Çiğ kurbağa ya da salyangoz etini yaraya ya da göze lapa olarak koymayın; parazit bu yolla da geçer.",
      "Karakurbağası ve semender pişirmeyin; derileri zehirlidir.",
      "İlaçlanmış bahçeden, yol kenarından ya da çöplükten salyangoz toplamayın; zehri bünyesinde taşır."
    ],
    "keywords": [
      "kurbağa bacağı nasıl pişirilir",
      "kurbaga bacagi pisirme",
      "salyangoz nasıl pişirilir",
      "salyangoz arındırma",
      "salyangoz yemek tarifi",
      "salyangoz kaç dakika kaynatılır",
      "kurbağa eti parazit",
      "salyangoz parazit",
      "salyangoz aç bırakma",
      "kurbağa yemeği"
    ],
    "sources": [
      "CDC — Angiostrongylus, salyangoz ve kurbağayı çiğ yememe (https://www.cdc.gov/angiostrongylus/about/index.html)",
      "Hong ve ark. 2010 — Guangdong'da sparganoz; yabani kurbağaların %27'sinde parazit, çiğ et lapası riski (https://pmc.ncbi.nlm.nih.gov/articles/PMC2815971/)",
      "Mother Earth News — Escargot: 10 gün arındırma, tuzlu su, 2 saat kaynatma (https://www.motherearthnews.com/real-food/escargot-taste-of-france-zbcz1507)",
      "FoodSafety.gov — Güvenli iç sıcaklıklar (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: CDC Angiostrongylus sayfası yeniden okundu (çiğ ya da az pişmiş salyangoz, sümüklüböcek, kurbağa yememe; eldivenle tutma ve el yıkama; sebzeyi iyi yıkama). CDC süre ya da sıcaklık vermiyor; kurbağada 74°C kanatlı ölçüsü ve salyangozda 2 saat kaynatma tutucu olarak korundu. Eldiven uyarısı toplama aşamasına da eklendi." }
  },
  {
    "id": "sf-mb-kerevit",
    "category": "sf-mb-mutfak",
    "title": "Kerevit haşlama ve temizleme",
    "tag": "KEREVİT",
    "summary": "Canlı kereviti bol tuzlu kaynar suda kabuğu baştan sona kırmızı, eti beyaz ve donuk olana kadar haşlayın; kuyruğundaki siyah bağırsağı çıkarın.",
    "note": "Çiğ ya da az pişmiş kerevit akciğere yerleşen bir parazit bulaştırır; her parçayı tam pişirin. Kerevit avı Türkiye'de su ürünleri mevzuatına bağlıdır; yakalama için 'Kerevit ve kurbağa yakalama' rehberine bakın.",
    "steps": [
      "Kereviti pişirene kadar canlı tutun: ıslak çuval ya da ıslak otla örtülü kovada, serin yerde. Ölmüş, kötü kokan, kuyruğu gevşek sarkan kereviti atın.",
      "Kerevitleri temiz suda 2–3 kez çalkalayarak yıkayın; çamuru ve kumu akıtın.",
      "Büyük bir tencerede her 1 kg kerevit için en az 3 litre su ve 1 yemek kaşığı tuzu fokurdayarak kaynatın.",
      "Kerevitleri su kaynarken atın. Su yeniden kaynamaya başladıktan sonra yaklaşık 5 dakika kaynatın.",
      "Pişme belirtisine bakın: kabuk her yerinde kırmızı-turuncu, kuyruk karına doğru kıvrık, eti beyaz ve donuk olmalı. İçinde gri, yarı saydam et kalmışsa kaynatmayı sürdürün. Termometre varsa et 63°C olmalı.",
      "Kuyruğu gövdeden çevirerek koparın. Kuyruk kabuğunu yanlardan sıkıp açın, eti çekip çıkarın.",
      "Kuyruk etinin sırtındaki ince siyah bağırsak çizgisini bıçak ucuyla çekip atın.",
      "Kıskaçları taşla hafifçe kırıp içindeki eti çıkarın.",
      "Kabukları haşlama suyuyla 30 dakika daha kaynatıp süzün; bu suyu çorba ya da pilav suyu olarak kullanın."
    ],
    "art": [null, null, null, "sf-mb-kerevit-kaynatma", "sf-mb-kerevit-pismis", null, "sf-mb-kerevit-bagirsak", null, null],
    "dont": [
      "Kereviti çiğ, yarı pişmiş, tuzlanmış, sirkeye ya da turşuya yatırılmış olarak yemeyin; akciğere yerleşen parazit (akciğer kelebeği) bulaştırır.",
      "Ölü bulduğunuz ya da ölüp bekleyen kereviti pişirmeyin; çabuk bozulur.",
      "Lağım, sanayi ya da çöplük yakınındaki sudan kerevit toplamayın.",
      "Çiğ kerevitle kullandığınız kabı yıkamadan pişmiş yemeğe kullanmayın."
    ],
    "keywords": [
      "kerevit nasıl pişirilir",
      "kerevit haşlama",
      "kerevit kaç dakika kaynar",
      "kerevit temizleme",
      "kerevit bağırsağı",
      "tatlı su istakozu pişirme",
      "kerevit çiğ yenir mi",
      "kerevit tarifi"
    ],
    "sources": [
      "CDC — Paragonimiasis: kerevit ve yengeç en az 63°C pişirilmeli, tuzlu ve turşu kerevit bulaştırır (https://www.cdc.gov/paragonimus/about/index.html)",
      "FoodSafety.gov — Kabuklular: et beyaz ve donuk olana kadar (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Sıfırdan: Yiyecek bulma — 'Kerevit ve kurbağa yakalama' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: CDC Paragonimus sayfası yeniden okundu (çiğ kerevit yok, en az 63°C; çiğ, yarı pişmiş, turşu ya da tuzlu kerevitle bulaş). 5 dakika süre mutfak ölçüsüdür; asıl ölçüt pişme belirtisidir. Not alanı eklendi." }
  },
  {
    "id": "sf-mb-isirgan-corbasi",
    "category": "sf-mb-mutfak",
    "title": "Isırgan çorbası",
    "tag": "ISIRGAN",
    "summary": "Isırganın taze uçlarını eldivenle toplayın, kaynar suda 1,5–2 dakika haşlayıp yakıcılığını giderin, soğan ve unla 15–20 dakika çorba yapın.",
    "steps": [
      "İlkbaharda, çiçeklenmeden önce ısırganın üstteki 4–6 taze yaprağını toplayın. Eldiven ve uzun kollu giysi giyin; makas ya da bıçakla kesin.",
      "Yol kenarından, ilaçlanmış tarladan, gübre yığını ve ağıl çevresinden toplamayın.",
      "Yaprakları kalın saplarından ayırın, bol suda 2–3 kez yıkayın. Bu sırada eldiveni çıkarmayın.",
      "Kaynayan suya atıp kapağı kapalı 1,5–2 dakika haşlayın; haşlama yakıcı tüyleri etkisiz bırakır. Süzüp doğrayın; haşlama suyunu çorba için ayırın.",
      "4 kişilik çorba: 1 büyük soğanı ince doğrayıp 2 yemek kaşığı yağda yaklaşık 5 dakika, pembeleşene kadar kavurun.",
      "2 yemek kaşığı mısır unu ya da buğday unu ekleyip 1 dakika karıştırarak kavurun. Un yoksa yarım su bardağı pirinç ya da bulgur koyun.",
      "Haşlanmış ısırganı (yaklaşık 2 avuç, 200–300 g taze yaprak) ve haşlama suyu dahil 1,5 litre suyu ekleyin. Topak kalmasın diye karıştırarak kaynatın.",
      "Kısık ateşte 15–20 dakika pişirin. Çiğ un kokusu gidip çorba hafifçe koyulaşınca, pirinç ya da bulgurun tanesi yumuşayınca hazırdır.",
      "1 çay kaşığı tuz ekleyin; varsa yoğurt ya da limonla yiyin. Kışa saklamak için taze uçları gölgede kurutun, kuru kavanozda en çok 6 ay tutun."
    ],
    "art": ["sf-mb-isirgan-toplama", null, null, "sf-mb-isirgan-haslama", null, null, null, "sf-mb-isirgan-corba", null],
    "dont": [
      "Isırganı haşlamadan ya da kurutmadan çiğ yemeyin; ağız ve boğazı yakar.",
      "Tam emin olmadığınız otu ısırgan diye çorbaya katmayın; zehirli bitkilerle karışabilir.",
      "Haşlanmış ısırganı yağın içinde oda sıcaklığında saklamayın; botulizm riski vardır.",
      "Yol kenarı ve ilaçlı alandan toplamayın; kurşun ve tarım ilacı biriktirir."
    ],
    "keywords": [
      "ısırgan çorbası",
      "isirgan corbasi tarifi",
      "ısırgan nasıl pişirilir",
      "ısırgan yakmaması için",
      "ısırgan haşlama",
      "ısırgan otu toplama",
      "ısırgan kurutma",
      "yabani ot çorbası"
    ],
    "sources": [
      "Oregon State Üniversitesi Extension — EM 9373 Wild edibles: Stinging nettle (https://extension.oregonstate.edu/catalog/em-9373-wild-edibles-stinging-nettle)",
      "Yemek.com — Isırgan otu çorbası (https://yemek.com/tarif/isirgan-otu-corbasi/)",
      "WHO — Scurvy in major emergencies: pişirmede C vitamini kaybı (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/4cbef0599.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: toplama zamanı, eldiven, 1,5–2 dakika haşlama, kuru saklama süresi, yağda saklama botulizm uyarısı (OSU). Çorba oranları mutfak ölçüsüdür." }
  },
  {
    "id": "sf-mb-ebegumeci-gozleme",
    "category": "sf-mb-mutfak",
    "title": "Ebegümeci kavurma ve otlu gözleme",
    "tag": "EBEGÜMECİ",
    "summary": "Ebegümecini soğan ve bir kaşık bulgurla 15 dakika kavurun; suyunu süzüp mayasız hamura sarın ve sacda her yüzü 2–3 dakika gözleme yapın.",
    "steps": [
      "Ebegümecinin genç, yuvarlak, hafif tüylü yapraklarını toplayın; sararmış ya da pas lekeli yaprakları almayın. Tanımadığınız otu katmayın.",
      "Yaprakları bol suda 3–4 kez yıkayın, kalın sapları atın, iri doğrayın. 4 kişi için 1 büyük demet (yaklaşık 500 g) yeter.",
      "Kavurma: 1 soğanı 2 yemek kaşığı yağda pembeleşene kadar kavurun. Yaprakları ekleyin; ilk başta çok görünür, birkaç dakikada söner.",
      "1 yemek kaşığı bulgur ya da pirinç, yarım çay kaşığı tuz ve 1 su bardağı sıcak su ekleyin. Kapağı kapalı, kısık ateşte 10–15 dakika pişirin. Yaprak koyu yeşil ve yumuşak, bulgur şişmiş olunca hazırdır.",
      "Gözleme hamuru (8 adet): 500 g una 1 çay kaşığı tuz ve yaklaşık 350 ml ılık suyu azar azar ekleyin. Kulak memesi yumuşaklığında yoğurun, üstünü örtüp 30–45 dakika dinlendirin.",
      "Hamuru 8 bezeye bölün. Her birini oklava ya da düz bir sopayla yufka inceliğinde açın.",
      "Kavurmanın suyunu iyice süzün. Yufkanın yarısına 2–3 yemek kaşığı iç ve varsa peynir koyun; öbür yarısını kapatıp kenarları bastırın.",
      "Sacı ya da tavayı orta ateşte ısıtın, yağ koymayın. Gözlemeyi her yüzü 2–3 dakika, yer yer kahverengi benekler çıkana kadar pişirin. Hamur bükülünce kırılmamalı, içi hamur kalmamalı.",
      "Pişince üstüne yağ sürün, sıcak yiyin. İçe ısırgan (haşlanmış), semizotu ya da madımak da koyabilirsiniz."
    ],
    "art": ["sf-mb-ebegumeci-yaprak", null, null, null, null, null, "sf-mb-gozleme-ic", "sf-mb-gozleme-sac", null],
    "dont": [
      "Ebegümecine benzeyen ama tanımadığınız yaprakları katmayın; zehirli bitkilerle karışabilir.",
      "Sulu içi yufkaya koymayın; hamur yırtılır, iç ve hamur çiğ kalır.",
      "Sacı kızgın kızgın kullanmayın; dışı yanar, içi pişmez.",
      "Yol kenarı ve ilaçlı tarla kenarından ot toplamayın."
    ],
    "keywords": [
      "ebegümeci kavurması",
      "ebegumeci nasil pisirilir",
      "ebegümeci yemeği",
      "otlu gözleme",
      "otlu gozleme tarifi",
      "mayasız gözleme",
      "sacda gözleme",
      "yabani ot kavurma"
    ],
    "sources": [
      "Yemek.com — Ebegümeci yemeği (https://yemek.com/tarif/ebegumeci-yemegi/)",
      "İşçi Haber — Ege usulü ebegümeci kavurması, 10–15 dk kısık ateş (https://www.iscihaber.net/gundem/ege-mutfaginin-vazgecilmezi-olan-ebegumeci-kavurmasi-nasil-hazirlanir/251503)",
      "Yemek.com — Mayasız gözleme: hamur oranı ve dinlendirme (https://yemek.com/tarif/mayasiz-gozleme/)",
      "Sıfırdan: Yiyecek bulma — 'Yenebilir yabani otlar' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: ebegümeci miktarı, bulgur, pişme süresi; gözleme hamur oranı (yaklaşık 275 g una 200 ml sıvı), 45 dk dinlendirme. Sac süresi görsel ölçüttür." }
  },
  {
    "id": "sf-mb-palamut-ekmegi",
    "category": "sf-mb-mutfak",
    "title": "Palamut ekmeği ve palamut kahvesi",
    "tag": "PALAMUT",
    "summary": "Acılığı tamamen alınmış palamut ununu mayalı ekmekte unun en çok beşte biri kadar kullanın; palamut kahvesi için arınmış palamudu koyu kahverengi olana kadar kavurun.",
    "steps": [
      "Önce palamudu acılığından tam arındırın ('Meşe palamudunu yenir hale getirme' rehberi). Tadında acılık kalan palamutla ekmek yapmayın.",
      "Arınmış palamudu yarı kuruyana kadar kurutup öğütün. Unu ateş kenarında ya da güneşte birkaç saat kurutun, bir kez daha öğütüp ince elekten geçirin.",
      "Palamut ununda gluten yoktur; tek başına kabarmaz. Mayalı ekmekte unun en çok beşte birini palamut unu yapın: 1 kg unun 200 g'ı palamut, 800 g'ı buğday.",
      "Ekşi mayalı ekmek tarifinizi aynen uygulayın ('Ekşi mayalı ekmek ve bazlama' rehberi); yalnız her 1 kg una yaklaşık 30 ml fazla su katın.",
      "Hamur buğday ekmeğinden yavaş kabarır, daha koyu ve sıkı olur. Mayalanma süresini biraz uzatın; hacmi bir buçuk katına çıkınca pişirin.",
      "Mayasız yassı ekmek: palamut ununu yarı yarıya buğday, arpa ya da mısır unuyla karıştırın. Tuz ve suyla koyu hamur yapın, ince açın, sacda her yüzü 2–3 dakika pişirin.",
      "Palamut kahvesi: arınmış palamudu iri parçalar halinde tepsiye serin. Fırında (yaklaşık 200°C) ya da sacda karıştırarak yaklaşık 30 dakika, koyu kahverengi olup yanık değil kavrulmuş kokana kadar kavurun.",
      "Soğuyunca dövün ya da öğütün. 1 su bardağı (250 ml) kaynar suya 1 yemek kaşığı koyun, 5–10 dakika demleyip süzün.",
      "Palamut unu çabuk acır: kuru, serin yerde, ağzı kapalı kapta saklayın. Küf ya da acımış yağ kokusu gelirse atın."
    ],
    "art": [null, null, "sf-mb-palamut-oran", null, null, null, "sf-mb-palamut-kavurma", "sf-mb-palamut-kahve", null],
    "dont": [
      "Acılığı alınmamış palamudu una katmayın; tanen mideyi bozar, bol yenirse zararlıdır.",
      "Küflü, içi kararmış palamutla un ya da kahve yapmayın.",
      "Palamut ununu bütün unun yerine kullanıp mayalı ekmek beklemeyin; kabarmaz, çiğ kalır.",
      "Kavururken palamudu siyahlaşana kadar yakmayın; acı ve yanık kokulu olur."
    ],
    "keywords": [
      "palamut ekmeği",
      "palamut unu ekmek",
      "mese palamudu ekmegi",
      "palamut kahvesi",
      "palamut kavurma",
      "palamut unu oranı",
      "acorn ekmek",
      "palamuttan kahve"
    ],
    "sources": [
      "FAO AGRIS — Application of acorn flour in leavened bread products: en çok %20 palamut unu, +%3 su (https://agris.fao.org/search/fr/records/64a2f11cac240b3840d56a36)",
      "Popular Science — Five ways to eat acorns: un hazırlama, 400°F 30 dk kavurma, 1 yemek kaşığı/250 ml (https://www.popsci.com/story/diy/eat-acorns/)",
      "Sıfırdan: Yiyecek bulma — 'Meşe palamudunu yenir hale getirme' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: %20 üst oran ve ek su (FAO AGRIS özeti), kavurma sıcaklığı ve süresi, demleme ölçüsü (Popular Science). Yassı ekmek oranı mutfak ölçüsüdür." }
  },
  {
    "id": "sf-mb-kusburnu-alic",
    "category": "sf-mb-mutfak",
    "title": "Kuşburnu ve alıç marmeladı",
    "tag": "MARMELAT",
    "summary": "Kuşburnu ya da alıcı çok yumuşayana kadar pişirip iki kez elekten ve bir kez tülbentten süzün; şekerle 25–30 dakika kaynatıp soğuk tabak testiyle kıvamını yoklayın.",
    "steps": [
      "Kuşburnunu kızarmış ve hafif yumuşamışken, alıcı sarı-turuncu ve unlu olunca toplayın. Çürük, kurtlu olanları ayıklayın.",
      "Sapları ve uçtaki kuru çiçek kalıntısını bıçakla kesin, meyveyi yıkayın.",
      "Meyveyi tencereye koyun, üstünü ancak örtecek kadar su ekleyin (3 kg meyveye yaklaşık 2 litre). Kapağı kapalı, çatalla bastırınca dağılacak kadar yumuşayana kadar pişirin; düdüklüde 40–45 dakika, normal tencerede daha uzun.",
      "Sıcakken hafifçe ezin; ince elekten tahta kaşıkla bastırarak geçirin. Elekte kalan posaya biraz su katıp bir kez daha bastırın.",
      "Püreyi ikinci kez elekten, sonra temiz tülbentten süzün. Kuşburnu çekirdeklerinin ince tüyleri ağzı, boğazı ve bağırsağı tahriş eder; tülbenti atlamayın.",
      "Şekerli marmelat: 3 kg meyveden çıkan püreye 1–1,5 kg şeker katın. Orta-kısık ateşte sürekli karıştırıp köpüğünü alarak 25–30 dakika kaynatın.",
      "Kıvam testi: soğutulmuş bir tabağa 1 kaşık damlatın, birkaç dakika soğuk yerde bekletin. Parmakla itince yüzeyi kırışıyorsa hazırdır. Sıcakken akışkan görünür, soğuyunca katılaşır.",
      "Kavanozları kaynar suda 10 dakika kaynatın. Marmeladı sıcak doldurun, ağızdan 0,5 cm boşluk bırakıp kapatın, kapalı kavanozları kaynar suda 5 dakika tutun; 300–1.800 m rakımda 10 dakika, 1.800 m üstünde (ör. Erzurum) 15 dakika.",
      "Şekersiz ya da az şekerli ezme raf ömrü taşımaz: serin yerde birkaç günde yiyin ya da ince serip pestil gibi kurutun ('Pestil ve köme' rehberi).",
      "C vitamini ısıda ve bekledikçe kaybolur. Kışın vitamin için kuşburnunu kurutup az pişirerek ya da ezip çiğ yiyin; marmelat daha çok enerji kaynağıdır."
    ],
    "art": [null, null, null, "sf-mb-kusburnu-elek", "sf-mb-kusburnu-tulbent", null, "sf-mb-marmelat-tabak", null, null, null],
    "dont": [
      "Kuşburnu püresini tülbentten geçirmeden yemeyin; tüyler boğazı ve bağırsağı tahriş eder.",
      "Alıç ve kuşburnu çekirdeklerini ezip püreye karıştırmayın.",
      "Şekersiz ezmeyi kavanozda aylarca oda sıcaklığında saklamayın; küflenir ve bozulur.",
      "Kapağı şişmiş, köpüren ya da küf tutmuş kavanozu açıp tatmayın; atın."
    ],
    "keywords": [
      "kuşburnu marmelatı",
      "kusburnu marmelati nasil yapilir",
      "alıç marmeladı",
      "alic receli",
      "kuşburnu tüyü",
      "kuşburnu süzme",
      "marmelat kıvam testi",
      "şekersiz meyve ezmesi"
    ],
    "sources": [
      "Yemek.com — Kuşburnu marmelatı: 3 kg meyve, 2 l su, 1,5 kg şeker, iki kez elek ve tülbent, 25–30 dk (https://yemek.com/tarif/kusburnu-marmelati/)",
      "NCHFP — Making jam without added pectin: soğuk tabak testi, 1/4 inç boşluk, kaynar su banyosu 5–10 dk (https://nchfp.uga.edu/how/make-jam-jelly/jams-jellies-general-information/making-jam-without-added-pectin/)",
      "NCHFP — Making reduced-sugar fruit spreads: az şekerli ürünlerin saklanması (https://nchfp.uga.edu/how/make-jam-jelly/reduced-sugar-recipes/making-reduced-sugar-fruit-spreads/)",
      "WHO — Scurvy in major emergencies: ısı ve beklemeyle C vitamini kaybı (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/4cbef0599.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NCHFP pektinsiz reçel sayfası yeniden okundu (1/4 inç ≈ 0,5 cm boşluk; kaynar su banyosu 0–1.000 ft 5 dk, 1.001–6.000 ft 10 dk, 6.000 ft üstü 15 dk; soğuk tabak testi). Eksik olan 1.800 m üstü 15 dakika eklendi. Tarif oranları (Yemek.com) mutfak ölçüsüdür. Alıç çekirdeği uyarısı tutucu olarak korundu, kaynakla teyit edilmedi." }
  },
  {
    "id": "sf-mb-kit-ekmek",
    "category": "sf-mb-mutfak",
    "title": "Kıt malzemeyle ekmek: arpa, mısır, karışık un",
    "tag": "KARIŞIK UN",
    "summary": "Mayalı ekmekte arpa ununu toplam unun en çok üçte biri tutun; mısır ekmeğini kaynar suyla yoğurup 190°C'de yaklaşık 45 dakika pişirin; karışık unla yassı ekmek yapın.",
    "steps": [
      "Unlarınızı ayırın: buğday glutenlidir ve kabarır; arpa ve çavdar az kabarır; mısır, palamut, nohut ve kestane unu hiç kabarmaz.",
      "Mayalı somun: arpa unu toplam unun en çok üçte biri olsun (1 kg unun 330 g'ı). İlk kez deniyorsanız 1 ölçü arpaya 6 ölçü buğdayla başlayın.",
      "Arpalı hamur biraz yapışkan kalmalı; çok kuru hamur sert ve kuru ekmek verir. Arpalı ekmeği fazla pişirmeyin.",
      "Mısır ekmeği (1 tepsi): 1 kg mısır unu, 1 çay kaşığı tuz, yarım su bardağı yağ ve varsa 1 su bardağı buğday unu karıştırın. Kaynar suyu azar azar ekleyip önce kaşıkla, sonra elle karıştırın; avuçta şekil alan koyu bir hamur olsun.",
      "Hamuru yağlanmış tepsiye 3–4 cm kalınlıkta yayın, üstünü ıslak elle düzeltin. Kabartma tozu yoksa ekmek yine pişer, yalnız daha sıkı olur.",
      "190°C fırında ya da tandır, sac kenarı gibi orta ateşte yaklaşık 45 dakika pişirin. Üstü koyu altın rengine dönüp kenarlar tepsiden ayrılınca ve ortasına batırılan çöp temiz çıkınca hazırdır.",
      "Karışık yassı ekmek: elinizdeki unları en az yarısı buğday olacak şekilde karıştırın. Her 500 g una 1 çay kaşığı tuz ve yaklaşık 300–350 ml su katın, 30 dakika dinlendirin, ince açıp sacda her yüzü 1–2 dakika pişirin.",
      "Arpa ve mısır ekmeği çabuk kurur; aynı gün yiyin. Bayatlayanı çorbaya doğrayın ya da ince dilimleyip kurutarak peksimet yapın.",
      "Tahılda pembe-mor ya da siyah, boynuz gibi uzun taneler (çavdar mahmuzu), küf ya da kötü koku varsa o tahılı una katmayın."
    ],
    "art": [null, "sf-mb-ekmek-arpa-oran", null, null, "sf-mb-misir-ekmegi-tepsi", "sf-mb-misir-ekmegi-kontrol", null, null, null],
    "dont": [
      "Küflü ya da çavdar mahmuzlu tahılı una katmayın; pişirmek zehrini yok etmez.",
      "Arpa unundan yalnız mayalı somun beklemeyin; ağır ve çiğ kalır.",
      "İçi hamur kalan mısır ekmeğini yemeyin; fırına geri koyun.",
      "Unu nemli ve açık yerde saklamayın; küflenir, böceklenir."
    ],
    "keywords": [
      "arpa ekmeği nasıl yapılır",
      "arpa unu oranı",
      "mısır ekmeği tarifi",
      "misir ekmegi nasil yapilir",
      "karışık unla ekmek",
      "un az ekmek yapmak",
      "glutensiz un ekmek kabarmıyor",
      "kıtlıkta ekmek"
    ],
    "sources": [
      "Western Producer — Barley makes a versatile flour: mayalı ekmekte arpa en çok üçte bir (https://www.producer.com/farmliving/team-flashback-barley-makes-a-versatile-flour/)",
      "Yemek.com — Karadeniz usulü mısır ekmeği: 1 kg mısır unu, kaynar su, 190°C, ~45 dk (https://yemek.com/tarif/misir-ekmegi-4/)",
      "Yemek.com — Mayasız gözleme hamur oranı (https://yemek.com/tarif/mayasiz-gozleme/)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: arpa üst oranı ve başlangıç oranı, mısır ekmeği malzemesi, sıcaklık ve süre. Kaynar su miktarı kaynakta da kıvama göre verilmiş; bu yüzden sayısız yazıldı." }
  },
  {
    "id": "sf-mb-tek-tencere",
    "category": "sf-mb-mutfak",
    "title": "Tek tencere yemekleri: az yakıtla tam öğün",
    "tag": "TEK TENCERE",
    "summary": "Tahıl, baklagil, yağ ve yeşili tek tencerede pişirin; kuru fasulyeyi 12 saat ıslatıp en az 10 dakika fokurdatarak kaynatın, artan yemeği 74°C'ye kadar ısıtın.",
    "steps": [
      "Tek tencerenin dörtlüsü: tahıl (bulgur, pirinç, arpa) + baklagil (mercimek, nohut, fasulye) + yağ + sebze ya da yeşil ot. Bu dörtlü enerji ve protein verir, yakıtı bir kez harcarsınız.",
      "Kuru fasulye ve nohudu bol soğuk suda en az 12 saat ıslatın, suyunu dökün. Mercimek ve bulgur ıslatma istemez.",
      "Islatılmış fasulye ve nohudu taze suda önce en az 10 dakika fokur fokur kaynatın, sonra kısık ateşe alın. Az pişmiş fasulye ağır kusma ve ishal yapar; yavaş, ılık pişirme bu zehri yok etmez.",
      "Örnek: mercimekli bulgur aşı (4 kişi). 1 su bardağı yeşil mercimek, 1 su bardağı bulgur, 1 soğan, 2 yemek kaşığı yağ, 1 çay kaşığı tuz, 2 litre su; varsa salça, kuru biber, kuru nane.",
      "Soğanı yağda 5 dakika kavurun. Mercimek ve suyu ekleyip kapağı kapalı yaklaşık 30 dakika, mercimek parmakla ezilecek kadar yumuşayana kadar pişirin.",
      "Bulguru ve tuzu ekleyip 15 dakika daha pişirin. Bulgur şişip yumuşayınca hazırdır; koyulaşırsa kaynar su ekleyin.",
      "Yakıtı azaltın: kaynayan tencereyi kapağı kapalı haliyle saman kutuya alın, kendi ısısıyla pişmeyi bitirsin ('Saman kutu' rehberi).",
      "Isırgan, ebegümeci, semizotu gibi yeşili son 5 dakikada ekleyin; uzun kaynatmak C vitaminini yok eder.",
      "Pişmiş yemeği 2 saatten fazla ılık bırakmayın. Ertesi güne kalacaksa serin yerde kapalı tutun ve yemeden önce fokur fokur kaynayana kadar (74°C) ısıtın.",
      "Kalan yemeği bir kez ısıtın; tekrar tekrar ısıtıp soğutmayın."
    ],
    "art": [null, "sf-mb-baklagil-islatma", "sf-mb-baklagil-kaynatma", null, null, null, "sf-mb-tencere-saman", null, null, null],
    "dont": [
      "Kuru fasulyeyi ıslatmadan ya da 10 dakika fokurdatmadan, yalnız ılık közde pişirmeyin.",
      "Kokmuş, köpürmüş ya da ekşimiş yemeği ısıtıp yemeyin; ısıtmak bütün zehirleri yok etmez.",
      "Bütün günün yemeğini sabah pişirip sıcak yerde ılık bekletmeyin.",
      "Kapalı yerde saman kutuyu sobaya ya da ateşe yakın koymayın; yanar."
    ],
    "keywords": [
      "tek tencere yemeği",
      "az yakıtla yemek pişirmek",
      "mercimekli bulgur",
      "kuru fasulye kaç saat ıslatılır",
      "fasulye zehirlenmesi",
      "barbunya az pişmiş",
      "yemek nasıl ısıtılır güvenli",
      "kampta tencere yemeği"
    ],
    "sources": [
      "Hong Kong Gıda Güvenliği Merkezi (CFS) — Kuru fasulye: en az 12 saat ıslatma, en az 10 dk kuvvetli kaynatma (https://cfs.gov.hk/english/multimedia/multimedia_pub/multimedia_pub_fsb_202402.html)",
      "FoodSafety.gov — Artık yemek 74°C (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "UNHCR/WFP — Food and nutrition needs in emergencies: tahıl + baklagil + yağ temel tayın (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/3b9cbef7a.pdf)",
      "WHO — Scurvy in major emergencies: pişirmede C vitamini kaybı (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/4cbef0599.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: CFS sayfası yeniden okundu (en az 12 saat ıslatma, en az 10 dk kuvvetli kaynatma, düşük ısıda pişirmenin zehri yok etmeyebileceği). 74°C ısıtma (FoodSafety.gov), tayın bileşimi (UNHCR) önceki tura dayanıyor. Değişiklik yok." }
  },

  // ───────────────────────── Kıtlıkta beslenme ─────────────────────────
  {
    "id": "sf-mb-kalori-stok",
    "category": "sf-mb-kitlik",
    "title": "Kalori hesabı ve yiyecek stoku planlama",
    "tag": "KALORİ",
    "summary": "Kişi başına günde 2.100 kcal planlayın; soğukta ve ağır işte artırın, stoku kişi × gün × günlük pay ile hesaplayıp her hafta tartın.",
    "steps": [
      "Planlama ölçüsü kişi başına günde 2.100 kcal. Bu, hafif iş yapan karışık bir topluluk için BM'nin (WFP ve UNHCR) acil durum ölçüsüdür.",
      "Enerjinin en az %10–12'si proteinden, en az %17'si yağdan gelsin. Yalnız tahılla 2.100 kcal'i tutturmak yetmez.",
      "Kolay ölçü: 100 g kuru tahıl, un, bulgur, pirinç ya da kuru baklagil yaklaşık 330–360 kcal; 100 g yağ 885 kcal; 100 g şeker 400 kcal.",
      "Örnek günlük pay (kişi başı ≈ 2.100 kcal): 400–450 g un, bulgur ya da pirinç; 50–60 g kuru baklagil; 25 g yağ; 15–20 g şeker; 5 g iyotlu tuz. Varsa 100 g taze sebze ya da meyve ekleyin.",
      "Soğuğa göre artırın: barınak ve giysi yetersizse ortam 20°C'nin altında her 5°C düşüş için kişi başı günde 100 kcal ekleyin (15°C'de +100, 0°C'de +400).",
      "Ağır işe göre artırın: ağır işte çalışan erkeğe günde yaklaşık 850 kcal, kadına 330 kcal ek pay; orta işte erkeğe 360, kadına 100 kcal.",
      "Stok hesabı: kişi sayısı × gün × günlük pay. Örnek: 5 kişi × 90 gün × 450 g tahıl = yaklaşık 203 kg tahıl. Öğütme, fare ve bozulma kaybı için %10 fazla ayırın.",
      "Ambar defteri tutun: her hafta tartın ve kalan gün sayısını hesaplayın. Stok 30 günün altına inerse payları planlı azaltın; gebe, emziren, çocuk ve hastanın payını en son azaltın.",
      "Vitamin için tahıl dışı besin şart: her gün bir avuç yeşil ot ya da meyve, sık sık baklagil, varsa yumurta, süt, et. Aylarca yalnız tahıl iskorbüt, pellagra ve beriberi yapar."
    ],
    "art": [null, null, "sf-mb-kalori-terazi", "sf-mb-gunluk-pay", null, null, "sf-mb-ambar-hesap", null, null],
    "dont": [
      "Stoku göz kararıyla tahmin etmeyin; tartın ve yazın.",
      "Yağı ve baklagili kısıp yalnız tahıla güvenmeyin; enerji ve protein yetmez.",
      "Payı azaltırken çocuk, gebe ve emziren annenin payını ilk sıraya koymayın.",
      "Kışın ve ağır işte aynı payla devam etmeyin; insanlar zayıflar ve hastalanır."
    ],
    "keywords": [
      "günde kaç kalori lazım",
      "kişi başı kalori ihtiyacı",
      "yiyecek stoku hesaplama",
      "kaç kilo un lazım",
      "2100 kalori",
      "erzak planlama",
      "kalori hesabı nasıl yapılır",
      "kıtlıkta tayın"
    ],
    "sources": [
      "ENN Field Exchange — Revised WFP/UNHCR guidelines: 2.100 kcal, %10–12 protein, %17 yağ (https://ennonline.net/fex/3/summary)",
      "UNHCR/WFP — Food and nutrition needs in emergencies: örnek tayınlar, kcal/100 g, sıcaklık ve iş ekleri (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/3b9cbef7a.pdf)",
      "ENN HTP v2 Modül 11 — 20°C altında her 5°C için +100 kcal (https://ennonline.net/sites/default/files/HTP-v2-module-11-fact-sheet.pdf)",
      "USAID Field Operations Guide — Tayın seçenekleri, 2.100 kcal (https://relief.unboundmedicine.com/relief/view/Field-Operations-Guide/502054/all/images/)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: ENN HTP modül 11 yeniden okundu (2.100 kcal; 20°C altında her 5°C için +100 kcal; yağ en az %17, protein %10–12). Örnek tayın gramajları ve iş ekleri UNHCR/WFP belgesine dayanıyor, bu turda yeniden açılmadı. Değişiklik yok." }
  },
  {
    "id": "sf-mb-protein-acligi",
    "category": "sf-mb-kitlik",
    "title": "Protein açlığı (tavşan açlığı)",
    "tag": "PROTEİN AÇLIĞI",
    "summary": "Yalnız yağsız etle beslenmek bulantı, ishal ve zayıflama yapar; proteinden gelen enerji toplamın üçte birini geçmesin, her et öğününe yağ ya da karbonhidrat ekleyin.",
    "steps": [
      "Belirtiyi tanıyın: bol yağsız et (tavşan, kurbağa, kerevit, yağsız av ve balık) yediği halde zayıflama, doymama, bulantı, ishal ve halsizlik. Buna protein zehirlenmesi ya da tavşan açlığı denir.",
      "Nedeni: karaciğer proteini ancak sınırlı hızla işleyebilir. Proteinden gelen enerji toplam enerjinin üçte birini (yaklaşık %35) geçerse zarar başlar.",
      "Kaba üst sınır: kilo başına günde 2–2,5 g protein. 70 kg biri için günde 140–175 g protein, yani kabaca 700–850 g yağsız et. Bunun üstünde ek enerjiyi yağ ve karbonhidrattan alın.",
      "Her et öğününe yağ ya da karbonhidrat ekleyin: tahıl, patates, kök, kestane, palamut, kuru meyve, bal, pekmez, hayvan ya da bitki yağı.",
      "Avın yağını atmayın: böbrek ve iç yağı, karaciğer, yürek. Kemikleri kırıp iliği çıkarın; kemikleri kaynatıp üste çıkan yağı kaşıkla toplayın.",
      "Yağsız avı yağlı besinle eşleyin: ceviz, fındık, ay çekirdeği, zeytin, tereyağı, peynir.",
      "Tavşan, kurbağa ve kereviti ana besin değil ek besin sayın; enerjinin çoğunu tahıl, kök ve yağdan alın.",
      "Kışın ve ağır işte enerji ihtiyacı artar; payı etten değil yağdan ve tahıldan artırın.",
      "Belirti başladıysa et miktarını azaltın, yağ ve karbonhidrat ekleyin. İshal varsa sıvı ve tuz kaybını yerine koyun ('Sıvı kaybı ve evde ağızdan sıvı tedavisi' rehberi)."
    ],
    "art": [null, null, null, "sf-mb-protein-tabak", "sf-mb-kemik-iligi", null, null, null, null],
    "dont": [
      "Günlerce yalnız tavşan ya da yağsız balıkla beslenmeyin; ne kadar çok yerseniz o kadar kötüleşir.",
      "Avın yağını ve iliğini 'ağır' diye atmayın.",
      "Protein açlığı belirtisini açlık sanıp daha çok yağsız et yemeyin.",
      "İshalde sıvı ve tuz kaybını ihmal etmeyin."
    ],
    "keywords": [
      "tavşan açlığı",
      "protein zehirlenmesi",
      "sadece et yemek zararlı mı",
      "yağsız et ishal",
      "avla beslenmek yetmiyor",
      "et yiyorum ama zayıflıyorum",
      "rabbit starvation",
      "kemik iliği yağı"
    ],
    "sources": [
      "Bilsborough ve Mann 2006 — A review of issues of dietary protein intake in humans: üst sınır ~2–2,5 g/kg, enerjinin %35'i üstü aşırı (https://www.unboundmedicine.com/medline/citation/16779921/full_citation)",
      "Science-Based Medicine — Is meat poison? Tavşan açlığı tanımı ve belirtileri (https://sciencebasedmedicine.org/is-meat-poison-is-fat-the-antidote/)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: üst protein sınırı, %35 eşiği, bulantı ve ishal belirtileri. Et gramajı tavşan etinin ~%20 proteinine göre yaklaşık hesaptır." }
  },
  {
    "id": "sf-mb-iskorbut",
    "category": "sf-mb-kitlik",
    "title": "İskorbüt ve yabani C vitamini kaynakları",
    "tag": "İSKORBÜT",
    "summary": "Taze besin olmadan aylarca kalanlarda diş eti kanaması ve morarma iskorbüttür; her gün taze ot, meyve ya da filizlendirilmiş baklagil yiyerek önleyin.",
    "steps": [
      "Risk: taze sebze ve meyve olmadan aylarca un, tahıl, kuru baklagil, kuru et ve şekerle beslenmek. Çok az C vitamini alanda belirtiler 1 ay kadar sonra başlayabilir; kamplarda çoğu 3–4 ayda görülmüştür.",
      "Erken belirtiler: yorgunluk, isteksizlik, sinirlilik, bacak ve ayaklarda sızlayan ağrı.",
      "İleri belirtiler: şişen ve kanayan diş eti, kıl dipleri çevresinde küçük kırmızı noktalar, kolay morarma, eklem şişliği, iyileşmeyen yara, sallanan diş. Bebekte bacağa dokununca ağlama ve bacağı kıpırdatmama.",
      "Önleme: herkes her gün C vitamini kaynağı yesin. Günde 10 mg bile hastalığı önler; sağlıklı düzey için yetişkine günde 75–90 mg gerekir.",
      "Kaynaklar: kuşburnu, ısırgan, semizotu ve diğer taze yeşillikler, lahana, domates, biber, taze patates. Taze patateste 100 g'da yaklaşık 30 mg vardır; 8–9 ay depoda 8 mg'a iner.",
      "Kışın en sağlam kaynak filizdir: kuru nohut, mercimek ya da fasulyeyi 12 saat ıslatın, ıslak bez arasında 21–25°C'de, gün ışığı alan ama güneş görmeyen yerde tutun. Bezi hep nemli tutun.",
      "Filiz çıktıktan sonra 2–4 gün içinde yiyin; filizi koparıp atmayın. Filizlenmiş baklagilin her 100 g kuru tanesi 30–50 mg C vitamini verir; yalnız ıslatmak vermez.",
      "C vitamini ısıda ve bekledikçe kaybolur: otu toplandığı gün yiyin, mümkünse çiğ yiyin. Pişirecekseniz kısa pişirin; filizi en çok yarım saat, biraz ekşi katılmış suda pişirin.",
      "Belirti başladıysa her öğüne C vitaminli besin ekleyin. Diş eti kanaması ve morarma birkaç günde gerilemezse sağlık çalışanına ulaşın."
    ],
    "art": [null, null, "sf-mb-iskorbut-belirti", null, null, "sf-mb-filiz-bez", "sf-mb-filiz-hazir", null, null],
    "dont": [
      "Kışı yalnız un, bulgur ve kuru baklagille geçirmeye çalışmayın.",
      "Filizlendirdiğiniz tanenin filizini atıp yalnız taneyi pişirmeyin.",
      "Yeşillikleri uzun süre kaynatıp suyunu dökmeyin.",
      "Çam iğnesi çayı yapacaksanız ağacı kesin tanıyın; porsuk ağacı ölümcül zehirlidir."
    ],
    "keywords": [
      "iskorbüt",
      "iskorbut belirtileri",
      "diş eti kanıyor kıtlık",
      "c vitamini eksikliği",
      "yabani c vitamini",
      "filizlendirme nasıl yapılır",
      "nohut filizlendirme",
      "taze sebze yok vitamin"
    ],
    "sources": [
      "WHO — Scurvy and its prevention and control in major emergencies (WHO/NHD/99.11) (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/4cbef0599.pdf)",
      "NIH ODS — Vitamin C fact sheet: 10 mg eşiği, ~1 ayda belirti, RDA (https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/)",
      "ENN Field Exchange — Scurvy: tek çözüm yok, taze besin ve yerel üretim (https://ennonline.net/fex/1/scurvy)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NIH ODS yeniden okundu (10 mg/gün altı uzun süre; ~1 ayda belirti; RDA 75/90 mg). Değişiklik yok. Önceki tur: başlangıç süreleri, belirtiler (yetişkin ve bebek), 10 mg ve RDA, patates değerleri, filizlendirme yöntemi ve verimi, pişirme kayıpları." }
  },
  {
    "id": "sf-mb-pellagra-beriberi",
    "category": "sf-mb-kitlik",
    "title": "Pellagra ve beriberi: tek tahılın riskleri",
    "tag": "TEK TAHIL",
    "summary": "Aylarca yalnız mısır yiyenlerde pellagra, yalnız beyaz pirinç ya da nişasta yiyenlerde beriberi çıkar; mısırı külle ya da kireçle işleyin, her gün baklagil ve ikinci bir tahıl ekleyin.",
    "note": "Beriberi kalbi tutabilir ve ölümcül olabilir; bu rehber beslenmeyle önlemeyi anlatır, tedavinin yerini tutmaz. Kireç ve kül suyu yakıcıdır; eldiven ve gözlükle çalışın.",
    "steps": [
      "Tek tahıl tehlikesi: aylarca hemen yalnız mısır ya da darı yiyenlerde pellagra; yalnız beyaz pirinç, manyok ya da patates gibi nişasta yiyenlerde beriberi görülür.",
      "Pellagra belirtileri: güneş gören deride (el sırtı, ön kol, ayak, yüz, boyun) önce güneş yanığı gibi, sonra pullanan ve koyulaşan döküntü; boyunda kolye gibi bant. Kızarık ağrılı dil, ishal, kaygı, çökkünlük; ağır durumda bunama. İlkbahar sonu ve yaz başında artar.",
      "Mısırı kireçle işleyin: 1 kg kuru tane mısıra 2 litre su ve 20 g söndürülmüş kireç (toz kireç hafiftir; tartı yoksa yaklaşık 2–3 silme yemek kaşığı) koyun; bu yaklaşık %1'lik kireç suyudur. Kaynamaya yakın ısıda 20–45 dakika, kabuk ovunca soyulana kadar pişirip bir gece bekletin. Sonra 2–3 kez bol suda ovarak yıkayıp kabuğu ve fazla kireci atın, öğütün. Kireç yoksa süzülmüş odun külü suyu kullanılır ama gücü değişir, oranı verilemez; aynı belirtiye (kabuğun ovunca soyulması) bakın. Bu eski yöntem mısırdaki niasini açığa çıkarır.",
      "Daha kolay yol: mısırın yanına her gün baklagil (fasulye, nohut, mercimek), yer fıstığı, et, balık, ciğer, süt ya da yeşil yaprak ekleyin; buğday ya da arpa gibi ikinci bir tahıl katın.",
      "Beriberi belirtileri: ayak ve bacaklarda uyuşma, yanma, güçsüzlük, yürüme zorluğu, kas erimesi. Bazılarında bacaklarda şişlik, nefes darlığı ve çarpıntı olur; bu kalp tutulumudur ve ölümcül olabilir.",
      "Önleme: beyaz pirinç yerine kepekli ya da kabuğuyla haşlanıp kurutulmuş pirinç, tam buğday ve bulgur yiyin; her gün baklagil ve sebze ekleyin.",
      "B1 vitamini suda çözünür: pirinci ve sebzeyi bol suda haşlayıp suyunu dökmeyin. Az suyla, suyunu çekecek şekilde pişirin; tahılı gereğinden fazla yıkamayın.",
      "Emziren annenin beslenmesine özen gösterin; annesi beriberili bebek de hastalanabilir. Emzirmeyi kesmeyin, anneyi besleyin.",
      "Belirtiler varsa beslenmeyi hemen çeşitlendirin ve ilk fırsatta sağlık çalışanına gösterin. Nefes darlığı, şişlik ya da bilinç bulanıklığı varsa beklemeyin."
    ],
    "art": [null, "sf-mb-pellagra-deri", "sf-mb-misir-kul", null, null, null, "sf-mb-pirinc-suyu", null, null],
    "dont": [
      "Aylarca tek bir tahılla beslenmeyin; yanına mutlaka baklagil ya da hayvansal besin koyun.",
      "Kireci ve kül suyunu çıplak elle karıştırmayın, göze kaçırmayın; yakar. Kireç tozunu solumayın, çocuklardan uzak tutun.",
      "İnşaat kirecinin katkılısını, çimentoyu, boyalı ya da emprenyeli tahta külünü kullanmayın; zehirli madde içerebilir.",
      "Kireçle işlenmiş mısırı yıkamadan öğütmeyin.",
      "Pirincin ve sebzenin haşlama suyunu her seferinde dökmeyin."
    ],
    "keywords": [
      "pellagra",
      "pellegra belirtileri",
      "beriberi",
      "b1 vitamini eksikliği",
      "sadece mısır yemek",
      "sadece pirinç yemek zararı",
      "mısırı külle pişirme",
      "niasin eksikliği"
    ],
    "sources": [
      "WHO — Pellagra and its prevention and control in major emergencies (WHO/NHD/00.10) (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/4cbeefad9.pdf)",
      "ENN Field Exchange — WHO Thiamine deficiency in major emergencies özeti (https://ennonline.net/fex/3/thiamine)",
      "NIH ODS — Thiamin fact sheet: belirtiler, beyaz pirinç, suda kayıp (https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/)",
      "FAO — Maize in human nutrition (1992), Bölüm 4 kireçle pişirme: 1 ölçü mısıra 2 ölçü yaklaşık %1 kireç çözeltisi, 80°C civarı 20–45 dk, bir gece bekletme, 2–3 kez yıkama (https://www.fao.org/4/t0395e/T0395E05.htm)",
      "FAO — Maize in human nutrition, Bölüm 5: kireçle işlenmiş mısırda niasin daha kullanılabilir (https://www.fao.org/4/t0395e/T0395E06.htm)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: FAO 'Maize in human nutrition' Meksika kırsal yöntemi ile kireç oranı (1:2, ~%1), süre ve yıkama eklendi. Odun külü için güvenilir oran bulunamadı; sayısız bırakıldı. Pellagra ve beriberi belirtileri önceki tura dayanıyor (WHO/NHD/00.10, ENN, ODS); bu turda yeniden açılmadı." }
  },
  {
    "id": "sf-mb-refeeding",
    "category": "sf-mb-kitlik",
    "title": "Uzun açlıktan sonra yemeye başlama",
    "tag": "AÇLIK SONRASI",
    "summary": "Günlerce aç kalmış kişiye ilk gün kilo başına en çok 10 kcal verin, küçük sık öğünlere bölün ve 4–7 günde yavaş yavaş tam paya çıkın; şişme, nefes darlığı ve kafa karışıklığına bakın.",
    "note": "Uzman gözetimi olmadan ağır açlık sonrası beslemek hayati risk taşır; hastanede bu dönemde vitamin ve elektrolit desteği ile kan tahlili yapılır. Bu rehber yalnız yetişkin ve ergen içindir ve sağlık personeline ulaşılana kadar en yavaş, en güvenli hızı anlatır.",
    "steps": [
      "Risk kimde: 5 günden uzun hemen hiç yememiş, son 3–6 ayda kilosunun onda birinden fazlasını kaybetmiş ya da çok zayıf kişi. 10 günden uzun aç kalanda ya da kilosunun yedide birini kaybedende risk yüksektir. Bu hesap çocuk için değildir: 5 yaşından küçük ağır zayıf çocuk için son adıma bakın.",
      "Tehlikeyi bilin: aç vücuda birden bol yemek verilince ilk 4–5 gün içinde kalp ritmi bozulabilir; nefes darlığı, şişlik, kafa karışıklığı, nöbet ve ölüm olabilir. Hemen doyurmak değil, yavaş başlamak hayat kurtarır.",
      "İlk gün miktarı: kilo başına en çok 10 kcal. 50 kg biri için günde 500 kcal (yaklaşık 140 g un ya da bulgurun enerjisi). Kemikleri iyice belirgin, iskelet gibi olan ya da 15 günden uzun hiç yememiş kişiye bunun yarısı: kilo başına 5 kcal.",
      "Bu miktarı 6–8 küçük öğüne bölün: 2–3 saatte bir birkaç kaşık sulu çorba, lapa, yoğurt ya da sulandırılmış süt. Gece de bir öğün verin.",
      "Belirti yoksa miktarı her gün eşit adımlarla artırıp en erken 4, en geç 7 günde tam paya çıkın. Örnek 50 kg kişi: 500, 750, 1.000, 1.250, 1.500, 1.800, 2.100 kcal. Kilo başına 5 kcal'le başladıysanız acele etmeyin, 7 günün tamamını kullanın.",
      "Karışık ve yumuşak yiyecek verin: süt, yoğurt, yumurta, tahıl çorbası, ezilmiş baklagil, sebze; varsa az miktar et ya da ciğer. Süt ürünü, yumurta ve baklagil bu dönemde azalan mineralleri ve B1 vitaminini yerine koymaya yardım eder. İlk günlerde şekerli içecek, bal, pekmez ve tatlıyı bol vermeyin.",
      "Suyu küçük yudumlarla, gün boyuna yayarak verin; birden çok miktar içirmeyin.",
      "Her sabah dinlenirken dakikadaki nabzı ve nefes sayısını sayıp yazın. Her gün izleyin: nabız ya da nefes sayısında belirgin artış, ayak bileği, yüz ve göz kapağında şişme, nefes darlığı, çarpıntı, soğuk el-ayak, dudakta morarma, kafa karışıklığı, kas krampı, aşırı güçsüzlük. Biri başlarsa artırmayı durdurun, miktarı bir önceki günün düzeyine indirin, en az 1–2 gün o düzeyde kalın ve sağlık çalışanı arayın.",
      "Ağır zayıf çocuk (kol çevresi 11,5 cm altı ya da iki ayakta şişlik) ve ağır zayıf bebek özel süt ve ilaçla tedavi ister; bu rehberdeki kilo başına hesabı çocukta kullanmayın. En yakın sağlık ekibine ulaştırın; o zamana kadar emzirmeyi sürdürün, sık ve küçük öğün verin, sıcak tutun ('Çocukta ağır zayıflığı tanıma' rehberi)."
    ],
    "art": [null, null, "sf-mb-refeeding-hesap", "sf-mb-refeeding-kucuk-ogun", null, null, null, "sf-mb-refeeding-izlem", null],
    "dont": [
      "Günlerce aç kalmış kişiye 'açtır, doysun' diye bir anda büyük tabak yemek vermeyin.",
      "İlk günlerde yalnız şekerli su, bal ya da tatlıyla beslemeyin.",
      "Şişme, nefes darlığı ve kafa karışıklığını 'yorgunluk' sanıp miktarı artırmayı sürdürmeyin.",
      "Ağır zayıf çocuğu yetişkin gibi beslemeye çalışmayın; sağlık ekibine ulaştırın."
    ],
    "keywords": [
      "uzun açlıktan sonra yemek",
      "açlık sonrası beslenme",
      "refeeding sendromu",
      "aç kalan kişiye ne verilir",
      "günlerce aç kaldı ne yedirmeli",
      "yeniden besleme sendromu",
      "açlıktan sonra şişme",
      "enkazdan çıkan aç kişi beslenme"
    ],
    "sources": [
      "NICE CG32 — Nutrition support for adults, 1.4.6–1.4.8: risk ölçütleri, en çok 10 kcal/kg, aşırı riskte 5 kcal/kg, 4–7 günde tam ihtiyaç (https://www.nice.org.uk/guidance/cg32/chapter/Recommendations)",
      "EBSCO Research Starters — Refeeding syndrome: tarihçe, belirtiler, ilk 4–5 gün (https://www.ebsco.com/research-starters/health-and-medicine/refeeding-syndrome)",
      "ENN Field Exchange 12 — Revised MSF nutrition guidelines: yetişkinde 1. evre 40 kcal/kg/gün (terapötik sütle), aşırı beslemede ödem artışı, kalp yetmezliği belirtileri (nabız, nefes, soğuk el-ayak, morarma) (https://ennonline.net/fex/12/revised)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NICE CG32 1.4.6–1.4.8 yeniden okundu (en çok 10 kcal/kg, 4–7 günde tam ihtiyaç; hastanede B1, multivitamin, potasyum, fosfat, magnezyum desteği). MSF yetişkin protokolü terapötik sütle 40 kcal/kg başlıyor; vitamin-mineral desteği olmayan ev ortamı için NICE'ın daha yavaş başlangıcı korundu. Çocukta kullanılmaması, MSF tehlike belirtileri ve belirti çıkınca bekleme eklendi. İlaç ve takviye dozu yazılmadı." }
  },
  {
    "id": "sf-mb-su-tuz",
    "category": "sf-mb-kitlik",
    "title": "Ağır işte su, tuz ve yemek",
    "tag": "SU VE TUZ",
    "summary": "Sıcakta ve ağır işte susamayı beklemeden her 15–20 dakikada bir su bardağı için, saatte 6 su bardağını (yaklaşık 1,4 litre) geçmeyin, saatlerce terliyorsanız tuzu da yerine koyun.",
    "steps": [
      "Susamayı beklemeyin: işe başlarken 1 su bardağı, sonra her 15–20 dakikada 1 su bardağı (yaklaşık 250 ml) su için.",
      "Saatte 6 su bardağından (yaklaşık 1,4 litre) fazla su içmeyin. Çok fazla düz su kandaki tuzu seyreltir; baş ağrısı, bulantı ve kafa karışıklığı yapabilir.",
      "Birkaç saatten uzun terliyorsanız yalnız su yetmez: tuzlu yemek yiyin ya da tuzlu-şekerli sıvı için ('Sıvı kaybı ve evde ağızdan sıvı tedavisi' rehberi).",
      "İdrar rengine bakın: açık saman sarısı iyi; koyu sarı ve az idrar sıvı açığı demektir.",
      "Sıcakta çalışmaya alışmamış biri ilk gün olağan sürenin en çok beşte birini sıcakta çalışsın, her gün en çok beşte bir artırsın. Alışma 1–2 hafta sürer.",
      "İşi sabah ve akşamın serin saatlerine alın; sıcak arttıkça çalışma süresini kısaltıp gölgede molayı uzatın.",
      "Ağır işte enerji ihtiyacı artar: ağır iş yapan erkeğe günde yaklaşık 850 kcal, kadına 330 kcal ek pay ayırın; ek payı tahıl ve yağdan verin.",
      "Tuz: olağan yaşamda günde 5 g'ın (silme bir çay kaşığı) altında kalın. Bol terleyen ağır işçi yemeğine biraz daha tuz katabilir; tansiyon ve kalp hastası tuz artırmadan önce dikkat etsin.",
      "Kas krampı, baş dönmesi, bulantı olursa işi bırakın, gölgeye geçin, tuzlu sıvı için. Terleme durur, bilinç bulanırsa bu sıcak çarpmasıdır: hemen soğutun ('Sıcak çarpması' rehberi)."
    ],
    "art": ["sf-mb-is-su-icme", null, null, "sf-mb-idrar-renk", null, "sf-mb-golge-mola", null, null, null],
    "dont": [
      "Bir defada litrelerce düz su içmeyin.",
      "Sıvı açığını alkol, çok kahve ya da şekerli içecekle kapatmaya çalışmayın.",
      "Sıcağa alışmamış kişiyi ilk gün tam gün ağır işe koymayın.",
      "Bilinci bulanan, terlemesi durmuş kişiye zorla su içirmeyin; önce soğutun ve yardım çağırın."
    ],
    "keywords": [
      "sıcakta ne kadar su içmeli",
      "ağır işte su",
      "terleyince tuz kaybı",
      "saatte kaç litre su",
      "fazla su içmek zararlı mı",
      "idrar rengi susuzluk",
      "sıcağa alışma",
      "tarlada çalışırken su"
    ],
    "sources": [
      "CDC NIOSH — Heat stress recommendations: 15–20 dk'da 1 bardak, saatte en çok 48 oz, alışma programı (https://www.cdc.gov/niosh/heat-stress/recommendations/index.html)",
      "WHO — Salt reduction: günde 5 g'dan az tuz (https://www.who.int/news-room/fact-sheets/detail/salt-reduction)",
      "UNHCR/WFP — Food and nutrition needs in emergencies: orta ve ağır işte ek enerji (https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/3b9cbef7a.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NIOSH sayfası yeniden okundu (15–20 dakikada 1 bardak/8 oz; saatte en çok 6 bardak ≈ 1,4 l; yeni işçide 1. gün en çok %20, her gün en çok %20 artış). 1,5 l → 1,4 l düzeltildi. Tuz sınırı (WHO) ve iş ekleri (UNHCR) önceki tura dayanıyor." }
  },
  {
    "id": "sf-mb-cocuk-beslenme",
    "category": "sf-mb-kitlik",
    "title": "Kıtlıkta bebek ve çocuk beslenmesi",
    "tag": "ÇOCUK BESLENME",
    "summary": "İlk 6 ay yalnız anne sütü verin, 6. ayda koyu lapa ile ek gıdaya başlayın ve emzirmeyi 2 yaşına kadar sürdürün; kıt yiyeceği önce küçük çocuğun kabına koyun.",
    "note": "Bu rehber sağlık çalışanının yerini tutmaz. Zayıflayan, ishali süren ya da emmeyen bebeği sağlık personeline ulaşılana kadar bu ilkelerle besleyin ve ilk fırsatta gösterin.",
    "steps": [
      "İlk 6 ay yalnız anne sütü: su, çay, şekerli su ya da ot suyu bile vermeyin. Anne sütü hem besler hem kirli sudan korur.",
      "Emziren annenin payını artırın; ek yiyecek ve bol içme suyu ayırın. Az yiyen anne de süt verir; emzirmeyi kesmeyin, sık emzirin.",
      "6. ayda ek gıdaya başlayın; emzirmeyi 2 yaşına ve sonrasına kadar sürdürün.",
      "Öğün sayısı: 6–8 ay günde 2–3 öğün, 9–23 ay günde 3–4 öğün; gerekirse 1–2 ara öğün.",
      "Koyu lapa yapın: kaşıktan akmayacak kıvamda tahıl lapasına ezilmiş baklagil, bir çay kaşığı yağ ve ezilmiş sebze ya da haşlanmış ot ekleyin. Sulu çorba karnı doyurur ama beslemez.",
      "Her gün mümkünse hayvansal besin verin: yumurta, et, ciğer, balık ya da süt ürünü. Yoksa sık sık baklagil, dövülmüş ceviz, fındık ya da susam ekleyin.",
      "Tuz, şeker, çay ve şekerli içecek vermeyin. 1 yaşından küçük bebeğe bal ve pekmez vermeyin; bal bebekte botulizm yapabilir.",
      "Sabırla, çocuğun açlık ve tokluk işaretlerine bakarak besleyin. Zorlamayın, ama kendi kabından payını yediğinden emin olun; kardeşlerle ortak kaptan yedirmeyin.",
      "Yemeği taze pişirin, 2 saatten fazla bekletmeyin; ellerinizi ve kabı sabunla yıkayın, biberon yerine bardak ve kaşık kullanın.",
      "Hastalıkta da emzirmeyi ve beslemeyi sürdürün; iyileşince birkaç hafta günde bir öğün fazla verin. Zayıflamayı izleyin ('Çocukta ağır zayıflığı tanıma' rehberi)."
    ],
    "art": ["sf-mb-emzirme", null, null, null, "sf-mb-lapa-kivam", "sf-mb-cocuk-tabak", null, null, null, null],
    "dont": [
      "6 aydan küçük bebeğe su, çay, şekerli su, nişasta ya da pirinç suyu vermeyin.",
      "1 yaşından küçük bebeğe bal vermeyin.",
      "Çiğ (kaynatılmamış) hayvan sütü vermeyin.",
      "Bebeği yalnız sulu çorba ya da çayla doyurmaya çalışmayın.",
      "Biberon ve emzik kullanmayın; temizlenemez, ishal yapar."
    ],
    "keywords": [
      "bebeğe ek gıda ne zaman",
      "kıtlıkta bebek beslenmesi",
      "çocuk kaç öğün yemeli",
      "6 aylık bebek ne yer",
      "bebek lapası kıvamı",
      "1 yaş altı bal",
      "cocuk beslenmesi kitlik",
      "emzirme kaç yaşına kadar"
    ],
    "sources": [
      "WHO — Infant and young child feeding fact sheet: 6 ay yalnız anne sütü, öğün sayıları (https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding)",
      "ENN Field Exchange 72 — WHO 2023 complementary feeding guideline: hayvansal besin, şekerli içecekten kaçınma, duyarlı besleme (https://ennonline.net/fex/72/who-guideline-for-complementary-feeding-of-infants-and-young-children)",
      "IFE Core Group — Operational Guidance on IFE, sağlık bölümü (https://ennonline.net/sites/default/files/2024-02/og-ife_health.pdf)",
      "CDC — Botulism prevention: 1 yaş altına bal yok (https://www.cdc.gov/botulism/prevention/index.html)",
      "CDC — Cow's milk and milk alternatives: çiğ süt verilmez (https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/cows-milk-and-milk-alternatives.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WHO 2023 tamamlayıcı beslenme özeti (6. ayda başlama, 2 yaş ve sonrası emzirme, şekerli içecekten kaçınma, 6–11 ayda hayvan sütü uygun), WHO IYCF öğün sayıları, CDC bal (12 ay) ve çiğ süt yasağı, IFE modül 2 (bardakla besleme, biberondan kaçınma). Değişiklik: sağlık personeli notu eklendi." }
  },
  {
    "id": "sf-mb-mama-yoksa",
    "category": "sf-mb-kitlik",
    "title": "Mama yoksa bebek: verilebilecekler ve asla verilmeyecekler",
    "tag": "MAMA YOK",
    "summary": "Önce emzirmeyi yeniden başlatın ya da sütanne bulun; 6 aydan küçük bebeğe ev usulü inek sütü karışımı yalnız sağlık personeline ulaşılana kadar son çare olarak, en kısa süre, ölçüsüne tam uyarak bardakla verilir.",
    "note": "Uzman gözetimi olmadan bebeğe anne sütü dışında süt hazırlamak ishal, susuzluk, yetersiz beslenme ve ölüm riski taşır. Ev usulü hayvan sütü karışımı yalnız anne sütü, sütanne ve hazır mama hiç yokken, sağlık personeline ulaşılana kadar en kısa süre kullanılacak son çaredir; vitamin-mineral desteği gerekir.",
    "steps": [
      "Önce anne sütü: anne yakında ve sağsa emzirmeyi yeniden başlatın. Bebeği 24 saatte en az 8–12 kez, gece de, her memede 10–15 dakika emzirin. Süt birkaç günde ya da birkaç haftada gelir; bu sürede bebeği aç bırakmayın: önce memeye koyun, sonra eksik kalanı bardakla verin. Günde 6 ve daha çok ıslak bez, açık renkli idrar ve haftada en az 125 g kilo alma yeterli beslendiğini gösterir.",
      "Anne yoksa sütanne: sağlıklı, emziren bir kadın bebeği emzirebilir; emzirmeyi bırakmış bir kadın da yukarıdaki gibi sütünü geri getirebilir. Mümkünse önce bir sağlık çalışanına bulaşıcı hastalık (özellikle HIV) açısından danışın.",
      "Hazır bebek maması varsa onu kullanın ve paketteki ölçüye tam uyun ('Afette emzirme ve bebek beslenmesi' rehberi).",
      "Son çare, 6 aydan küçük bebek: taze tam yağlı inek sütünü 2 ölçü süte 1 ölçü kaynamış su oranında seyreltip şeker ekleyin. Tek öğün: 0–1 ay 40 ml süt + 20 ml su + 1 silme çay kaşığı şeker (60 ml); 1–2 ay 60 ml + 30 ml + 1 tepeleme çay kaşığı (90 ml); 2–4 ay 80 ml + 40 ml + 2 silme (120 ml); 4–6 ay 100 ml + 50 ml + 2 tepeleme (150 ml). Bu ölçü inek sütü içindir; koyun ve manda sütünü 6 aydan küçüğe vermeyin.",
      "Ölçüyü değiştirmeyin: fazla ya da az su ve şeker bebeğe zarar verir. Bu ölçü için ayrı bir kap ve kaşık işaretleyip yalnız onu kullanın.",
      "Süt, su ve şekeri temiz tencerede kaynatın, hemen ateşten alın, kapağı kapalı ılıyana kadar soğutun. Her öğün yalnız o öğünlük hazırlayın; artanı bebeğe vermeyin, yetişkin yemeğinde kullanın.",
      "Öğün sayısı: 0–1 ay günde 8 öğün; 1–2 ay 7 öğün; 2–4 ay 6 öğün; 4–6 ay 6 öğün. Bebek daha az ya da çok isteyebilir. Bu dönemde karışımdan başka yiyecek ya da su vermeyin. Bebek 6 aylık olunca seyreltmeyi ve şekeri bırakın.",
      "Biberon değil, temiz açık bardak ya da kaşıkla besleyin. Bardağı ve kaşığı her öğünden sonra sabunla yıkayıp kaynatın.",
      "Bu karışımda bebeğin ihtiyacı olan vitamin ve mineraller eksiktir; uzun süre verilirse bebek hastalanır. İlk fırsatta sağlık çalışanından vitamin-mineral desteği isteyin; anne sütüne ya da mamaya dönün. İshal, ateş, nefes darlığı ya da emmeme olursa hemen yardım arayın.",
      "6–12 ay: anne sütü ya da mama yoksa kaynatılmış tam yağlı hayvan sütü (inek, keçi, koyun, manda) seyreltmeden ve şekersiz verilebilir; yanında her gün demirden zengin ek gıda (et, ciğer, yumurta, baklagil) şarttır. Yoğunlaştırılmış şekerli süt, yağsız ya da yarım yağlı süt, kahve kreması ve soya içeceği uygun değildir. 1 yaştan sonra kaynatılmış süt ve aile yemeği."
    ],
    "art": [null, null, null, "sf-mb-sut-olcu", null, "sf-mb-sut-kaynatma", null, "sf-mb-bardakla-besleme", null, null],
    "dont": [
      "Çiğ, kaynatılmamış inek, keçi ya da koyun sütü vermeyin.",
      "6 aydan küçük bebeğe inek sütünü seyreltmeden, ya da gözle karar vererek seyreltip vermeyin.",
      "1 yaşından küçük bebeğe bal, pekmez, çay, şekerli su, pirinç ya da nişasta suyu vermeyin.",
      "Hazırlanıp bekletilmiş ya da bebeğin yarım bıraktığı sütü sonraki öğünde vermeyin.",
      "Biberon ve emzik kullanmayın."
    ],
    "keywords": [
      "mama yoksa bebeğe ne verilir",
      "mama bitti bebek",
      "inek sütü bebeğe nasıl verilir",
      "bebeğe inek sütü seyreltme",
      "sütanne",
      "anne sütü geri gelir mi",
      "bebek maması yok",
      "keçi sütü bebek"
    ],
    "sources": [
      "FHI 360 / WHO-AED — Fresh cow milk: yaşa göre öğün tarifi ve günlük miktarlar (https://www.fhi360.org/wp-content/uploads/drupal/documents/FPHIV_Toolkit/ProviderToolsJobAids/HowCowsMilkBro.pdf)",
      "ENN en-net — WHO 2006 tartışma belgesi alıntısı: ev usulü hayvan sütü uzun süreli güvenli seçenek değil, yalnız mama erişimi geçici kesildiğinde kısa süre (https://en-net.org/forum/question/404)",
      "IFE Core Group / ENN — IFE eğitim modülü 2: yeniden emzirme (24 saatte 8–12 emzirme, bardakla ek, 6+ ıslak bez, haftada 125 g), ev usulü süt yalnız son çare ve en kısa süre, vitamin-mineral eklenmeli, uygun olmayan sütler (https://ennonline.net/sites/default/files/module-2-v1-1-additional-english.pdf)",
      "IFE Core Group — Operational Guidance on IFE v3 (2017), sağlık bölümü: yeniden emzirme, sütanne, mamanın geçici endikasyonları (https://ennonline.net/sites/default/files/2024-02/og-ife_health.pdf)",
      "ENN Field Exchange 72 — WHO 2023: 6–11 ayda mama ya da hayvan sütü uygun (https://ennonline.net/fex/72/who-guideline-for-complementary-feeding-of-infants-and-young-children)",
      "CDC — Botulism prevention ve Cow's milk: bal ve çiğ süt yasağı (https://www.cdc.gov/botulism/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: FHI 360/WHO broşürü yeniden okundu; yaş bantlarındaki 2–3 ay boşluğu öğün hacmine göre giderildi (60/90/120/150 ml). IFE modül 2 ile yeniden emzirme sıklığı, yeterlilik ölçütleri, son çare ve vitamin-mineral şartı, uygun olmayan sütler teyit edildi. WHO 2023 (6–11 ay hayvan sütü) özetten teyitli. IFE OG v3 tam metni açılamadı." }
  },
  {
    "id": "sf-mb-zayiflik-olcme",
    "category": "sf-mb-kitlik",
    "title": "Çocukta ağır zayıflığı tanıma: kol çevresi ve ödem",
    "tag": "ZAYIFLIK",
    "summary": "6 ay–5 yaş çocuğun sol kol çevresini ölçün: 11,5 cm altı ağır, 11,5 cm ile 12,5 cm'nin altı orta zayıflıktır; iki ayakta parmak izi kalan şişlik de ağır yetersiz beslenmedir.",
    "note": "Ağır yetersiz beslenmiş çocuk uzman tedavisi olmadan ölebilir. Bu rehber yalnız tanımayı anlatır; sağlık personeline ulaşılana kadar çocuğu evde doyurmaya zorlamayın.",
    "steps": [
      "6 ay ile 5 yaş arasındaki çocukları ayda bir ölçün; kıtlıkta ilk zarar görenler onlardır. 6 aydan küçük bebekte kol ölçüsü kullanılmaz: gözle görülür zayıf, kilo almayan ya da iyi emmeyen bebeği doğrudan sağlık ekibine götürün.",
      "Çocuğun sol kolunu gevşekçe yanına sarkıtın. Omuz ucuyla dirsek ucu arasını iple ölçün, ipi ikiye katlayıp orta noktayı kalemle işaretleyin.",
      "Orta noktadan kolu mezura, işaretli kâğıt şerit ya da iple sarın; deriyi sıkmadan ama boşluk da bırakmadan. Çevreyi milimetreye kadar okuyun.",
      "Okuma: 12,5 cm (125 mm) ve üstü normal; 11,5 cm (dahil) ile 12,5 cm'nin altı orta zayıflık; 11,5 cm'nin (115 mm) altı ağır zayıflık.",
      "Ölçü şeridi yapın: bir cetvelle kâğıt ya da esnemeyen kumaş şeridin ilk 11,5 cm'sini kırmızı, 11,5–12,5 cm arasını sarı, üstünü yeşil boyayın. Şeridi bir cetvelle yeniden kontrol edin; esneyen ip ve lastik kullanmayın.",
      "Ödem kontrolü: iki ayağın üstüne başparmakla 3 saniye bastırın. Parmağı kaldırınca iki ayakta da çukur kalıyorsa beslenme ödemidir; çocuk tombul görünse de ağır yetersiz beslenmiştir. Başka biri de kontrol etsin. Tek ayaktaki şişlik başka nedenlidir.",
      "Ağır zayıflık ya da iki ayakta ödem varsa çocuğu en kısa sürede sağlık ekibine götürün. Birden bol yemekle doyurmaya çalışmayın ('Uzun açlıktan sonra yemeye başlama' rehberi).",
      "Orta zayıflıkta emzirmeyi sürdürün, öğün sayısını artırın, her öğüne yağ ve protein ekleyin; 2 haftada bir yeniden ölçün.",
      "Tehlike belirtileri: uyuşukluk ya da uyandırılamama, emmeme ya da hiç içememe, her şeyi kusma, havale, hızlı ya da zor nefes, yüksek ateş, ishal, çok soğuk el ve ayak. Ağır zayıf çocukta bunlardan biri varsa beklemeden yardım arayın; çocuğu sıcak tutun, emzirmeyi sürdürün."
    ],
    "art": [null, "sf-mb-muac-orta-nokta", "sf-mb-muac-olcum", null, null, "sf-mb-odem-test", null, null, null],
    "dont": [
      "İki ayağında ödem olan çocuğu 'tombul, iyi besleniyor' sanmayın.",
      "Ölçerken kolu sıkıca sıkmayın; çevre küçük çıkar.",
      "Ağır zayıf çocuğu birden bol yemekle doyurmaya çalışmayın.",
      "Ölçümü bir kez yapıp bırakmayın; düzenli tekrarlayın."
    ],
    "keywords": [
      "çocukta yetersiz beslenme belirtileri",
      "kol çevresi ölçümü",
      "muac",
      "çocuk çok zayıf",
      "ayakta ödem çocuk açlık",
      "cocuk zayifladi ne yapmali",
      "kwashiorkor",
      "beslenme bozukluğu tanıma"
    ],
    "sources": [
      "CMAM Eğitim Modülü 2 (FANTA/WHO) — MUAC sınırları, ölçüm ve ödem testi (https://sites.pitt.edu/~super1/Pirzado/CMAM%20Training%20Module%202-handouts%20.pdf)",
      "WHO/UNICEF 2009 — WHO child growth standards and the identification of SAM: MUAC eşiği 115 mm (https://www.who.int/publications/i/item/9789241598163)",
      "WHO — Infant and young child feeding fact sheet: zayıflık (wasting) (https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: CMAM modül 2 yeniden okundu (MUAC < 115 mm ağır, ≥ 115 ve < 125 mm orta; sol kol, iple orta nokta, 1 mm hassasiyet; iki ayakta 3 saniye basınç, ikinci kişi kontrolü; 6 ay altı bebek yatarak tedaviye). WHO 2009 ortak bildirisi sayfası 115 mm eşiğini teyit ediyor. Sınır ifadesi ve 6 ay altı uyarısı düzeltildi. Tehlike belirtileri IMCI genel tehlike belirtilerinden; bu turda tam metinle teyit edilmedi." }
  },

  // ───────────────────────── İlaçsız sağlık ─────────────────────────
  {
    "id": "sf-mb-diyabet",
    "category": "sf-mb-saglik",
    "title": "İlaç azalınca diyabet: beslenme ve korunma",
    "tag": "DİYABET",
    "summary": "Doktorun önerdiği ilacı ya da insülini bulabildiğiniz sürece kullanın; şekeri ve beyaz unu kesin, öğün atlamayın, her gün yürüyün ve ayaklarınıza bakın.",
    "note": "Bu rehber ilacın yerini tutmaz. Doktorun önerdiği ilacı ya da insülini bulabildiğiniz sürece kullanın; dozu kendiniz değiştirmeyin, ilacı kendiniz bırakmayın.",
    "steps": [
      "Doktorun önerdiği ilacı ya da insülini bulabildiğiniz sürece kullanın. Biteceğini görüyorsanız sağlık çalışanına ya da eczacıya ulaşmayı her işin önüne koyun.",
      "Tip 1 diyabet (çoğunlukla gençlikte başlayan, insülinle yaşanan) insülinsiz beslenmeyle idare edilemez. İnsülin bulmak hayati önceliktir.",
      "Tip 2 diyabette beslenme şekeri belirgin düşürür: şeker, bal, pekmez, reçel, tatlı, şekerli içecek ve beyaz unu en aza indirin.",
      "Tabağın yarısı sebze ve yeşil ot, dörtte biri baklagil, yumurta, et ya da balık, dörtte biri kepekli tahıl (bulgur, arpa, tam buğday) olsun.",
      "Öğün atlamayın; her gün benzer saatte ve benzer miktarda yiyin. Şeker ilacı ya da insülin kullanırken az yemek şekeri tehlikeli düşürebilir.",
      "Şeker düşmesi belirtilerini aile de bilsin: titreme, terleme, açlık, baş dönmesi, huzursuzluk. Bilinci yerindeyse ve yutabiliyorsa hemen şeker, pekmez ya da meyve suyu verin ('Şeker hastasında şeker düşmesi' rehberi).",
      "Her gün yürüyün ya da bedensel iş yapın; haftada toplam en az 2,5 saat nefes hızlandıracak kadar.",
      "Kilo fazlanız varsa yavaşça verin. İlaç kullanırken kendi başınıza çok sıkı aç kalma diyetine girmeyin.",
      "Ayaklarınıza her gün bakın: kesik, kabarcık, kızarıklık, yara. Ilık suyla yıkayıp parmak aralarını iyice kurulayın, evde de çorap ve ayakkabı giyin, tırnağı düz kesin. İyileşmeyen yarayı ihmal etmeyin.",
      "Tehlike: çok susama ve çok idrarla birlikte kusma, karın ağrısı, hızlı nefes, meyvemsi ağız kokusu, uyuklama ya da kafa karışıklığı. Bu hayati tehlikedir; 112'yi arayın ya da hemen sağlık ekibine ulaştırın."
    ],
    "art": [null, null, null, "sf-mb-diyabet-tabak", null, null, "sf-mb-yuruyus", null, "sf-mb-ayak-kontrol", null],
    "dont": [
      "İlacı ya da insülini kendi kendinize bırakmayın, dozunu değiştirmeyin, başkasının ilacını kullanmayın.",
      "'Şekerim yüksek' diye aç kalıp öğün atlamayın; ilaçla birlikte şeker tehlikeli düşebilir.",
      "Ayağınızdaki küçük yarayı ve nasırı kendiniz kesmeyin, ihmal etmeyin.",
      "Bilinci bulanık hastanın ağzına yiyecek ya da içecek vermeyin; 112'yi arayın."
    ],
    "keywords": [
      "şeker hastası ilaç bitti",
      "diyabet beslenme",
      "seker hastasi ne yemeli",
      "insülin bulamıyorum",
      "şeker hastası ayak bakımı",
      "kan şekeri düşürmek ilaçsız",
      "tip 2 diyabet diyet",
      "şeker yüksekliği belirtileri"
    ],
    "sources": [
      "NHS — Type 2 diabetes: food and keeping active (https://www.nhs.uk/conditions/type-2-diabetes/food-and-keeping-active/)",
      "NHS — High blood sugar (hyperglycaemia): belirtiler ve acil durum (https://www.nhs.uk/conditions/high-blood-sugar-hyperglycaemia/)",
      "CDC — Your feet and diabetes (https://www.cdc.gov/diabetes/diabetes-complications/diabetes-and-your-feet.html)",
      "Akıl Çantası — 'Kronik hastalık ve ilaçlar' ve 'Şeker hastasında şeker düşmesi' rehberleri"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NHS hiperglisemi sayfası yeniden okundu (kusma, karın ağrısı, hızlı nefes, uyuklama, meyvemsi koku, kafa karışıklığında acil). Şeker düşmesinde yalnız bilinci yerindeyse ağızdan şeker verilmesi eklendi. İlaç dozu ya da ilaç bırakma önerisi yok. Önceki tur: beslenme önerileri, haftalık hareket süresi, ilaç kullanırken sıkı diyet uyarısı (NHS); ketoasidoz belirtileri (NHS); ayak bakımı (CDC). İlaç dozu yok." }
  },
  {
    "id": "sf-mb-tansiyon",
    "category": "sf-mb-saglik",
    "title": "İlaç azalınca yüksek tansiyon: tuz ve yaşam düzeni",
    "tag": "TANSİYON",
    "summary": "Doktorun önerdiği tansiyon ilacını bulabildiğiniz sürece kullanın; tuzu günde 5 g'ın altına indirin, tuzlu saklanan yiyeceğin tuzunu alın, sebze ve hareketi artırın.",
    "note": "Bu rehber ilacın yerini tutmaz. Doktorun önerdiği ilacı bulabildiğiniz sürece kullanın; dozu kendiniz değiştirmeyin, ilacı kendiniz bırakmayın.",
    "steps": [
      "Doktorun önerdiği tansiyon ilacını bulabildiğiniz sürece kullanın. Biteceğini görüyorsanız sağlık çalışanına ulaşmayı öne alın.",
      "Tuzu azaltın: günde toplam 5 g'ın, yani silme bir çay kaşığının altında kalın; ekmeğe ve yemeğe giren tuz da buna dahil.",
      "Tuzlu saklanan yiyecekleri azaltın ya da tuzunu alın: salamura peynir, turşu, salamura yaprak, tuzlu balık, pastırma. Pişirmeden önce birkaç saat suda bekletip suyunu birkaç kez değiştirin.",
      "Ekmeğe ve hamura daha az tuz koyun; yemeği sarımsak, soğan, nane, kekik, sumak, limon ya da sirkeyle tatlandırın.",
      "Sebze, meyve, baklagil ve kepekli tahılı artırın; hayvansal katı yağı azaltın. Böbrek hastasıysanız potasyumlu besinleri sınırlayın.",
      "Haftada en az 150 dakika (günde yaklaşık 30 dakika) tempolu yürüyün ya da bedensel iş yapın. Fazla kilonuz varsa yavaşça verin.",
      "Sigara içmeyin; alkolden uzak durun.",
      "Tansiyon aleti varsa her gün aynı saatte, 5 dakika oturup dinlendikten sonra ölçün ve deftere yazın.",
      "Tehlike belirtileri: şiddetli baş ağrısı, göğüs ağrısı, nefes darlığı, bulanık görme, burun kanaması, kafa karışıklığı; yüzde kayma, kolda güçsüzlük, konuşma bozukluğu. Hemen 112'yi arayın ya da sağlık ekibine ulaştırın."
    ],
    "art": [null, "sf-mb-tuz-olcu", "sf-mb-tuz-alma", null, null, null, null, "sf-mb-tansiyon-olcum", null],
    "dont": [
      "Tansiyon ilacını 'iyi hissediyorum' diye kendi kendinize bırakmayın, başkasınınkini kullanmayın.",
      "Salamura ve turşuyu tuzunu almadan her öğünde yemeyin.",
      "Tuzun yerine bilmediğiniz 'tuz yerine geçen' tozları kullanmayın; böbrek hastasına zararlı olabilir.",
      "Ani baş ağrısı, göğüs ağrısı ve felç belirtilerini beklemeye almayın."
    ],
    "keywords": [
      "tansiyon ilacı bitti",
      "tansiyon nasıl düşer ilaçsız",
      "tansiyon hastası tuz",
      "günde kaç gram tuz",
      "turşunun tuzunu almak",
      "yüksek tansiyon beslenme",
      "tansiyon belirtileri tehlike",
      "hipertansiyon diyet"
    ],
    "sources": [
      "WHO — Salt reduction: günde 5 g'dan az tuz, yaklaşık bir çay kaşığı (https://www.who.int/news-room/fact-sheets/detail/salt-reduction)",
      "WHO — Hypertension fact sheet: yaşam düzeni, 150 dk hareket, tehlike belirtileri, ilacı atlamama (https://www.who.int/news-room/fact-sheets/detail/hypertension)",
      "Akıl Çantası — 'Kronik hastalık ve ilaçlar' ve 'İnme belirtileri' rehberleri"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin gözden geçirildi; ilaç dozu ya da ilaç bırakma önerisi yok. Kaynaklar bu turda yeniden açılmadı. Önceki tur: tuz sınırı (WHO), yaşam düzeni önerileri ve çok yüksek tansiyon belirtileri (WHO). Tuz alma yöntemi geleneksel uygulamadır; sayısız yazıldı." }
  },
  {
    "id": "sf-mb-astim",
    "category": "sf-mb-saglik",
    "title": "İlaç azalınca astım: tetikleyicilerden korunma",
    "tag": "ASTIM",
    "summary": "Doktorun önerdiği astım ilacını bulabildiğiniz sürece kullanın; dumanı, küfü, tozu ve kendi tetikleyicilerinizi yaşam alanından uzaklaştırın.",
    "note": "Bu rehber ilacın yerini tutmaz. Doktorun önerdiği ilacı bulabildiğiniz sürece kullanın; dozu kendiniz değiştirmeyin, ilacı kendiniz bırakmayın. Krizde 'Ağır astım krizi' rehberini uygulayın.",
    "steps": [
      "Doktorun önerdiği inhaler ve ilaçları bulabildiğiniz sürece kullanın. Azaldığını görüyorsanız ilk fırsatta sağlık çalışanına ya da eczacıya ulaşın.",
      "Kendi tetikleyicilerinizi yazın: duman, toz, küf, soğuk hava, polen, hayvan, sert koku, soğuk algınlığı, ağır efor. Nefesiniz her daraldığında ne olduğunu not edin.",
      "Duman en büyük düşmandır: astımlının yanında sigara içilmesin. Ocak ve sobayı bacalı kurun, yaşanılan odada açık ateş yakmayın, astımlıyı ocaktan uzak oturtun.",
      "Islanan eşyayı ve duvarı 24–48 saat içinde kurutun, sızıntıyı onarın. Küflü hasır, yatak ve yastığı atın; sert yüzeydeki küfü sabunlu suyla ovup kurulayın.",
      "Yatak takımını haftada bir yıkayıp güneşte tam kurutun. Kuş tüyü yastık ve yorganı astımlının yatağından kaldırın.",
      "Toz kaldıran işleri (süpürme, un eleme, saman, kül boşaltma) astımlıya yaptırmayın; süpürmeden önce yeri hafifçe nemlendirin.",
      "Soğuk ve kuru havada ağzı ve burnu atkıyla örtün, burundan nefes alın.",
      "Fare ve hamamböceği dışkısı da tetikler: yiyeceği kapalı kapta saklayın, kırıntıyı hemen temizleyin, böcek spreyi sıkmayın.",
      "Orman yangını dumanı ya da toz fırtınası varken içeride kalın, pencereleri kapatın, ağır iş yapmayın.",
      "Kriz belirtisi: cümle kuramayacak kadar nefes darlığı, dudakta morarma, göğüste içe çekilme. Hemen 'Ağır astım krizi' rehberini uygulayın ve 112'yi arayın."
    ],
    "art": [null, null, "sf-mb-astim-duman", "sf-mb-astim-kuf", "sf-mb-astim-yatak", null, null, null, null, null],
    "dont": [
      "İnhaleri 'iyiyim' diye kendi kendinize bırakmayın, dozunu değiştirmeyin.",
      "Astımlının yattığı odada açık ateş yakmayın, sigara içmeyin.",
      "Küflü yatak ve hasırı kurutup yeniden kullanmayın.",
      "Böcek ve fare için sprey ya da duman bombası kullanmayın."
    ],
    "keywords": [
      "astım ilacı bitti",
      "astım tetikleyicileri",
      "astim krizini onleme",
      "nefes darlığı duman küf",
      "astımlı çocuk soba dumanı",
      "inhaler bitti ne yapmalı",
      "astım küf",
      "astım toz akarı"
    ],
    "sources": [
      "CDC — Asthma triggers: duman, toz akarı, küf (24–48 saat), haşere, soğuk hava (https://www.cdc.gov/asthma/triggers.html)",
      "WHO — Household air pollution and health: katı yakıtlı ocak dumanı ve solunum hastalıkları (https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health)",
      "Akıl Çantası — 'Ağır astım krizi' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin gözden geçirildi; ilaç dozu ya da ilaç bırakma önerisi yok. Kaynaklar bu turda yeniden açılmadı. Önceki tur: tetikleyiciler ve azaltma yolları (CDC), ev içi ocak dumanının solunum yoluna etkisi ve havalandırma (WHO). İlaç dozu yok." }
  },
  {
    "id": "sf-mb-sitma",
    "category": "sf-mb-saglik",
    "title": "Sivrisinek ve sıtma: durgun su, sineklik, cibinlik",
    "tag": "SITMA",
    "summary": "Türkiye'de bugün yerli sıtma görülmüyor ama taşıyıcı sivrisinek yaşıyor ve hastalık geri dönebilir; durgun suyu haftada bir boşaltın, sineklik ve cibinlik kullanın, ısırıktan 10–15 gün sonra gelen ateşte hemen test ve tedavi arayın.",
    "note": "Sıtma kan testi ve ilaçla tedavi edilir; bu rehber yalnız korunmayı ve belirtiyi tanımayı anlatır. Kimin olduğu belirsiz ilaçla kendi kendinize tedavi denemeyin.",
    "callEmergency": true,
    "steps": [
      "Türkiye'de durum: 2002'de 10.000'i aşan yerli vaka 2010'a kadar birkaç vakaya indi; Sağlık Bakanlığı bugün yerli vaka görülmediğini, vakaların sıtmalı ülkelerden gelenlerde olduğunu bildiriyor. Ama Türkiye DSÖ'nün sıtmadan arındırılmış ülkeler listesinde değil, sıtmayı taşıyan Anopheles sivrisinekleri (en önemlisi Anopheles sacharovi) hâlâ yaşıyor. 2012'de Mardin'de 219, 2014'te Edirne'de 5 yerli vaka görüldü: dışarıdan gelen tek bir hasta yerel salgın başlatabilir.",
      "Durgun suyu azaltın: haftada bir kova, varil, lastik, saksı altı ve tenekedeki suyu boşaltın, kabı ovun, ters çevirin ya da kapatın.",
      "Sarnıç, varil ve su depolarının ağzını sık tülle ya da kapakla kapatın. Ev çevresindeki su birikintilerini toprakla doldurun ya da arkla akıtın.",
      "Pencere ve kapılara sineklik gerin, delikleri dikin ya da yamayın.",
      "Cibinlikte uyuyun: yatağın üstüne asın, kenarlarını yatağın altına sıkıştırın, delikleri dikin. İlaçlı cibinlik en iyisidir; DSÖ'nün sıtmaya karşı iki temel önleminden biridir. Önce bebekleri, çocukları ve gebeleri koruyun.",
      "Akşamdan sabaha dışarıdayken uzun kollu giysi ve uzun pantolon giyin.",
      "Belirtiyi tanıyın: ısırıktan genellikle 10–15 gün sonra ateş, titreme ve baş ağrısı. Grip sanılabilir; nöbet nöbet gelen ateş tipiktir. Türkiye'de görülen tür (P. vivax) aylar sonra yeniden nöbet yapabilir; sıtmalı bölgede bulunmuş birinde aylar sonra gelen ateşi de ciddiye alın.",
      "Ateşli hastayı cibinlik altında tutun; sivrisinek ondan başkasına taşımasın.",
      "Sıtma kuşkusunda hastayı en kısa sürede sağlık çalışanına götürün: kan testi ve tedavi gerekir. Ağır sıtma 24 saatte ölüme gidebilir.",
      "Tehlike belirtileri: aşırı halsizlik, bilinç bulanması, art arda havale, nefes darlığı, koyu ya da kanlı idrar, sarılık, olağan dışı kanama. Hemen 112'yi arayın."
    ],
    "art": [null, "sf-mb-durgun-su", null, "sf-mb-sineklik", "sf-mb-cibinlik", null, null, null, null, null],
    "dont": [
      "Varil ve kovalarda haftalarca açık su bekletmeyin.",
      "Delik cibinliği 'idare eder' diye kullanmayın; dikin.",
      "Elde kalan, kimin olduğu belirsiz sıtma ilacıyla kendi kendinize tedaviye girişmeyin.",
      "Yurt dışından gelmiş birindeki ateşi grip sanıp beklemeyin.",
      "Tarım ilacını ya da gaz yağını içme suyu depolarına dökmeyin."
    ],
    "keywords": [
      "sıtma belirtileri",
      "sitma turkiye",
      "sivrisinekten korunma",
      "cibinlik nasıl kurulur",
      "durgun su sivrisinek",
      "sıtma var mı türkiyede",
      "anofel sivrisinek",
      "sivrisinek larvası"
    ],
    "sources": [
      "WHO — Malaria fact sheet: belirti 10–15 gün, tehlike belirtileri, ilaçlı cibinlik ve iç mekân ilaçlaması, 24 saatte ağırlaşma (https://www.who.int/news-room/fact-sheets/detail/malaria)",
      "WHO — Countries and territories certified malaria-free by WHO: Türkiye listede yok (https://www.who.int/teams/global-malaria-programme/elimination/countries-and-territories-certified-malaria-free-by-who)",
      "NTV / T.C. Sağlık Bakanlığı açıklaması, 25.04.2025 — Türkiye'de yerli sıtma vakası yok (https://www.ntv.com.tr/turkiye/saglik-bakanligi-turkiyede-yerli-sitma-vakasiyok,NMYDuGHAk0uzJV_obXWqGw)",
      "Özbilgin — Dünyada ve Türkiye'de sıtmanın durumu (KLİMİK): An. sacharovi ana vektör, yerli vakaların düşüşü (https://klimik.org.tr/wp-content/uploads/2015/10/Dünyada-ve-Türkiyede-Sıtmanın-Durumu-Ahmet-ÖZBİLGİN.pdf)",
      "Türkiye Parazitoloji Dergisi 2019 — Hatay'da ithal sıtma; 2010'dan beri yerli vaka bildirilmedi (https://www.turkiyeparazitolderg.org/pdf/c1dc3a38-51db-436b-af33-1bc7522029b3/articles/tpd.galenos.2019.6123/TPD-43-60.pdf)",
      "CDC — Mosquito bite prevention: haftada bir durgun su, sineklik, giysi (https://www.cdc.gov/mosquitoes/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WHO sertifikalı sıtmasız ülkeler listesi (Kasım 2026 erişimi) açıldı, Türkiye listede yok. Sağlık Bakanlığı 2025 açıklaması (yerli vaka yok, ithal vaka var) ve Özbilgin/KLİMİK yıl yıl tablo (2002: 10.184 → 2010: 9; 2012 Mardin 219, 2014 Edirne 5 yerli P. vivax) yeniden okundu. 'Bitti' ifadesi tutucu biçimde düzeltildi." }
  },
  {
    "id": "sf-mb-gozluk",
    "category": "sf-mb-saglik",
    "title": "Gözlük kırılınca ya da kaybolunca idare",
    "tag": "GÖZLÜK",
    "summary": "Kırık gözlüğü tel ve iple onarın, yedek okuma gözlüğü arayın; iğne deliği kartonu yalnız kısa okuma için geçici çözümdür, yürürken ve iş yaparken kullanılmaz.",
    "steps": [
      "Kırık gözlüğü atmayın. Kopan sapı ince tel, sağlam iplik ya da bantla çerçeveye bağlayın; menteşe vidası kaybolduysa deliğe ince tel geçirip ucunu kıvırın.",
      "Ortadan kırılan çerçevenin iki parçasını hizalayıp ince tel ya da iple sıkıca sarın; üstüne reçine ya da tutkal sürün.",
      "Yuvasından çıkan camı yerine oturtun; çerçeveyi camın çevresinden misina ya da iplikle sarıp sabitleyin.",
      "Camları temiz su ve sabunla yıkayın, yumuşak pamuklu bezle kurulayın. Kuru ya da kumlu bezle silmeyin; cam çizilir.",
      "Yedek arayın: terk edilmiş evlerde, eczanelerde, çekmecelerde hazır okuma gözlüğü bulunur. 40 yaşından sonra yakını göremeyenler birkaç gözlük deneyip yazıyı 30–40 cm'de en net ve gözü yormadan gösterenini seçsin.",
      "Başkasının uzak gözlüğü baş ağrısı, göz yorgunluğu ya da baş dönmesi yaparsa takmayı bırakın.",
      "Geçici iğne deliği: koyu bir kartona ya da ince saca birkaç küçük delik açın, gözünüze yakın tutup kısa süre okuyun. Görüntü netleşir ama kararır ve görüş alanı daralır; gözü düzeltmez.",
      "Yakın iş için ışığı artırın: pencere önünde, gün ışığında çalışın; yazıyı büyük ve kalın yazın. Büyüteç ya da su dolu şeffaf yuvarlak şişe de yazıyı büyütür; bunları güneşte açıkta bırakmayın, ışığı odaklayıp yangın çıkarabilir.",
      "Gözlüğünüz yoksa kesici, kıvılcımlı işte ve yolda daha dikkatli olun; koruyucu gözlük takın. Ani görme kaybı, ağrılı kızarık göz ya da gözde ışık çakmaları acildir; sağlık çalışanına ulaşın."
    ],
    "art": ["sf-mb-gozluk-tel", null, null, null, null, null, "sf-mb-igne-deligi", "sf-mb-isik-yakin", null],
    "dont": [
      "İğne deliği kartonuyla yürümeyin, alet kullanmayın, araç sürmeyin; yan görüş kaybolur.",
      "İğne deliği kartonunu güneş gözlüğü yerine kullanmayın; zararlı ışık deliklerden geçer.",
      "Camları kumlu bezle ya da kuru silmeyin.",
      "Gözde ani görme kaybını ve ağrılı kızarıklığı beklemeye almayın."
    ],
    "keywords": [
      "gözlük kırıldı ne yapmalı",
      "gozluk tamiri",
      "gözlük sapı kırıldı",
      "okuma gözlüğü bulamıyorum",
      "iğne deliği gözlük",
      "gözlüksüz okumak",
      "yakını göremiyorum gözlük yok",
      "gözlük kayboldu"
    ],
    "sources": [
      "College of Optometrists — Can £5 pinhole glasses really improve your vision? (https://www.college-optometrists.org/news/2019/january/2019-01-can_5_pinhole_glassesreallyimproveyourvisi)",
      "WebMD — What are pinhole glasses? (https://www.webmd.com/eye-health/what-are-pinhole-glasses)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin gözden geçirildi; su dolu şişenin güneşte yangın çıkarabileceği uyarısı eklendi. Kaynaklar bu turda yeniden açılmadı; onarım adımları kaynaksız pratik bilgidir. Önceki tur: iğne deliğinin çalışma ilkesi, kararma, görüş alanı daralması, sürüşte ve güneş gözlüğü olarak kullanılmama, gözü düzeltmemesi. Onarım adımları pratik bilgidir, kaynakla doğrulanamadı; raporda belirtildi." }
  },
  {
    "id": "sf-mb-dis-agrisi",
    "category": "sf-mb-saglik",
    "title": "Diş ağrısı ve diş kaybıyla yaşamak: tehlike belirtileri",
    "tag": "DİŞ AĞRISI",
    "summary": "Yüzde ya da boyunda yayılan şişlik, ağız açamama, yutma ve nefes güçlüğü diş apsesinin yayıldığını gösterir, hemen yardım arayın; beklerken yumuşak yiyin ve tuzlu suyla çalkalayın.",
    "steps": [
      "Tehlike belirtileri: yüz, çene ya da boyunda büyüyen şişlik; gözde şişlik ya da görme değişikliği; ağız açamama; yutma, konuşma ya da nefes almada güçlük; yüksek ateş. Hemen 112'yi arayın ya da en yakın sağlık ekibine gidin.",
      "Diş apsesi kendi kendine geçmez; tehlike belirtisi olmasa da ilk fırsatta diş hekimine ya da sağlık çalışanına gidin.",
      "Beklerken yumuşak yiyin: çorba, lapa, haşlanmış yumurta, yoğurt, patates ezmesi. Çok sıcak ve çok soğuktan kaçının, ağrımayan taraftan çiğneyin.",
      "Ağzı ılık tuzlu suyla çalkalayın: 1 su bardağı ılık kaynamış suya yarım çay kaşığı tuz. Günde birkaç kez, özellikle yemekten sonra.",
      "Dişleri yumuşak fırçayla ya da misvakla nazikçe temizleyin; ağrıyor diye temizliği bırakmayın.",
      "Elinizde ağrı kesici varsa yalnız kutudaki talimata göre kullanın; ilacı dişin ya da diş etinin üstüne koymayın, yakar.",
      "Kırık dişin keskin kenarı dili ya da yanağı kesiyorsa üstünü balmumu ya da temiz sakızla örtün.",
      "Diş kaybıyla yaşamak: yiyeceği küçük doğrayın, ezin, uzun pişirin; sert kabuklu yemişi dövüp un yapın. Dişi az kalan yaşlının ne kadar yiyebildiğini izleyin.",
      "Kalan dişleri koruyun: şekerli yiyeceği öğün aralarında yemeyin, dişleri her gün temizleyin ('Diş temizliği' rehberi)."
    ],
    "art": ["sf-mb-dis-tehlike", null, null, "sf-mb-tuzlu-su-calkalama", null, null, null, "sf-mb-yumusak-yemek", null],
    "dont": [
      "Apseyi iğne ya da bıçakla kendiniz delmeyin.",
      "Dişi kendiniz ya da usta olmayan birine çektirmeye kalkışmayın.",
      "Ağrı kesiciyi dişin ya da diş etinin üstüne koymayın; dokuyu yakar.",
      "Yüzdeki ve boyundaki büyüyen şişliği beklemeye almayın; yayılan enfeksiyon nefesi kapatabilir."
    ],
    "keywords": [
      "diş ağrısı ne yapmalı",
      "dis agrisi dokturu yok",
      "diş apsesi belirtileri",
      "yüzüm şişti diş",
      "dişsiz nasıl yemek yenir",
      "diş ağrısı tuzlu su",
      "diş iltihabı tehlikeli mi",
      "diş kaybı beslenme"
    ],
    "sources": [
      "NHS — Dental abscess: belirtiler, acil durumlar, evde yapılacaklar (https://www.nhs.uk/conditions/dental-abscess/)",
      "Sıfırdan: Hijyen ve sağlık — 'Diş temizliği: misvak, bez ve tuzlu su' rehberi",
      "Akıl Çantası — 'Diş çıkması, diş kırılması ve ağız yaralanması' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: NHS diş apsesi sayfası yeniden okundu (acil belirtiler, yumuşak yiyecek, yumuşak fırça, sıcak-soğuktan kaçınma, önerilen dozu aşmama). Tuzlu su çalkalama NHS sayfasında yok; Hijyen paketine dayanıyor. İlaç dozu yok. Önceki tur: apse belirtileri, acil belirtiler, yumuşak yiyecek, sıcak-soğuktan kaçınma, yumuşak fırça, apsenin kendiliğinden geçmemesi (NHS). Tuzlu su oranı Hijyen paketindeki rehberle uyumlu." }
  },
  {
    "id": "sf-mb-uyku-isik",
    "category": "sf-mb-saglik",
    "title": "Uyku düzeni ve mevsimsel ışık",
    "tag": "UYKU",
    "summary": "Her gün aynı saatte yatıp kalkın, sabah gün ışığına çıkın, akşam ışığı loşlaştırın; kışın gelen isteksizlik ve çok uyuma mevsimsel olabilir, dışarı çıkıp insanlarla görüşün.",
    "steps": [
      "Her gün aynı saatte yatıp kalkın. Yetişkin günde en az 7 saat, okul çocuğu 9–12 saat, ergen 8–10 saat uyusun.",
      "Sabah kalktıktan sonra ilk saat içinde dışarı çıkın ya da pencere önünde gün ışığı alın. Kışın gün ışığından olabildiğince yararlanın; günlük işleri gündüze toplayın.",
      "Akşam ışığı azaltın: yatmadan en az 30 dakika önce ekranları ve parlak lambaları kapatın; loş, sarı ışık kullanın.",
      "Uyku yeri serin, karanlık ve sessiz olsun. Gündüz uyuyacak nöbetçiye karanlık ve gürültüden uzak bir köşe ayırın.",
      "Öğleden sonra çay ve kahveyi kesin; yatmadan önce ağır yemek yemeyin, alkol almayın.",
      "Gündüz bedensel iş yapın, açık havada yürüyün; yatmadan hemen önce ağır işten kaçının.",
      "Gece nöbetinde aynı kişiyi her gece aynı saate koyun; nöbet sonrası uykusunu her gün aynı saatte, karanlık yerde uyusun.",
      "Kış hüznü: kışın başlayıp baharda geçen mutsuzluk, isteksizlik, çok uyuma ve iştah artışı mevsimsel olabilir. Her gün gün ışığına çıkın, hareket edin, insanlarla görüşün, gündelik işleri sürdürün.",
      "Umutsuzluk ya da kendine zarar verme düşüncesi varsa yalnız kalmayın; birine söyleyin ve yardım isteyin ('Uyku sorunu ve stres' rehberi)."
    ],
    "art": [null, "sf-mb-sabah-isik", "sf-mb-aksam-los", null, null, null, null, null, null],
    "dont": [
      "Uyku düzenini her gün değiştirmeyin; nöbetleri karışık dağıtmayın.",
      "Uyumak için alkole başvurmayın.",
      "Kışı karanlık odada, dışarı çıkmadan geçirmeyin.",
      "Kendine zarar verme düşüncesini önemsiz saymayın, gizlemeyin."
    ],
    "keywords": [
      "uyku düzeni nasıl kurulur",
      "uyku düzeni bozuldu",
      "kış depresyonu",
      "mevsimsel depresyon",
      "kac saat uyumali",
      "nöbetçi uyku düzeni",
      "sabah güneş ışığı uyku",
      "kışın çok uyumak"
    ],
    "sources": [
      "CDC — About sleep: yaşa göre uyku süreleri, uyku alışkanlıkları (https://www.cdc.gov/sleep/about/index.html)",
      "NHS — Seasonal affective disorder (SAD): belirtiler, gün ışığı, düzenli yatıp kalkma (https://www.nhs.uk/conditions/seasonal-affective-disorder-sad/)",
      "Akıl Çantası — 'Uyku sorunu ve stres' rehberi"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Metin ve sayılar gözden geçirildi, tehlikeli hata bulunmadı; kaynaklar bu turda yeniden açılmadı. Önceki tur: uyku süreleri ve alışkanlıklar (CDC), mevsimsel depresyon belirtileri ve kendi kendine yardım (NHS). Nöbet düzeni önerisi genel bilgidir." }
  }
];
