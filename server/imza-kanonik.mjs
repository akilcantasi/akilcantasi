// İmzalı pano ve mesh kayıtları: kanonik biçim ve imza alanlarının denetimi.
// Bağımlılıksızdır; hem tarayıcı (src/iletisim/imza.ts) hem bilgi noktası sunucusu
// (server/server.mjs) bu dosyayı kullanır. Android bilgi noktası (InfoPointServer.java)
// durum güncellemesi biçimini (kanonikDurum) aynen kurar.
//
// İmza Ed25519'dur. Açık anahtar (pub) 32 bayt, imza (sig) 64 bayttır; ikisi de
// dolgusuz base64url metin olarak taşınır (43 ve 86 karakter).
//
// Kanonik biçim bir JSON dizisidir: alan sırası sabit, ayraç karışıklığı olmaz,
// JSON.stringify her JavaScript ortamında aynı çıktıyı verir.

export const PUB_RE = /^[A-Za-z0-9_-]{43}$/;
export const SIG_RE = /^[A-Za-z0-9_-]{86}$/;
export const DURUMLAR = ['araniyor', 'bulundu'];
/** 2020-01-01 … 5138 yılı: saati sıfırlanmış ya da saçma zaman damgaları reddedilir */
export const TS_MIN = 1577836800000;
export const TS_MAX = 1e14;

function tsUygun(x) {
  return typeof x === 'number' && Number.isInteger(x) && x >= TS_MIN && x <= TS_MAX;
}

/**
 * İlanın değişmez alanları. Kayıp ilanının durumu değişebildiği için imzaya girmez;
 * durumu ayrı, imzalı güncelleme (upd) belirler. "iyiyim" bildiriminin durumu değişmez, imzaya girer.
 * @param {{id:string,kind:string,from:string,text:string,status?:string,lat?:number,lon?:number,ts:number,pub:string}} it
 */
export function kanonikIlan(it) {
  return JSON.stringify([
    'akil-ilan-1',
    it.id,
    it.kind,
    it.from,
    it.text,
    it.kind === 'iyiyim' ? (it.status ?? 'iyiyim') : '',
    it.lat ?? null,
    it.lon ?? null,
    it.ts,
    it.pub,
  ]);
}

/**
 * İmzalı kaydın kimliği anahtarına bağlıdır: kimlik, açık anahtarın ilk 10 karakteri ve "-" ile
 * başlar. Böylece başkası aynı kimliği kendi anahtarıyla imzalayıp önce davranarak ilanı
 * "kapamaz" (aynı önekli anahtar bulmak ~2^60 deneme ister).
 */
export const ONEK_UZ = 10;
export function kimlikOneki(pub) {
  return String(pub).slice(0, ONEK_UZ) + '-';
}
/** İmzalı kaydın kimliği anahtarına bağlı mı? */
export function kimlikBagli(id, pub) {
  return typeof id === 'string' && typeof pub === 'string' && PUB_RE.test(pub) && id.startsWith(kimlikOneki(pub));
}

/** Kayıp ilanı durum güncellemesi: ilan kimliği, yeni durum, zaman ve ilanın anahtarı */
export function kanonikDurum(id, st, ts, pub) {
  return JSON.stringify(['akil-durum-1', id, st, ts, pub]);
}

/** Bilgi noktası cihazının kendi kaydına (local) attığı ek imza */
export function kanonikBilgiNoktasi(it, bpub) {
  return JSON.stringify([
    'akil-bn-1',
    it.id,
    it.kind,
    it.from,
    it.text,
    it.kind === 'iyiyim' ? (it.status ?? 'iyiyim') : '',
    it.lat ?? null,
    it.lon ?? null,
    it.time,
    bpub,
  ]);
}

/**
 * Ham kayıttaki imza alanlarını denetler (imzanın kendisini DOĞRULAMAZ).
 * İmzasız eski kayıt → {ok:true, f:null}. Biçim bozuksa → {ok:false, error}.
 * @returns {{ok:true, f:null|{pub:string,sig:string,ts:number,upd?:{st:string,ts:number,sig:string}}}|{ok:false,error:string}}
 */
export function imzaAlanlari(raw, kind) {
  if (!raw || typeof raw !== 'object') return { ok: true, f: null };
  if (raw.pub == null && raw.sig == null) return { ok: true, f: null };
  if (typeof raw.pub !== 'string' || !PUB_RE.test(raw.pub)) return { ok: false, error: 'Geçersiz anahtar' };
  if (typeof raw.sig !== 'string' || !SIG_RE.test(raw.sig)) return { ok: false, error: 'Geçersiz imza' };
  if (!tsUygun(raw.ts)) return { ok: false, error: 'Geçersiz imza zamanı' };
  const f = { pub: raw.pub, sig: raw.sig, ts: raw.ts };
  if (raw.upd != null) {
    const u = raw.upd;
    if (kind !== 'kayip' || !u || typeof u !== 'object' || Array.isArray(u)) return { ok: false, error: 'Geçersiz durum güncellemesi' };
    if (!DURUMLAR.includes(u.st) || !tsUygun(u.ts) || typeof u.sig !== 'string' || !SIG_RE.test(u.sig))
      return { ok: false, error: 'Geçersiz durum güncellemesi' };
    f.upd = { st: u.st, ts: u.ts, sig: u.sig };
  }
  return { ok: true, f };
}

/** Bilgi noktası imzası alanları (yalnız sunucudan gelen kayıtta anlamlı); bozuksa null */
export function bnAlanlari(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.bpub !== 'string' || !PUB_RE.test(raw.bpub)) return null;
  if (typeof raw.bsig !== 'string' || !SIG_RE.test(raw.bsig)) return null;
  return { bpub: raw.bpub, bsig: raw.bsig };
}

// ---- dolgusuz base64url (tarayıcıda Buffer yok) ----

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** @param {Uint8Array} b */
export function b64uKodla(b) {
  let s = '';
  let i = 0;
  for (; i + 2 < b.length; i += 3) {
    const n = (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
    s += ABC[n >> 18] + ABC[(n >> 12) & 63] + ABC[(n >> 6) & 63] + ABC[n & 63];
  }
  if (i < b.length) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8);
    s += ABC[n >> 18] + ABC[(n >> 12) & 63];
    if (i + 1 < b.length) s += ABC[(n >> 6) & 63];
  }
  return s;
}

/** Geçersiz karakterde null */
export function b64uCoz(s) {
  if (typeof s !== 'string' || s.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor((s.length * 3) / 4));
  let bits = 0;
  let val = 0;
  let j = 0;
  for (let i = 0; i < s.length; i++) {
    const c = ABC.indexOf(s[i]);
    if (c < 0) return null;
    val = (val << 6) | c;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[j++] = (val >> bits) & 255;
    }
  }
  return out;
}
