# QA — güvenlik (web mantığı + sunucu)

Kapsam: `src/lib/**` (harita, Fener ve ses hariç), `src/iletisim/*.ts`, `server/**`, `tools/**`
(sınama araçları hariç), `.github/workflows/{aylik-harita,dosya-olc,hf-temizlik}.yml`,
`vite.config.ts`, `public/**` ve bunların testleri.

Tehdit modeli: güvenilmeyen girdiler uygulamayı kandırmamalı ya da çökertmemeli. Kaynaklar:
indirilen ya da içe aktarılan ZIM/PDF/rehber/hava paketleri, internetteki merkezi katalog,
elle girilen başka bir bilgi noktası, mesh komşuları, bozulmuş yerel kayıtlar (localStorage/OPFS)
ve Windows'ta da çalışan bilgi noktası sunucusuna gelen istekler.

## Denetim 2026-11

### Denetlenenler

- [x] **ZIM makale temizleyicisi** (`src/lib/sanitize.ts`): mXSS ve ad alanı karışıklığı
      (svg/math/foreignObject, `<select><template>`, `<form><math>`), `<base>`, meta yenileme,
      `<link>`, `<style>`/`@import`/`url()`/`expression`, `style` özniteliği, `javascript:` /
      `vbscript:` / `data:` / `blob:` adresleri (varlık, sekme, denetim karakteri, büyük harf
      hileleri), `srcset`, `ping`, `download`, `<iframe srcdoc>`, `<object>`, `<embed>`,
      `<isindex>`, `<keygen>`, olay öznitelikleri, `<template>`, `<noscript>`/`<noembed>`/
      `<noframes>`/`<xmp>` hileleri. Hepsi gerçek tarayıcıda (tıklama dahil) etkisiz.
- [x] **DOM clobbering**: makale `id="main"`, `id="Capacitor"`, `name="getElementById"`,
      `<form name="cookie">` ile uygulamanın öğelerini ve genel adları ezemiyor (düzeltildi, aşağıda).
- [x] **PDF** (`src/lib/pdf.ts` + okuyucu): `isEvalSupported: false`, betik (scripting) motoru
      yok, açıklama/bağlantı katmanı çizilmiyor (dış bağlantı uygulamayı yönlendiremez), cMap/
      yazı tipi adresi verilmediği için ağ isteği yok. Değişiklik gerekmedi.
