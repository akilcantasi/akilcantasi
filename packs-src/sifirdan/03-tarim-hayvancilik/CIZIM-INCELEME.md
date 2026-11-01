# Çizim incelemesi — 03-tarim-hayvancilik (batch si-03)

108 çizimi inceledim: 36 rehberdeki adım çizimleri ve 4 kategori kapağı. Her paftayı uygulama boyutunda açtım, şüpheli olanlara 600 px'te yakından baktım.

## Sınıflama (ilk bakış)
- İYİ: 93
- ZAYIF: 12
- KÖTÜ: 3

Zayıf ve kötü olan 15 çizimin hepsini yeniden çizdim ya da düzelttim. Son paftalarda hepsi İYİ. Null yapılan çizim yok.

## KÖTÜ → yeniden çizildi
- **sf-th-teras-kesit** (teras 5): İki basamaklı kesitte su okları yokuş yukarı gidiyordu, dolgunun ne işe yaradığı okunmuyordu. Yeni çizim tek basamağın yakın kesiti. Yamaca yatık taş duvarın arkasında çakıl dolgu, onun arkasında toprak var. Yağmur suyu dolgudan aşağı süzülüp duvarın dibinden çıkıyor (mavi oklar). Tek etiket: "çakıl".
- **sf-th-merkezi-lider** (budama-genç 3): "1/3" etiketi, kesim çizgisi ve kırmızı çarpı aynı noktada üst üste biniyordu; hangi dalın alınacağı belli değildi. Şimdi liderin ucunda turuncu "1/3" kesimi var. Rakip dik dal ayrı duruyor; dibinde kırmızı kesik, ucunda çarpı var.
- **sf-th-kirkim-oturtma** (kırkım 4): Koyun, yünden bir yığın ile çubuk bacaklardan ibaretti. Koyun yeniden çizildi: kalçası yerde, gövdesi geriye yatık, sırtı kırkımcının dizlerine dayalı. Ön ayakları boşta, arka ayakları önde uzanıyor, başı belli. Kırkımcının elleri koyunun koltuk altında.

## ZAYIF → düzeltildi
- **sf-th-uc-kardes-fasulye**: Diz çöken kadının eteği kocaman bir kütle gibiydi, "15 cm" ölçüsü küçük kalıyordu. Yeni çizim yakın kesit: tümseğin ortasında mısır var, 15 cm yanındaki çukura yukarıdan gelen el (KADIN kolu) fasulye bırakıyor. Ölçü belirgin.
- **sf-th-yaprak-alti-puskurtme**: Yaprak gökyüzünde süzülüyordu. Yaprağa toprağa dikili bir gövde ve başka yapraklar eklendi.
- **sf-th-cerceve-havalandirma**: Kapak neredeyse yataydı, açık olduğu anlaşılmıyordu. Kişi kaldırıldı. Kapak artık önden belirgin biçimde aralık ve bir takozla dayalı; sıcak hava aralıktan dışarı çıkıyor.
- **sf-th-yonga-kesim**: Kesikler ve yonga çok küçüktü. Daha kalın bir göz çubuğu çizildi; iki kesik turuncu kesikli çizgiyle gösteriliyor. Çıkan yonga gözü ve yeşil kabuk altı tabakasıyla birlikte yanda duruyor.
- **sf-th-hasta-ayirma**: Yürüyen adam ve içinde beyaz toplar olan kova bir şey anlatmıyordu. Şimdi solda sürünün ağılı var, arada boşluk, sağda ayrı küçük bölmede tek başına hasta keçi. Turuncu ok sürüden bölmeye gidiyor.
- **sf-th-olu-gomme**: Kişinin başı çerçevenin üst kenarına değiyordu. Sahne aşağı alındı.
- **sf-th-tinaz**: Tınaz çadıra benziyordu. Yeniden çizildi: dar taban, dışa şişkin karın, sivri tepe ve orta direk. Tepesi sazla örtülü, ip uçlarında ağırlık taşları var.
- **sf-th-havuz-kesit**: Üstteki sazan 180° döndürüldüğü için ters yüzüyordu, yani ölü balık gibi görünüyordu; aynalandı. "1–1,5 m" etiketi havuzun altındaydı ve genişlik gibi okunuyordu; derinlik çizgisinin üstüne taşındı.
- **sf-th-sagim-el**: El şekilsiz bir yumruktu. Parmaklar memeyi saracak biçimde yeniden çizildi: başparmak ile işaret parmağı memenin dibinde, öbür parmaklar altta. 1–2–3 rozetleri ve aşağı oku kaldı.
- **sf-th-agil**: Çizimde "120 cm" ölçüsü vardı ama adım 1'in metninde bu ölçü geçmiyor (2. adımda geçiyor). Ölçü kaldırıldı, çit arka planda kaldı.
- **sf-th-kumes-tunek**: Dışkı tahtasının üstündeki beyaz ovaller yumurta gibi görünüyordu; kaldırıldı.
- **sf-th-tohum-kavanoz**: Pirinç torbasının turuncu bağı bir gülümseme gibi duruyordu. Yerine düz bir bağ ve görünen pirinç taneleri kondu.

spec.ts'te bu sahnelerin açıklamaları yeni çizimlere göre güncellendi. guides.ts'teki `art` dizilerinde değişiklik yok.

## Bilerek bıraktıklarım (sınırda İYİ)
- **sf-th-tirnak-kesim**: Toynak alttan görünüyor. Bu, tırnak kesimi kılavuzlarında standart görünüm; uzayan kenar kesikli çizgiyle işaretli.
- **sf-th-orak-bicme**: Kesim yönünü gösteren ok yok, ama ölçü başaktan kesim yerine doğru iniyor.
- **sf-th-yonga-kesim** (yandan) ile **sf-th-yonga-yuva** (önden) farklı açılardan çizildi. İkisi de tek başına anlaşılıyor.

## Kontroller
- `npx -y tsx tools/check-sifirdan.ts 03-tarim-hayvancilik` → hata yok
- Derleme: 0 uyarı, 0 hata
