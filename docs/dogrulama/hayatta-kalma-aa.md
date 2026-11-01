# Bağımsız doğrulama: hayatta-kalma-aa

Tarih: 2026-11-01. WebSearch kotası bittiği için yalnızca WebFetch kullanıldı. Bu oturumda CDC (tüm su sayfaları), timeanddate, mevzuat.gov.tr (robots), DNT, Ordnance Survey, NPS, Sky at Night açılmadı. Açılanlar: Ready.gov Water, Smokey Bear "How to build your campfire", Wikipedia "Time in Turkey" ve "Polaris", NOAA NCEI manyetik sapma hesaplayıcısı (WMM-2025).

Yön bulma yöntemleri Türkiye için (36–42°K, 26–45°D, kalıcı UTC+3) ayrıca hesapla kontrol edildi: NOAA güneş konumu formülleriyle (denklem zaman düzeltmesi dahil) illere göre öğle anı ve saat yönteminin saat saat hatası hesaplandı (/tmp/hk/sun.py).

Hesaplanan güneş öğle anı (UTC+3): Edirne 12:57–13:28, İstanbul 12:47–13:18, Antalya 12:41–13:11, Ankara 12:32–13:02, Erzurum 11:58–12:29, Van 11:50–12:20 (yıl içindeki aralık).

