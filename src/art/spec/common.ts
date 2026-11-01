// Ortak sahneler: birden çok rehberde kullanılan, kategoriye ait olmayan çizimler.
// Rehber yazarları bu kimlikleri doğrudan kullanabilir. Yeni ortak sahne
// gerekirse kendi kategori önekiyle (ör. 'hayatta-kalma-...') tanımlanır.
export const SPEC: Record<string, string> = {
  'call-112': 'Yakın plan: bir el telefonu tutuyor, ekranda büyük "112" ve arama simgesi; telefondan çıkan ses dalgaları. Arka planda bulanık, sakin bir ortam.',
  'call-114': 'Yakın plan: el telefonu tutuyor, ekranda "114" (Ulusal Zehir Danışma Merkezi); telefonun yanında etiketli küçük bir ilaç/kimyasal şişesi.',
  'sms-send': 'Yakın plan: iki başparmak telefonda kısa mesaj yazıyor; ekranda mesaj balonu ve "gönder" oku.',
  'cpr-adult': 'Yandan görünüş: yerde sırtüstü yatan yetişkin. Kurtarıcı kişinin göğsünün hemen yanında, göğüs hizasında dizlerinin üstüne çökmüş (kalça hizasında değil, dizleri kişinin üstünde değil). Kolları dirseklerden kilitli, dümdüz ve dik; omuzları ellerinin tam dikey üstünde (omuzdan ellere ince kesikli dikey çizgi). Üst üste konmuş, parmakları kenetli elleri göğsün ortasında, göğüs kemiğinin alt yarısında. Göğüste aşağı doğru turuncu ok, köşede "100–120/dk".',
  'recovery-position': 'Derlenme (koma) pozisyonu son hali, yandan: kişi yan yatmış. Üstteki bacak kalçadan ve dizden yaklaşık dik açıyla bükülmüş, dizi önde yere dayanmış, alttaki bacak düz. Üstteki elin sırtı yanağın altında; alttaki kol öne doğru, dirsekten bükülü yerde. Baş hafif geride (hava yolu açık), ağız yere dönük. Nefes aldığını gösteren küçük nefes çizgileri. Yetişkin figür, üstü örtüsüz.',
  'lie-cover-blanket': 'Yerde sırtüstü yatan, bilinci açık yaralı (gözleri açık, endişeli), boynuna kadar gümüş folyo battaniyeyle örtülü; yardımcı onun uzak yanında göğüs hizasında diz çökmüş, eli omzunda, yüzüne dönük konuşuyor. Yer/bağlam detayı yok (sade iç mekân).',
  'watch-breathing': 'Yandan görünüş: kişi derlenme pozisyonunda yan yatıyor (üst bacak dizden bükülü, üst el yanağın altında); üstü boynuna kadar battaniyeyle örtülü, yüzü açık. Yardımcı başının yanında diz çökmüş, kişinin yüzüne ve göğsüne bakarak nefesini izliyor; göğüs üstünde küçük inip kalkma okları. Saat ya da "10 sn" simgesi yok (sürekli izleme).',
  'cover-mouth-cloth': 'Yakın plan yüz (3/4 profil): kişi bir eliyle tuttuğu ıslak bezi ağzına ve burnuna birlikte kapatıyor; bezden su damlaları. Yüzde cerrahi maske ya da başka maske yok, boynunda bez yok. Arkada hafif duman/toz.',
  'wash-hands': 'Yakın plan: sabunla köpüklenmiş iki el akan su altında ovuşturuluyor. Süre rozeti yok (rehberlerin çoğu süre belirtmiyor).',
  'flush-water-15': 'Yakın plan: kolu sıvanmış çıplak ön kol bol akan musluk suyu altında yıkanıyor (su kumaşa değil cilde akıyor); köşede "15 dk" saat simgesi.',
  'cold-compress': 'Yakın plan: beze sarılı buz torbası (buz doğrudan değmiyor) bileğe/kola tutuluyor; köşede "20 dk".',
  'remove-rings': 'Yakın plan: el; parmaktan yüzük ve bilekten saat çıkarılıyor (dışa oklar), parmaklar hafif şiş.',
  'whistle-signal': 'Yakın plan yüz ve düdük, nötr düz arka plan (gökyüzü, manzara ya da enkaz yok; her ortama uysun): kişi düdüğü dudaklarıyla tutup üflüyor; düdükten aralıklı, kısa ses dalgaları çıkıyor. Köşede rozet "6× / 1 dk" ve yanında dönen "tekrar" oku. Rozette "3×" ya da başka sayı yok.',
  'battery-radio': 'Masada pilli/el dinamolu radyo, anteni açık, yayın dalgaları; yanında yedek piller.',
  'boil-water': 'Ocakta/kamp ateşinde tencerede fokur fokur kaynayan su (kabarcıklar ve buhar), köşede "1 dk".',
  'stay-calm-talk': 'Endişeli kişi sandalyede oturuyor; yardımcı önünde diz çökmüş, göz hizasında, eli kişinin elinin/kolunun üstünde, sakin konuşuyor (konuşma balonunda yalnızca dalga).',
  'go-assembly-area': 'Aile (yetişkin, çocuk) sırt çantalarıyla yürüyor; ileride yeşil "toplanma alanı" tabelası (yeşil zemin, beyaz insan grubu simgesi).',
  'no-elevator': 'Asansör kapısı kırmızı yasak işaretiyle; yanında merdivenden inen kişi.',
  'gas-valve-off': 'Yakın plan: el sarı kollu doğalgaz vanasını boruya dik konuma çeviriyor (kapalı), döndürme oku.',
  'power-off': 'Yakın plan: el sigorta kutusunda ana şalteri aşağı indiriyor.',
  'first-aid-kit': 'Açık ilk yardım çantası: sargı bezi, flaster, eldiven, makas, folyo battaniye düzenli şekilde.',
  'hospital-go': 'Endişeli kişi, kolundan tutan bir yakınıyla sağlık çadırına (kırmızı hilal işaretli) yürüyor; yön oku.',
};
