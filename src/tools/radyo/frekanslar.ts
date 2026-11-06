// TRT FM frekansları — 81 il.
// Kaynak: TRT Radyo resmi frekans sayfaları, https://radyo.trt.net.tr/frekanslar/<il>-<ilçe>
// (ör. /frekanslar/ankara-cankaya, /frekanslar/izmir-merkez, /frekanslar/k-maras-merkez).
// İlk 13 il: erişim 2026-11-01. Kalan 68 il: erişim 2026-11-07 (her il sayfası tek tek okundu;
// Van sayfası yeniden okunup eski kayıtla karşılaştırıldı, aynı çıktı).
// Değerler MHz (FM). Aynı kanal için birden çok verici varsa hepsi yazıldı.
//
// Kurallar:
// - Hiçbir frekans tahmin edilmedi; yalnız TRT sayfasında yazanlar var.
// - TRT sayfasında il merkezi kaydı olmayan illerde, varsa merkeze komşu/merkez ilçe vericisi
//   kullanıldı ve `note` ile belirtildi (Adana/Yüreğir, Gaziantep/Şehitkamil, Konya/Meram merkez ilçedir).
// - Hiç kaydı bulunamayan iller (Bayburt, Kayseri, Kilis, Kırklareli, Tunceli, Yalova) boş dizilerle
//   listede durur; arayüz "doğrulanmadı, tarama yapın" der.
// - TRT sayfasında Radyo 1 ya da Radyo Haber yoksa o dizi boştur (ör. Balıkesir, Giresun, Sakarya).

export interface CityFreq {
  id: string;
  city: string;
  /** TRT sayfasındaki ilçe ('' = kayıt bulunamadı) */
  district: string;
  radyo1: number[];
  haber: number[];
  trtfm: number[];
  radyo3?: number[];
  turku?: number[];
  nagme?: number[];
  kurdi?: number[];
  /** Kullanıcıya gösterilecek kısa not (komşu ilçe vericisi, eksik kayıt, çelişki) */
  note?: string;
}

export const FREQ_SOURCE = 'TRT Radyo, radyo.trt.net.tr/frekanslar (il merkezi vericileri), erişim 1 ve 7 Kasım 2026';