- [x] **Rehber paketleri**: biçim/şema doğrulaması (`validateRehberPack`), SVG temizliği, dosya
      adı → OPFS yolu (tarayıcı `/`, `\`, `.`, `..` adlarını reddeder; Android'de
      `PaketIndirici.isPackName`), dev dosya, kendini "incelendi" ilan etme (düzeltildi).
- [x] **Katalog**: şema doğrulaması, adres biçimi, internetteki katalogdan gelen adresler
      (düzeltildi), SHA-256 alanları (dolduruldu).
- [x] **İndirmeler**: SHA-256 doğrulaması (tarayıcı, sunucu, Android), Range ile sürdürme,
      416/200 yanıtları, kota dolması, iptal/temizlik, fazla veri gönderen ayna (düzeltildi).
- [x] **ZIM ayrıştırıcı, Xapian ve arama**: saldırgan denetimindeki sayılar, ofsetler ve
      sıkıştırma bombaları; 450 rastgele bozulmuş arşivle bulanık sınama.
- [x] **Mesh ve İletişim**: çerçeve boyutu, şema, zaman sınırları, kimlik biçimi, kopya ve
      sel (flooding) davranışı; bilgi noktası yanıtlarının doğrulanması ve boyutu.
- [x] **Açılış dayanıklılığı**: `src/` altındaki 23 `JSON.parse` ve tüm `localStorage.getItem`
      çağrısı tek tek okundu; bozuk kayıtla çöken yerler düzeltildi (aşağıda).
- [x] **Sunucu (Windows dahil)**: ters bölü, sürücü harfi, UNC, `%5C`/`%2F`/`%2E`/`%5F`
      kodlamaları, NUL, sonda nokta/boşluk, aygıt adları (CON, NUL, COM1…), NTFS akışları
      (`x.zim::$DATA`), büyük gövde, disk dolu, yarım dosya.
- [x] Önceki turun sertleştirmeleri yeniden denetlendi: Host izin listesi (421), aynı köken
      koşulları, `/data` kuralları, genel 500, hız sınırları, sayfalama, kayıp ilanı koruması,
      `fromServer`, sayfalama döngüsü, `X-Akil-Anahtar` yalnız kendi bilgi noktasına, CSP,
      hava kaynak bağlantısı, `devZimUrls`, `smsCoz` sınırı. Hata bulunmadı.
- [x] **Araçlar ve iş akışları**: kabuk/betik enjeksiyonu (girdiler `env:` ile geçiyor, `run`
      içinde `${{ }}` yok), jeton yetkileri, `tools/hf`, `tools/pi`, PowerShell betikleri.

### Bulunan ve düzeltilen hatalar

1. **[güvenlik-orta] Makale kimlikleri uygulamanın belgesini ezebiliyordu (DOM clobbering).**
   `sanitize.ts` artık her `id`'ye ve `headers` listesine `zim-` öneki ekliyor; `#çapa`
   bağlantıları önekli kimliğe yazılıyor (tıklama işleyicisi değişmeden çalışıyor, gerçek
   makalede kaydırma doğrulandı). Sınıflardan yalnız `mw-*` ve `noprint` kalıyor: makale
   `class="cm-flash"` gibi uygulamanın tam ekran katman sınıflarıyla arayüzü örtemez.
2. **[güvenlik-orta] Bozuk ZIM sekmeyi kilitleyebiliyor ya da belleksiz bırakabiliyordu**
   (`src/lib/zim/*`):
   - başlık, girdi/küme işaretçi listeleri dosya dışını gösteriyorsa arşiv reddedilir;
   - ikili aramalarda `(a+b)>>>1` 2^32'yi aşan (bozuk) sınırlarda sonsuz döngüye girebiliyordu →
     taşmasız orta nokta; başlık listesi uzunluğu girdi sayısıyla sınırlı; `NaN` girdi reddi;
   - tek blob en çok 256 MB, sıkıştırılmış küme girdisi en çok 128 MB;
   - **sıkıştırma bombası**: zstd verisi açılmadan çerçeve/blok başlıklarından üst sınırı
     hesaplanıyor (`zstdBound`), 128 MB'ı aşan ya da 4 GB "içerik boyutu" bildiren çerçeve
     reddediliyor; xz çıktısı akış sırasında kesiliyor;
   - Xapian: çok parçalı etiket ve `deflate-raw` çıktısı en çok 32 MB (bozuk ağaçta "son parça"
     hiç gelmeyince sınırsız birleştirme yapılıyordu; birleştirme de karesel kopyalamaydı).
   Gerçek Türkçe Vikipedi ZIM'inde 600 kümede sınırın gerçek boyuttan küçük çıkmadığı ve
   aramaların değişmediği doğrulandı (`kutuphane-real`, `arama-kalitesi` 466 test).
3. **[güvenlik-orta] HTML → metin karesel süre** (`src/lib/zim/text.ts`): kapanmayan çok sayıda
   `<!--`, `<script`, `<head` ya da `<a<a…` içeren makalede düzenli ifadeler karesel çalışıyordu
   (80 KB'lık `<a` yığını 4 sn; 1 MB'lık dakikalar). Bloklar artık doğrusal bir ön geçişle
   (`stripBlocks`) atılıyor; etiket ifadesi tırnaksız `<` içermiyor. 1 MB'lık yedi saldırı
   girdisinin hepsi birlikte < 1 sn.
4. **[güvenlik-orta] Sunucuda kodlanmış yol parçalarıyla gizli klasör/derinlik denetimi
   atlatılıyordu** (`server/server.mjs`): `/data/%2Egizli/x.zim`, `/data/%5Fozel/y.zim`,
   `/data/a%2Fb%2Fderin.zim` sunuluyordu (denetim ham yola bakıyordu). Artık çözülmüş yoldan.
   `safeJoin` Windows'a özgü tehlikeli parçaları (aygıt adları, sonda nokta/boşluk, `:`) her
   platformda reddediyor; testler `path.win32` ile Windows davranışını sınıyor.
5. **[güvenlik-orta] Büyük gövde bağlantıyı açık tutuyordu**: sınırı aşan gövde okunmaya devam
   ediyordu (sınırsız veri). Artık `Content-Length` fazlaysa hiç okunmadan, parça parça gelirse
   sınırda 413 + `Connection: close` ve soket kapanıyor. `/api/fetch` büyük gövdeye 400 yerine 413.
6. **[güvenlik-orta] İndirilen rehber paketi kendini "incelendi" ilan edebiliyordu.**
   `guides-search.ts` (`getGuide`, `getAllGuides`, dolayısıyla Rehber sekmesi, arama ve Fener)
   paket rehberlerini her zaman `reviewed: false` sunuyor; "henüz incelenmedi" uyarısı ve
   asistan notu görünüyor. Resmî paketlerdeki rehberlerin hepsi zaten `reviewed: false`.
7. **[güvenlik-orta] İnternetteki merkezi katalog her adrese yönlendirebiliyordu**:
   `manifest.ts` artık uzaktan gelen katalogda yalnız https + Android'deki
   `PaketIndirici.izinliAdres` ile aynı alanları (Kiwix ve aynaları, Wikimedia, Hugging Face,
   GitHub, akilcantasi.com) bırakıyor. Uygulamayla gelen kataloğun her adresinin bu kurala uyduğu
   test ediliyor. Bilgi noktasının kendi kataloğu işletmenin denetiminde olduğu ve LAN aynası
   gösterebildiği için (e2e `download-check` bunu kullanır) bu sınır ona uygulanmadı.
   `startDownload` ayrıca http(s)/göreli/`osm:` dışındaki şemaları atıyor.
8. **[hata] Bilgi noktasında başka sürüm varken doğrulama boşuna başarısız oluyordu**
   (`packs-ui.tsx`): katalogdaki SHA-256 ve aynalar, bilgi noktasındaki başka tarihli/boyutlu
   dosyaya da uygulanıyordu → "SHA-256 doğrulaması başarısız — dosya silindi". Artık yalnız aynı
   sürüme (`downloadRequestFor`). Özet doldurma bu hatayı daha sık gösterecekti.
9. **[güvenlik-orta] İndirme çekirdeği** (`download-core.ts`, `opfs-store.ts`):
   bilinen boyuttan fazla veri gönderen ayna artık diski dolduramıyor (hemen durur, yarım dosya
   silinir); özet varken doğrulayıcı yoksa indirme hiç başlamıyor (sessizce doğrulamasız inmez);
   Range'siz istekte 416 sonsuz yeniden denemeye yol açmıyor; senkron OPFS yazısı 0 bayt
   döndürürse sonsuz döngü yerine kota hatası.
10. **[hata] Sunucu indiricisi** (`server/fetcher.mjs`):
    - disk dolu (ENOSPC/EDQUOT) artık her bölümde 27 kez artan beklemeyle denenmiyor: hemen
      "Yer yetersiz…" hatası (tarayıcı bunu "yer" hatası olarak gösterir);
    - kalıcı hatada öbür bölümler kapanmış dosyaya yazmayı sürdürüyordu → hepsi birlikte durur;
    - **aralık desteklemeyen aynada kopan bağlantı dosyayı sessizce bozuyordu** (baştan gelen
      veri kalınan yere yazılıyordu) → baştan alınır;
    - boyut uyuşmazlığında yarım dosya kalıp her denemede aynı hataya takılıyordu → silinir.
11. **[hata] Bozuk yerel kayıtlar İletişim'i çökertebiliyordu** (`src/iletisim/outbox.ts`):
    profil ya da önbellek kaydı `null`/dizi olunca `TypeError` (BoardService modül yüklenirken
    kurulduğu için sekme açılamıyordu); giden kutusundaki eksik alanlı taslaklar ekrana
    ulaşıyordu. Artık hepsi doğrulanıyor. `downloader.ts` kayıtlı indirme durumunu alan alan
    doğruluyor (`restoreState`).
12. **[güvenlik-düşük] Bellek sınırları**: mesh'te komşu başına bilinen kimlik kümesi en çok
    5000 (rastgele "have" yağmuru belleği büyütemez); bilgi noktası yanıtı en çok 4 MB
    (`readJsonCapped`; elle girilen kötü adres); JSON paketleri (rehber 100 MB, hava 16 MB)
    okunmadan önce ve akış sırasında sınırlı; `HttpRangeSource` başka aralık döndüren (206) ya da
    Range'i yok sayıp 64 MB'tan büyük dosyanın tamamını gönderen sunucuyu reddediyor.
13. **[güvenlik-düşük] `dosya-olc.yml`**: jetona hiç yetki verilmiyor (`permissions: {}`),
    `curl` yalnız https (yönlendirmeler dahil).

### Katalog SHA-256 doldurma

`public/packs-manifest.json`'da 63 paketten 54'ünün özeti yoktu; **23'ü dolduruldu**
(9 → 32). Kaynak yalnız Hugging Face API'sinin LFS özetleri (`lfs.oid` = SHA-256), ve yalnız
dosya adı ile bayt boyutu katalogdakiyle birebir aynıysa:

- `datasets/akilcantasi/paketler` ağacı: 20 ZIM (ör. `wikipedia-tr-nopic`, `vikisozluk-tr`,
  `ifixit-tr`, `nhs-ilac`, `kitap-*`, `vikipedi-tr-*`, `wikimed-en-mini`). Liste iki ayrı
  okumayla karşılaştırıldı; katalogda zaten olan iki özetle (`wikipedia-tr-mini`,
  `kendine-yetmek`) birebir aynı çıktı.
- `models/unsloth/*`: `fener-qwen3.5-0.8b`, `fener-qwen3.5-4b`, `fener-gemma-4-e2b` (aynı
  depodaki `Qwen3.5-2B` özeti katalogdakiyle aynı çıktı).

Doldurulamayanlar (31): Kiwix'te tek kaynağı olan 29 ZIM (bu ortamda `download.kiwix.org`
erişimi engelli; `<dosya>.sha256` okunamadı) ve `akilcantasi.com/packs/whisper-*-ses.tar` (2;
yetkili özet kaynağı yok). Doğrulama, özet olan her pakette tarayıcı (`download-core`), sunucu
(`fetcher.mjs`) ve Android (`PaketIndirici`) tarafında zorunlu.

