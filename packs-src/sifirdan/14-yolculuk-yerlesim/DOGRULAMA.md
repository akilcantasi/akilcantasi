# 14-yolculuk-yerlesim — bağımsız doğrulama

Tarih: 2026-11-02 · 24 rehber · WebSearch 4 kez kullanıldı, geri kalanı WebFetch ile.
Denetim: `npx -y tsx tools/check-sifirdan.ts packs-src/sifirdan/14-yolculuk-yerlesim` → hata yok.

Sayım: TEYİTLİ 4 · DÜZELTİLDİ 10 · ZAYIF KALDI 10 · ÇIKARILDI 0.
("ZAYIF KALDI": yazarın kaynakları bu turda yeniden açılmadı; yasak ve tehlikeli eksik kontrolü yapıldı, kritik sorun bulunmadı.)

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-yy-yuk-hazirlama | TEYİTLİ | REI sayfası açıldı: %20 / günübirlik %10. |
| sf-yy-yuruyus-ayak-mola | ZAYIF KALDI | ATP 3-21.18 bu turda açılmadı (45+15, 50/10, 4 km/sa). |
| sf-yy-yolda-su-yiyecek | ZAYIF KALDI | Sphere ve REI yeniden açılmadı; sayılar makul. |
| sf-yy-grupla-yolculuk | DÜZELTİLDİ | Küçük çocuğun boynuna iple düdük asma → giysiye kısa iple bağlama (boğulma riski). Spec güncellendi. |
| sf-yy-hayvanla-yolculuk | DÜZELTİLDİ | Hawke's Bay tablosu açıldı; köpek 30–50 ml/kg ve kedi ~60 ml/kg ayrıldı, sağmal inek 40–70 l eklendi. |
| sf-yy-yuk-hayvani | DÜZELTİLDİ | 50 kg → semer dahil vücut ağırlığının %20'si (150 kg → 30 kg); 10-bilgi-topluluk ile tutarlı. |
| sf-yy-el-arabasi-yolda | ZAYIF KALDI | SafeWork SA ve CCOHS yeniden açılmadı. |
| sf-yy-yerlesim-yeri | ZAYIF KALDI | UNHCR ve AYM metni yeniden açılmadı; yasal not var. |
| sf-yy-kar-ayakkabisi | ZAYIF KALDI | Kaynaklar zayıf (blog); yasal not var; hayati risk düşük. |
| sf-yy-buz-kalinligi | DÜZELTİLDİ | Özet tutucu sayıya çekildi, beyaz buz için 30/40 cm açık yazıldı, akarsu buzu vurgulandı, note eklendi, ip bağlama netleşti, buz dikeni kılıfı. |
| sf-yy-buza-dusme | DÜZELTİLDİ | Kurtarma iki adıma ayrıldı (seslen, uzan, at, son çare sürünerek; koşmama, sizi çekerse bırakma); hipotermi bakımı genişletildi; note ve kaynaklar eklendi. |
| sf-yy-siper-ayagi | DÜZELTİLDİ | 39–43°C suda 5 dk → oda sıcaklığında pasif ısıtma, suya sokmama. Çizim kimliği değişti. |
| sf-yy-karda-yolculuk | DÜZELTİLDİ | Kar körlüğü belirtileri, kontakt lens, 2 gün kuralı (note), gözlük biçimi; Cleveland Clinic ve Wikipedia yeniden açıldı. |
| sf-yy-fark-edilmez | DÜZELTİLDİ | "Ocağı ağaçların altında kurun" yangın riski → dalların altında değil, temizlenmiş açık yerde. |
| sf-yy-alarm-duzenek | DÜZELTİLDİ | Yaralayıcı düzenek yok (teyit). Yasal not "suçtur" genellemesinden TCK yaralama/öldürme sonucuna bağlandı. |
| sf-yy-stok-hirsizlik | TEYİTLİ (yasak kontrolü) | Şiddet yok; "hırsızı dövmek, kapatmak suçtur" uyarısı var. Kaynaklar yeniden açılmadı. |
| sf-yy-stok-kemirgen-nem | ZAYIF KALDI | CDC/TAMU/FAO yeniden açılmadı; sayılar bilinen CDC değerleriyle uyumlu. |
| sf-yy-yangin-gozetleme | ZAYIF KALDI | Yeniden açılmadı. |
| sf-yy-oyuncak | ZAYIF KALDI | Rulo testi CPSC silindirinden daha tutucu; sorun yok. |
| sf-yy-oyunlar | TEYİTLİ (yasak kontrolü) | Güvenlik uyarıları yeterli. |
| sf-yy-calgi | DÜZELTİLDİ | "Mürver dalından düdük" çıkarıldı (mürver sapı zehirli; rehberin kendi "zehirli bitki sapından düdük yapmayın" uyarısıyla çelişiyordu). |
| sf-yy-toplu-muzik | TEYİTLİ (yasak kontrolü) | Sağlık iddiası tutucu. |
| sf-yy-doga-deneyleri | ZAYIF KALDI | Yeniden açılmadı. |
| sf-yy-gozlem-defteri | ZAYIF KALDI | Yeniden açılmadı. |

