// Rehber kategorisi: Araç ve yolda
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "ulasim",
  "title": "Araç ve yolda",
  "hint": "Kazada ilk müdahale, karda mahsur kalma",
  "art": "cat-ulasim",
  "color": "#60a5fa",
  "order": 16
};

export const GUIDES: Guide[] = [
  {
    "id": "ulasim-trafik-kazasi",
    "title": "Trafik kazasında ilk müdahale",
    "tag": "ULAŞIM",
    "summary": "Önce olay yerini güvene alın, 112'yi arayın; yaralıyı tehlike yoksa yerinden oynatmayın.",
    "steps": [
      "Aracınızı kazanın gerisinde, yolu kapatmadan durdurun ve dörtlüleri yakın.",
      "Reflektörlü yelek giyin. Reflektörü kazanın önüne ve arkasına koyun: şehir içinde en az 30 m, şehirlerarası yolda en az 150 m uzağa.",
      "Kazalı araçların motorunu kapatın, el frenini çekin. Çevrede sigara içilmesine izin vermeyin.",
      "112'yi arayın: tam yer, kaç araç, kaç yaralı, yangın ya da araçta sıkışan var mı.",
      "Yaralıyı yerinden oynatmayın. Yalnızca yangın, patlama ya da başka araç çarpması gibi bir tehlike varsa uzaklaştırın.",
      "Yaralıyla konuşun. Cevap vermiyorsa nefesine bakın. Nefes almıyorsa kalp masajına başlayın.",
      "Ciddi kanama varsa yaranın üstüne temiz bir bezle güçlü ve sürekli bastırın.",
      "Motosikletlinin kaskını çıkarmayın. Yalnızca nefes almıyorsa ya da hava yolu tıkalıysa iki kişi çıkarsın: biri baş ve boynu düz tutsun, diğeri kaskı çıkarsın.",
      "Yaralıları battaniyeyle örtüp sıcak tutun. Yiyecek ve içecek vermeyin.",
      "Ekipler gelince gördüklerinizi anlatın ve onların talimatına uyun."
    ],
    "dont": [
      "Otoyolda ya da karanlıkta yolun ortasında yürümeyin, araçların arasına girmeyin.",
      "Tehlike yokken yaralıyı araçtan çekip çıkarmayın; omurgası zarar görebilir.",
      "Kaskı tek başınıza, başı çekerek zorla çıkarmayın.",
      "Kazaya bakmak için yavaşlayıp yeni bir kazaya yol açmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "trafik kazası",
      "kaza oldu",
      "kaza yaptım",
      "kaza gördüm",
      "araba kazası",
      "araç kazası",
      "kazada ilk yardım",
      "kaza yerinde ne yapmalı",
      "motosiklet kazası",
      "kask çıkarılır mı",
      "araçta sıkışan yaralı",
      "trafik kazasi",
      "kaza yeri"
    ],
    "sources": [
      "MEB — Genel İlk Yardım Bilgileri (trafik kazasında olay yeri güvenliği)",
      "Transport for NSW — Emergency first aid for motorcycle accidents (kask)",
      "St John Ambulance — How to manage a traffic accident"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: reflektör önüne ve arkasına, şehirlerarası 150 m / şehir içi 30 m (İstiklal haber metni, ehliyet ders metni KTY m. 135/a atfı); yönetmeliğin asıl metni açılamadı, değişiklik yok. Önceki tur: St John Ambulance traffic collision (dörtlü, reflektörlü yelek, uyarı üçgeni, kontak kapatma, el freni, sigara yasağı, hemen 112, yaralıyı bulunduğu pozisyonda tedavi, omurga yaralanması varsayımı). 30/150 m mesafesi ve kask çıkarma kuralı bu turda yeniden doğrulanamadı."
    },
    "art": [
      "ulasim-kaza-dortlu",
      "ulasim-kaza-reflektor",
      null,
      "call-112",
      "ulasim-kaza-oynatma-yasak",
      null,
      null,
      "ulasim-kask-cikarma",
      "ulasim-kaza-battaniye",
      null
    ]
  },
  {
    "id": "ulasim-karda-mahsur",
    "title": "Kar ve tipide araçta mahsur kalma",
    "tag": "ULAŞIM",
    "summary": "Aracın içinde kalın, motoru çalıştırmadan önce egzozu kardan temizleyin ve motoru saatte yaklaşık 10 dakika çalıştırın.",
    "steps": [
      "Aracın içinde kalın. Yardım 100 metre içinde görünmüyorsa yürüyerek yardım aramaya çıkmayın.",
      "112'yi arayın. Yolu, kilometre levhasını ya da telefon konumunuzu söyleyin.",
      "Motoru çalıştırmadan önce egzoz borusunun karla kapanmadığını kontrol edin. Çevresini temizleyin.",
      "Isınmak için motoru ve kaloriferi saatte yaklaşık 10 dakika çalıştırın. Rüzgâr almayan taraftaki camı biraz aralayın.",
      "Kar yağmaya devam ederse egzozu ve kapı önünü düzenli temizleyin. Egzoz kapanırsa araca karbonmonoksit dolar.",
      "Battaniye, kıyafet ve birbirinize sokularak ısının. Kollarınızı ve bacaklarınızı ara ara oynatın.",
      "Fark edilmek için antene renkli bir bez bağlayın. Motor çalışırken iç lambayı yakın.",
      "Baş ağrısı, uyku hali ya da bulantı olursa motoru hemen kapatın ve camı açın: karbonmonoksit belirtisi olabilir.",
      "Su için. Kar yiyecekseniz önce eritin; kar yemek vücudu soğutur."
    ],
    "dont": [
      "Egzoz karla kapalıyken motoru çalıştırmayın.",
      "Tipide aracı bırakıp yürümeyin; kaybolabilir ve donabilirsiniz.",
      "Motor çalışırken camlar tamamen kapalı uyumayın."
    ],
    "callEmergency": true,
    "keywords": [
      "arabada mahsur",
      "tipide yolda kaldım",
      "tipide arabada",
      "araba kara saplandı",
      "araba kara gömüldü",
      "kar yağdı yoldayım",
      "egzoz kar",
      "arabada donuyoruz"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Winter Storm Safety (araçta mahsur kalma)",
      "NWS — Winter Weather Safety: During a storm (stranded in a vehicle)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Amerikan Kızılhaçı Winter Storm Safety (araçta kal, 100 m kuralı, saatte ~10 dk motor, rüzgâr altı cam, iç lamba, renkli bez, sokulma); NWS Winter Safety (egzoz temizliği, CO, erimemiş kar vücut ısısını düşürür, kol-bacak hareketi)."
    },
    "art": [
      "ulasim-kar-aracta-kal",
      "call-112",
      "ulasim-kar-egzoz-temizle",
      "ulasim-kar-motor-10dk",
      null,
      null,
      "ulasim-kar-anten-bez",
      null,
      null
    ]
  },
  {
    "id": "ulasim-suya-dusen-arac",
    "title": "Araç suya düşerse",
    "tag": "ULAŞIM",
    "summary": "Hemen kemeri çözün, camı açın ve araç batmadan camdan çıkın: kemer, cam, çocuklar, dışarı.",
    "steps": [
      "Hemen hareket edin. Araç genellikle bir dakikadan kısa süre su üstünde kalır.",
      "Emniyet kemerinizi çözün.",
      "Camı hemen açın. Elektrikli camlar suya girdikten sonra kısa bir süre daha çalışabilir.",
      "Cam açılmazsa cam kırıcıyla yan camın köşesine vurun. Kırılmazsa diğer yan camı ya da arka camı deneyin. Ön camı kırmaya uğraşmayın.",
      "Çocukların kemerini çözüp yanınıza çekin. Önce büyük çocuğu camdan çıkarın, sonra küçükleri.",
      "Camdan dışarı çıkın. Aracın tavanına tutunun ya da kıyıya yüzün.",
      "Kıyıya ulaşınca 112'yi arayın.",
      "Önceden: sürücünün eli yetişecek yerde kemer kesici ve cam kırıcı tutun."
    ],
    "dont": [
      "Önce telefonla aramaya zaman harcamayın; önce çıkın, sonra arayın.",
      "Kapıyı açmaya uğraşmayın; su basıncı kapıyı açtırmaz.",
      "Araç dolsun da basınç eşitlensin diye içeride beklemeyin.",
      "Eşyalarınızı toplamaya çalışmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "araç suya düştü",
      "araba suya düştü",
      "araba batıyor",
      "araba denize düştü",
      "araba göle düştü",
      "araba nehre düştü",
      "batan araç",
      "suya uçtu",
      "cam kırıcı",
      "kemer kesici",
      "araba suya dustu",
      "batan arabadan cikis"
    ],
    "sources": [
      "Giesbrecht / IAED — Batan Araç Protokolü (Kemer, Cam, Çocuklar, Dışarı)",
      "Wikipedia — Gordon Giesbrecht (SEATBELTS, WINDOWS, CHILDREN, OUT; telefonla vakit kaybetmeme)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Giesbrecht protokolünün sırası (kemer, cam, çocuklar, dışarı) ve önce telefonla uğraşmama ikincil kaynakla doğrulandı. Yüzme süresi, elektrikli cam süresi ve büyük çocuktan başlama bu turda birincil kaynaktan yeniden doğrulanamadı (JEMS/RoSPA erişilemedi). Lamine yan cam olasılığı için 'diğer yan cam ya da arka cam' eklendi."
    },
    "art": [
      "ulasim-su-zaman",
      "ulasim-su-kemer",
      "ulasim-su-cam-ac",
      "ulasim-su-cam-kir",
      "ulasim-su-cocuk",
      "ulasim-su-cik",
      null,
      null
    ]
  },
  {
    "id": "ulasim-ariza-aku",
    "title": "Yolda arıza ve akü bitmesi",
    "tag": "ULAŞIM",
    "summary": "Aracı yolun en sağına çekin, dörtlüleri yakın, reflektörü koyun ve yolcuları yoldan uzak güvenli yere alın.",
    "steps": [
      "Dörtlüleri yakın. Aracı yolun en sağına, emniyet şeridine ya da cebe çekin.",
      "Reflektörlü yelek giyin. Araçtan sağ kapıdan, trafik tarafının tersinden inin.",
      "Reflektörlerin birini aracın arkasına, diğerini önüne, gelen sürücülerin uzaktan göreceği yere koyun: şehir içinde en az 30 m, şehirlerarası yolda en az 150 m uzağa.",
      "Otoyoldaysanız yolcuları bariyerin arkasına alın. Aracın içinde, önünde ya da arkasında beklemeyin.",
      "Yol yardım hizmetini ya da sigortanızın yardım hattını arayın. Tehlike varsa 112'yi arayın.",
      "Akü bittiyse iki motor da kapalıyken takviye kablosu kullanın: kırmızı kabloyu önce dolu akünün artısına (+), sonra boş akünün artısına takın.",
      "Siyah kabloyu dolu akünün eksisine (−), diğer ucunu boş aracın motorundaki boyasız bir metal noktaya takın.",
      "Önce yardım eden aracı çalıştırıp birkaç dakika bekleyin, sonra kendi aracınızı çalıştırın.",
      "Kabloları ters sırayla sökün: önce siyahları, sonra kırmızıları. Uçları birbirine değdirmeyin."
    ],
    "dont": [
      "Otoyolda aracın arkasında ya da yanında durmayın.",
      "Akünün yanında sigara içmeyin, kıvılcım çıkarmayın; akü patlayabilir.",
      "Çatlak, şişmiş ya da sızdıran aküye takviye yapmayın.",
      "Çalıştırma sırasında kablo maşalarına dokunmayın."
    ],
    "keywords": [
      "araba arıza",
      "araç arızalandı",
      "araba bozuldu",
      "akü bitti",
      "akü takviye",
      "takviye kablosu",
      "araba çalışmıyor",
      "reflektör nereye konur",
      "reflektör kaç metre",
      "emniyet şeridi",
      "yol yardım",
      "aku bitti",
      "araba bozuldu ne yapmali"
    ],
    "sources": [
      "Karayolları Trafik Yönetmeliği — Arıza halinde alınacak önlemler",
      "MEB — Genel İlk Yardım Bilgileri (işaret mesafesi)",
      "Volvo Cars Türkiye — Takviye aküyle çalıştırma",
      "RAC — How to jump start a car",
      "Araclo ehliyet dersleri — Arıza halinde önlemler (KTY m. 135/a)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: ehliyet ders metni (KTY m. 135/a'ya atıfla reflektörler aracın önüne ve arkasına, 150 m'den görülecek şekilde; dönemeç/tepe üstünde 30'ar m), İstiklal 'Reflektör kaç metreye konur' (şehirlerarası 150 m, şehir içi ~30 m). 3. adımdaki 'çift yönlü yolda önüne de' → 'birini arkasına, diğerini önüne' yapıldı. Yönetmeliğin asıl metni (mevzuat.gov.tr) açılamadı. Önceki tur: RAC jump-start kılavuzu (siyah kablonun boş araçta aküden uzak metal noktaya bağlanması, önce yardım eden aracın çalıştırılması, sökmede önce siyahlar, hasarlı/sızdıran aküye takviye yapmama, sigara içmeme). 30/150 m reflektör mesafesi resmi metinden yeniden doğrulanamadı (mevzuat.gov.tr erişilemedi)."
    },
    "art": [
      "ulasim-ariza-sag-cek",
      "ulasim-ariza-yelek-in",
      "ulasim-reflektor-mesafe",
      "ulasim-ariza-bariyer",
      null,
      "ulasim-aku-kirmizi",
      "ulasim-aku-siyah",
      null,
      null
    ]
  },
  {
    "id": "ulasim-tahliye-surus",
    "title": "Tahliyede araç kullanma",
    "tag": "ULAŞIM",
    "summary": "Yetkililerin gösterdiği yolu izleyin, su basmış yola girmeyin ve acil araçlara yol bırakın.",
    "steps": [
      "Yetkililerin söylediği tahliye yolunu kullanın. Kestirme yollara sapmayın; kapalı olabilir.",
      "Pilli radyodan ya da resmi duyurulardan yol durumunu izleyin.",
      "Yola çıkmadan afet çantanızı, ilaçlarınızı ve evcil hayvanınızı alın.",
      "Aracınızda yer varsa aracı olmayan komşulara, özellikle yaşlı ve engellilere yer verin.",
      "Su basmış yola girmeyin. 30 cm akan su bile aracı sürükleyebilir.",
      "Devrilmiş direk, kopmuş kablo, hasarlı köprü ve heyelanlı yamaçtan uzak durun; geri dönün.",
      "Yavaş ve sakin sürün. Emniyet şeridini boş bırakın, ambulans ve itfaiyeye yol açın.",
      "Yol kapandıysa ya da yakıt bittiyse aracı yolu tıkamadan kenara çekin. Bırakmanız gerekirse anahtarı üstünde bırakın ki görevliler çekebilsin.",
      "Güvenli yere varınca ailenize ve irtibat kişinize haber verin."
    ],
    "dont": [
      "Sel suyuna \"geçerim\" diye girmeyin.",
      "Emniyet şeridini ve ambulans yolunu kapatmayın.",
      "Yerde kopmuş elektrik kablosunun üstünden ya da yakınından geçmeyin."
    ],
    "keywords": [
      "araçla tahliye",
      "tahliyede araç kullanma",
      "tahliyede araba",
      "tahliye yolu",
      "şehirden çıkış",
      "şehirden kaçış",
      "araçla kaçış",
      "yolda kopuk kablo",
      "tahliye surus",
      "tahliyede araba kullanma"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Flood safety (30 cm su aracı sürükler)",
      "NWS — Turn Around Don't Drown",
      "AFAD — Deprem anında araçtaysanız (anahtarı üstünde bırakma)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD deprem anında araç metni (güvensiz yerde aracı bırakırken kontak anahtarını üzerinde bırakın) 8. adımı destekliyor. Önceki tur: Amerikan Kızılhaçı Flood Safety (sel suyunda araç kullanmama, 30 cm akan su aracı sürükler, devrilmiş direk/kablolardan uzak durma); NWS Turn Around Don't Drown (30 cm). Tahliye yolu/kestirme ve anahtar bırakma maddeleri bu turda yeniden doğrulanamadı (Ready.gov, AFAD erişilemedi)."
    },
    "art": [
      "ulasim-tahliye-tabela",
      "battery-radio",
      null,
      null,
      "ulasim-su-yola-girme",
      "ulasim-kablo-uzak",
      "ulasim-tahliye-yol-ac",
      null,
      null
    ]
  },
  {
    "id": "ulasim-tunel-kopru",
    "title": "Tünelde ve köprüde acil durum",
    "tag": "ULAŞIM",
    "summary": "Tünelde yangın ya da duman varsa geri gitmeyin, aracı sağa çekip anahtarı üstünde bırakın ve acil çıkışa yürüyün.",
    "steps": [
      "Tünele girmeden farları yakın, radyoyu yol bilgisi kanalına açın, takip mesafesini koruyun.",
      "Tünelde trafik durursa dörtlüleri yakın, öndeki araçla en az 5 metre ara bırakın, motoru kapatın.",
      "Aracınız arızalanırsa sağa ya da acil durum cebine çekin, motoru kapatın, acil durum telefonundan haber verin.",
      "Tünelde yangın ya da duman görürseniz geri geri gitmeyin, U dönüşü yapmayın.",
      "Aracı sağa çekin, motoru kapatın, anahtarı üstünde bırakın.",
      "Eşyalarınızı almadan yeşil acil çıkış işaretlerini izleyin ve yangından uzağa yürüyün.",
      "Kendi aracınız yanıyorsa ve tünelden çıkabiliyorsanız sürerek çıkın. Çıkamıyorsanız sağa çekip durun, kaputu açmayın ve acil çıkışa yürüyün.",
      "Deprem sırasında köprüdeyseniz aracı durdurun. Sarsıntı geçince anahtarı üstünde bırakıp yürüyerek köprüden açık alana çıkın.",
      "Köprü ya da üst geçit hasarlı görünüyorsa üstünden geçmeyin. Geri dönün ve 112'ye haber verin.",
      "Deprem sırasında tünelde ve çıkışa yakın değilseniz aracı durdurup inin. Aracın yanında yan yatıp dizlerinizi karnınıza çekin, başınızı ve boynunuzu ellerinizle koruyun."
    ],
    "dont": [
      "Tünelde dumanın içinde aracınızda beklemeyin.",
      "Tünelde ya da köprüde geri vitese takmayın, U dönüşü yapmayın.",
      "Eşya almak için zaman kaybetmeyin."
    ],
    "keywords": [
      "tünel",
      "tünelde yangın",
      "tünelde duman",
      "tünelde kaldım",
      "tünelde arıza",
      "tünel acil çıkış",
      "köprüde deprem",
      "köprüdeyken deprem",
      "köprüde mahsur",
      "köprü",
      "viyadük",
      "üst geçit",
      "tunelde yangin",
      "kopruden gecerken deprem"
    ],
    "sources": [
      "The AA — Tunnel safety (Avrupa yol tüneli kuralları)",
      "AFAD — Deprem anında araçtaysanız (köprü, tünel)",
      "MEB okul yayını — AFAD 'Deprem anında yapılması gerekenler' metni"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD 'deprem anında' metni (MEB okul PDF'i ve Webtekno alıntısı): yer güvenliyse sağa yanaş, kontak anahtarı yerinde, camlar kapalı araçta bekle; köprü üstü gibi güvensiz yerde durdur, anahtarı üzerinde bırakıp terk et ve trafikten uzak açık alana git; tünelde çıkışa yakın değilsen in, yan yat, dizleri karna çek, baş-boynu koru. AFAD'a göre tünelde deprem adımı (10.) eklendi. Önceki tur: The AA Tunnel safety (farlar, trafik radyosu, durunca 5 m ara ve motoru kapatma, geri/U dönüşü yok, anahtar kontakta, kaputu açmama, kendi araç yanıyorsa sürerek çıkma, acil telefon, eşyasız acil çıkış). Köprüde deprem maddesi bu turda AFAD'dan yeniden doğrulanamadı."
    },
    "art": [
      null,
      "ulasim-tunel-mesafe",
      null,
      "ulasim-tunel-u-donus-yasak",
      null,
      "ulasim-tunel-acil-cikis",
      null,
      "ulasim-kopru-deprem",
      null,
      "ulasim-tunel-deprem"
    ]
  }
];
