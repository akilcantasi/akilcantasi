// Akıl Çantası — paketleri Hugging Face'e yansılama.
//   node tools/hf/hf-yukle.mjs [--kok <proje klasörü>] [--deneme] [--sadece id1,id2]
// Token yalnızca HF_TOKEN ortam değişkeninden okunur (hf-yukle.cmd sorar; diske düz metin yazılmaz).
//
// Ne yapar:
//   1) tools/hf/paketler.json'daki her paketin dosyasını data/ klasöründe arar.
//      Kiwix paketi yoksa sunucunun hızlı indiricisiyle (server/fetcher.mjs) önce indirir.
//   2) Hugging Face'teki kopyası yoksa ya da boyutu farklıysa yükler (yarıda kalırsa yeniden
//      çalıştırınca biten dosyalar atlanır).
//   3) Lisans ve kaynak tablosuyla bir veri kartı (README.md) yükler.
//   4) public/ ve dist/ içindeki packs-manifest.json'da bu paketlerin ilk adresini Hugging Face yapar.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRepo, pathsInfo, uploadFile, uploadFilesWithProgress, whoAmI } from '@huggingface/hub';
// @ts-expect-error — düz JS modülü
import { createFetcher } from '../../../server/fetcher.mjs';

type Entry = {
  id: string;
  kind: string;
  name: string;
  desc: string;
  file: string;
  size: number;
  sizeApprox?: boolean;
  sha256?: string;
  urls: string[];
  license: string;
  source: string;
};

const args = process.argv.slice(2);
const arg = (k: string) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const ROOT = path.resolve(arg('--kok') ?? process.cwd());
const DATA = path.resolve(arg('--data') ?? path.join(ROOT, 'data'));
const DRY = args.includes('--deneme');
const ONLY = (arg('--sadece') ?? '').split(',').map((s) => s.trim()).filter(Boolean);

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'hf', 'paketler.json'), 'utf8'));
const ORG: string = arg('--org') ?? cfg.org;
const REPO_NAME: string = arg('--repo') ?? cfg.repo;
const REPO = { type: 'dataset' as const, name: `${ORG}/${REPO_NAME}` };
const HF_BASE = `https://huggingface.co/datasets/${ORG}/${REPO_NAME}/resolve/main/`;

const log = (s: string) => console.log('  ' + s);
const gb = (n: number) => (n / 1024 ** 3).toFixed(2).replace('.', ',') + ' GB';

function manifestPaths() {
  return [path.join(ROOT, 'public', 'packs-manifest.json'), path.join(ROOT, 'dist', 'packs-manifest.json')].filter((p) => fs.existsSync(p));
}

