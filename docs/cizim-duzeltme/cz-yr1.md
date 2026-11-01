# cz-yr1 — yaralanma-1 çizim düzeltme raporu (2026-11-01)

Sahne dosyası: `src/art/scenes/yaralanma-1.tsx`. Dosyanın başında rehber başına `Cast` sabitleri var
(BRN, YNK, KRK, EZL, BAS, OMR, GOZ, DIS, GGS, KRN, UZV) ve bütün sahneler oyuncuları bunlardan yayıyor.
Ortak sahnelerin (lie-cover-blanket, cpr-adult) yerine rehberin oyuncularıyla çizen yerel üreteçler eklendi:
`coverScene(cast)`, `cprScene(cast)`, `headHold(cast)`, `noseSqueeze(cast)`, `pressScene(...)`.

## burun-kanamasi
- Oyuncu: kadın, at kuyruğu, koyu saç, ten 1 (kendi burnunu sıkıyor).
- Adım 1: erkek yerine aynı kadın. Adım 2: üreteçle. Adım 4: yeniden çizildi — "yumruk alında, ağlıyor gibi" görünen tam boy yerine adım 2'deki aynı sıkma yakın planı + saat + "10–15 dk".

## yanik
- Oyuncular: yaralı erkek ten 1 kahverengi saç; yardımcı başörtülü kadın ten 1.
- Adım 1 ve 5: ten renkleri birleştirildi (5'te yardımcı eli ten 3 idi). Adım 6: `lie-cover-blanket` → `yaralanma-yanik-ortme` (aynı oyuncular).

## kirik-burkulma
- Oyuncular: yaralı kadın uzun siyah saç ten 2; yardımcı erkek ten 0.
- Adım 4: kol teni 2. Adım 7: `yaralanma-yukari-kaldirma` (kramp rehberi de kullanıyor, dokunulmadı) yerine `yaralanma-kirik-yukari`: aynı kadın, yere bırakılmış anlamsız soğuk paket kaldırıldı. Adım 6 ortak `cold-compress` zaten ten 2/mavi kol.

## ezilme-yaralanmasi
- Oyuncular: yaralı erkek ten 2; yardımcı topuzlu kadın ten 1.
- Adım 2: defter yüzü örtüyordu, kol saati "14:20"yi kapatıyordu → defter göğüs altında, saat ikonu kaldırıldı, yazı okunuyor.
- Adım 4: yaralı yaşlı adamdı, yardımcı başka erkekti; kollar düğüm olmuştu → aynı oyuncular, yardımcı başın yanında diz çökmüş, eli omuzda, konuşuyor.
- Adım 6 → `yaralanma-ezilme-ortme`, adım 9 → `yaralanma-ezilme-kpr`.

## yaralanma-bas-travmasi
- Oyuncular: kırmızı tişörtlü, şortlu genç (boy); yardımcı topuzlu kahverengi saçlı kadın ten 0 (teal).
- Adım 2: "şınav/köprü" duruşundaki yardımcı yerine topukları üstüne diz çökmüş, öne eğik, elleri başın iki yanında (headHold). Yaralı erkek → aynı genç. Daha büyük ölçek.
- Adım 6: yetişkin = aynı yardımcı; gencin gülümsemesi kaldırıldı. Adım 8: kız → aynı genç; başörtülü kadın → aynı yardımcı.

## yaralanma-omurga
- Oyuncular: yaralı erkek ten 3; yardımcı uzun siyah saçlı kadın, haki pantolon.
- Adım 2: yaralının üstüne çıkmış gibi görünen yardımcı → yanında topukları üstüne diz çökmüş, eli omuzda, konuşuyor (yasak karesi korunuyor).
- Adım 3: `yaralanma-bas-boyun-sabitleme` başka oyuncularla idi → `yaralanma-omurga-bas-tutma`.
- Adım 7: üç kişilik önden görünüm (dirsekleri açık, kolları anlaşılmaz, turuncu "çember") kaldırıldı → yaralı battaniye üstünde, yardımcı başın arkasında battaniyeyi toplayıp vücut ekseni boyunca çekiyor; yeşil düz hat + tek ok. (Önceki yumrukları boyna gelen "omuzdan çekme" denemesi boğazlama gibi göründüğü için battaniyeye geçildi.)
- Adım 5 → `yaralanma-omurga-ortme`, adım 9 → `yaralanma-omurga-kpr`.

## yaralanma-goz
- Oyuncular: yaralı erkek ten 1 koyu saç; yardımcı elleri ten 2.
- Adım 4: kadın → aynı erkek (yasaklı yakın plan + yıkama karesi). Adım 6: saç rengi birleştirildi.

## yaralanma-dis
- Oyuncular: yaralı erkek ten 1 kızıl saç; yardımcı eli ten 1.
- Adım 4: yerleştiren el teni birleştirildi. Adım 8: ten 0 → 1.
- Adım 6: minik kız çocuğu + diş hekimi oku + boş tabela kaldırıldı → yakın plan: süt bardağında diş (yeşil tik), mendile sarılı kuru diş yasak.

## yaralanma-gogus
- Oyuncular: yaralı erkek ten 1; yardımcı topuzlu kadın ten 2.
- Adım 3 (ERC 2025 metniyle eşitlendi): sol kare artık eski "üç kenarı bantlı naylon örtü"yü gösteriyor (alt kenar açık), kırmızı çerçeve + ✗; sağ kare üstü açık yara, yeşil halka + ✓. Spec de güncellendi (eski spec "dört kenarı bantlı" diyordu).
- Adım 7 → `yaralanma-gogus-kpr`.

## yaralanma-karin
- Oyuncular: yaralı kadın uzun koyu saç ten 2; yardımcı erkek ten 0.
- Adım 2: yardımcı gülümsemesi kaldırıldı. Adım 4: karın teni 2, yasak karesindeki el teni 0. Adım 6: yaralı erkek → aynı kadın; yiyecek uzatan başörtülü yabancı → aynı yardımcı (yasakla çizili).
- Adım 7 → `yaralanma-karin-ortme`.

## yaralanma-uzuv-kopmasi
- Oyuncular: yaralı erkek ten 2; yardımcı at kuyruklu kadın ten 1 (eldivenli).
- Adım 1: `yaralanma-kanama-bastirma` (başka rehberler de kullanıyor) yerine `yaralanma-uzuv-bastirma`: bez yumruk yapılmış elin parmak tarafında. Ayrıca `yaralanma-kanama-bastirma`'da kolların X yapıp kesişmesi düzeltildi (artık V; diğer rehberlere de yarar).
- Adım 5, 7: kopan parmak teni 2. Adım 8: arkadaki minik sedye/ambulans ve havada duran etiket kaldırıldı → buzlu su kabındaki poşetin etiketine kalemle yazan el, "Ad Soyad / 14:20".
- Adım 9 → `yaralanma-uzuv-ortme`.

## Null yapılanlar
Yeni null yok (mevcut null'lar uygundu).

## Kalan şüpheler
- yanik adım 1: battaniye hâlâ "havada tahta" gibi sert; yuvarlanma ve battaniye aynı karede (iki fikir).
- Ortak `call-112`, `remove-rings`, `cold-compress`, `hospital-go` yerinde bırakıldı (yalnızca el/kol ya da genel yürüyüş; oyuncu çelişkisi küçük).
- uzuv adım 1'de parmak kopması bezin altında kaldığı için "parmak" vurgusu zayıf.
- yaralanma-goz adım 6: kapalı gözlü yüz hafif "memnun" okunabiliyor (kit `closed` ifadesi).
- `tests/guides.test.ts` şu an `yangin-elektrik-salter` yüzünden kırmızı (başka ajanın işi); kendi rehberlerim ayrı denetimle geçti.
