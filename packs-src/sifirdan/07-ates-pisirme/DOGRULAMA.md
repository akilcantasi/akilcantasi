# Bağımsız doğrulama: 07-ates-pisirme

Tarih: 2026-11-02. WebSearch kullanımı: 7 / 25. Denetim: `npx -y tsx tools/check-sifirdan.ts packs-src/sifirdan/07-ates-pisirme` sonucu "hata yok".

Yeniden açılıp okunan kaynaklar: Aprovecho "Design Principles for Wood Burning Cook Stoves" (Peace Corps Improved Cookstoves Handbook eki), Winiarski 10 ilke (bioenergylists), Aprovecho 0,75 kuralı ve "6 mm pot skirt gaps" yazısı, Wikipedia Rocket mass heater, Seattle 2018 Konut Yönetmeliği Bölüm 10 (IRC R1001/R1003), Maine katı yakıt standardı, Purdue Extension FNR-100, NFPA 211 Sistem A açıklaması (Rockford), Snohomish İtfaiye Bölgesi 8 baca yangını prosedürü, Mass. baca ve soba güvenliği, Hacettepe CO bilgi notu, MHA tanımı, FAO x5328e06/07, Wikipedia Masonry oven, Sigi Koko kerpiç fırın yazısı, FDA Food Code 4-101.14 (Iowa bülteni alıntısı), Vintage French Copper kalay kılavuzu, Wikipedia Phytohaemagglutinin (FDA Bad Bug Book atfı), 6831 sayılı Orman Kanunu (qsl.net metni, md. 14/15/18/69) ve Antalya Valiliği genelgesi (md. 76 alıntısı).

Erişilemeyenler: mevzuat.gov.tr ve OMÜ PDF'leri robots nedeniyle açılmadı. Kanun metni ikincil kopyadan okundu ve bu kopyanın güncel olup olmadığı bilinmiyor. FDA Bad Bug Book PDF'inin fasulye bölümü kesik geldi.

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-ap-roket-soba | DÜZELTİLDİ | Tencere ve etek boşlukları Aprovecho tablosuna göre değişti. Kaynakta olmayan raf yüksekliği kaldırıldı. |
| sf-ap-roket-kutle | DÜZELTİLDİ (sayılar çıkarıldı) | 1:2:4 oranı, 15 cm, 4–5 cm ve 5 cm değerleri yalnız forumda var. Rehber artık ilkeyi anlatıyor: sabit kesit, uzun yalıtımlı yükseltici, hiçbir yerde daralmama. |
| sf-ap-baca | DÜZELTİLDİ | Duvar geçişindeki "hava boşluğu" ifadesi ölçüsüz ve tehlikeliydi. Yerine kil yüksük ile her yönde 30 cm tuğla dolgu yazıldı ve borunun tavandan geçmemesi eklendi. Yükseklik, kesit, kıvılcım kapanı ve boru kuralları teyitli. |
| sf-ap-yangin-guvenligi | DÜZELTİLDİ | Baca yangınına su dökmeme uyarısı artık kaynaklı. Havayı kesme ve ABC tozlu söndürücü adımı eklendi. 90 cm mesafe ve kül kovası teyitli. |
| sf-ap-somine | DÜZELTİLDİ | Bindirmeli duman odasında sınır 30°'dir; 45° yalnız eğimli yüzey için geçerli. Astarlı duman odası duvarı 15 cm. Diğer IRC sayıları teyitli. |
| sf-ap-kutle-soba | DÜZELTİLDİ | "Dış yüzeye elle dokunulabilir" ifadesi yanlıştı. MHA sınırı 110 °C ve bu sıcaklık cildi yakar. Diğer MHA sayıları teyitli. |
| sf-ap-odun-komuru | DÜZELTİLDİ | Küçük çukurda toprak örtü 30 değil 20 cm. Çukurda soğuma 2–3 gün değil, büyük çukurda bir aydan fazla; erken açmak yangın riski taşır. "1 m³" yerine FAO'nun küçük çukur ölçüsü yazıldı. |
| sf-ap-kubbe-firin-1 | DÜZELTİLDİ (zayıf) | Isı depolayan kat yaklaşık 10 cm, yalıtım yaklaşık 15 cm olarak eklendi; kaynak tek uygulayıcı. Kum boşaltma iki aşamalı oldu: önce üçte biri, birkaç gün sonra kalanı. Kapı oranı teyitli. |
| sf-ap-kap-guvenligi | DÜZELTİLDİ | Kalaylı bakır uyarısı kaynaklı: FDA, bakır ve pH 6 altı gıda; kalayın erime noktası 232 °C. Ekşi gıda örnekleri ve ek dont maddesi eklendi. note eklendi. |
| sf-ap-saman-kutu | DÜZELTİLDİ | Eksik uyarı eklendi: kuru fasulyeyi ıslatıp en az 30 dk kaynatmak. "3 kat" kuralı kaba kural olarak yumuşatıldı. note eklendi. |
| sf-ap-gunes-firini | DÜZELTİLDİ | Fasulye uyarısı ve note eklendi. |
| sf-ap-odun-kurutma | DÜZELTİLDİ (yasal not) | Madde numaraları eklendi: 6831 md. 14 ve 15. |
| sf-ap-ocak-yeri | TEYİTLİ | Maine'e göre 90 cm, siperle 30 cm, taban 45 cm, ahşap zeminde boşluklu kâgir ve sac. |
| sf-ap-karbonmonoksit | TEYİTLİ | Hacettepe notundaki bütün öneriler ve 112. "Köz sönmeden kapağı kısmayın" ifadesi tutucu öneri olarak kaldı. |
| sf-ap-toprak-firin | ZAYIF KALDI | Yalnız Wikipedia kaynaklı. Sayılar düşük riskli. note eklendi. |
| sf-ap-yer-isitma | ZAYIF KALDI | Sayı yok. CO uyarısı ve note yeterli. Yapım ayrıntısı uzmana gitmeli. |
| sf-ap-tandir | ZAYIF KALDI | Duvar kalınlığı için güvenilir kaynak bulunamadı ve sayı verilmedi. CO uyarıları yerinde. |
| sf-ap-kubbe-firin-2 | ZAYIF KALDI | Un testi ve vurma testi geleneksel bilgi. Güvenlik içeriği yerinde. |
| sf-ap-cakmaktasi, sf-ap-mercek, sf-ap-yay-matkabi, sf-ap-kav, sf-ap-koz-tasima, sf-ap-odun-secimi, sf-ap-aydinlatma, sf-ap-sac-tas | TEYİTLİ (yazar teyidi) | Düşük riskli. Bu turda kaynaklar yeniden açılmadı; metinde güvenlik hatası görülmedi. |

