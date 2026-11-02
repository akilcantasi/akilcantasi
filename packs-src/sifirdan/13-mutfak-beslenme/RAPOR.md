# Sıfırdan: Mutfak, beslenme ve ilaçsız sağlık — kaynak raporu

Paket: `sifirdan-mutfak-beslenme` · 24 rehber · 3 kategori (sf-mb-mutfak 188, sf-mb-kitlik 189, sf-mb-saglik 190) · 2026-11-02

Not: Web arama kotası nedeniyle yaklaşık 25 arama yapıldı; doğrulamanın çoğu WebFetch ile birincil sayfalardan yapıldı. NICE CG32'nin "Recommendations" sayfası, WHO iskorbüt ve pellagra belgeleri (UNHCR arşivindeki PDF'ler) tam metin olarak okundu. Erişilemeyenler: NHS diyabet ayak ve tansiyon önleme sayfaları, WHO sıtma vektör kontrolü soru-cevap sayfası, IFE Operasyonel Rehber v3 tam metni (yalnız sektör özetleri okundu), BMJ refeeding makalesi (reCAPTCHA).

## Katalogdan sapmalar
- 348 ikiye bölündü: `sf-mb-kurbaga-salyangoz` ve `sf-mb-kerevit`.
- 349'da ısırgan ayrı rehber oldu (`sf-mb-isirgan-corbasi`); ebegümeci kavurma ile otlu gözleme birleştirildi (`sf-mb-ebegumeci-gozleme`).
- 351'deki "şekersiz meyve kurusu" ayrı rehber yapılmadı; Yiyecek saklama paketindeki "Meyve kurutma" ve "Pestil ve köme" rehberleri zaten kapsıyor. Kuşburnu-alıç rehberine şekersiz saklama adımı eklendi.
- 362 üçe bölündü: `sf-mb-diyabet`, `sf-mb-tansiyon`, `sf-mb-astim`.
- Yeni rehber: `sf-mb-zayiflik-olcme` (çocukta kol çevresi ve ödemle ağır zayıflığı tanıma). Açlık sonrası beslenme ve çocuk beslenmesi rehberlerinin ihtiyaç duyduğu ölçüt; katalogda yoktu.
- Tekrar edilmeyen mevcut rehberler: ana uygulamada "Afette emzirme ve bebek beslenmesi", "Kronik hastalık ve ilaçlar", "Şeker hastasında şeker düşmesi", "Ağır astım krizi", "Uyku sorunu ve stres", "Diş çıkması, diş kırılması..."; Yiyecek bulma paketinde "Kerevit ve kurbağa yakalama", "Meşe palamudunu yenir hale getirme"; Yiyecek saklama paketinde "Ekşi mayalı ekmek", "Pestil"; Hijyen paketinde "Sıvı kaybı", "Diş temizliği"; Ateş paketinde "Saman kutu". Bu paketteki rehberler bunlara gönderme yapıyor, yinelemiyor.

## Rehber başına kaynaklar
- sf-mb-kurbaga-salyangoz — CDC Angiostrongylus; Hong ve ark. 2010 (PMC2815971) sparganoz; Mother Earth News escargot; FoodSafety.gov sıcaklıklar.
- sf-mb-kerevit — CDC Paragonimus (63°C, turşu/tuzlu kerevit); FoodSafety.gov; Yiyecek bulma paketi.
- sf-mb-isirgan-corbasi — Oregon State Ext. EM 9373; Yemek.com ısırgan çorbası; WHO iskorbüt (C vit. kaybı).
- sf-mb-ebegumeci-gozleme — Yemek.com ebegümeci yemeği; İşçi Haber Ege usulü kavurma; Yemek.com mayasız gözleme.
- sf-mb-palamut-ekmegi — FAO AGRIS palamut unlu ekmek (en çok %20, +%3 su); Popular Science (kavurma, demleme).
- sf-mb-kusburnu-alic — Yemek.com kuşburnu marmelatı; NCHFP pektinsiz reçel; NCHFP az şekerli ürünler; WHO iskorbüt.
- sf-mb-kit-ekmek — Western Producer arpa unu (en çok 1/3); Yemek.com Karadeniz mısır ekmeği; Yemek.com gözleme hamuru.
- sf-mb-tek-tencere — CFS Hong Kong kuru fasulye (12 saat, 10 dk); FoodSafety.gov 74°C; UNHCR tayın; WHO iskorbüt.
- sf-mb-kalori-stok — ENN FEX 3 WFP/UNHCR özet (2.100 kcal, %10–12 / %17); UNHCR "Food and nutrition needs in emergencies" (örnek tayın, kcal/100 g, sıcaklık ve iş ekleri); ENN HTP Modül 11; USAID FOG.
- sf-mb-protein-acligi — Bilsborough ve Mann 2006; Science-Based Medicine.
- sf-mb-iskorbut — WHO/NHD/99.11; NIH ODS C vitamini; ENN FEX 1.
- sf-mb-pellagra-beriberi — WHO/NHD/00.10 pellagra; ENN FEX 3 tiamin özeti; NIH ODS tiamin.
- sf-mb-refeeding — NICE CG32 1.4.6–1.4.8; EBSCO Research Starters.
- sf-mb-su-tuz — CDC NIOSH sıcak stresi önerileri; WHO tuz; UNHCR iş ekleri.
- sf-mb-cocuk-beslenme — WHO IYCF; WHO 2023 tamamlayıcı beslenme (ENN FEX 72); IFE OG sağlık özeti; CDC botulizm; CDC inek sütü.
- sf-mb-mama-yoksa — FHI 360/WHO-AED taze inek sütü broşürü; en-net (WHO alıntısı); IFE OG; WHO 2023; CDC.
- sf-mb-zayiflik-olcme — CMAM Eğitim Modülü 2; WHO IYCF; NICE CG32.
- sf-mb-diyabet — NHS Tip 2 diyabet beslenme; NHS hiperglisemi; CDC diyabet ve ayak.
- sf-mb-tansiyon — WHO tuz; WHO hipertansiyon.
- sf-mb-astim — CDC astım tetikleyicileri; WHO ev içi hava kirliliği.
- sf-mb-sitma — WHO sıtma; Sağlık Bakanlığı 25.04.2025 açıklaması (NTV); Özbilgin/KLİMİK; Türkiye Parazitoloji Dergisi 2019; CDC sivrisinek.
- sf-mb-gozluk — College of Optometrists; WebMD.
- sf-mb-dis-agrisi — NHS diş apsesi; Hijyen paketi diş temizliği.
- sf-mb-uyku-isik — CDC uyku; NHS mevsimsel depresyon.

