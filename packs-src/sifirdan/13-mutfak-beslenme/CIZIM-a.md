# Çizim raporu (a) — sifirdan-mutfak-beslenme

Batch: sc-13 · Dosya: `scenes-a.tsx` (scenes.tsx yalnız A'yı birleştiriyor) · 2026-11-02

Toplam 74 sahne: 3 kategori kapağı + 71 adım çizimi. 24 rehberin hepsi çizildi; null yapılan adım yok. `guides.ts`'teki `art` dizileri olduğu gibi kaldı. Kapsam dışı ya da çizilemeyecek ayrıntılar için 70 spec açıklaması sadeleştirildi ve çizimle eşitlendi.

## Oyuncular (`CAST`)
- **aşçı**: kadın, buğday ten, koyu topuz, yeşil uzun kollu üst. Yabani mutfak rehberleri; yakın planda `HA` el. Eldivenli el mavi filtreyle (`GHand`).
- **ambar**: bıyıklı adam, hardal üst. Kalori ve stok rehberi.
- **avcı**: kumral adam, kiremit üst. Protein açlığı; yakın planda `HV` el.
- **bakıcı** (camgöbeği, başörtülü) ve **hasta** (gri saçlı adam, mavi üst). Açlık sonrası beslenme.
- **işçi** (koyu ten, kiremit) ve **işçi2** (başörtülü kadın, yeşil). Su ve tuz rehberi.
- **anne**: mor üst, mor başörtü, ve bebek. Çocuk beslenmesi ve mama yoksa rehberleri.
- Çocuk ölçümü: yalnız kol ve ayak yakın planı. Bel üstü görünen kız, normal görünümlü ve nötr yüzlü. Ölçen eller camgöbeği (`HB`).
- **pellagra**: kısa kollu adam, kiremit üst; aynı rehberde eller `HP`.
- **diyabet**: gri saçlı, bıyıklı adam, mavi üst; yürüyüşte eşi de var.
- **tansiyon**: gri topuzlu kadın, hardal üst.
- **astım**: kızıl at kuyruklu kız; ev halkının eli `HS`.
- **sıtma**: kiremit başörtülü kadın (`SITMA`) ve kız çocuk.
- **gözlük**: yaşlı kadın (mor). **diş**: yaşlı adam (hardal). **uyku**: adam (mavi).

Paket geneli malzeme renkleri `M` içinde: metal tencere, taş ocak, un, bulgur, mercimek, mısır, palamut, kil testi ve diğerleri.

## Rehber başına çizilen adımlar (1 tabanlı)
- kurbaga-salyangoz: 2 kova, 4 et çıkarma, 7 kurbağa bacağı pişmiş/pembe
- kerevit: 4 kaynatma, 5 pişmiş/çiğ, 7 bağırsak
- isirgan-corbasi: 1 toplama, 4 haşlama, 8 çorba
- ebegumeci-gozleme: 1 yaprak, 7 iç, 8 sac
- palamut-ekmegi: 3 oran, 7 kavurma, 8 kahve
- kusburnu-alic: 4 elek, 5 tülbent, 7 tabak testi
- kit-ekmek: 2 arpa oranı, 5 tepsi, 6 çöp testi
- tek-tencere: 2 ıslatma, 3 kaynatma, 7 saman kutu
- kalori-stok: 3 kcal/100 g, 4 günlük pay, 7 ambar hesabı
- protein-acligi: 1 belirti, 4 tabak, 5 ilik
- iskorbut: 3 belirti, 6 filiz bezi, 7 filiz hazır
- pellagra-beriberi: 2 deri, 3 kireçli mısır, 7 pirinç suyu
- refeeding: 3 hesap, 4 küçük öğün, 8 izlem (nabız)
- su-tuz: 1 su içme, 4 idrar rengi, 6 gölge mola
- cocuk-beslenme: 1 emzirme, 5 lapa kıvamı, 6 çocuk kasesi
- mama-yoksa: 4 ölçü, 6 kaynatma, 8 bardakla besleme
- zayiflik-olcme: 2 orta nokta, 3 kol şeridi, 6 ödem testi
- diyabet: 4 tabak, 7 yürüyüş, 9 ayak kontrolü
- tansiyon: 2 tuz ölçüsü, 3 tuzunu alma, 8 ölçüm
- astim: 3 duman, 4 küf, 5 yatak
- sitma: 2 durgun su, 4 sineklik, 5 cibinlik
- gozluk: 1 telle onarım, 7 iğne deliği, 8 ışık
- dis-agrisi: 1 tehlike, 4 tuzlu su, 8 yumuşak yemek
- uyku-isik: 2 sabah ışığı, 3 akşam loşluğu

## Hassas konular
- **İlaç:** İlaç ya da ilaç kutusu hiçbir sahnede yok. Tansiyon sahnesinde yalnız manşon ve ölçüm aleti var.
- **Bebek beslenmesi:** Bardakla besleme doğru yol olarak gösterildi. Biberon yalnız köşe kartında, kırmızı çarpıyla.
- **Emzirme:** Beşik tutuşu, giyinik ve ölçülü çizildi.
- **Zayıflık:** Zayıf çocuk tam boy çizilmedi. Kol şeridi ve ayak yakın planı kullanıldı. Orta nokta sahnesindeki çocuk normal görünümlü. Açlık sonrası beslenmede hasta yetişkin ve bakımlı gösterildi.

## Spec'te yapılan başlıca değişiklikler
- **refeeding-izlem:** Ayak bileği ödem testi yerine bilekten nabız sayma ve "1 dk" kronometresi çizildi. Adım metni nabız ve nefes sayımını öne alıyor.
- **refeeding-hesap:** Kantar ve zayıf kişi kaldırıldı; yerine kase ve 7 günlük dizi geldi.
- **Kaldırılan ikinci paneller:** palamut-oran terazisi kase ikilisi oldu. ekmek-arpa-oran, filiz-hazir, igne-deligi ve sineklikten ikinci paneller kaldırıldı.
- **Kaldırılan ayrıntılar:** kemik-iligi'nden yağ toplanan tencere çıkarıldı. ayak-kontrol'den ayna, gozluk-tel'den pense, cibinlik'ten sıkıştıran eller çıkarıldı (yerlerine oklar kondu). yumusak-yemek'teki kişi kaldırıldı.

## Kalan şüpheler
- **sf-mb-kurbaga-pismis:** Kurbağa bacağı çifti şematik; tavuk butu gibi okunabilir. Asıl mesaj beyaz/pembe karşılaştırmasında.
- **sf-mb-emzirme:** Emzirme ipucu zayıf. Sahne "anne bebeğini kucaklıyor" gibi okunabilir; ölçülülük için bilerek böyle bırakıldı.
- **sf-mb-odem-test:** Başparmak baskısı yumruk eliyle gösterildi; ayaklar biraz taban izi gibi görünüyor.
- **sf-mb-muac-orta-nokta:** İp kolun önünde düz bir çizgi olarak duruyor; figür küçük.
- **sf-mb-bardakla-besleme ve sf-mb-refeeding-kucuk-ogun:** Kalabalık kompozisyonlar; annenin yüzü bebeğin başının arkasında kalıyor.
- **sf-mb-astim-kuf ve sf-mb-palamut-kahve:** Kol ve çaydanlık biraz iri ya da garip.
