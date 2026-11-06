// Fener sohbetinin kaydı: Android, arka plandaki uygulamanın sürecini bellek için kapatabilir;
// geri dönülünce WebView sıfırdan açılır ve sohbet kaybolurdu. Sohbet (mesajlar, kaynaklar,
// yazılmakta olan soru) localStorage'a zaman damgasıyla yazılır, açılışta geri yüklenir.
//
// Neden sessionStorage değil: Android WebView sessionStorage'ı yalnız bellekte tutar; süreç
// kapatılınca (arka planda bellek açığı) o da silinir. Bu yüzden localStorage + süre sınırı:
// 12 saatten eski kayıt açılışta yok sayılır ve silinir (ertesi gün temiz bir sohbet başlar).
//
// Kayıt bu cihazdan çıkmaz; "Yeni sohbet" kaydı da siler.
import type { FenerSource, PendingContext } from './rag';

export type Phase = 'search' | 'load' | 'write' | 'done';
export interface UserMsg {
  id: number;
  role: 'user';
  text: string;
  contextTitle?: string;
}
export interface BotMsg {
  id: number;
  role: 'bot';
  text: string;
  phase: Phase;
  progress: number | null;
  sources: FenerSource[];
  critical: boolean;
  topGuideId: string | null;
  topGuideTitle: string | null;
  /** Rehber modu etiketi (model kullanılmadıysa) */
  label?: string;
  error?: string;
  aborted?: boolean;
  tps?: number | null;
  fromModel?: boolean;
  /** Kaynaksız, modelin kendi bilgisiyle verilen cevap */
  free?: boolean;
  /** "Kendi bilgisiyle cevaplasın" ile soruldu (yeniden sorarken de öyle sorulur) */
  freeAsked?: boolean;
  /** Cevap yazılırken uygulama kapandı (kayıttan geri yüklendi); yeniden sorulabilir */
  interrupted?: boolean;
  /** Bu cevabın sorusu (kendi bilgisiyle yeniden sormak için) */
  question: string;
  questionContext?: PendingContext | null;
}
export type Msg = UserMsg | BotMsg;

export const KAYIT_KEY = 'ac.fener.sohbet';
const SURUM = 1;
/** Bu süreden eski kayıt geri yüklenmez */
export const KAYIT_OMRU_MS = 12 * 60 * 60 * 1000;
/** En çok bu kadar mesaj saklanır (en yeniler) */
export const EN_COK_MESAJ = 40;
/** Tek mesaj metni sınırı (karakter) */
export const EN_UZUN_METIN = 8000;
/** Bağlam metni (haritadan/kütüphaneden gelen) sınırı */
export const EN_UZUN_BAGLAM = 4000;
/** Tüm kaydın JSON uzunluğu sınırı (karakter) */
export const EN_BUYUK_KAYIT = 200_000;
/** Yazılmakta olan soru sınırı */
export const EN_UZUN_TASLAK = 2000;

export interface Kayit {
  v: number;
  /** Son kaydın zamanı (ms) */
  t: number;
  msgs: Msg[];
  input: string;
}

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');
const optStr = (v: unknown, max: number): string | undefined => (typeof v === 'string' && v ? v.slice(0, max) : undefined);
const KINDS = new Set(['rehber', 'vikipedi', 'baglam']);

function temizKaynak(s: any): FenerSource | null {
  if (!s || typeof s !== 'object' || !KINDS.has(s.kind)) return null;
  const n = Number(s.n);
  if (!Number.isFinite(n)) return null;
  const o: FenerSource = { n: Math.max(0, Math.min(999, Math.floor(n))), kind: s.kind, title: str(s.title, 300) };
  const id = optStr(s.id, 200);
  const path = optStr(s.path, 500);
  const label = optStr(s.label, 100);
  if (id) o.id = id;
  if (path) o.path = path;
  if (label) o.label = label;
  return o;
}

function temizBaglam(c: any): PendingContext | null {
  if (!c || typeof c !== 'object') return null;
  return { title: str(c.title, 300), text: str(c.text, EN_UZUN_BAGLAM), source: str(c.source, 200) };
}

/** Kayda yazılacak hâl: yarıda kalan cevap "bitti + yarım kaldı" olarak işaretlenir */
function kaydaHazirla(m: Msg): Msg {
  if (m.role === 'user') {
    const u: UserMsg = { id: m.id, role: 'user', text: m.text.slice(0, EN_UZUN_METIN) };
    if (m.contextTitle) u.contextTitle = m.contextTitle.slice(0, 300);
    return u;
  }
  const yarim = m.phase !== 'done' || !!m.interrupted;
  const b: BotMsg = {
    ...m,
    text: m.text.slice(0, EN_UZUN_METIN),
    phase: 'done',
    progress: null,
    sources: m.sources.slice(0, 20),
    question: m.question.slice(0, EN_UZUN_METIN),
    questionContext: m.questionContext ? temizBaglam(m.questionContext) : null,
  };
  if (yarim) b.interrupted = true;
  return b;
}

