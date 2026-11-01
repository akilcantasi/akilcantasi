# Türkiye kaynaklı teyit — batch tr-a (deprem, barınma, tesisat, sel)

Tarih: 2026-11-01. 31 rehber kontrol edildi. afad.gov.tr ve kizilay.org.tr doğrudan açılmadı; AFAD metinleri haber alıntılarından (AA/memurlar.net, TRT Haber, cumhuriyet.com.tr, Türkiye Gazetesi, Yeni Akit) okundu. Null yapılan art girdisi yok.

Kullanılan başlıca kaynaklar:
- AFAD deprem anı/sonrası (AA): https://www.memurlar.net/haber/935256/deprem-aninda-ve-sonrasinda-neler-yapilmali.html
- AFAD deprem sonrası (TRT): https://www.trthaber.com/haber/turkiye/afad-deprem-sonrasi-yapilmasi-gerekenleri-paylasti-560920.html
- AFAD (Cumhuriyet alıntısı; metro/tren, enkaz, vanalar): https://www.cumhuriyet.com.tr/turkiye/deprem-aninda-neler-yapilmali-deprem-oncesi-ve-sonrasinda-hangi-tedbirler-alinmali-1970749
- DASK: https://dersimizdeprem.dask.gov.tr/uploads/workshops/pdf-1667855498462811184.pdf
- Bursagaz: https://www.haberler.com/bursagaz-dan-depreme-karsi-onemli-uyarilar-14338850-haberi/
- İGDAŞ (Milliyet): https://www.milliyet.com.tr/gundem/evdeki-bomba-dogal-gaz-curuk-sarimsak-kokusu-alirsaniz-187yi-arayin-7012972
- Metro İstanbul / İBB AKOM: https://www.karar.com/depreme-metroda-yakalanirsak-ne-yapmaliyiz-1595526
- Hasarlı yapı genelgesi (NTV): https://www.ntv.com.tr/turkiye/deprem-bolgesi-icin-genelge-hasarli-evlere-nasil-girilecek,pqLdySnGdkSFS9hzHuVCkA
- ÇŞİDB Kilis hasar tespit S-C: https://webdosya.csb.gov.tr/db/kilis/duyurular/1.-hasar-tesp-t-vatandas-larimiz--c--n-soru-cevap-112-b-lg-lend-rme-20230219113108.pdf
- HSGM Afetlerde Çevre Sağlığı 2024: https://hsgm.saglik.gov.tr/depo/birimler/cevre-sagligi-db/Haberler/14-16_Subat_2024/Afetlerde_Cevre_Saglig_Uygulamalari.pdf
- Hacettepe sahra tuvaleti: https://halksagligi.hacettepe.edu.tr/duyurularogrenci/afetinfo/infosahratuvaleti.pdf
- Karabük Ü. LPG: https://panel.kku.edu.tr/Content/isgkb/ (ISBASI ISG KONUSMALARI-47)
- AFAD sel (Türkiye Gazetesi): https://www.turkiyegazetesi.com.tr/yasam/selde-neler-yapmaliyiz-afad-tek-tek-acikladi-797702 ; (Yeni Akit) https://www.yeniakit.com.tr/haber/sel-sirasinda-ne-yapilir-sel-ve-heyelandan-korunmak-icin-ne-yapmak-gerekir-1560583.html
- AFAD Trabzon, araçta sel: https://www.cumhuriyet.com.tr/yasam/afad-muduru-uyardi-sele-aracta-kapilirsaniz-terk-etmeyin-1948899
- Kandilli tsunami uyarısı (NTV): https://www.ntv.com.tr/galeri/turkiye/marmarada-tsunami-hazirligi-devreye-alindi-7-dakikada-haber-verecek,t2oWkJLvBEqQlJaDGa7pYQ ; ODTÜ Yalçıner: https://www.cumhuriyet.com.tr/turkiye/uzmanlar-uyardi-deprem-sonrasinda-limanlar-tehlikeli-2056151
- İSKİ 185: https://www.karar.com/fatihte-sular-ne-zaman-gelecek-2-nisan-iski-ariz-numarasi-nedir-805003 ; BEDAŞ 186: https://www.tamindir.com/indir/bedas-186/

