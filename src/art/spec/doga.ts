// Çizim şartnamesi: Orman ve doğa rehberleri.
// Hepsi detaylı düz (flat) çizim, 4:3 tuval, Kızılay/AFAD broşür üslubu.
export const SPEC: Record<string, string> = {
  // --- hipotermi ---
  'doga-hipotermi-koruma': 'Yandan: karlı/yağmurlu açık alanda bir yardımcı, titreyen kişiyi kolundan tutup büyük bir kayanın rüzgâr almayan tarafına götürüyor; yere serilmiş battaniye. Rüzgâr ve kar çizgileri kayada kesiliyor; turuncu yön oku.',
  'doga-hipotermi-kuru-giysi': 'İç mekân ya da çadır, yandan: yardımcı oturan kişinin ıslak, damlayan montunu nazikçe çıkarıyor; yanında katlanmış kuru giysi yığını. Islak giysiden damlalar, kuru giysiye yeşil onay.',
  'doga-hipotermi-sarma': 'Yandan: yerdeki yalıtım minderi üstünde yatan kişi uyku tulumu/battaniye ve dışta folyo battaniyeye sarılı; başı bere ve battaniye ucuyla örtülü, yüzü açık. Altındaki minder vurgulu.',
  'doga-hipotermi-govde-isitma': 'Yakın plan, battaniye hafif aralanmış: beze sarılı ılık termoforlar kişinin boynuna, göğsüne ve kasığına konmuş; üç noktada küçük turuncu sıcaklık işaretleri. Kol ve bacaklara ovma yapan el üzerinde kırmızı yasak (köşede küçük).',
  'doga-hipotermi-kpr': 'Karlı açık alan, yandan: rehberin aynı yardımcısı (kadın) sırtüstü yatan aynı üşümüş adamın yanında diz çökmüş; kollar dirsekten düz, omuzlar ellerin tam dikey üstünde, eller göğüs ortasında. Aşağı turuncu ok, "100–120/dk".',
  // --- kaybolma ---
  'doga-kaybolma-dur': 'Önden: orman patikasının ayrıldığı yerde duran sırt çantalı yürüyüşçü, bir elini kaldırmış "dur" işareti yapıyor, düşünceli (gülümsemiyor). Yanda kırmızı sekizgen DUR tabelası simgesi.',
  'doga-kaybolma-yerinde-kal': 'Yandan: kişi devrik bir ağaç kütüğünün yanında yaprak döşek üstünde oturuyor, yanında parlak bez asılı; ondan uzaklaşan kesikli patika çizgisi kırmızı yasaklı, kişinin bulunduğu yerde konum iğnesi.',
  'doga-kaybolma-duduk': 'Yakın plan, yandan: rehberin yürüyüşçüsü (kadın, at kuyruğu) düdük çalıyor; aralıklı ses dalgaları, "6× / 1 dk" ve dönen tekrar oku.',
  'doga-kaybolma-parlak-bez': 'Açık alan: parlak kırmızı giysi ağaç dalına asılı; aynı yürüyüşçü diz çökmüş, ikinci parlak bezi yere seriyor.',
  'doga-kaybolma-zemin': 'Yandan kesit: aynı yürüyüşçü topraktan bir karış yüksek yaprak-dal yatağı üstünde oturuyor; topraktan yükselen mavi soğuk okları katmanda kesiliyor; yanında sırt çantası.',
  // --- yılan, akrep, arı ---
  'doga-yilan-uzaklas': 'Yandan: kayalık patikada kıvrılmış bir engerek; kişi ondan geri geri uzaklaşıyor (turuncu geri ok). Yılana sopayla uzanan figür üzerinde küçük kırmızı yasak işareti.',
  'doga-yilan-hareketsiz': 'Yandan: yerde sırtüstü uzanan kişinin ısırılmış bacağı iki yandan rulo yapılmış kahverengi montla (buz ya da soğuk paket DEĞİL) desteklenip hareketsiz tutulmuş; ayak bileğinde iki küçük diş izi; yanında telefonla 112\'yi arayan yardımcı.',
  'doga-ari-igne-kazima': 'Yakın plan: kol derisinde kalmış küçük arı iğnesi; bir banka kartının kenarı yan yatırılmış, iğneyi deri yüzeyinde kazıyarak çıkarıyor (turuncu kazıma oku). Köşede cımbız üzerinde kırmızı yasak işareti.',
  'doga-alerji-sislik': 'Yakın plan yüz (önden): dudakları ve göz kapakları şişmiş, nefes almakta zorlanan kişi, elini boğazına götürmüş; yanında uyluğun dış yanına adrenalin kalemi uygulayan el. Köşede "112".',
  // --- hava değişimi ---
  'doga-hava-geri-don': 'Yandan: dağ sırtında yükselen patika; zirvenin üstünde koyulaşan karanlık bulutlar ve rüzgâr çizgileri; yürüyüşçü dönmüş, aşağıya, geldiği yöne yürüyor (yeşil geri ok). Zirveye doğru giden yolda kırmızı yasak işareti.',
  'doga-hava-sirttan-in': 'Yandan: karanlık gökyüzü altında uzun bir yamaç; sırtın tepesinde tek başına duran ağaç, yanında şimşek ve ağacın üstünde kırmızı yasak. İki yürüyüşçü yamaçtan aşağı, alçaktaki ağaçlığa doğru iniyor (turuncu aşağı ok).',
  'doga-hava-comelme': 'Yandan: açık alanda kişi sırt çantasının üstünde çömelmiş, ayakları bitişik, başı eğik, elleri kulaklarında; arkada uzakta şimşek. Yere uzanmış figür üzerinde kırmızı yasak; yanda iki kişi arasında ölçü oku ve "5 m".',
  'doga-hava-sis-dur': 'Önden: yoğun gri sis içinde patikada durmuş yürüyüşçü elindeki telefona/haritaya bakıyor; birkaç metre ötesi görünmüyor, patika işareti (boyalı taş) yanında. Ekranda konum iğnesi.',
  'doga-hava-yagmurluk': 'Önden: rehberin yürüyüşçüsü (adam) yağmur başlamadan sarı yağmurluğunu giymiş, fermuarını yukarı çekiyor (turuncu yukarı ok); koyulaşan bulutlar ve ilk damlalar; çantası yerde.',
  // --- yalnız yaralanma ---
  'doga-yaralanma-bastirma': 'Yandan: yerde oturan yaralı öne eğilmiş, baldırındaki kanayan yaraya katlanmış temiz bezi kendi iki eliyle sıkıca bastırıyor; aşağı doğru turuncu bası oku.',
  'doga-yaralanma-atel': 'Yandan: kayaya yaslanmış oturan kişi, burkulmuş/kırık bacağını iki yanına yerleştirdiği düz dallarla ve bezlerle sarıp sabitlemiş; sargılar dizin altında ve üstünde; bacak hareketsiz, yanında sırt çantası.',
  'doga-yaralanma-zemin': 'Yandan kesit: aynı yaralı adam yaprak-dal yatağı üstünde oturuyor; topraktan yükselen soğuk okları katmanda kesiliyor.',
  'doga-yaralanma-duduk': 'Yakın plan, yandan: aynı yaralı adam düdük çalıyor; ses dalgaları, "6× / 1 dk" ve tekrar oku.',
};
