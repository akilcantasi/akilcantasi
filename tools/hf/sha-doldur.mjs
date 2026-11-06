// Katalogda SHA-256 özeti boş olan paketleri yayımcının kendi özetleriyle doldurur.
//   node tools/hf/sha-doldur.mjs [katalog.json ...] [--deneme]
// Katalog verilmezse public/packs-manifest.json (ve varsa dist/packs-manifest.json).
//
// Kaynaklar (yalnız https):
//   1) Kiwix: her ZIM'in yanında yayımlanan "<adres>.sha256" dosyası (download.kiwix.org).
//      Satır "<64 onaltılık>  <dosya adı>" biçimindedir; özet ancak dosya adı katalogdaki adla
//      birebir aynıysa kabul edilir.
//   2) Hugging Face (akilcantasi/paketler): depo ağacındaki LFS özeti (lfs.oid = dosyanın SHA-256'sı);
//      ancak boyut da katalogdakiyle aynıysa kabul edilir.
// Var olan bir özet hiçbir zaman değiştirilmez; kaynakla çelişirse yalnız uyarı yazılır.
// Aylık iş (.github/workflows/aylik-harita.yml) bunu her ay çalıştırır.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HEX64 = /^[0-9a-f]{64}$/;
export const HF_DEPO = 'akilcantasi/paketler';
export const HF_BASE = `https://huggingface.co/datasets/${HF_DEPO}/resolve/main/`;

/** Kiwix indirme adresinden yayımcının .sha256 adresini çıkarır (Kiwix değilse null) */
export function kiwixShaAdresi(urls) {
  for (const u of urls ?? []) {
    const m = /^https:\/\/(?:mirror\.)?download\.kiwix\.org\/zim\/([A-Za-z0-9._/-]+\.zim)$/.exec(String(u));
    if (m && !m[1].includes('..')) return `https://download.kiwix.org/zim/${m[1]}.sha256`;
  }
  return null;
}

/**
 * ".sha256" dosyasını çözer. Yalnız tam olarak bu dosya adına ait, 64 onaltılık karakterlik özet
 * kabul edilir ("<özet>  <ad>" ya da "<özet> *<ad>"; ad yol içerebilir, son parçası karşılaştırılır).
 */
export function shaDosyasiCoz(metin, dosya) {
  for (const satir of String(metin ?? '').split(/\r?\n/)) {
    const m = /^\s*([0-9a-fA-F]{64})\s+\*?(\S+)\s*$/.exec(satir);
    if (!m) continue;
    const ad = m[2].split('/').pop();
    if (ad === dosya) return m[1].toLowerCase();
  }
  return null;
}

/**
 * Hugging Face ağaç listesindeki LFS özetlerini katalog girdileriyle eşleştirir.
 * agac: [{ path, size, lfs: { oid, size } }]. Döner: { doldurulan: [id], celisen: [id] }
 */
export function hfAgacindanDoldur(katalog, agac, hfBase = HF_BASE) {
  const byPath = new Map();
  for (const e of agac ?? []) if (e && e.type !== 'directory' && e.lfs && HEX64.test(String(e.lfs.oid))) byPath.set(e.path, e);
  const doldurulan = [];
  const celisen = [];
  for (const p of katalog.packs ?? []) {
    const u = (p.urls ?? []).find((x) => String(x).startsWith(hfBase));
    if (!u) continue;
    const e = byPath.get(u.slice(hfBase.length).split('?')[0]);
    if (!e) continue;
    const boyut = e.lfs.size ?? e.size;
    if (!p.sizeApprox && p.size && boyut !== p.size) continue; // başka sürüm: dokunma
    if (!p.sha256) {
      p.sha256 = e.lfs.oid;
      if (p.sizeApprox || !p.size) {
        p.size = boyut;
        p.sizeApprox = false;
      }
      doldurulan.push(p.id);
    } else if (p.sha256 !== e.lfs.oid) celisen.push(p.id);
  }
  return { doldurulan, celisen };
}

