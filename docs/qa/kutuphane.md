# QA: Kütüphane

Kapsam: `src/tabs/KutuphaneTab.tsx`, `src/lib/library.ts`, `src/lib/zim/*`, `src/lib/sanitize.ts`.
Tarih: 2026-11-01. Gerçek tarayıcı (Playwright/Chromium), derlenmiş uygulama `server/server.mjs` üzerinden.

## Test edilenler

Veri kurulumları:
- [x] Paket yok (boş veri klasörü): boş durum kartı, "Paketleri yönet" → Araçlar › Paketler ve paylaşım
- [x] Örnek ZIM'ler (`testdata/*.zim`: iki örnek Vikipedi + WikiMed örneği; biri Xapian dizinsiz, eski ad alanlı)
- [x] Gerçek 1,2 GB Türkçe Vikipedi mini (tek kaynak: kaynak seçici gizli)
- [x] Çoklu kaynak: gerçek Vikipedi + `sample_med_en.zim`

Kaynaklar:
- [x] Kaynak seçici, "Tümü" (sayı rozeti), seçimin yeniden yüklemede korunması, yer tutucu metni
- [x] Üstveri kartı: madde sayısı (700.883), dil adı, boyut, tam metin dizini etiketi; "Tüm kaynaklar" özeti
- [x] Ana sayfa bağlantıları (her kaynak için)

Arama:
- [x] Başlık araması, kelime içi/kelime öneki ("anadolu fay")
- [x] Türkçe duyarsızlık: İSTANBUL / Istanbul / ıstanbul / istanbul, "cig kofte" → Çiğ köfte, Izmir → İzmir
- [x] Yazım hatası (istanbl, hipotremi) ve "benzer yazılışlar" notu
- [x] Tam metin ("Metinde geçenler"), kaynak etiketleri, WikiMed'e süzme
- [x] Boş sonuç, özel karakterler (`(`, `*`, `"`), 200 karakterlik sorgu (taşma yok)
- [x] Enter ile ilk sonucu açma

Geçmiş ve rastgele:
- [x] Son aramalar: kayıt, kalıcılık, chip'e tıklayınca arama, uzun sorgu chip'i
- [x] Temizle → Vazgeç / Evet, temizle (yeniden yüklemede de boş)
- [x] Rastgele makale: Tümü, Vikipedi, WikiMed

Makale görünümü:
- [x] İç bağlantılar, geri/ileri yığını, "Sonuçlara dön" (makale sekme değişiminde açık kalır)
- [x] Görseller arşivden blob URL ile (örnek ZIM); mini ZIM'deki saydam SVG yer tutucular gizli
- [x] Çapa bağlantıları, ölü bağlantılar, dış bağlantılar
- [x] Sayfada bul: Türkçe duyarsız (DEPREM/depr, ISI/ısı), sayaç, Enter/Shift+Enter, Escape, 0 eşleşme, odak
- [x] Yazı boyutu (3 kademe, bul işaretleri korunur, kalıcı)
- [x] "Bu makale hakkında Fener'e sor": Fener'e geçer, soru ve makale bağlamı gider, kaynak gösterilir
- [x] XSS: `node e2e/sanitize-check.mjs` → TÜMÜ OK

Genel:
- [x] 360×640, 390×844, 1280×800 düzen; yatay taşma yok; dokunma hedefleri ≥ 44 px
- [x] Konsol hatası yok; `npx tsc --noEmit` ve `npx vitest run` (1271 test) yeşil
- [x] Türkçe metinler gözden geçirildi (yazım hatası bulunmadı)

## Bulunan ve düzeltilen hatalar

