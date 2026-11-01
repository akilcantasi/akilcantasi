# Sıfırdan: Barınak ve yapı (06-yapi): bağımsız doğrulama raporu

Tarih: 2026-11-02. Denetim: `npx -y tsx tools/check-sifirdan.ts 06-yapi` sonucu "hata yok" (36 rehber, 4 kategori). Adım sayıları ve `art` dizileri değişmedi, bu yüzden spec.ts'e dokunulmadı.

## TBDY 2018 durumu

Bölüm 11'in tam metnini okuyamadım. Resmî Gazete PDF'i, mevzuat.gov.tr ve Lexpera ek PDF'i robots engeli verdi. ODTÜ'deki dosya yönetmelik değil, bir eleştiri yazısı çıktı. idecad wiki sayfası boş geldi. ÖHÜ'deki dosya bir sunumdu. imo.org.tr ve deprem.afad.gov.tr üzerinde tam metin bulamadım.

Bunun yerine aşağıdaki ikincil kaynakları kendim okudum:
- **FSM tezi** (Özet, s. iv): "TBDY 2018'de kerpiç binaların yapı malzemesi olarak kullanımına izin verilmemektedir." Tezde TS 2515 değerleri de var: deprem bölgesinde taşıyıcı duvar en az 47 cm, yükseklik en çok 2,70 m.
- **ÇŞB yığma ve karma binalar sunumu**: kerpiç, yığma kapsamının dışında tutuluyor ve ayrı mühendislik raporu isteniyor.
- **Uludağ Üniv. makalesi (2023)**: TBDY md. 11.5.1'e göre yığma duvarda etkin kalınlığın alt sınırı 24 cm. Makale md. 11.5.2 (desteklenmemiş duvar boyu) ve md. 11.5.3'ü (kapı-pencere boşlukları) adıyla anıyor ama sayılarını vermiyor.

1975 yönetmeliği (Bölüm 9 yığma, Bölüm 11 kerpiç) ile 1998 kuralları (DergiPark 34224 makalesi) metinden okundu. Yazarın eski yönetmelik sayılarının hepsi bu metinlerle tutuyor. İki yönetmelik çelişince küçük ya da güvenli olan değer alındı.

Sonuç: rehberler TBDY'ye uygun bir tasarım vermiyor, veremez de; çünkü TBDY kerpice izin vermiyor. Bu yüzden ortak not (NOTE_TOPRAK) açıkça şunu söylüyor: ölçüler eski yönetmeliklerin en az koşullarıdır ve güvenliği garanti etmez.

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-yp-deprem | DÜZELTİLDİ | Toprak dam tümden yasaklandı; 47 cm, taş duvarda 50 cm ve köşede 1,5 m eklendi. Not yenilendi. |
| sf-yp-toprak-dam | DÜZELTİLDİ | Yeni yapıda "yapmayın" denildi; rehber artık var olan damın bakımı için. 15 cm sınırı ve ağırlıklar doğrulandı. |
| sf-yp-tas-duvar | DÜZELTİLDİ | 30 cm seçeneği kaldırıldı, en az 50 cm kaldı. Çimento takviyeli harç, açıklıklar arası 1 m ve enine duvar aralığı 5,5 m eklendi. |
| sf-yp-yigma-toprak | DÜZELTİLDİ | 25 cm (California, yalnız düşük deprem bölgesi) kaldırıldı; kerpiç kuralları uygulandı. |
| sf-yp-sikistirma-toprak | DÜZELTİLDİ | FAO'nun 30 cm'si deprem için yetersiz sayıldı; kerpiç kuralı (47 cm, tek kat, 2,70 m) uygulandı. |
| sf-yp-gomuk-ev | DÜZELTİLDİ | Toprağı ahşapla tutma yasaklandı. Kerpiç ve kuru taş uyarısı ile "toprağı harç sertleşince yaslayın" adımı eklendi. |
| sf-yp-kar-barinak | DÜZELTİLDİ | Karbonmonoksit adımı sertleşti: ocak, mangal ve gaz yok, en çok tek mum, belirtiler, uyuyan kişi riski (CDC). |
| sf-yp-kutuk-gecme | DÜZELTİLDİ | Yangın uyarısı eklendi: ısı kaynağından en az 1 m, taş ya da kerpiç ocak arkası, bacanın yılda bir temizliği (USFA). |
| sf-yp-kerpic-duvar | DÜZELTİLDİ | 45 cm yerine en az 47 cm (TS 2515). Hatıl ölçüsü 1975 md. 11.5.1 ile doğrulandı. |
| sf-yp-temel | DÜZELTİLDİ | Çimento takviyeli kireç harcı (1:2:9) eklendi. Temel ölçüleri doğrulandı. |
| sf-yp-cati-egim | DÜZELTİLDİ | Saçak "50–60 cm" yerine "yaklaşık 50 cm" (1975 en az 50, 1998 en çok 50). FAO eğimleri doğrulandı. |
| sf-yp-gunes-yonu | DÜZELTİLDİ | Saçak üst sınırı 60 cm'den ~50 cm'ye indi. Güneş açıları yeniden hesaplandı ve doğru çıktı. |
| sf-yp-kapi | TEYİTLİ | Ölçüler 1975 ve 1998'den okundu. Çapraz yönü ile deri ve pim menteşe için kaynak yok. |
| sf-yp-pencere | TEYİTLİ | 0,90 × 1,20 m alındı (1975'in 1,40 × 0,90'ından küçük). |
| sf-yp-kerpic-2 | TEYİTLİ | Kerpiç ölçüleri 1975'ten, TS 2514 sınıfları FSM tezinden okundu. |
| sf-yp-saz-cati | TEYİTLİ | FAO Roofing: 45°, 15–20 cm, çok yüksek yangın riski. |
| sf-yp-sindil | TEYİTLİ | FAO: 35°, üç kat, tek çivi. USFS ölçüleri yeniden okunmadı. |
| sf-yp-kiremit | ZAYIF KALDI | Çatı ölçüleri FAO ile doğrulandı. Fırın sıcaklığı ve "kiraz kırmızısı" ölçütü yeniden okunmadı. |
| sf-yp-kutuk-secme | TEYİTLİ (not) | Orman notu, md. 91 metniyle uyumlu. |
| sf-yp-yer-secimi, doseme, yalitim, bakim, toprak-testi, kerpic-1, dal-orgu, siva, kutuk-doldurma, harcsiz-tas, kirec, ahsap-iskelet, merdiven, yurt, kece, cit, ahir-kumes | ZAYIF KALDI | Arama kotası nedeniyle bu turda kaynakları yeniden açılmadı. Okumada yapısal, zehir ya da yangın açısından tehlikeli bir sayı görmedim. Yazarın kendi işaretlediği kaynaksız ayrıntılar duruyor. |

