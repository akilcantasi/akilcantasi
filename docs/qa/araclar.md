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
