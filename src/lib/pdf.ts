// PDF okuyucu altyapısı: pdf.js (Apache-2.0) yalnız bir PDF açılınca yüklenir.
// Eski Android WebView'larda da çalışsın diye pdf.js'nin "legacy" derlemesi kullanılır.

let lib: Promise<any> | null = null;

/** pdf.js'yi (ve arka plan işçisini) yükler */
export function loadPdfjs(): Promise<any> {
  lib ??= (async () => {
    // @ts-ignore tür bildirimi pdfjs-dist/legacy/build/pdf.d.mts
    const m = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
    // @ts-ignore Vite ?url içe aktarımı
    const worker = (await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')).default;
    m.GlobalWorkerOptions.workerSrc = worker;
    return m;
  })();
  return lib;
}

/** Türkçe duyarsız karşılaştırma için katlama (ı/i, ş/s, ğ/g, ü/u, ö/o, ç/c; büyük/küçük) */
export function fold(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** pdf.js getTextContent() öğelerinden okunur sayfa metni (satır sonları korunur) */
export function itemsToText(items: { str?: string; hasEOL?: boolean }[]): string {
  let out = '';
  for (const it of items) {
    if (typeof it.str !== 'string') continue;
    out += it.str;
    out += it.hasEOL ? '\n' : it.str && !/\s$/.test(it.str) ? ' ' : '';
  }
  return out
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export interface PdfHit {
  page: number; // 1'den başlar
  at: number;
  before: string;
  match: string;
  after: string;
}

/**
 * Sayfa metinlerinde arama. Türkçe karakter ve büyük/küçük harf duyarsız.
 * Katlama karakter sayısını değiştirmediği için eşleşme konumu özgün metne de uyar.
 */
export function searchPages(pages: (string | undefined)[], query: string, max = 200): PdfHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const out: PdfHit[] = [];
  for (let p = 0; p < pages.length && out.length < max; p++) {
    const text = pages[p];
    if (!text) continue;
    const f = fold(text);
    if (f.length !== text.length) continue; // beklenmedik birleşik karakter: güvenli tarafta kal
    let i = f.indexOf(q);
    while (i >= 0 && out.length < max) {
      out.push({
        page: p + 1,
        at: i,
        before: text.slice(Math.max(0, i - 40), i).replace(/\s+/g, ' '),
        match: text.slice(i, i + q.length),
        after: text.slice(i + q.length, i + q.length + 60).replace(/\s+/g, ' '),
      });
      i = f.indexOf(q, i + q.length);
    }
  }
  return out;
}

/** Sayfa metnini çeviri için paragraflara böler */
export function pageParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter((p) => p.length > 1);
}
