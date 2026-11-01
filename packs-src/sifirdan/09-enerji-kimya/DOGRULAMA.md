# 09-enerji-kimya — bağımsız doğrulama raporu

Tarih: 2026-11-02. Paket: `sifirdan-enerji-kimya`, 38 rehber, 4 kategori.
Denetim: `npx -y tsx tools/check-sifirdan.ts 09-enerji-kimya` → "hata yok". `tsc --noEmit` temiz.

Not: Denetim betiği klasör adını ister (`09-enerji-kimya`). Tam yol verilince hiçbir paketi seçmeden "hata yok" der; yazım aşamasındaki denetim bu yüzden boşa çalışmış olabilir.

Kullanılan arama: 11 WebSearch. mevzuat.gov.tr robots engeli yüzünden açılamadı. Kanun metinleri ikincil kaynaklardan okundu: AYM kararı, alomaliye.com yönetmelik metinleri.

## Sayım
- DÜZELTİLDİ: 22
- TEYİTLİ: 1
- ZAYIF KALDI: 15. Bu turda kaynakları yeniden açılmadı; yalnız güvenlik ve tutarlılık için okundu, sayılar hesapla denetlendi.
- ÇIKARILDI: 0

## Rehber başına sonuç

### Elektrik (öncelikli)
- **sf-ek-kablolama: DÜZELTİLDİ.** Kesit yalnız voltaj düşümüne dayanıyordu (Victron tablosu ve ÷3 kuralı). Kısa hatta bu hesap tehlikeli derecede ince kablo verir. Örnek: 1 m toplam hatta 60 A için formül 4 mm² verir, ama 4 mm² yaklaşık 28 A taşır. IEC 60364-5-52 akım taşıma tablosu (bakır, PVC, B2 yöntemi, 30 °C, tutucu değerler) eklendi. "İki sınama yap, kalın olanı al" kuralı ve sıcak ortamda ya da demet halinde bir üst kesit uyarısı eklendi. Sigorta seçimi kabloyu koruyacak biçimde yeniden yazıldı: yük ×1,25 ≤ sigorta ≤ kablonun ısınma sınırı. Sigortanın voltaj değeri ve lityumda kesme kapasitesi (Victron) eklendi. Sigorta hattın başına konur; korumasız kablo "birkaç karışı" geçmemeli. 10 adım korundu, `art` yeniden hizalandı. Not: Türkiye'de Lisanssız Elektrik Üretim Yönetmeliği ve bağlantı anlaşması eklendi.
- **sf-ek-invertor: DÜZELTİLDİ.** Örnek "90 A → 35 mm²" idi. Bu, ÷3 kuralının sınırı içinde kalıyor; ama 125 A sigortayı boru içindeki 35 mm² kablo (≈110 A) korumaz. "Sigorta ≈ akım ×1,25 → ısınma tablosunda bu sigortayı taşıyan kesit" kuralı eklendi; örnek 90 A → 125 A → 50 mm² oldu. Not: geri beslemede yangın riski ve bağlantı anlaşması eklendi.
- **sf-ek-pil-paketi: DÜZELTİLDİ.**
  - Yangın adımında eski ifade şuydu: "duman çıkaran paketi açık havaya atın; çevresini suyla soğutun". Yeni ifade itfaiye kaynaklarına (FDNY, NY DHSES) dayanıyor: dokunmayın, taşımayın, söndürmeye çalışmayın, herkesi çıkarın, kapıyı kapatın, 112'yi arayın. Su ve söndürücü her zaman yetmez. Paket günler sonra yeniden tutuşabilir; soğuyunca kürekle dışarı çıkarılmalı.
  - Hücre türleri eklendi: Li-ion 4,2 V, LFP 3,65 V (BU-205). "4,2 V şarj cihazı" tek başına LFP hücrede aşırı şarjdır.
  - Türleri karıştırma tehlikesi eklendi: LFP ile Li-ion, lityum ile NiMH ya da kurşun asit. Zayıf hücre aşırı dolar ve aşırı boşalır (BU-302). Paralelde önce voltaj eşitlenmeli. Gece boyu şarj yasağı eklendi.
  - 2 V eşiği korundu; BU-808a'nın 1,5 V eşiğinden daha tutucudur. İki haftalık bekletme testi tek ve kişisel bir kaynaktan geliyor; zayıf.
