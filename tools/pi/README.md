# Raspberry Pi bilgi noktası

Bir Raspberry Pi'yi, elektrik ve internet olmayan bir yerde (toplanma alanı,
çadırkent, muhtarlık, okul) **Akıl Çantası bilgi noktasına** çevirir. Pi kendi
Wi-Fi ağını yayar; telefonlar bu ağa bağlanıp tarayıcıdan uygulamayı, Vikipedi'yi,
haritayı ve rehberleri açar. Telefonlara uygulama kurmak gerekmez (iPhone dahil).

> **Önemli:** Bu klasördeki betikler gerçek bir Raspberry Pi üzerinde **test
> edilmedi**. Yalnızca sözdizimi denetimi (`bash -n`, `shellcheck`) yapıldı ve
> `captive.mjs` bir Linux bilgisayarda denendi. İlk kurulumu yedek bir SD kartta
> yapın ve sonucu bize bildirin.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `kur.sh` | Node.js'i kurar, uygulamayı `/opt/akilcantasi` altına kopyalar, açılışta başlayan hizmeti oluşturur |
| `erisim-noktasi.sh` | NetworkManager (`nmcli`) ile "AkilCantasi" Wi-Fi ağını açar/kapatır |
| `captive.mjs` | İsteğe bağlı "ağda oturum açın" yönlendirmesi (port 80 ön sunucu) |
| `ssd-hazirla.sh` | NVMe SSD'yi ya da USB diski paket klasörü olarak kalıcı bağlar |
| `icerik-indir.sh` | `icerik.conf` listesindeki paketleri internetten indirir (kaldığı yerden sürer, eski sürümü siler) |
| `icerik.conf` | İndirilecek paketlerin listesi: başındaki `#` işaretini kaldırarak açın |
| `afet-noktalari.mjs` | Afet noktaları paketini OpenStreetMap'ten oluşturur (`icerik-indir.sh` çağırır) |

## Ne gerekir

- Raspberry Pi 4 ya da 5 (2 GB yeter; Pi 3B+ ve Zero 2 W de çalışır ama yavaştır)
- 32 GB ya da daha büyük microSD kart (bkz. "SD kart ipuçları")
- Uygun güç kaynağı (bkz. "Güç ve güneş enerjisi")
- Kurulum sırasında **bir kez** internet (Node.js indirmek için). Sonrasında internet gerekmez.
- Bir bilgisayarda derlenmiş uygulama: `npm run build` ile oluşan `dist/` klasörü
- İçerik paketleri: `.zim` (Kütüphane), `.pmtiles` (harita), `.geojson` (noktalar), `.gguf` (Fener modeli), `.tar` (Fener ses paketi); `data/zim`, `data/models`, `data/ses` gibi alt klasörlerde olabilir

## Adım adım kurulum

### 1. SD kartı hazırlayın

1. Bilgisayara **Raspberry Pi Imager**'ı kurun.
2. İşletim sistemi olarak **Raspberry Pi OS Lite (64-bit)** seçin (Bookworm). Masaüstü
   gerekmez; Lite daha az güç ve bellek kullanır.
