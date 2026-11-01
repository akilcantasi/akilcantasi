# Sıfırdan: Yiyecek saklama — BAĞIMSIZ DOĞRULAMA

Tarih: 2026-11-02. Paket: 02-yiyecek-saklama (39 rehber, 4 kategori). Denetim: `npx -y tsx tools/check-sifirdan.ts 02-yiyecek-saklama` → hata yok.
Arama: 5 WebSearch (kota 25). Doğrulama esas olarak WebFetch ile yapıldı. İlke: kaynaklar çeliştiğinde en tutucu değer alındı.

Sayım: DÜZELTİLDİ 21 · TEYİTLİ 8 (2'si bu turda kaynak yeniden açılarak, 6'sı yazar kaynağına dayanarak) · ZAYIF KALDI 10 · ÇIKARILDI 0.

## Bu turda gerçekten açılan kaynaklar
- CDC — Botulism: Home-canned foods (10 dk kaynatma + her 1000 ft için 1 dk; asla tatma; sarımsaklı/otlu yağ buzdolabında, 4 günde at)
- NCHFP — Identifying and Handling Spoiled Canned Food (şüpheli kap: kapalıysa torba, açıksa 30 dk kaynatarak zararsızlaştırma; 1 çamaşır suyu : 5 su, 30 dk; eldiven)
- NCHFP — Ensuring Safe Canned Foods (domates ve incir pH 4,6 sınırında, asitlendirme şart)
- NCHFP blog — domates asitlendirme (litrelik kavanoza 2 yk şişe limon suyu / ½ çk sitrik asit / 4 yk %5 sirke)
- K-State Extension — taze limonun asitliği değişken, şişe limon suyu standart
- WHO — Botulism (12–36 saat, 4 saat–8 gün; toksin >85 °C 5 dk; sporlar saatlerce kaynamaya dayanır; sosis, jambon, tuzlu/tütsü balık riskli)
- WHO — Brucellosis (çoğu vaka çiğ süt ve taze peynirden; pastörizasyon temel önlem; salamuranın etkisi hakkında bilgi yok)
- CDC — Trichinellosis prevention (tuzlama, kurutma, tütsü güvenilmez; domuzda 15 cm altı -15 °C 20 gün; yaban hayvanında dondurma güvenilmez)
- NCHFP — Jerky (¼ inç, buzdolabında marine, 5 dk kaynatma, 60 °C, 10–24 saat/3 saat, bükme testi, 2 hafta; domuz/av eti -18 °C 30 gün)
- USDA FSIS — Smoking meat and poultry (tütsülük 107–150 °C; kanatlı 74 °C; kıyma 71 °C)
- Alaska Üniv. Extension — Smoking fish (180 g/L, 71 °C 30 dk, soğuk tütsü ≤32 °C, 3 °C altında 10–14 gün, oda sıcaklığında asla; -18 °C’de 2 hafta parazit)
- Hong Kong CFS — parazit dondurma (FDA -20 °C 7 gün ya da -35 °C 15 saat; AB -20 °C 24 saat; marine ve soğuk tütsü paraziti öldürmez)
- NCHFP — Fermented dill pickles (≈75 g/L tuz + 30 ml/L %5 sirke; sıcaklık-süre)
- UCCE Master Food Preservers — Curing olives (UC ANR 8267’ye dayanır; 8267’nin kendisi açılamadı)
- TÜRKPATENT — Kayseri Pastırması CI belgesi (tüm sayılar nitritli kür tuzuyla)
- Clemson HGIC — Drying foods (sebzenin dışarıda kurutulması önerilmez; sebze ömrü meyvenin yarısı)
- FAO Bull. 109 — Sealed stores (nem %12–13; böceklerin kesin ölümü yalnız fümigasyonla)

Açılamayanlar: FDA Fish Hazards Guide bölüm 5 (PDF’de bölüme ulaşılamadı; değerler Hong Kong CFS derlemesinden), UC ANR 8267 PDF (site hatası), CDC Brucellosis sayfası (site hatası), Türkiye tuz üretimi mevzuatı (aramada net metin yok).

## Rehber başına sonuç

