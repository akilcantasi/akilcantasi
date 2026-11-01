// Rehber çizimleri: <Art id="..."/>
import { ART, type ArtFn } from './registry';

export type { ArtFn };
export { ART };

export function Art({ id, title }: { id: string | null | undefined; title?: string }) {
  const f = id ? ART[id] : undefined;
  if (!f) return null;
  return <div class="art-box" title={title}>{f()}</div>;
}
