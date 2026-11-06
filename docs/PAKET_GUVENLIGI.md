# Paket güvenliği: özetler, imzalı katalog, model bütünlüğü

Bu belge içerik paketlerinin (ZIM, harita, model, ses, hava, rehber) yolda ya da cihazda
değiştirilmesine karşı alınan üç önlemi anlatır.

## 1. Katalogdaki SHA-256 özetleri

`public/packs-manifest.json` içindeki her paketin `sha256` alanı, indirme bitince tarayıcıda
(`src/lib/download-core.ts`), bilgi noktası sunucusunda (`server/fetcher.mjs`) ve Android
indiricisinde (`PaketIndirici.java`) zorunlu olarak doğrulanır. Özet tutmazsa dosya kurulmaz.

Özetler yalnız yayımcının kendi kaynağından alınır ve yalnız tam olarak o dosya adı için:

- **Kiwix:** her ZIM'in yanında yayımlanan `<adres>.sha256` dosyası
  (`https://download.kiwix.org/zim/.../<ad>.zim.sha256`, satır biçimi `<64 onaltılık>  <ad>`).
- **Hugging Face (`akilcantasi/paketler`):** depo ağacındaki LFS özeti (`lfs.oid`), ancak bayt
  boyutu katalogdakiyle aynıysa.
- **Kendi ürettiğimiz paketler** (harita, noktalar, hava, rehber): `tools/hf/hf-yukle.mjs`
  yüklerken dosyanın kendisinden hesaplar. Özeti eksik bir ZIM'i yüklerken de hesaplar.

Otomatik doldurma: `node tools/hf/sha-doldur.mjs [katalog.json]` eksik özetleri bu kaynaklardan
doldurur; var olan özeti hiçbir zaman değiştirmez (çelişirse yalnız uyarı yazar). Aylık iş
(`.github/workflows/aylik-harita.yml`, "Eksik SHA-256 özetlerini doldur") bunu her ay çalıştırır;
ulaşılamayan kaynak işi durdurmaz, o paket sonraki ay yeniden denenir.

Özeti olmayan paketler: proje sahibinin kendisinin tar ile birleştirdiği Whisper ses paketleri
(`ses-whisper-base`, `ses-whisper-small`). Tar dosyası her oluşturulduğunda (dosya zamanları
yüzünden) farklı bayt verdiği için yayımlanmış bir özeti yoktur; tar'ı oluşturup yükledikten
sonra özet `dosya-olc.yml` işiyle ölçülüp kataloğa elle yazılabilir.

## 2. İmzalı katalog (Ed25519)

Uygulama, uygulamayla birlikte gelen kataloğa (`public/packs-manifest.json`) güvenir. İnternet
varken Hugging Face'teki merkezi kataloğu da dener (`REMOTE_MANIFEST_URL`,
`src/lib/manifest.ts`). Bu katalog **ancak yanında projenin anahtarıyla atılmış geçerli bir imza
varsa** kullanılır:

- Katalog: `https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/packs-manifest.json`
- İmza: aynı adres + `.sig` (64 baytlık ayrık Ed25519 imzasının base64 hâli; katalog dosyasının
  baytları üzerinedir).
- Açık anahtar: `src/lib/katalog-imza.ts` → `KATALOG_ACIK_ANAHTAR`. Doğrulama `@noble/ed25519`
  ile yapılır (WebCrypto gerekmez; bilgi noktası sayfası düz http'de de çalışır).
- İmza yoksa, bozuksa ya da tutmazsa uzak katalog sessizce yok sayılır, konsola
  `[katalog] ... imzası yok/geçersiz` uyarısı yazılır ve uygulama gömülü katalogla sürer.
  Kullanıcıya hata gösterilmez.
- İmza geçerli olsa da katalog gömülü olandan eski ise kullanılmaz (`updated`/`version`).
- Bilgi noktası sunucusunun yerel ağdan sunduğu `./packs-manifest.json` imza istemez: uygulamanın
  kendisi de o sunucudan yüklenmiştir.

### İmzalama aracı

`tools/katalog-imzala.mjs`:

```
node tools/katalog-imzala.mjs [katalog.json ...]        # <katalog>.sig yazar ve hemen doğrular
node tools/katalog-imzala.mjs --dogrula [katalog.json]  # yalnız doğrular (anahtar gerekmez)
node tools/katalog-imzala.mjs --denetle                 # anahtar var mı, uygulamadakiyle eşleşiyor mu
node tools/katalog-imzala.mjs --yeni-anahtar <dosya>    # yeni anahtar çifti (gizli anahtar yalnız dosyaya)
```

Gizli anahtar sırasıyla şuralardan okunur: `--anahtar <dosya>`, `KATALOG_IMZA_ANAHTARI` ortam
değişkeni, `KATALOG_IMZA_ANAHTARI_DOSYASI` ortam değişkenindeki dosya, yerelde
`_gizli/katalog-imza-anahtari.txt`. Biçim: base64 PKCS8, PEM ya da 32 baytlık ham tohum
(base64 veya 64 karakter onaltılık); `#` ile başlayan satırlar açıklamadır. Araç, anahtar
uygulamadaki açık anahtarla eşleşmiyorsa imzalamaz (yanlış anahtar sessizce geçmesin).
Anahtar hiçbir zaman ekrana yazılmaz.

`_gizli/` klasörü `.gitignore`'dadır; gizli anahtar depoya hiçbir zaman girmez.

### Yayımlama

- `tools/hf/hf-yukle.mjs` kataloğu güncelledikten sonra imzalar ve `packs-manifest.json` ile
  `packs-manifest.json.sig`'i Hugging Face'e **tek commit'te** yükler (arada imzası tutmayan bir
  katalog yayımlanmış olmaz). İmza anahtarı yoksa iş en başta, hiçbir şey yüklemeden durur.