### Et ve balık
- **sf-ys-et-guvenligi — DÜZELTİLDİ.** Domuzu dondurma değeri daha tutucu NCHFP değerine çekildi. "Çiğ yenecek ürünler (… sucuk …)" ifadesi sucuk rehberiyle çelişiyordu; düzeltildi. `note` eklendi.
  - Önce: "15 cm’den ince parçaları -15 °C’de en az 20 gün dondurun." → Sonra: "15 cm’den ince parçaları -18 °C ya da daha soğukta en az 30 gün dondurun; yine de iyice pişirin."
  - Önce: "Çiğ yenecek ürünleri (pastırma, sucuk, kuru et) yalnız sığır…" → Sonra: "Pastırma ve kuru eti yalnız sığır, dana, koyun ya da keçi etinden yapın. Ev yapımı sucuğu hangi etten olursa olsun pişirerek yiyin."
- **sf-ys-et-kurutma — DÜZELTİLDİ (küçük).** NCHFP marinasyonu buzdolabında yapıyor. Önce: "Serin yerde 1–2 saat…" → Sonra: "En serin yerinizde (mümkünse 4 °C altında) 1–2 saat…". `note` eklendi (kaynatma adımı atlanmasın). Diğer bütün sayılar NCHFP’yle teyitli.
- **sf-ys-pastirma-1 — DÜZELTİLDİ (note).** CI sayıları teyitli, ancak hepsi nitritli kür tuzuna ait (1 ton ete 60–80 kg nitritli tuz). Önce note: "…mümkünse pişirerek yiyin." → Sonra: "…kür tuzsuz yaptığınız pastırmayı her zaman pişirerek yiyin."
- **sf-ys-pastirma-2 — DÜZELTİLDİ.** Önce: "Serin yerde (0–4 °C ideal) saklayın; böyle 3–4 ay dayanır." → Sonra: "Nitritli pastırma böyle 3–4 ay dayanır; kür tuzsuz ya da daha ılık yerde duran pastırmayı çok daha kısa sürede ve pişirerek tüketin." `note` eklendi.
- **sf-ys-kavurma — DÜZELTİLDİ (ZAYIF yönü sürüyor).** Yağ altı havasız ortam; sporlar pişirmede sağ kalıyor. Oda sıcaklığında güvenli süreyi veren hiçbir kaynak yok.
  - Önce: "kış kileri gibi 10 °C altı" → Sonra: "olabildiğince soğuk, 4 °C’ye yakın … 10 °C’yi geçen yerde saklamayın."
  - Önce: "tavada … en az 5 dakika iyice ısıtın" → Sonra: "alacağınız kadarını … her parçası cızırdayarak ya da kaynayarak en az 10 dakika ısıtın. Kalın parçaları bölün." (CDC’nin az asitli ev konservesi için 10 dk kuralı.)
  - note botulizm adıyla güçlendirildi. Kaynaklarda FSIS Smoking yerine CDC.
- **sf-ys-sucuk — TEYİTLİ.** Zaten en tutucu yol (kür tuzsuz kuru sucuk yapma, her zaman pişir). Sayı yok.
- **sf-ys-balik-tuzlama — DÜZELTİLDİ.** AB değeri (-20 °C 24 saat) yerine FDA değeri alındı.
  - Önce: "(-20 °C’de en az 24 saat)" → Sonra: "-20 °C’de en az 7 gün ya da ev dondurucusunda (-18 °C) en az 2 hafta… tuz onları güvenle öldürmez."
- **sf-ys-balik-kurutma — DÜZELTİLDİ (ciddi).** Son adım, sirkeyle "çiğ" tüketimi ima ediyordu. Marine etme paraziti öldürmez.
  - Önce: "Yemeden önce ateşte iyice ısıtın; çiroz gibi dövüp sirkede birkaç saat bekletebilirsiniz." → Sonra: "Kuru balıkta parazit canlı kalabilir; tuz, kurutma ve sirke onları güvenle öldürmez. … içi iyice pişene kadar … (termometre varsa en az 63 °C). Çiroz gibi sirkeye ancak pişirdikten sonra yatırın."
  - `dont`a histamin ve "sirke paraziti öldürmez" eklendi. `note` eklendi (eksikti).
