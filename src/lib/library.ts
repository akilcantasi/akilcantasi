// Çevrimdışı kütüphane: cihazdaki / bağlı sunucudaki TÜM ZIM paketleri
// (Vikipedi, WikiMed, Vikikitap, Vikisözlük, Vikigezgin, Gutenberg…), birleşik
// arama ve asistan (RAG) için bağlam araması.
//
// Makale referansı ("ref"): "@<paket kimliği>/<arşiv içi yol>". Kimlik paketin
// dosya adıdır ('/' içermez). Öneksiz yollar (eski biçim) birincil kaynakta,
// bulunamazsa diğerlerinde aranır. go.article(ref) ile açılır.
//
// Geliştirici özelliği: ?devzim=<url>[,<url>…] verilirse paket listesi yerine bu
// adreslerdeki ZIM'ler HTTP Range ile açılır. Örn.
//   http://localhost:5181/?devzim=/__dev/sample_tr.zim,/__dev/sample_med_en.zim
import { ZimArchive, extractParagraphs, normalizeForSearch, foldTr, type ZimHit } from './zim';
import { listPacks, openSource } from './packs';
import { getState } from './store';
import { HttpRangeSource } from './source';
import {
  searchArchive,
  searchFulltext,
  compareHits,
  wordForms as wf,
  type RankedHit,
  type TextHit,
} from './zim/search';

export type { ZimArchive, ZimHit, ZimArticle } from './zim';

export type SourceKind = 'wikipedia' | 'wikimed' | 'wikibooks' | 'wiktionary' | 'wikivoyage' | 'gutenberg' | 'other';

export interface LibrarySource {
  /** Paket kimliği (dosya adı) */
  id: string;
  zim: ZimArchive;
  kind: SourceKind;
  /** Kısa Türkçe ad: Vikipedi, WikiMed, Vikikitap… */
  label: string;
  /** ZIM üstverisindeki başlık */
  title: string;
  description: string;
  /** ISO 639-3 (tur, eng…) */
  language: string;
  /** Türkçe dil adı */
  languageName: string;
  /** Makale sayısı (M/Counter'daki text/html; yoksa başlık listesi) */
  articleCount: number;
  /** Aranabilir başlık sayısı (yönlendirmeler dâhil) */
  titleCount: number;
  size: number;
  medical: boolean;
  hasTitleIndex: boolean;
  hasFulltext: boolean;
}

export interface LibraryHit extends RankedHit {
  /** Kaynak kimliği ve açılış referansı */
  sourceId: string;
  sourceLabel: string;
  ref: string;
}

export interface LibraryTextHit extends TextHit {
  sourceId: string;
  sourceLabel: string;
  ref: string;
}

// ---------------------------------------------------------------------------
// Kaynakları açma
// ---------------------------------------------------------------------------

let cached: { version: number; promise: Promise<LibrarySource[]> } | null = null;
let override: { sources: Promise<LibrarySource[]> } | null = null;
let lastError: string | null = null;

