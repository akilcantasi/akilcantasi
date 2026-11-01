# Çizim inceleme (2. tur) — ic-dy (deprem, sel, yangın, tesisat)

Dosyalar: `src/art/scenes/deprem.tsx`, `sel.tsx`, `yangin.tsx`, `tesisat.tsx`; art dizileri `src/content/guides/sel.ts`, `yangin.ts`; spec `src/art/spec/deprem.ts`, `sel.ts`, `yangin.ts`, `tesisat.ts`.
Toplam 34 rehber, 179 çizim incelendi. Sınıflar ilk bakıştaki durumdur; ZAYIF/KÖTÜ olanların hepsi yeniden çizildi ya da kaldırıldı.

## Ortak düzeltme: Çök-Kapan-Tutun duruşu
`POSE.dropCover` yerine `deprem.tsx` içinde `coverP()` yardımcı fonksiyonu: dizler kalçanın tam altında ve yerde, sırt yere paralel, baş öne-aşağı; ön kolun eli ensede (IK ile ense–baş arasına), arka kol yerde ileri uzanmış ya da `{to}` ile masa ayağını kavrıyor. Yan görünüşte artık "eller ve dizler üzerinde" net okunuyor. Kullanıldığı sahneler: deprem-kapan-masa, deprem-yuksek-masa, deprem-koltuk-yani, deprem-tutun-masa, deprem-acik-alan, deprem-kalabalik-kosma, deprem-magaza-raf, deprem-stadyum-koltuk, deprem-cocuga-seslen (çocuk). `COVER2` kaldırıldı.

## Rehber başına (İYİ / ZAYIF / KÖTÜ, ilk durum)
- **deprem-aninda** 3/4/0 — kapan-masa, tutun-masa, koltuk-yani yeni duruşla; acik-alan: kişi büyütüldü (s 1.45), bina/ağaç/direk küçük arka planda.
- **deprem-sonrasi** 6/0/0 — değişiklik yok.
- **enkaz-altinda** 3/1/0 — enkaz-dinle: enkazdaki kişinin dolanmış kolları yerine yumruğuyla zemine vuruyor, yumrukta ses dalgası.
- **enkaz-kurtarma** 5/1/0 — kurtarma-takoz: kaldıracın altındaki ikinci gönüllü kaldırıldı (gövdeler üst üste biniyordu); tek gönüllü kaldıraçta, takoz zeminde turuncu okla yükün altına.
- **deprem-kalabalik-alan** 2/1/2 — stadyum (KÖTÜ, minik figürler) yeniden: tek büyük kişi kendi koltuğunun önünde, iki sıra arasında çökmüş. metro (KÖTÜ, direk görünmüyordu): direkler koyulaştırıldı/kalınlaştırıldı. kosma ve mağaza yeni duruşla.
- **deprem-hasarli-bina** 4/1/0 — kolon-catlak: yasak işareti kolonun üstünden kapının üstüne alındı; ok/çarpı kaldırıldı ("çatlak kolon → girme").
- **deprem-cocuklar** 3/1/1 — bebek-gogus (KÖTÜ, yumak) yeniden: anne masa altında topukları üstünde, bebek iki kolla göğsünde, baş bebeğin üstüne eğik. cocuga-seslen: çocuk yeni duruşla.
- **deprem-yuksek-bina** 5/1/0 — yuksek-masa yeni duruşla.
- **sel** 5/0/1 — sel-elektrik-teli: kişi kopuk tele doğru bakıyordu (ok tersini gösteriyordu); şimdi sola, uzaklaşıyor.
- **heyelan** 4/0/0, **sel-tsunami** 5/0/0, **sel-akintiya-kapilma** 5/0/0, **sel-camur-akisi** 5/0/0, **sel-uyarisi** 4/0/0 — değişiklik yok.
- **sel-sonrasi-temizlik** 5/1/0 — ortak `wash-hands` (farklı ten/kol) yerine rehbere özel `sel-sonrasi-el-yika` (ST'nin teni ve turkuaz kol).
- **sel-arac** 3/1/1 — arac-kemer (KÖTÜ, kemeri ekran dışından gelen üçüncü bir el çözüyordu): sürücünün kendi eli tokada. arac-cam: anlamsız yeşil yukarı ok yerine camın indiğini gösteren turuncu aşağı ok.
- **yangin** 5/1/0 — 9. adım üç kareli küçük şerit yerine tek büyük yuvarlanma sahnesi (`yuvarlan(YNG)`; giysi-tutustu'daki sahneyle ortak fabrika).
- **orman-yangini** 5/0/1 — orman-arac (araç kesiti, ne olduğu okunmuyordu; havalandırma simgesi metinde yok): bir deneme sonrası **null**.
- **yangin-sondurucu** 5/0/0, **yangin-elektrik** 4/0/0, **yangin-arac** 5/0/0, **yangin-kacis-plani** 4/0/0 — değişiklik yok.
- **yangin-yag** 4/1/0 — yag-battaniye: alevler battaniyenin üstüne çiziliyordu (battaniye yanıyor gibi); şimdi alevler battaniyenin arkasında/altında.
- **yangin-yuksek-bina** 5/1/0 — pencere-isaret: cepheyi çapraz kesen kırmızı-beyaz itfaiye merdiveni kaldırıldı.
- **yangin-duman-solunmasi** 3/2/0 — duman-kpr ve duman-derlenme büyütüldü (s 1.45/1.5; boş gökyüzünde küçük figür).
- **yangin-giysi-tutustu** 4/0/0 — yuvarlan sahnesi fabrikaya çevrildi, görünüm aynı.
- **tesisat-gaz-kacagi** 4/1/0 — disaridan-187: gövde boyunda dev telefon yerine telefon kulakta, üstte "187" etiketi.
- **tesisat-elektrik-kesintisi** 6/0/0, **tesisat-jenerator** 6/0/0, **tesisat-boru-patlamasi** 5/0/0, **tesisat-arabada-sarj** 4/0/0, **tesisat-gunes-powerbank** 5/0/0, **tesisat-tup-guvenligi** 5/0/0, **tesisat-hasarli-elektrik** 6/0/0 — değişiklik yok.

## Özet
- Yeniden çizilen/düzeltilen: 24 çizim (9'u ortak Çök-Kapan-Tutun duruşu).
- Null yapılan: 1 (orman-yangini 7, `yangin-orman-arac`).
- Yeni kimlik: `sel-sonrasi-el-yika` (spec eklendi). Değişen sahnelerin spec açıklamaları güncellendi.
- Kontroller: tsc bu dört dosyada temiz; `tests/guides.test.ts` 191/191.

## Kalan şüpheler
- `yangin-kapi-dokun` / `yangin-bina-kapi-dokun`: profil el anatomik olarak doğru (başparmak izleyiciye, el sırtı kapıda) ama küçük boyda avuç gibi de okunabilir.
- deprem-kalabalik-kosma ve deprem-cocuga-seslen hâlâ iki fikirli (yanlış + doğru) ve kalabalık; okunuyor.
- Yatan figürlü sahnelerde (yuvarlan, giysi-yat, yanmış alan) kişi doğal olarak yüksekliğin %60'ından az.
- orman-yangini 7 (araçta battaniye altında eğilme) artık çizimsiz; iyi bir kesit çizimi gerekiyorsa ayrıca ele alınmalı.
