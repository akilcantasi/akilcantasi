// Yangın kategorisinin çizimleri. Üslup: ayrıntılı düz renkli çizim (Kızılay/AFAD broşürü gibi), 4:3.
export const SPEC: Record<string, string> = {
  // yangin
  'yangin-emekle': 'Yandan görünüş: koridorun üst yarısı koyu gri dumanla dolu; kişi elleri ve dizleri üzerinde emekleyerek ilerliyor, başı duman katmanının altında. Yere yakın temiz hava şeridi açık renkli, ilerleme yönünde turuncu ok.',
  'yangin-kapi-dokun': 'Yakın plan, kişinin arkasından ve hafif yandan: kişi elinin SIRTINI (eklem ve tırnak tarafı) kapalı kapıya değdiriyor; avuç içi kişiye dönük, avuç çizgileri görünmüyor. Kapı altından ince duman sızıyor. Elin yanında küçük termometre simgesi.',
  'yangin-kapi-kapat': 'Yandan görünüş: kişi odadan çıkarken kapıyı arkasından kapatıyor; odanın içinde alev ve duman, koridor temiz. Kapanma yönünde turuncu kavisli ok.',
  'yangin-oda-havlu': 'Oda içi, yandan: kişi kapalı kapının önünde diz çökmüş, iki eliyle ıslak havluyu kapı altındaki aralığa bastırıyor (havludan damlalar); arkada kapalı pencere. Elde telefon yok.',
  'yangin-dur-yat-yuvarlan': 'yangin-giysi-yuvarlan ile aynı tek büyük sahne, yangin rehberinin kişisiyle: yerde yan dönmüş kişi iki eliyle yüzünü kapatmış, gövdesinin çevresinde kavisli dönme oku, giysisinde küçülmüş alev.',
  // orman-yangini
  'yangin-orman-ruzgar': 'Yukarıdan harita görünüşü: ormanda ilerleyen alev cephesi ve rüzgâr okları; kişi rüzgârın tersine ve yangının yanına doğru kaçıyor (yeşil ok), yangının önüne doğru giden yol kırmızı yasakla.',
  'yangin-orman-yokus': 'Yandan yamaç kesiti: alevler yokuş yukarı tırmanıyor; yokuş yukarı kırmızı ok ve ✗ (kişi yok). Aynı kişi düz zeminde yamaçtan uzağa koşuyor, yeşil ok ve onay.',
  'yangin-orman-tahliye': 'Köy yolu: sırt çantalı kişi görevlinin gösterdiği yöne yürüyor; jandarma aracı ve görevli eliyle tahliye yönünü gösteriyor. Duman ve alev yalnızca uzak tepede.',
  'yangin-orman-arac': 'Araç kesiti (kapı kaldırılmış gibi; direksiyon sağda, aracın önü sağda): kişi ön koltuğun önünde tabana eğilmiş, sırtı ve başının üstü battaniyeyle örtülü, camlar kapalı; dışarıda duman ve alevler.',
  'yangin-orman-yanmis-alan': 'Yandan görünüş: siyah, zaten yanmış çıplak toprak alanda kişi yüzüstü yatmış, kollarıyla yüzünü örtüyor; uzakta yeşil bitki örtüsü ve yaklaşan duman.',
  // yangin-sondurucu
  'yangin-tup-cikis-arkada': 'Mutfak, yandan: kişi elinde kırmızı söndürücüyle küçük bir çöp kovası yangınına bakıyor; arkasında açık kapı ve yeşil "çıkış" oku. Kişiyle ateş arasında "2 m" etiketi.',
  'yangin-tup-pim': 'Yakın plan: iki el kırmızı söndürücünün tepesindeki emniyet pimini çekip çıkarıyor (dışa turuncu ok); hortum öne doğru tutulmuş. Köşede "ÇEK".',
  'yangin-tup-dogrult': 'Yandan görünüş: kişi hortumu alevlerin dibine, yanan cismin tabanına doğrultuyor; hortumdan tabana giden kesikli turuncu nişan çizgisi. Alev tepesine giden çizgi kırmızı yasakla. Köşede "DOĞRULT".',
  'yangin-tup-sik': 'Yakın plan: el söndürücünün tetik kolunu sıkıyor (aşağı turuncu ok), hortumdan beyaz toz bulutu çıkıyor. Köşede "SIK".',
  'yangin-tup-supur': 'Önden-yandan görünüş: kişi hortumu ateşin tabanında sağa sola süpürür gibi hareket ettiriyor; yay biçiminde çift yönlü turuncu ok, alevler küçülüyor. Köşede "SÜPÜR".',
  // yangin-yag
  'yangin-yag-su-yasak': 'Mutfak, yandan: alevli tavaya bardakla su dökülüyor ve alev büyük bir topa dönüşüp tavana sıçrıyor; sahnenin üstünde büyük kırmızı yasak işareti.',
  'yangin-yag-ocak-kapat': 'Yakın plan: el ocağın düğmesini kapalı konuma çeviriyor (döndürme oku); üstteki tavada alev.',
  'yangin-yag-kapak': 'Yandan görünüş: kişi kolu uzatarak tencere kapağını alevli tavanın üstüne kendinden uzağa doğru kaydırıyor; kayma yönünde turuncu ok, alev kapak altında sönüyor.',
  'yangin-yag-battaniye': 'Önden görünüş: kişi yangın battaniyesini ellerini koruyacak şekilde önünde tutarak alevli tavanın üstüne indiriyor; alevler battaniyenin altında kalıyor, aşağı turuncu ok; duvarda açılmış kırmızı battaniye kılıfı.',
  // yangin-elektrik
  'yangin-elektrik-su-yasak': 'Oda içi: duman çıkan prize ve kabloya bardaktan su dökülüyor, sudan kişiye şimşek simgesi; tüm sahnenin üstünde kırmızı yasak.',
  'yangin-elektrik-salter': 'Yakın plan: sigorta kutusunda el ana şalteri aşağı indiriyor; aşağı turuncu ok. Kol bu rehberin kişisinin (hardal) kolu.',
  'yangin-elektrik-tup': 'Yandan görünüş: sigorta kutusunda şalter aşağıda (küçük çerçeve), kişi ABC tozlu söndürücüyle duman çıkan elektrikli ısıtıcının tabanına sıkıyor; söndürücü etiketinde "ABC".',
  // yangin-arac
  'yangin-arac-kenara-cek': 'Yukarıdan yol görünüşü: kaputundan duman çıkan araba sağ şeride ve emniyet şeridine çekiyor, dörtlüler yanıyor; çekme yönünde turuncu ok.',
  'yangin-arac-in': 'Yandan görünüş: yol kenarında duran, kaputundan duman çıkan arabadan sürücü ve çocuklu yolcu iniyor; sürücü çocuğun elini tutuyor, bagajdaki çanta kırmızı yasakla.',
  'yangin-arac-uzaklas': 'Geniş açı: yol kenarında dumanlı araba; sürücü ve çocuk bariyerin arkasında, araçtan uzakta; araçla insanlar arasında "30 m" etiketli ölçü çizgisi.',
  'yangin-arac-kaput-yasak': 'Yakın plan: el dumanlı arabanın kaputunu ön kenarından kaldırıp açıyor, aralıktan alev görünüyor; üstünde kırmızı yasak işareti.',
  // yangin-yuksek-bina
  'yangin-bina-kapi-kapat': 'Apartman koridoru: kişi dumanlı daireden çıkmış, bir eliyle daire kapısının kolunu tutup kapıyı ARKASINDAN neredeyse tamamen kapatıyor (yalnız kapı aralığından ince duman sızıyor); diğer eliyle koridordaki kırmızı yangın alarm butonuna basıyor. Kapı ardına kadar açık değil.',
  'yangin-bina-kapi-dokun': 'Yakın plan (yangin-kapi-dokun ile aynı): kişi elinin SIRTINI kapalı daire kapısına değdiriyor; kapı altından ince duman, yanında termometre. Kol bu rehberin kişisinin (mavi) kolu.',
  'yangin-bina-oda-havlu': 'Oda içi, yandan (yangin-oda-havlu ile aynı): bu rehberin kişisi kapı önünde diz çökmüş, ıslak havluyu kapı altındaki aralığa bastırıyor.',
  'yangin-bina-merdiven': 'Bölünmüş sahne, yandan: solda dumanla dolu merdiven boşluğu kırmızı yasakla; sağda temiz, aydınlık ikinci merdivenden tırabzanı tutarak inen kişi yeşil onayla.',
  'yangin-bina-pencere-isaret': 'Dışarıdan görünüş: apartmanın üst katında açık pencerede kişi açık renkli bir bezi sallıyor, diğer elinde yanan el feneri. Cam kırık değil.',
  // yangin-duman-solunmasi
  'yangin-duman-temiz-hava': 'Dış mekân: öksüren kişi elini ağzına götürmüş yürüyor; yardımcı arkasından elini sırtına koyup onu dumanlı binadan uzağa, açık havaya yönlendiriyor; yön oku binadan uzağa.',
  'yangin-duman-kpr': 'Dış mekân, yandan: duman soluyan kişi sırtüstü yatıyor; yardımcı yanında diz çökmüş, kollar düz, iki el göğsün ortasında, omuzlar ellerin üstünde; aşağı bastırma oku.',
  'yangin-duman-derlenme': 'Dış mekân: aynı kişi derlenme (koma) pozisyonunda yan yatmış, üstteki el yanağın altında, üstteki diz bükülü; ağzının önünde nefes dalgaları.',
  'yangin-duman-oturt': 'Yandan görünüş: yüzünde is lekeleri olan kişi dışarıda bir basamakta dik oturmuş; yardımcı yakasını gevşetiyor, yanında diz çökmüş ona bakıyor.',
  // yangin-giysi-tutustu
  'yangin-giysi-dur': 'Önden görünüş: kolunda ve pantolonunda alev olan kişi koşmayı bırakıp duruyor; arkasında koşan soluk silüet kırmızı yasakla. Köşede "DUR".',
  'yangin-giysi-yat': 'Yandan görünüş: kişi yere uzanıyor, elleri yüzünü kapatmış; alev giysisinin bir yanında. Aşağı turuncu ok, köşede "YAT".',
  'yangin-giysi-yuvarlan': 'Yandan: kişi yerde yan dönmüş, iki eliyle yüzünü kapatarak yuvarlanıyor; gövdenin çevresinde kavisli dönme okları, alev küçülmüş. Köşede "YUVARLAN".',
  'yangin-giysi-battaniye': 'Yandan görünüş: yardımcı, yerde yatan ve bacağındaki giysisi yanan kişinin üstüne kalın yün battaniyeyi baştan aşağı doğru örtüyor; örtme yönünde turuncu ok.',
  // yangin-kacis-plani
  'yangin-plan-dedektor': 'Yakın plan, aşağıdan: tavandaki yuvarlak duman dedektörünün test düğmesine bir parmak basıyor; dedektörden ses dalgaları ve kırmızı ışık.',
  'yangin-plan-iki-cikis': 'Yukarıdan ev planı: her odadan iki yeşil kesikli ok çıkıyor (biri kapıdan, biri pencereden); dışarıda buluşma noktası yıldızı.',
  'yangin-plan-bulusma': 'Dış mekân: aile evin karşısındaki ağacın yanında toplanmış; baba eliyle tek tek aile bireylerini gösterip sayıyor (yoklama). Elde anlamı belirsiz levha ya da numara yok. Arkada ev. Ağacın üstünde yeşil konum işareti.',
  'yangin-plan-tup-battaniye': 'Mutfak duvarı, önden: kapıya yakın asılı kırmızı yangın battaniyesi kılıfı ve altında askıda küçük ABC tozlu söndürücü; ikisinde yeşil onay.',
};
