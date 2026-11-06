import { describe, expect, it } from 'vitest';
import { formatLines, inlineSpans } from '../src/lib/fener/format';

describe('Fener cevap biçimi', () => {
  it('kalın yazı', () => {
    expect(inlineSpans('1. **Panik yapma:** Derin nefes al.')).toEqual([
      { text: '1. ', bold: false },
      { text: 'Panik yapma:', bold: true },
      { text: ' Derin nefes al.', bold: false },
    ]);
  });
  it('kapanmamış işaret görünmez', () => {
    expect(inlineSpans('**Çök')).toEqual([{ text: 'Çök', bold: false }]);
    expect(inlineSpans('5 * 3 = 15')).toEqual([{ text: '5 * 3 = 15', bold: false }]);
  });
  it('başlık ve madde işaretleri', () => {
    const l = formatLines('## Ne yapmalı\n* Su için\n- Bekleyin');
    expect(l[0]).toEqual([{ text: 'Ne yapmalı', bold: true }]);
    expect(l[1][0].text).toBe('• Su için');
    expect(l[2][0].text).toBe('• Bekleyin');
  });
});

import { plainText } from '../src/lib/fener/format';
describe('sesli okuma metni', () => {
  it('işaretler atılır', () => {
    expect(plainText('## Başlık\n* **Çök** hemen')).toBe('Başlık\nÇök hemen');
  });
});

import { copyText } from '../src/lib/fener/format';
import { FALLBACK_LABELS } from '../src/lib/fener/fallback';
describe('"Kopyala" metni', () => {
  it('biçim işaretleri atılır, madde işaretleri kalır', () => {
    expect(copyText('## Başlık\n* **Çök** hemen\n- Kapan')).toBe('Başlık\n• Çök hemen\n• Kapan');
  });
  it('kaynaklar numaralarıyla sona eklenir', () => {
    const t = copyText('Bastırın [1]. Bakın [2].', [
      { n: 1, kind: 'rehber', title: 'Ciddi kanama' },
      { n: 2, kind: 'vikipedi', label: 'WikiMed', title: 'Bleeding' },
      { n: 3, kind: 'baglam', title: 'Kanama' },
    ]);
    expect(t).toBe('Bastırın [1]. Bakın [2].\n\nKaynaklar:\n[1] Rehber: Ciddi kanama\n[2] WikiMed: Bleeding\n[3] Bağlam: Kanama');
  });
  it('kaynak yoksa yalnız metin', () => {
    expect(copyText('  Merhaba  ')).toBe('Merhaba');
  });
});

describe('durdurulan cevabın etiketi', () => {
  it('"Model yüklü değil" denmez', () => {
    expect(FALLBACK_LABELS.stopped).toBe('Durduruldu — rehberden yanıt');
    expect(FALLBACK_LABELS.stopped).not.toBe(FALLBACK_LABELS['no-model']);
  });
});