const KOMSU = (ilce: string) => `TRT sayfasında il merkezi kaydı yok; ${ilce} vericisi gösteriliyor. Merkezde çekmezse tarama yapın.`;
const KAYIT_YOK = 'Bu il için TRT sayfasında doğrulanmış frekans bulunamadı; frekans yerel vericiye göre değişir. Tarama yapın.';

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

  // --- 2026-11-07'de eklenen iller (radyo.trt.net.tr/frekanslar/<slug>) ---
  // adana-yuregir
  { id: 'adana', city: 'Adana', district: 'Yüreğir', radyo1: [105.1], haber: [102.4], trtfm: [92.5], radyo3: [89.2], turku: [99.7], nagme: [96.7] },
  // adiyaman-kahta (merkez sayfası yok)
  { id: 'adiyaman', city: 'Adıyaman', district: 'Kâhta', radyo1: [88.8], haber: [], trtfm: [94.4], turku: [90.8], nagme: [103.3], kurdi: [107.9, 104.8], note: KOMSU('komşu Kâhta ilçesi') },
  // afyon-merkez
  { id: 'afyonkarahisar', city: 'Afyonkarahisar', district: 'Merkez', radyo1: [104.0], haber: [92.7], trtfm: [89.5], turku: [92.0], nagme: [94.0] },
  // agri-tutak (merkez sayfası yok)
  { id: 'agri', city: 'Ağrı', district: 'Tutak', radyo1: [89.5], haber: [], trtfm: [92.9], turku: [95.9], nagme: [91.1], kurdi: [98.2], note: KOMSU('komşu Tutak ilçesi') },
  // aksaray-merkez
  { id: 'aksaray', city: 'Aksaray', district: 'Merkez', radyo1: [88.5], haber: [102.0], trtfm: [91.5], turku: [100.5], nagme: [93.9] },
  // amasya-merkez
  { id: 'amasya', city: 'Amasya', district: 'Merkez', radyo1: [94.7, 97.3], haber: [107.6], trtfm: [96.7, 93.9], radyo3: [99.6], turku: [107.3, 101.9], nagme: [98.9, 104.2] },
  // ardahan-merkez — TRT sayfasında Radyo Haber ve Kurdî ikisi de 99.3 yazıyor (sayfadaki çelişki aynen aktarıldı)
  { id: 'ardahan', city: 'Ardahan', district: 'Merkez', radyo1: [90.4], haber: [99.3], trtfm: [94.8], radyo3: [99.8], turku: [104.7], nagme: [101.7], kurdi: [99.3], note: 'TRT sayfasında Radyo Haber ve TRT Kurdî aynı frekansta (99.3) yazıyor; hangisinin yayınlandığını dinleyerek anlayın.' },
  // artvin-merkez
  { id: 'artvin', city: 'Artvin', district: 'Merkez', radyo1: [94.4], haber: [90.0], trtfm: [95.4, 98.4], radyo3: [88.4], turku: [100.9], nagme: [91.9] },
  // aydin-merkez
  { id: 'aydin', city: 'Aydın', district: 'Merkez', radyo1: [98.5], haber: [92.9], trtfm: [91.7], radyo3: [97.6], turku: [95.0], nagme: [106.3] },
  // balikesir-merkez — sayfada yalnız TRT FM var
  { id: 'balikesir', city: 'Balıkesir', district: 'Merkez', radyo1: [], haber: [], trtfm: [96.0], note: 'TRT sayfasında il merkezi için yalnız TRT FM kayıtlı. Radyo 1 ve Radyo Haber için tarama yapın.' },
  // bartin-merkez
  { id: 'bartin', city: 'Bartın', district: 'Merkez', radyo1: [89.1], haber: [], trtfm: [91.1, 97.5], turku: [95.1], nagme: [97.0] },
  // batman-besiri (merkez sayfası yok)
  { id: 'batman', city: 'Batman', district: 'Beşiri', radyo1: [94.3], haber: [99.3], trtfm: [96.3], turku: [102.3], nagme: [102.5], kurdi: [89.5], note: KOMSU('komşu Beşiri ilçesi') },
  { id: 'bayburt', city: 'Bayburt', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  // bilecik-merkez
  { id: 'bilecik', city: 'Bilecik', district: 'Merkez', radyo1: [97.1], haber: [], trtfm: [99.1], turku: [101.1] },
  // bingol-merkez
  { id: 'bingol', city: 'Bingöl', district: 'Merkez', radyo1: [89.3], haber: [95.6], trtfm: [92.4], turku: [99.6], nagme: [97.6], kurdi: [88.5] },
  // bitlis-merkez
  { id: 'bitlis', city: 'Bitlis', district: 'Merkez', radyo1: [98.0], haber: [88.5], trtfm: [94.2], turku: [100.0], nagme: [92.6], kurdi: [90.6] },
  // bolu-merkez
  { id: 'bolu', city: 'Bolu', district: 'Merkez', radyo1: [89.6], haber: [88.6], trtfm: [92.6, 102.3], radyo3: [94.8], turku: [98.9], nagme: [87.7] },
  // burdur-merkez — sayfada yalnız TRT FM var
  { id: 'burdur', city: 'Burdur', district: 'Merkez', radyo1: [], haber: [], trtfm: [91.1], note: 'TRT sayfasında il merkezi için yalnız TRT FM kayıtlı. Radyo 1 ve Radyo Haber için tarama yapın.' },
  // canakkale-merkez
  { id: 'canakkale', city: 'Çanakkale', district: 'Merkez', radyo1: [94.3], haber: [], trtfm: [98.9], turku: [100.3], nagme: [106.3] },
  // cankiri-merkez
  { id: 'cankiri', city: 'Çankırı', district: 'Merkez', radyo1: [98.1], haber: [107.7], trtfm: [100.5], turku: [106.3], nagme: [103.0] },
  // corum-merkez
  { id: 'corum', city: 'Çorum', district: 'Merkez', radyo1: [105.7], haber: [100.2], trtfm: [103.7], turku: [98.2], nagme: [101.2] },
  // denizli-merkez
  { id: 'denizli', city: 'Denizli', district: 'Merkez', radyo1: [95.2], haber: [107.9], trtfm: [93.2], radyo3: [90.0], turku: [101.5], nagme: [97.8] },
  // duzce-merkez
  { id: 'duzce', city: 'Düzce', district: 'Merkez', radyo1: [88.3], haber: [105.3], trtfm: [98.3], turku: [91.3], nagme: [101.0] },
  // edirne-merkez
  { id: 'edirne', city: 'Edirne', district: 'Merkez', radyo1: [105.8], haber: [], trtfm: [99.4], turku: [95.3], nagme: [103.7] },
  // elazig-merkez
  { id: 'elazig', city: 'Elazığ', district: 'Merkez', radyo1: [100.7], haber: [98.0], trtfm: [105.7], turku: [107.5], nagme: [102.7], kurdi: [98.8] },
  // erzincan-merkez
  { id: 'erzincan', city: 'Erzincan', district: 'Merkez', radyo1: [88.0], haber: [96.7], trtfm: [93.2], turku: [91.2], nagme: [94.7] },
  // gaziantep-sehitkamil
  { id: 'gaziantep', city: 'Gaziantep', district: 'Şehitkamil', radyo1: [92.0], haber: [100.7], trtfm: [97.6, 87.7], radyo3: [95.2], turku: [101.9], nagme: [102.2], kurdi: [88.6] },
  // giresun-merkez — sayfada yalnız TRT FM var
  { id: 'giresun', city: 'Giresun', district: 'Merkez', radyo1: [], haber: [], trtfm: [88.0], note: 'TRT sayfasında il merkezi için yalnız TRT FM kayıtlı. Radyo 1 ve Radyo Haber için tarama yapın.' },
  // gumushane-merkez
  { id: 'gumushane', city: 'Gümüşhane', district: 'Merkez', radyo1: [98.0], haber: [], trtfm: [88.8, 95.1, 96.0, 97.0], turku: [100.2], nagme: [90.0] },
  // hakkari-merkez
  { id: 'hakkari', city: 'Hakkâri', district: 'Merkez', radyo1: [90.3, 99.4], haber: [102.3], trtfm: [97.0, 88.0], nagme: [94.3], kurdi: [92.3] },
  // hatay-merkez (Radyo Haber merkezde yok; hatay-iskenderun sayfasında 93.0)
  { id: 'hatay', city: 'Hatay', district: 'Merkez', radyo1: [89.6], haber: [], trtfm: [91.6], turku: [97.6], nagme: [99.6], note: 'Radyo Haber merkez kaydında yok; TRT sayfasına göre İskenderun vericisinde 93.0.' },
  // igdir-merkez
  { id: 'igdir', city: 'Iğdır', district: 'Merkez', radyo1: [102.2], haber: [], trtfm: [98.7], turku: [92.4], nagme: [89.0], kurdi: [94.5] },
  // isparta-merkez
  { id: 'isparta', city: 'Isparta', district: 'Merkez', radyo1: [95.1], haber: [95.6], trtfm: [97.3], turku: [105.5], nagme: [90.4] },
  // k-maras-merkez
  { id: 'kahramanmaras', city: 'Kahramanmaraş', district: 'Merkez', radyo1: [99.8], haber: [107.6], trtfm: [88.2, 105.8], turku: [87.8], nagme: [107.9] },
  // karabuk-merkez
  { id: 'karabuk', city: 'Karabük', district: 'Merkez', radyo1: [100.0], haber: [96.0], trtfm: [94.0], turku: [90.8], nagme: [97.8] },
  // karaman-merkez
  { id: 'karaman', city: 'Karaman', district: 'Merkez', radyo1: [96.4], haber: [102.3], trtfm: [98.6], turku: [90.8], nagme: [106.5] },
  // kars-merkez
  { id: 'kars', city: 'Kars', district: 'Merkez', radyo1: [100.8], haber: [92.7], trtfm: [89.5], turku: [103.3], nagme: [91.3], kurdi: [99.7] },
  // kastamonu-merkez
  { id: 'kastamonu', city: 'Kastamonu', district: 'Merkez', radyo1: [104.0], haber: [88.2], trtfm: [91.5], turku: [97.9], nagme: [101.9] },
  // Kayseri: TRT sayfasında yalnız uzak ilçeler var (Develi, Yahyalı…), merkez ilçe kaydı yok
  { id: 'kayseri', city: 'Kayseri', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  { id: 'kilis', city: 'Kilis', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  // kirikkale-merkez
  { id: 'kirikkale', city: 'Kırıkkale', district: 'Merkez', radyo1: [105.9], haber: [93.4], trtfm: [107.7, 89.0], radyo3: [97.0], turku: [101.2], nagme: [93.7] },
  { id: 'kirklareli', city: 'Kırklareli', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  // kirsehir-merkez
  { id: 'kirsehir', city: 'Kırşehir', district: 'Merkez', radyo1: [97.6], haber: [100.8], trtfm: [92.0], turku: [88.8], nagme: [102.5] },
  // kocaeli-merkez
  { id: 'kocaeli', city: 'Kocaeli', district: 'Merkez', radyo1: [90.5], haber: [], trtfm: [96.1], radyo3: [105.9], turku: [100.5], kurdi: [97.2] },
  // konya-meram
  { id: 'konya', city: 'Konya', district: 'Meram', radyo1: [103.2], haber: [88.8], trtfm: [90.5], turku: [107.4], nagme: [92.9] },
  // kutahya-merkez
  { id: 'kutahya', city: 'Kütahya', district: 'Merkez', radyo1: [90.2], haber: [92.4], trtfm: [95.4], radyo3: [92.1], turku: [88.1], nagme: [101.5] },
  // manisa-merkez
  { id: 'manisa', city: 'Manisa', district: 'Merkez', radyo1: [91.1], haber: [107.5], trtfm: [93.1], radyo3: [98.9], turku: [93.9], nagme: [103.7] },
  // mardin-merkez
  { id: 'mardin', city: 'Mardin', district: 'Merkez', radyo1: [107.0, 91.4], haber: [101.5], trtfm: [104.5, 96.1], turku: [92.8, 98.6], nagme: [94.7, 105.3], kurdi: [94.4] },
  // mersin-merkez
  { id: 'mersin', city: 'Mersin', district: 'Merkez', radyo1: [93.1], haber: [104.3], trtfm: [90.0], radyo3: [95.8], turku: [92.0, 99.7], nagme: [102.1], kurdi: [94.6] },
  // mugla-merkez
  { id: 'mugla', city: 'Muğla', district: 'Merkez', radyo1: [105.3], haber: [], trtfm: [92.9], radyo3: [106.5], turku: [98.3], nagme: [94.9] },
  // mus-merkez
  { id: 'mus', city: 'Muş', district: 'Merkez', radyo1: [90.9], haber: [95.4], trtfm: [98.7], turku: [102.7], nagme: [105.9], kurdi: [105.0] },
  // nevsehir-merkez
  { id: 'nevsehir', city: 'Nevşehir', district: 'Merkez', radyo1: [101.1], haber: [100.0], trtfm: [102.7], turku: [107.1], nagme: [104.4] },
  // nigde-merkez
  { id: 'nigde', city: 'Niğde', district: 'Merkez', radyo1: [90.0], haber: [89.5], trtfm: [95.6], turku: [93.2], nagme: [105.7] },
  // ordu-merkez
  { id: 'ordu', city: 'Ordu', district: 'Merkez', radyo1: [90.4], haber: [107.9], trtfm: [94.3], turku: [98.3], nagme: [96.0] },
  // osmaniye-merkez
  { id: 'osmaniye', city: 'Osmaniye', district: 'Merkez', radyo1: [107.7], haber: [102.7], trtfm: [91.0], turku: [103.7], nagme: [105.7] },
  // rize-merkez
  { id: 'rize', city: 'Rize', district: 'Merkez', radyo1: [103.0], haber: [98.7], trtfm: [107.1], turku: [101.1], nagme: [104.9] },
  // sakarya-merkez — sayfada yalnız TRT Nağme var
  { id: 'sakarya', city: 'Sakarya', district: 'Merkez', radyo1: [], haber: [], trtfm: [], nagme: [106.0], note: 'TRT sayfasında il merkezi için yalnız TRT Nağme kayıtlı. Kocaeli ve Düzce vericileri de denenebilir; tarama yapın.' },
  // siirt-aydinlar (merkez sayfası yok)
  { id: 'siirt', city: 'Siirt', district: 'Aydınlar', radyo1: [99.6], haber: [107.6], trtfm: [105.6], turku: [101.6], kurdi: [103.6], note: KOMSU('komşu Aydınlar ilçesi') },
  // sinop-merkez
  { id: 'sinop', city: 'Sinop', district: 'Merkez', radyo1: [106.5], haber: [], trtfm: [92.4], turku: [96.5], nagme: [90.4] },
  // sirnak-cizre (merkez sayfası yok)
  { id: 'sirnak', city: 'Şırnak', district: 'Cizre', radyo1: [101.9], haber: [91.9], trtfm: [97.7], turku: [103.8], kurdi: [94.5], note: KOMSU('Cizre ilçesi') },
  // sanliurfa-merkez
  { id: 'sanliurfa', city: 'Şanlıurfa', district: 'Merkez', radyo1: [98.1], haber: [95.7], trtfm: [102.5], turku: [104.7], nagme: [107.5], kurdi: [91.0] },
  // tekirdag-merkez
  { id: 'tekirdag', city: 'Tekirdağ', district: 'Merkez', radyo1: [99.6], haber: [], trtfm: [92.2], turku: [97.0], nagme: [94.2] },
  // tokat-merkez
  { id: 'tokat', city: 'Tokat', district: 'Merkez', radyo1: [94.4], haber: [104.6], trtfm: [96.8, 91.0], turku: [89.0], nagme: [103.3] },
  // Tunceli: TRT sayfasında yalnız uzak ilçeler (Ovacık, Pülümür, Mazgirt), merkez kaydı yok
  { id: 'tunceli', city: 'Tunceli', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  // usak-merkez
  { id: 'usak', city: 'Uşak', district: 'Merkez', radyo1: [105.5], haber: [], trtfm: [101.9, 103.3], turku: [98.4], nagme: [95.8] },
  { id: 'yalova', city: 'Yalova', district: '', radyo1: [], haber: [], trtfm: [], note: KAYIT_YOK },
  // yozgat-merkez
  { id: 'yozgat', city: 'Yozgat', district: 'Merkez', radyo1: [98.0], haber: [107.8], trtfm: [96.0], turku: [104.0], nagme: [89.8] },
  // zonguldak-merkez
  { id: 'zonguldak', city: 'Zonguldak', district: 'Merkez', radyo1: [88.5, 88.8], haber: [], trtfm: [97.2, 98.0], radyo3: [99.2], turku: [93.4, 103.2], nagme: [87.8, 93.0] },
];

/** İl listesi, Türkçe alfabeye göre (seçici için). */
export const CITY_FREQS_SORTED: CityFreq[] = [...CITY_FREQS].sort((a, b) => a.city.localeCompare(b.city, 'tr'));

/** Bu il için TRT sayfasında hiç kayıt yok mu? */
export function isUnverified(c: CityFreq): boolean {
  return !c.district && [c.radyo1, c.haber, c.trtfm, c.radyo3, c.turku, c.nagme, c.kurdi].every((l) => !l || l.length === 0);
}

/** FM yayın bandı (Türkiye): 87.5–108 MHz. */
export function isFmBand(mhz: number): boolean {
  return mhz >= 87.5 && mhz <= 108;
}

export function fmt(list?: number[]): string {
  return list && list.length ? list.map((f) => f.toFixed(1)).join(' / ') : '—';
}