- Yalnız kataloğu imzalayıp yüklemek için: `node tools/hf/hf-yukle.mjs --katalog` ya da aylık işi
  `sadece = katalog` ile elle çalıştırmak.
- Aylık iş en başta "Katalog imza anahtarını denetle" adımında `KATALOG_IMZA_ANAHTARI` gizli
  değişkenini arar; yoksa ya da uygulamadakiyle eşleşmiyorsa iş hata ile durur. Depoya geri
  işlenen katalog yeniden imzalanır ve `public/packs-manifest.json.sig` de işlenir.
- `hf-temizlik.yml` imza dosyasını "kullanılıyor" sayar; silinmez.

### Proje sahibinin bir kez yapacakları

1. GitHub deposunda Settings → Secrets and variables → Actions → New repository secret:
   ad `KATALOG_IMZA_ANAHTARI`, değer `_gizli/katalog-imza-anahtari.txt` içindeki `#` ile
   başlamayan tek satır.
2. Merkezi kataloğun imzasını Hugging Face'e koymak için aylık işi elle çalıştırın
   (Actions → "Aylık harita, afet noktaları ve hava" → Run workflow, `sadece` = `katalog`) ya da
   kendi bilgisayarınızda `node tools/hf/hf-yukle.mjs --katalog` (HF_TOKEN ile). Bu yapılana dek
   uygulamalar uzak kataloğu yok sayar ve gömülü katalogla çalışır.
3. Gizli anahtarı güvenli bir yerde yedekleyin (parola yöneticisi). Kaybolursa yeni anahtar
   üretilip açık anahtar `src/lib/katalog-imza.ts`'te değiştirilir; eski sürümler o andan sonra
   uzak kataloğu kabul etmez (gömülü katalogla çalışmaya devam eder).

## 3. Model bütünlüğü (Android 7–10)

Android 7–10'da paket klasörü (`Android/data/org.akilcantasi.app/files/packs`) depolama izni olan
başka uygulamalarca yazılabilir. Yerel motora (llama.cpp) verilen bir GGUF dosyasının indirmeden
sonra değiştirilmemiş olması için:

- İndirme bitince (`PaketIndirici`) dosyanın boyutu, değiştirilme zamanı ve kısmi SHA-256'sı
  (ilk 4 MB + son 4 MB; 8 MB'tan küçük dosyada tamamı) ve varsa doğrulanmış tam SHA-256 uygulamanın
  iç deposuna yazılır (`getFilesDir()/paket-butunlugu.properties`; başka uygulama erişemez).
  Sınıf: `PaketButunlugu.java`.
- `fenerYukle` modeli (bölünmüşse bütün parçalarını) motora vermeden önce bu kaydı denetler.
  Boyut ya da kısmi özet farklıysa model açılmaz. Yalnız zaman farklıysa ve tam özet biliniyorsa
  dosyanın tamamı yeniden özetlenir; tutarsa kabul edilir. Aksi hâlde hata:
  "Model dosyası değişmiş görünüyor; yeniden indirin". Arayüz bu iletiyi gösterir ve modeli
  WebView motoruyla da açmaya çalışmaz (`src/lib/fener/engine.ts`).
- Kaydı olmayan dosyalar (bu sürümden önce indirilmiş modeller) eskisi gibi açılır ve ilk
  başarılı açılışta kaydedilir; kullanıcıdaki paketler bozulmaz.
- Uygulamadan silinen paketin kaydı atılır; klasörden elle silinmiş dosyaların kayıtları paket
  listesi okunurken temizlenir.

Sınırlar: kısmi özet ortadaki baytları kapsamaz (zamanı da geri alan, yalnız ortayı değiştiren bir
saldırı yakalanmaz; tam özet indirmede zaten doğrulanmıştır). Denetim ile motorun dosyayı açması
arasında çok kısa bir aralık vardır. ZIM ve harita dosyaları WebView'a parça parça sunulduğu için
(`MainActivity.packResponse`) bu denetim şimdilik yalnız modellere uygulanır.

## Sınama

- `npx vitest run tests/katalog-imza.test.ts tests/sha-doldur.test.ts tests/paket-butunlugu.test.ts`
- `node e2e/katalog-imza-check.mjs` (dev sunucusu açıkken; imza tarayıcıda doğrulanır)
- `sh tools/indirici-sinama/calistir.sh` (indirme sonrası kayıt, değişiklik yakalama, bölünmüş model)
- `tools/fener-sinama/calistir.sh <llama.cpp> <model.gguf>` (kayıt + yükleme akışı, gerçek motorla)
