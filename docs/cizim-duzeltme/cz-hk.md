# Çizim düzeltme — batch cz-hk (doğada hayatta kalma)

Dosyalar: `src/art/scenes/hayatta-kalma-1.tsx`, `src/art/scenes/hayatta-kalma-2.tsx`; art dizileri `src/content/guides/hayatta-kalma.ts`; spec `src/art/spec/hayatta-kalma.ts`.

15 rehber. En sık sorun: rehber içinde kişi adımdan adıma değişiyordu (kadın/erkek, ten, saç, kıyafet) ve acil durumdaki kişiler gülümsüyordu (`calm`). Her rehber için sahne dosyasının başında bir oyuncu sabiti tanımlandı (`SB`, `YON`, `PUS`, `KAMP`, `YIY`, `SIC`, `DERE`, `HAY`) ve bütün sahnelerine yayıldı; yüzler `neutral` yapıldı (uyuyan/dinlenen `closed`, tehlikede `worried`). Hiçbir çizim null yapılmadı; 3 yeni sahne eklendi (`hayatta-kalma-yon-ok-gece`, `hayatta-kalma-isirik-yika`, spec'leri yazıldı). Yön ve düğüm çizimleri hesapla doğrulandı (aşağıda).

## su-bulma — `SB`: at kuyruklu kahverengi saçlı kadın, kiremit sırt çantası
- 1 (`su-dinle`): adam → `SB`, yüz neutral. 2 (`su-vadi`): figür büyütüldü (0,5 → 0,62), `SB` + çanta. 6 (`ciy-toplama`): `SB`, yüz neutral.

## su-aritma
- Kişi yok (yalnız el/kap). Dokunulmadı; çizimler metinle uyumlu.

## yon-gunes — `YON`: esmer adam, siyah saç, camgöbeği üst (yıldız ve saat rehberlerinde de aynı)
- 1: yüz neutral. 5 (`golge-cubuk-kuzey`): kuşbakışı kişi `YON` ten/saç. 8 (`yon-ok`): topuzlu kadın → `YON`.
- Astronomi kontrolü: gölge güneşin tersine; kuzey yukarıdayken ilk taş (B) solda, ikincisi (D) sağda, gölge ucu batıdan doğuya kayıyor (Kuzey yarımküre). Doğru.

## yon-yildiz — `YON`
- Gök sahneleri yeniden yazıldı: yıldızlar gerçek sağ açıklık/dik açıklıktan, 39° K enlemindeki kuzeye bakan gözlemci için dikdörtgensel kamera izdüşümüyle (`skyCam`; ufuk ve büyük çemberler düz çizgi) çiziliyor.
  - 1 (`buyukayi`): yaz sonu akşamı (yıldız zamanı 21 sa), kepçe kuzeybatıda alçakta; Merak–Dubhe halkalı; izleyen kişi `YON`.
  - 3 (`kutup-yildizi-bulma`): aynı gök; Merak→Dubhe çizgisi kasenin açık tarafından çıkıp Kutup Yıldızı'na gidiyor, çentikler gerçek Dubhe–Kutup uzaklığını Merak–Dubhe aralığına bölerek (≈5) konuyor.
  - 5 (`kutup-kuzey`): Kutup Yıldızı gözden tam 39° yukarıda (Türkiye enlemi = yıldızın yüksekliği), tam altındaki ufuk noktası "K".
  - 6 (`kassiopeia`): sonbahar akşamı (21,5 sa): Büyükayı kuzey ufkunda ağaçların hemen üstünde, Kassiopeia yüksekte, Kutup Yıldızı arada (metindeki "ağaç arkasında kalabilir" gerçek konumla gösterildi).
- 7: gündüz `yon-ok` yerine yeni gece sahnesi `hayatta-kalma-yon-ok-gece` (metin gece işaretleyip sabahı beklemeyi söylüyor).

## yon-saat — `YON` (eller)
- 1, 2, 4: saatler tutarsız saat gösteriyordu (3:50 ve 4:00 karışık, bir sahnede yelkovan yok). Hepsi 16:00: akrep 4'te, yelkovan 12'de. El teni `YON`.
- Kontrol: akrep güneşe dönük; 4 ile 1 arasındaki açının ortası (2:30 doğrultusu) "G". 16:00'da güneş GB'de, bisektör güneye ≈ doğru (yaz saati düzeltmeli Kuzey yarımküre yöntemi).

## pusula-harita — `PUS`: topuzlu kadın
- 1 (`harita-yonlendir`): pusula iğnesi haritanın kuzeyine eşitlenmişti (harita zaten yönlenmiş görünüyordu) ve dönme oku ters yöndeydi. Şimdi harita kuzeyi sola eğik, iğne yukarı, ok saat yönünde. Eller `PUS` teni.
- 4: el teni. 5 (`pusula-igne`): yüz neutral. 6 (`pusula-hedef`): arkadan görünen adam → topuzlu `PUS`.

## ates
- 4 (`ates-alani`): anlaşılmayan kuşbakışı süpüren kişi kaldırıldı (spec de güncellendi).
- 8 (`ates-sondurme`): 1. karede havada duran kova artık elde; 2. karede sopayı tutan el yukarıdan geliyor; kollar karelere kırpıldı.

## barinak — `KAMP`: at kuyruklu kadın, koyu saç, camgöbeği (ortak `whistle-signal` ile aynı)
- 4 (`zemin-yalitim`, soğuk gece rehberiyle ortak): mavi giysili adam → `KAMP`, oturuş düzeltildi. 5 (`barinak-dal`): uzun saçlı kadın → `KAMP`. 9 (`parlak-bez`, işaret rehberiyle ortak): ten `KAMP`, yüz neutral.

## isaret — `KAMP`
- 3 (`yer-isareti`): adam → `KAMP`. 6 (`ayna`): adam → `KAMP`, aşırı uzun V parmakları kısaltıldı. 8 (`helikopter-y`): adam → `KAMP`.

## yabani-yiyecek — `YIY`: açık tenli kahverengi saçlı adam
- 3 (`mantar-yasak`): mantarlar küçüktü ve el + yasak işareti hepsini örtüyordu; el kaldırıldı, mantarlar büyütüldü, tavadaki mantar ayrı yasaklı (spec güncellendi).
- 4 (`bitki-yasak`): meyveyi ağza götüren kopuk kol (çalıdan gelen, başka kişiye ait) yerine kişinin kendi kolu ağzına götürüyor; yasak işareti küçüldü.

## soguk-gece — `KAMP`
- 4 (`katman-giyin`): bere gözleri örtüyordu (yükseltildi); kişi `KAMP`, dış katman (3 numaralı yağmurluk) camgöbeği. 5 (`folyo-battaniye`): `KAMP`, yüz neutral. 6 (`sokulma`): ortadaki kişi `KAMP`.

## sicak — `SIC`: açık renk uzun kollu giysi, geniş kenarlı şapka + ense bezi
- Ortak `SunHat` yardımcı şekli eklendi; 1, 2, 4'te aynı adam aynı şapkayla. 1'deki yasaklı yürüyen de aynı kişi. 6 (`islak-bez`): kadın → `SIC`.
- 2 (`golgelik`): branda havada süzülüyordu (çalılardan yukarı ipler); şimdi iki dal direğe bağlı, gergi ipleri çalılara.

## dere-gecme — `DERE`: kahverengi saçlı adam, kiremit çanta
- 2 (`dere-diz`): iki karede iki farklı kişi → ikisinde de `DERE`. 7 (`dere-sopa`): kadın → `DERE`. 9 (`dere-dusme`): `DERE`. 6: el teni.

## vahsi-hayvan — `HAY`: koyu tenli adam, siyah saç, haki pantolon, sırt çantası
- 1, 2, 4, 7 birleştirildi (önceden kadın/3 farklı adam); yasaklı koşan figürler de `HAY`.
- 9: ortak `flush-water-15` (açık ten, mavi kol) yerine yeni `hayatta-kalma-isirik-yika` (aynı sahne, `HAY` teni ve kolu, sabun eklendi).

## dugumler
- Her düğüm, çizim sırasından çıkarılan kesişim üst/alt bilgisiyle kontrol edildi (`/tmp/cz-hk/py/knot.py`).
  - Sekiz: 4 kesişim, dönüşümlü, indirgenmiş → sekiz düğümü. Doğru.
  - İzbarço: inen uç, halkaya yukarı çıkan uçla aynı yönde (üst kenarın altından/alt kenarın üstünden) geçiyordu → ters sarılmış, izbarço değil. Katman sırası düzeltildi: iniş kolu üst kenarın üstünden girip alt kenarın altından çıkıyor.
  - Camadan: eski "doğru" çizim kapatıldığında burulma 6 veriyordu = **kocakarı düğümü**. Yeniden çizildi: iki büyük sıra, üstte gerçek camadan (burulma 0, iki zıt yarım düğüm), kısa uçlar aynı yanda, onaylı; altta aynı düğüm uçlar ters yanda (hırsız düğümü), çarpılı. Yarım düğüm aşaması kaldırıldı (okunmuyordu).
  - Iskota: ince ip kalın kıvrımın altından girip iki kolu birlikte sarıyor ve kendi altından geçiyor; doğru.
  - Kazık: iki tur, çapraz üstte, iki uç da çaprazın altından zıt yönlere; doğru.

## Kalan şüpheler
- İzbarço dört aşama 320 genişliğe sığdırıldığı için küçük; yapı doğru ama okunması zor olabilir.
- Gök sahnelerinde yıldız büyüklükleri gerçek parlaklığı yansıtmıyor (hepsi aynı); Kutup Yıldızı'nın "sönük" olduğu çizimde ayrıca vurgulanmıyor.
- `yer-isareti`: kuşbakışı zeminde önden çizilmiş ölçek kişisi (spec böyle); bakış açısı karışık ama okunuyor.
- `call-112`/`call-114` ortak el sahneleri dokunulmadı (kol/giysi görünmüyor).
