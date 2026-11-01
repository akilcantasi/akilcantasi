# Sıfırdan: Giyim ve zanaat — rapor

Paket: `sifirdan-giyim-zanaat` · 45 rehber · 6 kategori (order 155–160) · 209 çizim kimliği (6 kapak dahil).
Tarih: 2026-11-02. Denetim: `tools/check-sifirdan.ts` → hata yok; `tsc --strict` temiz.

Not: Oturumdaki ortak WebSearch kotası işin ortasında doldu. Sonraki konular (metal işlerinin bir kısmı, taşıtlar, bisiklet) yalnız WebFetch ile ve daha az kaynakla doğrulandı. Aşağıda "tek kaynak" ya da "zayıf" olarak işaretlenenler uzmana gitmeli.

## Kategoriler
- sf-gz-lif — Lif, ip ve dokuma (9)
- sf-gz-deri — Deri ve giysi (8)
- sf-gz-agac — Ağaç, taş ve sepet (9)
- sf-gz-comlek — Çömlek ve yapıştırıcı (7)
- sf-gz-metal — Metal işleri (5)
- sf-gz-tasit — Taşıt ve taşıma (7)

SIFIRDAN_YAZIM.md paket başına 1–4 kategori diyor. Görevi veren ajan 6 kategori önerdiği için 6 kullanıldı. Gerekirse Lif+Deri ve Çömlek+Metal birleştirilebilir.

## Bölme, birleştirme, ekleme
- 180 ikiye bölündü: `sf-gz-isirgan-kenevir` ve `sf-gz-ihlamur-kabugu`.
- 186 ikiye bölündü: `sf-gz-tabaklama-kul` (kıl giderme) ve `sf-gz-tabaklama-mese`.
- 209 ikiye bölündü: `sf-gz-dovme` ve `sf-gz-su-verme` (meneviş dahil).
- 218 ikiye bölündü: `sf-gz-bisiklet-lastik` ve `sf-gz-bisiklet-bakim`.
- 200 (hasır ve kilim) dokuma kategorisine alındı. 212 (yay tornası) ağaç kategorisine alındı.
- 216: "basit kayık" oyma kütük kayık olarak tek adımda geçiyor; ayrı rehber yazılmadı.

