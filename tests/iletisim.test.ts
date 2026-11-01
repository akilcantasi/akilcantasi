import { describe, expect, it } from 'vitest';
import { cleanText, fromMesh, mergeItems, missingToText, newId, parseMissing, toMeshText, validateDraft, type BoardItem } from '../src/iletisim/board';
import { BoardCache, Outbox, cleanPhone, loadProfile, memoryKV, normalizeServer, saveProfile } from '../src/iletisim/outbox';
import { looksLikeMorse, morseToSteps, morseToText, normalizeForMorse, stepsUnits, textToMorse, unitMs } from '../src/iletisim/morse';
import { buildTemplate, locativeIm, smsHref, smsParts } from '../src/iletisim/sms';
import { validateBoardItem } from '../server/server.mjs';

const item = (id: string, rev: number, extra: Partial<BoardItem> = {}): BoardItem => ({ id, kind: 'mesaj', from: 'A', text: 't', time: rev, rev, ...extra });

describe('kayıt doğrulama', () => {
  it('düz metin temizliği', () => {
    expect(cleanText('  a\u0000b\u0007c  ', 10)).toBe('abc');
    expect(cleanText('x‮y​z﻿', 10)).toBe('xyz');
    expect(cleanText('a\nb', 10)).toBe('a b');
    expect(cleanText('a\r\n\n\n\nb\t c', 20, true)).toBe('a\n\nb c');
    expect(cleanText('çğışöü'.repeat(3), 5)).toBe('çğışö');
    // vekil çiftleri bölünmez
    expect(cleanText('😀😀😀', 2)).toBe('😀😀');
  });

  it('geçerli kayıtlar ve varsayılan durumlar', () => {
    const a = validateDraft({ id: 'abcdef', kind: 'iyiyim', from: 'Ali', text: '' });
    expect(a).toEqual({ ok: true, item: { id: 'abcdef', kind: 'iyiyim', from: 'Ali', text: '', status: 'iyiyim' } });
    const k = validateDraft({ id: 'abcdef', kind: 'kayip', from: 'Ali', text: 'Ad: Veli' });
    expect(k.ok && k.item.status).toBe('araniyor');
    const l = validateDraft({ id: 'abcdef', kind: 'mesaj', from: 'Ali', text: 'x', lat: '40.1234567', lon: 29 });
    expect(l.ok && [l.item.lat, l.item.lon]).toEqual([40.12346, 29]);
  });

  it('geçersizleri reddeder', () => {
    for (const bad of [
      null,
      'metin',
      [],
      { id: 'kısa', kind: 'mesaj', from: 'A', text: 't' },
      { id: 'abc def', kind: 'mesaj', from: 'A', text: 't' },
      { id: 'abcdef', kind: 'sos', from: 'A', text: 't' },
      { id: 'abcdef', kind: 'mesaj', from: '\u0007', text: 't' },
      { id: 'abcdef', kind: 'duyuru', from: 'A', text: '   ' },
      { id: 'abcdef', kind: 'iyiyim', from: 'A', text: '', status: 'araniyor' },
      { id: 'abcdef', kind: 'kayip', from: 'A', text: 't', status: 'yarali' },
      { id: 'abcdef', kind: 'mesaj', from: 'A', text: 't', lat: 91, lon: 0 },
      { id: 'abcdef', kind: 'mesaj', from: 'A', text: 't', lat: 1 },
      { id: 'abcdef', kind: 'mesaj', from: 'A', text: 't', status: 'iyiyim' },
    ]) {
      expect(validateDraft(bad).ok, JSON.stringify(bad)).toBe(false);
    }
  });

  it('istemci ve sunucu doğrulaması aynı sonucu verir', () => {
    const cases: any[] = [
      { id: 'abcdef', kind: 'mesaj', from: ' Ayşe ', text: 'Selam‮\r\nnasılsın', lat: 39.92, lon: 32.854123 },
      { id: 'abcdef', kind: 'iyiyim', from: 'B', text: '', status: 'yarali' },
      { id: 'abcdef', kind: 'kayip', from: 'B', text: 'x', status: 'bulundu' },
      { id: 'abcdef', kind: 'duyuru', from: 'B'.repeat(99), text: 'ş'.repeat(999) },
      { id: 'abc', kind: 'mesaj', from: 'B', text: 'x' },
      { id: 'abcdef', kind: 'mesaj', from: 'B', text: 'x', lat: 'a', lon: 2 },
    ];
    for (const c of cases) expect(validateBoardItem(c)).toEqual(validateDraft(c));
  });

  it('kimlik biçimi', () => {
    const ids = new Set(Array.from({ length: 200 }, () => newId()));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(validateDraft({ id, kind: 'mesaj', from: 'a', text: 'b' }).ok).toBe(true);
  });

  it('kayıp ilanı alanları', () => {
    const t = missingToText({ name: 'Ali Kaya', age: '7', desc: 'Kırmızı mont', lastSeen: 'Okul önü, 14.00' });
    expect(t).toBe('Ad: Ali Kaya\nYaş: 7\nTarif: Kırmızı mont\nSon görülme: Okul önü, 14.00');
    expect(parseMissing(t)).toEqual({ name: 'Ali Kaya', age: '7', desc: 'Kırmızı mont', lastSeen: 'Okul önü, 14.00' });
    expect(parseMissing('serbest metin').desc).toBe('serbest metin');
  });

  it('mesh dönüşümü durumu korur', () => {
    const d = { id: 'abcdef', kind: 'iyiyim' as const, from: 'A', text: 'evdeyim', status: 'yardim' as const };
    const m = fromMesh({ ...d, text: toMeshText(d), time: 5 });
    expect(m).toMatchObject({ id: 'abcdef', kind: 'iyiyim', status: 'yardim', text: 'evdeyim', viaMesh: true, rev: 5 });
    expect(fromMesh({ id: 'abcdefg', kind: 'sos', from: 'B', text: '', time: 1 })).toMatchObject({ kind: 'iyiyim', status: 'yardim' });
    expect(fromMesh({ id: 'x', kind: 'mesaj', from: 'B', text: 'y', time: 1 })).toBeNull();
  });
});

