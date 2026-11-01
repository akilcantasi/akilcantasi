// OPFS üzerinde .part deposu. Worker içinde createSyncAccessHandle kullanılır:
// yazılar doğrudan dosyaya gider, sayfa kapansa bile yazılan kısım kalır.
// Senkron erişim yoksa (ana iş parçacığı / eski tarayıcı) createWritable ile
// belirli aralıklarla kapatıp açarak (commit) çalışır.
import type { PartStore } from './download-core';

export const PART_SUFFIX = '.part';

export async function getPacksDirectory(): Promise<FileSystemDirectoryHandle> {
  const nav: any = (globalThis as any).navigator;
  if (!nav?.storage?.getDirectory) throw new Error('Bu tarayıcı dosya depolamayı desteklemiyor');
  const root: FileSystemDirectoryHandle = await nav.storage.getDirectory();
  return root.getDirectoryHandle('packs', { create: true });
}

async function moveOrCopy(dir: FileSystemDirectoryHandle, from: FileSystemFileHandle, fromName: string, toName: string) {
  await dir.removeEntry(toName).catch(() => {});
  const h: any = from;
  if (typeof h.move === 'function') {
    try {
      await h.move(toName);
      return;
    } catch {
      /* kopyalamaya düş */
    }
  }
  const src = await from.getFile();
  const dst: any = await dir.getFileHandle(toName, { create: true });
  const w = await dst.createWritable();
  const step = 8 * 1024 * 1024;
  for (let o = 0; o < src.size; o += step) await w.write(await src.slice(o, o + step).arrayBuffer());
  await w.close();
  await dir.removeEntry(fromName).catch(() => {});
}

/** Worker içi: senkron erişimli depo */
export async function openSyncPartStore(file: string): Promise<PartStore | null> {
  const dir = await getPacksDirectory();
  const partName = file + PART_SUFFIX;
  const fh: any = await dir.getFileHandle(partName, { create: true });
  if (typeof fh.createSyncAccessHandle !== 'function') return null;
  let ah: any;
  try {
    ah = await fh.createSyncAccessHandle();
  } catch {
    return null;
  }
  let closed = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    try {
      ah.flush();
    } catch {}
    try {
      ah.close();
    } catch {}
  };
  return {
    async size() {
      return ah.getSize();
    },
    async read(offset, length) {
      const b = new Uint8Array(length);
      const n = ah.read(b, { at: offset });
      return b.subarray(0, n);
    },
    async write(offset, data) {
      let w = 0;
      while (w < data.length) w += ah.write(data.subarray(w), { at: offset + w });
    },
    async truncate(n) {
      ah.truncate(n);
    },
    async flush() {
      if (!closed) ah.flush();
    },
    async finalize() {
      await close();
      await moveOrCopy(dir, fh, partName, file);
    },
    async remove() {
      await close();
      await dir.removeEntry(partName).catch(() => {});
    },
    close,
  };
}

/** createWritable tabanlı depo (senkron erişim yoksa). commitBytes'ta bir kaydedilir. */
export async function openWritablePartStore(file: string, commitBytes = 64 * 1024 * 1024): Promise<PartStore> {
  const dir = await getPacksDirectory();
  const partName = file + PART_SUFFIX;
  const fh: any = await dir.getFileHandle(partName, { create: true });
  let w: any = null;
  let pending = 0;
  let size = (await fh.getFile()).size;
  const open = async () => {
    if (!w) w = await fh.createWritable({ keepExistingData: true });
  };
  const commit = async () => {
    if (w) {
      await w.close();
      w = null;
      pending = 0;
    }
  };
  return {
    async size() {
      return size;
    },
    async read(offset, length) {
      await commit();
      const f: File = await fh.getFile();
      return new Uint8Array(await f.slice(offset, offset + length).arrayBuffer());
    },
    async write(offset, data) {
      await open();
      await w.write({ type: 'write', position: offset, data });
      size = Math.max(size, offset + data.length);
      pending += data.length;
      if (pending >= commitBytes) await commit();
    },
    async truncate(n) {
      await open();
      await w.truncate(n);
      size = n;
      await commit();
    },
    async flush() {
      await commit();
    },
    async finalize() {
      await commit();
      await moveOrCopy(dir, fh, partName, file);
    },
    async remove() {
      try {
        await w?.abort?.();
      } catch {}
      w = null;
      await dir.removeEntry(partName).catch(() => {});
      size = 0;
    },
    close: commit,
  };
}
