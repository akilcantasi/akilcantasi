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
