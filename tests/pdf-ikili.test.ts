// PDF okuyucu: pdf.js'nin yardımcı dosyaları (JBIG2/CCITT ve JPEG 2000 çözücü wasm'ları, sembol
// yazı tipleri) uygulamanın kendi derlemesinden verilir. Verilmezse taranmış PDF sayfaları boş
// (beyaz) çiziliyordu: "Askeri sahra tıbbı", "Düğümler" ve "Su arıtma" kitaplıklarındaki taranmış
// belgeler okunamıyordu.
import { afterEach, describe, expect, it, vi } from 'vitest';

const getDocument = vi.fn((src: unknown) => ({ promise: Promise.resolve(src) }));
vi.mock('pdfjs-dist/legacy/build/pdf.min.mjs', () => ({ GlobalWorkerOptions: {}, getDocument, OPS: { x: 1 } }));

import { loadPdfjs, PdfIkiliVeri, pdfBelgeAyarlari } from '../src/lib/pdf';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pdf.js yardımcı dosyaları', () => {
  it('getDocument her çağrıda yardımcı dosya sağlayıcısını alır; çağıranın ayarları korunur', async () => {
    const pdfjs = await loadPdfjs();
    const data = new Uint8Array([1, 2, 3]);
    const src = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
    expect(src).toMatchObject({ data, isEvalSupported: false, BinaryDataFactory: PdfIkiliVeri, useWorkerFetch: false, useWasm: true });
    // Çağıran bilerek kapatırsa o geçerli
    const kapali = await pdfjs.getDocument({ data, useWasm: false }).promise;
    expect(kapali).toMatchObject({ useWasm: false });
    // Modülün öteki dışa aktarımları yerinde
    expect(pdfjs.OPS).toEqual({ x: 1 });
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBeTruthy();
  });

  it('ayarlar: ana iş parçacığı okur (işçi kendi başına adres bilmez)', () => {
    expect(pdfBelgeAyarlari()).toEqual({ BinaryDataFactory: PdfIkiliVeri, useWorkerFetch: false, useWasm: true });
  });

  it('JBIG2 ve JPEG 2000 wasm, sembol yazı tipleri derlemedeki adreslerinden okunur', async () => {
    const istenen: string[] = [];
    vi.stubGlobal('fetch', async (u: string) => {
      istenen.push(String(u));
      return new Response(new Uint8Array([0, 0x61, 0x73, 0x6d]));
    });
    const v = new PdfIkiliVeri({});
    for (const [kind, filename] of [
      ['wasmUrl', 'jbig2.wasm'],
      ['wasmUrl', 'openjpeg.wasm'],
      ['standardFontDataUrl', 'FoxitSymbol.pfb'],
      ['standardFontDataUrl', 'FoxitDingbats.pfb'],
    ]) {
      const b = await v.fetch({ kind, filename });
      expect(b).toBeInstanceOf(Uint8Array);
      expect(b.length).toBe(4);
    }
    expect(istenen.map((u) => u.split('/').pop()!.replace(/\?.*$/, ''))).toEqual(['jbig2.wasm', 'openjpeg.wasm', 'FoxitSymbol.pfb', 'FoxitDingbats.pfb']);
  });

  it('bilinmeyen dosya ve okunamayan dosya açık hatayla reddedilir', async () => {
    const v = new PdfIkiliVeri();
    await expect(v.fetch({ kind: 'wasmUrl', filename: '../../etc/passwd' })).rejects.toThrow(/yardımcı dosyası yok/);
    await expect(v.fetch({ kind: 'cMapUrl', filename: 'Adobe-Japan1-UCS2.bcmap' })).rejects.toThrow(/yardımcı dosyası yok/);
    vi.stubGlobal('fetch', async () => new Response('', { status: 404 }));
    await expect(v.fetch({ kind: 'wasmUrl', filename: 'jbig2.wasm' })).rejects.toThrow(/okunamadı/);
  });
});
