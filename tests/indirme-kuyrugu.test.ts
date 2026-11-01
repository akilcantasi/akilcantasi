import { beforeEach, describe, expect, it, vi } from 'vitest';

const states: Record<string, any> = {};
let listener: (() => void) | null = null;
const started: string[] = [];
const paused: string[] = [];
vi.mock('../src/lib/downloader', () => ({
  getDownloads: () => states,
  isActive: (s: any) => !!s && (s.status === 'downloading' || s.status === 'verifying'),
  pauseDownload: (f: string) => paused.push(f),
  subscribeDownloads: (fn: () => void) => {
    listener = fn;
    return () => {};
  },
}));
vi.mock('../src/lib/packs-ui', () => ({
  startRow: (r: any) => {
    started.push(r.file);
    states[r.file] = { file: r.file, status: 'downloading' };
    return Promise.resolve();
  },
}));
vi.mock('preact/hooks', () => ({ useEffect: () => {}, useState: (v: any) => [v, () => {}] }));

const { kuyrugaEkle, bekleyenler, hepsiniDuraklat, _sifirla } = await import('../src/lib/indirme-kuyrugu');
const row = (f: string) => ({ file: f, key: f }) as any;

describe('toplu indirme kuyruğu', () => {
  beforeEach(() => {
    _sifirla();
    started.length = 0;
    paused.length = 0;
    for (const k of Object.keys(states)) delete states[k];
  });

  it('aynı anda en çok iki iniş; biri bitince sıradaki başlar', () => {
    kuyrugaEkle([row('a'), row('b'), row('c'), row('d')]);
    expect(started).toEqual(['a', 'b']);
    expect(bekleyenler()).toEqual(['c', 'd']);
    delete states.a; // bitti (downloader 'done' sonrası kaydı düşürür)
    listener!();
    expect(started).toEqual(['a', 'b', 'c']);
    states.b.status = 'error';
    listener!();
    expect(started).toEqual(['a', 'b', 'c', 'd']);
    expect(bekleyenler()).toEqual([]);
  });

  it('aynı paket iki kez eklenmez; duraklat bekleyenleri boşaltır', () => {
    kuyrugaEkle([row('a'), row('b'), row('c')]);
    kuyrugaEkle([row('c')]);
    expect(bekleyenler()).toEqual(['c']);
    hepsiniDuraklat();
    expect(paused).toEqual(['a', 'b']);
    expect(bekleyenler()).toEqual([]);
  });
});
