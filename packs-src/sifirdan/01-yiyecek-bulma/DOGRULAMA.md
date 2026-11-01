# 01-yiyecek-bulma — bağımsız doğrulama raporu

Tarih: 2026-11-02. 28 rehber, 4 kategori. Denetim: `npx -y tsx tools/check-sifirdan.ts 01-yiyecek-bulma` → hata yok.
WebSearch kullanımı: 5 (kota 25). Doğrulama esas olarak WebFetch ile yapıldı.

Açılabilen kaynaklar: FoodSafety.gov sıcaklık tablosu; CDC trişin ve tularemi önleme sayfaları; CDC MMWR 2004 (ayı eti trişinozu); Missouri Koruma Dairesi (tavşan, ayı); WHO ekinokokoz ve zoonotik grip bilgi notları; Washington DOH PSP sayfası; FM 21-76 bölüm 8 ve 9 (wilderness-survival.net aynası); Greenbelly; survival.powweb; Eat The Weeds; ANSES zehirli bitkiler; Wikipedia (Lagocephalus, Xanthium, Nerium, yalnız ipucu olarak); BirGün (balon balığı).
Açılamayanlar: FSIS "Game from farm to table" (istemci hatası), CDC kuş gribi avcı sayfası, WHO H5N1 bilgi notu, Wikipedia "Universal Edibility Test". FM 21-76 Şekil 9-5 (testin adım adım metni) aynada yalnız resim olarak var; adım süreleri ikincil kaynaklardan teyit edildi.

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-yb-yenebilirlik-testi | DÜZELTİLDİ | Pakette tutuldu, ama özet, not ve 1. adım "son çare, ölümcül bitkileri ayırt etmez" uyarısıyla açılıyor. Kesin yasak listesi FM bölüm 9'a göre tamamlandı (soğanlı-yumrulu, mahmuzlu başak, armut kokusu eklendi; zakkum, porsuk adıyla). Çocuk, gebe ve hasta test yapmaz. Süreler teyitli. |
| sf-yb-kiyi | DÜZELTİLDİ | Özette "pişirmek zehri yok etmez" yoktu, eklendi. Salyangoz, tarak ve yengeç iç organının da biriktirdiği, az yemenin riski sıfırlamadığı eklendi (WA DOH). Kaynak URL'si basın bülteninden asıl PSP sayfasına çevrildi. |
| sf-yb-et-hastalik | DÜZELTİLDİ | 71 °C artık CDC MMWR 2004 ve MDC ile teyitli (yabani av, ayı dahil). Ayı ve domuz etinde renge güvenilmez, donmaya dayanıklı trişin türü eklendi. Tularemi için kene ve at sineği, karaciğer belirtisi ve tavşanda mümkünse 74 °C eklendi. |
| sf-yb-kucuk-memeli | DÜZELTİLDİ | RAPOR şüphe 1 çözüldü: MDC, karaciğerde çok sayıda toplu iğne başı beyaz lezyon görülürse tavşanın atılmasını söylüyor. Kaynaklar çelişiyor (FoodSafety 71 °C, MDC 74 °C); tutucu değer hedef yazıldı. |
| sf-yb-ic-organ | DÜZELTİLDİ | Kist hidatik döngüsü WHO ile teyit edildi (RAPOR şüphe 4'ün ilk yarısı). Organı gömme ya da yakma, el yıkama ve bulaş yolu açıklandı. |
| sf-yb-balik-temizleme | DÜZELTİLDİ | Eksik ölümcül uyarı: Akdeniz ve Ege'deki balon balığı. Zehri pişirmekle yok olmaz, Türkiye'de ölümler var. `note` ve `dont` eklendi. |
| sf-yb-kus-temizleme | DÜZELTİLDİ | Kuş gribi uyarısı (WHO) ve `note` eklendi. 74 °C teyitli. |
| sf-yb-zehirli-benzerler | DÜZELTİLDİ | Türkiye'de çok yaygın olan zakkum ve yüksük otu eksikti, eklendi (ANSES, Nerium). |
| sf-yb-kok-yumru | DÜZELTİLDİ | "Dulavratotu (pıtrak)" adı tehlikeliydi: "pıtrak" zehirli domuz pıtrağı (Xanthium) için de kullanılıyor; tohumu ve fidesi kıtlıkta toplu ölümlere yol açtı. Tanım netleştirildi, `dont` eklendi. |
| sf-yb-yabani-otlar | DÜZELTİLDİ | Yalnız `note` eklendi (zehirli benzer riski). Sayılar yeniden açılmadı. |
| sf-yb-bocek | TEYİTLİ | FM bölüm 8 ile uyumlu. Rehber solucanı FM'den daha tutucu biçimde pişiriyor. |
| sf-yb-yumurta | TEYİTLİ | FM: 2–3 yumurta bırakma; FoodSafety: ak ve sarı katılaşana dek. |
| sf-yb-kerevit-kurbaga | TEYİTLİ | FM: karakurbağası ve parlak renkli kurbağa uyarısı; FoodSafety: kabuklu eti opak olana dek. Kurbağa avının tebliğdeki hükmü hâlâ doğrulanmadı. |
| sf-yb-mantar | ZAYIF KALDI | Yön doğru ("yeme"); CDC MMWR bu turda yeniden açılmadı. |
| sf-yb-yabani-meyve, sf-yb-palamut, sf-yb-bal | ZAYIF KALDI | Yeniden açılmadı. Güvenlik iddiaları tutarlı ve tutucu. |
| sf-yb-olta, -kanca, -balik-yeri, -balik-sepet, -balik-agi | ZAYIF KALDI | Kritik risk düşük. Kaynaklar yeniden açılmadı. Yasal notlar mevcut. |
| sf-yb-ayak-izi, -diger-izler, -hayvan-davranisi, -ilmek, -dusen-tuzak, -tuzak-guvenligi | ZAYIF KALDI | Yeniden açılmadı. Yasal notlar (4915 md. 6) mevcut. |

ÇIKARILAN rehber yok.

## Değişiklikler (önce → sonra)

1. **yenebilirlik-testi özeti.** Önce: "Başka yiyecek kalmadıysa, bol bulunan tek bir bitkinin…". Sonra: "SON ÇARE: Bu test baldıran, yüksük otu, porsuk, acı çiğdem gibi öldüren bitkileri AYIRT ETMEZ. …en az 24 saatte uygulayın."
2. **yenebilirlik-testi notu.** Önce: "Uzman gözetimi olmadan bu test ölümcül zehirlenmeyi önlemez. Yalnız başka hiçbir yiyecek kalmadığında…". Sonra: tadı iyi, deriyi yakmayan, belirtisi geciken öldürücü bitkiler açıkça yazıldı.
3. **yenebilirlik-testi 1. adım.** Önce: kısa sınırlar listesi. Sonra: "Önce şunu bilin: bu test öldüren bitkileri ayırt etmez…" ve genişletilmiş "Kesin yasak, asla test etmeyin" listesi; çocuk, gebe ve hasta yasağı.
4. **yenebilirlik-testi 8. ve 10. adımlar.** Belirti listesi genişletildi, 112 eklendi. "Testi geçmek bitkinin güvenli olduğunu kanıtlamaz" ve "test en az 24 saat" eklendi. `dont` listesine iki madde eklendi.
5. **kiyi özeti.** Önce: "…iyice pişirin; dudakta karıncalanma…". Sonra: "…iyice pişirin. Pişirmek midye zehrini (kırmızı gelgit zehri) yok etmez; …".
6. **kiyi 5. adım.** Önce: "…Bu yüzden temiz yer seçin ve ilk gün az yiyin." Sonra: kaynatma da eklendi; salyangoz, tarak ve yengeç iç organı da biriktirir; "yedikten sonra birkaç saat yalnız kalmayın; az yemek riski azaltır, ortadan kaldırmaz". Bir `dont` eklendi.
7. **et-hastalik 5. adım.** Önce: "…71 °C… et tamamen griye-kahverengiye dönene kadar". Sonra: "en az 71 °C… renge güvenmeyin, termometre yoksa ince doğrayıp uzun süre haşlayın".
8. **et-hastalik 6. adım.** Donmaya dayanıklı trişin türü eklendi. Kurutulmuş et yasağı da eklendi.
9. **et-hastalik 3. ve 4. adımlar.** Tularemi için kene, at sineği, karaciğer belirtisi ve 71/74 °C eklendi. Su: "arıtmadan yüzey suyu içmeyin" (CDC).
10. **kucuk-memeli 7. ve 9. adımlar ve özet.** "Lekeli, noktalı… karaciğeri atın" → toplu iğne başı beyaz noktalar = tularemi, bütün hayvanı atın. "71 °C" → "en az 71 °C, mümkünse 74 °C".
11. **ic-organ 4. adım.** Önce: "…köpeklere vermeyin; hastalık köpekten yeniden insana döner." Sonra: kist hidatik adıyla, gömme ya da yakma, döngünün açıklaması ve el yıkama.
12. **balik-temizleme.** Yeni `note` ve `dont`: balon balığı.
13. **kus-temizleme.** Yeni `note`. `dont[0]` kuş gribi ve eldiven uyarısıyla genişletildi.
14. **zehirli-benzerler 7. adım.** Zakkum (dalı şiş ya da odun yapılmaz) ve yüksük otu eklendi.
15. **kok-yumru 5. adım.** "Dulavratotu (pıtrak)" → "Dulavratotu (büyük dulavrat)…". Domuz pıtrağı uyarısı ve yeni bir `dont` eklendi.
16. **yabani-otlar.** Yeni `note`.
17. **Bütün rehberler.** `checked.note` "Bağımsız doğrulama: …" ile yenilendi. Yeniden açılmayan rehberlerde bu açıkça yazıldı; yazarın notu "Yazar notu:" / "Önceki not:" olarak korundu. Kaynaklar yalnız gerçekten açılan sayfalarla genişletildi.

Adım sayıları değişmedi; `art` uzunlukları ve spec tutarlı.

## Yasak denetimi
- Silah ve patlayıcı yok. Yay ve mızrak yok; balıkta zehir, patlayıcı ve elektrik yasaklı olarak geçiyor.
- İçki tarifi yok. İlaç dozu ve bitkisel tedavi yok.
- Yasal ya da ciddi sağlık riski olan rehberlerin hepsinde `note` var: yabani ot, kuş ve balık temizlemeye bu turda eklendi.

## Uzmana gidecek liste
1. **Yenebilirlik testi pakette kalmalı mı?** Toksikolog ve botanikçiye sorulmalı. Eat The Weeds gibi kaynaklar tamamen karşı. Kalırsa uyarı dili yeterli mi?
2. **Tavşanda hedef sıcaklık:** 71 °C (USDA) mı, 74 °C (Missouri) mı? Tutucu değer yazıldı.
3. **Yaban domuzu ve ayı:** Termometresiz pişirme ölçütü olarak "ince doğra, uzun haşla" yeterli mi? Süre verilmedi.
4. **Kist hidatik:** Köpeklerin çıkaramayacağı gömme derinliği; yakmanın pratikliği.
5. **Balon balığı:** Türkiye kıyılarındaki türlerin halk için tanıtıcı özellikleri (Tarım ve Orman resmî uyarı metni bulunamadı).
6. **Domuz pıtrağı ile dulavratotunun yerel ad karışması:** Bölgesel ad kullanımı kontrol edilmeli.
7. **Kıyı:** Türkiye kıyılarında PSP, ASP ve DSP vakaları ve izleme bölgeleri; yosun toplama kuralı hâlâ kaynaksız.
8. RAPOR.md'deki 2, 3, 5 (artık 71 °C kaynaklı), 6, 7, 8, 9 ve 10 numaralı şüpheler hâlâ açık.
