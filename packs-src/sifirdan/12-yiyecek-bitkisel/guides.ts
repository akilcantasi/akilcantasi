// Sıfırdan paketi: Yiyecek bulma — bitkiler ve mevsimler (paket 12, katalog bölüm 18)
// Biçim: packs-src/sifirdan/types.ts
// Temel otlar, zehirli benzerler, yemişler, palamut ve kökler 01-yiyecek-bulma paketindedir;
// bu paket onları mevsime, habitata ve işleme yöntemine göre ayrıntılandırır.
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  "id": "sifirdan-yiyecek-bitkisel",
  "name": "Sıfırdan: Yiyecek bulma — bitkiler ve mevsimler",
  "desc": "Mevsim mevsim ve yer yer yabani bitki toplama: ilkbahar otları, yaz ve güz meyveleri, kış kaynakları, çam, özsu, sulak alan, kıyı, Akdeniz çalılığı, terk edilmiş bahçe ve şehir. Zehirli bitkileri tanıma, acılık giderme, ergot ve latirizm uyarılarıyla.",
  "version": 1
};

export const CATEGORIES: CategoryMeta[] = [
  {
    "id": "sf-ybt-mevsim",
    "title": "Mevsim mevsim toplama",
    "hint": "İlkbahar otları, yaz ve güz meyveleri, kış, çiçekler, özsu",
    "art": "sf-ybt-kapak-mevsim",
    "color": "#86efac",
    "order": 184
  },
  {
    "id": "sf-ybt-yer",
    "title": "Ormandan kıyıya: yer yer bitkiler",
    "hint": "Çam, sulak alan, kıyı, Akdeniz, yosun, liken, bahçe, şehir",
    "art": "sf-ybt-kapak-yer",
    "color": "#5eead4",
    "order": 185
  },
  {
    "id": "sf-ybt-guvenlik",
    "title": "Zehir, işleme ve güvenlik",
    "hint": "Zehirli bitkiler, çocuklar, acılık giderme, ergot, latirizm, kar",
    "art": "sf-ybt-kapak-guvenlik",
    "color": "#fca5a5",
    "order": 186
  }
];

