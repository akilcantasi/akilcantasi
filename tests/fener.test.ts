import { describe, expect, it } from 'vitest';
import {
  assemblePrompt,
  buildPrompt,
  clip,
  contextBudget,
  matchesEmergency,
  retrieve,
  searchQuery,
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_FREE,
  isRelevantGuide,
  type GuideLike,
  type RagDeps,
} from '../src/lib/fener/rag';
import { fallbackAnswer, FALLBACK_LABELS } from '../src/lib/fener/fallback';
import { chooseModel, describeError, estimateParamsB, groupModels, prettyModelName, threadCount } from '../src/lib/fener/engine';
import { searchGuides, guideToText } from '../src/lib/guides-search';

const G = (id: string, extra: Partial<GuideLike> = {}): GuideLike => ({
  id,
  title: 'Rehber ' + id,
  tag: 'TEST',
  summary: 'Özet ' + id,
  steps: ['Birinci adım ' + id, 'İkinci adım', 'Üçüncü adım', 'Dördüncü adım', 'Beşinci adım'],
  keywords: [],
  sources: ['AFAD'],
  ...extra,
});

function fakeDeps(opts: {
  guides?: { guide: GuideLike; score: number }[];
  articles?: { title: string; path: string; text: string }[];
  failLibrary?: boolean;
}): RagDeps {
  return {
    searchGuides: (_q, limit) => (opts.guides ?? []).slice(0, limit),
    guideToText: (g) => `${g.title}\n${g.summary}\n` + (g.steps ?? []).map((s, i) => `${i + 1}. ${s}`).join('\n'),
    searchLibraryForContext: async () => {
      if (opts.failLibrary) throw new Error('zim yok');
      return opts.articles ?? [];
    },
  };
}

