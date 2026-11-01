import { describe, expect, it, vi } from 'vitest';
import type { MeshMessage } from '../src/lib/mesh';
import { createMesh } from '../src/lib/mesh';
import { MeshNode } from '../src/lib/mesh/node';
import {
  MAX_FRAME_BYTES,
  MAX_HOPS,
  MAX_IDS_PER_FRAME,
  TTL_MS,
  byteLength,
  decodeFrame,
  idFrames,
  isExpired,
  isForwardable,
  newMessageId,
  packMessages,
  sanitizeMessage,
} from '../src/lib/mesh/protocol';

const T0 = Date.UTC(2026, 10, 1, 12, 0, 0);
const HOUR = 3600_000;

function msg(over: Partial<MeshMessage> = {}): MeshMessage {
  return { id: newMessageId(T0), kind: 'mesaj', from: 'Ayşe', text: 'İyiyim, çadır kentteyim.', time: T0, ...over };
}

// ---------------------------------------------------------------- protocol

describe('mesh protokolü: şema', () => {
  it('geçerli mesajı kabul eder, bilinmeyen alanları atar, hops=0 ekler', () => {
    const m = sanitizeMessage({ ...msg({ lat: 40.4, lon: 29.1 }), evil: '<script>' }, T0)!;
    expect(m).toBeTruthy();
    expect((m as any).evil).toBeUndefined();
    expect(m.hops).toBe(0);
    expect(m.lat).toBe(40.4);
  });

  it('geçersiz mesajları reddeder', () => {
    const bad: unknown[] = [
      null,
      [],
      'x',
      { ...msg(), id: 'kısa' },
      { ...msg(), id: 'a b c d e f g h' },
      { ...msg(), kind: 'spam' },
      { ...msg(), from: 'x'.repeat(41) },
      { ...msg(), text: 'x'.repeat(1001) },
      { ...msg(), text: 5 },
      { ...msg(), time: 0 }, // 1970: saati sıfırlanmış cihaz
      { ...msg(), time: T0 + 25 * HOUR }, // çok ileri tarih
      { ...msg(), time: NaN },
      { ...msg(), lat: 91, lon: 0 },
      { ...msg(), lat: 40 }, // lon eksik
      { ...msg(), hops: -1 },
      { ...msg(), hops: 1.5 },
    ];
    for (const b of bad) expect(sanitizeMessage(b, T0), JSON.stringify(b)).toBeNull();
  });

  it('kimlikler benzersiz ve şemaya uygun', () => {
    const ids = new Set(Array.from({ length: 2000 }, () => newMessageId(T0)));
    expect(ids.size).toBe(2000);
    for (const id of ids) expect(sanitizeMessage(msg({ id }), T0)).toBeTruthy();
  });

  it('TTL türe göre; süre dolunca aktarılmaz', () => {
    const m = msg();
    expect(isExpired(m, T0 + TTL_MS.mesaj - 1)).toBe(false);
    expect(isExpired(m, T0 + TTL_MS.mesaj + 1)).toBe(true);
    expect(isExpired(msg({ kind: 'kayip' }), T0 + TTL_MS.mesaj + 1)).toBe(false);
    expect(isForwardable({ ...m, hops: MAX_HOPS - 1 }, T0)).toBe(true);
    expect(isForwardable({ ...m, hops: MAX_HOPS }, T0)).toBe(false);
  });
});