describe('birleştirme ve tekilleştirme', () => {
  it('aynı kimlikte yüksek rev kazanır, sıralama yeniden eskiye', () => {
    const a = [item('aaaaaa', 1), item('bbbbbb', 3)];
    const b = [item('aaaaaa', 5, { kind: 'kayip', status: 'bulundu', time: 1 }), item('cccccc', 2)];
    const m = mergeItems(a, b);
    expect(m.map((i) => i.id)).toEqual(['bbbbbb', 'cccccc', 'aaaaaa']);
    expect(m.find((i) => i.id === 'aaaaaa')!.status).toBe('bulundu');
  });
  it('sunucudan gelen kopya bekleyenin yerini alır', () => {
    const m = mergeItems([item('aaaaaa', 0, { pending: true, time: 9 })], [item('aaaaaa', 10)]);
    expect(m).toHaveLength(1);
    expect(m[0].pending).toBeFalsy();
  });
});

describe('giden kutusu', () => {
  const d = (id: string) => ({ id, kind: 'mesaj' as const, from: 'A', text: id });

  it('ekler, aynı kimliği tekilleştirir, kalıcıdır', () => {
    const kv = memoryKV();
    const ob = new Outbox(kv);
    ob.add(d('aaaaaa'), 1);
    ob.add(d('bbbbbb'), 2);
    ob.add({ ...d('aaaaaa'), text: 'yeni' }, 3);
    expect(ob.size()).toBe(2);
    const again = new Outbox(kv);
    expect(again.list().map((e) => [e.draft.id, e.draft.text, e.created])).toEqual([
      ['aaaaaa', 'yeni', 1],
      ['bbbbbb', 'bbbbbb', 2],
    ]);
    expect(again.asItems().every((i) => i.pending)).toBe(true);
  });

  it('gönderir; ağ hatasında durur ve sırayı korur', async () => {
    const ob = new Outbox(memoryKV());
    ['aaaaaa', 'bbbbbb', 'cccccc', 'dddddd'].forEach((id) => ob.add(d(id)));
    const seen: string[] = [];
    const r = await ob.flush(async (x) => {
      seen.push(x.id);
      if (x.id === 'bbbbbb') return { result: 'reject', error: 'geçersiz' };
      if (x.id === 'cccccc') return { result: 'retry', error: 'bağlantı yok' };
      return { result: 'ok' };
    });
    expect(seen).toEqual(['aaaaaa', 'bbbbbb', 'cccccc']);
    expect(r).toMatchObject({ sent: 1, rejected: 1, left: 2 });
    expect(ob.list().map((e) => e.draft.id)).toEqual(['cccccc', 'dddddd']);
    expect(ob.list()[0].tries).toBe(1);
    const r2 = await ob.flush(async () => {
      throw new Error('ağ');
    });
    expect(r2.left).toBe(2);
    const r3 = await ob.flush(async () => ({ result: 'ok' }));
    expect(r3).toMatchObject({ sent: 2, rejected: 0, left: 0 });
  });

  it('pano önbelleği ve profil', () => {
    const kv = memoryKV();
    const c = new BoardCache(kv);
    c.merge([item('aaaaaa', 1), item('bbbbbb', 2)], 2, 'http://x');
    const all = c.merge([item('aaaaaa', 3, { status: undefined, text: 'g' })], 3, 'http://x');
    expect(all.map((i) => i.id)).toEqual(['aaaaaa', 'bbbbbb']);
    expect(c.load()).toMatchObject({ since: 3, server: 'http://x' });
    expect(loadProfile(kv).name).toBe('');
    saveProfile({ name: 'Ayşe' }, kv);
    saveProfile({ family: '0555' }, kv);
    expect(loadProfile(kv)).toMatchObject({ name: 'Ayşe', family: '0555' });
  });

  it('adres ve telefon normalleştirme', () => {
    expect(normalizeServer('192.168.43.1:8080')).toBe('http://192.168.43.1:8080');
    expect(normalizeServer('http://10.0.0.2:8080/abc')).toBe('http://10.0.0.2:8080');
    expect(normalizeServer('')).toBe('');
    expect(normalizeServer('http://')).toBeNull();
    expect(cleanPhone(' +90 (555) 123-45-67 ')).toBe('+905551234567');
  });
});

