// İndirme yöneticisi (ana iş parçacığı). İndirmeler dosya adıyla anahtarlanır.
// Asıl iş download-worker.ts içinde yapılır; Worker açılamazsa aynı çekirdek
// ana iş parçacığında createWritable deposuyla çalışır.
// Durum localStorage'da ('ac.downloads') tutulur; sayfa yeniden açıldığında
// yarım kalan indirmeler "Duraklatıldı" olarak görünür ve kaldığı yerden sürer.
import { nativePacks, type NativeJob } from './native';
import { useEffect, useState } from 'preact/hooks';
import { DownloadError, runDownload } from './download-core';
import { openWritablePartStore, PART_SUFFIX } from './opfs-store';
import { invalidatePacks } from './packs';
import type { WorkerIn, WorkerOut } from './download-worker';

export type DlStatus = 'downloading' | 'hashing' | 'verifying' | 'paused' | 'error' | 'done';

export interface DlState {
  file: string;
  status: DlStatus;
  received: number;
  /** 0 = bilinmiyor */
  total: number;
  mirror: number;
  error?: string;
  code?: string;
  /** hashing aşamasında: okunan / parça boyutu */
  hashed?: number;
  /** Bayt yerine gösterilecek ilerleme metni (OSM'den oluşturulan paketler) */
  label?: string;
  /** İndirmeyi tarayıcı değil bilgi noktası sunucusu yapıyor (dosya sunucunun data/ klasörüne iner) */
  remote?: boolean;
  /** Bayt/sn (son birkaç saniyenin ortalaması) */
  speed?: number;
}

export interface DownloadRequest {
  file: string;
  urls: string[];
  sha256?: string;
  /** Katalogdaki boyut */
  size?: number;
  /** true ise size tahmindir; doğrulamada kullanılmaz */
  sizeApprox?: boolean;
}

const LS_KEY = 'ac.downloads';
let states: Record<string, DlState> = {};
const listeners = new Set<(s: Record<string, DlState>) => void>();
let lastPersist = 0;

/** Kayıtlı (localStorage) indirme durumunu doğrular: bozuk kayıt arayüzü çökertmesin */
export function restoreState(k: string, v: unknown): DlState | null {
  if (!v || typeof v !== 'object' || !k || k.length > 255 || /[\/\\\u0000-\u001f]/.test(k)) return null;
  const o = v as Record<string, unknown>;
  const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : 0);
  const str = (x: unknown) => (typeof x === 'string' ? x.slice(0, 300) : undefined);
  // Sayfa kapanınca çalışan indirme durur → duraklatılmış say
  const status: DlStatus = o.status === 'error' ? 'error' : 'paused';
  const s: DlState = { file: k, status, received: num(o.received), total: num(o.total), mirror: Math.floor(num(o.mirror)) };
  const error = str(o.error);
  const code = str(o.code);
  const label = str(o.label);
  if (error) s.error = error;
  if (code) s.code = code;
  if (label) s.label = label;
  return s;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      const s = restoreState(k, v);
      if (s) states[k] = s;
    }
  } catch {
    states = {};
  }
}

function persist(force = false) {
  const now = Date.now();
  if (!force && now - lastPersist < 1000) return;
  lastPersist = now;
  try {
    const out: Record<string, DlState> = {};
    for (const [k, v] of Object.entries(states)) if (v.status !== 'done' && !v.remote) out[k] = v;
    localStorage.setItem(LS_KEY, JSON.stringify(out));
  } catch {}
}

function emit() {
  const snap = { ...states };
  listeners.forEach((l) => l(snap));
}

/** Tarayıcı indirmelerinde hız örnekleri: dosya → [zaman, bayt][] */
const speedSamples = new Map<string, [number, number][]>();

