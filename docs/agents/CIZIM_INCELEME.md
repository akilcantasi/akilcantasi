# Çizim düzeltme — 2. tur: bağımsız inceleme ve son düzeltme

Önce `docs/agents/CIZIM_DUZELTME.md` (kurallar) ve `docs/agents/CIZIM.md` (kit) dosyalarını oku. Kurallar aynen geçerli.

Bir önceki ajan senin rehberlerini düzeltti (raporu `docs/cizim-duzeltme/<batch>.md`). Sen onun işini görmedin; taze gözle bakan sert bir editörsün. Ölçütün: uygulamanın sahibi bu çizime bakınca "garip" der mi? Stres altındaki biri 2 saniyede doğru anlar mı?

İlk turdan sonra sahibin örneklerine bakıldı ve hâlâ şu sorunlar görüldü — bunlar senin rehberlerinde de olabilir:
- Kurtarıcı nefes sahnesinde (temel-yasam-destegi 8) yardımcının gövdesi yaralının üstüne uzanmış, iki baş birbirine karışmış; ne yapıldığı okunmuyor.
- Koma pozisyonu adımlarında (derlenme-pozisyonu 3–5) yukarıdan bakışta yardımcı, başının tepesi ve iki uzun kolu olan bir yığın gibi; eller, metindeki yerlere net değmiyor.
- Baş-geri-çene-yukarı sahnesinde eller alın ve çene üzerinde net seçilmiyor.

## İyi çözüm kalıpları
- **Yakın plan teknik:** Yukarıdan bakışta yardımcının bedenini çizme; yalnızca tek kenardan (genellikle alt kenar) giren iki ön kol ve eller. Kollar kesişmez, aynı kıyafet kolu. Eller dokunduğu noktada net ve büyük.
- **Kurtarıcı nefes:** Yandan, baş-omuz yakın planı (`s` 2–2.5). Yaralının başı geride, çenesi yukarıda. Yardımcının başı yandan, ağzı yaralının ağzının üstünde. Bir el alında (başparmak ve işaret parmağı burnu sıkıyor), diğer elin iki parmağı çene kemiğinin altında. Yaralının göğsünde küçük yukarı ok. Başlar birbirine karışmasın; iki profil net ayrılsın.
- **Tam beden duruş (KPR, taşıma):** Yandan, yardımcının bütün bedeni, yaralıyla aynı zemin çizgisinde, gerçekçi oranlarla.
- **Anlatılamıyorsa:** `null`.

## Görevin
1. Kendi vite sunucunu başlat (PORT aşağıda). Rehberlerinin GÜNCEL paftalarını çek:
   ```
   mkdir -p /tmp/<batch> && cp /tmp/ids.json /tmp/<batch>/ids.json && rm -rf /tmp/<batch>/shots
   node e2e/all-guides-shot.mjs http://localhost:<PORT>/ /tmp/<batch>/shots <id> ...
   python3 /home/claude/tools/sheet.py /tmp/<batch>/shots /tmp/<batch>/sheets <id> ...
   ```
2. Her paftayı aç, her çizimi şu üç sınıftan birine koy: İYİ / ZAYIF / KÖTÜ. Bu turda yalnızca İYİ olanlar kalabilir. ZAYIF ve KÖTÜ olanları yeniden çiz; birkaç denemede İYİ olmuyorsa `null` yap.
3. Dosya sahipliği: sana verilen sahne dosyaları senindir (önceki ajan bitti). Ortak `categories-common.tsx` yine düzenlenmez; ortak sahne kötüyse kendi dosyanda rehbere özel kopya yap. Rehber ve spec dosyalarında yalnızca kendi rehberlerinin `art` dizileri ve kendi kimliklerin, küçük Edit'lerle.
4. Yeniden çek, bak, gerekiyorsa tekrar et. Her rehberin son paftasını görmeden bitti deme.
5. Kontroller: `npx tsc --noEmit 2>&1 | grep -E "scenes/(<dosyaların>)"` boş; `npx vitest run tests/guides.test.ts` geçmeli.
6. Raporu `docs/cizim-duzeltme/<batch>-inceleme.md` dosyasına yaz: rehber başına İYİ/ZAYIF/KÖTÜ sayıları, ne değişti, ne null oldu.

Son mesaj (150 kelimeyi geçmesin): incelenen çizim sayısı, yeniden çizilen, null yapılan, kalan şüpheler.
