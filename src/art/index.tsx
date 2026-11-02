// Rehber çizimleri: <Art id="..."/>
// Yerleşik çizimler kod olarak çizilir (./registry); rehber paketlerinin çizimleri ise
// paketteki temizlenmiş SVG metninden <img> olarak gösterilir (betik çalışamaz).
//
// Yerleşik çizimler (~1,5 MB kaynak) ana pakete girmez: ilk çizim istendiğinde ya da uygulama
// boşa çıkınca ayrı bir parça olarak yüklenir. Böylece açılış hızlı kalır; parça cihazda
// olduğundan yükleme internetsiz de anlıktır.
import { useEffect, useState } from 'preact/hooks';
import type { ArtFn } from './registry';
import { packArtUri } from '../content/pack-guides';
import { getState } from '../lib/store';

export type { ArtFn };

let ART: Record<string, ArtFn> | null = null;
let loading: Promise<Record<string, ArtFn>> | null = null;
const waiters = new Set<() => void>();

/** Yerleşik çizimleri yükler (bir kez) */
export function loadArt(): Promise<Record<string, ArtFn>> {
  loading ??= import('./registry').then((m) => {
    ART = m.ART;
    waiters.forEach((f) => f());
    waiters.clear();
    return m.ART;
  });
  return loading;
}

// Rehber sekmesindeyken boşta önceden yükle (listedeki küçük resimler hemen görünsün).
// Başka bir ekranla açılan uygulama bu parçayı ilk çizim istenene kadar indirmez.
if (typeof window !== 'undefined') {
  const idle = (window as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 300));
  idle(() => {
    if (getState().tab === 'rehber' && !new URLSearchParams(location.search).has('tool')) void loadArt();
  });
}

export function Art({ id, title }: { id: string | null | undefined; title?: string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (ART || !id) return;
    const f = () => tick((n) => n + 1);
    waiters.add(f);
    void loadArt();
    return () => void waiters.delete(f);
  }, [id]);
  if (!id) return null;
  // Yüklenene kadar yer tutucu: düzen kaymasın
  if (!ART) return <div class="art-box" title={title} data-art-loading={id} />;
  const f = ART[id];
  if (!f) {
    const uri = packArtUri(id);
    if (!uri) return null;
    return (
      <div class="art-box" title={title}>
        <img class="art" src={uri} alt="" aria-hidden="true" decoding="async" data-pack-art={id} />
      </div>
    );
  }
  return <div class="art-box" title={title}>{f()}</div>;
}
