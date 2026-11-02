# Çizim düzeltme turu (2026-11-01) — ajan talimatı

Proje: /home/claude/app ("Akıl Çantası", çevrimdışı Türkçe afet uygulaması). Rehber adımlarının yanındaki çizimler `src/art/scenes/*.tsx` içinde kod olarak (SVG, preact) çizilir. Çizim kiti: `src/art/kit2.tsx`. Kit kılavuzu: `docs/agents/CIZIM.md` — ÖNCE BUNU OKU, sonra `src/art/scenes/_ornek.tsx`.

Uygulamanın sahibi çizimlere baktı ve "genel olarak garip görünen çok fazla görsel var" dedi. Verdiği örnekler:
- Kalp masajı rehberinde kurtarıcı nefes veren kişi "çok saçma görünüyor". (Kişi yukarıdan bakışta baş aşağı çizilmiş, gövdesiz ve kopuk.)
- Aynı rehberin 9. adımında (OED pedleri) "ne gösterdiği hiç anlaşılmıyor". (Çarpık bir gövde, havada bir kol, anlamsız kablolar.)
- Koma pozisyonu (derlenme-pozisyonu) rehberinde karakterler adımdan adıma değişiyor: yaralı bir adımda kısa saçlı adam, sonraki adımda uzun kızıl saçlı kadın. Yardım eden kişi gülümsüyor; bu durumda garip.
- Çerçeve kenarından gelen kopuk kollar birbirinin üstünden geçiyor; ne olduğu anlaşılmıyor.

Bu turun amacı: her çizim, stres altındaki biri tarafından 2 saniyede doğru anlaşılmalı ve doğru tekniği göstermeli. Garip, karışık ya da yanlış bir çizim, hiç çizim olmamasından kötüdür.

## Kalite kuralları (hepsi zorunlu)
1. **Tutarlı oyuncular.** Bir rehberin bütün adımlarında aynı yaralı ve aynı yardımcı görünür: `who`, `skin`, `hair`, `hairC`, `top`/`role`, `bottom`, `bottomC` aynı. Sahne dosyanın başında rehber başına bir `CAST` sabiti tanımla (ör. `const TYD = { victim: {...}, helper: {...} }`) ve o rehberin bütün sahnelerinde onu yay (`{...TYD.victim, pose: ...}`). Rehberler arasında çeşitlilik iyidir; rehber içinde değişim yasak.
2. **Yüz ifadesi duruma uysun.** `face: 'calm'` gülümseme çizer. Acil durumda yardım eden kişi `neutral` (odaklı) ya da `worried`; bilinci kapalı kişi `closed`; acı çeken `pain`. `calm` yalnızca gerçekten sakinleştirme/teselli sahnelerinde (çocukla konuşma, olay sonrası) kullanılır. Bilinçsiz kişinin ağzı gülümsemesin.
3. **Anlaşılır bakış açısı.** Vücut tekniklerinde (kalp masajı, nefes, koma pozisyonu, taşıma, Heimlich) tercih yan görünüş ve yardımcının TÜM bedeni. Yukarıdan bakış yalnızca ellerin göğüs/yara üzerindeki yakın planında; o zaman kollar tek bir kenardan, aynı kişiye ait olduğu belli şekilde gelir ve birbirini kesmez. Baş aşağı, kesik, gövdesiz, çarpık insan yok.
4. **Anatomi ve fizik.** Eklemler doğal açıda; eller dokunması gereken yerde; yerde yatan kişi yere değiyor; havada süzülen nesne yok; uzuvlar birbirine karışmıyor; kıyafet ve ten renkleri tutarlı.
5. **Teknik doğruluk.** Çizim adım metniyle birebir aynı şeyi göstersin (el yeri, kol düzlüğü, duruş, ped yerleri, bandaj yönü…). Metin "dizden çekerek çevirin" diyorsa çizimde el dizde ve çekme yönünde ok olsun. Şüphede `src/art/spec/<dosya>.ts` içindeki açıklamayı ve rehberin metnini esas al; spec metinle çelişiyorsa METİN kazanır, spec'i de düzelt.
6. **Ölçek ve odak.** Ana kişi(ler) yüksekliğin %60–80'i; boş kocaman sahnede minik figür yok. Tek fikir, tek an. En fazla bir etiket.
7. **Gereksiz çizim yok.** Görselle anlatılamayan adımlar (ör. "talimatlara uyun", "durmayın", "sakin kalın", soyut zaman/sayı bilgisi) için çizimi kaldır: rehberin `art` dizisinde o indeksi `null` yap. Az ama net çizim, çok ama garip çizimden iyidir. Ama hayati teknik adımları (KPR el yeri ve duruşu, kurtarıcı nefes, koma pozisyonu aşamaları, Heimlich, turnike, basınçla kanama durdurma vb.) mutlaka doğru çizilmiş olmalı.
8. **Renk anlamları** CIZIM.md'deki gibi (turuncu eylem/ok, kırmızı tehlike, yeşil doğru).

