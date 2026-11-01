# Bağımsız doğrulama: tesisat-aa

Tarih: 2026-11-01. Dosya: src/content/guides/tesisat.ts. Rehberler: tesisat-gaz-kacagi, tesisat-elektrik-kesintisi, tesisat-jenerator, tesisat-boru-patlamasi, tesisat-arabada-sarj, tesisat-gunes-powerbank, tesisat-tup-guvenligi, tesisat-hasarli-elektrik.

WebSearch kotası dolu olduğu için yalnızca WebFetch kullanıldı.
Erişilebilen kaynaklar: Amerikan Kızılhaçı (Power outage, Safe generator use, Flood, Earthquake, Frozen pipes), CDC (CO About, Protect Yourself During a Power Outage, Electrical Hazards After a Disaster), NWS Flood After, NHS CO zehirlenmesi, Ready.gov Build a Kit, Calor Gas (Emergency, Storing, Connecting, BBQ safety), Wikipedia (LPG, Lead–acid battery), Enerya (187 sayfaları), SEDAŞ ve UEDAŞ ana sayfaları (186), İSU ve SASKİ ana sayfaları (ALO 185), ASKİ ana sayfası (153).
Erişilemeyenler: İGDAŞ, Başkentgaz, İzmirgaz, Aksa, BEDAŞ, İSKİ, İZSU (robots); BTK, turkiye.gov.tr acil numaralar (404); CPSC, Ready.gov power-outages, PHMSA, NFPA, HSE, National Gas, SoCalGas, ESFI, USFA, FDNY, LFB, Electrical Safety First (istemci hatası).

## Türkiye numaraları (185 / 186 / 187)
- 187 Doğal Gaz Acil: Enerya sayfası "7/24 hizmet veren Doğal Gaz Acil 187", konutta, bina içinde/merdivende, sokakta gaz kokusu, yangın-patlama, baca gazı CO zehirlenmesi için aranacağını yazıyor. Doğrulandı. İGDAŞ sayfası erişilemedi.
- 186 elektrik arıza: SEDAŞ "Arıza İhbarı 186", UEDAŞ "186 Müşteri İletişim Merkezi". Doğrulandı. Not: SEDAŞ 186'nın ücretsiz olmadığını (yurt içi dakika ücreti) yazıyor; rehberde ücret iddiası yok.
- 185 su arıza: İSU (Kocaeli) ve SASKİ (Samsun) "ALO 185" hattını gösteriyor. Ancak ASKİ (Ankara) ana sayfası çağrı merkezi olarak yalnızca 153'ü gösteriyor; 185'in her ilde çalıştığı doğrulanamadı. Bu nedenle boru rehberine 153 yedeği eklendi (aşağıda).
- 112: Türkiye'nin tek acil numarası (bilinen; bu oturumda ayrıca belge açılamadı).

## tesisat-gaz-kacagi
Doğrulanan: düğme, kibrit, çakmak, cihaz kullanmama; düğme kıvılcımı patlatabilir; şüphede evden çık ve güvenli yerden ara (Kızılhaç Earthquake); cep telefonu, düğme, açık ateş kullanmama, vanayı kapatma, kapı-pencereyi açıp havalandırma (Calor Emergency); 187'nin konutta gaz kokusunda aranacağı (Enerya). Sıra (ateş/kıvılcım yok → havalandır → vana → çık → dışarıdan ara) kaynaklarla uyumlu.
Değişiklik: yalnızca kaynaklar ve checked.
Doğrulanamadı: "komşuyu zile basmadan kapıya vurarak uyarın" ve "asansör kullanmayın" (mantıklı, kıvılcım ilkesiyle uyumlu; doğrudan kaynak açılamadı).
Resimler: sorun yok.

