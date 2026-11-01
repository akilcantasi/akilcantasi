// Sıfırdan paketi: Bilgi, haberleşme, topluluk ve doğayla uzun yaşam
// Katalog bölüm 12–15 (madde 253–295). Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-bilgi-topluluk',
  name: 'Sıfırdan: Bilgi, haberleşme ve topluluk',
  desc: 'Zamanı ve ölçüyü yeniden kurmak, bilgiyi korumak ve öğretmek, telsizsiz ve telsizle haberleşmek, gönüllülük ve insan haklarına dayalı bir topluluk düzeni kurmak, doğada yıllarca güvenle yaşamak.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sf-bt-zaman-olcu', title: 'Zaman, ölçü ve bilgi', hint: 'Güneş saati, takvim, hava tahmini, ölçü, okuma-yazma', art: 'sf-bt-zaman-kapak', color: '#fcd34d', order: 170 },
  { id: 'sf-bt-haberlesme-yol', title: 'Haberleşme ve yol', hint: 'Telsiz, mors, ışık ve ses işareti, ulak, yük hayvanı, patika', art: 'sf-bt-haberlesme-kapak', color: '#93c5fd', order: 171 },
  { id: 'sf-bt-topluluk', title: 'Topluluk', hint: 'Karar alma, nöbet, ambar, mutfak, bakım, moral', art: 'sf-bt-topluluk-kapak', color: '#f9a8d4', order: 172 },
  { id: 'sf-bt-doga-uzun', title: 'Doğayla uzun yaşam', hint: 'Kalıcı kamp, yaban hayvanı, kış ve yaz, yangın, sel', art: 'sf-bt-doga-kapak', color: '#86efac', order: 173 },
];

const D = '2026-11-02';

