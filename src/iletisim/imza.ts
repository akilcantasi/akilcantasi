// İmzalı pano kayıtları: cihaz kimliği, imzalama ve (önbellekli, parça parça) doğrulama.
//
// - Her cihaz bir kez Ed25519 anahtar çifti üretir; localStorage'da saklanır. Yüksek değerli bir
//   sır değildir: yalnızca "bu ilanı bu telefon verdi" demeye yarar. Silinirse eski ilanların
//   durumu bu telefondan da değiştirilemez (yeni ilan verilebilir).
// - Kanonik biçim server/imza-kanonik.mjs'tedir; sunucu aynı dosyayı kullanır.
// - Bilgi noktası (http://192.168.x.x) güvenli köken olmadığı için crypto.subtle yoktur;
//   SHA-512 @noble/hashes ile, eşzamanlı yapılır.
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { useEffect, useState } from 'preact/hooks';
import { b64uCoz, b64uKodla, kanonikBilgiNoktasi, kanonikDurum, kanonikIlan, kimlikBagli, kimlikOneki, PUB_RE, type DurumGuncelleme } from '../../server/imza-kanonik.mjs';
import { updDogrulayiciKoy, type BoardDraft, type BoardItem, type BoardStatus, type MissingStatus } from './board';
import { defaultKV, type KV } from './outbox';

ed.etc.sha512Sync = (...m: Uint8Array[]) => sha512(ed.etc.concatBytes(...m));

const enc = new TextEncoder();

export const IMZA_KEYS = {
  kimlik: 'ac.comm.kimlik',
  pin: 'ac.comm.bnpin',
};

// ---- Cihaz kimliği ----

interface Kimlik {
  gizli: Uint8Array;
  pub: string;
}
let kimlikBellek: Kimlik | null = null;

/** Bu cihazın anahtar çifti; yoksa üretir. Depolama kapalıysa yalnız bu oturum için bellekte tutulur. */
export function kimlik(kv: KV = defaultKV()): Kimlik | null {
  if (kimlikBellek) return kimlikBellek;
  try {
    let raw: any = null;
    try {
      raw = JSON.parse(kv.getItem(IMZA_KEYS.kimlik) || 'null');
    } catch {}
    if (raw && raw.v === 1 && typeof raw.gizli === 'string') {
      const g = b64uCoz(raw.gizli);
      if (g && g.length === 32) {
        const pub = b64uKodla(ed.getPublicKey(g));
        kimlikBellek = { gizli: g, pub };
        return kimlikBellek;
      }
    }
    const g = ed.utils.randomPrivateKey();
    const pub = b64uKodla(ed.getPublicKey(g));
    kimlikBellek = { gizli: g, pub };
    try {
      kv.setItem(IMZA_KEYS.kimlik, JSON.stringify({ v: 1, gizli: b64uKodla(g), pub }));
    } catch {
      /* kota / özel mod: oturumluk anahtar */
    }
    return kimlikBellek;
  } catch {
    return null;
  }
}

/** Testler için: bellekteki kimliği unut (yeniden depodan okunur) */
export function kimligiUnut() {
  kimlikBellek = null;
}

export function benimAnahtarim(): string | null {
  return kimlik()?.pub ?? null;
}

function imzala(g: Uint8Array, msg: string): string {
  return b64uKodla(ed.sign(enc.encode(msg), g));
}

function dogrulaHam(pub: string, msg: string, sig: string): boolean {
  try {
    const p = b64uCoz(pub);
    const s = b64uCoz(sig);
    if (!p || p.length !== 32 || !s || s.length !== 64) return false;
    return ed.verify(s, enc.encode(msg), p);
  } catch {
    return false;
  }
}

/**
 * Yeni ilanı imzalar (pub, sig, ts eklenir). Taslak önceden validateDraft'tan geçmiş olmalı:
 * imza temizlenmiş metin üzerinedir, sunucu da aynı temizliği yapar. İmzalanamazsa (anahtar
 * üretilemedi) taslak imzasız döner; eski kayıt gibi davranır.
 */
export function ilanImzala(d: BoardDraft, now = Date.now(), k: Kimlik | null = kimlik()): BoardDraft {
  if (!k) return d;
  const { pub: _p, sig: _s, ts: _t, upd: _u, ...temel } = d;
  const ts = Math.round(now);
  // Kimlik anahtara bağlanır (kimlikBagli): önek yoksa eklenir, 64 karakter sınırına kırpılır
  const id = kimlikBagli(temel.id, k.pub) ? temel.id : (kimlikOneki(k.pub) + temel.id).slice(0, 64);
  const out: BoardDraft = { ...temel, id, pub: k.pub, ts };
  // Kayıp ilanı her zaman "aranıyor" olarak başlar; sonraki durumu imzalı güncelleme belirler
  if (out.kind === 'kayip') out.status = 'araniyor';
  try {
    out.sig = imzala(k.gizli, kanonikIlan(out as Required<Pick<BoardDraft, 'ts' | 'pub'>> & BoardDraft));
    return out;
  } catch {
    return d;
  }
}

