// Akıl Çantası — paket kataloğunu (packs-manifest.json) Ed25519 ile imzalar.
//
//   node tools/katalog-imzala.mjs [katalog.json ...] [--anahtar <dosya>]
//       Her katalogun yanına <katalog>.sig (base64, 64 baytlık ayrık imza) yazar ve imzayı
//       uygulamadaki açık anahtarla (src/lib/katalog-imza.ts) hemen doğrular. Katalog verilmezse
//       public/packs-manifest.json imzalanır.
//   node tools/katalog-imzala.mjs --dogrula [katalog.json ...]
//       Yalnız doğrular (anahtar gerekmez); imza yoksa ya da tutmazsa çıkış kodu 1.
//   node tools/katalog-imzala.mjs --denetle [--anahtar <dosya>]
//       Gizli anahtarın var olduğunu ve uygulamadaki açık anahtarla eşleştiğini denetler (imzalamaz).
//   node tools/katalog-imzala.mjs --yeni-anahtar <dosya>
//       Yeni anahtar çifti üretir: gizli anahtar yalnız <dosya>ya yazılır (zaten varsa durur),
//       açık anahtar ekrana yazılır (src/lib/katalog-imza.ts içine konur).
//
// Gizli anahtar şuralardan okunur (ilk bulunan):
//   1) --anahtar <dosya>
//   2) KATALOG_IMZA_ANAHTARI ortam değişkeni (GitHub Actions gizli değişkeni)
//   3) KATALOG_IMZA_ANAHTARI_DOSYASI ortam değişkenindeki dosya yolu
//   4) _gizli/katalog-imza-anahtari.txt (yalnız yerel bilgisayarda; depoya girmez)
// Biçim: base64 PKCS8 (DER), PEM, ya da 32 baytlık ham tohum (base64 veya 64 karakter onaltılık).
// "#" ile başlayan satırlar açıklama sayılır. Anahtar hiçbir zaman ekrana yazılmaz.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKCS8_ON_EK = Buffer.from('302e020100300506032b657004220420', 'hex');
const SPKI_ON_EK = Buffer.from('302a300506032b6570032100', 'hex');