## Deprem (deprem.ts)
- deprem-aninda: Teyit (AFAD: asansör, balkon/merdiven, atlama yok, araçta durup içeride bekleme). 5. adım ve hayat üçgeni maddesine dokunulmadı. Değişiklik yalnız sources/checked. Not: AFAD araçta "kontak anahtarını yerinde bırakın, pencereleri kapalı tutun" diyor; rehberde yok, çelişki değil.
- deprem-sonrasi: DEĞİŞTİ. #4 "doğalgaz vanasını, elektrik şalterini ve su vanasını kapatın" → "doğalgaz ve su vanasını kapatın; gaz kokusu yoksa elektrik şalterini de indirin" (AFAD/TRT: "gaz kokusu alınmıyorsa elektrik şalterini kapatın"). Dont'a eklendi: "Kapattığınız doğalgazı kendiniz açmayın; yetkili firmaya ya da dağıtım şirketine (187) kontrol ettirin" (Bursagaz: cihaz/baca yetkiliye kontrol ettirilsin). UZMAN_INCELEME §7 [Y] maddesi: AFAD, DASK ve Bursagaz vana kapatmayı açıkça öneriyor; ABD'deki "yalnız kokuda kapat" kuralı Türk önerisiyle ayrışıyor, Türk önerisi korundu. Açık: gaz şirketinin "gazı kim açar" resmi metni bulunamadı.
- enkaz-altinda: Teyit (AFAD: vurma/ıslık, bağırmak son çare, toz, kibrit yok, enerji tasarrufu). Değişiklik yok. "Sessizlik anında ses verin" ve "az az su için" Türk kaynağında birebir görülmedi.
- enkaz-kurtarma: Türk kaynağıyla kontrol EDİLEMEDİ (AFAD gönüllü eğitim metni bulunamadı); değiştirilmedi, checked güncellenmedi. İşaretleme biçimi AFAD/INSARAG uzmanına.
- deprem-kalabalik-alan: Teyit. AFAD "gerekmedikçe metro ve trenden inmeyin, tutunun, personele uyun"; Metro İstanbul "anons olmadıkça aracı terk etmeyin, tutamağa tutunun". UZMAN_INCELEME'deki toplu taşıma maddesi çözüldü. Not: Metro İstanbul araç içinde "koltuk yanında cenin pozisyonu" ve peronda "sütun yanında çömelme" diyor; rehberle uyumlu, eklenmedi.
- deprem-hasarli-bina: DEĞİŞTİ. #6 "Ağır hasarlı, acil yıkılacak ya da yıkık binaya hiçbir şekilde girmeyin" → yıkık/acil yıkılacağa hiçbir şekilde; ağır hasarlıya yalnız uzman raporu izin verirse (2023 genelgesi). #8 "görevli eşliğinde ve kısa sürede" → "kolluk gözetiminde ve raporda yazan süre içinde (ör. 30 dakika ya da 2 saat)". #5'e valilik sitesi ve muhtarlık listesi eklendi. Orta hasarlı adımı ÇŞİDB ile teyit edildi. UZMAN_INCELEME maddesi çözüldü.
- deprem-cocuklar: Türk kaynağında çocuğa özgü metin bulunamadı; ShakeOut belgesinde bebeği göğse alma teyit edildi, "emzirirken yerinde kalma" ve "60'a kadar sayma" ShakeOut belgelerinde bulunamadı (yalnız "en az 60 saniye yerde kalın" var). Değiştirilmedi, checked güncellenmedi. Açık: #3 ve #6 uzman bakmalı.
- deprem-yuksek-bina: DEĞİŞTİ. #3 "Masa yoksa bir iç duvarın dibine çökün" → "dolgun bir koltuk ya da kanepe gibi sağlam, alçak bir eşyanın yanına çökün" (AFAD, deprem-aninda ile tutarlılık). #6 asansör adımı Metro İstanbul/İBB AKOM ile teyit edildi (UZMAN_INCELEME maddesi çözüldü).

