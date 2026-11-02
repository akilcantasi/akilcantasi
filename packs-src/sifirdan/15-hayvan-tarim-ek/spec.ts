// Sıfırdan: Hayvanlar ve tarım ekleri — çizim açıklamaları (detaylı düz illüstrasyon, 4:3)
export const SPEC: Record<string, string> = {
  // Kategori kapakları
  "sf-ht-kapak-hayvan": "Köy avlusu, yandan: önde oturan açık renkli bir çoban köpeği, arkasında iki koyun, ortada yularlı bir eşek, sağda direk üstünde ahşap güvercinlik ve damında iki güvercin.",
  "sf-ht-kapak-tarim": "Geniş manzara: arkada şeker pancarı sıraları, ortada dipten çok sürgün vermiş iki kütük, önde samanla örtülü toprakta sebze sırası.",

  // Köpek 1
  "sf-ht-kopek-odul": "Yakın plan: bir avuç içinde nohut büyüklüğünde doğranmış et ve peynir parçaları; yanında kesme tahtasında bıçak ve büyük bir parça peynir.",
  "sf-ht-kopek-otur": "Yandan: diz çökmüş kadın elindeki ödülü oturan köpeğin burnunun önünden başının üstüne kaldırıyor; köpeğin başı yukarıda, arkası yerde. Elin hareketini gösteren turuncu yay ok, 'otur' etiketi.",
  "sf-ht-kopek-gel": "Yandan, avluda: aynı kadın tek dizi yerde, kollarını öne açmış; karşıdan kuyruğu sallanan köpek ona koşuyor. Köpekten kadına turuncu ok, 'gel' etiketi.",

  // Köpek 2
  "sf-ht-kopek-yavru-suru": "Yandan, ahır içinde samanda: kabarık tüylü, açık renkli 8 haftalık çoban köpeği yavrusu yatan sakin koyunların arasında uzanmış. '8 hafta' etiketi.",
  "sf-ht-kopek-guvenli-kose": "Yukarıdan ağıl şeması: bir köşe tahta perdeyle ayrılmış, içinde köpek yatağı ve yem kabı; yavru perdedeki dar aralıktan koyunlara doğru çıkıyor (turuncu ok); koyunlar dışarıda.",
  "sf-ht-kopek-kovalama-hayir": "Yandan: tek dizi yerde çoban, kuzuya yönelen genç çoban köpeğini tasmasından tutup öbür eli sırtında, 'hayır' diyor; sola (geri) turuncu ok, kuzu ileride. Kırmızı 'HAYIR!' etiketi; sopa yok.",

  // Köpek 3
  "sf-ht-iz-kosum": "Yakın plan, yandan: köpeğin göğsünü ve sırtını saran koşum, sırttaki halkaya bağlı kayış, yeşil onay. Köşede boyun tasmasına bağlı kayışlı küçük ek resim ve kırmızı çarpı.",
  "sf-ht-iz-yiyecek-adim": "Yukarıdan, kısa çimde: düz sırada ayak izleri, her izin içinde küçük bir yiyecek parçası; sonda bir eldiven ve yanında yiyecek yığını. İzler arasında '60 cm', iz boyunca '3–12 m' ölçüsü.",
  "sf-ht-iz-burun-yerde": "Yandan: koşumlu köpek burnu yerde iz boyunca ilerliyor, arkasında kısa ve hafif gergin kayışı tutan eğitici yürüyor. Kokuyu gösteren turuncu ok ileri.",

  // Kedi
  "sf-ht-kedi-ambar": "Ambar zemininde oturan turuncu kedi önündeki küçük fareye bakıyor (yeşil onay, '30 g'); arkasında yatan iri sıçan (kırmızı çarpı, '300 g'). Kedi fareyi avlar, sıçanı nadiren.",
  "sf-ht-kedi-kap-sakla": "İki yarı: solda ağzı açık çuval, etrafına dökülmüş taneler ve bir sıçan (kırmızı çarpı); sağda kapaklı metal bidon ve kapaklı cam kavanozda buğday (yeşil onay).",
  "sf-ht-kedi-kum-eldiven": "Yakın plan: eldivenli el bir kürekle kum sandığından kedi dışkısını alıyor, turuncu ok yandaki kovayı gösteriyor. 'her gün' etiketi.",

  // At ve eşek
  "sf-ht-at-baski-birak": "İki panel, yandan: 1. panelde kişi sıpanın (eşek yavrusu) omzunun yanında durup yular ipini hafifçe çekiyor (turuncu ok); 2. panelde sıpa başını indirmiş, ip gevşek, kişi boynunu okşuyor (yeşil onay).",
  "sf-ht-at-yandan-yurutme": "İki panel, yandan: solda kişi eşeğin tam önünde durup ipi çekiyor (kırmızı çarpı); sağda kişi eşeğin omzunun yanında yürüyor, ip gevşek, yerde turuncu kesikli daire (yeşil onay).",
  "sf-ht-at-ayak-kaldirma": "Yandan: kişi eşeğin yanında, yüzü hayvanın arkasına dönük, çömelmeden belden eğilmiş; bir eli omuzda, öbür eli kaldırılmış ön ayağın bileğini tutuyor. Elin bacak boyunca aşağı kaymasını gösteren turuncu ok.",

  // Toynak
  "sf-ht-toynak-baglama": "Yandan: yular ipi göz hizasında direğe kısa bağlı at; kişi atın omzunun yanında, yüzü hayvanın arkasına dönük, çömelmeden belden eğilmiş, bir eli omuzda, öbür eliyle kaldırılmış ön toynağı tutuyor.",
  "sf-ht-toynak-kaziyici": "Yakın plan: toynağın altı (uç yukarıda, topuk aşağıda); ortada ok denen üçgen yumuşak kısım ve iki yanındaki oluklar; elde toynak kazıyıcısı; oluk boyunca topuktan uca turuncu ok, 'uç' ve 'topuk' etiketleri.",
  "sf-ht-toynak-kesim": "Yakın plan, toynağın altı: toynak kerpeteni uzamış dış duvarın kenarından ince bir şerit alıyor (yeşil onay). Köşede bıçakla tabanın ortasını oyan küçük ek resim ve kırmızı çarpı.",

  // Güvercin
  "sf-ht-guvercin-yuva-gozu": "Önden: ahşap güvercinlik duvarında kare yuva gözleri; turuncu çerçeveli yan yana iki gözden birinde yuvada iki yumurta, öbüründe bir yavru; üstteki gözlerde güvercinler. Bir gözün altında '30 cm' ölçüsü.",
  "sf-ht-guvercin-kulucka": "Yakın plan: yuva gözünde iki beyaz yumurta üstünde yatan güvercin, yanında bekleyen eşi. '17–18 gün' etiketi.",
  "sf-ht-guvercin-islak-temizlik": "Yandan, güvercinlik içi: ağzını ve burnunu bezle kapatmış yaşlı adam püskürtme şişesiyle zemindeki dışkıyı ıslatıyor (mavi damlalar). Köşede kuru süpürgeyle toz kaldıran küçük ek resim ve kırmızı çarpı.",

  // Doğum 1
  "sf-ht-dogum-belirti": "Yandan: arkadaki sürüden ayrılmış bir koyun; dolgun meme ve kalça önündeki çöküntü turuncu kesikli halkalarla işaretli.",
  "sf-ht-dogum-bolme": "Ahır köşesinde tahta perdelerle çevrili, kuru saman serili küçük bölme; içinde yatan bir koyun ve yanında yatan kuzusu. Ön perdenin boyunca '1,2 m' ölçüsü.",
  "sf-ht-dogum-normal-gelis": "Şema: soluk koyun silueti içinde rahim; kuzu iki ön ayağı tabanları aşağı bakarak önde, burnu ayakların üstünde, çıkışa (geriye) doğru turuncu ok. Yeşil onay. Kan ya da grafik ayrıntı yok.",

  // Doğum 2
  "sf-ht-dogum-el-koni": "Yakın plan: uzun mavi eldivenli el, parmak uçları birleşik koni biçiminde; üstünde parlayan kayganlaştırıcı. İleri yönde turuncu ok.",
  "sf-ht-dogum-u-z-bacak": "İki panel, şema: solda kuzunun ön bacağı, iki eklem aynı yöne bükülmüş, 'U'; sağda arka bacak, eklemler ters yöne bükülmüş, 'Z'. Eklemler turuncu noktalı.",
  "sf-ht-dogum-cekme-yonu": "Şema (normal geliş şemasıyla aynı dil): soluk koyun silueti içinde rahim, kuzunun iki ön ayağı ve başı dışarıda; yukarıdan gelen mavi eldivenli el iki ayağı birlikte tutuyor. Aşağı ve annenin arka ayaklarına doğru kıvrılan turuncu yay ok; köşede düz yukarı oklu küçük ek resimde kırmızı çarpı. Kan yok.",

  // Yeni doğan
  "sf-ht-yenidogan-agiz-temizle": "Yakın plan: samanda yatan yeni doğmuş kuzunun başı; eldivenli bir parmak burun ve ağızdaki sıvıyı aşağı sıyırıyor (turuncu ok).",
  "sf-ht-yenidogan-ovma": "Yandan, samanda: kuzu göğsü üstünde yatıyor; diz çökmüş kadın bir avuç kuru samanla sırtını ovuyor (ileri-geri turuncu oklar).",
  "sf-ht-yenidogan-gobek-iyot": "Yakın plan: ayakta kuzunun kısa göbek kordonu, eldivenli elin tuttuğu kahverengi iyotlu küçük kaba batıyor. 'iyot' etiketi.",

  // İpekböceği
  "sf-ht-ipek-genc-larva": "Yukarıdan: tahta tabla üstünde ince doğranmış dut yaprağı parçaları ve aralarında küçük açık gri larvalar; kenarda bütün bir dut yaprağı. '26–28 °C' termometresi.",
  "sf-ht-ipek-kozalik": "Önden: raf üstüne dikilmiş kuru çalı ve saman demetleri arasında beyaz ve sarı kozalar; bir dalda koza örmeye başlamış saydamlaşmış böcek.",
  "sf-ht-ipek-koza-bogma": "Yandan: odun ateşi üstünde kaynayan su dolu tencere, üstünde delikli sepette kozalar, sepetin üstü bezle örtülü, buhar yükseliyor. '10–15 dk' etiketi.",

  // Pancar şekeri
  "sf-ht-pancar-tepe-kes": "Yakın plan: kesme tahtasında beyaz şeker pancarı; bıçak yeşil tepe ile beyaz kök sınırından kesiyor (turuncu kesik çizgi ve aşağı ok).",
  "sf-ht-pancar-dilim": "Yandan: soyulmuş pancar eğik tutulan rende tahtasında dilimleniyor, dilimler altındaki buharı tüten su dolu emaye tencereye düşüyor. '1,5 mm' etiketi ve '78–82 °C' termometresi.",
  "sf-ht-pancar-kopuk-al": "Yandan: ateş üstünde geniş, sığ tepside kaynayan açık kahverengi şurup ve üstünde köpük; bir el kevgirle köpüğü alıyor (turuncu ok).",

  // Baltalık
  "sf-ht-baltalik-parsel": "Yukarıdan şema: alan şerit parsellere bölünmüş, başlıklar '1, 2, 3, …, 19, 20'; 1. parselde yeni kesilmiş kütükler (turuncu çerçeve), sonrakilerde giderek büyüyen ağaç tepeleri.",
  "sf-ht-baltalik-kutuk-kesim": "İki panel, yandan: solda yerden alçak, düz ve hafif eğik kesilmiş kütük, '3–10 cm' ölçüsü (yeşil onay); sağda ortası V biçiminde çukur kesilmiş, içinde su biriken kütük (kırmızı çarpı).",
  "sf-ht-baltalik-surgun": "Yandan: kesilmiş kütükten çıkan çok sayıda genç sürgün; yanında dikenli dal çiti ve dışarıda bir keçi, keçinin üstünde kırmızı yasak işareti. '4 yıl' etiketi.",

  // Fidanlık
  "sf-ht-fidan-su-testi": "Yandan kesit: su dolu kovada palamut ve cevizler; yüzenler kırmızı çarpılı, dipte batanlar yeşil onaylı.",
  "sf-ht-fidan-soguklatma": "Yandan kesit: ev duvarının dibinde toprağa gömülü delikli kapta nemli kum katları arasında palamut ve cevizler, üstü samanla örtülü. '1–5 °C' termometresi ve '3 ay' etiketi.",
  "sf-ht-fidan-tel-ortu": "Yandan: filizli fidanlık yatağının üstü tel kafesle örtülü, kenarları toprağa gömülü; dışarıda bir fare, üstte bir kuş.",

  // Gri su
  "sf-ht-grisu-kaynaklar": "İki sütun ikon: solda yeşil onaylı duş, el lavabosu ve durulama leğeni; sağda kırmızı çarpılı tuvalet, bulaşıklı mutfak evyesi ve bebek bezi leğeni.",
  "sf-ht-grisu-malc-cukur": "Yandan kesit: adam kovadaki gri suyu meyve ağacının dibindeki saman malçla örtülü sığ çanağa döküyor; su toprağa iniyor (mavi oklar). Köşede hortumla yaprağa püskürten küçük ek resim ve kırmızı çarpı.",
  "sf-ht-grisu-hangi-bitki": "İki sütun ikon: solda yeşil onaylı meyve ağacı, asma ve domates; sağda kırmızı çarpılı marul, maydanoz, havuç ve fide.",

  // Kuraklık
  "sf-ht-kurak-malc-kalinlik": "Yandan kesit, iki yarı: solda ince kuru ot malçı '5–8 cm', sağda kabarık saman malçı '15–20 cm'; ikisinde de sap dibinde boşluk.",
  "sf-ht-kurak-ekim-cukuru": "Yandan kesit: kuru toprakta iki çanak biçimli çukur, dipte koyu gübre ve filizlenmiş fide, kenarda kazılan topraktan küçük set. '30 cm', '15–20 cm' ve çukurlar arası '90 cm' ölçüleri.",
  "sf-ht-kurak-tas-set": "Yandan kesit: eğimli yamaçta aralıklı alçak taş setler; yağmurla yukarıdan akan su (mavi oklar) setin önünde durup toprağa sızıyor. Bir sette '25–30 cm' ölçüsü.",
};
