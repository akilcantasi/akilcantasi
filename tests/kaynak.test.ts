import { beforeEach, describe, expect, it } from 'vitest';
import { compareExpiry, daysUntil, expiryStatus, expiryText, formatDateTR, parseDate } from '../src/tools/_kaynak/expiry';
import { calculate, drinkPerDay, kcalPerDay, sanitizeInput, totalWaterPerDay, WATER, KCAL, FOOD_MIX, type HesapInput } from '../src/tools/_kaynak/hesap';
import { addCustom, alerts, defaultCanta, normalizeCanta, progress, removeCustom, resetChecks, setExpiry, toggleItem, viewItems } from '../src/tools/_kaynak/canta';
import { DEFAULT_ITEMS, GROUPS, itemsFor } from '../src/tools/_kaynak/canta-data';
import { coverage, exportText, foodKcal, normalizeItem, remove, search, sortItems, upsert, waterLitres, DEFAULT_KCAL100, type StokItem } from '../src/tools/_kaynak/stok';
import { addSample, estimate, formatMinutes, slope, MIN_SPAN_MS, type Sample } from '../src/tools/_kaynak/battery';
import { getExpiringSoon } from '../src/tools/_kaynak';
import { _resetMem, KEYS, loadJSON, saveJSON } from '../src/tools/_kaynak/storage';

const NOW = new Date(2026, 10, 1, 15, 30); // 1 Kasım 2026, 15:30 yerel
const H = (p: Partial<HesapInput>): HesapInput => sanitizeInput({ adults: 0, children: 0, babies: 0, elderly: 0, pets: 0, days: 3, climate: 'normal', ...p });

describe('son kullanma', () => {
  it('tarih ayrıştırma ve geçersiz tarih', () => {
    expect(parseDate('2026-11-01')?.getDate()).toBe(1);
    expect(parseDate('2026-02-30')).toBeNull();
    expect(parseDate('01.11.2026')).toBeNull();
    expect(parseDate('')).toBeNull();
  });
  it('kalan gün saatten bağımsız', () => {
    expect(daysUntil('2026-11-01', NOW)).toBe(0);
    expect(daysUntil('2026-11-02', NOW)).toBe(1);
    expect(daysUntil('2026-10-31', NOW)).toBe(-1);
    expect(daysUntil('2026-12-01', NOW)).toBe(30);
    expect(daysUntil('2027-11-01', NOW)).toBe(365);
    expect(daysUntil(undefined, NOW)).toBeNull();
  });
  it('durum: bugün geçerli, dün geçmiş, 30 gün yaklaşan', () => {
    expect(expiryStatus('2026-11-01', NOW)).toBe('soon');
    expect(expiryStatus('2026-10-31', NOW)).toBe('expired');
    expect(expiryStatus('2026-12-01', NOW)).toBe('soon');
    expect(expiryStatus('2026-12-02', NOW)).toBe('ok');
    expect(expiryStatus('', NOW)).toBe('none');
    expect(expiryStatus('2026-11-05', NOW, 3)).toBe('ok');
  });
  it('metinler', () => {
    expect(expiryText('2026-11-01', NOW)).toBe('bugün son gün');
    expect(expiryText('2026-11-02', NOW)).toBe('yarın son gün');
    expect(expiryText('2026-10-31', NOW)).toBe('dün geçti');
    expect(expiryText('2026-10-20', NOW)).toBe('12 gün önce geçti');
    expect(expiryText('2026-11-11', NOW)).toBe('10 gün kaldı');
    expect(formatDateTR('2026-03-07')).toBe('07.03.2026');
  });
  it('sıralama: tarihsizler sonda', () => {
    const a = [undefined, '2027-01-01', '2026-05-01'].sort(compareExpiry);
    expect(a).toEqual(['2026-05-01', '2027-01-01', undefined]);
  });
});