describe('rag: istem kurulumu', () => {
  it('kaynakları numaralar ve KAYNAKLAR bloğuna koyar', async () => {
    const deps = fakeDeps({
      guides: [
        { guide: G('su-aritma'), score: 12 },
        { guide: G('gida'), score: 9 },
      ],
      articles: [{ title: 'Su arıtımı', path: 'A/Su_arıtımı', text: 'Su arıtımı, suyun içilebilir hale getirilmesidir.' }],
    });
    const p = await buildPrompt('Suyu nasıl içilebilir yaparım?', { deps });
    expect(p.sources.map((s) => [s.n, s.kind])).toEqual([
      [1, 'rehber'],
      [2, 'rehber'],
      [3, 'vikipedi'],
    ]);
    expect(p.sources[0].id).toBe('su-aritma');
    expect(p.sources[2].path).toBe('A/Su_arıtımı');
    expect(p.messages[0]).toEqual({ role: 'system', content: SYSTEM_PROMPT });
    const user = p.messages[p.messages.length - 1];
    expect(user.role).toBe('user');
    expect(user.content).toContain('KAYNAKLAR:');
    expect(user.content).toContain('[1] Rehber: Rehber su-aritma');
    expect(user.content).toContain('[3] Vikipedi: Su arıtımı');
    expect(user.content).toMatch(/SORU: Suyu nasıl içilebilir yaparım\?$/);
    expect(p.topGuideId).toBe('su-aritma');
    expect(p.critical).toBe(false);
  });

  it('sistem istemi Fener kurallarını içerir', () => {
    expect(SYSTEM_PROMPT).toContain("Sen Fener'sin");
    expect(SYSTEM_PROMPT).toContain("KAYNAKLAR'a dayan");
    expect(SYSTEM_PROMPT).toContain('kendi genel bilginle');
    expect(SYSTEM_PROMPT).toContain('Tıbbi doz/ilaç önerme');
    expect(SYSTEM_PROMPT).toContain('112');
  });

  it('kritik durumu ilk rehberden ya da anahtar sözcükten algılar', async () => {
    const crit = await retrieve('başım ağrıyor', {
      deps: fakeDeps({ guides: [{ guide: G('kanama', { critical: true }), score: 9 }] }),
    });
    expect(crit.critical).toBe(true);

    const weak = await retrieve('çadır nasıl kurulur', {
      deps: fakeDeps({
        guides: [
          { guide: G('cadir'), score: 10 },
          { guide: G('yanik', { critical: true }), score: 1 },
        ],
      }),
    });
    expect(weak.critical).toBe(false);
    expect(weak.guides.map((h) => h.guide.id)).toEqual(['cadir']); // zayıf eşleşme elendi

    for (const q of [
      'Annem nefes almıyor',
      'BİLİNCİ kapalı ne yapayım',
      'çok kötü kanıyor',
      'çocuk suda boğuluyor',
      'kalp krizi geçiriyor',
      'zehirlendi galiba',
      'elim yandı, yanık var',
      'enkaz altında kaldım',
    ]) {
      expect(matchesEmergency(q), q).toBe(true);
    }
    expect(matchesEmergency('suyu nasıl arıtırım')).toBe(false);
    expect(matchesEmergency('toplanma alanı nerede')).toBe(false);
  });

  it('bağlamı bütçeye göre keser', async () => {
    const long = 'Bu çok uzun bir paragraftır. '.repeat(400);
    const deps = fakeDeps({
      guides: [
        { guide: G('a', { summary: long }), score: 12 },
        { guide: G('b', { summary: long }), score: 10 },
      ],
      articles: [{ title: 'Uzun', path: 'A/Uzun', text: long }],
    });
    const p = await buildPrompt('soru', { deps, maxContextChars: 1500 });
    expect(p.contextChars).toBeLessThanOrEqual(1500);
    expect(p.sources.length).toBe(3);
    const user = p.messages[p.messages.length - 1].content;
    expect(user.length).toBeLessThan(1500 + 200);
    // Varsayılan bütçe n_ctx=2048'e sığmalı (~2,6 karakter/token)
    const b = contextBudget(2048, 384, 600);
    expect(b).toBeGreaterThan(1500);
    expect(b / 2.6 + 384 + 260 + 600 / 2.6).toBeLessThan(2048);
  });

  it('pendingQuestion bağlamını ilk kaynak olarak ekler', async () => {
    const deps = fakeDeps({ guides: [{ guide: G('toplanma-alani'), score: 9 }] });
    const p = await buildPrompt('Buraya nasıl giderim?', {
      deps,
      context: { title: 'Örnek Toplanma Alanı', text: 'Merkez parkında, 2000 kişilik toplanma alanı.', source: 'harita' },
    });
    expect(p.sources[0]).toMatchObject({ n: 1, kind: 'baglam', title: 'Örnek Toplanma Alanı' });
    expect(p.messages.at(-1)!.content).toContain('[1] Bağlam: Örnek Toplanma Alanı');
    expect(p.messages.at(-1)!.content).toContain('Merkez parkında');
  });

  it('geçmişi kısaltarak ekler ve kütüphane hatasında çökmez', async () => {
    const deps = fakeDeps({ guides: [{ guide: G('x'), score: 9 }], failLibrary: true });
    const r = await retrieve('ikinci soru', { deps });
    expect(r.articles).toEqual([]);
    const p = assemblePrompt(r, {
      history: [
        { role: 'assistant', content: 'yetim asistan' },
        { role: 'user', content: 'ilk soru' },
        { role: 'assistant', content: 'ilk cevap '.repeat(100) },
      ],
    });
    expect(p.messages.map((m) => m.role)).toEqual(['system', 'user', 'assistant', 'user']);
    expect(p.messages[2].content.length).toBeLessThanOrEqual(300);
  });

  it('kaynak bulunamazsa model kendi bilgisiyle cevaplar (serbest mod)', async () => {
    const p = await buildPrompt('xyzzy', { deps: fakeDeps({}) });
    expect(p.sources).toEqual([]);
    expect(p.free).toBe(true);
    expect(p.messages[0]).toEqual({ role: 'system', content: SYSTEM_PROMPT_FREE });
    expect(p.messages.at(-1)!.content).toBe('xyzzy');
  });

  it('istenirse kaynak olsa bile serbest modda kurar', async () => {
    const r = await retrieve('su', { deps: fakeDeps({ guides: [{ guide: G('su-aritma'), score: 12 }] }) });
    const p = assemblePrompt(r, { free: true });
    expect(p.free).toBe(true);
    expect(p.sources).toEqual([]);
    expect(p.messages.at(-1)!.content).not.toContain('KAYNAKLAR');
  });

  it('zayıf ya da sorgunun yarısından azına değen rehberleri kaynak saymaz', () => {
    expect(isRelevantGuide({ guide: G('a'), score: 25, coverage: 0.3 })).toBe(true);
    expect(isRelevantGuide({ guide: G('a'), score: 10, coverage: 0.5 })).toBe(true);
    expect(isRelevantGuide({ guide: G('a'), score: 10, coverage: 0.34 })).toBe(false);
    expect(isRelevantGuide({ guide: G('a'), score: 6, coverage: 1 })).toBe(false);
  });

  it('gerçek rehberlerle: "ormanda kayboldum" yangın rehberine gitmez', async () => {
    const deps: RagDeps = { searchGuides, guideToText, searchLibraryForContext: async () => [] };
    const r = await retrieve('ormanda kayboldum ne yapmalıyım', { deps });
    expect(r.topGuideId).toBe('doga-kaybolma');
    expect(r.guides.map((h) => h.guide.id)).not.toContain('yangin');
    expect(r.guides.map((h) => h.guide.id)).not.toContain('orman-yangini');
    const none = await retrieve('bugün hava nasıl olacak', { deps });
    expect(none.guides).toEqual([]);
    const fire = await retrieve('orman yanıyor ne yapayım', { deps });
    expect(fire.topGuideId).toBe('orman-yangini');
  });

  it('clip sınırı aşmaz', () => {
    const s = 'Bir cümle. İkinci cümle burada. Üçüncü cümle de var.';
    expect(clip(s, 20).length).toBeLessThanOrEqual(20);
    expect(clip(s, 1000)).toBe(s);
  });
});

