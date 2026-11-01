// Kütüphane makalelerini cihazdaki Fener modeliyle Türkçeye çevirme.
// Metin küçük parçalara bölünür (model bağlamı 2048 token); her parça ayrı istekle,
// akış halinde çevrilir. İnternet gerekmez.
import type { ChatMsg } from './rag';

/** Bir istekte çevrilecek en fazla karakter (girdi + çıktı bağlama sığsın) */
export const CHUNK_CHARS = 700;
/** Bir makaleden en fazla bu kadar karakter çevrilir (çok uzun makalelerde cihaz saatlerce çalışmasın) */
export const MAX_ARTICLE_CHARS = 12000;

export const TRANSLATE_SYSTEM =
  'Sen profesyonel bir çevirmensin. Kullanıcının gönderdiği metni akıcı, doğru ve sade bir Türkçeye çevir. ' +
  'Yalnızca çeviriyi yaz; açıklama, not ya da başlık ekleme. Anlamı değiştirme, bilgi ekleme ya da çıkarma. ' +
  'Sayıları, dozları, birimleri ve ilaç/etken madde adlarını aynen koru. Madde işaretlerini (•) koru.';

/** Uzun bir paragrafı cümle sınırlarından bölerek max karakterlik parçalara ayırır. */
export function splitLong(p: string, max = CHUNK_CHARS): string[] {
  if (p.length <= max) return [p];
  const sentences = p.match(/[^.!?…]+[.!?…]+["')\]]*\s*|[^.!?…]+$/g) ?? [p];
  const out: string[] = [];
  let cur = '';
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length > max) {
      if (cur) out.push(cur), (cur = '');
      // Cümle bile çok uzunsa kelime sınırından kes
      let rest = s;
      while (rest.length > max) {
        let cut = rest.lastIndexOf(' ', max);
        if (cut < max * 0.5) cut = max;
        out.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
      }
      cur = rest;
      continue;
    }
    if (cur && cur.length + 1 + s.length > max) {
      out.push(cur);
      cur = s;
    } else cur = cur ? cur + ' ' + s : s;
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * Paragrafları çeviri parçalarına dönüştürür: kısa paragraflar birleşmez (paragraf yapısı korunur),
 * uzunlar bölünür; toplam MAX_ARTICLE_CHARS ile sınırlanır.
 */
export function planChunks(paragraphs: string[], maxTotal = MAX_ARTICLE_CHARS): { chunks: string[]; truncated: boolean } {
  const chunks: string[] = [];
  let used = 0;
  for (const p of paragraphs.map((x) => x.trim()).filter(Boolean)) {
    for (const c of splitLong(p)) {
      if (used + c.length > maxTotal) return { chunks, truncated: true };
      chunks.push(c);
      used += c.length;
    }
  }
  return { chunks, truncated: false };
}

export function translateMessages(text: string): ChatMsg[] {
  return [
    { role: 'system', content: TRANSLATE_SYSTEM },
    { role: 'user', content: text },
  ];
}

/** Modelin bazen eklediği "Çeviri:" gibi önekleri ve tırnakları temizler. */
export function cleanTranslation(s: string): string {
  return s
    .replace(/^\s*(türkçe\s+)?çeviri\s*:\s*/i, '')
    .replace(/^\s*["“](.*)["”]\s*$/s, '$1')
    .trim();
}
