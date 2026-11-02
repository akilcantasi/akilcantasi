# Şebekesiz mesh mesajlaşma (Android)

> **UYARI: Yerel (Java/Nearby) kısım gerçek cihazlarda HİÇ DENENMEDİ.**
> Bu ortamda Android SDK ve Gradle yok, Maven Google erişilemiyor. Java kodu
> resmi belgelere göre yazıldı ve taklit (stub) sınıflara karşı `javac` ile
> derlendi. APK derlemesi ve iki telefonla deneme sahibine kalıyor; aşağıdaki
> test planını izleyin. TypeScript protokolü birim testli
> (`tests/mesh.test.ts`) ve tarayıcıda iki sayfalı taklitle denendi
> (`e2e/mesh-check.mjs`).

Telefonlar internet, baz istasyonu veya bilgi noktası olmadan birbirine
mesaj iletir. Mesajlar yakındaki telefonlara sıçrar ve **biriktir-ve-ilet**
(store-and-forward) mantığıyla, insanlar yürüdükçe taşınır: A'nın mesajı B'nin
telefonunda bekler, B, C'nin yanına gelince ona geçer, vb.

Taşıyıcı: **Google Nearby Connections**, `Strategy.P2P_CLUSTER` (M-N bağlantı,
Bluetooth / BLE / Wi-Fi; internet gerekmez). Google Play Hizmetleri gerekir
(Huawei vb. GMS'siz cihazlarda çalışmaz; `lastError() === 'gms'`).

## Mimari

```
İletişim arayüzü ──► src/lib/mesh.ts (Mesh sözleşmesi + createMesh)
                        │
                        ├─ src/lib/mesh/node.ts      MeshNode: dedikodu, depo, kopya ayıklama
                        ├─ src/lib/mesh/protocol.ts  çerçeve biçimi, şema, TTL, sınırlar
                        └─ src/lib/mesh/native.ts    "AkilMesh" Capacitor eklentisi sarmalayıcı
                                   │  (yalnızca metin çerçeveleri)
android/.../AkilMeshPlugin.java ───┘  Nearby: reklam + keşif, otomatik kabul, BYTES yükleri
android/.../MeshPeer.java             uç nokta durumu
```

Java yalnızca bayt taşır ve komşuları bildirir; protokolün tamamı TypeScript'te.

## JS sözleşmesi (arayüz ajanı için)

```ts
import { mesh, newMessageId, type MeshMessage } from './lib/mesh';

mesh.available()            // true: Android + AkilMesh eklentisi var. Tarayıcıda false.
await mesh.start('Ayşe')    // true: reklam+keşif başladı. İlk çağrıda izin penceresi açılır.
await mesh.stop()
await mesh.send({ id: newMessageId(), kind: 'iyiyim', from: 'Ayşe', text: '…', time: Date.now(), lat, lon })
                            // true: geçerli ve depoya alındı (komşu yoksa sonra iletilir).
                            // false: available() false, şema dışı, kopya ya da süresi dolmuş.
const off = mesh.onMessage((m) => …)  // yalnızca YENİ gelen mesajlar, her biri bir kez
mesh.peers()                // yakında görülen cihaz sayısı (keşfedilen + bağlı)
```

Kurallar:
- `onMessage` **kendi gönderdiğiniz** mesajı geri çağırmaz; arayüz kendi
  mesajını kendisi listeye eklemeli (ya da `mesh.messages()` kullanmalı).
- `send` için `start` şart değil: mesaj depoya girer, `start` sonrası komşulara gider.
- `hops`: alıcıda `1` = doğrudan göndericiden geldi, `2` = bir aracı üzerinden, …
  `send` ederken verilen `hops` yok sayılır (0 yapılır).

Ek yardımcılar (`mesh` nesnesinde, sözleşmeye ek, isteğe bağlı):

| Yöntem | Açıklama |
|---|---|
| `messages()` | Bu cihazda saklanan tüm mesajlar (gelen + kendi), eskiden yeniye. Uygulama yeniden açılınca da geri gelir (localStorage). |
| `connected()` | Şu an veri alışverişi yapılan cihaz sayısı |
| `onPeers(cb)` | Komşu listesi değişince `[{ id, node?, name?, connected }]` |
| `running()` | `start` başarılı ve durdurulmadı |
| `lastError()` | `'gms'` (Play Hizmetleri yok), `'permission'` (izin reddedildi), `'nearby:<kod>'` (ConnectionsStatusCodes), `'unavailable'` |
| `nodeId()` | Bu cihazın kalıcı mesh kimliği |

Şema sınırları (`src/lib/mesh/protocol.ts`):
- `id`: `[A-Za-z0-9_-]{8,64}` — `newMessageId()` kullanın.
- `kind`: `mesaj | iyiyim | kayip | duyuru | sos`
- `from` ≤ 40 karakter, `text` ≤ 1000 karakter.
- `time`: ms; 2020 öncesi ya da 24 saatten fazla ileri tarihli mesaj reddedilir
  (saati sıfırlanmış/bozuk telefonlar).
- `lat`/`lon`: ikisi birlikte, geçerli aralıkta.
- Bilinmeyen alanlar atılır.

## Protokol

Her çerçeve UTF-8 JSON metni, tek bir Nearby BYTES yüküdür, ≤ 30 000 bayt
(Nearby `ConnectionsClient.MAX_BYTES_DATA_SIZE`; eklenti gerçek değeri bildirir,
küçük olan kullanılır).

| Çerçeve | Anlam |
|---|---|
| `{"t":"hello","v":1,"node":"…","name":"…"}` | bağlanınca ilk çerçeve |
| `{"t":"have","ids":[…]}` | özet vektörü: aktarılabilir mesaj kimlikleri (≤ 400/çerçeve, yeniler önce) |
| `{"t":"want","ids":[…]}` | eksik olanları iste |
| `{"t":"msgs","ms":[…]}` | mesajlar (≤ 200/çerçeve, bayt sınırına göre paketlenir) |

Akış: bağlanınca iki taraf `hello` + `have` yollar → karşı taraf bilmediği
kimlikleri `want` eder → `msgs` gelir. Bağlıyken yeni mesaj (kendi ya da gelen)
onu bilmeyen tüm komşulara hemen itilir. Komşu başına "bildiği kimlikler"
tutulur; gönderim başarısızsa geri alınır, yeniden bağlanınca özet değişimi
eksikleri tamamlar.

- **Kopya ayıklama:** kimlik depoda ya da "görüldü" listesindeyse (silinen /
  süresi dolan / kapasiteden atılan, 5000 kimlik) atılır ve bildirilmez.
- **TTL:** `mesaj`, `duyuru`, `sos` 72 saat; `iyiyim`, `kayip` 7 gün
  (oluşturma `time`'ından). Süresi dolan silinir, aktarılmaz.
- **Sıçrama sınırı:** `hops ≥ 12` olan mesaj saklanır, gösterilir ama aktarılmaz.
- **Kapasite:** 500 mesaj; aşılınca en eski *başkasının* mesajı atılır, kendi
  mesajlarınız en son atılır.
- **Güvenlik:** kimlik doğrulama ve şifreleme yok, imza yok. Herkes herkesle
  konuşur (afet senaryosu); mesajlar açık metindir ve sahte gönderen adı
  mümkündür. Arayüz bunu belirtmeli; gizli bilgi için uygun değildir.

## Yerel eklenti sözleşmesi (`AkilMesh`)

| Yöntem | Dönüş |
|---|---|
| `isAvailable()` | `{ available, gms, maxBytes, sdk }` |
| `start({ nodeId, name })` | `{ started, error? }` — izinler gerekirse burada istenir |
| `stop()` | `{}` |
| `send({ to?, data })` | `{ sent, error? }` — `to` yoksa tüm bağlılara |
| `getPeers()` | `{ peers: [{ id, node, name, connected }] }` |

Olaylar (`notifyListeners`): `meshMessage {from, data}`, `meshPeers {peers}`,
`meshState {running, error?}`.

Ayrıntılar:
- Hizmet kimliği `org.akilcantasi.mesh.v1`; reklam adı `"<nodeId>|<ad≤20>"`.
- İki taraf aynı anda birbirini keşfeder; çift bağlantı çakışmasını önlemek için
  düğüm kimliği **küçük** olan `requestConnection` yapar, diğeri 8 sn içinde
  bağlantı kurulmazsa kendisi ister.
- Bağlantılar her iki tarafta otomatik kabul edilir; en fazla 6 bağlı komşu.
- Hiç komşu yokken keşif 45 sn'de bir yeniden başlatılır.
- Uygulama kapanınca (`handleOnDestroy`) her şey durur. **Arka planda çalışma
  garanti değil** (ön plan hizmeti yok); ekran kapalıyken / uygulama arka
  plandayken Android süreci durdurabilir.

## Android izinleri (Nearby belgeleri)

Manifest: `CHANGE_WIFI_STATE (≤32)`, `BLUETOOTH`/`BLUETOOTH_ADMIN (≤30)`,
`BLUETOOTH_ADVERTISE`, `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN` (enkaz işaretleri süzülmesin diye neverForLocation yok; bkz. docs/ENKAZ.md),
`NEARBY_WIFI_DEVICES (neverForLocation)`. `ACCESS_WIFI_STATE` ve
`ACCESS_FINE/COARSE_LOCATION` harita için zaten sınırsız tanımlı.

Çalışma anında istenen (`@Permission` takma adları, `neededAliases()`):

| Android | İstenen |
|---|---|
| 6–11 (API 23–30) | konum (`location`) |
| 12 (API 31–32) | `bluetooth` (SCAN/ADVERTISE/CONNECT) + konum |
| 13+ (API 33+) | `bluetooth` + `nearbyWifi` (NEARBY_WIFI_DEVICES) |

Not: `targetSdk` 37'ye (Android 17) çıkarılırsa ve Wi-Fi LAN kullanılacaksa
`ACCESS_LOCAL_NETWORK` da manifest + çalışma anı iznine eklenmeli (şu an
targetSdk 36). Android 11 ve öncesinde BLE taraması için **Konum hizmeti
açık** olmalı.

Bağımlılık: `com.google.android.gms:play-services-nearby:19.5.1`
(android/app/build.gradle; 2026-09-28 sürüm notları).

## Derleme denetimi (SDK'sız)

```
cd /home/claude/javastub/src && javac -d ../out $(find . -name '*.java') \
  /home/claude/akilcantasi/android/app/src/main/java/org/akilcantasi/app/*.java
```
`com/google/android/gms/**`, `com/getcapacitor/**` ve `android/os/Build`,
`android/util/Log` taklitleri gerçek imzalara göre eklendi.
(`MainActivity.java` BridgeActivity/WebView taklitleri olmadığı için bu komutta
hata verir; mesh dosyaları temiz derlenir.)

## İki telefonla test planı

Gerekenler: Google Play Hizmetleri olan 2 Android telefon (biri Android 12+
olsun; mümkünse biri Android 13+), aynı APK. Üçüncü telefon varsa 3. adımda
taşıma (aktarma) denenir.

1. **Derle ve kur.** `apk-derle.cmd` ile APK'yı derleyin, iki telefona kurun.
   Derleme `play-services-nearby` indiremezse `android/build.gradle`'da
   `google()` deposunun olduğundan emin olun.
2. **Hazırlık.** İki telefonda Bluetooth ve Wi-Fi **açık** (bir ağa bağlı olmak
   gerekmez), mobil veri ve Wi-Fi internetini kapatın veya uçak modu +
   Bluetooth + Wi-Fi açık. Android ≤ 11 ise Konum açık.
3. **Başlat.** İletişim ekranından mesh'i başlatın. Arayüz hazır değilse
   bilgisayarda `chrome://inspect` ile WebView konsolunu açıp yerel eklentiyi
   doğrudan deneyin: `await Capacitor.Plugins.AkilMesh.isAvailable()`, sonra
   `await Capacitor.Plugins.AkilMesh.start({nodeId:'test0001',name:'A'})`
   (ikinci telefonda `test0002`/`B`).
   İzin pencerelerini kabul edin. Beklenen: `start` → `true`, `lastError()` boş.
   `adb logcat -s AkilMesh NearbyConnections` ile günlükleri izleyin.
4. **Keşif ve bağlantı.** Telefonları 1–2 m yakın tutun. 5–20 sn içinde iki
   tarafta da `peers()` = 1 ve `connected()` = 1 olmalı. Logcat'te
   `bağlantı sonucu` hata kodu görürseniz not edin.
5. **Canlı mesaj.** A'dan mesaj gönderin → B'de birkaç saniyede görünmeli,
   `hops` = 1. B'den yanıt → A'da görünmeli. Türkçe karakterli ve ~1000
   karakterlik uzun metin deneyin.
6. **Biriktir-ve-ilet.** B'de mesh'i durdurun (ya da B'yi 30+ m uzaklaştırın /
   Bluetooth+Wi-Fi kapatın). A'dan 3 mesaj gönderin. B'yi geri getirin /
   başlatın → bağlanınca 3 mesajın hepsi B'de, her biri **bir kez** görünmeli.
7. **Kopya yok.** Bağlantıyı 2–3 kez kesip yeniden kurun; hiçbir mesaj iki kez
   görünmemeli.
8. **Kalıcılık.** B'de uygulamayı tamamen kapatıp açın; `messages()` önceki
   mesajları içermeli; tekrar bağlanınca kopya oluşmamalı.
9. **İzin reddi.** Uygulama verisini silin, `start`'ta izni reddedin →
   `start` false, `lastError()` = `'permission'`, uygulama çökmemeli.
10. **(3 telefon) Taşıma.** A ve C hiç yan yana gelmesin. A→B yakınlaştırın,
    mesaj B'ye geçsin; B'yi C'nin yanına götürün (A uzakta) → mesaj C'de,
    `hops` = 2.
11. **Pil / arka plan.** Ekran kapalıyken 5 dk bekleyin; bağlantının sürüp
    sürmediğini not edin (bilinen sınırlama).

Sorun çıkarsa logcat çıktısını ve `lastError()` değerini kaydedin;
`nearby:8xxx` kodları `ConnectionsStatusCodes` belgesinde aranabilir.

## Bilinen sınırlamalar

- Yerel kısım cihazda denenmedi (yukarıya bakın).
- iPhone'da yok (Nearby Connections iOS sürümü ayrı ve dahil değil).
- GMS'siz Android (Huawei vb.) desteklenmez.
- Arka planda / ekran kapalıyken çalışma garanti değil; ön plan hizmeti eklemek
  (`FOREGROUND_SERVICE_CONNECTED_DEVICE`) ileride gerekebilir.
- Kimlik doğrulama, şifreleme ve imza yok.
- Bir mesaj en fazla 12 sıçrama ve 72 saat / 7 gün yaşar.
