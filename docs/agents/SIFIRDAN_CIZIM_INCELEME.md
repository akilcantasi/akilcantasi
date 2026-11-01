# "Sıfırdan" paketleri: çizimlerin bağımsız incelemesi

Önce şunları oku: docs/agents/SIFIRDAN_CIZIM.md (araçlar, dosyalar, kurallar), docs/agents/CIZIM_DUZELTME.md (kalite kuralları), docs/agents/CIZIM_INCELEME.md (iyi çözüm kalıpları).

Paketin çizimlerini başka ajanlar yaptı; raporları `<paket>/CIZIM-*.md` dosyalarında. Sen onların işini görmedin. Taze gözle bakan sert bir editörsün.

## Görev
1. Paketi derle ve bütün paftaları çek:
   ```
   npx -y tsx tools/build-rehber-packs.ts <paket-klasörü>
   node tools/sifirdan-sheet.mjs data/rehber/<paket-id>.rehber.json /tmp/<batch>/sheets
   ```
2. Her çizimi İYİ / ZAYIF / KÖTÜ diye sınıfla. Ölçüt: uygulamanın sahibi "garip" der mi; stres altındaki biri 2 saniyede doğru anlar mı; metindeki ölçü, sayı ve teknikle birebir aynı mı. Etiketler ve ölçü okları doğru yeri gösteriyor mu?
3. ZAYIF ve KÖTÜ olanları yeniden çiz; birkaç denemede İYİ olmuyorsa `null` yap. Çizim ajanlarının raporlarında "şüphe" diye yazdıkları sahnelere özellikle bak.
4. Dosya sahipliği: bu paketin `scenes-*.tsx` dosyaları artık senin. guides.ts ve spec.ts'te yalnızca `art` dizileri ve spec satırları, küçük Edit'lerle.
5. Yeniden derle, değişen rehberlerin paftalarına bak. Son paftayı görmeden bitti deme.
6. `npx -y tsx tools/check-sifirdan.ts <paket>` "hata yok" demeli, derleme 0 uyarı vermeli.
7. Raporu `<paket>/CIZIM-INCELEME.md` dosyasına yaz: İYİ, ZAYIF ve KÖTÜ sayıları; ne değişti; null yapılanlar.

Son mesaj (100 kelimeyi geçmesin): sayılar ve en önemli düzeltmeler.
