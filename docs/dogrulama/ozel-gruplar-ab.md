# Doğrulama: ozel-gruplar-ab

Tarih: 2026-11-01. WebSearch kotası bittiği için yalnızca WebFetch ile doğrudan resmi sayfalar kullanıldı. Ready.gov, FEMA, birçok CDC alt sayfası, RNIB, Guide Dogs, AFB, Vision Australia, AFAD ve İSMEP sayfaları açılamadı. Bu yüzden önceki yazarın verdiği İSMEP, Ready.gov ve AFAD kaynakları, doğrulanmadıkları için `sources` listesinden çıkarıldı.

## ozel-gruplar-engelli-hareket

- Doğrulanan: ShakeOut Drop-Cover-Hold On sayfası. Tekerlekli sandalye ve yürüteç kullananlar tekerleği kilitlemeli, öne eğilmeli, baş ve enseyi kollarla korumalı. Earthquake Country Alliance Step 5'e göre yere inemeyen kişi oturduğu yerde öne eğilir, başını ve ensesini korur. Adım 1 ve 2 bu kaynaklarla uyumlu.
- Değişiklik: Metin aynı kaldı. Kaynaklar ve `checked` güncellendi.
- Doğrulanamadı: Sandalyeyi kolçak ya da ayaklıktan kaldırmama (adım 5) ve merdivende en az 2 kişi kuralı (adım 6) bilinen uygulamalardır, ancak açılabilen bir kaynakta bulunamadı. Fizyoterapist ya da AKUT/İtfaiye tahliye eğitmeni kontrol etmeli.
- Resim sorunları:
  - Adım 1, `ozel-gruplar-sandalye-kilitle`: Kişi yana devrilir gibi duruyor. Bir kolu havada, kollar başı ve enseyi örtmüyor. Olması gereken: Kişi dik oturur, öne eğilir, iki eliyle ensesini ve başını kavrar, ok fren koluna işaret eder.
  - Adım 6, `ozel-gruplar-sandalye-merdiven`: Sandalye merdivende arka tekerlekler üzerine geriye yatırılmamış, düz duruyor. Öndeki yardımcının tuttuğu yer ayaklık bölgesine yakın görünüyor ve bu, adım 5 ile çelişiyor. Olması gereken: Sandalye geriye yatırılmış olsun. Arkadaki kişi itme kollarından, öndeki kişi alt basamakta sabit çerçeveden tutsun.

## ozel-gruplar-engelli-gorme-isitme

- Doğrulanan:
  - RNID iletişim ipuçları: El sallayarak dikkat çek, yüzünü dön, ağzını kapatma, kağıda ya da ekrana yaz.
  - NHS Hearing loss: Yüzüne bakarak, yavaş ve net konuş, gerekirse yaz.
  - Adım 5, 6 ve 7 bu kaynaklarla uyumlu.
- Değişiklik: Metin aynı kaldı. Kaynaklar ve `checked` güncellendi.
- Doğrulanamadı: Görme engelliye rehberlik tekniği (adım 1–4: kendini tanıtma, dirsek verme, yarım adım önde yürüme, basamakta durma, ayrılırken haber verme) ve rehber köpeğe dokunmama. Bunlar standart "sighted guide" tekniğidir, ancak RNIB, Guide Dogs, AFB ve Vision Australia sayfaları açılamadı. Altı Nokta Körler Derneği ya da RNIB kaynağıyla kontrol edilmeli.
- Not: RNID "normal konuşun, dudakları abartmayın" diyor, NHS ise "daha yavaş ve net" diyor. Adım 6'daki "yavaş konuşun" kabul edilebilir.
- Resim sorunları:
  - Adım 2, `ozel-gruplar-gorme-rehberlik`: Görme engelli kişi rehberi omzundan/üst kolundan tutuyor. Metin dirsekten tutmayı söylüyor. Olması gereken: Kişi rehberin dirseğinin hemen üstünden tutar, rehber yarım adım öndedir.
  - Adım 3, `ozel-gruplar-gorme-basamak`: Metin "3 basamak iniyoruz" diyor, resimde basamaklar yukarı çıkıyor. Ayrıca rehber kişiyle temas halinde değil. Olması gereken: Basamağın başında birlikte durmuş iki kişi, aşağı inen basamaklar ve "3 basamak iniyoruz" balonu.
  - Adım 9, `whistle-signal`: Genel düdük resmi. Kabul edilebilir.

## ozel-gruplar-engelli-zihinsel

- Doğrulanan:
  - Alzheimer's Association, Wandering: Kalabalık ve karışık yerlerden kaçının. Kaybolursa hemen arayın. 15 dakikada bulunamazsa acil çağrı yapın ve demans olduğunu söyleyin. Yakın tarihli fotoğraf bulundurun.
  - NHS, demansla iletişim: Kısa cümle, sakin olma, basit seçenek.