describe('fallback: modelsiz yanıt', () => {
  it('en uygun rehberin özetini ve ilk adımlarını verir', async () => {
    const r = await retrieve('kanama', {
      deps: fakeDeps({
        guides: [
          { guide: G('kanama', { critical: true, dont: ['Turnike gevşetmeyin'] }), score: 12 },
          { guide: G('burun'), score: 9 },
        ],
        articles: [{ title: 'Kanama', path: 'A/Kanama', text: 'Kanama, kan kaybıdır.' }],
      }),
    });
    const a = fallbackAnswer(r, 'no-model');
    expect(a.label).toBe('Model yüklü değil — rehberden yanıt');
    expect(a.text).toContain('Özet kanama');
    expect(a.text).toContain('İlk adımlar:');
    expect(a.text).toContain('1. Birinci adım kanama');
    expect(a.text).toContain('4. Dördüncü adım');
    expect(a.text).not.toContain('5. Beşinci adım');
    expect(a.text).toContain('Yapmayın:');
    expect(a.text).toContain("Vikipedi'den — Kanama");
    expect(a.critical).toBe(true);
    expect(a.topGuideId).toBe('kanama');
    expect(a.sources.map((s) => s.kind)).toEqual(['rehber', 'rehber', 'vikipedi']);
    expect(a.empty).toBe(false);
  });

  it('eşleşme yoksa yönlendirir ve 112 der', async () => {
    const r = await retrieve('qwerty', { deps: fakeDeps({}) });
    const a = fallbackAnswer(r, 'battery');
    expect(a.label).toBe(FALLBACK_LABELS.battery);
    expect(a.empty).toBe(true);
    expect(a.text).toContain('112');
  });

  it('gerçek rehberlerle "kanama" sorusuna rehber cevabı verir', async () => {
    const deps: RagDeps = { searchGuides, guideToText: guideToText as any, searchLibraryForContext: async () => [] };
    const r = await retrieve('Kanaması olan birine nasıl ilk yardım yaparım?', { deps });
    expect(r.topGuideId).toBe('kanama');
    expect(r.critical).toBe(true);
    const a = fallbackAnswer(r);
    expect(a.text).toContain('İlk adımlar:');
    expect(a.sources[0]).toMatchObject({ kind: 'rehber', id: 'kanama' });
  });
});