/** Eksik özetleri doldurur. getir(url) → metin ya da null. Döner: { doldurulan, bulunamayan, celisen } */
export async function eksikleriDoldur(katalog, getir) {
  const doldurulan = [];
  const bulunamayan = [];
  const celisen = [];
  // 1) Hugging Face ağaçları (kopyası orada olan paketler)
  const dizinler = new Set();
  for (const p of katalog.packs ?? [])
    for (const u of p.urls ?? []) if (String(u).startsWith(HF_BASE)) dizinler.add(u.slice(HF_BASE.length).split('/')[0]);
  for (const d of dizinler) {
    const metin = await getir(`https://huggingface.co/api/datasets/${HF_DEPO}/tree/main/${encodeURIComponent(d)}`);
    if (!metin) continue;
    try {
      const r = hfAgacindanDoldur(katalog, JSON.parse(metin));
      doldurulan.push(...r.doldurulan);
      celisen.push(...r.celisen);
    } catch {
      /* bozuk yanıt: atla */
    }
  }
  // 2) Kiwix .sha256 dosyaları
  for (const p of katalog.packs ?? []) {
    if (p.sha256 || p.kind !== 'zim') continue;
    const adres = kiwixShaAdresi(p.urls);
    if (!adres) {
      bulunamayan.push(p.id);
      continue;
    }
    const metin = await getir(adres);
    const sha = metin ? shaDosyasiCoz(metin, p.file) : null;
    if (sha) {
      p.sha256 = sha;
      doldurulan.push(p.id);
    } else bulunamayan.push(p.id);
  }
  for (const p of katalog.packs ?? []) if (!p.sha256 && !bulunamayan.includes(p.id)) bulunamayan.push(p.id);
  return { doldurulan, bulunamayan, celisen };
}

async function httpsMetin(url) {
  if (!url.startsWith('https://')) return null;
  for (let deneme = 0; deneme < 3; deneme++) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(String(r.status));
      if (!r.url.startsWith('https://')) return null;
      const t = await r.text();
      return t.length > 5_000_000 ? null : t;
    } catch {
      await new Promise((s) => setTimeout(s, 2000 * (deneme + 1)));
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const deneme = args.includes('--deneme');
  const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
  let dosyalar = args.filter((a) => !a.startsWith('--'));
  if (!dosyalar.length) dosyalar = [path.join(kok, 'public', 'packs-manifest.json'), path.join(kok, 'dist', 'packs-manifest.json')].filter((f) => fs.existsSync(f));
  const ilk = JSON.parse(fs.readFileSync(dosyalar[0], 'utf8'));
  const r = await eksikleriDoldur(ilk, httpsMetin);
  console.log(`SHA-256 dolduruldu: ${r.doldurulan.length}${r.doldurulan.length ? ' (' + r.doldurulan.join(', ') + ')' : ''}`);
  if (r.bulunamayan.length) console.log(`Bulunamadı: ${r.bulunamayan.length} (${r.bulunamayan.join(', ')})`);
  if (r.celisen.length) console.log(`UYARI: katalogdaki özet kaynaktakiyle çelişiyor (değiştirilmedi): ${r.celisen.join(', ')}`);
  if (deneme || !r.doldurulan.length) return;
  const yeni = new Map(ilk.packs.map((p) => [p.id, p]));
  for (const d of dosyalar) {
    const k = d === dosyalar[0] ? ilk : JSON.parse(fs.readFileSync(d, 'utf8'));
    for (const p of k.packs) {
      const n = yeni.get(p.id);
      if (n && !p.sha256 && n.sha256 && n.file === p.file) {
        p.sha256 = n.sha256;
        if (n.sizeApprox === false) {
          p.size = n.size;
          p.sizeApprox = false;
        }
      }
    }
    fs.writeFileSync(d, JSON.stringify(k, null, 2) + '\n');
    console.log('Yazıldı: ' + path.relative(process.cwd(), d));
  }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'sha-doldur.mjs' && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error('HATA: ' + (e?.message ?? e));
    process.exit(1);
  });
}
