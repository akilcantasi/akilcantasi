// Uygulama güncellemesi (yalnız Android): Guncelleyici.java / GuncellemePlugin.java.
// Denetim ve (Wi-Fi'da) indirme kendiliğinden; KURULUM YALNIZ KULLANICI "Kur"a BASINCA.
import { useEffect, useState } from 'preact/hooks';
import { native } from './native';
import { getSettings, onSettingsChange } from './settings';

export interface GuncellemeDurum {
  kurulu: string;
  sonDenetim: number;
  is: '' | 'denetleniyor' | 'indiriliyor' | 'kuruluyor';
  alinan: number;
  toplam: number;
  hata?: string;
  yeni?: { surum: string; boyut: number; notlar: string; sayfa: string; hazir: boolean };
  kurulumIzni: boolean;
  /** Samsung telefon: Otomatik Engelleyici kurulumu engelleyebilir */
  samsung?: boolean;
  olculuAg: boolean;
  enkazAcik: boolean;
}

/** Günde en çok bir kendiliğinden denetim */
export const DENETIM_ARASI_MS = 20 * 60 * 60 * 1000;

function plugin(): any {
  return typeof window !== 'undefined' ? (window as any).Capacitor?.Plugins?.AkilGuncelleme : undefined;
}

async function call<T>(m: string, a?: unknown): Promise<T | null> {
  const p = plugin();
  if (!p || typeof p[m] !== 'function') return null;
  try {
    return (await p[m](a ?? {})) as T;
  } catch {
    return null;
  }
}

export const guncelleme = {
  available: () => native.isAndroid() && typeof plugin()?.kur === 'function',
  durum: () => call<GuncellemeDurum>('durum'),
  denetle: (kendiliginden = false) => call<GuncellemeDurum>('denetle', { kendiliginden }),
  indir: () => call<GuncellemeDurum>('indir'),
  kur: () => call<{ hata?: string }>('kur'),
  /** Yedek: Android'in kendi yükleyicisiyle kur (onay penceresi açılmazsa) */
  kurSistem: () => call<{ hata?: string }>('kurSistem'),
  kurulumIzni: () => call<{ acildi: boolean }>('kurulumIzni'),
  dinle(fn: (d: GuncellemeDurum) => void): () => void {
    const p = plugin();
    if (!p || typeof p.addListener !== 'function') return () => {};
    let h: any = null;
    let gone = false;
    Promise.resolve(p.addListener('guncellemeDurum', fn))
      .then((x) => {
        h = x;
        if (gone) h?.remove?.();
      })
      .catch(() => {});
    return () => {
      gone = true;
      h?.remove?.();
    };
  },
};

/** Kendiliğinden denetim zamanı geldi mi (ayar açık, çevrimiçi, son denetimden 20 sa geçmiş) */
export function denetimZamani(d: Pick<GuncellemeDurum, 'sonDenetim'> | null, simdi: number, ayarAcik: boolean, cevrimici: boolean): boolean {
  if (!ayarAcik || !cevrimici || !d) return false;
  return simdi - (d.sonDenetim || 0) >= DENETIM_ARASI_MS;
}

export const HATA_YAZI: Record<string, string> = {
  denetlenemedi: 'Denetlenemedi (internet yok ya da GitHub yanıt vermedi).',
  indirilemedi: 'İndirilemedi; bağlantı kesilmiş olabilir.',
  'eksik-indi': 'İndirme yarım kaldı; yeniden deneyin.',
  bozuk: 'İnen dosya bozuk çıktı (özet tutmuyor); silindi.',
  'imza-farkli': 'İnen dosya bu uygulamanın imzasını taşımıyor; güvenlik için kurulmadı ve silindi. Sürüm sayfasından elle kurabilirsiniz.',
  'baska-uygulama': 'İnen dosya başka bir uygulama; silindi.',
  'eski-surum': 'İnen dosya kurulu sürümden yeni değil.',
  'apk-okunamadi': 'İnen dosya okunamadı.',
  kurulamadi: 'Kurulum tamamlanamadı.',
  'onay-acilamadi': 'Kurulum onay ekranı açılamadı. "Sistem yükleyicisiyle kur" düğmesini deneyin.',
  iptal: 'Kurulum iptal edildi.',
  'enkaz-acik': 'Enkaz modu açıkken güncelleme kurulmaz.',
  'izin-gerekli': 'Önce bu uygulamaya "uygulama yükleme" izni verin.',
  'hazir-degil': 'Güncelleme henüz inmedi.',
};

/** Uygulama açılınca ve görünür olunca: zamanı geldiyse denetler (Wi-Fi'da indirir de). Kurmaz. */
export function useGuncelleme(): GuncellemeDurum | null {
  const [d, setD] = useState<GuncellemeDurum | null>(null);
  useEffect(() => {
    if (!guncelleme.available()) return;
    const bak = async () => {
      const x = await guncelleme.durum();
      if (!x) return;
      setD(x);
      if (denetimZamani(x, Date.now(), getSettings().updateCheck, navigator.onLine)) await guncelleme.denetle(true);
    };
    void bak();
    const off = guncelleme.dinle(setD);
    const vis = () => document.visibilityState === 'visible' && void bak();
    document.addEventListener('visibilitychange', vis);
    const offS = onSettingsChange(() => void bak());
    return () => {
      off();
      offS();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);
  return d;
}

export function mb(n: number) {
  return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + ' MB';
}