describe('su ve yiyecek hesabı', () => {
  it('kişi başı değerler kaynaklarla tutarlı ve temkinli', () => {
    // Sphere: içme 2,5–3 L; hijyen 2–6 L. Ready.gov/FEMA: toplam ≥ 3,8 L.
    expect(WATER.drinkAdult).toBeGreaterThanOrEqual(3);
    expect(WATER.drinkAdult + WATER.hygiene).toBeGreaterThan(3.78);
    expect(KCAL.adult).toBe(2100);
    expect(FOOD_MIX.reduce((s, f) => s + f.share, 0)).toBeCloseTo(1, 6);
  });
  it('2 yetişkin, 3 gün, normal iklim', () => {
    const r = calculate(H({ adults: 2 }));
    expect(r.drinkPerDay).toBe(6);
    expect(r.hygienePerDay).toBe(4);
    expect(r.totalPerDay).toBe(10);
    expect(r.drinkTotal).toBe(18);
    expect(r.total).toBe(30);
    expect(r.bottles15).toBe(20);
    expect(r.damacana19).toBe(2);
    expect(r.kcalPerDay).toBe(4200);
    expect(r.kcalTotal).toBe(12600);
    expect(r.warnings).toEqual([]);
  });
  it('sıcak iklim içme ve hayvan suyunu ×1,5 yapar, hijyeni değiştirmez', () => {
    const r = calculate(H({ adults: 1, pets: 1, climate: 'sicak', days: 1 }));
    expect(r.drinkPerDay).toBe(4.5);
    expect(r.hygienePerDay).toBe(2);
    expect(r.petPerDay).toBe(5.7);
    expect(r.totalPerDay).toBe(12.2);
  });
  it('bebek: 1 L mama suyu + hijyen, kalori yok, not var', () => {
    const r = calculate(H({ babies: 1, days: 1 }));
    expect(r.drinkPerDay).toBe(1);
    expect(r.totalPerDay).toBe(3);
    expect(r.kcalTotal).toBe(0);
    expect(r.food.every((f) => f.grams === 0)).toBe(true);
    expect(r.babyNote).toBe(true);
  });
  it('bebekte sıcak çarpanı uygulanmaz', () => {
    expect(drinkPerDay(H({ babies: 2, climate: 'sicak' }))).toBe(2);
  });
  it('karma hane', () => {
    const inp = H({ adults: 2, children: 2, elderly: 1, babies: 1, pets: 1, days: 7 });
    expect(drinkPerDay(inp)).toBe(16);
    expect(totalWaterPerDay(inp)).toBeCloseTo(16 + 12 + 3.8, 6);
    expect(kcalPerDay(inp)).toBe(5 * 2100);
    const r = calculate(inp);
    expect(r.total).toBe(222.6);
    expect(r.bottles15).toBe(149);
    expect(r.petFoodNote).toBe(true);
  });
  it('gıda önerisi 50 g\'a yukarı yuvarlanır ve kaloriyi karşılar', () => {
    const r = calculate(H({ adults: 1, days: 3 }));
    const kcal = r.food.reduce((s, f) => s + (f.grams * f.kcal100) / 100, 0);
    expect(kcal).toBeGreaterThanOrEqual(r.kcalTotal);
    expect(r.food.every((f) => f.grams % 50 === 0)).toBe(true);
    // konserve: 6300*0.2/1.2 = 1050 g; kraker: 6300*0.25/4.3 = 366 → 400 g
    expect(r.food.find((f) => f.id === 'konserve')!.grams).toBe(1050);
    expect(r.food.find((f) => f.id === 'kraker')!.grams).toBe(400);
  });
  it('girdi temizleme', () => {
    const s = sanitizeInput({ adults: -3, children: 2.7, days: 0, climate: 'x' as any, pets: NaN });
    expect(s).toEqual({ adults: 0, children: 2, babies: 0, elderly: 0, pets: 0, days: 1, climate: 'normal' });
    expect(sanitizeInput({ days: 9999 }).days).toBe(365);
    expect(calculate(H({})).warnings[0]).toMatch(/En az bir kişi/);
    expect(calculate(H({ adults: 1, days: 30 })).warnings.length).toBe(1);
  });
});

