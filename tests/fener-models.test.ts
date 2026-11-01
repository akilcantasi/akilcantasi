import { describe, expect, it } from 'vitest';
import {
  chooseModel,
  fitFor,
  groupModels,
  isAuxGguf,
  isOversizeSingle,
  memoryBudget,
  parseShard,
  promptProfile,
  quantOf,
} from '../src/lib/fener/models';
import { assemblePrompt, cleanAnswer, contextBudget, stripThinking, SYSTEM_PROMPT, SYSTEM_PROMPT_FREE, SYSTEM_PROMPT_RICH, SYSTEM_PROMPT_FREE_RICH, type Retrieval } from '../src/lib/fener/rag';
import { budgetFor } from '../src/tabs/FenerTab';

const MB = 1e6;
const GB = 1e9;

describe('bölünmüş GGUF gruplama', () => {
  it('parça adlarını çözer', () => {
    expect(parseShard('Qwen3.5-4B-Q4_K_M-00001-of-00002.gguf')).toEqual({ base: 'Qwen3.5-4B-Q4_K_M', index: 1, total: 2 });
    expect(parseShard('model-00003-of-00003.GGUF')).toEqual({ base: 'model', index: 3, total: 3 });
    expect(parseShard('model-00004-of-00003.gguf')).toBeNull();
    expect(parseShard('model-1-of-3.gguf')).toBeNull();
    expect(parseShard('qwen2.5-0.5b-instruct-q4_k_m.gguf')).toBeNull();
  });

  it('parçaları tek modelde toplar, sıralar ve eksikleri bulur', () => {
    const groups = groupModels([
      { id: 'big-q4_k_m-00002-of-00003.gguf', size: 900 * MB },
      { id: 'big-q4_k_m-00001-of-00003.gguf', size: 1000 * MB },
      { id: 'big-q4_k_m-00003-of-00003.gguf', size: 300 * MB },
      { id: 'half-00001-of-00002.gguf', size: 1000 * MB },
      { id: 'small-0.5b.gguf', size: 400 * MB },
    ]);
    const big = groups.find((g) => g.id === 'big-q4_k_m.gguf')!;
    expect(big.split).toBe(true);
    expect(big.complete).toBe(true);
    expect(big.size).toBe(2200 * MB);
    expect(big.parts.map((p) => p.id)).toEqual([
      'big-q4_k_m-00001-of-00003.gguf',
      'big-q4_k_m-00002-of-00003.gguf',
      'big-q4_k_m-00003-of-00003.gguf',
    ]);
    expect(big.quant).toBe('Q4_K_M');
    const half = groups.find((g) => g.id === 'half.gguf')!;
    expect(half.complete).toBe(false);
    expect(half.missing).toEqual([2]);
    // Boyuta göre sıralı
    expect(groups.map((g) => g.id)).toEqual(['small-0.5b.gguf', 'half.gguf', 'big-q4_k_m.gguf']);
  });

  it('mmproj / MTP / imatrix dosyalarını model saymaz', () => {
    expect(isAuxGguf('mmproj-F16.gguf')).toBe(true);
    expect(isAuxGguf('gemma-4-E2B-it-mmproj-bf16.gguf')).toBe(true);
    expect(isAuxGguf('mtp-gemma-4-E2B-it.gguf')).toBe(true);
    expect(isAuxGguf('Qwen3.5-2B-Q4_K_M.gguf')).toBe(false);
    const groups = groupModels([
      { id: 'mmproj-F16.gguf', size: 600 * MB },
      { id: 'Qwen3.5-2B-Q4_K_M.gguf', size: 1280835840 },
      { id: 'notlar.json', size: 10 },
    ]);
    expect(groups.map((g) => g.id)).toEqual(['Qwen3.5-2B-Q4_K_M.gguf']);
  });

  it('nicemleme adını okur', () => {
    expect(quantOf('qwen2.5-0.5b-instruct-q4_k_m.gguf')).toBe('Q4_K_M');
    expect(quantOf('gemma-4-E2B-it-Q8_0.gguf')).toBe('Q8_0');
    expect(quantOf('x-IQ4_XS.gguf')).toBe('IQ4_XS');
    expect(quantOf('model.gguf')).toBeNull();
  });
});

