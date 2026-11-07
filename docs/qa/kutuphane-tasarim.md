# Kütüphane: yeni tasarım (2026-11)

Amaç: teknik bilgisi olmayan biri, ilk açılışta ne yapacağını, indirdiğini nerede bulacağını ve
okumaya nasıl döneceğini düşünmeden bilsin. Her ekranda tek, belirgin bir ana eylem olsun.

## Eski tasarımda gördüğümüz sorunlar (kullanıcı gözüyle denetim)

- Arama, raf kutucukları, %75'lik halka, "Önerilenler / Yerimi doldur / Temizle", "Paket setleri",
  alttaki turuncu "İndir" çubuğu ve rehber paketleri tek ekranda; indirilmiş içerik ile mağaza karışık.
- İndirilen bir şeyi "açmanın" yolu yok: kutucuğa dokununca yalnız arama süzülüyor, okunacak bir sayfa
  açılmıyor. Ana sayfalar en altta "Vikipedi (mini 2026-09) ana sayfası" gibi düğmelerde.
- Teknik dil: paket, kaynak, set, "maxi 2026-10", "tam metin dizini", dosya adları, "Kullanıcı:The other
  Kiwix guy/Landing" başlıklı ana sayfa.
- Alt çubuk sayfa açılır açılmaz "8 paket · 1,7 GB · İndir" diyor: kullanıcı neyi seçtiğini bilmiyor.
- İndirme ilerlemesi yalnız mağazanın en altındaki çubukta; nereye indiği belli değil.
- Kaldığı yerden devam etme, son okunanlar, içindekiler, yazı boyutunu kademeli ayarlama yok.
- Silmek için "Yönet" düğmesini bulup paket satırlarına inmek gerekiyor; ne kadar yer açılacağı görünmüyor.

## Bilgi mimarisi

```
Kütüphane sekmesi
├─ Kitaplığım (ana ekran)
│   ├─ Arama kutusu: "Kitaplığımda ara" → aynı ekranda birleşik sonuçlar
│   ├─ Kaldığın yerden devam et (son okunan, okunan oran)
│   ├─ İndirilenler şeridi (yalnız inen/duraklayan varsa) → İçerik indir
│   ├─ Koleksiyonlarım: büyük kartlar (simge + renk, insan dilinde ad, boyut, son okuma)
│   ├─ Son okunanlar
│   └─ [ + Yeni içerik indir ]  (ana eylem)   ·  "Yer aç ve yönet" bağlantısı
├─ Koleksiyon (karta dokununca)
│   ├─ Başlık kartı: ad, kısa açıklama, madde sayısı, dil
│   ├─ "Bu koleksiyonda ara"
│   ├─ [ Okumaya başla ] (ana sayfa) · Rastgele bir madde
│   ├─ Kitap kitaplıklarında (PDF): kitap listesi doğrudan burada
│   ├─ Bu koleksiyonda son okunanlar
│   └─ Ayrıntılar (dosya adı, boyut, dizin, kaynak) · Telefona kaydet / Sil
├─ Okuyucu (makale)
│   ├─ Üst çubuk: ← (geldiği ekranın adı) · ‹ › · Sayfada bul · İçindekiler · Aa
│   ├─ Aa paneli: 5 kademeli yazı boyutu (A− / A+)
│   ├─ Fener'e sor · Paylaş · Türkçeye çevir (Türkçe değilse)
│   └─ Dış bağlantı çevrimdışıyken: "Bu bağlantı internet ister" bildirimi (yalnız orada)
├─ PDF okuyucu: son okunan sayfa hatırlanır
├─ İçerik indir (mağaza)
│   ├─ Boş yer çubuğu ("Telefonunuzda 2,1 GB boş")
│   ├─ Önerilen başlangıç seti: içindekiler, toplam boyut, [ Hepsini indir ]
│   ├─ Mağazada ara + ihtiyaca göre bölümler: Sağlık ve ilk yardım · Genel bilgi · Su ve yemek ·
│   │   Afet ve hayatta kalma · Kendin yap ve onarım · Kitaplar · Sözlük ve dil
│   │   (her bölüm ilk 3 öğe + "Tümünü göster")
│   ├─ Her öğe: ad, bir satır açıklama, boyut + sığma ipucu, dil rozeti, tek düğme
│   │   (İndir → ilerleme + Duraklat → Devam / İptal → Oku); teknik bilgiler "Ayrıntılar"da
│   ├─ Hazır setler (Hayatta kalma, Sağlık, Okur, Usta) ve "Boş yerime göre seç"
│   ├─ Kendine Yetmek rehberleri
│   └─ Elinizdeki dosyayı ekleyin (dosyadan içe aktarma)
└─ Yer aç ve yönet: koleksiyonlar boyuta göre, ne kadar yer açılacağı yazılı, satır içi silme onayı,
    güncellemeler
```

## Adlandırma

| Eski | Yeni |
|---|---|
| Çevrimdışı kütüphane / Rafım / Tümü | Kitaplığım |
| Paket, kaynak, ZIM | Koleksiyon (kullanıcıya), dosya adı yalnız "Ayrıntılar"da |
| Vikipedi (mini 2026-09) | Katalogdaki ad: "Vikipedi Türkçe (özet)", dil ayrı rozet |
| … ana sayfası | Okumaya başla |
| Paket setleri / Önerilenler | Önerilen başlangıç seti, Hazır setler |
| Yönet | Yer aç ve yönet |
| Cihaza kaydet (bilgi noktası) | Telefona kaydet |
| ← Sonuçlara dön | ← Kitaplığım / ← Sonuçlar / ← koleksiyon adı |

## Boş durumlar

- Hiç içerik yok: sakin bir simge, "Kitaplığınız boş" ve tek cümle; ana eylem "Önerilen seti indir
  (1,7 GB)", ikincil "Neler var, göz at". Bilgi noktası yakında ise kendiliğinden görünür.
- Aramada sonuç yok: "… bulunamadı" + öneri (daha kısa kelime) + "Mağazada ara" bağlantısı.
- Koleksiyon açılamadıysa: kartta "Açılamadı" ve Ayrıntılar'da sebep; kırmızı kullanılmaz.

## Kaldırılan / birleştirilen

- Kitaplığım ile mağaza ayrıldı; alttaki sürekli "İndir" çubuğu ve seçim modu (Önerilenler / Yerimi
  doldur / Temizle) kaldırıldı: setlerin her biri kendi "İndir" düğmesine sahip, "Yerimi doldur"
  onaylı tek bir eylem oldu ("Boş yerime göre seç").
- Raf kutucukları (kapaklar) → koleksiyon kartları; arama süzgeci olarak sonuç ekranında küçük çipler.
- Ana sayfa düğmeleri listesi → koleksiyon ekranında "Okumaya başla".
- Kaynak bilgi kartı (madde sayısı, "tam metin dizini", "çevrimdışı" etiketleri) → koleksiyon başlığı
  ve Ayrıntılar.

## Başarım

- Kitaplığım ilk çizimde arşivleri açmaz: paket listesi + katalog + önbelleğe alınmış üstveri
  (`ac.lib.meta`) yeter. Arşivler arama kutusuna dokununca ya da boşta (requestIdleCallback) açılır.
- Uzun listeler (mağaza bölümleri, arama sonuçları, kitap listeleri) parça parça çizilir ("Daha fazla").
