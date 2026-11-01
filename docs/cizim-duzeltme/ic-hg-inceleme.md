# Çizim inceleme (2. tur) — batch ic-hg (hava + güvenlik + ulaşım)

Sahne dosyaları: `src/art/scenes/hava.tsx`, `src/art/scenes/guvenlik-ulasim.tsx`. Spec: `src/art/spec/hava.ts`, `guvenlik.ts`, `ulasim.ts` (yalnızca değişen sahnelerin satırları).
İncelenen: 19 rehber, 99 çizim. Yeniden çizilen / düzeltilen: 20 sahne. Null yapılan: 0.
Sayılar ilk inceleme anına göre (İYİ / ZAYIF / KÖTÜ); ZAYIF ve KÖTÜ olanların hepsi yeniden çizildi ve son paftada İYİ'ye çıktı.

| Rehber | İYİ | ZAYIF | KÖTÜ | Değişen |
|---|---|---|---|---|
| sicak-carpmasi | 5 | 0 | 1 | 6 `hava-buz-noktalari`: kasık buzları karın/bel üstündeydi → uyluk kökü/kasığa indirildi |
| firtina-yildirim | 6 | 1 | 0 | 8 `firtina-kpr` (ortak `CprScene`): kolların üstünden geçen kesikli çizgi kaldırıldı; ok yaralının başı yerine kurtarıcının omuzlarının üstünde |
| hava-kar-firtinasi | 4 | 1 | 0 | 4 `hava-kat-kat-giyin`: bere gözleri örtüyordu, 3 numaralı etiket → bere yukarı, tek etiket "3 kat" |
| hava-cig | 3 | 1 | 1 | 2 `hava-cig-yana-kac`: çığ sivri dağ gibi okunuyordu → kabarık, aşağı yuvarlanan kar bulutu (içinde aşağı oklar), arkada ayrı gri dağ sırtı, kişi büyütüldü; 10 `cig-kpr` (`CprScene` düzeltmesi) |
| hava-toz-firtinasi | 4 | 0 | 0 | — |
| hava-hortum | 1 | 1 | 2 | 1 `hava-hortum-ic-oda`: minik figürlü ev kesiti → iç mekân: pencereden hortum görünen odadan, penceresiz fayanslı iç odaya (✓) çocuğun elinden tutup geçen büyük figür. 3 `hava-hortum-comel-bas-koru`: şilte havada süzülüyordu → sırta oturan şilte, figür büyütüldü. 9 `hava-kopuk-tel-yasak`: yasak işareti yürüyen kişinin üstündeydi ("yürümeyin" gibi) → kişi kıvılcımlı telden uzaklaşıyor, turuncu ok |
| hava-sicak-dalgasi | 5 | 0 | 0 | — |
| hava-dolu | 2 | 2 | 0 | 5 `hava-dolu-arac-ici`: çocuk yetişkinin altında görünmüyordu → çocuk yanda büzülmüş, yetişkin kollarıyla üstüne kapanıyor. 6 `hava-alt-gecit-yasak`: köprü masa gibiydi → üstünden araç geçen geniş köprü + ayak |
| guvenlik-kayip-cocuk | 5 | 0 | 0 | — |
| guvenlik-yardim-dolandiriciligi | 5 | 0 | 1 | 6 `guvenlik-kod-paylasma`: tuhaf telefon duruşu ve anlaşılmaz balon → yakın plan telefon (kilit + 6 haneli kod), şüpheli kişiye giden ok yasaklı |
| guvenlik-cadir-kent | 4 | 1 | 0 | 2 `guvenlik-kamp-fener`: yasak işareti kara bir lekenin üstündeydi → çadırlar arasına giden karanlık yol belirginleştirildi, yasak işareti onun ağzında |
| guvenlik-bos-ev | 6 | 0 | 0 | — |
| guvenlik-yanlis-bilgi | 4 | 0 | 0 | — |
| ulasim-trafik-kazasi | 3 | 2 | 1 | 5 `ulasim-kaza-oynatma-yasak`: üst üste binmiş sürükleme + yasak + minik ek kare → iki eşit kare: sürükleme ✗ / yanında diz çöküp konuşma ✓. 8 `ulasim-kask-cikarma`: "çıkarmayın" adımında kask çıkarma tekniği çiziliyordu → yardımcı kaskı çıkarmadan iki yandan tutup baş-boynu sabitliyor. 9 `ulasim-kaza-battaniye`: gri folyo kaya/örtü gibi okunuyordu → kırmızı battaniye |
| ulasim-karda-mahsur | 4 | 1 | 0 | 4 `ulasim-kar-motor-10dk`: "10 dk / saat" etiketi çerçeveden taşıyordu → içeri alındı |
| ulasim-suya-dusen-arac | 4 | 1 | 1 | 5 `ulasim-su-cocuk`: annenin kolları zombi gibi düz uzanıyordu → çocukların yanında diz çökmüş, kemer tokasına uzanıyor. 6 `ulasim-su-cik`: anne havada çatıda süzülüyor, kız yatay "uçuyordu" → batmış aracın tavanında anne ve iki çocuk, kıyıya ok |
| ulasim-ariza-aku | 6 | 0 | 0 | — |
| ulasim-tahliye-surus | 5 | 0 | 0 | — |
| ulasim-tunel-kopru | 4 | 0 | 1 | 10 `ulasim-tunel-deprem`: kişi dizleri üstünde secde gibi duruyordu, aracın önündeydi → aracın yanında yerde yan yatmış (gövde yere değiyor), dizler karna çekik, kollar baş ve enseyi sarıyor |

## Kalan şüpheler
- `ulasim-tunel-deprem`: yan yatış karşıdan çizildi; bacaklar gövdenin arkasında kısmen gizli. Okunuyor ama "dizler karında" ayrıntısı küçük.
- `ulasim-kaza-oynatma-yasak`: iki kare olduğu için figürler küçük (yüksekliğin ~%45'i); fikir net.
- `guvenlik-kamp-fener`: karanlık yol hâlâ koyu bir şerit; yasak işaretiyle birlikte anlaşılıyor.
- Makine yükü çok yüksekti (load ~40); resmi `all-guides-shot.mjs` zaman aşımına düştü, aynı işi yapan sabırlı bir kopya (`/tmp/ic-hg/tools/shot.mjs`) ile çekildi.
