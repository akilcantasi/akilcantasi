# "Sıfırdan" paketleri: bağımsız doğrulama turu

Önce şunları oku:
- docs/agents/SIFIRDAN_YAZIM.md: yazım kuralları ve yasaklar.
- Paketin `RAPOR.md` dosyası: yazarın notları ve zayıf noktalar.

Sen bu rehberleri yazmadın. Şüpheci bir uzman gibi davran. İnsanlar bu bilgiyi başka hiçbir kaynağa ulaşamadığı bir anda uygulayacak; bir hata zehirlenmeye, çöken bir duvara ya da yangına yol açabilir.

## Arama kotası
Ortak web arama kotası kısıtlı ve yazım aşamasında doldu.
- WebSearch'i paket başına en fazla 25 kez kullan.
- Asıl doğrulamayı WebFetch ile, bildiğin güvenilir sayfaları doğrudan açarak yap: nchfp.uga.edu, fao.org/docrep, who.int, cdc.gov, extension.*.edu (ABD üniversite yayım servisleri), tarimorman.gov.tr ve il müdürlükleri, aprovecho.org, wikipedia (yalnız ilk ipucu için, tek başına kaynak değil), archive.org (FM 21-76 metni).
- Tam metne ulaşamazsan bunu açıkça yaz; uydurma.

## Görevin
1. Önce RAPOR.md'de "zayıf / tek kaynak / doğrulanamadı" diye işaretli rehberler, sonra geri kalanlar. Her rehberde:
   - her sayı (süre, sıcaklık, oran, ölçü, mesafe);
   - güvenlik açısından kritik iddialar (gıda güvenliği, zehir, yapı dayanımı, yangın, karbonmonoksit, elektrik, kimyasal);
   - tehlikeli eksik uyarılar.
2. Yanlışı düzelt:
   - `guides.ts`'te küçük, tam eşleşen Edit'lerle;
   - doğrulanamayan riskli bir sayıyı tutucu bir ifadeye çevir ya da kaldır;
   - güvenli kılınamayan bir rehberi baştan yaz ya da çıkar ve raporda gerekçesini yaz.
   - Adım ya da kimlik değişikliğinde `art` uzunluğunu ve spec'i tutarlı tut.
3. `sources`'ı gerçekten doğruladığın kaynaklarla güncelle. `checked.note`'u "Bağımsız doğrulama: …" diye yenile.
4. Yasaklara uyulmuş mu kontrol et: silah ve patlayıcı yok; içki tarifi yok; ilaç dozu yok; yasal ya da sağlık riski olan her rehberde `note` var.
5. `npx -y tsx tools/check-sifirdan.ts <paket>` "hata yok" demeli.
6. Raporu `<paket>/DOGRULAMA.md` dosyasına yaz:
   - rehber başına sonuç: TEYİTLİ / DÜZELTİLDİ / ZAYIF KALDI / ÇIKARILDI, ve kısa gerekçe;
   - değişikliklerin önce → sonra hali;
   - uzmana gidecek liste.

Yalnızca sana verilen paket klasöründe çalış.

Son mesaj (150 kelimeyi geçmesin): sayımlar ve en ciddi 3–5 düzeltme.
