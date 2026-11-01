# Çizim incelemesi — 04-su-dezenfeksiyon (batch si-04)

35 rehber ve 4 kategori kapağı incelendi. Toplam 105 farklı sahne vardı; `sf-sd-icilmez-etiket` iki rehberde kullanılıyor ve bir kez sayıldı.

## Sonuç
- İYİ: 84
- ZAYIF: 16 (hepsi yeniden çizildi ya da düzeltildi)
- KÖTÜ: 5 (4'ü yeniden çizildi, 1'inin yerine başka bir sahne kondu)
- null yapılan: 0

Kontroller:
- Derleme: 0 uyarı, 0 hata. Paket artık 104 çizim içeriyor.
- `check-sifirdan`: hata yok.

## KÖTÜ → düzeltildi
- **sf-sd-kuyu-klor-dokme:** Kova adamın ellerinden kopuk, havada asılı duruyordu. Artık kova iki elde tutuluyor ve kuyu ağzının üstünde eğik; çözelti ağzından kuyuya akıyor.
- **sf-sd-ust-su-aktarma:** Eğik kap, kova değil eşkenar dörtgen gibi görünüyordu. Artık gerçek kova oranlarında, saplı ve "2" numaralı. Çamur kovanın dibinde kalıyor, berrak su "3" numaralı kaba akıyor. Eller kovanın dibinde ve ağzında.
- **sf-sd-coklu-bariyer** (su-ozet 1. adım): Beş simgeli soyut şema, adım metniyle uyuşmuyordu. Metin "kaynağı koruyun… tuvalet 30 m uzakta" diyor. Yerine `sf-sd-kuyu-mesafe` (kuyu ile tuvalet, "30 m") kondu. Eski sahne ve spec satırı silindi.
- **sf-sd-kapak-dezenfektan:** Havada süzülen sarı eldiven bir el işareti gibi okunuyordu. Eldiven kaldırıldı.
- **sf-sd-bas-atma:** Ok, büyük kavanozdan küçük kavanoza doğru gidiyordu; sıra ters ve anlaşılmazdı. Yeni çizimde damla "BAŞ" yazılı bir çay bardağına düşüyor ve bardağın yanında kırmızı çarpı var. Sonrası için boş "İÇİLMEZ" kavanozu yanda bekliyor. Bu çizim metindeki "en az bir çay bardağı" ifadesiyle de örtüşüyor.

## ZAYIF → düzeltildi
- **kaynak-bitki:** İşaret eden kol el sallıyor gibiydi. Artık kol düz ve ağaç şeridine uzanıyor.
- **kaptaj-duvar:** Anlamsız turuncu ok kaldırıldı.
- **kuyu-havalandirma:** İp ustanın elinden kopuktu. Artık ip elden başlıyor.
- **kuyu-ark:** Ölçü oku arkın altında havada duruyordu ve turuncu okla çakışıyordu. Ölçü oku artık ark boyunca; turuncu ok kaldırıldı.
- **yagmur-depo:** Kova beton tabanın altına, toprağa gömülmüş gibiydi. Musluk yükseltildi; kova artık tabanın üstünde duruyor.
- **sarnic-kesit:** Taşma borusu sarnıcın dibine iniyordu, oysa metin "uzağa akıtın" diyor. Boru artık dışarı, uzağa gidiyor; sinek teli ve mavi akış oku eklendi.
- **omuz-sirigi:** Yan görünüşte sırık boynun içinden geçiyordu. Sahne önden yeniden çizildi: sırık iki omzun üstünde ve ensenin arkasında, eller sırığı tutuyor, iki uçta eşit bidon.
- **yosun-yasak:** Diz çökmüş kadın çarpıktı ve bacağı kadraj dışındaydı. Kişi kaldırıldı. Şimdi yosunlu gölet, büyük ölü balık ve yasak işareti var.
- **biokum-cikis:** Metin "kapaklı kap" diyordu, çizimde açık kova vardı. Yerine dar ağızlı sarı bidon kondu; bu, taşıma rehberindeki bidonla aynı.
- **havuz-filtre-kesit:** Üstündeki "1 m / 1 m" ölçüleri 3. ve 4. adımların bilgisiydi. Sahne 2. adımdan 3. adıma (1 m kum) taşındı; 2. adım çizimsiz kaldı. Metindeki "3–4 kat" için çakıl üç kata çıkarıldı.
- **kapak-dezenfeksiyon:** Kapakta anlamsız duran yeşil onay kaldırıldı.
- **imbik-kesit:** Güneş ışınları kalın sopalara benziyordu. Kesik çizgili ince ışınlarla değiştirildi.
- **jilet-makas:** Metin "kapalı tencerede bekletin" diyordu, çizimdeki tencere kapaksızdı. Kesitli tencereye kapak eklendi.
- **kul-suzme:** Eldeki kap çok küçüktü. Kap büyütüldü.
- **farkli-sise:** "Doğru" diye gösterilen şişe bir içki şişesine benziyordu ve metinle çelişiyordu. Yerine köşeli, saplı bidon kondu; üstünde kırmızı bant ve kafatası var.
- **kilitli-dolap:** Kızın elleri dolabın hizasına çıkıyordu, yani dolaba yetişiyor gibiydi. Kız küçültüldü ve dolabın yanına alındı; uzanıyor ama yetişemiyor.

## Dosya değişiklikleri
- `guides.ts`: iki `art` dizisi değişti.
  - su-ozet: 1. adıma `sf-sd-kuyu-mesafe` kondu.
  - kum-filtre-3: kesit sahnesi 2. adımdan 3. adıma taşındı.
- `spec.ts`: değişen 18 sahnenin açıklaması çizime göre güncellendi; `sf-sd-coklu-bariyer` silindi.

## Kalan küçük notlar
- Kilitli dolap sahnesinde kız yüksekliğin yaklaşık %55'i. Dolap ile arasındaki farkın görünmesi için bilinçli olarak küçük tutuldu.
- Kitte koruyucu gözlük olmadığından kişilerdeki "göz koruyucu" hâlâ normal gözlük olarak çiziliyor. Bu durum kireç ve elektroliz rehberlerini etkiliyor.
