// Sürdürülebilir (resumable) indirme çekirdeği — DOM'a bağımlı değildir.
// Tarayıcıda download-worker.ts içinde OPFS deposuyla, Node testlerinde bellek
// deposuyla çalışır. Akış:
//   1) .part dosyasında ne kadar veri varsa oradan devam (Range: bytes=N-)
//   2) sha256 verilmişse önce mevcut parça baştan okunup özet durumuna eklenir
//   3) aynalar sırayla denenir; bağlantı koparsa aynı aynadan, olmazsa sıradakinden
//   4) bitince boyut + sha256 kontrolü, sonra .part → asıl dosya

export interface PartStore {
  size(): Promise<number>;
  read(offset: number, length: number): Promise<Uint8Array>;
  write(offset: number, data: Uint8Array): Promise<void>;
  truncate(size: number): Promise<void>;
  flush(): Promise<void>;
  /** .part dosyasını asıl adına taşır */
  finalize(): Promise<void>;
  /** .part dosyasını siler */
  remove(): Promise<void>;
  close?(): Promise<void>;
}

export interface Hasher {
  update(data: Uint8Array): void;
  digest(): string;
}

export type DownloadErrorCode = 'aborted' | 'network' | 'http' | 'hash' | 'size' | 'space' | 'storage';

export class DownloadError extends Error {
  constructor(readonly code: DownloadErrorCode, message: string) {
    super(message);
    this.name = 'DownloadError';
  }
}

export type Phase = 'hashing' | 'downloading' | 'verifying';

export interface Progress {
  phase: Phase;
  received: number;
  /** 0 = bilinmiyor */
  total: number;
  mirror: number;
}

export interface RunOptions {
  urls: string[];
  store: PartStore;
  /** Kesin bilinen boyut (yaklaşık değilse). 0/undefined = bilinmiyor */
  expectedSize?: number;
  sha256?: string;
  fetch?: typeof fetch;
  signal?: AbortSignal;
  createHasher?: () => Promise<Hasher>;
  onProgress?: (p: Progress) => void;
  /** İlk denenecek ayna (önceki oturumda çalışan) */
  startMirror?: number;
  /** Tüm aynaların kaç tur deneneceği */
  passes?: number;
  /** Diske yazmadan önce biriktirilecek bayt */
  chunkBytes?: number;
  /** Turlar arası bekleme (ms) */
  backoffMs?: number;
  /** İlerleme bildirim aralığı (ms) */
  progressMs?: number;
  /** Bu kadar süre hiç veri gelmezse bağlantı takılmış sayılır ve yenilenir (ms) */
  stallMs?: number;
}

export interface RunResult {
  size: number;
  sha256: string | null;
  mirror: number;
}

/** Range başlığı; baştan indirmede başlık gönderilmez. */
export function buildRangeHeader(offset: number): Record<string, string> {
  return offset > 0 ? { Range: `bytes=${offset}-` } : {};
}

/** "bytes 100-199/1000" → {start:100,end:199,total:1000}; total "*" → 0 */
export function parseContentRange(v: string | null): { start: number; end: number; total: number } | null {
  if (!v) return null;
  const m = /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(v.trim());
  if (!m) return null;
  return { start: Number(m[1]), end: Number(m[2]), total: m[3] === '*' ? 0 : Number(m[3]) };
}

export type ResponsePlan =
  | { action: 'append'; total: number }
  | { action: 'restart'; total: number }
  | { action: 'complete'; total: number }
  | { action: 'retry-from-zero' }
  | { action: 'fail'; reason: string };

/** Sunucu yanıtını yorumlar: devam mı, baştan mı, bitti mi, başka aynaya mı. */
export function planResponse(
  status: number,
  headers: { get(name: string): string | null },
  offset: number,
  knownTotal = 0,
): ResponsePlan {
  const len = Number(headers.get('content-length') ?? '') || 0;
  if (status === 206) {
    const cr = parseContentRange(headers.get('content-range'));
    if (cr && cr.start !== offset) return { action: 'fail', reason: `beklenmeyen aralık ${cr.start}` };
    const total = cr?.total || (len ? offset + len : knownTotal);
    return { action: 'append', total };
  }
  if (status === 200) {
    return offset > 0 ? { action: 'restart', total: len || knownTotal } : { action: 'append', total: len || knownTotal };
  }
  if (status === 416) {
    const cr = /\/(\d+)$/.exec(headers.get('content-range') ?? '');
    const total = cr ? Number(cr[1]) : knownTotal;
    if (total && offset === total) return { action: 'complete', total };
    // Baştan (Range'siz) istekte 416 anlamsız: yeniden denemek sonsuz döngü olurdu
    if (offset === 0) return { action: 'fail', reason: 'HTTP 416' };
    return { action: 'retry-from-zero' };
  }
  return { action: 'fail', reason: `HTTP ${status}` };
}

/** startMirror'dan başlayarak aynaların deneme sırası. */
export function mirrorOrder(count: number, start = 0): number[] {
  if (count <= 0) return [];
  const s = ((start % count) + count) % count;
  return Array.from({ length: count }, (_, i) => (s + i) % count);
}

