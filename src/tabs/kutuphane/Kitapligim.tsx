// Kitaplığım: indirilen koleksiyonlar (büyük kartlar), kaldığın yerden devam, son okunanlar,
// süren indirmeler ve birleşik arama. Boşsa: önerilen başlangıç seti.
import { useEffect, useState } from 'preact/hooks';
import type { LibrarySource } from '../../lib/library';
import { canSaveToDevice } from '../../lib/downloader';
import { AramaBaslangic, AramaKutusu, AramaSonuclari } from './Arama';
import { DosyadanEkle } from './Ekle';
import { acMakale, listeKonumuAl } from './gezinme';
import { IcoInfo, IcoPlus, IcoRight, IcoWifi, KategoriIkon } from './ikonlar';
import { IndirmeOzeti, useIndirmeler } from './Indirmeler';
import { BaslangicKarti } from './BaslangicKarti';
import { fmt, okunanYuzde, zamanOnce, type Okunan } from './veri';
import { getAnaSorgu, setAnaSorgu, setEkran, type Koleksiyon, type useKoleksiyonlar } from './durum';

type K = ReturnType<typeof useKoleksiyonlar>;

export function Kitapligim({ k, sources, arama: mod, onAramaBasla }: { k: K; sources: LibrarySource[] | undefined; arama: boolean; onAramaBasla: () => void }) {
  const [q, setQState] = useState(getAnaSorgu);
  const [enter, setEnter] = useState(0);
  const setQ = (v: string) => {
    setAnaSorgu(v);
    setQState(v);
  };
  /** Arama ekranı geçmişe kayıtlıdır: Vazgeç ve Android geri tuşu Kitaplığım'a döner */
  const cancel = () => {
    setQ('');
    (document.activeElement as HTMLElement | null)?.blur?.();
    if (mod) setEkran({ ad: 'ana' });
  };
  useEffect(() => {
    if (mod) onAramaBasla();
    // Kitaplığım'a dönülünce (Vazgeç, geri tuşu) kutu boşalır; sorgu yalnız arama ekranında yaşar
    else if (getAnaSorgu()) setQ('');
  }, [mod]);
  // Makaleden dönünce liste kaldığı yere
  useEffect(() => {
    const y = listeKonumuAl();
    if (y) requestAnimationFrame(() => document.getElementById('main')?.scrollTo({ top: y }));
  }, []);

  const indirmeler = useIndirmeler(k.rows, k.dlFor);
  const list = k.koleksiyonlar;
  const bos = k.hazir && list.length === 0;

  return (
    <div class="pad kt" data-testid="lib-home" data-state={!k.hazir ? 'loading' : bos ? 'empty' : 'ready'}>
      {!mod && (
        <header>
          <h1 class="kt-h1">Kitaplığım</h1>
          <p class="kt-sub">
            {bos
              ? 'İnternet olmadan okunan bilgiler'
              : list.length
                ? `${list.length} koleksiyon · internetsiz okunur`
                : 'Hazırlanıyor…'}
          </p>
        </header>
      )}

      {!bos && (
        <AramaKutusu
          value={q}
          placeholder="Kitaplığımda ara"
          onInput={(v) => {
            setQ(v);
            if (!mod) setEkran({ ad: 'ara' });
          }}
          onFocus={() => {
            onAramaBasla();
            if (!mod) setEkran({ ad: 'ara' });
          }}
          onEnter={() => setEnter((n) => n + 1)}
          onCancel={mod ? cancel : undefined}
        />
      )}

      {mod ? (
        q.trim() ? (
          <AramaSonuclari sources={sources} query={q} koleksiyonlar={list} enterSignal={enter} onStore={() => setEkran({ ad: 'magaza' })} />
        ) : (
          <AramaBaslangic onPick={setQ} />
        )
      ) : !k.hazir ? (
        <div class="kt-grid" data-testid="lib-loading" aria-label="Kitaplık açılıyor">
          <div class="kt-skel" />
          <div class="kt-skel" />
        </div>
      ) : bos ? (
        <BosKitaplik k={k} indirmeler={indirmeler.length > 0} />
      ) : (
        <>
          <IndirmeOzeti list={indirmeler} onOpen={() => setEkran({ ad: 'magaza' })} />
          {list.some((x) => x.bilgiNoktasi) && (
            <p class="kt-note" data-testid="lib-infopoint-note" style="display:flex;gap:8px;align-items:flex-start">
              <IcoWifi size={18} />
              <span>
                {list.every((x) => x.bilgiNoktasi)
                  ? 'Bir bilgi noktasına bağlısınız: bu koleksiyonlar o cihazdan okunuyor. '
                  : 'Bir bilgi noktasına bağlısınız: işaretli koleksiyonlar o cihazdan okunuyor. '}
                Ayrıldıktan sonra da okumak için koleksiyonu açıp "Telefona kaydet"e dokunun.
              </span>
            </p>
          )}
          <DevamKarti k={k} />
          <section class="kt" style="gap:10px" aria-labelledby="kt-kol-h">
            <h2 class="kt-h2" id="kt-kol-h">
              Koleksiyonlarım
            </h2>
            <div class="kt-grid" data-testid="lib-collections">
              {sirala(list).map((c) => (
                <KoleksiyonKarti key={c.id} c={c} rozet={c.bilgiNoktasi && !list.every((x) => x.bilgiNoktasi)} />
              ))}
              <button class="kt-card add" data-testid="lib-open-store" onClick={() => setEkran({ ad: 'magaza' })}>
                <span class="kt-card-ic">
                  <IcoPlus />
                </span>
                <span class="kt-card-t">Yeni içerik indir</span>
                <span class="kt-card-m" style="color:var(--muted)">
                  Sağlık, ansiklopedi, kitaplar…
                </span>
              </button>
            </div>
          </section>
          <SonOkunanlar k={k} />
          <div class="kt-links">
            <button class="kt-link" data-testid="lib-open-manage" onClick={() => setEkran({ ad: 'yonet' })}>
              Yer aç ve yönet →
            </button>
          </div>
          {sources && k.koleksiyonlar.some((c) => c.hata) && (
            <p class="kt-note" data-testid="lib-error">
              Bazı koleksiyonlar açılamadı; ayrıntı için karta dokunun.
            </p>
          )}
        </>
      )}
    </div>
  );
}

