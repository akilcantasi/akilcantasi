// İmzalı katalog (Ed25519): uygulama tarafı doğrulama, imzalama aracı ve uzak katalog akışı.
import { afterEach, describe, expect, it, vi } from 'vitest';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { katalogImzasiGecerli, KATALOG_ACIK_ANAHTAR } from '../src/lib/katalog-imza';
import { imzaliKatalogAl, REMOTE_MANIFEST_SIG_URL, REMOTE_MANIFEST_URL } from '../src/lib/manifest';
// @ts-ignore .mjs betiği
import { acikAnahtarB64, dogrula, dosyaImzala, gizliAnahtarOku, imzala, uygulamaAcikAnahtari } from '../tools/katalog-imzala.mjs';

const kok = path.resolve(__dirname, '..');
const enc = new TextEncoder();

function anahtarCifti() {
  const { privateKey } = crypto.generateKeyPairSync('ed25519');
  return { gizli: privateKey, acik: acikAnahtarB64(privateKey) as string };
}

describe('katalogImzasiGecerli (uygulama, @noble/ed25519)', () => {
  const { gizli, acik } = anahtarCifti();
  const govde = enc.encode(JSON.stringify({ version: 2, updated: '2026-11-07', packs: [] }, null, 2) + '\n');
  const imza = crypto.sign(null, govde, gizli).toString('base64');

  it('geçerli imza kabul edilir', () => {
    expect(katalogImzasiGecerli(govde, imza, acik)).toBe(true);
    expect(katalogImzasiGecerli(govde, imza + '\n', acik)).toBe(true);
  });
  it('tek baytı değişmiş katalog reddedilir', () => {
    const bozuk = govde.slice();
    bozuk[10] ^= 1;
    expect(katalogImzasiGecerli(bozuk, imza, acik)).toBe(false);
    expect(katalogImzasiGecerli(enc.encode(new TextDecoder().decode(govde) + ' '), imza, acik)).toBe(false);
  });
  it('başka anahtarla atılmış imza reddedilir', () => {
    expect(katalogImzasiGecerli(govde, imza)).toBe(false); // projenin anahtarı
    expect(katalogImzasiGecerli(govde, imza, anahtarCifti().acik)).toBe(false);
  });
  it('imza yok, boş ya da bozuk biçim: false, hata fırlatmaz', () => {
    expect(katalogImzasiGecerli(govde, null, acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, undefined, acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, '', acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, '!!! imza değil !!!', acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, imza.slice(0, 40), acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, '<html>404</html>', acik)).toBe(false);
    expect(katalogImzasiGecerli(govde, imza, 'kısa')).toBe(false);
  });
  it('depodaki public/packs-manifest.json.sig biçimce doğru (64 baytlık imza)', () => {
    // Geçerliliği: node tools/katalog-imzala.mjs --dogrula ve e2e/katalog-imza-check.mjs.
    // Katalog elle düzenlenince imza eskir; anahtar sahibi yeniden imzalar, aylık iş de yeniden imzalar.
    const s = fs.readFileSync(path.join(kok, 'public', 'packs-manifest.json.sig'), 'utf8');
    expect(Buffer.from(s.trim(), 'base64').length).toBe(64);
  });
  it('araçtaki ve uygulamadaki açık anahtar aynı; araç uygulamanın doğruladığı imzayı üretir', () => {
    expect(uygulamaAcikAnahtari(kok)).toBe(KATALOG_ACIK_ANAHTAR);
    const s = imzala(govde, gizli);
    expect(dogrula(govde, s, acik)).toBe(true);
    expect(katalogImzasiGecerli(govde, s, acik)).toBe(true);
  });
});

