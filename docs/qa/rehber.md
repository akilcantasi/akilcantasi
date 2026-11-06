# QA: Rehber sekmesi ve rehber araması

Kapsam: src/tabs/RehberTab.tsx, src/lib/guides-search.ts, src/content/categories.ts, rehberlerin `keywords` alanları.

## Test edilenler
- [x] Ana ekran: 18 kategori kutusu, her kutudaki "N rehber" sayacı, 3 hayati kısayol (Kalp masajı, Ciddi kanama, Boğulma)
- [x] Arama: sonuç listesi, kutuların gizlenmesi, boş durum metni, temizleyince kutuların geri gelmesi
- [x] 18 kategorinin her biri: başlık, rehberlerin tamamı doğru sırayla (alsoIn dahil), "← Rehber" geri düğmesi
- [x] 168 rehberin her biri: başlık, adım sayısı, çizimli adım sayısı (GUIDE_ART ile), 112 bandı (`tel:112`), "Yapmayın" listesi, kaynaklar, inceleme notu, "Fener'e sor" düğmesi
- [x] Rehberden geri: kategoriden açılınca aynı kategoriye (ikincil kategori/alsoIn dahil), aramadan açılınca sonuçlara, kısayoldan açılınca ana ekrana
- [x] Doğrudan bağlantılar: `?tab=rehber`, `?cat=`, `?guide=`, `?cat=&guide=`, geçersiz kimlikler
- [x] "Fener'e sor": Fener sekmesi açılır, soru gönderilir, kaynak olarak aynı rehber gelir
- [x] Yerleşim 390×844, 360×640, 1280×800: yatay kaydırma yok, metin taşması yok, dokunma hedefleri ≥ 44 px; ekran görüntüleri incelendi
- [x] Konsol hataları
- [x] Arama kalitesi: 237 gerçekçi sorgu (Türkçe harfli/harfsiz, yazım hatalı, konuşma dili) + 8 eşleşmemesi gereken sorgu; hem `searchGuides` hem Fener `retrieve()` + `isRelevantGuide` için
- [x] 168 rehber başlığının her biri aramada kendi rehberini ilk sırada bulur

## Bulunan ve düzeltilen hatalar
1. **"Fener'e bu konuda soru sor" soru sormuyordu**: yalnızca Fener sekmesine geçiyordu, konu kayboluyordu. Artık `go.ask("<başlık>: ne yapmalıyım?")` ile soruyu gönderiyor; `data-testid="guide-ask"` eklendi.
2. **Yanlış geri dönüş**: aramadan ya da hayati kısayoldan açılan rehberde geri düğmesi rehberin ana kategorisine gidiyordu. Artık aramadan açılınca "← Arama sonuçları" (sorgu ve sonuçlar korunur), kısayoldan açılınca "← Rehber".
3. **Arama: anlamsız eşleşmeler**: "bugün hava nasıl" → dağda hava değişimi, "en yakın pizzacı nerede" → kayıp çocuk, "maç kaç kaç bitti" → akü arızası; "dolar kaç tl" listede çöp sonuçlar gösteriyordu. Hava durumu sorusu ayrı ele alınıyor, durak kelimeleri genişletildi (yapılır, nerede, kaç, en, yakın, bugün…), Rehber listesinde 2 puanın altındaki sonuçlar gizleniyor.
4. **Arama: yazım hataları ve konuşma dili**: "deprm oluyo", "kanma durmuyo", "elktrik kesildi", "yangn", "radyason", "boguluyo", "kalp masji" bulunamıyordu. Rehber sözlüğüne göre tek harflik yazım düzeltmesi ve "-yo → -yor" eklendi. Kısa kelimelerde harf değişimi ("dolar" → "dolap") ve olumsuzluk eki m ("almıyor" ↔ "alıyor") düzeltilmez.
5. **"-sız/-suz" eki**: "pusulasız yön bulma" pusula rehberine gidiyordu; ek anlamı tersine çevirdiği için önek eşleşmesi sayılmıyor.
6. **Sıralama çakışmaları** (anahtar kelimeyle düzeltildi): "şarj" (artık powerbank rehberi), "dolu arabada", "bomba patladı" (boru patlaması yerine patlama), "denizde boğulan çocuk", "güneş çarptı", "kedim kayboldu", "klor gazı kokusu", "kolu kırıldı", "komşum enkaz altında", "turnike nasıl yapılır", "çok ilaç içti". Tam anahtar ifade eşleşmesinin ödülü 8'den 14'e çıktı, ifadeler durak kelimeleri atılarak karşılaştırılıyor. Başlık ifadesi ödülü artık kelime sınırında arıyor ("yangn" artık "yağ yangını" başlığına takılmıyor).
7. İstenen çakışmalar doğrulandı: tüp → LPG tüpü, şarj/powerbank → güneş paneli ve powerbank, sel → sel (34 puan; sel-sonrası/sel-uyarısı 20), dolu arabada → dolu, insülin → kronik hastalık, kene → kene, köpek ısırdı → kuduz/ısırık.