describe('Mors', () => {
  it('metin → Mors (Türkçe harfler sadeleşir)', () => {
    expect(textToMorse('SOS').morse).toBe('...---...');
    expect(textToMorse('sos yardım').morse).toBe('...---... / -.-- .- .-. -.. .. --');
    expect(normalizeForMorse('Çığ şöü İi')).toBe('CIG SOU II');
    expect(textToMorse('ab 12').morse).toBe('.- -... / .---- ..---');
    expect(textToMorse('a#b').unknown).toEqual(['#']);
  });
  it('Mors → metin', () => {
    expect(morseToText('.- -... / -.-.').text).toBe('AB C');
    expect(morseToText('...---...').text).toBe('SOS');
    expect(morseToText('·−  −···').text).toBe('A B');
    const r = morseToText('.- ......... -');
    expect(r.text).toBe('A?T');
    expect(r.unknown).toEqual(['.........']);
    expect(morseToText(textToMorse('Merhaba 2026!').morse).text).toBe('MERHABA 2026!');
  });
  it('Mors tanıma', () => {
    expect(looksLikeMorse('... --- ...')).toBe(true);
    expect(looksLikeMorse('sos')).toBe(false);
    expect(looksLikeMorse(' / ')).toBe(false);
  });
  it('zamanlama: nokta 1, çizgi 3, işaret arası 1, harf arası 3, kelime arası 7', () => {
    expect(morseToSteps('.-')).toEqual([[true, 1], [false, 1], [true, 3]]);
    expect(morseToSteps('. .')).toEqual([[true, 1], [false, 3], [true, 1]]);
    expect(morseToSteps('. / .')).toEqual([[true, 1], [false, 7], [true, 1]]);
    // PARIS = 50 birim (son kelime arası dahil)
    expect(stepsUnits(morseToSteps(textToMorse('PARIS').morse)) + 7).toBe(50);
    expect(unitMs(20)).toBe(60);
  });
});