describe('imzaliKatalogAl (uzak katalog)', () => {
  const { gizli, acik } = anahtarCifti();
  const katalog = { version: 3, updated: '2099-01-01', packs: [] };
  const govde = enc.encode(JSON.stringify(katalog));
  const imza = crypto.sign(null, govde, gizli).toString('base64');
  const getirici = (g: Uint8Array | null, s: string | null) => async (url: string) => {
    if (url === REMOTE_MANIFEST_URL) return g;
    if (url === REMOTE_MANIFEST_SIG_URL) return s === null ? null : enc.encode(s);
    throw new Error('beklenmeyen adres ' + url);
  };
  afterEach(() => vi.restoreAllMocks());

  it('imza adresi kataloğun yanında', () => {
    expect(REMOTE_MANIFEST_SIG_URL).toBe(REMOTE_MANIFEST_URL + '.sig');
  });
  it('geçerli imzalı katalog çözülür', async () => {
    expect(await imzaliKatalogAl(getirici(govde, imza), acik)).toEqual(katalog);
  });
  it('değiştirilmiş katalog sessizce yok sayılır (console.warn)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const sahte = enc.encode(JSON.stringify({ ...katalog, packs: [{ id: 'kotu' }] }));
    expect(await imzaliKatalogAl(getirici(sahte, imza), acik)).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/imzası geçersiz/));
  });
  it('yanlış anahtarla imzalı katalog yok sayılır', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await imzaliKatalogAl(getirici(govde, imza))).toBeNull(); // projenin gerçek anahtarı
  });
  it('imzası olmayan katalog yok sayılır', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await imzaliKatalogAl(getirici(govde, null), acik)).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/imzası yok/));
  });
  it('ağ hatası fırlatılır (5 dakika sonra yeniden denenir)', async () => {
    await expect(
      imzaliKatalogAl(async () => {
        throw new Error('ağ yok');
      }, acik),
    ).rejects.toThrow('ağ yok');
  });
});

describe('tools/katalog-imzala.mjs', () => {
  it('anahtar biçimleri: PKCS8 base64, PEM, ham tohum (hex/base64), açıklama satırları', () => {
    const { gizli, acik } = anahtarCifti();
    const pkcs8 = gizli.export({ format: 'der', type: 'pkcs8' }) as Buffer;
    const tohum = pkcs8.subarray(pkcs8.length - 32);
    expect(acikAnahtarB64(gizliAnahtarOku(pkcs8.toString('base64')))).toBe(acik);
    expect(acikAnahtarB64(gizliAnahtarOku('# açıklama\n' + pkcs8.toString('base64') + '\n'))).toBe(acik);
    expect(acikAnahtarB64(gizliAnahtarOku(gizli.export({ format: 'pem', type: 'pkcs8' }) as string))).toBe(acik);
    expect(acikAnahtarB64(gizliAnahtarOku(tohum.toString('hex')))).toBe(acik);
    expect(acikAnahtarB64(gizliAnahtarOku(tohum.toString('base64')))).toBe(acik);
  });
  it('boş ya da bozuk anahtar: anlaşılır hata, anahtar iletide görünmez', () => {
    expect(() => gizliAnahtarOku('')).toThrow(/boş/);
    expect(() => gizliAnahtarOku('# yalnız açıklama')).toThrow(/boş/);
    expect(() => gizliAnahtarOku('ZZZZ')).toThrow(/çözülemedi/);
    try {
      gizliAnahtarOku('gizli-deger-ç');
    } catch (e: any) {
      expect(String(e.message)).not.toContain('gizli-deger');
    }
  });
  it('dosyaImzala: .sig yazar; uygulamadakiyle eşleşmeyen anahtarı reddeder', () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'katalog-'));
    const f = path.join(d, 'packs-manifest.json');
    fs.writeFileSync(f, '{"version":1,"updated":"2026-11-07","packs":[]}\n');
    const { gizli, acik } = anahtarCifti();
    dosyaImzala(f, gizli, acik);
    const s = fs.readFileSync(f + '.sig', 'utf8');
    expect(katalogImzasiGecerli(new Uint8Array(fs.readFileSync(f)), s, acik)).toBe(true);
    expect(() => dosyaImzala(f, gizli, KATALOG_ACIK_ANAHTAR)).toThrow(/eşleşmiyor/);
  });
});