Not: Hugging Face'teki `harita/turkiye*.pmtiles`, `noktalar/…geojson` ve `hava/…json` bu
katalogdakinden yeni (boyutları farklı). Uygulama çevrimiçiyken merkezi kataloğu alıp düzeltir;
depodaki kopyayı aylık iş (`aylik-harita.yml`) günceller. Bu yüzden elle değiştirilmedi.

### Kalanlar / başka kapsam

- Mesh'te imza yok: aynı kimlikle önce gelen kazanır, gönderen adı doğrulanamaz, bir komşu
  geçerli mesajlarla 500'lük depoyu doldurup başkalarınınkini düşürebilir. Protokol gereği;
  çözüm imzalı mesajlardır (öneri).
- Kayıp ilanını herkes "bulundu" yapabilir (sunucu, Java ve mesh): bilinçli tasarım.
- `src/tools/enkaz-arama/index.tsx` `hedefOku()`: kayıtlı hedefin alan türleri denetlenmiyor
  (`kod` metin mi, `lat`/`lon` sayı mı). Yalnız yerel kayıt bozulursa önemli; Araçlar kapsamı.
- `InfoPointServer.java` (Android bilgi noktası) gövde için zaten `Content-Length` istiyor ve
  4096 bayt sınırı var; kodlanmış yol denetimi Java'da ayrıca gözden geçirilmeli (platform kapsamı).
- HTML → metin ayrıştırıcısı hâlâ düzenli ifadeyle çalışıyor; çok uzun tırnaklı öznitelikler
  içeren olağan dışı bir makale yavaş olabilir (karesel değil, ama elle yazılmış bir ayrıştırıcı
  daha sağlam olurdu).

### Komutlar

```
npx tsc --noEmit
npx vitest run tests/guvenlik.test.ts tests/zim-guvenlik.test.ts tests/server.test.ts \
  tests/fetcher.test.ts tests/downloader.test.ts
node e2e/sanitize-check.mjs                       # 35 saldırı girdisi + DOM clobbering
npx vite build --outDir /tmp/guv-dist
node e2e/download-check.mjs --dist /tmp/guv-dist  # 15/15
AKIL_DIST=/tmp/guv-dist node e2e/sunucu-indirme-check.mjs
node e2e/qa-kutuphane.mjs                         # dört bilgi noktası kurulumu: dosyanın başına bakın
```