describe('SMS şablonları', () => {
  it('bulunma hâli eki ünlü ve ünsüz uyumuna uyar', () => {
    expect(locativeIm('Ankara')).toBe("Ankara'dayım");
    expect(locativeIm('Kilis')).toBe("Kilis'teyim");
    expect(locativeIm('Tokat')).toBe("Tokat'tayım");
    expect(locativeIm('İzmir')).toBe("İzmir'deyim");
    expect(locativeIm('okul')).toBe('okuldayım');
    expect(locativeIm('park')).toBe('parktayım');
    expect(locativeIm('Bolu')).toBe("Bolu'dayım");
    expect(locativeIm('Göztepe')).toBe("Göztepe'deyim");
    expect(locativeIm('Blok 5')).toBeNull();
  });
  it('şablonlar konumu içerir', () => {
    const pos = { lat: 39.9208, lon: 32.8541234, acc: 12.4 };
    const i = buildTemplate('iyiyim', { name: 'Ayşe', place: 'Kızılay', note: '', people: '', pos });
    expect(i).toBe("İyiyim, Kızılay'dayım. Konum: 39.92080, 32.85412 (±12 m). — Ayşe");
    const a = buildTemplate('acil112', { name: 'Ayşe', place: 'Cumhuriyet Mah. 5. Sok.', note: 'Enkaz altında 2 kişi var', people: '3', pos });
    expect(a).toContain('ACİL.');
    expect(a).toContain('Kişi sayısı: 3.');
    expect(a).toContain('Konum: 39.92080, 32.85412');
    const y = buildTemplate('yardim', { name: '', place: 'Blok 5', note: '', people: '', pos: null });
    expect(y).toBe("Yardıma ihtiyacım var. Bulunduğum yer: Blok 5. Bu mesajı alırsan lütfen 112'ye bildir.");
  });
  it('sms: bağlantısı ve parça sayısı', () => {
    expect(smsHref('+90 555 111 22 33', 'İyiyim & sağlam')).toBe('sms:+905551112233?body=%C4%B0yiyim%20%26%20sa%C4%9Flam');
    expect(smsHref('0555', 'a', true)).toBe('sms:0555&body=a');
    expect(smsParts('Iyiyim')).toEqual({ chars: 6, parts: 1, unicode: false });
    expect(smsParts('ş'.repeat(71))).toEqual({ chars: 71, parts: 2, unicode: true });
  });
});

describe('QA düzeltmeleri', () => {
  it('Mors: ·, −, | ve çift boşlukla yazılan kod da oynatılır', () => {
    expect(morseToSteps('··· −−− ···')).toEqual(morseToSteps('... --- ...'));
    expect(morseToSteps('.- | -...')).toEqual(morseToSteps('.- / -...'));
    expect(morseToSteps('.-  -...')).toEqual(morseToSteps('.- / -...'));
    expect(morseToSteps('_ _')).toEqual(morseToSteps('- -'));
  });
  it('mesh: "bulundu" güncellemesi ekli kimlikle gelir, asıl ilana bağlanır', () => {
    const it0 = fromMesh({ id: 'abcdef123_bulundu', kind: 'kayip', from: 'B', text: '[bulundu] Ad: Ali', time: 1700000000000 });
    expect(it0?.id).toBe('abcdef123');
    expect(it0?.status).toBe('bulundu');
    // ek yalnızca bulundu etiketiyle çözülür
    expect(fromMesh({ id: 'abcdef123_bulundu', kind: 'mesaj', from: 'B', text: 'x', time: 1 })?.id).toBe('abcdef123_bulundu');
  });
  it('giden kutusu reddedilen kaydı bildirir', async () => {
    const o = new Outbox(memoryKV());
    o.add({ id: 'aaaaaa1', kind: 'mesaj', from: 'A', text: 'x' });
    const r = await o.flush(async () => ({ result: 'reject', error: 'Metin gerekli' }));
    expect(r.rejects).toEqual([{ id: 'aaaaaa1', error: 'Metin gerekli' }]);
    expect(r.left).toBe(0);
  });
});
