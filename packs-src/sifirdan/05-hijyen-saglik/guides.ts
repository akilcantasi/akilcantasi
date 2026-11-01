// Sıfırdan paketi: Hijyen ve sağlık (uzun dönem)
// Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-hijyen-saglik',
  name: 'Sıfırdan: Hijyen ve sağlık',
  desc: 'Uzun süre doktor, hastane ve market yokken tuvalet, atık, temizlik, sabun, kişisel bakım ve evde hasta bakımı. İlk yardımın yerine geçmez; onu tamamlar.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'sf-hs-tuvalet',
    title: 'Tuvalet ve atık',
    hint: 'Çukur ve kompost tuvalet, kireç, çöp, sinek ve fare',
    art: 'sf-hs-tuvalet-kapak',
    color: '#a3a380',
    order: 135,
  },
  {
    id: 'sf-hs-temizlik',
    title: 'Temizlik ve kişisel bakım',
    hint: 'El yıkama, kül suyu, sabun, çamaşır, bit, diş, ped ve bez',
    art: 'sf-hs-temizlik-kapak',
    color: '#7dd3c0',
    order: 136,
  },
  {
    id: 'sf-hs-bakim',
    title: 'Uzun dönem hasta bakımı',
    hint: 'Yara, ateş, sıvı kaybı, atel, yatalak hasta, doğum, salgın, defin',
    art: 'sf-hs-bakim-kapak',
    color: '#f0a5a5',
    order: 137,
  },
];

const CHECKED = '2026-11-02';

