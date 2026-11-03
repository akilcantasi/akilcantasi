// Mesaj panosu: veri modeli, doğrulama ve birleştirme (saf mantık, test edilir).
// Sunucu tarafı (server/server.mjs, InfoPointServer.java) aynı kuralları uygular.

export type BoardKind = 'mesaj' | 'iyiyim' | 'kayip' | 'duyuru';
export type CheckinStatus = 'iyiyim' | 'yardim' | 'yarali';
export type MissingStatus = 'araniyor' | 'bulundu';
export type BoardStatus = CheckinStatus | MissingStatus;

export const KINDS: BoardKind[] = ['mesaj', 'iyiyim', 'kayip', 'duyuru'];
export const CHECKIN_STATUSES: CheckinStatus[] = ['iyiyim', 'yardim', 'yarali'];
export const MISSING_STATUSES: MissingStatus[] = ['araniyor', 'bulundu'];

export const KIND_LABEL: Record<BoardKind, string> = {
  mesaj: 'Mesaj',
  iyiyim: 'Durum',
  kayip: 'Kayıp',
  duyuru: 'Duyuru',
};
export const STATUS_LABEL: Record<BoardStatus, string> = {
  iyiyim: 'İyiyim',
  yardim: 'Yardım lazım',
  yarali: 'Yaralıyım',
  araniyor: 'Aranıyor',
  bulundu: 'Bulundu',
};

export const LIMITS = {
  id: 64,
  from: 40,
  text: 600,
  /** POST gövdesi (bayt) */
  body: 4096,
};

/** Gönderilecek kayıt (istemci → sunucu) */
export interface BoardDraft {
  id: string;
  kind: BoardKind;
  from: string;
  text: string;
  lat?: number;
  lon?: number;
  status?: BoardStatus;
}

/** Sunucudan gelen kayıt */
export interface BoardItem extends BoardDraft {
  /** oluşturulma (ms, sunucu saati) */
  time: number;
  /** son değişiklik (ms); ?since= buna göre süzülür */
  rev: number;
  /** bilgi noktası cihazının kendisinden gönderildi */
  local?: boolean;
  /** yalnızca istemci: henüz gönderilmedi (giden kutusunda) */
  pending?: boolean;
  /** yalnızca istemci: mesh üzerinden geldi */
  viaMesh?: boolean;
}

const ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

/** Düz metin: denetim karakterleri, yön (bidi) ve sıfır genişlikli karakterler atılır. */
export function cleanText(s: unknown, max: number, multiline = false): string {
  let t = String(s ?? '')
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, ' ')
    // C0/C1 denetim karakterleri (\n hariç), DEL
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '')
    // sıfır genişlik, yön işaretleri ve geçersiz kılmalar, BOM
    .replace(/[​-‏‪-‮⁠-⁩﻿]/g, '');
  if (!multiline) t = t.replace(/\n+/g, ' ');
  else t = t.replace(/[ ]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  t = t.replace(/ {2,}/g, ' ').trim();
  // Kod noktası bazında kes (vekil çiftleri bölünmesin)
  const cps = Array.from(t);
  return cps.length > max ? cps.slice(0, max).join('').trim() : t;
}

export type ValidateResult = { ok: true; item: BoardDraft } | { ok: false; error: string };

/** Kayıt doğrulama ve temizleme (sunucudakiyle aynı kurallar). */
export function validateDraft(raw: any): ValidateResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'Geçersiz kayıt' };
  const id = typeof raw.id === 'string' ? raw.id : '';
  if (!ID_RE.test(id)) return { ok: false, error: 'Geçersiz kimlik' };
  const kind = raw.kind;
  if (!KINDS.includes(kind)) return { ok: false, error: 'Geçersiz tür' };
  const from = cleanText(raw.from, LIMITS.from);
  if (!from) return { ok: false, error: 'Ad gerekli' };
  const text = cleanText(raw.text, LIMITS.text, true);
  if (!text && kind !== 'iyiyim') return { ok: false, error: 'Metin gerekli' };
  const item: BoardDraft = { id, kind, from, text };
  if (raw.lat != null || raw.lon != null) {
    const lat = Number(raw.lat);
    const lon = Number(raw.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180)
      return { ok: false, error: 'Geçersiz konum' };
    item.lat = Math.round(lat * 1e5) / 1e5;
    item.lon = Math.round(lon * 1e5) / 1e5;
  }
  if (kind === 'iyiyim') {
    const st = raw.status ?? 'iyiyim';
    if (!CHECKIN_STATUSES.includes(st)) return { ok: false, error: 'Geçersiz durum' };
    item.status = st;
  } else if (kind === 'kayip') {
    const st = raw.status ?? 'araniyor';
    if (!MISSING_STATUSES.includes(st)) return { ok: false, error: 'Geçersiz durum' };
    item.status = st;
  } else if (raw.status != null && raw.status !== '') {
    return { ok: false, error: 'Bu türde durum olmaz' };
  }
  return { ok: true, item };
}

