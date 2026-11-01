# Bağımsız doğrulama — yaralanma-ab

Tarih: 2026-11-01
Rehberler: yaralanma-dis, yaralanma-gogus, yaralanma-karin, yaralanma-uzuv-kopmasi, yaralanma-saplanan-cisim, yaralanma-yara-temizleme, yaralanma-soguk-isirigi

## Kaynak erişimi hakkında önemli not
Bu oturumda ortak web arama kotası doluydu, bu yüzden WebSearch hiç çalışmadı. Doğrulama, doğrudan açılabilen resmi sayfalarla (WebFetch) yapıldı:
- NHS: Knocked-out tooth, Cuts and grazes, Sepsis, Frostbite
- MedlinePlus (NIH): Amputation, traumatic
- British Red Cross: Bleeding heavily
- Mayo Clinic: Frostbite first aid

Şu kaynaklar açılamadı: ERC 2025 İlk Yardım (resuscitationjournal.com erişim hatası), ERC 2021, AHA/Red Cross 2024 (ahajournals), IFRC 2020 PDF (metin kesik), St John Ambulance, AAFP/WMS, IADT. Bu kaynaklara dayanan kararlar aşağıda açıkça "erişilemedi" diye işaretlendi. Her rehberin `sources` alanı, gerçekten açılan sayfaları gösterecek şekilde güncellendi.

Not: Diş rehberindeki ilk değişikliği küçük bir Python betiğiyle yaptım; betik dosyayı tek seferde okuyup yazdı. Bu işlem milisaniyeler sürdü ve testler geçti. Sonraki bütün değişiklikler Edit aracıyla yapıldı. Yine de aynı dosyayı düzenleyen başka bir ajanın değişikliği o anda kaybolmuş olabilir; düşük ihtimal, ama kontrol edilmeli.

---

## yaralanma-dis
**Doğrulanan (NHS Knocked-out tooth):** diş taçtan tutulur, köke dokunulmaz; kirliyse süt, serum fizyolojik ya da tükürükle çalkalanır; yerine takılır; temiz bez ısırtılır; takılamıyorsa süt ya da tükürükte saklanır; süt dişi asla yerine takılmaz (alttan gelen diş zarar görür).

**Değişiklikler:**
- Süt dişi uyarısı 7. adımdan 2. adıma alındı. Önceki sırada kişi "yerine takın" adımını, "süt dişi takılmaz" uyarısını okumadan uygulayabilirdi. art dizisi buna göre kaydırıldı.
- "Yapmayın" listesine eklendi: "Dişi suda bekletmeyin; süt, tükürük ya da serum fizyolojik kullanın." (Su hipotoniktir ve kök hücrelerine zarar verir. Bu IADT önerisi; IADT bu oturumda açılamadı.)
- sources: NHS — Knocked-out tooth.

**Belirsiz:** "Ağız dışında geçen ilk 30–60 dakika" ifadesi IADT'deki 60 dakikalık kuru süre eşiğine dayanıyor, ama bu oturumda doğrulanamadı. Diş hekimi onayı önerilir.

