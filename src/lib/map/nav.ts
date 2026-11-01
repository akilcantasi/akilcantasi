// Ortak "hedefe git" durumu: harita ve pusula aracı aynı hedefi gösterir.
// Sayfa yenilense de hatırlanır.
import { useEffect, useState } from 'preact/hooks';
import { safeLocalStorage } from './track';
import type { LatLon } from './geo';

export interface NavTarget extends LatLon {
  kind: 'wp' | 'coord' | 'start' | 'poi';
  name: string;
  /** yer işareti / nokta kimliği */
  id?: string;
  /** başlangıca dönüşte: kuş uçuşu ya da iz boyunca */
  mode?: 'straight' | 'track';
}

const KEY = 'ac.map.nav.v1';
const kv = safeLocalStorage();
const subs = new Set<(t: NavTarget | null) => void>();

function read(): NavTarget | null {
  try {
    const o = JSON.parse(kv?.getItem(KEY) ?? 'null');
    if (o && isFinite(o.lat) && isFinite(o.lon) && typeof o.name === 'string') return o;
  } catch {}
  return null;
}

let target: NavTarget | null = read();

export function getNavTarget() {
  return target;
}

export function setNavTarget(t: NavTarget | null) {
  target = t;
  try {
    if (t) kv?.setItem(KEY, JSON.stringify(t));
    else kv?.removeItem(KEY);
  } catch {}
  subs.forEach((f) => f(target));
}

export function useNavTarget(): NavTarget | null {
  const [t, setT] = useState(target);
  useEffect(() => {
    setT(target);
    subs.add(setT);
    return () => {
      subs.delete(setT);
    };
  }, []);
  return t;
}
