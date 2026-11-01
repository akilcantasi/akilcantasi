# Çizim düzeltme — batch cz-hg (hava + güvenlik + ulaşım)

Sahne dosyaları: `src/art/scenes/hava.tsx`, `src/art/scenes/guvenlik-ulasim.tsx`.
Her iki dosyanın başında rehber başına `CAST` sabitleri var (hava: `SC, FY, KF, CG, TZ, HR, SD, DL`; güvenlik-ulaşım: `KC, YD, CK, BE, YB, TK, KM, SU, AA, TN`).
Bu turda hiçbir çizim null yapılmadı; daha önce null olan adımlar (soyut/metin adımları) null kaldı. Ortak sahnelerden `call-112`, `battery-radio`, `gas-valve-off` el/nesne sahneleri olduğu için korundu.

## Yeni rehbere özel sahneler (ortak sahne yerine)
- `sicak-yan-yatir` (sicak-carpmasi 8; `recovery-position` yerine), `firtina-kpr` (firtina-yildirim 8; `cpr-adult` yerine), `cig-kpr` (hava-cig 10; karda KPR, `cpr-adult` yerine). Ortak `CprScene` yardımcısı.
- `ulasim-kaza-reflektor` (trafik-kazasi 2; çarpışmış iki araçlı reflektör sahnesi), `ulasim-kaza-battaniye` (trafik-kazasi 9; `lie-cover-blanket` yerine), `ulasim-tunel-deprem` (tunel-kopru yeni 10. adım).
- Spec satırları `src/art/spec/hava.ts` ve `src/art/spec/ulasim.ts` içine eklendi.

