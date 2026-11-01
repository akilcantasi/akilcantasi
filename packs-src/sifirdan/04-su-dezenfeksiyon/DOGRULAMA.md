# Sıfırdan: Su ve dezenfeksiyon — bağımsız doğrulama raporu

Paket: 04-su-dezenfeksiyon (35 rehber). Tarih 2026-11-02. Denetim: `npx -y tsx tools/check-sifirdan.ts packs-src/sifirdan/04-su-dezenfeksiyon` → hata yok.
Arama: 9 WebSearch (kota 25). Asıl doğrulama WebFetch ile açılan belgelerden yapıldı.

## Bu turda açılan kaynaklar
- CDC Cholera infection control (klor %0,05 / %0,2 / %2 oranları ve kullanım alanları)
- CDC Making water safe in an emergency (1 dk kaynatma, 2000 m üstünde 3 dk, 2 damla/L = 0,1 ml/L, 30 dk)
- WHO/WEDC Cleaning and disinfecting wells (kuyu klorlama)
- SSWM/Eawag SODIS
- CAWST Biosand Filter Manual v10 (2009) ve CAWST Biosand fact sheet (2009)
- IRC/Huisman 1986 Slow sand filtration; NESC/WVU slow sand filtration tech brief
- Akvopedia WATAsol; IRC 1986 elektrolitik hipoklorit üretimi raporu; Wikipedia Electrochlorination ve MMO electrode
- Hesperian, Disinfecting with heat; Etiyopya Sağlık Bakanlığı IP eğitimi 5.1 (alet kaynatma 20 dk)
- WHO yerel el antiseptiği üretim rehberi (Formül 1 ve 2)
- Wikipedia Ethanol data page (yoğunluk tablosu), Wikipedia Methanol toxicity
- CLEAPSS güvenlik kartı 32 (kalsiyum hidroksit ve oksit)
- Kireç sütü oranı için FAO (x6557e, i1357e), Wisconsin VDL, Ankara Üni. açık ders denendi: oran bulunamadı.

## Rehber başına sonuç
Su bulma ve depolama
- sf-sd-kaynak-arama: TEYİTLİ (yazar kaynağı; bu turda yeniden açılmadı). 15 L/kişi/gün Sphere ile tutarlı.
- sf-sd-kaptaj: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-kuyu-yer: TEYİTLİ (yazar kaynağı; yeniden açılmadı). Yasal not var.
- sf-sd-kuyu-kazma: ZAYIF KALDI. Mum testi ve havalandırma kaynaksız (geleneksel); gaz dedektörü yok. Not ve "3–4 m'den derine inmeyin" uyarısı yerinde.
- sf-sd-kuyu-agzi: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-kuyu-klor: TEYİTLİ. WHO/WEDC açıldı: 100 L'ye 1 L %0,2, 30 dk, boşaltma, dolunca 30 dk, kalıntı < 0,5 mg/L. Belgedeki ikinci kural (m³ başına 50 g HTH'li çözeltiden 10 L) aynı mertebede; RAPOR'daki "tutarsızlık" kaygısı tehlikeli değil.
- sf-sd-makara: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-yagmur: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-sarnic: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-tasima: TEYİTLİ (yazar kaynağı; yeniden açılmadı).

Su arıtma
- sf-sd-su-ozet: TEYİTLİ. CDC açıldı; 1000 L için 100 ml artık türetilmiş değil, CDC tablosuyla doğrudan tutuyor (0,1 ml/L).
- sf-sd-kalite: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-dinlendirme: ZAYIF KALDI. "Bir gün" dinlenme kaynaksız tutucu tahmin.
- sf-sd-kum-filtre-1: DÜZELTİLDİ (CAWST v10 ölçüleri).
- sf-sd-kum-filtre-2: TEYİTLİ (CAWST fact sheet açıldı, sayılar aynı).
- sf-sd-kum-filtre-3: DÜZELTİLDİ (yeniden kumlama sınırı).
- sf-sd-seramik: ZAYIF KALDI. Kömürün aylık değişimi ve pişirme sıcaklığı kaynaksız (pişirme sıcaklığı zaten verilmemiş).
- sf-sd-sodis: TEYİTLİ (SSWM açıldı: 6 saat / tam bulutta 2 gün / 30 NTU / 1,5 cm).
- sf-sd-gunes-imbigi: TEYİTLİ (yazar kaynağı; yeniden açılmadı).

