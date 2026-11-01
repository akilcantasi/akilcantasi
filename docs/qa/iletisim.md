# QA: İletişim sekmesi

Kapsam: src/tabs/IletisimTab.tsx, src/iletisim/*, src/lib/mesh.ts, src/lib/mesh/*, server/server.mjs ve InfoPointServer.java içindeki pano bölümleri.

## Test edilenler
- [x] Tüm bölümler (`?comm=pano, iyiyim, kayip, duyuru, sos, mors, sms, baglan`) ve ana sayfa
- [x] Bilgi noktası var: Node sunucusu geçici veri klasöründe, iki tarayıcı bağlamı (A yazar, B görür; otomatik yenileme)
- [x] Profildeki "bilgi noktası adresi" ile farklı kökenden bağlanma (CORS)
- [x] Bilgi noktası yok: "bağlı değilsiniz" kartı, açıklamalar, giden kutusu, sayaç, boş durumlar
- [x] Oturum ortasında sunucu kapanır: kayıt giden kutusunda kalır, önbellekteki pano görünür, sayfa yenilense de bekler; sunucu aynı portta geri gelince kayıt gider, board.json yeniden yüklenir
- [x] Hız sınırı (429 + Retry-After): kullanıcıya açık mesaj, kayıt "gönderilmeyi bekliyor"
- [x] Uzun metin (600 karakter sınırı) ve Türkçe karakterler (Ç Ğ İ ı Ö Ş Ü) bozulmadan gidip geliyor; 360 px'te taşma yok
- [x] HTML düz metin olarak gösteriliyor; fazla boş satırlar sıkıştırılıyor
- [x] Kayıp → bulundu: onay/vazgeç, süzgeçler, ilan sahibinin adı korunuyor, sunucu bulundu → aranıyor geri dönüşünü reddediyor
- [x] Çevrimdışı kayıp ilanını bulundu işaretleme (giden kutusunda tek kayıt)
- [x] Taklit mesh eklentisi (iki telefon): ilan bilgi noktası olmadan ulaşıyor, "yakın cihazdan" etiketi, komşu sayısı, "bulundu" mesh'te yayılıyor, mesh kaydı sonra bilgi noktasına aktarılıyor
- [x] SOS: beyaz/kırmızı ekran yanıp sönüyor, bip sesi, Esc / dokunma / Durdur ile kapanma, sürekli ışık
- [x] Düdük (üç kısa ses, ~3 kHz), siren, bölümden çıkınca ses durması (taklit AudioContext)
- [x] Mors: Türkçe harf sadeleştirme, bilinmeyen karakter, metin↔Mors, ışık/ses oynatma, tam ekran
- [x] SMS: konumlu şablonlar, konum izni yok hatası, elle düzenleme, kopyalama, numara temizleme, 112 notu, iOS `&body=` biçimi
- [x] Android taklidi: fener SOS/sürekli/Mors ile yanıp sönüyor, flaş yoksa uyarı, seçenek kapalıyken yanmıyor, erişim noktası ayarları
- [x] Kalıcılık (profil, önbellek, giden kutusu) yeniden yüklemede
- [x] Yerleşim 360×640, 390×844, 1280×800: yatay taşma yok, dokunma hedefleri ≥ 44 px
- [x] Konsol hatası yok; `e2e/iletisim-check.mjs` ve `e2e/mesh-check.mjs` geçiyor

## Bulunan ve düzeltilen hatalar
1. **Mors: `·` / `−` / `|` ile yazılan kod oynatılmıyordu.** Çeviri doğruydu ama `morseToSteps` yalnızca `.` `-` `/` tanıyordu; ışık/ses düğmeleri hiçbir şey yapmıyordu. (morse.ts)
2. **Reddedilen kayıt "Gönderildi" diyordu.** Sunucu 4xx ile reddettiğinde kayıt giden kutusundan atılıyor ama kullanıcı başarı görüyordu. Artık hata mesajı gösteriliyor. (outbox.ts, client.ts)
3. **Hız sınırı / ağ kopması sessizdi.** Sonuç yalnızca "bağlanınca gönderilecek" diyordu, oysa bağlıydı. Artık nedeni yazıyor ("Çok sık gönderim…", "Bağlantı yok") ve hemen yeniden deneme planlanıyor. (client.ts, BoardSections.tsx)
4. **Mesh'te "bulundu" hiç yayılmıyordu.** Mesh kimliğe göre tekilleştirdiği için aynı kimlikli güncelleme atılıyordu; alıcı da bilinen kimlikleri yok sayıyordu. Güncelleme `_bulundu` ekli kimlikle gidiyor, alıcı asıl ilana bağlıyor; ilan sahibinin giden kutusundaki kopya da güncelleniyor. (board.ts, client.ts)
5. **Bulundu işaretleyenin adı ilanın sahibinin adının yerine geçiyordu** (çevrimdışı ve mesh yolunda). Artık ilan sahibinin adı korunuyor. (BoardSections.tsx)
6. **Mesh komşu sayısı geç güncelleniyordu** (15 sn'lik yoklamayı bekliyordu). Artık `onPeers` ile hemen güncelleniyor. (client.ts)
7. **SMS: şablon değişince elle düzenlenen metin bir kare boyunca kalıyordu** (useEffect ile sıfırlama). Düzenleme artık üretilen metne bağlı, eşzamanlı düşüyor. (OfflineTools.tsx)

Birim testleri tests/iletisim.test.ts dosyasına eklendi ("QA düzeltmeleri").

## Kalan konular
- InfoPointServer.java derlenip çalıştırılmadı (bu ortamda Android yok). Kod okundu: pano kuralları Node sunucusuyla aynı. Mesh "bulundu" düzeltmesi yalnızca istemcide.
- Mesh'le gelen "bulundu" kaydı bilgi noktasına ilk kez aktarılırsa sunucu onu doğrudan "bulundu" durumunda oluşturuyor. Bu beklenen davranış.
- Gerçek ses/flaş/tam ekran yalnızca taklitlerle denendi; cihazda elle denenmeli.
- Paylaşılan makinede yük yüksek olduğu için e2e zaman aşımları cömert tutuldu.

## E2E komutu
```
node e2e/qa-iletisim.mjs http://localhost:5199/ /tmp/qa-iletisim
node e2e/iletisim-check.mjs
node e2e/mesh-check.mjs
```