describe('afet çantası', () => {
  it('liste: benzersiz kimlik, geçerli grup', () => {
    const ids = DEFAULT_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const g = new Set(GROUPS.map((x) => x.id));
    expect(DEFAULT_ITEMS.every((i) => g.has(i.group))).toBe(true);
  });
  it('AFAD listesindeki temel öğeler ev çantasında', () => {
    const names = itemsFor('ev', {}).map((i) => i.id);
    for (const id of ['su', 'ilkyardim', 'duduk', 'fener', 'radyo', 'pil', 'battaniye', 'kimlik', 'dask', 'sabun', 'ped', 'caki']) expect(names).toContain(id);
  });
  it('profil ve seçeneklere göre süzme', () => {
    expect(itemsFor('arac', {}).some((i) => i.id === 'halat')).toBe(true);
    expect(itemsFor('ev', {}).some((i) => i.id === 'halat')).toBe(false);
    expect(itemsFor('is', {}).some((i) => i.id === 'tapu')).toBe(false);
    expect(itemsFor('ev', {}).some((i) => i.group === 'bebek')).toBe(false);
    expect(itemsFor('ev', { bebek: true }).some((i) => i.group === 'bebek')).toBe(true);
  });
  it('işaretleme, ilerleme, profil ayrımı', () => {
    let s = defaultCanta();
    const total = viewItems(s, 'ev', NOW).length;
    s = toggleItem(s, 'su');
    s = toggleItem(s, 'fener');
    expect(progress(viewItems(s, 'ev', NOW))).toEqual({ done: 2, total, pct: Math.round((2 / total) * 100) });
    expect(progress(viewItems(s, 'arac', NOW)).done).toBe(0);
    s = toggleItem(s, 'su');
    expect(progress(viewItems(s, 'ev', NOW)).done).toBe(1);
    s = resetChecks(s);
    expect(progress(viewItems(s, 'ev', NOW)).done).toBe(0);
    expect(progress([])).toEqual({ done: 0, total: 0, pct: 0 });
  });
  it('özel öğe ekle / sil, tarih ve uyarılar', () => {
    let s = defaultCanta();
    s = addCustom(s, '  Yedek anahtar  ', 'aletler');
    s = addCustom(s, '   ', 'aletler');
    const c = s.profiles.ev.custom;
    expect(c.length).toBe(1);
    expect(c[0].name).toBe('Yedek anahtar');
    s = setExpiry(s, c[0].id, '2026-10-01');
    s = setExpiry(s, 'su', '2026-11-20');
    s = setExpiry(s, 'pil', '2028-01-01');
    s = toggleItem(s, c[0].id);
    const al = alerts(viewItems(s, 'ev', NOW));
    expect(al.map((a) => a.id)).toEqual([c[0].id, 'su']);
    expect(al[0].status).toBe('expired');
    s = setExpiry(s, 'su', '');
    expect(s.profiles.ev.expiry.su).toBeUndefined();
    s = removeCustom(s, c[0].id);
    expect(s.profiles.ev.custom.length).toBe(0);
    expect(s.profiles.ev.checked[c[0].id]).toBeUndefined();
    expect(s.profiles.ev.expiry[c[0].id]).toBeUndefined();
  });
  it('gizli seçenek grubundaki özel öğe sayılmaz', () => {
    let s = addCustom(defaultCanta(), 'Mama kabı', 'evcil');
    expect(viewItems(s, 'ev', NOW).some((i) => i.name === 'Mama kabı')).toBe(false);
    s = { ...s, opts: { ...s.opts, evcil: true } };
    expect(viewItems(s, 'ev', NOW).some((i) => i.name === 'Mama kabı')).toBe(true);
  });
  it('bozuk kayıt güvenle normalleşir', () => {
    expect(normalizeCanta(null).profile).toBe('ev');
    const n = normalizeCanta({ profile: 'arac', opts: { bebek: 1 }, profiles: { ev: { checked: { su: true }, custom: [{ id: 'x', name: 'A', group: 'yok' }, { bad: 1 }] } } });
    expect(n.profile).toBe('arac');
    expect(n.opts.bebek).toBe(true);
    expect(n.profiles.ev.checked.su).toBe(true);
    expect(n.profiles.ev.custom).toEqual([{ id: 'x', name: 'A', group: 'aletler' }]);
    expect(n.profiles.is.checked).toEqual({});
  });
});

const S = (p: Partial<StokItem>): StokItem => normalizeItem({ id: p.name, qty: 1, unit: 'adet', kind: 'diger', ...p })!;

