// Biriktir-ve-ilet (store-and-forward) dedikodu düğümü.
// Taşıyıcıdan bağımsızdır: yalnızca peerUp / peerDown / receive olaylarını
// alır ve transport.send(peer, frame) ile metin çerçeveleri yollar.
// Böylece aynı kod Android'de Nearby ile, testlerde sanal ağla çalışır.
//
// Akış:
//  1. Bağlantı kurulunca iki taraf da "hello" + "have" (özet vektörü:
//     aktarılabilir mesaj kimlikleri) gönderir.
//  2. "have" alan taraf, kendisinde olmayan ve daha önce görmediği
//     kimlikleri "want" ile ister.
//  3. "want" alan taraf mesajları "msgs" çerçevelerine paketleyip yollar.
//  4. Yeni bir mesaj (kendi mesajımız ya da gelen) o anda bağlı olup
//     mesajı bilmeyen tüm komşulara hemen itilir (eager push).
//  Kopyalar kimlikten tanınır ve atılır; süresi dolanlar ve sıçrama sınırını
//  aşanlar aktarılmaz.

import type { MeshMessage } from '../mesh';
import {
  MAX_FRAME_BYTES,
  MAX_FUTURE_SKEW_MS,
  PROTOCOL_VERSION,
  TTL_MS,
  decodeFrame,
  encodeFrame,
  idFrames,
  isExpired,
  isForwardable,
  packMessages,
  sanitizeMessage,
} from './protocol';

export interface MeshTransport {
  /** Tek bir komşuya çerçeve gönder. false/hata → gönderilemedi. */
  send(peer: string, frame: string): Promise<boolean> | boolean;
}

export interface StoredMessage {
  m: MeshMessage;
  /** bu cihaza ulaştığı yerel zaman (ms) */
  recv: number;
  /** bu cihazda oluşturuldu */
  own?: boolean;
}

export interface MeshNodeOptions {
  nodeId: string;
  name: string;
  transport: MeshTransport;
  now?: () => number;
  /** en fazla saklanan mesaj */
  capacity?: number;
  /** en fazla hatırlanan "görüldü" kimliği (silinen/süresi dolanlar) */
  seenCapacity?: number;
  maxFrameBytes?: number;
}

export interface MeshStats {
  framesIn: number;
  framesOut: number;
  invalidFrames: number;
  received: number;
  duplicates: number;
  expiredDropped: number;
}

interface PeerState {
  /** komşunun sahip olduğunu bildiğimiz kimlikler */
  known: Set<string>;
  node?: string;
  name?: string;
}

const MAX_TTL = Math.max(...Object.values(TTL_MS));
/**
 * Komşu başına "bildiği" kimliklerin üst sınırı. Kötü niyetli bir komşu sürekli rastgele
 * kimliklerle "have" gönderip belleği sınırsız büyütemesin; eskiler unutulur (en kötü
 * ihtimalle bir mesaj o komşuya ikinci kez gider, kopyayı o zaten atar).
 */
export const MAX_KNOWN_PER_PEER = 5000;

function know(p: PeerState, id: string) {
  p.known.delete(id);
  p.known.add(id);
  if (p.known.size > MAX_KNOWN_PER_PEER) p.known.delete(p.known.values().next().value as string);
}

export class MeshNode {
  readonly nodeId: string;
  name: string;
  private transport: MeshTransport;
  private now: () => number;
  private capacity: number;
  private seenCapacity: number;
  maxFrameBytes: number;
  private store = new Map<string, StoredMessage>();
  /** kimlik → unutulabileceği zaman */
  private seen = new Map<string, number>();
  private peers = new Map<string, PeerState>();
  private listeners = new Set<(m: MeshMessage, from: string) => void>();
  private changeListeners = new Set<() => void>();
  readonly stats: MeshStats = { framesIn: 0, framesOut: 0, invalidFrames: 0, received: 0, duplicates: 0, expiredDropped: 0 };

  constructor(o: MeshNodeOptions) {
    this.nodeId = o.nodeId;
    this.name = o.name;
    this.transport = o.transport;
    this.now = o.now ?? Date.now;
    this.capacity = o.capacity ?? 500;
    this.seenCapacity = o.seenCapacity ?? 5000;
    this.maxFrameBytes = Math.min(o.maxFrameBytes ?? MAX_FRAME_BYTES, MAX_FRAME_BYTES);
  }

