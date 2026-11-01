# Gerçek harita ve nokta paketi hazırlama (OpenStreetMap)

Akıl Çantası'nın Harita sekmesi iki paket okur:

| Paket | Uzantı | İçerik |
|---|---|---|
| Harita | `.pmtiles` | Protomaps basemap şemasında vektör karolar (earth, water, landuse, roads, buildings, boundaries) |
| Noktalar | `.geojson` | Point'lerden oluşan FeatureCollection, özellikler: `name`, `type`, isteğe bağlı `note` |

`type` şu değerlerden biri olmalı: `toplanma`, `saglik`, `eczane`, `su`, `barinma`.
Tanınmayan türler ve Point olmayan geometriler uygulama tarafından sessizce atlanır.

`type` alanı **yoksa** uygulama türü ham OSM etiketlerinden çıkarır (etiketler doğrudan
`properties` içinde ya da `properties.tags` altında olabilir — ör. `osmtogeojson` çıktısı).
Bu sayede aşağıdaki Overpass sonucu dönüştürülmeden de kullanılabilir; yine de dönüştürme
betiği daha küçük dosya ve Türkçe adlar verir.

### Su noktaları (`su`)

Afette en kritik bilgi içme suyudur. Şu OSM etiketleri `su` sayılır
(kaynak: OSM wiki `Key:drinking_water`, `Tag:amenity=drinking_water`,
`Tag:natural=spring`, `Tag:amenity=water_point`, `Tag:man_made=water_tap`):

| Etiket | Anlamı | Koşul |
|---|---|---|
| `amenity=drinking_water` | çeşme / içme suyu musluğu | `drinking_water=no` değilse |
| `amenity=water_point` | büyük miktarda içme suyu alınabilen nokta (karavan, tanker) | `drinking_water=no` değilse |
| `natural=spring` | kaynak / pınar | `drinking_water=no` değilse (içilebilirliği her zaman bilinmez — not alanına yazın) |
| `man_made=water_tap` | musluk | `drinking_water=no` değilse |
| `amenity=fountain` | süs havuzu / şadırvan | yalnızca `drinking_water=yes` ise |
| `man_made=water_well` | kuyu | yalnızca `drinking_water=yes` ise |

Kaynak ve kuyu suyu kaynatılmadan ya da arıtılmadan içilmemelidir; uygulama bu noktaları
"su" olarak gösterir ama içilebilirliği garanti etmez.

Bu adımlar internet gerektirir; **paketi hazırlayan bilgisayarda** bir kez yapılır.
Uygulama paketleri kullanırken hiçbir zaman internete çıkmaz.

`testdata/` içindeki `sample_ornek.pmtiles` ve `sample_poi_ornek.geojson` dosyaları `tools/make_sample_map.py` ile üretilmiş
**sentetik** test verisidir; gerçek konum içermez, sahada kullanılmamalıdır.

---

## 1. Bölge haritası (PMTiles)

