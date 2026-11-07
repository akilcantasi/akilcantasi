// Makaleler arası gezinme: geri/ileri yığını (bu oturum) ve "kaldığın yerden" konum geri yükleme.
import { go } from '../../lib/store';

/** Makaleler arası geri/ileri geçmişi */
export const nav = { stack: [] as string[], idx: -1 };

export function syncNav(ref: string) {
  if (nav.stack[nav.idx] === ref) return;
  if (nav.stack[nav.idx - 1] === ref) nav.idx--;
  else if (nav.stack[nav.idx + 1] === ref) nav.idx++;
  else {
    nav.stack = nav.stack.slice(0, nav.idx + 1);
    nav.stack.push(ref);
    if (nav.stack.length > 50) nav.stack.shift();
    nav.idx = nav.stack.length - 1;
  }
}

/** Liste ekranlarının kaydırma konumu (makaleden dönünce geri yüklenir) */
let listeKonum = 0;
export function listeKonumuAl(): number {
  const y = listeKonum;
  listeKonum = 0;
  return y;
}

/** Açılınca geri yüklenecek okuma konumu (Kaldığın yerden devam et) */
let bekleyenKonum: { ref: string; y: number } | null = null;
export function bekleyenKonumuAl(ref: string): number | null {
  if (!bekleyenKonum || bekleyenKonum.ref !== ref) return null;
  const y = bekleyenKonum.y;
  bekleyenKonum = null;
  return y;
}

/**
 * Makale açar. yeni: geçmiş bu makaleyle yeniden başlar (listeden açılış).
 * y: okunan oran (0..1) — açılınca oraya kaydırılır.
 */
export function acMakale(ref: string, o: { yeni?: boolean; y?: number } = {}) {
  listeKonum = document.getElementById('main')?.scrollTop ?? 0;
  if (o.yeni) {
    nav.stack = [ref];
    nav.idx = 0;
  }
  bekleyenKonum = o.y && o.y > 0.02 ? { ref, y: o.y } : null;
  go.article(ref);
}
