# Bağımsız doğrulama: ilk-yardim-ac

Tarih: 2026-11-01
Rehberler: ilk-yardim-kalp-krizi, ilk-yardim-inme, ilk-yardim-seker-dusmesi, nobet, ilk-yardim-bayilma

## ÖNEMLİ: Kaynak doğrulaması YAPILAMADI

Bu oturumda web araması kullanılamadı: tüm ajanların paylaştığı arama kotası (200 arama) dolmuştu. WebFetch de yalnızca konuşmada daha önce geçmiş adresleri açabiliyor. Bu yüzden DOGRULAMA.md'nin 2. adımı (her iddiayı güncel resmi kaynakla karşılaştırma) yerine getirilemedi.

Bunun sonuçları:
- Hiçbir rehberin metni değiştirilmedi.
- `checked` ve `sources` alanlarına dokunulmadı. Bu alanlar hâlâ ilk yazar ajanın kendi notunu gösteriyor; bağımsız doğrulama yapılmış gibi görünmemeli.
- Bu toplu iş, arama kotası yenilendiğinde yeniden doğrulanmalı.

Yapılanlar: tüm adım görsellerinin incelenmesi (node e2e/guide-shot.mjs, /tmp/dg-ilk-yardim-ac), yapı testi (tests/guides.test.ts: 191/191 geçti), dil ve yapı kontrolü, uzman bilgisiyle yapılan bir ön okuma. Aşağıdaki "kontrol edilmeli" maddeleri DOĞRULANMIŞ BULGU DEĞİLDİR; bir sonraki doğrulayıcının bakması gereken noktalardır.

## ilk-yardim-kalp-krizi

- Yapı: 9 adım, art uzunluğu 9; ilaç dozu yok. Dil sade ve emir kipinde.
- Kontrol edilmeli: Aspirin adımı ("yalnızca 112 görevlisi önerirse") bilerek temkinli yazılmış. Hatırladığım kadarıyla ERC/RCUK 2025, alerjisi olmayan erişkinde ilk yardımcının aspirin çiğnetmesini öneriyor; 112 onayı şartı bu öneriden daha kısıtlayıcı. Doz yazmama kuralı göz önüne alınarak bilinçli bir tercih olabilir; insan uzman karar vermeli.
- Kontrol edilmeli: "Doktorunun verdiği kalp ilacı" (nitrogliserin) için kılavuzda ek koşul (ör. düşük tansiyon, cinsel güç ilacı kullanımı) gerekip gerekmediği.
- Görseller:
  - Adım 4, `ilk-yardim-kalp-krizi-oturt`: Yardımcı, kişinin yüzünü/çenesini elleriyle tutuyor gibi görünüyor. Amaç dışı bir temas izlenimi veriyor. İstenen: yardımcı yanında diz çökmüş, sakin konuşuyor, gerekirse eli omzunda; kişi sırtını yaslamış, dizleri bükülü oturuyor.
  - Adım 8, `ilk-yardim-oed-getir`: Arka planda kalp masajı yapılıyor. Bu adımda kişi henüz bilinçli olduğu için sahne bağlama tam uymuyor. Tehlikeli değil. İstenen: arka planda oturan, bilinci açık hasta.
  - Adım 1, 3, 9: uygun.

## ilk-yardim-inme

