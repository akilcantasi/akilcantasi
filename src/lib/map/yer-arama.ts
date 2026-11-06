// Haritada yer adı araması: Türkçe harf katlama, eşleşme sınıfı ve sıralama.
// Arayüzden ve dosya okumadan bağımsızdır (testleri tests/yer-arama.test.ts).
//
// Sıralama: tam eşleşme > baştan eşleşme > kelime başı > içinde geçme > tür adı;
// eşitlikte yer türü önceliği (il > ilçe > mahalle > köy …), sonra harita merkezine uzaklık.
import { distanceM, type LatLon } from './geo';
import { POI_TYPES, type Poi, type PoiType } from './poi';
import ilVerisi from '../../../tools/hava/iller.json';

export type YerTur = 'il' | 'ilce' | 'mahalle' | 'koy' | 'mezra' | 'yer';
export type SonucTur = YerTur | PoiType;

export interface Yer extends LatLon {
  ad: string;
  tur: YerTur;
  /** Bağlam: yakındaki ilçe ya da il merkezi (aynı adlı yerleri ayırmak için) */
  ust?: string;
}

export const YER_TURLERI: Record<YerTur, { label: string; sira: number; zoom: number }> = {
  il: { label: 'İl', sira: 0, zoom: 11 },
  ilce: { label: 'İlçe', sira: 1, zoom: 13 },
  mahalle: { label: 'Mahalle', sira: 2, zoom: 15 },
  koy: { label: 'Köy', sira: 3, zoom: 14 },
  mezra: { label: 'Mezra', sira: 5, zoom: 15 },
  yer: { label: 'Yer', sira: 6, zoom: 15 },
};

/** Noktalar (afet noktaları paketi) köylerle aynı önceliktedir; toplanma alanı bir adım önde */
const POI_SIRA: Record<PoiType, number> = { toplanma: 2.5, saglik: 3.5, eczane: 4, su: 4.5, barinma: 4 };

/** Tür adıyla arama ("eczane", "hastane"…): adında geçmese de o türdeki en yakın noktalar */
const TUR_ANAHTAR: Record<PoiType, string[]> = {
  toplanma: ['toplanma alani', 'toplanma', 'afet toplanma'],
  saglik: ['saglik', 'hastane', 'saglik ocagi', 'klinik', 'aile sagligi', 'doktor'],
  eczane: ['eczane'],
  su: ['su', 'icme suyu', 'cesme', 'pinar'],
  barinma: ['barinma', 'barinak', 'siginak', 'cadir'],
};

/**
 * Türkçe duyarlı sadeleştirme: küçük harf (İ→i, I→ı), sonra ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c
 * ve diğer aksanlar (â, î, û…) atılır; harf/rakam dışı her şey tek boşluk olur.
 */
