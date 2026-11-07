// "Önerilen başlangıç seti" kartı (Kitaplığım boşken ve mağazanın başında): içindekiler, toplam boyut,
// telefona sığma ipucu ve tek düğme.
import { canSaveToDevice } from '../../lib/downloader';
import { kuyrugaEkle, useKuyruk } from '../../lib/indirme-kuyrugu';
import type { useKoleksiyonlar } from './durum';
import { IcoDownload, IcoSpark, KategoriIkon } from './ikonlar';
import { adOf } from './Indirmeler';
import { setKuyrugu, setlerOf } from './setler-ui';
import { fmt, gorunum, sigmaIpucu } from './veri';

type K = ReturnType<typeof useKoleksiyonlar>;

export function BaslangicKarti({ k }: { k: K }) {
  const sira = useKuyruk();
  const all = setlerOf(k.manifest, k.rows);
  const temel = all.durum[0];
  if (!temel) return null;
  const indir = setKuyrugu(temel, all, k.dlFor, sira);
  if (!indir.length) return null;
  const bytes = indir.reduce((a, r) => a + (r.size || 0), 0);
  const free = k.storage && k.storage.quota ? k.storage.quota - k.storage.usage : null;
  const fit = sigmaIpucu(bytes, free);
  const ok = canSaveToDevice();
  const kismen = temel.have > 0 || indir.length < temel.total;
  return (
    <section class="kt-starter" data-testid="lib-starter" aria-labelledby="kt-starter-h">
      <div class="kt-starter-top">
        <span class="kt-empty-ic" style="width:44px;height:44px;border-radius:14px;flex-shrink:0" aria-hidden="true">
          <IcoSpark />
        </span>
        <div>
          <b id="kt-starter-h">{kismen ? 'Başlangıç setini tamamlayın' : 'Önerilen başlangıç seti'}</b>
          <span>Çoğu kişi için ilk iniş: Türkçe ansiklopedi, ilaç rehberi, su ve gıda kitapları.</span>
        </div>
      </div>
      <p class={'kt-note kt-fit-' + fit.duzey} style="margin:0" data-testid="lib-starter-fit">
        {kismen ? 'Kalan' : 'Toplam'} {fmt(bytes)} · {fit.metin}
      </p>
      <button class="btn primary kt-big" data-testid="lib-starter-dl" disabled={!ok || fit.duzey === 'yer-yok'} onClick={() => kuyrugaEkle(indir)}>
        <IcoDownload />
        {kismen ? 'Kalanları indir' : 'Başlangıç setini indir'} ({fmt(bytes)})
      </button>
      <p class="kt-note" style="margin:0;font-weight:600;color:var(--text2)">İçinde neler var</p>
      <ul>
        {indir.slice(0, 5).map((r) => {
          const g = gorunum(r.file, r.entry, null);
          return (
            <li key={r.key} class={'kt-k-' + g.kategori}>
              <span class="kt-dot" aria-hidden="true">
                <KategoriIkon k={g.kategori} size={15} />
              </span>
              <span>
                {adOf(r)}
                {g.dil ? ` (${g.dil})` : ''}
              </span>
              <small>{fmt(r.size)}</small>
            </li>
          );
        })}
        {indir.length > 5 && <li class="kt-note">ve {indir.length - 5} içerik daha</li>}
      </ul>
      <p class="kt-note" style="margin:0">
        Wi-Fi'da indirmeniz önerilir. İnerken uygulamayı kullanmaya devam edebilirsiniz; inenler Kitaplığım'da görünür.
      </p>
    </section>
  );
}