- Yapı: 9 adım, art uzunluğu 9. YÜZ-KOL-KONUŞMA-ZAMAN sırası ve "son sağlıklı görüldüğü saat" ifadesi doğru kurgulanmış.
- Kontrol edilmeli: "10 saniye" kol tutma süresi (FAST kaynaklarında süre genellikle belirtilmez; NIHSS'te 10 sn). "Başı ve omuzları hafif yüksekte yatırın" konum önerisinin ERC 2025'te geçip geçmediği.
- Görseller:
  - Adım 1, 2, 3, 6: uygun.
  - Adım 8, `recovery-position` (ortak görsel): Üstteki bacak kalça ve dizden belirgin biçimde bükülü değil; iki bacak da neredeyse düz görünüyor. Derlenme pozisyonunda üstteki bacak kalça ve dizden yaklaşık dik açıyla bükülmeli, dizi yere dayanmalı. Bu görsel birçok rehberde kullanılıyor. Yeniden çizilmeli: üst bacak dik açıda bükülü, üst el yanağın altında, baş hafif geride (hava yolu açık).

## ilk-yardim-seker-dusmesi

- Yapı: 8 adım, art uzunluğu 8. Doz yok ("birkaç küp şeker, bir bardak meyve suyu" gibi günlük ölçüler kullanılmış). İnsülin yasağı ve bilinç kapalıyken ağızdan bir şey vermeme kuralı var.
- Kontrol edilmeli: 15 dakika bekleyip tekrar verme ve "yine düzelmezse 112" eşiği. ERC 2025'te glukagon (yakınların eğitimli olduğu durumda) ile ilgili bir ilk yardım önerisi olup olmadığı.
- Görseller: Adım 1, 2, 4 ve 7 (`recovery-position`, yukarıdaki not geçerli) uygun. Adım 2'deki "yatan kişiye verme" ek görseli metinle uyumlu.

## nobet

- Yapı: 9 adım, art uzunluğu 9. `callEmergency` alanı yok. Her nöbette 112 gerekmediği için bu makul.
- Kontrol edilmeli:
  - 9. adımdaki "10 dakikada kendine gelmiyorsa" ifadesi. Önceki not AHA 2024 için "5–10 dk" diyor; hangi sınırın kullanılacağı kaynaktan teyit edilmeli.
  - Sıra önerisi (değiştirilmedi): "5 dakikadan uzun sürerse 112" kuralı 8. adımda, kasılmalar bittikten sonraki adımlardan sonra geliyor. Okuyan kişi bu bilgiye nöbet sürerken ihtiyaç duyar. 4. adımın ("saati not edin") hemen ardına "5 dakikayı geçerse hemen 112" eklenmesi değerlendirilmeli.
- Görseller:
  - Adım 1, `ilk-yardim-nobet-cevre`: Yardımcı ağır bir sandığı nöbet geçiren kişinin bacaklarının üzerinden kaldırıyor. Eşyayı uzaklaştırma fikri doğru, ama ağır bir cismin kişinin üzerinden taşınması kötü örnek. İstenen: eşyalar kişiden uzağa, yana doğru çekiliyor.
  - Adım 2, 4, 5, 8: uygun. Adım 2'deki "ağza bir şey sokma" yasağı ek görseli doğru.

## ilk-yardim-bayilma

- Yapı: 8 adım, art uzunluğu 8. Karşı basınç manevraları ve "koku/su/tokat yok" maddeleri yerinde.
- Kontrol edilmeli:
  - 6. adımdaki "Çoğu kişi 1–2 dakikada kendine gelir. Gelmezse..." eşiği. Hatırladığım kadarıyla NHS, kişi 1 dakika içinde uyanmazsa derlenme pozisyonu ve 999'u öneriyor. Doğrulanırsa eşik "1 dakika" olarak düzeltilmeli.
  - Bacak kaldırmanın "yaklaşık 30 cm" değeri (kaynaklarda genellikle 15–30 cm aralığı geçer).
- Görseller:
  - Adım 1, `ilk-yardim-bayilma-oturt`: Kişi ayakta, başını tutuyor; yardımcı arkasında duruyor. Metindeki "hemen yere oturtun veya yatırın" eylemi görünmüyor. İstenen: yardımcı kişiyi kollarından destekleyerek yere oturtuyor ya da yatırıyor.
  - Adım 2, 5: uygun.
  - Adım 6, `recovery-position`: yukarıdaki ortak görsel notu geçerli.

## Özet

- Görsel olarak kontrol edilen rehber: 5. Kaynakla doğrulanan rehber: 0.
- Metin değişikliği: 0. Hiçbir görsel null yapılmadı; aktif olarak tehlikeli bir görsel yok.
- Yeniden çizim önerilenler: `ilk-yardim-bayilma-oturt`, `ilk-yardim-nobet-cevre`, `ilk-yardim-kalp-krizi-oturt`, `recovery-position` (bacak pozisyonu); küçük bağlam sorunu: `ilk-yardim-oed-getir`.

## Tekrar doğrulama (2026-11-01)

Bu kez kaynaklara WebFetch ile doğrudan ulaşıldı (WebSearch kullanılmadı). Okunan sayfalar:
- RCUK 2025 First Aid Guidelines (resus.org.uk/library/2025-resuscitation-guidelines/first-aid-guidelines): Chest pain, Hypoglycaemia, Stroke bölümleri. Bayılma ve nöbet bu sayfada YOK.
- ERC 2025 "Guidelines for Everyone" (erc.edu, yetişkin halk kitapçığı PDF): göğüs ağrısı, düşük kan şekeri.
- ERC 2025 First Aid tam metni (resuscitationjournal.com) ve resus.org.uk ana kütüphane sayfası AÇILAMADI.
- NHS: Fainting, Heart attack, Stroke symptoms, Low blood sugar (hypoglycaemia). NHS epilepsi/nöbet sayfası açılamadı.
- St John Ambulance: Heart attack, Stroke, Seizure, Diabetic emergencies, Fainting.
- American Red Cross: Heart Attack, Stroke, Seizures, Diabetic Emergencies, Fainting.
- Türk kaynakları (AFAD, Kızılay, Sağlık Bakanlığı) bu turda denenmedi/erişilemedi; Türkiye'ye özgü ifadeler yalnızca 112 numarasıyla sınırlı.

Görseller: art dizileri değişmedi, adım sayıları aynı. İlk turdaki görsel bulguları geçerliliğini koruyor (yeniden çizim: `ilk-yardim-bayilma-oturt`, `ilk-yardim-nobet-cevre`, `ilk-yardim-kalp-krizi-oturt`, `recovery-position`; küçük: `ilk-yardim-oed-getir`). Yapı testi: 191/191 geçti.

### ilk-yardim-kalp-krizi
Doğrulanan: 112'yi hemen arama, oturur/yarı yatar pozisyon (NHS: yerde, dizler bükülü, sırt destekli), yalnız bırakmama, bilinç kaybında TYD, hastaneye kendi araba kullanmama (NHS).
Aspirin kararı: RCUK 2025, kalp kaynaklı göğüs ağrısında "kendi almasını teşvik et ve yardım et, 300 mg, mümkün olan en kısa sürede, ambulansı beklerken; bilinen aspirin alerjisi olan yetişkinlere verme" diyor. ERC 2025 halk kitapçığı: "alerjik olduğunu söylemedikçe yetişkinlere mümkün olan en kısa sürede çiğnenebilir aspirin verin". NHS, SJA (16 yaş altı hariç) ve Red Cross da 112 onayı şartı koymuyor. Yani "yalnızca 112 görevlisi önerirse" ifadesi kılavuzlardan GEREĞİNDEN KATI. Aspirinin yararı zamana bağlı olduğu için bu şart gecikmeye yol açabilir.
Değişiklikler:
- Adım 7: "Aspirin vermeden önce 112 görevlisine sorun; yalnızca görevli önerirse ve ... alerjisi yoksa verin." → "Kişi yetişkinse, aspirin alerjisi yoksa ve yutabiliyorsa aspirini çiğneyerek almasına yardım edin. Kaç tane alacağını 112 görevlisine sorun." Doz kuralına uymak için miktar hâlâ yazılmadı; miktarı 112 görevlisi söylüyor ve verme kararı onaya bağlanmadı.
- Adım 6: "Doktorunun daha önce verdiği kalp ilacı" (belirsiz; herhangi bir kalp ilacı anlaşılabilirdi) → "Göğüs ağrısı (anjina) için doktorunun verdiği dil altı sprey ya da tableti". RCUK: bilinen anjinası olan kişinin nitrogliserin sprey/tabletini kendi almasına yardım.
- sources/checked güncellendi.
Uzman kararı gerekenler: (1) Türkiye'de 112 KKM uygulamasının aspirin önerisiyle uyumu. (2) Kan sulandırıcı kullananlar ile "aspirin yasağı olanlar" için ayrıca uyarı gerekip gerekmediği (kaynaklarda yalnızca alerji ve SJA'da 16 yaş altı geçiyor). (3) Nitrogliserin için düşük tansiyon veya cinsel güç ilacı uyarısı kaynaklarda yok; eklenmedi.