## Rehberler
**sicak-carpmasi** — Oyuncular: yaralı erkek (mavi, ten 1, koyu saç), yardımcı kadın (turkuaz, topuz), 2. yardımcı erkek (hardal). Adım 2 yeniden çizildi (eskisi: iki kişinin taşıdığı yaralı karmaşık/iç içeydi → yardımcı kolunu omzuna alıp belinden sararak gölgeye yürütüyor). 4: yaralı büyütüldü, yardımcı gülümsemiyor. 5: yelpaze sopa gibi görünüyordu → el yelpazesi; atkılı yeşil kafa düzeltildi. 6: oyuncu rengi. 8: kendi derlenme sahnesi.
**firtina-yildirim** — "Sen": kadın, turkuaz, topuz, ten 2; yıldırım çarpan: erkek mavi. Adım 1, 2, 4, 6, 7 oyuncuya çevrildi (önce her adımda başka kişi vardı); 6 tek yüzücüye indirildi; 8 kendi KPR sahnesi.
**hava-kar-firtinasi** — "Sen": mavi montlu erkek. Adım 2 yeniden çizildi (dış kesitte minicik figürler → iç mekânda sobanın yanında battaniyeli aile, "sen" kullanılmayan odanın kapısını kapatıyor). 7 ve 10 oyuncuya çevrildi.
**hava-cig** — Yakalanan: kırmızı montlu erkek; kurtarıcı: turkuaz at kuyruklu kadın. Adım 2 yeniden çizildi (dağ tepesinde kayan minik figür → büyük figür akışın yanına kaçıyor). Adım 4 (`hava-cig-nefes-boslugu`) yeni metne göre yeniden çizildi: bir el ağız-burunda, yüz önünde hava boşluğu, diğer kol yüzeye dik uzanıyor + yukarı ok. Adım 9 yeniden çizildi (üç kişi ve minicik gömülü figür → kesitte sonda kişiye değiyor, kurtarıcı kazıyıp yüzünü açmış). 10 karda KPR.
**hava-toz-firtinasi** — "Sen": kırmızı başörtülü kadın (mor). Adım 3 maske/gözlük yakın planı aynı kişiye çevrildi; adım 1 gülümseme kaldırıldı.
**hava-hortum** — "Sen": mavi erkek. 1, 7, 9 oyuncuya çevrildi (7'de kadın, 9'da başka erkek vardı).
**hava-sicak-dalgasi** — "Sen": turkuaz topuzlu kadın. 1, 2 (yaşlı adam yerine), 8 oyuncuya çevrildi.
**hava-dolu** — "Sen": mavi erkek + kız çocuk. 3 ve 5 oyuncuya çevrildi.
**guvenlik-kayip-cocuk** — Anne/bulan: pembe başörtülü kadın; çocuk: kahverengi saçlı oğlan, kiremit tişört (fotoğraftakiyle aynı). Adım 4'teki kız → aynı çocuk; 9'daki kol rengi/tişört aynı çocuğa göre. Polis gülümsemesi kaldırıldı.
**guvenlik-yardim-dolandiriciligi** — "Sen": yeşil üstlü topuzlu kadın. Adım 3 `guvenlik-izin-sorgu` metne uymuyordu (web sorgu ekranı) → yeniden çizildi: bağış kutusu tutan kişiye konuşma balonunda mühürlü izin belgesi + "?" ile soruluyor; spec güncellendi. 1, 5 el kolları ve 6 (erkek yerine) oyuncuya çevrildi.
**guvenlik-cadir-kent** — "Sen": mavi başörtülü kadın; arkadaş: uzun saçlı kadın; çocuk. 2 ve 4 (bıyıklı adam yerine) oyuncuya çevrildi; kuyruktaki ikinci başörtülü kadın karışmasın diye başka kişiye çevrildi.
**guvenlik-bos-ev** — "Sen": mavi tişörtlü, mavi sırt çantalı erkek. 3 (eller), 5, 7 oyuncuya çevrildi.
**guvenlik-yanlis-bilgi** — Yalnızca eller; kol rengi birleştirildi.
**ulasim-trafik-kazasi** — "Sen": yelekli erkek; yaralı: mavi erkek; 2. yardımcı: yeşil at kuyruklu kadın. Adım 2 çarpışmalı reflektör sahnesi; 5'te sürükleyen ve küçük karedeki yardımcı aynı kişi, yaralı gülümsemiyor; 8 oyuncular; 9 kendi battaniye sahnesi.
**ulasim-reflektor-mesafe** (ariza-aku 3) — yeniden çizildi: reflektörler çimde değil aynı şeritte, aracın arkasında ve önünde; arkadan gelen araç kesik değil görünür; tek etiket "30 m / 150 m".
**ulasim-karda-mahsur** — "Sen": kırmızı montlu erkek; 1'deki yürüyen ve 3–4'teki eller buna çevrildi.
**ulasim-suya-dusen-arac** — "Sen": turkuaz topuzlu kadın + büyük kız + küçük oğlan. 2–4 eller, 6 (erkek yerine) oyuncuya çevrildi.
**ulasim-ariza-aku** — "Sen": yelekli erkek; aile bariyer arkasında aynı kişiyle; akü ellerinin kolu yelek rengi.
**ulasim-tahliye-surus** — İnsan oyuncusu yok, değişiklik gerekmedi.
**ulasim-tunel-kopru** — "Sen": mavi erkek. 6 (kadın+çocuk yerine) ve 8 oyuncu; 10 yeni: tünelde aracın yanında yan yatıp dizleri karna çekmiş, elleri baş-ensede.

## Kalan şüpheler
- `hava-hortum-ic-oda`: ev kesiti olduğu için figürler küçük; anlaşılır ama %60 kuralının altında.
- `hava-cig-yana-kac`: çığ dili biraz "karlı dağ" gibi okunabiliyor; aşağı oklar akışı gösteriyor.
- `ulasim-tunel-deprem`: yan yatış önden-yan pozla çizildi; büzülme net, ama "yan" mı "sırt" mı tartışılabilir.
- Ağır sistem yükü yüzünden bazı rehber paftaları dev sunucudan geç alındı; galeri çekimleriyle de doğrulandı.
