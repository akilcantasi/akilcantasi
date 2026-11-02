# Çizim incelemesi — sifirdan-mutfak-beslenme (batch si-13)

2026-11-02 · Dosya: `scenes-a.tsx` · İncelenen: 74 çizim (3 kapak + 71 adım)

## Sayılar
- İYİ: 56 (dokunulmadı)
- ZAYIF: 13 (12'si yeniden çizildi, 1'i null yapıldı)
- KÖTÜ: 5 (hepsi yeniden çizildi)
- Son durum: 73 çizim, hepsi İYİ. Derleme 0 uyarı, `check-sifirdan` "hata yok".

## Özel kontrol: refeeding-izlem (adım 8)
Adım metni "Her sabah dinlenirken dakikadaki nabzı ve nefes sayısını sayıp yazın" diye başlıyor. Yani "bilekten nabız sayma" metne uyuyor, ödem testine dönmeye gerek yok. Ama eski çizim KÖTÜ'ydü: bakıcının bütün eli hastanın avucunu kaplıyordu, el sıkışma gibi okunuyordu, nabız dalgaları da başparmak ucundaydı. Yeniden çizildi: hastanın önkolu avuç yukarı. Bakıcının işaret ve orta parmak uçları bilekte, başparmak tarafında. Bilekte kırmızı dalgalar, köşede "1 dk" kronometresi var.

## KÖTÜ → yeniden çizilen
- **sf-mb-emzirme:** Yerde su bardağı vardı, oysa metin "su bile vermeyin" diyor. Bebeğin yüzü ters dönmüş, ağlar gibiydi. Yeni çizim: sandalyede oturan, giyinik anne bebeği göğsüne yaslı kucaklıyor (ölçülü). Köşe kartında su ve çay bardağı kırmızı çarpıyla, yanında "ilk 6 ay" etiketi.
- **sf-mb-odem-test:** Ayaklar taban gibi düz levhalardı, başparmak yerine yumruklar vardı. Yeni çizim iki panel, yandan ayak: solda başparmak ayak üstüne bastırıyor ("3 sn"); sağda parmak kalkmış, ayak üstünde çukur ve turuncu halka.
- **sf-mb-cocuk-tabak:** Çizim adım 6'yla (hayvansal besin) uyuşmuyordu; tanınmayan sarı ve yeşil lekeler vardı. Yeni çizim: lapa üstünde yarım haşlanmış yumurta ve doğranmış ciğer/et, yanında yoğurt kasesi.
- **sf-mb-isik-yakin:** Su dolu şişe güneş ışığının içindeydi; metnin yangın uyarısına ters düşüyordu. Kollar da masaya düz uzanmıştı. Yeni çizim: pencere ışığında kâğıda kalemle büyük harflerle yazan kadın. Şişe yok.
- **sf-mb-refeeding-izlem:** Yukarıda anlatıldı.

## ZAYIF → yeniden çizilen
- **muac-orta-nokta:** Figür küçüktü, ip gövdenin üstündeydi. Yeni çizim: bel üstü büyük plan; ip kolun arkasında, omuz ucundan dirsek ucuna gidiyor; kırmızı orta nokta işareti var.
- **bardakla-besleme:** Bardak büyüktü ve dudağa değmiyordu. Yeni çizim: küçük bardak eğik, bebeğin alt dudağında; bebek biraz daha aşağıda, annenin yüzü görünüyor.
- **kurbaga-pismis:** Büyük yasak işareti pembe iç kısmı örtüyordu. Köşeye kırmızı çarpı kondu, kesit büyütüldü.
- **palamut-kahve:** Kaşık ve çaydanlık havada süzülüyordu. Yeni çizim: el kaşıktaki öğütülmüş palamudu buharı tüten bardağa döküyor. Çaydanlık kaldırıldı.
- **kusburnu-tulbent:** Kepçe havadaydı. Sapı çerçeve dışına uzatıldı.
- **iskorbut-belirti:** Uzuv tanınmıyordu. Ayağı ve paçası olan baldıra çevrildi.
- **filiz-bez:** Alt kat bez belirginleştirildi.
- **misir-kul, tuz-alma:** Havadaki testiyi artık kulpundan tutan bir el var (kadro kolu).
- **ayak-kontrol:** Bükülmüş, karışık oturuş vardı. Yeni çizim: ayak tabanı yakın planı, yara büyüteç altında ve turuncu halkalı.
- **igne-deligi:** Kol kopuk, kitap havadaydı. Yeni çizim: tam boy kadın, bir eliyle delikli kartı gözünde tutuyor, öbür eliyle kitabı.
- **tuzlu-su-calkalama:** Eski çizim "su içiyor" diye okunuyordu. Yeni çizim: bir bardak ılık su, el yarım çay kaşığı tuzu döküyor, "½ çay kaşığı" etiketi.

## Null yapılan
- **sf-mb-protein-belirti** (protein-acligi adım 1): "et yiyen adam" diye okunuyordu; belirtiler çizimle anlatılamıyor. `art` null yapıldı, sahne ve spec satırı silindi.

## Kontrol edilen hassas noktalar
- İlaç ya da ilaç kutusu hiçbir sahnede yok.
- Bebek sahneleri giyinik ve ölçülü. Beslenme bardakla gösteriliyor, biberon yalnız çarpıyla.
- Zayıf çocuk tam boy çizilmedi.

## spec.ts
Değişen 16 sahnenin açıklaması güncellendi, `sf-mb-protein-belirti` satırı silindi. guides.ts'te yalnız protein-acligi `art[0]` değişti.
