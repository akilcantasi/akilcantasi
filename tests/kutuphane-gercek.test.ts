// Kütüphane: gerçek ZIM dosyalarıyla okuma (Android paket yolu, taranmış PDF, başlık araması).
// Dosyalar yoksa atlanır:  AC_REAL_ZIM_DIR=/yol/klasör npx vitest run tests/kutuphane-gercek.test.ts
// Tarayıcıda üç okuma yolunun tamamı: node e2e/kutuphane-gercek-check.mjs
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, openSync, readSync, fstatSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { QueryRangeSource, type RandomAccessSource } from '../src/lib/source';
import { ZimArchive } from '../src/lib/zim';
import { searchArchive } from '../src/lib/zim/search';
import { pdfBelgeAyarlari } from '../src/lib/pdf';

const DIR = process.env.AC_REAL_ZIM_DIR || '/home/claude/realzim';
const ZIMLER = existsSync(DIR) ? readdirSync(DIR).filter((n) => /\.zim$/i.test(n) && !n.startsWith('.')) : [];
const bul = (re: RegExp) => ZIMLER.find((n) => re.test(n));
const KOK = path.resolve(__dirname, '..');

class FileSource implements RandomAccessSource {
  private fd: number;
  readonly size: number;
  constructor(p: string, readonly name = path.basename(p)) {
    this.fd = openSync(p, 'r');
    this.size = fstatSync(this.fd).size;
  }
  async read(o: number, l: number) {
    const b = Buffer.alloc(Math.max(0, Math.min(l, this.size - o)));
    readSync(this.fd, b, 0, b.length, o);
    return new Uint8Array(b.buffer, b.byteOffset, b.length);
  }
}