/** Anahtar metnini (açıklama satırları atılmış) Node KeyObject'e çevirir. Hata iletisi anahtarı içermez. */
export function gizliAnahtarOku(metin) {
  const temiz = String(metin ?? '')
    .split(/\r?\n/)
    .filter((s) => !s.trim().startsWith('#'))
    .join('\n')
    .trim();
  if (!temiz) throw new Error('imza anahtarı boş');
  if (temiz.includes('-----BEGIN')) return crypto.createPrivateKey({ key: temiz, format: 'pem' });
  const tek = temiz.replace(/\s+/g, '');
  let ham;
  if (/^[0-9a-fA-F]{64}$/.test(tek)) ham = Buffer.from(tek, 'hex');
  else if (/^[A-Za-z0-9+/=_-]+$/.test(tek)) ham = Buffer.from(tek.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  else throw new Error('imza anahtarı tanınmadı (base64 PKCS8, PEM ya da 32 baytlık tohum olmalı)');
  const der = ham.length === 32 ? Buffer.concat([PKCS8_ON_EK, ham]) : ham;
  let k;
  try {
    k = crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
  } catch {
    throw new Error('imza anahtarı çözülemedi (base64 PKCS8 ya da 32 baytlık tohum olmalı)');
  }
  if (k.asymmetricKeyType !== 'ed25519') throw new Error('imza anahtarı Ed25519 değil');
  return k;
}

/** KeyObject'in (gizli ya da açık) 32 baytlık ham açık anahtarı, base64 */
export function acikAnahtarB64(k) {
  const pub = k.type === 'private' ? crypto.createPublicKey(k) : k;
  const der = pub.export({ format: 'der', type: 'spki' });
  return Buffer.from(der.subarray(der.length - 32)).toString('base64');
}

/** Baytları imzalar → base64 imza */
export function imzala(bytes, gizli) {
  return crypto.sign(null, Buffer.from(bytes), gizli).toString('base64');
}

/** base64 ham açık anahtarla imzayı doğrular (hata fırlatmaz) */
export function dogrula(bytes, imzaB64, acikB64) {
  try {
    const ham = Buffer.from(String(acikB64).trim(), 'base64');
    const imza = Buffer.from(String(imzaB64 ?? '').trim(), 'base64');
    if (ham.length !== 32 || imza.length !== 64) return false;
    const pub = crypto.createPublicKey({ key: Buffer.concat([SPKI_ON_EK, ham]), format: 'der', type: 'spki' });
    return crypto.verify(null, Buffer.from(bytes), pub, imza);
  } catch {
    return false;
  }
}

/** Uygulamaya gömülü açık anahtar (src/lib/katalog-imza.ts) */
export function uygulamaAcikAnahtari(kok = KOK) {
  const ts = fs.readFileSync(path.join(kok, 'src', 'lib', 'katalog-imza.ts'), 'utf8');
  const m = ts.match(/KATALOG_ACIK_ANAHTAR\s*=\s*'([A-Za-z0-9+/=]{43,44})'/);
  if (!m) throw new Error('src/lib/katalog-imza.ts içinde KATALOG_ACIK_ANAHTAR bulunamadı');
  return m[1];
}

/** Gizli anahtarı sırayla dener; bulunamazsa null */
export function gizliAnahtarBul({ dosya, env = process.env, kok = KOK } = {}) {
  if (dosya) return gizliAnahtarOku(fs.readFileSync(dosya, 'utf8'));
  if (env.KATALOG_IMZA_ANAHTARI && env.KATALOG_IMZA_ANAHTARI.trim()) return gizliAnahtarOku(env.KATALOG_IMZA_ANAHTARI);
  if (env.KATALOG_IMZA_ANAHTARI_DOSYASI) return gizliAnahtarOku(fs.readFileSync(env.KATALOG_IMZA_ANAHTARI_DOSYASI, 'utf8'));
  const yerel = path.join(kok, '_gizli', 'katalog-imza-anahtari.txt');
  if (fs.existsSync(yerel)) return gizliAnahtarOku(fs.readFileSync(yerel, 'utf8'));
  return null;
}

/**
 * Katalog dosyasını imzalar, <dosya>.sig yazar, imzayı uygulamanın açık anahtarıyla doğrular.
 * Anahtar uygulamadakiyle eşleşmiyorsa hata fırlatır (yanlış gizli değişken sessizce geçmesin).
 */
export function dosyaImzala(dosya, gizli, acik = uygulamaAcikAnahtari()) {
  if (acikAnahtarB64(gizli) !== acik)
    throw new Error('imza anahtarı uygulamadaki açık anahtarla eşleşmiyor (src/lib/katalog-imza.ts); yanlış anahtar');
  const bytes = fs.readFileSync(dosya);
  const imza = imzala(bytes, gizli);
  if (!dogrula(bytes, imza, acik)) throw new Error('imza doğrulanamadı: ' + dosya);
  fs.writeFileSync(dosya + '.sig', imza + '\n');
  return imza;
}

function main() {
  const args = process.argv.slice(2);
  const al = (k) => {
    const i = args.indexOf(k);
    if (i < 0) return undefined;
    const v = args[i + 1];
    args.splice(i, 2);
    return v;
  };
  const yeni = al('--yeni-anahtar');
  if (yeni !== undefined) {
    if (!yeni) throw new Error('--yeni-anahtar <dosya> gerekli');
    if (fs.existsSync(yeni)) throw new Error('dosya zaten var, üzerine yazılmaz: ' + yeni);
    const { privateKey } = crypto.generateKeyPairSync('ed25519');
    const pkcs8 = privateKey.export({ format: 'der', type: 'pkcs8' }).toString('base64');
    fs.mkdirSync(path.dirname(path.resolve(yeni)), { recursive: true });
    fs.writeFileSync(
      yeni,
      '# Akıl Çantası katalog imza anahtarı (Ed25519, base64 PKCS8). GİZLİDİR: paylaşmayın, depoya koymayın.\n' +
        '# GitHub: Settings → Secrets and variables → Actions → KATALOG_IMZA_ANAHTARI = aşağıdaki tek satır.\n' +
        pkcs8 +
        '\n',
      { mode: 0o600 },
    );
    console.log('Gizli anahtar yazıldı: ' + yeni);
    console.log('Açık anahtar (src/lib/katalog-imza.ts → KATALOG_ACIK_ANAHTAR): ' + acikAnahtarB64(privateKey));
    return;
  }
  const yalnizDogrula = args.includes('--dogrula');
  const anahtarDosyasi = al('--anahtar');
  const dosyalar = args.filter((a) => !a.startsWith('--'));
  if (!dosyalar.length) dosyalar.push(path.join(KOK, 'public', 'packs-manifest.json'));
  const acik = uygulamaAcikAnahtari();
  if (yalnizDogrula) {
    let hata = 0;
    for (const d of dosyalar) {
      const sig = fs.existsSync(d + '.sig') ? fs.readFileSync(d + '.sig', 'utf8') : '';
      const ok = sig && dogrula(fs.readFileSync(d), sig, acik);
      console.log((ok ? 'İMZA GEÇERLİ  ' : 'İMZA GEÇERSİZ ') + d);
      if (!ok) hata++;
    }
    process.exit(hata ? 1 : 0);
  }
  const gizli = gizliAnahtarBul({ dosya: anahtarDosyasi });
  if (!gizli) throw new Error('imza anahtarı yok: KATALOG_IMZA_ANAHTARI ortam değişkeni ya da --anahtar <dosya> gerekli');
  if (args.includes('--denetle')) {
    if (acikAnahtarB64(gizli) !== acik) throw new Error('imza anahtarı uygulamadaki açık anahtarla eşleşmiyor (src/lib/katalog-imza.ts)');
    console.log('İmza anahtarı hazır; uygulamadaki açık anahtarla eşleşiyor.');
    return;
  }
  for (const d of dosyalar) {
    dosyaImzala(d, gizli, acik);
    console.log('İmzalandı: ' + path.relative(process.cwd(), d) + '.sig');
  }
}

// Başka bir betiğe paketlendiğinde (tools/hf/hf-yukle.mjs) komut satırı kısmı çalışmasın
if (process.argv[1] && path.basename(process.argv[1]) === 'katalog-imzala.mjs' && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error('HATA: ' + (e?.message ?? e));
    process.exit(1);
  }
}
