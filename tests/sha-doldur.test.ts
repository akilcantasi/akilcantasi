// tools/hf/sha-doldur.mjs: katalogdaki eksik SHA-256 özetlerinin yayımcı kaynaklarından doldurulması
import { describe, expect, it } from 'vitest';
// @ts-ignore .mjs betiği
import { eksikleriDoldur, hfAgacindanDoldur, HF_BASE, kiwixShaAdresi, shaDosyasiCoz } from '../tools/hf/sha-doldur.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

describe('kiwixShaAdresi', () => {
  it('Kiwix adresinden yayımcının .sha256 adresi', () => {
    expect(kiwixShaAdresi(['https://mirror.download.kiwix.org/zim/other/x_en_all_2026-01.zim'])).toBe('https://download.kiwix.org/zim/other/x_en_all_2026-01.zim.sha256');
    expect(kiwixShaAdresi(['https://download.kiwix.org/zim/wikipedia/w.zim'])).toBe('https://download.kiwix.org/zim/wikipedia/w.zim.sha256');
  });
  it('Kiwix olmayan, http ya da yol kaçışlı adres: null', () => {
    expect(kiwixShaAdresi(['https://huggingface.co/datasets/x/resolve/main/zim/w.zim'])).toBeNull();
    expect(kiwixShaAdresi(['http://download.kiwix.org/zim/w.zim'])).toBeNull();
    expect(kiwixShaAdresi(['https://download.kiwix.org/zim/../etc/w.zim'])).toBeNull();
    expect(kiwixShaAdresi([])).toBeNull();
  });
});

describe('shaDosyasiCoz', () => {
  it('yalnız tam olarak bu dosya adına ait 64 onaltılık özet kabul edilir', () => {
    expect(shaDosyasiCoz(`${A}  w_2026-09.zim\n`, 'w_2026-09.zim')).toBe(A);
    expect(shaDosyasiCoz(`${A.toUpperCase()} *w_2026-09.zim`, 'w_2026-09.zim')).toBe(A);
    expect(shaDosyasiCoz(`${A}  /data/zim/w_2026-09.zim`, 'w_2026-09.zim')).toBe(A);
    expect(shaDosyasiCoz(`${B}  w_2026-08.zim\n${A}  w_2026-09.zim`, 'w_2026-09.zim')).toBe(A);
  });
  it('başka dosya adı, adsız özet, kısa özet ya da HTML: null', () => {
    expect(shaDosyasiCoz(`${A}  w_2026-08.zim`, 'w_2026-09.zim')).toBeNull();
    expect(shaDosyasiCoz(`${A}  w_2026-09.zim.part`, 'w_2026-09.zim')).toBeNull();
    expect(shaDosyasiCoz(A, 'w_2026-09.zim')).toBeNull();
    expect(shaDosyasiCoz(`${A.slice(1)}  w_2026-09.zim`, 'w_2026-09.zim')).toBeNull();
    expect(shaDosyasiCoz('<html>Not Found</html>', 'w_2026-09.zim')).toBeNull();
    expect(shaDosyasiCoz(null, 'w.zim')).toBeNull();
  });
});

const katalog = () => ({
  version: 1,
  updated: '2026-11-01',
  packs: [
    { id: 'hf-bos', kind: 'zim', file: 'a.zim', size: 100, sha256: '', urls: [HF_BASE + 'zim/a.zim'] },
    { id: 'hf-yaklasik', kind: 'zim', file: 'b.zim', size: 90, sizeApprox: true, sha256: '', urls: [HF_BASE + 'zim/b.zim'] },
    { id: 'hf-boyut-farkli', kind: 'zim', file: 'c.zim', size: 5, sha256: '', urls: [HF_BASE + 'zim/c.zim'] },
    { id: 'hf-celisen', kind: 'zim', file: 'd.zim', size: 7, sha256: B, urls: [HF_BASE + 'zim/d.zim'] },
    { id: 'kiwix', kind: 'zim', file: 'k_2026-10.zim', size: 1, sha256: '', urls: ['https://mirror.download.kiwix.org/zim/other/k_2026-10.zim', 'https://download.kiwix.org/zim/other/k_2026-10.zim'] },
    { id: 'kiwix-yanlis-ad', kind: 'zim', file: 'y_2026-10.zim', size: 1, sha256: '', urls: ['https://download.kiwix.org/zim/other/y_2026-10.zim'] },
    { id: 'ses', kind: 'ses', file: 's.tar', size: 1, sizeApprox: true, sha256: '', urls: ['https://akilcantasi.com/packs/s.tar'] },
  ],
});
const agac = [
  { type: 'file', path: 'zim/a.zim', size: 100, lfs: { oid: A, size: 100 } },
  { type: 'file', path: 'zim/b.zim', size: 95, lfs: { oid: A, size: 95 } },
  { type: 'file', path: 'zim/c.zim', size: 6, lfs: { oid: A, size: 6 } },
  { type: 'file', path: 'zim/d.zim', size: 7, lfs: { oid: A, size: 7 } },
  { type: 'file', path: 'zim/e.zim', size: 7, lfs: { oid: 'kisa', size: 7 } },
];

describe('hfAgacindanDoldur', () => {
  it('LFS özeti boyut tutunca yazılır; yaklaşık boyut kesinleşir; var olan özet değişmez', () => {
    const k = katalog();
    const r = hfAgacindanDoldur(k, agac);
    expect(r.doldurulan).toEqual(['hf-bos', 'hf-yaklasik']);
    expect(r.celisen).toEqual(['hf-celisen']);
    expect(k.packs[0].sha256).toBe(A);
    expect(k.packs[1]).toMatchObject({ sha256: A, size: 95, sizeApprox: false });
    expect(k.packs[2].sha256).toBe('');
    expect(k.packs[3].sha256).toBe(B);
  });
});

describe('eksikleriDoldur', () => {
  it('HF ağacı ve Kiwix .sha256 dosyalarından doldurur; bulunamayanları bildirir', async () => {
    const k = katalog();
    const istenen: string[] = [];
    const r = await eksikleriDoldur(k, async (u: string) => {
      istenen.push(u);
      if (u === 'https://huggingface.co/api/datasets/akilcantasi/paketler/tree/main/zim') return JSON.stringify(agac);
      if (u === 'https://download.kiwix.org/zim/other/k_2026-10.zim.sha256') return `${B}  k_2026-10.zim\n`;
      if (u === 'https://download.kiwix.org/zim/other/y_2026-10.zim.sha256') return `${B}  baska_2026-10.zim\n`;
      return null;
    });
    expect(r.doldurulan).toEqual(['hf-bos', 'hf-yaklasik', 'kiwix']);
    expect(k.packs[4].sha256).toBe(B);
    expect(k.packs[5].sha256).toBe('');
    expect(r.bulunamayan).toEqual(expect.arrayContaining(['hf-boyut-farkli', 'kiwix-yanlis-ad', 'ses']));
    expect(istenen.every((u) => u.startsWith('https://'))).toBe(true);
  });
  it('kaynaklara ulaşılamazsa hiçbir şey değişmez', async () => {
    const k = katalog();
    const once = JSON.stringify(k);
    const r = await eksikleriDoldur(k, async () => null);
    expect(r.doldurulan).toEqual([]);
    expect(JSON.stringify(k)).toBe(once);
  });
});
