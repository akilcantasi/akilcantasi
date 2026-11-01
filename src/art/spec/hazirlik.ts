// Hazırlık ve iletişim kategorisinin çizimleri (detaylı düz illüstrasyon, 4:3).
export const SPEC: Record<string, string> = {
  // afet-cantasi
  'hazirlik-canta-kapi': 'Önden görünüş, ev girişi: kapının hemen yanında duvardaki askıda dolu bir turuncu sırt çantası; bir yetişkin kapıyı açarken eliyle çantayı alıyor. Çantaya doğru turuncu ok, köşede yeşil onay işareti.',
  'hazirlik-canta-su-gida': 'Yukarıdan görünüş: masa üstünde açık sırt çantasının yanında düzenli dizilmiş kapalı su şişeleri, konserveler, kuru meyve paketi, bisküvi, küçük tahin ve pekmez kavanozu ve konserve açacağı. Köşede "3 gün" etiketi.',
  'hazirlik-canta-koruma': 'Yukarıdan görünüş: masada düzenli serilmiş düdük, toz maskesi, iş eldiveni, kapalı çakı, küçük makas, katlanmış yağmurluk ve rulo battaniye; yanında açık sırt çantası.',
  'hazirlik-tarih-kontrol': 'Yakın plan: iki el bir konserve ya da ilaç kutusunu tutuyor, başparmak üstteki son kullanma tarihini gösteriyor; arkada duvarda takvim. Sahnede belirli bir çanta türü (sırt çantası ya da ilk yardım kutusu) yok, böylece her iki rehbere de uyuyor. Köşede "6 ay" etiketi ve yeşil onay.',
  // belgeler (ortak)
  'hazirlik-belge-posette': 'Yakın plan: eller kimlik, tapu ve poliçe fotokopileriyle dolu şeffaf, fermuarlı su geçirmez poşetin fermuarını kapatıyor. Su damlaları yalnızca poşetin DIŞ yüzeyinde, aşağı kayıp gidiyor; içerideki kâğıtlar kuru, kâğıtların üstünde damla yok. Fermuarda kapanma yönünde turuncu ok.',
  'hazirlik-belge-fotokopi': 'Yandan görünüş: bir kişi fotokopi makinesinin başında kimlik kartı ve tapu belgesinin kopyasını alıyor; makineden çıkan kâğıt destesi. Kâğıtlarda yazı yerine yalnızca gri çizgiler.',
  'hazirlik-belge-dijital': 'Yakın plan: el telefonla masadaki belgenin fotoğrafını çekiyor; telefondan buluta ve yanda duran USB belleğe giden iki turuncu ok, bulutta küçük kilit simgesi.',
  'hazirlik-belge-yakina': 'Önden görünüş: kapı önünde bir kişi kapalı zarfı başka bir şehirde yaşayan yakınına (valizli, arkada farklı bir şehir silueti) uzatıyor. Zarftan karşıya turuncu ok.',
  // iletisim
  'hazirlik-112-baska-sebeke': 'Yakın plan: el telefonu tutuyor, ekranın üstünde "Sadece acil aramalar" yazısı ve boş sinyal çubukları, ekranda büyük "112"; arka planda iki farklı renkte baz istasyonu kulesi, telefondan uzaktaki ikinci kuleye kesikli turuncu ok.',
  'hazirlik-pil-tasarruf': 'Yakın plan: telefon ekranında parlaklık çubuğu aşağı çekilmiş ve pil simgesi düşük güç (sarı) modunda; başparmak düğmeye basıyor. Aşağı turuncu ok parlaklık çubuğunda.',
  // ev-sabitleme
  'hazirlik-dolap-sabitleme': 'Yandan görünüş: bir yetişkin matkapla uzun bir kitaplığın üst köşesini L demirle duvara vidalıyor; L demir ve dübel büyütülmüş ayrıntı balonunda. L demire turuncu ok, köşede yeşil onay.',
  'hazirlik-yatak-yeri': 'Yukarıdan oda planı: yatak pencereden ve uzun dolaptan uzakta iç duvarda, yeşil onaylı; pencere altındaki ve dolap yanındaki eski yatak yeri soluk çizgiyle ve kırmızı yasak işaretiyle gösterilmiş. Yatağın yeni yerine turuncu ok.',
  'hazirlik-agir-alt-raf': 'Önden görünüş: kitaplık rafları; ağır kitaplar, cam kavanoz ve vazo en alt rafa konuyor, üst raflarda yalnızca hafif kutular. Rafların önünde gerili ince bant. Yukarıdan aşağıya turuncu ok.',
  'hazirlik-dolap-mandal': 'Yakın plan: mutfak üst dolap kapağının iç yüzüne vidalanmış çocuk emniyet mandalı; el kapağı açmaya çalışıyor ama mandal tutuyor. Mandala turuncu ok.',
  'hazirlik-tv-kayis': 'Yandan görünüş: televizyon sehpa üstünde, arkasından duvara bağlanan iki gergin kayış; yanda mikrodalga altında kaydırmaz ped. Kayışlara turuncu oklar, köşede yeşil onay.',
  // aile planı
  'hazirlik-plan-masa': 'Önden görünüş: mutfak masasında anne, baba ve iki çocuk bir kâğıda plan çiziyor; kâğıtta ev, ok ile çıkış yolu ve iki buluşma noktası simgesi. Herkes kâğıda bakıyor.',
  'hazirlik-irtibat-kisi': 'Bölünmüş sahne: solda deprem bölgesinde telefonla konuşan genç; sağda başka şehirde evinde telefonu açan yaşlı akraba; ikisi arasında harita üstünde uzun kesikli turuncu ok.',
  'hazirlik-numara-kart': 'Yakın plan: el, üstünde telefon simgeleri ve numara çizgileri olan küçük katlanmış kartı cüzdanın içine koyuyor; kartın üstünde "112" okunuyor.',
  'hazirlik-tatbikat': 'Yandan: evde tatbikat. Anne sağlam bir masanın altında Çök-Kapan-Tutun yapıyor: bir koluyla başını ve ensesini koruyor, öbür eliyle masa ayağını tutuyor. Köşede "6 ay" yazılı takvim, üstte sarsıntı çizgileri.',
  // araç kiti
  'hazirlik-arac-zorunlu': 'Arkadan görünüş: açık araç bagajında düzenli dizilmiş kırmızı yangın söndürücü (1 kg), ilk yardım çantası ve iki katlanmış üçgen reflektör. Üçüne de yeşil onay işaretleri.',
  'hazirlik-arac-stepne': 'Yakın plan: bagaj tabanı kaldırılmış, içinde stepne, kriko ve bijon anahtarı; bir el lastik basınç ölçeriyle stepnenin havasını ölçüyor.',
  'hazirlik-arac-kis': 'Arkadan görünüş: karlı bir günde açık bagajda kar zinciri, küçük kürek, buz kazıyıcı, katlanmış battaniye, bere ve eldiven. Bagaj kapağında kar.',
  'hazirlik-arac-aku-kablo': 'Yakın plan: bagajdaki çanta içinde kırmızı ve siyah maşalı akü takviye kablosu sarılı duruyor; yanında powerbank ve araç şarj kablosu.',
  'hazirlik-arac-sondurucu-kontrol': 'Yakın plan: el yangın söndürücünün basınç göstergesini tutuyor; ibre yeşil bölgede, yanında yeşil onay işareti.',
  // ilk yardım çantası
  'hazirlik-ilkyardim-kutu-yer': 'Önden görünüş: koridorda yetişkin göz hizasındaki dolap rafında kırmızı hilalli ilk yardım kutusu; bir yetişkin uzanıp alıyor, yerde oynayan küçük çocuk oraya erişemiyor. Kutuya turuncu ok.',
  'hazirlik-ilkyardim-eldiven': 'Yakın plan: iki el tek kullanımlık mavi eldiven giyiyor; yanda açık kutuda ikinci çift eldiven ve tanınır bir cep tipi suni solunum maskesi (pocket mask): şeffaf, üçgen/armut biçimli plastik maske, üstünde tek yönlü valfli ağızlık; yanında küçük sert taşıma kutusu.',
  'hazirlik-ilkyardim-aletler': 'Yukarıdan görünüş: beyaz bez üstünde yan yana makas, cımbız, çengelli iğneler ve camsız dijital termometre.',
  // iş yeri ve okul
  'hazirlik-is-cikis-yolu': 'Önden görünüş: ofis koridorunda duvardaki yeşil "acil çıkış" levhası (koşan insan simgesi) ve merdiven kapısı; çalışan levhayı gösteriyor. Merdivene doğru turuncu ok.',
  'hazirlik-is-masa-cantasi': 'Yakın plan: ofis masasının çekmecesi açık, içinde küçük çanta: su şişesi, atıştırmalık, el feneri, düdük, toz maskesi, ilaç kutusu; çekmecenin yanında yere konmuş rahat spor ayakkabı.',
  'hazirlik-is-cok-kapan': 'Yandan görünüş: ofiste, pencereden uzakta bir çalışan sağlam masanın altına ellerinin ve dizlerinin üzerine çökmüş; bir koluyla başını ve ensesini koruyor, öbür eli masa ayağını açıkça kavramış. Köşede yeşil onay.',
  'hazirlik-okul-teslim': 'Önden görünüş: okul bahçesinde yelekli öğretmen elindeki listeye bakarak bir çocuğu velisine teslim ediyor; veli kimliğini gösteriyor. Listeye turuncu ok.',
  // evcil hayvan
  'hazirlik-evcil-canta': 'Yukarıdan görünüş: yerde küçük bir çantanın yanında mama paketi, su şişesi, katlanır su kabı ve konserve mama; yanında oturan kedi bakıyor.',
  'hazirlik-evcil-kafes': 'Yandan görünüş: bir yetişkin kapısı kilitli taşıma kafesini sapından taşıyor, içinde kedi görünüyor; diğer elinde tasmalı köpeğin gezdirme kayışı.',
  'hazirlik-evcil-kunye': 'Yakın plan: köpeğin boynundaki tasmada telefon numarası çizgileri olan metal künye; bir el künyeyi tutuyor. Künyeye turuncu ok.',
  'hazirlik-evcil-foto': 'Yakın plan: el telefonu tutuyor, ekranda sahibiyle kucağındaki kedinin birlikte fotoğrafı; yanında su geçirmez poşette aşı karnesi.',
};
