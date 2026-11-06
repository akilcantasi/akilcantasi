// Harita sekmesinde paket yokken: hazır Türkiye haritası ve afet noktaları paketleri doğrudan
// buradan indirilir (Araçlar → Paketler'e gitmeden). Satırlar Paketler sayfasıyla aynı bileşen:
// indir / ilerleme / duraklat / devam / hata / hazır durumları ve boyutlar oradaki gibi.
// İndirme bitince paket listesi yenilenir, Harita sekmesi haritayı kendiliğinden açar.
import { PackRow, usePackRows } from '../packs-ui';
import type { PackKind } from '../packs';

const KINDS: PackKind[] = ['map', 'poi'];

export function HaritaPaketleri() {
  const { rows, dlFor, rec, memGB } = usePackRows();
  // Katalogdaki harita ve nokta paketleri (önce haritalar, sonra noktalar; katalog sırası korunur)
  const list = rows.filter((r) => r.entry && KINDS.includes(r.kind)).sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind));
  if (!list.length) return null;
  return (
    <div class="map-ready" role="group" aria-label="Hazır harita paketleri" data-testid="map-ready-packs">
      {list.map((r) => (
        <PackRow key={r.key} row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} />
      ))}
    </div>
  );
}
