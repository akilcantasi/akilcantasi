// Kütüphane araması: Türkçe duyarsız eşleştirme, sıralama, yazım hatası
// toleransı ve ZIM içindeki Xapian dizinleriyle başlık / tam metin araması.
//
// ─── Tasarım kararı (ölçümler: tr Vikipedi mini, 1,2 GB, 1 030 901 başlık) ───
// Kiwix ZIM'leri iki Xapian "glass" veritabanı taşır: X/title/xapian (165 MB)
// ve X/fulltext/xapian (246 MB). İkisi de sıkıştırmasız kümededir, yani
// dosyadan doğrudan rastgele erişimle okunabilir. Glass biçimi (8 KB'lık
// B-ağacı blokları, kayıt listeleri, belge verisi, değer akışları) saf TS ile
// ~450 satırda okunabildi (./xapian.ts), bu yüzden:
//   • Başlık araması: 1) başlık listesinde Türkçe harf varyantlı önek araması
//     (eski yol, her ZIM'de çalışır) + 2) X/title/xapian'da her kelime için tam
//     terim ve önek terimleri → belge kümelerinin kesişimi → değer 0'dan başlık.
//     Böylece başlığın herhangi bir kelimesiyle (kelime öneki) eşleşme olur.
//   • Yazım hatası: sonuç azsa sorgu kelimesinin ilk 2–3 harfiyle başlayan
//     dizin terimleri taranır, Damerau-Levenshtein ≤ 1 (≥ 7 harfte ≤ 2) olanlar
//     kullanılır.
//   • Tam metin: X/fulltext/xapian (STEM_ALL, yalnızca kökler). Türkçe Snowball
//     kökleyicisini taşımak yerine sorgu kelimesinin ek atılmış biçimleri ve
//     önekleri arasında dizinde bulunan en uzun terim kök olarak seçilir; puan
//     BM25 benzeri (idf · wdf doygunluğu), tüm kelimeleri içerenler öne alınır.
//   • İlk kullanımda dizin kurulmaz; OPFS'e bir şey yazılmaz. Ek bellek yalnızca
//     blok önbelleğidir (1024 × 8 KB ≈ 8 MB üst sınır).
//   • Xapian dizini olmayan ZIM'lerde (eski/elle üretilmiş): ≤ 20 000 başlıklı
//     arşivlerde başlıklar bir kez belleğe alınıp aynı sıralama uygulanır;
//     daha büyüklerinde yalnızca önek araması yapılır.
// Ölçümler (2026-11, tr Vikipedi mini 1,2 GB, node 22, yerel dosya ≈ OPFS;
// makine yükü ~10 iken; tests/kutuphane-real.test.ts ve e2e/kutuphane-check.mjs):
//   arşiv açma 2–3 ms, Xapian dizinlerini açma < 20 ms, ön hazırlık/dizin kurma YOK
//   ilk başlık araması ~90 ms, ilk tam metin ~95 ms
//   başlık araması medyan 30–60 ms (en kötü ~150 ms), tam metin medyan 20–100 ms
//   sorgu başına ~200 okuma / ~3 MB okunan veri; GC sonrası kalıcı yığın artışı ~3 MB
//   HTTP Range (masaüstü sunucusu, aynı makine): medyan 250–500 ms (32 KB sayfa,
//   2 bloklu Xapian okuması: 16 KB'a göre %13 daha az istek)
import type { ZimArchive, ZimHit } from './index';
import { normalizeForSearch, foldTr, foldCharwise } from './text';

export { foldTr, foldCharwise };
import type { GlassDb, Posting } from './xapian';

// ---------------------------------------------------------------------------
// Katlama (folding) ve kelimeler
// ---------------------------------------------------------------------------

