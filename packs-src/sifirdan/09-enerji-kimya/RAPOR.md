# 09-enerji-kimya — kaynak ve şüphe raporu

Paket: `sifirdan-enerji-kimya` (Sıfırdan: Enerji ve kimya), 38 rehber, 4 kategori (order 165–168).
Tarih: 2026-11-02. Not: Çalışmanın ortasında ortak WebSearch kotası doldu; sonraki doğrulamalar yalnız WebFetch ile doğrudan açılan sayfalarla yapıldı. mevzuat.gov.tr robots engeli nedeniyle kanun metinleri okunamadı.

## Kapsam değişiklikleri
- Bölündü: 230 → `sf-ek-gunes-baglanti` (seri/paralel) + `sf-ek-sarj-kontrol` (kontrolcü, bağlama sırası). 225 → `sf-ek-el-pompasi` + `sf-ek-koc-pompasi`. 243 → `sf-ek-odun-komuru` + `sf-ek-aktif-komur`.
- Birleştirildi: 226 (bisiklet dinamosu + pedallı jeneratör) tek rehber. 240 (saat mekanizması, ağırlıklı düzenek) sarkaçla zaman ölçme ağırlıklı yazıldı; gerçek eşapmanlı saat yapımı kapsam dışı.
- Kategori yerleşimi: zir ve el çamaşır makinesi "Basit makineler"de; biyogaz ve odun gazı "Kimya ve malzeme"de.
- Tekrar edilmedi: ana uygulamadaki jeneratör güvenliği, güneş-powerbank ve araçta şarj rehberleri. Sabun yapımı ve turşu ayrıntısı başka paketlere bırakıldı.

## Rehber başına kaynaklar
- sf-ek-kaldirac — Body Physics (Open Oregon) Body Levers; Firgelli Lever.
- sf-ek-palanga — Wikipedia Pulley; Wikipedia Block and tackle.
- sf-ek-rampa — Energy Education Inclined plane; LibreTexts Inclined Plane.
- sf-ek-bocurgat — Firgelli Windlass; Wikipedia Capstan (nautical).
- sf-ek-agirlik-sarkac — Wikipedia Seconds pendulum; Body Physics.
- sf-ek-camasir — Wikipedia Posser; Wikipedia Lye.
- sf-ek-zir — Wikipedia Pot-in-pot refrigerator; Wikipedia Mohammed Bah Abba.
- sf-ek-su-carki — Wikipedia Water wheel; Energy Education Water wheel; Strathclyde ESRU Hydro.
- sf-ek-su-degirmeni — Wikipedia Watermill; Wikipedia Water wheel.
- sf-ek-yel-degirmeni — Wikipedia Windpump; Wikipedia Windmill.
- sf-ek-el-pompasi — Wikipedia Hand pump; NC State Extension Hydraulic ram pumps (debi ölçümü).
- sf-ek-koc-pompasi — Wikipedia Hydraulic ram; Practical Action Hydraulic ram pumps; NC State Extension.
- sf-ek-mikro-hidro — Strathclyde ESRU Hydro; Wikipedia Small wind turbine (sapma yükü); Generac backfeed.
- sf-ek-ruzgar-turbini — Wikipedia Small wind turbine; NDSU Extension tower height; Scoraig Wind (Hugh Piggott) Tristar.
- sf-ek-kablolama — Victron Wiring Unlimited; Engineering ToolBox 12 V wire; Generac backfeed.
- sf-ek-aku — Deep Cycle Battery FAQ (qsl.net); Victron Wiring Unlimited.
- sf-ek-gunes-baglanti — Renogy series/parallel; Victron Wiring Unlimited.
- sf-ek-sarj-kontrol — Victron Community (kılavuz 6.5 sırası); Renogy; Low-tech Magazine bike generator.
- sf-ek-invertor — Victron Wiring Unlimited; Samlex pure vs modified sine; Generac backfeed.
- sf-ek-pedal-jenerator — Low-tech Magazine bike generator; Wikipedia Bicycle dynamo.
- sf-ek-alternator — Wikipedia Alternator (automotive); Low-tech Magazine; Cal Poly alternator rewinding.
- sf-ek-pil-paketi — tspi.at 18650 recovery; USFA energy storage fires; Victron Wiring Unlimited.
- sf-ek-termoelektrik — Ferrotec TE reference guide 13; IEA Bioenergy Task 33 TEG.
- sf-ek-kimya-guvenlik — CDC NIOSH Pocket Guide calcium oxide; Wikipedia Lye; Wikipedia Calcium oxide.
- sf-ek-kirec — Wikipedia Lime kiln; Wikipedia Calcium oxide; Wikipedia Lime (material).
- sf-ek-alci — Wikipedia Plaster; Wikipedia Gypsum.
- sf-ek-odun-komuru — FAO Simple technologies for charcoal making (bölüm 5); Wikipedia Charcoal; ORNL-6404 (CO).
- sf-ek-aktif-komur — Wikipedia Activated carbon; Wikipedia Charcoal.
- sf-ek-potas — Wikipedia Potash; Wikipedia Lye.
- sf-ek-tuz — Wikipedia Sea salt; Wikipedia Bittern (salt).
- sf-ek-mum — Wikipedia Beeswax; Wikipedia Candle; Wikipedia Tallow.
- sf-ek-yag — Wikipedia Olive oil extraction; Walnut oil; Sunflower oil; Botulism.
- sf-ek-kagit — Wikipedia Washi; Wikipedia Papermaking.
- sf-ek-murekkep — Wikipedia India ink; Wikipedia Iron gall ink.
- sf-ek-cam — Wikipedia Glass production; Wikipedia Potash.
- sf-ek-fermantasyon — Wikipedia Vinegar; Penn State/eXtension biogas safety (CO₂ birikimi).
- sf-ek-biyogaz — Penn State/eXtension Anaerobic digesters and biogas safety; Wikipedia Biogas.
- sf-ek-odun-gazi — ORNL-6404 / FEMA simplified wood gas generator (1989); Wikipedia Wood gas.

