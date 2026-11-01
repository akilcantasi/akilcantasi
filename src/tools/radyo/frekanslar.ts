// TRT FM frekansları — il merkezleri.
// Kaynak: TRT Radyo resmi frekans sayfaları, https://radyo.trt.net.tr/frekanslar/<il>-<ilçe>
// (ör. /frekanslar/ankara-cankaya, /frekanslar/izmir-merkez, /frekanslar/istanbul-uskudar),
// erişim 2026-11-01. Değerler MHz (FM). Aynı kanal için birden çok verici varsa hepsi yazıldı.
// Yalnızca bu sayfalardan okunabilen iller listelendi; diğer iller için tarama yöntemi anlatılır.

export interface CityFreq {
  id: string;
  city: string;
  /** TRT sayfasındaki ilçe */
  district: string;
  radyo1: number[];
  haber: number[];
  trtfm: number[];
  radyo3?: number[];
  turku?: number[];
  nagme?: number[];
  kurdi?: number[];
}

export const FREQ_SOURCE = 'TRT Radyo, radyo.trt.net.tr/frekanslar (il merkezi vericileri), erişim 1 Kasım 2026';

export const CITY_FREQS: CityFreq[] = [
  { id: 'istanbul', city: 'İstanbul', district: 'Üsküdar', radyo1: [95.6], haber: [99.6], trtfm: [91.4], radyo3: [88.2], turku: [103.4], nagme: [101.6], kurdi: [107.8] },
  { id: 'ankara', city: 'Ankara', district: 'Çankaya', radyo1: [93.3], haber: [95.0], trtfm: [100.3, 88.0], radyo3: [91.2], turku: [103.6], nagme: [102.8], kurdi: [107.8] },
  { id: 'izmir', city: 'İzmir', district: 'Merkez', radyo1: [94.7], haber: [99.1], trtfm: [91.2], radyo3: [88.0], turku: [100.5], nagme: [89.8], kurdi: [94.0] },
  { id: 'bursa', city: 'Bursa', district: 'Merkez', radyo1: [87.9], haber: [102.2], trtfm: [95.1, 98.9], radyo3: [91.1], turku: [99.5, 103.5], nagme: [96.7, 94.9], kurdi: [90.2] },
  { id: 'antalya', city: 'Antalya', district: 'Merkez', radyo1: [100.6], haber: [107.0], trtfm: [107.3, 95.6], radyo3: [91.6], turku: [88.4], nagme: [92.1], kurdi: [96.9] },
  { id: 'diyarbakir', city: 'Diyarbakır', district: 'Merkez', radyo1: [93.6, 98.4], haber: [106.8], trtfm: [95.5], turku: [105.0, 107.3], nagme: [100.8], kurdi: [88.4] },
  { id: 'erzurum', city: 'Erzurum', district: 'Merkez', radyo1: [90.8], haber: [94.8], trtfm: [98.8], turku: [102.6], nagme: [96.8], kurdi: [104.8] },
  { id: 'eskisehir', city: 'Eskişehir', district: 'Merkez', radyo1: [89.0], haber: [107.2], trtfm: [96.8], radyo3: [94.4], turku: [101.3], nagme: [107.8] },
  { id: 'malatya', city: 'Malatya', district: 'Merkez', radyo1: [101.3], haber: [106.8], trtfm: [103.7], radyo3: [107.7], turku: [97.6], nagme: [105.8], kurdi: [102.4] },
  { id: 'samsun', city: 'Samsun', district: 'Merkez', radyo1: [94.8, 95.2], haber: [103.8], trtfm: [92.8, 98.4], radyo3: [93.2, 90.8], turku: [96.8, 97.5], nagme: [91.3, 106.8] },
  { id: 'sivas', city: 'Sivas', district: 'Merkez', radyo1: [93.6], haber: [91.7], trtfm: [98.3], radyo3: [90.4], turku: [100.9], nagme: [95.8] },
  { id: 'trabzon', city: 'Trabzon', district: 'Merkez', radyo1: [90.0], haber: [99.9], trtfm: [107.7], turku: [103.7], nagme: [105.7] },
  { id: 'van', city: 'Van', district: 'Merkez', radyo1: [92.8], haber: [95.8], trtfm: [89.3, 95.1], radyo3: [94.8], turku: [100.3], nagme: [93.8], kurdi: [102.3] },
];

/** FM yayın bandı (Türkiye): 87.5–108 MHz. */
export function isFmBand(mhz: number): boolean {
  return mhz >= 87.5 && mhz <= 108;
}

export function fmt(list?: number[]): string {
  return list && list.length ? list.map((f) => f.toFixed(1)).join(' / ') : '—';
}