1. **Büyük "I" / "ı" ile aranan İ-li başlıklar bulunmuyordu** (`src/lib/zim/index.ts`, `searchTitles`).
   "Istanbul", "ISTANBUL", "ıstanbul" aramasında ilk sonuç "Istanbul" yönlendirmesiydi; asıl "İstanbul"
   maddesi ve İstanbul (İl) vb. listede hiç yoktu. Neden: harf varyantı dallanmasında ilk dal ("I…")
   30 sonuçluk sınırı tek başına dolduruyor, "İ…" dalı hiç aranmıyordu. Düzeltme: sonraki her dolu
   varyant dalına küçük ek pay (en fazla 8, toplam üst sınır 3×limit). Birim testi eklendi
   (`tests/kutuphane-real.test.ts`).
2. **Enter yarışı**: sorgu yazıp hemen Enter'a basınca, sonuçlar henüz gelmediği için önceki sorgunun
   ilk sonucu açılıyordu (ör. "hipotermi" sonuçları görünürken "deprem" + Enter → Hipotermi). Artık
   yeni sorgunun sonucu beklenip onun ilki açılır.
3. **Aynı adlı kaynaklar ayırt edilemiyordu**: iki Türkçe Vikipedi paketi varsa iki "Vikipedi" chip'i
   ve aynı etiketli sonuçlar çıkıyordu. `disambiguateLabels`: "Vikipedi (mini 2026-09)" /
   "Vikipedi (maxi 2025-12)", ayırt edilemezse dosya adı. Birim testi eklendi.
4. **Ölü bağlantılar tıklanabilir görünüyordu**: mini ZIM'lerde kaynakça geri bağlantıları (`#cite_ref-…`)
   hedefsiz; arşivde olmayan maddelere bağlantılar da turuncu görünüp hiçbir şey yapmıyordu.
   `sanitize` hedefsiz çapaların href'ini kaldırır; href'siz bağlantılar düz metin rengindedir.
5. **Çapaya atlayınca hedef yapışkan çubuğun altında kalıyordu**: `.kt-body [id] { scroll-margin-top }`.
6. **Tablo hücrelerinde kelimeler harf harf bölünüyordu** ("IOC k / odu"): hücrelerde
   `overflow-wrap: break-word` (tablolar zaten yatay kaydırılabilir kapta).
7. **Makaleden dönünce sonuç listesi en üste atlıyordu**: kaydırma konumu saklanıp geri yükleniyor.
8. Uzun geçmiş sorguları chip'i ekran dışına taşırabiliyordu: üç nokta ile kısaltılıyor.
9. Kaynak değişince eski "Bu kaynakta açılabilecek makale bulunamadı" uyarısı kalıyordu: sıfırlanıyor.

## Kalan sorunlar / notlar

- Uygulama genelinde donanım/tarayıcı "geri" tuşu makaleden çıkmıyor (popstate yok; `App.tsx`/store kapsam dışı).
- Sayfada bul, öğe sınırlarını aşan eşleşmeleri bulmaz (ör. bağlantıyla bölünmüş "fay hattı").
- Tek harflik "a" aramasında birleştirme, "A" yerine "Â" başlığını gösterebiliyor (aynı katlanmış başlık; önemsiz).
- İlk (soğuk) arama HTTP üzerinden 2–3 s, makine yükü yüksekken daha uzun sürebiliyor.
- Paketler aracının çevrimiçi katalog isteği kum havuzunda tünel hatası veriyor (kapsam dışı).

## E2E komutu

```
npm run build        # ya da: npx vite build --outDir /tmp/kt-dist  (sunucuya --dist /tmp/kt-dist)
D=/tmp/qa-kt; rm -rf $D; mkdir -p $D/bos $D/ornek $D/tek $D/coklu
cp testdata/*.zim $D/ornek/
ln -s /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim $D/tek/
ln -s /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim $D/coklu/ && cp testdata/sample_med_en.zim $D/coklu/
for x in "bos 8096" "ornek 8095" "tek 8097" "coklu 8098"; do set -- $x; node server/server.mjs --data $D/$1 --port $2 & done
node e2e/qa-kutuphane.mjs          # QA regresyonu (11 adım)
node e2e/kutuphane-check.mjs http://localhost:8098
node e2e/sanitize-check.mjs
```