Protomaps her gün tüm dünyanın OSM tabanlı vektör karolarını tek bir PMTiles dosyası olarak
yayınlar (https://maps.protomaps.com/builds/). Tümünü indirmek gerekmez: `pmtiles` komut
satırı aracı HTTP Range ile yalnızca istenen bölgeyi çeker.

```sh
# go-pmtiles: https://github.com/protomaps/go-pmtiles/releases
# Örnek: Ankara ili kabaca (batı,güney,doğu,kuzey)
pmtiles extract https://build.protomaps.com/20261101.pmtiles ankara.pmtiles \
  --bbox=30.85,38.70,33.90,40.75 --maxzoom=15

# Bir ilçe/mahalle için daha küçük dosya:
pmtiles extract https://build.protomaps.com/20261101.pmtiles cankaya.pmtiles \
  --bbox=32.60,39.70,33.00,39.95 --maxzoom=16

pmtiles show cankaya.pmtiles   # başlık ve sınırları kontrol et
```

Notlar:
- Tarih kısmını (`20261101`) builds sayfasındaki güncel bir dosyayla değiştirin.
- Sınır yerine çokgen kullanmak için `--region=bolge.geojson` verilebilir.
- Boyut kabaca: ilçe 5–30 MB, il 50–300 MB, Türkiye tamamı (z15) birkaç GB.
  Telefonlar için `--maxzoom=14` boyutu belirgin azaltır; uygulama z18'e kadar büyütür.
- Uygulamanın stili yazı (etiket) katmanı kullanmaz, böylece font/sprite dosyası gerekmez.
- Lisans: harita verisi © OpenStreetMap katkıcıları, ODbL. Uygulama bu atfı her zaman gösterir.

## 2. Nokta paketi (GeoJSON) — Overpass ile

Aşağıdaki sorgu https://overpass-turbo.eu/ üzerinde ya da `curl` ile çalıştırılabilir.
`{{bbox}}` yerine `güney,batı,kuzey,doğu` sırasıyla sınır yazın (Overpass sırası farklıdır!).

```
[out:json][timeout:120];
(
  nwr["emergency"="assembly_point"]({{bbox}});
  nwr["amenity"="hospital"]({{bbox}});
  nwr["amenity"="clinic"]({{bbox}});
  nwr["amenity"="doctors"]({{bbox}});
  nwr["healthcare"="hospital"]({{bbox}});
  nwr["amenity"="pharmacy"]({{bbox}});
  nwr["healthcare"="pharmacy"]({{bbox}});
  nwr["amenity"="drinking_water"]["drinking_water"!="no"]({{bbox}});
  nwr["man_made"="water_tap"]["drinking_water"!="no"]({{bbox}});
  nwr["amenity"="water_point"]["drinking_water"!="no"]({{bbox}});
  nwr["natural"="spring"]["drinking_water"!="no"]({{bbox}});
  nwr["amenity"="fountain"]["drinking_water"="yes"]({{bbox}});
  nwr["man_made"="water_well"]["drinking_water"="yes"]({{bbox}});
  nwr["amenity"="shelter"]["shelter_type"!="public_transport"]({{bbox}});
  nwr["social_facility"="shelter"]({{bbox}});
  nwr["emergency"="shelter"]({{bbox}});
);
out center tags;
```

```sh
curl -s https://overpass-api.de/api/interpreter \
  --data-urlencode data@sorgu.overpassql > osm.json
```

### Akıl Çantası şemasına dönüştürme

```python
# python3 osm_to_poi.py osm.json noktalar.geojson
import json, sys

def kind(t):
    if t.get('emergency') == 'assembly_point':
        return 'toplanma'
    if t.get('amenity') == 'pharmacy' or t.get('healthcare') == 'pharmacy':
        return 'eczane'
    if t.get('amenity') in ('hospital', 'clinic', 'doctors') or t.get('healthcare') == 'hospital':
        return 'saglik'
    dw = t.get('drinking_water')
    if dw != 'no' and (t.get('amenity') in ('drinking_water', 'water_point')
                       or t.get('natural') == 'spring' or t.get('man_made') == 'water_tap'):
        return 'su'
    if dw == 'yes' and (t.get('amenity') == 'fountain' or t.get('man_made') == 'water_well'):
        return 'su'
    if t.get('amenity') == 'shelter' or t.get('social_facility') == 'shelter' or t.get('emergency') == 'shelter':
        return 'barinma'
    return None

LABEL = {'toplanma': 'Toplanma alanı', 'saglik': 'Sağlık', 'eczane': 'Eczane', 'su': 'Su noktası', 'barinma': 'Barınma'}
SU_NOTE = {'spring': 'Kaynak suyu — içmeden önce kaynatın', 'water_well': 'Kuyu'}

src = json.load(open(sys.argv[1], encoding='utf-8'))
feats = []
for el in src['elements']:
    t = el.get('tags', {})
    k = kind(t)
    lat = el.get('lat') or el.get('center', {}).get('lat')
    lon = el.get('lon') or el.get('center', {}).get('lon')
    if not k or lat is None:
        continue
    name = t.get('name:tr') or t.get('name') or LABEL[k]
    note = '; '.join(x for x in [k == 'su' and (SU_NOTE.get(t.get('natural')) or SU_NOTE.get(t.get('man_made'))),
                                 t.get('opening_hours') and 'Saatler: ' + t['opening_hours'],
                                 t.get('phone') and 'Tel: ' + t['phone'],
                                 t.get('description')] if x) or None
    props = {'name': name, 'type': k, 'osm': f"{el['type']}/{el['id']}"}
    if note:
        props['note'] = note
    feats.append({'type': 'Feature', 'id': f"{el['type']}/{el['id']}",
                  'geometry': {'type': 'Point', 'coordinates': [round(lon, 6), round(lat, 6)]},
                  'properties': props})
json.dump({'type': 'FeatureCollection', 'features': feats},
          open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)
print(len(feats), 'nokta')
```

### Resmî toplanma alanları

OSM'deki `emergency=assembly_point` kapsamı Türkiye'de eksiktir. AFAD'ın e-Devlet
"Acil Toplanma Alanı Sorgulama" hizmeti ve belediyelerin açık veri portallarındaki
listeler daha günceldir. Bu kaynaklardan gelen koordinatlar aynı şemaya
(`type: "toplanma"`) dönüştürülüp yukarıdaki dosyayla birleştirilebilir. Kaynağın kullanım
koşullarına uyun ve `note` alanına kaynağı yazın (örn. `"note": "Kaynak: X Belediyesi, 2026"`).

## 3. Uygulamaya ekleme

- Telefonda: Paylaş sekmesi → dosyadan içe aktar (`.pmtiles` ve `.geojson`).
- Masaüstü sunucusu / bilgi noktası: dosyaları sunucunun paket klasörüne koyun; `/api/packs`
  listesinde görünür ve bağlanan cihazlar okur.
- Geliştirme: `?devmap=/yol/dosya.pmtiles&devpoi=/yol/noktalar.geojson` (yalnızca aynı
  kökenden adresler kabul edilir; sunucunun HTTP Range ve HEAD desteklemesi gerekir).
