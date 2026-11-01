// Sıfırdan paketi: Tarım ve hayvancılık (KATALOG bölüm 3, maddeler 61–86)
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-tarim-hayvancilik',
  name: 'Sıfırdan: Tarım ve hayvancılık',
  desc: 'Toprağı tanımaktan tohum saklamaya, Türkiye bölgelerine göre ekim takviminden buğday harmanına, meyve ağacı aşılamadan tavuk, keçi ve arı bakımına kadar kendi yiyeceğini üretmenin temel rehberleri.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sf-th-toprak-tohum', title: 'Toprak ve tohum', hint: 'Toprak testi, tohum saklama, fide, kompost, gübre', art: 'sf-th-kapak-toprak-tohum', color: '#a3a380', order: 120 },
  { id: 'sf-th-bahce-tarla', title: 'Bahçe ve tarla', hint: 'Ekim takvimi, patates, buğday, sulama, sera, zararlılar', art: 'sf-th-kapak-bahce-tarla', color: '#84cc16', order: 121 },
  { id: 'sf-th-meyve', title: 'Meyve ağaçları', hint: 'Fidan dikimi, aşılama, budama', art: 'sf-th-kapak-meyve', color: '#f59e0b', order: 122 },
  { id: 'sf-th-hayvan', title: 'Hayvancılık ve arıcılık', hint: 'Tavuk, tavşan, keçi-koyun, arı, ot, balık havuzu', art: 'sf-th-kapak-hayvan', color: '#d97706', order: 123 },
];


