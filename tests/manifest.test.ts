import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { matchInstalled, packKey, recommendTier, validateManifest, KINDS, TIERS } from '../src/lib/manifest';

const raw = JSON.parse(fs.readFileSync(new URL('../public/packs-manifest.json', import.meta.url), 'utf8'));

describe('packs-manifest.json', () => {
  it('doğrulamadan geçer', () => {
    const r = validateManifest(raw);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.manifest.packs.length).toBe(raw.packs.length);
  });

  it('benzersiz id ve dosya adları, geçerli tür/düzey, url dizisi', () => {
    const ids = raw.packs.map((p: any) => p.id);
    const files = raw.packs.map((p: any) => p.file);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(files).size).toBe(files.length);
    for (const p of raw.packs) {
      expect(KINDS).toContain(p.kind);
      expect(TIERS).toContain(p.tier);
      expect(Array.isArray(p.urls)).toBe(true);
      expect(p.urls.length).toBeGreaterThan(0);
      for (const u of p.urls) expect(u).toMatch(p.kind === "poi" ? /^(https:\/\/|osm:)/ : /^https:\/\//);
      expect(p.license).toBeTruthy();
    }
  });

  it('her türden en az bir paket ve her düzeyden en az bir paket var', () => {
    for (const k of KINDS) expect(raw.packs.some((p: any) => p.kind === k), k).toBe(true);
    for (const t of TIERS) expect(raw.packs.some((p: any) => p.tier === t), t).toBe(true);
  });

  it('hatalı girdileri yakalar', () => {
    const bad = validateManifest({
      version: 1,
      updated: 'x',
      packs: [
        { ...raw.packs[0] },
        { ...raw.packs[0] }, // tekrar eden id
        { ...raw.packs[1], id: 'yeni', kind: 'video' },
        { ...raw.packs[1], id: 'yeni2', file: 'x.gguf' }, // uzantı uyuşmuyor (zim)
        { ...raw.packs[1], id: 'yeni3', file: '../kotu.zim' },
        { ...raw.packs[1], id: 'yeni4', urls: 'https://x' },
        { ...raw.packs[1], id: 'yeni5', sha256: 'xyz' },
      ],
    });
    expect(bad.ok).toBe(false);
    expect(bad.manifest.packs.length).toBe(1);
    expect(bad.errors.length).toBe(6);
    expect(validateManifest(null).ok).toBe(false);
    expect(validateManifest({ version: 1, updated: '', packs: 3 }).ok).toBe(false);
  });

  it('bilinmeyen boyut ve boş sha256 kabul edilir', () => {
    const r = validateManifest({ version: 1, updated: '2026-01-01', packs: [{ ...raw.packs[0], size: 0, sha256: '' }] });
    expect(r.ok).toBe(true);
  });
});

describe('eşleştirme ve öneri', () => {
  it('tarih ekini yok sayar', () => {
    expect(packKey('wikipedia_tr_all_nopic_2026-10.zim')).toBe('wikipedia_tr_all_nopic.zim');
    expect(packKey('wikipedia_tr_all_nopic_2024-05-12.zim')).toBe('wikipedia_tr_all_nopic.zim');
    expect(packKey('qwen2.5-0.5b-instruct-q4_k_m.gguf')).toBe('qwen2.5-0.5b-instruct-q4_k_m.gguf');
    const e = validateManifest(raw).manifest.packs.find((p) => p.id === 'wikipedia-tr-nopic')!;
    const m = matchInstalled(e, [
      { id: 'wikipedia_tr_all_nopic_2025-03.zim', kind: 'zim', size: 1, origin: 'server', url: './data/x' },
      { id: 'wikipedia_tr_all_mini_2025-03.zim', kind: 'zim', size: 1, origin: 'device' },
    ]);
    expect(m.map((x) => x.id)).toEqual(['wikipedia_tr_all_nopic_2025-03.zim']);
  });

  it('cihaza göre düzey önerir', () => {
    expect(recommendTier({ memGB: 2, freeBytes: 50e9 }).tier).toBe('temel');
    expect(recommendTier({ memGB: 8, freeBytes: 2e9 }).tier).toBe('temel');
    expect(recommendTier({ memGB: 4, freeBytes: 50e9 }).tier).toBe('standart');
    expect(recommendTier({ memGB: null, freeBytes: 50e9 }).tier).toBe('standart');
    expect(recommendTier({ memGB: 8, freeBytes: 50e9 }).tier).toBe('tam');
  });
});

