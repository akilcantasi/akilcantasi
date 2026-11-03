import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { MESAJLAR, YANITLAR } from '../src/lib/enkaz/mesajlar';

const java = readFileSync('android/app/src/main/java/org/akilcantasi/app/Mesajlar.java', 'utf8');
const dizi = (ad: string) => {
  const m = java.match(new RegExp(`${ad}\\s*=\\s*\\{([\\s\\S]*?)\\};`));
  return [...(m?.[1] ?? '').matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
};

describe('hazır mesajlar Java ile aynı', () => {
  it('kurtarıcı mesajları', () => expect(dizi('MESAJLAR')).toEqual(MESAJLAR));
  it('yanıtlar', () => expect(dizi('YANITLAR')).toEqual(YANITLAR));
  it('bir bayta sığar', () => {
    expect(MESAJLAR.length).toBeLessThan(256);
    expect(YANITLAR.length).toBeLessThan(256);
  });
});
