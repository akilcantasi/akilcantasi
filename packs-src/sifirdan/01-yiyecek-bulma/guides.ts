// Sıfırdan paketi: Yiyecek bulma (yabani yiyecek, balık, iz sürme ve tuzak, avı işleme)
// Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  "id": "sifirdan-yiyecek-bulma",
  "name": "Sıfırdan: Yiyecek bulma",
  "desc": "Yabani ot, yemiş ve kök toplama; balık tutma; iz sürme ve tuzak; avı güvenle temizleme. Zehirli benzerler, mantar ve et hastalıkları için uyarılarla.",
  "version": 1
};

export const CATEGORIES: CategoryMeta[] = [
  {
    "id": "sf-yb-yabani",
    "title": "Yabani yiyecek",
    "hint": "Ot, yemiş, palamut, kök, kıyı, böcek, yumurta, bal",
    "art": "sf-yb-kapak-yabani",
    "color": "#a3e635",
    "order": 100
  },
  {
    "id": "sf-yb-balik",
    "title": "Balık ve su ürünleri",
    "hint": "Olta, kanca, yem, sepet, ağ, kerevit",
    "art": "sf-yb-kapak-balik",
    "color": "#38bdf8",
    "order": 101
  },
  {
    "id": "sf-yb-iz",
    "title": "İz sürme ve tuzak",
    "hint": "Ayak izi, işaretler, hayvan saatleri, ilmek, güvenlik",
    "art": "sf-yb-kapak-iz",
    "color": "#d6a35c",
    "order": 102
  },
  {
    "id": "sf-yb-isleme",
    "title": "Avı işleme",
    "hint": "Tavşan, kuş, balık temizleme; iç organ; et hastalıkları",
    "art": "sf-yb-kapak-isleme",
    "color": "#f87171",
    "order": 103
  }
];