Not: "Bağımsız doğrulama:" önekli `checked.note` her rehberde yenilendi; yeniden açılmayanlarda bu açıkça yazıldı.

## Önce → sonra

1. **sf-yy-yuk-hayvani (özet ve adım 2)**
   - Önce: "Sağlıklı yetişkin eşeğe dengeli yükle en fazla 50 kg yükleyin. Katır ve ata ağırlığının yaklaşık beşte birini verin: 400 kg'lık hayvana 80 kg."
   - Sonra: "Semer, keçe ve takım dahil toplam yük hayvanın ağırlığının en çok beşte biri (yüzde 20) olsun: 150 kg'lık eşeğe en çok 30 kg, 400 kg'lık katır ya da ata en çok 80 kg. Hayvanın ağırlığını bilmiyorsanız küçük tutun; …"
   - Gerekçe: Donkey Breed Society "pack ≤ %20 bodyweight, including packsaddle and rigging". Donkey Sanctuary'deki 50 kg, ortalamadan iri ve formda bir İngiliz eşeğinde **binici** için tarihsel üst sınır; yük için değil ve Anadolu'nun küçük eşeklerinde fazla. 10-bilgi-topluluk "Eşek ve at bakımı" ile aynı örnek (150 kg → 30 kg). ABD Ordusu katır %20 (Wikipedia, Equus kaynağıyla).
2. **sf-yy-siper-ayagi (adım 8)**
   - Önce: "Ayağı ılık suda (39–43°C …) yaklaşık 5 dakika bekletin ya da üstüne ılık bez koyun."
   - Sonra: "Ayağı oda sıcaklığında, ılık ve kuru bir yerde havayla kurutup kendiliğinden ısınmaya bırakın. Ayağı suya sokmayın, ateşe ya da sobaya tutmayın; ısınırken kızarıp ağrıması beklenen bir durumdur."
   - Gerekçe: CDC'nin 2008 arşiv sayfası 102–110°F öneriyor; MSD/Merck Manual "oda sıcaklığında pasif ısıtma ve yükseltme", ABD askerî JTS CPG eğitimi "donmanın aksine oda sıcaklığında havayla kurut" diyor; OSHA "ılık ortamda havayla kurut". En tutucu olan seçildi. Çizim `sf-yy-ayak-ilik-su` → `sf-yy-ayak-oda-isisi` (spec yeniden yazıldı).
3. **sf-yy-buza-dusme (adım 8 → adım 8 ve 9; art uzunluğu 9 → 10)**
   - Önce: tek adımda "buza çıkmayın … yere yatarak sırık … uzatın … yüzen bir şeyi kaydırın".
   - Sonra: adım 8 "deliğin kenarına koşmayın, buza çıkmayın … seslenin"; adım 9 "Uzanın (yüzüstü, sizi çekerse bırakın) … atın (ipi koltuk altından bağlatın) … buza çıkmak son çaredir: belinize bağlı ip, yüzüstü sürünerek ya da tahta/merdiven üstünde; asla ayakta yürümeyin, koşmayın."
   - Adım 10 (bakım): "yatar hâlde ve nazikçe … orada ıslak giysiyi çıkarın … başı dahil … normal nefes almıyorsa kalp masajı".
   - Yeni `note` (kurtarılan herkes sağlık personeline) ve yeni `dont` (hayvan için buza çıkmayın).
   - Kaynak: Minnesota DNR "What if someone else falls in?", Kanada Kızılhaçı "Emergencies on the ice", RLSS UK.
4. **sf-yy-buz-kalinligi**
   - Özet önce: "… tek kişi için en az 10, tercihen 15 cm …" → sonra: "Berrak mavi buzda tek kişi için en az 15 cm, grup için 20 cm arayın, 10 cm'den ince buza hiç çıkmayın; beyaz ya da karlı buzda değerleri ikiye katlayın, gri buza ve akan su üstündeki buza hiç çıkmayın."
   - Adım 3: beyaz buz için "tek kişi 30, grup 40 cm" ve "akarsu buzunda hiçbir kalınlık yetmez" eklendi.
   - Adım 7: "Önden gideni kıyıdaki kişi ip ucuyla izlesin" → "Önden giden beline ip bağlasın, ipin öbür ucunu kıyıdaki kişi tutsun."
   - Adım 6: buz dikeni ucu taşırken kılıflı.
   - Yeni `note`: buz hiçbir zaman yüzde yüz güvenli değil; sayılar yalnız yeni berrak göl buzu için.