/** ?devzim=<url>[,<url>…] parametresi (yoksa boş). */
export function devZimUrls(): string[] {
  try {
    if (typeof location === 'undefined') return [];
    const v = new URLSearchParams(location.search).get('devzim');
    if (!v) return [];
    // Yalnız aynı kökenden (devmap/devpoi gibi): dış bir bağlantı kütüphaneyi başka bir arşivle
    // değiştiremesin
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((u) => {
        try {
          return new URL(u, location.href).origin === location.origin;
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
}

/** Geriye dönük uyumluluk: ilk ?devzim adresi. */
export function devZimUrl(): string | null {
  return devZimUrls()[0] ?? null;
}

const LANG_TR: Record<string, string> = {
  tur: 'Türkçe', tr: 'Türkçe', eng: 'İngilizce', en: 'İngilizce', deu: 'Almanca', de: 'Almanca', fra: 'Fransızca',
  fr: 'Fransızca', ara: 'Arapça', ar: 'Arapça', kur: 'Kürtçe', kmr: 'Kürtçe (Kurmancî)', rus: 'Rusça', spa: 'İspanyolca',
  fas: 'Farsça', per: 'Farsça', aze: 'Azerice', ell: 'Yunanca', bul: 'Bulgarca',
};

export function languageName(code: string): string {
  return code
    .split(/[,;]/)
    .map((c) => LANG_TR[c.trim().toLowerCase()] ?? c.trim())
    .filter(Boolean)
    .join(', ');
}

/** Üstveriden kaynak türü (Name: "wikipedia_tr_all", "mdwiki_en_all"…). */
export function detectKind(name: string, title: string, file: string): SourceKind {
  const s = `${name} ${file}`.toLowerCase();
  const t = title.toLowerCase();
  // Yalnızca gerçek WikiMed (mdwiki ve Vikipedi'nin tıp alt kümesi); NHS ilaç rehberi,
  // sahra tıbbı gibi diğer tıp paketleri kendi adlarıyla görünür (bkz. isMedicalPack)
  if (/mdwiki|wikimed|wikipedia_[a-z]+_medicine/.test(s) || /wikimed/.test(t)) return 'wikimed';
  if (/wikibooks|vikikitap/.test(s) || /vikikitap|wikibooks/.test(t)) return 'wikibooks';
  if (/wiktionary|vikisözlük/.test(s) || /vikisözlük|wiktionary/.test(t)) return 'wiktionary';
  if (/wikivoyage|vikigezgin/.test(s) || /vikigezgin|wikivoyage/.test(t)) return 'wikivoyage';
  if (/gutenberg/.test(s) || /gutenberg/.test(t)) return 'gutenberg';
  if (/wikipedia|vikipedi/.test(s) || /vikipedi|wikipedia/.test(t)) return 'wikipedia';
  return 'other';
}

/** Tıbbi içerikli paket mi (Fener'in tıbbi sorularda bakacağı kaynaklar) */
export function isMedicalPack(kind: SourceKind, name: string, file: string): boolean {
  return kind === 'wikimed' || /medicine|medical|wikem|nhs\.uk|medline/.test(`${name} ${file}`.toLowerCase());
}

const KIND_LABEL: Record<SourceKind, [tr: string, other: string]> = {
  wikipedia: ['Vikipedi', 'Wikipedia'],
  wikimed: ['WikiMed', 'WikiMed'],
  wikibooks: ['Vikikitap', 'Wikibooks'],
  wiktionary: ['Vikisözlük', 'Wiktionary'],
  wikivoyage: ['Vikigezgin', 'Wikivoyage'],
  gutenberg: ['Gutenberg', 'Gutenberg'],
  other: ['', ''],
};

const KIND_ORDER: SourceKind[] = ['wikipedia', 'wikimed', 'wikibooks', 'wiktionary', 'wikivoyage', 'gutenberg', 'other'];

async function describe(id: string, zim: ZimArchive): Promise<LibrarySource> {
  const [name, title, description, language, ti, ft, counter] = await Promise.all([
    zim.getMetadata('Name'),
    zim.getMetadata('Title'),
    zim.getMetadata('Description'),
    zim.getMetadata('Language'),
    zim.xapian('title'),
    zim.xapian('fulltext'),
    zim.getMetadata('Counter'),
  ]);
  const lang = (language || '').trim();
  const kind = detectKind(name || '', title || '', id);
  const isTr = /^(tur|tr)\b/i.test(lang);
  let label = KIND_LABEL[kind][isTr ? 0 : 1] || title || id.replace(/\.zim$/i, '');
  if (kind === 'wikipedia' && !isTr && lang) label += ` (${lang.slice(0, 2).toUpperCase()})`;
  return {
    id,
    zim,
    kind,
    label,
    title: title || id.replace(/\.zim$/i, ''),
    description: description || '',
    language: lang,
    languageName: languageName(lang),
    articleCount: htmlCount(counter) ?? zim.articleCount,
    titleCount: zim.articleCount,
    size: zim.size,
    medical: isMedicalPack(kind, name || '', id),
    hasTitleIndex: !!ti,
    hasFulltext: !!ft,
  };
}

/** "text/html=700883;image/png=5" → 700883 */
export function htmlCount(counter: string | null): number | null {
  if (!counter) return null;
  let n = 0;
  let found = false;
  for (const part of counter.split(';')) {
    const m = /^\s*text\/html[^=]*=(\d+)\s*$/.exec(part);
    if (m) {
      n += Number(m[1]);
      found = true;
    }
  }
  return found ? n : null;
}

/**
 * Aynı kısa adı taşıyan kaynakları ayırt eder (ör. iki Türkçe Vikipedi paketi:
 * "Vikipedi (mini 2026-09)" / "Vikipedi (maxi 2025-12)"); ayırt edemezse dosya adı.
 */
export function disambiguateLabels<T extends { id: string; label: string }>(list: T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const s of list) groups.set(s.label, [...(groups.get(s.label) ?? []), s]);
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const hint = (id: string) => {
      const base = id.replace(/\.zim$/i, '');
      const flavour = /_(mini|nopic|maxi)(?:_|$)/i.exec(base)?.[1] ?? '';
      const date = /_(\d{4}-\d{2})$/.exec(base)?.[1] ?? '';
      return [flavour, date].filter(Boolean).join(' ');
    };
    const hints = g.map((s) => hint(s.id));
    const unique = hints.every((h) => h) && new Set(hints).size === hints.length;
    g.forEach((s, i) => (s.label = `${s.label} (${unique ? hints[i] : s.id.replace(/\.zim$/i, '')})`));
  }
  return list;
}

function sortSources(list: LibrarySource[]): LibrarySource[] {
  disambiguateLabels(list);
  return list.sort((a, b) => {
    const ta = /^(tur|tr)/i.test(a.language) ? 0 : 1;
    const tb = /^(tur|tr)/i.test(b.language) ? 0 : 1;
    return (
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || ta - tb || a.label.localeCompare(b.label, 'tr') || a.id.localeCompare(b.id)
    );
  });
}

/** Tüm ZIM kaynaklarını açar; paketler değişince (packsVersion) yeniden açar. */
export function getLibraries(): Promise<LibrarySource[]> {
  if (override) return override.sources;
  const version = getState().packsVersion;
  if (cached && cached.version === version) return cached.promise;
  const promise = (async () => {
    lastError = null;
    const errors: string[] = [];
    const open = async (id: string, mk: () => Promise<ZimArchive>) => {
      try {
        return await describe(id, await mk());
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`${id}: ${msg}`);
        console.warn('Kütüphane paketi açılamadı:', id, e);
        return null;
      }
    };
    let opened: (LibrarySource | null)[];
    const dev = devZimUrls();
    if (dev.length) {
      opened = await Promise.all(
        dev.map((u) => open(decodeURIComponent(u.split('/').pop() || u), async () => ZimArchive.open(await HttpRangeSource.open(u)))),
      );
    } else {
      const packs = (await listPacks()).filter((p) => p.kind === 'zim');
      opened = await Promise.all(packs.map((p) => open(p.id, async () => ZimArchive.open(await openSource(p)))));
    }
    const list = opened.filter((x): x is LibrarySource => !!x);
    if (errors.length) lastError = errors.join('; ');
    return sortSources(list);
  })();
  cached = { version, promise };
  return promise;
}

/** Birincil kaynak (Türkçe Vikipedi öncelikli) — eski tek-arşiv API'si. */
export async function getLibrary(): Promise<ZimArchive | null> {
  return (await getLibraries())[0]?.zim ?? null;
}

/** Son açma hatası (paket var ama okunamadıysa). */
export function getLibraryError() {
  return lastError;
}

/** Testler için: tek arşivi doğrudan enjekte eder (null = paket yok; undefined = sıfırla). */
export function setLibraryForTests(lib: ZimArchive | null | undefined) {
  setLibrariesForTests(lib === undefined ? undefined : lib ? [{ id: lib.name, zim: lib }] : []);
}

/** Testler için: birden çok arşiv (kimlik + arşiv); undefined = sıfırla. */
export function setLibrariesForTests(list: { id: string; zim: ZimArchive }[] | undefined) {
  override = list === undefined ? null : { sources: Promise.all(list.map((x) => describe(x.id, x.zim))).then(sortSources) };
  cached = null;
}

// ---------------------------------------------------------------------------
// Referanslar
// ---------------------------------------------------------------------------

export function makeRef(sourceId: string, path: string): string {
  return `@${sourceId}/${path}`;
}

export function parseRef(ref: string): { sourceId: string | null; path: string } {
  if (ref.startsWith('@')) {
    const i = ref.indexOf('/');
    if (i > 1) return { sourceId: ref.slice(1, i), path: ref.slice(i + 1) };
  }
  return { sourceId: null, path: ref };
}

/** Referansın kaynağını bulur; kaynak yoksa (ya da öneksizse) yolu kaynaklarda arar. */
export async function resolveRef(ref: string): Promise<{ source: LibrarySource; path: string } | null> {
  const { sourceId, path } = parseRef(ref);
  const all = await getLibraries();
  const s = sourceId ? all.find((x) => x.id === sourceId) : null;
  if (s) return { source: s, path };
  for (const src of all) {
    const a = await src.zim.getArticle(path).catch(() => null);
    if (a) return { source: src, path };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Birleşik arama
// ---------------------------------------------------------------------------

function pick(all: LibrarySource[], sourceId?: string | null) {
  return !sourceId || sourceId === 'all' ? all : all.filter((s) => s.id === sourceId);
}

/**
 * Başlık araması: seçili kaynakta ya da "Tümü"nde (sourceId 'all'/boş).
 * Kaynakların sonuçları sınıf/puan sırasıyla birleştirilir; eşitlikte kaynak
 * sırası (Vikipedi önce) korunur.
 */
export async function searchLibrary(query: string, opts: { sourceId?: string | null; limit?: number } = {}): Promise<LibraryHit[]> {
  const limit = opts.limit ?? 30;
  const srcs = pick(await getLibraries(), opts.sourceId);
  const per = await Promise.all(
    srcs.map((s, i) =>
      searchArchive(s.zim, query, { limit })
        .then((hits) =>
          hits.map((h) => ({ ...h, score: h.score + i * 0.5, sourceId: s.id, sourceLabel: s.label, ref: makeRef(s.id, h.path) })),
        )
        .catch((e) => {
          console.warn('Arama hatası', s.id, e);
          return [] as LibraryHit[];
        }),
    ),
  );
  return per.flat().sort(compareHits).slice(0, limit);
}

/** Tam metin araması (Xapian tam metin dizini olan kaynaklarda). */
export async function searchLibraryText(
  query: string,
  opts: { sourceId?: string | null; limit?: number } = {},
): Promise<LibraryTextHit[]> {
  const limit = opts.limit ?? 15;
  const srcs = pick(await getLibraries(), opts.sourceId).filter((s) => s.hasFulltext);
  const per = await Promise.all(
    srcs.map((s) =>
      searchFulltext(s.zim, query, { limit })
        .then((hits) => {
          // Kaynaklar arası karşılaştırma için puanı en iyi sonuca göre ölçekle
          const top = hits[0]?.score || 1;
          return hits.map((h) => ({ ...h, score: h.score / top, sourceId: s.id, sourceLabel: s.label, ref: makeRef(s.id, h.path) }));
        })
        .catch((e) => {
          console.warn('Tam metin arama hatası', s.id, e);
          return [] as LibraryTextHit[];
        }),
    ),
  );
  // Kaynakları sırayla harmanla (her kaynaktan en iyiler önce)
  const out: LibraryTextHit[] = [];
  for (let i = 0; out.length < limit; i++) {
    let any = false;
    for (const l of per)
      if (l[i]) {
        out.push(l[i]);
        any = true;
      }
    if (!any) break;
  }
  return out.slice(0, limit);
}

/** Rastgele makale (seçili kaynaktan ya da rastgele bir kaynaktan). */
export async function randomLibraryArticle(sourceId?: string | null): Promise<LibraryHit | null> {
  const srcs = pick(await getLibraries(), sourceId).filter((s) => s.titleCount > 0);
  if (!srcs.length) return null;
  // Büyük kaynaklar daha olası (madde sayısıyla orantılı, ama küçükler de çıkabilsin)
  const w = srcs.map((s) => Math.sqrt(s.articleCount));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  let s = srcs[0];
  for (let i = 0; i < srcs.length; i++) {
    r -= w[i];
    if (r <= 0) {
      s = srcs[i];
      break;
    }
  }
  const h = await s.zim.randomArticle();
  if (!h) return null;
  return { ...h, rank: 0, score: 0, sourceId: s.id, sourceLabel: s.label, ref: makeRef(s.id, h.path) };
}

// ---------------------------------------------------------------------------
// RAG bağlam araması
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
  (
    'acaba ama ancak artık aslında az bana bazı belki ben beni benim beri bile bir biraz birkaç birşey biz bize bizi ' +
    'bu buna bunda bundan bunu bunun burada çok çünkü da daha de değil diye en gibi göre hakkında hangi hani hem hep ' +
    'hiç için ile ise kadar kaç kendi ki kim kısaca mı mi mu mü nasıl ne neden nedir nerede nereye niçin niye o ona ' +
    'ondan onlar onu onun öyle peki sadece sen sana seni siz şey şu şimdi ve veya ya yani yap yapmalı yapmalıyım ' +
    'yapılır yapmak verir misin misiniz musun lütfen bilgi anlat açıkla söyle olur oldu olan olarak var yok zaman ' +
    'dir dır tir tır mıdır midir nelerdir nedir neler hakkinda bilgiler ver verebilir ' +
    'the and for what how why when where which who with from about does should can'
  )
    .split(/\s+/)
    .map(normalizeForSearch),
);

/** Kelimenin aranacak biçimleri (kendisi + basit Türkçe ek atımları). */
export const wordForms = wf;

/** Anlamlı iki harfli Türkçe kelimeler (su, ev, ay…) — kısa diye atılmasın. */
const SHORT_WORDS = new Set(['su', 'ev', 'ay', 'et', 'iş', 'ot', 'ip', 'ağ', 'el', 'at', 'iz', 'ek', 'ad', 'ok', 'öz'].map(normalizeForSearch));

export function keywordsOf(query: string): string[] {
  return normalizeForSearch(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => (w.length >= 3 || SHORT_WORDS.has(w)) && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

// Tıbbi soru tespiti ve WikiMed (İngilizce) için terim çevirisi. Anahtarlar
// katlanmış (foldTr) Türkçe öneklerdir; değerler WikiMed madde başlıklarıdır.
const MED_TERMS: [string, string][] = [
  ['kalp krizi', 'Myocardial infarction'], ['kalp masaj', 'Cardiopulmonary resuscitation'],
  ['suni solunum', 'Cardiopulmonary resuscitation'], ['temel yasam destegi', 'Cardiopulmonary resuscitation'],
  ['sicak carpma', 'Heat stroke'], ['gunes carpma', 'Heat stroke'], ['bas agri', 'Headache'],
  ['nefes darligi', 'Shortness of breath'], ['seker hastaligi', 'Diabetes'], ['ilk yardim', 'First aid'],
  ['yilan sokma', 'Snakebite'], ['yilan isirma', 'Snakebite'], ['ari sokma', 'Bee sting'], ['kopek isirma', 'Dog bite'],
  ['karbon monoksit', 'Carbon monoxide poisoning'], ['karbonmonoksit', 'Carbon monoxide poisoning'],
  ['kanama', 'Bleeding'], ['yanik', 'Burn'], ['yanig', 'Burn'], ['kirik', 'Bone fracture'], ['kirig', 'Bone fracture'], ['burkulma', 'Sprain'],
  ['zehirlen', 'Poisoning'], ['ates', 'Fever'], ['ishal', 'Diarrhea'], ['kusma', 'Vomiting'],
  ['enfeksiyon', 'Infection'], ['yara', 'Wound'], ['antibiyotik', 'Antibiotic'], ['inme', 'Stroke'], ['felc', 'Stroke'],
  ['astim', 'Asthma'], ['alerji', 'Allergy'], ['anafilaksi', 'Anaphylaxis'], ['diyabet', 'Diabetes'],
  ['hipoglisemi', 'Hypoglycemia'], ['tansiyon', 'Hypertension'], ['hipotermi', 'Hypothermia'], ['donma', 'Frostbite'],
  ['bayilma', 'Syncope'], ['nobet', 'Seizure'], ['epilepsi', 'Epilepsy'], ['sara', 'Epilepsy'], ['sok', 'Shock (circulatory)'],
  ['kolera', 'Cholera'], ['kuduz', 'Rabies'], ['tetanos', 'Tetanus'], ['tifo', 'Typhoid fever'], ['bogulma', 'Drowning'],
  ['ezilme', 'Crush syndrome'], ['dehidrasyon', 'Dehydration'], ['susuz', 'Dehydration'], ['turnike', 'Tourniquet'],
  ['zaturre', 'Pneumonia'], ['grip', 'Influenza'], ['oksuruk', 'Cough'], ['ilac', 'Medication'], ['hamile', 'Pregnancy'],
  ['dogum', 'Childbirth'], ['akrep', 'Scorpion sting'], ['agri', 'Pain'], ['hipertermi', 'Hyperthermia'],
  ['sinir krizi', 'Panic attack'], ['panik atak', 'Panic attack'], ['travma', 'Injury'], ['yaralan', 'Injury'],
  ['hastalik', 'Disease'], ['belirti', 'Symptom'], ['tedavi', 'Therapy'], ['kalp', 'Heart'], ['bobrek', 'Kidney'],
];

/** Sorudaki tıbbi kavramların WikiMed başlık karşılıkları (boşsa tıbbi değil). */
export function medicalTermsOf(query: string): string[] {
  const words = foldTr(query).split(' ');
  const q = ' ' + words.join(' ') + ' ';
  const out: string[] = [];
  for (const [tr, en] of MED_TERMS) {
    // Kelime başında eşleşme (ör. "kanamada", "yanığa" → "yanik")
    if (q.includes(' ' + tr) && !out.includes(en)) out.push(en);
  }
  // Genel terimler ("Disease", "Symptom", "Pain") yalnızca başka terim yoksa
  const generic = new Set(['Disease', 'Symptom', 'Therapy', 'Pain', 'Heart', 'Injury']);
  const specific = out.filter((t) => !generic.has(t));
  return specific.length ? specific : out;
}

export function isMedicalQuestion(query: string): boolean {
  return medicalTermsOf(query).length > 0;
}

interface Candidate {
  source: LibrarySource;
  hit: ZimHit;
  score: number;
}

/** Tek arşivde başlık tabanlı aday puanlama (eski tek-arşiv algoritması). */
async function contextCandidates(src: LibrarySource, query: string, kws: string[], bias: number): Promise<Candidate[]> {
  const lib = src.zim;
  const qn = normalizeForSearch(query);
  const scores = new Map<string, Candidate>();

  const bump = (hit: ZimHit, score: number) => {
    const tw = normalizeForSearch(hit.title).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    if (tw.length && tw.every((w) => qn.includes(w))) score += 20;
    score -= Math.min(10, hit.title.length / 10);
    // "(film)", "(anlam ayrımı)" gibi ayrım sayfaları bağlam için zayıftır
    if (/\(.*\)/.test(hit.title)) score -= 15;
    score += bias;
    const cur = scores.get(hit.path);
    if (!cur || cur.score < score) scores.set(hit.path, { source: src, hit, score });
  };

  const search = async (term: string, exactScore: number, prefixScore: number, limit = 6) => {
    const hits = await lib.searchTitles(term, limit);
    let exact = false;
    for (const h of hits) {
      const n = normalizeForSearch(h.title);
      if (n === term) {
        bump(h, exactScore + term.length);
        exact = true;
      } else if (n.startsWith(term)) bump(h, prefixScore + term.length / 2);
    }
    return { exact, any: hits.length > 0 };
  };

  if (kws.length > 1) {
    await search(kws.join(' '), 100, 45);
    for (let i = 0; i + 1 < kws.length && i < 4; i++) await search(kws[i] + ' ' + kws[i + 1], 70, 40);
  }
  const ordered = [...new Set(kws)].sort((a, b) => b.length - a.length).slice(0, 5);
  for (const w of ordered) {
    for (const f of wordForms(w)) {
      const r = await search(f, f === w ? 60 : 50, f === w ? 15 : 8, 4);
      if (r.exact) break;
    }
  }
  return [...scores.values()];
}

/**
 * Asistan için soruyla ilgili makaleleri bulur ve ilk anlamlı paragraflarını
 * döndürür. Tüm ZIM kaynaklarında başlık araması yapılır; tıbbi sorularda
 * WikiMed varsa (İngilizce terim karşılıklarıyla) öne alınır. Başlıkta hiçbir
 * şey bulunamazsa tam metin dizinine başvurulur. `path` bir kütüphane
 * referansıdır (go.article ile açılır).
 */
export async function searchLibraryForContext(
  query: string,
  maxArticles = 2,
  maxChars = 1500,
): Promise<{ title: string; path: string; text: string; label?: string }[]> {
  const sources = await getLibraries();
  if (!sources.length) return [];
  const kws = keywordsOf(query);
  if (!kws.length) return [];
  const med = medicalTermsOf(query);
  const hasMed = med.length > 0 && sources.some((s) => s.medical);

  const cands: Candidate[] = [];
  for (const [i, src] of sources.entries()) {
    if (src.kind === 'wiktionary' || src.kind === 'gutenberg') continue; // sözlük/edebiyat bağlam için uygun değil
    let bias = i === 0 ? 0 : -6;
    let terms = kws;
    if (src.medical) {
      if (!hasMed) continue; // tıbbi olmayan soruda WikiMed'e bakma
      bias = 30;
      if (!/^(tur|tr)/i.test(src.language)) terms = med.map((t) => normalizeForSearch(t));
    }
    const list = await contextCandidates(src, query, terms, bias).catch(() => [] as Candidate[]);
    // İngilizce terimlerde tam başlık eşleşmesi zaten çevirinin kendisi
    if (src.medical && terms !== kws) for (const c of list) if (med.some((m) => normalizeForSearch(m) === normalizeForSearch(c.hit.title))) c.score += 40;
    cands.push(...list);
  }

  // Başlıkta bulunamadıysa tam metin (birincil kaynak ve gerekirse WikiMed)
  if (!cands.length) {
    for (const src of sources.filter((s) => s.hasFulltext && (s === sources[0] || (hasMed && s.medical)))) {
      const q = src.medical && !/^(tur|tr)/i.test(src.language) ? med.join(' ') : kws.join(' ');
      const need = Math.min(2, q.split(' ').filter(Boolean).length);
      const hits = await searchFulltext(src.zim, q, { limit: 3, perTerm: 30000 }).catch(() => []);
      // Yalnızca sorgu kelimelerinin (en az ikisinin) geçtiği metinler
      hits.filter((h) => h.matched >= need).forEach((h, j) => cands.push({ source: src, hit: h, score: 10 - j + (src.medical ? 5 : 0) }));
    }
  }

  cands.sort((a, b) => b.score - a.score);
  // İlkinden sonrakiler ancak yeterince güçlüyse (zayıf önek eşleşmeleri bağlamı kirletmesin)
  const floor = cands.length ? Math.max(20, cands[0].score * 0.35) : 0;
  const out: { title: string; path: string; text: string; label?: string }[] = [];
  const seen = new Set<string>();
  for (const { source, hit, score } of cands) {
    if (out.length >= maxArticles) break;
    if (out.length > 0 && score < floor) break;
    const art = await source.zim.getArticle(hit.path).catch(() => null);
    if (!art || !art.mime.startsWith('text/html')) continue;
    const key = source.id + '/' + art.path;
    if (seen.has(key)) continue;
    seen.add(key);
    const text = extractParagraphs(art.html, maxChars).join('\n\n');
    if (text.length < 50) continue;
    out.push({ title: art.title, path: makeRef(source.id, art.path), text, label: source.label });
  }
  return out;
}
