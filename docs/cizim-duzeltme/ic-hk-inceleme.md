# Çizim inceleme — batch ic-hk (doğada hayatta kalma, 2. tur)

Dosyalar: `src/art/scenes/hayatta-kalma-1.tsx`, `src/art/scenes/hayatta-kalma-2.tsx`; art dizisi `src/content/guides/hayatta-kalma.ts` (yalnız barınak 9); spec `src/art/spec/hayatta-kalma.ts`.

15 rehber, 71 çizim incelendi. İlk bakış: 62 İYİ, 5 ZAYIF, 4 KÖTÜ. 9 sahne yeniden çizildi ya da düzeltildi (1'i yeni kimlik). Hiçbir çizim null yapılmadı. Son paftalarda hepsi İYİ.

Düğümlerin topolojisine ve yıldız konumlarına dokunulmadı.

## Rehber başına (önce → sonra)

| Rehber | İYİ | ZAYIF | KÖTÜ | Değişen |
|---|---|---|---|---|
| su-bulma | 3 | 1 | 1 | `su-dinle`, `ciy-toplama` |
| su-aritma | 3 | 0 | 1 | `su-suzme` |
| yon-gunes | 3 | 1 | 0 | `golge-cubuk-kuzey` |
| yon-yildiz | 5 | 0 | 0 | — |
| yon-saat | 4 | 0 | 0 | — |
| pusula-harita | 5 | 0 | 0 | — |
| ates | 5 | 0 | 0 | — |
| barinak | 4 | 1 | 0 | 9 → yeni `barinak-bez` |
| isaret | 3 | 2 | 0 | `yer-isareti`, `ayna` |
| yabani-yiyecek | 3 | 0 | 1 | `bitki-yasak` |
| soguk-gece | 4 | 0 | 1 | `sokulma` |
| sicak | 5 | 0 | 0 | — |
| dere-gecme | 5 | 0 | 0 | — |
| vahsi-hayvan | 5 | 0 | 0 | — |
| dugumler | 5 | 0 | 0 | — |

## Ne değişti
- **`su-suzme` (KÖTÜ):** Dökülen kap havada süzülüyordu, ortada tutan bir el yoktu. Okuma sırası da metnin tersineydi. Yeni çizimde dibinde tortu olan dinlendirilmiş kabı alttan gelen bir el tutuyor ve hafifçe eğiyor. Üstteki su, bezli kaba akıyor. Su yüzeyi yere paralel; berrak kapta onay işareti var.
- **`ciy-toplama` (KÖTÜ):** Ek karede kopuk, ayağa benzeyen iki el vardı. Ek kare kaldırıldı ve tek fikir kaldı: kişi büyütüldü, elleri bezin üstünde, bezi çiyli otların üstünde sürüyor. Sürme yönünü turuncu ok gösteriyor.
- **`su-dinle` (ZAYIF):** Ses dalgaları ağaç tepelerinden çıkıyordu. Artık dereden kişinin kulağına doğru diziliyor.
- **`golge-cubuk-kuzey` (ZAYIF):** Kuşbakışı kişinin başının üstündeki ayakkabılar tavşan kulağı gibi duruyordu. Ayakkabılar kaldırıldı (`TopPerson`, yalnız bu dosyada).
- **barınak 9 (ZAYIF):** Ortak `parlak-bez` sahnesinde kişi yerdeki bezi düzeltiyordu ve barınak görünmüyordu. Yeni `hayatta-kalma-barinak-bez` sahnesinde aynı kişi (`KAMP`) ağaç dalına kırmızı bez asıyor; yanında branda barınak, gökte küçük bir helikopter var. İşaret rehberi metni "serin ya da asın" dediği için `parlak-bez` orada kaldı.
- **`yer-isareti` (ZAYIF):** Kuşbakışı zeminde önden çizilmiş ölçek kişisi ve anlamı belirsiz "X →" kartı kaldırıldı. Yalnız büyük V ile "3 m" ölçü oku kaldı.
- **`ayna` (ZAYIF):** V parmaklar uzun bir maşa gibiydi ve ışın V'den geçmiyordu. Parmaklar kalın, kısa ve açık bir V oldu. Işın aynadan V'nin ortasından geçip uçağa gidiyor.
- **`bitki-yasak` (KÖTÜ):** Gövde bükülmüş, kol nereden çıktığı belli olmadan ağza uzanıyordu. Yeni çizim omuzdan yukarı yakın plan (`YIY`): çalının yanında, iki parmak arasında mor meyve ağza gidiyor ve üstünde yasak işareti var.
- **`sokulma` (KÖTÜ):** Metin "yatın" diyor ama çizimde kişiler oturuyordu. Başların üstündeki turuncu yaylar da wifi simgesine benziyordu. Yan kesitte yan yatış denendi, okunmadı. Son çizim yukarıdan bakış: yaprak döşekte yan yana iki kişi, gözleri kapalı ve başları açık, ikisini birden boyundan aşağı tek battaniye örtüyor.

Spec güncellendi: `ciy-toplama`, `su-suzme`, `yer-isareti`, `bitki-yasak`, `sokulma`; yeni satır `barinak-bez`.

## Kalan şüpheler
- İzbarçonun dört aşaması küçük ama yapı ve okunuş kabul edilebilir; dokunulmadı.
- `ayi-yuzustu` kuşbakışı çizilmiş ama baş, kenetli eller, açık bacaklar ve çanta seçiliyor; İYİ sayıldı.
- `su-tablet` biraz kalabalık (talimat kâğıdı, göz, saat). Okunuyor; dokunulmadı.
- `sokulma` yukarıdan bakış; başlar kart boyutunda orta büyüklükte.
