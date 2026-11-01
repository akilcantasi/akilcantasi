# ic-iy2: ilk yardım 2. yarı, bağımsız inceleme (2. tur, 2026-11-02)

Sahne dosyası: `src/art/scenes/ilk-yardim-2.tsx`. Spec: `src/art/spec/ilk-yardim.ts` (yalnızca aşağıdaki kimliklerin satırları). Rehber: `src/content/guides/ilk-yardim.ts` (yalnızca şeker düşmesi `art` dizisi).

İlk bakışta 48 çizim değerlendirildi (ortak `power-off` ve `call-112` dahil). Sınıflandırma ilk bakıştaki durumdur. Sonra ZAYIF ve KÖTÜ olanların hepsi yeniden çizildi ya da kaldırıldı, sonra son paftalar yeniden kontrol edildi.

| Rehber | İYİ | ZAYIF | KÖTÜ |
|---|---|---|---|
| bebek-bogulma | 0 | 4 | 1 |
| suda-bogulma | 3 | 1 | 1 |
| elektrik-carpmasi | 3 | 1 | 1 |
| sok | 4 | 1 | 0 |
| anafilaksi | 3 | 1 | 1 |
| astim | 3 | 2 | 0 |
| kalp-krizi | 3 | 1 | 0 |
| inme | 5 | 1 | 0 |
| seker-dusmesi | 2 | 2 | 0 |
| bayilma | 3 | 0 | 1 |
| **Toplam** | **29** | **14** | **5** |

## Yeniden çizilenler

### Ortak üreticiler
- `nefesScene` (`ilk-yardim-suda-nefes`), KÖTÜ idi. Yardımcının başı yaralının alnına biniyordu, el yoktu. Talimattaki kurtarıcı nefes kalıbıyla baştan çizildi:
  - yandan baş-omuz yakın planı (s 3);
  - yaralının başı geride, çenesi kalkık;
  - yardımcının başı profilden aşağı bakıyor, ağzı yaralının ağzında; iki profil ayrı;
  - uzak kol başın arkasından geliyor: el alında, başparmak ve işaret parmağı burnu sıkıyor;
  - yakın elin iki parmak ucu çene kemiğinin altında (IK ve ayrıntılı `Hand`);
  - göğüs üstünde yukarı ok ve "5".
- `kprScene` (suda, elektrik, astım, kalp krizi KPR'leri), ZAYIF idi: figürler küçüktü. s 1.25'ten 1.5'e büyütüldü. Oranlar ilk-yardim-1'deki yetişkin KPR ile aynı.
- `thumbsTop` (`bebek-gogus-basisi` ve `bebek-kpr-basparmak`), ZAYIF idi: eller karnı kaplıyordu. Önkollar ve avuçlar göğüs kafesinin yanlarına çekildi. İki başparmak meme hizasının hemen altında, göğüs kemiğinde birleşiyor. Not: `bebek-kpr-basparmak` bebek-kpr rehberinde de kullanılıyor.

### Bebekte boğulma
- 3, tutuş: kafa karıştıran kavisli ok kaldırıldı.
- 4, sırt vuruşu: "flat" el yumruk gibi okunuyordu. Yerine açık, avucu görünen, parmakları düz ayrıntılı el (`Hand open/palm`) kondu. Ok, elin topuğundan kürek kemiklerinin arasına iniyor.
- 5, çevirme: KÖTÜ idi, 3'ten ayırt edilemiyordu. Yeni `babyLapUp` çizildi:
  - bebek artık sırtüstü, yüzü yukarıda;
  - yardımcının önkolu üstünde, eli başının arkasında;
  - başı dizlere doğru ve aşağıda;
  - üstünde çevirme yönünü gösteren kavisli ok.

### Diğer rehberler
- Elektrik 3 (`elektrik-hat-uzak`), KÖTÜ idi: yardımcının kolu arkadaki kişinin başının içinden geçiyordu, metinde olmayan bir telefon da vardı. Yeni çizimde yardımcı halkanın dışında önden duruyor ve iki kolunu yana açmış. Bir eli tele doğru, öbür avucu arkadaki tek kişiye "dur" diyor.
- Şok 6 (`sok-battaniye`): yaralının üstüne emekleyen yardımcı kaldırıldı. Yaralı büyütüldü. Altta ve üstte battaniye var, iki ok duruyor.
- Anafilaksi 4 (`adrenalin-uyluk`), KÖTÜ idi: önden yerde oturan kadının ayakları tekerlek gibiydi. Yeni çizimde kadın önden sandalyede oturuyor; kalem dış uyluğa dik bastırılmış.
- Anafilaksi 6 (`anafilaksi-pozisyon`): metinde olmayan, ayak bileği altındaki yastık kaldırıldı.
- Astım 1 (`astim-oturus`): kenarda boş duran yardımcı kaldırıldı, kişi büyütüldü.
- İnme 6 (`inme-saat`): parmak ve 112 telefonu karışıktı. Yerine duvar saati ve "10:10" yazılan not kâğıdı ile kalemli el kondu.
- Şeker 1 (`hipo-belirti`): eller göğüste kenetliydi ve kalp krizi gibi okunuyordu. Eller şimdi iki yana açık ve titreme çizgili.
- Bayılma 1 (`bayilma-oturt`), KÖTÜ idi: kadın havada, görünmez sandalyede çömelmiş gibiydi. Yeni çizimde yere oturmuş, dizleri hafif bükük, eli alnında. Arkasında diz çöken yardımcı omzunu ve sırtını tutuyor.

## Null yapılan
- Şeker düşmesi 4 (`ilk-yardim-hipo-15dk`): soyut bekleme süresi (telefonda 15:00 ve bardak). `art` dizisinde null yapıldı; sahne ve spec duruyor.

## Kontroller
- `npx tsc --noEmit | grep scenes/ilk-yardim-2`: boş.
- `npx vitest run tests/guides.test.ts`: 191/191 geçti.
- 10 rehberin son paftaları yeniden çekilip görüldü: `/tmp/ic-iy2/sheets/`.

## Kalan şüpheler
- `suda-nefes`:
  - üst kenarda yardımcının kalçasından ince bir pantolon şeridi görünüyor;
  - uzak kolun dirseği başın üstünde kıvrık duruyor.

  Okunuyor ama kusursuz değil.
- Bebek göğüs basısı: eller şematik. Sırtı saran parmaklar çizilmedi; başparmaklar ve yanlardaki avuçlar okunuyor.
- Bebek çevirme: tek kareyle bir dönme anlatılıyor; ok yardımcı oluyor.
- Bayılma 2 (kas sıkma, üç panel): figürler küçük ama her panel tek hareket gösteriyor. İYİ sayıldı.
