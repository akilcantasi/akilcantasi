# Rehber görsel QA — g7

Kapsam: 21 rehber, her adım kartı, üst bölüm ve "Yapmayın" listesi incelendi (/tmp/qa-g7). `npx vitest run tests/guides.test.ts`: 191/191 geçti.

## Rehberler

- yaralanma-dis: OK
- yaralanma-gogus: OK
- yaralanma-karin: OK
- yaralanma-uzuv-kopmasi: OK
- yaralanma-saplanan-cisim: Yapmayın listesinde noktalı virgülden sonraki büyük harf düzeltildi: `; Göz yaralanması rehberine` → `; "Göz yaralanması" rehberine` (deprem.ts'teki kullanımla aynı). Görseller OK.
- yaralanma-yara-temizleme: OK (küçük not: 10. adımda "5 cm" satır sonunda bölünüyor; bölünmez boşluk düşünülebilir)
- yaralanma-soguk-isirigi: OK (küçük not: 5. adımda "37–39 °C" tire sonrasında satır kırılıyor)
- yaralanma-gunes-yanigi: OK
- yaralanma-ishal: OK
- yaralanma-yuksek-ates: OK
- yaralanma-kuduz-isirik: OK
- yaralanma-kene: OK
- yaralanma-su-toplama: Yazım düzeltildi: "parmak araları dahil" → "dâhil". Görseller OK.
- yaralanma-kramp-zorlanma: OK (2. adım krampta "hafifçe ovun", 9. adım/Yapmayın zorlanmada masajdan kaçının diyor; farklı durumlar, çelişki yok)
- karbonmonoksit: Yazım düzeltildi: "çalışır halde" → "çalışır hâlde". "uyku hali" proje genelinde (barinma, tesisat, ulasim, ozel-gruplar) aynı yazıldığı için tutarlılık açısından değiştirilmedi; istenirse hepsi birden "hâli" yapılabilir.
- zehirlenme: Metin OK; 5. adımın görseli kusurlu (aşağıda).
- zehirlenme-mantar: Metin OK; 4. adımın görseli küçük uyumsuzluk içeriyor (aşağıda).
- zehirlenme-gida: Metin OK; 10. adımın görseli kusurlu (aşağıda).
- zehirlenme-cocuk-yutma: OK
- zehirlenme-metanol: OK
- zehirlenme-tarim-ilaci: OK

Kaydırılmış (bir adım ileri/geri düşmüş) görsel bulunmadı; `art` dizilerinde değişiklik yapılmadı. 112 bandı HAYATİ rehberlerde ve zehirlenme rehberlerinde görünüyor. Kesilen ya da taşan öğe yok. Yabancı acil numarası yok (yalnızca 112 ve 114 geçiyor).

## Yeniden çizilmesi gereken görseller

| art id | rehber | adım | sorun |
|---|---|---|---|
| flush-water-15 | zehirlenme | 5 | Metinde "giysileri çıkarın, bölgeyi yıkayın" yazıyor ama görselde su kolun kolluğunun (giysinin) üstüne akıyor. Giysisi çıkarılmış çıplak cilt yıkanmalı. (Ortak görsel; başka rehberlerde de kullanılıyorsa yeni bir varyant çizilmeli.) |
| zehirlenme-gida-konserve-at | zehirlenme-gida | 10 | Çöpe atılan şişkin konservenin üstünde de yasak işareti var; bu, "atmayın" diye okunabiliyor. Yasak işareti yalnızca "tatma/açma" anlamına gelmeli; çöpe atma hareketi onay işaretiyle gösterilmeli. |
| zehirlenme-mantar-ornek | zehirlenme-mantar | 4 | Metin "poşete koyun" diyor, görselde ise sert plastik kap var. Küçük bir uyumsuzluk; poşet çizilebilir ya da metin "poşete ya da kaba" yapılabilir. |
