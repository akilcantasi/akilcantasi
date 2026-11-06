// Metin yardımcıları: Türkçe duyarlı arama normalizasyonu ve DOM gerektirmeyen
// HTML → düz metin dönüştürücü (node testlerinde ve RAG'de kullanılır).

/**
 * Arama için normalize eder: Türkçe küçük harf, İ/I/ı/i → 'i', alt çizgi → boşluk,
 * birleşik nokta (U+0307) atılır, boşluklar sadeleştirilir.
 */
export function normalizeForSearch(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/̇/g, '')
    .replace(/ı/g, 'i')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const FOLD_CHAR: Record<string, string> = {
  ı: 'i', ş: 's', ç: 'c', ğ: 'g', ö: 'o', ü: 'u', ß: 's', æ: 'a', œ: 'o', ø: 'o', ł: 'l', đ: 'd', ð: 'd', þ: 't',
};

/**
 * Arama için katlar: Türkçe küçük harf, aksan/çengel atılır (ı/i, ş/s, ç/c,
 * ğ/g, ö/o, ü/u, â/a…), alt çizgi ve noktalama boşluğa çevrilir.
 */
export function foldTr(s: string): string {
  return normalizeForSearch(s)
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .replace(/[^\s\p{L}\p{N}]/gu, ' ')
    .replace(/[ışçğöüßæœøłđðþ]/g, (c) => FOLD_CHAR[c] ?? c)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kod birimi kod birimi katlama (uzunluk ve konumlar korunur): "sayfada bul"
 * eşleşme konumlarının özgün metindeki konumlarla aynı kalması için.
 */
export function foldCharwise(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    let c = ch.toLocaleLowerCase('tr');
    if (c.length !== 1) c = ch.toLowerCase();
    if (c.length !== 1) c = ch;
    if (FOLD_CHAR[c]) c = FOLD_CHAR[c];
    else if (c.charCodeAt(0) >= 0xc0) {
      const base = c.normalize('NFD')[0];
      if (base && base.length === 1) c = base;
    }
    out += c;
  }
  return out;
}

const ACCENT_VARIANTS: Record<string, string[]> = {
  c: ['ç', 'Ç'], s: ['ş', 'Ş'], g: ['ğ', 'Ğ'], o: ['ö', 'Ö'], u: ['ü', 'Ü'],
  ç: ['c', 'C'], ş: ['s', 'S'], ğ: ['g', 'G'], ö: ['o', 'O'], ü: ['u', 'U'],
  a: ['â', 'Â'], â: ['a', 'A'],
};

/** Bir karakterin büyük/küçük harf, i/ı ve Türkçe çengel (ç/c, ş/s…) varyantları — önek araması için. */
export function caseVariants(ch: string): string[] {
  const set = new Set<string>([ch]);
  for (const v of ACCENT_VARIANTS[ch.toLocaleLowerCase('tr')] ?? []) set.add(v);
  set.add(ch.toLocaleLowerCase('tr'));
  set.add(ch.toLocaleUpperCase('tr'));
  set.add(ch.toLowerCase());
  set.add(ch.toUpperCase());
  if (normalizeForSearch(ch) === 'i') ['i', 'ı', 'I', 'İ'].forEach((c) => set.add(c));
  if (ch === ' ' || ch === '_') {
    set.add(' ');
    set.add('_');
  }
  // Tek kod noktası olmayan sonuçları ele (ör. 'i̇')
  return [...set].filter((c) => [...c].length === 1);
}

// ---------------------------------------------------------------------------
// HTML → metin
// ---------------------------------------------------------------------------

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—',
  hellip: '…', laquo: '«', raquo: '»', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  deg: '°', middot: '·', bull: '•', times: '×', copy: '©', reg: '®', shy: '', zwj: '', zwnj: '',
  thinsp: ' ', ensp: ' ', emsp: ' ', minus: '−', plusmn: '±', frac12: '½', sup2: '²', sup3: '³',
  euro: '€', para: '¶', sect: '§', larr: '←', rarr: '→', uarr: '↑', darr: '↓',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
      } catch {
        return m;
      }
    }
    const v = NAMED[e.toLowerCase()];
    return v ?? m;
  });
}

