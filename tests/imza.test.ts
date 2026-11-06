// İmzalı pano kayıtları: kanonik biçim, imzalama/doğrulama, kurcalama, eski kayıtlar.
import { describe, expect, it } from 'vitest';
import * as ed from '@noble/ed25519';
import { b64uCoz, b64uKodla, imzaAlanlari, kanonikDurum, kanonikIlan } from '../server/imza-kanonik.mjs';
import { durumImzasiGecerli, ilanImzasiGecerli, validateBoardItem } from '../server/server.mjs';
import { fromServer, mergeItems, validateDraft, type BoardDraft, type BoardItem } from '../src/iletisim/board';
import { bnPinle, bnSabitMi, dogrula, dogrulaAsync, dogrulamaSonucu, durumImzala, ilanImzala, kimlik, kimligiUnut, IMZA_KEYS } from '../src/iletisim/imza';
import { BoardCache, Outbox, memoryKV } from '../src/iletisim/outbox';

const T = 1767225600000; // 2026-01-01
const gizli = (n: number) => new Uint8Array(32).fill(n);
const kim = (n: number) => ({ gizli: gizli(n), pub: b64uKodla(ed.getPublicKey(gizli(n))) });
const A = kim(1);
const B = kim(2);

function taslak(o: Partial<BoardDraft> = {}): BoardDraft {
  const v = validateDraft({ id: 'ilan-000001', kind: 'kayip', from: 'Ayşe', text: 'Ad: Mehmet\nYaş: 72', status: 'araniyor', ...o });
  if (!v.ok) throw new Error(v.error);
  return v.item;
}
const kayit = (d: BoardDraft, o: Partial<BoardItem> = {}): BoardItem => ({ ...d, time: T + 5, rev: T + 5, ...o });

describe('kanonik biçim', () => {
  it('sabit sıralı JSON dizisi; isteğe bağlı alanlar null', () => {
    expect(kanonikIlan({ id: 'x', kind: 'mesaj', from: 'Ayşe', text: 'a"b\nc', ts: 5, pub: 'P' })).toBe(
      '["akil-ilan-1","x","mesaj","Ayşe","a\\"b\\nc","",null,null,5,"P"]',
    );
    expect(kanonikIlan({ id: 'x', kind: 'iyiyim', from: 'A', text: '', status: 'yarali', lat: 39.9208, lon: 32.8541, ts: 5, pub: 'P' })).toBe(
      '["akil-ilan-1","x","iyiyim","A","","yarali",39.9208,32.8541,5,"P"]',
    );
    // Kayıp ilanının durumu imzaya girmez (ayrı, imzalı güncellemeyle değişir)
    const k = { id: 'x', kind: 'kayip', from: 'A', text: 't', ts: 5, pub: 'P' };
    expect(kanonikIlan({ ...k, status: 'araniyor' })).toBe(kanonikIlan({ ...k, status: 'bulundu' }));
    expect(kanonikDurum('ilan-1', 'bulundu', 7, 'P')).toBe('["akil-durum-1","ilan-1","bulundu",7,"P"]');
  });

  it('base64url gidiş-dönüş', () => {
    for (const n of [0, 1, 2, 3, 31, 32, 64]) {
      const b = new Uint8Array(n).map((_, i) => (i * 37 + n) & 255);
      expect(Buffer.from(b).toString('base64url')).toBe(b64uKodla(b));
      expect([...(b64uCoz(b64uKodla(b)) ?? [])]).toEqual([...b]);
    }
    expect(b64uCoz('ab=c')).toBeNull();
  });

  it('imza alanı biçim denetimi', () => {
    const d = ilanImzala(taslak(), T, A);
    expect(imzaAlanlari(d, 'kayip')).toEqual({ ok: true, f: { pub: d.pub, sig: d.sig, ts: T } });
    expect(imzaAlanlari({}, 'mesaj')).toEqual({ ok: true, f: null });
    expect(imzaAlanlari({ ...d, sig: 'kisa' }, 'kayip').ok).toBe(false);
    expect(imzaAlanlari({ ...d, ts: 12 }, 'kayip').ok).toBe(false);
    expect(imzaAlanlari({ ...d, upd: { st: 'bulundu', ts: T, sig: d.sig } }, 'mesaj').ok).toBe(false);
    expect(validateDraft({ ...d, pub: 'x'.repeat(44) }).ok).toBe(false);
  });
});

