// Rehber kategorisi: Sel ve heyelan
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "sel",
  "title": "Sel ve heyelan",
  "hint": "Su baskını, toprak kayması, tsunami",
  "art": "cat-sel",
  "color": "#4fa3e0",
  "order": 7
};

export const GUIDES: Guide[] = [
  {
    "id": "sel",
    "title": "Sel ve su baskını",
    "tag": "SEL",
    "summary": "Sel tehlikesinde hemen yüksek bir yere çıkın; akan suya yürüyerek ya da araçla girmeyin.",
    "steps": [
      "Sel uyarısı varsa ya da su yükseliyorsa hemen yüksek bir yere ya da binanın üst katına çıkın.",
      "Bodrum ve zemin kattan hemen çıkın.",
      "Güvenliyse elektrik şalterini ve gaz vanasını kapatın. Su prizlere ulaştıysa şaltere gitmek için suya girmeyin.",
      "Akan suya yürüyerek girmeyin. 15 cm akan su bile insanı devirebilir.",
      "Su basmış yola araçla girmeyin. 30 cm akan su çoğu arabayı sürükler.",
      "Dere yataklarından, alt geçitlerden ve akan suyun üstündeki köprülerden uzak durun.",
      "Mahsur kaldıysanız en üst kata çıkın. Çatıya yalnızca gerekirse çıkın ve oradan işaret verin.",
      "112'yi arayıp yerinizi bildirin.",
      "Suya düşmüş elektrik tellerinden uzak durun; su elektrik iletebilir.",
      "Yetkililer izin vermeden eve dönmeyin."
    ],
    "dont": [
      "Selin önünde fotoğraf ya da video çekmek için durmayın.",
      "Çocukların sel suyunda oynamasına izin vermeyin.",
      "Çıkışı olmayan kapalı tavan arasına sığınmayın; su yükselirse mahsur kalırsınız.",
      "Bariyerin etrafından dolaşıp su basmış yola girmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "sel",
      "sel geldi",
      "sel var",
      "su baskını",
      "taşkın",
      "dere taştı",
      "su bastı",
      "evi su bastı",
      "bodrumu su bastı",
      "sokakları su bastı",
      "su yükseliyor",
      "sağanak sel",
      "sel felaketi",
      "su basıyor"
    ],
    "sources": [
      "AFAD — Afet Bilinci Eğitimi",
      "AFAD — Sel öncesi, anı ve sonrası öneriler (Türkiye Gazetesi, Yeni Akit alıntıları)",
      "Ready.gov — Floods",
      "ABD Ulusal Hava Servisi (NWS) — Turn Around Don't Drown",
      "NWS — Flood Safety: During",
      "Amerikan Kızılhaçı — Flood Safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD sel mesajı (Türkiye Gazetesi, Yeni Akit alıntıları: yüksek ve güvenli yere gitme, elektrikten uzak durma, su basmış yoldan geçmeme, 'geri dönün' denmeden dönmeme), AFAD Trabzon İl Md. (20 cm hızlı akan su insanı sürükler); Ready.gov, NWS. Çelişki yok."
    },
    "art": [
      "sel-yuksege-cik",
      null,
      null,
      "sel-akan-su-yasak",
      "sel-arac-yasak",
      null,
      "sel-cati-isaret",
      "call-112",
      "sel-elektrik-teli",
      null
    ]
  },
  {
    "id": "heyelan",
    "title": "Heyelan (toprak kayması)",
    "tag": "SEL",
    "summary": "Yamaçta yeni çatlak, eğilen ağaç ya da artan gürültü fark ederseniz kayma yolundan yana doğru hemen uzaklaşın.",
    "steps": [
      "Uyarı işaretlerine dikkat edin: yerde yeni ve genişleyen çatlaklar, eğilen ağaç ve direkler, ilk kez sıkışan kapı-pencere, yamaç dibinde kabaran toprak, giderek artan gürültü.",
      "İşaret görürseniz hemen uzaklaşın ve 112'ye bildirin.",
      "Kayma yolunun dışına, yana doğru kaçın. Aşağı doğru kaçmayın.",
      "Daha önce kaymamış, düz ve eğimin değişmediği bir yere geçin.",
      "Kaçamıyorsanız sıkıca top gibi kıvrılıp başınızı koruyun.",
      "Kayma durduktan sonra bölgeye girmeyin; yeni kaymalar olabilir.",
      "Kayan alanda kalanlar varsa alana girmeden yerlerini kurtarma ekiplerine bildirin.",
      "Kırılan su, gaz ve elektrik hatlarını yetkililere bildirin.",
      "Heyelandan sonra sel olabilir; dere yataklarından uzak durun."
    ],
    "dont": [
      "Yoğun yağmurda dik yamaç altında ve dere yatağında beklemeyin.",
      "Kayan toprağın üzerinde yürümeyin.",
      "Eşya kurtarmak için kayma alanına girmeyin."
    ],
    "callEmergency": true,
    "keywords": [
      "heyelan",
      "toprak kayması",
      "toprak kaydı",
      "yamaç kaydı",
      "dağ kayıyor",
      "kaya düşmesi",
      "taş düşüyor",
      "yol çöktü",
      "bahçede çatlak açıldı",
      "yamaçta çatlak",
      "evin arkası kayıyor",
      "heyalan"
    ],
    "sources": [
      "AFAD — Heyelan",
      "FEMA — Landslide and Debris Flow",
      "USGS — Landslide Preparedness",
      "Washington DNR — Landslides"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: USGS Landslide Preparedness (uyarı işaretleri, yoldan çıkma, kayma alanına girmeme, hat arızalarını bildirme, sonrasında sel), Washington DNR. 'Top gibi kıvrılma' bu oturumda yalnızca önceki FEMA notuna dayanıyor."
    },
    "art": [
      "sel-heyelan-isaretler",
      "call-112",
      "sel-heyelan-yana-kac",
      null,
      "sel-heyelan-top-ol",
      null,
      null,
      null,
      null
    ]
  },
  {
    "id": "sel-tsunami",
    "title": "Tsunami (dev dalga): Marmara ve Ege kıyıları",
    "tag": "TSUNAMİ",
    "summary": "Kıyıda güçlü ya da uzun bir deprem hissederseniz veya deniz aniden çekilirse uyarı beklemeden hemen yürüyerek yükseğe ve içeriye gidin.",
    "steps": [
      "Kıyıdayken deprem olursa önce Çök-Kapan-Tutun yapın.",
      "Sahilde ya da suyun hemen yanındaysanız, sarsıntı hafif ya da kısa olsa bile durur durmaz kıyıdan uzaklaşın. Resmi uyarıyı beklemeyin; Marmara ve Ege'de dalga birkaç dakikada gelebilir.",
      "Deniz aniden çekilirse, denizden gürültü gelirse ya da su tuhaf hareket ederse hemen kaçın. Çekilen denize bakmaya gitmeyin.",
      "Yürüyerek ya da koşarak yükseğe ve kıyıdan içeriye gidin. Ne kadar yükseğe, o kadar güvenli.",
      "Yükseğe çıkamıyorsanız sağlam, betonarme ve çok katlı bir binanın üst katlarına çıkın.",
      "Suya kapılırsanız yüzen bir şeye tutunun.",
      "Tsunami tek dalga değildir. İlk dalga en büyüğü olmayabilir; tehlike saatlerce sürebilir.",
      "Yetkililer güvenli diyene kadar kıyıya dönmeyin.",
      "Önceden: yaşadığınız ya da tatil yaptığınız sahilde en yakın yüksek yeri, oraya yürüme yolunu ve varsa tsunami tahliye tabelalarını öğrenin."
    ],
    "dont": [
      "Deniz çekildiğinde kıyıya inip balık, kabuk toplamayın ya da izlemeyin.",
      "Kaçmak için araca binmeyin; kıyı yolları hemen tıkanır.",
      "İlk dalga geçti diye kıyıya geri dönmeyin.",
      "Dere ve nehir ağızlarına yakın durmayın; dalga buralardan içeri girer."
    ],
    "callEmergency": false,
    "keywords": [
      "tsunami",
      "tsunami geliyor",
      "dev dalga",
      "deniz çekildi",
      "deniz cekildi",
      "deniz geri çekiliyor",
      "sahilde deprem",
      "kıyıda deprem",
      "deniz kenarında deprem",
      "marmara tsunami",
      "ege tsunami",
      "dalga kabardı deprem",
      "tusunami",
      "sunami"
    ],
    "sources": [
      "Kandilli Rasathanesi (BDTİM) — Tsunami Bilgi Notu",
      "Kandilli / AFAD — Marmara tsunami uyarı sistemi (7 dakikada uyarı, uyarı beklemeden yükseğe çıkma; NTV haberi)",
      "ODTÜ (Prof. A. C. Yalçıner) — Marmara tsunami ve tahliye tabelaları (cumhuriyet.com.tr)",
      "ABD Ulusal Hava Servisi (NWS) — Tsunami Safety",
      "CDC — Stay Safe During an Earthquake (near the shore)",
      "NWS — Tsunami: During / Before",
      "Amerikan Kızılhaçı — Tsunami",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Kandilli/AFAD (uyarı ~7 dakikada; kıyıdaysanız uyarı beklemeyin, çekilen denizi izlemeye gitmeyin, yükseğe çıkın), ODTÜ Yalçıner (deniz önce çekilebilir; tahliye tabelalarını izleyin; dere ağızları, dolgu alanları ve limanlar tehlikeli); NWS, Kızılhaç. Tahliye tabelaları adım 9'a eklendi. Marmara/Ege varış süresi sayıyla doğrulanamadı."
    },
    "alsoIn": [
      "deprem"
    ],
    "art": [
      null,
      "sel-tsunami-kiyidan-uzaklas",
      "sel-tsunami-deniz-cekiliyor",
      "sel-tsunami-yokus",
      "sel-tsunami-bina-ust-kat",
      null,
      null,
      "sel-tsunami-donme",
      null
    ]
  },
  {
    "id": "sel-akintiya-kapilma",
    "title": "Sel suyuna ya da akıntıya kapılırsanız",
    "tag": "SEL",
    "summary": "Sırtüstü süzülün, ayaklarınız önde ve akıntı yönünde olsun; kıyıya çapraz ilerleyin ve sığ, yavaş suya gelmeden ayağa kalkmayın.",
    "steps": [
      "Panikle çırpınmayın. Sırtüstü süzülüp nefesinizi toparlayın.",
      "Sizi aşağı çeken ağır çanta ya da yükü bırakın.",
      "Ayaklarınız önde ve akıntı yönünde olsun. Ayaklarınızı yüzeye yakın tutup çarpacağınız şeyleri ayakla itin.",
      "Akıntıya karşı yüzmeyin. Akıntıyla giderken kıyıya doğru çapraz ilerleyin.",
      "Sığ ve yavaş akan suya gelene kadar ayağa kalkmayın; ayağınız taşlara sıkışabilir.",
      "Yüzen bir şeye (kütük, bidon, kapı) tutunun.",
      "Sağlam bir ağaca, çatıya ya da adacığa çıkabilirseniz çıkın ve orada yardım bekleyin.",
      "Biri suya kapıldıysa peşinden suya girmeyin. 112'yi arayın; kıyıdan ip, dal ya da yüzen bir şey uzatın veya atın.",
      "Sudan çıkınca ıslak giysileri çıkarın, ısının ve yaralarınıza baktırın."
    ],
    "dont": [
      "Akıntıda ayağa kalkmaya çalışmayın.",
      "Kapılan kişiyi kurtarmak için suya atlamayın.",
      "Akıntının içindeki ağaç dallarının ve çitlerin içine doğru yüzmeyin; takılırsınız.",
      "Köprü ayaklarına ve menfez ağızlarına yaklaşmayın; su sizi içine çeker."
    ],
    "callEmergency": true,
    "keywords": [
      "sele kapıldım",
      "sele kapıldı",
      "sel sürükledi",
      "akıntıya kapıldım",
      "akıntıya kapıldı",
      "dere sürükledi",
      "suya kapıldı",
      "su beni sürüklüyor",
      "nehre düştüm",
      "dereye düştü",
      "sel suyuna düştü",
      "akıntıda ne yapılır"
    ],
    "sources": [
      "Pueblo İtfaiyesi — River Safety",
      "RNLI — Float to Live",
      "NWS — Flood Safety: During",
      "Ready.gov — Floods",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: NWS Flood During (mahsur kalınca en yüksek noktaya çık, 112), RNLI Float to Live (sırtüstü süzülme, sakinleşme). Akarsu öz-kurtarma ayrıntıları (ayaklar önde, çapraz, ayağa kalkmama) bu oturumda yeni kaynakla teyit edilemedi; önceki Pueblo itfaiyesi denetimine dayanıyor."
    },
    "art": [
      "sel-akinti-sirtustu",
      null,
      "sel-akinti-ayaklar-onde",
      "sel-akinti-capraz",
      "sel-akinti-ayaga-kalkma",
      null,
      null,
      "sel-akinti-ip-at",
      null
    ]
  },
  {
    "id": "sel-sonrasi-temizlik",
    "title": "Sel sonrası eve dönüş ve temizlik",
    "tag": "SEL",
    "summary": "Yetkililer izin verince dönün; elektriği kontrol ettirmeden açmayın, korunarak temizleyin ve sel suyuna değen gıdayı atın.",
    "steps": [
      "Yetkililer güvenli demeden eve dönmeyin.",
      "Girmeden önce binayı dışarıdan kontrol edin: çatlak, çökme, kopuk kablo, gaz kokusu. Gaz kokusu varsa girmeyin.",
      "Şalteri kapalı tutun. Islanan tesisatı ve cihazları elektrikçiye kontrol ettirmeden çalıştırmayın.",
      "Lastik çizme, kalın eldiven, gözlük ve N95 maske takın.",
      "Sel suyuna değen bütün yiyecekleri, konserveler dahil, atın.",
      "Musluk suyunu yetkililer güvenli diyene kadar içmeyin; kaynatın ya da arıtın.",
      "Islak eşyaları 24–48 saat içinde kurutun. Kurutamadığınız halı, şilte ve alçıpanı atın.",
      "Yüzeyleri, 4 litre suya en fazla 1 su bardağı çamaşır suyu katarak silin. Pencereleri açık tutun.",
      "Jeneratörü ve mangalı asla kapalı yerde çalıştırmayın; karbonmonoksit öldürür.",
      "Ellerinizi sık sık sabunla yıkayın. Yaraları sel suyundan koruyun."
    ],
    "dont": [
      "Çamaşır suyunu amonyaklı ya da başka temizlik ürünüyle karıştırmayın; zehirli gaz çıkar.",
      "Islakken ya da suyun içinde dururken elektrikli cihazlara dokunmayın.",
      "Çocukların, astımlıların ve bağışıklığı zayıf kişilerin temizlik yapmasına izin vermeyin.",
      "Kanalizasyon sağlam olduğundan emin olmadan tuvaleti kullanmayın."
    ],
    "keywords": [
      "sel sonrası",
      "sel sonrasi",
      "selden sonra",
      "sel bitti",
      "su çekildi",
      "selden sonra eve dönüş",
      "sel sonrası temizlik",
      "evi su bastı temizlik",
      "çamur temizliği",
      "küf",
      "rutubet küf",
      "sel suyu değdi yiyecek",
      "ıslak eşya",
      "çamaşır suyu oranı"
    ],
    "sources": [
      "Ready.gov — Floods (After)",
      "CDC — Cleaning mold after a flood",
      "FLASH — Inspect your home after a disaster",
      "CDC — Keep Food Safe After a Disaster",
      "NWS — Flood Safety: After",
      "Amerikan Kızılhaçı — Flood Safety",
      "AFAD — Sel sonrası öneriler (Türkiye Gazetesi, Yeni Akit alıntıları)",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD (sel suyuyla temas etmiş yiyecekler konserveler dahil kullanılmasın; 'geri dönün' denmeden dönmeyin; gaz ve su altında kalmış elektrik aksamına dikkat; pilli fener; hasar fotoğrafı). Gıda adımı AFAD'a göre 'konserveler dahil' yapıldı (CDC hasarsız konserveyi dezenfekte ederek kullanmaya izin verir). Önceki: CDC Mold (galon başına en fazla 1 fincan çamaşır suyu, amonyakla karıştırma), CDC gıda güvenliği (sel suyuna değen gıda, şişkin/hasarlı konserve), Kızılhaç (N95, 24–48 saat), NWS After (elektrikçi, jeneratör, kaynatma), Ready.gov (çocuk/astımlı temizlik yapmasın)."
    },
    "art": [
      null,
      "sel-sonrasi-dis-kontrol",
      "power-off",
      "sel-sonrasi-koruyucu",
      "sel-sonrasi-gida-at",
      null,
      null,
      "sel-sonrasi-camasir-suyu",
      null,
      "sel-sonrasi-el-yika"
    ]
  },
  {
    "id": "sel-camur-akisi",
    "title": "Çamur ve moloz akışı",
    "tag": "SEL",
    "summary": "Şiddetli yağmurda dere yatağında ve yamaç altında durmayın; gürültü duyar ya da dere aniden bulanıklaşırsa akış yolundan yana doğru hemen uzaklaşın.",
    "steps": [
      "Şiddetli yağmur uyarısında dere yatağı, vadi tabanı ya da dik yamaç altındaysanız erkenden ayrılın.",
      "Uzun yağmurdan sonra gelen ani, şiddetli sağanağa özellikle dikkat edin. Böyle gecelerde uyumayın, uyanık kalın.",
      "Dere suyu aniden çamurlaşırsa ya da birden artar veya azalırsa hemen uzaklaşın.",
      "Gürleme, taş ve ağaç kırılma sesi duyarsanız beklemeden kaçın.",
      "Akış yolundan yana doğru, yüksek ve düz bir yere kaçın. Akışın önünde aşağı doğru koşmayın.",
      "Evde mahsur kaldıysanız üst kata çıkın ve akışın geldiği yöne bakmayan odaya geçin.",
      "Kaçamıyorsanız sıkıca top gibi kıvrılıp başınızı koruyun.",
      "Araçlayken çöken asfalta, çamura ve düşen taşlara dikkat edin. Çamurla kaplı yola girmeyin.",
      "Akış durduktan sonra bölgeye girmeyin. Mahsur kalanları 112'ye bildirin."
    ],
    "dont": [
      "Yağmur sürerken dere yatağında çadır kurmayın, araç park etmeyin.",
      "Çamur akışını izlemek için dere kenarına yaklaşmayın.",
      "Çamurun içinden yürüyerek ya da araçla geçmeye çalışmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "çamur akışı",
      "camur akisi",
      "çamur seli",
      "sel çamuru geliyor",
      "moloz akışı",
      "dereden çamur geliyor",
      "dere bulanıklaştı",
      "çamur deresi",
      "taş ve çamur akıyor",
      "yamaçtan çamur akıyor",
      "çamurla gelen sel"
    ],
    "sources": [
      "FEMA — Landslide and Debris Flow",
      "USGS — Landslide Preparedness",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: USGS Landslide Preparedness (derede ani yükselme/azalma ve bulanıklaşma, artan gürleme, ağaç-kaya sesi, uyanık kalma, ikinci kata çıkma, yoldan çıkma, taşkın dereyi geçmeme). 'Akışa bakmayan oda' ve 'top gibi kıvrılma' bu oturumda teyit edilemedi."
    },
    "art": [
      "sel-camur-dere-yatagi",
      null,
      "sel-camur-dere-bulanik",
      null,
      "sel-camur-yana-kac",
      "sel-camur-ust-kat",
      "sel-camur-top-ol",
      null,
      null
    ]
  },
  {
    "id": "sel-arac",
    "title": "Araçla sele yakalanırsanız",
    "tag": "SEL",
    "summary": "Su basmış yola girmeyin; araç suda kalır ve su içeri dolarsa hemen kemeri çözün, camı açın, çıkıp aracın tavanına ya da yükseğe çıkın.",
    "steps": [
      "Su basmış yola, alt geçide ve dere geçidine girmeyin; geri dönün. 30 cm akan su arabayı sürükler.",
      "Bariyerin ya da şeridin etrafından dolaşmayın. Suyun altında yol çökmüş olabilir.",
      "Araç sığ ve durgun suda stop ettiyse ve su yükseliyorsa hemen inip yürüyerek yükseğe çıkın.",
      "Araç hızlı akan suda sürükleniyorsa içinde kalın. Su içeri dolmaya başlarsa camdan aracın tavanına çıkın.",
      "Araç batıyorsa hemen emniyet kemerini çözün.",
      "Su cam hizasına gelmeden camı açın ya da kırın. Kapıyı açmaya uğraşmayın.",
      "Çocukları kemerden çözüp camdan dışarı çıkarın, sonra siz çıkın.",
      "Aracın tavanına ya da güvenli bir yükseğe çıkıp 112'yi arayın."
    ],
    "dont": [
      "\"Benim aracım yüksek, geçer\" diye su basmış yola girmeyin; 60 cm akan su SUV ve kamyoneti de sürükler.",
      "Batmakta olan araçta telefonla vakit kaybetmeyin; önce çıkın.",
      "Hızlı akan suya inip yürümeye çalışmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "araçla sel",
      "arabayla sele kapıldım",
      "araba sel suyunda",
      "sel suyunda araç",
      "araba suda kaldı sel",
      "alt geçit su doldu",
      "araç su basmış yolda",
      "su basmış yoldan geçilir mi",
      "arabayı sel götürüyor",
      "araç selde stop etti",
      "sel arabayı sürüklüyor"
    ],
    "sources": [
      "Ready.gov — Floods (car trapped in water)",
      "AFAD Trabzon İl Müdürlüğü — Sele araçta kapılırsanız (cumhuriyet.com.tr)",
      "ABD Ulusal Hava Servisi (NWS) — Turn Around Don't Drown",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD (su basmış yoldan geçmeyin; araç arızalanırsa çıkıp yükseğe geçin), AFAD Trabzon İl Md. (hızlı akan suda araçtan inmeyin, 20 cm akan su insanı, tekerin yarısına gelen su aracı sürükler; cumhuriyet.com.tr). Önceki: Ready.gov Floods (hızlı akan suda içeride kal, su dolarsa tavana çık, bariyer), NWS Turn Around Don't Drown (30 cm çoğu araba, 60 cm SUV/kamyonet, yol çökmüş olabilir). Batan araçtan çıkış sırası (kemer-cam-çocuk-çık) bu oturumda kaynakla teyit edilemedi; uzman bakmalı."
    },
    "alsoIn": [
      "ulasim"
    ],
    "art": [
      "sel-arac-yasak",
      null,
      null,
      "sel-arac-tavan",
      "sel-arac-kemer",
      "sel-arac-cam",
      null,
      "call-112"
    ]
  },
  {
    "id": "sel-uyarisi",
    "title": "Sel uyarısı geldiğinde (sel öncesi hazırlık)",
    "tag": "SEL",
    "summary": "Meteoroloji ya da AFAD sel uyarısı verdiyse eşyaları yükseğe kaldırın, afet çantanızı hazırlayın ve tahliyeye hazır olun.",
    "steps": [
      "Meteoroloji'nin (MGM) sarı, turuncu ve kırmızı uyarılarını, AFAD ve valilik duyurularını telefondan ve radyodan izleyin.",
      "Dere yatağında, alçak yerde ya da bodrum katta yaşıyorsanız yağış başlamadan yüksek bir yere geçin.",
      "Afet çantanızı, ilaçlarınızı, kimliğinizi ve önemli belgeleri su geçirmez poşete koyup hazır tutun.",
      "Değerli eşyaları ve elektrikli cihazları üst kata ya da yüksek raflara kaldırın.",
      "Aracınızı dere kenarından ve alçak yerlerden yükseğe çekin.",
      "Yağış sürerken geceyi bodrum ya da zemin katta geçirmeyin.",
      "Bahçede ve balkonda suyun sürükleyebileceği eşyaları içeri alın ya da bağlayın.",
      "Tahliye denirse hemen ayrılın. Zaman varsa ve suya basmadan yapabiliyorsanız çıkmadan elektriği ve gazı kapatın.",
      "Komşularınızı, özellikle yaşlıları ve engelli kişileri uyarın."
    ],
    "dont": [
      "Uyarıyı \"burada sel olmaz\" diye önemsiz saymayın.",
      "Şiddetli yağışta dere kenarında piknik yapmayın, çadır kurmayın.",
      "Tahliye sırasında su basmış yoldan geçmeye çalışmayın."
    ],
    "keywords": [
      "sel uyarısı",
      "sel uyarisi",
      "meteoroloji uyarısı",
      "turuncu uyarı",
      "kırmızı uyarı",
      "kuvvetli yağış uyarısı",
      "sağanak uyarısı",
      "sel gelecek",
      "sel öncesi",
      "selden önce hazırlık",
      "sel riski",
      "seli bekliyoruz"
    ],
    "sources": [
      "MGM — Meteorolojik Uyarı Sistemi",
      "Ready.gov — Floods",
      "NWS — Flood Safety: During",
      "AFAD — Afet Bilinci Eğitimi"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD sel mesajı (sel riskini öğrenin, dere yatağına yerleşmeyin, uyarıları sosyal medya/radyo/TV'den izleyin); değişiklik yok. Önceki: MGM MeteoUyarı (sarı az tehlikeli, turuncu tehlikeli, kırmızı çok tehlikeli), Ready.gov Floods (belgeleri su geçirmez kapta tut, değerlileri yükseğe kaldır, tahliyede hemen çık), NWS Flood During (zaman varsa tesisatı kapat)."
    },
    "alsoIn": [
      "hazirlik"
    ],
    "art": [
      "sel-uyari-radyo",
      "sel-uyari-bodrum-cik",
      "sel-uyari-belge-poset",
      "sel-uyari-esya-yukari",
      null,
      null,
      null,
      null,
      null
    ]
  }
];