function update(file: string, patch: Partial<DlState>, forcePersist = false) {
  const prev = states[file] ?? { file, status: 'paused', received: 0, total: 0, mirror: 0 };
  if (!prev.remote && !patch.remote && patch.received !== undefined) {
    const now = Date.now();
    const list = speedSamples.get(file) ?? [];
    if (patch.status && patch.status !== 'downloading') list.length = 0;
    else {
      list.push([now, patch.received]);
      while (list.length > 2 && now - list[0][0] > 6000) list.shift();
      const [t0, b0] = list[0];
      patch = { ...patch, speed: now - t0 > 1500 ? Math.max(0, ((patch.received - b0) * 1000) / (now - t0)) : prev.speed };
    }
    speedSamples.set(file, list);
  }
  states[file] = { ...prev, ...patch, file };
  persist(forcePersist);
  emit();
}

function drop(file: string) {
  delete states[file];
  persist(true);
  emit();
}

if (typeof localStorage !== 'undefined') load();

export function getDownloads() {
  return states;
}

export function subscribeDownloads(fn: (s: Record<string, DlState>) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useDownloads(): Record<string, DlState> {
  const [s, set] = useState(states);
  useEffect(() => {
    set({ ...states });
    return subscribeDownloads(set);
  }, []);
  return s;
}

export function isActive(s?: DlState) {
  return !!s && (s.status === 'downloading' || s.status === 'hashing' || s.status === 'verifying');
}

// ---- motor: Worker ya da ana iş parçacığı ----

let worker: Worker | null | undefined;
const mainJobs = new Map<string, { ctrl: AbortController; remove: boolean }>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(new URL('./download-worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (ev: MessageEvent<WorkerOut>) => onEngineMessage(ev.data);
    worker.onerror = () => {
      // Worker yüklenemedi: çalışanları hata olarak işaretle, ana iş parçacığına geç
      worker?.terminate();
      worker = null;
      for (const s of Object.values(states)) if (isActive(s)) update(s.file, { status: 'paused' }, true);
    };
  } catch {
    worker = null;
  }
  return worker;
}

function onEngineMessage(m: WorkerOut) {
  const file = m.id;
  if (m.type === 'progress') {
    if (m.phase === 'hashing') update(file, { status: 'hashing', hashed: m.received, mirror: m.mirror });
    else update(file, { status: m.phase === 'verifying' ? 'verifying' : 'downloading', received: m.received, total: m.total || states[file]?.total || 0, mirror: m.mirror });
  } else if (m.type === 'done') {
    update(file, { status: 'done', received: m.size, total: m.size, error: undefined, code: undefined }, true);
    invalidatePacks();
    setTimeout(() => {
      if (states[file]?.status === 'done') drop(file);
    }, 1500);
  } else if (m.type === 'aborted') {
    if (m.removed) drop(file);
    else update(file, { status: 'paused', received: m.received }, true);
  } else if (m.type === 'error') {
    update(file, { status: 'error', error: m.message, code: m.code, received: m.received }, true);
  }
}

async function mainThreadStart(m: Extract<WorkerIn, { type: 'start' }>) {
  const job = { ctrl: new AbortController(), remove: false };
  mainJobs.set(m.id, job);
  let store: Awaited<ReturnType<typeof openWritablePartStore>> | null = null;
  try {
    const { createSHA256 } = await import('hash-wasm');
    store = await openWritablePartStore(m.file);
    const r = await runDownload({
      urls: m.urls,
      store,
      sha256: m.sha256,
      expectedSize: m.expectedSize,
      startMirror: m.startMirror,
      signal: job.ctrl.signal,
      createHasher: async () => {
        const h = await createSHA256();
        h.init();
        return { update: (d) => void h.update(d), digest: () => h.digest('hex') };
      },
      onProgress: (p) => onEngineMessage({ type: 'progress', id: m.id, ...p }),
    });
    onEngineMessage({ type: 'done', id: m.id, size: r.size, sha256: r.sha256, mirror: r.mirror });
  } catch (e) {
    const err = e instanceof DownloadError ? e : new DownloadError('storage', (e as Error)?.message ?? String(e));
    const received = store ? await store.size() : 0;
    if (err.code === 'aborted') {
      if (job.remove) await store?.remove();
      else await store?.close?.();
      onEngineMessage({ type: 'aborted', id: m.id, removed: job.remove, received: job.remove ? 0 : received });
    } else {
      await store?.close?.().catch(() => {});
      onEngineMessage({ type: 'error', id: m.id, code: err.code, message: err.message, received });
    }
  } finally {
    mainJobs.delete(m.id);
  }
}

function send(m: WorkerIn) {
  const w = getWorker();
  if (w) {
    w.postMessage(m);
    return;
  }
  if (m.type === 'start') void mainThreadStart(m);
  else {
    const j = mainJobs.get(m.id);
    if (j) {
      j.remove = !!m.remove;
      j.ctrl.abort();
    }
  }
}

// ---- depolama ----

export interface StorageInfo {
  usage: number;
  quota: number;
  persisted: boolean;
  supported: boolean;
}

export async function storageInfo(): Promise<StorageInfo> {
  const st: any = typeof navigator !== 'undefined' ? navigator.storage : undefined;
  const supported = !!st?.getDirectory;
  let usage = 0;
  let quota = 0;
  let persisted = false;
  try {
    const e = await st?.estimate?.();
    usage = e?.usage ?? 0;
    quota = e?.quota ?? 0;
  } catch {}
  try {
    persisted = !!(await st?.persisted?.());
  } catch {}
  // Android uygulaması: paketler uygulamanın klasörüne iner; boş yer cihazın gerçek boş alanıdır
  if (nativePacks.available()) {
    const [ns, files] = await Promise.all([nativePacks.status(), nativePacks.list()]);
    if (ns && ns.free >= 0) {
      usage += files.reduce((a, f) => a + f.size, 0);
      return { usage, quota: usage + ns.free, persisted: true, supported: true };
    }
  }
  return { usage, quota, persisted, supported };
}

/** Tarayıcıdan kalıcı depolama ister (yer azalınca paketler silinmesin). */
export async function requestPersist(): Promise<boolean> {
  try {
    const st: any = navigator.storage;
    if (await st?.persisted?.()) return true;
    return !!(await st?.persist?.());
  } catch {
    return false;
  }
}

/** Cihaza kayıt mümkün mü? (OPFS güvenli bağlam ister: https ya da localhost) */
export function canSaveToDevice(): boolean {
  return typeof navigator !== 'undefined' && !!(navigator.storage as any)?.getDirectory;
}

// ---- dışa açık işlemler ----

/** "osm:" adresleri indirme değil, cihazda OpenStreetMap'ten oluşturma demektir */
const isBuildUrl = (u: string) => u.startsWith('osm:');
const buildJobs = new Map<string, AbortController>();

async function runBuild(file: string) {
  const ctrl = new AbortController();
  buildJobs.set(file, ctrl);
  update(file, { status: 'downloading', received: 0, total: 0, error: undefined, code: undefined, label: 'OpenStreetMap\'ten noktalar alınıyor…' }, true);
  try {
    const { buildPoiGeoJSON } = await import('./map/poi-build');
    const root0 = await navigator.storage.getDirectory();
    const dir0 = await root0.getDirectoryHandle('packs', { create: true });
    const cpName = file + '.ara';
    const checkpoint = {
      load: async () => {
        try {
          return JSON.parse(await (await (await dir0.getFileHandle(cpName)).getFile()).text());
        } catch {
          return null;
        }
      },
      save: async (c: unknown) => {
        const h = await dir0.getFileHandle(cpName, { create: true });
        const w = await (h as any).createWritable();
        await w.write(JSON.stringify(c));
        await w.close();
      },
    };
    const text = await buildPoiGeoJSON(
      (p) => update(file, { status: 'downloading', received: p.done, total: p.total, label: `Bölge ${p.done}/${p.total} · ${p.points.toLocaleString('tr-TR')} nokta` + (p.note ? ` · ${p.note}` : '') }),
      ctrl.signal,
      checkpoint,
    );
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    const h = await dir.getFileHandle(file, { create: true });
    const w = await (h as any).createWritable();
    await w.write(new Blob([text], { type: 'application/geo+json' }));
    await w.close();
    await dir.removeEntry(file + PART_SUFFIX).catch(() => {});
    await dir.removeEntry(cpName).catch(() => {});
    update(file, { status: 'done', received: text.length, total: text.length, label: undefined }, true);
    invalidatePacks();
    setTimeout(() => {
      if (states[file]?.status === 'done') drop(file);
    }, 1500);
  } catch (e: any) {
    if (e?.name === 'AbortError') drop(file);
    else update(file, { status: 'error', code: 'network', label: undefined, error: (e?.message || 'bağlantı kurulamadı') + ' — internet bağlantısını kontrol edip tekrar deneyin' }, true);
  } finally {
    buildJobs.delete(file);
  }
}

// ---- bilgi noktası sunucusunda indirme (PC / Pi) ----
// Uygulama Akıl Çantası sunucusundan açıldıysa internetteki paketler tarayıcı yerine sunucu
// tarafından indirilir: CORS sınırı yoktur, en hızlı ayna seçilir, birkaç bağlantı paralel çalışır.

// Android uygulamasında aynı iş yerel indiriciye (PaketIndirici.java) verilir: aynı iş listesi
// biçimi, aynı yoklama döngüsü; dosya uygulamanın paket klasörüne iner.

type ServerJob = NativeJob;
let serverFetch: Promise<{ available: boolean; allowed: boolean }> | null = null;
let pollTimer: ReturnType<typeof setTimeout> | null = null;

function apiUrl() {
  return new URL('./api/fetch', location.href).href;
}

/** Bu sayfayı sunan bilgi noktası sunucu tarafı indirme yapabiliyor mu? */
export function serverFetchInfo(): Promise<{ available: boolean; allowed: boolean }> {
  if (typeof location === 'undefined' || !/^https?:$/.test(location.protocol)) return Promise.resolve({ available: false, allowed: false });
  // ?browserdl=1: indirmeyi her zaman tarayıcıda yap (tarayıcı indiricisinin testleri için)
  if (new URLSearchParams(location.search).get('browserdl') === '1') return Promise.resolve({ available: false, allowed: false });
  if (nativePacks.available()) {
    serverFetch ??= nativePacks.status().then((st) => {
      if (!st) return { available: false, allowed: false };
      applyServerJobs(st.jobs);
      return { available: true, allowed: true };
    });
    return serverFetch;
  }
  serverFetch ??= fetch(apiUrl(), { cache: 'no-store' })
    .then(async (r) => {
      if (!r.ok) return { available: false, allowed: false };
      const j = await r.json();
      applyServerJobs(j.jobs ?? []);
      return { available: !!j.available, allowed: !!j.allowed };
    })
    .catch(() => ({ available: false, allowed: false }));
  return serverFetch;
}

function applyServerJobs(jobs: ServerJob[]) {
  let finished = false;
  const seen = new Set<string>();
  for (const j of jobs) {
    seen.add(j.file);
    if (j.status === 'done') {
      if (states[j.file]?.remote && states[j.file].status !== 'done') finished = true;
      if (states[j.file]?.remote) drop(j.file);
      continue;
    }
    const status: DlStatus = j.status === 'checking' || j.status === 'downloading' ? 'downloading' : j.status === 'verifying' ? 'verifying' : j.status === 'error' ? 'error' : 'paused';
    update(j.file, {
      remote: true,
      status,
      received: j.received,
      total: j.total,
      speed: j.speed,
      error: j.error ?? undefined,
      label: j.status === 'checking' ? checkingLabel() : undefined,
    });
  }
  for (const s of Object.values(states)) if (s.remote && !seen.has(s.file)) drop(s.file);
  if (finished) invalidatePacks();
  schedulePoll();
}

function checkingLabel() {
  return nativePacks.available() ? 'En hızlı kaynak aranıyor…' : 'Bilgi noktası en hızlı kaynağı arıyor…';
}

function schedulePoll() {
  if (pollTimer) return;
  const active = Object.values(states).some((s) => s.remote && isActive(s));
  if (!active) return;
  pollTimer = setTimeout(async () => {
    pollTimer = null;
    if (nativePacks.available()) {
      const st = await nativePacks.status();
      if (st) applyServerJobs(st.jobs);
      else schedulePoll();
      return;
    }
    try {
      const r = await fetch(apiUrl(), { cache: 'no-store' });
      if (r.ok) applyServerJobs((await r.json()).jobs ?? []);
      else schedulePoll();
    } catch {
      schedulePoll();
    }
  }, 1000);
}

async function serverAction(action: 'start' | 'pause' | 'cancel', file: string, req?: DownloadRequest): Promise<{ ok: boolean; status: number; error?: string; job?: ServerJob }> {
  if (nativePacks.available()) {
    if (action === 'start') {
      const r = await nativePacks.start({
        file,
        urls: (req?.urls ?? []).filter((u) => /^https?:\/\//.test(u)),
        size: req && !req.sizeApprox ? req.size || undefined : undefined,
        sha256: req?.sha256 || undefined,
      });
      return { ok: r.ok, status: r.ok ? 200 : 500, error: r.error, job: r.job };
    }
    if (action === 'pause') await nativePacks.pause(file);
    else await nativePacks.cancel(file);
    return { ok: true, status: 200 };
  }
  try {
    const r = await fetch(apiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, file }) });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok && !!j.ok, status: r.status, error: j.error, job: j.job };
  } catch {
    return { ok: false, status: 0, error: 'bilgi noktasına ulaşılamadı' };
  }
}