- **sf-ek-aku: DÜZELTİLDİ.**
  - Voltaj ve şarj tablosu kaynağıyla birebir teyit edildi.
  - Eklenenler: hidrojen ve oksijen patlaması, açıktaki plakanın üstünde gaz birikmesi ve "plakalar açıkken şarj etme" uyarısı, sıvı eklerken gözlük ve eldiven, "aküye asit eklemeyin", ciltte nötrleştirme yapmama.
  - Kaynak olarak iki üniversite güvenlik föyü eklendi (UC ANR, WVU).
- **sf-ek-gunes-baglanti, sf-ek-sarj-kontrol, sf-ek-pedal-jenerator, sf-ek-alternator: ZAYIF KALDI.** Kaynaklar yeniden açılmadı. Hesaplar doğru; tehlikeli eksik bulunmadı.
- **sf-ek-termoelektrik: DÜZELTİLDİ.** Yanık, yangın ve karbonmonoksit için `note` eklendi. Sayılar yeniden doğrulanmadı.

### Su ve rüzgâr
- **sf-ek-su-carki, sf-ek-su-degirmeni, sf-ek-koc-pompasi: DÜZELTİLDİ (yalnız yasal not).** DSİ notu Su Tahsisleri Hakkında Yönetmelik'e (RG 10.12.2019/30974) dayandırıldı. Teknik içerik yeniden açılmadı; örnek hesaplar doğru.
- **sf-ek-mikro-hidro: DÜZELTİLDİ.** Anlaşılmaz kablo adımı yeniden yazıldı ve kablolama rehberindeki iki sınamaya bağlandı. DSİ ve şebeke bağlantısı notu güncellendi.
- **sf-ek-el-pompasi: DÜZELTİLDİ.** Yeni `note`: kuyuya inme yasağı ve 167 sayılı Kanun md. 8. DSİ belgesi DSİ'nin belirlediği derinliği aşan kuyular içindir; elle açılan kuyular hariçtir.
- **sf-ek-ruzgar-turbini: TEYİTLİ.** Wikipedia Small wind turbine yeniden açıldı. Doğrulananlar: 150 m içindeki engellerin en az 9 m üstü, yaklaşık 4 m/s devreye girme hızı, çatıya kurulumun sorunları, dirençli boşaltma yükü.
- **sf-ek-yel-degirmeni: ZAYIF KALDI.**

### Kimya
- **sf-ek-kimya-guvenlik: DÜZELTİLDİ.** Göz yıkama süresi "15–20 dk" idi; "en az 30 dk" oldu (CDC ATSDR, sodyum hidroksit). Ayrıca:
  - "Bir şişe su" yerine yaklaşık 20 litrelik, akıtılabilen su kaynağı yazıldı.
  - Kontakt lens, göz doktoru ve asidi suya ekleme uyarıları eklendi.
  - Spec'teki çizim etiketleri güncellendi.
- **sf-ek-kirec: DÜZELTİLDİ.**
  - Yeni 1. adım: koruyucu donanım, sönmemiş kireci çıplak elle tutmama, 30 dk göz yıkama. `art` başına null eklendi.
  - Ocağın CO₂ ve CO çıkardığı uyarısı eklendi.
  - Yasal not 6831 md. 76 metnine göre yazıldı (AYM kararı) ve valiliklerin 4 km yasağı eklendi.
  - Sayılar Lime kiln sayfasından teyitli.