Hiçbir rehber çıkarılmadı. Adım sayıları ve `art` uzunlukları değişmedi.

## Önce → sonra

- **Roket soba, tencere dibi boşluğu:** "12 cm kanalda yaklaşık 3–4 cm" → "boşluk = kanal kesiti ÷ iç baca ağzı çevresi; 12 cm kanalda yaklaşık 3 cm, 16 cm kanalda yaklaşık 4 cm" (Aprovecho Tablo 1-2).
- **Roket soba, etek:** "1–1,5 cm aralıklı etek" → "aralık = kesit ÷ tencere çevresi; 12 cm kanalda 20 / 30 / 40 cm tencere için yaklaşık 1,5 / 1,2 / 1 cm; daha dar olursa ateş boğulur".
- **Roket soba, iç baca:** "2–3 kat: 25–35 cm" → "2–3 kat, tercihen yaklaşık 3 kat: 30–36 cm".
- **Roket soba, raf:** "odun ağzı yüksekliğinin üçte birinde" → "odun ağzının alt kısmında, hava rafın altından" (kaynakta ölçü yok).
- **Roket kütle ısıtıcı:** Kaldırılan değerler: 15 cm en küçük boyut, 1:2:4 oranı (30/60/120 cm), en az 5 cm yalıtım, 4–5 cm varil boşluğu. Yerine yazılanlar: bütün yol kanal kesitinden dar olmasın; yükseltici odun ağzından belirgin biçimde uzun ve kalın yalıtımlı olsun; varil galvanizsiz olsun. Ölçü bilerek verilmedi; ölçüleri çalışan bir örnekten alın. Spec'teki "1-2-4", "≥5 cm" ve "4–5 cm" etiketleri de silindi.
- **Baca, duvar geçişi:** "kil ya da taş yüksük, ahşapla baca arasında hava boşluğu" → "boruyu tavan ve döşemeden geçirmeyin; kil yüksüğün çevresindeki ahşabı her yönde en az 30 cm kesip tuğla ya da taşla doldurun".
- **Baca yangını:** "havayı kesin, dışarı çıkın" → buna ek olarak "ABC tozlu söndürücüyü sobanın ağzından kısa kısa sıkın". Su uyarısının gerekçesi: "ani buhar" → "baca astarını çatlatır, alev çatlaktan çatıya ve duvara geçer".
- **Şömine, duman odası:** "duvarlar 20 cm, 45°" → "20 cm (astarlı 15 cm); bindirmeli örgüde 30°, düz eğimli yüzeyde 45°".
- **Kütle soba:** "dış yüzey elle dokunulabilecek sıcaklıkta" → "dış yüzey 110 °C'yi geçmemeli; bu da yakar, çocukları ve yatağı uzak tutun".
- **Odun kömürü:** "yaklaşık 1 m³ çukur" → "FAO küçük çukuru 3 × 1,2 × 1,2 m". "20 cm yaprak + 30 cm toprak" → "20 cm + 20 cm". "Çukurda 2–3 gün" → "yığında 2–3 gün, çukurda çok daha uzun, büyük çukurda bir aydan fazla".
- **Kubbe fırın 1:** Kalınlık eklendi: iç kat yaklaşık 10 cm, yalıtım yaklaşık 15 cm. Kapı oranı "%63" → "%63 ile 2/3 arası". Kum boşaltma: "sertleşince boşalt" → "önce üçte biri, birkaç gün sonra kalanı". "Izgara gibi pürüzsüz" ifadesi düzeltildi.
- **Kap güvenliği:** Önceki metin: "kalaysız bakırda ekşili pişirmeyin; boş kalaylı kap ateşte erir". Yeni metin: çıplak bakır ekşi yiyeceğe (sirke, limon, domates, turşu, yoğurt) bakır geçirir; bakır görünmeye başlayınca kalaylatın; kalay yaklaşık 232 °C'de erir, boş kalaylı kap ısıtılmaz ve kızartmada kullanılmaz. Yeni dont maddesi ve note eklendi.
- **Saman kutu ve güneş fırını:** Yeni dont: kuru fasulyeyi ıslatıp suyunu dökün, ateşte en az 30 dk fokur fokur kaynatın, sonra kutuya ya da fırına koyun. Saman kutuya note eklendi.
- **Orman notları:** "6831 sayılı Kanun'a göre izne bağlı" → "md. 14 ile yasak, md. 15 ile izne bağlı (ağaç ve kömür); md. 76: izinli ocak yeri dışında ateş yasak".
- **Yeni note'lar:** sf-ap-saman-kutu, sf-ap-kap-guvenligi, sf-ap-toprak-firin ve sf-ap-gunes-firini artık gıda zehirlenmesi, göz ve zehirli kap uyarısı taşıyor.