export function wordsOf(folded: string): string[] {
  return folded.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Yazım hatası mesafesi
// ---------------------------------------------------------------------------

/** Kısıtlı Damerau-Levenshtein (yer değiştirme dâhil); max'ı aşınca max+1 döner. */
export function editDistance(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  const n = a.length;
  const m = b.length;
  if (Math.abs(n - m) > max) return max + 1;
  let prev2 = new Array<number>(m + 1).fill(0);
  let prev = Array.from({ length: m + 1 }, (_, j) => j);
  let cur = new Array<number>(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    [prev2, prev, cur] = [prev, cur, prev2];
  }
  return Math.min(prev[m], max + 1);
}

/** Kelime uzunluğuna göre izin verilen hata sayısı. */
export function typoBudget(len: number): number {
  return len < 4 ? 0 : len < 7 ? 1 : 2;
}

// ---------------------------------------------------------------------------
// Eşleşme sınıfı ve sıralama
// ---------------------------------------------------------------------------

export const enum Rank {
  EXACT = 0,
  PREFIX = 1,
  WORDS = 2, // sorgunun tüm kelimeleri başlıkta tam kelime olarak var
  WORD_PREFIX = 3,
  SUBSTRING = 4,
  FUZZY = 5,
}

export const RANK_NAMES = ['tam', 'önek', 'kelime', 'kelime-öneki', 'içerir', 'benzer'] as const;

/**
 * Sorgu ile başlığın eşleşme sınıfı: tam > önek > (tüm kelimeler) >
 * kelime öneki > içerir > benzer (yazım hatası). Eşleşmezse null.
 */
export function matchRank(query: string, title: string): Rank | null {
  const q = foldTr(query);
  const t = foldTr(title);
  if (!q || !t) return null;
  if (t === q) return Rank.EXACT;
  // "Deprem (film)" gibi parantezli ayrım ekleri tam eşleşmeye yakın sayılır
  if (t.startsWith(q)) return Rank.PREFIX;
  const qw = wordsOf(q);
  const tw = wordsOf(t);
  if (!qw.length || !tw.length) return t.includes(q) ? Rank.SUBSTRING : null;
  const used = new Set<number>();
  let allExact = true;
  let allPrefix = true;
  for (let i = 0; i < qw.length; i++) {
    const w = qw[i];
    let found = -1;
    for (let j = 0; j < tw.length; j++) if (!used.has(j) && tw[j] === w) found = j;
    if (found < 0) {
      allExact = false;
      for (let j = 0; j < tw.length; j++)
        if (!used.has(j) && tw[j].startsWith(w)) {
          found = j;
          break;
        }
    }
    if (found < 0) {
      allPrefix = false;
      break;
    }
    used.add(found);
  }
  if (allExact) return Rank.WORDS;
  if (allPrefix) return Rank.WORD_PREFIX;
  if (qw.every((w) => t.includes(w))) return Rank.SUBSTRING;
  // Yazım hatası: her kelime, başlıktaki bir kelimeye (ya da son kelimede
  // aynı uzunluktaki önekine) yakın olmalı
  const ok = qw.every((w, i) => {
    const k = typoBudget(w.length);
    if (!k) return tw.some((x) => x.startsWith(w));
    return tw.some(
      (x) =>
        editDistance(w, x, k) <= k ||
        (i === qw.length - 1 && x.length > w.length && editDistance(w, x.slice(0, w.length), k) <= k),
    );
  });
  return ok ? Rank.FUZZY : null;
}

export interface RankedHit extends ZimHit {
  rank: Rank;
  /** Küçük = daha iyi (sınıf içi sıralama) */
  score: number;
  /** Bilinen yönlendirme (Xapian başlık dizininden) */
  redirect?: boolean;
}

/** Sınıf içinde: kısa başlık, az kelime, ayrım parantezi ve noktalama cezası. */
export function scoreHit(rank: Rank, title: string, query = '', bonus = 0): number {
  const t = foldTr(title);
  let s = rank * 1000 + Math.min(200, t.length) + wordsOf(t).length * 3 - bonus;
  if (/\(.*\)/.test(title)) s += 15;
  if (/^[^\p{L}\p{N}]/u.test(title)) s += 30;
  if (rank === Rank.FUZZY && query) s += editDistance(foldTr(query), t.slice(0, query.length + 2), 4) * 40;
  return s;
}

/** Aynı katlanmış başlıktan hangisi gösterilsin: yönlendirme olmayan, karışık harfli, Türkçe harfli. */
function displayQuality(h: { title: string; redirect?: boolean }) {
  let q = 0;
  if (h.redirect === false) q += 8;
  if (h.redirect) q -= 8;
  const letters = h.title.replace(/[^\p{L}]/gu, '');
  if (letters && letters !== letters.toLocaleUpperCase('tr')) q += 4;
  q += Math.min(3, (h.title.match(/[çğıöşüâîûÇĞİÖŞÜÂÎÛ]/g) ?? []).length);
  return q;
}

/** Aynı katlanmış başlığa sahip sonuçları teke indirir (ör. "Kalp krizi" / "Kalp Krizi"). */
function collapse(hits: Iterable<RankedHit>): RankedHit[] {
  const eff = (h: RankedHit) => h.score - displayQuality(h) * 2;
  const byFold = new Map<string, RankedHit>();
  for (const h of hits) {
    const k = foldTr(h.title);
    const c = byFold.get(k);
    if (!c || eff(h) < eff(c)) byFold.set(k, h);
  }
  return [...byFold.values()].sort(compareHits);
}

export function rankTitles(query: string, hits: (ZimHit & { redirect?: boolean })[]): RankedHit[] {
  const out: RankedHit[] = [];
  for (const h of hits) {
    const r = matchRank(query, h.title);
    if (r === null) continue;
    out.push({ ...h, rank: r, score: scoreHit(r, h.title, query) });
  }
  return collapse(out);
}

export function compareHits(a: RankedHit, b: RankedHit) {
  return a.score - b.score || a.title.localeCompare(b.title, 'tr');
}

/** Birden çok listeyi birleştirir (aynı yol bir kez; daha iyi puan kalır). */
export function mergeRanked(...lists: RankedHit[][]): RankedHit[] {
  const m = new Map<string, RankedHit>();
  for (const l of lists)
    for (const h of l) {
      const c = m.get(h.path);
      if (!c || h.score < c.score) m.set(h.path, h);
    }
  return collapse(m.values());
}

// ---------------------------------------------------------------------------
// Türkçe ek atımı (asistan ve tam metin kökü için)
// ---------------------------------------------------------------------------

const SUFFIXES = [
  'lerinden', 'larından', 'lerinde', 'larında', 'lerine', 'larına', 'lerini', 'larını', 'sından', 'sinden',
  'sında', 'sinde', 'ndaki', 'ndeki', 'nden', 'ndan', 'leri', 'ları', 'deki', 'daki', 'teki', 'taki', 'ının',
  'inin', 'unun', 'ünün', 'ında', 'inde', 'unda', 'ünde', 'ler', 'lar', 'nin', 'nın', 'nun', 'nün', 'den', 'dan',
  'ten', 'tan', 'dir', 'dır', 'yla', 'yle', 'sı', 'si', 'su', 'sü', 'de', 'da', 'te', 'ta', 'ye', 'ya', 'yi', 'yı',
  'in', 'ın', 'un', 'ün', 'la', 'le', 'i', 'ı', 'u', 'ü', 'e', 'a',
].map(normalizeForSearch);

const SOFTEN: Record<string, string> = { ğ: 'k', b: 'p', c: 'ç', d: 't' };

/**
 * Kelimenin aranacak biçimleri: kendisi, ardından en uzun ekten başlayarak ek
 * atılmış kökler (ve yumuşama geri alınmış hâlleri: kitab → kitap).
 */
export function wordForms(w: string): string[] {
  w = normalizeForSearch(w);
  const forms = new Set<string>([w]);
  for (const s of [...SUFFIXES].sort((a, b) => b.length - a.length)) {
    if (w.length - s.length >= 3 && w.endsWith(s)) {
      const stem = w.slice(0, -s.length);
      forms.add(stem);
      const last = stem[stem.length - 1];
      if (SOFTEN[last]) forms.add(stem.slice(0, -1) + SOFTEN[last]);
    }
  }
  return [...forms].slice(0, 5);
}

// ---------------------------------------------------------------------------
// Xapian terim biçimi
// ---------------------------------------------------------------------------

/**
 * libzim terimleri "Lower; NFD; [:M:] remove; NFC" ile üretir: I/İ → i,
 * ş → s … ama ı (noktasız i) ayrışmadığından korunur. Katlanmış sorgudaki her
 * 'i' dizinde 'i' ya da 'ı' olabilir; en fazla `cap` varyant üretilir.
 */
export function termVariants(foldedWord: string, cap = 8): string[] {
  const idx: number[] = [];
  for (let i = 0; i < foldedWord.length; i++) if (foldedWord[i] === 'i') idx.push(i);
  const out: string[] = [];
  const n = Math.min(idx.length, Math.floor(Math.log2(cap)));
  // Önce hiç değiştirmeden, sonra az değişiklikli varyantlar
  const masks = Array.from({ length: 1 << n }, (_, m) => m).sort((a, b) => popcount(a) - popcount(b) || a - b);
  for (const m of masks) {
    const chars = [...foldedWord];
    for (let b = 0; b < n; b++) if (m & (1 << b)) chars[idx[b]] = 'ı';
    out.push(chars.join(''));
    if (out.length >= cap) break;
  }
  return out;
}

function popcount(x: number) {
  let c = 0;
  for (; x; x &= x - 1) c++;
  return c;
}

/** Xapian sorgu terimi için kelimeyi libzim'in yaptığı gibi katlar (ı korunur). */
export function xapianFold(word: string): string {
  // ICU kök yerel ayarı: I → i (Türkçe kuralı I → ı uygulanmaz)
  return word
    .toLowerCase()
    .replace(/ı/g, '\u0000')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .replace(/\u0000/g, 'ı')
    .normalize('NFC');
}

// ---------------------------------------------------------------------------
// Arşivde başlık araması
// ---------------------------------------------------------------------------

/** Sınırlı eşzamanlılıkla eşleme (HTTP Range / OPFS okumalarını paralelleştirir). */
export async function mapLimit<T, R>(items: T[], n: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return out;
}

const SMALL_ARCHIVE = 20000;
const smallIndex = new WeakMap<ZimArchive, Promise<{ hit: ZimHit; f: string }[]>>();

/** Küçük (dizinsiz) arşivlerde tüm başlıkları bir kez belleğe alır. */
function allTitles(zim: ZimArchive) {
  let p = smallIndex.get(zim);
  if (!p) {
    p = (async () => {
      const out: { hit: ZimHit; f: string }[] = [];
      for (let j = 0; j < zim.articleCount; j++) {
        const e = await zim.titleEntry(j);
        if (e) out.push({ hit: { path: e.path, title: e.title }, f: foldTr(e.title) });
      }
      return out;
    })();
    smallIndex.set(zim, p);
  }
  return p;
}

export interface SearchOptions {
  limit?: number;
  /** Yazım hatası toleransı (varsayılan: açık) */
  fuzzy?: boolean;
}

/**
 * Bir arşivde başlık araması: önek araması + (varsa) Xapian başlık dizini ya
 * da küçük arşivde tam tarama; sonuçlar matchRank ile sınıflanıp sıralanır.
 */
export async function searchArchive(zim: ZimArchive, query: string, opts: SearchOptions = {}): Promise<RankedHit[]> {
  const limit = opts.limit ?? 30;
  const q = query.replace(/[_\s]+/g, ' ').trim();
  const fq = foldTr(q);
  if (!fq) return [];
  const words = wordsOf(fq);
  const pool = new Map<string, ZimHit & { redirect?: boolean }>();
  const add = (h: ZimHit & { redirect?: boolean }) => {
    const c = pool.get(h.path);
    if (!c || (c.redirect === undefined && h.redirect !== undefined)) pool.set(h.path, h);
  };

  // 1) Önek araması (her arşivde) ve Xapian başlık dizini — paralel
  const db = await zim.xapian('title');
  const [prefixHits, xHits] = await Promise.all([
    zim.searchTitles(q, limit, !db),
    db ? xapianTitleCandidates(zim, db, words, limit * 2) : Promise.resolve([]),
  ]);
  prefixHits.forEach(add);
  xHits.forEach(add);
  let small: { hit: ZimHit; f: string }[] | null = null;
  if (!db && zim.articleCount <= SMALL_ARCHIVE) {
    small = await allTitles(zim);
    for (const { hit } of small) add(hit);
  }

  let ranked = rankTitles(q, [...pool.values()]);
  const good = ranked.filter((h) => h.rank <= Rank.SUBSTRING).length;

  // 2) Ek atılmış biçimler ("depremde" → "deprem"): yalnızca iyi sonuç azsa
  if (good < Math.min(limit, 5)) {
    const stemQ = words.map((w) => wordForms(w).map(foldTr).find((f) => f !== w && f.length >= 3) ?? w).join(' ');
    if (stemQ !== words.join(' ')) {
      const extra: ZimHit[] = [...(await zim.searchTitles(stemQ, 10))];
      if (db) extra.push(...(await xapianTitleCandidates(zim, db, wordsOf(stemQ), limit)));
      const stemRanked = rankTitles(stemQ, extra).map((h) => ({
        ...h,
        rank: Rank.FUZZY,
        score: scoreHit(Rank.FUZZY, h.title) - 600 + h.rank * 100,
      }));
      ranked = mergeRanked(ranked, stemRanked);
    }
  }

  // 3) Yazım hatası toleransı
  if (opts.fuzzy !== false && ranked.filter((h) => h.rank <= Rank.SUBSTRING).length < Math.min(limit, 5)) {
    const extra: ZimHit[] = [];
    if (db) {
      const { hits, terms } = await xapianFuzzyCandidates(zim, db, words, 30);
      extra.push(...hits);
      // Düzeltilmiş terimle önek araması: "istanbl" → "istanbul" → "İstanbul"
      if (words.length === 1) for (const t of terms.slice(0, 3)) extra.push(...(await zim.searchTitles(t, 6)));
    } else if (small) {
      // küçük arşivde zaten tümü havuzda
    }
    ranked = mergeRanked(ranked, rankTitles(q, extra));
  }
  return ranked.slice(0, limit);
}

async function hitForDoc(zim: ZimArchive, db: GlassDb, did: number): Promise<(ZimHit & { redirect?: boolean }) | null> {
  const [data, title, target] = await Promise.all([db.docData(did), db.value(0, did), db.value(1, did)]);
  if (!data) return null;
  let path = data;
  if (zim.isNewNamespace && path.startsWith('C/')) path = path.slice(2);
  if (title) return { path, title, redirect: target !== null ? target !== path : undefined };
  const d = await zim.direntForIndexedPath(data);
  return d ? { path: zim.publicPath(d), title: d.title } : null;
}

/** Her kelime için (tam + önek) terimlerin belge kümeleri; kesişim adayları. */
async function xapianTitleCandidates(
  zim: ZimArchive,
  db: GlassDb,
  words: string[],
  max: number,
): Promise<(ZimHit & { redirect?: boolean })[]> {
  if (!words.length) return [];
  const perWord = await mapLimit(words.slice(0, 5), 5, async (w0) => {
    const w = xapianFold(w0);
    const docs = new Map<number, number>(); // did → kalite (0 tam, 1 önek)
    let budget = 6000;
    for (const v of termVariants(w, 4)) {
      // Tam terim
      const exact = await db.postings(v, budget);
      budget -= exact.list.length;
      for (const p of exact.list) docs.set(p.did, 0);
      // Önek terimleri (kelime öneki eşleşmesi) — kısa kelimelerde patlamasın
      if (w.length >= 3 && budget > 0) {
        const terms = (await db.termsWithPrefix(v, 30, 800)).filter((t) => t.term !== v);
        terms.sort((a, b) => a.term.length - b.term.length || b.tf - a.tf);
        // Bütçeye sığan terimleri seç (tf ile), sonra paralel oku
        const chosen: { term: string; max: number }[] = [];
        for (const t of terms) {
          if (budget <= 0) break;
          const m = Math.min(budget, 1500, t.tf);
          chosen.push({ term: t.term, max: m });
          budget -= m;
        }
        const lists = await mapLimit(chosen, 6, (t) => db.postings(t.term, t.max));
        for (const pl of lists) for (const p of pl.list) if (!docs.has(p.did)) docs.set(p.did, 1);
      }
    }
    return docs;
  });
  // Kesişim (en küçük kümeden)
  perWord.sort((a, b) => a.size - b.size);
  const cands: { did: number; q: number }[] = [];
  for (const [did, q0] of perWord[0]) {
    let q = q0;
    let ok = true;
    for (let i = 1; i < perWord.length && ok; i++) {
      const v = perWord[i].get(did);
      if (v === undefined) ok = false;
      else q += v;
    }
    if (ok) cands.push({ did, q });
  }
  cands.sort((a, b) => a.q - b.q || a.did - b.did);
  const hits = await mapLimit(cands.slice(0, max), 8, (c) => hitForDoc(zim, db, c.did).catch(() => null));
  return hits.filter((h): h is NonNullable<typeof h> => !!h);
}

/** Yazım hatası adayları: ilk harfleri ortak, mesafesi bütçe içindeki terimler. */
async function xapianFuzzyCandidates(
  zim: ZimArchive,
  db: GlassDb,
  words: string[],
  max: number,
): Promise<{ hits: ZimHit[]; terms: string[] }> {
  const sets: Set<number>[] = [];
  const allTerms: string[] = [];
  for (const w0 of words.slice(0, 4)) {
    const w = xapianFold(w0);
    const k = typoBudget(w.length);
    const docs = new Set<number>();
    if (!k) {
      const pl = await db.postings(w, 2000);
      pl.list.forEach((p) => docs.add(p.did));
      for (const t of await db.termsWithPrefix(w, 20, 400)) (await db.postings(t.term, 300)).list.forEach((p) => docs.add(p.did));
      sets.push(docs);
      continue;
    }
    const near: { term: string; tf: number; d: number }[] = [];
    const prefixes = new Set([w.slice(0, w.length >= 6 ? 3 : 2), w[0] + (w[2] ?? ''), w[1] + w[0]]);
    for (const pre of prefixes) {
      for (const v of termVariants(pre, 2)) {
        for (const t of await db.termsWithPrefix(v, 6000, 6000)) {
          if (t.term.startsWith('Z') || t.term.startsWith('0')) continue;
          const tt = t.term.replace(/ı/g, 'i');
          const d = Math.min(
            editDistance(w.replace(/ı/g, 'i'), tt, k),
            tt.length > w.length ? editDistance(w.replace(/ı/g, 'i'), tt.slice(0, w.length), k) + 0.5 : 9,
          );
          if (d <= k) near.push({ ...t, d });
        }
      }
    }
    near.sort((a, b) => a.d - b.d || b.tf - a.tf);
    allTerms.push(...near.slice(0, 5).map((t) => t.term));
    for (const pl of await mapLimit(near.slice(0, 5), 5, (t) => db.postings(t.term, 400))) pl.list.forEach((p) => docs.add(p.did));
    sets.push(docs);
  }
  if (!sets.length) return { hits: [], terms: allTerms };
  sets.sort((a, b) => a.size - b.size);
  const dids = [...sets[0]].filter((d) => sets.every((s) => s.has(d))).slice(0, max);
  const hits = await mapLimit(dids, 8, (did) => hitForDoc(zim, db, did).catch(() => null));
  return { hits: hits.filter((h): h is NonNullable<typeof h> => !!h), terms: allTerms };
}

// ---------------------------------------------------------------------------
// Tam metin araması
// ---------------------------------------------------------------------------

export interface TextHit extends ZimHit {
  score: number;
  /** Eşleşen sorgu kelimesi sayısı */
  matched: number;
}

/** Dizindeki kökü bulur: kelime, ek atılmış biçimleri, ardından kısalan önekleri. */
async function resolveStem(db: GlassDb, word: string): Promise<{ term: string; tf: number } | null> {
  const w = xapianFold(word);
  for (const v of termVariants(w, 4)) {
    const set = new Set<string>([v, ...wordForms(v).map(xapianFold)]);
    for (let n = v.length - 1; n >= Math.max(3, v.length - 5); n--) set.add(v.slice(0, n));
    const cands = [...set];
    const tfs = await Promise.all(cands.map((c) => db.termFreq(c)));
    const i = tfs.findIndex((tf) => tf > 0);
    if (i >= 0) return { term: cands[i], tf: tfs[i] };
  }
  return null;
}

/**
 * Tam metin araması (X/fulltext/xapian). Dizin yoksa boş döner.
 * Kelime başına en fazla `perTerm` kayıt okunur. Puan: BM25 (k1 = 1,2,
 * b = 0,75; belge uzunluğu doclen listesinden, yalnızca ön elemeyi geçen ilk
 * 40 aday için) + başlıkta tüm kelimeler geçiyorsa ek puan.
 */
export async function searchFulltext(
  zim: ZimArchive,
  query: string,
  opts: { limit?: number; perTerm?: number } = {},
): Promise<TextHit[]> {
  const limit = opts.limit ?? 20;
  const db = await zim.xapian('fulltext');
  if (!db) return [];
  const words = [...new Set(wordsOf(foldTr(query)).filter((w) => w.length >= 2))].slice(0, 6);
  if (!words.length) return [];
  const N = Math.max(1, db.docCount);
  const avgdl = db.totalDoclen && db.docCount ? db.totalDoclen / db.docCount : 100;
  const resolved = await mapLimit(words, 6, async (w) => {
    const st = await resolveStem(db, w);
    if (!st) return null;
    const idf = Math.log(1 + (N - st.tf + 0.5) / (st.tf + 0.5));
    const pl = await db.postings(st.term, opts.perTerm ?? 100000);
    return { idf, list: pl.list };
  });
  const terms = resolved.filter((t): t is { idf: number; list: Posting[] } => !!t);
  if (!terms.length) return [];
  const K1 = 1.2;
  const B = 0.75;
  // Ön eleme: uzunluk normalizasyonu olmadan
  const pre = new Map<number, { s: number; m: number; w: number[] }>();
  terms.forEach((t, ti) => {
    for (const p of t.list) {
      let c = pre.get(p.did);
      if (!c) pre.set(p.did, (c = { s: 0, m: 0, w: new Array(terms.length).fill(0) }));
      c.s += (t.idf * (p.wdf * (K1 + 1))) / (p.wdf + K1);
      c.m++;
      c.w[ti] = p.wdf;
    }
  });
  const top = [...pre.entries()].sort((a, b) => b[1].m - a[1].m || b[1].s - a[1].s).slice(0, Math.max(40, limit * 3));
  const lens = await db.doclens(top.map(([d]) => d)).catch(() => new Map<number, number>());
  const scored = top.map(([did, c]) => {
    const dl = lens.get(did) ?? avgdl;
    let s = 0;
    c.w.forEach((wdf, ti) => {
      if (wdf) s += (terms[ti].idf * (wdf * (K1 + 1))) / (wdf + K1 * (1 - B + (B * dl) / avgdl));
    });
    return { did, s, m: c.m };
  });
  scored.sort((a, b) => b.m - a.m || b.s - a.s);
  const out: TextHit[] = [];
  const found = await mapLimit(scored.slice(0, Math.ceil(limit * 1.5)), 8, async (v) => {
    const data = await db.docData(v.did).catch(() => null);
    const d = data ? await zim.direntForIndexedPath(data).catch(() => null) : null;
    return d ? { v, d } : null;
  });
  for (const x of found) {
    if (!x) continue;
    const { v, d } = x;
    const tw = wordsOf(foldTr(d.title));
    const inTitle = words.filter((w) => tw.some((t) => t.startsWith(w.slice(0, Math.max(3, w.length - 2))))).length;
    out.push({ path: zim.publicPath(d), title: d.title, score: v.s + (inTitle === words.length ? 5 : inTitle), matched: v.m });
  }
  return out.sort((a, b) => b.matched - a.matched || b.score - a.score).slice(0, limit);
}