export const GUIDES: PackGuide[] = [
  // ───────────── ZAMAN, ÖLÇÜ VE BİLGİ ─────────────
  {
    id: 'sf-gunes-saati',
    category: 'sf-bt-zaman-olcu',
    title: "Güneş saati yapmak (ekvatoral kadran)",
    tag: "ZAMAN",
    summary: "Saatleri 15 derece arayla çizilmiş bir kadranı, ortasındaki çubuk gerçek kuzeye bakacak ve yerden enleminiz kadar yükselecek biçimde kurun; gölge saati gösterir.",
    steps: [
      "Önce gerçek kuzeyi bulun. Düz zemine dik bir çubuk dikin, öğle saatlerinde gölgenin ucunu sık sık işaretleyin. En kısa gölgenin gösterdiği yön gerçek kuzeydir.",
      "Enleminizi bilin. Türkiye 36 ile 42 derece kuzey arasındadır: Antalya yaklaşık 37, Ankara yaklaşık 40, Sinop yaklaşık 42. Bilmiyorsanız 39 alın; hata birkaç dakikayı geçmez.",
      "Yaklaşık 30 cm çapında yuvarlak bir tahta ya da kalın karton kesin. Merkezden geçen 24 çizgiyle 24 eşit dilime bölün; her dilim 15 derecedir, yani 1 saattir.",
      "Aynı çizgileri arka yüze de çizin. Ön yüzde saatler saat yönünde, arka yüzde ters yönde ilerler. En alttaki çizgiye iki yüzde de 12 yazın.",
      "Merkezden, kadrana tam dik bir çubuk geçirin. Çubuk iki yüzden de en az 10 cm çıksın.",
      "Kadranı yerleştirin: çubuğun üst ucu gerçek kuzeye baksın ve çubuk yerle enleminiz kadar açı yapsın (Ankara'da 40 derece). Kadranın 12 çizgisi tam aşağıda, kuzey-güney doğrultusunda kalsın.",
      "21 Mart'tan 23 Eylül'e kadar üst yüzü, kışın alt yüzü okuyun. Bu iki tarihin çevresinde gölge kadranın kenarında kaybolabilir; birkaç gün gölge çubuğu ve takvimle idare edin.",
      "Gölge 12'de iken güneş öğlesidir. Topluluğun ortak saati olarak bunu kullanın: toplantı, nöbet değişimi ve yemek saatlerini buna göre koyun.",
      "Eski bir kol saatiyle karşılaştırırsanız fark görürsünüz; güneş saati yerel güneş zamanını gösterir. Fark normaldir, saatinizi güneşe göre ayarlayın.",
      "Kadranı kazık ya da taş bir kaideye sabitleyin. Ayda bir öğle gölgesiyle kuzey ayarını kontrol edin."
    ],
    art: ['sf-bt-gunes-saati-kuzey', null, 'sf-bt-gunes-saati-kadran', null, null, 'sf-bt-gunes-saati-kurulum', null, null, null, null],
    dont: [
      "Pusulanın gösterdiğini gerçek kuzey sanmayın; kadranı öğle gölgesiyle ya da Kutup Yıldızı'yla kontrol edin.",
      "Kadranı yatay yere düz koyup okumayın; ekvatoral kadran ancak enlem açısıyla eğik kurulunca doğru gösterir.",
      "Güneşe çıplak gözle bakarak zaman tahmin etmeyin; göz kalıcı zarar görebilir."
    ],
    keywords: ['güneş saati', 'gunes saati yapma', 'saat yokken zaman', 'saati nasıl bilirim', 'gölge saati', 'öğle vakti bulma', 'güneşe göre saat', 'kadran yapımı', 'saat kalmadı zaman ölçme'],
    sources: [
      "The Sundial Primer — Equatorial sundial (https://mysundial.ca/tsp/equatorial_sundial.html)",
      "schoolphysics — Sundials (https://schoolphysics.co.uk/age11-14/Astronomy/text/Sundials/index.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: kadran düzlemi ekvatora paralel (yatayla 90−enlem), çubuk göğün kutbuna, saat çizgileri 15°, yaz-kış yüz değişimi; çubuk açısı = enlem." },
  },
  {
    id: 'sf-takvim-tutma',
    category: 'sf-bt-zaman-olcu',
    title: "Takvim tutmak: gün sayma ve ay evreleri",
    tag: "ZAMAN",
    summary: "Her akşam aynı anda bir çentik atın, iki ayrı kişi ayrı sayaç tutsun; ay evreleri ve öğle gölgesiyle takvimi düzeltin.",
    steps: [
      "Bilinen son tarihi yazın. Kimse emin değilse insanların hatırladıklarını karşılaştırıp en çok uyuşan tarihi seçin.",
      "Bir sayaç çubuğu ya da duvar seçin. Her akşam gün batımında bir çentik atın. Her 7. çentiği uzun, her ayın sonunu çapraz yapın.",
      "İki farklı kişi ayrı sayaç tutsun. Haftada bir karşılaştırın; fark varsa günlük defterdeki olaylardan bulun.",
      "Ayı izleyin. Bir yeniaydan ötekine yaklaşık 29,5 gün geçer. Ayı göremediğiniz gün yeniay, bütün gece görünen dolun aydır.",
      "Dolunay gün batımında doğar, gün doğumunda batar. İlk ince hilal yeniaydan sonraki akşamlar, gün batımından hemen sonra batı göğünde görünür.",
      "12 ay evresi yaklaşık 354 gündür; güneş yılından 11 gün kısadır. Ekim ve hasadı aya göre değil, güneşe göre planlayın.",
      "Güneş yılını işaretleyin: sabit bir çubuğun öğle gölgesinin ucunu her hafta taşla işaretleyin. En kısa gölge 21 Haziran, en uzun gölge 21 Aralık çevresindedir.",
      "Ekinoksları (21 Mart ve 23 Eylül çevresi) güneşin tam doğudan doğduğu, gölge çizgisinin düz olduğu günlerden bulun ve sayacınızı düzeltin.",
      "Tarihleri günlük deftere yazın: doğumlar, ölümler, ilk don, ekim, hasat. Takvim bu kayıtlarla anlam kazanır."
    ],
    art: [null, 'sf-bt-takvim-centik', null, 'sf-bt-takvim-ay-evreleri', null, null, 'sf-bt-takvim-golge-tasi', null, null],
    dont: [
      "Sayacı tek bir kişiye bırakmayın; hastalanır ya da unutursa takvim kaybolur.",
      "Ay takvimini tarım takvimi gibi kullanmayın; her yıl 11 gün kayar.",
      "Güneşe bakarak doğuş noktasını aramayın; gölgeyi ve ufuktaki bir işareti kullanın."
    ],
    keywords: ['takvim tutma', 'gün sayma', 'bugün hangi gün', 'tarihi kaybettim', 'ay evreleri', 'dolunay ne zaman', 'yeniay', 'çentik takvim', 'gündönümü bulma', 'ekinoks'],
    sources: [
      "NASA Science — Moon Phases (https://science.nasa.gov/moon/moon-phases/)",
      "The Sundial Primer — Equatorial sundial, ekinoks açıklaması (https://mysundial.ca/tsp/equatorial_sundial.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: kavuşum ayı 29,5 gün, dolunay gün batımında doğar, evre sırası (NASA). 354 gün = 12×29,53 hesap." },
  },
  {
    id: 'sf-mevsim-belirtileri',
    category: 'sf-bt-zaman-olcu',
    title: "Mevsim belirtileri: ekim ve hasat zamanını bilmek",
    tag: "ZAMAN",
    summary: "Ekimi takvimden çok doğanın işaretlerine ve kendi yerinizin kayıtlarına göre yapın; her yıl gözlemleri yazıp kendi yerel takviminizi kurun.",
    steps: [
      "Türkiye'de iklim bölgeden bölgeye çok değişir. Kıyıda ilkbahar iç bölgelerden haftalarca önce gelir. Başka yerin takvimini olduğu gibi kullanmayın.",
      "Bölgenin yaşlılarına sorun: hangi bitki çiçek açınca ne ekilir, ilk kırağı ne zaman düşer. Söylenenleri deftere yazın.",
      "Son donu bekleyin. Sabahları çimende kırağı varsa ya da gece açık ve rüzgârsız geçiyorsa don sürüyor demektir. Fasulye, domates, kabak ve mısır gibi dona dayanıksız bitkileri bu dönem bitmeden açığa ekmeyin.",
      "Toprağı elle sınayın: bir avuç toprağı sıkın. Çamur gibi yapışıp parmak izi bırakıyorsa çok ıslaktır, bekleyin. Ufalanıp dağılıyorsa işlemeye uygundur.",
      "Doğanın işaretlerini izleyin: ağaçların yapraklanması, ilk çiçekler, göçmen kuşların gelişi. Hıdırellez (5–6 Mayıs) Anadolu'da baharın geldiği gün olarak kutlanır.",
      "Bu işaretler her yıl aynı tutmaz. Tek bir işarete göre bütün tohumu ekmeyin; ekimi 2–3 partiye bölüp 1–2 hafta arayla yapın.",
      "Tahılın hasat zamanı: sap ve başak sararır, tane tırnakla bastırınca ezilmez ve süt çıkmaz. Yağmur beklenmiyorsa biçin.",
      "Her yıl aynı deftere yazın: ilk çiçek, son kırağı, ekim günü, çimlenme, hasat günü ve verim. 3–5 yıl sonra kendi yerinizin takvimi çıkar."
    ],
    art: [null, null, 'sf-bt-mevsim-kiragi', 'sf-bt-mevsim-toprak-sikma', null, null, 'sf-bt-mevsim-hasat-tane', null],
    dont: [
      "Bütün tohumu tek seferde, tek işarete güvenerek ekmeyin; geç bir don hepsini yok edebilir.",
      "Islak toprağı sürmeyin; toprak sıkışır ve kesekler kurur, ekim tutmaz.",
      "Tohumluk ayırmadan bütün hasadı tüketmeyin."
    ],
    keywords: ['ne zaman ekilir', 'ekim zamanı', 'hasat zamanı', 'son don ne zaman', 'kırağı', 'mevsim belirtileri', 'halk takvimi', 'tohum ekme zamanı', 'tarla ne zaman sürülür', 'hidirellez'],
    sources: [
      "Wikipedia — Phenology (https://en.wikipedia.org/wiki/Phenology)",
      "Wikipedia — Hıdırellez (https://en.wikipedia.org/wiki/H%C4%B1d%C4%B1rellez)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: fenolojik işaretlerin kullanımı ve güvenilmezliği uyarısı, Hıdırellez tarihi. Toprak sıkma ve tane sertliği testi geleneksel bilgi; ziraat kaynağıyla doğrulanamadı (RAPOR)." },
  },
  {
    id: 'sf-hava-tahmini-bulut',
    category: 'sf-bt-zaman-olcu',
    title: "Bulutlardan hava tahmini",
    tag: "HAVA",
    summary: "Gökyüzüne günde iki kez, özellikle batıya bakın: kalınlaşan yüksek bulut ve hale yağışın yaklaştığını, kule gibi büyüyen bulut sağanak ve yıldırımı gösterir.",
    steps: [
      "Sabah ve akşam gökyüzüne bakın. Türkiye'de hava sistemleri çoğunlukla batıdan gelir; batı ufkuna özellikle dikkat edin.",
      "Saç teli ya da tüy gibi ince, yüksek bulutlar (sirrus) çoğalıp gökyüzünü kaplamaya başlıyorsa bir alçak basınç sistemi yaklaşıyor olabilir.",
      "Güneşin ya da ayın çevresinde ışık halkası (hale) görürseniz yüksekte buz kristalli bulut vardır. Gökyüzü süt beyazına dönüyorsa bir iki gün içinde yağış gelebilir.",
      "Bulut tabanı alçalıyor, gri tabaka kalınlaşıp güneşi tamamen kapatıyorsa uzun süren, yaygın yağış yaklaşır.",
      "Güneşli günde dağınık pamuk bulutlar (kümülüs) genellikle iyi havadır. Öğleden sonra bu bulutlar yukarı doğru kule gibi büyüyor, tepesi örs gibi yayılıyorsa sağanak, dolu ve yıldırım gelir.",
      "Kule bulut görürseniz açık alandan, zirveden ve tek ağaçların altından uzaklaşın; hayvanları ve aletleri toplayın.",
      "Akşam kızıllığı batıda havanın açık olduğunu, sabah kızıllığı ise iyi havanın geçtiğini ve bozulmanın gelebileceğini gösterir.",
      "Tek işarete güvenmeyin. Bulutu rüzgâr ve basınç değişimiyle birlikte değerlendirin; gözlemleri her gün deftere yazın."
    ],
    art: [null, 'sf-bt-bulut-sirrus', 'sf-bt-bulut-hale', null, 'sf-bt-bulut-kumulonimbus', null, null, null],
    dont: [
      "Kule bulut büyürken tepede, açık arazide ya da su kenarında çalışmayı sürdürmeyin.",
      "Halk sözlerini kesin bilgi saymayın; birkaç işaret birlikte görülmeden hasat ve yolculuk kararı vermeyin."
    ],
    keywords: ['bulutlardan hava tahmini', 'yağmur yağacak mı', 'bulut çeşitleri', 'ayın etrafında halka', 'güneşin etrafında hale', 'kızıl gökyüzü', 'fırtına bulutu', 'hava nasıl olacak', 'kumulonimbus', 'hava tahmini aletsiz'],
    sources: [
      "NOAA JetStream — Four core types of clouds (https://www.noaa.gov/jetstream/clouds/four-core-types-of-clouds)",
      "Met Office — Clouds (https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/clouds)",
      "Wikipedia — Weather lore: red sky, halo (https://en.wikipedia.org/wiki/Weather_lore)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: sirrusun alçak basınç öncüsü olması (NOAA), nimbostratus yağışı (Met Office), hale ve kızıl gökyüzü açıklaması (Weather lore)." },
  },
  {
    id: 'sf-hava-tahmini-ruzgar',
    category: 'sf-bt-zaman-olcu',
    title: "Rüzgâr ve hava basıncından hava tahmini",
    tag: "HAVA",
    summary: "Rüzgârın yönünü ve değişimini, varsa barometrenin eğilimini her gün kaydedin; düşen basınç ve dönen rüzgâr bozulmanın habercisidir.",
    steps: [
      "Rüzgâr yönünü belirleyin: yüksek bir direğe ince bir kumaş şerit bağlayın. Rüzgâr geldiği yönün adıyla anılır; kuzeyden esen rüzgâr kuzey rüzgârıdır.",
      "Rüzgâr şiddetini kaydedin: duman dik mi yükseliyor, yapraklar mı kıpırdıyor, dallar mı sallanıyor, ağaç gövdeleri mi eğiliyor. Basit 0–4 arası bir ölçek yeterlidir.",
      "Sırtınızı rüzgâra verin. Kuzey yarıkürede alçak basınç, yani kötü hava merkezi sol tarafınızda kalır.",
      "Barometre ya da basınç gösteren bir saat bulursanız günde aynı saatlerde 3 kez okuyun. Önemli olan değer değil, eğilimdir: hızlı ve sürekli düşüş bozulma, yükseliş düzelme demektir.",
      "Rüzgâr birden yön değiştirir, serinler ve sertleşirse bir cephe geçiyordur; kısa sürede sağanak gelebilir.",
      "Yerel rüzgârları tanıyın: kıyıda gündüz denizden karaya, gece karadan denize; dağda gündüz yamaç yukarı, gece aşağı eser. Bu düzen bozulursa büyük ölçekli bir hava değişimi vardır.",
      "Gece açık, rüzgârsız ve kuruysa sabaha karşı don ve sis olasılığı artar. Fideleri örtün.",
      "Gözlemleri tabloya yazın: tarih, saat, rüzgâr yönü, şiddet, bulut, basınç eğilimi, ertesi gün ne oldu. Birkaç ayda yerinize özgü işaretleri öğrenirsiniz."
    ],
    art: ['sf-bt-ruzgar-serit', 'sf-bt-ruzgar-olcek', 'sf-bt-ruzgar-sirt', null, null, null, null, null],
    dont: [
      "Tek bir basınç okumasına göre karar vermeyin; eğilimi en az birkaç saatlik okumalardan çıkarın.",
      "Sert rüzgârın bastırdığı bir yangın havasında açık ateş yakmayın."
    ],
    keywords: ['rüzgâr yönü', 'ruzgar nereden esiyor', 'barometre düşüyor', 'hava basıncı', 'rüzgârdan hava tahmini', 'fırtına geliyor mu', 'don olacak mı', 'lodos poyraz', 'meltem', 'basınç düşüşü'],
    sources: [
      "Wikipedia — Buys Ballot's law (https://en.wikipedia.org/wiki/Buys_Ballot%27s_law)",
      "NOAA JetStream — Clouds and fronts (https://www.noaa.gov/jetstream/clouds/four-core-types-of-clouds)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: Buys Ballot kuralı (kuzey yarıkürede sırt rüzgâra, alçak basınç solda), basınç eğiliminin kullanımı. Meltem ve gece donu genel meteoroloji bilgisi; ayrıca doğrulanmadı." },
  },
  {
    id: 'sf-uzunluk-olculeri',
    category: 'sf-bt-zaman-olcu',
    title: "Uzunluk ölçüleri: karış, adım, kulaç ve ana çubuk",
    tag: "ÖLÇÜ",
    summary: "Topluluk için tek bir 1 metrelik ana çubuk yapın, herkesin karışını, adımını ve kulacını buna göre ölçüp yazın; ölçü kopyalarını hep ana çubuktan alın.",
    steps: [
      "Elinizde metre, şerit metre ya da cetvel varsa ondan 1 metre uzunluğunda, düz ve kuru sert ağaç bir ana çubuk yapın. Her 10 cm'ye çentik atın.",
      "Metre yoksa bilinen nesneleri kullanın: A4 kâğıdın uzun kenarı 29,7 cm, kısa kenarı 21 cm; banka kartının uzun kenarı 8,56 cm'dir.",
      "Ana çubuğu kuru, gölge bir yerde, yere değmeden saklayın. İş için kullanmayın; kopyalar ondan yapılsın.",
      "Vücut ölçünüzü öğrenin: karışınızı (başparmak ile serçe parmak arası), dirseğinizden parmak ucuna, kollarınızı açınca kulacınızı ölçüp yazın. Kulaç çoğu insanda boy uzunluğuna yakındır.",
      "Eski ölçüleri tanıyın: arşın yaklaşık 68 cm, kulaç yaklaşık 1,8 m'dir. Eski kayıtları okurken işe yarar.",
      "Adımınızı ölçün: ana çubukla 100 m'lik düz bir yol işaretleyin, 3 kez yürüyün, her seferde çift adımlarınızı sayın, ortalamasını alın.",
      "Yokuşta, çamurda ve karda adımınız kısalır; bu yerlerde 100 m için kaç çift adım attığınızı ayrıca ölçün.",
      "Ölçü ipi yapın: 10 m ipe her metrede bir düğüm atın. İp ıslanınca boyu değişir; ayda bir ana çubukla kontrol edin.",
      "Bütün kopyaları (cetvel, ip, çubuk) ayda bir ana çubukla karşılaştırın. Farklı çıkanı düzeltin ya da atın."
    ],
    art: ['sf-bt-olcu-ana-cubuk', null, null, 'sf-bt-olcu-karis-kulac', null, 'sf-bt-olcu-adim', null, null, null],
    dont: [
      "Herkesin kendi karışıyla ölçüp sonuçları karıştırmayın; bina ve takas ölçülerinde hep ana çubuğu kullanın.",
      "Ana çubuğu ateş yakınında ya da nemli yerde tutmayın; eğilir ya da kısalır."
    ],
    keywords: ['metre yokken ölçme', 'uzunluk ölçüsü', 'karış kaç cm', 'arşın kaç cm', 'kulaç', 'adım sayarak mesafe', 'ölçü çubuğu', 'cetvel yok', 'mesafe ölçme', 'düğümlü ip'],
    sources: [
      "Wikipedia — Ottoman units of measurement (https://en.wikipedia.org/wiki/Ottoman_units_of_measurement)",
      "Wikipedia — Pace count beads (https://en.wikipedia.org/wiki/Pace_count_beads)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: arşın ≈ 68 cm, kulaç ≈ 1,83 m; adım sayımı ve araziye göre düzeltme. A4 (ISO 216) ve banka kartı (ISO/IEC 7810 ID-1) boyutları standart değer." },
  },
  {
    id: 'sf-terazi-yapma',
    category: 'sf-bt-zaman-olcu',
    title: "Terazi yapmak ve ağırlık ölçmek",
    tag: "ÖLÇÜ",
    summary: "Ortasından asılan eşit kollu bir çubuk ve iki kefeyle terazi yapın, ağırlık taşlarınızı 1 litre su = yaklaşık 1 kg kuralıyla hazırlayın, kefeleri değiştirerek doğruluğu sınayın.",
    steps: [
      "60–100 cm uzunluğunda düz, kuru, budaksız bir çubuk bulun. Ana çubukla ortasını tam ölçüp işaretleyin.",
      "Çubuğu ortasından, sağlam bir iple ya da çubuğun içinden geçen bir çivi ekseniyle asın. Asma noktası çubuğun biraz üstünde kalsın; çubuk kendiliğinden yataya dönsün.",
      "Uçlardan eşit uzaklıkta iki eş kefe asın: kova, tas ya da ip örgülü tepsi. Kefeler boşken çubuk yatay değilse hafif tarafa biraz balmumu ya da çamur ekleyerek dengeleyin.",
      "Ağırlık taşları yapın: litresi bilinen bir şişeyi temiz suyla doldurun. 1 litre su yaklaşık 1 kg'dır. Şişenin boş ağırlığını ayrıca dengeleyin.",
      "Su şişesini bir kefeye, taşı öbür kefeye koyun; taşı yontarak ya da küçük taş ekleyerek dengeye getirin. 1 kg, 500 g ve 100 g taşları boya ya da çentikle işaretleyin.",
      "Doğruluğu sınayın: bir yükü tartın, sonra yükle ağırlıkları kefe değiştirerek yeniden tartın. Sonuç farklıysa kollar eşit değildir; asma noktasını düzeltin.",
      "Ağır yük için kantar yapın: asma noktası bir uca yakın olsun. Kısa kola yük, uzun kola kayan bir ağırlık asın. Bilinen ağırlıklarla dengeleyip uzun kolda her kilo için çentik atın.",
      "Rüzgârsız, sarsıntısız yerde tartın. Ayda bir ağırlık taşlarını su şişesiyle yeniden karşılaştırın."
    ],
    art: [null, 'sf-bt-terazi-asma', null, null, 'sf-bt-terazi-su-sisesi', null, 'sf-bt-terazi-kantar', null],
    dont: [
      "Ağırlık taşlarını yalnız gözle seçmeyin; her taşı terazide su şişesine karşı dengeleyin.",
      "Ağırlık taşlarını dağıtıp kaybetmeyin; ambar ve takas için ortak bir kutuda tutun."
    ],
    keywords: ['terazi yapma', 'tartı yok', 'kilo nasıl ölçülür', 'ağırlık ölçme', 'kantar yapımı', 'iki kefeli terazi', 'el yapımı terazi', 'dirhem okka', '1 litre su kaç kilo'],
    sources: [
      "Wikipedia — Weighing scale: eşit kollu terazi ve kantar (https://en.wikipedia.org/wiki/Weighing_scale)",
      "Wikipedia — Ottoman units of measurement: okka, dirhem (https://en.wikipedia.org/wiki/Ottoman_units_of_measurement)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: eşit kollu terazide moment dengesi, kefeleri değiştirerek sınama, kantarın kayan ağırlığı. Su yoğunluğu yaklaşık 1 kg/L genel fizik bilgisi." },
  },
  {
    id: 'sf-dik-aci-3-4-5',
    category: 'sf-bt-zaman-olcu',
    title: "Dik açı kurmak: 3-4-5 kuralı",
    tag: "ÖLÇÜ",
    summary: "Kenarları 3, 4 ve 5 birim olan üçgen tam dik açı verir; temel, duvar ve tarla köşelerini bu kuralla kurun, köşegenleri eşitleyerek kontrol edin.",
    steps: [
      "12 eşit aralıklı bir ip hazırlayın: ipe 13 düğüm atın, düğümler arası 1 birim (ör. 50 cm ya da 1 m) olsun. Uçları birleştirince 12 aralıklı bir halka olur.",
      "İlk köşeye bir kazık çakın. Bu dik açının köşesidir.",
      "Yapının ilk kenarı boyunca ipi gerin ve köşeden 3 birim ötede ikinci kazığı çakın.",
      "Köşeden öbür yöne 4 birimlik ipi, ikinci kazıktan da 5 birimlik ipi gerin. İki ipin buluştuğu yere üçüncü kazığı çakın. Köşedeki açı tam 90 derecedir.",
      "Büyük yapılarda katlarını kullanın: 6-8-10 ya da 9-12-15. Kısa kenarlarla uzun bir duvar kurarsanız hata büyür.",
      "İpler yere paralel ve gergin olsun. Eğimli zeminde ipi su terazisiyle yatay tutun; yamaç boyunca gerilen ip ölçüyü bozar.",
      "Dikdörtgen kurduğunuzda iki köşegeni ölçün. Köşegenler eşitse bütün köşeler diktir; değilse uzun köşegenin uçlarını birbirine yaklaştırın."
    ],
    art: ['sf-bt-345-dugumlu-ip', null, null, 'sf-bt-345-ucgen', null, null, 'sf-bt-345-kosegen'],
    dont: [
      "Esneyen ip kullanmayın; naylon ip gerilince uzar ve açı bozulur.",
      "Temeli gözle kare yapmayın; küçük bir açı hatası duvarların ucunda karışlarca kaymaya döner."
    ],
    keywords: ['dik açı nasıl yapılır', '3 4 5 kuralı', 'gönye yok', 'temel köşesi', 'dikdörtgen temel atma', 'köşeyi dik yapmak', 'köşegen kontrolü', 'pisagor ip', 'gonye'],
    sources: [
      "Wikipedia — Pythagorean triple (https://en.wikipedia.org/wiki/Pythagorean_triple)",
      "Wikipedia — Special right triangle: 3-4-5 ve ip gerenler (https://en.wikipedia.org/wiki/Special_right_triangle)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: 3-4-5 ve 6-8-10 Pisagor üçlüleri; ipli dik açı kurulumunun tarihsel tartışması. Köşegen eşitliği geometrik gerçek." },
  },
  {
    id: 'sf-su-terazisi-sakul',
    category: 'sf-bt-zaman-olcu',
    title: "Su terazisi, şakul ve A-terazisi yapmak",
    tag: "ÖLÇÜ",
    summary: "Düşeyi ipe asılı bir ağırlıkla, yatayı içi su dolu şeffaf bir hortumla ya da şakullü bir A-çerçevesiyle bulun.",
    steps: [
      "Şakul yapın: 1–2 m sağlam ipin ucuna sivri uçlu ağır bir cisim (taş, somun, kurşun) bağlayın. Asılı ip düşeydir.",
      "İp sallanmasın diye ağırlığı yerdeki bir su kovasının içine sarkıtın; salınım çabuk durur.",
      "Duvarı kontrol edin: ipi duvarın üst kenarından tutun. İp ile duvar arasındaki uzaklık üstte ve altta eşitse duvar düşeydir.",
      "Hortum terazisi yapın: birkaç metre şeffaf hortumu suyla doldurun. İçinde hava kabarcığı kalmasın. Suya biraz boya ya da çay katarsanız kolay okunur.",
      "Hortumun iki ucunu yan yana dik tutup su seviyelerinin aynı olduğunu görün. Sonra bir ucu başlangıç işaretine, öbürünü ölçeceğiniz yere götürün. Su seviyeleri hep aynı yüksekliktedir.",
      "A-terazisi yapın: 2 m'lik iki eşit çubuğu tepeden birleştirip A biçiminde ortadan bir yatay çubukla bağlayın. Tepeden şakul sarkıtın.",
      "A-terazisini ayarlayın: iki ayağı yerde iki noktaya koyup ipin yatay çubuğu kestiği yeri işaretleyin. Ayakların yerini değiştirip yine işaretleyin. İki işaretin tam ortası yatay noktasıdır.",
      "A-terazisiyle yamaçta aynı yükseklikteki noktaları kazıkla işaretleyin. Bu eş yükselti çizgisi teras, hendek ve su arkı için yol gösterir.",
      "Eğimi ölçün: 1 m'lik yatay çubuğun bir ucunu yere koyun, öbür ucunun yerden yüksekliğini cm olarak ölçün. Bulduğunuz sayı yüzde eğimdir."
    ],
    art: [null, null, 'sf-bt-sakul-duvar', null, 'sf-bt-hortum-terazi', 'sf-bt-a-terazisi', null, null, null],
    dont: [
      "Hortumda hava kabarcığı bırakmayın; seviyeler yanlış çıkar.",
      "Hortumun bir ucunu güneşte, öbürünü gölgede uzun süre bırakmayın; sıcaklık farkı ölçüyü bozar.",
      "Ayarlanmamış A-terazisiyle arık açmayın; su ya göllenir ya da toprağı oyar."
    ],
    keywords: ['su terazisi yapma', 'hortum terazisi', 'şakul nasıl yapılır', 'duvar düz mü', 'yatay bulma', 'eğim ölçme', 'a terazisi', 'teras çizgisi', 'sakul', 'tesviye'],
    sources: [
      "Wikipedia — Water level (device) (https://en.wikipedia.org/wiki/Water_level_(device))",
      "Wikipedia — Plumb bob (https://en.wikipedia.org/wiki/Plumb_bob)",
      "Wikipedia — A-frame level (https://en.wikipedia.org/wiki/A-frame_level)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: hortum terazisinde kabarcık ve sıcaklık hatası, boya; şakulün suda sönümlenmesi; A-çerçevesi (archipendulum) ortası işaretli yatay çubukla. Ters çevirerek ayar yöntemi geometrik akıl yürütme." },
  },
  {
    id: 'sf-harita-cizme',
    category: 'sf-bt-zaman-olcu',
    title: "Harita çizmek ve mesafe ölçmek",
    tag: "ÖLÇÜ",
    summary: "Sabit bir başlangıç noktasından yön ve adımla ölçerek ilerleyin, her ölçüyü ölçekli kâğıda işleyin; su, yol ve tehlikeli yerleri işaretleyin.",
    steps: [
      "Kâğıdın üstüne kuzey oku çizin. Haritanın adını, tarihini ve çizenin adını köşeye yazın.",
      "Ölçek seçin: ör. 1 cm = 100 m. Ölçeği haritaya çizgi olarak da çizin; kopyalanınca bozulmaz.",
      "Kolay bulunan bir başlangıç noktası seçin: köy çeşmesi, büyük kaya, yol kavşağı. Bu nokta haritanın merkezi olsun.",
      "Bir sonraki noktaya yönü pusulayla ya da güneşle belirleyin. Yön bulma için uygulamadaki yön bulma rehberlerine bakın.",
      "Mesafeyi adımınızla ölçün. Her 100 m'de bir taş ya da düğüm sayın. Defterinize 'Çeşme → kaya: kuzeydoğu, 320 m' gibi yazın.",
      "Ölçtüklerinizi her akşam kâğıda işleyin. Yürüdüğünüz hatları ince çizgiyle çizin, sonra düzeltin.",
      "Ulaşamadığınız bir tepeyi iki ayrı noktadan nişan alın. Haritada iki noktadan bu yönlerde çizgi çekin; kesiştiği yer tepedir.",
      "Önemli yerleri işaretleyin: su kaynakları, patikalar, köprüler, tarlalar, sel ve heyelan riskli yerler, toplanma noktası. Köşeye işaretlerin açıklamasını yazın.",
      "Haritayı yerinde sınayın: başka biri haritaya bakarak bir noktayı bulabiliyor mu? Sonra en az iki kopya yapın."
    ],
    art: [null, 'sf-bt-harita-kuzey-olcek', null, null, null, null, 'sf-bt-harita-kesisim', 'sf-bt-harita-isaretler', null],
    dont: [
      "Ölçeği yalnızca sözle yazmayın; kâğıt büyütülüp küçültülünce yanlış olur, çizgi ölçek de koyun.",
      "Tehlikeli yerleri (yıkık bina, heyelan, derin su) haritadan eksik bırakmayın."
    ],
    keywords: ['harita çizme', 'kroki çizmek', 'harita nasıl yapılır', 'mesafe ölçme', 'adımla ölçmek', 'ölçekli harita', 'çevre haritası', 'köy krokisi', 'harita cizimi'],
    sources: [
      "Wikipedia — Pace count beads: 100 m'de sayım (https://en.wikipedia.org/wiki/Pace_count_beads)",
      "Akıl Çantası ana uygulama — Pusula ve haritayla yön bulma rehberi"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: adım sayımı ve 100 m'lik sayaç düzeni. Kesişim (iki noktadan nişan) yöntemi temel ölçme bilgisi; ayrı bir harita okuma el kitabıyla doğrulanamadı (RAPOR)." },
  },
  {
    id: 'sf-yukseklik-olcme',
    category: 'sf-bt-zaman-olcu',
    title: "Yükseklik ölçmek: gölge ve çubuk",
    tag: "ÖLÇÜ",
    summary: "Boyu bilinen bir çubuğun gölgesini aynı anda ağacın gölgesiyle karşılaştırın; oran aynıdır. Gölge yoksa 45 derecelik üçgenle ölçün.",
    steps: [
      "Güneşli bir saatte, düz zemine 1 m'lik bir çubuğu şakulle dik dikin.",
      "Çubuğun gölgesini ve ölçeceğiniz ağacın ya da duvarın gölgesini aynı anda ölçün. Gölgeler hızla değişir; iki ölçü arasında birkaç dakikadan fazla geçmesin.",
      "Hesaplayın: yükseklik = ağacın gölgesi × çubuk boyu ÷ çubuğun gölgesi. Örnek: çubuk 1 m, gölgesi 1,5 m; ağacın gölgesi 18 m ise ağaç 12 m'dir.",
      "Kolay yol: kendi gölgeniz boyunuza eşit olduğu anı bekleyin. O anda her şeyin gölgesi kendi yüksekliğine eşittir.",
      "Gölge yoksa 45 derece üçgeni kullanın: kare bir kâğıdı köşegenden katlayın. Bir kısa kenarı yatay tutup köşegen boyunca nişan alın, tepeyi görene kadar ileri geri yürüyün.",
      "Tepeyi köşegenden gördüğünüz yerde durun. Ağaca olan uzaklığınıza göz yüksekliğinizi ekleyin; sonuç yüksekliktir.",
      "Ağaç kesecekseniz sonucu kullanın: devrilme alanını, ağacın boyunun en az iki katı yarıçapla boşaltın. Yamaçta ağaç ve kütük yuvarlanabilir; mesafeyi daha da artırın."
    ],
    art: ['sf-bt-yukseklik-cubuk', 'sf-bt-yukseklik-golgeler', null, null, 'sf-bt-yukseklik-45-ucgen', null, null],
    dont: [
      "Eğimli zeminde gölge ölçmeyin; gölge uzar ya da kısalır, sonuç yanlış çıkar.",
      "Bulduğunuz yüksekliğe güvenip devrilme alanında kimseyi bırakmayın; ağaç beklenmedik yöne düşebilir."
    ],
    keywords: ['ağaç boyu ölçme', 'yükseklik ölçme', 'gölgeyle ölçmek', 'bina yüksekliği', 'ağaç kaç metre', 'thales yöntemi', 'yukseklik hesaplama', 'direk boyu'],
    sources: [
      "Wikipedia — Thales of Miletus: piramidin gölgeyle ölçülmesi (https://en.wikipedia.org/wiki/Thales_of_Miletus)",
      "Wikipedia — Special right triangle: 45-45-90 üçgen (https://en.wikipedia.org/wiki/Special_right_triangle)",
      "OSHA 29 CFR 1910.266 Logging operations: kesilen ağaca en az iki ağaç boyu, yamaçta daha fazla (https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: 'iki ağaç boyu' kuralı OSHA 1910.266(d)(6)(ii) ve (h)(1)(iv) ile teyit edildi; yamaçta daha fazla mesafe eklendi. Benzer üçgen hesabı (1 m / 1,5 m; 18 m gölge = 12 m) ve 45° yöntemi doğru." },
  },
  {
    id: 'sf-kayit-tutma',
    category: 'sf-bt-zaman-olcu',
    title: "Kayıt tutmak: envanter, günlük, nüfus",
    tag: "BİLGİ",
    summary: "Ortak defterleri tarihli, silinmez ve iki kişinin kontrol ettiği biçimde tutun; kişisel bilgileri gizli saklayın ve her önemli defterin bir kopyasını ayrı yerde bulundurun.",
    steps: [
      "Üç ayrı defter açın: günlük (olaylar ve kararlar), envanter (ambar ve aletler), nüfus (kişiler). Her sayfanın başına tarih yazın.",
      "Yanlışı silmeyin, kazımayın. Üstünü tek çizgiyle çizin, yanına doğrusunu ve yazanın adını yazın.",
      "Envanter satırı: tarih, ne, miktar, birim, giren ya da çıkan, kalan, yazan. Her çıkışı aynı gün yazın.",
      "Günlük defterine her gün kısa yazın: hava, yapılan işler, doğum, ölüm, hastalık, gelen-giden kişi, alınan kararlar.",
      "Nüfus defterine kişinin izniyle yazın: ad, doğum yılı, yakınları, bildiği işler, özel ihtiyacı. Sağlık bilgilerini yalnız bakım ekibinin göreceği ayrı bir sayfada tutun.",
      "Haftada bir sayım yapın. Envanteri ambarla karşılaştırın; sayımı iki farklı kişi yapıp ikisi de imzalasın.",
      "Ayda bir önemli defterlerin kopyasını çıkarın ve ayrı bir yerde, kuru bir kutuda saklayın.",
      "Defterler herkese açık olsun; isteyen kararları ve ambarı okuyabilsin. Gizli tutulan yalnız kişisel sağlık bilgisidir."
    ],
    art: ['sf-bt-kayit-uc-defter', 'sf-bt-kayit-duzeltme', null, null, null, 'sf-bt-kayit-iki-kisi', null, null],
    dont: [
      "Ambar defterini tek kişiye bırakmayın; hata da haksızlık da fark edilmez.",
      "Kişilerin hastalık ve özel bilgilerini herkesin göreceği deftere yazmayın.",
      "Silinmesi kolay kurşun kalemle yazılmış tek kopyaya güvenmeyin; kopyasını alın."
    ],
    keywords: ['kayıt tutma', 'envanter defteri', 'stok sayımı', 'nüfus kaydı', 'günlük tutmak', 'defter nasıl tutulur', 'ambar kaydı', 'kim ne aldı', 'kayit defteri'],
    sources: [
      "Library of Congress — Care, handling and storage of paper (https://www.loc.gov/preservation/care/paper.html)",
      "Wikipedia — Local exchange trading system: ortak ve açık kayıt düzeni (https://en.wikipedia.org/wiki/Local_exchange_trading_system)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: kâğıt saklama ve kalem kullanımı (LoC), herkese açık bakiye ve merkezi kayıt (LETS). Defter düzeni genel kayıt uygulaması; sayısal değer yok." },
  },
  {
    id: 'sf-okuma-yazma-ogretme',
    category: 'sf-bt-zaman-olcu',
    title: "Okuma-yazma öğretmek (çocuk ve yetişkin)",
    tag: "EĞİTİM",
    summary: "Harflerin adını değil sesini öğretin, birkaç sesle başlayıp hemen hece ve kelime kurun, her gün kısa ve düzenli çalışın.",
    steps: [
      "Kısa ve her gün çalışın. Uzun ve ara sıra yapılan dersten, her gün aynı saatte yapılan kısa ders daha iyi öğretir.",
      "Harfin adını değil sesini öğretin: 'ke' değil 'k'. Ağzınızı göstererek sesi uzatın, öğrenci tekrar etsin.",
      "Birkaç sesle başlayın. MEB'in güncel programında ilk grup a, n, e, t, i, l; ikinci grup o, k, u, r, ı, m seslerinden oluşur. Bu sırayı izleyebilirsiniz.",
      "İki sesi hemen birleştirin: e-l → el, a-l → al, n-e → ne. Hece okumak, harf ezberlemekten önemlidir.",
      "Heceden kelimeye, kelimeden kısa cümleye geçin: 'Ali al.', 'Ela tel al.' Bildiği seslerle yazılmış cümleler okusun.",
      "Yazmayı okumayla birlikte öğretin. Kâğıt yoksa ıslak kum tepsisi, sopa ile toprak ya da kömürle tahta kullanın.",
      "Yeni sesleri birer birer ekleyin. Öğrenilen her sesten sonra eski sesleri de içeren kelimeler okutun.",
      "Gerçek metinlerle çalışın: topluluğun duyuru tahtası, ambar listesi, tarif, mektup. Okumanın işe yaradığını görmek öğrenmeyi hızlandırır.",
      "Yetişkinleri ayrı ve saygıyla eğitin. Kimseyi başkalarının önünde okumaya zorlamayın, hatayı alay konusu yapmayın.",
      "Okuyabilen her kişi bir başkasına öğretsin. Böylece bilgi tek öğretmene bağlı kalmaz."
    ],
    art: [null, 'sf-bt-okuma-ses', null, 'sf-bt-okuma-hece', null, 'sf-bt-okuma-kum-tepsi', null, null, null, null],
    dont: [
      "Hata yapan öğrenciyi azarlamayın, dövmeyin; korku öğrenmeyi durdurur.",
      "Bütün alfabeyi ilk günlerde ezberletmeye çalışmayın."
    ],
    keywords: ['okuma yazma öğretmek', 'çocuğa okuma öğretme', 'alfabe öğretmek', 'okuma yazma bilmeyen', 'ses temelli', 'hece öğretmek', 'yetişkine okuma', 'harf öğretme', 'okul yokken eğitim'],
    sources: [
      "INEE — Minimum Standards for Education (https://inee.org/minimum-standards)",
      "MEB — İlkokul Türkçe Dersi Öğretim Programı (Türkiye Yüzyılı Maarif Modeli), ses esaslı ilk okuma yazma ve ses grupları (https://karainler.meb.k12.tr/meb_iys_dosyalar/74/01/417274/dosyalar/2024_05/02130547_turkce.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: Türkiye Yüzyılı Maarif Modeli Türkçe programında ses esaslı ilk okuma yazma; ses grupları 1) a, n, e, t, i, l 2) o, k, u, r, ı, m 3) ü, s, ö, y, d, z 4) ç, b, g, c, ş 5) p, h, v, ğ, f, j. Yazarın yazdığı e, l, a, k, i, n eski (2018) programın grubuydu, düzeltildi. Örnek cümle yeni ilk grupla uyumlu yapıldı. INEE ilkeleri yazarın kaynağı." },
  },
  {
    id: 'sf-temel-aritmetik',
    category: 'sf-bt-zaman-olcu',
    title: "Temel aritmetik öğretmek ve günlük hesap",
    tag: "EĞİTİM",
    summary: "Saymayı taş ve fasulyeyle, onluk demetlerle öğretin; bir boncuk çerçevesiyle toplama, çıkarma, çarpma ve bölmeye geçin, hesabı ambar ve tarla işleriyle uygulayın.",
    steps: [
      "Saymaya nesneyle başlayın: taş, fasulye, çubuk. Her nesneye dokunarak sayın.",
      "Onları demetleyin: 10 çubuğu iple bağlayın. 23 = 2 demet ve 3 tek çubuktur. Basamak fikri buradan doğar.",
      "Boncuk çerçevesi yapın: bir tahta çerçeveye 10 tel ya da ip gerin, her birine 10 boncuk (delikli fasulye, düğüm) dizin.",
      "Toplama ve çıkarmayı çerçevede gösterin, sonra kâğıda ya da toprağa yazdırın. Önce somut, sonra yazı.",
      "Çarpmayı sıralarla gösterin: 6 × 7 için 6 telde 7'şer boncuk ayırın, toplam 42'dir. Çarpım tablosunu bu sıralarla ezberletin.",
      "Bölmeyi paylaştırmayla öğretin: 20 ekmeği 4 aileye eşit dağıtın. Artanı ne yapacağınızı konuşun.",
      "Kesirleri ip ve ekmekle gösterin: ikiye, dörde, sekize bölün. Yarım, çeyrek ve ölçüleri birlikte kullanın.",
      "Günlük hesap yaptırın: ambar kaç gün yeter, tarlaya kaç sıra tohum gerekir, 3 kova suyla kaç litre eder.",
      "Her sonucu ters işlemle kontrol etmeyi öğretin: toplamı çıkarmayla, çarpımı bölmeyle sınayın."
    ],
    art: [null, 'sf-bt-aritmetik-demet', null, null, 'sf-bt-aritmetik-carpma', 'sf-bt-aritmetik-paylastirma', null, null, null],
    dont: [
      "Ezberi anlamadan önce zorlamayın; nesneyle göstermeden tablo ezberletmeyin.",
      "Ambar ve pay hesabını tek kişinin hesabına bırakmayın; ikinci bir kişi kontrol etsin."
    ],
    keywords: ['matematik öğretmek', 'aritmetik', 'çarpım tablosu', 'sayı saymayı öğretme', 'abaküs yapma', 'boncuklu sayı çerçevesi', 'hesap yapmak', 'bölme öğretme', 'kesir öğretme'],
    sources: [
      "Wikipedia — Abacus: sayı çerçevesi ve çakıl taşlarıyla hesap (https://en.wikipedia.org/wiki/Abacus)",
      "INEE — Minimum Standards for Education (https://inee.org/minimum-standards)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: boncuk çerçevesiyle 6×7 gösterimi ve onluk düzen (Abacus), bağlama uygun ve katılımcı öğretim (INEE)." },
  },
  {
    id: 'sf-bilgiyi-koruma',
    category: 'sf-bt-zaman-olcu',
    title: "Bilgiyi korumak: kâğıt, kopyalama, saklama",
    tag: "BİLGİ",
    summary: "Hayati bilgiyi seçin, en az üç kopya yapıp üç ayrı yerde serin, kuru ve karanlık saklayın; her bilgiyi en az iki kişiye öğretin.",
    steps: [
      "Neyin korunacağını seçin: ilk yardım, su arıtma, tarım takvimi, tohum bilgisi, yapı, haritalar, topluluk kayıtları. Önce bunlar.",
      "Kalıcı yazın. Kâğıda kurşun kalemle ya da solmayan siyah mürekkeple, okunaklı ve büyük yazın. Her sayfaya başlık ve tarih koyun.",
      "Her hayati metinden en az 3 kopya yapın ve 3 ayrı yerde saklayın. Tek bir yangın ya da sel hepsini yok etmesin.",
      "Kopyayı iki kişi karşılaştırsın: biri aslından sesli okusun, öbürü kopyadan takip etsin. Sayılarda özellikle dikkatli olun.",
      "Serin, kuru ve karanlık yerde saklayın. Çatı arası ve bodrum aşırı sıcak, nem ve su baskını riski taşır; ikisinden de kaçının.",
      "Kâğıtları katlamayın; ataç, lastik, bant ve yapıştırıcı kullanmayın. Düz, kapaklı bir sandık ya da kutuda, yerden yüksekte tutun.",
      "Ayda bir kutuları açıp nem, küf ve böcek kontrolü yapın. Islanmış kâğıdı gölgede, düz yayarak kurutun.",
      "Bu uygulama gibi elektronik bilgiyi güneşle şarj edilen cihazlarda tutun, ama elektronik bozulabilir. En hayati bilgileri kâğıda da geçirin.",
      "Her önemli bilgiyi en az iki kişi bilsin. Ezber, hikâye ve uygulamalı öğretim, kâğıt kaybolsa da bilgiyi yaşatır."
    ],
    art: [null, null, 'sf-bt-bilgi-uc-kopya', 'sf-bt-bilgi-karsilastirma', null, 'sf-bt-bilgi-sandik', null, null, null],
    dont: [
      "Bütün kopyaları aynı yerde saklamayın.",
      "Kâğıdı doğrudan güneşte, ocak ya da soba yanında tutmayın.",
      "Yalnız telefona ya da tek bir cihaza güvenmeyin."
    ],
    keywords: ['bilgiyi koruma', 'belge saklama', 'kitap koruma', 'kopya çıkarma', 'kâğıt nasıl saklanır', 'arşiv', 'bilgi kaybolmasın', 'nem küf kâğıt', 'yazılı kayıt saklama'],
    sources: [
      "Library of Congress — Care, handling and storage of paper (https://www.loc.gov/preservation/care/paper.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: serin ve kuru ortam (yaklaşık %35 bağıl nem), ışıktan koruma, çatı arası ve bodrumdan kaçınma, ataç-bant-yapıştırıcı yasağı, düz saklama (LoC). Üç kopya kuralı ihtiyat önerisi." },
  },

  // ───────────── HABERLEŞME VE YOL ─────────────
  {
    id: 'sf-pmr446-telsiz',
    category: 'sf-bt-haberlesme-yol',
    title: "PMR446 telsiz: kanal düzeni ve çağrı usulü",
    tag: "TELSİZ",
    summary: "Ruhsatsız kullanılan PMR446 el telsizleri için topluluğa yazılı bir kanal ve dinleme planı yapın, önce dinleyip kısa ve düzenli konuşun.",
    note: "Türkiye'de PMR446 el telsizleri frekans tahsisi gerektirmez; ancak yalnız el tipi cihazla, 446,0–446,2 MHz bandında, en çok 0,5 W e.r.p. ve cihazın tümleşik (sökülmeyen) anteniyle kullanılabilir. Harici anten, güç artırma, baz istasyonu ve röle bu muafiyetin dışındadır.",
    steps: [
      "Cihazınızı tanıyın. PMR446'nın 16 analog kanalı vardır: 1. kanal 446,00625 MHz, 16. kanal 446,19375 MHz, aralar 12,5 kHz. Bazı ucuz telsizler başka frekanslarda da yayın yapabilir; yalnız PMR kanallarını kullanın.",
      "Topluluğa yazılı bir kanal planı yapın: ör. bir çağrı kanalı (herkes bunu dinler), bir görüşme kanalı, bir yedek kanal. Planı her telsizin arkasına yapıştırın.",
      "Alt ton (CTCSS/DCS) kodu yalnız gürültüyü süzer, gizlilik sağlamaz. Aynı kanalı dinleyen herkes sizi duyar; ambar yeri gibi bilgileri telsizde söylemeyin.",
      "Önce dinleyin. Kanal boşsa tuşa basın, 1 saniye bekleyin, sonra ağzınızdan bir karış uzakta, normal sesle konuşun.",
      "Çağrı usulü: 'Kuyu, burası Ambar. Tamam.' Karşı taraf: 'Ambar, burası Kuyu, dinliyorum. Tamam.' Konuşma bitince: 'Ambar, bitti.'",
      "Kısa konuşun. Cihazlar bir seferde en çok 3 dakika yayın yapar ve keser; tek seferde bir konu söyleyin, sonra 'Tamam' deyip tuşu bırakın.",
      "Menzil kısa ve arazi bağımlıdır. Ormanda, vadide ve binalar arasında çok düşer. Tepeye, açık görüşlü yere çıkın; anteni dik tutun.",
      "Pili koruyun: sürekli açık tutmak yerine dinleme saatleri belirleyin (ör. her saat başı 5 dakika). Yedek pili güneşle şarj edin.",
      "Acil çağrıda 'ACİL, ACİL, ACİL, burası …' deyin. O sırada kanaldaki herkes susar ve acil konuşmaya yol verir.",
      "Önemli mesajları yazın: saat, kimden, kime, ne. Karşı taraf önemli mesajı geri okusun."
    ],
    art: [null, 'sf-bt-pmr-plan-etiketi', null, 'sf-bt-pmr-konusma', null, null, 'sf-bt-pmr-tepe', null, null, null],
    dont: [
      "Telsizin antenini değiştirmeyin, uzatmayın, güç artırıcı takmayın; PMR446 ile sabit baz istasyonu ya da röle kurmayın.",
      "Tuşu basılı unutmayın; kanalı kilitler, herkesi sağır eder.",
      "Anteni sökülmüş telsizle yayın yapmayın; cihaz bozulabilir.",
      "Telsizde kişisel bilgi, yiyecek stoku ve güvenlik düzenini açıkça söylemeyin."
    ],
    keywords: ['pmr446', 'pmr telsiz', 'el telsizi', 'ruhsatsız telsiz', 'telsiz kanalları', 'telsizle konuşma', 'telsiz nasıl kullanılır', 'walkie talkie', 'telsiz menzili', 'pmr kanal frekansı', 'telsiz cagri'],
    sources: [
      "BTK — Bireysel frekans tahsisi gerektirmeyen telsiz cihazları teknik ölçütler taslağı, PMR 446 bölümü (https://btk.gov.tr/s3/web-btk-site/7708c26c-5161-4919-8b3d-daa31d4ac8fb/2026/05/01c0ec40-b281-44e2-a8e9-3576aea0f354.pdf)",
      "Motorola Solutions — What is PMR446 (https://www.motorolasolutions.com/en_xu/solutions/what-is-pmr446.html)",
      "PMR446 kanal tablosu ve CTCSS açıklaması (https://thejeshgn.com/wiki/notebook/pmr446-personal-mobile-radio-at-446-mhz)",
      "ANCOM RO-IR15 PMR446 — ECC/DEC/(15)05 dayanaklı arayüz: 446–446,2 MHz, 500 mW e.r.p., yalnız tümleşik anten (https://www.ancom.ro/en/uploads/links_files/RO-IR15-PMR446_RED_en_V2.pdf)",
      "Kenwood — PMR446 White Paper 2016: 180 sn zaman aşımı, sabit tümleşik anten, röle ve baz istasyonu yasağı (https://kenwoodcommunications.co.uk/files/file/comms/uk/pmr446/PMR446-White-Paper-V6_18AUG2016_JT_KB.pdf)",
      "Wikipedia — PMR446: 16 analog kanal, 446,00625–446,19375 MHz (https://en.wikipedia.org/wiki/PMR446)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: BTK 2026 taslağı (Frekans Tahsisinden Muaf Telsiz Cihaz ve Sistemlerine İlişkin Teknik Ölçütler, md. 16, Tablo 14) ECC/DEC(15)05 ve CEPT uygulamasıyla (ANCOM, Kenwood) aynı: 446,0–446,2 MHz, 500 mW e.r.p., yalnız tümleşik anten, baz istasyonu ve röle hariç, 180 sn zaman aşımı; 16 analog kanal 446,00625–446,19375 MHz (Wikipedia). 2012 KET Yönetmeliği 2018'de yürürlükten kalktı; yürürlükteki BTK ölçüt metni okunamadı, taslağın kesinleşmiş hâli kontrol edilmeli." },
  },
  {
    id: 'sf-amator-telsiz',
    category: 'sf-bt-haberlesme-yol',
    title: "Amatör telsizcilik ilkeleri",
    tag: "TELSİZ",
    summary: "Amatör telsiz uzak mesafe haberleşme sağlar ama belge ister; topluluğunuzdaki belgeli telsizciyi bulun, çağrı işareti, kayıt ve açık konuşma kurallarına uyun.",
    note: "Türkiye'de amatör telsiz istasyonu kurmak ve yayın yapmak, Kıyı Emniyeti Genel Müdürlüğü'nün (KEGM) sınavla verdiği amatör telsizcilik belgesine ve BTK düzenlemelerine bağlıdır; olağan koşullarda belgesiz yayın yasaktır. Belgesiz bir kişinin gerçek can tehlikesinde amatör bantta yardım çağrısı yapıp yapamayacağı Türk mevzuatında açıkça düzenlenmemiştir, bu konu belirsizdir.",
    steps: [
      "Beceri envanterinde sorun: aranızda amatör telsizcilik belgesi olan biri var mı? Varsa telsiz istasyonunu o yönetsin, başkalarını o eğitsin.",
      "Amatör telsizci çağrı işaretini görüşmenin başında, belli aralıklarla ve sonunda söyler. Türkiye çağrı işaretleri TA, TB, TC ya da YM ile başlar, sonra bölge rakamı ve son ek gelir.",
      "Konuşmalar açıktır. Şifreli mesaj, müzik yayını, ticari kullanım ve ücretli mesaj taşıma yasaktır.",
      "Bir istasyon kayıt defteri tutun: tarih, saat, frekans, karşı istasyon, kısa özet. Kayıt hem kuraldır hem de kimin nerede olduğunu gösterir.",
      "Afetlerde amatör telsizciler resmî afet yönetimine destek verir ve bir acil durum kontrol istasyonunun koordinasyonunda çalışır. Kendi bölgenizdeki düzeni bilen telsizcilerden öğrenin.",
      "Tatbikat mesajlarının başına 'TATBİKAT', eğitim mesajlarının başına 'EĞİTİM' deyin. Gerçek acil durumla karışmasın.",
      "Uzun mesafe için yüksek ve açık yer, iyi kurulmuş anten ve kararlı güç gerekir. Anten kurarken elektrik hatlarından uzak durun.",
      "Belge almak: KEGM amatör telsizcilik e-sınavına girilir; A, B ve C sınıfı belgeler vardır. Koşullar normale döndüğünde topluluktan birkaç kişinin belge alması uzun dönemde en sağlam haberleşme yoludur."
    ],
    art: ['sf-bt-amator-istasyon', null, null, 'sf-bt-amator-defter', null, null, 'sf-bt-amator-anten', null],
    dont: [
      "Belgesi olmayan kişiyi kendi çağrı işaretinizle yayın yaptırmayın.",
      "Anteni elektrik hattının altına ya da yakınına kurmayın; temas öldürür.",
      "Resmî kurumların frekanslarında yayın yapmayın."
    ],
    keywords: ['amatör telsiz', 'amator telsiz', 'telsizcilik belgesi', 'çağrı işareti', 'kısa dalga telsiz', 'uzak mesafe telsiz', 'ham radio', 'TRAC', 'amatör telsiz sınavı', 'telsiz istasyonu'],
    sources: [
      "Amatör Telsizcilik Yönetmeliği, Resmî Gazete metni (https://www.lexpera.com.tr/resmi-gazete/metin/amator-telsizcilik-yonetmeligi-25406)",
      "KEGM Amatör Telsizcilik e-Sınavı Başvuru ve Uygulama Kılavuzu 2022 (https://www.lexpera.com.tr/mevzuat/kilavuzlar/amator-telsizcilik-e-sinavi-basvuru-ve-uygulama-kilavuzu-2022-49559676)",
      "BTK — Teknik ölçütler taslağı, amatör tanımları (https://btk.gov.tr/s3/web-btk-site/7708c26c-5161-4919-8b3d-daa31d4ac8fb/2026/05/01c0ec40-b281-44e2-a8e9-3576aea0f354.pdf)",
      "BTK — Amateur radio: belgeyi KEGM verir, A, B ve C sınıfı (https://btk.gov.tr/en/amateur-radio)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: belgeyi KEGM verir, sınıflar A, B, C (BTK sayfası; BTK 2026 taslağı tanımlar). Çağrı işareti önekleri TA/TB/TC/YM (2004 Yönetmeliği md. 12). 2004 Yönetmeliği md. 35(c) belgeli telsizcinin belgesiz kişiyle haberleşmesini yalnız olağanüstü hal ve acil durum haberleşmesinde istisna tutar; belgesiz kişinin kendi yayınına izin veren hüküm bulunamadı. 2004 metninin bugün tümüyle yürürlükte olup olmadığı doğrulanamadı; hukukçuya sorulmalı." },
  },
  {
    id: 'sf-mors-kodu',
    category: 'sf-bt-haberlesme-yol',
    title: "Mors kodu: öğrenme ve kullanma",
    tag: "HABERLEŞME",
    summary: "Nokta kısa, çizgi üç nokta uzunluğundadır; harfler arası 3, kelimeler arası 7 nokta boşluk bırakın. Mors'u ışık, ses ve telsizle kullanabilirsiniz.",
    steps: [
      "Zaman kuralını öğrenin: çizgi 3 nokta uzunluğundadır. Bir harfin içindeki boşluk 1 nokta, harfler arası 3 nokta, kelimeler arası 7 nokta sürer.",
      "Önce sık harfleri öğrenin: E (.), T (-), A (.-), N (-.), I (..), M (--), S (...), O (---).",
      "Sonra öbür harfler: R (.-.), K (-.-), D (-..), U (..-), L (.-..), H (....), G (--.), W (.--), B (-...), C (-.-.), F (..-.), P (.--.), V (...-), Y (-.--), Z (--..), J (.---), Q (--.-), X (-..-).",
      "Rakamlar 5 işaretlidir: 1 (.----), 2 (..---), 3 (...--), 4 (....-), 5 (.....), 6 (-....), 7 (--...), 8 (---..), 9 (----.), 0 (-----).",
      "Türkçe harfler için standart karşılığı kullanın: Ç yerine C, Ğ yerine G, I ve İ yerine I, Ö yerine O, Ş yerine S, Ü yerine U yazın.",
      "Yardım çağrısı SOS'tur: üç kısa, üç uzun, üç kısa (...---...), harf arası boşluk bırakmadan tek parça gönderilir. Kısa bir aradan sonra tekrarlayın.",
      "Usul işaretleri: başlama (-.-.-), karşı taraf konuşabilir K (-.-), bekle (.-...), anlaşıldı (...-.), hata (........, 8 nokta), iş bitti (...-.-).",
      "Kulağı eğitin: işaretleri tek tek noktalar olarak değil, ses kalıbı olarak dinleyin. Her gün 10–15 dakika iki kişi karşılıklı çalışın.",
      "Gönderme araçları: el feneri, ayna, düdük, kazana vurma, telsiz tuşu. Yavaş ve düzenli göndermek hızlı ama karışık göndermekten iyidir."
    ],
    art: ['sf-bt-mors-zaman', 'sf-bt-mors-tablo', null, null, null, 'sf-bt-mors-sos-fener', null, null, null],
    dont: [
      "SOS'u deneme ya da şaka için göndermeyin; yardım ekiplerini boşuna yollara düşürür.",
      "Harfler arası boşluğu atlamayın; harfler birbirine karışır."
    ],
    keywords: ['mors kodu', 'mors alfabesi', 'morse', 'sos nasıl verilir', 'mors öğrenme', 'nokta çizgi', 'fenerle mors', 'telgraf kodu', 'mors harfleri', 'sos isareti'],
    sources: [
      "ITU-R M.1677-1 — International Morse code (https://www.johndcook.com/ITU_Morse_Code.pdf)",
      "Wikipedia — SOS (https://en.wikipedia.org/wiki/SOS)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: harf ve rakam kodları, 1-3-7 boşluk kuralı, usul işaretleri (ITU-R M.1677-1); SOS'un tek parça gönderimi ve görsel kullanımı (Wikipedia). Türkçe harf eşlemesi uygulama önerisidir." },
  },
  {
    id: 'sf-isik-ayna-haberlesme',
    category: 'sf-bt-haberlesme-yol',
    title: "Işık ve ayna ile uzak haberleşme",
    tag: "HABERLEŞME",
    summary: "Birbirini gören iki tepe arasında gündüz ayna, gece fenerle ortak bir kod tablosu ya da Mors kullanarak mesaj gönderin, her mesajı karşı taraf onaylasın.",
    steps: [
      "İstasyon yeri seçin: iki yerleşim ya da kamp arasında birbirini doğrudan gören iki yüksek nokta. Arada tepe, orman ya da bina olmamalı.",
      "Ortak bir kod tablosu yazın ve her iki istasyonda aynı kopyayı tutun. Ör. 1 uzun = 'her şey yolunda', 2 uzun = 'yarın görüşelim', 3 kısa tekrar = 'yardım lazım'.",
      "Haberleşme saatleri belirleyin: ör. her gün güneş doğduktan 2 saat sonra ve gün batmadan 1 saat önce. Karşı taraf o saatte bakıyor olmalı.",
      "Gündüz ayna kullanın. Aynayı gözünüzün hemen altında tutun, öbür elinizle hedefe doğru V yapın; ışık beneğini parmaklarınızın arasından hedefe götürün.",
      "Işığı kapatıp açarak gönderin: aynayı hafifçe yana çevirerek ya da önüne bir tahta tutarak kısa ve uzun parlamalar yapın.",
      "Açık havada küçük bir ayna bile kilometrelerce öteden görülür. Kaba kural olarak her 2,5 cm ayna çapı çıplak gözle yaklaşık 16 km görünürlük sağlar; pus ve toz bunu çok azaltır.",
      "Gece fener ya da lamba kullanın. Işığın önünü bir kapakla kapatıp açarak Mors ya da kod gönderin.",
      "Her mesajın sonunda karşı taraf onay versin (ör. 1 uzun ya da Mors'ta R). Onay gelmezse mesajı tekrarlayın.",
      "Gönderdiğiniz ve aldığınız her mesajı saatiyle deftere yazın."
    ],
    art: ['sf-bt-isik-iki-tepe', null, null, 'sf-bt-isik-ayna-nisan', null, null, 'sf-bt-isik-gece-fener', null, null],
    dont: [
      "Yansıyan ışığı insanların, hayvanların ve araç sürücülerinin gözüne tutmayın.",
      "Güneşe ya da ayna içindeki güneş görüntüsüne doğrudan bakmayın.",
      "Kod tablosunu yazmadan, ezbere güvenerek haberleşmeyin; anlamlar karışır."
    ],
    keywords: ['ayna ile işaret', 'ışıkla haberleşme', 'fenerle işaret', 'heliograf', 'uzak mesafe işaret', 'tepeden tepeye haberleşme', 'ayna nasıl tutulur', 'gece fener işareti', 'ışık kodu'],
    sources: [
      "Wikipedia — Heliograph (https://en.wikipedia.org/wiki/Heliograph)",
      "ITU-R M.1677-1 — International Morse code (https://www.johndcook.com/ITU_Morse_Code.pdf)",
      "Akıl Çantası ana uygulama — Kurtarma ekiplerine işaret vermek (ayna tutma)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: heliografın Mors ile parlama göndermesi, görüş hattı ve güneş gereksinimi, '1 inç ayna ≈ 10 mil' kaba görünürlük kuralı (Heliograph)." },
  },
  {
    id: 'sf-duman-ses-isaret',
    category: 'sf-bt-haberlesme-yol',
    title: "Duman ve ses işaretleri, topluluk alarmı",
    tag: "HABERLEŞME",
    summary: "Üç ateş, üç düdük ya da üç ışık yardım çağrısıdır; topluluk için de yangın, sel ve toplanma gibi durumlara ayrı ses işaretleri belirleyip tatbikat yapın.",
    note: "Türkiye'de 6831 sayılı Orman Kanunu'nun 76. maddesine göre ormanda, izin verilen ocak yerleri dışında ateş yakmak yasaktır; yangın mevsiminde valilikler ormana 4 km'ye kadar ateş yakmayı da yasaklayabilir. İşaret ateşini yalnız gerçek tehlikede ve yangın güvenliği alınmış açık alanda yakın.",
    steps: [
      "Uluslararası yardım işaretini bilin: üçgen biçiminde üç ateş ya da üç taş yığını, üç düdük, üç ışık. Üç tekrarlı her şey 'yardım' demektir.",
      "Dağ yardım işareti: bir dakika içinde 6 düdük ya da 6 ışık, sonra bir dakika ara, tekrar. Cevap dakikada 3 işarettir.",
      "Topluluğun kendi alarm işaretlerini yazın ve herkese öğretin. Ör. sürekli hızlı çan = yangın; uzun aralıklı 3 çan = sel, yükseğe çıkın; tek uzun düdük = toplanma.",
      "Ses aracı seçin: düdük, çan, boş gaz tüpü ya da raya vurulan demir, davul. Düdük insan sesinden çok uzağa gider ve az güç ister.",
      "İşaret ateşini önceden hazırlayın: açık ve yüksek bir yerde, etrafı 3 m temizlenmiş, kuru çıra ve odun dizili bir yığın. Yağmurdan örtün.",
      "Gündüz duman görünür. Ateş iyi yanınca üstüne yeşil yaprak ya da nemli ot koyun; yoğun beyaz duman çıkar.",
      "Gece alev görünür. Duman yerine kuru odunla parlak alev yakın.",
      "Her ay kısa bir alarm tatbikatı yapın. Çocuklar dahil herkes işaretlerin anlamını ve nereye gideceğini bilsin.",
      "Alarm sesini yalnız gerçek durumda ve tatbikatta kullanın. Tatbikatı önceden duyurun."
    ],
    art: ['sf-bt-duman-uc-ates', null, null, 'sf-bt-duman-can', null, 'sf-bt-duman-beyaz', null, null, null],
    dont: [
      "Kuru, rüzgârlı havada ve ormanda işaret ateşi yakmayın.",
      "Lastik, plastik ya da yağ yakmayın; duman zehirlidir.",
      "Alarm işaretini oyun ya da şaka için çalmayın; insanlar gerçek alarmda tepki vermez olur."
    ],
    keywords: ['duman işareti', 'ses işareti', 'üç ateş', 'düdük işareti', 'alarm çanı', 'topluluk alarmı', 'yangın alarmı köy', 'dağ yardım işareti', 'işaret ateşi', 'duman isareti'],
    sources: [
      "Wikipedia — Distress signal: üç ateş, düdük, dağ işareti (https://en.wikipedia.org/wiki/Distress_signal)",
      "Wikipedia — SOS: görsel ve sesli kullanım (https://en.wikipedia.org/wiki/SOS)",
      "BirGün — Antalya Valiliği genelgesi: 6831 md. 76 (izinli ocak yeri dışında ateş yasağı) ve 4 km yasağı (https://www.birgun.net/haber/antalya-valiligi-nden-genelge-ormanlara-4-kilometre-mesafede-bile-ates-yakmak-yasak-448845)",
      "Orman Yangınlarıyla Mücadele Çalışmaları Hakkında Yönetmelik, OGM, RG 05.09.2026: izinli alan dışında ateş yakana 6831 md. 76 ve 110 (https://www.alomaliye.com/2026/09/05/orman-yanginlariyla-mucadele-calismalari-hakkinda-yonetmelik/)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yasal not 6831 md. 76 hükmüne göre düzeltildi (valilik genelgesi ve OGM 2026 yönetmeliği aracılığıyla; kanun metni mevzuat.gov.tr'den açılamadı). Yazarın notu: üç ateş/üç düdük/üç ışık, dakikada 6 işaret + 1 dk ara ve dakikada 3 cevap. Yeşil yaprakla beyaz duman FM 21-76 bilgisi; kamu kopyası açılamadı (RAPOR)." },
  },
  {
    id: 'sf-ulak-posta',
    category: 'sf-bt-haberlesme-yol',
    title: "Ulak ve posta düzeni",
    tag: "HABERLEŞME",
    summary: "Mesajları standart bir formla yazın, ulakları iki kişilik ve belli güzergahla gönderin, giden-gelen her mesajı deftere işleyip teslim imzası alın.",
    steps: [
      "Standart mesaj formu kullanın: numara, tarih-saat, kimden, kime, öncelik (ACİL / NORMAL), kısa metin, imza. Gereksiz söz yazmayın.",
      "Mesajı yazılı gönderin. Sözlü mesajsa ulak mesajı yüksek sesle geri tekrarlasın; aynıysa yola çıksın.",
      "Ulak tek gitmesin; iki kişi birlikte gitsin. Yola çıkmadan güzergahı, varış ve dönüş saatini posta defterine yazın.",
      "Dönüş saati geçerse ne yapılacağını önceden belirleyin: ör. yarım gün beklenir, sonra iki kişi aynı yoldan karşılamaya çıkar.",
      "Uzak yerleşimler için yol üstünde konaklama ve devir noktaları kurun. Mesaj çantası orada yeni ulağa geçer; devir deftere yazılır.",
      "Teslimde alan kişi mesaj defterine imza atsın. Cevap varsa aynı numarayla geri gelsin.",
      "Kişisel mektuplar için ortak posta çantası açın. Mektuplar açılmaz, okunmaz; yalnız sahibine verilir.",
      "Ulak görünür ve tarafsız olsun: belirgin bir bez ya da bayrak taşısın, karşılaştığı yerleşime önce kendini tanıtsın.",
      "Hava bozulur, köprü yıkılmış ya da yol tehlikeliyse ulak geri döner. Hiçbir mesaj bir insan hayatından önemli değildir."
    ],
    art: ['sf-bt-ulak-form', 'sf-bt-ulak-geri-okuma', 'sf-bt-ulak-iki-kisi', null, null, null, null, null, null],
    dont: [
      "Ulağı tek başına, kimseye haber vermeden yola çıkarmayın.",
      "Başkasının mektubunu açmayın; güven bir kez kırılınca posta düzeni çöker.",
      "Kötü havada ya da gece tehlikeli yolda mesaj yetiştirmek için acele etmeyin."
    ],
    keywords: ['ulak', 'posta düzeni', 'haberci göndermek', 'mesaj taşıma', 'mektup ulaştırma', 'köyler arası haberleşme', 'kurye', 'mesaj formu', 'posta defteri'],
    sources: [
      "ITU-R M.1677-1 — usul işaretleri ve mesaj başlangıç-bitiş düzeni (https://www.johndcook.com/ITU_Morse_Code.pdf)",
      "Amatör Telsizcilik Yönetmeliği — kayıt defteri ve mesaj işaretleme (https://www.lexpera.com.tr/resmi-gazete/metin/amator-telsizcilik-yonetmeligi-25406)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Doğrudan bir ulak/posta kaynağı bulunamadı; mesaj formu ve kayıt düzeni haberleşme usullerinden uyarlandı. Düzen önerisidir, sayısal değer içermez (RAPOR)." },
  },
  {
    id: 'sf-esek-at-bakimi',
    category: 'sf-bt-haberlesme-yol',
    title: "Eşek ve at bakımı (yük ve ulaşım için)",
    tag: "YOL",
    summary: "Yük hayvanına temiz su, bol lifli yem, tuz, kuru bir barınak ve her gün toynak ile sırt kontrolü sağlayın; aşırı tahıl ve aşırı yükten kaçının.",
    steps: [
      "Temiz suyu her zaman verin. Hayvan kirli ya da kokan suyu içmeyebilir; susuz kalır. Sıcakta ve çalışırken suyu daha sık sunun.",
      "Yemin çoğu lifli olsun: otlatma, kuru ot ve saman. Eşek attan daha az yer; günde vücut ağırlığının yaklaşık yüzde 1,5'u kadar kuru yem yeterlidir.",
      "Az az, gün boyu yedirin. Uzun açlıktan sonra bir anda çok yem vermeyin.",
      "Tahıl ve arpayı abartmayın. Fazla yem eşekte şişmanlık ve ayakta ağrılı bir hastalık olan laminite yol açar. Çalışmayan hayvana tahıl gerekmez.",
      "Tuz ve mineral taşı koyun; hayvan istediği kadar yalasın.",
      "Rüzgâr ve yağmurdan korunacak, üç tarafı kapalı, zemini kuru bir sundurma yapın.",
      "Toynakları her gün kaldırıp taş ve çamuru temizleyin. Eşek toynağı yavaş aşınır; uzayınca düzenli kesim gerekir. İhmal kalıcı topallığa yol açar.",
      "Yük, semer dahil hayvanın ağırlığının en çok beşte biri (yüzde 20) olsun: 150 kg'lık eşeğe en çok 30 kg. Ata da bu tutucu sınırı uygulayın. Semer ya da yük altına kalın keçe koyun. Yükü iki yana eşit dağıtın. Her akşam sırtta yara, şişlik ve tüy dökülmesi arayın; yara varsa iyileşene kadar yük vurmayın.",
      "Hastalık belirtileri: yem yememe, sürekli yatıp yuvarlanma, topallık, burun akıntısı. Hayvanı ayırın, dinlendirin, deneyimli birine danışın."
    ],
    art: ['sf-bt-esek-su', null, null, null, null, null, 'sf-bt-esek-toynak', 'sf-bt-esek-semer', null],
    dont: [
      "Yük hayvanını aç, susuz ve yaralı sırtla çalıştırmayın.",
      "Ekmek, çuval dolusu arpa ya da küflü ot vermeyin.",
      "Hayvanı dövmeyin; korkan hayvan tekmeler, ısırır ve işe yaramaz hale gelir."
    ],
    keywords: ['eşek bakımı', 'at bakımı', 'yük hayvanı', 'esek bakimi', 'eşek ne yer', 'toynak bakımı', 'semer yarası', 'katır', 'hayvanla taşıma', 'eşeğe yük'],
    sources: [
      "Wikipedia — Donkey: beslenme, toynak, sağlık sorunları (https://en.wikipedia.org/wiki/Donkey)",
      "Donkey Breed Society — Trekking: eşek semer ve takım dahil ağırlığının %20\'sinden fazla taşımamalı (https://www.donkeybreedsociety.co.uk/about-donkeys/activities/trekking/)",
      "TTG Media — Help the Santorini Donkeys: en çok vücut ağırlığının %20\'si (https://www.ttgmedia.com/news/obese-tourists-are-crippling-santorini-donkeys-charity-warns-14967)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yük sınırı semer dahil vücut ağırlığının %20'si (Donkey Breed Society; Help the Santorini Donkeys aynı oran). At için ayrı kaynak açılmadı; aynı tutucu oran önerildi. Beslenme ve toynak bilgisi yazarın Wikipedia kaynağına dayanıyor; Donkey Sanctuary açılamadı." },
  },
  {
    id: 'sf-patika-acma',
    category: 'sf-bt-haberlesme-yol',
    title: "Yol ve patika açmak",
    tag: "YOL",
    summary: "Patikayı yamaç eğiminin yarısından dik olmayacak biçimde işaretleyin, yaya için 2 m genişlik ve 2,5 m yükseklik temizleyin, suyu açılı su kesicilerle yoldan atın.",
    note: "Türkiye'de olağan koşullarda devlet ormanında orman idaresinin izni olmadan ağaç kesmek ve yol açmak 6831 sayılı Orman Kanunu'na göre yasaktır ve cezası vardır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    steps: [
      "Rotayı yamaç eğiminin yarısını geçmeyecek bir eğimle seçin. Yamaç yüzde 16 ise patika en çok yüzde 8 olsun. Çok kullanılan yollar ortalama yüzde 5–10 eğimde kalsın.",
      "Rotayı kurdele ya da taşla yaklaşık her 3 m'de bir işaretleyin. Yürüyüp kontrol etmeden kazmaya başlamayın.",
      "Yaya yolu için 2 m genişlik ve 2,5 m yükseklik temizleyin. Yük hayvanı geçecekse 2,5 m genişlik ve 3 m yükseklik açın.",
      "Dalları gövdeye yakın kesin ama gövdeyi yaralamayın. Kalın dalda önce alttan sığ bir kesik, sonra üstten kesin; kabuk soyulmaz.",
      "Yürüme yüzeyini dışa, yani aşağı tarafa hafif eğimli yapın. Yağmur suyu yoldan akıp gitsin, yol üstünde birikmesin.",
      "Su kesici yapın: yola 45–60 derece açıyla bir taş sırası ya da kütük gömün. Taşların üçte ikisi toprağa gömülsün, uçları en az 30 cm yamaca girsin.",
      "Eğim yönünü arada bir kısa süre ters çevirin: her 6–15 m'de 3–5 m'lik hafif bir tümsek, suyu yoldan dışarı atar.",
      "Yüzde 20'den dik yerde su kesici iş görmez; basamak yapın ya da rotayı zikzakla.",
      "Islak ve çamurlu geçitlerde kütük döşeme yapın (bkz. Basit köprü ve geçit). Rotayı belirgin yerlerde taş yığınıyla işaretleyin."
    ],
    art: ['sf-bt-patika-yarim-kurali', null, null, 'sf-bt-patika-dal-kesim', null, 'sf-bt-patika-su-kesici', null, null, null],
    dont: [
      "Patikayı dümdüz yamaç aşağı açmayın; yağmurla dereye döner ve toprak akıp gider.",
      "Ağaç gövdesini yaralayarak dal kesmeyin; ağaç çürür, sonra yola devrilebilir.",
      "Gevşek kaya ve toprak altında, heyelan izi olan yamaçta yol açmayın."
    ],
    keywords: ['patika açma', 'yol açmak', 'orman yolu', 'patika yapımı', 'su kesici', 'yokuş eğimi', 'yol bakımı', 'dağ yolu açma', 'katır yolu', 'patika egimi'],
    sources: [
      "USDA Forest Service — Trail Construction and Maintenance Notebook: Trail design, half rule (https://www.fs.usda.gov/t-d/pubs/htmlpubs/htm07232806/page04.htm)",
      "USDA Forest Service — Trail Notebook: Surface water control, waterbars (https://www.fs.usda.gov/t-d/pubs/htmlpubs/htm07232806/page06.htm)",
      "USDA Forest Service — Trail Notebook: Clearing and brushing (https://www.fs.usda.gov/t-d/pubs/htmlpubs/htm07232806/page07.htm)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: temizlik ölçüleri (yaya 2 × 2,5 m, yük hayvanı 2,5 × 3 m) USDA FS sayfa 07'den yeniden teyit edildi; yasal not netleştirildi. Yazarın notu: yarım kuralı, ortalama %5–10, 3 m'de bayrak, 2×2,5 m ve 2,5×3 m temizlik, dal kesimi, su kesici 45–60°, 2/3 gömülü, 30 cm yamaca giriş, %20 üstünde etkisiz, ters eğim 3–5 m / 6–15 m." },
  },
  {
    id: 'sf-basit-kopru',
    category: 'sf-bt-haberlesme-yol',
    title: "Basit köprü ve geçit yapmak",
    tag: "YOL",
    summary: "Islak zemine kütük döşeme, sığ ve yavaş dereye basamak taşı, dar ve sakin dereye iki kütüklü kısa bir yaya köprüsü yapın; uzun açıklığı uzmansız denemeyin.",
    note: "Uzman gözetimi olmadan birkaç metreden uzun açıklıkta, derin ya da hızlı akan suyun üstünde köprü kurmayın; çöken köprü boğulmaya yol açar.",
    steps: [
      "Önce geçidin yerini seçin: suyun en sakin, iki yakanın en sağlam ve en dar olduğu yer. Dere geçme kuralları için ana uygulamadaki dere geçme rehberine bakın.",
      "Selde suyun nereye kadar çıktığını bulun: kıyıdaki sürüklenmiş dal ve çöp izi. Köprüyü bu çizginin üstüne kurun.",
      "Bataklık ve ıslak zemin için kütük döşeme yapın: 1,8–3 m arayla enine kütükleri üçte ikisi gömülecek biçimde yerleştirin. Üstlerine en az 3 m uzunluğunda, yaklaşık 20 cm çaplı, kabuğu soyulmuş iki boyuna kütük koyun.",
      "Boyuna kütüklerin üstüne enine tahta ya da yarım kütük döşeyin. Aralarında 2 cm boşluk bırakın; su ve çamur akıp gitsin.",
      "Sığ ve yavaş derede basamak taşı dizin: büyük, düz üstlü, sallanmayan taşlar; aralık kısa bir adım. Her taşa basmadan önce sallayarak deneyin.",
      "Dar ve sakin bir dere için iki sağlam, çürüksüz kütüğü yan yana atın. Uçları iki yakada sağlam, kaymayan zemine iyice otursun; taşla ve kazıkla sabitleyin.",
      "Kütüklerin üstünü baltayla düzleştirin ki ayak kaymasın. Bir yanına bele yüksekliğinde gergin bir tutunma ipi bağlayın.",
      "Kullanmadan önce yük testi yapın: önce taş yükleyin, sonra beline ip bağlanmış tek bir kişi geçsin; ipin ucunu kıyıda iki kişi tutsun.",
      "Her ilkbahar ve her selden sonra kontrol edin: çürüyen kütük, oynayan uç, aşınan kıyı. Şüpheli köprüyü kapatın.",
      "Hayvan ve araba geçecek, uzun ya da yüksek köprüler mühendislik hesabı ister. Bunları basit yöntemle yapmayın."
    ],
    art: [null, null, 'sf-bt-kopru-kutuk-doseme', null, null, null, 'sf-bt-kopru-ip-korkuluk', 'sf-bt-kopru-yuk-testi', null, null],
    dont: [
      "Tek ve yuvarlak, düzleştirilmemiş kütükten ıslakken geçmeyin.",
      "Hızlı akan, dizden derin suyun üstüne köprü kurmaya çalışmayın.",
      "Köprüden aynı anda birden fazla kişi geçirmeyin; test edilmemiş yük çökertir."
    ],
    keywords: ['köprü yapmak', 'kutuk kopru', 'basit köprü', 'dere geçidi', 'bataklık geçmek', 'basamak taşı', 'yaya köprüsü', 'kütük döşeme', 'ip korkuluk', 'dereyi nasıl geçerim kalıcı'],
    sources: [
      "USDA Forest Service — Trail Notebook: Puncheon, turnpikes, bridges (https://www.fs.usda.gov/t-d/pubs/htmlpubs/htm07232806/page10.htm)",
      "Akıl Çantası ana uygulama — Dere ve nehirden geçmek"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: kütük döşeme (puncheon) ölçüleri — eşik 1,8–3 m arayla 2/3 gömülü, boyuna kütük ≥3 m ve ~20 cm, döşeme arası 20 mm; uzun açıklıklar için mühendislik onayı şartı. Kütük köprü çapı ve açıklık sınırı için sayı bulunamadı (RAPOR)." },
  },

  // ───────────── TOPLULUK ─────────────
  {
    id: 'sf-topluluk-kurma',
    category: 'sf-bt-topluluk',
    title: "Küçük topluluk kurmak: görev ve sorumluluk",
    tag: "TOPLULUK",
    summary: "Topluluğu gönüllülük, eşitlik ve şiddetsizlik üzerine kurun; temel kuralları birlikte yazın, görevleri dönüşümlü dağıtın, yetkiyi kısa süreli ve geri alınabilir yapın.",
    note: "Bu rehber gönüllülük ve insan haklarına saygı esasına dayanır. Kimseyi zorla çalıştırmak, alıkoymak ya da şiddetle cezalandırmak suçtur ve topluluğu da içten çökertir.",
    steps: [
      "İlk toplantıya herkesi çağırın: kadınlar, yaşlılar, engelliler ve gençler dahil. Çocukların da ne düşündüğünü sorun.",
      "Temel ihtiyaçları birlikte sıralayın: su, yiyecek, barınak, sağlık, ısınma, güvenlik, hijyen. Her biri için bugün ne var, ne eksik, yazın.",
      "Kısa ve yazılı temel kurallar koyun: herkes eşit değerdedir; şiddet, tehdit ve aşağılama yoktur; kimse ceza olarak yiyecek ve sudan mahrum bırakılmaz; inanç, köken ve cinsiyete göre ayrım yapılmaz.",
      "Katılım gönüllüdür. Kurallara uymak istemeyen ayrılabilir; kişisel eşyasını alıp gider, kimse onu engellemez.",
      "Görev grupları kurun: su, yiyecek ve ambar, sağlık, barınak ve yapı, kayıt ve haberleşme, çocuk ve bakım. Her grubun bir sorumlusu olsun.",
      "Sorumluları belli bir süre için seçin (ör. 3 ay) ve görevleri dönüşümlü yapın. Yetki tek kişide birikmesin; toplantı istediği zaman sorumluyu değiştirebilsin.",
      "İşleri güce ve sağlığa göre dağıtın. Çalışamayan yaşlı, hasta ve engelli de eşit temel pay alır ve yapabildiği işe katılır.",
      "Her hafta aynı gün herkesin katıldığı bir toplantı yapın: ne yapıldı, ne sorun var, ne karar alınacak. Kararları günlük defterine yazın.",
      "Kurallar değişebilir; ama yalnız toplantıda, herkesin önünde ve yazılı olarak."
    ],
    art: ['sf-bt-topluluk-ilk-toplanti', null, 'sf-bt-topluluk-kurallar', null, 'sf-bt-topluluk-gorev-panosu', null, null, null, null],
    dont: [
      "Bir kişiyi ya da küçük bir grubu sınırsız yetkili yapmayın.",
      "Ceza olarak yiyecek, su ya da barınak kesmeyin; dayak, hapis ve kamuya açık aşağılama uygulamayın.",
      "Silahı ya da gücü olanın sözünün geçtiği bir düzen kurmayın; bu düzen er geç herkese zarar verir."
    ],
    keywords: ['topluluk kurma', 'köy düzeni kurmak', 'birlikte yaşamak', 'görev dağılımı', 'kim ne iş yapacak', 'kamp yönetimi', 'topluluk kuralları', 'yeni düzen kurmak', 'iş bölümü', 'gönüllü topluluk'],
    sources: [
      "IASC — Guidelines on Mental Health and Psychosocial Support in Emergency Settings: toplumsal desteğin önemi (https://interagencystandingcommittee.org/iasc-task-force-mental-health-and-psychosocial-support-emergency-settings/iasc-guidelines-mental-health-and-psychosocial-support-emergency-settings-2007)",
      "INEE — Minimum Standards: ayrımcılık olmadan ve şeffaf topluluk katılımı (https://inee.org/minimum-standards)",
      "Wikipedia — Consensus decision-making: rol dönüşümü ve güç dağılımı (https://en.wikipedia.org/wiki/Consensus_decision-making)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: toplumsal desteğin önceliği (IASC), ayrımcılıksız ve şeffaf katılım (INEE), kolaylaştırıcı rolünün dönüşümlü yapılması (Consensus). Görev süresi (3 ay) öneri niteliğinde." },
  },
  {
    id: 'sf-karar-alma',
    category: 'sf-bt-topluluk',
    title: "Karar alma ve anlaşmazlık çözümü",
    tag: "TOPLULUK",
    summary: "Kararları önce uzlaşmayla almaya çalışın, olmazsa önceden belirlenmiş bir oylamaya geçin; anlaşmazlıkları tarafsız iki arabulucuyla, sakin ve yazılı biçimde çözün.",
    steps: [
      "Karar yöntemini kriz çıkmadan belirleyin ve yazın: önce uzlaşma, belirli sürede olmazsa ör. üçte iki çoğunlukla oylama.",
      "Her toplantıya dönüşümlü bir kolaylaştırıcı seçin. Görevi yönetmek değil, sırayı ve süreyi korumaktır.",
      "Bir konuyu şöyle işleyin: konuşma, öneri, herkesin tutumu, itirazların dinlenmesi, önerinin düzeltilmesi.",
      "Tutumu sessizliğe bırakmayın. Herkes açıkça söylesin: 'katılıyorum', 'çekiniyorum ama engellemem' ya da 'itiraz ediyorum'.",
      "Engelleyen kişi bir seçenek de önersin. Gerekçesiz engelleme uzlaşma değil, vetodur.",
      "Acil konularda (yangın, sel, hastalık) önceden seçilmiş kişiler hızlı karar versin; karar sonraki toplantıda herkese açıklanıp gözden geçirilsin.",
      "İki kişi ya da aile arasında anlaşmazlıkta tarafsız iki arabulucu seçin. Taraflar ayrı ayrı, sözü kesilmeden anlatsın.",
      "Arabulucu sakin ses ve kısa cümlelerle konuşur, duyduğunu özetler, 'neden' yerine 'ne olursa çözülür' diye sorar.",
      "Varılan anlaşmayı yazın, taraflar imzalasın, bir hafta sonra nasıl gittiğini birlikte konuşun.",
      "Ağır konularda (şiddet, hırsızlık iddiası) önce zarar göreni koruyun ve tarafları ayırın. Sonra topluluk toplantısı karar versin; suçlanan kişi kendini anlatabilsin, karar yazılsın. Dayak, alıkoyma, yiyecek ve su kesme hiçbir zaman ceza olamaz; resmî makama ulaşılabildiğinde olay bildirilsin."
    ],
    art: [null, null, null, 'sf-bt-karar-kartlar', null, null, 'sf-bt-karar-arabulucu', null, 'sf-bt-karar-anlasma', null],
    dont: [
      "Sesi yüksek olanın kazandığı toplantıya izin vermeyin; kolaylaştırıcı sırayı korusun.",
      "Taraflardan birinin yakınını arabulucu yapmayın.",
      "Öfke anında karar almayın; toplantıyı ertesi güne erteleyin."
    ],
    keywords: ['karar alma', 'oylama', 'uzlaşma', 'anlaşmazlık çözme', 'kavga nasıl çözülür', 'arabulucu', 'toplantı nasıl yapılır', 'tartışma', 'oy birliği', 'konsensüs'],
    sources: [
      "Wikipedia — Consensus decision-making (https://en.wikipedia.org/wiki/Consensus_decision-making)",
      "Wikipedia — De-escalation (https://en.wikipedia.org/wiki/De-escalation)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesi; ağır konularda toplantı kararına mağduru koruma, savunma hakkı ve cezai şiddet yasağı eklendi. Yazarın notu: uzlaşma adımları, 'çekinme' ve engelleme kuralları, gerekçesiz engellemenin veto sayılması, süre sonunda yedek oylama, kolaylaştırıcı rolü; sakinleştirme teknikleri (kısa cümle, özetleme, 'neden' sorusundan kaçınma)." },
  },
  {
    id: 'sf-nobet-duzeni',
    category: 'sf-bt-topluluk',
    title: "Nöbet ve güvenlik düzeni",
    tag: "TOPLULUK",
    summary: "Nöbetin amacı erken uyarıdır: gözle, işaret ver, haber ver. Nöbetleri gönüllü, dönüşümlü ve iki kişilik tutun; nöbetçi kimseyi yakalamaz, sorgulamaz, cezalandırmaz.",
    note: "Nöbetçinin görevi gözlemek ve haber vermektir. Kimseyi alıkoymak, aramak, dövmek ya da tehdit etmek insan haklarına aykırıdır ve suçtur.",
    steps: [
      "Nöbetin amacını yazın: yangın, sel, yaban hayvanı, hastalanan biri ya da yaklaşan yabancılar için erken uyarı.",
      "Nöbeti iki kişi tutsun. Biri uyuklasa ya da bir yere gitse öbürü yerinde kalır.",
      "Nöbetleri kısa tutun ve dönüşümlü yazın. Gün içinde ağır iş yapan, hasta, hamile ve çocuklar gece nöbetinden muaf olsun.",
      "Nöbet yeri: yerleşimi ve yolları gören, rüzgâr ve yağmurdan korunan bir yer. Sıcak giysi, su, düdük ya da çan ve fener bulunsun.",
      "Alarm işaretlerini bilin (bkz. Duman ve ses işaretleri). Yangın ve selde hiç beklemeden alarm verin.",
      "Bir yabancı gelirse alarm vermeyin; sakin bir sesle selam verin ve karşılama ekibini çağırın (bkz. Yabancılarla karşılaşma).",
      "Gördüklerinizi nöbet defterine yazın: saat, ne görüldü, kime haber verildi.",
      "Nöbet değişiminde yeni nöbetçiye kısa bilgi verin: ne oldu, nelere dikkat etmeli.",
      "Nöbetçiler ayda bir toplanıp sorunları konuşsun. Nöbet listesi herkese açık olsun."
    ],
    art: [null, 'sf-bt-nobet-iki-kisi', null, 'sf-bt-nobet-yeri', null, 'sf-bt-nobet-selam', null, null, null],
    dont: [
      "Nöbetçi tek başına kimseyi takip etmesin, yakalamaya ya da karşı koymaya kalkmasın.",
      "İnsanlardan görünüşlerine, dillerine ya da kökenlerine göre şüphelenmeyin.",
      "Uykusuz ya da hasta birini nöbete koymayın."
    ],
    keywords: ['nöbet düzeni', 'gece nöbeti', 'nöbet listesi', 'güvenlik düzeni', 'gözcü', 'yangın nöbeti', 'nobet tutmak', 'kampta güvenlik', 'mahalle bekçisi'],
    sources: [
      "Wikipedia — Neighborhood watch: gözlemle ve bildir, müdahale etme; eleştiriler (https://en.wikipedia.org/wiki/Neighborhood_watch)",
      "Wikipedia — De-escalation (https://en.wikipedia.org/wiki/De-escalation)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: mahalle gözcülüğünde 'gözle ve bildir, müdahale etme' ilkesi; kendi başına müdahale ve görünüşe dayalı şüphenin yol açtığı şiddet örnekleri. Nöbet süresi için sayı verilmedi." },
  },
  {
    id: 'sf-takas',
    category: 'sf-bt-topluluk',
    title: "Takas ve değer ölçüsü",
    tag: "TOPLULUK",
    summary: "Temel ihtiyaçları takasın dışında tutun; geri kalan mal ve hizmeti emek saati gibi basit bir birimle, herkese açık ortak bir defterde kaydedin ve borç sınırı koyun.",
    steps: [
      "Su, temel yiyecek, ilaç ve barınak takasa konu olmaz; ihtiyaca göre ortak ambardan herkese verilir.",
      "Takas için ortak bir değer birimi seçin. En basiti emek saatidir: 1 saatlik iş = 1 birim.",
      "Mal için birim karşılığını toplantıda belirleyin: ör. bir çift yün çorap 3 birim. Listeyi panoya asın, mevsim değişince güncelleyin.",
      "Ortak bir takas defteri tutun: tarih, veren, alan, ne, kaç birim. Her işlemi iki taraf da imzalasın.",
      "Herkesin bakiyesi herkese açık olsun. Kimin ne kadar verdiği, ne kadar aldığı görülsün.",
      "Borç ve alacak sınırı koyun: ör. ±20 birim. Sınıra varan kişi önce dengelemeye çalışsın: borçlu iş yapsın, alacaklı hizmet alsın.",
      "Başka topluluklarla takasta tarafsız bir yerde buluşun, önceden haber verin, terazi ve ölçüleri birlikte kullanın.",
      "Zor durumdakinden fahiş karşılık istemeyin. İhtiyaç sahibine fazla değer biçmek topluluğa güveni bitirir.",
      "Bozulacak ürünü önce takasa çıkarın; saklanabileni ambarda tutun."
    ],
    art: [null, 'sf-bt-takas-emek-saati', 'sf-bt-takas-pano', 'sf-bt-takas-defter', null, null, null, null, null],
    dont: [
      "Açlığı ya da hastalığı fırsat bilip insanlardan borç ve emek koparmayın.",
      "Takas defterini tek kişiye bırakmayın; işlemleri iki taraf imzalasın."
    ],
    keywords: ['takas', 'değiş tokuş', 'para yokken alışveriş', 'emek saati', 'zaman bankası', 'değer ölçüsü', 'takas defteri', 'mal değişimi', 'imece', 'takas pazari'],
    sources: [
      "Wikipedia — Local exchange trading system (https://en.wikipedia.org/wiki/Local_exchange_trading_system)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: ortak kredi düzeni, merkezi kayıt, herkese açık bakiye, artı-eksi sınırlar ve dengeleme, zaman birimi kullanımı (LETS). ±20 birim sınırı örnek değerdir." },
  },
  {
    id: 'sf-ortak-ambar',
    category: 'sf-bt-topluluk',
    title: "Ortak ambar ve kayıt",
    tag: "TOPLULUK",
    summary: "Ambarı kuru, serin ve kemirgen geçirmez kurun; her girişi ve çıkışı deftere yazın, ilk gireni ilk kullanın, sayımı iki kişi yapsın ve kaç gün yeteceğini hesaplayın.",
    steps: [
      "Yer seçin: kuru, serin, gölge ve havadar. Rafları yerden ve duvardan en az bir karış uzak kurun.",
      "Yiyeceği kapaklı kaplarda saklayın: metal kutu, kapaklı küp, sıkıca bağlanmış çuval. Fare ve böcek girmesin.",
      "Her girişi tartıp sayın ve deftere yazın: tarih, ne, miktar, kimden. Kaba da tarihli bir etiket koyun.",
      "İlk gireni ilk kullanın. Yeni gelen ürünü arkaya, eskiyi öne koyun.",
      "Ambarın anahtarı tek kişide olmasın. Çıkışları iki kişi birlikte yapsın ve deftere yazsın.",
      "Haftada bir sayım yapın; sayımı her seferinde farklı iki kişi yapsın, sonucu panoya assın.",
      "Kaç gün yeteceğini hesaplayın: stok miktarı ÷ günlük tüketim. Sonucu panoya yazın; azalıyorsa erkenden önlem alın.",
      "Paylaştırma: herkese eşit temel pay. Hamile, emziren, hasta ve ağır işte çalışanların ek payına toplantıda karar verin.",
      "Bozulan ürünü hemen ayırın, sebebini bulun (nem, böcek), deftere yazın.",
      "Tohumluğu ayrı ve dokunulmaz tutun. Kıtlıkta bile tohumu yemek gelecek yılın hasadını yok eder."
    ],
    art: ['sf-bt-ambar-raflar', null, 'sf-bt-ambar-giris', 'sf-bt-ambar-ilk-giren', null, null, null, null, null, null],
    dont: [
      "Yiyeceği doğrudan toprak zemine koymayın; nem ve fare her şeyi bozar.",
      "Tohumluğu yemeyin.",
      "Ambarı gizli ve kayıtsız yönetmeyin; şüphe topluluğu böler."
    ],
    keywords: ['ortak ambar', 'erzak deposu', 'stok yönetimi', 'yiyecek deposu', 'kaç gün yeter', 'ambar kaydı', 'erzak dağıtımı', 'ilk giren ilk çıkar', 'tohumluk saklama', 'ambar defteri'],
    sources: [
      "Wikipedia — FIFO and LIFO accounting: ilk giren ilk çıkar (https://en.wikipedia.org/wiki/FIFO_and_LIFO_accounting)",
      "Wikipedia — Local exchange trading system: açık ortak kayıt (https://en.wikipedia.org/wiki/Local_exchange_trading_system)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: FIFO ilkesi, açık kayıt. Depo yeri ve kemirgen koruması için ayrı bir gıda deposu kaynağı (WFP/FAO) açılamadı (RAPOR)." },
  },
  {
    id: 'sf-ortak-mutfak',
    category: 'sf-bt-topluluk',
    title: "Ortak mutfak düzeni (uzun dönem)",
    tag: "TOPLULUK",
    summary: "Ortak mutfağı dönüşümlü ekiplerle, haftalık menü ve ambar hesabıyla yürütün; yemek saatlerini sabit tutun, payları eşit dağıtın, hijyen kurallarını hiç gevşetmeyin.",
    steps: [
      "Hijyen kuralları için ana uygulamadaki 'Toplu yemek ve aşevi hijyeni' rehberini uygulayın. İshali, kusması, ateşi ya da elinde açık yarası olan kişi mutfağa girmez.",
      "Mutfak ekiplerini dönüşümlü yapın. Herkes sırası gelince çalışsın; iş cinsiyete göre değil sıraya göre dağılsın.",
      "Haftalık menüyü ambar sayımıyla birlikte yapın. Önce bozulacak ürünleri kullanın.",
      "Yakıtı az kullanın: tek büyük kazan, kapaklı pişirme, bakliyatı önceden ıslatma. Ateşi ve kazanı yaşam alanından uzak kurun.",
      "Yemek saatlerini sabit tutun. Düzenli öğün, zor zamanlarda insanlara güven verir.",
      "Payları eşit kepçeyle dağıtın. Çocuklar, hamileler ve emzirenler için toplantıda belirlenen ek payı ayrı kaydedin.",
      "Önce yatağa bağlı, yaşlı ve engelli kişilere yemek götürün; sonra sıraya geçin.",
      "Bulaşıkları üç kapla yıkayın: sabunlu suyla yıkama, temiz suyla durulama, kaynar suya daldırma. Sonra bezle kurulamadan, temiz bir rafta havada kurutun.",
      "Soğutamadığınız artık yemeği saklamayın. Pişmiş yemeği oda sıcaklığında 2 saatten fazla bekletmeyin."
    ],
    art: [null, null, null, 'sf-bt-mutfak-kazan', null, 'sf-bt-mutfak-kepce', null, 'sf-bt-mutfak-uc-kap', null],
    dont: [
      "Yemeği bekleyenlerden önce mutfak ekibinin ya da yöneticilerin almasına izin vermeyin.",
      "Yaşam çadırının ya da barınağın içinde ateşle pişirmeyin.",
      "Bekletilmiş artık yemeği ertesi gün yeniden dağıtmayın."
    ],
    keywords: ['ortak mutfak', 'imece mutfağı', 'toplu yemek düzeni', 'yemek sırası', 'mutfak nöbeti', 'menü planı', 'yakıt tasarrufu yemek', 'pay dağıtımı', 'kazan yemeği uzun dönem'],
    sources: [
      "WHO — Five Keys to Safer Food Manual (https://www.who.int/publications/i/item/9789241594639)",
      "Akıl Çantası ana uygulama — Toplu yemek ve aşevi hijyeni"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: 'güneşte kurutma' dezenfeksiyon yerine geçmediği için seçenek olarak kaldırıldı; kaynar suya daldırma ve havada kurutma bırakıldı. Kaynaklar yeniden açılmadı; 2 saat kuralı ve WHO beş anahtar yazarın kaynağına dayanıyor." },
  },
  {
    id: 'sf-cocuk-egitim-duzeni',
    category: 'sf-bt-topluluk',
    title: "Çocuk bakımı ve eğitim düzeni",
    tag: "TOPLULUK",
    summary: "Çocuklar için güvenli bir alan, sabit bir günlük düzen ve gönüllü dönüşümlü bakıcılar kurun; bir yetişkin bir çocukla gözden uzak yalnız kalmasın, dayak ve aşağılama olmasın.",
    steps: [
      "Güvenli bir çocuk alanı seçin: sudan, ateşten, aletlerden ve yoldan uzak, dışarıdan görülebilen bir yer.",
      "Bakımı gönüllü yetişkinler dönüşümlü yapsın. Alanda her zaman en az iki yetişkin bulunsun.",
      "Hiçbir yetişkin bir çocukla gözden uzak bir yerde yalnız kalmasın. Bu kural çocuğu da yetişkini de korur.",
      "Çocukların bir şikâyetini güvenle anlatabileceği iki yetişkin seçin ve çocuklara tanıtın. Anlatılanı ciddiye alın.",
      "Sabit bir günlük düzen kurun: ders, oyun, yaşa uygun hafif iş, dinlenme. Düzen, korkmuş çocuklara güven verir.",
      "Dersleri yaşa göre gruplayın: okuma-yazma, sayılar, doğa ve güvenlik bilgisi, el becerileri. Okuyan büyük çocuklar küçüklere yardım etsin.",
      "Çocukların işi yaşına uygun ve hafif olsun; oyunun ve dersin yerini almasın. Ağır, tehlikeli ve gece işi yok.",
      "Kayıp çocuk planı yapın: her çocuk adını ve toplanma noktasını bilsin; küçüklerin üzerinde ad kartı olsun.",
      "Ailesini kaybetmiş çocuğu kayda alın, akrabalarını arayın, bu sürede gönüllü bir aile yanına alsın. Kardeşleri ayırmayın.",
      "Dayak, korkutma ve aşağılama yok. Kuralları çocuklarla birlikte koyun, sonuçları sakin ve tutarlı uygulayın."
    ],
    art: ['sf-bt-cocuk-alan', 'sf-bt-cocuk-iki-yetiskin', null, null, null, null, null, 'sf-bt-cocuk-ad-karti', null, null],
    dont: [
      "Çocukları ateş, su kuyusu, alet ve hayvanların yanında gözetimsiz bırakmayın.",
      "Çocuğu ağır işte ya da gece nöbetinde çalıştırmayın.",
      "Çocuğun anlattığı bir kötü muamele iddiasını geçiştirmeyin."
    ],
    keywords: ['çocuk bakımı', 'çocuk eğitimi', 'çocuklar için okul', 'çocuk alanı', 'kayıp çocuk planı', 'refakatsiz çocuk', 'yetim çocuk', 'çocukları koruma', 'çocuk güvenliği', 'cocuk egitimi'],
    sources: [
      "INEE — Minimum Standards for Education in Emergencies (https://inee.org/minimum-standards)",
      "Akıl Çantası ana uygulama — Kayıp çocuk ve çocuklarda stres rehberleri"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: güvenli öğrenme alanı, psikososyal iyilik, yaşa ve bağlama uygun içerik (INEE). 'İki yetişkin' ve 'yalnız kalmama' kuralları çocuk koruma uygulaması; CPHA çocuk dostu alan kılavuzu açılamadı (RAPOR)." },
  },
  {
    id: 'sf-yasli-engelli-bakim',
    category: 'sf-bt-topluluk',
    title: "Yaşlı ve engelli bakımı (uzun dönem)",
    tag: "TOPLULUK",
    summary: "Kişiye ne istediğini sorun, her bakıma muhtaç kişiye bir sorumlu ve bir yedek atayın, yatağa bağlı olanın pozisyonunu sık değiştirip cildini her gün kontrol edin.",
    note: "Uzman sağlık personeli olmadan ağır hastalık, yutma güçlüğü ve derin yaralarda bakım sınırlıdır; bu rehber ilaç ya da tedavi önermez.",
    steps: [
      "Kişiye sorun: ne istiyor, ne yapabiliyor, nasıl yardım istiyor. Kararları kendisi versin; konuşamıyorsa yakınlarıyla birlikte karar verin.",
      "Her bakıma muhtaç kişiye bir sorumlu ve bir yedek atayın. Bakıcılar da dinlensin; tek kişiye bütün yükü vermeyin.",
      "Yatağa bağlı kişinin pozisyonunu gece dahil yaklaşık 2 saatte bir değiştirin; hiçbir zaman 4 saati geçirmeyin. Kalça, sırt, topuk ve dirsekleri yastık ya da katlanmış battaniyeyle destekleyin.",
      "Cildi her gün kontrol edin: bastırınca rengi açılmayan leke, ılık, sert ya da süngerimsi bölge bası yarasının ilk belirtisidir. Görünce o bölgeye basıncı hemen kaldırın.",
      "Yumuşak, kuru bir yatak yapın: yün ya da saman şilte, üstünde temiz örtü. Islanan çarşafı hemen değiştirin.",
      "Yeterli su ve yemek verin. Yutmakta zorlanan kişiyi dik oturtun, yumuşak yemeği küçük lokmalarla verin.",
      "Hareket ettirin: yürüyebilene destek olun, baston yapın, yolları ve tuvalete giden yolu taş ve kökten temizleyin; düşme en büyük tehlikedir.",
      "Tuvalet ve yıkanmada mahremiyeti koruyun. Kapı ya da perde kullanın, kişiyi teşhir etmeyin.",
      "Kişiyi topluluk hayatına katın: bildiklerini anlattırın, çocuklara öğretsin, toplantılara taşıyın.",
      "Düzenli ilacı olan kişi doktorunun önerdiği şekilde kullanmaya devam etsin. Kalan ilaç miktarını kayda geçirin."
    ],
    art: [null, null, 'sf-bt-bakim-pozisyon', null, null, 'sf-bt-bakim-dik-oturma', 'sf-bt-bakim-baston', null, null, null],
    dont: [
      "Yatağa bağlı kişiyi saatlerce aynı pozisyonda bırakmayın.",
      "Kişinin yerine onun hakkında, onun önünde onu yok sayarak konuşmayın.",
      "Başkasının ilacını vermeyin, ilacı bölüp paylaştırmayın."
    ],
    keywords: ['yaşlı bakımı', 'engelli bakımı', 'yatalak hasta bakımı', 'bası yarası', 'yatak yarası', 'yasli bakimi', 'hasta bakıcı', 'yatağa bağlı', 'düşmeyi önleme', 'uzun dönem bakım'],
    sources: [
      "NHS — Pressure ulcers (pressure sores) (https://www.nhs.uk/conditions/pressure-sores/)",
      "NICE QS89 — Quality statement 6: risk altındaki yetişkin en az 6 saatte, yüksek riskli 4 saatte bir (https://www.nice.org.uk/guidance/QS89/chapter/quality-statement-6-help-with-repositioning)",
      "I Advance Senior Care — TURN çalışması: 2 saat geleneksel standart; 3–4 saat yalnız yüksek yoğunluklu sünger yatakta denendi (https://www.iadvanceseniorcare.com/two-hour-turns-may-no-longer-be-the-standard-study-finds)",
      "Akıl Çantası ana uygulama — Yaşlılar, engelliler ve kronik hastalar rehberleri"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: erken belirtiler ve günlük cilt kontrolü (NHS). NICE QS89 yüksek riskte 4 saat, riskte 6 saat der; ama bu aralıklar basınç dağıtan yatakla birlikte geçerlidir. Saman ya da yün şiltede tutucu olan geleneksel 2 saat aralığı seçildi, 4 saat üst sınır yazıldı." },
  },
  {
    id: 'sf-beceri-envanteri',
    category: 'sf-bt-topluluk',
    title: "Beceri envanteri: kim ne biliyor",
    tag: "TOPLULUK",
    summary: "Herkesle gönüllü kısa bir görüşme yapıp bildiği ve öğrenmek istediği işleri yazın; kimsenin bilmediği kritik becerileri bulun ve her önemli beceriyi en az iki kişiye öğretin.",
    steps: [
      "Herkese tek tek, gönüllülük esasıyla sorun: ne iş yaptınız, neyi iyi bilirsiniz, neyi öğrenmek istersiniz. 'Bilmiyorum' demek ayıp değildir.",
      "Bir beceri listesi kullanın: sağlık ve ilk yardım, tarım, hayvancılık, yapı, ahşap, metal, dikiş ve örgü, yemek, çocuk bakımı, öğretmenlik, telsiz, hesap, müzik ve hikâye.",
      "Düzeyi yazın: biliyor, yapabilir, öğretebilir.",
      "Kartlara ya da deftere yazın. Sağlık durumunu bu listeye değil, ayrı ve gizli sağlık sayfasına yazın.",
      "Boşlukları bulun: hayati ama kimsenin bilmediği ya da yalnız bir kişinin bildiği beceriler.",
      "Her kritik beceri için usta-çırak eşleştirin. Hedef: her önemli beceriyi en az iki kişi bilsin.",
      "Eldeki kitapları, notları ve bu uygulamadaki rehberleri de listeye ekleyin: hangi bilgi nerede yazılı.",
      "Listeyi her yeni gelen kişide ve en az yılda bir güncelleyin."
    ],
    art: ['sf-bt-beceri-gorusme', null, null, 'sf-bt-beceri-kart', null, 'sf-bt-beceri-usta-cirak', null, null],
    dont: [
      "İnsanları becerisine göre değerli-değersiz diye ayırmayın; listede olmayan herkes de öğrenebilir.",
      "Kimseyi becerisini kullanmaya zorlamayın; iş isteğe ve anlaşmaya dayalı olsun."
    ],
    keywords: ['beceri envanteri', 'kim ne biliyor', 'meslek listesi', 'yetenek listesi', 'usta çırak', 'kimin hangi becerisi var', 'doktor var mı aramızda', 'beceri listesi', 'is bolumu beceri'],
    sources: [
      "Wikipedia — Local exchange trading system: teklif ve ihtiyaç rehberi (https://en.wikipedia.org/wiki/Local_exchange_trading_system)",
      "INEE — Minimum Standards: topluluk katılımı (https://inee.org/minimum-standards)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Doğrudan bir beceri envanteri kaynağı bulunamadı; LETS teklif-ihtiyaç rehberi ve INEE katılım ilkesinden uyarlandı. Düzen önerisidir (RAPOR)." },
  },
  {
    id: 'sf-uzun-donem-ruh-sagligi',
    category: 'sf-bt-topluluk',
    title: "Uzun dönemde ruh sağlığı: rutin, anlam, yas",
    tag: "TOPLULUK",
    summary: "Günlük düzeni koruyun, herkese anlamlı bir iş verin, yalnız kalanları yoklayın, kayıpları birlikte anın; kendine ya da başkasına zarar düşüncesi olanı yalnız bırakmayın.",
    steps: [
      "Günlük düzen kurun: aynı saatte kalkma, yemek, iş, dinlenme ve uyku. Belirsizlikte düzen insanları ayakta tutar.",
      "Herkesin bir işi olsun, ne kadar küçük olursa olsun. İşe yaradığını hissetmek umutsuzluğu azaltır.",
      "Kimse yalnız kalmasın. Herkese bir 'yoldaş' eşleştirin; günde bir kez birbirini yoklasın.",
      "Ölenleri birlikte anın: adlarını bir deftere ya da taşa yazın, inanca ve geleneğe uygun tören yapın. Yasın ilk günleri için ana uygulamadaki 'Yas ve kayıp' rehberine bakın.",
      "Konuşmak isteyen için haftalık bir dinleme halkası kurun. Kimse konuşmaya zorlanmasın; dinleyen akıl vermesin.",
      "Kendine iyi bakma becerilerini öğretin: yavaş nefes, bedeni ve çevreyi fark etme, değer verdiğin bir şeye yönelme. Günde birkaç dakika yeterlidir.",
      "Uykuyu koruyun: gece sessizlik saatleri, karanlık bir uyku yeri, nöbetin adil dağılımı.",
      "Zorluğu alkol ya da başkasının ilacıyla bastırmak sorunu derinleştirir. Bunu yapanı yargılamadan konuşun, yakınında olun, işe ve topluluğa katın.",
      "Haftalarca geçmeyen içe kapanma, yemek ve uyku bozukluğu, günlük işi yapamama görürseniz yakın ilgi gösterin. Kendine zarar düşüncesi varsa ana uygulamadaki rehberi açın ve kişiyi yalnız bırakmayın."
    ],
    art: [null, null, 'sf-bt-ruh-yoldas', 'sf-bt-ruh-anma-tasi', 'sf-bt-ruh-dinleme-halkasi', null, null, null, null],
    dont: [
      "'Güçlü ol', 'herkesin derdi var' diyerek insanları susturmayın.",
      "Ruhsal sıkıntısı olanı alay ya da dışlama konusu yapmayın.",
      "Kendine zarar verme düşüncesini dile getiren kişiyi yalnız bırakmayın."
    ],
    keywords: ['uzun dönem ruh sağlığı', 'umutsuzluk', 'moral bozukluğu', 'içe kapanma', 'rutin kurmak', 'toplu yas', 'anma töreni', 'yalnızlık', 'motivasyon kalmadı', 'ruh sagligi'],
    sources: [
      "IASC — Guidelines on Mental Health and Psychosocial Support in Emergency Settings (https://interagencystandingcommittee.org/iasc-task-force-mental-health-and-psychosocial-support-emergency-settings/iasc-guidelines-mental-health-and-psychosocial-support-emergency-settings-2007)",
      "WHO — Doing What Matters in Times of Stress (https://www.who.int/publications/i/item/9789240003927)",
      "Akıl Çantası ana uygulama — Psikolojik ilk yardım, yas ve intihar düşüncesi rehberleri"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: alkol ve ilaç adımındaki 'izin vermeyin' denetleyici ifadesi destekleyici bir ifadeyle değiştirildi. Yazarın notu: toplumsal desteğin temel olduğu (IASC), günde birkaç dakikalık öz yardım becerileri (WHO). Kılavuzların tam metni okunamadı; adımlar sayfa özetleri ve ana uygulama rehberleriyle uyumlu (RAPOR)." },
  },
  {
    id: 'sf-yabancilarla-karsilasma',
    category: 'sf-bt-topluluk',
    title: "Yabancılarla karşılaşma ve çatışmadan kaçınma",
    tag: "TOPLULUK",
    summary: "Yaklaşan yabancıyı önce ihtiyaç içinde bir insan olarak karşılayın: sakin bir karşılama ekibi, su, kısa sorular ve seçenekler sunun; gerginlik artarsa geri çekilin.",
    steps: [
      "Önceden 2–3 kişilik, sakin ve dinlemeyi bilen bir karşılama ekibi seçin. Nöbetçi yabancı gördüğünde bu ekibi çağırsın.",
      "Yabancıyı yerleşimin girişinde, açık ve görünür bir yerde karşılayın. Elleriniz görünsün, ses tonunuz sakin olsun.",
      "Rahat bir konuşma mesafesinde durun; ne çok yakın ne çok uzak. Kısa cümlelerle, yavaş konuşun.",
      "Selam verin, su önerin. Sorun: 'Kimsiniz, nereden geliyorsunuz, neye ihtiyacınız var?' Dinleyin ve duyduğunuzu özetleyin.",
      "Hastalık belirtisi varsa (öksürük, ishal, ateş) nedenini açıklayıp ayrı ama insanca bir bekleme yeri önerin: gölge, su, yemek, tuvalet. Kişi bunu kabul etmeyip yoluna devam etmek isterse zorla tutmayın.",
      "Seçenek sunun: su ve yiyecekle yola devam, takas, birkaç gün konaklama ya da katılmak isteyenlere topluluk kurallarını anlatıp toplantıya götürmek.",
      "İlk karşılaşmada ambarın yerini, miktarını ve nöbet düzenini anlatmayın. Bu, temkinliliktir; düşmanlık değil.",
      "Gerginlik artarsa geri adım atın, sesinizi alçaltın, karşı tarafa gitmesi için yol bırakın. Kimse kahramanlık yapmasın; tehlike sürerse geri çekilip topluluğu uyarın.",
      "Karşılaşmayı deftere yazın ve toplantıda anlatın."
    ],
    art: [null, 'sf-bt-yabanci-eller-gorunur', null, 'sf-bt-yabanci-su-ikram', null, null, null, 'sf-bt-yabanci-geri-adim', null],
    dont: [
      "Yabancıyı tehdit etmeyin, alıkoymayın, zorla aramayın, eşyasına el koymayın.",
      "İnsanları kökenine, diline ya da görünüşüne göre ayırmayın.",
      "Çocuğu ya da tek kişiyi yabancı karşılamaya göndermeyin."
    ],
    keywords: ['yabancılarla karşılaşma', 'yabancı geldi', 'çatışmadan kaçınma', 'gerginliği azaltma', 'tanımadığım insanlar geldi', 'göçmen grup', 'yabanci karsilama', 'kavgayı önleme', 'sakinleştirme'],
    sources: [
      "Wikipedia — De-escalation (https://en.wikipedia.org/wiki/De-escalation)",
      "Wikipedia — Neighborhood watch: eleştiriler, görünüşe dayalı şüphe (https://en.wikipedia.org/wiki/Neighborhood_watch)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesi; hastalık belirtisi olan yabancının ayrı bekletilmesi rızaya bağlandı, zorla tutma kaldırıldı. Yazarın notu: sakin ses, kısa cümle, mesafe, aktif dinleme ve özetleme, seçenek sunma, 'neden' sorusundan kaçınma (De-escalation); görünüşe göre şüphenin zararları. Mesafe için sayı verilmedi." },
  },
  {
    id: 'sf-ritual-moral',
    category: 'sf-bt-topluluk',
    title: "Kutlama, ritüel ve moral",
    tag: "TOPLULUK",
    summary: "Bayramları, önemli günleri ve başarıları birlikte kutlayın, haftada bir dinlenme günü ve ortak bir akşam yapın; herkes kendi inancını özgürce yaşasın.",
    steps: [
      "Takvime bayramları ve önemli günleri yazın. Herkes kendi inancını ve geleneğini yaşasın; kimse bir törene zorlanmasın.",
      "Haftada bir dinlenme günü belirleyin. Yalnız zorunlu işler (su, hayvan, nöbet, hasta bakımı) yapılsın.",
      "Haftada bir ortak akşam yapın: birlikte yemek, müzik, türkü, masal, oyun.",
      "Mevsim şenlikleri yapın: ekim başlangıcı, Hıdırellez, hasat sonu. Mevsimin döndüğünü birlikte hissetmek zamana anlam verir.",
      "Doğum, evlilik ve ölümleri birlikte karşılayın. Yeni doğanı kutlayın, ölenleri anın, adlarını kayda geçirin.",
      "Başarıları kutlayın: kuyu bitti, köprü kuruldu, ilk hasat alındı. Emeği olanların adını söyleyin.",
      "Çocuklar için oyun saatleri, masal ve el yapımı oyuncaklar olsun.",
      "Topluluğun hikâyesini yazın: nereden gelindi, neler yaşandı, kimler katkı verdi. Ortak akşamlarda okuyun."
    ],
    art: [null, null, 'sf-bt-ritual-ortak-aksam', null, null, 'sf-bt-ritual-kuyu-kutlama', null, 'sf-bt-ritual-hikaye'],
    dont: [
      "Bir inancı ya da töreni herkese zorunlu kılmayın.",
      "Kutlamada ambarın kışlık stoğunu tüketmeyin; şenlik payını önceden ayırın."
    ],
    keywords: ['kutlama', 'ritüel', 'moral yükseltme', 'bayram kutlamak', 'şenlik', 'hasat bayramı', 'dinlenme günü', 'topluluk akşamı', 'moral', 'eğlence'],
    sources: [
      "IASC — Guidelines on Mental Health and Psychosocial Support in Emergency Settings (https://interagencystandingcommittee.org/iasc-task-force-mental-health-and-psychosocial-support-emergency-settings/iasc-guidelines-mental-health-and-psychosocial-support-emergency-settings-2007)",
      "Wikipedia — Hıdırellez (https://en.wikipedia.org/wiki/H%C4%B1d%C4%B1rellez)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: insan hakları incelemesinde zorlama, şiddet ya da hak ihlali içeren öneri bulunmadı; sayı yok ya da öneri niteliğinde; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: toplumsal desteğin önemi (IASC), Hıdırellez'in bahar şenliği olması. Ritüel ve moral düzeni önerisidir; IASC tam metni okunamadı (RAPOR)." },
  },

  // ───────────── DOĞAYLA UZUN YAŞAM ─────────────
  {
    id: 'sf-uzun-sureli-kamp',
    category: 'sf-bt-doga-uzun',
    title: "Uzun süreli kamp düzeni",
    tag: "DOĞA",
    summary: "Kalıcı kampı dere yatağından ve yamaç dibinden uzak, düz bir yere kurun; yaşam, mutfak, tuvalet ve çöp alanlarını ayırın, tuvaleti su kaynaklarından en az 30 m uzakta yapın.",
    steps: [
      "Yer seçin: dere yatağı, kuru dere, yamaç dibi, dik yamaç kenarı ve eski heyelan alanı olmayan, hafif eğimli ve suyunu atan bir düzlük.",
      "Su kaynağına yakın olun ama dibine kurmayın. Kaynağın çevresini hayvan ve insan kirinden koruyun.",
      "Alanları ayırın: yaşam ve uyku, mutfak ve yiyecek deposu, tuvalet, çöp, hayvanlar. Bunları önce yere kazıkla işaretleyin.",
      "Tuvaleti su kaynaklarından, kuyudan ve dereden en az 30 m uzağa yapın. Çukurun dibi yeraltı suyundan en az 1,5 m yukarıda kalsın; kazarken su çıkarsa başka yer seçin.",
      "Tuvalet çıkışına su ve sabunlu bir el yıkama noktası kurun.",
      "İçme suyunu derenin yukarısından, yıkama ve bulaşığı aşağısından alın. Bulaşık suyunu dereye değil, uzaktaki bir sızdırma çukuruna dökün.",
      "Ayı ve yaban domuzu olan bölgelerde mutfak ve yiyecek deposu uyku alanından yaklaşık 100 m uzakta olsun.",
      "Ateş yerini barınaklardan uzak, rüzgâr altında ve çevresi temizlenmiş yapın; yanında su ve kum kovası dursun.",
      "Barınakları kalıcılaştırın: zeminden yükseltilmiş yatak, barınak çevresinde yağmur hendeği, rüzgâra karşı duvar ya da çit.",
      "Haftada bir kamp turu yapın: dolan tuvalet çukurunu kapatın, çöpü uzaklaştırın, bozulanı onarın."
    ],
    art: ['sf-bt-kamp-yer-secimi', null, null, 'sf-bt-kamp-tuvalet-mesafe', null, 'sf-bt-kamp-su-yukari-asagi', null, null, null, null],
    dont: [
      "Kuru dere yatağına ya da dere kenarına kamp kurmayın; sel bir gecede gelir.",
      "Tuvaleti su kaynağının yukarısına ya da yakınına yapmayın.",
      "Yiyeceği ve çöpü uyuduğunuz yerde tutmayın."
    ],
    keywords: ['uzun süreli kamp', 'kalıcı kamp', 'kamp düzeni', 'kamp yeri seçimi', 'tuvalet çukuru mesafesi', 'kamp tuvaleti', 'kamp hijyeni uzun', 'çadır yerleşimi', 'kamp plani'],
    sources: [
      "MSF Medical Guidelines — Appendix 14, Excreta pit (https://medicalguidelines.msf.org/en/node/925)",
      "SSWM — Trench latrine (https://www.sswm.info/content/trench-latrine)",
      "USGS — Landslide preparedness (https://www.usgs.gov/programs/landslide-hazards/landslide-preparedness)",
      "WildSafeBC — Camping in bear country (https://wildsafebc.com/wp-content/uploads/2018/03/Camping-03-01-2018-min.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: çukur su kaynaklarından en az 30 m, dibi yeraltı suyundan 1,5 m yukarıda (MSF; SSWM 15–30 m, tutucu olan seçildi); kaçınılacak yerler (USGS); 100 m mutfak-uyku ayrımı (WildSafeBC)." },
  },
  {
    id: 'sf-yabani-hayvanlarla-yasam',
    category: 'sf-bt-doga-uzun',
    title: "Yabani hayvanlarla bir arada yaşamak: ayı, kurt, domuz, yılan",
    tag: "DOĞA",
    summary: "Yiyeceği, çöpü ve hayvan yemini yaban hayvanına ulaşılmaz tutun, hayvanlarınızı gece kapalı ağıla alın, yılanların saklanacağı yığınları yaşam alanından uzaklaştırın.",
    note: "Türkiye'de 4915 sayılı Kara Avcılığı Kanunu'na göre avlanmak avcılık belgesi ve izne bağlıdır, koruma altındaki türler (boz ayı gibi) hiç avlanamaz, yuva dağıtmak ve yavru toplamak yasaktır. Bu rehber hayvanları öldürmeyi değil, uzak tutmayı ve korunmayı anlatır.",
    steps: [
      "Yiyeceği ve çöpü kapalı, sağlam kaplarda tutun. Ayı bölgesinde mutfak, depo ve uyku yeri birbirinden yaklaşık 100 m uzakta olsun.",
      "Depo yoksa yiyecek torbasını ağaçlar arasına gerilmiş bir ipe asın: yerden en az 4 m yüksekte, en yakın ağaç gövdesinden en az 3 m uzakta.",
      "Ayıyı çeken şeyleri yerleşim çevresinde bırakmayın: meyve artığı, bal ve kovan, hayvan leşi, yağlı bulaşık suyu. Kovanları yerleşimden uzakta, çitle koruyun.",
      "Koyun, keçi ve tavukları gece kapalı ve sağlam bir ağıla alın. Çoban köpeği sürüyü kurttan korur; köpeği iyi besleyin.",
      "Yaban domuzu tarlaya zarar verir. Tarlayı çitle çevirin, ekim ve hasat döneminde gece gözcü ve ses kullanın. Yavrulu dişiye yaklaşmayın.",
      "Yılanlar taş, odun ve çalı yığınlarında saklanır. Bu yığınları yaşam alanından uzakta tutun; çevreyi otsuz ve açık bırakın.",
      "Görmediğiniz yere elinizi ve ayağınızı sokmayın. Odun ve taş kaldırırken eldiven giyin, geceleri fenerle yürüyün.",
      "Yaban hayvanını beslemeyin, yavrusunu almayın. İnsandan korkmayan hayvan tehlikeli olur.",
      "Hasta görünen, korkusuzca yaklaşan ya da tuhaf davranan hayvandan uzak durun; kuduz olabilir. Isırık ve karşılaşma için ana uygulamadaki vahşi hayvan rehberine bakın."
    ],
    art: [null, 'sf-bt-yaban-yiyecek-asma', null, 'sf-bt-yaban-agil-kopek', null, null, 'sf-bt-yaban-eldiven', null, null],
    dont: [
      "Yiyecek, sabun ve kokulu eşyayı çadırda ya da barınakta tutmayın.",
      "Yaban hayvanını beslemeyin, yavrusuna dokunmayın.",
      "Yılana sopa ile saldırmayın, yakalamaya çalışmayın; ısırıkların çoğu böyle olur."
    ],
    keywords: ['yabani hayvan', 'ayı kampa geliyor', 'kurt sürüye saldırıyor', 'yaban domuzu tarla', 'yılan evde', 'yiyecek asma', 'hayvanları uzak tutma', 'ayıdan korunma kamp', 'yilan nerede saklanir', 'kovan ayı'],
    sources: [
      "WildSafeBC — Camping in bear country (https://wildsafebc.com/wp-content/uploads/2018/03/Camping-03-01-2018-min.pdf)",
      "Wyoming Game and Fish — Bear-wise camping (https://wgfd.wyo.gov/media/19927/download)",
      "4915 sayılı Kara Avcılığı Kanunu, Tarım ve Orman Bakanlığı DKMP metni: md. 4 ve 6 (https://www.tarimorman.gov.tr/DKMP/Belgeler/MEVZUAT/4915%20Kara%20Avcılığı%20Kanunu/1)Kara%20Avcılığı%20Kanunu.pdf)",
      "Av. Kazım Ceylan — Ayı vurmanın cezası: boz ayı MAK koruma listesinde (https://www.kazimceylan.av.tr/ayi-vurmanin-ve-oldurmenin-cezasi)",
      "Akıl Çantası ana uygulama — Ayı, yaban domuzu ve köpek sürüsüyle karşılaşma"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yasal not 4915 sayılı Kanun md. 4 (koruma altındaki türler avlanamaz, yuva dağıtılamaz, yavru toplanamaz) ve md. 6 (avcılık belgesi ve izin) metninden düzeltildi; boz ayının koruma statüsü ikincil hukuk kaynağından. Yazarın notu: 100 m üçgen düzeni, asma yüksekliği ≥4 m ve gövdeden ≥3 m (WildSafeBC); Wyoming 100 yard, 10–15 ft, gövdeden 4 ft — tutucu olan seçildi. Kurt, domuz ve yılan adımları genel koruma uygulaması; Türkiye kaynaklı belge açılamadı (RAPOR)." },
  },
  {
    id: 'sf-kis-hazirligi',
    category: 'sf-bt-doga-uzun',
    title: "Kış hazırlığı: yakacak, yiyecek, yalıtım",
    tag: "DOĞA",
    summary: "Kışlık odunu en az 6 ay önceden kesip yerden yüksek, yalnız üstü örtülü istifleyin; kış boyu yiyeceği ve yakacağı haftalık tüketimden hesaplayın, tek bir odayı yalıtıp ısıtın.",
    steps: [
      "Yakacak hesabını yapın: geçen kışın kaydı varsa onu kullanın. Yoksa soğuk bir haftada yaktığınız odunu tartın ya da sayın, kışın hafta sayısıyla çarpın, üstüne yedek ekleyin.",
      "Odunu kışa en az 6 ay kala kesin ve yarın. Yaş odun ağırdır, zor yanar, çok duman ve kurum yapar.",
      "İstif: yerden yükseltilmiş taş ya da kütük üstüne, gevşek ve en çok iki sıra derinlikte. Yalnız üstünü örtün, yanları açık kalsın ki hava geçsin.",
      "Ana istifi barınaktan en az 10 m uzakta tutun; barınağın yanında yalnız birkaç günlük odun bulunsun.",
      "Kuru odunu tanıyın: rengi koyulaşmıştır, hafiftir, uçlarında çatlaklar vardır, iki odun birbirine vurunca tok ve net ses çıkar.",
      "Yiyecek hesabı: kişi sayısı × gün × günlük pay. Ambardaki kışlık stoğu bu hesapla karşılaştırın, eksik varsa hasatta tamamlayın.",
      "Yalıtın: tek bir odayı ya da bölmeyi ısıtın. Kapı ve pencere aralıklarını keçe ve bezle kapatın, zemine saman ya da halı serin, kalın perde asın.",
      "Suyu donmaya karşı koruyun: boruları boşaltın, su kaplarını içeri alın. Kar eritmek çok yakıt yer; su kaynağına kış yolu açın.",
      "Herkese yün çorap, şapka ve katmanlı giysi sağlayın. Hayvanlar için kuru ot ve saman ayırın.",
      "Soba ve mangalda karbonmonoksit tehlikesi için ana uygulamadaki güvenli ısınma rehberine uyun."
    ],
    art: [null, null, 'sf-bt-kis-istif', null, 'sf-bt-kis-kuru-odun', null, 'sf-bt-kis-yalitim', null, null, null],
    dont: [
      "Yaş odun yakmayın; baca kurumla tıkanır, baca yangını çıkar.",
      "Odun istifini tamamen naylonla sarmayın; nem içeride kalır, odun çürür.",
      "Kapalı odada mangal ya da açık ateş yakmayın."
    ],
    keywords: ['kış hazırlığı', 'kışlık odun', 'odun ne kadar gerekir', 'odun kurutma', 'odun istifi', 'kışa hazırlık', 'yakacak hesabı', 'ev yalıtımı kış', 'kis hazirligi', 'yaş odun'],
    sources: [
      "EPA Burn Wise — Best wood-burning practices (https://www.epa.gov/burnwise/best-wood-burning-practices)",
      "Cornell Cooperative Extension — Storing and drying firewood (https://franklin.cce.cornell.edu/energy-and-environment/storing-and-drying-firewood)",
      "FireSmart Canada — Yard fact sheet: odun yığını 10 m (https://firesmartcanada.ca/wp-content/uploads/2022/01/FSA_FireSmart-Fact-Sheet_Yard.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: en az 6 ay kurutma, nem <%20, yerden yüksek ve yalnız üstü örtülü istif, en çok iki sıra derinlik, kuru odun belirtileri (EPA, Cornell); odun yığını evden en az 10 m (FireSmart; Cornell ~9 m)." },
  },
  {
    id: 'sf-yaz-hazirligi',
    category: 'sf-bt-doga-uzun',
    title: "Yaz hazırlığı: sıcak, su, gölge",
    tag: "DOĞA",
    summary: "Yaz gelmeden su depolayın ve gölgelikler kurun, ağır işleri sabah ve akşam serinine alın, sıcakta çalışırken her 15–20 dakikada bir bardak su için.",
    steps: [
      "Yaz gelmeden su depolayın. Kaynaklar yazın azalır ya da kurur; kapaklı kapları gölgede tutun.",
      "Çalışma ve yaşam alanlarına gölgelik kurun: dal örtülü çardak, açık renkli bez. Gölge, sıcakta en ucuz korumadır.",
      "Ağır işleri sabah erken ve akşam serinine alın. Öğle sıcağında dinlenin, gölgede hafif işler yapın.",
      "Sıcakta çalışırken susamayı beklemeden her 15–20 dakikada bir bardak (yaklaşık 250 ml) su için. Saatte yaklaşık 1,4 litreden fazla içmeyin; çok fazla su da tehlikelidir.",
      "Terle kaybedilen tuzu yemekle karşılayın; uzun ve terli işten sonra tuzlu bir öğün yiyin.",
      "Barınağı serin tutun: gece serin havayı içeri alın, gündüz kapı ve pencereyi kapatıp gölgeleyin.",
      "Yiyecek sıcakta hızla bozulur. Pişmiş yemeği hemen tüketin; kuru ve tuzlu ürünleri tercih edin.",
      "Durgun su birikintilerini kaldırın; sivrisinek orada ürer. Su kaplarının ağzını kapatın.",
      "Bebekler, yaşlılar ve hastalar sıcağa en hassas olanlardır; günde birkaç kez yoklayın. Sıcak çarpması belirtileri için ana uygulamadaki rehbere bakın."
    ],
    art: [null, 'sf-bt-yaz-golgelik', null, 'sf-bt-yaz-su-icme', null, null, null, 'sf-bt-yaz-durgun-su', null],
    dont: [
      "Öğle sıcağında ağır iş yaptırmayın.",
      "Susuzluğu beklemeyin; susadığınızda vücut zaten su kaybetmiştir.",
      "Kısa sürede çok fazla su içmeyin."
    ],
    keywords: ['yaz hazırlığı', 'sıcakta çalışma', 'ne kadar su içmeli', 'gölgelik yapma', 'sıcaktan korunma', 'yazın su depolama', 'sicakta su', 'kuraklık hazırlığı', 'serin barınak'],
    sources: [
      "OHS Online — Hydrating in the heat, NIOSH ve OSHA önerileri (https://ohsonline.com/articles/2023/05/05/hydrating-in-the-heat-how-much-water.aspx)",
      "William & Mary EHS — Heat stress hydration (https://www.wm.edu/offices/ehs/documents/website_heat_stress_hydration_2023.pdf)",
      "Akıl Çantası ana uygulama — Sıcak çarpması ve aşırı sıcak rehberleri"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: saatlik üst sınır 48 oz = 1,42 L olduğu için metindeki 1,5 L, 1,4 L'ye indirildi. Yazarın notu: her 15–20 dk 8 oz (~240 ml) su, saatte 48 oz (~1,4 L) üst sınır (NIOSH/OSHA, iki ikincil kaynak). CDC NIOSH sayfası doğrudan açılamadı." },
  },
  {
    id: 'sf-yangin-mevsimi',
    category: 'sf-bt-doga-uzun',
    title: "Yangın mevsiminde yerleşimi korumak",
    tag: "DOĞA",
    summary: "Yapıların çevresinde 1,5 m yanmaz şerit, 10 m ağaçsız ve yanıcısız alan, 100 m'ye kadar seyreltilmiş ve alttan budanmış ağaçlarla yangın kuşağı kurun; söndürme araçlarını ve kaçış yolunu hazır tutun.",
    note: "Türkiye'de 6831 sayılı Orman Kanunu'nun 76. maddesine göre ormanda, izin verilen ocak yerleri dışında ateş yakmak yasaktır; yangın mevsiminde valilikler ormana 4 km'ye kadar ateş yakmayı da yasaklayabilir. Devlet ormanında izinsiz ağaç kesmek ve budamak da olağan koşullarda yasaktır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    steps: [
      "Yapının her yanında 1,5 m'lik yanmaz bir şerit yapın: çakıl, taş ya da çıplak toprak. Bu şeritte hiçbir bitki ve yanıcı malzeme olmasın.",
      "Yapıdan 10 m'ye kadar: ağaç ve çalı bırakmayın, yeni ağaç dikmeyin. Ot varsa 10 cm'nin altında ve yeşil tutun, kuru yaprak ve iğne yaprağı toplayın. Odun yığını, saman ve her türlü yanıcı malzeme bu alanın dışında olsun.",
      "10–30 m arası: ağaçları seyreltin, ağaçlar arasında en az 3 m boşluk kalsın; çam gibi reçineli ağaçlarda tepeler arasını daha geniş, 5–10 m tutun. Dalları yerden 2 m'ye kadar budayın, zemini en az 6 ayda bir kuru otlardan temizleyin.",
      "30–100 m arası: ağaçların dallarını yerden 2 m'ye kadar budayın, çalıyı seyreltin, kuru dalı toplayın. Köy ve kampın bütün çevresinde 100 m'lik bu yakıt azaltma kuşağını hedefleyin.",
      "Çatıyı ve olukları kuru yaprak ve dal birikintisinden temizleyin. Saman ve kamış çatıları yangın mevsiminden önce ıslatma imkânı hazırlayın.",
      "Söndürme araçlarını hazır tutun: dolu su varilleri, kova, kürek, kum ve ıslatılabilir çuvallar. Herkes yerlerini bilsin.",
      "Kuru ve rüzgârlı günlerde açık ateş yakmayın. Yemek ateşini çukurda, rüzgâr kesici arkasında yakın ve başından ayrılmayın.",
      "Yangın mevsiminde gözcü nöbeti tutun; duman görülünce alarm verin.",
      "En az iki ayrı kaçış yolu belirleyin ve tatbikat yapın. Yangın yaklaşırsa malı değil insanları kurtarın."
    ],
    art: ['sf-bt-yangin-kusak-plan', 'sf-bt-yangin-10m', 'sf-bt-yangin-budama', null, null, null, null, null, null],
    dont: [
      "Kuru ot ve dal artığını yakarak temizlemeye kalkmayın; en çok yangın böyle başlar.",
      "Odun ve samanı evin duvarına dayalı bırakmayın.",
      "Yangın yaklaşırken eşya kurtarmak için geri dönmeyin."
    ],
    keywords: ['yangın mevsimi', 'orman yangınına karşı ev koruma', 'yangın şeridi', 'yangın emniyet şeridi', 'ev çevresi temizlik yangın', 'yangina karsi koruma', 'yangın kuşağı', 'köyü yangından koruma', 'çalı temizliği'],
    sources: [
      "FireSmart Canada — Yard fact sheet (https://firesmartcanada.ca/wp-content/uploads/2022/01/FSA_FireSmart-Fact-Sheet_Yard.pdf)",
      "Binaların Yangından Korunması Hakkında Yönetmelik, 20.11.2021 değişikliği, md. 21/5: 1,5 m, 1,5–10 m, 10–30 m (ağaç aralığı ≥3 m, 2 m budama, 6 ayda bir temizlik), 30–100 m (https://www.alomaliye.com/2021/11/20/binalarin-yangindan-korunmasi-karar-sayisi-4825/)",
      "Orman Yangınlarıyla Mücadele Çalışmaları Hakkında Yönetmelik, OGM, RG 05.09.2026: izinli alan dışında ateş yakana 6831 md. 76 ve 110 (https://www.alomaliye.com/2026/09/05/orman-yanginlariyla-mucadele-calismalari-hakkinda-yonetmelik/)",
      "BirGün — Antalya Valiliği genelgesi: 6831 md. 76 (izinli ocak yeri dışında ateş yasağı) ve 4 km yasağı (https://www.birgun.net/haber/antalya-valiligi-nden-genelge-ormanlara-4-kilometre-mesafede-bile-ates-yakmak-yasak-448845)",
      "Safe Communities Portugal — çam türlerinde geniş tepe aralığı (https://www.safecommunitiesportugal.com/well-protected-homes-can-be-safe-places-against-forest-fires/)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: Türk mevzuatı bulundu. Binaların Yangından Korunması Hakkında Yönetmelik md. 21/5 (2021) orman yakınındaki tesisler için 1,5 m'de bitki ve yanıcı yok, 1,5–10 m'de yanıcı yok ve ağaçlandırma yok, 10–30 m'de ağaç aralığı ≥3 m, 2 m'ye kadar budama ve 6 ayda bir kuru ot temizliği, 30–100 m'de 2 m budama ister. Rehber bu yönetmeliğe ve FireSmart'a göre sıkılaştırıldı: 10 m'de ağaç bırakılmaz, kuşak 100 m. OGM'nin 2026 yönetmeliğinde yerleşim çevresi şerit genişliği yok. Çamda 5–10 m tepe aralığı Portekiz kaynağından, tutucu ek." },
  },
  {
    id: 'sf-sel-heyelan-yerlesim',
    category: 'sf-bt-doga-uzun',
    title: "Sel ve heyelandan yerleşimi korumak",
    tag: "DOĞA",
    summary: "Yerleşimi dere yatağından, yamaç dibinden ve eski heyelan alanından uzak, sağlam ve düz bir zemine kurun; yağmur suyunu yapılardan uzaklaştırın, yamaçtaki bitki örtüsünü koruyun ve belirtileri izleyin.",
    steps: [
      "Yeni yapı ve kamp yerini dere yatağı, kuru dere, küçük su yolları, yamaç dibi ve dik yamaç kenarında seçmeyin.",
      "Eski sel izlerini arayın: ağaç gövdelerinde çamur çizgisi, dallarda asılı çöp, sürüklenmiş taş ve kütük yığınları. Yapıyı bu izlerin yukarısına kurun.",
      "Eski heyelan izlerini tanıyın: yamaçta basamak gibi kopmalar, eğri büyümüş ağaçlar, düzensiz tümsekler. Bu alanlara yerleşmeyin.",
      "En güvenli yerler: daha önce kaymamış sağlam kaya zemin, eğimi aniden değişmeyen düzlükler ve sırt üstü, kenardan geride kalan yerler.",
      "Yağmur suyunu yönetin: yapının yukarısına suyu yana çeviren bir hendek açın, çatı suyunu yapıdan uzağa akıtın, suyun yamaçta tek bir noktada toplanmasına izin vermeyin.",
      "Yerleşimin yukarısındaki yamaçta ağaç ve çalı kesmeyin; kökler toprağı tutar.",
      "Yüksek set duvarı, büyük teras ve yamaç kazısını uzmansız yapmayın. Küçük teraslarda taş duvarı alçak ve arkası drenajlı yapın.",
      "Belirtileri izleyin: yerde yeni çatlak ve kabarma, eğilen ağaç ve direk, sıkışan kapı-pencere, kuru yerde çıkan yeni su, temelden ayrılan toprak.",
      "Sağanakta dereyi gözleyin: su hızla yükselip çamurlanırsa ya da yağmur sürerken birden azalırsa yukarıda tıkanma olabilir; hemen yükseğe çıkın.",
      "Toplanma yerini yüksek ve sağlam bir noktada belirleyin, oraya giden yolu herkes bilsin. Sel ve heyelan anında ne yapılacağı için ana uygulamadaki rehberlere bakın."
    ],
    art: ['sf-bt-sel-yer-secimi', 'sf-bt-sel-izleri', null, null, 'sf-bt-sel-hendek', null, null, null, null, null],
    dont: [
      "Dere yatağına, kuru dereye ya da yamaç dibine ev ve ağıl yapmayın.",
      "Yamacın dibini kazıp yapı yeri açmayın; yamaç kayar.",
      "Yerleşimin üstündeki ormanı yakacak için kesmeyin."
    ],
    keywords: ['selden korunma yerleşim', 'heyelan riski', 'ev yeri seçimi', 'dere yatağına ev', 'yamaç kayması belirtileri', 'heyelan belirtileri', 'sel izleri', 'drenaj hendeği', 'yerlesim yeri secimi', 'toprak kayması önleme'],
    sources: [
      "USGS — Landslide preparedness (https://www.usgs.gov/programs/landslide-hazards/landslide-preparedness)",
      "Akıl Çantası ana uygulama — Heyelan, sel ve çamur akışı rehberleri"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: sayılar hesap ve iç tutarlılıkla kontrol edildi, güvenlik açısından hata bulunmadı; kaynaklar yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: kaçınılacak ve güvenli yerler, heyelan belirtileri, derenin hızla yükselip çamurlanması ya da yağmurda aniden düşmesi (USGS). AFAD sayfası robots nedeniyle açılamadı (RAPOR)." },
  },
  {
    id: 'sf-orman-surdurulebilir',
    category: 'sf-bt-doga-uzun',
    title: "Orman ürünlerini sürdürülebilir kullanmak",
    tag: "DOĞA",
    summary: "Önce yerdeki kuru dalı ve devrik ağacı kullanın; yakacak ve sırık için kökten sürgün veren ağaçları baltalık usulüyle parsel parsel kesin, sürgünü hayvandan koruyun, kestiğiniz kadar dikin.",
    note: "Türkiye'de olağan koşullarda devlet ormanında ağaç kesmek ve orman ürünü çıkarmak 6831 sayılı Orman Kanunu'na göre orman idaresinin iznine bağlıdır, izinsizi suçtur; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    steps: [
      "Önce yerdeki kuru dalı, devrik ve kurumuş ağacı kullanın. Canlı ağaç kesmek son seçenektir.",
      "Kökten sürgün veren ağaçları baltalık usulüyle kullanın: meşe, kestane, gürgen, kızılağaç, söğüt, kavak. Kütükten kesilince yeniden sürgün verirler.",
      "Kesim dönüşünü ağaca göre planlayın: söğüt ve kavak 1–3 yılda, fındık gibi çalılar yaklaşık 7 yılda, kestane 12–18 yılda yeniden kesilebilir; meşe çok daha uzun sürer.",
      "Ormanı parsellere bölün ve her yıl yalnız bir parseli kesin. Parselleri haritaya ve deftere işleyin; böylece her yıl kesilecek yer hazır olur.",
      "Kesilen parseli keçi ve koyundan koruyun: çit ya da dal örgüsü yapın. Hayvan genç sürgünü yerse kütük ölür.",
      "Hayvan otlatılan yerde ağacı yüksekten budayın; sürgünler hayvanın yetişemeyeceği yükseklikte çıkar.",
      "Su kenarındaki, yamaç üstündeki ve tohum veren yaşlı büyük ağaçları kesmeyin. Bunlar suyu, toprağı ve ormanın geleceğini korur.",
      "Meyve, yaprak ve ot toplarken bitkinin tamamını almayın; çoğalmaya yetecek kadarını bırakın.",
      "Kestiğiniz kadar dikin: fidan yetiştirin ya da yabani fidanı uygun yere taşıyın, otlanmaktan koruyun.",
      "Kesilen miktarı, yeri ve dikilen fidanı her yıl deftere yazın."
    ],
    art: [null, 'sf-bt-orman-baltalik', null, null, 'sf-bt-orman-cit', 'sf-bt-orman-yuksek-budama', null, null, null, null],
    dont: [
      "Bir alandaki bütün ağaçları birden kesmeyin; toprak akar, su kaynakları kurur.",
      "Kesilen parselde hayvan otlatmayın.",
      "Su kenarındaki ve yamaç üstündeki ağaçları kesmeyin."
    ],
    keywords: ['baltalık', 'sürdürülebilir odun', 'ağaç kesme düzeni', 'orman nasıl korunur', 'kökten sürgün', 'odunluk', 'yakacak için ağaç', 'fidan dikme', 'orman kullanımı', 'koru kesim'],
    sources: [
      "Wikipedia — Coppicing (https://en.wikipedia.org/wiki/Coppicing)",
      "USDA Forest Service — Trail Notebook: dal kesim tekniği (https://www.fs.usda.gov/t-d/pubs/htmlpubs/htm07232806/page07.htm)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yasal not 6831 sayılı Kanun açısından netleştirildi (madde numarası doğrulanamadı); dönüş süreleri yeniden açılmadı. Yazarın notu: Kaynaklarla teyit: baltalık türleri ve dönüş süreleri (söğüt/kavak 1–3 yıl, fındık ~7, kestane 12–18, meşe uzun), parsel düzeni, otlatmadan koruma ve yüksek budama (Coppicing). Türkiye'ye özgü baltalık türleri ve OGM uygulaması kaynakla doğrulanamadı (RAPOR)." },
  },
];
