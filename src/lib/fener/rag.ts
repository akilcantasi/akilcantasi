// Fener için bağlam (RAG) kurulumu: soruya en uygun rehberleri ve Vikipedi
// parçalarını bulur, numaralı KAYNAKLAR bloğu halinde isteme (prompt) ekler.
// Model yoksa aynı arama sonucu fallback.ts tarafından doğrudan kullanılır.

// --- Bağımlı modüllerin (rehber arama, kütüphane) beklenen şekli -------------
export interface GuideLike {
  id: string;
  title: string;
  tag?: string;
  summary?: string;
  steps?: unknown[];
  dont?: unknown[];
  keywords?: string[];
  sources?: unknown[];
  critical?: boolean;
  callEmergency?: boolean;
}
export interface GuideHit {
  guide: GuideLike;
  score: number;
  /** Sorgudaki anlamlı kelimelerin ne kadarını karşıladığı (0–1); yoksa 1 sayılır */
  coverage?: number;
}

/** Zayıf ya da sorgunun yalnızca bir kısmına değen eşleşmeler kaynak sayılmaz. */
export function isRelevantGuide(h: GuideHit): boolean {
  if (h.score >= STRONG_GUIDE_SCORE) return true;
  return h.score >= MIN_GUIDE_SCORE && (h.coverage ?? 1) >= MIN_GUIDE_COVERAGE;
}
export interface LibrarySnippet {
  title: string;
  path: string;
  text: string;
  /** kaynak paketin adı (Vikipedi, WikiMed, …) */
  label?: string;
}
export interface RagDeps {
  searchGuides(query: string, limit: number): GuideHit[] | Promise<GuideHit[]>;
  guideToText(guide: GuideLike): string;
  searchLibraryForContext(query: string, maxArticles?: number, maxChars?: number): Promise<LibrarySnippet[]>;
}

/** Gerçek modülleri tembel yükler (testlerde deps doğrudan verilir). */
let depsPromise: Promise<RagDeps> | null = null;
export function defaultDeps(): Promise<RagDeps> {
  depsPromise ??= (async () => {
    // Biri yüklenemezse diğeri yine kullanılsın
    const [g, lib] = await Promise.all([
      import('../guides-search').catch(() => null),
      import('../library').catch(() => null),
    ]);
    return {
      searchGuides: (g?.searchGuides ?? (() => [])) as RagDeps['searchGuides'],
      guideToText: (g?.guideToText ?? (() => '')) as RagDeps['guideToText'],
      searchLibraryForContext: (lib?.searchLibraryForContext ?? (async () => [])) as RagDeps['searchLibraryForContext'],
    };
  })();
  return depsPromise;
}

// --- Türler -------------------------------------------------------------------
export type SourceKind = 'rehber' | 'vikipedi' | 'baglam';
export interface FenerSource {
  /** KAYNAKLAR bloğundaki numara (1'den başlar) */
  n: number;
  kind: SourceKind;
  title: string;
  /** rehber kimliği */
  id?: string;
  /** Vikipedi makale yolu */
  path?: string;
  /** kütüphane kaynağının adı (Vikipedi, WikiMed, …) */
  label?: string;
}
export interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export interface PendingContext {
  title: string;
  text: string;
  source: string;
}
export interface Retrieval {
  query: string;
  guides: GuideHit[];
  articles: LibrarySnippet[];
  context?: PendingContext;
  critical: boolean;
  topGuideId: string | null;
  /** guideToText ile hazırlanmış rehber metinleri (id → metin) */
  guideTexts?: Record<string, string>;
}
export interface BuiltPrompt {
  messages: ChatMsg[];
  sources: FenerSource[];
  critical: boolean;
  topGuideId: string | null;
  /** KAYNAKLAR bloğunun karakter uzunluğu */
  contextChars: number;
  /** Kaynaksız (serbest) modda mı kuruldu */
  free: boolean;
}

// --- Sabitler -----------------------------------------------------------------
export const SYSTEM_PROMPT = [
  "Sen Fener'sin, Akıl Çantası uygulamasının çevrimdışı yardımcısısın.",
  'Kısa, sakin, net cevap ver. Gerekirse numaralı kısa adımlar kullan.',
  "Soru KAYNAKLAR'la ilgiliyse KAYNAKLAR'a dayan ve kaynağın numarasını köşeli parantezle belirt, örneğin [1].",
  "KAYNAKLAR soruyla ilgili değilse onları yok say ve kendi genel bilginle kısa, temkinli cevap ver; emin olmadığın yeri belirt.",
  'Tıbbi doz/ilaç önerme.',
  "Hayati durumda (nefes yok, bilinç kapalı, ağır kanama, boğulma, zehirlenme, ağır yanık) önce 112'yi aramasını söyle.",
  'Türkçe yanıt ver.',
].join(' ');

