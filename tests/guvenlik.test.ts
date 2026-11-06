// Güvenlik denetimi (2026-11): güvenilmeyen girdilerin (ZIM makalesi, katalog, paket, kayıtlı
// durum, mesh komşusu) uygulamayı kandıramaması ve çökertememesi.
import { describe, expect, it } from 'vitest';
import bundled from '../public/packs-manifest.json';
import { safeUrl, keepClasses, ZIM_ID_PREFIX } from '../src/lib/sanitize';
import { IZINLI_ALANLAR, izinliAdres, onlyAllowedUrls, validateManifest, type ManifestPack } from '../src/lib/manifest';
import { downloadRequestFor, type RowModel } from '../src/lib/packs-ui';
import { restoreState } from '../src/lib/downloader';
import { openBlob, JSON_PACK_MAX, type InstalledPack } from '../src/lib/packs';
import { REHBER_FORMAT, validateRehberPack } from '../src/content/rehber-pack';
import { setLoadedPacks } from '../src/content/pack-guides';
import { getGuide, getAllGuides, guideToText } from '../src/lib/guides-search';
import { BoardCache, Outbox, loadProfile, memoryKV, KEYS } from '../src/iletisim/outbox';
import { MeshNode, MAX_KNOWN_PER_PEER } from '../src/lib/mesh/node';
import { readJsonCapped } from '../src/iletisim/client';
import { HttpRangeSource } from '../src/lib/source';

describe('ZIM temizleyicisi yardımcıları', () => {
  it('yalnız http(s)/göreli adresler; boşluk ve denetim karakteri hileleri yakalanır', () => {
    for (const ok of ['Kedi', '../A/Kedi', '#bolum', 'https://tr.wikipedia.org/', '//ornek.org/x', 'http://x/y']) expect(safeUrl(ok), ok).toBe(true);
    for (const bad of ['javascript:alert(1)', ' JaVaScRiPt:x', 'java\tscript:x', 'java\nscript:x', '\u0001javascript:x', 'vbscript:x', 'data:text/html,x', 'blob:https://x/y', 'file:///etc/passwd'])
      expect(safeUrl(bad), JSON.stringify(bad)).toBe(false);
  });
  it('sınıflardan yalnız mw-* ve noprint kalır (uygulama sınıfları makaleden verilemez)', () => {
    expect(keepClasses('ku cm-flash btn primary mw-editsection noprint mw-empty-elt')).toBe('mw-editsection noprint mw-empty-elt');
    expect(keepClasses('infobox')).toBe('');
    expect(ZIM_ID_PREFIX).toBe('zim-');
  });
});

describe('katalog: indirme adresleri ve özetler', () => {
  const m = validateManifest(bundled);

  it('uygulamayla gelen katalog geçerli; her adres https + izinli alan (ya da osm:)', () => {
    expect(m.ok).toBe(true);
    for (const p of m.manifest.packs) for (const u of p.urls) expect(u.startsWith('osm:') || izinliAdres(u), `${p.id}: ${u}`).toBe(true);
  });

  it('özetler 64 haneli küçük onaltılık; doldurulan özet sayısı geriye gitmez', () => {
    const withHash = m.manifest.packs.filter((p) => p.sha256);
    for (const p of withHash) expect(p.sha256).toMatch(/^[0-9a-f]{64}$/);
    // Denetim 2026-11: Hugging Face LFS özetleriyle 9 → 32 pakete çıkarıldı
    expect(withHash.length).toBeGreaterThanOrEqual(32);
  });

  it('izinli alan denetimi: http, başka alan, benzer ad ve kullanıcı adı hilesi reddedilir', () => {
    expect(IZINLI_ALANLAR).toContain('huggingface.co');
    for (const ok of [
      'https://huggingface.co/x',
      'https://cdn-lfs.hf.co/x',
      'https://download.kiwix.org/zim/x.zim',
      'https://mirror.download.kiwix.org/zim/x.zim',
      'https://objects.githubusercontent.com/x',
    ])
      expect(izinliAdres(ok), ok).toBe(true);
    for (const bad of [
      'http://huggingface.co/x',
      'https://huggingface.co.example/x',
      'https://evilhuggingface.co/x',
      'https://huggingface.co@example.com/x',
      'https://example.com/huggingface.co',
      'ftp://download.kiwix.org/x',
      './data/x.zim',
      'javascript:alert(1)',
    ])
      expect(izinliAdres(bad), bad).toBe(false);
  });

  it('internetten gelen katalogda izinsiz adresler atılır, adresi kalmayan paket düşer', () => {
    const base = m.manifest.packs[0];
    const r = onlyAllowedUrls({
      version: 9,
      updated: '2099-01-01',
      packs: [
        { ...base, id: 'a', urls: ['http://192.168.1.5/x.zim', 'https://huggingface.co/x.zim'] },
        { ...base, id: 'b', urls: ['https://example.com/x.zim'] },
        { ...base, id: 'c', urls: ['osm:turkiye'] },
      ],
    });
    expect(r.packs.map((p) => p.id)).toEqual(['a', 'c']);
    expect(r.packs[0].urls).toEqual(['https://huggingface.co/x.zim']);
  });
});