- Değişiklikler:
  - Adım 2: "Bileğine ya da boynuna … kart takın" yerine "Bileğine ya da giysisine … kart takın. Telefonunuzda yakın tarihli bir fotoğrafı olsun." Boyun ipi kalabalıkta takılma riski taşıyor, fotoğraf ise kayıp aramada gerekli.
  - Yeni adım 8 eklendi: "Kişi kaybolursa hemen yakın çevreyi arayın. 15 dakikada bulamazsanız 112'yi arayın; demans ya da otizm olduğunu söyleyin, fotoğrafını gösterin." Kendi yakınının kaybolması durumu eksikti. `art` dizisinde ilgili yere `null` eklendi; adım sayısı 10.
- Doğrulanamadı: Otizme özgü öneriler (kulaklık, tanıdık eşya, rutin) açılabilen bir kaynakla doğrulanamadı. Makul görünüyor, ancak Tohum Otizm Vakfı gibi bir kaynakla kontrol edilmeli.
- Resim sorunları: Yok. Adım 1, 2, 5 ve 9'daki resimler metinle uyumlu.

## ozel-gruplar-kronik-hastalik

- Doğrulanan:
  - FDA insülin saklama: Donmuş insülini kullanmayın. Buz kullanıyorsanız dondurmayın. Doğrudan ısı ve güneşten uzak tutun. Aşırı sıcak ya da soğuğa maruz kalanı değiştirin.
  - KCER 3 günlük acil diyet (2025): Tuz ve sıvı kısıtlaması, patates ve domates yok. "Diyet diyalizin yerini tutmaz." "Son seanstan sonra 3 gün içinde diyalize girmeye çalışın."
  - NKF potasyum listesi: Muz, portakal, patates ve domates yüksek potasyumlu.
  - NHS hipoglisemi: Hızlı şeker al, 10–15 dakika sonra yeniden ölç. Bilinci yerinde olmayan kişiye yiyecek ya da içecek verme.
  - NHS inme belirtileri (FAST).
- Değişiklikler:
  - Adım 6: "…şekerinizi sık ölçün. Yanınızda kesme şeker ya da meyve suyu bulundurun." yerine "…sık ölçün. Titreme, terleme, baş dönmesi olursa hemen kesme şeker ya da meyve suyu alın; 15 dakika sonra yeniden ölçün."
  - Diyaliz adımı ikiye bölündü. Adım 7: merkez sorma ve "en geç 3 gün içinde diyalize girmeye çalışın". Adım 8: acil diyet ve "Bu diyet diyalizin yerini tutmaz." `art` dizisine `null` eklendi; adım sayısı 10.
  - Yeni `dont` maddesi: "Bilinci bulanık ya da yutamayan şeker hastasının ağzına yiyecek, içecek vermeyin; 112'yi arayın." Bu boğulma riski olan önemli bir eksikti.
  - Kaynaklar güncellendi. CDC sayfaları açılamadığı için CDC kaynakları çıkarıldı.
- Doğrulanamadı: Türkiye'de afet sonrası diyaliz merkezi yönlendirmesi (İl Sağlık Müdürlüğü / 112 / Türk Nefroloji Derneği) için resmi kaynak bulunamadı. Adım 7 bu yüzden genel "sağlık ekibine sorun" ifadesiyle kaldı. Hipoglisemide "15 dakika" süresi NHS'de "10–15 dakika" olarak geçiyor ve uyumlu.
- Resim sorunları: Yok. Adım 1, 2, 3, 5 ve 9'daki resimler uyumlu.

## ozel-gruplar-evcil-hayvan

- Doğrulanan:
  - CDC Pet safety in emergencies: Kafese ad ve telefon yazın. Künye ve mikroçip kaydı güncel olsun. Afet sonrası tasmada ya da kafeste tutun. Tanıdık kokular değişebilir. El yıkayın. Kirli sudan içirmeyin. Isırıkları bildirin.
  - AVMA: 3–7 günlük mama, en az 7 günlük su, kimlik ve fotoğraf.
  - American Red Cross: "Sizin için güvenli değilse hayvan için de güvenli değil"; geride bırakmayın; fotoğraf taşıyın.
- Değişiklikler:
  - Adım 3'e eklendi: "mikroçipi varsa kayıttaki telefonunuz güncel olsun".
  - Adım 4'e "hayvanın bir fotoğrafı" eklendi. Adım 9'da fotoğraf göstermek isteniyordu ama hazırlıkta yoktu.
- Belirsiz:
  - "En az 3 günlük su": AVMA en az 7 günlük su öneriyor. 3 gün en düşük sınır olarak bırakıldı; insan çantasıyla uyum için ekip karar vermeli.
  - Türkiye'de kedi ve köpek için mikroçip/PETVET kaydı zorunluluğu resmi kaynakla doğrulanamadı; metin "varsa" diye genel bırakıldı.
- Resim sorunları:
  - Adım 2, `ozel-gruplar-evcil-kafes`: Köpekte yalnızca tasma var, kayış (gezdirme ipi) yok ve kimse tutmuyor. Olması gereken: Kadın köpeğin kayışını elinde tutuyor.
  - Adım 4, `ozel-gruplar-evcil-canta`: Çantada fotoğraf yok. Yeni metne uyması için küçük bir hayvan fotoğrafı eklenebilir. Küçük bir sorun.

## Testler

`npx vitest run tests/guides.test.ts`: 191/191 başarılı.