/** Son okunan önce, ardından katalog sırası */
function sirala(list: Koleksiyon[]): Koleksiyon[] {
  return list
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.sonOkuma - a.c.sonOkuma || a.i - b.i)
    .map((x) => x.c);
}

function KoleksiyonKarti({ c, rozet }: { c: Koleksiyon; rozet: boolean }) {
  const alt = [fmt(c.boyut), c.dil].filter(Boolean).join(' · ');
  return (
    <button
      class={`kt-card kt-k-${c.kategori}${c.hata ? ' err' : ''}`}
      data-testid="lib-coll"
      data-src={c.id}
      onClick={() => setEkran({ ad: 'koleksiyon', id: c.id })}
    >
      <span class="kt-card-ic" aria-hidden="true">
        <KategoriIkon k={c.kategori} size={22} />
      </span>
      {rozet && (
        <span class="kt-card-badge" title="Bilgi noktasından okunuyor">
          <IcoWifi size={12} />
          Bilgi noktası
        </span>
      )}
      <span class="kt-card-t">{c.ad}</span>
      <span class="kt-card-m">
        <span>{alt}</span>
        <span>{c.hata ? 'Açılamadı' : c.sonOkuma ? `Okundu: ${zamanOnce(c.sonOkuma)}` : 'Henüz açılmadı'}</span>
      </span>
    </button>
  );
}

function okunanKoleksiyon(k: K, o: Okunan) {
  return k.koleksiyonlar.find((c) => c.id === o.src);
}

