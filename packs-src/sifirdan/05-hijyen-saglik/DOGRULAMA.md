# Sıfırdan: Hijyen ve sağlık — bağımsız doğrulama raporu

Tarih: 2026-11-02 · 23 rehber · Denetim: `npx -y tsx tools/check-sifirdan.ts 05-hijyen-saglik` → "hata yok"
Arama kotası: 6 WebSearch kullanıldı; doğrulama çoğunlukla WebFetch ile birincil belgeler açılarak yapıldı.

## Özet sayım
- DÜZELTİLDİ: 6 (olum-defin, cukur-tuvalet, kirec, sivi-kaybi, gebelik-dogum, bit-pire-uyuz)
- TEYİTLİ: 1 (cop)
- ZAYIF KALDI: 16 (bu turda kaynakları yeniden açılmadı ya da kaynak bulunamadı; 3'üne eksik `note` eklendi)
- ÇIKARILDI: 0

## Rehber başına sonuç

| Rehber | Sonuç | Gerekçe |
|---|---|---|
| sf-hs-olum-defin | DÜZELTİLDİ | Mezar mesafesi, derinlik ve yeraltı suyu kuralı WHO TN8, WHO "Risks posed by dead bodies", WHO SSS ve Somali kolera defin rehberiyle yeniden yazıldı. Kaynaksız "üstte 1 m toprak" kaldırıldı. |
| sf-hs-cukur-tuvalet | DÜZELTİLDİ | WEDC G025 ve MSF Ek 14 sayıları teyit edildi; Sphere (IFRC özeti) ile evden 6–50 m eklendi. |
| sf-hs-kirec | DÜZELTİLDİ | Eawag belgesi yeniden okundu: bulamaç oranı, dozun yerelde belirlenmesi, 30 dakikada bir pH ölçümü, koruyucu donanım ve amonyak eklendi. |
| sf-hs-sivi-kaybi | DÜZELTİLDİ | Ev tarifi teyit edildi ve "gözyaşından tuzlu olmamalı" kontrolü eklendi; hazır WHO düşük ozmolar ORS paketi eklendi; Plan A dışkı başına miktarlar ve kusmada 10 dakika bekleme eklendi; doğrulanamayan "ayran" çıkarıldı. |
| sf-hs-gebelik-dogum | DÜZELTİLDİ | Doğum seti PATH/WHO "6 temizlik" ilkesine göre tamamlandı (sabun, ~1 m² naylon, 2 ip, yeni jilet); "doğum yoluna temiz olmayan bir şey sokmayın" uyarısı eklendi. |
| sf-hs-bit-pire-uyuz | DÜZELTİLDİ | Sayılar teyit edildi (CDC 54 °C, 5–10 dk, 2 hafta; WHO 4–6 hafta, 1 hafta torba, böbrek). İlaç dozu yok, teyit edildi. Eksik `note` eklendi. |
| sf-hs-cop | TEYİTLİ | WHO TN7: 0,1 m ara örtü, ≥0,5 m son örtü, çit, ateş yasağı. 30 m su mesafesi TN7'de yok; tuvaletten benzetme olarak kaldı (tutucu). |
| sf-hs-sinek-kemirgen | ZAYIF KALDI | Bu turda yeniden açılmadı. Fare zehri ve veba için `note` eklendi. |
| sf-hs-sedye | ZAYIF KALDI | Askeri ilk yardım kaynağı hâlâ yok. Omurga riski için `note` eklendi. |
| sf-hs-yatalak-hasta | ZAYIF KALDI | Bu turda yeniden açılmadı. `note` eklendi. |
| sf-hs-atel-degnek | ZAYIF KALDI | Tutamak yüksekliği, kılcal dolum süresi (2 sn) ve 6 hafta için resmî kaynak yok. |
| Diğer 12 rehber (kompost-tuvalet, el-yikama, kul-suyu, sabun, camasir, dis, kadin-hijyeni, bebek-bezi, yara-bakimi, enfeksiyon, atesli-hasta, karantina) | ZAYIF KALDI | Kota yüzünden kaynakları bu turda yeniden açılmadı. Sayılar bilinen değerlerle çelişmiyor. `checked.note` buna göre dürüstçe yenilendi. |

## Önce → sonra

### sf-hs-olum-defin
- Adım 6
  - Önce: "içme suyu kuyusundan en az 250 metre, pınar ve dereden en az 30 metre uzakta…"
  - Sonra: "içme suyu kuyusu, pınarı ve deresinden olabildiğince uzak… Tutucu hedef birkaç mezar için en az 200 m, çok sayıda ölü için 250–350 m. Arazi izin vermiyorsa kolera gibi bulaşıcı ölümlerde en az 50 m; hiçbir durumda 30 m'den yakına kazmayın…"
- Adım 7
  - Önce: "en az 1,5 m derin… Kazarken su çıkarsa başka yer seçin. Cesedin üstünde en az 1 m toprak…"
  - Sonra: "en az 1,5 m derin. Taban yeraltı suyundan en az 2 m yukarıda kalmalı: toprak ıslanıyor ya da su sızıyorsa, ya da yakın kuyularda su yüzeye 3,5 m'den yakınsa başka yer… Çukuru tamamen doldurup tümsek yapın."
- Adım 4: bedeni naylona sarma eklendi; defin ölüm yerine yakın, kısa sürede ve az kişiyle yapılacak.
- Spec `sf-hs-defin-yer`: "250 m / 30 m" → "200 m+" ve "asla 30 m'den yakın değil".
- Spec `sf-hs-defin-derinlik`: "üstte 1 m" → "2 m+" (yeraltı suyu boşluğu).
- Kaynakların durumu:
  - TN8 tam metni okundu. TN8, kullanıcının belirttiği 50 m'yi değil, 200/250/350 m'yi ve 2 m yeraltı suyu boşluğunu veriyor.
  - 30 m ve 1,5 m (0,7 m doymamış bölge ile) WHO "Risks posed…" sayfasından.
  - 50 m, Somali WASH kolera defin rehberinden.
  - Hesperian kolera notu 30 m diyor.
  - En tutucu değer hedef, 50/30 m alt sınır yapıldı.

### sf-hs-cukur-tuvalet
- Adım 2
  - Önce: "Evlerden biraz uzak ama gece yürünebilecek yakınlıkta"
  - Sonra: "Evlerden en az 6 m uzakta, 50 m'den yakın"
- 30 m ve 1,5 m değişmedi; Sphere (IFRC özeti), MSF ve WEDC ile teyit edildi.

### sf-hs-kirec
- Adım 2: lastik çizme, toz maskesi, açık hava ve amonyak uyarısı eklendi.
- Adım 5
  - Önce: "her litresine yaklaşık 40 g… bulamaç yapıp katın"
  - Sonra:
    - bulamaç: ~1 kg kirece 3 L su, kireç suya katılır, hemen kullanılır;
    - kaynaklarda doz 10–40 g/L; pH ölçülemiyorsa 40 g/L.
- Adım 6
  - Önce: "pH 11'in üstünde kalmalı"
  - Sonra: "yarım saatte bir ölçün, 2 saat boyunca >11; fazla kireç kötü karıştırmayı telafi etmez."

### sf-hs-sivi-kaybi
- Adım 1: "Tadı gözyaşından tuzlu olmamalı; tuzluysa dökün, yeniden yapın" eklendi.
- Adım 2
  - Önce: "tuzlu çorba, ayran ya da pirinç suyu"
  - Sonra:
    - hazır WHO düşük ozmolar ORS paketi paketteki su miktarıyla hazırlanır;
    - yoksa hafif tuzlu pirinç suyu ya da tuzlu çorba, anne sütü sürer.
- Adım 6
  - Önce: "birkaç dakika bekleyip"
  - Sonra: "10 dakika bekleyin, 2–3 dakikada bir kaşık"
- Adım 7: her sulu dışkıdan sonra 50/100/200/300 ml (5, 10 ve 20 kg eşikleri) eklendi.
- WHO düşük ozmolar bileşim (g/L, 1 litre için): 2,6 NaCl, 13,5 glikoz, 1,5 KCl, 2,9 trisodyum sitrat. Kaynakta teyit edildi. Rehbere yazılmadı: elde kimyasal yoksa işe yaramaz, yanlış tartılırsa tehlikelidir. Hazır paket önerildi.

### sf-hs-gebelik-dogum
- Adım 5: set "sabun, ~1 m² temiz naylon örtü, yeni jilet (yoksa kaynatılmış makas), 2 temiz ip, kaynatılmış bezler, battaniye, başlık" oldu.
- `dont`: "Doğum yoluna yıkanmamış el, bez, yağ ya da bitki sokmayın" eklendi.
- Spec `sf-hs-dogum-seti`: naylon örtü eklendi.

### sf-hs-bit-pire-uyuz
- `note` eklendi: ilaç ve doz yok; ilaç yalnız sağlık çalışanı ya da eczacı önerisiyle, özellikle bebek, gebe ve emzirende.
- WHO sayfasında ilaç adları ve dozları var; rehbere bilerek alınmadı.

### Not eklenenler
- sf-hs-sedye: omurga ve felç riski.
- sf-hs-yatalak-hasta: açılan ya da ateşli yara uzman ister.
- sf-hs-sinek-kemirgen: fare zehri ve veba şüphesi.

## Yasak kontrolü
- Silah, patlayıcı ve içki yok.
- Alkol yalnız atesli-hasta rehberinde geçiyor: "alkolle silmeyin, içilmez, metanol riski".
- İlaç dozu yok.
  - Ateş düşürücü ve antibiyotik için yalnız yasak ya da yönlendirme cümleleri var.
  - ORS miktarları sıvı hacmidir; uzman onayına bırakıldı.
- Sağlık ya da yasal riski olan rehberlerin hepsinde artık `note` var.
- `note` olmayanlar düşük riskli: kompost-tuvalet, cukur-tuvalet, cop, el-yikama, camasir, dis, kadin-hijyeni, bebek-bezi.

## Uzmana gidecek liste
1. Defin:
   - 200 m hedef ile 50/30 m alt sınır ayrımı ve "kuyuda su 3,5 m'den yakınsa" çıkarımı (1,5 m derinlik + 2 m boşluk).
   - Kolerada bedenin klorlanması: TN8 %0,5, MSF %2, Somali rehberi evde %0,2 diyor. Rehberde oran yok.
   - Yasal not, 1593 sayılı Kanun ve Mezarlık Yerleri yönetmeliğiyle kontrol edilmeli.
2. ORS:
   - Plan A/B hacimlerinin ilaç dozu sayılıp sayılmayacağı.
   - Ayranın ev sıvısı olarak WHO listesinde olup olmadığı. WHO ishal el kitabına erişilemedi.
3. Kireç:
   - pH ölçümü olmadan 40 g/L yeterli mi?
   - Sönmemiş kireç söndürme adımı rehberde kalsın mı? Eawag acil durumda sönmemiş kireci önermiyor.
4. Göbek bakımı: yüksek ölüm oranlı ev doğumlarında WHO'nun klorheksidin önerisi. Rehber "hiçbir şey sürmeyin" diyor.
5. Sedye, atel ve değnek: FM 4-25.11 ya da benzeri resmî bir kaynakla gözden geçirilmeli.
6. Yara bakımı: pansuman sıklığı ve bez kaynatma süresi kaynaksız.
7. Çöp çukuru: su kaynağından 30 m, tuvaletten benzetmedir.
