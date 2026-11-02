// Sıfırdan paketi: Yolculuk, kış, yerleşim ve moral
// Katalog bölüm 20 (madde 367–381). Biçim: packs-src/sifirdan/types.ts
import type { PackMeta, CategoryMeta, PackGuide } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-yolculuk-yerlesim',
  name: 'Sıfırdan: Yolculuk, kış, yerleşim ve moral',
  desc: 'Yükle ve grupla uzun yol yürümek, yük hayvanı ve el arabasıyla taşımak, yeni yerleşim yeri seçmek; kar ve buzda güvenle ilerlemek; yerleşimi şiddete başvurmadan korumak; çocuklar ve topluluk için oyun, müzik ve doğa bilimi.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sf-yy-yolculuk', title: 'Yolculuk ve göç', hint: 'Yük, mola, ayak, su ve yiyecek planı, grup, hayvan, el arabası, yer seçimi', art: 'sf-yy-yolculuk-kapak', color: '#fdba74', order: 192 },
  { id: 'sf-yy-kis', title: 'Kış ve soğuk', hint: 'Kar ayakkabısı, buz kalınlığı, buza düşme, siper ayağı, kar körlüğü', art: 'sf-yy-kis-kapak', color: '#bae6fd', order: 193 },
  { id: 'sf-yy-guvenlik', title: 'Yerleşim güvenliği', hint: 'Dikkat çekmemek, sesli alarm, stok koruma, kemirgen ve nem, yangın gözetleme', art: 'sf-yy-guvenlik-kapak', color: '#c4b5fd', order: 194 },
  { id: 'sf-yy-moral', title: 'Moral ve çocuklar', hint: 'Oyuncak, oyun, çalgı, toplu müzik, deney, gözlem defteri', art: 'sf-yy-moral-kapak', color: '#fde68a', order: 195 },
];

const D = '2026-11-02';

