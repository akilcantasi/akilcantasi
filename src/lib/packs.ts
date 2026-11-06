// İçerik paketleri: Vikipedi (ZIM), Fener modeli (GGUF; büyük modeller
// "-00001-of-0000N.gguf" parçaları halinde), harita (PMTiles), harita noktaları
// (GeoJSON), sesli soru için konuşma tanıma modeli (Whisper ONNX dosyalarını
// içeren tek bir .tar; bkz. src/lib/voice/whisper-pack.ts) ve isteğe bağlı rehber paketleri
// (.rehber.json; bkz. src/content/pack-guides.ts). Paketler iki yerden gelebilir:
//  1) Cihazın kendi deposu: OPFS (tarayıcıda indirilen ya da içe aktarılan paketler) ve
//     Android uygulamasında uygulamanın paket klasörü (yerel indiricinin indirdikleri;
//     url ile, /_paket/ yolundan parça parça okunur)
//  2) Bağlı olunan Akıl Çantası sunucusu (masaüstü / bilgi noktası): /api/packs
import { BlobSource, HttpRangeSource, QueryRangeSource, type RandomAccessSource } from './source';
import { getState, setState } from './store';
import { nativePacks } from './native';

export type PackKind = 'zim' | 'model' | 'map' | 'poi' | 'ses' | 'hava' | 'rehber';

export interface InstalledPack {
  id: string; // dosya adı
  kind: PackKind;
  size: number;
  origin: 'device' | 'server';
  url?: string; // sunucudaki ya da Android paket klasöründeki dosyanın adresi
}

export const KIND_BY_EXT: Record<string, PackKind> = {
  zim: 'zim',
  gguf: 'model',
  pmtiles: 'map',
  geojson: 'poi',
  json: 'poi',
  tar: 'ses',
};

export function kindOf(name: string): PackKind | null {
  // ".rehber.json" rehber paketidir; sıradan ".json" harita noktası sayılır
  if (name.toLowerCase().endsWith('.rehber.json')) return 'rehber';
  // Hava ve iklim paketi de .json'dur; adından ayırt edilir (hava-*.json)
  if (/^hava-.*\.json$/i.test(name)) return 'hava';
  const ext = name.toLowerCase().split('.').pop() ?? '';
  return KIND_BY_EXT[ext] ?? null;
}

async function opfsDir(): Promise<FileSystemDirectoryHandle | null> {
  try {
    if (!navigator.storage?.getDirectory) return null;
    const root = await navigator.storage.getDirectory();
    return await root.getDirectoryHandle('packs', { create: true });
  } catch {
    return null;
  }
}

async function listNativePacks(): Promise<InstalledPack[]> {
  try {
    const files = await nativePacks.list();
    return files
      .map((f) => ({ id: f.name, kind: kindOf(f.name)!, size: f.size, origin: 'device' as const, url: nativePacks.url(f.name) }))
      .filter((p) => p.kind);
  } catch {
    return [];
  }
}

export async function listDevicePacks(): Promise<InstalledPack[]> {
  const nat = await listNativePacks();
  const dir = await opfsDir();
  if (!dir) return nat;
  const out: InstalledPack[] = [...nat];
  const have = new Set(nat.map((p) => p.id));
  // @ts-ignore - entries() async iterator
  for await (const [name, handle] of (dir as any).entries()) {
    if (handle.kind !== 'file' || name.endsWith('.part') || have.has(name)) continue;
    const kind = kindOf(name);
    if (!kind) continue;
    const file: File = await handle.getFile();
    out.push({ id: name, kind, size: file.size, origin: 'device' });
  }
  return out;
}