describe('stok', () => {
  it('normalize', () => {
    expect(normalizeItem({ name: '' })).toBeNull();
    const i = normalizeItem({ name: ' Su ', qty: -2, unit: 'x', kind: 'su', kcal: 'a', location: '  ' })!;
    expect(i).toMatchObject({ name: 'Su', qty: 0, unit: 'adet', kind: 'su' });
    expect(i.location).toBeUndefined();
    expect(i.kcal).toBeUndefined();
  });
  it('litre ve kalori dönüşümleri', () => {
    expect(waterLitres(S({ name: 'a', kind: 'su', qty: 5, unit: 'L' }))).toBe(5);
    expect(waterLitres(S({ name: 'a', kind: 'su', qty: 500, unit: 'ml' }))).toBe(0.5);
    expect(waterLitres(S({ name: 'a', kind: 'su', qty: 6, unit: 'adet', litrePer: 1.5 }))).toBe(9);
    expect(waterLitres(S({ name: 'a', kind: 'su', qty: 6, unit: 'adet' }))).toBeNull();
    expect(waterLitres(S({ name: 'a', kind: 'gida', qty: 6, unit: 'L' }))).toBeNull();
    expect(foodKcal(S({ name: 'a', kind: 'gida', qty: 1, unit: 'kg', kcal: 350 }))).toEqual({ kcal: 3500, assumed: false });
    expect(foodKcal(S({ name: 'a', kind: 'gida', qty: 400, unit: 'g' }))).toEqual({ kcal: 4 * DEFAULT_KCAL100, assumed: true });
    expect(foodKcal(S({ name: 'a', kind: 'gida', qty: 3, unit: 'kutu', kcal: 250 }))).toEqual({ kcal: 750, assumed: false });
    expect(foodKcal(S({ name: 'a', kind: 'gida', qty: 3, unit: 'kutu' }))).toBeNull();
  });
  it('kaç gün yeter (hesap değerleriyle)', () => {
    const items = [
      S({ name: 'Damacana', kind: 'su', qty: 2, unit: 'adet', litrePer: 19 }),
      S({ name: 'Pet şişe', kind: 'su', qty: 4, unit: 'L' }),
      S({ name: 'Eski su', kind: 'su', qty: 100, unit: 'L', expiry: '2026-01-01' }),
      S({ name: 'Makarna', kind: 'gida', qty: 2, unit: 'kg', kcal: 350 }),
      S({ name: 'Konserve', kind: 'gida', qty: 6, unit: 'kutu', kcal: 300 }),
      S({ name: 'Bisküvi', kind: 'gida', qty: 3, unit: 'paket' }),
      S({ name: 'Pil', kind: 'diger', qty: 8 }),
    ];
    const c = coverage(items, H({ adults: 2 }), NOW);
    expect(c.waterL).toBe(42);
    expect(c.waterDrinkDays).toBe(7); // 42 / 6
    expect(c.waterTotalDays).toBe(4.2); // 42 / 10
    expect(c.kcal).toBe(8800);
    expect(c.foodDays).toBe(2); // 8800/4200 = 2.095 → 2.0 (aşağı yuvarlama)
    expect(c.skipped).toEqual(['Bisküvi']);
    expect(c.expiredSkipped).toEqual(['Eski su']);
    expect(c.assumedKcal).toBe(false);
    expect(coverage(items, H({}), NOW).waterDrinkDays).toBeNull();
  });
  it('arama Türkçe karakterden bağımsız, sıralama', () => {
    const items = [S({ name: 'Şeker', location: 'Kiler', expiry: '2027-01-01' }), S({ name: 'Ilık su', expiry: '2026-12-01' }), S({ name: 'İlaç', location: 'Banyo' })];
    expect(search(items, 'seker').map((i) => i.name)).toEqual(['Şeker']);
    expect(search(items, 'ILIK').map((i) => i.name)).toEqual(['Ilık su']);
    expect(search(items, 'ilac').map((i) => i.name)).toEqual(['İlaç']);
    expect(search(items, 'kiler').length).toBe(1);
    expect(search(items, '  ').length).toBe(3);
    expect(sortItems(items, 'expiry').map((i) => i.name)).toEqual(['Ilık su', 'Şeker', 'İlaç']);
    expect(sortItems(items, 'location').map((i) => i.name)).toEqual(['İlaç', 'Şeker', 'Ilık su']);
  });
  it('ekle, düzenle, sil', () => {
    let l: StokItem[] = [];
    l = upsert(l, S({ name: 'A' }));
    l = upsert(l, { ...l[0], qty: 5 });
    expect(l.length).toBe(1);
    expect(l[0].qty).toBe(5);
    l = remove(l, l[0].id);
    expect(l).toEqual([]);
  });
  it('metin dışa aktarma', () => {
    const items = [S({ name: 'Su', kind: 'su', qty: 10, unit: 'L', location: 'Kiler', expiry: '2026-10-01' }), S({ name: 'Fener', qty: 2 })];
    const t = exportText(items, coverage(items, H({ adults: 1 }), NOW), NOW);
    expect(t).toContain('Stok listesi (01.11.2026)');
    expect(t).toContain('- Su: 10 L · yer: Kiler · SKT: 01.10.2026 (GEÇMİŞ)');
    expect(t).toContain('DİĞER\n- Fener: 2 adet');
    expect(exportText([], undefined, NOW)).toContain('(liste boş)');
  });
});