export const GUIDES: PackGuide[] = [
  // ───────────────────────── MEVSİM MEVSİM ─────────────────────────
  {
    "id": "sf-ybt-ilkbahar",
    "category": "sf-ybt-mevsim",
    "title": "İlkbahar otları: madımak, kenger, çiriş, gelincik, şevketi bostan, kuşkonmaz, turp otu",
    "tag": "İLKBAHAR OTU",
    "summary": "Mart–mayısta yöre halkının yıllardır topladığı otları körpeyken toplayın, iyice yıkayıp çoğunu haşlayın; acı çiğdem, akçöpleme ve baldıranın da aynı aylarda aynı yerlerde çıktığını unutmayın.",
    "note": "Uzman gözetimi olmadan ilkbaharda topraktan yeni çıkan şerit ya da parçalı yapraklı bitkileri yemeyin; acı çiğdem, akçöpleme ve baldıran bu dönemde yenen otlara çok benzer ve öldürebilir.",
    "steps": [
      "Toplama zamanı çoğu ot için mart–mayıstır. Bitki çiçeğe durmadan, körpe ve yumuşakken alın; sertleşen, çiçek açan otların çoğu acılaşır.",
      "Madımak: İç Anadolu'da tarla ve yol kenarında yere yayılan, 15–30 cm'lik ince gövdeli, küçük uzunca yapraklı ottur; yaprak diplerinde küçük pembe çiçekler çıkar. Körpe uçlarını kesip yıkayın, haşlayıp ya da kavurup yiyin.",
      "Kenger: Doğu Anadolu'da (özellikle Muş çevresi) yamaçlarda çıkan, dikenli, devedikenine benzer bitkidir; her yerinden süt çıkar. Mart–mayısta henüz açmamış çiçek başını, körpe gövdeyi ve yaprakları eldivenle toplayın, dikenlerini ayıklayıp pişirin. Sütlü olduğu halde yenen az sayıdaki ottan biridir; bu istisnayı başka sütlü bitkilere genellemeyin.",
      "Çiriş: Doğu Anadolu'da taşlık yamaçlarda mart–nisanda topraktan demet halinde çıkan körpe yapraklar toplanır. Yalnız yörede çirişi tanıyan biriyle toplayın: topraktan şerit yaprakla çıkan acı çiğdem ve kırışık-pileli yapraklı akçöpleme (Veratrum) bu dönemde ona karışabilir.",
      "Gelincik: Ege'de çiçek açmadan önceki yaprak demeti ot olarak toplanır. Gövde ve yaprak kıllıdır, koparınca beyaz süt çıkar. Az miktarda, pişirerek yiyin.",
      "Şevketi bostan: Ege'de mart–nisanda toplanan, yaprağı ve gövdesi dikenli, sarı çiçekli ottur. Eldivenle kesin; dikenleri bıçakla sıyırıp körpe gövde ve kökünü zeytinyağıyla ya da etle pişirin.",
      "Yabani kuşkonmaz: çalılıkta, sert iğne gibi sürgünlü çalının dibinden mart–nisanda çıkan kalem kalınlığındaki körpe filizi kırın; kırılmayan sert kısmı bırakın. Yalnız filizi yiyin; bitkinin küçük tanelerini (yeşil, kırmızı ya da siyah, hangi renkte olursa) yemeyin.",
      "Turp otu ve yabani hardal: tarla kenarında çiçek açmamış yaprak demetini toplayın, haşlayıp zeytinyağı ve limonla yiyin.",
      "Her türü ayrı torbaya, demet demet toplayın; kucak kucak, karışık toplamayın. Evde her yaprağı tek tek ayıklayın: maydanoz-havuç gibi parçalı yapraklı, kokusuz soğanlı ya da pileli geniş yapraklı bir parça görürseniz bütün torbayı yeniden ayıklayın.",
      "Bulantı, kusma, ağızda yanma, kalp çarpıntısı ya da baş dönmesi olursa yemeyi bırakın, 114'ü ya da 112'yi arayın ve otun bir parçasını saklayın."
    ],
    "art": [
      null,
      "sf-ybt-madimak",
      "sf-ybt-kenger",
      "sf-ybt-cirisi-ayir",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kokusuz, topraktan şerit yaprakla çıkan bitkiyi yabani soğan, çiriş ya da sarımsak sanıp yemeyin; acı çiğdem öldürür.",
      "Kenger yeniyor diye sütlü başka otları yemeyin; sütleğen ve benzerleri ağız ve mideyi yakar.",
      "Kuşkonmazın tanelerini yemeyin, çocuklara yedirmeyin.",
      "Otları başka türlerle karışık, kucak kucak toplamayın; zehirli bir yaprak fark edilmeden tencereye girer."
    ],
    "keywords": [
      "ilkbahar otları",
      "baharda toplanan otlar",
      "madımak nasıl toplanır",
      "madimak otu",
      "kenger nasıl yenir",
      "çiriş otu toplama",
      "ciris otu",
      "gelincik otu yemeği",
      "şevketi bostan temizleme",
      "yabani kuşkonmaz toplama",
      "tilkişen",
      "turp otu haşlama"
    ],
    "sources": [
      "Wikipedia — Polygonum cognatum (madımak), İç Anadolu, görünüş (https://en.wikipedia.org/wiki/Madimak)",
      "Wikipedia — Gundelia (kenger), Muş, mart–mayıs, sütlü, yenen kısımlar (https://en.wikipedia.org/wiki/Gundelia)",
      "Wikipedia — Eremurus spectabilis (çiriş), Doğu Anadolu, mart–nisan körpe yaprak (https://en.wikipedia.org/wiki/Eremurus_spectabilis)",
      "Milliyet — Şevketi bostan, mart–nisan, dikenler ve pişirme (https://www.milliyet.com.tr/galeri/sevketi-bostan-nedir-nasil-yapilir-sevketi-bostanin-tadi-nasil-faydalari-neler-7479511)",
      "Habertürk — Ege otları: turp otu, kuşkonmaz (tilkişen), gelincik, şevketi bostan (https://www.haberturk.com/htgastro/lezzetli-hatlar/egenin-300-cesit-sifali-otu-3374904)",
      "Wikipedia — Asparagus acutifolius, filiz toplama; Asparagus officinalis, kırmızı meyve zehirli (https://en.wikipedia.org/wiki/Asparagus_officinalis)",
      "Wikipedia — Veratrum album, karışmalar ve belirtiler (https://en.wikipedia.org/wiki/Veratrum_album)",
      "ANSES — Toxic plants, acı çiğdem ve akçöpleme karışmaları, kucak kucak toplamama (https://www.anses.fr/en/content/toxic-plants)",
      "Ege Üniv. YL tezi (Anamur 2015) — Veratrum album: Türk florasındaki tek Veratrum türü, 'Akçöpleme ya da Ağukunduzu' (https://tezara.org/theses/420563)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): Veratrum'un Türkçe adı 'akçöpleme / ağu kunduzu' ve Türkiye'deki tek Veratrum türü olduğu Ege Üniv. tezinde doğrulandı; kuşkonmaz taneleri renk sınırlaması kaldırıldı (A. acutifolius tanesi olgunlukta siyahtır). Sayılar yazar kaynaklarıyla tutarlı; ot hazırlama ayrıntıları ZAYIF (yerel bilgi). Yazarın teyidi: madımak 15–30 cm yatık, pembe çiçek; kenger Muş, mart–mayıs, bütün kısımları sütlü; çiriş mart–nisan körpe yaprak; şevketi bostan mart–nisan; kuşkonmaz meyvesi zehirli; ANSES: acı çiğdem ve Veratrum karışmaları. Gelinciğin çiçek öncesi toplanması ve madımak hazırlanışı için ayrıntılı kaynak bulunamadı; çiriş-acı çiğdem karışması kaynakta adıyla yok, ihtiyat olarak yazıldı." }
  },
  {
    "id": "sf-ybt-yaz",
    "category": "sf-ybt-mevsim",
    "title": "Yaz toplaması: dut, böğürtlen, semizotu, yabani erik",
    "tag": "YAZ MEYVESİ",
    "summary": "Yazın dutu, böğürtleni ve yabani eriği tam olgunken, semizotunu bahçe ve tarla kenarından toplayın; güzelavratotunun parlak siyah tanesini ve tatulanın dikenli kozasını tanıyıp uzak durun.",
    "steps": [
      "Dut: haziran–temmuzda ağacın altına bez serip dalı sallayın; yere düşen olgun dutu toplayın. Yeşil, ham dutu yemeyin; şiddetli bulantı, kramp ve sanrı yapabilir.",
      "Dutu taze yiyin ya da güneşte kurutup saklayın; kuru dut kışlık şeker kaynağıdır.",
      "Böğürtlen: temmuz–ağustosta tamamen siyahlaşan, parmakla dokununca kolayca kopan taneleri toplayın. Dere kenarı, çalı çiti ve orman açıklıklarında bol bulunur. Kalın giysi ve eldiven giyin.",
      "Semizotu: yazın sulanan bahçe, tarla ve kaldırım kenarında yere yayılır. Koparınca süt çıkmaz; süt çıkan benzeri sütleğendir, yemeyin. Ayrıntı için 'Yenebilir yabani otlar' rehberine bakın.",
      "Yabani erik ve can eriği: dere ve tarla kenarındaki çalı erikleri yaz ortası ile sonunda olgunlaşır. Etini yiyin; çekirdeği kırıp içini yemeyin.",
      "Güzelavratotunu tanıyın: yarım metreden boylu ot, mor-kahverengi çan biçimli çiçek, tek tek duran, küçük kiraz büyüklüğünde (yaklaşık 1–1,5 cm) parlak siyah, tatlı tane; arkasında yıldız biçimli yeşil çanak. Tanesi de yaprağı da öldürebilir. Ispanak, pırasa ve tere tarlalarına karışıp zehirlenmelere yol açtığı bilinir.",
      "Tatulayı (şeytan elması, boru çiçeği) tanıyın: 1 metreye varan ot, beyaz-mor boru biçimli çiçek, ceviz büyüklüğünde dikenli koza. Ahır, çöp ve tarla kenarında çıkar. Yaprağı ıspanağa karışabilir; her yeri zehirlidir.",
      "Tanımadığınız siyah, kırmızı ya da beyaz taneli hiçbir meyveyi yemeyin. Böğürtlen ve dut dışındaki taneli meyveleri yalnız yöreyi bilen biri gösterirse toplayın. Yukarıdaki görünüş ipuçları uzak durmak içindir; bir bitkinin onlara uymaması güvenli olduğunu göstermez. Emin değilseniz yemeyin.",
      "Sıcakta toplanan meyve çabuk ekşir. Aynı gün yiyin, kurutun ya da pekmez yapın; küflüyü ayıklayın.",
      "Ağız kuruluğu, göz bebeklerinde büyüme, yüz kızarması, ateş, idrar yapamama, sayıklama başlarsa bu bir bitki zehirlenmesi olabilir: 112'yi ya da 114'ü arayın, yenen bitkiden parça saklayın."
    ],
    "art": [
      "sf-ybt-dut-silkme",
      null,
      null,
      null,
      null,
      "sf-ybt-guzelavrat",
      "sf-ybt-tatula",
      null,
      null,
      null
    ],
    "dont": [
      "Ham, yeşil dut yemeyin.",
      "Parlak siyah, tek tek duran, tatlı taneyi yaban mersini ya da kiraz sanıp yemeyin; güzelavratotu olabilir.",
      "Dikenli kozalı tatulanın tohumunu, yaprağını, çiçeğini ağzınıza almayın; çocukları uzak tutun.",
      "Meyve çekirdeklerinin içini kırıp yemeyin."
    ],
    "keywords": [
      "yazın yabani meyve",
      "dut toplama",
      "ham dut yenir mi",
      "böğürtlen ne zaman olgunlaşır",
      "yabani erik toplama",
      "güzelavrat otu nasıl tanınır",
      "guzelavrat otu",
      "tatula şeytan elması",
      "seytan elmasi",
      "zehirli siyah meyve"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 Ek B — Mulberry: ham meyve bulantı ve sanrı yapar; Purslane (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Atropa belladonna, tane boyu, tatlılık, yaşam yeri, Türkiye, belirtiler (https://en.wikipedia.org/wiki/Atropa_belladonna)",
      "Sözcü — Kayseri'de güzelavrat otundan bir ayda 30 zehirlenme, ıspanak-pırasa-tere karışması (https://www.sozcu.com.tr/kayseri-de-guzelavrat-otundan-bir-ayda-30-kisi-zehirlendi-p5876)",
      "Wikipedia — Datura stramonium, görünüş, yaşam yeri, ıspanağa karışma (https://en.wikipedia.org/wiki/Datura_stramonium)",
      "Yeni Akit — Şeytan elması, tatula, boru çiçeği adları (https://www.yeniakit.com.tr/haber/seytan-elmasi-otu-nedir-pitirat-seytan-elmasi-otu-nerelerde-bulunur-zehirli-midir-950702.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): güzelavratotu tane boyu 'kiraz çekirdeği' → 'küçük kiraz (1–1,5 cm)' düzeltildi (çizim açıklamasıyla tutarlı); 'emin değilsen yeme' ve ipuçlarının yanlış güven vermemesi uyarısı eklendi. Yazarın teyidi: ham dut (FM 21-76), güzelavratotu tanesi ~1,5 cm parlak siyah tatlı, tek tek; Kayseri'de ıspanak-pırasa-tere karışması; tatula dikenli koza, ıspanağa karışma (Avustralya 2022). Olgunlaşma ayları Türkiye için genel bilgi; ayrıca doğrulanmadı. 'Ayıüzümü' adının hangi bitkiye verildiği yöreden yöreye değiştiği için kullanılmadı." }
  },
  {
    "id": "sf-ybt-sonbahar",
    "category": "sf-ybt-mevsim",
    "title": "Sonbahar toplaması: kestane, ceviz, fındık, kuşburnu, alıç, ahlat, yabani elma",
    "tag": "GÜZ YEMİŞİ",
    "summary": "Eylül–kasımda yere düşen kestane, ceviz ve fındığı küflenmeden toplayıp kurutun; kuşburnu, alıç ve ahlatı dalda olgunlaşınca alın; at kestanesini, porsuğu ve sonbaharda çiçek açan acı çiğdemi tanıyın.",
    "steps": [
      "Sonbahar yılın en bol yiyecek zamanıdır; kış için toplayın. Yemişleri her gün ya da gün aşırı toplayın; yerde ıslak kalan yemiş birkaç günde küflenir.",
      "Kestane: Karadeniz ve Marmara ormanlarında ekim–kasımda dikenli kabuğu açılıp düşer. Kabuğu ayakla ezip açın. Yenen kestane ile at kestanesinin ayrımı için 'Yabani meyve ve yemişler' rehberine bakın; parklardaki tek, parlak, yuvarlak tohumlu ağaç genellikle at kestanesidir.",
      "Ceviz ve fındık: yere düşenleri toplayın. Yeşil kabuğu soyun, ince bir katta, gölgede ve havadar yerde 2–3 hafta kurutun; içi kırılınca çıtırdıyorsa kurumuştur.",
      "Kırdığınız ceviz ve fındıktan küflü, kararmış, buruşmuş ya da acı olanı atın. Bu küfün zehri (aflatoksin) pişirmekle ve kavurmakla gitmez.",
      "Kuşburnu: eylül–kasımda kırmızılaşır; ilk dondan sonra yumuşar ve tatlanır. İçindeki tohum ve tüyleri ayıklayın ya da ezip kaynatıp sık bezden süzün.",
      "Alıç: kırmızı ya da sarı taneler sonbaharda olgunlaşır ve aylarca dalda kalır. Etini yiyin, çekirdeklerini atın; ezip süzerek pestil ya da marmelat yapın.",
      "Ahlat ve yabani elma: toplayıp serin yerde, birbirine değmeden bekletin; yumuşayıp tatlanınca yiyin ya da dilimleyip kurutun. Çekirdekleri yemeyin.",
      "Sonbaharda çayırda yapraksız, pembe-mor çiğdeme benzer çiçek açan bitki acı çiğdemdir; yumrusunu ve ilkbaharda çıkacak yapraklarını hiç yemeyin. Porsuğun kırmızı meyveleri de bu mevsimde olgunlaşır; çocukları uzak tutun.",
      "Toplanan yemişi türüne göre ayrı torbada saklayın; kurumuş yemişi bez torbada, fareden uzak, asılı tutun."
    ],
    "art": [
      null,
      null,
      "sf-ybt-ceviz-kurutma",
      null,
      null,
      null,
      null,
      "sf-ybt-aci-cigdem-guz",
      null
    ],
    "dont": [
      "Küflü, kararmış ya da acı ceviz, fındık ve kestaneyi kavurarak kurtarmaya çalışmayın; zehri ısıyla gitmez.",
      "Sonbaharda çiçek açan çiğdeme benzer bitkinin yumrusunu sökmeyin, yemeyin.",
      "At kestanesini ve porsuk meyvesini yemeyin.",
      "Yemişi kapalı naylon torbada nemli saklamayın; küflenir."
    ],
    "keywords": [
      "sonbaharda yabani yiyecek",
      "güzün toplanan yemişler",
      "ceviz kurutma",
      "fındık toplama doğada",
      "kestane toplama mevsimi",
      "küflü ceviz zehirli mi",
      "aflatoksin",
      "alıç toplama",
      "kuşburnu ne zaman toplanır",
      "ahlat bekletme",
      "acı çiğdem sonbahar"
    ],
    "sources": [
      "WHO — Mycotoxins bilgi notu: fındık, ceviz ve kuru incirde aflatoksin; küflü, renk değiştirmiş, buruşuk olanı atma; işlemeye dayanıklılık (https://www.who.int/news-room/fact-sheets/detail/mycotoxins)",
      "ABD Ordusu FM 21-76 Ek B — Chestnut, közde pişirme; Walnut, sonbaharda olgunlaşma (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Crataegus monogyna, meyvenin dalda ortalama 107 gün kalması (https://en.wikipedia.org/wiki/Crataegus_monogyna)",
      "ANSES — Toxic plants, at kestanesi-kestane ve acı çiğdem karışmaları (https://www.anses.fr/en/content/toxic-plants)",
      "CHOP Zehir Merkezi — Poisonous berries, porsuk (https://www.chop.edu/centers-programs/poison-control-center/poisonous-berries)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): yeni açılan kaynak yok; içerik tutucu, değişiklik gerekmedi. Kurutma süresi ZAYIF (geleneksel). Yazarın teyidi: WHO aflatoksin (fındık, ceviz), mikotoksinlerin işlemeye dayanıklılığı, küflü-buruşuk ayıklama; alıcın dalda kalması; ANSES karışmaları. Ceviz-fındık kurutma süresi (2–3 hafta) ve kuşburnunun dondan sonra tatlanması geleneksel bilgi; ayrı kaynakla doğrulanmadı." }
  },
  {
    "id": "sf-ybt-kis",
    "category": "sf-ybt-mevsim",
    "title": "Kışın bitkisel yiyecek: kökler, dalda kalan meyve, iç kabuk, kuru ot",
    "tag": "KIŞ",
    "summary": "Kışın taze ot azdır: güzden kurutup sakladığınızı yiyin, dalda kalan kuşburnu ve alıcı toplayın, tanıdığınız kökleri donmamış toprakta sökün; kışın yeşil kalan baldıran yapraklarından ve porsuktan uzak durun.",
    "steps": [
      "Kışın asıl bitkisel yiyecek, güzün kurutup sakladıklarınızdır: kuru meyve, yemiş, kuru ot, palamut unu. Kış gelmeden 'Yiyecek saklama' paketindeki kurutma rehberlerine göre stok yapın.",
      "Dalda kalan meyveleri toplayın: kuşburnu ve alıç kışın da dalda durur. Donmuş ve yumuşamış kuşburnunu ezip kaynatın, sık bezden süzüp için.",
      "Kökler için toprağın donmadığı günleri seçin. Yalnız 'Yabani kökler ve yumrular' rehberindeki, kesin tanıdığınız kökleri (su kamışı, dulavratotu) sökün. Yaprak kuruduğu için kışın kök tanımak zordur; yerini güzden bir kazıkla işaretleyin.",
      "Kışın yeşil kalan, maydanoza benzer, yere yayılmış yaprak demetlerine dokunmayın. Baldıran ilk yılını böyle geçirir ve kökü yabani havuca benzer.",
      "Çam iç kabuğu ve çam iğnesi çayı kış boyunca kullanılabilir. Nasıl yapılacağını 'Çam' rehberinde okuyun; porsuk ağacı da kışın yeşildir, onu çamla karıştırmayın.",
      "Kuru ot ve yaprakları (ısırgan, ebegümeci, madımak) yazdan gölgede kurutup bez torbada saklayın. Kışın çorbaya atın; küf kokanı atın.",
      "Kar altında kalmış eski meyve ve yemişleri yemeyin: kararmış, yumuşamış, küflü olanlarda zehirli küf olabilir.",
      "Kışın enerji ihtiyacınız artar; bitkisel yiyecek tek başına yetmez. Yağ ve protein için yemiş, tohum ve varsa hayvansal kaynakları birlikte planlayın."
    ],
    "art": [
      null,
      "sf-ybt-kis-kusburnu",
      null,
      "sf-ybt-baldiran-rozet",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kışın yeşil kalan maydanoz yapraklı yer rozetlerini yemeyin; baldıran olabilir.",
      "Kar altından çıkan küflü yemişi yemeyin.",
      "Kışın sökülen ve tanımadığınız kökleri yemeyin; yaprağı olmayan kök tanınmaz.",
      "Kışlık stoku nemli yerde tutmayın."
    ],
    "keywords": [
      "kışın doğada yiyecek",
      "kış aylarında ne yenir",
      "kışın yabani bitki",
      "dalda kalan meyve kış",
      "kuşburnu kışın",
      "kışın kök sökme",
      "baldıran kışın",
      "kis aylari yiyecek bulma"
    ],
    "sources": [
      "Wikipedia — Crataegus monogyna, meyvenin dalda kalması ve kışın yaban hayatı için önemi (https://en.wikipedia.org/wiki/Crataegus_monogyna)",
      "ABD Ordusu FM 21-76 Ek B — Pine, iç kabuk ve iğne çayı; Burdock, kök (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Bark bread, iç kabuk (https://en.wikipedia.org/wiki/Bark_bread)",
      "WHO — Mycotoxins, küflü yiyecek ayıklama (https://www.who.int/news-room/fact-sheets/detail/mycotoxins)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): içerik tutucu; değişiklik gerekmedi. Kış rozeti bilgisi ZAYIF. Yazarın teyidi: alıcın dalda uzun süre kalması, çam iç kabuğu ve iğne çayı (FM 21-76), küf ayıklama (WHO). Baldıranın ilk yıl rozet halinde olması 01 paketindeki Penn State kaynağına dayanır; kışın yeşil kaldığı bilgisi ayrıca doğrulanmadı." }
  },
  {
    "id": "sf-ybt-cicek",
    "category": "sf-ybt-mevsim",
    "title": "Yenebilir çiçekler: akasya, ıhlamur, menekşe, gül, kabak çiçeği",
    "tag": "ÇİÇEK",
    "summary": "Yalnız kesin tanıdığınız birkaç çiçeği, ilaçsız yerden toplayıp taç yapraklarını yiyin; akasyayı mor salkım ve altın yağmurundan ayırın, zakkum ve yüksük otu çiçeğine dokunmayın.",
    "steps": [
      "Çiçek az besin verir, ama bahar ve yaz başında kolay bulunur. Yalnız aşağıdakileri, kesin tanıyorsanız toplayın. Şüphe varsa yemeyin.",
      "Akasya (yalancı akasya): mayıs–haziranda, yaprakları çıktıktan sonra, beyaz ve kokulu sarkık salkımlar açar; 7–10 gün sürer. Dal diplerinde çift kısa diken vardır. Yalnız çiçeği alın ve pişirin; kabuğu, yaprağı ve odunu zehirlidir.",
      "Akasyayı mor salkım ve altın yağmurundan ayırın: mor salkımın sarkık salkımı mor ya da beyazdır, sarılıcı bir sarmaşıktır, tohumu ve baklası çok zehirlidir. Altın yağmurunun salkımı sarıdır ve her yeri zehirlidir. Beyaz çiçekli, dikenli, ağaç biçimli akasya dışındaki salkımlara dokunmayın.",
      "Ihlamur: haziran–temmuzda açan sarımsı, kokulu çiçek kümelerini kanatçık yaprağıyla birlikte toplayıp gölgede kurutun; sıcak suda demleyip için.",
      "Menekşe: ilkbaharda orman kenarında yere yakın, kalp biçimli yapraklı, mor kokulu çiçek. Çiçeğini çiğ yiyebilirsiniz.",
      "Gül: kokulu, ilaçlanmamış gül yapraklarını toplayın; taç yaprağının beyaz dip kısmını kesin, ekşidir. Reçel ya da şurup yapın.",
      "Kabak çiçeği: sabah açıkken toplayın, içindeki erkek organı ve dişicik ucunu çıkarın; dolma yapın ya da kızartın.",
      "Yalnız taç yaprakları yiyin; sap, başçık ve ortadaki organlar acı olabilir. Yol kenarından, ilaçlı bahçeden, mezarlık ve çiçekçi buketinden çiçek yemeyin.",
      "Zakkum, yüksük otu, nergis, inci çiçeği çiçeklerini hiçbir biçimde yemeyin, çay yapmayın. Yeni bir çiçeği ilk gün az yiyin; alerji olabilir."
    ],
    "art": [
      null,
      "sf-ybt-akasya-cicek",
      "sf-ybt-salkim-ayrim",
      null,
      null,
      null,
      "sf-ybt-kabak-cicegi",
      null,
      null
    ],
    "dont": [
      "Sarkık salkımlı her çiçeği akasya sanmayın; mor salkım ve altın yağmuru zehirlidir.",
      "Akasyanın kabuğunu, yaprağını, dalını çiğnemeyin.",
      "Çiçekçi ve süs bahçesi çiçeklerini yemeyin; ilaçlanmıştır.",
      "Zakkum dalını, çiçeğini, yaprağını çay ya da şiş için kullanmayın."
    ],
    "keywords": [
      "yenebilir çiçekler",
      "yenen çiçekler hangileri",
      "akasya çiçeği yenir mi",
      "akasya çiçeği kızartması",
      "ıhlamur toplama",
      "menekşe yenir mi",
      "gül yaprağı reçeli",
      "kabak çiçeği dolması",
      "mor salkım zehirli mi",
      "altın yağmuru zehirli"
    ],
    "note": "Türkiye'de olağan koşullarda devlet ormanlarından ıhlamur çiçeği ve benzeri orman ürünlerini izinsiz toplamak 6831 sayılı Orman Kanunu'na göre yasaktır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "sources": [
      "Wikipedia — Robinia pseudoacacia: kabuk, yaprak ve odun zehirli; çiçek kızartması; mayıs–haziran, 7–10 gün; diken çiftleri (https://en.wikipedia.org/wiki/Robinia_pseudoacacia)",
      "Wikipedia — Wisteria, tohum ve baklada wisterin, çocuk zehirlenmeleri (https://en.wikipedia.org/wiki/Wisteria)",
      "Wikipedia — Laburnum, bütün kısımlar zehirli, sarı sarkık salkım (https://en.wikipedia.org/wiki/Laburnum)",
      "Colorado State Univ. Extension — Edible flowers: menekşe, gül (taç dibini kesin), kabak; zehirli çiçekler yüksük otu, zakkum, nergis, inci çiçeği (https://extension.colostate.edu/resource/edible-flowers)",
      "Minnesota Univ. Extension — Edible flowers: ıhlamur, yalnız taç yaprak, ilaçsız ve yol kenarı olmayan çiçek, az başlama (https://extension.umn.edu/flowers/edible-flowers)",
      "6831 Orman Kanunu md. 14 metni (ayna: https://www.qsl.net/ta2iz/KANUN/ORMANK.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): Orman Kanunu md. 14 (C) palamut, ıhlamur çiçeği, tıbbi-sınai bitki toplama yasağı aynadan yeniden okundu; mevzuat.gov.tr robot engeli nedeniyle güncel metin (7442 sayılı Kanun değişiklikleri sonrası) açılamadı. Yazarın teyidi: akasya çiçeği yenir, kabuk-yaprak-odun zehirli; mor salkım tohumu, altın yağmuru bütün kısımlar zehirli; CSU ve UMN yenebilir çiçek kuralları ve zehirli çiçek listesi; orman kanunu md. 14 ıhlamur çiçeği yasağı. Akasya çiçeğinin çiğ yenip yenmeyeceği kaynakta yok; ihtiyatla 'pişirin' yazıldı. Ihlamur çiçek zamanı Tilia tomentosa için 'yaz ortası-sonu'; haziran–temmuz genel bilgi." }
  },
  {
    "id": "sf-ybt-ozsu",
    "category": "sf-ybt-mevsim",
    "title": "Ağaç özsuyu: hangi ağaçtan, ne zaman, nasıl",
    "tag": "ÖZSU",
    "summary": "Kış sonu ile yapraklanma arasında akçaağaç, huş, ceviz ya da çınardan, en az 25 cm çaplı sağlam ağaca tek küçük delik açarak özsu alın; 2–3 gün içinde kaynatarak tüketin.",
    "note": "Türkiye'de olağan koşullarda devlet ormanlarında ağaç yaralamak ve ağaçtan sakız, kabuk ya da benzeri ürün çıkarmak 6831 sayılı Orman Kanunu'na göre yasaktır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Ağacı seçin: akçaağaç, huş, ceviz ya da çınar. Ağacı kesin tanıyın. Özsuyu sütlü ya da renkli olan, tanımadığınız ve zehirli olduğu bilinen ağaçlardan (porsuk, yalancı akasya, at kestanesi) özsu almayın.",
      "Zaman: akçaağaç, ceviz ve çınarda geceleri donun, gündüzleri havanın ısındığı kış sonu haftaları; huşta kar çekilip toprak ısındıktan sonra, yapraklanmadan önceki yaklaşık bir ay. Tomurcuklar patlayınca bırakın; özsu acılaşır.",
      "Gövde çapı göğüs hizasında (yerden 1,4 m) en az 25 cm olan, çürüğü, mantarı, eski yarası olmayan ağacı seçin. Bir ağaca bir delik yeter.",
      "Güneye bakan yüzde, gövdeye yaklaşık 8 mm çaplı, 4–5 cm derinliğinde, hafif yukarı eğimli bir delik açın. Temiz bir burgu ya da matkap kullanın; donlu günde değil, hava sıfırın üstündeyken delin.",
      "Deliğe kabuğu soyulmuş temiz bir dal, kamış ya da boru sokun; altına ağzı örtülü temiz bir kap asın.",
      "Özsu süt gibidir, çabuk bozulur: kabı gölgede ve soğukta tutun, günde en az bir kez boşaltın. 2–3 gün içinde kullanın; ekşimiş, köpürmüş ya da bulanmışsa dökün.",
      "Özsuyu içmeden önce kaynatın. İsterseniz koyulaştırın: akçaağaç ve ceviz özsuyundan 40 litrede yaklaşık 1 litre, huş ve çınarda 100 litrede yaklaşık 1 litre şurup çıkar; bu çok yakıt ister.",
      "Şurup, o yerde suyun kaynadığı sıcaklıktan yaklaşık 4 °C daha sıcakta kaynamaya başlayınca olmuştur. Termometre yoksa kaşıktan iplik gibi damlamaya başlayınca indirin; sıcakken temiz kavanoza doldurun.",
      "Mevsim bitince çubuğu çıkarın, deliği temiz bir tahta tıkaçla kapatın. Ertesi yıl aynı deliği kullanmayın; ağacın farklı bir yüzünü delin."
    ],
    "art": [
      null,
      null,
      null,
      "sf-ybt-ozsu-delik",
      "sf-ybt-ozsu-kap",
      null,
      "sf-ybt-ozsu-kaynatma",
      null,
      null
    ],
    "dont": [
      "Genç, ince ya da hasta ağacı delmeyin; çürür ve ölür.",
      "Bir ağaca çok delik açmayın, kabuğu halka biçiminde soymayın; ağaç kurur.",
      "Bekleyip ekşiyen, köpüren özsuyu içmeyin; atın.",
      "Sütlü özsu veren ya da tanımadığınız ağaçtan özsu almayın."
    ],
    "keywords": [
      "ağaç özsuyu",
      "akçaağaç özsuyu",
      "huş ağacı suyu",
      "huş suyu nasıl alınır",
      "ceviz özsuyu",
      "ağaçtan su almak",
      "ozsu toplama",
      "akçaağaç şurubu yapımı",
      "agac suyu icilir mi"
    ],
    "sources": [
      "Maine Üniv. Extension — Bulletin 7036, How to tap maple trees: en az 10 inç (25 cm) çap, 5/16 inç burgu, 1,5–2 inç derinlik, donlu gece-ılık gün, özsu süt gibi bozulur, şurup kaynama noktasının 7,1 °F üstü (https://extension.umaine.edu/publications/resource/bulletin-7036-how-to-tap-maple-trees-and-make-maple-syrup)",
      "Mother Earth News — How to tap trees: birch, walnut, sycamore; huşta ~100:1, cevizde ~40:1; hasta ağacı delmeme (https://www.motherearthnews.com/homesteading-and-livestock/how-to-tap-trees-birch-walnut-sycamore-zm0z17fmzqui/)",
      "Wikipedia — Birch sap: yapraklanma öncesi bir ay, geç özsu acılaşır, 2–3 günde fermente olur (https://en.wikipedia.org/wiki/Birch_sap)",
      "ABD Ordusu FM 21-76 — akçaağaç, huş, ceviz ve çınardan özsu (https://www.wilderness-survival.net/plants-1.php)",
      "Wikipedia — Robinia pseudoacacia, kabuk zehirli (https://en.wikipedia.org/wiki/Robinia_pseudoacacia)",
      "6831 Orman Kanunu md. 14 metni (ayna: https://www.qsl.net/ta2iz/KANUN/ORMANK.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): UMaine sayıları yazar notuyla tutarlı (yeniden açılmadı); Orman Kanunu md. 14 (A)(B) ağaç yaralama, kabuk-sakız çıkarma yasağı aynadan okundu, güncel metin açılamadı. Yazarın teyidi: 25 cm çap, 8 mm delik, 4–5 cm derinlik, tek delik, donlu gece/ılık gün (UMaine); huş özsuyu yapraklanmadan önce, 2–3 günde ekşime (Wikipedia); şurup oranları (Mother Earth News; UMaine 10–15 galon/quart ≈ 40–60:1); şurup bitiş sıcaklığı +7,1 °F ≈ +4 °C. Çınar için kaynak ABD çınarı (Platanus occidentalis); Doğu çınarı için ayrı veri yok. Güney yüz tercihi ve tıkaç kullanımı genel uygulama, kaynakla doğrulanmadı." }
  },

  // ───────────────────────── YER YER ─────────────────────────
  {
    "id": "sf-ybt-cam",
    "category": "sf-ybt-yer",
    "title": "Çam: fıstık, iç kabuk unu, iğne çayı; porsuk tehlikesi",
    "tag": "ÇAM",
    "summary": "Bütün çamların tohumu yenir; iç kabuğu kurutup una katabilir, taze iğnelerinden çay demleyebilirsiniz. Önce iğneleri demet halinde olduğunu doğrulayın; tek tek dizilen yassı iğneli, kırmızı meyveli porsuk öldürür.",
    "note": "Türkiye'de olağan koşullarda devlet ormanlarında ağaçtan kabuk çıkarmak, dal kesmek ve kozalak-tohum toplamak 6831 sayılı Orman Kanunu'na göre yasaktır ya da izne bağlıdır; bu bilgi yalnız gerçek hayatta kalma durumu içindir. Gebeler çam iğnesi çayı içmemelidir.",
    "steps": [
      "Çamı tanıyın: iğneleri dala tek tek değil, dipten 2–5'li demetler halinde bağlanır; ağaçta odunsu kozalak olur. Türkiye'deki kızılçam, karaçam, sarıçam ve fıstık çamının iğneleri ikilidir.",
      "Porsuğu ayırın: yassı, koyu yeşil, alt yüzü açık renkli iğneler dala tek tek, iki sıra halinde dizilir; kozalak yoktur, sonbaharda kırmızı kadeh biçimli meyve verir. Porsuğun iğnesi ve tohumu ölümcüldür; çay yapmayın, çiğnemeyin.",
      "Çam fıstığı: fıstık çamının iri, ağır kozalağını ateş yanında ısıtın; pullar açılınca sert kabuklu tohumları silkeleyin. Kabuğu taşla kırıp içini yiyin. Öteki çamların tohumu küçüktür ama yenir.",
      "İç kabuk: kabuğun altındaki beyazımsı-sarımsı, nemli katmandır; dış kahverengi kabuk yenmez. Yeni kesilmiş ya da devrilmiş ağaçtan ya da kalın dallardan şerit şerit sıyırın. Canlı ağacın gövdesini halka biçiminde soymayın; ağaç kurur.",
      "İç kabuğu taze çiğneyebilir ya da haşlayabilirsiniz. Saklamak için güneşte ya da ateş yanında çıtırdayana kadar kurutun, dövüp un yapın.",
      "Kabuk ununu tek başına değil, una dörtte bir ile üçte bir oranında katarak ekmek ya da bazlama yapın. Acımsıdır ve sindirimi zordur; karın doyurur ama az besin verir.",
      "İğne çayı: taze, yeşil iğneleri küçük küçük doğrayın; bir avuç iğneyi bir bardak sıcak suda kapağı kapalı 10 dakika demleyin. İğneleri kaynatmayın; süzüp için.",
      "Gebe kadınlar çam iğnesi çayı içmesin, iğne ve tomurcuk çiğnemesin. Servi, ardıç ve öteki 'çam' sanılan ağaçlardan çay yapmayın.",
      "Reçineli, çok acı ya da yanık tadı veren iç kabuğu ve tohumu yemeyin; küflü kozalaktan tohum toplamayın."
    ],
    "art": [
      "sf-ybt-cam-porsuk",
      null,
      "sf-ybt-cam-fistigi",
      "sf-ybt-ic-kabuk",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Porsuğun iğnesinden ya da meyvesinden çay yapmayın, çiğnemeyin.",
      "Canlı çamın gövdesini çepeçevre soymayın.",
      "Gebelikte çam iğnesi çayı içmeyin.",
      "Kabuk ununu tek yiyecek yapmayın; tahıl unuyla karıştırın."
    ],
    "keywords": [
      "çam iğnesi çayı",
      "cam igne cayi",
      "çam kabuğu yenir mi",
      "çam iç kabuğu unu",
      "kabuk ekmeği",
      "çam fıstığı toplama",
      "fıstık çamı kozalak",
      "porsuk ağacı çam farkı",
      "porsuk zehirli mi"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 Ek B — Pine: bütün türlerin tohumu yenir, genç dalların iç kabuğu, iğne çayı (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Bark bread: iç kabuk (floem), kurutma, öğütme, una 1/4–1/3 katma, acılık ve düşük besin (https://en.wikipedia.org/wiki/Bark_bread)",
      "Awkward Botany — Pine needle teas: porsuk istisnası, gebelik uyarısı, iğneleri kaynatmama (https://awkwardbotany.com/tag/pine-trees/)",
      "CHOP Zehir Merkezi — Poisonous berries, porsuk (https://www.chop.edu/centers-programs/poison-control-center/poisonous-berries)",
      "6831 Orman Kanunu md. 14 metni (ayna: https://www.qsl.net/ta2iz/KANUN/ORMANK.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): porsuk ayrımı ve gebelik uyarısı yerinde; Türkiye'nin doğal çamlarının ikili iğnesi doğru; Orman Kanunu notu md. 14 ile tutarlı (ayna). Gebelik uyarısının dayanağı blog kaynağı; ZAYIF ama tutucu yönde. Yazarın teyidi: çam tohumu ve iç kabuk (FM 21-76), kabuk unu oranı 1/4–1/3 (Bark bread), gebelik ve porsuk uyarısı, iğneleri kaynatmama (Awkward Botany). Demleme süresi (10 dk) ve iğne miktarı genel uygulama; Türk çamlarının iğne sayısı (ikili) genel botanik bilgi, bu oturumda ayrıca açılmadı." }
  },
  {
    "id": "sf-ybt-sulak",
    "category": "sf-ybt-yer",
    "title": "Sulak alan bitkileri: kamış kökü, su teresi; karaciğer kelebeği riski",
    "tag": "SULAK ALAN",
    "summary": "Kamışın kökünü ve körpe filizini, su teresini temiz akarsudan toplayıp mutlaka pişirerek yiyin; çiğ su teresi ve su kenarı otları karaciğer kelebeği bulaştırır, sirke ve yıkama yetmez.",
    "note": "Su teresini ve su kenarından toplanan hiçbir otu çiğ yemeyin: karaciğer kelebeği (Fasciola) bu otlarla bulaşır, yıkama ve sirke korumaz. Su baldıranı da bu yerlerde yetişir ve öldürür; emin değilseniz toplamayın.",
    "steps": [
      "Kamış (saz): göl, dere ve bataklık kenarında 2–4 metreye uzanan, bambu gibi boğumlu, tepesinde tüylü mor-kahverengi salkım olan ottur. Su kamışı (puro başaklı hasır otu) ayrı bir bitkidir; onun için 'Yabani kökler ve yumrular' rehberine bakın.",
      "Kamışın çamurdaki yatay kökünü (rizom) çıkarın, yıkayıp soyun; kaynatın ya da közleyin. Lifliyse çiğneyip lifini tükürün.",
      "İlkbaharda topraktan yeni çıkan, henüz yaprak açmamış kamış filizlerini kesip haşlayarak yiyin.",
      "Su teresi: soğuk, temiz, akan suda yetişir; içi boş gövde, yuvarlakça yaprakçıklı tüysüz yaprak, 4 taç yapraklı küçük beyaz çiçek. Çiçeği şemsiye biçimindeyse su teresi değildir; su baldıranı olabilir, dokunmayın.",
      "Karaciğer kelebeğinin larvası su kenarı otlarına yapışır ve gözle görünmez. Su teresini nereden toplarsanız toplayın çiğ yemeyin; temiz görünen akarsu da yukarıda otlayan koyun, keçi ve sığırın gübresiyle kirlenmiş olabilir. Islak yerlerden toplanan karahindiba, nane ve kuzu marulu için de aynı kural geçerlidir.",
      "Yıkamak ve sirkeye yatırmak larvayı öldürmez. Su kenarı otlarını birkaç dakika kaynatın ya da yemeğin içinde iyice pişirin; 60 °C'nin üstünde birkaç dakika larvayı öldürür.",
      "Bu yerlerin suyunu da kaynatmadan içmeyin; aynı larva sudan da bulaşır.",
      "Karaciğer kelebeğinde haftalar sonra ateş, sağ üst karında ağrı, bulantı, kaşıntılı döküntü, sonra sarılık ve kansızlık görülebilir. Böyle belirtiler olursa sağlık kuruluşuna gidin; su kenarı otu yediğinizi söyleyin.",
      "Sanayi, lağım ya da tarla ilacı karışan sulardan hiçbir bitki toplamayın; pişirmek ağır metali ve ilacı gidermez."
    ],
    "art": [
      "sf-ybt-kamis",
      null,
      null,
      "sf-ybt-semsiye-yasak",
      null,
      "sf-ybt-tere-kaynatma",
      null,
      null,
      null
    ],
    "dont": [
      "Su teresini ve su kenarı otlarını çiğ salata yapmayın.",
      "Sirkeli suda bekletmenin otu temizlediğini düşünmeyin.",
      "Şemsiye çiçekli, maydanoz-kereviz yapraklı su kenarı bitkisini toplamayın.",
      "Hayvanların su içtiği, gübre akan yerlerden ot toplamayın."
    ],
    "keywords": [
      "su teresi toplama",
      "su teresi çiğ yenir mi",
      "kamış kökü yenir mi",
      "saz kökü",
      "bataklık bitkileri yiyecek",
      "karaciğer kelebeği",
      "fasciola tere",
      "su kenarı otu",
      "dere kenarı ot toplama"
    ],
    "sources": [
      "CDC — About liver flukes (Fasciola): çiğ su teresi ve tatlı su bitkileri, kirli su, hayvancılık bölgeleri (https://www.cdc.gov/liver-flukes/about/index.html)",
      "WHO — Foodborne trematode infections bilgi notu: Fasciola su bitkileriyle bulaşır; akut ve kronik belirtiler (https://www.who.int/news-room/fact-sheets/detail/foodborne-trematode-infections)",
      "ANSES — Fasciola hepatica tehlike fişi: 60 °C birkaç dakika öldürür, sirke ve yıkama etkisiz, yabani karahindiba-nane-kuzu marulu riski (https://www.anses.fr/en/system/files/MIC2011sa0172FiEN.pdf)",
      "ABD Ordusu FM 21-76 Ek B — Reed (Phragmites): bütün kısımlar çiğ ya da pişmiş yenir (https://www.wilderness-survival.net/Appb.php)",
      "ABD Ordusu FM 21-76 Bölüm 10 — su baldıranı ölümcül zehirli bitkiler arasında (https://www.wilderness-survival.net/chp10.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): ANSES Fasciola fişi açıldı: 60 °C birkaç dakika öldürür, sirke her derişimde etkisiz, yıkama yetmez, 4 °C'de 4 ay yaşar, yabani toplanan bitkiler en riskli. Su teresi için çiğ yeme yasağı 'hayvan otlayan yer' koşulundan çıkarılıp her yer için genelleştirildi. Yazarın teyidi: Fasciola çiğ su teresi ve tatlı su bitkileri, su ve sulama yoluyla bulaşır (CDC), su bitkileri ve belirtiler (WHO), 60 °C birkaç dakika öldürür, sirke tamamen etkisiz, yıkama yetmez (ANSES). FM 21-76 kamışın çiğ yenebileceğini söyler; Fasciola riski nedeniyle pişirme önerildi. Su teresinin tanımı genel botanik bilgi." }
  },
  {
    "id": "sf-ybt-kiyi-bitki",
    "category": "sf-ybt-yer",
    "title": "Kıyı bitkileri: deniz börülcesi, deniz rezenesi",
    "tag": "KIYI BİTKİSİ",
    "summary": "Deniz börülcesini temiz tuzlu bataklıktan, deniz rezenesini dalga serpintisi alan kayalardan körpeyken toplayın; kısa haşlayıp yiyin. Yaprağı etli olmayan şemsiye çiçekli bitkiye dokunmayın.",
    "steps": [
      "Toplama yerini seçin: liman, dere ağzı, lağım çıkışı, tersane, sanayi ve tarım ilacı akan kanal yakınından toplamayın. Bu bitkiler bulundukları suyun kirini taşır.",
      "Deniz börülcesi: tuzlu bataklık ve deniz kıyısındaki çamurlu düzlüklerde, yaprak yerine eklem eklem şişkin yeşil gövdeleri olan, karış boyunda bitkidir. Ege kıyılarında yaygındır.",
      "Börülcenin körpe, yeşil ve yumuşak uçlarını makasla kesin; kökünden sökmeyin. Sonbaharda kızarıp odunlaşan bitki serttir.",
      "Börülceyi bol suda birkaç dakika haşlayın, soğuk suya alın. Sert ortası varsa parmakla sıyırıp etli kısmı yiyin. Zaten tuzludur; tuz eklemeyin, yanında bol su için.",
      "Deniz rezenesi: deniz kıyısında kaya çatlaklarında, dalga serpintisi alan yerlerde yetişir; tüysüz, kalın, etli, şerit gibi yaprakları ve sarımsı-yeşil küçük şemsiye çiçekleri vardır. Ezince keskin, rezene-kereviz kokusu verir.",
      "Deniz rezenesi şemsiye çiçekli ailedendir. Yaprakları etli ve kalın değilse, ince parçalı ya da maydanoz gibiyse, gövdesi lekeli ya da kıyıdan içeride, dere kenarındaysa toplamayın; baldıran ya da su baldıranı olabilir.",
      "Deniz rezenesinin körpe yaprak ve saplarını ilkbahar ve yaz başında toplayın; çiğ az miktarda ya da haşlayıp yiyin, sirke ya da zeytinyağıyla turşusunu kurun.",
      "Kıyı çalılığındaki pembe-beyaz çiçekli, kalın mızrak yapraklı zakkum her yerde vardır; dalını, yaprağını, çiçeğini hiçbir iş için kullanmayın."
    ],
    "art": [
      null,
      "sf-ybt-borulce",
      null,
      null,
      null,
      "sf-ybt-semsiye-yasak",
      null,
      null
    ],
    "dont": [
      "Liman, dere ağzı ve lağım çıkışından kıyı bitkisi toplamayın.",
      "Etli yapraklı olmayan şemsiye çiçekli bitkiyi deniz rezenesi sanmayın.",
      "Börülceye tuz katmayın, tuzlu bitkiyle susuz kalmayın.",
      "Zakkum dalını şiş ya da ateş odunu yapmayın."
    ],
    "keywords": [
      "deniz börülcesi toplama",
      "deniz borulcesi",
      "deniz börülcesi haşlama",
      "deniz rezenesi",
      "kaya koruğu",
      "kıyıda yenen bitkiler",
      "sahilde yenen otlar",
      "tuzlu bataklık bitkisi"
    ],
    "sources": [
      "Küre Ansiklopedi — Deniz börülcesi: tuzlu bataklık, eklemli etli gövde, Ege'de yaygın, haşlanıp salata (https://kureansiklopedi.com/tr/detay/deniz-borulcesi-salicornia-europaea-a0f65)",
      "Wikipedia — Salicornia: tuzlu bataklık, etli eklemli gövde, sonbaharda kızarma, çiğ ya da pişmiş (https://en.wikipedia.org/wiki/Salicornia)",
      "Wikipedia — Crithmum (deniz rezenesi): kaya çatlakları, tüysüz etli yaprak, sarı çiçek, turşu (https://en.wikipedia.org/wiki/Crithmum)",
      "ABD Ordusu FM 21-76 Bölüm 10 — zakkum ve baldıranlar yutmayla zehirleyen bitkiler (https://www.wilderness-survival.net/chp10.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): içerik tutucu; değişiklik gerekmedi. Börülce hazırlama ayrıntıları ZAYIF. Yazarın teyidi: Salicornia yeri ve görünüşü, sonbaharda kızarma; Crithmum kaya çatlağında, etli tüysüz yaprak, sarı çiçek, turşu. Börülcenin sert orta lifini sıyırma ve toplama ayları Türk mutfağı bilgisi; kaynakla doğrulanmadı. Deniz rezenesinin Türkçe 'kaya koruğu' adı yöresel, doğrulanmadı." }
  },
  {
    "id": "sf-ybt-akdeniz",
    "category": "sf-ybt-yer",
    "title": "Akdeniz çalılığı: keçiboynuzu, mersin, menengiç, çitlembik",
    "tag": "AKDENİZ",
    "summary": "Kıyı çalılığında keçiboynuzunun olgun kahverengi baklasını, mersinin mavi-siyah tanesini, menengiç ve çitlembiğin küçük tanelerini toplayın; zakkumu ve tanımadığınız kırmızı-siyah taneli çalıları ayırın.",
    "steps": [
      "Keçiboynuzu (harnup): kıyı yamaçlarında, kalın, parlak, koyu yeşil yapraklı ağaç. Baklası bir yılda olgunlaşır; koyu kahverengi, kuru ve tatlı olanı toplayın.",
      "Keçiboynuzunun etli kısmını çiğneyip yiyin; çok sert tohumları tükürün. Kurutup dövüp un yapabilirsiniz.",
      "Keçiboynuzu pekmezi: baklaları kırıp bir gece suda bekletin, sonra kaynatın; suyu süzüp koyulaşana dek kaynatarak şurup yapın. Ağzı kapalı kapta saklayın.",
      "Mersin: kokulu, küçük (2–5 cm) parlak yapraklı çalı; yaprağı ezince güzel kokar. Sonbaharda mavi-siyah olgunlaşan tanelerini taze yiyin ya da kurutun.",
      "Menengiç (çitlembik de denir): reçine kokulu ağaççık; nohut tanesinden küçük (5–7 mm) meyvesi önce kırmızı, olgunlaşınca kahverengi-siyah olur. Olgun taneleri kavurup dövün ve kahve gibi kaynatın; ya da az miktarda çiğ yiyin.",
      "Akdeniz çitlenbiği: dere boyu ve köy meydanlarındaki iri ağaç; yaklaşık 1 cm, koyu mor, tatlı küçük taneler verir. Etli kısmı az, çekirdeği iridir; tanelerini çiğ yiyin.",
      "Yöre adlarına güvenmeyin: aynı ad başka yörede başka bitkiye verilir. Bitkiyi yaprak, koku ve meyveyle tanıyın.",
      "Zakkumu ayırın: dere yataklarında ve yol kenarlarında, uzun, kalın, deri gibi, ikili ya da üçlü dizilen yapraklı, pembe-beyaz çiçekli çalı. Yaprağı defneye benzetilir; her yeri öldürür. Defnenin yaprakları dalda tek tek, sırayla dizilir ve ezince güçlü baharat kokar; kokmayan yaprağı yemeğe atmayın. Koku tek başına kanıt değildir: karayemişin (laz kirazı) yaprağı da defneye benzer, ezince acıbadem kokar ve siyanür verir. Yalnız defne olduğunu kesin bildiğiniz ağaçtan yaprak alın.",
      "Tanımadığınız kırmızı ya da siyah taneli çalıların meyvesini yemeyin; çalılıkta zehirli taneli türler de vardır."
    ],
    "art": [
      "sf-ybt-keciboynuzu",
      null,
      null,
      null,
      null,
      null,
      null,
      "sf-ybt-zakkum-defne",
      null
    ],
    "dont": [
      "Zakkum ya da karayemiş yaprağını defne sanıp yemeğe koymayın, zakkum dalını şiş yapmayın.",
      "Keçiboynuzunun sert tohumunu kırıp yemeye çalışmayın; dişi kırar.",
      "Yöresel ada güvenerek tanımadığınız meyveyi yemeyin.",
      "Menengiç ve mersini bir anda bol yemeyin; buruk, reçineli taneler mideyi bozar."
    ],
    "keywords": [
      "keçiboynuzu toplama",
      "harnup pekmezi",
      "keçiboynuzu nasıl yenir",
      "mersin meyvesi yenir mi",
      "menengiç kahvesi yapımı",
      "çitlembik yenir mi",
      "maki bitkileri yiyecek",
      "zakkum defne farkı",
      "akdeniz çalılığı yiyecek"
    ],
    "sources": [
      "Wikipedia — Carob: bakla bir yılda olgunlaşır, etli kısım tatlı, tohum sert, şurup (https://en.wikipedia.org/wiki/Carob)",
      "ABD Ordusu FM 21-76 Ek B — Carob: genç baklalar çiğ ya da haşlanmış yenir (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Myrtus communis: mavi-siyah yenen meyve, 2–5 cm yaprak, kokulu yağ (https://en.wikipedia.org/wiki/Myrtus_communis)",
      "Wikipedia — Pistacia terebinthus: 5–7 mm meyve, kırmızıdan kahverengiye, menengiç kahvesi (https://en.wikipedia.org/wiki/Pistacia_terebinthus)",
      "Wikipedia — Celtis australis: 1 cm koyu mor tatlı meyve, çiğ yenir, Anadolu (https://en.wikipedia.org/wiki/Celtis_australis)",
      "ABD Ordusu FM 21-76 Bölüm 10 — zakkum (https://www.wilderness-survival.net/chp10.php)",
      "Gaggiano ve ark. 2022 (PMC9697506) — Laurel ve karayemiş karışması: karayemiş yaprağında prunasin, acıbadem kokusu, kenar dişli, zehirlenme olguları (https://pmc.ncbi.nlm.nih.gov/articles/PMC9697506)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): zakkum-defne ayrımına karayemiş (Prunus laurocerasus) eklendi: yaprağı defneye benzer, ezince acıbadem kokar, siyanojenik glikozit içerir; 'koku tek başına kanıt değil' uyarısı yazıldı. Yazarın teyidi: keçiboynuzu olgunlaşma süresi, sert tohum, şurup; mersin, menengiç (kavrulmuş kahve), çitlenbik meyve özellikleri. Pekmez yapım ayrıntısı (bir gece bekletme) geleneksel bilgi, kaynakla doğrulanmadı. 'Çitlembik' adı yöreye göre hem Pistacia terebinthus hem Celtis için kullanılır; ikisi ayrı yazıldı. Zakkum yaprak dizilişi 01 paketindeki Nerium kaynağına dayanır." }
  },
  {
    "id": "sf-ybt-yosun",
    "category": "sf-ybt-yer",
    "title": "Deniz yosunu ve tatlı su yosunu; ağır metal riski",
    "tag": "YOSUN",
    "summary": "Deniz yosununu yalnız temiz açık kıyıda kayaya bağlı, canlı haliyle az miktarda toplayın; tatlı su yosununu ve göl yüzündeki yeşil-mavi köpüğü hiç yemeyin, o sudan içmeyin.",
    "note": "Uzman gözetimi olmadan yosunu düzenli yiyecek yapmayın: yosun bulunduğu suyun ağır metalini ve arseniğini biriktirir; tatlı sudaki mavi-yeşil yosun zehri kaynatmakla gitmez.",
    "steps": [
      "Deniz yosunu: dalga ve akıntı alan, liman, sanayi, tersane ve lağım çıkışından uzak açık kayalık kıyıları seçin. Yosun kadmiyum, kurşun, cıva ve arsenik gibi metalleri bulunduğu sudan biriktirir; pişirmek bunları gidermez.",
      "Yalnız kayaya bağlı, canlı, parlak renkli yosunu kesin. Kıyıya vurmuş, kokan, beyazlamış ya da çürüyen yosunu toplamayın.",
      "En kolay tanınan, ince, marul yaprağı gibi parlak yeşil deniz marulu ve benzeri yeşil yosunlardır. Kalın, kahverengi, kayış gibi yosunlarda iyot çok yüksektir; bunlardan çok az yiyin.",
      "Yosunu temiz suda birkaç kez çalkalayıp kumunu ve küçük canlıları ayıklayın. Kalın yosunları kısa süre haşlayarak yumuşatın; suyunu dökün.",
      "Yosunu ana yiyecek yapmayın; yemeğe çeşni olarak, günde birkaç tutam katın. Çocuklara, gebelere ve tiroit hastalığı olanlara düzenli vermeyin.",
      "Tatlı su yosununu yemeyin. Göl, gölet ve yavaş akan derelerde yüzeyde yeşil, mavi-yeşil, kahverengi ya da kırmızımsı köpük, keçe, boya gibi tabaka varsa o sudan içmeyin, yıkanmayın, hayvanları uzak tutun.",
      "Bu yosunların zehri kaynatmakla yok olmaz; kaynatmak yalnız mikrobu öldürür. Başka su kaynağı arayın. Bu sulardan tutulan balık ve midyenin iç organlarını yemeyin.",
      "Yosun ya da yosunlu su sonrası kusma, karın ağrısı, ishal, baş ağrısı, ağız çevresinde kabarma olursa 112'yi ya da 114'ü arayın. Hayvanlar bu sudan birkaç saatte ölebilir; ölü hayvan görürseniz uzak durun."
    ],
    "art": [
      "sf-ybt-yosun-temiz-kiyi",
      null,
      null,
      null,
      null,
      "sf-ybt-gol-kopuk",
      null,
      null
    ],
    "dont": [
      "Liman ve sanayi kıyısından yosun toplamayın.",
      "Kıyıya vurmuş çürük yosunu yemeyin.",
      "Göl yüzündeki yeşil-mavi köpüklü suyu kaynatıp içmeyin; zehri gitmez.",
      "Kahverengi kalın yosunu bol ve her gün yemeyin; iyodu çok yüksektir."
    ],
    "keywords": [
      "deniz yosunu yenir mi",
      "yosun toplama",
      "deniz marulu",
      "yosun ağır metal",
      "tatlı su yosunu",
      "göl yosunu zehirli mi",
      "mavi yeşil yosun",
      "siyanobakteri su",
      "yosunlu su içilir mi"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 Ek B — Seaweed: iyot kaynağı, kayaya bağlı canlı bitkiyi toplama, kalınları kısa haşlama (https://www.wilderness-survival.net/plants-1.php)",
      "Food Safety News — Nordic nations assess seaweed safety: kahverengi yosunda en yüksek iyot ve kadmiyum, arsenik, kurşun, cıva (https://www.foodsafetynews.com/2023/02/nordic-nations-assess-seaweed-safety/)",
      "Food Safety News — FSA hijiki uyarısı, inorganik arsenik (https://www.foodsafetynews.com/2010/08/food-standards-agency-issues-seaweed-warning/)",
      "CDC — Harmful algal blooms: köpük, keçe, boya görünümü; renk; hayvanlar saatler içinde ölebilir; kabuklu ve balık (https://www.cdc.gov/harmful-algal-blooms/about/index.html)",
      "EPA — Health effects of cyanotoxins: kusma, karın ağrısı, ishal, ağız çevresinde kabarma (https://www.epa.gov/cyanohabs/health-effects-cyanotoxins)",
      "Michigan State Univ. Extension — Toledo: kaynatma mikrosistin zehrini yok etmez (https://www.canr.msu.edu/news/the_toledo_water_supply_shut_down._why_boil_water_advisories_were_not_enoug)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): siyanobakteri bölümü (kaynatma zehri gidermez, hayvan ölümleri, uzak durma) yazar kaynaklarıyla tutarlı; WHO sayfası yine açılamadı. 'Günde birkaç tutam' sayısal kaynaksız ihtiyat; ZAYIF. Yazarın teyidi: kahverengi yosunda yüksek iyot ve kadmiyum, arsenik (Nordic değerlendirme, FSA hijiki); siyanobakteri görünümü ve belirtiler (CDC, EPA); kaynatma mikrosistini yok etmez (MSU). Türkiye kıyılarındaki yosun türlerine özgü metal verisi bulunamadı; 'günde birkaç tutam' bir ihtiyat önerisidir, sayısal sınır kaynağı yok. WHO siyanobakteri bilgi notu açılamadı." }
  },
  {
    "id": "sf-ybt-liken",
    "category": "sf-ybt-yer",
    "title": "Liken hazırlama: yalnız kıtlıkta (İzlanda likeni ve benzerleri)",
    "tag": "LİKEN",
    "summary": "Liken yalnız başka yiyecek kalmadığında yenir: sarı ve turuncu likenleri ve sakal likenini atın, temiz yerden toplananları küllü ya da sodalı suda bekletip kaynatarak acı asitlerini giderin.",
    "note": "Uzman gözetimi olmadan likeni düzenli yiyecek yapmayın: bazı likenler zehirlidir, hepsi havadaki kirliliği ve ağır metali biriktirir; ham liken ağır mide ağrısı yapar.",
    "steps": [
      "Liken, taş, toprak ve ağaç üstünde yetişen, kökü olmayan yosun benzeri kabuk ya da çalımsı canlıdır. Az besin verir; yalnız açlık tehlikesi varsa başvurun.",
      "İzlanda likeni (İzlanda yosunu): yerde yetişen, kenarları kıvrık, kahverengi-zeytin yeşili, kıvrık şerit dallı bir likendir. Türkiye'de yalnız yüksek dağların ağaç sınırı üstündeki çayır ve kayalıklarında seyrek bulunur (ör. Uludağ'da 2100 m üstü); ova ve ormanda bulamazsınız. Orada göreceğiniz ağaç ve kaya likenlerinin çoğunun yenebilirliği bilinmez: bunları yalnız gerçek açlık tehlikesinde, aşağıdaki kurallara uyarak ve çok az miktarda deneyin.",
      "Sarı, turuncu ve parlak yeşilimsi-sarı likenleri hiç toplamayın; zehirli likenlerin çoğu sarıdır. Ağaç dallarından sakal gibi sarkan sakal likenini de yemeyin; acı asidi yüksektir.",
      "Yol, fabrika, maden, şehir ve baca yakınından liken toplamayın; liken havadaki metali ve kiri biriktirir. Temiz dağ ve orman havasında, gür yetişen likeni seçin.",
      "Likeni toplayıp ayıklayın; toprak, çam iğnesi ve böcekleri temizleyin, doğrayın.",
      "Acılığı giderin: iki su bardağı doğranmış likene 1–2 çay kaşığı sert ağaç külü ya da karbonat katılmış suda bir gece bekletin.",
      "Suyu dökün, temiz suyla yıkayın. Taze suda kaynatın; su acıysa döküp yeniden kaynatın. Acılık kaybolup liken yumuşak, jöle gibi olunca hazırdır.",
      "Kaynamış likeni çorbaya, sütlaca ya da tahıla koyulaştırıcı olarak katın; ya da kurutup dövüp una karıştırın.",
      "İlk gün az yiyin. Karın ağrısı, kusma ya da sarılık olursa bırakın ve sağlık yardımı arayın."
    ],
    "art": [
      null,
      null,
      "sf-ybt-liken-ayrim",
      null,
      null,
      "sf-ybt-liken-kul",
      null,
      null,
      null
    ],
    "dont": [
      "Sarı ve turuncu liken yemeyin.",
      "Sakal likenini ve kurt likenini çiğnemeyin, çay yapmayın.",
      "Yol ve sanayi kenarı likenini toplamayın.",
      "Likeni acılığını gidermeden yemeyin; ağır mide ağrısı yapar."
    ],
    "keywords": [
      "liken yenir mi",
      "izlanda yosunu",
      "izlanda likeni hazırlama",
      "kaya yosunu yemek",
      "liken nasıl pişirilir",
      "ağaç yosunu yenir mi",
      "sakal likeni zehirli",
      "kıtlık yiyeceği liken"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 Ek B — Iceland moss: kaynatma acılığı giderir, koyulaştırıcı; Rock tripe: zehirlenme bildirimleri (https://www.wilderness-survival.net/Appb.php)",
      "Wikipedia — Cetraria islandica: kuzey dağları, kaynatma acılığı azaltır, ekmek-çorba (https://en.wikipedia.org/wiki/Cetraria_islandica)",
      "Wikipedia — Ethnolichenology: kıtlık yiyeceği, kurt likeni, usnik asit, sarı likenler zehirli sayılmalı (https://en.wikipedia.org/wiki/Ethnolichenology)",
      "Wikipedia — Lichen: metal kirliliğini biriktirir, çok az liken zehirlidir, çoğu zehirli liken sarıdır (https://en.wikipedia.org/wiki/Lichen)",
      "Foraging Texas — Lichen: 2 bardak likene 1–2 çay kaşığı kül ya da karbonat, ham liken mide ağrısı (https://www.foragingtexas.com/2007/07/lichen.html)",
      "Güvenç ve Öztürk 2004, Turk J Bot 28:299–306 — Uludağ alpin liken kayıtları: Cetraria islandica 2130–2200 m (https://aj.tubitak.gov.tr/botany/issues/bot-04-28-3/bot-28-3-4-0303-8.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): Cetraria islandica'nın Türkiye'de Uludağ alpin kuşağında (2130–2200 m, silisli kaya ve toprak) kayıtlı olduğu Turk J Bot makalesinde doğrulandı; rehber 'yalnız yüksek dağlarda seyrek' biçiminde düzeltildi ve öteki likenler için tutucu genel kural eklendi. Kül oranı tek kaynak; ZAYIF. Yazarın teyidi: kaynatma acılığı giderir (FM 21-76, Wikipedia), sarı likenler zehirli sayılmalı, usnik asit (Ethnolichenology, Lichen), metal birikimi (Lichen), kül-karbonat oranı (Foraging Texas, tek kaynak). İzlanda likeninin Türkiye'deki yayılışı doğrulanamadı; FM 21-76 'yalnız Arktik' der. Sakal likeni (Usnea) için doğrudan zehirlilik kaynağı yok; usnik asit yüksekliği nedeniyle ihtiyatla yasaklandı." }
  },
  {
    "id": "sf-ybt-bahce",
    "category": "sf-ybt-yer",
    "title": "Terk edilmiş bahçe ve tarla: yabanileşmiş sebze ve meyve",
    "tag": "ESKİ BAHÇE",
    "summary": "Terk edilmiş bahçe ve tarlalarda meyve ağaçları, asma, patates, fasulye, kabak ve soğan bulunur; yeşillenmiş patatesi, acı kabağı, çiğ fasulyeyi ve süs bitkilerini ayırın, ilaç depolarından uzak durun.",
    "steps": [
      "Eski köy ve bahçe yerleri yabani ormandan çok daha zengindir: meyve ağaçları, asma, ayva, dut, enginar, kuşkonmaz, nane, sarımsak ve kendiliğinden çıkan sebzeler aylarca, yıllarca sürer.",
      "Bahçede önce tehlikeye bakın: tarım ilacı şişeleri, gübre çuvalları, akaryakıt bidonu, boyası dökülen eski bina. Bu noktaların çevresindeki sebze ve otları toplamayın.",
      "Patates: kendiliğinden çıkan patatesi toplayın; yeşillenmiş, filizlenmiş ya da acı tatlı yumrunun yeşil kısmını ve kabuğunu kalınca soyup atın. Her yeri yeşil ya da acıysa atın; pişirmek zehri gidermez.",
      "Kuru fasulye: tanelerini en az 5 saat suda bekletin, suyunu dökün, taze suda en az 30 dakika fokur fokur kaynatın. Az pişmiş 4–5 fasulye tanesi bile şiddetli kusma yapabilir.",
      "Kabak, salatalık, kavun: kendiliğinden çıkmış ya da sıcakta susuz kalmış bitkinin meyvesinden çiğ küçük bir parça tadın. Acıysa tükürün ve bütün meyveyi atın; bu acılık pişirmekle gitmez. Bahçe ve tarla kenarında eşek hıyarı da çıkar; onu toplamayın.",
      "Soğan ve sarımsak: yaprağı ezince soğan-sarımsak kokusu gelmeli. Kokusuz soğanlar süs bitkisidir (nergis, sümbül, lale) ya da acı çiğdemdir; yemeyin.",
      "Ravent: yalnız kırmızımsı yaprak sapını pişirerek yiyin; yaprağı zehirlidir. Domates ve patatesin yaprağını ve sapını yemeyin.",
      "Süs bitkilerini tanıyın ve dokunmayın: zakkum, yüksük otu, boru çiçeği, mor salkım, altın yağmuru, sarmaşık ve kokulu süs çalılarının meyveleri.",
      "Meyve ağaçlarını budayıp sulayarak yeniden verimli hale getirin; tohum ve çelik alın. Ayrıntı 'Tarım ve hayvancılık' paketindedir."
    ],
    "art": [
      null,
      "sf-ybt-bahce-tehlike",
      "sf-ybt-yesil-patates",
      null,
      "sf-ybt-aci-kabak",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Acı tadan kabak, salatalık ve kavunu pişirip yemeyin.",
      "Kuru fasulyeyi az kaynatıp yemeyin; düşük ateşte uzun pişirmek yetmez, fokur fokur kaynamalı.",
      "Yeşillenmiş patatesi kabuğuyla yemeyin.",
      "İlaç ve gübre deposu çevresinden ot toplamayın."
    ],
    "keywords": [
      "terk edilmiş bahçe yiyecek",
      "boş köyde yiyecek bulma",
      "eski bahçe sebze",
      "yeşil patates zehirli mi",
      "acı kabak zehirli",
      "çiğ fasulye zehirlenmesi",
      "kendiliğinden çıkan kabak",
      "ravent yaprağı zehirli",
      "terk edilmis tarla"
    ],
    "sources": [
      "Wikipedia — Solanine: yeşillenmiş patates, pişirmenin etkisi az, kabukta yüksek, acı tat uyarı (https://en.wikipedia.org/wiki/Solanine)",
      "Ohio State Univ. Chow Line — kuru fasulye: 4–5 az pişmiş tane hastalık yapar, en az 5 saat bekletme, en az 30 dk kaynatma, yavaş pişirici yetmez (https://cfaes.osu.edu/news/articles/chow-line-dry-kidney-beans-need-be-boiled)",
      "Poison Control (ABD) — Toxic squash syndrome: kukurbitasin, pişirmekle gitmez, acı tadı tükürme (https://www.poison.org/articles/toxic-squash-syndrome-if-it-s-bitter-it-s-not-dinner)",
      "Minnesota Univ. Extension — Edible flowers: ravent yaprağı, kökü ve çiçeği zehirli (https://extension.umn.edu/flowers/edible-flowers)",
      "ANSES — Toxic plants: soğanlı süs bitkileri-soğan karışması, acı kabak (https://www.anses.fr/en/content/toxic-plants)",
      "Colorado State Univ. Extension — zehirli çiçekler: nergis, yüksük otu, zakkum (https://extension.colostate.edu/resource/edible-flowers)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): 'acı kavun' adı eşek hıyarı için doğrulanamadı (kudret narına da denir); kaldırıldı. Yazarın teyidi: solanin, fasulye 5 sa/30 dk ve 4–5 tane, kukurbitasin ve tükürme, ravent yaprağı, soğanlı süs bitkileri. Domates ve patates yaprağının zehirliliği bu oturumda ayrıca açılmadı (Solanaceae genel bilgisi). Eşek hıyarı (Ecballium) Türkiye bitki zehirlenmeleri derlemesinde geçiyor." }
  },
  {
    "id": "sf-ybt-sehir",
    "category": "sf-ybt-yer",
    "title": "Şehirde yiyecek bulma: kirlilik ve ilaçlanmış alanlar",
    "tag": "ŞEHİR",
    "summary": "Şehirde meyve ağaçları ve otlar vardır, ama trafik, eski boya ve ilaç kiri taşır: meyveyi yapraklı otlara tercih edin, yol ve bina dibinden uzak toplayın, dış yaprakları atın, kökleri soyun, iyice yıkayın.",
    "steps": [
      "Şehirde önce meyveye yönelin: dut, erik, ayva, incir, zeytin, keçiboynuzu, ıhlamur, ceviz. Meyveler topraktaki kurşunu yapraklı otlara ve köklere göre çok daha az taşır.",
      "Kurşun en çok işlek yolların birkaç metre içinde ve eski binaların dibinde, boyanın döküldüğü toprakta birikir. Yapraklı otları ve kökleri buralardan değil, yoldan ve binadan olabildiğince uzak, iç bahçe ve park ortalarından toplayın.",
      "Park, refüj, okul, hastane ve site bahçeleri çoğu kez ilaçlanır; çimeni kısa, kenarları yabani ottan arınmış, sarararak ölmüş ot lekeleri olan yerler ilaç atıldığını gösterir. Buradan ot toplamayın.",
      "Köpek gezdirilen çim ve çit diplerinden, lağım taşan dere kenarından, çöp yığınından ve sel suyunun değdiği yerlerden yenecek ot toplamayın.",
      "Akaryakıt istasyonu, oto tamirhanesi, sanayi sitesi, demiryolu, eski fabrika ve yangın yeri çevresini tümüyle atlayın.",
      "Yapraklı otların dış yapraklarını atın, kökleri kalınca soyun. Kalanı temiz suda ovarak yıkayın; varsa 1 litre suya 1 yemek kaşığı sirke katılmış suda çalkalayıp yeniden durulayın. Kirin çoğu yüzeydeki toz ve topraktır.",
      "Yıkamak toprağın içinden emilen metali ve ilacı gidermez. Kuşkulu yerden gelen otu düzenli yemeyin, ara sıra ve az yiyin.",
      "Çocuklar kurşunu yetişkinden yaklaşık beş kat fazla emer. Çocukların çıplak, kirli toprakta oynamasına ve toprağı ağza götürmesine izin vermeyin; çocuklara şehir otu yerine meyve verin."
    ],
    "art": [
      "sf-ybt-sehir-meyve",
      "sf-ybt-sehir-mesafe",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kaldırım, refüj ve yol kenarından yapraklı ot toplamayın.",
      "Eski boyalı bina dibindeki toprakta yetişen sebzeyi yemeyin.",
      "İlaçlanmış görünen park ve bahçelerden ot toplamayın.",
      "Sel suyu değmiş sebze ve otları yemeyin."
    ],
    "keywords": [
      "şehirde yiyecek bulma",
      "sehirde ot toplama",
      "park otu yenir mi",
      "yol kenarı ot kurşun",
      "kurşun kirliliği sebze",
      "şehirde meyve ağacı",
      "ilaçlanmış park",
      "deprem sonrası şehirde yiyecek"
    ],
    "sources": [
      "Minnesota Univ. — Lead in the home garden and urban soil environment: kurşun işlek yolların birkaç adım içinde ve bina temellerinde yüksek; meyveli bitkiler az biriktirir; dış yaprak atma, kök soyma, %1 sirkeli su; çocuklar 5 kat fazla emer (https://soiltest.dl9.umn.edu/sites/soiltest.cfans.umn.edu/files/files/media/lead_in_the_home_garden_and_urban_soil_environment.pdf)",
      "Minnesota Univ. Extension — Edible flowers: yol kenarı ve ilaçlı bitki yememe (https://extension.umn.edu/flowers/edible-flowers)",
      "ABD Ordusu FM 21-76 Ek B — Chicory ve mulberry: yol kenarı ve terk edilmiş alanlar (https://www.wilderness-survival.net/Appb.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): içerik tutucu; değişiklik gerekmedi. Yazarın teyidi: kurşun dağılımı, meyve-yaprak-kök farkı, dış yaprak ve soyma, %1 sirkeli su (1 L'ye ~1 yemek kaşığı sirke ≈ %0,7–1, sirkenin asitliğine göre), çocuklarda 5 kat emilim (UMN). İlaç atılmış alanların görünüş belirtileri ve sel suyu uyarısı genel güvenlik bilgisi; ayrı kaynakla doğrulanmadı." }
  },

  // ───────────────────────── ZEHİR, İŞLEME VE GÜVENLİK ─────────────────────────
  {
    "id": "sf-ybt-zehirli-otlar",
    "category": "sf-ybt-guvenlik",
    "title": "Türkiye'nin en tehlikeli zehirli bitkileri 1: yenen otlara karışan otlar",
    "tag": "ZEHİRLİ OT",
    "summary": "Baldıran, su baldıranı, acı çiğdem, akçöpleme, kurtboğan, yüksük otu, yılan yastığı, güzelavratotu ve tatula yenen otlara, ıspanağa ve soğana karışarak öldürür; onları tanıyın ve uzak durun.",
    "note": "Bu rehber yalnız tanıma ve uzak durma içindir; bu bitkilerin hiçbir kısmını yemeyin, çay yapmayın, ilaç diye kullanmayın. Zehirlenme belirtisinde 114 Ulusal Zehir Danışma Merkezi'ni ya da 112'yi arayın.",
    "steps": [
      "Baldıran: 1–2 metreye uzanan, tüysüz, mor lekeli gövdeli, beyaz şemsiye çiçekli, maydanoz yapraklı ot; ezince fare idrarı gibi kötü kokar. Yol, çit ve tarla kenarında çıkar; ilk yıl yere yayılmış yaprak demetidir. Ayrıntı: 'Zehirli benzerler' rehberi.",
      "Su baldıranı: dere, kanal ve bataklık kenarında, kereviz-maydanoz gibi yapraklı, beyaz şemsiye çiçekli ot. Kökü ve gövdesi en zehirli kısımdır; nöbet ve ölüm yapar. Su kenarında şemsiye çiçekli hiçbir ota dokunmayın.",
      "Acı çiğdem: sonbaharda yapraksız pembe-mor çiçek açar; ilkbaharda yabani sarımsak, soğan ve pırasaya benzeyen kokusuz şerit yaprakları çıkar. Yumrusu ve yaprağı öldürür; belirtiler saatler sonra başlar. Yumrusu yenen çiğdemle (Crocus) de karışabilir; yumrudan ayırt etmeye çalışmayın, yabani çiğdem yumrusu yemeyin.",
      "Akçöpleme ya da ağu kunduzu (Veratrum album; Türkiye'deki tek Veratrum türü): yayla ve dağ çayırlarında, kalın gövdede sarmal dizilen, belirgin pileli-kırışık geniş yapraklı, tepede yeşilimsi-beyaz çiçek salkımlı ot. Çiçeksizken yaprak demeti yabani sarımsak ve centiyanayla karışır; yarım ile 4 saat içinde kusma, nabız yavaşlaması, tansiyon düşmesi yapar. Yerel adlar yöreden yöreye değişir; ada değil, bitkiye bakın.",
      "Kurtboğan (Aconitum): dağ ve orman kenarında, el gibi derin parçalı yapraklı, miğfer biçimli çiçekli ot. Çiçek rengine güvenmeyin: Türkiye'deki türlerin çiçeği mavi-mor olabildiği gibi soluk mor, krem ya da sarımsı-beyaz da olabilir. Çok küçük miktarı bile öldürür; çıplak elle koparmayın.",
      "Yüksük otu: yüksük biçimli mor, pembe ya da sarı çiçek salkımlı, tüylü yapraklı ot. Çiçeksizken yaprağı hodan ve karakafes gibi otlarla karışır; kalbi durdurur.",
      "Yılan yastığı (Arum): gölgede, ok ya da mızrak biçimli parlak yapraklı, külah gibi çiçekli, yazın kırmızı-turuncu taneli koçan veren ot. Yaprağı kuzukulağı ve ıspanakla karışır; ağzı ve boğazı yakar.",
      "Güzelavratotu ve tatula: yaprakları ıspanak, pırasa ve tere tarlalarına karışır (ayrıntı: 'Yaz toplaması' rehberi). Ağız kuruluğu, göz bebeği büyümesi, ateş, sayıklama yapar.",
      "Ortak kural: buradaki görünüş ipuçları yalnız uzak durmak içindir; bir otun bu tanımlara uymaması onun güvenli olduğunu göstermez. Yüzde yüz emin değilseniz yemeyin. Ot toplarken her türü ayrı, tek tek toplayın; yabancı yaprağı ayıklayın; tadı tuhaf ya da yakıcıysa tükürün. Topladığınızın fotoğrafını çekin ya da bir dalını saklayın.",
      "Zehirlenme kuşkusunda: ağızda kalanı çıkarın, kusturmaya çalışmayın, süt ya da tuzlu su vermeyin. 114'ü ya da 112'yi arayın; bitkinin adını, yenen miktarı ve saati söyleyin, bitki parçasını sağlık ekibine verin."
    ],
    "art": [
      null,
      "sf-ybt-su-baldirani",
      null,
      "sf-ybt-cople",
      "sf-ybt-kurtbogan",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Bu bitkileri 'şifalı' diye çay, lapa ya da merhem yapmayın.",
      "Tadına bakarak tanımaya çalışmayın.",
      "Kurtboğan ve baldıranı çıplak elle koparmayın.",
      "Belirtiler hafifledi diye sağlık yardımından vazgeçmeyin."
    ],
    "keywords": [
      "zehirli otlar türkiye",
      "türkiyenin zehirli bitkileri",
      "su baldıranı",
      "acı çiğdem zehirlenmesi",
      "akçöpleme veratrum",
      "kurtboğan bitkisi",
      "yüksük otu zehirli",
      "yılan yastığı bitkisi",
      "zehirli ot nasıl tanınır",
      "ıspanağa karışan zehirli ot"
    ],
    "sources": [
      "ANSES — Toxic plants: acı çiğdem-yabani sarımsak (2020'de 20 zehirlenme), yüksük otu-karakafes, su baldıranı, güzelavratotu, Veratrum-centiyana, yılan yastığı-kuzukulağı/ıspanak; kucak kucak toplamama, fotoğraf (https://www.anses.fr/en/content/toxic-plants)",
      "Wikipedia — Veratrum album: pileli yaprak, Türkiye'de yetişir, karışmalar, belirti 30 dk–4 sa (https://en.wikipedia.org/wiki/Veratrum_album)",
      "BfR — Poisonous plants SSS: kurtboğan, acı çiğdem, güzelavratotu, baldıran, tatula ağır risk; ağızdakini çıkarma, kusturmama, süt ve tuzlu su vermeme, bitkiyi götürme (https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/poisonous-plants-how-to-protect-yourself-and-what-to-do-in-case-of-poisoning/)",
      "Atatürk Üniv. — Herbal poisoning cases in Turkey: güzelavratotu, baldıran, orman gülü, eşek hıyarı (https://avesis.atauni.edu.tr/yayin/f8e350d0-def9-416a-a3e9-39240211b43f/herbal-poisoning-cases-in-turkey-a-narrative-review)",
      "ABD Ordusu FM 21-76 Bölüm 10 — zehirli ve su baldıranı; 'kaynatma her zehri gidermez' (https://www.wilderness-survival.net/chp10.php)",
      "Sözcü — Kayseri güzelavratotu zehirlenmeleri (https://www.sozcu.com.tr/kayseri-de-guzelavrat-otundan-bir-ayda-30-kisi-zehirlendi-p5876)",
      "Ege Üniv. YL tezi (Anamur 2015) — Veratrum album 'Akçöpleme ya da Ağukunduzu' (https://tezara.org/theses/420563)",
      "SDÜ — Beyaz çiçekli Aconitum orientale örneği (https://avesis.sdu.edu.tr/yayin/3de0c16e-5136-49e8-a483-30fc8cc46d37/a-new-diterpenoid-alkaloid-from-the-roots-of-a-white-flowering-aconitum-orientale-sample)",
      "Türkiye Bitkileri — Aconitum (kurtboğan) cinsi (https://turkiyebitkileri.com/fotoğraf-galerisi/ranunculaceae-duğunciceğigiller/aconitum-kurtboğan/aconitum-orientale.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): akçöpleme / ağu kunduzu adı doğrulandı; kurtboğanın Türkiye'deki A. orientale örneklerinde beyaz ve soluk mor çiçekli olduğu (SDÜ yayınları) nedeniyle 'mavi-mor' tek ipucu olmaktan çıkarıldı; acı çiğdem-çiğdem (Crocus) yumrusu karışması uyarısı ihtiyat olarak eklendi; görünüş ipuçlarının güvenlik kanıtı olmadığı ve 'emin değilsen yeme' ilkesi eklendi; çizim kimliği su baldıranı adımına taşındı. Yazarın teyidi: karışma çiftleri (ANSES), Veratrum belirti süresi ve Türkiye'de varlığı, BfR ilk yapılacaklar ve ağır risk listesi, Türkiye derlemesi. Kurtboğan ve yılan yastığının görünüş tanımları ve Türkçe adları genel botanik bilgi, bu oturumda ayrı kaynakla açılmadı. Baldıranın kötü kokusu genel bilgi. Ak çöpleme adının Veratrum için yaygın Türkçe adı olduğu doğrulanmadı." }
  },
  {
    "id": "sf-ybt-zehirli-agac",
    "category": "sf-ybt-guvenlik",
    "title": "Türkiye'nin en tehlikeli zehirli bitkileri 2: meyveli bitkiler, çalı ve ağaçlar",
    "tag": "ZEHİRLİ MEYVE",
    "summary": "Porsuk, zakkum, güzelavratotu tanesi, eşek hıyarı, hintyağı bitkisi, orman gülü, altın yağmuru, mor salkım ve at kestanesi meyvesi, tohumu ya da dalıyla zehirler; tanıyın, çocukları uzak tutun.",
    "note": "Bu rehber yalnız tanıma ve uzak durma içindir; bu bitkilerden hiçbirini ilaç, burun damlası, çay ya da bal için kullanmayın. Zehirlenme belirtisinde 114'ü ya da 112'yi arayın.",
    "steps": [
      "Porsuk: koyu yeşil, yassı iğneleri dala iki sıra dizilen, kozalaksız ağaç ya da çalı; kırmızı kadeh biçimli meyvesinin içinde koyu bir tohum vardır. İğnesi ve tohumu kalbi durdurur. Parklarda süs çiti olarak da dikilir.",
      "Zakkum: dere yatağı, kıyı ve yol kenarında, uzun, kalın, deri gibi yapraklı, pembe-beyaz-kırmızı çiçekli çalı. Her yeri, kurusu ve dumanı da zehirlidir. Dalını şiş, kaşık, çubuk ya da ateş odunu yapmayın.",
      "Güzelavratotu tanesi: tek tek duran, küçük kiraz büyüklüğünde parlak siyah, tatlı tane; yaban mersini ve üzümle karışır. Çocuklar tatlı olduğu için yer.",
      "Eşek hıyarı: tarla ve çöplükte yerde sürünen, kıllı, küçük hıyar biçimli meyvesi dokununca suyunu fışkırtan bitki. Halk arasında suyu burna damlatılıyor; bu, boğazda ve küçük dilde şişme, nefes darlığıyla ağır zehirlenme yapar. Meyvesini, suyunu hiçbir amaçla kullanmayın.",
      "Hintyağı bitkisi: el gibi parçalı, çok iri, kızıl-yeşil yapraklı, dikenli kozalı süs bitkisi; benekli, fasulyeye benzeyen tohumları çok zehirlidir. Tohumu çiğnemeyin, çocukların oynamasına izin vermeyin.",
      "Orman gülü (komar): Karadeniz ormanlarında mor ya da sarı çiçekli, deri yapraklı çalı. Yaprağı, çiçeği ve bu çiçeklerden yapılan deli bal zehirlidir; nabzı düşürür, bayıltır.",
      "Altın yağmuru ve mor salkım: sarı ya da mor sarkık salkımlı süs bitkileri; baklası ve tohumu zehirlidir. Akasya çiçeğiyle karıştırmayın.",
      "At kestanesi: parklarda yaygın, el gibi 5–7 parçalı yapraklı ağaç; tek, parlak, yuvarlak tohumu yenmez. Kestaneyle ayrımı için 'Yabani meyve ve yemişler' rehberine bakın.",
      "Kural: tanımadığınız taneli meyveyi kuşlar yiyor diye yemeyin; kuşlar insanı öldüren meyveleri yiyebilir. Park ve bahçe çiti olarak dikilen kurtbağrının (Ligustrum) salkım halindeki küçük siyah taneleri de zehirlidir. Kırmızı, siyah ya da beyaz tanelerin hiçbirini çocuklara yedirmeyin.",
      "Belirti olursa: ağızdakini çıkarın, kusturmayın, 114'ü ya da 112'yi arayın; meyveden ya da daldan bir parça götürün."
    ],
    "art": [
      "sf-ybt-porsuk-ayrinti",
      "sf-ybt-zakkum",
      null,
      "sf-ybt-esek-hiyari",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Zakkum dalını ateşte yakmayın, şiş yapmayın.",
      "Eşek hıyarı suyunu buruna, göze, cilde sürmeyin.",
      "Deli bal ve orman gülü çiçeğini 'şifa' diye yemeyin.",
      "Parklardaki süs bitkilerinin tohum ve meyvelerini toplamayın."
    ],
    "keywords": [
      "zehirli meyveler",
      "zehirli ağaçlar türkiye",
      "zakkum zehirli mi",
      "porsuk ağacı zehirli",
      "eşek hıyarı zehirlenmesi",
      "eşek hıyarı burun damlası",
      "hint yağı bitkisi tohumu",
      "orman gülü deli bal",
      "zehirli çalı meyvesi",
      "çocuk zehirli meyve yedi"
    ],
    "sources": [
      "Atatürk Üniv. — Herbal poisoning cases in Turkey: Rhododendron ponticum ve luteum, Atropa belladonna, Ecballium elaterium, Conium (https://avesis.atauni.edu.tr/yayin/f8e350d0-def9-416a-a3e9-39240211b43f/herbal-poisoning-cases-in-turkey-a-narrative-review)",
      "BfR — Poisonous plants SSS: porsuk, zakkum, altın yağmuru orta risk; hintyağı bitkisi, güzelavratotu ağır risk; 1–4 yaş meyve yeme (https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/poisonous-plants-how-to-protect-yourself-and-what-to-do-in-case-of-poisoning/)",
      "CHOP Zehir Merkezi — Poisonous berries: porsuk (https://www.chop.edu/centers-programs/poison-control-center/poisonous-berries)",
      "Wikipedia — Atropa belladonna, tane ve karışma (https://en.wikipedia.org/wiki/Atropa_belladonna)",
      "Wikipedia — Wisteria; Laburnum, tohum ve bakla zehri (https://en.wikipedia.org/wiki/Laburnum)",
      "ABD Ordusu FM 21-76 Bölüm 10 — zakkum, hintyağı bitkisi; hayvanların yediği güvenli değildir (https://www.wilderness-survival.net/chp10.php)",
      "Am J Case Rep — Ecballium elaterium burun damlası sonrası küçük dil ödemi ve nefes darlığı (https://amjcaserep.com/abstract/full/idArt/882292)",
      "YÖK Açık Bilim — İstanbul park ve bahçelerinde rastlanan zehirli süs bitkileri: zakkum, kurtbağrı (Ligustrum), porsuk (https://acikbilim.yok.gov.tr/handle/20.500.12812/160549)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): eşek hıyarı için doğrulanamayan 'acı kavun' adı kaldırıldı; burun damlası olgusu (küçük dil şişmesi, nefes darlığı) olgu sunumuyla doğrulandı; park çiti kurtbağrı (Ligustrum) siyah taneleri eklendi (İstanbul park zehirli süs bitkileri tezi); güzelavratotu tane boyu düzeltildi. Yazarın teyidi: Türkiye'de zehirlenme yapan bitkiler listesi (Atatürk Üniv. derlemesi özeti), BfR risk sınıfları, porsuk (CHOP), güzelavratotu, mor salkım ve altın yağmuru. Eşek hıyarının burna damlatılması ve orman gülünün nabız düşürmesi Türkiye literatüründe bilinen bilgi; bu oturumda yalnız derleme özeti açıldı. Hintyağı bitkisinin görünüşü genel botanik bilgi." }
  },
  {
    "id": "sf-ybt-cocuk",
    "category": "sf-ybt-guvenlik",
    "title": "Çocuklarla toplama güvenliği",
    "tag": "ÇOCUK",
    "summary": "Çocuklara toplamayı öğretin ama ağza götürme kararını hep yetişkin versin: taneli meyveyi ayrı denetleyin, her türü ayrı kaba koyun, yeni yiyeceği az verin; bir şey yerse ağzındakini çıkarıp 114'ü arayın.",
    "steps": [
      "Tek kural koyun ve sık tekrarlayın: 'Hiçbir şeyi büyüğe göstermeden ağzına koyma.' Küçük çocukları (özellikle 1–4 yaş) doğada ve bahçede göz önünde tutun; zehirlenmelerin çoğu bu yaşta, meyve ve yaprak ağza alınarak olur.",
      "Çocuklara iş verin: sepet taşıma, yıkama, ayıklanmış otu doğrama, ceviz kırma. Toplama işini yalnız sizin gösterdiğiniz, kolay tanınan tek türle sınırlayın (ör. böğürtlen, ısırgan değil).",
      "Taneli meyveler en büyük tehlikedir: parlak siyah, kırmızı ve beyaz taneleri çocuklar tatlı diye yer. Böğürtlen ve dut dışında hiçbir taneli meyveyi çocuğun kendisi toplamasın.",
      "Her türü ayrı kaba koyun. Eve gelince yetişkin her parçayı tek tek kontrol etsin; tanımadığı bir parça varsa o kabın tamamını atsın.",
      "Oyun ve uyku alanının çevresindeki zehirli bitkileri (zakkum, porsuk, hintyağı bitkisi, mor salkım, tatula) söküp çıkarın; yere düşen bakla ve tohumları toplayın.",
      "Çocuğa yeni yiyeceği az miktarda, tek tek ve gündüz verin; bir gün bekleyin. Çocuğun vücudu küçüktür; yetişkini rahatsız etmeyen miktar onu zehirleyebilir.",
      "Çocuklara deneme amaçlı yenebilirlik testi yaptırmayın; mantar, acı bakla, mürdümük, yosun ve liken vermeyin.",
      "Çocuk bilinmeyen bir şey yediyse: ağzındakini parmakla çıkarın, kusturmayın, süt ya da tuzlu su vermeyin. 114'ü ya da 112'yi arayın; çocuğun yaşını, kilosunu, neyi ne zaman ne kadar yediğini söyleyin, bitki parçasını yanınıza alın."
    ],
    "art": [
      "sf-ybt-cocuk-goster",
      null,
      "sf-ybt-cocuk-tane",
      null,
      null,
      null,
      null,
      "sf-ybt-cocuk-agiz"
    ],
    "dont": [
      "Çocuğu bitki toplarken gözden uzak bırakmayın.",
      "Çocuğa 'kuşlar yiyor, sen de ye' demeyin.",
      "Zehirlenmede çocuğu kusturmaya, süt içirmeye çalışmayın.",
      "Yetişkinin denemediği yeni yiyeceği önce çocuğa vermeyin."
    ],
    "keywords": [
      "çocukla ot toplama",
      "çocuk doğada meyve yedi",
      "çocuk zehirli bitki yedi",
      "cocuk bilinmeyen meyve yedi",
      "çocuklara toplamayı öğretme",
      "çocuk böğürtlen toplama",
      "çocuk güvenliği yabani bitki",
      "çocuk zehirlenme 114"
    ],
    "sources": [
      "BfR — Poisonous plants SSS: 1–4 yaş, küçük çocukları gözetme, oyun alanında zehirli bitki olmaması; ağızdakini çıkarma, kusturmama, süt ve tuzlu su vermeme; yaş-kilo-miktar bilgisi (https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/poisonous-plants-how-to-protect-yourself-and-what-to-do-in-case-of-poisoning/)",
      "CHOP Zehir Merkezi — Poisonous berries: oyun alanlarını denetleme, düşen tohum ve baklaları toplama, bitki tanıma (https://www.chop.edu/centers-programs/poison-control-center/poisonous-berries)",
      "ANSES — Toxic plants: altı yaş altı çocuklar da etkileniyor; türleri karıştırmadan toplama (https://www.anses.fr/en/content/toxic-plants)",
      "BfR — Lupin seeds risk assessment: acı bakla yiyen 10 yaşında çocuğun ölümü (https://www.bfr.bund.de/cm/349/risk-assessment-of-the-occurrence-of-alkaloids-in-lupin-seeds.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): içerik tutucu; değişiklik gerekmedi. Yazarın teyidi: yaş grubu, gözetim, oyun alanı, ilk yapılacaklar (BfR), tohum-bakla temizleme (CHOP), tür ayırma (ANSES). BfR ilk adım olarak 1–2 bardak su ya da çay önerir; Türkiye'de 114'e danışmak öne alındığı için bu adım yazılmadı. Tek tür ve görev verme önerileri pedagojik öneridir, kaynak yok." }
  },
  {
    "id": "sf-ybt-aci-giderme",
    "category": "sf-ybt-guvenlik",
    "title": "Acı yiyecekleri yenir hale getirme: bekletme, kaynatma, kül suyu",
    "tag": "ACILIK GİDERME",
    "summary": "Acı otları suyunu değiştirerek kaynatın, palamudu suda bekletin, mısırı kireç ya da kül suyunda pişirin; acı baklayı (termiye) evde işlemeyin. Hiçbir yöntem baldıranı, acı çiğdemi, zakkumu, porsuğu, acı kabağı ya da yeşil patatesi güvenli yapmaz.",
    "note": "Uzman gözetimi olmadan bu yöntemleri zehirli olduğu bilinen bitkilerde denemeyin. Acı bakla (termiye) için evde acılık giderme güvenilir değildir ve önerilmez; yetersiz işlenmiş acı bakla ve bekletme suyu ölümcül zehirlenme yapmıştır.",
    "steps": [
      "Önce ayırın: acılık her zaman zehir değildir (hindiba, palamut, zeytin), ama bazı zehirler hiç acı değildir. Bu yöntemler yalnız yenen ama acı olan yiyecekler içindir.",
      "Kaynatıp suyunu dökme (acı otlar, yapraklar, filizler): otu kaynar suya atın, 5–10 dakika kaynatın, suyunu dökün; hâlâ acıysa taze kaynar suyla tekrarlayın. Bu yöntem okzalatı da azaltır.",
      "Soğuk suda bekletme (palamut, bazı kökler): ezilmiş parçaları bol soğuk suya koyun, suyu günde en az bir kez değiştirin. Palamut için ayrıntı: 'Meşe palamudunu yenir hale getirme' rehberi. Zeytin için 'Zeytin işleme' rehberine bakın.",
      "Kireç suyunda mısır: kuru mısır tanesinin ağırlığının yaklaşık yüzde 1'i kadar sönmüş kireç (kalsiyum hidroksit, toz) ve 3 katı su koyun (1 kg mısıra 10 g kireç, 3 litre su). Sönmemiş kireç (taş kireç) kullanmayın; suyla kaynayıp sıçrar ve yakar. Kaynatmadan, hafif fokurdayan ateşte 20–30 dakika pişirin, gece boyu bekletin.",
      "Ertesi gün taneleri bol suda ovarak birkaç kez yıkayın; kabukları soyulup gidince ve tane hafif diri kalınca olmuştur. Kireç suyunu dökün. Kireci eldivenle tutun; göze kaçarsa en az 15 dakika bol suyla yıkayın ve yardım arayın.",
      "Kireç yoksa sert ağaç külüyle kaynatılmış süzülmüş kül suyu kullanılır; oranı kesin değildir, sonuçtan anlarsınız: kabuk ovunca kopmalı. Kül suyu da yakıcıdır: eldivenle çalışın, gözü koruyun, taneleri bol suyla iyice yıkayın.",
      "Mısır ana yiyecekse bu işlemi yapın: işlenmeden yenen mısırla beslenen topluluklarda pellagra (deride kızarıp kabuklanma, ishal, unutkanlık) görülmüştür.",
      "Acı bakla (termiye, acı lüpen) için evde acılık giderme önerilmez: yetersiz bekletilmiş taneler ve bekletme suyu çocuk ölümleri dahil ağır zehirlenmeler yapmıştır; tadına bakarak güvenli olduğunu anlayamazsınız. Acı tadan lüpen tanesini yemeyin, bekletme suyunu içmeyin ve yemekte kullanmayın, çocuklara hiç vermeyin. Baş dönmesi, ağız kuruluğu, çarpıntı, bulantı, bilinç bulanıklığı olursa 114'ü ya da 112'yi arayın.",
      "Hiçbir bekletme, kaynatma ya da kül suyu şunları yenir yapmaz: baldıran, su baldıranı, acı çiğdem, zakkum, porsuk, at kestanesi, eşek hıyarı, acı kabak, yeşillenmiş patates, yabani mantar."
    ],
    "art": [
      null,
      "sf-ybt-ot-kaynatma",
      null,
      "sf-ybt-misir-kirec",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Zehirli bitkiyi 'kaynatınca geçer' diye pişirmeyin.",
      "Acı baklayı (termiye) evde bekleterek yenir yapmaya çalışmayın; bekletme suyunu içmeyin, hamura katmayın.",
      "Kireci çıplak elle karıştırmayın, gözünüze kaçırmayın.",
      "Acı tadan kabak ve salatalığı kaynatarak kurtarmaya çalışmayın."
    ],
    "keywords": [
      "acılık nasıl giderilir",
      "acı ot kaynatma",
      "kül suyu mısır",
      "kireçle mısır pişirme",
      "nikstamalizasyon",
      "termiye acısı nasıl çıkar",
      "acı bakla zehirlenmesi",
      "pellagra mısır",
      "acı yiyeceği yenir yapma"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 Bölüm 9 — tadı iyileştirme: bekletme, kaynatma, suyu değiştirme, ezip süzme (https://www.wilderness-survival.net/plants-1.php)",
      "ABD Ordusu FM 21-76 Bölüm 10 — kaynatma birçok zehri giderir ama hepsini değil (https://www.wilderness-survival.net/chp10.php)",
      "Wikipedia — Nixtamalization: kireç ya da kül suyunda pişirme, bekletme, yıkama, pellagra tarihi (https://en.wikipedia.org/wiki/Nixtamalization)",
      "Mother Earth News — How to nixtamalize corn: beyaz mısırda %1 kireç, 3 kat su, 20–30 dk hafif kaynama, gece bekletme, kabuk kayması (https://www.motherearthnews.com/real-food/how-to-nixtamalize-corn-zw0z2408zols/)",
      "BfR — Lupin alkaloids risk assessment: 24 sa bekletme ve 5–7 gün su değiştirme yöntemi, ev yöntemleri güvenilir değil, bekletme suyu zehirlenmesi, ölüm olgusu (https://www.bfr.bund.de/cm/349/risk-assessment-of-the-occurrence-of-alkaloids-in-lupin-seeds.pdf)",
      "Poison Control (ABD) — kukurbitasin pişirmekle gitmez (https://www.poison.org/articles/toxic-squash-syndrome-if-it-s-bitter-it-s-not-dinner)",
      "Wikipedia — Solanine: pişirme etkisi az (https://en.wikipedia.org/wiki/Solanine)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): BfR 003/2017 açıldı: ev yöntemi için genel öneri verilemez, tüketiciler acı lüpenden kaçınmalı, bekletme suyu hiçbir koşulda kullanılmamalı, üç çocuk ölümü. Termiye yöntemi adımı kaldırılıp yalnız uyarı bırakıldı; sönmemiş kireç ve kül suyu yakıcılık uyarıları eklendi. Yazarın teyidi: kaynatıp su değiştirme (FM 21-76), kireç oranı %1 ve 3 kat su, 20–30 dk, gece bekletme (Mother Earth News, tek kaynak), pellagra ve kül suyu (Wikipedia), acı bakla yöntemi ve uyarıları (BfR). Kül suyu oranı bulunamadı; sayı verilmedi. Otlar için 5–10 dk kaynatma süresi genel uygulama; okzalat azalması 01 paketindeki Chai & Liebman kaynağına dayanır." }
  },
  {
    "id": "sf-ybt-tahil",
    "category": "sf-ybt-guvenlik",
    "title": "Yabani tahıl ve ot tohumu; çavdar mahmuzu (ergot) ve delice",
    "tag": "YABANİ TAHIL",
    "summary": "Yabani buğday, arpa, yulaf ve sirken tohumu toplanabilir; ama her başağı mor-siyah mahmuza (ergot) karşı inceleyin, mahmuzları elle ve tuzlu suda yüzdürerek ayıklayın, siyah taneli deliceyi atın.",
    "note": "Uzman gözetimi olmadan çavdar ve yabani ot tohumunu ana yiyecek yapmayın: ergot (çavdar mahmuzu) zehirlenmesi el ve ayaklarda kangren, kasılma ve sanrıyla öldürebilir, gebelerde düşüğe yol açabilir; geçmişte binlerce kişiyi öldürmüştür. Ekmek yapmak zehri yok etmez.",
    "steps": [
      "Toplama: haziran–temmuzda tarla kenarı, terk edilmiş tarla ve yamaçlardaki yabani ve kendiliğinden çıkmış buğday, arpa, yulaf ve çavdar başaklarını, taneler sertleşip sararınca kesin.",
      "Her başağa bakın: tanelerin arasında taneden 1–5 kat uzun, mor-siyah, sert, boynuz ya da mahmuz gibi çıkıntı varsa bu ergottur. Çavdarda en sık ve en iridir (1–5 cm); buğday, arpa, yulaf ve yabani otlarda da görülür. Buğday ve arpada mahmuz küçük olabilir ve koyu renkli bir taneye benzer: her mor-siyah, eğri ya da normalden iri taneyi mahmuz sayıp atın.",
      "Mahmuzlu başakları ayrı toplayıp yakın; harmana karıştırmayın. Serin ve nemli geçen yıllarda mahmuz çok olur; tarlanın çoğunda varsa o tarlanın tanesini yemeyin.",
      "Mahmuzları mümkünse başaktayken, dövmeden önce ayıklayın; dövülürken kırılan mahmuz parçaları tane büyüklüğüne iner ve ayıklanması zorlaşır. Harmandan sonra taneleri düz bir yüzeye serip kalan mahmuz ve parçalarını elle ayıklayın.",
      "Tuzlu suda yüzdürme: 1 litre suya yaklaşık 250 g tuz eritin (yüzde 20). Taneleri dökün, karıştırın; yüzen mahmuzları ve boş taneleri kepçeyle alıp atın. Batan sağlam taneleri hemen bol temiz suyla birkaç kez yıkayın ve güneşte iyice kurutun. Yüzdürme mahmuzların çoğunu ayırır ama hepsini değil; bu yüzden elle ayıklamayı atlamayın. Pişirmek, kavurmak ve ekmek yapmak ergot zehrini yok etmez.",
      "Deliceyi ayırın: buğday tarlasında buğdaya çok benzeyen, başakçıkları sapa yan duran, olgunlaşınca siyah tane veren ottur. Tanesi sarhoşluk, bulantı yapar, öldürebilir; siyah, ince taneleri ayıklayın.",
      "Ot tohumları: sirken (kazayağı) ve horozibiği tohumlarını olgunlaşınca başlarından silkeleyip toplayın. Acımsı tadı gidene kadar suda ovarak birkaç kez yıkayın, sonra kavurup lapa ya da una katın.",
      "Firik: buğday başaklarını süt olumundan hemen sonra, tane yeşil ama dolgunken kesip közde kavurun, ovup samanından ayırın. Hasadı beklemeden erken yiyecek sağlar.",
      "Tahılı yedikten sonra el ve ayaklarda karıncalanma, uyuşma, soğuma, morarma, kas krampı, kasılma ya da sanrı olursa o tahılı yemeyi hemen bırakın ve 112'yi arayın."
    ],
    "art": [
      null,
      "sf-ybt-ergot-basak",
      null,
      null,
      "sf-ybt-tuzlu-su-yuzdurme",
      "sf-ybt-delice",
      null,
      null,
      null
    ],
    "dont": [
      "Mor-siyah mahmuzlu başakları ayıklamadan öğütmeyin.",
      "Pişirmenin ya da ekmek yapmanın ergotu zararsız yaptığına güvenmeyin.",
      "Tuzlu suda bekletilen taneleri yıkamadan kurutmayın; çok tuzlu kalır.",
      "Siyah, ince delice tanesini una karıştırmayın."
    ],
    "keywords": [
      "yabani buğday toplama",
      "yabani tahıl",
      "çavdar mahmuzu",
      "ergot nedir",
      "ergot zehirlenmesi",
      "başakta siyah boynuz",
      "delice otu tanesi",
      "sirken tohumu",
      "firik yapımı",
      "tuzlu suda tahıl ayıklama"
    ],
    "sources": [
      "APS — Ergot dersi: mor-siyah sklerot, tanenin 1–5 katı, çavdarda 1–5 cm; çavdar, arpa, yulaf, buğday ve yabani otlar; %20 tuzlu suda yüzdürme; kangren ve kasılma (https://www.apsnet.org/edcenter/pdlessons/Pages/Ergot.aspx)",
      "Wikipedia — Ergotism: kasılmalı ve kangrenli belirtiler, 1778 Sologne'da 8.000'den fazla ölüm, tuzlu suda mahmuzun yüzmesi (https://en.wikipedia.org/wiki/Ergotism)",
      "ABD Ordusu FM 21-76 Bölüm 9 — pembe, mor ya da siyah mahmuzlu başaklar kaçınılacak işaret (https://www.wilderness-survival.net/plants-1.php)",
      "Wikipedia — Lolium temulentum (delice): buğdaya benzer, başakçık sapa yan, olgun tane siyah, sarhoşluk ve ölüm (https://en.wikipedia.org/wiki/Lolium_temulentum)",
      "Wikipedia — Chenopodium album: tohum tahıl olarak yetiştirilir, eski tahıl buluntularında (https://en.wikipedia.org/wiki/Chenopodium_album)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): APS ergot dersi açıldı: sklerot tanenin 1–5 katı, çavdarda 1–5 cm, buğday-arpa-yulaf konak, %20 tuzlu su, 'ergot toksinleri pişirmekle yok olmaz'. Pişirmenin zehri yok etmediği adıma ve nota eklendi; buğday/arpada küçük mahmuz, başakta ayıklama ve yüzdürmenin yetmemesi eklendi; gebelikte düşük riski (Wikipedia Ergotism) nota eklendi. Yazarın teyidi: ergot görünüşü ve boyutu, konak bitkiler, %20 tuzlu su (APS), belirtiler ve salgınlar (Wikipedia), delice ayrımı. Ergot alkaloidlerinin pişirmeyle ne kadar bozulduğu kaynakta yoktu; ihtiyatla 'güvenmeyin' yazıldı. Serin-nemli yıl bilgisi, sirken tohumunun acılığının yıkanması ve firik yöntemi kaynakla doğrulanmadı (genel ve geleneksel bilgi). EFSA ya da WHO ergot sayfası açılmadı." }
  },
  {
    "id": "sf-ybt-baklagil",
    "category": "sf-ybt-guvenlik",
    "title": "Mürdümük ve yabani baklagiller: latirizm",
    "tag": "MÜRDÜMÜK",
    "summary": "Mürdümük (Lathyrus sativus) bir süre ana yiyecek olursa bacaklarda kalıcı felç (latirizm) yapar. Bu rehber mürdümüğü önermez: başka yiyecek varsa yemeyin; yalnız son çare olarak, bekletip kaynatarak, suyunu dökerek, az ve tahılla karışık yiyin.",
    "note": "Uzman gözetimi olmadan mürdümüğü düzenli ya da ana yiyecek yapmayın: öğünlerin yaklaşık dörtte biri ya da fazlası 1,5–6 ay boyunca mürdümük olunca bacaklarda geri dönmeyen felç görülmüştür. Güvenli miktar bilinmez; kuraklık yıllarında tanedeki zehir artar.",
    "steps": [
      "Mürdümük kuraklığa çok dayanıklı bir baklagildir; kıtlıkta çoğu kez tek kalan yiyecek olur ve tehlike buradan doğar. Başka yiyecek varsa mürdümüğü yemeyin; onu yalnız son çare olarak düşünün.",
      "Zararı birikir ve geri dönmez: öğünlerin yaklaşık dörtte biri ya da fazlası mürdümük olunca 1,5–6 ay içinde, özellikle genç erkeklerde, dizden aşağı kalıcı felç başlayabilir. Çocuklarda beyin hasarı yapabilir. Güvenli bir miktar söylenemez; ne kadar az ve ne kadar kısa süre yenirse o kadar iyidir.",
      "Zehir bitkinin her yerinde vardır: yeşil tane, körpe bakla ve yaprak da içerir. Yeşil haliyle yemek riski kaldırmaz; aynı sınırlar geçerlidir.",
      "Yemek zorundaysanız kuru taneyi bir gece bol suda bekletin, suyunu dökün. Bekletip kaynatmadan una çekmeyin; un halinde zehir giderilemeyebilir.",
      "Taze suda iyice kaynatın, kaynarken suyu bir kez değiştirin, sonunda suyunu dökün. Bekletme ve kaynatma zehri azaltır ama tamamen gidermez. Kaynatma suyunu çorba ya da hamur için kullanmayın.",
      "Mürdümüğü asla tek başına yemeyin: öğünün çoğu buğday, arpa ya da mısır olsun, mürdümük tabağın küçük bir parçasını geçmesin. Kavrulmuş ya da çiğ mürdümüğü hiç yemeyin.",
      "Kuraklık yılında yetişen mürdümükte zehir daha fazladır. Mürdümüğü her gün yemeyin; yemiş, başka baklagil ve sebzeyle çeşitlendirin ve başka yiyecek bulunca hemen bırakın.",
      "Fiğ, burçak ve tanımadığınız yabani bezelye ve bakla tanelerini insan yiyeceği yapmayın; bunlar hayvan yemidir ve bazıları zehirlidir.",
      "Bacaklarda kasılma, sertlik, ağırlık, sık sık takılma, yürüyüşte parmak ucuna basma başlarsa mürdümüğü hemen tamamen bırakın; hasar ilerlemesin. Sağlık yardımı arayın."
    ],
    "art": [
      "sf-ybt-murdumuk",
      null,
      null,
      null,
      null,
      "sf-ybt-murdumuk-oran",
      null,
      null,
      null
    ],
    "dont": [
      "Mürdümüğü düzenli ya da ana yiyecek yapmayın; başka yiyecek varken hiç yemeyin.",
      "Kaynatma suyunu yemeğe katmayın; yeşil taneyi güvenli sanmayın.",
      "Bacak sertliği başlamışken mürdümük yemeye devam etmeyin.",
      "Yabani bakla ve bezelye tanesini tanımadan yemeyin."
    ],
    "keywords": [
      "mürdümük nedir",
      "murdumuk",
      "latirizm",
      "mürdümük felç",
      "çiğit nohudu",
      "lathyrus sativus",
      "yabani bezelye yenir mi",
      "yabani baklagil zehirli",
      "fiğ insan yer mi"
    ],
    "sources": [
      "Crop Trust — Grasspea: üç ay boyunca sürekli tüketim nörolojik hastalık yapar, kuraklıkta zehir artar, dizden aşağı kalıcı felç, çocuklarda beyin hasarı (https://www.croptrust.org/knowledge-hub/crops/grasspea/)",
      "ENN Field Exchange — Grass pea consumption and neurolathyrism (Etiyopya): genç erkek, kavrulmuş-haşlanmış-ham tüketim riski, üçte birden fazla tahıl karışımı riski azaltır (https://ennonline.net/fex/22/grass)",
      "Barpete ve ark. 2021, CyTA (ICARDA özeti): kaynatma ODAP'ı %70 azaltır (https://icarda.org/node/19777)",
      "Wikipedia — Lathyrus sativus: olgun tane bekletilip iyice pişirilmeli, ham taze tane bezelye gibi yenir, üç ay ana yiyecek felç yapar (https://en.wikipedia.org/wiki/Lathyrus_sativus)",
      "Wikipedia — Lathyrism: belirtiler, kalıcı alt bacak felci (https://en.wikipedia.org/wiki/Lathyrism)",
      "PROTA (Pl@ntUse) — Lathyrus sativus: ODAP her yerde, %25 ve 1,5–6 ay eşiği, bekletme-kaynatma-su değiştirme (https://plantuse.plantnet.org/en/Lathyrus_sativus_(PROTA))"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): PROTA açıldı: ODAP bitkinin her yerinde, latirizm en az %25 mürdümüklü beslenmenin 1,5–6 ay sürmesiyle, bekletme-kaynatma ve su değiştirme azaltır, un halinde giderilemeyebilir. Rehber 'önermez, yalnız son çare' çizgisine çekildi; yeşil tanenin güvenli olduğu iddiası ve 'az miktar zararsızdır' ifadesi kaldırıldı; 3 ay eşiği 1,5–6 ay olarak düzeltildi. Yazarın teyidi: üç ay ana yiyecek eşiği (Crop Trust, Wikipedia), genç erkek riski ve üçte bir tahıl karışımı (ENN, Etiyopya çalışması), kaynatmada %70 ODAP azalması (CyTA özeti), bekletme ve pişirme (Wikipedia). Kaynatma suyunun dökülmesi ihtiyat önerisidir. Fiğ ve burçak için doğrudan kaynak açılmadı; 'hayvan yemi, bazıları zehirli' genel ifadesi uzmana sorulmalı. WHO kaynağı bulunamadı. Mürdümüğün Türkiye'deki yöresel adları (çiğit) doğrulanmadı." }
  },
  {
    "id": "sf-ybt-kar",
    "category": "sf-ybt-guvenlik",
    "title": "Kar ve buz: neden doğrudan yenmez, nasıl suya çevrilir",
    "tag": "KAR SUYU",
    "summary": "Kar ve buzu ağzınızda eritmeyin; vücut ısınızı çalar. Kabın dibine biraz su koyup karı azar azar ekleyerek eritin, buz varsa buzu tercih edin ve eriyen suyu kaynatıp için.",
    "steps": [
      "Kar ve buz yemeyin. Ağızda eritmek vücut ısısını çalar, üşümeyi hızlandırır ve ağızda soğuk yaralanması yapabilir; susuzluğu da gidermez.",
      "Temiz kar seçin: yol, çatı akıntısı, hayvan yolu, sarı, gri ya da kirli kar almayın. Üst kirli tabakayı kazıyıp altındaki temiz karı alın.",
      "Buz bulursanız buzu eritin: aynı hacimde buz kardan çok daha fazla su verir ve daha çabuk erir. Ortalama taze kar, hacminin yaklaşık onda biri kadar su verir; kuru toz kar daha da azını.",
      "Ateşte eritirken kaba önce bir parmak su koyun ya da çok az karla başlayın; eridikçe azar azar kar ekleyin. Kuru kabı karla doldurup ateşe koymayın; kap yanar, su is kokar.",
      "Ateş yoksa bir su torbasını ya da şişeyi karla doldurup giysinizin içinde, gövdenize yakın taşıyın; yavaş ama yakıtsız erir. Ya da gözenekli bir bezi karla doldurup ateşin yanına asın, altına kap koyun.",
      "Eriyen kar ve buz suyu da mikrop taşıyabilir: içmeden önce en az 1 dakika (2000 metrenin üstünde 3 dakika) fokur fokur kaynatın ya da elinizdeki yöntemle arıtın.",
      "Başka içilebilir su varsa yakıtı kar eritmeye harcamayın.",
      "Soğukta da günde en az 2 litre su için. Suyu donmasın diye gövdenize yakın tutun, şişeyi ağzına kadar doldurmayın; çalkalanan su geç donar."
    ],
    "art": [
      "sf-ybt-kar-yasak",
      null,
      null,
      "sf-ybt-kar-eritme",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kar ve buz yemeyin, çiğnemeyin.",
      "Kuru tencereyi karla doldurup ateşe koymayın.",
      "Yol kenarı ve kirli karı eritip içmeyin.",
      "Eriyen kar suyunu kaynatmadan çocuklara vermeyin."
    ],
    "keywords": [
      "kar yemek zararlı mı",
      "kar yenir mi",
      "kar suyu içilir mi",
      "kar nasıl eritilir",
      "buzdan su elde etme",
      "kar eritip su yapmak",
      "kar yemek susuzluk",
      "kardan icme suyu"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Cold weather, Water: ağızda eritme ısı çalar ve iç soğuk yaralanması; azar azar ekleme; giysi içinde su torbası; asılı gözenekli torba; buz kardan çok su verir; her zaman arıtın; yakıtı boşa harcamayın; matarayı tam doldurmayın (https://www.wilderness-survival.net/cold-9.php)",
      "ABD Ordusu FM 21-76 Bölüm 6 — soğukta da günde en az 2 litre su (https://www.wilderness-survival.net/chp6.php)",
      "iWeatherNet — Snow to liquid equivalent: ortalama 10:1, ıslak kar daha az, kuru kar 30:1'e kadar (https://www.iweathernet.com/educational/winter-precipitation/snow-to-liquid-equivalent-and-associated-forecasting-pitfalls)",
      "CDC — Making water safe in an emergency: 1 dk kaynatma, 2000 m üstünde 3 dk (https://www.cdc.gov/healthywater/emergency/making-water-safe.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama (2026-11-02): CDC su güvenliği sayfası açıldı: 1 dakika fokur fokur kaynatma, 6500 ft (yaklaşık 2000 m) üstünde 3 dakika; adıma eklendi. Yazarın teyidi: FM 21-76 soğuk iklim su bölümü (ağızda eritmeme, azar azar ekleme, beden ısısıyla eritme, buz tercih, arıtma, yakıt, 2 L/gün); kar-su oranı 10:1 (iWeatherNet). 'Kuru kapta yanık tadı' FM metninde açıkça yok; azar azar ekleme önerisine dayanarak yazıldı. Kaynatma süresi (1 dk) ana uygulamadaki su rehberleriyle aynıdır." }
  }
];
