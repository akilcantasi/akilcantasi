# ic-iy1 — İlk yardım 1, 2. tur inceleme (2026-11-02)

Sahne dosyası: `src/art/scenes/ilk-yardim-1.tsx`. Oyuncu sabitleri (ADULT, CHILD, BABY, DER, HYT, NOB) aynen korundu.
Spec: `src/art/spec/ilk-yardim.ts` dosyasında 4 açıklama yeni çizime göre güncellendi (kurtarıcı nefes, derlenme kol/el-yanak/çevir).
Rehber `art` dizilerinde değişiklik yok, `null` yapılan çizim yok.

## Yeni bileşenler
- `CloseHead` (tilt/breath; yetişkin + çocuk): yandan baş-omuz yakın planı (s 3.4 / çocuk 4.0).
  - tilt: yardımcının bedeni yok. Alın eli üstten iner, avuç alında, parmaklar başın tepesine doğru. Çene eli sağ alttan gelir, parmak uçları çene kemiğinin altında. Önkollar kesişmez; alında geriye, çenede yukarı ok var.
  - breath: yardımcının başı ve omzu sol üstten iner. Yüzü aşağı, başının tepesi göğse doğru, böylece iki profil birbirine geçer ve burunlar çakışmaz. Ağzı kişinin ağzında. Sol üstteki el (önkolu yardımcının omzunun altından çıkar) başparmak ve işaret parmağıyla burnu sıkar. Sağ alttaki elin parmakları çene altında. Göğüste yukarı ok var.
- `BabyBreath`: aynı kurgu. Bebek sert yüzeyde, baş düz. Yardımcının ağzı ağız ve burnu birlikte kapatıyor. Bir el alında, bir parmak çene altında.
- `topView` + `BottomHand`: derlenme 3–5'te yukarıdan bakış. Yardımcının bedeni çizilmez; yalnızca alt kenardan giren önkollar ve büyük eller var, aynı kol rengiyle. Eski `TopHelper` (kafa tepesi + iki uzun kol yığını) ve ilgili yardımcılar silindi.

## Rehber başına (İYİ / ZAYIF / KÖTÜ — ilk bakış → son durum)

### ilk-yardim-ilk-degerlendirme (6 çizim): 4/1/1 → 6/0/0
- 5 baş-geri-çene (KÖTÜ): `CloseHead` tilt ile yeniden çizildi; eller alında ve çene altında net.
- 2 omuz-seslen: ZAYIF/İYİ sınırında, olduğu gibi kaldı. Yandan diz çökmüş yardımcı, eller omuzda, ses dalgaları var.

### temel-yasam-destegi (6): 3/1/2 → 6/0/0
- 3 baş-geri (KÖTÜ) ve 8 kurtarıcı nefes (KÖTÜ) yeniden çizildi (yukarıdaki gibi).

### ilk-yardim-cocuk-kpr (5): 3/0/2 → 5/0/0
- 3 baş-geri ve 4 nefes: `CloseHead` çocuk sürümüyle yeniden çizildi (baş daha az geride, köşede "5").

### ilk-yardim-bebek-kpr (bu dosyadaki 3 çizim: 2, 3, 5; 6, 8 ve 10 ilk-yardim-2'de): 1/1/1 → 2/1/0
- 5 nefes (KÖTÜ): yeniden çizildi.
- 3 baş-nötr: ZAYIF kaldı. Okunuyor (el alında, parmak çenede, ek çizimde aşırı bükülme yasak), ama eller küçük. İleride `BabyBreath` kurgusuna yaklaştırılabilir.

### ilk-yardim-oed (6): 4/2/0 → 6/0/0
- 4 ped yeri (ZAYIF): gövde oranları düzeltildi. Baş büyüdü, kollar inceldi. Sol kol yana açıldığı için ped 2 artık kolun değil, göğsün yan yüzünde, koltuk altının altında.
- 6 "herkes çekilsin": figürler biraz küçük, ama tek fikir net okunuyor. Kaldı.

### derlenme-pozisyonu (6): 3/0/3 → 6/0/0
- 3 kol: üst gövde yakın planı; iki el bilekte ve dirsekte, kol başın yanında dik açıyla bükülü, avuç yukarı.
- 4 el-yanak: kişinin elinin sırtı alttaki yanakta; yardımcının tek önkolu parmaklarıyla o eli tutuyor; turuncu daire.
- 5 çevir: bütün beden; uzak diz bükülü ve dairede; iki önkol (biri dizde, biri yanaktaki elde), dizden aşağı çekme oku.

### kanama (6): 5/1/0 → 5/1/0
- 5 turnike: ZAYIF/İYİ sınırında, değişmedi. Bant yaranın üstünde, "5–7 cm" ve "diz" etiketleri var; çekme eli biraz kalabalık.

### hava-yolu-tikanmasi (5): 5/0/0, değişmedi.

### nobet (5): 4/1/0 → 5/0/0
- 2 yastık: kişinin kolu zeminin altına giriyordu; kollar kasılma pozunda yukarı alındı. Gövde başa doğru hafifçe yükseltildi; katlanmış ceket başın altında artık görünüyor.

## Toplam
- 51 çizime bakıldı (48'i bu dosyada); 11'i yeniden çizildi ya da düzeltildi (nefes ×3, baş-geri ×3, derlenme ×3, OED ped, nöbet yastık); `null` yok.

## Öneri (ilk-yardim-2 ajanına; ben dokunmadım)
- `ilk-yardim-suda-bogulma` rehberinin `art` dizisinin 6. öğesi `ilk-yardim-suda-nefes`. Bu sahne eski nefes sorununu taşıyor; yerine `ilk-yardim-kurtarici-nefes` konabilir. Oyuncu uyuşmazlığı küçük kalır: ADULT, açık tenli adam ve esmer topuzlu kadın.

## Kalan şüpheler
- Nefes sahnelerinde yardımcının başı "tepesi göğse dönük" çizildi. Teknik olarak doğru (göğse bakıyor), ama ilk bakışta yatay bir baş gibi görünebilir.
- Bebek 3 hâlâ ZAYIF.
- Kanama 5'te turnike çekme eli biraz kalabalık.
