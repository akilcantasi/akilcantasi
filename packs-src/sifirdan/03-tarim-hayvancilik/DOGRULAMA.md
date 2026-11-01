# 03-tarim-hayvancilik: bağımsız doğrulama raporu

Tarih: 2026-11-02 · 36 rehber · denetim: `npx -y tsx tools/check-sifirdan.ts packs-src/sifirdan/03-tarim-hayvancilik` → hata yok.
Arama kotası: 17 WebSearch (sınır 25). Asıl doğrulama WebFetch ile birincil sayfalardan yapıldı.
Rehber kimlikleri, adım sayıları ve `art` dizileri değişmedi. Bu yüzden spec.ts'e dokunulmadı.

## Sayım
- TEYİTLİ: 4
- DÜZELTİLDİ: 12
- ZAYIF KALDI: 20 (yazar kaydına dayanıyor ya da yalnız ikincil kaynağı var; bunların hiçbirinde güvenlik açısından kritik sayı yok)
- ÇIKARILDI: 0

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-th-toprak-tanima | TEYİTLİ | Clemson yeniden açıldı: 1/3 toprak; 1 dk, 2 sa ve 48 sa. |
| sf-th-tohum-saklama | DÜZELTİLDİ | Kaynaksız "odun külü ile nem çekme" önerisi çıkarıldı. |
| sf-th-atalik-tohum | ZAYIF KALDI | Kaynaklar yeniden açılmadı. Kritik sayı yok. |
| sf-th-fide | DÜZELTİLDİ | Don eşiği değişti (Isparta İl Müd.). |
| sf-th-kompost | ZAYIF KALDI | Yazar kaydı. Kritik risk yok. |
| sf-th-gubre | ZAYIF KALDI | 120/90 gün ve kül miktarı yazar kaydına dayanıyor. Birim çevrimi hesapla doğrulandı. |
| sf-th-filiz | ZAYIF KALDI | Islatma ve gün sayıları kaynaksız. Pişirme uyarısı ve note yerinde. |
| sf-th-ekim-takvimi-yaz | ZAYIF KALDI | Bölgesel il müdürlüğü sebze takvimi bulunamadı. Domatesin "donlar geçtikten sonra" dikilmesi ve -2/-3 °C'de ölmesi Isparta İl Müd. ile teyitli. |
| sf-th-ekim-takvimi-kis | DÜZELTİLDİ | Doğu Anadolu tarihi yanlıştı (aşağıda). |
| sf-th-patates | ZAYIF KALDI | Yazar kaydı. |
| sf-th-uc-kardes | ZAYIF KALDI | Yazar kaydı. Uyarılar doğru. |
| sf-th-bugday-ekim | TEYİTLİ | OMÜ notu: 2–4 cm, kuruysa en az 5 cm, kışlıkta 5–6 cm. 4–6 cm ile uyumlu. |
| sf-th-bugday-hasat | ZAYIF KALDI | Yazar kaydı. Aflatoksin ve tahıl tozu yangını uyarıları yerinde. |
| sf-th-ekim-nobeti | ZAYIF KALDI | Kritik sayı yok. |
| sf-th-zararlilar | DÜZELTİLDİ | Sabun oranı yüksekti. Bitki zararına dair uyarılar eksikti. |
| sf-th-sulama | ZAYIF KALDI | Testi sulamanın yalnız ikincil kaynağı var. Risk düşük. |
| sf-th-teras | ZAYIF KALDI | Birincil kaynak yok. Note 1 m üstü duvarı uzmana bırakıyor. |
| sf-th-sera | ZAYIF KALDI | Ölçüler kaynaksız. Karbonmonoksit ve çökme uyarıları yerinde. |
| sf-th-mantar | DÜZELTİLDİ | Pastörizasyon sıcaklığı eklendi (ICAR-DMR). |
| sf-th-fidan-dikim | ZAYIF KALDI | Dikim aralıkları kaynaksız. Risk düşük. |
| sf-th-asi-kalem | ZAYIF KALDI | Türkçe resmî broşür yok. |
| sf-th-asi-goz | ZAYIF KALDI | RHS yeniden açılmadı. |
| sf-th-budama-genc | ZAYIF KALDI | OSU yeniden açılmadı. |
| sf-th-budama-olgun | ZAYIF KALDI | OSU yeniden açılmadı. |
| sf-th-tavuk-kumes | ZAYIF KALDI | FAO bölüm 4 yeniden açılmadı. Uyarılar doğru. |
| sf-th-tavuk-kulucka | TEYİTLİ | FAO bölüm 5: 12–14 °C, en çok 7 gün, 10 yumurtanın üstünde çıkış düşüyor, 20–21 gün, 1. haftada ışığa tutma. |
| sf-th-tavsan | ZAYIF KALDI | Tek kaynak (PSU). |
| sf-th-keci-koyun | DÜZELTİLDİ | Yasal not yönetmelikle düzeltildi. Bruselloz uyarısı genişletildi. PSU sayıları teyitli. |
| sf-th-sagim | DÜZELTİLDİ | Bruselloz note'u çiğ süt peynirini de kapsayacak biçimde genişletildi (WHO). PSU sayıları teyitli. |
| sf-th-kirkim | ZAYIF KALDI | Yalnız Wikipedia. |
| sf-th-ari-kovan | DÜZELTİLDİ | Yasal not yönetmelikle düzeltildi. İğne çıkarma uyarısı eklendi. FAO'daki 35 mm teyitli. |
| sf-th-ari-bal | DÜZELTİLDİ | Eksik deli bal uyarısı eklendi. |
| sf-th-hayvan-sagligi | DÜZELTİLDİ | Şarbon şüphesinde ne yapılacağı eklendi. |
| sf-th-kesim | DÜZELTİLDİ | Eldiven, kist hidatik ve şarbon uyarıları eklendi. Yasal not düzeltildi. |
| sf-th-ot-yem | TEYİTLİ (yazar kaydı) | Kendiliğinden yanma ve çiftçi akciğeri uyarıları doğru. |
| sf-th-balik-havuzu | DÜZELTİLDİ | Yasal not 1380 md. 13'e göre yeniden yazıldı. |

