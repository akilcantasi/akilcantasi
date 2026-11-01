// Rehber kategorisi: Bebek, yaşlı ve özel ihtiyaç
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "ozel-gruplar",
  "title": "Bebek, yaşlı ve özel ihtiyaç",
  "hint": "Bebek, hamile, yaşlı, engelli, evcil hayvan",
  "art": "cat-ozel-gruplar",
  "color": "#f472b6",
  "order": 12
};

export const GUIDES: Guide[] = [
  {
    "id": "ozel-gruplar-bebek-bakimi",
    "title": "Afette bebek bakımı",
    "tag": "BEBEK",
    "summary": "Bebeği yanınızda, sıcak ve beslenmiş tutun; tehlike işaretlerinde hemen sağlık ekibine götürün.",
    "steps": [
      "Bebeği her an yanınızda tutun. Kucakta ya da kanguruda taşıyın.",
      "Bebeği sıcak tutun: kat kat giydirin, başına bere takın. Bebekler büyüklerden çok daha çabuk üşür.",
      "Ensesine dokunarak kontrol edin. Terliyse bir kat çıkarın, soğuksa bir kat ekleyin.",
      "Emziriyorsanız emzirmeye devam edin. Yalnız anne sütü alan 6 aydan küçük bebeğe ayrıca su vermeyin. İshal olursa daha sık emzirin.",
      "Bebeğe dokunmadan önce ellerinizi sabunla yıkayın. Su yoksa alkollü el temizleyicisi kullanın.",
      "Bezini sık değiştirin. Kirli bezi kapalı bir poşete koyup atın.",
      "Bebeği sırtüstü, düz ve sert bir yüzeyde uyutun. Yanına yastık ve kabarık battaniye koymayın.",
      "Bez, mama, ıslak mendil, yedek kıyafet ve battaniyeyi tek bir çantada toplayın.",
      "Şu işaretlerde hemen sağlık ekibine gidin ya da 112'yi arayın: günde 6'dan az ıslak bez, gözyaşsız ağlama, kuru ağız, çökük bıngıldak, emmeme, aşırı uyku hali, zor nefes.",
      "3 aydan küçük bebekte ateş 38 °C ya da üstüyse beklemeden sağlık ekibine götürün."
    ],
    "art": [
      "ozel-gruplar-bebek-kanguru",
      "ozel-gruplar-bebek-bere",
      "ozel-gruplar-bebek-ense-kontrol",
      null,
      "wash-hands",
      null,
      "ozel-gruplar-bebek-sirtustu-uyku",
      null,
      "ozel-gruplar-bebek-saglik-git",
      null
    ],
    "dont": [
      "Bebeği arabada, çadırda ya da enkaz yakınında bir an bile yalnız bırakmayın.",
      "Kapalı çadırda ya da odada mangal, soba veya jeneratörü bebeğin yanında yakmayın; karbonmonoksit zehirler.",
      "Bebeği yetişkinlerle aynı yumuşak yatakta, yastık ve yorgan arasında uyutmayın.",
      "Bebek üşüdü diye üstünü yüzünü kapatacak kadar örtmeyin."
    ],
    "keywords": [
      "afette bebek bakımı",
      "bebek bakımı",
      "bebek üşüyor",
      "bebek bezi",
      "çadırda bebek",
      "kucak bebeği",
      "yeni doğan bebek afet",
      "bebek ishal oldu",
      "bebek ateşi",
      "bebeğim emmiyor",
      "bebek nasil uyutulur",
      "bebek bakimi deprem",
      "bebek susuz kaldı",
      "bebek çantası"
    ],
    "sources": [
      "UNICEF — Afetlerde bebek ve çocuk bakımı",
      "AAP HealthyChildren — Dehydration (bebekte sıvı kaybı)",
      "AAP — Güvenli uyku önerileri",
      "CDC — Feeding your child safely during a disaster",
      "Hacettepe Üniv. Halk Sağlığı AD — Afette bebek ve çocuk beslenmesi bilgi notu"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Hacettepe Halk Sağlığı afette bebek beslenmesi notu (6 ay su vermeden yalnız anne sütü; ishalde de emzirme), Sağlık Bakanlığı 2023 depremzede bebek açıklaması. #4'e ishalde sık emzirme eklendi. 'Günde 6'dan az ıslak bez' ölçütü Türk kaynağıyla eşleştirilemedi." }
  },
  {
    "id": "ozel-gruplar-bebek-beslenme",
    "title": "Afette emzirme ve bebek beslenmesi",
    "tag": "BEBEK",
    "summary": "Emzirmeye devam edin; mama gerekiyorsa yalnızca güvenli suyla ve temiz bir bardakla hazırlayın.",
    "steps": [
      "Emziriyorsanız emzirmeye devam edin. Afette bebek için en güvenli besin anne sütüdür.",
      "Stres sütün gelişini yavaşlatabilir ama süt üretimi sürer. Sık emzirin; sakin bir köşede, yavaş nefes alarak emzirin.",
      "Kendiniz bol temiz su için ve yemek yiyin. Hastalansanız da çoğu durumda emzirmeye devam edebilirsiniz; sağlık ekibine emzirdiğinizi söyleyin.",
      "Emzirmeyi bırakmış ya da azaltmışsanız sık emzirmek sütü yeniden artırabilir. Bunun için sağlık ekibinden destek isteyin.",
      "Mama gerekiyorsa sağlık ekibine danışın. Önce hazır sıvı mamayı seçin; suya ihtiyaç duymaz.",
      "Toz mamayı 1 dakika fokurdayarak kaynatıp en çok 30 dakika beklettiğiniz sıcak suyla hazırlayın (şişe suyu da kaynatılmalı). Vermeden önce soğutun, bileğinize damlatıp ılık olduğunu kontrol edin.",
      "Mamayı paketteki ölçüye tam uyarak hazırlayın.",
      "Biberon yerine bebeği temiz bir bardaktan yavaş yavaş besleyin. Biberon afette iyi temizlenemez, hastalık bulaştırabilir.",
      "Hazırladığınız mamayı en geç 2 saat içinde verin; beslemeye başladıktan sonra 1 saat içinde bitirin. Bebeğin yarım bıraktığı mamayı saklamayın; atın.",
      "Ellerinizi ve beslenme kaplarını her seferinde sabun ve güvenli suyla yıkayın."
    ],
    "art": [
      "ozel-gruplar-emzirme",
      null,
      null,
      null,
      null,
      "boil-water",
      "ozel-gruplar-mama-olcu",
      "ozel-gruplar-bardakla-besleme",
      null,
      "wash-hands"
    ],
    "dont": [
      "Mamayı sulandırarak ya da fazla koyulaştırarak hazırlamayın; bebeğe zarar verir.",
      "Sel suyu, depo suyu ya da kaynatılmamış musluk suyuyla mama hazırlamayın.",
      "Evde inek sütü, şekerli su ya da çayla yapılmış \"mama\" vermeyin.",
      "Sel suyuna değmiş emzik ve biberon başlığını kullanmayın; atın."
    ],
    "keywords": [
      "emzirme",
      "emziriyorum",
      "anne sütü",
      "sütüm azaldı",
      "sütüm kesildi",
      "bebek maması nasıl hazırlanır",
      "biberon",
      "mama suyu",
      "bebek beslenmesi",
      "bardakla besleme",
      "emzirmek",
      "emzirme deprem",
      "anne sutu stres",
      "bebek mamasi"
    ],
    "sources": [
      "WHO/UNICEF — Acil durumlarda bebek ve küçük çocuk beslenmesi (IFE Operasyonel Rehber)",
      "CDC — Feeding your child safely during a disaster",
      "CDC — Infant feeding in emergencies: sık sorulan sorular ve bardakla besleme",
      "WHO/FAO — Toz bebek mamasının güvenli hazırlanması, saklanması (2007)",
      "Sağlık Bakanlığı — Depremzede bebeklerin beslenmesi açıklaması (Şubat 2023)",
      "IFE Core Group — Acil durumlarda yapay beslenmeye bağımlı bebeklerin desteklenmesi (Türkçe)",
      "Hacettepe Üniv. Halk Sağlığı AD — Afette bebek ve çocuk beslenmesi bilgi notu"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Sağlık Bakanlığı 2023 açıklaması (emzirme geciktirilmez, stresli annede düzenli emzirmeyle süt 72 saatte artar, mama en geç 2 saatte verilir ve 1 saatte tüketilir, sulandırılmaz, artan atılır), IFE Core Group Türkçe (≥70 °C, ~30 dk, biberon tavsiye edilmez), Hacettepe notu. #8 biberon yerine bardak önerisine, #9 Bakanlığın 2 saat/1 saat kuralına çevrildi." }
  },
  {
    "id": "ozel-gruplar-hamile",
    "title": "Afette hamileler",
    "tag": "HAMİLE",
    "summary": "Hamile olduğunuzu sağlık ekiplerine söyleyin, bol temiz su için ve tehlike işaretlerinde hemen 112'yi arayın.",
    "steps": [
      "Hamile olduğunuzu ve kaçıncı ayda olduğunuzu sağlık ekiplerine ve çadır kent görevlilerine söyleyin. Önceki doğumunuz sezaryense bunu da söyleyin.",
      "Şu işaretlerde hemen 112'yi arayın: vajinadan kanama ya da su gelmesi, şiddetli karın ağrısı, düzenli kasılmalar, şiddetli baş ağrısı, görme bozukluğu, nefes darlığı, göğüs ağrısı, bayılma, nöbet (havale).",
      "Bebeğin hareketleri azaldı ya da durduysa beklemeden sağlık ekibine gidin.",
      "Yüzünüzde ya da ellerinizde ani şişlik, bacağınızda ağrılı şişlik ya da kızarıklık, 38 °C ve üstü ateş veya durmayan kusma varsa hemen sağlık ekibine görünün.",
      "Gün boyu bol temiz su için. Düzenli ve az az yiyin.",
      "Doktorun önerdiği ilaç ve vitaminleri kullanmaya devam edin. Yanınızda yoksa sağlık ekibinden isteyin.",
      "Gebelik kartınızı, tahlil ve ultrason kağıtlarınızı su geçirmez bir poşette yanınızda taşıyın.",
      "Ağır yük kaldırmayın. Araçta ya da çadırda uzun süre hareketsiz kalmayın; ara ara kalkıp yürüyün, bacaklarınızı hareket ettirin.",
      "Kapalı çadırda ya da odada mangal, soba veya jeneratör yakmayın; karbonmonoksit sizi ve bebeği zehirler.",
      "Çok kaygılı ya da çökkün hissediyorsanız sağlık ekibine anlatın. Bu yaygındır ve yardım alınabilir."
    ],
    "art": [
      "ozel-gruplar-hamile-bildir",
      "call-112",
      "ozel-gruplar-hamile-bebek-hareket",
      null,
      "ozel-gruplar-hamile-su",
      null,
      "ozel-gruplar-hamile-belgeler",
      null,
      null,
      null
    ],
    "dont": [
      "Kanama, su gelmesi ya da kasılmayı \"geçer\" diye beklemeyin.",
      "Doktora sormadan ilaç bırakmayın ya da yeni ilaç başlamayın.",
      "Enkaz kaldırma, ağır taşıma gibi işlere girmeyin.",
      "Susamayı beklemeyin; su içmeyi ertelemeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "hamileyim",
      "hamile",
      "gebe",
      "gebelik",
      "hamilelikte kanama",
      "bebek hareket etmiyor",
      "karnımdaki bebek",
      "suyum geldi",
      "hamilelik deprem",
      "hamile kadin afet",
      "kasilma",
      "hamileyken"
    ],
    "sources": [
      "CDC — Safety messages for pregnant, postpartum and breastfeeding women during disasters",
      "CDC — Hear Her: gebelikte acil uyarı işaretleri",
      "Sağlık Bakanlığı — Gebelikte tehlike işaretleri",
      "Hacettepe Üniv. Halk Sağlığı AD — Afette üreme sağlığı bilgi notu (gebelikte tehlike işaretleri)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Hacettepe Halk Sağlığı afette üreme sağlığı notu (IAFM 2010 tabanlı tehlike işaretleri listesi; gebeliği ve önceki sezaryeni bildirme). #1'e önceki sezaryen, #2'ye bayılma eklendi. Sağlık Bakanlığı'nın kendi listesi açılamadı." }
  },
  {
    "id": "ozel-gruplar-acil-dogum",
    "title": "Yardım gelmeden doğum başlarsa",
    "tag": "DOĞUM",
    "summary": "112'yi arayıp görevlinin söylediklerini yapın; bebeği asla çekmeyin, doğunca kurulayıp annenin göğsünde sıcak tutun.",
    "steps": [
      "Hemen 112'yi arayın. Telefonu hoparlöre alın ve görevlinin söylediklerini adım adım yapın.",
      "Annenin yanında kalın, sakin konuşun. Ellerinizi yıkayın; varsa eldiven takın.",
      "Annenin altına temiz bir örtü serin; havlu ve battaniyeyi hazır tutun. Anne rahat ettiği pozisyonu seçsin: yarı oturur, yan yatar ya da dizleri üstünde.",
      "Bebek kendiliğinden gelir. Baş çıkınca altından avucunuzla hafifçe destekleyin. Bebeği, başını ya da kordonu asla çekmeyin.",
      "Kordon bebeğin boynuna dolanmışsa parmağınızla gevşetip başının üstünden kaydırın.",
      "Bebek doğunca hemen havluyla kurulayın, ıslak havluyu kuru olanla değiştirin.",
      "Bebeği çıplak olarak annenin çıplak göğsüne yatırın. İkisinin üstünü örtün, bebeğin başını da örtün.",
      "Bebek ağlamıyor ya da nefes almıyorsa sırtını ve ayak tabanlarını ovun. Yine nefes almazsa 112'ye söyleyin ve \"Kalp masajı — bebek\" rehberine geçin.",
      "Kordonu kesmeyin, bağlamayın, çekmeyin. Eş (plasenta) kendiliğinden gelirse bir poşete koyun, bebeğin yanında tutun.",
      "Anneyi emzirmeye teşvik edin. Kanaması çok artarsa, annede baş dönmesi ya da bayılma olursa 112'ye bildirin."
    ],
    "art": [
      "call-112",
      null,
      "ozel-gruplar-dogum-hazirlik",
      "ozel-gruplar-dogum-bas-destek",
      null,
      "ozel-gruplar-dogum-kurulama",
      "ozel-gruplar-ten-tene",
      null,
      "ozel-gruplar-dogum-kordon-kesme",
      null
    ],
    "dont": [
      "Bebeği, başını ya da göbek kordonunu çekmeyin.",
      "112 görevlisi söylemedikçe kordonu kesmeyin ya da bağlamayın.",
      "Anneyi ıkınmaya zorlamayın; vücudu kendi zamanında iter.",
      "Bebeği yıkamayın ve çıplak, ıslak bırakmayın; çabuk üşür."
    ],
    "callEmergency": true,
    "keywords": [
      "doğum başladı",
      "doğum yaptırma",
      "acil doğum",
      "bebek geliyor",
      "doğum sancısı",
      "evde doğum",
      "çadırda doğum",
      "suyu geldi doğuruyor",
      "dogum basladi",
      "göbek kordonu",
      "plasenta",
      "doğuruyor",
      "yolda doğum"
    ],
    "sources": [
      "St John (Yeni Zelanda) — Childbirth in an emergency",
      "St John Ambulance — Assisting during childbirth (ilk yardım bilgi kartı)",
      "WHO — Doğum sonrası ten tene temas ve yenidoğanı sıcak tutma önerileri",
      "ERC 2025 — Yenidoğan resüsitasyonu (kurulama, uyarma)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: aramada Türk resmi (Sağlık Bakanlığı/112/MEB) acil doğum metni bulunamadı; çelişki tespit edilmedi. Önceki St John/ERC 2025 kontrolü geçerli; ebe/kadın doğum uzmanı onayı açık. Değişiklik yok." }
  },
  {
    "id": "ozel-gruplar-yasli",
    "title": "Afette yaşlılar",
    "tag": "YAŞLI",
    "summary": "Yaşlıları yalnız bırakmayın; ilaçlarını, gözlüğünü, işitme cihazını ve yürüteçini yanlarına alın, sık su içirin.",
    "steps": [
      "Yaşlı komşularınızı ve akrabalarınızı arayın ya da kapılarını çalın. Yalnız yaşayanları ilk önce kontrol edin.",
      "Tahliyede ilaçlarını, gözlüğünü, işitme cihazını, bastonunu ya da yürüteçini mutlaka yanına alın.",
      "Kullandığı ilaçların adlarını ve hastalıklarını bir kağıda yazın; cebine koyun.",
      "Susamasa bile sık sık su içirin. Yaşlılarda susuzluk hissi geç gelir.",
      "Soğukta kat kat giydirin, başını örtün. Sıcakta gölgede tutun, ince giydirin.",
      "Yavaş ve açık konuşun. Yüzünüzü ona dönün, söylediklerinizi gerekirse tekrarlayın.",
      "Yolu engelsiz tutun. Gece yürürken el feneri verin; düşmeyi önlemek için kolundan tutun.",
      "Ani şaşkınlık, konuşma bozukluğu, göğüs ağrısı ya da nefes darlığı olursa 112'yi arayın.",
      "Doktorun önerdiği ilaçları kullanmaya devam etmesini sağlayın. İlaç bittiyse sağlık ekibinden isteyin.",
      "Her gün birkaç dakika yanında oturun, sohbet edin. Bakım ya da barınma desteği gerekirse ALO 183'ü arayın (7/24)."
    ],
    "art": [
      "ozel-gruplar-yasli-kapi",
      "ozel-gruplar-yasli-esyalar",
      null,
      "ozel-gruplar-yasli-su",
      null,
      null,
      "ozel-gruplar-yasli-yuruyus",
      "call-112",
      null,
      "ozel-gruplar-yasli-sohbet"
    ],
    "dont": [
      "Yaşlı kişiyi \"evde güvende\" diye tek başına bırakmayın.",
      "Gözlüğünü, işitme cihazını ya da ilacını \"sonra alırız\" diyerek geride bırakmayın.",
      "Ani şaşkınlığı \"yaşlılıktan\" sanmayın; susuzluk, enfeksiyon ya da inme olabilir."
    ],
    "callEmergency": true,
    "keywords": [
      "yaşlı",
      "yaşlılar",
      "yaşlı annem",
      "yaşlı babam",
      "dede",
      "nine",
      "babaanne",
      "anneanne",
      "yasli bakimi deprem",
      "yaşlı komşu",
      "yaşlı kişi tahliye",
      "yürüteç",
      "işitme cihazı"
    ],
    "sources": [
      "Ready.gov (FEMA) — Older adults",
      "AFAD — Afete hazırlık: özel ihtiyaçlı bireyler",
      "CDC — Managing chronic conditions after a natural disaster",
      "Aile ve Sosyal Hizmetler Bakanlığı — ALO 183 sık sorulan sorular (yaşlı ve engelli hizmetleri, 7/24)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB ALO 183 SSS (aile, kadın, çocuk, engelli, yaşlıya 7/24 rehberlik). AFAD'ın yaşlılara özel metni açılamadı; çelişki yok. #10'a ALO 183 yönlendirmesi eklendi." }
  },
  {
    "id": "ozel-gruplar-engelli-hareket",
    "title": "Tekerlekli sandalye ve hareket engeli",
    "tag": "ENGELLİ",
    "summary": "Depremde tekerlekleri kilitleyip başınızı koruyun; tahliyede kişiye nasıl taşınmak istediğini sorun.",
    "steps": [
      "Deprem anında tekerlekli sandalyedeyseniz tekerlekleri kilitleyin. Öne eğilip başınızı ve ensenizi kollarınızla koruyun.",
      "Kendinizi sandalyeden yere atmayın. Pencere, raf ve asılı eşyalardan uzak durun.",
      "Sarsıntı bitince çıkış yolunu kontrol edin. Tek başınıza çıkamıyorsanız düdük çalın ya da seslenin.",
      "Yardım ederken önce sorun: \"Size nasıl yardım edeyim?\" Kişi kendi bedenini en iyi bilir.",
      "Tekerlekli sandalyeyi kolçak ya da ayaklıktan tutup kaldırmayın; kişinin söylediği yerden tutun.",
      "Asansör kullanmayın. Merdivende taşımak gerekirse en az 2 kişi olun.",
      "Sandalyeyi, bastonu, koltuk değneğini ve şarj aletini kişiyle birlikte götürün. Bunlar onun bacaklarıdır.",
      "Toplanma alanında ve çadır kentte görevlilere engel durumunu söyleyin; erişilebilir tuvalet ve çadır isteyin.",
      "Bakım, barınma ya da yardımcı cihaz desteği için ALO 183'ü arayın (7/24). Hayati tehlikede 112'yi arayın."
    ],
    "art": [
      "ozel-gruplar-sandalye-kilitle",
      null,
      "ozel-gruplar-sandalye-duduk",
      "ozel-gruplar-sandalye-sor",
      null,
      "ozel-gruplar-sandalye-merdiven",
      "ozel-gruplar-sandalye-esya",
      null,
      null
    ],
    "dont": [
      "Kişiye sormadan onu ya da sandalyesini kaldırmayın.",
      "Tekerlekli sandalyeyi ve yardımcı cihazları geride bırakmayın.",
      "Yangında ya da depremden sonra asansöre binmeyin."
    ],
    "keywords": [
      "tekerlekli sandalye",
      "tekerlekli sandalyede deprem",
      "bedensel engelli",
      "ortopedik engelli",
      "yürüyemiyor",
      "felçli",
      "yatalak",
      "yatalak hasta",
      "engelli tahliye",
      "koltuk değneği",
      "tekerlekli sandalye merdiven",
      "hareket engelli"
    ],
    "sources": [
      "Great ShakeOut — Drop, Cover, Hold On (tekerlekli sandalye ve yürüteç kullananlar)",
      "Earthquake Country Alliance — Step 5 / engelli bireyler için deprem güvenliği",
      "İstanbul Proje Koordinasyon Birimi (İPKB) — Afetlerde engelli bireyler broşürü",
      "Aile ve Sosyal Hizmetler Bakanlığı — ALO 183 sık sorulan sorular"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: İPKB afette engelli bireyler broşürü (sandalyeden yere atlamayın, tekerlekleri kilitleyin, başı kollarla koruyun — mevcut metinle uyumlu), ASHB ALO 183 SSS. #9 ALO 183/112 yönlendirmesi eklendi (art null)." }
  },
  {
    "id": "ozel-gruplar-engelli-gorme-isitme",
    "title": "Görme ve işitme engelli kişiler",
    "tag": "ENGELLİ",
    "summary": "Görme engelliye kolunuzu uzatıp yolu sesle anlatın; işitme engelliye yüzünüzü dönüp yazarak ya da işaretle anlatın.",
    "steps": [
      "Görme engelli kişiye önce kendinizi tanıtın: \"Ben Ali, yardım etmek istiyorum.\"",
      "Dirseğinizi uzatın; kişi kolunuzdan tutsun. Yarım adım önünde yürüyün.",
      "Yolu sesle anlatın: \"3 basamak iniyoruz\", \"solda enkaz var\". Basamakta durun, haber verin.",
      "Bastonunu ve rehber köpeğini yanından ayırmayın. Ayrılırken mutlaka söyleyin.",
      "İşitme engelli kişinin dikkatini omzuna hafifçe dokunarak ya da elinizi sallayarak çekin.",
      "Yüzünüzü ona dönün, ağzınızı kapatmadan yavaş konuşun. Bağırmayın.",
      "Anlaşamazsanız kağıda ya da telefona kısa yazın: \"Bina hasarlı. Benimle gel.\"",
      "Duyuru ve anonsları yazılı olarak ya da işaret diliyle iletin. Çadır kentte görevlilere işitme engelini söyleyin.",
      "İşitme engelli kişinin yanında düdük olsun; enkaz altında kalırsa sesini bu şekilde duyurur.",
      "İşitme engelliyseniz Sağlık Bakanlığı'nın ESİM uygulamasını önceden kurun; 112'ye yazarak ya da görüntülü işaret diliyle ulaşabilirsiniz."
    ],
    "art": [
      null,
      "ozel-gruplar-gorme-rehberlik",
      "ozel-gruplar-gorme-basamak",
      null,
      "ozel-gruplar-isitme-dikkat",
      null,
      "ozel-gruplar-isitme-yazma",
      null,
      "ozel-gruplar-isitme-duduk",
      null
    ],
    "dont": [
      "Görme engelli kişiyi kolundan ya da bastonundan çekiştirmeyin.",
      "Rehber köpeği okşamayın, beslemeyin; çalışıyordur.",
      "İşitme engelli kişinin arkasından seslenip yanıt vermedi diye bırakıp gitmeyin."
    ],
    "keywords": [
      "görme engelli",
      "kör",
      "görmüyor",
      "işitme engelli",
      "sağır",
      "duymuyor",
      "işaret dili",
      "beyaz baston",
      "rehber köpek",
      "gorme engelli deprem",
      "isitme engelli afet",
      "işitme kaybı"
    ],
    "sources": [
      "RNID — Communication tips (yüzünü dön, el salla, ağzını kapatma, yaz)",
      "NHS — Hearing loss (yüzüne bakarak, yavaş ve net konuş, gerekirse yaz)",
      "İstanbul Proje Koordinasyon Birimi (İPKB) — Afetlerde engelli bireyler broşürü (işitme engelliye düdük, görevlilere bildirme)",
      "Aile ve Sosyal Hizmetler Bakanlığı SSS — İşitme engellilerin acil sağlık hizmetine erişimi (ESİM)",
      "Wisconsin DHS — Sighted guide techniques (kişi rehberin yarım adım arkasında, kolundan tutar)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: İPKB engelli broşürü (işitme engelliye düdük, tercüman/cihaz, görevliye bildirme — uyumlu), ASHB SSS (ESİM uygulamasıyla 112'ye görüntülü/mesajla ihbar), Wisconsin DHS sighted guide (yarım adım önde yürüme teyit edildi). #10 ESİM adımı eklendi (art null)." }
  },
  {
    "id": "ozel-gruplar-engelli-zihinsel",
    "title": "Otizm, zihinsel engel, demans ve Alzheimer",
    "tag": "ENGELLİ",
    "summary": "Kişiyi tanıdık biriyle birlikte tutun, kısa ve sakin cümlelerle konuşun, üzerinde kimlik ve iletişim bilgisi olsun.",
    "steps": [
      "Kişiyi tanıdığı biriyle birlikte tutun. Kalabalıkta elini bırakmayın.",
      "Bileğine ya da giysisine adı, sizin telefonunuz ve özel durumu yazılı bir kart takın. Telefonunuzda yakın tarihli bir fotoğrafı olsun.",
      "Kısa ve sakin cümleler kurun. Her seferinde tek bir şey söyleyin: \"Ayakkabını giy.\"",
      "Ne olacağını önceden basitçe anlatın: \"Şimdi dışarı çıkıyoruz. Sonra çadıra gideceğiz.\"",
      "Gürültüden ve kalabalıktan uzak, sakin bir köşe bulun. Kulaklık ya da şapka işe yarayabilir.",
      "Sevdiği bir oyuncağı, battaniyesi ya da tanıdık bir eşyası yanında olsun.",
      "Yemek, uyku ve ilaç saatlerini olabildiğince her gün aynı tutun.",
      "Kişi kaybolursa hemen yakın çevreyi arayın. 15 dakikada bulamazsanız 112'yi arayın; demans ya da otizm olduğunu söyleyin, fotoğrafını gösterin.",
      "Tek başına dolaşan, kaybolmuş görünen birini bulursanız yanında kalın, güvenli yere götürün ve görevlilere teslim edin.",
      "Görevlilere ve sağlık ekibine kişinin özel durumunu ve kullandığı ilaçları söyleyin."
    ],
    "art": [
      "ozel-gruplar-zihinsel-el-ele",
      "ozel-gruplar-kimlik-bileklik",
      null,
      null,
      "ozel-gruplar-zihinsel-sakin-kose",
      null,
      null,
      null,
      "ozel-gruplar-kayip-teslim",
      null
    ],
    "dont": [
      "Bağırmayın, aceleye getirmeyin, sert hareketle çekmeyin.",
      "Kişiyi kalabalık içinde bir an bile yalnız bırakmayın; kaybolabilir.",
      "Öfke nöbetini ya da tekrar eden hareketleri cezalandırmayın; korkunun belirtisidir."
    ],
    "keywords": [
      "otizm",
      "otizmli çocuk",
      "otistik",
      "zihinsel engelli",
      "down sendromu",
      "demans",
      "alzheimer",
      "alzheimer hastası",
      "unutkan yaşlı",
      "kaybolan yaşlı",
      "özel gereksinimli",
      "ozel gereksinimli cocuk",
      "otizm deprem"
    ],
    "sources": [
      "Alzheimer's Association — Wandering (kalabalıktan kaçın, hemen ara, 15 dakikada bulunmazsa acil çağrı, güncel fotoğraf)",
      "NHS — Communicating with someone with dementia (kısa cümle, sakin, basit seçenek)",
      "İstanbul Proje Koordinasyon Birimi (İPKB) — Afetlerde engelli bireyler broşürü (zihinsel engelli ve OSB: künye, kişisel afet planı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: İPKB afette engelli bireyler broşürü (OSB/zihinsel engelliye künye, kişisel afet planı, tahliyede destek ağı ve görevliler) — mevcut metinle uyumlu. Değişiklik yok." }
  },
  {
    "id": "ozel-gruplar-kronik-hastalik",
    "title": "Kronik hastalık ve ilaçlar (şeker, kalp, diyaliz)",
    "tag": "KRONİK HASTA",
    "summary": "İlaçlarınızı ve hastalık bilginizi yanınıza alın, kurtarma ekibine hastalığınızı söyleyin, ilacı kendi kendinize bırakmayın.",
    "steps": [
      "Tahliyede ilaçlarınızı, ölçüm cihazınızı ve reçetenizi ilk iş yanınıza alın.",
      "Hastalığınızı, ilaçlarınızın adlarını, alerjilerinizi ve doktorunuzun adını bir kağıda yazın; cebinizde taşıyın.",
      "Kurtarma ve sağlık ekibine hemen söyleyin: \"Şeker hastasıyım, insülin kullanıyorum\", \"Diyalize giriyorum\", \"Kalp hastasıyım\".",
      "Doktorun önerdiği ilaçları kullanmaya devam edin. İlacınız biterse ya da kaybolursa sağlık ekibinden isteyin.",
      "İnsülini serin ve gölgede tutun. Dondurmayın, güneşte bırakmayın. Buz kullanıyorsanız insüline doğrudan değdirmeyin.",
      "Şeker hastasıysanız şekerinizi sık ölçün. Titreme, terleme, baş dönmesi olursa hemen 3–4 küp şeker ya da küçük bir bardak (yaklaşık 150 ml) meyve suyu alın; 15 dakika sonra yeniden ölçün.",
      "Diyalize giriyorsanız en yakın çalışan diyaliz merkezini sağlık ekibine sorun. Son seansınızdan sonra en geç 3 gün içinde diyalize girmeye çalışın.",
      "Diyalize girene kadar merkezinizin verdiği acil diyete uyun: tuzu, sıvıyı ve muz, portakal, patates, domates gibi potasyumlu yiyecekleri azaltın. Bu diyet diyalizin yerini tutmaz.",
      "Göğüs ağrısı, nefes darlığı, yüzde kayma, kolda güçsüzlük ya da konuşma bozukluğu olursa hemen 112'yi arayın.",
      "Oksijen cihazı ya da elektrikli tıbbi cihaz kullanıyorsanız görevlilere söyleyin; elektriği olan bir yere öncelik isteyin."
    ],
    "art": [
      "ozel-gruplar-ilac-canta",
      "ozel-gruplar-saglik-karti",
      "ozel-gruplar-kurtarmaya-soyle",
      null,
      "ozel-gruplar-insulin-serin",
      null,
      null,
      null,
      "call-112",
      null
    ],
    "dont": [
      "İlacınızı doktora sormadan bırakmayın, dozunu kendiniz değiştirmeyin.",
      "Başkasının ilacını kullanmayın.",
      "Donmuş ya da güneşte çok ısınmış insülini kullanmayın; yenisini isteyin.",
      "Diyalize giriyorsanız bol su ve meyve suyu içmeyin.",
      "Bilinci bulanık ya da yutamayan şeker hastasının ağzına yiyecek, içecek vermeyin; 112'yi arayın."
    ],
    "callEmergency": true,
    "keywords": [
      "şeker hastası",
      "diyabet",
      "insülin",
      "insulin buzdolabı",
      "diyaliz",
      "böbrek hastası",
      "kalp hastası",
      "tansiyon ilacı",
      "ilacım bitti",
      "ilaç kesintisi",
      "kronik hastalık",
      "seker hastasi deprem",
      "oksijen cihazı",
      "ilacimi kaybettim"
    ],
    "sources": [
      "FDA — Information regarding insulin storage and switching between products in an emergency",
      "KCER (ESRD NCC/IPRO) — 3-Day Emergency Diet (2025)",
      "National Kidney Foundation — Potassium in your CKD diet",
      "NHS — Low blood sugar (hypoglycaemia)",
      "NHS — Stroke symptoms (FAST)",
      "CDC — Treatment of low blood sugar (15-15 kuralı)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türk resmi kronik hasta/diyaliz afet metni bulunamadı; CDC 15-15 kuralı ile ilk-yardim-seker-dusmesi rehberindeki miktarlar teyit edildi. #6 miktar eklenerek o rehberle birleştirildi (3–4 küp şeker / ~150 ml meyve suyu). Diyaliz 3 gün ve potasyum maddeleri nefrolog onayı bekliyor." }
  },
  {
    "id": "ozel-gruplar-evcil-hayvan",
    "title": "Afette evcil hayvanlar",
    "tag": "EVCİL HAYVAN",
    "summary": "Evcil hayvanınızı geride bırakmayın; tasma ya da taşıma kafesiyle, mama, su ve aşı kartıyla birlikte götürün.",
    "steps": [
      "Tahliye ederken evcil hayvanınızı yanınıza alın. Geride kalan hayvanlar yaralanır ya da kaybolur.",
      "Köpeği tasmayla, kediyi ve küçük hayvanları taşıma kafesinde götürün. Korkan hayvan kaçabilir.",
      "Kafese hayvanın adını ve telefon numaranızı yazın. Tasmasında künye olsun; mikroçipi varsa kayıttaki telefonunuz güncel olsun.",
      "En az 3 günlük mama, su, kap, ilaç, aşı kartı ve hayvanın bir fotoğrafını bir çantada toplayın.",
      "Toplanma alanında ve çadır kentte görevlilere evcil hayvanınız olduğunu söyleyin; hayvanların kalabileceği yeri sorun.",
      "Afetten sonra hayvanı dışarıda tasmalı tutun. Tanıdık kokular kaybolduğu için yolunu bulamayabilir.",
      "Korkmuş hayvana yavaş yaklaşın. Isırabilir; yüzünüzü yaklaştırmayın.",
      "Hayvana dokunduktan sonra ellerinizi yıkayın. Sel suyundan içmesine izin vermeyin.",
      "Hayvanınız kaybolursa belediye hayvan barınağına, veteriner hekimlere ve çevredekilere fotoğrafını gösterin."
    ],
    "art": [
      "ozel-gruplar-evcil-tahliye",
      "ozel-gruplar-evcil-kafes",
      "ozel-gruplar-evcil-kunye",
      "ozel-gruplar-evcil-canta",
      null,
      null,
      null,
      "wash-hands",
      null
    ],
    "dont": [
      "Hayvanı zincirle bağlı ya da kapalı evde bırakıp gitmeyin.",
      "Hayvanı kurtarmak için hasarlı binaya geri girmeyin; kurtarma ekiplerine söyleyin.",
      "Korkmuş, yaralı hayvanı kucağınıza bastırmayın; ısırabilir.",
      "Sarsıntı sırasında hayvanın peşinden koşmayın; önce kendinizi koruyun."
    ],
    "keywords": [
      "evcil hayvan",
      "kedim",
      "afette evcil hayvanlar",
      "kedim kayboldu",
      "köpeğim kayboldu",
      "köpeğim",
      "kedi deprem",
      "köpek tahliye",
      "kuşum",
      "taşıma kafesi",
      "kedi maması",
      "kayıp kedi",
      "kayıp köpek",
      "evcil hayvanimi kaybettim",
      "hayvan çadır kent"
    ],
    "sources": [
      "CDC — Pet safety in emergencies",
      "AVMA — Pets and disasters (3-7 günlük mama, en az 7 günlük su, kimlik, fotoğraf)",
      "American Red Cross — Pet disaster preparedness",
      "AFAD deprem çantası önerisi (DonanımHaber aktarımı: evcil hayvan için mama, su, ilaç; ilk 72 saat)",
      "Habertürk — Deprem anında evcil hayvanı olanlar ne yapmalı? (10.02.2023)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: AFAD deprem çantası önerisi haber aktarımı (evcil hayvan için mama, su, ilaç; 72 saat — '3 günlük' ile uyumlu), Habertürk uzman önerileri (önce kendi güvenliğiniz, peşinden koşmayın, zorla sürüklemeyin). 'Dont'a sarsıntıda peşinden koşmama eklendi." }
  }
];
