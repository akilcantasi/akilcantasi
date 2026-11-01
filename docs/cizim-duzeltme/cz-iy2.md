# cz-iy2: ilk yardım 2. yarı, çizim düzeltme raporu (2026-11-01)

Sahne dosyası: `src/art/scenes/ilk-yardim-2.tsx`. Oyuncular dosyanın başında rehber başına sabit olarak tanımlı (`BBG, SUD, ELK, SOK, ANA, AST, KK, INM, HIP, BAY`). Ortak oyunculu sahne üreticileri: `kprScene`, `nefesScene`, `yanScene`, `bacakScene`, `kanamaScene`, `babyLap`, `thumbsTop`. Ortak KPR, derlenme ve kanama sahneleri rehbere özel kimliklerle çoğaltıldı; böylece her rehberde aynı kişiler görünüyor.

## ilk-yardim-bebek-bogulma
- Oyuncular: bebek (varsayılan sarı tulum); yardımcı kadın, topuz, siyah saç, ten 2.
- 3, 4 ve 5 (tutuş, sırt vuruşu, çevirme) yeniden çizildi. Önceden çerçeve kenarından kopuk bir kol ve uyluk görünüyordu. Şimdi yardımcı sandalyede yandan, baştan dize kadar görünüyor. Bebek yüzüstü uzak önkolunda yatıyor; önkol uyluğa dayalı, başı elde ve gövdeden aşağıda.
  - 4: yakın el yukarı kalkmış; ok, iki kürek kemiği arasına iniyor.
  - 5: yakın önkol bebeğin sırtında, el başı destekliyor; kavisli ok var.
- 6 (göğüs basısı) yeniden çizildi: yukarıdan yakın plan, bebek yardımcının uyluklarında. İki el göğsün yanlarında; iki başparmak meme hizasının hemen altında, göğüs kemiğinde yan yana. Karına bası ek çizimi gereksiz kalabalık olduğu için kaldırıldı. Spec güncellendi.
- 9: `ilk-yardim-bebek-kpr-basparmak` aynı yeni çizimle yenilendi (eller önceden kalça hizasındaydı, başparmaklar uzundu). Bu sahne bebek-kpr rehberinde de kullanılıyor.

## ilk-yardim-suda-bogulma
- Oyuncular: kazazede adam (ten 1, siyah saç); kurtarıcı adam (ten 2).
- Uzanma sahnesinde kazazede önceden çocuktu; atma sahnesinde kurtarıcı kadındı. İkisi de oyuncuya bağlandı.
- 6, 7 ve 9 rehbere özel yapıldı: `ilk-yardim-suda-nefes` (yeni yakın plan: baş geride, ağız ağza, göğüs yükseliyor, "5"), `ilk-yardim-suda-kpr`, `ilk-yardim-suda-yan-yatir`.

## ilk-yardim-elektrik-carpmasi
- Oyuncular: kazazede adam; yardımcı kadın, topuz.
- Yüksek gerilim sahnesindeki yardımcı adamdı; kadın yapıldı.
- 6: `ilk-yardim-elektrik-kpr`.
- Yüzler calm yerine neutral yapıldı.

## ilk-yardim-sok
- Oyuncular: kazazede adam (ten 0, kahve saç); yardımcı kadın, topuz.
- Battaniye sahnesindeki başörtülü yardımcı oyuncuya bağlandı.
- 5: bacak kaldırma büyütüldü. Önceden bayılma rehberiyle paylaşılıyordu ve kadın kazazede gösteriyordu; artık şok oyuncularıyla çiziliyor.
- 3: `ilk-yardim-sok-kanama`. 8: `ilk-yardim-sok-yan-yatir`.
- Bilinci açık sahnelerde yüz worried.

## ilk-yardim-anafilaksi
- Oyuncular: kazazede kadın, at kuyruğu, ten 0, haki pantolon; yardımcı adam (ten 2).
- Uyluk sahnesindeki adam kadına, pozisyon panellerindeki üç ayrı kişi aynı kadına çevrildi.
- Yatış panelinde bacak yükseltme kaldırıldı; metin yalnızca "yatırın" diyor. Spec güncellendi.

## ilk-yardim-astim
- Oyuncular: kazazede kadın, at kuyruğu, ten 1; yardımcı adam (ten 3).
- Oturuş sahnesindeki adam ve hazne sahnesindeki başka kadın oyuncuya bağlandı.
- 9: `ilk-yardim-astim-kpr`.

## ilk-yardim-kalp-krizi
- Oyuncular: yaşlı adam; başörtülü kadın yardımcı.
- Belirti sahnesindeki farklı adam yaşlı adam yapıldı.
- 9: `ilk-yardim-kalp-krizi-kpr`.
- 8 (OED getir, başka ajanın sahnesi) null yapıldı: arka planda başka kişiler var, adım teknik değil.

## ilk-yardim-inme
- Oyuncular: kır saçlı adam; uzun saçlı kadın yardımcı.
- Kol sahnesindeki yaşlı kadın oyuncuya bağlandı. İkinci etiket ("10 sn") metinde olmadığı için kaldırıldı. Spec güncellendi.
- 8: `ilk-yardim-inme-yan-yatir`.

## ilk-yardim-seker-dusmesi
- Oyuncular: adam (ten 1, koyu saç); kadın yardımcı, topuz.
- Belirti sahnesinde eller garip biçimde omuzdaydı; artık göğüs önünde, titreme çizgileriyle.
- 7: `ilk-yardim-hipo-yan-yatir`.

## ilk-yardim-bayilma
- Oyuncular: uzun kızıl saçlı kadın; adam yardımcı (ten 2).
- Kas sıkma panellerindeki üç ayrı kişi aynı kadın yapıldı.
- 5: `ilk-yardim-bayilma-bacak`. 6: `ilk-yardim-bayilma-yan-yatir`.

## Kalan şüpheler
- `ilk-yardim-suda-nefes`: burun sıkan ve çene kaldıran eller çizilmedi. Kol IK'sıyla eller yüzün üstünden geçip karışık görünüyordu. Sahne yalnızca baş geride, ağız ağza ve göğüs yükselmesini gösteriyor.
- Bebek sırt vuruşunda kit'in "flat" eli küçük boyutta yumruk gibi okunabiliyor.
- `tests/guides.test.ts` şu an `ilk-yardim-ilk-degerlendirme` (`ilk-yardim-kpr-yetiskin` spec'i yok) yüzünden kırmızı. Bu, başka ajanın rehberi; benim on rehberimin bütün art kimliklerinin spec'i var ve uzunluklar doğru.
