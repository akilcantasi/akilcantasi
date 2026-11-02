# 15-hayvan-tarim-ek: bağımsız doğrulama raporu

Tarih: 2026-11-02 · 16 rehber · denetim: `npx -y tsx tools/check-sifirdan.ts 15-hayvan-tarim-ek` → hata yok.
Arama kotası: 2 WebSearch (sınır 25). Asıl doğrulama WebFetch ile birincil sayfalardan yapıldı.
Rehber kimlikleri değişmedi. Yalnız sf-ht-toynak'a bir adım eklendi; `art` dizisinin başına `null` kondu, çizim kimlikleri aynı. spec.ts'e dokunulmadı.

## Sayım
- TEYİTLİ: 2
- DÜZELTİLDİ: 7
- ZAYIF KALDI: 7 (kaynak yeniden açılmadı ya da yalnız ikincil kaynak var; hiçbirinde güvenlik açısından kritik sayı yok)
- ÇIKARILDI: 0

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-ht-dogum-hazirlik | DÜZELTİLDİ | NC A&T, Cornell, Bristol, Scottish Gov., CDC yeniden açıldı; sayılar tutuyor. Çiğ süt uyarısı, tozla bulaşma, düşük yapanı ayırma eklendi. |
| sf-ht-dogum-zor | DÜZELTİLDİ | Bristol: 30/60 dk, koni el, U/Z, ayağı avuçlama, aşağı yay çekme teyitli. Note'a Q humması ve gebe kadın eklendi. Antibiyotik dozu yok, veterinere bırakılıyor. |
| sf-ht-dogum-yenidogan | DÜZELTİLDİ | Ağız sütü miktarı alt sınır olarak yazıldı, 24 saat toplamı eklendi (Cornell). Eksik zoonoz note'u eklendi. |
| sf-ht-toynak | DÜZELTİLDİ | Kesimci güvenliği adımı eklendi (MSU). Apse banyosu UMN'ye göre düzeltildi. NMSU sayıları teyitli. |
| sf-ht-pancar-seker | DÜZELTİLDİ | FB 1241 tam metni açıldı. Bitiş eşiği +12 °F = 6,7 °C. Kireç uyarısı ve yanık note'u eklendi. |
| sf-ht-ipekbocegi | DÜZELTİLDİ | 5. yaş sıcaklığı düzeltildi (Dicle). Sönmüş kirecin göze kaçma uyarısı eklendi. Öbür sayılar teyitli. |
| sf-ht-gri-su | DÜZELTİLDİ | Kaynaksız "sabun deterjandan iyidir" çıkarıldı. Asitli toprak bitkileri ve meyvesi toprağa değen bitkiler eklendi. Note eklendi. |
| sf-ht-kopek-bekci-suru | TEYİTLİ | Texas A&M'deki bütün sayılar tutuyor. Saldırı eğitimi yasağı note ve dont ile açık. Elektrikli tasma alınmamış. |
| sf-ht-guvercin | ZAYIF KALDI | Extension.org sayıları teyitli. Kuluçka 17–18 gün yine yalnız zayıf kaynaktan (genel bilgiyle uyumlu). |
| sf-ht-kedi-kemirgen | TEYİTLİ | CDC: 1–5 gün, her gün kum, çiğ et yok, eldiven, kum havuzu teyitli. Gebelere uyarı tutucu önlem. |
| sf-ht-kopek-temel | ZAYIF KALDI | Kaynak yeniden açılmadı. Yöntem şiddetsiz. Tek sayı WHO 15 dk (doğru). |
| sf-ht-kopek-iz | ZAYIF KALDI | Yalnız köpek kulübü kaynakları var. Kritik sayı yok. |
| sf-ht-at-esek-egitim | ZAYIF KALDI | MSU yalnız ipi ele dolamamayı teyit etti. Öbür kaynaklar açılmadı. Note yerinde. |
| sf-ht-baltalik | ZAYIF KALDI | 6831 m.91 resmî metni yine açılamadı. İkincil özet note ile uyumlu. KTÜ sayıları yeniden açılmadı. |
| sf-ht-fidanlik | ZAYIF KALDI | Yeniden açılmadı. Risk düşük. |
| sf-ht-kurak-tarim | ZAYIF KALDI | Yeniden açılmadı. Risk düşük. |

## Değişiklikler: önce → sonra

1. **sf-ht-pancar-seker (kireç ve bitiş sıcaklığı)**
   - Önce: kireçten hiç söz edilmiyordu. "suyun kaynadığı sıcaklıktan 6,5 °C yükseğe çıkınca (deniz kıyısında yaklaşık 106,5 °C)". Note yoktu.
   - Sonra: Adım 6'ya şu eklendi: "Fabrikalar suyu kireç ve karbondioksitle arıtır; evde kireç katmayın, yakıcıdır ve şuruptan ayrılamaz." Yeni dont: "Suya kireç (sönmüş ya da sönmemiş) katmayın…". Özete "Kireç katmayın." eklendi. Bitiş: "önce aynı termometreyle o yerde suyun kaç derecede kaynadığını ölçün; … yaklaşık 6,5–7 °C yükseğe (deniz kıyısında yaklaşık 106,5–107 °C)". FB 1241'de bu değer +12 °F. Note: kaynayan şurup yanığı, çocukları ocaktan uzak tutma, kireçle arıtmanın evde yapılmaması. Alkol dont'una "içilmez" sözü eklendi.