export function isAbort(e: unknown, signal?: AbortSignal) {
  return !!signal?.aborted || (e as any)?.name === 'AbortError' || (e as any)?.code === 'aborted';
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((res, rej) => {
    if (signal?.aborted) return rej(new DownloadError('aborted', 'durduruldu'));
    const t = setTimeout(res, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      rej(new DownloadError('aborted', 'durduruldu'));
    });
  });

export async function runDownload(o: RunOptions): Promise<RunResult> {
  const f = o.fetch ?? fetch;
  const store = o.store;
  const signal = o.signal;
  const chunkBytes = o.chunkBytes ?? 4 * 1024 * 1024;
  const passes = o.passes ?? 3;
  const want = (o.sha256 ?? '').toLowerCase();
  const urls = o.urls.filter(Boolean);
  if (!urls.length) throw new DownloadError('http', 'indirme adresi yok');
  // Katalogda özet varsa doğrulama zorunludur: özetleyici yoksa indirme hiç başlamaz
  if (want && !o.createHasher) throw new DownloadError('hash', 'SHA-256 doğrulayıcı yok');
  const checkAbort = () => {
    if (signal?.aborted) throw new DownloadError('aborted', 'durduruldu');
  };

  let total = o.expectedSize || 0;
  let offset = await store.size();
  let hasher: Hasher | null = null;
  let mirror = mirrorOrder(urls.length, o.startMirror)[0];
  const report = (phase: Phase) => o.onProgress?.({ phase, received: offset, total, mirror });

  const newHasher = async () => (want && o.createHasher ? await o.createHasher() : null);

  // Devam ediliyorsa: mevcut parçayı baştan okuyup özet durumunu kur
  hasher = await newHasher();
  if (hasher && offset > 0) {
    let pos = 0;
    while (pos < offset) {
      checkAbort();
      const part = await store.read(pos, Math.min(chunkBytes, offset - pos));
      if (!part.length) break;
      hasher.update(part);
      pos += part.length;
      o.onProgress?.({ phase: 'hashing', received: pos, total: offset, mirror });
    }
  }

  const restart = async () => {
    await store.truncate(0);
    offset = 0;
    hasher = await newHasher();
  };

  // Daha önce tamamlanmış ama taşınamamış parça
  if (total && offset > total) await restart();

  let done = false;
  let lastError: DownloadError | null = null;
  /** Bir ayna beklenenden fazla veri gönderdi: yarım dosyaya güvenilmez */
  let fazlaVeri = false;
  outer: for (let pass = 0; pass < passes && !done; pass++) {
    if (pass > 0) await sleep((o.backoffMs ?? 1000) * pass, signal);
    for (const mi of mirrorOrder(urls.length, mirror)) {
      // Aynı aynayı, ilerleme oldukça (bağlantı kopması) yeniden dene
      for (let attempt = 0; attempt < 50; attempt++) {
        checkAbort();
        mirror = mi;
        const before = offset;
        try {
          const finished = await attemptOnce(urls[mi]);
          if (finished) {
            done = true;
            break outer;
          }
        } catch (e) {
          if (isAbort(e, signal)) {
            await store.flush().catch(() => {});
            throw new DownloadError('aborted', 'durduruldu');
          }
          lastError = e instanceof DownloadError ? e : new DownloadError('network', (e as Error)?.message || 'bağlantı hatası');
          if (lastError.code === 'storage' || lastError.code === 'space') throw lastError;
        }
        if (offset <= before) break; // ilerleme yok → sıradaki ayna
      }
    }
  }
  if (!done) {
    // Fazla veri gönderen aynadan sonra yarım dosya güvenilmez: silinir; işçi de alınan miktarı
    // 0 bildirir. Yalnız başlıktaki boyut farklıysa (eski sürümlü ayna) hiçbir şey yazılmamıştır:
    // başka aynadan alınmış yarım dosya korunur, sonraki denemede kaldığı yerden sürer.
    if (fazlaVeri) await store.remove().catch(() => {});
    throw lastError ?? new DownloadError('network', 'hiçbir kaynağa ulaşılamadı');
  }

  report('verifying');
  const size = await store.size();
  if (total && size !== total) {
    await store.remove().catch(() => {});
    throw new DownloadError('size', `boyut uyuşmuyor (${size} / ${total})`);
  }
  let digest: string | null = null;
  if (hasher) {
    digest = (hasher as Hasher).digest().toLowerCase();
    if (digest !== want) {
      await store.remove().catch(() => {});
      throw new DownloadError('hash', 'SHA-256 doğrulaması başarısız — dosya silindi');
    }
  }
  await store.flush();
  await store.finalize();
  return { size, sha256: digest, mirror };

  async function attemptOnce(url: string): Promise<boolean> {
    let res: Response;
    try {
      res = await f(url, { headers: buildRangeHeader(offset), signal, cache: 'no-store' } as RequestInit);
    } catch (e) {
      if (isAbort(e, signal)) throw e;
      throw new DownloadError('network', 'bağlantı kurulamadı');
    }
    let plan = planResponse(res.status, res.headers, offset, total);
    if (plan.action === 'retry-from-zero') {
      res.body?.cancel().catch(() => {});
      await restart();
      return attemptOnce(url);
    }
    if (plan.action === 'fail') {
      res.body?.cancel().catch(() => {});
      throw new DownloadError('http', plan.reason);
    }
    if (plan.action === 'restart') await restart();
    if (plan.total) {
      if (o.expectedSize && plan.total !== o.expectedSize) {
        res.body?.cancel().catch(() => {});
        throw new DownloadError('size', `sunucudaki dosya boyutu farklı (${plan.total})`);
      }
      total = plan.total;
    }
    if (plan.action === 'complete') return true;
    if (!res.body) throw new DownloadError('network', 'yanıt gövdesi yok');

    const reader = res.body.getReader();
    const stallMs = o.stallMs ?? 30_000;
    // Takılan bağlantıyı algıla: veri gelmezse okumayı iptal et, aynı yerden yeniden bağlan
    const readWithTimeout = () =>
      new Promise<ReadableStreamReadResult<Uint8Array>>((resolve, reject) => {
        const t = setTimeout(() => {
          reader.cancel().catch(() => {});
          reject(new DownloadError('network', 'bağlantı takıldı'));
        }, stallMs);
        reader.read().then(
          (v) => {
            clearTimeout(t);
            resolve(v);
          },
          (e) => {
            clearTimeout(t);
            reject(e);
          },
        );
      });
    const buf: Uint8Array[] = [];
    let buffered = 0;
    let lastReport = 0;
    const flushBuf = async () => {
      if (!buffered) return;
      const data = buf.length === 1 ? buf[0] : concat(buf, buffered);
      buf.length = 0;
      buffered = 0;
      try {
        await store.write(offset, data);
      } catch (e) {
        const msg = (e as Error)?.message ?? '';
        const quota = (e as any)?.name === 'QuotaExceededError' || /quota/i.test(msg);
        throw new DownloadError(quota ? 'space' : 'storage', quota ? 'cihazda yer kalmadı' : 'dosyaya yazılamadı: ' + msg);
      }
      hasher?.update(data);
      offset += data.length;
    };
    try {
      for (;;) {
        const { done: end, value } = await readWithTimeout();
        if (end) break;
        if (signal?.aborted) throw new DownloadError('aborted', 'durduruldu');
        buf.push(value);
        buffered += value.length;
        // Bilinen boyuttan fazlası gelirse (bozuk/kötü niyetli ayna) diski doldurmadan dur
        if (total && offset + buffered > total) {
          reader.cancel().catch(() => {});
          buf.length = 0;
          buffered = 0;
          fazlaVeri = true;
          throw new DownloadError('size', 'sunucu beklenenden fazla veri gönderdi');
        }
        if (buffered >= chunkBytes) await flushBuf();
        // Yavaş bağlantıda da ilerleme görünsün: tampondaki baytlar dahil düzenli bildir
        const now = Date.now();
        if (now - lastReport >= (o.progressMs ?? 200)) {
          lastReport = now;
          o.onProgress?.({ phase: 'downloading', received: offset + buffered, total, mirror });
        }
      }
      await flushBuf();
    } catch (e) {
      // Alınan kısmı kaybetme: önce tamponu yaz
      try {
        await flushBuf();
        await store.flush();
      } catch {}
      if (e instanceof DownloadError) throw e;
      if (isAbort(e, signal)) throw new DownloadError('aborted', 'durduruldu');
      throw new DownloadError('network', 'bağlantı koptu');
    }
    await store.flush();
    report('downloading');
    if (total && offset < total) throw new DownloadError('network', 'bağlantı erken kapandı');
    return true;
  }
}

function concat(parts: Uint8Array[], len: number) {
  const out = new Uint8Array(len);
  let p = 0;
  for (const x of parts) {
    out.set(x, p);
    p += x.length;
  }
  return out;
}

/** Bellek deposu: Node testleri ve geri dönüş. */
export class MemoryStore implements PartStore {
  data = new Uint8Array(0);
  len = 0;
  finalized = false;
  removed = false;
  async size() {
    return this.len;
  }
  async read(offset: number, length: number) {
    return this.data.slice(offset, Math.min(this.len, offset + length));
  }
  async write(offset: number, d: Uint8Array) {
    const need = offset + d.length;
    if (need > this.data.length) {
      const n = new Uint8Array(Math.max(need, this.data.length * 2));
      n.set(this.data.subarray(0, this.len));
      this.data = n;
    }
    this.data.set(d, offset);
    this.len = Math.max(this.len, need);
  }
  async truncate(n: number) {
    this.len = Math.min(this.len, n);
  }
  async flush() {}
  async finalize() {
    this.finalized = true;
  }
  async remove() {
    this.removed = true;
    this.len = 0;
  }
  bytes() {
    return this.data.slice(0, this.len);
  }
}
