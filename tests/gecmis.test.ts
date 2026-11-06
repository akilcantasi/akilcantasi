// Geri tuşu ↔ uygulama içi gezinme (src/gecmis.ts). Tarayıcı geçmişi sahte bir nesneyle taklit edilir.
import { describe, it, expect, beforeAll } from 'vitest';
import { getState, setState, go } from '../src/lib/store';

type Kayit = { state: unknown };
const win = new EventTarget() as EventTarget & { setTimeout: typeof setTimeout };
win.setTimeout = setTimeout;
const ates = (state: unknown) => {
  const e = new Event('popstate');
  Object.defineProperty(e, 'state', { value: state });
  win.dispatchEvent(e);
};
const gecmis = {
  kayitlar: [{ state: null }] as Kayit[],
  i: 0,
  get length() {
    return this.kayitlar.length;
  },
  get state() {
    return this.kayitlar[this.i].state;
  },
  pushState(s: unknown) {
    this.kayitlar = this.kayitlar.slice(0, this.i + 1);
    this.kayitlar.push({ state: structuredClone(s) });
    this.i++;
  },
  replaceState(s: unknown) {
    this.kayitlar[this.i] = { state: structuredClone(s) };
  },
  back() {
    if (this.i === 0) return;
    this.i--;
    setTimeout(() => ates(this.state), 5);
  },
  forward() {
    if (this.i >= this.kayitlar.length - 1) return;
    this.i++;
    setTimeout(() => ates(this.state), 5);
  },
};
const bekle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

let gecmisMod: typeof import('../src/gecmis');
beforeAll(async () => {
  (globalThis as any).window = win;
  (globalThis as any).history = gecmis;
  setState({ tab: 'fener', openTool: null, openComm: null, openGuideId: null, openCategoryId: null, openArticlePath: null, kurulum: false });
  gecmisMod = await import('../src/gecmis');
  gecmisMod.initGecmis();
});

describe('geçmiş kaydı doğrulama', () => {
  it('geçerli kayıt kabul edilir, bozuk kayıt reddedilir', async () => {
    const { gecerliEkran } = await import('../src/gecmis');
    expect(gecerliEkran({ tab: 'rehber', openTool: null, openComm: null, openGuideId: 'x', openCategoryId: null, openArticlePath: null })?.openGuideId).toBe('x');
    expect(gecerliEkran({ tab: '__proto__' })).toBeNull();
    expect(gecerliEkran({ tab: 'rehber', openTool: 5 })).toBeNull();
    expect(gecerliEkran(null)).toBeNull();
    expect(gecerliEkran('rehber')).toBeNull();
  });
});