import { groupModels, parseShard } from '../src/lib/fener/models';
import { planWhisperPack } from '../src/lib/voice/whisper-pack';

describe('Fener ve ses paketleri katalogda', () => {
  const packs = validateManifest(raw).manifest.packs;

  it('bölünmüş model parçaları (varsa) eksiksiz ve aynı grupta; her parça 2 GB altında', () => {
    const groups = new Map<string, typeof packs>();
    for (const p of packs.filter((x) => x.group)) groups.set(p.group!, [...(groups.get(p.group!) ?? []), p]);
    for (const [gid, parts] of groups) {
      const shards = parts.map((p) => parseShard(p.file));
      expect(shards.every(Boolean), gid).toBe(true);
      const total = shards[0]!.total;
      expect(new Set(shards.map((s) => s!.base)).size, gid).toBe(1);
      expect(shards.map((s) => s!.index).sort(), gid).toEqual(Array.from({ length: total }, (_, i) => i + 1));
      for (const p of parts) expect(p.size, p.id).toBeLessThan(2 ** 31);
      const g = groupModels(parts.map((p) => ({ id: p.file, size: p.size })));
      expect(g.length).toBe(1);
      expect(g[0].complete).toBe(true);
    }
  });

  it('tek dosyalı modellerin Hugging Face adresi var (2 GB üstü olanlar yüklenirken bölünür)', () => {
    for (const p of packs.filter((x) => x.kind === 'model' && !x.group)) {
      // 4 GB üstü yalnızca Android'in yerel motoruyla açılır (WebView sınırı)
      if (!p.yalnizYerel) expect(p.size, p.id).toBeLessThan(4 * 2 ** 30);
      expect(p.urls.some((u) => u.startsWith('https://huggingface.co/')), p.id).toBe(true);
    }
  });

  it('yalnız yerel motorlu modeller yerel motoru olmayan cihazın kataloğunda görünmez', async () => {
    const { forThisDevice } = await import('../src/lib/manifest');
    const big = packs.filter((p) => p.yalnizYerel);
    expect(big.length).toBeGreaterThan(0);
    for (const p of big) expect(p.kind).toBe('model');
    const m = { ...(await import('../public/packs-manifest.json')).default } as any;
    expect(forThisDevice(m, false).packs.some((p: any) => p.yalnizYerel)).toBe(false);
    expect(forThisDevice(m, true).packs.length).toBe(m.packs.length);
  });

  it('ses paketlerinin içeriği eksiksiz bir Whisper paketi tanımlar', () => {
    const ses = packs.filter((p) => p.kind === 'ses');
    expect(ses.length).toBeGreaterThan(0);
    for (const p of ses) {
      expect(p.file.endsWith('.tar')).toBe(true);
      expect(p.contents?.length, p.id).toBeGreaterThan(0);
      const plan = planWhisperPack(p.contents!.map((c) => c.path));
      expect(plan.missing, p.id).toEqual([]);
      for (const c of p.contents!) expect(c.url).toMatch(/^https:\/\/huggingface\.co\/onnx-community\/whisper-[a-z]+\/resolve\/main\//);
      const sum = p.contents!.reduce((s, c) => s + c.size, 0);
      expect(p.size).toBeGreaterThanOrEqual(sum);
    }
  });

  it('group/contents alanları doğrulanır', () => {
    const base = packs.find((p) => p.kind === 'ses')!;
    const bad = validateManifest({
      version: 1,
      updated: 'x',
      packs: [
        { ...base, id: 'a', file: 'a.tar', contents: [{ path: '../x', url: 'https://x', size: 1 }] },
        { ...base, id: 'b', file: 'b.tar', group: 'Büyük Harf' },
        { ...base, id: 'c', file: 'c.tar' },
      ],
    });
    expect(bad.errors.length).toBe(2);
    expect(bad.manifest.packs.map((p) => p.id)).toEqual(['c']);
  });
});
