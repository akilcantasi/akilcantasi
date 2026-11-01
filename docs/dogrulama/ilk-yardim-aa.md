# Doğrulama raporu: ilk-yardim-aa

Tarih: 2026-11-01
Rehberler: ilk-yardim-ilk-degerlendirme, kanama, temel-yasam-destegi, ilk-yardim-cocuk-kpr, ilk-yardim-bebek-kpr, ilk-yardim-oed, derlenme-pozisyonu

## ÖNEMLİ: Web doğrulaması YAPILAMADI

Bu oturumda ortak web arama kotası (tur başına 200 arama, tüm ajanlarla paylaşılan) daha ilk aramada dolmuştu. WebFetch yalnızca konuşmada daha önce geçen adreslere izin verdiği için resmi kaynaklara da erişilemedi. Talimat "bellekten doğrulama yapmayın" dediği için:

- Metinlerde HİÇBİR olgusal değişiklik yapılmadı.
- `checked` alanları DEĞİŞTİRİLMEDİ ("Bağımsız doğrulama" yazmak yanıltıcı olurdu). Mevcut notlar önceki ajana aittir.
- Bu yedi rehberin kaynak karşılaştırmasıyla bağımsız doğrulaması yeni bir turda yeniden yapılmalıdır.

Yapılanlar: metin ve yapı incelemesi (adım sayısı, tek eylem, emir kipi, iç tutarlılık), tüm adım resimlerinin kontrolü (`e2e/guide-shot.mjs`), `npx vitest run tests/guides.test.ts` (191/191 geçti).

## Metin incelemesi (kaynaksız, yalnızca iç tutarlılık)

Yedi rehberin hepsinde 9–10 adım var. Art dizilerinin uzunluğu adımlarla aynı. Dil sade, emir kipinde. İç çelişki ya da açıkça tehlikeli bir ifade görmedim. Aşağıdaki maddeler bir sonraki doğrulamada ERC/AHA 2025 metinleriyle mutlaka karşılaştırılmalı:

### ilk-yardim-ilk-degerlendirme
- Sıra: güvenlik → yanıt → hayati kanama → 112 → hava yolu/nefes. Kanamanın 112'den önce gelmesi ERC 2025 İlk Yardım ile uyumlu mu, teyit edilmeli.
- Adım 2 ve 7 uzun; bölmek gerekmiyor ama adım 7 iki eylem içeriyor (yan yatırma + travmada kıpırdatmama).