/** Kaynaksız (serbest) mod: kullanıcı "Fener kendi bilgisiyle cevaplasın" dediğinde ya da hiç kaynak bulunamadığında. */
export const SYSTEM_PROMPT_FREE = [
  "Sen Fener'sin, Akıl Çantası uygulamasının çevrimdışı yardımcısısın. İnternet ve kaynak yok; kendi genel bilginle cevap ver.",
  'Kısa, sakin, net cevap ver. Gerekirse numaralı kısa adımlar kullan.',
  'Emin olmadığın şeyi uydurma; bilmiyorsan söyle.',
  'Tıbbi doz/ilaç önerme.',
  "Hayati durumda (nefes yok, bilinç kapalı, ağır kanama, boğulma, zehirlenme, ağır yanık) önce 112'yi aramasını söyle.",
  'Türkçe yanıt ver.',
].join(' ');

/**
 * Büyük modeller (≥1,2B) için biraz daha ayrıntılı istem. 0,5B gibi küçük modeller
 * uzun kural listelerini izleyemediği için onlarda kısa SYSTEM_PROMPT kullanılır.
 */
export const SYSTEM_PROMPT_RICH = [
  "Sen Fener'sin, Akıl Çantası adlı çevrimdışı afet bilgi uygulamasının yardımcısısın. Afet ve acil durumlarda insanlara sakin, açık ve uygulanabilir bilgi verirsin.",
  'Kurallar:',
  '- Önce hemen yapılması gereken en önemli şeyi söyle; sonra gerekirse 3–7 numaralı kısa adım ver.',
  "- Soru KAYNAKLAR'la ilgiliyse KAYNAKLAR'daki bilgiye dayan ve bilginin sonuna kaynağın numarasını köşeli parantezle yaz, örneğin [1]. KAYNAKLAR'da olmayan ayrıntı uydurma.",
  "- KAYNAKLAR soruyla ilgili değilse onları yok say; kendi genel bilginle kısa ve temkinli cevap ver, emin olmadığın yeri açıkça belirt.",
  '- İlaç adı ya da doz önerme; tıbbi konularda mümkün olunca bir sağlık çalışanına danışılmasını hatırlat.',
  "- Hayati durumda (nefes yok, bilinç kapalı, ağır kanama, boğulma, zehirlenme, ağır yanık, göğüs ağrısı) cevaba 112'yi aramasını söyleyerek başla.",
  '- Giriş cümlesi, tekrar ve gereksiz uzun açıklama yapma.',
  '- Her zaman düzgün Türkçe ile, Türkçe karakterleri doğru kullanarak yanıt ver.',
].join('\n');

export const SYSTEM_PROMPT_FREE_RICH = [
  "Sen Fener'sin, Akıl Çantası adlı çevrimdışı afet bilgi uygulamasının yardımcısısın. İnternet ve kaynak yok; kendi genel bilginle cevap veriyorsun.",
  'Kurallar:',
  '- Kısa, sakin ve net cevap ver; gerekirse numaralı kısa adımlar kullan.',
  '- Emin olmadığın şeyi uydurma; bilmiyorsan ya da emin değilsen bunu açıkça söyle.',
  '- İlaç adı ya da doz önerme.',
  "- Hayati durumda (nefes yok, bilinç kapalı, ağır kanama, boğulma, zehirlenme, ağır yanık, göğüs ağrısı) önce 112'yi aramasını söyle.",
  '- Her zaman düzgün Türkçe ile yanıt ver.',
].join('\n');

/** Bir rehberin kaynak sayılması için asgari puan ve sorgu kapsamı */
export const MIN_GUIDE_SCORE = 8;
export const MIN_GUIDE_COVERAGE = 0.5;
export const STRONG_GUIDE_SCORE = 20;