- **sf-ys-tutsuleme — DÜZELTİLDİ.**
  - "içi en az 71 °C" → "en az 71 °C (tavuk ve diğer kanatlıda 74 °C)".
  - Önce: "Balığı önceden dondurmadıysanız ürünü çiğ yemeyin, pişirin." → Sonra: "Soğuk tütsülenmiş ürün çiğdir; parazit ve mikrop taşıyabilir. Her zaman pişirerek yiyin." (Listeria ve botulizm riski için dondurma yetmez.)
  - Önce: "Çok soğukta 10–14 gün" → Sonra: "3 °C’nin altında 10–14 gün … böyle bir soğuk yoksa hemen yiyin…".
- **sf-ys-tutsu-firini — DÜZELTİLDİ.** Termometresiz ilkel düzenekte pişme garanti değil. Önce: "Termometreniz varsa içeriyi ölçün." → Sonra: "Termometreniz yoksa ürünün piştiğinden emin olamazsınız; … yemeden önce ayrıca iyice pişirin." Yangın ve karbonmonoksit için `note` eklendi. Çadır ölçüsü yok (ZAYIF, yapısal).

### Meyve, sebze, fermente
- **sf-ys-botulizm — DÜZELTİLDİ (ciddi).**
  - Domates ve incir: Önce: "limon suyu ya da sirke ekleyin" (miktar yok) → Sonra: "1 litrelik kavanoza 2 yemek kaşığı şişe limon suyu ya da yarım çay kaşığı limon tuzu ya da 4 yemek kaşığı %5’lik sirke… Taze limonun ve ev sirkesinin asitliği belli değildir; bunlarla yaptığınızı az asitli sayın."
  - Yağda sarımsak: Önce: "soğukta tutun ve birkaç gün içinde yiyin" → Sonra: "4 °C altında tutun ve 4 gün içinde bitirin; böyle bir soğuk yeriniz yoksa hiç yapmayın."
  - Şüpheli kap: Önce: "tatmadan atın. Dökerken eldiven giyin" → Sonra: "…tatmadan atın; kaynatıp kurtarmaya çalışmayın. Kapalıysa kalın torbaya koyup … derin gömün. Açılmışsa kabı içindekiyle 30 dakika kaynatıp öyle atın. … 1 ölçü çamaşır suyuna 5 ölçü su … 30 dakika."
  - Kaynatma: Önce: "kapakta sorun yoksa da en az 10 dakika fokur fokur kaynatın" → Sonra: "Kapağı sağlam görünen … az asitli konserveyi ve domates konservesini de … en az 10 dakika … 300 metrenin üstünde her 300 metre için 1 dakika ekleyin." Türkiye’de yüksek yaylalar için önemli.
  - Belirti süresi: "12–36 saat" → "genelde 12–36 saat (4 saat ile 8 gün arası)".
  - `dont`a "Şüpheli konserveyi kaynatarak kurtarıp yemeyin" eklendi. Kaynak olarak NTV yerine CDC ve NCHFP alındı.
  - Not: "derin gömme", ABD kaynaklarının "çöpe ya da çöp sahasına" önerisinin çöp hizmeti olmayan duruma uyarlamasıdır.
- **sf-ys-meyve-kurutma — TEYİTLİ.** Clemson yeniden açıldı; bütün sayılar tutuyor.
- **sf-ys-sebze-kurutma — DÜZELTİLDİ.** Clemson’a göre sebzenin ömrü meyvenin yarısı. Önce: "6–12 ay dayanır" → Sonra: "Serin yerde yaklaşık 6 ay dayanır; sıcak yerde daha kısa."
- **sf-ys-pestil-kome — TEYİTLİ** (yazar kaynağı; bakır uyarısı doğru).
- **sf-ys-pekmez — TEYİTLİ** (yazar kaynağı: CI’deki 200 kg’a 2–3 kg oranı 10–15 g/kg’a doğru çevrilmiş).
- **sf-ys-tursu — DÜZELTİLDİ.** NCHFP’nin test edilmiş oranı FAO’nun %3–5’inden daha tuzlu.
  - Önce: "1 litre suya 50 g tuz (yaklaşık %5)… İsterseniz litreye 30 ml sirke" → Sonra: "1 litre suya 75 g tuz (yaklaşık %7,5)… Sirkeniz varsa litreye 30 ml ekleyin." Özet ve spec etiketi ("1 L + 75 g") güncellendi.
