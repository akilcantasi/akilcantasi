// Afet ve acil durum çantası varsayılan listesi.
//
// Kaynaklar (Kasım 2026'da doğrulandı):
// - AFAD "Afet ve Acil Durum Çantası Nasıl Hazırlanmalı?" (afad.gov.tr; AFAD listesini
//   aktaran yayınlar üzerinden okundu): dayanıklı yüksek kalorili gıda (konserve, kuru
//   meyve, tahin-pekmez, meyve suyu), her aile üyesine yetecek içme suyu, ilk yardım
//   çantası, belge fotokopileri (kimlik, tapu, sigorta, ruhsat, DASK poliçesi, diploma,
//   pasaport, banka cüzdanı, evcil hayvan sağlık karnesi), iç çamaşırı, çorap,
//   yağmurluk, iklime uygun giysi, sabun ve dezenfektan, diş fırçası ve macunu, ıslak
//   mendil, tuvalet kâğıdı, hijyenik ped, uyku tulumu veya battaniye, çakı, düdük,
//   küçük makas, kâğıt kalem, pilli radyo, el feneri ve yedek piller. Çanta evde, iş
//   yerinde ve okulda hazır ve ulaşılabilir olmalı; yiyecek-içecek düzenli kontrol edilmeli.
// - Türk Kızılay "Afette İlk 72 Saat — Aile" (afetyonetimi.kizilay.org.tr; sayfa bu
//   oturumda otomatik okunamadı, ilk 72 saat yaklaşımı esas alındı).
// - Ready.gov "Build a Kit": toz maskesi, naylon örtü ve bant, çöp torbası, anahtar /
//   pense (vana kapatmak için), elle açılan konserve açacağı, yerel harita, telefon
//   şarj cihazı ve yedek batarya, reçeteli ilaçlar, gözlük, bebek maması / bezi,
//   evcil hayvan maması ve suyu, nakit, kişi başı uyku tulumu, sağlam ayakkabı,
//   su geçirmez kapta kibrit, çocuklar için oyun.

export type GroupId = 'su-gida' | 'saglik' | 'isik' | 'giyim' | 'belgeler' | 'hijyen' | 'aletler' | 'bebek' | 'yasli' | 'evcil';
export type ProfileId = 'ev' | 'arac' | 'is';
export type OptionId = 'bebek' | 'yasli' | 'evcil';

export const GROUPS: { id: GroupId; title: string; option?: OptionId }[] = [
  { id: 'su-gida', title: 'Su ve gıda' },
  { id: 'saglik', title: 'Sağlık' },
  { id: 'isik', title: 'Işık ve iletişim' },
  { id: 'giyim', title: 'Giyim ve barınma' },
  { id: 'belgeler', title: 'Belgeler ve para' },
  { id: 'hijyen', title: 'Hijyen' },
  { id: 'aletler', title: 'Aletler' },
  { id: 'bebek', title: 'Bebek', option: 'bebek' },
  { id: 'yasli', title: 'Yaşlı ve kronik hasta', option: 'yasli' },
  { id: 'evcil', title: 'Evcil hayvan', option: 'evcil' },
];

export const PROFILES: { id: ProfileId; title: string; hint: string }[] = [
  { id: 'ev', title: 'Ev çantası', hint: 'Kapıya yakın, kolay ulaşılır bir yerde; ilk 72 saat için' },
  { id: 'arac', title: 'Araç çantası', hint: 'Bagajda; yolda kalma ve evden uzakta ilk saatler için' },
  { id: 'is', title: 'İş çantası', hint: 'Masanın altında; işten eve yürüyerek dönüş için hafif' },
];

export interface KitItem {
  id: string;
  group: GroupId;
  name: string;
  /** kısa açıklama */
  note?: string;
  /** hangi profillerde; boşsa tüm profiller */
  profiles?: ProfileId[];
  /** son kullanma tarihi takibi anlamlı mı */
  perishable?: boolean;
  /** kaynak etiketi */
  src?: 'AFAD' | 'Ready.gov' | 'Kızılay';
}

const ALL: ProfileId[] = ['ev', 'arac', 'is'];
const EV: ProfileId[] = ['ev'];
const EV_ARAC: ProfileId[] = ['ev', 'arac'];

