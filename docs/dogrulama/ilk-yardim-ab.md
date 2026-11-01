# Bağımsız doğrulama — parti `ilk-yardim-ab`

Tarih: 2026-11-01
Dosya: `src/content/guides/ilk-yardim.ts`

Not: Bu turda web arama kotası (WebSearch) daha ilk sorguda dolmuştu. Doğrulama doğrudan açılan resmi sayfalarla (WebFetch) yapıldı: RCUK 2025 First Aid, RCUK 2025 Paediatric BLS, RCUK 2025 Adult BLS, AHA 2025 Adult BLS, NHS Anaphylaxis, NHS Asthma attack, American Red Cross Shock, St John Ambulance WA Electric shock. ERC 2025 First Aid tam metni (resuscitationjournal.com) ile St John UK, NHS elektrik çarpması ve NHS şok sayfaları açılamadı. Türk kaynaklarına (AFAD, Kızılay, Sağlık Bakanlığı, MEB) bu turda erişilemedi. Bu yüzden Türkçe eğitim materyaliyle birebir karşılaştırma yapılmadı. `sources` alanlarında yalnızca gerçekten açılan kaynaklar bırakıldı.

---

## 1. hava-yolu-tikanmasi (yetişkin ve 1 yaş üstü çocukta boğulma)

**Doğrulanan:** 5 sırt vuruşu ile 5 karın basısı dönüşümlü uygulanır (RCUK 2025 First Aid, AHA 2025). Çocukta öne eğme, yumruğun göbekle göğüs kemiği ucu arasına konması ve içeri-yukarı çekme doğru (RCUK Paediatric BLS). Körlemesine parmak sokulmaz (RCUK, AHA "Class 3: Harm"). Bilinç kaybında TYD başlanır. Karın basısından sonra sağlık kontrolü gerekir (RCUK First Aid).

**Değişiklikler:**
- Adım 9: "…kişi sağlık kontrolünden geçmeli." (emir kipi değildi) → "Karın basısı yaptıysanız cisim çıksa bile kişiyi doktora gösterin."
- Yapmayın 3: "Hamile ya da çok kilolu kişide…" → "İleri hamilelikte ya da kollarınızla belini saramadığınız kişide…". AHA 2025 ölçütü budur: ileri hamilelik ya da karnın kollarla sarılamaması.
- `sources` ve `checked` güncellendi.

**Belirsiz kalan:** ERC 2025 tam metni okunamadı. RCUK, ERC'nin İngiltere uyarlamasıdır; aynı sıra beklenir ama doğrudan doğrulanamadı. Bilinçsiz çocukta RCUK 5 kurtarıcı nefesle başlamayı öneriyor, adım 8 ise yalnızca "kalp masajı" diyor. Çocuk için ayrı bir not eklenip eklenmeyeceğine bir uzman karar vermeli.

**Resim sorunları:**
- Adım 3, `ilk-yardim-sirt-vurusu`: Kurtarıcı yanda ya da hafif arkada değil, tam arkada duruyor. Eli yumruk gibi kalkmış, ok enseye ya da başa doğru gidiyor. Olması gereken: kurtarıcı yanda ve hafif arkada, bir eli göğüsten destekliyor, açık elin topuğu iki kürek kemiği arasına iniyor.
- Adım 6, `ilk-yardim-karin-basisi`: Kazazede neredeyse dik duruyor; metin "öne eğip" diyor. Olması gereken: kazazede belirgin biçimde öne eğik.
- Tehlikeli resim yok.

## 2. ilk-yardim-bebek-bogulma

**Doğrulanan (RCUK 2025 Paediatric BLS):**
- Bebek önkol üzerinde yüzüstü, kol bacağa dayalı, baş göğüsten aşağıda; 5 sırt vuruşu.
- Sırtüstü dizlerin üzerinde, iki başparmakla sarma tekniğiyle 5 göğüs basısı (masaja göre daha kısa ve sert).
- Dönüşümlü sürdürme; ağlama ya da öksürme başlayınca durma.
- Yalnızca açıkça görülen cisim tek hareketle çıkarılır.
- Bilinç kaybında 5 kurtarıcı nefesle TYD.

Bebekte karın basısı yapılmaz.

**Değişiklikler:** Metin doğru bulundu; yalnızca `sources` ve `checked` güncellendi.

**Belirsiz kalan:** AHA 2025'in bebekte yabancı cisim için önerdiği göğüs basısı tekniği (tek el topuğu ya da iki başparmak) okunamadı. Metin, Türkiye'de esas alınan ERC/RCUK çizgisini izliyor.

