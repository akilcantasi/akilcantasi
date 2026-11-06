// ZIM okuyucusunun bozuk / kötü niyetli arşivlere dayanıklılığı (Denetim 2026-11):
// sonsuz döngü, sınırsız bellek ve sıkıştırma bombası olmamalı.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { RandomAccessSource } from '../src/lib/source';
import { ZimArchive, htmlToText, extractParagraphs } from '../src/lib/zim';
import { searchArchive } from '../src/lib/zim/search';
import { decompressXz, decompressZstd, zstdBound, MAX_CLUSTER_BYTES } from '../src/lib/zim/decompress';
import { stripBlocks } from '../src/lib/zim/text';

const here = dirname(fileURLToPath(import.meta.url));
const ZSTD = readFileSync(join(here, '..', 'testdata', 'sample_tr.zim'));
const XZ = readFileSync(join(here, '..', 'testdata', 'sample_xz_oldns.zim'));
const MED = readFileSync(join(here, '..', 'testdata', 'sample_med_en.zim'));

/**
 * Okuma bütçeli kaynak: bütçe aşılırsa hata fırlatır. Bellekteki kaynak yalnız mikro görevlerle
 * çalıştığından gerçek bir sonsuz döngü zamanlayıcıyla yakalanamaz; okuma sayısı yakalar.
 */
class BudgetSource implements RandomAccessSource {
  reads = 0;
  constructor(private bytes: Uint8Array, private budget = 50_000, readonly name = 'bozuk.zim') {}
  get size() {
    return this.bytes.length;
  }
  async read(o: number, l: number) {
    if (++this.reads > this.budget) throw new Error('OKUMA_BUTCESI');
    return this.bytes.subarray(o, Math.min(o + l, this.bytes.length));
  }
}

/** Belirlenimli sözde rastgele (mulberry32): hata çıkarsa aynı tohumla yeniden üretilebilir */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function exercise(bytes: Uint8Array): Promise<BudgetSource> {
  const src = new BudgetSource(bytes);
  const quiet = <T>(p: Promise<T>) => p.catch(() => null);
  const z = await quiet(ZimArchive.open(src));
  if (z) {
    await quiet(z.searchTitles('de', 10));
    await quiet(z.searchTitles('Hİpotermi', 5));
    await quiet(z.getMainPage());
    await quiet(z.getArticle('Deprem'));
    await quiet(z.getMetadata('Title'));
    await quiet(searchArchive(z, 'deprem çadır', { limit: 5 }));
    await quiet(z.xapian('title').then((db) => db?.termsWithPrefix('de', 5)));
    await quiet(z.randomArticle(rng(1)));
  }
  return src;
}

const view = (b: Uint8Array) => new DataView(b.buffer, b.byteOffset, b.byteLength);