describe('mesh protokolü: çerçeveler', () => {
  it('bozuk / büyük / bilinmeyen çerçeveleri reddeder', () => {
    expect(decodeFrame('{', T0)).toBeNull();
    expect(decodeFrame(42, T0)).toBeNull();
    expect(decodeFrame('[]', T0)).toBeNull();
    expect(decodeFrame('{"t":"nope"}', T0)).toBeNull();
    expect(decodeFrame('{"t":"have","ids":["bad id"]}', T0)).toBeNull();
    expect(decodeFrame(JSON.stringify({ t: 'have', ids: Array(MAX_IDS_PER_FRAME + 1).fill('abcdefgh') }), T0)).toBeNull();
    const big = JSON.stringify({ t: 'msgs', ms: [], pad: 'x'.repeat(MAX_FRAME_BYTES) });
    expect(decodeFrame(big, T0)).toBeNull();
    // çok baytlı karakterlerle sınır: uzunluk küçük ama bayt büyük
    const tr = JSON.stringify({ t: 'msgs', ms: [], pad: 'ş'.repeat(MAX_FRAME_BYTES / 2 + 10) });
    expect(tr.length).toBeLessThan(MAX_FRAME_BYTES);
    expect(decodeFrame(tr, T0)).toBeNull();
  });

  it('msgs içindeki geçersiz mesajları tek tek atar', () => {
    const f = decodeFrame(JSON.stringify({ t: 'msgs', ms: [msg(), { id: 'x' }, msg({ kind: 'sos' })] }), T0);
    expect(f?.t).toBe('msgs');
    expect((f as any).ms.length).toBe(2);
  });

  it('hello çerçevesi', () => {
    expect(decodeFrame('{"t":"hello","v":1,"node":"abcd1234","name":"Mehmet"}', T0)).toEqual({
      t: 'hello',
      v: 1,
      node: 'abcd1234',
      name: 'Mehmet',
    });
    expect(decodeFrame('{"t":"hello","v":1,"node":"!","name":"x"}', T0)).toBeNull();
  });

  it('packMessages her çerçeveyi sınırın altında tutar ve hepsini taşır', () => {
    const ms = Array.from({ length: 300 }, (_, i) => msg({ id: newMessageId(T0), text: 'ğüşiöç'.repeat(150) + i }));
    const frames = packMessages(ms, 20_000);
    expect(frames.length).toBeGreaterThan(1);
    let n = 0;
    for (const f of frames) {
      expect(byteLength(f)).toBeLessThanOrEqual(20_000);
      const d = decodeFrame(f, T0, 20_000)!;
      expect(d.t).toBe('msgs');
      n += (d as any).ms.length;
    }
    expect(n).toBe(300);
  });

  it('idFrames özet vektörünü böler ve sınırı aşmaz', () => {
    const ids = Array.from({ length: 1000 }, () => newMessageId(T0));
    const fr = idFrames('have', ids);
    expect(fr.length).toBe(Math.ceil(1000 / MAX_IDS_PER_FRAME));
    for (const f of fr) expect(byteLength(f)).toBeLessThan(MAX_FRAME_BYTES);
    expect(fr.flatMap((f) => (decodeFrame(f, T0) as any).ids)).toEqual(ids);
  });
});

// ---------------------------------------------------------------- node (iki düğüm)

/** Senkron, elle sürülen iki uçlu bağlantı */
function pair(now = () => T0) {
  const q: { to: 'a' | 'b'; frame: string }[] = [];
  const sent: { from: string; frame: string }[] = [];
  const a = new MeshNode({
    nodeId: 'nodeA001',
    name: 'A',
    now,
    transport: { send: (_p, f) => (q.push({ to: 'b', frame: f }), sent.push({ from: 'a', frame: f }), true) },
  });
  const b = new MeshNode({
    nodeId: 'nodeB001',
    name: 'B',
    now,
    transport: { send: (_p, f) => (q.push({ to: 'a', frame: f }), sent.push({ from: 'b', frame: f }), true) },
  });
  const flush = () => {
    let guard = 0;
    while (q.length && guard++ < 10_000) {
      const { to, frame } = q.shift()!;
      (to === 'a' ? a : b).receive(to === 'a' ? 'b' : 'a', frame);
    }
  };
  const connect = () => {
    a.peerUp('b');
    b.peerUp('a');
    flush();
  };
  return { a, b, q, sent, flush, connect };
}