- **sf-ys-salamura — TEYİTLİ** (yazar kaynağı FAO; %6–10 → %16 tutucu).
- **sf-ys-zeytin — DÜZELTİLDİ (baştan yazıldı, 8 adım ve art düzeni korundu).** Eski metinde iki tehlikeli nokta vardı. Suyla tatlandırılmış zeytin "salamurada bırakın, uzun dayanır" diye rafta saklanıyordu; oysa UC kaynağına göre bu zeytin rafta dayanmaz, buzdolabı ister. Ayrıca kürleme gazı "kapak kabarmışsa atın" kuralıyla karışıyordu.
  - Salamura: Önce: "1 litre suya yaklaşık 100 g (%10)" → Sonra: "önce 60 g/L, 7 gün sonra 120 g/L; en az 2 ay, ayda bir yenileme".
  - Kuru tuz: oran eklendi: "2 kg zeytine 1 kg tuz, üstte 2–3 cm tuz, 5–6 hafta, sonra 10 kg’a 1 kg tuz; serinde 1 ay, daha uzun saklamak için 4 °C altı".
  - Suyla tatlandırma: "en az 1 hafta, sonra 120 g/L; rafta dayanmaz, 4 °C altı; soğuk yeriniz yoksa bu yolu seçmeyin".
  - `dont`a "kaynar suda zeytin konservesi yapmayın (az asitli, basınçlı kap ister)" eklendi. Spec etiketi "%10" → "1 L + 120 g".
- **sf-ys-sirke — ZAYIF KALDI.** Yapım süresi ve sıcaklığı kaynaksız; metanol uyarısı ve "ev sirkesine konserve güvenliği dayandırmayın" uyarısı yerinde. Yasak kuralına uygun.
- **sf-ys-tarhana — ZAYIF KALDI.** Oran yok; 10 dk kaynatma uyarısı tutucu.

### Süt ürünleri
- **sf-ys-sut-kaynatma — DÜZELTİLDİ (note).** WHO Brucellosis ile teyit edildi; eksik olan `note` eklendi.
- **sf-ys-yogurt — TEYİTLİ** (yazar kaynağı FAO; 80 °C ısıtma Brusella’ya karşı da yeterli).
- **sf-ys-kurut-kes — ZAYIF KALDI.** Sayı yok; "çiğ sütten yapmayın" uyarısı var.
- **sf-ys-peynir-1 — DÜZELTİLDİ.** Termometre yoksa ne yapılacağı eksikti. Eklendi: "Termometreniz yoksa sütü kaynatın; peynir daha zayıf tutar ama güvenlidir. Çiğ sütle peynir yapmayın." `note` eklendi.
- **sf-ys-peynir-2 — DÜZELTİLDİ (ciddi).** Eski `dont`, salamurada bekletmenin çiğ süt peynirini güvenli yaptığını ima ediyordu.
  - Önce: "Çiğ sütten yapılan peyniri birkaç günlükken yemeyin." → Sonra: "Çiğ sütten peynir yapmayın. Salamurada haftalarca, aylarca bekletmek Brusella ve Listeria’yı güvenle öldürmez."
  - note "salamurada bekletilse bile" diye güçlendirildi. %12–14 salamura oranı doğrulanamadı; bu oran güvenlik için değil tat için.
- **sf-ys-lor-cokelek — DÜZELTİLDİ.** Çökelek "ılık-sıcak" ısıtılıyordu; çiğ süt ayranında bu yetmez.
  - Önce: "ayranı ya da ekşimiş sütü ılık-sıcak ısıtın" → Sonra: "…karıştırarak kaynayana kadar ısıtın… Çiğ sütten gelen ayranı ılık ısıtmak yetmez; mutlaka kaynatın."
