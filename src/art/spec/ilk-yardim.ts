// Çizim şartnamesi: Hayati ilk yardım kategorisi (src/content/guides/ilk-yardim.ts).
// Biçim: ayrıntılı düz (flat) çizim, Kızılay/AFAD broşürü tarzı, 4:3 tuval.
// Teknik doğru gösterilmeli: el yeri, kol düzlüğü, vücut duruşu.
export const SPEC: Record<string, string> = {
  // Genel değerlendirme ve yetişkin TYD
  'ilk-yardim-olay-yeri-guvenlik': 'Önden geniş görünüş: yolda yerde yatan bir kişi; birkaç adım geride duran yardımcı elini kaldırıp çevreye bakıyor. Çevrede küçük tehlike simgeleri (geçen araç, sızan duman, sarkan kablo) turuncu daireyle işaretli; yardımcının bakış yönünde turuncu oklar.',
  'ilk-yardim-omuz-seslen': 'Yandan görünüş: yerde sırtüstü yatan yetişkin; yanında diz çökmüş yardımcı iki elini kişinin iki OMZUNA koymuş (göğse değil), eğilip yüksek sesle sesleniyor (ağzından ses dalgaları). Omuzlarda küçük turuncu dokunma çizgileri; sert sarsma yok.',
  'ilk-yardim-bas-geri-cene': 'Yakın plan yandan: sırtüstü yatan yetişkinin başı; yardımcının bir eli alında başı geriye itiyor, diğer elinin iki parmak ucu çene kemiğinin altında çeneyi yukarı kaldırıyor. Alından geriye ve çeneden yukarı iki turuncu ok; boğazdan geçen açık hava yolu açık mavi çizgiyle.',
  'ilk-yardim-kpr-el-yeri': 'Yukarıdan yakın plan: çıplak yetişkin göğsü. Alttaki elin topuğu göğsün tam ortasında, göğüs kemiğinin alt yarısında, kabaca meme uçlarını birleştiren çizgi hizasında; göğüs kemiğinin alt ucu (ksifoid) ve kaburga kenarı belirgin biçimde ellerin ALTINDA kalıyor. İkinci el alttakinin üstünde, parmaklar birbirine kenetli ve göğüsten yukarı kalkık; iki el de net görünüyor, yana açılmış parmak yok. Göğüs kemiği silik çizgiyle; yeşil onay işareti el topuğunun hemen yanında, ksifoidin üstünde.',
  'ilk-yardim-kurtarici-nefes': 'Yandan baş-omuz yakın planı: sırtüstü yatan yetişkinin başı solda, hafif geride, yüzü yukarı. Yardımcının başı ve omzu sol üstten iner, yüzü aşağı (tepesi göğse doğru); ağzı kişinin ağzının üstünde, iki profil ayrı seçilir. Sol üstten gelen elin başparmak ve işaret parmağı burnu sıkıyor; sağ alttan gelen elin parmak uçları çene kemiğinin altında. Kişinin göğsünde yukarı turuncu ok. Sayı rozeti YOK.',
  'ilk-yardim-oed-ped-yetiskin': 'Önden görünüş: yerde sırtüstü yatan yetişkinin çıplak göğsü. Bir ped sağ köprücük kemiğinin hemen altında, göğüs kemiğinin sağında; diğer ped sol koltuk altının altında, göğsün YAN yüzünde, orta koltuk altı çizgisinde (göğsün önünde ya da ortasında değil). Pedlerden açık OED cihazına giden kablolar; ped yerleri turuncu çerçeveyle vurgulu.',
  'ilk-yardim-oed-ped-cocuk': 'İki parçalı çizim: solda yerde yatan küçük çocuğun önden göğsü, ped göğsün ortasında; sağda aynı çocuğun sırtı, ikinci ped iki kürek kemiğinin arasında. Pedlerde küçük çocuk simgesi; ön ve arka arasında turuncu çift yönlü ok.',
  'ilk-yardim-oed-ped-bebek': 'İki parçalı çizim: solda sert yüzeyde yatan bebeğin önden göğsü, küçük ped göğsün tam ortasında; sağda bebeğin sırtı, ikinci ped sırtın ortasında. Pedlerde bebek simgesi; ön ve arka arasında turuncu çift yönlü ok.',
  'ilk-yardim-oed-getir': 'Önden görünüş: duvardaki yeşil kalpli, beyaz şimşekli OED dolabından çantayı alıp koşan bir kişi. Arkada uzakta, sırtını duvara yaslayıp yerde oturan, bilinci açık bir hasta ve yanında diz çökmüş biri; kalp masajı YAPILMIYOR. Koşma yönünde turuncu ok.',
  'ilk-yardim-oed-ac': 'Yakın plan, yukarıdan: yerde sırtüstü yatan yetişkinin başının yanında, YERE konmuş açık OED cihazı (duvarda ya da dolapta değil); bir parmak yeşil açma düğmesine basıyor, cihazın hoparlöründen ses dalgaları çıkıyor. Düğme turuncu daireyle vurgulu.',
  'ilk-yardim-oed-cekilin': 'Yandan görünüş: göğsünde pedler olan yerde yatan yetişkin; yanındaki yardımcı iki kolunu açıp geri çekilmiş, diğer kişiler de ellerini kaldırıp bir adım geride. Yatan kişinin çevresinde kırmızı kesikli "dokunma" halkası; cihaz ekranında kalp ritmi çizgisi.',
  'ilk-yardim-oed-sok-dugme': 'Yakın plan: OED cihazında yanıp sönen turuncu şimşek simgeli şok düğmesine basan parmak; arkada bulanık olarak kişiden uzak duran insanlar. Düğmenin çevresinde ışıma çizgileri.',

  // Kanama
  'ilk-yardim-kanama-bastir': 'Yakın plan yandan: kolunda kanayan yara olan oturan kişi; eldivenli yardımcı katlanmış temiz bezi yaranın üstüne koyup avucu ve düz kollarıyla sertçe bastırıyor. Bastırma yönünde aşağı kalın turuncu ok.',
  'ilk-yardim-kanama-bez-ekle': 'Yakın plan: yaranın üstünde kanla ıslanmış bez yerinde duruyor, üstüne ikinci temiz bez konuyor ve el yeniden bastırıyor. Alttaki bezin kaldırılmadığını gösteren yeşil onay; bezi kaldıran el silik ve kırmızı yasak işaretli küçük çizimde.',
  'ilk-yardim-turnike-tak': 'Yakın plan: uyluğunda kanayan yara olan yerde yatan kişi; turnike yaranın bir avuç (5–7 cm) üstünde, diz ekleminin üstünde değil. Yardımcının eli turnike çubuğunu çeviriyor; çevirme yönünde turuncu dairesel ok, yara ile turnike arasında "5–7 cm" ölçü çizgisi.',
  'ilk-yardim-turnike-saat': 'Yakın plan: takılmış turnike ve yanında kalemle kişinin alnına ya da turnike etiketine saat yazan el; yazıda "14:20" gibi bir saat; köşede saat simgesi.',
  'ilk-yardim-kanama-sargi': 'Yakın plan: kol üzerindeki bez rulo bandajla spiral şekilde sıkıca sarılıyor; sargının ucundaki parmaklar pembe renkte görünür. Sarma yönünde turuncu ok, parmak uçlarında küçük yeşil onay.',

  // Derlenme pozisyonu
  'ilk-yardim-derlenme-kol': 'Yukarıdan yakın plan (üst gövde): sırtüstü yatan kişi, baş solda. Yardımcının bedeni çizilmez; alt kenardan iki önkol girer, kesişmez. Kişinin yakın kolu omuzdan dik açıyla açılmış, dirsekten bükülü, önkol başa doğru, avuç yukarı; yardımcının bir eli bilekte, öbürü dirsekte. Kolun konacağı yöne kavisli turuncu ok.',
  'ilk-yardim-derlenme-el-yanak': 'Yukarıdan yakın plan (derlenme rehberinin oyuncuları): kişinin uzak kolu göğsün üzerinden getirilmiş, elinin sırtı yardımcıya yakın (alttaki) yanakta. Yardımcının yalnızca alt kenardan gelen tek önkolu: parmakları o eli yanağa bastırıp tutuyor. Yakın kol başın yanında bükülü. Yanakta turuncu daire.',
  'ilk-yardim-derlenme-cevir': 'Yukarıdan bütün beden (derlenme rehberinin oyuncuları): kişinin uzak bacağı dizden bükülü, diz turuncu dairede. Yardımcının alt kenardan gelen iki önkolu, kesişmeden: biri bükülü dizi kavramış, öbürü yanaktaki eli tutuyor. Dizden yardımcıya (aşağı) doğru kavisli turuncu çekme oku.',
  'ilk-yardim-derlenme-son': 'Önden görünüş: derlenme pozisyonunda yan yatan kişi (derlenme rehberinin yaralısı), üst el yanağın altında, üst diz önde yerde, ağız yere dönük; başta hafifçe geriye eğme oku, ağız önünde mavi nefes dalgaları.',
  'ilk-yardim-derlenme-izle': 'Yandan görünüş: derlenme pozisyonunda boynuna kadar örtülü kişi; aynı yardımcı başının yanında diz çökmüş, eli omzunda, nefesini izliyor; göğüste yukarı-aşağı turuncu oklar.',
  'ilk-yardim-derlenme-kpr': 'Yandan görünüş: derlenme rehberinin oyuncularıyla kalp masajı; yardımcı uzak yanda diz çökmüş, kollar dümdüz, omuzlar ellerin dikey üstünde; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-derlenme-sonuc': 'Önden görünüş: ilk değerlendirme rehberinin yaralısı derlenme pozisyonunda yan yatmış; üst el yanağın altında, üst diz önde yerde; ağız önünde mavi nefes dalgaları.',
  'ilk-yardim-kpr-yetiskin': 'Yandan görünüş: yetişkin TYD/OED/ilk değerlendirme rehberlerinin oyuncularıyla kalp masajı; yardımcı uzak yanda göğüs hizasında diz çökmüş, kollar dümdüz, omuzlar ellerin dikey üstünde; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-kanama-ortu': 'Yandan görünüş: kanama rehberinin yaralısı sırtüstü, boynuna kadar örtülü; aynı yardımcı uzak yanında diz çökmüş, eli omzunda, onunla konuşuyor.',
  'ilk-yardim-bogulma-kpr': 'Yandan görünüş: boğulma rehberinin oyuncularıyla kalp masajı; bilinci kapanmış kişi yerde sırtüstü, yardımcı diz çökmüş, kollar dümdüz; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-nobet-derlenme': 'Önden görünüş: nöbet rehberinin yaralısı kasılmalar bittikten sonra derlenme pozisyonunda yan yatmış; ağız önünde mavi nefes dalgaları.',

  // Yetişkin/çocuk boğulma
  'ilk-yardim-bogulma-isaret': 'Önden görünüş: yemek masasının başında ayakta, iki eliyle boğazını tutan, ağzı açık, yüzü kızarmış yetişkin (evrensel boğulma işareti); yanında endişeyle ona dönen bir kişi. Boğaz bölgesinde küçük turuncu uyarı işareti.',
  'ilk-yardim-sirt-vurusu': 'Yandan görünüş: boğulan yetişkin belinden belirgin öne eğilmiş, üst gövdesi yere yakın yatay. Yardımcı kişinin YANINDA ve biraz arkasında duruyor; bir kolu kişinin göğsünü önden destekliyor, diğer elini açık tutup (yumruk değil) el topuğuyla iki kürek kemiğinin arasına vuruyor. Kısa turuncu vuruş oku kürek kemikleri arasında bitiyor; ok ense ya da başa gitmiyor. Köşede "5×".',
  'ilk-yardim-yumruk-yeri': 'Yakın plan önden: kişinin karnı; yardımcının yumruğu başparmak tarafı içe dönük olarak göbeğin biraz üstünde, göğüs kemiğinin ucunun altında; diğer eli yumruğu kavrıyor. Göbek ve göğüs kemiği ucu silik işaretli, yumruk yeri turuncu daire.',
  'ilk-yardim-karin-basisi': 'Yandan görünüş: yardımcı boğulan kişinin arkasında, bir ayağı öne; kolları kişinin beline dolanmış, bir elinin yumruğu göbeğin hemen üstünde, öbür eli yumruğu kavramış. Kişi belinden BELİRGİN biçimde öne eğik (üst gövde yaklaşık 45 derece), dik durmuyor. Karından içeri ve yukarı doğru kavisli turuncu ok, köşede "5×".',

  // Nöbet
  'ilk-yardim-nobet-cevre': 'Yandan görünüş: yerde kasılma geçiren kişi (hareket çizgileri). Yardımcı diz çökmüş, kişinin yanındaki sehpayı zemin üzerinde kaydırarak kişiden uzağa çekiyor; eşya kişinin üstünden taşınmıyor, kişiye dokunan el yok. Uzaklaştırma yönünde turuncu ok.',
  'ilk-yardim-nobet-yastik': 'Yandan görünüş: nöbet geçiren kişi yerde; aynı yardımcı başının ucunda diz çökmüş, katlanmış ceketi iki eliyle başının altına yerleştiriyor. Kişinin ağzına bir şey sokan el silik ve kırmızı yasak işaretli küçük ek çizimde.',
  'ilk-yardim-nobet-saat': 'Yakın plan: bir el telefonda kronometreyi başlatıyor, ekranda "00:00" ve arka planda bulanık olarak nöbet geçiren kişi; köşede "5 dk" etiketi.',

  // Çocuk TYD
  'ilk-yardim-cocuk-bas-geri': 'Yandan yakın plan: sırtüstü yatan 5–6 yaşında çocuğun başı; yardımcının bir eli alında başı hafifçe geriye itiyor, iki parmak çene kemiğini kaldırıyor. Baş yetişkinden daha az geride; turuncu küçük oklar.',
  'ilk-yardim-cocuk-nefes': 'Yandan yakın plan: yardımcı çocuğun burnunu sıkmış, ağzını çocuğun ağzına kapatmış nefes veriyor; çocuğun göğsü hafif kalkmış, göğüste yukarı turuncu ok; köşede "5".',
  'ilk-yardim-cocuk-kpr-tek-el': 'Yandan görünüş: sert zeminde sırtüstü yatan çocuk; diz çökmüş yardımcının tek elinin topuğu göğüs kemiğinin alt yarısında, kolu dümdüz, omzu elin tam üstünde; diğer eli çocuğun alnında. Aşağı turuncu ok, göğüste "⅓" derinlik işareti, köşede "100–120/dk".',

  // Bebek TYD
  'ilk-yardim-bebek-bas-notr': 'Yandan yakın plan: masa gibi sert düz yüzeyde sırtüstü yatan bebek. Yardımcının bir eli bebeğin alnında, başı düz (nötr) tutuyor; öbür elinin bir ya da iki parmak ucu çene kemiğinin altında, çeneyi hafifçe kaldırıyor. Göğüste parmak ya da el yok. Yanında küçük ek çizimde çok geriye bükülmüş baş kırmızı yasakla; doğru konumda yeşil onay.',
  'ilk-yardim-bebek-nefes': 'Yandan yakın plan: yardımcının ağzı bebeğin ağzını ve burnunu birlikte kapatmış, hafifçe üflüyor; bebeğin göğsü hafif yükselmiş, göğüste küçük yukarı turuncu ok; köşede "5".',
  'ilk-yardim-bebek-kpr-basparmak': 'Yukarıdan yakın plan: yardımcının iki eli bebeğin göğüs kafesini yanlardan ve arkadan sarıyor; iki başparmak yan yana göğüs kemiğinin alt yarısında, meme uçlarını birleştiren çizginin hemen altında. Başparmaklarda aşağı turuncu ok, köşede "⅓ · 100–120/dk".',
  'ilk-yardim-bebek-kpr-tek-el': 'Yandan yakın plan: sert yüzeyde sırtüstü yatan bebek. Göğüste YALNIZCA BİR el var: yardımcının tek elinin topuğu göğüs kemiğinin alt yarısında, parmaklar göğüsten kalkık (düz avuç değil). Diğer el bebeğin alnında, başı düz (nötr) tutuyor. Aşağı turuncu ok.',

  // Bebek boğulma
  'ilk-yardim-bebek-tutus': 'Yandan görünüş: sandalyede oturan yardımcı bebeği yüzüstü kendi önkolunun üstüne yatırmış, önkolu uyluğuna dayalı; eli bebeğin çene kemiğini tutuyor (boğazı sıkmadan), bebeğin başı göğsünden aşağıda. Ok yok.',
  'ilk-yardim-bebek-sirt-vurusu': 'Yandan görünüş: önkolda yüzüstü, başı aşağıda bebek; yardımcının öbür eli AÇIK (parmaklar düz, avuç görünür) iki kürek kemiğinin üstünde kalkmış; elin topuğundan sırta inen turuncu ok, köşede "5×".',
  'ilk-yardim-bebek-cevir': 'Yandan görünüş: oturan yardımcının kucağında bebek artık SIRTÜSTÜ (yüzü yukarı), yardımcının önkolu üstünde, eli başını arkadan destekliyor; başı dizlere doğru, gövdesinden aşağıda. Bebeğin üstünde çevirme yönünü gösteren kavisli turuncu ok.',
  'ilk-yardim-bebek-gogus-basisi': 'Yukarıdan yakın plan: bebek yardımcının uyluklarında (koyu pantolon) sırtüstü, gözleri açık. Yardımcının iki önkolu alttan, bebeğin iki yanından gelir; avuçlar göğüs kafesinin yanlarında, parmaklar sırtın altında; iki başparmak yan yana göğüs kemiğinin alt yarısında, meme hizasının hemen altında, başa doğru. Başparmaklara turuncu ok, köşede "5×".',

  // Suda boğulma
  'ilk-yardim-suda-nefes': 'Yakın plan yandan (baş-omuz): sırtüstü yatan kişinin başı solda ve geride, çenesi kalkık. Yardımcının başı profilden aşağı bakıyor, ağzı kişinin ağzını kapatmış; bir eli alında, başparmak ve işaret parmağı burnu sıkıyor; öbür elinin iki parmağı çene kemiğinin altında. İki profil ayrı seçiliyor. Göğüs üstünde yukarı turuncu ok, köşede "5".',
  'ilk-yardim-suda-kpr': 'Yandan görünüş: suda boğulma rehberinin oyuncuları ile yetişkin kalp masajı: yardımcı göğüs hizasında diz çökmüş, kollar dirsekten kilitli, omuzlar ellerin dikey üstünde; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-suda-yan-yatir': 'Suda boğulma rehberinin kazazedesi derlenme (koma) pozisyonunda: yan yatmış, üstteki el yanağın altında, üstteki bacak dizden bükülü; başın üstünde nefes dalgaları.',
  'ilk-yardim-suda-uzan': 'Yandan görünüş: göl ya da havuz kıyısında yüzüstü yere yatmış kurtarıcı, gövdesi kıyıda, uzun bir dalı sudaki çırpınan kişiye uzatıyor; kişi dalı tutuyor. Kurtarıcının suya girmediği belli; dal boyunca turuncu ok.',
  'ilk-yardim-suda-at': 'Yandan görünüş: kıyıda ayakta duran kurtarıcı ipe bağlı can simidini sudaki kişinin biraz ötesine atıyor; ip kurtarıcının elinde. Atış yönünde kavisli turuncu ok; ek küçük çizimde suya atlayan kişi kırmızı yasak işaretli.',

  // Elektrik
  'ilk-yardim-elektrik-kpr': 'Yandan görünüş: elektrik çarpması rehberinin oyuncuları ile yetişkin kalp masajı (kollar kilitli, omuzlar ellerin üstünde; aşağı turuncu ok, "100–120/dk").',
  'ilk-yardim-elektrik-tahta-sopa': 'Yandan görünüş: kişi yerde doğal biçimde yatıyor, bir eli yerdeki elektrik kablosuna değiyor; bacakları yerde. Kurtarıcı kuru tahta bir paletin ya da lastik paspasın üstünde, lastik tabanlı ayakkabıyla duruyor ve kuru tahta süpürge sapıyla kabloyu kişinin elinden uzağa itiyor. İtme yönünde turuncu ok; kabloda küçük şimşek simgesi; kurtarıcının eli kişiye değmiyor.',
  'ilk-yardim-elektrik-hat-uzak': 'Geniş görünüş: yere kopup düşmüş, ucu kıvılcım saçan elektrik teli ve direk; telin çevresinde kırmızı kesikli büyük halka ve "20 m" etiketi. Halkanın dışında önden duran yardımcı iki kolunu yana açmış: bir eli tele doğru, öbür avucu arkadaki kişiye "dur" diyor.',
  'ilk-yardim-elektrik-yanik-sogut': 'Yakın plan: el ayasındaki küçük giriş yanığı musluktan akan serin suyun altında tutuluyor; su damlaları ve köşede "20 dk" saat simgesi.',

  // Şok ve bayılma
  'ilk-yardim-sok-kanama': 'Yakın plan: şok rehberinin kazazedesinin önkolundaki kanayan yaraya bez üstünden iki elle sert ve kesintisiz bastırma; aşağı turuncu ok.',
  'ilk-yardim-sok-yan-yatir': 'Şok rehberinin kazazedesi derlenme (koma) pozisyonunda, nefes dalgaları.',
  'ilk-yardim-bayilma-bacak': 'Yandan görünüş: bayılma rehberinin kazazedesi (uzun kızıl saçlı kadın) sırtüstü, gözleri kapalı; bacakları battaniye yığınıyla yaklaşık 30 cm yükseltilmiş, "30 cm" ölçü çizgisi; yardımcı başının yanında diz çökmüş.',
  'ilk-yardim-bayilma-yan-yatir': 'Bayılma rehberinin kazazedesi derlenme (koma) pozisyonunda, nefes dalgaları.',
  'ilk-yardim-sok-belirti': 'Yakın plan önden: yerde sırtüstü YATAN (oturan değil) kişinin soluk-gri yüzü, alnında ter damlaları, dudakları solgun; yanında diz çökmüş yardımcının iki parmağı bileğinde nabız yokluyor. Yanında küçük simgeler: ter damlası, hızlı kalp atışı çizgisi, soğuk mavi dalga.',
  'ilk-yardim-sok-battaniye': 'Yandan görünüş: yerde sırtüstü yatan kişi (yüzü endişeli); altında yerden yalıtan serili bir battaniye, üstü de boynuna kadar ikinci bir battaniyeyle örtülü; yakası açık. Alttakine ve üsttekine birer turuncu ok.',
  'ilk-yardim-bacak-kaldir': 'Yandan görünüş: düz zeminde sırtüstü yatan, gözleri açık kişi (şok rehberinin oyuncusu); bacakları katlanmış battaniye yığını üzerinde yaklaşık 30 cm yükseltilmiş, dizler düz. Yığının yanında ölçü çizgisi ve "30 cm"; yardımcı başının yanında diz çökmüş, eli omzunda.',
  'ilk-yardim-bayilma-oturt': 'Yandan görünüş: başı dönen kişi yere oturtulmuş, bacakları önde, bir eli alnında, başının üstünde baş dönmesi çizgisi; arkasında diz çökmüş yardımcı iki eliyle omzunu ve sırtını destekliyor.',
  'ilk-yardim-bayilma-kas-sik': 'Üç küçük panel: (1) oturan kişi bacaklarını çaprazlamış, uyluk kaslarını sıkıyor; (2) kişi çömelmiş; (3) kişi iki elinin parmaklarını kenetlemiş, kollarını iki yana çekiyor. Her panelde gerilen kasta turuncu vurgu ve karşı yönlü oklar.',

  // Kalp krizi
  'ilk-yardim-kalp-krizi-kpr': 'Yandan görünüş: kalp krizi rehberinin oyuncuları (yaşlı adam, başörtülü yardımcı) ile yetişkin kalp masajı; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-kalp-krizi-belirti': 'Önden görünüş: elini göğsünün ortasına bastırmış, yüzü acılı ve terli orta yaşlı kişi. Gövdede yarı saydam kırmızı ağrı bölgeleri: göğüs ortası, sol kol, boyun-çene ve sırt üstü; göğüsten bu bölgelere uzanan ince oklar.',
  'ilk-yardim-kalp-krizi-oturt': 'Yandan görünüş: kişi yere oturmuş, sırtını duvara ya da koltuğa yaslamış, dizleri bükülü (yarı oturur). Yardımcı yanında diz çökmüş, bir eli kişinin omzunda, sakin konuşuyor. Yardımcının elleri kişinin yüzüne, çenesine ya da boynuna değmiyor.',

  // İnme
  'ilk-yardim-inme-yan-yatir': 'İnme rehberinin kazazedesi (kır saçlı adam) derlenme (koma) pozisyonunda, nefes dalgaları.',
  'ilk-yardim-inme-yuz': 'Yakın plan önden: gülümsemeye çalışan kişinin yüzü; yüzün bir yanı ve ağız köşesi aşağı düşük, diğer yanı gülümsüyor. Düşen ağız köşesinde aşağı turuncu ok; köşede "YÜZ".',
  'ilk-yardim-inme-kol': 'Yandan görünüş: sandalyede oturan kişi iki kolunu öne kaldırmış; bir kol düz duruyor, diğer kol aşağı doğru kayıyor. Düşen kolda aşağı turuncu ok; köşede "KOL".',
  'ilk-yardim-inme-konusma': 'Yakın plan: konuşmaya çalışan kişinin yüzü, konuşma balonunda dağınık, karışık harf parçaları; karşısındaki yardımcı dinliyor. Köşede "KONUŞMA".',
  'ilk-yardim-inme-saat': 'Yakın plan: duvar saati; yanında not kâğıdı, üstünde büyük "10:10" yazılı, kalemi tutan el yazıyor; köşede "ZAMAN".',

  // Astım
  'ilk-yardim-astim-kpr': 'Yandan görünüş: astım rehberinin oyuncuları ile yetişkin kalp masajı; aşağı turuncu ok, "100–120/dk".',
  'ilk-yardim-astim-oturus': 'Yandan görünüş: sandalyede dik oturan, hafifçe öne eğilip kollarını masaya dayamış, ağzı açık zorlanarak nefes alan kişi; köşedeki küçük ek çizimde sırtüstü yatan kişi kırmızı yasakla.',
  'ilk-yardim-astim-fisfis': 'Yakın plan yandan: oturan kişi mavi rahatlatıcı inhalerin ağızlığını dudaklarıyla sıkıca kavramış, basıyor; yardımcının eli inhaleri tutmasına yardım ediyor. Turuncu ok inhalerden ağıza (ağızlığa) gidiyor, göze ya da yüzün başka yerine değil.',
  'ilk-yardim-astim-hazne': 'Yakın plan yandan: mavi inhaler, uzun şeffaf hazneye (spacer) takılı; kişi haznenin ağızlığını dudaklarıyla kavramış, sakin nefes alıyor. Haznenin içinde ilaç bulutu ve ağza doğru turuncu ok.',

  // Anafilaksi
  'ilk-yardim-anafilaksi-belirti': 'Yakın plan önden: dudakları ve göz çevresi şişmiş, boynunda ve kollarında kırmızı kabarık kurdeşen olan, eliyle boğazını tutup zorlanarak nefes alan kişi. Şişen dudak ve boğaz bölgesi turuncu vurgulu.',
  'ilk-yardim-adrenalin-kapak': 'Yakın plan: adrenalin oto-enjektörünü yumruk gibi kavrayan el (başparmak uçta değil, yanda); diğer el arka uçtaki güvenlik kapağını düz çekerek çıkarıyor. Çekme yönünde turuncu ok; kalemin iğne ucu aşağı, turuncu renkte.',
  'ilk-yardim-adrenalin-uyluk': 'Önden görünüş: sandalyede oturan kişi (pantolonlu). Kalem yere paralel, yandan gelen yardımcı elinde; turuncu ucu sağ uyluğun DIŞ YAN yüzüne dik bastırılmış, turuncu halka ve bastırma yönünde ok; köşede süre simgesi.',
  'ilk-yardim-anafilaksi-pozisyon': 'Panelli çizim, hep aynı kazazede: sol üstte yerde düz sırtüstü yatıyor (yeşil onay); sol altta nefes almakta zorlandığı için sırtı destekli, bacakları önde uzalı oturuyor (yeşil onay); sağda ayağa kalkıp yürüyen hali kırmızı yasak işaretli.',

  // Şeker düşmesi
  'ilk-yardim-hipo-yan-yatir': 'Şeker düşmesi rehberinin kazazedesi derlenme (koma) pozisyonunda, nefes dalgaları.',
  'ilk-yardim-hipo-belirti': 'Yakın plan önden: terli, solgun, şaşkın bakan kişi ("?"); elleri iki yanda titriyor (titreme çizgileri); koluna takılı şeker ölçüm sensörü.',
  'ilk-yardim-hipo-seker-ver': 'Önden görünüş: oturan, gözleri açık kişiye yardımcı bir bardak meyve suyu uzatıyor; masada birkaç küp şeker ve glikoz tableti paketi. Bardaktan kişiye turuncu ok; ek küçük çizimde baygın kişinin ağzına şeker koyma kırmızı yasak işaretli.',
  'ilk-yardim-hipo-15dk': 'Yakın plan: duvar saati ya da telefonda geri sayım, yanında yarım içilmiş meyve suyu bardağı; köşede "15 dk".',
};
