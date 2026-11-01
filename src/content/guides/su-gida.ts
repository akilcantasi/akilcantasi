// Rehber kategorisi: Su ve gıda
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "su-gida",
  "title": "Su ve gıda",
  "hint": "Su arıtma, depolama, bozulan gıda",
  "art": "cat-su-gida",
  "color": "#38bdf8",
  "order": 9
};

export const GUIDES: Guide[] = [
  {
    "id": "su-aritma",
    "title": "Su arıtma: içme suyunu güvenli hale getirme",
    "tag": "SU & GIDA",
    "summary": "Temiz olduğundan emin olmadığınız suyu içmeden önce kaynatın ya da parfümsüz çamaşır suyuyla arıtın.",
    "steps": [
      "Mümkünse kapalı şişe su için.",
      "Su bulanıksa önce temiz bir bezden süzün ya da bekletip üstteki berrak kısmı alın.",
      "En güvenli yol kaynatmak: suyu fokur fokur kaynatın ve 1 dakika kaynamaya bırakın. 2000 metreden yüksek yerlerde 3 dakika kaynatın.",
      "Kaynatamıyorsanız çamaşır suyu kullanın. Etikette \"sodyum hipoklorit\" yazmalı; parfümsüz ve katkısız olmalı.",
      "Berrak suya 1 litre için 2 damla damlatın. Su bulanık ya da çok soğuksa 1 litreye 4 damla damlatın. Etikette %1 gibi düşük oran yazıyorsa 1 litreye 10 damla damlatın.",
      "Karıştırın, kabın ağzını kapatın ve en az 30 dakika bekleyin. Suda hafif klor kokusu olmalı.",
      "Koku yoksa aynı miktarı bir kez daha ekleyin ve 15 dakika daha bekleyin.",
      "Arıtma tableti varsa paketindeki talimata aynen uyun.",
      "Arıttığınız suyu temiz ve kapaklı kaplarda saklayın.",
      "Yakıt, kimyasal ya da zehirli maddeyle kirlenmiş suyu kaynatmak da çamaşır suyu da temizlemez. Bu suyu içmeyin."
    ],
    "dont": [
      "\"Sıfır klor\" ya da \"klorsuz\" yazan, parfümlü, renkli veya deterjan katkılı çamaşır suyu kullanmayın; suyu arıtmaz.",
      "Önerilenden fazla çamaşır suyu koymayın.",
      "Dere, kuyu ya da sel suyunu arıtmadan içmeyin.",
      "Çamaşır suyunu tuz ruhu, kireç çözücü gibi başka temizlik ürünleriyle karıştırmayın; zehirli gaz çıkar."
    ],
    "keywords": [
      "su arıtma",
      "suyu arıtma",
      "içme suyu",
      "içilebilir su",
      "su içilebilir mi",
      "temiz su",
      "su kaynatma",
      "suyu kaynatmak",
      "çamaşır suyu kaç damla",
      "çamaşır suyuyla su arıtma",
      "klor",
      "klorlama",
      "pis su",
      "kirli su",
      "musluk suyu içilir mi",
      "şebeke suyu",
      "su içilir mi",
      "suyu içebilir miyim",
      "arıtma tableti",
      "kuyu suyu"
    ],
    "sources": [
      "CDC — Make Water Safe During an Emergency",
      "EPA — Emergency Disinfection of Drinking Water",
      "Hacettepe Üniv. Halk Sağlığı AD — Afet bilgi notu: fekal-oral hastalıklar (Karadoğan & Çakır 2023)",
      "T.C. Sağlık Bakanlığı — Deprem bölgesi bilgilendirme broşürü (kaynatma, %1 klor çözeltisi)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Hacettepe Halk Sağlığı afet bilgi notu (%5–9 çamaşır suyunda litreye 2 damla, %1'de 10 damla, 30 dk bekleme; en az 1 dk kaynatma; oran ürüne göre değişir, etiketi okuyun), Sağlık Bakanlığı deprem broşürü (en az 1 dk kaynatma). Değişiklik yok. Önceki tur: CDC Make Water Safe (1 dk / 6500 ft üstü 3 dk; %5–9 için 8 damla/galon, %1 için 40 damla/galon; bulanıkta süz + iki kat; 30 dk), EPA Emergency Disinfection (1 L için 2 damla; bulanık/renkli/soğukta iki kat; koku yoksa tekrar + 15 dk; parfümlü/katkılı çamaşır suyu yok)."
    },
    "art": [
      null,
      "su-gida-bezden-suzme",
      "boil-water",
      "su-gida-camasir-suyu-etiket",
      "su-gida-damla-litre",
      "su-gida-bekle-30",
      null,
      null,
      "su-gida-kapakli-bidon",
      null
    ]
  },
  {
    "id": "gida-guvenligi",
    "title": "Elektrik kesintisinde bozulan gıda",
    "tag": "SU & GIDA",
    "summary": "Elektrik kesildiğinde buzdolabını kapalı tutun ve 4 saatten uzun soğuksuz kalan çabuk bozulan yiyecekleri atın.",
    "steps": [
      "Buzdolabının ve dondurucunun kapağını mümkün olduğunca açmayın.",
      "Kapalı bir buzdolabı yiyecekleri yaklaşık 4 saat soğuk tutar. Dolu bir dondurucu yaklaşık 48 saat, yarı dolu bir dondurucu yaklaşık 24 saat dayanır.",
      "Önce buzdolabındaki çabuk bozulan yiyecekleri tüketin. Konserve ve kuru gıdaları sonraya bırakın.",
      "Et, tavuk, balık, yumurta, süt ürünleri ve pişmiş yemek 4 saatten uzun süre soğuksuz kaldıysa atın.",
      "Dondurucudaki yiyecekte hâlâ buz kristali varsa yeniden dondurabilirsiniz.",
      "Kokusu, rengi ya da kıvamı değişmiş yiyeceği yemeyin.",
      "Şişmiş, paslı, ezik ya da sızdıran konserveyi açmayın, atın.",
      "Sel suyuna değmiş, ambalajı açık ya da kapağı sızdıran gıdaları atın.",
      "Yemekten ve yemeğe dokunmadan önce ellerinizi temiz su ve sabunla yıkayın.",
      "Bebek için hazır sıvı mama en güvenlisidir. Toz mamayı 1 dakika fokurdayarak kaynatıp en çok 30 dakika beklettiğiniz sıcak suyla hazırlayın (şişe suyu da kaynatılmalı), vermeden önce soğutun."
    ],
    "dont": [
      "Bozulup bozulmadığını tadına bakarak anlamaya çalışmayın.",
      "Şüpheli yiyeceği \"pişirirsem geçer\" diye yemeyin; pişirmek her zehri yok etmez.",
      "Pişmiş yemeği oda sıcaklığında saatlerce bekletmeyin."
    ],
    "keywords": [
      "gıda güvenliği",
      "bozuk yemek",
      "yemek bozuldu mu",
      "bozuldu mu",
      "buzdolabı",
      "buzdolabı çalışmıyor",
      "elektrik gitti buzdolabı",
      "buzdolabındaki yemekler",
      "dondurucu",
      "derin dondurucu",
      "et çözüldü",
      "şişmiş konserve",
      "konserve şişti",
      "son kullanma",
      "bebek maması",
      "besin zehirlenmesi"
    ],
    "sources": [
      "FoodSafety.gov — Food Safety During a Power Outage",
      "Ready.gov (FEMA) — Food"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: FoodSafety.gov Power Outage (buzdolabı 4 saat, dolu dondurucu 48 / yarı dolu 24 saat, 4 saat sonra çabuk bozulanları at, buz kristali varsa yeniden dondur, tadına bakma), Ready.gov Food (hazır sıvı mama, şişmiş/ezik/paslı konserve, sel suyuna değen gıda)."
    },
    "art": [
      "su-gida-buzdolabi-kapali",
      "su-gida-dondurucu-saat",
      null,
      "su-gida-bozuk-gida-at",
      null,
      null,
      "su-gida-siskin-konserve",
      null,
      "wash-hands",
      null
    ]
  },
  {
    "id": "su-gida-su-depolama",
    "title": "Acil durum için su depolama",
    "tag": "SU & GIDA",
    "summary": "Kişi başı günde en az 4–5 litre suyu en az 3 gün, mümkünse 2 hafta yetecek kadar temiz ve kapaklı kaplarda saklayın.",
    "steps": [
      "Kişi başı günde en az 4–5 litre su ayırın: içmek, yemek ve temel temizlik için.",
      "En az 3 günlük, mümkünse 2 haftalık su biriktirin. Örnek: 4 kişilik aileye 3 gün için 48–60 litre.",
      "Çocuk, hamile, emziren, hasta kişiler ve sıcak hava için daha fazla ayırın. Evcil hayvanları da sayın.",
      "En kolayı kapalı şişe ya da damacana su almaktır. Ambalajı açmayın, son kullanma tarihini izleyin.",
      "Kendi kabınızı dolduracaksanız gıdaya uygun, kırılmaz, kapağı sıkı kapanan bir bidon kullanın.",
      "Bidonu deterjanla yıkayıp durulayın. Sonra 1 litre suya 1 çay kaşığı parfümsüz çamaşır suyu katın, bidonun ağzını kapatıp çalkalayın, 30 saniye bekleyip boşaltın ve kurumaya bırakın.",
      "Bidonu temiz şebeke suyuyla doldurun ve üzerine \"İÇME SUYU\" ile doldurma tarihini yazın.",
      "Bidonları serin, karanlık bir yerde saklayın. Güneşten, benzinden ve tarım ilacından uzak tutun.",
      "Kendi doldurduğunuz suyu 6 ayda bir yenileyin.",
      "Afette suyu aşırı kısmayın: bugün ihtiyacınız kadar için, yarın için yeni su arayın."
    ],
    "dont": [
      "Daha önce çamaşır suyu, tarım ilacı ya da başka kimyasal konmuş kapları kullanmayın.",
      "Cam şişe gibi kırılabilen kaplara güvenmeyin.",
      "Bidonları güneş alan balkonda ya da araç içinde bırakmayın."
    ],
    "keywords": [
      "su depolama",
      "su stoklama",
      "su stoğu",
      "su stoklamak",
      "kaç litre su",
      "ne kadar su",
      "kişi başı su",
      "su biriktirme",
      "su saklama",
      "su ne kadar dayanır",
      "su kaç ay saklanır",
      "yedek su",
      "bidon",
      "damacana",
      "su bidonu"
    ],
    "sources": [
      "CDC — How to Create and Store an Emergency Water Supply",
      "Ready.gov (FEMA) — Water"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC Create and Store an Emergency Water Supply (1 galon ≈ 3,8 L/kişi/gün, 3 gün–2 hafta; kimyasal/çamaşır suyu kabı ve cam yok; 1 çay kaşığı/1 quart, çalkala, 30 sn, kurut; etiket, serin ve güneşsiz yer, 6 ayda yenile), Ready.gov Water (suyu kısmayın)."
    },
    "art": [
      "su-gida-kisi-gun-litre",
      "su-gida-3-gun-bidonlar",
      null,
      "su-gida-sise-su",
      null,
      "su-gida-bidon-temizleme",
      "su-gida-bidon-etiket",
      "su-gida-serin-yer",
      null,
      null
    ]
  },
  {
    "id": "su-gida-evdeki-gizli-su",
    "title": "Sular kesilince evdeki gizli su kaynakları",
    "tag": "SU & GIDA",
    "summary": "Musluklar kesildiğinde borulardaki, termosifondaki ve rezervuardaki temiz suyu kullanın; kalorifer ve klozet çanağı suyunu asla içmeyin.",
    "steps": [
      "Şebekenin kirlendiği duyurulduysa ana su vanasını kapatın; evdeki temiz su kirli suyla karışmasın.",
      "Borulardaki suyu almak için evin en yüksekteki musluğunu açın; borulara hava girsin.",
      "Suyu evin en alçaktaki musluğundan temiz bir kaba alın.",
      "Termosifon (depolu su ısıtıcı) varsa içindeki su kullanılabilir. Önce elektriğini kapatın. Kombi ve şofbenin deposu yoktur.",
      "Termosifonun soğuk su giriş vanasını kapatın, bir sıcak su musluğunu açın, sonra alttaki boşaltma musluğundan suyu kaba alın. Su sıcak olabilir; eldiven takın.",
      "Klozetin rezervuarındaki (üstteki depo) su berraksa ve içine ilaç ya da tablet konmadıysa kullanılabilir. İçmeden önce kaynatın ya da arıtın.",
      "Temiz sudan yapılmış buzları eritip içebilirsiniz. Konserve meyve ve sebzenin suyu da içilebilir.",
      "Bu kaynakların temizliğinden emin değilseniz suyu içmeden önce kaynatın ya da çamaşır suyuyla arıtın.",
      "Kalorifer peteği ve kombi tesisatındaki suyu, havuz ve jakuzi suyunu içmeyin; yalnızca tuvalet ve temizlik için kullanın."
    ],
    "dont": [
      "Klozet çanağındaki suyu, sel suyunu ya da yakıt kokan suyu içmeyin.",
      "Elektriğini kapatmadan termosifonu boşaltmayın.",
      "İçine mavi tablet ya da temizlik maddesi konmuş rezervuar suyunu içmeyin."
    ],
    "keywords": [
      "sular kesildi",
      "su kesildi",
      "musluktan su gelmiyor",
      "sular akmıyor",
      "evde su kalmadı",
      "termosifon",
      "termosifon suyu",
      "borudaki su",
      "rezervuar suyu",
      "sifon deposu suyu",
      "buz eritme",
      "kalorifer suyu içilir mi",
      "petek suyu",
      "gizli su kaynağı"
    ],
    "sources": [
      "CDC — How to Find Clean Water in an Emergency",
      "Regional Water Providers Consortium — Emergency Water Sources"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: CDC How to Find Clean Water (termosifon, temiz buz, berrak rezervuar suyu, konserve suyu; havuz yalnız temizlik; ana vana), Regional Water Providers Consortium (boru: ana vana, üst musluk, alt musluk; termosifon: enerji kes, giriş vanası, hava al, alt vana, eldiven; rezervuarı güvensiz sayar)."
    },
    "art": [
      "tesisat-su-vanasi-kapat",
      "su-gida-ust-musluk-ac",
      "su-gida-alt-musluk-kap",
      null,
      "su-gida-termosifon-bosalt",
      "su-gida-rezervuar",
      null,
      null,
      "su-gida-kalorifer-yasak"
    ]
  },
  {
    "id": "su-gida-pisirmeden-beslenme",
    "title": "Elektrik ve ocak yokken beslenme",
    "tag": "SU & GIDA",
    "summary": "Pişirmeden yenebilen konserve ve kuru gıdaları seçin, açtığınızı hemen bitirin ve su azsa tuzlu yiyeceklerden kaçının.",
    "steps": [
      "Önce buzdolabındaki çabuk bozulan yiyecekleri yiyin, sonra konserve ve kuru gıdalara geçin.",
      "Hazır konserveler (ton balığı, fasulye, sebze, meyve) kutudan soğuk yenebilir; ısıtmanız gerekmez.",
      "Konserveyi açmadan önce kapağını temiz bir bezle silin. Elle çalışan konserve açacağı kullanın.",
      "Ekmek, galeta, kraker, kuruyemiş, kuru meyve, fıstık ezmesi, tahin ve pekmez pişirme istemez ve enerji verir.",
      "Açtığınız kutuyu tek seferde bitirin. Soğutamıyorsanız artanı 2 saat içinde yiyin ya da atın; hava 32°C'nin üstündeyse 1 saat içinde.",
      "Su azsa tuzlu ve çok baharatlı yiyeceklerden kaçının; susatırlar.",
      "Bebek için hazır sıvı mama en güvenlisidir. Toz mamayı 1 dakika fokurdayarak kaynatıp en çok 30 dakika beklettiğiniz sıcak suyla hazırlayın (şişe suyu da kaynatılmalı), vermeden önce soğutun.",
      "Yemekten önce ellerinizi sabunla yıkayın. Su azsa alkollü el dezenfektanı kullanın.",
      "Isıtmak zorundaysanız kamp ocağını ve mangalı yalnızca açık havada kullanın."
    ],
    "dont": [
      "Şişmiş, ezik, paslı ya da sızdıran konserveyi yemeyin.",
      "Kapalı konserve kutusunu ateşte ısıtmayın; patlayabilir. Önce açın.",
      "Mangal, tüplü ocak ya da kamp ocağını ev, çadır veya araç içinde yakmayın; karbonmonoksit öldürür."
    ],
    "keywords": [
      "pişirmeden yemek",
      "pişirmeden ne yenir",
      "ocak yok",
      "ocaksız yemek",
      "elektrik yok ne yiyeceğiz",
      "konserve yemek",
      "soğuk yemek",
      "kuru gıda",
      "hazır yemek",
      "konserve açacağı",
      "tüp bitti yemek",
      "yemek pişiremiyoruz",
      "ne yiyebilirim"
    ],
    "sources": [
      "Ready.gov (FEMA) — Food",
      "CDC — Preventing Food Poisoning (2 saat / 32°C üstünde 1 saat)",
      "FoodSafety.gov — 4 Steps to Food Safety"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Ready.gov Food (kutudan soğuk yeme, ısıtmadan önce aç, hazır sıvı mama, mangal/kamp ocağı yalnız dışarıda, şişmiş/ezik/paslı kutu), CDC Preventing Food Poisoning ve FoodSafety.gov (2 saat / 32°C üstünde 1 saat). Tuzlu gıda uyarısı doğrulanamadı."
    },
    "art": [
      null,
      "su-gida-konserve-soguk",
      "su-gida-konserve-acacak",
      "su-gida-kuru-gidalar",
      null,
      null,
      null,
      "wash-hands",
      "su-gida-ocak-disarida"
    ]
  },
  {
    "id": "su-gida-sicakta-gida",
    "title": "Sıcak havada yiyecekleri güvende tutma",
    "tag": "SU & GIDA",
    "summary": "Pişmiş ve çabuk bozulan yiyecekleri dışarıda en fazla 2 saat, hava 32°C'den sıcaksa 1 saat bırakın; soğuk tutamıyorsanız hemen tüketin.",
    "steps": [
      "Pişmiş yemeği ve et, süt, yumurta gibi çabuk bozulan yiyecekleri soğuk dışında en fazla 2 saat bırakın.",
      "Hava 32°C'den sıcaksa bu süre 1 saattir. Süre dolunca atın.",
      "Yiyecekleri 5°C'nin altında tutun: buzlu soğutma çantası ya da buz aküsü kullanın.",
      "Soğutma çantasını gölgede tutun, kapağını kısa açın ve eriyen buzu yenileyin.",
      "Bir öğünde bitecek kadar pişirin.",
      "Sıcak servis edilecek yemeği buharı tüterken, 60°C'nin üstünde tutun.",
      "Saklanmış artığı yemeden önce buharı tütene kadar iyice ısıtın.",
      "Çiğ eti, tavuğu ve balığı diğer yiyeceklerden ayrı tutun; ayrı bıçak ve tahta kullanın.",
      "Kokusu, rengi ya da kıvamı değişen yiyeceği yemeyin."
    ],
    "dont": [
      "Bozulup bozulmadığını tadarak anlamaya çalışmayın.",
      "Yiyecekleri güneş alan araç ya da çadır içinde bekletmeyin.",
      "Donmuş eti güneşte ya da oda sıcaklığında çözdürmeyin."
    ],
    "keywords": [
      "sıcakta yemek bozulur mu",
      "sıcakta yiyecek saklama",
      "yaz sıcağında yemek",
      "yemek dışarıda kaldı",
      "kaç saat dışarıda kalabilir",
      "yemek ekşidi",
      "yemek kokuyor",
      "tavuk dışarıda kaldı",
      "soğutma çantası",
      "buz kutusu",
      "buz aküsü",
      "sicakta yemek"
    ],
    "sources": [
      "FoodSafety.gov — 4 Steps to Food Safety",
      "CDC — Preventing Food Poisoning"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: FoodSafety.gov 4 Steps (2 saat, 32°C üstünde 1 saat, buzdolabı 4°C, sıcak tutma 60°C, ayrı tahta; metindeki 5°C WHO değeri, sayfası açılamadı), CDC Preventing Food Poisoning (tehlike aralığı 4–60°C, ısıtınca 74°C, tezgâhta çözdürmeme)."
    },
    "art": [
      "su-gida-saat-2",
      "su-gida-termometre-32",
      "su-gida-sogutma-cantasi",
      null,
      null,
      null,
      null,
      "su-gida-cig-pismis-ayri",
      null
    ]
  },
  {
    "id": "su-gida-toplu-mutfak",
    "title": "Toplu yemek ve aşevi hijyeni",
    "tag": "SU & GIDA",
    "summary": "Toplu yemekte hasta kişiler mutfağa girmesin, eller ve su temiz olsun, çiğ ile pişmiş ayrı tutulsun, yemek iyice pişip sıcak dağıtılsın.",
    "steps": [
      "İshali, kusması, ateşi ya da elinde açık yarası olan kişi yemek hazırlamasın ve dağıtmasın.",
      "Mutfağa girerken, çiğ yiyeceğe dokunduktan sonra ve tuvaletten sonra elleri sabunla en az 20 saniye yıkayın.",
      "Yemekte, bulaşıkta ve sebze yıkarken yalnızca güvenli içme suyu kullanın.",
      "Çiğ et, tavuk ve balık için ayrı bıçak, tahta ve kap kullanın.",
      "Yemeği iyice pişirin; çorba ve sulu yemekleri kaynatın.",
      "Pişen yemeği 2 saat içinde, buharı tüterken dağıtın. Bekleyecekse 60°C'nin üstünde sıcak tutun.",
      "Soğutamadığınız artık yemeği saklamayın, atın.",
      "Çiğ sebze dağıtmayın. Meyveyi kişinin kendisinin soyabileceği şekilde verin.",
      "Mutfağı yaşam çadırlarından en az 6 metre uzağa kurun ve yanında yangın söndürücü bulundurun.",
      "Çöpü kapaklı kovada toplayın, her gün mutfaktan uzaklaştırın; sinekleri yiyecekten uzak tutun."
    ],
    "dont": [
      "Yaşam çadırlarının içinde yemek pişirmeyin.",
      "Pişmiş yemeği çiğ etin değdiği tahtaya ya da kaba koymayın.",
      "Soğutulmadan bekletilmiş dünkü yemeği yeniden dağıtmayın."
    ],
    "keywords": [
      "kamp mutfağı",
      "toplu yemek",
      "toplu yemek hijyeni",
      "aşevi",
      "çadırkent mutfağı",
      "seyyar mutfak",
      "yemek dağıtımı",
      "kazan yemeği",
      "mutfak hijyeni",
      "gönüllü mutfak",
      "kalabalığa yemek",
      "toplu beslenme",
      "asevi"
    ],
    "sources": [
      "WHO — Gıda güvenliğinin beş anahtarı",
      "FoodSafety.gov — 4 Steps to Food Safety",
      "T.C. Sağlık Bakanlığı HSGM — Afetlerde Çevre Sağlığı Uygulamaları (2024)",
      "T.C. Sağlık Bakanlığı — Afetlerde genel sağlık önerileri"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: WHO beş anahtar başlıkları, FoodSafety.gov 4 Steps (20 sn el yıkama, ayrı tahta, 60°C sıcak tutma), CDC Preventing Food Poisoning (2 saat). Mutfak–çadır 6 m mesafesi ve HSGM kaynakları bu turda erişilemedi."
    },
    "art": [
      "su-gida-hasta-asci-yasak",
      "wash-hands",
      null,
      "su-gida-cig-pismis-ayri",
      "su-gida-kazan-kaynatma",
      "su-gida-sicak-dagitim",
      null,
      null,
      "su-gida-mutfak-mesafe",
      null
    ]
  }
];
