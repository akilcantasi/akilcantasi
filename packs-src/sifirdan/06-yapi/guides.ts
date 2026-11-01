// Sıfırdan: Barınak ve yapı — KATALOG bölüm 5 (maddeler 100–133)
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-yapi',
  name: 'Sıfırdan: Barınak ve yapı',
  desc: 'Yer seçimi, temel, kerpiç ve toprak duvar, kütük ve taş yapı, kireç, çatı, kapı-pencere, kar barınağı, yurt ve keçe, çit ve ahır. Deprem güvenliği uyarılarıyla.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sf-yp-yer', title: 'Yer, temel ve deprem', hint: 'Yer seçimi, güneş, temel, döşeme, bakım', art: 'sf-yp-kapak-yer', color: '#c4b5a0', order: 140 },
  { id: 'sf-yp-toprak', title: 'Toprak yapı', hint: 'Toprak testi, kerpiç, yığma toprak, sıva', art: 'sf-yp-kapak-toprak', color: '#d4a373', order: 141 },
  { id: 'sf-yp-ahsap-tas', title: 'Ahşap ve taş yapı', hint: 'Kütük ev, taş duvar, kireç, ahşap iskelet', art: 'sf-yp-kapak-ahsap', color: '#a0785a', order: 142 },
  { id: 'sf-yp-cati', title: 'Çatı, kapı ve ek yapılar', hint: 'Çatı, kiremit, kapı, pencere, yurt, ahır', art: 'sf-yp-kapak-cati', color: '#94a3b8', order: 143 },
];

const CHK = (note: string) => ({ date: '2026-11-02', note });

const NOTE_TOPRAK = "Uzman gözetimi olmadan toprak yapı yapmayın: kerpiç ve toprak duvarlar depremde gevrek biçimde çöker; güncel deprem yönetmeliği (TBDY 2018) kerpiç binaya izin vermez. Buradaki ölçüler 1975 ve 1998 yönetmeliklerinin en az koşullarıdır, güvenliği garanti etmez; yalnız gerçek hayatta kalma durumu için tek katlı, hatıllı ve hafif çatılı yapın, toprak dam yapmayın.";
const NOTE_ORMAN = "Türkiye'de olağan koşullarda devlet ormanından izinsiz ağaç kesmek 6831 sayılı Orman Kanunu'na göre suçtur, kesim izne bağlıdır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.";

// Kaynaklar
const Y1975 = "Afet Bölgelerinde Yapılacak Yapılar Hk. Yönetmelik, Bölüm 11 Kerpiç Yapılar (http://www.okangungor.com.tr/wp-content/uploads/2013/05/1975-DEPREM-YONETMELIGI.pdf)";
const Y1998 = "Kırsal Yapıların Deprem Karşısındaki Davranışı — 1997/98 yönetmeliği kerpiç ve yığma kuralları (https://dergipark.org.tr/tr/download/article-file/34224)";
const FSM = "FSM Vakıf Üniv. yüksek lisans tezi — TBDY 2018'de kerpiç, TS 2514/2515 (https://acikerisim.fsm.edu.tr/xmlui/bitstream/handle/11352/3949/Yava%20.pdf?sequence=1)";
const FAO_EARTH = "FAO Rural Structures in the Tropics — Earth as building material (https://www.fao.org/4/s1250e/S1250E06.htm)";
const FAO_FOUND = "FAO Rural Structures — Footings and foundations (https://www.fao.org/4/s1250e/S1250E0h.htm)";
const FAO_CONC = "FAO Rural Structures — Foundations, damp-proofing, splash apron (https://www.fao.org/4/s1250e/S1250E0i.htm)";
const FAO_WALLS = "FAO Rural Structures — Walls (https://www.fao.org/4/s1250e/S1250E0j.htm)";
const FAO_FLOORS = "FAO Rural Structures — Floors (https://www.fao.org/4/s1250e/S1250E0k.htm)";
const FAO_ROOF = "FAO Rural Structures — Roofing for pitched roofs (https://www.fao.org/4/s1250e/S1250E0l.htm)";
const FAO_BRICK = "FAO Rural Structures — Burnt-clay bricks, lime (https://www.fao.org/4/s1250e/S1250E07.htm)";
const FAO_TIMBER = "FAO Rural Structures — Wood properties, decay and moisture (https://www.fao.org/4/s1250e/S1250E03.htm)";
const FAO_POLES = "FAO Rural Structures — Poles and timber (https://www.fao.org/4/s1250e/S1250E04.htm)";
const FAO_ORGANIC = "FAO Rural Structures — Thatch, reeds, natural stone (https://www.fao.org/4/s1250e/S1250E05.htm)";
const FAO_CLIMATE = "FAO Rural Structures — Climate and environmental control (https://www.fao.org/4/s1250e/S1250E0q.htm)";
const FAO_DWELL = "FAO Rural Structures — Farm dwellings (https://www.fao.org/4/s1250e/S1250E1a.htm)";
const FAO_POULTRY = "FAO Rural Structures — Poultry housing (https://www.fao.org/4/s1250e/S1250E16.htm)";
const FAO_SHEEP = "FAO Rural Structures — Sheep and goat housing (https://www.fao.org/4/s1250e/S1250E17.htm)";
const ECHO = "ECHO — Earth/adobe block technical note (https://www.echocommunity.org/resources/dd3ec0ca-74a0-4aa0-a1e9-76885a55e1fa)";
const GHB = "GreenHomeBuilding — Adobe mixes (https://greenhomebuilding.com/QandA/adobe/mixes.htm)";
const NPS = "US National Park Service — Adobe soil testing (https://www.nps.gov/common/uploads/teachers/lessonplans/TUMA%20Adobe-Challenge-Pre-Trip_Soil-Testing.pdf)";
const CA_COB103 = "California Residential Code Appendix BK103 — Cob materials and installation (https://gocodebook.com/library/us/ca/ca-residential-code/appendix-bk-cob-construction-monolithic-adobe/section-bk103-materials-mixing-and-installation)";
const CA_COB105 = "California Residential Code Appendix BK105 — Cob walls general (https://gocodebook.com/library/us/ca/ca-residential-code/appendix-bk-cob-construction-monolithic-adobe/section-bk105-cob-walls-general)";
const MEN_COB = "Mother Earth News — Build a cob wall (https://www.motherearthnews.com/sustainable-living/green-homes/build-a-cob-wall-zbcz2004/)";
const BHU_RE = "Bhutan Dept. of Culture — Rammed Earth Manual (https://doc.gov.bt/wp-content/uploads/2023/06/Rammed-Earth-Manual_English.pdf)";
const PEAK = "Peak District National Park — Dry stone walling (https://www.peakdistrict.gov.uk/__data/assets/pdf_file/0017/2159/drystonewalling.pdf)";
const BC_LIME = "Building Conservation — Hot-mixed lime mortars (https://buildingconservation.com/articles/hot-mixed-mortars/hot-mixed-mortars.htm)";
const BALL_LIME = "Ballenberg Açık Hava Müzesi — Lime burning and slaking (https://ballenberg.ch/en/lime-burning-and-slaking/)";
const W_KILN = "Wikipedia — Lime kiln (https://en.wikipedia.org/wiki/Lime_kiln)";
const W_LPLASTER = "Wikipedia — Lime plaster (https://en.wikipedia.org/wiki/Lime_plaster)";
const USFS_LOG = "US Forest Service — Building with Logs (Fickes, 1945) (https://gutenberg.org/cache/epub/59380/pg59380-images.html)";
const HF_LOG = "The Henry Ford — Caring for log buildings (https://ophelia.sdsu.edu:8443/henryford_org/06-15-2014/research/caring/log.aspx.html)";
const W_SOD = "Wikipedia — Sod roof (https://en.wikipedia.org/wiki/Sod_roof)";
const W_SHINGLE = "Wikipedia — Wood shingle (https://en.wikipedia.org/wiki/Wood_shingle)";
const W_TIMBER = "Wikipedia — Timber framing (https://en.wikipedia.org/wiki/Timber_framing)";
const W_WATTLE = "Wikipedia — Wattle and daub (https://en.wikipedia.org/wiki/Wattle_and_daub)";
const W_SNOWCAVE = "Wikipedia — Snow cave (https://en.wikipedia.org/wiki/Snow_cave)";
const W_QUINZHEE = "Wikipedia — Quinzhee (https://en.wikipedia.org/wiki/Quinzhee)";
const W_IGLOO = "Wikipedia — Igloo (https://en.wikipedia.org/wiki/Igloo)";
const W_YURT = "Wikipedia — Yurt (https://en.wikipedia.org/wiki/Yurt)";
const W_FELT = "Wikipedia — Felt (https://en.wikipedia.org/wiki/Felt)";
const W_ALAKIYIZ = "Wikipedia — Ala kiyiz, Kırgız keçesi (https://en.wikipedia.org/wiki/Ala_kiyiz)";
const W_PASSIVE = "Wikipedia — Passive solar building design (https://en.wikipedia.org/wiki/Passive_solar_building_design)";
const W_EARTHSHELTER = "Wikipedia — Earth shelter (https://en.wikipedia.org/wiki/Earth_shelter)";
const W_HINGE = "Wikipedia — Hinge (https://en.wikipedia.org/wiki/Hinge)";
const W_WINDOW = "Wikipedia — Window (https://en.wikipedia.org/wiki/Window)";
const W_WOODPRES = "Wikipedia — Wood preservation (https://en.wikipedia.org/wiki/Wood_preservation)";
const W_SPLITRAIL = "Wikipedia — Split-rail fence (https://en.wikipedia.org/wiki/Split-rail_fence)";
const W_LANDSLIDE = "Wikipedia — Landslide (https://en.wikipedia.org/wiki/Landslide)";
const W_LADDER = "Wikipedia — Ladder (https://en.wikipedia.org/wiki/Ladder)";
const USFA_HEAT = "U.S. Fire Administration — Heating fire safety (https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/heating/)";
const CDC_CO = "CDC — Carbon monoxide poisoning basics (https://www.cdc.gov/carbon-monoxide/about/index.html)";
const AYM_ORMAN = "Anayasa Mahkemesi kararı, 6831 Orman Kanunu md. 91 metni (https://www.anayasa.gov.tr/media/4925/kd_06.pdf)";
const CSB_YIGMA = "ÇŞB — Yığma ve karma binalar risk tespiti sunumu: kerpiç yığma kapsamı dışında (https://webdosya.csb.gov.tr/db/altyapi/icerikler/yigma-ve-karma-b-nalar-20211109114737.pdf)";
const OSHA_LADDER = "OSHA — Portable ladder safety quick card (https://www.osha.gov/sites/default/files/publications/portable_ladder_qc.pdf)";