## Denetim 2026-11

Kapsam: `KutuphaneTab.tsx`, `KutuphaneMagaza.tsx`, `KutuphaneCeviri.tsx`, `PdfOkuyucu.tsx`, `src/lib/packs-ui.tsx`.
360×640, 390×844, 1280×800 ve en büyük yazı boyutunda; dört bilgi noktası kurulumu (boş, örnek, tek, çoklu),
dev sunucusunda `?devzim=`, 400 sayfalık PDF'li sınama arşivi ve yavaşlatılmış paket sunucusuyla denendi.

### Denetlenenler
- [x] Arama (başlık + tam metin), kaynak kutucukları, makale okuyucu (geri/ileri, iç/dış bağlantı, görsel, sayfada bul, yazı boyutu)
- [x] PDF okuyucu: sayfalama, yakınlaştırma, kitapta arama, sayfa çevirisi, 400 sayfalık belge, ekran döndürme
- [x] Arşiv içinden dosya açma (PDF, txt, svg, mp3, bozuk % kodlu ad), Nautilus kitap listesi
- [x] Çeviri görünümü (gerçek wllama + küçük model): başlat, durdur, gizle/yeniden göster
- [x] Mağaza: setler, alt çubuk, indir / duraklat / devam / iptal / sil, "Yer yetmez", koleksiyon rafları, rehber paketleri
- [x] Boş kütüphane, bilgi noktasından okunan paketler
- [x] Yan boşluklar, 44 px dokunma alanları, taşma, kırpılma, Türkçe metin

### Bulunan ve düzeltilen hatalar
1. **PDF okuyucunun çubuğu makale çubuğunun altında kalıyordu** (hata): ikisi de yapışkandı; kaydırınca geri, başlık,
   sayfa numarası ve yakınlaştırma görünmüyordu. Okuyucu açıkken makale çubuğu kayar; dosya/kitap ekranında işe
   yaramayan "Sayfada bul" ve "Aa" gizli.
2. **Büyük PDF'te bellek sızıntısı** (hata): hızlı kaydırmada sayfa tuvalleri bırakılmıyordu (400 sayfada 71 tuval,
   yüzlerce MB; telefonda çökme riski). Şu anki sayfadan uzak tuvaller her sayfa değişiminde bırakılır → 5 tuval.
3. **Yakınlaştırınca / ekran dönünce okunan yer kayboluyordu** (40. sayfa → 32.): sayfa ve sayfa içi konum korunur.
4. **Sonuca gitmek uygulama başlığını ekrandan itebiliyordu** ve gidilen sayfa yapışkan çubuğun altında kalıyordu
   (`scrollIntoView`); "şu anki sayfa" ekranın ortasıyla ölçüldüğünden açık arama listesi altında yanlış sayfa
   gösteriliyordu. Kaydırma ve sayfa takibi artık çubuğun altındaki görünür alana göre.
5. **Arama sonuçlarında yazı düğmeden taşıyordu** (yüksekliği sınırlı esnek sütunda büzülme); küçük ekranda çeviri
   açıkken "Çeviriyi kapat" ekran dışındaydı → çubuk ekran yüksekliğiyle sınırlı ve kendi içinde kayar, çeviri
   açıkken sonuç listesi gizlenir, kapat düğmesi kayan kutunun dışında.
