// Zehirlenme rehberlerinin çizim tarifleri.
// Üslup: ayrıntılı düz (flat) çizim, Kızılay/AFAD broşürü gibi; 4:3 tuval.
export const SPEC: Record<string, string> = {
  // karbonmonoksit
  'zehirlenme-co-temiz-hava': 'Yandan görünüş: içeride yanan kömür sobası, bir yetişkin pencereyi ardına kadar açmış; diğer yetişkin baygın görünen kişiyi koltuk altlarından tutup açık kapıdan dışarı, temiz havaya çıkarıyor. Dışarı doğru turuncu ok, içeride hafif gri gaz bulanıklığı.',
  'zehirlenme-co-cadirda-mangal-yasak': 'Yandan görünüş: açıkça tanınan bir çadırın ya da konteynerin içinde yanan mangal, tüplü ısıtıcı ve çalışan küçük bir jeneratör; içeride uyuyan kişi. Bütün sahne büyük kırmızı "yasak" işaretiyle çizili.',
  'zehirlenme-jenerator-6-metre': 'Yandan görünüş: solda evin kapısı ve penceresi, sağda açık havada çalışan jeneratör; aralarında ölçü oku ve "6 m" etiketi, jeneratörün egzozu evden uzağa dönük. Yeşil onay.',
  'zehirlenme-co-dedektor': 'Yakın plan: yatak odası duvarında, yatağın yakınında takılı küçük pilli karbonmonoksit dedektörü; bir el test düğmesine basıyor, dedektörden ses dalgaları çıkıyor.',

  // zehirlenme (genel) ve ortak
  'zehirlenme-goz-yika': 'Önden büyük yüz yakın planı, baş yaralı göz tarafına yatık; yardımcının eli sağ alttan: başparmak alt kapağı aşağı, işaret parmağı üst kapağı yukarı çekiyor. Musluk suyu gözün burun tarafındaki iç köşesine düşüp dış köşeye akıyor ve yanaktan süzülüyor; sağlam göz kapalı. Akış yönünde turuncu ok; köşede "15 dk".',
  'zehirlenme-kutuyu-goster': 'Yakın plan: bir el telefonu kulağa tutuyor, öbür el etiketli ilaç kutusunu ya da temizlik maddesi şişesini havaya kaldırıp etiketine bakıyor. Telefon ekranında "114".',

  'zehirlenme-kpr': 'Yandan görünüş: yerde sırtüstü yatan bilinçsiz adam; yanında diz çökmüş yardımcı kadın, kollar düz, eller göğsün ortasında bastırıyor; aşağı turuncu ok, "100–120/dk".',
  'zehirlenme-yan-yatir': 'Derlenme pozisyonunda yan yatan bilinçsiz adam (zehirlenme rehberinin yaralısı), nefes dalgası.',
  'zehirlenme-co-yan-yatir': 'Derlenme pozisyonunda yan yatan bilinçsiz adam (karbonmonoksit rehberinin yaralısı), nefes dalgası.',
  'zehirlenme-cocuk-yan-yatir': 'Derlenme pozisyonunda yan yatan bilinçsiz küçük kız (çocuk yutma rehberinin çocuğu), nefes dalgası.',
  'zehirlenme-metanol-yan-yatir': 'Derlenme pozisyonunda yan yatan bilinçsiz adam (metanol rehberinin kişisi), nefes dalgası.',
  'zehirlenme-cocuk-kutu': 'zehirlenme-kutuyu-goster ile aynı; arayan kişi çocuğun annesi.',
  'zehirlenme-tarim-goz-yika': 'zehirlenme-goz-yika ile aynı; gözü yıkanan kişi yaşlı çiftçi.',
  'zehirlenme-mantar-acil': 'Karnını tutan, acı çeken adam; eşi eli sırtında, onunla kırmızı hilalli sağlık çadırına yürüyor; turuncu ok.',
  'zehirlenme-gida-doktor': 'Hasta kadın, yakını eli sırtında, birlikte sağlık çadırına yürüyor; turuncu ok.',

  // zehirlenme-mantar
  'zehirlenme-mantar-ornek': 'Yakın plan: masada yarısı yenmiş mantar yemeği tabağı; bir el kalan çiğ mantarları şeffaf poşete koyuyor, öbür el telefonla mantarın fotoğrafını çekiyor. Poşete turuncu ok.',
  'zehirlenme-mantar-saat': 'Bölünmüş sahne: solda mantar yemeği yiyen aile ve duvar saati; sağda aynı saat ilerlemiş, "6 sa" etiketi, karnını tutan kişi. İki saat arasında turuncu zaman oku.',
  'zehirlenme-mantar-toplama-yasak': 'Yandan görünüş: ormanda yerden yabani mantar toplayan kişi kırmızı "yasak" işaretli; yanında küçük çerçevede markette bandrollü, etiketli paketli kültür mantarı yeşil onaylı.',

  // zehirlenme-gida
  'zehirlenme-gida-yudum-su': 'Yakın plan: bir sandalyede ya da kanepede açıkça oturan kişi bardaktan küçük bir yudum alıyor; sırtında pelerin gibi görünen örtü yok. Masada ağızdan sıvı tuzu (ORS) paketi ve su sürahisi.',
  'zehirlenme-gida-konserve-at': 'Yakın plan: kapağı dışa doğru şişmiş, kabarmış konserve kutusu ve köpüklü kapaklı kavanoz; ikisinin üstünde kırmızı "yasak", bir el kapalı halde çöpe atıyor (turuncu ok).',

  // zehirlenme-cocuk-yutma
  'zehirlenme-dugme-pil': 'Yakın plan: yerde açık uzaktan kumanda ve yanında parlayan küçük düğme pil; çocuğun eli pile uzanıyor. Kenarda koşarak hastaneye giden ebeveyn simgesi ve kırmızı hilal işareti.',
  'zehirlenme-kilitli-dolap': 'Önden görünüş: mutfakta tezgâhın üstünde, yüksekteki kilitli dolabın içinde ilaç kutuları ve temizlik maddeleri kendi şişelerinde; dolapta kilit simgesi, yeşil onay. Alt çerçevede su şişesine konmuş çamaşır suyu kırmızı "yasak".',

  // zehirlenme-metanol
  'zehirlenme-metanol-bulanik-gorme': 'Masa üstündeki etiketsiz içki şişesi ve bardak bulanık, sisli, çift görünüyor; ön planda solda endişeli adam (omuz-baş) onlara bakıyor.',
  'zehirlenme-ayni-sise': 'Önden görünüş: masada tek etiketsiz şişe, etrafında bardaklar ve üç dört kişi; şişeden her bir kişiye doğru turuncu oklar; yüzler endişeli.',
  'zehirlenme-bandrol-kontrol': 'Yakın plan: el, kapağı açılmamış içki şişesinin boynundaki bandrolü gösteriyor, yeşil onay; yanında etiketsiz, kapağı açık pet şişe kırmızı "yasak".',

  // zehirlenme-tarim-ilaci
  'zehirlenme-tarla-temiz-hava': 'Yandan görünüş: ilaçlanmış sera ya da tarla kenarında, kimyasala dayanıklı uzun eldivenli ve filtreli yarım yüz maskeli (toz maskesi değil) bir kişi fenalaşmış çiftçinin koluna girip onu açık havaya, rüzgârın geldiği tarafa doğru götürüyor. Turuncu ok; yerde sırt pülverizatörü.',
  'zehirlenme-pestisit-etiket': 'Yakın plan: el tarım ilacı kutusunu tutuyor, öbür el telefonla etiketin fotoğrafını çekiyor; telefon ekranında "114".',
  'zehirlenme-eldivenle-giysi-cikar': 'Yandan görünüş: uzun eldivenli yardımcı, çiftçiden çıkarılan ilaç lekeli ceketi şeffaf poşete koyuyor (aşağı turuncu ok); lekeli çizmeler poşetin yanında; çiftçi atlet ve çorapla bekliyor.',
  'zehirlenme-pestisit-kilitli': 'Önden görünüş: ahırda ya da depoda kilitli metal dolapta kendi kutularında tarım ilaçları, yeşil onay; alt çerçevede boş ilaç kutusundan su içen el kırmızı "yasak".',
};
