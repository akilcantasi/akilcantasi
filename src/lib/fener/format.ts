// Model cevabındaki basit Markdown işaretlerini ekranda düzgün göstermek için parçalar.
// Modeller (özellikle büyükleri) **kalın**, "* madde" ve "## başlık" yazar; bunlar
// düz metin olarak gösterilince yıldızlar ve kareler ekranda kalır.
// Yalnızca güvenli, sınırlı biçim: kalın ve madde işareti. HTML üretilmez.

export interface Span {
  text: string;
  bold: boolean;
}

/** Bir satırı kalın / normal parçalara ayırır; eşleşmeyen tek "**" atılır. */
export function inlineSpans(line: string): Span[] {
  const out: Span[] = [];
  const re = /\*\*([^*\n]+?)\*\*|__([^_\n]+?)__/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), bold: false });
    out.push({ text: m[1] ?? m[2], bold: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), bold: false });
  // Akış sırasında henüz kapanmamış "**" ya da yalnız kalmış işaretler görünmesin
  return out.map((s) => (s.bold ? s : { ...s, text: s.text.replace(/\*\*/g, '') })).filter((s) => s.text);
}

/** Satır başı işaretleri: "## Başlık" → kalın satır, "* madde" / "- madde" → "• madde". */
export function formatLines(text: string): Span[][] {
  return text.split('\n').map((raw) => {
    let line = raw;
    const h = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
    if (h) return inlineSpans(h[1].replace(/\*\*/g, '')).map((s) => ({ ...s, bold: true }));
    line = line.replace(/^(\s*)[*-]\s+/, '$1• ');
    return inlineSpans(line);
  });
}

/** Sesli okuma için işaretsiz düz metin */
export function plainText(text: string): string {
  return formatLines(text)
    .map((l) => l.map((s) => s.text).join('').replace(/^(\s*)• /, '$1'))
    .join('\n');
}
