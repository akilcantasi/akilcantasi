# Enkaz modu ve enkaz arama

Enkaz altında şebeke de GPS de çoğu zaman yoktur. Bu yüzden amaç "telefon nerede olduğunu
bulsun" değil, "kurtarıcı telefonu bulsun"dur: konum enkazdan önce kaydedilir, enkazdan sonra
telefon kendini bulunur kılar.

Araçlar → Acil durum: **Enkaz modu** (`src/tools/enkaz`) ve **Enkaz arama** (`src/tools/enkaz-arama`).
İletişim ekranındaki hızlı yardımda da iki düğme var.

## Akış

1. **Afetten önce (hazırlık)**
   - Bina bilgisi: ad, adres/tarif, blok, kat, daire, not, isteğe bağlı binanın konumu
     (`ac.binalar`, en çok 4). Yalnız bu cihazda.
   - Son konum kaydı: uygulamanın bulduğu her konum yazılır (harita, hızlı SMS).
     İsteğe bağlı arka plan kaydı (**varsayılan kapalı**): saatte bir ya da hareket
     halindeyken 15 dakikada bir (`KonumKaydi.java`, WorkManager). Son 24 kayıt.
2. **Enkaz modu** (`EnkazServisi.java`, ön plan servisi, uygulama kapansa da sürer)
   - BLE işareti: kimlik, son konum ve yaşı, kat, pil (`EnkazIsareti.java`).
   - SOS ses (2,9 + 3,15 kHz, alarm sesi düzeyinde) ve flaş; pil ≥ %50 dakikada bir,
     %20–50 iki dakikada, %10–20 beş dakikada, altı on dakikada bir. 10 dk susturulabilir
     (yaklaşan sesleri dinlemek için).
   - GPS 30 dakikada bir en çok 60 sn denenir.
   - Başlarken 112'ye ve yakınlara SMS (giden kutusu, şebeke gelene kadar 72 saat yeniden dener).
   - Uygulamasız görünürlük: Bluetooth adı "ENKAZ · Ayşe · B blok 3. kat" yapılır ve 1 saatlik
     görünürlük istenir; bitince hatırlatma bildirimi. Kapanınca eski ad geri yüklenir.
   - Kapatmak için 2 sn basılı tutmak gerekir.
3. **Yakındaki telefonlar**
   - Enkaz arama (kurtarıcı): hızlı tarama, sinyal gücünden sıcak-soğuk göstergesi,
     yaklaşma/uzaklaşma eğilimi, yaklaştıkça sıklaşan bip, "112'ye SMS ile bildir".
   - Nöbet (**varsayılan kapalı**): uygulama kapalıyken sistemin düşük güçlü taraması
     (`EnkazTarayici.java`, PendingIntent). Duyulunca bildirim: "Arama modunu aç", "112'yi ara".
     Kendiliğinden kimseye mesaj gitmez: aynı işareti duyan çok sayıda telefon 112'yi
     boğmasın diye iletme kullanıcıya bırakılır.
4. **Sarsıntıdan sonra sor** (deneysel, **varsayılan kapalı**, `SarsintiServisi.java`)
   - Ölçüt `SarsintiDedektoru.java`: en az 30 sn sakinlik → yön değişmeden en az 4 sn güçlü
     titreşim → 2 dk hareketsizlik. Telefonu alıp yürümek yönü değiştirir, sayılmaz.
   - "İyi misiniz?" bildirimi; 3 dk yanıt yoksa enkaz modu açılır (yalnız işaret, ses ve ışık;
     SMS göndermez). İşarette "otomatik" bayrağı olur; kurtarıcı ekranında belirtilir.

## İşaret kodu ve SMS bağlantısı

Her telefonun işaret kimliğinden kısa bir kod türetilir: kimliğin son 24 biti, `AK-34ABCD`.
Enkaz modunun SMS'inin sonuna "İşaret kodu: AK-34ABCD." eklenir. SMS'i alan yakın ya da kurtarıcı
metni Enkaz arama → "Belirli birini mi arıyorsunuz?" alanına yapıştırır; kod, son konum, yaşı,
ad ve bina tarifi okunur (`smsCoz`). Uzak aşama: "Haritada yön göster" (harita hedefi). Yakın
aşama: o kodun işareti duyulunca kendiliğinden seçilir, listede en üste çıkar ("Aranan kişi").
Uygulama SMS'leri kendisi okumaz (ayrı izin gerekir; Play Protect uyarısını büyütür).