describe('indirme isteği: katalog özeti yalnız aynı sürüme uygulanır', () => {
  const entry = {
    id: 'w',
    kind: 'zim',
    name: 'W',
    desc: '',
    file: 'w_2026-09.zim',
    size: 1000,
    sha256: 'a'.repeat(64),
    tier: 'temel',
    urls: ['https://huggingface.co/w_2026-09.zim'],
    license: 'x',
    source: 'x',
  } as ManifestPack;
  const row = (server?: Partial<InstalledPack>): RowModel => ({
    key: 'w',
    entry,
    kind: 'zim',
    name: 'W',
    desc: '',
    file: entry.file,
    size: entry.size,
    sizeApprox: false,
    server: server ? ({ id: entry.file, kind: 'zim', size: 1000, origin: 'server', url: './data/x.zim', ...server } as InstalledPack) : undefined,
  });

  it('katalogdan indirme: özet ve aynalar kullanılır', () => {
    const r = downloadRequestFor(row(), 'http://10.0.0.1:8080/');
    expect(r.sha256).toBe(entry.sha256);
    expect(r.urls).toEqual(entry.urls);
  });
  it('bilgi noktasında aynı sürüm: önce bilgi noktası, sonra aynalar; özet doğrulanır', () => {
    const r = downloadRequestFor(row({}), 'http://10.0.0.1:8080/');
    expect(r.urls).toEqual(['http://10.0.0.1:8080/data/x.zim', ...entry.urls]);
    expect(r.sha256).toBe(entry.sha256);
  });
  it('bilgi noktasında başka tarihli sürüm: katalog özeti ve aynaları karıştırılmaz', () => {
    const r = downloadRequestFor(row({ id: 'w_2025-12.zim', size: 900 }), 'http://10.0.0.1:8080/');
    expect(r.file).toBe('w_2025-12.zim');
    expect(r.sha256).toBeUndefined();
    expect(r.urls).toEqual(['http://10.0.0.1:8080/data/x.zim']);
  });
  it('aynı ad farklı boyut (aylık yenilenen harita): özet uygulanmaz', () => {
    const r = downloadRequestFor(row({ size: 1234 }), 'http://10.0.0.1:8080/');
    expect(r.sha256).toBeUndefined();
    expect(r.urls).toHaveLength(1);
  });
});

describe('kayıtlı indirme durumu (localStorage) doğrulanır', () => {
  it('bozuk alanlar temizlenir, tehlikeli adlar atılır', () => {
    expect(restoreState('x.zim', { status: 'downloading', received: '12', total: -5, mirror: 1.7, error: { a: 1 }, code: 'hash' })).toEqual({
      file: 'x.zim',
      status: 'paused',
      received: 0,
      total: 0,
      mirror: 1,
      code: 'hash',
    });
    expect(restoreState('x.zim', { status: 'error', error: 'kötü' })?.status).toBe('error');
    expect(restoreState('../x.zim', {})).toBeNull();
    expect(restoreState('a\\b.zim', {})).toBeNull();
    expect(restoreState('x.zim', null)).toBeNull();
    expect(restoreState('x.zim', 'metin')).toBeNull();
  });
});

describe('JSON paketleri (rehber, hava) bellek sınırı', () => {
  it('bildirilen boyut sınırı aşıyorsa hiç okunmaz', async () => {
    const p: InstalledPack = { id: 'dev.rehber.json', kind: 'rehber', size: JSON_PACK_MAX.rehber! + 1, origin: 'server', url: 'http://x/dev.rehber.json' };
    await expect(openBlob(p)).rejects.toThrow(/çok büyük/);
  });
  it('boyutunu gizleyen sunucu akışı sınırda kesilir', async () => {
    const real = globalThis.fetch;
    let sent = 0;
    globalThis.fetch = (async () =>
      new Response(
        new ReadableStream<Uint8Array>({
          pull(c) {
            sent += 1 << 20;
            c.enqueue(new Uint8Array(1 << 20));
          },
        }),
      )) as typeof fetch;
    try {
      const p: InstalledPack = { id: 'h.json', kind: 'hava', size: 10, origin: 'server', url: 'http://x/hava-x.json' };
      await expect(openBlob(p)).rejects.toThrow(/çok büyük/);
      expect(sent).toBeLessThan(JSON_PACK_MAX.hava! + 4 * (1 << 20));
    } finally {
      globalThis.fetch = real;
    }
  });
});