## Barınma (barinma.ts)
- cadir-barinma: DEĞİŞTİ. 2 m / 6 m HSGM 2024 ile teyit edildi (UZMAN_INCELEME §9 çözüldü). Dont: "Çadırın içinde mangal..." → "Çadırın içinde yemek pişirmeyin; mangal..." (HSGM: çadırda yemek pişirilmemeli).
- toplanma-alani: önceki turdaki e-Devlet teyidi geçerli; değişiklik yok, checked güncellenmedi.
- barinma-acil-tuvalet: Teyit (Hacettepe: dışkıya toprak atma; HSGM kapaklı kova). Değişiklik yok. Açık: sudan 30 m için Türk kaynağında sayı yok (Sphere değeri).
- barinma-guvenli-isitma: Teyit (HSGM: en uygun elektrikli ısıtıcı, uzatma kablosu yok). Değişiklik yok. Açık: baca geçiş koruması, 1 m mesafe Türk kaynağında yok.
- barinma-kis-cadir, barinma-kamp-hijyen, barinma-sicak-kalma: Türk kaynağıyla çelişki aranmadı/bulunmadı; değiştirilmedi, checked güncellenmedi.

## Tesisat (tesisat.ts)
- tesisat-gaz-kacagi: DEĞİŞTİ. #4 "Doğalgaz vanasını" → "Doğalgaz sayaç vanasını" (İGDAŞ: önce sayaç vanası). 187, dışarıdan arama, zil/telefon yasağı İGDAŞ ve Bursagaz ile teyit.
- tesisat-elektrik-kesintisi: Teyit (186 = dağıtım şirketi hattı: BEDAŞ, SEDAŞ, UEDAŞ). Değişiklik yok. 4/48 saat değeri ABD kaynaklı.
- tesisat-boru-patlamasi: Teyit (İSKİ 185, 7/24 arıza ve tesisat bildirimi). Değişiklik yok. Ana vana adımı için yetkili Türk kaynağı yok.
- tesisat-tup-guvenligi: Teyit (Karabük Ü.: havadan ağır, kapalı/zemin katta saklamama, kaçakta itfaiye — eski 110 artık 112; HSGM: çadırda tüp lamba yok). LPG'de 187 değil 112 doğru. Değişiklik yok. Açık: hortum değişim süresi/TS standardı.
- tesisat-jenerator, tesisat-arabada-sarj, tesisat-gunes-powerbank, tesisat-hasarli-elektrik: Türk kaynağı bulunamadı/aranmadı; çelişki yok; değiştirilmedi.

## Sel (sel.ts)
- sel: Teyit (AFAD: yükseğe çık, elektrikten uzak, su basmış yola girme, "geri dönün" denmeden dönme; AFAD Trabzon: 20 cm hızlı akan su insanı sürükler — rehberdeki 15 cm ile uyumlu). Değişiklik yok.
- heyelan: Türk resmi halk yönergesi bulunamadı (ÇŞİDB heyelan belgesinde yok); değiştirilmedi. "Top gibi kıvrılma" açık.
- sel-tsunami: DEĞİŞTİ. #9'a "varsa tsunami tahliye tabelalarını öğrenin" eklendi (İstanbul kıyı ilçelerinde tabelalar; Kandilli/ODTÜ). Kandilli: uyarı ~7 dakikada, kıyıdaysanız beklemeyin — #2 ile uyumlu. Açık: Marmara/Ege varış süresi sayıyla doğrulanamadı.
- sel-akintiya-kapilma: Türk kaynağı bulunamadı; değiştirilmedi.
- sel-sonrasi-temizlik: DEĞİŞTİ. #5 "Sel suyuna değen yiyecekleri ve şişmiş, ezik konserveleri atın" → "Sel suyuna değen bütün yiyecekleri, konserveler dahil, atın" (AFAD: "konserveler dahil kesinlikle kullanmayın"). CDC hasarsız konserveyi dezenfekte ederek kullanmaya izin veriyor; ikisi de güvenli, Türk resmi önerisine uyuldu.
- sel-camur-akisi: Türk kaynağı bulunamadı; değiştirilmedi.
- sel-arac: Teyit (AFAD Trabzon: hızlı akan suda araçtan inmeyin; AFAD: araç arızalanırsa çıkıp yükseğe). Değişiklik yok. Batan araçtan çıkış sırası Türk kaynağında yok; açık.
- sel-uyarisi: Teyit (AFAD: uyarıları izleyin, dere yatağına yerleşmeyin). Değişiklik yok.
