// Giden kutusu ve yerel önbellek (localStorage). Bilgi noktası yokken yazılan
// kayıtlar burada bekler; sunucuya ulaşılınca sırayla gönderilir. Sunucu
// kimliğe göre tekilleştirdiği için yeniden göndermek güvenlidir.
import type { BoardDraft, BoardItem } from './board';
import { fromServer, mergeItems } from './board';

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

/** localStorage yoksa (özel mod, Node) bellekte tutar */
export function memoryKV(): KV {
  const m = new Map<string, string>();
  return {
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
  };
}

let fallback: KV | null = null;
export function defaultKV(): KV {
  try {
    if (typeof localStorage !== 'undefined') {
      const t = '__ac_t';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return localStorage;
    }
  } catch {}
  return (fallback ??= memoryKV());
}

function readJson<T>(kv: KV, key: string, def: T): T {
  try {
    const s = kv.getItem(key);
    return s ? (JSON.parse(s) as T) : def;
  } catch {
    return def;
  }
}
function writeJson(kv: KV, key: string, v: unknown) {
  try {
    kv.setItem(key, JSON.stringify(v));
  } catch {
    /* kota dolu: sessizce geç */
  }
}

export const KEYS = {
  outbox: 'ac.comm.outbox',
  cache: 'ac.comm.cache',
  profile: 'ac.comm.profile',
};

export const OUTBOX_MAX = 100;
export const CACHE_MAX = 400;

export interface OutboxEntry {
  draft: BoardDraft;
  /** yerelde oluşturulma zamanı */
  created: number;
  tries: number;
  lastError?: string;
}

export class Outbox {
  constructor(private kv: KV = defaultKV()) {}

  list(): OutboxEntry[] {
    const v = readJson<OutboxEntry[]>(this.kv, KEYS.outbox, []);
    return Array.isArray(v) ? v.filter((e) => e && e.draft && typeof e.draft.id === 'string') : [];
  }

  private save(list: OutboxEntry[]) {
    writeJson(this.kv, KEYS.outbox, list.slice(-OUTBOX_MAX));
  }

  /** Aynı kimlik zaten varsa yerine yazar (ör. kayıp → bulundu) */
  add(draft: BoardDraft, now = Date.now()) {
    const list = this.list();
    const i = list.findIndex((e) => e.draft.id === draft.id);
    const entry: OutboxEntry = { draft, created: i >= 0 ? list[i].created : now, tries: 0 };
    if (i >= 0) list[i] = entry;
    else list.push(entry);
    this.save(list);
  }

  remove(id: string) {
    this.save(this.list().filter((e) => e.draft.id !== id));
  }

  size() {
    return this.list().length;
  }

  /**
   * Bekleyenleri pano görünümüne katmak için. rev en büyük değerdir: kullanıcının
   * henüz gönderilmemiş değişikliği (ör. kayıp → bulundu) sunucudaki eski
   * kopyanın önünde görünür; gönderilince kutudan çıkar ve sunucu kopyası kalır.
   */
  asItems(): BoardItem[] {
    return this.list().map((e) => ({ ...e.draft, time: e.created, rev: Number.MAX_SAFE_INTEGER, pending: true }));
  }

  /**
   * Sırayla gönderir. post(): 'ok' (kabul / zaten var), 'reject' (geçersiz,
   * kalıcı hata: kutudan atılır), 'retry' (ağ / hız sınırı: kalır, durulur).
   */
  async flush(post: (d: BoardDraft) => Promise<{ result: 'ok' | 'reject' | 'retry'; error?: string }>) {
    let sent = 0;
    let rejected = 0;
    const rejects: { id: string; error?: string }[] = [];
    for (const e of this.list()) {
      let r: { result: 'ok' | 'reject' | 'retry'; error?: string };
      try {
        r = await post(e.draft);
      } catch (err: any) {
        r = { result: 'retry', error: String(err?.message ?? err) };
      }
      if (r.result === 'ok') {
        this.remove(e.draft.id);
        sent++;
      } else if (r.result === 'reject') {
        this.remove(e.draft.id);
        rejected++;
        rejects.push({ id: e.draft.id, error: r.error });
      } else {
        const list = this.list();
        const cur = list.find((x) => x.draft.id === e.draft.id);
        if (cur) {
          cur.tries++;
          cur.lastError = r.error;
          this.save(list);
        }
        break; // sunucuya şu an ulaşılamıyor: sonra yeniden dene
      }
    }
    return { sent, rejected, rejects, left: this.size() };
  }
}

/** Görülen pano kayıtlarının yerel önbelleği (bağlantı kopunca da görünsün) */
export class BoardCache {
  constructor(private kv: KV = defaultKV()) {}

  load(): { items: BoardItem[]; since: number; server: string } {
    const v = readJson<{ items: BoardItem[]; since: number; server: string }>(this.kv, KEYS.cache, { items: [], since: 0, server: '' });
    // Önbellekteki her kayıt yeniden doğrulanır: eski sürümlerin ya da bozuk bir sunucunun
    // yazdığı hatalı kayıt ekranı çökertmesin
    const items = (Array.isArray(v.items) ? v.items : [])
      .map((i: any) => {
        const ok = fromServer(i);
        return ok && i.viaMesh === true ? { ...ok, viaMesh: true } : ok;
      })
      .filter((i): i is BoardItem => !!i);
    return { items, since: Number(v.since) || 0, server: String(v.server ?? '') };
  }

  /** Yeni kayıtları ekler; en yeni CACHE_MAX kayıt tutulur */
  merge(items: BoardItem[], since: number, server: string): BoardItem[] {
    const cur = this.load();
    // Başka bilgi noktasına geçildiyse eski kayıtlar korunur ama since sıfırlanır
    const merged = mergeItems(cur.items, items.map((i) => ({ ...i, pending: undefined }))).slice(0, CACHE_MAX);
    writeJson(this.kv, KEYS.cache, { items: merged, since, server });
    return merged;
  }
}

export interface Profile {
  name: string;
  /** aile / yakın telefon numarası (SMS için) */
  family: string;
  familyName: string;
  /** elle girilen bilgi noktası adresi (ör. 192.168.43.1:8080) */
  server: string;
}

export function loadProfile(kv: KV = defaultKV()): Profile {
  const p = readJson<Partial<Profile>>(kv, KEYS.profile, {});
  return { name: String(p.name ?? ''), family: String(p.family ?? ''), familyName: String(p.familyName ?? ''), server: String(p.server ?? '') };
}

export function saveProfile(p: Partial<Profile>, kv: KV = defaultKV()): Profile {
  const next = { ...loadProfile(kv), ...p };
  writeJson(kv, KEYS.profile, next);
  return next;
}

/** "192.168.43.1:8080" / "http://…/" → "http://192.168.43.1:8080"; geçersizse null */
export function normalizeServer(input: string): string | null {
  let s = input.trim();
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'http://' + s;
  try {
    const u = new URL(s);
    if (!u.hostname) return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

/** Telefon numarası: rakam ve baştaki + kalır */
export function cleanPhone(s: string): string {
  const t = s.trim();
  return (t.startsWith('+') ? '+' : '') + t.replace(/\D/g, '').slice(0, 15);
}