- **sf-ek-potas: DÜZELTİLDİ (not).** %10 verim ve yöntem teyitli. Nota 30 dk göz yıkama eklendi.
- **sf-ek-biyogaz: DÜZELTİLDİ.**
  - Eklenenler: depoyu hiç boşaltmama ve vakumla hava almama (patlayıcı karışım riski), eğimli boru ve su tuzağı, H₂S'nin metali aşındırması, H₂S ile CO₂'nin havadan ağır olup çukurda birikmesi.
  - Alev geri tepmesi için önce hazır alev tutucu önerildi; su kilidi yedek seçenek oldu ve su seviyesinin her gün denetlenmesi eklendi.
  - Penn State verileri yeniden teyit edildi.
- **sf-ek-odun-gazi: DÜZELTİLDİ.** ORNL-6404 baştan sona yeniden teyit edildi. Eklenenler: çalıştırmadan önce fanla kalan gazı boşaltma (patlama), alevle denemeyi fan çıkışında yapma, durdurunca hazne kapağını kapatma, külü 65 °C'nin altına inmeden atmama.
- **sf-ek-odun-komuru: DÜZELTİLDİ.** Bitiş belirtisi FAO'ya göre "örtünün baştan sona çökmesi" oldu; duman rengi ikincil belirti. Büyük çukurda soğuma "günlerce" yerine "haftalarca (FAO 30–50 gün)" oldu. Açarken su bulundurma eklendi. Yasal not güncellendi.
- **sf-ek-mum: DÜZELTİLDİ.** "Küçük bir ısıtıcı kadar ısı" yanıltıcıydı; mum yaklaşık 80 W verir. "Odayı ısıtmaz" diye düzeltildi. `note` eklendi.
- **sf-ek-alci: DÜZELTİLDİ (not).** Plaster sayfası teyit edildi. Yanık vakası için `note` eklendi.
- **sf-ek-yag, sf-ek-kagit, sf-ek-aktif-komur: DÜZELTİLDİ (not).** Botulizm, kül suyu ve "filtre mikrop gidermez" notları eklendi. İçerik yeniden açılmadı.
- **sf-ek-cam: DÜZELTİLDİ.** Şişe kesmeye gözlük ve eldiven eklendi.
- **sf-ek-tuz, sf-ek-murekkep, sf-ek-fermantasyon: ZAYIF KALDI.** Fermantasyonda içki yasağı ve metanol uyarısı mevcut.

### Basit makineler
- **sf-ek-kaldirac, sf-ek-palanga, sf-ek-rampa, sf-ek-bocurgat, sf-ek-agirlik-sarkac, sf-ek-camasir, sf-ek-zir: ZAYIF KALDI.** Sayılar fizik hesabıyla tutarlı; kaynaklar yeniden açılmadı.

