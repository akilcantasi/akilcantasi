import { describe, expect, it } from 'vitest';
import { decideProblem, looksLikeCaptiveWindow } from '../src/lib/storage-check';

const IOS_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const IOS_CNA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const IOS_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0 Mobile/15E148 Safari/604.1';
const ANDROID_CHROME = 'Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36';
const ANDROID_WV = 'Mozilla/5.0 (Linux; Android 14; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0 Mobile Safari/537.36';

describe('depolama denetimi', () => {
  it('giriş penceresi kullanıcı aracısından tanınır', () => {
    expect(looksLikeCaptiveWindow(IOS_CNA)).toBe(true);
    expect(looksLikeCaptiveWindow(IOS_SAFARI)).toBe(false);
    expect(looksLikeCaptiveWindow(IOS_CHROME)).toBe(false);
    expect(looksLikeCaptiveWindow(ANDROID_CHROME)).toBe(false);
    expect(looksLikeCaptiveWindow(ANDROID_WV)).toBe(true);
  });
  it('sorun türü', () => {
    const base = { local: true, opfs: true, opfsApi: true, captiveUa: false, native: false };
    expect(decideProblem(base)).toBeNull();
    expect(decideProblem({ ...base, opfs: false })).toBe('private');
    expect(decideProblem({ ...base, opfs: false, opfsApi: false })).toBeNull();
    expect(decideProblem({ ...base, local: false })).toBe('blocked');
    expect(decideProblem({ ...base, captiveUa: true })).toBe('captive');
    expect(decideProblem({ ...base, captiveUa: true, native: true })).toBeNull();
  });
});