export const GUIDES: PackGuide[] = [
  // ───────────── Yer, temel ve deprem ─────────────
  {
    id: 'sf-yp-yer-secimi',
    category: 'sf-yp-yer',
    title: 'Ev yeri seçme: sel, heyelan, rüzgâr, güneş',
    tag: 'YER SEÇİMİ',
    summary: 'Evi taşkın düzlüğünden, dere yatağından ve kayma izi olan yamaçtan uzakta; sağlam, iyi su süzen, hafif eğimli ve güneye bakan bir yere kurun.',
    steps: [
      "Taşkın düzlüğüne ve kuru dere yatağına asla yapmayın. Eski taşkın izlerine bakın: ağaç gövdesinde çamur çizgisi, dallara takılmış çöp, düzlüğe yayılmış çakıl ve kum.",
      "Dar vadi ağzından ve dik derelerin önündeki yelpaze biçimli taş-çamur birikintisinden uzak durun. Sağanakta buralardan çamur ve moloz akar.",
      "Yamaçta kayma izi arayın: tepede kaşık biçimli oyuk ya da basamak, yerde açılmış çatlaklar, sürekli ıslak ve sızıntılı toprak. Biri bile varsa başka yer arayın; eski heyelan yerleri yeniden kayar.",
      "Eteği dere tarafından oyulmuş ya da kazılmış yamacın ne altına ne üstüne yapın. Yamaçtaki ağaçları kesmeyin; kökler toprağı tutar.",
      "Su kaynağına yakın ama ondan yüksekte durun. Zemin, yağmur suyunu evden uzağa akıtacak kadar hafif eğimli olsun.",
      "Yaklaşık 1 m derinlikte deneme çukuru kazın. Kara bitkisel toprağın altında sert, kuru, sıkı bir katman çıkmalı. Dolgu toprak, bataklık ve yumuşak, yapışkan çamur uygun değildir.",
      "Soğuk bölgede kuzey rüzgârına kapalı, güneye bakan yamacı seçin. Sıcak ve nemli bölgede esinti alan, gölgeli yeri seçin.",
      "Tek başına duran yaşlı ağacın, kuru dalların ve taş düşen kayalığın altına kurmayın."
    ],
    art: ['sf-yp-yer-taskin', null, 'sf-yp-yer-heyelan', null, null, 'sf-yp-yer-cukur', null, null],
    dont: [
      "Kuru dere yatağının düzlüğünü \"düz ve kolay\" diye seçmeyin; sağanakta ilk orası basar.",
      "Yamacın eteğini ev yeri açmak için oymayın; yamacı kaydırabilirsiniz.",
      "Yeni doldurulmuş, gevşek toprağa temel atmayın; dolgu en az bir yıl oturmadan yük taşımaz.",
      "Sürekli sızıntı veren, ıslak yamaçta ev kurmayın; su toprağı kaydırır."
    ],
    keywords: ['ev yeri seçimi', 'ev nereye yapılır', 'barınak yeri nasıl seçilir', 'sel basmayan yer', 'heyelan belirtileri', 'toprak kayması işaretleri', 'yamaca ev yapmak', 'dere yatağına ev', 'ev yeri secimi', 'evi kuracak yer', 'arsa seçimi felaket sonrası'],
    sources: [FAO_DWELL, FAO_FOUND, W_LANDSLIDE, W_EARTHSHELTER],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: FAO (taşkın düzlüğüne yapmama, sağlam zemin, dolgu en az 1 yıl), Wikipedia Landslide (eski kayma izleri, oyulmuş yamaç, ağaçsızlaşma, su basıncı)."),
  },
  {
    id: 'sf-yp-gunes-yonu',
    category: 'sf-yp-yer',
    title: 'Güneşe göre ev yönü ve saçak',
    tag: 'GÜNEŞ YÖNÜ',
    summary: 'Evin uzun cephesini ve pencerelerin çoğunu güneye çevirin; doğru boyda saçakla yaz güneşini kesip kış güneşini içeri alın.',
    steps: [
      "Güneyi bulun: düz yere dik bir çubuk dikin; öğle vakti gölge en kısa olduğunda gölge kuzeyi gösterir.",
      "Evin uzun kenarını doğu-batı doğrultusunda yerleştirin; uzun cephe güneye baksın. Birkaç derece doğuya çevirmek sabah güneşini erken alır.",
      "Pencerelerin yaklaşık %80'ini güney cephesine koyun. Kuzeye az ve küçük pencere açın.",
      "Güneye bakan pencerelerin toplam alanı, evi hafifçe ısıtmak için taban alanının %5–7'si kadar olsun. Çok fazlası geceleri ısı kaçırır.",
      "Türkiye'de (36–42° enlem) öğle güneşi yazın 71–77°, kışın 25–31° yükseklikte durur. Bu farkı saçakla kullanın.",
      "Güney saçağını, pencere altından saçak ucuna olan yüksekliğin üçte biri kadar dışarı taşırın. Ör. bu yükseklik 1,5 m ise saçak 50 cm olsun.",
      "Pencere üst kenarını saçağın yaklaşık 30 cm altında bırakın; kış güneşi saçağın altından içeri girer.",
      "Güneş alan odaya kalın kerpiç, taş ya da toprak duvar ve döşeme koyun; gündüz ısıyı emer, gece verir. Kerpiç ısı duvarı 20–30 cm kalınlıkta iyi çalışır.",
      "Kuzey duvarına odunluk, kiler ya da ahır yaslayın; soğuk rüzgâra tampon olur.",
      "Sıcak, nemli bölgede karşılıklı pencerelerle esintiyi içeri alın ve güneyde geniş gölgelik yapın."
    ],
    art: ['sf-yp-gunes-cubuk', 'sf-yp-gunes-plan', null, null, null, 'sf-yp-gunes-sacak', null, null, null, null],
    dont: [
      "Kuzeye büyük pencere açmayın; kışın en çok ısı oradan kaçar.",
      "Güney saçağını gereğinden uzun yapmayın; kış güneşini de keser.",
      "Kerpiç ve toprak duvarlı evde saçağı yaklaşık 50 cm'den çok taşırmayın; uzun saçak ağırlaşır, depremde ve rüzgârda zorlanır.",
      "Isı tutan duvarın önünü dolap ve yığınla kapatmayın."
    ],
    keywords: ['ev hangi yöne bakmalı', 'güneşe göre ev yönü', 'saçak ne kadar olmalı', 'saçak boyu hesabı', 'pasif güneş evi', 'kışın güneş alan ev', 'guneye bakan ev', 'pencere yönü', 'evin cephesi güney', 'ısı tutan duvar'],
    sources: [W_PASSIVE, W_EARTHSHELTER, FAO_DWELL, FAO_WALLS],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: saçak üst sınırı 1975/1998 çelişkisine göre ~50 cm'ye indirildi; güneş açıları 90 − enlem ± 23,4° formülüyle yeniden hesaplandı (36–42°: yaz 71,4–77,4°, kış 24,6–30,6°), doğru. Yazarın kaynakları: Wikipedia Passive solar (pencerelerin %80'i güneyde, %5–7 cam/taban, kerpiç kütle 200–300 mm, yaz-kış güneş farkı 47°); güneş açıları enlemden hesaplandı; FAO toprak duvarda saçak ~0,6 m."),
  },
  {
    id: 'sf-yp-temel',
    category: 'sf-yp-yer',
    title: 'Taş temel ve nemden koruma',
    tag: 'TEMEL',
    summary: 'Sağlam toprağa kadar kazın, kireç harçlı taş temeli topraktan en az 50 cm yükseltin, üstüne nem kesici ve hatıl koyun.',
    steps: [
      "Duvar hattındaki bitkisel toprağı tamamen kaldırın. Sert, kazılmamış toprağa ulaşana dek kazın: hafif yapıda en az 30 cm; kerpiç ya da taş evde en az 80 cm ve don derinliğinin altına.",
      "Hendeği duvar kalınlığının yaklaşık iki katı genişlikte açın. Kerpiç ev için temel duvarı en az 50 cm kalın olmalıdır.",
      "Eğimli arazide temeli basamaklayın; her basamağın yatay boyu, yükseklik farkının en az iki katı olsun.",
      "En büyük, düz yüzlü taşları en alta, uzun yüzleri duvar boyunca yatacak biçimde dizin. Taşları harca oturtun, boşlukları küçük taşla sıkıştırın. Çimento bulursanız 1 ölçü çimento, 2 ölçü kireç kaymağı, 9 ölçü kum kullanın; eski yönetmelik en riskli bölgelerde bunu isterdi. Çimento yoksa 1 ölçü kireç kaymağı, 3 ölçü kum.",
      "Temel duvarını toprak yüzünden en az 50 cm yukarı çıkarın. Kerpiç ve ahşap toprağa ve yağmur sıçramasına değmemeli.",
      "Temelin üstüne nem kesici koyun: naylon, katran ya da sık bir sıra harçlı düz taş. Naylon parçalarını en az 20 cm bindirin.",
      "Nem kesicinin üstüne temel genişliğinde, 15 cm yüksekliğinde hatıl kurun: iki 10 × 10 cm kadronu her 50 cm'de bir enine kadronla çivileyin, arasını taş kırığıyla doldurun.",
      "Evin çevresine damlanın düştüğü yerin en az 15 cm ötesine kadar dışa eğimli taş ya da sıkıştırılmış çakıl şerit yapın. Yukarıdan gelen yüzey suyunu hendekle evin yanından çevirin."
    ],
    art: ['sf-yp-temel-hendek', null, null, null, 'sf-yp-temel-subasman', null, 'sf-yp-temel-hatil', null],
    dont: [
      "Kerpici ya da ahşabı doğrudan toprağa oturtmayın; nem çeker, çürür ve çöker.",
      "Dolgu ya da bitkisel toprak üstüne temel atmayın.",
      "Temel hendeğinde biriken suyu görmezden gelmeyin; önce drenaj yapın.",
      "Temel taşlarını harçsız, sıkıştırmadan üst üste koymayın; yük altında kayar."
    ],
    keywords: ['taş temel nasıl yapılır', 'temel derinliği', 'ev temeli kazma', 'temel nem kesici', 'subasman yüksekliği', 'kerpiç ev temeli', 'temel hatılı', 'temel genisligi', 'rutubet temelden', 'moloz taş temel'],
    sources: [Y1975, Y1998, FAO_FOUND, FAO_CONC, BC_LIME],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: 1975 Bölüm 11 (11.2.1 temel ≥50 cm, zeminden ≥50 cm; 11.2.2 derinlik ≥80 cm; 11.5.1 hatıl 0,15 m, iki 10×10 kadron, 50 cm'de bir 5×10 bağ) ve 1998 makalesi (çimento takviyeli kireç harcı 1/2/9; kireç harcı 1/3 yalnız düşük riskli bölgede) metinden okundu; çimento oranı eklendi. FAO (sağlam zemin 30 cm–1 m, iki kat genişlik, basamak, naylon 20 cm bindirme, sıçrama şeridi)."),
  },
  {
    id: 'sf-yp-deprem',
    category: 'sf-yp-yer',
    title: 'Depreme dayanıklı basit yapı: hatıl, hafif çatı, simetri',
    tag: 'DEPREM GÜVENLİĞİ',
    summary: 'Tek katlı, dikdörtgen ve simetrik plan, hafif çatı, her seviyede kesintisiz hatıl, az ve küçük açıklık: kerpiç ve taş evde can kurtaran kurallar bunlardır.',
    note: NOTE_TOPRAK,
    steps: [
      "Tek kat yapın; kat yüksekliği 2,70 m'yi geçmesin. Planı dikdörtgen ve iki eksende simetrik tutun; L ve T biçimli plandan kaçının.",
      "Çatıyı hafif yapın: ahşap makaslı çatı ve şındıl ya da benzeri hafif örtü kullanın. Toprak dam yapmayın; eski yönetmelikler onu en riskli bölgelerde tümden yasaklardı ve bir yerin riskinin düşük olduğunu sahada anlayamazsınız.",
      "Dış kerpiç duvarı en az 1,5 kerpiç boyu ve en az 47 cm, iç taşıyıcı duvarı en az 1 kerpiç boyu kalın yapın. Taş duvar en az 50 cm olsun. Taşıyıcı duvarlar arası, eksenden eksene 4,5 m'yi geçmesin.",
      "Duvarı her seviyede hatılla kuşatın: temel üstü, pencere altı, pencere üstü ve çatı altı. Hatıllar köşelerde birbirine sıkıca bağlanıp evin çevresini kesintisiz dolaşsın.",
      "Açıklıkları az ve küçük tutun: kapı en çok 1,00 × 2,10 m, pencere en çok 0,90 × 1,20 m. İki duvar kesişimi arasına birden fazla kapı koymayın.",
      "Köşe ile en yakın kapı ya da pencere arasında en az 1 m dolu duvar bırakın; taş evde ve yapabiliyorsanız kerpiçte de 1,5 m. Duvar kesişiminden ilk açıklığa en az 50 cm, iki açıklık arasında en az 1 m dolu duvar olsun.",
      "Her açıklığın üstüne duvar kalınlığında ahşap lento koyun; lento iki yanda en az 20 cm duvara otursun.",
      "Taşıyıcı duvarların toplam boyu (açıklıklar hariç) taban alanının her m²'si için en az 0,25 m olsun. Ör. 6 × 8 m (48 m²) ev için en az 12 m dolu taşıyıcı duvar.",
      "Tavan kirişlerini ve çatı makaslarını hatıla çivi, kama ya da bağla sabitleyin; çatı sarsıntıda duvardan kayıp düşmesin.",
      "Bacayı başka malzemeden yaparsanız duvardan bir derzle ayırın."
    ],
    art: [null, 'sf-yp-deprem-cati', null, 'sf-yp-deprem-hatil', null, 'sf-yp-deprem-bosluk', null, null, null, null],
    dont: [
      "Kerpiç ya da moloz taş evin üstüne ikinci kat çıkmayın.",
      "Toprak dama kalın toprak yığmayın; ağır dam sarsıntıda duvarları devirir ve içeridekilerin üstüne çöker.",
      "Köşeye kapı ya da pencere açmayın; köşeler ilk orada ayrılır.",
      "Hatılı köşede ya da açıklık üstünde kesik bırakmayın."
    ],
    keywords: ['depreme dayanıklı ev', 'kerpiç ev deprem', 'hatıl nedir', 'hatil nasil yapilir', 'deprem için basit ev', 'hafif çatı deprem', 'yığma ev deprem kuralları', 'kapı pencere köşe mesafesi', 'kerpiç duvar kalınlığı deprem', 'tek katlı güvenli ev'],
    sources: [Y1975, Y1998, FSM, CSB_YIGMA],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: TBDY 2018 Bölüm 11 tam metni okunamadı (Resmî Gazete, mevzuat.gov.tr, Lexpera erişim engelli). FSM tezi TBDY 2018'in kerpice izin vermediğini, ÇŞB sunumu kerpicin yığma kapsamı dışında olduğunu söylüyor. 1975 Bölüm 9/11 ve 1998 makalesi metinden okundu: tek kat, 2,70 m, 1,5/1 kerpiç boyu, 4,5 m, köşe 1 m (yığmada en riskli bölgede 1,5 m), kesişim 0,5 m, aralık 1 m, kapı 1,00×2,10, pencere 0,90×1,20 (1975: 1,40×0,90), lento 20 cm, 0,25 m/m², taş duvar ≥50 cm. Toprak dam tümden yasaklandı (en tutucu); TS 2515'in deprem bölgesi 47 cm değeri eklendi."),
  },
  {
    id: 'sf-yp-doseme',
    category: 'sf-yp-yer',
    title: 'Döşeme: sıkıştırma toprak ve kireçli taban',
    tag: 'DÖŞEME',
    summary: 'Bitkisel toprağı kaldırın, çakıl ve nem kesici serin, nemli toprağı ince katlar halinde dövün; tabanı dış zeminden en az 15 cm yüksek tutun.',
    steps: [
      "Taban alanındaki bitkisel toprağı tamamen kazıp atın. Kök, gübre ve kara toprağı dolguda kullanmayın.",
      "Bitmiş tabanı dış zeminden en az 15 cm yüksek planlayın.",
      "En alta en az 10 cm çakıl ya da kırma taş serip tokmakla sıkıştırın; yerden nem çekmeyi keser.",
      "Nemli yerde çakılın üstüne naylon serin, parçaları en az 20 cm bindirin, üstüne 5 cm kum koyun.",
      "Taban toprağını hazırlayın: kumlu-killi toprağı eleyin, avuçta sıkınca sıkı topak olacak, hafif parlayacak kadar nemlendirin. Döverken yüzeye su çıkıyorsa fazla ıslaktır.",
      "Toprağı yaklaşık 5 cm'lik katlar halinde serin, her katı 8–10 kg'lık tokmakla iz kalmayana dek dövün. İki kat yeterlidir.",
      "Kireç varsa toprağa ağırlıkça %4–14 kireç katın; yüzey suya daha dayanıklı olur. Kireçli tabanı en az bir hafta nemli tutun.",
      "Yüzeyi ıslak mala ile düzleyip yavaş kurutun. Kılcal çatlakları ince çamurla doldurun.",
      "Ahşap döşeme yapacaksanız kirişleri yerden en az 45 cm yüksekte tutun, altını havalandırın, hava deliklerini sık telle kapatın."
    ],
    art: [null, null, 'sf-yp-doseme-katlar', null, null, 'sf-yp-doseme-tokmak', null, null, 'sf-yp-doseme-ahsap'],
    dont: [
      "Organik, gübreli toprağı döşemeye koymayın; çürür, kokar ve çöker.",
      "Sönmemiş kireci çıplak elle tutmayın; deriyi ve gözü yakar.",
      "Ahşap döşemeyi ve kirişleri toprağa değdirmeyin.",
      "Tabanı dış zeminle aynı ya da daha alçak yapmayın; yağmurda ev su alır."
    ],
    keywords: ['toprak döşeme', 'sıkıştırma toprak taban', 'ev tabanı nasıl yapılır', 'kireçli taban', 'doseme yapimi', 'yer döşemesi toprak', 'evin zemini rutubet', 'ahşap döşeme yerden yükseklik', 'tokmakla toprak sıkıştırma'],
    sources: [FAO_FLOORS, FAO_EARTH, FAO_FOUND],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: FAO Floors (≥150 mm yükseklik, ≥100 mm çakıl, naylon+kum, iki kat 50 mm sıkıştırılmış toprak, ahşap döşeme ≥45 cm, 10 mm tel), FAO Earth (nem topak testi, 8–10 kg tokmak, kireç %4–14)."),
  },
  {
    id: 'sf-yp-yalitim',
    category: 'sf-yp-yer',
    title: 'Yalıtım: saman, yün, kuru yaprak',
    tag: 'YALITIM',
    summary: 'Önce tavanı kuru saman ya da kil-samanla yalıtın, duvar ve kapı aralıklarını tıkayın, keçe asın; yanıcı yalıtımı ocaktan uzak tutun ve havalandırmayı kapatmayın.',
    steps: [
      "Önce tavanı yalıtın. FAO örneğinde yalnız tavana konan 5 cm yalıtım evin ısı kaybını yaklaşık üçte bir azalttı.",
      "Kuru saman iyi yalıtır: 5 cm saman, 5 cm cam yününe yakın ısı tutar. Talaş ve kuru yaprak gibi gevşek dolgular daha zayıftır; daha kalın serin.",
      "Malzemeyi tamamen kuru kullanın. Islak saman ve yaprak ısı tutmaz, küflenir ve ahşabı çürütür.",
      "Açık saman kolay tutuşur ve fare yuvası olur. Samanı kil şerbetine bulayıp sıkıştırın (kil-saman) ya da üstünü çamurla sıvayın.",
      "Tavan kirişlerinin üstüne tahta ya da dal örgü döşeyin, üstüne kalın ve sıkıca bastırılmış bir kat saman ya da kil-saman serin, üstünü çamurla kapatın.",
      "Duvarı çift kat yapın: iki dal örgü ya da tahta kaplama arasına kuru saman doldurun.",
      "Duvara, kapı arkasına ve yere keçe ya da kilim asın, serin.",
      "Kapı, pencere ve kütük aralarındaki çatlakları yosun, kıtık ya da kille tıkayın; hava sızıntısı yalıtımı boşa çıkarır.",
      "Ocak, soba ve bacanın çevresinde saman, yaprak, keçe kullanmayın; bu yüzeyleri taş ya da kalın çamur sıvayla ayırın."
    ],
    art: ['sf-yp-yalitim-tavan', null, null, null, null, 'sf-yp-yalitim-cift-duvar', null, null, 'sf-yp-yalitim-baca'],
    dont: [
      "Saman ya da yaprak yalıtımı bacaya ve soba borusuna değdirmeyin; yangın çıkar.",
      "Evi havasız bırakacak kadar her deliği kapatmayın; ocak yanan odada karbonmonoksit birikir.",
      "Islak ya da küflü samanı yalıtımda kullanmayın."
    ],
    keywords: ['ev yalıtımı saman', 'doğal yalıtım', 'tavan yalıtımı', 'kil saman yalıtım', 'yün keçe yalıtım', 'evi sıcak tutmak', 'yalitim nasil yapilir', 'kuru yaprak yalıtım', 'çift duvar saman', 'soğuk evi ısıtmak yalıtım'],
    sources: [FAO_CLIMATE, FAO_EARTH, USFS_LOG, W_YURT, FAO_ROOF],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: FAO Climate (saman 0,042 W/mK, cam yünü 0,033, gevşek dolgular ~0,06; tavan yalıtım örneği 3220→2191 W), FAO Earth (kil-saman), USFS (yosun dolgu), FAO saz yangın riski."),
  },
  {
    id: 'sf-yp-bakim',
    category: 'sf-yp-yer',
    title: 'Yapı bakımı: nem, çürüme, böcek',
    tag: 'YAPI BAKIMI',
    summary: 'Evi yılda en az bir kez ve her büyük yağmur ya da depremden sonra gözden geçirin; suyu uzak tutun, çürük ve böceği erken yakalayın, aynı malzemeyle onarın.',
    steps: [
      "Yılda en az bir kez, ayrıca her büyük yağmur, kar ve depremden sonra evi çatıdan temele gözden geçirin.",
      "Çatıdan başlayın: kayan kiremit ve şındılı, delik sazı, çatlamış toprak damı hemen onarın. Yağmur sızıntısı en büyük çürütme nedenidir.",
      "Duvar diplerine bakın: alt sıralarda oyulma, kabarma, yosun ve küf yükselen nemi gösterir. Duvar dibindeki toprağı dışa eğimleyin, suyu evden uzaklaştırın.",
      "Ahşabı kuru tutun: nemi %20'nin altında kalan, havalanan ahşabı mantar çürütmez. Bıçak ucu kolayca batıyor ya da ahşap süngerimsi ise o parça çürümüştür.",
      "Böcek izlerini arayın: 2–3 mm delikler ve un gibi talaş kurt demektir; temelde ve duvarda topraktan yapılmış ince tüneller termit demektir.",
      "Ahşabın toprağa değdiği yerleri kaldırın. Odun ve dal yığınlarını duvardan uzaklaştırın.",
      "Çatlak kerpiç ve çamur sıvayı aynı malzemeyle onarın. Çimento sıva ve plastik boya nemi içeride hapseder, duvarı dipten çürütür.",
      "Dış çamur sıvayı kurak yerde yılda bir, nemli yerde iki kez ince bir kat çamur ya da kireç badanayla yenileyin.",
      "Kütük aralarındaki dolguyu her yıl kontrol edin; dökülenleri hava 10°C'nin üstündeyken, dondan önce yenileyin.",
      "Çürümüş direk ya da kirişi önce geçici dikmeyle destekleyin, sonra değiştirin. Çürük taşıyıcının altında oturmayın, yatmayın."
    ],
    art: [null, null, 'sf-yp-bakim-dip', 'sf-yp-bakim-curuk', null, null, null, null, null, 'sf-yp-bakim-dikme'],
    dont: [
      "Kerpiç ve toprak duvara çimento sıva vurmayın.",
      "Çürük taşıyıcı ahşabı \"bir kış daha dayanır\" diye bırakmayın; yük altında aniden kırılır.",
      "Çatı sızıntısını ertelemeyin; birkaç yağmurda duvarı ve kirişleri çürütür.",
      "Kerpiç duvar dibine su birikintisi ya da bahçe sulaması bırakmayın."
    ],
    keywords: ['ev bakımı', 'ahşap çürümesi', 'kerpiç duvar nem', 'termit belirtileri', 'tahta kurdu deliği', 'duvar dibi rutubet', 'yapı bakımı nasıl yapılır', 'cürük kiris', 'çatı akıtıyor onarım', 'kütük ev bakımı'],
    sources: [HF_LOG, FAO_TIMBER, ECHO, W_WOODPRES],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Henry Ford log bakım rehberi (yağmur en büyük neden, yıllık denetim, 2–3 mm delikler, termit tünelleri, çimento kullanmama, 10°C), FAO (%20 nem eşiği), ECHO (çamur sıva yılda 1–2 kat)."),
  },
  // ───────────── Toprak yapı ─────────────
  {
    id: 'sf-yp-toprak-testi',
    category: 'sf-yp-toprak',
    title: 'Toprak testi: kerpiçe uygun toprak',
    tag: 'TOPRAK TESTİ',
    summary: 'Bitkisel toprağın altından örnek alın; kavanoz, çubuk büzülme, top ve düşürme testleriyle kum-kil dengesini bulun, gerekirse kum ya da kil katın.',
    steps: [
      "Üstteki kara, kokulu bitkisel toprağı kaldırın (genelde 60 cm'den az). Örneği 0,8–1,5 m derinlikten, bir kova kadar alın.",
      "Koklayın ve ovalayın: küf kokusu organik madde demektir, kullanmayın. Islak toprak avuçta pürüzlüyse kumlu, yapışkan ve sabun gibi kayganlıksa killidir.",
      "Kavanoz testi: düz dipli şeffaf kavanozun üçte birini elenmiş toprakla, üçte ikisine kadar suyla doldurun. Bir tutam tuz katın, çalkalayın, 1 saat bekletip yeniden çalkalayın, en az 8 saat dinlendirin.",
      "Katları ölçün: altta kum, ortada silt, üstte kil. Kerpiç için kum %50–80, kil %10–30, kil ile silt toplamı %20–50 olmalıdır. Bu test kili olduğundan az gösterir.",
      "Çubuk büzülme testi: içi 4 × 4 cm, boyu 60 cm bir oluğu ıslak çamurla doldurun, gölgede 7 gün kurutun. Boy %10'dan çok kısalırsa (60 cm'de 6 cm) ya da uçlar dışında üçten fazla büyük çatlak varsa toprak tek başına uygun değildir.",
      "Top testi: yumurta büyüklüğünde top yapıp kurutun. İyi toprak sert kurur, yalnız kılcal çatlak verir. Geniş çatlak fazla kil, ufalanma fazla kum demektir.",
      "Deneme kerpici: 3–4 küçük kerpiç yapın, 2–4 hafta kurutun, yaklaşık 60 cm yükseklikten sert zemine bırakın. Kırılmıyorsa toprak uygundur.",
      "Çok killi toprağa kum, çok kumlu toprağa killi toprak katıp testleri yeniden yapın. Kil %30'u aşıyorsa çatlamayı önlemek için saman ekleyin."
    ],
    art: [null, null, null, 'sf-yp-test-katlar', 'sf-yp-test-cubuk', null, 'sf-yp-test-dusurme', null],
    dont: [
      "Kara bitkisel toprağı kerpiçte kullanmayın; çürür, böceklenir, dayanımı yoktur.",
      "Kuruyunca yüzeyinde beyaz tuz kabuğu bağlayan topraktan kaçının.",
      "Tek bir teste bakıp karar vermeyin; en az iki test ve bir deneme kerpici yapın."
    ],
    keywords: ['kerpiç toprağı nasıl seçilir', 'toprak testi kerpiç', 'kavanoz testi toprak', 'killi toprak nasıl anlaşılır', 'kerpice uygun toprak', 'toprak kil oranı', 'kerpic topragi', 'büzülme testi', 'çamur tuğla toprağı', 'toprakta kum kil oranı'],
    sources: [FAO_EARTH, NPS, ECHO, GHB],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: FAO Earth (örnek derinliği, kavanoz 1/3–2/3, 1+8 saat, kerpiç tane dağılımı, çubuk testi %10, top testi), NPS (koku, dokunma testi), ECHO (2 ft düşürme), GHB (kil >%30 çatlama)."),
  },
  {
    id: 'sf-yp-kerpic-1',
    category: 'sf-yp-toprak',
    title: 'Kerpiç 1: çamuru hazırlama',
    tag: 'KERPİÇ',
    summary: 'Testten geçmiş toprağı ayıklayın, suyla ayakla çiğneyin, kıyılmış saman katın ve bir gece dinlendirin.',
    note: NOTE_TOPRAK,
    steps: [
      "Toprak testinden geçmiş toprağı çukura yığın ya da yerinde 15 cm derinliğe kadar gevşetin. Taş, kök ve 2 cm'den iri çakılları ayıklayın.",
      "Temiz, kuru, küflenmemiş saman ya da kuru ot hazırlayın; kısa kıyın.",
      "Suyu azar azar katın ve topak kalmayana dek ayakla çiğneyerek karıştırın.",
      "Samanı çamura yavaş yavaş katıp çiğnemeye devam edin. Lif, toprağın ağırlıkça yaklaşık %4'ü kadar yeterlidir.",
      "Karışımı bir gece dinlendirin, ertesi gün yeniden çiğneyin. Dinlenmiş çamur daha düzgün işlenir ve az çatlar.",
      "Kıvamı deneyin: avuçta sıkınca biçimini korumalı, parmak arasından akmamalı. Kürekten hiç kaymıyorsa çok ıslak ya da çok killidir; kum katın.",
      "Kireç bulursanız ağırlıkça %4–14 kireç katmak kerpici suya daha dayanıklı yapar. Kireçli kerpici daha uzun süre nemli tutarak kurutun."
    ],
    art: [null, null, 'sf-yp-kerpic-cigneme', 'sf-yp-kerpic-saman', null, 'sf-yp-kerpic-kivam', null],
    dont: [
      "Küflü ya da çürük saman kullanmayın; kerpicin içinde çürür ve boşluk bırakır.",
      "Sönmemiş kireci gözlük ve eldivensiz karıştırmayın.",
      "Çamuru akacak kadar sulandırmayın; kalıptan çıkınca çöker ve çok çatlar."
    ],
    keywords: ['kerpiç nasıl yapılır', 'kerpiç çamuru', 'kerpiç saman oranı', 'kerpic camuru hazirlama', 'kerpiç karışımı', 'çamura saman katmak', 'kerpiç yapımı adım adım', 'kerpiç için çamur çiğneme'],
    sources: [FAO_EARTH, ECHO, GHB, Y1975],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: yapısal sayı yok; FAO/ECHO sayfaları yeniden okunmadı. Yazarın kaynakları: FAO Earth (15 cm gevşetme, ayakla çiğneme, lif ~%4, kireç %4–14), ECHO (topaklı karışımı bir gece dinlendirme), GHB (kürek kıvam testi), 1975 yönetmeliği (dinlendirilmiş kerpiç harcı)."),
  },
  {
    id: 'sf-yp-kerpic-2',
    category: 'sf-yp-toprak',
    title: 'Kerpiç 2: kalıplama ve kurutma',
    tag: 'KERPİÇ',
    summary: 'Islatılmış tahta kalıpla kerpiç dökün, kalıbı hemen çekin, 3–4 gün yatık, sonra dikine kurutup en az bir ay istifte bekletin.',
    note: NOTE_TOPRAK,
    steps: [
      "Tahtadan kalıp yapın. Eski deprem yönetmeliği kerpiç ölçüsünü 30 × 25 × 15 cm ve 30 × 15 × 15 cm verir. Bir kalıpta 1–3 göz olabilir. Kerpiç kururken büzülür; gözü birkaç mm büyük yapın.",
      "Düz, güneşli, su birikmeyen bir kurutma alanı hazırlayın; yere ince kum ya da saman serin ki kerpiç yapışmasın.",
      "Kalıbı ilk kullanımdan önce suya yatırın, her kerpiçten önce yeniden ıslatın.",
      "Çamuru kalıba fırlatarak doldurun, köşelere bastırın, üstünü ıslak tahta ya da elle sıyırarak düzleyin.",
      "Kalıbı hemen ve dikkatle düz yukarı çekin. Kerpiç sarkıp çöküyorsa çamur çok ıslaktır.",
      "Kerpiçleri 3–4 gün yatık kurutun. Çok sıcak günlerde üstlerini samanla örtün; hızlı kuruyan kerpiç çatlar. Yağmur gelirse örtün.",
      "Taşınacak kadar sertleşince kerpiçleri dikine (yan yatırarak) çevirin ve 10 gün daha böyle kurutun.",
      "Sonra aralıklı istifleyin (en çok 3–4 sıra) ve toplam en az bir ay kurutun. İstifin üstünü yağmurdan koruyun.",
      "Kuruluğu deneyin: bir kerpici kırın; ortası dışıyla aynı renkte ve kuru olmalı.",
      "Çatlak, kırık ve köşesi düşmüş kerpiçleri ayırın; iyi işçilikte her 10 kerpiçten biri kadar fire normaldir."
    ],
    art: ['sf-yp-kerpic-kalip', null, null, null, 'sf-yp-kerpic-cekme', null, 'sf-yp-kerpic-dikine', null, null, null],
    dont: [
      "Yarı kurumuş kerpiçle duvar örmeyin; yük altında ezilir, duvar oturur ve çatlar.",
      "Kerpiçleri doğrudan çamurlu, su toplayan yere dizmeyin.",
      "Yağmurda açıkta bırakmayın; kurumamış kerpiç erir."
    ],
    keywords: ['kerpiç kalıbı', 'kerpiç kurutma süresi', 'kerpiç ölçüsü', 'kerpic kalibi olculeri', 'kerpiç dökme', 'kerpiç kaç günde kurur', 'kerpiç tuğla yapımı', 'kerpiç istifleme'],
    sources: [FAO_EARTH, ECHO, GHB, Y1975, FSM],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: 1975 (11.3.2.2) kerpiç ölçüleri 30×25×15 ve 30×15×15 cm ile FSM tezindeki TS 2514 sınıfları (12 cm kalınlık) okundu: teyitli. Yazarın kaynakları: 1975 yönetmeliği (30×25×15, 30×15×15 cm), FSM tezi (TS 2514 sınıfları, 12 cm kalınlık), FAO Earth (3–4 gün, dikine + 10 gün, en az 1 ay, 1/10 fire, kalıbı ıslatma), ECHO (sıcakta örtme, 3–4 sıra istif, kırma testi), GHB (kalıbı hemen çekme)."),
  },
  {
    id: 'sf-yp-kerpic-duvar',
    category: 'sf-yp-toprak',
    title: 'Kerpiç duvar örme',
    tag: 'KERPİÇ',
    summary: 'Taş temel ve hatıl üstüne, kerpiç çamuruyla, şaşırtmalı ve köşelerde birbirine geçmeli örün; günde birkaç sıra yükselin, her seviyede hatıl koyun.',
    note: NOTE_TOPRAK,
    steps: [
      "Duvara yalnız topraktan en az 50 cm yükselen taş temelin, nem kesicinin ve temel hatılının üstünde başlayın.",
      "Kalınlık: dış duvar en az 1,5 kerpiç boyu ve en az 47 cm (30 cm'lik kerpiçle 1,5 boy 45 cm eder; yarım kerpiç ekleyip kalınlaştırın), iç taşıyıcı duvar en az 1 kerpiç boyu.",
      "Harç olarak dinlendirilmiş, samanlı kerpiç çamurunu kullanın. Derzler yaklaşık 1,5 cm kalınlıkta olsun; yatay ve düşey derzleri tam doldurun.",
      "Kerpiçleri şaşırtmalı dizin: üst sıradaki derz alttaki kerpicin ortasına gelsin. Köşelerde ve duvar kesişimlerinde sıraları birbirinin içine geçirerek örün.",
      "Günde 2–3 sıradan fazla örmeyin; alt sıraların harcı biraz sertleşsin.",
      "İp ve çekülle her sırada duvarın düzlüğünü ve düşeyliğini kontrol edin.",
      "Pencere altı, pencere üstü ve çatı altı hizalarında duvarı ahşap hatılla kuşatın: iki 10 × 10 cm kadron, her 50 cm'de bir enine bağ, arası taş kırığı. Hatıllar köşelerde birbirine bağlansın.",
      "Köşe ile ilk açıklık arasında ve iki açıklık arasında en az 1 m dolu duvar bırakın. Her açıklığın üstüne iki yanda en az 20 cm oturan lento koyun.",
      "Duvar bitince çatıyı hemen kapatın ya da duvar üstünü örtün; yağmur kerpici eritir."
    ],
    art: [null, 'sf-yp-kerpic-kalinlik', null, 'sf-yp-kerpic-sasirtma', null, null, 'sf-yp-kerpic-hatil', null, null],
    dont: [
      "Kerpici çimento harcıyla örmeyin; sertlik farkı çatlatır ve nem hapseder.",
      "Düz derzli (üst üste denk gelen) duvar örmeyin; derz boyunca yarılır.",
      "Hatılsız duvar yapmayın; depremde köşelerden ayrılıp devrilir.",
      "Kerpiç duvarın üstüne ikinci kat çıkmayın."
    ],
    keywords: ['kerpiç duvar örme', 'kerpiç duvar nasıl örülür', 'kerpiç harcı', 'kerpic duvar kalinligi', 'kerpiç hatıl', 'kerpiç ev duvarı', 'kerpiç köşe bağlantısı', 'kerpiç duvar yapımı'],
    sources: [Y1975, Y1998, ECHO, FAO_WALLS],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: 1975 Bölüm 11 (11.5.1 hatıl: iki 10×10 kadron, 50 cm'de bir bağ, taş kırığı; 11.4 hatıl yerleri) ve 1998 makalesi (1,5/1 kerpiç boyu, köşe ve açıklık arası 1 m, lento 20 cm) metinden okundu; FSM tezi TS 2515 deprem bölgesi duvarı 47 cm, 45 cm yerine 47 cm alt sınırı konuldu. ECHO (1/2 inç tam derz, günde 2–3 sıra)."),
  },
  {
    id: 'sf-yp-yigma-toprak',
    category: 'sf-yp-toprak',
    title: 'Yığma toprak duvar (cob)',
    tag: 'YIĞMA TOPRAK',
    summary: 'Samanlı çamur topaklarını taş temel üstüne bastırıp alttakiyle kaynaştırarak kat kat yükseltin; günde 60 cm\'den fazla çıkmayın, duvar kurumadan çatı bindirmeyin.',
    note: NOTE_TOPRAK,
    steps: [
      "Karışım: çakıl, kum, silt ve kili kabaca eşit oranda, bol kıyılmış samanla çiğneyin. Kıvam kerpiç çamurundan biraz daha katı olsun.",
      "Taş temeli topraktan en az 50 cm yükseltin, üstünü pürüzlü bırakın ve kil şerbeti (süzülmüş ince kil + su) sürün.",
      "Çamurdan yaklaşık 20 cm çapında topaklar yapıp duvara sıkıca bastırın. Topakları parmak ya da sopayla alttakine karıştırın; ayrı kalan katlar kuruyunca birbirinden ayrılır.",
      "Bir seferde en çok 60 cm yükseltin, günde 60 cm'yi geçmeyin. Duvar sarkmaya başlarsa durun.",
      "Ara verirken duvarın üstünü örtün ki nemli kalsın. Kurumuşsa üstünü ıslatıp sopayla dövün, sonra devam edin.",
      "Taşıyıcı dış duvarı kerpiç duvardan ince yapmayın: en az 47 cm. Yükseklik kalınlığın 6 katını ve 2,70 m'yi geçmesin; taşıyıcı duvarlar arası 4,5 m'yi geçmesin. Tek kat yapın.",
      "Kapı ve pencere tahta kasalarını yerine koyup çevresini örün. Kapı en çok 1,00 × 2,10 m, pencere en çok 0,90 × 1,20 m olsun; köşe ile ilk açıklık ve iki açıklık arasında en az 1 m dolu duvar bırakın.",
      "Duvar ıslakken yüzünü düzeltin; taşan yerleri testere ya da kürekle kesin. Kalın duvarın içi kurusun diye yanlardan parmak kalınlığında delikler açın, kuruyunca doldurun.",
      "Çatıyı ancak duvar kurulup sertleşince bindirin. Duvarın üstüne ahşap hatıl koyup çatıyı ona oturtun."
    ],
    art: [null, null, 'sf-yp-cob-topak', 'sf-yp-cob-kat', null, null, 'sf-yp-cob-kasa', null, null],
    dont: [
      "Katları kuru birleşme yüzeyiyle üst üste koymayın; duvar katmanlarından ayrılır.",
      "Islak duvara çatı yükü bindirmeyin; ezilip çöker.",
      "Duvarı yere değdirmeyin; taş temel olmadan dibi erir."
    ],
    keywords: ['cob duvar', 'yığma toprak duvar', 'çamur topak duvar', 'cob ev nasıl yapılır', 'yigma toprak', 'samanlı çamur duvar', 'kalıpsız toprak duvar', 'çamurdan ev yapmak'],
    sources: [FAO_EARTH, MEN_COB, CA_COB103, CA_COB105, Y1975, Y1998, FSM],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: California BK105 metni okundu: 10 inç (25 cm) en az kalınlık yalnız düşük deprem bölgesi içindir; donatısız yığma toprak duvar yalnız Seismic Design Category A'da serbest, B–C'de ankraj/donatı, üstünde mühendislik ister. Bu yüzden 25 cm kaldırıldı, kerpiç kuralları (47 cm, 2,70 m, 4,5 m, açıklık ölçüleri; 1975/1998) uygulandı. FAO Earth (eşit oranlar, 20 cm topak, ~60 cm kat), Mother Earth News (kil şerbeti, günde 60 cm) yazarın okumasıyla."),
  },
  {
    id: 'sf-yp-sikistirma-toprak',
    category: 'sf-yp-toprak',
    title: 'Sıkıştırma toprak duvar (kalıpla)',
    tag: 'SIKIŞTIRMA TOPRAK',
    summary: 'Kumlu, az nemli toprağı tahta kalıba 10 cm\'lik katlarla serip ağır tokmakla dövün; duvarı payanda, köşe dikmesi ve hatılla bağlayın.',
    note: NOTE_TOPRAK,
    steps: [
      "Toprak seçin: kum %35–80, kil %5–20, silt %10–30. Kerpiç toprağından daha kumludur. İri taşlar duvar kalınlığının dörtte birinden küçük olsun.",
      "1 cm'den iri çakılları eleyin, toprak topaklarını ezin.",
      "Nemi deneyin: bir avuç toprağı sıkın; sıkı bir topak olmalı ve hafifçe parlamalı. Döverken yüzeye su çıkıyorsa fazla ıslaktır.",
      "Kalıbı kurun: iki kalın tahta yüz, aralarında aralayıcı ve karşılıklı bağlayıcı çubuklar. Kalıp yüksekliği 50–70 cm olsun.",
      "Kalıba yaklaşık 10 cm gevşek toprak serin, 8–10 kg'lık tokmakla kalınlığı yarıya inene dek dövün. Tokmak sekmeye başlayınca kat tamamdır; sonra yeni kat serin.",
      "Kalıp dolunca sökün ve yan bölüme kaydırın. Düşey birleşim yerlerini alt sıradakilerle şaşırtın.",
      "Taşıyıcı dış duvarı kerpiç duvardan ince yapmayın (en az 47 cm) ve en geç her 4 m'de bir enine duvar ya da payandayla destekleyin. Tek kat, en çok 2,70 m yapın; açıklıklarda kerpiç kurallarına uyun.",
      "Köşelere ve açıklık kenarlarına ahşap dikme koyun; duvarın üstünü kesintisiz ahşap hatılla kuşatıp dikmeleri hatıla bağlayın.",
      "Katkısız duvarı yağmurdan örtün. Kireç ya da çimento kattıysanız duvarı 1–2 hafta nemli tutun."
    ],
    art: [null, null, 'sf-yp-sikistirma-avuc', null, 'sf-yp-sikistirma-tokmak', null, null, 'sf-yp-sikistirma-hatil', null],
    dont: [
      "Çok ıslak toprağı dövmeyin; sıkışmaz, kuruyunca çatlar.",
      "Kalıbı toprak tam sıkışmadan sökmeyin.",
      "Uzun, desteksiz duvar yapmayın; yanlamasına devrilir."
    ],
    keywords: ['sıkıştırma toprak duvar', 'kalıpla toprak duvar', 'rammed earth', 'toprak dövme duvar', 'sikistirma toprak', 'tokmakla duvar', 'toprak duvar kalıbı', 'kerpiçsiz toprak duvar'],
    sources: [FAO_EARTH, FAO_WALLS, BHU_RE, Y1998, FSM],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: Bhutan kılavuzu okundu (4 inç → 2 inç sıkıştırma, şaşırtma, köşe/kesişim/açıklık yanında düşey donatı, 60 cm genişlikte betonarme hatıl); sıkıştırma toprak için Türkiye'ye özgü kalınlık bulunamadı, FAO'nun 30 cm'si deprem için yetersiz sayılıp kerpiç kuralı (47 cm, 1975/1998, TS 2515) uygulandı. FAO Earth (tane dağılımı, 10 cm kat, 8–10 kg tokmak), FAO Walls (≤4 m destek) yazarın okumasıyla; Bhutan kılavuzu (1 cm eleme, 4 inç → 2 inç sıkışma, şaşırtma, köşe ve açıklık dikmeleri, hatıl)."),
  },
  {
    id: 'sf-yp-dal-orgu',
    category: 'sf-yp-toprak',
    title: 'Dal örgü ve çamur sıva duvar',
    tag: 'DAL ÖRGÜ',
    summary: 'Ahşap iskeletin arasına ince çubuklar koyup esnek dallarla örün, iki yandan samanlı çamurla sıvayın, kuruyunca kireç badanası sürün.',
    note: NOTE_TOPRAK,
    steps: [
      "Taş temel üstüne ahşap iskelet kurun (Ahşap iskelet rehberine bakın) ya da sağlam kazıkları sık aralıkla yere çakın.",
      "Dikmeler arasına 20–40 cm arayla ince düşey çubuklar yerleştirin: alt uçlarını alt kirişteki oyuğa, üst uçlarını üst kirişteki deliklere geçirin.",
      "Fındık, söğüt, kızılcık gibi taze kesilmiş, esnek ince dalları çubukların arasından bir önden bir arkadan geçirerek örün; her sırayı aşağı bastırın.",
      "Sıva çamurunu hazırlayın: killi toprak, kum, kıyılmış saman ya da hayvan kılı; isterseniz biraz taze inek gübresi. Ayakla çiğneyin.",
      "Çamuru avuçla örgüye iki yandan bastırın; çamur aralardan geçip öbür yandakiyle birleşsin.",
      "İlk katı pürüzlü bırakıp kurutun. Kuruma çatlaklarını ikinci, ince bir katla doldurun.",
      "Tamamen kuruyunca kireç badanası sürün; yağmura dayanımı artar.",
      "Toprağa gömülen kazıkların gömülü kısmını ateşte kömürleştirin ya da kazıkları taş üstüne oturtun."
    ],
    art: [null, 'sf-yp-dal-cubuk', 'sf-yp-dal-orme', null, 'sf-yp-dal-sivama', null, null, null],
    dont: [
      "Kuru, kırılgan dalla örmeyin; bükülmez ve kırılır.",
      "Tek seferde çok kalın çamur sürmeyin; kuruyunca büyük parçalar halinde düşer.",
      "Duvarın dibini toprağa değdirmeyin; nemle çürür."
    ],
    keywords: ['dal örgü duvar', 'çatma duvar', 'bağdadi duvar', 'çamur sıvalı örgü', 'dal orgu duvar nasil', 'söğüt dalı duvar', 'hımış dolgu örgü', 'çit örgü sıva'],
    sources: [W_WATTLE, FAO_WALLS, W_WOODPRES],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Wattle and daub (18–40 cm aralık, çubukların yerleşimi, fındık/söğüt, çamur bileşenleri, katlar, badana), FAO Walls (çamur-sırık duvar), Wikipedia Wood preservation (kömürleştirme)."),
  },
  {
    id: 'sf-yp-siva',
    category: 'sf-yp-toprak',
    title: 'Sıva: çamur, kireç, saman',
    tag: 'SIVA',
    summary: 'Toprak duvarı önce samanlı kaba çamurla, sonra ince çamur ya da 1:3 kireç sıvayla kaplayın; kireci birkaç gün nemli tutun, çimento kullanmayın.',
    steps: [
      "Duvarı hazırlayın: tozunu fırçalayın, gevşek parçaları kazıyın, yüzeyi hafifçe ıslatın ama sırılsıklam etmeyin.",
      "Kaba kat: kerpiç toprağı, bol kum ve kıyılmış samanı kerpiç çamurundan daha yumuşak karıştırın. Elle ya da malayla sürün, yüzü pürüzlü bırakın.",
      "Kaba kat kururken açılan çatlakları elle bastırın. Tam kuruyunca ince kata geçin.",
      "İnce kat: elenmiş killi toprak, ince kum ve çok ince kıyılmış saman ya da kıl. İnce sürün, ıslak malayla perdahlayın.",
      "Kireç sıva: 1 ölçü olgun kireç kaymağına 3 ölçü temiz kum katın; çatlamasın diye bir tutam hayvan kılı ekleyin.",
      "Kireç sıvayı ince katlar halinde sürün; kalın tek kat haftalarca yumuşak kalır.",
      "Kireç sıvayı birkaç gün kurumaktan koruyun: sabah-akşam ince su serpin, güneş, rüzgâr ve dondan örtün.",
      "Badana: kireç kaymağını suyla süt kıvamına açın, birkaç ince kat sürün.",
      "Dış çamur sıvayı kurak yerde yılda bir, nemli yerde iki kez yenileyin."
    ],
    art: [null, 'sf-yp-siva-kaba', null, null, 'sf-yp-siva-kirec', null, 'sf-yp-siva-nemleme', null, null],
    dont: [
      "Kerpiç ve toprak duvara çimento sıva vurmayın; nemi içeride hapseder, sıva kabuk gibi düşer.",
      "Islak kireçle gözlüksüz, eldivensiz çalışmayın; ıslak kireç yakıcıdır (pH 12). Göze kaçarsa bol temiz suyla uzun süre yıkayın.",
      "Donlu havada kireç sıva yapmayın."
    ],
    keywords: ['çamur sıva', 'kireç sıva nasıl yapılır', 'kerpiç duvar sıvası', 'samanlı sıva', 'kirec siva orani', 'badana yapımı', 'toprak sıva', 'duvar sıvama doğal'],
    sources: [BC_LIME, W_LPLASTER, HF_LOG, ECHO, W_WATTLE],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Building Conservation (1:3 kireç:kum, nemli tutma, dondan koruma), Wikipedia Lime plaster (at kılı, kalın kat yumuşak kalır, pH 12, birkaç gün nemli), Henry Ford (çimento kullanmama, hafif ıslatma), ECHO (yılda 1–2 kat)."),
  },
  {
    id: 'sf-yp-gomuk-ev',
    category: 'sf-yp-toprak',
    title: 'Toprak altı ve yarı gömük ev',
    tag: 'GÖMÜK EV',
    summary: 'En güvenlisi, duvarlarına dışarıdan toprak yığılmış yarı gömük evdir; toprağa değen duvarı kalın ve kemerli yapın, suyu ve havalandırmayı mutlaka çözün.',
    note: "Uzman gözetimi olmadan toprak altına ev yapmayın: toprak yükü ve yan basınç duvarları ve tavanı çökertebilir, depremde içeridekiler gömülür. Yalnız gerçek hayatta kalma durumunda, küçük, sığ ve kemerli yapın.",
    steps: [
      "Yer seçin: taban suyu yüksek, sızıntılı ve yapışkan killi yerden kaçının. Kumlu-çakıllı, iyi su süzen, güneye bakan yamaç en uygunudur.",
      "En az riskli biçim, evi zemin seviyesinde kurup duvarlarına dışarıdan toprak yığmaktır (set). Tümüyle gömük ev daha çok nem ve su sorunu çıkarır.",
      "Yamaca gömecekseniz önce kazdığınız yamacı istinat duvarıyla tutun. Yalnız güney yüzü açık kalsın.",
      "Toprağa değen duvar yandan itilir: kireç harçlı kalın taş duvar ya da kemer ve tonoz kullanın. Toprağı ahşapla tutmayın; toprağa değen korumasız ahşap yaklaşık 5 yılda çürür. Kerpiç ve kuru taş da olmaz: kerpiç ıslanıp erir, kuru taş itilip dağılır. Toprağı ancak duvar ve tavan bitip harç sertleşince yaslayın.",
      "Düz tavana toprak yüklemeyin. Tonoz, kubbe ya da en az 1/12 eğimli beşik çatı yapın. Ot tutması için çatıda 15 cm toprak yeter; fazlası yük ve çökme riskidir.",
      "Duvarların dışını su geçirmez yapın (katran, naylon, şişen kil). Duvar dibine çakıllı drenaj hendeği açın, yukarıdan gelen yüzey suyunu evin yanından çevirin.",
      "Havalandırma şarttır: karşılıklı en az iki baca ya da delik açın. Durgun hava küf, yoğuşma ve radon birikimi yapar.",
      "Çatı kirişlerini toprağın ıslak ve karlı ağırlığına göre sık ve kalın koyun: otlu toprak çatı yaklaşık 250 kg/m², karla 400–500 kg/m² gelir."
    ],
    art: [null, 'sf-yp-gomuk-set', null, null, 'sf-yp-gomuk-tonoz', null, 'sf-yp-gomuk-hava', null],
    dont: [
      "Gevşek, kumlu yamaca desteksiz oyuk açıp içine yerleşmeyin; çöker.",
      "Taban suyu yüksek ya da dere kenarındaki yere gömük ev yapmayın; su basar.",
      "İçeride havalandırmasız ateş yakmayın; karbonmonoksit birikir.",
      "Düz tahta tavana kalın toprak yığmayın."
    ],
    keywords: ['toprak altı ev', 'yarı gömük ev', 'yamaca gömülü ev', 'toprak ev sığınak', 'gomuk ev', 'yer altı barınak', 'toprak örtülü ev', 'hobbit ev yapımı', 'zemin altı ev'],
    sources: [W_EARTHSHELTER, W_SOD, FAO_FOUND],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: Wikipedia Earth shelter yeniden okundu (yan basınca dayanacak donatılı kâgir, işlenmemiş ahşap 5 yılda çürür, ahşap yalnız bir kat derinliğe kadar, 1:12, ~15 cm toprak, drenaj, yüksek taban suyu, havalandırma, radon, toprak çatı çökmesiyle ölüm vakası); Wikipedia Sod roof (250 kg/m², karla 400–500). Ahşapla toprak tutma tümden yasaklandı, kerpiç ve kuru taş uyarısı eklendi. Güvenli derinlik ve duvar kalınlığı için güvenilir sayı bulunamadı; sayı verilmedi."),
  },
  // ───────────── Ahşap ve taş yapı ─────────────
  {
    id: 'sf-yp-kutuk-secme',
    category: 'sf-yp-ahsap-tas',
    title: 'Kütük ev 1: kütük seçme ve kurutma',
    tag: 'KÜTÜK EV',
    summary: 'Düz gövdeli, eşit kalınlıkta ağaçları kışın kesin, kabuğunu hemen soyun ve yerden yüksekte, aralıklı dizip en az 6 ay kurutun.',
    note: NOTE_ORMAN,
    steps: [
      "Düz gövdeli, az dallı, kalınlığı uçtan uca az değişen ağaç seçin. Çam, köknar ve sedir en uygunudur.",
      "Ağaçları geç sonbaharda ya da kışın kesin: böcekler uykudadır ve kışın kesilen kütük kururken daha az çatlar.",
      "İnce uç çapı 25–30 cm olsun; bütün kütükler birbirine yakın kalınlıkta seçilsin.",
      "Kabuğu hemen soyun, dal topuzlarını gövdeyle düz kesin. Kabuk altı böcek ve çürüme yuvasıdır.",
      "Kütükleri yerden yüksekte, takozlar üstünde, aralarında 5–8 cm boşlukla tek sıra dizin. Eğri kütüğün kamburu yukarı baksın; ağırlığıyla düzelir.",
      "En az 6 ay kurutun. Yağmurdan örtün ama yanlarını havaya açık bırakın.",
      "Kapı ve pencere kasası için duvar kütüklerinden 5–8 cm daha kalın kütükler ayırın."
    ],
    art: ['sf-yp-kutuk-agac', null, null, 'sf-yp-kutuk-soyma', 'sf-yp-kutuk-istif', null, null],
    dont: [
      "Ağacı yatacağı yönü ve kaçış yolunu belirlemeden kesmeyin; devrilen gövde ve geri tepen kütük öldürür.",
      "Kütükleri toprağa doğrudan yığmayın; alttakiler çürür.",
      "Kabuğu soyulmamış yaş kütükle ev kurmayın; kurudukça büzülür, çatlar ve böceklenir."
    ],
    keywords: ['kütük ev yapımı', 'kütük seçimi', 'kütük kurutma', 'ağaç ne zaman kesilir', 'kutuk ev', 'log ev ağacı', 'kabuk soyma kütük', 'kütük kaç ay kurur', 'ahşap ev için ağaç'],
    sources: [USFS_LOG, FAO_POLES, FAO_TIMBER, AYM_ORMAN],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: orman notu AYM kararındaki 6831 md. 91 metniyle uyumlu; USFS sayıları yeniden okunmadı. Yazarın kaynakları: USFS Building with Logs (tür, geç sonbahar/kış kesimi, 10–12 inç uç çapı, soyma, 2–3 inç aralık, kambur yukarı, en az 6 ay, kasa 2–3 inç kalın), FAO (yağmurdan koruma, hava dolaşımı, %20 nem)."),
  },
  {
    id: 'sf-yp-kutuk-gecme',
    category: 'sf-yp-ahsap-tas',
    title: 'Kütük ev 2: köşe geçmeleri',
    tag: 'KÜTÜK EV',
    summary: 'Kütükleri taş temel üstüne kurun, köşeleri pergelle çizilen semer geçmeyle oyarak oturtun, ahşap çivilerle bağlayın ve kapı-pencere üstünde oturma payı bırakın.',
    note: NOTE_ORMAN,
    steps: [
      "Kütükleri taş temel ya da taş ayaklar üstüne kurun, asla toprağa oturtmayın. Temelde hava delikleri bırakın.",
      "Taban kütüklerinin alt yüzünü 5–8 cm genişliğinde düz yontun ki temel üstünde yuvarlanmasın.",
      "Ön-arka duvarlar ile yan duvarlar yarım kütük kayık yükselir: bir çift duvar yarım kütük yüksekten başlar.",
      "Semer geçme: üst kütüğü köşeye yerleştirin. Pergeli alttaki kütüğün yarı çapı kadar açın, üst kütüğün alt yüzüne oyuk çizgisini dört yandan çizin.",
      "Kütüğü çevirip çizgiye kadar balta ile oyun, oluklu keskiyle düzeltin. Oyuk hafif çukur olsun; ağırlık dış kenarlara binsin.",
      "Oyuğu üst kütüğün altına açın; yağmur suyu oyukta birikmesin.",
      "Kütüğü yerine oturtmadan önce alttakinin üstüne kuru yosun serin.",
      "Her köşeden yaklaşık 60 cm içeride ve her açıklığın yanında üst kütüğü alttakine kalın ahşap çiviyle (kavela) bağlayın; çivileri sıradan sıraya şaşırtın.",
      "Kapı ve pencere üstünde oturma payı bırakın: kapıda 6–10 cm, pencerede 4–8 cm. Kuru kütük duvar yaklaşık 6 ayda oturur."
    ],
    art: [null, null, null, 'sf-yp-gecme-pergel', null, 'sf-yp-gecme-oyma', null, null, 'sf-yp-gecme-oturma'],
    dont: [
      "Kapı ve pencere kasasını üstteki kütüğe sıkıca bağlamayın; duvar oturunca kasa ezilir.",
      "Oyuğu alttaki kütüğün üstüne açmayın; su toplar ve çürür.",
      "Kütük kaldırırken altında durmayın; iki kişiyle, rampa ve iple çalışın.",
      "Sobayı, ocağı ve bacayı kütük duvara yakın kurmayın: yanabilecek her şey ısı kaynağından en az 1 m uzakta olsun. Ocağın arkasını ve bacayı taş ya da kerpiçle örün, bacayı yılda bir temizleyin; kütük ev hızla yanar."
    ],
    keywords: ['kütük köşe geçmesi', 'semer geçme', 'kütük ev köşe birleşimi', 'kutuk gecme', 'kütük oyma', 'log ev köşe', 'kütük üst üste nasıl oturur', 'kavela çivi'],
    sources: [USFS_LOG, HF_LOG, USFA_HEAT, AYM_ORMAN],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: yangın uyarısı eklendi, USFA'dan (yanıcıları ısı kaynağından en az 3 ft ≈ 1 m uzak tut, baca yılda bir temizlik). Orman notu AYM kararındaki md. 91 metniyle (devlet ormanında izinsiz kesime hapis ve para cezası) uyumlu. Yazarın sayıları: USFS Building with Logs (temel ve havalandırma, 2–3 inç düz yüz, yarım kütük fark, pergel yarı çap, çukur oyuk, yosun, 2 ft pim, oturma payları, ~6 ay), Henry Ford (kütük toprağa değmesin)."),
  },
  {
    id: 'sf-yp-kutuk-doldurma',
    category: 'sf-yp-ahsap-tas',
    title: 'Kütük ev 3: kütük aralarını doldurma',
    tag: 'KÜTÜK EV',
    summary: 'Aralara önce yosun, geniş yerlere ahşap kama, üstüne esnek kil-saman dolgu koyun; çimento ve tel kullanmayın, her yıl yenileyin.',
    steps: [
      "Kütükleri dizerken aralara kuru yosun ya da kıtık serin; en iyi dolgu baştan konandır.",
      "Geniş aralıkları önce yarılmış ince ahşap kamalar ya da ince sırıklarla doldurup çivileyin.",
      "Üstünü yumuşak dolguyla kapatın: kil, kum ve kıyılmış saman ya da kıl karışımı.",
      "Dolgudan önce aralığı hafifçe ıslatın, sırılsıklam etmeyin.",
      "Dolgu esnek kalmalı ve kütükten sert olmamalıdır. Bu yüzden çimento harcı kullanmayın.",
      "İşi hava 10°C'nin üstündeyken ve dondan önce bitirin.",
      "Dolguyu her yıl kontrol edin; çatlayan ve dökülen yerleri aynı karışımla yenileyin."
    ],
    art: ['sf-yp-doldurma-yosun', 'sf-yp-doldurma-kama', 'sf-yp-doldurma-sivama', null, null, null, null],
    dont: [
      "Aralara çimento harcı doldurmayın; kütük oynadıkça çatlar, nemi hapseder.",
      "Dolguyu tutsun diye tel ya da tavuk teli çakmayın; dolgu dökülünce açıkta kalır.",
      "Donlu havada dolgu yapmayın."
    ],
    keywords: ['kütük arası doldurma', 'kütük ev çatlak', 'kütük aralığı yosun', 'kutuk arasi dolgu', 'kütük ev rüzgar alıyor', 'kil dolgu kütük', 'kütük ev yalıtımı'],
    sources: [HF_LOG, USFS_LOG],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Henry Ford (kil ve kıtık, ince sırık dolgu, hafif ıslatma, çimento ve tel yok, 10°C, yıllık yenileme), USFS (yosun, sırık dolgu)."),
  },
  {
    id: 'sf-yp-harcsiz-tas',
    category: 'sf-yp-ahsap-tas',
    title: 'Harçsız taş duvar (kuru duvar)',
    tag: 'TAŞ DUVAR',
    summary: 'Sağlam zemine büyük taşlarla temel atın, iki yüzü birlikte örün, arayı küçük taşla doldurun, düzenli bağlayıcı taş koyun ve duvarı yukarı doğru inceltin.',
    steps: [
      "Taşları ayırın: en büyükler temele, uzun olanlar bağlayıcı taşa, küçükler dolguya, geniş ve ağır olanlar tepeye.",
      "Bitkisel toprağı kaldırıp sert ve düz zemine ulaşana dek kazın; genellikle 7,5–15 cm yeterlidir.",
      "Temele en büyük taşları koyun. Her biri duvar genişliğinin en az üçte birine uzansın ve yüzden 5–10 cm dışarı taşsın.",
      "İki yüzü aynı anda örün. Taşları uzun kenarı duvarın içine doğru yatacak biçimde koyun; her taş alttaki iki taşın arasındaki derzi kapatsın.",
      "İki yüzün arasını küçük taşlarla sıkıca doldurun; boşluk bırakmayın.",
      "Duvarı yukarı doğru iki yandan eşit inceltin (şev). İp ve şablonla şevi her sırada kontrol edin.",
      "Yerden yaklaşık 50 cm ve 1 m yükseklikte, 90 cm arayla duvarın tüm genişliğini geçen bağlayıcı taşlar koyun; yüzden en çok 5–7,5 cm taşsın.",
      "Tepeyi geniş, ağır taşlarla kapatın; tepe taşları alttakileri yerinde tutar.",
      "Harçsız duvarı bahçe, çit ve seki için kullanın. İçinde yaşanan evin taşıyıcı duvarını harçsız yapmayın."
    ],
    art: [null, null, null, 'sf-yp-kuru-dizme', null, 'sf-yp-kuru-sev', 'sf-yp-kuru-baglayici', null, null],
    dont: [
      "Taşları uzun kenarı duvar boyunca, ince yüzü içe gelecek biçimde koymayın; duvar kolayca dağılır.",
      "Düz derz (üst üste denk gelen derz) bırakmayın.",
      "Ağır taşı belden eğilerek kaldırmayın; dizden çömelin, gerekirse kaldıraç kullanın. Parmaklarınızı iki taş arasına sokmayın.",
      "Yüksek kuru duvarın dibinde çocuk oynatmayın."
    ],
    keywords: ['harçsız taş duvar', 'kuru taş duvar', 'taş duvar nasıl örülür', 'harcsiz tas duvar', 'bahçe taş duvarı', 'sekiler taş duvar', 'tarla duvarı', 'taş çit'],
    sources: [PEAK, FAO_WALLS, Y1975],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Peak District (7,5–15 cm hendek, temel taşı 1/3 genişlik ve 5–10 cm taşma, bağlayıcı taş 0,5 m ve 1 m'de 90 cm arayla, 5–7,5 cm taşma, dolgu, şev), FAO (bağlayıcı taş), 1975 yönetmeliği (ev temeli harçlı)."),
  },
  {
    id: 'sf-yp-kirec',
    category: 'sf-yp-ahsap-tas',
    title: 'Kireç yakma ve söndürme',
    tag: 'KİREÇ',
    summary: 'Kireç taşını ocakta günlerce yaklaşık 900–1000°C\'de pişirin, soğuyunca suyla söndürüp kireç kaymağı yapın; harç için 1 ölçü kaymağa 3 ölçü kum katın.',
    note: "Uzman gözetimi olmadan kireç ocağı yakmayın ve sönmemiş kireçle çalışmayın: sönmemiş kireç suyla kaynar, gözü kör edebilir, deriyi yakar; ocak çevresinde duman ve karbonmonoksit birikir.",
    steps: [
      "Taşı seçin: saf kireç taşı ya da mermer kullanın. Üstüne sirke damlatınca köpürmelidir.",
      "Ocağı kurun: yamaca kazılmış ya da taştan örülmüş, altında ateşliği olan bir kuyu. Taşı küçük parçalara kırıp yakıtla kat kat dizin; üstünü kille sıvayıp ısıyı tutun.",
      "Ateşi günlerce sürdürün. Taşın 900°C'nin üstüne çıkması gerekir; parlak kırmızı-turuncu kor gibi görünmelidir. Ateşi düşürmeyin.",
      "Ocağı soğumaya bırakın, sonra boşaltın. İyi pişmiş taş belirgin biçimde hafifler, kolay kırılır, içi beyazdır. Ortası sert ve gri kalanlar az pişmiştir; ayırın.",
      "Söndürmeden önce gözlük, eldiven ve uzun kollu giysi giyin. Sönmemiş kireci açık bir tekneye ya da çukura koyup üstüne yavaş yavaş su dökün. Karışım kaynar, buhar ve sıçrama yapar; geri çekilin.",
      "Suyu karışım koyu bir hamur olana dek azar azar ekleyip karıştırın; birkaç dakikada parlak beyaz bir kaymağa döner.",
      "Kireç kaymağını çukurda, üstünde bir kat su kalacak biçimde saklayın. Havayla değmedikçe bozulmaz, bekledikçe iyileşir.",
      "Harç: 1 ölçü kireç kaymağına 3 ölçü temiz, keskin kum. Badana: kaymağı suyla süt kıvamına açın.",
      "Kireç harcını ve sıvayı birkaç gün kurumaktan ve dondan koruyun. Kireç havadan karbondioksit alarak aylar içinde sertleşir."
    ],
    art: [null, 'sf-yp-kirec-ocak', null, 'sf-yp-kirec-tas', 'sf-yp-kirec-sondurme', null, null, null, null],
    dont: [
      "Sönmemiş kireci kapalı kapta ıslatmayın; ısınıp iki katından fazla şişer, kabı patlatabilir.",
      "Sönmemiş kireci nemli yerde ya da çocukların erişebileceği yerde saklamayın.",
      "Göze kireç kaçarsa ovuşturmayın; hemen bol temiz suyla uzun süre yıkayın.",
      "Ocağın dumanını solumayın; rüzgârın arkasında durun."
    ],
    keywords: ['kireç nasıl yapılır', 'kireç yakma', 'kireç ocağı', 'kireç söndürme', 'kirec kaymagi', 'sönmemiş kireç', 'kireç harcı oranı', 'kireç taşı pişirme', 'kireç badana yapımı'],
    sources: [W_KILN, BALL_LIME, FAO_BRICK, BC_LIME, W_LPLASTER],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Lime kiln (900°C, ~1000°C hızlı, katmanlı ocak, günlerce), Ballenberg (kil örtülü açık ocak, birkaç gün, söndürme, su altında saklama), FAO (900–1100°C), Building Conservation (1:3, 2,1–2,7 kat genleşme, nemli tutma)."),
  },
  {
    id: 'sf-yp-tas-duvar',
    category: 'sf-yp-ahsap-tas',
    title: 'Harçlı taş duvar',
    tag: 'TAŞ DUVAR',
    summary: 'Taşıyıcı taş duvarı kireç harcıyla, en az 50 cm kalın, bağlayıcı taşlı ve sık hatıllı örün; açıklıkları köşeden uzak ve küçük tutun.',
    note: "Uzman gözetimi olmadan taşıyıcı taş duvarlı ev yapmayın: moloz taş yığma yapılar depremde ağır hasar görür. Yalnız gerçek hayatta kalma durumu için tek katlı, hatıllı ve hafif çatılı yapın.",
    steps: [
      "Taşıyıcı taş duvarı en az 50 cm kalın yapın. Taşıyıcı duvarlar arası 5,5 m'yi geçmesin; ara duvar ya da payanda koyun.",
      "Harç: çimento bulursanız 1 ölçü çimento, 2 ölçü kireç kaymağı, 9 ölçü kum. Yoksa 1 ölçü kireç kaymağı, 3 ölçü kum; içine ince öğütülmüş pişmiş tuğla tozu (puzolan) katmak dayanımı artırır.",
      "Taşları örmeden önce ıslatın; kuru taş harcın suyunu emer.",
      "İki yüzü taşla örün, araları harç ve küçük taşla tamamen doldurun.",
      "Her metrekare duvar yüzünde en az bir bağlayıcı taş koyun; duvar kalınlığının dörtte üçüne kadar uzansın.",
      "Her 30–45 cm yükseklikte sırayı yatay düzleyin.",
      "Köşelere en büyük ve en düzgün taşları koyun; köşede iki duvarın taşlarını sırayla birbirine geçirin.",
      "Her döşeme ve çatı hizasında evin çevresini dolaşan ahşap ya da betonarme hatıl koyun. Moloz taş duvarda iki hatıl arası 1,5 m'yi geçmesin.",
      "Köşe ile ilk açıklık arasında en az 1,5 m, iki açıklık arasında en az 1 m dolu duvar bırakın. Bir duvardaki açıklıkların toplamı duvar boyunun %40'ını geçmesin.",
      "Harcı birkaç gün nemli tutun, dondan koruyun."
    ],
    art: [null, null, null, null, 'sf-yp-tasd-baglayici', null, null, 'sf-yp-tasd-hatil', 'sf-yp-tasd-bosluk', null],
    dont: [
      "Yuvarlak dere taşlarını düzeltmeden taşıyıcı duvarda kullanmayın; yük altında kayar.",
      "İki yüzü ayrı, arası gevşek dolgu bırakılmış duvar yapmayın; depremde ortadan ayrılır.",
      "Ağır toprak damı taş duvarın üstüne bindirmeyin.",
      "Taş duvarın üstüne ikinci kat çıkmayın."
    ],
    keywords: ['taş duvar örme', 'harçlı taş duvar', 'moloz taş duvar', 'taş ev duvarı', 'tas duvar nasil orulur', 'kireç harçlı duvar', 'taş ev yapımı', 'bağlayıcı taş', 'yığma taş ev deprem'],
    sources: [FAO_WALLS, Y1975, Y1998, BC_LIME, FAO_BRICK],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: 1975 Bölüm 9 metinden okundu: doğal taş duvar en az 50 cm (9.3.2), köşe 1,5 m (en riskli bölge), açıklıklar arası 0,80 m, toplam açıklık %40, açıklık en çok 3 m, lento 20 cm ve %15, moloz taşta 1,5 m'de bir hatıl, enine duvar aralığı en riskli bölgede 5,5 m. 1998 makalesi: 1/2/9 çimento takviyeli kireç harcı, hatıl 1,5 m. Uludağ Üniv. makalesi TBDY 2018 md. 11.5.1 yığma duvar etkin kalınlık alt sınırını 24 cm veriyor. 30 cm seçeneği kaldırıldı, açıklık arası 1 m (kerpiçteki tutucu değer) eklendi."),
  },
  {
    id: 'sf-yp-ahsap-iskelet',
    category: 'sf-yp-ahsap-tas',
    title: 'Ahşap iskelet: direk, kiriş, çapraz',
    tag: 'AHŞAP İSKELET',
    summary: 'Taş temel üstüne taban kirişi, dikmeler ve başlık kirişi kurun; her panele iki yönde çapraz koyun, arasını hafif dolguyla doldurun (hımış).',
    steps: [
      "İskeleti taş temele oturtun; temel topraktan en az 15 cm, mümkünse daha yüksek olsun. Ahşap toprağa değmesin.",
      "Taban kirişini temel boyunca döşeyin, köşelerde geçmeyle birleştirin.",
      "Köşelere ve aralara dikmeler koyun; dikmelerin alt ucunu zıvana (dil) yapıp taban kirişindeki yuvaya geçirin.",
      "Zıvanalı birleşimleri delip ahşap çiviyle (kavela) sabitleyin.",
      "Dikmelerin üstüne başlık kirişini (üst kuşak) aynı yöntemle bağlayın; tavan ve çatı kirişleri buna oturur.",
      "Her duvar panelinde, köşelerde ve kapı-pencere yanlarında yaklaşık 45° eğik çapraz (payanda) koyun. Çaprazsız iskelet yanlamasına yatar.",
      "Çaprazları iki yöne koyun, biri sağa biri sola yatsın; iskelet iki yönden gelen itmeye de dayansın.",
      "Dikmeler arasını dal örgü-çamur, kerpiç ya da taşla doldurun (hımış). Dolgu hafif olsun ve iskelete sıkıca otursun.",
      "Ahşabı kurutulmuş (nemi %20'nin altında) kullanın; yaş kerestede birleşimler kurudukça gevşer."
    ],
    art: [null, null, 'sf-yp-iskelet-dikme', null, null, 'sf-yp-iskelet-capraz', null, 'sf-yp-iskelet-himis', null],
    dont: [
      "Dikmeleri doğrudan toprağa gömmeyin; dipten çürür.",
      "Çaprazı tek panele, tek yöne koyup bırakmayın.",
      "Dolguyu iskeletten ağır ve kalın yapmayın; depremde dolgu düşer."
    ],
    keywords: ['ahşap iskelet ev', 'hımış yapı', 'himis ev', 'ahşap karkas', 'direk kiriş çapraz', 'payanda nedir', 'zıvanalı geçme', 'ahşap ev çatkısı', 'bağdadi iskelet'],
    sources: [W_TIMBER, FAO_FOUND, FAO_TIMBER, W_WATTLE],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Timber framing (taş temel, taban kirişine zıvana, ahşap çivi, başlık kirişi, 45° çapraz, dolgu türleri, deprem davranışı), FAO (temel 150 mm üstü, %20 nem)."),
  },
  {
    id: 'sf-yp-merdiven',
    category: 'sf-yp-ahsap-tas',
    title: 'Merdiven ve basit iskele',
    tag: 'MERDİVEN',
    summary: 'Sağlam sırık ve geçmeli basamakla merdiven yapın; 1\'e 4 açıyla dayayın, çıkacağınız yerin 1 m üstüne uzatın, tepesini bağlayın ve üç noktadan tutunun.',
    note: "Uzman gözetimi olmadan yüksekte çalışmayın: merdiven ve iskeleden düşmek kırık ve kafa yaralanmasına yol açar. Yalnız çalışmayın.",
    steps: [
      "İki düz, çatlaksız, sağlam sırık seçin; kabuğunu soyup kurutun.",
      "Basamakları eşit aralıkla koyun: sırıklara delik ya da oyuk açın, basamak uçlarını sıkı geçirip ahşap çiviyle sabitleyin. Basamağı yalnız yüzeye çivilemeyin.",
      "Merdiveni 1'e 4 kuralıyla dayayın: merdivenin ayağı, dayandığı noktanın uzunluğunun dörtte biri kadar duvardan uzakta olsun.",
      "Merdiven, çıkacağınız yerin en az 1 m üstüne uzansın.",
      "Ayakları düz, sağlam zemine koyun. Tepesini iple bağlayın; bağlayamıyorsanız biri alttan tutsun.",
      "Çıkarken her an üç noktanız merdivende olsun: iki el bir ayak ya da iki ayak bir el. En üstteki üç basamağa basmayın.",
      "Her kullanımdan önce basamakları ve sırıkları kontrol edin; çatlayanı hemen ayırın.",
      "Basit iskele: iki sağlam sehpa ya da çatal ayak arasına kalın kalas koyun, kalası ayaklara bağlayın. Yükseldikçe ayakları çaprazlarla birbirine bağlayın."
    ],
    art: [null, 'sf-yp-merdiven-basamak', 'sf-yp-merdiven-aci', null, null, 'sf-yp-merdiven-uc-nokta', null, null],
    dont: [
      "Merdiveni çok dik ya da çok yatık dayamayın; ya geriye devrilir ya ayağı kayar.",
      "Merdivende uzanıp yana eğilmeyin; inip merdiveni kaydırın.",
      "Elinizde ağır yükle merdivene çıkmayın; yükü iple çekin.",
      "Islak, buzlu ya da çamurlu basamağa basmayın."
    ],
    keywords: ['merdiven yapımı', 'ahşap merdiven nasıl yapılır', 'merdiven açısı', 'merdiven güvenliği', 'el merdiveni', 'basit iskele', 'merdiven dayama açısı', 'iskele kurmak', 'cati merdiveni'],
    sources: [OSHA_LADDER, W_LADDER, W_TIMBER],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: OSHA değerleri (1/4 kuralı, 3 ft ≈ 0,9 m uzantı → 1 m yazılmış, tutucu) tutarlı; sayfa yeniden açılmadı. Yazarın kaynakları: OSHA ladder quick card (1/4 uzaklık, 3 ft uzantı, üç nokta, en üst üç basamak, her kullanım öncesi kontrol, bağlama), Wikipedia Ladder (tepeyi bağlama, alttan tutma son çare)."),
  },
  // ───────────── Çatı, kapı ve ek yapılar ─────────────
  {
    id: 'sf-yp-cati-egim',
    category: 'sf-yp-cati',
    title: 'Çatı: eğim ve su atma',
    tag: 'ÇATI',
    summary: 'Örtüye göre doğru eğimi seçin, makası hatıla bağlayın, saçakla ve taşan örtüyle suyu duvardan uzağa atın.',
    steps: [
      "Örtüye göre eğim seçin: saz ve ot en az 45°, ahşap şındıl en az 35°, el yapımı düz kiremit en az 40°, tek bindirmeli kiremit en az 30°. Toprak dam yalnız kurak yerde, yaklaşık 6° eğimle.",
      "Eğimi ölçün: 45° için her 1 m yatayda 1 m, 40° için 84 cm, 35° için 70 cm, 30° için 58 cm yükselin.",
      "Makas kurun: iki eğik mertek tepede birleşsin, alt uçları bir yatay bağ kirişiyle birbirine bağlansın. Bu üçgen, çatının duvarları dışa itmesini önler.",
      "Makasları duvar üstündeki hatıla oturtun ve çivi, kama ya da bağla sabitleyin.",
      "Saçakla suyu duvardan uzak atın. Kerpiç ve toprak duvarlı evde saçak yaklaşık 50 cm olsun: 1975 yönetmeliği en az 50 cm, 1998 yönetmeliği en çok 50 cm der.",
      "Örtü, mertek ucunu ya da alın tahtasını en az 5 cm aşsın; damla duvara değil yere düşsün.",
      "Çatının her noktasında en az iki kat örtü olsun; bindirmeler yetersizse çatı sızdırır.",
      "Damlanın düştüğü yere taş ya da çakıl şerit koyup suyu evden uzaklaştırın."
    ],
    art: ['sf-yp-cati-egimler', null, 'sf-yp-cati-makas', null, 'sf-yp-cati-sacak', null, null, null],
    dont: [
      "Makasın alt bağ kirişini atlamayın; çatı duvarları dışa iter, duvar yarılır.",
      "Kerpiç evde ağır çatı örtüsü kullanmayın; depremde duvarları devirir.",
      "Örtünün önerilenden yatık serilmesine izin vermeyin; su geri kaçıp sızar."
    ],
    keywords: ['çatı eğimi', 'çatı kaç derece olmalı', 'çatı makası', 'saçak nasıl yapılır', 'cati egimi hesaplama', 'çatıdan su sızıyor', 'mertek bağ kirişi', 'çatı yapımı basit'],
    sources: [FAO_ROOF, Y1975, Y1998, FAO_WALLS, FAO_CONC],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: FAO Roofing metni okundu (saz 1:1, şındıl 35°, düz kiremit 40°, tek bindirmeli 30°, çamur dam yalnız kurakta 6°, 50 mm taşma, iki kat örtü). 1975 (11.6.1 saçak en az 0,50 m, hafif çatı) ile 1998 (saçak en çok 50 cm) çelişiyor; ikisini de karşılayan ~50 cm yazıldı. Ayrıca 1975/1998 (hatıla oturma), FAO Walls (toprak duvarda saçak ~0,6 m), FAO (sıçrama şeridi); eğim boyları tanjanttan hesaplandı."),
  },
  {
    id: 'sf-yp-toprak-dam',
    category: 'sf-yp-cati',
    title: 'Toprak damlı çatı',
    tag: 'TOPRAK DAM',
    summary: 'Yeni ev için toprak dam yapmayın; ağır dam depremde duvarları devirip çöker. Var olan damı en çok 15 cm toprakla tutun, silindirleyin, karını küreyin.',
    note: "Uzman gözetimi olmadan toprak dam yapmayın: ağır toprak dam depremde duvarları devirip içeridekilerin üstüne çöker. 1975 ve 1998 yönetmelikleri toprak damı en riskli bölgelerde yasaklar, diğerlerinde toprağı 15 cm ile sınırlardı; bu bilgi yalnız var olan damın bakımı ve gerçek hayatta kalma durumu içindir.",
    steps: [
      "Yeni yapıya toprak dam yapmayın, hafif ahşap çatı yapın: bir yerin deprem riskinin düşük olduğunu sahada anlayamazsınız. Aşağıdaki adımlar var olan bir damın onarımı içindir; başka çatı malzemesi hiç yoksa yalnız kurak yerde, küçük, tek katlı ve hatıllı yapıda uygulayın.",
      "Kalın ahşap kirişleri sık aralıkla duvar üstündeki hatıla oturtun ve uçlarını hatıla bağlayın.",
      "Kirişlerin üstüne sırık ya da kamış, onun üstüne çalı, saz ya da ot serin ki toprak aşağı dökülmesin.",
      "Su yalıtımı için naylon ya da kat kat ağaç kabuğunu balık pulu gibi bindirerek saçaktan tepeye doğru serin.",
      "Killi toprağı nemlendirip serin ve sıkıştırın. Toprak kalınlığı 15 cm'yi geçmesin.",
      "Dama her 10 m'de yaklaşık 1 m eğim verin; su bir kenarda toplanıp oluktan (çörten) duvardan uzağa atılsın.",
      "Saçak kenarına toprağı tutacak bir kütük ya da taş sırası koyun.",
      "Her yağmurdan sonra damı silindir taşıyla (loğ taşı) yuvarlayıp çatlakları kapatın. Kışın karı biriktirmeden küreyin; ıslak toprak ve kar damı çok ağırlaştırır."
    ],
    art: ['sf-yp-dam-yasak', null, null, null, 'sf-yp-dam-katlar', null, null, 'sf-yp-dam-log'],
    dont: [
      "Damın üstüne her yıl yeni toprak ekleyip kalınlaştırmayın.",
      "Çürümüş, sarkmış kirişin altında yaşamayın; damı boşaltıp kirişi değiştirin.",
      "Damda kar biriktirmeyin."
    ],
    keywords: ['toprak dam', 'düz toprak çatı', 'loğ taşı', 'toprak dam nasıl yapılır', 'toprak dam akıtıyor', 'toprak cati', 'köy evi toprak dam', 'dam silindiri'],
    sources: [Y1975, Y1998, FAO_ROOF, W_SOD],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: 1975 (11.6.2) ve 1998 makalesi metinden okundu: 1.–2. derece bölgede yasak, 3.–4. derecede ≤15 cm. Eski bölge sistemi artık kullanılmadığından ve okuyucu riski sahada bilemeyeceğinden yeni yapıda tümden 'yapmayın' denildi. FAO Roofing (yerinde çamur dam yalnız kurak iklimde, en az 6°, 1:10), Wikipedia Sod roof (15 cm yeter, 20 cm üstü gereksiz ağırlık, 250 kg/m², karla 400–500 kg/m²) okundu."),
  },
  {
    id: 'sf-yp-saz-cati',
    category: 'sf-yp-cati',
    title: 'Saz ve kamış çatı',
    tag: 'SAZ ÇATI',
    summary: 'Uzun, kuru kamış ya da sap demetlerini en az 45° eğimli çatıya saçaktan başlayarak bindirip bağlayın; kalınlık 15–20 cm olsun, tepeyi sıkıca kapatın.',
    note: "Saz çatı çok kolay tutuşur. Ocak ve bacayı sazdan güvenle ayırmadan altında ateş yakmayın; evin yanında her zaman su bulundurun.",
    steps: [
      "Kamış, saz ya da çavdar-buğday sapı toplayın. Uzun, düz, kuru, olgun sapları seçin; aynı boyda demetler bağlayın.",
      "Çatı eğimini en az 45° yapın. Daha dik çatı daha az sızdırır ve daha uzun dayanır.",
      "Merteklerin üstüne sık aralıkla yatay çıtalar (lata) bağlayın.",
      "Saçaktan başlayın: demetleri dipleri aşağıda olacak biçimde yan yana dizip çıtaya bağlayın ya da üstten bir sırıkla bastırıp bağlayın.",
      "Her yeni sırayı alttakinin üstüne bindirerek yukarı çıkın. Yeni örtünün kalınlığı 15–20 cm olsun; zamanla oturup incelir.",
      "Tepeyi (mahya) kil, ot ya da büküp bağladığınız demetlerle sıkıca kapatın; su tepeden girmesin.",
      "Bacayı sazın epey üstüne çıkarın ve sazla değdiği yeri çamurla sıvayın.",
      "Seyrelen ve çöken yerlere yeni demet sokarak çatıyı her yıl onarın."
    ],
    art: [null, 'sf-yp-saz-egim', null, 'sf-yp-saz-dizme', 'sf-yp-saz-bindirme', null, null, null],
    dont: [
      "Yeşil, nemli sap kullanmayın; çürür ve küflenir.",
      "Saz çatı altında kıvılcım tutucusuz soba ya da ocak yakmayın.",
      "Yatık (45°'den az) saz çatı yapmayın; su içeri işler."
    ],
    keywords: ['saz çatı', 'kamış çatı', 'sazdan dam', 'saz cati nasil yapilir', 'sap çatı', 'ot çatı örtüsü', 'kamış örtü kalınlığı', 'saz dam'],
    sources: [FAO_ROOF, FAO_ORGANIC],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: FAO Roofing metni okundu, ot saz en az 1:1 (45°), yeni kat 15–20 cm, yangın riski çok yüksek: teyitli. Yazarın kaynakları: FAO Roofing (ot sazda en az 1:1 = 45°, tercihen daha dik; yeni kat 15–20 cm; çok yüksek yangın riski), FAO Organic materials (saz ve kamış dayanımı)."),
  },
  {
    id: 'sf-yp-sindil',
    category: 'sf-yp-cati',
    title: 'Ahşap kiremit (şındıl)',
    tag: 'ŞINDIL',
    summary: 'Düz lifli öz odundan şındılları rendeyle yarın; en az 35° eğimli çatıya, her noktada üç kat olacak biçimde şaşırtmalı dizip tek çiviyle çakın.',
    steps: [
      "Düz lifli, budaksız, dayanıklı ağaç seçin: çam, ladin, sedir, kestane. Yalnız öz odunu (koyu renkli iç kısım) kullanın; dış diri odun çabuk çürür.",
      "Gövdeyi 60–90 cm boyunda kütüklere kesin, sonra çeyreklere ayırın.",
      "Rendeyi (dik saplı, kama biçimli yarma bıçağı) tokmakla vurup çevirerek kütükten 1,5–3 cm kalınlıkta, 15–20 cm genişlikte levhalar yarın.",
      "Levhaları yontma bıçağıyla düzeltin ve yerden yüksekte, havadar yerde kurutun.",
      "Çatı eğimi en az 35° olsun. 75–90 cm'lik şındıl için lataları yaklaşık 60 cm arayla çakın.",
      "Saçakta çift sıra ile başlayın. Sıraları, çatının her noktasında en az üç kat şındıl olacak biçimde bindirin.",
      "Yan yana şındılların aralarını bir alttaki sırayla şaşırtın; yanlardan 4–5 cm, uçlardan en az 15 cm bindirin.",
      "Her şındılı tek çiviyle ya da ahşap çiviyle çakın. Çivi asla iki şındıldan birden geçmesin; şındıl kurudukça çatlar.",
      "Bacanın çevresinde şındıl kullanmayın; taş ya da çamurla ayırın."
    ],
    art: [null, null, 'sf-yp-sindil-yarma', null, null, null, 'sf-yp-sindil-bindirme', 'sf-yp-sindil-civi', null],
    dont: [
      "Diri odundan (dış beyaz kısım) şındıl yapmayın; birkaç yılda çürür.",
      "Şındılları alt alta aynı hizaya, derz derze gelecek biçimde dizmeyin; su sızar.",
      "Ahşap çatıya kıvılcım saçan baca yapmayın; şındıl kolay tutuşur."
    ],
    keywords: ['şındıl yapımı', 'ahşap kiremit', 'tahta kiremit', 'sindil', 'pedavra çatı', 'ahşap çatı örtüsü', 'şındıl nasıl yarılır', 'rende ile yarma'],
    sources: [W_SHINGLE, USFS_LOG, FAO_ROOF, W_WOODPRES],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: FAO Roofing metni okundu, en az 35°, her noktada üç kat, tek çivi: teyitli; USFS ölçüleri yeniden okunmadı. Yazarın kaynakları: USFS (30–36 inç boy, ¾–1¼ inç kalınlık, 6–8 inç genişlik, yan 1½–2, uç ≥6 inç bindirme, 24 inç lata), FAO (35°, üç kat, tek çivi, iki şındıldan geçmez), Wikipedia Wood shingle (rende ile yarma, öz odun, yangın riski)."),
  },
  {
    id: 'sf-yp-kiremit',
    category: 'sf-yp-cati',
    title: 'Pişmiş kiremit yapma',
    tag: 'KİREMİT',
    summary: 'Uygun kili test edin, kalıplayıp yavaş kurutun, fırında kiraz kırmızısı renge (875–900°C) kadar pişirip yaklaşık 6 saat tutun ve kendiliğinden soğutun.',
    note: "Uzman gözetimi olmadan fırın yakmayın: 900°C'lik fırın yanık, yangın ve kapalı yerde karbonmonoksit zehirlenmesi tehlikesi taşır.",
    steps: [
      "Kili seçin: kil ile silt toplamı %25–50, kum %50–75 olsun. 10 mm kalınlıkta yuvarladığınız ıslak çubuğu masadan sarkıtın; 5–15 cm'lik parça koparak kırılıyorsa uygundur.",
      "Büzülme testi yapın: 30 × 5 × 5 cm kalıpta kuruyan çubuk %7'den az (2 cm'den az) kısalmalı, yüzeyi çatlamamalı.",
      "Kili ıslatıp taş ve kökleri ayıklayın, ayakla çiğneyerek düzgün bir hamur yapın.",
      "Kalıp yapın: düz kiremit için yaklaşık 27 × 17 cm iç ölçülü ince tahta çerçeve.",
      "Kalıba kum serpin, kili bastırarak doldurun, üstünü gergin tel ya da yaylı kesiciyle sıyırın.",
      "Gölgede yavaş kurutun: yaklaşık 3 gün yerinde, sonra en az 1 hafta istifte, yağmurdan korunarak. Kırılan bir kiremidin kesitinde renk farkı kalmadıysa kurumuştur.",
      "Fırını taş ya da kerpiçten, altta ateşlikli kapalı bir oda olarak kurun. Kiremitleri aralarından ateş geçecek biçimde dikine dizin.",
      "Ateşi yavaş artırın. Kiremitler kiraz kırmızısı olunca (875–900°C) bu ısıda yaklaşık 6 saat tutun. Odunla iş 4–5 gün sürer; ateş sönerse bütün yük bozulabilir.",
      "Fırını kendiliğinden soğumaya bırakın, sonra açın. Çatlak ve çarpık kiremitleri ayırın.",
      "Çatıda kiremitleri en az 6,5 cm, rüzgârlı yerde 7,5 cm bindirin; her 4–5 sırada bir kiremidi çivi ya da telle sabitleyin. Kiremit ağırdır; deprem bölgesinde hafif örtüyü tercih edin."
    ],
    art: [null, null, null, 'sf-yp-kiremit-kalip', null, null, 'sf-yp-kiremit-firin', null, null, 'sf-yp-kiremit-dizme'],
    dont: [
      "Tam kurumamış kiremidi fırına koymayın; içindeki su buhara dönüp kiremidi patlatır.",
      "Fırını hızlı soğutmak için su dökmeyin; kiremitler çatlar.",
      "Yeterli yakıtı hazırlamadan fırını yakmayın; yarıda sönen ateş bütün yükü bozar."
    ],
    keywords: ['kiremit yapımı', 'pişmiş kiremit', 'kil kiremit nasıl yapılır', 'kiremit fırını', 'kiremit pisirme sicakligi', 'toprak kiremit', 'tuğla fırını', 'kil pişirme'],
    sources: [FAO_BRICK, FAO_ROOF, Y1975],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: FAO Roofing metni okundu, 265×165 mm, 65/75 mm bindirme, her 4.–5. sırada çivi: teyitli; fırın sıcaklığı ve kil oranları (FAO tuğla sayfası) yeniden okunmadı. Yazarın kaynakları: FAO Burnt-clay bricks (kil %25–50, 10 mm çubuk 50–150 mm, büzülme <%7, 3 gün + 1 hafta kurutma, 875–900°C kiraz kırmızısı ~6 saat, odunla 4–5 gün, doğal soğuma), FAO Roofing (265×165 mm, 65/75 mm bindirme, her 4–5 sırada çivi), 1975 (hafif çatı)."),
  },
  {
    id: 'sf-yp-kapi',
    category: 'sf-yp-cati',
    title: 'Kapı ve menteşe',
    tag: 'KAPI',
    summary: 'Kapı boşluğunu küçük tutun, lentolu sağlam kasa yapın; tahta kanadı çaprazla güçlendirin ve mil, deri ya da demir pim menteşeyle asın.',
    steps: [
      "Kapı boşluğunu en çok 1,00 m genişlik ve 2,10 m yükseklikte tutun; köşeden en az 1 m içeride açın.",
      "Kasayı en az 10 × 10 cm kadronlardan, duvar kalınlığında yapın. Üstüne iki yanda en az 20 cm duvara oturan lento koyun.",
      "Kütük duvarda kapı üstünde 6–10 cm oturma payı bırakın.",
      "Kanat: dikine tahtaları yan yana dizin, arkadan iki yatay kuşakla ve aralarına bir çaprazla çivileyin. Çapraz, menteşe tarafının altından kilit tarafının üstüne doğru yükselsin; kapı sarkmaz.",
      "Mil menteşe: kanadın menteşe kenarına kalın bir dikme koyun, iki ucunu yuvarlak mil yapın. Alt mili eşikteki taş ya da ağaç yuvaya, üst mili kasanın üst kirişindeki deliğe geçirin.",
      "Deri menteşe: hafif kapılarda kalın deri şeritleri kasa ile kanada, üstüne çıta koyarak çivileyin.",
      "Demir varsa: kasaya L biçimli bir pim çakın, kanada ucu halka bükülmüş uzun bir demir lama çivileyin; halkayı pime geçirin.",
      "Mandal: kanada dönen bir tahta dil, kasaya bir çentik takın; içeriden kilitlemek için sürgü ekleyin."
    ],
    art: [null, 'sf-yp-kapi-kasa', null, 'sf-yp-kapi-kanat', 'sf-yp-kapi-mil', null, null, null],
    dont: [
      "Kerpiç evde köşeye ya da iki kapıyı aynı duvar parçasına açmayın.",
      "Çaprazı ters (kilit tarafı aşağıda) koymayın; kapı sarkar.",
      "Kapıyı kerpice doğrudan çivileyip asmayın; kasasız kapı duvarı yırtar."
    ],
    keywords: ['kapı yapımı', 'ahşap kapı nasıl yapılır', 'menteşe yapmak', 'menteşesiz kapı', 'mil menteşe', 'kapi kasasi', 'deri menteşe', 'kapı sürgüsü yapımı', 'kapı ölçüsü kerpiç'],
    sources: [Y1975, Y1998, W_HINGE, USFS_LOG],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: kapı 1,00×2,10 m, köşe 1 m, kesişim 0,5 m, lento 20 cm 1975 (11.3.3.2) ve 1998 makalesinden metinden okundu: teyitli. Yazarın kaynakları: 1975/1998 yönetmelikleri (kapı 1,00×2,10, köşe 1 m, 10×10 dikme, lento 20 cm), Wikipedia Hinge (taş yuvalı mil menteşe, pim), USFS (kapı üstü 2½–4 inç oturma). Çapraz yönü, deri ve demir pim menteşe genel marangozluk bilgisi; kaynakta ayrıntı yok."),
  },
  {
    id: 'sf-yp-pencere',
    category: 'sf-yp-cati',
    title: 'Pencere: cam yoksa',
    tag: 'PENCERE',
    summary: 'Pencereyi küçük ve güneyde açın; çerçeveyi küçük gözlere bölüp yağlı kâğıt, ince deri-zar ya da boynuz levhayla kaplayın, geceleri kepenk kapatın.',
    steps: [
      "Pencereyi küçük tutun: kerpiç evde en çok 0,90 m genişlik, 1,20 m yükseklik. Köşeden en az 1 m uzakta ve tercihen güney cephesinde açın.",
      "Üstüne iki yanda en az 20 cm oturan lento koyun; alt ve üst hizasından hatıl geçsin.",
      "Tahta bir çerçeve yapın ve çıtalarla küçük gözlere bölün; küçük göz kolay yırtılmaz.",
      "Yağlı kâğıt: ince kâğıdı ya da sık dokunmuş ince bezi gözlere gerip yapıştırın, üstüne bitkisel yağ ya da hayvan yağı sürün. Işık geçirir, suyu iter.",
      "Zar ya da ince deri: hayvan derisini ya da zarını iyice temizleyip inceltin, ıslakken çerçeveye gerin. Kurudukça gerilir ve ışık geçirir.",
      "Boynuz: ince levha haline getirilmiş boynuz parçalarını küçük gözlere takın.",
      "Kışın içe ikinci bir çerçeve takın ya da geceleri tahta kepenk kapatın; ısı kaybı azalır.",
      "Kaplama malzemesi yoksa açıklığı tahta kepenkle kapatıp gündüz açın. Kapalı odada mutlaka havalandırma deliği bırakın."
    ],
    art: ['sf-yp-pencere-yeri', null, null, 'sf-yp-pencere-yagli', null, null, 'sf-yp-pencere-kepenk', null],
    dont: [
      "Yağlı kâğıt ya da zar pencereyi ocağa ve kandile yakın açmayın; tutuşur.",
      "Kerpiç ve taş evde büyük pencere açmayın; duvarı depreme karşı zayıflatır.",
      "Kokmuş, kurtlanmış zar ve deri kullanmayın."
    ],
    keywords: ['camsız pencere', 'cam yoksa pencere', 'yağlı kağıt pencere', 'pencere yapımı', 'pencere kaplama doğal', 'pencere kepenk', 'pencere olcusu kerpic', 'deri pencere'],
    sources: [W_WINDOW, Y1998, Y1975, W_PASSIVE],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: pencere 0,90×1,20 m (1998; 1975 1,40×0,90 verir, küçük olan alındı), köşe 1 m, lento 20 cm metinden okundu: teyitli. Yazarın kaynakları: Wikipedia Window (deri, bez, boynuz levha, kâğıt, yağlı kâğıt, kepenk), 1998 (pencere 0,90×1,20, köşe 1 m, lento 20 cm), Wikipedia Passive solar (güney). Zar hazırlama ayrıntısı için kaynak bulunamadı; genel ifade kullanıldı."),
  },
  {
    id: 'sf-yp-kar-barinak',
    category: 'sf-yp-cati',
    title: 'Kar barınağı: kar mağarası ve kar yığını',
    tag: 'KAR BARINAĞI',
    summary: 'Derin, sıkı karda mağara oyun; kar azsa yığıp 2 saat bekletin ve içini oyun. Duvarı en az 30 cm bırakın, girişi alçakta tutun, havalandırma deliğini açık tutun.',
    note: "Uzman gözetimi olmadan kar barınağı yapmak tehlikelidir: çökme ve havasızlık boğulmaya yol açabilir. Çığ inebilecek yamaçta kazmayın.",
    steps: [
      "Yeri seçin: çığ inebilecek dik yamaçtan, kar saçağından ve karla yüklü ağaç altından uzak durun. Kar mağarası için en az 1,2–1,5 m derin, taşsız ve sıkı kar gerekir.",
      "Kar az ya da gevşekse kar yığını yapın: karı karıştırıp sıkıştırarak 1,5–2 m yüksekliğinde, 3–4 m çapında bir tepe yığın.",
      "Yığına her yandan 30–35 cm boyunda çubuklar batırın. Yığını en az 2 saat dinlendirin ki kar kaynaşsın.",
      "Girişi alçakta açın; içerideki oturma ve yatma yerini girişten yüksek yapın. Soğuk hava girişte toplanır.",
      "Önce tavanı, sonra duvarları oyun. İçeriden çubuğun ucunu görünce o yönde kazmayı bırakın; duvar her yerde en az 30 cm kalsın. Tavanı kubbe biçiminde düzleyin ki damlatmasın.",
      "Biri içeride kazarken diğeri dışarıda beklesin. Bir kürek her zaman içeride olsun.",
      "Tavanda bir çubukla havalandırma deliği açın ve sık sık açık olduğunu kontrol edin. Girişi kar tamamen kapatmasın.",
      "Hava −4°C'den sıcaksa çökme riski artar; kullanmayın. Birden fazla gece kalacaksanız her akşam tavandaki buz kabuğunu ince kazıyın; nefes geçirmez hale gelir.",
      "İçeride ocak, gaz ocağı, mangal ya da kömür yakmayın. En çok tek mum yakın, yalnız uyanıkken ve havalandırma deliği açıkken. Baş ağrısı, baş dönmesi, bulantı, halsizlik ya da şaşkınlık başlarsa herkes hemen dışarı çıksın; uyuyan kişi belirti vermeden ölebilir.",
      "Girişin yanına kürek, dal ya da renkli bir şey dikip yerinizi kurtarıcılar için işaretleyin."
    ],
    art: [null, null, 'sf-yp-kar-cubuk', 'sf-yp-kar-kesit', null, null, 'sf-yp-kar-delik', null, null, null],
    dont: [
      "Tek başınıza kazmayın; çökmede sizi çıkaracak kimse olmaz.",
      "Havalandırma deliğini ve girişi tamamen kapatmayın.",
      "Yığını oturmadan hemen oymaya başlamayın; çöker.",
      "Kapalı kar barınağında uyurken mum ya da ateş yanık bırakmayın; karbonmonoksit sessizce öldürür.",
      "Isınmak için içeride kömür, mangal ya da gaz ocağı yakmayın."
    ],
    keywords: ['kar mağarası', 'kar barınağı nasıl yapılır', 'iglo yapımı', 'kar evi', 'karda barınak', 'kar yığını sığınak', 'kar magarasi', 'karda mahsur kalmak barınak', 'quinzhee'],
    sources: [W_SNOWCAVE, W_QUINZHEE, W_IGLOO, CDC_CO],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: Wikipedia Snow cave ve Quinzhee yeniden okundu (1,2–1,5 m kar, ≥30 cm duvar, alçak giriş, buz kabuğu her gece kazınır, kürek içeride; 1,5–2 m × 3–4 m, en az 2 saat, 30–35 cm çubuk, biri dışarıda, −4°C üstünde kullanma, tavanda küçük hava deliği). İki sayfada da karbonmonoksit uyarısı yok; CDC'den belirtiler, kömür ve gaz ocağının kapalı yerde yakılmaması, uyuyanın belirtisiz ölebileceği eklendi. Çığ uyarısı kaynaksız ama güvenlik yönünde."),
  },
  {
    id: 'sf-yp-yurt',
    category: 'sf-yp-cati',
    title: 'Uzun süreli çadır: yurt (topak ev, keçe ev)',
    tag: 'YURT',
    summary: 'Açılır kafes duvar, çatı sırıkları ve tepe çemberinden oluşan iskeleti kuşakla sıkın, üstünü keçeyle örtüp iplerle bağlayın.',
    note: "Keçe ve ahşap kolay tutuşur: yurtta soba ya da ocak yakıyorsanız boruyu tepe deliğinden çıkarın, keçeye değdirmeyin ve ateşi gözetimsiz bırakmayın.",
    steps: [
      "Parçaları hazırlayın: açılıp kapanan kafes duvar (kerege), çatı sırıkları (uuk), tepe çemberi (tünlük, şanırak), kapı kasası, keçe örtüler, kuşak ve ipler.",
      "Kafes duvar: esnek söğüt ya da kavak çubuklarını çapraz dizin; kesiştikleri yerleri delip deri ya da sicim düğümle bağlayın. Makas gibi açılıp kapanmalı.",
      "Yeri düzleyin; sel almayan, hafif yüksek bir yer seçin ve çevresine su hendeği açın.",
      "Kafes duvarı daire biçiminde açın ve iki ucunu kapı kasasına bağlayın.",
      "Duvarın üstünü sağlam bir kuşakla (kolan) çevirip sıkın. Çatı sırıkları duvarı dışa iter; bu kuşak duvarı tutar.",
      "Tepe çemberini iki kişi sırıklarla havada tutarken çatı sırıklarını bir ucundan çemberin deliklerine geçirin, öbür ucundan kafes duvarın üstüne bağlayın. Sırıkları karşılıklı takın ki çember dengede kalsın.",
      "Keçeleri alttan başlayarak örtün, iplerle çevreden sıkıca sarın. Yağmurlu yerde keçenin üstüne su geçirmez bir örtü serin.",
      "Tepe deliğini duman ve ışık için açık bırakın; yağmurda keçe kapakla kapatın.",
      "İki-üç kişiyle kurmak 2–3 saat sürer. Sert rüzgârda tepe çemberinin ortasından yere bir ağırlık asın; yapı bastırılmış olur."
    ],
    art: [null, 'sf-yp-yurt-kafes', null, null, 'sf-yp-yurt-kusak', null, 'sf-yp-yurt-kece', null, null],
    dont: [
      "Kuşaksız kurmayın; sırıklar duvarı yarar, çatı çöker.",
      "Dere yatağına ya da çukura kurmayın.",
      "Islak keçeyi katlayıp bekletmeyin; çürür ve kokar."
    ],
    keywords: ['yurt nasıl kurulur', 'keçe ev', 'topak ev', 'yurt çadırı yapımı', 'kerege', 'tünlük', 'göçebe çadırı', 'yurt cadir', 'kalıcı çadır', 'alaçık'],
    sources: [W_YURT, W_FELT],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Yurt (kafes duvar, bükük sırıklar, tepe çemberi, gerilim kuşağı, keçe ve dış örtü, ipler, ortadan ağırlık, kurulum 30 dk–3 saat), Wikipedia Felt (keçe). Kafes bağlama ayrıntısı geleneksel bilgi; kaynakta ayrıntı yok."),
  },
  {
    id: 'sf-yp-kece',
    category: 'sf-yp-cati',
    title: 'Keçe yapma',
    tag: 'KEÇE',
    summary: 'Yıkanmış yünü döverek kabartın, kamış hasıra kat kat serin, sıcak sabunlu suyla ıslatın, hasırla sarıp saatlerce yuvarlayıp tekmeleyin.',
    steps: [
      "Koyun yününü kırkın (geleneksel olarak güz kırkımı), sıcak suyla yıkayın, kurutun ve çer çöpü ayıklayın.",
      "Yünü sopayla saatlerce döverek ya da tarakla kabartın; lifler açılıp havalı olmalı.",
      "Kamış hasırı yere serin. Desen isterseniz renkli yünü önce hasıra dizin.",
      "Kabarık yünü üstüne birkaç kat, eşit kalınlıkta serin; her katın liflerini bir öncekine çapraz gelecek biçimde yayın.",
      "Üstüne sıcak su ve sabunlu su serpin, elle bastırıp vurun; yün ıslanıp yatışsın.",
      "Hasırı yünle birlikte sıkıca rulo yapın ve iple bağlayın.",
      "Ruloyu saatlerce yuvarlayın, tekmeleyin, üstüne basın; ya da bir hayvana bağlayıp çektirin. Arada açıp sıcak su serpin.",
      "Hazır olup olmadığını deneyin: yüzeyden birkaç lif çimdikleyin. Lifler tek tek kalkıyorsa çalışmaya devam edin; yüzey bütün kalkıyorsa keçe olmuştur.",
      "Keçeyi açın, kenarlarını sarıp yuvarlayarak sıkılaştırın; yere atıp çarparak dövün.",
      "Sabununu duru suyla çıkarın, düz yerde kurutun."
    ],
    art: [null, 'sf-yp-kece-dovme', null, 'sf-yp-kece-serme', null, null, 'sf-yp-kece-yuvarlama', null, null, null],
    dont: [
      "Bitkisel lif ya da sentetik iplikle keçe yapmaya çalışmayın; keçeleşmez.",
      "Islak keçeyi katlanmış halde bekletmeyin; küflenir.",
      "Hayvana bağlı ruloyu çekerken ip ve rulonun önünde durmayın."
    ],
    keywords: ['keçe yapımı', 'keçe nasıl yapılır', 'yünden keçe', 'kece yapimi', 'keçe dövme', 'yün keçeleştirme', 'ıslak keçe', 'keçe yaygı', 'kepenek keçe'],
    sources: [W_ALAKIYIZ, W_FELT],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Ala kiyiz (güz kırkımı, yıkama, sopayla dövme, kamış hasır, desen, sıcak sabunlu su, rulo, saatlerce tekmeleme ya da at, kurutma), Wikipedia Felt (yalnız hayvan lifi, sıcak su ve sürtme, hayvanla çekme, dinkleme). Çapraz serme ve çimdik testi yaygın uygulama; kaynakta ayrıntı yok."),
  },
  {
    id: 'sf-yp-cit',
    category: 'sf-yp-cati',
    title: 'Çit ve çevre duvarı',
    tag: 'ÇİT',
    summary: 'Amaca göre zikzak sırık çit, direkli sırık çit, dal örgü çit ya da kuru taş duvar yapın; yırtıcıya karşı altı dolu, üstü sık çit kurun.',
    steps: [
      "Amacı belirleyin: hayvanı içeride tutmak, yırtıcıyı dışarıda tutmak ya da rüzgârı kesmek. Yükseklik ve sıklık buna göre değişir.",
      "Zikzak sırık çit, direk ve çivi gerektirmez: 3–3,5 m'lik kütükleri boyuna yarıp sırık yapın, uçlarını zikzak çizecek biçimde üst üste çaprazlayın.",
      "Sığır ve koyun için 4 sıra sırıkla yaklaşık 1,2 m yükseklik yeterlidir. Geyik ve yaban hayvanı için 1,8–2,1 m gerekir.",
      "Direkli sırık çit: dayanıklı ağaçtan direkleri toprağa gömün, direklere açtığınız deliklere sivriltilmiş sırık uçlarını geçirin.",
      "Direklerin toprağa girecek kısmını soyun ve ateşte kömürleştirin. Yine de toprak hizasında çürürler; her yıl kontrol edin.",
      "Dal örgü çit: sık çakılmış kazıkların arasından esnek dalları bir önden bir arkadan örün.",
      "Kümes ve ağıl çevresine yırtıcıya karşı en az 60 cm yükseklikte dolu duvar, üstüne 2,5 cm'den sık tel ya da sık dal örgü yapın.",
      "En dayanıklı çevre duvarı kuru taş duvardır (Harçsız taş duvar rehberine bakın)."
    ],
    art: [null, 'sf-yp-cit-zikzak', null, null, null, 'sf-yp-cit-orgu', 'sf-yp-cit-yirtici', null],
    dont: [
      "Kabuklu, diri odundan direk dikmeyin; birkaç yılda çürür.",
      "Kümes çitinin altını açık bırakmayın; tilki ve köpek altından geçer.",
      "Çiti dere yatağına ya da sel yoluna çekmeyin; ilk taşkında yıkılır."
    ],
    keywords: ['çit yapımı', 'sırık çit', 'zikzak çit', 'tarla çiti', 'hayvan çiti', 'cit nasil yapilir', 'dal örgü çit', 'kümes çiti tilki', 'ağıl çiti yüksekliği'],
    sources: [W_SPLITRAIL, W_WATTLE, FAO_POULTRY, W_WOODPRES],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: bu turda kaynak yeniden açılmadı; sayılar yazarın okumasına dayanıyor, kritik bir yapı ya da zehir iddiası saptanmadı. Yazarın kaynakları: Wikipedia Split-rail fence (10–12 ft sırık, direksiz zikzak, 4 sıra ~4 ft sığır-koyun, 6–7 ft geyik, direk-delik çit), FAO Poultry (en az 60 cm dolu duvar + ≤25 mm tel), Wikipedia Wood preservation (kömürleştirme, toprak teması)."),
  },
  {
    id: 'sf-yp-ahir-kumes',
    category: 'sf-yp-cati',
    title: 'Ahır, ağıl ve kümes',
    tag: 'AHIR VE KÜMES',
    summary: 'Ağılı iyi süzülen yere, açık yüzü güneye bakacak biçimde kurun; hayvan başına yeterli alan, yemlik, tünek ve folluk ayırın, yırtıcıya karşı kapatın.',
    steps: [
      "İyi su süzen, çamur tutmayan bir yer seçin; koyun ve keçi çamura dayanamaz.",
      "Soğuk bölgede ağılın açık yüzünü güneye çevirin; kuzey ve batıyı kapalı yapın.",
      "Koyun-keçi kapalı alanı: 35 kg'lık hayvana 0,8 m², 50 kg'lığa 1,1 m², 70 kg'lığa 1,4 m², kuzu ve oğlağa 0,4–0,5 m². Ayrıca hayvan başına 2–3 m² avlu.",
      "Tabanı sıkıştırılmış topraktan yapın, açık yüze doğru 1/50 eğim verin (her metrede 2 cm).",
      "Yemlik: hayvan başına 35–45 cm yemlik boyu ayırın; yemlik derinliği 30–40 cm olsun.",
      "Kümes: gece barınağında tavuk başına yaklaşık 0,2 m² taban; gündüz çitle çevrili avluda tavuk başına 5–8 m².",
      "Tünek: yaklaşık 5 cm kalınlıkta sırıklar, yerden 60–100 cm yüksekte, aralarında 35–40 cm; tavuk başına 20–30 cm tünek boyu.",
      "Folluk: her 5 tavuğa bir yumurtlama kutusu; yaklaşık 30 × 35 × 30 cm, yerden 45–60 cm yüksekte, yarı karanlık bir köşede, bol altlıklı.",
      "Yırtıcı ve sıçana karşı: kümes duvarının alt 60 cm'sini dolu yapın, üstünü 2,5 cm'den sık telle ya da sık örgüyle kapatın, gece kapıyı kapatın.",
      "Kümesin üst kısmında, saçak altında kapatılabilen havalandırma açıklıkları bırakın."
    ],
    art: [null, 'sf-yp-ahir-yon', null, null, null, null, 'sf-yp-kumes-tunek', 'sf-yp-kumes-folluk', null, null],
    dont: [
      "Ağılı evin su kaynağının yukarısına kurmayın; gübre suyu kaynağı kirletir.",
      "Kümesi tamamen havasız kapatmayın; hayvanlar hastalanır.",
      "Hayvanları çamurlu, su birikmiş ahırda tutmayın; ayak hastalıkları başlar."
    ],
    keywords: ['ahır yapımı', 'ağıl yapımı', 'kümes nasıl yapılır', 'tavuk kümesi ölçüleri', 'koyun başına alan', 'tünek yüksekliği', 'folluk ölçüsü', 'kumes yapimi', 'keçi ağılı', 'kümes tilki'],
    sources: [FAO_SHEEP, FAO_POULTRY, FAO_DWELL],
    reviewed: false,
    checked: CHK("Bağımsız doğrulama: yapısal ya da güvenlik açısından kritik sayı yok; FAO sayfaları yeniden okunmadı. Yazarın kaynakları: FAO Sheep and goat housing (alan tablosu, 1:50 eğim, yemlik 0,35–0,45 m ve 0,3–0,4 m derinlik, çamur, açık yüz yönü), FAO Poultry (0,2 m² gece, 5–8 m² avlu, tünek 50 mm, 0,6–1,0 m, 0,35–0,4 m ara, 0,2–0,3 m/tavuk, 5 tavuğa 1 folluk 250–300×300–380×300–350 mm, 450–600 mm yükseklik, 60 cm duvar + ≤25 mm tel)."),
  },
];
