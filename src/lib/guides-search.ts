// Rehberlerde Türkçe duyarlı, eklere toleranslı basit arama.
// Ağır bir arama kütüphanesi kullanılmaz; rehber sayısı küçüktür.
import { GUIDES, type Guide } from '../content/guides';
import { getPackGuides, packGuidesVersion } from '../content/pack-guides';

export type { Guide };

/** Türkçe küçük harfe çevirir, ı/i farkını, aksanları ve noktalama işaretlerini kaldırır. */
export function normalizeTr(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // ç→c, ş→s, ğ→g, ö→o, ü→u, â→a
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Aramada anlam taşımayan sık kelimeler (normalize edilmiş halleri)
const STOP = new Set([
  've', 'ile', 'bir', 'bu', 'mi', 'mu', 'ne', 'nasil', 'icin', 'ya', 'da', 'de', 'ki', 'ben', 'sen',
  'o', 'var', 'yok', 'ama', 'cok', 'gibi', 'olur', 'yapmali', 'yapmaliyim', 'ederim', 'nedir', 'neler',
  'yapilir', 'yapayim', 'yapacagim', 'yapalim', 'yapmaliyiz', 'lazim', 'gerek', 'en', 'kac', 'nerede', 'yakin',
  'bugun', 'yarin', 'dun', 'simdi', 'acaba', 'lutfen', 'bana', 'bize',
]);

// "Hava nasıl / hava durumu" hava durumu sorusudur; "hava" kelimesi rehberlerdeki
// "hava yolu", "dağda hava bozdu" gibi konularla eşleşmesin.
const WEATHER_Q = /\bhava (nasil|durumu|nasildir)\b/;

export function tokenize(s: string): string[] {
  const n = normalizeTr(s);
  if (!n) return [];
  return n.split(' ').filter((t) => t.length >= 2 && !STOP.has(t));
}

/**
 * a'dan b'ye tek bir düzenlemeyle (Damerau, mesafe 1) gidilebiliyorsa düzenlemenin türü:
 * 'sub' değişme, 'swap' yer değiştirme, 'ins:<harf>' / 'del:<harf>' ekleme/silme.
 */
function edit1(a: string, b: string): string | null {
  const la = a.length;
  const lb = b.length;
  if (a === b || Math.abs(la - lb) > 1) return null;
  let i = 0;
  while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return 'sub';
    if (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2)) return 'swap';
    return null;
  }
  if (la < lb) return a.slice(i) === b.slice(i + 1) ? 'ins:' + b[i] : null;
  return a.slice(i + 1) === b.slice(i) ? 'del:' + a[i] : null;
}

/** 1: tam eşleşme, 0.75: biri diğerinin öneki (en az 3 harf), 0: eşleşme yok */
function tokenMatch(q: string, t: string): number {
  if (q === t) return 1;
  const short = q.length <= t.length ? q : t;
  const long = short === q ? t : q;
  if (short.length >= 3 && long.startsWith(short)) {
    // "pusulasız", "susuz" gibi -sız/-suz ekleri anlamı tersine çevirir
    return /^s[iu]z/.test(long.slice(short.length)) ? 0 : 0.75;
  }
  return 0;
}

// Fiil çekim ekleri (normalize edilmiş, uzundan kısaya): "arıtılır" → "arıt",
// "kaynatabilirim" → "kaynat", "temizlenir" → "temiz". Yalnızca sorgu kelimelerine uygulanır.
const VERB_SUFFIXES = [
  'ilabilir', 'ulabilir', 'abilirim', 'ebilirim', 'abilir', 'ebilir', 'iliyor', 'uluyor', 'iyorum', 'uyorum',
  'ilmeli', 'ulmali', 'ilmali', 'ulmeli', 'inmeli', 'meliyim', 'maliyim', 'ilir', 'ulur', 'inir', 'unur', 'iyor', 'uyor',
  'irim', 'urum', 'arim', 'erim', 'mali', 'meli', 'mak', 'mek', 'ir', 'ur', 'ar', 'er',
];

/** Sorgu kelimesinden fiil çekim ekini atar; kök en az 4 harf kalmazsa null. */
export function verbStem(q: string): string | null {
  for (const suf of VERB_SUFFIXES) {
    if (q.length - suf.length >= 4 && q.endsWith(suf)) return q.slice(0, -suf.length);
  }
  return null;
}

function bestMatch(q: string, tokens: Set<string>): number {
  let best = 0;
  for (const t of tokens) {
    const m = tokenMatch(q, t);
    if (m > best) best = m;
    if (best === 1) break;
  }
  if (best === 0) {
    // Çekimli fiil: kökü rehber kelimesinin öneki ise (arıt- → arıtma) zayıf eşleşme say
    const st = verbStem(q);
    if (st) for (const t of tokens) if (t.startsWith(st) && !/^s[iu]z/.test(t.slice(st.length))) return 0.6;
  }
  return best;
}

interface Indexed {
  guide: Guide;
  title: Set<string>;
  keywords: Set<string>;
  /** anahtar ifadelerin anlamsız kelimeleri atılmış halleri */
  keywordPhrases: string[];
  summary: Set<string>;
  body: Set<string>;
  titleNorm: string;
}

const W = { title: 10, keywords: 6, summary: 3, body: 1 };