export const GUIDES: PackGuide[] = [
  // ───────────────────────── YABANİ YİYECEK ─────────────────────────
  {
    "id": "sf-yb-yabani-otlar",
    "category": "sf-yb-yabani",
    "title": "Yenebilir yabani otlar: ısırgan, ebegümeci, semizotu ve diğerleri",
    "tag": "YABANİ OT",
    "summary": "Yalnız kesin tanıdığınız, köylerde yıllardır yenen otları temiz yerlerden toplayın, iyice yıkayın ve çoğunu haşlayarak yiyin.",
    "note": "Uzman gözetimi olmadan yalnız yüzde yüz tanıdığınız otları yiyin; şemsiye çiçekli zehirli benzerler küçük miktarda öldürebilir.",
    "steps": [
      "Yalnız yüzde yüz tanıdığınız, çevrede yıllardır yenen otları toplayın. Bir an bile tereddüt ediyorsanız koparmayın.",
      "Isırgan: ilkbaharda, eldivenle yalnız en üstteki körpe yaprakları koparın. Kaynar suda 2 dakika haşlayınca yakıcılığı geçer.",
      "Ebegümeci: yuvarlak, kenarı dalgalı-dişli yaprakları ve pembe-mor çiçeğiyle tanıyın. Körpe yapraklarını haşlayın ya da kavurun.",
      "Semizotu: yere yayılan kırmızımsı, etli gövde ve küçük etli yapraklar. Koparınca süt çıkmaz. Yere yayılan ve koparınca beyaz süt veren benzeri sütleğendir; onu yemeyin.",
      "Kuzukulağı ve labada: ekşi tadı okzalik asitten gelir. Az yiyin; haşlayıp suyunu dökün. Haşlama okzalatın üçte biri ile yarısından fazlasını giderir.",
      "Hindiba (yabani radika): toprağa yayılan dişli yapraklar, mavi çiçek. Acıdır; haşlayıp suyunu dökün. Koparınca süt verir; bu yüzden yalnız iyi tanıyorsanız toplayın.",
      "Yabani pazı: deniz kıyısında, koyu yeşil, parlak ve etli yapraklarıyla bilinen pazı gibi pişirilir.",
      "Yol kenarından, ilaçlanmış tarladan, ağıl ve lağım yakınından, kirli su kenarından toplamayın. Bu bitkiler kurşun ve zirai ilaç biriktirebilir.",
      "Otları temiz suda iyice yıkayın; mümkünse pişirin.",
      "Yeni bir otu ilk kez yerken az yiyin ve bir öğünde tek yeni bitki deneyin."
    ],
    "art": [
      null,
      "sf-yb-isirgan-toplama",
      "sf-yb-ebegumeci",
      "sf-yb-semizotu-sutlegen",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Havuç, maydanoz ya da dereotu yapraklı, beyaz şemsiye çiçekli hiçbir yabani otu toplamayın; baldıran bu gruptadır ve öldürür.",
      "Koparınca beyaz süt veren ve semizotuna benzeyen sütleğeni yemeyin.",
      "Kuzukulağı ve labadayı her gün bol miktarda yemeyin; okzalat böbreği zorlar.",
      "Çiğ ısırganı elle tutmayın, çiğ yemeyin."
    ],
    "keywords": [
      "yenebilir yabani otlar",
      "yabani ot toplama",
      "ısırgan nasıl yenir",
      "isirgan otu yemek",
      "ebegümeci toplama",
      "semizotu yabani",
      "kuzukulağı labada",
      "hindiba radika toplama",
      "yabani pazı",
      "doğada yenen otlar",
      "dogada yenen otlar"
    ],
    "sources": [
      "Düzce Üniv. açık arşiv — Biga'da yenen yabani bitkiler (https://acikerisim.duzce.edu.tr/items/345aa3be-ed14-4bfa-9d64-69855c3c94b2/full)",
      "Bingöl'de sebze olarak yenen yabani bitkiler derlemesi (https://acikerisim.uludag.edu.tr/items/4fb455da-2fac-4df6-a0fc-a2ed36617540)",
      "Honest Food — Harvesting and cooking nettles (https://honest-food.net/grasping-the-nettle)",
      "Chai & Liebman 2005, pişirmenin okzalata etkisi (https://www.aprifel.com/fr/resume-scientifique/effect-of-different-cooking-methods-on-vegetable-oxalate-content/)",
      "Survival Manual — Edible plants, sütlü özsu uyarısı (https://survival.powweb.com/edible-plants.php)",
      "Wikipedia — Typha, kirli suda birikim (https://en.wikipedia.org/wiki/Typha)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: ANSES: şüphede yemeyin, kucak kucak toplamayın (karışma riski); diğer sayılar yeniden açılmadı. Yazar notu: ısırgan 2 dk haşlama; haşlamada okzalat kaybı %30–87; ısırgan, ebegümeci, Rumex Türkiye etnobotanik çalışmalarında sebze. Yabani pazı ve semizotu ayrımı için ayrı kaynak bulunamadı." }
  },
  {
    "id": "sf-yb-zehirli-benzerler",
    "category": "sf-yb-yabani",
    "title": "Zehirli benzerler: baldıran, yabani havuç ve öldüren otlar",
    "tag": "ZEHİRLİ BİTKİ",
    "summary": "Beyaz şemsiye çiçekli, havuç yapraklı hiçbir yabani bitkiyi yemeyin; baldıranı, acı çiğdemi ve porsuk ağacını tanıyıp uzak durun.",
    "note": "Uzman gözetimi olmadan şemsiye çiçekli (havuç ailesi) hiçbir yabani bitkiyi yemeyin; baldıranın küçük bir miktarı nefes durmasıyla öldürebilir.",
    "steps": [
      "Kural: beyaz şemsiye biçimli çiçeği ve havuç-maydanoz gibi ince parçalı yaprağı olan hiçbir yabani bitkiyi yemeyin. Yabani havuç, yabani maydanoz ve yabani dereotu da buna dahildir.",
      "Baldıranı tanıyın: gövdesi tüysüz ve pürüzsüzdür, üzerinde kırmızı-mor lekeler vardır. Çiçek açtığı yıl boyu 1–2 metreye ulaşır.",
      "Yabani havucun gövdesi sık tüylüdür ve boyu çoğunlukla 60 cm'yi geçmez. Ama ilk yıl baldıran yere yayılmış yaprak demeti halindedir ve ayırmak çok zordur. Bu ayrımı yemek için değil, uzak durmak için öğrenin.",
      "Baldırana çıplak elle dokunmayın; eldiven giyin, sonra ellerinizi yıkayın.",
      "Dere ve bataklık kenarında yetişen, kereviz ya da maydanoza benzeyen şemsiye çiçeklileri hiç yemeyin; su baldıranı da ölümcüldür.",
      "Soğan kokusu olmayan soğanlı bitkiyi yemeyin. Acı çiğdemin yaprakları yabani sarımsak ve soğana benzer, kokusu yoktur ve öldürür.",
      "Porsuk ağacının kırmızı meyvesindeki tohum ve iğne yaprakları ölümcül zehirlidir. Zakkumun (kıyılarda ve bahçelerde yaygın, pembe-beyaz çiçekli çalı) her yeri öldürür; dalını şiş ya da ateş odunu yapmayın. Yüksük otu yaprağı başka otlarla karışabilir ve kalbi durdurur. At kestanesi de yenmez.",
      "Belirtiler: bulantı, kusma, baş dönmesi, halsizlik, bilinç bulanması, nefes darlığı. Böyle bir bitki yediyseniz hemen bırakın; ulaşabiliyorsanız 114'ü ya da 112'yi arayın.",
      "Yediğiniz bitkiden bir parça saklayın ve sağlık ekibine gösterin."
    ],
    "art": [
      "sf-yb-semsiye-yasak",
      "sf-yb-baldiran-govde",
      null,
      null,
      null,
      "sf-yb-cigdem-sogan",
      null,
      null,
      null
    ],
    "dont": [
      "Tadına bakarak deneme yapmayın; baldıranda küçük bir parça bile tehlikelidir.",
      "Hayvanlar yiyor diye bir bitkinin insan için güvenli olduğunu düşünmeyin.",
      "Tanımadığınız bitkiyi ateşte yakmayın; dumanı da zararlı olabilir.",
      "Belirtiler hafifledi diye sağlık yardımı aramaktan vazgeçmeyin."
    ],
    "keywords": [
      "baldıran otu nasıl tanınır",
      "baldiran otu",
      "zehirli ot benzeri",
      "yabani havuç zehirli mi",
      "yabani maydanoz zehirli",
      "şemsiye çiçekli bitki",
      "acı çiğdem yabani soğan",
      "porsuk ağacı meyvesi",
      "zehirli bitki tanıma",
      "zehirli bitkiler hangileri"
    ],
    "sources": [
      "Penn State Extension — Poison hemlock identification (https://extension.psu.edu/poison-hemlock-identification)",
      "Uludağ Üniv. — Baldıran otu zehirlenmelerinin incelenmesi (https://acikerisim.uludag.edu.tr/handle/11452/29181)",
      "Greenbelly — Universal edibility test, baldıran ve su baldıranı uyarısı (https://www.greenbelly.co/pages/universal-edibility-test)",
      "Wikipedia — Colchicum autumnale, yabani sarımsakla karışma (https://en.wikipedia.org/wiki/Colchicum_autumnale)",
      "Wikipedia — Taxus baccata, zehirli kısımlar (https://en.wikipedia.org/wiki/Taxus_baccata)",
      "ANSES — Toxic plants, su baldıranı, acı çiğdem ve yüksük otu karışmaları (https://www.anses.fr/en/content/toxic-plants)",
      "Wikipedia — Nerium (zakkum), bütün kısımlar zehirli, kurutma zehri gidermez, dalını ateş ve şişte kullanmama (https://en.wikipedia.org/wiki/Nerium)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: ANSES: su baldıranı ve acı çiğdem-yabani sarımsak karışmaları, yüksük otu kalp zehirlenmesi; zakkum ve yüksük otu eksikti, eklendi. Önceki not: baldıranda tüysüz mor lekeli gövde, 3–6 ft (≈1–2 m); yabani havuçta tüylü gövde, nadiren 2 ft'i geçer; eldiven önerisi; Türkiye'de 10 adli ölüm olgusu ve solunum yetmezliği." }
  },
  {
    "id": "sf-yb-yenebilirlik-testi",
    "category": "sf-yb-yabani",
    "title": "Bilinmeyen bitki: yenebilirlik testi ve sınırları",
    "tag": "YENEBİLİRLİK TESTİ",
    "summary": "SON ÇARE: Bu test baldıran, yüksük otu, porsuk, acı çiğdem gibi öldüren bitkileri AYIRT ETMEZ. Yalnız başka hiçbir yiyecek kalmadığında, yasak işaretlerden hiçbirini taşımayan, bol bulunan tek bir bitkinin tek parçasına, aşama aşama ve en az 24 saatte uygulayın.",
    "note": "Uzman gözetimi olmadan bu test ölümcül zehirlenmeyi önlemez: en öldürücü bitkilerin bazılarının tadı iyidir, dokununca deriyi yakmaz ve belirtileri saatler sonra başlar. Yalnız açlıktan ölüm gerçek bir tehlike olduğunda, son çare olarak düşünün; tanıdığınız yiyeceği her zaman teste tercih edin.",
    "steps": [
      "Önce şunu bilin: bu test öldüren bitkileri ayırt etmez. Baldıranın, porsuk tohumunun tadı kötü değildir; yüksük otu ve acı çiğdem gibi zehirler belirtiyi saatler sonra verir. Test yalnız açlık ölüm tehlikesi olduğunda yapılır. Kesin yasak, asla test etmeyin: mantar; şemsiye çiçekli ya da havuç-maydanoz yapraklı her bitki; sütlü ya da renkli özsulu; badem ya da armut kokulu; üçlü yapraklı; baklasında tohum olan; soğanlı ve kokusuz yumrulu; tüylü-dikenli; acı ya da sabunumsu tatlı; başağında pembe, mor ya da siyah mahmuz olan; zakkum ve porsuk. Çocuklar, gebeler ve hastalar test yapmaz.",
      "Bölgede bol bulunan tek bir bitki seçin. Kök, gövde, yaprak, çiçek ve tohum ayrı ayrı test edilir. Çürük ya da kurtlu bitkiyi atın.",
      "Testten önce 8 saat bir şey yemeyin. Test boyunca yalnız temiz su için.",
      "Deri testi: ezdiğiniz parçayı bileğinizin ya da dirseğinizin iç yüzüne 15 dakika tutun. Kaşıntı, yanma, kızarıklık, kabarma olursa bitkiyi bırakın ve derinizi yıkayın.",
      "Parçayı yiyecekmiş gibi hazırlayın, tercihen pişirin. Küçük bir parçayı dudağınıza 3 dakika değdirin.",
      "Tepki yoksa dilinizin üstüne koyup 15 dakika tutun; çiğnemeyin, yutmayın.",
      "Tepki yoksa iyice çiğneyip 15 dakika ağızda tutun, yutmayın. Yanma, uyuşma, karıncalanma ya da acı tat olursa tükürün ve ağzınızı çalkalayın.",
      "Hâlâ tepki yoksa yutun ve 8 saat başka bir şey yemeden bekleyin. Bulantı, kusma, baş dönmesi, kalp çarpıntısı, uyuşma ya da halsizlik olursa testi bırakın, su için, dinlenin, bitkiden bir parça saklayın; ulaşabiliyorsanız 114'ü ya da 112'yi arayın.",
      "Sorun yoksa aynı biçimde hazırlanmış yaklaşık çeyrek su bardağı yiyin ve 8 saat daha bekleyin. Sorun çıkmazsa yalnız o parça, o hazırlama biçimiyle yenebilir sayılır.",
      "Belirtiler 24 saate kadar, bazı zehirlerde daha da geç başlayabilir. Bütün test en az 24 saat sürer; geçen bir parçayı da ilk günlerde az yiyin, aç karna büyük miktar ishal yapabilir. Testi geçmek bitkinin güvenli olduğunu kanıtlamaz."
    ],
    "art": [
      "sf-yb-test-yasak-isaretler",
      null,
      null,
      "sf-yb-test-deri",
      "sf-yb-test-dudak",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Mantarlarda ve yasak işaretli bitkilerde bu testi asla uygulamayın.",
      "Testi geçti diye bitkiyi başkalarına, özellikle çocuklara bol miktarda yedirmeyin.",
      "Aynı anda iki farklı bitki ya da iki farklı parça test etmeyin.",
      "Testi geçen bir parçanın aynı bitkinin öteki parçalarını da güvenli yaptığını düşünmeyin.",
      "Yeterli su yoksa test yapmayın; kusma ve ishal susuzluğu hızlandırır."
    ],
    "keywords": [
      "yenebilirlik testi",
      "evrensel yenebilirlik testi",
      "bitki yenir mi nasıl anlaşılır",
      "bilinmeyen bitki test",
      "universal edibility test",
      "bitki zehirli mi test etme",
      "ordu hayatta kalma bitki testi",
      "bitki tadina bakma testi"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 9, kaçınılacak bitki işaretleri ve testin 24 saati aşması (https://www.wilderness-survival.net/plants-1.php)",
      "Greenbelly — Universal Edibility Test, adım süreleri ve son çare uyarısı (https://www.greenbelly.co/pages/universal-edibility-test)",
      "Survival Manual — Edible plants, test adımları (https://survival.powweb.com/edible-plants.php)",
      "Eat The Weeds (G. Deane) — Field testing plants for edibility, tadı iyi öldürücü bitkiler (https://www.eattheweeds.com/field-testing-plants-for-edibility/)",
      "ANSES — Toxic plants, acı çiğdem-yabani sarımsak ve yüksük otu karışmaları (https://www.anses.fr/en/content/toxic-plants)",
      "CDC MMWR — Amanita phalloides zehirlenmeleri (https://www.cdc.gov/mmwr/volumes/66/wr/mm6621a1.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: süreler (8 sa açlık, deri 15 dk, dudak 3 dk, dil 15 dk, çiğneme 15 dk, yutup 8 sa, ¼ bardak ve 8 sa) Greenbelly ve powweb ile tutarlı; FM 21-76 bölüm 9 metni test başına 24 saati aşan süre ve 8 kaçınma işaretini (soğan/yumru ve mahmuzlu başak dahil) teyit etti, Şekil 9-5 metni açılamadı. Eat The Weeds ve ANSES: baldıran ve porsuk tadı iyi, karışmalar ölümcül. Son çare uyarısı ve kesin yasak listesi başa alındı." }
  },
  {
    "id": "sf-yb-yabani-meyve",
    "category": "sf-yb-yabani",
    "title": "Yabani meyve ve yemişler: alıç, kuşburnu, böğürtlen, ceviz, kestane",
    "tag": "YABANİ MEYVE",
    "summary": "Tanıdığınız yabani meyveleri olgunken toplayın; kuşburnunun tüylerini ayıklayın, meyve çekirdeklerini yemeyin, kestaneyi at kestanesinden ayırın.",
    "steps": [
      "Tanıdığınız meyveleri toplayın: böğürtlen, alıç, kuşburnu, ahlat (yabani armut), yabani erik, kızılcık, dut.",
      "Kuşburnu: olgun kırmızı meyveyi ikiye açın, içindeki tohumları ve tüyleri tamamen ayıklayın; tüyler ağzı ve boğazı kaşındırır. Ya da ezip kaynatın ve sık bir bezden süzün.",
      "Alıç ve diğer yabani meyvelerin etli kısmını yiyin. Erik, kayısı ve kiraz çekirdeğinin içini, acı badem kokan hiçbir tohumu yemeyin.",
      "Ahlat ağaçta sert ve buruktur. Toplayıp serin yerde bekletin; yumuşayıp kahverengileşince tatlanır.",
      "Ceviz: yeşil dış kabuğu eldivenle soyun, eli boyar. İçi küflü, kararmış ya da acı olanı atın.",
      "Kestane: yenen kestanenin kabuğu sık, ince, sivri dikenlerle kaplıdır ve içinden çoğu kez birkaç kestane çıkar; ucu püsküllüdür. At kestanesinin kabuğunda seyrek kalın çıkıntılar olur, içinden genellikle tek, yuvarlak, parlak tohum çıkar; zehirlidir, yemeyin.",
      "Kestaneyi kabuğunu çizerek közde ya da haşlayarak yiyin.",
      "Tanımadığınız küçük kırmızı, siyah ya da beyaz taneli meyveleri yemeyin. Porsuk ağacının kırmızı meyvesindeki tohum ölümcüldür.",
      "Meyveyi yıkayın; yere düşüp çürümüş, küflenmiş olanı atın.",
      "Çok miktarda yabani meyve ishal yapabilir; ilk günlerde azar azar yiyin."
    ],
    "art": [
      null,
      "sf-yb-kusburnu-ayiklama",
      null,
      null,
      null,
      "sf-yb-kestane-ayrim",
      null,
      "sf-yb-porsuk-yasak",
      null,
      null
    ],
    "dont": [
      "At kestanesini yemeyin; yenen kestaneye benzer ama zehirlidir.",
      "Meyve çekirdeklerinin içini kırıp yemeyin; acı badem kokusu siyanür belirtisidir.",
      "Küflü ceviz ve kestaneyi ayıklamadan yemeyin.",
      "Tanımadığınız taneli meyveyi kuşlar yiyor diye yemeyin."
    ],
    "keywords": [
      "yabani meyve toplama",
      "kuşburnu nasıl yenir",
      "alıç yenir mi",
      "ahlat yabani armut",
      "böğürtlen toplama",
      "at kestanesi ile kestane farkı",
      "kestane zehirli mi",
      "ceviz toplama doğada",
      "ormanda meyve",
      "yabani yemiş"
    ],
    "sources": [
      "Wikipedia — Castanea sativa, kabuk ve kestane sayısı (https://en.wikipedia.org/wiki/Castanea_sativa)",
      "Wikipedia — Aesculus hippocastanum, at kestanesi zehirliliği (https://en.wikipedia.org/wiki/Aesculus_hippocastanum)",
      "Wikipedia — Rosa canina, kuşburnu tüyleri (https://en.wikipedia.org/wiki/Rosa_canina)",
      "Wikipedia — Taxus baccata, porsuk zehirliliği (https://en.wikipedia.org/wiki/Taxus_baccata)",
      "Survival Manual — Edible plants, badem kokusu uyarısı (https://survival.powweb.com/edible-plants.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: kestanede 3–7 kestane/kabuk ve püsküllü uç; at kestanesi genellikle tek tohum ve zehirli; kuşburnu tüyleri; porsukta yalnız kırmızı zar zehirsiz. Ahlatın bekletilmesi geleneksel bilgi, ayrı kaynak bulunamadı." }
  },
  {
    "id": "sf-yb-palamut",
    "category": "sf-yb-yabani",
    "title": "Meşe palamudunu yenir hale getirme",
    "tag": "PALAMUT",
    "summary": "Palamudu soyup ezin, acılığı tamamen gidene kadar kaynatıp suyunu değiştirin ya da soğuk suda günlerce bekletin; sonra kurutup un yapın.",
    "steps": [
      "Yere düşmüş, kahverengileşmiş olgun palamutları toplayın. Delikli, kurtlu, küflü olanları atın.",
      "Kabuklarını kırıp soyun. İçi kararmış, siyah lekeli ya da küf kokan palamudu atın.",
      "İçleri ezin ya da küçük parçalara bölün; parça küçüldükçe acılık daha çabuk çıkar.",
      "Sıcak yöntem: palamutları kaynayan suda kapağı kapalı 20 dakika kaynatın, sonra suyunu dökün.",
      "Suyu değiştirirken soğuk su eklemeyin; ayrı bir kapta kaynattığınız suyu ekleyin. Soğuk su acılığı içeride tutabilir.",
      "Kaynatıp su değiştirmeyi palamut hiç acı tat bırakmayana kadar sürdürün. Tadına bakın; acı kalmadıysa hazırdır.",
      "Soğuk yöntem (un için daha iyi): ezilmiş palamutu soğuk suya koyun, su kahverengileşince değiştirin, en az günde bir kez. Bu birkaç günden bir haftadan fazlaya kadar sürer; su berrak kalıp acılık gidince bitmiştir.",
      "Acılığı giden palamutu güneşte ya da ateş yanında kurutun. Sonra öğütüp un yapın ya da renk koyulaşana kadar kavurun.",
      "Unu kuru ve serin yerde saklayın; küf kokarsa atın."
    ],
    "art": [
      null,
      "sf-yb-palamut-soyma",
      null,
      "sf-yb-palamut-kaynatma",
      null,
      "sf-yb-palamut-tat",
      null,
      null,
      null
    ],
    "dont": [
      "Çiğ, acılığı alınmamış palamudu bol yemeyin; tanen mideyi bozar ve zararlıdır.",
      "Küflü ya da içi kararmış palamudu kullanmayın.",
      "Palamudu hayvanlara bol miktarda yedirmeyin; at ve sığır için de zehirlidir."
    ],
    "keywords": [
      "palamut nasıl yenir",
      "meşe palamudu yemek",
      "palamut acılığı nasıl gider",
      "palamut unu yapımı",
      "palamut kaynatma",
      "mese palamudu",
      "acorn yenir mi",
      "palamut tanen"
    ],
    "sources": [
      "Low Tech Institute — Acorn leaching (https://lowtechinstitute.org/2017/01/11/research-update-acorn-leaching/)",
      "Woodland Trust — Edible acorns (https://www.woodlandtrust.org.uk/blog/2016/10/edible-acorns/)",
      "Survival Manual — Edible plants, palamudun kaynatılması (https://survival.powweb.com/edible-plants.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: 20 dk kaynatma, su değişiminde kaynar su, soğuk yöntemde günlük su değişimi ve birkaç gün–1 haftadan fazla; kavurma renk koyulaşana dek." }
  },
  {
    "id": "sf-yb-kok-yumru",
    "category": "sf-yb-yabani",
    "title": "Yabani kökler ve yumrular",
    "tag": "KÖK VE YUMRU",
    "summary": "Yalnız kesin tanıdığınız köklere yönelin: su kamışı köki, dulavratotu kökü, soğan kokan yabani soğan; hepsini iyice pişirin, havuç yapraklı bitkinin kökünü asla yemeyin.",
    "note": "Uzman gözetimi olmadan tanımadığınız soğanlı ve yumrulu bitkiyi yemeyin; acı çiğdem gibi ölümcül türler yabani soğana, baldıranın kökü havuca benzer.",
    "steps": [
      "Kök ve yumrular iyi nişasta kaynağıdır, ama zehirli bitkilerin en zehirli yeri çoğu kez köküdür. Yalnız kesin tanıdıklarınızı sökün.",
      "Su kamışı (hasır otu, saz): göl ve bataklık kenarındaki, puro biçimli kahverengi başaklı bitki. Çamurdaki yatay kökünü çıkarın, yıkayıp soyun; lifler arasındaki nişastayı kazıyın ya da suda ezip çöktürün.",
      "Su kamışının körpe filizini soyun; içindeki beyaz özü haşlayarak yiyin.",
      "Su kamışını yalnız temiz sudan toplayın. Kirli su, lağım ya da tarla ilacı karışan yerdeki kökler kurşun ve ilaç biriktirir.",
      "Dulavratotu (büyük dulavrat): kocaman, alt yüzü keçemsi yapraklı, mor çiçekli, yapışkan çengelli yuvarlak tohum başları olan bitki. Uzun kazık kökünü kazıp soyun, dilimleyin, suda bekletip haşlayın. Domuz pıtrağıyla (oval, dikenli meyveli, üçgenimsi yapraklı) karıştırmayın; onun tohumu ve fidesi öldürür.",
      "Yabani soğan ve pırasa: yaprağı ezince belirgin soğan-sarımsak kokusu gelmeli. Koku yoksa yemeyin.",
      "Bütün kök ve yumruları iyice pişirin: haşlayın, közleyin. Ağızda yanma yapan kökleri kurutmak ya da uzun pişirmek yanmayı azaltır; yine yanıyorsa yemeyin.",
      "Havuç ya da maydanoz yapraklı (şemsiye çiçekli) hiçbir bitkinin kökünü yemeyin.",
      "Sökerken bitkilerin bir kısmını yerinde bırakın; gelecek yıl yeniden çıksın."
    ],
    "art": [
      null,
      "sf-yb-sukamisi-kok",
      null,
      null,
      null,
      "sf-yb-cigdem-sogan",
      null,
      "sf-yb-semsiye-yasak",
      null
    ],
    "dont": [
      "Kokusuz soğanlı bitkiyi yemeyin; acı çiğdem öldürür.",
      "Kirli su kenarından kök toplamayın.",
      "Çiğ yumruyu, tanıdığınız bitki olsa bile, pişirmeden bol yemeyin.",
      "Dulavratotu yaprağını ışkın ya da başka geniş yapraklı bitkilerle karıştırmayın; emin değilseniz sökmeyin.",
      "Domuz pıtrağının tohumunu ve iki yapraklı fidesini asla yemeyin; kıtlıkta yenip toplu ölümlere yol açmıştır."
    ],
    "keywords": [
      "yabani kök yenir mi",
      "yenebilir kökler",
      "su kamışı kökü yemek",
      "hasır otu kökü",
      "dulavratotu kökü",
      "yabani soğan nasıl anlaşılır",
      "doğada yumru bulma",
      "yabani pırasa toplama",
      "nişastalı kök bulma"
    ],
    "sources": [
      "Wikipedia — Typha, yenen kısımlar ve kirlilik uyarısı (https://en.wikipedia.org/wiki/Typha)",
      "Wikipedia — Arctium lappa, kökün hazırlanması (https://en.wikipedia.org/wiki/Arctium_lappa)",
      "Wikipedia — Xanthium strumarium (domuz pıtrağı), karboksiatraktilozit ve Bangladeş 2007 ölümleri (https://en.wikipedia.org/wiki/Xanthium_strumarium)",
      "Wikipedia — Colchicum autumnale, yabani sarımsakla karışma (https://en.wikipedia.org/wiki/Colchicum_autumnale)",
      "Survival Manual — Edible plants, okzalatlı köklerin kurutulması ve pişirilmesi (https://survival.powweb.com/edible-plants.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: 'pıtrak' adı Türkiye'de zehirli domuz pıtrağı için de kullanıldığından dulavratotu tanımı netleştirildi ve Xanthium uyarısı eklendi (tohum ve fide zehirli, 2007 Bangladeş kıtlığında en az 19 ölüm). Önceki not: Typha rizom nişastası, filiz özü, kirli suda kurşun-ilaç birikimi; dulavratotu kökü 5–10 dk suda bekletilip pişirilir; acı çiğdem yabani sarımsakla karışır. Türkiye'ye özgü kök listesi için kaynak bulunamadı." }
  },
  {
    "id": "sf-yb-mantar",
    "category": "sf-yb-yabani",
    "title": "Yabani mantar: neden toplanmamalı",
    "tag": "MANTAR",
    "summary": "Yabani mantarı toplamayın, yemeyin; pişirmek zehri yok etmez ve en ölümcül zehirlenme belirtileri saatler sonra başlar.",
    "note": "Uzman mantar bilimci olmadan hiçbir yabani mantarı yemeyin. Bu rehber mantarı tanıtmak için değil, yememek için yazıldı.",
    "steps": [
      "Yabani mantar toplamayın, yemeyin. Mantar az besin verir; riski faydasından çok büyüktür.",
      "Pişirmek, kurutmak, dondurmak, tuza ya da sirkeye yatırmak zehri yok etmez. En ölümcül mantar zehri ısıya dayanıklıdır.",
      "Halk testlerine inanmayın: gümüş kaşık, soğanın kararması, hayvanların yemesi, güzel koku, kolay soyulma zehirsizlik göstermez.",
      "Ölümcül türlerden tek bir mantar, bir yetişkini öldürecek kadar zehir taşıyabilir.",
      "Yıllardır topladığınız bir tür bile risklidir: zehirli benzerleri aynı yerde çıkabilir. Türkiye'de her yıl mantarı tanıdığını düşünen kişiler zehirlenip ölüyor.",
      "En tehlikeli zehirlenmede ilk belirtiler çoğunlukla 6–24 saat sonra kusma ve ishalle başlar. 1–2 gün sonra düzelmiş gibi görünür; ardından 3–5. günde karaciğer ve böbrek iflası gelir.",
      "Mantar yediyseniz ve bulantı, kusma, ishal başladıysa hemen 114'ü ya da 112'yi arayın. Aynı yemekten yiyen herkes belirti beklemeden sağlık kuruluşuna gitsin.",
      "Yenen mantardan ya da yemek artığından bir parça saklayın; uzmana gösterin.",
      "Açken bile mantar yerine daha güvenli kaynaklara yönelin: tanıdığınız otlar, yemişler, böcek, balık."
    ],
    "art": [
      "sf-yb-mantar-yasak",
      null,
      "sf-yb-mantar-halk-testi",
      null,
      null,
      null,
      "sf-yb-cagri-114",
      null,
      null
    ],
    "dont": [
      "Az bir parça tadarak deneme yapmayın.",
      "Hiçbir yabani mantarı çiğ yemeyin.",
      "Belirtiler geçti diye sağlık yardımından vazgeçmeyin; karaciğer hasarı sonradan gelir.",
      "Yenebilirlik testini mantarda uygulamayın."
    ],
    "keywords": [
      "yabani mantar yenir mi",
      "mantar toplamak",
      "zehirli mantar nasıl anlaşılır",
      "mantar zehirlenmesi belirtileri",
      "ormanda mantar",
      "köygöçüren mantar",
      "mantar pişirince zehri gider mi",
      "mantar gumus kasik testi",
      "dogada mantar"
    ],
    "sources": [
      "CDC MMWR — Amanita phalloides zehirlenmeleri, 2016 (https://www.cdc.gov/mmwr/volumes/66/wr/mm6621a1.htm)",
      "Sağlık Bakanlığı mantar zehirlenmesi uyarısı (Habertürk, 2019) (https://www.haberturk.com/saglik-bakanligi-ndan-mantar-zehirlenmelerine-karsi-uyari-2462956)",
      "Greenbelly — Universal edibility test, mantar uyarısı (https://www.greenbelly.co/pages/universal-edibility-test)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: amatoksin ısıyla bozulmaz; belirti 6–24 saat, 24–36 saatte yalancı düzelme, 3–5. gün karaciğer yetmezliği; ölümcül doz 0,1 mg/kg, tek mantar 15 mg'a dek; Sağlık Bakanlığı: yabani mantar yemeyin, 114." }
  },
  {
    "id": "sf-yb-kiyi",
    "category": "sf-yb-yabani",
    "title": "Deniz kıyısında yiyecek: midye, salyangoz, yosun",
    "tag": "KIYI",
    "summary": "Kabuklu deniz ürününü yalnız temiz, açık kayalık kıyıdan, canlı ve kapalıyken toplayın ve iyice pişirin. Pişirmek midye zehrini (kırmızı gelgit zehri) yok etmez; dudakta karıncalanma başlarsa hemen 112.",
    "note": "Türkiye'de olağan koşullarda sınıflandırılmamış alanlardan çift kabuklu (midye vb.) toplamak yasaktır; bu bilgi yalnız gerçek hayatta kalma durumu içindir. Uzman izlemesi olmadan toplanan kabuklular ölümcül zehir taşıyabilir.",
    "steps": [
      "Yalnız açık denize bakan, dalga ve akıntı alan temiz kayalık kıyılardan toplayın. Liman, dere ağzı, lağım çıkışı, sanayi ve yerleşim yakınından toplamayın.",
      "Midye: kayaya sıkıca yapışmış, kabuğu kapalı ya da dokununca kapanan canlı midyeleri alın. Kırık, açık kalan, kötü kokanı atın.",
      "Su yükseldiğinde bile su altında kalmayan, yalnız dalgayla ıslanan kayalardaki kabukluları almayın.",
      "Deniz suyu kırmızı, kahverengi ya da koyu yeşile dönmüşse, kıyıda ölü balık ya da kuş varsa hiçbir kabuklu toplamayın. Zehir suyun rengi değişmeden de olabilir; renk normal diye güvenmeyin.",
      "Bu zehri pişirmek, kaynatmak, dondurmak ve yıkamak yok etmez; zehirli midye görünüş, koku ve tatça normaldir. Midye, istiridye, tarak, deniz salyangozu ve yengecin iç organları aynı zehri biriktirir. Temiz yer seçin; ilk gün az yiyin ve yedikten sonra birkaç saat yalnız kalmayın. Az yemek riski azaltır, ortadan kaldırmaz.",
      "Midyeyi buharda ya da suda kabuğu açılana kadar pişirin. Pişince açılmayanları atın.",
      "Kayalara yapışan konik kabuklu deniz salyangozlarını kaynatarak pişirin, etini iğne ya da sivri çöple çıkarın.",
      "Deniz yosunu: kayaya bağlı, canlı, temiz görünen yosunu alın. Kıyıya vurmuş, çürüyen yosunu toplamayın. Yıkayıp az miktarda yiyin.",
      "Yedikten sonra dudak, dil ya da parmak uçlarında karıncalanma, uyuşma başlarsa hemen yemeyi bırakın ve 112'yi arayın. Bu zehir kısa sürede nefes durmasına yol açabilir."
    ],
    "art": [
      "sf-yb-kiyi-temiz-yer",
      "sf-yb-midye-secme",
      null,
      "sf-yb-kiyi-renkli-su",
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Çiğ midye ve istiridye yemeyin.",
      "Pişirince açılmayan midyeyi zorla açıp yemeyin.",
      "Kirli liman ve dere ağzından kabuklu toplamayın.",
      "Karıncalanma ve uyuşmayı önemsiz saymayın; nefes felci dakikalar içinde gelebilir.",
      "Pişirdim diye şüpheli yerden toplanmış midyeyi güvenli saymayın; zehir ısıya dayanıklıdır."
    ],
    "keywords": [
      "kıyıda yiyecek bulma",
      "midye toplamak",
      "midye zehirlenmesi",
      "deniz salyangozu yemek",
      "deniz yosunu yenir mi",
      "kırmızı gelgit midye",
      "sahilde yiyecek",
      "kayadan midye",
      "midye toplama yasak mi"
    ],
    "sources": [
      "Washington Sağlık Bakanlığı — Paralytic shellfish poisoning (https://doh.wa.gov/community-and-environment/shellfish/recreational-shellfish/illnesses/biotoxins/paralytic-shellfish-poisoning)",
      "ABD Ordusu FM 21-76 — Bölüm 8, yumuşakçalar (https://www.wilderness-survival.net/food-1.php)",
      "FoodSafety.gov — Safe minimum internal temperatures, midye (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Çift kabuklu yumuşakça üretim alanları tebliği (https://www.lexpera.com.tr/mevzuat/tebligler/avcilik-veya-yetistiricilik-yoluyla-elde-edilen-cift-kabuklu-yumusakca-uretim-alanlarinin-1)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Washington DOH sayfası: PSP pişirme ve dondurmayla yok olmaz; dudak-dil karıncalanması dakikalar ile 1–2 saat içinde, 30 dk'dan kısa sürede ölüm görülmüş; su rengi güvenilir değil, PSP nadiren kırmızı suyla görülür; salyangoz ve yengeç iç organı da biriktirir. FM 21-76 bölüm 8: yüksek suda örtülmeyen kabukluyu yemeyin, kabuğunda pişirin. FoodSafety.gov: midye kabuğu açılana dek. Yosun için kaynak bulunamadı." }
  },
  {
    "id": "sf-yb-bocek",
    "category": "sf-yb-yabani",
    "title": "Böcek yeme: hangileri, nasıl pişirilir",
    "tag": "BÖCEK",
    "summary": "Çekirge, cırcır, karınca, kütük kurtçuğu ve solucan yenebilir; parlak renkli, tüylü, sokan böcekleri almayın, hepsini pişirerek yiyin.",
    "steps": [
      "Çekirge, cırcır böceği, karınca, çürük kütükteki beyaz kurtçuklar (larvalar) ve yer solucanı yenebilir; hepsi çok iyi protein kaynağıdır.",
      "Uzak durun: sokan ya da ısıran yetişkin böcekler, tüylü ya da parlak renkli (kırmızı, sarı, turuncu) olanlar, tırtıllar, örümcekler, kene, sinek, sivrisinek ve kötü kokanlar.",
      "Kurtçukları çürük kütüklerin içinde ve taş altlarında arayın.",
      "Çekirge ve cırcırın başını, kanatlarını ve dikenli arka bacaklarını koparın.",
      "Sert kabuklu böcekleri mutlaka pişirin; parazit taşıyabilirler. Kaynatın, közleyin ya da kızgın taşta kavurun.",
      "Yer solucanlarını birkaç dakika temiz suda bekletip içlerini boşaltın, sonra kaynatın.",
      "Doğadan toplanan böceği çiğ yemeyin; çiğ yemek mikrop ve parazit riskini artırır.",
      "Karides, yengeç gibi kabuklulara alerjiniz varsa böcek yemeyin; aynı alerjiyi yapabilir.",
      "İlaçlanmış tarla, bağ ve bahçe kenarından böcek toplamayın.",
      "Kavrulmuş böceği ezip çorbaya ya da una katabilirsiniz."
    ],
    "art": [
      "sf-yb-bocek-yenir",
      "sf-yb-bocek-yasak",
      null,
      "sf-yb-cekirge-temizleme",
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Tüylü tırtılları ve parlak renkli böcekleri yemeyin.",
      "Arı ve eşek arısını toplamaya çalışmayın; sokma tehlikesi büyüktür.",
      "Ölü bulduğunuz böceği toplamayın; ne zamandan beri öldüğünü bilemezsiniz.",
      "Böceği çiğ yemeyin."
    ],
    "keywords": [
      "böcek yemek",
      "hangi böcekler yenir",
      "çekirge yenir mi",
      "cırcır böceği yemek",
      "solucan yenir mi",
      "kurtçuk larva yemek",
      "hayatta kalma böcek",
      "bocek yemek protein"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8, böcekler ve solucanlar (https://www.wilderness-survival.net/food-1.php)",
      "Field & Stream — Insects to eat in a survival situation (https://www.fieldandstream.com/story/survival/insects-to-eat-in-survival-situation/)",
      "FAO — Yenebilir böceklerde gıda güvenliği (Food Safety News özeti) (https://www.foodsafetynews.com/2021/04/fao-highlights-possible-food-safety-issues-with-edible-insects/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FM 21-76 bölüm 8 açıldı: sokan-ısıran, tüylü ve parlak renkli erişkinlerden kaçının; sert kabuklularda parazit, pişirin; solucan temiz suda birkaç dakika (FM çiğ yenebilir der, rehber tutucu biçimde kaynatıyor). Yazar notu: kaçınılacak böcek listesi, sert kabukluları pişirme, kanat ve bacakları koparma, solucanı suda boşaltma (FM); FAO: kabuklu alerjisiyle çapraz tepki, zirai ilaç, çiğ yabani böcek riski." }
  },
  {
    "id": "sf-yb-yumurta",
    "category": "sf-yb-yabani",
    "title": "Kuş yumurtası toplama ve tazelik testi",
    "tag": "YUMURTA",
    "summary": "Yuvadan bütün yumurtaları almayın, birkaçını işaretleyip bırakın; yumurtayı suda test edin, kırıp koklayın ve katılaşana kadar pişirin.",
    "note": "Türkiye'de 4915 sayılı Kara Avcılığı Kanunu (madde 4) yabani hayvanların yumurta ve yavrularını toplamayı, yuvalarını dağıtmayı yasaklar; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Kuşların yuva yaptığı yerleri ilkbaharda izleyin: sazlık, kayalık yar, çalı, ağaç kovuğu. Kuşun sürekli gidip geldiği nokta yuvadır.",
      "Yuvadan bütün yumurtaları almayın. 2–3 yumurta bırakın ve bunları kömürle işaretleyin. Kuş yumurtlamayı sürdürür; sonraki günlerde yalnız işaretsiz yeni yumurtaları alın.",
      "Kırık, çatlak, dışı pisli yumurtayı almayın; çatlaktan mikrop girer.",
      "Tazelik testi: yumurtayı su dolu kaba koyun. Dibe batıp yan yatan tazedir. Dik duran ya da yüzen yumurta eskidir.",
      "Yüzen yumurtayı ayrı bir kaba kırın. Kötü kokuyorsa ya da akı pembe veya yanardöner renkteyse atın.",
      "Yumurtayı akı ve sarısı katılaşana kadar pişirin. Çiğ ya da yarı pişmiş yemeyin.",
      "Yumurtaya ve yuvaya dokunduktan sonra ellerinizi yıkayın.",
      "Çocuklar, yaşlılar, gebeler ve hastalar yumurtayı yalnız tam pişmiş yesin."
    ],
    "art": [
      null,
      "sf-yb-yumurta-isaret",
      null,
      "sf-yb-yumurta-su-testi",
      null,
      "sf-yb-yumurta-pisirme",
      null,
      null
    ],
    "dont": [
      "Yuvayı tamamen boşaltmayın; kuş yuvayı terk eder.",
      "Yüksek ağaç ve yarlara yumurta için tırmanmayın; düşme yumurtadan çok daha pahalıya patlar.",
      "Kötü kokan yumurtayı pişirip yemeyi denemeyin.",
      "Yırtıcı kuşların (kartal, şahin) yuvasına yaklaşmayın; saldırabilirler."
    ],
    "keywords": [
      "kuş yumurtası toplama",
      "yabani kuş yumurtası yenir mi",
      "yumurta tazelik testi",
      "yumurta suda yüzüyor",
      "yumurta bozuk mu anlama",
      "yuva yumurta",
      "yumurta su testi",
      "kus yumurtasi"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8, kuşlar ve yumurtalar (https://www.wilderness-survival.net/food-1.php)",
      "USDA FSIS — Shell eggs from farm to table (https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/shell-eggs-farm-table)",
      "4915 sayılı Kara Avcılığı Kanunu, madde 4 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FM 21-76 bölüm 8: 2–3 yumurta bırakıp işaretleme teyit edildi; FoodSafety.gov: çiğ yumurta sarısı ve akı katılaşana dek. Yazar notu: FM 2–3 yumurta bırakıp işaretleme; USDA: yüzen yumurta düşük kalite, kırıp koklayın, pembe-yanardöner ak bozulma, ak ve sarı katılaşana dek pişirme; 4915 m.4 yumurta toplama yasağı." }
  },
  {
    "id": "sf-yb-bal",
    "category": "sf-yb-yabani",
    "title": "Bal bulma ve yabani arı kovanı",
    "tag": "YABANİ BAL",
    "summary": "Yabani kovana ancak arı alerjisi yoksa, bütün teniniz örtülü ve serin dumanla yaklaşın; yalnız ballı peteğin bir kısmını alın, deli bal riskini bilin.",
    "note": "Uzman gözetimi olmadan yabani kovana yaklaşmak çok sayıda arı sokmasına ve ölümcül alerjik tepkiye yol açabilir. Arı alerjisi olan kişi hiçbir koşulda katılmamalıdır.",
    "steps": [
      "Daha önce arı sokunca nefes darlığı, yüzde ya da boğazda şişme yaşamış kişi kovana yaklaşmasın.",
      "Kovanı bulun: sıcak, sakin bir günde arıların uçuş yönünü izleyin. Ağaç kovuğuna ya da kaya yarığına sürekli girip çıkan arılar kovan ağzını gösterir.",
      "Bal arısını eşek arısından ayırın. Eşek arısı ve yaban arısı yuvası gri, kâğıt gibidir, içinde bal yoktur; bu yuvalardan uzak durun.",
      "Akşamüstü, arıların çoğu kovana dönmüşken gidin.",
      "Bütün tenini örtün: uzun kol, paçaları çoraba sokulmuş pantolon, eldiven, yüze tül ya da ince bez.",
      "Nemli ot, çürük odun ya da çuval bezini alevsiz tüttürüp kovan ağzına bol, serin duman verin. Duman arıların alarm kokusunu bastırır, arılar bal yemeye yönelir ve sakinleşir.",
      "Yalnız kenardaki ballı petekleri kesin. İçinde larva olan petekleri ve kovanın bir kısmını bırakın; koloni yaşasın.",
      "Kovan ağaçta yüksekteyse tırmanmayın; düşmek sokmaktan daha tehlikelidir.",
      "Karadeniz'de, orman gülünün (komar) bol olduğu yerlerde bulunan yabani bal deli bal olabilir. Baş dönmesi, kusma, kalp yavaşlaması ve tansiyon düşmesi yapar; bu bölgelerdeki yabani balı yemeyin.",
      "Balı 1 yaşından küçük bebeğe asla vermeyin; bebek botulizmine yol açabilir."
    ],
    "art": [
      null,
      null,
      "sf-yb-ari-esek-ayrim",
      null,
      "sf-yb-bal-koruyucu-giysi",
      "sf-yb-bal-duman",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Kovanı ateşe vermeyin; orman yangını çıkarır ve koloniyi öldürür.",
      "Kovanın tamamını almayın.",
      "Çok sayıda arı sokmasından sonra ya da nefes darlığı başlarsa beklemeyin; 112.",
      "Bebeklere bal ve ballı emzik vermeyin."
    ],
    "keywords": [
      "yabani bal bulma",
      "doğada bal",
      "yabani arı kovanı",
      "ağaç kovuğunda bal",
      "arıyı dumanla sakinleştirme",
      "deli bal zehirlenmesi",
      "karakovan bal alma",
      "eşek arısı yuvası",
      "yabani bal yenir mi"
    ],
    "sources": [
      "Wikipedia — Bee smoker, dumanın etkisi (https://en.wikipedia.org/wiki/Bee_smoker)",
      "Wikipedia — Honey hunting (https://en.wikipedia.org/wiki/Honey_hunting)",
      "Wikipedia — Mad honey, deli bal ve belirtiler (https://en.wikipedia.org/wiki/Mad_honey)",
      "CDC — Botulism prevention, bebek ve bal (https://www.cdc.gov/botulism/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: duman alarm feromonunu maskeler ve arıları bal yemeye yöneltir; deli bal Rhododendron ponticum/luteum, Karadeniz, bradikardi ve hipotansiyon; CDC: 1 yaş altına bal yok. Kovan bulma ipuçları için askeri ya da resmî kaynak bulunamadı." }
  },

  // ───────────────────────── BALIK VE SU ÜRÜNLERİ ─────────────────────────
  {
    "id": "sf-yb-olta",
    "category": "sf-yb-balik",
    "title": "Balık tutma: ip ve iğneden olta",
    "tag": "OLTA",
    "summary": "İnce sağlam ip, esnek bir sırık, küçük bir kanca, şamandıra ve ağırlıkla olta kurun; gözetimsiz bırakma oltayla aynı anda birkaç iğne kullanın.",
    "note": "Türkiye'de amatör balıkçılıkta içsularda kişi başı en fazla 4 olta ve olta başına 3 iğneye izin verilir; bırakma olta ve paraketa yasaktır (1380 sayılı Su Ürünleri Kanunu ve amatör avcılık tebliği). Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Misina yoksa ip bulun: paraşüt ipinin içindeki ince lifler, sökülmüş örgü ipliği ya da birkaç kat bükülmüş dikiş ipliği.",
      "Boyunuzdan uzun, ince ve esnek bir dal ya da kamış seçin. İpi ucuna sıkıca bağlayın.",
      "İpin ucuna küçük bir kanca bağlayın (yapımı için kanca rehberine bakın). Düğümü sıkmadan önce ıslatın.",
      "Kancanın biraz yukarısına şamandıra bağlayın: kuru mantar tıpa, kuş tüyü sapı ya da kuru dal parçası. Aradaki mesafeyi suyun derinliğine göre ayarlayın. Şamandıra batınca balık yemi almıştır.",
      "Kancanın biraz üstüne küçük bir taş ya da çivi bağlayın; yem dibe yakın dursun.",
      "Yemi kancanın ucunu örtecek biçimde takın.",
      "Bırakma olta: iki esnek fidanı suyun dibine çakın, tepeleri suyun hemen altında kalsın. Aralarına suyun biraz altında bir ip gerin.",
      "Bu ipe kısa iğneli ipler bağlayın. Kısa ipler birbirine ya da direklere dolanmamalı, ip üstünde kaymamalı.",
      "Oltaları sık sık kontrol edin. Şamandıra batınca sırığı hızla kaldırıp kancayı oturtun, sonra balığı yavaşça çekin."
    ],
    "art": [
      null,
      "sf-yb-olta-sirik",
      null,
      "sf-yb-olta-samandira",
      null,
      null,
      "sf-yb-birakma-olta",
      null,
      null
    ],
    "dont": [
      "Balık tutmak için zehir, patlayıcı ya da elektrik kullanmayın; hem yasaktır hem suyu ve sizi zehirler.",
      "Akıntılı derin suya balık için girmeyin; boğulma riski balıktan önemlidir.",
      "Bırakma oltayı unutmayın; kuşlar ve başka hayvanlar takılır.",
      "Kancayı ağızda tutmayın, iğneyi çocukların ulaşacağı yerde bırakmayın."
    ],
    "keywords": [
      "olta yapma",
      "ip ve iğneden olta",
      "doğada balık tutma",
      "oltasız balık tutmak",
      "el yapımı olta",
      "şamandıra yapımı",
      "bırakma olta",
      "dogaclama olta",
      "balik tutma hayatta kalma"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık tutma araçları, bırakma olta (https://www.wilderness-survival.net/food-4.php)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)",
      "Wikipedia — Fish hook (https://en.wikipedia.org/wiki/Fish_hook)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM bırakma olta kurulumu ve dolanma uyarısı; tebliğ md.13: içsularda en fazla 4 olta, olta başına 3 iğne, bırakma olta ve parakete yasak. Şamandıra mesafesi için sayı bulunamadı, sayısız yazıldı." }
  },
  {
    "id": "sf-yb-kanca",
    "category": "sf-yb-balik",
    "title": "Kanca yapma: telden, dikenden, kemikten, tahtadan",
    "tag": "KANCA",
    "summary": "İğne ya da teli J biçiminde kıvırın; yoksa dikenli dal, kemik ya da iki ucu sivri çatal kanca yapın.",
    "steps": [
      "Telden: toplu iğne, dikiş iğnesi, ince tel ya da küçük çiviyi J biçiminde kıvırın. Ucunu taşa sürterek sivriltin.",
      "Geri tırnak (çapra) şart değildir; eski kancaların hepsi tırnaksızdı. Balığı çekerken ipi gevşetmeyin.",
      "Dikenden: alıç, karaçalı gibi sert ve kıvrık dikenli bir dalı dikeniyle birlikte kesin. Dal sap, diken uç olur. İpi sapa sarıp bağlayın.",
      "Tahta ve diken: sert bir ağaçtan yaklaşık 2,5 cm boyunda bir sap kesin. Bir ucuna çentik açın, çentiğe diken ya da sivri tel parçası oturtup sıkıca bağlayın.",
      "Kemikten: kuş ya da küçük hayvan kemiğinden ince bir parçayı taşla sürterek sivri uç ve sap biçimine getirin.",
      "Çatal kanca: kemik ya da sert tahtadan iki ucu sivri, ortası çentikli kısa bir çubuk yapın. İpi ortadaki çentiğe bağlayın.",
      "Çatal kancayı ipe paralel yatırıp yemin içine gömün. Balık yemi yutunca ipi çekin; çubuk boğazda yan döner ve takılır.",
      "Kancayı küçük yapın; büyük kanca küçük balığın ağzına girmez.",
      "Birkaç yedek kanca yapın; diken ve tahta kancalar çabuk kırılır."
    ],
    "art": [
      null,
      null,
      "sf-yb-kanca-diken",
      "sf-yb-kanca-tahta",
      null,
      null,
      "sf-yb-catal-yem",
      null,
      null
    ],
    "dont": [
      "Teli kıvırırken ucunu kendinize doğru tutmayın; parmağınıza batar.",
      "Paslı tel ve çiviyle yaralanırsanız yarayı temizleyin; tetanoz riski vardır.",
      "Kırık kancayı suda bırakmayın."
    ],
    "keywords": [
      "kanca yapma",
      "olta iğnesi yapmak",
      "dikenden kanca",
      "kemikten kanca",
      "çatal kanca gorge",
      "telden olta iğnesi",
      "balik kancasi yapimi",
      "iğneden kanca"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Doğaçlama kancalar ve çatal kanca (https://www.wilderness-survival.net/food-4.php)",
      "Wikipedia — Fish hook, çatal kanca, kemik ve tahta kancalar (https://en.wikipedia.org/wiki/Fish_hook)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM 2,5 cm sert tahta sap ve çentiğe uç oturtma, iğne-tel-çivi-diken-kemik-kabuk kancalar, çatal kancanın boyuna yemlenmesi; Wikipedia: çatal kanca yutulunca yan döner, eski kancalar tırnaksız." }
  },
  {
    "id": "sf-yb-balik-yeri",
    "category": "sf-yb-balik",
    "title": "Yem ve balığın durduğu yerler",
    "tag": "BALIK YERİ",
    "summary": "Balığı derin göletlerde, sarkan çalı ve batık kütük dibinde, kaya arkasındaki durgun suda arayın; yemi çevreden bulun, fırtınadan önce deneyin.",
    "steps": [
      "Balık saklanacak yer arar: derin göletler, suya sarkan çalı altları, batık kütük, kaya ve su bitkisi çevresi.",
      "Akıntı güçlüyken balık kayaların arkasındaki durgun girdaplarda dinlenir. Yemi girdabın kenarına bırakın.",
      "Fırtınadan önce balık bol yem yer. Fırtınadan sonra su bulanık ve kabarıkken pek yem almaz.",
      "Yem: yer solucanı, çekirge, böcek kurtçuğu, küçük balık, temizlediğiniz balığın iç organı ya da eti.",
      "Tuttuğunuz ilk balığın midesini açın; ne yediğini görün ve benzerini yem yapın.",
      "Kıyıya sessizce yaklaşın, gölgenizi suya düşürmeyin, kıyıda ağır basmayın.",
      "Bir yerde bir süre ısırmıyorsa başka bir göleti ya da girdabı deneyin.",
      "Tuttuğunuz balığı hemen öldürün, gölgede ıslak otla örterek tutun ve kısa sürede temizleyin; sıcakta çabuk bozulur."
    ],
    "art": [
      "sf-yb-balik-saklanma",
      "sf-yb-balik-girdap",
      null,
      "sf-yb-yem-cesitleri",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Fırtına sırasında ve sel suyunda balığa çıkmayın.",
      "Kaygan kayalarda ve dik yarlarda durarak balık tutmayın.",
      "Balığı güneşte bekletmeyin."
    ],
    "keywords": [
      "balık nerede durur",
      "balık yemi ne kullanılır",
      "derede balık nerede",
      "balık tutmak için yer seçimi",
      "doğal balık yemi",
      "solucanla balık",
      "balik yemi bulmak",
      "balık hangi saatte yem alır"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8, balık (https://www.wilderness-survival.net/food-1.php)",
      "ABD Ordusu FM 21-76 — Balık ve avın hazırlanması, bozulma (https://www.wilderness-survival.net/food-5.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM: fırtına öncesi beslenme, fırtına sonrası bulanık suda beslenmeme, akıntıda girdaplar, derin göletler, sarkan çalı ve kütükler; balık sıcakta çabuk bozulur. Mide içeriği ve gölge ipuçları için ikinci kaynak bulunamadı." }
  },
  {
    "id": "sf-yb-balik-sepet",
    "category": "sf-yb-balik",
    "title": "Sepet ve taş setle balık tuzağı",
    "tag": "BALIK TUZAĞI",
    "summary": "Esnek dallardan huni ağızlı bir sepet örün ya da derede taştan V biçimli set yapın; balık dar ağızdan girer, çıkamaz.",
    "note": "Türkiye'de amatör balıkçılıkta sepet, pinter ve düzen (çökertme) tuzakları yasaktır (1380 sayılı Su Ürünleri Kanunu ve amatör avcılık tebliği); bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "İlke: balık geniş bir huniden dar bir ağza girer; içeride dar ağzı bulamaz ve çıkamaz.",
      "Söğüt, fındık ya da kızılcık filizi gibi ince ve esnek dallar toplayın.",
      "Dalları sarmaşık ya da iple bağlayarak koni biçiminde bir huni örün; dar ucunu balığın gireceği kadar açık bırakın.",
      "Daha büyük ikinci bir koni ya da sepet örün. Huniyi bunun ağzına içe doğru yerleştirin, öbür ucunu kapatın.",
      "İçine yem koyun: balık iç organı, solucan, et parçası.",
      "Sepeti balığın geçtiği dar bir yere, ağzı balığın geleceği yöne bakacak biçimde koyun ve taşlarla sabitleyin.",
      "Taş set: derede taşlarla V biçiminde iki kol örün. Kolların birleştiği uçta dar bir geçit bırakın ve sepeti oraya koyun. Set aşılmaz olmak zorunda değil, yalnız balığı yönlendirmeli.",
      "Deniz kıyısında: kıyıdan dışa doğru alçak, yarım ay biçimli bir taş duvar örün. Su çekilince içinde kalan balığı alın. Türkiye kıyılarında gelgit zayıf olduğundan bu yöntem çoğu yerde az işe yarar.",
      "Sepeti günde en az iki kez kontrol edin; bekleyen balık ölür ve bozulur.",
      "İşiniz bitince tuzağı sudan çıkarın; unutulan tuzak boşuna hayvan öldürmeye devam eder."
    ],
    "art": [
      "sf-yb-sepet-huni-ilke",
      null,
      null,
      null,
      null,
      null,
      "sf-yb-tas-set",
      "sf-yb-tas-havuz",
      null,
      null
    ],
    "dont": [
      "Dereyi tamamen kapatmayın; aşağıdaki herkesin suyu ve balığı kesilir.",
      "Akıntılı ve derin suda tuzak kurmaya çalışmayın; ayağınız kayar.",
      "Tuzağı sudan çıkarmadan bölgeden ayrılmayın."
    ],
    "keywords": [
      "balık tuzağı yapımı",
      "sepet tuzak balık",
      "huni sepet balık",
      "taş set balık",
      "dere balık tuzağı",
      "balik sepeti",
      "pinter yapma",
      "derede balık yakalama tuzak"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık tuzakları (https://www.wilderness-survival.net/food-4.php)",
      "Wikipedia — Fish trap, huni ilkesi, savaklar ve taş havuzlar (https://en.wikipedia.org/wiki/Fish_trap)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM huni sepet ve kıyıya açılı alçak taş duvar; Wikipedia: dar ağız geri esneyerek kaçışı önler, söğüt-fındık dalları, yarım ay taş havuzlar, unutulan tuzak; tebliğ md.13/16: pinter, sepet, düzen yasak. Gelgit genliği için sayı verilmedi." }
  },
  {
    "id": "sf-yb-balik-agi",
    "category": "sf-yb-balik",
    "title": "Balık ağı örme",
    "tag": "BALIK AĞI",
    "summary": "İki ağaç arasına bir üst ip gerin, ince ipleri ikişer ikişer düğümleyerek eşkenar dörtgen gözler örün; ağı yüzdürücü ve ağırlıkla suda dik tutun.",
    "note": "Türkiye'de içsularda amatör balıkçılıkta yemlik uzatma ağı dışında her türlü ağ yasaktır; denizde yalnız belirli serpme ve yemlik ağlara izin verilir (1380 sayılı Kanun ve amatör avcılık tebliği). Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "İp hazırlayın: paraşüt ipi ya da uzun, sağlam ince ip. Paraşüt ipinin içindeki ince lifleri çıkarın; gözler bunlarla örülür, dış kılıf üst ip olur.",
      "Üst ipi iki ağaç arasına çalışma yüksekliğinde gerin.",
      "İnce ipleri ikiye katlayıp üst ipe eşit aralıklarla bağlayın. Aralığı ve ip sayısını istediğiniz ağ uzunluğu ve göz büyüklüğüne göre seçin.",
      "Göz büyüklüğü tutacağınız balığa göre seçilir: küçük balık gözden geçer, çok büyük balık başını sokamaz; uygun boydaki balık solungacına kadar girer ve takılır.",
      "İlk sıra: yan yana duran iki komşu ipin birbirine bakan tellerini aynı yükseklikte bir düğümle bağlayın.",
      "Sıralar eşit olsun diye iki ağaç arasına yatay bir kılavuz ip gerin; her sıradan sonra kılavuzu bir göz aşağı indirin.",
      "İkinci sırada öbür komşu telleri bağlayın; böylece eşkenar dörtgen gözler oluşur. Ağ istenen boya gelene kadar sürdürün.",
      "Alt kenara sağlam bir ip geçirip her göze bağlayın; ağ dağılmasın.",
      "Üst ipe kuru ağaç ya da kapalı şişe gibi yüzdürücüler, alt ipe taş ağırlıklar bağlayın. Ağ suda dik bir duvar gibi durmalı.",
      "Ağı göl kıyısından açığa doğru ya da yavaş akıntıya dik gerin, uçlarını kazıklara bağlayın. Sık kontrol edin, işiniz bitince sudan çıkarın."
    ],
    "art": [
      null,
      "sf-yb-ag-ust-ip",
      null,
      null,
      "sf-yb-ag-dugum",
      null,
      null,
      null,
      "sf-yb-ag-suda",
      null
    ],
    "dont": [
      "Ağı gözetimsiz unutmayın; kuşlar, kaplumbağalar ve su samurları takılıp ölür.",
      "Ağı gererken derin ve akıntılı suya girmeyin.",
      "Dereyi baştan başa ağla kapatmayın."
    ],
    "keywords": [
      "balık ağı örme",
      "ağ nasıl örülür",
      "paraşüt ipinden ağ",
      "uzatma ağı yapımı",
      "solungaç ağı",
      "balik agi yapmak",
      "ağ gözü büyüklüğü",
      "el yapımı balık ağı"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Solungaç ağı yapımı (https://www.wilderness-survival.net/food-4.php)",
      "Wikipedia — Gillnetting, göz seçiciliği, yüzdürücü ve ağırlık (https://en.wikipedia.org/wiki/Gillnetting)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM paraşüt ipi iç lifleri, ikişer düğümleme, kılavuz iple sıra eşitleme, alt ip; Wikipedia: üstte yüzdürücü altta ağırlık, göz büyüklüğü balık boyunu seçer, kayıp ağ sorunu; tebliğ: içsularda yalnız yemlik uzatma ağı serbest. Göz ölçüsü için sayı bulunamadı." }
  },
  {
    "id": "sf-yb-kerevit-kurbaga",
    "category": "sf-yb-balik",
    "title": "Kerevit ve kurbağa yakalama",
    "tag": "KEREVİT",
    "summary": "Kereviti ipe bağlı yemle ya da taş altından arkadan tutarak yakalayın, kurbağada yalnız düz ve ıslak derili su kurbağasını alın; ikisini de iyice pişirin.",
    "note": "Türkiye'de kerevit ve kurbağa avcılığı su ürünleri mevzuatıyla düzenlenir; izne, av dönemine ve boy sınırına bağlıdır, amatörlere pinter ve sepet yasaktır (1380 sayılı Su Ürünleri Kanunu). Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Kerevit (tatlı su istakozu) göllerde, göletlerde ve yavaş akan derelerde, taş altlarında ve kıyı oyuklarında yaşar.",
      "İpe yem bağlayın: balık iç organı ya da et parçası. İpi suya sarkıtın. Kerevit yeme kıskaçlarıyla tutunur; yavaşça kıyıya çekin ve altından elinizle ya da kepçeyle alın.",
      "Sığ sudaki taşları yavaşça kaldırın. Kereviti kıskaçlarının gerisinden, sırtından tutun.",
      "Kereviti kaynar suda kabuğu kırmızılaşana ve eti beyaz, opak olana kadar pişirin. Çiğ, tuzlu ya da turşu kerevit akciğere yerleşen bir parazit bulaştırabilir.",
      "Kurbağa: göl ve gölet kenarında, kıyıda bekleyen kurbağaya arkasından yavaşça yaklaşıp kepçe ya da elle yakalayın.",
      "Yalnız ıslak, düz derili, yeşil-kahverengi su kurbağalarını alın. Kuru, siğilli derili, yürüyerek ilerleyen karakurbağasını tutmayın, yemeyin; derisindeki bezler zehirlidir. Parlak renkli kurbağa ve semenderlere dokunmayın.",
      "Kurbağanın derisini soyun; iç organlarını atın, arka bacakları ve gövde etini kullanın. Eti iyice pişirin.",
      "Yakaladıktan sonra ellerinizi yıkayın; gözünüze ve ağzınıza dokunmayın."
    ],
    "art": [
      null,
      "sf-yb-kerevit-ip",
      "sf-yb-kerevit-tutma",
      null,
      null,
      "sf-yb-kurbaga-ayrim",
      null,
      null
    ],
    "dont": [
      "Kereviti çiğ ya da yarı pişmiş yemeyin.",
      "Karakurbağası ve semender yemeyin, çocukların ellemesine izin vermeyin.",
      "Kirli, kokan sudan kerevit ve kurbağa toplamayın.",
      "Canlı kerevit ve kurbağayı başka sulara taşımayın; hastalık yayılır."
    ],
    "keywords": [
      "kerevit yakalama",
      "tatlı su istakozu yakalamak",
      "kurbağa yakalama",
      "kurbağa yenir mi",
      "karakurbağası zehirli mi",
      "kerevit pişirme",
      "kurbaga bacagi",
      "kerevit nasil yakalanir"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Bölüm 8, kabuklular ve kurbağalar (https://www.wilderness-survival.net/food-1.php)",
      "CDC — Paragonimiasis, kerevit pişirme (https://www.cdc.gov/paragonimus/about/index.html)",
      "Wikipedia — Astacus leptodactylus (https://en.wikipedia.org/wiki/Astacus_leptodactylus)",
      "Wikipedia — Common toad, deri bezleri (https://en.wikipedia.org/wiki/Common_toad)",
      "Amatör amaçlı su ürünleri avcılığı tebliği 2024/21 (https://www.lexpera.com.tr/resmi-gazete/metin/6-2-numarali-amator-amacli-su-urunleri-avciliginin-duzenlenmesi-hakkinda-teblig-no-2024-21-32629)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FM 21-76 bölüm 8: kerevit gündüz taş altında, karakurbağasına dokunmayın, parlak renkli ve sırtında X olan kurbağadan kaçının; FoodSafety.gov: kabuklu eti opak-beyaz olana dek. Yazar notu: CDC: çiğ-turşu-tuzlu kerevit paragonimiyaz, en az 63 °C; FM: kereviti iple yemleme, karakurbağası ve parlak renkli kurbağadan kaçınma; Wikipedia: karakurbağası kuru siğilli deri, parotoid bezleri. Kurbağa avının tebliğdeki ayrıntısı doğrulanamadı." }
  },

  // ───────────────────────── İZ SÜRME VE TUZAK ─────────────────────────
  {
    "id": "sf-yb-ayak-izi",
    "category": "sf-yb-iz",
    "title": "İz sürme: ayak izleri",
    "tag": "AYAK İZİ",
    "summary": "Çamur, ıslak kum ve karda izleri okuyun: tavşanda arka ayak önde, köpekgilde dört parmak ve tırnak, toynaklılarda ikiye ayrık iz, ayıda beş parmak ve uzun tırnak.",
    "steps": [
      "İzleri en iyi çamurda, ıslak kumda, karda ve dere kenarında bulursunuz. Sabah ve akşam, alçak güneşte iz gölgeleri daha belirgindir.",
      "Tavşan zıplayarak gider: iki uzun arka ayak izi önde, iki küçük yuvarlak ön ayak izi arkada görünür.",
      "Tilki, köpek ve kurt: dört parmak izi, ortada bir taban yastığı ve parmak uçlarında tırnak izleri. Tilki izi küçük ve dar-ovaldir; kurt izi büyük köpek izi kadar ya da daha büyüktür.",
      "Yaban domuzu, karaca ve geyik ikiye ayrık toynak izi bırakır. Toynağın arkasındaki küçük yan tırnak izleri domuzu karaca ve geyikten ayırmaya yardım eder.",
      "Ayı: geniş taban, beş parmak ve parmakların önünde uzun tırnak izleri. Arka ayak izi uzundur ve insan ayağına benzer; ön ayak izi daha kısadır. Türkiye'de bozayı özellikle Doğu Karadeniz ormanlarında yaygındır.",
      "Tazelik: kenarları keskin, içi nemli, üstüne yaprak ya da yağmur izi düşmemiş iz yenidir. Kenarı dağılmış, içine yaprak dolmuş iz eskidir.",
      "Aynı yerde çok sayıda iz bir hayvan yolunu gösterir. Gözlem ve tuzak için bu yolları not edin.",
      "Taze ayı ya da kurt izi görürseniz geri dönün. Yavru ayı izi varsa anne yakındadır."
    ],
    "art": [
      null,
      "sf-yb-iz-tavsan",
      "sf-yb-iz-kopekgil",
      null,
      "sf-yb-iz-ayi",
      null,
      null,
      null
    ],
    "dont": [
      "Taze ayı izini merakla takip etmeyin.",
      "İz sürerken yolunuzu kaybetmeyin; geçtiğiniz yerleri işaretleyin.",
      "Yaban domuzu izini sık çalılık içinde izlemeyin; yaralı ya da yavrulu domuz saldırabilir."
    ],
    "keywords": [
      "hayvan ayak izi tanıma",
      "iz sürme",
      "tavşan izi",
      "kurt izi köpek izi farkı",
      "domuz izi",
      "ayı izi",
      "karaca izi",
      "ayak izinden hayvan bulma",
      "iz okuma"
    ],
    "sources": [
      "Wikipedia — Animal track, yürüyüş biçimleri ve izler (https://en.wikipedia.org/wiki/Animal_track)",
      "Wikipedia — Brown bear, ayak ölçüleri ve Türkiye (https://en.wikipedia.org/wiki/Brown_bear)",
      "ABD Ordusu FM 21-76 — Tuzak ve ilmekler, iz ve yolları okuma (https://www.wilderness-survival.net/food-2.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: tavşanda arka ayaklar önde; köpekgilde tırnak izi; toynaklılarda yan tırnakların ayırt ediciliği; bozayıda ön ayak ≈%40 küçük, Doğu Karadeniz'de ~5400 ayı. İz ölçüleri için güvenilir sayı bulunamadı, sayısız yazıldı." }
  },
  {
    "id": "sf-yb-diger-izler",
    "category": "sf-yb-iz",
    "title": "İz sürme: dışkı, yol, kemirme ve yatak izleri",
    "tag": "İZ OKUMA",
    "summary": "Hayvan patikalarını, dışkıyı, kemirilmiş kabuğu, eşelenmiş toprağı ve yassılmış ot yataklarını okuyun; suya ve beslenme yerine giden yolları bulun.",
    "steps": [
      "Hayvan yolu: otlar arasında sürekli kullanılmaktan oluşmuş dar patikalar; çit ve çalı altlarında tünel gibi açıklıklar.",
      "Dışkı: tavşanınki küçük, yuvarlak bilyeler halinde kümelenir; karaca ve geyiğinki küçük, uzunca, koyu tanelerdir; tilkininki ince uzun, burgulu ve içinde tüy, kemik parçası olur.",
      "Dışkıya çıplak elle dokunmayın; bir dalla açın. Tilki ve köpek dışkısı insana geçen tehlikeli parazit yumurtaları taşıyabilir.",
      "Kemirme ve sürtme: ağaç kabuğunda diş izleri (tavşan, kemirgen); karaca ve geyiğin boynuz sürttüğü, kabuğu soyulmuş genç gövdeler.",
      "Eşelenmiş, ters dönmüş toprak ve çamur banyosu çukurları yaban domuzunu gösterir.",
      "Yatak yerleri: rüzgâr almayan yerlerde otların yassılmış olduğu oval çukurlar.",
      "Yemek artıkları: kırılmış ceviz ve kozalak, tüy yığını, yarı yenmiş leş.",
      "Yarı yenmiş büyük bir leş görürseniz hemen uzaklaşın; ayı ya da kurt yakında olabilir ve leşi korur.",
      "Bulduklarınızı bir krokiye işleyin. Su, beslenme ve yatak yerleri arasındaki yolların kesiştiği nokta gözlem ve tuzak için en iyi yerdir."
    ],
    "art": [
      "sf-yb-hayvan-yolu",
      "sf-yb-diski-turleri",
      null,
      null,
      "sf-yb-domuz-esinti",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Dışkıyı çıplak elle ellemeyin, koklamak için yüzünüze yaklaştırmayın.",
      "Leşe yaklaşmayın, leşten et almayın.",
      "Domuz eşintisinin yoğun olduğu çalılığa girmeyin."
    ],
    "keywords": [
      "hayvan dışkısı tanıma",
      "hayvan yolu bulma",
      "iz sürme işaretleri",
      "domuz eşintisi",
      "geyik boynuz sürtme izi",
      "tavşan pisliği",
      "hayvan yatağı",
      "kemirme izi ağaç",
      "av izi okuma"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Tuzak ve ilmekler, yollar, dışkı, kemirilmiş bitki (https://www.wilderness-survival.net/food-2.php)",
      "Wikipedia — Wild boar, eşeleme ve çamur banyosu (https://en.wikipedia.org/wiki/Wild_boar)",
      "Wikipedia — Brown bear, leş ve av davranışı (https://en.wikipedia.org/wiki/Brown_bear)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM: yol, iz, dışkı, kemirilmiş-sürtülmüş bitki, beslenme ve su yerleri; Wikipedia: domuzda eşeleme ve çamurlanma, ayının kurt avına el koyması. Dışkı biçimleri ve tilki dışkısı paraziti için ayrı kaynak bulunamadı; uzmana sorulmalı." }
  },
  {
    "id": "sf-yb-hayvan-davranisi",
    "category": "sf-yb-iz",
    "title": "Hayvan davranışı: su ve beslenme saatleri",
    "tag": "HAYVAN SAATLERİ",
    "summary": "Birçok memeli şafakta ve alacakaranlıkta hareketlidir; su kenarlarındaki ve beslenme yerlerindeki yolları bu saatlerde, rüzgârı karşınıza alarak gözleyin.",
    "steps": [
      "Tavşan, karaca, geyik, tilki ve ayı gibi birçok memeli en çok şafakta ve alacakaranlıkta hareketlidir. Gözlemi ve tuzak kontrolünü bu saatlere göre planlayın.",
      "Sıcak havada hayvanlar günün sıcağında dinlenir, serin saatlerde hareket eder.",
      "İnsandan kaçınan hayvanlar insan yakınında etkinliğini geceye kaydırır. Kampınızın hemen yanında av beklemeyin.",
      "Hayvan yolları çoğunlukla suya iner. Dere ve gölet kenarındaki çamurda iz arayın.",
      "Sonbaharda palamut, meyve ve dökülmüş tahıl olan yerler hayvanları toplar.",
      "Rüzgâr yüzünüze eserken yaklaşın; arkanızdan eserse hayvan kokunuzu alır ve kaçar.",
      "Hayvanları uzaktan, gölgede, sessiz ve hareketsiz durarak izleyin.",
      "İlkbaharda yavrulu anneler saldırgan olabilir; yavru görürseniz geri çekilin."
    ],
    "art": [
      "sf-yb-safak-hayvan",
      null,
      null,
      "sf-yb-su-kenari-yol",
      null,
      "sf-yb-ruzgar-yonu",
      null,
      null
    ],
    "dont": [
      "Karanlıkta yalnız başına su kenarında beklemeyin.",
      "Yavrulu hayvana yaklaşmayın.",
      "Hayvanları yemekle kampa alıştırmayın; ayı ve domuz kampa gelir."
    ],
    "keywords": [
      "hayvanlar ne zaman su içer",
      "av hangi saatte çıkar",
      "hayvan davranışı",
      "şafakta hayvan",
      "rüzgar yönü koku av",
      "hayvan gözlemi",
      "tavsan ne zaman cikar",
      "beslenme saatleri hayvan"
    ],
    "sources": [
      "Wikipedia — Crepuscular animal, şafak-alacakaranlık etkinliği (https://en.wikipedia.org/wiki/Crepuscular_animal)",
      "ABD Ordusu FM 21-76 — Tuzak ve ilmekler, beslenme ve su yerleri, koku (https://www.wilderness-survival.net/food-2.php)",
      "Wikipedia — Brown bear, yavrulu dişi saldırıları (https://en.wikipedia.org/wiki/Brown_bear)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: tavşan, geyik, tilki, ayı alacakaranlık hayvanı; sıcakta ısı stresinden kaçınma; insan varlığında geceye kayma; FM koku ve su yerleri; yavrulu dişiler saldırıların çoğunu yapar." }
  },
  {
    "id": "sf-yb-ilmek",
    "category": "sf-yb-iz",
    "title": "Basit ilmek tuzak",
    "tag": "İLMEK TUZAK",
    "summary": "Hayvanın geçtiği kesin bir yola, başın rahatça geçeceği büyüklükte bir tel ilmek asın, sağlam kazığa bağlayın ve yolun iki yanını daraltın.",
    "note": "Türkiye'de 4915 sayılı Kara Avcılığı Kanunu (madde 6) tuzak, kapan ve benzeri araçlarla avlanmayı yasaklar; avlanma ayrıca avcılık belgesi ve izne bağlıdır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    "steps": [
      "Yer seçin: tavşan yolu, çit ya da çalı altındaki geçit gibi hayvanın geçtiğinin kanıtı olan yer. Rastgele kurulan ilmek nadiren av tutar.",
      "Tel kullanın; ip gevşeyip kayabilir. İnce ve esnek tel en iyisidir.",
      "Telin ucunda küçük bir göz yapın, öbür ucunu bu gözden geçirerek kayan bir ilmek oluşturun.",
      "İlmeği yolun üstüne, hayvanın başı rahatça geçecek büyüklükte, baş yüksekliğinde asın. Hayvanın ayağıyla basabileceği kadar alçak olmamalı.",
      "Telin öbür ucunu sağlam çakılmış bir kazığa ya da köke bağlayın.",
      "Yolun iki yanına çalı ve dallarla huni biçiminde engeller koyun. En dar yer hayvanın gövdesinden biraz geniş olsun, daralma yaklaşık bir hayvan boyu uzunlukta sürsün. Engel aşılmaz olmak zorunda değil.",
      "Taze kesilmiş yeşil dal kullanmayın; özsu kokusu hayvanı ürkütür. Parçaları uzakta hazırlayıp getirin, kazdığınız taze toprağı kaldırın.",
      "Kokunuzu azaltın: tuzak parçalarını çürümüş bitkili çamurla sıvayın ya da dumanda tütsüleyin. Kendi idrarınızı kullanmayın.",
      "Birden çok ilmek kurun, hepsinin yerini not edin. Şafakta ve akşamüstü kontrol edin; yakalanan hayvan uzun süre beklemesin.",
      "İşiniz bitince bütün telleri toplayın."
    ],
    "art": [
      null,
      null,
      "sf-yb-ilmek-tel",
      "sf-yb-ilmek-yukseklik",
      null,
      "sf-yb-ilmek-huni",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "İnsanların, köpeklerin ve sürülerin geçtiği yollara ilmek kurmayın.",
      "Yaban domuzu ve ayı yoluna ilmek kurmayın; yakalanan iri hayvan çok tehlikelidir.",
      "Kurduğunuz ilmeği unutmayın, yerini kaydetmeden bırakmayın.",
      "Yakalanmış hayvana çıplak elle dokunmayın; ısırabilir ve hastalık taşıyabilir."
    ],
    "keywords": [
      "ilmek tuzak yapımı",
      "tel tuzak",
      "tavşan tuzağı",
      "basit tuzak kurma",
      "kapan tuzak",
      "snare tuzak",
      "hayatta kalma tuzak",
      "ilmek nasil kurulur"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Tuzak ve ilmekler (https://www.wilderness-survival.net/food-2.php)",
      "4915 sayılı Kara Avcılığı Kanunu, madde 6 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)",
      "CDC — Tularemia prevention, eldiven (https://www.cdc.gov/tularemia/prevention/index.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM: telin üstünlüğü, ilmek başın üstünden geçmeli ve ayakla basılamayacak yükseklikte, kazık, huni engel (gövdeden biraz geniş, bir gövde boyu), yeşil dal ve insan idrarı yasağı, çamur ve dumanla koku gizleme; 4915 m.6 tuzak yasağı. İlmek çapı için sayı bulunamadı." }
  },
  {
    "id": "sf-yb-dusen-tuzak",
    "category": "sf-yb-iz",
    "title": "Düşen taş ve kütük tuzakları",
    "tag": "TAŞ TUZAK",
    "summary": "Ağır bir taşı ya da kütüğü 4 rakamı ya da ipli (Paiute) tetikle dengeleyin; yem bozulunca ağırlık düşer. Kurarken elinizi asla altına sokmayın.",
    "note": "Türkiye'de 4915 sayılı Kara Avcılığı Kanunu (madde 6) tuzak, kapan ve benzeri araçlarla avlanmayı yasaklar. Bu bilgi yalnız gerçek hayatta kalma durumu içindir. Ağır taş tuzağı kuranın elini ezebilir.",
    "steps": [
      "Bu tuzakta ağır bir taş ya da kütük, tetik bozulunca hayvanın üstüne düşer. Ağırlık hayvanı anında öldürecek ya da etkisiz bırakacak kadar olmalı.",
      "Önce kampta tuzağı birkaç kez kurup bozarak alıştırma yapın; tetik açıları hassastır.",
      "Kuru, sert ağaç kullanın. Yeşil, özsulu dal tetikte birbirine yapışır.",
      "4 rakamı tetiği: dik bir direk, yemli yatay çubuk ve eğik kaldıraç çubuğu çentiklerle birbirine geçer ve 4 rakamı gibi durur.",
      "Paiute tetiği: kaldıraç çubuğunun ucuna kısa bir ip ve küçük bir kilit çubuğu bağlanır; kilit çubuğu yem çubuğuna dayanır. Kurması 4 tetiğinden kolaydır.",
      "Taşı ya da kütüğü hayvan yolunun üstüne eğik biçimde tetiğe dayayın. Yemi taşın tam altına koyun.",
      "Kurarken elinizi ve kolunuzu asla taşın altına sokmayın. Yemi uzun bir çubukla yerleştirin.",
      "Tuzağa yaklaşırken dikkatli olun; altta yaralı ve ısırabilecek bir hayvan olabilir.",
      "Tuzakları her gün kontrol edin. Kullanmadığınız tuzağın taşını yere indirin."
    ],
    "art": [
      null,
      null,
      null,
      "sf-yb-tetik-dort",
      null,
      "sf-yb-dusen-tas-kurulu",
      "sf-yb-dusen-el-yasak",
      null,
      null
    ],
    "dont": [
      "Çocukların oynadığı, insanların ve evcil hayvanların geçtiği yere kurmayın.",
      "Tuzak kuruluyken taşın altına uzanmayın, yemi elle düzeltmeyin.",
      "Taşı kurulu bırakarak bölgeden ayrılmayın."
    ],
    "keywords": [
      "düşen taş tuzağı",
      "4 tetik tuzak",
      "paiute tuzak",
      "kütük tuzak",
      "taş kapan",
      "deadfall tuzak",
      "figure 4 tuzak",
      "tas tuzak kurma"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — 4 rakamı ve Paiute düşen ağırlık tuzakları (https://www.wilderness-survival.net/food-2.php)",
      "4915 sayılı Kara Avcılığı Kanunu, madde 6 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)",
      "ABD Ordusu FM 21-76 — Bölüm 8, memelilerin ısırma riski (https://www.wilderness-survival.net/food-1.php)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM: üç çentikli çubuklu 4 tetiği, ip ve kilit çubuklu Paiute, ağırlığın anında öldürmesi, önceden alıştırma, yeşil dal kullanmama; 4915 m.6. Ağırlık ve çubuk ölçüleri için sayı bulunamadı." }
  },
  {
    "id": "sf-yb-tuzak-guvenligi",
    "category": "sf-yb-iz",
    "title": "Tuzak güvenliği: insan ve evcil hayvan riski",
    "tag": "TUZAK GÜVENLİĞİ",
    "summary": "Tuzakları insan ve sürü yollarından uzak kurun, her birini işaretleyip kampa bildirin, arkadan yaklaşın ve iş bitince hepsini sökün.",
    "note": "Türkiye'de 4915 sayılı Kara Avcılığı Kanunu (madde 6) tuzak ve kapanla avlanmayı yasaklar. Bu bilgi yalnız gerçek hayatta kalma durumu içindir; tuzaklar insanları ve evcil hayvanları yaralayabilir.",
    "steps": [
      "Tuzağı köy, patika, su alma yeri, otlak ve çocukların oynadığı yerlerden uzağa kurun.",
      "Köpek, kedi, koyun ve keçinin dolaştığı yerlere ilmek ya da taş tuzak kurmayın.",
      "Her tuzağın yanındaki ağaca renkli bez bağlayın ya da çentik atın. Herkes bu işaretin anlamını bilsin.",
      "Kamptaki herkese tuzakların yerini gösterin; bir krokiye çizin ve sayısını yazın.",
      "Ölümcül tuzaklara her zaman arkadan ve dikkatle yaklaşın.",
      "Yakalanan hayvanı çıplak elle tutmayın; eldiven giyin. Isırabilir ve hastalık taşıyabilir.",
      "Tuzağa evcil hayvan ya da istemediğiniz bir tür takılırsa hemen serbest bırakın.",
      "Çocuklara tuzaklara ve işaretli yerlere yaklaşmamayı öğretin.",
      "Kamptan ayrılırken ya da işiniz bitince bütün tuzakları sayarak sökün. Unutulan tel ve taş yıllarca tehlikeli kalır."
    ],
    "art": [
      null,
      null,
      "sf-yb-tuzak-isaret",
      null,
      "sf-yb-tuzak-arkadan",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Tuzakları işaretsiz bırakmayın.",
      "Kimseye haber vermeden tuzak kurmayın.",
      "Kurulu tuzağı çocukların yanında kontrol etmeyin.",
      "Ölü ya da hasta görünen yakalanmış hayvanı yemeyin."
    ],
    "keywords": [
      "tuzak güvenliği",
      "tuzak işaretleme",
      "tuzağa köpek takıldı",
      "tuzak çocuk tehlike",
      "tuzak sökme",
      "tuzak kontrol etme",
      "tuzak nereye kurulmaz",
      "tuzak guvenligi"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Tuzak ve ilmekler, ölümcül tuzaklara arkadan yaklaşma (https://www.wilderness-survival.net/food-2.php)",
      "CDC — Tularemia prevention, eldiven ve hasta hayvan (https://www.cdc.gov/tularemia/prevention/index.html)",
      "4915 sayılı Kara Avcılığı Kanunu, madde 6 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: bu turda kaynaklar yeniden açılmadı; güvenlik iddiaları iç tutarlılık açısından gözden geçirildi, değişiklik gerekmedi. Yazar notu: FM: ölümcül tuzaklara dikkatle ve arkadan yaklaşın; CDC: hayvanlara eldivenle dokunun, hasta-ölü hayvandan kaçının; 4915 m.6. İşaretleme ve kroki önerileri genel güvenlik uygulaması, ayrı kaynak bulunamadı." }
  },

  // ───────────────────────── AVI İŞLEME ─────────────────────────
  {
    "id": "sf-yb-kucuk-memeli",
    "category": "sf-yb-isleme",
    "title": "Avı temizleme: tavşan ve küçük memeli",
    "tag": "AV TEMİZLEME",
    "summary": "Eldiven ve yüz örtüsüyle çalışın, kanı akıtın, deriyi boğazdan kuyruğa yarın, iç organları çıkarıp karaciğere bakın ve eti en az 71 °C'ye, mümkünse 74 °C'ye dek pişirin.",
    "note": "Uzman gözetimi olmadan hasta görünen ya da ölü bulunan hayvanı işlemeyin. Tavşan ve kemirgenler tularemi bulaştırabilir.",
    "steps": [
      "Hasta görünen, garip davranan, kolay yakalanan ya da ölü bulduğunuz hayvana dokunmayın, yemeyin.",
      "Eldiven giyin; ağzınızı ve burnunuzu bezle örtün. Tavşan ve kemirgen derisi yüzülürken tularemi mikrobu solunabilir.",
      "Kanını akıtın: boğazını kesip başı aşağı gelecek biçimde asın.",
      "Hayvanı sırtüstü yatırın, deriyi boğazdan kuyruğa kadar yarın. Bıçağın ucunu deri altında yukarı doğru tutun; bağırsağı delmeyin.",
      "Varsa koku bezlerini kesip çıkarın; ete değmesin, eti bozar.",
      "Karnı açıp iç organları elle çıkarın, göğüs boşluğunu da boşaltın. İdrar ete bulaşırsa temiz suyla yıkayın.",
      "Karaciğeri ve kalbi kesip bakın. Sağlıklı karaciğer düz, ıslak, koyu kırmızı ya da mordur. Karaciğerde toplu iğne başı büyüklüğünde çok sayıda beyaz nokta tularemi belirtisidir: bütün hayvanı atın, eldivenle gömün. Lekeli ya da kurtlu karaciğerde de emin değilseniz hayvanın hiçbir yerini yemeyin.",
      "Deriyi gövdeden sıyırın; ayakları ve başı kesin.",
      "Eti yıkayın ve iç sıcaklık en az 71 °C'ye ulaşana dek pişirin; tularemiye karşı mümkünse 74 °C. Termometre yoksa iyice haşlayın ya da pişirin: et kemikten kolay ayrılmalı, en kalın yerinde pembe kalmamalı.",
      "Bıçağı, ellerinizi ve çalıştığınız yüzeyi sabunla yıkayın. İç organları kamptan uzağa gömün."
    ],
    "art": [
      null,
      "sf-yb-eldiven-maske",
      null,
      "sf-yb-tavsan-deri-yarma",
      null,
      null,
      "sf-yb-karaciger-kontrol",
      null,
      null,
      null
    ],
    "dont": [
      "Ölü bulunmuş tavşanı yemeyin.",
      "Elinizde yara varken eldivensiz av temizlemeyin.",
      "Tavşan etini az pişmiş yemeyin.",
      "İç organları kamp ve su kaynağı yakınında bırakmayın."
    ],
    "keywords": [
      "tavşan nasıl temizlenir",
      "av temizleme",
      "tavşan derisi yüzme",
      "küçük hayvan temizleme",
      "tavşan iç organ",
      "av eti hazırlama",
      "tavsan temizleme",
      "tularemi tavşan"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık ve avın hazırlanması (https://www.wilderness-survival.net/food-5.php)",
      "CDC — Tularemia prevention (https://www.cdc.gov/tularemia/prevention/index.html)",
      "Wikipedia — Tularemia, deri yüzerken solunum yoluyla bulaş (https://en.wikipedia.org/wiki/Tularemia)",
      "FoodSafety.gov — Safe minimum internal temperatures, tavşan 71 °C (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Missouri Koruma Dairesi — Rabbit safety and health, tularemi karaciğer belirtisi ve 165 °F (https://mdc.mo.gov/hunting-trapping/species/rabbit/rabbit-safety-health)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FoodSafety.gov tavşan ve geyik (yabani ya da çiftlik) 160 °F (71 °C); Missouri Koruma Dairesi tavşanda en az 165 °F (74 °C) ve karaciğerde toplu iğne başı beyaz lezyonlarda hayvanı atma, lateks-nitril eldiven; CDC: tavşan ve kemirgende eldiven, av etini iyice pişirin. Tutucu olan 74 °C hedef olarak eklendi. Önceki not: FM kan akıtma, boğazdan kuyruğa yarma, koku bezleri, iç organ ve idrar, sağlıklı karaciğer tanımı ve hastalıklı karaciğeri atma; CDC eldiven ve iyi pişirme; FoodSafety tavşan 160 °F (71 °C). Karaciğer lekelerinin tularemiyle ilişkisi doğrulanamadı; tutucu kural yazıldı." }
  },
  {
    "id": "sf-yb-kus-temizleme",
    "category": "sf-yb-isleme",
    "title": "Kuş yolma ve temizleme",
    "tag": "KUŞ TEMİZLEME",
    "summary": "Kuşu kuru ya da sıcak suya batırarak yolun, ince tüyleri alevde yakın, kursak ve bağırsakları patlatmadan çıkarın, eti 74 °C'ye dek pişirin.",
    "note": "Uzman gözetimi olmadan hasta ya da ölü bulunmuş kuşu işlemeyin; yabani kuşlar kuş gribi taşıyabilir.",
    "steps": [
      "Kuşu kesip kanını akıtın; başı aşağı gelecek biçimde asın.",
      "Kuru yolma: kuş henüz sıcakken tüyleri küçük tutamlar halinde çekin. Bir elinizle deriyi gererek yırtılmasını önleyin.",
      "Haşlayarak yolma: suyu kaynatın, ateşten alıp biraz bekletin; fokurdamayan ama buharı tüten suya kuşu kısa süre batırın. Bir kanat tüyünü çekin: kolayca çıkıyorsa hazırdır. Fazla haşlanan deri yırtılır.",
      "Su kuşları ve yaşlı kuşlar zor yolunur; derisini yüzmek daha hızlıdır ama besin değerinin bir kısmı gider.",
      "Kalan ince tüyleri kuşu alevin üstünde kısa süre gezdirerek yakın.",
      "Ayakları eklem yerinden, başı boyundan kesin.",
      "Boyundaki kursağı (yem kesesi) dikkatle çıkarın.",
      "Kuyruk altındaki deliğin çevresini kesin, iç organları elle çekin. Bağırsağı ve karaciğere yapışık yeşil safra kesesini patlatmayın.",
      "Taşlığı ikiye kesin, içindeki taş ve kumu atın, sert iç zarını soyun. Kalbi ve karaciğeri ayırın; bunlar yenir.",
      "Leş yiyen kuşları (karga gibi) en az 20 dakika kaynatın. Bütün kuşları ve iç organlarını iç sıcaklık 74 °C'ye ulaşana dek, içinde pembe kalmayana kadar pişirin."
    ],
    "art": [
      null,
      null,
      "sf-yb-kus-haslama",
      null,
      "sf-yb-kus-alev",
      null,
      null,
      "sf-yb-safra-kesesi",
      null,
      null
    ],
    "dont": [
      "Ölü bulduğunuz ya da hasta görünen kuşa dokunmayın, yemeyin; kuş gribi taşıyabilir. Kuşu mümkünse eldivenle temizleyin, sonra ellerinizi sabunla yıkayın.",
      "Kuşu kaynayan suda bekletip pişirmeyin; deri parçalanır ve tüy çıkmaz.",
      "Bağırsak içeriği ete bulaşırsa o bölümü yıkamadan pişirmeyin.",
      "Tavuk ve kuş etini az pişmiş yemeyin."
    ],
    "keywords": [
      "kuş nasıl yolunur",
      "tavuk yolma",
      "kuş temizleme",
      "kuş tüyü yolma sıcak su",
      "taşlık temizleme",
      "yabani kuş eti",
      "kus temizleme",
      "kuş iç organları çıkarma"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık ve avın hazırlanması, kuşlar (https://www.wilderness-survival.net/food-5.php)",
      "FoodSafety.gov — Safe minimum internal temperatures, kanatlılar 74 °C (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Wikipedia — Poultry processing, iç organ çıkarma ve bulaşma (https://en.wikipedia.org/wiki/Poultry_processing)",
      "WHO — Influenza (avian and other zoonotic), hasta-ölü yabani kuştan kaçınma, kesim ve işlemede bulaş (https://www.who.int/news-room/fact-sheets/detail/influenza-(avian-and-other-zoonotic))"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FoodSafety.gov kanatlılar ve sakatat 165 °F (74 °C) teyit edildi; WHO: hasta-ölü yabani kuşla temastan kaçının, kesim ve işleme bulaş yolu, el hijyeni; kuş gribi uyarısı eklendi. Önceki not: FM yolma ya da yüzme, kalp-karaciğer-kursak, ayakları kesme, leşçil kuşları en az 20 dk kaynatma; FoodSafety kanatlılar ve sakatat 165 °F (74 °C). Haşlama suyu sıcaklığı için güvenilir sayı bulunamadı; tüy çekme testiyle yazıldı." }
  },
  {
    "id": "sf-yb-balik-temizleme",
    "category": "sf-yb-isleme",
    "title": "Balık temizleme ve kılçık",
    "tag": "BALIK TEMİZLEME",
    "summary": "Balığı hemen temizleyin; bozulma belirtisi varsa atın, solungaç ve kan damarını çıkarın, karnını boşaltın ve tatlı su balığını iyice pişirin.",
    "note": "Uzman gözetimi olmadan tanımadığınız deniz balığını yemeyin; Akdeniz ve Ege kıyılarındaki balon balığının zehri pişirmekle yok olmaz ve öldürür.",
    "steps": [
      "Balığı yakaladıktan sonra hemen temizleyin; sıcak günlerde çok çabuk bozulur.",
      "Bozulma belirtileri: çökük göz, garip koku, pembe-kırmızı yerine soluk solungaç, soluk gri pullar, parmakla bastırınca kalan çukur, yapış yapış gövde, keskin ya da biberimsi tat. Böyle balığı yemeyin.",
      "Pulları kuyruktan başa doğru bıçağın sırtıyla kazıyın ya da derisini yüzün.",
      "Solungaçları ve omurga boyunca uzanan koyu kan damarını çıkarın.",
      "10 cm'den uzun balıkların karnını kuyruk altındaki delikten başa doğru yarıp iç organlarını çıkarın.",
      "Karın içini temiz suyla yıkayın.",
      "Fileto: solungaç arkasından omurgaya kadar kesin, bıçağı omurga boyunca kuyruğa kaydırın. Kaburga kılçıklarını ayrı bir kesişle çıkarın.",
      "Küçük balıkları bütün pişirin; pişince et kılçıktan kolay ayrılır ve omurga kılçıklarla birlikte tek parça çekilir.",
      "Bütün tatlı su balıklarını iyice pişirin: iç sıcaklık 63 °C ya da et opaklaşıp çatalla kolay ayrılana kadar. Çiğ tatlı su balığı parazit taşır.",
      "Balık atıklarını kamptan ve sudan uzağa gömün ya da yem olarak kullanın."
    ],
    "art": [
      null,
      "sf-yb-balik-bozulma",
      null,
      null,
      "sf-yb-balik-karin",
      null,
      "sf-yb-balik-fileto",
      null,
      null,
      null
    ],
    "dont": [
      "Tatlı su balığını çiğ, az pişmiş ya da yalnız tuzlayarak yemeyin.",
      "Balon balığını (Akdeniz ve Ege'de, karnını şişiren, gagamsı dişli, gümüş çizgili balık) asla yemeyin, çıplak elle tutmayın; zehri pişirmekle yok olmaz ve öldürür.",
      "Bozulma belirtisi gösteren balığı pişirip kurtarmaya çalışmayın.",
      "Balığı güneşte bekletmeyin.",
      "Atıkları içme suyu aldığınız yere atmayın."
    ],
    "keywords": [
      "balık nasıl temizlenir",
      "balık temizleme",
      "balık bozuk mu anlama",
      "balık fileto çıkarma",
      "kılçık ayıklama",
      "balık pulu kazıma",
      "balik temizleme",
      "tatlı su balığı pişirme"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık ve avın hazırlanması (https://www.wilderness-survival.net/food-5.php)",
      "ABD Ordusu FM 21-76 — Bölüm 8, tatlı su balıklarını pişirme (https://www.wilderness-survival.net/food-1.php)",
      "FoodSafety.gov — Safe minimum internal temperatures, balık 63 °C (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Wikipedia — Lagocephalus sceleratus, Türkiye kıyıları ve ölümcül zehirlenmeler (https://en.wikipedia.org/wiki/Lagocephalus_sceleratus)",
      "BirGün — İstilacı balon balıkları, tetrodotoksin pişirmeyle yok olmaz (https://www.birgun.net/haber/istilaci-balon-baliklari-yeni-bir-zehirli-deniz-yirticisi-mi-581994)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FoodSafety.gov balık 145 °F (63 °C) ya da opak ve çatalla ayrılan et; FM 21-76: tatlı su balıklarını parazite karşı pişirin. Balon balığı uyarısı eklendi (Türkiye'de ölümler, zehir ısıya dayanıklı). Önceki not: FM bozulma belirtileri, solungaç ve omurga kan damarı, 10 cm'den uzun balığı ayıklama, tatlı su balıklarını parazite karşı pişirme; FoodSafety 145 °F (63 °C) ya da opak ve çatalla ayrılan et. Fileto tekniği genel bilgi." }
  },
  {
    "id": "sf-yb-ic-organ",
    "category": "sf-yb-isleme",
    "title": "İç organlar: hangileri yenir, hastalık belirtileri",
    "tag": "İÇ ORGAN",
    "summary": "Karaciğer, kalp, böbrek ve taşlık yenir; kesip içine bakın, leke, kist, kurt ya da irin varsa organı atın ve hepsini tam pişirin.",
    "note": "Uzman gözetimi olmadan hastalık belirtisi gösteren organı ya da hayvanı yemeyin; şüphede atın.",
    "steps": [
      "Yenebilen organlar: karaciğer, kalp, böbrek ve kuşların taşlığı. Hepsi iyi besin verir.",
      "Sağlıklı karaciğer düz, ıslak ve koyu kırmızı ya da mordur.",
      "Kalbi ve karaciğeri kesip içine bakın. Kurt, sulu kese (kist), leke ya da irin varsa o organı atın. Kas eti yenebilir ama çok iyi pişirin.",
      "Karaciğer ya da akciğerde içi sıvı dolu kese (kist hidatik) görürseniz organı yemeyin, köpeklere ve kedilere vermeyin; köpeklerin kazıp çıkaramayacağı derinlikte gömün ya da yakın. Köpek bu organı yiyince kurtlanır, dışkısındaki yumurtalar suya, sebzeye ve ellere bulaşıp insanda karaciğer ve akciğer kisti yapar. Köpeklere dokunduktan sonra ve yemekten önce ellerinizi yıkayın.",
      "Safra kesesini (karaciğere yapışık yeşil kese) patlatmadan kesip çıkarın. Patlarsa değdiği eti kesip atın; çok acıdır.",
      "Bağırsak, mide ve idrar kesesinin içeriği ete değmemeli. Değerse o yeri yıkayın ya da kesip atın.",
      "Akciğer ve dalakta yaygın lekeler, büyümüş bezeler ya da irin varsa bütün hayvandan şüphelenin; emin değilseniz hiç yemeyin.",
      "İç organları her zaman tam pişirin: içi pembe kalmamalı. Kuş iç organlarını 74 °C'ye kadar pişirin.",
      "Atılacak organları kamptan ve sudan uzağa gömün."
    ],
    "art": [
      null,
      "sf-yb-karaciger-kontrol",
      null,
      "sf-yb-organ-kist",
      "sf-yb-safra-kesesi",
      null,
      null,
      null,
      null
    ],
    "dont": [
      "Lekeli, kistli ya da irinli organı yemeyin, pişirip kurtarmaya çalışmayın.",
      "Ham iç organları köpeklere ve kedilere vermeyin; kistli organı açıkta bırakmayın.",
      "İç organları az pişmiş yemeyin.",
      "Ölü bulunmuş hayvanın organlarını hiç kullanmayın."
    ],
    "keywords": [
      "hangi iç organlar yenir",
      "ciğer yenir mi av",
      "karaciğer hastalıklı mı nasıl anlaşılır",
      "sakatat av hayvanı",
      "karaciğerde kist",
      "safra kesesi çıkarma",
      "ic organ yemek",
      "av hayvanı ciğer lekeli"
    ],
    "sources": [
      "ABD Ordusu FM 21-76 — Balık ve avın hazırlanması, karaciğer kontrolü (https://www.wilderness-survival.net/food-5.php)",
      "WOAH — Anthrax, hastalık belirtileri ve büyümüş bezeler (https://www.woah.org/en/disease/anthrax/)",
      "FoodSafety.gov — Safe minimum internal temperatures, sakatat (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "WHO — Echinococcosis fact sheet, köpek-koyun döngüsü ve organ imhası (https://www.who.int/news-room/fact-sheets/detail/echinococcosis)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: WHO: kist hidatikte köpek enfekte organı yiyerek kurtlanır, insan köpek dışkısındaki yumurtayla kirlenmiş yiyecek, su, toprak ya da temasla bulaşır; kistler en çok karaciğer ve akciğerde; enfekte sakatatın uygun imhası döngüyü kırar. Gömme derinliği için sayı yok. Safra kesesi adımı ikinci kaynaksız. Önceki not: FM: kalp ve karaciğeri açıp parazit arayın, sağlıklı karaciğer tanımı, hastalıklı karaciğeri atın, kas eti yenebilir; WOAH büyümüş bezeler; FoodSafety sakatat 74 °C. Kist hidatik döngüsü ve safra kesesi için ayrı kaynak bulunamadı; uzmana sorulmalı." }
  },
  {
    "id": "sf-yb-et-hastalik",
    "category": "sf-yb-isleme",
    "title": "Hayvan hastalıkları ve et güvenliği: şarbon, tularemi, trişin",
    "tag": "ET GÜVENLİĞİ",
    "summary": "Ölü bulunan hayvanı asla açmayın ve yemeyin; tavşanı eldivenle işleyin, bütün av etini (yaban domuzu ve ayı dahil) en az 71 °C'ye dek pişirin; dondurma, tuz, tütsü ve kuruluğa güvenmeyin.",
    "note": "Uzman gözetimi olmadan ölü bulunmuş ya da hasta görünen hayvanın etini yemeyin; şarbon ve tularemi ölümcül olabilir.",
    "steps": [
      "Ölü bulduğunuz hayvanı asla yemeyin, açmayın. Aniden ölmüş, burun, ağız ya da anüsünden pıhtılaşmamış kan sızan ve ölünce kaskatı kesilmeyen hayvan şarbon olabilir.",
      "Şarbondan şüphelendiğiniz leşi kesmeyin: hava alan mikrop dayanıklı sporlara dönüşür ve toprağı yıllarca bulaştırır. Leşi yakın ya da derin gömün; o alana hayvan sokmayın.",
      "Tularemi tavşan ve kemirgenlerden, kene ve at sineğinden geçer. Uyuşuk, kolay yakalanan tavşana dokunmayın. Temizlerken eldiven ve yüz örtüsü kullanın; karaciğerde çok sayıda toplu iğne başı beyaz nokta varsa hayvanı atın. Tavşan etini en az 71 °C'ye, mümkünse 74 °C'ye dek pişirin.",
      "Tularemi suyla da bulaşır. Dere, gölet ve kuyu suyunu arıtmadan içmeyin; ölü kemirgen bulunan kaynaktan hiç su almayın.",
      "Trişin kurdu yaban domuzu, domuz ve ayı etinde bulunabilir. Bu etleri iç sıcaklık en az 71 °C'ye ulaşana dek pişirin. Ayı ve yaban domuzu eti koyu renklidir; renge güvenmeyin, termometre yoksa ince doğrayıp uzun süre haşlayın.",
      "Yabani hayvan etinde dondurma, tuzlama, kurutma ve tütsüleme trişini güvenilir biçimde öldürmez; yabani hayvandaki bazı trişin türleri aylarca donmuş kalsa da ölmez. Yaban domuzu ve ayıdan çiğ sucuk, pastırma ya da kurutulmuş et yapmayın; önce tam pişirin.",
      "Termometre yoksa eti en kalın yerinden kesin: pembe ya da kanlı yer kalmamalı, et lif lif ayrılmalı, suyu berrak akmalı. Kalın parça yerine küçük parçalar pişirin; şüphede daha uzun pişirin.",
      "İç organlarda leke, kist ya da irin görürseniz o hayvandan şüphelenin; emin değilseniz yemeyin.",
      "Hayvan işledikten ya da yedikten sonraki günlerde ateş, deride kapanmayan yara, bez şişmesi ya da şiddetli kas ağrısı olursa sağlık kuruluşuna başvurun ve hayvanı anlatın."
    ],
    "art": [
      "sf-yb-sarbon-les",
      null,
      null,
      null,
      "sf-yb-et-pisirme-kontrol",
      "sf-yb-trisin-yasak",
      null,
      null,
      null
    ],
    "dont": [
      "Ölü bulunmuş hayvanın etini, derisini ya da yününü almayın.",
      "Yaban domuzu ve ayı etini az pişmiş yemeyin.",
      "Etin tadına pişmeden bakmayın.",
      "Şarbon şüpheli leşi açmayın, köpeklerin yemesine izin vermeyin."
    ],
    "keywords": [
      "şarbon belirtileri hayvan",
      "ölü hayvan eti yenir mi",
      "tularemi tavşan",
      "trişin yaban domuzu",
      "domuz eti trişin",
      "av eti güvenliği",
      "yaban domuzu eti pişirme",
      "sarbon les",
      "av hastalıkları"
    ],
    "sources": [
      "WOAH — Anthrax, leş belirtileri ve leşi açmama (https://www.woah.org/en/disease/anthrax/)",
      "CDC — Tularemia prevention (https://www.cdc.gov/tularemia/prevention/index.html)",
      "CDC — Trichinellosis prevention (https://www.cdc.gov/trichinellosis/prevention/index.html)",
      "FoodSafety.gov — Safe minimum internal temperatures, yabani av 71 °C (https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)",
      "Wikipedia — Wild boar, Trichinella ve Türkiye (https://en.wikipedia.org/wiki/Wild_boar)",
      "CDC MMWR 2004 — Trichinellosis associated with bear meat, yabani av 71 °C ve donmaya dayanıklı T. nativa (https://www.cdc.gov/mmwr/preview/mmwrhtml/mm5327a2.htm)",
      "Missouri Koruma Dairesi — Bear: properly cook all game, 160 °F, tütsü-dondurma-tuzlama yetmez (https://mdc.mo.gov/hunting-trapping/species/bear/bear-properly-cook-all-game)",
      "Missouri Koruma Dairesi — Rabbit safety and health, tularemi karaciğer belirtisi ve 165 °F (https://mdc.mo.gov/hunting-trapping/species/rabbit/rabbit-safety-health)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: CDC MMWR 2004: trişine karşı et, özellikle yabani av, 160 °F (71 °C); ayı eti koyu olduğundan renk güvenilmez; T. nativa aylarca-yıllarca donmaya dayanır. CDC trişin sayfası: tuzlama, kurutma, tütsüleme, mikrodalga tek başına güvenilir değil; yabani avda dondurma yetmeyebilir. FoodSafety.gov yaban domuzunu listelemiyor; CDC ve MDC'nin yabani av değeri 71 °C uygulandı. CDC tularemi: eldiven, av etini iyice pişirin, arıtılmamış yüzey suyu içmeyin, kene. Önceki not: WOAH ani ölüm, deliklerden pıhtılaşmamış kan, ölü katılığı yok, açınca spor oluşumu; CDC tularemide eldiven, iyi pişirme, arıtılmamış su; CDC trişinde yabani avda dondurmaya, tuzlama-kurutma-tütsüye güvenmeme; FoodSafety geyik-tavşan 160 °F. Yaban domuzu için ayrı sıcaklık verilmemiş; 71 °C uygulandı." }
  }
];