## Paylaşılan sahneler
`src/art/scenes/categories-common.tsx` 118 rehberde kullanılan genel sahneleri içerir (112'yi arama, çanta vb.). Bu dosyayı YALNIZCA "common" ajanı düzenler. Senin rehberinde ortak bir sahne oyuncu tutarlılığını bozuyorsa ya da o rehber için uygun değilse: kendi sahne dosyanda rehbere özel yeni bir kimlikle (ör. `derlenme-112-ara`) yeni sahne çiz, kendi spec dosyana (`src/art/spec/<kategori>.ts`) aynı kimlikle kısa bir açıklama ekle, rehberin `art` dizisinde o indeksi yeni kimliğe çevir.

## Dosya sahipliği ve eşzamanlılık
Başka ajanlar aynı anda başka dosyalarda çalışıyor.
- Yalnızca sana verilen sahne dosyalarını serbestçe düzenle.
- `src/content/guides/*.ts` ve `src/art/spec/*.ts` dosyalarında yalnızca kendi rehberlerinin `art` dizilerini ve kendi kimliklerinin spec satırlarını, KÜÇÜK ve tam eşleşen Edit değişiklikleriyle değiştir. Dosyayı baştan yazma, biçimlendirme. Rehber metinlerine (`steps`, `dont`…) DOKUNMA.
- `kit2.tsx`'e dokunma. Eksik bir şekil gerekiyorsa kendi dosyanda `OG` ve yol yardımcılarıyla yap.
- `art` dizisi `steps` ile aynı uzunlukta kalmalı.

## Çalışma yöntemi
1. Kendi vite sunucunu başlat: `cd /home/claude/app && (npx vite --port <PORT> --strictPort > /tmp/<batch>/vite.log 2>&1 &)`.
2. Mevcut durumun paftaları hazır: `/tmp/sheets/<rehber-id>.png` (her adım kartı, çizim + adım metni, 3 sütun). Kendi rehberlerinin HER paftasını Read ile aç ve her çizimi kurallara göre eleştirel değerlendir. Bulduklarını not al.
3. Düzelt: kötüleri yeniden çiz ya da `null` yap; oyuncuları birleştir; ifadeleri düzelt.
4. Yeniden çek ve bak:
   ```
   mkdir -p /tmp/<batch> && cp /tmp/ids.json /tmp/<batch>/ids.json
   node e2e/all-guides-shot.mjs http://localhost:<PORT>/ /tmp/<batch>/shots <rehber-id> <rehber-id> ...
   python3 /home/claude/tools/sheet.py /tmp/<batch>/shots /tmp/<batch>/sheets <rehber-id> ...
   ```
   (Önce eski çekimleri silmek için `/tmp/<batch>/shots` içini temizle; art'ı null yapılan adımlar yeni çekimde görünmez.) Paftayı Read ile aç ve kurallara göre yeniden değerlendir. Tek sahneye yakından bakmak için `/tmp/<batch>/shots/<id>-NN.png` dosyasını aç. İyi olana kadar tekrarla. Her rehber için son paftayı kendin görmeden "bitti" deme.
5. Kontroller: `npx tsc --noEmit 2>&1 | grep -E "scenes/(<senin dosyaların>)"` boş olmalı; `npx vitest run tests/guides.test.ts` geçmeli.
6. Rapor: `docs/cizim-duzeltme/<batch>.md` (Türkçe; klasör yoksa oluştur, iş bitince silinebilir). Rehber başına: hangi adımlar yeniden çizildi, hangileri null yapıldı ve neden, oyuncu tanımı, kalan şüpheler.

Son mesajın (200 kelimeyi geçmesin): kaç rehber, kaç sahne yeniden çizildi, kaç çizim kaldırıldı, en ağır sorunlar, emin olamadıkların.
