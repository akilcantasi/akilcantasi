// Toplu indirme kuyruğu: "İndir" ile seçilen paketler aynı anda en çok iki tane iner,
// biri bitince sıradaki başlar. Sekmeden çıkılsa da sürer (modül düzeyinde).
import { useEffect, useState } from 'preact/hooks';
import { getDownloads, isActive, pauseDownload, subscribeDownloads } from './downloader';
import { startRow, type RowModel } from './packs-ui';

const ESZAMANLI = 2;
type Item = { file: string; row: RowModel; started: boolean };
let items: Item[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function pump() {
  const dl = getDownloads();
  // Bitmiş (artık listede olmayan) ya da hata veren başlamış işler kuyruktan düşer
  items = items.filter((i) => !i.started || isActive(dl[i.file]) || dl[i.file]?.status === 'paused');
  const running = items.filter((i) => i.started && isActive(dl[i.file])).length;
  let slots = ESZAMANLI - running;
  for (const i of items) {
    if (slots <= 0) break;
    if (i.started) continue;
    i.started = true;
    slots--;
    void startRow(i.row);
  }
  notify();
}

let subscribed = false;
function ensure() {
  if (subscribed) return;
  subscribed = true;
  subscribeDownloads(() => pump());
}

export function kuyrugaEkle(rows: RowModel[]) {
  ensure();
  for (const r of rows) if (!items.some((i) => i.file === r.file)) items.push({ file: r.file, row: r, started: false });
  pump();
}

/** Kuyruktaki ve inen her şeyi duraklatır; bekleyenler kuyruktan çıkar */
export function hepsiniDuraklat() {
  const dl = getDownloads();
  for (const i of items) if (i.started && isActive(dl[i.file])) pauseDownload(i.file);
  items = [];
  notify();
}

export function bekleyenler(): string[] {
  return items.filter((i) => !i.started).map((i) => i.file);
}

export function useKuyruk(): string[] {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((x) => x + 1);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);
  return bekleyenler();
}

/** Testler için */
export function _sifirla() {
  items = [];
}
