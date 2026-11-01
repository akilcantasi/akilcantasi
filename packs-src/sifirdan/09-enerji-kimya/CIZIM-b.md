# Çizim raporu: 09-enerji-kimya, harf b (batch sc-09b)

Dosya: `scenes-b.tsx`. Bu dosyada 19 rehber için 57 sahne var, her rehberde 3 sahne. Kategori kapakları a ajanında.
Denetim: `check-sifirdan` "hata yok" verdi. Derleme hatasız geçti. Bu rehberlerde "sahnesi yok" uyarısı kalmadı. `tsc --strict --noUnusedLocals` dosyada temiz.

## Oyuncular (dosya başındaki CAST sabitleri)
- **EL**: elektrik rehberlerindeki usta. Esmer erkek, kısa siyah saç, hardal üst, lacivert pantolon.
- **KIM**: kimya rehberlerindeki kadın (kimyasal güvenlik, kireç, alçı, kül suyu, kömür yığını, odun gazı). Topuz saçlı, uzun kollu yeşil üst giyiyor. Her sahnede koruyucu gözlük ve sarı lastik eldiveni var (`Worker` yardımcısı).
- **KAZA**: gözüne kostik kaçan ve CO'dan bayılan adam. Açık tenli, kahverengi saç, mavi üst.
- **MUM**: yaşlı kadın. **YAG**: yaşlı adam. **KAG**: koyu tenli adam, mor üst.
- **CIF**: biyogaz ve odun gazı rehberlerindeki çiftçi, kiremit rengi üst. Biyogazda 112'yi arayan kadın teal üst giyiyor.
- **Tuz**: başörtülü kadın, mor üst. Yalnız tuz rehberinde görünüyor.
- **Malzeme renkleri** sabit: demir kazan/soba `IRON`, kireç ve alçı beyaz `LIME`, kül suyu kahverengi `LYE`, kil `CLAY`, odun `K.wood`, su `K.water`.

## Rehber başına çizilenler (adım numarası 1'den başlar)
| Rehber | Çizilen | null yapılan |
|---|---|---|
| pedal-jenerator | 3 motor-test, 4 kurulum, 6 diyot | dinamo, semasi |
| alternator | 3 matkap-test, 4 kasnak, 7 kopru-diyot | adaylar, baglanti |
| pil-paketi | 1 hazir, 4 ayikla, 9 sarj-kutu | punta, bms |
| termoelektrik | 3 plaka, 6 baglanti, 8 kablo | sogutucu |
| kimya-guvenlik | 1 koruyucu, 5 suya-ekle, 8 goz-yikama | kap, cilt-yikama |
| kirec | 2 sirke, 4 ocak, 7 sondurme | kirma, kuyu |
| alci | 3 kavurma, 6 karistirma, 9 yasak | tirnak, buhar |
| odun-komuru | 4 ortme, 5 yigin, 10 co | cukur, duman |
| aktif-komur | 4 kirma, 5 kutu, 6 filtre | yuzey, yapar-yapmaz |
| potas | 2 fici, 4 suzme, 6 kaynatma | etiket |
| tuz | 3 havuz, 6 toplama, 7 aci-su | su-alma, kazan |
| mum | 3 su-banyosu, 5 daldirma, 6 kalip | balmumu, fitil |
| yag | 3 dibek, 5 pres, 6 ayirma | ceviz, saklama |
| kagit | 5 dovme, 7 daldirma, 9 pres | kabuk, kalip |
| murekkep | 1 is, 4 ezme, 7 kararma | yuzdurme, mazi |
| cam | 4 sise-kesme, 5 tavlama, 6 yagli-kagit | ocak, toplama |
| fermantasyon | 3 bez, 8 tursu, 9 sise-yasak | uc-tur, kuf |
| biyogaz | 2 tank, 7 sabun, 10 girme-yasak | besleme, su-tuzagi |
| odun-gazi | 1 kesit, 4 acik-hava, 9 co | odun, durdurma |

null yapılan sahnelerin spec satırları silinmedi; ileride kullanılabilirler. Çizilen ama açıklaması değişen 26 sahnenin spec satırı güncellendi. Bunların bir kısmı:
- **goz-yikama**: Parmakla kapak tutma bu ölçekte "göze parmak sokma" gibi okunuyordu. Sahnede eldivenli el başı tutuyor, gözler açık; su burun kökünden göz üstünden dışa akıyor.
- **ferm-sise-yasak**: İçki çağrışımı olmasın diye şişe yerine elma dilimli, kapağı kabarmış kavanoz çizildi. Turuncu sıvı ve köpük başlığı bira gibi göründüğü için kaldırıldı.
- **ferm-bez**: Yanlış örnekteki kavanozun içi de elma dilimleri oldu.
- **gazojen-acik-hava**: Yukarıdan bakış yerine iki yarılı yan görünüş.
- **komur-co**: Açık havadaki onaylı mangal kutusu çıkarıldı; yalnız yasak sahnesi kaldı.
- **pil-hazir**: Nesneler kullanılırken gösteriliyor: powerbank telefonu dolduruyor, akü matkaba takılı.

## Koruyucu donanım
KIM'in göründüğü her sahnede gözlük ve iki eldiven var. Gözlük başın yerel çerçevesine çiziliyor, eldiven el ekleminin üstüne bindiriliyor.
Yakın planlarda yalnız eldivenli el görünüyor: aktif-kirma, cam-sise-kesme 1. kare, goz-yikama'da yardımcının eli.
Şu yakın planlarda el eldivensiz: mum, yağ, tuz, mürekkep, biyogaz sabunlu su. Bunlar yakıcı kimyasal değil.
alci-yasak'taki çıplak el bilerek öyle: yanlış davranışı gösteriyor ve üstünde yasak işareti var.

## Kalan şüpheler
- **goz-yikama**: Kapakları açık tutan parmaklar çizilmedi; metin bunu söylüyor. Başın yatık oluşu küçük boyutta zor seçilebilir.
- **Küçük nesneler**: pedal-kurulum'da motorun lastiğe bastırdığı nokta, cam-sise-kesme 1. karedeki kesici ve eldiven, aktif-kirma'daki el-tokmak tutuşu.
- **Elle tutma**: kagit-dovme ve yag-dibek'te kollar biraz kaskatı. biyogaz-girme-yasak'ta merdivendeki kişi yasak işaretinin altında küçük kalıyor.
- **TablePour'un yanlış yol kutusu**: Sürahi ve yığın küçük ölçekte simge gibi okunuyor.
- **teg-plaka ve diyot şemaları**: Etiketsiz; katman sırasını renkler taşıyor.
