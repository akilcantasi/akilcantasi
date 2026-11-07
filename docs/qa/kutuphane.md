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

## Okuma hatası 2026-11 ("İndirdiklerimi okuyamıyorum")

Sahibinin gerçek indirdiği 9 ZIM (Vikipedi özet, Kimya, Vikikitap, Vikikaynak, Vikidia, NHS ilaç rehberi,
Askeri sahra tıbbı, Düğümler, Su arıtma) üç okuma yolundan da okundu: Android paket klasörü
(`/_paket/?aralik=`, MainActivity.packResponse'un birebir taklidi + Capacitor eklenti taklidi), bilgi noktası
(`server/server.mjs`, /data/ Range) ve tarayıcı deposu (OPFS).

### Kök neden
- **Taranmış PDF sayfaları boş çiziliyordu.** pdf.js 6 taranmış belgelerin görsellerini (CCITT faks, JBIG2) ve
  JPEG 2000'i WebAssembly çözücülerle açar; bu dosyaların yeri (`wasmUrl`) hiç verilmemişti. Konsolda
  "Ensure that the `wasmUrl` API parameter is provided" / "JBig2 failed to initialize"; sayfa beyaz. Askeri
  sahra tıbbının 25 PDF'inin neredeyse tamamı, Düğümler'in çoğu ve Su arıtma (4) etkileniyordu (ör. bandage.pdf
  85 sayfanın hepsi boş). Üç yolda da aynı; Android'de de.
- ZIM okuma katmanı (Android aralık yolu dahil) gerçek dosyalarda sağlam: 9 dosyada ~1500'er girdi tarandı, hata yok.

### Düzeltmeler
- `src/lib/pdf.ts`: `PdfIkiliVeri` (pdf.js `BinaryDataFactory`) jbig2/openjpeg wasm'ını ve sembol yazı tiplerini
  Vite'ın derlemeye koyduğu adreslerden okur; `loadPdfjs().getDocument` bunu kendiliğinden ekler (okuyucu
  bileşeninde değişiklik gerekmez).
- `src/lib/zim/index.ts`: önek başlık araması yönlendirme bilgisini taşır; "Vikipedi" araması aynı katlanmış
  başlıklı "Vıkıpedı" yönlendirmesini değil maddeyi getirir. Android paket kaynağı (QueryRangeSource) da
  uzak kaynak gibi okunur (büyük sayfa, gruplu Xapian bloğu): Vikipedi aramasında ~%20 daha az istek.

### Denetim
    node e2e/kutuphane-gercek-check.mjs [/zim/klasörü]   # 3 yol × her dosya: ana sayfa, görsel, bağlantı, arama, PDF (boş sayfa denetimi)
    npx vitest run tests/kutuphane-gercek.test.ts tests/pdf-ikili.test.ts

### Kalan / not
- Service worker `.wasm`'ı önbelleğe almaz (tools/sw): bilgi noktası kapandıktan sonra önbellekten açılan sayfada
  taranmış PDF görselleri çözülemez.
- İngilizce tam metin araması kök biçimini (ör. "military" → "militari") aramıyor; tek kelime bazen sonuçsuz.
- Taranmış PDF'lerde metin katmanı yok: "Bu kitapta ara" ve çeviri bu belgelerde sonuç vermez (OCR yok).

## Yeniden tasarım 2026-11 (standart kullanıcı gözüyle)

Tasarım belgesi: `docs/qa/kutuphane-tasarim.md`. Ekran görüntüleri: `docs/images/kutuphane-yeni/`.

### Yapı
`KutuphaneTab.tsx` artık yalnız yönlendirici; ekranlar `src/tabs/kutuphane/` altında:
`Kitapligim.tsx` (koleksiyon kartları, kaldığın yerden devam, son okunanlar, birleşik arama),
`Koleksiyon.tsx` (okumaya başla / kitap listesi, bu koleksiyonda ara, ayrıntılar, telefona kaydet, sil),
`Okuyucu.tsx` (makale, PDF, dosya görüntüleyici), `KutuphaneMagaza.tsx` (ihtiyaca göre mağaza),
`Yonet.tsx` (yer aç), `Indirmeler.tsx`, `BaslangicKarti.tsx`, `Ekle.tsx` (dosyadan ekleme),
`veri.ts` (saf yardımcılar; `tests/kutuphane-veri.test.ts`), `durum.ts`, `gezinme.ts`, `css.ts`.

### Önemli kararlar
- İç ekranlar `openArticlePath` alanında `kt:` önekiyle tutulur (`kt:koleksiyon/<dosya>`, `kt:magaza`,
  `kt:yonet`, `kt:ara`). Böylece Android geri tuşu `src/gecmis.ts` ile iç ekranları da kaydeder. Önce
  "katman" (useGeriKapat) denendi: makale açılırken katman kaldırma ve kayıt ekleme yarışıyor, geri tuşu
  uygulamadan çıkabiliyordu.
- Kitaplığım ilk çizimde arşivleri açmaz: paket listesi + katalog + `ac.lib.meta` önbelleği (gerçek
  9 paketle kartlar ~0,4–0,8 s). Arşivler arama kutusuna dokununca ya da boşta açılır.
