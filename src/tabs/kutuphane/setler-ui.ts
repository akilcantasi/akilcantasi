// Katalogdaki hazır setler (Temel set = önerilen başlangıç seti) ve indirme kuyruğu yardımcıları.
import type { Manifest } from '../../lib/manifest';
import type { DlState } from '../../lib/downloader';
import { isActive } from '../../lib/downloader';
import type { RowModel } from '../../lib/packs-ui';
import { kuyruk, setDurumu, setleriAl, type SetDurumu } from '../../lib/setler';

export function setlerOf(manifest: Manifest | null, rows: RowModel[]) {
  const zims = rows.filter((r) => r.kind === 'zim');
  const byId = new Map(zims.filter((r) => r.entry).map((r) => [r.entry!.id, r]));
  const setler = setleriAl(manifest?.sets, new Set(byId.keys()));
  const durum: SetDurumu[] = setler.map((s) => setDurumu(s, byId));
  return { zims, byId, setler, durum };
}

/** Setin indirilecek (hazır olmayan, şu an inmeyen, sırada olmayan) paketleri */
export function setKuyrugu(
  d: SetDurumu,
  all: ReturnType<typeof setlerOf>,
  dlFor: (r: RowModel) => DlState | undefined,
  sira: string[],
): RowModel[] {
  return kuyruk([d.set.id], all.setler, all.byId, (r) => isActive(dlFor(r)) || sira.includes(r.file));
}