describe('imzalama ve doğrulama', () => {
  it('istemcinin imzasını sunucu (Node crypto) da doğrular', () => {
    const d = ilanImzala(taslak({ lat: 39.9208, lon: 32.8541 }), T, A);
    expect(d.pub).toBe(A.pub);
    expect(d.sig).toMatch(/^[A-Za-z0-9_-]{86}$/);
    expect(dogrula(kayit(d))).toMatchObject({ ilan: 'gecerli', durum: 'yok', status: 'araniyor' });
    const v = validateBoardItem(d);
    expect(v.ok && ilanImzasiGecerli(v.item)).toBe(true);
    const upd = durumImzala(d, 'bulundu', T + 10, A)!;
    expect(durumImzasiGecerli(d, upd)).toBe(true);
    expect(dogrula(kayit({ ...d, status: 'bulundu', upd }))).toMatchObject({ ilan: 'gecerli', durum: 'gecerli', status: 'bulundu' });
  });

  it('kurcalama: metin, ad, konum, tür, anahtar değişince imza tutmaz', () => {
    const d = ilanImzala(taslak({ kind: 'mesaj', status: undefined, text: 'Okul bahçesinde su var' }), T, A);
    expect(dogrula(kayit(d)).ilan).toBe('gecerli');
    for (const bozuk of [{ text: 'Okul bahçesinde su yok' }, { from: 'Mehmet' }, { lat: 39.92, lon: 32.85 }, { kind: 'duyuru' as const }, { ts: T + 1 }, { pub: B.pub }])
      expect(dogrula(kayit({ ...d, ...bozuk })).ilan).toBe('gecersiz');
  });

  it('başka anahtarın durum güncellemesi ve güncellemesiz "bulundu" geçersiz', () => {
    const d = ilanImzala(taslak(), T, A);
    // B, A'nın ilanını güncelleyemez
    expect(durumImzala(d, 'bulundu', T + 10, B)).toBeNull();
    // B kendi anahtarıyla elle imzalasa da tutmaz
    const sahte = { st: 'bulundu' as const, ts: T + 10, sig: b64uKodla(ed.sign(new TextEncoder().encode(kanonikDurum(d.id, 'bulundu', T + 10, d.pub!)), B.gizli)) };
    expect(durumImzasiGecerli(d, sahte)).toBe(false);
    expect(dogrula(kayit({ ...d, status: 'bulundu', upd: sahte }))).toMatchObject({ durum: 'gecersiz', status: 'araniyor' });
    // İmzalı ilan güncellemesiz "bulundu" gösterilmez
    expect(dogrula(kayit({ ...d, status: 'bulundu' }))).toMatchObject({ durum: 'gecersiz', status: 'araniyor' });
    // Güncelleme başka ilana taşınamaz
    const upd = durumImzala(d, 'bulundu', T + 10, A)!;
    const d2 = ilanImzala(taslak({ id: 'ilan-000002' }), T, A);
    expect(dogrula(kayit({ ...d2, status: 'bulundu', upd })).durum).toBe('gecersiz');
  });

  it('durum zamanı her güncellemede artar (eski güncelleme yenisinin yerine geçemez)', () => {
    const d = ilanImzala(taslak(), T, A);
    const u1 = durumImzala(d, 'bulundu', T + 10, A)!;
    const u2 = durumImzala({ ...d, upd: u1 }, 'araniyor', T + 5, A)!; // saat geri gitse de
    expect(u2.ts).toBeGreaterThan(u1.ts);
    const yeni = kayit({ ...d, status: 'araniyor', upd: u2 }, { rev: T + 9 });
    const eski = kayit({ ...d, status: 'bulundu', upd: u1 }, { rev: T + 20 });
    expect(mergeItems([yeni], [eski])[0].upd).toEqual(u2);
  });

  it('kanonik biçim temizlenmiş metin üzerinedir: sunucunun temizliğinden sonra da tutar', () => {
    const v = validateDraft({ id: 'ilan-000003', kind: 'mesaj', from: '  Ayşe  ', text: 'Su​  dağıtımı \r\n\r\n\r\nvar ' });
    const d = ilanImzala(v.ok ? v.item : (null as any), T, A);
    const s = validateBoardItem(d);
    expect(s.ok && ilanImzasiGecerli(s.item)).toBe(true);
  });
});

