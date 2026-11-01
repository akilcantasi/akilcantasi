// Mors alfabesi (ITU-R M.1677-1). Zamanlama: nokta 1 birim, çizgi 3 birim,
// işaret içi boşluk 1, harfler arası 3, kelimeler arası 7 birim.
// Kaynak: ITU-R M.1677-1 "International Morse code"; en.wikipedia.org/wiki/Morse_code
//
// ITU tablosunda Türkçeye özgü harf yoktur. Alıcı standart tabloyu kullanacağı
// için Ç→C, Ğ→G, I/İ/ı→I, Ö→O, Ş→S, Ü→U olarak gönderilir (yaygın uygulama).
// SOS tek işaret olarak, harf arası boşluk olmadan verilir: ...---...

export const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  ':': '---...', '=': '-...-', '+': '.-.-.', '-': '-....-', '"': '.-..-.', '@': '.--.-.',
  // ITU dışı ama yaygın
  '!': '-.-.--', '&': '.-...', ';': '-.-.-.',
};

const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export const SOS = '...---...';

const TR_MAP: Record<string, string> = { Ç: 'C', Ğ: 'G', İ: 'I', I: 'I', Ö: 'O', Ş: 'S', Ü: 'U', Â: 'A', Î: 'I', Û: 'U' };

/** Türkçe büyük harfe çevirip ITU karşılığı olmayan harfleri sadeleştirir */
export function normalizeForMorse(text: string): string {
  return Array.from(text.toLocaleUpperCase('tr-TR'))
    .map((c) => TR_MAP[c] ?? c)
    .join('');
}

/**
 * Metin → Mors. Harfler boşlukla, kelimeler " / " ile ayrılır.
 * Bilinmeyen karakterler atlanır (unknown dizisinde döner).
 * "SOS" kelimesi tek başına geçerse birleşik işaret olarak yazılır.
 */
export function textToMorse(text: string): { morse: string; unknown: string[] } {
  const unknown: string[] = [];
  const words = normalizeForMorse(text).split(/\s+/).filter(Boolean);
  const out = words
    .map((w) => {
      if (w === 'SOS') return SOS;
      return Array.from(w)
        .map((c) => {
          const m = MORSE[c];
          if (!m && !unknown.includes(c)) unknown.push(c);
          return m;
        })
        .filter(Boolean)
        .join(' ');
    })
    .filter(Boolean);
  return { morse: out.join(' / '), unknown };
}

/** Mors → metin. Nokta: . · • ; çizgi: - − – — _ ; kelime ayırıcı: / | ya da 2+ boşluk */
export function morseToText(morse: string): { text: string; unknown: string[] } {
  const unknown: string[] = [];
  const norm = morse
    .replace(/[·•∙]/g, '.')
    .replace(/[−–—_]/g, '-')
    .trim();
  if (!norm) return { text: '', unknown };
  const words = norm.split(/\s*[/|]\s*|\s{2,}/).filter((w) => w.trim());
  const text = words
    .map((w) =>
      w
        .trim()
        .split(/\s+/)
        .map((code) => {
          if (code === SOS) return 'SOS';
          const c = REVERSE[code];
          if (!c) {
            if (!unknown.includes(code)) unknown.push(code);
            return '?';
          }
          return c;
        })
        .join(''),
    )
    .join(' ');
  return { text, unknown };
}

/** Girdi Mors mu (yalnızca nokta/çizgi/ayırıcı)? */
export function looksLikeMorse(s: string): boolean {
  const t = s.trim();
  return !!t && /^[.\-·•∙−–—_/|\s]+$/.test(t) && /[.\-·•∙−–—_]/.test(t);
}

/** Açık/kapalı adımları: [açık mı, süre (birim)] */
export type Step = [on: boolean, units: number];

/** Mors dizisini zamanlama adımlarına çevirir (son boşluk dahil değil) */
export function morseToSteps(morse: string): Step[] {
  const steps: Step[] = [];
  const pushGap = (u: number) => {
    if (!steps.length) return;
    const last = steps[steps.length - 1];
    if (!last[0]) last[1] = Math.max(last[1], u);
    else steps.push([false, u]);
  };
  // morseToText ile aynı yazımlar: · • ∙ nokta, − – — _ çizgi; | ya da 2+ boşluk kelime arası
  const norm = morse
    .replace(/[·•∙]/g, '.')
    .replace(/[−–—_]/g, '-')
    .trim();
  const words = norm.split(/\s*[/|]\s*|\s{2,}/).filter((w) => w.trim());
  words.forEach((w, wi) => {
    if (wi) pushGap(7);
    w.trim()
      .split(/\s+/)
      .forEach((letter, li) => {
        if (li) pushGap(3);
        Array.from(letter).forEach((sym, si) => {
          if (si) pushGap(1);
          if (sym === '.') steps.push([true, 1]);
          else if (sym === '-') steps.push([true, 3]);
        });
      });
  });
  return steps;
}

/** Toplam süre (birim) */
export function stepsUnits(steps: Step[]): number {
  return steps.reduce((a, [, u]) => a + u, 0);
}

/** PARIS standardı: 1 birim (ms) = 1200 / WPM */
export function unitMs(wpm: number): number {
  return Math.round(1200 / wpm);
}
