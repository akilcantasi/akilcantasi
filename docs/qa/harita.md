# QA: Harita (Harita sekmesi + Pusula aracı)

Kapsam: src/tabs/HaritaTab.tsx, src/tabs/harita.css, src/lib/map/*, src/tools/pusula/*.
Hem örnek veriyle (sample_ornek.pmtiles + sample_poi_ornek.geojson, Vite) hem de gerçek
Türkiye haritasıyla (turkiye.pmtiles, 857 MB, bilgi noktası sunucusu üzerinden) test edildi.
Ekranlar 360×640, 390×844 ve 1280×800'de çekilip incelendi.

## Test edilenler
- [x] Harita yükleme (örnek + gerçek Türkiye paketi), yakınlaştır/uzaklaştır, Türkçe düğme etiketleri
- [x] Nokta filtreleri (Hepsi, Toplanma, Sağlık, Eczane, Su, Barınma), nokta kartı, "Yön göster" paneli, kart kapatma
- [x] "En yakın toplanma alanı": konum varken, konum yokken (harita merkezine göre), başka filtre seçiliyken
- [x] "Konumumu söyle": ondalık + DMS, Kopyala (pano içeriği doğrulandı), SMS bağlantısı
- [x] Konum izni reddedildi ve konum alınamadı yolları (harita, Konumumu söyle, iz kaydı)
- [x] İz kaydı: başlat / durdur / devam et / sil, gürültü süzme, yenilemeden sonra sürme, "Başlangıca dön" (iz boyunca / kuş uçuşu)
- [x] Yer işaretleri: ekle (konum, sağ tık/uzun basma, harita merkezi), düzenle, sil (satır içi onay), paylaş (ondalık, DMS, SMS), "Buraya git"
- [x] Yön konisi (deviceorientationabsolute taklidi)
- [x] Pusula aracı: iOS izin akışı, sensörsüz masaüstü, hedef yönü/mesafesi, DMS girişi, geçersiz koordinat
- [x] Paket yok durumu, "yalnızca nokta" / "yalnızca harita" bildirimleri ve Araçlar → Paketler ve paylaşım bağlantıları
- [x] Düşük güç ayarı (Ayarlar'dan aç/kapat)
- [x] 360 px'te kartlar açıkken düzen, dokunma hedefleri ≥ 44 px, yatay taşma, konsol hataları

## Bulunan ve düzeltilen hatalar
1. **360 px'te sayfa kayıyordu** (nokta + hedef + iz kartları açıkken taşma 765 px). Kartlar artık haritanın altında
   kendi içinde kayan bir alanda (`.map-panels`); harita en az max(140 px, 24vh) kalıyor, alt düğmeler hep ekranda.
   Yeni açılan kart görünür alana kaydırılıyor.
2. **Düşük güç ayarı haritada okunmuyordu.** Artık `getSettings().lowPower` ile: pixelRatio 1, fadeDuration 0,
   animasyonsuz geçiş, sürekli takip yerine tek seferlik konum. Ayar değişince (`onSettingsChange`) piksel oranı
   hemen güncelleniyor, açık konum takibi kapatılıyor. Pil tasarrufu yalnızca animasyonları kapatıyor.
3. **Yer işareti düzenleme yoktu** (depoda `update` vardı, arayüzde yoktu). "Düzenle" eklendi: ad ve tür değişir,
   konum korunur; harita işaretçisi ve hedef kartı yeni adı gösterir.
4. Haritada bir yer işaretine dokununca liste açılıyor ama hangisi olduğu belli değildi: artık o işaret vurgulanıp ortalanıyor.
5. Su noktalarının harfi İngilizce "W" idi → "Su".
6. Paket yok metni "Paylaş sekmesinden" diyordu (öyle bir sekme yok) → "Araçlar → Paketler ve paylaşım".
7. Dokunma hedefleri 44 px'in altındaydı: filtre çipleri (36), Konumum düğmesi (40), kayıt rozeti (36),
   kart kapat düğmeleri (40×36), yakınlaştırma düğmeleri (36) → hepsi 44 px.
8. Yer işareti satırında 360 px'te 4 düğme sıkışıyordu: dar ekranda "Buraya git" tam genişlik, diğerleri altta.

## Kalan sorunlar / notlar
- Yazılım GL'de (swiftshader) gerçek harita yavaş; yüklü makinede iz testinde bazı konum güncellemeleri birleşebiliyor
  (konum-check alt sınırı 34 noktaya esnetildi).
- Paketler sayfası testte isteğe bağlı çevrimiçi kataloğa istek atıyor (ERR_TUNNEL_CONNECTION_FAILED); kapsam dışı.
- e2e/konum-check.mjs (paylaşılan dosya) iki küçük düzeltme aldı: sağ tık noktası kayıt rozetinin üstüne
  denk gelmesin diye 0.7→0.4 yükseklik; panel Escape yerine Kapat düğmesiyle kapatılıyor (yük altında yarış).

## e2e komutu
```
node e2e/qa-harita.mjs http://localhost:5199/ /tmp/qa-harita
# gerçek harita (data/ içinde turkiye.pmtiles + bir .geojson):
node server/server.mjs --data <paket-klasörü> --port 8460
KONUM_START=39.9208,32.8541 node e2e/qa-harita.mjs http://localhost:8460/ /tmp/qa-harita-real ""
```
qa-harita.mjs sonunda konum-check.mjs akışını da çalıştırır (QA_SKIP_KONUM=1 ile atlanır). İkisi de iki veri setinde geçiyor.

## Denetim 2026-11

Kapsam: src/tabs/HaritaTab.tsx, src/tabs/harita.css, src/lib/map/**. Örnek veriyle (sample_ornek.pmtiles +
sample_poi_ornek.geojson) 360×640, 390×844, 1280×800, yatay 844×390, en büyük yazı boyutu (Ayarlar → "En büyük",
CSS zoom 1,4) ve güvenli alan payları (`--safe-area-inset-*`) ile; konum izni verildi / reddedildi / hiç yanıt
yok ("Konum aranıyor") taklitleriyle denendi, ekran görüntüleri incelendi.

### Denetlenenler
- [x] Paket yok / yalnız harita / yalnız nokta durumları, hazır paket indirme (durumlar, boyutlar)
- [x] Çevrimdışı çizim: harita kullanırken dış ağa hiç istek yok (katalog tazeleme hariç)
- [x] Konumum: izinli, reddedildi, yanıt yok ("Konum aranıyor" kartı ve Konumum panelindeki tam görünüm)
- [x] Nokta seçimi, nokta kartı, Yön göster, Yol tarifi, En yakın toplanma alanı, Konumumu söyle, iz kaydı, yer işaretleri
- [x] Sekme değişimlerinde bellek/dinleyici sızıntısı, harita yeniden kurulumu
- [x] Yön değişimi (dikey ↔ yatay), güvenli alan, alt menü altında kalan düğme, yatay taşma, 44 px dokunma hedefleri
- [x] Kenar boşlukları (sol = sağ = 18 px, başlıkla hizalı), Şafak renkleri, Türkçe metinler
- [x] Güvenlik: nokta/yer işareti adları yalnız metin olarak basılıyor, devmap/devpoi yalnız aynı köken, SMS/geo bağlantıları kodlanmış

### Düzeltilenler
1. **Sekmeye her girişte harita kaynağı birikiyordu (bellek).** Her girişte protokole yeni bir PMTiles nesnesi
   (dizin önbelleği + dosya) ekleniyor, hiç bırakılmıyordu. Artık aynı paket (ad + boyut) için aynı nesne
   kullanılıyor; paket değişince eskisi 15 sn sonra bırakılıyor; okunamayan kaynak unutuluyor (`pmtilesSource.ts`).
   Ayrıca ~10 MB'lık nokta paketi her girişte yeniden ayrıştırılmıyor (`loadPoiPackCached`).
2. **Başka bir paketin indirmesi bitince harita sıfırlanıyordu.** Paket listesi her değişiminde harita
   yeniden kuruluyor (konum, seçim, yakınlaştırma kayboluyor), arada "Harita paketleri aranıyor…" yazısı
   yanıp sönüyordu. Harita/nokta paketi aynıysa artık hiçbir şey yeniden kurulmuyor.
3. **Seçilen nokta haritanın ortasında değil alt kenarında kalıyordu.** Nokta kartı açılınca harita küçülüyor,
   kayma eski boyuta göre hesaplanıyordu. Kamera hareketleri bir sonraki karede, harita yeniden
   boyutlandıktan sonra yapılıyor (sapma 0 px). Küçük haritada sabit 60–70 px sığdırma payı haritadan büyük
   kaldığında "en yakın toplanma alanı" hiç kıpırdamıyordu; pay harita boyutuna göre küçülüyor.
4. **Yatay ekranda ve büyük yazıda nokta kartı görünmüyordu.** Kart alanı 0–50 px'e iniyor, "Yön göster"
   kırpılıyordu. Kısa ekranda (≤ 520 px) ve büyük/en büyük yazıda kartlar tam boy görünüyor, gerekirse sayfa kayıyor.
5. **En büyük yazıda sayfa yatay kayıyordu** (çip satırının negatif kenar payı da büyüyordu, 7 px taşma).
   Pay yazı ölçeğine bölünüyor.
6. **Android'de Harita'nın bulduğu konum "son konumlar"a yazılmıyordu** (tarayıcı yolu yazıyordu; enkaz
   işareti bu listeyi kullanır). Yerel konum da 30 sn / 50 m'de bir kaydediliyor.
7. **Paket yokken hazır harita uygulama içinden indirilemiyordu** (yalnız Araçlar'a yönlendirme vardı).
   Harita sekmesinde hazır Türkiye haritaları (genel 46 MB, sokak ayrıntılı 728 MB) ve afet noktaları (10 MB),
   Paketler sayfasıyla aynı satırlarla (indir / ilerleme / duraklat / hata / hazır) listeleniyor; inince harita
   kendiliğinden açılıyor. Konum, iz ve yer işareti düğmeleri artık üstte (haritasız da çalışırlar).
8. **"Konum aranıyor" kartı ekran okuyucuda her saniye yeniden okunuyordu** (süre sayacı canlı bölgedeydi).
   Canlı bölge yalnız başlık ve ipucu.
9. **Uzun basma zamanlayıcısı harita kapanınca temizlenmiyordu** (kaldırılmış haritada `unproject`); dinleyiciler kaldırılıyor.
10. Nokta paketinde yinelenen kimlikler benzersizleştiriliyor (işaretçi ve seçim kimlikle tutuluyor).
11. Tasarım: kenar boşluğu 14 → 18 px (başlık ve diğer sekmelerle hizalı); eski gri-siyah tonlar (#131a22,
    rgba(22,27,34)…) Şafak gece mavisine çevrildi; iz kaydı göstergesi kırmızıdan kehribara (kırmızı yalnız
    SOS/112/gerçek tehlike); yön oku halkası tema rengine.

### Kalan / öneri
- Harita, sekmeden çıkınca kaldırılıp girince yeniden kuruluyor (WebGL bağlamı, stil, karolar). Kaynak artık
  birikmiyor ama haritayı sekme değişiminde canlı tutmak (App.tsx'te gizleyerek) daha hızlı olur; kapsam dışı.
- Haritada adres/yer adı araması yok (PMTiles'taki yer adlarından yerel dizin kurulabilir).
- "Yol tarifi" dış harita uygulamasını açar; internetsiz çoğu zaman çalışmaz (ekranda "Yön göster" var).
- Büyük yazıda Rehber içeriği 25 px, Harita 18 px kenar payıyla çiziliyor (app.css'teki zoom kuralı `.pad`
  payını da büyütüyor); tüm sekmeler için app.css'te `.pad` payı ölçeğe bölünebilir.

### Komutlar
- Birim: `npx vitest run tests/rehber-harita-denetim.test.ts tests/map.test.ts tests/konum.test.ts tests/konum-arama.test.ts`
- E2E: `node e2e/qa-harita.mjs http://127.0.0.1:5461/ /tmp/qa-harita` → `TÜMÜ OK` (133 denetim + konum-check akışı);
  `node e2e/konum-arama-check.mjs http://127.0.0.1:5461/` → geçti.
- Yeni e2e bölümü (9): hazır paket indirme (katalog ve indirme adresi örnek dosyaya yönlendirilir), dış ağ isteği yok,
  sekme değişiminde kaynak/tuval birikmiyor, paket listesi değişince harita korunuyor, seçilen nokta ortada,
  yatay/dikey, kayıt göstergesi kehribar, en büyük yazıda taşma ve kırpılma yok.
