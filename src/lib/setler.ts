// Kütüphane paket setleri ve toplu indirme hesabı (saf mantık; test edilir).
// Setler katalogdan gelir (packs-manifest.json → sets); kimlikler paket id'leridir.
import type { RowModel } from './packs-ui';

export interface PaketSeti {
  id: string;
  title: string;
  desc: string;
  ids: string[];
}

export const VARSAYILAN_SETLER: PaketSeti[] = [
  { id: 'temel', title: 'Temel set', desc: 'Herkes için ilk iniş: ansiklopedi, ilaç, su, gıda, kitaplar', ids: ['wikipedia-tr-mini', 'nhs-ilac', 'kitap-su', 'kitap-gida', 'vikikitap-tr', 'vikikaynak-tr', 'vikidia-en', 'wikimed-en-mini'] },
  { id: 'hayatta', title: 'Hayatta kalma seti', desc: 'Su, gıda, düğüm, doğada kalma ve afet sonrası', ids: ['kitap-su', 'kitap-gida', 'kitap-dugum', 'kitap-afet-sonrasi', 'se-doga', 'readygov'] },
  { id: 'saglik', title: 'Sağlık seti', desc: 'Hekimin olmadığı yerde: tıp ansiklopedileri ve el kitapları', ids: ['wikimed-en-mini', 'nhs-ilac', 'sahra-tibbi', 'kitap-tip', 'wikimed-en-nopic', 'medlineplus'] },
  { id: 'okur', title: 'Okur seti', desc: 'Telifsiz roman, öykü, şiir, sözlük ve özdeyişler', ids: ['vikikaynak-tr', 'vikikitap-tr', 'vikisozluk-tr', 'vikisoz-tr', 'gutenberg-egitim'] },
  { id: 'usta', title: 'Usta seti', desc: 'Tamir, uygun teknoloji ve elle yapılan işler', ids: ['ifixit-tr', 'appropedia', 'lowtech'] },
];

/** Paket cihazda ya da bağlı bilgi noktasında okunabiliyor mu */
export const hazir = (r: RowModel) => !!r.device || !!r.server;

export interface SetDurumu {
  set: PaketSeti;
  rows: RowModel[];
  have: number;
  total: number;
  /** Henüz olmayan paketlerin toplam boyutu (bayt) */
  leftBytes: number;
  complete: boolean;
}

export function setDurumu(set: PaketSeti, byId: Map<string, RowModel>): SetDurumu {
  const rows = set.ids.map((id) => byId.get(id)).filter((r): r is RowModel => !!r);
  const have = rows.filter(hazir).length;
  const leftBytes = rows.filter((r) => !hazir(r)).reduce((a, r) => a + (r.size || 0), 0);
  return { set, rows, have, total: rows.length, leftBytes, complete: rows.length > 0 && have === rows.length };
}

/**
 * Seçili setlerin indirilecek paketleri: tekrarsız, hazır olmayan, şu an inmeyen.
 * Bir paket birden çok sette olsa da bir kez sayılır.
 */
export function kuyruk(secili: Iterable<string>, setler: PaketSeti[], byId: Map<string, RowModel>, aktif: (r: RowModel) => boolean): RowModel[] {
  const sel = new Set(secili);
  const seen = new Set<string>();
  const out: RowModel[] = [];
  for (const s of setler) {
    if (!sel.has(s.id)) continue;
    for (const id of s.ids) {
      const r = byId.get(id);
      if (!r || seen.has(id) || hazir(r) || aktif(r)) continue;
      seen.add(id);
      out.push(r);
    }
  }
  return out;
}

export const toplam = (rows: RowModel[]) => rows.reduce((a, r) => a + (r.size || 0), 0);

/**
 * "Yerimi doldur": setler sırayla eklenir; toplam kalan, boş yerden pay bırakılarak sığdığı sürece.
 * Boş yer bilinmiyorsa yalnız ilk set seçilir.
 */
export function sigdir(setler: PaketSeti[], byId: Map<string, RowModel>, freeBytes: number | null, payBytes = 2e9): string[] {
  if (freeBytes == null || freeBytes <= 0) return setler.slice(0, 1).map((s) => s.id);
  const out: string[] = [];
  for (const s of setler) {
    const deneme = [...out, s.id];
    const need = toplam(kuyruk(deneme, setler, byId, () => false));
    if (need <= freeBytes - payBytes) out.push(s.id);
  }
  return out;
}

/** Katalogdaki setleri doğrular; bilinmeyen paket kimlikleri atılır, boş set gösterilmez */
export function setleriAl(raw: unknown, ids: Set<string>): PaketSeti[] {
  const list = Array.isArray(raw) ? raw : VARSAYILAN_SETLER;
  return list
    .filter((s: any) => s && typeof s.id === 'string' && typeof s.title === 'string' && Array.isArray(s.ids))
    .map((s: any) => ({ id: s.id, title: s.title, desc: String(s.desc ?? ''), ids: s.ids.filter((x: any) => typeof x === 'string' && ids.has(x)) }))
    .filter((s) => s.ids.length > 0);
}
