// Paket sahneleri: scenes-*.tsx dosyalarını birleştirir.
import { SCENES as A } from './scenes-a';
import { SCENES as B } from './scenes-b';
export const SCENES = { ...A, ...B, };