/**
 * Sohbeti kayda çevirir. Boşsa (mesaj da taslak da yoksa) null: kayıt silinmeli.
 * Sınırı aşarsa en eski soru-cevaplar atılır.
 */
export function kayitOlustur(msgs: Msg[], input: string, now: number): string | null {
  const taslak = input.slice(0, EN_UZUN_TASLAK);
  if (!msgs.length && !taslak.trim()) return null;
  let liste = msgs.slice(-EN_COK_MESAJ).map(kaydaHazirla);
  // Baştaki eşi atılmış cevap (soru kesildiyse) yalnız kalmasın
  while (liste[0]?.role === 'bot') liste = liste.slice(1);
  for (;;) {
    const k: Kayit = { v: SURUM, t: now, msgs: liste, input: taslak };
    const s = JSON.stringify(k);
    if (s.length <= EN_BUYUK_KAYIT || !liste.length) return s;
    // En eski soru ve cevabını at
    liste = liste.slice(1);
    while (liste[0]?.role === 'bot') liste = liste.slice(1);
  }
}

function temizMesaj(m: any): Msg | null {
  if (!m || typeof m !== 'object') return null;
  const id = Number(m.id);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  if (m.role === 'user') {
    const text = str(m.text, EN_UZUN_METIN);
    if (!text) return null;
    const u: UserMsg = { id, role: 'user', text };
    const ct = optStr(m.contextTitle, 300);
    if (ct) u.contextTitle = ct;
    return u;
  }
  if (m.role !== 'bot') return null;
  const b: BotMsg = {
    id,
    role: 'bot',
    text: str(m.text, EN_UZUN_METIN),
    // Kayıtta yarım kalmış her cevap "bitti" sayılır (çalışan bir üretim yok)
    phase: 'done',
    progress: null,
    sources: Array.isArray(m.sources) ? m.sources.map(temizKaynak).filter((x: FenerSource | null): x is FenerSource => !!x).slice(0, 20) : [],
    critical: m.critical === true,
    topGuideId: optStr(m.topGuideId, 200) ?? null,
    topGuideTitle: optStr(m.topGuideTitle, 300) ?? null,
    question: str(m.question, EN_UZUN_METIN),
    questionContext: temizBaglam(m.questionContext),
  };
  const label = optStr(m.label, 300);
  const error = optStr(m.error, 500);
  if (label) b.label = label;
  if (error) b.error = error;
  if (m.aborted === true) b.aborted = true;
  if (m.fromModel === true) b.fromModel = true;
  if (m.free === true) b.free = true;
  if (m.freeAsked === true) b.freeAsked = true;
  if (typeof m.tps === 'number' && Number.isFinite(m.tps)) b.tps = m.tps;
  if (m.interrupted === true || m.phase !== 'done') b.interrupted = true;
  return b;
}

/**
 * Kaydı okur. Bozuk, başka sürümden ya da süresi geçmiş kayıt null döner.
 * (Geleceğe dönük zaman damgası da — saat geri alınmışsa — süresi geçmiş sayılmaz ama
 * 12 saatten ileri olanı yok sayılır.)
 */
export function kayitOku(raw: string | null, now: number): { msgs: Msg[]; input: string } | null {
  if (!raw) return null;
  let k: any;
  try {
    k = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!k || typeof k !== 'object' || k.v !== SURUM || typeof k.t !== 'number') return null;
  if (now - k.t > KAYIT_OMRU_MS || k.t - now > KAYIT_OMRU_MS) return null;
  const msgs: Msg[] = [];
  const ids = new Set<number>();
  if (Array.isArray(k.msgs)) {
    for (const m of k.msgs.slice(-EN_COK_MESAJ)) {
      const t = temizMesaj(m);
      if (!t || ids.has(t.id)) continue;
      ids.add(t.id);
      msgs.push(t);
    }
  }
  const input = str(k.input, EN_UZUN_TASLAK);
  if (!msgs.length && !input) return null;
  return { msgs, input };
}

// --- Depo erişimi (tarayıcı) ---------------------------------------------------------
function depo(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function sohbetiYukle(now = Date.now()): { msgs: Msg[]; input: string } | null {
  const d = depo();
  if (!d) return null;
  try {
    const raw = d.getItem(KAYIT_KEY);
    const r = kayitOku(raw, now);
    // Süresi geçmiş ya da bozuk kayıt silinir
    if (raw && !r) d.removeItem(KAYIT_KEY);
    return r;
  } catch {
    return null;
  }
}

export function sohbetiYaz(msgs: Msg[], input: string, now = Date.now()): void {
  const d = depo();
  if (!d) return;
  try {
    const s = kayitOlustur(msgs, input, now);
    if (s == null) d.removeItem(KAYIT_KEY);
    else d.setItem(KAYIT_KEY, s);
  } catch {
    // Depo dolu: eski kaydı bırakmak yerine sil (yanlış/eski sohbet geri gelmesin)
    try {
      d.removeItem(KAYIT_KEY);
    } catch {}
  }
}

export function sohbetiSil(): void {
  try {
    depo()?.removeItem(KAYIT_KEY);
  } catch {}
}
