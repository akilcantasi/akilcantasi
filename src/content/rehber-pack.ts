// İsteğe bağlı indirilen rehber paketlerinin dosya biçimi (<paket-kimliği>.rehber.json).
// Paket kod içeremez: rehberler düz veri, çizimler sabit SVG metnidir.
// Bu modül saftır (DOM, ağ, depolama yok): derleme betiği ve testler de kullanır.
// Ayrıntı: docs/REHBER_PAKETLERI.md
import type { CategoryMeta, Guide } from './types';

export const REHBER_FORMAT = 'akil-rehber';
export const REHBER_FORMAT_VERSION = 1;
export const REHBER_EXT = '.rehber.json';

export interface RehberPackMeta {
  id: string;
  name: string;
  desc: string;
  version: number;
}

export type RehberPackGuide = Guide & { category: string };

export interface RehberPack {
  format: typeof REHBER_FORMAT;
  version: number;
  pack: RehberPackMeta;
  categories: CategoryMeta[];
  guides: RehberPackGuide[];
  /** çizim kimliği → SVG metni */
  art: Record<string, string>;
}

const ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
const isStr = (x: unknown): x is string => typeof x === 'string';
const isStrArr = (x: unknown): x is string[] => Array.isArray(x) && x.every(isStr);

/**
 * SVG metnini temizler: script, foreignObject, style, iframe vb. öğeleri, on* olay
 * özniteliklerini ve sayfa dışına giden bağlantıları (href/xlink:href yalnız "#…" olabilir)
 * atar. SVG değilse null. Uygulama ayrıca çizimi <img> içinde gösterir (betik çalışmaz).
 */