## Önce → sonra (seçme)
1. **Kablolama, kesit:** Önce yalnız "kesit = 0,0175 × boy × akım ÷ 0,3" ve "≤5 m ise akım ÷ 3" vardı. Sonra iki sınama var: voltaj kaybı ve ısınma tablosu (1,5→15, 2,5→21, 4→28, 6→36, 10→50, 16→68, 25→89, 35→110, 50→134 A); büyük olan seçilir. Örnek: 60 A, 1 m → 16 mm².
2. **Kablolama, sigorta:** Önce "Sigorta değeri kablonun taşıyabileceği akımdan büyük olmasın; tek cihaz varsa cihazın akımına göre seçin." Sonra "Yük ×1,25 ≤ sigorta ≤ kablonun ısınma sınırı; sigorta tutmuyorsa kabloyu kalınlaştırın; voltaj değeri ve lityumda kesme kapasitesi; hattın başında, korumasız kablo birkaç karış."
3. **İnvertör:** Önce "90 A → 35 mm²". Sonra "90 A → 125 A sigorta → 50 mm²".
4. **Lityum yangını:** Önce "Duman çıkaran paketi açık havaya … atabiliyorsanız atın … Çevresini bol suyla soğutun." Sonra "Dokunmayın, taşımaya ve söndürmeye çalışmayın … herkesi çıkarın, kapıyı kapatın, 112 … günler sonra yeniden alev alabilir."
5. **Lityum şarjı:** Önce "4,2 V'u geçmeyen uygun bir lityum şarj cihazı". Sonra "Türü öğrenin: Li-ion 4,2 V, LFP 3,65 V; LFP'yi 4,2 V cihazda doldurmak aşırı şarjdır; türleri karıştırmayın."
6. **Göz yıkama (kimyasal güvenlik, kireç, potas):** Önce "en az 15–20 dakika". Sonra "göz en az 30 dakika, cilt en az 15 dakika".
7. **Biyogaz, alev geri tepmesi:** Önce "alev geri tepmesini önleyen bir su kabı". Sonra "hazır alev tutucu; yoksa su kilidi, suyu her gün kontrol; depoyu hiç boşaltmayın, hava girerse patlayıcı karışım".
8. **Odun kömürü, soğuma:** Önce "büyük ocakta günlerce". Sonra "büyük çukurda haftalarca (FAO 30–50 gün)".
9. **Mum:** Önce "küçük bir ısıtıcı kadar ısı verir". Sonra "yaklaşık 80 W … odayı ısıtmaya yetmez".
10. **Yasal notlar:** Önceki notlar genel ifadelerdi. Şimdi şunlara dayanıyor:
    - 6831 md. 76 (ormanda izinli ocak dışında ateş) ve valiliklerin 4 km yasağı;
    - Su Tahsisleri Hakkında Yönetmelik (DSİ tahsisi, 2019);
    - 167 sayılı Kanun md. 8;
    - Lisanssız Elektrik Üretim Yönetmeliği (bağlantı anlaşması).

## Uzmana gidecek liste
1. **Elektrik mühendisi:**
   - Isınma tablosu: IEC B2 değerleri DC 12/24 V'ta tutucu kabul edildi. Esnek, ince telli kablo ve 70–90 °C yalıtım için üretici tablosu farklı olabilir.
   - Sigortanın aküye uzaklığı için sayısal kural doğrulanamadı (ABYC 7 inç); metinde "birkaç karış" yazıyor.
   - ×1,25 sigorta payı yükler için genel kabul olarak kullanıldı.
2. **Lityum:**
   - İki haftalık kendi kendine boşalma testi ve 2 V eşiği tek bir kişisel kaynağa dayanıyor.
   - Yangından sonra kalıntıya ne kadar süre dokunulmayacağı için sayı verilmedi.
   - İtfaiyenin olmadığı senaryoda suyla soğutmanın yeri tartışmalı. Kaynaklar suyun yetmeyebileceğini söylüyor; metin "yaklaşmayın" yönünde.
3. **Biyogaz:** Ev ölçeğinde alev tutucu ve su kilidi tasarımı (su derinliği), H₂S filtresi, gübre:su oranı.
4. **Mevzuat (hukukçu):**
   - Kireç ve kömür ocağı kurmaya özgü 6831 maddesi okunamadı.
   - Dereden küçük ölçekli (ev, değirmen) su kullanımında DSİ tahsisinin kapsamı netleştirilmeli.
   - mevzuat.gov.tr asıl metinleri kontrol edilmeli.
5. **Alternatör:** Bağlantı uçları araç tipine göre değişir.
6. **ZAYIF KALDI işaretli 15 rehber:** Kaynakları çoğunlukla Wikipedia. En az birer birincil kaynakla (FAO, üniversite yayımı) yeniden doğrulanmalı. Öncelik: tuz (acı su), mürekkep (2:1 oranı), fermantasyon, alternatör.
7. **Kireç ocağı:** CO₂ ve CO birikimi uyarısı kimyadan türetildi; ayrı kaynak bulunamadı.

## Bellek veya proje notu
Yok.