function DevamKarti({ k }: { k: K }) {
  const o = k.okunan.find((x) => okunanKoleksiyon(k, x));
  if (!o) return null;
  const c = okunanKoleksiyon(k, o)!;
  const yuzde = okunanYuzde(o);
  return (
    <button class={'kt-cont kt-k-' + c.kategori} data-testid="lib-continue" data-ref={o.ref} onClick={() => acMakale(o.ref, { yeni: true, y: o.y })}>
      <span class="kt-cont-ic" aria-hidden="true">
        <KategoriIkon k={c.kategori} size={24} />
      </span>
      <span class="kt-cont-t">
        <small>KALDIĞIN YERDEN DEVAM ET</small>
        <b>{o.title}</b>
        <span>
          {c.ad} · {o.page ? `${o.page}. sayfa · ` : ''}
          {zamanOnce(o.at)}
        </span>
        {yuzde !== null && yuzde > 0 && (
          <span class="kt-bar5" aria-hidden="true">
            <i style={{ width: yuzde + '%' }} />
          </span>
        )}
      </span>
      <span class="kt-cont-go" aria-hidden="true">
        <IcoRight />
      </span>
    </button>
  );
}

function SonOkunanlar({ k }: { k: K }) {
  const list = k.okunan.filter((x) => okunanKoleksiyon(k, x)).slice(1, 6);
  if (!list.length) return null;
  return (
    <section class="kt" style="gap:10px" aria-labelledby="kt-son-h">
      <h2 class="kt-h2" id="kt-son-h">
        Son okunanlar
      </h2>
      <ul class="kt-list" data-testid="lib-recent">
        {list.map((o) => {
          const c = okunanKoleksiyon(k, o)!;
          return (
            <li key={o.ref}>
              <button class={'kt-row kt-k-' + c.kategori} data-testid="lib-recent-item" data-ref={o.ref} onClick={() => acMakale(o.ref, { yeni: true, y: o.y })}>
                <span class="kt-dot" aria-hidden="true">
                  <KategoriIkon k={c.kategori} size={18} />
                </span>
                <span class="kt-row-t">
                  <b>{o.title}</b>
                  <span>
                    {c.ad} · {zamanOnce(o.at)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Hiç içerik yok: tek ana eylem "başlangıç setini indir" */
function BosKitaplik({ k, indirmeler }: { k: K; indirmeler: boolean }) {
  const ok = canSaveToDevice();
  const liste = useIndirmeler(k.rows, k.dlFor);
  return (
    <div class="kt" data-testid="lib-empty">
      <p class="kt-note" style="font-size:14.5px;color:var(--text2)" data-testid="lib-empty-text">
        {indirmeler ? 'İlk içerikleriniz iniyor; bitince burada görünecek. ' : 'Kitaplığınız boş. '}
        Ansiklopedi, ilaç rehberi, su arıtma ve ilk yardım kitaplarını bir kez indirin; sonra internet olmadan, her yerde okuyun.
      </p>
      <IndirmeOzeti list={liste} onOpen={() => setEkran({ ad: 'magaza' })} />
      {!indirmeler && <BaslangicKarti k={k} />}
      <button class="btn kt-big" data-testid="lib-open-store" onClick={() => setEkran({ ad: 'magaza' })}>
        Neler var, göz at
      </button>
      {!ok && (
        <p class="kt-note" style="display:flex;gap:8px">
          <IcoInfo />
          <span>Bu bağlantıda (http) içerik telefona kaydedilemez. Bir bilgi noktasına bağlıysanız, oradaki koleksiyonlar burada kendiliğinden görünür.</span>
        </p>
      )}
      {ok && (
        <p class="kt-note">Yakında bir Akıl Çantası bilgi noktası varsa, onun Wi-Fi ağına bağlanın: oradaki koleksiyonlar burada kendiliğinden görünür.</p>
      )}
      <DosyadanEkle link />
    </div>
  );
}
