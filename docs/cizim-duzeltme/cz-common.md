# cz-common — ortak sahneler ve kategori kutuları

Dosyalar: `src/art/scenes/categories-common.tsx`, `src/art/spec/common.ts` (categories.ts değişmedi).
Rehber dosyalarına dokunulmadı.

## Oyuncu tanımı
Dosyanın başında `CC` sabiti tanımlandı. Kişi içeren ortak ilk yardım sahnelerinin hepsi onu kullanır. Böylece aynı rehberde
birden çok ortak sahne geçtiğinde kişiler değişmez (ör. ilk-yardim-ilk-degerlendirme: cpr-adult ve recovery-position;
derlenme-pozisyonu: cpr-adult, recovery-position ve watch-breathing; ezilme ve omurga: cpr-adult ve lie-cover-blanket).
- `CC.victim`: man, victim (mavi), skin 1, short, kahverengi saç
- `CC.helper`: woman, helper (teal), bun, siyah saç, skin 2, bottomC #6b5a4e

## Kullanım (rehber sayısı)
call-112 61 · hospital-go 18 · cpr-adult 17 · recovery-position 14 · wash-hands 14 · lie-cover-blanket 8 · whistle-signal 7 ·
call-114 5 · power-off 5 · stay-calm-talk 5 · battery-radio 4 · boil-water 4 · flush-water-15 3 · gas-valve-off 3 ·
go-assembly-area 3 · no-elevator 3 · remove-rings 3 · sms-send 3 · cold-compress 2 · first-aid-kit 2 · watch-breathing 1 ·
cover-mouth-cloth 1

## Yeniden çizilenler / düzeltilenler
- **cpr-adult**: Kurtarıcı gülümsüyordu (`calm`), şimdi `neutral`. Figürler 1.25'ten 1.5 ölçeğe büyütüldü (önceki hali boş sahnede küçük kalıyordu). Ok ve etiket yeniden yerleştirildi. Oyuncular CC'den geliyor.
- **recovery-position**: Üstteki el yanağın altında değildi, başın önünde havada duruyordu. Şimdi IK ile elin sırtı yanağın altında. Figür 1.45'ten 1.62 ölçeğe büyütüldü. Kişi CC.victim.
- **lie-cover-blanket**: Baştan çizildi. Eskiden dış mekân/asfalt üzerindeydi; yardımcı yaralının üstüne oturmuş gibi görünüyordu ve gülümseyen bir yaralı vardı. Yeni hali sade iç mekân: yaralı sırtüstü, gözleri açık ve endişeli, boynuna kadar folyo battaniyeyle örtülü. Yardımcı uzak yanda göğüs hizasında diz çökmüş, eli omzunda, yüzüne dönük konuşuyor. Spec güncellendi.
- **watch-breathing**: Yaralı eskiden uzun kızıl saçlı bir kadındı ve recovery-position'daki adamdan farklıydı (sahibin şikâyet ettiği tutarsızlık); şimdi CC.victim. Yardımcı gülümsüyordu, şimdi `neutral`. Eli yaralının yüzündeydi, şimdi örtülü omzunda. Üst el yanağın altında (recovery-position ile aynı).
- **stay-calm-talk**: Baştan çizildi. Eskiden boş odada minik iki figür vardı; yerde oturan yardımcının uzun, düz kolu çömelen kişiye uzanıyordu. Yeni hali: endişeli kişi sandalyede oturuyor, yardımcı önünde diz çökmüş, göz hizasında, eli kişinin elinin üstünde, konuşma balonunda dalga. Spec güncellendi.
- **hospital-go**: Baştan çizildi. Yardımcı gülümsüyordu ve kolu kişinin sırtına giderken kendi çenesindeymiş gibi okunuyordu. Kişi "acı" ifadeli yaşlı bir kadındı ve psikoloji ya da bebek rehberleri için fazla özeldi. Yeni hali: CC.victim (`worried`), CC.helper (`neutral`) onu kolundan tutarak sağlık çadırına götürüyor. Spec güncellendi.
- **flush-water-15**: Su kola değil kumaş yeniye akıyordu; metin ise "giysiyi çıkarın, cildi yıkayın" diyor. Şimdi kol sıvanmış ve su çıplak ön kola akıyor. Spec güncellendi.
- **wash-hands**: "20 sn" saat rozeti kaldırıldı. 14 rehberden yalnızca 3'ü 20 saniye diyor, diğerlerinde metinle uyuşmayan bir bilgi oluyordu. Spec güncellendi.
- **go-assembly-area**, **no-elevator**: Deprem sonrası tahliyede gülümseyen yüzler (`calm`) `neutral` yapıldı.

## Dokunulmayanlar (uygun bulundu)
call-112, call-114, sms-send, cover-mouth-cloth, cold-compress, remove-rings, whistle-signal, battery-radio, boil-water,
gas-valve-off, power-off, first-aid-kit ve 18 kategori kutusu (cat-*).

## Kalan şüpheler
- Kit'in `closed` ifadesi ağzı çok hafif yukarı kıvrık çiziyor; bilinci kapalı kişide küçük bir gülümseme gibi okunabilir (cpr-adult, recovery-position, watch-breathing). Sahne üzerinden ağız örtme denendi ama `rig().mouth` yan/yatık başta yüzdeki ağızla örtüşmüyor (kulağa denk geldi), bu yüzden geri alındı. Doğru çözüm kit2'de `closed` ağzını düz yapmak; kit2 bu turda kapsam dışı.
- whistle-signal'deki "6× / 1 dk" rozeti 7 rehberin yalnızca 2'sinde metinde geçiyor. Uluslararası standart olduğu ve spec bunu açıkça istediği için bırakıldı. nukleer-patlama-sonrasi, iletisim ve engelli rehberleri isterse rozetsiz kendi kopyalarını çizebilir.
- remove-rings: Yüzük oku serçe parmağının yanından çıkıyor ve saat oku yana doğru. Anlaşılır ama zayıf.
- hospital-go dış mekân sağlık çadırı gösteriyor. Psikoloji rehberlerinde ("destek isteyin") çok yerinde değil, ama genel "sağlık ekibine gidin" anlamını taşıyor.
- `tests/guides.test.ts` şu an başka bir ajanın yarım işi yüzünden kırık: yaralanma-saplanan-cisim içindeki `yaralanma-saplanan-ortme` kimliği tanımsız. Bu batch ile ilgisi yok. tsc'de bu dosyalar için hata yok.