export function sanitizeSvg(svg: string): string | null {
  if (!isStr(svg)) return null;
  let s = svg.trim().replace(/^<\?xml[^>]*\?>\s*/i, '');
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>\s*$/i.test(s)) return null;
  // Yorumlar, CDATA, DOCTYPE/ENTITY
  s = s.replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '').replace(/<!(DOCTYPE|ENTITY)[^>]*>/gi, '');
  // Tehlikeli öğeler (içerikleriyle birlikte) ve kendiliğinden kapanan halleri
  const BAD = 'script|foreignObject|style|iframe|object|embed|audio|video|image|use|animate|animateMotion|animateTransform|set|handler|listener';
  for (let i = 0; i < 3; i++) {
    s = s.replace(new RegExp(`<(${BAD})\\b[\\s\\S]*?<\\/\\1\\s*>`, 'gi'), '');
    s = s.replace(new RegExp(`<\\/?(${BAD})\\b[^>]*>`, 'gi'), '');
  }
  // on* olay öznitelikleri (tırnaklı ya da tırnaksız)
  s = s.replace(/\s(on[a-z0-9_-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // Bağlantılar: yalnız belge içi (#kimlik) kalabilir
  s = s.replace(/\s((?:xlink:)?href)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (m, _a, v: string) => {
    const val = v.replace(/^["']|["']$/g, '').trim();
    return val.startsWith('#') ? m : '';
  });
  // CSS içinde dış kaynak ya da betik
  s = s.replace(/url\(\s*['"]?\s*(?!#)[^)]*\)/gi, 'none').replace(/javascript:/gi, '');
  return s;
}

/** SVG'yi <img src> için veri adresine çevirir. */
export function svgDataUri(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Dosya adı rehber paketi mi? (".rehber.json" — sıradan .json harita noktası sayılır) */
export function isRehberFile(name: string): boolean {
  return name.toLowerCase().endsWith(REHBER_EXT);
}

function checkGuide(g: any, cats: Set<string>): string[] {
  const e: string[] = [];
  if (!g || typeof g !== 'object') return ['nesne değil'];
  if (!isStr(g.id) || !ID_RE.test(g.id)) e.push('id geçersiz');
  if (!isStr(g.title) || !g.title) e.push('title yok');
  if (!isStr(g.tag)) e.push('tag yok');
  if (!isStr(g.summary)) e.push('summary yok');
  if (!isStrArr(g.steps) || !g.steps.length) e.push('steps geçersiz');
  if (!isStrArr(g.keywords)) e.push('keywords geçersiz');
  if (!isStrArr(g.sources)) e.push('sources geçersiz');
  if (typeof g.reviewed !== 'boolean') e.push('reviewed true/false olmalı');
  if (!isStr(g.category) || !cats.has(g.category)) e.push('category bilinmiyor');
  if (g.art !== undefined && !(Array.isArray(g.art) && g.art.every((a: unknown) => a === null || isStr(a)))) e.push('art geçersiz');
  if (g.dont !== undefined && !isStrArr(g.dont)) e.push('dont geçersiz');
  if (g.alsoIn !== undefined && !isStrArr(g.alsoIn)) e.push('alsoIn geçersiz');
  if (g.note !== undefined && !isStr(g.note)) e.push('note metin olmalı');
  for (const k of ['callEmergency', 'critical'] as const) if (g[k] !== undefined && typeof g[k] !== 'boolean') e.push(k + ' true/false olmalı');
  return e;
}

/**
 * Paket doğrulaması. Biçim ya da paket bilgisi bozuksa ok=false ve paket kullanılmaz;
 * tek tek bozuk rehber/çizimler atılır ve errors'a yazılır.
 */
export function validateRehberPack(input: unknown): { ok: boolean; errors: string[]; pack: RehberPack | null } {
  const errors: string[] = [];
  const x = input as any;
  if (!x || typeof x !== 'object') return { ok: false, errors: ['paket nesne değil'], pack: null };
  if (x.format !== REHBER_FORMAT) return { ok: false, errors: [`format '${REHBER_FORMAT}' olmalı`], pack: null };
  if (typeof x.version !== 'number' || x.version > REHBER_FORMAT_VERSION) errors.push('desteklenmeyen sürüm');
  const p = x.pack;
  if (!p || !isStr(p.id) || !ID_RE.test(p.id) || !isStr(p.name) || !p.name || typeof p.version !== 'number') errors.push('pack bilgisi geçersiz');
  if (!Array.isArray(x.categories)) errors.push('categories dizi olmalı');
  if (!Array.isArray(x.guides)) errors.push('guides dizi olmalı');
  if (errors.length) return { ok: false, errors, pack: null };

  const categories: CategoryMeta[] = [];
  const catIds = new Set<string>();
  x.categories.forEach((c: any, i: number) => {
    if (!c || !isStr(c.id) || !ID_RE.test(c.id) || !isStr(c.title) || catIds.has(c.id)) {
      errors.push(`categories[${i}]: geçersiz`);
      return;
    }
    catIds.add(c.id);
    categories.push({
      id: c.id,
      title: c.title,
      hint: isStr(c.hint) ? c.hint : '',
      art: isStr(c.art) ? c.art : '',
      color: isStr(c.color) ? c.color : '',
      order: typeof c.order === 'number' ? c.order : 1000 + i,
    });
  });

  const guides: RehberPackGuide[] = [];
  const ids = new Set<string>();
  x.guides.forEach((g: any, i: number) => {
    const e = checkGuide(g, catIds);
    if (!e.length && ids.has(g.id)) e.push('id tekrar ediyor');
    if (e.length) {
      errors.push(`guides[${i}]${g && isStr(g.id) ? ' (' + g.id + ')' : ''}: ${e.join(', ')}`);
      return;
    }
    ids.add(g.id);
    guides.push(g as RehberPackGuide);
  });

  const art: Record<string, string> = {};
  if (x.art && typeof x.art === 'object') {
    for (const [k, v] of Object.entries(x.art)) {
      const clean = isStr(v) ? sanitizeSvg(v) : null;
      if (clean) art[k] = clean;
      else errors.push(`art.${k}: SVG değil`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    pack: { format: REHBER_FORMAT, version: x.version, pack: { id: p.id, name: p.name, desc: isStr(p.desc) ? p.desc : '', version: p.version }, categories, guides, art },
  };
}
