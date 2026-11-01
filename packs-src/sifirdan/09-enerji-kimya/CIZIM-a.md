# 09-enerji-kimya — çizim raporu (harf a, batch sc-09a)

Dosya: `scenes-a.tsx` (sahneler + yardımcılar). 19 rehber, 57 rehber sahnesi + 4 kategori kapağı = 61 sahne.

## Oyuncular (CAST)
- usta: adam, teal (helper), bıyıklı, haki pantolon — kaldıraç, mikro hidro, makine kapağı
- ayse: başörtülü kadın, yeşil (bystander3), esmer — kaldıraç takoz, çamaşır, zir, kimya kapağı (gözlüklü)
- can: adam, hardal (bystander2) — palanga, rampa, mikro hidro, rüzgâr türbini
- elif: kızıl atkuyruklu kadın, mor — palanga emniyet, sarkaç
- dede: yaşlı adam (bystander4) — bocurgat
- mert: koyu tenli adam, teal — el pompası doldurma, koç pompası (el)
Malzeme renkleri sabit: ahşap K.wood, ip #d9b36c, demir #7f8a97, taş K.rock, kil #c8744a, ıslak kum #8a6337; kablo artı kırmızı, eksi siyah.

## Rehber başına çizilen adımlar (indeks 1'den)
- kaldırac: 2 örnek (1,8/0,2 m), 5 takoz, 6 el arabası. null: 1 (2 ile aynı fikir), 3,4,7,8
- palanga: 1 sabit/hareketli (1×/2×), 2 dört kollu (ölü uç üst blokta, 4 taşıyan kol), 7 emniyet (kazığa iki tur). null: 4 bağlama, 8 yasak
- rampa: 1 oran, 2 merdane, 7 yasak. null: 5 emniyet ipi (fizik olarak doğru ve okunur kompozisyon kurulamadı)
- bocurgat: 1 oran (uç görünüş, 50/10 cm, 5×), 3 kuyu, 5 mandal (diş yönü kilit yönüyle tutarlı). null: 7 yatay
- ağırlık-sarkaç: 2 ağırlıklı mil + hava freni, 3 sarkaç kurulumu, 4 ölçü 99,4 cm. null: 7 sayma
- çamaşır: 2 kova kesiti + piston (adım 1'in çizimi kaldırıldı, kesit ikisini birlikte gösteriyor), 4 çalkalama, 6 burma
- zir: 2 kesit, 5 gölge/güneş, 6 sulama. null: 1 testiler
- su çarkı: 2 debi kovası, 4 üstten dolan, 5 alttan çarpan. null: 1 düşü, 7 savak
- su değirmeni: 1 genel kesit, 3 yatay çark, 4 taşlar. null: 2 oluk, 6 ambar
- yel değirmeni: 1 çok kanatlı pompa, 2 Ege bez yelkenli, 5 pompa çubuğu kesiti. null: 4 kuyruk, 8 fırtına
- el pompası: 2 emme (≤7 m), 3 derin kuyu (≈30 m), 5 doldurma. null: 4 dip klapesi, 8 kuyu ağzı
- koç pompası: 1 genel şema, 5 klapeler (hava odası dahil), 8 çalıştırma. null: 3 boru, 6 hava odası
- mikro hidro: 1 hortumla düşü, 4 türbin tipleri, 7 bağlantı şeması (G→diyot→sigorta→akü, sapma + ısıtıcı). null: 2 debi (su çarkındaki sahne), 6 boru
- rüzgâr türbini: 1 yer (9 m+), 4 menteşeli direk + vinç, 5 boşaltma şeması (köprü diyot). null: 7 fren, 8 yasak
- kablolama: 6 sigorta yeri (ana sigorta akü artısının hemen yanında, kollarda küçük sigortalar), 8 kısa devre, 9 bağlama sırası. null: 3 kesit, 7 pabuç
- akü: 2 ölçüm 12,24 V, 6 havadar şarj, 7 saf su ekleme (seviye çizgisi plakaların üstünde). null: 3 yarım
- güneş: 2 seri, 3 paralel, 7 sigorta (15 A). null: 8 örtü, 9 gölge
- şarj kontrol: 3 önce akü (aküye yakın sigorta), 4 sonra panel (örtülü, artıda sigorta), 6 yük çıkışına lamba. null: 1 seçim, 7 sökme
- invertör: 2 dalga biçimi, 5 kısa kablo + akü yanında büyük sigorta + anahtar kapalı, 7 kendi prizi / erkek-erkek fiş yasak. null: 1 toplam, 4 kablo (5'te gösteriliyor)
- Kapaklar: makine, su-rüzgâr, elektrik, kimya.

Bütün elektrik şemalarında kırmızı/siyah hatlar kesişmeyecek biçimde yönlendirildi.

## spec.ts
Çizilen bütün kimliklerin açıklaması çizime göre güncellendi (sadeleştirmeler: ağırlık-mil şiş/kayış kaldırıldı; kontrol-yuk yalnız lamba, invertör kısmı metinde; pompa-doldurma iki elle kova; invertor-priz direkteki usta kaldırıldı).

## Kalan şüpheler
- zir-sulama: maşrapayı tutan el biraz garip açıda; anlam okunuyor.
- yel-pompa-cubugu: çark yandan ince elips; uzman olmayan için zor okunabilir.
- turbin-direk: vinç ipi diz çökmüş kişinin arkasından geçiyor; halatlar sade.
- koc-klapeler / degirmen-cark: teknik kesitler, stres altında 2 saniyede okunması zor ama yanlış değil.
- Kategori kapakları için ayrı inceleme aracı yok; /tmp/sc-09a/ids.mjs ile çekildi.
