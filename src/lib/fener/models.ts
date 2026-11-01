// Fener model yönetimi (saf işlevler, test edilebilir):
//  - GGUF paketlerini modellere gruplar (bölünmüş "-00001-of-00003.gguf" dosyaları tek model)
//  - yardımcı GGUF'ları (mmproj görsel kodlayıcı, MTP taslak modeli) model saymaz
//  - cihaz belleğine/çekirdek sayısına göre sığan en büyük modeli seçer
//  - model boyutuna göre istem profili (bağlam uzunluğu, cevap uzunluğu) verir
//
// Tarayıcılar tek bir ArrayBuffer'a ~2 GB'tan büyük dosya alamaz; wllama bu yüzden
// büyük modelleri llama.cpp'nin gguf-split aracıyla bölünmüş parçalar (Blob[]) olarak
// yükler. Bölme talimatı: docs/FENER_MODELLER.md

export interface PackLike {
  id: string;
  size: number;
}

export interface ShardInfo {
  /** Parça ekinden arındırılmış ad ("qwen3.5-4b-q4_k_m") */
  base: string;
  /** 1'den başlar */
  index: number;
  total: number;
}

const SHARD_RE = /^(.+)-(\d{5})-of-(\d{5})\.gguf$/i;

export function parseShard(name: string): ShardInfo | null {
  const m = name.match(SHARD_RE);
  if (!m) return null;
  const index = parseInt(m[2], 10);
  const total = parseInt(m[3], 10);
  if (!(index >= 1 && total >= 1 && index <= total)) return null;
  return { base: m[1], index, total };
}

/** Kendi başına sohbet modeli olmayan GGUF'lar: görsel kodlayıcı (mmproj), MTP/taslak, imatrix. */
export function isAuxGguf(name: string): boolean {
  const n = name.toLowerCase();
  return /(^|[-_.])mmproj([-_.]|$)/.test(n) || /^mtp-/.test(n) || /(^|[-_.])(imatrix|draft)([-_.]|$)/.test(n);
}

export function prettyModelName(id: string): string {
  return id.replace(/\.gguf$/i, '').replace(/-\d{5}-of-\d{5}$/i, '');
}

/** "q4_k_m", "q8_0", "iq4_xs", "bf16" … */
export function quantOf(name: string): string | null {
  const m = name.toLowerCase().match(/(?:^|[-_.])((?:ud-)?(?:i?q\d(?:_[a-z0-9]+)*)|bf16|f16|f32)(?=[-_.]|$)/);
  return m ? m[1].toUpperCase() : null;
}

/**
 * Model parametre sayısı (milyar). Önce dosya adından ("1.5b", "270m", "E2B"),
 * olmazsa dosya boyutundan (~4-5 bit/parametre, Q4 varsayımı) tahmin edilir.
 * Gemma "E2B/E4B" adları etkin parametredir; hız için anlamlı olan da odur.
 */
export function estimateParamsB(pack: PackLike): number {
  const name = pack.id.toLowerCase();
  const m = name.match(/(?:^|[^a-z0-9.])e?(\d+(?:[._]\d+)?)\s*([bm])(?![a-z])/);
  if (m) {
    const v = parseFloat(m[1].replace('_', '.'));
    if (v > 0) return m[2] === 'm' ? v / 1000 : v;
  }
  return pack.size > 0 ? pack.size / 0.6e9 : 0;
}

export interface ModelGroup<P extends PackLike = PackLike> {
  /** Tek dosyada dosya adı; bölünmüşte "<taban>.gguf" */
  id: string;
  name: string;
  /** Mevcut parçaların toplam boyutu */
  size: number;
  /** Sıralı parçalar (tek dosyada 1 eleman) */
  parts: P[];
  /** Beklenen parça sayısı */
  total: number;
  /** Eksik parça numaraları */
  missing: number[];
  complete: boolean;
  split: boolean;
  paramsB: number;
  quant: string | null;
}

