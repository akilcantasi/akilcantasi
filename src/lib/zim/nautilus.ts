// "Nautilus" kitaplıkları (Kiwix zimgit-* paketleri: Su Arıtma, Düğümler, Tıp, Afet
// Sonrası, Gıda…): ana sayfa kitap listesini JavaScript ile çizer, kitaplar PDF'tir.
// Uygulama ZIM içindeki betikleri çalıştırmaz; listeyi `database.js` dosyasından okuyup
// kendisi gösterir. Dosya Python sözlüğü biçiminde bir JS dizisidir:
//   var DATABASE = [ {'_id': '00000', 'ti': 'Başlık', 'dsc': '…', 'aut': '…', 'fp': ['a.pdf']}, … ];
// Kaynak: https://github.com/openzim/nautilus

export interface NautilusBook {
  id: string;
  title: string;
  description: string;
  author: string;
  /** ZIM içindeki dosya yolları ("files/…") */
  files: string[];
}

/** Python/JS nesne yazımını JSON'a çevirir (tek tırnaklı dizeler, True/False/None). */
export function pyLiteralToJson(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "'" || c === '"') {
      const q = c;
      let s = '';
      i++;
      while (i < n && src[i] !== q) {
        if (src[i] === '\\' && i + 1 < n) {
          const e = src[i + 1];
          if (e === q) s += q;
          else if (e === 'n') s += '\n';
          else if (e === 't') s += '\t';
          else if (e === 'r') s += '\r';
          else if (e === '\\') s += '\\';
          else if (e === 'u' && /^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) {
            s += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16));
            i += 4;
          } else if (e === 'x' && /^[0-9a-fA-F]{2}$/.test(src.slice(i + 2, i + 4))) {
            s += String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16));
            i += 2;
          } else s += e;
          i += 2;
          continue;
        }
        s += src[i++];
      }
      i++; // kapanış tırnağı
      out += JSON.stringify(s);
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let w = '';
      while (i < n && /[A-Za-z0-9_]/.test(src[i])) w += src[i++];
      out += w === 'True' || w === 'true' ? 'true' : w === 'False' || w === 'false' ? 'false' : 'null';
      continue;
    }
    out += c;
    i++;
  }
  // Sondaki virgüller: [1,2,] / {a:1,}
  return out.replace(/,(\s*[\]}])/g, '$1');
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : Array.isArray(v) ? v.filter((x) => typeof x === 'string').join(', ') : '');

export function parseNautilusDb(text: string): NautilusBook[] {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end <= start) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(pyLiteralToJson(text.slice(start, end + 1)));
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const out: NautilusBook[] = [];
  arr.forEach((o: any, i) => {
    if (!o || typeof o !== 'object') return;
    const fp = Array.isArray(o.fp) ? o.fp : typeof o.fp === 'string' ? [o.fp] : [];
    const files = fp.filter((f: unknown): f is string => typeof f === 'string' && !!f.trim()).map((f: string) => 'files/' + f.replace(/^\.?\/?(files\/)?/, ''));
    const title = str(o.ti) || (files[0] ? files[0].replace(/^files\//, '') : '');
    if (!title) return;
    out.push({ id: str(o._id) || String(i), title, description: str(o.dsc), author: str(o.aut), files });
  });
  return out;
}

/** Bu ZIM bir nautilus kitaplığı mı (ana sayfası database.js okuyor mu)? */
export async function loadNautilus(zim: { getResource(p: string): Promise<{ mime: string; data: Uint8Array } | null> }): Promise<NautilusBook[] | null> {
  const r = await zim.getResource('database.js').catch(() => null);
  if (!r) return null;
  const books = parseNautilusDb(new TextDecoder().decode(r.data));
  return books.length ? books : null;
}
