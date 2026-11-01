// Geliştirici galerisi.
//   ?art               tüm çizimler
//   ?art=f:<dosya>     src/art/spec/<dosya>.ts şartnamesindeki çizimler (ör. f:hayatta-kalma)
//   ?art=ids:a,b,c     yalnızca bu kimlikler
//   ?art=todo          şartnamede olup çizilmemiş olanlar
//   ?art=<önek>        kimliği bu önekle başlayanlar
import { ART } from './registry';
import { SPEC, SPEC_FILES } from './spec-index';

export function ArtGallery() {
  const q = new URLSearchParams(location.search).get('art') || '';
  const all = Object.keys({ ...SPEC, ...ART });
  let ids: string[];
  if (q.startsWith('ids:')) ids = q.slice(4).split(',').filter(Boolean);
  else if (q.startsWith('f:')) ids = SPEC_FILES[q.slice(2)] ?? [];
  else if (q === 'todo') ids = Object.keys(SPEC).filter((id) => !ART[id]);
  else ids = all.filter((id) => !q || id.startsWith(q));
  const render = (id: string) => {
    try {
      return ART[id] ? ART[id]() : <div class="art-missing">yok</div>;
    } catch (e: any) {
      return <div class="art-missing">hata: {String(e?.message ?? e)}</div>;
    }
  };
  return (
    <div class="art-gallery">
      {ids.map((id) => (
        <figure key={id} data-testid={'art-' + id}>
          <div class="art-box">{render(id)}</div>
          <figcaption>
            <b>{id}</b>
            <span>{SPEC[id] ?? ''}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
