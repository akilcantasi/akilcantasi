# Rehber görsel QA — g6

Ekran görüntüleri: /tmp/qa-g6 (390 px genişlik, DPR 2). `npx vitest run tests/guides.test.ts`: 191/191 geçti.

## Rehberler

- ulasim-trafik-kazasi: OK.
- ulasim-karda-mahsur: OK.
- ulasim-suya-dusen-arac: Metin OK. 5. adım çiziminde "1/2" numaraları çocuklarda değil, cam ve koltukta duruyor; "önce büyük çocuk" sırasını göstermiyor (aşağıda listelendi).
- ulasim-ariza-aku: OK (112 bandı yok; arıza rehberi için uygun).
- ulasim-tahliye-surus: OK.
- ulasim-tunel-kopru: Metin ve çizimler OK. Not: callEmergency yok, oysa rehber tünelde yangın/duman durumunu anlatıyor ve 9. adımda 112 geçiyor; 112 bandının açılması değerlendirilmeli (içerik kararı olduğu için dokunulmadı).
- yangin: 9. adım düzeltildi: "Dur, Yere yat, yüzünü ellerinle kapat, Yuvarlan." -> "durun, yere yatın, yüzünüzü ellerinizle kapatın ve yuvarlanın." (sen/siz karışıklığı ve cümle ortasında büyük harf).
- orman-yangini: OK.
- yangin-sondurucu: OK.
- yangin-yag: OK.
- yangin-elektrik: OK. Küçük not: 6. adım ("eğilerek uzaklaşın"), 5. adımdaki "binadan çıkın"dan sonra geliyor; sıra 5 ile 6 yer değiştirirse daha mantıklı olur (dokunulmadı).
- yangin-arac: OK.
- yangin-yuksek-bina: OK.
- yangin-duman-solunmasi: OK.
- yangin-giysi-tutustu: OK.
- yangin-kacis-plani: OK.
- burun-kanamasi: OK.
- yanik: Metin OK. Not: rehber "HAYATİ" etiketli ve 7, 8, 10. adımlarda 112 geçiyor ama callEmergency yok, 112 bandı görünmüyor; değerlendirilmeli. 6. adım çizimi (lie-cover-blanket) yol kenarında ve bütün vücut örtülü; "yanık olmayan yerleri örtün" metnine tam uymuyor ama çelişki ağır değil.
- kirik-burkulma: OK. Not: 8 ve 9. adımlarda 112 var, bant yok (ağır kırıkta bant düşünülebilir).
- ezilme-yaralanmasi: OK.
- yaralanma-bas-travmasi: 3. adım düzeltildi: "1 metreden ya da 5 basamaktan yüksekten düşme" -> "yüksek bir yerden düşme".
- yaralanma-omurga: Metin OK. 2. adım çizimi sorunlu (aşağıda).
- yaralanma-goz: Metin ve çizimler OK. Not: özet "112'yi arayın" diyor, 3. adımda 112 var ama callEmergency yok; 112 bandı değerlendirilmeli.

Kaymış (shift) çizim dizisi bulunmadı; art dizilerinde değişiklik yapılmadı.

## Yeniden çizilmesi gereken resimler

| art id | rehber | adım | sorun |
|---|---|---|---|
| yaralanma-omurga-kimildatma | yaralanma-omurga | 2 | Yardım eden kişi yaralının göğsünün üstüne çömelmiş/oturmuş, eli göğsünde görünüyor. Omurga şüphesinde yanlış izlenim veriyor; yaralının yanında diz çöküp konuşan biri çizilmeli (köşedeki "taşımayın" kutusu doğru). |
| ulasim-su-cocuk | ulasim-suya-dusen-arac | 5 | "1" ve "2" rozetleri cam ve koltuk üstünde; büyük çocuğun önce çıkarıldığı sıra okunmuyor. Rozetler büyük çocuk (1) ve küçük çocuk (2) üstüne konmalı. |
| lie-cover-blanket (isteğe bağlı) | yanik | 6 | Sahne yol kenarı ve bütün vücut örtülü; yanık rehberi için iç mekân ve yanık bölgeyi açıkta bırakan bir örtme sahnesi daha uygun olur. |