3. Ayarlar (dişli) menüsünde:
   - ana makine adı: `akilcantasi`
   - kullanıcı adı ve parola belirleyin
   - **SSH'yi açın**
   - Wi-Fi ülkesi: **TR** (kurulum sırasında internete bağlanacağı Wi-Fi'yi de girebilirsiniz)
4. Kartı yazın, Pi'ye takın, Pi'yi çalıştırın.

### 2. Dosyaları Pi'ye kopyalayın

Bilgisayarda proje klasöründe önce derleyin:

```
npm run build
```

Sonra `dist/`, `server/`, `tools/pi/` ve `data/` klasörlerini Pi'ye kopyalayın.
Örneğin bilgisayardan (Windows'ta PowerShell da `scp` içerir):

```
scp -r dist server tools data kullanici@akilcantasi.local:~/akilcantasi/
```

Büyük paketleri (Vikipedi birkaç GB olabilir) bir **USB bellekle** taşımak daha hızlıdır.

### 3. Kurulum betiğini çalıştırın

Pi'ye SSH ile bağlanın (`ssh kullanici@akilcantasi.local`) ve:

```
cd ~/akilcantasi
sudo bash tools/pi/kur.sh --hotspot
```

Bu komut:

1. Node.js LTS'yi NodeSource'un resmi apt deposundan kurar
   (internet yoksa ya da Pi Zero/Pi 1 gibi 32 bit ARMv6 cihazlarda `--node debian`
   ile Debian'ın kendi Node.js 18 paketini kullanın).
2. Uygulamayı `/opt/akilcantasi` altına kopyalar.
3. `akilcantasi` adlı systemd hizmetini oluşturur; Pi her açıldığında sunucu
   **port 80**'de başlar.
4. "AkilCantasi" adlı **açık** (parolasız) bir Wi-Fi ağı açar.

Sık kullanılan seçenekler:

```
sudo bash tools/pi/kur.sh --port 8080                       # port 8080
sudo bash tools/pi/kur.sh --hotspot --password 12345678     # parolalı ağ (en az 8 karakter)
sudo bash tools/pi/kur.sh --hotspot --captive               # "ağda oturum açın" yönlendirmesi
sudo bash tools/pi/kur.sh --data /media/kullanici/USB/data  # paketleri USB'den kopyala
sudo bash tools/pi/kur.sh --no-copy-data --data-dir /media/kullanici/USB/data  # USB'den doğrudan sun
sudo bash tools/pi/kur.sh --uninstall                       # hizmeti kaldır
```

Tüm seçenekler: `bash tools/pi/kur.sh --help`

### 4. Telefonlardan bağlanın

1. Telefonun Wi-Fi ayarlarında **AkilCantasi** ağına bağlanın.
2. "Bu ağda internet yok" uyarısı çıkarsa **bağlı kal / yine de kullan**'ı seçin.
3. Tarayıcıda **http://10.42.0.1** adresini açın
   (`http://akilcantasi.lan` de çalışır). Adresin başına `http://` yazın; `https://` çalışmaz.
4. İsterseniz adresi bir kâğıda yazıp QR kodla birlikte bilgi noktasının yanına asın.

Uygulama açıldıktan sonra **Araçlar → Paketler ve paylaşım**'dan paketleri
telefona indirebilirsiniz; böylece telefon ağdan ayrılınca da çalışır.

### 5. Kontrol ve bakım

```
systemctl status akilcantasi        # çalışıyor mu?
journalctl -u akilcantasi -f        # günlük
sudo systemctl restart akilcantasi  # yeniden başlat
sudo bash tools/pi/erisim-noktasi.sh --off   # Wi-Fi ağını kapat
sudo poweroff                        # güvenli kapatma (fişi çekmeden önce!)
```

Paket klasörüne (`/opt/akilcantasi/data`) yeni dosya kopyaladığınızda sunucuyu
yeniden başlatmak gerekmez.

## Büyük disk (SSD) ve içerikleri Pi'nin kendisine indirme

Vikipedi, tamir kılavuzları ve modeller onlarca GB tutar. SD kart hem küçük hem yavaş
olduğu için içerikleri bir SSD'de tutmak ve Pi'nin bunları kendisinin indirmesi daha
kolaydır (bilgisayardan kopyalamaya gerek kalmaz).

Önerilen donanım: Raspberry Pi 5 + M.2 NVMe HAT + 256 GB ya da daha büyük NVMe SSD,
resmi 5V/5A adaptör ve aktif soğutucu (Pi 5 ve SSD ısınır). USB 3 disk de olur.

1. Diski bağlayın (diskin adını `lsblk` ile bulun; genelde `nvme0n1` ya da `sda`).
   Disk ext4 değilse **biçimlenir**; betik önce `EVET` yazmanızı ister:
   ```
   sudo bash tools/pi/ssd-hazirla.sh /dev/nvme0n1
   ```
2. Hizmeti bu klasörü kullanacak şekilde kurun:
   ```
   sudo bash tools/pi/kur.sh --no-copy-data --data-dir /srv/akilcantasi/data --hotspot --captive
   ```
3. `tools/pi/icerik.conf` dosyasında istediğiniz satırların başındaki `#` işaretini
   kaldırın (varsayılan liste ~10 GB), sonra indirin. Pi'nin bir süreliğine internete
   bağlı olması gerekir (Ethernet en kolayı):
   ```
   sudo bash tools/pi/icerik-indir.sh --hedef /srv/akilcantasi/data
   ```
   İndirmeler saatler sürebilir. Elektrik ya da bağlantı kesilirse **aynı komutu
   tekrar çalıştırın**; inen kısım korunur. Her ZIM'in en yeni sürümü Kiwix'ten
   bulunur, eski sürümü silinir; güncellemek için de aynı komutu çalıştırmanız yeterli.
   `--deneme` ile önce ne indirileceğini görebilirsiniz.
4. Harita (`turkiye.pmtiles`) listede yok; bilgisayardan `data/maps/` içine kopyalayın.

### Erişim noktası açıkken Pi'yi internete bağlamak

Pi'nin dahili Wi-Fi'si erişim noktası olarak kullanılır. Ethernet kablosu yoksa
güncelleme ya da yeni içerik için **ikinci bir USB Wi-Fi adaptörü** takın
(MediaTek MT7601U yongalılar sürücü kurmadan çalışır; siyah USB 2.0 girişini
tercih edin, mavi USB 3.0 girişleri 2,4 GHz'te parazit yapabilir):

```
nmcli device wifi list ifname wlan1
sudo nmcli device wifi connect "AG_ADI" password "PAROLA" ifname wlan1 name gecici-wifi
sudo bash tools/pi/icerik-indir.sh --hedef /srv/akilcantasi/data
sudo nmcli connection delete gecici-wifi
```

## Captive portal ("ağda oturum açın") — isteğe bağlı

`--captive` ile Pi, ağdaki **tüm alan adlarını** kendine yönlendirir. Telefonlar
internet olup olmadığını denetlerken Pi'ye ulaşır ve çoğu telefonda "Ağda oturum
açın" bildirimi çıkar; buna dokununca Akıl Çantası açılır.

Sınırlar (bilinçli olarak not edilmiştir):

- **Oturum açma penceresi tam bir tarayıcı değildir.** iOS ve Android'in açtığı
  küçük pencere dosya depolamayı, indirmeyi ve bazen JavaScript özelliklerini
  kısıtlar; kapandığında içindeki her şey silinir. Paket indirmek ya da uzun
  okuma için kullanıcıya **tarayıcıda http://10.42.0.1 adresini açmasını** söyleyin.
  Uygulama bu pencerede açıldığını algılar ve kullanıcıya adresi kopyalama düğmesiyle
  birlikte bu uyarıyı kendisi gösterir. iPhone Safari'nin **gizli sekmesinde** de
  aynı uyarı çıkar (gizli sekme paketleri kaydedemez).
- **iPhone:** Pencerede "İptal"e basılırsa iOS ağdan ayrılabilir. "İnternetsiz
  Kullan" seçilmelidir.
- **Android:** İnternet olmadığı için telefon mobil veriye geçebilir ya da ağı
  "internet yok" diye işaretleyebilir. "Bağlı kal" seçilmeli. "Özel DNS" açıksa
  yönlendirme çalışmayabilir.
- **HTTPS siteleri yönlendirilemez** (sertifika uyarısı verir). Yalnız `http://`
  adresler ve telefonların kendi denetim adresleri Pi'ye düşer.
- Yönlendirme yalnızca Pi'nin **kendi erişim noktasında** çalışır; Pi başka bir
  modeme bağlıysa o ağdaki telefonları etkilemez.
- Asıl sunucu bu modda 8080'de çalışır; `captive.mjs` 80'de durur ve istekleri
  oraya aktarır. Uygulamanın gösterdiği QR kod `:8080` adresini gösterebilir;
  o adres de çalışır.

## Güç ve güneş enerjisi

Aşağıdaki tüketim değerleri **yaklaşıktır**; Pi modeline, bağlı telefon sayısına
ve USB aygıtlarına göre değişir. Kendi kurulumunuzu bir USB güç ölçerle ölçün.

| Model | Resmi güç kaynağı | Boşta (yaklaşık) | Yük altında (yaklaşık) |
| --- | --- | --- | --- |
| Pi 5 | 5 V / 5 A USB-C (27 W) | 3 W | 6–8 W |
| Pi 4 | 5 V / 3 A USB-C (15 W) | 3 W | 5–6 W |
| Pi 3B+ | 5 V / 2,5 A micro-USB | 2 W | 4–5 W |
| Pi Zero 2 W | 5 V / 2,5 A micro-USB | 0,7 W | 2–3 W |

- **Düşük voltaj** en sık sorundur: ince/uzun kablo ve zayıf adaptörler SD kartı
  bozabilir. Kontrol: `vcgencmd get_throttled` (sonuç `0x0` olmalı).
- **Powerbank:** 20 000 mAh (yaklaşık 74 Wh) bir powerbank, ~4 W çeken bir Pi 4'ü
  dönüşüm kayıplarıyla birlikte kabaca **12–15 saat** çalıştırır. Powerbankın
  çıkışı 5 V / 3 A vermeli; bazıları düşük akımda kendini kapatır.
- **Güneş paneli (tahmini boyutlandırma):** 7/24 çalışan ~4 W'lık bir Pi günde
  ~100 Wh harcar. Türkiye'de günde ortalama 4–5 "tam güneş saati" ve %70 sistem
  verimiyle ~30–40 W panel gerekir; bulutlu günler için **50 W panel**, **12 V
  LiFePO4 akü (en az 20 Ah)**, bir **şarj denetleyici** ve **12 V → 5 V (en az
  3 A) dönüştürücü** önerilir. Kış ve bulutlu bölgelerde paneli büyütün.
- **Tasarruf:** Lite sürümünü kullanın, ekran/klavye bağlamayın, gerekmedikçe
  Bluetooth'u kapatın (`/boot/firmware/config.txt` içine `dtoverlay=disable-bt`).
  Gece kullanılmayacaksa bir zaman röleli priz/denetleyiciyle kapatabilirsiniz
  (önce `sudo poweroff`).

## SD kart ipuçları

- **A1/A2 sınıfı**, bilinen bir markanın **32 GB ya da büyük** kartını kullanın.
  Sahte/ucuz kartlar en sık arıza nedenidir.
- **Büyük paketleri USB belleğe ya da USB SSD'ye** koyun (`--data-dir`); SD kart
  yalnızca sistemi taşısın. Okuma hızı da artar.
- **Fişi çekmeden önce** `sudo poweroff` yapın ve yeşil ışığın sönmesini bekleyin.
  Ani elektrik kesintisi SD kartı bozabilir.
- Sık elektrik kesilen yerlerde `sudo raspi-config` → **Performance Options →
  Overlay File System** ile sistemi salt okunur yapabilirsiniz. Bu durumda
  sunucunun yazdığı duyuru panosu (`board.json`) yeniden başlatınca silinir;
  paket klasörünü USB'de tutun (`--data-dir`).
- Çalışan kartın **yedeğini** alın (Imager ya da `dd`); ikinci bir karta yazıp
  bilgi noktasının yanında saklayın.

## Sorun giderme

- **Wi-Fi ağı görünmüyor:** `nmcli device status` ile `wlan0` var mı bakın;
  `sudo raspi-config` → Localisation → WLAN Country → TR. Sonra
  `sudo bash tools/pi/erisim-noktasi.sh` yeniden.
- **Telefon bağlanıyor ama sayfa açılmıyor:** `http://10.42.0.1` yazın (https değil).
  `systemctl status akilcantasi` ve `journalctl -u akilcantasi -n 50` çıktısına bakın.
- **Ağ görünüyor ama telefonlar "hatalı parola" diyor ya da birkaç saniyede kopuyor:**
  Parola 8–63 karakter olmalı. Parola doğruysa erişim noktası bağlantısı düşmüş olabilir:
  `nmcli connection show --active` ile "AkilCantasi" bağlantısının etkin olduğuna bakın;
  değilse `sudo bash tools/pi/erisim-noktasi.sh` ile yeniden açın. USB Wi-Fi
  adaptörü takılıyken erişim noktasını yeniden kurmayın; ağ adaptöre taşınabilir.
- **İçerik indirmesi "bağlantı sıfırlandı" hatası veriyor:** Bazı sunucular Türkiye'den
  engelli olabilir. `icerik.conf` içindeki Kiwix paketleri iki ayrı adresten denenir;
  ikisi de olmuyorsa paketi bilgisayarda indirip USB bellekle kopyalayın.
- **Port 80 kullanımda:** Başka bir web sunucusu (nginx/apache) varsa durdurun ya da
  `--port 8080` kullanın.
- **Çok sayıda telefon:** Pi'nin dahili Wi-Fi'si aynı anda sınırlı sayıda cihazı
  rahat kaldırır (yaklaşık 10; sürücüye ve modele göre değişir, deneyerek görün). Daha
  kalabalık yerlerde Pi'yi Ethernet ile ayrı bir Wi-Fi modeme/erişim noktasına
  bağlayın; o zaman `--hotspot` gerekmez.
