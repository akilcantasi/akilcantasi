# Bağımsız doğrulama: 13-mutfak-beslenme

Tarih: 2026-11-02 · 24 rehber · Denetim: `npx -y tsx tools/check-sifirdan.ts packs-src/sifirdan/13-mutfak-beslenme` → "hata yok"
Web araması: 6 (kota 25). Doğrulamanın çoğu WebFetch ile.

Açılamayanlar: IFE Operational Guidance v3 tam PDF (ennonline 403/sunucu hatası; yalnız sağlık bölümü özeti okundu), WHO 2023 tamamlayıcı beslenme tam metni (NCBI reCAPTCHA; ENN FEX 72 özeti okundu), WHO Relactation 1998 PDF (iris hata). Bunların yerine IFE Core Group / ENN eğitim modülü 2 (ek okuma) tam metni okundu; yeniden emzirme ve ev usulü süt bilgisinin asıl dayanağı bu oldu.

## Özet sayım
- DÜZELTİLDİ: 12
- TEYİTLİ: 6 (kaynak bu turda yeniden açıldı ya da yalnız yasak kontrolü; değişiklik yok)
- ZAYIF KALDI: 6 (tehlikeli hata yok; kaynak bu turda yeniden açılmadı ya da kısmen kaynaksız)
- ÇIKARILDI: 0

Yasak kontrolü: silah, patlayıcı, içki tarifi yok. İlaç dozu yok; kronik hastalık rehberlerinin (diyabet, tansiyon, astım) üçünde de "ilacı bırakmayın, dozu değiştirmeyin" notu var, ilaç bırakma önerisi yok. Diş ağrısında yalnız "kutudaki talimata göre" ifadesi var, doz yok. Sağlık riski taşıyan ve notu olmayan rehberlere not eklendi (çocuk beslenme, zayıflık ölçme, pellagra-beriberi, kerevit).

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-mb-mama-yoksa | DÜZELTİLDİ | FHI 360/WHO tablosu yeniden okundu; yaş bantlarında 2–3 ay boşluğu vardı, düzeltildi. Yeniden emzirme sıklığı ve yeterlilik ölçütleri, vitamin-mineral şartı, uygun olmayan sütler eklendi (IFE modül 2). Not "sağlık personeline ulaşılana kadar son çare" çerçevesine çekildi. |
| sf-mb-cocuk-beslenme | DÜZELTİLDİ | WHO IYCF öğün sayıları, WHO 2023 özeti, CDC bal/çiğ süt teyitli. Eksik `note` eklendi. |
| sf-mb-refeeding | DÜZELTİLDİ | NICE CG32 1.4.6–1.4.8 yeniden okundu. Kilo başına hesabın çocukta kullanılmaması, MSF tehlike belirtileri, nabız-nefes izlemi, belirti çıkınca 1–2 gün bekleme, fosfat/B1 için süt-yumurta-baklagil eklendi. |
| sf-mb-zayiflik-olcme | DÜZELTİLDİ | CMAM modül 2 ve WHO 2009: <115 mm ağır, ≥115 ve <125 mm orta. Sınır ifadesi belirsizdi; düzeltildi. 6 ay altı bebekte MUAC kullanılmaması, esneyen şerit uyarısı, genişletilmiş tehlike belirtileri ve `note` eklendi. |
| sf-mb-sitma | DÜZELTİLDİ | Türkiye DSÖ sıtmasız sertifikalı listede YOK (WHO sayfası açıldı). "Yerli bulaş bitti" ifadesi tutucu ifadeye çevrildi; 2012 Mardin (219) ve 2014 Edirne (5) yerli vaka bilgisi eklendi; P. vivax nüksü eklendi. WHO belirti ve önlemleri teyitli. |
| sf-mb-pellagra-beriberi | DÜZELTİLDİ | Nixtamalizasyon oranı FAO'dan eklendi (1 kg mısır : 2 l su : 20 g söndürülmüş kireç ≈ %1; 20–45 dk; bir gece; 2–3 yıkama). Kül için oran bulunamadı, sayısız bırakıldı. Katkılı kireç ve boyalı tahta külü uyarısı ve `note` eklendi. |
| sf-mb-kurbaga-salyangoz | DÜZELTİLDİ | CDC teyitli; toplama aşamasında da eldiven uyarısı eklendi. 74°C ve 2 saat tutucu ölçü (CDC sayı vermiyor). |
| sf-mb-kerevit | DÜZELTİLDİ | CDC 63°C ve turşu/tuzlu kerevitle bulaş teyitli. Eksik `note` (parazit ve mevzuat) eklendi. |
| sf-mb-kusburnu-alic | DÜZELTİLDİ | NCHFP: 1.800 m üstü 15 dakika eksikti; eklendi. |
| sf-mb-su-tuz | DÜZELTİLDİ | NIOSH: saatte en çok 6 bardak (8 oz) ≈ 1,4 l; metinde 1,5 l yazıyordu. |
| sf-mb-diyabet | DÜZELTİLDİ | NHS hiperglisemi acil belirtileri teyitli. Şeker düşmesinde ağızdan şeker yalnız "bilinci yerindeyse ve yutabiliyorsa". |
| sf-mb-gozluk | DÜZELTİLDİ | Su dolu şişe büyütecinin güneşte yangın çıkarabileceği uyarısı eklendi. Onarım adımları kaynaksız (ZAYIF yanı sürüyor). |
| sf-mb-tek-tencere | TEYİTLİ | CFS: en az 12 saat ıslatma, en az 10 dk kuvvetli kaynatma, düşük ısı uyarısı. |
| sf-mb-kalori-stok | TEYİTLİ | ENN HTP modül 11: 2.100 kcal, +100 kcal / 5°C, %17 yağ, %10–12 protein. |
| sf-mb-iskorbut | TEYİTLİ | NIH ODS: 10 mg eşiği, ~1 ay, RDA 75/90 mg. |
| sf-mb-dis-agrisi | TEYİTLİ | NHS diş apsesi: acil belirtiler ve evde bakım. Tuzlu su NHS'de yok (Hijyen paketine dayanıyor). |
| sf-mb-astim | TEYİTLİ (yasak kontrolü) | İlaç dozu ya da bırakma önerisi yok; kaynaklar yeniden açılmadı. |
| sf-mb-tansiyon | TEYİTLİ (yasak kontrolü) | Aynı. |
| sf-mb-isirgan-corbasi | ZAYIF KALDI | Tehlikeli hata yok; OSU kaynağı yeniden açılmadı. |
| sf-mb-ebegumeci-gozleme | ZAYIF KALDI | Mutfak tarifi; kaynaklar yeniden açılmadı. |
| sf-mb-palamut-ekmegi | ZAYIF KALDI | %20 oranı yalnız FAO AGRIS özetine dayanıyor. |
| sf-mb-kit-ekmek | ZAYIF KALDI | Tarif kaynakları yeniden açılmadı. Çavdar mahmuzu uyarısı yerinde. |
| sf-mb-protein-acligi | ZAYIF KALDI | Tek hakemli kaynak (Bilsborough ve Mann); et gramajı hesaptır. |
| sf-mb-uyku-isik | ZAYIF KALDI | Tehlikeli hata yok; kaynaklar yeniden açılmadı. |