Çıkarılan rehber yok.

## Önce → sonra

- **NOTE_TOPRAK**
  - Önce: "…TBDY 2018 kerpici taşıyıcı malzeme olarak kabul etmez. Buradaki ölçüler eski deprem yönetmeliklerinin en az koşullarıdır…"
  - Sonra: "…güncel deprem yönetmeliği (TBDY 2018) kerpiç binaya izin vermez. Buradaki ölçüler 1975 ve 1998 yönetmeliklerinin en az koşullarıdır, güvenliği garanti etmez; … toprak dam yapmayın."
- **deprem, 2. adım**
  - Önce: "Deprem bölgesinde düz toprak dam yapmayın; zorunluysa toprak 15 cm'yi geçmesin."
  - Sonra: "Toprak dam yapmayın; eski yönetmelikler onu en riskli bölgelerde tümden yasaklardı ve bir yerin riskinin düşük olduğunu sahada anlayamazsınız."
- **deprem, 3. adım**
  - Önce: "Dış kerpiç duvarı en az 1,5 kerpiç boyu…"
  - Sonra: "…en az 1,5 kerpiç boyu ve en az 47 cm… Taş duvar en az 50 cm olsun."
- **deprem, 6. adım**
  - Önce: "Köşe ile en yakın kapı ya da pencere arasında en az 1 m dolu duvar bırakın."
  - Sonra: "…en az 1 m; taş evde ve yapabiliyorsanız kerpiçte de 1,5 m."
- **kerpic-duvar, 2. adım**
  - Önce: "1,5 kerpiç boyu (30 cm'lik kerpiçle 45 cm)"
  - Sonra: "1,5 kerpiç boyu ve en az 47 cm (… 45 cm eder; yarım kerpiç ekleyip kalınlaştırın)"
- **yigma-toprak, 6. adım**
  - Önce: "Duvar kalınlığı en az 25 cm olsun; yükseklik kalınlığın 6 katını geçmesin (ör. 40 cm kalınlıkta en çok 2,4 m)."
  - Sonra: "Taşıyıcı dış duvarı kerpiç duvardan ince yapmayın: en az 47 cm. Yükseklik kalınlığın 6 katını ve 2,70 m'yi geçmesin; taşıyıcı duvarlar arası 4,5 m'yi geçmesin. Tek kat yapın."
- **yigma-toprak, 7. adım**: kapı en çok 1,00 × 2,10 m ve pencere en çok 0,90 × 1,20 m ölçüleri eklendi.
- **sikistirma-toprak, 7. adım**
  - Önce: "30 cm kalınlıktaki duvarı en geç her 4 m'de…"
  - Sonra: "Taşıyıcı dış duvarı kerpiç duvardan ince yapmayın (en az 47 cm) ve en geç her 4 m'de… Tek kat, en çok 2,70 m…"
