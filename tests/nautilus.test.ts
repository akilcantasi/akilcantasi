import { describe, expect, it } from 'vitest';
import { parseNautilusDb, pyLiteralToJson } from '../src/lib/zim/nautilus';

const SAMPLE = `var DATABASE = [
{'_id': '00000', 'ti': 'Distillation For Home Water Treatment', 'dsc': 'For people with a water quality problem ', 'aut': 'Michigan State University', 'fp': ['Water (1).pdf']},
{'_id': '00001', 'ti': "Children's Guide", 'dsc': 'It\\'s safe', 'aut': ['A', 'B'], 'fp': ['Water (2).pdf', 'files/Water (2b).pdf'], 'x': True, 'y': None},
{'_id': '00002', 'dsc': 'başlıksız', 'fp': ['adsiz.pdf']},
];`;

describe('nautilus kitaplığı', () => {
  it('Python yazımını JSON yapar', () => {
    expect(JSON.parse(pyLiteralToJson("{'a': 'b\\'c', 'd': True, 'e': None, 'f': [1,],}"))).toEqual({ a: "b'c", d: true, e: null, f: [1] });
  });
  it('database.js okunur', () => {
    const b = parseNautilusDb(SAMPLE);
    expect(b).toHaveLength(3);
    expect(b[0]).toEqual({ id: '00000', title: 'Distillation For Home Water Treatment', description: 'For people with a water quality problem', author: 'Michigan State University', files: ['files/Water (1).pdf'] });
    expect(b[1].title).toBe("Children's Guide");
    expect(b[1].description).toBe("It's safe");
    expect(b[1].author).toBe('A, B');
    expect(b[1].files).toEqual(['files/Water (2).pdf', 'files/Water (2b).pdf']);
    expect(b[2].title).toBe('adsiz.pdf');
  });
  it('bozuk içerikte boş liste', () => {
    expect(parseNautilusDb('var x = 5;')).toEqual([]);
    expect(parseNautilusDb('var DATABASE = [ {bozuk ]')).toEqual([]);
  });
});
