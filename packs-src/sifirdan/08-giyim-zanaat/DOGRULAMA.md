# Sıfırdan: Giyim ve zanaat — bağımsız doğrulama

Tarih: 2026-11-02. Paket: `sifirdan-giyim-zanaat`, 45 rehber, 6 kategori.
Denetim: `npx -y tsx tools/check-sifirdan.ts 08-giyim-zanaat` → hata yok. `tsc --strict` temiz.
Kullanılan WebSearch: 7 (sınır 25). Doğrulama ağırlıkla WebFetch ile yapıldı.

Erişilemeyenler: mevzuat.gov.tr (robots engeli), FM 21-76 tam metni (archive.org hata verdi), coldwatersafety.org, CDC şarbon sayfası, Alaska sağlık PDF'si, 4915'in tam metni. Bunlara dayanan hiçbir şey "teyitli" diye yazılmadı.

## Sayım
- TEYİTLİ: 31
- DÜZELTİLDİ: 12 (sal dahil)
- ZAYIF KALDI: 3 (sal, kızak, kürek; sal hem düzeltildi hem zayıf kaldı, kızak ve küreğe yalnız yasal not eklendi)
- ÇIKARILDI: 0

## Yasaklar denetimi
- Silah, mermi, barut, patlayıcı: yok. "mermi, barut, mızrak, ok ucu, kılıç, silah, sapan" araması boş döndü. Döküm rehberi yalnız olta ve ağ ağırlığıyla sınırlı. "Yay tornası" bir ağaç işleme aletidir, silah değil. Bıçak yalnız alet olarak geçiyor (eğeden bıçak, taş yonga).
- İçki tarifi ve ilaç dozu yok.
- Yasal ya da sağlık riski olan rehberlerde `note` var. Yeni eklenen notlar aşağıda.

## Rehber başına sonuç

### Metal işleri
- **sf-gz-dokum — DÜZELTİLDİ.** Su ve buhar patlaması (1600 kat genişleme), ön ısıtma ve kapalı kap tehlikesi Foundry Magazine'den teyit edildi. Hobi dökümünden eve kurşun taşınması CDC'den teyit edildi. Açık havada çalışma, gebe, emziren ve çocukların uzak tutulması, mutfak ve bahçeden uzaklık ve kuru süpürmeme HealthyWA ve Oregon OHA'dan teyit edildi. Kurşun buharının belirginleştiği sıcaklık için kaynak bulunamadı; bu yüzden metinde sayı yok.
- **sf-gz-su-verme — DÜZELTİLDİ.** Yağ hacmi, ön ısıtma sıcaklığı, tam daldırma ve göz koruması eklendi. Kaynak uygulayıcı forumları (ABS, IForgeIron); resmî değil.
- **sf-gz-demirci-ocagi — DÜZELTİLDİ.** Yanık ilk yardımı NHS'ten eklendi. Ocak ölçüleri ve örs yüksekliği kaynaksız genel bilgi, ama güvenlik açısından kritik değil.
- **sf-gz-dovme — TEYİTLİ.** Renk ve sıcaklık tablosu yaklaşık; metin "kaba" diyor. Göz, yanık ve "siyah demir de yakar" uyarıları var.
- **sf-gz-hurda-alet — TEYİTLİ.** Galvaniz dumanı, kapalı kap ve kurşun içeren boya uyarıları yeterli. Küçük parçayı suda sertleştirip deneme yöntemi su verme rehberiyle çelişmiyor: o yöntem yalnız deneme parçası için.

