// Aylık işin güncellediği katalog alanlarını (adres, boyut, özet) depodaki güncel kataloğa taşır.
// İş sürerken depoya eklenen yeni paketler ya da değişiklikler korunur.
//   node tools/hf/katalog-birlestir.mjs <işin-katalogu.json> <depodaki-katalog.json>
import fs from 'node:fs';

const FIELDS = ['urls', 'size', 'sizeApprox', 'sha256', 'desc', 'file'];

export function merge(fromJob, current, ids = null) {
  const byId = new Map(fromJob.packs.map((p) => [p.id, p]));
  let changed = 0;
  for (const p of current.packs) {
    const n = byId.get(p.id);
    if (!n || (ids && !ids.includes(p.id))) continue;
    for (const f of FIELDS) {
      if (JSON.stringify(p[f]) !== JSON.stringify(n[f]) && n[f] !== undefined) {
        p[f] = n[f];
        changed++;
      }
    }
  }
  if (changed) current.updated = fromJob.updated ?? current.updated;
  return changed;
}

if (process.argv[1] && process.argv[1].endsWith('katalog-birlestir.mjs')) {
  const [a, b] = process.argv.slice(2);
  const job = JSON.parse(fs.readFileSync(a, 'utf8'));
  const cur = JSON.parse(fs.readFileSync(b, 'utf8'));
  const n = merge(job, cur);
  fs.writeFileSync(b, JSON.stringify(cur, null, 2) + '\n');
  console.log(`Katalog birleştirildi: ${n} alan güncellendi`);
}
