// Nükleer, kimyasal, biyolojik ve patlama rehberlerinin çizim tarifleri.
// Üslup: ayrıntılı düz (flat) çizim, Kızılay/AFAD broşürü gibi; 4:3 tuval.
export const SPEC: Record<string, string> = {
  // nukleer-radyasyon
  'nukleer-bina-gir': 'Yandan görünüş: sokakta yürüyen bir yetişkin, elinden tuttuğu çocukla birlikte tuğla/beton apartmanın açık kapısından içeri giriyor; arkada gökyüzünde uzakta sarı-gri bulut. Kapıya doğru turuncu ok; kenarda park etmiş araba üstünde küçük kırmızı "yasak" işareti.',
  'nukleer-bina-ortasi': 'Kesit görünüş: üç katlı bina ve bodrumu; bodrumda ve orta kattaki iç odada oturan aile, dış duvarlardan ve pencerelerden uzakta. Bodrum ve iç oda yeşil onay ile vurgulu; çatı katı ve pencere kenarı soluk.',
  'nukleer-giysi-cikar': 'Önden görünüş: kapı girişinde duran kişi dış montunu silkelemeden, yavaşça omuzlarından sıyırıp çıkarıyor; ayakkabıları çıkarılmış yanında. Yerde açık büyük naylon poşet, monttan poşete turuncu ok.',
  'nukleer-dus-sampuan': 'Yandan görünüş: duşta ılık su altında, gözleri kapalı kişi saçını şampuan köpüğüyle iki eliyle yıkıyor. Raf üstünde şampuan şişesi yeşil onaylı, yanındaki saç kremi şişesi kırmızı "yasak" işaretli.',
  'nukleer-iceride-24-saat': 'Oturma odasında koltukta oturan aile, kapalı pencerenin önünde perdeler çekili; duvarda büyük saat ve köşede "24 sa" etiketi. Kapıda kırmızı "yasak" çıkış simgesi.',

  // kimyasal-sizinti
  'nukleer-kimyasal-yana-kac': 'Yukarıdan görünüş (harita gibi): sol üstte fabrika bacası, oradan sağa doğru yayılan yeşil-sarı gaz bulutu ve rüzgâr okları. Kişi bulutun ilerleme yönüne dik, yana doğru koşuyor (turuncu ok); bulutun içine doğru giden yol kırmızı "yasak" ile işaretli.',
  'nukleer-ust-kat-ic-oda': 'Kesit görünüş: çok katlı bina; en alt katta ve bodrumda yerde biriken yeşil-sarı gaz katmanı. Üst kattaki penceresiz iç odada aile oturuyor, yeşil onay; bodruma inen merdiven kırmızı "yasak" işaretli.',
  'nukleer-kapi-havlu-bant': 'Yakın plan: diz çökmüş kişi kapının alt boşluğuna ıslak, rulo yapılmış havlu sıkıştırıyor; kapı kenarı boyunca gri geniş bant çekilmiş. Havluya turuncu ok.',
  'nukleer-kimyasal-islak-bez': 'Yakın plan yüz: rehberin kadını (topuz, teal) ıslak bezi eliyle ağız ve burnuna bastırıyor; üstte sarı-yeşil gaz.',
  'nukleer-kimyasal-yikama': 'Yakın plan: musluktan bol akan su çıplak ön kol ve elin üstüne dökülüyor (giysi çıkarılmış); "15 dk" zamanlayıcı.',

  // nukleer-salgin
  'nukleer-dirsege-oksur': 'Yakın plan, 3/4 profil: kişi dirseğinin iç kısmına doğru hapşırıyor, ağzı ve burnu dirseğiyle kapalı; küçük damlacıklar dirsekte duruyor. Yeşil onay.',
  'nukleer-hasta-ayri-oda': 'Ev içi kesit: kalın bir duvar evi ikiye ayırıyor. Solda ayrı odada, yatağın tamamı odanın içinde, battaniyeye sarılı, alnında ıslak bez olan ateşli hasta; sağda salonda diğer aile üyeleri. Aradaki duvarda kapalı bir kapı, yatak ya da eşya kapı çerçevesine taşmıyor. Kapalı kapıya yeşil onay.',
  'nukleer-hasta-bakim-maske': 'Yandan görünüş: yatakta oturan hasta ve ona su bardağı uzatan yakını, ikisinin de yüzünde iyi oturan beyaz maske. Arkada açık pencereden içeri giren hava akımı çizgileri.',
  'nukleer-supheli-paket': 'Yandan görünüş: masa ya da bank üstünde, üzerinden beyaz toz dökülmüş açık zarf ve sahipsiz kapalı çanta; kişi eline dokunmadan, ondan uzaklaşarak kapıya yürüyor (turuncu ok). Pakete uzanan el silueti kırmızı "yasak" işaretli.',
  'nukleer-salgin-supheli-paket': 'nukleer-supheli-paket ile aynı kurgu; uzaklaşan kişi salgın rehberinin bakıcı kadını.',

  // nukleer-korunma-odasi
  'nukleer-ic-oda-sec': 'Yukarıdan ev planı: dış duvarlarda pencereler; ortada penceresiz, banyoya bitişik iç oda yeşil renkle vurgulanmış ve yeşil onaylı. Pencereli dış odalar soluk gri.',
  'nukleer-kapatma-seti': 'Masada düzenli dizilmiş korunma seti: geniş gri bant ruloları, makas, katlanmış havlular, pencere boyutunda kesilip katlanmış kalın şeffaf naylonlar; her naylonun üstünde küçük pencere simgeli yapışkan etiket.',
  'nukleer-oda-malzemeleri': 'İç odada yer üstüne dizilmiş malzemeler: su şişeleri, konserve ve paketli yiyecek, ilaç kutusu, el feneri, pilli radyo, telefon ve şarj aleti, çöp poşetleri. Üstten hafif görünüş.',
  'nukleer-pencere-naylon-bant': 'Önden görünüş: kişi pencereyi kaplayan şeffaf kalın naylonun kenarına gri geniş bant yapıştırıyor; pencere altındaki menfez zaten bantla kapatılmış. Banda turuncu ok.',

  // nukleer-patlama-sonrasi
  'nukleer-patlama-uzaklas': 'Yandan görünüş: arka planda duman yükselen hasarlı bina; önde insanlar sakin ama hızlı yürüyerek uzaklaşıyor, biri yaşlı bir kişinin koluna girmiş. Uzaklaşma yönüne turuncu ok; yerde bırakılmış çanta, kimse almak için durmuyor.',
  'nukleer-geri-donme-yasak': 'Yandan görünüş: emniyet şeridiyle çevrilmiş dumanlı olay yeri; şeride doğru telefonunu kaldırmış, video çekmeye giden kişi kırmızı "yasak" işaretli. Diğer kişiler ters yönde uzaklaşıyor, yeşil onay.',
  'nukleer-patlama-merdiven': 'Asansör kırmızı yasaklı; yanında rehberin kadını tırabzana tutunarak merdivenden AŞAĞI iniyor; basamaklar boyunca aşağı turuncu ok.',
  'nukleer-patlama-duduk': 'Enkaz altında karanlık boşluk: rehberin kadını düdük çalıyor; üstte beton tavan, yanda boru; ses dalgaları ve "6× / 1 dk".',

  // nukleer-maske-kullanimi
  'nukleer-maske-cene': 'Yakın plan, önden: kişi beyaz N95/FFP2 maskeyi bir avucunun içine almış, metal burun teli parmak uçlarında ve üstte; lastikler elin altından serbest sarkıyor. Maskeyi çenesinin altına oturtuyor, maskenin alt kenarı çeneyi sarıyor. Yukarı doğru turuncu ok.',
  'nukleer-maske-lastikler': 'Yandan görünüş (profil): maske yüzde; üst lastik başın arkasında tepeye yakın, alt lastik ensede kulak altında, ikisi paralel ve çaprazlanmamış. Lastikleri gösteren iki turuncu ok, yeşil onay.',
  'nukleer-maske-burun-teli': 'Yakın plan, önden: iki elin işaret ve orta parmakları maskenin burun telini burnun iki yanına doğru bastırıp şekil veriyor. Parmaklardan içe doğru küçük turuncu oklar.',
  'nukleer-maske-kacak-kontrol': 'Yakın plan, 3/4 profil: kişi iki avucuyla maskenin önünü kapatıp nefes veriyor; ayrı küçük çerçevede maskenin üst kenarından kaçan hava çizgileri ve buğulanan gözlük kırmızı "yasak", ana resimde kaçaksız maske yeşil onay.',
  'nukleer-maske-cikar': 'Yandan görünüş: kişi maskenin önüne dokunmadan, alt ve üst lastikleri başının arkasından tutup öne doğru çıkarıyor (turuncu ok). Yanında açık çöp kutusu ve akan musluk simgesi.',
};
