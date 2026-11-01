# tr-e — Türkiye kaynaklı teyit (yangin.ts, zehirlenme.ts, nukleer.ts)

Tarih: 2026-11-01. 23 rehber kontrol edildi. 15 rehberin `checked` alanı güncellendi, 9'unun metni değişti.
afad.gov.tr, itfaiye.ibb.gov.tr, ilkyardim.meb.gov.tr ve egm.gov.tr robots nedeniyle açılamadı. Yerine haber alıntıları, belediye sayfaları, üniversite ve MEB aynaları kullanıldı.

## yangin.ts

- `yangin`: #3'e "Elinizin altındaysa ağzınızı ve burnunuzu ıslak bir bezle kapatın ama bunun için oyalanmayın" eklendi. Dayanak: AFAD uyarısı "ağız ve burnunuzu ıslak bez ya da mendille kapatın" (https://www.ulusal.com.tr/gundem/afaddan-hayati-uyarilar-iste-yangin-aninda-yapilmasi-gerekenler-15073041). Art değişmedi.
- `orman-yangini`: yeni #9 eklendi: "Deniz kıyısındaysanız ve kara yolu kesildiyse teknelerin yanaşabileceği iskeleye ya da sahile gidin." Dayanak: TEMA (https://www.tema.org.tr/calismalarimiz/orman/daha-yanmadan/orman-yanginlari-sirasinda) ve ÇSGB orman yangını rehberi. Aynı indekse art olarak `null` eklendi.
  - Açık: #7'deki "farları açık bırakıp motoru kapatın" ifadesi Türk kaynaklarında yok, CFA ise motoru çalışır bırakmayı öneriyor. Uzman bakmalı.
  - TEMA ihbar için hâlâ "112 veya 177" yazıyor.