### Çömlek ve yapıştırıcı
- **sf-gz-odun-katrani — DÜZELTİLDİ.** Odun katranının genotoksik PAH (benzo(a)piren) içerdiği AB SCCNFP/0646/03'ten, kreozotun olası insan kanserojeni sayıldığı ATSDR'den teyit edildi. Eldiven, cilt teması ve tutuşma uyarıları eklendi. Ayrıca nemli toprak kabın patlayabileceği uyarısı eklendi.
- **sf-gz-sir — DÜZELTİLDİ (küçük).** Kurşun içeren sır yasağı tam ve FDA'dan teyitli: yıkama ve kaynatma kurşunu gidermez, el yapımı, eski ve turuncu, kırmızı ya da sarı süslü çömlek risklidir, cenini etkiler. Nota anne karnındaki bebek eklendi.
- **sf-gz-comlek-pisirme, sf-gz-kil-hazirlama, sf-gz-comlek-sekil, sf-gz-tutkal — TEYİTLİ.** Ön ısıtma, tam kurutma ve sıcak çömleğe su dökmeme uyarıları var. 600 °C eşiği yazarın iki kaynağıyla tutarlı.
- **sf-gz-recine — TEYİTLİ.** Tutuşma uyarıları yeterli. 6831 Md. 14/B (reçine) teyit edildi.

### Deri ve giysi
- **sf-gz-tabaklama-kul — DÜZELTİLDİ.** Göze kaçmada yıkama süresi ATSDR'nin alkali önerisine göre uzatıldı. Okuyucuyu çıplak parmakla dokunmaya yönelten "kayganlık testi" kaldırıldı. NIOSH ilk yardım kaynağı eklendi. Kül/su oranı kaynaklarda yok; kıvamla tarif edilmeye devam ediyor.
- **sf-gz-deri-yuzme — DÜZELTİLDİ.** Şarbon uyarısı Agriculture Victoria'dan eklendi: aniden ölmüş ya da ağzından, burnundan kan gelen hayvan açılmaz. 4915 notu var. Kanunun tam metni açılamadı; avcılık belgesinin 4915 Md. 13'e dayandığı yönetmelikten (FAOLEX) dolaylı olarak görüldü.
- **sf-gz-tabaklama-mese — TEYİTLİ.** 6831 notu teyit edildi.
- **sf-gz-dikis-yama, sf-gz-ham-deri, sf-gz-carik, sf-gz-kece, sf-gz-kis-giysisi — TEYİTLİ.** Çarık ve keçe pay oranları kaynaksız, ama güvenlik riski taşımıyor.

### Lif, ip ve dokuma
- **sf-gz-yun-yikama, sf-gz-kirmen, sf-gz-isirgan-kenevir, sf-gz-halat, sf-gz-dokuma-tezgahi, sf-gz-orgu, sf-gz-bitki-boyasi, sf-gz-hasir-kilim — TEYİTLİ.** El yapımı halatın insan taşımada kullanılmaması uyarısı var. Kenevir notu 2026 haberine dayanıyor.
- **sf-gz-ihlamur-kabugu — TEYİTLİ.** 6831 Md. 14 hem kabuğu (B bendi) hem ıhlamur çiçeğini (C bendi) kapsıyor; not doğru.

### Ağaç, taş ve sepet
- **sf-gz-tas-alet — TEYİTLİ.** Silikoz ve göz uyarısı var.
- **sf-gz-kemik-boynuz — DÜZELTİLDİ.** 4915 notu eklendi; geyik gibi türler korunuyor. Oluk-kama yöntemi hâlâ kaynaksız.
- **sf-gz-agac-oyma, sf-gz-kasik-kase, sf-gz-alet-sapi — DÜZELTİLDİ.** Ağaç ve dal kesildiği için 6831 notu eklendi.
- **sf-gz-civisiz-birlestirme, sf-gz-bileme, sf-gz-sepet, sf-gz-yay-tornasi — TEYİTLİ.** Kaydırma miktarı (2–3 mm) kaynaksız, ama kritik değil.