let index: Indexed[] | null = null;
/** Dizinin kurulduğu andaki paket rehberi sürümü: paket yüklenince dizin yenilenir */
let indexVersion = -1;
/** Rehberlerde geçen kelimeler → ağırlıklı sıklık (yazım düzeltmesi için) */
let vocab: Map<string, number> | null = null;
function getIndex(): Indexed[] {
  if (index && indexVersion === packGuidesVersion()) return index;
  indexVersion = packGuidesVersion();
  index = getAllGuides().map((g) => ({
    guide: g,
    title: new Set(tokenize(g.title + ' ' + g.tag)),
    keywords: new Set(g.keywords.flatMap(tokenize)),
    keywordPhrases: g.keywords.map((k) => tokenize(k).join(' ')).filter(Boolean),
    summary: new Set(tokenize(g.summary)),
    body: new Set([...g.steps, ...(g.dont ?? [])].flatMap(tokenize)),
    titleNorm: normalizeTr(g.title),
  }));
  vocab = new Map();
  const add = (set: Set<string>, w: number) => set.forEach((t) => vocab!.set(t, (vocab!.get(t) ?? 0) + w));
  for (const ix of index) {
    add(ix.title, 3);
    add(ix.keywords, 3);
    add(ix.summary, 1);
    add(ix.body, 1);
  }
  return index;
}

/**
 * Telaşla yazılmış sorgu kelimesini rehber sözlüğüne yaklaştırır:
 * "oluyo" → "oluyor" (konuşma dili), "deprm" → "deprem", "elktrik" → "elektrik" (tek harf hatası).
 * Sözlükte olan ya da bir sözlük kelimesinin öneki olan kelimeye dokunulmaz.
 */
function correctToken(q: string): string {
  const v = vocab!;
  if (v.has(q)) return q;
  if (q.endsWith('yo') && v.has(q + 'r')) return q + 'r';
  if (q.length < 5) return q;
  let best = q;
  let bestCount = 0;
  for (const [t, n] of v) {
    if (t[0] !== q[0]) continue;
    // Yarım yazılmış ("kanamas") ya da ek almış ("depremlerde") kelime zaten önekle eşleşir
    if (t.startsWith(q) || (t.length >= 5 && q.startsWith(t) && !/^s[iu]z/.test(q.slice(t.length)))) return q;
    if (t.length < 5 || n <= bestCount) continue;
    const e = edit1(q, t);
    if (!e) continue;
    // Tek harf değişmesi kısa kelimelerde başka bir kelimeye götürür ("dolar" → "dolap")
    if (e === 'sub' && q.length < 6) continue;
    // Olumsuzluk eki: "almıyor" ile "alıyor" zıt anlamlıdır
    if (e === 'ins:m' || e === 'del:m') continue;
    best = t;
    bestCount = n;
  }
  return best;
}

export function searchGuides(query: string, limit = 5): { guide: Guide; score: number; coverage: number }[] {
  const qNorm = normalizeTr(query);
  const raw = tokenize(WEATHER_Q.test(qNorm) ? qNorm.replace(/\bhava\b/g, ' ') : query);
  if (!raw.length) return [];
  const ixs = getIndex();
  const qTokens = [...new Set(raw.map(correctToken))];
  const qJoined = qTokens.join(' ');
  const out: { guide: Guide; score: number; coverage: number }[] = [];

  for (const ix of ixs) {
    let score = 0;
    let matched = 0;
    for (const q of qTokens) {
      const s =
        W.title * bestMatch(q, ix.title) +
        W.keywords * bestMatch(q, ix.keywords) +
        W.summary * bestMatch(q, ix.summary) +
        W.body * bestMatch(q, ix.body);
      if (s > 0) matched++;
      score += s;
    }
    if (!score) continue;
    // Tüm ifade bir anahtar kelimeyle ya da başlıkla birebir örtüşüyorsa ödül
    if (qTokens.length > 1 || qJoined.length >= 3) {
      if (ix.keywordPhrases.includes(qJoined)) score += 14;
      else if (qNorm.length >= 4 && (' ' + ix.titleNorm + ' ').includes(' ' + qNorm + ' ')) score += 6;
    }
    // Sorgudaki kelimelerin çoğunu karşılayan rehberler öne çıksın
    score *= 0.5 + 0.5 * (matched / qTokens.length);
    out.push({ guide: ix.guide, score: Math.round(score * 100) / 100, coverage: matched / qTokens.length });
  }

  // Eşit puanda dizideki sıra korunur (Array.prototype.sort kararlıdır)
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}

export function getGuide(id: string | null | undefined): Guide | undefined {
  if (!id) return undefined;
  return GUIDES.find((g) => g.id === id) ?? getPackGuides().find((g) => g.id === id);
}

/** Yerleşik rehberler + kurulu rehber paketlerindekiler (paketler sonda) */
export function getAllGuides(): Guide[] {
  const extra = getPackGuides();
  return extra.length ? [...GUIDES, ...extra] : GUIDES;
}

/** Asistan bağlamı için düz metin */
export function guideToText(g: Guide): string {
  const lines: string[] = [];
  lines.push(`${g.title} [${g.tag}]`);
  lines.push(g.summary);
  if (g.note) lines.push('Uyarı: ' + g.note);
  if (g.callEmergency) lines.push("Mümkünse hemen 112'yi arayın.");
  lines.push('');
  lines.push('Adımlar:');
  g.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  if (g.dont?.length) {
    lines.push('');
    lines.push('Yapmayın:');
    g.dont.forEach((d) => lines.push(`- ${d}`));
  }
  lines.push('');
  lines.push('Kaynaklar: ' + g.sources.join('; '));
  if (!g.reviewed) lines.push('Not: Bu rehber henüz bir sağlık profesyoneli tarafından incelenmedi.');
  return lines.join('\n');
}