## Değişiklikler: önce → sonra

1. **mama-yoksa, öğün tarifi**
   - Önce: "0–1 ay 40+20 …; 1–2 ay 60+30 …; 3–4 ay 80+40 + 2 silme; 5–6 ay 100+50 + 2 tepeleme" ve ayrı adımda günlük miktar "2–4 ay 6 kez 120 ml; 4–6 ay 6 kez 150 ml". 2–3. ay ve 4–5. ay hiçbir satıra düşmüyordu.
   - Sonra: bantlar öğün hacmine göre birleştirildi: 0–1 ay 40+20+1 silme (60 ml), 1–2 ay 60+30+1 tepeleme (90 ml), 2–4 ay 80+40+2 silme (120 ml), 4–6 ay 100+50+2 tepeleme (150 ml); öğün sayısı 8/7/6/6. "Bu ölçü inek sütü içindir; koyun ve manda sütünü 6 aydan küçüğe vermeyin." "6 aylık olunca seyreltmeyi ve şekeri bırakın."
2. **mama-yoksa, yeniden emzirme**
   - Önce: "sık sık memeye koyarak sütünü geri getirebilir."
   - Sonra: 24 saatte 8–12 kez, her memede 10–15 dk; süt günler ya da haftalar içinde gelir, bu sürede önce meme sonra bardakla ek; yeterlilik: günde 6+ ıslak bez, açık idrar, haftada ≥125 g.
3. **mama-yoksa, note ve 6–12 ay**
   - Önce: "Ev usulü hayvan sütü karışımı yalnız hiçbir seçenek kalmadığında ve kısa süre için son çaredir."
   - Sonra: "… sağlık personeline ulaşılana kadar en kısa süre kullanılacak son çaredir; vitamin-mineral desteği gerekir." 6–12 ayda şekersiz verilmesi; yoğunlaştırılmış süt, yağsız ya da yarım yağlı süt, kahve kreması, soya içeceği yasağı eklendi.
