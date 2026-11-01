// Pi'de (Node.js 18+) afet noktaları paketini oluşturur: uygulamadaki poi-build ile aynı kod.
// Üretmek için: npm run pi:noktalar  → tools/pi/afet-noktalari.mjs
import { writeFileSync, renameSync, existsSync, readFileSync, unlinkSync } from 'node:fs';
import { buildPoiGeoJSON } from '../../../src/lib/map/poi-build';

const out = process.argv[2] || 'turkiye-afet-noktalari.geojson';
const ara = out + '.ara';
const checkpoint = {
  load: async () => (existsSync(ara) ? JSON.parse(readFileSync(ara, 'utf8')) : null),
  save: async (c: unknown) => writeFileSync(ara, JSON.stringify(c)),
};
let son = '';
const text = await buildPoiGeoJSON((p) => {
  const t = `Bölge ${p.done}/${p.total} · ${p.points} nokta${p.note ? ' · ' + p.note : ''}`;
  if (t !== son) console.log(t);
  son = t;
}, undefined, checkpoint);
writeFileSync(out + '.part', text);
renameSync(out + '.part', out);
if (existsSync(ara)) unlinkSync(ara);
console.log(`OK ${out} (${(text.length / 1e6).toFixed(1)} MB)`);
