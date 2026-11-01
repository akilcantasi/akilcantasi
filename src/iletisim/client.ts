// Pano istemcisi: bilgi noktasını bulur, kayıtları çeker, giden kutusunu
// boşaltır ve (varsa) mesh üzerinden de alır/gönderir.
//
// Bilgi noktası adayı sırası:
//   1) Kullanıcının elle girdiği adres (Profil › bilgi noktası adresi)
//   2) Android uygulamasında bu telefonun kendi bilgi noktası (http://127.0.0.1:<port>)
//   3) Sayfanın geldiği sunucu (./api/…): tarayıcıda bilgi noktasından açıldıysa
import { useEffect, useState } from 'preact/hooks';
import { mesh } from '../lib/mesh';
import { native } from '../lib/native';
import { FOUND_SUFFIX, fromMesh, mergeItems, toMeshText, validateDraft, type BoardDraft, type BoardItem } from './board';
import { BoardCache, Outbox, loadProfile, normalizeServer } from './outbox';

export type ConnState = 'checking' | 'connected' | 'offline';

export interface ServiceState {
  conn: ConnState;
  /** '' = aynı köken; aksi halde http://ip:port */
  base: string;
  serverName: string;
  clients: number;
  items: BoardItem[];
  outbox: number;
  lastSync: number;
  error: string;
  meshOn: boolean;
  meshPeers: number;
}

const POLL_MS = 5000;
const PROBE_MS = 15000;
const TIMEOUT_MS = 5000;

async function fetchJson(url: string, init?: RequestInit): Promise<{ status: number; data: any; headers: Headers }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { cache: 'no-store', ...init, signal: ac.signal });
    const ct = res.headers.get('content-type') ?? '';
    const data = ct.includes('json') ? await res.json().catch(() => null) : null;
    return { status: res.status, data, headers: res.headers };
  } finally {
    clearTimeout(t);
  }
}

const api = (base: string, p: string) => (base ? base.replace(/\/+$/, '') + p : '.' + p);

class BoardService {
  private outbox = new Outbox();
  private cache = new BoardCache();
  private listeners = new Set<(s: ServiceState) => void>();
  private timer: any = null;
  private users = 0;
  private busy = false;
  private meshStarted = false;
  private meshOff: (() => void) | null = null;
  /** mesh'ten gelen (sunucuya henüz iletilmemiş olabilir) kayıtlar */
  private meshItems: BoardItem[] = [];
  state: ServiceState = {
    conn: 'checking',
    base: '',
    serverName: '',
    clients: 0,
    items: [],
    outbox: 0,
    lastSync: 0,
    error: '',
    meshOn: false,
    meshPeers: 0,
  };

  constructor() {
    this.recompute(this.cache.load().items);
  }

