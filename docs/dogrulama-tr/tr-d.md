# tr-d — Türkiye kaynaklı teyit (hayatta-kalma.ts, doga.ts, guvenlik.ts)

Tarih: 2026-11-01. 25 rehber kontrol edildi; 6 rehberde metin değişti, 15 rehberde yalnızca `checked`/`sources` güncellendi, 4 rehber (yön bulma ×3, pusula, barınak, dere geçme, düğümler, boş ev) için Türk resmî kaynağı bulunamadı; bunlara dokunulmadı.

Tarih: 2026-11-01. 25 rehber kontrol edildi: 5 rehberde metin değişti, 12 rehberde yalnızca `checked`/`sources` güncellendi, 8 rehber (yon-gunes, yon-yildiz, yon-saat, pusula-harita, barinak, dere-gecme, dugumler, guvenlik-bos-ev) için Türk resmî kaynağı bulunamadı; bunlara dokunulmadı.
- Orman Kanunu md. 76 alıntısı ve valilik genelgesi: https://www.birgun.net/haber/antalya-valiligi-nden-genelge-ormanlara-4-kilometre-mesafede-bile-ates-yakmak-yasak-448845
- 2026 valilik orman yasakları: https://gazeteoksijen.com/turkiye/ankarada-ormanlik-alanlara-giris-yasagi-15-ekime-kadar-uzatildi-284343 , https://www.milligazete.com.tr/2026-il-il-orman-yasagi-tarihleri-ne-hangi-sehirlerde-devam-ediyor-yasak-ne-zaman-kalkiyor
- Orman yangını ihbarı 112: https://www.benguturk.com/gundem/cumhurbaskani-yardimcisi-yilmazdan-orman-yangini-uyarisi-duman-ve-alev-gorunce-275913h
- MEB İlk Yardım, böcek sokmaları ve hayvan ısırıkları: https://ilkyardim.meb.gov.tr/media/iqwbgnit/boecek-sokmalari-ve-hayvan-isriklarinda-ilk-yardim.pdf
- Sağlık Bakanlığı GİS broşürü (su kaynatma): https://deprem.saglik.gov.tr/depo/deprem/GIS_Brosur.pdf
- Sağlık Bakanlığı sıcak hava uyarısı (10.00–16.00): https://www.birgun.net/haber/saglik-bakanligi-ndan-sicak-hava-uyarisi-mecbur-kalmadikca-disari-cikmayin-547323
- Tarım ve Orman Bak. Ordu İl Müd. mantar PDF: https://ordu.tarimorman.gov.tr/BelgelerArsiv/Gıda%20ve%20Yem/MANTAR%20ZEHİRLENMELERİNE%20DİKKAT.pdf
- Sağlık Bakanlığı mantar uyarısı: https://www.haberturk.com/saglik-bakanligi-ndan-mantar-zehirlenmelerine-karsi-uyari-2462956
- AKUT Bursa / TDF önerileri: https://www.ntv.com.tr/seyahat/uzmanlarindan-doga-tutkunlarina-hayat-kurtaracak-oneriler,sIknuhCR402I_tLFER7m8w
- Acıbadem donma/hipotermi ilk yardımı: https://www.acibadem.com.tr/hayat/donma-vakalarinda-ilk-yardim-adimlari/
- KADES (İçişleri, 2026): https://www.dha.com.tr/politika/bakan-ciftci-kadesi-9-milyon-713-bin-686-kisi-indirdi-2888167
- ALO 183: https://aile.gov.tr/sss/engelli-ve-yasli-hizmetleri-genel-mudurlugu/alo-183-sosyal-destek/q-0001/ ; refakatsiz çocuk 2023: https://www.cumhuriyet.com.tr/turkiye/refakatsiz-cocuk-sorgulama-ekrani-nedir-deprem-sonrasi-cocuklarina-ulasamayan-aileler-nereye-basvurmali-2054316
- Yardım toplama izni: https://tusev.org.tr/wp-content/uploads/2024/02/YardimToplamaBilgiNotu_Ulusal.pdf
- DMM: https://www.trthaber.com/haber/gundem/dmm-buyuk-marmara-depremi-tatbikati-iptal-edildi-iddialarini-yalanladi-926968.html

## hayatta-kalma.ts
- hayatta-kalma-su-bulma: teyit (Sağlık Bak. "en az 1 dk kaynatın"); değişiklik yok.
- hayatta-kalma-su-aritma: teyit (Sağlık Bak. 1 dk, çamaşır suyu); değişiklik yok. 2000 m/3 dk ve SODIS Türk kaynağında yok.
- hayatta-kalma-yon-gunes, -yon-yildiz, -yon-saat, -pusula-harita: konuya ilişkin Türk resmî kaynağı yok; dokunulmadı.
- hayatta-kalma-ates: DEĞİŞTİ. #1 "Orman içinde ve ormana yakın yerde izinsiz ateş yakmak yasaktır" → "Ormanda izin verilen ocak yerleri dışında ateş yakmak yasaktır; yaz ve sonbaharda valilikler ormana 4 km'ye kadar ateş yakmayı da yasaklar." Dayanak: md. 76 alıntısı ve Antalya Valiliği genelgesi (BirGün), 2026 valilik yasakları. İhbar 112 doğru (177 artık 112'ye bağlı). Art değişmedi (#1 zaten null).
  Belirsiz: md. 76'nın tam güncel metni mevzuat.gov.tr'den okunamadı; "hayati gerekçe" ile yasak arasındaki hukuki durum (zaruret hâli) hukukçuya.