Dezenfeksiyon ve sterilizasyon
- sf-sd-uc-seviye: TEYİTLİ (yazar kaynağı; yeniden açılmadı).
- sf-sd-sabun: TEYİTLİ (yazar kaynağı; yeniden açılmadı; %0,05 el klorunun "son çare" olması CDC kolera sayfasıyla bu turda teyit edildi).
- sf-sd-kaynatma-steril: DÜZELTİLDİ. 20 dk iki kaynakla teyit edildi; kaynaksız "2–3 cm" kaldırıldı.
- sf-sd-duduklu: DÜZELTİLDİ. Kaynaksız basınç genellemesi kaldırıldı.
- sf-sd-gunes-isi: TEYİTLİ (yazar kaynağı; 55 °C, CDC'nin 54 °C değerinden tutucu).
- sf-sd-yanlis-dezenfektan: DÜZELTİLDİ (kolonya iddiası).
- sf-sd-yara-suyu: ZAYIF KALDI. 1 çay kaşığı / 500 ml ve 1 gün saklama hesap ve tutucu tahmin; zararlı değil.
- sf-sd-dogum-malzeme: ZAYIF KALDI. 20 dk kaynatma artık teyitli; iplik uzunluğu ve kit içeriği WHO kaynağıyla doğrulanamadı.

Dezenfektan hazırlama
- sf-sd-klor-oran: DÜZELTİLDİ (yemek kapları %0,05'ten %0,2'ye). Diğer bütün oranlar CDC ile tuttu.
- sf-sd-elektroliz: DÜZELTİLDİ (büyük ölçüde yeniden yazıldı).
- sf-sd-kirec: DÜZELTİLDİ (göz yıkama süresi, söndürme uyarısı). Kireç sütü oranı yine bulunamadı, sayı verilmedi.
- sf-sd-kul-suyu: ZAYIF KALDI. Tek kaynak (Wikipedia Lye); oran ve süre zaten sayısız.
- sf-sd-alkol-maya: TEYİTLİ (güvenlik açısından). Miktar/verim yok, içki tarifi değil; metanol ve "içilmez" uyarısı ve 4733 notu var.
- sf-sd-alkol-imbik: TEYİTLİ (güvenlik açısından). Yanıcılık WHO ile teyit edildi; baş atma miktarı (Moonshine 50–150 ml) yeniden açılmadı. İçki tarifi değil; metanol uyarısı var.
- sf-sd-alkol-olcme: DÜZELTİLDİ (tartı uyarısı). WHO formülü yeniden açıldı, bütün sayılar tuttu: %80 etanol (kabul %75–85), litreye ≈15 ml gliserin, ≈42 ml %3 H2O2, 72 saat.
- sf-sd-metanol: TEYİTLİ (Methanol toxicity açıldı; 10–30 saat ve görme belirtileri tuttu; antidot ya da ilaç dozu yok).

Sayım: TEYİTLİ 20 (bunların 13'ü yazar kaynağına dayanıyor, bu turda yeniden açılmadı), DÜZELTİLDİ 9, ZAYIF KALDI 6, ÇIKARILDI 0.

## Değişiklikler (önce → sonra)
1. sf-sd-elektroliz
   - Tuzlu su: "1 L suya ~400 g tuz, doymuş tuzlu su; 1 ölçü + 3 ölçü su ≈ 25 g/L" → "her 1 L suya 25 g tuz tartın; litrede 10–30 g yeterli". WATA sayfasındaki hesap tutarsız: doymuş tuzlu su 1:3 seyreltilince yaklaşık 80–100 g/L olur, 25 değil. IRC'nin en uygun aralığı 10–30 g/L.
   - Elektrot: "grafit çubuk ya da hazır titanyum levha; demir, çelik, bakır, alüminyum çözünür" → "iki grafit çubuk ya da hazır cihazın KAPLAMALI titanyum levhası; demir, paslanmaz çelik, bakır, alüminyum ve çıplak titanyum yok; artı kutupta metal çözünür (paslanmaz çelikte krom-nikel, bakırda mavi-yeşil renk), klor az oluşur". IRC: platinli titanyum klorürlü suda aşınır, DSA tercih edilir; iki grafit elektrot sorunsuz; çelik ve demir çözünebilir.
   - Gaz: genel "hidrojen ve klor kokulu buhar" → "eksi kutupta hidrojen, havayla patlayıcı karışım; artı kutupta zehirli klor"; dont'a "kapalı kapta yapmayın", "kablo ucu ve klemens sıvıya girmesin" eklendi.
   - Kullanım: "kendi düzeneğinizin gücünü bilmiyorsanız yalnız yer ve tuvalet" → ev yapımı sıvı hiçbir koşulda ele, yaraya ve içme suyuna katılmaz; 1:2, 1:11 ve 1 L / 5000 L oranları "yalnız hazır cihazın sıvısı için" diye sınırlandı. Grafitin ufalanması ve süzme eklendi.
   - Çizim kimliği sf-sd-doymus-tuzlu-su → sf-sd-tuzlu-su-25g (spec güncellendi); sf-sd-elektrot-secimi spec'i kaplamalı titanyum ve paslanmaz kaşıkla güncellendi. art uzunluğu 9 (aynı).
2. sf-sd-kum-filtre-1 (CAWST v10)
   - "Kumu ve çakılı su berrak akana kadar yıkayın" → çakıl berrak akana kadar; kum partilerle, iki katı suyla, berrak akana kadar DEĞİL (fazla yıkanan kum hızlı akar ve mikrop kaçırır). Önceki talimat CAWST'e aykırıydı.
   - Katmanlar sayısızdı → iri çakıl 6–12 mm 5 cm, ince çakıl 1–6 mm 5 cm, kum ≤0,7 mm; kap yaklaşık 30×30×90 cm; durgun su 5 cm (4–6).
   - Akış: "1 L 2,5 dk'dan kısa ise kum iri" → "1 L 2,5–3,3 dk (0,3–0,4 L/dk); hızlıysa kum fazla yıkanmış/iri, değiştirin; yavaşsa biraz daha yıkayın".
   - Spec sf-sd-biokum-kesit'e katman ölçüleri eklendi.
3. sf-sd-kum-filtre-3: yeniden kumlama "60–70 cm" → "70 cm" (Huisman: tropikte 0,6, ılıman iklimde 0,7 m; WVU en az 0,7 m).
4. sf-sd-klor-oran: "%0,05 (eller, son çare; yemek kapları)" → "%0,05 yalnız eller (sabun-su ve alkollü antiseptik yokken)"; yemek kapları %0,2 satırına taşındı (CDC).
5. sf-sd-kaynatma-steril: "suyun en az 2–3 cm altında" → "tamamen suyun altında" (kaynaksız sayı); 20 dk Hesperian ve Etiyopya SB ile teyit edildi, kaynaklar eklendi. Spec sf-sd-alet-tencere güncellendi.
6. sf-sd-duduklu: "Çoğu ev düdüklüsü 0,6–0,8 bar'da çalışır" → "çalışma basıncı kapakta ya da kılavuzda yazar; 1 bar'ın altındaki tencere daha az ısınır". 30 dk korundu (Hesperian 1–1,4 bar'da 20 dk; CDC 121 °C sarılı malzeme 30 dk).
7. sf-sd-kirec: göz yıkama "en az 15 dk" → "en az 20 dk yavaş akan su" (CLEAPSS); söndürme "ısınıp fokurdar" → "şiddetle ısınır, tanecik sıçratır".
8. sf-sd-yanlis-dezenfektan: "Kolonyanın alkolü çoğu zaman %60'tan düşüktür" (kaynaksız; Türkiye'de yaygın 80 derece kolonya için yanlış olabilir) → "alkol oranı ürüne göre değişir; etikette en az 60 derece yazmıyorsa güvenmeyin".
9. sf-sd-alkol-olcme: tartı değerleri yoğunluk tablosuyla teyit edildi (%80 ≈ 0,86, %60 ≈ 0,91 g/ml); "20 °C'de" ve "88 g'dan ağır çıkan sıvıyı yeterli saymayın" eklendi.
10. Bütün rehberlerde checked.note "Bağımsız doğrulama: …" ile başlıyor; yeniden açılmayan kaynaklar notta açıkça yazıyor. Yeni kaynaklar `S` nesnesine eklendi (ircElec, wikiElectro, wikiMmo, hesperian, ethIp, cawstBsf10, cdcWater, cleapss, wikiEthData).

## Yasak kontrolü
- Silah, patlayıcı yok.
- İçki tarifi yok: alkol serisinde ham madde miktarı, şeker oranı, verim, içim yok; her alkol rehberinde "içilmez, metanol riski" ve 4733 notu var.
- İlaç dozu yok (metanol rehberinde antidot ya da doz verilmiyor).
- Sağlık ya da yasal riskli rehberlerde `note` var: kuyu-yer, kuyu-kazma, kuyu-klor, duduklu, yara-suyu, dogum-malzeme, klor-oran, elektroliz, kirec, kul-suyu, dört alkol rehberi.

## Uzmana gidecek liste
1. Kimyacı: ev yapımı grafit elektrotlu elektrolizin güvenliği (klorat oluşumu, akım yoğunluğu, elektrot aralığı); paslanmaz çelik anottan krom/nikel geçişi iddiası. WHO/PATH yerinde klor üretimi belgesine bu turda da ulaşılamadı.
2. Veteriner / Tarım Bakanlığı: kireç sütü dezenfeksiyon oranı (ör. %10–20) ve temas süresi. Kaynak bulunamadı, rehberde sayı yok.
3. Ebe: temiz doğum kiti (WHO "altı temiz"), kordon ipi uzunluğu ve kordon bakımı.
4. Kuyucu / iş güvenliği: kuyuda mum testi yerine gaz ölçümü; havalandırma yöntemi.
5. Enfeksiyon kontrol uzmanı: ev düdüklüsünde 30 dk'nın yeterliliği; 1 bar'ın altındaki tencerelerde süre.
6. Kül suyu (tek kaynak) ve üç küp dinlenme süresi (1 gün) için ikinci kaynak.
7. 4733 sayılı Kanun md. 8'in güncel metni (mevzuat.gov.tr); notlarda ceza miktarı verilmiyor.
