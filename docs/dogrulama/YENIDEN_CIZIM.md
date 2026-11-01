# Yeniden çizim listesi (bağımsız doğrulama sonrası)

Kaynak: docs/dogrulama/*.md raporlarındaki resim bulguları ve doğrulama işlemesinde (8fdf9a5) rehberlerde null yapılan art girdileri (56bd72a ile karşılaştırma). Adım numaraları 1 den başlar ve rehberlerin GÜNCEL metnine göredir.

Her kimliğin tam ve güncel tarifi src/art/spec/*.ts içinde düzeltildi; çizer önce o tarifi okumalı. Bu tablodaki "İstenen resim" sütunu kısa özettir.

Öncelik: yüksek = yanlış teknik gösteriyor ya da metinle çelişiyor; orta = eksik, belirsiz ya da yanlış anlaşılabilir; düşük = küçük bağlam ya da görünüm sorunu.

## Özet

| Sahne dosyası | Yeniden çizilecek | Yüksek | Orta | Düşük |
|---|---|---|---|---|
| src/art/scenes/barinma.tsx | 5 | 0 | 1 | 4 |
| src/art/scenes/categories-common.tsx | 5 | 3 | 2 | 0 |
| src/art/scenes/deprem.tsx | 7 | 3 | 2 | 2 |
| src/art/scenes/guvenlik-ulasim.tsx | 3 | 0 | 2 | 1 |
| src/art/scenes/hava.tsx | 2 | 2 | 0 | 0 |
| src/art/scenes/hayatta-kalma-1.tsx | 6 | 4 | 1 | 1 |
| src/art/scenes/hayatta-kalma-2.tsx | 5 | 4 | 1 | 0 |
| src/art/scenes/hazirlik.tsx | 5 | 1 | 3 | 1 |
| src/art/scenes/ilk-yardim-1.tsx | 10 | 4 | 4 | 2 |
| src/art/scenes/ilk-yardim-2.tsx | 9 | 3 | 5 | 1 |
| src/art/scenes/nukleer-doga.tsx | 2 | 0 | 1 | 1 |
| src/art/scenes/ozel-gruplar.tsx | 13 | 5 | 4 | 4 |
| src/art/scenes/psikoloji-zehirlenme.tsx | 4 | 0 | 1 | 3 |
| src/art/scenes/sel.tsx | 4 | 1 | 3 | 0 |
| src/art/scenes/su-gida.tsx | 3 | 1 | 2 | 0 |
| src/art/scenes/tesisat.tsx | 3 | 0 | 1 | 2 |
| src/art/scenes/yangin.tsx | 5 | 3 | 1 | 1 |
| src/art/scenes/yaralanma-1.tsx | 8 | 4 | 3 | 1 |
| src/art/scenes/yaralanma-2.tsx | 8 | 1 | 2 | 5 |
| **Toplam** | **107** | **39** | **39** | **29** |

Yeni kimlikler (sahnesi henüz yok, Gallery `?art=todo` ile görünür): `hava-iceride-fise-dokunma`, `ilk-yardim-sok-battaniye`, `yaralanma-bas-soguk`, `yaralanma-gogus-izle`. Bunlar çizildikten sonra rehberde ilgili adıma yazılmalı (aşağıdaki bölümlere bakın).

## Sahne dosyasına göre liste

### src/art/scenes/barinma.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `barinma-elektrikli-isitici` | barinma-guvenli-isitma #1 | Yatak ve uyku tulumu ısıtıcıya çok yakın (1 m kuralı). | Eşyalar en az 1 m uzakta, "1 m" ölçü oku; fiş doğrudan duvar prizinde. | orta |
| `barinma-cadir-havalandirma` | cadir-barinma #6 | Dışarı çıkan nem çizgileri duman gibi okunuyor. | Açık mavi, damlacıklı buhar/nem kıvrımları; içeride duman kaynağı yok. | düşük |
| `barinma-co-alarm` | tesisat-jenerator #3<br>(toplam 2 kullanım) | Alarm direğe/boruya takılı, altında anlamsız mavi yüzey; ne olduğu zor anlaşılıyor. | Uyku alanı yakınında duvara baş hizasında takılı, "CO" yazılı, öten pilli alarm. | düşük |
| `barinma-dis-cukur` | barinma-acil-tuvalet #7 | Çadırlar dere kenarında; "dere kenarına kurmayın" uyarısıyla çelişiyor. | Çukur dereden 30 m uzakta; çadırlar da sudan uzakta, yüksek zeminde. | düşük |
| `barinma-sicak-icecek` | barinma-sicak-kalma #7<br>(toplam 2 kullanım) | Sahne gece açık havada; rehberler ev/çadır içinde sıcak kalmayı anlatıyor. | Kapalı, sıcak iç mekânda battaniyeli iki kişi sıcak içecek içiyor; açık alev yok. | düşük |

### src/art/scenes/categories-common.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `cpr-adult` | temel-yasam-destegi #7<br>ilk-yardim-ilk-degerlendirme #6<br>ilk-yardim-oed #8<br>derlenme-pozisyonu #10<br>yangin-duman-solunmasi #3<br>ezilme-yaralanmasi #9<br>yaralanma-omurga #9<br>zehirlenme #2<br>(toplam 17 kullanım) | Kollar bükük, omuzlar ellerin üstünde değil; kurtarıcı kalça hizasında ya da dizleri hastanın üstünde. | Göğüs hizasında diz çökmüş kurtarıcı, dirsekler kilitli, omuzlar ellerin dikey üstünde, eller göğüs ortasında. | yüksek |
| `recovery-position` | ilk-yardim-suda-bogulma #9 [yüksek]<br>ilk-yardim-inme #8 [yüksek]<br>ilk-yardim-seker-dusmesi #7 [yüksek]<br>ilk-yardim-bayilma #6 [yüksek]<br>zehirlenme-cocuk-yutma #8 [düşük]<br>(toplam 14 kullanım) | Üstteki bacak kalça ve dizden bükülü değil, iki bacak neredeyse düz. (Küçük: suda boğulmada örtü yok; çocuk rehberinde yetişkin figür.) | Üst bacak kalça ve dizden dik açıda bükülü, dizi yerde; üst el yanak altında; baş hafif geride, ağız yere dönük. | yüksek |
| `whistle-signal` | doga-kaybolma #5 [yüksek]<br>doga-yalniz-yaralanma #7 [yüksek]<br>hayatta-kalma-isaret #5 [yüksek]<br>iletisim #8 [düşük]<br>ozel-gruplar-engelli-gorme-isitme #9 [düşük]<br>nukleer-patlama-sonrasi #9 [orta]<br>(toplam 7 kullanım) | Rozet "3×": 3 işaret Alp sisteminde yanıt sinyali; metin dakikada 6 ses diyor. Ayrıca sahne açık havada, enkaz bağlamına uymuyor. | Nötr arka planlı yakın plan yüz + düdük, aralıklı kısa ses dalgaları, rozet "6× / 1 dk" ve tekrar oku. | yüksek |
| `cover-mouth-cloth` | kimyasal-sizinti #2 | Kişi cerrahi maske takmış gibi, ıslak bez boynunda. | Ağız ve burnu birlikte kapatan, elle tutulan ıslak bez; maske yok. | orta |
| `watch-breathing` | derlenme-pozisyonu #8 | Derlenme adımında kişi sırtüstü ve örtüsüz, "10 sn" saati ilgisiz. Göğüs yaralanmasında kişiyi yatırmaya yönlendiriyordu (orada null yapıldı). | Derlenme pozisyonunda yan yatan, üstü örtülü kişi; yardımcı nefesini izliyor; saat yok. Göğüs yaralanması için ayrı kimlik: yaralanma-gogus-izle. | orta |

### src/art/scenes/deprem.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `deprem-kapan-masa` | deprem-yuksek-bina #3<br>deprem-aninda #3 | Masa pencerenin hemen yanında; "pencerelerden uzak durun" adımıyla çelişiyor. | Penceresiz iç duvar önünde masa; altında eller-dizler üzerinde, bir kol başta, bir el masa ayağında. | yüksek |
| `deprem-kurtarma-takoz` | enkaz-kurtarma #7 | Kaldıracın altında dayanak yok; takoz kalkan parçanın altına sürülmüyor. | Kaldıraç bir takoz dayanağın üstünden geçiyor, parça birkaç cm kalkık, ikinci kişi yandan takozu altına itiyor; kimsenin eli yükün altında değil. | yüksek |
| `deprem-metro-tutun` | deprem-kalabalik-alan #6 | Yolcular tutamağa tutunmuyor, eller boşta. | Oturan yolcu koltuk tutamağını/direği, çömelen yolcu dikey direği açıkça kavramış. | yüksek |
| `deprem-bebek-gogus` | deprem-cocuklar #1 | Yetişkin masanın yanında, altında değil. | Anne masanın altında, bebeği göğsüne bastırmış, bir koluyla başını koruyor. | orta |
| `deprem-enkaz-dinle` | enkaz-altinda #5 | Kurtarıcının anatomisi bozuk (kol tuhaf yukarıda, baş ters). | Kasklı kurtarıcı enkaz üstünde diz çökmüş, kulağı enkaza yakın, parmağı dudakta; altta dinleyen kişi. | orta |
| `deprem-bina-fener` | deprem-hasarli-bina #9 | "Mum/çakmak yasak" kutusu görevlinin başını ve kaskını örtüyor. | Yasak kutusu sağ üst köşede; baş ve kask açıkça görünüyor. | düşük |
| `deprem-kurtarma-isaretle` | enkaz-kurtarma #9 | Büyük X + tarih-saat; AFAD/INSARAG işaretlemesiyle uyumu doğrulanmadı. | Sade bir işaret ve "ARANDI" + saat; resmi kod gibi görünen sembol yok. | düşük |

### src/art/scenes/guvenlik-ulasim.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `guvenlik-kamp-fener` | guvenlik-cadir-kent #2 | Kadının elinde fener açıkça görünmüyor, ışık konisinin kaynağı belirsiz. | Elinde yanan el feneriyle aydınlık yolda yürüyen kadın; ışık fenerden çıkıyor. | orta |
| `ulasim-reflektor-mesafe` | ulasim-trafik-kazasi #2<br>(toplam 2 kullanım) | Yalnız arkada tek üçgen; trafik kazası metni "önüne ve arkasına" diyor. | Çift yönlü yolda arkada ve önde birer üçgen, her birine "30 m / 150 m" ölçüsü. | orta |
| `ulasim-kar-anten-bez` | ulasim-karda-mahsur #7 | Bez anten yerine tavandaki bir sopada. | Antene bağlı parlak bez; iç lamba yanıyor. | düşük |

### src/art/scenes/hava.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `hava-fisten-cek` | firtina-yildirim #3 (eskiden #2, null; yeni yeri #3) | Şimşek varken fiş çekiliyor; NWS fırtına sırasında fiş çekmemeyi söylüyor. Adım 2 de değişti. Art null yapıldı. | Fırtına ÖNCESİ (şimşek yok, yaklaşan bulut) fiş çeken el; adım 3 için. | yüksek |
| `hava-iceride-fise-dokunma` (yeni) | firtina-yildirim #2 (yeni kimlik) | (Yeni kimlik) Adım 2 artık "pencereden uzak dur, fişe takılı aletlere dokunma, duş/musluk kullanma" diyor; uygun resim yok. | Pencereden uzakta oturan kişi; prize takılı TV kablosuna uzanan el yasaklı; kapalı musluk/duş yasaklı. | yüksek |

### src/art/scenes/hayatta-kalma-1.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `hayatta-kalma-barinak-dal` | hayatta-kalma-barinak #5 | Dallar sırıktan saçak gibi sarkıyor, yere ulaşmıyor; yaprak örtü havada. İşlevsel sundurma değil. | Sırık iki ağaca bağlı, dallar sırıktan yere eğik dayalı (üçgen kesit), yapraklar dalların üstünde, kişi alçak tarafın altında. | yüksek |
| `hayatta-kalma-kutup-yildizi-bulma` | hayatta-kalma-yon-yildiz #3 | Gösterici yıldızlar yanlış (kasenin alt kenarı), çizgi sapa doğru uzatılmış; yanlış yıldızı kuzey sandırabilir. Art null yapıldı. | Sapa bağlı olmayan uç kenar: Merak (alt) ve Dubhe (üst); çizgi Merak tan Dubhe ye ve kasenin açık tarafından dışarı, ~5 kat; ucunda Kutup Yıldızı. | yüksek |
| `hayatta-kalma-saat-guney` | hayatta-kalma-yon-saat #4 | Güneş akrebin doğrultusunda değil, sağ üst köşeye kaymış. | Akrep (4) güneşe dönük; 4 ile 1 arası dilim; G oku tam ortada (2:30 konumu). | yüksek |
| `hayatta-kalma-su-tablet` | hayatta-kalma-su-aritma #3 | Saat rozetinde sabit "30 dk"; metin "paketteki süreye uyun" diyor (bazı tabletler 4 saate kadar ister). | Saat simgesi + "paketteki süre", pakete bakan göz simgesi; sabit dakika yok. | yüksek |
| `hayatta-kalma-sodis` | hayatta-kalma-su-aritma #6 | Üstü çizili şişelerden biri şeffaf PET gibi; yasaklanan şey belirsiz. | Doğru: şeffaf PET. Yasaklı: belirgin yeşil/kahverengi cam şişe ve bulanık sulu şişe. | orta |
| `hayatta-kalma-golge-cubuk-1` | hayatta-kalma-yon-gunes #1 | Adım 1 resmi taşa "B" konmuş halini gösteriyor; bu adım 2 nin işi. | Yalnızca dik çubuk ve gölgesi; taş ve harf yok. | düşük |

### src/art/scenes/hayatta-kalma-2.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `hayatta-kalma-ayi-geri-cekil` | hayatta-kalma-vahsi-hayvan #2 | Kişi ayıya doğru adım atıyor gibi; ok ayının üstünde. | Kişi ayıya dönük, ayıdan uzaklaşan yönde yan-geri adım atıyor; ok kişiden geriye gidiyor. | yüksek |
| `hayatta-kalma-dere-sopa` | hayatta-kalma-dere-gecme #7 | Kişi izleyiciye bakıyor, gövdesi akıntıya dik; metin "yüzünüz akıntıya dönük" diyor. | Kişi akıntının geldiği yöne dönük, sopa önünde ve yukarı akışta, yan adım okları karşı kıyıya. | yüksek |
| `hayatta-kalma-parlak-bez` | hayatta-kalma-isaret #2<br>(toplam 3 kullanım) | Kişi helikoptere tek kolla el sallıyor; "el sallamayın" uyarısıyla çelişiyor, tek kol yukarı "yardım gerekmiyor" anlamına gelebilir. | Kişi diz çökmüş, iki eliyle bezi seriyor; el sallama ya da tek kol yukarı yok. | yüksek |
| `hayatta-kalma-yer-isareti` | hayatta-kalma-isaret #3 | Ölçek veren kişi tek kolunu kaldırmış. | Kişi kolları aşağıda duruyor; V işareti, "3 m" ölçüsü. | yüksek |
| `hayatta-kalma-katman-giyin` | doga-hava-degisimi #8<br>(toplam 2 kullanım) | Güneşli havada kışlık katmanlar; metnin istediği yağmurluk yok. | Bulutlanan, yağmur başlayan havada katmanların üstüne yağmurluk giyen yürüyüşçü. | orta |

### src/art/scenes/hazirlik.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `hazirlik-tatbikat` | hazirlik-aile-afet-plani #9 | İki kişi masanın yanında kıvrılmış ("hayat üçgeni"), üçüncüsü çantayla kapıdan çıkıyor. Art null yapıldı. | Aile masaların ALTINDA, eller-dizler üzerinde, bir kol başta, bir el masa ayağında; kimse kapıya koşmuyor; "6 ay" takvimi. | yüksek |
| `hazirlik-belge-posette` | afet-cantasi #8<br>(toplam 2 kullanım) | Su damlaları poşetin içindeki kâğıtların üstünde; belgeler ıslanıyor gibi. | Damlalar yalnız kapalı poşetin dış yüzünde; içerideki kâğıtlar kuru. | orta |
| `hazirlik-ilkyardim-eldiven` | hazirlik-ilk-yardim-cantasi #3 | Suni solunum maskesi çan biçimli kap gibi, tanınmıyor. | Tanınır cep maskesi: şeffaf üçgen maske + tek yönlü valfli ağızlık ve kutusu. | orta |
| `hazirlik-is-cok-kapan` | hazirlik-is-okul #5 | Kişi masa ayağını tutmuyor. | Bir el baş-ensede, öbür el masa ayağını açıkça kavramış; pencereden uzak. | orta |
| `hazirlik-tarih-kontrol` | hazirlik-ilk-yardim-cantasi #9<br>(toplam 2 kullanım) | Arkada afet çantası resmindeki turuncu sırt çantası; ilk yardım kutusu bağlamında hafif çelişki. | Belirli bir çanta yok; eller tarih gösteriyor, duvarda takvim, "6 ay". | düşük |

### src/art/scenes/ilk-yardim-1.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `ilk-yardim-bebek-bas-notr` | ilk-yardim-bebek-kpr #3 | Kurtarıcının parmağı göğüste; çene kaldırma görünmüyor. | Bir el alında, bir-iki parmak çene kemiği altında hafifçe kaldırıyor; göğüste el yok. | yüksek |
| `ilk-yardim-kpr-el-yeri` | temel-yasam-destegi #6 | El çok aşağıda (göğüs kemiği ucu/kaburga kenarı), tek el ve yana açık parmaklar; kenetli iki el net değil. | El topuğu göğüs kemiğinin alt yarısında, meme uçları hizasında, ksifoidin üstünde; ikinci el üstte, parmaklar kenetli ve kalkık. | yüksek |
| `ilk-yardim-kurtarici-nefes` | ilk-yardim-suda-bogulma #6<br>(toplam 2 kullanım) | Rozet "2"; suda boğulma metni "önce 5 kurtarıcı nefes" diyor (temel yaşam desteği adım 8 ise 2 diyor). | Sayı rozeti yok; nefes sayısını metin verir. Teknik aynı. | yüksek |
| `ilk-yardim-sirt-vurusu` | hava-yolu-tikanmasi #3 | Kurtarıcı tam arkada, eli yumruk gibi, ok enseye/başa gidiyor. | Kurtarıcı yanda ve hafif arkada, bir el göğüste destek, açık el topuğu kürek kemikleri arasında; kişi belirgin öne eğik. | yüksek |
| `ilk-yardim-karin-basisi` | hava-yolu-tikanmasi #6 | Kazazede neredeyse dik; metin "öne eğip" diyor. | Kazazede belinden belirgin öne eğik (~45°); yumruk göbeğin üstünde. | orta |
| `ilk-yardim-nobet-cevre` | nobet #1 | Yardımcı ağır sandığı kişinin bacaklarının üstünden kaldırıyor. | Eşyalar zeminde kaydırılarak yana, kişiden uzağa çekiliyor; kişinin üstünden taşıma yok. | orta |
| `ilk-yardim-oed-ped-yetiskin` | temel-yasam-destegi #9<br>(toplam 2 kullanım) | Sol ped önde/ortada; koltuk altı çizgisinde olmalı. | Sol ped sol koltuk altının altında, göğsün yan yüzünde (orta koltuk altı çizgisi). | orta |
| `ilk-yardim-omuz-seslen` | ilk-yardim-ilk-degerlendirme #2<br>(toplam 2 kullanım) | Eller omuzda değil, üst göğüste. | Eller iki omuzda, eğilip yüksek sesle seslenme. | orta |
| `ilk-yardim-oed-ac` | ilk-yardim-oed #2 | OED duvara asılı gibi; metin cihazı başın yanına koyup açmayı anlatıyor. | Yerde, yatan kişinin başının yanında açılan cihaz. | düşük |
| `ilk-yardim-oed-getir` | ilk-yardim-kalp-krizi #8 | Arka planda kalp masajı yapılıyor; bu adımda kişi bilinçli. | Arka planda sırtı duvara yaslı oturan, bilinci açık hasta; masaj yok. | düşük |

### src/art/scenes/ilk-yardim-2.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `ilk-yardim-adrenalin-uyluk` | ilk-yardim-anafilaksi #4 | Kalem uyluğun üstüne yukarıdan dik bastırılıyor gibi. | Kalem uyluğun dış yan yüzüne, yüzeye dik açıyla; dış yan orta turuncu daireyle. | yüksek |
| `ilk-yardim-bebek-kpr-tek-el` | ilk-yardim-bebek-kpr #8 | Metin "tek elin topuğu" diyor; resimde iki el/kol ve düz avuç. | Göğüste tek el topuğu, parmaklar kalkık; diğer el alında, baş nötr. | yüksek |
| `ilk-yardim-sok-belirti` | ilk-yardim-sok #1 | Kazazede oturuyor; "Yapmayın" listesi "oturtmayın" diyor. | Belirtiler sırtüstü yatan kişide; yardımcı nabız yokluyor. | yüksek |
| `ilk-yardim-astim-fisfis` | ilk-yardim-astim #2 | Turuncu ok ağza değil göze gidiyor. | Ok inhalerden ağızlığa/ağza. | orta |
| `ilk-yardim-bayilma-oturt` | ilk-yardim-bayilma #1 | Kişi ayakta, yardımcı arkasında duruyor; "hemen yere oturtun" eylemi yok. | Yardımcı kolundan ve sırtından tutup kişiyi yere oturtuyor (hareketin ortası). | orta |
| `ilk-yardim-elektrik-tahta-sopa` | ilk-yardim-elektrik-carpmasi #2 | Kazazedenin duruşu tuhaf, ayakları prize doğru havada. | Kazazede yerde doğal yatıyor, eli kabloda; kurtarıcı kuru tahta/paspas üstünden süpürge sapıyla kabloyu itiyor. | orta |
| `ilk-yardim-kalp-krizi-oturt` | ilk-yardim-kalp-krizi #4 | Yardımcı kişinin yüzünü/çenesini elleriyle tutuyor gibi. | Yardımcı yanında diz çökmüş, eli omzunda, sakin konuşuyor; kişi sırtı yaslı, dizleri bükük. | orta |
| `ilk-yardim-sok-battaniye` (yeni) | ilk-yardim-sok #6 (yeni kimlik) | (Yeni kimlik) Şok adım 6 "altına ve üstüne battaniye" diyor; ortak resim yalnız üstü örtüyor. | Kişinin altında yalıtan battaniye, üstünde ikinci battaniye; giysiler gevşetilmiş. | orta |
| `ilk-yardim-bebek-gogus-basisi` | ilk-yardim-bebek-bogulma #6 | Ellerin göğsü sardığı ve başparmakların yeri yeterince net değil. | İki el göğsü iki yandan sarıyor, iki başparmak göğüs kemiğinin alt yarısında net. | düşük |

### src/art/scenes/nukleer-doga.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `nukleer-maske-cene` | nukleer-maske-kullanimi #3 | Maske göğüs/çene hizasında yanlardan tutuluyor; çene altına oturtma hareketi net değil. | Maske avuçta, burun teli parmak uçlarında üstte, lastikler sarkık; çenenin altına oturtuluyor. | orta |
| `nukleer-hasta-ayri-oda` | nukleer-salgin #5 | Hastanın yatağı kapı çerçevesinin içinden geçiyor, perspektif karışık. | Kalın duvarla ayrılmış iki oda; yatak tümüyle soldaki odada; aradaki kapı kapalı. | düşük |

### src/art/scenes/ozel-gruplar.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `ozel-gruplar-dogum-kordon-kesme` | ozel-gruplar-acil-dogum #9 | Bebek anneden ayrı bir tahtada, kordon boşta; ten tene temas adımıyla çelişiyor. | Bebek annenin göğsünde ten tene, kordon bütün ve bağlı değil, plasenta yanında poşette; makas yasaklı. | yüksek |
| `ozel-gruplar-gorme-basamak` | ozel-gruplar-engelli-gorme-isitme #3 | Basamaklar yukarı çıkıyor (metin "iniyoruz"); rehber kişiyle temas halinde değil. | Aşağı inen basamakların başında birlikte duran iki kişi, temas var, balon "3 basamak iniyoruz". | yüksek |
| `ozel-gruplar-gorme-rehberlik` | ozel-gruplar-engelli-gorme-isitme #2 | Kişi rehberi omzundan/üst kolundan tutuyor; metin dirsek diyor. | Kişi rehberin dirseğinin hemen üstünden tutuyor, rehber yarım adım önde. | yüksek |
| `ozel-gruplar-sandalye-kilitle` | ozel-gruplar-engelli-hareket #1 | Kişi yana devrilir gibi, bir kolu havada; kollar baş ve enseyi örtmüyor. | Dik oturup öne eğilmiş, iki eliyle ense ve başı kavramış; ok fren koluna. | yüksek |
| `ozel-gruplar-sandalye-merdiven` | ozel-gruplar-engelli-hareket #6 | Sandalye geriye yatırılmamış; öndeki yardımcı ayaklık bölgesinden tutuyor. | Sandalye arka tekerlekler üzerinde ~30° geriye yatık; arkadaki itme kollarından, öndeki sabit çerçeveden tutuyor. | yüksek |
| `ozel-gruplar-dogum-bas-destek` | ozel-gruplar-acil-dogum #4 | Yardımcı örtülü dizlere uzanıyor; bebeğin başı ve alttan avuç desteği yok; yasak oku belirsiz. | Çıkan baş görünür, eldivenli avuç alttan destekliyor; net "çekmeyin" yasak simgesi. | orta |
| `ozel-gruplar-evcil-kafes` | ozel-gruplar-evcil-hayvan #2 | Köpekte yalnız tasma var, gezdirme kayışı yok, kimse tutmuyor. | Kadın köpeğin kayışını elinde tutuyor, öbür elinde kilitli kedi kafesi. | orta |
| `ozel-gruplar-mama-olcu` | ozel-gruplar-bebek-beslenme #7 | Üstü çizili biberon simgesi "biberon kullanmayın" gibi okunuyor. | Çizili biberon yok; köşede silme dolu ölçek (onay) ve yarım/tepeleme ölçek (yasak). | orta |
| `ozel-gruplar-yasli-esyalar` | ozel-gruplar-yasli #2 | İşitme cihazı yok, yerinde anlamsız soru işareti. | Tanınır kulak arkası işitme cihazı; soru işareti yok. | orta |
| `ozel-gruplar-dogum-kurulama` | ozel-gruplar-acil-dogum #6 | Bebek ayrı bir örtünün üstünde kurulanıyor; ideali annenin karnı. | Bebek annenin karnında/göğsünde kuru havluyla kurulanıyor. | düşük |
| `ozel-gruplar-emzirme` | ozel-gruplar-bebek-beslenme #1 | Bebeğin başı örtü altında, yüzü görünmüyor. | Örtü yalnız annenin omzunda; bebeğin yüzü açık, doğru tutuşla emiyor. | düşük |
| `ozel-gruplar-evcil-canta` | ozel-gruplar-evcil-hayvan #4 | Çantada hayvanın fotoğrafı yok (metin istiyor). | Çanta içeriğine küçük hayvan fotoğrafı eklenmiş. | düşük |
| `ozel-gruplar-yasli-yuruyus` | ozel-gruplar-yasli #7 | Feneri yardımcı tutuyor, eli yaşlının sırtında; metin "el feneri verin, kolundan tutun" diyor. | Feneri yaşlı tutuyor; yardımcı koluna girmiş. | düşük |

### src/art/scenes/psikoloji-zehirlenme.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `zehirlenme-gida-yudum-su` | zehirlenme-gida #1 | Kadın sandalyesiz havada oturuyor, sırtında pelerin gibi şekil. | Sandalyede/kanepede açıkça oturan, ORS ve su içen kişi; pelerin görüntüsü yok. | orta |
| `psikoloji-yas-anma` | psikoloji-yas #5 | Yanan mum; çadır/afet ortamında yangın riski. | Mumsuz anma: fotoğraf, tespih, defter. | düşük |
| `zehirlenme-co-cadirda-mangal-yasak` | karbonmonoksit #7 | Mangal + tüplü ısıtıcı var; metindeki jeneratör ve çadır/konteyner belirgin değil. | Tanınır çadır/konteyner içinde mangal, tüplü ısıtıcı ve jeneratör; sahne yasaklı. | düşük |
| `zehirlenme-tarla-temiz-hava` | zehirlenme-tarim-ilaci #1 | Kurtarıcı yalnız toz maskesi takıyor; "korunmasız girmeyin" ile çelişebilir. | Kurtarıcıda kimyasala dayanıklı eldiven ve filtreli yarım yüz maskesi. | düşük |

### src/art/scenes/sel.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `sel-akinti-capraz` | sel-akintiya-kapilma #4 | Kişinin başı akıntı yönünde, ayaklar yukarı akıntıda; metin "ayaklar önde, akıntı yönünde" diyor. | Sırtüstü, ayaklar önde akıntı yönünde, gövde kıyıya açılı, kıyıya çapraz ok. | yüksek |
| `sel-arac-cam` | sel-arac #6 | Dış su zaten camın yarısında; metin "su cam hizasına gelmeden" diyor. | Dış su kapı hizasında, camın altında; cam suyun üstünde. | orta |
| `sel-camur-dere-bulanik` | sel-camur-akisi #3 | Kişi dereye paralel yürüyor. | Kişi dereden dik açıyla, yokuş yukarı uzaklaşıyor. | orta |
| `sel-sonrasi-camasir-suyu` | sel-sonrasi-temizlik #8 | Çamaşır suyu çıplak elle dökülüyor. | Eldivenli el (adım 4 ile tutarlı). | orta |

### src/art/scenes/su-gida.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `su-gida-rezervuar` | su-gida-evdeki-gizli-su #6 | Rezervuara tablet/blok sokan el + yeşil onay; metne ters. | Berrak su, temiz kapla alan el; tablet hiç yok; çanak yasaklı. | yüksek |
| `su-gida-konserve-soguk` | su-gida-pisirmeden-beslenme #2 | Ocağın üstünde yeşil onay; rehber ocak olmadığı durum için. | Ocak yok; onay kutudan soğuk yiyen kişinin yanında. | orta |
| `su-gida-mutfak-mesafe` | su-gida-toplu-mutfak #9 | Mavi çadır 6 m okundan daha yakın. | Bütün yaşam çadırları 6 m okunun öbür ucunun ötesinde. | orta |

### src/art/scenes/tesisat.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `tesisat-panel-powerbank` | tesisat-gunes-powerbank #4 | Powerbank ve telefon güneşte; adım 5 "gölgede kalsın" diyor. | Panel güneşte, kablo gölgeye uzanıyor; powerbank ve telefon gölgede. | orta |
| `tesisat-dusen-tel` | tesisat-elektrik-kesintisi #10<br>tesisat-hasarli-elektrik #5 | 12 m oku kırmızı dairenin kenarından başlıyor. | Ok yerdeki telin kendisinden başlayıp kişide bitiyor. | düşük |
| `tesisat-siskin-powerbank` | tesisat-gunes-powerbank #7 | Şişmiş, ısınmış powerbank çıplak elle tutuluyor. | Isı geçirmez eldiven ya da maşayla yanmaz yüzeye konuyor. | düşük |

### src/art/scenes/yangin.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `yangin-bina-kapi-kapat` | yangin-yuksek-bina #1 | Kapı ardına kadar açık, içeriden duman çıkıyor; "kapıyı arkanızdan kapatın" adımıyla çelişiyor. | Kişi kapıyı arkasından neredeyse tamamen kapatıyor, öbür eliyle alarm butonuna basıyor. | yüksek |
| `yangin-dur-yat-yuvarlan` | yangin-giysi-tutustu #4<br>(toplam 2 kullanım) | 3. panelde kişi sırtüstü, bir kolu havada, yüzü açık; yuvarlanma ve yüzü kapatma yok. | 3. panelde yan dönerek yuvarlanan, iki eliyle yüzünü kapatan kişi. | yüksek |
| `yangin-kapi-dokun` | yangin #4<br>yangin-yuksek-bina #2 | Avuç içi kapıya dönük görünüyor (avuç çizgileri); metin "elinizin tersiyle" diyor. | Elin sırtı (eklem tarafı) kapıya değiyor, avuç kişiye bakıyor. | yüksek |
| `yangin-orman-tahliye` | orman-yangini #5 | Kadının dirseği yanında alev simgesi; üstü yanıyor gibi. | Alev ve duman yalnız uzak tepede; kişilerin üstünde alev yok. | orta |
| `yangin-plan-bulusma` | yangin-kacis-plani #4 | Babanın elindeki "1-2-3" levhasının anlamı belirsiz. | Baba eliyle aile bireylerini tek tek sayıyor; levha yok. | düşük |

### src/art/scenes/yaralanma-1.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `yaralanma-burun-sikma` | burun-kanamasi #2 | Parmaklar kemikli üst kısmı sıkıyor, baş dik/hafif geride; en yaygın hata. Art null yapıldı. | Baş öne eğik; başparmak ve işaret parmağı burun deliklerinin hemen üstündeki yumuşak kısmı sıkıyor. | yüksek |
| `yaralanma-gogus-acik-yara` | yaralanma-gogus #3 | "Doğru" paneli yaraya elle bastırılan bez; metin "açık bırakın" diyor. | Doğru panelde yara üstü açık, kimse bastırmıyor; yanlış panelde dört kenarı bantlı naylon. | yüksek |
| `yaralanma-gogus-izle` (yeni) | yaralanma-gogus #6 (yeni kimlik) | (Yeni kimlik) watch-breathing göğüs yaralısını düz yatırılmış gösteriyordu; adım 6 null yapıldı. | Yarı oturur yaralının yüzüne ve dudak rengine bakan yardımcı; düz yatış ve saat yok. | yüksek |
| `yaralanma-goz-yikama` | yaralanma-goz #1 | Baş neredeyse dik, su sert çubuk gibi, kişi gülümsüyor. | Baş yaralı göz tarafına belirgin eğik, kapaklar parmakla açık, yumuşak akış sağlam göze gitmiyor. | yüksek |
| `yaralanma-bas-soguk` (yeni) | yaralanma-bas-travmasi #7 (yeni kimlik) | (Yeni kimlik) Baş travması adım 7 için başa soğuk uygulama resmi gerekiyor. | Alnın yanındaki şişliğe beze sarılı buz; süre etiketi yok. | orta |
| `yaralanma-dis-yerlestirme` | yaralanma-dis #4 | Küçük karede ağzın üstünde beyaz bant; "bez ısırma" anlaşılmıyor. | Küçük karede dişlerin arasında katlanmış bezi ısıran kişi; bant görüntüsü yok. | orta |
| `yaralanma-yanik-yuvarlanma` | yanik #1 | Kurtarıcının battaniyesi kırmızı kova/çöp kutusu gibi. | Kumaş olduğu belli açık battaniye, baştan ayağa doğru örtülüyor. | orta |
| `yaralanma-bas-dinlenme` | yaralanma-bas-travmasi #6 | Dinlenme adımında çocuk başına soğuk tutuyor (soğuk adım 7 de). | Kanepede dinlenen genç; elinde soğuk paket yok. | düşük |

### src/art/scenes/yaralanma-2.tsx

| Art id | Rehber ve adım | Sorun | İstenen resim | Öncelik |
|---|---|---|---|---|
| `yaralanma-ates-bardak-testi` | yaralanma-yuksek-ates #8 | Bardağın altındaki lekeler daha soluk; "solan döküntü" izlenimi 112 rozetiyle çelişiyor. | Bardağın yan yüzü deriye bastırılmış; lekeler altında da aynı koyulukta. | yüksek |
| `yaralanma-kene-cekme` | yaralanma-kene #4 | Cımbız ucu kenenin gövdesine yakın. | Cımbız keneyi deriye en yakın yerden, ağız/baş kısmından tutuyor; gövde sıkılmıyor. | orta |
| `yaralanma-ors-paket` | yaralanma-ishal #2 | Sürahide "1 L" etiketi; paketler 200/500 mL için de olabilir, metin "paketin tarifine göre" diyor. | Litre etiketi yok; paketteki yazıya bakan el ve ölçülü kap. | orta |
| `yaralanma-asi-takvimi` | yaralanma-kuduz-isirik #8 | Takvimde 1, 4, 8, 15, 29 işaretli (Essen şeması); Türkiye şeması farklı olabilir, metin "hekimin verdiği takvim" diyor. | Belirli gün işaretlenmemiş; aşı kartı ve takvim simgesi. | düşük |
| `yaralanma-ates-bebek` | yaralanma-yuksek-ates #2 | Kucaktaki bebek 3 aydan büyük görünüyor. | Çok küçük, kundaklı, yeni doğmuş görünümlü bebek. | düşük |
| `yaralanma-donma-sarma` | yaralanma-soguk-isirigi #8 | Sargı eli değil bileği sarıyor; pedler parmakların üstünde. | Gazlı bez parmakların arasında; sargı eli gevşekçe sarıyor. | düşük |
| `yaralanma-kas-sargi` | yaralanma-kramp-zorlanma #7 | Sargı spiral değil, ayrı paralel bant şeritleri gibi. | Tek parça elastik sargı, üst üste binerek spiral sarım. | düşük |
| `yaralanma-su-icme` | yaralanma-gunes-yanigi #3<br>(toplam 2 kullanım) | Elde bardak net görünmüyor. | Elinde açıkça görünen bardakla su içen kişi. | düşük |

## Ortak çizimi değişmeyen, bağlam uyumsuzluğu bildirilen resimler

Bu resimler birçok rehberde doğru kullanılıyor; ortak çizim yeniden çizilmeyecek. Bildirilen adım için ayrı bir resim gerekirse yeni kimlikle çizilmeli.

| Art id | Sahne dosyası | Rehber ve adım | Sorun | Öneri | Öncelik |
|---|---|---|---|---|---|
| `cold-compress` | src/art/scenes/categories-common.tsx | yaralanma-bas-travmasi #7<br>(toplam 3 kullanım) | Baş travmasında önkola soğuk uygulama; "20 dk" etiketi metinde yok. | Ortak resim (burkulma, kramp) kol/bilekte kalır. Baş için ayrı kimlik: yaralanma-bas-soguk. | orta |
| `lie-cover-blanket` | src/art/scenes/categories-common.tsx | ilk-yardim-sok #6<br>(toplam 9 kullanım) | Şok rehberi "altına ve üstüne battaniye" diyor, resimde yalnız üstte örtü. | Ortak resim yalnız üstten örtü olarak kalır (omurga vb. rehberlerde kişi oynatılmamalı). Şok adımı için ayrı kimlik: ilk-yardim-sok-battaniye. | orta |
| `call-112` | src/art/scenes/categories-common.tsx | heyelan #2<br>(toplam 61 kullanım) | Heyelan adım 2 nin ilk eylemi "hemen uzaklaşın"; resim yalnız telefon. | Ortak resim (60+ kullanım) değişmez. İsteğe bağlı: uzaklaşırken telefon eden kişi. | düşük |
| `call-114` | src/art/scenes/categories-common.tsx | zehirlenme-mantar #2<br>(toplam 5 kullanım) | Mantar rehberinde zehir şişesi gösteriliyor; adımın asıl uyarısı 112. | Ortak resim değişmez. İsteğe bağlı: mantar tabağı ile 112/114 telefonu. | düşük |
| `flush-water-15` | src/art/scenes/categories-common.tsx | kimyasal-sizinti #7<br>(toplam 3 kullanım) | Kimyasal sızıntıda yalnız el/kol yıkama var; giysi çıkarma ve göz yıkama yok. | Ortak resim değişmez (ısırık ve cilt temasında doğru). İsteğe bağlı: kimyasal rehberi için giysi çıkarma + göz yıkama gösteren ayrı resim. | düşük |
| `hospital-go` | src/art/scenes/categories-common.tsx | ozel-gruplar-bebek-bakimi #9<br>psikoloji-cocuk-stres-belirtileri #8<br>(toplam 18 kullanım) | Bebek bakımında bebek, çocuk stres belirtilerinde çocuk yok; iki yetişkin yürüyor. | Ortak resim (18 kullanım) değişmez. İsteğe bağlı: bebeği kucağında götüren ebeveyn ve çocukla başvuran ebeveyn için ayrı resimler. | düşük |
| `stay-calm-talk` | src/art/scenes/categories-common.tsx | ozel-gruplar-yasli #10<br>(toplam 5 kullanım) | Yaşlı rehberinde iki genç kişi; yaşlı yok. | Ortak resim (psikoloji rehberleri) değişmez. İsteğe bağlı: yaşlıyla oturup konuşan yardımcı için ayrı resim. | düşük |


## Geri açılacak boş adımlar

Doğrulama sırasında resim yanıltıcı olduğu için `art` girdisi null yapılan adımlar (56bd72a → 8fdf9a5 karşılaştırması). Resim yeniden çizilip onaylandıktan sonra rehber dosyasında bu adımın `art` değeri yazılmalı.

| Rehber id | Dosya | Adım | Özgün art id | Geri açılınca yazılacak art id | Not |
|---|---|---|---|---|---|
| hazirlik-aile-afet-plani | src/content/guides/hazirlik.ts | 9 | `hazirlik-tatbikat` | `hazirlik-tatbikat` | Masa altında Çök-Kapan-Tutun olarak yeniden çizilince geri açın. |
| hayatta-kalma-yon-yildiz | src/content/guides/hayatta-kalma.ts | 3 | `hayatta-kalma-kutup-yildizi-bulma` | `hayatta-kalma-kutup-yildizi-bulma` | Gösterici yıldızlar (Merak–Dubhe) düzeltilince geri açın. |
| burun-kanamasi | src/content/guides/yaralanma.ts | 2 | `yaralanma-burun-sikma` | `yaralanma-burun-sikma` | Baş öne eğik, yumuşak kısım sıkılırken çizilince geri açın. |
| firtina-yildirim | src/content/guides/hava.ts | 2 | `hava-fisten-cek` | `hava-iceride-fise-dokunma` (yeni) | Özgün resmi adım 2 ye geri koymayın: adım 2 artık "fişe dokunmayın" diyor. `hava-fisten-cek` fırtına öncesi olarak yeniden çizilip adım 3 e (şu an null) yazılmalı. |
| yaralanma-gogus | src/content/guides/yaralanma.ts | 6 | `watch-breathing` | `yaralanma-gogus-izle` (yeni) | `watch-breathing` derlenme pozisyonu için yeniden tanımlandı; göğüs yaralısı için yarı oturur yeni resim kullanılmalı. |

Ek olarak art değeri değişecek (null olmayan) adımlar:

| Rehber id | Adım | Şu anki art | Yeni art | Neden |
|---|---|---|---|---|
| firtina-yildirim | 3 | null | `hava-fisten-cek` | Fırtına öncesi fiş çekme resmi bu adıma ait. |
| ilk-yardim-sok | 6 | `lie-cover-blanket` | `ilk-yardim-sok-battaniye` (yeni) | Metin "altına ve üstüne battaniye" diyor; ortak resim yalnız üstü örtüyor. |
| yaralanma-bas-travmasi | 7 | `cold-compress` | `yaralanma-bas-soguk` (yeni) | Ortak resim kola soğuk uyguluyor; başa uygulama gerekiyor. |

Resim sorunu olmadan null kalan adımlar (geri açılacak bir şey yok):
- yangin-kacis-plani adım 1: `yangin-plan-dedektor` resmi test düğmesini gösterdiği için adım 2 ye taşındı. İsteğe bağlı: tavana dedektör takan kişi için yeni resim.
- Doğrulamada eklenen yeni adımlar resimsiz başladı (derlenme-pozisyonu #9, hayatta-kalma-yon-saat #8, ozel-gruplar-engelli-zihinsel #8, ozel-gruplar-kronik-hastalik #8, yanik #9, yaralanma-yara-temizleme #3). Adım eklenmesiyle bazı resimler bir sıra kaydı (ör. ozel-gruplar-acil-dogum, yaralanma-dis); raporlardaki adım numaraları güncel sırayla eşleşiyor.

## Diğer notlar
- `whistle-signal` artık nötr arka planlı yakın plan; nukleer-patlama-sonrasi #9 için enkaz bağlamı isteniyorsa mevcut `deprem-enkaz-vurma` resmi kullanılabilir (rehber değişikliği). Not: `deprem-enkaz-vurma` tarifinde de "3×" etiketi var; raporda bildirilmedi ama aynı tutarlılık için gözden geçirilmeli.
- hayatta-kalma-dugumler: düğüm resimlerinin ip geçişleri (sekiz, izbarço, camadan, ıskota, kazık) bir denizci ya da izci eğitmenince kare kare kontrol edilmeli (hayatta-kalma-ab raporu). Somut hata bildirilmedi.
- ulasim-ariza-aku: `ulasim-aku-kirmizi` 1=dolu, 2=boş sırasını gösteriyor; uzman sırayı "önce boş akü" yaparsa resim de yeniden çizilmeli.
- Bu listede resimler yalnızca tarif (spec) düzeyinde düzeltildi; sahne dosyaları ve rehberler değiştirilmedi.

## Son QA'da bulunan çizim sorunları (ikinci tur)

| Çizim | Rehber | Adım | Sorun |
|---|---|---|---|
| hava-buz-noktalari | sicak-carpmasi | 6 | Kollar omuzun üstünden çıkıyor, gövde çok kısa; buz paketleri boyun/koltuk altı/kasık yerine göğüs ve kalçada gibi duruyor. Küçük, isteğe bağlı. |
| ilk-yardim-cocuk-kpr-tek-el | ilk-yardim-cocuk-kpr | 5 | Kurtarıcının dizi/bacağı çocuğun gövdesinin üstünde duruyor; çocuğun üstüne diz çökmüş gibi görünüyor. Bası yapan kol tam dik değil. Kurtarıcı çocuğun yanında diz çökmeli, el topuğu alt sternumda olmalı. |
| ilk-yardim-bebek-kpr-tek-el | ilk-yardim-bebek-kpr | 8 | Bası yapan el topuğu göğsün üst kısmında, boyna yakın duruyor. Metin "aynı noktaya" (alt sternum, meme uçlarının hemen altı) diyor. El aşağı taşınmalı. Bebeğin yüz yönü de biraz garip. |
| no-elevator | nukleer-patlama-sonrasi | 2 | Kişi merdiveni yukarı çıkar gibi sağa dönük, ok ise aşağı-sola gösteriyor; aşağı inerek tahliye net değil. Kişi aşağı inerken çizilmeli. |
| ilk-yardim-bebek-gogus-basisi | ilk-yardim-bebek-bogulma | 6 | Hafif: eller göğsü sarıyor, ama iki başparmağın göğüs kemiğinin alt yarısında olduğu net seçilmiyor. Bilek/el tek bir elin yukarıdan bastırması gibi okunabiliyor. |
| ozel-gruplar-sandalye-merdiven | ozel-gruplar-engelli-hareket | 6 | Alttaki yardımcı sandalyeyi ön çerçeveden/ayaklık yakınından tutuyor; bu, 5. adımdaki "kolçak ya da ayaklıktan tutup kaldırmayın" uyarısıyla çelişiyor. Üstteki yardımcının elleri de tutamaklara tam değmiyor. |
| psikoloji-cocuk-karin-agrisi | psikoloji-cocuk-stres-belirtileri | 4 | Ağrı çizgileri karında değil dizlerin yanında duruyor; karın ağrısı yerine diz ağrısı ya da yara gibi okunuyor. |
| ozel-gruplar-isitme-dikkat | ozel-gruplar-engelli-gorme-isitme | 5 (küçük) | İşitme engelli kişinin kulağının yanında ses dalgaları var; kişi sesi duyuyormuş gibi görünüyor. Bunun yerine dokunma ya da dikkat işareti olmalı. |
| psikoloji-ayak-yere | psikoloji-panik-atak | 5 (isteğe bağlı) | Kişinin başı kadrajın dışında kalıyor. |
| yaralanma-omurga-kimildatma | yaralanma-omurga | 2 | Yardım eden kişi yaralının göğsünün üstüne çömelmiş/oturmuş, eli göğsünde görünüyor. Omurga şüphesinde yanlış izlenim veriyor; yaralının yanında diz çöküp konuşan biri çizilmeli (köşedeki "taşımayın" kutusu doğru). |
| ulasim-su-cocuk | ulasim-suya-dusen-arac | 5 | "1" ve "2" rozetleri cam ve koltuk üstünde; büyük çocuğun önce çıkarıldığı sıra okunmuyor. Rozetler büyük çocuk (1) ve küçük çocuk (2) üstüne konmalı. |
| lie-cover-blanket (isteğe bağlı) | yanik | 6 | Sahne yol kenarı ve bütün vücut örtülü; yanık rehberi için iç mekân ve yanık bölgeyi açıkta bırakan bir örtme sahnesi daha uygun olur. |
