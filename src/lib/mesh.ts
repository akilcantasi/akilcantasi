// Şebekesiz cihazdan cihaza mesajlaşma (Android: Google Nearby Connections).
// Yalnızca Android uygulamasında, "AkilMesh" yerel eklentisi varsa çalışır.
// Tarayıcıda ve eklenti yoksa available() false döner; uygulama bilgi
// noktası (HTTP) üzerinden haberleşmeye devam eder.
//
// Biriktir-ve-ilet: mesajlar yakındaki telefonlara sıçrar, insanlar
// yürüdükçe taşınır. Protokol src/lib/mesh/ altında (birim testli),
// Java yalnızca bayt taşır. Ayrıntılar: docs/MESH.md

import { MeshNode, type MeshTransport } from './mesh/node';
import { getMeshPlugin, type MeshPlugin, type NativePeer } from './mesh/native';
import { newMessageId, newNodeId } from './mesh/protocol';

export interface MeshMessage {
  /** benzersiz kimlik (gönderen tarafından üretilir) */
  id: string;
  kind: 'mesaj' | 'iyiyim' | 'kayip' | 'duyuru' | 'sos';
  /** gönderen adı */
  from: string;
  text: string;
  /** ms */
  time: number;
  lat?: number;
  lon?: number;
  /** kaç cihaz üzerinden aktarıldı */
  hops?: number;
}

export interface Mesh {
  available(): boolean;
  start(displayName: string): Promise<boolean>;
  stop(): Promise<void>;
  send(m: MeshMessage): Promise<boolean>;
  /** gelen mesaj dinleyicisi; kaldırmak için dönen fonksiyonu çağırın */
  onMessage(cb: (m: MeshMessage) => void): () => void;
  /** yakında görülen cihaz sayısı */
  peers(): number;
}

/** Sözleşmeye ek, isteğe bağlı yardımcılar (arayüz için) */
export interface MeshExtras {
  /** Bu cihazda saklanan (alınan + gönderilen) mesajlar, eskiden yeniye */
  messages(): MeshMessage[];
  /** Bağlı (veri alışverişi yapılabilen) cihaz sayısı */
  connected(): number;
  /** Görülen cihaz listesi değişince */
  onPeers(cb: (peers: NativePeer[]) => void): () => void;
  running(): boolean;
  /** Son hata (ör. "permission", "gms", Nearby durum kodu) */
  lastError(): string | null;
  nodeId(): string;
}

export { newMessageId };

const STORE_KEY = 'akil.mesh.store.v1';
const NODE_KEY = 'akil.mesh.node.v1';

export interface MeshDeps {
  plugin: () => MeshPlugin | null;
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  now?: () => number;
  saveDelayMs?: number;
}

function defaultStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