describe('rehber paketi kendini "incelendi" ilan edemez', () => {
  it('paketteki reviewed: true yok sayılır; uyarı ve asistan notu görünür', () => {
    const pack = validateRehberPack({
      format: REHBER_FORMAT,
      version: 1,
      pack: { id: 'sahte', name: 'Sahte paket', desc: '', version: 1 },
      categories: [{ id: 'sf-sahte', title: 'Sahte' }],
      guides: [
        {
          id: 'sf-sahte-1',
          category: 'sf-sahte',
          title: 'İncelenmiş görünen rehber',
          tag: 'X',
          summary: 'Özet',
          steps: ['Adım'],
          keywords: ['sahte'],
          sources: ['Yok'],
          reviewed: true,
        },
      ],
      art: {},
    }).pack!;
    setLoadedPacks([{ file: 'sahte.rehber.json', pack }]);
    try {
      const g = getGuide('sf-sahte-1')!;
      expect(g).toBeTruthy();
      expect(g.reviewed).toBe(false);
      expect(getAllGuides().find((x) => x.id === 'sf-sahte-1')!.reviewed).toBe(false);
      expect(guideToText(g)).toMatch(/henüz bir sağlık profesyoneli tarafından incelenmedi/);
    } finally {
      setLoadedPacks([]);
    }
  });
});

describe('İletişim: bozuk yerel kayıtlar ekranı çökertmez', () => {
  it('"null", dizi ve eksik alanlı kayıtlar güvenle okunur', () => {
    const kv = memoryKV();
    kv.setItem(KEYS.profile, 'null');
    kv.setItem(KEYS.cache, 'null');
    kv.setItem(KEYS.outbox, JSON.stringify([null, 5, { draft: { id: 'abcdef1' } }, { draft: { id: 'abcdef2', kind: 'mesaj', from: 'Ayşe', text: 'Merhaba' }, created: 'x' }]));
    expect(loadProfile(kv)).toEqual({ name: '', family: '', familyName: '', server: '' });
    expect(new BoardCache(kv).load()).toEqual({ items: [], since: 0, server: '' });
    const list = new Outbox(kv).list();
    expect(list.map((e) => e.draft.id)).toEqual(['abcdef2']);
    expect(Number.isFinite(list[0].created)).toBe(true);
    kv.setItem(KEYS.profile, '[1,2]');
    expect(loadProfile(kv).name).toBe('');
  });
});

describe('mesh: komşu bazlı bellek sınırı', () => {
  it('rastgele kimliklerle "have" yağdıran komşu belleği sınırsız büyütemez', () => {
    const node = new MeshNode({ nodeId: 'dugum-a1', name: 'A', transport: { send: () => true } });
    node.peerUp('kotu');
    for (let f = 0; f < 40; f++) {
      const ids = Array.from({ length: 400 }, (_, i) => `id${f.toString(36)}x${i.toString(36)}-yyyyyy`);
      node.receive('kotu', JSON.stringify({ t: 'have', ids }));
    }
    const known = (node as any).peers.get('kotu').known as Set<string>;
    expect(known.size).toBeLessThanOrEqual(MAX_KNOWN_PER_PEER);
    expect(node.stats.invalidFrames).toBe(0);
  });
});

describe('İletişim: bilgi noktası yanıtı boyut sınırı', () => {
  it('normal yanıt çözülür; sınırı aşan ya da JSON olmayan yanıt null', async () => {
    expect(await readJsonCapped(new Response('{"items":[1,2]}'))).toEqual({ items: [1, 2] });
    expect(await readJsonCapped(new Response('{bozuk'))).toBeNull();
    expect(await readJsonCapped(new Response('{"a":"' + 'x'.repeat(2000) + '"}'), 1000)).toBeNull();
    let sent = 0;
    const sonsuz = new Response(
      new ReadableStream<Uint8Array>({
        pull(c) {
          sent += 65536;
          c.enqueue(new Uint8Array(65536).fill(32));
        },
      }),
    );
    expect(await readJsonCapped(sonsuz, 1 << 20)).toBeNull();
    expect(sent).toBeLessThan(2 << 20);
  });
});

describe('HTTP aralıklı okuma yanıtları doğrulanır', () => {
  const withFetch = async (f: typeof fetch, run: () => Promise<void>) => {
    const real = globalThis.fetch;
    globalThis.fetch = f;
    try {
      await run();
    } finally {
      globalThis.fetch = real;
    }
  };
  it('başka aralık döndüren (206) ya da Range\'i yok sayıp dev dosya gönderen sunucu reddedilir', async () => {
    const src = HttpRangeSource.withSize('http://nokta/x.zim', 10e9, 'x.zim');
    await withFetch((async () => new Response(new Uint8Array(10), { status: 206, headers: { 'Content-Range': 'bytes 0-9/10000000000' } })) as typeof fetch, async () => {
      await expect(src.read(500, 10)).rejects.toThrow(/Beklenmeyen aralık/);
    });
    await withFetch((async () => new Response(new Uint8Array(4), { status: 200, headers: { 'Content-Length': String(10e9) } })) as typeof fetch, async () => {
      await expect(src.read(0, 10)).rejects.toThrow(/aralıklı okumayı desteklemiyor/);
    });
    await withFetch((async () => new Response(new Uint8Array([1, 2, 3, 4, 5]), { status: 206, headers: { 'Content-Range': 'bytes 2-4/10000000000' } })) as typeof fetch, async () => {
      expect([...(await src.read(2, 3))]).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
