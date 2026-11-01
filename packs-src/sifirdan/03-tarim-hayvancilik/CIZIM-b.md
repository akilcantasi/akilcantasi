# Çizim raporu — 03-tarim-hayvancilik, harf b (batch sc-03b)

Dosya: `scenes-b.tsx`. 18 rehberde 52 sahne çizildi. Kategori kapakları a ajanında.

## Oyuncular (CAST)
- BAH: bıyıklı bahçıvan, yeşil uzun kollu üst, haki pantolon. Fidan dikimi, aşılar ve budamalar. Yakın planlarda el ve kol aynı ten ve yeşil kol.
- MAN: kızıl topuzlu kadın, mor üst. Mantar.
- KOY: başörtülü köylü kadın, hardal üst. Tavuk ve tavşan.
- COB: esmer, bıyıklı çoban, kiremit üst. Keçi-koyun, sağım, kırkım.
- ARI: beyaz tulumlu arıcı; şapka ve tül her sahnede.
- BAK: camgöbeği üstlü adam, mavi eldiven. Hayvan sağlığı.
- CIF: esmer kadın, at kuyruğu, yeşil üst. Ot ve balık havuzu.

Ortak malzeme renkleri dosya başında: toprak, üst/alt toprak, kabuk, kabuk altı yeşil, saman, kuru ot, tahta, balmumu, bal, tel, kil.

## Rehber başına
| Rehber | Çizilen adımlar | null yapılanlar |
|---|---|---|
| sf-th-mantar | 2 saman-pastorize, 3 mantar-torba, 6 mantar-hasat | 1 misel, 7 kütük aşılama (3 sınırı), 4, 5, 8, 9 |
| sf-th-fidan-dikim | 3 çukur, 5 aşı noktası, 7 tepe kesimi | 4 kök yayma, 6 kazık (3 sınırı) |
| sf-th-asi-kalem | 4 yarık açma, 5 kalem yontma, 6 kambiyum çakıştırma | 1 kalem alma, 7 mumlama (3 sınırı) |
| sf-th-asi-goz | 4 yonga kesimi, 5 yuva, 7 sarma | 1 göz çubuğu, 8 ilkbahar kesimi (3 sınırı) |
| sf-th-budama-genc | 3 merkezi lider, 4 ortası açık, 6 dal yakası | 2 uç alma/seyreltme, 5 dal açısı (3 sınırı) |
| sf-th-budama-olgun | 3 çapraz dal, 4 su sürgünü, 6 şeftali %50 | 2 kuru dal, 8 makas temizliği (3 sınırı) |
| sf-th-tavuk-kumes | 2 tünek, 3 folluk, 4 yırtıcıya karşı kapatma | 1 kümes genel, 7 kalsiyum (3 sınırı) |
| sf-th-tavuk-kulucka | 4 yuva, 6 ışığa tutma, 8 civciv bölmesi | 2 yumurta saklama, 3 kuluçkacı tavuk (3 sınırı) |
| sf-th-tavsan | 1 kafes, 5 yavru kutusu | — |
| sf-th-keci-koyun | 1 ağıl, 5 kolostrum, 6 tırnak kesimi | 7 göz kapağı, 8 kondisyon (3 sınırı; keçi yüzü yakın planı zor) |
| sf-th-sagim | 1 sağım sehpası, 4 el tekniği, 7 soğutma | 2 meme yıkama, 3 ilk süt kontrolü (3 sınırı) |
| sf-th-kirkim | 4 oturtma, 7 yapağı serme | 5 kırkım-yon: üç denemede anlaşılır olmadı (yünlü/kırkılmış ayrımı ve makas tutuşu karışık kaldı) |
| sf-th-ari-kovan | 1 koruyucu giysi, 3 üst çıtalı kovan, 6 oğul silkeleme | 4 çıta balmumu, 5 kovan yeri (3 sınırı) |
| sf-th-ari-bal | 4 yavru peteği (yasak) ve sırlı petek (doğru), 6 bal süzme, 8 balmumu eritme | 2 dumanlama, 3 sırlı petek (4. sahne ikisini birlikte gösteriyor) |
| sf-th-hayvan-sagligi | 1 günlük kontrol, 5 hasta ayırma, 7 ölü gömme | 2 dört panelli belirtiler (çok küçük ayrıntı) |
| sf-th-kesim | 2 kesim yeri ve ekipman, 8 iç organ (sade şematik ciğer), 9 et soğutma | 5 gövde asma, 6 post hijyeni: kan ya da gövde göstermemek için çizilmedi |
| sf-th-ot-yem | 3 ot çevirme, 6 tınaz, 7 yığın sıcaklık kontrolü | 4 sehpa, 5 bükme testi (3 sınırı) |
| sf-th-balik-havuzu | 3 havuz kesiti, 5 elek ve yan kanal (kuşbakışı), 8 oksijen azlığı | 4 set yapımı (3 sınırı), 7 yemleme |

Kesim rehberinde hayvan, kan, bıçak darbesi ya da gövde çizilmedi. Yalnız hazırlık, şematik organ ve asılı et parçaları var.

spec.ts'te çizime göre sadeleştirilen açıklamalar şunlar: fidan-cukur, yarma-acma, yarma-kambiyum, yonga-kesim, ortasi-acik, saman-pastorize, mantar-torba, kumes-tunek, kumes-folluk, kumes-yirtici, civciv-bolme, kolostrum, tirnak-kesim, sut-sogutma, kesim-yeri, havuz-kesit, havuz-elek, balik-oksijen. Kullanılmayan kimliklerin spec satırları yerinde bırakıldı.

## Kalan şüpheler
- Keçi çizimi (Goat) şematik. Boynu uzun duruyor; kolostrum sahnesinde anne iri görünüyor ama anlaşılıyor.
- Tünek sahnesinde tavuklar tünek boyunca yandan dizildi. Gerçekte tavuklar tüneğe dik tünerler; 25 cm aralığı göstermek için bu yol seçildi. "Arka duvardan 20–25 cm" ölçüsü çizilmedi.
- Kalem yontma sahnesinde bıçak, kesik yüze tam değmiyor; yön oku doğru.
- Sağım el tekniği yumruk biçiminde. Parmakların sırayla kapanışını 1-2-3 rozetleri ve okla anlatıyor, parmak hareketi tek tek görünmüyor.
- Tırnak kesimi sahnesi toynağı alttan gösteriyor; hayvancılık bilmeyen biri için ilk bakışta soyut kalabilir.
- Tınaz biraz çadıra benziyor.
