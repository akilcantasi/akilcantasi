// Deneme paketi: yalnız altyapı testi içindir (npx -y tsx tools/build-rehber-packs.ts --include-test _deneme).
import type { CategoryMeta, PackGuide, PackMeta } from '../types';

export const PACK: PackMeta = {
  id: 'sifirdan-deneme',
  name: 'Sıfırdan — deneme paketi',
  desc: 'Rehber paketi altyapısını sınamak için iki rehberlik küçük paket.',
  version: 1,
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sf-deneme', title: 'Deneme: ateş ve su', hint: 'Altyapı denemesi', art: 'sf-dn-kapak', color: '#c2583e', order: 900 },
];

export const GUIDES: PackGuide[] = [
  {
    id: 'sf-dn-kamp-atesi',
    category: 'sf-deneme',
    title: 'Taş çemberli kamp ateşi',
    tag: 'ATEŞ',
    summary: 'Rüzgârsız, açık bir yerde taşlarla çevrili küçük bir ateş yakın.',
    note: 'Deneme rehberidir: orman yangını riski olan dönemlerde açık alanda ateş yakmak yasaktır.',
    steps: [
      'Kuru otlardan ve dallardan uzak, düz bir yer seçin.',
      'Yere yumruk büyüklüğünde taşlardan bir çember dizin.',
      'Ortaya kuru ot, üstüne ince çalı çırpı koyun.',
      'Alttan tutuşturun, alev büyüdükçe kalın dal ekleyin.',
      'Ayrılmadan önce ateşi suyla tamamen söndürün.',
    ],
    art: ['sf-dn-tas-cember', null, null, 'sf-dn-yok', null],
    dont: ['Ateşi gözetimsiz bırakmayın.'],
    keywords: ['kamp ateşi', 'ateş yakma', 'taş çember', 'ocak', 'odun', 'çalı çırpı'],
    sources: ['Deneme kaynağı'],
    reviewed: false,
    checked: { date: '2026-11-02', note: 'deneme' },
  },
  {
    id: 'sf-dn-yagmur-suyu',
    category: 'sf-deneme',
    title: 'Yağmur suyu toplama',
    tag: 'SU',
    summary: 'Branda ve kova ile yağmur suyunu toplayın, içmeden önce arıtın.',
    steps: [
      'Brandayı dört köşesinden ağaçlara bağlayın.',
      'Ortası hafif aşağıda kalsın, altına kova koyun.',
      'İlk dakikalarda gelen kirli suyu dökün.',
      'Toplanan suyu kaynatmadan içmeyin.',
    ],
    keywords: ['yağmur suyu', 'su toplama', 'branda', 'kova', 'içme suyu', 'arıtma'],
    sources: ['Deneme kaynağı'],
    reviewed: false,
    checked: { date: '2026-11-02', note: 'deneme' },
  },
];