- Son okunanlar `ac.lib.okunan` (okunan oran / PDF sayfası). Yazı boyutu 5 kademe (`ac.lib.yazi`; eski
  `ac.lib.textSize` taşınır). Kaynak süzgecinin kalıcılığı (`ac.lib.source`) kaldırıldı: süzgeç artık arama
  sonuçlarının üstünde geçici bir çip.
- Android'de yeni pencere ve blob indirme çalışmadığından resim, ses, görüntü ve düz metin uygulama içinde
  gösterilir; öteki türler için açıklama. PDF'te taranmış sayfalar için "arama ve çeviri yapılamıyor" iletisi.
- PDF açılamazsa iletinin rengi kırmızı değil kehribar (tehlike değil).

### Testler
    npx vitest run tests/kutuphane-veri.test.ts
    node e2e/qa-kutuphane.mjs                     # dört bilgi noktası kurulumu (betik başı)
    node e2e/kutuphane-check.mjs <bilgi noktası>  # gerçek paketlerle yolculuklar (paketleri geçici klasöre bağlayın)
    node e2e/kutuphane-denetim-check.mjs <dev>    # PDF, dosyalar, Android dosya görüntüleyici, mağaza indirme akışları, çeviri
    node e2e/kutuphane-ceviri-check.mjs <dev>
    QA_PDF=… QA_TARANMIS=… node e2e/pdf-okuyucu-check.mjs   # taranmış PDF'li zimgit paketleriyle
    node e2e/sanitize-check.mjs

### Kalan
- Arama sıralaması `src/lib/library.ts`/`zim` kapsamında: "su" aramasında "Şu" ilk sırada (katlanmış eşleşme).
- Kiwix sayfalarının kendi gezinme öğeleri (ör. NHS "Skip to main content") makalede görünür.
- Kuyruktaki tek bir bekleyen indirme ayrı iptal edilemez (yalnız "Hepsini duraklat"); `indirme-kuyrugu.ts` kapsamı.

## Android geri bildirimi (v0.2.9): Gutenberg açılmıyor

**Hata:** Kütüphanede Project Gutenberg koleksiyonu açılınca yalnız dönen bir "loading" GIF'i görünüyor, sayfa hiç açılmıyordu.

**Kök neden:** gutenberg2zim'in giriş sayfası (`index.html`) kitap listesini jQuery + DataTables ile bir JS veri dosyasından (`full_by_popularity.js`) çizer. Uygulama ZIM betiklerini güvenlik için çalıştırmaz (doğru); bu yüzden sayfa boş kalıyor, yalnız yükleniyor GIF'i görünüyordu. Kitapların kendisi sıradan HTML girdileridir (`<Başlık>.<no>.html`, kapak: `<Başlık>_cover.<no>.html`).

**Düzeltmeler:**
- `src/lib/zim/dizin.ts` (yeni): betikle çizilen giriş sayfası algısı (`sayfaKabukMu`: betik var + çok az metin/bağlantı ya da yükleniyor göstergesi; yalnız giriş sayfasına uygulanır), Gutenberg kitap yolu kuralları (kapaklar, JS, epub atlanır), JS veri dosyasından yazarlar, başlık dizinini parça parça okuyan `DizinOkuyucu` (harfe atlama: `ZimArchive.titleLowerBound`).
- `src/tabs/kutuphane/Dizin.tsx` (yeni): uygulamanın kendi alfabetik kitap/sayfa listesi (kaydırdıkça devamı, A–Z, yazar, süzme; kitaptan dönünce liste yerinde). Koleksiyon ekranında Gutenberg'de "Okumaya başla" yerine bu liste ve "Rastgele bir kitap"; okuyucuda eski "giriş sayfası" kaydı açılırsa da liste gösterilir.
- `src/lib/sanitize.ts`: "yükleniyor" göstergeleri (load.gif, ajax-loader, spinner, `#spinner`, `.dataTables_processing`…) atılır; madde görselleri ve "Loading" adlı başlıklar korunur.
- `src/lib/library.ts`: Gutenberg aramasında kapak/giriş sayfaları elenir (aynı kitap iki kez çıkmaz); "Rastgele" bir kitap seçer.
- Büyük sayfalar (`Okuyucu.tsx`): 4 MB'lık tek sayfalık kitap 4× yavaş işlemcide ~14 s donduruyordu (bütün metinden özet çıkarımı + tek parça innerHTML). Özet yalnız baştan çıkarılır; 200 KB üstü gövde parça parça (her karede ~12 ms) yerleşir, ekran dışı bloklar `content-visibility: auto`. Okuma konumu büyük sayfalarda blok sırasıyla tutulur (aynı paragrafa döner). İlk görünüm ~1,9 s, sonra en uzun kare ~250 ms.

**Sınama:** `testdata/sample_gutenberg_en.zim` (tools/make_sample_zim.py `gutenberg`; büyük kitap: `gutenberg-buyuk`), `tests/dizin.test.ts`, `e2e/kutuphane-gutenberg-check.mjs` (koleksiyon listesi, harf, arama, kitap, GIF yok, büyük kitap hızı ve konumu, Android öykünmesinde okuyucu ve PDF okuyucuda menü yerinde), `e2e/sanitize-check.mjs` (yükleniyor göstergeleri, kabuk algısı). Gerçek paketlerde (Vikipedi, NHS/zimit, zimgit, Vikikitap, Vikikaynak, Vikidia, sahra tıbbı) giriş sayfası değişmedi.
