// Rehber metnindeki rehberler arası bağlantılar.
//
// Biçim: [[rehber-kimliği|görünen metin]]
//   ör. 'Uzun süre sıkışmış birini çekmeyin; [[ezilme-yaralanmasi|"Ezilme yaralanması" rehberine]] bakın.'
// Arayüz bunu dokununca o rehberi açan bağlantıya çevirir. Arama dizini, Fener (RAG ve
// modelsiz cevap) ve düz metin çıktıları işaretlemeyi stripGuideLinks ile atar; yalnız
// görünen metin kalır.
//
// Ayrıca, işaretlemesi olmayan eski metinler (ör. önceden yayımlanmış rehber paketleri) için
// tırnak içindeki bir rehber başlığının hemen ardından "rehber…" geliyorsa ('Çam' rehberinde,
// "Yanık" rehberi) ve başlık tek bir rehbere denk geliyorsa o da bağlantı olur
// (linkQuotedTitles). Bu yüzden paketleri yeniden derlemek gerekmez.
//
// Bu modül saftır (DOM, depolama yok): testler ve derleme betikleri de kullanabilir.

/** [[kimlik|metin]] — kimlik paket kimlik kuralına uyar (küçük harf, rakam, . _ -) */
const LINK_RE = /\[\[([a-z0-9][a-z0-9._-]*)\|([^\]\n]+?)\]\]/g;

export type GuideTextPart = string | { id: string; text: string };

/** Metni düz yazı ve bağlantı parçalarına ayırır. */
export function parseGuideLinks(s: string): GuideTextPart[] {
  if (!s || s.indexOf('[[') < 0) return [s];
  const out: GuideTextPart[] = [];
  let last = 0;
  for (const m of s.matchAll(LINK_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(s.slice(last, i));
    out.push({ id: m[1], text: m[2] });
    last = i + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** İşaretlemeyi atar, görünen metni bırakır (arama, Fener, düz metin). */
export function stripGuideLinks(s: string): string {
  if (typeof s !== 'string' || s.indexOf('[[') < 0) return s;
  return s.replace(LINK_RE, '$2');
}

/** Metindeki bağlantı hedefleri (testler ve doğrulama için). */
export function guideLinkTargets(s: string): string[] {
  if (!s || s.indexOf('[[') < 0) return [];
  return [...s.matchAll(LINK_RE)].map((m) => m[1]);
}

/** Bir rehberin görünen metin alanları (özet, uyarı, adımlar, yapmayın). */
export function guideTextFields(g: { summary?: string; note?: string; steps?: unknown[]; dont?: unknown[] }): string[] {
  return [g.summary, g.note, ...(g.steps ?? []), ...(g.dont ?? [])].filter((x): x is string => typeof x === 'string');
}

// --- Tırnaklı başlıkların kendiliğinden bağlantıya çevrilmesi ---------------------------------

function norm(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/[’'"“”‘]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Başlık → kimlik dizini. Hem tam başlık hem parantezli ek atılmış hâli eklenir
 * ("Hipotermi (aşırı üşüme)" → "hipotermi"). Birden çok rehbere denk gelen başlık
 * belirsizdir ve dizine girmez.
 */
export function buildTitleIndex(guides: { id: string; title: string }[]): Map<string, string> {
  const seen = new Map<string, string | null>();
  const add = (k: string, id: string) => {
    if (!k) return;
    const prev = seen.get(k);
    if (prev === undefined) seen.set(k, id);
    else if (prev !== id) seen.set(k, null);
  };
  for (const g of guides) {
    const t = norm(g.title);
    add(t, g.id);
    // Kısa biçimler: sondaki parantez, iki nokta ya da uzun çizgiden sonrası atılır
    // ("Hipotermi (aşırı üşüme)" → "hipotermi", "Kristal radyo 2: anten" → "kristal radyo 2")
    for (const short of [g.title.replace(/\s*\([^)]*\)\s*$/, ''), g.title.split(/\s*[:—]\s+/)[0]]) {
      const k = norm(short);
      if (k !== t && k.length >= 3) add(k, g.id);
    }
  }
  const out = new Map<string, string>();
  for (const [k, v] of seen) if (v) out.set(k, v);
  return out;
}

// 'Başlık' rehber… / "Başlık" rehber… / “Başlık” rehber… / ‘Başlık’ rehber…
const QUOTED_RE = /(['"“‘])([^'"“”‘’\n]{2,80})(['"”’])(\s+rehber)/g;

/**
 * İşaretlemesiz metindeki tırnaklı rehber başlıklarını bağlantıya çevirir. Bağlantı metni
 * tırnaklı başlıktır ("rehber…" kelimesi düz yazı kalır). `selfId` kendi kendine bağlantıyı önler.
 */
export function linkQuotedTitles(parts: GuideTextPart[], index: Map<string, string>, selfId?: string): GuideTextPart[] {
  if (!index.size) return parts;
  const out: GuideTextPart[] = [];
  for (const p of parts) {
    if (typeof p !== 'string' || !/rehber/i.test(p)) {
      out.push(p);
      continue;
    }
    let last = 0;
    for (const m of p.matchAll(QUOTED_RE)) {
      const id = index.get(norm(m[2]));
      if (!id || id === selfId) continue;
      const i = m.index ?? 0;
      if (i > last) out.push(p.slice(last, i));
      out.push({ id, text: m[1] + m[2] + m[3] });
      last = i + m[0].length - m[4].length;
    }
    if (last < p.length) out.push(p.slice(last));
  }
  return out;
}
