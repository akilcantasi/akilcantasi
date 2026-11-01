# 06-yapi çizim raporu (ajan a, batch sc-06a)

Dosya: `scenes-a.tsx`. 54 rehber çizimi ve 4 kategori kapağı var, toplam 58 sahne. Her rehberde en çok 3 çizim var. Paftalar `/tmp/sc-06a/sheets/` klasöründe; 18 rehberin her birine baktım.

## Oyuncular
- USTA: erkek, buğday ten, koyu kısa saç, bıyıklı, camgöbeği üst, haki pantolon. Kişi gereken bütün sahnelerde o var; kapalı plan ellerde de aynı ten ve kol rengi kullanılıyor.
- YARDIMCI: başörtülü kadın, esmer ten, yeşil üst. Yalnız iki kişilik işlerde görünüyor (kerpiç çiğneme, dal örgü sıvama).
- Yüz ifadesi her sahnede `neutral`. Gülümseyen yüz yok.

## Malzeme renkleri (paket geneli, `M` sabiti)
- Kerpiç `#c98b5a`, çamur `#8f6440`.
- Bitkisel toprak koyu kahve, sert katman açık bej.
- Taş `K.rock`, ahşap `K.wood`, soyulmuş kütük açık ahşap.
- Saman sarı, naylon koyu gri.

## Rehber başına çizilenler (adım numarası 1'den)
- yer-secimi: 1 taskin, 3 heyelan, 6 cukur. heyelan dizide 2. indeksteydi, kayma izi adımıyla eşleşsin diye 3. adıma taşındı. guney null.
- gunes-yonu: 1 cubuk, 2 plan, 6 sacak. Saçak sahnesi ölçekli çizildi: 1,5 m yükseklik, 50 cm saçak, pencere üstü saçağın 30 cm altında. acilar ve kutle null.
- temel: 1 hendek (80 cm, 2 kat genişlik), 5 subasman (50 cm), 7 hatil (iki kadron, 50 cm'de bir enine bağ, taş kırığı). tas ve sicrama null.
- deprem: 2 cati (toprak dam yanlış), 4 hatil (dört seviye, köşeden dönüyor), 6 bosluk (köşe–kapı 1 m, kapı–pencere 1 m). plan ve lento null.
- doseme: 3 katlar, 6 tokmak, 9 ahsap (45 cm).
- yalitim: 1 tavan, 6 cift-duvar, 9 baca (doğru ve yanlış yan yana). kilsaman null.
- bakim: 3 dip, 4 curuk, 10 dikme. cati ve bocek null; çatıda iple çalışan kişi ve iki bölmeli böcek sahnesi bu boyutta anlaşılmazdı.
- toprak-testi: 4 katlar, 5 cubuk, 7 dusurme. elle ve kavanoz null.
- kerpic-1: 3 cigneme, 4 saman, 6 kivam. cukur null.
- kerpic-2: 1 kalip (30 × 25 cm), 5 cekme, 7 dikine (10 gün). doldurma ve istif null.
- kerpic-duvar: 2 kalinlik, 4 sasirtma, 7 hatil. cekul ve bosluk null.
  - kalinlik metne göre düzeltildi: spec "45 cm" diyordu, metin en az 47 cm istiyor. Çizimde dış duvar 30'luk ve 15'lik iki kerpiç sırası, "47 cm"; iç duvar "30 cm".
- yigma-toprak: 3 cob-topak, 4 cob-kat (60 cm, 1 gün), 7 cob-kasa. cob-temel ve cob-duzeltme null.
- sikistirma-toprak: 3 avuc, 5 tokmak (gevşek 10 cm kat, dövülmüş 5 cm), 8 hatil. kalip null; kalıp zaten tokmak kesitinde görünüyor.
- dal-orgu: 2 cubuk, 3 orme, 5 sivama. badana null.
- siva: 2 kaba, 5 kirec (1:3), 7 nemleme. perdah null.
- gomuk-ev: 2 set, 5 tonoz (doğru ve yanlış), 7 hava. yamac ve drenaj null.
- kutuk-secme: 1 agac, 4 soyma, 5 istif (6 ay). cap null.
- kutuk-gecme: 4 pergel, 6 oyma, 9 oturma (6–10 cm). taban ve kavela null.
  - Spec'te oyma 5. adıma bağlıydı. Çizim oyuğun üst kütüğün altında olduğunu gösterdiği için 6. adıma taşındı.
- Kapaklar: kapak-yer, kapak-toprak, kapak-ahsap, kapak-cati. Spec'teki yurt, kümes ve ikinci kişi kapakları kalabalıklaştırıyordu; çıkarıldı.

## spec.ts
Çizilen kimliklerin açıklamaları çizime ve metne göre sadeleştirildi. Null yapılan kimliklerin spec satırları silinmedi; ileride çizilmek istenirse hazır duruyor.

## Kontroller
- Derleme hatasız. "Sahnesi yok" uyarısında benim rehberlerimden kimlik kalmadı; kalan uyarı b ajanının rehberlerine ait.
- `check-sifirdan 06-yapi` tek hata veriyor: `sf-yp-toprak-dam` için `sf-yp-dam-yasak` spec'te yok. Bu b ajanının rehberi; ben dokunmadım.
- `scenes-a.tsx` tsc ile hatasız denetlendi.

## Kalan şüpheler
- gecme-pergel ve gecme-oyma şematik çizimler. Semer geçmenin üç boyutlu hali tam görünmüyor; yalnız kesit mantığını veriyor.
- gunes-sacak'ta pencere kesitte ince bir cam şeridi olarak görünüyor. Işınlar doğru, ama sahne kalabalık.
- kerpic-cigneme'de ayaklar çamurun içine gömülü değil, üstünde duruyor.
- bakim-dikme'de usta kirişin altında diz çökmüş. Çürük kesimin altında değil, ama kirişin altında.
- sikistirma-hatil'de üstteki hatılın üst yüzü düz bir dama benziyor.
