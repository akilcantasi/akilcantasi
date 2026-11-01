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
