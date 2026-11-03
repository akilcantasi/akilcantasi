// Enkaz modu ve enkaz arama: saf mantık (testleri tests/enkaz.test.ts).
// Bina bilgileri ve son konumlar yalnız bu cihazda saklanır, hiçbir yere gönderilmez.
import { nativeEnkaz, type KayitliKonum } from './native';

// ---------------------------------------------------------------- bina bilgisi

export interface Bina {
  id: string;
  /** "Ev", "İş" … */
  ad: string;
  /** Adres ya da tarif: "Örnek Mah. 5. Sk. No 3" */
  adres: string;
  blok: string;
  /** Kat (zemin 0, bodrum -1); bilinmiyorsa null */
  kat: number | null;
  daire: string;
  /** "arka cephe, mutfak tarafı" gibi */
  not: string;
  lat?: number;
  lon?: number;
}

export const MAX_BINA = 4;
const BINA_KEY = 'ac.binalar';

type KV = { getItem(k: string): string | null; setItem(k: string, v: string): void };
const defaultKV = (): KV | null => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
};

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function normalizeBina(o: any): Bina | null {
  if (!o || typeof o !== 'object') return null;
  const kat = Number(o.kat);
  const b: Bina = {
    id: str(o.id, 20) || Math.random().toString(36).slice(2, 10),
    ad: str(o.ad, 24) || 'Bina',
    adres: str(o.adres, 120),
    blok: str(o.blok, 12),
    kat: o.kat === null || o.kat === '' || o.kat === undefined || !Number.isFinite(kat) ? null : Math.max(-9, Math.min(120, Math.round(kat))),
    daire: str(o.daire, 12),
    not: str(o.not, 120),
  };
  const lat = Number(o.lat), lon = Number(o.lon);
  if (o.lat != null && o.lon != null && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    b.lat = lat;
    b.lon = lon;
  }
  return b;
}

export function loadBinalar(kv: KV | null = defaultKV()): Bina[] {
  if (!kv) return [];
  try {
    const a = JSON.parse(kv.getItem(BINA_KEY) || '[]');
    return Array.isArray(a) ? (a.map(normalizeBina).filter(Boolean) as Bina[]).slice(0, MAX_BINA) : [];
  } catch {
    return [];
  }
}

export function saveBinalar(list: Bina[], kv: KV | null = defaultKV()) {
  try {
    kv?.setItem(BINA_KEY, JSON.stringify(list.slice(0, MAX_BINA)));
  } catch {}
}

/** "B blok, 3. kat, daire 7" (boş parçalar atlanır) */
export function binaYeri(b: Bina): string {
  return [b.blok && `${b.blok} blok`.replace(/blok blok$/i, 'blok'), b.kat != null && katYazi(b.kat), b.daire && `daire ${b.daire}`].filter(Boolean).join(', ');
}

export function katYazi(k: number): string {
  if (k === 0) return 'zemin kat';
  if (k < 0) return `${-k}. bodrum`;
  return `${k}. kat`;
}

/** Bluetooth işaretindeki kısa etiket: "Ayşe · B blok 3. kat" (en çok ~24 bayt; uzunsa Android kısaltır) */
export function isaretEtiketi(kisi: string, b: Bina | null): string {
  const parca = [kisi.trim().split(/\s+/)[0] || ''];
  if (b) {
    const yer = [b.blok && `${b.blok}`.replace(/\s*blok$/i, '') + ' blok', b.kat != null && katYazi(b.kat), b.daire && `D:${b.daire}`].filter(Boolean).join(' ');
    if (yer) parca.push(yer);
  }
  return parca.filter(Boolean).join(' · ');
}

