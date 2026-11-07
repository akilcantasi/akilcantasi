// PDF okuyucu altyapısı: pdf.js (Apache-2.0) yalnız bir PDF açılınca yüklenir.
// Eski Android WebView'larda da çalışsın diye pdf.js'nin "legacy" derlemesi kullanılır.

let lib: Promise<any> | null = null;

/**
 * pdf.js'nin çalışma anında istediği ikili dosyalar (Vite bunları derlemeye özetli adla koyar).
 * pdf.js 5+ taranmış belgelerin görsellerini (CCITT faks, JBIG2) ve JPEG 2000'i WebAssembly ile
 * çözer; bu dosyalar verilmezse taranmış PDF sayfaları BOŞ (beyaz) görünür. Sembol yazı tipleri
 * sistemde bulunmadığı için onlar da verilir.
 */
const PDF_IKILI: Record<string, Record<string, () => Promise<{ default: string }>>> = {
  wasmUrl: {
    // @ts-ignore Vite ?url içe aktarımı
    'jbig2.wasm': () => import('pdfjs-dist/wasm/jbig2.wasm?url'),
    // @ts-ignore Vite ?url içe aktarımı
    'openjpeg.wasm': () => import('pdfjs-dist/wasm/openjpeg.wasm?url'),
  },
  standardFontDataUrl: {
    // @ts-ignore Vite ?url içe aktarımı
    'FoxitSymbol.pfb': () => import('pdfjs-dist/standard_fonts/FoxitSymbol.pfb?url'),
    // @ts-ignore Vite ?url içe aktarımı
    'FoxitDingbats.pfb': () => import('pdfjs-dist/standard_fonts/FoxitDingbats.pfb?url'),
  },
};

/** pdf.js'nin dosya adı → adres eşlemesi (dosyalar ana iş parçacığında okunup işçiye verilir) */
export class PdfIkiliVeri {
  constructor(_opts?: unknown) {}
  async fetch({ kind, filename }: { kind: string; filename: string }): Promise<Uint8Array> {
    const yukle = PDF_IKILI[kind]?.[filename];
    if (!yukle) throw new Error(`PDF yardımcı dosyası yok: ${filename}`);
    const url = (await yukle()).default;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`PDF yardımcı dosyası okunamadı: ${filename} (${res.status})`);
    return new Uint8Array(await res.arrayBuffer());
  }
}

/** getDocument'e her zaman eklenen ayarlar (çağıranın verdikleri önceliklidir) */
export function pdfBelgeAyarlari(): Record<string, unknown> {
  return { BinaryDataFactory: PdfIkiliVeri, useWorkerFetch: false, useWasm: true };
}

/** pdf.js'yi (ve arka plan işçisini) yükler */
export function loadPdfjs(): Promise<any> {
  lib ??= (async () => {
    // @ts-ignore tür bildirimi pdfjs-dist/legacy/build/pdf.d.mts
    const m = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
    // @ts-ignore Vite ?url içe aktarımı
    const worker = (await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')).default;
    m.GlobalWorkerOptions.workerSrc = worker;
    // getDocument, yardımcı dosyaları (wasm, sembol yazı tipleri) kendiliğinden bulsun diye sarılır;
    // okuyucu bileşeninin ayrıca bir şey vermesi gerekmez
    return { ...m, getDocument: (src: Record<string, unknown>) => m.getDocument({ ...pdfBelgeAyarlari(), ...src }) };
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
export function searchPages(pages: (string | undefined)[], query: string, max = 200, foldCache?: (string | undefined)[]): PdfHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const out: PdfHit[] = [];
  for (let p = 0; p < pages.length && out.length < max; p++) {
    const text = pages[p];
    if (!text) continue;
    // Katlanmış metin önbelleği: büyük kitaplarda her taramada yeniden katlamayı önler
    let f = foldCache?.[p];
    if (f === undefined) {
      f = fold(text);
      if (foldCache) foldCache[p] = f;
    }
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