Keçi-koyun ve sağım rehberlerinin PSU sayıları da teyit edildi, ama bu iki rehber DÜZELTİLDİ grubunda sayıldı. Ot-yem yazar kaydına dayanıyor; yalnız güvenlik uyarıları doğrulandığı için TEYİTLİ sayıldı. Katı ölçüte göre ZAYIF da sayılabilir.

## Değişiklikler: önce → sonra

1. **sf-th-ekim-takvimi-kis (en ciddi)**
   - Önce: "Doğu Anadolu: … Ekimi Eylül ortası–sonunda bitirin." Özet: "İç ve Doğu Anadolu'da Eylül sonu–Ekim."
   - Sonra: "Erzurum ve Kars gibi yüksek yaylalarda 15 Ağustos–5 Eylül; Muş ve Van gibi daha alçak ovalarda 15 Eylül–15 Ekim."
   - Kaynak: OMÜ buğday ders notu. Tablo: Erzurum–Kars 15 Ağustos–1 Eylül, Erzurum 22 Ağustos–3 Eylül, Muş–Van 15 Eylül–15 Ekim.
   - Eski tarih yaylada 2–4 hafta geç kalıyordu. Fide kışa çıplak girer ve donar.
   - Ege de düzeltildi. Önce kıyı Ege 15 Kasım–15 Aralık idi. Sonra Ege 15 Ekim–15 Kasım (İzmir). Edirne, Sakarya ve Konya tarihleri de eklendi.
2. **sf-th-zararlilar**
   - Önce: "1 litre suya yaklaşık 1–2 yemek kaşığı rendelenmiş sade sabun." Sıvı sabunla bu oran %2–4'e kadar çıkar.
   - Sonra: "1 litre ılık suda 1 tatlı kaşığı (5–6 ml) … yaklaşık %1; %2'yi asla geçmeyin."
   - Bitki zararına karşı eklenenler: tam güneşte, 32 °C üstünde ve susuz kalmış bitkiye sıkmama; kiraz, erik ve fidelerde 2–3 saat sonra yaprağı yıkama; daha sık uygulayınca hasarın birikmesi; 15 dakikalık sert su testi; yemeden önce sebzeyi yıkama.
   - Kaynak: Clemson (ticari %1–2, hassas bitkiler, 90 °F) ve UNL (ev yapımında %1 = galona 1,5 yemek kaşığı; ev yapımı daha çok yakar).
3. **sf-th-kesim**
   - Adım 2'ye eklendi: eldiven ya da naylon torba, eldeki açık yarayı kapatma.
   - Adım 8, önce: "ciğerde kist … derin gömün."
   - Adım 8, sonra: karaciğer ve akciğerde su dolu kese (kist hidatik) varsa organı köpeklerin ulaşamayacağı derinliğe gömmek ya da yakmak. Dalak büyük ve kararmışsa, kan pıhtılaşmıyorsa işi bırakıp gövdeyi yakmak (şarbon).
   - `dont`'a eklendi: köpek teması sonrası el yıkama ve aniden ölmüş hayvanı kesmeme.
   - Note, önce: "kesim ruhsatlı kesimhanelerde yapılır." 5996'nın ilgili maddesi bulunamadı.
   - Note, sonra: et için onaylı kesimhane, kurban için belirlenen yerler; açık alanda kesim yasak ve cezalı. Dayanak 2026 Kurban Hizmetleri Tebliği haberi.
4. **sf-th-hayvan-sagligi**
   - Adım 7'ye eklendi: aniden ölmüş, doğal deliklerinden pıhtılaşmayan kan sızan hayvan açılmaz, yüzülmez, taşınmaz; mümkünse yerinde yakılır.
   - `dont`'a eklendi: ortası kararan ağrısız deri yarasında sağlık yardımı aramak.
   - Kaynak: NSW DPI ve Utah Tarım Bakanlığı.