/** Hayati durum anahtar sözcükleri (aksansız, küçük harf; kök biçiminde) */
export const EMERGENCY_PATTERNS: RegExp[] = [
  /nefes al(m|am)iyor/,
  /nefes(i)? (yok|durdu|kesildi)/,
  /solunum/,
  /bilinc/,
  /bayil/,
  /kendine gelmiyor/,
  /tepki vermiyor/,
  /kanama/,
  /kaniyor/,
  /kan kayb/,
  /bogul/,
  /kalp/,
  /zehir/,
  /yanik/,
  /yandi/,
  /elektrik carp/,
  /carpildi/,
  /nobet/,
  /havale/,
  /gogus agri/,
  /felc/,
  /intihar/,
  /enkaz altinda/,
  /sikisti/,
  /hipotermi/,
  /donuyor/,
  /alerji(k)? (sok|reaksiyon)/,
  /anafilaksi/,
  /karbonmonoksit|karbon monoksit/,
];

/** Türkçe duyarlı küçük harf + aksan kaldırma (arama/eşleştirme için). */
export function normalizeTr(s: string): string {
  return s
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesEmergency(text: string): boolean {
  const n = normalizeTr(text);
  return EMERGENCY_PATTERNS.some((re) => re.test(n));
}

/** Metni sınır içinde, mümkünse cümle/kelime sonunda keser. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\n{3,}/g, '\n\n').trim();
  if (t.length <= max) return t;
  if (max <= 1) return '';
  const cut = t.slice(0, max - 1);
  const dot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'), cut.lastIndexOf('\n'));
  if (dot > max * 0.6) return cut.slice(0, dot + 1).trim() + '…';
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).trim() + '…';
}

// --- Arama ----------------------------------------------------------------------
/** Soru kalıbı sözcükleri (aksansız): aramada anlam taşımaz, ilgisiz eşleşme üretir. */
const FILLER = new Set([
  'hakkinda', 'kisaca', 'bilgi', 'verir', 'verirmisin', 'verebilir', 'misin', 'misiniz', 'musun', 'musunuz',
  'anlatir', 'anlatirmisin', 'anlatabilir', 'aciklar', 'aciklayabilir', 'soyler', 'soyleyebilir', 'lutfen',
]);

/** Arama sorgusu: soru kalıbı sözcükleri atılmış soru. Hepsi atılırsa soru olduğu gibi döner. */
export function searchQuery(q: string): string {
  const kept = q.split(/\s+/).filter((w) => {
    const n = normalizeTr(w).replace(/[^a-z0-9]/g, '');
    return !n || !FILLER.has(n);
  });
  const out = kept.join(' ').trim();
  return /[\p{L}\p{N}]/u.test(out) ? out : q;
}

export interface RetrieveOptions {
  context?: PendingContext | null;
  maxGuides?: number;
  maxArticles?: number;
  /** Vikipedi makalesi başına karakter (varsayılan 1600) */
  articleChars?: number;
  deps?: RagDeps;
}

/**
 * Rehber ve kütüphanede arar. Kütüphane yoksa / hata verirse sessizce boş döner;
 * rehber araması da başarısız olursa yine boş döner (Fener yine de cevap verir).
 */
export async function retrieve(query: string, opts: RetrieveOptions = {}): Promise<Retrieval> {
  const maxGuides = opts.maxGuides ?? 3;
  const maxArticles = opts.maxArticles ?? 2;
  let deps = opts.deps;
  if (!deps) {
    try {
      deps = await defaultDeps();
    } catch {
      deps = undefined;
    }
  }
  // Ek bağlam (ör. haritada seçilen yer) aramaya da katkı sağlar. Sohbet dolgusu
  // ("hakkında kısaca bilgi verir misin") aramadan çıkarılır; yoksa "Çocukla afet
  // hakkında konuşmak" gibi ilgisiz rehberler asıl konunun önüne geçer.
  const core = searchQuery(query);
  const searchText = opts.context ? `${core} ${opts.context.title}`.trim() : core;

  let guides: GuideHit[] = [];
  let articles: LibrarySnippet[] = [];
  if (deps) {
    try {
      guides = (await deps.searchGuides(searchText, maxGuides)) ?? [];
    } catch {
      guides = [];
    }
    guides = guides.filter((h) => h && h.guide && h.score > 0 && isRelevantGuide(h)).slice(0, maxGuides);
    // İlkine göre çok zayıf eşleşmeler bağlamı kirletmesin
    const best = guides[0]?.score ?? 0;
    guides = guides.filter((h, i) => i === 0 || h.score >= best * 0.5);
    try {
      articles = (await deps.searchLibraryForContext(core, maxArticles, opts.articleChars ?? 1600)) ?? [];
    } catch {
      articles = [];
    }
    articles = articles.filter((a) => a && a.text).slice(0, maxArticles);
  }

  const top = guides[0];
  // "Kritik" sayılan rehber: ilk sıradaki, ya da ilkine yakın puanlı olanlardan biri
  const strongCritical = guides.some(
    (h, i) => (h.guide.critical || h.guide.callEmergency) && (i === 0 || (top && h.score >= top.score * 0.75)),
  );
  const critical = strongCritical || matchesEmergency(query);
  const guideTexts: Record<string, string> = {};
  for (const h of guides) guideTexts[h.guide.id] = guideText(deps, h.guide);
  return {
    guideTexts,
    query,
    guides,
    articles,
    context: opts.context ?? undefined,
    critical,
    topGuideId: top ? top.guide.id : null,
  };
}

// --- İstem kurulumu -----------------------------------------------------------------
export interface BuildOptions {
  /** Önceki konuşma (eskiden yeniye). Son birkaç tur kısaltılarak eklenir. */
  history?: ChatMsg[];
  /** KAYNAKLAR bloğu için azami karakter (n_ctx'e sığacak şekilde) */
  maxContextChars?: number;
  /** Geçmiş için azami karakter */
  maxHistoryChars?: number;
  /** Kaynak verme; model kendi bilgisiyle cevaplasın */
  free?: boolean;
  /** Büyük modeller için ayrıntılı sistem istemi */
  rich?: boolean;
}

/**
 * n_ctx'ten bağlam bütçesi: sistem istemi (~250 token) + cevap + geçmiş payı
 * düşüldükten sonra kalan token × ~2,6 karakter (Türkçe, küçük modeller).
 */
export function contextBudget(nCtx = 2048, maxTokens = 384, historyChars = 600): number {
  const tokens = nCtx - maxTokens - 260 - Math.ceil(historyChars / 2.6) - 64;
  return Math.max(600, Math.floor(tokens * 2.6));
}

function guideText(deps: RagDeps | undefined, g: GuideLike): string {
  if (deps) {
    try {
      const t = deps.guideToText(g);
      if (t) return t;
    } catch {}
  }
  const steps = (g.steps ?? []).map((s, i) => `${i + 1}. ${stepToText(s)}`).join('\n');
  return [g.title, g.summary, steps].filter(Boolean).join('\n');
}

export function stepToText(s: unknown): string {
  if (typeof s === 'string') return s;
  if (s && typeof s === 'object') {
    const o = s as Record<string, unknown>;
    const parts = [o.title, o.text, o.body, o.detail].filter((x) => typeof x === 'string') as string[];
    if (parts.length) return parts.join(' — ');
  }
  return String(s ?? '');
}

/** Hazır bir arama sonucundan model mesajlarını kurar (senkron, test edilebilir). */
export function assemblePrompt(r: Retrieval, opts: BuildOptions = {}): BuiltPrompt {
  const budget = opts.maxContextChars ?? contextBudget();
  // Serbest mod: kaynak verilmez, model kendi bilgisiyle cevaplar
  const free = !!opts.free || (!r.guides.length && !r.articles.length && !(r.context && r.context.text));

  type Block = { kind: SourceKind; title: string; id?: string; path?: string; label?: string; text: string; weight: number };
  const blocks: Block[] = [];
  if (!free && r.context && r.context.text) {
    blocks.push({
      kind: 'baglam',
      title: r.context.title || r.context.source || 'Bağlam',
      text: r.context.text,
      weight: 1.2,
    });
  }
  for (const h of free ? [] : r.guides) {
    blocks.push({ kind: 'rehber', title: h.guide.title, id: h.guide.id, text: r.guideTexts?.[h.guide.id] ?? guideText(undefined, h.guide), weight: 1.5 });
  }
  for (const a of free ? [] : r.articles) {
    blocks.push({ kind: 'vikipedi', title: a.title, path: a.path, label: a.label, text: a.text, weight: 1 });
  }

  // Bütçeyi ağırlığa göre paylaştır; kısa bloklardan artanı diğerlerine aktar
  const header = (n: number, b: Block) =>
    `[${n}] ${b.kind === 'rehber' ? 'Rehber' : b.kind === 'vikipedi' ? b.label || 'Vikipedi' : 'Bağlam'}: ${b.title}\n`;
  const overhead = blocks.reduce((s, b, i) => s + header(i + 1, b).length + 2, 0);
  let remaining = Math.max(0, budget - overhead);
  const alloc = new Array(blocks.length).fill(0);
  let open = blocks.map((_, i) => i);
  while (open.length && remaining > 0) {
    const wsum = open.reduce((s, i) => s + blocks[i].weight, 0);
    let used = 0;
    const next: number[] = [];
    for (const i of open) {
      const share = Math.floor((remaining * blocks[i].weight) / wsum);
      const need = blocks[i].text.length - alloc[i];
      const give = Math.min(share, need);
      alloc[i] += give;
      used += give;
      if (alloc[i] < blocks[i].text.length) next.push(i);
    }
    remaining -= used;
    if (used === 0) break;
    open = next;
  }

  const sources: FenerSource[] = [];
  const parts: string[] = [];
  let n = 0;
  blocks.forEach((b, i) => {
    const body = clip(b.text, alloc[i]);
    if (body.length < 40 && b.text.length >= 40) return; // sığmadı
    n++;
    parts.push(header(n, b) + body);
    sources.push({ n, kind: b.kind, title: b.title, id: b.id, path: b.path, label: b.label });
  });
  const ctx = parts.join('\n\n');

  // Geçmiş: son turlar, kısaltılmış
  const maxHist = opts.maxHistoryChars ?? 600;
  const hist: ChatMsg[] = [];
  let hchars = 0;
  for (const m of [...(opts.history ?? [])].reverse()) {
    if (m.role === 'system') continue;
    const c = clip(m.content, 300);
    if (hchars + c.length > maxHist) break;
    hchars += c.length;
    hist.unshift({ role: m.role, content: c });
  }
  // Geçmiş asistanla başlamasın (bazı sohbet şablonları user/assistant sırası ister)
  while (hist.length && hist[0].role !== 'user') hist.shift();

  // Serbest modda yalnızca soru gider: küçük modeller ek notlara takılıp konuyu kaçırıyor.
  // Hayati durum uyarısı zaten ekranda 112 kutusuyla gösterilir.
  const userContent = free
    ? r.query
    : (ctx ? `KAYNAKLAR:\n${ctx}\n\n` : '') +
      (r.critical ? "NOT: Hayati durum olabilir; cevaba 112'yi aramasını söyleyerek başla.\n\n" : '') +
      `SORU: ${r.query}`;

  return {
    free,
    messages: [
      { role: 'system', content: opts.rich ? (free ? SYSTEM_PROMPT_FREE_RICH : SYSTEM_PROMPT_RICH) : free ? SYSTEM_PROMPT_FREE : SYSTEM_PROMPT },
      ...hist,
      { role: 'user', content: userContent },
    ],
    sources,
    critical: r.critical,
    topGuideId: r.topGuideId,
    contextChars: ctx.length,
  };
}

/** Arama + istem kurulumu tek adımda. */
export async function buildPrompt(
  query: string,
  opts: BuildOptions & { context?: PendingContext | null; deps?: RagDeps } = {},
): Promise<BuiltPrompt & { retrieval: Retrieval }> {
  const retrieval = await retrieve(query, { context: opts.context, deps: opts.deps });
  return { ...assemblePrompt(retrieval, opts), retrieval };
}

/**
 * Küçük modeller bazen istemdeki iskeleti ("KAYNAKLAR:", "[1] Rehber: …",
 * "SORU: …") cevabın başına kopyalar. Bu satırları atar; asıl metni korur.
 */
export function cleanAnswer(text: string): string {
  text = stripThinking(text);
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (l === '' || /^KAYNAKLAR\s*:/i.test(l) || /^SORU\s*:/i.test(l) || /^NOT\s*:\s*Hayati/i.test(l) || /^\[\d+\]\s*(Rehber|Vikipedi|Kaynak)\s*:/i.test(l)) {
      i++;
      continue;
    }
    break;
  }
  // Rehber başlığından kopyalanan "[DEPREM]" gibi etiketler
  return lines.slice(i).join('\n').replace(/[ \t]+\[[A-ZÇĞİÖŞÜ ]{3,}\][ \t]*$/gm, '');
}

/**
 * "Düşünen" modellerin (Qwen3/Qwen3.5: <think>…</think>, Gemma 4: <|channel>thought…<channel|>)
 * düşünme bölümünü atar. Akış sırasında kapanmamış bir düşünme bölümü varsa o ana
 * kadarki kısım gizlenir (boş döner).
 */
export function stripThinking(text: string): string {
  let t = text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').replace(/<\|channel>thought[\s\S]*?<channel\|>\s*/g, '');
  const open = t.search(/<think>|<\|channel>thought/);
  if (open >= 0) t = t.slice(0, open);
  // Kapanış etiketi tek başına kaldıysa (açılış şablonda verildiyse) öncesini at
  const close = t.lastIndexOf('</think>');
  if (close >= 0) t = t.slice(close + '</think>'.length);
  return t.replace(/^\s+/, '');
}
