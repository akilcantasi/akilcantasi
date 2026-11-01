# Rehber paketleri (.rehber.json)

Ana uygulamadaki 168 yerleşik rehbere ek olarak isteğe bağlı indirilen rehber paketleri
(ör. "Sıfırdan" medeniyet sonrası yaşam rehberleri). Paket tek bir JSON dosyasıdır ve
kod içeremez: rehberler düz veri, çizimler önceden üretilmiş sabit SVG metnidir.

## Biçim

Dosya adı: `<paket-id>.rehber.json` (uzantı zorunlu; sıradan `.json` harita noktası sayılır).

```
{
  "format": "akil-rehber",
  "version": 1,
  "pack":       { "id": "sifirdan-…", "name": "…", "desc": "…", "version": 1 },
  "categories": [ CategoryMeta … ],          // src/content/types.ts
  "guides":     [ Guide & { "category": "sf-…" } … ],
  "art":        { "<çizim-id>": "<svg …>…</svg>" }
}
```

- Doğrulama ve SVG temizleme: `src/content/rehber-pack.ts` (`validateRehberPack`, `sanitizeSvg`).
  Biçim/paket bilgisi bozuksa paket reddedilir; tek tek bozuk rehber ve çizimler atlanır.
- SVG'lerden `script`, `foreignObject`, `style`, `use`, `image`, animasyon öğeleri, `on*`
  öznitelikleri ve `#` dışındaki bağlantılar atılır. Uygulama çizimi ayrıca
  `<img src="data:image/svg+xml,…">` olarak gösterir; SVG içinde betik çalışamaz.
- Yerleşik bir rehberle aynı kimliği taşıyan paket rehberi yok sayılır.
- Rehberin `note` alanı (yerleşik rehberlerde de) ayrıntı ekranının başında uyarı bandı olarak gösterilir.

## Kaynak ve derleme

Kaynaklar: `packs-src/sifirdan/<klasör>/guides.ts` (`PACK`, `CATEGORIES`, `GUIDES`),
`spec.ts` (çizim açıklamaları), isteğe bağlı `scenes.tsx` (`SCENES: Record<id, () => JSX>`, kit2 ile).
Yapı denetimi: `npx -y tsx tools/check-sifirdan.ts`.

```
npx -y tsx tools/build-rehber-packs.ts                 # tüm gerçek paketler
npx -y tsx tools/build-rehber-packs.ts 01-yiyecek      # yalnız seçilen klasör(ler)
npx -y tsx tools/build-rehber-packs.ts --include-test  # "_" ile başlayanlar da (ör. _deneme)
  --base-url=https://akilcantasi.com/packs/            # manifest adreslerinin öneki (varsayılan bu)
```

Betik:
1. `scenes.tsx`'i esbuild ile derler (Preact JSX), her sahneyi `preact-render-to-string` ile
   SVG metnine çevirir (`xmlns` eklenir, `class="art"` atılır). Sahne `<svg>` üretmiyorsa uyarır.
2. Rehberlerde geçen ama sahnesi olmayan çizim kimliklerini `null` yapar, uyarı yazar;
   kullanılmayan sahneler pakete girmez. `scenes.tsx` yoksa paket çizimsiz derlenir.
   Kategori kapağı çizilmemişse uygulama kategorinin ilk çizimli adımını kapak yapar.
3. Paketi doğrular, `data/rehber/<id>.rehber.json` yazar, boyut ve sha256 basar.
4. Katalog girdilerini (`kind: "rehber"`) `data/rehber/manifest-girdileri.json` dosyasına yazar.

## Kataloğa ekleme

1. `.rehber.json` dosyalarını sunucuya yükleyin (`--base-url` ile verilen adres).
2. `manifest-girdileri.json` içindeki girdileri `public/packs-manifest.json` → `packs` dizisine
   ekleyin (aynı `id` varsa değiştirin), `updated` tarihini artırın. Girdiler `validateManifest`
   ile denetlenmiştir; paket her derlemede değişirse `size` ve `sha256` de değişir.

## Uygulamadaki akış

- `src/lib/packs.ts`: `PackKind` içinde `'rehber'`; `kindOf()` `.rehber.json` → `'rehber'`.
  `src/lib/manifest.ts`: `KINDS`, `EXT_BY_KIND`, `fileMatchesKind()`.
- Kütüphane sekmesi (`KutuphaneMagaza.tsx`) → "Sıfırdan rehberleri" rafı: katalogdaki paketleri
  indir, kurulu olanları sil (boyutla), "Rehber paketini dosyadan içe aktar". Araçlar → Paketler de
  `.rehber.json` alır. İçe aktarmada dosya önce doğrulanır, sonra OPFS'e kopyalanır.
- `src/content/pack-guides.ts`: kurulu paketleri OPFS'ten ya da bilgi noktasından okur, doğrular,
  bellekte tutar; paket listesi değişince (`packsVersion`) yeniler ve abonelere haber verir
  (`usePackGuides`, `subscribePackGuides`). Açılışta `initPackGuides()` (main.tsx).
- Rehber sekmesi: paket kategorileri ana kategorilerden sonra "Sıfırdan" bölümünde; paket
  çizimleri `<Art>` üzerinden `<img>` ile. `?guide=<id>` ve `?cat=<id>` paket yüklenince açılır.
- Arama (`guides-search.ts`: `getAllGuides`, `getGuide`) paket rehberlerini de kapsar; dizin
  paket sürümü değişince yeniden kurulur. Fener RAG aynı aramayı kullanır.
- Testler: `tests/rehber-paket.test.ts`.