  // ---- dinleyiciler ----

  /** Yeni (daha önce görülmemiş) gelen mesajlar */
  onMessage(cb: (m: MeshMessage, fromPeer: string) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /** Depo değişti (kalıcı kayıt için) */
  onChange(cb: () => void): () => void {
    this.changeListeners.add(cb);
    return () => this.changeListeners.delete(cb);
  }

  private changed() {
    for (const cb of this.changeListeners) {
      try {
        cb();
      } catch {
        /* yut */
      }
    }
  }

  // ---- komşular ----

  peerIds(): string[] {
    return [...this.peers.keys()];
  }

  peerInfo(peer: string): { node?: string; name?: string } | undefined {
    const p = this.peers.get(peer);
    return p ? { node: p.node, name: p.name } : undefined;
  }

  peerUp(peer: string): void {
    if (this.peers.has(peer)) return;
    this.peers.set(peer, { known: new Set() });
    this.sendRaw(peer, encodeFrame({ t: 'hello', v: PROTOCOL_VERSION, node: this.nodeId, name: this.name }));
    for (const f of idFrames('have', this.forwardableIds())) this.sendRaw(peer, f);
  }

  peerDown(peer: string): void {
    this.peers.delete(peer);
  }

  // ---- mesajlar ----

  has(id: string): boolean {
    return this.store.has(id);
  }

  /** Saklanan mesajlar, eskiden yeniye */
  messages(): MeshMessage[] {
    this.prune();
    return [...this.store.values()].sort((a, b) => a.m.time - b.m.time).map((s) => s.m);
  }

  /** Kendi mesajımızı yayınla. Geçersiz/kopya ise false. */
  publish(input: MeshMessage): boolean {
    const now = this.now();
    const m = sanitizeMessage({ ...input, hops: 0 }, now);
    if (!m || isExpired(m, now)) return false;
    if (this.store.has(m.id) || this.seen.has(m.id)) return false;
    this.put({ m, recv: now, own: true });
    this.push(m, null);
    this.changed();
    return true;
  }

  /** Taşıyıcıdan gelen ham çerçeve */
  receive(peer: string, raw: unknown): void {
    this.stats.framesIn++;
    const now = this.now();
    const f = decodeFrame(raw, now, this.maxFrameBytes);
    if (!f) {
      this.stats.invalidFrames++;
      return;
    }
    let p = this.peers.get(peer);
    if (!p) {
      // peerUp kaçırıldıysa (olay sırası) yine de oturum aç
      this.peerUp(peer);
      p = this.peers.get(peer)!;
    }
    switch (f.t) {
      case 'hello':
        p.node = f.node;
        p.name = f.name;
        return;
      case 'have': {
        const missing: string[] = [];
        for (const id of f.ids) {
          know(p, id);
          if (!this.store.has(id) && !this.seen.has(id)) missing.push(id);
        }
        for (const fr of idFrames('want', missing)) this.sendRaw(peer, fr);
        return;
      }
      case 'want': {
        const ms: MeshMessage[] = [];
        for (const id of f.ids) {
          const s = this.store.get(id);
          if (s && isForwardable(s.m, now)) ms.push(s.m);
        }
        this.sendMessages(peer, ms);
        return;
      }
      case 'msgs': {
        let any = false;
        // Aktarılacaklar tek tek değil, çerçeve başına toplu itilir: 500 iletiyi tek tek göndermek
        // komşunun gelen çerçeve sınırına (MeshPeer: 120 + 20/sn) takılıp iletilerin düşmesine yol açar.
        const aktar: MeshMessage[] = [];
        for (const m of f.ms) {
          know(p, m.id);
          if (this.store.has(m.id) || this.seen.has(m.id)) {
            this.stats.duplicates++;
            continue;
          }
          if (isExpired(m, now)) {
            this.stats.expiredDropped++;
            this.remember(m.id, now);
            continue;
          }
          const local: MeshMessage = { ...m, hops: (m.hops ?? 0) + 1 };
          this.put({ m: local, recv: now });
          this.stats.received++;
          any = true;
          for (const cb of this.listeners) {
            try {
              cb(local, peer);
            } catch {
              /* dinleyici hatası protokolü bozmasın */
            }
          }
          aktar.push(local);
        }
        this.pushMany(aktar, peer);
        if (any) this.changed();
        return;
      }
    }
  }

  /** Süresi dolanları at; true → bir şey silindi */
  prune(): boolean {
    const now = this.now();
    let removed = false;
    for (const [id, s] of this.store) {
      if (isExpired(s.m, now)) {
        this.store.delete(id);
        this.remember(id, now);
        removed = true;
      }
    }
    for (const [id, until] of this.seen) if (until < now) this.seen.delete(id);
    if (removed) this.changed();
    return removed;
  }

  // ---- kalıcılık ----

  snapshot(): StoredMessage[] {
    return [...this.store.values()];
  }

  load(list: unknown): void {
    if (!Array.isArray(list)) return;
    const now = this.now();
    for (const x of list) {
      if (!x || typeof x !== 'object') continue;
      const m = sanitizeMessage((x as any).m, now);
      if (!m || isExpired(m, now) || this.store.has(m.id)) continue;
      const recv = typeof (x as any).recv === 'number' ? (x as any).recv : now;
      this.put({ m, recv, own: !!(x as any).own });
    }
  }

  // ---- iç ----

  private forwardableIds(): string[] {
    const now = this.now();
    const out: string[] = [];
    // yeni mesajlar önce: özet bölünürse en tazeler ilk gider
    const all = [...this.store.values()].sort((a, b) => b.m.time - a.m.time);
    for (const s of all) if (isForwardable(s.m, now)) out.push(s.m.id);
    return out;
  }

  private remember(id: string, now: number) {
    this.seen.delete(id);
    this.seen.set(id, now + MAX_TTL + MAX_FUTURE_SKEW_MS);
    while (this.seen.size > this.seenCapacity) {
      const first = this.seen.keys().next().value as string;
      this.seen.delete(first);
    }
  }

  private put(s: StoredMessage) {
    this.store.set(s.m.id, s);
    if (this.store.size <= this.capacity) return;
    // Kapasite aşıldı: önce başkalarının en eski mesajı, yoksa en eski
    let victim: StoredMessage | null = null;
    for (const x of this.store.values()) {
      if (x === s) continue;
      if (!victim) victim = x;
      else if (!!x.own !== !!victim.own) {
        if (!x.own) victim = x;
      } else if (x.m.time < victim.m.time) victim = x;
    }
    if (victim) {
      this.store.delete(victim.m.id);
      this.remember(victim.m.id, this.now());
    }
  }

  /** Mesajı, bilmeyen bağlı komşulara it */
  private push(m: MeshMessage, except: string | null) {
    this.pushMany([m], except);
  }

  /** Mesajları, bilmeyen bağlı komşulara toplu it (komşu başına en az çerçeve) */
  private pushMany(ms: MeshMessage[], except: string | null) {
    const now = this.now();
    const ileri = ms.filter((m) => isForwardable(m, now));
    if (!ileri.length) return;
    for (const [peer, p] of this.peers) {
      if (peer === except) continue;
      this.sendMessages(peer, ileri.filter((m) => !p.known.has(m.id)));
    }
  }

  private sendMessages(peer: string, ms: MeshMessage[]) {
    if (!ms.length) return;
    const p = this.peers.get(peer);
    for (const frame of packMessages(ms, this.maxFrameBytes)) {
      // Çerçevedeki kimlikleri "biliyor" say; gönderim başarısızsa geri al
      const ids = (JSON.parse(frame).ms as MeshMessage[]).map((m) => m.id);
      if (p) for (const id of ids) know(p, id);
      this.sendRaw(peer, frame, ids);
    }
  }

  private sendRaw(peer: string, frame: string, ids?: string[]) {
    this.stats.framesOut++;
    const fail = () => {
      const p = this.peers.get(peer);
      if (p && ids) for (const id of ids) p.known.delete(id);
    };
    try {
      const r = this.transport.send(peer, frame);
      if (r === false) fail();
      else if (r && typeof (r as Promise<boolean>).then === 'function') {
        (r as Promise<boolean>).then((ok) => !ok && fail(), fail);
      }
    } catch {
      fail();
    }
  }
}