describe('MeshNode', () => {
  it('bağlanınca özet değişimiyle yalnızca eksik mesajları ister', () => {
    const { a, b, sent, connect } = pair();
    const shared = msg();
    a.publish(shared);
    b.publish({ ...shared }); // ikisinde de aynı kimlik var (ör. önceden aldı)
    const onlyA = msg({ text: 'A' });
    const onlyB = msg({ text: 'B' });
    a.publish(onlyA);
    b.publish(onlyB);
    connect();
    expect(a.has(onlyB.id) && b.has(onlyA.id)).toBe(true);
    const wants = sent.filter((s) => s.frame.includes('"t":"want"')).map((s) => JSON.parse(s.frame).ids);
    expect(wants.flat().sort()).toEqual([onlyA.id, onlyB.id].sort());
    expect(a.stats.duplicates + b.stats.duplicates).toBe(0);
  });

  it('gelen mesajı bir kez bildirir, hops artırır, kopyayı atar', () => {
    const { a, b, connect, flush } = pair();
    const got: MeshMessage[] = [];
    b.onMessage((m) => got.push(m));
    connect();
    const m = msg();
    a.publish(m);
    flush();
    expect(got.length).toBe(1);
    expect(got[0].hops).toBe(1);
    // aynı çerçeve tekrar gelirse
    b.receive('a', JSON.stringify({ t: 'msgs', ms: [m] }));
    expect(got.length).toBe(1);
    expect(b.stats.duplicates).toBe(1);
    // kendi mesajını geri alırsa
    a.receive('b', JSON.stringify({ t: 'msgs', ms: [m] }));
    expect(a.stats.duplicates).toBe(1);
  });

  it('kendi mesajını tekrar yayınlamaz; geçersiz mesajı reddeder', () => {
    const { a } = pair();
    const m = msg();
    expect(a.publish(m)).toBe(true);
    expect(a.publish(m)).toBe(false);
    expect(a.publish({ ...msg(), kind: 'x' as any })).toBe(false);
    expect(a.publish(msg({ time: T0 - TTL_MS.mesaj - 1 }))).toBe(false);
  });

  it('sıçrama sınırına ulaşan mesajı saklar ama aktarmaz', () => {
    const { a, b, connect, flush } = pair();
    connect();
    const m = { ...msg(), hops: MAX_HOPS - 1 };
    b.receive('a', JSON.stringify({ t: 'msgs', ms: [m] }));
    flush();
    expect(b.messages()[0].hops).toBe(MAX_HOPS);
    expect(a.has(m.id)).toBe(false); // b geri itmedi (ayrıca a zaten "biliyor" sayılır)
    // üçüncü bir komşuya da gitmez
    const out: string[] = [];
    const c = new MeshNode({ nodeId: 'nodeC001', name: 'C', now: () => T0, transport: { send: (_p, f) => (out.push(f), true) } });
    c.receive('b', JSON.stringify({ t: 'msgs', ms: [m] }));
    c.peerUp('d');
    expect(out.some((f) => f.includes(m.id))).toBe(false);
  });

  it('süresi dolmuş mesajı almaz, depodan siler, özetten çıkarır', () => {
    let now = T0;
    const { a, b, connect, sent } = pair(() => now);
    const m = msg();
    a.publish(m);
    now = T0 + TTL_MS.mesaj + 1;
    connect();
    expect(b.has(m.id)).toBe(false);
    expect(sent.some((s) => s.frame.includes(m.id))).toBe(false);
    expect(a.messages()).toEqual([]);
    // eski mesaj dışarıdan gelirse
    b.receive('a', JSON.stringify({ t: 'msgs', ms: [{ ...m, time: now - TTL_MS.mesaj - 10 }] }));
    expect(b.stats.expiredDropped).toBe(1);
  });

  it('kapasite aşılınca en eski yabancı mesajı atar, kendi mesajını korur, atılanı tekrar almaz', () => {
    const out: string[] = [];
    const n = new MeshNode({ nodeId: 'nodeX001', name: 'X', capacity: 3, now: () => T0, transport: { send: (_p, f) => (out.push(f), true) } });
    const own = msg({ time: T0 - 5 * HOUR });
    n.publish(own);
    const others = [1, 2, 3].map((i) => msg({ time: T0 - (4 - i) * HOUR, text: String(i) }));
    n.receive('p', JSON.stringify({ t: 'msgs', ms: others }));
    const ids = n.messages().map((m) => m.id);
    expect(ids).toContain(own.id);
    expect(ids).not.toContain(others[0].id);
    expect(ids.length).toBe(3);
    // atılan mesaj tekrar gelirse kopya sayılır (seen)
    n.receive('p', JSON.stringify({ t: 'msgs', ms: [others[0]] }));
    expect(n.stats.duplicates).toBe(1);
    // ve "have" ile teklif edilirse istenmez
    out.length = 0;
    n.receive('p', JSON.stringify({ t: 'have', ids: [others[0].id] }));
    expect(out.some((f) => f.includes('"want"'))).toBe(false);
  });

  it('gönderim başarısız olursa yeniden bağlanınca tekrar dener', async () => {
    let ok = false;
    const frames: string[] = [];
    const a = new MeshNode({
      nodeId: 'nodeA002',
      name: 'A',
      now: () => T0,
      transport: { send: async (_p, f) => (ok && frames.push(f), ok) },
    });
    a.peerUp('b');
    const m = msg();
    a.publish(m);
    await Promise.resolve();
    expect(frames.length).toBe(0);
    ok = true;
    a.receive('b', JSON.stringify({ t: 'want', ids: [m.id] }));
    await Promise.resolve();
    expect(frames.some((f) => f.includes(m.id))).toBe(true);
  });

  it('geçersiz çerçeveleri sayar, çökmez', () => {
    const { b } = pair();
    b.receive('a', 'çöp');
    b.receive('a', undefined);
    b.receive('a', '{"t":"msgs","ms":"x"}');
    expect(b.stats.invalidFrames).toBe(3);
  });

  it('snapshot / load ile kalıcılık', () => {
    const { a } = pair();
    a.publish(msg());
    a.publish(msg({ kind: 'sos' }));
    const snap = JSON.parse(JSON.stringify(a.snapshot()));
    const n = new MeshNode({ nodeId: 'nodeZ001', name: 'Z', now: () => T0, transport: { send: () => true } });
    n.load(snap);
    n.load([{ m: { id: 'bozuk' } }, null, 'x']);
    expect(n.messages().length).toBe(2);
  });
});

