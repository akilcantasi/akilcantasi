// Su ve yiyecek ihtiyacı hesabı. Saf fonksiyonlar; arayüz src/tools/hesap.
//
// Kaynaklar (Kasım 2026'da doğrulandı):
// - Sphere El Kitabı, Su temini standardı 1 (ihtiyaç tablosu): hayatta kalma
//   (içme + yemek) 2,5–3 L/gün, temel hijyen 2–6 L/gün, temel pişirme 3–6 L/gün,
//   toplam 7,5–15 L/gün; miktar iklime ve kişiye göre değişir.
// - Sphere, Gıda güvenliği: planlama için kişi başı ortalama 2.100 kcal/gün
//   (enerjinin %10–12'si protein, %17'si yağ).
// - FEMA "Food and Water in an Emergency": normal aktif bir kişi günde en az
//   2 quart (~1,9 L) içer; sıcak ortamda bu iki katına çıkabilir; çocuklar,
//   emziren anneler ve hastalar daha fazlasına ihtiyaç duyar. Toplam en az
//   1 galon (~3,8 L)/kişi/gün depolanmalı (içme + hijyen). Su 6 ayda bir yenilenir.
// - Ready.gov "Build a Kit": 1 galon/kişi/gün, birkaç gün; birkaç günlük bozulmayan gıda.
// - Alaska DEC (Ready.gov'a dayanarak): her köpek veya kedi için günde ~1 galon su.
// - AFAD: çantada en az 72 saat (3 gün) yetecek su ve dayanıklı, yüksek kalorili gıda.
//
// Temkinli seçimler: içme suyu için Sphere üst sınırı (3 L) kullanılır; sıcak
// iklimde ×1,5 (4,5 L; FEMA'nın "iki katı" 3,8 L'sinin üstünde). Hijyen için
// Sphere alt sınırı 2 L eklenir; böylece normal iklimde toplam 5 L, Ready.gov'un
// 3,8 L'sinden fazladır. Çocuklar ve yaşlılar yetişkin kadar sayılır (FEMA:
// çocuklar ve hastalar daha fazla ihtiyaç duyar). Bebek için 1 L/gün mama
// hazırlama suyu varsayılır (formül süt ~150 ml/kg/gün; 6–7 kg bebek ≈ 1 L).

export type Climate = 'normal' | 'sicak';

export interface HesapInput {
  adults: number;
  children: number;
  babies: number;
  elderly: number;
  pets: number;
  days: number;
  climate: Climate;
}

export const DEFAULT_INPUT: HesapInput = { adults: 2, children: 0, babies: 0, elderly: 0, pets: 0, days: 3, climate: 'normal' };

/** Litre / kişi / gün */
export const WATER = {
  drinkAdult: 3,
  drinkChild: 3,
  drinkElderly: 3,
  /** bebek: mama hazırlama suyu */
  drinkBaby: 1,
  /** temel hijyen (el yıkama, diş, bebek bezi değişimi temizliği) */
  hygiene: 2,
  /** evcil hayvan (köpek/kedi) başına; içme ve kap temizliği */
  pet: 3.8,
  hotFactor: 1.5,
} as const;

/** kcal / kişi / gün */
export const KCAL = {
  adult: 2100,
  child: 2100,
  elderly: 2100,
} as const;

export const SOURCES = [
  { id: 'sphere-su', label: 'Sphere El Kitabı — Su temini standardı 1', note: 'İçme 2,5–3 L, temel hijyen 2–6 L, toplam temel ihtiyaç 7,5–15 L / kişi / gün' },
  { id: 'sphere-gida', label: 'Sphere El Kitabı — Gıda güvenliği', note: 'Planlama için ortalama 2.100 kcal / kişi / gün' },
  { id: 'fema', label: 'FEMA — Food and Water in an Emergency', note: 'En az ~1,9 L içme; sıcakta iki katı; çocuk, emziren anne ve hastalar daha fazla; toplam en az 3,8 L / kişi / gün; suyu 6 ayda bir yenileyin' },
  { id: 'ready', label: 'Ready.gov — Build a Kit', note: '1 galon (3,8 L) / kişi / gün, birkaç günlük bozulmayan gıda; evcil hayvan için mama ve ek su' },
  { id: 'afad', label: 'AFAD — Afet ve acil durum çantası', note: 'Her aile üyesine yetecek su; yüksek kalorili, çabuk bozulmayan gıda; ilk 72 saat' },
] as const;

export interface Suggestion {
  id: string;
  name: string;
  /** kcal / 100 g (yaklaşık; etiket esastır) */
  kcal100: number;
  /** toplam kalorideki payı */
  share: number;
  grams: number;
  note: string;
}