function sameOrigin(u: string) {
  try {
    return new URL(u, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

/** Sunucu indirmesi denenir; sunucu üstlendiyse true. */
async function tryServerDownload(req: DownloadRequest): Promise<boolean> {
  // Bilgi noktasındaki dosyayı cihaza kaydetme (aynı köken) her zaman tarayıcıda yapılır
  if (req.urls.some(sameOrigin) || !req.urls.some((u) => /^https?:\/\//.test(u))) return false;
  const info = await serverFetchInfo();
  if (!info.available || !info.allowed) return false;
  update(req.file, { remote: true, status: 'downloading', error: undefined, code: undefined, label: checkingLabel(), total: req.sizeApprox ? 0 : req.size || 0 }, true);
  const r = await serverAction('start', req.file, req);
  if (!r.ok) {
    if (r.status === 404) {
      // Katalogda yok (ör. farklı sürüm): tarayıcıyla indir
      drop(req.file);
      return false;
    }
    const space = /yer yetersiz/i.test(r.error ?? '');
    update(req.file, { remote: true, status: 'error', code: space ? 'space' : undefined, error: r.error ?? 'bilgi noktası indirmeyi başlatamadı', label: undefined }, true);
    return true;
  }
  if (r.job) applyServerJobs([r.job]);
  schedulePoll();
  // Tarayıcıda yarım kalmış eski kopya artık gereksiz
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    await dir.removeEntry(req.file + PART_SUFFIX).catch(() => {});
  } catch {}
  return true;
}

if (typeof window !== 'undefined') void serverFetchInfo();

export async function startDownload(req: DownloadRequest): Promise<void> {
  const file = req.file;
  if (isActive(states[file])) return;
  // Yalnız http(s), göreli (bilgi noktası) ve osm: adresleri; javascript:/data:/blob: vb. atılır
  req = { ...req, urls: req.urls.filter((u) => typeof u === 'string' && (/^https?:\/\//i.test(u) || /^\.?\//.test(u) || isBuildUrl(u))) };
  if (await tryServerDownload(req)) return;
  const httpUrls = req.urls.filter((u) => !isBuildUrl(u));
  if (req.urls.some(isBuildUrl)) {
    // Bilgi noktası dosyayı sunuyorsa oradan indir; yoksa cihazda oluştur
    if (!httpUrls.length) {
      if (!canSaveToDevice()) {
        update(file, { status: 'error', code: 'storage', error: 'Bu bağlantıda cihaza kayıt yapılamıyor (güvenli bağlam gerekli)' }, true);
        return;
      }
      void runBuild(file);
      return;
    }
    req = { ...req, urls: httpUrls, sha256: undefined, sizeApprox: true };
  }
  if (!canSaveToDevice()) {
    update(file, { status: 'error', code: 'storage', error: 'Bu bağlantıda cihaza kayıt yapılamıyor (güvenli bağlam gerekli)' }, true);
    return;
  }
  const prev = states[file];
  update(file, { status: 'downloading', error: undefined, code: undefined, total: prev?.total || (req.sizeApprox ? 0 : req.size || 0) }, true);

  // Yer kontrolü (yaklaşık boyutta %10 pay bırakılır)
  const info = await storageInfo();
  if (info.quota && req.size) {
    const remaining = req.size - (prev?.received ?? 0);
    const free = info.quota - info.usage;
    const need = req.sizeApprox ? remaining * 0.9 : remaining;
    if (need > free) {
      update(file, { status: 'error', code: 'space', error: `Yer yetersiz: yaklaşık ${fmt(remaining)} gerekli, ${fmt(free)} boş` }, true);
      return;
    }
  }
  void requestPersist();
  send({
    type: 'start',
    id: file,
    file,
    urls: req.urls,
    sha256: req.sha256 || undefined,
    expectedSize: !req.sizeApprox && req.size ? req.size : undefined,
    startMirror: prev?.mirror ?? 0,
  });
}

export function pauseDownload(file: string) {
  if (states[file]?.remote) {
    void serverAction('pause', file).then(() => {
      update(file, { status: 'paused', speed: 0 });
      schedulePoll();
    });
    return;
  }
  const b = buildJobs.get(file);
  if (b) return b.abort();
  if (isActive(states[file])) send({ type: 'abort', id: file, remove: false });
}

export async function cancelDownload(file: string) {
  if (states[file]?.remote) {
    await serverAction('cancel', file);
    drop(file);
    return;
  }
  const b = buildJobs.get(file);
  if (b) return b.abort();
  if (isActive(states[file])) {
    send({ type: 'abort', id: file, remove: true });
    return;
  }
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    await dir.removeEntry(file + PART_SUFFIX).catch(() => {});
    await dir.removeEntry(file + '.ara').catch(() => {});
  } catch {}
  drop(file);
}

/** OPFS'teki kayıtsız .part dosyalarını duraklatılmış indirme olarak ekler. */
export async function scanPartFiles(): Promise<void> {
  if (!canSaveToDevice()) return;
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    const seen = new Set<string>();
    // @ts-ignore entries() async iterator
    for await (const [name, h] of (dir as any).entries()) {
      if (h.kind !== 'file' || !name.endsWith(PART_SUFFIX)) continue;
      const file = name.slice(0, -PART_SUFFIX.length);
      seen.add(file);
      const size = (await h.getFile()).size;
      const s = states[file];
      if (!s) update(file, { status: 'paused', received: size, total: 0, mirror: 0 });
      else if (!isActive(s) && s.status !== 'error') update(file, { received: size });
    }
    // .part'ı kalmamış duraklatılmış kayıtları temizle
    for (const s of Object.values(states)) if (!s.remote && !isActive(s) && !seen.has(s.file)) drop(s.file);
  } catch {}
}

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.', ',') + ' GB';
  return Math.round(n / 1e6) + ' MB';
}
