# Çizim düzeltme — batch cz-hs (hazırlık + su-gıda)

Dosyalar: `src/art/scenes/hazirlik.tsx`, `src/art/scenes/su-gida.tsx` (her ikisinin başına rehber başına oyuncu sabitleri eklendi), `src/art/spec/hazirlik.ts` (hazirlik-tatbikat), `src/art/spec/su-gida.ts` (su-gida-ust-musluk-ac). Hiçbir `art` dizisi değişmedi; null yapılan çizim yok (zaten soyut adımlar null'dı).

Genel kural: ortak sahneler (wash-hands: yeşil kol + ten 1; sms-send/call-112/whistle-signal: camgöbeği + ten 1; go-assembly-area: hardal anne + camgöbeği oğul; tesisat-su-vanasi-kapat: camgöbeği + ten 1) değiştirilemediği için rehber oyuncuları bu sahnelere uyduruldu. Bütün yetişkin "calm" (gülümseyen) yüzleri `neutral`/`speak` yapıldı (yalnızca oynayan/velisine koşan çocuk calm kaldı).

## afet-cantasi — CANTA: kadın, topuz siyah saç, camgöbeği, ten 1
- 1 canta-kapi: yüz neutral, oyuncu sabiti.
- 8 belge-posette (ortak, belgeler ile): iki el artık aynı (üst) kenardan geliyor; ten 2→1.
- 10 tarih-kontrol (ortak, ilk-yardim ile): mor kol → camgöbeği, iki el alt/sağ alttan.

## iletisim — el: camgöbeği, ten 1 (ortak düdük/SMS sahneleriyle aynı)
- 4 ve 7: ten 2/0 → 1, mor kol → camgöbeği.

## hazirlik-ev-sabitleme — EV: erkek, siyah saç, camgöbeği, ten 1
- 1: yüz neutral. 5: hardal kol → camgöbeği.

## hazirlik-aile-afet-plani — AILE: anne hardal (varsayılan uzun kahve saç), oğul camgöbeği, baba mor bıyıklı, kız yeşil
- 1 plan-masa: anne kiremit→hardal, yüzler neutral/speak.
- 5 irtibat-kisi: soldaki genç erkek → aynı anne.
- 6 numara-kart: kiremit kol → hardal (anne).
- 9 tatbikat: YENİDEN ÇİZİLDİ. Eskiden 3 minik figür iki masada; şimdi tek geniş masa altında büyük ölçekte anne + oğul Çök-Kapan-Tutun, masa ayağını tutuyor. Spec güncellendi.

## hazirlik-arac-kiti — el: camgöbeği, ten 1
- 2 stepne: ten 2→1. Diğerleri sorunsuz.

## hazirlik-belgeler — BELGE: erkek, koyu saç, camgöbeği, ten 1
- 1 fotokopi: havada uçan kâğıtlar kaldırıldı, kopyalar çıkış tepsisinde deste; arka kol sarkıyor; ten 2→1.
- 2: yukarıdaki gibi. 3: yeşil kol → camgöbeği.
- 4 belge-yakina: veren kişi başörtülü kadın → aynı erkek.

## hazirlik-ilk-yardim-cantasi — ILKY: kadın atkuyruğu, camgöbeği, ten 1
- 1: ten 2→1, yüz neutral. 3 ve 9: camgöbeği + ten 1.

## hazirlik-is-okul — IS: erkek, mor, ten 2, siyah saç, bıyık
- 2 cikis-yolu: yandan duruş, el levhaya uzanıyor (önceki eğri, gülümseyen kol yerine).
- 5 is-cok-kapan: kadın → aynı erkek; çizim yeni metinle uyumlu (sağlam masanın altında, masa ayağını tutuyor, pencereden uzak).
- 7 okul-teslim: veli → aynı erkek.

## hazirlik-evcil-hayvan — EVCIL: erkek, mor, ten 1 (fotoğraftaki kişiyle aynı)
- 3 kafes: camgöbeği → mor; kafes yerde sürünüyordu, dirsek bükülüp kafes küçültüldü (artık havada taşınıyor).
- 4: ten. 6: esmer el/camgöbeği kol → ten 1, mor kol.

## su-aritma — ARITMA: kadın atkuyruğu, camgöbeği, ten 1
- 2 bezden-suzme: havada boşta duran ikinci el artık sürahinin dibini destekliyor.
- 4, 5: ten 2/0 → 1. 9 kapakli-bidon: kişi yaklaştırıldı (kollar dümdüz değil), yüz neutral.

## gida-guvenligi — GIDA: erkek, yeşil (wash-hands ile aynı), ten 1, bıyık
- 1: mor kol → yeşil. 4: hardal/ten 2 adam → oyuncu.

## su-gida-su-depolama — DEPO: erkek, yeşil, ten 1
- 2: aile babası kiremit → aynı adam. 4: mavi kol → yeşil. 6: topuzlu kadın → aynı adam.

## su-gida-evdeki-gizli-su — el: camgöbeği, ten 1
- 2 ust-musluk-ac: ev kesitindeki minik, okunmayan figür kaldırıldı; musluğa hava dalgası + ok. Spec güncellendi.
- 6 rezervuar: hardal kol → camgöbeği.

## su-gida-pisirmeden-beslenme — PISIR: yaşlı kadın, yeşil (wash-hands ile aynı), ten 1
- 2 konserve-soguk: mor → yeşil; kişi ve masa 1.32× büyütüldü (eskiden kare yüksekliğinin ~%45'i).
- 3: camgöbeği/ten 2 kollar → yeşil, ten 1.

## su-gida-sicakta-gida — değişiklik yok (yalnızca bir el, tutarlı).

## su-gida-toplu-mutfak — ASCI: erkek, yeşil (wash-hands ile aynı), ten 1, bıyık, bone + önlük
- 1: arka plandaki aşçılardan biri oyuncu. 5: aşçı → oyuncu. 6: dağıtan kadın → aynı aşçı (bone eklendi), "60°C+" etiketi başın üstünden alındı.

## Kalan şüpheler
- hazirlik-is-cok-kapan / tatbikat: kitteki `dropCover` duruşu yere çok kapanık, "eller ve dizler üzerinde" tam okunmuyor (kit2 değişmedi).
- su-gida-ust-musluk-ac ile alt-musluk-kap birbirine çok benziyor; 2. adımda musluğun "açık" olduğu yalnızca hava dalgasıyla anlatılıyor.
- iletisim 7: tutan elin başparmağı ayrı bir el gibi algılanabilir.
- su-gida-termometre-32: aynı "32°C" iki kez yazılı (etiket kuralı), dokunulmadı.
- `npx vitest run tests/guides.test.ts`: tek hata `yaralanma-saplanan-ortme` (başka ajanın dosyası), bizim rehberlerle ilgisi yok.
