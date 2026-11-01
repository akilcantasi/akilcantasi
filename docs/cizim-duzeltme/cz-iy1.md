# cz-iy1 — İlk yardım 1 çizim düzeltmesi (2026-11-01)

Sahne dosyası: `src/art/scenes/ilk-yardim-1.tsx`. Dosyanın başında rehber başına oyuncu sabitleri var:
`ADULT` (ilk değerlendirme, TYD, OED, kanama: yaralı açık tenli kahverengi saçlı adam / yardımcı esmer, topuzlu kadın),
`CHILD` (buğday tenli siyah saçlı oğlan / açık tenli adam), `BABY` (sarı tulumlu bebek / esmer kadın),
`DER` (buğday tenli adam / koyu tenli at kuyruklu kadın), `HYT` (esmer adam / kızıl topuzlu kadın), `NOB` (koyu tenli adam / açık tenli adam).
Ortak sahneler (`cpr-adult`, `recovery-position`, `watch-breathing`, `lie-cover-blanket`) oyuncuları bozduğu için rehbere özel kopyalar çizildi.
Yeni kimlikler (spec'e eklendi): `ilk-yardim-kpr-yetiskin`, `ilk-yardim-derlenme-sonuc`, `ilk-yardim-kanama-ortu`,
`ilk-yardim-derlenme-son`, `ilk-yardim-derlenme-izle`, `ilk-yardim-derlenme-kpr`, `ilk-yardim-bogulma-kpr`, `ilk-yardim-nobet-derlenme`.
Yardımcıların hiçbirinde `calm` (gülümseme) kalmadı.

## ilk-yardim-ilk-degerlendirme
- 1 olay yeri: oyuncular ADULT'a çevrildi.
- 2 omuz-seslen: yeniden çizildi. Eski yukarıdan, gövdesiz, çerçeveden kesik yardımcı yerine yandan görünüş; yardımcı uzak yanda diz çökmüş, elleri omuzlarda, sesleniyor.
- 5 baş-geri-çene: yeniden çizildi (eskisinde baş ters dönmüştü, kollar iki ayrı kenardan geliyordu). Yandan, yardımcının bütün bedeni görünüyor: uzak el alında, yakın elin parmakları çene altında.
- 6 → `ilk-yardim-kpr-yetiskin`, 7 → `ilk-yardim-derlenme-sonuc` (aynı oyuncular).

## kanama
- Ten renkleri ADULT'a göre birleştirildi (turnike eli, bez-ekle ek çizimi, sargı kolu, yara derisi).
- 9 → `ilk-yardim-kanama-ortu` (aynı yaralı ve yardımcı, örtülü, yanında konuşuyor).

## temel-yasam-destegi
- 1, 3: yeniden çizildi (yukarıdaki gibi). 6: göğüs teni yaralıya uyduruldu. 7 → `ilk-yardim-kpr-yetiskin`.
- 8 kurtarıcı nefes: yeniden çizildi. Eskisinde yardımcı baş aşağı, gövdesiz ve kopuktu. Şimdi yan görünüş: yardımcı uzak yanda diz çökmüş (derinlik için biraz yukarıda), öne eğilmiş, ağzı yaralının ağzında, uzak eli alında/burunda, yakın eli çenede. Göğüste yükselme oku var.
- 9 (OED gelince açın): çarpık gövdeli ped çizimi buradan kaldırıldı, yerine metne uyan `ilk-yardim-oed-ac` kondu (cihaz başın yanında, parmak açma düğmesinde).

## ilk-yardim-oed
- 4 ped yeri: yeniden çizildi. Yukarıdan, yerde yatan çıplak gövde, kollar yanlarda, sol kol hafif açık. Ped 1 sağ köprücük altında, ped 2 sol koltuk altının altında, göğsün yanında. Kablolar tek fişte birleşip başın yanındaki OED'ye gidiyor; havada kol yok.
- 2, 6: yaralı ADULT'a çevrildi. 6'daki anlamsız kırmızı ✗ kaldırıldı, kesikli "dokunma" halkası kaldı.
- 8 → `ilk-yardim-kpr-yetiskin`. 10 çocuk ped: ten ve saç CHILD'a uyduruldu.

## ilk-yardim-cocuk-kpr
- 3 baş-geri ve 4 nefes: yetişkin sahnenin çocuk sürümüyle yeniden çizildi. Eski nefes sahnesinde yardımcı baş aşağıydı.
- 5: kız çocuk CHILD oğlana çevrildi, gülümseyen yardımcı `neutral` yapıldı. 9 ped: CHILD'a uyduruldu.

## ilk-yardim-bebek-kpr
- 3: bebek sarı tulumlu yapıldı (ilk-yardim-2'deki bebek sahneleriyle aynı), el tenleri BABY yardımcısına uyduruldu.
- 5 nefes: yeniden çizildi. Bebek sert yüzeyde, başı düz; yardımcı masanın arkasında ayakta, öne eğilmiş, ağzı bebeğin ağzını ve burnunu birlikte kapatıyor. Eskisinde baş aşağıydı.
- 6 ve 8 `ilk-yardim-2.tsx`'te, başka ajanın; dokunmadım.

## derlenme-pozisyonu
- 3, 4, 5: yeniden çizildi. Yukarıdan görünüş, aynı DER yaralı. Yardımcı artık yukarıdan görünen bir kişi (baş, sırt, iki kol tek gövdeden çıkıyor); kopuk ve kesişen kollar yok.
  - 4: elin sırtı yanakta.
  - 5: uzak diz bükülü, el dizde, çekme oku yardımcıya doğru.
- 7 → `ilk-yardim-derlenme-son`, 8 → `ilk-yardim-derlenme-izle`, 10 → `ilk-yardim-derlenme-kpr`; hepsi DER oyuncularıyla. Böylece kısa saçlı adamdan kızıl saçlı kadına geçiş ve gülümseyen yardımcı sorunu kalktı.

## hava-yolu-tikanmasi
- Yaralı bütün adımlarda HYT adamı oldu. Eskiden 1'de beyaz adam, 3'te esmer adam, 6'da kadındı.
- Yardımcı HYT kadını oldu: 1'deki "Boğuluyor musun?" diye soran kişi artık yardımcı.
- Yüzler `neutral`/`speak` yapıldı.
- 8 → `ilk-yardim-bogulma-kpr`.

## nobet
- 1: yeniden çizildi. Eskisi küçük ve anlaşılmaz bir yukarıdan görünüştü. Şimdi yandan: yardımcı diz çökmüş, sehpayı yerde kaydırarak uzaklaştırıyor, kişiye dokunmuyor.
- 2: yeniden çizildi. Eskisinde iki ayrı kenardan kollar vardı. Şimdi yardımcı başın ucunda diz çökmüş, katlanmış ceketi başın altına koyuyor; ağza bir şey sokma yasağı ek çizimde duruyor.
- 4: bulanık kişi ve el tenleri NOB'a uyduruldu. 5 → `ilk-yardim-nobet-derlenme`.

## Kalan şüpheler
- Yan görünüşteki kurtarıcı nefes sahnelerinde temas noktası (ağız-ağız, burnu sıkan el) küçük ölçekte biraz kalabalık. Doğru okunuyor ama ideal değil.
- Derlenme 3–5'te yardımcı yukarıdan çizildi; kural 3 yan görünüşü tercih ediyor. Kolu başın yanına koymak yandan görünmediği için yukarıdan bakış seçildi. Yardımcının gövdesi alt kenarda kısmen kırpılıyor.
- Derlenme 5'te "dizi bükülü bacak" yukarıdan V biçiminde görünüyor; dizin kalkık olduğu yukarıdan tam anlatılamıyor.
- Kit'in `closed` yüzündeki nötr ağız çizgisi çok hafif kavisli. Bilinçsiz kişide belirgin bir gülümseme yok ama kit'e dokunmadım.
- Bebek 6 ve 8 başka ajanda: oradaki yardımcı ten rengi BABY yardımcısıyla (ten 2) uyuşmayabilir.
- `call-112` (çocuk/bebek 2, nöbet 8) ortak sahne; yalnız el gösteriyor, dokunmadım.
