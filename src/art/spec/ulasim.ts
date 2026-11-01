// Araç ve yolda kategorisinin çizimleri (detaylı düz illüstrasyon, 4:3).
export const SPEC: Record<string, string> = {
  // ortak
  'ulasim-reflektor-mesafe': 'Yukarıdan görünüş: çift yönlü yolda sağ şeritte duran, dörtlüleri yanan araç. Aynı şeritte aracın arkasında ve önünde birer kırmızı üçgen reflektör; araç ile her reflektör arasında ölçü çizgisi, altta tek "30 m / 150 m" etiketi. Arkadan gelen aracın fren lambaları yanıyor.',
  'ulasim-kaza-reflektor': 'ulasim-reflektor-mesafe ile aynı, ama ortada çarpışmış iki araç (kazanın önüne ve arkasına reflektör). (ulasim-trafik-kazasi adım 2 için.)',
  // trafik kazası
  'ulasim-kaza-dortlu': 'Yandan görünüş: yol kenarında, kaza yapmış iki aracın gerisinde duran bir araç; dörtlüleri yanıp sönüyor (sarı ışık çizgileri). Sürücü reflektörlü yelek giymiş, inmeye hazırlanıyor.',
  'ulasim-kaza-oynatma-yasak': 'İki kare: solda yelekli yardımcı yerde yatan yaralıyı kollarından sürüklüyor (kırmızı ✗); sağda aynı yardımcı yaralının yanında diz çökmüş, onu yerinden oynatmadan konuşuyor (yeşil ✓).',
  'ulasim-kask-cikarma': 'Yandan görünüş: yerde sırtüstü yatan kasklı motosikletli; yelekli yardımcı başucunda diz çökmüş, kaskı çıkarmadan iki eliyle iki yandan tutup baş ve boynu düz sabitliyor.',
  // karda mahsur
  'ulasim-kar-aracta-kal': 'Yandan görünüş: tipide yarısı kara gömülmüş araç; içinde battaniyeye sarılı iki kişi. Araçtan uzaklaşan, kar içinde yürüyen silüete kırmızı yasak işareti.',
  'ulasim-kar-egzoz-temizle': 'Arkadan yakın plan: bir kişi küçük kürekle aracın egzoz borusunun çevresindeki karı temizliyor; egzoz deliği açıkça görünüyor. Egzoza turuncu ok.',
  'ulasim-kar-motor-10dk': 'İçeriden görünüş: sürücü kontak anahtarını çeviriyor; ön panelde kalorifer ışığı, rüzgâr almayan yan cam hafifçe aralık (aralıkta küçük hava okları). Köşede saat simgesi ve "10 dk / saat".',
  'ulasim-kar-anten-bez': 'Yandan görünüş: karla kaplı aracın ANTENİNE bağlanmış, rüzgârda dalgalanan parlak turuncu ya da kırmızı bez (tavanda ayrı bir sopa yok); araç içinde iç lamba yanıyor.',
  // suya düşen araç
  'ulasim-su-zaman': 'Yandan görünüş: göl yüzeyinde burnu suya gömülmeye başlamış araç, su yan camların altında; köşede kum saati simgesi ve "< 1 dk".',
  'ulasim-su-kemer': 'Araç içi yakın plan: sürücünün eli emniyet kemeri tokasına basıyor, kemer gevşiyor; camın dışında su seviyesi. Tokaya turuncu ok.',
  'ulasim-su-cam-ac': 'Araç içi yakın plan: sürücünün parmağı kapıdaki elektrikli cam düğmesine basıyor; yan cam aşağı iniyor, dışarıda su yüzeyi camın biraz altında. Aşağı doğru turuncu ok.',
  'ulasim-su-cam-kir': 'Araç içi yakın plan: el, sivri uçlu cam kırıcıyla yan camın alt köşesine vuruyor; camda çatlak çizgileri. Ön camda kırmızı yasak işareti.',
  'ulasim-su-cocuk': 'Araç içi görünüş: yetişkin arka koltuğa uzanmış, büyük çocuğun kemerini çözüp onu açık yan cama doğru yönlendiriyor; küçük çocuk yanında bekliyor. Cama doğru turuncu ok, yanda "1" ve "2" sıra numaraları.',
  'ulasim-su-cik': 'Yandan görünüş: neredeyse batmış aracın su üstündeki tavanında anne ve iki çocuk; anne küçük çocuğu tutuyor; sağda kıyı, kıyıya doğru turuncu ok.',
  // arıza ve akü
  'ulasim-ariza-sag-cek': 'Yukarıdan görünüş: otoyolda araç sağ şeritten emniyet şeridine geçiyor, dörtlüleri yanıyor. Emniyet şeridine doğru kıvrılan turuncu ok.',
  'ulasim-ariza-yelek-in': 'Yandan görünüş: emniyet şeridinde duran araçtan reflektörlü sarı yelek giymiş sürücü yol tarafından değil, sağ (bariyer tarafı) kapıdan iniyor. Sol kapıda kırmızı yasak işareti.',
  'ulasim-ariza-bariyer': 'Önden görünüş: otoyol bariyerinin arkasında, çimenlikte duran yelekli aile; arkada emniyet şeridinde dörtlüleri yanan araç. Aileye yeşil onay işareti.',
  'ulasim-aku-kirmizi': 'Yukarıdan yakın plan: kaputları açık iki aracın aküleri yan yana; el kırmızı maşayı dolu akünün "+" kutbuna takıyor, kırmızı kablonun diğer ucu boş akünün "+" kutbunda. Sıra için "1" ve "2" numaraları ve turuncu oklar.',
  'ulasim-aku-siyah': 'Yukarıdan yakın plan: el siyah maşayı dolu akünün "−" kutbuna takıyor ("3"); siyah kablonun diğer ucu boş aracın motor bloğundaki boyasız metal civataya takılı ("4"). Boş akünün "−" kutbunda kırmızı yasak işareti.',
  // tahliye
  'ulasim-tahliye-tabela': 'Önden görünüş, sürücü bakışı: yol kenarında yeşil zeminli "tahliye yolu" ok tabelası ve yönlendiren yelekli görevli; ana yoldan ayrılan dar toprak kestirme yola kırmızı yasak işareti.',
  'ulasim-su-yola-girme': 'Yandan görünüş: araç, akan kahverengi suyla kaplı yolun önünde durmuş; suyun derinliğini gösteren ölçü çizgisi ve "30 cm" etiketi; suya giren araç silüetine kırmızı yasak işareti, geri dönüş için turuncu U ok.',
  'ulasim-kablo-uzak': 'Önden görünüş, sürücü bakışı: yola devrilmiş elektrik direği ve yerde kıvrılmış kopuk kablo (kıvılcım simgesi); kablonun üstüne kırmızı yasak işareti, aracın geri döndüğünü gösteren turuncu ok.',
  'ulasim-tahliye-yol-ac': 'Yukarıdan görünüş: yoğun tahliye trafiğinde araçlar sağa yanaşmış, boş bırakılan emniyet şeridinden ışıkları yanan ambulans geçiyor. Ambulansın yolunda turuncu ok.',
  // tünel ve köprü
  'ulasim-tunel-mesafe': 'Yandan görünüş: aydınlatmalı tünel içinde duran iki araç; aralarında ölçü çizgisi ve "5 m" etiketi, arkadaki aracın dörtlüleri yanıyor.',
  'ulasim-tunel-u-donus-yasak': 'Yukarıdan görünüş: tünel içinde ileride duman; tünelde U dönüşü yapan ve geri giden araç oklarına kırmızı yasak işaretleri, sağa çekmiş araca yeşil onay.',
  'ulasim-tunel-acil-cikis': 'Yandan görünüş: tünel duvarında yeşil yanan "acil çıkış" kapısı ve koşan insan simgesi; elinde eşya olmayan iki kişi dumandan uzaklaşıp kapıya yürüyor; arkada sağa çekilmiş, anahtarı üstünde araçlar ve uzakta duman. Kapıya turuncu ok.',
  'ulasim-kaza-battaniye': 'Yandan görünüş: trafik kazası rehberinin yelekli yardımcısı, sırtüstü yatan yaralının yanında diz çökmüş, onunla konuşuyor; yaralı boynuna kadar kırmızı battaniyeyle örtülü. (ulasim-trafik-kazasi adım 9 için; lie-cover-blanket yerine.)',
  'ulasim-tunel-deprem': 'Tünel içi: duran aracın yanında, yerde yan yatmış kişi (karşıdan), dizleri karnına çekili, iki eliyle başını ve ensesini örtmüş; sarsıntı çizgileri. (ulasim-tunel-kopru adım 10 için.)',
  'ulasim-kopru-deprem': 'Yandan görünüş: köprü üstünde durmuş araç, kapısı açık, kontakta anahtar görünür (ayrıntı balonu); sürücü yürüyerek köprünün ucundaki açık alana gidiyor. Yürüme yönünde turuncu ok, köprüde hafif sarsıntı çizgileri.',
};
