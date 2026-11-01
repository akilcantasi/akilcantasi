// Basit konum takibi kancası (pusula aracı için). İz kaydı açıksa onun
// konumlarını da kullanır; böylece iki ayrı GPS isteği birbirini beklemez.
import { useEffect, useState } from 'preact/hooks';
import { recorder } from './recorder';

export type GeoStatus = 'idle' | 'waiting' | 'ok' | 'denied' | 'unavailable' | 'timeout' | 'unsupported' | 'insecure';
export interface GeoFix {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
}

export const GEO_MSG: Record<GeoStatus, string> = {
  idle: '',
  waiting: 'Konum aranıyor… İnternetsiz GPS ilk seferde birkaç dakika sürebilir. Gökyüzünü gören açık bir yerde bekleyin.',
  ok: '',
  denied: 'Konum izni verilmedi. Telefon ya da tarayıcı ayarlarından bu uygulamaya konum izni verip tekrar deneyin.',
  unavailable: 'Konum alınamadı. Telefonun konum (GPS) özelliğinin açık olduğundan emin olun, açık alanda tekrar deneyin.',
  timeout: 'Konum 5 dakikada bulunamadı. Açık alana çıkıp tekrar deneyin.',
  unsupported: 'Bu cihaz ya da tarayıcı konum özelliğini desteklemiyor.',
  insecure: 'Konum yalnızca güvenli bağlantıda (https ya da uygulamanın kendisi) çalışır. Bu sayfa düz http ile açılmış.',
};

export function useGeoWatch(enabled: boolean): { fix: GeoFix | null; status: GeoStatus; retry: () => void } {
  const [fix, setFix] = useState<GeoFix | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const un = recorder.onFix((f) => {
      setFix({ lat: f.lat, lon: f.lon, accuracy: f.acc, timestamp: f.t });
      setStatus('ok');
    });
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      return un;
    }
    if (typeof isSecureContext !== 'undefined' && !isSecureContext) {
      setStatus('insecure');
      return un;
    }
    setStatus((s) => (s === 'ok' ? s : 'waiting'));
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setFix({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy, timestamp: p.timestamp });
        setStatus('ok');
      },
      (e) => setStatus(e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable'),
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 5 * 60 * 1000 },
    );
    return () => {
      un();
      navigator.geolocation.clearWatch(id);
    };
  }, [enabled, n]);
  return { fix, status, retry: () => setN((x) => x + 1) };
}
