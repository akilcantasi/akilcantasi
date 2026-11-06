import { describe, expect, it } from 'vitest';
import { CATS, LANGS, PHRASES, fold, isVerified, searchPhrases, type Lang } from '../src/tools/sozluk/phrases';
import { MASALLAR, wordCount } from '../src/tools/cocuk/masal-veri';
import { QUIZ, finalMessage } from '../src/tools/cocuk/quiz';
import { breathPhase, flip, floodFill, hexToRgba, hideMismatch, isWon, newMemoryGame, shuffle, type MemoryGame } from '../src/tools/cocuk/logic';
import { COLORING_PICS, MEMORY_PICS, PICS } from '../src/tools/cocuk/pictures';
import { CITY_FREQS, CITY_FREQS_SORTED, isFmBand, isUnverified, fmt } from '../src/tools/radyo/frekanslar';

/** belirlenimci rastgele sayı üreteci (mulberry32) */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('acil durum cümleleri: veri bütünlüğü', () => {
  it('yaklaşık 60 cümle, benzersiz kimlik, geçerli kategori', () => {
    expect(PHRASES.length).toBeGreaterThanOrEqual(55);
    expect(new Set(PHRASES.map((p) => p.id)).size).toBe(PHRASES.length);
    const cats = new Set(CATS.map((c) => c.id));
    for (const p of PHRASES) expect(cats.has(p.cat)).toBe(true);
    for (const c of CATS) expect(PHRASES.filter((p) => p.cat === c.id).length).toBeGreaterThanOrEqual(8);
  });

  it('her cümlede her dil var ya da açıkça null (boşluk) olarak işaretli', () => {
    const langs = LANGS.map((l) => l.id).sort();
    for (const p of PHRASES) {
      expect(Object.keys(p.l).sort(), p.id).toEqual(langs);
      expect(p.tr.trim().length, p.id).toBeGreaterThan(0);
      for (const l of LANGS) {
        const t = p.l[l.id];
        if (t === null) continue; // açık boşluk
        expect(t, `${p.id}/${l.id}`).toBeTruthy();
        expect(t.t.trim().length, `${p.id}/${l.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('Arapça, Farsça, Rusça, Ukraynaca için okunuş var', () => {
    for (const p of PHRASES)
      for (const l of LANGS.filter((x) => x.needsP)) {
        const t = p.l[l.id];
        if (t) expect(t.p?.trim().length ?? 0, `${p.id}/${l.id}`).toBeGreaterThan(0);
      }
  });

  it('yazı sistemleri doğru: ar/fa Arap harfli, ru/uk Kiril, diğerleri Latin', () => {
    const arabic = /[؀-ۿ]/;
    const cyr = /[Ѐ-ӿ]/;
    for (const p of PHRASES) {
      const L = p.l;
      for (const k of ['ar', 'fa'] as Lang[]) if (L[k]) expect(arabic.test(L[k]!.t), `${p.id}/${k}`).toBe(true);
      for (const k of ['ru', 'uk'] as Lang[]) if (L[k]) expect(cyr.test(L[k]!.t), `${p.id}/${k}`).toBe(true);
      for (const k of ['en', 'de', 'ku'] as Lang[]) if (L[k]) expect(arabic.test(L[k]!.t) || cyr.test(L[k]!.t), `${p.id}/${k}`).toBe(false);
      // okunuşlar Latin harfli olmalı
      for (const k of ['ar', 'fa', 'ru', 'uk'] as Lang[]) if (L[k]?.p) expect(arabic.test(L[k]!.p!) || cyr.test(L[k]!.p!), `${p.id}/${k} okunuş`).toBe(false);
      // Ukraynaca Rusça ile aynı olmamalı (kopyala-yapıştır hatası)
      if (L.ru && L.uk && p.l.ru!.t.length > 8) expect(L.uk.t, p.id).not.toBe(L.ru.t);
    }
  });

  it('doğrulanmamış çeviriler işaretli ve İngilizce hep doğrulanmış', () => {
    const flagged = PHRASES.filter((p) => !isVerified(p));
    expect(flagged.length).toBeGreaterThan(0);
    for (const p of PHRASES) expect(p.l.en!.verified).toBeUndefined();
    for (const p of PHRASES)
      for (const t of Object.values(p.l)) if (t && 'verified' in t) expect(t.verified).toBe(false);
  });

  it('arama Türkçe karakterlere ve okunuşa duyarlı', () => {
    expect(searchPhrases('').length).toBe(PHRASES.length);
    expect(searchPhrases('DOKTOR').map((p) => p.id)).toContain('t01');
    expect(searchPhrases('İngilizce').map((p) => p.id)).toContain('i13');
    expect(searchPhrases('ışık').length).toBe(0);
    expect(searchPhrases('water').map((p) => p.id)).toContain('i01');
    expect(searchPhrases('врач').map((p) => p.id)).toContain('t01');
    expect(searchPhrases('ahtacu').map((p) => p.id)).toContain('t01'); // â → a
    expect(searchPhrases('su', 'aile').every((p) => p.cat === 'aile')).toBe(true);
    expect(searchPhrases('zzqq')).toEqual([]);
    expect(fold('İSTANBUL')).toBe('istanbul');
  });
});

describe('masal-veri', () => {
  it('en az 12 özgün masal, her biri 300–600 kelime', () => {
    expect(MASALLAR.length).toBeGreaterThanOrEqual(12);
    expect(new Set(MASALLAR.map((m) => m.id)).size).toBe(MASALLAR.length);
    expect(new Set(MASALLAR.map((m) => m.title)).size).toBe(MASALLAR.length);
    for (const m of MASALLAR) {
      const n = wordCount(m);
      expect(n, m.id).toBeGreaterThanOrEqual(300);
      expect(n, m.id).toBeLessThanOrEqual(600);
      expect(PICS[m.pic], m.id).toBeTruthy();
    }
  });

  it('korkutucu kelimeler içermez', () => {
    const scary = /\b(öl(dü|üm|mek)|kan(lı)?\b|canavar|yıkıl|enkaz|çök(tü|en)|ağla(dı|yarak))/i;
    for (const m of MASALLAR) expect(scary.test(m.text.join(' ')), m.id).toBe(false);
  });
});

describe('bilgi yarışması', () => {
  it('10+ soru, geçerli cevap indeksi, benzersiz seçenekler', () => {
    expect(QUIZ.length).toBeGreaterThanOrEqual(10);
    expect(new Set(QUIZ.map((q) => q.id)).size).toBe(QUIZ.length);
    for (const q of QUIZ) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(Number.isInteger(q.answer), q.id).toBe(true);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(q.options.length);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.why.length, q.id).toBeGreaterThan(10);
    }
  });

  it('doğrulanmış temel cevaplar', () => {
    const ans = (id: string) => {
      const q = QUIZ.find((x) => x.id === id)!;
      return q.options[q.answer];
    };
    expect(ans('q1')).toMatch(/Çök, kapan, tutun/);
    expect(ans('q2')).toMatch(/Hayır/);
    expect(ans('q5')).toBe('112');
    expect(ans('q9')).toMatch(/Dur, yat, yuvarlan/);
  });

  it('kapanış mesajları', () => {
    expect(finalMessage(13, 13)).toMatch(/hazırsın/);
    expect(finalMessage(8, 13)).toMatch(/iyi/);
    expect(finalMessage(1, 13)).toMatch(/Bir kez daha/);
  });
});

describe('hafıza oyunu', () => {
  it('shuffle bir permütasyondur ve tohumla tekrar edilebilir', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8];
    const s1 = shuffle(a, rng(42));
    const s2 = shuffle(a, rng(42));
    expect(s1).toEqual(s2);
    expect([...s1].sort()).toEqual(a);
    expect(a).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // girdi değişmez
    // farklı tohumlar farklı sıralar üretir
    const set = new Set(Array.from({ length: 20 }, (_, i) => shuffle(a, rng(i)).join(',')));
    expect(set.size).toBeGreaterThan(15);
  });

  it('deste her resimden tam iki kart içerir', () => {
    const g = newMemoryGame(MEMORY_PICS, rng(1));
    expect(g.cards.length).toBe(MEMORY_PICS.length * 2);
    for (const p of MEMORY_PICS) expect(g.cards.filter((c) => c.pic === p).length).toBe(2);
    expect(g.cards.every((c) => !c.open && !c.matched)).toBe(true);
    for (const p of MEMORY_PICS) expect(PICS[p]).toBeTruthy();
  });

  it('eşleşen iki kart açık kalır, eşleşmeyenler kilitler ve kapanır', () => {
    let g = newMemoryGame(['sun', 'moon'], rng(7));
    const idx = (pic: string) => g.cards.map((c, i) => (c.pic === pic ? i : -1)).filter((i) => i >= 0);
    const [s1, s2] = idx('sun');
    const [m1] = idx('moon');
    // yanlış eşleşme
    g = flip(g, s1);
    expect(g.cards[s1].open).toBe(true);
    g = flip(g, s1); // aynı karta tekrar dokunmak bir şey yapmaz
    expect(g.picked).toEqual([s1]);
    g = flip(g, m1);
    expect(g.locked).toBe(true);
    expect(g.moves).toBe(1);
    const before = g;
    g = flip(g, s2); // kilitliyken yok sayılır
    expect(g).toBe(before);
    g = hideMismatch(g);
    expect(g.locked).toBe(false);
    expect(g.cards[s1].open).toBe(false);
    expect(g.cards[m1].open).toBe(false);
    // doğru eşleşme
    g = flip(g, s1);
    g = flip(g, s2);
    expect(g.cards[s1].matched && g.cards[s2].matched).toBe(true);
    expect(g.matches).toBe(1);
    expect(g.moves).toBe(2);
    expect(isWon(g)).toBe(false);
    g = flip(g, s1); // eşleşmiş karta dokunmak bir şey yapmaz
    expect(g.picked).toEqual([]);
  });

  it('tüm eşler bulununca oyun kazanılır', () => {
    let g: MemoryGame = newMemoryGame(MEMORY_PICS, rng(3));
    for (const p of MEMORY_PICS) {
      const [a, b] = g.cards.map((c, i) => (c.pic === p ? i : -1)).filter((i) => i >= 0);
      g = flip(flip(g, a), b);
    }
    expect(isWon(g)).toBe(true);
    expect(g.moves).toBe(MEMORY_PICS.length);
  });
});

describe('boyama', () => {
  it('en az 6 boyama resmi', () => {
    expect(COLORING_PICS.length).toBeGreaterThanOrEqual(6);
    for (const p of COLORING_PICS) expect(PICS[p].shapes.length).toBeGreaterThan(0);
  });

  it('boya kovası duvarda durur', () => {
    const w = 10, h = 10;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    const wall = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) wall[y * w + 5] = 1; // x=5'te dikey çizgi
    const n = floodFill(data, w, h, 1, 1, [255, 0, 0, 255], wall);
    expect(n).toBe(50);
    expect([data[0], data[1], data[2]]).toEqual([255, 0, 0]);
    const right = (2 * w + 8) * 4;
    expect([data[right], data[right + 1], data[right + 2]]).toEqual([255, 255, 255]);
    // aynı renkle tekrar doldurmak hiçbir şey yapmaz; duvara tıklamak da
    expect(floodFill(data, w, h, 1, 1, [255, 0, 0, 255], wall)).toBe(0);
    expect(floodFill(data, w, h, 5, 5, [0, 0, 255, 255], wall)).toBe(0);
    expect(floodFill(data, w, h, -1, 50, [0, 0, 255, 255], wall)).toBe(0);
  });

  it('renk dönüştürme', () => {
    expect(hexToRgba('#ff8000')).toEqual([255, 128, 0, 255]);
    expect(hexToRgba('#fff')).toEqual([255, 255, 255, 255]);
  });
});

describe('nefes oyunu', () => {
  it('4 sn al, 4 sn ver', () => {
    expect(breathPhase(0).phase).toBe('in');
    expect(breathPhase(3999).phase).toBe('in');
    expect(breathPhase(4000).phase).toBe('out');
    expect(breathPhase(7999).phase).toBe('out');
    expect(breathPhase(8000)).toMatchObject({ phase: 'in', cycle: 1 });
    expect(breathPhase(0).count).toBe(1);
    expect(breathPhase(3500).count).toBe(4);
    expect(breathPhase(0).scale).toBeCloseTo(0.55);
    expect(breathPhase(4000).scale).toBeCloseTo(1);
    expect(breathPhase(2000).scale).toBeGreaterThan(breathPhase(1000).scale);
    expect(breathPhase(6000).scale).toBeLessThan(breathPhase(5000).scale);
  });
});

describe('radyo frekansları', () => {
  it('81 il var, değerler FM bandında; eksik kayıt not ile açıklanıyor', () => {
    expect(CITY_FREQS.length).toBe(81);
    expect(new Set(CITY_FREQS.map((c) => c.id)).size).toBe(81);
    expect(new Set(CITY_FREQS.map((c) => c.city)).size).toBe(81);
    expect(CITY_FREQS_SORTED.map((c) => c.city)[0]).toBe('Adana');
    expect(CITY_FREQS_SORTED.map((c) => c.city).at(-1)).toBe('Zonguldak');
    for (const c of CITY_FREQS) {
      // Radyo 1 ya da Radyo Haber yoksa ya da merkez dışı verici gösteriliyorsa kullanıcıya not düşülür
      if (!c.radyo1.length && !c.haber.length) expect(c.note, c.id).toBeTruthy();
      if (isUnverified(c)) expect(c.note, c.id).toMatch(/doğrulanmış frekans bulunamadı/);
      if (c.district && !/^Merkez$|^Üsküdar$|^Çankaya$|^Yüreğir$|^Şehitkamil$|^Meram$/.test(c.district)) expect(c.note, c.id).toBeTruthy();
      for (const k of ['radyo1', 'haber', 'trtfm', 'radyo3', 'turku', 'nagme', 'kurdi'] as const)
        for (const f of c[k] ?? []) {
          expect(isFmBand(f), `${c.id}/${k}/${f}`).toBe(true);
          expect(Math.round(f * 10) / 10, `${c.id}/${k}`).toBe(f);
        }
    }
  });
  it('TRT sayfasındaki örnek değerler', () => {
    const f = (id: string) => CITY_FREQS.find((c) => c.id === id)!;
    expect(f('istanbul').radyo1).toEqual([95.6]);
    expect(f('ankara').radyo1).toEqual([93.3]);
    expect(f('izmir').haber).toEqual([99.1]);
    expect(fmt([100.3, 88])).toBe('100.3 / 88.0');
    // 2026-11-07 eklemeleri (radyo.trt.net.tr/frekanslar/<il>-merkez)
    expect(f('kahramanmaras').radyo1).toEqual([99.8]);
    expect(f('sanliurfa').haber).toEqual([95.7]);
    expect(f('van').haber).toEqual([95.8]);
    // TRT'de kaydı olmayan il: boş, doğrulanmadı
    expect(isUnverified(f('kayseri'))).toBe(true);
    expect(isUnverified(f('ankara'))).toBe(false);
  });
});
