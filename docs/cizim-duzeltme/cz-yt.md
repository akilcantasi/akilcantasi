# Çizim düzeltme — cz-yt (yangın + tesisat)

Dosyalar: `src/art/scenes/yangin.tsx`, `src/art/scenes/tesisat.tsx`; spec: `src/art/spec/yangin.ts`, `src/art/spec/tesisat.ts`; art dizileri: `src/content/guides/yangin.ts`, `src/content/guides/tesisat.ts`.
Oyuncular sahne dosyalarının başında `const` olarak tanımlı (YNG, ORM, SND, YAG, ELK, ARC, BNA, DMN, GYS, PLN / GAZ, KES, BORU, JEN, GNS, TUP). Hiçbir çizim null yapılmadı (mevcut null'lar zaten doğru yerdeydi).

## Yangın
- **yangin** (YNG: kadın, at kuyruğu, mavi üst, ten 1): emekle, kapı-dokun, kapı-kapat, oda-havlu, dur-yat-yuvarlan aynı kadına çevrildi (önce adam/kadın/koyu tenli adam karışıktı). `yangin-oda-havlu` yeniden çizildi: başının üstünde havada duran telefon kaldırıldı, iki el havluyu kapı altına bastırıyor. Sahne fabrikaya (`odaHavlu`, `kapiDokun`) çevrildi.
- **orman-yangini** (ORM: adam, siyah saç, ten 2, mavi): `yokus` yeniden çizildi (iki farklı kişi yerine: aynı kişi düzlükte uzaklaşıyor, yokuş yukarı kırmızı ok + ✗). `tahliye`: başörtülü kadın+çocuk yerine aynı kişi sırt çantasıyla. `arac` yeniden çizildi: anlamsız kırmızı kubbe yerine büyük kesitte tabana eğilmiş, battaniyeyle örtülü kişi (yüzü/kolu görünüyor). Rüzgâr haritasındaki kişinin saçı eşitlendi.
- **yangin-sondurucu** (SND: kadın, topuz, camgöbeği, ten 1): DOĞRULT'taki adam ve SÜPÜR'deki koyu tenli kadın aynı kişiye çevrildi; SIK yakın planındaki el tenı eşitlendi; gülümseme → neutral. Etiket "2–3 m" → "2 m" (metin "yaklaşık 2 metre").
- **yangin-yag** (YAG: bıyıklı adam, camgöbeği, ten 2): su-yasak'taki mor adam ve kapak'taki kadın aynı kişiye çevrildi; ocak düğmesi elinin teni eşitlendi; gülümsemeler kaldırıldı. Yeni metinle çelişki yok (çizimde sırılsıklam bez yok; battaniye sahnesi yangın battaniyesi).
- **yangin-elektrik** (ELK: kadın, uzun saç, hardal): söndürücülü adam → aynı kadın. Ortak `power-off` yerine kendi `yangin-elektrik-salter` (hardal kol).
- **yangin-arac** (ARC: mor üstlü sürücü + çocuk): uzaklaş sahnesindeki 4 farklı kişi → sürücü + çocuk. `kaput-yasak` yeniden çizildi: belirsiz el yerine el kaputu ön kenarından kaldırıyor, aralıktan alev, kırmızı yasak. Yeni 7. adım (kapağı açmadan aralıktan sıkma) çizimsiz; yasak sahnesi yalnız "kaputu kaldırıp açma"yı gösterir, çelişmez.
- **yangin-yuksek-bina** (BNA: adam, kahverengi saç, ten 0, mavi): merdivendeki iki yabancı → aynı adam (tek kişi); pencere işaretindeki kadın → aynı adam. Kapı-dokun ve oda-havlu için rehbere özel `yangin-bina-kapi-dokun`, `yangin-bina-oda-havlu` eklendi.
- **yangin-duman-solunmasi** (DMN: yaralı adam mavi / yardımcı kadın topuz camgöbeği): `temiz-hava` yeniden çizildi (birbirine dolanmış iki gövde yerine: yardımcı elini sırtına koyup yönlendiriyor, yaralı öksürüyor). Ortak `cpr-adult`/`recovery-position` yerine aynı oyuncularla `yangin-duman-kpr` (kollar düz, eller göğüs ortası) ve `yangin-duman-derlenme`. Oturt sahnesi büyütüldü, gülümseme kaldırıldı.
- **yangin-giysi-tutustu** (GYS: kadın, uzun kahverengi saç, mavi): YAT'taki koyu tenli kadın ve YUVARLAN'daki adam (ortak 3 kareli sahne) aynı kadına çevrildi; YUVARLAN için tek büyük sahne `yangin-giysi-yuvarlan`. Battaniye sahnesinde yardım eden aynı kadın (başkasına yardım), yaralı ayrı adam; dört ayak duruşu düzeltildi, büyütüldü.
- **yangin-kacis-plani** (PLN: bıyıklı baba, mor): dedektör elinin kolu babanın moru oldu; battaniye kılıfının altındaki "bacak" gibi görünen şeritler kaldırıldı.

## Tesisat
- **tesisat-gaz-kacagi** (GAZ: kadın, at kuyruğu, mor): 187'yi arayan adam → aynı kadın; çakmaklı el teni eşitlendi; ortak `gas-valve-off` (camgöbeği kol) yerine `tesisat-gaz-vana` (mor kol).
- **tesisat-elektrik-kesintisi** ve **tesisat-hasarli-elektrik** (KES: başörtülü kadın, kiremit üst, mavi-yeşil başörtü — iki rehberde aynı ev sahibi, 186 ve düşen tel sahneleri ortak): `fener-mum` yeniden çizildi (3 kişilik aile → ev sahibi masada, lamba). Fiş çekme, 186, ıslak cihaz elleri kiremit kola çevrildi; ortak `su-gida-buzdolabi-kapali` yerine `tesisat-buzdolabi-kapali`; ıslak zemindeki adam ve elektrikçi yanındaki kadın → ev sahibi; ortak `power-off` → `tesisat-hasarli-salter`.
- **tesisat-jenerator**: `yakit-soguk` yeniden çizildi (metin "bekleyin" derken sahnede yakıt dökülüyordu): jeneratör kapalı ve sıcak, kişi bidonu yere koymuş bekliyor, saat simgesi.
- **tesisat-boru-patlamasi** (BORU: kadın, topuz, camgöbeği, ten 1): musluk elindeki mavi kol/koyu ten ve kova sahnesindeki ten eşitlendi; `power-off` → `tesisat-boru-salter`. `tesisat-su-vanasi-kapat` su-gida rehberinde de kullanıldığı için değiştirilmedi (zaten camgöbeği/ten 1).
- **tesisat-gunes-powerbank** (GNS: kadın, at kuyruğu, ten 2): tasarruf modu elinin kolu/teni eşitlendi.
- **tesisat-tup-guvenligi** (TUP: adam, kahverengi saç, camgöbeği): sabunlu su elinin teni eşitlendi; bayideki yaşlı kadın → aynı adam; bayi görevlisinin üstü hardal yapıldı (karışmasın).
- **tesisat-arabada-sarj**: kişi yok, değişiklik gerekmedi.

## Kalan şüpheler
- `call-112`, `battery-radio`, `barinma-co-alarm` ortak sahneler; 112 elinin teni/kolu rehber oyuncusuna bağlı değil (kolsuz el, nötr).
- `yangin-kapi-dokun`: el profilden çizili; "elin tersi" olduğu tırnak ve turuncu temas çizgisiyle anlatılıyor ama küçük boyda avuç gibi de okunabilir.
- `yangin-dur-yat-yuvarlan` (yangin rehberi 9. adım) 3 kareli; figürler küçük ama adım üç eylemi birden anlatıyor.
- Yatan figürlü sahnelerde (giysi-yat, yuvarlan, yanmış alan) kişi doğal olarak yüksekliğin %60'ından az yer kaplıyor.
