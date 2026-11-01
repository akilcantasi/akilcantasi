# Çizim raporu — b ajanı (batch sc-10b)

Dosya: `scenes-b.tsx`. 21 rehber, 63 sahne (rehber başına 3). Kategori kapakları a ajanında.
Kontroller: derleme 0 uyarı / 0 hata, `check-sifirdan` → hata yok, tsc temiz. Bütün paftalar görüldü.

## Oyuncu kadrosu (`C`, paket geneli)
- elif: kadın, açık ten, uzun kahve saç, camgöbeği üst
- mehmet: adam, esmer, siyah saç, bıyık, hardal üst
- zeynep: kadın, koyu ten, topuz, mor üst
- hasan: yaşlı adam (gözlük, bıyık), kiremit üst
- fatma: yaşlı kadın, başörtülü, esmer, yeşil üst
- emre: adam, açık ten, kızıl saç, yeşil üst
- yusuf: adam, koyu ten, mavi üst
- selin: tekerlekli sandalye kullanan kadın, mor üst
- çocuklar: can (oğlan, esmer), deniz (kız, sarışın), ali (oğlan, koyu ten), ayşe (kız, siyah at kuyruğu)
- TRAV: yoldan gelen yabancı (yeşil-haki üst, sırt çantası); nöbet ve yabancılar rehberlerinde aynı kişi

Malzeme renkleri `M` sabitinde (kütük, uç yüzü, demir, taş, toprak, ip).
Topluluk sahnelerinde yaş, cinsiyet ve ten çeşitli. Silahlı ya da tehdit eden figür yok.

## Rehber başına çizilenler (adım no.)
- patika-acma: 1 yarım kuralı, 4 dal kesimi, 6 su kesici
- basit-kopru: 3 kütük döşeme, 7 ip korkuluk, 8 yük testi
- topluluk-kurma: 1 ilk toplantı, 3 kurallar panosu, 5 görev panosu
- karar-alma: 4 kartlar, 7 arabulucu, 9 anlaşma
- nobet-duzeni: 2 iki nöbetçi, 4 nöbet yeri, 6 selam
- takas: 2 emek saati, 3 pano, 4 defter
- ortak-ambar: 1 raflar, 3 giriş/tartı, 4 ilk giren ilk çıkar
- ortak-mutfak: 4 kazan, 6 kepçe, 8 üç kap
- cocuk-egitim-duzeni: 1 alan, 2 iki yetişkin, 8 ad kartı
- yasli-engelli-bakim: 3 pozisyon, 6 dik oturma, 7 baston
- beceri-envanteri: 1 görüşme, 4 kart, 6 usta-çırak
- uzun-donem-ruh-sagligi: 3 yoldaş, 4 anma taşı, 5 dinleme halkası
- yabancilarla-karsilasma: 2 eller görünür, 4 su ikramı, 8 geri adım
- ritual-moral: 3 ortak akşam, 6 kuyu kutlaması, 8 hikâye
- uzun-sureli-kamp: 1 yer seçimi, 4 tuvalet mesafesi, 6 su yukarı/aşağı
- yabani-hayvanlarla-yasam: 2 yiyecek asma, 4 ağıl ve köpek, 7 eldiven
- kis-hazirligi: 3 istif, 5 kuru/yaş odun, 7 yalıtım
- yaz-hazirligi: 2 gölgelik, 4 su içme, 8 durgun su
- yangin-mevsimi: 1 kuşak planı, 2 10 m alanı, 3 budama
- sel-heyelan-yerlesim: 1 yer seçimi, 2 sel izleri, 5 hendek
- orman-surdurulebilir: 2 baltalık, 5 çit, 6 yüksek budama

## Null yapılanlar (3 sınırı ya da zayıf görsel değer)
patika-temizlik, patika-ters-egim, kopru-basamak-tasi, kopru-iki-kutuk, topluluk-haftalik, karar-yontem-panosu, nobet-defter, takas-bulusma, ambar-kaplar, ambar-tohum, mutfak-ekip-listesi, mutfak-yemek-gotur, cocuk-gunluk-duzen, cocuk-ders, bakim-sorma, bakim-cilt-kontrol, beceri-liste, ruh-gunluk-duzen, yabanci-karsilama-ekibi, yabanci-bekleme-yeri, ritual-hasat, kamp-alan-plani, kamp-el-yikama, yaban-uclu-plan, yaban-yigin-uzak, kis-odun-hesap, kis-istif-mesafe, yaz-is-saati, yangin-sondurme, yangin-kacis, sel-belirtiler, sel-dere-gozlem, orman-parsel, orman-fidan (34). Spec satırları duruyor, ileride çizilebilir.

## Spec'te sadeleştirilenler
karar-anlasma (tek el imzalıyor), bakim-pozisyon (bakıcı yok, destek battaniyeleri ve dönüş oku), kamp-tuvalet-mesafe (yeraltı suyu kesiti yok), patika-su-kesici (düz yukarıdan bakış), nobet-yeri, nobet-iki-kisi, ambar-giris, ambar-ilk-giren, mutfak-uc-kap, cocuk-alan, cocuk-iki-yetiskin, yabanci-geri-adim, ritual-ortak-aksam, ritual-kuyu-kutlama, yaban-agil-kopek, yaban-eldiven, kis-istif, kis-kuru-odun, kis-yalitim, yaz-durgun-su, yangin-kusak-plan, yangin-budama, sel-hendek, orman-cit, orman-yuksek-budama, kopru-yuk-testi, takas-emek-saati, patika-yarim-kurali, topluluk-kurallar.

## Kalan şüpheler
- bakim-pozisyon: yan yatan figür küçük ve biraz karışık; okunuyor ama en zayıf sahne.
- bakim-dik-oturma: yastık ve battaniye şekilleri kaba.
- karar-anlasma: kalem tutan el biraz yumruk gibi.
- patika-su-kesici ve sel-hendek yukarıdan şema; stresli okur için soyut olabilir.
- kis-kuru-odun: kuru/yaş farkı yalnız renk, çatlak ve damlayla veriliyor.
- yangin-kusak-plan: halkalar ölçekli değil, yalnız etiketlerle.