describe('ZIM başlık denetimi', () => {
  it('dosya dışını gösteren girdi/küme sayısı reddedilir', async () => {
    for (const [off, val] of [
      [24, 0xffffffff], // entryCount
      [28, 0xffffffff], // clusterCount
    ] as const) {
      const b = new Uint8Array(ZSTD);
      view(b).setUint32(off, val, true);
      await expect(ZimArchive.open(new BudgetSource(b))).rejects.toThrow(/Bozuk ZIM/);
    }
    const b = new Uint8Array(ZSTD);
    view(b).setBigUint64(32, 2n ** 40n, true); // urlPtrPos
    await expect(ZimArchive.open(new BudgetSource(b))).rejects.toThrow(/Bozuk ZIM/);
  });

  it('başlık listesinin bozuk uzunluğu aramayı sonsuz döngüye sokmaz', async () => {
    const good = await ZimArchive.open(new BudgetSource(ZSTD));
    const d = await good.findByPath('X', 'listing/titleOrdered/v1');
    expect(d).toBeTruthy();
    const r = (await good.resolve(d!))!;
    const h = good.header;
    const b = new Uint8Array(ZSTD);
    const dv = view(b);
    const start = Number(dv.getBigUint64(h.clusterPtrPos + r.cluster! * 8, true));
    const info = b[start];
    expect(info & 0x0f).toBeLessThanOrEqual(1); // sıkıştırmasız liste (normal durum)
    const osz = info & 0x10 ? 8 : 4;
    const at = start + 1 + (r.blob! + 1) * osz;
    // Liste 2^33 girdi uzunluğunda görünsün: eski (a+b)>>>1 orta noktası burada sonsuz döngüye giriyordu
    if (osz === 8) dv.setBigUint64(at, 2n ** 35n, true);
    else dv.setUint32(at, 0xfffffff0, true);
    const src = new BudgetSource(b);
    const z = await ZimArchive.open(src);
    expect(z.articleCount).toBeLessThanOrEqual(h.entryCount);
    await z.searchTitles('Deprem', 5).catch(() => null);
    await searchArchive(z, 'deprem', { limit: 5 }).catch(() => null);
    expect(src.reads).toBeLessThan(50_000);
  });

  it('dev blob boyutu bellek ayırmadan reddedilir', async () => {
    // Sıkıştırmasız küme bulunur ve ilk blobun bitişi dosya boyutunun ötesine çekilir
    const z0 = await ZimArchive.open(new BudgetSource(MED));
    const b = new Uint8Array(MED);
    const dv = view(b);
    const h = z0.header;
    let patched = -1;
    for (let c = 0; c < h.clusterCount && patched < 0; c++) {
      const start = Number(dv.getBigUint64(h.clusterPtrPos + c * 8, true));
      const info = b[start];
      if ((info & 0x0f) > 1) continue;
      const osz = info & 0x10 ? 8 : 4;
      if (osz === 8) dv.setBigUint64(start + 1 + osz, 2n ** 40n, true);
      else dv.setUint32(start + 1 + osz, 0xfffffff0, true);
      patched = c;
    }
    if (patched < 0) return; // örnek arşivde sıkıştırmasız küme yoksa denetlenecek bir şey yok
    const z = await ZimArchive.open(new BudgetSource(b));
    await expect(z.getBlob(patched, 0)).rejects.toThrow(/Bozuk blob/);
  });
});

describe('ZIM bulanık sınama (rastgele bozulmuş baytlar)', { timeout: 120_000 }, () => {
  for (const [name, base] of [
    ['zstd/yeni ad alanı', ZSTD],
    ['xz/eski ad alanı', XZ],
    ['tıp örneği', MED],
  ] as const) {
    it(`${name}: 150 bozuk kopya askıda kalmadan açılır ya da reddedilir`, async () => {
      const rand = rng(name.length * 7919);
      for (let i = 0; i < 150; i++) {
        const b = new Uint8Array(base);
        const flips = 1 + Math.floor(rand() * 24);
        for (let k = 0; k < flips; k++) {
          // Bozulmaların bir kısmı başlık ve işaretçi listelerine (dosyanın başı) yoğunlaşsın
          const pos = rand() < 0.3 ? Math.floor(rand() * Math.min(4096, b.length)) : Math.floor(rand() * b.length);
          b[pos] = Math.floor(rand() * 256);
        }
        const src = await exercise(b);
        expect(src.reads, `kopya ${i}: okuma bütçesi aşıldı (olası sonsuz döngü)`).toBeLessThan(50_000);
      }
    });
  }
});