**Resim sorunları:**
- Adım 4, `yaralanma-dis-yerlestirme`: Sağ alttaki küçük resimde kadının ağzının üstünde beyaz bir bant var; ağız bantlanmış gibi görünüyor. "Bez ısırma" anlaşılmıyor. İstenen: dişlerin arasında katlanmış bir bez ya da gazlı bez ısıran bir kişi (bu daha çok adım 5'e uygun).

## yaralanma-gogus
**ERC ile ICRC farkı ve verilen karar:** Halk ilk yardımında ana akım öneri, açık göğüs yarasını açık bırakmak; örtü gerekiyorsa hava geçiren (oklüzif olmayan) bir örtü kullanmak. Yerel kanama doğrudan bastırmayla kontrol edilir. ERC 2021/2025 İlk Yardım, IFRC 2020 Uluslararası İlk Yardım Kılavuzları ve AHA/American Red Cross bu görüşte. ICRC'nin eski ve askeri kökenli el kitapları ise "üç kenarı bantlı hava geçirmez örtü" önerir.

Kararım ERC/IFRC çizgisini korumak oldu. Gerekçeler:
1. Halk için yayımlanan güncel kılavuzlar bu yönde birleşiyor.
2. Hava geçirmez ya da kötü uygulanmış bir valf örtüsü, eğitimsiz kişinin elinde tansiyon pnömotoraksına yol açabilir. Bu durum fark edilmesi zor ve ölümcül.
3. Üç kenar yöntemi doğru uygulama ve sonra izleme gerektirir; rehberin hedef kitlesine uygun değil.

Mevcut metin (açık bırakın, naylon ya da bantla kapatmayın, kanıyorsa elle bastırın, bezi dört yandan bantlamayın) bu karara uyuyor; metinde değişiklik yapmadım. **Uyarı:** ERC 2025, ERC 2021 ve IFRC metinleri bu oturumda açılamadı. Bu karar önceki bilgiye dayanıyor ve checked notunda da böyle yazıyor. Acil tıp uzmanı onayı gerekli.

**Değişiklikler:** checked notu güncellendi. Adım 6'nın resmi kaldırıldı (aşağıya bakın).

**Resim sorunları:**
- Adım 6, `watch-breathing`: Kişiyi düz sırtüstü yatarken, kurtarıcıyı üstüne eğilmiş ve "10 sn" sayacıyla gösteriyor. Bu, bilinçsiz kişide nefes kontrolü sahnesi. Göğüs yaralısı ise yarı oturur tutulmalı; resim yaralıyı yatırmaya yönlendirebilir. **Resmi null yaptım.** İstenen: yarı oturur hâldeki yaralının yüzüne ve dudak rengine bakan bir kurtarıcı.
- Adım 3, `yaralanma-gogus-acik-yara`: "Doğru" paneli, yaranın üstüne elle bastırılan bir bezi gösteriyor. Metin ise "açık bırakın" diyor; resim çelişkili. Tehlikeli değil, çünkü bantlanmamış bir bezle bastırmak kabul edilebilir. İstenen: doğru panelde üstü açık bırakılmış yara (ya da üzerine gevşekçe konmuş, bantlanmamış bir bez); yanlış panelde dört kenarı bantlı naylon kalabilir.

## yaralanma-karin
**Doğrulama:** Organları geri itmemek, nemli temiz bezle gevşekçe örtmek (üstüne streç film), dizleri bükülü sırtüstü pozisyon, ağızdan bir şey vermemek ve şok belirtileri, American Red Cross ve ICRC'nin bilinen halk ilk yardımı içeriğiyle uyumlu. Ancak bu kaynakların sayfaları bu oturumda açılamadı.

**Değişiklik:** 2. adıma "Boyun ya da sırt yaralanması olabilirse kıpırdatmayın." eklendi; yoksa omurga yaralısının pozisyonu değiştirilebilirdi. checked notu güncellendi.

**Belirsiz:** Bu oturumda birincil kaynakla doğrulanmadı; uzman onayı gerekli.

**Resimler:** Sorun yok.

## yaralanma-uzuv-kopmasi
**Doğrulanan (MedlinePlus Traumatic amputation, British Red Cross):** parça temiz, nemli bir beze sarılır; ağzı kapalı poşete konur; poşet buzlu suya konur. Parça doğrudan buza ya da suya değmez, kuru buz kullanılmaz. Hayat, uzuvdan önce gelir. Turnike yalnızca hayatı tehdit eden kanamada kullanılır.

**Değişiklikler:**
- Turnike adımı. Önce: "kanama bastırmayla durmuyorsa ... birkaç parmak üstüne". Sonra: "Kol ya da bacak koptuysa ya da kanama bastırmayla durmuyorsa, turnike varsa yaranın 5–7 cm üstüne takın; eklemin üstüne takmayın. Saatini not edin." Gerekçe: Kopmuş bir kol ya da bacakta hayati kanama beklenir; ERC'ye göre turnike hemen uygulanır.
- sources: MedlinePlus ve British Red Cross olarak değiştirildi.

**Belirsiz:** "5–7 cm" ve "eklemin üstüne değil" bilgisi ERC 2021'den; bu oturumda ERC metni açılamadı. (Stop the Bleed: "yaranın 5–7 cm / 2–3 inç üstü".) Kontrol edilmeli.

**Resimler:** Sorun yok. Adım 1'deki resim kopma değil, genel bir ön kol yarasını gösteriyor; kabul edilebilir.

## yaralanma-saplanan-cisim
**Doğrulanan:** British Red Cross Bleeding heavily (cismi çıkarmayın, kanamayı tıkıyor olabilir; cismin çevresine bastırın) ve NHS Cuts and grazes (yarada saplı bir şey varsa 999 ya da acile gidin, kendiniz çıkarmayın).

**Değişiklikler:** Metin değişmedi. sources ve checked güncellendi (açılamayan ICRC ve American Red Cross çıkarıldı).

**Resimler:** Sorun yok (adım 1, 3, 4 ve 7).

## yaralanma-yara-temizleme
**Doğrulanan (NHS Cuts and grazes, NHS Sepsis):** musluk ya da şişe suyuyla yıkama; çevre deriyi sabunlu suyla, yaradan dışa doğru silme; örtme; 5 cm'den büyük, kirli ya da ısırık yarada sağlık kuruluşu. Sepsis belirtileri: çok hızlı nefes, bilinç bulanıklığı, mavi, soluk ya da alaca cilt.

**Değişiklikler:**
- **Tehlikeli eksik giderildi.** 3. adım olarak eklendi: "Kanama durmuyorsa ya da fışkırıyorsa, yara çok büyük ya da derinse, içinde cam gibi bir şey saplıysa ya da yaranın ötesinde his kaybı varsa yıkamayın; 112'yi arayın." Önceki metin, derin yarayı yalnızca "sağlık kuruluşuna gidin" maddesinde sayıyordu; NHS bunları 999/acil kapsamında sayar. Red Cross da şiddetli kanayan yaranın yıkanmamasını söyler. art dizisine null eklendi; adım sayısı 10 oldu (izin verilen en yüksek sayı).
- Son adım: "ya da derinse" çıkarıldı (yeni adıma taşındı). NHS'ye uygun olarak "yüzde ya da avuç içindeyse" eklendi.
- checked notu güncellendi.

**Resimler:** Sorun yok (adım 1, 2, 4, 6, 8 ve 10).

## yaralanma-soguk-isirigi
**Doğrulanan:**
- NHS Frostbite: ılık (sıcak değil) su; ovmayın; ateş, radyatör ya da sıcak su torbası kullanmayın; eller koltuk altında ısıtılabilir; alkol yok; yüzük ve eldiven çıkarılır.
- Mayo Clinic: yeniden donma ihtimali varsa çözdürmeyin; yaklaşık 30 dakika ılık suda tutun; donmuş ayakla mümkünse yürümeyin; karla ovmayın.

**Değişiklikler:** Metin değişmedi. sources NHS, Mayo ve WMS olarak güncellendi; checked notu güncellendi.

**Belirsiz:** 37–39 °C değeri Wilderness Medical Society'den alındı (NHS ve Mayo sayı vermiyor); WMS metni bu oturumda açılamadı. NHS ayrıca bölgeyi yukarı kaldırmayı ve ılık içecek vermeyi öneriyor; adım sayısı yüksek olduğu için eklemedim. İsteğe bağlı olarak eklenebilir.

**Resim sorunları:**
- Adım 8, `yaralanma-donma-sarma`: Sargı eli değil bileği sarıyor. Parmak arası pedler parmakların arasında değil, parmakların üstünde duruyor. İstenen: parmakların arasına konmuş gazlı bez ve eli gevşekçe saran bir sargı. Küçük bir sorun.

---

## Özet
- 7 rehber kontrol edildi.
- 7 içerik değişikliği yapıldı: diş adım sırası, diş "yapmayın" maddesi, karında omurga uyarısı, turnike adımı, yara temizliğine eklenen acil adım, yara temizliği son adımı, göğüs adım 6 resminin kaldırılması. Ayrıca bütün rehberlerin sources ve checked alanları güncellendi.
- 3 resim yeniden çizim için işaretlendi (gogus adım 3 ve 6, dis adım 4); 1 resim küçük düzeltme için (soguk-isirigi adım 8).
