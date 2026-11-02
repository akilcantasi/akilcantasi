# 15-hayvan-tarim-ek — çizim raporu (a)

Paket: sifirdan-hayvan-tarim-ek · 16 rehber · 48 rehber sahnesi + 2 kategori kapağı = 50 sahne · `scenes-a.tsx`.
Kontroller: derleme 0 uyarı / 0 hata; `check-sifirdan` → hata yok; tsc (strict, noUnusedLocals) temiz.

## Oyuncular (dosya başında sabitler)
- KT (köpek 1): at kuyruklu kadın, camgöbeği üst, kot. Köpek: kahverengi, kırmızı tasma.
- KS (köpek 2): bıyıklı esmer çoban, kiremit üst. Yavru/köpek: krem, koyu maskeli (Kangal/Akbaş).
- KI (köpek 3): yeşil üstlü adam, haki pantolon. Köpek: koyu kahve, kırmızı koşum, mavi kayış.
- KD (kedi): başörtülü kadın, hardal üst (yalnız eldivenli kolu görünür). Kedi turuncu.
- AE (at-eşek): mor üstlü genç adam; hep aynı gri eşek, mavi yular.
- TY (toynak): camgöbeği üstlü bıyıklı adam; doru at, mavi yular.
- GV (güvercin): yaşlı adam, yeşil üst.
- DG (doğum 1–3 ve yeni doğan): topuzlu kadın, kiremit üst, mavi eldiven. Koyun hep aynı (krem yün, açık yüz), kuzu beyaz.
- PS (pancar): mor kolluk (yalnız el). GS (gri su): hardal üstlü adam.
- Malzeme renkleri sabit: saman, tahta, toprak, taş, yün, eldiven, iyot.

## Rehber başına çizilen adımlar
- kopek-temel: 1 ödül parçaları, 4 otur, 5 gel. (Spec'te "gel" adam idi; aynı kadın yapıldı.)
- kopek-bekci-suru: 1 yavru koyunlar arasında, 2 güvenli köşe (yukarıdan), 5 kovalamaya "HAYIR!" ve tasmadan geri çekme. Saldırgan köpek yok; sopa yok.
- kopek-iz: 1 koşum (yanlış: boyun tasması ek resmi), 3 ayak izlerinde yiyecek (60 cm, 3–12 m), 4 burun yerde.
- kedi-kemirgen: 1 ambar, 2 kapalı kap / açık çuval, 6 eldivenle kum temizliği ("her gün").
- at-esek-egitim: 4 baskı-bırakma (2 panel, sıpa), 5 önden çekme yanlış / omuz yanında yürütme doğru (2 panel), 6 ayak kaldırma (eşek).
- toynak: 1 YENİ `sf-ht-toynak-baglama` (göz hizasında direğe bağlı at, çömelmeden belden eğilmiş kişi), 2 kazıyıcı, 6 kerpetenle duvar kesimi (+ taban oyma ek resmi).
- guvercin: 1 yuva gözleri (30 cm), 6 kuluçka (17–18 gün), 9 ıslak temizlik + bez (kuru süpürme ek resmi).
- dogum-hazirlik: 2 belirtiler, 3 doğum bölmesi (1,2 m), 7 normal geliş (şema).
- dogum-zor: 3 eldivenli koni el, 4 U/Z bacak şeması, 8 çekme yönü (aşağı yay).
- dogum-yenidogan: 1 ağız-burun temizleme, 2 samanla ovma, 4 göbeğe iyot.
- ipekbocegi: 4 genç larva (26–28 °C), 8 kozalık, 9 buharla boğma (10–15 dk).
- pancar-seker: 3 tepe kesimi, 4 ince dilim + sıcak su, 8 köpük alma.
- baltalik: 3 parseller, 5 kütük kesimi (doğru/yanlış), 7 sürgün + çit + keçi yasak (4 yıl).
- fidanlik: 2 su testi, 4 soğuklatma (1–5 °C, 3 ay), 7 tel örtü.
- gri-su: 1 kaynaklar (ikon), 5 malçlı çanağa dökme, 6 hangi bitki (ikon).
- kurak-tarim: 1 malç kalınlığı, 4 ekim çukuru, 5 taş set (yandan kesit).
- Kapaklar: sf-ht-kapak-hayvan, sf-ht-kapak-tarim.

## Null yapılan / kaldırılan
- `sf-ht-toynak-aci-cizgi` (toynak 5. adım) kaldırıldı, art null; yerine 1. adım güvenlik sahnesi çizildi (rehber başına 3 sınırı). Spec satırı silindi, `sf-ht-toynak-baglama` eklendi.
- Diğer null'lar paketteki önceki seçimle aynı kaldı.

## Spec sadeleştirmeleri
Çizilen hâle göre güncellendi: köpek gel (aynı kadın), güvenli köşe (koyun girişinde çarpı yok), kovalama (yasak işareti yerine "HAYIR!" etiketi ve geri çekme), at sahneleri (sıpa/eşek, iki panel yandan), toynak kesim ("oyma" yazısı yerine ek resim), doğum ve yeni doğan (sallama ek resmi yok, iyot etiketi), kum temizliği ("her gün"), taş set (yandan kesit), ekim çukuru (üstten şema yok).

## Kalan şüpheler
- Ayak kaldırma / toynak bağlama: kişi atın omzunun önünde durduğu için kaldırılan bacak kişinin kolları arasında; okunuyor ama kalabalık.
- Çekme yönü: kuzunun yalnız burnu ve ayakları görünür, eldivenli eller üstünde; ok doğru (aşağı ve dışarı) ama sahne küçük.
- Güvenli köşe (yukarıdan) ve kapak-hayvan köpeği: yavru/köpek yüzü basit; tür (Kangal) ayırt edilmiyor.
- Kum temizliğinde eldivenli elin küreği tutuşu biraz yapay.
- İpekböceği larvaları ölçek gereği küçük çubuklar gibi.