describe('cihaza göre model seçimi', () => {
  // Katalogdaki gerçek boyutlar
  const catalog = groupModels([
    { id: 'qwen2.5-0.5b-instruct-q4_k_m.gguf', size: 491400032 },
    { id: 'Qwen3.5-0.8B-Q4_K_M.gguf', size: 532517120 },
    { id: 'Qwen3.5-2B-Q4_K_M.gguf', size: 1280835840 },
    { id: 'Qwen3.5-4B-Q4_K_M-00001-of-00002.gguf', size: 1400e6 },
    { id: 'Qwen3.5-4B-Q4_K_M-00002-of-00002.gguf', size: 1340937888 },
  ]);

  it('telefon ve masaüstü için beklenen modeller', () => {
    expect(chooseModel(catalog, { memGB: 2, cores: 8 })!.id).toBe('Qwen3.5-0.8B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: 3, cores: 8 })!.id).toBe('Qwen3.5-0.8B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: 4, cores: 8 })!.id).toBe('Qwen3.5-2B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: 6, cores: 8 })!.id).toBe('Qwen3.5-2B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: 8, cores: 8 })!.id).toBe('Qwen3.5-4B-Q4_K_M.gguf');
  });

  it('az çekirdekte büyük modeli seçmez', () => {
    expect(chooseModel(catalog, { memGB: 8, cores: 4 })!.id).toBe('Qwen3.5-2B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: 8, cores: 2 })!.id).toBe('Qwen3.5-0.8B-Q4_K_M.gguf');
  });

  it('bellek bilinmiyorsa çekirdek sayısından temkinli tahmin', () => {
    expect(chooseModel(catalog, { memGB: null, cores: 4 })!.id).toBe('Qwen3.5-0.8B-Q4_K_M.gguf');
    expect(chooseModel(catalog, { memGB: null, cores: 8 })!.id).toBe('Qwen3.5-4B-Q4_K_M.gguf');
  });

  it('eksik parçalı modeli seçmez, elle seçilse bile', () => {
    const partial = groupModels([
      { id: 'Qwen3.5-2B-Q4_K_M.gguf', size: 1280835840 },
      { id: 'Qwen3.5-4B-Q4_K_M-00001-of-00002.gguf', size: 1400e6 },
    ]);
    expect(chooseModel(partial, { memGB: 8, cores: 8 })!.id).toBe('Qwen3.5-2B-Q4_K_M.gguf');
    expect(chooseModel(partial, { memGB: 8, cores: 8 }, 'Qwen3.5-4B-Q4_K_M.gguf')!.id).toBe('Qwen3.5-2B-Q4_K_M.gguf');
    expect(fitFor(partial[1], { memGB: 8, cores: 8 })).toBe('incomplete');
  });

  it('2 GB üstü bölünmemiş dosya da kullanılabilir (yüklerken sanal bölünür)', () => {
    const groups = groupModels([
      { id: 'Qwen3.5-2B-Q4_K_M.gguf', size: 1280835840 },
      { id: 'Qwen3.5-4B-Q4_K_M.gguf', size: 2740937888 },
    ]);
    expect(isOversizeSingle(groups[1])).toBe(true);
    expect(fitFor(groups[1], { memGB: 32, cores: 32 })).toBe('ok');
    expect(chooseModel(groups, { memGB: 32, cores: 32 })!.id).toBe('Qwen3.5-4B-Q4_K_M.gguf');
    expect(chooseModel(groups, { memGB: 8, cores: 8 }, 'Qwen3.5-4B-Q4_K_M.gguf')!.id).toBe('Qwen3.5-4B-Q4_K_M.gguf');
  });

  it('bellek bütçesi', () => {
    expect(memoryBudget({ memGB: 4, cores: 8 })).toBeCloseTo(2 * GB);
    expect(memoryBudget({ memGB: 8, cores: 8 })).toBeCloseTo(4.4 * GB);
  });
});

describe('model boyutuna göre istem', () => {
  const r: Retrieval = {
    query: 'Kanama nasıl durdurulur?',
    guides: [{ guide: { id: 'kanama', title: 'Kanama', summary: 'Bastırın.', steps: ['Temiz bezle bastırın'] }, score: 30 }],
    articles: [],
    critical: true,
    topGuideId: 'kanama',
  };

  it('0,5B davranışı değişmez', () => {
    const p = promptProfile(0.5);
    expect(p).toMatchObject({ size: 'small', nCtx: 2048, maxTokens: 384, historyChars: 600, rich: false });
    expect(budgetFor(p)).toBe(contextBudget());
    const b = assemblePrompt(r, { rich: p.rich });
    expect(b.messages[0].content).toBe(SYSTEM_PROMPT);
    expect(assemblePrompt(r, { rich: false, free: true }).messages[0].content).toBe(SYSTEM_PROMPT_FREE);
  });

  it('büyük modelde daha uzun bağlam ve zengin istem', () => {
    const m = promptProfile(2);
    const l = promptProfile(4);
    expect(m.size).toBe('medium');
    expect(l.size).toBe('large');
    expect(m.nCtx).toBe(4096);
    expect(l.maxTokens).toBeGreaterThan(m.maxTokens);
    expect(budgetFor(m)).toBeGreaterThan(budgetFor(promptProfile(0.5)));
    expect(budgetFor(m)).toBeLessThanOrEqual(m.maxContextChars);
    expect(budgetFor(m, 4)).toBe(Math.floor(budgetFor(m) / 4));
    const b = assemblePrompt(r, { rich: true, maxContextChars: budgetFor(m) });
    expect(b.messages[0].content).toBe(SYSTEM_PROMPT_RICH);
    expect(SYSTEM_PROMPT_RICH).toContain('112');
    expect(SYSTEM_PROMPT_RICH).toContain('[1]');
    expect(assemblePrompt(r, { rich: true, free: true }).messages[0].content).toBe(SYSTEM_PROMPT_FREE_RICH);
  });
});

describe('düşünme bölümü temizliği', () => {
  it('<think> bloklarını ve Gemma düşünce kanalını atar', () => {
    expect(stripThinking('<think>\nhmm\n</think>\n\nBaskı uygulayın.')).toBe('Baskı uygulayın.');
    expect(stripThinking('<|channel>thought\nx<channel|>Cevap')).toBe('Cevap');
    expect(stripThinking('</think>\nCevap')).toBe('Cevap');
  });
  it('akışta kapanmamış düşünmeyi gizler', () => {
    expect(stripThinking('<think>\nadım adım düşün')).toBe('');
  });
  it('cleanAnswer ikisini birlikte uygular', () => {
    expect(cleanAnswer('<think></think>\nKAYNAKLAR:\nSORU: x\nBastırın [1].')).toBe('Bastırın [1].');
  });
});
