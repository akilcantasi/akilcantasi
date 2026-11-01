// "AkilMesh" Capacitor eklentisine ince sarmalayıcı.
// Java tarafı (AkilMeshPlugin.java) yalnızca bayt taşır, komşuları bildirir.
// Ayrıntılı sözleşme: docs/MESH.md

export interface NativePeer {
  /** Nearby uç nokta kimliği (oturumluk, ör. "A1B2") */
  id: string;
  /** karşı cihazın mesh düğüm kimliği (reklam adından) */
  node?: string;
  /** karşı cihazın görünen adı */
  name?: string;
  connected: boolean;
}

export interface MeshPlugin {
  isAvailable(): Promise<{ available: boolean; gms?: boolean; maxBytes?: number; sdk?: number }>;
  start(o: { nodeId: string; name: string }): Promise<{ started: boolean; error?: string }>;
  stop(): Promise<unknown>;
  /** to: tek uç nokta; verilmezse tüm bağlı komşulara */
  send(o: { to?: string; data: string }): Promise<{ sent: number }>;
  getPeers(): Promise<{ peers: NativePeer[] }>;
  addListener(
    ev: 'meshMessage' | 'meshPeers' | 'meshState',
    cb: (d: any) => void,
  ): Promise<{ remove: () => Promise<void> | void }> | { remove: () => Promise<void> | void };
}

function cap(): any {
  return typeof window !== 'undefined' ? (window as any).Capacitor : undefined;
}

export function isAndroid(): boolean {
  const c = cap();
  if (!c) return false;
  const p = typeof c.getPlatform === 'function' ? c.getPlatform() : c.platform;
  return p === 'android';
}

export function getMeshPlugin(): MeshPlugin | null {
  const c = cap();
  if (!c || !isAndroid()) return null;
  if (typeof c.isPluginAvailable === 'function' && !c.isPluginAvailable('AkilMesh')) return null;
  const p = c.Plugins?.AkilMesh;
  return p && typeof p.start === 'function' ? (p as MeshPlugin) : null;
}
