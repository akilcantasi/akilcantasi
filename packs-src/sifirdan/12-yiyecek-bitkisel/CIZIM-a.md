# 12-yiyecek-bitkisel: çizim raporu (a, batch sc-12)

Toplam 56 sahne: 53 rehber sahnesi ve 3 kategori kapağı. Paketteki 21 rehberin hepsi bu partide. Hiçbir rehberde 3'ten fazla çizim yok. Derleme uyarısı yok, `check-sifirdan` sonucu "hata yok", tsc temiz.

## İlke (kullanıcı isteği)
- Çizimler tanıma kartı değildir. Yenen bitkiler bilerek şematik çizildi.
- Bitki-bitki karşılaştırmalarında yenen tarafa yeşil onay konmadı. Zehirli tarafta büyük kırmızı yasak var, altta da "EMİN DEĞİLSEN YEME" şeridi (`Emin` yardımcısı). Bu kural 9 sahnede uygulandı: çiriş, güzelavrat, salkım, çam-porsuk, tere-baldıran, rezene-baldıran, zakkum-defne, liken, delice.
- Yeşil onay yalnız yer ya da işlem seçiminde kullanıldı: yosun için temiz kıyı, şehirde park ortası, iç kabuk.
- Mürdümük: yalnız bitki ile büyük uyarı üçgeni çizildi, bir de "yalnız mürdümük tabağı" büyük yasakla. Kaynatma sahnesi ve karışık "doğru tabak" çizilmedi. Avuçta tane de yok.
- Termiye (acı bakla) için hiç sahne yok.

## Oyuncular (scenes-a.tsx, CAST)
- Toplayıcı: başörtülü kadın, buğday ten, camgöbeği uzun kollu üst, haki pantolon. Bütün toplama sahnelerinde ve ellerde (HT) o görünür.
- Bilen yaşlı: yalnız işaret eden eli var (esmer, mor kol). Çiriş sahnesinde kullanıldı.
- Çocuk: kız, kumral at kuyruğu, hardal üst. Çocuk rehberinde ve elde (HC) kullanıldı.
- Yürüyüşçü: bıyıklı esmer adam, kiremit mont. Kar rehberinde kullanıldı.
- Malzeme renkleri `C` sabitinde sabit tutuldu: toprak, çamur, kabuk, iç kabuk, kar, tane.

## Null yapılanlar (spec satırları duruyor, guides.ts'te null)
- sf-ybt-menengic: küçük kırmızı/siyah taneler "tanımadığın taneyi yeme" mesajıyla çelişir.
- sf-ybt-sehir-yikama: düşük değerli bir adım.
- sf-ybt-misir-ovma: düşük değerli bir adım.
- sf-ybt-murdumuk-kaynatma: "yenir" izlenimi verir.
- sf-ybt-kar-govde: mont içindeki torba anlaşılır çizilemez.

## Sadeleştirilen spec'ler
Sadeleştirilen sahnelerin spec açıklamaları çizime göre güncellendi. Kaldırılanlar şunlar:
- karşılaştırmalardaki yeşil onaylar;
- kapaklardaki onaylar ve kişiler;
- tatula'daki çocuk eli;
- çöplemedeki yabani sarımsak çerçevesi;
- göl köpüğündeki köpek;
- tere sahnesindeki koyun;
- çocuk-ağız sahnesi: "parmakla çıkarma" yerine yetişkin + 114 telefonu + torbada bitki parçası.

## Kalan şüpheler
- cam-fistigi: kozalak kabaca çizildi ama tanınıyor.
- cocuk-agiz: ağızdan parça çıkarma anı çizilmedi. Adım metni bunu anlatıyor.
- tatula: boru çiçeğin ucu yasak halkasının dışına taşıyor.
- su-baldirani: kök kesiti çerçevesi küçük.
- ilkbahar: çiriş ile acı çiğdem kasıtlı olarak benzer çizildi; mesaj "yalnız bilen ayırır". Uzmanın gözden geçirmesi iyi olur.
