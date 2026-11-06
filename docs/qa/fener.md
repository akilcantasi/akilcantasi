# QA: Fener (çevrimdışı asistan)

Kapsam: src/tabs/FenerTab.tsx, src/tabs/fener.css, src/lib/fener/*, src/lib/voice/*, docs/FENER_MODELLER.md

## Test edilenler
- [x] Model yok → "Model yok — rehber modu", rehberden cevap, "Model yüklü değil — rehberden yanıt" etiketi
- [x] Pil tasarrufu → rehber modu, etiket, panel notu; kapatınca model moduna dönüş
- [x] Model seçici: liste, Otomatik, elle seçim, yenilemeden sonra kalıcılık; parçalı model tek seçenek ("2 parça");
      eksik parçalı model kapalı ("2/3 parça var — eksik: 2"); belleğe ağır model; 2 GB üstü tek dosya ("bölünmeli"); mmproj gizli
- [x] Model paketi yok paneli → "Model paketi ekle" Araçlar'ı açıyor
- [x] Yüklenemeyen model → "Model çalışmadı — rehberden yanıt" + Türkçe hata
- [x] Hızlı sorular, yazılı sorular, eşleşme yok iletisi + "Rehberlere göz at"
- [x] 112 kutusu (tel:112, "Rehberi aç: …"), model ve rehber modunda
- [x] Kaynak etiketleri: Rehber → doğru rehber, WikiMed → doğru makale (Bleeding), Vikipedi, Bağlam
- [x] Büyük rehber düğmesi ("Rehberin tamamı" / "Doğrulanmış adımlar")
- [x] "Fener kendi bilgisiyle cevaplasın": aynı soru, kaynaksız, etiketli, düğme tekrar çıkmıyor
- [x] Durdur ("(durduruldu)"), durdurmadan sonra yeni soru; Yeni sohbet (boşken ve üretim sırasında)
- [x] pendingQuestion: Kütüphane "Fener'e sor" (bağlamla), Harita sekmesinden, Fener meşgulken (sıraya alınıyor)
- [x] Sesli sor (sahte mikrofon/STT): kayıt + süre, yükleniyor/yazıya çevriliyor, mevcut metne ekleme, iptal,
      çok kısa kayıt, çeviri hatası (role=alert), "[Müzik]" → anlaşılamadı, izin reddi, ses paketi yok + "Paket ekle",
      sekme değişince kayıt iptali
- [x] Sesli oku (sahte speechSynthesis): tr-TR ses, kaynak numaraları okunmuyor, Durdur, kendiliğinden bitiş,
      yeni soru / Yeni sohbet okumayı durduruyor, speechSynthesis yoksa düğme yok
- [x] Düzen 360×640, 390×844, 1280×800: yatay taşma yok (uzun sözcük/URL), 7 uzun cevaplı sohbet, giriş görünür,
      model paneli Kapat görünür, dokunma alanları ≥44px, konsol hatası yok
- [x] Gerçek model (qwen2.5-0.5b, sunucu 8199): e2e/fener-real-check.mjs

## Bulunan ve düzeltilen hatalar
1. Dokunma alanları 44px altındaydı: "Yeni sohbet" (36), "112'yi ara" ve "Rehberi aç" (40), kaynak etiketleri (32),
   "Rehberlere göz at" (32), "kendi bilgisiyle" (40) → 44px (fener.css).
2. Uzun rehber cevabında liste en alta kayıyordu; 112 kutusu ve ilk adımlar ekran dışında kalıyordu.
   Rehber cevabında ya da hayati durumda artık sorunun başına kaydırılıyor (FenerTab.tsx).
3. Kütüphane'den "Fener'e sor" ("… hakkında kısaca bilgi verir misin?") kalıp sözcükleri yüzünden
   "Çocukla afet hakkında konuşmak" rehberini getiriyordu (Hipotermi sorusunda bile ilk sıradaydı).
   Aramadan soru kalıbı sözcükleri çıkarılıyor: `searchQuery` (rag.ts) + birim testleri (tests/fener.test.ts).
4. "Yeni sohbet" sesli okumayı durdurmuyordu → düzeltildi.
5. Sesli okumada kaynak numarası silinince noktadan önce boşluk kalıyordu ("arayın ."). tts.ts düzeltildi;
   eski hatalı beklentiyi içeren tests/voice.test.ts bir satır güncellendi.
6. Akış sırasında her token tüm baloncukları yeniden çiziyordu; uzun sohbette cevap süresi 8 sn → 22 sn'ye çıkıyordu.
   BotBubble `memo` ile sarıldı; süre artık sabit.

## Kalan sorunlar / notlar
- Ortak dev sunucusu (5199) başka ajanların düzenlemeleri sırasında HMR'de bayat modül hatası veriyordu
  ("does not provide an export named …"); kodla ilgili değil, yeniden başlatınca düzelir. Testler 5431'de koşuldu.
- Harita'dan gelen "… noktasına giderken nelere dikkat etmeliyim?" sorusu zayıf eşleşmeyle "Toplanma alanı" rehberini
  getirebiliyor; kabul edilebilir, ama ileride konum türüne göre bağlam iyileştirilebilir.
- Gerçek model kontrolü geçti (TÜMÜ OK), ama bu makinede kaynaklı ilk cevap 692 sn sürdü (yükleme dahil, işlemci).
  0,5B modelin "kendi bilgisi" cevabı anlamsızdı ("…zehirlenmeyi ve zehirlenme yapmam."): model kalitesi sınırı, kod hatası değil.
- Model paneli açıkken liste daralıyor; 360×640'ta panel ekranın çoğunu kaplıyor (Kapat görünür, sorun değil).

## E2E komutu
    node e2e/qa-fener.mjs http://localhost:5199/ /tmp        # tümü (~6 dk); ONLY=guide,model,battery,nomodel,nav,voice,tts,layout
Gerçek model: `npm run build && node server/server.mjs --data /home/claude/packs --port 8199 &` sonra
`node e2e/fener-real-check.mjs http://localhost:8199/ /tmp`

## Denetim 2026-11

Kapsam: `src/tabs/FenerTab.tsx`, `src/tabs/FenerModels.tsx`, `src/tabs/fener.css`, `src/lib/fener/*`, `src/lib/voice/*`.
360×640, 390×844, 1280×800, en büyük yazı boyutu (Ayarlar → "En büyük", zoom 1,4) ve klavye açılmış
(görünüm yüksekliği 480 px) hâlleri denendi; ekran görüntülerine tek tek bakıldı.

### Denetlenenler
- [x] Sohbet akışı, hızlı sorular, uzun cevap, çok mesaj, Durdur (yazarken / model yüklenirken), Yeni sohbet
- [x] Model seçici: liste, Otomatik, elle seçim + yenilemede kalıcılık, katalogdan indirme satırları, model yokken panel
- [x] Kaynak etiketleri: Rehber → doğru rehber, WikiMed → doğru makale; büyük rehber düğmesi; 112 kutusu
- [x] Sesli sor / sesli oku durumları (sahte mikrofon/STT/konuşma sentezi; gerçek ONNX işçi yolu)
- [x] Gerçek wllama + küçük test modeli (`e2e/fener-check.mjs`), sahte yerel motor (`e2e/fener-yerel-check.mjs`)
- [x] Konuşma sekme değişiminde korunur; sayfa yenilenince silinir (bilerek: modül düzeyinde tutuluyor, cihazda saklanmıyor)
- [x] Yan boşluklar, hizalama, 44 px dokunma alanları, taşma, renkler (kırmızı yalnız 112 kutusu ve hata metni)

### Bulunan ve düzeltilen hatalar
1. **Model yüklenirken "Durdur" çalışmıyordu** (hata): yükleme (büyük modelde dakikalar) bitene kadar düğme
   bekliyor, sonra cevap yanlış etiketle ("Model yüklü değil — rehberden yanıt") geliyordu. Artık durdurma hemen
   etkili; rehberden yanıt "Durduruldu — rehberden yanıt" etiketiyle gelir, yükleme arkada sürer ve model bir
   sonraki soruya hazır olur (`FenerTab.tsx` `send`, `fallback.ts` `stopped`).
2. **Akış sırasında yukarı kaydıran kullanıcı her token'da en alta çekiliyordu** (hata): liste artık yalnız
   kullanıcı en alttaysa takip eder; yeni soru gönderilince yine en alta iner.
3. **Klavye açılınca son mesaj klavyenin altında kalıyordu** (hata): liste kısalınca en alttaysa en altta kalır
   (ResizeObserver; yükseklik değişiminin ürettiği scroll olayı "kullanıcı kaydırdı" sayılmaz).
4. **Model paneli küçük ekranda girişi ekranın dışına itiyordu** (tasarım): 70vh sabit yükseklik + sohbetten bir şerit.
   Panel artık çubukla giriş arasındaki yeri alır, kendi içinde kayar; açıkken sohbet gizlenir, soru gönderilince
   panel kapanır. Panel içindeki "Otomatik seç" kutusu büzülüp yazısı kenarlığa taşıyordu (`flex-shrink`).
5. **Kopyala yoktu** (eksik): cevap altında "Kopyala" — biçim işaretleri atılır, madde işaretleri kalır, kaynaklar
   `[1] Rehber: …` olarak eklenir; http bilgi noktasında eski yönteme düşer (`format.ts` `copyText` + birim testi).
6. **Yan boşluklar eşit değildi** (tasarım): liste/çubuk 18 px, giriş satırı 14 px, model paneli 12 px; büyük yazıda
   hepsi 25 px'e çıkıyordu. Hepsi `--pad-x` (her boyutta ekranda 18 px).
7. **Dar ekranda / büyük yazıda model adı okunmuyordu** ("Etkin …"): ad iki satıra kadar kırılır, yer kalmazsa
   "Yeni sohbet" alt satıra iner; aç/kapa oku artık kırpılmıyor.
8. **Cevap altı düğmeleri dağınık kırılıyordu**: "Kopyala" + "Sesli oku" birlikte sağa yaslı; token/sn yapay zekâ
   uyarısının yanına alındı.
9. **Kırmızı yalnız tehlike için** (tasarım): kayıt düğmesi ve "Durdur" kırmızıydı → kehribar.
10. Yazım: hızlı soru "içilebilir hale" → "hâle" (rehberlerle aynı).
11. `e2e/fener-check.mjs` artık var olmayan `/__dev/tiny-test.gguf` adresini kullanıyordu → `/testdata/tiny-test.gguf`.

### Kalan / not
- Ortak dev sunucusunda (5199) başka ajanların düzenlemeleri HMR ile sayfayı yeniliyor; `qa-fener.mjs` bu yüzden
  ara sıra yarıda kesiliyordu (konuşma kayboluyor). HMR'siz ayrı bir sunucuda koşun (aşağıda).
- Kütüphane'den "Fener'e sor" ile gelen "Bağlam" etiketi tıklanamıyor: bağlamda makale yolu yok
  (`store.ts` `pendingQuestion.context` tipine `path` eklenmeli; kapsam dışı).
- Konuşma yenilemede siliniyor (bilinçli). Android süreci arka planda öldürülürse de silinir; istenirse sessionStorage.

### E2E
    # HMR'siz ayrı dev sunucusu (başka ajanların düzenlemeleri sayfayı yenilemesin):
    #   vite.config'i içe aktarıp server.hmr=false, watch.ignored=['**/*'] veren bir yapılandırmayla
    #   npx vite --config <o-dosya> --port 5431 --strictPort --host 127.0.0.1
    node e2e/qa-fener.mjs http://localhost:5431/ /tmp     # tümü; ONLY=…,denetim (yeni bölüm)
    node e2e/fener-check.mjs http://localhost:5431/ /tmp  # gerçek wllama + küçük test modeli
    node e2e/fener-voice-check.mjs http://localhost:5431/ /tmp
    node e2e/fener-yerel-check.mjs http://localhost:8099/ # derlenmiş uygulama