## tesisat-elektrik-kesintisi
Doğrulanan (Kızılhaç Power outage): fener kullan, mum yakma; cihazların fişini çek (dalgalanma); kapalı buzdolabı ~4 saat, dolu dondurucu ~48 saat; tıbbi cihaz varsa tahliye; jeneratör, kamp ocağı, mangal dışarıda; düşen telden 35 ft (≈10,7 m; rehberde 12 m, güvenli tarafta) uzak dur ve acil numarayı ara; gaz ocağıyla ısınmama (Kızılhaç, CDC). 186 doğrulandı.
Değişiklik: kaynaklarda "USDA FSIS" (açılmadı) yerine CDC Power Outage, "Enerji dağıtım şirketleri" yerine SEDAŞ/UEDAŞ yazıldı; checked güncellendi.
Doğrulanamadı: "bir lambayı açık bırakın" (eski Kızılhaç önerisi, güncel sayfada yok; zararsız, bırakıldı).
Resimler: sorun yok. Küçük not: tesisat-dusen-tel (adım 10) 12 m okunu kırmızı dairenin kenarından başlatıyor; tel ucundan ölçülmüş gibi çizilmesi daha doğru olur (kritik değil).

## tesisat-jenerator
Doğrulanan: ev, garaj, bodrum, kısmen kapalı alan yasağı; açık kapı/pencere yetmez (Kızılhaç, CDC); kapı, pencere, havalandırmadan 20 ft'ten fazla (≈6 m) (CDC); pilli CO dedektörü (CDC); alarm öterse temiz havaya çık ve yardım çağır, baş dönmesi/halsizlikte hemen temiz hava (Kızılhaç); kuru zemin, açık tente, yağmurda kullanmama, ıslak elle dokunmama, doğrudan takma ya da dış mekân tipi sağlam topraklı kablo, prize bağlamama (backfeed), kapatıp soğumasını bekleyip yakıt ekleme, onaylı bidonda yaşam alanı dışında saklama (Kızılhaç Safe generator use). Belirtiler CDC/NHS ile uyumlu.
Değişiklik: CPSC (açılmadı) kaynağı CDC CO About ile değiştirildi; checked güncellendi.
Doğrulanamadı: "hat üzerinde çalışan teknisyenleri çarpabilir" ayrıntısı bu oturumda açılan sayfalarda yok (CPSC'de var olduğu biliniyor; doğru, bırakıldı).
Resimler:
- Adım 3, art "barinma-co-alarm": CO alarmı bir direğe/boruya takılı, altında mavi bir yüzey (çadır/yatak?) var; jeneratör bağlamında anlaşılması zor. Yanıltıcı değil. İstenen: ev içinde duvara/tavana takılı, öten pilli CO alarmı, arka planda pencere dışında jeneratör.

## tesisat-boru-patlamasi
Doğrulanan: suya girerek şaltere gitmeme, elektrikçi çağırma, ıslak zeminde elektriğe dokunmama (CDC Electrical Hazards); boruları yalıtma ve donmuş boruyu pürmüz/açık ateşle çözmeme (Kızılhaç Frozen pipes); 185 (İSU, SASKİ).
Değişiklik: Adım 6 "...185'i (su arıza) arayın." → "...185'i (su arıza) arayın; açılmazsa belediyenin 153 hattını arayın." (ASKİ'nin sitede yalnızca 153'ü göstermesi nedeniyle). Kaynaklar ve checked güncellendi.
Doğrulanamadı: ana vananın sayaç yanında olması, kolu boruya dik çevirince kapanması, saat yönünde kapatma, soğuk musluklarla boşaltma, sıcak su borusunda kombi/termosifonu kapatma (genel tesisat bilgisi, doğru görünüyor; açılabilen yetkili kaynak yok). Adım 2'de 186'nın ev içi şalter için değil dağıtım hattı için olduğu; dağıtım şirketi binaya gelen elektriği kesebilir ama yanıt süresi belirsiz, tesisatçı/elektrikçi de önerilebilir (uzman görüşü).
Resimler: sorun yok.

## tesisat-arabada-sarj
Doğrulanan: bitişik garajda kapı açık olsa bile motor çalıştırmama, kısmen kapalı alanda motor çalışır bırakmama (CDC); depoyu en az yarı dolu tutma (Kızılhaç); kurşun-asit akünün hidrojen çıkardığı, kıvılcımla patlayabileceği (Wikipedia Lead–acid battery).
Değişiklik: CPSC kaynağı CDC ile değiştirildi, Wikipedia eklendi; checked güncellendi.
Doğrulanamadı: egzozun karla tıkanması ve "camı biraz aralık tutun" (NWS kış fırtınası önerisi olarak bilinir, sayfa açılmadı); kırmızı maşa +, siyah maşa − (standart renk kodu, doğru); motor kapalıyken uzun şarjın aküyü bitirmesi (genel bilgi).
Resimler: sorun yok (adım 6'da kırmızı +, siyah − doğru).

## tesisat-gunes-powerbank
Doğrulanan: şarj cihazı ve yedek pil bulundurma (Ready.gov Kit).
Değişiklik: checked güncellendi.
Doğrulanamadı: lityum pil uyarıları (yatakta şarj etmeme, sıcakta bırakmama, şişen powerbankı kullanmama/delmeme) ve panel yönlendirme. CPSC, USFA, NFPA, FDNY, LFB, Electrical Safety First sayfalarının hiçbiri açılmadı. İçerik bu kurumların bilinen önerileriyle uyumlu; bir itfaiye/pil güvenliği uzmanı bakmalı. Adım 2'deki uçak modu önerisi acil durum uyarılarını (ör. deprem/afet SMS) kaçırma riski taşır; "belirli saatlerde açın" ifadesi bunu kısmen dengeliyor, uzman görüşü önerilir.
Resimler:
- Adım 4, art "tesisat-panel-powerbank": powerbank ve telefon güneş altında panelin yanında duruyor; adım 5 "powerbank ve telefon gölgede kalsın" diyor. Hayati değil ama çelişkili. İstenen: panel güneşte, kablo gölgedeki powerbanka uzanıyor, telefon da gölgede.
- Adım 7, art "tesisat-siskin-powerbank": şişmiş ve ısınmış powerbank çıplak elle tutuluyor. Küçük not; istenirse kablodan çekip ya da eldivenle/maşayla taşıyan el çizilebilir.

## tesisat-tup-guvenligi
Doğrulanan: tüpü her zaman dik saklama ve kullanma, yatırmama; zemin seviyesinin altında saklamama/kullanmama; havadar yer; ısı ve ateş kaynağından uzak (Calor Storing); kaçakta tüp vanasını kapatma, düğme/telefon/ateş kullanmama, özellikle alt seviyeleri havalandırma (Calor Emergency); hortumda sertleşme, çatlak kontrolü, kaçak belirtileri (Calor BBQ); LPG havadan ağır, bodrum gibi alçak yerlerde birikir (Wikipedia LPG); çadırda fener/kamp ocağı kullanmama (CDC).
Değişiklik: Calor ve CDC kaynakları eklendi; checked güncellendi.
Doğrulanamadı: sabunlu su testi (erişilen Calor sayfalarında yok; yaygın ve doğru uygulama); merdiven altı yasağı (Calor'da adıyla yok; kapalı/havasız alan ilkesiyle uyumlu). LPG kaçağında Türkiye'de 187'nin değil 112/itfaiyenin aranması doğru görünüyor (187 doğalgaz dağıtım şirketlerinin hattı); resmi teyit açılamadı.
Resimler: sorun yok.

## tesisat-hasarli-elektrik
Doğrulanan (CDC Electrical Hazards): ıslak ekipman ya da su varsa ana şalteri/sigortayı kapatma; şaltere ulaşmak için suya girmeme, elektrikçiye kapattırma; suda dururken elektriği açıp kapatmama; elektrikçi denetlemeden elektriği açmama; cihazlar tam kurumadan kullanmama; düşen tele dokunmama ve bildirme. NWS Flood After: girmeden önce elektriğin kapalı olduğundan emin olma, kabloları yetkili elektrikçiye tamir ettirme. Kızılhaç: 35 ft, fener, ıslak ekipmana dokunmama.
Değişiklik: CDC ve NWS kaynakları eklendi; checked güncellendi.
Not: CDC kıvılcım ya da yanık kokusunda (güvenliyse) ana şalterin de kapatılmasını öneriyor; rehberin adım 4'ü "dışarı çıkın" diyor. Güvenli tarafta, değiştirilmedi; uzman isterse "kuru ve güvenliyse önce ana şalteri indirin" eklenebilir.
Resimler: sorun yok (adım 5 için yukarıdaki tesisat-dusen-tel küçük notu geçerli).

## Özet
8 rehber incelendi. Metin değişikliği: 1 (boru patlaması adım 6, 153 yedeği). Diğer değişiklikler: 8 rehberde kaynak ve checked güncellemesi. Hayati hata bulunmadı. Null yapılan resim yok.
