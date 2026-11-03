// Kurtarıcı ile enkazdaki kişi arasındaki hazır kısa mesajlar. Bluetooth işaretine yalnız
// numarası sığar. Aynı liste android/.../Mesajlar.java'da; sıra ve metin aynı olmalı
// (tests/enkaz-mesaj.test.ts denetler). Yeni mesaj sona eklenir, numaralar değişmez.

/** Kurtarıcıdan enkazdaki kişiye (dizin = numara; 0 boş) */
export const MESAJLAR = [
  '',
  'Sesini duyduk, geliyoruz.',
  'Yerini bulduk, sabret.',
  'Duvara ya da boruya vur.',
  'Sessiz ol, dinliyoruz.',
  'Hareket etme, enerjini koru.',
  'Seslen, sesini duyalım.',
  'Işığın varsa yak.',
  'Ağzını bezle kapat, toz var.',
  'Kaç kişisiniz? Yanıt ver.',
  'Yaralı mısın? Yanıt ver.',
];

/** Enkazdaki kişiden kurtarıcıya */
export const YANITLAR = [
  '',
  'Duydum.',
  'İyiyim, yaralı değilim.',
  'Yaralıyım.',
  'Ağır yaralıyım.',
  'Nefes almakta zorlanıyorum.',
  'Yalnızım.',
  'İki kişiyiz.',
  'Üç ya da daha çok kişiyiz.',
  'Yanımda çocuk var.',
  'Su lazım.',
];

/** Acil yanıtlar (kırmızı gösterilir) */
export const ACIL_YANIT = new Set([4, 5]);
