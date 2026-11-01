# Çizim düzeltme — batch cz-ds (deprem + sel)

Dosyalar: `src/art/scenes/deprem.tsx`, `src/art/scenes/sel.tsx`; art dizileri `src/content/guides/deprem.ts`, `src/content/guides/sel.ts`; spec `src/art/spec/deprem.ts`, `src/art/spec/sel.ts`.

En sık sorun: rehber içinde kişiler adımdan adıma değişiyordu (kadın/erkek, ten, saç, rol rengi). Her rehbere sahne dosyasının başında bir oyuncu sabiti tanımlandı ve bütün sahnelerine yayıldı. Acil durum sahnelerindeki gülümseyen (`calm`) yüzler `neutral`/`worried` yapıldı. Hiçbir çizim kaldırılmadı (mevcut null'lar zaten görselle anlatılamayan adımlardı).

## deprem-aninda — oyuncu `DA`: erkek, açık-orta ten, kahverengi saç, turkuaz üst
- Adım 5 (yeni metin, eskiden null): yeni sahne `deprem-koltuk-yani` — dolgun kanepe (önden, yeni `SofaFront` şekli) yanında Çök-Kapan-Tutun yapan kişi, titreme çizgileri, yeşil onay. Pencere/asılı eşya yok.
- Adım 9 (yeni metin): `deprem-arac-dur` içindeki kırmızı yasaklı köprü/üst geçit kaldırıldı (yeni metin köprüde inmeyi söylüyor, eski çizim çelişiyordu). Kalan: yol kenarında duran araç + el freni yakın planı. Sürücü gülümsemiyor.
- Adım 2, 3, 4, 7, 8: kişi `DA` ile birleştirildi (önceden 3 farklı kişi). `deprem-kapan-masa` artık `masaAlti(DA)`.
- Şüphe: adım 9'un ikinci yarısı (köprü/tünelde inip aracın yanına çökme) çizilmedi; tek fikir kuralı.

## deprem-sonrasi — `DS`: uzun koyu saçlı kadın + atkuyruklu kız
- 1, 2: kişi birleştirildi, yüz `neutral`.
- 6: ortak `no-elevator` yerine rehbere özel `deprem-sonrasi-merdiven` (aynı kadın merdivenden iniyor).
- 7: ortak `go-assembly-area` yerine `deprem-sonrasi-toplanma` (aynı kadın + kız, çantalı).
- 4 (`gas-valve-off`), 9 (`sms-send`) yalnız el; dokunulmadı.

## enkaz-altinda — `EA`: erkek, mavi üst
- 4: `deprem-enkaz-vurma` artık `enkazVurma(EA)` (önceden kadın).
- 5: enkazdaki kişi yaşlı kadından `EA`'ya çevrildi; kurtarıcı `EK.lead` ile aynı.

## enkaz-kurtarma — `EK.lead`: turuncu yelekli erkek gönüllü; `EK.mate`: topuzlu kadın gönüllü
- 1, 2, 6, 7, 9 birleştirildi; 9'daki kadın gönüllü ana gönüllüye çevrildi.

## deprem-kalabalik-alan — `KA`: erkek, koyu ten, siyah saç
- 3 (başörtülü kadın → `KA`), 4 (tribündeki doğru yapan kişi → `KA`), 8 (çıkıştaki kalabalığa `KA` eklendi). 1, 6 zaten `KA` idi.
- Şüphe: 4 (stadyum) küçük figürlü ve kalabalık; okunuyor ama en zayıf sahne.

## deprem-hasarli-bina — `HB`: erkek, kahverengi saç
- 6: aileden yetişkin erkek `HB` yapıldı; 9: fenerli kadın `HB` yapıldı; 5: telefon tutan elin kolu `HB` rengine.

## deprem-cocuklar — `DC.parent`: uzun siyah saçlı kadın; `DC.kid`: atkuyruklu kız
- 1, 4, 7, 8 ebeveyn birleştirildi (önceden mor kadın / erkek / topuzlu kadın / erkek); 4, 7, 8 çocuk birleştirildi (7'de erkek çocuk vardı).
- Şüphe: adım 1 metin gereği bebek gösteriyor; diğer adımlardaki kızla aynı çocuk değil.

## deprem-yuksek-bina — `YB`: kızıl uzun saçlı kadın
- 3: yeni `deprem-yuksek-masa` (masaAlti(YB)); metin "masa yoksa koltuk" da diyor, sahne masa seçeneğini gösteriyor.
- 7: yeni `deprem-yuksek-merdiven-asansor`; 9: yeni `deprem-yuksek-vurma`; 8: merdivenden inenlerden biri `YB`; 6: elin teni `YB`.

## sel — `SL`: erkek, koyu saç, turkuaz
- 1, 4, 7, 9 birleştirildi (9'da kadın, 7'de farklı erkek vardı).

## heyelan — `HY`
- 3: doğru (yana kaçan) ve yanlış (yolda kalan) figür aynı kişi; 5: `topOl(HY)`.

## sel-tsunami — `TS`: atkuyruklu anne + oğul
- 2, 4: rastgele kalabalık yerine anne + oğul.
- 3: yasaklı çocuk figürü kaldırıldı (çocuğu denize bırakıp kaçan anne gibi okunuyordu); şimdi anne + oğul çekilen denizden kaçıyor.
- 5: üst kattaki aile anne + oğul.
- 8: yasaklı "geri dönen adam" yerine tepede bekleyen anne + oğul ve kıyıya giden kesikli yol üzerinde kırmızı yasak.

## sel-akintiya-kapilma — `AK.vic`: erkek (mavi), `AK.res`: kıyıdaki kurtarıcı
- 1: kadından `AK.vic`'e; 4 içindeki yasak çerçevesi de aynı kişi; 5: sağdaki "doğru" kadın yerine aynı kişi sığ suda yürüyor; 8: sudaki çocuk yerine `AK.vic`, su seviyesi bel hizasına alındı; çerçevedeki suya atlayan kişi kurtarıcı.

## sel-sonrasi-temizlik — `ST`: erkek, koyu ten
- 4, 5 birleştirildi (5'te başörtülü kadın vardı); 8 eldiven teni.

## sel-camur-akisi — `CA`: siyah atkuyruklu anne + oğul
- 1, 6: aile anne + oğul; 5: doğru ve yanlış figür aynı kişi; 7: yeni `sel-camur-top-ol` (önceden heyelan'daki erkekle ortak).

## sel-arac — `AR.drv`: sürücü erkek; `AR.pas`: yolcu kadın
- 6: kadın yerine sürücü (5 ile aynı kişi).

## sel-uyarisi — `SU`: erkek, koyu ten
- 2 ve 4 birleştirildi.

## Yeni sahne kimlikleri (spec'e eklendi)
deprem-koltuk-yani, deprem-yuksek-masa, deprem-yuksek-merdiven-asansor, deprem-yuksek-vurma, deprem-sonrasi-merdiven, deprem-sonrasi-toplanma, sel-camur-top-ol.

## Kontroller
`npx tsc --noEmit` bu dosyalarda temiz; `npx vitest run tests/guides.test.ts` 191/191 geçti. 16 rehberin hepsinin son paftası `/tmp/cz-ds/sheets/` altında görüldü.