## Yasak kontrolü

Silah, patlayıcı, içki ve ilaç dozu yok. Yasal ya da sağlık riski taşıyan her rehberde `note` var. Bu turda 4 rehbere note eklendi.

## Uzmana gidecek liste

1. **Roket kütle ısıtıcı:** Bütün ölçüler eksik. Wisner'in "Rocket Mass Heater Builder's Guide" kitabıyla ya da deneyimli bir yapıcıyla ölçü tablosu çıkarılabilir; ancak bu tablo resmi kaynak sayılmayacak. CO açısından en riskli rehber budur.
2. **Kubbe fırın:** 10 cm ve 15 cm kalınlıkları tek uygulayıcıdan alındı. Denzer'in "Build Your Own Earth Oven" kitabıyla karşılaştırılmalı. Kaide yüksekliği yok.
3. **Tandır:** Duvar kalınlığı, keçi kılı ve tuz katkısı, yan delik. Etnografya ya da Kültür Bakanlığı kaynağı gerekiyor.
4. **Ondol ve yer ısıtma:** Kanal eğimi, plaka ve sıva kalınlığı.
5. **Kalaycılık:** Geleneksel kalaycının kurşun içeren kalay kullanma riski ve Türk Gıda Kodeksi'ndeki kurşun sınırı. "Saf kalay isteyin" uyarısı eklenmeli mi?
6. **Orman Kanunu:** Md. 14, 15 ve 76'nın güncel metni mevzuat.gov.tr'den teyit edilmeli. Bu turda ikincil kopyadan okundu.
7. **Roket soba, etek:** Aprovecho'nun yeni 6 mm önerisi (20 cm ve üstü tencere) ile tablo değerleri (yaklaşık 1–1,5 cm) arasında fark var. Rehber, ateşi boğmaması için tablo değerlerini kullanıyor.
8. **Duvar geçişi:** Rehberde NFPA 211 Sistem A'daki 30 cm kural olarak yazıldı. Kaynak, ticari bir sitenin açıklaması ve Purdue'daki eski 20 cm kuralıdır; NFPA'nın kendi metni okunmadı.
