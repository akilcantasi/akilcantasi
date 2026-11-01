import { describe, expect, it } from 'vitest';
import { initials, loadYakinlar, multiSmsHref, saveYakinlar } from '../src/iletisim/yakinlar';
import { emergencyMessage, familyMessage } from '../src/iletisim/HizliSms';

function memKV(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}

const pos = { lat: 39.9208, lon: 32.8541, acc: 12 };

describe('hızlı SMS', () => {
  it('112 mesajı konum içerir; konum yoksa bunu söyler', () => {
    const m = emergencyMessage('Ayşe', pos);
    expect(m).toContain('ACİL.');
    expect(m).toContain('Adım Ayşe.');
    expect(m).toContain('Konum: 39.92080, 32.85410 (±12 m)');
    expect(emergencyMessage('', null)).toMatch(/Konumum alınamadı\.$/);
  });

  it('yakın mesajı harita bağlantısıyla', () => {
    const m = familyMessage('iyiyim', 'Mehmet', pos);
    expect(m.startsWith('İyiyim.')).toBe(true);
    expect(m).toContain('https://www.openstreetmap.org/?mlat=39.92080&mlon=32.85410');
    expect(familyMessage('yardim', '', null)).not.toContain('openstreetmap');
  });

  it('çok alıcılı sms: bağlantısı (Android ve iOS)', () => {
    expect(multiSmsHref(['0555 111 22 33', '+90 532 000 00 00'], 'a b')).toBe('sms:05551112233,+905320000000?body=a%20b');
    expect(multiSmsHref(['0555 111 22 33', '0532'], 'x', true)).toBe('sms:/open?addresses=05551112233,0532&body=x');
    expect(multiSmsHref(['0555'], 'x', true)).toBe('sms:0555&body=x');
  });

  it('yakınlar cihazda saklanır; eski aile numarası taşınır', () => {
    const kv = memKV({ 'ac.comm.profile': JSON.stringify({ family: '0555 444 33 22', familyName: 'Annem' }) });
    const first = loadYakinlar(kv as any);
    expect(first).toEqual([{ id: first[0].id, name: 'Annem', phone: '05554443322' }]);
    saveYakinlar([...first, { id: 'x', name: 'Mehmet', phone: '0532 000 00 00' }], kv as any);
    const l = loadYakinlar(kv as any);
    expect(l.at(-1)).toEqual({ id: 'x', name: 'Mehmet', phone: '05320000000' });
    expect(initials('Ayşe Yılmaz')).toBe('AY');
    expect(initials('')).toBe('?');
  });
});
