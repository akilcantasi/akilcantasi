// Enerji ve şarj kategorisi: arama ve Fener bağlam araması (RAG) denetimi.
import { describe, expect, it } from 'vitest';
import { searchGuides, guideToText } from '../src/lib/guides-search';
import { retrieve, isRelevantGuide, type RagDeps } from '../src/lib/fener/rag';
import { GUIDES } from '../src/content/guides';
import { CATEGORIES } from '../src/content/categories';

const deps: RagDeps = { searchGuides, guideToText: guideToText as RagDeps['guideToText'], searchLibraryForContext: async () => [] };
const top = (q: string) => searchGuides(q, 3)[0]?.guide.id;
const ids = (q: string, n = 5) => searchGuides(q, n).map((h) => h.guide.id);
const isEnerji = (id: string) => id.startsWith('enerji-');

/** [sorgu, beklenen ilk rehber] — her rehber için 1–2 gerçekçi sorgu */
const CASES: [string, string][] = [
  ['telefon şarjı bitti', 'enerji-sarj-yollari'],
  ['elektrik kesildi telefonumu nasıl şarj ederim', 'enerji-sarj-yollari'],
  ['elektriksiz telefon şarjı', 'enerji-sarj-yollari'],
  ['düşük güç modu', 'enerji-telefon-tasarruf'],
  ['telefonun şarjı çabuk bitiyor', 'enerji-telefon-tasarruf'],
  ['powerbank kaç kere şarj eder', 'enerji-powerbank'],
  ['10000 mah kaç şarj', 'enerji-powerbank'],
  ['motor kapalıyken şarj', 'enerji-arac'],
  ['garajda araba çalıştırmak', 'enerji-arac'],
  ['bulutlu havada güneş paneli', 'enerji-gunes'],
  ['katlanır güneş paneli', 'enerji-gunes'],
  ['kurmalı radyo', 'enerji-kurmali'],
  ['dinamolu radyo', 'enerji-kurmali'],
  ['kalem pille şarj', 'enerji-kalem-pil'],
  ['pil kutulu şarj aleti', 'enerji-kalem-pil'],
  ['laptoptan şarj', 'enerji-laptop-ups'],
  ['ups ötüyor', 'enerji-laptop-ups'],
  ['telefondan telefona şarj', 'enerji-laptop-ups'],
  ['jeneratörden şarj', 'enerji-jenerator'],
  ['jeneratörle telefon şarjı', 'enerji-jenerator'],
  ['şarj noktası nerede', 'enerji-sarj-noktasi'],
  ['çadır kentte şarj', 'enerji-sarj-noktasi'],
  ['yastık altında şarj', 'enerji-sarj-hatalari'],
  ['ıslak telefonu şarj etmek', 'enerji-sarj-hatalari'],
  ['şarj çantası', 'enerji-hazirlik'],
  ['elektrik kesintisine hazırlık', 'enerji-hazirlik'],
  // Kendin yap
  ['aküden usb şarj yapmak', 'enerji-ky-aku-usb'],
  ['akü çakmaklık soketi', 'enerji-ky-aku-usb'],
  ['lm2596', 'enerji-ky-gunes-usb'],
  ['güneş panelinden usb yapmak', 'enerji-ky-gunes-usb'],
  ['bisiklet dinamosu', 'enerji-ky-bisiklet'],
  ['bisikletle telefon şarjı', 'enerji-ky-bisiklet'],
  ['rüzgar türbini yapmak', 'enerji-ky-ruzgar-su'],
  ['dc motordan elektrik', 'enerji-ky-ruzgar-su'],
  ['peltier ile elektrik', 'enerji-ky-termoelektrik'],
  ['sobadan elektrik', 'enerji-ky-termoelektrik'],
  ['18650 powerbank yapmak', 'enerji-ky-18650'],
  ['laptop pilinden powerbank', 'enerji-ky-18650'],
  ['limonla şarj', 'enerji-ky-efsaneler'],
  ['sokak lambasından şarj', 'enerji-ky-efsaneler'],
  ['komşulara şarj', 'enerji-ky-komsu'],
  ['şarj köşesi kurmak', 'enerji-ky-komsu'],
];

describe('enerji araması', () => {
  it('kategori kayıtlı ve tüm rehberleri içeriyor', () => {
    const cat = CATEGORIES.find((c) => c.id === 'enerji');
    expect(cat).toBeDefined();
    const own = GUIDES.filter((g) => isEnerji(g.id)).map((g) => g.id);
    expect(own.length).toBeGreaterThanOrEqual(16);
    for (const id of own) expect(cat!.guides).toContain(id);
    // Her rehber en az bir aramada ilk sırada
    for (const id of own) expect(CASES.some(([, e]) => e === id), id).toBe(true);
  });

  it.each(CASES)('"%s" → %s', (q, id) => {
    expect(top(q), `"${q}" → ${ids(q).join(', ')}`).toBe(id);
  });

  // Genel sorgular: başka kategorinin rehberi ilk sırada kalabilir, ama enerji rehberi ilk 5'te olmalı
  it.each(['şarj', 'telefon şarjı bitti', 'elektrik yok', 'powerbank', 'jeneratör', 'güneş paneli'])(
    'genel sorgu "%s" bir enerji rehberini bulur',
    (q) => {
      expect(ids(q).some(isEnerji), `"${q}" → ${ids(q).join(', ')}`).toBe(true);
    },
  );
});

describe('enerji: Fener bağlam araması', () => {
  it('"elektrik kesildi telefonumu nasıl şarj ederim" yeni rehberleri getirir', async () => {
    const r = await retrieve('elektrik kesildi telefonumu nasıl şarj ederim', { deps });
    expect(r.topGuideId).toBe('enerji-sarj-yollari');
    expect(isRelevantGuide(r.guides[0])).toBe(true);
    expect(r.guideTexts?.['enerji-sarj-yollari']).toContain('powerbank');
    // Planlama sorusu "önce 112'yi arayın" bandını açmamalı
    expect(r.critical).toBe(false);
  });

  it.each([
    ['telefonumun şarjı bitti ne yapayım', 'enerji-sarj-yollari'],
    ['powerbank kaç kere şarj eder', 'enerji-powerbank'],
    ['jeneratörden şarj', 'enerji-jenerator'],
    ['aküden usb şarj yapmak', 'enerji-ky-aku-usb'],
    ['bisiklet dinamosu', 'enerji-ky-bisiklet'],
    ['limonla şarj', 'enerji-ky-efsaneler'],
  ])('Fener: "%s" → %s', async (q, id) => {
    const r = await retrieve(q, { deps });
    expect(r.topGuideId).toBe(id);
    expect(isRelevantGuide(r.guides[0])).toBe(true);
  });
});
