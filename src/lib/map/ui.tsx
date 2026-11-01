// Harita ve pusula aracının ortak küçük bileşenleri.
import { useEffect, useState } from 'preact/hooks';
import { WAYPOINT_TYPES, smsHrefText, waypointShareText, waypointStore, type Waypoint, type WaypointType } from './waypoints';
import { formatDecimal, toDMS } from './geo';
import './konum.css';

export function useWaypoints(): Waypoint[] {
  const store = waypointStore();
  const [list, setList] = useState(store.list());
  useEffect(() => {
    setList(store.list());
    return store.subscribe(setList);
  }, []);
  return list;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** İğne biçimli yer işareti rozeti (harita noktalarının yuvarlak rozetinden ayrışır). */
export function WpBadge({ type, size = 22 }: { type: WaypointType; size?: number }) {
  const t = WAYPOINT_TYPES[type];
  return (
    <span class="wp-badge" style={{ background: t.color, width: size, height: size, fontSize: Math.round(size * 0.55) }} aria-hidden="true">
      <span>{t.letter}</span>
    </span>
  );
}

/** Yer işaretini metin olarak paylaşma kutusu: ondalık + DMS, kopyala, SMS. */
export function ShareBox({ wp }: { wp: Pick<Waypoint, 'name' | 'type' | 'lat' | 'lon'> }) {
  const [copied, setCopied] = useState<string | null>(null);
  const text = waypointShareText(wp);
  return (
    <div class="wp-share" data-testid="wp-share">
      <div class="mono wp-share-coord" data-testid="wp-share-decimal">
        {formatDecimal(wp.lat, wp.lon)}
      </div>
      <div class="mono wp-share-coord" data-testid="wp-share-dms">
        {toDMS(wp.lat, 'lat')} · {toDMS(wp.lon, 'lon')}
      </div>
      <div class="row">
        <button
          type="button"
          class="btn grow"
          data-testid="wp-share-copy"
          onClick={async () => setCopied((await copyText(text)) ? 'Kopyalandı' : 'Kopyalanamadı')}
        >
          {copied ?? 'Metni kopyala'}
        </button>
        <a class="btn primary grow sms-btn" data-testid="wp-share-sms" href={smsHrefText(text)}>
          SMS ile gönder
        </a>
      </div>
    </div>
  );
}