// Pişirme ve ek su gerektirmeyen dayanıklı gıdalar. Enerji yoğunlukları yaklaşık
// değerlerdir (TÜRKOMP / USDA genel aralıkları); ürün etiketi esas alınmalı.
export const FOOD_MIX: Omit<Suggestion, 'grams'>[] = [
  { id: 'konserve', name: 'Hazır yemek / baklagil konservesi', kcal100: 120, share: 0.2, note: 'Isıtmadan yenebilir; anahtarsız kapaklı seçin' },
  { id: 'kraker', name: 'Kraker, galeta, bisküvi', kcal100: 430, share: 0.25, note: 'Az tuzlu seçin; tuz susatır' },
  { id: 'kuruyemis', name: 'Kuruyemiş (fındık, ceviz, badem)', kcal100: 600, share: 0.2, note: 'Tuzsuz tercih edin, susatmasın' },
  { id: 'kurumeyve', name: 'Kuru meyve (kayısı, üzüm, incir)', kcal100: 280, share: 0.2, note: 'Hızlı enerji ve lif' },
  { id: 'tahinpekmez', name: 'Tahin ve pekmez', kcal100: 450, share: 0.15, note: 'AFAD listesinde geçer; küçük kavanoz' },
];

export interface HesapResult {
  people: number;
  /** L / gün, tüm hane */
  drinkPerDay: number;
  hygienePerDay: number;
  petPerDay: number;
  totalPerDay: number;
  /** L, tüm süre */
  drinkTotal: number;
  total: number;
  /** 1,5 L şişe sayısı (yukarı yuvarlanır) */
  bottles15: number;
  /** 19 L damacana sayısı */
  damacana19: number;
  kcalPerDay: number;
  kcalTotal: number;
  food: Suggestion[];
  foodKgTotal: number;
  /** bebek için ayrıca formül mama / anne sütü gerekir */
  babyNote: boolean;
  petFoodNote: boolean;
  warnings: string[];
}

function n(x: unknown, max = 100): number {
  const v = Math.floor(Number(x));
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(v, max);
}

export function sanitizeInput(i: Partial<HesapInput>): HesapInput {
  return {
    adults: n(i.adults),
    children: n(i.children),
    babies: n(i.babies),
    elderly: n(i.elderly),
    pets: n(i.pets),
    days: Math.max(1, n(i.days ?? 3, 365)),
    climate: i.climate === 'sicak' ? 'sicak' : 'normal',
  };
}

const r1 = (x: number) => Math.round(x * 10) / 10;

/** Hanenin günlük içme suyu (L). Stok "kaç gün yeter" hesabı da bunu kullanır. */
export function drinkPerDay(inp: HesapInput): number {
  const f = inp.climate === 'sicak' ? WATER.hotFactor : 1;
  return (inp.adults * WATER.drinkAdult + inp.children * WATER.drinkChild + inp.elderly * WATER.drinkElderly) * f + inp.babies * WATER.drinkBaby;
}

/** Hanenin günlük toplam su ihtiyacı (içme + hijyen + evcil hayvan, L). */
export function totalWaterPerDay(inp: HesapInput): number {
  const people = inp.adults + inp.children + inp.elderly + inp.babies;
  const pf = inp.climate === 'sicak' ? WATER.hotFactor : 1;
  return drinkPerDay(inp) + people * WATER.hygiene + inp.pets * WATER.pet * pf;
}

export function kcalPerDay(inp: HesapInput): number {
  return inp.adults * KCAL.adult + inp.children * KCAL.child + inp.elderly * KCAL.elderly;
}

export function calculate(raw: Partial<HesapInput>): HesapResult {
  const inp = sanitizeInput(raw);
  const people = inp.adults + inp.children + inp.elderly + inp.babies;
  const pf = inp.climate === 'sicak' ? WATER.hotFactor : 1;
  const drink = drinkPerDay(inp);
  const hygiene = people * WATER.hygiene;
  const pet = inp.pets * WATER.pet * pf;
  const totalDay = drink + hygiene + pet;
  const total = totalDay * inp.days;
  const kDay = kcalPerDay(inp);
  const kTotal = kDay * inp.days;
  const food = FOOD_MIX.map((f) => ({ ...f, grams: kTotal > 0 ? Math.ceil((kTotal * f.share * 100) / f.kcal100 / 50) * 50 : 0 }));
  const warnings: string[] = [];
  if (people === 0 && inp.pets === 0) warnings.push('En az bir kişi girin.');
  if (inp.days > 14) warnings.push('14 günü aşan stoklar için suyu 6 ayda bir yenilemeyi ve gıdaları sırayla tüketip yerine koymayı unutmayın.');
  return {
    people,
    drinkPerDay: r1(drink),
    hygienePerDay: r1(hygiene),
    petPerDay: r1(pet),
    totalPerDay: r1(totalDay),
    drinkTotal: r1(drink * inp.days),
    total: r1(total),
    bottles15: Math.ceil(total / 1.5 - 1e-9),
    damacana19: Math.ceil(total / 19 - 1e-9),
    kcalPerDay: kDay,
    kcalTotal: kTotal,
    food,
    foodKgTotal: r1(food.reduce((s, f) => s + f.grams, 0) / 1000),
    babyNote: inp.babies > 0,
    petFoodNote: inp.pets > 0,
    warnings,
  };
}

/** Sayıları Türkçe biçimde yazar: 4,5 · 12.600 */
export function fmt(x: number, digits = 1): string {
  return x.toLocaleString('tr-TR', { maximumFractionDigits: digits });
}
