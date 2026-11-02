# 11-yiyecek-hayvansal — kaynak raporu

Paket: `sifirdan-yiyecek-hayvansal` · kısa kod: yh · 19 rehber · 3 kategori (order 180–182) · tarih 2026-11-02

Kategoriler: sf-yh-kurbaga (Kurbağa, kerevit, salyangoz; 6), sf-yh-balik (Balık ve deniz canlıları; 7), sf-yh-guvenlik (Böcek, yumurta ve av güvenliği; 6).

Katalog bölüm 17 (madde 314–327) eşlemesi:
- 314 Kurbağa → 4'e bölündü: sf-yh-kurbaga-tanima, -yakalama, -temizleme, -pisirme. Mevcut 01 paketindeki "Kerevit ve kurbağa yakalama" (sf-yb-kerevit-kurbaga) kısa özet; bu dizi ayrıntılandırıyor.
- 315 → sf-yh-salyangoz · 316 → sf-yh-kerevit-kapan (01'deki ip yöntemine ek olarak kapan, arındırma, bağırsak) · 317 → sf-yh-yengec-kestanesi · 318 → sf-yh-ahtapot-kalamar · 319 → sf-yh-elle-balik · 320 → sf-yh-gece-balik · 321 → sf-yh-buz-balik · 322 → sf-yh-tatlisu-balik · 323 → sf-yh-parazit-korunma · 324 → sf-yh-olu-hayvan (01'deki "Hayvan hastalıkları ve et güvenliği" rehberine kuduz, kuş gribi ve istisnalar ekliyor) · 325 → sf-yh-kus-yumurtasi-koruma (01'deki "Kuş yumurtası toplama" rehberinin koruma yönü) · 326 → sf-yh-ari-larvasi · 327 → sf-yh-cekirge (01'deki "Böcek yeme" rehberine ek).
- EKLENEN: sf-yh-deniz-zehirli (balon balığı, trakonya, iskorpit; 322'nin deniz tarafı) ve sf-yh-yenmeyecek-hayvanlar (kaplumbağa, kirpi, kertenkele, yılan, yarasa, kuşlar; görevdeki "yeme teşviki yok" ilkesini tek yerde topluyor).

## Yasal doğrulama (kurbağa)
- Güncel ticari tebliğ: 6/1 Numaralı Ticari Amaçlı Su Ürünleri Avcılığının Düzenlenmesi Hakkında Tebliğ (2024/20), RG 11.08.2024/32629, geçerlilik 1.9.2024–31.8.2028. Kurbağa, kara salyangozu ve sülük avcılığı madde 44'te, kerevit madde 43'te. Madde METİNLERİ okunamadı (Lexpera ücretli; mevzuat.gov.tr ve Resmî Gazete robots engelli; FAOLEX PDF'leri kesik).
- Eski 3/1 tebliğ (2012–2016, Ankara İl Md. broşürü): kurbağada asgari 30 g; kerevitte 1 Kasım–30 Haziran yasak, 10 cm, yemle av yasağı. TURJAF makalesi (aynı tebliğ): kurbağa yasak dönemleri il gruplarına göre 1 Mart–30 Nisan, 1 Nisan–31 Mayıs, 15 Mayıs–15 Temmuz; Antalya ve Muğla'da her dönem yasak; Bolkar'da Rana holtzi yasak.
- Amatör tebliğ 2024/21: madde 8(8) avlanma amaçlı her türlü ışık yasak (50 W güvenlik ışığı hariç); madde 13 iç sularda pinter, sepet, zıpkın yasak; zehir, karpit, kireç, bitki; yatak değiştirerek kurutma yasak. Kurbağa, salyangoz, ahtapot, deniz kestanesi amatör tebliğde geçmiyor.
- Bu nedenle `note` alanlarında güncel dönem tarihleri verilmedi; "ile göre değişen ilkbahar yasak dönemi, izin ve ağırlık sınırı" yazıldı. UZMAN/HUKUKÇU: 2024/20 madde 29–31, 43, 44 ve eklerindeki boy tablosu okunup notlar güncellenmeli.

## Rehber başına kaynaklar
- sf-yh-kurbaga-tanima: Wikipedia Marsh frog, Bufotoxin, European green toad; FM 21-76 bölüm 8; CDC sürüngen-amfibi salmonella; Wikipedia Sparganosis; TURJAF; Yeni Akit/Oryx. ŞÜPHE: ağaç kurbağası boyu ve parmak diski, Rana türlerinin "gözün arkasında koyu leke" ayırt edici özelliği kaynakla açılmadı.
- sf-yh-kurbaga-yakalama: MDC Getting started frog hunting; amatör tebliğ 2024/21; TURJAF; FM 21-76. ŞÜPHE: belden kavrama tekniği tek kaynaklı değil, sahada yaygın uygulama.
- sf-yh-kurbaga-temizleme: Honest Food; CDC salmonella; Wikipedia Sparganosis; Wikipedia Trout tickling (darbe). ŞÜPHE: insancıl öldürme yöntemi (darbe + baş kesme) hayvan refahı kaynağıyla (AVMA) doğrulanmadı.
- sf-yh-kurbaga-pisirme: CDC DPDx sparganosis; Wikipedia Sparganosis; CDC Angiostrongylus; FoodSafety.gov; CDC Diphyllobothrium. ŞÜPHE: kurbağa için özel sıcaklık yok, yabani av değeri 71 °C uygulandı; tuz-sirke-tütsünün yetersizliği balık tenyasından genellendi.
- sf-yh-kerevit-kapan: FM 21-76; LSU AgCenter; CDC paragonimiasis; Ankara İl Md. eski tebliğ broşürü; amatör tebliğ. ŞÜPHE: kapan ölçüleri pratik bilgi.
- sf-yh-salyangoz: Küre Ansiklopedi Helix lucorum; Michelin Guide; Mother Earth News; CDC Angiostrongylus. ŞÜPHE: kaynatma süresi için sayı bulunamadı; iç organ ucunu kesme geleneksel uygulama.
- sf-yh-elle-balik: Wikipedia Trout tickling, Noodling; amatör tebliğ; CDC Diphyllobothrium; FM 21-76.
- sf-yh-gece-balik: amatör tebliğ; ticari tebliğ 2020/20 madde 13 (FAOLEX); FM 21-76. ŞÜPHE: kamış ölçüsü, zil ve "gece dipte beslenen balık kıyıya gelir" ikinci kaynakla doğrulanmadı.
- sf-yh-buz-balik: Minnesota DNR; Kanada Kızılhaçı. Kaynaklar çelişti (10 cm / 15 cm), tutucu 15 cm seçildi.
- sf-yh-tatlisu-balik: Acta Biomedica (barbel cholera); Wikipedia Common barbel; CDC Diphyllobothrium; FM 21-76; FoodSafety.gov. ŞÜPHE: Capoeta (siraz) yumurtasının da zehirli olduğu iddiası doğrulanamadığı için yazılmadı; pişirmenin barbel yumurta zehrine etkisi bilinmiyor.
- sf-yh-deniz-zehirli: Wikipedia Lagocephalus sceleratus, Tetrodotoxin, Weever. ŞÜPHE: tetrodotoksinin ısıya dayanıklılığı açılan kaynaklarda yoktu (genel bilgi); iskorpit dikeni için kaynak açılamadı.
- sf-yh-yengec-kestanesi: FM 21-76; Washington DOH PSP; CDC paragonimiasis; Wikipedia Paracentrotus lividus; FoodSafety.gov. ŞÜPHE: kestane açma yöntemi ve çiğ yeme riski kaynakla doğrulanmadı; deniz kestanesi ve yengeç tebliğ maddeleri okunamadı.
- sf-yh-ahtapot-kalamar: Kopiaste; CIA Foodies; amatör tebliğ; FoodSafety.gov. ŞÜPHE: gözler arası öldürme, iple ve testiyle yakalama ve kalamarın kısa-uzun pişirme kuralı tek kaynaklı ya da kaynaksız; ahtapot ağırlık sınırı doğrulanamadı.
- sf-yh-ari-larvasi: New Atlas; ZHAW Herren 2019; 03 paketi arıcılık rehberleri. ŞÜPHE: alerji ve ilaç kalıntısı uyarıları kaynaksız tutucu ekleme.
- sf-yh-cekirge: FM 21-76; Wikipedia Pine processionary, Cantharidin; 01 paketi böcek rehberi.
- sf-yh-kus-yumurtasi-koruma: 4915 sayılı Kanun; Wikipedia Bern Convention; Sözcü/DHA 2024 tazminat listesi; FM 21-76; CDC kuş gribi; FoodSafety.gov. ŞÜPHE: Bern madde 6 metni açılamadı.
- sf-yh-yenmeyecek-hayvanlar: 4915; Sözcü/DHA; CDC salmonella; WHO kuduz; CDC kuş gribi; Bern. ŞÜPHE: kirpinin koruma statüsü (MAK kararı) belgeyle doğrudan teyit edilmedi.
- sf-yh-parazit-korunma: CDC kene çıkarma; WHO KKKA; Healthline sülük; Wikipedia Leech, Limnatis nilotica; WHO echinococcosis; CDC kuş gribi. ŞÜPHE: Sağlık Bakanlığı KKKA sayfası robots engelli, açılamadı.
- sf-yh-olu-hayvan: WOAH anthrax; Worms & Germs (OVC) rabies and roadkill; WHO kuduz; CDC kuş gribi; 01 paketi et güvenliği rehberi. ŞÜPHE: istisna ölçütleri yazarın tutucu kararı.

## Uzmana sorulacaklar
1. Hukukçu/Tarım Md.: 2024/20 tebliğ madde 43–44 (kurbağa, salyangoz, kerevit dönem ve ağırlıkları), 29–31 (deniz kestanesi, yengeç, ahtapot).
2. Veteriner/halk sağlığı: kurbağa ve salyangoz için güvenli pişirme sıcaklığı/süresi; ölü hayvan istisna ölçütleri.
3. Biyolog: Türkiye'deki Pelophylax, Bufo/Bufotes, Hyla, Rana ayrım ölçütleri; kirpi ve kertenkelelerin güncel MAK koruma statüsü.
