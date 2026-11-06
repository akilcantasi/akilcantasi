// Pano istemcisi: bilgi noktasını bulur, kayıtları çeker, giden kutusunu
// boşaltır ve (varsa) mesh üzerinden de alır/gönderir.
//
// Bilgi noktası adayı sırası:
//   1) Kullanıcının elle girdiği adres (Profil › bilgi noktası adresi)
//   2) Android uygulamasında bu telefonun kendi bilgi noktası (http://127.0.0.1:<port>)
//   3) Sayfanın geldiği sunucu (./api/…): tarayıcıda bilgi noktasından açıldıysa
import { useEffect, useState } from 'preact/hooks';
import { mesh, type MeshMessage } from '../lib/mesh';
import { native } from '../lib/native';
import { fromMesh, fromServer, meshDurum, mergeItems, toMeshMessages, validateDraft, type BoardDraft, type BoardItem, type MissingStatus } from './board';
import { benimAnahtarim, bnPinle, dogrulaAsync, durumImzala, ilanImzala } from './imza';
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
  /**
   * Bağlı bilgi noktasının imza anahtarı: ilk görüşte sabitlenir. 'farkli' → bu adreste daha
   * önce başka bir anahtar görüldü (cihaz değişmiş ya da biri taklit ediyor).
   */
  bnPin: 'yok' | 'yeni' | 'ayni' | 'farkli';
}

const POLL_MS = 5000;
const PROBE_MS = 15000;
const TIMEOUT_MS = 5000;

/**
 * Bilgi noktası yanıtı için üst sınır. Gerçek sunucu en çok 500 kayıtlık sayfa verir (~400 KB);
 * elle girilen bozuk/kötü niyetli bir adres dev bir yanıtla telefonu belleksiz bırakmasın.
 */
export const MAX_RESPONSE_BYTES = 4 * 1024 * 1024;

/** Gövdeyi sınırlı okuyup JSON olarak çözer; sınır aşılırsa ya da JSON değilse null */
export async function readJsonCapped(res: Response, max = MAX_RESPONSE_BYTES): Promise<any> {
  if (Number(res.headers.get('content-length') ?? 0) > max) {
    res.body?.cancel().catch(() => {});
    return null;
  }
  if (!res.body) return null;
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let n = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.length;
    if (n > max) {
      reader.cancel().catch(() => {});
      return null;
    }
    parts.push(value);
  }
  try {
    return JSON.parse(new TextDecoder().decode(await new Blob(parts as BlobPart[]).arrayBuffer()));
  } catch {
    return null;
  }
}