Anahtar kelime eklenen dosyalar (yalnızca `keywords`): nukleer.ts, ilk-yardim.ts, hava.ts, ozel-gruplar.ts, tesisat.ts, yaralanma.ts, deprem.ts.

## Kalan sorunlar
- 5199'daki ortak sunucuda başka ajanların düzenlemeleri HMR ile sayfayı yeniden yüklediğinden e2e uzun koşuda zaman aşımına düşebilir; dosya izlemesi kapalı ayrı bir sunucuda çalıştırın (aşağıda).
- `npx vitest run` paralel yük altında ara sıra tests/iletisim.test.ts ya da tests/zim.test.ts'te kararsız (tek başına çalıştırınca geçiyor); kapsamım dışında.
- Yazım düzeltmesi tek harf hatayla sınırlı; iki harf hatalı sorgular ("kanmaa durmyor") bulunmayabilir.
- Arama sorgu başına ~4 ms (168 rehber); sorun değil.

## Komutlar
- Birim: `npx vitest run tests/arama-kalitesi.test.ts tests/guides.test.ts tests/fener.test.ts`
- E2E: `node e2e/qa-rehber.mjs http://localhost:5199/ /tmp/qa-rehber` → `1924 OK, 0 HATA`
  - Daha kararlı çalıştırma için HMR kapalı sunucu: `npx vite --config <hmr:false, watch.ignored:['**/*'] olan yapılandırma> --port 5461 --strictPort` ve ardından `node e2e/qa-rehber.mjs http://localhost:5461/`

## Denetim 2026-11