// ---------------------------------------------------------------- simülasyon

/** Tohumlu sözde rastgele (mulberry32) */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SimNode {
  name: string;
  node: MeshNode;
  got: MeshMessage[];
}

/**
 * Sanal ağ: bağlantılar açılıp kapanır; çerçeveler bir sonraki adımda
 * (FIFO) teslim edilir; kapanan bağlantıdaki uçuştaki çerçeveler kaybolur.
 */
class SimNet {
  nodes: SimNode[] = [];
  links = new Set<string>();
  inflight: { from: string; to: string; frame: string }[] = [];
  now = T0;
  framesDelivered = 0;
  framesLost = 0;

  key(a: string, b: string) {
    return a < b ? a + '|' + b : b + '|' + a;
  }

  add(name: string, capacity?: number) {
    const sim: SimNode = {
      name,
      got: [],
      node: new MeshNode({
        nodeId: 'node' + name + '0000',
        name,
        capacity,
        now: () => this.now,
        transport: {
          send: (peer, frame) => {
            if (!this.links.has(this.key(name, peer))) return false;
            this.inflight.push({ from: name, to: peer, frame });
            return true;
          },
        },
      }),
    };
    sim.node.onMessage((m) => sim.got.push(m));
    this.nodes.push(sim);
    return sim;
  }