- `yangin-sondurucu`: #3 "2–3 metre" → "yaklaşık 2 metre" yapıldı.
  - Dayanak: Ankara İtfaiyesi "yaklaşık 2 metre" diyor (https://www.ankara.bel.tr/haberler/ankara-itfaiyesinden-yeni-uyari-alev-alan-yaga-su-dokulmemeli-17666).
  - Cumhuriyet Üniv. ve Ardahan Üniv. talimatları "pimi çek, rüzgârı arkaya al, dibe doğrult, tetiğe bas, sağa-sola tara" sırasını veriyor; ÇEK-DOĞRULT-SIK-SÜPÜR ile uyumlu.
- `yangin-yag` (**Türk kaynağıyla ÇELİŞKİ**): yasak listesinde "ıslak bez atmayın" yazıyordu. Ankara ve İstanbul İtfaiyesi ise kapak yoksa nemli bez ya da havluyla örtmeyi öğretiyor.
  - #4 → "yangın battaniyesiyle ya da suyu iyice sıkılmış nemli bir mutfak beziyle örtün".
  - Yasak → "suyu damlayan, sırılsıklam bez atmayın".
  - Kaynaklar: ankara.bel.tr (yukarıdaki); İstanbul İtfaiyesi alıntısı https://www.manisahaberleri.com/tencere-yanginina-dikkat-istanbul-itfaiyesinden-hayat-kurtaran-uyari
- `yangin-arac` (**Türk kaynağıyla ÇELİŞKİ, uyumlu hale getirildi**): #7 "kendiniz söndürmeye çalışmayın" diyordu. İtfaiye ise küçük yangında kaputu açmadan, kenardaki aralıktan ya da ızgaradan kuru tozlu söndürücü sıkmayı öğretiyor.
  - Yeni #7: küçük yangında aralıktan sıkılabilir. Alev büyükse, araç elektrikliyse ya da emin değilseniz uzak durulur.
  - Kaynak: https://itfaiye.erzurum.bel.tr/tedbir/4/arac-yangini-guvenlik-tavsiyesi.html (İstanbul İtfaiyesi'nin aynı metni açılamadı).
  - Not: o sayfa itfaiye için hâlâ 110'u gösteriyor. Rehberde 112 kalıyor, doğrusu bu.
- `yangin-elektrik`: değişiklik yok. Ardahan Üniv. talimatı ("önce akımı kes") ile teyit edildi.
- `yangin-yuksek-bina`: değişiklik yok. AA'da Prof. Dr. Asım Kalkan (asansör yok, kapı altına ıslak bez) ve AFAD uyarılarıyla teyit edildi (https://www.aa.com.tr/tr/gundem/yanginda-dumandan-zehirlenmemek-icin-hayat-kurtaran-oneriler/3476333).
  - Açık: "dairede kal mı, çık mı" ikilemi ve "camı kırmayın" ifadesi itfaiye uzmanına sorulmalı.
- `yangin-duman-solunmasi`: değişiklik yok. AA/Kalkan ve MEB modülüyle teyit edildi.
  - Açık: "24–36 saat" süresi Türk kaynağında yok.
- `yangin-giysi-tutustu`: değişiklik yok. AFAD uyarılarıyla teyit edildi.
- `yangin-kacis-plani`: Türk kaynağına bakılamadı, `checked` değiştirilmedi.

## zehirlenme.ts

- `karbonmonoksit`:
  - Özete ve #4'e şofben eklendi.
  - #7'ye "evde, balkonda" eklendi.
  - Yeni #8 eklendi: soba, kombi, şofben ve baca yıllık bakımı; bacalı şofben banyoya konmaz; lodosta dikkat. Aynı indekse art olarak `null` eklendi.
  - Kaynaklar: Hacettepe Halk Sağlığı CO bilgi notu (https://halksagligi.hacettepe.edu.tr/duyurular/halkayonelik/cobilginotu2026.pdf), MEB modülü, Kızılay Esenyurt.
- `zehirlenme`: değişiklik yok. MEB ve Kızılay "kesinlikle kusturmayın, yiyecek-içecek vermeyin, 114/112" diyor.
  - Not: MEB cilt için 20 dk, göz için 10 dk yıkama diyor. Rehberdeki "en az 15 dk" bununla çelişmiyor, ama cilt için 20'ye çıkarılabilir. Art `flush-water-15` olduğu için şimdilik dokunulmadı.
  - Kaynak: https://eskisehirisg.meb.gov.tr/meb_iys_dosyalar/2025_06/01122933_14.zehirlenmelerdeilkyardim1.pdf
- `zehirlenme-mantar`: değişiklik yok. Sağlık Bakanlığı uyarısı belirtilerin 2–6 saatte başladığını, bazı türlerde 6 saat sonra karaciğer ve böbrek bozukluğu görüldüğünü söylüyor. Rehberdeki 6 saat eşiği bununla uyumlu; UZMAN_INCELEME'deki ilgili madde çözüldü sayılabilir.
  - Kaynaklar: https://www.haberturk.com/saglik-bakanligi-ndan-mantar-zehirlenmelerine-karsi-uyari-2462956 ve NTV 06.05.2025.
- `zehirlenme-metanol`:
  - #3 "12–24 saat" → "genellikle 6–24 saat; normal alkolle birlikte içildiyse 30 saate kadar" yapıldı. Özet de buna göre genelleştirildi.
  - #8 "kokusu ya da tadı tuhaf içkiden uzak durun" → "tadından, kokusundan ya da renginden anlaşılmaz" yapıldı.
  - Kaynaklar: Prof. Dr. Ahmet Aydın/DHA (https://www.dha.com.tr/saglik-yasam/yilbasi-oncesi-sahte-icki-alarmi-belirtiler-gec-cikiyor-risk-buyuk-2777803), Doç. Dr. Aynur Şahin/Diken (https://www.diken.com.tr/?p=1052279).
  - Açık: Sağlık Bakanlığı ya da UZEM metni bulunamadı. Sahte içki için ayrı bir bildirim hattı netleştirilemedi.
- `zehirlenme-cocuk-yutma`: değişiklik yok. MEB ve Kızılay ile teyit edildi.
  - Açık: düğme pil ayrıntıları için Türk kaynağı yok; bal sorusu hâlâ açık.
- `zehirlenme-gida`, `zehirlenme-tarim-ilaci`: Türk kaynağına özel olarak bakılmadı, `checked` değiştirilmedi. Genel kusturmama kuralı MEB ile uyumlu.

## nukleer.ts

- `nukleer-radyasyon`:
  - #9'a NDK eklendi. Dayanak: RESA ağını NDK işletiyor (https://www.ndk.gov.tr/haberler/kamuoyu-bilgilendirme-notu). TENMAK araştırma kurumu; brief'te geçen TENMAK yerine resmi duyuru kurumu olarak NDK yazıldı.
  - Yasak listesine "İyot tableti yerine iyotlu tuz, tentürdiyot ya da başka iyotlu ürün içmeyin" eklendi.
  - Dayanak: DSA'nın Türkçe broşürü yalnızca "başka iyot takviyesi alınmaz" diyor (https://www.dsa.no/en/publications/Jodtabletter%20ved%20atomulykker_mai2019_TYRK.pdf). Tuz ve tentürdiyot ifadesi uzman onayı bekliyor.
  - Rehberde iyot dozu yok.
- `kimyasal-sizinti`, `nukleer-salgin`, `nukleer-korunma-odasi`, `nukleer-patlama-sonrasi`, `nukleer-maske-kullanimi`: AFAD KBRN ve EGM kimyasal tehdit sayfaları robots nedeniyle açılamadı, Türk kaynağıyla teyit yapılamadı. Değişiklik yapılmadı, `checked` korundu.
  - CDC'ye göre kapatılmış odada "birkaç saat, belki birkaç gün" kalınabilir; hava yeterliliğine dair bir uyarı yok. UZMAN maddesi açık kalıyor.

## null yapılan art girdileri

Mevcut hiçbir art girdisi null yapılmadı. Yeni eklenen iki adım için `null` eklendi:
- `orman-yangini` [8]
- `karbonmonoksit` [7]