### ilk-yardim-inme
Doğrulanan: FAST (yüz, kol, konuşma, zaman = hemen 112) RCUK, NHS, SJA, Red Cross'ta aynı. Ek belirtiler (görme kaybı, denge kaybı, şiddetli baş ağrısı) NHS listesinde var. Belirti geçse de arama NHS'te var. Yiyecek/içecek vermeme SJA'da var. Başlangıç saati ya da son sağlıklı görülme saati Red Cross'ta var. Yutma güçlüğü/salya/bilinç bulanıklığında derlenme pozisyonu Red Cross'ta var.
Değişiklikler:
- Adım 2: "10 saniye tutmasını" → "havada tutmasını"; "ya da kalkmıyor mu" eklendi. Hiçbir kaynakta süre yok, NHS "kaldırıp tutamama" diyor.
- Adım 7: "başı ve omuzları hafif yüksekte yatırın" (kaynakta yok) → "rahat edeceği, desteklendiği bir şekilde oturtun ya da yatırın. Sakinleştirin." (SJA)
- Adım 8: "Bilinci kapanır ama normal nefes alırsa" → "Bilinci bulanır, salyası akar ya da yutamazsa ama normal nefes alıyorsa yan yatırın." (Red Cross)
Doğrulanamadı: "parmak ucunu iğneyle delme" halk yöntemi uyarısı kaynaklarda geçmiyor. Doğru bir uyarı olduğu için bırakıldı.