describe('sıkıştırma bombası', () => {
  const frame = (flg: number, extra: number[], blocks: number[][]) =>
    Uint8Array.from([0x28, 0xb5, 0x2f, 0xfd, flg, ...extra, ...blocks.flat()]);
  const blockHeader = (last: boolean, type: number, size: number) => {
    const v = (size << 3) | (type << 1) | (last ? 1 : 0);
    return [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff];
  };

  it('zstd: sınır hesabı gerçek açılmış boyutla tutarlı (RLE + ham blok)', async () => {
    // Tek bölüm yok, 128 KB pencere; 3 RLE bloğu (her biri 1000 bayt) + son ham blok (2 bayt)
    const f = frame(0x00, [7 << 3], [
      [...blockHeader(false, 1, 1000), 0x41],
      [...blockHeader(false, 1, 1000), 0x42],
      [...blockHeader(false, 1, 1000), 0x43],
      [...blockHeader(true, 0, 2), 0x44, 0x45],
    ]);
    expect(zstdBound(f).out).toBe(3002);
    const out = await decompressZstd(f);
    expect(out.length).toBe(3002);
    expect(out[0]).toBe(0x41);
    expect(out[3001]).toBe(0x45);
  });

  it('zstd: çok sayıda RLE bloğuyla şişen veri açılmadan reddedilir', async () => {
    const blocks: number[][] = [];
    for (let i = 0; i < 1100; i++) blocks.push([...blockHeader(i === 1099, 1, 131072), 0]);
    const f = frame(0x00, [7 << 3], blocks); // ~4 KB → ~144 MB
    expect(zstdBound(f).out).toBeGreaterThan(MAX_CLUSTER_BYTES);
    await expect(decompressZstd(f)).rejects.toThrow(/çok büyük/);
  });

  it('zstd: başlıkta dev içerik boyutu (4 GB) bellek ayırmadan reddedilir', async () => {
    // fcf=3 (8 bayt boyut) + tek bölüm
    const fcs = [0, 0, 0, 0, 1, 0, 0, 0]; // 2^32
    const f = frame(0xe0, fcs, [[...blockHeader(true, 0, 1), 0x41]]);
    await expect(decompressZstd(f)).rejects.toThrow(/çok büyük/);
  });

  it('zstd: bozuk çerçeve hata verir', () => {
    expect(() => zstdBound(Uint8Array.from([1, 2, 3, 4, 5]))).toThrow();
    expect(() => zstdBound(frame(0x00, [7 << 3], [[...blockHeader(false, 3, 10)]]))).toThrow();
  });

  it('xz: çıktı sınırı aşılınca okuma kesilir', async () => {
    const z = await ZimArchive.open(new BudgetSource(XZ));
    const h = z.header;
    const dv = view(new Uint8Array(XZ));
    let tested = 0;
    for (let c = 0; c < h.clusterCount; c++) {
      const start = Number(dv.getBigUint64(h.clusterPtrPos + c * 8, true));
      const end = c + 1 < h.clusterCount ? Number(dv.getBigUint64(h.clusterPtrPos + (c + 1) * 8, true)) : h.checksumPos || XZ.length;
      if ((XZ[start] & 0x0f) !== 4) continue;
      const raw = new Uint8Array(XZ.subarray(start + 1, end));
      const full = await decompressXz(raw);
      if (full.length < 64) continue;
      await expect(decompressXz(raw, 16)).rejects.toThrow(/çok büyük/);
      tested++;
    }
    expect(tested).toBeGreaterThan(0);
  });
});

describe('HTML → metin: bozuk makalede doğrusal süre', () => {
  const time = (f: () => unknown) => {
    const t = performance.now();
    f();
    return performance.now() - t;
  };
  it('kapanmayan yorum/betik/etiket yığınları sekmeyi kilitlemez', () => {
    // Eski düzenli ifadelerle 80 KB'lık "<a" yığını ~4 sn sürüyordu (karesel); bunlar 1 MB
    const cases = [
      '<!--'.repeat(250_000),
      '<script>'.repeat(125_000),
      '<head>'.repeat(170_000),
      '<a'.repeat(500_000),
      '<a b="'.repeat(170_000),
      '<!DOCTYPE'.repeat(110_000),
      '<![CDATA['.repeat(110_000),
    ];
    for (const html of cases) {
      const ms = time(() => extractParagraphs('<p>' + 'Başlangıç metni yeterince uzun bir paragraf. '.repeat(3) + '</p>' + html, 1500));
      expect(ms, html.slice(0, 12)).toBeLessThan(1500);
    }
  });

  it('blok atma: kapalı bloklar atılır, kapanmayan betik belgenin sonunu yutar, kapanmayan head yutmaz', () => {
    expect(stripBlocks('a<!-- x -->b<script>if(a<b)</script>c<STYLE type="x">p{}</style >d')).toBe('a b c d');
    expect(stripBlocks('a<script>bitmeyen')).toBe('a ');
    expect(stripBlocks('<html><head><title>t</title><body><p>gövde</p>')).toContain('<p>gövde</p>');
    expect(stripBlocks('x<header>başlık</header>')).toBe('x<header>başlık</header>');
    expect(htmlToText('<p>Bir <b>iki</b> üç</p><!-- yorum --><p>dört</p>')).toBe('Bir iki üç\n\ndört');
  });
});