/** Kayıp ilanının durumunu değiştiren imzalı güncelleme; ilan bu cihazın değilse null */
export function durumImzala(it: BoardDraft, st: MissingStatus, now = Date.now(), k: Kimlik | null = kimlik()): DurumGuncelleme | null {
  if (!k || !it.pub || it.pub !== k.pub || it.kind !== 'kayip') return null;
  // Zaman her güncellemede artar: eski bir güncelleme yenisinin yerine geçirilemez
  const ts = Math.max(Math.round(now), (it.upd?.ts ?? 0) + 1, (it.ts ?? 0) + 1);
  try {
    return { st, ts, sig: imzala(k.gizli, kanonikDurum(it.id, st, ts, it.pub)) };
  } catch {
    return null;
  }
}

// ---- Doğrulama ----

export type ImzaSonuc = 'imzasiz' | 'gecerli' | 'gecersiz';

export interface Dogrulama {
  /** ilanın kendi imzası */
  ilan: ImzaSonuc;
  /** imzalı kayıp ilanında durum güncellemesi: yok (hiç değişmemiş), geçerli ya da geçersiz */
  durum: 'yok' | 'gecerli' | 'gecersiz';
  /** bilgi noktası imzası (local kayıtta); anahtarın sabitlenmiş olup olmadığına arayüz bakar */
  bn: ImzaSonuc;
  /** gösterilecek durum: imzalı kayıpta yalnız geçerli güncellemeden gelir */
  status?: BoardStatus;
}

/** Eşzamanlı doğrulama (birim testleri ve kuyruk kullanır) */
export function dogrula(it: BoardItem): Dogrulama {
  const d: Dogrulama = { ilan: 'imzasiz', durum: 'yok', bn: 'imzasiz', status: it.status };
  if (it.pub && it.sig && it.ts) {
    // Kimliği anahtarına bağlı olmayan imzalı kayıt doğrulanmış sayılmaz (kimlik kapma girişimi)
    d.ilan = kimlikBagli(it.id, it.pub) && dogrulaHam(it.pub, kanonikIlan(it as BoardItem & { pub: string; ts: number }), it.sig) ? 'gecerli' : 'gecersiz';
    if (it.kind === 'kayip') {
      if (it.upd) {
        const ok = d.ilan === 'gecerli' && dogrulaHam(it.pub, kanonikDurum(it.id, it.upd.st, it.upd.ts, it.pub), it.upd.sig);
        d.durum = ok ? 'gecerli' : 'gecersiz';
        d.status = ok ? it.upd.st : 'araniyor';
      } else {
        // İmzalı ilan güncellemesiz "bulundu" olamaz (biri imzayı atlatmaya çalışmış)
        d.durum = it.status && it.status !== 'araniyor' ? 'gecersiz' : 'yok';
        d.status = 'araniyor';
      }
    }
  }
  if (it.local && it.bpub && it.bsig) d.bn = dogrulaHam(it.bpub, kanonikBilgiNoktasi(it, it.bpub), it.bsig) ? 'gecerli' : 'gecersiz';
  return d;
}

/** Önbellek anahtarı: imzaya giren her şey (aynı kimlikli ama değiştirilmiş kopya ayrı sonuç alır) */
function anahtar(it: BoardItem): string {
  return JSON.stringify([it.id, it.kind, it.from, it.text, it.status ?? '', it.lat ?? null, it.lon ?? null, it.ts ?? 0, it.pub ?? '', it.sig ?? '', it.upd ?? null, it.local ? [it.time, it.bpub ?? '', it.bsig ?? ''] : 0]);
}

const imzasizMi = (it: BoardItem) => !it.pub && !(it.local && it.bsig);

const onbellek = new Map<string, Dogrulama>();
const kuyruk = new Map<string, BoardItem>();
const dinleyiciler = new Set<() => void>();
let zamanlayici: ReturnType<typeof setTimeout> | null = null;
const ONBELLEK_EN_COK = 3000;
/** Bir dilimde en çok bu kadar ms doğrulama (arayüz takılmasın) */
const DILIM_MS = 8;