## Açık kalan şüpheler (uzmana sorulacaklar)
1. **Mama yoksa (sf-mb-mama-yoksa):** Ev usulü inek sütü tarifi FHI 360'ın WHO/AED uyarlamasından (2007) alındı; şeker kaşıkla verilmiş, gram yok. Güncel IFE v3 tam metni okunamadı; bu tarifin hâlâ önerilip önerilmediği ve ölçüleri çocuk sağlığı uzmanına sorulmalı. 6–11 ay hayvan sütü konusunda WHO 2023 (uygun) ile CDC (12 aydan önce verilmez) çelişiyor; kıtlık bağlamı için WHO izlendi.
2. **Açlık sonrası beslenme (sf-mb-refeeding):** NICE hastane ortamı için yazılmış; vitamin/elektrolit desteği ve kan izlemi olmadan yalnız yavaş artışın yeterli güvenliği sağladığı şüpheli. Gün gün artış örneği NICE aralığından türetilmiş hesaptır. BMI yerine görünür zayıflık ölçütü kullanıldı.
3. **Pellagra (sf-mb-pellagra-beriberi):** Mısırı kireç/külle işlemenin oranı ve süresi güvenilir kaynakla doğrulanamadı; adım sayısız yazıldı. Bebek beriberisi ayrıntısı (yaş, belirtiler) WHO tam metninden okunamadı; genel ifade kullanıldı. Tiaminazlı besin örnekleri metne konmadı.
4. **Protein açlığı:** "Yağ isteği" belirtisi kaynaklarda doğrulanamadığı için yazılmadı. Et gramajı yaklaşık hesaptır.
5. **Kurbağa:** Kurbağa için ayrı bir güvenli iç sıcaklık bulunamadı; kanatlı ölçüsü (74°C) tutucu olarak kullanıldı. Kerevit için 5 dakika süre mutfak ölçüsü; asıl ölçüt pişme belirtisi ve CDC 63°C.
6. **Alıç çekirdeği:** "Çekirdekleri ezip katmayın" uyarısı siyanojenik glikozit bilgisine dayanıyor; bu oturumda kaynakla teyit edilmedi.
7. **Sıtma:** "Yerli bulaş 2010'lu yıllarda bitti" denildi; Özbilgin sunumunda 2012 Mardin (219 vaka) ve 2014 Edirne (5 vaka) yerel kümeler var, TPD 2019 ise 2010'dan beri yerli vaka yok diyor. Halk Sağlığı uzmanına sorulmalı. Türkiye'nin DSÖ sıtmasız sertifikası durumu doğrulanamadı; metne konmadı.
8. **Gözlük onarımı** adımları ve iğne deliği boyutu kaynakla doğrulanmadı (delik boyutu yazılmadı).
9. **Çocukta zayıflık:** Tehlike belirtileri listesi genel IMCI bilgisiyle yazıldı; CMAM modülünde ayrıca doğrulanmadı.
10. **Diyabet tabak modeli** NHS sayfasında yok; genel beslenme önerisi olarak eklendi.