/** Test edilebilir fabrika; uygulama aşağıdaki `mesh` örneğini kullanır. */
export function createMesh(deps: MeshDeps): Mesh & MeshExtras {
  const storage = deps.storage === undefined ? defaultStorage() : deps.storage;
  const now = deps.now ?? Date.now;
  let node: MeshNode | null = null;
  let running = false;
  let lastError: string | null = null;
  let peerList: NativePeer[] = [];
  let connectedSet = new Set<string>();
  let handles: { remove: () => Promise<void> | void }[] = [];
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const msgListeners = new Set<(m: MeshMessage) => void>();
  const peerListeners = new Set<(p: NativePeer[]) => void>();

  const get = (k: string): string | null => {
    try {
      return storage?.getItem(k) ?? null;
    } catch {
      return null;
    }
  };
  const set = (k: string, v: string) => {
    try {
      storage?.setItem(k, v);
    } catch {
      /* dolu / kapalı depolama: yalnızca bellekte tut */
    }
  };

  function nodeId(): string {
    let id = get(NODE_KEY);
    if (!id || !/^[A-Za-z0-9_-]{4,32}$/.test(id)) {
      id = newNodeId();
      set(NODE_KEY, id);
    }
    return id;
  }

  const transport: MeshTransport = {
    async send(peer, frame) {
      const p = deps.plugin();
      if (!p) return false;
      try {
        const r = await p.send({ to: peer, data: frame });
        return !!r && r.sent > 0;
      } catch {
        return false;
      }
    },
  };

  function save() {
    if (!node || saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      if (node) set(STORE_KEY, JSON.stringify(node.snapshot()));
    }, deps.saveDelayMs ?? 400);
  }

  function ensureNode(name: string): MeshNode {
    if (node) {
      if (name) node.name = name;
      return node;
    }
    node = new MeshNode({ nodeId: nodeId(), name, transport, now });
    try {
      node.load(JSON.parse(get(STORE_KEY) || '[]'));
    } catch {
      /* bozuk kayıt: boş başla */
    }
    node.onChange(save);
    node.onMessage((m) => {
      for (const cb of msgListeners) {
        try {
          cb(m);
        } catch {
          /* yut */
        }
      }
    });
    return node;
  }

  function applyPeers(list: unknown) {
    const arr: NativePeer[] = Array.isArray(list)
      ? list.filter((p: any) => p && typeof p.id === 'string').map((p: any) => ({
          id: p.id,
          node: typeof p.node === 'string' ? p.node : undefined,
          name: typeof p.name === 'string' ? p.name : undefined,
          connected: !!p.connected,
        }))
      : [];
    peerList = arr;
    const next = new Set(arr.filter((p) => p.connected).map((p) => p.id));
    if (node) {
      for (const id of connectedSet) if (!next.has(id)) node.peerDown(id);
      for (const id of next) if (!connectedSet.has(id)) node.peerUp(id);
    }
    connectedSet = next;
    for (const cb of peerListeners) {
      try {
        cb(arr);
      } catch {
        /* yut */
      }
    }
  }

  async function listen(p: MeshPlugin) {
    if (handles.length) return;
    const add = async (ev: 'meshMessage' | 'meshPeers' | 'meshState', cb: (d: any) => void) => {
      try {
        handles.push(await p.addListener(ev, cb));
      } catch {
        /* eski eklenti */
      }
    };
    await add('meshMessage', (d) => {
      if (node && d && typeof d.from === 'string') node.receive(d.from, d.data);
    });
    await add('meshPeers', (d) => applyPeers(d?.peers));
    await add('meshState', (d) => {
      if (d && typeof d.error === 'string') lastError = d.error;
      if (d && d.running === false) running = false;
    });
  }

  const api: Mesh & MeshExtras = {
    available: () => !!deps.plugin(),

    async start(displayName) {
      const p = deps.plugin();
      if (!p) return false;
      const name = String(displayName || '').trim().slice(0, 40) || 'Adsız';
      const n = ensureNode(name);
      if (running) return true;
      try {
        const info = await p.isAvailable();
        if (!info?.available) {
          lastError = info && info.gms === false ? 'gms' : 'unavailable';
          return false;
        }
        if (typeof info.maxBytes === 'number' && info.maxBytes > 1024) {
          n.maxFrameBytes = Math.min(n.maxFrameBytes, info.maxBytes - 512);
        }
        await listen(p);
        const r = await p.start({ nodeId: n.nodeId, name });
        if (!r?.started) {
          lastError = r?.error || 'start';
          return false;
        }
        running = true;
        lastError = null;
        try {
          const ps = await p.getPeers();
          applyPeers(ps?.peers);
        } catch {
          /* olaylar zaten gelecek */
        }
        return true;
      } catch (e: any) {
        lastError = String(e?.message || e || 'start');
        return false;
      }
    },

    async stop() {
      const p = deps.plugin();
      running = false;
      applyPeers([]);
      if (p) {
        try {
          await p.stop();
        } catch {
          /* yut */
        }
      }
    },

    async send(m) {
      if (!deps.plugin()) return false;
      const n = ensureNode(m?.from || '');
      return n.publish(m);
    },

    onMessage(cb) {
      msgListeners.add(cb);
      return () => {
        msgListeners.delete(cb);
      };
    },

    peers: () => peerList.length,

    messages: () => (node ? node.messages() : deps.plugin() ? ensureNode('').messages() : []),
    connected: () => connectedSet.size,
    onPeers(cb) {
      peerListeners.add(cb);
      return () => {
        peerListeners.delete(cb);
      };
    },
    running: () => running,
    lastError: () => lastError,
    nodeId,
  };
  return api;
}

export const mesh: Mesh & MeshExtras = createMesh({ plugin: getMeshPlugin });
