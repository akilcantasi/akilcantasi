// Genel kural (CLAUDE.md §1): uygulamada proje sahibine ait kişisel bilgi ya da
// onun üzerinden verilmiş örnek bulunmaz. Bu test kaynak kodu, herkese açık
// dosyaları, test verilerini ve belgeleri tarar.
import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['src', 'public', 'tests', 'e2e', 'docs', 'tools', 'server', 'testdata', 'packs-src'];
const TEXT = /\.(ts|tsx|js|mjs|cjs|json|md|html|css|txt|py|sh|conf|ps1|cmd|webmanifest|geojson)$/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'android']);

/**
 * Yasaklı ifadeler. Kişisel bilginin kendisi bu dosyada da yazılmasın diye ifadeler düz metin
 * değil, tuzlu SHA-256 özeti olarak tutulur: sha256('akil-cantasi:' + ifade), ifade küçük harfle
 * (Türkçe küçültme). Yeni ifade eklemek için:
 *   node -e "console.log(require('crypto').createHash('sha256').update('akil-cantasi:'+process.argv[1]).digest('hex'))" ifade
 * Test, metindeki her kelimenin içindeki aynı uzunluktaki bütün parçaları özetleyip karşılaştırır
 * (ifade başka bir kelimenin içinde geçse de yakalanır).
 */
const FORBIDDEN: { len: number; hash: string }[] = [
  { len: 6, hash: 'bb65ea419680a9c18068e83ef662cd9e9950d3af4ce15fe5192ca511effb4070' },
  { len: 8, hash: '87a991b8075df49fdd53f98d82309ca7988f133e1ec266152d924f2a24c18452' },
  { len: 8, hash: 'a70e59bd87cf39bfe18005f62bd184ab3fa592367cf2528b3e01690b8467d828' },
  { len: 5, hash: 'c4bbbe0eaf267ce94ca1f52ef70887ac60db41d1dbb30769ee1df4cf5d95dfb9' },
  { len: 8, hash: '04f6e272e5caf12adb78c140df42185e352812a3ef2589c9b2ef4837e1c9c641' },
  { len: 5, hash: 'a2118f6e2e291e126655ef0929a9aa0e0baedb33900e3a94dd67ba04e40eaa07' },
  { len: 9, hash: '23bd74c98633403c729253940724ce3b0a4dfe9f8b4bc03eb3a17e04ecda5881' },
];
const HASHES = new Set(FORBIDDEN.map((f) => f.hash));
const LENGTHS = [...new Set(FORBIDDEN.map((f) => f.len))];
const sha = (s: string) => crypto.createHash('sha256').update('akil-cantasi:' + s).digest('hex');

const tokenCache = new Map<string, boolean>();
/** Kelime yasaklı bir ifadeyi içeriyor mu */
function tokenHit(tok: string): boolean {
  let r = tokenCache.get(tok);
  if (r !== undefined) return r;
  r = false;
  for (const L of LENGTHS) {
    for (let i = 0; !r && i + L <= tok.length; i++) if (HASHES.has(sha(tok.slice(i, i + L)))) r = true;
    if (r) break;
  }
  tokenCache.set(tok, r);
  return r;
}

export function forbiddenWords(text: string): string[] {
  const out = new Set<string>();
  const min = Math.min(...LENGTHS);
  for (const m of text.toLocaleLowerCase('tr-TR').matchAll(/[\p{L}\p{N}]+/gu)) {
    if (m[0].length >= min && tokenHit(m[0])) out.add(m[0]);
  }
  return [...out];
}

/**
 * Şehir adı yalnızca kamu verisinde ve kaynak gösteriminde geçebilir (örnek olarak değil):
 *  - 81 ilin radyo frekansları ve il merkezlerinin koordinatları (hava ve iklim paketi)
 *  - rehberlerin kaynak listeleri ve doğrulama raporları (ör. "AKUT Bursa", "Bursagaz" gibi kurum adları)
 */
const CITY_DATA = (rel: string) =>
  rel === path.join('src', 'tools', 'radyo', 'frekanslar.ts') || rel === path.join('tools', 'hava', 'iller.json') || rel.startsWith(path.join('src', 'content', 'guides') + path.sep) || rel.startsWith(path.join('docs', 'dogrulama'));
const CITY_WORDS = ['bursa'];

function walk(dir: string, out: string[]) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (TEXT.test(e.name)) out.push(p);
  }
}

const files: string[] = [];
for (const d of DIRS) walk(path.join(ROOT, d), files);
for (const f of ['README.md', 'index.html', 'CLAUDE.md']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) files.push(p);
}

describe('kişisel bilgi yasağı', () => {
  it('özet denetimi kelime içindeki ifadeyi de yakalar', () => {
    // Bilinen yanlış/doğru örnekler: yasaklı listede olmayan sıradan kelimeler geçmeli
    expect(forbiddenWords('Toplanma alanı, Örnek Mahallesi, Ayşe ve Mehmet')).toEqual([]);
    expect(LENGTHS.length).toBeGreaterThan(0);
  });

  it('taranacak dosya bulundu', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('yasaklı ifadeler hiçbir dosyada geçmez', () => {
    const self = path.relative(ROOT, __filename);
    const hits: string[] = [];
    for (const f of files) {
      const rel = path.relative(ROOT, f);
      if (rel === self || rel === 'CLAUDE.md') continue;
      const text = fs.readFileSync(f, 'utf8').toLocaleLowerCase('tr-TR');
      for (const w of forbiddenWords(text)) hits.push(`${rel}: "${w}"`);
      // Şehir adı kelime başında aranır ("mecbursanız" gibi kelimelerin içi sayılmaz)
      if (!CITY_DATA(rel)) for (const w of CITY_WORDS) if (new RegExp('(?<!\\p{L})' + w, 'u').test(text)) hits.push(`${rel}: "${w}"`);
    }
    expect(hits, 'Kişisel bilgi içeren dosyalar (CLAUDE.md §1)').toEqual([]);
  });
});
