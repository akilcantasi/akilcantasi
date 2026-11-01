# "Sıfırdan" rehber paketleri: yazım talimatı (metin aşaması)

Proje: /home/claude/b ("Akıl Çantası", çevrimdışı Türkçe afet uygulaması). Ana uygulamada 168 acil durum rehberi var (src/content/guides/*.ts). Şimdi isteğe bağlı indirilen ayrı paketler üretiyoruz. Varsayım: medeniyet uzun süre geri gelmiyor; okuyucu elindeki doğa, hurda ve bilgiyle sıfırdan yaşamını kurmak zorunda. Konu listesi: packs-src/sifirdan/KATALOG.md.

Bu aşamada yalnızca METİN yazıyorsun (çizimler sonra). Ama her rehberde hangi adımların çizileceğini `art` dizisiyle ve spec açıklamalarıyla belirliyorsun.

## Okunacaklar
- docs/agents/REHBER_YAZIM.md: ana uygulamanın yazım kuralları. Dil, adım, keywords, ilaç dozu yasağı ve doğruluk kuralları aynen geçerli. Oradaki dosya yolları ve test bölümü bu iş için GEÇERSİZ; yollar aşağıda.
- src/content/types.ts: Guide tipi. Yeni `note` alanına dikkat.
- packs-src/sifirdan/types.ts: PackMeta ve PackGuide.
- Örnek üslup için bir ana rehber dosyası, ör. src/content/guides/hayatta-kalma.ts.

## Dosyaların
`packs-src/sifirdan/<paket-klasörü>/` içinde:
1. `guides.ts`:
   ```ts
   import type { PackMeta, CategoryMeta, PackGuide } from '../types';
   export const PACK: PackMeta = { id: 'sifirdan-…', name: 'Sıfırdan: …', desc: '…', version: 1 };
   export const CATEGORIES: CategoryMeta[] = [ { id: 'sf-…', title: '…', hint: '…', art: 'sf-…-kapak', color: '#…', order: 100+ } ];
   export const GUIDES: PackGuide[] = [ { id: 'sf-…', category: 'sf-…', title: …, tag: 'BÜYÜK HARF KISA', summary, steps, art, dont, keywords, sources, reviewed: false, checked: {…}, note? } ];
   ```
   Kategori sayısı paket başına 1–4; her kategoride 5+ rehber. `order` değerlerini sana verilen aralıkta tut.
2. `spec.ts`: `export const SPEC: Record<string, string> = { … }`. Kullandığın her çizim kimliği ve her kategori kapağı (`art`) için 1–3 cümlelik Türkçe çizim açıklaması. Kimlikler `sf-<kısa-paket-kodu>-…` biçiminde. Açıklama kuralları REHBER_YAZIM.md'deki gibi: bakış açısı, kim nerede, eller ne yapıyor, hangi nesneler, ok/yasak/onay. Bir rehberde çizim olacak adım sayısı 2–5. Çizimle anlatılamayacak adıma null koy.
3. `RAPOR.md`: rehber başına tek satır kaynak listesi ve açık kalan şüpheler.

Başka hiçbir dosyaya dokunma. Başka ajanlar başka paket klasörlerinde çalışıyor.

## İçerik kuralları
- Kimlikler `sf-` ile başlar; bütün uygulamada ve diğer paketlerde benzersiz olmalı. Denetim betiği çakışmayı yakalar.
- Bir katalog maddesi tek rehberde yetmiyorsa ikiye bölebilirsin. İki madde aynı şeyse birleştirebilirsin. Önemli bir eksik görürsen yeni rehber ekleyebilirsin; bunu raporda yaz.
- Adımlar uygulanabilir olsun: ölçüler, oranlar, süreler, sıcaklık belirtileri, "hazır olduğunu nasıl anlarsın" ipuçları. Okuyucu ilk kez yapıyor; neyin yanlış gittiğini nasıl fark edeceğini de söyle. 10 adımı aşacak kadar karmaşık bir iş varsa rehberi aşamalara böl (ör. "Kerpiç 1: toprak hazırlama", "Kerpiç 2: kalıp ve kurutma").
- `dont`: gerçek ve tehlikeli hatalar (zehirlenme, yangın, çökme, enfeksiyon riskleri).
- `note`: şu durumlarda zorunlu, 1–2 cümle:
  - yasal kısıt (avlanma, tuzak, balıkçılık, ağaç kesme, kuyu açma, ruhsatsız damıtma, amatör telsiz…): "Türkiye'de olağan koşullarda … yasaktır / izne bağlıdır; bu bilgi yalnız gerçek hayatta kalma durumu içindir." Yasayı aramayla doğrula.
  - ciddi sağlık ya da güvenlik riski: "Uzman gözetimi olmadan …".
- Yasaklar:
  - Silah, mermi, barut, patlayıcı ve yangın bombası yok. Avlanma tuzak ve oltayla anlatılır; yay ve mızrak yapımı yok.
  - İçki yapımı yok. Alkol yalnız dezenfektan olarak geçer; "içilmez, metanol riski" uyarısı her zaman yazılır.
  - İlaç dozu, bitkisel tedavi iddiası ve antibiyotik tarifi yok.
  - Zehirli bitki ve mantarı "tanıyıp yeme" teşviki yok. Mantar rehberi "yeme" yönünde.
- Türkiye bağlamı: Türkiye'de bulunan bitki ve hayvanlar, yerel adlar, bölgesel iklim, geleneksel yöntemler (pastırma, tarhana, kerpiç, tandır, kağnı, kirmen…). Ölçüler metrik.

## Doğruluk: en önemli kural
Her rehberi en az İKİ güvenilir kaynakla karşılaştır ve sayıları doğrula. WebSearch ve WebFetch kullan; bellekten yazma. Kaynak türleri:
- **Askeri ve resmi hayatta kalma el kitapları:** US Army FM 21-76 / ATP 3-50.21 (Survival), SAS Survival Handbook. Kamuya açık sürümlerden doğrulanabilenler.
- **Gıda:** USDA ve National Center for Home Food Preservation (nchfp.uga.edu), FAO, WHO, Türkiye Tarım ve Orman Bakanlığı, üniversite gıda mühendisliği yayınları, TSE ve Türk Gıda Kodeksi.
- **Tarım ve hayvancılık:** FAO, Tarım ve Orman Bakanlığı ve il müdürlükleri, ziraat fakülteleri, TAGEM.
- **Su ve hijyen:** WHO, CDC, UNICEF WASH, Sphere Handbook, CAWST.
- **Yapı:** Kerpiç ve toprak yapı üzerine üniversite ve ÇŞİDB yayınları, deprem yönetmeliği kerpiç bölümü, UN-Habitat ve CRAterre, FEMA.
- **Ateş ve soba:** Aprovecho Research Center (roket soba), ABD Orman Servisi, itfaiye.
- **Enerji:** NREL, ABD Enerji Bakanlığı, açık kaynak mühendislik el kitapları; elektrik güvenliği için IEC ve TSE.
- **Zanaat:** Müze ve etnografya kurumları, deneysel arkeoloji yayınları, Kültür Bakanlığı geleneksel el sanatları.
- **Yasa:** mevzuat.gov.tr (4915 Kara Avcılığı Kanunu, 1380 Su Ürünleri Kanunu, 6831 Orman Kanunu, 4733 ve alkol mevzuatı, BTK telsiz yönetmeliği).

Kaynaklar çelişirse en tutucu ve güvenli olanı izle. Bulamadığın bir sayıyı uydurma; adımı sayısız yaz ve raporda belirt. `sources` alanına gerçekten baktığın kaynakları kısa ad ve URL ile yaz (ör. "NCHFP — Drying meat (https://nchfp.uga.edu/…)"). `checked`: `{ "date": "2026-11-02", "note": "Kaynaklarla teyit: …" }`.

## Denetim
Her birkaç rehberde bir ve sonunda mutlaka çalıştır:
`cd /home/claude/b && npx -y tsx tools/check-sifirdan.ts <paket-klasörü>` → "hata yok" görmelisin.

## Son mesaj (150 kelimeyi geçmesin)
Rehber sayısı, kategoriler, eklediğin/çıkardığın/böldüğün konular, en tartışmalı 3 nokta, uzmana sorulması gerekenler.
