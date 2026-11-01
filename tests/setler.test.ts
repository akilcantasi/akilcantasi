import { describe, expect, it } from 'vitest';
import { kuyruk, setDurumu, setleriAl, sigdir, toplam, VARSAYILAN_SETLER, type PaketSeti } from '../src/lib/setler';
import bundled from '../public/packs-manifest.json';

const row = (id: string, size: number, have = false): any => ({ key: id, file: id + '.zim', size, kind: 'zim', entry: { id }, device: have ? { id: id + '.zim' } : undefined });
const setler: PaketSeti[] = [
  { id: 'a', title: 'A', desc: '', ids: ['x', 'y', 'z'] },
  { id: 'b', title: 'B', desc: '', ids: ['y', 'w'] },
];
const byId = new Map([row('x', 100, true), row('y', 200), row('z', 300), row('w', 1000)].map((r) => [r.entry.id, r]));

describe('paket setleri', () => {
  it('set durumu: yüklü sayısı ve kalan boyut', () => {
    const d = setDurumu(setler[0], byId);
    expect([d.have, d.total, d.leftBytes, d.complete]).toEqual([1, 3, 500, false]);
  });
  it('kuyruk: ortak paket bir kez, yüklü ve inenler düşer', () => {
    const q = kuyruk(['a', 'b'], setler, byId, (r: any) => r.entry.id === "z");
    expect(q.map((r: any) => r.entry.id)).toEqual(['y', 'w']);
    expect(toplam(q)).toBe(1200);
  });
  it('yerimi doldur: boş yere pay bırakarak sığan setler', () => {
    expect(sigdir(setler, byId, 1500, 500)).toEqual(['a']);
    expect(sigdir(setler, byId, 3000, 500)).toEqual(['a', 'b']);
    expect(sigdir(setler, byId, null)).toEqual(['a']);
  });
  it('katalogdaki setler geçerli ve bütün kimlikler katalogda var', () => {
    const ids = new Set((bundled as any).packs.map((p: any) => p.id));
    const s = setleriAl((bundled as any).sets, ids as Set<string>);
    expect(s.map((x) => x.id)).toEqual(['temel', 'hayatta', 'saglik', 'okur', 'usta']);
    for (const x of (bundled as any).sets) for (const id of x.ids) expect(ids.has(id), id).toBe(true);
    expect(s[0].ids).toEqual(VARSAYILAN_SETLER[0].ids);
    // temel set = katalogdaki öne çıkanlar
    expect(new Set(s[0].ids)).toEqual(new Set((bundled as any).packs.filter((p: any) => p.featured).map((p: any) => p.id)));
  });
});