describe('eski kayıtlar ve önbellek', () => {
  it('imzasız board.json / giden kutusu kayıtları yüklenir ve "imzasız" sayılır', () => {
    const kv = memoryKV();
    kv.setItem('ac.comm.outbox', JSON.stringify([{ draft: { id: 'eski-0001', kind: 'kayip', from: 'Ayşe', text: 'Ad: Mehmet', status: 'araniyor' }, created: T, tries: 0 }]));
    kv.setItem('ac.comm.cache', JSON.stringify({ items: [{ id: 'eski-0002', kind: 'mesaj', from: 'Ali', text: 'Merhaba', time: T, rev: T, local: true }], since: T, server: '' }));
    const ob = new Outbox(kv).list();
    const c = new BoardCache(kv).load().items;
    expect(ob).toHaveLength(1);
    expect(c).toHaveLength(1);
    expect(c[0].local).toBe(true);
    expect(dogrulamaSonucu(c[0])).toMatchObject({ ilan: 'imzasiz', bn: 'imzasiz' });
    expect(dogrulamaSonucu({ ...ob[0].draft, time: T, rev: T })).toMatchObject({ ilan: 'imzasiz', status: 'araniyor' });
  });

  it('imzalı kayıt önbellekten imzasıyla geri gelir', () => {
    const kv = memoryKV();
    const d = ilanImzala(taslak(), T, A);
    new BoardCache(kv).merge([kayit(d)], T, '');
    const it = new BoardCache(kv).load().items[0];
    expect(it.pub).toBe(A.pub);
    expect(dogrula(it).ilan).toBe('gecerli');
  });

  it('imzalı kaydın yerine imzasız ya da başka anahtarlı kopya geçmez', () => {
    const d = ilanImzala(taslak(), T, A);
    const imzali = kayit(d);
    const { pub, sig, ts, ...cip } = d;
    const imzasiz = kayit({ ...cip, status: 'bulundu' }, { rev: T + 99 });
    expect(mergeItems([imzali], [imzasiz])[0].pub).toBe(A.pub);
    const baska = kayit(ilanImzala(taslak(), T, B), { rev: T + 99 });
    expect(mergeItems([imzali], [baska])[0].pub).toBe(A.pub);
  });

  it('sunucudan gelen bozuk imza alanlı kayıt atılır', () => {
    const d = ilanImzala(taslak(), T, A);
    expect(fromServer({ ...kayit(d), sig: 'bozuk' })).toBeNull();
    expect(fromServer(kayit(d))?.sig).toBe(d.sig);
  });

  it('doğrulama kuyruğu: önce null (bekliyor), sonra önbellekten aynı sonuç', async () => {
    const d = ilanImzala(taslak({ id: 'kuyruk-0001' }), T, A);
    const it = kayit(d);
    expect(dogrulamaSonucu(it)).toBeNull();
    const r = await dogrulaAsync(it);
    expect(r.ilan).toBe('gecerli');
    expect(dogrulamaSonucu(it)).toBe(r);
    // Aynı kimlik, değiştirilmiş içerik: önbellekten "geçerli" dönmez
    const r2 = await dogrulaAsync({ ...it, text: 'başka' });
    expect(r2.ilan).toBe('gecersiz');
  });
});