- **tas-duvar, 1. adım**
  - Önce: "Tek katlı evde dış taş duvarı en az 30 cm, deprem bölgesinde en az 50 cm…"
  - Sonra: "Taşıyıcı taş duvarı en az 50 cm kalın yapın. Taşıyıcı duvarlar arası 5,5 m'yi geçmesin…"
  - Özet de "30–50 cm" yerine "en az 50 cm" oldu.
- **tas-duvar, 2. adım**
  - Önce: "1 ölçü kireç kaymağı, 3 ölçü kum. Bulabilirseniz biraz çimento…"
  - Sonra: "çimento bulursanız 1 ölçü çimento, 2 ölçü kireç kaymağı, 9 ölçü kum. Yoksa 1:3…"
- **tas-duvar, 9. adım**: "iki açıklık arasında en az 1 m dolu duvar" eklendi.
- **temel, 4. adım**: 1:2:9 çimento takviyeli harç eklendi; 1:3 kireç harcı yedek seçenek oldu.
- **toprak-dam** (özet, not ve 1. adım)
  - Önce: "yalnız kurak ve az depremli yerde… en çok 15 cm"
  - Sonra: "Yeni ev için toprak dam yapmayın… Aşağıdaki adımlar var olan bir damın onarımı içindir; başka çatı malzemesi hiç yoksa yalnız kurak yerde, küçük, tek katlı ve hatıllı yapıda uygulayın."
- **gomuk-ev, 4. adım**
  - Önce: "Ahşap duvar en çok bir kat derinliğe dayanır…"
  - Sonra: "Toprağı ahşapla tutmayın… Kerpiç ve kuru taş da olmaz… Toprağı ancak duvar ve tavan bitip harç sertleşince yaslayın."
- **kar-barinak, 9. adım**
  - Önce: "İçeride mum ya da ocak yakacaksanız havalandırma deliğini açık tutun ve uyurken söndürün."
  - Sonra: "İçeride ocak, gaz ocağı, mangal ya da kömür yakmayın. En çok tek mum…, yalnız uyanıkken… Baş ağrısı, baş dönmesi, bulantı, halsizlik ya da şaşkınlık başlarsa herkes hemen dışarı çıksın; uyuyan kişi belirti vermeden ölebilir."
  - `dont` listesine bir madde eklendi.
- **kutuk-gecme**: yangın uyarısı yeni bir `dont` maddesi olarak eklendi.
- **gunes-yonu ve cati-egim**: saçak "60 cm'den çok taşırmayın" ve "50–60 cm" yerine "yaklaşık 50 cm" yazıldı.
- **Yeni kaynaklar**: USFA_HEAT, CDC_CO, AYM_ORMAN, CSB_YIGMA. Bütün `checked.note` alanları "Bağımsız doğrulama: …" diye yenilendi.

## Yasak ve not denetimi

- Silah, patlayıcı, içki ve ilaç dozu yok.
- Sağlık ya da yasal risk taşıyan rehberlerin hepsinde `note` var: toprak yapılar, gömük ev, taş duvar, kireç, kiremit fırını, saz çatı, merdiven, kar barınağı, yurt, kütük (Orman).
- **Orman notu**: 6831 md. 91 metni (devlet ormanında izinsiz kesime hapis ve para cezası) AYM kararından okundu. Bu 1967 tarihli metin; güncel ceza miktarları doğrulanamadı. Not ceza miktarı vermediği için doğru kalıyor.

## Uzmana gidecek liste

1. **İnşaat mühendisi**: TBDY 2018 Bölüm 11'in tam metnini okusun (md. 11.1 kapsam, Tablo 11.x kat sınırları, 11.5.1–11.5.3). Kerpiç gerçekten kapsam dışı mı? Taş yığma için 50 cm, 1,5 m köşe ve %40 açıklık değerleri güncel metinle çelişiyor mu?
2. **Sıkıştırma toprak ve yığma toprak (cob)**: deprem bölgesinde donatısız en az kalınlık. Kerpicin 47 cm'si buraya taşındı ama bunu doğrudan söyleyen bir kaynak yok.
3. **Gömük ev**: toprağın yanal basıncı için güvenli derinlik ve taş duvar kalınlığı. Sayı verilmedi.
4. **Orman Kanunu**: md. 17'deki orman alanında yapı yasağı. Doğrulanamadığı için nota eklenmedi; eklenmeli mi? 3194 İmar Kanunu notu gerekir mi?
5. **Kiremit ve kireç**: fırın sıcaklıkları ve renk ölçütü. Bu turda yeniden okunmadı.
6. **Zayıf kalan 17 rehber**: FAO, USFS ve Wikipedia sayılarının ikinci bir okuması.
