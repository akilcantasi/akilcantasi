// Koleksiyon ekranı: başlık kartı, bu koleksiyonda ara, "Okumaya başla" (ana sayfa) ya da kitap
// listesi (PDF kitaplıkları), son okunanlar ve Ayrıntılar (dosya, boyut; telefona kaydet / güncelle / sil).
import { useEffect, useState } from 'preact/hooks';
import { makeRef, type LibrarySource } from '../../lib/library';
import { canSaveToDevice, isActive } from '../../lib/downloader';
import { deleteDevicePack } from '../../lib/packs';
import { pct, startRow, startUpdate } from '../../lib/packs-ui';
import { loadNautilus, type NautilusBook } from '../../lib/zim/nautilus';
import { AramaKutusu, AramaSonuclari } from './Arama';
import { acMakale, listeKonumuAl } from './gezinme';
import { IcoBack, IcoDice, IcoTrash, IcoWifi, IcoDownload, KategoriIkon, IcoHome } from './ikonlar';
import { BookList } from './Okuyucu';
import { anaSayfaYaz, fmt, okunanlariSil, ustVeri, zamanOnce } from './veri';
import { setEkran, type Koleksiyon as Kol, type useKoleksiyonlar } from './durum';
import { randomLibraryArticle } from '../../lib/library';

type K = ReturnType<typeof useKoleksiyonlar>;

/** Koleksiyon ekranındaki arama (ekran değişince sıfırlanır) */
let sorgu = { id: '', q: '' };

export function Koleksiyon({ id, k, sources }: { id: string; k: K; sources: LibrarySource[] | undefined }) {
  const c = k.koleksiyonlar.find((x) => x.id === id);
  const [q, setQState] = useState(sorgu.id === id ? sorgu.q : '');
  const [enter, setEnter] = useState(0);
  const setQ = (v: string) => {
    sorgu = { id, q: v };
    setQState(v);
  };
  useEffect(() => {
    const y = listeKonumuAl();
    if (y) requestAnimationFrame(() => document.getElementById('main')?.scrollTo({ top: y }));
  }, []);

  const geri = (
    <div class="kt-top">
      <button class="kt-back" data-testid="lib-coll-back" aria-label="Geri: Kitaplığım" onClick={() => setEkran({ ad: 'ana' })}>
        <IcoBack />
        <span>Kitaplığım</span>
      </button>
    </div>
  );

  if (!c) {
    return (
      <div class="pad kt" data-testid="lib-coll-home">
        {geri}
        <p class="empty" data-testid="lib-coll-missing">
          {k.hazir ? 'Bu koleksiyon artık bu cihazda değil.' : 'Açılıyor…'}
        </p>
      </div>
    );
  }

  return (
    <div class={'pad kt kt-k-' + c.kategori} data-testid="lib-coll-home" data-src={c.id}>
      {geri}
      <header class="kt-banner">
        <div class="kt-banner-top">
          <span class="kt-card-ic" aria-hidden="true">
            <KategoriIkon k={c.kategori} size={26} />
          </span>
          <h1 data-testid="lib-meta-title">{c.ad}</h1>
        </div>
        {c.aciklama && <p>{c.aciklama}</p>}
        <div class="kt-banner-tags">
          {(c.src?.articleCount ?? c.meta?.count ?? 0) >= 20 ? <span data-testid="lib-meta-count">{(c.src?.articleCount ?? c.meta!.count).toLocaleString('tr-TR')} sayfa</span> : null}
          {c.dil && <span data-testid="lib-meta-lang">{c.dil}</span>}
          <span>{fmt(c.boyut)}</span>
          {c.bilgiNoktasi && (
            <span style="display:inline-flex;gap:4px;align-items:center">
              <IcoWifi size={12} /> Bilgi noktasından
            </span>
          )}
        </div>
      </header>

      {c.hata ? (
        <p class="kt-note" data-testid="lib-coll-error" style="font-size:14px;color:var(--text2)">
          Bu koleksiyon açılamadı. Dosya yarım inmiş ya da bozulmuş olabilir; silip yeniden indirmeyi deneyin. Ayrıntı aşağıda.
        </p>
      ) : (
        <AramaKutusu value={q} placeholder="Bu koleksiyonda ara" onInput={setQ} onEnter={() => setEnter((n) => n + 1)} onCancel={q ? () => setQ('') : undefined} />
      )}

      {q.trim() && !c.hata ? (
        <AramaSonuclari sources={sources} query={q} scope={c.id} koleksiyonlar={k.koleksiyonlar} enterSignal={enter} />
      ) : (
        <>
          {!c.hata && <Baslangic c={c} src={c.src ?? sources?.find((s) => s.id === c.id)} hazir={sources !== undefined} />}
          <BuradaOkunanlar k={k} id={c.id} />
          <Ayrintilar c={c} k={k} />
        </>
      )}
    </div>
  );
}