5. **sf-yy-karda-yolculuk**: adım 3'e gözlüğün yüze oturması ve yarık genişliği/görüş dengesi; adım 5'e ağrı, kızarıklık, bulanık görme, belirtilerin saatler sonra başlaması, kontakt lensi çıkarma, yola devamda gözü koruma; yeni `note` (2 günden uzun ağrı ya da görme kaybı → sağlık personeli); yeni `dont` (ovdurmayın).
6. **sf-yy-fark-edilmez (adım 3)**: "Ocağı ağaçların altında kurun" → "Ocağı ağaç dallarının altında değil, çevresi kuru ottan temizlenmiş açık bir yerde kurun; kıvılcım dallara sıçrar."
7. **sf-yy-alarm-duzenek (note)**: "… kurmak hem tehlikeli hem de suçtur" → "… kurmayın: … biri yaralanır ya da ölürse Türk Ceza Kanunu'na göre yaralama ya da öldürme suçu olur." Kaynak eklendi.
8. **sf-yy-calgi (adım 7)**: "içi boş kamış ya da mürver dalından" → "içi boş kamıştan".
9. **sf-yy-grupla-yolculuk (adım 4)**: "boyunlarına düdük asın" → "montlarının fermuarına ya da cebine kısa bir iple düdük bağlayın; küçük çocuğun boynuna ip asmayın." Spec `sf-yy-cocuk-duduk` buna göre.
10. **sf-yy-hayvanla-yolculuk (adım 2)**: "köpek ve kedi kilo başına 30–60 ml … sığır 30–50 litre" → "köpek kilo başına 30–50 ml, kedi kilo başına yaklaşık 60 ml … besi sığırı 30–50, sağmal inek 40–70 litre".

## Yerleşim güvenliği kontrolü (istenen madde 5)
- Beş rehberde silah, patlayıcı, tuzak ya da yaralayıcı düzenek yok. Alarm rehberi yalnız ses çıkaran düzenekleri anlatıyor; yol karşısına ip/tel germe, çukur, kazık, cam kırığı ve elektrikli tel açıkça yasaklanmış.
- Stok rehberinde "hırsızı dövmek, kapatmak suçtur" uyarısı var; "yakaladığınız kimseye zarar vermeyin" adımı var.
- Fark edilmez rehberinde gizlilik yerine komşuyla tanışma öneriliyor; acil durumda gizliliği bırakma `note`'u var.
- Tek düzeltme: ağaç altında ocak (yangın) ve alarm notunun yasal ifadesi.

## Çelişkiler ve açık noktalar
- Buza düşünce yön: Minnesota DNR "geldiğiniz yöne dönün, en sağlam buz orası"; Kanada Kızılhaçı "düştüğünüz yere tırmanmayın, buz orada zayıf". Minnesota ve yaygın uygulama izlendi; kırılırsa önünü kırarak kıyıya ilerleme adımı zaten var.
- Çıkamayınca kollar: metin "kollarınızı buzun üstünde tutun" diyor (yaygın öneri); RLSS UK "kolları yanda, bacaklar bitişik, kımıldamadan" diyor. Değiştirilmedi.
- Hipotermi bakımında ana uygulama rehberi gövdeye beze sarılı ılık termofor öneriyor; RLSS "sıcak su şişesi koymayın" diyor. Bu pakette termofor geçmiyor, ana rehbere atıf var.

## Uzmana gidecek liste
1. İlk yardım uzmanı: sf-yy-buza-dusme adım 7 (kollar buzda mı, yanda mı) ve adım 10; ana uygulama "Hipotermi" termofor maddesiyle RLSS çelişkisi.
2. Acil tıp: siper ayağında pasif ısıtma kararı (CDC arşivi ılık su diyordu).
3. Veteriner: Anadolu eşeği ve katırında %20 kuralı ile 150 kg örnek ağırlığın uygunluğu; kolan ve semer önerileri.
4. Göz hekimi: kar körlüğünde belirtilerin başlama süresi (açılan kaynakta sayı yok) ve yarık genişliği.
5. Hukukçu: alarm notundaki TCK ifadesi; 6831 md. 14 ve 17 (mevzuat.gov.tr açılmadı); 4342 Mera Kanunu.
6. Türkiye'de resmî buz kalınlığı değeri (AFAD, JAK, DSİ) bulunamadı.
7. Bu turda kaynakları yeniden açılmayan 10 rehber (tabloda ZAYIF KALDI) için ikinci bir okuma: özellikle ATP 3-21.18 mola düzeni, UNHCR yerleşim sayıları, CDC kemirgen sayıları.

## Bu turda açılan kaynaklar
- Minnesota DNR: thickness.html, survival.html, saving.html
- Kanada Kızılhaçı: is-that-ice-safe, emergencies-on-the-ice
- RLSS UK: the-dangers-of-frozen-water
- CSBC 1-10-1
- Donkey Breed Society trekking; The Donkey Sanctuary guidelines (node/427); Wikipedia Pack animal
- REI backpacking weight; Hawke's Bay CDEM su tablosu
- CDC trench foot (arşiv); OSHA 3156; MSD Manual nonfreezing injuries; JTS frostbite/immersion foot CPG eğitimi
- Cleveland Clinic photokeratitis; Wikipedia Snow goggles
- TCK 85/89 için hukuk özet sayfası (arama sonucu)
- Açılamayan: CDC NIOSH cold stress sayfası (site hatası), mevzuat.gov.tr (denenmedi; önceki tur açamamıştı).