2. **sf-ht-dogum-hazirlik (zoonoz)**
   - Önce: "Gebe kadınlar doğuran ve yeni doğurmuş hayvana yaklaşmasın." Çiğ süt ve tozla bulaşmadan söz edilmiyordu.
   - Sonra: Note'a şu eklendi: "…ve bunların bulaştığı toz…; gebe kadınlar … doğum bölmesine ve bu hayvanların çiğ sütüne yaklaşmasın." Yeni dont: "Sütü kaynatmadan içmeyin, çiğ sütten peynir yapmayın; bruselloz ve Q humması en çok böyle bulaşır." Adım 9'a "Düşük yapan hayvanı sürüden ayırın…" ve "giysiyi ayrı yıkayın" eklendi. Kaynak: CDC Q fever ve bruselloz.
3. **sf-ht-dogum-yenidogan (ağız sütü)**
   - Önce: "ilk 18 saatte vücut ağırlığının yaklaşık onda biri… 4 kg kuzu için 8 saatte 200 ml, 18 saatte 400 ml." Note yoktu.
   - Sonra: Miktarlar "en az" olarak yazıldı. Şu eklendi: "ilk 24 saatte küçük öğünlerle 650–750 ml kadar". Cornell 2,5–3 oz/lb diyor (≈160–190 ml/kg). Zoonoz note'u eklendi.
4. **sf-ht-toynak (kesimci güvenliği)**
   - Önce: güvenlik yalnız note'ta vardı ("hayvanı biri tutsun").
   - Sonra: Yeni 1. adım: hayvanı göz hizasında, kolay çözülen düğümle ve en çok bir kol boyu iple bağlayın; vücudunuzu yakın tutun; çömelmeyin, oturmayın, başınızı karnın altına sokmayın. `art` başına `null` eklendi. Apse banyosu: "ılık tuzlu su" yerine "ılık su (varsa içine İngiliz tuzu katarak)" (UMN).
5. **sf-ht-gri-su (sabun ve bitkiler)**
   - Önce: "Sade sabun deterjandan iyidir." "Yalnız … meyveli sebzelere verin."
   - Sonra: "az sodyumlu, fosfatı az, boraksız; çamaşır suyu (klor) ve yumuşatıcı içermeyen ürün … Çamaşırda yıkama suyundan çok durulama suyunu alın". Bitkiler: "yenen kısmı topraktan yüksekte kalan sebzeler (domates, biber, fasulye) dibinden"; çilek-kabak hariç; asitli toprak seven bitkiler hariç (NMSU: gri su baziktir). Note: dışkı mikrobu, hastalıkta kullanmama, çocuk ve hayvan.
6. **sf-ht-ipekbocegi**
   - Önce: "Oda 22–24 °C, nem %70–75" (4–5. yaş birlikte).
   - Sonra: 4. yaşta 22–24 °C ve %75, 5. yaşta 20–23 °C ve %70 (Dicle). Yeni dont: kireci eldiven ve ağız örtüsüyle serpin; göze kaçarsa bol suyla yıkayın.
7. **sf-ht-dogum-zor**
   - Note'a "ve Q humması" ile "gebe kadınlar katılmasın" eklendi.
8. Bütün rehberlerde `checked.note` "Bağımsız doğrulama: …" diye yenilendi. Doğrulanan yeni kaynaklar eklendi: CDC Q fever ve MSU Extension. FB 1241 bağlantısı tam metne çevrildi.

## Özel kontrol listesi
- Doğum müdahale sınırları: 30 dk ve 60 dk (Bristol), 1 saat kuralı (NC A&T). "Düzeltemiyorsan bırak" yazılı. Antibiyotik ya da ilaç dozu yok, yalnız "kendi kafanıza göre yapmayın" deniyor.
- Köpek: rehberlerde vurma, sert tasma ve elektrikli tasma yok. Saldırı ve ısırma eğitimi note'ta açıkça reddediliyor.
- Baltalık: 6831 m.91 note'u ikincil kaynakla uyumlu. Resmî metin bu ortamdan açılamadı.
- Yasaklar: silah ve patlayıcı yok. İçki tarifi yok; pancar rehberinde mayalandırma yasağı ve metanol uyarısı var. İlaç dozu yok.

## Uzmana gidecek liste
1. Veteriner: baş geride kalınca ip ilmeği kullanılsın mı? Bristol kullanıyor, rehber yalnız el diyor. Kayganlaştırıcı yoksa ne kullanılır? Kaç dakika denedikten sonra bırakılır?
2. Veteriner: yardım edilen anneye antibiyotik verilmesi. Rehber bunu bilinçli olarak yazmıyor; veterinere bırakılıyor.
3. Nalbant: güvenlik adımındaki "çömelmeyin, oturmayın" kısmı ve nal çakma ilkeleri.
4. Hukukçu: 6831 m.91'in güncel metni. Kendi arazisindeki baltalık ya da orman sayılan özel alan için izin durumu.
5. Gıda mühendisi: termometresiz şurup bitiş ölçütü ("pekmez kıvamı") ve katı şeker kurutma adımı. Kaynak yalnız blog.
6. Kuşçu: güvercin kuluçka süresi. Rehberde 17–18 gün; genel bilgi 17–19 gün diyor.
7. Ziraat: gri suyla domates ve biber gibi çiğ yenen meyveli sebzeleri sulamak, yalnız dipten sulama koşuluyla kabul edilebilir mi?