describe('geri tuşu', () => {
  it('her ekran değişimi bir kayıt ekler, geri bir önceki ekrana döner', async () => {
    expect(gecmis.length).toBe(1);
    go.tab('rehber');
    await bekle(0);
    go.category('deprem');
    await bekle(0);
    go.guide('deprem-aninda');
    await bekle(0);
    expect(gecmis.length).toBe(4);
    gecmis.back();
    await bekle();
    expect(getState().openGuideId).toBeNull();
    expect(getState().openCategoryId).toBe('deprem');
    gecmis.back();
    await bekle();
    expect(getState().tab).toBe('rehber');
    expect(getState().openCategoryId).toBeNull();
    gecmis.back();
    await bekle();
    expect(getState().tab).toBe('fener');
    gecmis.forward();
    await bekle();
    expect(getState().tab).toBe('rehber');
  });

  it('aynı olaydaki ardışık değişiklikler tek kayıt olur', async () => {
    const n = gecmis.length;
    const i = gecmis.i;
    setState({ tab: 'araclar' });
    setState({ openTool: 'pusula' });
    await bekle(0);
    expect(gecmis.i).toBe(i + 1);
    expect(gecmis.length).toBeLessThanOrEqual(n + 1);
  });

  it('uygulama içi geri düğmesi yeni kayıt eklemez, geçmişte geri gider', async () => {
    go.tool('pil');
    await bekle(0);
    const n = gecmis.length;
    go.tool(null); // "← Araçlar": bir önceki ekran (araclar, pusula değil) değil → yeni kayıt
    await bekle(20);
    // Önceki ekran pusula idi; şimdi araç listesi → yeni kayıt
    expect(gecmis.length).toBe(n + 1);
    go.tool('stok');
    await bekle(0);
    const m = gecmis.length;
    go.tool(null); // önceki ekranın aynısı → history.back
    await bekle(20);
    expect(gecmis.length).toBe(m);
    expect(getState().openTool).toBeNull();
    // ardından gerçek geri: araca değil daha önceki ekrana
    gecmis.back();
    await bekle();
    expect(getState().openTool).toBe('pil');
  });

  it('geri tamamlanmadan yapılan gezinme geri alınmaz', async () => {
    go.tool('hesap');
    await bekle(0);
    go.tool('pil'); // önceki ekran: geri bekleniyor
    await bekle(0);
    go.tab('harita'); // popstate gelmeden sekmeye dokunuldu
    await bekle(40);
    expect(getState().tab).toBe('harita');
    gecmis.back();
    await bekle();
    expect(getState().tab).toBe('araclar');
  });

  it('katman açıkken geri: ekran değişmez, katman kapanır; sonraki geri ekranı değiştirir', async () => {
    go.tab('kutuphane');
    await bekle(0);
    go.tab('rehber');
    await bekle(0);
    let kapandi = 0;
    const birak = gecmisMod.katmanAc(() => {
      kapandi++;
      birak();
    });
    const n = gecmis.length;
    gecmis.back();
    await bekle();
    expect(kapandi).toBe(1);
    expect(getState().tab).toBe('rehber');
    expect(gecmis.length).toBe(n);
    gecmis.back();
    await bekle();
    expect(kapandi).toBe(1);
    expect(getState().tab).toBe('kutuphane');
  });

  it('kapatılan katman geri tuşunu artık tutmaz', async () => {
    go.tab('iletisim');
    await bekle(0);
    let kapandi = 0;
    const birak = gecmisMod.katmanAc(() => kapandi++);
    birak();
    gecmis.back();
    await bekle();
    expect(kapandi).toBe(0);
    expect(getState().tab).toBe('kutuphane');
  });

  it('ilk ekranda katman: koruma kaydı geri tuşunu tutar, sonra kaldırılır', async () => {
    // geçmişi başa sar: yeni bir yığın (önceki yüklemeden kalan kayıt gibi)
    gecmis.kayitlar = [{ state: null }];
    gecmis.i = 0;
    ates({ ekran: { tab: 'fener', openTool: null, openComm: null, openGuideId: null, openCategoryId: null, openArticlePath: null } });
    await bekle(0);
    expect(getState().tab).toBe('fener');
    const n0 = gecmis.length;
    let kapandi = 0;
    const birak = gecmisMod.katmanAc(() => {
      kapandi++;
      birak();
    });
    expect(gecmis.length).toBe(n0 + 1); // koruma kaydı
    gecmis.back();
    await bekle();
    expect(kapandi).toBe(1);
    expect(getState().tab).toBe('fener');
    expect(gecmis.i).toBe(0);
    // katman düğmeyle kapanırsa koruma kaydı geri alınır
    const birak2 = gecmisMod.katmanAc(() => {});
    expect(gecmis.i).toBe(1);
    birak2();
    await bekle();
    expect(gecmis.i).toBe(0);
    expect(getState().tab).toBe('fener');
    // katman açıkken başka ekrana geçilirse koruma kaydı o ekranın kaydı olur
    const birak3 = gecmisMod.katmanAc(() => {});
    go.tab('harita');
    await bekle(0);
    birak3();
    await bekle();
    expect(gecmis.i).toBe(1);
    gecmis.back();
    await bekle();
    expect(getState().tab).toBe('fener');
  });

  it('başka koddan gelen tanınmayan kayıt uygulamayı bozmaz', async () => {
    const once = { ...getState() };
    ates({ baska: true });
    await bekle(0);
    expect(getState().tab).toBe(once.tab);
    ates({ ekran: { tab: 'yok' } });
    await bekle(0);
    expect(getState().tab).toBe(once.tab);
  });
});