6. **Makaledeki PDF bağlantısı yeni pencere açıyordu** (Android WebView'da açılmaz): artık uygulama içi okuyucu.
7. **SVG görsel kaynak kodu olarak "makale" gibi gösteriliyordu** (türünde "xml" geçiyor): dosya kartı (indirilir).
8. **Her indirme bitişinde Kütüphane yeniden kuruluyordu**: "Kütüphane açılıyor…" görünüp kaydırma, açık
   koleksiyon ve "Yönet" paneli sıfırlanıyordu. Eski liste yenisi gelene kadar görünür kalır.
9. **Gizlenen bitmiş çeviri yeniden açılınca model baştan çeviriyordu** (dakikalar); artık hemen gösterilir.
   Model yüklenirken "Durdur" yüklemenin bitmesini bekliyordu → hemen durur.
10. **Büyük yazıda çubuklar bozuktu**: "← Sonuçlara dön" önceki düğmenin üstüne biniyor, bulma kutusu 0 px'e
    iniyordu, PDF arama kutusu ve başlık eziliyordu. Düğme grupları alt satıra iner; dar ekranda "← Sonuçlar".
11. **Mağaza büyük yazıda**: alt çubuk ekranın üçte birini kaplıyordu, durum kartı metni tek kelimelik şeride
    iniyordu → düzeltildi. "Tek tek seç" düğmesinde yazı kenarlığa değiyordu (iç boşluk).
12. Duraklatılınca alt çubuk "İndir" diyordu → "Devam et" + "N paket duraklatıldı · kaldığı yerden sürer".
13. Kapak kutucuğunda seçili dış çizgi kırpılıyor, uzun kaynak adı kesiliyordu; boş kütüphane başlığı 2 px içerdeydi
    (sol/sağ boşluk eşit değil); kitap/dosya ekranında başlık ile açıklama arası fazla boşluk.
14. Metin: "Kütüphanen hazırlanıyor / Kütüphaneni kur" → "Kütüphaneniz hazırlanıyor / Kütüphanenizi kurun"
    (uygulamanın geri kalanı "siz" diliyle); "İndiriliyor 45%" → "%45"; kitap listesi notu artık kaynak diline göre
    (Türkçe kitaplıkta "Türkçeye çevrilebilir" demez); "bu cihaz için ağır" kırmızı değil kehribar; "Gizle" 40 → 44 px.
15. Bozuk % kodlu dosya adında `decodeURIComponent` hatası (yakalanmamış söz) → güvenli çözme.
16. **Kararsız test** `tests/kutuphane-real.test.ts` "başlık araması": paylaşılan durum ya da sıra değil, zaman aşımı.
    1,2 GB dosya işletim sistemi önbelleğinde değilken ilk arama testi tek başına 5 sn'yi aşıyor (soğuk koşuda
    yalnız dosyayla da 5,09 sn ölçüldü; ısınınca 0,5 sn); tam takımda öteki dosyalarla disk/işlemci paylaşılınca daha
    sık. Takıma 60 sn süre verildi; hız ayrı "süre bütçesi" testinde ölçülüyor.

### Kalan / not
- Denetim sırasında `index.html`'deki açılış ekranı (`#acilis`) çizimden sonra DOM'da kalıyordu (belge 2× ekran
  yüksekliği, `scrollIntoView` başlığı itebiliyordu); başka ajan `src/main.tsx`'te giderdi. PDF okuyucu artık
  `scrollIntoView` kullanmıyor.
- Çok büyük yazı + 360×640 + PDF çevirisi açıkken çubuk kendi içinde kayar ("Çeviriyi kapat" için kaydırmak gerekir).
- Dış bağlantılar `target=_blank` ile açılır; Android'de sistem tarayıcısına gidip gitmediği cihazda denenmeli.

### E2E
    node e2e/qa-kutuphane.mjs            # dört bilgi noktası kurulumu (bkz. betik başı), derlenmiş uygulama
    node e2e/pdf-okuyucu-check.mjs       # 8099, sample_kitap_en.zim
    node e2e/kutuphane-check.mjs http://localhost:8098 && node e2e/sanitize-check.mjs
    node e2e/kutuphane-ceviri-check.mjs http://localhost:5199/
    node e2e/kutuphane-denetim-check.mjs http://localhost:5199/ /tmp/ktd   # bu denetimin regresyonu (dev sunucusu)
