import { describe, it, expect } from 'vitest';
import { go, getState, setState } from '../src/lib/store';

describe('alt menü sekme dokunuşu', () => {
  it('başka sekmeden gelince iç ekran korunur', () => {
    setState({ tab: 'kutuphane', openArticlePath: 'A/Hipotermi' });
    go.tab('fener');
    go.home('kutuphane');
    expect(getState().tab).toBe('kutuphane');
    expect(getState().openArticlePath).toBe('A/Hipotermi');
  });
  it('açık sekmeye dokununca ana ekrana dönülür', () => {
    setState({ tab: 'rehber', openGuideId: 'deprem-aninda', openCategoryId: 'deprem' });
    const t = getState().homeTap;
    go.home('rehber');
    expect(getState().openGuideId).toBeNull();
    expect(getState().openCategoryId).toBeNull();
    expect(getState().homeTap).toBe(t + 1);
  });
});
