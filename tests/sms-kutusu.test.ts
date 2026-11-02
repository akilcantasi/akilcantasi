import { describe, expect, it } from 'vitest';
import { durumMetni, sureMetni } from '../src/iletisim/sms-kutusu';
import type { SmsKayit } from '../src/lib/native';

const base: SmsKayit = { id: 'a', to: '05320000000', name: 'Ayşe', body: 'İyiyim', state: 'bekliyor', error: '', created: 0, nextTry: 0, tried: 0, sentAt: 0, deliveredAt: 0, attempts: 0, parts: 1 };

describe('SMS giden kutusu metinleri', () => {
  it('süre', () => {
    expect(sureMetni(15_000)).toBe('15 sn');
    expect(sureMetni(120_000)).toBe('2 dk');
    expect(sureMetni(2 * 3600_000)).toBe('2 sa');
  });
  it('bekleyen: neden ve kalan süre', () => {
    expect(durumMetni({ ...base, error: 'Şebeke yok', attempts: 2, nextTry: 70_000 }, 10_000)).toEqual({ text: 'Şebeke yok. 1 dk sonra yeniden denenecek', tone: 'bad' });
    expect(durumMetni({ ...base, nextTry: 0 }, 10_000)).toEqual({ text: 'Deneniyor…', tone: 'wait' });
  });
  it('sonuçlar', () => {
    expect(durumMetni({ ...base, state: 'gitti', attempts: 4 }, 0).text).toBe('Gönderildi (4. denemede)');
    expect(durumMetni({ ...base, state: 'gitti', attempts: 1 }, 0).text).toBe('Gönderildi');
    expect(durumMetni({ ...base, state: 'ulasti' }, 0)).toEqual({ text: 'Ulaştı', tone: 'ok' });
    expect(durumMetni({ ...base, state: 'hata', error: 'Şebeke yok' }, 0)).toEqual({ text: 'Gönderilemedi: Şebeke yok', tone: 'bad' });
    expect(durumMetni({ ...base, state: 'gonderiliyor', attempts: 3 }, 0).text).toBe('Gönderiliyor (3. deneme)…');
  });
});
