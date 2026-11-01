// Şebekesiz mesh: tel (wire) protokolü — çerçeve biçimi, şema denetimi,
// boyut sınırları, TTL / sıçrama (hop) sınırı.
//
// Taşıyıcı (Android'de Google Nearby Connections) yalnızca bayt taşır.
// Her çerçeve UTF-8 JSON metnidir ve tek bir BYTES yüküne sığar.
// Nearby BYTES yük sınırı ConnectionsClient.MAX_BYTES_DATA_SIZE'dır
// (belgelerde sayı verilmez; pratikte 32 KiB). Güvenli olmak için 30 000
// bayt kullanıyoruz; yerel eklenti gerçek değeri bildirirse küçüğü seçilir.

import type { MeshMessage } from '../mesh';

export const PROTOCOL_VERSION = 1;
export const MAX_FRAME_BYTES = 30_000;
export const MAX_TEXT = 1000;
export const MAX_FROM = 40;
export const MAX_HOPS = 12;
/** Bir "have"/"want" çerçevesindeki en fazla kimlik sayısı */
export const MAX_IDS_PER_FRAME = 400;
export const KINDS: readonly MeshMessage['kind'][] = ['mesaj', 'iyiyim', 'kayip', 'duyuru', 'sos'];

const HOUR = 3600_000;
/** Mesaj türüne göre yaşam süresi (oluşturma zamanından itibaren). */
export const TTL_MS: Record<MeshMessage['kind'], number> = {
  mesaj: 72 * HOUR,
  duyuru: 72 * HOUR,
  sos: 72 * HOUR,
  iyiyim: 7 * 24 * HOUR,
  kayip: 7 * 24 * HOUR,
};
/** Saati ileri ayarlı telefonlara tolerans */
export const MAX_FUTURE_SKEW_MS = 24 * HOUR;
/** 2020-01-01; saati sıfırlanmış cihazların 1970 tarihli mesajlarını reddet */
export const MIN_TIME = 1577836800000;

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const NODE_RE = /^[A-Za-z0-9_-]{4,32}$/;

export type Frame =
  | { t: 'hello'; v: number; node: string; name: string }
  | { t: 'have'; ids: string[] }
  | { t: 'want'; ids: string[] }
  | { t: 'msgs'; ms: MeshMessage[] };

const enc = new TextEncoder();
export function byteLength(s: string): number {
  return enc.encode(s).length;
}

function rand(n: number): string {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const b = new Uint8Array(n);
  const c = (globalThis as any).crypto;
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(b);
  else for (let i = 0; i < n; i++) b[i] = Math.floor(Math.random() * 256);
  let s = '';
  for (let i = 0; i < n; i++) s += abc[b[i] % abc.length];
  return s;
}

/** Yeni mesaj kimliği: zaman (base36) + 10 rastgele karakter */
export function newMessageId(now = Date.now()): string {
  return now.toString(36) + '-' + rand(10);
}

export function newNodeId(): string {
  return rand(12);
}

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && ID_RE.test(id);
}

function finite(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

/**
 * Bir mesajı şemaya göre denetler ve temiz bir kopya döndürür
 * (bilinmeyen alanlar atılır). Geçersizse null.
 */
export function sanitizeMessage(x: unknown, now = Date.now()): MeshMessage | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  if (!isValidId(o.id)) return null;
  if (typeof o.kind !== 'string' || !KINDS.includes(o.kind as MeshMessage['kind'])) return null;
  if (typeof o.from !== 'string' || o.from.length > MAX_FROM) return null;
  if (typeof o.text !== 'string' || o.text.length > MAX_TEXT) return null;
  if (!finite(o.time) || o.time < MIN_TIME || o.time > now + MAX_FUTURE_SKEW_MS) return null;
  const m: MeshMessage = {
    id: o.id,
    kind: o.kind as MeshMessage['kind'],
    from: o.from,
    text: o.text,
    time: Math.round(o.time),
  };
  if (o.lat !== undefined || o.lon !== undefined) {
    if (!finite(o.lat) || !finite(o.lon) || Math.abs(o.lat) > 90 || Math.abs(o.lon) > 180) return null;
    m.lat = o.lat;
    m.lon = o.lon;
  }
  if (o.hops !== undefined) {
    if (!finite(o.hops) || !Number.isInteger(o.hops) || o.hops < 0 || o.hops > 255) return null;
    m.hops = o.hops;
  } else m.hops = 0;
  return m;
}

