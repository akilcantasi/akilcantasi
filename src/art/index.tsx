// Rehber çizimleri: <Art id="..."/>
// Yerleşik çizimler kod olarak çizilir (./registry); rehber paketlerinin çizimleri ise
// paketteki temizlenmiş SVG metninden <img> olarak gösterilir (betik çalışamaz).
import { ART, type ArtFn } from './registry';
import { packArtUri } from '../content/pack-guides';

export type { ArtFn };
export { ART };

export function Art({ id, title }: { id: string | null | undefined; title?: string }) {
  const f = id ? ART[id] : undefined;
  if (!f) {
    const uri = id ? packArtUri(id) : null;
    if (!uri) return null;
    return (
      <div class="art-box" title={title}>
        <img class="art" src={uri} alt="" aria-hidden="true" decoding="async" data-pack-art={id} />
      </div>
    );
  }
  return <div class="art-box" title={title}>{f()}</div>;
}
