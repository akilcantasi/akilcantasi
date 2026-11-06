import { describe, expect, it } from 'vitest';
import {
  EN_BUYUK_KAYIT,
  EN_COK_MESAJ,
  EN_UZUN_METIN,
  KAYIT_OMRU_MS,
  kayitOku,
  kayitOlustur,
  type BotMsg,
  type Msg,
  type UserMsg,
} from '../src/lib/fener/sohbet-kayit';

const T0 = 1_800_000_000_000;
const u = (id: number, text: string): UserMsg => ({ id, role: 'user', text });
const b = (id: number, text: string, p: Partial<BotMsg> = {}): BotMsg => ({
  id,
  role: 'bot',
  text,
  phase: 'done',
  progress: null,
  sources: [{ n: 1, kind: 'rehber', title: 'Kanama', id: 'kanama' }],
  critical: false,
  topGuideId: 'kanama',
  topGuideTitle: 'Kanama',
  question: 'Kanama nasıl durur?',
  questionContext: null,
  fromModel: true,
  ...p,
});

describe('Fener sohbet kaydı', () => {
  it('mesajları, kaynakları ve taslağı geri yükler', () => {
    const msgs: Msg[] = [u(1, 'Kanama nasıl durur?'), b(2, 'Bastırın.', { tps: 4.2 })];
    const s = kayitOlustur(msgs, 'Su nasıl', T0)!;
    const r = kayitOku(s, T0 + 60_000)!;
    expect(r.input).toBe('Su nasıl');
    expect(r.msgs).toHaveLength(2);
    const bot = r.msgs[1] as BotMsg;
    expect(bot.text).toBe('Bastırın.');
    expect(bot.sources[0]).toEqual({ n: 1, kind: 'rehber', title: 'Kanama', id: 'kanama' });
    expect(bot.tps).toBe(4.2);
    expect(bot.interrupted).toBeUndefined();
  });

  it('boş sohbet ve boş taslakta kayıt yok (silinir)', () => {
    expect(kayitOlustur([], '   ', T0)).toBeNull();
    expect(kayitOlustur([], 'taslak', T0)).not.toBeNull();
  });

  it('yazılırken kalan cevap "yarım kaldı" olarak döner', () => {
    const msgs: Msg[] = [u(1, 'Soru'), b(2, 'Yarım ceva', { phase: 'write', progress: 0.4 })];
    const r = kayitOku(kayitOlustur(msgs, '', T0), T0)!;
    const bot = r.msgs[1] as BotMsg;
    expect(bot.phase).toBe('done');
    expect(bot.progress).toBeNull();
    expect(bot.interrupted).toBe(true);
    expect(bot.text).toBe('Yarım ceva');
  });

  it('elle yazılmış eski biçimde de (phase write) yarım sayılır', () => {
    const raw = JSON.stringify({ v: 1, t: T0, input: '', msgs: [u(1, 'S'), { ...b(2, ''), phase: 'search' }] });
    const bot = kayitOku(raw, T0)!.msgs[1] as BotMsg;
    expect(bot.interrupted).toBe(true);
    expect(bot.phase).toBe('done');
  });

  it('12 saatten eski kayıt yüklenmez', () => {
    const s = kayitOlustur([u(1, 'S')], '', T0)!;
    expect(kayitOku(s, T0 + KAYIT_OMRU_MS - 1)).not.toBeNull();
    expect(kayitOku(s, T0 + KAYIT_OMRU_MS + 1)).toBeNull();
    // Saat çok ileri alınmış kayıt da
    expect(kayitOku(s, T0 - KAYIT_OMRU_MS - 1)).toBeNull();
  });

  it('bozuk ya da başka sürüm kayıt yok sayılır', () => {
    expect(kayitOku('{bozuk', T0)).toBeNull();
    expect(kayitOku(JSON.stringify({ v: 99, t: T0, msgs: [u(1, 'S')], input: '' }), T0)).toBeNull();
    expect(kayitOku(JSON.stringify([1, 2]), T0)).toBeNull();
    expect(kayitOku(null, T0)).toBeNull();
  });

  it('geçersiz mesaj ve kaynaklar ayıklanır', () => {
    const raw = JSON.stringify({
      v: 1,
      t: T0,
      input: 5,
      msgs: [
        { id: 1, role: 'user', text: 'S' },
        { id: 1, role: 'user', text: 'aynı kimlik' },
        { id: 'x', role: 'user', text: 'kimliksiz' },
        { id: 3, role: 'sistem', text: 'tanımsız rol' },
        { ...b(4, 'C'), sources: [{ n: 1, kind: 'kotu', title: 'x' }, { n: 2, kind: 'vikipedi', title: 'Su', path: 'A/Su' }, null], critical: 'evet' },
      ],
    });
    const r = kayitOku(raw, T0)!;
    expect(r.input).toBe('');
    expect(r.msgs.map((m) => m.id)).toEqual([1, 4]);
    const bot = r.msgs[1] as BotMsg;
    expect(bot.sources).toEqual([{ n: 2, kind: 'vikipedi', title: 'Su', path: 'A/Su' }]);
    expect(bot.critical).toBe(false);
  });

  it('mesaj sayısı ve uzunluğu sınırlanır, baştaki yalnız cevap atılır', () => {
    const msgs: Msg[] = [];
    for (let i = 0; i < 60; i++) msgs.push(i % 2 ? b(i + 1, 'c' + i) : u(i + 1, 's' + i));
    // 60 mesajın son 40'ı: 21. mesaj (id 21, kullanıcı) ile başlar
    const r = kayitOku(kayitOlustur(msgs, '', T0), T0)!;
    expect(r.msgs.length).toBeLessThanOrEqual(EN_COK_MESAJ);
    expect(r.msgs[0].role).toBe('user');
    const uzun = kayitOku(kayitOlustur([u(1, 'x'.repeat(EN_UZUN_METIN * 2))], '', T0), T0)!;
    expect(uzun.msgs[0].text.length).toBe(EN_UZUN_METIN);
  });

  it('toplam boyut sınırını aşarsa en eski soru-cevaplar atılır', () => {
    const msgs: Msg[] = [];
    for (let i = 0; i < 40; i += 2) msgs.push(u(i + 1, 'soru ' + i), b(i + 2, 'y'.repeat(EN_UZUN_METIN)));
    const s = kayitOlustur(msgs, '', T0)!;
    expect(s.length).toBeLessThanOrEqual(EN_BUYUK_KAYIT);
    const r = kayitOku(s, T0)!;
    expect(r.msgs[0].role).toBe('user');
    expect(r.msgs[r.msgs.length - 1].id).toBe(40);
  });

  it('bağlam metni kısaltılarak saklanır', () => {
    const bot = b(2, 'C', { questionContext: { title: 'Harita noktası', text: 'z'.repeat(10_000), source: 'harita' } });
    const r = kayitOku(kayitOlustur([u(1, 'S'), bot], '', T0), T0)!;
    const q = (r.msgs[1] as BotMsg).questionContext!;
    expect(q.title).toBe('Harita noktası');
    expect(q.text.length).toBe(4000);
  });
});