export const GUIDES: PackGuide[] = [
  // ───────────────────────── Tuvalet ve atık ─────────────────────────
  {
    "id": "sf-hs-cukur-tuvalet",
    "category": "sf-hs-tuvalet",
    "title": "Çukur tuvalet: yer seçimi ve kazma",
    "tag": "TUVALET",
    "summary": "Çukur tuvaleti kuyu, pınar ve dereden en az 30 metre uzağa ve aşağıya kazın; dibi yeraltı suyundan en az 1,5 metre yukarıda kalsın, ağzını sağlam ve kapaklı bir zeminle örtün.",
    "steps": [
      "Yeri seçin: kuyu, pınar, dere ve gölden en az 30 metre uzakta olsun. Su kaynağına göre yokuş aşağıda kalsın, asla yukarısında olmasın.",
      "Sel basan çukur yerleri ve dere yataklarını seçmeyin. Evlerden en az 6 metre uzakta, ama gece de yürünebilsin diye 50 metreden yakın olsun.",
      "Yeraltı suyunu kontrol edin: kazarken toprak çamurlaşıyor ya da çukura su sızıyorsa daha derin kazmayın. Çukurun dibi yeraltı suyundan en az 1,5 metre yukarıda kalmalı.",
      "Çukuru 1–1,5 metre genişlikte ve en az 2 metre derinlikte kazın. 3 metre derin, 1,5 metre genişlikte bir çukur 6 kişilik bir aileye yıllarca yeter.",
      "Ağızdan aşağı en az 1 metreyi taş, tuğla ya da kütükle örün. Toprak gevşekse bütün çukuru örün; yoksa kenarlar çöker.",
      "Ağzın üstüne sağlam bir zemin kurun: kalın kalaslar ya da kütükler, üstüne sıkıştırılmış toprak. Zemin çevredeki topraktan en az 15 cm yüksek olsun ki yağmur suyu içeri akmasın.",
      "Zemine dört yetişkin çıkıp deneyin; hiç kımıldamamalı. Ortada küçük bir delik bırakın ve deliğe tahta bir kapak yapın.",
      "Her kullanımdan sonra bir avuç kül ya da kuru toprak serpin ve kapağı kapatın. Koku ve sinek azalır.",
      "Etrafını çit, hasır ya da tahtayla kapatın. Hemen yanına bir el yıkama yeri kurun.",
      "Doluluk toprak yüzeyine 50 cm kalınca yeni çukur kazın. Eskisine bir kat kireç ya da kül serpin, üstünü toprakla tepeleme doldurun ve yerini işaretleyin."
    ],
    "art": ["sf-hs-tuvalet-yer", null, null, "sf-hs-tuvalet-kesit", null, "sf-hs-tuvalet-zemin", null, null, null, null],
    "dont": [
      "Kuyunun ya da pınarın yukarısına, 30 metreden yakına tuvalet kazmayın; içme suyu kirlenir ve ishal salgını başlar.",
      "Çürük ya da sallanan zemini kullanmayın; çocuk çukura düşüp boğulabilir.",
      "Çukura çöp, kimyasal, yağ ya da bol su dökmeyin; çabuk dolar, kokar ve yeraltı suyunu kirletir.",
      "Dolmuş çukuru yeniden kazıp açmayın; içindeki dışkı yıllarca mikrop ve kurt yumurtası taşır."
    ],
    "keywords": [
      "çukur tuvalet nasıl yapılır",
      "cukur tuvalet kazma",
      "köy tuvaleti yapımı",
      "hela kazmak",
      "dışarıya tuvalet yapmak",
      "tuvalet kuyudan ne kadar uzak olmalı",
      "kalıcı tuvalet çukuru",
      "abdesthane çukuru",
      "tuvalet çukuru derinliği",
      "kanalizasyon yok tuvalet"
    ],
    "sources": [
      "WEDC (Loughborough Üni.) — Simple pit latrines, G025 (https://wedc-knowledge.lboro.ac.uk/resources/booklets/G025-SImple-pit-latrines-on-line.pdf)",
      "MSF — Cholera guideline, Appendix 14: Excreta pit (https://medicalguidelines.msf.org/en/viewport/CHOL/english/appendix-14-excreta-pit-stools-and-vomit-32409860.html)",
      "Newfoundland & Labrador Sağlık Bakanlığı — Pit privies 2009 (https://www.gov.nl.ca/hcs/files/publications-pitprivies2009.pdf)",
      "IFRC/RCRC Güneydoğu Asya — Introduction to excreta disposal (Sphere: yeraltı suyu kaynağından ≥30 m, çukur dibi su tablasından ≥1,5 m, evden ≥6 m ve ≤50 m) (https://www.rcrc-resilience-southeastasia.org/wp-content/uploads/2018/03/5-Introduction-to-Excreta-Disposal-Drainage-and-Hand.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WEDC G025 yeniden okundu (≥2 m derin, 1–1,5 m genişlik, üst 1 m örgü, zemin ~15 cm yüksek, 0,5 m kala kapatma, 3×1,5 m çukur 6 kişiye ~15 yıl, dip su tablasından ≥1,5 m); MSF Ek 14 (≥30 m, 1,5 m); Sphere değerleri IFRC özetinden (≥30 m, ≥1,5 m, evden 6–50 m). Sphere el kitabının kendi sayfasından metin alınamadı." }
  },
  {
    "id": "sf-hs-kompost-tuvalet",
    "category": "sf-hs-tuvalet",
    "title": "Kompost (kuru) tuvalet",
    "tag": "TUVALET",
    "summary": "Dışkıyı her seferinde kül, kireç, kuru toprak ya da talaşla örtün, idrarı ayrı tutun; dolan hazneyi Türkiye gibi serin iklimde 1,5–2 yıl bekletmeden gübre olarak kullanmayın.",
    "steps": [
      "İki hazneli düzen kurun: biri kullanılırken öteki dolu bekler. Tek hazne taze dışkıyı olgunla karıştırır ve boşaltması daha tehlikelidir.",
      "Hazneyi su geçirmez yapın: tabanı taş ya da sıvalı, üstünde kapaklı oturak, yanda ya da arkada sıkı kapanan bir boşaltma kapağı olsun. Hazneyi toprak seviyesinin üstüne kurun.",
      "Hazneye bir havalandırma borusu takın; nem ve koku dışarı çıksın.",
      "İdrarı ayırın: oturağın önüne ayrı bir huni koyup idrarı hortumla bir bidona ya da çakıllı bir sızma çukuruna akıtın. Taharet suyunu da hazneye değil sızma çukuruna verin.",
      "Her kullanımdan sonra dışkının üstünü bir iki avuç kül, söndürülmüş kireç, kuru toprak ya da talaşla tamamen örtün. Kül ve kireç mikropların ölümünü hızlandırır.",
      "Koku, sinek ya da ıslaklık görürseniz daha fazla kuru örtü ekleyin. Kuru kalan hazne kokmaz.",
      "Hazne dolunca kapatın ve ötekine geçin. Dolu hazneyi serin iklimde (yıllık ortalama 20 °C altı, Türkiye'nin çoğu) 1,5–2 yıl, sıcak iklimde en az 1 yıl bekletin.",
      "Boşaltırken eldiven, kürek ve ağız-burun bezi kullanın. Bitince ellerinizi sabunla yıkayın.",
      "Olgun malzemeyi meyve ağaçlarının ve süs bitkilerinin dibine gömün. Çiğ yenen sebzeye, köke ve yeşilliğe koymayın; son uygulamadan sonra en az 1 ay hasat etmeyin."
    ],
    "art": ["sf-hs-kompost-iki-hazne", null, null, "sf-hs-kompost-idrar", null, null, null, null, "sf-hs-kompost-agac"],
    "dont": [
      "Hazneye yağmur, bulaşık ya da yıkama suyu girmesine izin vermeyin; ıslak hazne çürür, kokar ve sinek yapar.",
      "Bekleme süresini kısaltmayın; kurt yumurtaları ve mikroplar aylarca canlı kalır.",
      "Olgunlaşmamış malzemeyi sebze bahçesine dökmeyin.",
      "Haznenin içine eğilip çıplak elle uğraşmayın."
    ],
    "keywords": [
      "kompost tuvalet",
      "kuru tuvalet yapımı",
      "susuz tuvalet",
      "talaşlı tuvalet",
      "idrar ayırmalı tuvalet",
      "dışkıdan gübre",
      "insan dışkısı kompost",
      "tuvalet gübresi ne zaman kullanılır",
      "kuru hela"
    ],
    "sources": [
      "SSWM — Dehydration and storage (WHO 2006 kılavuzu ve Schönning & Stenström 2004 tablosuna dayanır) (https://sswm.info/humanitarian-crises/prolonged-encampments/sanitation/collection-and-storage-treatment/dehydration-and-storage)",
      "WEDC — Simple pit latrines, G025 (havalandırma ve kapak) (https://wedc-knowledge.lboro.ac.uk/resources/booklets/G025-SImple-pit-latrines-on-line.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: bekleme süreleri (2–20 °C: 1,5–2 yıl; 20–35 °C: >1 yıl; kül/kireç pH>9: >6 ay), örtü malzemesi, idrar ve taharet suyunu ayırma, çiğ yenen sebzeye kullanmama, 1 ay hasat bekleme (SSWM/WHO). En tutucu süre seçildi." }
  },
  {
    "id": "sf-hs-kirec",
    "category": "sf-hs-tuvalet",
    "title": "Kireçle dezenfeksiyon ve badana",
    "tag": "TUVALET",
    "summary": "Söndürülmüş kireci tuvalet örtüsü, salgında dışkı arıtımı ve badana için kullanın; sönmemiş kireci her zaman suya azar azar katın, gözünüzü ve cildinizi koruyun.",
    "steps": [
      "Kireci tanıyın: sönmemiş kireç (parça, taş gibi) suyla temas edince ısınır, köpürür ve yakar. Söndürülmüş kireç toz ya da hamurdur ve daha az tehlikelidir. Mümkünse hep söndürülmüşü kullanın.",
      "Önce korunun: gözlük ya da göz siperi, kalın eldiven, lastik çizme, uzun kollu giysi, toz maskesi ya da sık dokulu ağız-burun bezi. Açık havada, rüzgârın tozu yüzünüze getirmediği yerde çalışın; dışkıya kireç katınca keskin amonyak kokusu çıkabilir.",
      "Sönmemiş kireci açık havada söndürün: geniş, sağlam bir kaba önce suyu koyun, kireci az az ekleyin ve uzun bir sopayla karıştırın. Kirecin üstüne asla su dökmeyin.",
      "Tuvalet örtüsü olarak her kullanımdan sonra dışkının üstüne bir avuç söndürülmüş kireç ya da kül serpin. Koku ve sinek azalır, mikroplar daha çabuk ölür.",
      "Salgında (kolera, dizanteri) hasta dışkısını ve kusmuğunu kapaklı bir kovada toplayın. Söndürülmüş kireci önce suyla bulamaç yapın (yaklaşık 1 kg kirece 3 litre su, kireci suya katarak) ve hemen kullanın. Kaynaklarda doz her litre atığa 10–40 gram kireç arasında değişir; pH ölçemiyorsanız üst sınırı, yani litreye yaklaşık 40 gram kullanın. En az 5 dakika iyice karıştırın, kapağı kapalı en az 2 saat bekletin, sonra çukura gömün.",
      "pH kâğıdınız varsa yarım saatte bir ölçün: karışım 2 saat boyunca 11'in üstünde kalmalı; düşerse bulamaç ekleyip yeniden karıştırın. Fazla kireç kötü karıştırmayı telafi etmez. Kireç kurt yumurtalarını öldürmez; işlenmiş atığı açıkta bırakmayın, gömün.",
      "Badana için söndürülmüş kireci suyla süt kıvamına getirip ahır, kümes, tuvalet ve depo duvarlarına fırçayla sürün. Kuruyunca ikinci kat sürün.",
      "İşiniz bitince elinizi ve yüzünüzü bol suyla yıkayın. Kireç göze kaçarsa ovuşturmadan en az 15 dakika temiz suyla yıkayın ve yardım arayın.",
      "Kireci kuru, kapalı kapta saklayın. Açıkta kalan kireç havayla kireç taşına döner ve artık mikrop öldürmez."
    ],
    "art": ["sf-hs-kirec-tanima", null, "sf-hs-kirec-sondurme", null, "sf-hs-kirec-kova", null, null, null, null],
    "dont": [
      "Sönmemiş kirecin üstüne su dökmeyin; kaynar ve yüzünüze sıçrar.",
      "Sönmemiş kireci ıslak elle, ıslak çuvalla ya da cebinizde taşımayın; teri bile yakar.",
      "Kireç tozunu solumayın; akciğere zarar verir.",
      "Kireçli dışkıyı sebze bahçesine dökmeyin; kurt yumurtaları ölmemiştir ve kireç toprağı bozar.",
      "Kalker, mermer ya da yanmamış kireç taşını dezenfektan sanmayın; mikrop öldürmez."
    ],
    "keywords": [
      "kireçle dezenfeksiyon",
      "sönmemiş kireç nasıl söndürülür",
      "kireç söndürme",
      "kireç badana",
      "ahıra kireç sürmek",
      "tuvalete kireç atmak",
      "kirec ile mikrop oldurme",
      "kaymak taşı kireç",
      "salgında dışkı kireç"
    ],
    "note": "Kireç cildi ve gözü yakan kostik bir maddedir. Uzman gözetimi olmadan büyük miktarda sönmemiş kireçle çalışmayın; çocukları uzak tutun.",
    "sources": [
      "Eawag/Sandec — Lime treatment of faecal sludge in emergencies (https://eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/sesp/Emergencies/lime_treatment.pdf)",
      "SSWM — Dehydration and storage (kül ve kireç örtüsü) (https://sswm.info/humanitarian-crises/prolonged-encampments/sanitation/collection-and-storage-treatment/dehydration-and-storage)",
      "Newfoundland & Labrador — Pit privies 2009 (çukur kapatırken kireç) (https://www.gov.nl.ca/hcs/files/publications-pitprivies2009.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: Eawag/Sandec belgesi yeniden okundu: söndürülmüş kireç (sönmemiş kireç acil durumda önerilmez, kalker işe yaramaz), önce bulamaç (~1 kg/3 L), 10–40 g/L örnek doz (yerelde kavanoz testiyle belirlenmeli; pH ölçümü yoksa üst sınır seçildi), ≥5 dk karıştırma, pH>11 en az 2 saat, 30 dakikada bir pH, kurt yumurtalarını öldürmez, koruyucu donanım ve amonyak. Badana adımı için kaynak bulunamadı (düşük risk)." }
  },
  {
    "id": "sf-hs-cop",
    "category": "sf-hs-tuvalet",
    "title": "Çöp ve atık yönetimi",
    "tag": "ATIK",
    "summary": "Çöpü kaynağında ayırın: yiyecek artığını hayvana ya da komposta verin, işe yarayanı saklayın, kalanı evlerden ve sudan uzak, setle çevrili bir çukurda her gün toprakla örtün.",
    "steps": [
      "Çöpü dörde ayırın: yiyecek artığı; yeniden kullanılabilir (cam, metal, bez, ip, tahta); işe yaramaz kalan; tehlikeli (pil, ilaç, kimyasal, iğne, cam kırığı).",
      "Yiyecek artığını tavuğa ya da hayvana verin; verilemeyeni kompost yığınına katıp üstünü toprak ya da kuru otla örtün.",
      "Şişe, kavanoz, teneke, tel, bez ve ipi yıkayıp kuru bir yerde saklayın. Bu düzende her biri değerlidir.",
      "Kalan çöp için çukur kazın: evlerden uzakta, kuyu, pınar ve dereden en az tuvalet kadar (30 metre) uzakta ve suyun aşağısında.",
      "Çukurun çevresine toprak set yapın ki yağmur suyu içine akmasın. Çocuk ve hayvan girmesin diye çit çekin.",
      "Her gün attığınız çöpün üstünü yaklaşık 10 cm toprak ya da külle örtün. Açık çöp sinek, fare ve köpek çeker.",
      "Çukur dolunca üstünü en az 50 cm toprakla kapatın, yerini işaretleyin ve yenisini kazın.",
      "Plastik, lastik, kablo ve boyalı tahtayı yakmayın; zehirli duman çıkar. Çöp yığınının yakınında ateş yakmayın, sigara içmeyin.",
      "Tehlikeli atığı ayrı, işaretli bir çukura gömün. İğneyi ve keskin camı önce kalın bir şişeye ya da tenekeye koyup ağzını kapatın."
    ],
    "art": ["sf-hs-cop-ayirma", null, null, null, null, "sf-hs-cop-ortme", null, "sf-hs-cop-yakma-yasak", null],
    "dont": [
      "Çöpü dere kenarına, kuyunun yakınına ya da evin dibine atmayın.",
      "Plastik ve lastik yakmayın; duman akciğere ve gözlere zarar verir.",
      "Çöp çukurunu açık bırakmayın; fare ve sinek salgın taşır.",
      "İğne ve cam kırığını sıradan çöpe atmayın; çocuklar ve çöpü karıştıranlar yaralanır."
    ],
    "keywords": [
      "çöp nasıl atılır belediye yok",
      "çöp çukuru kazmak",
      "çöp ayrıştırma",
      "atık yönetimi köy",
      "cop cukuru",
      "çöpü gömmek",
      "çöp yakmak zararlı mı",
      "evsel atık ne yapılır",
      "iğne cam kırığı nasıl atılır"
    ],
    "sources": [
      "WHO/WEDC — Technical note 7: Solid waste management in emergencies (https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-07-solid-waste-management-in-emergencies.pdf)",
      "CDC — Flea prevention (çöp kaplarını kapalı tutma, kemirgen çeken yığınlar) (https://www.cdc.gov/fleas/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WHO TN7 yeniden okundu (her kata 0,1 m toprak/kül, dolunca ≥0,5 m örtü, çit, çıplak ateş ve sigara yasağı, plastik dumanı); TN7'de çukur için mesafe yok, 30 m tuvalet mesafesinden benzetmedir. Önceki not: her katın üstüne ~0,1 m toprak ya da kül, dolunca ≥0,5 m örtü, toprak set ve çit, plastik yakmanın zararı (WHO TN7); kapalı çöp (CDC). Çukurun su kaynağına mesafesi kaynaklarda yok; tuvalet mesafesi (30 m) benzetmeyle alındı." }
  },
  {
    "id": "sf-hs-sinek-kemirgen",
    "category": "sf-hs-tuvalet",
    "title": "Sinek ve kemirgen kontrolü",
    "tag": "ATIK",
    "summary": "Sinek ve fareyi zehirle değil, yiyeceğe, çöpe ve dışkıya ulaşmalarını keserek önleyin; fare dışkısını kuru süpürmeyin, ölü hayvana çıplak elle dokunmayın.",
    "steps": [
      "Sineğin ürediği yeri ortadan kaldırın: tuvalet kapağını kapalı tutun, dışkının üstünü külle örtün, çöpü her gün toprakla kapatın, hayvan gübresini yığıp üstünü örtün.",
      "Yiyeceği ve içme suyunu hep kapalı tutun. Yemeği pişirir pişirmez yiyin; artığı açıkta bırakmayın.",
      "Sinek kapanı yapın: plastik şişenin üst kısmını kesip ters çevirerek huni gibi geçirin, içine biraz bozulmuş meyve ve su koyun. Kapanı mutfaktan uzağa asın.",
      "Tahıl, un ve kuru gıdayı metal, cam ya da sıkı kapaklı kaplarda, yerden yukarıda saklayın. Hayvan yemini de kapalı tutun.",
      "Fare girmesin: duvar diplerindeki delikleri ve boru geçişlerini taş, harç ya da teneke parçasıyla kapatın. Evin çevresindeki odun, taş ve hurda yığınlarını uzaklaştırın.",
      "Fareyi yaylı kapanla yakalayın. Kapanı duvar dibine, farenin geçtiği yola koyun; yem olarak tahıl ya da yağlı bir yiyecek kullanın.",
      "Bölgede veba şüphesi ya da çok sayıda ölü fare varsa önce pireyle savaşın, sonra fareyle. Fareyi önce öldürürseniz pireleri insana geçer.",
      "Fare dışkısını ve idrarını kuru süpürmeyin; kalkan toz hastalık bulaştırır. Odayı havalandırın, eldiven ve ağız bezi takın, dışkıyı sabunlu suyla ya da seyreltik çamaşır suyuyla ıslatın, bezle toplayıp gömün.",
      "Ölü fareye ve hayvan leşine çıplak elle dokunmayın. Eldivenle ya da ters çevrilmiş poşetle alın, derine gömün, sonra ellerinizi sabunla yıkayın.",
      "Fare idrarı bulaşmış olabilecek sel suyuna ve çamura yalınayak girmeyin; ayağınızdaki ve elinizdeki yaraları su geçirmez biçimde kapatın."
    ],
    "art": [null, null, "sf-hs-sinek-kapan", "sf-hs-fare-depo", null, null, null, "sf-hs-fare-temizlik", null, null],
    "dont": [
      "Fare zehrini çocukların, evcil ve çiftlik hayvanlarının ulaşabileceği yere koymayın.",
      "Fare pisliğini süpürge ya da fırçayla kuru kuru süpürmeyin.",
      "Ölü fare ve kuşlara çıplak elle dokunmayın, çocukların oynamasına izin vermeyin.",
      "Yemek artığını ve çöpü gece açıkta bırakmayın."
    ],
    "keywords": [
      "sinekten nasıl kurtulurum",
      "sinek kapanı yapımı",
      "fare istilası",
      "fareyle mücadele",
      "fare pisliği temizleme",
      "sican kapani",
      "ölü fare ne yapılır",
      "pire ve fare veba",
      "kemirgen kontrolü",
      "farelerden korunma"
    ],
    "sources": [
      "WHO — Plague fact sheet (önce pire, sonra kemirgen; leşe dokunmama) (https://www.who.int/news-room/fact-sheets/detail/plague)",
      "CDC — Flea prevention (gıda saklama, delikleri kapatma, yığınları kaldırma) (https://www.cdc.gov/fleas/prevention/index.html)",
      "CDC — Hantavirus prevention (dışkıyı kaldırıp tozutmama) (https://www.cdc.gov/hantavirus/prevention/index.html)",
      "CDC — Leptospirosis (fare idrarı, sel suyu, yaraları kapatma) (https://www.cdc.gov/leptospirosis/about/index.html)"
    ],
    "note": "Fare zehri insanı ve hayvanı da öldürür; kullanırsanız kapalı yem kutusunda ve çocuklardan uzak tutun. Toplu fare ölümü ya da ateşli şişkin bezeler görülürse veba şüphesiyle uzak durun ve sağlık yardımı arayın.",
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: pire önce/kemirgen sonra (WHO), gıdayı kapalı saklama ve delik kapatma (CDC), dışkıyı tozutmama (CDC hantavirüs), sel suyu ve yara (CDC lepto). Sinek kapanı ve kapan yerleşimi için kaynak bulunamadı; CDC'nin çamaşır suyu oranı sayfasına ulaşılamadı, oran verilmedi." }
  },

  // ───────────────────────── Temizlik ve kişisel bakım ─────────────────────────
  {
    "id": "sf-hs-el-yikama",
    "category": "sf-hs-temizlik",
    "title": "Ayakla çalışan el yıkama yeri (bidonlu musluk)",
    "tag": "TEMİZLİK",
    "summary": "İki çatallı direk, küçük bir bidon ve ayak pedalıyla ele dokunmadan çalışan bir el yıkama yeri kurun; tuvaletin ve mutfağın yanına koyun, altına çakıllı çukur kazın.",
    "steps": [
      "Malzemeyi toplayın: ucu çatallı iki dal (yaklaşık 2 m), iki ince çubuk (yaklaşık 1 m), 3–5 litrelik kapaklı bir bidon, iki parça ip ve sabun.",
      "Tuvaletin ya da mutfağın hemen yanına, aralarında yaklaşık 70 cm olan iki çukur kazın, her biri yaklaşık 50 cm derin. Çatallı dalları dikip dibini toprakla sıkıştırın.",
      "Ateşte ısıttığınız bir çiviyle bidonun kapağının yaklaşık 12 cm altına küçük bir delik açın. Kapağa da bir delik açın.",
      "Kapaktaki delikten bir ip geçirip içte düğüm atın ve kapağı kapatın. İpin öbür ucunu pedal olacak çubuğa bağlayın.",
      "Bidonu kulpundan ince çubuğa geçirin ve çubuğu iki çatalın üstüne yerleştirin. Bidonu delik hizasına kadar doldurun.",
      "İpi ayarlayın: pedal çubuğunun bir ucu yerde, öbür ucu yerden yaklaşık 15 cm yukarıda dursun. Pedala basınca bidon eğilip delikten ince su akmalı.",
      "Sabunu ortasından delip ipe geçirin ve direğe asın; çamura düşmez, kaybolmaz. Sabun yoksa yanına bir kap kül koyun.",
      "Suyun düştüğü yere 40×40 cm genişlikte, 20 cm derin bir çukur kazıp taş ve çakılla doldurun. Çamur ve sivrisinek olmaz.",
      "Kullanım: pedala basıp ellerinizi ıslatın, bırakın, sabunlayın; avuç, el sırtı, parmak araları ve tırnak diplerini en az 20 saniye ovun, yeniden basıp durulayın. Ellerinizi havada kurutun.",
      "Bidonu her gün doldurun, haftada bir içini ve dışını yıkayın, çürüyen çubukları değiştirin."
    ],
    "art": [null, null, "sf-hs-elyikama-bidon", null, null, "sf-hs-elyikama-pedal", null, null, "sf-hs-elyikama-kullanim", null],
    "dont": [
      "Ellerinizi herkesin kullandığı tek bir leğende sırayla yıkamayın; mikroplar leğende birikir ve herkese geçer.",
      "Herkesin kullandığı ortak havluyla kurulanmayın; ellerinizi havada kurutun.",
      "Altına çakıllı çukur kazmadan kurmayın; çamur, sivrisinek ve kayma olur."
    ],
    "keywords": [
      "el yıkama istasyonu",
      "tippy tap",
      "ayakla çalışan musluk",
      "pedallı el yıkama",
      "bidondan musluk yapma",
      "suyu az harcayan el yıkama",
      "el yikama yeri yapimi",
      "tuvalet yanına lavabo",
      "akan suyla el yıkama"
    ],
    "sources": [
      "FHI 360 — How to build a Tippy Tap (https://hip.fhi360.org/file/20783/f.%20How%20to%20Build%20A%20Tippy%20Tap.pdf)",
      "Watershed Management Group — Tippy tap construction guide (https://watershedmg.org/sites/default/files/documents/tippy-tap-handwashing-station-construction-guide.pdf)",
      "CDC — About handwashing (20 saniye, temel anlar) (https://www.cdc.gov/clean-hands/about/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: 2 m çatallı direk, 50 cm derin, 70 cm ara, 3–5 L bidon, delik kapağın 12 cm altında, pedal 15 cm, 40×40×20 cm çakıllı çukur, ipe geçirilmiş sabun, sabun yoksa kül, haftalık temizlik (FHI 360); ipe sabun ve havada kurutma (WMG); 20 saniye (CDC)." }
  },
  {
    "id": "sf-hs-kul-suyu",
    "category": "sf-hs-temizlik",
    "title": "Kül suyu (potas) yapma",
    "tag": "TEMİZLİK",
    "summary": "Sert odun külünü yağmur suyuyla süzerek kostik kül suyu elde edin; sabun için yumurta yüzdürecek kadar koyulaştırın, çalışırken gözünüzü ve cildinizi koruyun.",
    "steps": [
      "Kül seçin: meşe, kayın, elma, ceviz gibi yapraklı ağaçların çok iyi yanmış, beyaza yakın külünü toplayın. Çam gibi reçineli odunun külü zayıftır. Boya, vernik, plastik ya da çöp yakılmış külü kullanmayın.",
      "Külü yağmur almayan, kapalı bir kapta saklayın. Islanırsa içindeki potas akıp gider.",
      "Süzme kabı hazırlayın: dibinde delik ya da musluk olan tahta fıçı, plastik ya da paslanmaz kova. Dibe çakıl, üstüne bir karış saman ya da kuru ot serin. Alüminyum ve teneke kullanmayın; kül suyu onları çürütür.",
      "Kabı külle doldurun, hafifçe bastırın, üstte küçük bir çukur bırakın. Kabı taşların üstüne yükseltin, altına toplama kabı (cam, toprak ya da plastik) koyun.",
      "Külün üstüne yağmur ya da kaynak suyu dökün; ilk suyun bir kısmı kaynar olursa daha iyi çözer. Kül yüzecek kadar çok su dökmeyin.",
      "Bekleyin: 4–8 saat ya da bir gece sonra kahverengi sıvı damlamaya başlar. Akanı bir kez daha külün üstünden geçirin; koyulaşır.",
      "Gücünü ölçün: kül suyuna taze bir yumurta bırakın. Sabun için yumurta yüzmeli. Batıyorsa sıvıyı kaynatarak koyulaştırın; çok yukarıda yüzüyorsa az az yağmur suyu ekleyin. Bir tavuk tüyü içinde erimeye başlıyorsa da güçlüdür.",
      "Çamaşır ve kaba temizlik için koyu kül suyunu bol suyla seyreltin. Ele kaygan gelip yakıyorsa hâlâ çok koyudur.",
      "Kül suyunu üstüne 'YAKAR' yazılmış, kapaklı kapta, çocukların ulaşamayacağı yerde saklayın."
    ],
    "art": ["sf-hs-kul-secim", null, "sf-hs-kul-fici", null, null, null, "sf-hs-kul-yumurta", null, null],
    "dont": [
      "Kül suyunu içme suyu şişesinde ya da etiketsiz kapta saklamayın; içilirse öldürebilir.",
      "Çalışırken gözlüksüz eğilip bakmayın; göze kaçan kül suyu körlük yapabilir.",
      "Alüminyum ya da teneke kap kullanmayın; çürür ve delinir.",
      "Kül suyunun gücünü dilinizle ya da çıplak parmağınızla denemeyin."
    ],
    "keywords": [
      "kül suyu nasıl yapılır",
      "kul suyu yapimi",
      "odun külünden potas",
      "potas kostik",
      "külden sabun için su",
      "küllü su çamaşır",
      "kül suyu yumurta testi",
      "lye nasıl yapılır",
      "külden kostik elde etmek"
    ],
    "note": "Kül suyu cildi yakan ve göze kaçarsa kör edebilen kostik bir sıvıdır. Gözlük ve eldiven takın, çocukları uzak tutun; göze kaçarsa hemen en az 15 dakika temiz suyla yıkayın.",
    "sources": [
      "Practical Action — Soapmaking technical brief (https://rachel.core2learn.org/modules/en-practical_action/Manufacturing,%20handicraft,%20process%20industries/KnO-100357_Soapmaking/page1.html)",
      "Traditional Soap Making (Journey to Forever arşivi) (https://journeytoforever.org/bflpics/TraditionalSoapMaking.pdf)",
      "Mother Earth News — How to make soap from ashes (https://www.motherearthnews.com/homesteading-and-livestock/how-to-make-soap-from-ashes-zmaz72jfzfre/)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: sert odun külü, yağmur suyu, çakıl+saman filtre, alüminyum/teneke yasağı, 4–8 saat bekleme, yeniden süzme, yumurta ve tüy testi, kaynatarak koyulaştırma, yutulursa öldürücü ve göze kaçarsa körlük (Practical Action, Traditional Soap Making, MEN). Çamaşır için seyreltme oranı kaynakta yok." }
  },
  {
    "id": "sf-hs-sabun",
    "category": "sf-hs-temizlik",
    "title": "Sabun yapma: kül suyu ve yağ",
    "tag": "TEMİZLİK",
    "summary": "Temizlenmiş yağı yumurta yüzdüren kül suyuyla karıştırarak kaynatın, bıçak testiyle dengeleyin, istersen tuzla sertleştirin ve kullanmadan önce bir ay bekletin.",
    "steps": [
      "Yağı hazırlayın: hayvan iç yağını ya da kullanılmış yemek yağını suyla kaynatıp süzün. Soğuyunca üstte donan temiz yağı alın, dipteki tortu ve suyu atın.",
      "Oranı bilin: yaklaşık 1 ölçü eritilmiş yağa 12 ölçü yumurta yüzdüren kül suyu gerekir. Hepsini birden değil, azar azar ekleyeceksiniz.",
      "Kalın, alüminyum olmayan bir kazanda kül suyunu kaynatın. Sıcak yağı yavaş yavaş ekleyin ve uzun tahta kaşıkla sürekli karıştırın.",
      "Kaynatmayı sürdürün. Karışım koyulaşıp koyu bir lapa kıvamına gelir; yüzeyde büyük, beyaz, yuvarlak kabarcıklar patlamaya başlayınca sabun olmaya yakındır.",
      "Bıçak testi yapın: bıçak ucuyla biraz sabun alıp soğuk bir tabağa koyun. Saydam ve sıkı kalıyorsa denge iyidir. Beyazlaşıp kısa parçalara kırılıyorsa kül suyu fazladır, biraz yağ ekleyin. Uzun, yapışkan iplikler hâlinde akıyorsa biraz kül suyu ekleyin.",
      "Bu hâliyle elde ettiğiniz yumuşak (macun) sabundur; kapaklı kavanozda saklayabilirsiniz.",
      "Kalıp sabun için kaynayan karışıma bir avuç tuz atın: sabun üste çıkar, kahverengi su dibe çöker. Üstteki sabunu kepçeyle alın.",
      "Sabunu yağlanmış tahta kalıba ya da bezle kaplı kutuya dökün. Soğuyup sertleşince kesin.",
      "Sabunu kuru, havadar bir yerde en az 1 ay bekletin. Taze sabun cildi yakabilir.",
      "İlk kullanımda bileğinizin içinde küçük bir yerde deneyin. Yakıyor ya da kızartıyorsa kül suyu fazladır; biraz yağla yeniden kaynatın."
    ],
    "art": [null, null, "sf-hs-sabun-kazan", null, "sf-hs-sabun-test", null, null, "sf-hs-sabun-kalip", null, null],
    "dont": [
      "Sabunu dilinizle tadarak denemeyin; kostik ağzı yakar.",
      "Kazanın başından ayrılmayın ve çocukları uzak tutun; kabaran karışım taşar ve yakar.",
      "Alüminyum kap ve kaşık kullanmayın.",
      "Taze sabunu bebeğe, yaraya ya da yüze sürmeyin."
    ],
    "keywords": [
      "sabun nasıl yapılır",
      "evde sabun yapımı külden",
      "kül suyuyla sabun",
      "iç yağından sabun",
      "kullanılmış yağdan sabun",
      "arap sabunu yapımı",
      "sabun yapimi kostiksiz",
      "kalıp sabun tuzla",
      "doğal sabun yapmak"
    ],
    "note": "Kül suyu ve taze sabun cildi yakar, göze kaçarsa kör edebilir. Gözlük ve eldiven takın; uzman gözetimi olmadan büyük kazanlarla çalışmayın.",
    "sources": [
      "Traditional Soap Making (Journey to Forever arşivi) (https://journeytoforever.org/bflpics/TraditionalSoapMaking.pdf)",
      "Mother Earth News — How to make soap from ashes (https://www.motherearthnews.com/homesteading-and-livestock/how-to-make-soap-from-ashes-zmaz72jfzfre/)",
      "Practical Action — Soapmaking technical brief (https://rachel.core2learn.org/modules/en-practical_action/Manufacturing,%20handicraft,%20process%20industries/KnO-100357_Soapmaking/page1.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: 1 ölçü yağa ~12 ölçü yumurta yüzdüren kül suyu, kabarcık belirtisi, bıçak/tabak testi, tuzla kalıp sabun, 1 ay bekletme, alüminyum yasağı (Traditional Soap Making); lapa kıvamı ve tuz (MEN); kostik riskleri (Practical Action). Kaynaktaki dil testi bilerek alınmadı." }
  },
  {
    "id": "sf-hs-camasir",
    "category": "sf-hs-temizlik",
    "title": "Çamaşır yıkama ve kaynatma",
    "tag": "TEMİZLİK",
    "summary": "Çamaşırı sabunla ovup en az iki kez durulayın; hasta, bebek ve bitli çamaşırı kaynatın ya da en az 55 °C suda yıkayın, güneşte tamamen kurutun.",
    "steps": [
      "Çamaşırı ayırın: hasta çamaşırı, bebek bezi, regl bezi ve bitli giysiler bir yığın; gündelik giysiler ayrı yığın.",
      "Dışkı ya da kusmuk bulaşmışsa önce fazlasını tuvalet çukuruna kazıyın ya da silkeleyin.",
      "Kirli çamaşırı temiz suda birkaç saat ıslatın; kan ve dışkı lekeleri yumuşar.",
      "Sabunla ya da seyreltik kül suyuyla ovarak yıkayın. Yıkama tahtası, düz bir taş ya da tokaç kullanın.",
      "Hasta çamaşırını, bezleri ve bitli giysileri bir kazanda kaynatın ya da en az 55 °C suda, yani elinizi içinde tutamayacağınız sıcaklıkta yıkayın.",
      "En az iki kez temiz suyla durulayın. Kalan sabun ve kül cildi kaşındırır.",
      "Güneşte, tamamen kuruyana kadar asın. Nemli giysi ve bez pişik, mantar ve kaşıntı yapar.",
      "Kalın giysilerin dikiş yerlerini sıcak ütüyle ütüleyin; bit ve yumurtası dikişlerde saklanır.",
      "Yıkanamayan eşyaları (yorgan, ayakkabı, şapka) ağzı bağlı bir torbada 2 hafta bekletin; bitler aç kalıp ölür.",
      "Kirli yıkama suyunu dereye ya da kuyunun yakınına dökmeyin; çakıllı sızma çukuruna dökün."
    ],
    "art": ["sf-hs-camasir-ayirma", null, null, null, "sf-hs-camasir-kazan", null, "sf-hs-camasir-gunes", null, null, null],
    "dont": [
      "Hasta çamaşırını dere ya da pınarda yıkamayın; suyu kirletir, salgını aşağıdakilere taşırsınız.",
      "Kaynayan kazanı çocukların ulaşabileceği yerde bırakmayın; haşlanma çok ağır yanıktır.",
      "Bitli ve uyuzlu kişinin çamaşırını ötekilerle birlikte yıkamayın.",
      "Islak çamaşırı karanlık ve kapalı yerde kurutmayın."
    ],
    "keywords": [
      "elde çamaşır yıkama",
      "çamaşır kaynatma",
      "camasir kaynatmak",
      "makine yokken çamaşır",
      "hasta çamaşırı nasıl yıkanır",
      "bitli çamaşır yıkama",
      "çamaşırı mikroptan arındırmak",
      "kazanda çamaşır",
      "tokaçla yıkama"
    ],
    "sources": [
      "CDC — Body lice (sıcak yıkama, 2 hafta torbada) (https://www.cdc.gov/lice/about/body-lice.html)",
      "CDC — Head lice (130 °F/54 °C yıkama, 2 hafta torba) (https://www.cdc.gov/lice/about/head-lice.html)",
      "CRS — Reusable pad guide (ıslatma, iki durulama, güneşte kurutma) (https://www.crs.org/sites/default/files/wash-toolkit/resources/5MHM-reusable-pad-guide.pdf)",
      "UNICEF — Guide to menstrual hygiene materials 2019 (nemli bez ve enfeksiyon) (https://inee.org/sites/default/files/resources/UNICEF-Guide-menstrual-hygiene-materials-2019.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: en az 54 °C (130 °F) yıkama ve yıkanamayanı 2 hafta torbada bekletme (CDC), ıslatma ve iki kez durulama, güneşte kurutma (CRS), nemli bezin döküntü/enfeksiyon yapması (UNICEF). Dikiş ütüleme ana uygulamadaki kamp hijyeni rehberiyle uyumlu; ayrıca doğrulanmadı." }
  },
  {
    "id": "sf-hs-bit-pire-uyuz",
    "category": "sf-hs-temizlik",
    "title": "Bit, pire ve uyuz: tanıma ve temizlik",
    "tag": "TEMİZLİK",
    "summary": "Kaşıntının nedenini bulun; bitte ıslak tarama ve temiz giysi, uyuzda bütün ev halkının aynı gün tedavisi, pirede hayvan ve yatak temizliği gerekir.",
    "steps": [
      "Baş biti: saçta, kulak arkasında ve ensede susam büyüklüğünde canlı bitler ve saç diplerine yapışmış, silkelenince düşmeyen sirkeler görülür. Kepekten farkı, parmakla itince kaymamasıdır.",
      "Baş bitini ıslak tarama ile temizleyin: saçı yıkayın, bol saç kremi ya da kaygan bir şey sürün, sık dişli bit tarağını kökten uca çekin, her çekişte tarağı silin. 3–4 günde bir, en az 2 hafta sürdürün; üst üste 3 taramada bit çıkmayınca bırakın.",
      "Tarakları ve fırçaları en az 55 °C suda 5–10 dakika bekletin. Yastık, havlu ve şapkaları sıcak suyla yıkayın.",
      "Vücut biti giysilerde yaşar, deriye yalnız beslenmek için iner. Tek gerçek çaresi temizliktir: yıkanın, temiz giysi giyin, kirli giysileri kaynatın ya da 2 hafta bağlı torbada bekletin. Haftada en az bir kez temiz giysi giyin.",
      "Vücut biti tifüs gibi ölümcül salgınları taşır. Bir toplulukta vücut biti görülürse herkes aynı gün yıkansın, giysiler aynı gün kaynatılsın.",
      "Pire: evcil hayvanları sık yıkayıp tarayın, yataklarını sabunlu suyla yıkayın, yerleri sık süpürüp süprüntüyü dışarıda gömün. Hasta ya da ölü hayvana eldivensiz dokunmayın.",
      "Uyuz: özellikle geceleri artan şiddetli kaşıntı; parmak araları, bilekler, kollar, bel ve kasıkta küçük kabarcıklar ve ince çizgi gibi tüneller. Bebek ve küçük çocukta avuç, taban, ayak bileği ve başta da olur.",
      "Uyuzda evdeki herkes, kaşıntısı olmasa da aynı gün tedavi edilmeli; belirtiler bulaştıktan 4–6 hafta sonra çıkar. Uyuz ilacı ancak sağlık çalışanının tarifiyle kullanılır.",
      "Uyuzlu kişinin yatak ve giysilerini sıcak suda yıkayıp güneşte kurutun. Yıkanamayan eşyaları ağzı bağlı torbada en az 1 hafta bekletin.",
      "Kaşımaktan açılan yaraları sabunlu suyla yıkayıp kuru tutun. Yaralar irinlenir, kabuklanır, ateş çıkar ya da yüz ve göz kapakları şişerse ciddi enfeksiyon ve böbrek tutulumu olabilir; sağlık yardımı arayın."
    ],
    "art": ["sf-hs-bit-sirke", "sf-hs-bit-tarama", null, null, null, null, "sf-hs-uyuz-yerler", null, null, null],
    "dont": [
      "Gaz yağı, benzin, mazot ya da tarım ilacını saça ve deriye sürmeyin; yanık, zehirlenme ve yangın olur.",
      "Yalnız kaşınan kişiyi temizleyip ötekileri bırakmayın; bit ve uyuz geri gelir.",
      "Vebalı bölgede fareyi öldürmeden önce pireyi unutmayın; pireler insana geçer.",
      "Bitli kişinin tarağını, şapkasını, havlusunu ve yatağını paylaşmayın."
    ],
    "keywords": [
      "bit nasıl temizlenir",
      "baş biti sirke",
      "bitlenme",
      "ıslak tarama bit",
      "vücut biti giysi",
      "uyuz belirtileri",
      "gece kaşıntısı parmak arası",
      "uyuz nasıl bulaşır",
      "pire ısırığı evde pire",
      "bit tarağı"
    ],
    "sources": [
      "CDC — Head lice (https://www.cdc.gov/lice/about/head-lice.html)",
      "CDC — Body lice (https://www.cdc.gov/lice/about/body-lice.html)",
      "HSE İrlanda — Head lice and nits, ıslak tarama (https://www.hse.ie/conditions/head-lice-nits/)",
      "WHO — Scabies fact sheet (https://www.who.int/news-room/fact-sheets/detail/scabies)",
      "CDC — Flea prevention (https://www.cdc.gov/fleas/prevention/index.html)"
    ],
    "note": "İlaç ve doz bilgisi yoktur. Bit ve uyuz ilaçlarını, özellikle bebek, küçük çocuk, gebe ve emzirenlerde, yalnız sağlık çalışanı ya da eczacı önerisiyle kullanın.",
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: CDC baş biti (130 °F/54 °C, tarak 5–10 dk, 2 hafta torba) ve WHO uyuz (4–6 hafta, yerler, bebekte avuç/taban/baş, ev halkının tümü, torbada 1 hafta, çocuklarda böbrek hasarı) yeniden okundu; rehberde ilaç adı ve dozu bulunmadığı teyit edildi. Önceki not: bit ve sirke tanıma, tarak 130 °F suda 5–10 dk, 2 hafta torba (CDC); ıslak tarama 3–4 günde bir, 2 hafta, 3 temiz tarama (HSE); vücut bitinde tek tedavi temizlik ve tifüs (CDC); uyuz belirtileri, yerleri, 4–6 hafta, herkesi aynı anda tedavi, torbada 1 hafta, böbrek tutulumu (WHO); pire (CDC)." }
  },
  {
    "id": "sf-hs-dis",
    "category": "sf-hs-temizlik",
    "title": "Diş temizliği: misvak, bez ve tuzlu su",
    "tag": "KİŞİSEL BAKIM",
    "summary": "Dişlerinizi günde iki kez misvak, çiğnenmiş dal ya da parmağa sarılı bezle temizleyin, şekerli yiyeceği öğünle sınırlayın; kül ve kömürü her gün kullanmayın.",
    "steps": [
      "Diş fırçası ve macun varsa saklayıp kullanın; günde 2 kez fırçalayın. Florürlü macun çürüğü en iyi önleyen şeydir.",
      "Misvak varsa ucunun kabuğunu yaklaşık 1 cm soyun, ucu çiğneyip lif lif bir fırça hâline getirin.",
      "Misvağı kalem gibi tutun. Lifleri dişe dik tutup diş etinden dişin ucuna doğru silerek dişin dış ve iç yüzlerini temizleyin. Diş etine bastırmayın.",
      "Lifler dağılıp yumuşayınca ucu kesin ve yeni ucu çiğneyin. Bir misvak haftalarca dayanır.",
      "Misvak yoksa zehirsiz olduğundan emin olduğunuz bir ağacın taze, kalem kalınlığında dalını aynı biçimde çiğneyip kullanın.",
      "Dal da yoksa işaret parmağınıza temiz, pürüzlü bir bez sarıp dişleri tek tek silin; diş aralarını temiz bir iplikle temizleyin.",
      "Yemekten sonra ağzı temiz suyla çalkalayın. Diş eti kanıyor ya da ağızda yara varsa ılık tuzlu suyla çalkalayın.",
      "Pekmez, pestil, bal, kuru meyve gibi şekerli ve yapışkan yiyecekleri öğün arasında değil, yemekle birlikte yiyin. Ana içeceğiniz su olsun.",
      "Yüzde ya da boyunda şişlikle birlikte diş ağrısı ve ateş varsa enfeksiyon yayılıyordur; vakit kaybetmeden sağlık yardımı arayın."
    ],
    "art": [null, "sf-hs-dis-misvak-cigneme", "sf-hs-dis-misvak-firca", null, null, "sf-hs-dis-bez", null, null, null],
    "dont": [
      "Zakkum, porsuk ve tanımadığınız bitkilerin dalını ağzınıza almayın; zehirlidir.",
      "Kül, kömür, kum ya da tuğla tozunu her gün diş tozu olarak kullanmayın; mineyi aşındırır.",
      "Misvak ya da dalla diş etini sert sert ovmayın; diş eti çekilir.",
      "Ağrıyan, şişen dişi iğne ya da çiviyle kendiniz deşmeyin; enfeksiyon yüze ve boyna yayılabilir."
    ],
    "keywords": [
      "misvak nasıl kullanılır",
      "fırçasız diş temizleme",
      "diş fırçası yok",
      "macun yokken diş",
      "dalla diş fırçalamak",
      "dis temizligi dogal",
      "diş eti kanaması tuzlu su",
      "çürük önleme",
      "ağız bakımı uzun süre"
    ],
    "sources": [
      "WHO — Oral health fact sheet (günde 2 kez fırçalama, şeker, su) (https://www.who.int/news-room/fact-sheets/detail/oral-health)",
      "Dimensions of Dental Hygiene — Use miswak to improve oral health outcomes (https://dimensionsofdentalhygiene.com/article/use-miswak-improve-oral-health-outcomes/)",
      "Wikipedia — Miswak (WHO'nun 1986 önerisi ve 2000 uzlaşı raporu) (https://en.wikipedia.org/wiki/Miswak)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: günde 2 kez florürlü fırçalama, serbest şekeri azaltma, suyu ana içecek yapma (WHO); misvak hazırlama (yaklaşık 1,3 cm soyma), dik tutma, diş etinden uca, ucu kesme, yanlış kullanımda diş eti çekilmesi (Dimensions). Tuzlu su çalkalama ve kül/kömür aşınması için ulaşılabilir resmî kaynak bulunamadı." }
  },
  {
    "id": "sf-hs-kadin-hijyeni",
    "category": "sf-hs-temizlik",
    "title": "Kadın hijyeni: yıkanabilir ped ve regl bezi",
    "tag": "KİŞİSEL BAKIM",
    "summary": "Pamuklu bezden katlı ped dikin, 4–6 saatte bir değiştirin, önce suda ıslatıp durulayın, sabunla yıkayın ve güneşte tamamen kurutun.",
    "steps": [
      "Kumaşı seçin: yumuşak, emici pamuklu bez ya da pazen. Koyu renk leke göstermez. Tene değen yüzde sentetik kumaş kullanmayın.",
      "Ped dikin: emici pamuklu bezi birkaç kat katlayıp kenarlarından dikin. Alta su geçirmeyen bir kat (eski yağmurluk kumaşı) ekleyebilirsiniz. Kanatlı yapıp külota çıtçıt, düğme ya da bağla tutturun.",
      "En az 5 ped hazırlayın; biri takılıyken ötekiler yıkanıp kurusun. Yoğun günlerde 8 ve daha fazlası gerekir.",
      "Pedi akıntıya göre 4–6 saatte bir değiştirin. Uzun süre takılı kalırsa koku ve tahriş yapar.",
      "Kullanılmış pedi önce temiz suda birkaç dakika ıslatın, sonra en az iki kez durulayın.",
      "Sonra sabunla, lekeli yerleri ovarak yıkayın ve iyice durulayın.",
      "Güneşte, tamamen kuruyana kadar asın. Utanıp nemli bir köşede ya da başka giysinin altında kurutmayın; nemli bez kaşıntı ve enfeksiyon yapar.",
      "Kuruyan pedi temiz bir ütüyle ütüleyin ve temiz bir bez torbada saklayın.",
      "Kadınlar ve kızlar için değiştirme, yıkama ve kurutmaya uygun, kapalı ve güvenli bir yer ayırın.",
      "Pedleri yaklaşık yılda bir yenileyin; incelen, emmeyen pedi atın. Atılan bezi gömün."
    ],
    "art": [null, "sf-hs-ped-dikis", null, null, "sf-hs-ped-islatma", null, "sf-hs-ped-gunes", null, null, null],
    "dont": [
      "Pedi nemliyken takmayın.",
      "Başkasının pedini kullanmayın.",
      "Kötü kokulu akıntı, kaşıntı, yanma ya da karın ağrısıyla ateşi önemsiz saymayın; enfeksiyon olabilir, sağlık yardımı arayın."
    ],
    "keywords": [
      "yıkanabilir ped yapımı",
      "kumaş ped",
      "regl bezi nasıl yıkanır",
      "ped yokken ne kullanılır",
      "adet bezi",
      "aybaşı hijyeni",
      "pet yok regl",
      "kendi pedini dikmek",
      "kadin hijyeni bez"
    ],
    "sources": [
      "UNICEF — Guide to menstrual hygiene materials 2019 (https://inee.org/sites/default/files/resources/UNICEF-Guide-menstrual-hygiene-materials-2019.pdf)",
      "CRS — Reusable pad guide (https://www.crs.org/sites/default/files/wash-toolkit/resources/5MHM-reusable-pad-guide.pdf)",
      "Darrang (Assam) il yönetimi — Menstrual hygiene leaflet (4–6 saat) (https://darrang.assam.gov.in/sites/default/files/public_utility/16-pdf_0.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: pamuklu/pazen, su geçirmez alt kat, kanat, en az 5 ped, yaklaşık 1 yıl ömür, nemli bezin enfeksiyon riski, mahremiyet (UNICEF); koyu kumaş, 8 pedlik set, ıslatma, iki durulama, sabun, güneş, ütü (CRS); 4–6 saatte değiştirme (Assam)." }
  },
  {
    "id": "sf-hs-bebek-bezi",
    "category": "sf-hs-temizlik",
    "title": "Bebek bezi: yıkanabilir bez",
    "tag": "KİŞİSEL BAKIM",
    "summary": "Pamuklu bezi katlayıp bebeğe gevşekçe bağlayın, ıslandıkça değiştirin, kirli bezi kapaklı kovada bekletip sabunla yıkayın, kaynatın ve güneşte kurutun.",
    "steps": [
      "Bez hazırlayın: yumuşak pamuklu kumaştan kare parçalar kesin. Gün içinde sık değiştireceğiniz için bol hazırlayın; biri kururken ötekiler kullanılsın.",
      "Bezi üçgen ya da dikdörtgen katlayın, kalın kısmı ortaya gelsin. Bele bağlayın ya da çengelli iğneyle tutturun; sıkmayın, iki parmak girecek boşluk kalsın.",
      "Islanır ıslanmaz değiştirin. Islak ve kirli bez pişik yapar.",
      "Her değişimde bebeğin altını ılık temiz suyla yıkayın, sabunu az kullanın. Ovmadan, hafif bastırarak kurulayın ve bir süre açıkta kurumaya bırakın.",
      "Pişik varsa bebeği gün içinde bezsiz bırakın. Saf vazelin ya da kokusuz koruyucu krem varsa kalın bir kat sürün.",
      "Kirli bezin dışkısını tuvalet çukuruna silkeleyin ya da kazıyın, sonra ellerinizi sabunla yıkayın.",
      "Kirli bezleri kapaklı bir kovada suda bekletin. Kovayı küçük çocukların ulaşamayacağı yerde tutun.",
      "Bezleri sabunla yıkayın, ardından kaynatın ya da elinizi içinde tutamayacağınız kadar sıcak suda yıkayın. İki kez durulayın.",
      "Güneşte tamamen kurutun. Nemli bezi bebeğe takmayın.",
      "Pişik 2–3 günde düzelmiyorsa, içinde kabarcık, irin, kabuk varsa, çok ağrılıysa ya da bebekte ateş varsa sağlık yardımı arayın."
    ],
    "art": [null, "sf-hs-bez-katlama", null, null, null, null, "sf-hs-bez-kova", "sf-hs-bez-kazan", null, null],
    "dont": [
      "Bez kovasını açık ve ulaşılabilir bırakmayın; küçük çocuk içine düşüp boğulabilir.",
      "Bebeğin altına naylon sarıp saatlerce bırakmayın; pişik ve yara yapar.",
      "Antibiyotikli pomadı kendi kendinize sürmeyin; tahrişi artırabilir.",
      "Kirli bezleri içme suyu kaynağında yıkamayın."
    ],
    "keywords": [
      "bez bebek bezi",
      "yıkanabilir bebek bezi",
      "kundak bezi yıkama",
      "hazır bez yok bebek",
      "bebek bezi nasıl katlanır",
      "pişik nasıl geçer",
      "bebek pisigi",
      "tetra bez kaynatma",
      "çocuk bezi yapımı"
    ],
    "sources": [
      "AAP HealthyChildren — Diaper rash (https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx)",
      "MSF — Cholera guideline, Appendix 4: Public information (bezlerin güvenli atılması) (https://medicalguidelines.msf.org/en/viewport/CHOL/english/appendix-4-example-of-public-information-25297214.html)",
      "CDC — About handwashing (bez değiştirdikten sonra el yıkama) (https://www.cdc.gov/clean-hands/about/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: sık değiştirme, suyla temizleme, hafif kurulama, havada kurutma, kalın koruyucu katman, sıkı bağlamama, antibiyotikli pomattan kaçınma, 2–3 gün kuralı ve uyarı belirtileri (AAP); bez değişiminden sonra el yıkama (CDC). Bez yıkama sıcaklığı için özel kaynak bulunamadı; bit rehberindeki sıcaklık ilkesi uygulandı." }
  },

  // ───────────────────────── Uzun dönem hasta bakımı ─────────────────────────
  {
    "id": "sf-hs-yara-bakimi",
    "category": "sf-hs-bakim",
    "title": "Uzun süreli yara bakımı: kaynatılmış bez ve tuzlu su",
    "tag": "HASTA BAKIMI",
    "summary": "Hastane yokken yarayı her gün temiz ellerle açın, kaynatılıp soğutulmuş tuzlu suyla yıkayın, kaynatılmış kuru bezle örtün ve iyileşmeyi her gün karşılaştırın.",
    "steps": [
      "Tuzlu su hazırlayın: 1 litre suyu kaynatın, içine 9 gram tuz (yaklaşık 1,5 silme çay kaşığı) katın, kapağı kapalı soğumaya bırakın. Her gün taze yapın. Tuz yoksa kaynatılıp soğutulmuş su da olur.",
      "Bezleri hazırlayın: pamuklu bezleri kaynayan suda kaynatın, temiz ellerle sıkın, temiz bir yerde kurutun, sıcak ütüyle ütüleyip kapalı temiz bir kapta saklayın.",
      "Pansumandan önce ellerinizi sabunla en az 20 saniye yıkayın. Yaraya parmakla değil, kaynatılmış bezle dokunun.",
      "Eski bezi yavaşça çıkarın. Yapışmışsa tuzlu suyla ıslatıp yumuşatın, sonra çekin.",
      "Yarayı tuzlu suyla bol bol yıkayın: temiz bir kaptan yaranın üstüne akıtın, kiri ve gevşek kabukları akıntıyla uzaklaştırın. Yaranın içini ovmayın.",
      "Yaranın çevresindeki deriyi sabunlu suyla, yaradan dışarı doğru silin.",
      "Kuru, kaynatılmış bezle örtün ve sarın. En az günde bir kez bakın; bez ıslanır ya da kirlenirse hemen değiştirin.",
      "Her gün karşılaştırın: kızarıklık küçülüyor, akıntı azalıyor, kenarlar kapanıyorsa iyileşiyor. Kızarıklık yayılıyor, ağrı artıyor, irin ya da kötü koku varsa enfeksiyondur; 'Enfeksiyon belirtileri' rehberine bakın.",
      "Kullanılmış bezleri ayrı bir kapta toplayın; kaynatarak yıkayın ya da gömün. İş bitince ellerinizi yeniden yıkayın.",
      "Yaralıyı iyi besleyin ve bol sıvı verin; yumurta, et, yoğurt, baklagil gibi protein yaranın kapanmasına yardım eder."
    ],
    "art": ["sf-hs-yara-tuzlu-su", null, null, null, "sf-hs-yara-yikama", null, "sf-hs-yara-sarma", null, null, null],
    "dont": [
      "Yaraya toprak, kül, kahve, salça, diş macunu ya da hayvan dışkısı sürmeyin; tetanoz ve enfeksiyon yapar.",
      "Kirli ya da derin yarayı dikmeye, yapıştırmaya kalkmayın; içeride kalan mikrop apse yapar.",
      "Aynı bezi yıkamadan ikinci kez kullanmayın.",
      "Yara bakarken öksürmeyin, yaraya üflemeyin."
    ],
    "keywords": [
      "yara pansumanı her gün",
      "yara nasıl temizlenir uzun süre",
      "tuzlu su ile yara yıkama",
      "serum fizyolojik evde yapma",
      "pansuman bezi kaynatma",
      "yara iyileşmiyor",
      "hastane yok yara bakımı",
      "yara pansuman nasil yapilir",
      "steril bez yapmak"
    ],
    "note": "Bu rehber sağlık çalışanına ulaşılamayan durum içindir. Derin, kirli, ısırık ya da kemiğe ulaşan yaralar uzman bakımı ister; ilk müdahale için ana uygulamadaki 'Yara temizliği ve enfeksiyon belirtileri' rehberine bakın.",
    "sources": [
      "WHO — Sepsis fact sheet (enfeksiyonu önleme ve erken tanıma) (https://www.who.int/news-room/fact-sheets/detail/sepsis)",
      "NHS — Pressure ulcers (enfeksiyon belirtileri, beslenme) (https://www.nhs.uk/conditions/pressure-sores/)",
      "CDC — About handwashing (yara bakımından önce ve sonra) (https://www.cdc.gov/clean-hands/about/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: el yıkama anları (CDC), enfeksiyon belirtileri ve beslenme (NHS), erken tanıma (WHO). %0,9 tuzlu su = litrede 9 g tanımdır; çay kaşığı çevirisi yaklaşıktır. Pansuman sıklığı ve bez kaynatma süresi için ulaşılabilir resmî kaynak bulunamadı; sayı verilmedi." }
  },
  {
    "id": "sf-hs-enfeksiyon",
    "category": "sf-hs-bakim",
    "title": "Enfeksiyon belirtileri: ne zaman ciddi?",
    "tag": "HASTA BAKIMI",
    "summary": "Kızarıklık, şişlik ve irin yerel enfeksiyondur; ateş ya da üşüme, bilinç bulanıklığı, hızlı nefes ve idrarın azalması kan zehirlenmesi (sepsis) olabilir ve saatler içinde öldürebilir.",
    "steps": [
      "Yerel enfeksiyonu tanıyın: yara ya da deride artan kızarıklık, şişlik, sıcaklık, artan ağrı, irin ya da kötü koku.",
      "Kızarıklığın sınırını bir kömür ya da kalemle deriye çizin ve saati not edin. Sonraki kontrollerde kızarıklık çizginin dışına taşıyorsa enfeksiyon yayılıyordur.",
      "Yaradan yukarı doğru uzanan kırmızı çizgiler ya da koltuk altında, kasıkta, boyunda şişen ağrılı bezeler enfeksiyonun yayıldığını gösterir.",
      "Yetişkinde tüm vücudu saran tehlike belirtileri: ateş ya da tersine vücudun soğuması ve titreme, bilinç bulanıklığı, nefes darlığı, soğuk ve terli deri, şiddetli vücut ağrısı, hızlı kalp atışı, idrarın çok azalması.",
      "Çocukta: hızlı nefes, havale, solgun ya da alaca deri, uyandırmakta zorlanma, dokununca soğuk deri. 5 yaşından küçükte beslenememe, sık kusma, hiç idrar yapmama.",
      "Doğum yapmış kadında ateş, kötü kokulu akıntı ve karın ağrısı doğum sonrası enfeksiyondur ve tehlikelidir.",
      "Risk altındakileri daha sık kontrol edin: yaşlılar, gebeler ve yeni doğum yapmışlar, yenidoğanlar, şeker, böbrek ve karaciğer hastaları, bağışıklığı zayıf olanlar.",
      "Ateşi, nabzı ve idrar sayısını günde birkaç kez yazın. Nabzı bilekten 30 saniye sayıp 2 ile çarpın.",
      "Tehlike belirtilerinden biri varsa beklemeyin: kişiyi ulaşabildiğiniz en yakın sağlık çalışanına götürün. Bilinci açıksa yolda sıvı vermeyi sürdürün.",
      "Önleyin: yaraları her gün temizleyin, elleri sabunla yıkayın, temiz su için, iyi beslenin."
    ],
    "art": ["sf-hs-enf-yerel", "sf-hs-enf-sinir-cizme", null, null, null, null, null, "sf-hs-enf-nabiz", null, null],
    "dont": [
      "Elinizdeki antibiyotiği tahminle, eksik ya da başkasının reçetesinden kullanmayın; hem işe yaramayabilir hem de direnç yaratır.",
      "Apseyi kirli iğne ya da bıçakla deşmeyin.",
      "Ateş düştü diye öteki tehlike belirtilerini görmezden gelmeyin.",
      "Kötüleşen hastayı 'sabaha bakarız' diye bekletmeyin; sepsis saatler içinde ilerler."
    ],
    "keywords": [
      "yara enfeksiyon kaptı mı",
      "iltihap belirtileri",
      "kan zehirlenmesi belirtileri",
      "sepsis nedir",
      "yaradan kırmızı çizgi",
      "irin ve ateş",
      "mikrop kapmış yara",
      "enfeksiyon ne zaman tehlikeli",
      "lohusa ateşi"
    ],
    "note": "Sepsis acil durumdur. Bu rehber yalnız belirtileri tanımak içindir, ilaç ve antibiyotik tarifi içermez; ulaşabildiğiniz herhangi bir sağlık çalışanına hemen başvurun.",
    "sources": [
      "WHO — Sepsis fact sheet (https://www.who.int/news-room/fact-sheets/detail/sepsis)",
      "WHO — Maternal mortality fact sheet (doğum sonrası enfeksiyon) (https://www.who.int/news-room/fact-sheets/detail/maternal-mortality)",
      "NHS — Pressure ulcers (yerel enfeksiyon belirtileri) (https://www.nhs.uk/conditions/pressure-sores/)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: yetişkin, çocuk ve 5 yaş altı sepsis belirtileri, risk grupları, önleme (WHO Sepsis); doğum sonrası enfeksiyon (WHO maternal); yerel belirtiler (NHS). Kızarıklık sınırını çizme ve lenfanjit çizgisi yaygın klinik uygulamadır, ulaşılabilir kaynakla ayrıca doğrulanamadı." }
  },
  {
    "id": "sf-hs-atesli-hasta",
    "category": "sf-hs-bakim",
    "title": "Ateşli hastaya günlerce bakım",
    "tag": "HASTA BAKIMI",
    "summary": "Ateşli hastayı ayrı ve havadar bir yerde dinlendirin, sürekli sıvı verin, ince örtün, ateşini ve idrarını günde birkaç kez yazın; tehlike belirtilerinde hemen yardım arayın.",
    "steps": [
      "Hastayı serin, havadar, ayrı bir yere yatırın; bulaşıcı olabilir. Ona tek bir kişi baksın.",
      "Sık sık, az az sıvı verin: su, ayran, çorba ya da ağızdan sıvı tuzu (ORS). İdrar açık renkli olmalı.",
      "İnce giydirin, tek ince örtü yeter. Kat kat örtmeyin; çocuğu soyup soğuk suyla silmeyin.",
      "İştahı varsa hafif yiyecek verin: çorba, lapa, yoğurt. Bebeği emzirmeyi sürdürün.",
      "Ateşi, içtiği sıvıyı ve idrar sayısını sabah, öğle, akşam ve gece bir kâğıda yazın. Gece de kalkıp kontrol edin.",
      "Dudakları nemli tutun, ağzı suyla çalkalatın. Terleyen hastanın çarşafını ve giysisini kuru tutun.",
      "Hemen yardım arayın: ense sertliği, ışıktan rahatsızlık, üstüne bardak bastırınca solmayan döküntü, nefes darlığı, morumsu dudak, uyandırmakta zorlanma, havale.",
      "Ateş 5 gün ya da daha uzun sürüyorsa, 3 aydan küçük bebekte 38 °C ve üstü, 3–6 aylıkta 39 °C ve üstü varsa ya da hasta sıvı içemiyorsa durum ciddidir; sağlık çalışanına ulaşın.",
      "Bakıcı hastaya her dokunuştan sonra ellerini sabunla yıkasın. Hastanın tabağını, bardağını ve havlusunu ayırıp sıcak suyla ayrı yıkayın."
    ],
    "art": [null, "sf-hs-ates-sivi", "sf-hs-ates-ince-ortu", null, "sf-hs-ates-cizelge", null, null, null, null],
    "dont": [
      "Hastayı kalın yorganlara sarıp terletmeye çalışmayın.",
      "Buzla, soğuk suyla ya da alkolle silmeyin; alkol deriden emilir ve zehirler, alkol içilmez (metanol riski).",
      "16 yaşından küçüklere aspirin vermeyin.",
      "Ateşli hastayı bebekler ve yaşlılarla aynı yatakta yatırmayın."
    ],
    "keywords": [
      "ateşli hastaya nasıl bakılır",
      "günlerdir ateşi var",
      "ateş düşmüyor evde bakım",
      "hasta bakımı ateş",
      "atesli hasta bakimi",
      "ateş çizelgesi",
      "hasta yatağı ateş sıvı",
      "uzun süren ateş"
    ],
    "note": "İlaç ve doz bilgisi yoktur. Ateş düşürücüleri yalnız eczacı ya da hekim önerisiyle kullanın. İlk değerlendirme için ana uygulamadaki 'Yüksek ateş' rehberine bakın.",
    "sources": [
      "NHS — Fever in adults (https://www.nhs.uk/conditions/fever-in-adults/)",
      "NHS — Fever in children (https://www.nhs.uk/conditions/fever-in-children/)",
      "WHO — Sepsis fact sheet (https://www.who.int/news-room/fact-sheets/detail/sepsis)",
      "CDC — Preventing spread when sick (https://www.cdc.gov/respiratory-viruses/prevention/precautions-when-sick.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: dinlenme, bol sıvı, açık renk idrar, başkalarından uzak durma (NHS yetişkin); soyup silmeme, kat kat örtmeme, gece kontrol, emzirmeyi sürdürme, 38/39 °C eşikleri, 5 gün, acil belirtiler, 16 yaş altına aspirin yok (NHS çocuk); sepsis belirtileri (WHO)." }
  },
  {
    "id": "sf-hs-sivi-kaybi",
    "category": "sf-hs-bakim",
    "title": "Sıvı kaybı ve evde ağızdan sıvı tedavisi",
    "tag": "HASTA BAKIMI",
    "summary": "İshal ve kusmada evde hazırladığınız ağızdan sıvı tuzunu (ORS) kaşık kaşık verin, sıvı kaybını belirtilerle izleyin ve beslenmeyi kesmeyin.",
    "steps": [
      "Ev ORS'si: 1 litre kaynatılıp soğutulmuş suya 6 silme çay kaşığı şeker ve yarım silme çay kaşığı tuz katın, eriyene kadar karıştırın. Tadı gözyaşından tuzlu olmamalı; tuzluysa dökün ve yeniden yapın. Her gün taze yapın.",
      "Elinizde eczaneden kalmış ORS paketi (WHO düşük ozmolar ORS) varsa en iyisi odur: paketin üstünde yazan su miktarına tam uyun, fazla ya da az su koymayın. Hiçbir ölçü tutturulamıyorsa hafif tuzlu pirinç suyu ya da tuzlu çorba verin, anne sütünü sürdürün; ölçüsüz çok tuzlu ya da çok şekerli içecek vermeyin.",
      "Sıvı kaybı belirtilerini kontrol edin: susuzluk, koyu ve az idrar, ağız kuruluğu, çökük gözler, bebekte çökük bıngıldak ve az ıslanan bez, huzursuzluk.",
      "Karın derisini iki parmakla çimdikleyip bırakın. Deri 2 saniyeden uzun sürede düzleşiyorsa sıvı kaybı ağırdır.",
      "Sıvı kaybı belirtisi varsa ilk 4 saatte kilo başına yaklaşık 75 ml ORS verin: 10 kiloluk çocuğa yaklaşık 800 ml, yetişkine 4 litreye kadar. Daha fazla isterse verin.",
      "Kaşıkla ya da küçük yudumlarla verin. Kusarsa 10 dakika bekleyin, sonra 2–3 dakikada bir kaşık olacak kadar yavaş sürdürün.",
      "Sonra her sulu dışkıdan sonra ek ORS verin: 5 kilodan küçük bebeğe yaklaşık 50 ml, 5–10 kiloya 100 ml (yarım su bardağı), 10–20 kiloya 200 ml, daha büyüklere 300 ml. Yemeğe devam edin; bebeği emzirmeyi kesmeyin.",
      "Birkaç saatte bir belirtileri yeniden kontrol edin; idrar açılıp gözler düzelene kadar sürdürün.",
      "Tehlike: uyuşukluk, uyandırmakta zorlanma, hiç içememe, soğuk ve alaca deri, hızlı nefes. Bu kişiye damardan sıvı gerekir; ulaşabildiğiniz sağlık çalışanına taşıyın, yolda kaşıkla ORS vermeyi sürdürün.",
      "Kanlı ishal ya da 14 günden uzun süren ishalde de yardım arayın. Salgını önlemek için dışkıyı tuvalet çukuruna atın ve elleri sabunla yıkayın."
    ],
    "art": ["sf-hs-ors-hazirlama", null, null, "sf-hs-ors-cimdik", null, "sf-hs-ors-kasik", null, null, null, null],
    "dont": [
      "ORS'ye fazladan tuz koymayın; fazla tuz özellikle bebeği zehirler.",
      "Kola, gazoz ve hazır meyve suyuyla sıvı tedavisi yapmayın; ishali artırır.",
      "İshalli kişinin yemeğini kesmeyin, bebeğin mamasını sulandırmayın.",
      "Ağır sıvı kaybındaki kişiyi yalnız bırakmayın ve bilinci kapalıyken ağzına sıvı dökmeyin."
    ],
    "keywords": [
      "evde ors yapımı",
      "ağızdan sıvı tuzu tarifi",
      "susuz kalmış çocuk",
      "dehidrasyon belirtileri",
      "vücut susuz kaldı",
      "ishal kusma sıvı kaybı tedavisi",
      "kolera sıvı",
      "deri çimdik testi",
      "tuzlu şekerli su oranı",
      "dehidrasyon nasil gecer"
    ],
    "note": "Ağır sıvı kaybı damar yoluyla sıvı gerektirir. Uzman yardımına ulaşılamıyorsa kişi bilinçliyken ORS'yi kaşıkla vermeyi hiç bırakmayın.",
    "sources": [
      "WHO — Diarrhoeal disease fact sheet (https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease)",
      "MSF — Cholera guideline, Appendix 5: Volumes of ORS (https://medicalguidelines.msf.org/en/viewport/CHOL/english/appendix-5-volumes-of-rl-and-ors-for-rehydration-25297223.html)",
      "NHS — Dehydration (https://www.nhs.uk/conditions/dehydration/)",
      "WHO — Cholera fact sheet (https://www.who.int/news-room/fact-sheets/detail/cholera)",
      "MSF — Appendix 14: WHO rehydration plans (Plan A dışkı başına 50/100/200/300 ml, Plan B 75 ml/kg 4 saatte, kusmada 10 dk bekleme, tuzlu pirinç suyu ve çorba) (https://medicalguidelines.msf.org/en/viewport/mme/english/appendix-14-plan-rehydration-who-32408338.html)",
      "Rehydration Project — Low osmolarity ORS (WHO/UNICEF bileşimi, 245 mOsm/L) (https://rehydrate.org/ors/low-osmolarity-ors.htm)",
      "Rehydration Project — Homemade ORS (1 L su, 6 silme çay kaşığı şeker, yarım silme çay kaşığı tuz; gözyaşından tuzlu olmamalı) (https://rehydrate.org/solutions/homemade.htm)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WHO ishal bilgi notu (çimdik ≥2 sn, ağır kayıp belirtileri, beslenme, 14 gün, kanlı ishal), MSF Ek 5 (10–13 kg 800 ml, ≥50 kg 4000 ml) ve Ek 14 (75 ml/kg, Plan A miktarları, kusma), ev tarifi ve tuz uyarısı (rehydrate.org), WHO düşük ozmolar bileşim (rehydrate.org) okundu. Ayran, ev sıvısı olarak doğrulanamadığı için çıkarıldı. Önceki not: ağır/orta kayıp belirtileri, çimdik ≥2 sn, beslenmeyi sürdürme, 14 gün ve kanlı ishal (WHO); 4 saatlik ORS miktarları: 10–13 kg 800 ml, ≥50 kg 4000 ml, istediği kadar fazlası (MSF); acil belirtiler (NHS). Ev ORS tarifi ana uygulamadaki ishal rehberiyle aynı. Tuzlu ev sıvıları (ayran, çorba) için ayrı kaynak bulunamadı." }
  },
  {
    "id": "sf-hs-atel-degnek",
    "category": "sf-hs-bakim",
    "title": "Uzun süreli atel ve koltuk değneği yapma",
    "tag": "HASTA BAKIMI",
    "summary": "Hastane yoksa kırığı haftalarca tutacak dolgulu bir atel yapıp dolaşımı her gün kontrol edin; yürümek için yükü koltuk altına değil ellere veren bir değnek yapın.",
    "steps": [
      "Atel malzemesi: iki düz tahta, kalın ağaç kabuğu ya da sert karton. Kırığın altındaki ve üstündeki eklemleri de içine alacak uzunlukta olsun.",
      "Ateli pamuk, yün ya da katlanmış bezle kalınca dolgulayın. Bilek, diz, ayak bileği gibi kemik çıkıntılarına ekstra dolgu koyun; yoksa haftalar içinde yara açılır.",
      "Ateli en az iki yerden, kırık hizasının üstünden ve altından bağlayın; düğümleri tahtanın üstünde atın, tenin üstünde değil.",
      "Bağladıktan sonra ve her gün en az 2 kez kontrol edin: parmaklar pembe ve sıcak mı, kişi onları oynatabiliyor mu, uyuşma var mı? Tırnağa bastırıp bırakın; renk 2 saniyede geri gelmeli.",
      "Şişlik, morarma, soğukluk, uyuşma ya da artan ağrı varsa bağları hemen gevşetin. Sıkı atel dokuyu öldürür.",
      "Koltuk değneği için ucu çatallı, sağlam ve kişinin boyuna uygun bir dal bulun. Kişi dik dururken çatal koltuk altının yaklaşık 5 cm (üç parmak) altında kalmalı.",
      "Çatala kalın bez ya da post sarın. Kol yanda sarkarken bilek hizasına gelecek yere bir tutamak bağlayın; tutunca dirsek hafif bükülsün. Alt uca bez ya da lastik sarın ki kaymasın.",
      "Ağırlığı koltuk altına değil ellere verin. Koltuk altına yaslanmak koldaki sinirleri ezer ve kolu uyuşturup güçsüzleştirir.",
      "Yürürken iki değneği birlikte öne koyun, ellere yüklenip sağlam ayağı değneklerin hizasına atın. Kırık ayağa yük vermeyin.",
      "Kemik haftalar içinde kaynar; yetişkinde çoğu kez 6 haftadan uzun sürer. Ağrı ve oynama geçene kadar ateli çıkarmayın, sonra eklemi yavaş yavaş hareket ettirerek güçlendirin."
    ],
    "art": [null, null, "sf-hs-atel-baglama", "sf-hs-atel-kontrol", null, "sf-hs-degnek-olcu", null, null, null, null],
    "dont": [
      "Ateli kırığın tam üstünden sıkıca bağlamayın.",
      "Şekli bozuk kırığı kendiniz çekip düzeltmeye kalkmayın; damar ve sinir zedelenebilir.",
      "Koltuk altına yaslanarak yürümeyin.",
      "Dolgusuz tahtayı haftalarca tene bağlı bırakmayın; basınç yarası açılır."
    ],
    "keywords": [
      "koltuk değneği yapımı",
      "değnek yapmak daldan",
      "atel ne kadar kalmalı",
      "kırık kol bacak uzun süre",
      "hastane yok kırık",
      "atel dolgusu",
      "koltuk degnegi boyu",
      "koltuk altı uyuşuyor değnek",
      "kırık kemik kaynaması"
    ],
    "note": "Kırık şüphesinde ilk müdahale için ana uygulamadaki 'Kırık, çıkık ve burkulma' rehberine bakın. Kırığı yerine oturtmak uzman işidir.",
    "sources": [
      "Physiopedia — Crutches (koltuk altının 5 cm altı) (https://www.physio-pedia.com/Crutches)",
      "Wikipedia — Crutch (koltuk değneği felci) (https://en.wikipedia.org/wiki/Crutch)",
      "Akıl Çantası ana uygulama — Kırık, çıkık ve burkulma rehberi (atel ilkeleri)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: değnek koltuk altının ~5 cm altında, koltuk altına yaslanmama (Physiopedia); koltuk değneği felci (Wikipedia). Tutamak yüksekliği, kılcal dolum 2 sn, yürüyüş biçimi ve 6 haftalık kaynama yaygın bilgidir; ulaşılabilir resmî kaynakla doğrulanamadı (FM 4-25.11'e erişilemedi)." }
  },
  {
    "id": "sf-hs-sedye",
    "category": "sf-hs-bakim",
    "title": "Doğaçlama sedye ve hasta taşıma",
    "tag": "HASTA BAKIMI",
    "summary": "İki sağlam sırık ve bir battaniye ya da birkaç ceketle sedye yapın, önce sağlam biriyle deneyin, hastayı en az iki, tercihen dört kişiyle komutla taşıyın.",
    "steps": [
      "İki sırık bulun: kişiden yaklaşık yarım metre uzun, kol kalınlığında, çürüksüz düz dal ya da boru.",
      "Battaniyeli sedye: battaniyeyi yere serin. Bir sırığı battaniyenin üçte biri hizasına koyup battaniyeyi üstüne katlayın. İkinci sırığı katlanan kenardan biraz içeri koyun ve kalan kenarı onun da üstünden katlayın. Hastanın ağırlığı katları sıkıştırır.",
      "Ceketli sedye: iki ya da üç ceketin önünü kapatın, kollarını içe çevirin ve sırıkları kolların içinden geçirin.",
      "Önce sağlam bir yetişkini yatırıp kaldırarak deneyin. Kayma ya da yırtılma varsa düzeltin.",
      "Hastayı sedyeye kaydırın. Boyun ya da sırt yaralanması şüphesi varsa baş, gövde ve bacakları bir bütün olarak, tek kişinin komutuyla aynı anda çevirin.",
      "Hastayı sedyeye bağlayın ve üstünü örtün; üşümesin.",
      "Kaldırma ve indirmeyi tek kişi komutla yönetsin. Taşıyıcılar dizlerini büküp sırtlarını düz tutsun.",
      "Düz yolda hastanın ayakları önde gitsin. Yokuşta başı yukarı tarafta kalsın.",
      "Uzun yolda sık mola verin ve taşıyıcıları değiştirin. Her molada hastanın nefesini, rengini ve bağlarını kontrol edin."
    ],
    "art": [null, "sf-hs-sedye-battaniye", "sf-hs-sedye-ceket", null, null, null, null, "sf-hs-sedye-yokus", null],
    "dont": [
      "Denenmemiş sedyeyle hasta taşımayın; yırtılırsa hasta düşer.",
      "Omurga yaralanması şüphesi olan kişiyi tek kolundan ya da bacağından sürüklemeyin.",
      "Tek kişiyle sedye taşımaya kalkmayın; en az iki, uzun yolda dört kişi gerekir."
    ],
    "keywords": [
      "sedye nasıl yapılır",
      "battaniyeden sedye",
      "ceketten sedye",
      "yaralı taşıma",
      "hasta nasıl taşınır",
      "doğaçlama sedye",
      "sedye yapimi sirikla",
      "yürüyemeyen hastayı taşımak"
    ],
    "sources": [
      "Wikipedia — Stretcher (iki sırık arası bez, en az iki taşıyıcı) (https://en.wikipedia.org/wiki/Stretcher)",
      "Akıl Çantası ana uygulama — Boyun ve sırt (omurga) yaralanması şüphesi rehberi"
    ],
    "note": "Boyun ya da sırt yaralanması şüphesinde uzman gözetimi olmadan taşımak felce yol açabilir; yalnız başka çare yoksa ve ana uygulamadaki omurga rehberine göre taşıyın.",
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynak bulunamadı, ZAYIF. Yazar notu: basit sedyenin iki sırık arası bez olması ve en az iki taşıyıcı gerekmesi (Wikipedia) teyit edildi. Battaniye katlama, ceketli sedye ve yokuş kuralı askeri ilk yardım el kitaplarındaki (FM 4-25.11) yaygın yöntemlerdir ama erişilemedi; uzman gözden geçirmesi gerekir." }
  },
  {
    "id": "sf-hs-yatalak-hasta",
    "category": "sf-hs-bakim",
    "title": "Yatalak hasta bakımı: yatak yarası ve beslenme",
    "tag": "HASTA BAKIMI",
    "summary": "Yatağa bağlı hastayı 2 saatte bir çevirin, kemik çıkıntılarını her gün kontrol edin, teni temiz ve kuru tutun, oturur hâlde besleyip bol sıvı verin.",
    "steps": [
      "Hastayı en az 2 saatte bir çevirin: sırt üstü, sağ yan, sol yan. Gece de sürdürün; saatleri yazın.",
      "Her gün kemik çıkıntılarını kontrol edin: kuyruk sokumu, kalça, topuk, dirsek, kürek kemiği, ayak bileği. Bastırınca solmayan kızarıklık (koyu tende mor ya da mavimsi), sıcak, sert ya da süngerimsi deri yara başlangıcıdır.",
      "Kızaran bölgeye hiç yük bindirmeyin; hasta o tarafa yatmasın.",
      "Topukları yataktan kaldırın: baldırın altına yastık koyun, topuk boşta kalsın. Yan yatarken dizler ve ayak bilekleri arasına yastık koyun.",
      "Yatağı yumuşak ve kırışıksız yapın: koyun postu, kalın yün döşek ya da saman şilte üstüne gergin, düz bir çarşaf.",
      "Teri, idrarı ve dışkıyı hemen temizleyin. Deriyi ılık suyla yıkayıp hafif bastırarak kurulayın. Islaklık deriyi çabuk yarar.",
      "Beslerken hastayı oturtun ya da sırtını iyice yükseltin; yemekten sonra bir süre dik kalsın. Küçük lokmalar verin, yutmasını bekleyin.",
      "Protein ve sıvıyı eksik etmeyin: yumurta, yoğurt, et suyu, mercimek çorbası ve gün boyu az az su. İdrar açık renkli olmalı.",
      "Eklemleri her gün nazikçe oynatın: kol, bacak, el ve ayak bileklerini bükün ve açın; eklemler kilitlenmesin.",
      "Ağzı ve dişleri her gün temizleyin, hastayla konuşun, gün ışığı alsın. Yara açılır, irinlenir, kötü kokar ya da ateş çıkarsa 'Uzun süreli yara bakımı' rehberini uygulayın."
    ],
    "art": [null, "sf-hs-yatak-baski-noktalari", null, "sf-hs-yatak-topuk", null, null, "sf-hs-yatak-besleme", null, null, null],
    "dont": [
      "Kızarmış bölgeye masaj yapmayın; derin dokuyu daha çok ezer.",
      "Sırt üstü düz yatan hastayı beslemeyin; yemek akciğere kaçabilir.",
      "Islak çarşafı sonraya bırakmayın.",
      "Hastayı çarşafın üstünde sürükleyerek çekmeyin; sürtünme deriyi yırtar."
    ],
    "keywords": [
      "yatak yarası nasıl önlenir",
      "yatalak hasta bakımı",
      "yatak yarasi",
      "hasta kaç saatte bir çevrilir",
      "felçli hasta bakımı evde",
      "bası yarası",
      "yatalak hasta beslenmesi",
      "yaşlı hasta yatağa bağlı",
      "topukta yara yatalak"
    ],
    "sources": [
      "NHS — Pressure ulcers (https://www.nhs.uk/conditions/pressure-sores/)",
      "Physiopedia — Pressure ulcers (2 saatte bir çevirme) (https://www.physio-pedia.com/Pressure_Ulcers)"
    ],
    "note": "Açılmış, derinleşen ya da ateşle birlikte giden yatak yarası uzman bakımı ister; ulaşabildiğiniz bir sağlık çalışanına gösterin.",
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: erken belirtiler, koyu tende renk, riskli bölgeler, beslenme, uyarı belirtileri (NHS); 2 saatte bir çevirme, nem, topuk riski (Physiopedia). Topuk kaldırma, besleme duruşu ve eklem hareketi yaygın hemşirelik uygulamasıdır; ayrıca doğrulanamadı." }
  },
  {
    "id": "sf-hs-gebelik-dogum",
    "category": "sf-hs-bakim",
    "title": "Gebelik ve doğum hazırlığı (uzun dönem)",
    "tag": "HASTA BAKIMI",
    "summary": "Gebeliği baştan izleyin, tehlike işaretlerini bütün aileye öğretin, deneyimli bir yardımcı ve temiz doğum seti hazırlayın, doğumdan sonra kanama ve enfeksiyonu yakından izleyin.",
    "steps": [
      "Topluluktaki deneyimli kişiyi bulun: ebe, hemşire, doktor ya da daha önce doğum yaptırmış biri. Gebeyi ilk aylardan itibaren ona gösterin.",
      "Son adet tarihini yazın; doğum bundan yaklaşık 40 hafta sonradır. Haftaları bir takvimde ya da düğümlü iple sayın.",
      "Gebeyi iyi besleyin: her gün biraz fazla yemek, yumurta, et, baklagil, yeşil yapraklı sebze, süt ürünleri ve bol temiz su. Ağır yük kaldırmasın.",
      "Tehlike işaretlerini ailedeki herkese öğretin: kanama, şiddetli baş ağrısı, bulanık görme, yüzde ve ellerde ani şişlik, midenin üst kısmında ağrı, havale, ateş, bebeğin hareketlerinin azalması, doğum başlamadan su gelmesi.",
      "Temiz doğum seti hazırlayıp kapalı bir kutuda saklayın: sabun, doğumun yapılacağı yere serilecek yaklaşık 1 metrekarelik temiz naylon örtü, yeni bir jilet (yoksa kaynatılmış makas), göbek bağı için kaynatılmış 2 parça temiz kalın ip, kaynatılmış bezler ve havlular, bebek için battaniye ve başlık.",
      "Doğum yerini önceden seçin: ılık, temiz, ışıklı, cereyansız bir oda; yanında kaynatılmış su ve el yıkama yeri.",
      "Doğumdan hemen sonra bebeği kurulayıp annenin çıplak göğsüne yatırın, ikisinin üstünü örtün; emzirmeye en kısa sürede başlayın.",
      "Doğumdan sonraki ilk saatlerde annenin kanamasını sık sık kontrol edin. Kanama bezleri hızla ıslatıyorsa ya da annede baş dönmesi, solukluk, bayılma varsa hayati tehlikedir; hemen en yakın sağlık çalışanına ulaşın.",
      "Göbeği temiz ve kuru tutun, üstüne bir şey sürmeyin. Kızarma, irin ya da kötü koku enfeksiyondur.",
      "Doğumdan sonraki haftalarda izleyin: annede ateş, kötü kokulu akıntı, şiddetli baş ağrısı; bebekte emememe, hareketsizlik, nefes güçlüğü, ateş ya da soğukluk, havale tehlike işaretidir."
    ],
    "art": [null, null, "sf-hs-gebe-beslenme", null, "sf-hs-dogum-seti", null, "sf-hs-dogum-ten-tene", null, null, null],
    "dont": [
      "Göbek kordonuna kül, toprak, yağ ya da hayvan gübresi sürmeyin; yenidoğan tetanozu ölümcüldür.",
      "Doğumu hızlandırmak için karna bastırmayın, gebeyi zamansız ıkındırmayın.",
      "Doğum yapan kadını ve bebeği soğuk, nemli ya da dumanlı yerde bırakmayın.",
      "Gebeye kendi bildiğiniz ilacı ya da bitki karışımını vermeyin.",
      "Doğum yoluna yıkanmamış el, bez, yağ ya da bitki sokmayın; enfeksiyon yapar."
    ],
    "keywords": [
      "doğuma hazırlık",
      "evde doğum hazırlığı",
      "temiz doğum seti",
      "hamilelikte tehlike işaretleri",
      "gebelik takibi doktor yok",
      "lohusa bakımı",
      "doğumdan sonra kanama",
      "yenidoğan göbek bakımı",
      "hamile beslenmesi",
      "ebe yok doğum"
    ],
    "note": "Uzman gözetimi olmadan doğum hayati risk taşır. Topluluğunuzda ebe, hemşire ya da doktor varsa gebeyi ilk aylardan ona bağlayın. Doğum anı için ana uygulamadaki 'Yardım gelmeden doğum başlarsa' rehberine bakın.",
    "sources": [
      "WHO — Maternal mortality fact sheet (https://www.who.int/news-room/fact-sheets/detail/maternal-mortality)",
      "WHO — Newborn mortality fact sheet (https://www.who.int/news-room/fact-sheets/detail/newborn-mortality)",
      "WHO — Pre-eclampsia fact sheet (https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia)",
      "Akıl Çantası ana uygulama — Afette hamileler rehberi",
      "PATH — Clean delivery kits (sabun, ~1 m² naylon, 2 göbek ipi, temiz jilet; WHO'nun 6 temizlik ilkesi) (https://media.path.org/documents/RH_dk_fs.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: PATH temiz doğum seti içeriği ve WHO'nun 6 temizlik ilkesi (doğum yoluna temiz olmayan bir şey sokmama dahil) okundu, set ve yasaklar buna göre düzeltildi; WHO yenidoğan notu (ısı, ten tene, erken emzirme, hijyenik göbek bakımı, tehlike işaretleri) yeniden okundu. Göbeğe klorheksidin konusu uzmana bırakıldı. Önceki not: başlıca ölüm nedenleri (kanama, enfeksiyon, preeklampsi), deneyimli yardımcı, doğum hijyeni (WHO maternal); ısı koruması, ten tene temas, erken emzirme, temiz göbek, yenidoğan tehlike işaretleri (WHO newborn); preeklampsi belirtileri (WHO). Doğum seti içeriği WHO 'temiz doğum' ilkesine dayanır, ayrı belgeye erişilemedi." }
  },
  {
    "id": "sf-hs-karantina",
    "category": "sf-hs-bakim",
    "title": "Salgın sırasında karantina ve hasta ayırma",
    "tag": "HASTA BAKIMI",
    "summary": "Hastayı ayrı ve havadar bir yerde tek bakıcıyla yalıtın, temas edenleri ayrı tutup her gün belirti açısından izleyin, eşya ve atıkları ayırın; bilinmeyen hastalıkta son temastan sonra 21 gün bekleyin.",
    "steps": [
      "İki grup ayırın: hasta olanlar (yalıtım) ve hastayla temas edip henüz belirtisi olmayanlar (karantina). Bu grupları birbirine ve sağlıklılara karıştırmayın.",
      "Hastalara ayrı, kapısı kapanan, penceresi açılabilen bir oda, çadır ya da ev ayırın. Ortak su kaynağından ve mutfaktan uzak olsun.",
      "Tek bir bakıcı seçin: sağlıklı, kronik hastalığı olmayan biri. Yaşlılar, gebeler ve bebekler hastaya yaklaşmasın.",
      "Bakıcı hastanın yanına girerken ağzını ve burnunu bezle kapatsın, mümkünse eldiven ya da ters çevrilmiş poşet giysin; çıkınca ellerini sabunla yıkasın.",
      "Hastanın tabağını, bardağını ve havlusunu ayırın, sıcak sabunlu suyla ayrı yıkayın. Çamaşırını kaynatın.",
      "Kusmuk ve dışkıyı kapaklı bir kovada toplayın, kireç ya da çamaşır suyuyla karıştırıp ayrı bir çukura gömün.",
      "Yalıtım alanının girişine el yıkama yeri koyun; giren çıkan herkes ellerini yıkasın.",
      "Temas edenleri her gün sabah ve akşam kontrol edin: ateş, öksürük, ishal, kusma, döküntü. Belirti çıkan hemen yalıtım bölümüne alınsın.",
      "Hastalığı bilmiyorsanız temas edenleri son temastan sonra en az 21 gün izleyin. Kuluçka süresi Ebola'da 21 güne kadar uzar, kolerada 5 günü geçmez.",
      "Hasta ölürse cenazeye dokunmak en riskli andır; 'Ölüm ve defin' rehberine göre davranın. Kalabalık yemek ve toplantıları salgın bitene kadar erteleyin."
    ],
    "art": ["sf-hs-karantina-plan", "sf-hs-karantina-oda", null, "sf-hs-karantina-bakici", null, null, null, null, null, null],
    "dont": [
      "Hastaya ziyaretçi almayın; sarılma, öpme ve aynı kaptan yemek salgını büyütür.",
      "Ayrılan kişileri dışlamayın, yiyeceksiz bırakmayın; ihtiyaçlarını kapıya bırakın ve uzaktan konuşun.",
      "Belirtisi olan kişiyi saklamayın; bir kişinin gizlediği hastalık bütün topluluğu vurur.",
      "Bakıcıyı sık sık değiştirmeyin; her yeni bakıcı yeni bir temas demektir."
    ],
    "keywords": [
      "karantina nasıl yapılır",
      "salgında hasta ayırma",
      "bulaşıcı hastayı ayırmak",
      "izolasyon evde",
      "karantina süresi kaç gün",
      "salgin karantina",
      "temaslı takibi",
      "hasta bakıcısı korunma",
      "kolera salgını ev"
    ],
    "note": "Resmî sağlık düzeni işliyorsa onun kurallarına uyun. Bu rehber sağlık otoritesine ulaşılamayan durum içindir; uzman gözetimi olmadan ağır bulaşıcı hastalığa bakmak bakıcı için de hayati risktir.",
    "sources": [
      "WHO — Ebola disease fact sheet (kuluçka 2–21 gün, cenaze teması) (https://www.who.int/news-room/fact-sheets/detail/ebola-disease)",
      "WHO — Cholera fact sheet (kuluçka 12 saat–5 gün, cenaze uygulamaları) (https://www.who.int/news-room/fact-sheets/detail/cholera)",
      "CDC — Preventing spread when sick (https://www.cdc.gov/respiratory-viruses/prevention/precautions-when-sick.html)",
      "MSF — Chlorine solutions (dışkı kovası %2, çamaşır %0,05) (https://medicalguidelines.msf.org/en/viewport/CHOL/english/appendix-15-preparation-and-use-of-chlorine-solutions-32409866.html)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; sayılar bilinen değerlerle çelişmiyor. Yazar notu: kuluçka süreleri ve cenaze teması (WHO Ebola, kolera), evde ayrı durma ve maske (CDC), dışkı kovası ve çamaşır için klor (MSF), kireçle dışkı arıtımı (Eawag, kireç rehberi). 21 gün en uzun bilinen kuluçkaya göre tutucu olarak seçildi." }
  },
  {
    "id": "sf-hs-olum-defin",
    "category": "sf-hs-bakim",
    "title": "Ölüm ve defin: hijyen ve saygı",
    "tag": "HASTA BAKIMI",
    "summary": "Ölüyü saygıyla ve kimliğini kaydederek hazırlayın; bulaşıcı hastalık yoksa ceset salgın başlatmaz, varsa çıplak elle dokunmayın; her ölüyü ayrı, su kaynaklarından uzak ve derin bir mezara gömün.",
    "steps": [
      "Ölümü doğrulayın: nefes yok, nabız yok, kişi hiçbir uyarana tepki vermiyor. Emin değilseniz bir süre bekleyip yeniden bakın.",
      "Kimliği kaydedin: adı, yaşı, ölüm tarihi ve yeri, biliniyorsa ölüm nedeni, üstündeki eşyalar. Bir defter tutun; mezarın yerini de yazın. Yakınları bir gün arayacaktır.",
      "Bilinen bir bulaşıcı hastalık yoksa ceset çevreye salgın yaymaz. Yine de eldiven giyin, işiniz bitince ellerinizi sabunla yıkayın.",
      "Kolera, kanlı ishal, kanamalı ateş ya da bilinmeyen bir salgından ölende cesede çıplak elle dokunmayın. Yıkamayı en az kişiyle, eldiven, önlük ve yüz koruyucuyla yapın. Yıkama suyunu ve bezleri tuvalet çukuruna ya da derin bir çukura gömün. Bedeni sıvı sızdırmasın diye naylona sarın; defni ölüm yerine yakın, kısa sürede ve az kişiyle yapın.",
      "Dinî ve ailevi gelenekleri olabildiğince koruyun: yıkama, kefenleme, dua. Salgında öpme ve sarılmayı bırakın; cenaze yemeğini ellerini yıkamış, sağlıklı kişiler hazırlasın.",
      "Mezar yerini seçin: içme suyu kuyusu, pınarı ve deresinden olabildiğince uzak olsun. Tutucu hedef birkaç mezar için en az 200 metre, çok sayıda ölü için 250–350 metredir. Arazi buna hiç izin vermiyorsa kolera gibi bulaşıcı ölümlerde en az 50 metre kalın; hiçbir durumda 30 metreden yakına kazmayın. Yer su kaynağına göre yokuş aşağıda olsun, sel basmasın.",
      "Mezarı en az 1,5 metre derin kazın. Mezarın tabanı yeraltı suyundan en az 2 metre yukarıda kalmalı: kazarken toprak ıslanıyor ya da su sızıyorsa, ya da yakındaki kuyularda su yüzeye 3,5 metreden yakınsa orayı bırakıp daha yüksek, kuru bir yer seçin. Çukuru tamamen doldurup üstüne tümsek yapın ki hayvanlar eşelemesin.",
      "Toplu mezar açmayın. Her ölüyü ayrı mezara, gerekirse yan yana sıralı mezarlara gömün.",
      "Mezarın başına ad, tarih ve kayıt numarası yazılı dayanıklı bir işaret dikin; kaydı ayrıca saklayın.",
      "Cenazeyle uğraşan herkes sonunda sabunla yıkansın, giysilerini yıkasın. Yakınlara yas için zaman ve yer bırakın; çocuklara olanı basit ve dürüst anlatın."
    ],
    "art": [null, "sf-hs-defin-kayit", null, null, null, "sf-hs-defin-yer", "sf-hs-defin-derinlik", null, null, null],
    "dont": [
      "Cesetleri salgın korkusuyla aceleyle toplu mezara atmayın ya da yakmayın; kimlik kaybolur, aileler yıllarca acı çeker.",
      "Mezarı dere yatağına ya da kuyunun yukarısına kazmayın; içme suyu kirlenir.",
      "Bulaşıcı hastalıktan ölen kişinin yıkama suyunu dereye ya da toprağa açıkta dökmeyin.",
      "Ölüyü kimliği kaydedilmeden gömmeyin."
    ],
    "keywords": [
      "ölü nasıl gömülür",
      "defin nasıl yapılır",
      "cenaze hijyeni",
      "mezar kazmak",
      "mezar ne kadar derin olmalı",
      "salgında cenaze yıkama",
      "olu gommek",
      "cenaze kaydı tutmak",
      "ölüden hastalık bulaşır mı"
    ],
    "note": "Türkiye'de olağan koşullarda ölüm resmî makamlara bildirilir, defin izinle ve mezarlıkta yapılır. Bu bilgi yalnız resmî düzenin hiç işlemediği gerçek bir hayatta kalma durumu içindir.",
    "sources": [
      "WHO — Ebola disease fact sheet (cenazede temasla bulaşma, güvenli ve saygın defin) (https://www.who.int/news-room/fact-sheets/detail/ebola-disease)",
      "WHO — Cholera fact sheet (cenaze uygulamalarının değişmesi) (https://www.who.int/news-room/fact-sheets/detail/cholera)",
      "MSF — Chlorine solutions (ceset hazırlığı için %2 klor) (https://medicalguidelines.msf.org/en/viewport/CHOL/english/appendix-15-preparation-and-use-of-chlorine-solutions-32409866.html)",
      "ICRC — Management of dead bodies after disasters, yayın özeti (kimlik kaydı ve saygı) (https://www.icrc.org/en/publication/0880-management-dead-bodies-after-disasters-field-manual-first-responders)",
      "WHO — Risks posed by dead bodies after disasters (salgın riski yok, mezarlık içme suyu kaynağından ≥30 m, taban yeraltı suyundan ≥1,5 m, toplu mezar önerilmez) (https://www.who.int/publications/m/item/risks-posed-by-dead-bodies-after-disasters)",
      "WHO/WEDC — Technical note 8: Disposal of dead bodies (su kaynağından 200/250/350 m, 1,5–3 m derinlik, taban yeraltı suyundan ≥2 m, kolerada az kişiyle ve ölüm yerine yakın defin) (https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-08-disposal-of-dead-bodies.pdf)",
      "WHO — Management of dead bodies: FAQ (salgın riski yalnız bulaşıcı hastalıkta, toplu defin haklı değil) (https://www.who.int/news-room/q-a-detail/management-of-dead-bodies-frequently-asked-question)",
      "Somali WASH Cluster — Funeral and burial recommendations for deaths from AWD/cholera (su kaynağından ≥50 m, bedeni naylona sarma) (https://dev.humanitarianlibrary.org/sites/default/files/2014/02/110910_cholera_burial_guide_wash_somalia.docx)"
    ],
    "reviewed": false,
    "checked": { "date": CHECKED, "note": "Bağımsız doğrulama: WHO TN8 tam metni okundu (200/250/350 m, 1,5–3 m derinlik, taban yeraltı suyundan ≥2 m); WHO 'Risks posed by dead bodies' (≥30 m, ≥1,5 m, salgın riski yok, toplu mezar önerilmez); WHO SSS; Somali kolera defin rehberi (≥50 m). Kaynaklar çeliştiği için en tutucu değer (200 m, 2 m) hedef, 50/30 m mutlak alt sınır yapıldı. Eski 'üstte 1 m toprak' kaynaksızdı, kaldırıldı. ICRC/PAHO el kitabının tam metnine ulaşılamadı." }
  }
];