describe('pil tahmini', () => {
  const m = 60000;
  it('eğim ve kalan süre ölçümden', () => {
    // 10 dakikada %80 → %75: dakikada %0,5 → %75 için 150 dk
    let s: Sample[] = [];
    for (let i = 0; i <= 10; i++) s = addSample(s, { t: i * m, level: 0.8 - i * 0.005, charging: false });
    expect(slope(s)! * m).toBeCloseTo(-0.005, 8);
    const e = estimate(s);
    expect(e.basis).toBe('olcum');
    expect(e.minutes).toBe(150);
    expect(e.ratePctPerHour).toBe(30);
    expect(formatMinutes(150)).toBe('2 sa 30 dk');
  });
  it('yetersiz ölçümde sistem değerine düşer', () => {
    const s = [{ t: 0, level: 0.5, charging: false }, { t: 60000, level: 0.5, charging: false }];
    expect(estimate(s, { dischargingTime: 7200 })).toMatchObject({ minutes: 120, basis: 'sistem', waiting: true });
    expect(estimate(s, { dischargingTime: Infinity })).toMatchObject({ minutes: null, basis: 'yok' });
    expect(estimate([])).toMatchObject({ basis: 'yok' });
  });
  it('şarja takılınca veya seviye artınca oturum sıfırlanır', () => {
    let s: Sample[] = [{ t: 0, level: 0.8, charging: false }, { t: MIN_SPAN_MS, level: 0.7, charging: false }];
    expect(addSample(s, { t: MIN_SPAN_MS + m, level: 0.7, charging: true }).length).toBe(1);
    expect(addSample(s, { t: MIN_SPAN_MS + m, level: 0.75, charging: false }).length).toBe(1);
    // aynı seviye 1 dk içinde tekrar eklenmez
    expect(addSample(s, { t: MIN_SPAN_MS + 1000, level: 0.7, charging: false })).toBe(s);
    expect(estimate([{ t: 0, level: 0.4, charging: true }], { chargingTime: 1800 })).toMatchObject({ minutes: 30, basis: 'sistem' });
  });
  it('süre biçimi', () => {
    expect(formatMinutes(null)).toBe('—');
    expect(formatMinutes(45)).toBe('45 dk');
    expect(formatMinutes(120)).toBe('2 sa');
    expect(formatMinutes(60 * 72)).toBe('3 gün');
  });
});

describe('getExpiringSoon', () => {
  beforeEach(() => _resetMem());
  it('çanta (tüm profiller) ve stoktan, en acil önce', () => {
    let c = defaultCanta();
    c = setExpiry(c, 'su', '2026-11-10', 'ev');
    c = setExpiry(c, 'ilkyardim', '2026-10-25', 'arac');
    c = setExpiry(c, 'pil', '2027-06-01', 'is');
    c = addCustom(c, 'Krem', 'hijyen', 'is');
    c = setExpiry(c, c.profiles.is.custom[0].id, '2026-11-20', 'is');
    c = setExpiry(c, 'bilinmeyen', '2026-11-02', 'ev');
    const stok = [S({ name: 'Ton balığı', expiry: '2026-11-03' }), S({ name: 'Pirinç', expiry: '2027-11-03' }), S({ name: 'Tuz' })];
    const r = getExpiringSoon(30, NOW, { canta: c, stok });
    expect(r.map((x) => x.name)).toEqual(['İlk yardım çantası', 'Ton balığı', 'İçme suyu', 'Krem']);
    expect(r[0]).toMatchObject({ source: 'canta', profile: 'arac', where: 'Araç çantası', expired: true, daysLeft: -7 });
    expect(r[1]).toMatchObject({ source: 'stok', where: 'Stok', daysLeft: 2 });
    expect(getExpiringSoon(5, NOW, { canta: c, stok }).length).toBe(2);
  });
  it('kayıtlı veriden okur', () => {
    saveJSON(KEYS.canta, setExpiry(defaultCanta(), 'su', '2026-11-05'));
    saveJSON(KEYS.stok, []);
    expect(getExpiringSoon(30, NOW).map((x) => x.id)).toEqual(['su']);
    expect(loadJSON(KEYS.stok, null)).toEqual([]);
  });
});
