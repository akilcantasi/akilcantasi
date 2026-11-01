// Kütüphane rafları (katalog) ve Fener ile makale çevirisi yardımcıları
import { describe, expect, it } from 'vitest';
import raw from '../public/packs-manifest.json';
import { SHELVES, validateManifest } from '../src/lib/manifest';
import { CHUNK_CHARS, MAX_ARTICLE_CHARS, cleanTranslation, planChunks, splitLong, translateMessages } from '../src/lib/fener/translate';
import { isTurkishLang } from '../src/tabs/KutuphaneCeviri';

describe('kütüphane katalogu', () => {
  const { ok, errors, manifest } = validateManifest(raw);
  const zims = manifest.packs.filter((p) => p.kind === 'zim');

  it('katalog geçerli', () => {
    expect(errors).toEqual([]);
    expect(ok).toBe(true);
  });

  it('her kütüphane paketinin bir rafı var', () => {
    expect(zims.filter((p) => !p.shelf).map((p) => p.id)).toEqual([]);
  });

  it('her rafta en az bir paket var', () => {
    for (const s of SHELVES) expect(zims.some((p) => p.shelf === s), s).toBe(true);
  });

  it('ansiklopedi, ilaç rehberi ve telifsiz kitap seçenekleri var', () => {
    expect(zims.filter((p) => p.shelf === 'ansiklopedi').length).toBeGreaterThanOrEqual(5);
    expect(zims.some((p) => p.shelf === 'saglik' && /ilaç/i.test(p.name + p.desc))).toBe(true);
    expect(zims.filter((p) => p.shelf === 'kitap').length).toBeGreaterThanOrEqual(4);
  });

  it('önerilenler küçük ve ilk kurulum için uygun (her biri ≤ 1,5 GB)', () => {
    const f = zims.filter((p) => p.featured);
    expect(f.length).toBeGreaterThanOrEqual(6);
    for (const p of f) expect(p.size, p.id).toBeLessThanOrEqual(1.5 * 1024 ** 3);
  });

  it('Kiwix paketleri önce Hugging Face kopyasından, sonra CORS destekli aynadan iner', () => {
    for (const p of zims.filter((x) => x.urls.some((u) => u.includes('kiwix.org')))) {
      const kiwix = p.urls.filter((u) => !u.includes('huggingface.co'));
      if (p.urls.some((u) => u.includes('huggingface.co'))) expect(p.urls[0], p.id).toMatch(/^https:\/\/huggingface\.co\/datasets\/akilcantasi\/paketler\//);
      expect(kiwix[0], p.id).toMatch(/^https:\/\/mirror\.download\.kiwix\.org\/zim\//);
    }
  });

  it('geçersiz raf reddedilir', () => {
    const bad = validateManifest({ ...raw, packs: [{ ...zims[0], shelf: 'yok' }] });
    expect(bad.ok).toBe(false);
  });
});

describe('makale çevirisi', () => {
  it('kısa paragraf olduğu gibi kalır', () => {
    expect(splitLong('Kısa bir cümle.')).toEqual(['Kısa bir cümle.']);
  });

  it('uzun paragraf cümle sınırından bölünür, hiçbir parça sınırı aşmaz', () => {
    const p = Array.from({ length: 40 }, (_, i) => `This is sentence number ${i} about first aid.`).join(' ');
    const parts = splitLong(p);
    expect(parts.length).toBeGreaterThan(1);
    for (const x of parts) expect(x.length).toBeLessThanOrEqual(CHUNK_CHARS);
    expect(parts.join(' ').replace(/\s+/g, ' ')).toBe(p);
    for (const x of parts) expect(x).toMatch(/\.$/);
  });

  it('noktasız çok uzun metin kelime sınırından bölünür', () => {
    const p = 'word '.repeat(400).trim();
    const parts = splitLong(p);
    for (const x of parts) expect(x.length).toBeLessThanOrEqual(CHUNK_CHARS);
    expect(parts.join(' ')).toBe(p);
  });

  it('toplam uzunluk sınırlanır', () => {
    const paras = Array.from({ length: 60 }, () => 'A'.repeat(300) + '.');
    const { chunks, truncated } = planChunks(paras);
    expect(truncated).toBe(true);
    expect(chunks.join('').length).toBeLessThanOrEqual(MAX_ARTICLE_CHARS);
  });

  it('istem: sistem mesajı + metin; doz ve adlar korunur talimatı', () => {
    const m = translateMessages('Take 500 mg paracetamol.');
    expect(m[0].role).toBe('system');
    expect(m[0].content).toMatch(/doz/i);
    expect(m[1]).toEqual({ role: 'user', content: 'Take 500 mg paracetamol.' });
  });

  it('çeviri önekleri ve tırnaklar temizlenir', () => {
    expect(cleanTranslation('Çeviri: Merhaba dünya.')).toBe('Merhaba dünya.');
    expect(cleanTranslation('"Merhaba."')).toBe('Merhaba.');
  });

  it('Türkçe kaynakta çeviri düğmesi çıkmaz', () => {
    expect(isTurkishLang('tur')).toBe(true);
    expect(isTurkishLang('tr')).toBe(true);
    expect(isTurkishLang('eng')).toBe(false);
    expect(isTurkishLang('')).toBe(false);
  });
});
