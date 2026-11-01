// Çizim şartnamesi ve sahne kayıtları.
//   src/art/spec/*.ts    → export const SPEC: Record<kimlik, açıklama> (bkz. ./spec-index.ts)
//   src/art/scenes/*.tsx → export const SCENES: Record<kimlik, () => JSX.Element>
// Tüm sahneler src/art/kit2.tsx ile çizilir (bkz. docs/agents/CIZIM.md).
import type { JSX } from 'preact';

export type ArtFn = () => JSX.Element;

const sceneMods = import.meta.glob<{ SCENES: Record<string, ArtFn> }>(['./scenes/*.tsx', '!./scenes/_*.tsx'], { eager: true });

// Şartname (SPEC, SPEC_FILES) ayrı modülde: ./spec-index.ts (ana pakete girmez)
export const ART: Record<string, ArtFn> = {};
for (const [path, m] of Object.entries(sceneMods)) {
  if (/\/_[^/]*$/.test(path)) continue; // örnek sahneler uygulamaya girmez
  Object.assign(ART, m.SCENES ?? {});
}
