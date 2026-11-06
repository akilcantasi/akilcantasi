// "Kendine Yetmek" rehber paketinin 57 kategorisini 13 üst başlık altında toplar.
// Eşleme istemci tarafındadır: yayımlanmış paketin yeniden derlenmesi gerekmez.
// Eşlemede olmayan (ileride eklenecek ya da başka paketten gelen) kategoriler "Diğer" başlığına düşer.
// Bu modül saftır (DOM yok): testler de kullanır.

export interface KyGroup {
  id: string;
  title: string;
  /** başlık altındaki kısa açıklama */
  hint: string;
  /** kategori kimlikleri, gösterim sırasıyla */
  cats: string[];
}

export const KY_GROUPS: KyGroup[] = [
  { id: 'bitki', title: 'Yabani bitkiler', hint: 'Ot, yemiş, kök; mevsim ve yer yer toplama; zehirli benzerler', cats: ['sf-yb-yabani', 'sf-ybt-mevsim', 'sf-ybt-yer', 'sf-ybt-guvenlik'] },
  { id: 'av', title: 'Av, balık ve su ürünleri', hint: 'Olta, iz, tuzak, avı işleme; kurbağa, kerevit, böcek', cats: ['sf-yb-balik', 'sf-yb-iz', 'sf-yb-isleme', 'sf-yh-kurbaga', 'sf-yh-balik', 'sf-yh-guvenlik'] },
  { id: 'yiyecek', title: 'Yiyecek saklama ve mutfak', hint: 'Kurutma, turşu, süt, ekmek, kiler; kıtlıkta beslenme', cats: ['sf-ys-et', 'sf-ys-meyve-sebze', 'sf-ys-sut', 'sf-ys-tahil-kiler', 'sf-mb-mutfak', 'sf-mb-kitlik'] },
  { id: 'su', title: 'Su ve dezenfeksiyon', hint: 'Su bulma, depolama, arıtma; dezenfektan hazırlama', cats: ['sf-sd-su-bulma', 'sf-sd-aritma', 'sf-sd-dezenfeksiyon', 'sf-sd-dezenfektan'] },
  { id: 'saglik', title: 'Hijyen ve sağlık', hint: 'Tuvalet, temizlik, uzun dönem hasta bakımı, ilaçsız sağlık', cats: ['sf-hs-tuvalet', 'sf-hs-temizlik', 'sf-hs-bakim', 'sf-mb-saglik'] },
  { id: 'yapi', title: 'Barınak ve yapı', hint: 'Yer seçimi, toprak, ahşap ve taş yapı, çatı', cats: ['sf-yp-yer', 'sf-yp-toprak', 'sf-yp-ahsap-tas', 'sf-yp-cati'] },
  { id: 'ates', title: 'Ateş, ısınma ve pişirme', hint: 'Kibritsiz ateş, ocak, soba, fırın', cats: ['sf-ap-ates', 'sf-ap-ocak', 'sf-ap-firin'] },
  { id: 'zanaat', title: 'Giyim ve zanaat', hint: 'İp, dokuma, deri, ağaç, çömlek, metal', cats: ['sf-gz-lif', 'sf-gz-deri', 'sf-gz-agac', 'sf-gz-comlek', 'sf-gz-metal'] },
  { id: 'tarim', title: 'Tarım ve hayvancılık', hint: 'Toprak, tohum, bahçe, meyve ağacı, hayvan bakımı', cats: ['sf-th-toprak-tohum', 'sf-th-bahce-tarla', 'sf-th-meyve', 'sf-th-hayvan', 'sf-ht-hayvan', 'sf-ht-tarim'] },
  { id: 'enerji', title: 'Enerji ve kimya', hint: 'Basit makine, su ve rüzgâr gücü, elektrik, malzeme', cats: ['sf-ek-makine', 'sf-ek-su-ruzgar', 'sf-ek-elektrik', 'sf-ek-kimya'] },
  { id: 'onarim', title: 'Onarım ve teknik', hint: 'Alet onarımı, cihaz ve radyo, taşıt', cats: ['sf-ot-onarim', 'sf-ot-teknik', 'sf-gz-tasit'] },
  { id: 'yolculuk', title: 'Yolculuk ve yerleşim', hint: 'Göç, kış, haberleşme, yerleşim güvenliği, doğada uzun yaşam', cats: ['sf-yy-yolculuk', 'sf-yy-kis', 'sf-bt-haberlesme-yol', 'sf-yy-guvenlik', 'sf-bt-doga-uzun'] },
  { id: 'topluluk', title: 'Bilgi ve topluluk', hint: 'Zaman ve ölçü, topluluk düzeni, moral ve çocuklar', cats: ['sf-bt-zaman-olcu', 'sf-bt-topluluk', 'sf-yy-moral'] },
];

export const KY_OTHER: Omit<KyGroup, 'cats'> = { id: 'diger', title: 'Diğer', hint: 'Başka başlığa girmeyen kategoriler' };

const GROUP_OF = new Map<string, string>();
for (const g of KY_GROUPS) for (const c of g.cats) GROUP_OF.set(c, g.id);

/** Kategorinin üst başlığı ("diger" = eşlemede yok) */
export function kyGroupOf(catId: string): string {
  return GROUP_OF.get(catId) ?? KY_OTHER.id;
}

/**
 * Kurulu kategorileri üst başlıklara dağıtır. Boş başlıklar atlanır; başlık içindeki sıra
 * eşlemedeki sıradır, eşlemede olmayanlar "Diğer" altında geldikleri sırayla durur.
 */
export function groupKyCategories<T extends { id: string }>(cats: T[]): { group: Omit<KyGroup, 'cats'>; cats: T[] }[] {
  const byId = new Map(cats.map((c) => [c.id, c]));
  const out: { group: Omit<KyGroup, 'cats'>; cats: T[] }[] = [];
  for (const g of KY_GROUPS) {
    const list = g.cats.map((id) => byId.get(id)).filter((c): c is T => !!c);
    if (list.length) out.push({ group: { id: g.id, title: g.title, hint: g.hint }, cats: list });
  }
  const rest = cats.filter((c) => !GROUP_OF.has(c.id));
  if (rest.length) out.push({ group: KY_OTHER, cats: rest });
  return out;
}
