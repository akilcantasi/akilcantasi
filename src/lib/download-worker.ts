/// <reference lib="webworker" />
// İndirme işçisi: ağdan okur, SHA-256 hesaplar, OPFS'e senkron yazar.
// Ana iş parçacığı (downloader.ts) ile mesajlaşır.
import { createSHA256 } from 'hash-wasm';
import { DownloadError, runDownload, type Hasher } from './download-core';
import { openSyncPartStore, openWritablePartStore } from './opfs-store';

export type WorkerIn =
  | { type: 'start'; id: string; file: string; urls: string[]; sha256?: string; expectedSize?: number; startMirror?: number }
  | { type: 'abort'; id: string; remove?: boolean };

export type WorkerOut =
  | { type: 'progress'; id: string; phase: string; received: number; total: number; mirror: number }
  | { type: 'done'; id: string; size: number; sha256: string | null; mirror: number }
  | { type: 'error'; id: string; code: string; message: string; received: number }
  | { type: 'aborted'; id: string; removed: boolean; received: number };

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const jobs = new Map<string, { ctrl: AbortController; remove: boolean }>();

export async function createHasher(): Promise<Hasher> {
  const h = await createSHA256();
  h.init();
  return { update: (d) => void h.update(d), digest: () => h.digest('hex') };
}

ctx.onmessage = async (ev: MessageEvent<WorkerIn>) => {
  const m = ev.data;
  if (m.type === 'abort') {
    const j = jobs.get(m.id);
    if (j) {
      j.remove = !!m.remove;
      j.ctrl.abort();
    }
    return;
  }
  if (m.type !== 'start' || jobs.has(m.id)) return;
  const job = { ctrl: new AbortController(), remove: false };
  jobs.set(m.id, job);
  const post = (o: WorkerOut) => ctx.postMessage(o);
  let store = null as Awaited<ReturnType<typeof openSyncPartStore>>;
  try {
    store = (await openSyncPartStore(m.file)) ?? (await openWritablePartStore(m.file));
    const r = await runDownload({
      urls: m.urls,
      store,
      sha256: m.sha256,
      expectedSize: m.expectedSize,
      startMirror: m.startMirror,
      signal: job.ctrl.signal,
      createHasher,
      onProgress: (p) => post({ type: 'progress', id: m.id, ...p }),
    });
    post({ type: 'done', id: m.id, size: r.size, sha256: r.sha256, mirror: r.mirror });
  } catch (e) {
    const err = e instanceof DownloadError ? e : new DownloadError('storage', (e as Error)?.message ?? String(e));
    const received = store ? await store.size().catch(() => 0) : 0;
    if (err.code === 'aborted') {
      if (job.remove) await store?.remove().catch(() => {});
      else await store?.close?.().catch(() => {});
      post({ type: 'aborted', id: m.id, removed: job.remove, received: job.remove ? 0 : received });
    } else {
      await store?.close?.().catch(() => {});
      post({ type: 'error', id: m.id, code: err.code, message: err.message, received: err.code === 'hash' ? 0 : received }); // boyut hatasında yarım dosya silindiyse size() zaten 0
    }
  } finally {
    jobs.delete(m.id);
  }
};