export const GUIDES: PackGuide[] = [
  // ───────────────────────── Toprak ve tohum ─────────────────────────
  {
    "id": "sf-th-toprak-tanima",
    "category": "sf-th-toprak-tohum",
    "title": "Toprağını tanı: kum, kil ve humus testi",
    "tag": "TOPRAK",
    "summary": "Bir avuç nemli toprağı sıkın, şerit yapın ve kavanozda çöktürün; kumlu mu killi mi olduğunu anlayıp ekime göre iyileştirin.",
    "steps": [
      "Bahçenin 3–4 ayrı yerinden 15–20 cm derinden birer avuç toprak alın. Taş, kök ve çöpü ayıklayıp karıştırın.",
      "Avuç testi: toprağı hafif nemlendirip sıkın. Hafif baskıyla dağılıyorsa kumlu, top olup kolayca şekil değiştiriyorsa tınlı, kırılmaya direniyorsa killi topraktır.",
      "Parmak testi: bir tutamı başparmakla işaret parmağı arasında ovun. Kum pürüzlü ve hışırtılı, mil kaygan, kil yapışkan hissettirir.",
      "Şerit testi: nemli toprağı başparmakla işaret parmağının üstünden şerit gibi itin. Şerit 2,5 cm'den kısa koparsa tınlı, 2,5–5 cm ise killi-tınlı, 5 cm'den uzunsa killi topraktır.",
      "Kavanoz testi: düz kenarlı bir kavanozun üçte birine elenmiş toprak koyun, kalanını suyla doldurun, çamur gibi olana dek kuvvetle çalkalayın ve düz bir yere bırakın.",
      "1 dakika sonra dipteki kum katının üstünü kavanozun dışına işaretleyin. 2 saat sonra mil katını, 48 saat sonra kil katını işaretleyin.",
      "Her katın kalınlığını toplam kalınlığa bölüp 100 ile çarpın. Kil yüzde 20'yi geçiyorsa toprak killi davranır; kum yüzde 45–60'ın üstündeyse kumlu davranır.",
      "Suyun üstünde yüzen koyu kırıntılar ve toprağın koyu renk, orman gibi kokusu humusu gösterir. Açık renkli, kokusuz toprak organik maddece fakirdir.",
      "Killi toprağa bol kompost ve iyi yanmış gübre karıştırın; kumlu toprağa da kompost katıp yüzeyi samanla örtün ki su tutsun."
    ],
    "art": [null, null, null, "sf-th-toprak-serit", "sf-th-toprak-kavanoz", "sf-th-toprak-kavanoz-katlar", null, null, null],
    "dont": [
      "Toprağı ıslakken kazıp çiğnemeyin; özellikle killi toprak taş gibi sıkışır ve yıllarca düzelmez.",
      "Fabrika, akaryakıt, çöp dökülmüş ya da yanmış bina yakınındaki toprakta yenecek ürün yetiştirmeyin; ağır metal ve yakıt kalıntısı bitkiye geçer."
    ],
    "keywords": ["toprak testi", "toprak nasıl anlaşılır", "killi toprak mı kumlu mu", "kavanoz testi toprak", "toprak tanıma", "toprak yapısı", "humus nedir", "toprak verimli mi", "bahce topragi testi", "toprak cesidi", "şerit testi toprak", "tarla toprağı nasıl"],
    "sources": [
      "Clemson Üniv. HGIC — Soil texture analysis: the jar test (https://hgic.clemson.edu/factsheet/soil-texture-analysis-the-jar-test/)",
      "Colorado State Üniv. Extension — Estimating soil texture (https://extension.colostate.edu/resource/estimating-soil-texture-sandy-loamy-or-clayey/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: kavanoz testi oranı ve süreleri (1/3 toprak; 1 dk, 2 sa, 48 sa) Clemson sayfası yeniden açılarak teyit edildi. CSU şerit ve yüzde eşikleri yazar kaydına dayanır (sayfa bu turda yeniden açılmadı)." }
  },
  {
    "id": "sf-th-tohum-saklama",
    "category": "sf-th-toprak-tohum",
    "title": "Tohum saklama ve çimlenme testi",
    "tag": "TOHUM",
    "summary": "Tohumu tam kurutup serin, karanlık ve kuru yerde ağzı kapalı kapta saklayın; ekimden önce 10 tohumla çimlenme testi yapın.",
    "steps": [
      "Tohumu saklamadan önce tamamen kurutun: tek kat yayıp gölge ve havadar yerde birkaç gün bekletin. İyi kurumuş tohum kırılır, ezilmez.",
      "Her tohumu türü, çeşidi ve tarihi yazılı ayrı kâğıt zarfa koyun.",
      "Zarfları cam kavanoza koyup kapağını sıkıca kapatın. Kuru tutmak için içine bezden küçük bir torba içinde fırınlanmış kuru pirinç koyabilirsiniz.",
      "Kavanozu serin, karanlık ve kuru yerde tutun: en iyisi 0–5 °C, en fazla 15 °C. Nemin yüzde 50'nin altında olması ömrü uzatır.",
      "Soğuk yerden çıkardığınız kavanozu açmadan önce oda sıcaklığına gelmesini bekleyin; yoksa içi terler ve tohum nemlenir.",
      "Ekimden 2–3 hafta önce çimlenme testi yapın: 10 tohumu nemli bir bezin ya da kâğıt havlunun üstüne dizin, katlayın, kurumasın diye naylona sarın.",
      "Paketi ılık bir yerde tutun; ışık gerekmez. Türün çimlenme süresi kadar (çoğu sebzede 7–15 gün) bekleyin, her gün nemini kontrol edin.",
      "Çimlenenleri sayın: 10'da 10 ise normal ekin; 7–9 ise tohumu biraz sık ekin; 6 ve altıysa o tohuma güvenmeyin, varsa daha taze tohum kullanın.",
      "Saklama ömrü kabaca: soğan ve maydanoz 1 yıl; mısır ve biber 2; fasulye, bezelye, havuç, ıspanak 3; domates, kabak, lahana, pancar 4; hıyar ve turp 5; marul 6 yıl."
    ],
    "art": [null, null, "sf-th-tohum-kavanoz", null, null, "sf-th-cimlenme-testi", null, "sf-th-cimlenme-sayim", null],
    "dont": [
      "Nemli tohumu kapalı kaba koymayın; küflenir ya da kendiliğinden çimlenip ölür.",
      "İlaçlı (renkli boyalı) tohumluğu yemeyin, hayvana yedirmeyin; zehirlidir."
    ],
    "keywords": ["tohum saklama", "tohum nasıl saklanır", "çimlenme testi", "tohum çimleniyor mu", "eski tohum ekilir mi", "tohum ömrü", "tohum kavanoz", "cimlenme orani", "tohum kurutma", "tohum bozuldu mu", "tohumluk saklama"],
    "sources": [
      "Illinois Üniv. Extension — Seed viability (https://extension.illinois.edu/sites/default/files/infosheet_seed_viability.pdf)",
      "Idaho Üniv. Extension — Seed saving for beginners (https://www.uidaho.edu/-/media/UIdaho-Responsive/Files/Extension/county/Kootenai/gardening/seed-saving-for-beginners.pdf)",
      "TAGEM Alata BAE — Sebzelerde fide yetiştiriciliği (çimlenme 7–15 gün)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları yeniden açılmadı; sayılar Illinois/Idaho kaydına dayanır. Kaynakta olmayan odun külüyle nem çekme önerisi çıkarıldı (alkali, etkisi belgesiz)." }
  },
  {
    "id": "sf-th-atalik-tohum",
    "category": "sf-th-toprak-tohum",
    "title": "Atalık tohum: kendi tohumunu üretmek",
    "tag": "TOHUM",
    "summary": "Hibrit olmayan, yerel çeşitlerden en sağlıklı birkaç bitkiyi seçin, tohumunu tam olgunlukta alıp temizleyin, kurutun ve saklayın.",
    "steps": [
      "Yalnızca atalık (yerel, açık tozlanan) çeşitlerden tohum alın. Paketinde 'F1' yazan hibrit çeşitlerin tohumu annesine benzemez.",
      "Kolaydan başlayın: fasulye, bezelye, marul ve domates çoğunlukla kendi kendini tozlar, az bitkiden bile iyi tohum verir.",
      "Fasulye çeşitlerini birbirinden en az 3–6 m, domates çeşitlerini 3–15 m uzak dikin; karışmasınlar.",
      "Kabak, mısır ve hıyar başka çeşitlerle kolayca karışır: tohum alacaksanız o türden tek çeşit dikin ya da çiçekleri elle tozlayıp tülle kapatın.",
      "Tohum için en sağlıklı, hastalıksız ve en iyi ürün veren birkaç bitkiyi seçip iple işaretleyin. Mümkün olduğunca çok bitkiden alın ki çeşit zayıflamasın.",
      "Fasulye ve bezelyede kabuk bitkinin üstünde kuruyup hışırdayınca toplayın, kabukları ezip tohumu ayıklayın, rüzgârda savurarak çöpünü atın.",
      "Domateste tam olgun meyvenin tohumlu suyunu bir kaba sıkın, biraz su ekleyin ve ılık yerde 3–6 gün bekletin; üstünde küf tabakası oluşunca dibe çöken iyi tohumları alın, yıkayın.",
      "Yaş tohumları tabağa tek kat yayıp gölgede tam kuruyana dek bekletin, sonra adı ve tarihi yazılı zarfa koyup saklayın."
    ],
    "art": [null, null, null, "sf-th-elle-tozlama", "sf-th-tohum-bitki-isaret", null, "sf-th-domates-tohum-mayalama", null],
    "dont": [
      "Hastalıklı ya da erken tohuma kaçan (çabuk sapa kalkan) bitkiden tohum almayın; bu kusur sonraki yıla geçer.",
      "Tohumu güneşte ya da sobanın üstünde hızla kurutmayın; ısı tohumu öldürür."
    ],
    "keywords": ["atalık tohum", "yerel tohum", "kendi tohumunu üret", "tohum nasıl alınır", "domates tohumu çıkarma", "fasulye tohumu saklama", "hibrit tohum", "f1 tohum", "ata tohumu", "tohumluk ayırma", "tohum alma"],
    "sources": [
      "Idaho Üniv. Extension — Seed saving for beginners (https://www.uidaho.edu/-/media/UIdaho-Responsive/Files/Extension/county/Kootenai/gardening/seed-saving-for-beginners.pdf)",
      "Illinois Üniv. Extension — How to save seeds (https://extension.illinois.edu/sites/default/files/how_to_save_seeds_062021.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları (Idaho, Illinois/SSE) yeniden açılmadı; güvenlik açısından kritik sayı yok. Teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-fide",
    "category": "sf-th-toprak-tohum",
    "title": "Fide yetiştirme",
    "tag": "FİDE",
    "summary": "Domates, biber, patlıcan gibi sıcak sever sebzeleri temiz harçta ılık yerde çimlendirin, 5–6 yapraklı olunca 7–10 gün dışarıya alıştırıp dikin.",
    "steps": [
      "Harç hazırlayın: elenmiş olgun kompost ile ince kum ya da bahçe toprağını yarı yarıya karıştırın. Hastalık taşımaması için ıslak harcı tencerede buharda iyice ısıtıp soğutabilirsiniz.",
      "Delikli kaplara (kesik pet şişe, teneke, yumurta viyolü) harcı doldurun, bastırmadan düzleyin ve önceden sulayın.",
      "Tohumu kendi kalınlığının 2–3 katı derine ekin; çok ince tohumları yalnızca üstüne serpip hafifçe bastırın. Sıralar arası 13–15 cm, sıra üzeri 1–1,5 cm olsun.",
      "Kapları ılık bir yere koyun, üstünü cam ya da naylonla örtün. Çimlenme 7–15 gün sürer; ilk filizi görünce örtüyü kaldırın.",
      "Fideleri en aydınlık pencereye ya da güneşli korunaklı yere taşıyın. Işık az olursa fideler uzun ince ve soluk olur.",
      "Toprağı nemli tutun ama çamur yapmayın; dipten, kabın altına konan tabaktan sulayın. Fide dibinden çürüyüp devriliyorsa sulamayı azaltın ve havalandırın.",
      "İlk gerçek yapraklar çıkınca sık fideleri seyreltin ya da tek tek daha büyük kaplara aktarın.",
      "Dikimden 7–10 gün önce alıştırma yapın: ilk gün 2–3 saat korunaklı gölgeye, her gün birkaç saat daha uzun ve güneşli yere çıkarın.",
      "Domates fidesini 5–6 gerçek yapraklıyken, toprak ve hava 12–15 °C'yi bulunca dikin. Domatesi gövdesinin üçte ikisi toprağa girecek kadar derin dikebilirsiniz."
    ],
    "art": [null, null, "sf-th-fide-ekim-derinlik", null, null, "sf-th-fide-dipten-sulama", null, null, "sf-th-fide-derin-dikim"],
    "dont": [
      "Sıcak sever fideleri don geçmeden dışarı dikmeyin; domates 0 °C civarındaki hafif donda bile zarar görür, -2 ile -3 °C'de ölür.",
      "Fideyi alıştırmadan doğrudan tam güneşe çıkarmayın; yaprakları yanar ve bitki geriler."
    ],
    "keywords": ["fide yetiştirme", "fide nasıl yapılır", "domates fidesi", "biber fidesi", "tohumdan fide", "fide harcı", "fide alıştırma", "fide dikimi", "fide devriliyor", "fide uzuyor", "evde fide", "fide ne zaman dikilir"],
    "sources": [
      "TAGEM Alata BAE — Sebzelerde fide yetiştiriciliği (https://arastirma.tarimorman.gov.tr/alata/Belgeler/brosurler/brosur2022/)",
      "Ankara İl Tarım ve Orman Müdürlüğü — Domates yetiştiriciliği (https://ankara.tarimorman.gov.tr/Belgeler/liftet/domatesyetistiriciligi.pdf)",
      "Arizona Üniv. Extension — Sowing and planting seeds (https://extension.arizona.edu/sites/extension.arizona.edu/files/attachment/sowingandplantingseeds.pdf)",
      "Isparta İl Tarım ve Orman Müdürlüğü — Açıkta domates yetiştiriciliği (donlar geçtikten sonra dikim, -2/-3 °C'de ölüm) (https://isparta.tarimorman.gov.tr/Belgeler/Faydal%C4%B1%20Bilgiler/%E2%80%8BBitkisel%20Yeti%C5%9Ftiricilik/Sebze%20Yeti%C5%9Ftiricili%C4%9Fi/A%C3%A7%C4%B1kta%20Domates%20Yeti%C5%9Ftiricili%C4%9Fi.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: don eşiği Isparta İl Müd. belgesiyle düzeltildi (domates -2/-3 °C'de ölür, donlar geçmeden dikilmez); 'yalnız -2 °C'de ölür' ifadesi hafif donu güvenli gösterdiği için değiştirildi. Diğer sayılar yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-kompost",
    "category": "sf-th-toprak-tohum",
    "title": "Kompost yapımı",
    "tag": "KOMPOST",
    "summary": "En az 1 m³'lük yığında 2–3 ölçü kuru kahverengi malzemeye 1 ölçü yaş yeşil malzeme katın, sıkılmış sünger nemliliğinde tutup düzenli aktarın.",
    "steps": [
      "Gölgeli, suyu göllenmeyen bir köşe seçin. Yığın en az 1 m eninde, boyunda ve yüksekliğinde olsun; daha küçüğü ısınmaz.",
      "Kahverengi malzeme toplayın: kuru yaprak, saman, sap, talaş, yırtılmış karton. Yeşil malzeme toplayın: sebze artıkları, biçilmiş ot, taze yaprak, ahır gübresi.",
      "En alta 20–30 cm kaba dal ve sap serin ki hava alsın. Üstüne katlar halinde 2–3 kova kahverengiye 1 kova yeşil gelecek şekilde yığın.",
      "Her katı sulayın. Bir avuç sıkınca yalnızca birkaç damla su çıkmalı: hiç çıkmıyorsa kurudur, akıyorsa fazla ıslaktır.",
      "2–5 gün içinde yığının içi ısınır. Elinizi ya da bir demir çubuğu içine sokun: sıcak olmalı. Isınmıyorsa yeşil malzeme ve su ekleyin.",
      "Haftada bir yığını aktarın; dıştakileri içe, alttakileri üste alın. Haftalık aktarmada kompost 6–8 haftada, iki günde bir aktarmada 3 haftada olur.",
      "Çürük yumurta ya da lağım kokusu gelirse fazla yaş ve havasızdır: kuru saman, yaprak ekleyip aktarın.",
      "Yığın yarıya inip malzeme tanınmaz hale gelince, koyu renkli, ufalanan ve orman toprağı gibi kokan kompostu 2–3 hafta daha dinlendirip kullanın."
    ],
    "art": [null, null, "sf-th-kompost-katlar", "sf-th-kompost-sikma", "sf-th-kompost-sicaklik", null, null, null],
    "dont": [
      "Et, kemik, balık, süt ürünü, yağ koymayın; fare, köpek ve sinek çeker.",
      "Kedi, köpek, domuz ve insan dışkısını sebze kompostuna katmayın; parazit ve hastalık taşır.",
      "Hastalıklı bitkileri ve tohuma kalkmış yabani otları koymayın; ılık yığında ölmezler, bahçeye yayılırlar."
    ],
    "keywords": ["kompost yapımı", "kompost nasıl yapılır", "organik gübre yapma", "çöpten gübre", "yaprak çürütme", "kompost yığını", "kompost kokuyor", "kompost ısınmıyor", "mutfak artığı gübre", "kompost oranı", "kompos"],
    "sources": [
      "California Üniv. (UCANR) — Hot composting (https://ucanr.edu/sites/UrbanAg/files/285018.pdf)",
      "Texas A&M — Composting (https://twri.tamu.edu/media/5419/composting-updated-01-14-20_reorg2.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları (UCANR, Texas A&M) yeniden açılmadı; sayılar yaygın extension değerleriyle tutarlı. Teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-gubre",
    "category": "sf-th-toprak-tohum",
    "title": "Gübre: ahır gübresi, yeşil gübre ve kül",
    "tag": "GÜBRE",
    "summary": "Ahır gübresini yığında yakıp (çürütüp) dekara 1–4 ton verin, boş tarlaya baklagil ekip çiçeklenmeden toprağa gömün, külü azar azar serpin.",
    "steps": [
      "Ahır gübresini sert zeminde yığın, bastırın ve nemli tutun. Gevşek yığın bir haftada (kışın 15–20 günde) 60 °C'ye ısınır; bu ısı ot tohumunu ve mikropları öldürür.",
      "Gübreyi kullanmadan önce yaklaşık 3 ay bekletin. Taze gübre bitkinin azotunu çalar ve köklerini yakar.",
      "Yığının dibinden koyu renkli su sızıyorsa besin kaçıyordur: yığını bastırın, üstünü örtün, altına saman serin.",
      "Yanmış gübreyi dekara (1.000 m²) 1–4 ton, yani metrekareye 1–4 kg verin ve hemen sürüp toprağa karıştırın. Organik maddesi az toprağa daha çok verin.",
      "Az yağışlı yerde ve ağır killi toprakta gübreyi sonbaharda, çok yağışlı yerde ve kumlu toprakta ilkbaharda verin.",
      "Tavuk ve güvercin gübresi en güçlüsüdür, koyun gübresi de sığırınkinden güçlüdür; bunları daha az kullanın.",
      "Yeşil gübre: boş kalacak tarlaya fiğ, bakla, yem bezelyesi ya da yonca ekin. Bitkiler çiçek açmaya başlarken biçip toprağa gömün.",
      "Odun külünü yalnızca asitli ya da nötr toprağa, yılda metrekareye en fazla 0,5 kg serpin. Nemli toprağa, rüzgârsız günde, eldiven ve gözlükle serpip hafifçe karıştırın.",
      "Çiğ gübre verdiğiniz yerden toprağa değen sebze (marul, havuç, patates) almak için en az 120 gün, toprağa değmeyen ürünler için en az 90 gün bekleyin."
    ],
    "art": ["sf-th-gubre-yigin", null, null, "sf-th-gubre-serpme", null, null, null, "sf-th-kul-serpme", null],
    "dont": [
      "Kedi, köpek, domuz ya da insan dışkısını sebze bahçesine gübre diye vermeyin; parazit bulaşır.",
      "Kömür, mangal kömürü, çöp, karton, boyalı ya da emprenyeli tahta külünü kullanmayın; zehirli kalıntı bırakır.",
      "Külü yeni ekilmiş tohumun ya da fidenin üstüne dökmeyin; tuzu kökleri yakar. Kül çıplak eli ve gözü kostik gibi yakar."
    ],
    "keywords": ["gübre nasıl yapılır", "ahır gübresi", "hayvan gübresi kullanımı", "yanmış gübre", "taze gübre zararlı mı", "yeşil gübre", "fiğ gübre", "odun külü gübre", "kül bahçeye", "tavuk gübresi", "dekara ne kadar gübre", "gubre"],
    "sources": [
      "Bayburt İl Tarım ve Orman Müdürlüğü — Ahır gübresi muhafazası ve uygulaması (https://bayburt.tarimorman.gov.tr/Haber/354/Ahir-Gubresi-Muhafazasi-Ve-Uygulamasi)",
      "Ankara Üniv. Ziraat Fak. açık ders — Yeşil gübreleme (https://acikders.ankara.edu.tr/mod/resource/view.php?id=23509)",
      "Oregon State Üniv. Extension — Wood ash (https://extension.oregonstate.edu/news/sweep-wood-ash-fireplace-garden-0)",
      "Maine Üniv. Extension — Guidelines for using manure on vegetable gardens (https://extension.umaine.edu/publications/2510e/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: 120/90 gün bekleme ve kül azami miktarı yazar kaydına dayanır (sayfalar yeniden açılmadı); 10 lb/100 ft² ≈ 0,49 kg/m² çevrimi hesapla doğrulandı." }
  },
  {
    "id": "sf-th-filiz",
    "category": "sf-th-toprak-tohum",
    "title": "Filiz ve mikro yeşillik",
    "tag": "FİLİZ",
    "summary": "Mercimek, nohut, buğday gibi temiz tohumları ıslatıp günde iki kez çalkalayarak birkaç günde filizlendirin; güvenli olması için pişirerek yiyin.",
    "note": "Çiğ filizler ılık ve nemde Salmonella ve E. coli üretebilir; çocuk, yaşlı, hamile ve bağışıklığı zayıf olanlar filizi yalnızca iyice pişmiş yesin.",
    "steps": [
      "Yalnızca yemeklik ya da ilaçsız tohum kullanın: mercimek, nohut, maş, buğday, karabuğday, yonca, turp. Kırık, küflü ve renkli ilaçlı tohumu ayıklayın.",
      "Ellerinizi ve kavanozu sabunla yıkayıp kaynar suyla çalkalayın. Kullanacağınız su içilebilir olsun.",
      "Bir avuç tohumu kavanoza koyup üç katı suyla 8–12 saat ıslatın.",
      "Suyu süzün, ağzını tülbentle bağlayın ve kavanozu ağzı aşağı eğik bırakın ki fazla su aksın.",
      "Günde 2–3 kez temiz suyla çalkalayıp süzün. Ekşi koku, sümüksü kayganlık ya da küf görürseniz hepsini atın.",
      "Filiz kökü 1–2 cm olunca (mercimek ve nohutta 2–3 gün) yiyin ya da serin yerde tutup 1–2 günde tüketin.",
      "Mikro yeşillik için tohumu nemli toprak ya da kompost dolu tepsiye sık serpin, ince toprakla örtün; 7–14 günde ilk gerçek yapraklar çıkınca makasla kesin.",
      "Filizi çorbaya, bulgura, haşlamaya katarak iyice pişirin; çiğ yenecekse yalnızca sağlıklı yetişkinler azar azar yesin."
    ],
    "art": [null, null, "sf-th-filiz-islatma", "sf-th-filiz-kavanoz", null, "sf-th-filiz-hazir", null, null],
    "dont": [
      "Patates, domates ve biber gibi itüzümü tohumlarının filizini yemeyin; zehirlidir.",
      "Ekim için satılan ilaçlı tohumu filizlendirmeyin.",
      "Ekşi ya da küflü kokan filizi yıkayıp kurtarmaya çalışmayın; atın."
    ],
    "keywords": ["filiz yetiştirme", "çimlendirme", "mercimek filizi", "nohut filizi", "mikro yeşillik", "kavanozda filiz", "filizlendirme", "buğday çimi", "maş filizi", "filiz yemek güvenli mi", "filizlenmiş tohum"],
    "sources": [
      "ABD FDA — Selecting and serving produce safely (sprouts) (https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-produce-safely)",
      "Illinois Üniv. Extension — Seed viability, nemli bezde çimlendirme (https://extension.illinois.edu/sites/default/files/infosheet_seed_viability.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FDA filiz riski yazar kaydına dayanır; ıslatma süresi ve gün sayıları için resmî kaynak bulunamadı. Pişirme önerisi ve note yerinde, ZAYIF kaldı (sayılar güvenlik kritik değil)." }
  },

  // ───────────────────────── Bahçe ve tarla ─────────────────────────
  {
    "id": "sf-th-ekim-takvimi-yaz",
    "category": "sf-th-bahce-tarla",
    "title": "Ekim takvimi 1: yazlık sebzeler, bölgelere göre",
    "tag": "EKİM TAKVİMİ",
    "summary": "Domates, biber, fasulye, mısır ve kabağı son dondan sonra toprak 12–15 °C'ye ısınınca dikin; bu tarih kıyıda Mart sonu, Doğu'da Haziran başıdır.",
    "steps": [
      "Kural: sıcak sever sebzeler (domates, biber, patlıcan, fasulye, mısır, kabak, hıyar) donda ölür. Toprak ve hava 12–15 °C'yi bulmadan dikmeyin.",
      "Toprağı ölçün: sabah erken avucunuzu 10 cm derine sokun; belirgin soğuk geliyorsa erkendir. Yaşlıların 'erik çiçeği döküldü, dut yapraklandı' gözlemi de iyi işarettir.",
      "Ege ve Akdeniz kıyısı: kıyıda don çok seyrektir. Açıkta yazlık dikimi Mart sonu–Nisan yapın; kışın da marul, ıspanak, lahana, bakla açıkta yetişir. Yaz sıcağında öğle gölgesi ve bol su gerekir.",
      "Marmara: don günü azdır ama iç kesimlerde Nisan donu olur. Yazlıkları Nisan sonu–Mayıs başı dikin, sonbaharda Ekim'e kadar ikinci ekim yapın.",
      "Karadeniz kıyısı: don nadirdir ama ilkbahar serin ve yağışlıdır. Nisan sonu–Mayıs dikin, mantar hastalığına karşı seyrek dikin. İç kesimde (Kastamonu, Gümüşhane gibi) Mayıs sonunu bekleyin.",
      "İç Anadolu: Nisan ve Mayıs başında zirai don sık görülür. Fideyi Mayıs ortası–sonu dikin; o tarihten önce çıkacak fideyi geceleri örtün.",
      "Doğu Anadolu: yaz kısa, kış uzundur; Erzurum'da Mayıs geceleri hâlâ 0–3 °C'dir. Sıcak sever sebzeleri Haziran başında, yalnızca korunaklı vadilerde ya da serada dikin; ana ürün lahana, karnabahar, fasulye, patates gibi serin seven sebzeler olsun.",
      "Sonbaharın ilk donu Doğu'da Eylül sonu, İç Anadolu'da Ekim, kıyılarda Kasım–Aralıktır. Ekeceğiniz çeşidin hasada kadarki süresini buna göre hesaplayın.",
      "Her yıl ekim, ilk ve son don tarihlerini bir deftere yazın. Birkaç yılda kendi köyünüzün takvimi çıkar."
    ],
    "art": [null, "sf-th-toprak-sicaklik-el", null, null, null, "sf-th-fide-gece-ortu", "sf-th-harita-dogu", null, null],
    "dont": [
      "Ilık bir hafta görüp erken dikmeyin; Nisan–Mayıs zirai donu bütün fideyi bir gecede öldürebilir.",
      "Bir bölgenin takvimini başka rakımda aynen uygulamayın; her 100 m yükseklik iklimi belirgin soğutur, yerel gözleme güvenin."
    ],
    "keywords": ["ekim takvimi", "ne zaman ekilir", "domates ne zaman dikilir", "fide dikim zamanı", "bölgelere göre ekim", "erzurumda sebze", "iç anadolu ekim zamanı", "karadeniz ekim takvimi", "ege ekim zamanı", "son don tarihi", "zirai don", "ekim zamani"],
    "sources": [
      "Ankara İl Tarım ve Orman Müdürlüğü — Domates yetiştiriciliği (Nisan–Mayıs, 12–15 °C) (https://ankara.tarimorman.gov.tr/Belgeler/liftet/domatesyetistiriciligi.pdf)",
      "Ankara Üniv. Ziraat Fak. açık ders — Türkiye sebze bölgeleri ve don günleri (https://acikders.ankara.edu.tr/mod/resource/view.php?id=103946)",
      "Dursun ve Ekinci — Erzurum sebzeciliği (sıcak sevenler yalnız mikroklimada) (https://orgprints.org/26607/1/DURSUN%20VE%20EK%C4%B0NC%C4%B0.pdf)",
      "MGM 1991–2020 normalleri, Erzurum aylık en düşük sıcaklıklar (climate-zone.com özeti)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: domates için 'donlar geçtikten sonra dikim' ve -2/-3 °C ölüm Isparta İl Müd.; 12–15 °C Ankara İl Müd. Bölge bazında il müdürlüğü sebze dikim takvimi bulunamadı; bölge tarihleri don verisinden tutucu çıkarım olarak kaldı, uzman onayı gerekir." }
  },
  {
    "id": "sf-th-ekim-takvimi-kis",
    "category": "sf-th-bahce-tarla",
    "title": "Ekim takvimi 2: kışlık ekim, bölgelere göre",
    "tag": "EKİM TAKVİMİ",
    "summary": "Buğday ve arpayı toprak 8–10 °C'ye inince ekin: Erzurum–Kars yaylasında Ağustos sonu–Eylül başı, İç Anadolu'da Eylül ortası–Ekim, Marmara ve Ege'de Ekim–Kasım, Karadeniz ve Akdeniz kıyısında Kasım ortası–Aralık ortası.",
    "steps": [
      "Kural: kışlık buğday ve arpa toprak sıcaklığı 8–10 °C'ye düşünce ekilir. Kışa girmeden 3–4 yapraklı olmalı ki dona dayansın.",
      "İç Anadolu: kışlık buğdayı Eylül ortası–Ekim içinde (Konya kuru tarımında 15 Eylül–10 Ekim), yağmurdan sonra toprak tavda iken ekin.",
      "Doğu Anadolu: kış erken gelir. Erzurum ve Kars gibi yüksek yaylalarda kışlık buğdayı 15 Ağustos–5 Eylül arasında ekin; Muş ve Van gibi daha alçak ovalarda 15 Eylül–15 Ekim arasında. Kışı çok sert yerlerde ilkbaharda yazlık çeşit ekmek daha güvenlidir.",
      "Marmara ve Ege: Ekim ortası–Kasım ortasında ekin (Edirne Ekim'in ikinci yarısı, İzmir 15 Ekim–15 Kasım). Sakarya gibi nemli ve ılık Marmara kıyısında 15 Kasım–15 Aralık.",
      "Karadeniz ve Akdeniz kıyısı: 15 Kasım–15 Aralık arasında ekin; bu ılık bölgelerde yazlık (alternatif) çeşitler de kışın ekilir.",
      "Kıyı bölgelerinde sonbaharda bakla, bezelye, sarımsak, kuru soğan, ıspanak, marul ve lahana da açıkta ekilir; ilkbaharda erken ürün verir.",
      "İç ve Doğu Anadolu'da sarımsağı ve kışlık soğanı topraklar donmadan, Ekim'de dikin ve üstünü 5–10 cm samanla örtün.",
      "Hasat buğdayda Akdeniz kıyısında Mayıs sonu, İç Anadolu'da Haziran–Temmuz, Doğu'da Temmuz sonu–Ağustostur. Ambar ve harman yerini buna göre hazırlayın."
    ],
    "art": ["sf-th-bugday-fide-kis", null, null, null, null, null, "sf-th-sarimsak-saman", null],
    "dont": [
      "Kışlık buğdayı çok geç ekmeyin; kışa çıplak giren fide donar, tarla boş kalır.",
      "Kurak sonbaharda toprak tozken ekip çimlenmeyi şansa bırakmayın; mümkünse ilk yağmuru bekleyin ya da bir kez sulayın."
    ],
    "keywords": ["buğday ne zaman ekilir", "kışlık ekim", "arpa ekim zamanı", "sonbahar ekimi", "kışlık sebze", "sarımsak ne zaman dikilir", "bakla ekimi", "güzlük ekim", "hububat ekim zamanı", "bugday ekimi", "kislik ekim takvimi"],
    "sources": [
      "TAGEM Karadeniz Tarımsal Araştırma Enst. — Buğday tarımı (https://arastirma.tarimorman.gov.tr/ktae/Belgeler/brosurler/Buğday%20Tarımı.pdf)",
      "Bolu İl Tarım ve Orman Müdürlüğü — Buğday yetiştiriciliği (https://bolu.tarimorman.gov.tr/Belgeler/agroekoloji/BUĞDAY%20YETİŞTİRİCİLİĞİ%20YENİ.pdf)",
      "Ankara Üniv. Ziraat Fak. açık ders — Akdeniz kışın sebzeye uygun (https://acikders.ankara.edu.tr/mod/resource/view.php?id=103946)",
      "Ondokuz Mayıs Üniv. ders notu — Buğdayın yetiştiriciliği: il bazında ekim zamanları (https://avys.omu.edu.tr/storage/app/public/isezer/66430/7.%20Bu%C4%9Fday%C4%B1n%20yeti%C5%9Ftiricili%C4%9Fi.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: il bazında buğday ekim zamanları OMÜ ders notu tablosuyla karşılaştırıldı. Doğu Anadolu tarihi yanlıştı (Eylül ortası–sonu): Erzurum–Kars yaylasında 15 Ağustos–1 Eylül / 22 Ağustos–3 Eylül, Muş–Van'da 15 Eylül–15 Ekim olarak düzeltildi. İzmir 15 Ekim–15 Kasım, Edirne Ekim ortası, Sakarya 15 Kasım–15 Aralık, Konya 15 Eylül–10 Ekim; 8–10 °C toprak sıcaklığı aynı kaynakta. Akdeniz kıyısı tarihi yalnız KTAE'ye dayanır." }
  },
  {
    "id": "sf-th-patates",
    "category": "sf-th-bahce-tarla",
    "title": "Patates yetiştirme",
    "tag": "PATATES",
    "summary": "50 gramlık, 1 cm filizli tohumluk yumruları toprak 8–10 °C olunca 70 cm aralı sıralara dikin, boğaz doldurun, sap kuruyunca hasat edin.",
    "steps": [
      "Tohumluk için geçen yılın sağlam, hastalıksız, yaklaşık yumurta büyüklüğündeki (3–6 cm, ortalama 50 g) yumrularını ayırın.",
      "Dikimden 3–4 hafta önce yumruları 18–20 °C'de önce karanlıkta, sonra aydınlıkta sandıkta yayın; yaklaşık 1 cm'lik kısa, kalın, yeşil-mor filizler çıksın.",
      "Büyük yumruyu kesecekseniz dikimden yaklaşık bir hafta önce, her parçada 2–3 göz kalacak şekilde kesin. Bıçağı her kesimden sonra sabunlu ya da çamaşır sulu suya batırın.",
      "Toprak sıcaklığı 8–10 °C olunca dikin. Sıra arası 70–75 cm, sıra üzeri 30–40 cm olsun; yumruyu 5 cm derine, filizi yukarı gelecek şekilde koyun.",
      "Bitkiler 10 cm olunca ilk çapayı yapıp sıranın iki yanından toprağı gövdeye çekin (boğaz doldurma). Bunu yaklaşık 20 günde bir, 3–4 kez tekrarlayın.",
      "Yumrular asla güneş görmesin; açıkta kalan yumru yeşillenir ve zehirli olur. Toprağı sırtta tutun.",
      "Çiçeklenme döneminde toprak kurumasın; hasattan bir hafta önce sulamayı kesin.",
      "Yapraklar ve saplar sarardığında, yumru kabuğu parmakla ovunca soyulmuyorsa hasat edin. Kuru havada, yumruları yaralamadan çatalla çıkarın.",
      "Yumruları gölgede kurutun, yaralı ve çürükleri ayırın. Karanlık, serin (3–4 °C ile 10 °C arası) ve nemli olmayan yerde, ışık görmeden saklayın."
    ],
    "art": [null, null, null, "sf-th-patates-dikim", "sf-th-patates-bogaz", null, null, "sf-th-patates-hasat", null],
    "dont": [
      "Yeşillenmiş, filizi uzamış ya da acı tadı olan patatesi yemeyin; zehirli solanin içerir. Yeşil kısmı kalın kesip atın.",
      "Patatesi her yıl aynı yere dikmeyin; hastalık ve zararlı toprakta birikir. Domates, biber ve patlıcanla aynı ailedendir.",
      "Patatesin yaprak, sap ve meyvesini (yeşil bilye gibi) yemeyin, hayvana vermeyin."
    ],
    "keywords": ["patates nasıl ekilir", "patates dikimi", "patates yetiştirme", "tohumluk patates", "boğaz doldurma", "patates hasadı", "patates saklama", "yeşil patates zehirli mi", "patates ne zaman dikilir", "patates filizlendirme", "patates ekimi"],
    "sources": [
      "Antalya İl Tarım ve Orman Müdürlüğü — Patates yetiştiriciliği (https://antalya.tarimorman.gov.tr/Belgeler/Yetiştirici%20Bilgileri/Patates%20Yetiştiriciliği.pdf)",
      "Şırnak İl Tarım ve Orman Müdürlüğü — Patates yetiştiriciliği (https://sirnak.tarimorman.gov.tr/BelgelerArsiv/Yayınlar/Patates%20Yetiştiriciliği.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları (Antalya, Şırnak İl Müd.) yeniden açılmadı; solanin uyarısı genel gıda güvenliği bilgisi. Teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-uc-kardes",
    "category": "sf-th-bahce-tarla",
    "title": "Mısır, fasulye ve kabak birlikte (üç kardeş)",
    "tag": "TEMEL ÜRÜN",
    "summary": "Mısırı tümseklere ekin, 15–30 cm olunca dibine sırık fasulye, yanına kabak ekin: mısır sırık olur, fasulye toprağa azot bağlar, kabak toprağı gölgeler.",
    "steps": [
      "Don geçip toprak ısındıktan sonra güneşli bir yerde 30 cm yüksekliğinde, 45–90 cm çapında tümsekler yapın; tümsekler arası yaklaşık 1,5 m olsun. Kurak yerde tümseğin tepesini çanak gibi çukurlaştırın.",
      "Mısır tohumunu en fazla 8 saat ıslatın. Her tümseğin ortasına 15 cm arayla 4–7 tohum ekin, sonra en güçlü 3–4 fideyi bırakın.",
      "Mısır 15–30 cm boya gelince her tümseğe mısırların çevresine, 15 cm uzağa 6 sırık (sarılıcı) fasulye tohumu ekin; sonra 3–4'ünü bırakın.",
      "Aynı zamanda tümseğin kenarına, fasulyelerden 30 cm uzağa 3–4 kabak tohumu ekin ve en güçlü bir fideyi bırakın.",
      "Fasulye filizlerini mısır saplarına doğru yönlendirin. Kabak yaprakları yere yayılıp otları bastırır ve toprağın nemini korur.",
      "Mısır püskülleri kahverengileşip koçanın tanesi tırnakla basınca süt gibi sıvı verince taze yemek için toplayın; kuru tane ve tohum için koçanı bitki üstünde kurumaya bırakın.",
      "Fasulyeyi taze yemek için düzenli toplayın; kuru fasulye ve tohum için kabukları bitkide kurutun. Kabağı kabuğu tırnak geçirmeyecek kadar sertleşince kesin.",
      "Hasattan sonra fasulye köklerini toprakta bırakın; ertesi yıla azot kalır."
    ],
    "art": ["sf-th-uc-kardes-tumsek", null, "sf-th-uc-kardes-fasulye", null, "sf-th-uc-kardes-kabak", null, null, null],
    "dont": [
      "Fasulyeyi mısırla aynı anda ekmeyin; fasulye hızla büyüyüp genç mısırı boğar.",
      "Çiğ ya da az pişmiş kuru fasulye yemeyin; ıslatıp suyunu dökün ve iyice kaynatın.",
      "Acı tadı olan kabağı yemeyin; zehirli kükürbitasin içerebilir."
    ],
    "keywords": ["üç kardeş ekimi", "mısır fasulye kabak", "mısır nasıl ekilir", "fasulye ekimi", "kabak ekimi", "sırık fasulye", "birlikte ekim mısır", "üç kardeşler", "misir fasulye kabak", "fasulye mısıra sarılır", "temel ürünler ekimi"],
    "sources": [
      "Cornell Cooperative Extension Warren County — Creating a three sisters garden (https://warren.cce.cornell.edu/gardening-landscape/warren-county-master-gardener-articles/creating-a-three-sisters-garden)",
      "RHS — Three sisters (https://rhs.org.uk/advice/grow-your-own/features/three-sisters)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları (Cornell, RHS) yeniden açılmadı; kuru fasulye ve acı kabak uyarıları doğru ve yerinde. Teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-bugday-ekim",
    "category": "sf-th-bahce-tarla",
    "title": "Buğday ve arpa 1: tarlayı hazırlama ve ekim",
    "tag": "TAHIL",
    "summary": "Toprağı sürüp tohum yatağını ufalayın, dekara 20–25 kg temiz tohumu 4–6 cm derine serpin ya da sıraya ekin, üstünü kapatın.",
    "steps": [
      "Önceki yıl baklagil (nohut, mercimek, fiğ) ya da yeşil gübre ekilmiş yeri seçin; buğdayı buğdayın ardından ekmeyin.",
      "Toprağı tavda iken (avuçta sıkınca dağılan nemde) sürün ya da belleyin, kesekleri kırın, otları toplayın. Tohum yatağı ufak ve oturmuş olsun.",
      "Tohumluğu geçen yılın en dolgun, hastalıksız başaklarından ayırın. Kırık, küçük ve kararmış taneleri eleyin; çimlenme testi yapın.",
      "Dekara (1.000 m²) 20–25 kg tohum hesaplayın; bu metrekareye 20–25 gramdır, yani yaklaşık bir avuç. Geç ekimde ve çimlenme düşükse üst sınırı kullanın.",
      "Elle serpme: tohumu ikiye bölün; yarısını tarlayı boyuna, yarısını enine yürüyerek düzenli adım ve kol hareketiyle serpin.",
      "Tohumu 4–6 cm derine gömün: serptikten sonra sürgü, tırmık ya da hafif sürümle örtün. Sıraya ekiyorsanız sıra arası 15–20 cm olsun.",
      "Ekimden sonra kuşlara karşı tarlayı birkaç gün gözleyin; korkuluk ve parlak şeritler işe yarar.",
      "İlkbaharda kardeşlenme döneminde yabani otları elle ya da çapayla temizleyin."
    ],
    "art": [null, null, "sf-th-tohumluk-eleme", null, "sf-th-elle-serpme", "sf-th-tohum-ortme", null, null],
    "dont": [
      "Dekara gerekenden çok tohum atmayın; bitki kardeşlenemez, verim düşer.",
      "Çavdarmahmuzu (başakta mor-siyah boynuz gibi tane) bulaşmış tohumu ekmeyin, öğütmeyin; zehirlidir."
    ],
    "keywords": ["buğday ekimi", "arpa ekimi", "buğday nasıl ekilir", "dekara kaç kilo buğday", "elle tohum serpme", "tahıl ekimi", "buğday ekim derinliği", "tarla hazırlama", "bugday ekme", "hububat ekimi", "ekin ekme"],
    "sources": [
      "Bolu İl Tarım ve Orman Müdürlüğü — Buğday yetiştiriciliği (https://bolu.tarimorman.gov.tr/Belgeler/agroekoloji/BUĞDAY%20YETİŞTİRİCİLİĞİ%20YENİ.pdf)",
      "TAGEM Karadeniz Tarımsal Araştırma Enst. — Buğday tarımı (https://arastirma.tarimorman.gov.tr/ktae/Belgeler/brosurler/Buğday%20Tarımı.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: ekim derinliği OMÜ ders notuyla karşılaştırıldı (nem yeterliyse 2–4 cm, yetersizse en az 5 cm, kışlıkta 5–6 cm); 4–6 cm ile uyumlu. 20–25 kg/da Bolu İl Müd. kaydına dayanır." }
  },
  {
    "id": "sf-th-bugday-hasat",
    "category": "sf-th-bahce-tarla",
    "title": "Buğday ve arpa 2: hasat, harman ve saklama",
    "tag": "TAHIL",
    "summary": "Başaklar altın sarısı olup tane dişte kırılınca orakla biçin, demetleri 7–10 gün kurutun, harmanda dövüp rüzgârda savurun, iyice kurumuş taneyi kapalı kapta saklayın.",
    "steps": [
      "Olgunluğu yoklayın: bitki tamamen sararmış, başak öne eğilmiş olmalı. Bir taneyi tırnakla bastırın: süt çıkıyorsa erkendir, hamur gibi iz kalıyorsa yakındır, sert ve dişte kırılıyorsa hazırdır.",
      "Kuru ve güneşli bir günde, çiy kalktıktan sonra orakla biçin: bir avuç sapı tutup başağın 25 cm kadar altından kesin.",
      "Sapları kol kalınlığında demetler halinde bağlayın. Demetleri başakları yukarı gelecek şekilde birbirine yaslayıp tarlada 7–10 gün kurutun.",
      "Harman yeri hazırlayın: düz, sert, temiz bir zemini süpürün ya da sulayıp sıkıştırın; yoksa büyük bir branda serin.",
      "Demetleri harman yerine yaklaşık 30 cm kalınlıkta yayın. Döven, hayvan çiğnetmesi ya da sopa ve düvenle taneler saptan ayrılana dek dövün; arada sapları alt üst edin.",
      "Savurun: hafif rüzgârlı bir günde karışımı yabayla ya da kürekle havaya atın; ağır tane öne düşer, saman ve kavuz rüzgârla uçar. Kalan çöpü kalburla eleyin.",
      "Taneyi temiz brandaya ince serip birkaç gün güneşte kurutun. Dişle ısırınca çıtır kırılmalı, ezilmemeli. Saklama için nem yüzde 13'ün altında olmalıdır.",
      "Kuru taneyi serin (15–20 °C altı), havadar yerde, fare girmeyen kapalı kaplarda ya da ambarda saklayın. Ayda bir kontrol edin: ısınma, küf kokusu ya da böcek görürseniz yayıp kurutun.",
      "Samanı ve sapı ayrı yerde, yağmurdan korunaklı biçimde hayvan yemi ve yatak için saklayın."
    ],
    "art": [null, "sf-th-orak-bicme", "sf-th-demet-kurutma", null, null, "sf-th-savurma", null, null, null],
    "dont": [
      "Nemli taneyi çuvala ya da ambara koymayın; ısınır, küflenir ve küf zehri (aflatoksin) oluşur. Küflü taneyi insan da hayvan da yemesin.",
      "Döven ve hayvanla çalışırken çocukları harman yerinden uzak tutun.",
      "Ambar içinde ateş ve gaz lambası kullanmayın; tahıl tozu ve saman kolay tutuşur."
    ],
    "keywords": ["buğday hasadı", "orakla biçme", "harman nasıl yapılır", "döven", "savurma", "buğday kurutma", "tahıl saklama", "buğday ambarı", "elle hasat", "harman dövme", "arpa hasadı", "bugday hasat"],
    "sources": [
      "FAO — Agricultural engineering in development: threshing and shelling (https://www.fao.org/4/t0522e/T0522E07.htm)",
      "TAGEM Karadeniz Tarımsal Araştırma Enst. — Buğday tarımı (https://arastirma.tarimorman.gov.tr/ktae/Belgeler/brosurler/Buğday%20Tarımı.pdf)",
      "Bolu İl Tarım ve Orman Müdürlüğü — Buğday yetiştiriciliği (https://bolu.tarimorman.gov.tr/Belgeler/agroekoloji/BUĞDAY%20YETİŞTİRİCİLİĞİ%20YENİ.pdf)",
      "Grow Organic — Growing grain: harvesting, threshing, winnowing (https://groworganic.com/blogs/articles/grow-your-own-grain-harvesting-threshing-and-storing)",
      "SARE — Grain handbook (https://projects.sare.org/media/pdf/G/r/a/Grain-Handbook-2.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları yeniden açılmadı; saklama nemi (%13 altı) ve aflatoksin, tahıl tozu yangın uyarıları doğru ve yerinde." }
  },
  {
    "id": "sf-th-ekim-nobeti",
    "category": "sf-th-bahce-tarla",
    "title": "Ekim nöbeti ve birlikte ekim",
    "tag": "BAHÇE PLANI",
    "summary": "Bahçeyi 3–4 parsele bölüp her yıl bitki ailelerini bir parsel kaydırın; aynı aileyi aynı yere en az 3 yıl ekmeyin.",
    "steps": [
      "Sebzeleri ailelerine ayırın: patates grubu (patates, domates; biber ve patlıcan da aynı ailedendir), baklagiller (fasulye, bezelye, bakla), lahanagiller (lahana, karnabahar, turp, şalgam), soğangiller (soğan, sarımsak, pırasa), kökler (havuç, pancar, maydanoz).",
      "Bahçeyi 3 ya da 4 eşit parsele bölün ve kenarlarına kazık çakın.",
      "4 yıllık düzen: 1. parsel baklagil, 2. lahanagil, 3. patates grubu, 4. soğan ve kökler. Her yıl her grup bir sonraki parsele geçer.",
      "Sıra şöyle döner: lahanagiller baklagil, soğan ve köklerin ardından; baklagil, soğan ve kökler patatesin ardından; patates lahanagillerin ardından gelir.",
      "Kabak, hıyar, mısır ve marul nöbete serbest girer ama aynı yere üst üste ekilmesin.",
      "Tarlada aynı mantık: buğday ya da arpadan sonra nohut, mercimek ya da fiğ ekin; baklagil toprağa azot bırakır.",
      "Birlikte ekim: uzun bitkinin gölgesine marul ve ıspanak gibi gölgeye dayanıklıları, sıraların arasına hızlı yetişen turp ekin. Mısır-fasulye-kabak üçlüsü bunun en bilinen örneğidir.",
      "Her yıl hangi parsele ne ektiğinizi bir krokiye çizip saklayın."
    ],
    "art": [null, null, "sf-th-nobet-dort-parsel", null, null, null, "sf-th-birlikte-ekim", null],
    "dont": [
      "Patates, domates, biber ve patlıcanı birbirinin ardından aynı yere ekmeyin; aynı hastalıkları paylaşırlar.",
      "Lahanagillerde kök uru, soğanda beyaz çürüklük gördüğünüz parsele o aileyi yıllarca ekmeyin."
    ],
    "keywords": ["ekim nöbeti", "münavebe", "bahçe planı", "aynı yere ne ekilir", "birlikte ekim", "arkadaş bitkiler", "domatesten sonra ne ekilir", "nöbetleşe ekim", "toprak yorulması", "ekim nobeti", "bitki aileleri"],
    "sources": [
      "RHS — Crop rotation (https://www.rhs.org.uk/vegetables/crop-rotation)",
      "Ankara Üniv. Ziraat Fak. açık ders — Yeşil gübreleme ve baklagiller (https://acikders.ankara.edu.tr/mod/resource/view.php?id=23509)",
      "Cornell Cooperative Extension — Three sisters (https://warren.cce.cornell.edu/gardening-landscape/warren-county-master-gardener-articles/creating-a-three-sisters-garden)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynağı (RHS) yeniden açılmadı; güvenlik açısından kritik sayı yok." }
  },
  {
    "id": "sf-th-zararlilar",
    "category": "sf-th-bahce-tarla",
    "title": "Zararlılarla kimyasalsız mücadele",
    "tag": "ZARARLI",
    "summary": "Bahçeyi sabah akşam gezip zararlıyı erkenden elle toplayın, yaprak bitine sabunlu su püskürtün, tülle örtün ve faydalı böcekleri koruyun.",
    "steps": [
      "Her gün sabah ya da akşam bahçeyi gezin, yaprakların altına bakın. Zararlı ne kadar erken bulunursa o kadar kolay biter.",
      "Tırtıl, böcek ve sümüklü böceği elle toplayın; sabunlu su dolu bir kaba atın. Sümüklü böcek için akşam tahta ya da kiremit bırakıp sabah altında toplananları alın.",
      "Yaprak biti, beyaz sinek, kırmızı örümcek gibi küçük, yumuşak gövdeli zararlılara sabunlu su püskürtün: 1 litre ılık suda 1 tatlı kaşığı (yaklaşık 5–6 ml) sıvı sade sabun ya da o kadar rendelenmiş zeytinyağlı sabunu eritin. Bu yaklaşık yüzde 1'lik karışımdır; yüzde 2'yi asla geçmeyin.",
      "Sabunu önce birkaç yaprağa sürüp 24 saat bekleyin; kenarları kahverengileşmez, solmazsa bütün bitkiye, özellikle yaprak altlarına sıkın. Sabah erken ya da akşamüstü uygulayın; tam güneşte, 32 °C üstünde ve susuz kalmış bitkiye sıkmayın. Kiraz ve erik gibi hassas bitkilerde ve fidelerde 2–3 saat sonra yaprağı temiz suyla yıkayın.",
      "Gerekirse 4–7 günde bir tekrarlayın; daha sık sıkmayın, yaprak hasarı birikir. Sert su sabunu keser: karışımı kavanozda 15 dakika bekletin, süt gibi kalmayıp üstte kaymak tutuyorsa yağmur suyu kullanın. Sabun sıkılmış sebzeyi yemeden önce yıkayın.",
      "Lahana ve fidelerin üstüne kasnaklarla tül ya da ince file gerin; kelebek ve pire böceği yumurta bırakamaz.",
      "Uğur böceği, peygamber devesi, örümcek ve kuşları koruyun. Bahçe kenarında çiçekli otlar bırakın; faydalı böcekler buralarda yaşar.",
      "Hastalıklı yaprak ve meyveleri toplayıp gömün ya da yakın; komposta atmayın. Ekim nöbeti ve seyrek dikim hastalığı azaltır."
    ],
    "art": [null, "sf-th-zararli-elle", null, "sf-th-yaprak-alti-puskurtme", null, "sf-th-tul-ortu", null, null],
    "dont": [
      "Bulaşık deterjanı, çamaşır deterjanı ya da çamaşır suyu püskürtmeyin; bitkiyi yakar.",
      "Ev yapımı karışımları önerilenden koyu yapmayın; ev yapımı sabun hazır ürüne göre yaprağı daha kolay yakar. Kenarı kahverengileşen, solan yaprak görürseniz hemen suyla yıkayıp oranı düşürün.",
      "Tütün suyu ve benzeri zehirli karışımlar hazırlamayın; insan ve hayvan için de zehirlidir."
    ],
    "keywords": ["zararlılarla mücadele", "ilaçsız böcek", "yaprak biti", "sabunlu su ilaç", "organik ilaç", "sümüklü böcek", "tırtıl", "beyaz sinek", "doğal ilaç bahçe", "bitki biti", "kimyasalsız ilaç", "zararli bocek"],
    "sources": [
      "Clemson Üniv. HGIC — Insecticidal soaps for garden pest control (https://hgic.clemson.edu/factsheet/insecticidal-soaps-for-garden-pest-control/)",
      "RHS — Crop rotation (zararlı ve hastalık birikimi) (https://www.rhs.org.uk/vegetables/crop-rotation)",
      "Nebraska Üniv. Extension Lancaster — Washing pests away (ev yapımı sabun %1 = 1,5 yemek kaşığı/galon, yaprak hasarı, sonradan yıkama) (https://lancaster.unl.edu/washing-pests-away/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Clemson yeniden açıldı (ticari %1–2 = galona 2,5–5 yemek kaşığı, 24 sa test, 32 °C/90 °F üstü ve tam güneşte uygulamama, 4–7 gün, sert su için 15 dk kavanoz testi, hassas bitkiler arasında kiraz ve erik, solan bitkiyi suyla yıkama). UNL: ev yapımı %1 = 1,5 yemek kaşığı/galon, ev yapımı daha çok yaprak yakar. Eski '1 litreye 1–2 yemek kaşığı' oranı (%2–4'e kadar) yüksekti; litreye 1 tatlı kaşığı (~%1) olarak düzeltildi." }
  },
  {
    "id": "sf-th-sulama",
    "category": "sf-th-bahce-tarla",
    "title": "Sulama: karık, çanak, damla ve testi",
    "tag": "SULAMA",
    "summary": "Hafif eğimli tarlada karık açıp suyu yavaşça yürütün, ağaç ve sebzeye çanak yapın, su azsa toprağa gömülü sırsız testi ya da delikli şişeyle damla sulama kurun.",
    "steps": [
      "Sabah erken ya da akşamüstü sulayın; öğle sıcağında suyun büyük kısmı buharlaşır.",
      "Karık: eğim yüzde 0,5'ten (100 m'de 50 cm) fazla olmasın. Kumlu toprakta dar ve derin karıkları 30–60 cm arayla, killi toprakta geniş ve sığ karıkları 75–150 cm arayla açın.",
      "Karıkları kısa tutun: kumlu toprakta en fazla 30–75 m, killi toprakta 100–150 m. Suyu az ve sürekli verin; karık başını oyup taşırmamalı.",
      "Suyun her karığın sonuna ulaştığını gezerek kontrol edin; kuru kalan yer, göllenme ya da sırttan taşma varsa akışı ve eğimi düzeltin.",
      "Çanak: fidan ve büyük sebzelerin çevresine 10–15 cm yüksekliğinde toprak set çekip içine su doldurun; su dibe yavaş yavaş iner.",
      "Testi sulama: sırsız bir toprak testiyi ağzı toprak üstünde kalacak şekilde gömün, suyla doldurun ve ağzını taşla kapatın. Çevresine, köklerin uzanabileceği mesafeye 3–4 bitki dikin.",
      "Testiyi düzenli doldurun; killi toprakta su az yayılır, testileri sık gömün. Bu yöntem buharlaşmayı ve kaçağı büyük ölçüde azaltır.",
      "Damla: pet şişenin kapağına iğneyle 1–2 delik açın, dibini kesin ve ağzı aşağı bitkinin yanına gömün; üstten doldurun.",
      "Toprağın yüzünü 5–10 cm saman, kuru ot ya da yaprakla örtün; nem birkaç kat uzun kalır."
    ],
    "art": [null, null, null, null, "sf-th-canak-sulama", "sf-th-testi-sulama", null, null, "sf-th-malc-ortu"],
    "dont": [
      "Kanalizasyon ya da lağım karışmış suyla yenecek sebze sulamayın; hastalık yapar.",
      "Ağır sulamayla toprağı çamur etmeyin; kökler havasız kalır ve çürür.",
      "Testinin ağzını açık bırakmayın; içine sivrisinek yumurtlar, hayvan ya da çocuk düşebilir."
    ],
    "keywords": ["sulama yöntemleri", "karık sulama", "damla sulama", "testi sulama", "ollas", "çanak sulama", "su az nasıl sulanır", "şişe ile sulama", "bahçe nasıl sulanır", "sulama ne zaman", "karik", "malç"],
    "sources": [
      "FAO — Irrigation water management training manual 5: furrow irrigation (https://www.fao.org/4/s8684e/s8684e04.htm)",
      "Wikipedia — Olla (Farmers' Almanac ve Ecology Action'a dayanarak) (https://en.wikipedia.org/wiki/Olla)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynakları yeniden açılmadı. Testi sulama yalnız ikincil kaynağa dayanır; ZAYIF kaldı ama güvenlik riski düşük, uyarılar yerinde." }
  },
  {
    "id": "sf-th-teras",
    "category": "sf-th-bahce-tarla",
    "title": "Teras ve eğimli arazide tarım",
    "tag": "TERAS",
    "summary": "Yamaçta toprağı tutmak için eş yükselti çizgisini işaretleyip taş duvarlı basamaklar yapın; her basamağı hafif içe eğimli ve suyu güvenle akıtan biçimde kurun.",
    "note": "Uzman gözetimi olmadan 1 metreden yüksek istinat duvarı örmeyin; yıkılan duvar ve kayan toprak can alabilir.",
    "steps": [
      "Önce yamaçta su yolunu izleyin: yağmurdan sonra suyun nereden aktığını ve oyduğunu görün. Terasları bu yolları kapatmayacak biçimde planlayın.",
      "Eş yükselti çizgisini bulun: 2 m'lik bir çıtanın ortasına ip ve ağırlık asın (A-çerçeve); iki ayağı yerde iken ip ortadaki çizgiye geliyorsa iki nokta aynı yükseltidedir. Kazıklarla yamaç boyunca işaretleyin.",
      "Duvar temeli için çizgi boyunca sağlam alt toprağa kadar sığ bir hendek kazın. En büyük taşları temele yerleştirin.",
      "Duvarı kuru taşla, yamaca doğru hafifçe yatırarak örün; duvar yükseldikçe incelsin. Arada bir duvarın içine doğru uzanan uzun bağlayıcı taş koyun.",
      "Ön taşların arkasını küçük taş ve çakılla doldurun; bu dolgu suyu süzer ve duvarın şişip yıkılmasını önler.",
      "Duvarın arkasını yamaçtan kazdığınız toprakla doldurun. Önce verimsiz alt toprağı, en üste ayırdığınız üst toprağı serin.",
      "Basamak yüzeyini duvara doğru değil, yamaca doğru hafif eğimli yapın; fazla su basamak arkasındaki küçük bir kanalla yandaki taşlı su yoluna aksın.",
      "Her kış sonu ve büyük yağmurdan sonra duvarları gezin; düşen taşları yerine koyun, oyulan yerleri hemen onarın."
    ],
    "art": [null, "sf-th-a-cerceve", null, "sf-th-teras-duvar", "sf-th-teras-kesit", null, null, null],
    "dont": [
      "Yamacın aşağısında ev, yol ya da insan varken büyük toprak kazısı ve yüksek duvar yapmayın.",
      "Teras yüzeyini dışa doğru eğimli yapmayın; su duvarın üstünden akıp onu oyar.",
      "Yağmur suyunu tek bir noktada toplayıp yamaçtan bırakmayın; heyelan başlatabilir."
    ],
    "keywords": ["teras yapımı", "eğimli arazide tarım", "yamaçta bahçe", "seki", "taş duvar teras", "toprak kayması önleme", "basamaklı tarla", "istinat duvarı kuru taş", "eş yükselti", "a çerçeve", "teras tarim"],
    "sources": [
      "FAO — Irrigation water management manual 5: furrows, eğimde kontura göre düzenleme (https://www.fao.org/4/s8684e/s8684e04.htm)",
      "Wikipedia — Dry stone (kuru taş duvar ilkeleri) (https://en.wikipedia.org/wiki/Dry_stone)",
      "Wikipedia — Terrace (earthworks) (https://en.wikipedia.org/wiki/Terrace_(earthworks))"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: birincil teras kaynağı bulunamadı; note 1 m'den yüksek duvarı uzmana bırakıyor. ZAYIF kaldı." }
  },
  {
    "id": "sf-th-sera",
    "category": "sf-th-bahce-tarla",
    "title": "Sera ve soğuk çerçeve",
    "tag": "SERA",
    "summary": "Eski pencere ve tahtadan güneye bakan, kapağı eğimli bir soğuk çerçeve kurun; fideleri erken başlatıp kışlık yeşillikleri uzatın, sıcak günlerde mutlaka havalandırın.",
    "steps": [
      "Güneşli, rüzgâr almayan, güneye bakan bir yer seçin; bir duvarın ya da evin güney yüzü en iyisidir.",
      "Tahtadan ya da taştan, arkası 40–60 cm, önü 25–30 cm yüksekliğinde bir kasa yapın. Üstüne eski cam pencere ya da kalın naylon gerili çerçeve koyun.",
      "Kapağı arkadan menteşeleyin; eğim güneye baksın ki güneş dik girsin ve yağmur aksın.",
      "Sıcak yastık için kasanın içini 40–50 cm kazın, altına 30 cm taze at ya da koyun gübresi bastırın, üstüne 15–20 cm toprak koyun. Gübre ısınıp alttan ısıtır; tohumu ilk ısı yatışınca ekin.",
      "Güneşli günlerde kapağı aralayın: kış ortasında bile içerisi bir saatte yanacak kadar ısınabilir. Parmağınızı topraktan çıkarınca sıcak ve buhar hissediyorsanız havalandırma geç kalmıştır.",
      "Soğuk gecelerde kapağı kapatıp üstüne hasır, eski battaniye ya da saman örtün; sabah açın.",
      "Daha büyük sera için söğüt, fındık ya da demir çubuklardan kemerler kurun, üstüne naylon gerip kenarlarını toprakla gömün; iki ucuna açılır kapı yapın.",
      "Seranın içine su dolu siyah bidonlar koyun; gündüz ısıyı alır, gece geri verir."
    ],
    "art": [null, "sf-th-soguk-cerceve", null, "sf-th-sicak-yastik", "sf-th-cerceve-havalandirma", null, null, null],
    "dont": [
      "Seranın içinde soba ya da mangal yakmayın; karbonmonoksit zehirler ve naylon tutuşur.",
      "Sıcak günlerde çerçeveyi kapalı bırakmayın; fideler birkaç saatte haşlanır.",
      "Kar yükü birikmeden naylon seranın üstünü temizleyin; yoksa çöker."
    ],
    "keywords": ["sera yapımı", "soğuk çerçeve", "sıcak yastık", "ev yapımı sera", "naylon sera", "kışın sebze", "fide yastığı", "pencereden sera", "tünel sera", "sera nasıl yapılır", "soguk cerceve", "camekan"],
    "sources": [
      "Wikipedia — Cold frame (https://en.wikipedia.org/wiki/Cold_frame)",
      "TAGEM Alata BAE — Sebzelerde fide yetiştiriciliği: sıcak yastıklar (https://arastirma.tarimorman.gov.tr/alata/Belgeler/brosurler/brosur2022/)",
      "Bayburt İl Tarım ve Orman Müdürlüğü — Ahır gübresi (at ve koyun gübresi sıcak gübre) (https://bayburt.tarimorman.gov.tr/Haber/354/Ahir-Gubresi-Muhafazasi-Ve-Uygulamasi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: birincil kaynak bulunamadı; kasa ve sıcak yastık ölçüleri doğrulanamadı. CO ve çökme uyarıları yerinde. ZAYIF kaldı." }
  },
  {
    "id": "sf-th-mantar",
    "category": "sf-th-bahce-tarla",
    "title": "Mantar yetiştirme (kültür mantarı)",
    "tag": "MANTAR",
    "summary": "Elinizdeki bilinen kültür mantarı miselini (tohumluk) pastörize samana ya da taze kesilmiş kütüğe aşılayın; yalnızca bu şekilde yetiştirdiğiniz, tanıdığınız mantarı yiyin.",
    "note": "Bu rehber yabani mantar toplamayı anlatmaz. Kendi yetiştirdiğiniz yatakta bile aşıladığınızdan farklı görünen her mantarı atın; zehirli mantar ölümcüldür.",
    "steps": [
      "Bilinen bir kültür mantarının tohumluk miselini edinin: kayın (istiridye) mantarı en kolayıdır. Misel tahıl tanelerini saran beyaz pamuk gibi bir ağdır.",
      "Saman yatağı: kıyılmış (5–10 cm) buğday samanını 65–80 °C'lik suda (elinizi bir saniye bile tutamayacağınız ama kaynamayan su) 1–2 saat bekletip pastörize edin, süzün. Avuçta sıkınca birkaç damla su çıkmalı.",
      "Soğuyan samanı temiz naylon torbaya miselle karıştırarak katlar halinde doldurun, ağzını bağlayın ve torbaya iğneyle birkaç delik açın.",
      "Torbayı karanlık, 24–27 °C'lik bir yerde 2–3 hafta bekletin; saman beyaz miselle tamamen sarılınca hazırdır.",
      "Torbada birkaç yeri kesip serin, aydınlık ve nemli yere alın. Günde 2–3 kez çevresine su püskürtün; hava nemi çok yüksek olmalı.",
      "Mantarlar 7–10 gün içinde çıkar. Şapkanın kenarı aşağı kıvrıkken, düzleşmeden dipten çevirerek koparın. Torba birkaç dalga ürün verir.",
      "Kütük yöntemi: canlı meşe ya da kayından 1 m boyunda, 10–15 cm çapında taze kütük kesin. Delikler açıp miselle doldurun, ağızlarını eritilmiş balmumuyla kapatın.",
      "Kütükleri gölgede, nemli yerde 12–15 ay bekletin. Sonra 24 saat suya batırın; 7–10 gün içinde mantar çıkar.",
      "Yeşil, siyah ya da pembe küf lekesi saran torbayı ya da kütüğü ayırıp uzaklaştırın. Mantarı her zaman iyice pişirerek yiyin."
    ],
    "art": [null, "sf-th-saman-pastorize", "sf-th-mantar-torba", null, null, "sf-th-mantar-hasat", null, null, null],
    "dont": [
      "Yatağınızda ya da kütükte kendiliğinden çıkan başka mantarları yemeyin; aşıladığınız tür olduğundan emin değilseniz atın.",
      "Yabani mantarın sporundan 'kendi tohumumu yaparım' diye yola çıkmayın; tür ayırt etmek uzman işidir.",
      "Reçineli çam kütüğü kullanmayın; misel gelişmez."
    ],
    "keywords": ["mantar yetiştirme", "kültür mantarı", "istiridye mantarı", "kayın mantarı", "samanda mantar", "kütükte mantar", "şitake", "mantar tohumu", "misel", "evde mantar", "mantar uretimi"],
    "sources": [
      "Wikipedia — Fungiculture (saman, sıcaklık, nem, kütük ölçüleri) (https://en.wikipedia.org/wiki/Fungiculture)",
      "Wikipedia — Shiitake (meşe kütüğü, iyi pişirme) (https://en.wikipedia.org/wiki/Shiitake)",
      "Cornell Üniv. — Small farms mushroom program (https://blogs.cornell.edu/mushrooms/)",
      "ICAR Mantar Araştırma Müdürlüğü (Hindistan) — Oyster mushroom (sıcak suda pastörizasyon 65–80 °C, 1–2 sa; hasat evresi) (https://dmrsolan.res.in/mushroomprofile/Oyster_Mushroom/oyster_mushroom.html)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: ICAR Mantar Araştırma Müdürlüğü sayfası ile pastörizasyon (65–70 °C'de ~1 sa, 80 °C'de 1–2 sa, saman 5–10 cm kıyılmış) ve hasat evresi (şapka kenarı içe kıvrıkken) teyit edildi; adımda sıcaklık aralığı eklendi. Kuluçka sıcaklığı ve kütük süreleri yalnız Wikipedia'ya dayanır." }
  },

  // ───────────────────────── Meyve ağaçları ─────────────────────────
  {
    "id": "sf-th-fidan-dikim",
    "category": "sf-th-meyve",
    "title": "Meyve fidanı dikimi ve ilk tepe kesimi",
    "tag": "MEYVE",
    "summary": "Fidanı kışın yaprak dökükken geniş bir çukura aşı noktası toprak üstünde kalacak şekilde dikin, can suyunu verin ve türüne göre 30–75 cm'den tepesini kesin.",
    "steps": [
      "Fidanı yapraklar döküldükten sonra, toprak donmamışken (sonbahar sonu–kış sonu) dikin. Kışı çok sert yerlerde kış sonunu bekleyin.",
      "Güneşli, suyu göllenmeyen bir yer seçin. Ağaçlar arası elma ve armutta 4–6 m, kayısı ve erikte 5–6 m, ceviz ve kestanede 10 m'den az olmasın.",
      "En az 60 cm genişliğinde ve derinliğinde çukur kazın. Üst toprağı bir yana, alt toprağı öbür yana ayırın.",
      "Çukur dibine yanmış gübreyle karışık üst toprak koyup bir tümsek yapın. Kırık ve çürük kökleri budayıp kökleri tümseğin üstüne yayın.",
      "Aşı noktası (gövdedeki kabarık yer) toprağın 5–10 cm üstünde kalsın. Çukuru doldurun, ayakla hafifçe bastırın, çevresine çanak yapıp bir kova can suyu verin.",
      "Rüzgârlı yerde fidanı bir kazığa bez şeritle 8 biçiminde, gevşek bağlayın.",
      "Tepe kesimi: dalsız fidanı dikimden sonra kesin; elmayı 60–75 cm, armudu yaklaşık 60 cm, şeftaliyi 30–50 cm yükseklikten, bir gözün hemen üstünden kesin. Cevizi 1,2–1,5 m'den kesin.",
      "İlk yaz toprağı kurutmayın, dibini 1 m çapında otlardan temiz tutup samanla örtün; gövdeyi tavşan ve keçiden korumak için tel ya da dikenle sarın."
    ],
    "art": [null, null, "sf-th-fidan-cukur", null, "sf-th-fidan-asi-noktasi", null, "sf-th-fidan-tepe-kesim", null],
    "dont": [
      "Aşı noktasını toprağa gömmeyin; kalem kök salar, aşının faydası kaybolur ya da gövde çürür.",
      "Taze gübreyi köklere değecek şekilde çukura koymayın; kökleri yakar.",
      "Kazık bağını tel ile sıkı yapmayın; büyüyen gövdeyi boğar."
    ],
    "keywords": ["fidan dikimi", "meyve fidanı nasıl dikilir", "fidan çukuru", "fidan ne zaman dikilir", "can suyu", "aşı noktası", "fidan tepe kesimi", "meyve ağacı dikme", "ağaç dikme", "fidan dikim zamani", "meyve bahcesi kurma"],
    "sources": [
      "Oregon State Üniv. Extension — PNW 400 Training and pruning your home orchard (https://extension.oregonstate.edu/catalog/pub/pnw-400-training-pruning-your-home-orchard)",
      "Bayburt İl Tarım ve Orman Müdürlüğü — Ahır gübresi (yanmış gübre) (https://bayburt.tarimorman.gov.tr/Haber/354/Ahir-Gubresi-Muhafazasi-Ve-Uygulamasi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynağı (OSU PNW 400) yeniden açılmadı; dikim aralıkları ve çukur ölçüsü doğrulanamadı, güvenlik riski düşük." }
  },
  {
    "id": "sf-th-asi-kalem",
    "category": "sf-th-meyve",
    "title": "Aşılama 1: yarma (kalem) aşısı",
    "tag": "AŞI",
    "summary": "Kışın uykudaki daldan kalem alıp serin ve nemli saklayın; ilkbaharda anacı yarıp kalemleri kabuk altı (kambiyum) çizgileri çakışacak biçimde kenarlara sokun, mumla kapatın.",
    "steps": [
      "Kalem alma: kış ortası–sonunda, ağaç yaprak dökükken, iyi meyve veren sağlıklı ağaçtan geçen yılın kurşun kalem kalınlığında sürgünlerini kesin. Ucu ve dibi atıp ortasını kullanın.",
      "Kalemleri ıslak bez ya da nemli kuma sarıp serin, donmayan bir yerde (mahzen, kar altı) aşı gününe kadar saklayın; gözleri uyanmamalı.",
      "Aşı zamanı ilkbahar başıdır, anaçta tomurcuklar kabarmaya başlarken. Anaç aynı ya da yakın tür olmalı: elmaya elma, armuda armut ya da ayva, eriğe erik, kayısı ya da şeftali.",
      "Anacı ya da dalı 2–7 cm kalınlıktaki düz bir yerinden testereyle kesin. Kesik yüzün ortasından bıçak ya da baltayla yaklaşık 3–5 cm derin yarık açın, yarığı bir kama ile açık tutun.",
      "Kalemi 3–5 gözlü bırakın. Dibini iki yandan tek ve uzun kesimlerle, bir kenarı biraz kalın kama gibi yontun; kesik yüzlere elle dokunmayın.",
      "Kalemi, kalın kenarı dışa gelecek şekilde yarığın kenarına sokun: kalemin kabuğunun hemen altındaki yeşil tabaka, anacın kabuk altı yeşil tabakasıyla çakışmalı. Öbür kenara ikinci bir kalem koyun.",
      "Kamayı çekin; anaç kalemleri sıkıştırır. Kesik yüzü, yarığı ve kalemin tepesini aşı macunu, balmumu-reçine karışımı ya da kil ile tamamen kapatın.",
      "Birkaç hafta sonra kalem gözleri sürerse aşı tutmuştur. Anaçtan çıkan sürgünleri düzenli kırın; iki kalem de tuttuysa sonraki yıl zayıfını kesin."
    ],
    "art": [null, null, null, "sf-th-yarma-acma", "sf-th-kalem-yontma", "sf-th-yarma-kambiyum", null, null],
    "dont": [
      "Kalemi ters takmayın; gözler yukarı bakmalı.",
      "Kesik yüzleri kurumaya ve toza bırakmayın; aşıyı bir dakikadan kısa sürede bitirip kapatın.",
      "Bıçağı kendinize doğru çekmeyin; aşı bıçağı derin kesik yapar."
    ],
    "keywords": ["yarma aşı", "kalem aşısı", "meyve ağacı aşılama", "aşı nasıl yapılır", "ağaç aşılama", "kalem alma", "aşı macunu", "elma aşısı", "yabani ağaca aşı", "çöğür aşılama", "asi yapma"],
    "sources": [
      "Wikipedia — Grafting: cleft graft, whip and tongue (https://en.wikipedia.org/wiki/Grafting)",
      "RHS — Chip budding (kambiyum çakıştırma ve bağlama) (https://www.rhs.org.uk/propagation/chip-budding)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: Türkçe resmî aşı broşürü bu turda da bulunamadı; teyit Wikipedia ve RHS'ye dayanır. ZAYIF kaldı, güvenlik riski düşük." }
  },
  {
    "id": "sf-th-asi-goz",
    "category": "sf-th-meyve",
    "title": "Aşılama 2: göz (yonga göz) aşısı",
    "tag": "AŞI",
    "summary": "Yaz ortası–sonbahar başı, aynı yılın olgun sürgününden bir gözü ince bir odun yongasıyla çıkarıp anaçta açtığınız aynı şekilli yuvaya oturtun ve sıkıca sarın.",
    "steps": [
      "Zaman yaz ortası ile sonbahar başı arasıdır. Aşı yapacağınız ağaçtan bu yıl büyümüş, olgunlaşmış, çiçek gözü taşımayan ve anaçla aynı kalınlıkta bir sürgün (göz çubuğu) kesin.",
      "Göz çubuğundaki yaprakları, 3–4 mm sap bırakarak kesin; yumuşak ucu atın. Çubuğu nemli bezde tutun.",
      "Anacın dibindeki 30 cm'lik bölümü dal ve yapraklardan temizleyin. Aşıyı yerden yaklaşık 15 cm yükseğe yapacaksınız.",
      "Gözün 2 cm altından, yaklaşık 30 derece açıyla 5 mm derine bir kesik yapın. Gözün 4 cm üstünden aşağı doğru ikinci kesikle ilkine ulaşıp yongayı çıkarın; gözü zedelemeyin.",
      "Anaçta aynı açı ve boyutta iki kesik yapıp aradaki odun parçasını çıkarın; yonga bu yuvaya tam otursun.",
      "Yongayı yerleştirin; kenarlarındaki kabuk altı yeşil tabaka anacınkiyle mümkün olduğunca çakışsın, en az bir kenarda tam çakışsın.",
      "Birleşimi aşı bandı ya da ince naylon şeritle sıkıca sarın; gözü ve yaprak sapını açıkta bırakın.",
      "Göz şişmeye başlayınca bağı çözün. Ertesi ilkbahar anacı gözün hemen üstünden kesin, çıkan sürgünü bir çubuğa bağlayın; anaçtan çıkan diğer sürgünleri kırın."
    ],
    "art": [null, null, null, "sf-th-yonga-kesim", "sf-th-yonga-yuva", null, "sf-th-goz-sarma", null],
    "dont": [
      "Gözü sararken üstünü bantla kapatmayın; göz sürünce boğulur.",
      "Bağı unutup yaz boyu bırakmayın; büyüyen dal bağı içine yer, aşı kırılır.",
      "Kirli, kör bıçak kullanmayın; ezilmiş doku kaynaşmaz ve hastalık bulaşır."
    ],
    "keywords": ["göz aşısı", "yonga göz aşısı", "durgun göz aşısı", "t aşısı", "yaz aşısı", "ağaca göz aşısı", "aşı bandı", "göz çubuğu", "meyve aşılama yaz", "goz asisi", "budding"],
    "sources": [
      "RHS — Chip budding (https://www.rhs.org.uk/propagation/chip-budding)",
      "Wikipedia — Grafting: bud grafting (https://en.wikipedia.org/wiki/Grafting)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynağı (RHS) yeniden açılmadı; teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-budama-genc",
    "category": "sf-th-meyve",
    "title": "Budama 1: genç ağaca şekil verme",
    "tag": "BUDAMA",
    "summary": "İlk 3–4 kış ağaca iskelet kurun: elma ve armutta bir ana gövde etrafında dallar, şeftali ve kayısıda ortası açık 3–4 ana dal bırakın.",
    "steps": [
      "Budamayı şiddetli kış soğukları geçince, ilkbahar sürgünü başlamadan önce, yaprak dökükken yapın.",
      "İki tür kesimi bilin: uç alma (dalın bir kısmını kesmek) altında yeni dal çıkarır; seyreltme (dalı çıktığı yerden tümden almak) içini açar ve ışık sokar.",
      "Elma ve armut (merkezi lider): ortadaki en güçlü dikey dalı lider bırakın, her kış üçte birini uçtan alın. Lidere rakip dik dalları çıkarın ya da yana bağlayın.",
      "Şeftali, kayısı, erik (ortası açık): ilk kış gövdenin çevresinde dört yöne bakan 3–4 ana dal seçin, aralarında en az 20 cm yükseklik farkı olsun; ortadaki lideri kesin.",
      "Dalların gövdeyle yaptığı açı 45–60 derece olmalı. Dar açılı, dik dalları gençken iple ya da tahta aralıkla açın; dar çatallar ileride meyve yüküyle yarılır.",
      "Kesimi dal dibindeki kabarık halkanın (dal yakası) hemen dışından yapın; ne gövdeye sıfır kesin ne de güdük bırakın.",
      "Genç ağacı hafif budayın; yaprak alanı büyümeyi besler. Ağacın kökünden ve gövdesinden çıkan dik sürgünleri yazın küçükken elle kırın."
    ],
    "art": [null, null, "sf-th-merkezi-lider", "sf-th-ortasi-acik", null, "sf-th-dal-yakasi", null],
    "dont": [
      "Ağır kar ve dondan hemen önce budamayın; taze yaralar dondan zarar görür.",
      "Kalın dalı tek kesimle almayın; ağırlığıyla kabuğu yırtar. Önce alttan kısmen, sonra üstten kesin.",
      "Merdivensiz ya da çürük dala basarak tepeye tırmanmayın; düşmeler ciddi yaralanma yapar."
    ],
    "keywords": ["genç ağaç budama", "şekil budaması", "fidan budama", "terbiye budaması", "merkezi lider", "goble budama", "ortası açık budama", "meyve ağacı şekil", "dal açısı", "budama nasıl yapılır", "budama zamani"],
    "sources": [
      "Oregon State Üniv. Extension — PNW 400 Training and pruning your home orchard (https://extension.oregonstate.edu/catalog/pub/pnw-400-training-pruning-your-home-orchard)",
      "Wikipedia — Grafting (anaç sürgünlerini temizleme) (https://en.wikipedia.org/wiki/Grafting)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynağı (OSU PNW 400) yeniden açılmadı; düşme ve kalın dal uyarıları yerinde." }
  },
  {
    "id": "sf-th-budama-olgun",
    "category": "sf-th-meyve",
    "title": "Budama 2: meyve veren ağacın kış budaması",
    "tag": "BUDAMA",
    "summary": "Her kış önce kuru, hastalıklı ve kırık dalları, sonra iç içe geçen ve içe büyüyen dalları ve su sürgünlerini alın; ağacın içine ışık girsin.",
    "steps": [
      "Kış sonunda, yaprak dökükken ve sert don geçmişken budayın. Kirazı yaz sonunda (Ağustos) budamak hastalık riskini azaltır.",
      "Önce kuru, hastalıklı ve kırık dalların hepsini sağlam odunun içinden kesin.",
      "Birbirine sürtünen ve çaprazlanan dallardan zayıf olanı alın. Ağacın ortasına doğru büyüyen dalları çıkarın.",
      "Dallarda ve gövdede dimdik çıkan bir yıllık su sürgünlerini dibinden alın; çok sayıdaysa bir kısmını bırakıp yatırın.",
      "Ağacın üst kısmını daha çok seyreltin; alttaki dallar ışık almazsa meyve vermez.",
      "Şeftali önceki yılın sürgünlerinde meyve verir: her yıl geçen yılki büyümenin yarısına kadarını alın ki yeni meyve dalları çıksın.",
      "Elmada kısa, buruşuk meyve dallarını (kısa sürgünleri) koruyun; bunlar yıllarca meyve verir.",
      "Kesimleri dal yakasının dışından yapın. Hastalıklı dalı kestikten sonra makası alkol ya da çamaşır sulu suyla silin. Kesilen hastalıklı dalları bahçeden çıkarın."
    ],
    "art": [null, null, "sf-th-capraz-dal", "sf-th-su-surgunu", null, "sf-th-seftali-budama", null, null],
    "dont": [
      "Bir kışta ağacı aşırı budamayın; çok sayıda su sürgünü çıkar ve meyve yılı kaçar.",
      "Ağaç kesimi gerekiyorsa çevrede insan, hayvan ve elektrik hattı olmadığından emin olun.",
      "Islak havada hastalıklı ağacı budamayın; mikrop kesiklerden yayılır."
    ],
    "keywords": ["kış budaması", "meyve ağacı budama", "yaşlı ağaç budama", "su sürgünü", "kuru dal kesme", "elma budama", "şeftali budama", "budama zamanı", "dal yakası", "verim budaması", "agac budama"],
    "sources": [
      "Oregon State Üniv. Extension — PNW 400 Training and pruning your home orchard (https://extension.oregonstate.edu/catalog/pub/pnw-400-training-pruning-your-home-orchard)",
      "Clemson Üniv. HGIC — hastalıklı bitki artıklarını uzaklaştırma (https://hgic.clemson.edu/factsheet/insecticidal-soaps-for-garden-pest-control/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: yazar kaynağı (OSU PNW 400) yeniden açılmadı; teyit yazar kaydına dayanır." }
  },

  // ───────────────────────── Hayvancılık ve arıcılık ─────────────────────────
  {
    "id": "sf-th-tavuk-kumes",
    "category": "sf-th-hayvan",
    "title": "Tavuk 1: kümes, yem ve yumurta",
    "tag": "TAVUK",
    "summary": "Metrekareye en fazla 3 tavuk düşen, tüneği ve folluğu olan, yırtıcıya kapalı kuru bir kümes kurun; temiz su, tahıl, mutfak artığı ve kabuk kalsiyumu verin.",
    "steps": [
      "Kümesi kuru, hafif eğimli, gübre yığını ve tuvaletten uzak yere kurun. İçeride metrekareye en fazla 3 yumurtacı tavuk olsun.",
      "Tünek: tavuk başına 25 cm yer, 2–3 cm kalınlıkta yuvarlak sırıklar. İlk sırık arka duvardan 20–25 cm, sonrakiler 30–40 cm aralıklı olsun.",
      "Folluk: her 5 tavuğa bir, kenarı yaklaşık 30 cm'lik saman dolu kutu. Folluğu karanlık, sakin köşeye koyun ve yerini değiştirmeyin.",
      "Havalandırma için çatıyı duvarlardan yaklaşık 1 m taşırın, açıklıkları tel ile kapatın. Kapı ve duvardaki bütün delikleri kapatın; tilki, sansar ve fare girmesin. Tavukları her akşam kapatın.",
      "Temiz suyu her gün tazeleyin; sıcakta yumurtacı tavuk başına günde yarım litreye yakın su içer.",
      "Yem: gün içinde otlayıp böcek toplayan tavuğa sabah ve öğleden sonra tavuk başına 35–80 g tahıl (buğday, arpa, mısır kırığı) verin; mutfak artığı ekleyin.",
      "Yumurtacı tavuğa ezilmiş yumurta kabuğu, deniz kabuğu ya da yakılıp ezilmiş kemik koyun; kalsiyumsuz tavuk ince kabuklu yumurtlar.",
      "Yumurtaların çoğu sabah ile öğle arası yumurtlanır; günde en az bir kez öğleden sonra toplayın.",
      "Yerleri her gün süpürün, altlığı ıslandıkça değiştirin. Yeni gelen tavukları sürüye katmadan önce en az 15 gün ayrı tutun."
    ],
    "art": [null, "sf-th-kumes-tunek", "sf-th-kumes-folluk", "sf-th-kumes-yirtici", null, null, null, null, null],
    "dont": [
      "Küflü yem, küflü yer fıstığı ve çiğ soya vermeyin; küf zehri ve sindirim engelleyiciler tavuğu hasta eder.",
      "Ördek, kaz ve tavukları aynı gece kümesinde tutmayın; hastalık taşırlar.",
      "Kümesi temizledikten sonra elinizi sabunla yıkamadan yemek yemeyin; tavuk dışkısı Salmonella taşır."
    ],
    "keywords": ["tavuk bakımı", "kümes yapımı", "tavuk kümesi", "tünek", "folluk", "tavuk yemi", "yumurta tavuğu", "tavuk ne yer", "kümes kaç metrekare", "tilki kümes", "köy tavuğu", "tavuk besleme"],
    "sources": [
      "FAO — Small-scale poultry production, Bölüm 4 genel yönetim (https://www.fao.org/4/y5169e/y5169e05.htm)",
      "FAO — Small-scale poultry production, Bölüm 3 yem (https://www.fao.org/4/y5169e/y5169e04.htm)",
      "FAO — Small-scale poultry production, Bölüm 6 sağlık (https://www.fao.org/4/y5169e/y5169e07.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO bölüm 4 yeniden açılmadı; bölüm 5 açıldı (aynı el kitabı). Salmonella ve küflü yem uyarıları yerinde." }
  },
  {
    "id": "sf-th-tavuk-kulucka",
    "category": "sf-th-hayvan",
    "title": "Tavuk 2: kuluçka ve civciv",
    "tag": "TAVUK",
    "summary": "Kuluçkaya yatan iri, sağlıklı tavuğun altına en fazla 7 günlük, döllü 10–14 yumurta koyun; 21 günde civciv çıkar.",
    "steps": [
      "Horozla birlikte yaşayan tavukların yumurtasını kullanın; horozsuz yumurta döllü değildir.",
      "Kuluçka yumurtalarını temiz, çatlaksız, orta büyüklükte seçin. Serin yerde (12–14 °C) sivri ucu aşağı saklayın ve 7 günden eskisini koymayın.",
      "Folluğunda gece de kalkmayan, kabarıp gıdaklayan iri ve sağlıklı tavuğu seçin. Kuluçka yerini sakin, karanlık köşede hazırlayın.",
      "Tavuğun altına büyüklüğüne göre 10–14 yumurta koyun; fazlası soğur ve çıkış düşer. Kurak yerde yuvanın altına biraz nemli toprak serin.",
      "Yem ve suyu yuvanın hemen yanına koyun ki tavuk uzun süre kalkmasın ve zayıflamasın.",
      "Yaklaşık 7. günde yumurtaları karanlıkta güçlü bir fenerle ışığa tutun: damar ağı görünen döllüdür; tamamen berrak olanları çıkarın.",
      "Civcivler 20–21. günde çıkar. Çıkışa yardım etmeye kalkmayın; kabuğu soymak civcivi öldürebilir.",
      "Civcivlere ilk iki ay büyük tavukların giremediği bir bölmede ufak kırma tahıl, temiz su ve böcek verin. Suyu sığ kapta verin ya da içine çakıl koyun ki boğulmasınlar."
    ],
    "art": [null, null, null, "sf-th-kulucka-yuva", null, "sf-th-yumurta-isik", null, "sf-th-civciv-bolme"],
    "dont": [
      "Kuluçkadaki tavuğu sık sık rahatsız etmeyin, yumurtaları elle çevirmeyin; tavuk bunu kendisi yapar.",
      "Çürük kokan ya da çatlamış yumurtayı yuvada bırakmayın; patlayıp diğerlerini mikroplar."
    ],
    "keywords": ["kuluçka", "tavuk kuluçkaya yattı", "civciv çıkarma", "kaç günde civciv çıkar", "döllü yumurta", "yumurta ışığa tutma", "kuluçka tavuğu", "civciv bakımı", "gurk tavuk", "kulucka", "civciv yemi"],
    "sources": [
      "FAO — Small-scale poultry production, Bölüm 5 kuluçka (https://www.fao.org/4/y5169e/y5169e06.htm)",
      "FAO — Small-scale poultry production, Bölüm 3 civciv besleme (https://www.fao.org/4/y5169e/y5169e04.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO bölüm 5 yeniden açıldı; 12–14 °C, en çok 7 gün, yuva başına en fazla 14–16 ama 10 üstünde çıkış düşer, 20–21 gün, bir haftada ışığa tutma teyit edildi." }
  },
  {
    "id": "sf-th-tavsan",
    "category": "sf-th-hayvan",
    "title": "Tavşan yetiştirme",
    "tag": "TAVŞAN",
    "summary": "Her yetişkin tavşanı en az 75x75x50 cm'lik ayrı kafeste tutun, dişiyi 6–7 aylıkken çiftleştirin; 31–32 gün sonra doğum olur, yavrular 30 günde sütten kesilir.",
    "steps": [
      "Her yetişkin dişi ve erkek için en az 75 cm eninde, 75 cm derinliğinde, 50 cm yüksekliğinde ayrı kafes yapın. Yan ve tavanı 2,5x5 cm, tabanı 1,2x2,5 cm tel olsun ki dışkı düşsün.",
      "Kafesleri gölgede, yağmur ve rüzgârdan korunaklı, havadar yere koyun. Tavşanlar aşırı sıcak ve soğuğa dayanıksızdır; yazın gölge ve serinlik şarttır.",
      "Her gün temiz su verin; yavrulu bir dişi sıcakta günde 4 litreye yakın içer. Yem olarak bol kuru ot, taze ot, yaprak ve biraz tahıl verin.",
      "Orta iri ırklarda dişiyi 6–7 aylıkken çiftleştirin; erkek bir ay geç olgunlaşır. Dişiyi erkeğin kafesine götürün, çiftleşmeden sonra geri alın. Bir erkek 10 dişiye yeter, haftada 2–3 kezden fazla kullanılmasın.",
      "Çiftleşmeden 28 gün sonra kafese saman dolu bir yavru kutusu koyun. Doğum 31–32. günde olur; dişi kendi tüyünü yolup yuva yapar.",
      "Doğumdan 48 saat sonra yavruları sayıp ölü olanı çıkarın. Bir batında ortalama 8–10 yavru olur.",
      "Yavru kutusunu doğumdan 5–21 gün sonra kaldırın. Yavruları yaklaşık 30 günlükken anneden ayırın.",
      "Burun akıntısı, hapşırma, ishal ya da yemden kesilme gören tavşanı hemen ayrı yere alın, kafesini yıkayıp güneşte kurutun."
    ],
    "art": ["sf-th-tavsan-kafes", null, null, null, "sf-th-tavsan-yavru-kutusu", null, null, null],
    "dont": [
      "İki erkeği ya da iki yetişkin dişiyi aynı kafeste tutmayın; kavga edip birbirini yaralarlar.",
      "Tavşanı kulaklarından tutup kaldırmayın; ense derisinden tutup kalçasını destekleyin.",
      "Islak, çiğli taze otu çok miktarda birden vermeyin; şişkinlik ve ishal yapar."
    ],
    "keywords": ["tavşan yetiştirme", "tavşan kafesi", "tavşan bakımı", "tavşan kaç günde doğurur", "tavşan çiftleştirme", "yavru kutusu", "tavşan ne yer", "tavşan üretimi", "et tavşanı", "tavsan yetistirme", "tavşan yavrusu"],
    "sources": [
      "Penn State Üniv. Extension — Rabbit production (https://extension.psu.edu/rabbit-production)",
      "FAO — Small-scale poultry production, Bölüm 6 (yeni hayvan karantinası ve hasta hayvan ayırma ilkeleri) (https://www.fao.org/4/y5169e/y5169e07.htm)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: PSU tavşan sayfası yeniden açılmadı; tavşana özgü ikinci kaynak yok. Teyit yazar kaydına dayanır." }
  },
  {
    "id": "sf-th-keci-koyun",
    "category": "sf-th-hayvan",
    "title": "Keçi ve koyun bakımı",
    "tag": "KÜÇÜKBAŞ",
    "summary": "Küçükbaşları kuru ve havadar ağılda, bol kaba yemle besleyin; gebelik yaklaşık 5 aydır, yeni hayvanı 30 gün ayrı tutun, tırnak ve parazit belirtilerini düzenli kontrol edin.",
    "note": "Türkiye'de olağan koşullarda koyun-keçi bulunduran her işletme il/ilçe tarım müdürlüğüne tescil edilmeli, hayvanlar doğumdan en geç bir yıl içinde (işletmeden daha önce çıkacaksa çıkmadan önce) küpeyle tanımlanmalıdır; bu bilgi yalnız gerçek hayatta kalma durumu içindir. Doğum ve düşük atıkları Malta humması bulaştırır.",
    "steps": [
      "Ağılı kuru, cereyansız ama havadar yapın; altlığı (saman, kuru yaprak) ıslandıkça değiştirin. Islak zemin tırnak çürüğü yapar.",
      "Çiti en az 120 cm yüksek yapın; keçiler tırmanır ve dar aralıktan geçer.",
      "Yemin büyük kısmı kaba yem olsun: mera otu, kuru ot, yaprak ve dal. Çok süt veren keçiye her 1–1,5 kg süte yaklaşık 0,5 kg tahıl ekleyin.",
      "Keçi 4–5 ayda kızgınlık gösterir ama dişiyi yetişkin ağırlığının yaklaşık üçte ikisine ulaşınca, genellikle 7–10 aylıkken çiftleştirin. Keçide gebelik ortalama 149, koyunda yaklaşık 150 gündür.",
      "Doğumda yavru ilk saatlerde annesinin ağız sütünü (kolostrum) emmeli; emmiyorsa annenin sütünü sağıp yavruya içirin.",
      "Tırnakları birkaç ayda bir kontrol edip uzayan kısmı keskin bıçak ya da makasla kesin; kötü kokan, akıntılı tırnağı olan hayvanı ayırın.",
      "İç parazit belirtileri: zayıflama, mat ve kabarık tüy, ishal, göz kapağının içinin soluk (pembe yerine beyazımsı) olması. Böyle hayvanı ayırın, otlağını değiştirin.",
      "Doğumdan önce dişinin vücut kondisyonu orta olmalı: omurga ve kaburgalar elle hafif bastırınca hissedilmeli, gözle görünmemeli.",
      "Dışarıdan gelen her hayvanı sürüye katmadan önce 30 gün ayrı tutun."
    ],
    "art": ["sf-th-agil", null, null, null, "sf-th-kolostrum", "sf-th-tirnak-kesim", null, null, null],
    "dont": [
      "Aç hayvanı birden bol taze yoncaya ya da tahıla salmayın; işkembe şişer ve hayvan ölebilir.",
      "Atık plastik, naylon ve boya bulaşmış yemi ortada bırakmayın; keçiler her şeyi ağızlar.",
      "Ölen, düşük yapan hayvana, ölü yavruya ve yavru zarına (son) çıplak elle dokunmayın; eldiven ya da naylon torba kullanın, sonra eli sabunla yıkayın ve atıkları derin gömün. Malta humması (bruselloz) böyle bulaşır."
    ],
    "keywords": ["keçi bakımı", "koyun bakımı", "küçükbaş", "ağıl", "keçi kaç ayda doğurur", "koyun gebelik süresi", "tırnak kesimi", "kolostrum ağız sütü", "kuzu bakımı", "oğlak bakımı", "keçi yemi", "koyun parazit"],
    "sources": [
      "Penn State Üniv. Extension — Dairy goat production (https://extension.psu.edu/dairy-goat-production)",
      "FAO — Guidelines for slaughtering: treatment of livestock (yalnız sağlıklı hayvan) (https://www.fao.org/4/t0279e/T0279E04.htm)",
      "Koyun ve Keçi Türü Hayvanların Tanımlanması, Tescili ve İzlenmesi Yönetmeliği, RG 02.12.2011/28130, md. 13, 31, 32 (https://orgtr.org/koyun-ve-keci-turu-hayvanlarin-tanimlanmasi-tescili-ve-izlenmesi-yonetmeligi/)",
      "WHO — Brucellosis bilgi notu (https://www.who.int/news-room/fact-sheets/detail/brucellosis)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: PSU yeniden açıldı (48 inç çit, 145–155/ort. 149 gün, 7–10 ay ve 70–80 lb, 1 lb tahıl/2,5–3 lb süt, 30 gün karantina, parazit belirtileri). Küpe ve tescil zorunluluğu Koyun ve Keçi Türü Hayvanların Tanımlanması Yönetmeliği md. 13, 31, 32 ile doğrulandı ve note düzeltildi. Bruselloz bulaşı (son, fetüs) WHO ile teyit edildi. Koyun gebeliği ve kolostrum zamanı kaynaklı değil." }
  },
  {
    "id": "sf-th-sagim",
    "category": "sf-th-hayvan",
    "title": "Keçi ve koyun sağımı",
    "tag": "SÜT",
    "summary": "Temiz elle, memeyi yıkayıp kurulayın, ilk damlaları ayrı kaba sağıp kontrol edin, sütü süzüp hemen soğutun ve kaynatmadan içmeyin.",
    "note": "Çiğ süt ve çiğ sütten yapılan taze peynir, tulum, kaymak Türkiye'de sık görülen Malta hummasını (bruselloz) ve başka hastalıkları bulaştırır. İçmeden önce sütü taşacak gibi kabarana dek kaynatın; peynir ve yoğurt için de sütü önce kaynatın.",
    "steps": [
      "Her sağımı günün aynı saatlerinde, sabah ve akşam yapın. Hayvanı yerden 40–45 cm yüksek bir sağım sehpasına çıkarıp başını bağlayın; önüne biraz yem koyun.",
      "Ellerinizi sabunla yıkayın, tırnaklarınızı kısa tutun. Memeyi ılık suyla yıkayıp temiz bezle kurulayın.",
      "İlk 2–3 fışkırmayı ayrı, koyu renkli bir kaba sağın. Pıhtı, kan ya da sulu süt varsa ve meme sıcak, şiş ve ağrılıysa o hayvanda meme iltihabı vardır: sütünü ayrı sağıp dökün.",
      "Sağım: başparmak ve işaret parmağıyla memenin dibini sıkıp sütün geri kaçmasını önleyin, sonra öbür parmakları sırayla kapatarak sütü aşağı itin. Memeyi çekmeyin.",
      "Meme boşalıp yumuşayana kadar sağın; içeride kalan süt iltihaba yol açar.",
      "Sağımdan sonra meme uçlarını temiz suyla silin ve hayvanı yarım saat yatmasın diye ayakta tutun (yem verin); meme deliği kapanana kadar mikrop girebilir.",
      "Sütü temiz bezden süzüp kaynamış ve kurutulmuş kaba alın. Hemen soğuk suya ya da dereye oturtarak soğutun; 4 °C'nin altı en iyisidir.",
      "Sütü içmeden önce kaynatın. Sağım kaplarını her kullanımdan sonra sıcak suyla yıkayıp ağzı aşağı güneşte kurutun."
    ],
    "art": ["sf-th-sagim-sehpa", null, null, "sf-th-sagim-el", null, null, "sf-th-sut-sogutma", null],
    "dont": [
      "Meme iltihaplı hayvanın sütünü içmeyin, yavrulara da vermeyin.",
      "Sütü sıcakta saatlerce bekletmeyin; birkaç saatte bozulur.",
      "Hasta görünen hayvanın sütünü kaynatsanız bile içmeyin."
    ],
    "keywords": ["keçi sağımı", "koyun sağımı", "süt sağma", "nasıl sağılır", "meme iltihabı", "mastitis", "çiğ süt içilir mi", "süt soğutma", "sağım hijyeni", "elle sağım", "sut sagma", "malta humması"],
    "sources": [
      "Penn State Üniv. Extension — Dairy goat production (sağım sehpası 15–18 inç, 40 °F altı soğutma, meme iltihabı) (https://extension.psu.edu/dairy-goat-production)",
      "FAO — Guidelines for slaughtering and further processing: genel hijyen kuralları (https://www.fao.org/4/t0279e/T0279E02.htm)",
      "WHO — Brucellosis bilgi notu (çiğ süt ve peynir, pastörizasyon) (https://www.who.int/news-room/fact-sheets/detail/brucellosis)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: PSU yeniden açıldı (sehpa 15–18 inç, hemen soğutma ve 40 °F/4 °C altı). WHO: brusellozun çoğu keçi-koyunun pastörize edilmemiş süt ve peynirinden; note çiğ süt peynirini kapsayacak biçimde genişletildi. Sağım tekniği ve ilk süt kontrolü kaynaklı değil." }
  },
  {
    "id": "sf-th-kirkim",
    "category": "sf-th-hayvan",
    "title": "Koyun kırkımı",
    "tag": "KIRKIM",
    "summary": "Koyunu yılda bir, ilkbaharda kuru yapağıyla temiz zeminde kırkın; makası deriye paralel tutun, kırkılan koyunu soğuk ve yağmurlu havada barınakta tutun.",
    "steps": [
      "Kırkımı yılda bir kez, ilkbahar sonu ya da yaz başında, soğukların geçtiği ve yağmursuz bir dönemde yapın. Kışı çok sert yerlerde kuzulamadan sonra kırkın.",
      "Kırkımdan önceki gece koyunları kapalı ve kuru yerde tutun; yapağı kuru olmalı. Kırkımdan 8–12 saat önce yemi kesin, koyun daha rahat çevrilir.",
      "Temiz bir branda ya da süpürülmüş tahta zemin hazırlayın; saman ve toprak yapağıya karışmasın. Makası bileyin.",
      "Koyunu sırtüstü kalçası üstüne oturtup sırtını dizlerinize yaslayın; bu durumda çoğu koyun çırpınmaz.",
      "Önce karın yapağısını ayrı alın. Sonra makası deriye paralel ve deriye yakın tutarak boyun, omuz, yan ve sırt yönünde uzun vuruşlarla ilerleyin; deriyi başparmakla gerin.",
      "Meme, erkeklik organı, kulak ve deri kıvrımlarının çevresinde çok yavaş çalışın; kesik olursa temizleyip sinekten koruyun.",
      "Yapağıyı temiz tarafı aşağı gelecek şekilde serip kirli kenarları ayıklayın, katlayıp kuru yerde saklayın.",
      "Kırkılan koyunu soğuk, ıslak ve rüzgârlı havada birkaç gece barınakta tutun; özellikle genç koyunlar üşür."
    ],
    "art": [null, null, null, "sf-th-kirkim-oturtma", null, null, "sf-th-yapagi-serme", null],
    "dont": [
      "Islak yapağıyı kırkıp torbalamayın; küflenir ve çürür.",
      "Koyunu kırkımdan sonra soğuk yağmura bırakmayın; zatürre ve ölüm görülür.",
      "Gebeliğin son haftalarındaki koyunu sert çevirip sıkıştırmayın; yavru atabilir."
    ],
    "keywords": ["koyun kırkımı", "kırkım nasıl yapılır", "yün kırkma", "yapağı", "koyun ne zaman kırkılır", "kırkım makası", "koyun yünü kesme", "kirkim", "yün alma", "koyun tıraşı"],
    "sources": [
      "Wikipedia — Sheep shearing (zamanlama, blade shears, kırkım sonrası soğuk) (https://en.wikipedia.org/wiki/Sheep_shearing)",
      "Penn State Üniv. Extension — Dairy goat production (küçükbaş bakımında hijyen ve hayvan ayırma) (https://extension.psu.edu/dairy-goat-production)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: birincil kaynak bulunamadı; teyit Wikipedia'ya dayanır. ZAYIF kaldı, güvenlik riski orta (hayvan refahı), insan için düşük." }
  },
  {
    "id": "sf-th-ari-kovan",
    "category": "sf-th-hayvan",
    "title": "Arıcılık 1: kovan kurma ve oğul alma",
    "tag": "ARICILIK",
    "summary": "Tahtadan üst çıtalı bir kovan yapıp içini balmumuyla ovun; suya ve çiçeğe yakın, rüzgâr ve sert güneşten korunaklı yere koyup oğul yakalayın.",
    "note": "Türkiye'de olağan koşullarda arıcı, işletmesini ve kolonilerini il/ilçe tarım müdürlüğüne kaydettirip Arıcılık Kayıt Sistemi'nden (AKS) kovan plakası almak zorundadır; tanımlanmamış koloni taşınamaz. Bu bilgi yalnız gerçek hayatta kalma durumu içindir. Arı sokmasına alerjisi olan kişi kovana yaklaşmasın.",
    "steps": [
      "Koruyucu giysi hazırlayın: geniş kenarlı şapkaya tül yüz örtüsü dikin, kollara ve paçalara lastik geçirin, eldiven yoksa elinize naylon torba geçirip bilekten bağlayın.",
      "Körük ya da duman kabı için kuru inek tezeği, çuval bezi, mısır koçanı ya da karton kullanın; alevsiz, serin duman çıkmalı.",
      "Üst çıtalı kovan yapın: tahtadan uzun bir sandık ve üstüne yan yana dizilen çıtalar. Çıta genişliği bölgenizdeki yabani kovandaki petek aralığı kadar olsun; Avrupa arısında yaklaşık 35 mm.",
      "Her çıtanın altına ortası boyunca ince bir balmumu şeridi sürün; arılar peteği bu çizgiye örer. Kovanın içini de balmumuyla ovun; koku oğul çeker.",
      "Kovanı suya ve bol çiçekli ağaç, çalıya yakın; rüzgâr ve öğle güneşinden korunaklı, insanların ve hayvanların geçmediği bir yere koyun.",
      "Oğul ilkbahar sonu ve yaz başında ağaç dalına salkım gibi asılır. Altına kutu ya da kovanı tutup dalı tek ve sert bir sarsışla silkeleyin, kapağı yavaşça kapatın.",
      "Kutuyu akşama kadar oğulun yanında, giriş deliği açık bırakın; dışarıdakiler içeri yürürse ana arı içeridedir. Akşam kovan yerine taşıyın.",
      "Yerel arıcılardan yardım alın; arıları, anaları ve kullanılmış kovanları başka bölgeden getirmeyin, hastalık taşırlar."
    ],
    "art": ["sf-th-ari-giysi", null, "sf-th-ust-citali-kovan", null, null, "sf-th-ogul-silkeleme", null, null],
    "dont": [
      "Kovanın girişinin önünde durmayın, ani hareket yapmayın ve arılara üflemeyin.",
      "Deride kalan arı iğnesini parmakla sıkıp çekmeyin; zehir kesesi boşalır. Tırnakla ya da bıçak sırtıyla hemen sıyırarak çıkarın.",
      "Koruyucu tülsüz oğul almaya kalkmayın; yüz ve boğaz sokmaları solunumu tıkayabilir.",
      "Çok sayıda sokma alan ya da nefes darlığı, yüz şişmesi olan kişiyi bekletmeyin; ulaşılabiliyorsa hemen sağlık yardımı arayın."
    ],
    "keywords": ["arıcılık", "kovan yapımı", "oğul alma", "oğul yakalama", "üst çıtalı kovan", "arı nasıl beslenir", "arı kovanı nereye konur", "arıcı giysisi", "körük", "arı kovanı", "aricilik", "ogul"],
    "sources": [
      "FAO — Beekeeping and sustainable livelihoods: how to keep bees (https://www.fao.org/4/y5110e/y5110e0b.htm)",
      "FAO — Beekeeping and sustainable livelihoods: equipment (https://www.fao.org/4/y5110e/y5110e0c.htm)",
      "Arıcılık Yönetmeliği, RG 23.05.2024, md. 8–9 (https://www.alomaliye.com/2024/05/23/aricilik-yonetmeligi-2024)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO yeniden açıldı (çıta genişliği Avrupa arısı ~35 mm, Afrika 32 mm; duman yakıtları; balmumuyla ovma; yer seçimi). Kayıt zorunluluğu Arıcılık Yönetmeliği (2024) md. 8–9 ile doğrulandı: işletme ve koloni kaydı, AKS ve kovan plakası; note düzeltildi. İğne çıkarma uyarısı eklendi." }
  },
  {
    "id": "sf-th-ari-bal",
    "category": "sf-th-hayvan",
    "title": "Arıcılık 2: bal hasadı ve balmumu",
    "tag": "ARICILIK",
    "summary": "Yalnız arıların mumla kapattığı olgun bal peteklerini, kışlık balı kovanda bırakarak alın; peteği ezip tülbentten süzün ve ağzı sıkı kapta saklayın.",
    "steps": [
      "Hasadı nektar akımının bittiği yaz sonunda, sakin, güneşli ve ılık bir günün öğle saatlerinde yapın; tarlacı arılar dışarıdadır.",
      "Koruyucu giysiyi giyin. Kovan girişine ve çıtaların arasına birkaç nefes serin duman verin, bir iki dakika bekleyin.",
      "Çıtaları tek tek, yavaşça kaldırın. Yalnız büyük kısmı mumla kapatılmış (sırlanmış) bal peteklerini alın; kapanmamış bal sulu ve ham olup bozulur.",
      "Yavru (larva ve kapalı pembe-kahve gözler) bulunan petekleri asla almayın. Kışlık için kovanda bol miktarda kapalı bal petekleri bırakın; soğuk bölgelerde daha fazla.",
      "Peteğin üstündeki arıları kaz tüyü ya da yumuşak bir dal ile nazikçe süpürüp peteği kesin ve hemen kapalı bir kaba koyun; açıkta bırakılan bal yağmacı arıları çeker.",
      "Peteği temiz bir kapta ezin, tülbent ya da sık bezden asıp süzün. Balı ısıtmayın; ısı rengini koyulaştırır.",
      "Balı ağzı sıkı kapanan temiz cam ya da gıdaya uygun kapta, serin ve kuru yerde saklayın. Sulu bal mayalanır; kapatmadan önce köpüklenme ve ekşi koku olmamalı.",
      "Süzmeden kalan mumu suyla bir kapta yavaş ısıtıp eritin, soğuyunca üstte donan mumu kalıp halinde alın. Mumu doğrudan ateşte eritmeyin."
    ],
    "art": [null, null, null, "sf-th-yavru-petek", null, "sf-th-bal-suzme", null, "sf-th-balmumu-eritme"],
    "dont": [
      "Kovandaki balın hepsini almayın; arılar kışın açlıktan ölür.",
      "Balmumunu doğrudan aleve koymayın; kolay tutuşur ve yanığı derindir.",
      "Bir yaşından küçük bebeğe bal vermeyin; bebek botulizmi riski vardır.",
      "Karadeniz dağlarında orman gülü (Rhododendron, komar) çiçeğinden yapılan bal (deli bal) grayanotoksin içerir; kalp yavaşlaması, tansiyon düşmesi ve bayılma yapar. Orman gülünün çok olduğu yerde ilkbahar balını yemeyin, çocuğa hiç vermeyin."
    ],
    "keywords": ["bal hasadı", "bal sağımı", "bal nasıl alınır", "petek bal", "bal süzme", "balmumu eritme", "sırlı petek", "kışlık bal", "bal saklama", "arı dumanlama", "bal sagimi", "petekten bal"],
    "sources": [
      "FAO — Beekeeping and sustainable livelihoods: honey harvesting (https://www.fao.org/4/y5110e/y5110e05.htm)",
      "FAO — Beekeeping and sustainable livelihoods: equipment (süzme bezi, balmumu eritme) (https://www.fao.org/4/y5110e/y5110e0c.htm)",
      "Düzce Üniv. açık arşiv — Deli bal zehirlenmesine bağlı bradikardi ve hipotansiyon gelişen çocuk olgusu (https://acikerisim.duzce.edu.tr/items/a0c42bbe-e075-4afe-8726-6519fa09df57)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO yeniden açıldı (sırlı bal, %20 su, %23 üstü mayalanma, ısıtınca koyulaşma, hava geçirmez kap, su üstünde mum eritme). Eksik uyarı eklendi: Karadeniz'de orman gülü (Rhododendron ponticum) balı grayanotoksin içerir; Düzce Üniv. olgu sunumu. Bırakılacak kışlık bal miktarı kaynakta yok." }
  },
  {
    "id": "sf-th-hayvan-sagligi",
    "category": "sf-th-hayvan",
    "title": "Hayvan sağlığı: temel belirtiler ve ayırma",
    "tag": "HAYVAN SAĞLIĞI",
    "summary": "Hayvanlarınızı her gün yem başında gözleyin; yemden kesilen, ayrı duran, ishal, akıntı ya da topallık gösteren hayvanı hemen ayırın, ölüleri gömün.",
    "note": "Uzman gözetimi olmadan hayvana ilaç, iğne ve antibiyotik uygulamayın. Kuduz, şarbon, kuş gribi ve Malta humması hayvandan insana geçer.",
    "steps": [
      "Her sabah yem verirken hepsini sayın ve izleyin. Sağlıklı hayvan yeme koşar, gözü parlak, tüyü düzgün, dışkısı kıvamlıdır.",
      "Uyarı belirtileri: yemden kesilme, sürüden ayrı ve başı önde durma, kabarık tüy, ishal ya da kanlı dışkı, burun ve göz akıntısı, öksürük, topallık, karında şişlik, aniden süt ya da yumurtanın düşmesi.",
      "Tavuklarda boyun bükülmesi, yeşil ishal ve birkaç günde çok sayıda ölüm salgın hastalık (Newcastle) işaretidir. Civcivlerde kanlı dışkı, susama ve yığılma koksidiyozu düşündürür.",
      "Küçükbaşta zayıflama, ishal ve göz kapağı içinin soluk olması kurt (iç parazit) belirtisidir. Tüysüz yamalar ve kaşınma dış parazit belirtisidir.",
      "Hasta hayvanı hemen ayrı bir bölmeye alın; ona en son bakın, bakarken ayrı ayakkabı ve eldiven kullanın, sonra ellerinizi sabunla yıkayın.",
      "Kümes ve ağıl hijyeni: altlığı ıslandıkça değiştirin, yemlik ve suluğu sık yıkayın, kümesi iki ayda bir kireçle badanalayın, kalabalıktan kaçının.",
      "Ölen hayvanı çıplak elle tutmayın; en az 1 m derine gömün, üstüne kireç serip toprakla kapatın. Hastalıktan ölen hayvanı asla yemeyin, köpeklere vermeyin. Aniden ölmüş, burnundan, ağzından ya da makatından pıhtılaşmayan koyu kan sızan hayvanı ise hiç açmayın, yüzmeyin, yerinden oynatmayın: şarbon olabilir. Öbür hayvanları uzak tutun, mümkünse ölüyü yerinde tamamen kül olana dek yakın.",
      "Yeni gelen hayvanı tavukta en az 15, küçükbaşta 30 gün ayrı tutun."
    ],
    "art": ["sf-th-gunluk-kontrol", null, null, null, "sf-th-hasta-ayirma", null, "sf-th-olu-gomme", null],
    "dont": [
      "Hasta ya da sebebi bilinmeden ölmüş hayvanın etini ve sütünü tüketmeyin.",
      "Aniden ölen hayvanı ve birden çok hayvan aynı anda ölüyorsa ölüleri açıp incelemeyin, derisini yüzmeyin; şarbon sporu toprağa ve insana geçer. Böyle bir ölüye dokunduysanız ve deride ağrısız, ortası kararan bir yara çıkarsa hemen sağlık yardımı arayın.",
      "Başka sürüden aldığınız hayvanı doğrudan sürüye katmayın."
    ],
    "keywords": ["hayvan hastalığı belirtileri", "tavuk hastalığı", "keçi hasta", "koyun hastalığı", "hayvan ishal", "tavuklar ölüyor", "hasta hayvan ayırma", "parazit belirtisi", "veteriner yokken", "ölü hayvan gömme", "hayvan sagligi"],
    "sources": [
      "FAO — Small-scale poultry production, Bölüm 6 sağlık (https://www.fao.org/4/y5169e/y5169e07.htm)",
      "Penn State Üniv. Extension — Dairy goat production (parazit belirtileri, 30 gün karantina) (https://extension.psu.edu/dairy-goat-production)",
      "Penn State Üniv. Extension — Rabbit production (hasta hayvanı ayırma) (https://extension.psu.edu/rabbit-production)",
      "NSW Department of Primary Industries — Anthrax (pıhtılaşmayan kan, ölüyü açmama ve taşımama, yakarak imha) (https://www.dpi.nsw.gov.au/biosecurity/animal/humans/anthrax)",
      "Utah Department of Agriculture — Anthrax infected producer guidance, 2026 (açmama, yerinde yakma, koruyucu giysi) (https://ag.utah.gov/wp-content/uploads/Anthrax-Infected-Producer-Guidance-Feb-2026.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: şarbon kısmı NSW DPI ve Utah Tarım Bakanlığı rehberiyle eklendi (pıhtılaşmayan kan, ölüyü açmama ve taşımama, yerinde yakma). Genel ölü gömme derinliği (1 m) ve kireç kaynaklı değil; veteriner onayı gerekir." }
  },
  {
    "id": "sf-th-kesim",
    "category": "sf-th-hayvan",
    "title": "Hayvan kesimi ve et hijyeni",
    "tag": "KESİM",
    "summary": "Yalnız sağlıklı hayvanı, dinlenmiş ve sakinken, keskin bıçakla tek hamlede iki şah damarını keserek kesin; postun etle değmemesine ve işkembenin delinmemesine dikkat edip eti hemen soğutun.",
    "note": "Türkiye'de olağan koşullarda et için kesim onaylı kesimhanelerde, kurban kesimi de belediyenin belirlediği yerlerde yapılır; cadde, park ve açık alanda kesim yasak ve cezalıdır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir. Uzman gözetimi olmadan ilk kesiminizi yalnız yapmayın.",
    "steps": [
      "Yalnız sağlıklı hayvanı kesin. Kesimden önceki gün son yemini verin, suyu kesmeyin; hayvanı bağırtmadan, kovalamadan sakinleştirin.",
      "Kesim yerini hazırlayın: temiz, gölgeli, sineğe kapalı bir yer; bol temiz su, sabun, iki keskin bıçak, ip, asmak için sağlam bir dal ya da çengel, eldiven ya da naylon torba. Elinizde açık yara varsa kapatın; kan ve iç organ yarayla temas edince Malta humması ve şarbon bulaşır.",
      "Bıçak jilet gibi keskin olmalı. Hayvanı yan yatırıp başını tutun; boynun ön kısmında, çenenin hemen altından tek ve kararlı bir hareketle iki şah damarını birlikte kesin. Göğüs boşluğuna bıçak sokmayın.",
      "Kan akışı neredeyse duruncaya kadar bekleyin. Hayvan hareketsiz ve gözü tepkisiz olmadan yüzmeye başlamayın.",
      "Hayvanı arka bacağından aşil kirişinin arkasından ip ya da çengelle asın.",
      "Yüzerken postun ya da yünün dış yüzü ete değmesin; posta değen elle ete dokunmayın. Gerekirse elinizi her seferinde yıkayın. Yemek ve dışkı borusunu iple bağlayın.",
      "Karın duvarını göğüs kemiğinin hemen altından küçük bir kesikle açın, iki parmağınızla duvarı içorganlardan uzak tutarak aşağı doğru kesin; işkembeyi ve bağırsağı delmeyin.",
      "İç organlara bakın: karaciğerde ya da akciğerde su dolu kese (kist hidatik), yumru, apse, irin ya da garip renk varsa o organı, yaygınsa bütün hayvanı yemeyin; köpeklerin ulaşamayacağı derinliğe gömün ya da yakın. Dalak çok büyük ve kararmışsa, kan koyu ve pıhtılaşmıyorsa işi bırakın, gövdeyi yakın: şarbon olabilir.",
      "Gövdeyi serin, havadar, gölge yerde asılı ve birbirine değmeden soğutun. Soğuk yoksa eti aynı gün pişirin, kurutun ya da tuzlayın."
    ],
    "art": [null, "sf-th-kesim-yeri", null, null, null, null, null, "sf-th-ic-organ-kontrol", "sf-th-et-sogutma"],
    "dont": [
      "Hasta, sebebi bilinmeden ölmüş ya da düşük yapmış hayvanı kesip yemeyin.",
      "İşkembe ve bağırsak içeriği ete bulaştıysa o bölgeyi kesip atın; yıkamak yetmez.",
      "Kesim artıklarını açıkta bırakmayın; köpeklere çiğ ciğer, akciğer ve iç organ vermeyin. Kist hidatik köpek dışkısıyla insana geçer: köpekle temastan sonra ve yemekten önce ellerinizi yıkayın, sebzeyi iyice yıkayın.",
      "Aniden ölmüş ya da doğal deliklerinden kan sızan hayvanı kesmeye, yüzmeye kalkmayın; şarbon olabilir."
    ],
    "keywords": ["hayvan kesimi", "koyun kesimi", "keçi kesimi", "tavuk kesimi", "kesim hijyeni", "deri yüzme", "et soğutma", "kurban kesimi", "iç organ kontrol", "kist ciğer", "kesim nasil yapilir"],
    "sources": [
      "FAO — Guidelines for slaughtering, meat cutting and further processing: techniques and hygiene (https://www.fao.org/4/t0279e/T0279E04.htm)",
      "FAO — Guidelines for slaughtering: general hygiene rules (https://www.fao.org/4/t0279e/T0279E02.htm)",
      "FAO — Small-scale poultry production, Bölüm 6 (hasta hayvan) (https://www.fao.org/4/y5169e/y5169e07.htm)",
      "WHO — Echinococcosis bilgi notu (enfekte sakatatın imhası, köpek kaynaklı bulaş) (https://www.who.int/news-room/fact-sheets/detail/echinococcosis)",
      "WHO — Brucellosis bilgi notu (kan, son ve fetüs teması; koruyucu bariyer) (https://www.who.int/news-room/fact-sheets/detail/brucellosis)",
      "NSW Department of Primary Industries — Anthrax (https://www.dpi.nsw.gov.au/biosecurity/animal/humans/anthrax)",
      "2026 Kurban Hizmetleri Tebliği haberi, Ensonhaber (yalnız belirlenen yerlerde kesim, açık alan cezası) (https://www.ensonhaber.com/ekonomi/2026-kurban-hizmetleri-tebligi-yayimlandi-kurban-kesimleri-icin-yeni-kurallar)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO T0279E04 yeniden açıldı (son yem önceki gün, su, yalnız sağlıklı hayvan, iki karotis, yemek borusunu bağlama, iç organı delmeme, karın açma tekniği, soğutma). WHO: kist hidatikte enfekte sakatatın imhası; brusellozda kan, son ve fetüs teması. NSW DPI: şarbonda açmama. Eldiven, kist hidatik ve şarbon uyarıları eklendi; yasal not Kurban Hizmetleri Tebliği haberine göre düzeltildi (5996 maddesi bulunamadı)." }
  },
  {
    "id": "sf-th-ot-yem",
    "category": "sf-th-hayvan",
    "title": "Ot kurutma, saman ve yem saklama",
    "tag": "YEM",
    "summary": "Otu çiçeklenme başında biçin, sık çevirerek kurutun, büküldüğünde nem çıkmayan çıtır otu sağlam bir tınaz ya da samanlıkta yağmurdan koruyun.",
    "steps": [
      "Çayır otunu ve yoncayı çiçeklenmenin başı ile ortası arasında biçin; çiçekten sonra besin değeri hızla düşer.",
      "Hava tahminine bakın: biçimden sonra 3–4 gün kuru hava gerekir. Çiy kalktıktan sonra biçin.",
      "Biçilen otu güneşli günde serip yayın, günde 1–2 kez yaba ile çevirin. Yağmur yaklaşırsa yarı kurumuş otu küçük yığınlar (tınaz) halinde toplayın.",
      "Nemli havada otu üç ayaklı sırıklara (sehpa) ya da çit gibi tellere asarak kurutun; havalanır ve çürümez.",
      "Kuruluk testi: bir tutam otu bükün. Çıtır kırılıyor, yeşil-parlak görünüyor ve büküldüğünde nem çıkmıyorsa hazırdır. Ağarmış ot yağmur yemiş, değeri düşmüştür.",
      "Tınaz yaparken ortayı sıkı basın, kenarları dışa eğimli, tepesini sivri yapın. Kuru bir taban (taş, dal) üstüne kurun, iplerle bağlayın, üstünü sazla ya da brandayla örtün.",
      "Samanlıkta kuru ot ve sapı yağmur ve zeminden uzak tutun. Haftalarca ara ara elinizi yığına sokun: belirgin ısınma, buhar ya da küf kokusu varsa yığını açıp yayın.",
      "Tahıl yemini fare girmeyen kapalı kaplarda saklayın. Küflü ot ve tahılı hayvana vermeyin."
    ],
    "art": [null, null, "sf-th-ot-cevirme", null, null, "sf-th-tinaz", "sf-th-ot-sicaklik-kontrol", null],
    "dont": [
      "Nemli otu samanlığa doldurmayın; ısınır ve kendiliğinden tutuşup bütün ahırı yakabilir.",
      "Samanlıkta sigara, gaz lambası ve açık ateş kullanmayın.",
      "Küflü otu sallarken toz solumayın; akciğer hastalığı (çiftçi akciğeri) yapar."
    ],
    "keywords": ["ot kurutma", "kuru ot", "saman saklama", "yonca kurutma", "tınaz", "samanlık yangını", "hayvan yemi saklama", "kış yemi", "çayır biçme", "ot ne zaman biçilir", "yem saklama", "kuru ot nasil yapilir"],
    "sources": [
      "FAO — Hay and straw conservation, Bölüm 2 haymaking (https://www.fao.org/4/x7660e/x7660e06.htm)",
      "TAGEM KTAE ve Bolu İl Tarım Müd. — tahıl saklama nemi ve serin depolama (https://bolu.tarimorman.gov.tr/Belgeler/agroekoloji/BUĞDAY%20YETİŞTİRİCİLİĞİ%20YENİ.pdf)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: FAO x7660e yeniden açılmadı; kendiliğinden yanma ve çiftçi akciğeri uyarıları doğru ve yerinde." }
  },
  {
    "id": "sf-th-balik-havuzu",
    "category": "sf-th-hayvan",
    "title": "Küçük havuzda balık (sazan)",
    "tag": "BALIK",
    "summary": "Killi toprağa 1–1,5 m derin, taşkından korunan bir havuz kazın, girişine elek koyun; sazan yavrusunu seyrek atıp tahıl kepeği ve yeşil otla besleyin, şafakta su yüzüne çıkmalarını izleyin.",
    "note": "Türkiye'de olağan koşullarda su ürünleri yetiştiricilik tesisi kurmak Tarım ve Orman Bakanlığı iznine bağlıdır (1380 sayılı Su Ürünleri Kanunu md. 13); bu bilgi yalnız gerçek hayatta kalma durumu içindir. Yetiştirdiğiniz balığı dere ve göllere bırakmayın.",
    "steps": [
      "Yer seçin: suyun kendiliğinden toplandığı ama sel basmayan alçak bir yer; yakınında kaynak, dere ya da yağmur suyu. Gübre yığını, tuvalet ve tarla ilacından uzak olsun.",
      "Toprak testi: nemli toprağı avuçta sıkıp top yapın; ufalanmadan şekil tutuyorsa kil yeterlidir. Kumlu, çakıllı toprakta su tutmaz; tabanı kalın kil katı ile sıvayın.",
      "Havuzu dikdörtgen yapın; boyu eninin yaklaşık 3 katı olsun. Küçük bir yetiştirme havuzu için su derinliği 1–1,5 m yeterlidir, kurak yerde 1,5–2 m yapın.",
      "Kenar şevini killi toprakta 1:1 ile 2:1, kumlu toprakta 3:1 (3 birim yatay, 1 birim dikey) verin. Seti 20 cm'lik katlar halinde döküp her katı çiğneyerek sıkıştırın; set tepesi en az 1,5 m geniş olsun.",
      "Dereyi doğrudan havuza bağlamayın, yanından geçirin. Girişe ve taşma kanalına elek ya da sık tel koyun ki yabani balık ve yırtıcı girmesin, sizinkiler kaçmasın.",
      "Yavruları (10–15 cm) seyrek atın: büyük havuzlarda hektara yaklaşık 5.000, yani 100 m²'ye 50 yavru. Daha sık atarsanız oksijen yetmez.",
      "Günde balık ağırlığının yüzde 1–2'si kadar kepek, kırık tahıl ya da hamur yapılmış yemi aynı yere, bir tepsiye verin. Ot yiyen türlere taze yeşil ot atın.",
      "Şafakta havuzu izleyin: balıklar yüzeyde ağzını açıp hava yutuyorsa oksijen azdır. Yemi kesin, taze su verin ya da suyu küreklerle karıştırın.",
      "Suyun pH'ı 5,5'in altındaysa (asitliyse) tabana kireç serpin. Birkaç yılda bir yaz sonunda havuzu boşaltıp çamurunu alın."
    ],
    "art": [null, null, "sf-th-havuz-kesit", null, "sf-th-havuz-elek", null, null, "sf-th-balik-oksijen", null],
    "dont": [
      "Havuzu çocukların düşebileceği yerde çitsiz bırakmayın; boğulma riski vardır.",
      "Tarla ilacı, gübre suyu ya da lağım karışan suda balık yetiştirmeyin.",
      "Ölü ya da hasta görünen balığı yemeyin; ölüleri sudan alıp gömün."
    ],
    "keywords": ["balık havuzu", "sazan yetiştirme", "küçük havuzda balık", "havuz yapımı", "balık yemi", "toprak havuz", "balık çiftliği", "balık havuzu nasıl yapılır", "balık oksijen", "balik havuzu", "su ürünleri yetiştirme"],
    "sources": [
      "FAO — Fish culture in undrainable ponds, Bölüm 6 havuz yapımı (https://www.fao.org/4/t0555e/T0555E06.htm)",
      "FAO — Fish culture in undrainable ponds, Bölüm 9 stoklama ve besleme (https://www.fao.org/4/t0555e/T0555E09.htm)",
      "1380 sayılı Su Ürünleri Kanunu md. 13 (4950 sayılı Kanunla değişik metin) (https://www.alomaliye.com/2003/07/29/4950-sayili-kanun/)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-02", "note": "Bağımsız doğrulama: 1380 sayılı Kanun md. 13 (yetiştiricilik tesisi Bakanlık iznine bağlı) doğrulandı. Yabancı türü doğaya bırakma yasağı metinde bulunamadı; note buna göre yeniden yazıldı. Havuz sayıları FAO (Hindistan) kaydına dayanır; Türkiye uyarlaması uzman ister." }
  },
];