  get(n: string) {
    return this.nodes.find((x) => x.name === n)!;
  }

  setLink(a: string, b: string, up: boolean) {
    const k = this.key(a, b);
    if (up === this.links.has(k)) return;
    if (up) {
      this.links.add(k);
      this.get(a).node.peerUp(b);
      this.get(b).node.peerUp(a);
    } else {
      this.links.delete(k);
      this.get(a).node.peerDown(b);
      this.get(b).node.peerDown(a);
    }
  }

  /** bir adım: uçuştaki çerçeveleri teslim et (yalnızca bağlantı açıksa) */
  step(ms = 60_000) {
    this.now += ms;
    const batch = this.inflight;
    this.inflight = [];
    for (const f of batch) {
      if (this.links.has(this.key(f.from, f.to))) {
        this.framesDelivered++;
        this.get(f.to).node.receive(f.from, f.frame);
      } else this.framesLost++;
    }
  }

  settle() {
    let g = 0;
    while (this.inflight.length && g++ < 1000) this.step(1000);
  }
}

describe('5 düğümlü aralıklı ağ simülasyonu', () => {
  for (const seed of [1, 7, 42, 2026, 31337]) {
    it(`tohum ${seed}: her mesaj herkese ulaşır, kopyalar atılır`, () => {
      const r = rng(seed);
      const net = new SimNet();
      const names = ['A', 'B', 'C', 'D', 'E'];
      for (const n of names) net.add(n);
      // Hat topolojisi: A-B-C-D-E komşu çiftleri (insanlar yürür), ara sıra
      // uzak çiftler de karşılaşır. Aynı anda en fazla 2 bağlantı açık:
      // ağ hiçbir an tamamen bağlı değildir → mesajlar taşınarak yayılmalı.
      const pairs: [string, string][] = [];
      for (let i = 0; i < names.length; i++)
        for (let j = i + 1; j < names.length; j++) pairs.push([names[i], names[j]]);
      const weight = (a: string, b: string) => (Math.abs(names.indexOf(a) - names.indexOf(b)) === 1 ? 1 : 0.15);

      const published: MeshMessage[] = [];
      for (let t = 0; t < 400; t++) {
        // mesaj yayınla (ilk 150 adımda)
        if (t < 150 && r() < 0.08) {
          const who = net.get(names[Math.floor(r() * 5)]);
          const kinds: MeshMessage['kind'][] = ['mesaj', 'iyiyim', 'kayip', 'duyuru', 'sos'];
          const m: MeshMessage = {
            id: newMessageId(net.now),
            kind: kinds[Math.floor(r() * kinds.length)],
            from: who.name,
            text: `${who.name} #${t} ğüşıöç`,
            time: net.now,
          };
          expect(who.node.publish(m)).toBe(true);
          published.push(m);
        }
        // bağlantıları değiştir
        for (const [a, b] of pairs) {
          const k = net.key(a, b);
          if (net.links.has(k)) {
            if (r() < 0.35) net.setLink(a, b, false);
          } else if (net.links.size < 2 && r() < 0.1 * weight(a, b)) net.setLink(a, b, true);
        }
        // bazen bir bağlantı çerçeveler uçuştayken kopar
        net.step();
      }
      // son: herkes bir kez daha komşusuyla karşılaşsın (hat boyunca iki tur)
      for (let round = 0; round < 2; round++) {
        for (let i = 0; i < 4; i++) {
          net.setLink(names[i], names[i + 1], true);
          net.settle();
          net.setLink(names[i], names[i + 1], false);
        }
        for (let i = 4; i > 0; i--) {
          net.setLink(names[i], names[i - 1], true);
          net.settle();
          net.setLink(names[i], names[i - 1], false);
        }
      }

      expect(published.length).toBeGreaterThan(5);
      let dups = 0;
      for (const s of net.nodes) {
        const have = new Set(s.node.messages().map((m) => m.id));
        for (const m of published) expect(have.has(m.id), `${s.name} eksik ${m.id}`).toBe(true);
        // onMessage her yabancı mesaj için tam bir kez
        const foreign = published.filter((m) => m.from !== s.name);
        expect(s.got.length).toBe(foreign.length);
        expect(new Set(s.got.map((m) => m.id)).size).toBe(foreign.length);
        for (const m of s.got) expect(m.hops).toBeGreaterThanOrEqual(1);
        dups += s.node.stats.duplicates;
        expect(s.node.stats.invalidFrames).toBe(0);
      }
      // Bağlantılar çerçeveler uçuştayken koptu (aralıklı ağ gerçekten sınandı);
      // olası kopyalar (dups) atıldı: hiçbir düğüm bir mesajı iki kez bildirmedi.
      expect(net.framesLost).toBeGreaterThan(0);
      void dups;
    });
  }

  it('veri katırı: A ile E hiç karşılaşmaz, mesaj B→C→D taşınarak ulaşır', () => {
    const net = new SimNet();
    for (const n of ['A', 'B', 'C', 'D', 'E']) net.add(n);
    const m = msg({ id: newMessageId(T0), from: 'A', text: 'Enkaz altındayım, Örnek Mahallesi cami yanı', kind: 'sos', lat: 39.92, lon: 32.85 });
    net.get('A').node.publish(m);
    const meet = (a: string, b: string) => {
      net.setLink(a, b, true);
      net.settle();
      net.setLink(a, b, false);
      net.step(30 * 60_000);
    };
    meet('A', 'B');
    meet('B', 'C');
    meet('C', 'D');
    expect(net.get('E').node.has(m.id)).toBe(false);
    meet('D', 'E');
    const got = net.get('E').got;
    expect(got.length).toBe(1);
    expect(got[0].hops).toBe(4);
    expect(got[0].lat).toBe(39.92);
  });

  it('yoğun bağlı ağda (herkes herkese) kopyalar atılır, herkes bir kez bildirir', () => {
    const net = new SimNet();
    const names = ['A', 'B', 'C', 'D', 'E'];
    for (const n of names) net.add(n);
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) net.setLink(names[i], names[j], true);
    net.settle();
    const ms: MeshMessage[] = [];
    for (const n of names) {
      const m = msg({ id: newMessageId(T0), from: n, text: n });
      ms.push(m);
      net.get(n).node.publish(m);
    }
    net.settle();
    let dups = 0;
    for (const s of net.nodes) {
      expect(s.got.length).toBe(4);
      dups += s.node.stats.duplicates;
    }
    // eşzamanlı itmeler aynı mesajı birden çok yoldan getirir → atılmalı
    expect(dups).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------- mesh.ts (eklenti taklidi)

function fakePlugin() {
  const listeners: Record<string, ((d: any) => void)[]> = {};
  const sent: { to?: string; data: string }[] = [];
  const p = {
    isAvailable: vi.fn(async () => ({ available: true, gms: true, maxBytes: 32768 })),
    start: vi.fn(async (_o: { nodeId: string; name: string }) => ({ started: true })),
    stop: vi.fn(async () => ({})),
    send: vi.fn(async (o: { to?: string; data: string }) => (sent.push(o), { sent: 1 })),
    getPeers: vi.fn(async () => ({ peers: [] })),
    addListener: vi.fn(async (ev: string, cb: (d: any) => void) => {
      (listeners[ev] ||= []).push(cb);
      return { remove: () => {} };
    }),
  };
  const emit = (ev: string, d: any) => (listeners[ev] || []).forEach((cb) => cb(d));
  return { p, sent, emit };
}

function memStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

describe('mesh (Capacitor köprüsü)', () => {
  it('eklenti yoksa her şey sessizce false', async () => {
    const mesh = createMesh({ plugin: () => null, storage: null });
    expect(mesh.available()).toBe(false);
    expect(await mesh.start('Ali')).toBe(false);
    expect(await mesh.send(msg())).toBe(false);
    expect(mesh.peers()).toBe(0);
    expect(mesh.messages()).toEqual([]);
    await mesh.stop();
    mesh.onMessage(() => {})();
  });

  it('Google Play Hizmetleri yoksa başlamaz, nedeni bildirir', async () => {
    const { p } = fakePlugin();
    p.isAvailable.mockResolvedValueOnce({ available: false, gms: false } as any);
    const mesh = createMesh({ plugin: () => p as any, storage: null });
    expect(await mesh.start('Ali')).toBe(false);
    expect(mesh.lastError()).toBe('gms');
  });

  it('başlatır, komşu bağlanınca özet yollar, gelen mesajı bildirir, kalıcı kaydeder', async () => {
    const { p, sent, emit } = fakePlugin();
    const storage = memStorage();
    const mesh = createMesh({ plugin: () => p as any, storage, now: () => T0, saveDelayMs: 0 });
    expect(mesh.available()).toBe(true);
    expect(await mesh.start('  Zeynep  ')).toBe(true);
    expect(p.start).toHaveBeenCalledWith({ nodeId: mesh.nodeId(), name: 'Zeynep' });
    expect(mesh.running()).toBe(true);

    const own = msg({ from: 'Zeynep' });
    expect(await mesh.send(own)).toBe(true); // komşu yok: depoda bekler

    emit('meshPeers', { peers: [{ id: 'EP01', node: 'nodeQ001', name: 'Murat', connected: true }, { id: 'EP02', connected: false }] });
    expect(mesh.peers()).toBe(2);
    expect(mesh.connected()).toBe(1);
    await tick();
    const frames = sent.map((s) => JSON.parse(s.data));
    expect(frames[0].t).toBe('hello');
    expect(frames.find((f) => f.t === 'have').ids).toEqual([own.id]);
    expect(sent.every((s) => s.to === 'EP01')).toBe(true);

    const got: MeshMessage[] = [];
    mesh.onMessage((m) => got.push(m));
    const theirs = msg({ from: 'Murat', kind: 'iyiyim', text: 'Ailecek iyiyiz' });
    emit('meshMessage', { from: 'EP01', data: JSON.stringify({ t: 'msgs', ms: [theirs] }) });
    emit('meshMessage', { from: 'EP01', data: JSON.stringify({ t: 'msgs', ms: [theirs] }) });
    expect(got.map((m) => m.id)).toEqual([theirs.id]);
    expect(mesh.messages().map((m) => m.id).sort()).toEqual([own.id, theirs.id].sort());

    await new Promise((r) => setTimeout(r, 5));
    const saved = JSON.parse(storage.m.get('akil.mesh.store.v1')!);
    expect(saved.length).toBe(2);

    // yeniden açılış: aynı düğüm kimliği, mesajlar geri gelir
    const mesh2 = createMesh({ plugin: () => p as any, storage, now: () => T0 });
    expect(mesh2.nodeId()).toBe(mesh.nodeId());
    expect(mesh2.messages().length).toBe(2);

    emit('meshPeers', { peers: [] });
    expect(mesh.connected()).toBe(0);
    await mesh.stop();
    expect(p.stop).toHaveBeenCalled();
    expect(mesh.running()).toBe(false);
  });

  it('başlatma reddedilirse (izin) false ve hata', async () => {
    const { p } = fakePlugin();
    p.start.mockResolvedValueOnce({ started: false, error: 'permission' } as any);
    const mesh = createMesh({ plugin: () => p as any, storage: null });
    expect(await mesh.start('Ali')).toBe(false);
    expect(mesh.lastError()).toBe('permission');
  });
});