function isle() {
  zamanlayici = null;
  const bas = Date.now();
  for (const [k, it] of kuyruk) {
    kuyruk.delete(k);
    if (onbellek.size >= ONBELLEK_EN_COK) onbellek.clear();
    onbellek.set(k, dogrula(it));
    if (Date.now() - bas > DILIM_MS) break;
  }
  if (kuyruk.size) zamanlayici = setTimeout(isle, 0);
  dinleyiciler.forEach((l) => l());
}

/** Kaydı doğrulama kuyruğuna ekler; sonuç önbellekte varsa hemen döner, yoksa null (bekliyor). */
export function dogrulamaSonucu(it: BoardItem): Dogrulama | null {
  if (imzasizMi(it)) return { ilan: 'imzasiz', durum: 'yok', bn: 'imzasiz', status: it.status };
  const k = anahtar(it);
  const r = onbellek.get(k);
  if (r) return r;
  if (!kuyruk.has(k)) {
    kuyruk.set(k, it);
    if (!zamanlayici) zamanlayici = setTimeout(isle, 0);
  }
  return null;
}

/** Kuyruk boşalınca çözülür (testler ve mesh alımı için) */
export function dogrulaAsync(it: BoardItem): Promise<Dogrulama> {
  const r = dogrulamaSonucu(it);
  if (r) return Promise.resolve(r);
  return new Promise((res) => {
    const l = () => {
      const x = onbellek.get(anahtar(it));
      if (x) {
        dinleyiciler.delete(l);
        res(x);
      }
    };
    dinleyiciler.add(l);
  });
}

/**
 * Arayüz kancası: dönen işlev kaydın doğrulama sonucunu (ya da bekliyorsa null) verir.
 * Doğrulama arka planda dilim dilim yapılır; bitince bileşen yeniden çizilir.
 */
export function useDogrulama(): (it: BoardItem) => Dogrulama | null {
  const [, setV] = useState(0);
  useEffect(() => {
    const l = () => setV((v) => v + 1);
    dinleyiciler.add(l);
    return () => void dinleyiciler.delete(l);
  }, []);
  return dogrulamaSonucu;
}

// ---- Bilgi noktası anahtarı: ilk görüşte sabitlenir (TOFU) ----

function pinOku(kv: KV): Record<string, string> {
  try {
    const v = JSON.parse(kv.getItem(IMZA_KEYS.pin) || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

/** "" (sayfanın geldiği sunucu) için köken kullanılır */
export function pinAdi(base: string): string {
  if (base) return base;
  try {
    return typeof location !== 'undefined' ? location.origin : '';
  } catch {
    return '';
  }
}

/**
 * Bilgi noktasının bildirdiği anahtarı sabitler. İlk görüşte kaydeder ('yeni'), aynıysa 'ayni',
 * önceden başka anahtar kaydedilmişse 'farkli' (sabitleme değişmez; kullanıcı sıfırlayabilir).
 */
export function bnPinle(base: string, pub: unknown, kv: KV = defaultKV()): 'yeni' | 'ayni' | 'farkli' | 'yok' {
  if (typeof pub !== 'string' || !PUB_RE.test(pub)) return 'yok';
  const ad = pinAdi(base);
  const p = pinOku(kv);
  if (p[ad] === pub) return 'ayni';
  if (p[ad]) return 'farkli';
  p[ad] = pub;
  // Sınırsız büyümesin: en çok 50 bilgi noktası
  const adlar = Object.keys(p);
  if (adlar.length > 50) delete p[adlar[0]];
  try {
    kv.setItem(IMZA_KEYS.pin, JSON.stringify(p));
  } catch {}
  return 'yeni';
}

export function bnPinSifirla(base: string, kv: KV = defaultKV()) {
  const p = pinOku(kv);
  delete p[pinAdi(base)];
  try {
    kv.setItem(IMZA_KEYS.pin, JSON.stringify(p));
  } catch {}
}

/** Bu anahtar herhangi bir bilgi noktası için sabitlenmiş mi? */
export function bnSabitMi(bpub: string | undefined, kv: KV = defaultKV()): boolean {
  if (!bpub) return false;
  return Object.values(pinOku(kv)).includes(bpub);
}

// Birleştirme (mergeItems) doğrulanamayan durum güncellemesini doğrulanmışın önüne koymasın
const updOnbellek = new Map<string, boolean>();
updDogrulayiciKoy((it) => {
  if (!it.upd) return true;
  const k = anahtar(it);
  let ok = updOnbellek.get(k);
  if (ok === undefined) {
    ok = dogrula(it).durum === 'gecerli';
    if (updOnbellek.size >= 2000) updOnbellek.clear();
    updOnbellek.set(k, ok);
  }
  return ok;
});
