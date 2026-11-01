# Bilgi noktası (masaüstü sunucu)

Bilgi noktası, Akıl Çantası'nı ve içerik paketlerini (Vikipedi, harita, Fener
modeli) bir bilgisayardan aynı ağdaki tüm telefonlara sunar. İnternet gerekmez.
Telefonlarda uygulama kurulu olması da gerekmez: tarayıcıdan adresi açmaları yeterli
(iPhone dahil).

## Ne gerekir

- Windows 10/11, macOS ya da Linux çalışan bir bilgisayar
- Node.js 18 veya üstü (https://nodejs.org — "LTS" sürümü)
- Bu klasör: `dist/` (uygulama), `server/` (sunucu), `data/` (paketler)

## Paketleri yerleştirme

İndirdiğiniz paket dosyalarını `data/` klasörüne ya da bir alt klasörüne
(`data/zim`, `data/models`, `data/ses`, `data/maps`) kopyalayın:

- `*.zim` — Kütüphane: Vikipedi, WikiMed, Vikikitap, Vikisözlük… (Kiwix)
- `*.gguf` — Fener modeli (2 GB üstü modeller parçalı: `<ad>-00001-of-00002.gguf`)
- `*.tar` — Fener "sesli sor" paketi (Whisper, ör. `whisper-base-ses.tar`)
- `*.pmtiles` — harita
- `*.geojson` — harita noktaları (toplanma alanı, hastane, eczane…)

Windows'ta tarayıcıyla İndirilenler'e indirdiğiniz bilinen paketleri proje
klasöründeki `paketleri-yerlestir.cmd` doğru alt klasörlere taşır (Whisper
dosyalarından `.tar` paketini de o hazırlar). Alt klasörler yalnızca bir düzey
derine bakılır; adı `_` ile başlayan klasörler atlanır.

İsterseniz Android APK'sını `data/akil-cantasi.apk` (ya da `apk/akil-cantasi.apk`)
olarak koyun; telefonlar uygulamayı bilgi noktasından indirebilir.

## Paketleri sunucuya indirtme (önerilen)

Uygulamayı bu sunucudan açtığınızda (ör. `onizle.cmd` ya da `start-windows.cmd`), Kütüphane ve
Araçlar → Paketler'deki **İndir** düğmesi dosyayı tarayıcı yerine sunucuya indirtir:

- Tarayıcılar Kiwix dosyalarını yalnızca CORS izni veren tek aynadan çekebilir ve o ayna sık sık
  çok yavaşlar. Sunucu bu sınıra takılmaz: Kiwix'in bütün aynalarını kısa bir ölçümle dener,
  en hızlılarını seçer ve dosyayı 4 paralel bağlantıyla indirir.
- Takılan bağlantı 25 saniye sonra yenilenir, gerekirse başka aynaya geçilir.
- Yarım indirmeler `data/_indiriliyor/` klasöründe tutulur; sunucu yeniden açılınca kaldığı
  yerden sürer.
- Biten dosya `data/` klasörüne taşınır ve hemen bütün telefonlara sunulur. Telefonda kalıcı
  kopya isteyenler paket satırındaki **Cihaza kaydet** ile yerel ağ hızında alır.
- Güvenlik için yalnızca katalogdaki (packs-manifest.json) paketler indirilebilir ve indirme
  yalnızca sunucunun çalıştığı bilgisayardan başlatılabilir. Telefonlardan da başlatılsın
  istiyorsanız: `node server/server.mjs --uzaktan-indirme` (ya da `AKIL_REMOTE_FETCH=1`).

## Windows'ta başlatma

1. `server\start-windows.cmd` dosyasına çift tıklayın.
2. Windows Güvenlik Duvarı izin isterse **Özel ağlar**'ı işaretleyip
   **Erişime izin ver**'e basın. (Bunu yapmazsanız telefonlar bağlanamaz.)
3. Pencerede `http://192.168.x.x:8080` gibi bir adres ve bir QR kod görünür.

Port değiştirmek için: `server\start-windows.cmd --port 8081`
Başka bir paket klasörü için: `server\start-windows.cmd --data D:\paketler`

### Wi-Fi yoksa: Mobil erişim noktası (Windows 10/11)

Ortamda modem/Wi-Fi yoksa bilgisayarın kendisi Wi-Fi yayını yapabilir:

1. **Ayarlar → Ağ ve İnternet → Mobil etkin nokta** (Windows 11: "Mobil erişim noktası").
2. "İnternet bağlantımı paylaş" kısmında herhangi bir bağlantı seçili olabilir;
   internet olmasa da yayın çalışır. Kablosuz bağdaştırıcısı gerekir.
3. **Düzenle** ile ağ adını (ör. `AkilCantasi`) ve parolayı belirleyin.
4. **Mobil etkin nokta**'yı **Açık** yapın.
5. Sunucuyu ancak bundan **sonra** başlatın (ya da yeniden başlatın), böylece
   `192.168.137.1` adresi listede görünür.

Not: İnternet bağlantısı hiç yoksa Windows bazen "Mobil etkin nokta"yı açmaz.
Bu durumda telefonlardan birinde erişim noktası açıp bilgisayarı ve diğer
telefonları o ağa bağlayın.

### Telefonda erişim noktası

- **Android:** Ayarlar → Ağ ve internet → Erişim noktası ve tethering → Wi-Fi erişim noktası
- **iPhone:** Ayarlar → Kişisel Erişim Noktası → "Başkalarının Katılmasına İzin Ver"

Bilgisayarı bu ağa bağlayın ve sunucuyu başlatın.

## Telefonlardan bağlanma

1. Telefonu bilgisayarla aynı Wi-Fi / erişim noktasına bağlayın.
2. Kamerayla ekrandaki QR kodu okutun ya da tarayıcıya adresi yazın:
   `http://<bilgisayarın-adresi>:8080`
3. Kütüphane, harita ve Fener paketleri doğrudan bilgi noktasından okunur.

Bilinmesi gerekenler:

- `http://` adresleri "güvenli bağlam" sayılmaz. Bu yüzden telefon tarayıcısı
  paketleri **kendi depolamasına kaydedemez**; paketler bağlantı sürdükçe bilgi
  noktasından okunur. Kalıcı kopya için Android uygulamasını kurun ya da dosyaları
  USB ile aktarıp "Dosyadan içe aktar"ı kullanın.
- Aynı nedenle Fener (yapay zekâ) telefon tarayıcısında tek iş parçacığıyla, daha
  yavaş çalışabilir. Bilgisayarın kendisinde `http://localhost:8080` açıldığında
  tam hızda çalışır.
- "Bağlı cihaz" sayısı son 2 dakikada uygulamayı açık tutan farklı cihazları gösterir.

## Linux / macOS

```sh
./server/start.sh              # ya da: node server/server.mjs
./server/start.sh --port 8081 --data /media/usb/paketler
```

## Uç noktalar (geliştiriciler için)

- `GET /api/fetch` → `{available, allowed, jobs}`; `POST /api/fetch` `{action: 'start'|'pause'|'cancel', file}` — sunucu tarafı indirme (ayrıntılar `server/fetcher.mjs`).

| Yol | Açıklama |
| --- | --- |
| `GET /api/status` | `{server, name, addresses, port, clients, apk}` |
| `GET /api/packs` | `{files: [{name, size, url}]}` — `data/` içindeki paketler |
| `GET/HEAD /data/<dosya>` | HTTP Range (206) destekli paket dosyası |
| `GET /download/akil-cantasi.apk` | APK (varsa) |
| `GET /packs-manifest.json` | `data/packs-manifest.json` varsa o, yoksa uygulamanınki |
| `GET /api/board?since=<ms>` | Mesaj panosu kayıtları `{items, now}` |
| `POST /api/board` | Pano kaydı ekler (JSON; IP başına dakikada 20) → `data/board.json` |

Tüm yanıtlar `Cross-Origin-Opener-Policy: same-origin`,
`Cross-Origin-Embedder-Policy: require-corp` ve
`Cross-Origin-Resource-Policy: cross-origin` başlıklarını taşır (wllama çok iş
parçacıklı çalışması için) ve bir `Content-Security-Policy` ile ZIM makalelerinin
betik çalıştırması engellenir. Ortam değişkenleri: `AKIL_PORT`, `AKIL_DATA`, `AKIL_DIST`.