/** Metre cinsinden kuş uçuşu uzaklık */
export function uzaklikM(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371000;
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLon = (b.lon - a.lon) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Son konuma 150 m'den yakın kayıtlı bina (en yakını) */
export function enYakinBina(binalar: Bina[], konum: { lat: number; lon: number } | null, sinirM = 150): Bina | null {
  if (!konum) return null;
  let en: Bina | null = null;
  let d = Infinity;
  for (const b of binalar) {
    if (b.lat == null || b.lon == null) continue;
    const x = uzaklikM(konum, { lat: b.lat, lon: b.lon });
    if (x < d && x <= sinirM) {
      d = x;
      en = b;
    }
  }
  return en;
}

// ---------------------------------------------------------------- zaman

export function sureOnce(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '';
  const dk = Math.floor(ms / 60000);
  if (dk < 1) return 'az önce';
  if (dk < 60) return `${dk} dk önce`;
  const sa = Math.floor(dk / 60);
  if (sa < 48) return `${sa} sa önce`;
  return `${Math.floor(sa / 24)} gün önce`;
}

export function sure(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const sa = Math.floor(s / 3600);
  const dk = Math.floor((s % 3600) / 60);
  if (sa > 0) return `${sa} sa ${dk} dk`;
  return `${dk} dk ${s % 60} sn`;
}

// ---------------------------------------------------------------- SMS

/**
 * Enkazdan giden SMS. Kısa tutulur (Türkçe karakterli SMS 70 karakterde bölünür, şebeke zayıf):
 * önce durum, sonra bina tarifi, sonra son konum ve yaşı.
 */
export function enkazSms(o: { ad: string; bina: Bina | null; konum: KayitliKonum | null; simdi: number; kod?: string }): string {
  const p: string[] = ['ENKAZ ALTINDAYIM.'];
  if (o.ad.trim()) p.push(`Adım ${o.ad.trim()}.`);
  if (o.bina) {
    const yer = binaYeri(o.bina);
    const adr = [o.bina.adres, yer].filter(Boolean).join(', ');
    if (adr) p.push(`Bina: ${adr}.`);
    if (o.bina.not) p.push(o.bina.not.replace(/[.\s]+$/, '') + '.');
  }
  if (o.konum) {
    const acc = o.konum.dogruluk > 0 ? `±${Math.round(o.konum.dogruluk)} m, ` : '';
    p.push(`Son konum: ${o.konum.lat.toFixed(5)}, ${o.konum.lon.toFixed(5)} (${acc}${sureOnce(o.simdi - o.konum.zaman)}).`);
  } else if (!o.bina) p.push('Konumum bilinmiyor.');
  p.push('Telefonum enkaz işareti ve SOS sesi veriyor.');
  if (o.kod) p.push(`İşaret kodu: ${o.kod}.`);
  return p.join(' ');
}

// ---------------------------------------------------------------- işaret kodu ve SMS'ten hedef

/** Kimlikten kısa kod: son 24 bit, "AK-34ABCD" (EnkazIsareti.kod ile aynı) */
export function isaretKodu(kimlik: number): string {
  return 'AK-' + (kimlik & 0xffffff).toString(16).toUpperCase().padStart(6, '0');
}

/** "ak-34abcd", "AK 34ABCD", "34abcd" → "AK-34ABCD"; değilse null */
export function koduDuzelt(s: string): string | null {
  const m = s.trim().match(/^(?:ak[\s-]*)?([0-9a-f]{6})$/i);
  return m ? 'AK-' + m[1].toUpperCase() : null;
}

export interface AramaHedefi {
  kod?: string;
  lat?: number;
  lon?: number;
  ad?: string;
  bina?: string;
  /** SMS'teki konum yaşı ("12 dk önce") */
  yas?: string;
  /** Hedefin kaydedildiği an */
  zaman: number;
}

/**
 * Enkazdan gelen SMS metninden (ya da yalnız koddan) arama hedefi çıkarır. Kod ya da koordinat
 * yoksa null. Başka biçimlerdeki konumlar da okunur: "39.92080, 32.85410", OpenStreetMap bağlantısı.
 */
export function smsCoz(metin: string, simdi = Date.now()): AramaHedefi | null {
  const t = metin.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const h: AramaHedefi = { zaman: simdi };
  const kod = t.match(/\bAK[\s-]?([0-9A-F]{6})\b/i);
  if (kod) h.kod = 'AK-' + kod[1].toUpperCase();
  else {
    const yalniz = koduDuzelt(t);
    if (yalniz) h.kod = yalniz;
  }
  const osm = t.match(/mlat=(-?\d+(?:\.\d+)?)&mlon=(-?\d+(?:\.\d+)?)/);
  const duz = t.match(/(-?\d{1,2}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})/);
  const k = osm ?? duz;
  if (k) {
    const lat = Number(k[1]), lon = Number(k[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      h.lat = lat;
      h.lon = lon;
    }
  }
  const yas = t.match(/Son konum:[^(]*\(([^)]*?)\)/);
  if (yas) h.yas = yas[1].split(',').pop()!.trim();
  const ad = t.match(/Adım ([^.]{1,40})\./);
  if (ad) h.ad = ad[1].trim();
  // Bina tarifi (ve varsa not) "Son konum" / "Telefonum" / "İşaret kodu" cümlesine kadar
  const bina = t.match(/Bina: (.*?)\.(?= Son konum:| Telefonum| İşaret kodu|$)/);
  if (bina) h.bina = bina[1].trim();
  return h.kod || h.lat != null ? h : null;
}

/** Duyulan işaret aranan kişi mi */
export function hedefMi(h: AramaHedefi | null, kimlik: number): boolean {
  return !!h?.kod && h.kod === isaretKodu(kimlik);
}

/** Arama modunda duyulan işareti 112'ye/birine bildirme metni */
export function duyulanSms(d: { etiket?: string; kod?: string; kat?: number; lat?: number; lon?: number; yasDk: number; pil: number; yanit?: number }, ben: { lat: number; lon: number } | null, yanitMetni = ''): string {
  const p: string[] = ['Enkaz altında biri olabilir: telefonundan enkaz işareti duyuluyor.'];
  if (d.etiket) p.push(`İşaret: ${d.etiket}.`);
  if (d.kat != null && !(d.etiket ?? '').includes('kat')) p.push(`Kat: ${katYazi(d.kat)}.`);
  if (d.lat != null && d.lon != null)
    p.push(`İşaretteki son konum: ${d.lat.toFixed(5)}, ${d.lon.toFixed(5)}${d.yasDk >= 0 ? ` (${sureOnce(d.yasDk * 60000)})` : ''}.`);
  if (ben) p.push(`Duyduğum yer: ${ben.lat.toFixed(5)}, ${ben.lon.toFixed(5)}.`);
  if (d.pil >= 0) p.push(`Telefon pili %${d.pil}.`);
  if (yanitMetni) p.push(`Yanıtı: ${yanitMetni}`);
  if (d.kod) p.push(`İşaret kodu: ${d.kod}.`);
  return p.join(' ');
}

// ---------------------------------------------------------------- sinyal (arama modu)

/** İşaretteki yayın gücü düzeyine göre 1 m'deki beklenen sinyal (dBm, yaklaşık) */
const RSSI_1M = [-85, -75, -66, -59];

/**
 * Kaba uzaklık tahmini (m). Log-uzaklık modeli, engelli ortam (n = 3). Enkazda beton
 * sinyali çok zayıflattığı için yalnız "yaklaşıyor muyum" sorusuna güvenilir yanıt verir.
 */
export function mesafeTahmini(rssi: number, guc = 3): number {
  const tx = RSSI_1M[Math.max(0, Math.min(3, guc))];
  const d = Math.pow(10, (tx - rssi) / 30);
  return Math.max(0.5, Math.min(100, d));
}

/** 0 (uzak) … 1 (dibinde) */
export function yakinlik(rssi: number): number {
  return Math.max(0, Math.min(1, (rssi + 95) / 50));
}

export function yakinlikYazi(rssi: number): string {
  if (rssi >= -60) return 'Çok yakın';
  if (rssi >= -72) return 'Yakın';
  if (rssi >= -85) return 'Orta';
  return 'Uzak ya da engel arkasında';
}

export type Egilim = 'yaklasiyor' | 'uzaklasiyor' | 'sabit' | 'bilinmiyor';

/** Dalgalı sinyali yumuşatır (üstel ortalama) ve son birkaç saniyedeki eğilimi verir */
export class SinyalIzi {
  ort: number | null = null;
  private gecmis: { t: number; v: number }[] = [];
  constructor(private alfa = 0.3, private pencereMs = 4000) {}

  ekle(rssi: number, t: number) {
    this.ort = this.ort == null ? rssi : this.alfa * rssi + (1 - this.alfa) * this.ort;
    this.gecmis.push({ t, v: this.ort });
    while (this.gecmis.length && t - this.gecmis[0].t > this.pencereMs * 3) this.gecmis.shift();
  }

  egilim(t: number): Egilim {
    if (this.ort == null) return 'bilinmiyor';
    const eski = this.gecmis.find((g) => t - g.t <= this.pencereMs * 1.5 && t - g.t >= this.pencereMs * 0.75);
    if (!eski) return 'bilinmiyor';
    const fark = this.ort - eski.v;
    if (fark >= 3) return 'yaklasiyor';
    if (fark <= -3) return 'uzaklasiyor';
    return 'sabit';
  }
}

// ---------------------------------------------------------------- son konum (tarayıcı + Android)

const SON_KEY = 'ac.sonkonum';

export function sonKonumlarWeb(kv: KV | null = defaultKV()): KayitliKonum[] {
  try {
    const a = JSON.parse(kv?.getItem(SON_KEY) || '[]');
    return Array.isArray(a) ? a.filter((k) => k && Number.isFinite(k.lat) && Number.isFinite(k.lon)) : [];
  } catch {
    return [];
  }
}

/** Aynı yer (50 m) ve yakın zamanda (50 dk) ise yalnız daha doğruysa günceller; en çok 24 kayıt */
export function kayitEkle(list: KayitliKonum[], k: KayitliKonum): KayitliKonum[] {
  const s = list[0];
  if (s) {
    const fark = k.zaman - s.zaman;
    if (fark < 0) return list;
    if (uzaklikM(s, k) < 50 && fark < 50 * 60000) {
      if (k.dogruluk > 0 && k.dogruluk < (s.dogruluk || Infinity)) return [k, ...list.slice(1)];
      return list;
    }
  }
  return [k, ...list].slice(0, 24);
}

/** Uygulamanın bulduğu her konum buraya: Android'de kalıcı kayda, tarayıcıda localStorage'a */
export function sonKonumKaydet(pos: { lat: number; lon: number; acc?: number }, kaynak = 'uygulama', kv: KV | null = defaultKV()) {
  const k: KayitliKonum = { lat: pos.lat, lon: pos.lon, dogruluk: pos.acc ?? 0, zaman: Date.now(), kaynak };
  if (nativeEnkaz.available()) {
    void nativeEnkaz.konumEkle(k);
    return;
  }
  try {
    kv?.setItem(SON_KEY, JSON.stringify(kayitEkle(sonKonumlarWeb(kv), k)));
  } catch {}
}

export function sonKonumlarWebTemizle(kv: KV | null = defaultKV()) {
  try {
    kv?.setItem(SON_KEY, '[]');
  } catch {}
}