## Açık kalan şüpheler (uzmana)
1. Yasal notlar doğrulanmadı: 6831 sayılı Orman Kanunu (kireç ve kömür ocağı, ateş) ve dereden su alma / bent kurmanın DSİ iznine bağlılığı (su çarkı, değirmen, koç pompası, mikro hidro). Şebeke bağlantısında Türkiye mevzuatı (lisanssız üretim yönetmeliği) atıfı yazılmadı; yalnız "yasak ve ölümcül" denildi.
2. Kablo kesiti: Victron tablosu ve ÷3 kuralı yalnız voltaj düşümüne dayanır; kısa ve kalın olmayan hatlarda ısıl akım sınırı (IEC 60364/TSE) ayrıca kontrol edilmeli. Sigortanın aküye mesafesi için sayısal kural (ABYC 7 inç) kaynak açılamadığı için yazılmadı.
3. Akü voltajları 2001 tarihli FAQ'tan; üretici değerleri farklı olabilir. Lityum (LiFePO4) için sayısal değer verilmedi.
4. Lityum hücre yangınına su: kaynaklar çelişkili (tspi.at "su etkisiz"; itfaiye yaklaşımı soğutma). Rehberde "yaklaşmayın, çevreyi suyla soğutun, yanıp bitmesini bekleyin" denildi. 2 V eşiği ve 2 haftalık test tek, kişisel bir kaynaktan.
5. Alternatör bağlantı uçları araç tipine göre değişir; adım 6 genel şema, elektrikçi kontrolü gerekli.
6. Odun kömürü: duman renginin incelip mavileşmesi göstergesi, küçük çukurda "en az bir gün" soğuma ve taze kömürün kendiliğinden tutuşması kaynakla doğrulanmadı.
7. Biyogaz: gübre:su karışım oranı ve alev geri tepmesini önleyen su kabı ayrıntısı doğrulanamadı (energypedia açılmadı). Gerçek bir alev tutucu tasarımı uzmanca belirlenmeli.
8. Mürekkep: 2:1 mazı tozu/demir sülfat oranı standart formülden türetildi; arap zamkı miktarı verilmedi.
9. Cam: el yapımı kalın camda tavlama süresi ve şişe kesme yöntemi kaynakla doğrulanmadı; 550–600 °C endüstriyel ≈580 °C değerine dayanıyor.
10. Fermantasyon: konserve için %5 asitlik kuralı ve turşu tuz oranları NCHFP sayfaları açılamadığı için yazılmadı; "ev sirkesini konserve güvenliği için kullanmayın" tutucu ifade olarak not'ta.
11. Tuz: acı suyun (bittern) insan için zehirlilik eşiği kaynakta yok; "yemeyin" tutucu öneri.
12. Su çarkı: üstten dolan çark için en az düşü kaynaklarda 2 m (Wikipedia) ile 4,5 m (Energy Education) arasında çelişkili; 2 m yazıldı.
13. Aktif kömür: kutuda ısıtma süresi ("bir saat kadar") ve kırma boyutu doğrulanmadı; mikrop gidermediği ifadesi tutucu yorum.
14. Kimyasal güvenlik: yıkama süresi kaynaklarda 15–60 dk; rehberde "en az 15–20 dk, kostikte daha uzun" yazıldı.