**Resim sorunları:** Ciddi sorun yok. Adım 6'da (`ilk-yardim-bebek-gogus-basisi`) ellerin göğsü sardığı ve başparmakların göğüs kemiğinde olduğu daha net çizilebilir.

## 3. ilk-yardim-suda-bogulma

**Doğrulanan (RCUK 2025 First Aid ve Paediatric BLS):**
- Eğitimsiz kişi suya girmez.
- Karada ya da teknede, yanıt vermeyen ve nefes almayan kişiye önce 5 kurtarıcı nefes, sonra standart TYD.
- OED, göğüs kurulandıktan sonra takılır.
- 30:2 oranı ve nefes veremeyen için kesintisiz bası (RCUK Adult BLS).

**Değişiklikler:** Metin doğru bulundu; `sources` ve `checked` güncellendi.

**Belirsiz kalan:** "Saatler sonra nefes sorunu çıkabilir" ifadesi bu turda açılan kaynaklarda doğrudan geçmiyor. Klinik olarak bilinen bir durum ama uzman onayı iyi olur.

**Resim sorunları:**
- Adım 6, `ilk-yardim-kurtarici-nefes`: Rozette "2" yazıyor, metin ise "önce 5 kurtarıcı nefes" diyor. Bu adımda rozet "5" olmalı; ya da ayrı bir resim kullanılıp "5" ile "30:2" birlikte gösterilmeli.
- Adım 9, `recovery-position`: Örtü ya da kurulama görünmüyor (küçük eksik).

## 4. ilk-yardim-elektrik-carpmasi

**Doğrulanan (St John Ambulance WA):**
- Önce elektrik kesilir.
- Kazazedeye dokunmadan kuru, yalıtkan bir şeyle (kuru tahta süpürge sapı) ayrılır.
- Yanık 20 dakikaya kadar suyla soğutulur, hafif ve yapışmaz bir örtüyle kapatılır.
- Düşmüş kabloya en az 8 m yaklaşılmaz; Birleşik Krallık'taki öneri 18 m. Kılavuzdaki 20 m ihtiyatlı ve uygun.

TYD için RCUK Adult BLS esas alındı.

**Değişiklikler:**
- Adım 2: "Elektrik kesilemiyorsa…" → "Ev elektriğinde akım kesilemiyorsa…". Yüksek gerilim uyarısı adım 3'te geldiği için, okuyan kişi tahta sopayla yüksek gerilimdeki kazazedeye gitmeye kalkabilirdi.
- `sources` ve `checked` güncellendi. Kaynaklardan "Türk Kızılay" çıkarıldı, çünkü bu turda açılamadı.

**Belirsiz kalan:** Türkiye'deki dağıtım şirketleri ya da TEDAŞ için tavsiye edilen mesafe ve ihbar numarası (186 arıza hattı) doğrulanmadı. Eklenirse önce doğrulanmalı.

**Resim sorunları:**
- Adım 2, `ilk-yardim-elektrik-tahta-sopa`: Kazazedenin duruşu tuhaf; ayakları prize doğru havada duruyor. Olması gereken: kazazede yerde yatıyor ve kabloya değiyor, kurtarıcı kuru bir zemin üzerinden kabloyu ya da uzvu sopayla itiyor.
- Diğer resimler uygun.

## 5. ilk-yardim-sok

**Doğrulanan (American Red Cross):**
- Belirtiler: hızlı ve zayıf nabız, hızlı nefes, soluk-gri-soğuk-nemli cilt, susama, huzursuzluk ya da bilinç bulanıklığı.
- Sırtüstü yatırılır; travma yoksa ayaklar 15–30 cm (6–12 inç) kaldırılır, kişi nefes için başka bir pozisyon istemiyorsa.
- Örtülür, yiyecek ve içecek verilmez, kişi sakinleştirilir.
- Bilinç azalırsa yan yatırılır.

Kanamaya doğrudan bası RCUK 2025 First Aid'den doğrulandı.

**Değişiklikler:** Metin doğru bulundu; `sources` ve `checked` güncellendi. Red Cross eklendi; ERC ve Kızılay çıkarıldı (bu turda açılamadılar). MEB/Sağlık Bakanlığı'nın "30 cm" ifadesi kaynakta "bu turda doğrudan açılamadı" notuyla bırakıldı.

