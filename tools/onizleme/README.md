# README önizlemeleri

`docs/images/` içindeki hareketli önizlemeleri (`onizleme.webp`, `enkaz.webp`, `harita.webp`) ve
ekran görüntüsü tablosundaki telefon görüntülerini (`fener.png`, `rehber.png`, `harita.png`,
`iletisim.png`, `kutuphane.png`, `araclar.png`) üretir.

Yeniden üretmek için (proje kökünde):

```bash
npm run build                                  # dist/ güncel olsun
node tools/onizleme/cek.mjs /tmp/onizleme/ham  # 1) telefon ekranları (Playwright, 390×844, 2×)
node tools/onizleme/kareler.mjs /tmp/onizleme/ham /tmp/onizleme/kare   # 2) kareler (HTML → PNG)
python3 tools/onizleme/birlestir.py /tmp/onizleme/kare docs/images      # 3) WebP ve PNG (Pillow)
```

- `cek.mjs` bilgi noktası sunucusunu geçici bir veri klasörüyle başlatır: `testdata/` içindeki örnek
  ZIM'ler ve örnek afet noktaları. `testdata/_turkiye.pmtiles` varsa gerçek harita kullanılır, yoksa
  örnek harita. Enkaz ekranları için Capacitor eklentileri `e2e/enkaz-check.mjs`'deki gibi taklit edilir.
  Yalnız bazı bölümleri çekmek için sona bölüm adı yazılır: `fener rehber harita iletisim kutuphane araclar enkaz`.
- Kare başlıkları, açıklamalar ve süreler `kareler.mjs` içindeki `DOSYALAR` listesindedir.
- Örnek veriler geneldir (Ayşe, Mehmet, Örnek Mahallesi, Ankara/Kızılay); CLAUDE.md §1'e uyun.
- Her kareyi yayımlamadan önce gözle denetleyin (`/tmp/onizleme/kare/*.png`).