- hayatta-kalma-barinak: Türk kaynağı yok; dokunulmadı.
- hayatta-kalma-isaret: teyit (AKUT/TDF: büyük renkli yazılar, taşla şekiller, ışık); değişiklik yok.
- hayatta-kalma-yabani-yiyecek: teyit (Tarım Orman PDF: "yendikten 6 saat sonra gelişen belirtiler" karaciğer-böbrek, ölüm tehlikesi; zehirlerin çoğu ısıya dayanıklı; gümüş kaşık efsanesi; UZEM 114). UZMAN_INCELEME'deki "6 saat eşiği" maddesi Türk kaynağıyla teyit edildi. Not: Sağlık Bakanlığı haberi belirtilerin "2–6 saatte" çıktığını söylüyor (erken tip); rehber "belirti beklemeden ara" dediği için çelişki yok.
- hayatta-kalma-soguk-gece: teyit (Acıbadem, resmî değil); değişiklik yok.
- hayatta-kalma-sicak: teyit — Sağlık Bakanlığı "10.00-16.00 saatleri arasında dışarıya çıkmayın". UZMAN_INCELEME'deki 10–16 / 11–15 maddesi çözüldü (Türk resmî değeri 10–16, rehber uyumlu).
- hayatta-kalma-dere-gecme, -dugumler: Türk kaynağı yok; dokunulmadı.
- hayatta-kalma-vahsi-hayvan: teyit (MEB: 10–15 dk su-sabun, kuduz ve tetanos için sağlık kuruluşu, ciddi yarada 112); değişiklik yok.

## doga.ts
- hipotermi: teyit (Acıbadem: ovma/masaj yok, alkol yok, şekerli sıcak içecek, yavaş ısıtma); değişiklik yok. Termofor maddesi açık kalıyor (resmî Türk metni bulunamadı).
- doga-kaybolma: DEĞİŞTİ. #5 sonuna "Art arda 3 kısa düdük de yardım çağrısı olarak bilinir." eklendi (hayatta-kalma-isaret ile tutarlılık; Türkiye'de yaygın öğretilen 3'lü işaret). Art değişmedi.
  Belirsiz: AKUT Bursa şarj azsa telefonu kapatıp 30 dk'da bir 3–4 dk açmayı öneriyor; rehber düşük güç modu diyor. Hangisinin tercih edileceği (112 geri arayabilsin mi) JAK/AKUT uzmanına. "Harita → Konumumu söyle" menüsü hâlâ doğrulanmadı.
- hayvan-isirigi: DEĞİŞTİ. #6 "bölgeye beze sarılı soğuk uygulayın" → "bölgeyi su ve sabunla yıkayın, sonra beze sarılı soğuk uygulayın" (MEB: akrep ve arıda yıka). "Yapmayın": "Turnike uygulamayın, buzu doğrudan değdirmeyin." → "Turnike uygulamayın. Yılan ısırığına buz ya da soğuk uygulamayın; arı ve akrep sokmasında da buzu cilde doğrudan değdirmeyin." (MEB: "Yılan ısırığında yara üzerine soğuk/buz uygulamayın"). Art değişmedi (#6 null).
  Belirsiz: MEB yılan ısırığında "kol/bacaktaysa yaranın üstünden dolaşımı engellemeden bandaj" öneriyor; rehberde yok (ERC/NHS sıkı bağlamayı önermiyor, Avrupa engereklerinde basınçlı bandaj tartışmalı). Uzman/UZEM kararı.
- doga-hava-degisimi: teyit (AKUT/TDF: rota ve dönüş saati yetkililere, siste emin değilsen yürüme); değişiklik yok.
- doga-yalniz-yaralanma: teyit (AKUT/TDF); değişiklik yok. Bezi kaldırmama maddesi uzman listesinde açık.

## guvenlik.ts
- guvenlik-kayip-cocuk: DEĞİŞTİ. #8 sonuna "Kayıp çocuğunuzu ALO 183'e de bildirin." eklendi (2023'te ASHB kayıp/refakatsiz çocuk ihbarlarını ALO 183 üzerinden kaydetti). Art değişmedi (#8 null).
- guvenlik-yardim-dolandiriciligi: DEĞİŞTİ. #3 "siviltoplum.gov.tr'deki sorgulama ekranından bakın" → "valilik ya da kaymakamlıktan aldığı yardım toplama iznini sorun. Emin olamazsanız il sivil toplumla ilişkiler müdürlüğüne danışın." Halka açık sorgu ekranı hiçbir kaynakta doğrulanamadı; TÜSEV notu izin makamının kaymakamlık/valilik olduğunu söylüyor. Kaynaklardan "siviltoplum.gov.tr yetki sorgulama" ifadesi çıkarıldı, TÜSEV eklendi.
  Art: #3 "guvenlik-izin-sorgu" korundu (izin kontrolü anlamı sürüyor); çizim bir web sorgu ekranı gösteriyorsa null yapılmalı — çizim tanımı repoda bulunamadı.
- guvenlik-cadir-kent: teyit (KADES adı ve kullanımı güncel, 2026 İçişleri açıklaması; ALO 183); değişiklik yok.
- guvenlik-bos-ev: AFAD genelgesi bulunamadı; dokunulmadı.
- guvenlik-yanlis-bilgi: teyit (DMM 2025–26'da faal); değişiklik yok.

## Null yapılan art girdileri
Yok.

## Açık kalanlar
- Yılan ısırığında MEB'in "dolaşımı engellemeyen bandaj" önerisi (uzman).
- Telefonu kapatıp aralıklı açma (AKUT) ile düşük güç modu (rehber) farkı (JAK/AKUT).
- Orman Kanunu md. 76 tam metni; hipotermide termofor; yardım toplama izni sorgusunun gerçekte nasıl yapıldığı.
