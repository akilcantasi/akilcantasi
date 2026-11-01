// Rehber kategorisi: İlk yardım
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "ilk-yardim",
  "title": "Hayati ilk yardım",
  "hint": "Kalp masajı, kanama, boğulma, şok",
  "art": "cat-ilk-yardim",
  "color": "#ef5350",
  "order": 1
};

const CHECKED = '2026-11-01';

export const GUIDES: Guide[] = [
  {
    "id": "ilk-yardim-ilk-degerlendirme",
    "title": "Yaralıya ilk bakış: önce ne yapılır?",
    "tag": "İLK YARDIM",
    "summary": "Önce kendi güvenliğinizi sağlayın, sonra yanıt ve nefese bakıp 112'yi arayın; hayati kanamayı hemen durdurun.",
    "steps": [
      "Durun ve çevreye bakın: trafik, yangın, gaz, elektrik ya da çökme tehlikesi var mı? Güvenli değilse yaklaşmayın.",
      "Kişinin omzuna dokunup yüksek sesle seslenin: yanıt veriyor mu?",
      "Fışkıran ya da hızla akan bir kanama varsa hemen üzerine sert bastırın.",
      "112'yi arayın. Yerinizi, kaç yaralı olduğunu ve durumlarını kısaca söyleyin.",
      "Yanıt vermiyorsa başını geriye itip çenesini kaldırın. En fazla 10 saniye bakın: normal nefes alıyor mu?",
      "Normal nefes almıyorsa hemen kalp masajına başlayın.",
      "Nefes alıyor ama yanıt vermiyorsa yan yatırın (derlenme pozisyonu). Boyun ya da sırt yaralanması şüphesi varsa gerekmedikçe kıpırdatmayın.",
      "Yanıt veriyorsa nerede ağrısı olduğunu sorun. Olduğu yerde, rahat ettiği şekilde kalsın.",
      "Üstünü örtüp sıcak tutun. Sağlık ekibi gelene kadar yanında kalın."
    ],
    "dont": [
      "Tehlike sürerken yaralının yanına koşmayın; ikinci yaralı siz olmayın.",
      "Yangın ya da çökme gibi zorunlu bir tehlike yoksa yaralıyı yerinden kaldırmayın.",
      "Yaralıya yiyecek ya da içecek vermeyin.",
      "Yaralıyı oturmaya ya da ayağa kalkmaya zorlamayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "yaralıya ilk ne yapılır",
      "ilk yardım sırası",
      "olay yeri güvenliği",
      "yaralı buldum",
      "yerde yatan biri",
      "yerde yatiyor",
      "ilk değerlendirme",
      "yaralı değerlendirme",
      "abc ilk yardım",
      "nereden başlamalı",
      "birden fazla yaralı"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (ERC 2025 uyarlaması)",
      "Resuscitation Council UK — 2025 Adult BLS Guidelines",
      "St John Ambulance — Recovery position"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: RCUK 2025 First Aid (güvenlik, yanıt, hayati kanama, ABCDE; travma/hırıltılı solukta yan yatırmama), RCUK 2025 Adult BLS (≤10 sn nefes kontrolü), St John Ambulance." },
    "art": [
      "ilk-yardim-olay-yeri-guvenlik",
      "ilk-yardim-omuz-seslen",
      "ilk-yardim-kanama-bastir",
      null,
      "ilk-yardim-bas-geri-cene",
      "ilk-yardim-kpr-yetiskin",
      "ilk-yardim-derlenme-sonuc",
      null,
      null
    ]
  },
  {
    "id": "kanama",
    "title": "Ciddi kanama",
    "tag": "İLK YARDIM",
    "summary": "Yaranın üzerine temiz bir bezle sert ve kesintisiz bastırarak kanamayı durdurun.",
    "steps": [
      "Yaranın üzerine temiz bir bez ya da varsa kanama durdurucu (hemostatik) gazlı bez koyun. Avucunuzla hemen sert ve kesintisiz bastırın.",
      "Birine 112'yi aratın. Yalnızsanız telefonu hoparlöre alıp bastırmaya devam ederek arayın.",
      "Kan bezden sızarsa bezi kaldırmayın. Üzerine yeni bez ekleyip daha sert bastırın.",
      "Kasık ya da koltuk altındaki derin yarada bezi yaranın içine sıkıca doldurun, üzerinden sert bastırın.",
      "Kol ya da bacaktaki hayati kanama baskıyla durmuyorsa ve turnike varsa: yaranın 5–7 cm (yaklaşık bir avuç) üstüne takın; eklemin üstüne takmayın.",
      "Turnikeyi kanama durana kadar sıkın. Takıldığı saati not edin, mümkünse kişinin alnına yazın.",
      "Turnikeyi gevşetmeyin, çıkarmayın; bunu sağlık ekibi yapar.",
      "Kanama durunca bezi bandajla sıkıca sarın. Parmaklar morarır ya da uyuşursa sargıyı biraz gevşetin.",
      "Yaralıyı sırtüstü yatırıp üstünü örtün. Yanında kalıp bilincini ve nefesini izleyin."
    ],
    "dont": [
      "Eldiven aramak için baskıyı geciktirmeyin; varsa eldiven ya da temiz poşet kullanın.",
      "Yaraya batmış cismi çıkarmayın; cismin etrafından bastırın.",
      "Yaraya kahve, tütün, toz ya da başka bir şey koymayın.",
      "Kanama durdu mu diye bezi sık sık kaldırmayın.",
      "İnce ip ya da telle turnike yapmayın. Gerçek turnike yoksa sert baskıya devam edin; 112 görevlisi kemer ya da üçgen sargıyla turnike isterse onun talimatına uyun."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "kanama",
      "kanıyor",
      "kan",
      "kan kaybı",
      "kan durmuyor",
      "kesik",
      "derin yara",
      "turnike",
      "bandaj",
      "bastırma",
      "kan fışkırıyor",
      "kan akiyor",
      "kanamayı durdurma",
      "atardamar kesildi"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (ERC 2025 uyarlaması)",
      "St John Ambulance — Severe bleeding",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)",
      "Bilecik Şeyh Edebali Üniversitesi — Kanamalar ders sunumu"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (ilk bez kaldırılmadan üstüne ikinci bez; turnike yaranın 5–7 cm üstü, eklem üstüne değil; saat-dakika not; tıbbi yardım gelene kadar gevşetilmez), Bilecik Üniv. kanamalar sunumu (ıslanan bez kaldırılmaz; turnike sağlık ekibi gelene kadar gevşetilmez), RCUK 2025 First Aid. Değişiklik yok; eski SB 2011 kitabındaki '15–20 dk'da bir gevşet' bilgisi güncel Türk müfredatında yok." },
    "art": [
      "ilk-yardim-kanama-bastir",
      null,
      "ilk-yardim-kanama-bez-ekle",
      null,
      "ilk-yardim-turnike-tak",
      "ilk-yardim-turnike-saat",
      null,
      "ilk-yardim-kanama-sargi",
      "ilk-yardim-kanama-ortu"
    ]
  },
  {
    "id": "temel-yasam-destegi",
    "title": "Temel yaşam desteği (kalp masajı) — yetişkin",
    "tag": "İLK YARDIM",
    "summary": "Yanıt vermeyen ve normal nefes almayan kişide 112'yi arayıp hemen göğüs basısına başlayın.",
    "steps": [
      "Ortam güvenli mi bakın. Kişinin omuzlarına dokunup yüksek sesle \"İyi misiniz?\" diye seslenin.",
      "Yanıt yoksa yardım için bağırın. 112'yi arayın ve telefonu hoparlöre alın.",
      "Başını geriye itip çenesini yukarı kaldırın. En fazla 10 saniye bakın, dinleyin, hissedin: normal nefes alıyor mu?",
      "Normal nefes yoksa ya da emin değilseniz kalbi durmuş kabul edin. Ara ara hırıltılı, iç çeker gibi soluk normal nefes değildir.",
      "Biri varsa otomatik defibrilatör (OED) getirmeye gönderin. Yalnızsanız OED aramaya gitmeyin, hemen basıya başlayın.",
      "Kişiyi sert zemine sırtüstü yatırın. Bir elinizin topuğunu göğsün ortasına (göğüs kemiğinin alt yarısı) koyun, diğer elinizi üstüne koyup parmaklarınızı kenetleyin.",
      "Kollarınız dümdüz, omuzlarınız ellerinizin tam üstünde olsun. Dakikada 100–120 hızla, 5–6 cm derinlikte bastırın; her basıdan sonra göğüs tamamen geri gelsin.",
      "Eğitimliyseniz 30 basıdan sonra 2 kurtarıcı nefes verin. Eğitimli değilseniz ya da nefes vermek istemiyorsanız ara vermeden yalnızca bası yapın.",
      "OED gelince hemen açın ve sesli talimatlara uyun.",
      "Sağlık ekibi gelene ya da kişi uyanıp normal nefes alana kadar durmayın. Yanınızda biri varsa 2 dakikada bir yer değiştirin."
    ],
    "dont": [
      "Basılar arasında 10 saniyeden uzun ara vermeyin.",
      "\"Kaburga kırılır\" korkusuyla basıyı yavaşlatmayın, bırakmayın.",
      "Kişiyi yatak gibi yumuşak bir zeminde bırakmayın; mümkünse sert zemine alın.",
      "Normal nefes alan birine göğüs basısı yapmayın; derlenme pozisyonuna alın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "kalp masajı",
      "kalp masaji",
      "cpr",
      "kpr",
      "temel yaşam desteği",
      "tyd",
      "kalp durması",
      "kalbi durdu",
      "nefes almıyor",
      "nefesi yok",
      "bayıldı nefes yok",
      "göğüs basısı",
      "suni teneffüs",
      "kurtarıcı nefes",
      "ölüyor",
      "yanıt vermiyor",
      "canlandırma",
      "yere yığıldı"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 Adult BLS Guidelines (ERC 2025 uyarlaması)",
      "St John Ambulance — CPR",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (solunum kontrolü en fazla 10 sn; sternumun alt yarısı; en az 5, en fazla 6 cm; 100–120/dk; 30:2; pedler çıplak göğse), RCUK 2025 Adult BLS, St John. Değişiklik yok." },
    "art": [
      "ilk-yardim-omuz-seslen",
      null,
      "ilk-yardim-bas-geri-cene",
      null,
      null,
      "ilk-yardim-kpr-el-yeri",
      "ilk-yardim-kpr-yetiskin",
      "ilk-yardim-kurtarici-nefes",
      "ilk-yardim-oed-ac",
      null
    ]
  },
  {
    "id": "ilk-yardim-cocuk-kpr",
    "title": "Kalp masajı — çocuk (1 yaş – ergenlik)",
    "tag": "İLK YARDIM",
    "summary": "Yanıt vermeyen ve normal nefes almayan çocukta 112'yi arayın, 5 kurtarıcı nefesle başlayıp göğüs basısı ve nefesi sürdürün.",
    "steps": [
      "Ortam güvenli mi bakın. Çocuğa dokunup yüksek sesle seslenin.",
      "Yanıt yoksa yardım için bağırın, 112'yi arayıp hoparlörü açın. Telefon yoksa önce 1 dakika canlandırma yapın, sonra yardım çağırın.",
      "Başını hafifçe geriye itip çenesini kaldırın. En fazla 10 saniye bakın: normal nefes alıyor mu?",
      "Normal nefes yoksa 5 kurtarıcı nefes verin: burnunu sıkıp ağzını ağzınızla kapatın, her nefeste göğsün kalktığını görün.",
      "Bir elinizin topuğunu göğüs kemiğinin alt yarısına koyun. Büyük çocukta iki elinizi üst üste koyabilirsiniz.",
      "Kolunuz dümdüz olsun. Göğsü üçte bir oranında (yaklaşık 5 cm) çökertecek kadar, dakikada 100–120 hızla bastırın.",
      "30 basıdan sonra 2 nefes verin. Çocuk ilk yardım eğitimi aldıysanız 15 bası, 2 nefes uygulayın.",
      "Nefes veremiyorsanız ya da vermek istemiyorsanız ara vermeden yalnızca bası yapın; hiçbir şey yapmamaktan iyidir.",
      "OED gelince açın, talimatlara uyun. 8 yaşından (25 kg) küçük çocukta varsa çocuk pedini ya da çocuk modunu kullanın; yoksa yetişkin pedi kullanın.",
      "Sağlık ekibi gelene ya da çocuk uyanıp normal nefes alana kadar durmayın."
    ],
    "dont": [
      "Çocuğu sarsmayın, canını acıtarak uyandırmaya çalışmayın.",
      "Başını çok fazla geriye bükmeyin.",
      "\"Çocuğa zarar veririm\" korkusuyla yüzeysel basmayın; göğüs belirgin çökmeli.",
      "Basılar arasında 10 saniyeden uzun ara vermeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "çocuk kalp masajı",
      "çocukta kalp masajı",
      "cocuk kalp masaji",
      "çocuk cpr",
      "çocuk kpr",
      "çocuk nefes almıyor",
      "çocuğun kalbi durdu",
      "çocuk yanıt vermiyor",
      "çocukta canlandırma",
      "çocuk temel yaşam desteği",
      "cocuk nefes almiyor"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 Paediatric BLS Guidelines (ERC 2025 uyarlaması)",
      "AHA/AAP — 2025 Guidelines Part 6: Pediatric Basic Life Support",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (çocukta derhal 5 kurtarıcı soluk, 30:2, 100–120/dk, ön-arka çapın en az üçte biri, ergende 5–6 cm, OED pedi 25 kg'a göre); değişiklik yok. Önceki tur: RCUK 2025 Paediatric BLS (5 başlangıç nefesi; alt sternum; en az ⅓, 6 cm'yi geçmeden; 100–120/dk; 30:2, yalnız çocuk TYD eğitimliyse 15:2; telefonsuz tek kurtarıcı 1 dk TYD; <25 kg ≈8 yaş çocuk modu), AHA/AAP 2025 Part 6 (~5 cm, ergenlikten sonra yetişkin)." },
    "art": [
      null,
      "call-112",
      "ilk-yardim-cocuk-bas-geri",
      "ilk-yardim-cocuk-nefes",
      "ilk-yardim-cocuk-kpr-tek-el",
      null,
      null,
      null,
      "ilk-yardim-oed-ped-cocuk",
      null
    ]
  },
  {
    "id": "ilk-yardim-bebek-kpr",
    "title": "Kalp masajı — bebek (1 yaş altı)",
    "tag": "İLK YARDIM",
    "summary": "Yanıt vermeyen ve normal nefes almayan bebekte 112'yi arayın, ağız ve buruna 5 nefes verip iki başparmakla göğüs basısı yapın.",
    "steps": [
      "Bebeğin ayak tabanına ya da omzuna dokunup seslenin. Sarsmayın.",
      "Yanıt yoksa yardım için bağırın, 112'yi arayıp hoparlörü açın. Telefon yoksa önce 1 dakika canlandırma yapın, sonra bebeği kucaklayıp yardım çağırın.",
      "Bebeği sert, düz bir yüzeye sırtüstü yatırın. Başını düz tutup çenesini hafifçe kaldırın; başı geriye bükmeyin.",
      "En fazla 10 saniye bakın: normal nefes alıyor mu?",
      "Nefes yoksa 5 kurtarıcı nefes verin: ağzınızla bebeğin ağzını ve burnunu birlikte kapatın, göğsü kalkacak kadar hafifçe üfleyin.",
      "İki elinizle bebeğin göğsünü sarın. İki başparmağınızı yan yana göğüs kemiğinin alt yarısına, meme uçları hizasının hemen altına koyun.",
      "Göğsü üçte bir oranında (yaklaşık 4 cm) çökertecek kadar, dakikada 100–120 hızla bastırın; her basıdan sonra tamamen bırakın.",
      "Elleriniz göğsü saramıyorsa tek elinizin topuğuyla aynı noktaya bastırın.",
      "30 basıdan sonra 2 nefes verin; bebek ilk yardım eğitimi aldıysanız 15 bası, 2 nefes. Nefes veremiyorsanız yalnızca bası yapın.",
      "OED gelince açın; bir pedi göğsün ortasına, diğerini sırtın ortasına yapıştırın. Sağlık ekibi gelene kadar durmayın."
    ],
    "dont": [
      "Bebeği sarsmayın.",
      "Başını yetişkinde olduğu gibi çok geriye bükmeyin; hava yolu kapanabilir.",
      "Sert üflemeyin; göğsün hafifçe kalkması yeterli.",
      "Bebeği yumuşak yatak ya da kanepe üzerinde bırakmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "bebek kalp masajı",
      "bebekte kalp masajı",
      "bebek kalp masaji",
      "bebek cpr",
      "bebek kpr",
      "bebek nefes almıyor",
      "bebeğin kalbi durdu",
      "bebek yanıt vermiyor",
      "bebek morardı nefes yok",
      "bebekte canlandırma",
      "yenidoğan nefes almıyor",
      "bebek nefes almiyor"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 Paediatric BLS Guidelines (ERC 2025 uyarlaması)",
      "AHA/AAP — 2025 Guidelines Part 6: Pediatric Basic Life Support",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (bebekte iki başparmakla çevreleme, 5 kurtarıcı soluk, 30:2, 100–120/dk); değişiklik yok. Not: eski SB 2011 kitabındaki iki parmak tekniği güncel Türk listesinde de yerini başparmak çevrelemeye bırakmış. Önceki tur: RCUK 2025 Paediatric BLS (bebekte iki başparmakla sarma, baş nötr, ağız+burun nefesi, 5 nefes, 30:2/eğitimliyse 15:2, telefonsuz 1 dk, ön-arka ped), AHA/AAP 2025 Part 6 (iki parmak tekniği kaldırıldı; saramıyorsa tek el topuğu; ~4 cm; 100–120/dk)." },
    "art": [
      null,
      "call-112",
      "ilk-yardim-bebek-bas-notr",
      null,
      "ilk-yardim-bebek-nefes",
      "ilk-yardim-bebek-kpr-basparmak",
      null,
      "ilk-yardim-bebek-kpr-tek-el",
      null,
      "ilk-yardim-oed-ped-bebek"
    ]
  },
  {
    "id": "ilk-yardim-oed",
    "title": "Otomatik defibrilatör (OED) kullanımı",
    "tag": "İLK YARDIM",
    "summary": "Kalbi durmuş kişide OED'yi hemen açın, pedleri çıplak göğse yapıştırın ve cihazın sesli talimatlarına uyun.",
    "steps": [
      "Kişi yanıt vermiyor ve normal nefes almıyorsa 112'yi arayın, kalp masajına başlayın. Biri en yakın OED'yi getirsin.",
      "OED'yi kişinin başının yanına koyup açın (kapağı açın ya da açma düğmesine basın). Sesli talimatları dinleyin.",
      "Göğsü açın. Islaksa kurulayın, üzerinde ilaç bandı varsa çıkarın.",
      "Bir pedi sağ köprücük kemiğinin altına, diğerini sol koltuk altının biraz altına, göğsün yanına yapıştırın. Pedin üstündeki resme bakın.",
      "Pedler yapıştırılırken yanınızdaki biri kalp masajını sürdürsün.",
      "Cihaz ritmi incelerken \"Herkes çekilsin!\" deyin; kimse kişiye dokunmasın.",
      "Şok önerilirse kimsenin dokunmadığından emin olun ve yanıp sönen şok düğmesine basın. Tam otomatik cihaz şoku kendisi verir.",
      "Şoktan hemen sonra ya da şok önerilmezse beklemeden kalp masajına devam edin.",
      "Cihazı kapatmayın, pedleri çıkarmayın. Sağlık ekibi gelene kadar talimatları izleyin.",
      "Çocukta varsa çocuk pedini ya da çocuk modunu kullanın, yoksa yetişkin pedi kullanın. Küçük çocukta ve bebekte bir ped göğsün ortasına, diğeri sırtın ortasına."
    ],
    "dont": [
      "Cihaz incelerken ve şok verirken kişiye dokunmayın.",
      "Kişi su birikintisinin içindeyse önce kuru yere çekin ve göğsünü kurulayın.",
      "Pedi göğüste deri altındaki kalp pilinin tam üzerine yapıştırmayın; biraz yanına koyun.",
      "OED'yi kullanmaktan korkmayın; cihaz yalnızca gerekiyorsa şok verir."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "oed",
      "aed",
      "defibrilatör",
      "defibrilator",
      "otomatik defibrilatör",
      "otomatik eksternal defibrilatör",
      "şok cihazı",
      "kalp şok cihazı",
      "elektrik şoku cihazı",
      "ped yapıştırma",
      "defibrilatör nasıl kullanılır"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 Adult BLS ve Paediatric BLS (ERC 2025 uyarlaması)",
      "AHA/AAP — 2025 Guidelines Part 6: Pediatric Basic Life Support",
      "St John Ambulance — CPR",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (pedler çıplak göğse; şoktan sonra 2 dk TYD; çocukta ped yerleşimi 25 kg'a göre); değişiklik yok. Önceki tur: RCUK 2025 Adult BLS (çıplak göğse, OED üzerindeki resme göre ped), RCUK 2025 Paediatric BLS (<25 kg çocuk modu ve ön-arka ped, >25 kg ön-yan ya da ön-arka), AHA/AAP 2025 (<8 yaşta çocuk zayıflatıcı). Kalp pili ve ilaç bandı notları kaynakta doğrulanamadı." },
    "art": [
      null,
      "ilk-yardim-oed-ac",
      null,
      "ilk-yardim-oed-ped-yetiskin",
      null,
      "ilk-yardim-oed-cekilin",
      "ilk-yardim-oed-sok-dugme",
      "ilk-yardim-kpr-yetiskin",
      null,
      "ilk-yardim-oed-ped-cocuk"
    ]
  },
  {
    "id": "derlenme-pozisyonu",
    "title": "Bilinci kapalı ama nefes alıyor: derlenme (koma) pozisyonu",
    "tag": "İLK YARDIM",
    "summary": "Yanıt vermeyen ama normal nefes alan kişiyi yan yatırarak hava yolunu açık tutun.",
    "steps": [
      "Omzuna dokunup seslenin. Yanıt yoksa ama normal nefes alıyorsa bu adımları uygulayın.",
      "112'yi arayın ya da birine aratın.",
      "Size yakın olan kolunu dirsekten bükün; başının yanına, avucu yukarı bakacak şekilde koyun.",
      "Uzak kolunu göğsünün üzerinden getirin; elinin sırtını size yakın yanağına dayayın, orada tutun.",
      "Uzak bacağını dizden bükün. Dizinden çekerek kişiyi kendinize doğru yan çevirin.",
      "Üstteki bacak kalçadan ve dizden bükülü, öne doğru dursun.",
      "Başını hafifçe geriye eğin. Ağzı yere doğru olsun ki kusarsa boğulmasın.",
      "Üstünü örtün. Nefesini sürekli kontrol edin.",
      "30 dakikadan uzun aynı yanda kalırsa öbür yanına, derlenme pozisyonuna çevirin.",
      "Nefes durur ya da normal olmazsa sırtüstü çevirin ve kalp masajına başlayın."
    ],
    "dont": [
      "Ağzından su, yiyecek ya da ilaç vermeyin.",
      "Kişiyi yalnız bırakmayın.",
      "Hırıltılı, iç çeker gibi soluk alan kişiyi yan yatırmayın; bu normal nefes değildir, kalp masajı gerekir.",
      "Düşme ya da çarpma sonrası boyun yaralanması şüphesi varsa, nefes yolunu korumak için gerekmedikçe döndürmeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "koma pozisyonu",
      "derlenme pozisyonu",
      "yan yatırma",
      "yan yatis",
      "baygın",
      "bilinçsiz",
      "bilinci kapalı",
      "kendinde değil",
      "ayılmıyor",
      "baygın ama nefes alıyor",
      "kusuyor baygın"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (ERC 2025 uyarlaması)",
      "St John Ambulance — Recovery position",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (koma pozisyonu: üst bacak bükülü, baş hafif geride, solunum 2–3 dk'da bir kontrol, solunum yoksa sırtüstü çevirip TYD); değişiklik yok. Önceki tur: RCUK 2025 First Aid (yanıtı azalmış, TYD gerekmeyen kişide yan pozisyon; hırıltılı solukta/travmada değil), St John Ambulance Recovery position (adımlar, baş-çene, 30 dk sonra öbür yana)." },
    "art": [
      null,
      null,
      "ilk-yardim-derlenme-kol",
      "ilk-yardim-derlenme-el-yanak",
      "ilk-yardim-derlenme-cevir",
      null,
      "ilk-yardim-derlenme-son",
      "ilk-yardim-derlenme-izle",
      null,
      "ilk-yardim-derlenme-kpr"
    ]
  },
  {
    "id": "hava-yolu-tikanmasi",
    "title": "Boğulma (hava yolu tıkanması) — yetişkin ve 1 yaş üstü çocuk",
    "tag": "İLK YARDIM",
    "summary": "Öksüremeyen ve konuşamayan kişiye 5 sırt vuruşu ve 5 karın basısını sırayla uygulayın.",
    "steps": [
      "\"Boğuluyor musun?\" diye sorun. Konuşabiliyor ya da güçlü öksürebiliyorsa öksürmeye devam etmesini söyleyin.",
      "Konuşamıyor, nefes alamıyor ya da öksürüğü zayıfsa hemen müdahale edin. Birine 112'yi aratın.",
      "Yanına geçin, bir elinizle göğsünden destekleyip onu öne eğin. Elinizin topuğuyla iki kürek kemiği arasına 5 kez sert vurun.",
      "Cisim çıkmazsa arkasına geçin, kollarınızı beline dolayın. Küçük çocukta arkasında diz çökün.",
      "Bir elinizi yumruk yapıp göbeğin biraz üstüne, göğüs kemiğinin altına koyun. Diğer elinizle yumruğunuzu kavrayın.",
      "Onu öne eğip içeri ve yukarı doğru sert biçimde çekin. Bunu 5 kez yapın.",
      "Cisim çıkana kadar 5 sırt vuruşu ve 5 karın basısını sırayla sürdürün.",
      "Kişi bilincini kaybederse yere yatırın, 112'yi arayın ve kalp masajına başlayın. Çocuksa önce 5 kurtarıcı nefes verin.",
      "Karın basısı yaptıysanız cisim çıksa bile kişiyi doktora gösterin."
    ],
    "dont": [
      "Güçlü öksürebilen kişinin sırtına vurmayın.",
      "Ağzına körlemesine parmak sokmayın; cismi daha derine itebilirsiniz. Yalnızca açıkça gördüğünüz cismi çıkarın.",
      "İleri hamilelikte ya da kollarınızla belini saramadığınız kişide karından bastırmayın; ellerinizi göğüs kemiğinin alt yarısına koyup göğüsten bastırın.",
      "Bu adımlar 1 yaş altı bebekler için değildir; bebekte karın basısı yapmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "boğulma",
      "boğuluyor",
      "boğazına kaçtı",
      "boğazında kaldı",
      "heimlich",
      "hava yolu",
      "tıkanma",
      "nefes alamıyor",
      "yutkunamıyor",
      "lokma kaçtı",
      "kaçtı",
      "karın basısı",
      "sırt vuruşu",
      "çocuğun boğazına kaçtı",
      "yemek boğazına kaçtı"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (boğulma)",
      "Resuscitation Council UK — 2025 Paediatric BLS Guidelines",
      "AHA — 2025 Adult Basic Life Support (yabancı cisim tıkanması)",
      "Türk Kızılay — Okullarda ilk yardım rehberi (DHA haberi)",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türk Kızılay (öksürüyor/konuşuyorsa müdahale yok; 5 sırt darbesi + 5 karın basısı; bilinç kaybında TYD ve 112), Bartın Üniv. SB 2024 temelli liste (5'er dönüşümlü; çocukta bilinç kapanırsa derhal 5 kurtarıcı soluk; kör parmak yok), RCUK 2025, AHA 2025. Değişiklik: #8'e 'Çocuksa önce 5 kurtarıcı nefes verin' eklendi (UZMAN_INCELEME açık maddesi)." },
    "art": [
      "ilk-yardim-bogulma-isaret",
      null,
      "ilk-yardim-sirt-vurusu",
      null,
      "ilk-yardim-yumruk-yeri",
      "ilk-yardim-karin-basisi",
      null,
      "ilk-yardim-bogulma-kpr",
      null
    ]
  },
  {
    "id": "ilk-yardim-bebek-bogulma",
    "title": "Bebekte boğulma (hava yolu tıkanması) — 1 yaş altı",
    "tag": "İLK YARDIM",
    "summary": "Ağlayamayan, öksüremeyen bebeğe 5 sırt vuruşu ve 5 göğüs basısını sırayla uygulayın.",
    "steps": [
      "Bebek güçlü öksürüyor ya da ağlıyorsa vurmayın; öksürmesine izin verin ve yanından ayrılmayın.",
      "Ses çıkaramıyor, nefes alamıyor ya da morarıyorsa hemen başlayın. Birine 112'yi aratın; yalnızsanız hoparlörle arayın.",
      "Bebeği yüzüstü önkolunuzun üzerine yatırın, başı göğsünden aşağıda olsun. Çenesini parmaklarınızla tutun, kolunuzu uyluğunuza dayayın.",
      "Elinizin topuğuyla iki kürek kemiği arasına 5 kez sert vurun. Her vuruştan sonra cisim çıktı mı bakın.",
      "Cisim çıkmazsa başını destekleyerek bebeği sırtüstü çevirin, öbür kolunuza ya da dizlerinize yatırın; başı yine aşağıda olsun.",
      "İki elinizle göğsünü sarın, iki başparmağınızı göğüs kemiğinin alt yarısına koyun. 5 kez kısa ve sert göğüs basısı yapın.",
      "Cisim çıkana ya da bebek ağlayıp öksürene kadar 5 sırt vuruşu ve 5 göğüs basısını sırayla sürdürün.",
      "Ağızda cismi açıkça görüyorsanız tek parmakla çıkarın. Görmediğiniz cismi parmakla aramayın.",
      "Bebek yanıt vermez hale gelirse sert bir yüzeye yatırın, 112'yi arayın ve 5 kurtarıcı nefesle bebek kalp masajına başlayın.",
      "Cisim çıksa bile bebeği mutlaka doktora gösterin."
    ],
    "dont": [
      "Bebekte karın basısı yapmayın.",
      "Bebeği ayaklarından baş aşağı tutup sallamayın.",
      "Körlemesine parmakla ağzını karıştırmayın.",
      "Bebeği sarsmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "bebek boğuluyor",
      "bebeğin boğazına kaçtı",
      "bebek tıkandı",
      "bebek boguluyor",
      "bebekte heimlich",
      "bebek nefes alamıyor öksüremiyor",
      "bebek ağzına bir şey kaçtı",
      "bebek mama kaçtı",
      "bebek morarıyor boğaz",
      "bebekte sırt vuruşu",
      "bebekte boğulma"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 Paediatric BLS Guidelines (bebekte yabancı cisim)",
      "AHA/AAP — 2025 Çocuk Temel Yaşam Desteği",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Bartın Üniv. SB ASHGM 2024 temelli beceri listesi (bebek yüzüstü, baş gövdeden aşağıda en fazla 5 sırt vuruşu, sonra sırtüstü en fazla 5 göğüs itmesi; bilinç kapanırsa 5 kurtarıcı soluk ve kalp masajı; kör parmak yok); değişiklik yok. Önceki tur: RCUK 2025 Paediatric BLS (önkolda yüzüstü, kol bacağa dayalı, baş göğüsten aşağıda 5 sırt vuruşu; sırtüstü dizlerde iki başparmakla sarma tekniğiyle 5 göğüs basısı; tek parmakla yalnızca görünen cismi çıkarma; bilinç kaybında 5 kurtarıcı nefesle TYD)." },
    "art": [
      null,
      null,
      "ilk-yardim-bebek-tutus",
      "ilk-yardim-bebek-sirt-vurusu",
      "ilk-yardim-bebek-cevir",
      "ilk-yardim-bebek-gogus-basisi",
      null,
      null,
      "ilk-yardim-bebek-kpr-basparmak",
      null
    ]
  },
  {
    "id": "ilk-yardim-suda-bogulma",
    "title": "Suda boğulma: güvenli kurtarma ve ilk yardım",
    "tag": "İLK YARDIM",
    "summary": "Suya girmeden uzanarak ya da yüzen bir şey atarak kurtarın; nefes almıyorsa 5 kurtarıcı nefesle canlandırmaya başlayın.",
    "steps": [
      "Bağırarak yardım çağırın, birine hemen 112'yi aratın.",
      "Suya girmeyin. Kıyıda yere yatıp uzun bir dal, sopa, havlu ya da giysiyle uzanın.",
      "Yetişemiyorsanız yüzen bir şey atın: can simidi, boş bidon, top ya da ipe bağlı boş şişe.",
      "Suya yalnızca eğitimliyseniz ve yanınızda yüzen bir şey varsa girin. Panikleyen kişi sizi de batırabilir.",
      "Kişi sudan çıkınca sert zemine sırtüstü yatırın. Yanıt veriyor mu, normal nefes alıyor mu bakın.",
      "Normal nefes almıyorsa önce 5 kurtarıcı nefes verin, sonra 30 bası 2 nefesle kalp masajına devam edin.",
      "Nefes vermeyi bilmiyorsanız ya da veremiyorsanız ara vermeden yalnızca göğüs basısı yapın.",
      "OED gelirse göğsünü kurulayıp pedleri yapıştırın ve talimatlara uyun.",
      "Nefes alıyorsa ıslak giysilerini çıkarın, kurulayıp örtün ve yan yatırın.",
      "Kendine gelse bile kişiyi mutlaka hastaneye götürün; saatler sonra nefes sorunu çıkabilir."
    ],
    "dont": [
      "Karnına bastırarak ya da ters çevirerek su çıkarmaya çalışmayın; zaman kaybıdır.",
      "Akıntılı, dalgalı ya da buzlu suya yüzerek girmeyin.",
      "Kurtarmak için birden çok kişi suya atlamayın.",
      "Kusarsa sırtüstü bırakmayın; yan çevirip ağzını boşaltın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "suda boğulma",
      "suda boğuldu",
      "boğulan çocuk",
      "denizde boğulan",
      "suda boguldu",
      "suya düştü",
      "denizde boğuluyor",
      "havuzda boğulma",
      "gölde boğuluyor",
      "sudan çıkarma",
      "suyun altında kaldı",
      "boğulmak üzere yüzemiyor",
      "denizde kurtarma",
      "sudan çıkan nefes almıyor"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (boğulma)",
      "Resuscitation Council UK — 2025 Paediatric BLS Guidelines (suda boğulma)",
      "Resuscitation Council UK — 2025 Adult BLS Guidelines"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: RCUK 2025 First Aid ve Paediatric BLS (eğitimsiz kişi suya girmez; karada 5 kurtarıcı nefes sonra standart TYD; OED göğüs kurulandıktan sonra), RCUK 2025 Adult BLS (30:2, nefes veremeyen yalnızca kesintisiz bası)." },
    "art": [
      null,
      "ilk-yardim-suda-uzan",
      "ilk-yardim-suda-at",
      null,
      null,
      "ilk-yardim-suda-nefes",
      "ilk-yardim-suda-kpr",
      null,
      "ilk-yardim-suda-yan-yatir",
      null
    ]
  },
  {
    "id": "ilk-yardim-elektrik-carpmasi",
    "title": "Elektrik çarpması",
    "tag": "İLK YARDIM",
    "summary": "Önce akımı kesin; kişi elektriğe değerken ona dokunmayın, sonra nefesine bakıp gerekirse kalp masajı yapın.",
    "steps": [
      "Kişiye dokunmayın. Önce sigortayı ya da ana şalteri indirerek veya fişi çekerek elektriği kesin.",
      "Ev elektriğinde akım kesilemiyorsa kuru bir şeyin (tahta, lastik paspas, kalın gazete) üstüne basın. Kuru tahta süpürge sapıyla kişiyi ya da kabloyu kaynaktan itin.",
      "Yere düşmüş yüksek gerilim teli, trafo ya da direk varsa yaklaşmayın. En az 20 metre uzakta durun, başkalarını da uzak tutun.",
      "112'yi arayın. Yüksek gerilim teli varsa söyleyin; elektrik kesildiği bildirilene kadar yaklaşmayın.",
      "Kişi akımdan kurtulunca omzuna dokunup seslenin. Normal nefes alıyor mu bakın.",
      "Normal nefes yoksa hemen kalp masajına başlayın; OED varsa kullanın.",
      "Nefes alıyor ama yanıt vermiyorsa yan yatırın.",
      "Yanıkları 20 dakika serin akan suyla soğutun. Temiz, kuru bir bezle gevşekçe örtün.",
      "İyi görünse bile kişiyi sağlık kontrolüne götürün; kalp ritmi bozulabilir, iç yanık olabilir."
    ],
    "dont": [
      "Islak zeminde, ıslak elle ya da metal bir cisimle kişiyi kurtarmaya çalışmayın.",
      "Yere düşen kabloyu kendiniz kaldırmaya çalışmayın.",
      "Kabloya değen aracın içindeki kişiyi dışarı çekmeyin; içeride kıpırdamadan kalmasını söyleyin.",
      "Yanığa buz, diş macunu, yoğurt ya da yağ sürmeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "elektrik çarptı",
      "elektrik çarpması",
      "elektrik carpti",
      "akım kaptı",
      "cereyan çarptı",
      "cereyana kapıldı",
      "elektrik teli düştü",
      "yüksek gerilim",
      "trafo çarptı",
      "prizden çarpıldı",
      "kablo çarptı"
    ],
    "sources": [
      "St John Ambulance WA — Electric shock",
      "Resuscitation Council UK — 2025 Adult BLS Guidelines"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: St John WA (önce akımı kes, kuru tahta süpürge sapıyla ayır, düşmüş telden en az 8 m; UK'de 18 m önerisi nedeniyle ihtiyatlı 20 m korundu; yanığı 20 dk suyla soğut, gevşek ve yapışmaz örtü), RCUK 2025 Adult BLS." },
    "art": [
      "power-off",
      "ilk-yardim-elektrik-tahta-sopa",
      "ilk-yardim-elektrik-hat-uzak",
      null,
      null,
      "ilk-yardim-elektrik-kpr",
      null,
      "ilk-yardim-elektrik-yanik-sogut",
      null
    ]
  },
  {
    "id": "ilk-yardim-sok",
    "title": "Şok (dolaşım yetersizliği)",
    "tag": "İLK YARDIM",
    "summary": "Soluk, soğuk terli ve sersemleşen kişiyi sırtüstü yatırın, 112'yi arayın, kanamayı durdurun ve sıcak tutun.",
    "steps": [
      "Belirtilere bakın: soluk ya da gri cilt, soğuk ve yapış yapış ter, hızlı ve zayıf nabız, hızlı nefes, susama, sersemlik.",
      "112'yi arayın.",
      "Görünür bir kanama varsa önce onu durdurun: yaraya sert ve kesintisiz bastırın.",
      "Kişiyi düz zemine sırtüstü yatırın.",
      "Bacağında, kalçasında ya da sırtında yaralanma yoksa bacaklarını yaklaşık 30 cm yukarı kaldırın.",
      "Sıkı giysilerini gevşetin. Altına ve üstüne battaniye koyup sıcak tutun.",
      "Yanında kalın, sakin konuşun. Bilincini ve nefesini sık sık kontrol edin.",
      "Bilinci kapanır ama normal nefes alırsa yan yatırın. Nefesi durursa kalp masajına başlayın."
    ],
    "dont": [
      "Kişiyi oturtmayın, ayağa kaldırmayın, yürütmeyin.",
      "Nefes darlığı ya da göğüs ağrısı varsa bacaklarını kaldırmayın; rahat ettiği şekilde bırakın.",
      "Yiyecek, içecek, alkol ya da sigara vermeyin.",
      "Soba ya da sıcak su torbasıyla ısıtmaya çalışmayın; yalnızca örtün."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "şok",
      "şoka girdi",
      "soka girdi",
      "şok pozisyonu",
      "soğuk terleme",
      "beti benzi attı",
      "rengi soldu",
      "nabız zayıf",
      "kan kaybından fenalaştı",
      "dolaşım yetmezliği",
      "sok belirtileri"
    ],
    "sources": [
      "American Red Cross — Shock (ilk yardım)",
      "Resuscitation Council UK — 2025 First Aid Guidelines (kanama)",
      "Sağlık Bakanlığı — Temel İlkyardım Uygulamaları Eğitim Kitabı (2011; bacaklar yaklaşık 30 cm)",
      "Bartın Üniversitesi — İlk yardım beceri kontrol listeleri (Sağlık Bakanlığı ASHGM İlk Yardım Eğitim Kitabı 2024 ve ERC temelli)",
      "Türk Kızılay — Okullarda ilk yardım rehberi (DHA haberi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: SB Temel İlkyardım Uygulamaları Eğitim Kitabı 2011 ve MEB MTSK tabanlı ders özetleri (sırtüstü, kırık/omurga yaralanması yoksa bacaklar yaklaşık 30 cm), Bartın Üniv. SB 2024 temelli liste (yaralanma yoksa ayaklar 30–60 derece, battaniye), Kızılay (bayılmada 30 cm), American Red Cross (15–30 cm), RCUK 2025. Değişiklik yok; 30 cm Türk eğitimiyle uyumlu." },
    "art": [
      "ilk-yardim-sok-belirti",
      null,
      "ilk-yardim-sok-kanama",
      null,
      "ilk-yardim-bacak-kaldir",
      "ilk-yardim-sok-battaniye",
      null,
      "ilk-yardim-sok-yan-yatir"
    ]
  },
  {
    "id": "ilk-yardim-anafilaksi",
    "title": "Ciddi alerjik tepki (anafilaksi)",
    "tag": "İLK YARDIM",
    "summary": "Alerjiden sonra nefes darlığı, dil-boğaz şişmesi ya da bayılma varsa kişinin kendi adrenalin kalemini hemen kullanmasına yardım edin ve 112'yi arayın.",
    "steps": [
      "Belirtiler: dudak, dil ya da boğazda şişme; hırıltı, nefes darlığı, ses kısılması; baş dönmesi, bayılma. Çoğu zaman kaşıntılı kızarıklık da olur.",
      "Kişinin yanında adrenalin oto-enjektörü (adrenalin kalemi; Türkiye'de çoğu zaman Penepin) varsa hemen kullanmasına yardım edin; beklemeyin. Kalem yoksa hemen 112'yi arayın.",
      "Kalemin güvenlik kapağını çıkarın. Ucu uyluğun dış yan ortasına dik tutun; gerekirse kıyafetin üstünden yapılabilir.",
      "Kalemi uyluğa sertçe bastırın ve üzerindeki talimatta yazan süre kadar bastırılı tutun.",
      "Hemen 112'yi arayın ve \"anafilaksi\" deyin. Kullanılan kalemi sağlık ekibine verin.",
      "Kişiyi yatırın. Nefes almakta zorlanıyorsa bacakları uzalı şekilde oturtun.",
      "5 dakikada düzelmezse ve ikinci kalem varsa, ikincisini öbür uyluğa yapın.",
      "Yanıt vermez ve normal nefes almazsa kalp masajına başlayın."
    ],
    "dont": [
      "Kişiyi aniden ayağa kaldırmayın ya da yürütmeyin; düzelmiş görünse bile.",
      "Belirtiler hafifledi diye 112'yi aramaktan vazgeçmeyin; tepki geri gelebilir.",
      "Kalemin ucunu başparmağınızla kapatmayın; ele, kalçaya ya da damara yapmayın.",
      "Adrenalin kalemi varken yalnızca alerji hapıyla ya da şurubuyla yetinmeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "anafilaksi",
      "anafilaktik şok",
      "alerjik şok",
      "alerji şoku",
      "ciddi alerji",
      "dili şişti",
      "boğazı şişiyor",
      "adrenalin kalemi",
      "epipen",
      "penepin",
      "oto enjektör",
      "fıstık alerjisi",
      "alerji nefes alamıyor",
      "yüzü gözü şişti"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (anafilaksi)",
      "NHS — Anaphylaxis",
      "Turkish Archives of Pediatrics — EpiPen ve Penepin uygulama adımları karşılaştırması (çok merkezli)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Turkish Archives of Pediatrics çok merkezli çalışma (Türkiye'de bulunan tek adrenalin oto-enjektörü Penepin; en sık hata dış uyluğa yerleştirip tetiği basmamak), RCUK 2025 First Aid, NHS. Değişiklik: #2'ye 'Türkiye'de çoğu zaman Penepin' ve 'penepin' anahtar kelimesi eklendi. Doz yok." },
    "art": [
      "ilk-yardim-anafilaksi-belirti",
      null,
      "ilk-yardim-adrenalin-kapak",
      "ilk-yardim-adrenalin-uyluk",
      "call-112",
      "ilk-yardim-anafilaksi-pozisyon",
      null,
      null
    ]
  },
  {
    "id": "ilk-yardim-astim",
    "title": "Ağır astım krizi",
    "tag": "İLK YARDIM",
    "summary": "Astım krizindeki kişiyi dik oturtun, kendi rahatlatıcı fısfısını kullanmasına yardım edin; düzelmezse 112'yi arayın.",
    "steps": [
      "Kişiyi dik oturtun. Hafifçe öne eğilip kollarını masaya ya da dizlerine dayasın.",
      "Kendi rahatlatıcı fısfısını (çoğu zaman mavi) bulmasına ve doktorunun söylediği şekilde kullanmasına yardım edin.",
      "Hazne (spacer) varsa fısfısı onunla kullansın.",
      "Yavaş ve sakin nefes almasını söyleyin. Siz de sakin kalın.",
      "Sıkı giysilerini gevşetin. Duman, toz ya da hayvan gibi tetikleyiciden uzaklaştırın.",
      "Hemen 112'yi arayın: konuşamıyorsa, dudakları morarıyorsa, çok yorulup uyukluyorsa ya da yanında fısfısı yoksa.",
      "Fısfısı kullandığı hâlde kötüleşiyor ya da 5 dakika içinde düzelmiyorsa 112'yi arayın.",
      "Yardım gelene kadar doktorunun verdiği astım planına göre fısfısını kullanmaya devam etmesine yardım edin.",
      "Yanıt vermez ve normal nefes almazsa kalp masajına başlayın."
    ],
    "dont": [
      "Kişiyi sırtüstü yatırmayın.",
      "Başkasına ait ilacı vermeyin.",
      "Kağıt torbaya nefes aldırmayın.",
      "Kriz geçti diye hemen yalnız bırakmayın."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "astım",
      "astim",
      "astım krizi",
      "astım atağı",
      "nefes darlığı",
      "hırıltı",
      "hırıltılı nefes",
      "fısfıs",
      "fisfis",
      "inhaler",
      "ventolin",
      "göğsü sıkışıyor nefes",
      "nefes açıcı"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (astım)",
      "NHS — Asthma attack"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Bağımsız doğrulama: RCUK 2025 First Aid (kendi rahatlatıcı inhaleri, varsa hazne), NHS Asthma attack (dik oturma, sakin kalma, kişisel astım planı, kötüleşirse/en yüksek dozda düzelmezse/inhaler yoksa 112). Doz verilmedi." },
    "art": [
      "ilk-yardim-astim-oturus",
      "ilk-yardim-astim-fisfis",
      "ilk-yardim-astim-hazne",
      null,
      null,
      "call-112",
      null,
      null,
      "ilk-yardim-astim-kpr"
    ]
  },
  {
    "id": "ilk-yardim-kalp-krizi",
    "title": "Kalp krizi belirtileri ve yapılacaklar",
    "tag": "İLK YARDIM",
    "summary": "Göğüste ağrı ya da baskı olan kişi için hemen 112'yi arayın, onu oturtup dinlendirin ve bayılırsa kalp masajına hazır olun.",
    "steps": [
      "Belirtiler: göğüste sıkışma, baskı ya da ağrı. Ağrı kola, boyuna, çeneye, sırta ya da mideye yayılabilir.",
      "Nefes darlığı, soğuk terleme, bulantı ve halsizlik de olabilir. Kadınlarda, yaşlılarda ve şeker hastalarında belirtiler hafif olabilir.",
      "Hemen 112'yi arayın. Ağrının geçmesini beklemeyin.",
      "Kişiyi sırtını bir şeye yaslayıp dizleri bükülü oturtun. Hiçbir işle uğraşmasın.",
      "Sıkı giysilerini gevşetin. Sakin konuşun, yalnız bırakmayın.",
      "Göğüs ağrısı (anjina) için doktorunun verdiği dil altı sprey ya da tableti varsa kendi kullanmasına yardım edin.",
      "Kişi yetişkinse, aspirin alerjisi yoksa ve yutabiliyorsa aspirini çiğneyerek almasına yardım edin. Kaç tane alacağını 112 görevlisine sorun.",
      "Biri en yakın OED'yi getirsin.",
      "Kişi yanıt vermez ve normal nefes almazsa hemen kalp masajına başlayın."
    ],
    "dont": [
      "Kişiyi yürütmeyin, merdiven çıkartmayın.",
      "Kendisinin araba kullanarak hastaneye gitmesine izin vermeyin.",
      "Belirtiler geçti diye 112'yi iptal etmeyin.",
      "Başkasına ait kalp ilacını vermeyin."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "kalp krizi",
      "kalp krizi belirtileri",
      "kalp krizi geçiriyor",
      "göğüs ağrısı",
      "gogus agrisi",
      "göğsüm sıkışıyor",
      "göğsünde baskı",
      "sol kol ağrısı",
      "enfarktüs",
      "miyokard",
      "kalp spazmı",
      "kalbim ağrıyor"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (Chest pain)",
      "ERC 2025 — Guidelines for Everyone (göğüs ağrısı, aspirin)",
      "NHS — Heart attack",
      "St John Ambulance — Heart attack",
      "American Red Cross — Heart Attack",
      "MEB MTSK İlk Yardım ders programı / SB Temel İlkyardım Eğitim Kitabı tabanlı ders özeti"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB MTSK/SB Temel İlkyardım 2011 tabanlı ders özeti (yarı oturur pozisyon, giysileri gevşet, 112 hemen, kendi ilacını almasına yardım, TYD hazırlığı) ile uyumlu. Aspirin Türk temel müfredat özetinde yok ('ağızdan bir şey verilmez' genel kuralı); ERC 2015–2025 ve ILCOR erken aspirini önerdiği için korundu, doz 112'ye bırakıldı. Değişiklik yok." },
    "art": [
      "ilk-yardim-kalp-krizi-belirti",
      null,
      "call-112",
      "ilk-yardim-kalp-krizi-oturt",
      null,
      null,
      null,
      null,
      "ilk-yardim-kalp-krizi-kpr"
    ]
  },
  {
    "id": "ilk-yardim-inme",
    "title": "İnme (felç) belirtileri: YÜZ-KOL-KONUŞMA-ZAMAN (FAST)",
    "tag": "İLK YARDIM",
    "summary": "Yüzde kayma, kolda güçsüzlük ya da konuşma bozukluğu görürseniz hemen 112'yi arayın ve belirtinin başladığı saati not edin.",
    "steps": [
      "YÜZ: Gülümsemesini isteyin. Yüzün bir yanı düşüyor ya da ağzı kayıyor mu?",
      "KOL: İki kolunu öne kaldırıp havada tutmasını isteyin. Bir kol aşağı düşüyor ya da kalkmıyor mu?",
      "KONUŞMA: Basit bir cümleyi tekrarlamasını isteyin. Konuşması peltek, anlaşılmaz mı ya da sizi anlamıyor mu?",
      "Ani denge kaybı, bir gözde görme kaybı ya da hayatının en şiddetli ani baş ağrısı da inme belirtisi olabilir.",
      "ZAMAN: Bunlardan biri bile varsa hemen 112'yi arayın ve \"inme şüphesi\" deyin.",
      "Belirtilerin başladığı saati, bilmiyorsanız en son sağlıklı görüldüğü saati not edin.",
      "Kişiyi rahat edeceği, desteklendiği bir şekilde oturtun ya da yatırın. Sakinleştirin.",
      "Bilinci bulanır, salyası akar ya da yutamazsa ama normal nefes alıyorsa yan yatırın.",
      "Yanında kalın; nefesi durursa kalp masajına başlayın."
    ],
    "dont": [
      "Yiyecek, içecek ya da ilaç vermeyin; yutması bozulmuş olabilir.",
      "Belirtiler geçti diye beklemeyin; yine 112'yi arayın.",
      "Parmak ucunu iğneyle delmek gibi halk yöntemleri denemeyin.",
      "\"Biraz dinlensin\" diye uyumaya bırakmayın; her dakika önemlidir."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "inme",
      "felç",
      "felc",
      "felç geçiriyor",
      "inme belirtileri",
      "yüzü kaydı",
      "ağzı kaydı",
      "dili dolanıyor",
      "konuşması bozuldu",
      "kolu tutmuyor",
      "bir tarafı tutmuyor",
      "beyin kanaması",
      "beyin pıhtısı",
      "fast testi"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (Stroke, FAST)",
      "NHS — Stroke symptoms",
      "St John Ambulance — Stroke",
      "American Red Cross — Stroke",
      "Türk Nöroloji Derneği — FAST inme bilgilendirme broşürü",
      "MEB MTSK İlk Yardım ders programı / SB Temel İlkyardım Eğitim Kitabı tabanlı ders özeti (felç)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türk Nöroloji Derneği FAST broşürü (F.A.S.T. = Yüz, Kol, Konuşma, Zaman; saat ve dakikayı not et; 112), MEB MTSK/SB tabanlı ders özeti (yüz-kol-konuşma kontrolü, ağızdan bir şey verme, bilinç kapalıysa koma pozisyonu, 112), RCUK 2025, NHS. Değişiklik: başlığa Türkiye'de de kullanılan '(FAST)' eklendi." },
    "art": [
      "ilk-yardim-inme-yuz",
      "ilk-yardim-inme-kol",
      "ilk-yardim-inme-konusma",
      null,
      "call-112",
      "ilk-yardim-inme-saat",
      null,
      "ilk-yardim-inme-yan-yatir",
      null
    ]
  },
  {
    "id": "ilk-yardim-seker-dusmesi",
    "title": "Şeker hastasında şeker düşmesi (hipoglisemi)",
    "tag": "İLK YARDIM",
    "summary": "Bilinci açık ve yutabilen şeker hastasına hemen şeker ya da şekerli içecek verin; bilinci kapalıysa ağızdan bir şey vermeyin, 112'yi arayın.",
    "steps": [
      "Belirtiler: terleme, titreme, solukluk, açlık, çarpıntı, sinirlilik, sarhoş gibi davranma ya da kafa karışıklığı.",
      "Bilinci açık ve yutabiliyorsa oturtun. Hemen şeker verin: 3–4 küp şeker, glikoz tableti ya da küçük bir bardak (yaklaşık 150 ml) meyve suyu veya şekerli (diyet olmayan) içecek.",
      "Ölçüm aleti varsa şekerini ölçün; ama ölçüm için şeker vermeyi geciktirmeyin.",
      "15 dakika bekleyin. Düzelmediyse aynı miktarda şekeri tekrar verin ve 112'yi arayın.",
      "Kötüleşirse, bilinci bulanırsa ya da yutamaz hale gelirse beklemeden 112'yi arayın.",
      "Düzelince ekmek, bisküvi ya da bir öğün yemek yemesini sağlayın.",
      "Bilinci kapalıysa ya da yutamıyorsa ağzından hiçbir şey vermeyin. 112'yi arayın; nefes alıyorsa yan yatırın.",
      "Normal nefes almıyorsa kalp masajına başlayın."
    ],
    "dont": [
      "Bilinci kapalı ya da yutamayan kişinin ağzına şeker, su ya da yiyecek koymayın.",
      "Şeker düşmesinden şüphelenirken insülin yapmayın ya da yaptırmayın.",
      "Diyet içecek ya da çikolata gibi yağlı yiyeceklerle düzeltmeye çalışmayın; şekeri yeterince hızlı yükseltmez.",
      "Düzeldikten hemen sonra yalnız bırakmayın; şeker yeniden düşebilir."
    ],
    "callEmergency": true,
    "critical": true,
    "keywords": [
      "şeker düştü",
      "şekeri düştü",
      "seker dustu",
      "şeker düşmesi",
      "hipoglisemi",
      "şeker hastası fenalaştı",
      "diyabet kriz",
      "şeker hastası bayılıyor",
      "kan şekeri düşük",
      "insülin sonrası titreme",
      "şeker komasi"
    ],
    "sources": [
      "Resuscitation Council UK — 2025 First Aid Guidelines (Hypoglycaemia)",
      "ERC 2025 — Guidelines for Everyone (düşük kan şekeri)",
      "NHS — Low blood sugar (hypoglycaemia)",
      "St John Ambulance — Diabetic emergencies",
      "MEB MTSK İlk Yardım ders programı / SB Temel İlkyardım Eğitim Kitabı tabanlı ders özeti"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB MTSK/SB tabanlı ders özeti (bilinç açıksa şekerli içecek ya da küp şeker; bilinç kapalıysa ağızdan bir şey verilmez, koma pozisyonu, 112), ERC 2015 (15–20 g glikoz), RCUK 2025, NHS, St John. Değişiklik yok." },
    "art": [
      "ilk-yardim-hipo-belirti",
      "ilk-yardim-hipo-seker-ver",
      null,
      null,
      null,
      null,
      "ilk-yardim-hipo-yan-yatir",
      null
    ]
  },
  {
    "id": "nobet",
    "title": "Nöbet (sara krizi)",
    "tag": "İLK YARDIM",
    "summary": "Nöbet geçiren kişiyi tutmaya çalışmayın; çevresini güvenli hale getirip başını koruyun.",
    "steps": [
      "Sakin olun. Çevredeki sert ve keskin eşyaları uzaklaştırın. Yol, ateş ya da su gibi bir tehlike yoksa kişiyi taşımayın.",
      "Başının altına yumuşak bir şey koyun.",
      "Boynundaki sıkı giysileri gevşetin, gözlüğünü çıkarın.",
      "Nöbetin başladığı saati not edin. 5 dakikadan uzun sürerse hemen 112'yi arayın.",
      "Kasılmalar bitince kişiyi yan yatırın (derlenme pozisyonu). Nefesini kontrol edin.",
      "Kasılmalar bittiği halde normal nefes almıyorsa 112'yi arayın ve kalp masajına başlayın.",
      "Kendine gelene kadar yanında kalın, sakin konuşun.",
      "112'yi arayın: ilk nöbetiyse, 5 dakikadan uzun sürdüyse, arka arkaya tekrarladıysa, suda olduysa, yaralandıysa ya da nefes almakta zorlanıyorsa.",
      "Kişi hamileyse, 6 aylıktan küçük bebekse ya da nöbetten sonra 10 dakikada kendine gelmiyorsa da 112'yi arayın."
    ],
    "dont": [
      "Kişiyi zorla tutmayın, kasılmaları durdurmaya çalışmayın.",
      "Ağzına hiçbir şey sokmayın; dilini yutmaz.",
      "Tamamen kendine gelene kadar su, yiyecek ya da ilaç vermeyin.",
      "Ateşli havalede çocuğu soğuk suya sokmayın, buz koymayın, alkolle ovmayın. Üstünü açın; nöbet bitince ılık suyla silebilirsiniz."
    ],
    "keywords": [
      "nöbet",
      "sara",
      "sara krizi",
      "epilepsi",
      "havale",
      "kasılma",
      "titreme nöbeti",
      "ağzından köpük",
      "krize girdi",
      "çırpınıyor",
      "ateşli havale"
    ],
    "sources": [
      "St John Ambulance — Seizures",
      "American Red Cross — Seizures",
      "AHA/Kızılhaç — 2024 İlk Yardım Kılavuzu (nöbet)",
      "MEB MTSK İlk Yardım ders programı / SB Temel İlkyardım Eğitim Kitabı tabanlı ders özeti (sara krizi ve ateşli havale)",
      "Acıbadem — Havale (febril konvülsiyon)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: MEB MTSK/SB tabanlı ders özeti (kasılma engellenmez, ağza hiçbir şey konmaz, sonra koma pozisyonu; 112: 5 dk'dan uzun, arka arkaya, ilk kez, yaralanma, hamile; ateşli havalede ılık su, soğuk su/buz/alkol yok), Acıbadem (soğuk duş ve alkolle ovma yok, 5 dk'da 112), St John, American Red Cross. Değişiklik: 'Yapmayın' listesine ateşli havalede soğuk su/buz/alkol uyarısı eklendi." },
    "art": [
      "ilk-yardim-nobet-cevre",
      "ilk-yardim-nobet-yastik",
      null,
      "ilk-yardim-nobet-saat",
      "ilk-yardim-nobet-derlenme",
      null,
      null,
      "call-112",
      null
    ]
  },
  {
    "id": "ilk-yardim-bayilma",
    "title": "Bayılma ve bayılacak gibi olma",
    "tag": "İLK YARDIM",
    "summary": "Bayılacak gibi olan kişiyi hemen oturtun ya da yatırın; bayılan kişiyi sırtüstü yatırıp nefesine bakın.",
    "steps": [
      "Başı dönüyor, gözü kararıyor ya da terliyorsa hemen yere oturtun veya yatırın; düşüp başını çarpmasın.",
      "Bayılmayı önlemek için kaslarını sıkmasını söyleyin: bacaklarını çaprazlayıp sıksın, çömelsin ya da ellerini kenetleyip iki yana çeksin.",
      "Bayıldıysa sırtüstü yatırın (belirgin hamileyse yan yatırın). En fazla 10 saniye bakın: normal nefes alıyor mu?",
      "Normal nefes almıyorsa 112'yi arayın ve kalp masajına başlayın.",
      "Nefes alıyorsa bacaklarını yastık ya da tabureyle yaklaşık 30 cm yükseltin, sıkı giysilerini gevşetin.",
      "Çoğu kişi yarım dakikada kendine gelir. 1 dakikada kendine gelmezse yan yatırın ve 112'yi arayın.",
      "Kendine gelince hemen kaldırmayın. Birkaç dakika yatsın, sonra yavaşça otursun.",
      "112'yi arayın: göğüs ağrısı, çarpıntı ya da nefes darlığı varsa, tam düzelmediyse ya da konuşma veya hareket güçlüğü varsa, nöbet geçirdiyse, efor sırasında ya da yatarken bayıldıysa, başını çarptıysa ya da hamileyse."
    ],
    "dont": [
      "Yüzüne su dökmeyin, tokat atmayın.",
      "Kolonya, soğan ya da başka bir şey koklatmayın.",
      "Tamamen kendine gelmeden yiyecek ya da içecek vermeyin.",
      "Göğüs ağrısı varsa ya da yaralandıysa kas sıkma hareketlerini yaptırmayın."
    ],
    "keywords": [
      "bayılma",
      "bayıldı",
      "bayildi",
      "bayılacak gibi",
      "bayılıyorum",
      "gözü karardı",
      "gözüm kararıyor",
      "tansiyonu düştü",
      "senkop",
      "fenalaştı düştü",
      "kendinden geçti"
    ],
    "sources": [
      "NHS — Fainting",
      "St John Ambulance — Fainting",
      "American Red Cross — Fainting (karşı basınç manevraları)",
      "ILCOR — Bayılma öncesi ilk yardım (karşı basınç manevraları)",
      "Türk Kızılay — Okullarda ilk yardım rehberi (DHA haberi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türk Kızılay okul ilk yardım rehberi (sırtüstü yatır, bacakları 30 cm kaldır, 112; su verme ve kolonya koklatma hatalı), NHS, St John, American Red Cross. Değişiklik: #5 'biraz yükseltin' → 'yaklaşık 30 cm yükseltin' (Kızılay ve şok rehberiyle birlik)." },
    "art": [
      "ilk-yardim-bayilma-oturt",
      "ilk-yardim-bayilma-kas-sik",
      null,
      null,
      "ilk-yardim-bayilma-bacak",
      "ilk-yardim-bayilma-yan-yatir",
      null,
      null
    ]
  }
];