- **sf-ys-tereyagi-sadeyag — DÜZELTİLDİ.** Önce: "Kaymak toplayın ya da yoğurdu…" → Sonra: "Kaynatılmış sütün kaymağını toplayın ya da kaynatılmış sütten yapılmış yoğurdu… Çiğ süt kaymağından yapılan tereyağı Brusella taşıyabilir." Bu rehberin diğer içeriği tek kaynağa (FAO) dayanıyor.

### Tahıl, ekmek, kiler
- **sf-ys-eksi-maya — TEYİTLİ** (yazar kaynağı; düşük risk).
- **sf-ys-ekmek — ZAYIF KALDI** (oranlar yaygın fırıncı oranları; güvenlik açısından kritik değil).
- **sf-ys-yufka-lavas — ZAYIF KALDI** (geleneksel; sayı yok).
- **sf-ys-bulgur — ZAYIF KALDI** (Wikipedia ve FAO nem değeri).
- **sf-ys-eriste — ZAYIF KALDI.**
- **sf-ys-ogutme — ZAYIF KALDI** (çavdar mahmuzu uyarısı doğru yönde).
- **sf-ys-tahil-saklama — DÜZELTİLDİ (küçük).** FAO’ya göre böceklerin kesin ölümü yalnız fümigasyonla sağlanıyor.
  - Önce: "Hava almayan kaba konan kuru tahılda böcekler havasızlıktan zamanla ölür." → Sonra: "Hava almayan kapta böcekler yavaşlar ve dışarıdan yeni böcek giremez; ama içerideki böceklerin hepsi ölmeyebilir. Böcekli taneyi koymadan önce ayıklayın…"
- **sf-ys-kiler — TEYİTLİ** (yazar kaynağı FAO; karbonmonoksit uyarısı var).
- **sf-ys-kumda-saklama — ZAYIF KALDI** (tek kaynak; düşük risk).
- **sf-ys-buzhane — DÜZELTİLDİ (note) / ZAYIF.** Buz kesme boğulma riski için `note` eklendi. Kaynak hâlâ tek (Wikipedia).
- **sf-ys-bal — ZAYIF KALDI.** WHO yeniden açıldı ve bebeğe bal uyarısı teyit edildi. Kristalleşme ve deli bal bilgisi tek kaynaklı.
- **sf-ys-tuz — DÜZELTİLDİ (note) / ZAYIF.** Yasal `note` eklendi: "Türkiye’de olağan koşullarda tuz üretimi ve satışı mevzuata ve izne bağlıdır; bu bilgi yalnız gerçek hayatta kalma durumu içindir." Mevzuat metni bulunamadı; bu genel ifade hukukçuya doğrulatılmalı.

## Yasak kontrolü
- Silah, patlayıcı ve ilaç dozu yok.
- İçki tarifi yok; sirkede "içilmez, metanol riski" uyarısı var.
- Zehirli bitki ya da mantar teşviki yok.
- Sağlık riski taşıyan rehberlerde `note` var. Bu turda 9 rehbere note eklendi; toplam 18 rehberde note var.

## Uzmana gidecek liste
1. **Gıda mühendisi:**
   - kavurmanın yağ altında güvenli saklama sıcaklığı ve süresi (en büyük açık);
   - kür tuzsuz pastırma için aw/tuz eşiği;
   - zeytinin buzdolabı olmadan saklanması (UC kaynağı buzdolabı varsayıyor);
   - %12–14 beyaz peynir salamurası.
2. **Halk sağlığı / enfeksiyon:**
   - Sağlık Bakanlığı’nın Brusella için "salamurada 3 ay" önerisi var mı, varsa yeterli mi? Rehber şu an "çiğ sütten hiç yapma" diyor.
   - Botulizmli konserveyi gömerek imha etme uyarlaması uygun mu?
3. **Su ürünleri:**
   - lakerdada Anisakis için %20 tuz ve 3–4 haftanın etkinliği;
   - çiroz geleneğinin "önce pişir" kuralıyla uyumu.
4. **Hukuk:** Türkiye’de kişisel tuz üretimi (Maden Kanunu ve gıda mevzuatı).
5. **Genel:** FDA Fish Hazards Guide bölüm 5’in ve UC ANR 8267’nin asıl metinleri bu turda açılamadı; değerler ikincil derlemelerden alındı.
