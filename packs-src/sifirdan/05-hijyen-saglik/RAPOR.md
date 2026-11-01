# Sıfırdan: Hijyen ve sağlık — kaynak raporu

Paket: `sifirdan-hijyen-saglik` · 23 rehber · 3 kategori (sf-hs-tuvalet 135, sf-hs-temizlik 136, sf-hs-bakim 137) · 2026-11-02

Not: Yazım sırasında oturumun web arama kotası doldu. Bazı birincil belgelere (Sphere el kitabı, WHO teknik not 8 "Disposal of dead bodies", ICRC/PAHO ölü yönetimi el kitabının tam metni, FM 4-25.11, NICE CG179, CDC kemirgen temizliği sayfası, mevzuat.gov.tr) erişilemedi. Bu belgelere dayanması gereken sayılar aşağıda "şüphe" olarak işaretlendi.

## Katalogdan sapmalar
- 171 (atel, değnek, sedye) ikiye bölündü: `sf-hs-atel-degnek` ve `sf-hs-sedye`.
- 175 (karantina) hasta bakımı kategorisine kondu; 174 (ölüm ve defin) da aynı kategoride.
- Yeni rehber eklenmedi. Ana uygulamadaki ishal, yüksek ateş, yara temizliği, kırık ve doğum rehberleri tekrar edilmedi; bu paketteki rehberler uzun dönem bakıma odaklanıp ana rehberlere gönderme yapıyor.

## Rehber başına kaynaklar
- sf-hs-cukur-tuvalet — WEDC G025 Simple pit latrines; MSF Cholera App.14; Newfoundland Pit privies 2009.
- sf-hs-kompost-tuvalet — SSWM Dehydration & storage (WHO 2006 ve Schönning & Stenström 2004 tablosu); WEDC G025.
- sf-hs-kirec — Eawag/Sandec Lime treatment of faecal sludge; SSWM; Newfoundland Pit privies.
- sf-hs-cop — WHO/WEDC Technical note 7 Solid waste; CDC Flea prevention.
- sf-hs-sinek-kemirgen — WHO Plague; CDC Flea prevention; CDC Hantavirus; CDC Leptospirosis.
- sf-hs-el-yikama — FHI 360 Tippy Tap; Watershed MG Tippy tap guide; CDC Handwashing.
- sf-hs-kul-suyu — Practical Action Soapmaking; Traditional Soap Making (Journey to Forever); Mother Earth News.
- sf-hs-sabun — Traditional Soap Making; Mother Earth News; Practical Action.
- sf-hs-camasir — CDC Body lice; CDC Head lice; CRS Reusable pad guide; UNICEF MH materials 2019.
- sf-hs-bit-pire-uyuz — CDC Head lice; CDC Body lice; HSE Head lice; WHO Scabies; CDC Fleas.
- sf-hs-dis — WHO Oral health; Dimensions of Dental Hygiene (miswak); Wikipedia Miswak.
- sf-hs-kadin-hijyeni — UNICEF MH materials 2019; CRS Reusable pad guide; Darrang (Assam) leaflet.
- sf-hs-bebek-bezi — AAP HealthyChildren Diaper rash; MSF Cholera App.4; CDC Handwashing.
- sf-hs-yara-bakimi — WHO Sepsis; NHS Pressure ulcers; CDC Handwashing.
- sf-hs-enfeksiyon — WHO Sepsis; WHO Maternal mortality; NHS Pressure ulcers.
- sf-hs-atesli-hasta — NHS Fever adults; NHS Fever children; WHO Sepsis; CDC Precautions when sick.
- sf-hs-sivi-kaybi — WHO Diarrhoeal disease; MSF Cholera App.5 (ORS hacimleri); NHS Dehydration; WHO Cholera.
- sf-hs-atel-degnek — Physiopedia Crutches; Wikipedia Crutch; ana uygulama kırık rehberi.
- sf-hs-sedye — Wikipedia Stretcher; ana uygulama omurga rehberi. (ZAYIF)
- sf-hs-yatalak-hasta — NHS Pressure ulcers; Physiopedia Pressure ulcers.
- sf-hs-gebelik-dogum — WHO Maternal mortality; WHO Newborn mortality; WHO Pre-eclampsia; ana uygulama hamileler rehberi.
- sf-hs-karantina — WHO Ebola; WHO Cholera; CDC Precautions when sick; MSF Chlorine solutions.
- sf-hs-olum-defin — WHO Ebola; WHO Cholera; MSF Chlorine solutions; ICRC Management of dead bodies (yalnız yayın özeti).