### ilk-yardim-seker-dusmesi
Doğrulanan: RCUK 2025 uyanık ve yutabilen kişiye ağızdan 15–20 g glikoz/dekstroz tableti verilmesini, belirtiler sürerse 15 dakika sonra tekrarlanmasını, düzelmezse ya da yanıtsızlaşırsa 999 aranmasını, yanıtsız kişiye ağızdan şeker verilmemesini ve derlenme pozisyonunun düşünülmesini öneriyor. SJA: 150 ml meyve suyu, diyet olmayan gazlı içecek, 3 çay kaşığı şeker ya da küp şeker; sonra daha doyurucu bir yiyecek, tam düzelene kadar yanında kalma. NHS: 10–15 dk sonra yeniden ölçme.
Değişiklikler:
- Adım 2: "birkaç küp şeker ... bir bardak meyve suyu" → "3–4 küp şeker ... küçük bir bardak (yaklaşık 150 ml) meyve suyu". Yaklaşık 15–20 g şekere denk gelir; ilaç dozu değil, yiyecek ölçüsü.
- Adım 4–5: Önceki akışta 112 ancak iki tur şekerden sonra, yani en az 30 dakikada aranıyordu. Yeni hali: "15 dakika bekleyin. Düzelmediyse aynı miktarda şekeri tekrar verin ve 112'yi arayın." / "Kötüleşirse, bilinci bulanırsa ya da yutamaz hale gelirse beklemeden 112'yi arayın." (RCUK: düzelmezse 999; SJA: hızla düzelmezse 999)
Uzman kararı gerekenler: NHS, eğitimli bir yakının glukagon enjeksiyonu yapmasından söz ediyor. İlaç kuralı nedeniyle eklenmedi; "evde glukagon kalemi varsa ve kullanmayı biliyorsanız" gibi bir ifadenin eklenip eklenmeyeceğine bir uzman karar vermeli.