export const DEFAULT_ITEMS: KitItem[] = [
  // Su ve gıda
  { id: 'su', group: 'su-gida', name: 'İçme suyu', note: 'Kişi başı en az 3 L/gün, 3 gün — Su ve yiyecek hesabına bakın', perishable: true, src: 'AFAD' },
  { id: 'konserve', group: 'su-gida', name: 'Konserve gıda', note: 'Anahtarsız kapaklı, ısıtmadan yenebilen', profiles: EV_ARAC, perishable: true, src: 'AFAD' },
  { id: 'kurumeyve', group: 'su-gida', name: 'Kuru meyve ve kuruyemiş', perishable: true, src: 'AFAD' },
  { id: 'tahinpekmez', group: 'su-gida', name: 'Tahin ve pekmez', note: 'Küçük, kırılmaz kap', profiles: EV, perishable: true, src: 'AFAD' },
  { id: 'kraker', group: 'su-gida', name: 'Kraker, galeta veya enerji barı', perishable: true },
  { id: 'meyvesuyu', group: 'su-gida', name: 'Kutu meyve suyu', profiles: EV_ARAC, perishable: true, src: 'AFAD' },
  { id: 'acacak', group: 'su-gida', name: 'Elle açılan konserve açacağı', profiles: EV_ARAC, src: 'Ready.gov' },
  { id: 'tabak', group: 'su-gida', name: 'Karton bardak, tabak, çatal-kaşık', profiles: EV, src: 'Ready.gov' },
  // Sağlık
  { id: 'ilkyardim', group: 'saglik', name: 'İlk yardım çantası', note: 'Sargı bezi, flaster, yara bandı, antiseptik', perishable: true, src: 'AFAD' },
  { id: 'ilac', group: 'saglik', name: 'Düzenli kullanılan ilaçlar', note: 'En az 3 günlük; reçete fotokopisiyle', perishable: true, src: 'Ready.gov' },
  { id: 'agri', group: 'saglik', name: 'Ağrı kesici, ishal ve mide ilacı', perishable: true, src: 'Ready.gov' },
  { id: 'maske', group: 'saglik', name: 'Toz maskesi', note: 'Enkaz tozuna karşı; FFP2 tercih edin', src: 'Ready.gov' },
  { id: 'gozluk', group: 'saglik', name: 'Yedek gözlük / lens solüsyonu', src: 'Ready.gov' },
  // Işık ve iletişim
  { id: 'fener', group: 'isik', name: 'El feneri', src: 'AFAD' },
  { id: 'pil', group: 'isik', name: 'Yedek piller', note: 'Uzun ömürlü (alkalin/lityum)', perishable: true, src: 'AFAD' },
  { id: 'radyo', group: 'isik', name: 'Pilli veya dinamolu radyo', src: 'AFAD' },
  { id: 'duduk', group: 'isik', name: 'Düdük', note: 'Enkaz altında sesinizi duyurmak için', src: 'AFAD' },
  { id: 'powerbank', group: 'isik', name: 'Dolu powerbank ve şarj kablosu', note: '3 ayda bir şarj edin', src: 'Ready.gov' },
  { id: 'kisiler', group: 'isik', name: 'Kâğıda yazılı acil iletişim listesi', note: 'Aile, toplanma alanı, il dışı bir yakın' },
  { id: 'kagit', group: 'isik', name: 'Kâğıt ve kalem', src: 'AFAD' },
  { id: 'harita', group: 'isik', name: 'Bölgenin kâğıt haritası', profiles: EV_ARAC, src: 'Ready.gov' },
  // Giyim
  { id: 'camasir', group: 'giyim', name: 'İç çamaşırı ve çorap', src: 'AFAD' },
  { id: 'yagmurluk', group: 'giyim', name: 'Yağmurluk', src: 'AFAD' },
  { id: 'giysi', group: 'giyim', name: 'İklime uygun giysi', note: 'Kışın bere, eldiven, polar', src: 'AFAD' },
  { id: 'ayakkabi', group: 'giyim', name: 'Sağlam, kapalı ayakkabı', src: 'Ready.gov' },
  { id: 'battaniye', group: 'giyim', name: 'Uyku tulumu veya battaniye', note: 'Kişi başı bir tane; termal battaniye hafif seçenektir', src: 'AFAD' },
  // Belgeler
  { id: 'kimlik', group: 'belgeler', name: 'Kimlik ve ehliyet fotokopisi', src: 'AFAD' },
  { id: 'tapu', group: 'belgeler', name: 'Tapu, sigorta, ruhsat fotokopileri', profiles: EV, src: 'AFAD' },
  { id: 'dask', group: 'belgeler', name: 'Zorunlu deprem sigortası (DASK) poliçesi', profiles: EV, src: 'AFAD' },
  { id: 'diploma', group: 'belgeler', name: 'Diploma, pasaport, banka bilgileri', profiles: EV, src: 'AFAD' },
  { id: 'nakit', group: 'belgeler', name: 'Bir miktar nakit para', note: 'Bozuk para dahil; kartlar çalışmayabilir', src: 'Ready.gov' },
  { id: 'sugecirmez', group: 'belgeler', name: 'Belgeler için su geçirmez poşet' },
  // Hijyen
  { id: 'sabun', group: 'hijyen', name: 'Sabun ve dezenfektan', src: 'AFAD' },
  { id: 'dis', group: 'hijyen', name: 'Diş fırçası ve macunu', src: 'AFAD' },
  { id: 'mendil', group: 'hijyen', name: 'Islak mendil', perishable: true, src: 'AFAD' },
  { id: 'tuvalet', group: 'hijyen', name: 'Tuvalet kâğıdı', src: 'AFAD' },
  { id: 'ped', group: 'hijyen', name: 'Hijyenik ped', src: 'AFAD' },
  { id: 'cop', group: 'hijyen', name: 'Çöp poşeti ve kelepçe', src: 'Ready.gov' },
  // Aletler
  { id: 'caki', group: 'aletler', name: 'Çakı veya çok amaçlı alet', src: 'AFAD' },
  { id: 'makas', group: 'aletler', name: 'Küçük makas', src: 'AFAD' },
  { id: 'pense', group: 'aletler', name: 'Pense veya İngiliz anahtarı', note: 'Doğalgaz ve su vanasını kapatmak için', profiles: EV_ARAC, src: 'Ready.gov' },
  { id: 'bant', group: 'aletler', name: 'Koli bandı ve naylon örtü', profiles: EV_ARAC, src: 'Ready.gov' },
  { id: 'kibrit', group: 'aletler', name: 'Su geçirmez kapta kibrit veya çakmak', src: 'Ready.gov' },
  { id: 'eldiven', group: 'aletler', name: 'Kalın iş eldiveni', note: 'Cam ve moloz için' },
  { id: 'sondurucu', group: 'aletler', name: 'Küçük yangın söndürücü', note: 'Basınç göstergesini kontrol edin', profiles: EV_ARAC, perishable: true, src: 'Ready.gov' },
  // Araç
  { id: 'reflektor', group: 'aletler', name: 'Reflektör ve yelek', profiles: ['arac'] },
  { id: 'halat', group: 'aletler', name: 'Çekme halatı ve akü takviye kablosu', profiles: ['arac'] },
  { id: 'kurek', group: 'aletler', name: 'Katlanır kürek', note: 'Kış ve kar için', profiles: ['arac'] },
  // Bebek
  { id: 'mama', group: 'bebek', name: 'Bebek maması ve biberon', note: 'Mama için ayrıca temiz su', perishable: true, src: 'Ready.gov' },
  { id: 'bez', group: 'bebek', name: 'Bebek bezi ve pişik kremi', src: 'Ready.gov' },
  { id: 'bebekgiysi', group: 'bebek', name: 'Yedek bebek giysisi ve battaniye' },
  { id: 'oyuncak', group: 'bebek', name: 'Küçük oyuncak, kitap', note: 'Çocukları sakinleştirmek için', src: 'Ready.gov' },
  // Yaşlı
  { id: 'kronik', group: 'yasli', name: 'Kronik hastalık ilaçları ve listesi', note: 'İlaç adları ve dozları yazılı', perishable: true },
  { id: 'cihaz', group: 'yasli', name: 'İşitme cihazı pili, yedek gözlük', perishable: true },
  { id: 'baston', group: 'yasli', name: 'Baston, yürüteç veya gerekli tıbbi malzeme' },
  { id: 'hasta-bez', group: 'yasli', name: 'Gerekirse hasta bezi' },
  // Evcil hayvan
  { id: 'evcil-mama', group: 'evcil', name: 'Evcil hayvan maması ve suyu', note: 'En az 3 günlük', perishable: true, src: 'Ready.gov' },
  { id: 'tasma', group: 'evcil', name: 'Tasma, kayış veya taşıma kabı' },
  { id: 'karne', group: 'evcil', name: 'Aşı karnesi fotokopisi ve fotoğrafı', src: 'AFAD' },
  { id: 'kum', group: 'evcil', name: 'Kum, poşet, mama kabı' },
];

export function itemsFor(profile: ProfileId, opts: Partial<Record<OptionId, boolean>>): KitItem[] {
  const optGroups = new Set(GROUPS.filter((g) => g.option && !opts[g.option]).map((g) => g.id));
  return DEFAULT_ITEMS.filter((i) => (i.profiles ?? ALL).includes(profile) && !optGroups.has(i.group));
}