/** "Okumaya başla" + rastgele madde; kitap kitaplıklarında kitap listesi */
function Baslangic({ c, src, hazir }: { c: Kol; src?: LibrarySource; hazir: boolean }) {
  const [ana, setAna] = useState<{ path: string } | null | undefined>(undefined);
  const [books, setBooks] = useState<NautilusBook[] | null>(null);
  const [rnd, setRnd] = useState<'idle' | 'busy' | 'none'>('idle');
  useEffect(() => {
    if (!src) return;
    let alive = true;
    (async () => {
      const m = await src.zim.getMainPage().catch(() => null);
      if (!alive) return;
      if (m) anaSayfaYaz(src.id, m.path);
      // Nautilus kitaplığı (zimgit): ana sayfa yerine kitap listesi
      if (m && /\bhome(\.html)?$|^index\.html$/i.test(m.path)) {
        const b = await loadNautilus(src.zim).catch(() => null);
        if (!alive) return;
        if (b?.length) setBooks(b);
      }
      setAna(m ? { path: m.path } : null);
    })();
    return () => {
      alive = false;
    };
  }, [src]);

  if (!src) {
    return (
      <p class="empty" role="status" data-testid="lib-coll-loading">
        {hazir ? '' : 'Koleksiyon açılıyor…'}
      </p>
    );
  }
  const rastgele = async () => {
    setRnd('busy');
    const r = await randomLibraryArticle(src.id).catch(() => null);
    if (!r) return setRnd('none');
    setRnd('idle');
    acMakale(r.ref, { yeni: true });
  };
  if (books) {
    return (
      <section class="kt" style="gap:10px" aria-label="Kitaplar">
        <h2 class="kt-h2">
          Kitaplar <small>{books.length} kitap</small>
        </h2>
        <BookList src={src} kolAd={c.ad} books={books} baslik={false} />
      </section>
    );
  }
  return (
    <div class="kt" style="gap:8px">
      <div class="kt-actions">
        {ana && (
          <button class="btn primary kt-big" style="flex:1 1 100%" data-testid="lib-main" onClick={() => acMakale(makeRef(src.id, ana.path), { yeni: true })}>
            <IcoHome />
            Okumaya başla
          </button>
        )}
        <button class="btn" data-testid="lib-random" disabled={rnd === 'busy' || ana === undefined} onClick={rastgele}>
          <IcoDice />
          {rnd === 'busy' ? 'Seçiliyor…' : 'Rastgele bir sayfa'}
        </button>
      </div>
      {rnd === 'none' && <p class="kt-note">Açılabilecek bir sayfa bulunamadı.</p>}
      <p class="kt-note">"Okumaya başla" koleksiyonun giriş sayfasını açar; oradaki bağlantılarla gezinebilir ya da yukarıdan arayabilirsiniz.</p>
    </div>
  );
}