## Rehber başına kaynaklar
- sf-gz-yun-yikama — Fiberartsy (scouring), fiberarts.org (keçeleşme nedenleri).
- sf-gz-kirmen — Innsbruck Üniv. Spindeltypologie Türkei, Emily Carr Fibre Stories. Katlama ve bükümü suyla oturtma: genel bilgi.
- sf-gz-isirgan-kenevir — Research Catalogue (nettle), UVM hemp hand processing, Evrensel 2026 kenevir 21 il, Lexpera kenevir yönetmeliği. Lexpera metni "mülga" görünüyor; 2026 düzenlemesi haberden alındı.
- sf-gz-ihlamur-kabugu — Rockingham Forest (7 hafta), Jack Raven (6 hafta, 10. gün kayganlaşma).
- sf-gz-halat — Pathfinder wiki (%33 fazla boy), PBO ropewalk. Ters burma: kaynaksız.
- sf-gz-dokuma-tezgahi — Lowimpact frame loom, Wikipedia Kilim. Ağızlık ve gücü: kaynaksız.
- sf-gz-orgu — K-State 4-H Beginning to Knit, Craft Yarn Council.
- sf-gz-bitki-boyasi — Botanical Colors (kökboya %100, en çok 77 °C), Dharma (şap %15–20), Fiberartsy (ceviz mordansız), Lavisch (soğan 33 g/100 g).
- sf-gz-hasir-kilim — Wikipedia Kilim, Lowimpact. Hasır kısmı zayıf.
- sf-gz-dikis-yama — iFixit hand stitches, Tokat çarık makalesi (mumlu iplik).
- sf-gz-deri-yuzme — NRA Family (tuz miktarları, 24 saat), Crannog.
- sf-gz-tabaklama-kul — Crannog (kül, ~2 hafta), wikiHow Bark tan (kireç 3 gün, 12 saatte 5–6 su değişimi).
- sf-gz-tabaklama-mese — wikiHow Bark tan, Crannog, J&FJ Baker.
- sf-gz-ham-deri — Western Horseman (rawhide), NRA Family (gererek kurutma).
- sf-gz-carik — Folklor/Edebiyat, Özdemir 2012 (Tokat çarığı), Western Horseman. Basit tek parça çarık ölçüleri kaynaksız.
- sf-gz-kece — Textile Center MN (wet felting), fiberarts.org, Fiberartsy.
- sf-gz-kis-giysisi — US Army "Fight the freeze", Maine EMA "Think COLD".
- sf-gz-tas-alet — Wikipedia Knapping, wikiHow Flintknap (platform ~40°, silikoz).
- sf-gz-kemik-boynuz — Wikipedia Antler, wikiHow Flintknap. Zayıf: oluk-kama yöntemi kaynaksız.
- sf-gz-alet-sapi — Wikipedia Hafting, Fine Woodworking (Langsner).
- sf-gz-bileme — Outdoor Life (22–30°), Wikipedia Pole lathe (kayış).
- sf-gz-agac-oyma — Northern Woodlands, Wikipedia Green woodworking, Fine Woodworking.
- sf-gz-civisiz-birlestirme — Fine Woodworking (kuru zıvana, yaş yuva), Wikipedia Green woodworking. 2–3 mm kaydırma kaynaksız.
- sf-gz-kasik-kase — Northern Woodlands, Wikipedia Green woodworking. Korla kase oyma kaynaksız.
- sf-gz-sepet — Jon's Bushcraft, Joybilee Farm.
- sf-gz-yay-tornasi — Wikipedia Pole lathe, Green woodworking. Tek kaynak sayılır; yay tornası kaynaksız.
- sf-gz-kil-hazirlama — Outdoor Life, Science Insights.
- sf-gz-comlek-sekil — Outdoor Life, Ceramic Arts Network (perdah).
- sf-gz-comlek-pisirme — Outdoor Life (600 °C üstü), Science Insights (700–900 °C).
- sf-gz-sir — FDA (kurşun içeren sır), survival.powweb (süt, un, yağ), Ceramic Arts Network.
- sf-gz-tutkal — Popular Woodworking (deri tutkalı ısıları), Alba Conservation (balık kesesi 1:10, 60 °C).
- sf-gz-recine — Puget Sound Knappers (%50 kömür, %5–10 lif), Wikipedia Hafting.
- sf-gz-odun-katrani — Acta Sci. Pol. Silv. (çift kap, 200–500 °C), Kozowyk ve ark. 2017.
- sf-gz-demirci-ocagi — Beautiful Iron, BlacksmithU (galvaniz). Ocak ölçüleri ve örs yüksekliği kaynaksız.
- sf-gz-dovme — Beautiful Iron (renkler), Anvilfire (sıcaklıklar).
- sf-gz-su-verme — Wikipedia Tempering (meneviş renkleri), Anvilfire (~765 °C), IForgeIron, Beautiful Iron.
- sf-gz-hurda-alet — BlacksmithU, Foundry Magazine, Beautiful Iron.
- sf-gz-dokum — Foundry Magazine (1600 kat buhar, ön ısıtma, kapalı kap), CDC (döküm hobisi, eve taşınan kurşun).
- sf-gz-tekerlek — Wikipedia Wheel, Wheelbarrow. Zayıf.
- sf-gz-el-arabasi-kagni — Wikipedia Wheelbarrow, Wheel, Ox cart. Kağnı yapısı kaynaksız.
- sf-gz-kizak — Wikipedia Sled. Tek kaynak, zayıf.
- sf-gz-sal — Wikipedia Raft. Çok zayıf: yapım ayrıntısı yok, FM 21-76 sayfasına erişilemedi.
- sf-gz-kurek — Wikipedia Paddle. Tek kaynak, zayıf.
- sf-gz-bisiklet-lastik — Sheldon Brown Flats. Tek kaynak.
- sf-gz-bisiklet-bakim — Sheldon Brown Chains, Flats. Fren ayarı kaynaksız (sayfa açılamadı).

## Açık kalan şüpheler ve uzmana sorulacaklar
1. **Yasal notlar:** 6831 Orman Kanunu notu (kabuk, reçine, katran) ve 4915 avcılık notu bu oturumda mevzuat.gov.tr'den doğrulanamadı; robots engeli vardı ve arama kotası dolmuştu. Hukukçu ya da mevzuat kontrolü gerekli. Kenevir notu 2026 haberine dayanıyor.
2. **Döküm (U):** Kurşun buharının belirginleştiği sıcaklık için kaynak bulunamadı; metin "aşırı ısıtmayın" diyor. İş sağlığı uzmanı bakmalı.
3. **Su verme:** Bilinmeyen hurda çelikte yağ tavsiye edildi. Yağın ön ısıtma derecesi verilmedi. Demirci gözden geçirmeli.
4. **Kül suyu ile kıl giderme:** Kül/su oranı sayısız. Göze kaçmada 15 dk yıkama ilk yardım genel bilgisi.
5. **Odun katranı (U):** Gaz zehirliliği ve yangın riski için kimyager ya da iş güvenliği bakmalı.
6. **Sal:** Doğruluğu en zayıf rehber. Su kurtarma uzmanı (AFAD/JAK) bakmalı.
7. **Taş yontma:** Silikoz uyarısı var. Obsidyenin Türkiye'de bulunduğu yerler genel bilgi.
8. **Çarık ve keçe:** Pay ve küçülme oranları (4–6 cm, üçte bir) deneme gerektirir.
9. Kağnı ve hasır için Türkçe etnografya kaynağı aranamadı (Kültür Bakanlığı / üniversite yayınları).
10. Silah kuralı: bıçak yalnız alet olarak geçiyor. Kılıç, ok ucu ve mızrak yok. Taş yongalar "kesici alet" olarak anlatıldı, döküm "yalnız alet ve ağırlık" ile sınırlı.