const VOID = new Set(['br', 'img', 'hr', 'meta', 'link', 'input', 'wbr', 'source', 'area', 'col', 'embed', 'param', 'track', 'base']);
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'table', 'math', 'svg', 'template', 'iframe', 'object', 'head', 'figure', 'button', 'select', 'textarea']);
const SKIP_CLASSES = 'reference,references,reflist,mw-references-wrap,navbox,vertical-navbox,infobox,metadata,hatnote,mw-editsection,noprint,thumb,toc,catlinks,mw-empty-elt,sistersitebox,ambox,mbox-small,gallery,preview-warning,mw-message-box,error,mw-ext-cite-error'.split(',');
/**
 * Sınıf listesinde atlanacak bir sınıf var mı? Sınıflar tek tek karşılaştırılır
 * (tam ad ya da "ad-…" öneki): "vector-toc-not-available" gibi <html>
 * sınıfları yanlışlıkla eşleşip tüm belgeyi silmesin.
 */
function skipClass(cls: string): boolean {
  for (const t of cls.split(/\s+/)) {
    if (!t) continue;
    for (const k of SKIP_CLASSES) if (t === k || t.startsWith(k + '-') || t.startsWith(k + '_')) return true;
  }
  return false;
}
const NEVER_SKIP = new Set(['html', 'body', 'main']);
const BLOCK = new Set(['p', 'div', 'section', 'article', 'li', 'ul', 'ol', 'dl', 'dt', 'dd', 'blockquote', 'pre', 'tr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'details', 'summary', 'main', 'body']);
const HEADING = /^h[1-6]$/;
/** Bu başlıklardan sonrası (kaynakça vb.) metne alınmaz. */
const STOP_HEADINGS = /^(kaynakça|kaynaklar|notlar|dipnotlar|dış bağlantılar|ayrıca bakınız|ilgili maddeler|konuyla ilgili yayınlar|ek okumalar|references|notes|external links|see also|further reading|bibliography)$/i;

const BLOCK_OPEN = /<!--|<!\[CDATA\[|<(script|style|noscript|template|head)\b[^<>]*>/gi;
const BLOCK_CLOSE: Record<string, RegExp> = {
  '!--': /-->/g,
  cdata: /\]\]>/g,
  script: /<\/script\s*>/gi,
  style: /<\/style\s*>/gi,
  noscript: /<\/noscript\s*>/gi,
  template: /<\/template\s*>/gi,
  head: /<\/head\s*>/gi,
};

/**
 * Yorum, CDATA, betik/stil/noscript/template ve head bloklarını doğrusal sürede atar.
 * (Eski [\s\S]*? düzenli ifadeleri kapanmayan çok sayıda "<!--" ya da "<script" içeren
 * bozuk bir makalede karesel sürede çalışıp sekmeyi kilitleyebiliyordu.) Kapanmayan yorum,
 * CDATA, betik ve stil belge sonuna kadar sürer (HTML kuralı); kapanmayan head/noscript/
 * template yalnızca açılış etiketiyle atılır (head'in kapanış etiketi isteğe bağlıdır).
 */
export function stripBlocks(html: string): string {
  let out = '';
  let pos = 0;
  // Bir türün kapanışı bir kez bulunamadıysa sonraki konumlarda da bulunamaz: yeniden aranmaz
  const noClose = new Set<string>();
  for (;;) {
    BLOCK_OPEN.lastIndex = pos;
    const m = BLOCK_OPEN.exec(html);
    if (!m) break;
    const key = m[1] ? m[1].toLowerCase() : m[0] === '<!--' ? '!--' : 'cdata';
    let c: RegExpExecArray | null = null;
    if (!noClose.has(key)) {
      const close = BLOCK_CLOSE[key];
      close.lastIndex = m.index + m[0].length;
      c = close.exec(html);
      if (!c) noClose.add(key);
    }
    out += html.slice(pos, m.index) + ' ';
    if (c) pos = c.index + c[0].length;
    else if (key === 'head' || key === 'noscript' || key === 'template') pos = m.index + m[0].length;
    else return out;
  }
  return out + html.slice(pos);
}

/**
 * HTML'i okunabilir düz metne çevirir. Betik/stil/tablo/kaynakça/gezinti kutuları
 * atılır, blok öğeler satır sonuna dönüşür, [1] tarzı dipnot işaretleri silinir.
 * Paragraflar boş satırla ayrılır.
 */
export function htmlToText(html: string): string {
  // Betik/stil/head içeriği önce atılır: içlerindeki "<" ve tırnaklar (ör.
  // mwoffliner'ın head'deki RLCONF betiği) etiket ayrıştırıcısını şaşırtıp
  // tüm belgeyi yutabiliyordu (gerçek Vikipedi ZIM'inde metin boş çıkıyordu).
  html = stripBlocks(html);
  // Etiket içinde tırnaksız "<" olmaz: böylece kapanmayan etiketler her konumda belgenin
  // sonuna kadar taranmaz (karesel süre)
  const re = /<!\[CDATA\[[\s\S]*?\]\]>|<![^<>]*>|<(\/?)([a-zA-Z][\w:-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>|([^<]+)|</g;
  let out = '';
  let skipTag: string | null = null;
  let skipDepth = 0;
  let headingStart = -1;
  let inPre = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const [, close, rawName, attrs, text] = m;
    if (text !== undefined || (m[0] === '<' && !rawName)) {
      if (skipTag) continue;
      const t = text !== undefined ? decodeEntities(text) : '<';
      out += inPre ? t : t.replace(/\s+/g, ' ');
      continue;
    }
    if (!rawName) continue; // yorum, doctype
    const name = rawName.toLowerCase();
    const selfClose = VOID.has(name) || /\/\s*$/.test(attrs ?? '');
    if (skipTag) {
      if (name === skipTag) {
        if (close) skipDepth--;
        else if (!selfClose) skipDepth++;
        if (skipDepth === 0) skipTag = null;
      }
      continue;
    }
    if (!close) {
      const cls = /\bclass\s*=\s*("([^"]*)"|'([^']*)'|(\S+))/i.exec(attrs ?? '');
      const clsv = cls ? cls[2] ?? cls[3] ?? cls[4] ?? '' : '';
      const isRefSup = name === 'sup' && /\breference\b/.test(clsv);
      if (!selfClose && (SKIP_TAGS.has(name) || isRefSup || (clsv && !NEVER_SKIP.has(name) && skipClass(clsv)))) {
        skipTag = name;
        skipDepth = 1;
        continue;
      }
      if (name === 'br') out += '\n';
      else if (name === 'li') out += '\n• ';
      else if (HEADING.test(name)) {
        out += '\n\n';
        headingStart = out.length;
      } else if (name === 'p') out += '\n\n';
      else if (BLOCK.has(name)) out += '\n';
      if (name === 'pre') inPre++;
    } else {
      if (HEADING.test(name) && headingStart >= 0) {
        const h = out.slice(headingStart).replace(/\s+/g, ' ').trim();
        if (STOP_HEADINGS.test(h)) {
          out = out.slice(0, headingStart);
          break;
        }
        out += '\n';
        headingStart = -1;
      } else if (name === 'p') out += '\n\n';
      else if (BLOCK.has(name)) out += '\n';
      if (name === 'pre') inPre = Math.max(0, inPre - 1);
    }
  }
  return out
    .replace(/\[(\d+|[a-zçğıöşü]|not \d+|kaynak belirtilmeli|alıntı gerekli|citation needed)\]/gi, '')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +([,.;:!?)])/g, '$1')
    .trim();
}

/**
 * RAG için: makalenin ilk anlamlı paragraflarını döndürür. Başlıklar ve çok kısa
 * satırlar atlanır; toplam uzunluk maxChars'ı aşmaz (son paragraf cümle/kelime
 * sınırında kesilir).
 */
export function extractParagraphs(html: string, maxChars = 1500): string[] {
  const text = htmlToText(html);
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n(?!•)/g, ' ').trim())
    .filter((p) => p.length >= 40 || (/[.!?:]$/.test(p) && p.length >= 20) || p.includes('•'));
  const out: string[] = [];
  let used = 0;
  for (const p of paras) {
    const room = maxChars - used - (out.length ? 2 : 0);
    if (room <= 40) break;
    if (p.length <= room) {
      out.push(p);
      used += p.length + (out.length > 1 ? 2 : 0);
    } else {
      let cut = p.slice(0, room);
      const sent = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
      if (sent > room * 0.5) cut = cut.slice(0, sent + 1);
      else {
        const sp = cut.lastIndexOf(' ');
        if (sp > 0) cut = cut.slice(0, sp);
        cut += '…';
      }
      out.push(cut);
      break;
    }
  }
  return out;
}