### nobet
Doğrulanan (SJA, Red Cross): tutmama, ağza bir şey koymama, tehlike yoksa taşımama, başı yumuşak bir şeyle koruma, boyundaki giysiyi gevşetme, saati not etme, kasılmalar bitince nefes kontrolü ve derlenme pozisyonu, nefes almıyorsa 112 ve TYD. 112 ölçütleri: ilk nöbet, 5 dakikadan uzun süren, arka arkaya gelen, yaralanma, suda olma (Red Cross), nefesin normal olmaması, nöbetten sonra 10 dakikadan uzun yanıtsızlık (SJA). Böylece 9. adımdaki "10 dakika" eşiği SJA ile doğrulandı.
Değişiklik:
- Adım 4: "Nöbetin başladığı saati not edin." → "... 5 dakikadan uzun sürerse hemen 112'yi arayın." 5 dakika kuralı artık nöbet sürerken okunan adımda. 8. adımdaki liste aynen kaldı.
Doğrulanamadı: "hamile" ve "6 aylıktan küçük bebek" ölçütleri bu turda açılan sayfalarda yok (AHA/Kızılhaç 2024'ten geldiği belirtilmiş; AHA tam metni açılamadı). İhtiyatlı ölçütler oldukları için bırakıldı. SJA'daki "nedeni bilinmeyen nöbet" ölçütü eklenmedi; "ilk nöbet" ölçütü büyük ölçüde onu karşılıyor.

### ilk-yardim-bayilma
Doğrulanan: NHS Fainting'e göre kişi genellikle 30 saniye içinde kendine gelir. "1 dakika içinde uyandırılamıyorsa" 999 aranmalı. Nefes en az 10 saniye kontrol edilmeli. Normal nefes alıyorsa sırtüstü yatırılıp bacakları kaldırılmalı. Hamilelikte, özellikle 28 haftadan sonra, yan yatırmak daha iyi. 999 ölçütleri: nefes almıyor, 1 dakikada uyanmıyor, tam düzelmedi ya da konuşma veya hareket güçlüğü var, göğüs ağrısı ya da düzensiz/hızlı kalp atışı var, ciddi yaralanma ya da nöbet var, egzersiz sırasında ya da yatarken bayıldı. Karşı basınç manevraları (bacak çaprazlama, kas sıkma) Red Cross'ta var. SJA ve NHS bacağın ne kadar kaldırılacağını belirtmiyor (SJA: "slightly").
Değişiklikler:
- Adım 6: "Çoğu kişi 1–2 dakikada kendine gelir. Gelmezse..." → "Çoğu kişi yarım dakikada kendine gelir. 1 dakikada kendine gelmezse yan yatırın ve 112'yi arayın." (NHS)
- Adım 5: "yaklaşık 30 cm kaldırın" → "yastık ya da tabureyle biraz yükseltin" (SJA/NHS'te yükseklik yok)
- Adım 3: "(belirgin hamileyse yan yatırın)" eklendi (NHS)
- Adım 8: NHS ölçütleri eklendi: "tam düzelmediyse ya da konuşma veya hareket güçlüğü varsa, nöbet geçirdiyse".
Doğrulanamadı: Adım 8'deki "hamileyse" ölçütü NHS listesinde yok (ihtiyatlı olduğu için bırakıldı). Red Cross, belirtiler 1–2 dakikada düzelmezse 911 diyor; ancak bu bayılma ÖNCESİ belirtiler için. Bilinç kaybı için NHS'in 1 dakikası esas alındı.

### Özet (tekrar)
- Kaynakla doğrulanan rehber: 5/5.
- Metin değişikliği: 13 adım düzenlendi; ayrıca 5 rehberin sources/checked alanı güncellendi.
- En önemli bulgular: aspirin 112 onayına bağlanmıştı (kılavuzlardan katı, zaman kaybettirebilir); bayılmada eşik 1–2 dakikaydı (NHS: 1 dakika); şeker düşmesinde 112 aramak için en az 30 dakika bekleniyordu; nöbette 5 dakika kuralı geç bir adımdaydı.
- Görsel: yeni değişiklik yok. İlk turdaki yeniden çizim önerileri geçerli.
