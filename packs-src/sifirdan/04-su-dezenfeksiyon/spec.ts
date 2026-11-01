// Sıfırdan: Su ve dezenfeksiyon — çizim açıklamaları (detaylı düz illüstrasyon, 4:3)
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  'sf-sd-kapak-su-bulma': 'Kırsal bir yerde kiremit çatılı, taş ayaklı çıkrıklı kuyu; tamburdan sarkan ip ve kova. Yanında kapaklı sarı ve beyaz bidonlar, arkada bir ağaç.',
  'sf-sd-kapak-aritma': 'Yakın plan, yan yana: kesitli kum filtresi (su, kum, çakıl katmanları), musluklu kovanın ağzına oturmuş seramik çömlek filtre, güneşin altında dolu şeffaf PET şişe.',
  'sf-sd-kapak-dezenfeksiyon': 'Odun ateşi üstünde kaynayan tencere, içinden makas kulpları görünüyor; yanında katlanmış temiz bezler ve sabun kalıbı.',
  'sf-sd-kapak-dezenfektan': 'Bir tezgâhta "%5" etiketli çamaşır suyu şişesi, ölçü kabı ve "%0,5" etiketli kapaklı kova.',

  // Kaynak arama
  'sf-sd-kaynak-vadi': 'Yandan kesit görünüşü: yamaçta toprak altında eğik geçirimsiz kaya katmanı; sızan su katmanın üstünden yamaca çıkıyor, çıkış noktası turuncu okla gösteriliyor; oradan vadinin dibindeki dereye akıyor.',
  'sf-sd-kaynak-bitki': 'Kuru, sarı bir yaz yamacında yeşil kalmış bir şerit: ağaçlar ve sazlar. Köylü adam koluyla şeridi işaret ediyor; köşede yeşil onay.',
  'sf-sd-kaynak-patika': 'Yukarıdan görünüş: birkaç hayvan patikası tek bir noktada birleşiyor, orada küçük bir su gözü. Patikalar turuncu oklarla suya doğru gösteriliyor.',
  'sf-sd-debi-olcme': 'Taş duvardaki kaynak borusundan akan su yerdeki "10 L" etiketli kovaya doluyor; köylü adam diz çökmüş kovayı tutuyor; yanda saat simgesi "? sn".',

  // Kaptaj
  'sf-sd-kaptaj-kesit': 'Yamaç kesiti: su gözünün çevresinde çakıl dolgu, üstünde iri taşlar, onların üstünde kil kubbe, en üstte toprak, çimen ve işaret taşı; çakıldan çıkan boru aşağıdaki taş duvardan kovaya akıyor. "kil" ve "çakıl" etiketleri.',
  'sf-sd-kaptaj-cakil': 'Yakın plan: iki el, açılmış hendekte su gözünün çevresine yumruk boyu temiz çakıl diziyor. Etikette "1–4 cm".',
  'sf-sd-kaptaj-duvar': 'Önden görünüş: taş duvardan yüksekte çıkan borudan altındaki kovaya su akıyor; duvar önünde beton taban ve yana uzanan ark; köşede yeşil onay.',
  'sf-sd-kaptaj-cit': 'Yukarıdan görünüş: çimenlikte kaynak gözü (çakıl ve su), çevresinde kare çit; çitin yukarısında yüzey suyunu iki yana akıtan hendek, turuncu oklarla; gözden aşağıya kesikli çizgiyle gömülü boru ve taş çıkış. Ölçü "10 m".',

  // Kuyu
  'sf-sd-kuyu-mesafe': 'Yandan görünüş: hafif yamacın üstünde kuyu (yeşil onay), aşağısında tuvalet kulübesi; aralarında ölçü oku "30 m".',
  'sf-sd-kuyu-egim': 'İki bölme: solda çukurdaki su birikintisinin içinde bayraklı kuyu kazığı, yağmur suyu içeri akıyor (kırmızı yasak); sağda tümsek üstünde kazık, su iki yana akıyor (yeşil onay).',
  'sf-sd-kuyu-bilezik': 'Kuyu başında yığılı beton bilezikler ve taş yığını; bir kişi bileziği yuvarlıyor.',
  'sf-sd-kuyu-ekip': 'Kuyu ağzının üstünde üç ayaklı ahşap sehpa ve makara; sağda halatı tutan usta, solda kask ve emniyet kemeri takmış kuyuya inecek genç adam; arkada çit.',
  'sf-sd-kuyu-cap': 'Yukarıdan görünüş: yere çizilmiş daire ve çapı gösteren ok "1,5 m"; içinde kaplanmış kuyunun iç çapı "1,2 m".',
  'sf-sd-kuyu-kemer': 'Yer altı kesiti: kuyunun dibinde kask ve emniyet kemeri takmış genç adam kürekle kazıyor; kemerinden çıkan halat yukarıdaki sabit ahşap direğe bağlı, direğin yanında usta halatı tutuyor.',
  'sf-sd-kuyu-havalandirma': 'Yer altı kesiti: yukarıdaki usta eğilmiş, iple boş kuyunun dibine yanık bir mum indiriyor; kuyuda kimse yok.',
  'sf-sd-kuyu-kaplama': 'Yer altı kesiti: kuyunun üst kısmı beton bileziklerle kaplanmış, altta kaplamasız yeni kazılan kısımda kasklı adam kazıyor; kaplamanın yukarıdan aşağı ilerlediği turuncu okla gösteriliyor.',
  'sf-sd-kuyu-ust-kaplama': 'Yandan kesit: kuyunun üst 3 metresinde bileziklerin arkası koyu renkli kil/beton dolgu ile doldurulmuş, etiket "3 m"; altta derzleri açık bilezikler ve dipte çakıl.',
  'sf-sd-kuyu-agzi-kesit': 'Yandan görünüş: yerden yaklaşık 1 m yükseltilmiş kapaklı kuyu bileziği (ölçü "1 m"), çevresinde dışa eğimli beton taban ve kenarlarında alçak set; yağmur suyu mavi oklarla dışarı akıyor; yanda ölçek için köylü adam.',
  'sf-sd-kuyu-taban': 'Yukarıdan görünüş: kuyunun çevresinde dairesel beton taban, ölçü oku "en az 1 m" ve toplam çap "2,5–3,5 m".',
  'sf-sd-kuyu-ark': 'Kapaklı kuyunun beton tabanından çıkan sıvalı ark bahçedeki sebze tarhına gidiyor; arkın boyunca ölçü oku "4 m+".',
  'sf-sd-kuyu-kapak': 'Yakın plan: kuyunun ağzını taşan ahşap kapak, ortasında menteşeli küçük kova kapağı; yağmur kenarlardan dışarı akıyor; yeşil onay.',
  'sf-sd-kuyu-fircalama': 'Kesit: yükseltilmiş bileziğin yanında duran, gözlüklü ve eldivenli genç adam uzun saplı fırçayla kuyunun iç duvarını yukarıdan ovuyor; kuyunun içinde kimse yok.',
  'sf-sd-kuyu-hacim': 'Kuyu kesiti üzerinde çap ve su derinliği ölçü okları; yanında hesap kartı "çap × çap × derinlik × 0,785".',
  'sf-sd-kuyu-klor-dokme': 'Kesit: gözlüklü ve eldivenli genç adam elindeki kovayı kuyu ağzının üstünde eğip klorlu çözeltiyi kuyuya döküyor; yanında "%0,2" etiketli beyaz bidon.',
  'sf-sd-kuyu-karistirma': 'Kesit: kuyu ağzındaki genç adam uzun sırıkla kuyudaki suyu karıştırıyor (turuncu dönme oku); kova ve ip de suya sarkıtılmış. Saat "30 dk".',

  // Su çekme
  'sf-sd-cikrik': 'Önden görünüş: kuyu ağzının iki yanında taş ayaklar, üstlerinde yatay mil ve tambur, tambura sarılı ip ve kova; başörtülü kadın uzun kolu çeviriyor, turuncu dönme oku.',
  'sf-sd-cikrik-kol': 'Yakın plan şema: tambur ve kol; tambur yarıçapı kısa ok, kol uzunluğu uzun ok ile gösteriliyor, etiket "3×".',
  'sf-sd-makara-tek-cift': 'İki bölme şema: solda tek makarada kova ve uzun çekiş oku "10"; sağda sabit ve hareketli iki makaralı düzende aynı kova ve yarı uzunlukta çekiş oku "5".',
  'sf-sd-kova-ip-temiz': 'İki bölme: solda kapalı kuyunun tamburuna sarılı ip ve askıda ağzı aşağı asılı kova (yeşil onay); sağda yerde sürüklenen ip ve çamurlu başka bir kova (kırmızı çarpı).',

  // Yağmur suyu
  'sf-sd-yagmur-hesap': 'Bir evin kiremit çatısı üstünde yağmur damlaları, çatı alanı etiketi "100 m²", yağış etiketi "400 mm/yıl" ve depoya giden ok "≈ 40.000 L".',
  'sf-sd-oluk-elek': 'Yakın plan: kiremit çatının saçağı altında eğimli oluk, suyun aktığı uçta iniş borusunun ağzını örten kubbe biçimli tel elek, üstünde yapraklar; turuncu ok akış yönünü gösteriyor.',
  'sf-sd-ilk-yagmur-ayirici': 'Kesit: iniş borusunun altında dibi tıkaçlı dik ayırıcı boru kirli kahverengi suyla dolmuş (1); üstteki yan koldan temiz su depoya geçiyor (2).',
  'sf-sd-yagmur-depo': 'Kapalı, koyu yeşil depo beton tabanda: kapak, sinek telli havalandırma ağzı ve sinek telli taşma borusu; musluktan tabandaki kovaya su; yeşil onay.',

  // Sarnıç
  'sf-sd-sarnic-hesap': 'Hesap kartı: dört kişi simgesi × "15 L" × takvim "120 gün" = sarnıç simgesi "≈ 7 m³".',
  'sf-sd-sarnic-siva': 'Yer altı kesiti: taş duvarlı çukurda usta mala ile duvara sıva çekiyor; sıvanmış taban ve köşeler yuvarlatılmış.',
  'sf-sd-sarnic-cokeltme': 'Kesit: borudan gelen su önce küçük çökeltme bölmesine giriyor, dipte çamur birikmiş, üstteki berrak su ara duvarın üstünden sarnıca taşıyor; turuncu oklarla akış.',
  'sf-sd-sarnic-kesit': 'Yeraltı sarnıcının kesiti: beton kapak, bir uçta giriş borusu; sinek telli taşma borusu suyu sarnıçtan uzağa akıtıyor (mavi ok); karşı uçta el pompası ve musluktan kovaya su.',

  // Su taşıma
  'sf-sd-dar-agizli-kap': 'Yan yana: kapaklı dar ağızlı sarı bidon (yeşil onay) ve içine yaprak ve kir düşmüş açık kova (kırmızı çarpı).',
  'sf-sd-omuz-sirigi': 'Önden görünüş: başörtülü kadın iki omzunun üstünde, ensesinin arkasından geçen sırığı elleriyle tutuyor; iki ucunda iple asılı eşit iki bidon; turuncu oklar eşit yükü gösteriyor.',
  'sf-sd-yuk-kaldirma': 'Yandan görünüş: dizlerini büküp sırtı dik bidonu kaldıran kişi (yeşil onay), yanında belden eğilen kişi (kırmızı yasak).',
  'sf-sd-musluklu-kap': 'Mutfakta masanın üstünde kapaklı, musluklu mavi su kabı; başörtülü kadın musluğun altında bardağı tutuyor, su bardağa akıyor.',

  // Arıtma özeti ve kalite
  'sf-sd-dinlendirme-suzme': 'Bir kişi bulanık suyu katlanmış temiz bezden kaba süzüyor; yanında bekletilen kapta dibe çökmüş çamur.',
  'sf-sd-kaynatma-ocak': 'Odun ateşinin üstünde demir sehpada fokur fokur kaynayan tencere; yanında saat "1 dk".',
  'sf-sd-klor-depo': 'Bir kişi 1000 litrelik depoya ölçü kabıyla çamaşır suyu döküyor; etiket "≈100 ml", yanında saat "30 dk".',
  'sf-sd-kimyasal-su-yasak': 'Yüzeyinde gökkuşağı renkli yakıt tabakası olan su birikintisi ve yanında yatmış, sızdıran bir varil; büyük kırmızı yasak işareti.',
  'sf-sd-sanitasyon-denetim': 'Elinde kontrol listesi tutan genç kadın kuyuya bakıyor; kırmızı kesikli dairelerle işaretli riskler: açık kuyu ağzı, kuyu dibindeki su birikintisi, hemen yanındaki koyun ağılı.',
  'sf-sd-sise-isik': 'Güneşe tutulmuş şeffaf şişe: içindeki su bulanık kahverengi (kırmızı çarpı); yanda berrak su dolu şişe (yeşil onay).',
  'sf-sd-yosun-yasak': 'Yüzeyi yeşil-mavi yosun lekeleriyle kaplı gölet, suda sırtüstü ölü balık; üstünde kırmızı yasak işareti.',
  'sf-sd-salgin-tuvalet': 'Eldivenli bir kişi tuvalet çukurunun kenarını klorlu suyla siliyor; arka planda uzakta kuyu, aradaki mesafe oku.',
  'sf-sd-uc-kup': 'Yerde numaralı üç şeffaf kap: 1 bulanık, 2 dibinde çamur ve üstü daha berrak, 3 berrak; turuncu oklarla 1→2 ve 2→3 aktarma sırası.',
  'sf-sd-bez-suzgec': 'Başörtülü kadın kovadaki bulanık suyu, ağzına bez gerilmiş şeffaf kaba döküyor; bezden süzülen su kapta daha berrak.',
  'sf-sd-ust-su-aktarma': 'Başörtülü kadın "2" numaralı kovayı yavaşça eğiyor; üstteki berrak su "3" numaralı kaba akıyor, dipteki çamur kovanın dibinde kalıyor.',

  // Kum filtreleri
  'sf-sd-biokum-kesit': 'Filtre kesiti: alttan üste iri çakıl, ince çakıl, kalın ince kum, kumun üstünde su, delikli dağıtıcı tabla ve kapak; dipten çıkıp dışarıda su seviyesine kadar yükselen çıkış borusundan kovaya su. Kısa katman adları.',
  'sf-sd-biokum-boru': 'Yakın plan kesit: kumun üstünde su; dışarıdaki çıkış borusunun ağzı kum yüzeyinden yukarıda, su yüzeyiyle aynı hizada; aradaki fark ölçü okuyla "5 cm".',
  'sf-sd-kum-yikama': 'Genç adam çömelmiş, kovadaki kumun üstündeki bulanık suyu yere döküyor; yanda yıkanmış kum yığını.',
  'sf-sd-biokum-katman': 'Bir kişi variline içinde su varken kepçeyle kum döküyor; içeride önceden serilmiş çakıl katmanları görülüyor.',
  'sf-sd-biokum-tabla': 'Yakın plan: kumun üstüne oturtulmuş delikli tabla, üstten dökülen su deliklerden yağmur gibi dağılıyor.',
  'sf-sd-biokum-doldurma': 'Genç adam dinlendirilmiş suyu kovayla filtrenin üstünden döküyor; filtrenin yan borusundan kaba su akıyor; etiket "12–18 L".',
  'sf-sd-biokum-cikis': 'Filtrenin yan çıkış borusundan aşağıdaki dar ağızlı sarı bidona damlayan su; bidonun ağzı borunun altında, aralarında boşluk; yeşil onay.',
  'sf-sd-biokum-temizlik': 'Kesit: filtrenin kumunun üstündeki su bulanık; yukarıdan inen el suyu karıştırıyor, turuncu dönme oku; yanda bulanık suyun alındığı kova.',
  'sf-sd-havuz-filtre-plan': 'Yukarıdan görünüş: yan yana numaralı iki beton havuz "1" ve "2", üstten gelen giriş kanalı ikisine ayrılıyor; alttan vanalı çıkış boruları kapalı yuvarlak depoya gidiyor.',
  'sf-sd-havuz-filtre-kesit': 'Havuz kesiti: dipte delikli drenaj borusu ve vanalı çıkış, üstünde iriden inceye üç kat çakıl, "1 m" ince kum, üstünde "1 m" su; giriş borusunun altında kumu korumak için taş.',
  'sf-sd-havuz-vana': 'Çıkış borusundaki vanayı ayarlayan kişi; yanında hız etiketi "≈10 cm/saat".',
  'sf-sd-havuz-kazima': 'Boşaltılmış havuzda köylü adam kürekle kumun üstündeki ince koyu tabakayı kazıyıp kovaya alıyor; etiket "1–2 cm".',

  // Seramik
  'sf-sd-seramik-yogurma': 'Genç kadın diz çökmüş, tahta teknede kil ve talaşı yoğuruyor; yanlarda kil ve talaş yığınları.',
  'sf-sd-seramik-firin': 'Kesitli kubbe biçimli toprak fırın: raf üstünde ters dizilmiş çömlekler, altta odun ateşi.',
  'sf-sd-seramik-akis': 'Musluklu kovanın üstündeki çömlekten damlayan su, kovada ölçek çizgisi ve saat "1 saat = 1–3 L".',
  'sf-sd-seramik-kova': 'Kesit: şeffaf kovanın ağzına oturmuş seramik çömlek filtre, üstte kapak; çömleğin dibinden kovadaki temiz suya damlalar, altta musluk.',
  'sf-sd-komur-katman': 'Kesit: süzgeç kabında alt katta kum, üstte siyah odun kömürü parçaları; yanında not simgesi "tat/koku".',

  // SODIS
  'sf-sd-sodis-sise': 'Yan yana üç şişe: şeffaf çiziksiz PET (yeşil onay), çizik PET (kırmızı çarpı), yeşil renkli şişe (kırmızı çarpı).',
  'sf-sd-sodis-yazi-testi': 'Yukarıdan görünüş: büyük harfli yazının üstünde iki dolu şişenin dibi; berrak sudan harfler görünüyor (yeşil onay), bulanık sudan görünmüyor (kırmızı çarpı).',
  'sf-sd-sodis-cati': 'Güneşli günde evin sac çatısının üstüne yatay dizilmiş dolu PET şişeler; güneş simgesi ve "6 saat".',

  // Güneş imbiği
  'sf-sd-imbik-kesit': 'Yandan kesit: siyah tabanlı sığ havuzda tuzlu su, üstünde eğik cam; kesik çizgili güneş ışınları, buhar, camın altında aşağı kayan damlalar, alt kenarda oluk ve kaba giden hortum.',
  'sf-sd-imbik-oluk': 'Yakın plan: eğik camın altından kayan damlalar alt kenardaki oluğa düşüyor; oluktan hortum temiz şişenin ağzına iniyor.',

  // Üç seviye, sabun, kaynatma, düdüklü
  'sf-sd-kirli-alet': 'İki panel: kanlı makas doğrudan klorlu kaba atılıyor (kırmızı yasak); sabunlu leğende makas ve fırça (yeşil onay).',
  'sf-sd-steril-alet': 'Makas ve iğneden turuncu okla ocaktaki, düdüğü öten düdüklü tencereye.',
  'sf-sd-tippy-tap': 'Bahçede iki direk arasında asılı bidon; ayakla basılan pedal ipiyle bidonu eğiyor, akan suyla el yıkayan kadın; altında çakıllı çukur, yanda ipte asılı sabun.',
  'sf-sd-el-ovma': 'Yakın plan: köpüklü, birbirine sürtülen iki el; saat "20 sn".',
  'sf-sd-alet-tencere': 'Kesit: tencerede açık makas, pens ve iğne dipte; su seviyesi hepsinin epey üstünde.',
  'sf-sd-20-dk': 'Ocakta kapaklı, buharı çıkan tencere ve saat "20 dk".',
  'sf-sd-masa-ile-alma': 'Yakın plan: bir el uzun maşayla kaynayan tencereden makası çıkarıyor.',
  'sf-sd-duduklu-izgara': 'Düdüklü tencere kesiti: dipte birkaç parmak su, üstünde ters tabak, tabağın üstünde beze sarılı aletler suya değmiyor; buhar.',
  'sf-sd-duduklu-30-dk': 'Ocakta düdüğü öten, buhar çıkaran düdüklü tencere; saat "30 dk".',
  'sf-sd-duduklu-bekle': 'Masadaki düdüklü tencerenin kapak sapını çevirmeye çalışan el; kırmızı yasak işareti.',

  // Güneş ve ısı
  'sf-sd-camasir-kaynatma': 'Açık ateşte büyük kazanda kaynayan çamaşırlar, sopayla karıştıran başörtülü kadın; etiket "55 °C+".',
  'sf-sd-torba-bekletme': 'Ağzı sıkı bağlı şeffaf torbada yorgan ve ayakkabı; etiket "1–2 hafta".',
  'sf-sd-yatak-gunes': 'Güneşli avluda iki direk arasındaki ipe serilmiş yorgan; başörtülü kadın kenarından tutup çeviriyor, turuncu çevirme oku.',

  // Yanlış dezenfektanlar
  'sf-sd-sirke-klor-yasak': 'Sirke şişesi ve çamaşır suyu şişesi aynı kovaya dökülüyor, yükselen sarı-yeşil gaz bulutu; kovanın üstünde kırmızı yasak.',
  'sf-sd-duman-yasak': 'Kapalı çadırın içinde dumanlı mangal ve öksüren çocuk; mangalın üstünde kırmızı yasak.',
  'sf-sd-ise-yarayanlar': 'Beş simge, her birinin yanında yeşil onay: sabun ve köpük, kapaklı kaynayan tencere, düdüklü tencere, çamaşır suyu şişesi "%5", "%60+" yazılı alkol şişesi.',

  // Yara suyu
  'sf-sd-kapakli-sogutma': 'Solda ocakta kaynayan kapaklı tencere, ok, sağda masada kapağı kapalı soğuyan tencere ve saat.',
  'sf-sd-tuz-kasik': 'Yakın plan: bir el çay kaşığıyla tuzu "½ L" ölçü kabına döküyor; etiket "1 çay kaşığı".',
  'sf-sd-sise-sikma': 'Yakın plan: bacaktaki sıyrığa, kapağı delinmiş şişeyi sıkarak su akıtan el.',

  // Doğum malzemesi
  'sf-sd-dogum-icerik': 'Yukarıdan görünüş: naylon örtü üstünde sabun, katlanmış naylon, bez yığını, havlu, bebek battaniyesi ve şapka, ambalajlı jilet, kâğıda sarılı iplikler ve bez çanta.',
  'sf-sd-bez-kaynatma': 'Ocakta büyük tencerede kaynayan beyaz bezler; saat "20 dk".',
  'sf-sd-jilet-makas': 'Ambalajında yeni jilet (yeşil onay), kapaklı tencerede su altında makas (yeşil onay) ve paslı makas (kırmızı yasak).',

  // Klor oranları
  'sf-sd-klor-40ml': 'Bir el küçük ölçü kabından "1 L" su dolu ölçü kabına çamaşır suyu döküyor; yanda "%5" şişe; etiketler "40 ml", "%0,2".',
  'sf-sd-klor-1-9': '1 bardak çamaşır suyu + 9 bardak su, ok ile kovaya; etiket "%0,5".',
  'sf-sd-klor-etiketli-kova': 'Yakın plan: kapaklı plastik kovanın etiketine kalemle "%0,5" ve tarih yazan el.',

  // Elektroliz
  'sf-sd-elektroliz-yer': 'Açık havada ağaç gölgesinde masa, üstünde elektroliz kabı ve akü; gözlüklü, eldivenli adam çalışıyor; uzakta ateş üstünde kırmızı yasak.',
  'sf-sd-elektrot-secimi': 'Üstte iki grafit çubuk ve kaplamalı titanyum levha (yeşil onay); altta demir çivi, çelik kaşık, bakır tel ve alüminyum şerit (her birinde kırmızı çarpı).',
  'sf-sd-elektroliz-duzenek': 'Açık havada masa: şeffaf plastik kapta tuzlu su, tahta tutucudan sarkan iki grafit çubuk birbirine değmiyor, klemensler sıvının dışında, kablolar 12 V aküye; çubuklardan kabarcıklar.',

  // Kireç
  'sf-sd-kirec-koruyucu': 'Önden: gözlüklü, eldivenli, uzun kollu adam "KİREÇ" torbasını tutuyor.',
  'sf-sd-kirec-sondurme': 'Aynı adam geriye yaslanıp uzun saplı kepçeyle leğendeki kaya kirece su ekliyor; leğenden buhar yükseliyor.',
  'sf-sd-badana': 'Aynı adam fırçayla taş duvara kireç badanası sürüyor; duvarın yarısı beyaz; ayağının dibinde kireç kovası.',

  // Kül suyu
  'sf-sd-kul-secimi': 'Solda odundan kül yığını (yeşil onay); sağda kömür, plastik şişe ve boyalı tahta (kırmızı çarpı).',
  'sf-sd-kul-suzme': 'Kesit: dibinde kül çökmüş kova; bir el kapla berrak sıvıyı ağzına bez gerilmiş "KÜL SUYU" kavanozuna döküyor.',
  'sf-sd-kul-tencere': 'Yukarıdan: yağ lekeli tavayı ıslak bezle ovan eldivenli el; turuncu ovma oku.',

  // Alkol
  'sf-sd-maya-agiz-bez': 'İki panel: ağzı bezle örtülüp iple bağlı kova (yeşil onay); kapağı sıkı kapalı, şişmiş kova (kırmızı yasak).',
  'sf-sd-maya-havalanan': 'Solda açık penceresi olan odada bezle örtülü kova (yeşil onay); sağda karanlık bodrum merdiveninin dibinde kova ve gaz (kırmızı yasak).',
  'sf-sd-icilmez-etiket': 'Saplı plastik bidon üstünde büyük kırmızı etiket: kafatası, alev simgesi ve "İÇİLMEZ".',
  'sf-sd-imbik-guvenlik': 'Şematik, açık havada: ateş üstünde bakır kazan, borusu soğuk su kovasına, çıkışta "İÇİLMEZ" etiketli kavanoz; yanda su ve kum kovaları (yeşil onay); rüzgâr okları.',
  'sf-sd-imbik-malzeme': 'Üstte bakır sarmal boru ve cam balon (yeşil onay); altta araba radyatörü ve lehimli boru (kırmızı çarpı).',
  'sf-sd-bas-atma': 'Şematik: borudan damlayan ilk sıvı "BAŞ" yazılı küçük çay bardağına (kırmızı çarpı: atılacak); yanda sonrası için boş "İÇİLMEZ" etiketli kavanoz.',
  'sf-sd-alkolmetre': 'Ölçek silindirde yüzen alkolmetre; büyüteçte yüzey çizgisindeki "80"; etiket "20 °C".',
  'sf-sd-yanma-testi-yasak': 'Solda elde tutulan kaşıkta yanan alkol (kırmızı yasak); sağda silindirde alkolmetre (yeşil onay).',
  'sf-sd-seyreltme': '"%96" yazılı kapta 0,83 L alkol + su, ok ile "1 L" kaba; etiket "%80".',
  'sf-sd-farkli-sise': 'Solda kırmızı bantlı, kafatası etiketli, köşeli bidon biçiminde kap (yeşil onay); sağda su şişesi (kırmızı yasak).',
  'sf-sd-kilitli-dolap': 'Duvarda yüksekte asma kilitli ahşap dolap, kapağında kafatası etiketi, yeşil onay; yanında kollarını uzatıp dolaba yetişemeyen küçük kız.',
};