## Kurtarıcı ile kısa mesaj

Bağlantı kurmadan, Bluetooth yayınıyla. Metin sığmadığı için hazır mesajların numarası gider
(`Mesajlar.java` ve `src/lib/enkaz/mesajlar.ts`, aynı olmalı; test denetler).

- Kurtarıcı (Enkaz arama → seçili işaret → "Mesaj gönder"): `AK 0x03 + hedef kimlik + mesaj no +
  kod` 3 dakika yayılır (`EnkazTarayici.mesajGonder`).
- Enkazdaki telefon kurtarıcı mesajlarını düşük güçte sürekli dinler (pil < %20 ise 2 dakikada
  bir 20 sn). Kendisine gelen mesajda titrer, kısa uyarı sesi verir, Türkçe çevrimdışı ses
  yüklüyse sesli okur, bildirim gösterir; mesaj numarasını işaretine "onay" olarak ekler.
- Kurtarıcının ekranında onay görülünce "Ulaştı ✓".
- Enkazdaki kişi hazır yanıtlardan birine dokunur ("Yaralıyım", "İki kişiyiz"…); yanıt kodu
  işarete eklenir ve kurtarıcının ekranında, 112'ye bildirme SMS'inde görünür.

## BLE işaret biçimi

Üretici verisi, şirket kimliği `0xFFFF` (Bluetooth SIG deneme değeri):

| bayt | içerik |
|---|---|
| 0–1 | `A` `K` |
| 2 | sürüm (üst 4 bit, şu an 1) · bayraklar: bit0 enkaz, bit1 konum var, bit2 otomatik |
| 3–6 | kimlik (cihaz başına rastgele) |
| 7–10 / 11–14 | enlem / boylam × 1e7 |
| 15–16 | konumun yaşı (dk; 0xFFFF bilinmiyor) |
| 17 | pil % (0xFF bilinmiyor) |
| 18 | kat (işaretli; −128 bilinmiyor) |
| 19 | doğruluk / 4 m (0xFF bilinmiyor) |
| 20 | yayın gücü düzeyi (0–3) |
| 21 | onaylanan son kurtarıcı mesajı numarası (0 yok) |
| 22 | hazır yanıt kodu (0 yok) |
| 23 | yanıt sayacı |

24 bayt: 3 bayt bayrak + 4 bayt başlıkla tam 31 bayt. Eski 21 baytlık işaretler de okunur.

Kurtarıcı mesajı: `A` `K` `0x03` + hedef kimlik (4) + mesaj no (1, 1–255) + mesaj kodu (1).

Tarama yanıtı: `A` `K` `0x02` + UTF-8 etiket (en çok 24 bayt). Android'in ayrıştırılmış
kaydı aynı şirket kimliğinden yalnız birini tuttuğu için ikisi ham baytlardan okunur
(`EnkazIsareti.hamdanAyikla`).

## Sınırlar

- Bluetooth enkazda birkaç metre ile 10–15 m arasına iner; mesafe tahmini kabadır, yön
  yaklaşma/uzaklaşmadan bulunur.
- Wi-Fi erişim noktası adı uygulamalarca seçilemiyor (Android rastgele ad verir); bu yüzden
  uygulamasız görünürlük Bluetooth adıyla yapılır ve en çok 1 saat sürer.
- Arka planda konum ve nöbet için "Her zaman izin ver" konum izni gerekir; bazı markalar
  arka plan işlerini durdurur (uygulama pil kısıtlamasını kaldırmayı önerir).
- Gerçek cihazda henüz denenmedi. Deneme planı: iki telefon; biri enkaz modunda, diğeri
  arama modunda; aynı odada, kapalı kapı arkasında, beton duvar arkasında, telefon cepte/yerde.
  Nöbetin ekran kapalıyken ve uygulama kapalıyken bildirim verdiğini, sarsıntı sorusunun
  yürürken ve araçta tetiklenmediğini doğrulayın.

## Testler

- `tools/enkaz-sinama/calistir.sh`: işaret kodlama/çözme, ham reklam ayrıştırma, sarsıntı ölçütü.
- `tests/enkaz.test.ts`: bina, SMS metni, son konum kaydı, sinyal eğilimi.
- `e2e/enkaz-check.mjs`: arayüz, sahte Capacitor köprüsüyle.
