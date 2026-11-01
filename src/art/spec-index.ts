// Çizim şartnamesi (yalnızca geliştirici galerisi ve testler kullanır).
//   src/art/spec/*.ts → export const SPEC: Record<kimlik, açıklama>
// registry.ts'ten ayrı tutulur: şartname metinleri (~200 KB) ana pakete girmesin.
const specMods = import.meta.glob<{ SPEC: Record<string, string> }>('./spec/*.ts', { eager: true });

/** Dosya adı → o dosyadaki kimlikler (galeride grup filtresi için) */
export const SPEC_FILES: Record<string, string[]> = {};
export const SPEC: Record<string, string> = {};
for (const [path, m] of Object.entries(specMods)) {
  const file = path.replace(/^.*\/(.+)\.ts$/, '$1');
  if (file.startsWith('_')) continue;
  SPEC_FILES[file] = Object.keys(m.SPEC ?? {});
  Object.assign(SPEC, m.SPEC);
}