/**
 * 2 GiB: tek dosya bunu aşarsa tarayıcıda tek parça yüklenemez. Fener böyle dosyaları
 * yüklerken kendisi sanal parçalara böler (gguf-split.ts); bu yüzden artık engel değildir.
 */
export const SINGLE_FILE_LIMIT = 2 ** 31 - 1;

export function isOversizeSingle(g: Pick<ModelGroup, 'split' | 'size'>): boolean {
  return !g.split && g.size > SINGLE_FILE_LIMIT;
}

export function groupModels<P extends PackLike>(packs: P[]): ModelGroup<P>[] {
  const singles: ModelGroup<P>[] = [];
  const splits = new Map<string, { total: number; parts: Map<number, P> }>();
  for (const p of packs) {
    if (!/\.gguf$/i.test(p.id) || isAuxGguf(p.id)) continue;
    const sh = parseShard(p.id);
    if (!sh) {
      singles.push({
        id: p.id,
        name: prettyModelName(p.id),
        size: p.size,
        parts: [p],
        total: 1,
        missing: [],
        complete: p.size > 0,
        split: false,
        paramsB: estimateParamsB(p),
        quant: quantOf(p.id),
      });
      continue;
    }
    const key = sh.base.toLowerCase() + '|' + sh.total;
    const e = splits.get(key) ?? { total: sh.total, parts: new Map<number, P>() };
    if (!e.parts.has(sh.index)) e.parts.set(sh.index, p);
    splits.set(key, e);
  }
  const grouped: ModelGroup<P>[] = [];
  for (const e of splits.values()) {
    const parts = [...e.parts.entries()].sort((a, b) => a[0] - b[0]).map(([, p]) => p);
    const missing: number[] = [];
    for (let i = 1; i <= e.total; i++) if (!e.parts.has(i)) missing.push(i);
    const base = parseShard(parts[0].id)!.base;
    const size = parts.reduce((s, p) => s + p.size, 0);
    grouped.push({
      id: base + '.gguf',
      name: base,
      size,
      parts,
      total: e.total,
      missing,
      complete: missing.length === 0 && parts.every((p) => p.size > 0),
      split: e.total > 1,
      paramsB: estimateParamsB({ id: base, size }),
      quant: quantOf(base),
    });
  }
  // Aynı kimlikte tek dosya ve bölünmüş kopya varsa tam olanı (yoksa tek dosyayı) tut
  const byId = new Map<string, ModelGroup<P>>();
  for (const g of [...singles, ...grouped]) {
    const prev = byId.get(g.id);
    if (!prev || (!prev.complete && g.complete)) byId.set(g.id, g);
  }
  return [...byId.values()].sort((a, b) => a.size - b.size || a.id.localeCompare(b.id));
}

// --- Cihaz profili ve sığma hesabı ------------------------------------------------------
export interface DeviceProfile {
  /** navigator.deviceMemory (GB; Chrome en fazla 8 bildirir). Bilinmiyorsa null. */
  memGB: number | null;
  cores: number;
}

/** Bellek bilgisi yoksa çekirdek sayısından tahmin (kaba ama temkinli). */
export function effectiveMemGB(p: DeviceProfile): number {
  if (p.memGB != null) return p.memGB;
  if (p.cores <= 4) return 3;
  if (p.cores <= 6) return 4;
  return 8;
}

const GB = 1e9;

/** Modelin çalışırken kaplayacağı yaklaşık bellek (ağırlıklar + KV önbelleği + çalışma alanı). */
export function memoryNeed(sizeBytes: number, nCtx: number): number {
  const kv = nCtx >= 4096 ? 0.3 * GB : 0.15 * GB;
  return sizeBytes * 1.1 + kv + 0.15 * GB;
}

/**
 * Sekmenin modele ayırabileceği bellek. İşletim sistemi, tarayıcı ve diğer uygulamalar
 * da yer kaplar: küçük cihazlarda RAM'in ~%50'si, büyüklerde ~%55'i.
 * (Chrome deviceMemory'yi 8 GB'ta keser; 8 bildiren bilgisayar daha fazlasına sahip olabilir.)
 */