  private set(patch: Partial<ServiceState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l(this.state));
  }

  private recompute(serverItems?: BoardItem[]) {
    const base = serverItems ?? this.cache.load().items;
    const items = mergeItems(mergeItems(base, this.meshItems), this.outbox.asItems());
    this.set({ items, outbox: this.outbox.size() });
  }

  subscribe(l: (s: ServiceState) => void) {
    this.listeners.add(l);
    if (++this.users === 1) this.start();
    return () => {
      this.listeners.delete(l);
      if (--this.users === 0) this.stop();
    };
  }

  private start() {
    this.startMesh();
    this.tick();
  }

  private stop() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  /** Hemen yeniden dene (adres değişti, kullanıcı "yenile" dedi) */
  refreshNow() {
    clearTimeout(this.timer);
    this.tick();
  }

  private async findServer(): Promise<{ base: string; name: string; clients: number } | null> {
    const cands: string[] = [];
    const custom = normalizeServer(loadProfile().server);
    if (custom) cands.push(custom);
    if (native.isAndroid()) {
      const st = await native.getInfoPointStatus().catch(() => null);
      if (st?.running) cands.push(`http://127.0.0.1:${st.port ?? 8080}`);
    }
    cands.push('');
    for (const base of cands) {
      try {
        const r = await fetchJson(api(base, '/api/status'));
        if (r.status === 200 && r.data?.server === true) return { base, name: String(r.data.name ?? ''), clients: Number(r.data.clients) || 0 };
      } catch {}
    }
    return null;
  }

  private async tick() {
    if (this.busy) return;
    this.busy = true;
    let next = PROBE_MS;
    try {
      const srv = await this.findServer();
      if (!srv) {
        this.set({ conn: 'offline', serverName: '', clients: 0 });
      } else {
        this.set({ conn: 'connected', base: srv.base, serverName: srv.name, clients: srv.clients, error: '' });
        await this.sync(srv.base);
        next = POLL_MS;
      }
    } catch (e: any) {
      this.set({ error: String(e?.message ?? e) });
    } finally {
      this.busy = false;
      this.set({ meshPeers: this.state.meshOn ? mesh.peers() : 0 });
      if (this.users > 0) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.tick(), next);
      }
    }
  }

  private async sync(base: string) {
    // 1) giden kutusu
    await this.outbox.flush((d) => this.postTo(base, d));
    // 2) mesh'ten gelenleri bilgi noktasına aktar (köprü)
    for (const m of this.meshItems.splice(0)) {
      const { time, rev, viaMesh, pending, local, ...draft } = m;
      const r = await this.postTo(base, draft).catch(() => ({ result: 'retry' as const }));
      if (r.result === 'retry') this.meshItems.push(m);
    }
    // 3) yeni kayıtlar
    const cached = this.cache.load();
    const since = cached.server === base ? cached.since : 0;
    const r = await fetchJson(api(base, '/api/board?since=' + since));
    if (r.status !== 200 || !Array.isArray(r.data?.items)) throw new Error('Pano okunamadı');
    const got: BoardItem[] = r.data.items.filter((i: any) => i && typeof i.id === 'string' && Number.isFinite(i.rev));
    const maxRev = got.reduce((a, i) => Math.max(a, i.rev), since);
    const merged = this.cache.merge(got, maxRev, base);
    this.set({ lastSync: Date.now() });
    this.recompute(merged);
  }

  private async postTo(base: string, d: BoardDraft): Promise<{ result: 'ok' | 'reject' | 'retry'; error?: string }> {
    let r;
    try {
      r = await fetchJson(api(base, '/api/board'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
    } catch (e: any) {
      return { result: 'retry', error: 'Bağlantı yok' };
    }
    if (r.status === 200 || r.status === 201) {
      if (r.data?.item) this.cache.merge([r.data.item], this.cache.load().since, this.cache.load().server || base);
      return { result: 'ok' };
    }
    if (r.status === 429) return { result: 'retry', error: r.data?.error ?? 'Çok sık gönderim' };
    if (r.status >= 400 && r.status < 500) return { result: 'reject', error: r.data?.error ?? 'Reddedildi' };
    return { result: 'retry', error: 'Sunucu hatası ' + r.status };
  }

  /** Yeni kayıt: önce giden kutusuna yazılır (kaybolmasın), sonra gönderilir. */
  async submit(raw: BoardDraft): Promise<{ ok: boolean; error?: string; queued?: boolean; reason?: string }> {
    const v = validateDraft(raw);
    if (!v.ok) return { ok: false, error: v.error };
    this.outbox.add(v.item);
    this.recompute();
    if (this.state.meshOn) {
      // Mesh kimliğe göre tekilleştirir: "bulundu" güncellemesi ayrı kimlikle gider (fromMesh geri çevirir)
      const meshId = v.item.status === 'bulundu' ? v.item.id + FOUND_SUFFIX : v.item.id;
      if (meshId.length <= 64)
        mesh
          .send({ id: meshId, kind: v.item.kind, from: v.item.from, text: toMeshText(v.item), time: Date.now(), lat: v.item.lat, lon: v.item.lon })
          .catch(() => {});
    }
    if (this.state.conn === 'connected') {
      const res = await this.outbox.flush((d) => this.postTo(this.state.base, d));
      this.recompute();
      const rej = res.rejects.find((x) => x.id === v.item.id);
      if (rej) return { ok: false, error: rej.error || 'Bilgi noktası kaydı kabul etmedi' };
      if (res.left) {
        const e = this.outbox.list().find((x) => x.draft.id === v.item.id);
        // hız sınırı / ağ hatası: kayıt kutuda, birazdan yeniden denenir
        this.refreshNow();
        return { ok: true, queued: true, reason: e?.lastError };
      }
      this.refreshNow();
      return { ok: true };
    }
    return { ok: true, queued: true };
  }

  private startMesh() {
    if (this.meshStarted) return;
    try {
      if (!mesh.available()) return;
    } catch {
      return;
    }
    this.meshStarted = true;
    this.meshOff = mesh.onMessage((m) => {
      const it = fromMesh(m);
      if (!it) return;
      // Kendi (henüz gönderilmemiş) ilanımız başka telefonda bulundu olarak işaretlendi
      const own = this.outbox.list().find((e) => e.draft.id === it.id);
      if (own) {
        if (own.draft.kind === 'kayip' && own.draft.status === 'araniyor' && it.kind === 'kayip' && it.status === 'bulundu') {
          this.outbox.add({ ...own.draft, status: 'bulundu' });
          this.recompute();
        }
        return;
      }
      const cur = this.state.items.find((x) => x.id === it.id && !x.pending);
      if (cur) {
        // Bilinen kayıt: yalnızca kayıp ilanının "bulundu" güncellemesi kabul edilir
        if (!(cur.kind === 'kayip' && cur.status === 'araniyor' && it.status === 'bulundu')) return;
        // Telefon saati geride olsa da güncelleme eski kopyanın önüne geçsin
        it.time = cur.time;
        it.rev = Math.max(it.rev, cur.rev + 1);
      }
      this.meshItems = mergeItems(this.meshItems, [it]).slice(0, 200);
      this.cache.merge([it], this.cache.load().since, this.cache.load().server);
      this.recompute();
    });
    // Komşu sayısı değişince hemen göster (15 sn'lik yoklamayı beklemeden)
    mesh.onPeers((p) => this.state.meshOn && this.set({ meshPeers: p.length }));
    const name = loadProfile().name || 'Akıl Çantası';
    mesh
      .start(name)
      .then((ok) => this.set({ meshOn: !!ok, meshPeers: ok ? mesh.peers() : 0 }))
      .catch(() => this.set({ meshOn: false }));
  }
}

export const board = new BoardService();

export function useBoard(): ServiceState {
  const [s, set] = useState(board.state);
  useEffect(() => board.subscribe(set), []);
  return s;
}