export async function listServerPacks(): Promise<InstalledPack[]> {
  try {
    const res = await fetch('./api/packs', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { files: { name: string; size: number; url: string }[] };
    return data.files
      .map((f) => ({ id: f.name, kind: kindOf(f.name)!, size: f.size, origin: 'server' as const, url: f.url }))
      .filter((p) => p.kind);
  } catch {
    return [];
  }
}

let cache: InstalledPack[] | null = null;

export async function listPacks(force = false): Promise<InstalledPack[]> {
  if (cache && !force) return cache;
  const [d, s] = await Promise.all([listDevicePacks(), listServerPacks()]);
  // Cihazdaki kopya, sunucudakinden önceliklidir
  const seen = new Set(d.map((p) => p.id));
  cache = [...d, ...s.filter((p) => !seen.has(p.id))];
  return cache;
}

export function invalidatePacks() {
  cache = null;
  setState({ packsVersion: getState().packsVersion + 1 });
}

/** Belirli türdeki ilk (ya da tercih edilen) paketi döndürür. */
export async function findPack(kind: PackKind, preferId?: string | null): Promise<InstalledPack | null> {
  const all = (await listPacks()).filter((p) => p.kind === kind);
  if (preferId) {
    const p = all.find((x) => x.id === preferId);
    if (p) return p;
  }
  return all.sort((a, b) => a.id.localeCompare(b.id))[0] ?? null;
}

export async function getDeviceFile(id: string): Promise<File | null> {
  const dir = await opfsDir();
  if (!dir) return null;
  try {
    const h = await dir.getFileHandle(id);
    return await h.getFile();
  } catch {
    return null;
  }
}

export async function openSource(pack: InstalledPack): Promise<RandomAccessSource> {
  if (pack.origin === 'device' && pack.url) return new QueryRangeSource(pack.url, pack.size, pack.id);
  if (pack.origin === 'device') {
    const f = await getDeviceFile(pack.id);
    if (!f) throw new Error('Paket bulunamadı: ' + pack.id);
    return new BlobSource(f, pack.id);
  }
  return HttpRangeSource.open(pack.url!);
}

/**
 * Bütünüyle belleğe okunup JSON olarak ayrıştırılan paket türlerinin üst sınırı. Bozuk ya da
 * kötü niyetli (ör. bağlı bilgi noktasının sunduğu dev bir ".rehber.json") dosya açılışta
 * sekmeyi belleksiz bırakmasın. Resmî paketler bunun çok altındadır (rehber ~19 MB, hava ~60 KB).
 */
export const JSON_PACK_MAX: Partial<Record<PackKind, number>> = { rehber: 100e6, hava: 16e6 };

/** Model gibi bütün olarak gereken paketler için Blob döndürür. */
export async function openBlob(pack: InstalledPack, onProgress?: (loaded: number, total: number) => void): Promise<Blob> {
  const max = JSON_PACK_MAX[pack.kind];
  const tooBig = () => new Error('Paket beklenenden çok büyük: ' + pack.id);
  if (max && pack.size > max) throw tooBig();
  if (pack.origin === 'device' && !pack.url) {
    const f = await getDeviceFile(pack.id);
    if (!f) throw new Error('Paket bulunamadı: ' + pack.id);
    if (max && f.size > max) throw tooBig();
    return f;
  }
  const res = await fetch(pack.url!);
  if (!res.ok || !res.body) throw new Error('Paket indirilemedi: ' + pack.id);
  const total = Number(res.headers.get('content-length') ?? pack.size);
  if (max && total > max) {
    res.body.cancel().catch(() => {});
    throw tooBig();
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (max && loaded > max) {
      reader.cancel().catch(() => {});
      throw tooBig();
    }
    onProgress?.(loaded, total);
  }
  return new Blob(chunks as BlobPart[]);
}

/** Dosyadan içe aktarma: seçilen dosyayı OPFS'e kopyalar. */
export async function importFile(file: File, onProgress?: (done: number, total: number) => void): Promise<InstalledPack> {
  const kind = kindOf(file.name);
  if (!kind) throw new Error('Desteklenmeyen dosya türü: ' + file.name);
  const dir = await opfsDir();
  if (!dir) throw new Error('Bu tarayıcı dosya depolamayı desteklemiyor');
  const handle = await dir.getFileHandle(file.name, { create: true });
  const w = await (handle as any).createWritable();
  const chunk = 8 * 1024 * 1024;
  for (let off = 0; off < file.size; off += chunk) {
    await w.write(await file.slice(off, off + chunk).arrayBuffer());
    onProgress?.(Math.min(off + chunk, file.size), file.size);
  }
  await w.close();
  invalidatePacks();
  return { id: file.name, kind, size: file.size, origin: 'device' };
}

export async function deleteDevicePack(id: string) {
  await nativePacks.remove(id).catch(() => false);
  const dir = await opfsDir();
  if (dir) await dir.removeEntry(id).catch(() => {});
  invalidatePacks();
}

export function formatSize(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.', ',') + ' GB';
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' MB';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + ' KB';
  return n + ' B';
}
