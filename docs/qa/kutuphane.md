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