/** data/ ve bir alt düzeyinde dosyayı arar */
function findLocal(file: string): string | null {
  const direct = path.join(DATA, file);
  if (fs.existsSync(direct)) return direct;
  for (const d of fs.existsSync(DATA) ? fs.readdirSync(DATA, { withFileTypes: true }) : []) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    const p = path.join(DATA, d.name, file);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function sha256File(p: string) {
  const h = crypto.createHash('sha256');
  await new Promise<void>((res, rej) => fs.createReadStream(p).on('data', (d) => h.update(d)).on('end', () => res()).on('error', rej));
  return h.digest('hex');
}

/** Kiwix paketini sunucunun hızlı indiricisiyle data/ klasörüne indirir */
async function fetchFromMirrors(e: Entry, manifest: any): Promise<string | null> {
  const fetcher = createFetcher({ dataDir: DATA, loadManifest: async () => manifest });
  const r = await fetcher.start(e.id);
  if (!r.ok) {
    log(`  ! indirilemedi: ${r.error}`);
    return null;
  }
  let last = 0;
  for (;;) {
    const j = fetcher.list().find((x: any) => x.file === e.file);
    if (!j || j.status === 'done') break;
    if (j.status === 'error') {
      log(`  ! indirme hatası: ${j.error}`);
      return null;
    }
    if (Date.now() - last > 3000) {
      last = Date.now();
      const pct = j.total ? Math.floor((j.received / j.total) * 100) : 0;
      process.stdout.write(`\r    indiriliyor %${pct} · ${(j.speed / 1e6).toFixed(1)} MB/sn${j.mirror ? ' · ' + j.mirror : ''}        `);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  process.stdout.write('\n');
  return findLocal(e.file);
}

async function remoteSize(p: string, token: string): Promise<number | null> {
  try {
    const r = await pathsInfo({ repo: REPO, paths: [p], accessToken: token });
    return r[0]?.size ?? null;
  } catch {
    return null;
  }
}

function card(entries: Entry[], dirOf: (e: Entry) => string) {
  const rows = entries
    .map((e) => `| \`${dirOf(e)}/${e.file}\` | ${e.name} | ${e.license} | ${e.source.replace(/\|/g, '/')} |`)
    .join('\n');
  return `---
license: other
license_name: karisik-acik-lisanslar
pretty_name: Akıl Çantası içerik paketleri
language:
- tr
- en
tags:
- offline
- disaster-preparedness
- kiwix
- zim
- pmtiles
---

# Akıl Çantası içerik paketleri

[Akıl Çantası](https://huggingface.co/${ORG}) açık kaynaklı, internetsiz çalışan bir afet bilgi uygulamasıdır.
Bu depo, uygulamanın her cihazdan hızlı ve kesintisiz indirebilmesi için içerik paketlerinin kopyalarını barındırır.

- **zim/**: Kiwix tarafından yayımlanan çevrimdışı arşivlerin değiştirilmemiş kopyaları (https://download.kiwix.org).
- **harita/**: OpenStreetMap verisinden Protomaps şemasıyla üretilmiş PMTiles haritaları.
- **noktalar/**: OpenStreetMap'ten toplanmış toplanma alanı, sağlık, eczane, su ve barınma noktaları (GeoJSON).

Her dosya kendi özgün lisansına tabidir; aşağıdaki tabloya bakın. Kullanırken kaynağı ve lisansı belirtin.

| Dosya | İçerik | Lisans | Kaynak |
|---|---|---|---|
${rows}

Harita ve nokta verileri © OpenStreetMap katkıcıları, ODbL 1.0 (https://www.openstreetmap.org/copyright).
`;
}

async function main() {
  console.log('\n  Akıl Çantası — Hugging Face yansısı');
  console.log('  ' + '─'.repeat(52));
  const mpaths = manifestPaths();
  if (!mpaths.length) throw new Error('packs-manifest.json bulunamadı (public/ ya da dist/).');
  const manifest = JSON.parse(await fsp.readFile(mpaths[0], 'utf8'));
  const byId = new Map<string, Entry>(manifest.packs.map((p: Entry) => [p.id, p]));
  const ids: string[] = (ONLY.length ? ONLY : cfg.paketler).filter((id: string) => {
    if (byId.has(id)) return true;
    log(`! katalogda yok, atlandı: ${id}`);
    return false;
  });
  const dirOf = (e: Entry) => cfg.dizin[e.kind] ?? e.kind;

  const token = process.env.HF_TOKEN ?? '';
  if (!DRY) {
    if (!token) throw new Error('HF_TOKEN yok. hf-yukle.cmd ile çalıştırın; token sorulur.');
    const me = await whoAmI({ accessToken: token });
    const orgs = ((me as any).orgs ?? []).map((o: any) => o.name);
    log(`Hesap: ${me.name}${orgs.length ? ' · organizasyonlar: ' + orgs.join(', ') : ''}`);
    if (ORG !== me.name && !orgs.includes(ORG)) throw new Error(`"${ORG}" organizasyonunda üyeliğiniz görünmüyor. Organizasyonu açtığınız hesabın token'ını kullanın.`);
    try {
      await createRepo({ repo: REPO, accessToken: token, visibility: 'public', license: 'other' });
      log(`Depo oluşturuldu: huggingface.co/datasets/${REPO.name}`);
    } catch (e: any) {
      if (!/already|exist|409|conflict/i.test(String(e?.message ?? e))) throw e;
      log(`Depo: huggingface.co/datasets/${REPO.name}`);
    }
  }

  const done: Entry[] = [];
  const updates = new Map<string, Partial<Entry>>();
  let i = 0;
  for (const id of ids) {
    const e = byId.get(id)!;
    i++;
    const rpath = `${dirOf(e)}/${e.file}`;
    console.log(`\n  [${i}/${ids.length}] ${e.name}`);
    let local = findLocal(e.file);
    if (!local) {
      if (e.kind === 'zim' && e.urls.some((u) => /^https?:\/\//.test(u))) {
        if (DRY) {
          log(`  yerelde yok; gerçek çalıştırmada Kiwix aynasından indirilecek (${gb(e.size)})`);
          continue;
        }
        log('  yerelde yok, en hızlı Kiwix aynasından indiriliyor…');
        local = await fetchFromMirrors(e, manifest);
      }
      if (!local) {
        log(`  ! dosya yok, atlandı: ${e.file}${e.kind === 'map' || e.kind === 'poi' ? ' (hf-yukle.cmd haritayı ve noktaları önce üretir)' : ''}`);
        continue;
      }
    }
    const size = (await fsp.stat(local)).size;
    if (!e.sizeApprox && e.size && size !== e.size) log(`  ! uyarı: yereldeki boyut (${size}) katalogdakinden (${e.size}) farklı`);
    if (DRY) {
      log(`  yüklenecek: ${rpath} (${gb(size)})`);
      continue;
    }
    const rs = await remoteSize(rpath, token);
    if (rs === size) log(`  zaten yüklü (${gb(size)}), atlandı`);
    else {
      log(`  yükleniyor: ${rpath} (${gb(size)})`);
      let lastLog = 0;
      const it = uploadFilesWithProgress({
        repo: REPO,
        accessToken: token,
        files: [{ path: rpath, content: pathToFileURL(local) }],
        commitTitle: `${e.name} (${e.file})`,
      });
      for (;;) {
        const n = await it.next();
        if (n.done) break;
        const ev = n.value;
        if (ev.event === 'fileProgress' && Date.now() - lastLog > 2000) {
          lastLog = Date.now();
          process.stdout.write(`\r    ${ev.state === 'hashing' ? 'hazırlanıyor' : 'yükleniyor'} %${Math.floor(ev.progress * 100)}        `);
        }
      }
      process.stdout.write('\r    tamam                         \n');
    }
    const patch: Partial<Entry> = {};
    // Her ay yeniden üretilen paketler: boyut ve özet yeniden yazılır
    if (e.kind === 'map' || e.kind === 'poi' || e.kind === 'hava') {
      patch.size = size;
      patch.sizeApprox = false;
      patch.sha256 = await sha256File(local);
    }
    updates.set(e.id, patch);
    done.push(e);
  }

  if (DRY) {
    console.log('\n  Deneme bitti; hiçbir şey yüklenmedi ve katalog değişmedi.\n');
    return;
  }
  if (done.length) {
    await uploadFile({
      repo: REPO,
      accessToken: token,
      file: { path: 'README.md', content: new Blob([card(done, dirOf)]) },
      commitTitle: 'Veri kartı',
    });
    // Katalog: Hugging Face adresi öne; ölü akilcantasi.com adresleri çıkar
    for (const mp of mpaths) {
      const m = JSON.parse(await fsp.readFile(mp, 'utf8'));
      for (const p of m.packs as Entry[]) {
        const u = updates.get(p.id);
        if (!u) continue;
        const hf = HF_BASE + `${dirOf(p)}/${p.file}`;
        p.urls = [hf, ...p.urls.filter((x) => x !== hf && !x.includes('akilcantasi.com'))];
        Object.assign(p, u);
        if (p.kind === 'poi') p.desc = p.desc.replace(/İnternet varken OpenStreetMap'ten doğrudan bu cihazda oluşturulur \(birkaç dakika sürer\)\./, 'Hazır paket olarak hızlıca iner; gerekirse cihazda OpenStreetMap\'ten yeniden oluşturulur.');
      }
      m.updated = new Date().toISOString().slice(0, 10);
      await fsp.writeFile(mp, JSON.stringify(m, null, 2) + '\n');
      log(`Katalog güncellendi: ${path.relative(ROOT, mp)}`);
    }
    // Uygulamalar internet varken bu kataloğu okuyup yeni sürümleri görür (REMOTE_MANIFEST_URL)
    await uploadFile({
      repo: REPO,
      accessToken: token,
      file: { path: 'packs-manifest.json', content: new Blob([await fsp.readFile(mpaths[0])], { type: 'application/json' }) },
      commitTitle: 'Katalog',
    });
    log('Merkezi katalog yüklendi: packs-manifest.json');
  }
  console.log(`\n  Bitti: ${done.length}/${ids.length} paket Hugging Face'te.\n  https://huggingface.co/datasets/${REPO.name}\n`);
}

main().catch((e) => {
  console.error('\n  HATA: ' + (e?.message ?? e) + '\n');
  process.exit(1);
});
