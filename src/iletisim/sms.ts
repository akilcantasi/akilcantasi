// Hazır SMS metinleri ve sms: bağlantısı (saf mantık, test edilir).
// AFAD: afet sonrası hayati durumlar dışında arama yerine SMS ve internet
// tabanlı mesajlaşma kullanın (şebeke yükünü azaltır). Kaynak: AFAD açıklaması,
// teknoblog.com "İstanbul ve çevresinde 6.2 büyüklüğünde deprem: AFAD'dan haberleşme açıklaması".
// 112: Türkiye'de tek acil çağrı numarası (İçişleri Bakanlığı, 2021'de tüm
// acil numaralar 112'de birleşti). 112 SMS kabul etmeyebilir; arayın.

export interface Pos {
  lat: number;
  lon: number;
  acc?: number;
}

const BACK = 'aıou';
const FRONT = 'eiöü';
const HARD = 'fstkçşhp';

/**
 * Bulunma hâli + "-yım" eki: "Tokat" → "Tokat'tayım", "Ankara" → "Ankara'dayım",
 * "okul" → "okuldayım" (özel isimlerde kesme işareti). Harfle bitmiyorsa null.
 */
export function locativeIm(place: string): string | null {
  const p = place.trim();
  if (!p) return null;
  const lower = p.toLocaleLowerCase('tr-TR');
  const last = lower[lower.length - 1];
  if (!/\p{L}/u.test(last)) return null;
  let vowel = '';
  for (let i = lower.length - 1; i >= 0; i--) {
    const c = lower[i];
    if (BACK.includes(c) || FRONT.includes(c)) {
      vowel = c;
      break;
    }
  }
  if (!vowel) return null;
  const back = BACK.includes(vowel);
  const d = HARD.includes(last) ? 't' : 'd';
  const a = back ? 'a' : 'e';
  // -da/-de'den sonra kişi eki: a → yım, e → yim
  const im = back ? 'yım' : 'yim';
  const proper = p[0] !== p[0].toLocaleLowerCase('tr-TR');
  return p + (proper ? "'" : '') + d + a + im;
}

export function coordsLine(pos: Pos | null): string {
  if (!pos) return '';
  const acc = pos.acc != null && Number.isFinite(pos.acc) ? ` (±${Math.round(pos.acc)} m)` : '';
  return `Konum: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}${acc}`;
}

export function mapLink(pos: Pos | null): string {
  if (!pos) return '';
  return `https://www.openstreetmap.org/?mlat=${pos.lat.toFixed(5)}&mlon=${pos.lon.toFixed(5)}#map=17/${pos.lat.toFixed(5)}/${pos.lon.toFixed(5)}`;
}

export interface TemplateInput {
  name: string;
  place: string;
  note: string;
  people: string;
  pos: Pos | null;
}

export type TemplateId = 'iyiyim' | 'acil112' | 'yardim';

export const TEMPLATE_TITLE: Record<TemplateId, string> = {
  iyiyim: 'İyiyim',
  acil112: '112 için acil bilgi',
  yardim: 'Yardım isteği',
};

const join = (parts: (string | false | undefined | null)[]) => parts.filter(Boolean).join(' ').replace(/\s+\n/g, '\n').trim();

export function buildTemplate(id: TemplateId, i: TemplateInput): string {
  const name = i.name.trim();
  const place = i.place.trim();
  const note = i.note.trim().replace(/[.\s]+$/, '');
  const coords = coordsLine(i.pos);
  const where = place ? locativeIm(place) : null;
  const people = i.people.trim();
  switch (id) {
    case 'iyiyim':
      return join([
        'İyiyim' + (where ? `, ${where}.` : '.'),
        place && !where ? `Bulunduğum yer: ${place}.` : '',
        note ? note + '.' : '',
        coords ? coords + '.' : '',
        name ? `— ${name}` : '',
      ]);
    case 'acil112':
      return join([
        'ACİL.',
        name ? `Adım ${name}.` : '',
        note ? note + '.' : 'Yardıma ihtiyacımız var.',
        people ? `Kişi sayısı: ${people}.` : '',
        place ? `Adres/tarif: ${place}.` : '',
        coords ? coords + '.' : '',
      ]);
    case 'yardim':
      return join([
        'Yardıma ihtiyacım var.',
        note ? note + '.' : '',
        place ? `Bulunduğum yer: ${place}.` : '',
        coords ? coords + '.' : '',
        'Bu mesajı alırsan lütfen 112\'ye bildir.',
        name ? `— ${name}` : '',
      ]);
  }
}

/** sms: bağlantısı. iOS "&body=", diğerleri "?body=" bekler. */
export function smsHref(number: string, body: string, ios = false): string {
  const n = number.replace(/[^\d+]/g, '');
  return `sms:${n}${ios ? '&' : '?'}body=${encodeURIComponent(body)}`;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
}

/** Tek SMS: GSM-7 160, Türkçe karakterli (UCS-2) 70 karakter */
export function smsParts(text: string): { chars: number; parts: number; unicode: boolean } {
  const gsm = /^[A-Za-z0-9 @£$¥èéùìòÇØøÅå_ÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà\n\r]*$/.test(text);
  const chars = Array.from(text).length;
  const single = gsm ? 160 : 70;
  const multi = gsm ? 153 : 67;
  return { chars, unicode: !gsm, parts: chars <= single ? 1 : Math.ceil(chars / multi) };
}