### Taşıt ve taşıma
- **sf-gz-sal — DÜZELTİLDİ, ZAYIF KALDI.** Not yeniden yazıldı. Ayrı bir soğuk su adımı eklendi: soğuk şok, akıntıya kapılınca sırtüstü ve ayaklar önde yüzmek. Soğuk şok ve can yeleği NOAA NWS'ten, akıntıdaki vücut duruşu FM 21-76'nın 1968 baskısından alıntılanan bir kaynaktan teyit edildi. Can yeleği zorunlu hale getirildi. Kıyıda bekleyen biri, ipi bedene bağlamama ve yanında bıçak bulundurma eklendi. Yüzerlik testi tutucu hale getirildi. Kütük ölçüleri ve çapraz sırık yöntemi hâlâ birincil kaynaksız.
- **sf-gz-kizak — ZAYIF KALDI (6831 notu eklendi).** Tek kaynak var. Buz üstünden geçmeme uyarısı yerinde.
- **sf-gz-kurek — ZAYIF KALDI (6831 notu eklendi).** Tek kaynak var. Ölçüler güvenlik açısından kritik değil.
- **sf-gz-tekerlek, sf-gz-el-arabasi-kagni — TEYİTLİ.** Kaynaklar zayıf, ama ciddi bir risk iddiası yok. Ezilme ve frensiz iniş uyarıları var.
- **sf-gz-bisiklet-lastik, sf-gz-bisiklet-bakim — TEYİTLİ.** Fren ayarı kaynaksız, ama standart işlem.

## Değişiklikler: önce → sonra
1. **Döküm, adım 1**
   - Önce: "Çocukları, hamileleri ve hayvanları uzak tutun."
   - Sonra: "evden, mutfaktan, sebze bahçesinden ve kuyudan uzakta … Çocukları, hamile ve emziren kadınları … yaklaştırmayın."
2. **Döküm, yeni adım 6** (art dizisine null eklendi): Eski lehim, boru kurşunu ve "kalay" alaşımlarının çoğu kurşun içerir. Akü plakası, galvanizli ve boyalı parça eritilmez. Cüruf kuru demir kaşıkla alınıp kapalı kaba konur.
3. **Döküm, kalıp**
   - Önce: "kuru kumdan, taştan ya da pişirilmiş kilden"
   - Sonra: "kuru kum, sabuntaşı gibi kuru taş ya da pişirilmiş kil. Dere taşı ve ıslak yerden alınmış taş içinde su tutar; erimiş metal değince patlayabilir."
4. **Döküm, son adım**
   - Önce: "iş giysilerini ayrı yıkayın"
   - Sonra: "iş giysisi ve ayakkabıyı eve sokmayın … kuru süpürmeyin, ıslak bezle silin … pota, kepçe ve kalıbı yalnız döküme ayırın."
5. **Döküm, not:** "çocuklarda" → "çocuklarda ve anne karnındaki bebekte".
6. **Su verme, adım 3**
   - Önce: "metal bir kaba … hafifçe ılıtın"
   - Sonra: "kapaklı metal kap; yarım kilo çelik için en az 4 litre; yanmaz zemin; yaklaşık 50 °C, daha fazla ısıtmayın."
7. **Su verme, adım 5**
   - Önce: "hemen yağa dik daldırın"
   - Sonra: "gözlük, eldiven, deri önlük ve uzun maşa; hemen ve tamamen daldırın; yarısı dışarıda kalan kızgın çelik yağı tutuşturur."
8. **Kül suyu, adım 3**
   - Önce: "Kül suyu parmaklar arasında kaygan hissettirir"
   - Sonra: "sabun gibi kaygandır … Çıplak parmakla dokunarak denemeyin. Yanınızda bir kova temiz su bulundurun."
9. **Kül suyu, yasaklar**
   - Önce: "göze kaçarsa … en az 15 dakika"
   - Sonra: "göz kapağını açık tutup en az 30 dakika … sağlık görevlisine ulaşın; deriye değerse kayganlık geçene kadar yıkayın."
10. **Odun katranı, not:** "zehirli ve yanıcıdır" → "zehirli, yanıcıdır ve kanser yapıcı maddeler içerir".
11. **Odun katranı, adım 7**
    - Önce: "kısık ateşte biraz koyulaştırın"
    - Sonra: "eldivenle … korun kenarında, kapağı yanınızda tutarak … Cildinize değen katranı hemen silip sabunla yıkayın."