async function fetchJson(url: string, init?: RequestInit): Promise<{ status: number; data: any; headers: Headers }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { cache: 'no-store', ...init, signal: ac.signal });
    const ct = res.headers.get('content-type') ?? '';
    const data = ct.includes('json') ? await readJsonCapped(res).catch(() => null) : null;
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
  /** Bu telefonun kendi bilgi noktası: adres ve gizli anahtar */
  private kendi: { base: string; anahtar: string } | null = null;
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
    bnPin: 'yok',
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

  private async findServer(): Promise<{ base: string; name: string; clients: number; pub?: string } | null> {
    const cands: string[] = [];
    const custom = normalizeServer(loadProfile().server);
    if (custom) cands.push(custom);
    if (native.isAndroid()) {
      const st = await native.getInfoPointStatus().catch(() => null);
      if (st?.running) {
        const base = `http://127.0.0.1:${st.port ?? 8080}`;
        this.kendi = st.anahtar ? { base, anahtar: st.anahtar } : null;
        cands.push(base);
      } else this.kendi = null;
    }
    cands.push('');
    for (const base of cands) {
      try {
        const r = await fetchJson(api(base, '/api/status'));
        if (r.status === 200 && r.data?.server === true)
          return { base, name: String(r.data.name ?? ''), clients: Number(r.data.clients) || 0, pub: typeof r.data.pub === 'string' ? r.data.pub : undefined };
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
        const pin = bnPinle(srv.base, srv.pub);
        this.set({ conn: 'connected', base: srv.base, serverName: srv.name, clients: srv.clients, error: '', bnPin: pin === 'yeni' ? 'ayni' : pin });
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
      const { time, rev, viaMesh, pending, local, bpub, bsig, ...draft } = m;
      const r = await this.postTo(base, draft).catch(() => ({ result: 'retry' as const }));
      if (r.result === 'retry') this.meshItems.push(m);
    }
    // 3) yeni kayıtlar
    // Sunucu kayıtları eskiden yeniye, sayfa sayfa verir ("more": true → devamı var).
    const cached = this.cache.load();
    let since = cached.server === base ? cached.since : 0;
    let merged: BoardItem[] = cached.items;
    for (let sayfa = 0; sayfa < 20; sayfa++) {
      const r = await fetchJson(api(base, '/api/board?since=' + since));
      if (r.status !== 200 || !Array.isArray(r.data?.items)) throw new Error('Pano okunamadı');
      const got: BoardItem[] = r.data.items.map(fromServer).filter((i: BoardItem | null): i is BoardItem => !!i);
      const maxRev = got.reduce((a, i) => Math.max(a, i.rev), since);
      merged = this.cache.merge(got, maxRev, base);
      if (r.data.more !== true || maxRev <= since) break;
      since = maxRev;
    }
    this.set({ lastSync: Date.now() });
    this.recompute(merged);
  }

  private async postTo(base: string, d: BoardDraft): Promise<{ result: 'ok' | 'reject' | 'retry'; error?: string }> {
    let r;
    try {
      r = await fetchJson(api(base, '/api/board'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.kendi && this.kendi.base === base ? { 'X-Akil-Anahtar': this.kendi.anahtar } : {}),
        },
        body: JSON.stringify(d),
      });
    } catch (e: any) {
      return { result: 'retry', error: 'Bağlantı yok' };
    }
    if (r.status === 200 || r.status === 201) {
      const it = r.data?.item ? fromServer(r.data.item) : null;
      if (it) this.cache.merge([it], this.cache.load().since, this.cache.load().server || base);
      return { result: 'ok' };
    }
    if (r.status === 429) return { result: 'retry', error: r.data?.error ?? 'Çok sık gönderim' };
    if (r.status >= 400 && r.status < 500) return { result: 'reject', error: r.data?.error ?? 'Reddedildi' };
    return { result: 'retry', error: 'Sunucu hatası ' + r.status };
  }

  /**
   * Yeni kayıt: önce giden kutusuna yazılır (kaybolmasın), sonra gönderilir. Yeni kayıtlar bu
   * cihazın anahtarıyla imzalanır; imzasız: true yalnız eski (imzasız) ilanın güncellemesi içindir.
   */
  async submit(raw: BoardDraft, o: { imzasiz?: boolean } = {}): Promise<{ ok: boolean; error?: string; queued?: boolean; reason?: string }> {
    const v = validateDraft(raw);
    if (!v.ok) return { ok: false, error: v.error };
    // İmza temizlenmiş metin üzerine atılır (sunucu da aynı temizliği yapar)
    const item = v.item.pub || o.imzasiz ? v.item : ilanImzala(v.item);
    this.outbox.add(item);
    this.recompute();
    if (this.state.meshOn) {
      // Mesh kimliğe göre tekilleştirir: durum güncellemeleri ayrı kimlikle gider (fromMesh geri çevirir)
      for (const m of toMeshMessages(item)) mesh.send(m as MeshMessage).catch(() => {});
    }
    if (this.state.conn === 'connected') {
      const res = await this.outbox.flush((d) => this.postTo(this.state.base, d));
      this.recompute();
      const rej = res.rejects.find((x) => x.id === item.id);
      if (rej) return { ok: false, error: rej.error || 'Bilgi noktası kaydı kabul etmedi' };
      if (res.left) {
        const e = this.outbox.list().find((x) => x.draft.id === item.id);
        // hız sınırı / ağ hatası: kayıt kutuda, birazdan yeniden denenir
        this.refreshNow();
        return { ok: true, queued: true, reason: e?.lastError };
      }
      this.refreshNow();
      return { ok: true };
    }
    return { ok: true, queued: true };
  }

  /** Bu cihaz bu kaydın sahibi mi (imzalı ve anahtar bizim)? */
  isOwner(it: BoardDraft): boolean {
    return !!it.pub && it.pub === benimAnahtarim();
  }

  /**
   * Kayıp ilanının durumunu değiştirir. İmzalı ilanı yalnız onu veren cihaz değiştirebilir
   * (imzalı güncelleme gider). Eski (imzasız) ilanda eski davranış: herkes "bulundu" diyebilir.
   */
  async setMissingStatus(it: BoardItem, st: MissingStatus) {
    const { time, rev, viaMesh, pending, local, bpub, bsig, ...draft } = it;
    if (it.pub) {
      const upd = durumImzala(draft, st);
      if (!upd) return { ok: false, error: 'Bu ilanın durumunu yalnızca ilanı veren telefon değiştirebilir.' };
      return this.submit({ ...draft, status: st, upd });
    }
    if (st !== 'bulundu') return { ok: false, error: 'Bu ilan yeniden “aranıyor” yapılamaz.' };
    return this.submit({ id: it.id, kind: 'kayip', from: it.from, text: it.text, status: 'bulundu' }, { imzasiz: true });
  }

  /** Mesh'ten gelen kaydı panoya katar */
  private meshEkle(it: BoardItem) {
    this.meshItems = mergeItems(this.meshItems, [it]).slice(0, 200);
    this.cache.merge([it], this.cache.load().since, this.cache.load().server);
    this.recompute();
  }

  private async meshAl(m: MeshMessage) {
    const durum = meshDurum(m);
    const it = fromMesh(m);
    if (durum) {
      const cur = this.state.items.find((x) => x.id === durum.id);
      if (cur) {
        // İmzalı ilanın durumunu yalnız aynı anahtarla imzalanmış, daha yeni bir güncelleme değiştirir
        if (!cur.pub || cur.pub !== durum.pub || cur.pending) return;
        if (cur.upd && durum.upd.ts <= cur.upd.ts) return;
        const { pending, ...temel } = cur;
        const yeni: BoardItem = { ...temel, status: durum.upd.st, upd: durum.upd, viaMesh: true, rev: Math.max(durum.upd.ts, cur.rev + 1) };
        const d = await dogrulaAsync(yeni);
        if (d.ilan !== 'gecerli' || d.durum !== 'gecerli') return;
        this.meshEkle(yeni);
        return;
      }
      // İlanı bilmiyoruz: metinsiz güncelleme tek başına işe yaramaz; metinli olan yeni kayıt olarak gelir
      if (!it) return;
    }
    if (!it) return;
    // Kendi (henüz gönderilmemiş) eski tip ilanımız başka telefonda bulundu olarak işaretlendi
    const own = this.outbox.list().find((e) => e.draft.id === it.id);
    if (own) {
      if (!own.draft.pub && own.draft.kind === 'kayip' && own.draft.status === 'araniyor' && it.kind === 'kayip' && it.status === 'bulundu' && !it.pub) {
        this.outbox.add({ ...own.draft, status: 'bulundu' });
        this.recompute();
      }
      return;
    }
    const cur = this.state.items.find((x) => x.id === it.id && !x.pending);
    if (cur) {
      // İmzalı kaydı yalnız imzalı güncelleme değiştirir (yukarıda)
      if (cur.pub || it.pub) return;
      // Bilinen eski kayıt: yalnızca kayıp ilanının "bulundu" güncellemesi kabul edilir
      if (!(cur.kind === 'kayip' && cur.status === 'araniyor' && it.status === 'bulundu')) return;
      // Telefon saati geride olsa da güncelleme eski kopyanın önüne geçsin
      it.time = cur.time;
      it.rev = Math.max(it.rev, cur.rev + 1);
    }
    if (it.pub) {
      // İmzası tutmayan mesh kaydı gösterilmez ve bilgi noktasına aktarılmaz
      const d = await dogrulaAsync(it);
      if (d.ilan !== 'gecerli' || d.durum === 'gecersiz') return;
    }
    this.meshEkle(it);
  }

  private startMesh() {
    if (this.meshStarted) return;
    try {
      if (!mesh.available()) return;
    } catch {
      return;
    }
    this.meshStarted = true;
    this.meshOff = mesh.onMessage((m) => void this.meshAl(m).catch(() => {}));
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
