// Kütüphane sekmesi: indirilen çevrimdışı koleksiyonlar (Vikipedi, ilaç rehberleri, kitaplar…).
// Ekranlar (src/tabs/kutuphane/):
//  • Kitaplığım (Kitapligim.tsx): koleksiyon kartları, kaldığın yerden devam, son okunanlar, birleşik arama
//  • Koleksiyon (Koleksiyon.tsx): okumaya başla / kitap listesi, bu koleksiyonda ara, ayrıntılar ve silme
//  • Okuyucu (Okuyucu.tsx): makale, PDF, dosya
//  • İçerik indir (KutuphaneMagaza.tsx): ihtiyaca göre katalog, başlangıç seti, indirmeler
//  • Yer aç ve yönet (Yonet.tsx)
// Tasarım: docs/qa/kutuphane-tasarim.md
import { useState } from 'preact/hooks';
import { useAppState } from '../lib/store';
import { TRANSLATE_CSS } from './KutuphaneCeviri';
import { LibraryStore } from './KutuphaneMagaza';
import { KT_CSS, OKUYUCU_CSS } from './kutuphane/css';
import { ekranAdi, makaleMi, sonEkranYaz, useEkran, useKaynaklar, useKoleksiyonlar } from './kutuphane/durum';
import { Kitapligim } from './kutuphane/Kitapligim';
import { Koleksiyon } from './kutuphane/Koleksiyon';
import { Okuyucu } from './kutuphane/Okuyucu';
import { Yonet } from './kutuphane/Yonet';

export { isFilePath, guvenliAcmaTuru } from './kutuphane/Okuyucu';

const CSS = KT_CSS + OKUYUCU_CSS + TRANSLATE_CSS;

export function KutuphaneTab() {
  const s = useAppState();
  const ekran = useEkran();
  const makale = makaleMi(s.openArticlePath);
  const [arama, setArama] = useState(false);
  const sources = useKaynaklar(arama || ekran.ad === 'ara' || ekran.ad === 'koleksiyon' || makale);
  const k = useKoleksiyonlar(sources);

  // Makale açılmadan önceki iç ekran (okuyucunun "←" düğmesi oraya döner)
  if (!makale) sonEkranYaz(s.openArticlePath);

  if (makale) {
    const geri = ekranAdi(ekran, (id) => k.koleksiyonlar.find((c) => c.id === id)?.ad);
    return (
      <>
        <style>{CSS}</style>
        <Okuyucu key="article" refStr={s.openArticlePath!} geriAdi={geri} koleksiyonlar={k.koleksiyonlar} />
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {ekran.ad === 'koleksiyon' ? (
        <Koleksiyon key={ekran.id} id={ekran.id} k={k} sources={sources} />
      ) : ekran.ad === 'magaza' ? (
        <LibraryStore k={k} bolum={ekran.bolum} />
      ) : ekran.ad === 'yonet' ? (
        <Yonet k={k} />
      ) : (
        <Kitapligim k={k} sources={sources} arama={ekran.ad === 'ara'} onAramaBasla={() => setArama(true)} />
      )}
    </>
  );
}