describe('cihaz kimliği ve bilgi noktası sabitleme', () => {
  it('anahtar bir kez üretilir ve saklanır', () => {
    const kv = memoryKV();
    kimligiUnut();
    const k1 = kimlik(kv)!;
    kimligiUnut();
    const k2 = kimlik(kv)!;
    expect(k2.pub).toBe(k1.pub);
    expect(JSON.parse(kv.getItem(IMZA_KEYS.kimlik)!).pub).toBe(k1.pub);
    kimligiUnut();
  });

  it('depolama yazılamazsa oturumluk anahtarla çalışır', () => {
    kimligiUnut();
    const kv = { getItem: () => null, setItem: () => { throw new Error('kota'); }, removeItem: () => {} };
    expect(kimlik(kv)?.pub).toMatch(/^[A-Za-z0-9_-]{43}$/);
    kimligiUnut();
  });

  it('TOFU: ilk anahtar sabitlenir, farklısı bildirilir', () => {
    const kv = memoryKV();
    expect(bnPinle('http://192.168.43.1:8080', A.pub, kv)).toBe('yeni');
    expect(bnPinle('http://192.168.43.1:8080', A.pub, kv)).toBe('ayni');
    expect(bnPinle('http://192.168.43.1:8080', B.pub, kv)).toBe('farkli');
    expect(bnPinle('http://192.168.43.1:8080', 'bozuk', kv)).toBe('yok');
    expect(bnSabitMi(A.pub, kv)).toBe(true);
    expect(bnSabitMi(B.pub, kv)).toBe(false);
  });
});

describe('denetim düzeltmeleri: kimlik bağlama ve doğrulanamayan güncelleme', () => {
  it('imzalı ilanın kimliği anahtarın önekiyle başlar; öneksiz imzalı kayıt doğrulanmış sayılmaz', () => {
    const d = ilanImzala(taslak(), T, A);
    expect(d.id.startsWith(A.pub.slice(0, 10) + '-')).toBe(true);
    expect(dogrula(kayit(d)).ilan).toBe('gecerli');
    // Başka anahtarla, kurbanın kimliğiyle imzalanmış kopya (önek tutmaz)
    const v = validateDraft({ id: d.id, kind: 'kayip', from: 'X', text: 'sahte' });
    if (!v.ok) throw new Error(v.error);
    const { pub: _p, sig: _s, ts: _t, ...temel } = v.item;
    const sahte = { ...temel, pub: B.pub, ts: T } as BoardDraft;
    sahte.sig = Buffer.from(ed.sign(new TextEncoder().encode(kanonikIlan(sahte as any)), B.gizli)).toString('base64url');
    expect(dogrula(kayit(sahte)).ilan).toBe('gecersiz');
  });

  it('ileri tarihli sahte güncelleme sahibinin gerçek güncellemesini birleştirmede ezmez', () => {
    const d = ilanImzala(taslak(), T, A);
    const gercek = durumImzala(d, 'bulundu', T + 1000, A)!;
    const sahteUpd = { st: 'araniyor' as const, ts: T + 23 * 3600_000, sig: 'A'.repeat(86) };
    const sahteKayit = kayit({ ...d, status: 'araniyor', upd: sahteUpd }, { rev: T + 50 });
    const gercekKayit = kayit({ ...d, status: 'bulundu', upd: gercek }, { rev: T + 10 });
    const m1 = mergeItems([sahteKayit], [gercekKayit]);
    expect(m1[0].upd?.sig).toBe(gercek.sig);
    const m2 = mergeItems([gercekKayit], [sahteKayit]);
    expect(m2[0].upd?.sig).toBe(gercek.sig);
    expect(dogrula(m2[0]).status).toBe('bulundu');
  });
});
