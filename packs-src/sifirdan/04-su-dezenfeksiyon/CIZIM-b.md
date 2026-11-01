# Çizim raporu — b ajanı (sc-04b)

Paket: `sifirdan-su-dezenfeksiyon`. Sahneler: `scenes-b.tsx`. 17 rehber, 47 farklı sahne, 48 çizim (`sf-sd-icilmez-etiket` iki rehberde kullanılıyor). Kategori kapaklarını a ajanı çiziyor.

## Oyuncular (`CAST`)
- `sab`: el yıkama. Esmer kadın, siyah at kuyruğu, camgöbeği üst.
- `gun`: güneş ve ısı. Buğday tenli, başörtülü kadın, hardal üst, uzun etek.
- `dum`: yanlış dezenfektan. Çadırdaki erkek çocuk, yeşil üst.
- `krc`: kireç. Bıyıklı adam, kiremit üst, uzun kollu, gözlüklü (göz koruyucu yerine), sarı eldivenli.
- `elk`: elektroliz. Esmer adam, camgöbeği uzun kollu üst, gözlüklü, eldivenli.
- Metanol rehberindeki dolap sahnesinde tek seferlik bir kız çocuğu var.

## Paket renkleri
Plastik kova mavi `#5b8fd1`. Klor çözeltisi açık sarı-yeşil. Kireç kırık beyaz. Kül gri. Eldiven sarı. Bakır imbik kahve-turuncu.

## Rehber başına çizilen adımlar (adım no. 1'den başlar)
- **gunes-imbigi**: 1 imbik-kesit, 4 imbik-oluk. Null yapılanlar: havuz serme, cam eğimi (kesitte zaten görünüyor).
- **uc-seviye**: 2 kirli-alet, 7 steril-alet. Null: tablo kartı (soyut), yüzey silme.
- **sabun**: 1 tippy-tap, 3 el-ovma.
- **kaynatma-steril**: 3 alet-tencere, 5 20-dk, 7 masa-ile-alma. Null: alet yıkama, bez kurutma.
- **duduklu**: 4 duduklu-izgara (kesit), 6 duduklu-30-dk, 7 duduklu-bekle. Null: genel kesit, conta.
- **gunes-isi**: 2 camasir-kaynatma, 4 torba-bekletme, 5 yatak-gunes. Null: çamaşırı güneşte kurutma, kap rafı.
- **yanlis-dezenfektan**: 3 sirke-klor-yasak, 4 duman-yasak, 8 ise-yarayanlar. Null: sirkeyle kireç silme.
- **yara-suyu**: 2 kapakli-sogutma, 3 tuz-kasik, 5 sise-sikma. Null: şişeye tarih yazma.
- **dogum-malzeme**: 2 dogum-icerik, 3 bez-kaynatma, 5 jilet-makas. Null: çanta, kordon ipi.
- **klor-oran**: 4 klor-40ml, 5 klor-1-9, 7 klor-etiketli-kova. Null: formül kartı, 15 dk yüzey.
- **elektroliz**: 1 elektroliz-yer (açık hava, ağaç gölgesi, uzakta yasaklı ateş; eller aküye değmiyor), 4 elektrot-secimi, 5 elektroliz-duzenek (açık hava). Null: 25 g tuz, şişe etiketi.
- **kirec**: 1 kirec-koruyucu, 2 kirec-sondurme (geriye yaslanmış, uzun kepçe), 5 badana. Null: karıştırma.
- **kul-suyu**: 1 kul-secimi, 4 kul-suzme, 6 kul-tencere. Null: bekletme.
- **alkol-maya**: 4 maya-agiz-bez, 5 maya-havalanan, 7 icilmez-etiket. Null: kabı doldurma. Kaplar plastik kova; içki çağrıştıran kap yok.
- **alkol-imbik**: 1 imbik-guvenlik, 2 imbik-malzeme, 5 bas-atma. Null: kazan, soğutma. Sahneler şematik, kişi yok, kadeh yok. Toplama kabı kavanoz ve üstünde "İÇİLMEZ" etiketi var.
- **alkol-olcme**: 1 alkolmetre, 4 yanma-testi-yasak, 6 seyreltme. Null: tartı, antiseptik şişe.
- **metanol**: 3 icilmez-etiket, 4 farkli-sise, 5 kilitli-dolap. Null: belirti (görsel olarak anlatılamıyor), dökülme.

`spec.ts`: çizilen kimliklerin açıklamaları çizime göre güncellendi. Kullanılmayan 27 kimlik silindi; hepsi yalnız benim rehberlerimdeydi.

## Kalan şüpheler
- Kişilerdeki "göz koruyucu" normal gözlük olarak çiziliyor. Kitte koruyucu gözlük yok.
- Tippy-tap sahnesinde pedal ipi ile bidon bağlantısı küçük ölçekte zor seçiliyor.
- `farkli-sise`: doğru şişe kırmızı bantlı, kafatası etiketli bir şişe. Biçimi yine de bir içki şişesini hafifçe andırabilir.
- `kilitli-dolap`: çocuğun yukarı kalkan kolu el sallıyor gibi okunabilir.
- `el-ovma`: tek bir sahne; adımdaki bütün bölgeleri (parmak arası, tırnak dibi) göstermiyor.
