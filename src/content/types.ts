// Rehber içeriğinin ortak tipleri.
// Her kategori src/content/guides/<kategori>.ts dosyasında tanımlanır ve
// CATEGORY + GUIDES dışa aktarır; dizin dosyaları bunları kendiliğinden toplar.

export interface Guide {
  /** benzersiz, küçük harf, tireli (ör. 'su-bulma') */
  id: string;
  title: string;
  /** Kategori etiketi (büyük harf), ör. 'DEPREM', 'İLK YARDIM' */
  tag: string;
  /** Tek cümlelik özet */
  summary: string;
  /** 4–10 adım; her biri tek eylem, emir kipinde, kısa */
  steps: string[];
  /**
   * Adımlara karşılık gelen çizim kimlikleri (src/art/spec). `steps` ile aynı
   * uzunlukta; null = o adımda çizim yok.
   */
  art?: (string | null)[];
  /** "Yapmayın" listesi */
  dont?: string[];
  /** true ise ekranda "Mümkünse hemen 112'yi arayın" bandı gösterilir */
  callEmergency?: boolean;
  /** Arama ve asistan bağlamı için eş anlamlılar, gündelik ifadeler */
  keywords: string[];
  /** Kaynak kuruluş adları */
  sources: string[];
  /** Bir uzman tarafından incelendi mi? */
  reviewed: boolean;
  /** Hayati tehlike içeren ilk yardım konuları */
  critical?: boolean;
  /** Ana kategorisi dışında görüneceği diğer kategoriler */
  alsoIn?: string[];
  /** Doğruluk denetiminden geçtiği tarih ve not (denetim ajanları doldurur) */
  checked?: { date: string; note?: string };
}

export interface CategoryMeta {
  id: string;
  title: string;
  /** kutunun altındaki kısa açıklama */
  hint: string;
  /** kategori çizimi (src/art/spec) */
  art: string;
  /** kutu vurgusu */
  color: string;
  /** ana ekrandaki sıra */
  order: number;
}
