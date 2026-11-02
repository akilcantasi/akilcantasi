# 16-onarim-teknik: bağımsız doğrulama

Tarih: 2026-11-02. WebSearch: 8 kez (kota 25). Denetim: `npx -y tsx tools/check-sifirdan.ts 16-onarim-teknik` → hata yok.

Yeniden açılıp okunan kaynaklar: repairfaq.org (Sam's safety), iFixit Device Safety, ARRL QST Lloyd kristal radyo PDF'i, Wikipedia Crystal radio, Radyo 1, Radyo Çukurova, TRT; BTK Amateur radio; RSGB Antenna safety; EC&M NEC 810; RNLI Float to live; NOAA NWS Cold water; Özel Tekneler Yönetmeliği metni (RG 17.01.2026/33140, alomaliye kopyası); USDA FS An Ax to Grind; Wisconsin Extension; WSU Extension; NSK; Tsubaki; Algeos; MEC.
Açılamayanlar: TRT frekans sayfası, mwlist.org (ikisi de istemci hatası), RTÜK'te orta dalga verici listesi bulunamadı; FM 21-76 denenmedi (yazar da açamamıştı).

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-ot-sap-degistirme | TEYİTLİ | USDA FS: alttan üste zımbalama, yarık 2/3, tahta kama, metal sokmama, suyla şişirme geçici. |
| sf-ot-ege-bileme | TEYİTLİ | Kürek/çapa 30° (Wisconsin) ve 45° (WSU), tırpan 20–22° (Wisconsin), balta ~25° dışbükey, 2–3 inç (USDA). |
| sf-ot-pas | TEYİTLİ | WSU: 1:1 sirke 24 saat, gözlük, yağlı kum kovası, bezir yağlı bez. |
| sf-ot-ayakkabi | TEYİTLİ | Algeos: alkol, 10–15 dk, 24 saat. |
| sf-ot-canta | TEYİTLİ | MEC: pense iç/dış, iki yandan hafif sıkma, mum, eksik dişin üstünü dikme. |
| sf-ot-zincir-rulman | TEYİTLİ | Tsubaki %1,5–2; NSK 1/2–2/3 ve 1/3–1/2. |
| sf-ot-yapistirma | ZAYIF KALDI (güvenli) | Kaynaklar yeniden açılmadı; uyarılar tutucu, sayı yok denecek kadar az. |
| sf-ot-cihaz-guvenlik | DÜZELTİLDİ | Kondansatörü "ölçüp sıfır görme" adımı kaldırıldı (yüksek gerilim ölçümü demek); sel suyu uyarısı eklendi. |
| sf-ot-cihaz-olcum | DÜZELTİLDİ | Kaçak denetimi yanlıştı/eksikti: bip olmaması yeterli değil, 1 MΩ eşiği; Türk fişinde "toprak bacağı" yok; düğme açık; kablo renkleri eklendi. |
| sf-ot-kristal-1 | DÜZELTİLDİ | Türkiye AM uyarısı tutuculaştırıldı; ara uçların hangi uçtan sayıldığı eklendi. |
| sf-ot-kristal-2 | DÜZELTİLDİ | Fırtına adımı: gök gürültüsü duyulduktan sonra antene dokunmak istendiği için değiştirildi; diyot ara ucu (ARRL) eklendi. |
| sf-ot-anten | DÜZELTİLDİ | Not'a TCK md. 132 dinleme sınırı; topraklama "dış örgü" ve fırtına zamanlaması netleştirildi. KEGM/BTK notu teyitli. |
| sf-ot-yelken | DÜZELTİLDİ | Dümen küreği yönü ters/belirsizdi; "sırtüstü yüzün" RNLI'ye aykırıydı; ADB notu yönetmelik kapsamına göre düzeltildi; bidon uyarısı. |
| sf-ot-kiyi | DÜZELTİLDİ | "Sabah erken çıkın" kara meltemiyle (açığa sürüklenme) çelişiyordu. |

Sayım: TEYİTLİ 6, DÜZELTİLDİ 7, ZAYIF KALDI 1, ÇIKARILDI 0.

## Değişiklikler (önce → sonra)

**sf-ot-cihaz-guvenlik, adım 9**
- Önce: "…büyük, silindir biçimli kondansatörlere dokunmayın; dolu kabul edin. Ölçü aletiyle sıfır olduğunu görmeden hiçbir tele elinizi sürmeyin."
- Sonra: güç kaynağı bölümüne (kondansatör, transformatör, soğutuculu parçalar) hiç dokunmayın; rehberler yalnız fiş, kablo, düğme, sigorta, ısıtıcı tel ve kömür fırça içindir; kondansatörü boşaltmaya çalışmayın.
- Gerekçe: 300 V+ DC kondansatörü ölçmek, okuyucuyu şebeke ve üstü gerilimde ölçüm yapmaya iter; bu da notla çelişiyordu.
- `dont`'a eklendi: sel ya da yağmur suyuna girmiş cihazı prize takmama.

**sf-ot-cihaz-olcum, adım 8**
- Önce: "fişin iki bacağını birlikte, cihazın metal gövdesiyle karşılaştırın; bip olmamalı… Toprak bacağı ile metal gövde arasında ise bip olmalı."
- Sonra: her onarımdan sonra prize takmadan; düğme açık; iki bacak kıskaçla birleşik; en yüksek Ω aralığında; "OL" ya da 1 MΩ'dan büyük olmalı, küçükse kullanmayın; fişin yanlarındaki toprak kontakları ile gövde arasında bip olmalı.
- Gerekçe: repairfaq eşiği 1 MΩ; süreklilik bipi yalnız düşük dirençte öter, onlarca kΩ'luk öldürücü kaçağı göstermez. Düğme kapalıyken iç devre ölçülmez. Türkiye'deki Schuko fişte toprak bacak değil yan kontaktır.
- `dont`'a eklendi: sarı-yeşil toprak, kahverengi faz, mavi nötr.
- spec `sf-ot-olcum-govde`: "döner anahtar en yüksek Ω aralığında" eklendi.

**sf-ot-kristal-1, adım 1**
- Önce: "Bölgede AM yayın yapan verici yoksa ses gelmez."
- Sonra: Türkiye'de yayınların çoğu FM'de, orta dalga vericisi az ve bulunduğunuz yerde olmayabilir; önce pilli radyonun AM bandında, özellikle gece, istasyon olup olmadığına bakın.
- Adım 4'e eklendi: sarmaya başlanan uç alt uçtur, toprağa gider; ara uçlar bu uçtan sayılır.

**sf-ot-kristal-2**
- Adım 4'e eklendi: karışma sürerse diyotu 40. sarım ara ucuna alın (ARRL Lloyd tasarımı).
- Adım 9 önce: "Gök gürültüsü başlayınca anten telini radyodan ayırıp… toprak teline bağlayın."
- Sonra: fırtına yaklaşırken, gök gürültüsü duymadan önce ayırın; gök gürültüsü duyulduktan sonra antene, toprak teline ve radyoya dokunmayın.

**sf-ot-anten**
- Not'a eklendi: kamuya yönelik olmayan telsiz konuşmalarını dinleyip kaydetmek ya da yaymak TCK md. 132 kapsamında suç oluşturabilir.
- Adım 9: "kabloyu" → "koaksiyel kablonun dış örgüsünü"; fırtına zamanlaması kristal-2 ile aynı yapıldı.

**sf-ot-yelken**
- Not önce: "2,5 m'den uzun özel teknelerin kullanımı … ADB gerektirebilir."
- Sonra: bağlama kütüğüne kayıtlı, 2,5 m ve üstü özel tekneler muafiyetler dışında ADB gerektirir (RG 17.01.2026, 33140); kayıtsız ev yapımı salla açılmak olağan zamanda uygun değildir. "15 °C ve altı" → "15 °C altı" (RNLI).
- Adım 1: boş bidonun can yeleği yerine geçmediği, yalnız sığ ve kıyıya çok yakın suda kullanılacağı eklendi.
- Adım 8 önce: "küreği suda sağa çevirince sal sola döner." Sonra: "Küreğin sapını sağa iterseniz sal sola, sola iterseniz sağa döner; tekne yekesi gibi çalışır." (Pala sağa giderse sal sağa döner; eski ifade belirsizdi ve pala olarak okunursa tersti.)
- Adım 10 önce: "Önce sırtüstü yüzüp…" Sonra: hemen yüzmeye çalışmayın; baş geride, kulaklar suda, kol ve bacaklar açık süzülün; sonra sala çıkın, kıyı çok yakın değilse saldan ayrılmayın; beklerken HELP duruşu (NWS).

**sf-ot-kiyi**
- Adım 2 önce: "Sabah erken ve hava sakinken çıkın."
- Sonra: hava sakinken ve rüzgâr karadan açığa esmiyorken çıkın; kara meltemi gece ve sabah erken açığa eser.
- `dont`: "Akşamüstü ya da gece" → "Akşamüstü, gece ya da şafakta".

Bütün rehberlerde `checked.note` "Bağımsız doğrulama: …" diye yenilendi. Adım sayıları ve `art` dizileri değişmedi.

## Yasak denetimi
Silah, patlayıcı, içki tarifi, ilaç dozu yok. `note` gereken rehberlerde var: sap (Orman Kanunu), iki cihaz rehberi (şebeke gerilimi), kristal-2 (elektrik hattı), anten (KEGM/BTK, PMR446, TCK 132), yelken (boğulma, ADB), kıyı (boğulma).

## Doğrulanamayanlar
- Türkiye'de bugün çalışan orta dalga vericileri: TRT ve RTÜK sayfalarından liste alınamadı. Wikipedia yalnız Radyo 1 (927 kHz) ve Radyo Çukurova (630 kHz, Mersin-Kazanlı) frekanslarını anıyor; güncel durum bilinmiyor. Metin buna göre tutucu.
- Yönetmelik EK-2 (can yeleği zorunluluğu) ve 03.07.2026 tarihli değişiklik metni okunamadı.
- Yalnız alıcı anten için Türkiye'de ayrı izin hükmü bulunmadı (BTK sayfasında yok).
- Gece AM yayılımı, kazık derinliği (1 m+), kömür fırça, rulman sökme, kutu-çarpı dikişi, iskandil: genel bilgi, kaynakta görülmedi.

## Uzmana gidecek liste
1. Elektrik teknisyeni: 1 MΩ kaçak denetimi ölçü aleti ile yeterli mi; pil-ampul deneyicisi ile kaçak aranamayacağı ayrıca yazılmalı mı; kablo değiştirme adımı ayrı rehber olmalı mı.
2. Radyo amatörü / TRT verici mühendisi: Türkiye'de çalışan orta dalga vericileri listesi; 9 cm, 60 sarım bobinin 365 pF ile 531–1602 kHz bandını kapsayıp kapsamadığı.
3. Denizci / yelken eğitmeni: dümen küreği tarifi, yan salma, kıyı seyri; kayıtsız sal için hukuki durum (Liman Başkanlığı).
4. Hukukçu: dinleme sınırı (TCK 132 / 5809 EHK) ifadesi.