**Belirsiz kalan:** ERC 2025 First Aid'in şokta bacak kaldırma konusundaki güncel tutumu okunamadı (2021'de "geçici olarak düşünülebilir" deniyordu). Türk eğitim materyalindeki 30 cm değeri doğrudan doğrulanamadı; Red Cross aralığının üst sınırıyla uyumlu.

**Resim sorunları:**
- Adım 1, `ilk-yardim-sok-belirti`: Kazazede oturuyor, oysa "Yapmayın" listesinde "oturtmayın" yazıyor. Olması gereken: belirtiler yatan kişide gösterilsin.
- Adım 6, `lie-cover-blanket`: Metin "altına ve üstüne battaniye" diyor, resimde yalnızca üstte örtü var (küçük eksik).

## 6. ilk-yardim-anafilaksi

**Doğrulanan:**
- RCUK 2025 First Aid: Oto-enjektör dış uyluğa yapılır. Kişi yatırılır; nefes güçlüğünde bacaklar uzalı oturtulur. 5 dakika sonra düzelme yoksa ikinci doz öbür bacağa yapılır.
- NHS: Talimat kalemin üzerinde yazar; hemen 999 (bizde 112) aranır; kişi düzelse bile ayağa kalkmamalı ve yürümemeli.

Kılavuzda doz yok.

**Değişiklikler:**
- Adım 2'ye "Kalem yoksa hemen 112'yi arayın." eklendi. Eski sırada kalemi olmayan biri için 112 ancak 5. adımda geçiyordu.
- `sources` ve `checked` güncellendi.

**Belirsiz kalan:** NHS, hamilelerde sol yana yatırmayı ve iğnesi kalmış arı sokmasında iğnenin çıkarılmasını da öneriyor; kılavuzda bunlar yok. Eklenip eklenmeyeceğine uzman karar vermeli.

**Resim sorunları:**
- Adım 4, `ilk-yardim-adrenalin-uyluk`: Kalem uyluğun üstüne yukarıdan dik bastırılıyor gibi görünüyor. Metin "uyluğun dış yan ortası" diyor. Olması gereken: kalem uyluğun dış yan yüzüne, yüzeye dik açıyla bastırılmış olsun.
- Diğer resimler uygun. Adım 6'daki pozisyonlar RCUK ile uyumlu.

## 7. ilk-yardim-astim

**Doğrulanan:**
- RCUK 2025 First Aid: Kişinin kendi rahatlatıcı inhaleri, varsa hazneyle kullanılır.
- NHS Asthma attack: Dik oturulur ve sakin kalınır; kişisel astım planına uyulur.
- NHS'e göre 999 (bizde 112) şu durumlarda hemen aranır: belirtiler kötüleşirse, en yüksek dozda düzelme yoksa ya da inhaler yoksa.

Doz verilmedi.

**Değişiklikler:**
- Adım 6: "…ya da fısfıs işe yaramıyorsa." → "…ya da yanında fısfısı yoksa." İnhaler olmaması durumu eksikti.
- Adım 7: "Fısfıstan sonra 5 dakika içinde düzelmezse 112'yi arayın." → "Fısfısı kullandığı hâlde kötüleşiyor ya da 5 dakika içinde düzelmiyorsa 112'yi arayın."
- `sources` ve `checked` güncellendi.

**Belirsiz kalan:** NHS süreye değil "en yüksek doza ulaşınca" ölçütüne bakıyor (mavi inhalerde 30–60 saniyede bir puf, en fazla 10 puf). Kılavuzdaki "5 dakika" Türk temel ilk yardım eğitiminden geliyor; bu turda doğrulanamadı. Puf sayısı kasıtlı olarak yazılmadı (doz yasağı). Bir uzman "5 dakika"yı onaylamalı.

**Resim sorunları:**
- Adım 2, `ilk-yardim-astim-fisfis`: Turuncu ok ağza değil göze doğru gidiyor. Olması gereken: ok ağızlığa ya da ağza işaret etsin.
- Diğer resimler uygun.

---

## Özet
- Kontrol edilen kılavuz: 7.
- İçerik değişikliği: 6 metin düzeltmesi (hava yolunda 2, elektrikte 1, anafilakside 1, astımda 2). Ayrıca 7 kılavuzun hepsinde `sources` ve `checked` güncellendi.
- Hiçbir resim null yapılmadı; tehlikeli resim bulunmadı.
- `npx vitest run tests/guides.test.ts`: 191 testin 191'i geçti.
