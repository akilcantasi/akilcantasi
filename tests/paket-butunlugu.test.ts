// Model bütünlük denetimi (PaketButunlugu.java) ile arayüz arasındaki sözleşme.
// Java tarafının kendisi tools/indirici-sinama ve tools/fener-sinama ile sınanır.
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { nativeErrorText } from '../src/lib/fener/engine';

const java = (ad: string) => fs.readFileSync(path.resolve(__dirname, '..', 'android/app/src/main/java/org/akilcantasi/app', ad), 'utf8');

describe('değişmiş model iletisi', () => {
  const ileti = /MODEL_DEGISMIS\s*=\s*"([^"]+)"/.exec(java('PaketButunlugu.java'))?.[1] ?? '';

  it('Java iletisi Türkçe ve arayüzde aynen gösterilir', () => {
    expect(ileti).toBe('Model dosyası değişmiş görünüyor; yeniden indirin');
    expect(nativeErrorText(ileti)).toMatch(/^Model dosyası değişmiş görünüyor; yeniden indirin/);
  });
  it('başka hatalar eskisi gibi', () => {
    expect(nativeErrorText('Model dosyası cihazda yok')).toMatch(/açılamadı/);
    expect(nativeErrorText('x')).toBe('Model yüklenemedi.');
  });
  it('yerel motor değişmiş modeli WebAssembly motoruna da bırakmaz', () => {
    const eng = fs.readFileSync(path.resolve(__dirname, '..', 'src/lib/fener/engine.ts'), 'utf8');
    expect(eng).toMatch(/const fallbackOk = !degismis &&/);
  });
  it('indirme bitince kayıt yazılır, model açılmadan önce denetlenir, silinince kayıt atılır', () => {
    expect(java('PaketIndirici.java')).toMatch(/new PaketButunlugu\(ctx\.getFilesDir\(\)\)\.kaydet\(target, j\.sha256\)/);
    const p = java('AkilCantasiPlugin.java');
    const yukle = p.indexOf('public void fenerYukle');
    const denetim = p.indexOf('butunluk.modelDenetle(f)', yukle);
    const motor = p.indexOf('FenerMotoru.yukle(', yukle);
    expect(denetim).toBeGreaterThan(yukle);
    expect(denetim).toBeLessThan(motor);
    expect(p).toMatch(/new PaketButunlugu\(getContext\(\)\.getFilesDir\(\)\)\.sil\(name\)/);
  });
  it('kayıt iç depoda tutulur (Android/data değil)', () => {
    expect(java('PaketButunlugu.java')).toMatch(/KAYIT_DOSYASI = "paket-butunlugu\.properties"/);
    expect(java('PaketIndirici.java')).not.toMatch(/PaketButunlugu\(packsDir/);
  });
});