export function isExpired(m: MeshMessage, now = Date.now()): boolean {
  return now - m.time > TTL_MS[m.kind];
}

/** Bu düğüm mesajı başka cihazlara aktarmalı mı? */
export function isForwardable(m: MeshMessage, now = Date.now()): boolean {
  return !isExpired(m, now) && (m.hops ?? 0) < MAX_HOPS;
}

function idList(x: unknown): string[] | null {
  if (!Array.isArray(x) || x.length > MAX_IDS_PER_FRAME) return null;
  const out: string[] = [];
  for (const id of x) {
    if (!isValidId(id)) return null;
    out.push(id);
  }
  return out;
}

/**
 * Gelen ham çerçeveyi çözer ve doğrular. Boyut aşımı, bozuk JSON veya
 * şema dışı içerik → null. "msgs" içinde geçersiz mesajlar tek tek atılır.
 */
export function decodeFrame(raw: unknown, now = Date.now(), maxBytes = MAX_FRAME_BYTES): Frame | null {
  if (typeof raw !== 'string') return null;
  // UTF-16 uzunluğu × 3 ≥ UTF-8 bayt sayısı; ucuz ön denetim
  if (raw.length > maxBytes || byteLength(raw) > maxBytes) return null;
  let o: any;
  try {
    o = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  switch (o.t) {
    case 'hello': {
      if (!finite(o.v) || typeof o.node !== 'string' || !NODE_RE.test(o.node)) return null;
      const name = typeof o.name === 'string' ? o.name.slice(0, MAX_FROM) : '';
      return { t: 'hello', v: o.v, node: o.node, name };
    }
    case 'have':
    case 'want': {
      const ids = idList(o.ids);
      return ids ? { t: o.t, ids } : null;
    }
    case 'msgs': {
      if (!Array.isArray(o.ms) || o.ms.length > 200) return null;
      const ms: MeshMessage[] = [];
      for (const x of o.ms) {
        const m = sanitizeMessage(x, now);
        if (m) ms.push(m);
      }
      return { t: 'msgs', ms };
    }
    default:
      return null;
  }
}

export function encodeFrame(f: Frame): string {
  return JSON.stringify(f);
}

/** Kimlik listesini sınıra uyan "have"/"want" çerçevelerine böler */
export function idFrames(t: 'have' | 'want', ids: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < ids.length; i += MAX_IDS_PER_FRAME) {
    out.push(encodeFrame({ t, ids: ids.slice(i, i + MAX_IDS_PER_FRAME) }));
  }
  return out;
}

/**
 * Mesajları her biri maxBytes'ı aşmayan "msgs" çerçevelerine paketler.
 * Tek başına sınırı aşan mesaj (olmamalı: metin ≤ 1000 karakter) atlanır.
 */
export function packMessages(ms: MeshMessage[], maxBytes = MAX_FRAME_BYTES): string[] {
  const out: string[] = [];
  const overhead = byteLength('{"t":"msgs","ms":[]}');
  let cur: string[] = [];
  let size = overhead;
  for (const m of ms) {
    const s = JSON.stringify(m);
    const n = byteLength(s);
    if (overhead + n > maxBytes) continue;
    const extra = cur.length ? n + 1 : n;
    if (size + extra > maxBytes || cur.length >= 200) {
      out.push('{"t":"msgs","ms":[' + cur.join(',') + ']}');
      cur = [];
      size = overhead;
    }
    cur.push(s);
    size += cur.length > 1 ? n + 1 : n;
  }
  if (cur.length) out.push('{"t":"msgs","ms":[' + cur.join(',') + ']}');
  return out;
}
