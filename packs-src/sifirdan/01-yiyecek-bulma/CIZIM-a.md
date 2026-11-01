# 01-yiyecek-bulma: çizim raporu (a, batch sc-01a)

Toplam 83 sahne: 79 rehber sahnesi ve 4 kategori kapağı. 28 rehberin hepsi bu partide. Her rehberde en çok 3 çizim var.

## Oyuncular (scenes-a.tsx, CAST)
- Toplayıcı: kadın, topuz saç, camgöbeği üst, haki pantolon. Yabani yiyecek rehberlerinde ve yakın plan ellerde (HT) kullanıldı.
- Balıkçı: bıyıklı, esmer adam, hardal üst. Balık rehberlerinde ve ellerde (HB) kullanıldı.
- İzci: kumral adam, yeşil üst. İz ve tuzak rehberlerinde ve ellerde (HI) kullanıldı.
- İşleyen: başörtülü kadın, kiremit üst. Ellerde mavi nitril eldiven var (renk filtresi). Avı işleme rehberlerinde kullanıldı.
- Malzeme renkleri sabit tutuldu (C sabiti): çamur, taş, ip, çelik, karaciğer, safra.

## Rehber başına çizilenler / null yapılanlar
- yabani-otlar: ısırgan, ebegümeci, semizotu-sütleğen.
- zehirli-benzerler: şemsiye-yasak, baldıran gövdesi, çiğdem-soğan. Null: havuç gövdesi.
- yenebilirlik-testi: yasak işaretler (4 kutu), deri testi, dudak testi. Null: porsiyon.
- yabani-meyve: kuşburnu, kestane ayrımı, porsuk-yasak.
- palamut: kırma, kaynatma, tat. Null: soğuk yöntem.
- kok-yumru: su kamışı kökü, çiğdem-soğan (paylaşılan; sogan-koku kaldırıldı), şemsiye-yasak (paylaşılan).
- mantar: yasak, halk testleri, 114. Null: süre çizelgesi (soyut).
- kiyi: temiz yer (iki panel), midye seçme, renkli su. Null: midye pişirme.
- bocek: yenir, yasak (4 kutu), çekirge temizleme. Null: kavurma.
- yumurta: işaretleme, su testi, pişirme.
- bal: arı/eşek arısı, koruyucu giysi, duman. Null: deli bal.
- olta: sırık, şamandıra, bırakma olta.
- kanca: diken, tahta, çatal-yem. Null: kanca-catal (çatal-yem aynı şeyi gösteriyor).
- balik-yeri: saklanma, girdap, yem çeşitleri.
- balik-sepet: huni ilkesi, taş set, taş havuz. Null: sepet örme.
- balik-agi: üst ip, ilk sıra düğümü, ağ suda. Null: kılavuz ip.
- kerevit-kurbaga: ip ile avlama, tutma, kurbağa ayrımı.
- ayak-izi: tavşan, köpekgil, ayı. Null: toynak.
- diger-izler: hayvan yolu, dışkı, domuz eşintisi. Null: kemirme.
- hayvan-davranisi: şafak, su kenarı yolları, rüzgâr yönü.
- ilmek: tel ilmek, yükseklik, huni.
- dusen-tuzak: 4 tetiği, kurulu taş, el-yasak. Null: Paiute.
- tuzak-guvenligi: işaret, arkadan yaklaşma. Null: söküm.
- kucuk-memeli: eldiven-maske, deri yarma, karaciğer kontrolü. Null: iç organ.
- kus-temizleme: haşlama, alev, safra kesesi (paylaşılan; kus-ic-organ kaldırıldı). Null: taşlık.
- balik-temizleme: bozulma, karın, fileto. Null: solungaç.
- ic-organ: karaciğer (paylaşılan), kist, safra kesesi.
- et-hastalik: şarbon leşi, pişirme kontrolü, trişin. Null: eldiven-maske (küçük memelide zaten var).

## spec.ts
- Kullanılmayan 19 kimlik silindi.
- Çizilen bütün kimliklerin açıklamaları, çizimle birebir uyacak biçimde sadeleştirildi.

## Güvenlik notları
- Zehirli ve yenir karşılaştırmalarında yenir taraf şematik çizildi; ayrıntılı bitki portresi yok. Bu sahneler: semizotu, çiğdem, kestane.
- Zehirli tarafta büyük kırmızı yasak işareti duruyor.
- Silah yok.
- Bıçak yalnızca safra kesesi sahnesinde, küçük bir mutfak aleti olarak görünüyor.
- Kan ve iç organ çizimi en aza indirildi.

## Kalan şüpheler
- tavsan-deri-yarma: şematik tavşan yukarıdan bakınca seriye benziyor. Okunabilirliği orta.
- dusen-tas-kurulu ve tetik-dort: tetik düzeneği basitleştirildi, birebir doğru bir 4 tetiği değil.
- safak-hayvan ve ruzgar-yonu: otlayan karacanın silueti kaba.
- kus-haslama: bacak/el bağlantısı ve kuşun duruşu idare eder düzeyde.
- Eldiven için SVG renk filtresi kullanıldı (id: sfyb-glove). Uygulamada satır içi SVG'lerde filtrelerin çalıştığı varsayıldı.