## hayatta-kalma-su-bulma
- Doğrulanan: Ready.gov Water (doğal suyu arıtma/kaynatma gereği). Diğer içerik (ses, vadi, bitki örtüsü, yağmur/çiy toplama, kuru dere dönemecinin dış kenarını kazma, kar/buzu eritmeden yememe, deniz suyu/idrar) FM 21-76 ile uyumlu bilgi, ancak FM 21-76 ve CDC bu oturumda açılamadı.
- Değişiklik: yalnızca sources (Ready.gov eklendi) ve checked.
- Doğrulanamadı: "sabah-akşam kuşların uçtuğu yön" ipucu (FM 21-76'da tahıl yiyen kuşlar için geçer; zayıf bir ipucu). Kaynak açılamadı.
- Resimler: 1, 2, 5, 6, 8 metinle uyumlu. Sorun yok.

## hayatta-kalma-su-aritma
- Doğrulanan: Ready.gov — 1 dakika fokur fokur kaynatma; klorlu suda 30 dk bekleme.
- Doğrulanamadı (CDC açılmadı): 2000 m (6500 ft) üstü 3 dk; klor/iyotun Cryptosporidium'a zayıflığı; filtrelerin virüsü tutmaması; SODIS 6 saat / %50+ bulutta 2 gün / ≤2 L PET. Değerler bilinen CDC ve Eawag değerleriyle uyumlu, metin değiştirilmedi.
- Değişiklik: sources (Ready.gov) ve checked.
- Resimler:
  - Adım 3, art `hayatta-kalma-su-tablet`: saat rozetinde sabit "30 dk" yazıyor. Metin "paketteki süreye uyun" diyor; klor dioksit tabletleri Cryptosporidium için 4 saate kadar bekleme ister. İstenen: sabit süre yerine paket/okuma simgesi ya da "paketteki süre".
  - Adım 6, art `hayatta-kalma-sodis`: üstü çizili şişelerden ilki şeffaf PET gibi görünüyor (yeşil kapak, mavi su), yasaklanan şeyin renkli şişe mi bulanık su mu olduğu belli değil. İstenen: biri belirgin yeşil/kahverengi renkli cam şişe, biri bulanık sulu şişe, üstleri çizili.
  - Adım 1, 2: uyumlu.

## hayatta-kalma-yon-gunes
- Doğrulanan: gölge ucu geometrisi (gölge güneşin tersine, güneş doğudan batıya gittiği için gölge ucu batıdan doğuya kayar: ilk işaret batı, ikinci doğu; ilk taş solda, ikinci sağda durunca karşı kuzey). Türkiye 36–42°K olduğu için güneş öğlede her mevsim tam güneyde (enlem > 23,4°).
- DEĞİŞİKLİK: Adım 7 "Türkiye'de öğle vakti güneş güneydedir." → güneşin yazın kuzeydoğudan doğup kuzeybatıdan battığı ve tam güney anının batı illerinde saat 13'e, doğu illerinde saat 12'ye yakın olduğu eklendi. Neden: kalıcı UTC+3 yüzünden "öğle (12:00)" Edirne/İstanbul'da güneyden 15–20° doğu kalır; "doğudan doğar" da yazın 30°'ye yakın yanıltır.
- sources (NOAA formülleri) ve checked güncellendi.
- Doğrulanamadı: FM 21-76'nın bekleme süresi (bilinen değer 10–15 dk; rehberdeki 15–20 dk daha güvenli tarafta, değiştirilmedi).
- Resimler: 1, 3, 5, 8 doğru (plan görünümünde B solda, D sağda, kuzey yukarı). Küçük not: adım 1 resmi (`hayatta-kalma-golge-cubuk-1`) zaten taşa "B" koyulduğunu gösteriyor; bu adım 2'nin işi. İstenen: adım 1'de yalnızca çubuk ve gölgesi.

## hayatta-kalma-yon-yildiz
- Doğrulanan: Wikipedia Polaris — kadir ~2 (sönükçe), kutba 0,66°, Dubhe-Merak gösterici yıldızlar. Yükseklik = enlem: Türkiye'de 36–42°, yani ufuk ile tepenin yarısından (45°) biraz aşağı — rehber doğru.
- Hesap: Merak dik açıklığı +56°, Alkaid +49°. 36–42°K'de gösterici yıldızlar batmaz ama en alçak konumda ufkun yalnızca 2–8° üstündedir (sonbahar akşamları); kepçe sapının ucu güney illerde ufkun altına iner.
- DEĞİŞİKLİK: Adım 6'ya "Sonbahar akşamlarında Büyükayı kuzey ufkuna çok yaklaşır ve dağ, ağaç arkasında kalabilir." eklendi (Kassiopeia yedeğinin neden gerektiğini açıklıyor).
- DEĞİŞİKLİK (resim): Adım 3 art `hayatta-kalma-kutup-yildizi-bulma` null yapıldı (aşağıya bakın).
- Doğrulanamadı: "5 kat" kuralı erişilebilir kaynakta bulunamadı (Wikipedia oran vermiyor); yaygın kural, metin bırakıldı.
- Resimler:
  - Adım 3, art `hayatta-kalma-kutup-yildizi-bulma` — YANILTICI, gizlendi. Kepçe sapı kasenin sağ üst köşesine bağlı çizilmiş, ama işaretlenen gösterici yıldızlar kasenin ALT kenarındaki iki yıldız (Merak ve Phecda) ve çizgi yatay olarak sapın tarafına doğru uzatılmış. Doğrusu: sapa bağlı olmayan uçtaki dikey kenar (Merak alt, Dubhe üst); çizgi Merak'tan Dubhe'ye ve kasenin açık tarafından dışarı, ~5 kat uzatılmalı. Bu resme bakan kişi yanlış yıldızı kuzey sanabilir.
  - Adım 1 `hayatta-kalma-buyukayi`: doğru (gösterici yıldızlar kasenin uç kenarı).
  - Adım 5 `hayatta-kalma-kutup-kuzey`, adım 6 `hayatta-kalma-kassiopeia`: kabul edilebilir.

## hayatta-kalma-yon-saat (en ciddi sorunlar)
- Doğrulanan: Wikipedia Time in Turkey — 2016'dan beri kalıcı UTC+3, yaz saati yok. Yöntem (akrep güneşe, akrep ile 12 arasının ortası güney; yaz saatinde 1) geometrik olarak doğru.
- Hesap (İstanbul 41,0K/29,0D ve Van 38,5K/43,4D; 21 Haziran, 1 Kasım, 21 Aralık):
  - İstanbul'da "1" kullanınca kış/sonbaharda hata 0–7°, yazın 20–36°.
  - Van'da "1" kullanınca yazın hata 50°'ye, kışın 14–27°'ye çıkıyor; "12" ile kışın 0–8°, yazın ≤40°. Yani en doğu illerde 12'nin ortası değil, 12 doğru referans. "12 ile 1'in ortası" Van için yaz 43°, kış 6–14° hata veriyor.
  - Güneş saati 18:00'i geçince (yazın batıda saat ~19, doğuda ~18) "küçük açı" kuralı sonucu 150–180° TERS çeviriyor: kişi kuzeyi güney sanar. Yaz akşamları Türkiye'de güneş 20:30'a dek açık olduğundan bu gerçek bir tehlike. Aynısı güneş saati 06:00'dan önce de geçerli.
  - "Öğle saatlerinde hata büyür" iddiası hesapla desteklenmedi (öğle anındaki hata küçük, en büyük hata yaz sabahı/ikindisinde); kaldırıldı.
- DEĞİŞİKLİKLER:
  - Adım 3: "Doğu illerinde 12 ile 1'in ortasını alın" → "çoğu yerde 1; Erzurum, Van gibi en doğu illerde 12; Malatya, Elazığ gibi aradaki illerde 12 ile 1'in ortası".
  - Adım 4: "Akrep ile saat 1 arasındaki" → "Akrep ile bu sayı (çoğu yerde 1) arasındaki" (adım 3 ile tutarlı).
  - Adım 7 eski: "Öğle saatlerinde güneş tepedeyken hata büyür; sabah ya da öğleden sonra kullanın." → yeni: "Sabah 7'den önce ya da akşam 6'dan sonra bu yöntemi kullanmayın. Yazın güneş geç battığı için o saatlerde sonuç ters çıkar, kuzeyi güney sanırsınız."
  - Yeni adım 8: "Bu yöntem kabadır, özellikle yazın 30–40 derece şaşabilir. Bulduğunuz yönü gölge çubuğuyla doğrulayın." (art'a null eklendi; 8 adım.)
  - sources: timeanddate yerine Wikipedia Time in Turkey + NOAA formülleri; checked güncellendi.
- Uzman bakmalı: il sınırları kaba (Malatya/Elazığ ~38–39°D öğle anı ~12:30). Özet (summary) "saat 1" diyor; çoğu nüfus için doğru, bırakıldı.
- Resimler:
  - Adım 4, art `hayatta-kalma-saat-guney`: güneş, adım 2'deki gibi akrebin doğrultusunda değil, sağ üst köşeye kaymış; akrep güneşi göstermiyor gibi duruyor. İstenen: güneş akrep doğrultusunda kalsın, G oku 4 ile 1 arasının ortası (2:30 konumu) olsun. Yön mantığı (öğleden sonra güney akrebin saat yönü tersinde) doğru.
  - Adım 1, 2, 5: uyumlu.

## hayatta-kalma-pusula-harita
- Doğrulanan: NOAA NCEI WMM-2025 manyetik sapma (Kasım 2026): Edirne (41K/27D) 5,9° doğu; Kayseri (39K/35D) 6,1° doğu; Doğubayazıt (39K/44D) 6,2° doğu. 6° sapma ≈ her km'de ~105 m yanal kayma.
- DEĞİŞİKLİK: Adım 8 "Birkaç kilometreden uzun yürüyecekseniz ... düzeltme yapın." → "1 kilometreden uzun ... Türkiye'de sapma yaklaşık 6 derece doğudur; düzeltmezseniz her kilometrede yaklaşık 100 metre kayarsınız." (Sisli/ormanlık arazide 3 km'de ~300 m kayma hedefi kaçırtır.)
- DEĞİŞİKLİK: Adım 4'e "ve kadrandaki kuzey oku haritanın kuzeyine (üstüne) baksın" eklendi. Bu olmadan kadran 180° ters ayarlanabilir; en sık pusula hatası.
- Doğrulanamadı: DNT/OS adım sırası (sayfalar açılmadı); adımlar standart taban plakalı pusula yöntemiyle uyumlu. Sapma düzeltmesinin YÖNÜ (kadranı hangi yöne çevirmek) bilerek yazılmadı; uzman, Türkiye için basit bir kural ("haritadan alınan açıdan 6° çıkarın") eklemeyi değerlendirmeli.
- Resimler: 1, 3, 4, 5, 6 uyumlu (adım 4'te kadranın K'si yukarıda, çizgiler ızgaraya paralel — yeni metinle uyumlu).

## hayatta-kalma-ates
- Doğrulanan: Smokey Bear — çadır/bitkiden en az 15 ft (~5 m), en az 10 ft (~3 m) çaplı temizlenmiş alan, taşla çevrili ya da ~30 cm çukur, söndürme "boğ-karıştır-boğ-elin tersiyle yokla", "dokunamayacak kadar sıcaksa bırakılamayacak kadar sıcaktır".
- DEĞİŞİKLİK: Adım 9 "hemen rüzgârın tersine uzaklaşın ve 112'yi arayın" → "söndürmeye uğraşmayın; rüzgârın tersine, yangının yanından uzaklaşın, yokuş yukarı kaçmayın ve 112'yi arayın." (yangin.ts orman yangını rehberiyle tutarlı; yokuş yukarı kaçış ölümcül tuzak.)
- Doğrulanamadı: 6831 sayılı Orman Kanunu md. 76'nın tam metni (mevzuat.gov.tr robots engeli). Adım 1'deki "orman içinde ve yakınında izinsiz ateş yasaktır" ifadesi genel olarak doğru bilinir, ancak mesafe (kanunda/genelgelerde) ve dönemsel yasaklar uzmanca kontrol edilmeli.
- Resimler: 2, 4 (3 m çap okuyla doğru), 5, 8, 9 uyumlu.

## hayatta-kalma-barinak
- Doğrulanan: erişilebilir resmi kaynak bulunamadı (FM 21-76, NPS açılmadı). İçerikte belirgin hata yok: yer seçimi (dere yatağı, taş düşmesi, ölü ağaç), zemin yalıtımı, küçük barınak, girişin rüzgâr altına bakması, parlak işaret bezi genel bilgiyle uyumlu. Soğuk havanın vadi tabanında toplanması doğru.
- Değişiklik: yalnızca checked notu (doğrulanamadığı belirtildi).
- Uzman bakmalı: tüm rehber (dağ arama-kurtarma / JAK uzmanı).
- Resimler:
  - Adım 5, art `hayatta-kalma-barinak-dal`: dallar sırığın altına kısa saçaklar gibi asılmış, yere ulaşmıyor; yapraklı örtü havada duruyor. Bu işlevsel bir sundurma (lean-to) değil. İstenen: sırık iki ağaca bağlı, dallar sırıktan yere eğik dayanmış (bir yanı kapalı üçgen kesit), yaprak katı dalların üstünde, kişi alçak tarafın altında yaprak yatakta.
  - Adım 2, 4, 6 (rüzgâr kapalı sırta çarpıyor, giriş rüzgâr altında — doğru), 9: uyumlu.

## Test
`npx vitest run tests/guides.test.ts`: 191/191 geçti (düzenlemelerden sonra).
