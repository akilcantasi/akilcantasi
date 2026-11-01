# "Sıfırdan" paketleri: çizim aşaması

Proje: /home/claude/b. Önce bunları oku:
1. docs/agents/CIZIM.md — kit2 çizim kılavuzu.
2. docs/agents/CIZIM_DUZELTME.md — kalite kuralları. Uygulamanın sahibi eski çizimlerde şunlardan şikâyet etti:
   - adımdan adıma değişen karakterler;
   - acil durumda gülümseyen yüzler;
   - kopuk, birbirine dolanan kollar;
   - baş aşağı ya da çarpık insanlar;
   - ne olduğu anlaşılmayan sahneler.

   Bu kurallar burada da aynen geçerli. Oradaki dosya yolları ve çekim komutları bu iş için geçersiz; doğruları aşağıda.
3. src/art/scenes/_ornek.tsx — çalışan örnek sahneler. Ana uygulamadan iyi örnekler: src/art/scenes/hayatta-kalma-1.tsx, deprem.tsx.
4. Paketin guides.ts ve spec.ts dosyaları. spec, her çizim kimliğinin açıklamasıdır.

## Kapsam
Rehber başına EN FAZLA 3 çizim. Rehberin anlaşılması için en değerli adımları seç: bir tekniğin kritik anı, bir ölçü ya da düzen, son ürünün doğru hali. Seçmediğin adımların `art` girdisini `null` yap. Soyut adımlar ("bekleyin", "kaydedin", "dikkat edin") çizilmez. Kategori kapakları (`CATEGORIES[].art`) da çizilir: kategori başına bir sade ikon-sahne. Bir sahneyi aynı anlamda birden fazla rehberde kullanabilirsin.

Spec açıklaması metinle çelişiyorsa ya da çizilemeyecek kadar karmaşıksa, açıklamayı sadeleştir ve spec.ts'i güncelle.

## Dosyalar
- Sahneler: `packs-src/sifirdan/<paket>/scenes-<harf>.tsx`
  ```ts
  import { Scene2, Person, POSE, K, ... } from '../../../src/art/kit2';
  export const SCENES: Record<string, () => JSX.Element> = { 'sf-xx-…': () => <Scene2 …>…</Scene2> };
  ```
- `packs-src/sifirdan/<paket>/scenes.tsx`: bütün scenes-*.tsx dosyalarını birleştirir:
  ```ts
  import { SCENES as A } from './scenes-a';
  import { SCENES as B } from './scenes-b';
  export const SCENES = { ...A, ...B };
  ```
  Paketi iki ajan paylaşıyorsa bu dosyayı ilk sen oluştur ya da var olana yalnız kendi satırını ekle.
- Senin harfin ve rehberlerin görev mesajında. `guides.ts` ve `spec.ts`'te yalnızca kendi rehberlerinin `art` dizilerini ve kendi kimliklerini küçük Edit'lerle değiştir. Rehber metnine dokunma.
- `src/art/kit2.tsx`'e ve ana uygulama dosyalarına dokunma. Eksik nesneleri (tencere, kalıp, çekiç, ağaç gövdesi, kerpiç, kovan…) kendi dosyanda `OG`, `capsule`, `rrect`, `ell`, `smooth` ile yap. İhtiyacın olan yardımcıları kendi dosyanın başında tanımla.

## Tutarlılık
- Paket başına bir oyuncu kadrosu öner: dosya başında `CAST` sabitleri. Bir rehberin bütün çizimlerinde aynı kişi(ler) görünür.
- Paket genelinde aynı malzeme aynı renkte çizilir: kerpiç, kil, odun, demir, su.

## Çek ve bak (zorunlu)
```
cd /home/claude/b
npx -y tsx tools/build-rehber-packs.ts <paket-klasörü>
node tools/sifirdan-sheet.mjs data/rehber/<paket-id>.rehber.json /tmp/<batch>/sheets <rehber-id> ...
```
Paftalar `/tmp/<batch>/sheets/<rehber-id>.png` dosyalarına düşer; her biri çizimi, adım metnini ve kimliği gösterir. HER paftayı Read ile aç ve sert bir editör gözüyle değerlendir: stres altındaki biri 2 saniyede doğru anlar mı, teknik doğru mu, garip bir şey var mı? Kötü olanı yeniden çiz; birkaç denemede iyi olmuyorsa `null` yap. Her rehberin son paftasını görmeden bitti deme.

Derleme uyarıları ("sahnesi yok" gibi) senin rehberlerinde kalmamalı.

## Kontroller
- `npx -y tsx tools/check-sifirdan.ts <paket>` → "hata yok".
- Derleme hatasız.

## Rapor ve son mesaj
- Rapor: `<paket>/CIZIM-<harf>.md`. Oyuncular, rehber başına çizilen adımlar, null yapılanlar, kalan şüpheler.
- Son mesaj (120 kelimeyi geçmesin): çizilen sahne sayısı, null yapılan, şüpheler.