5. **sf-th-ari-bal**
   - `dont`'a eklendi: Karadeniz'de orman gülü (Rhododendron ponticum) balı, yani deli bal. Grayanotoksin içerir; kalbi yavaşlatır, tansiyonu düşürür. Kaynak: Düzce Üniv. olgu sunumu.
6. **sf-th-ari-kovan**
   - Note, önce: "arıcılık kayıt sistemine kayıt gerekir."
   - Note, sonra: işletme ve kolonileri il/ilçe müdürlüğüne kaydettirmek, AKS'den kovan plakası almak; tanımlanmamış koloni taşınamaz. Dayanak Arıcılık Yönetmeliği 2024, md. 8–9.
   - `dont`'a iğne sıyırma uyarısı eklendi.
7. **sf-th-keci-koyun**
   - Note, önce: "küpelenip kaydettirilmesi zorunludur."
   - Note, sonra: işletme tescili (md. 31–32) ve doğumdan en geç bir yıl içinde küpe (md. 13). Dayanak RG 02.12.2011/28130.
   - Bruselloz `dont`'u genişletildi: ölü yavru ve son, eldiven, gömme.
8. **sf-th-sagim**
   - Note, önce: "çiğ süt … bulaştırır."
   - Note, sonra: çiğ süt ve çiğ sütten taze peynir, tulum ve kaymak bulaştırır. Süt taşacak gibi kabarana dek kaynatılır; peynir ve yoğurttan önce de kaynatılır. Kaynak: WHO.
9. **sf-th-balik-havuzu**
   - Note, önce: "yabancı türlerin doğaya bırakılması yasaktır." Kaynakta bulunamadı.
   - Note, sonra: tesis kurmak Bakanlık iznine bağlı (1380 md. 13). Balığı doğal sulara bırakmama artık yasa iddiası olarak değil öneri olarak yazıldı.
10. **sf-th-fide**
    - Önce: "domates -2 °C'de tamamen ölür." Bu ifade hafif donu güvenli gösteriyordu.
    - Sonra: "0 °C civarındaki hafif donda bile zarar görür, -2 ile -3 °C'de ölür." Kaynak: Isparta İl Müd.
11. **sf-th-mantar**
    - Önce: "elinizi tutamayacağınız, kaynamayan su."
    - Sonra: "65–80 °C'lik su … 1–2 saat; saman 5–10 cm kıyılmış." Kaynak: ICAR-DMR.
12. **sf-th-tohum-saklama**
    - Odun külüyle kurutma önerisi çıkarıldı. Kaynaksızdı ve kül alkalidir.

Her rehberin `checked.note`'u "Bağımsız doğrulama: …" diye yenilendi. Hangi sayıların yeniden açılan kaynakla, hangilerinin yalnız yazar kaydıyla desteklendiği açıkça yazıldı. `sources` alanına yalnız bu turda açılan sayfalar eklendi.

## Yasak kontrolü
- Silah, patlayıcı, yay ve mızrak yok.
- İçki tarifi yok.
- İlaç dozu yok. WHO'nun köpekler için önerdiği praziquantel bilinçli olarak eklenmedi.
- Yasal ya da sağlık riski olan her rehberde `note` var: filiz, teras, mantar, keçi-koyun, sağım, arı-kovan, hayvan sağlığı, kesim, balık.
- arı-bal'da note yok. Deli bal ve botulizm uyarıları `dont`'ta duruyor.

## Uzmana gidecek liste
1. **Ziraat mühendisi / il müdürlüğü:** yazlık sebze dikim tarihleri bölge bazında hâlâ resmî takvimle doğrulanmadı. Bu tarihler don verisinden çıkarım. Kışlık ekimde Akdeniz kıyısı tarihi tek kaynaklı (KTAE).
2. **Veteriner:** genel ölü gömme derinliği (1 m) ve kireç kaynaksız. Şarbonda gömme derinliği bulunamadı, yalnız yakma önerildi. Kesim rehberinin tamamı ve kist hidatik uyarıları da veterinere gitmeli.
3. **Halk sağlığı:** bruselloz note'ları ve "taşacak gibi kaynatma" ifadesi.
4. **Mevzuat:** 5996 sayılı Kanun'da kesimhane dışı kesim hükmü (madde bulunamadı). Arıcılık Yönetmeliği'nin hobi arıcısı (10 koloniden az) için istisnası olup olmadığı. Yabancı balık türünün doğaya bırakılmasına dair Su Ürünleri Yönetmeliği maddesi.
5. **Bitki koruma:** ev yapımı sabun oranı (~%1) ve Türkiye'de sabuna hassas bitkiler.
6. **Arıcı:** kışlık bırakılacak bal miktarı, bölgelere göre. Deli bal riski taşıyan bölgelerin sınırı.
7. **ZAYIF kalan diğerleri:** teras, sera, kırkım, aşı-kalem, filiz, sulama (testi). Bunlar birincil kaynakla yeniden yazılmalı.