export function sadelestir(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** 0 tam, 1 baştan, 2 kelime başı, 3 içinde / tüm kelimeler, -1 yok */
export function eslesme(ad: string, q: string, kelimeler?: string[]): number {
  if (!q) return -1;
  if (ad === q) return 0;
  if (ad.startsWith(q)) return 1;
  const i = ad.indexOf(q);
  if (i > 0) return ad[i - 1] === ' ' ? 2 : 3;
  // Birden çok kelime: her biri adın bir kelimesinin başında geçiyorsa (sıra fark etmez)
  const k = kelimeler ?? q.split(' ');
  if (k.length > 1 && k.every((w) => ad.startsWith(w) || ad.includes(' ' + w))) return 3;
  return -1;
}

export interface Sonuc extends LatLon {
  id: string;
  ad: string;
  tur: SonucTur;
  /** Türün görünen adı: "İl", "Mahalle", "Toplanma alanı"… */
  etiket: string;
  ust?: string;
  /** Harita merkezine uzaklık (m), merkez bilinmiyorsa NaN */
  uzaklik: number;
  /** Bu sonuca uçulduğunda yakınlaştırma */
  zoom: number;
  /** Nokta (POI) ise kimliği: nokta kartı açılır */
  poiId?: string;
  sinif: number;
  sira: number;
}

export function turEtiketi(t: SonucTur): string {
  return t in YER_TURLERI ? YER_TURLERI[t as YerTur].label : POI_TYPES[t as PoiType].label;
}

/** Aramaya hazır dizin: sadeleştirilmiş adlar bir kez hesaplanır */
export interface AramaDizini {
  yerler: Yer[];
  adlar: string[];
  noktalar: Poi[];
  noktaAdlari: string[];
}

/** `adlar` verilirse (işçide önceden sadeleştirilmiş) yeniden hesaplanmaz */
export function aramaDizini(yerler: Yer[], noktalar: Poi[], adlar?: string[]): AramaDizini {
  return {
    yerler,
    adlar: adlar && adlar.length === yerler.length ? adlar : yerler.map((y) => sadelestir(y.ad)),
    noktalar,
    noktaAdlari: noktalar.map((p) => sadelestir(p.name)),
  };
}

/**
 * Sorguya uyan yerler ve noktalar, sıralı. `merkez` harita merkezidir (uzaklık eşitlik bozucu).
 * En çok `limit` sonuç; tür adıyla eşleşen noktalar (en yakın eczane…) en çok 10 tane eklenir.
 */
export function ara(d: AramaDizini, sorgu: string, merkez: LatLon | null, limit = 30): Sonuc[] {
  const q = sadelestir(sorgu);
  if (!q) return [];
  const kelimeler = q.split(' ');
  const out: Sonuc[] = [];
  const uz = (p: LatLon) => (merkez ? distanceM(merkez, p) : NaN);
  for (let i = 0; i < d.yerler.length; i++) {
    const s = eslesme(d.adlar[i], q, kelimeler);
    if (s < 0) continue;
    const y = d.yerler[i];
    const t = YER_TURLERI[y.tur];
    out.push({ id: 'y' + i, ad: y.ad, tur: y.tur, etiket: t.label, ust: y.ust, lat: y.lat, lon: y.lon, uzaklik: uz(y), zoom: t.zoom, sinif: s, sira: t.sira });
  }
  const eklenen = new Set<string>();
  for (let i = 0; i < d.noktalar.length; i++) {
    const s = eslesme(d.noktaAdlari[i], q, kelimeler);
    if (s < 0) continue;
    const p = d.noktalar[i];
    eklenen.add(p.id);
    out.push(noktaSonuc(p, s, uz(p)));
  }
  // Tür adı: "eczane", "hastane", "toplanma"… (en az 2 harf; "su" tam yazılmalı)
  const turler = (Object.keys(TUR_ANAHTAR) as PoiType[]).filter((t) =>
    TUR_ANAHTAR[t].some((a) => (a.length <= 2 ? a === q : q.length >= 3 && (a.startsWith(q) || q.startsWith(a)))),
  );
  if (turler.length) {
    const aday = d.noktalar
      .filter((p) => turler.includes(p.type) && !eklenen.has(p.id))
      .map((p) => noktaSonuc(p, 4, uz(p)))
      .sort((a, b) => (isNaN(a.uzaklik) ? 0 : a.uzaklik - b.uzaklik))
      .slice(0, 10);
    out.push(...aday);
  }
  out.sort(karsilastir);
  return tekillestir(out).slice(0, limit);
}

function noktaSonuc(p: Poi, sinif: number, uzaklik: number): Sonuc {
  return {
    id: 'p' + p.id,
    ad: p.name,
    tur: p.type,
    etiket: POI_TYPES[p.type].label,
    lat: p.lat,
    lon: p.lon,
    uzaklik,
    zoom: 16,
    poiId: p.id,
    sinif,
    sira: POI_SIRA[p.type],
  };
}

export function karsilastir(a: Sonuc, b: Sonuc): number {
  if (a.sinif !== b.sinif) return a.sinif - b.sinif;
  if (a.sira !== b.sira) return a.sira - b.sira;
  const da = isNaN(a.uzaklik) ? Infinity : a.uzaklik;
  const db = isNaN(b.uzaklik) ? Infinity : b.uzaklik;
  if (da !== db) return da - db;
  return a.ad.localeCompare(b.ad, 'tr');
}

/** Aynı ad + tür, birbirine 1 km'den yakın: tek sonuç (ör. il listesi ile harita aynı il merkezini verir) */
function tekillestir(list: Sonuc[]): Sonuc[] {
  const out: Sonuc[] = [];
  for (const s of list) {
    if (out.some((o) => o.tur === s.tur && o.ad === s.ad && distanceM(o, s) < 1000)) continue;
    out.push(s);
  }
  return out;
}

// ---------- Harita karolarındaki "places" öğesinden yer ----------

export interface Il {
  ad: string;
  lat: number;
  lon: number;
}
/** 81 il merkezi (kamu verisi; tools/hava/iller.json, hava paketiyle ortak) */
export const ILLER: Il[] = (ilVerisi as { iller: Il[] }).iller.map((i) => ({ ad: i.ad, lat: i.lat, lon: i.lon }));

/** İl merkezinin haritadaki adı il adından farklı olanlar (OSM'deki yerleşim adı) */
const IL_MERKEZ_ADI: Record<string, string> = { Kocaeli: 'İzmit', Sakarya: 'Adapazarı', Hatay: 'Antakya' };

/** Latin olmayan yazı (Yunan, Kiril, Arap, Gürcü, Ermeni…): Türkçe adı yoksa dizine girmez */
const LATIN_DISI = /[Ͱ-ϿЀ-ӿ԰-֏֐-׿؀-ۿႠ-ჿ]/;

/** Protomaps "places" özelliklerinden yer türü (Türkiye'de OSM place=* kullanımına göre) */
export function placeTuru(props: Record<string, unknown>): YerTur | null {
  const kind = props.kind;
  const d = props.kind_detail;
  if (kind === 'country') return null;
  if (kind === 'region') return 'il';
  if (kind === 'neighbourhood' || kind === 'macrohood') return 'mahalle';
  if (kind !== 'locality') return null;
  switch (d) {
    case 'city':
    case 'town':
      return 'ilce';
    case 'village':
      return 'koy';
    case 'hamlet':
    case 'isolated_dwelling':
    case 'farm':
      return 'mezra';
    case 'locality':
      return 'yer';
    case 'suburb':
    case 'quarter':
    case 'neighbourhood':
      return 'mahalle';
    default:
      return null;
  }
}

/** Görünen ad: önce Türkçe ad, yoksa yerel ad (Latin yazıyla ise) */
export function placeAdi(props: Record<string, unknown>): string | null {
  const tr = typeof props['name:tr'] === 'string' ? (props['name:tr'] as string).trim() : '';
  if (tr) return tr;
  const n = typeof props.name === 'string' ? props.name.trim() : '';
  if (!n || LATIN_DISI.test(n)) return null;
  return n;
}

/**
 * Ham yer listesini dizine çevirir:
 *  - il merkezleri: il adıyla (ya da merkez adıyla) eşleşen, il listesindeki noktaya 30 km'den
 *    yakın ilçe/şehir → "İl"; haritada bulunamayan iller listedeki koordinatla eklenir
 *    (`sinir` verilirse yalnız o kutudakiler);
 *  - bağlam (ust): köy/mahalle/mezra için 25 km içindeki en yakın ilçe, ilçe için 120 km içindeki il.
 */
export function yerleriTamamla(ham: Yer[], sinir?: [number, number, number, number] | null): Yer[] {
  const yerler = ham.slice();
  const iller = ILLER.filter(
    (i) => !sinir || (i.lon >= sinir[0] - 0.05 && i.lon <= sinir[2] + 0.05 && i.lat >= sinir[1] - 0.05 && i.lat <= sinir[3] + 0.05),
  );
  for (const il of iller) {
    const adlar = [sadelestir(il.ad), sadelestir(IL_MERKEZ_ADI[il.ad] ?? il.ad)];
    let en: Yer | null = null;
    let enD = 30_000;
    for (const y of yerler) {
      if (y.tur !== 'ilce' && y.tur !== 'il') continue;
      if (!adlar.includes(sadelestir(y.ad))) continue;
      const dd = distanceM(il, y);
      if (dd < enD) {
        en = y;
        enD = dd;
      }
    }
    if (en) {
      en.tur = 'il';
      // "Kocaeli" araması da İzmit'i bulsun
      if (sadelestir(en.ad) !== adlar[0]) yerler.push({ ad: il.ad, tur: 'il', lat: en.lat, lon: en.lon, ust: en.ad });
    } else yerler.push({ ad: il.ad, tur: 'il', lat: il.lat, lon: il.lon });
  }
  // Bağlam: kaba ızgarada (0,25°) en yakın ilçe/il
  const izgara = new Map<string, Yer[]>();
  const hucre = (lat: number, lon: number) => `${Math.floor(lat * 4)}:${Math.floor(lon * 4)}`;
  for (const y of yerler) {
    if (y.tur !== 'ilce' && y.tur !== 'il') continue;
    const k = hucre(y.lat, y.lon);
    (izgara.get(k) ?? izgara.set(k, []).get(k)!).push(y);
  }
  const enYakin = (y: Yer, tur: YerTur[], maxM: number, r: number): Yer | null => {
    const la = Math.floor(y.lat * 4), lo = Math.floor(y.lon * 4);
    let en: Yer | null = null;
    let enD = maxM;
    for (let a = la - r; a <= la + r; a++)
      for (let b = lo - r; b <= lo + r; b++)
        for (const c of izgara.get(`${a}:${b}`) ?? []) {
          if (c === y || !tur.includes(c.tur) || c.ad === y.ad) continue;
          const dd = distanceM(y, c);
          if (dd < enD) {
            en = c;
            enD = dd;
          }
        }
    return en;
  };
  for (const y of yerler) {
    if (y.ust || y.tur === 'il') continue;
    const u = y.tur === 'ilce' ? enYakin(y, ['il'], 120_000, 5) : enYakin(y, ['ilce', 'il'], 25_000, 1);
    if (u) y.ust = u.ad;
  }
  return yerler;
}