function BuradaOkunanlar({ k, id }: { k: K; id: string }) {
  const list = k.okunan.filter((o) => o.src === id).slice(0, 5);
  if (!list.length) return null;
  return (
    <section class="kt" style="gap:10px" aria-labelledby="kt-burada-h">
      <h2 class="kt-h2" id="kt-burada-h">
        Bu koleksiyonda son okunanlar
      </h2>
      <ul class="kt-list" data-testid="lib-coll-recent">
        {list.map((o) => (
          <li key={o.ref}>
            <button class="kt-row" data-testid="lib-recent-item" onClick={() => acMakale(o.ref, { yeni: true, y: o.y })}>
              <span class="kt-row-t">
                <b>{o.title}</b>
                <span>{zamanOnce(o.at)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Teknik bilgiler ve paket işlemleri (telefona kaydet, güncelle, sil) */
function Ayrintilar({ c, k }: { c: Kol; k: K }) {
  const [sor, setSor] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);
  const row = c.row;
  const dl = row ? k.dlFor(row) : undefined;
  const iniyor = isActive(dl);
  const meta = c.meta ?? ustVeri(c.id);
  const src = c.src;
  const kaydedilebilir = canSaveToDevice();
  return (
    <details class="kt-details" data-testid="lib-details" open={!!c.hata}>
      <summary>Ayrıntılar ve yönet</summary>
      <div class="kt-details-in">
        <dl class="kt-dl-list">
          <dt>Nerede</dt>
          <dd>{c.bilgiNoktasi ? 'Bilgi noktasında (telefonda değil)' : 'Bu telefonda'}</dd>
          <dt>Boyut</dt>
          <dd>{fmt(c.boyut)}</dd>
          {(src?.articleCount ?? meta?.count) ? (
            <>
              <dt>Sayfa</dt>
              <dd>{(src?.articleCount ?? meta!.count).toLocaleString('tr-TR')}</dd>
            </>
          ) : null}
          <dt>Metinde arama</dt>
          <dd>{(src?.hasFulltext ?? meta?.ft) ? 'Var (başlıkta olmayan kelimeler de bulunur)' : 'Yalnız başlıklarda'}</dd>
          {(src?.title ?? meta?.title) && (
            <>
              <dt>Özgün ad</dt>
              <dd>{src?.title ?? meta?.title}</dd>
            </>
          )}
          {row?.entry && (
            <>
              <dt>Kaynak</dt>
              <dd>
                {row.entry.source} · {row.entry.license}
              </dd>
            </>
          )}
          <dt>Dosya</dt>
          <dd data-testid="lib-details-file">{c.id}</dd>
          {c.hata && (
            <>
              <dt>Hata</dt>
              <dd>{c.hata}</dd>
            </>
          )}
        </dl>
        {iniyor && dl && <p class="kt-note">İndiriliyor: %{pct(dl)}</p>}
        {row?.outdated && row.entry && !iniyor && (
          <button class="btn primary" style="align-self:flex-start" data-testid="lib-coll-update" disabled={!kaydedilebilir && !row.server} onClick={() => startUpdate(row)}>
            Yeni sürümü indir ({fmt(row.entry.size)})
          </button>
        )}
        {c.bilgiNoktasi && row && kaydedilebilir && !iniyor && (
          <button class="btn primary" style="align-self:flex-start;display:inline-flex;align-items:center;gap:8px" data-testid="lib-coll-save" onClick={() => startRow(row)}>
            <IcoDownload />
            Telefona kaydet ({fmt(c.boyut)})
          </button>
        )}
        {!c.bilgiNoktasi && row?.device && (
          sor ? (
            <div class="kt-confirm" data-testid="lib-coll-delete-q">
              <p>
                "{c.ad}" bu telefondan silinsin mi? {fmt(c.boyut)} yer açılır. İsterseniz sonra yeniden indirebilirsiniz.
              </p>
              <div class="row" style="flex-wrap:wrap">
                <button class="btn" data-testid="lib-coll-delete-no" disabled={siliniyor} onClick={() => setSor(false)}>
                  Vazgeç
                </button>
                <button
                  class="btn"
                  data-testid="lib-coll-delete-yes"
                  disabled={siliniyor}
                  onClick={async () => {
                    setSiliniyor(true);
                    try {
                      await deleteDevicePack(row.device!.id);
                      okunanlariSil(c.id);
                      setEkran({ ad: 'ana' });
                    } finally {
                      setSiliniyor(false);
                    }
                  }}
                >
                  {siliniyor ? 'Siliniyor…' : 'Evet, sil'}
                </button>
              </div>
            </div>
          ) : (
            <button class="btn" style="align-self:flex-start;display:inline-flex;align-items:center;gap:8px" data-testid="lib-coll-delete" onClick={() => setSor(true)}>
              <IcoTrash />
              Telefondan sil
            </button>
          )
        )}
      </div>
    </details>
  );
}