describe('engine: model seçimi', () => {
  const g = (packs: { id: string; size: number }[]) => groupModels(packs);
  const packs = [
    { id: 'gemma-3-270m-it-q8_0.gguf', size: 290e6 },
    { id: 'qwen2.5-1.5b-instruct-q4_k_m.gguf', size: 1.1e9 },
    { id: 'gemma-3-4b-it-q4_k_m.gguf', size: 2.0e9 },
  ];

  it('parametre sayısını addan ya da boyuttan tahmin eder', () => {
    expect(estimateParamsB({ id: 'qwen2.5-1.5b-instruct-q4_k_m.gguf', size: 0 })).toBeCloseTo(1.5);
    expect(estimateParamsB({ id: 'gemma-3-270m-it.gguf', size: 0 })).toBeCloseTo(0.27);
    expect(estimateParamsB({ id: 'Llama-3.2-1B-Instruct.gguf', size: 0 })).toBeCloseTo(1);
    expect(estimateParamsB({ id: 'model.gguf', size: 1.2e9 })).toBeCloseTo(2);
    expect(estimateParamsB({ id: 'gemma-4-E2B-it-Q4_K_M.gguf', size: 0 })).toBeCloseTo(2);
    expect(estimateParamsB({ id: 'Qwen3.5-4B-Q4_K_M.gguf', size: 0 })).toBeCloseTo(4);
  });

  it('cihaz belleğine sığan en büyük modeli seçer', () => {
    expect(chooseModel(g(packs), { memGB: 2, cores: 8 })!.id).toBe('gemma-3-270m-it-q8_0.gguf');
    expect(chooseModel(g(packs), { memGB: 4, cores: 8 })!.id).toBe('qwen2.5-1.5b-instruct-q4_k_m.gguf');
    expect(chooseModel(g(packs), { memGB: 8, cores: 8 })!.id).toBe('gemma-3-4b-it-q4_k_m.gguf');
    // Hiçbiri sığmazsa en küçüğü
    expect(chooseModel(g([packs[2]]), { memGB: 2, cores: 8 })!.id).toBe('gemma-3-4b-it-q4_k_m.gguf');
    expect(chooseModel([], { memGB: 8, cores: 8 })).toBeNull();
  });

  it('elle seçilen modeli önceler', () => {
    expect(chooseModel(g(packs), { memGB: 2, cores: 2 }, 'gemma-3-4b-it-q4_k_m.gguf')!.id).toBe('gemma-3-4b-it-q4_k_m.gguf');
    expect(chooseModel(g(packs), { memGB: 2, cores: 2 }, 'yok.gguf')!.id).toBe('gemma-3-270m-it-q8_0.gguf');
  });

  it('iş parçacığı sayısı', () => {
    expect(threadCount(true, 8)).toBe(4);
    expect(threadCount(true, 2)).toBe(2);
    expect(threadCount(false, 8)).toBe(1);
  });

  it('yardımcılar', () => {
    expect(prettyModelName('qwen-00001-of-00003.gguf')).toBe('qwen');
    expect(describeError(Object.assign(new Error('x'), { type: 'load_error' }))).toContain('Model dosyası açılamadı');
    expect(describeError(new Error('Cannot allocate WebAssembly.Memory'))).toContain('belleği');
  });
});

import { cleanAnswer } from '../src/lib/fener/rag';
describe('cleanAnswer', () => {
  it('istem iskeletini baştan atar', () => {
    const t = 'KAYNAKLAR:\n[1] Rehber: Deprem anında: Çök, Kapan, Tutun\nDeprem anında: Çök, Kapan, Tutun [DEPREM]\nSarsıntıda yerinde kal.';
    expect(cleanAnswer(t)).toBe('Deprem anında: Çök, Kapan, Tutun\nSarsıntıda yerinde kal.');
  });
  it('normal cevaba dokunmaz', () => {
    const t = "112'yi arayın.\n\n1. Yarayı bastırın [1].";
    expect(cleanAnswer(t)).toBe(t);
  });
  it('SORU satırını atar', () => {
    expect(cleanAnswer('SORU: kanama?\nBaskı uygulayın.')).toBe('Baskı uygulayın.');
  });
});

describe('rag: soru kalıbı sözcükleri aramadan çıkarılır (QA)', () => {
  it('searchQuery dolguyu atar, hepsi dolguysa soruyu korur', () => {
    expect(searchQuery('"Hipotermi" hakkında kısaca bilgi verir misin?')).toBe('"Hipotermi"');
    expect(searchQuery('Kanama nasıl durdurulur?')).toBe('Kanama nasıl durdurulur?');
    expect(searchQuery('bilgi verir misin?')).toBe('bilgi verir misin?');
  });
  it('Kütüphane "Fener\'e sor": ilgisiz "Çocukla afet hakkında konuşmak" değil, konunun rehberi gelir', async () => {
    const deps: RagDeps = { searchGuides, guideToText, searchLibraryForContext: async () => [] };
    const r = await retrieve('"Hipotermi" hakkında kısaca bilgi verir misin?', {
      deps,
      context: { title: 'Hipotermi', text: 'Hipotermi vücut ısısının düşmesidir.', source: 'Vikipedi: Hipotermi' },
    });
    expect(r.guides[0]?.guide.title).toMatch(/Hipotermi/);
    expect(r.guides.some((h) => /Çocukla afet/.test(h.guide.title))).toBe(false);
  });
});
