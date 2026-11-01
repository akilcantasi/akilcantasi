import { describe, expect, it } from 'vitest';
import { searchGuides, verbStem } from '../src/lib/guides-search';

describe('çekimli fiille arama', () => {
  it('fiil ekleri atılır, kısa kök korunur', () => {
    expect(verbStem('aritilir')).toBe('arit');
    expect(verbStem('kaynatabilirim')).toBe('kaynat');
    expect(verbStem('ister')).toBeNull();
  });
  it.each([
    ['Su nasıl arıtılır?', 'su-aritma'],
    ['suyu nasıl arıtırım', 'su-aritma'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
