// İnternetten gelen paket kataloğunun imza denetimi (Ed25519).
//
// Uygulamayla gelen katalog (public/packs-manifest.json) uygulamanın kendisiyle birlikte gelir ve
// güvenilirdir. Hugging Face'teki merkezi katalog ise ancak yanında projenin anahtarıyla atılmış
// geçerli bir imza (packs-manifest.json.sig: 64 baytlık imzanın base64 hâli) varsa kabul edilir.
// İmza, katalog dosyasının baytları üzerinedir; tools/katalog-imzala.mjs üretir.
// Ayrıntı: docs/PAKET_GUVENLIGI.md
import { verify, etc } from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2';

// @noble/ed25519 v2 eşzamanlı doğrulama için SHA-512 ister. WebCrypto kullanılmaz: bilgi noktası
// sayfası düz http'de açıldığında (güvenli bağlam değil) crypto.subtle yoktur.
if (!etc.sha512Sync) etc.sha512Sync = (...m: Uint8Array[]) => sha512(etc.concatBytes(...m));

/** Projenin katalog imza açık anahtarı (32 bayt, base64). Gizli anahtar yalnız proje sahibindedir. */
export const KATALOG_ACIK_ANAHTAR = 'Tef/ov2ZI1jD4HaJMP8TPDJRl2lorDWbI7X5LpDXg+4=';

function b64(s: string): Uint8Array | null {
  try {
    const t = s.trim().replace(/-/g, '+').replace(/_/g, '/');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(t)) return null;
    const bin = atob(t);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

/**
 * Katalog baytlarının imzasını doğrular. İmza yoksa, biçimi bozuksa ya da tutmazsa false;
 * hiçbir zaman hata fırlatmaz.
 */
export function katalogImzasiGecerli(bytes: Uint8Array, imzaB64: string | null | undefined, acikB64 = KATALOG_ACIK_ANAHTAR): boolean {
  if (!imzaB64) return false;
  const imza = b64(imzaB64);
  const acik = b64(acikB64);
  if (!imza || imza.length !== 64 || !acik || acik.length !== 32) return false;
  try {
    return verify(imza, bytes, acik);
  } catch {
    return false;
  }
}