/** MainActivity.packResponse'un ?aralik= yolu (Java ile aynı durum kodları ve uzunluk) */
function paketSunucusu() {
  return http.createServer((req, res) => {
    const u = new URL(req.url!, 'http://localhost');
    const name = decodeURIComponent(u.pathname.replace(/^\/_paket\//, ''));
    const f = path.join(DIR, name);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.zim$/.test(name) || !existsSync(f)) {
      res.writeHead(404);
      return res.end();
    }
    const size = statSync(f).size;
    const m = /^(\d+)-(\d+)$/.exec(u.searchParams.get('aralik') ?? '');
    const start = m ? Number(m[1]) : NaN;
    const end = m ? Math.min(size - 1, Number(m[2])) : NaN;
    if (!m || start >= size || start > end) {
      res.writeHead(416, { 'Content-Range': 'bytes */' + size });
      return res.end();
    }
    res.writeHead(200, { 'Content-Length': String(end - start + 1), 'Cache-Control': 'no-store' });
    createReadStream(f, { start, end }).pipe(res);
  });
}

describe.skipIf(!ZIMLER.length)('gerçek ZIM: Android paket yolu (?aralik=)', { timeout: 120000 }, () => {
  let srv: http.Server;
  let base = '';
  beforeAll(async () => {
    srv = paketSunucusu();
    await new Promise<void>((ok) => srv.listen(0, '127.0.0.1', ok));
    base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}/_paket/`;
  });
  afterAll(() => srv?.close());

  it('her dosya açılır; ana sayfa (ya da kitap listesi) ve görseller okunur', async () => {
    for (const n of ZIMLER) {
      const zim = await ZimArchive.open(new QueryRangeSource(base + encodeURIComponent(n), statSync(path.join(DIR, n)).size, n));
      const ana = await zim.getMainPage();
      expect(ana, n).toBeTruthy();
      expect(ana!.mime, n).toMatch(/^text\/html/);
      // İlk birkaç görsel arşivden okunur ve türü görseldir
      const yollar = [...ana!.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => zim.resolveLink(ana!.path, m[1])).filter((x): x is string => !!x);
      for (const y of yollar.slice(0, 3)) {
        const r = await zim.getResource(y);
        if (r) expect(r.mime, `${n} ${y}`).toMatch(/^image\//);
      }
      // Rastgele maddeler de okunur
      for (let i = 0; i < 3; i++) {
        const h = await zim.randomArticle();
        if (h) expect(await zim.getArticle(h.path), `${n} ${h.path}`).toBeTruthy();
      }
    }
  });

  it('dosya sonunu aşan ve bozuk aralık 416, eksik okuma hata verir', async () => {
    const n = ZIMLER[0];
    const size = statSync(path.join(DIR, n)).size;
    expect((await fetch(`${base}${n}?aralik=${size}-${size + 10}`)).status).toBe(416);
    expect((await fetch(`${base}${n}?aralik=abc`)).status).toBe(416);
    // Boyutu yanlış bildirilen kaynak: istenen bayt gelmezse sessizce bozuk veri dönmez
    const yanlis = new QueryRangeSource(base + n, size + 100, n);
    await expect(yanlis.read(size - 10, 50)).rejects.toThrow(/Eksik okuma/);
    // Doğru okuma dosyanın baytlarıyla aynıdır
    const q = new QueryRangeSource(base + n, size, n);
    const disk = readFileSync(path.join(DIR, n)).subarray(1000, 1300);
    expect(Buffer.from(await q.read(1000, 300)).equals(disk)).toBe(true);
  });
});

describe.skipIf(!bul(/wikipedia_tr_all_mini/))('gerçek ZIM: başlık araması', { timeout: 60000 }, () => {
  it('"Vikipedi" araması aynı katlanmış başlıklı yönlendirmeyi ("Vıkıpedı") değil maddeyi getirir', async () => {
    const zim = await ZimArchive.open(new FileSource(path.join(DIR, bul(/wikipedia_tr_all_mini/)!)));
    const h = await searchArchive(zim, 'Vikipedi', { limit: 10 });
    expect(h[0]).toMatchObject({ title: 'Vikipedi', path: 'Vikipedi' });
    // Önek araması yönlendirme bilgisini taşır
    const t = await zim.searchTitles('Vikipedi', 10);
    expect(t.every((x) => typeof x.redirect === 'boolean')).toBe(true);
    expect(t.find((x) => x.title === 'Vikipedi')?.redirect).toBe(false);
  });
});

/**
 * Taranmış PDF'in (CCITT faks görselleri) ilk sayfası işlenir; çözülemeyen görseller için pdf.js'nin
 * uyarıları döner (sayfa o zaman boş çizilir) ve çizilen görsel sayısı.
 */
async function sayfaIsle(data: Uint8Array, ayar: Record<string, unknown>) {
  // @ts-ignore tür bildirimi pdfjs-dist/legacy/build/pdf.d.mts
  const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const uyari: string[] = [];
  const casus = vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => void uyari.push(a.join(' ')));
  const casus2 = vi.spyOn(console, 'warn').mockImplementation((...a: unknown[]) => void uyari.push(a.join(' ')));
  try {
    const gorev = pdfjs.getDocument({ data: data.slice(), isEvalSupported: false, verbosity: 1, ...ayar });
    const doc = await gorev.promise;
    const page = await doc.getPage(1);
    const ops = await page.getOperatorList();
    const gorsel = ops.fnArray.filter((f: number) => f === pdfjs.OPS.paintImageXObject || f === pdfjs.OPS.paintImageMaskXObject).length;
    await gorev.destroy();
    return { gorsel, cozulemedi: uyari.filter((u) => /decode image|Jbig2|wasmUrl|OpenJPEG/i.test(u)) };
  } finally {
    casus.mockRestore();
    casus2.mockRestore();
  }
}

describe.skipIf(!bul(/fas-military-medicine/))('gerçek ZIM: taranmış PDF', { timeout: 120000 }, () => {
  it('CCITT faks görselleri çözülür (yardımcı wasm verilmezse sayfa boş kalıyordu)', async () => {
    // Vite'ın ?url adresleri (/node_modules/…) diskteki dosyalardan okunur
    vi.stubGlobal('fetch', async (u: string) => {
      const p = path.join(KOK, decodeURIComponent(new URL(String(u), 'http://x').pathname));
      return existsSync(p) ? new Response(readFileSync(p)) : new Response('', { status: 404 });
    });
    try {
      const zim = await ZimArchive.open(new FileSource(path.join(DIR, bul(/fas-military-medicine/)!)));
      const r = await zim.getResource('irp.fas.org/doddir/milmed/bandage.pdf');
      expect(r?.mime).toBe('application/pdf');
      // Düzeltmeden önceki durum: yardımcı dosya adresi yok → görsel çözülemez
      const once = await sayfaIsle(r!.data, {});
      expect(once.cozulemedi.length).toBeGreaterThan(0);
      const sonra = await sayfaIsle(r!.data, pdfBelgeAyarlari());
      expect(sonra.cozulemedi).toEqual([]);
      expect(sonra.gorsel).toBeGreaterThan(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
