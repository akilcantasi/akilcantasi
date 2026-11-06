/// <reference lib="webworker" />
// Yer adı dizini işçisi: ana iş parçacığının okuduğu karo parçalarını açar, "places"
// katmanındaki yer adlarını toplar, adları sadeleştirir ve OPFS önbelleğini okur/yazar
// (yer-dizini.ts). Ana iş parçacığına sütunlu paket döner: arayüz donmaz.
import { YerToplayici, hazirla, opfsOku, opfsYaz, paketTamponlari, paketle, type IsciGelen, type IsciGiden } from './yer-toplayici';
import { yerleriTamamla } from './yer-arama';

const ctx = self as unknown as DedicatedWorkerGlobalScope;
let t = new YerToplayici();

ctx.onmessage = async (ev: MessageEvent<IsciGiden>) => {
  const m = ev.data;
  try {
    if (m.t === 'yukle') {
      const yerler = await opfsOku(m.anahtar);
      const paket = yerler ? paketle(hazirla(yerler)) : null;
      ctx.postMessage({ t: 'tamam', id: m.id, paket } satisfies IsciGelen, paket ? paketTamponlari(paket) : []);
    } else if (m.t === 'grup') {
      t.grup(m.buf, m.basla, m.karolar, m.s);
      ctx.postMessage({ t: 'tamam', id: m.id } satisfies IsciGelen);
    } else if (m.t === 'bitir') {
      const yerler = yerleriTamamla(t.yerler, m.sinir);
      t = new YerToplayici();
      const paket = paketle(hazirla(yerler));
      ctx.postMessage({ t: 'tamam', id: m.id, paket } satisfies IsciGelen, paketTamponlari(paket));
      if (m.anahtar) await opfsYaz(m.anahtar, yerler);
    }
  } catch (e) {
    ctx.postMessage({ t: 'hata', id: m.id, mesaj: e instanceof Error ? e.message : String(e) } satisfies IsciGelen);
  }
};
