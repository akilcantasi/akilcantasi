# Çizim düzeltme — batch cz-pz (psikoloji + zehirlenme)

Sahne dosyası: `src/art/scenes/psikoloji-zehirlenme.tsx`. Her rehber için dosyanın başında bir oyuncu sabiti var (PIY, PAN, COC, STR, YAS, UYK, GON, TRV, INT, CO, ZG, CY, MN, GD, MT, TR). Ortak kurgular artık oyuncu alan fabrikalar: `nefesClose`, `haberKapat`, `talkSit`, `goHealth` (sağlık çadırına birlikte yürüme), `recov` (derlenme pozisyonu, bilinçsiz kişinin ağzı düz), `kpr`, `gozHizasi`, `yasBench`, `yanindaKal`, `kutuyuGoster`, `gozYika`.
Ortak sahneler (`stay-calm-talk`, `hospital-go`, `recovery-position`, `cpr-adult`) oyuncu tutarlılığını bozduğu için rehbere özel kimliklerle değiştirildi; `call-112`, `call-114`, `flush-water-15`, `wash-hands` yerinde bırakıldı (kişi yok ya da yalnız el).

## Psikoloji
- **psikoloji-ilk-yardim** (PIY: yelekli gönüllü adam + topuzlu kadın): dinle ve baglanti oyuncuları birleştirildi, yardımcının gülümsemesi kaldırıldı; 7. adım `psikoloji-piy-nefes` (aynı kadın).
- **psikoloji-panik-atak** (PAN: uzun kahve saçlı kadın): oturma/ayak-yere aynı kadına çevrildi (ayak-yere gülümsemesi kaldırıldı); 6. adım yeni `psikoloji-panik-yaninda` (karşılıklı oturup sakin konuşan yardımcı).
- **psikoloji-cocukla-konusma** (COC: bıyıklı baba + oğlu): sarılma sahnesi anne/kızdan baba/oğula çevrildi, kalp simgeleri kaldırıldı; resim renkleri eşlendi; 9. adım `psikoloji-cocuk-haber` (babanın kolu).
- **psikoloji-cocuk-stres-belirtileri** (STR: topuzlu anne + çocukları): her adımda aynı anne; ergen sahnesindeki gri saçlı baba ve arka plan aile kaldırıldı; 5. adım `psikoloji-stres-okul-konusma`, 8. adım `psikoloji-stres-destek`. Yaş gruplarına göre çocuklar farklı (metin gereği), hepsi aynı ten.
- **psikoloji-yas** (YAS): 6. adım `psikoloji-yas-basin-sagolsun` (aynı bank, arkadaş konuşuyor), 7. adımda yemeği getiren arkadaş, kapıdaki yas tutan kadın; 9. adım `psikoloji-yas-destek`.
- **psikoloji-uyku-stres** (UYK): 6. adım `psikoloji-uyku-nefes`.
- **psikoloji-gonullu-tukenmislik** (GON): mola sahnesinin oyuncuları birleştirildi; "eş" sahnesinde kadının kafa üstünden geçen kolu omza indirildi, gülümseme kaldırıldı; 9. adım `psikoloji-gonullu-destek`.
- **psikoloji-travma-tepkileri** (TRV): irkilme sahnesindeki yanındaki kişinin gülümsemesi kaldırıldı; 5. `psikoloji-travma-konusma`, 6. `psikoloji-travma-haber`, 8. `psikoloji-travma-destek`.
- **psikoloji-intihar-dusuncesi** (INT): 6. adım (`psikoloji-tehlikeli-esya`: bıçak ve ilaç kutusu) **null** yapıldı, sahne ve spec satırı silindi — araç/yöntem çizilmez kuralı. 4. adım `psikoloji-intihar-dinle`, 8. adım `psikoloji-intihar-destek`. Yaşlı kadın yardımcının yüzü nötr.

## Zehirlenme
- **karbonmonoksit** (CO): 5. adım `zehirlenme-co-yan-yatir`.
- **zehirlenme** (ZG: kahve saçlı adam + topuzlu kadın yardımcı): 2. `zehirlenme-kpr` (ornek-kpr kalıbı), 7. kutu sahnesini yardımcı kadın tutuyor, 8. `zehirlenme-yan-yatir`. Göz yıkama baştan çizildi: eski çizimde baş ters dönmüş, göz yanlış yerde, su gözün üstünden dik geçiyordu; şimdi yan görünüş, baş geriye yatık, su iç köşeden dış köşeye/kulağa akıyor.
- **zehirlenme-mantar** (MN): 1. adım `zehirlenme-mantar-acil` (karnını tutan adam + eşi); saat ve toplama sahneleri aynı adam; el kolları onun rengi.
- **zehirlenme-gida** (GD): 6. adım `zehirlenme-gida-doktor`; konserve sahnesinde kadının kolu.
- **zehirlenme-cocuk-yutma** (CY: anne + küçük kız): 3. `zehirlenme-cocuk-kutu` (anne), 8. `zehirlenme-cocuk-yan-yatir` — eskiden çocuk rehberinde yetişkin adam yan yatıyordu; artık çocuk. Düğme pil: çocuğun kolu ve ek karedeki anne eşlendi.
- **zehirlenme-metanol** (MT): 2. adımda ek karedeki çarpık kol kaldırıldı (yalnız acı çeken yüz), 4. adımda dört kişinin yüzü endişeli, üstteki anlamsız hilal kutuları kaldırıldı; 7. `zehirlenme-metanol-yan-yatir`.
- **zehirlenme-tarim-ilaci** (TR: yaşlı çiftçi + maskeli/eldivenli kadın): 1., 4. ve 6. adımlarda aynı çiftçi ve aynı yardımcı (eskiden 4. adımda genç adam); 6. adım `zehirlenme-tarim-goz-yika`; etiket sahnesinde yardımcının kolu.

## Kalan şüpheler
- Göz yıkamada "göz kapağını açık tutma" eli çizilmedi (önceki parmak çizimi karışıklık yaratıyordu); yalnız açık göz ve su yönü var.
- `wash-hands`, `flush-water-15` ortak sahnelerindeki kol renkleri rehber oyuncusuyla birebir değil (yalnız el/kol).
- Metanol ek karesindeki "pain" yüzü küçük boyda bağırıyor gibi görünebilir.
- Kitin varsayılan nötr ağzı hafif yukarı kıvrık; bilinçsiz kişilerde `FlatMouth` ile düzleştirildi, diğer nötr yüzlerde kit olduğu gibi.