## Açık kalan şüpheler (uzman gözden geçirmesi)
1. **Defin mesafe ve derinliği** (sf-hs-olum-defin): "kuyudan 250 m, pınar/dereden 30 m", "en az 1,5 m derin, üstte 1 m toprak" ve "bulaşıcı hastalık yoksa ceset salgın yaymaz" ifadeleri ICRC/PAHO el kitabı ve WHO TN8'e dayanmalı; belgelere erişilemedi, tutucu değerler seçildi. Yasal not (ölüm bildirimi, ruhsatlı defin, mezarlık dışı defin yasağı) mevzuat.gov.tr'de doğrulanamadı (robots engeli); 1593 sayılı Umumi Hıfzıssıhha Kanunu ve Mezarlık Yerleri yönetmeliğiyle kontrol edilmeli.
2. **Sedye ve değnek** (sf-hs-sedye, sf-hs-atel-degnek): battaniye katlama, ceketli sedye, yokuşta baş yukarıda, değnek tutamak yüksekliği, yürüyüş biçimi, kılcal dolum 2 sn ve "kırık 6 haftadan uzun" yaygın bilgilerdir ama FM 4-25.11 ya da benzer bir resmî kaynakla doğrulanamadı.
3. **Kireçle dışkı arıtımı** (sf-hs-kirec, sf-hs-karantina): litre başına ~40 g Eawag aralığının üst sınırı; pH ölçümü olmadan yeterliliği garanti edilemez. Badana adımı için kaynak yok.
4. **ORS ve sıvılar** (sf-hs-sivi-kaybi): 4 saatte ~75 ml/kg (MSF Plan B tablosundan) bir "ilaç dozu" değil sıvı miktarıdır ama uzman onayı istenmeli. "Ayran, tuzlu çorba, pirinç suyu" önerisi WHO'nun ev sıvıları listesine dayanmalı, doğrulanamadı.
5. **Yara bakımı** (sf-hs-yara-bakimi): pansuman sıklığı ve bez kaynatma süresi için kaynak yok; tuzlu suyun çay kaşığı çevirisi (9 g ≈ 1,5 çay kaşığı) yaklaşık.
6. **Doğum seti ve göbek bakımı** (sf-hs-gebelik-dogum): WHO "temiz doğum" ilkelerinden; göbeğe "bir şey sürmeyin" kuralı klorheksidinin önerildiği yüksek ölüm oranlı ortamlar için farklı olabilir. Doğum sonrası kanama eşiği bilerek sayısız yazıldı.
7. **Diş** (sf-hs-dis): Türkiye'de Salvadora persica yetişmez; yerel dal önerisi "zehirsiz olduğundan emin olunan ağaç" olarak genel bırakıldı. Kül/kömürün aşındırması ve tuzlu su çalkalaması için resmî kaynak bulunamadı.
8. **Sabun/kül suyu**: kaynaklardaki "dil testi" bilerek çıkarıldı; çamaşır için kül suyu seyreltme oranı verilmedi.
9. **Sinek kapanı, fare kapanı yerleşimi, çöp çukurunun su kaynağına mesafesi (30 m, tuvaletten benzetme)** kaynaksız; düşük riskli ama doğrulanmalı.
10. **Bebek bezi yıkama sıcaklığı** bit rehberindeki ≥54 °C ilkesinden aktarıldı.
