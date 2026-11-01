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