/** Rastgele kimlik (zaman + rastgele): sıralanabilir, çakışması çok olası değil. */
export function newId(now = Date.now()): string {
  const rnd = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(rnd);
  else for (let i = 0; i < rnd.length; i++) rnd[i] = Math.floor(Math.random() * 256);
  return now.toString(36) + '-' + Array.from(rnd, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Kayıtları kimliğe göre birleştirir; aynı kimlikte rev'i büyük olan (eşitse
 * sunucudan gelen, yani pending olmayan) kazanır. Sonuç yeniden eskiye sıralı.
 */
export function mergeItems(a: BoardItem[], b: BoardItem[]): BoardItem[] {
  const map = new Map<string, BoardItem>();
  for (const it of [...a, ...b]) {
    const cur = map.get(it.id);
    if (!cur) map.set(it.id, it);
    else {
      const better = it.rev > cur.rev || (it.rev === cur.rev && cur.pending && !it.pending);
      if (better) map.set(it.id, { ...it, viaMesh: it.viaMesh || cur.viaMesh });
    }
  }
  return sortNewest([...map.values()]);
}

export function sortNewest(items: BoardItem[]): BoardItem[] {
  return items.sort((x, y) => y.time - x.time || (x.id < y.id ? 1 : -1));
}

// ---- Kayıp kişi ilanı: yapılandırılmış alanlar metne satır satır yazılır ----

export interface MissingFields {
  name: string;
  age: string;
  desc: string;
  lastSeen: string;
}

const MISSING_KEYS: [keyof MissingFields, string][] = [
  ['name', 'Ad'],
  ['age', 'Yaş'],
  ['desc', 'Tarif'],
  ['lastSeen', 'Son görülme'],
];

export function missingToText(f: MissingFields): string {
  return MISSING_KEYS.map(([k, label]) => {
    const v = cleanText(f[k], k === 'desc' ? 300 : 120);
    return v ? `${label}: ${v}` : '';
  })
    .filter(Boolean)
    .join('\n');
}

export function parseMissing(text: string): MissingFields {
  const out: MissingFields = { name: '', age: '', desc: '', lastSeen: '' };
  let matched = false;
  for (const line of text.split('\n')) {
    for (const [k, label] of MISSING_KEYS) {
      if (line.startsWith(label + ':')) {
        out[k] = line.slice(label.length + 1).trim();
        matched = true;
      }
    }
  }
  if (!matched) out.desc = text;
  return out;
}

// ---- Mesh (src/lib/mesh.ts) dönüşümü: MeshMessage'ta status alanı yok ----

/** Mesh'te "bulundu" güncellemesinin kimlik eki (mesh aynı kimliği ikinci kez taşımaz) */
export const FOUND_SUFFIX = '_bulundu';

const TAG_RE = /^\[(iyiyim|yardim|yarali|araniyor|bulundu)\] ?/;

export function toMeshText(d: BoardDraft): string {
  return d.status ? `[${d.status}] ${d.text}` : d.text;
}

/**
 * Bilgi noktası sunucusundan gelen kaydı doğrular. Sunucu adresini kullanıcı değiştirebildiği
 * için kötü niyetli ya da bozuk bir sunucu yanlış türde alanlar gönderebilir; doğrulanmadan
 * önbelleğe yazılırsa İletişim ekranı her açılışta çöker. İstemciye özel alanlar atılır.
 */
export function fromServer(raw: any): BoardItem | null {
  const v = validateDraft(raw);
  if (!v.ok) return null;
  const time = Number(raw.time), rev = Number(raw.rev);
  if (!Number.isFinite(time) || !Number.isFinite(rev) || rev < 0 || rev > 1e15 || time < 0 || time > 1e15) return null;
  const it: BoardItem = { ...v.item, time, rev };
  if (raw.local === true) it.local = true;
  return it;
}

export function fromMesh(m: { id: string; kind: string; from: string; text: string; time: number; lat?: number; lon?: number }): BoardItem | null {
  let kind = m.kind;
  let id = String(m.id ?? '');
  let text = String(m.text ?? '');
  let status: string | undefined;
  const tag = TAG_RE.exec(text);
  if (tag) {
    status = tag[1];
    text = text.slice(tag[0].length);
  }
  if (status === 'bulundu' && id.endsWith(FOUND_SUFFIX)) id = id.slice(0, -FOUND_SUFFIX.length);
  if (kind === 'sos') {
    kind = 'iyiyim';
    status = 'yardim';
  }
  const v = validateDraft({ id, kind, from: m.from, text, lat: m.lat, lon: m.lon, status });
  if (!v.ok) return null;
  const time = Number.isFinite(m.time) ? m.time : Date.now();
  return { ...v.item, time, rev: time, viaMesh: true };
}

/** "37,00123, 35,32145" biçiminde konum */
export function formatCoords(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

export function timeAgo(ms: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return 'az önce';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} dk önce`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.round(h / 24)} gün önce`;
}