export function memoryBudget(p: DeviceProfile): number {
  const mem = effectiveMemGB(p);
  return mem * GB * (mem <= 4 ? 0.5 : 0.55);
}

/** Az çekirdekli cihazda büyük model dakikalarca sürer: 4 çekirdeğe kadar ≤2,5B. */
export function maxParamsForCores(cores: number): number {
  if (cores <= 2) return 1.0;
  if (cores <= 4) return 2.5;
  return Infinity;
}

export type Fit = 'ok' | 'heavy' | 'slow' | 'incomplete';

export function fitFor(g: ModelGroup, p: DeviceProfile): Fit {
  if (!g.complete) return 'incomplete';
  if (memoryNeed(g.size, promptProfile(g.paramsB).nCtx) > memoryBudget(p)) return 'heavy';
  if (g.paramsB > maxParamsForCores(p.cores)) return 'slow';
  return 'ok';
}

export const FIT_LABEL: Record<Fit, string> = {
  ok: 'Bu cihaza uygun',
  heavy: 'Bu cihazın belleğine ağır gelebilir',
  slow: 'Bu cihazda yavaş çalışır',
  incomplete: 'Eksik parça var',
};

/**
 * Model seçimi:
 *  1) elle seçilen (overrideId) tam bir modelse o;
 *  2) yoksa cihaza sığan (bellek + çekirdek) en büyük model;
 *  3) hiçbiri sığmıyorsa en küçük tam model.
 */
export function chooseModel<P extends PackLike>(
  groups: ModelGroup<P>[],
  profile: DeviceProfile,
  overrideId?: string | null,
): ModelGroup<P> | null {
  const usable = groups.filter((g) => g.complete);
  if (!usable.length) return null;
  if (overrideId) {
    const o = usable.find((g) => g.id === overrideId);
    if (o) return o;
  }
  const bySize = [...usable].sort((a, b) => a.size - b.size || a.id.localeCompare(b.id));
  const fits = bySize.filter((g) => fitFor(g, profile) === 'ok');
  if (fits.length) return fits[fits.length - 1];
  return bySize[0];
}

// --- İstem profili ----------------------------------------------------------------------
export type SizeClass = 'small' | 'medium' | 'large';

export interface PromptProfile {
  size: SizeClass;
  /** llama.cpp bağlam uzunluğu (token) */
  nCtx: number;
  /** Cevap için azami token */
  maxTokens: number;
  /** Konuşma geçmişi için azami karakter */
  historyChars: number;
  /** KAYNAKLAR bloğu üst sınırı (karakter); işlemcide uzun istem yavaş işlenir */
  maxContextChars: number;
  maxGuides: number;
  maxArticles: number;
  /** Vikipedi makalesi başına karakter */
  articleChars: number;
  /** Zengin sistem istemi (büyük modeller daha ayrıntılı kuralları izleyebilir) */
  rich: boolean;
  temperature: number;
}

/**
 * <1,2B: mevcut 0,5B davranışı (2048 bağlam, kısa istem).
 * 1,2–3,5B: 4096 bağlam, daha çok kaynak ve geçmiş, zengin istem.
 * >3,5B: aynı, biraz daha uzun cevap ve kaynak.
 */
export function promptProfile(paramsB: number): PromptProfile {
  if (!(paramsB >= 1.2)) {
    return { size: 'small', nCtx: 2048, maxTokens: 384, historyChars: 600, maxContextChars: 0, maxGuides: 3, maxArticles: 2, articleChars: 1600, rich: false, temperature: 0.3 };
  }
  if (paramsB < 3.5) {
    return { size: 'medium', nCtx: 4096, maxTokens: 512, historyChars: 1500, maxContextChars: 5200, maxGuides: 3, maxArticles: 3, articleChars: 2000, rich: true, temperature: 0.4 };
  }
  return { size: 'large', nCtx: 4096, maxTokens: 640, historyChars: 2000, maxContextChars: 6400, maxGuides: 3, maxArticles: 3, articleChars: 2400, rich: true, temperature: 0.5 };
}
