# QA: Araçlar sekmesi

Kapsam: src/tabs/AraclarTab.tsx, src/tools/** (canta, hesap, stok, pil, pusula yalnız giriş, cocuk, sozluk, radyo, paylas, ayarlar), src/tabs/PaylasTab.tsx, src/styles/paylas.css, src/lib/settings.ts.

## Test edilenler
- [x] Araç listesi: 10 kartın hepsi açılıyor, başlık var, "← Araçlar" geri dönüyor (390×844, 360×640, 1280×800)
- [x] Her araçta tüm `<details>` açıkken dokunma hedefleri ≥ 44 px, yatay taşma yok, konsol hatası yok (3 ekran boyutu)
- [x] Kalıcılık (yeniden yüklemeden sonra): çanta işareti ve seçeneği, hesap (yetişkin, elle yazılan çocuk sayısı, gün, iklim), stok öğesi, pil tasarrufu, yazı boyutu, radyo il seçimi
- [x] Pil tasarrufu anahtarı Pil, Ayarlar ve Paylaşım arasında senkron; `body.saver` sınıfı uygulanıyor
- [x] Paketler: katalog grupları ("Sesli soru" / `ses` dahil), satır sayısı = katalogdaki paket sayısı
- [x] Dosyadan içe aktarma: .geojson + .tar başarılı, .txt için hata mesajı; .tar "Sesli soru" grubunda görünüyor
- [x] Silme: satır içi onay, Vazgeç / Evet
- [x] İndirme (Node sunucusu, yavaşlatılmış uzak köken): başlat → ilerleme → duraklat → sayfa yenile → duraklatılmış → devam (Range isteğiyle) → iptal (.part siliniyor) → tekrar indir → SHA-256 doğrulandı → sil
- [x] Bilgi noktası: tarayıcıda "kapalı" ve anahtar devre dışı; Android taklidinde başlat, adres, bağlı cihaz sayısı, QR, paket klasörü ipucu, durdur, APK paylaşımı
- [x] İnternetsiz yay panelleri, lisanslar
- [x] Ayarlar: 4 yazı boyutu; en büyük boyutta 6 sekme ve 10 araçta sayfa taşması yok; yüksek kontrast, hareketi azalt, düşük güç (siyah zemin ve pil tasarrufu), pil tasarrufu kapatılınca düşük gücün de kapanması; sıfırlamada Vazgeç, Evet (ayarlar silindi, paketler korundu, uygulama yeniden başladı)
- [x] Çocuk köşesi: masal (büyüt, sesli oku, durdur), hafıza (seviye, hamle, yeniden), boyama (doldur, fırça, geri al, temizle onayı), nefes, bilgi yarışması sonuna kadar
- [x] Cümle sözlüğü: Arapça ve Farsça `dir=rtl`, İngilizce LTR, büyük gösterim tam ekran (en büyük yazıda da), RTL, kapat, boş arama
- [x] Radyo: 13 ilin hepsinde Radyo 1 ve Haber satırı var, frekanslar 87,5–108 MHz içinde, tablo 360 px'e sığıyor, Ankara 93.3, kaynak satırı
- [x] Mevcut e2e betikleri: kaynak-check, eglence-check, ayarlar-check, download-check, native-infopoint-check

## Bulunan ve düzeltilen hatalar
1. **Dokunma hedefleri.** `sh-switch` (30 px) ve `pil-saver-switch`/`.kn-toggle` (32 px): düğme 56×44 px oldu, görünen ray `::before` ile çiziliyor. `pack-download` ve paket düğmeleri 36 px → 44×44 px; `.sh-pack-bottom` taşarsa alt satıra geçiyor. `hesap-*` sayı kutuları 24 px → 44 px. Lisans özeti 28 px → 44 px. "Adresi kopyala" 44 px'lik `.btn` oldu.
2. **`.input` kenar kontrastı 1,59:1.** Yeni `--line-input: #626d7d` değişkeni eklendi (kart zemininde 3,3:1, arka planda 3,7:1); yüksek kontrastta beyaz. `.input` ve `.kn-select` bunu kullanıyor (src/styles/app.css, kapsam dışı ama tek değişkenlik düzeltme).
3. **Paket silmede engelleyici `confirm()` vardı.** Yerine satır içi onay geldi (`pack-delete-q/-yes/-no`).
4. **Ses paketleri (.tar) dosyadan içe aktarılamıyordu.** `accept` listesinde .tar yoktu; eklendi, paylaşım metni de güncellendi.
5. **Paketler ve paylaşım aracında iç içe çift `.pad` vardı** (kenar boşluğu iki kat) ve araç başlığı gizliydi. Düzeltildi (`.sh-root`).
6. **Lisans listesi katalogla uyumsuzdu.** Var olmayan "Qwen2.5 3B, Qwen Research License" kaldırıldı. Qwen3.5, Gemma 4, Whisper, Transformers.js, fzstd/xz-decompress ve Capacitor eklendi; lisanslar node_modules ve katalogdan doğrulandı.
7. **Pil:** şarjdayken %100'de "Şarj süresi bilinmiyor" yazıyordu; artık "Dolu" yazıyor.
8. **Pil tasarrufu açıklamaları üç yerde çelişiyordu** ("Fener kapanır" / "yalnızca animasyonlar"). Gerçek davranışa göre birleştirildi: Fener modeli ve animasyonlar kapanır, harita daha az çizer.
9. **Ayarlar kartının açıklamasında "model" vardı**, ama araçta model ayarı yok. "depolama" olarak değiştirildi (registry.ts).
10. **Android bilgi noktasında "Bilgisayarda: Wi-Fi paylaşımını açın" adımı gösteriliyordu.** Telefonda artık gizli.
11. **Test betikleri:**
    - ayarlar-check, SVG iç şekillerini taşma sayıyordu (`?guide=kanama`'da yanlış alarm); SVG alt öğeleri atlanıyor.
    - download-check eski `nav-paylas` sekmesini arıyordu; araç yolu ve satır içi onay için güncellendi.

## Kalan sorunlar
- Paylaşılan geliştirme sunucusunda başka ajanların yarım düzenlemeleri (FenerTab, OfflineTools) zaman zaman modül hatası veriyor ve HMR tam yeniden yükleme yapıyor. Bu yüzden qa-araclar en güvenilir biçimde derlenmiş `dist` üzerinde, server.mjs ile çalışıyor.
- kaynak-check `/src` modüllerini içe aktarıyor, bu yüzden yalnız geliştirme sunucusunda çalışır.
- Radyo frekansları bu turda yeniden web'den doğrulanamadı (arama kotası doldu). Kod yorumundaki TRT kaynağına güveniliyor.
- Büyük gösterimdeki "Sesli oku" düğmesi yalnız o dilde ses varsa görünüyor (beklenen davranış).

## E2E
```
npx vite build --outDir /tmp/qa-dist && node -e "import('./server/server.mjs').then(m=>m.startServer({port:5473,host:'127.0.0.1',data:'/tmp/qa-data',dist:'/tmp/qa-dist'}))" &
node e2e/qa-araclar.mjs http://127.0.0.1:5473/ /tmp/qa-araclar      # 224 denetim, TÜMÜ OK
node e2e/qa-araclar.mjs http://localhost:5199/                       # geliştirme sunucusunda da çalışır
node e2e/kaynak-check.mjs http://localhost:5199/
node e2e/eglence-check.mjs http://localhost:5199/
node e2e/ayarlar-check.mjs http://localhost:5199/
node e2e/download-check.mjs --dist <dist klasörü>
```
`npx tsc --noEmit` temiz, `npx vitest run` 1273/1273.

## Denetim 2026-11

Kapsam: Araçlar sekmesindeki tüm araçlar (enkaz ve enkaz arama İletişim raporunda), Ayarlar ve güncelleme bölümü, güncelleme bandı (src/Guncelleme.tsx), Paketler ve paylaşım. 360×640, 390×844, 1280×800, Android "büyük yazı" (×1,3) ve güvenli alanla bakıldı; Android eklentileri, pusula sensörü (iOS `requestPermission` izin/ret, sensör yok, Android `deviceorientationabsolute`), konum ve hava paketi (dosyadan içe aktarma) taklit edildi.

### Denetlenenler
- [x] Her araç: boş, hata ve başarı durumları; konsol hatası; yatay taşma; 44 px hedefler; sol/sağ boşluk eşitliği (`.pad` çocukları ölçüldü, fark yok)
- [x] Giriş doğrulama: eksi, çok büyük, boş sayı (hesap, stok)
- [x] Kalıcılık: tüm ayarlar (yazı boyutu, kontrast, hareket, düşük güç, pil tasarrufu), hesap, stok, çanta, radyo ili, hava ili
- [x] Güncelleme: denetle / indir / kur; **kurulum yalnız "Kur" düğmesiyle**: Java'da `Guncelleyici.kur` yalnız `GuncellemePlugin.kur`dan, o da yalnız `GuncellemeKarti`ndaki düğmeden çağrılıyor. Açılış, görünürlük değişimi, ayar değişimi, elle denetleme ve "İndir" kurmuyor (guncelleme-check'e eklendi)
- [x] Pusula: izin iste / reddedildi / sensör yok / çalışıyor
- [x] Hava: paket yok, paket var (aylar, normaller, kaynaklar; `javascript:` bağlantısı bağlantı olarak çizilmiyor)
- [x] Paylaş: bilgi noktası (tarayıcı + Android taklidi), QR, APK paylaşımı, lisanslar

### Düzeltilenler
1. **Hesap: sınır dışı sayı yazınca kutu yanlış değeri gösteriyordu.** 100 yetişkin varken 5000 yazılınca durum değişmediği için kutu "5000" kalıyor, hesap 100 ile yapılıyordu; 0 gün yazınca kutu 0, hesap 1 gündü; eksi sayı da kutuda kalıyordu. Kutu artık hesaplanan değeri gösteriyor, gün en az 1 (azalt düğmesi 1'de pasif). (hesap/index.tsx)
2. **Stok: doğrulama eksikti.** Boş miktar 0 olarak kaydediliyordu; 99999999999 gibi değerler kabul ediliyordu; eksi kcal/litre sessizce yok sayılıp "hesaba katılamadı" görünüyordu. Hepsi açık hata mesajıyla reddediliyor (üst sınır 1.000.000). (stok/index.tsx)
3. **Güncelleme: "Kur"a çift dokunuş iki kurulum çağrısı yapıyordu** (durum "kuruluyor"a geçene kadar). Basılınca düğme kilitleniyor. Kurulum kuralı değişmedi. (Guncelleme.tsx)
4. **Ayarlar: sıfırlama açıklaması eksikti.** `localStorage.clear()` yakınları, adı, enkaz bina bilgisini, gönderilmemiş pano kayıtlarını ve yer işaretlerini de siliyor; metin bunu söylüyor. (ayarlar/index.tsx)
5. **Lisanslar eksikti:** arayüz yazı tipi Poppins, harita yazı tipi Noto Sans (OFL-1.1) ve PDF.js (Apache-2.0) listede yoktu; node_modules'tan doğrulanıp eklendi. (PaylasTab.tsx)
6. **Pusula:** paragrafların varsayılan kenar boşlukları flex boşluğuna ekleniyor, "sensör yok" kartında ve hedef bölümünde düzensiz boşluk oluşuyordu. (pusula/index.tsx)
7. **Hava:** il seçim kutusunun kenarı düşük kontrastlı `--line3` idi; diğer giriş alanları gibi `--line-input`. (hava/index.tsx)
8. Ortak grup başlığı (`.kn-group > h2`) yanındaki düğmeyle dikeyde hizasızdı. (_kaynak/ui.ts)
9. Yazım: "karbonmonoksit" → "karbon monoksit" (pil, radyo).
10. **Hesap, stok ve çanta değişiklikleri çizimden sonra (useEffect) kaydediliyordu**; değiştirip hemen başka ekrana geçince ya da uygulama kapanınca son değişiklik kaybolabiliyordu (qa-araclar'da "kalıcı: hesap çocuk" bir kez bu yüzden düştü). Artık değişiklik anında kaydediliyor. (hesap, stok, canta)
11. Test kararlılığı: kaynak-check'teki `body.saver` denetimi, sınıf çizimden sonra eklendiği için yük altında yanlış hata veriyordu; bekleme eklendi.

### Kalanlar
- ~~Radyo yalnız 13 il içeriyor~~ → Öneriler 2026-11'de 81 ile tamamlandı (aşağıya bakın).
- Android "büyük yazı"da alt gezinme çubuğunda "Kütüphane" ve "Araçlar" etiketleri birbirine değiyor (src/styles/app.css, kapsam dışı).
- qa-araclar'ın indirme bölümü (iptalden sonra yeniden indirme) tam çalıştırmada bir kez zaman aşımına uğradı; tek başına çalıştırınca geçiyor. İndirme kodu kapsam dışı (src/lib).
- Pusula gülünde kuzey kırmızı (pusula geleneği); bilerek bırakıldı.

### E2E
```
node e2e/qa-araclar.mjs http://localhost:5199/   # 239 denetim, tümü OK; "9) Denetim 2026-11": giriş doğrulama, ayar kalıcılığı
node e2e/guncelleme-check.mjs                    # 10 adım (2'si yeni)
node e2e/ayarlar-check.mjs ; node e2e/kaynak-check.mjs ; node e2e/eglence-check.mjs ; node e2e/sunucu-indirme-check.mjs
```

## Öneriler 2026-11: Radyo, 81 il

- `src/tools/radyo/frekanslar.ts` 13 ilden 81 ile çıktı. Kaynak: TRT'nin kendi frekans sayfaları
  (`radyo.trt.net.tr/frekanslar/<il>-<ilçe>`), her il sayfası 7 Kasım 2026'da tek tek okundu; slug'lar
  kod yorumlarında. Van sayfası yeniden okunup eski kayıtla karşılaştırıldı (aynı). Hiçbir frekans tahmin edilmedi.
- İl seçici Türkçe alfabe sırasında; seçim davranışı ve `akil.radyo.city` anahtarı aynı (eski seçimler geçerli).
- Radyo 1 ve Radyo Haber satırı her ilde görünür; TRT sayfasında yoksa "doğrulanmadı · tarama yapın" yazar.
  Eksik ya da merkez dışı kayıtlarda kehribar kenarlı kısa not (`rd-note`) çıkar. Kaynak satırı: "erişim 1 ve 7 Kasım 2026".
- **Boşluklar (TRT sayfasında il merkezi kaydı yok):**
  - Hiç kayıt yok → boş, "doğrulanmadı": Bayburt, Kayseri, Kilis, Kırklareli, Tunceli, Yalova.
  - Komşu/merkez dışı ilçe vericisi gösteriliyor (notla): Adıyaman/Kâhta, Ağrı/Tutak, Batman/Beşiri, Siirt/Aydınlar, Şırnak/Cizre.
  - Merkez ilçe (merkez sayılır): Adana/Yüreğir, Gaziantep/Şehitkamil, Konya/Meram.
  - Merkezde yalnız TRT FM: Balıkesir, Burdur, Giresun. Yalnız TRT Nağme: Sakarya.
  - Radyo Haber yok (Radyo 1 var): Adıyaman, Ağrı, Bartın, Bilecik, Çanakkale, Edirne, Gümüşhane, Hatay (İskenderun'da 93.0, notta), Iğdır, Kocaeli, Muğla, Sinop, Tekirdağ, Uşak, Zonguldak.
  - Çelişki: Ardahan sayfasında Radyo Haber ve TRT Kurdî ikisi de 99.3; aynen aktarıldı, notla uyarılıyor.
- Test: `tests/eglence.test.ts` (81 il, benzersiz, FM bandı, eksik kayıtta not zorunlu, örnek değerler);
  `e2e/qa-araclar.mjs` 8. bölüm (81 seçenek, alfabe sırası, her ilde satırlar, Kayseri "doğrulanmadı", büyük yazıda taşma yok).
  Sonuç: radyo bölümü 13/13 OK; `eglence-check` TÜMÜ OK.
- Not: qa-araclar'ın 1–7. bölümleri geliştirme sunucusunda çevrimiçi katalog isteği (`ERR_TUNNEL_CONNECTION_FAILED`)
  ve indirme zaman aşımı yüzünden düşebiliyor (kapsam dışı; derlenmiş `dist` + server.mjs ile çalıştırın).