4. **refeeding**
   - Önce: yalnız "risk kimde"; çocuk için ayrım yalnız son adımda.
   - Sonra: 1. adım "Bu hesap çocuk için değildir"; note "yalnız yetişkin ve ergen içindir"; son adım "kilo başına hesabı çocukta kullanmayın … emzirmeyi sürdürün, sık küçük öğün, sıcak tutun". (WHO'nun ağır zayıf çocuk başlangıcı terapötik sütle yaklaşık 100 kcal/kg; 10 kcal/kg bir çocuğu aç bırakırdı.)
   - Artış: "4–7 günde" → "belirti yoksa … en erken 4, en geç 7 günde; 5 kcal/kg ile başlayan 7 günün tamamını kullansın."
   - İzlem: nabız ve nefes sayımı, göz kapağında şişme, soğuk el-ayak, dudakta morarma (MSF); belirti çıkınca "bir önceki düzeye in, en az 1–2 gün kal".
5. **zayiflik-olcme**
   - Önce: "11,5–12,5 cm orta zayıflık".
   - Sonra: "11,5 cm (dahil) ile 12,5 cm'nin altı orta; 11,5 cm'nin (115 mm) altı ağır". 6 ay altı bebekte kol ölçüsü kullanılmaz, doğrudan sağlık ekibine. Tehlike belirtilerine her şeyi kusma, havale, uyandırılamama, hızlı nefes eklendi.
6. **sitma**
   - Önce: "Türkiye'de yerli sıtma bitti"; "yurt içinde bulaşan sıtma 2010'lu yıllarda bitti".
   - Sonra: "bugün yerli sıtma görülmüyor ama … geri dönebilir"; 2002'de 10.184 yerli vaka, 2010'da 9; Sağlık Bakanlığı 2025; "Türkiye DSÖ'nün sıtmadan arındırılmış ülkeler listesinde değil"; 2012 Mardin 219, 2014 Edirne 5 yerli vaka. P. vivax'ın aylar sonra nükseden nöbeti eklendi.
7. **pellagra-beriberi, nixtamalizasyon**
   - Önce: "az miktar söndürülmüş kireçli suda yumuşayana kadar kaynatıp bir gece bekletin" (sayısız).
   - Sonra: "1 kg kuru tane mısıra 2 litre su ve 20 g söndürülmüş kireç (tartı yoksa yaklaşık 2–3 silme yemek kaşığı) … yaklaşık %1 … kaynamaya yakın ısıda 20–45 dakika … bir gece … 2–3 kez yıkama". Kül için: "gücü değişir, oranı verilemez". Yeni `dont`: katkılı inşaat kireci, çimento, boyalı/emprenyeli tahta külü.
8. **kusburnu-alic**: "300 m üstü 10 dakika" → "300–1.800 m 10 dakika, 1.800 m üstü (ör. Erzurum) 15 dakika".
9. **su-tuz**: "saatte 1,5 litre (6 su bardağı)" → "6 su bardağı (yaklaşık 1,4 litre)".
10. **diyabet**: "Hemen şeker … verin" → "Bilinci yerindeyse ve yutabiliyorsa hemen şeker … verin".
11. **gozluk**: su dolu şişe büyüteci için "güneşte açıkta bırakmayın, yangın çıkarabilir".
12. **kurbaga-salyangoz**: toplama aşamasında da eldiven ("salgısında parazit olabilir").
13. **Yeni `note`'lar**: cocuk-beslenme, zayiflik-olcme, pellagra-beriberi, kerevit.

Adım sayıları değişmedi; `art` dizileri ve spec.ts ile uyum korundu (pellagra'da yalnız `dont` maddesi eklendi).

## Uzmana gidecek liste
1. **Çocuk sağlığı / beslenme uzmanı, mama-yoksa:** FHI 360/WHO-AED (2007) tarifinin 2017 IFE OG v3'te hâlâ geçerli olup olmadığı; IFE OG v3 tam metni bu turda açılamadı. Şeker çay kaşığıyla, gram yok. Keçi sütünün aynı ölçüyle kullanılıp kullanılamayacağı metne konmadı. 6–11 ayda hayvan sütü konusunda WHO 2023 (uygun) ile CDC (12 aydan önce verilmez) çelişiyor; WHO izlendi.
2. **Refeeding:** Vitamin ve elektrolit desteği olmadan 10 kcal/kg başlangıç ve 4–7 günlük artış ev ortamında yeterince güvenli mi? MSF yetişkin protokolü terapötik sütle 40 kcal/kg ile başlıyor; rehber daha yavaş olan NICE'ı izliyor. Uzun süre çok düşük enerjide kalmanın kendi riski uzmana sorulmalı.
3. **Ağır zayıf çocuk:** Sağlık ekibine ulaşılamazsa evde ne yapılacağı (WHO ev yapımı F-75 tarifi gibi) bilerek yazılmadı. Tehlike belirtileri IMCI genel listesine göre yazıldı; tam metinle teyit edilmedi.
4. **Halk sağlığı, sıtma:** 2012 Mardin ve 2014 Edirne vakalarının yerli bulaş mı nüks mü olduğu (KLİMİK tablosunda 2014 için 4 nüks yazıyor, metinde 5 yerli vaka). Sağlık Bakanlığı açıklaması bir tarih vermiyor.
5. **Nixtamalizasyon:** Odun külü oranı bulunamadı; kireçte hacim karşılığı (2–3 yemek kaşığı ≈ 20 g) yığın yoğunluğu tahminidir, tartı önerildi.
6. **Alıç çekirdeği** uyarısı, **gözlük onarımı**, **protein açlığı et gramajı**, **tuzlu su çalkalama** (NHS'de yok) kaynakla teyit edilmedi.