### kanama
- Teyit edilecek: turnikenin "5–7 cm üstü" ölçüsü (ERC 2025'te yalnızca "yaranın üstüne, mümkün olduğunca yakın" yazıyor olabilir); hemostatik pansuman konusunun eksik olup olmadığı; doğaçlama turnike konusundaki güncel öneri.
- Adım 4 (kasık/koltuk altında yarayı doldurma) eğitimsiz kişi için uygun mu, ERC 2025 İlk Yardım'la karşılaştırılmalı.

### temel-yasam-destegi
- Teyit edilecek: 112'nin nefes kontrolünden önce arandığı sıra (adım 2 → 3). ERC 2025 algoritmasında 112 genelde "yanıt yok ve normal nefes yok" saptandıktan sonra aranıyor. Pratikte zararlı değil ama algoritmayla karşılaştırılmalı.
- 5–6 cm, 100–120/dk, 30:2, ≤10 sn değerleri bildiğim kılavuzlarla tutarlı görünüyor; kaynakla teyit edilmeli.

### ilk-yardim-cocuk-kpr
- Teyit edilecek: eğitimsiz kişi için 30:2, çocuk eğitimi alan için 15:2 ayrımı ERC 2025'te aynen böyle mi; "telefon yoksa önce 1 dakika canlandırma" ifadesi; "8 yaş / 25 kg" eşiği.

### ilk-yardim-bebek-kpr
- Teyit edilecek: iki başparmakla göğsü sarma tekniğinin tek kurtarıcı için de birinci tercih olması (AHA 2025'te iki parmak tekniği kaldırıldı mı); ~4 cm derinlik; bebekte ön-arka ped yerleşimi.

### ilk-yardim-oed
- Teyit edilecek: yetişkin ped yerleri; kalp pili notu; ıslak zemin uyarısı.
- Adım 10 çocuk/bebek ped bilgisini tekrarlıyor; içerik olarak tutarlı.

### derlenme-pozisyonu
- Teyit edilecek: ERC 2025'te uzun süre (ör. 30 dk) aynı yanda kalınca diğer yana çevirme önerisi hâlâ var mı; varsa eklenmeli.
- "Yapmayın" 4. madde anlamca biraz dolambaçlı ("nefes yolunu korumak için gerekmedikçe döndürmeyin"); anlam doğru.

## Resim sorunları (resimler düzenlenmedi, hiçbir art null yapılmadı)

| Rehber | Adım | Art id | Sorun | Olması gereken |
|---|---|---|---|---|
| temel-yasam-destegi | 6 | ilk-yardim-kpr-el-yeri | El ve onay işareti çok aşağıda, göğüs kemiği ucuna/kaburga kenarına yakın görünüyor; yalnızca tek el ve yana açılmış parmaklar seçiliyor, kenetlenmiş iki el net değil. | El topuğu göğüs kemiğinin alt yarısında, meme uçları hizasında; ikinci el üstte, parmaklar kenetli ve göğüsten kalkık. Onay işareti göğüs kemiği ucunun (ksifoid) ÜSTÜNDE olmalı. Öncelikli. |
| temel-yasam-destegi / ilk-yardim-ilk-degerlendirme / ilk-yardim-oed / derlenme-pozisyonu | 7 / 6 / 8 / 9 | cpr-adult | Kurtarıcının kolları bükük, omuzları ellerin tam üstünde değil; kurtarıcı göğsün yanında değil, kalça hizasında diz çökmüş gibi. Adım 7 metni "kollar dümdüz, omuzlar ellerin üstünde" diyor. | Kurtarıcı göğsün yanında diz çökmüş, kollar dik ve düz, omuzlar ellerin tam üstünde. Öncelikli, çünkü dört rehberde kullanılıyor. |
| ilk-yardim-ilk-degerlendirme | 2 | ilk-yardim-omuz-seslen | Kurtarıcının elleri omuzda değil, üst göğüste duruyor. | Elleri iki omuzda, hafifçe sarsarken seslenme. |
| ilk-yardim-bebek-kpr | 8 | ilk-yardim-bebek-kpr-tek-el | "Tek elin topuğu" anlatılıyor ama resimde iki kol/el var; el topuğu yerine düz avuç. | Tek el topuğu göğüs kemiğinin alt yarısında; diğer el bebeğin başında, başı düz tutuyor. |
| ilk-yardim-bebek-kpr | 3 | ilk-yardim-bebek-bas-notr | Metin "başı düz tutup çenesini hafifçe kaldırın" diyor; resimde kurtarıcının parmağı göğüste, çene kaldırma görünmüyor. | Bir el alında, başı nötr; bir parmak çene kemiğinin altında hafifçe kaldırıyor. |
| derlenme-pozisyonu | 8 | watch-breathing | Kişi sırtüstü yatıyor ve örtülü değil; adım derlenme pozisyonundaki kişinin örtülüp izlenmesini anlatıyor. "10 sn" saati de bu adımla ilgisiz (sürekli izleme). | Yan yatmış (derlenme pozisyonunda), üstü örtülü kişi; kurtarıcı yanında nefesini izliyor. |
| ilk-yardim-oed | 2 | ilk-yardim-oed-ac | OED duvara asılı gibi duruyor; metin cihazı kişinin başının yanına koyup açmayı anlatıyor. | Yerde, yatan kişinin başının yanında açılan cihaz. Düşük öncelik. |
| temel-yasam-destegi | 9 | ilk-yardim-oed-ped-yetiskin | Sol ped biraz önde/ortada; koltuk altı çizgisinde (yanda) olmalı. | Sol ped sol koltuk altının altında, orta koltuk altı çizgisinde. Düşük öncelik. |

Sorunsuz bulunanlar: ilk-yardim-olay-yeri-guvenlik, ilk-yardim-kanama-bastir, ilk-yardim-bas-geri-cene, recovery-position, ilk-yardim-kanama-bez-ekle, ilk-yardim-turnike-tak (turnike yaranın gövdeye yakın tarafında, dizden uzakta), ilk-yardim-turnike-saat, ilk-yardim-kanama-sargi, lie-cover-blanket, ilk-yardim-kurtarici-nefes, call-112, ilk-yardim-cocuk-bas-geri, ilk-yardim-cocuk-nefes, ilk-yardim-cocuk-kpr-tek-el, ilk-yardim-oed-ped-cocuk, ilk-yardim-bebek-nefes, ilk-yardim-bebek-kpr-basparmak, ilk-yardim-oed-ped-bebek, ilk-yardim-oed-cekilin, ilk-yardim-oed-sok-dugme, ilk-yardim-derlenme-kol, ilk-yardim-derlenme-el-yanak, ilk-yardim-derlenme-cevir.

## İnsan uzmanı gerekenler
- Yedi rehberin tamamı hâlâ `reviewed: false`. Hayati konular olduğu için ilk yardım eğitmeni/acil tıp uzmanı incelemesi şart.
- Yukarıda "teyit edilecek" diye işaretlenen bütün sayılar ve sıralar kaynakla karşılaştırılmadı.

---

# Tekrar doğrulama (2026-11-01, ikinci tur)

Bu turda kaynaklara WebFetch ile doğrudan erişildi (WebSearch kullanılmadı). Okunan sayfalar:
- RCUK 2025 Paediatric BLS: resus.org.uk/library/2025-resuscitation-guidelines/paediatric-basic-life-support-guidelines
- RCUK 2025 Adult BLS: .../adult-basic-life-support-guidelines
- RCUK 2025 First Aid: .../first-aid-guidelines
- AHA/AAP 2025 Part 6 Pediatric BLS: cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-basic-life-support
- St John Ambulance: sja.org.uk/first-aid-advice/cpr/, /severe-bleeding/, /recovery-position/ (nhs.uk/conditions/first-aid/cpr/ bu adrese yönleniyor)
- Erişilemeyen: RCUK 2025 dizin sayfası (istemci hatası); cpr.heart.org yetişkin BLS sayfası hâlâ 2020 metnini gösteriyor (yetişkin için AHA 2025 karşılaştırması yapılamadı).

## İstenen özel kontroller

| Konu | Rehberdeki ifade | Kaynak | Sonuç |
|---|---|---|---|
| Turnike yeri | Yaranın 5–7 cm üstü, eklem üstüne değil | RCUK 2025 First Aid: "5-7cm above the injury, but not over a joint" | DOĞRU |
| Çocuk oranı | 30:2; çocuk TYD eğitimi alan 15:2 | RCUK 2025 PBLS: "15:2 if you are specifically trained in PBLS", aksi halde 30:2; çağrı merkezi eğitimsize 30:2 + 5 nefes anlatır. AHA 2025: tek kurtarıcı 30:2, iki kurtarıcı 15:2 | DOĞRU |
| Telefonsuz 1 dakika kuralı | Telefon yoksa önce 1 dk canlandırma, sonra yardım | RCUK 2025 PBLS: "A single rescuer without a mobile phone should perform CPR for 1 min before going to seek help." AHA 2025 sayfası bu durumu ele almıyor | DOĞRU (çocuk ve bebek) |
| Bebekte iki başparmak | İki elle sarıp iki başparmak; saramıyorsa tek el topuğu | RCUK 2025: "Use the two-thumb encircling method ... in infants" (tek/çok kurtarıcı ayrımı yok). AHA 2025: tek el topuğu ya da iki başparmak; iki parmak tekniği kaldırıldı; saramıyorsa tek el topuğu | DOĞRU |
| 112 / nefes kontrolü sırası | Yanıt yok → 112 (hoparlör) → nefes kontrolü | RCUK 2025 Adult BLS: hoparlörü açıp 999'u gecikmeden arayın, bağlanırken nefese bakın. RCUK PBLS: eğitimsiz kişi yanıt yoksa hemen arar; eğitimli kişi bağlantı beklerken nefese bakar. AHA (2020 metni): yardım çağır/acil sistemi etkinleştir, sonra nefes | DOĞRU — önceki turdaki şüphe giderildi |
| Derinlik ve hız | Yetişkin 5–6 cm; çocuk ⅓ (~5 cm); bebek ⅓ (~4 cm); 100–120/dk | RCUK Adult: en az 5, en fazla 6 cm, 100–120/dk. RCUK PBLS: en az ⅓, hiçbir yaşta 6 cm'yi geçme, ergenlerde 5–6 cm. AHA 2025: ~4 cm bebek, ~5 cm çocuk, 100–120/dk. St John: 5–6 cm, 100–120/dk | DOĞRU |

## Rehber bazında

### ilk-yardim-ilk-degerlendirme
- Doğrulandı: RCUK 2025 First Aid "önce güvenlik, yanıt ve hayati kanama", ardından ABCDE; ≤10 sn nefes kontrolü; travma ve hırıltılı solukta derlenme pozisyonu kullanılmaması. Sıra (güvenlik → yanıt → hayati kanama → 112 → nefes) kaynakla uyumlu.
- Değişiklik: yalnızca `sources` ve `checked`. "Sağlık Bakanlığı — İlk Yardım Yönetmeliği" kaynağı bu turda görülmediği için çıkarıldı.

### kanama
- Doğrulandı: doğrudan sert baskı; bazı bölgelerde yarayı doldurma; turnike 5–7 cm, eklem üstüne değil; batmış cismi çıkarmama (St John).
- Değişiklikler:
  - Adım 1: "temiz bir bez" → "temiz bir bez ya da varsa kanama durdurucu (hemostatik) gazlı bez". RCUK 2025 hemostatik pansumanı tercih ediyor.
  - Yapmayın 5: "gerçek turnike yoksa sert baskıya devam edin" cümlesine "112 görevlisi kemer ya da üçgen sargıyla turnike isterse onun talimatına uyun" eklendi. St John, çağrı görevlisinin doğaçlama turnike yaptırabileceğini söylüyor.
  - `sources` ve `checked` güncellendi ("Türk Kızılay" kaynağı görülmediği için çıkarıldı).
- Belirsiz / uzman görüşü gerekli: St John "kan bezden sızarsa bezi kaldırın, yeni bezle yeniden bastırın" diyor; rehber (adım 3) "bezi kaldırmayın, üstüne ekleyin" diyor. RCUK 2025 metninde bu konu bulunamadı. Türkiye'deki eğitimler genelde üstüne ekleme öğretiyor ama bu turda kaynakla görülemedi. Metin DEĞİŞTİRİLMEDİ; eğitmen kararı gerekli.
- Turnike saatinin not edilmesi, "gevşetmeyin" ve "alnına yazın" ifadeleri bu turdaki sayfalarda geçmiyor (doğrulanamadı; yaygın uygulama ve zararsız, metin bırakıldı).

### temel-yasam-destegi
- Doğrulandı: hoparlörle 112, ≤10 sn nefes kontrolü, hırıltılı solunum normal değil, yalnızken OED aramaya gitmeme (St John), göğüs kemiğinin alt yarısı, kenetli eller, 5–6 cm, 100–120/dk, eğitimliyse 30:2, değilse kesintisiz bası.
- Değişiklik: yalnızca `sources` ve `checked`.
- Doğrulanamadı: "2 dakikada bir yer değiştirin" (RCUK yetişkin sayfasında görülmedi; yaygın öneri, bırakıldı).

### ilk-yardim-cocuk-kpr
- Doğrulandı: 5 başlangıç nefesi, alt sternum, tek ya da iki el, en az ⅓ (~5 cm, ≤6 cm), 100–120/dk, 30:2 ve yalnızca eğitimliyse 15:2, telefonsuz 1 dk, <25 kg (≈8 yaş) çocuk modu, ergenlik sonrası yetişkin algoritması (AHA).
- Değişiklik: yalnızca `sources` ve `checked`.

### ilk-yardim-bebek-kpr
- Doğrulandı: baş nötr, ağız + burun nefesi, 5 nefes, iki başparmakla sarma, saramıyorsa tek el topuğu (AHA), ⅓ (~4 cm), 100–120/dk, oranlar, telefonsuz 1 dk, <25 kg'da ön-arka ped.
- Değişiklik: yalnızca `sources` ve `checked`.
- Not: "meme uçları hizasının hemen altına" ifadesi RCUK ve AHA 2025 sayfalarında geçmiyor; ikisi de yalnızca "göğüs kemiğinin alt yarısı" diyor. Anlam olarak uyumlu, bırakıldı.

### ilk-yardim-oed
- Doğrulandı: çıplak göğse, cihazdaki resme göre ped; <25 kg çocuk modu ve ön-arka ped; >25 kg ön-yan ya da ön-arka; AHA <8 yaşta çocuk zayıflatıcı.
- Değişiklik: yalnızca `sources` ve `checked`.
- Doğrulanamadı: kalp pili üstüne ped koymama, ilaç bandını çıkarma, ıslak zemin uyarısı. AHA 2025 yetişkin sayfası alınamadı, RCUK sayfasında yok. Metin yaygın eğitim içeriğiyle uyumlu, bırakıldı.

### derlenme-pozisyonu
- Doğrulandı: adımlar (yakın kol dik açı ve avuç yukarı, uzak elin sırtı yanağa, uzak diz, kendine doğru çevirme, üst bacak dik açı, baş geri ve çene yukarı) St John ile aynı. RCUK 2025: hırıltılı solukta ya da travmada kullanmayın.
- Değişiklik: yeni adım 9 "30 dakikadan uzun aynı yanda kalırsa öbür yanına, derlenme pozisyonuna çevirin." (St John). `art` dizisine aynı yere `null` eklendi. Rehber 10 adım oldu. `sources` ve `checked` güncellendi.
- Not: St John, omurga yaralanması şüphesinde bile hava yolu için normal tekniğin kullanılabileceğini, baş ve omurganın düz tutulmaya çalışılacağını söylüyor. Rehberin "gerekmedikçe döndürmeyin" ifadesiyle uyumlu.

## Resimler
Resimler bu turda değişmedi. Önceki turun resim tablosu geçerli. derlenme-pozisyonu ve kanama yeniden çekildi: yeni adım 9 resimsiz, adım 10 doğru şekilde cpr-adult ile eşleşiyor (cpr-adult'taki bükük kol sorunu sürüyor). Hiçbir art null yapılmadı.

## Test
`npx vitest run tests/guides.test.ts`: 191/191 geçti. İlk denemede başka bir ajanın psikoloji.ts dosyasındaki geçici sözdizimi hatası yüzünden test yüklenemedi; düzeltildikten sonra geçti.

## İnsan uzmanı gerekenler
- kanama adım 3: kanlı bezi kaldırıp yenisini koymak mı (St John), üstüne eklemek mi (rehber)?
- Yedi rehber hâlâ `reviewed: false`.