export const GUIDES: PackGuide[] = [
  // ───────────── YOLCULUK VE GÖÇ ─────────────
  {
    id: 'sf-yy-yuk-hazirlama',
    category: 'sf-yy-yolculuk',
    title: "Uzun yürüyüşe hazırlık: yük ve sırt çantası",
    tag: "YOLCULUK",
    summary: "Çok günlük yükü vücut ağırlığınızın en fazla beşte biriyle sınırlayın, ağır eşyayı sırta yakın ve ortada taşıyın, ilk gün kısa yürüyüp ayarlayın.",
    steps: [
      "Yükü tartın. Çok günlük yolculukta yük, vücut ağırlığınızın en fazla yüzde 20'si olsun: 70 kg bir kişi en çok 14 kg taşır. Günübirlik yükte yüzde 10'u geçmeyin.",
      "Eşyayı üç yığına ayırın: mutlaka gerekenler (su, yiyecek, sıcak giysi, örtü, ilk yardım, yedek çorap), işe yarayanlar ve vazgeçilebilenler. Üçüncü yığını bırakın, ikinciyi yarıya indirin.",
      "Çantayı katmanlı doldurun. En alta uyku tulumu ya da battaniye gibi akşama kadar gerekmeyen hacimli şeyleri koyun.",
      "Ağır eşyayı (su, yiyecek, alet) ortaya ve sırta en yakın yere koyun. Çok aşağıdaki ağırlık çantayı sarkıtır, çok yukarıdaki devirir.",
      "Yağmurluk, sıcak kat ve ilk yardımı üste; su, harita ve atıştırmalığı dış ceplere koyun. Dışarıya sallanan eşya bırakmayın; sallanan yük dengeyi bozar ve sürter.",
      "Askıları ayarlayın: önce bütün askıları gevşetin, çantayı sırtlanın, varsa bel kemerini kalça kemiğinin üstüne oturtup sıkın, sonra omuz askılarını çekin. Yük yürürken kaymamalı ve sallanmamalı.",
      "Çantanız yoksa battaniyeyi eşyaların çevresine rulo yapıp iki ucunu bağlayın ve omzunuzdan çapraz asın. Ya da çuvalın iki alt köşesine birer küçük taş sarıp iple bağlayın, ipleri ağzına bağlayarak iki askı yapın.",
      "Ayakkabıyı yola çıkmadan birkaç gün giyip alıştırın. Yeni ayakkabıyla uzun yola çıkmayın.",
      "İlk gün kısa yürüyün. Sürten, batan, ağrıtan yeri o akşam düzeltin.",
      "Yükü güce göre bölüştürün. Çocuk, yaşlı ve hasta hafif taşısın; tencere, alet ve örtü gibi ortak eşyayı güçlüler paylaşsın."
    ],
    art: [null, null, null, 'sf-yy-canta-yerlesim', null, 'sf-yy-canta-ayar', 'sf-yy-battaniye-rulo', null, null, null],
    dont: [
      "Ağır yükü tek omuzda ya da elde uzun süre taşımayın; bel ve omuz sakatlanır.",
      "Yeni ya da dar ayakkabıyla uzun yola çıkmayın; ilk gün su toplar, yürüyemez hâle gelirsiniz.",
      "Sıcak giysi ve yağmurluğu yer kaplıyor diye bırakmayın; ıslanıp üşümek yolda en büyük tehlikedir."
    ],
    keywords: ['sırt çantası hazırlama', 'canta nasil yuklenir', 'uzun yürüyüş yükü', 'ne kadar yük taşıyabilirim', 'göç için çanta', 'yaya göç hazırlık', 'yük ağırlığı vücut ağırlığı', 'battaniye rulo taşıma', 'çantasız eşya taşıma', 'yürüyerek uzun yol hazırlık'],
    sources: [
      "REI — How much should your pack weigh? (https://www.rei.com/learn/expert-advice/backpacking-weight.html)",
      "REI — How to pack a backpack (https://www.rei.com/learn/expert-advice/loading-backpack.html)",
      "ABD Ordusu ATP 3-21.18 Foot Marches (https://irp.fas.org/doddir/army/atp3-21-18.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yük üst sınırı vücut ağırlığının yaklaşık %20'si, günübirlikte %10 (REI, yeniden açıldı); ağır eşya ortada ve sırta yakın, hacimli uyku eşyası altta, sık lazım olan üstte ve ceplerde, askıları gevşetip sonra sıkma (REI); ilk 45 dakikadan sonra yük ayarı molası (ATP 3-21.18). Battaniye rulo ve çuval askı geleneksel yöntem, kaynakla ayrıca doğrulanmadı." },
  },
  {
    id: 'sf-yy-yuruyus-ayak-mola',
    category: 'sf-yy-yolculuk',
    title: "Uzun yürüyüşte tempo, mola ve ayak bakımı",
    tag: "YOLCULUK",
    summary: "Her 50 dakikada 10 dakika mola verin, her molada ayağa bakın, kızaran yeri su toplamadan koruyun ve ayağı kuru tutun.",
    steps: [
      "Yola serinde çıkın. İlk 45 dakikadan sonra 15 dakika durun; bağcık, askı ve çorap kırışıklığını bu molada düzeltin.",
      "Sonra her 50 dakika yürüyüşte 10 dakika dinlenin. Düz yolda yüklü bir yetişkin molalarla birlikte saatte yaklaşık 4 km ilerler. Grubun hızını en yavaş kişi belirler.",
      "Her molada ayakkabıyı çıkarıp ayağa bakın. Kızaran, yanan ya da ısınan yer su toplamanın habercisidir.",
      "Kızaran yeri hemen koruyun: deriyi kurulayın, üstüne bant, yara bandı ya da yumuşak bez yama yapıştırın. Ayakkabıya giren taşı çıkarın, çorabın kırışığını düzeltin.",
      "Uzun molada çorapları değiştirin, ayakları yükseğe koyup dinlenin. Islak çorabı çantanın dışına asıp kurutun.",
      "Su toplamışsa ana uygulamadaki \"Ayakta su toplaması ve ayak bakımı\" rehberini izleyin.",
      "Akşam ayakları yıkayın, parmak aralarına kadar kurulayın. Tırnakları düz kesin. Gece kuru çorapla ya da çıplak ayakla uyuyun.",
      "Yokuşta adımı kısaltın. İnişte dizleri hafif bükük tutun, değnek kullanın.",
      "Akşam herkese ayak, diz ve sırt ağrısını sorun. Ertesi gün yükü buna göre yeniden dağıtın."
    ],
    art: [null, 'sf-yy-mola-saat', 'sf-yy-ayak-kontrol', 'sf-yy-ayak-bant', null, null, null, null, null],
    dont: [
      "Kızaran yeri \"akşama bakarım\" diye bırakmayın; birkaç saatte su toplar ve yara olur.",
      "Islak çorapla günlerce yürümeyin; siper ayağına yol açar.",
      "Molasız yürüyüp sonra uzun süre oturmayın; kaslar tutulur, yorgunluk artar."
    ],
    keywords: ['yürüyüşte mola', 'kaç saatte bir mola', 'ayak su topladı yolda', 'yürürken ayak kızardı', 'ayak bakımı yürüyüş', 'günde kaç km yürünür', 'yaya göç tempo', 'uzun yürüyüş ayak', 'yuruyus molasi'],
    sources: [
      "ABD Ordusu ATP 3-21.18 Foot Marches: mola düzeni, çorap değişimi (https://irp.fas.org/doddir/army/atp3-21-18.pdf)",
      "CDC — Trench foot (arşiv) (https://webarchive.library.unt.edu/eot2008/20090109222132mp_/http://emergency.cdc.gov/disasters/trenchfoot.asp)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: ilk saatte 15 dk, sonra her 50 dakikada 10 dk mola, 4 km/sa yürüyüş hızı, uzun molada çorap değişimi ve ayakları yükseltme (ATP 3-21.18); ayağı kuru tutma, temiz kuru çorap, gece çorapsız (CDC). Sürtünme noktasını erken bantlama genel uygulama; ATP'nin ilgili eki okunamadı." },
  },
  {
    id: 'sf-yy-yolda-su-yiyecek',
    category: 'sf-yy-yolculuk',
    title: "Yolda su ve yiyecek planı",
    tag: "YOLCULUK",
    summary: "Yürürken saatte yarım ile bir litre su, günde kişi başı 0,7–1,1 kg kuru ve enerjili yiyecek hesaplayın; rotayı su noktalarına göre bölün.",
    steps: [
      "Su ihtiyacını hesaplayın. Dinlenirken bile kişi başı günde 2,5–3 litre içme suyu gerekir. Yürürken ılık havada saatte yaklaşık yarım litre, sıcakta ve yokuşta saatte 1 litre ya da fazlası gerekir.",
      "Rotayı su noktalarına göre bölün. Çeşme, dere ve köyleri öğrenin. İki su noktası arasını yürümeye yetecek suyu ve bir yedeği taşıyın.",
      "Bulduğunuz her suyu arıtın: kaynatma, klor ya da filtre. Arıtılmış su ile ham su kaplarını ayrı işaretleyin.",
      "Azar azar ve sık için. İdrar koyu sarı ve azsa daha çok için. Terlediğinizden fazlasını da içmeyin; uzun yürüyüşte suyu tuzlu yiyecekle birlikte alın.",
      "Yiyeceği hesaplayın: ağır yürüyüşte kişi başı günde yaklaşık 0,7–1,1 kg kuru yiyecek (2.500–4.500 kcal). Yokuş ve soğuk ihtiyacı artırır.",
      "Hafif ve enerjili yiyecek seçin: bulgur, kırmızı mercimek, yulaf, tarhana, kuru meyve, pestil, ceviz, fındık, kuru et, sert peynir.",
      "Her günün yiyeceğini ayrı bir bez torbaya koyun ve üstüne gün numarasını yazın. Torba sayısı yolun ortasında yiyeceğin yetip yetmeyeceğini gösterir.",
      "Sabah ve akşam sıcak öğün yapın, molalarda atıştırın. Yakıt azsa çabuk pişenleri seçin; kuru baklagili önceki akşam ıslatın.",
      "Su ve yiyeceği gruba dağıtın. Biri kaybolursa ya da geride kalırsa herkes aç ve susuz kalmasın."
    ],
    art: ['sf-yy-su-hesap', null, null, null, null, null, 'sf-yy-gun-torbalari', null, null],
    dont: [
      "Yoldaki suyu arıtmadan içmeyin; ishal yolculuğu durdurur ve susuz bırakır.",
      "Bir kişi bütün yiyeceği taşımasın; o kişiyle birlikte erzak da kaybolabilir.",
      "Susuzken kar yemeyin, eritip için; kar yemek vücudu soğutur."
    ],
    keywords: ['yolda ne kadar su', 'yürüyüşte su ihtiyacı', 'günde kaç litre su yürüyüş', 'yolculuk erzak planı', 'kaç günlük yiyecek', 'göçte yemek', 'yol azığı', 'yolda yiyecek hesabı', 'yuruyuste su'],
    sources: [
      "Sphere — Water supply standard 1: access and water quantity (https://sphereprototype.conted.ox.ac.uk/standards/watersupply/accessAndWaterQuantity.html)",
      "REI — How to stay hydrated on the trail (https://www.rei.com/learn/expert-advice/hydrate.html)",
      "REI — Backpacking food and meal planning (https://www.rei.com/learn/expert-advice/planning-menu.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: hayatta kalma içme suyu 2,5–3 l/gün (Sphere); orta efor ve ılık havada saatte 0,5 l, sıcak ve ağır eforda saatte 1 l ya da fazlası, koyu idrar susuzluk belirtisi, aşırı su içmenin (hiponatremi) riski (REI); günde kişi başı 1,5–2,5 lb (0,7–1,1 kg) ve 2.500–4.500 kcal yiyecek (REI)." },
  },
  {
    id: 'sf-yy-grupla-yolculuk',
    category: 'sf-yy-yolculuk',
    title: "Grupla yolculuk: çocuk, yaşlı, hasta ve engelli",
    tag: "YOLCULUK",
    summary: "Hızı en yavaş kişiye göre ayarlayın, herkese bir yol arkadaşı verin, her molada sayım yapın ve en deneyimli kişi en arkada yürüsün.",
    steps: [
      "Yola çıkmadan herkesin adını, yaşını, sağlık durumunu ve kullandığı ilaçları bir kâğıda yazın. İlaçlar kişinin üstünde, yedeği başka birinde dursun.",
      "Hızı en yavaş kişiye göre ayarlayın. Yavaş yürüyenleri önden ikinci sıraya koyun. En deneyimli kişi en arkada yürüsün ve kimseyi geride bırakmasın.",
      "Herkese bir yol arkadaşı verin: çocukla yetişkin, yaşlıyla genç. Her molada ve her yol ayrımında sayım yapın.",
      "Küçük çocukların cebine adlarını ve bir yakınının adını yazan kâğıt koyun, montlarının fermuarına ya da cebine kısa bir iple düdük bağlayın; küçük çocuğun boynuna ip asmayın. \"Kaybolursan olduğun yerde dur, düdüğü çal\" diye öğretin.",
      "Çocuğu oyunla yürütün: bir sonraki ağaca kadar sayma, şarkı, \"kim önce görecek\". Yorulan küçük çocuğu sırayla taşıyın; bu iş yük taşıyanlara verilmesin.",
      "Yaşlı ve hareketi kısıtlı kişilerin değneğini, yürüteçini ya da tekerlekli sandalyesini mutlaka yanınıza alın. Yokuşta iki kişi kollarına girsin; gerekirse el arabası ya da sedye hazırlayın.",
      "Molada önce çocuk, yaşlı ve hastaların su içtiğine, tuvalete gittiğine ve ısındığına bakın.",
      "Bebek ve küçük çocuk soğuktan ve sıcaktan yetişkinden çabuk etkilenir. Ensesine ve ellerine sık dokunarak kontrol edin.",
      "Gece yürümekten kaçının. Zorunluysa aradaki mesafeyi 1–3 metreye indirin ve yavaşlayın."
    ],
    art: [null, 'sf-yy-grup-dizilis', null, 'sf-yy-cocuk-duduk', null, null, null, null, null],
    dont: [
      "Yavaş yürüyeni \"arkadan gelir\" diye geride bırakmayın; kaybolma ve kaza en çok böyle olur.",
      "Yaşlı ve hastaların düzenli ilaçlarını tek bir çantaya koymayın.",
      "Çocuklara korkutarak söz dinletmeye çalışmayın; kaybolduğunda saklanabilir."
    ],
    keywords: ['çocukla yürüyerek göç', 'yaşlıyla yolculuk', 'grupla yürüyüş düzeni', 'kafilede kayıp çocuk', 'engelli ile tahliye yürüyüş', 'yol arkadaşı sistemi', 'kafile sayım', 'gruptan kimse kaybolmasın', 'cocuklu goc'],
    sources: [
      "Ready.gov — Older adults: destek ağı, yardımcı araçlar, ilaçlar (https://www.ready.gov/older-adults)",
      "ABD Ordusu ATP 3-21.18 Foot Marches: gece aralığı 1–3 m, yavaş tempo (https://irp.fas.org/doddir/army/atp3-21-18.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: yardımcı araçların ve ilaçların tahliyede yanında olması, destek ağı (Ready.gov); gece yürüyüşünde 1–3 m aralık ve yavaş tempo (ATP 3-21.18). Yol arkadaşı, sayım ve çocuk düdüğü yaygın tahliye ve kamp uygulaması; ayrı kaynakla doğrulanmadı." },
  },
  {
    id: 'sf-yy-hayvanla-yolculuk',
    category: 'sf-yy-yolculuk',
    title: "Hayvanlarla yolculuk: köpek, kedi, kümes hayvanı ve sürü",
    tag: "YOLCULUK",
    summary: "Hayvanların suyunu insan suyundan ayrı hesaplayın, serin saatlerde ve yavaş yürütün, küçük hayvanları kafeste ya da torbada taşıyın.",
    steps: [
      "Hangi hayvanları götüreceğinize önceden karar verin. Yolu yürüyemeyecek ya da suyu karşılanamayacak hayvanı bir komşuya ya da güvenli bir ağıla bırakın.",
      "Su hesaplayın (günlük, yaklaşık): köpek kilo başına 30–50 ml, kedi kilo başına yaklaşık 60 ml; tavuk 0,2–0,45 litre; koyun 3–4,5 litre; kuru keçi 3,5–7, sağmal keçi 10–20 litre; at 34–50 litre; besi sığırı 30–50, sağmal inek 40–70 litre. Sıcakta daha fazla.",
      "Büyük hayvanın suyunu taşıyamazsınız; rotayı dere, göl ve çeşme noktalarına göre seçin.",
      "Köpeğe tasma ve sağlam kayış takın. Tasmaya ya da boynundaki bir bez şeride sahibinin adını yazın.",
      "Kedileri ve kümes hayvanlarını kafeste, sepette ya da havalandırma delikli kutuda taşıyın. Tavukları akşam serinliğinde kafese koymak kolaydır.",
      "Sürüyü serin saatlerde yürütün, öğle sıcağında gölgede dinlendirin. Sürü insandan yavaştır; yolu buna göre planlayın.",
      "Her molada hayvanlara su verin ve ayaklarına, pençelerine, toynaklarına bakın. Topallayan hayvanı zorlamayın.",
      "Gebe, yavrulu ve yaşlı hayvanları sürünün önüne değil ortasına alın; geride kalırsa fark edilmez.",
      "Gece hayvanları bağlayın ya da çitle kapatın. Yabancı köy ve sürülere karışmalarına izin vermeyin; hastalık bulaşabilir."
    ],
    art: [null, 'sf-yy-hayvan-su', null, null, 'sf-yy-tavuk-kafes', 'sf-yy-suru-golge', null, null, null],
    dont: [
      "Hayvanı sıcak öğle saatinde zorla yürütmeyin; sıcak çarpması ve ölüm olur.",
      "Köpeği arabaya, kafese ya da kapalı kaba havasız bırakmayın.",
      "Hasta görünen hayvanı yabancı sürülerle aynı suya ve otlağa sokmayın."
    ],
    keywords: ['hayvanla göç', 'köpekle tahliye', 'kediyle yolculuk', 'tavukları nasıl taşırım', 'sürüyle yolculuk', 'hayvan ne kadar su içer', 'koyun keçi su ihtiyacı', 'evcil hayvanla göç', 'hayvanlari goturmek'],
    sources: [
      "Hawke's Bay CDEM — Lifestyle block emergency preparedness, Appendix 2: daily water use (https://www.hbemergency.govt.nz/assets/Lifestyle-Block-Emergency-Preparedness/Lifestyle-block-emergency-preparedness-Appendix-2-Daily-water-use.pdf)",
      "Ready.gov — Older adults: evcil hayvanlar için alternatif plan (https://www.ready.gov/older-adults)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama (tablo yeniden açıldı): günlük su kullanımı at 34–50 l, besi sığırı 30–50 l, koyun 3–4,5 l, kuru keçi 3,5–7 l, sağmal keçi 10–20 l, tavuk 0,18–0,45 l, köpek 0,03–0,05 l/kg, kedi 0,06 l/kg (Hawke's Bay CDEM). Bağımsız doğrulamada tablo yeniden açıldı; köpek ve kedi ayrı yazıldı, sağmal inek 40–70 l eklendi. Sürü yönetimi önerileri genel hayvancılık bilgisi; ayrıca doğrulanmadı." },
  },
  {
    id: 'sf-yy-yuk-hayvani',
    category: 'sf-yy-yolculuk',
    title: "Yük hayvanıyla taşıma: eşek, katır ve at",
    tag: "YOLCULUK",
    summary: "Yük, semer ve takım dahil hayvanın ağırlığının en çok beşte biri (yüzde 20) olsun: 150 kg'lık eşeğe en çok 30 kg; yükü iki yana eşit bölün ve sırtı kalın keçeyle koruyun.",
    steps: [
      "Hayvanı yüklemeden önce bakın. Topallıyorsa, sırtında yara ya da şişlik varsa, çok zayıfsa yük vurmayın. 4 yaşından küçük eşeğe yük vurmayın.",
      "Yükü sınırlayın. Semer, keçe ve takım dahil toplam yük hayvanın ağırlığının en çok beşte biri (yüzde 20) olsun: 150 kg'lık eşeğe en çok 30 kg, 400 kg'lık katır ya da ata en çok 80 kg. Hayvanın ağırlığını bilmiyorsanız küçük tutun; zayıf, yaşlı ya da yorgun hayvana, dağ yolunda ve sıcakta daha az yükleyin.",
      "Sırta önce kalın, kuru ve temiz bir keçe ya da katlanmış battaniye serin, sonra semeri ya da palanı koyun. Altında kırışık ve çöp kalmasın.",
      "Yükü iki eşit parçaya bölün. İki heybe ya da çuvalı elde kaldırarak ya da çengelli terazide tartarak eşitleyin. Ağır eşyayı heybenin dibine ve hayvanın gövdesine yakın koyun.",
      "Kolanı göğsün altından geçirip sıkın; araya bir parmak girecek kadar boşluk kalsın. Yokuş için göğüslük, iniş için kuyruk altından geçen kuskun takın.",
      "15 dakika yürüdükten sonra durun. Kolanı yeniden sıkın, yükün bir yana kayıp kaymadığına bakın.",
      "Saatte bir mola verin ve su gösterin. Uzun molada yükü indirin, sırtı havalandırın.",
      "Akşam sırtı elle yoklayın. Şişlik, sıcak nokta, tüy dökülmesi ya da sıyrık sürtünmeyi gösterir. Yaralı yere yük bindirmeyin, keçeyi ve semeri düzeltin.",
      "Hayvanı her gün sulayın, otlatın ve toynaklarını temizleyin. Ayrıntı için \"Eşek ve at bakımı\" rehberine bakın."
    ],
    art: [null, null, 'sf-yy-semer-kece', 'sf-yy-heybe-denge', 'sf-yy-kolan-kuskun', null, null, null, null],
    dont: [
      "Yükü tek yana ağır yüklemeyin; hayvanın sırtı yara olur ve yük kayar.",
      "Sırtında yara olan hayvana \"az kaldı\" diye yük vurmayın; yara derinleşir ve hayvan çalışamaz hâle gelir.",
      "İnsanı ve yükü aynı anda bindirip yokuş çıkarmayın."
    ],
    keywords: ['eşeğe ne kadar yük', 'eşek yük kapasitesi', 'katıra yük vurma', 'semer nasıl vurulur', 'heybe yükleme', 'atla yük taşıma', 'yük hayvanı', 'kolan kuskun', 'esek yuku'],
    sources: [
      "Donkey Breed Society — Trekking: yük, semer ve takım dahil vücut ağırlığının %20'sini geçmemeli (https://www.donkeybreedsociety.co.uk/about-donkeys/activities/trekking/)",
      "The Donkey Sanctuary — Guidelines (binicilik): 50 kg sınırı ortalamadan iri ve formda eşekte binici için; en az 4 yaş (https://thedonkeysanctuary.org.uk/print/pdf/node/427)",
      "Frontiers in Veterinary Science 2022 — Welfare concerns with mounted load carrying by working donkeys (https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2022.886020/pdf)",
      "Wikipedia — Pack animal: ABD Ordusu, dağda günde 32 km'ye kadar yürüyen katıra vücut ağırlığının en çok %20'si (https://en.wikipedia.org/wiki/Pack_animal)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yük hayvanı için sınır semer ve takım dahil vücut ağırlığının %20'si (Donkey Breed Society); 50 kg değeri Donkey Sanctuary'de binici için, ortalamadan iri ve formda bir İngiliz eşeği için verilmiş tarihsel üst sınır; Anadolu'nun küçük eşeklerinde fazla olduğundan çıkarıldı, %20 kuralı ve 10-bilgi-topluluk 'Eşek ve at bakımı' rehberiyle aynı örnek (150 kg → 30 kg) kullanıldı. En az 4 yaş (Donkey Sanctuary, Frontiers 2022); katırda %20 (ABD Ordusu, Wikipedia üzerinden). Kolan sıkılığı, ilk 15 dakikadaki kontrol ve sırt yoklama genel binicilik uygulaması; kaynakla doğrulanmadı." },
  },
  {
    id: 'sf-yy-el-arabasi-yolda',
    category: 'sf-yy-yolculuk',
    title: "El arabası ve çekçekle uzun yol",
    tag: "YOLCULUK",
    summary: "Yükü tekerleğin üstünde ve iki yana eşit toplayın, az yükle çok sefer yapın, mümkünse itin, inişte arabayı arkadan bir iple frenleyin.",
    steps: [
      "Yola çıkmadan tekerleği, aksı ve kolları kontrol edin. Aksı yağlayın; şişme lastikse havasını tamamlayın. İndik lastik itmeyi çok zorlaştırır.",
      "Tek tekerli el arabasında yükün çoğunu tekerleğin üstüne ve iki yana eşit yerleştirin. Kollara yakın yüklenen ağırlık kolları ve beli zorlar.",
      "Yükü alçak tutun ve iple bağlayın. Üstünü bez ya da muşambayla örtün.",
      "Az yükleyin, gerekirse iki kez gidin. Dolu bir el arabası kolayca 100 kg'ı geçer ve devrilir.",
      "Mümkünse çekmek yerine itin. Çekçekte kol ya da tutamak bel ile göğüs arası yükseklikte (yaklaşık 90–110 cm) olsun.",
      "Yolu seçin: dik yokuştan, yumuşak topraktan, keskin dönemeçten kaçının. Çamurlu ve çukurlu yere tahta döşeyin.",
      "Yokuş yukarı ikinci kişi önden iple çeksin. İnişte ikinci kişi arkadan iple tutup frenlesin; araba hiçbir zaman sizden önce kaçmasın.",
      "Saatte bir mola verin ve yükü kontrol edin. Kayan yükü yeniden bağlayın.",
      "Ellerinizi koruyun: eldiven ya da kolları bezle sarın. Kolu sıkıca kavramak bileği yorar; sık sık el değiştirin."
    ],
    art: [null, 'sf-yy-el-arabasi-yuk', null, null, null, null, 'sf-yy-araba-inis-ip', null, null],
    dont: [
      "Yükü kolların ucuna yığmayın; araba devrilir ve bel sakatlanır.",
      "Dik inişte arabayı tek başınıza tutmaya çalışmayın; kaçan araba insanı ezer.",
      "Çocukları yükün üstüne oturtmayın; devrilmede altında kalırlar."
    ],
    keywords: ['el arabasıyla göç', 'el arabası yükleme', 'çekçekle eşya taşıma', 'el arabası devriliyor', 'yokuşta el arabası', 'arabayla yük taşıma yürüyerek', 'el arabasi yuk', 'pazar arabası ile taşıma'],
    sources: [
      "SafeWork SA — Pushing wheelbarrows (https://www.safework.sa.gov.au/workplaces/hazardous-manual-tasks/hazardous-manual-tasks-in-construction/task-specific-guidance/pushing-wheelbarrows)",
      "CCOHS — Pushing and pulling: handcarts (https://www.ccohs.ca/oshanswers/ergonomics/push2.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: yük tekerleğin (aksın) üstünde ve iki yana eşit, az yükle çok sefer, dolu arabanın 100 kg'ı aşabilmesi, dik yokuş ve yumuşak zeminden kaçınma, çukurlara tahta, lastik basıncı (SafeWork SA); itmeyi çekmeye tercih, tutamak 91–112 cm, inişte frenleme gereği, büyük tekerleğin kolaylığı (CCOHS). İple frenleme önerisi kaynaktaki fren ilkesinin el yapımı karşılığıdır." },
  },
  {
    id: 'sf-yy-yerlesim-yeri',
    category: 'sf-yy-yolculuk',
    title: "Yeni yerleşim yeri seçme",
    tag: "YERLEŞİM",
    summary: "Önce bütün yıl akan suyu bulun, sonra selden yüksek, hafif eğimli, toprağı ve yakacağı yakın bir yer seçin; karar vermeden önce en az bir mevsim gözleyin.",
    note: "Türkiye'de olağan koşullarda devlet ormanında yerleşmek, bina ya da ağıl yapmak ve tarla açmak 6831 sayılı Orman Kanunu md. 17 ile yasaktır; mera ve başkasının arazisine izinsiz yerleşmek de yasaktır. Bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    steps: [
      "Önce suyu bulun: bütün yıl akan kaynak ya da kuyu. Kaynağın yaz sonunda, en kurak zamanda da aktığını görün. Hiçbir ev su noktasından 200 m'den uzak olmasın.",
      "Selden uzak durun. Dere yatağının ve eski taşkın izlerinin (ağaçlara takılmış çöp, çamur çizgisi) üstünde kalın. Yağmurda bataklaşan düzlükleri seçmeyin.",
      "Hafif eğimli yer seçin: yüzde 2–4 eğim suyu akıtır. Yüzde 10'dan dik yamaç, dar vadi, heyelan ve kaya düşmesi izi olan yer olmaz.",
      "Yeraltı suyu yüzeyden en az 3 m aşağıda olsun. Yoksa tuvalet çukurları suyu kirletir. Kaynak ve kuyu tuvaletlerden yukarıda kalsın.",
      "Ekilebilir toprak arayın. Kişi başı yaklaşık 45 m² yer ayırın: 30 m² ev, yol ve ortak alan, 15 m² bahçe. Tarla bunun dışındadır.",
      "Yakacak, taş ve kil yürüme mesafesinde olsun. Ama en yakın ormanı tüketmeyin; uzaktan başlayıp sırayla kesin.",
      "Kuzey rüzgârını kesen bir tepe ya da ağaç perdesi ve güneye bakan yamaç arayın. Ev yeri ayrıntısı için \"Ev yeri seçme\" rehberine bakın.",
      "Yangını düşünün. Kuru otla ve çam ormanıyla iç içe kurmayın. Yapılar arasında en az 2 m, ya da yapı yüksekliğinin iki katı boşluk bırakın.",
      "Çevredeki toplulukları tanıyın. Onların suyuna, otlağına ve tarlasına el koymayın; ortak kullanımı konuşarak kararlaştırın.",
      "Karar vermeden önce en az bir mevsim, mümkünse bir yıl gözleyin: kaynak, sel, kar, rüzgâr ve don."
    ],
    art: ['sf-yy-yer-su', 'sf-yy-yer-sel', 'sf-yy-yer-egim', null, null, null, null, null, null, null],
    dont: [
      "Kuru mevsimde kurumuş dere yatağına yerleşmeyin; ilk sağanakta sel gelir.",
      "Kaynağın hemen yukarısına tuvalet, ahır ya da çöplük kurmayın.",
      "Başka bir topluluğun tek su kaynağının başına yerleşmeyin; çatışma çıkar."
    ],
    keywords: ['yerleşim yeri seçme', 'köy kuracak yer', 'nereye yerleşmeli', 'kamp yeri seçimi uzun dönem', 'yeni köy kurmak', 'yerleşim için su kaynağı', 'sel riski yer seçimi', 'yerlesim yeri secimi', 'topluluk için arazi'],
    sources: [
      "UNHCR — Camp Planning Standards (Planned Settlements), 2015 (https://sswm.info/sites/default/files/reference_attachments/UNHCR%202015c%20Camp%20Planning%20Standards%20%28Planned%20Settlements%29.pdf)",
      "Sphere — Water supply standard 1 (https://sphereprototype.conted.ox.ac.uk/standards/watersupply/accessAndWaterQuantity.html)",
      "Anayasa Mahkemesi 2001/406 E. kararı: 6831 md. 17 ve 93 metni (https://www.hukukihaber.net/aymnin-2001406-esas-200420-karar-sayili-karari)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: eğim %1–5 kabul, %2–4 ideal, %10'u aşmamalı; yeraltı suyu en az 3 m derinde; taşkın seviyesinin üstü; hiçbir konut su noktasından 200 m'den uzak değil; kişi başı 45 m² (30 + 15 m² bahçe); yapılar arası en az 2 m ya da yüksekliğin iki katı (UNHCR). Sphere üst sınırı 500 m; daha tutucu UNHCR değeri kullanıldı. Yasal not: 6831 md. 17 ormanda bina, ağıl ve tarla açma yasağı (AYM kararındaki metin)." },
  },

  // ───────────── KIŞ VE SOĞUK ─────────────
  {
    id: 'sf-yy-kar-ayakkabisi',
    category: 'sf-yy-kis',
    title: "Kar ayakkabısı yapma",
    tag: "KIŞ",
    summary: "Esnek bir dalı damla biçiminde bükün, enine çubuk ve iple ağ örün, ayakkabıyı yalnız burnundan bağlayın; topuk serbest kalsın.",
    note: "Türkiye'de olağan koşullarda devlet ormanında izinsiz ağaç ve dal kesmek 6831 sayılı Orman Kanunu md. 14 ile yasaktır; bu bilgi yalnız gerçek hayatta kalma durumu içindir.",
    steps: [
      "Kar ayakkabısını dize ya da baldıra kadar gömüldüğünüz yumuşak karda kullanın. Sert ve buzlu karda kaydırır, işe yaramaz.",
      "Malzeme toplayın: başparmak kalınlığında, yaklaşık 2 m uzunlukta esnek, taze bir dal (söğüt, fındık, kızılcık gibi). İp, bez şerit, kayış ya da tel.",
      "Dalı ortasından yavaşça bükün, iki ucunu üst üste getirip sıkıca bağlayın. Ön kısmı yuvarlak, arka kısmı sivri bir damla çıkar; boyu yaklaşık 1 m olur. Tek uzun dal yoksa yaklaşık 1 m'lik iki dalı iki uçtan birleştirin.",
      "Çerçeveye 4–6 enine çubuk bağlayın. Çubuk uçlarını çentikleyin ki çerçeveye otursun. Ayak burnunun ve topuğun basacağı iki çubuk daha kalın olsun.",
      "Enine çubukların arasını ip ya da ince dalla ağ gibi örün. Varsa arasına çam dalı sıkıştırın; ağırlığı daha geniş yayar.",
      "Ayakkabının burnunu öndeki kalın çubuğa çapraz (X) bağlayın, ipi topuğun arkasından dolayıp öne bağlayın. Topuk her adımda kalkabilsin; ayak burundan menteşe gibi oynasın.",
      "Acele durumda: yaklaşık 1 m'lik yapraklı bir çam dalını, yaprakları yukarı kıvrılacak biçimde ters koyun. Kalın ucunu ayakkabının bağcık deliklerinden geçen iple bağlayın.",
      "Yürürken ayakları biraz açık tutun, kar ayakkabısını yüksek kaldırmadan öne sürün. Önde iz açan çabuk yorulur; öncüyü sık sık değiştirin.",
      "Her akşam bağları ve çerçeveyi kontrol edin. Kopan ipi ve çatlayan çubuğu yenileyin."
    ],
    art: [null, null, 'sf-yy-kar-ayakkabi-cerceve', null, null, 'sf-yy-kar-ayakkabi-bag', 'sf-yy-cam-dali-ayakkabi', null, null],
    dont: [
      "Topuğu da sıkıca bağlamayın; ayak bilekten burkulur ve her adımda kar ayakkabısını kaldırmak zorunda kalırsınız.",
      "Kuru ve kırılgan dal kullanmayın; bükerken ya da yolda kırılır.",
      "Kar ayakkabısıyla buzlu yamaçta ve donmuş gölde yürümeyin; kayarsınız."
    ],
    keywords: ['kar ayakkabısı yapımı', 'karda batmadan yürümek', 'kar raketi yapma', 'dal ile kar ayakkabısı', 'derin karda yürüme', 'kar ayakkabisi', 'snowshoe yapımı', 'karda yürüme aracı'],
    sources: [
      "Art of Manliness — How to make improvised snowshoes (https://www.artofmanliness.com/skills/outdoor-survival/make-improvised-snowshoes/)",
      "Outdoor Life — How to make emergency snowshoes (https://outdoorlife.com/blogs/survivalist/2014/01/step-step-make-emergency-snowshoes)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: söğüt ve genç ağaç dalı, yaklaşık 7 ft (2 m) tek dal ya da iki 3 ft (1 m) dal, çentikli enine çubuklar, burunda X bağlama ve topuk arkasından dolama, topuğun kalkabilmesi (Art of Manliness); 1 m'lik çam dalının ters konup bağcıktan bağlanması (Outdoor Life). Genişlik ve çubuk sayısı kaynakta yok; uygulama tahmini. FM 21-76'nın kış bölümü açılamadı." },
  },
  {
    id: 'sf-yy-buz-kalinligi',
    category: 'sf-yy-kis',
    title: "Göl ve dere buzu: kalınlık testi ve güvenli geçiş",
    tag: "KIŞ",
    summary: "Berrak mavi buzda tek kişi için en az 15 cm, grup için 20 cm arayın, 10 cm'den ince buza hiç çıkmayın; beyaz ya da karlı buzda değerleri ikiye katlayın, gri buza ve akan su üstündeki buza hiç çıkmayın.",
    note: "Buz hiçbir zaman yüzde yüz güvenli değildir; bu sayılar yalnız yeni, berrak göl buzu içindir. Akarsu, kaynak ve dere ağzı buzunda kalınlık güvence vermez.",
    steps: [
      "Mümkünse buzdan geçmeyin, kıyıdan dolaşın. Akan suyun üstündeki buz (dere, nehir, kaynak çıkışı, göle su giren yer) hiçbir zaman güvenli değildir.",
      "Buzun rengine bakın. Berrak mavi ya da siyaha çalan buz en sağlamdır. Beyaz, bulanık (karla karışmış) buz yarı yarıya zayıftır. Gri buzun içinde su vardır: üstüne çıkmayın.",
      "Kalınlık sınırları (yeni, berrak buz): 10 cm'den ince buza hiç çıkmayın. Tutucu olun: tek kişi yürümek için en az 15 cm, grup ya da yük için en az 20 cm. Beyaz, bulanık ya da karla karışık buzda bu sayıları iki katına çıkarın: tek kişi 30, grup 40 cm. Akarsu buzunda hiçbir kalınlık yetmez.",
      "Kalınlığı ölçün. Kıyıdan başlayarak birkaç adımda bir buzu balta, keski ya da sivri demirle delin, işaretli bir çubukla kalınlığı okuyun. Aynı gölde buz kalınlığı yerden yere değişir.",
      "Zayıf yer belirtilerine dikkat edin: karla örtülü buz (kar ince yerleri ve çatlakları gizler), kıyı kenarları, sazlık, ağaç ve kaya çevresi, koyu lekeler, çatlaklar, buzun üstünde su birikintisi, su sesi.",
      "Geçmeden önce hazırlanın: boynunuza ipe bağlı iki buz dikeni asın (iki kısa tahta sap, ucuna sivri ucu dışarıda kalacak biçimde çakılmış çivi; taşırken uçlar tahta ya da mantar kılıfla örtülü olsun), elinize 3 m'lik bir sırık alın, ip bulundurun. Çantanın bel kemerini açın ki düşerseniz atabilesiniz.",
      "Tek tek ve birkaç metre arayla geçin. Önden giden beline ip bağlasın, ipin öbür ucunu kıyıdaki kişi tutsun.",
      "Buz çatırdarsa hemen yüzüstü yatın, kollarınızı açıp ağırlığınızı yayın ve geldiğiniz yöne sürünerek dönün.",
      "Buz havayla hızla değişir. Her seferinde yeniden ölçün. Erime başlayınca, ılık günlerden sonra ve öğleden sonra güneşinde buza çıkmayın."
    ],
    art: [null, 'sf-yy-buz-renk', 'sf-yy-buz-olcu', null, null, 'sf-yy-buz-dikeni', null, null, null],
    dont: [
      "\"Dün yürüdük, bugün de taşır\" demeyin; buz bir günde inceleyebilir.",
      "Buza grup hâlinde, yan yana ya da hayvan ve arabayla çıkmayın.",
      "Akan dere ve nehir buzuna kalınlığı ne olursa olsun güvenmeyin."
    ],
    keywords: ['buz kalınlığı', 'göl buzu üstünde yürümek', 'buz kaç cm olmalı', 'donmuş gölden geçmek', 'buz güvenli mi', 'dere buzu', 'buz kalinligi test', 'buzda yürüme', 'mavi buz beyaz buz'],
    sources: [
      "Minnesota DNR — Ice thickness guidelines (https://www.dnr.state.mn.us/safety/ice/thickness.html)",
      "Kanada Kızılhaçı — Is that ice safe? (https://redcross.ca/blog/2016/1/is-that-ice-safe)",
      "Minnesota DNR — Ice survival: buz dikeni (https://www.dnr.state.mn.us/safety/ice/survival.html)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: yalnız yeni berrak buz için 4 in (10 cm) altı 'uzak dur', 4 in yaya; beyaz buz yarı yarıya zayıf, beyaz buzda değerleri iki katına çıkar; akıntı ve kaynak buzu zayıflatır (Minnesota DNR, sayfa yeniden açıldı); tek kişi 15 cm, grup 20 cm, berrak mavi en sağlam, beyaz opak ya da kar buzu yarı güçte, gri buz güvensiz, yüzen buz kalınlığı ne olursa olsun yüzde yüz güvenli değil (Kanada Kızılhaçı, yeniden açıldı). Tutucu 15/20 cm ve beyaz buzda 30/40 cm yazıldı; akarsu buzuna sayı verilmedi." },
  },
  {
    id: 'sf-yy-buza-dusme',
    category: 'sf-yy-kis',
    title: "Buza düşünce kurtulma ve düşeni kurtarma",
    tag: "KIŞ",
    summary: "İlk dakika nefesinizi sakinleştirin, sonraki 10 dakikada geldiğiniz yöne dönüp tekmeleyerek buza çıkın ve yuvarlanarak uzaklaşın; düşeni kurtarmak için koşmayın, buza çıkmayın: kıyıda yere yatıp uzatın ya da atın.",
    critical: true,
    note: "Uzman gözetimi olmadan hipotermi tedavisi risklidir. Suya düşüp kurtarılan herkes, iyi görünse bile, mümkün olan en kısa sürede sağlık personeline gösterilmelidir.",
    steps: [
      "Suya düşünce ilk 1 dakika soğuk şoku olur: nefesiniz kesilir, hızlı hızlı solursunuz. Başınızı sudan yukarıda tutun, çırpınmayın, nefesinizi yavaşlatın. Şok yaklaşık 1 dakikada geçer.",
      "Sonraki yaklaşık 10 dakika kaslarınız hâlâ çalışır. Kendinizi kurtarmak için bu süreyi kullanın. Bilinç kaybı (hipotermi) yaklaşık 1 saat alır; panik yapmayın.",
      "Kışlık giysinizi çıkarmayın. İçindeki hava sizi yüzdürür ve ısıtır.",
      "Geldiğiniz yöne dönün; o taraftaki buz sizi az önce taşıdı. Kollarınızı kırılmamış buzun üstüne yayın.",
      "Bacaklarınızı arkada yatay tutup tekmeleyin ve buz dikenleriyle kendinizi buzun üstüne çekin. Giysiniz ağırsa dirseklerinize dayanıp suyun akmasını bekleyin, sonra ilerleyin.",
      "Buzun üstüne çıkınca ayağa kalkmayın. Delikten yuvarlanarak uzaklaşın, sonra kıyıya kadar yüzüstü sürünün.",
      "Buz kırılmaya devam ederse önünüzdeki buzu kırarak kıyıya doğru ilerleyin. Çıkamıyorsanız kollarınızı buzun üstünde tutup kımıldamadan yardım bekleyin, yüzünüzü sudan uzak tutun.",
      "Başkası düştüyse deliğin kenarına koşmayın, buza çıkmayın. Bağırıp yardım çağırın, ulaşabiliyorsanız 112'yi arayın. Kişiye seslenin: yardımın geldiğini söyleyin, kollarını buzda tutup tekmelemesini isteyin.",
      "Kıyıdan kurtarın. Uzanın: kıyıda yüzüstü yatıp sırık, dal, ip ya da birbirine bağlanmış giysi uzatın; sizi suya çekmeye başlarsa bırakın, yeniden deneyin. Ulaşamıyorsanız atın: ip ucunu ya da boş bidon gibi yüzen bir şeyi atın veya buzda kaydırın; ipi koltuk altından geçirip bağlamasını söyleyin. Buza çıkmak son çaredir: belinize bağlı ipi kıyıdakiler tutsun, yüzüstü sürünerek ya da uzun bir tahta veya merdiven üstünde yaklaşın; asla ayakta yürümeyin, koşmayın.",
      "Kurtarılan kişiyi yatar hâlde ve nazikçe, hemen sıcak, kuru ve rüzgârsız bir yere götürün. Orada ıslak giysiyi çıkarın, kurulayın, başı dahil battaniyeye sarın, gövdeden yavaşça ısıtın. Kol ve bacaklarını ovmayın. Normal nefes almıyorsa kalp masajına başlayın. Ayrıntı için \"Hipotermi\" rehberine bakın."
    ],
    art: [null, null, null, 'sf-yy-buz-cikis-kollar', null, 'sf-yy-buz-yuvarlan', null, null, 'sf-yy-buz-kurtarma-yatarak', null],
    dont: [
      "Düşeni kurtarmak için buzun üstüne yürümeyin; çoğu zaman ikinci kişi de düşer.",
      "Kıyıdan uzanırken ayakta durmayın; yere yatın, yoksa suya çekilirsiniz.",
      "Kurtarılan kişiyi ateşe yaklaştırıp kollarını bacaklarını ovarak ısıtmaya çalışmayın; ani ısıtma kalp ritmini bozabilir.",
      "Düşen bir hayvanı kurtarmak için buza çıkmayın; insan hayatını riske atmayın."
    ],
    keywords: ['buza düştüm', 'buz kırıldı suya düştü', 'buzdan nasıl çıkılır', 'buza düşen kişiyi kurtarma', 'donmuş göle düşme', 'buz kirildi', 'soğuk suya düşme', 'buz altına düşen çocuk', '1-10-1 kuralı'],
    sources: [
      "Minnesota DNR — Ice safety: survival plan (https://www.dnr.state.mn.us/safety/ice/survival.html)",
      "Minnesota DNR — What if someone else falls in? (https://dnr.state.mn.us/safety/ice/saving.html)",
      "Kanada Kızılhaçı — Emergencies on the ice (https://redcross.ca/blog/2016/1/emergencies-on-the-ice)",
      "Royal Life Saving Society UK — The dangers of frozen water (https://www.rlss.org.uk/News/the-dangers-of-frozen-water)",
      "Canadian Safe Boating Council — 1-10-1 principle (https://csbc.ca/1-10-1-principle/)",
      "McGill OSS — Cold water immersion (https://www.mcgill.ca/oss/node/9396)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kışlık giysiyi çıkarmama, geldiği yöne dönme, kolları buza yayma, tekme ve buz dikeniyle çekilme, dirseklerde suyun akmasını bekleme, yuvarlanarak uzaklaşma, ısınırken soğuk kanın kalbe dönüp ritmi bozabilmesi (Minnesota DNR survival, yeniden açıldı); kenara koşmama, seslenip cesaretlendirme, uzat-at, sizi çekerse bırakma, ipi kişiye bağlatma, eğitimsiz kişinin buza çıkmaması, hayvan için risk almama (Minnesota DNR saving); kıyıdan yatarak uzatma, buza çıkmak zorunluysa yüzüstü yaklaşma (Kanada Kızılhaçı); yüzen nesne kaydırma, kırarak ilerleme, sıcak yere varmadan soyma, ovmama, yavaş ısıtma, nefes kontrolü (RLSS UK); 1 dk, 10 dk, yaklaşık 1 saat (CSBC, yeniden açıldı). Çıkamayınca kolları buzda tutma yaygın öneri; RLSS kolları yanda tutmayı söylüyor, çelişki raporda." },
  },
  {
    id: 'sf-yy-siper-ayagi',
    category: 'sf-yy-kis',
    title: "Ayağı kuru tutmak: siper ayağı",
    tag: "KIŞ",
    summary: "Ayak saatlerce ıslak kalırsa donmadan da zarar görür; günde en az bir kez ve her ıslandığında kuru çoraba geçin, gece ayakları çıplak ve kuru tutun.",
    note: "Siper ayağı kalıcı doku hasarına ve kangrene yol açabilir. Su toplama, kararma, kötü koku ya da ateş varsa uzman gözetimi olmadan tedaviye çalışmayın; sağlık personeline ulaşın.",
    steps: [
      "Tehlikeyi bilin: ayak uzun süre ıslak ve serin kalırsa 16°C'ye kadar havada bile siper ayağı gelişir. Islak çizme ve çorap ana nedendir.",
      "Günde en az bir kez, ıslandığında hemen kuru çoraba geçin. Yanınızda en az iki çift yedek çorap taşıyın.",
      "Islak çorabı giysinizin içinde, gövdenize yakın bir cepte ya da çantanın dışında kurutun.",
      "Molada ayakkabıyı çıkarın, ayakları havalandırıp kurulayın ve yükseğe koyun.",
      "Ayakları her akşam yıkayın ve parmak aralarına kadar kurulayın. Gece çorapsız, ayaklar kuru ve hafif yüksekte uyuyun.",
      "Belirtileri tanıyın: karıncalanma, kaşıntı, ağrı, şişlik, soğuk ve lekeli deri, uyuşma, ayakta ağırlık. Isınınca ayak kızarır, kurur ve ağrır; su toplayabilir.",
      "Belirti varsa ıslak ayakkabı ve çorabı hemen çıkarın. Ayağı temizleyip iyice kurulayın.",
      "Ayağı oda sıcaklığında, ılık ve kuru bir yerde havayla kurutup kendiliğinden ısınmaya bırakın. Ayağı suya sokmayın, ateşe ya da sobaya tutmayın; ısınırken kızarıp ağrıması beklenen bir durumdur.",
      "Ayağın üstünde yürümeyin, yüksekte tutun, çorapsız dinlendirin. Her gün kızarıklık, şişlik, irin ve koku açısından bakın."
    ],
    art: [null, 'sf-yy-corap-degistir', null, 'sf-yy-ayak-havalandir', null, null, null, 'sf-yy-ayak-oda-isisi', null],
    dont: [
      "Islak ayakkabı ve çorapla uyumayın.",
      "Uyuşmuş ayağı ateşe, sobaya ya da sıcak suya tutmayın; hissetmediği için yanar. Islak ve yumuşamış ayağı suda bekletmeyin.",
      "Ayağı sıkan, kan dolaşımını kesen dar ayakkabı ve üst üste çok çorap giymeyin."
    ],
    keywords: ['siper ayağı', 'ıslak ayak hastalığı', 'ayağım sürekli ıslak', 'ayak şişti uyuştu soğuk', 'trench foot', 'çizmede ayak çürümesi', 'ayak kuru tutmak', 'siper ayagi', 'ayak ıslak kaldı karıncalanıyor'],
    sources: [
      "CDC — Trench foot or immersion foot (arşiv) (https://webarchive.library.unt.edu/eot2008/20090109222132mp_/http://emergency.cdc.gov/disasters/trenchfoot.asp)",
      "OSHA — Cold Stress Card (https://www.osha.gov/Publications/OSHA3156.pdf)",
      "MSD (Merck) Manual Professional — Nonfreezing tissue injuries (https://www.merckmanuals.com/professional/injuries-poisoning/cold-injury/nonfreezing-tissue-injuries)",
      "ABD Joint Trauma System — Frostbite and immersion foot CPG eğitim sunumu, 2017 (https://jts.health.mil/assets/docs/cpgs/training/Frostbite_Immersion_Foot_Care_CPG_Training_26_Jan_2017.pdf)",
      "New York DMNA — Cold Injury lesson plan (https://dmna.ny.gov/foodservice/docs/Field_Sanitation_Team_Certification_Course/Instructor_Manual/LO12LP_Cold_Injury_LP.pdf)",
      "University of Iowa — Cold stress (https://hwc.public-health.uiowa.edu/cold-stress/)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: 60°F (16°C) kadar ılık havada bile sürekli ıslak ayakta oluşabilmesi; ıslak ayakkabı ve çorabı çıkarıp ılık ortamda havayla kurutma, ayağı yükseltme, yürümeme, sağlık yardımı (OSHA, yeniden açıldı); belirtiler, temizleyip kurulama, her gün kuru çorap, uyurken çorapsız, havayla kurutup yükseltme (CDC arşiv, yeniden açıldı). CDC arşivindeki 39–43°C suda 5 dakika önerisi, daha yeni Merck/MSD ('oda sıcaklığında pasif ısıtma ve yükseltme') ve ABD askerî JTS ('donmanın aksine oda sıcaklığında havayla kurut') ile çeliştiği için tutucu olan pasif ısıtmaya çevrildi. 'En az iki çift yedek' yazar önerisi." },
  },
  {
    id: 'sf-yy-karda-yolculuk',
    category: 'sf-yy-kis',
    title: "Karda ve soğukta yolculuk: ter, kar körlüğü ve su",
    tag: "KIŞ",
    summary: "Terlemeden yürüyün, bulutlu günde bile gözleri yarıklı gözlükle koruyun, karı eritip için ve hava kararmadan çok önce barınağa geçin.",
    note: "Kar körlüğü genellikle geçicidir ama ağrı ya da görme kaybı 2 günden uzun sürerse uzman gözetimi olmadan tedaviye çalışmayın; sağlık personeline ulaşın.",
    steps: [
      "Terlemeden yürüyün. Yola çıkmadan bir kat çıkarın, ısınınca bir kat daha açın. Mola verince hemen kat giyin. Islak giysi ısıyı çabuk kaybettirir.",
      "Gözleri koruyun. Kar ışığı yansıtır; bulutlu günde bile kar körlüğü olur. Güneş gözlüğü yoksa yarıklı gözlük yapın.",
      "Yarıklı gözlük: tahta, kalın deri ya da kartondan iki gözü örten bir şerit kesin. Yüze oturacak biçimde hafif kavisli olsun, ışık yanlardan girmesin. Her göz hizasına ince, yatay bir yarık açın; yarık ne kadar dar olursa koruma o kadar iyi, görüş o kadar dar olur. Parlamayı azaltmak için iç yüzünü isle karartın. İki ucuna ip bağlayıp başın arkasından bağlayın.",
      "Yarıklı gözlükle görüş alanı daralır; adımınıza ve ayağınızın altına daha dikkatli bakın.",
      "Kar körlüğünü tanıyın: gözde ağrı, kızarıklık, kum batması, sulanma, bulanık görme, ışığa bakamama. Belirtiler çoğu zaman güneşte kalındıktan saatler sonra, akşam başlar. Kişiyi karanlık bir yerde dinlendirin, varsa kontakt lensini çıkarın, kapalı gözlerine soğuk ıslak bez koyun, gözlerini ovdurmayın. Genellikle 1–2 günde geçer; yola devam edecekse gözlerini gözlük ya da bezle koruyun.",
      "Su için. Soğukta susuzluk hissi azalır ama su kaybı sürer. İdrar karda koyu sarı iz bırakıyorsa susuz kalıyorsunuz.",
      "Rüzgârda yüzü ve boynu kapatın. Birbirinizin burnuna, yanağına ve kulağına bakın; beyaz, mumsu leke soğuk ısırığıdır (bkz. \"Soğuk ısırığı\").",
      "Kış günü kısadır. Hava kararmadan çok önce durun, barınağı gün ışığında kurun.",
      "Tipi başlarsa yolu kaybetmeden durun ve barınak kurun (bkz. \"Kar barınağı\")."
    ],
    art: ['sf-yy-kat-ac-kapa', null, 'sf-yy-yarikli-gozluk', null, null, null, null, null, null],
    dont: [
      "Bulutlu ya da sisli diye gözlüksüz uzun kar yürüyüşü yapmayın; bulutlu günde de morötesi ışık gözü yakar.",
      "Gözü ağrıyan kişinin gözünü ovdurmayın, ışığa baktırmayın.",
      "Susuz kaldığınızda kar yemeyin; eritip için.",
      "Terli içlikle mola vermeyin; önce kuru kat giyin."
    ],
    keywords: ['kar körlüğü', 'karda yürüyüş', 'kar gözlüğü yapma', 'gözlerim karda yanıyor', 'soğukta terleme', 'kışın yolculuk', 'yarıklı gözlük', 'kar korlugu', 'karda göç'],
    sources: [
      "Cleveland Clinic — Photokeratitis (https://my.clevelandclinic.org/health/diseases/15763-photokeratitis)",
      "Wikipedia — Snow goggles (https://en.wikipedia.org/wiki/Snow_goggles)",
      "FM 21-76 Cold weather injuries: dehydration (https://www.wilderness-survival.net/cold-6.php)",
      "New York DMNA — Cold Injury lesson plan: kar körlüğü bulutlu günde de olur (https://dmna.ny.gov/foodservice/docs/Field_Sanitation_Team_Certification_Course/Instructor_Manual/LO12LP_Cold_Injury_LP.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: belirtiler (ağrı, kızarıklık, sulanma, bulanık görme, ışık hassasiyeti, kum hissi) 6–24 saat sürer, genellikle 48 saatte geçer; karanlık oda, kontakt lensi çıkarma, ovmama, kapalı göze soğuk bez; 2 günü aşan ağrı ya da görme kaybında doktor; bulutlu günde de koruma (Cleveland Clinic, yeniden açıldı); yarıklı gözlüğün yüze oturması, dar yatay yarık, isle karartma, görüş daralması ve tökezleme riski (Wikipedia Snow goggles, yeniden açıldı). Belirtilerin saatler sonra başlaması yaygın bilgi, açılan kaynakta sayı yok; karda koyu sarı idrar susuzluk belirtisi (FM 21-76). Kat açıp kapama genel soğuk hava ilkesi." },
  },

  // ───────────── YERLEŞİM GÜVENLİĞİ ─────────────
  {
    id: 'sf-yy-fark-edilmez',
    category: 'sf-yy-guvenlik',
    title: "Yerleşimi fark edilmez kılmak: duman, ışık, ses",
    tag: "GÜVENLİK",
    summary: "Kuru odunla az dumanlı ateş yakın, geceleri ışığı perdeleyin, gürültülü işi gündüze alın; amaç istenmeyen dikkat çekmemek ve çatışmadan kaçınmaktır.",
    note: "Bu rehberin amacı saklanmak ve çatışmadan kaçınmaktır. Yangın, hastalık ya da yaralanma gibi bir acil durumda gizliliği hemen bırakıp yardım çağırın.",
    steps: [
      "Yalnız kuru odun yakın: en az 6 ay kurumuş, koyulaşmış, hafiflemiş, birbirine vurunca boş ses veren odun. Yaş odun, yaprak ve çöp çok duman çıkarır.",
      "Ateşi küçük ve harlı tutun, odunu ince yarın. İçin için yanan ateş en çok dumanı verir.",
      "Bilin ki gündüz duman uzaktan görünür; iyi havada bir gözcü dumanı 20–25 km'den fark edebilir. Ocağı ağaç dallarının altında değil, çevresi kuru ottan temizlenmiş açık bir yerde kurun; kıvılcım dallara sıçrar. Dumanın göze batmayacağı saatlerde ve az yakıtla pişirin.",
      "Gece ışık çok uzaktan görünür. Pencereleri kalın perde, battaniye ya da tahta kepenkle kapatın. Işığı dışa bakan pencere yerine iç odada yakın.",
      "Kapı açılırken içerideki ışığı kısın. Dışarıda feneri yere doğru tutun, ışığını bezle kısın.",
      "Gürültülü işleri (balta, testere, çekiç) gündüz ve belli saatlerde yapın. Gece sesli konuşmayı ve müziği içeride, alçak sesle yapın.",
      "Yoldan görünen yerlerde renkli branda, çamaşır, çöp ve alet bırakmayın. Ana yoldan yerleşime giden patikayı yoldan dümdüz görünür kılmayın.",
      "Saklanmak tek başına güvenlik değildir. Çevredeki topluluklarla tanışmak, takas ve yardımlaşma çoğu zaman daha güvenlidir (bkz. \"Yabancılarla karşılaşma ve çatışmadan kaçınma\")."
    ],
    art: ['sf-yy-kuru-odun', null, null, 'sf-yy-pencere-perde', null, null, null, 'sf-yy-komsu-takas'],
    dont: [
      "Dumanı azaltmak için ateşi kapalı mekânda, bacasız ya da kapısı kapalı yerde yakmayın; karbonmonoksit öldürür.",
      "Gizlilik için hasta ya da yaralıyı yardımsız bırakmayın.",
      "Başkalarının yerleşimini gözetlemeye, izlemeye kalkmayın; düşmanlık doğurur."
    ],
    keywords: ['yerleşimi gizlemek', 'dumanı azaltmak', 'gece ışık görünmesin', 'fark edilmemek', 'kampı saklamak', 'dikkat çekmemek', 'dumansız ateş', 'ışık disiplini', 'sessiz yaşamak yerleşim'],
    sources: [
      "ABD EPA Burn Wise — Best wood burning practices (https://www.epa.gov/burnwise/best-wood-burning-practices)",
      "Factors influencing the discovery of forest fires by lookout observers, 1938 (https://firelookout.org/wp-content/uploads/2026/05/FACTORS-INFLUENCING-THE-DISCOVERY-OF-FOREST-FIRES-BY-LOOKOUT-OBSERVERS-1938.pdf)",
      "Garda (İrlanda polisi) — Home gardens and landscaping: görünürlük (https://garda.ie/en/crime-prevention/crime-prevention/hs6-home-gardens-and-landscaping-2020.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: %20 altı nem, en az 6 ay kurutma, kuru odunun koyu, hafif ve boş sesli olması, yaş odun ve için için yanan ateşten kaçınma (EPA); gözcünün etkili görüşü yaklaşık 15 mil (24 km) (1938 gözetleme çalışması). Bağımsız doğrulamada yazarın 'ocağı ağaç altında kurun' önerisi yangın riski nedeniyle çıkarıldı (pakette 'Yerleşim yeri seçme' ve 'Yangın gözetleme' ile çelişiyordu). Işık perdeleme genel uygulama; ayrıca doğrulanmadı." },
  },
  {
    id: 'sf-yy-alarm-duzenek',
    category: 'sf-yy-guvenlik',
    title: "Basit alarm düzenekleri: yalnız ses çıkaran",
    tag: "GÜVENLİK",
    summary: "Çakıl yol, kapıya asılı teneke ve çan gibi yalnız ses çıkaran düzeneklerle erken uyarı alın; kimseyi düşürecek ya da yaralayacak hiçbir düzenek kurmayın.",
    note: "Bu düzenekler yalnız ses çıkararak uyarır. İnsanı ya da hayvanı düşürecek, yaralayacak, kapana kıstıracak düzenek kurmayın: kendi çocuklarınız ve komşularınız da zarar görür; biri yaralanır ya da ölürse Türk Ceza Kanunu'na göre yaralama ya da öldürme suçu olur.",
    steps: [
      "En basit uyarıcıyla başlayın: kapı önüne ve yerleşime giden yola çakıl döşeyin. Üstünden sessiz geçilemez.",
      "Kapının iç yüzüne bir çan ya da iç içe birkaç teneke asın. Kapı açılınca çalsın.",
      "Teneke dizisi: 3–4 boş tenekenin her birine bir taş ya da birkaç vida koyun, ağızlarını ezip kapatın, bir ipe dizin. Ambar, kiler ve ahır kapısının arkasına asın.",
      "İpli zil: bahçe ya da ağıl kapısının kanadına ince bir ip bağlayın, ipi direğe takılı bir makaradan ya da halkadan geçirip ucuna teneke dizisini asın. Kapı açılınca teneke sallanır.",
      "İp ve teli asla yolun ya da patikanın karşısına germeyin. Yalnız kapı, kapak ve pencere kanatlarına bağlayın.",
      "Köpek ve kaz da yabancı geldiğinde ses çıkarır. Onları besleyip bakarak erken uyarıcı olarak yararlanın.",
      "Sık bir çalı çiti (alıç, karaçalı, kuşburnu) geçişi yavaşlatır ve çevreyi belirler. Ama görüşü kapatacak kadar uzatmayın.",
      "Herkes sesleri tanısın. Alarm çalınca kimse koşarak dışarı fırlamasın: nöbetçi bakar, ışık tutar, sakin bir sesle seslenir (bkz. \"Nöbet ve güvenlik düzeni\").",
      "Düzenekleri her gün kontrol edin. Rüzgârla ya da hayvanla sık çalanın yerini değiştirin. Çocuklara gösterin, kendi insanlarınız gece nasıl sessiz geçeceğini bilsin."
    ],
    art: ['sf-yy-cakil-yol', null, 'sf-yy-teneke-dizisi', 'sf-yy-kapi-ip-zil', null, null, null, null, null],
    dont: [
      "Yolun ya da patikanın karşısına ip, tel ya da kablo germeyin; gece biri düşüp yaralanır.",
      "Çukur, sivri kazık, cam kırığı ya da elektrikli tel gibi yaralayıcı hiçbir şey kurmayın.",
      "Alarm çaldığında tek başınıza karanlığa koşmayın; önce ses verin ve ışık tutun."
    ],
    keywords: ['alarm düzeneği yapma', 'kapıya çıngırak', 'teneke alarm', 'elektriksiz alarm', 'biri gelirse duyayım', 'gece hırsız uyarısı', 'çakıl yol güvenlik', 'kapı açılınca ses', 'basit alarm'],
    sources: [
      "Garda (İrlanda polisi) — Home gardens and landscaping (https://garda.ie/en/crime-prevention/crime-prevention/hs6-home-gardens-and-landscaping-2020.pdf)",
      "Avon and Somerset Police — Garden security (https://www.avonandsomerset.police.uk/crime-prevention-advice/home-protection/garden-security/)",
      "TCK md. 85 taksirle öldürme ve md. 89 taksirle yaralama özetleri (https://hukukcularevi.com/taksirle-oldurme-ve-yaralama-tck-85-89-trafik-kazalari-ve-taksir/)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: rehberde yalnız ses çıkaran düzenek var; yaralayıcı, düşürücü ya da kapan tipi düzenek yok, yol karşısına ip germe ve kazık, cam, elektrikli tel açıkça yasaklanmış. Yasal not 'suçtur' genellemesinden, sonuç doğurursa TCK yaralama ve öldürme hükümlerine (md. 85, 89 varlığı teyitli; mevzuat.gov.tr açılmadı) bağlandı. Yazarın kaynakları: çakıl yol ve patikanın sessiz yaklaşmayı önlemesi, sık dikenli çit (alıç, karaçalı), çalı ve ağaçları görüşü kapatmayacak biçimde budama (Garda, Avon and Somerset Police). Teneke ve ipli zil düzenekleri geleneksel yöntem; kaynakla ayrıca doğrulanmadı. Köpek ve kazın bekçi olarak kullanımı yaygın bilgi; kaynak açılmadı." },
  },
  {
    id: 'sf-yy-stok-hirsizlik',
    category: 'sf-yy-guvenlik',
    title: "Stokları hırsızlıktan korumak: bölmek, kilitlemek, kaydetmek",
    tag: "GÜVENLİK",
    summary: "Stoku birkaç ayrı depoya bölün, girişi sınırlayın, sağlam kilit kullanın, her şeyi kaydedin ve haftada bir sayın; adil dağıtım hırsızlığı en iyi önleyen şeydir.",
    steps: [
      "Bütün stoku tek yerde tutmayın. En az iki-üç ayrı depoya bölün; birini kaybederseniz ötekiler kalır.",
      "Depoya girişi sınırlayın. Yalnız görevli kişiler girsin, anahtar iki kişide olsun.",
      "Kapıya sağlam sürgü ya da asma kilit takın. Pencerelere demir parmaklık ya da sık tel geçirin, içine perde asın ki içerisi görünmesin.",
      "Her şeyi kaydedin: giren, çıkan, kim aldı. İstifleri hep aynı düzende yapın ki bir bakışta sayılsın. Haftada bir sayım yapın (bkz. \"Ortak ambar ve kayıt\").",
      "Değerli aletleri işaretleyin: çentik, kazıma ya da yakma damga. Listesini tutun.",
      "Deponun kapısı yerleşimin içine baksın, yoldan görünmesin. Ne kadar stokunuz olduğunu topluluk dışında anlatmayın.",
      "Bir yedek stok ayırın. Kuru ve kemirgen geçirmez kapalı kaplarda başka bir yerde saklayın; yerini en az iki kişi bilsin.",
      "Kapılara sesli alarm asın ve nöbet düzeni kurun (bkz. \"Basit alarm düzenekleri\").",
      "Dağıtımı herkesin görebileceği biçimde adil yapın. Aç kalan biri çalarsa ceza değil çözüm arayın; kararı topluluk birlikte versin. Yakaladığınız kimseye zarar vermeyin."
    ],
    art: ['sf-yy-stok-bol', null, 'sf-yy-depo-kilit', 'sf-yy-stok-defter', null, null, null, null, null],
    dont: [
      "Bütün yiyeceği tek bir çadıra ya da tek bir odaya koymayın.",
      "Anahtarı tek bir kişiye bırakmayın; o kişi hastalanırsa ya da kaybolursa stoka ulaşamazsınız.",
      "Hırsızı kendi başınıza cezalandırmaya, dövmeye, kapatmaya kalkmayın; bu da suçtur ve topluluğu böler."
    ],
    keywords: ['stok hırsızlık', 'erzak çalınmasın', 'ambar güvenliği', 'yiyecek deposu kilit', 'stok sayımı', 'erzağı korumak', 'depo hırsızlığı önleme', 'stoklari korumak', 'gizli yedek erzak'],
    sources: [
      "FAO — Storage of grain: depoya yetkisiz girişin kısıtlanması, haftalık denetim (https://www.fao.org/docrep/pdf/010/a1417e/a1417e06.pdf)",
      "CARE Emergency Toolkit — Piling systems for ease of checking (https://www.careemergencytoolkit.org/programme-support/1-logistics/6-warehousing-and-storage/6-6-piling-systems-for-ease-of-checking/)",
      "Garda (İrlanda polisi) — Home gardens and landscaping: kilit, ızgara, eşya işaretleme (https://garda.ie/en/crime-prevention/crime-prevention/hs6-home-gardens-and-landscaping-2020.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: gereksiz kişilerin depoya girmemesi, en az haftada bir denetim (FAO); istiflerin sayımı kolaylaştıracak biçimde standart yapılması (CARE); kilitli depo, pencereye ızgara ve içine perde, değerli eşyanın işaretlenip fotoğraflanması (Garda). Stoku bölme ve adil dağıtım önerileri genel ilke; ayrıca doğrulanmadı." },
  },
  {
    id: 'sf-yy-stok-kemirgen-nem',
    category: 'sf-yy-guvenlik',
    title: "Depoyu kemirgen ve nemden korumak",
    tag: "GÜVENLİK",
    summary: "Fare 6 mm, sıçan 12 mm'lik delikten geçer; bütün açıklıkları tel ve harçla kapatın, yiyeceği kapalı metal ya da cam kaplarda yerden yükseltilmiş tutun ve haftada bir denetleyin.",
    steps: [
      "Delikleri arayın. Fare kurşun kalem kalınlığındaki (6 mm) delikten, sıçan 12 mm'lik delikten geçer. Duvar diplerini, kapı altını, boru ve kiriş çevresini tek tek kontrol edin.",
      "Küçük delikleri çelik tel yumağıyla sıkıca tıkayın, üstünü çimento, kireç harcı ya da çamur sıvayla kapatın. Tel tek başına geçicidir.",
      "Büyük açıklıklara sac, metal levha ya da 6 mm gözlü tel kafes çakın. Havalandırma deliklerine de 6 mm tel geçirin, kapı altına sac şerit çakın.",
      "Yiyeceği kalın plastik, metal ya da cam, sıkı kapaklı kaplarda tutun. Çuvalı doğrudan toprağa ya da duvara dayamayın.",
      "İstifi palet, ızgara ya da kütükler üstüne kurun. Büyük depoda istifleri duvardan, birbirinden ve saçaktan 1 m uzak tutun ki çevresinde dolaşıp bakabilesiniz.",
      "Nemi önleyin. Tahıl depoya kuru girsin. Çatı akmasın, depo havadar olsun. Duvar dibinde ıslaklık, küf kokusu ve ıslak çuval nem belirtisidir.",
      "Haftada en az bir kez depoyu ve stoku denetleyin: fare dışkısı, kemirik izi, ıslaklık, böcek, küf.",
      "Çevreyi temiz tutun. Depo dibindeki ot, çöp ve odun yığını kemirgene yuva olur; bitkileri duvardan en az 45 cm uzak tutun.",
      "Fare dışkısını kuru süpürmeyin. Eldiven takın, depoyu 30 dakika havalandırın, dışkıyı 1 ölçü çamaşır suyu ve 9 ölçü su karışımıyla ıslatıp 5 dakika bekletin, sonra bezle toplayın."
    ],
    art: ['sf-yy-delik-boyu', 'sf-yy-delik-kapat', null, null, 'sf-yy-istif-palet', null, null, null, null],
    dont: [
      "Fare zehrini yiyecek deposuna, çocukların ve hayvanların ulaşabileceği yere koymayın.",
      "Fare dışkısını kuru süpürmeyin; tozu solunursa hastalık bulaştırabilir.",
      "Nemli tahılı kuruması için depoya koymayın; küflenir ve bütün istifi bozar."
    ],
    keywords: ['depoya fare giriyor', 'fare deliği kapatma', 'kilerde fare', 'ambar nem', 'erzak küflendi', 'sıçan kaç cm delikten geçer', 'fare dışkısı temizleme', 'depo kemirgen', 'fare girmesin'],
    sources: [
      "CDC — How to seal up to prevent rodents (https://www.cdc.gov/healthy-pets/rodent-control/seal-up.html)",
      "CDC — How to clean up after rodents (https://www.cdc.gov/healthy-pets/rodent-control/clean-up.html)",
      "Texas A&M School IPM — Rodent pest proofing fact sheet (https://schoolipm.tamu.edu/files/2017/09/Rodent-pest-proofing-fact-sheet-draft_.pdf)",
      "FAO — Storage of grain (https://www.fao.org/docrep/pdf/010/a1417e/a1417e06.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: fare 6 mm (CDC); sıçan 1/2 in, fare 1/4 in, 1/4 in tel kafes, çelik tel tek başına geçici, bitkiler binadan 18 in (45 cm) uzak (TAMU); sıkı kapaklı metal, cam, kalın plastik kap, çelik tel + dolgu, büyük deliğe sac ya da tel (CDC); istifler arası, duvardan ve saçaktan 1 m, palet ya da kütük üstü, haftalık denetim, açıklıklara tel (FAO); 30 dk havalandırma, 1:9 çamaşır suyu, 5 dk bekletme, süpürmeme (CDC)." },
  },
  {
    id: 'sf-yy-yangin-gozetleme',
    category: 'sf-yy-guvenlik',
    title: "Yangın gözetleme ve erken uyarı",
    tag: "GÜVENLİK",
    summary: "Kuru mevsimde geniş gören bir noktada gözcü tutun, dumanın yönünü yön levhasından okuyun, iki gözcünün yön çizgilerini kesiştirerek yeri bulun ve kararlaştırılmış sesle alarm verin.",
    steps: [
      "Gözetleme yeri seçin: yerleşimi, ormanı ve tarlaları geniş gören bir tepe ya da sağlam bir platform. Gözcü iyi havada dumanı en fazla yaklaşık 24 km'den fark eder; uzak duman ancak büyüyünce görünür.",
      "Kuru, sıcak ve rüzgârlı günlerde gündüz boyunca gözcü tutun. Gözcüler sık değişsin; yorgun göz dumanı kaçırır.",
      "Bir yön levhası yapın: gözetleme yerindeki tahtaya kuzeyi ve çevredeki belirgin yerleri (tepe, köy, dere, büyük ağaç) çizin. Duman görünce yönünü buradan okuyun.",
      "Ufku düzenli aralıklarla, parça parça ve sırayla tarayın. Kuru ot ve anız üstündeki duman koyu ormandakinden daha geç fark edilir; buralara özellikle bakın.",
      "İki gözetleme yeri varsa ikisi de dumanın yönünü bildirsin. Haritada iki yön çizgisinin kesiştiği yer yangının yeridir.",
      "Raporu hep aynı sırayla verin: nerede (yön ve en yakın yer işareti), ne büyüklükte, dumanın rengi ve davranışı (ince beyaz, koyu, yükselen sütun), ne yanıyor (ot, çalı, orman), rüzgâr ne yöne, tehlikedeki ev, ahır ve ambar.",
      "Yangın yerleşime doğru geliyorsa beklemeden, önceden kararlaştırılmış sesle (çan, düdük dizisi) alarm verin (bkz. \"Duman ve ses işaretleri, topluluk alarmı\").",
      "Kuru ve rüzgârlı gecelerde de bakın. Gece alevin parıltısı uzaktan görünür.",
      "Kendi ateşinizi denetleyin: yangın mevsiminde açık ateşi azaltın, ocak çevresini temizleyin, her ateşin başında su ve kürek bulundurun (bkz. \"Yangın mevsiminde yerleşimi korumak\")."
    ],
    art: ['sf-yy-gozcu-tepe', null, 'sf-yy-yon-levhasi', null, 'sf-yy-iki-gozcu-kesisim', null, null, null, null],
    dont: [
      "Dumanı gördükten sonra \"büyürse haber veririm\" diye beklemeyin.",
      "Yangını söndürmeye tek başınıza gitmeyin; önce alarm verin.",
      "Gözetleme kulesini kuru, çürük dallardan yapmayın; düşme tehlikesi vardır."
    ],
    keywords: ['yangın gözetleme', 'yangın kulesi', 'orman yangını erken uyarı', 'duman görürsem ne yapmalıyım', 'yangın gözcüsü', 'yangın nöbeti', 'dumanın yerini bulmak', 'yangin gozetleme', 'yangın alarmı köy'],
    sources: [
      "Wikipedia — Osborne Fire Finder: yön ve kesişim yöntemi (https://en.wikipedia.org/wiki/Osborne_Fire_Finder)",
      "Factors influencing the discovery of forest fires by lookout observers, 1938 (https://firelookout.org/wp-content/uploads/2026/05/FACTORS-INFLUENCING-THE-DISCOVERY-OF-FOREST-FIRES-BY-LOOKOUT-OBSERVERS-1938.pdf)",
      "Fire reporting pamphlet 2019: rapor içeriği (https://yyb.ca/media/1493/fire-reporting-pamphlet-2019-print-85x11.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: gözcünün etkili görüş yarıçapı yaklaşık 15 mil (24 km), kuru ot üstündeki dumanın koyu orman zeminine göre geç fark edilmesi (1938 çalışması); iki gözetleme yerinin yön çizgilerinin kesişimiyle yer bulma (Osborne Fire Finder); rapor: yer, büyüklük, duman rengi ve davranışı, yanan bitki türü, tehlikedeki yapılar (yangın bildirim broşürü). Tarama düzeni ve gözcü değişimi genel uygulama." },
  },

  // ───────────── MORAL VE ÇOCUKLAR ─────────────
  {
    id: 'sf-yy-oyuncak',
    category: 'sf-yy-moral',
    title: "El yapımı oyuncak: bez bebek, bez top, topaç, çember",
    tag: "ÇOCUK",
    summary: "Bez, tahta ve iple oyuncak yapın; 3 yaşından küçük çocuğun oyuncağında tuvalet kâğıdı rulosundan geçebilecek hiçbir parça olmasın.",
    steps: [
      "Önce güvenlik: 3 yaşından küçük çocuğa vereceğiniz oyuncağı ve parçalarını tuvalet kâğıdı rulosunun içinden geçirin. Geçiyorsa boğulma tehlikesi vardır; vermeyin. Düğme, boncuk, çakıl, fındık ve kopabilecek parça olmasın.",
      "Bez bebek: bir bez parçasını rulo yapın. Bir ucundan biraz aşağıyı iple boğup baş yapın. Kollar için başka bir ruloyu çapraz geçirip bağlayın. Üstüne bir bez giydirin; gözü ve ağzı iplikle işleyin.",
      "Bez top: eski çorabın içini bez ve yün kırpıntısıyla sıkıca doldurun, ağzını dikin ya da bağlayın. Yumuşak top içeride de oynanır, kimseyi incitmez.",
      "Topaç: tahta bir makara ya da yuvarlak tahta parçasının tam ortasından kısa bir çubuk geçirin. Alt ucu hafif sivri ama kör olsun. Parmakla ya da sarılan bir iple çevirin.",
      "Çember: fıçı çemberi ya da esnek dalı halka yapıp uçlarını bağlayın; çocuk bir çubukla yuvarlasın.",
      "Tahta oyuncak: makara tekerlekli araba, oyma hayvanlar. Kıymık kalmayana kadar zımparalayın ya da kumlu taşla ovun. Boya yerine bitkisel yağ sürün.",
      "Bıçak ve testere işini yetişkin yapsın. Büyük çocuk küçüklere oyuncak yapmaya yardım etsin; zımparalama ve doldurma onların işi olsun.",
      "Oyuncakları sık kontrol edin: kopan dikiş, gevşeyen parça, kıymık. Bozulanı onarın ya da kaldırın."
    ],
    art: ['sf-yy-rulo-testi', 'sf-yy-bez-bebek', null, 'sf-yy-topac', null, null, null, null],
    dont: [
      "3 yaşından küçüklere küçük parçalı, boncuklu, düğmeli oyuncak vermeyin.",
      "Bebek ve küçük çocuğun oyuncağına uzun ip, kayış ya da kurdele bağlamayın; boynuna dolanabilir.",
      "Kurşun içeren boya, pil ve mıknatıs kullanmayın; yutulursa ağır zarar verir."
    ],
    keywords: ['el yapımı oyuncak', 'bez bebek yapımı', 'çocuğa oyuncak yapmak', 'oyuncak yok ne yapayım', 'topaç yapma', 'çorap top', 'ev yapımı oyuncak', 'bebek oyuncağı güvenli mi', 'oyuncak yapimi'],
    sources: [
      "ACCC Product Safety Australia — Choke check (https://Productsafety.gov.au/system/files/choke-check.pdf)",
      "TODAY — Pediatrician's toilet roll test for choking hazards (https://www.today.com/today/amp/tdna207045)",
      "UNICEF — Why play matters in emergencies (https://www.unicef.org/parenting/emergencies/play-in-emergencies)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: 3 yaş altı için silindire tamamen sığan her parça boğulma tehlikesidir (ACCC); tuvalet kâğıdı rulosundan geçen oyuncak 0–3 yaş için tehlikeli, pil ve kopabilen küçük parçalara dikkat (TODAY, çocuk doktoru); acil durumda ev eşyasıyla oyun, çorap topla oyun (UNICEF). Silindir ölçüsü kaynakta yazılı değildi; rulo testi daha tutucu olduğu için kullanıldı. Uzun ip uyarısı genel güvenlik bilgisi." },
  },
  {
    id: 'sf-yy-oyunlar',
    category: 'sf-yy-moral',
    title: "Malzemesiz ve az malzemeli oyunlar",
    tag: "ÇOCUK",
    summary: "Her gün kısa da olsa belli bir saatte oyun oynayın; saklambaç, mendil kapmaca, seksek, beştaş ve dokuz taş gibi geleneksel oyunlar malzeme istemez.",
    steps: [
      "Oyunu günlük düzene koyun. Kısa da olsa her gün aynı saatte oyun zamanı olsun; düzen çocuğa güven verir.",
      "Koşmalı oyunlar: saklambaç, köşe kapmaca, gölge kovalamaca, mendil kapmaca. Önce oyun alanını dolaşın; çukur, kuyu, yar, dere ve yıkıntı varsa sınırın dışında bıraksın.",
      "Mendil kapmaca: iki takım karşılıklı dizilir, herkes bir numara alır. Ortaya mendil konur. Ebe bir numara söyler, iki takımdan o numaralı çocuklar mendili kapıp kendi tarafına kaçmaya çalışır; mendili kapan yakalanmadan dönerse sayı alır.",
      "Seksek: toprağa çubukla kareler çizin, yassı taş atın, taşın olduğu kareye basmadan tek ayakla sekerek gidip gelin.",
      "Beştaş: beş küçük, düzgün taşla oynanır. Bir taş havaya atılır, düşmeden yerdeki taş alınır ve havadaki yakalanır. Bu oyunu 3 yaşından küçükler yanında oynamayın.",
      "Dokuz taş: toprağa iç içe üç kare çizip orta noktalarını birleştirin. Her oyuncunun dokuz taşı olur. Sırayla taş koyup sonra kaydırırlar; üç taşını bir çizgiye dizen rakibin bir taşını alır. Taşı ikiye inen ya da hareket edemeyen kaybeder.",
      "Sessiz ve içerideki oyunlar: \"Gözümle bir şey görüyorum\", bilmece, tekerleme, el çırpma oyunları, ip oyunu, hikâye zinciri.",
      "Küçükleri ve engelli çocukları katın. Kuralları herkes oynayabilecek biçimde değiştirin; kazanmaktan çok sıra beklemek ve birlikte oynamak önemli.",
      "Çocuk oyunda korkutucu olayları canlandırabilir. Engellemeyin; sakin dinleyin ve güvende olduğunu söyleyin. Sıkıntı haftalarca sürerse bir uzmana ya da güvendiğiniz bir büyüğe danışın."
    ],
    art: [null, null, 'sf-yy-mendil-kapmaca', 'sf-yy-seksek', null, 'sf-yy-dokuz-tas', null, null, null],
    dont: [
      "Kuyu, yar, dere kenarı, yıkık bina ve yol çevresinde oyun oynatmayın.",
      "Çocuğu korkuttuğu olay hakkında konuşmaya ya da çizimini yorumlamaya zorlamayın.",
      "Oyunu ceza olarak elinden almayın; oyun çocuğun stresle baş etme yoludur."
    ],
    keywords: ['çocuk oyunları', 'malzemesiz oyun', 'geleneksel oyunlar', 'mendil kapmaca nasıl oynanır', 'dokuz taş oyunu', 'seksek kuralları', 'çocuklar sıkılıyor ne oynasın', 'beştaş', 'cocuk oyunlari'],
    sources: [
      "UNICEF — Why play matters in emergencies (https://www.unicef.org/parenting/emergencies/play-in-emergencies)",
      "MEB — Geleneksel oyunlar okul bahçelerinde yeniden oynanacak (https://meb.gov.tr/geleneksel-oyunlar-okul-bahcelerinde-yeniden-oynanacak/haber/31986/tr)",
      "Kure Ansiklopedi — Dokuz taş oyunu (https://kureansiklopedi.com/tr/detay/dokuz-tas-oyunu-45661)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: kısa da olsa düzenli günlük oyun zamanı, ritimli ve sıra bekleme oyunları, çocuğun korkutucu olayları oyunda canlandırabilmesi, çizim yorumunda zorlamama, sıkıntı haftalarca sürerse uzmana başvurma (UNICEF); oyun adları (MEB). Oyun kuralları geleneksel bilgi; MEB rehber kitabı ve Kure sayfası ayrıca açılmadı." },
  },
  {
    id: 'sf-yy-calgi',
    category: 'sf-yy-moral',
    title: "Basit çalgı yapımı",
    tag: "MORAL",
    summary: "Kuru su kabağından marakas, tenekeden davul, kutu ve lastikten telli çalgı, sudaki şişelerden ses dizisi yapın; kısa ve gergin olan ince, uzun ve gevşek olan kalın ses verir.",
    steps: [
      "Sesin kuralını bilin: titreşen tel ya da hava sütunu ne kadar kısaysa ses o kadar incedir. Tel ne kadar gerginse ses incelir; kalın ve ağır tel kalın ses verir.",
      "Marakas: iyice kurumuş bir su kabağının içindeki çekirdekleri sallanarak ses verecek şekilde içinde bırakın. Ya da kapaklı bir kaba bir avuç kuru fasulye, nohut ya da çakıl koyup kapağını bağlayın.",
      "Davul: teneke ya da tahta bir kovanın ağzına ıslatılmış ince deri, kalın kumaş ya da kalın kâğıt gerin; iple kenarından sıkıca bağlayın. Deri kurudukça gerilir ve ses incelir.",
      "Teneke kenarlarını çekiçle içe kıvırın ya da bezle sarın; kesik kenar eli keser.",
      "Telli çalgı: sağlam bir kutunun açık ağzına farklı kalınlıkta lastikler ya da gergin ipler geçirin. Altına bir tahta köprü sıkıştırın. Köprünün yerini değiştirince ses değişir.",
      "Şişe ve bardak dizisi: aynı boy şişelere farklı miktarda su koyun. Şişenin ağzına üflerseniz az sulu olan kalın, çok sulu olan ince ses verir. Bardaklara kaşıkla vurursanız tam tersi olur. Su ekleyip çıkararak akort edin.",
      "Kamış düdük: içi boş kamıştan farklı boylarda parçalar kesin, bir ucunu kapatıp yan yana bağlayın. Kısa boru ince, uzun boru kalın ses verir.",
      "Ritim çubukları ve kaşık: iki kuru sert tahta ya da iki tahta kaşık birbirine vurulunca güzel ritim verir.",
      "Çalgıları kuru yerde saklayın. Deri davul nemde gevşer; çalmadan önce ateşe değil güneşe ya da ılık havaya tutun."
    ],
    art: [null, 'sf-yy-kabak-marakas', 'sf-yy-teneke-davul', null, null, 'sf-yy-sise-dizisi', null, null, null],
    dont: [
      "Kesik teneke kenarını açık bırakmayın; çocukların elini keser.",
      "Küçük çocuklara içinden boncuk, nohut ya da çakıl çıkabilecek çalgı vermeyin; boğulma tehlikesi vardır.",
      "Zehirli bitkilerin sapından düdük yapmayın; ağza alınan dalın ne olduğunu bilin."
    ],
    keywords: ['çalgı yapımı', 'el yapımı müzik aleti', 'çocuklarla enstrüman yapma', 'teneke davul', 'kabak marakas', 'şişeden müzik', 'kutu gitar', 'kamış düdük', 'muzik aleti yapma'],
    sources: [
      "TeachEngineering — Homemade instruments: water-glass xylophone, straw panpipe, bottle organ, shoebox guitar (https://teachengineering.org/activities/viewmaterials/cub_soundandlight_lesson3_activity1)",
      "The Physics Classroom — Guitar strings: tel boyu, gerginlik ve doğrusal yoğunluk (https://www.physicsclassroom.com/class/sound/Lesson-5/Guitar-Strings)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: su bardağı ksilofon, pipet flüt, şişe orgu ve lastikli kutu gitar ile farklı perdeler (TeachEngineering); tel boyu kısaldıkça frekansın artması, frekansın gerginliğe ve doğrusal yoğunluğa bağlılığı (Physics Classroom). Gerginlik artınca sesin incelmesi, ağır telin kalın ses vermesi ve şişe/bardak farkı temel akustik bilgisi; kaynakta yönüyle yazılı değildi." },
  },
  {
    id: 'sf-yy-toplu-muzik',
    category: 'sf-yy-moral',
    title: "Toplu müzik, şarkı ve ritim çemberi",
    tag: "MORAL",
    summary: "Haftada en az bir kez herkesin katılabildiği bir müzik ve şarkı akşamı yapın; ritim çemberi, türkü, ninni ve iş şarkılarıyla topluluk duygusunu güçlendirin.",
    steps: [
      "Belli bir gün ve saat koyun, örneğin her cuma akşamı. Düzenli buluşma, bir topluluğa ait olma duygusunu güçlendirir; bu duygu ruh sağlığı için müzikten de önemlidir.",
      "Ritim çemberi: herkes daire olur. Biri yavaş ve düzenli bir vuruş başlatır (el çırpma, davul, dize vurma). Herkes aynı vuruşa katılır.",
      "Sonra soru-cevap yapın: önder kısa bir ritim çalar, çember aynısını tekrar eder. Sıra herkese gelsin; isteyen geçebilsin.",
      "Bilinen türküleri, ninnileri, ilahileri ve marşları birlikte söyleyin. Farklı yerlerden gelenler kendi şarkılarını öğretsin.",
      "Sözleri bir deftere yazın. Yaşlıların bildiği eski türküleri ve maniler kaydedin; bu bilgi kaybolmasın.",
      "Çocuklarla hareketli şarkılar, el çırpma oyunları ve tekerlemeler söyleyin. Yatmadan önce aynı ninni ya da şarkı çocuğa düzen ve güven verir.",
      "İş şarkıları kullanın: imece, hasat, yün eğirme ya da odun taşırken birlikte söylenen şarkı işi ritme sokar ve yorgunluğu unutturur.",
      "Kimseyi sahneye çıkmaya zorlamayın. Dinlemek de katılmaktır.",
      "Yas zamanını gözetin. Kayıptan sonra coşkulu müzik yerine ağıt, ilahi ya da sessiz anma uygun olabilir; aileye sorun."
    ],
    art: [null, 'sf-yy-ritim-cemberi', null, null, null, null, 'sf-yy-is-sarkisi', null, null],
    dont: [
      "Müziği gece geç saatte, uyuyan ve hasta olanları rahatsız edecek kadar yüksek sesle yapmayın.",
      "Kimseyi şarkı söylemeye ya da dans etmeye zorlamayın, alay etmeyin.",
      "Yas tutan aileye sormadan kutlama düzenlemeyin."
    ],
    keywords: ['toplu müzik', 'birlikte şarkı söylemek', 'ritim çemberi', 'moral için müzik', 'türkü akşamı', 'iş şarkısı imece', 'müzikle moral', 'topluluk etkinliği akşam', 'ninni'],
    sources: [
      "UNICEF — Why play matters in emergencies: ritimli oyun, şarkı, rutin (https://www.unicef.org/parenting/emergencies/play-in-emergencies)",
      "Pearce ve ark. — Is group singing special? UCL Discovery (https://discovery.ucl.ac.uk/id/eprint/10069953/)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: el çırpma oyunları, basit şarkı ve ninniler, sabah ve yatma rutinleri (UNICEF); grup derslerinde iyi oluşun zamanla artması ve 'gruba ait olma' duygusunun sonraki iyi oluşu öngörmesi, şarkının diğer etkinliklerden açıkça üstün çıkmaması (Pearce ve ark.). Bu yüzden metinde müzik yerine düzenli buluşma ve aidiyet vurgulandı. İş şarkıları ve yas önerileri kültürel bilgi." },
  },
  {
    id: 'sf-yy-doga-deneyleri',
    category: 'sf-yy-moral',
    title: "Çocuklara doğa bilimi: basit deneyler",
    tag: "ÇOCUK",
    summary: "Yağmur ölçer, kavanozda tohum çimlendirme, gölge çubuğu ve buharlaşma deneyleriyle çocuklara gözlem, ölçme ve kayıt tutmayı öğretin.",
    steps: [
      "Kural koyun: ateş, kimyasal, çamaşır suyu ve tanımadığınız bitki deneylerde kullanılmaz. Güneşe hiçbir zaman doğrudan bakılmaz; büyüteçle ateş deneyini yalnız yetişkin gösterir.",
      "Yağmur ölçer: düz kenarlı, dibi düz bir kap (kavanoz, kesik şişe) alın. Dış yüzüne cetvelle milimetre çizgileri çizin. Kabı yerden 60–150 cm yüksekte bir direğe bağlayın; ağaç ya da binadan, onların yüksekliğinin en az iki katı uzakta olsun.",
      "Her sabah aynı saatte okuyun, deftere yazın ve kabı boşaltın. Ay sonunda en yağışlı haftayı birlikte bulun.",
      "Tohum çimlendirme: kavanozun iç yüzüne ıslak bez ya da kâğıt sarın, bezle cam arasına 3–4 fasulye ya da nohut koyun. Bezi nemli tutun. Her gün kök ve filizin boyunu ölçüp çizin.",
      "Işık deneyi: iki saksıya aynı tohumu ekin, birini karanlıkta tutun. Bir hafta sonra renklerini ve boylarını karşılaştırın. Pencere önündeki bitkinin ışığa döndüğünü gösterin.",
      "Gölge çubuğu: yere bir çubuk dikin. Gün boyunca her saat gölgenin ucuna bir taş koyun. Gölgenin en kısa olduğu an öğledir; çizgi doğu-batı yönünü verir.",
      "Buharlaşma: aynı miktarda suyu biri güneşte, biri gölgede, biri kapalı kapta olmak üzere üç kaba koyun. Her gün su seviyesini işaretleyin. Kapalı kabın kapağında biriken damlaları gösterip yağmuru anlatın.",
      "Her deneyden önce çocuğa \"sence ne olacak?\" diye sorun ve tahminini yazdırın. Sonra sonuçla karşılaştırın; yanlış tahmin de öğreticidir.",
      "Sonuçları gözlem defterine yazın (bkz. \"Gözlem defteri\"). Bu ölçümler ekim ve hasat zamanını kestirmek için de işe yarar."
    ],
    art: [null, 'sf-yy-yagmur-olcer', null, 'sf-yy-tohum-kavanoz', null, 'sf-yy-golge-cubugu', null, null, null],
    dont: [
      "Çocuklara güneşe ya da büyüteçten güneşe bakmalarına izin vermeyin; göz kalıcı zarar görür.",
      "Deneylerde tanımadığınız bitki, mantar, tohum ve böcekle çocuğu yalnız bırakmayın; bazıları zehirlidir.",
      "Deney için kuyu, dere ve gölet kenarında gözetimsiz su almaya göndermeyin."
    ],
    keywords: ['çocuklar için deney', 'doğa bilimi öğretmek', 'yağmur ölçer yapma', 'tohum çimlendirme deneyi', 'gölge çubuğu deneyi', 'evde bilim deneyi', 'okul yokken fen öğretmek', 'basit fen deneyleri', 'cocuklara bilim'],
    sources: [
      "NWS / CoCoRaHS — Setting up your gauge (https://www.weather.gov/media/aly/COCORAHS/SettingUpYourGauge.pdf)",
      "TeachEngineering — Sound and light activity (https://teachengineering.org/activities/viewmaterials/cub_soundandlight_lesson3_activity1)",
      "NPS Kenai Fjords — Nature journal tips and tricks: tahmin ve hipotez, ölçüm (https://www.nps.gov/kefj/learn/education/classrooms/upload/1-Nature-Journal-Tips-and-Tricks_508.pdf)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: yağmur ölçer engelden yüksekliğinin iki katı uzakta, yerden 2–5 ft (60–150 cm), her sabah aynı saatte okuma ve saati kaydetme (NWS/CoCoRaHS); merak sorusundan tahmin üretip veriyle test etme, ölçüm ve sayım (NPS). Tohum, ışık, gölge ve buharlaşma deneyleri temel fen bilgisi; ayrı bir deney kaynağı açılamadı. TeachEngineering yalnız deney biçimi örneği." },
  },
  {
    id: 'sf-yy-gozlem-defteri',
    category: 'sf-yy-moral',
    title: "Gözlem defteri: doğayı kaydetmek",
    tag: "ÇOCUK",
    summary: "Her kayda tarih, yer ve hava yazın; \"Görüyorum, merak ediyorum, bana şunu hatırlatıyor\" başlıklarıyla doğayı çizip ölçerek kaydedin.",
    steps: [
      "Bir defter ya da dikilmiş kâğıt destesi ve kurşun kalem alın. Kalem yoksa kömür ya da is mürekkebi kullanın.",
      "Her kayda önce tarihi, yeri, havayı ve sıcaklığı (soğuk, serin, ılık, sıcak) yazın.",
      "Bir şey seçin: bir yaprak, böcek, kuş, bulut, taş ya da bir ağaç. Birkaç dakika sessizce bakın.",
      "Üç başlıkla yazın. \"Görüyorum\": rengi, biçimi, sesi, kokusu, dokusu. \"Merak ediyorum\": aklınıza gelen sorular. \"Bana şunu hatırlatıyor\": benzettiğiniz şey.",
      "Çizin ama güzel olması gerekmez; bu bir şemadır. Parçalarını okla gösterip adlarını yazın. Küçük ayrıntıyı yanına büyüterek ayrıca çizin.",
      "Sayın ve ölçün: yapraktaki damar sayısı, çiçeğin taç yaprağı, ağacın gövde çevresi (iple ölçüp karışla). Sayıları tablo yapın.",
      "Bir ağacı ya da bir köşeyi bütün yıl izleyin. İlk yaprak, ilk çiçek, ilk kırağı, kuşların gelip gidişi gibi tarihleri yazın. Yıllar içinde bu kayıtlar ekim ve hasat zamanını bilmeye yardım eder.",
      "Haftada bir defterleri birlikte okuyun. Çocukların sorularından birini seçip deneyle cevap aramayı deneyin (bkz. \"Çocuklara doğa bilimi\").",
      "Defterleri kuru, kapalı bir kutuda saklayın. Bunlar topluluğun doğa kaydıdır."
    ],
    art: [null, null, null, 'sf-yy-defter-sayfa', 'sf-yy-defter-cizim', null, 'sf-yy-agac-yil', null, null],
    dont: [
      "Çocuğun çizimini \"güzel değil\" diye düzeltmeyin; amaç doğru gözlemdir.",
      "Gözlem için kuş yuvasını bozmayın, yavru ve yumurtaya dokunmayın.",
      "Tanımadığınız böceği, yılanı ve bitkiyi elle tutmayın; uzaktan çizin."
    ],
    keywords: ['gözlem defteri', 'doğa günlüğü', 'çocuklarla doğa gözlemi', 'doğa defteri tutmak', 'bitki gözlem kaydı', 'kuş gözlem defteri', 'merak ediyorum görüyorum', 'gozlem defteri', 'fenoloji kaydı'],
    sources: [
      "NPS Kenai Fjords — Nature journal tips and tricks (https://www.nps.gov/kefj/learn/education/classrooms/upload/1-Nature-Journal-Tips-and-Tricks_508.pdf)",
      "Texas Parks and Wildlife — I notice, I wonder, it reminds me of (https://tpwd.texas.gov/education/resources/resources/lesson-plans/exploration-and-observation-skills/inotice)"
    ],
    reviewed: false,
    checked: { date: D, note: "Bağımsız doğrulama: kaynaklar bu turda yeniden açılmadı, sayılar yazarın okumasına dayanıyor; tehlikeli eksik ve yasak kontrolü yapıldı. Yazar: her kayda tarih, yer, hava ve sıcaklık; çizimin şema olarak görülüp etiketlenmesi, büyütülmüş ayrıntı çizimi, sayı ve ölçüm tabloları; I notice / I wonder / It reminds me of yapısı (NPS, TPWD). Mevsim kaydının tarımda kullanımı fenoloji bilgisi; bu pakette ayrıca doğrulanmadı." },
  },
];
