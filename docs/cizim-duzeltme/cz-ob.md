# cz-ob — Özel gruplar + Barınma çizim düzeltmesi (2026-11-01)

Sahne dosyaları: `src/art/scenes/ozel-gruplar.tsx`, `src/art/scenes/barinma.tsx`.
Oyuncu sabitleri: ozel-gruplar.tsx başında `BBK, BSL, HML, DGM, YSL, TKS, GIS, ZHN, KRN, EVC`; barinma.tsx başında `AILE` (tek aile: bıyıklı baba yeşil, uzun saçlı anne mor, oğul hardal, kız mavi — bütün barınma rehberlerinde aynı).

## Özel gruplar
- **bebek-bakimi** (BBK: topuzlu siyah saçlı anne mor üst, sarı tulumlu bebek). #2 bere ve #3 ense yeniden çizildi (önceki: dev battaniye lekesi; çerçeve köşesinden kopuk kollar). Yeni ortak kurgu `momUpright`: anne yandan, bebek önünde dik; ense sahnesinde ön el bebeğin ensesinde, kol bebeğin üstünden geçmiyor. #9 ortak `hospital-go` (bebeksiz) yerine yeni `ozel-gruplar-bebek-saglik-git` (bebeği taşıyan endişeli anne → sağlık çadırı). #7 bebek aynı kıyafete getirildi.
- **bebek-beslenme** (BSL). Bugünkü metin değişikliğine göre #7 mama ölçü sahnesinden biberon kaldırıldı, yerine temiz bardak. #8 bardakla besleme aynı anneyle yeniden kuruldu (önceki farklı başörtülü kadın); köşeye yasaklı biberon eklendi ("biberon yerine bardak"). #6 ortak boil-water (1 dk) metinle uyumlu; #9 (2 saat/1 saat) soyut, null kaldı.
- **hamile** (HML): #1, #3, #5'te üç farklı kadın vardı → tek kadın. Görevli ve endişeli adımda yüz ifadeleri düzeltildi.
- **acil-dogum** (DGM: uzun saçlı pembe üstlü anne, koyu tenli yardımcı). #4 anne oyuncuya çevrildi, gülümseme kaldırıldı (anne worried, yardımcı neutral). #6 kurulama yeniden çizildi: çapraz kopuk iki kol yerine sağ kenardan tek kol, havluyla sırtı kuruluyor. #7 ten tene yeniden çizildi: battaniyede havada duran eller kaldırıldı; aynı anne+bebek, battaniye bebeği omuzlara kadar örtüyor, çıplaklık yok. #9 aynı anne.
- **yasli** (YSL: başörtülü yaşlı kadın yeşil, genç komşu teal). #1 yumruk savurur gibi duran "kapı çalma" yerine kapıda konuşup su uzatma. #4 yaşlı adam → aynı yaşlı kadın. #7 yardımcı aynı. #10 ortak `stay-calm-talk` yerine yeni `ozel-gruplar-yasli-sohbet`.
- **engelli-hareket** (TKS: topuzlu kahverengi saçlı kadın kullanıcı, teal yardımcı). 4 farklı sandalye kullanıcısı tek kişiye indirildi. #1 fren oku bacakların üstünden geçmiyor. #3 ortak düdük yerine yeni `ozel-gruplar-sandalye-duduk` (sandalyedeki kişi düdük çalıyor). #6 öndeki yardımcı tekere sarılmış gibiydi → dik duruşla çerçeveden tutuyor.
- **engelli-gorme-isitme** (GIS: rehber kadın, gri saçlı görme engelli adam, işitme engelli koyu tenli adam). #2 başların üstünden geçen ok yerine tutuş noktasına turuncu halka. #5/#7'de farklı işitme engelliler → tek kişi; yardımcı her adımda aynı kadın. #9 ortak düdük yerine yeni `ozel-gruplar-isitme-duduk`.
- **engelli-zihinsel** (ZHN): #5'te baba+kız vardı → aynı anne+kulaklıklı oğul; #2 bileklik kolu çocuğun kıyafeti.
- **kronik-hastalik** (KRN): el kolları ve kurtarıcı ifadesi tutarlı yapıldı; diğerleri iyi.
- **evcil-hayvan** (EVC): #2'deki kadın yerine #1'deki baba; köpek rengi aynı.

## Barınma
Bütün insanlı sahneler `AILE` oyuncularına bağlandı (zemin-yalitim, fener, aile-iki-bulusma, haber-kisisi, katmanli-giyim, bere-corap, sicak-icecek, kar-temizle, dis-cukur, dis-fircalama, dirsek-oksurme, cop-kapakli, folyo, tek-oda/birlikte-battaniye Huddle). Paylaşılan sahneler (zemin-yalitim, katmanli-giyim, sicak-icecek) bu sayede iki rehberde de tutarlı. cam-naylon: çerçeve üstünden sarkan ikinci kopuk el kaldırıldı. Null değişikliği yok.

## Kalan şüpheler
- bebek bere/ense: bebeğin bacakları çerçevenin altında kesiliyor (yakın plan); kabul edilebilir.
- acil-dogum #4 ve #9: kordon ve baş çizimi küçük; ebe onayı önerilir.
- barinma-bere-corap ve sicak-icecek'teki battaniye/uyku tulumu biçimleri hâlâ biraz şekilsiz; yeniden çizilmedi.
- görme-basamak sahnesinde iki kişi küçük.
- `tests/guides.test.ts` şu an başka ajanın `yangin-elektrik-salter` eksiği yüzünden düşüyor; bu batch'in kimlikleri eksiksiz.