Kapsam: src/tabs/RehberTab.tsx, src/tabs/KendineYetmek.tsx, src/content/**, src/art/**, src/lib/guides-search.ts.
360×640, 390×844, 1280×800 ve en büyük yazı boyutunda (Ayarlar → "En büyük") ekran görüntüleri incelendi;
168 rehberin 868 çizimli adımı `all-guides-shot.mjs` ile 390 px'te çekildi, ~60'ına (çizimi yoğun olanlar dahil) tek tek bakıldı.

### Denetlenenler
- [x] Ana ekran, kategoriler, rehber sayfaları, geri dönüşler, `?guide= ?cat=` bağlantıları (mevcut e2e)
- [x] Arama: Türkçe harfler (ı/i, İ/I, ş, ğ, ç), harfsiz ve büyük harfli yazım, sonuçsuz arama
- [x] "henüz incelenmedi" uyarısı (yerleşik: sağlık profesyoneli, paket: uzman)
- [x] Kendine Yetmek: kurulu değil / indiriliyor / indirme hatası / bozuk paket / kurulu durumları, paket rehberi ve çizimleri
- [x] Rehberler arası metin göndermeleri ("Ezilme yaralanması" rehberine bakın…): 6 göndermenin hepsi var olan rehbere çıkıyor
- [x] Çizimler: üst üste binen yazı, kırpılan etiket, tema dışı renk bulunmadı
- [x] Kenar boşlukları eşit (sol = sağ = 18 px; en büyük yazıda 25 px), yatay taşma yok, dokunma hedefleri ≥ 44 px

### Düzeltilenler
1. **Ana ekran sahnesinin alt kenarı görünüyordu.** Sahne kutusu sabit 310 px'ti; dar ekranda çizim daha önce
   bittiği için arama ve kısayol düğmelerinin arkasında yuvarlak köşeli bir çizgi kalıyordu. Kutu yüksekliği
   çizimden geliyor (en çok 310 px), geçiş çizimin kenarından önce zemine karışıyor.
2. **Kendine Yetmek paketi açılamazsa kart "rehberler açılıyor…" yazısında takılı kalıyordu.** Hata kaydediliyor
   ama arayüze haber verilmiyordu (`pack-guides.ts`); "Yeniden dene" de geri bildirim vermiyordu. Artık hata
   görünüyor, deneme sırasında düğme "Açılıyor…" diyor ve bozuk dosya için "Silip yeniden indir" var.
3. **Kendine Yetmek kartındaki not ve hata yazısı biçimsizdi** (`.ky-card p` kuralı `.ky-note`/`.ky-err`'i
   eziyordu). Eski indirme hatası, paket cihazdayken de görünüyordu; düzeltildi. İndirme sonrası "doğrulanıyor"
   aşaması ayrı yazılıyor, hata sonrası düğme "Yeniden dene".
4. **Geri dönünce liste en başa atıyordu.** 21 rehberli kategoride aşağıdan bir rehber açıp dönünce kullanıcı
   yerini kaybediyordu. Rehberden kategoriye ve kategoriden ana ekrana dönüşte kaydırma konumu korunuyor; ileri
   gidişte en üstten başlıyor.
5. **Arama: 3 harflik kelime başka kelimenin başı sayılıyordu** ("sığınak" → omurga yaralanması, "sığ" yüzünden;
   "buz" → "buzdolabı"). 3 harflik kök yalnızca ek almış hâlini buluyor ("kan" → "kanı", "sel" → "selde").
   466 arama kalitesi testi ve rehber testleri geçiyor.
6. Sonuçsuz aramada sorgu tek dokunuşla Fener'e soruluyor ("Fener'e sor" düğmesi).
7. Tasarım: Kendine Yetmek kartı ve düğmesi yeşilden Şafak kehribarına (diğer birincil düğmelerle aynı);
   yinelenen `.rh-row:hover` kuralı kaldırıldı.

### Kalan / öneri
- ~~Rehber metnindeki göndermeler düz yazı~~ → Öneriler 2026-11'de bağlantı oldu.
- Arama ünsüz yumuşamasını bilmiyor ("ısırık" ↔ "ısırığı", "kalp" ↔ "kalbi"). Denendi; iki eğri sorguyu
  ("işyerinde deprem hazırlığı", "otizmli çocuk deprem") bozduğu için geri alındı, ağırlıkla yeniden denenebilir.
- ~~Kendine Yetmek'in 57 kategorisi tek tek kutu~~ → Öneriler 2026-11'de 13 katlanır başlık.
- `all-guides-shot.mjs` yüklü makinede bir kez "Target crashed" verdi; kalan rehberlerle yeniden çalıştırınca tamamlandı.

### Komutlar
- Birim: `npx vitest run tests/rehber-harita-denetim.test.ts tests/arama-kalitesi.test.ts tests/guides.test.ts tests/guides-*.test.ts tests/fener.test.ts tests/rehber-paket.test.ts`
- E2E: `node e2e/qa-rehber.mjs http://127.0.0.1:5461/ /tmp/qa-rehber` → `1942 OK, 0 HATA`. Yeni bölüm: sahne geçişi,
  kaydırma konumu, sonuçsuz aramada Fener'e sor, Kendine Yetmek indirme (indirme adresi yerel `data/rehber/kendine-yetmek.rehber.json`
  dosyasına yönlendirilir) ve bozuk paket → silip yeniden indir.
- Çizimler: `node e2e/all-guides-shot.mjs http://127.0.0.1:5461/ /tmp/ag/out` (önce `/tmp/ag/ids.json`).

## Öneriler 2026-11

### Rehberler arası bağlantılar
- Biçim: `[[rehber-kimliği|görünen metin]]` (özet, uyarı, adım, Yapmayın). Ortak yardımcı `src/content/guide-links.ts`
  (`parseGuideLinks`, `stripGuideLinks`, `linkQuotedTitles`, `buildTitleIndex`).
- Yerleşik rehberlerdeki 6 gönderme bağlantıya çevrildi: enkaz-kurtarma → ezilme-yaralanmasi, hayatta-kalma-soguk-gece →
  hipotermi, ozel-gruplar-acil-dogum → ilk-yardim-bebek-kpr, yangin-duman-solunmasi → temel-yasam-destegi ve yanik,
  yaralanma-saplanan-cisim → yaralanma-goz. Başka bağlantısız "… rehberine bakın" yok (test denetliyor).
- Ekranda: metin içinde kehribar, altı çizili bağlantı (WCAG 2.5.8 satır içi istisnası) ve rehberin altında 44 px'lik
  "İlgili rehberler" kartları. Bağlantıdan açılan rehberin geri düğmesi bağlantının olduğu rehbere döner (zincir korunur).
- Yayımlanmış Kendine Yetmek paketi yeniden derlenmedi: tırnaklı başlık + "rehber…" göndermeleri ('Çam' rehberinde)
  başlık tek bir rehbere denk geliyorsa kendiliğinden bağlantı olur (pakette 53 gönderme). Eşleşmeyenler düz yazı kalır.
- Arama dizini (`guides-search.ts`), `guideToText` ve Fener (`rag.ts` `stepToText`, `fallback.ts` özet) işaretlemeyi atar.
- Arama sonuç kartlarının özetinde işaretleme atılır (kart zaten düğme; içinde bağlantı yok).

### Kendine Yetmek: 13 üst başlık
- `src/content/ky-groups.ts`: 57 kategori → 13 başlık (istemci tarafı eşleme, paket değişmedi); bilinmeyen kategori "Diğer".
- Başlık kartı: başlık, kısa açıklama, "N kategori · M rehber"; dokununca kategori kutuları açılır. Başlangıçta kapalı,
  "Hepsini aç / kapat" var, açık başlıklar `akil.ky.acik` anahtarında; kategoriden dönünce açık kalır.
- 360 px ve büyük yazıda (html %130) taşma yok, hedefler ≥44 px (e2e denetliyor).

### Komutlar
- Birim: `npx vitest run tests/guide-links.test.ts tests/ky-groups.test.ts tests/guides.test.ts tests/fener.test.ts tests/arama-kalitesi.test.ts`
- E2E: `node e2e/qa-rehber.mjs http://127.0.0.1:5263/ /tmp/qa-rehber` → `1995 OK, 0 HATA` (yeni: 6 bağlantı + geri dönüş,
  İlgili rehberler, guideToText düz metin, büyük yazı; Kendine Yetmek başlıkları, aç/kapat, Hepsini aç → 57 kategori,
  360 px + büyük yazı, paket rehberinde 'Çam' bağlantısı). Satır içi `.rh-link` dokunma hedefi denetiminden muaf.

### Kalan
- Paket metnindeki bazı göndermeler başlıkla birebir eşleşmediği için bağlantı olmadı (ör. "ana uygulamadaki rehberi açın",
  'Reçine yapıştırıcı' ve 'Tutkal' rehberlerine → yalnız Tutkal). Paket yeniden derlenirken `[[…]]` ile işaretlenebilir;
  ama eski uygulama sürümleri işaretlemeyi çıplak gösterir.