12. **Odun katranı, yasaklar:** Çocuk oyuncağına ve beşiğe sürmeme uyarısı eklendi. Nemli toprak kabın patlayacağı uyarısı eklendi.
13. **Sır, not:** "anne karnındaki bebek" eklendi.
14. **Demirci ocağı, yasaklar:** "Yanığa yağ, tereyağı ya da krem sürmeyin; hemen 20 dakika serin akan suda soğutun." eklendi.
15. **Sal, not**
    - Önce: "Uzman gözetimi olmadan akıntılı nehirde ve denizde sal kullanmayın."
    - Sonra: "… can yeleği ya da sağlam yüzdürücü olmadan ve tek başınıza suya açılmayın" ve 6831 cümlesi.
16. **Sal, adım 1:** bent, deniz ve rüzgârlı gün yasağı ile kıyıda bekleyen biri eklendi.
17. **Sal, adım 2:** "yarıdan çoğu su üstünde" → "en az yarısı su üstünde; daha çok batan kütüğü kullanmayın".
18. **Sal, adım 7:** "Can yeleği ya da bağlı boş bir bidon gibi yüzer bir şey takın" → "herkes can yeleği giysin … çocuk ve yüzme bilmeyen için şart".
19. **Sal, yeni adım 8:** soğuk su ve suya düşme. Art dizisine null eklendi.
20. **Sal, adım 9**
    - Önce: "Kıyıya bağlı bir iple çalışmak en güvenli yoldur."
    - Sonra: "Durgun suda kıyıdaki kazığa uzun iple … İpi asla belinize ya da bileğinize bağlamayın … bıçak bulundurun."
21. **Sal, yasaklar:** kimse can yeleği ya da yüzdürücü olmadan binmez; kişi ya da çocuk iple sala bağlanmaz.
22. **Deri yüzme, yasaklar:** şarbon ve "aniden ölmüş ya da ağzından, burnundan koyu kan gelen hayvanı açmayın" eklendi.
23. **6831 notu (ORMAN_NOTU) eklendi:** kızak, kürek, kaşık-kase, ağaç oyma, alet sapı.
24. **4915 notu eklendi:** kemik ve boynuz.
25. **Kaynaklar:** 6831 notlu rehberlere Orman Kanunu Md. 14 metni eklendi. Bütün `checked.note` alanları "Bağımsız doğrulama: …" diye yenilendi. Yeniden açılmayan kaynaklar notta açıkça belirtildi.

## Uzmana gidecek liste
1. **Su kurtarma uzmanı (AFAD, JAK, Kızılay su güvenliği):** sal rehberinin tamamı, özellikle kütük ölçüleri, çapraz sırık bağlama ve kıyıya iple bağlı çalışma.
2. **İş sağlığı ya da toksikolog:**
   - kurşun dökümünde güvenli üst sıcaklık;
   - açık havada maske gereği;
   - "kalay" hurdasının kurşun içeriği;
   - odun katranı üretiminde maruziyet.
3. **Demirci:**
   - yağla su vermede kanola yağının ~50 °C'ye ılıtılması ve yarım kiloya 4 litre kuralı;
   - bilinmeyen hurda çelikte yağın tercih edilmesi;
   - ocak ve örs ölçüleri.
4. **Göz doktoru ya da zehir danışma (114 UZEM):** kül suyunun göze kaçmasında 30 dakika yıkama ve sonrası.
5. **Hukukçu:**
   - 6831 Md. 14 ve 91'in güncel metni (doğrulamada kullanılan qsl.net kopyası 1988 değişikliklerine kadar güncel; mevzuat.gov.tr açılamadı);
   - 4915'te avlanma izni ve geyik boynuzu toplamanın durumu;
   - kenevir notunun dayandığı 2026 düzenlemesi.
6. **Etnografya:** kağnı ve hasır için Türkçe kaynak.
7. **Kızak ve kürek:** ikinci bir kaynak bulunmalı.
