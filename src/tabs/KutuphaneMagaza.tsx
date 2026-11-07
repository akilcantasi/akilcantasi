// Kütüphane → İçerik indir (mağaza): ihtiyaca göre düzenlenmiş katalog.
//  • Boş yer çubuğu ve süren indirmeler (duraklat / devam / iptal)
//  • Önerilen başlangıç seti (tek düğme)
//  • Mağazada ara + bölümler: Sağlık ve ilk yardım, Genel bilgi, Su ve yemek, Afet ve hayatta kalma,
//    Kendin yap ve onarım, Kitaplar, Sözlük ve dil (her bölüm ilk 3 + "Tümünü göster")
//  • Her öğe: ad, açıklama, boyut + telefona sığma ipucu, dil; tek düğme (İndir → ilerleme → Oku).
//    Dosya adı, kaynak, lisans, indirme adresi sayısı "Ayrıntılar"da.
//  • Hazır setler ve "Boş yerime göre seç", Kendine Yetmek rehberleri, dosyadan ekleme
import { useMemo, useState } from 'preact/hooks';
import { usePackGuides, packInfoForFile } from '../content/pack-guides';
import { TIER_LABEL } from '../lib/manifest';
import { pct, startRow, startUpdate, type RowModel } from '../lib/packs-ui';
import { canSaveToDevice, cancelDownload, isActive, pauseDownload, type DlState } from '../lib/downloader';
import { go } from '../lib/store';
import { foldCharwise } from '../lib/zim';
import { hazir, sigdir, toplam } from '../lib/setler';
import { kuyrugaEkle, useKuyruk } from '../lib/indirme-kuyrugu';
import { setEkran, type useKoleksiyonlar } from './kutuphane/durum';
import { BaslangicKarti } from './kutuphane/BaslangicKarti';
import { DosyadanEkle } from './kutuphane/Ekle';
import { IndirmeListesi, adOf, useIndirmeler } from './kutuphane/Indirmeler';
import { IcoBack, IcoDownload, IcoFind, IcoPause, IcoPlay, IcoX, KategoriIkon } from './kutuphane/ikonlar';
import { setKuyrugu, setlerOf } from './kutuphane/setler-ui';
import { IHTIYACLAR, fmt, gorunum, ihtiyacOf, kalanSure, sigmaIpucu, type Ihtiyac } from './kutuphane/veri';

/** Eski dışa aktarım (biçem artık kutuphane/css.ts içinde) */
export const MAGAZA_CSS = '';

type K = ReturnType<typeof useKoleksiyonlar>;

/** Bölüm içi sıra: önerilenler, sonra küçükten büyüğe */
function siraPuan(r: RowModel): number {
  const e = r.entry;
  const t = e?.featured ? 0 : e?.tier === 'temel' ? 1 : e?.tier === 'standart' ? 2 : 3;
  return t * 1e13 + (r.size || 0);
}

let acikBolumler = new Set<Ihtiyac>();
let magazaSorgu = '';

export function LibraryStore({ k, bolum }: { k: K; bolum?: Ihtiyac }) {
  const [q, setQState] = useState(magazaSorgu);
  const setQ = (v: string) => setQState((magazaSorgu = v));
  const [acik, setAcik] = useState<Set<Ihtiyac>>(() => new Set([...acikBolumler, ...(bolum ? [bolum] : [])]));
  const [fitSor, setFitSor] = useState(false);
  const sira = useKuyruk();
  usePackGuides();

  const all = setlerOf(k.manifest, k.rows);
  const indirmeler = useIndirmeler(k.rows, k.dlFor);
  const free = k.storage && k.storage.quota ? k.storage.quota - k.storage.usage : null;
  const ok = canSaveToDevice();

  const gruplar = useMemo(() => {
    const m = new Map<Ihtiyac, RowModel[]>();
    for (const r of all.zims) {
      if (!r.entry) continue;
      const n = ihtiyacOf(r.entry);
      m.set(n, [...(m.get(n) ?? []), r]);
    }
    for (const v of m.values()) v.sort((a, b) => siraPuan(a) - siraPuan(b));
    return m;
  }, [all.zims]);

  const fq = foldCharwise(q.trim());
  const bulunan = fq
    ? all.zims.filter((r) => r.entry && foldCharwise(`${r.entry.name} ${r.entry.desc} ${r.entry.source}`).includes(fq)).sort((a, b) => siraPuan(a) - siraPuan(b))
    : [];

  const rehberler = k.rows
    .filter((r) => r.kind === 'rehber')
    .map((r) => {
      const info = !r.entry && r.device ? packInfoForFile(r.device.id) : null;
      return info ? { ...r, name: info.name, desc: `${info.guides} rehber · ${info.desc}` } : r;
    });

  const toggle = (n: Ihtiyac) => {
    const s = new Set(acik);
    if (s.has(n)) s.delete(n);
    else s.add(n);
    acikBolumler = s;
    setAcik(s);
  };
  const git = (n: Ihtiyac) => {
    document.getElementById('kt-sec-' + n)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  // "Boş yerime göre seç": setler sırayla, boş yere sığdığı kadar (yüklüler ve inenler düşülür)
  const sigan = sigdir(all.setler, all.byId, free);
  const fitRows = (() => {
    const seen = new Set<string>();
    const out: RowModel[] = [];
    for (const d of all.durum) {
      if (!sigan.includes(d.set.id)) continue;
      for (const r of setKuyrugu(d, all, k.dlFor, sira)) if (!seen.has(r.file)) (seen.add(r.file), out.push(r));
    }
    return out;
  })();

  if (!k.manifest) {
    return (
      <div class="pad kt" data-testid="lib-store">
        <p class="empty">Katalog yükleniyor…</p>
      </div>
    );
  }

  const kitaplik = all.zims.filter(hazir).reduce((a, r) => a + (r.device?.size ?? 0), 0);

  return (
    <div class="pad kt" data-testid="lib-store">
      <div class="kt-top">
        <button class="kt-back" data-testid="lib-store-back" aria-label="Geri: Kitaplığım" onClick={() => setEkran({ ad: 'ana' })}>
          <IcoBack />
          <span>Kitaplığım</span>
        </button>
      </div>
      <header>
        <h1 class="kt-h1">İçerik indir</h1>
        <p class="kt-sub">Bir kez indirin, internet olmadan okuyun. İnenler Kitaplığım'da görünür.</p>
      </header>

      {free != null && free > 0 && (
        <div class="kt-store-free" data-testid="lib-status">
          <div>
            <span>
              Telefonunuzda <b>{fmt(free)}</b> boş
            </span>
            {kitaplik > 0 && <span>Kitaplığınız {fmt(kitaplik)}</span>}
          </div>
          {kitaplik > 0 && (
            <span class="kt-meter" aria-hidden="true">
              <i class="on" style={{ width: Math.min(100, (kitaplik / (free + kitaplik)) * 100) + '%' }} />
            </span>
          )}
        </div>
      )}
      {!ok && <p class="kt-note">Bu bağlantı güvenli değil (http); içerik telefona kaydedilemez, bilgi noktasından okunur.</p>}

      <IndirmeListesi list={indirmeler} />
      <BaslangicKarti k={k} />

      <div class="kt-search" role="search">
        <div class="kt-search-box">
          <IcoFind />
          <input
            class="input"
            type="search"
            data-testid="lib-store-q"
            aria-label="Mağazada ara"
            placeholder="Mağazada ara: ilaç, su, tamir…"
            value={q}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            autocomplete="off"
            spellcheck={false}
          />
          {q && (
            <button class="kt-search-x" aria-label="Aramayı temizle" onClick={() => setQ('')}>
              <IcoX />
            </button>
          )}
        </div>
      </div>

      {fq ? (
        <section class="kt-sec" data-testid="lib-store-results">
          <h2 class="kt-h2">
            Sonuçlar <small>{bulunan.length} içerik</small>
          </h2>
          {bulunan.map((r) => (
            <Oge key={r.key} r={r} dl={k.dlFor(r)} sira={sira} free={free} />
          ))}
          {!bulunan.length && <p class="empty">"{q.trim()}" için içerik bulunamadı. Daha genel bir kelime deneyin (ör. "sağlık", "kitap").</p>}
        </section>
      ) : (
        <>
          <div class="kt-needs" role="navigation" aria-label="Bölümler">
            {IHTIYACLAR.filter((n) => gruplar.get(n.id)?.length).map((n) => (
              <button key={n.id} class="chip" data-testid="lib-need" data-need={n.id} onClick={() => git(n.id)}>
                {n.ad}
              </button>
            ))}
          </div>
          {IHTIYACLAR.map((n) => {
            const list = gruplar.get(n.id) ?? [];
            if (!list.length) return null;
            const hepsi = acik.has(n.id);
            const gorunen = hepsi ? list : list.slice(0, 3);
            return (
              <section key={n.id} id={'kt-sec-' + n.id} class={'kt-sec kt-k-' + n.kategori} data-testid="lib-store-sec" data-need={n.id} aria-labelledby={'kt-sec-h-' + n.id}>
                <div class="kt-sec-h">
                  <span class="kt-dot" aria-hidden="true">
                    <KategoriIkon k={n.kategori} size={20} />
                  </span>
                  <div>
                    <b id={'kt-sec-h-' + n.id}>{n.ad}</b>
                    <span>{n.alt}</span>
                  </div>
                </div>
                {gorunen.map((r) => (
                  <Oge key={r.key} r={r} dl={k.dlFor(r)} sira={sira} free={free} />
                ))}
                {list.length > 3 && (
                  <button class="btn" data-testid="lib-store-more" aria-expanded={hepsi} onClick={() => toggle(n.id)}>
                    {hepsi ? 'Daha az göster' : `Tümünü göster (${list.length})`}
                  </button>
                )}
              </section>
            );
          })}

          <section class="kt-sec" aria-labelledby="kt-sets-h" data-testid="lib-sets">
            <h2 class="kt-h2" id="kt-sets-h">
              Hazır setler <small>telefondakiler düşülür</small>
            </h2>
            <div class="kt-sets">
              {all.durum.slice(1).map((d) => {
                const indir = setKuyrugu(d, all, k.dlFor, sira);
                const kalan = toplam(indir);
                const inen = d.rows.filter((r) => isActive(k.dlFor(r)) || sira.includes(r.file)).length;
                return (
                  <div class="kt-set" key={d.set.id} data-testid="lib-set" data-set={d.set.id}>
                    <b>{d.set.title}</b>
                    <p>{d.set.desc}</p>
                    <div class="kt-item-b">
                      <span data-testid="lib-set-status">
                        {d.complete ? `Hepsi hazır (${d.total})` : `${d.have}/${d.total} hazır${inen ? ` · ${inen} iniyor` : ''}`}
                      </span>
                      {d.complete ? (
                        <span class="ok" style="color:var(--ok);font-weight:600">Tamam ✓</span>
                      ) : indir.length ? (
                        <button class="btn" data-testid="lib-set-dl" disabled={!ok} onClick={() => kuyrugaEkle(indir)}>
                          <IcoDownload />
                          İndir ({fmt(kalan)})
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {ok && fitRows.length > 0 && (
              fitSor ? (
                <div class="kt-confirm" data-testid="lib-pick-fit-q">
                  <p>
                    Boş yerinize göre {fitRows.length} içerik seçildi, toplam {fmt(toplam(fitRows))}. İndirme sonrası{' '}
                    {free != null ? fmt(free - toplam(fitRows)) : 'bir miktar'} boş kalır. İndirilsin mi?
                  </p>
                  <div class="row" style="flex-wrap:wrap">
                    <button class="btn" data-testid="lib-pick-fit-no" onClick={() => setFitSor(false)}>
                      Vazgeç
                    </button>
                    <button
                      class="btn primary"
                      data-testid="lib-pick-fit-yes"
                      onClick={() => {
                        kuyrugaEkle(fitRows);
                        setFitSor(false);
                      }}
                    >
                      İndir
                    </button>
                  </div>
                </div>
              ) : (
                <button class="kt-link" data-testid="lib-pick-fit" onClick={() => setFitSor(true)}>
                  Boş yerime göre seç →
                </button>
              )
            )}
          </section>

          <section class="kt-sec kt-k-hayatta" aria-labelledby="kt-rehber-h" data-testid="lib-rehber">
            <div class="kt-sec-h">
              <span class="kt-dot" aria-hidden="true">
                <KategoriIkon k="kitap" size={20} />
              </span>
              <div>
                <b id="kt-rehber-h">Kendine Yetmek rehberleri</b>
                <span>Yiyecek, su, barınak, alet ve tarım üzerine adım adım, çizimli rehberler. İnenler Rehber sekmesinde görünür.</span>
              </div>
            </div>
            {rehberler.map((r) => (
              <Oge key={r.key} r={r} dl={k.dlFor(r)} sira={sira} free={free} />
            ))}
            {!rehberler.length && <p class="kt-note">Katalogda henüz rehber paketi yok; elinizdeki .rehber.json dosyasını aşağıdan ekleyebilirsiniz.</p>}
          </section>
        </>
      )}

      <section class="kt-sec" aria-labelledby="kt-ekle-h">
        <h2 class="kt-h2" id="kt-ekle-h">
          Başka bir yerden
        </h2>
        <p class="kt-note">
          Bilgisayarda ya da başka bir telefonda indirilmiş bir koleksiyon (.zim) ya da rehber paketi (.rehber.json) varsa ekleyebilirsiniz. Haritalar ve Fener modelleri için{' '}
          <button class="kt-link" style="min-height:0;display:inline;padding:0" data-testid="lib-manage" onClick={() => go.tool('paylas')}>
            Araçlar → Paketler
          </button>
          .
        </p>
        <DosyadanEkle />
      </section>
    </div>
  );
}

/** Mağaza öğesi: tek, duruma göre değişen düğme; teknik ayrıntılar katlanmış */
function Oge({ r, dl, sira, free }: { r: RowModel; dl?: DlState; sira: string[]; free: number | null }) {
  const ok = canSaveToDevice();
  const g = gorunum(r.file, r.entry, null);
  const size = r.device?.size ?? r.server?.size ?? r.size;
  const fit = sigmaIpucu(r.size || size, free);
  const active = isActive(dl);
  const queued = !active && sira.includes(r.file);
  const ready = !!r.device || (!!r.server && !dl);
  const durum = active ? 'iniyor' : queued ? 'sirada' : dl?.status === 'paused' ? 'duraklatildi' : dl?.status === 'error' ? 'hata' : r.device ? 'telefonda' : r.server ? 'bilgi-noktasi' : 'yok';
  const oku = () => (r.kind === 'rehber' ? go.category(null) : setEkran({ ad: 'koleksiyon', id: (r.device ?? r.server)!.id }));
  const ad = r.kind === 'rehber' && !r.entry ? r.name : adOf(r);
  const p = dl ? pct(dl) : 0;

  let alt: preact.ComponentChildren = null;
  let dugme: preact.ComponentChildren = null;
  if (durum === 'iniyor' && dl) {
    const kalan = kalanSure(dl.received, dl.total, dl.speed ?? 0);
    alt =
      dl.status === 'hashing' || dl.status === 'verifying'
        ? 'Bozuk olmadığı denetleniyor…'
        : `İndiriliyor %${p} · ${fmt(dl.received)} / ${fmt(dl.total || r.size)}${kalan ? ' · ' + kalan : ''}${dl.remote ? ' · bilgi noktası indiriyor' : ''}`;
    dugme = (
      <>
        <button class="btn" data-testid="lib-store-pause" onClick={() => pauseDownload(dl.file)}>
          <IcoPause />
          Duraklat
        </button>
        <button class="kt-ib" aria-label={`İptal: ${ad}`} data-testid="lib-store-cancel" onClick={() => cancelDownload(dl.file)}>
          <IcoX />
        </button>
      </>
    );
  } else if (durum === 'sirada') {
    alt = 'Sırada; öncekiler bitince başlar';
  } else if (durum === 'duraklatildi' && dl) {
    alt = `Duraklatıldı %${p} · kaldığı yerden sürer`;
    dugme = (
      <>
        <button class="btn primary" data-testid="lib-store-resume" onClick={() => startRow(r)}>
          <IcoPlay />
          Devam et
        </button>
        <button class="kt-ib" aria-label={`İptal: ${ad}`} data-testid="lib-store-cancel" onClick={() => cancelDownload(dl.file)}>
          <IcoX />
        </button>
      </>
    );
  } else if (durum === 'hata' && dl) {
    alt = 'Yarıda kaldı: ' + (dl.error ?? 'bağlantı kesildi');
    dugme = (
      <>
        <button class="btn primary" data-testid="lib-store-resume" onClick={() => startRow(r)}>
          Tekrar dene
        </button>
        {dl.received > 0 && (
          <button class="kt-ib" aria-label={`Sil: ${ad}`} data-testid="lib-store-cancel" onClick={() => cancelDownload(dl.file)}>
            <IcoX />
          </button>
        )}
      </>
    );
  } else if (r.outdated && r.entry && ready) {
    alt = <span class="ok">Hazır · yeni sürümü var</span>;
    dugme = (
      <>
        <button class="btn" data-testid="lib-store-read" onClick={oku}>
          Oku
        </button>
        <button class="btn primary" data-testid="lib-store-update" disabled={!ok && !r.server} onClick={() => startUpdate(r)}>
          Güncelle ({fmt(r.entry.size)})
        </button>
      </>
    );
  } else if (durum === 'telefonda' || durum === 'bilgi-noktasi') {
    alt = <span class="ok">{durum === 'telefonda' ? '✓ Telefonda' : '✓ Bilgi noktasında'}</span>;
    dugme = (
      <>
        <button class="btn primary" data-testid="lib-store-read" onClick={oku}>
          Oku
        </button>
        {durum === 'bilgi-noktasi' && ok && (
          <button class="btn" data-testid="lib-store-dl" onClick={() => kuyrugaEkle([r])}>
            Telefona kaydet
          </button>
        )}
      </>
    );
  } else {
    alt = ok ? null : 'Bu bağlantıda indirilemez';
    dugme = ok ? (
      <button class="btn primary" data-testid="lib-store-dl" disabled={fit.duzey === 'yer-yok'} onClick={() => kuyrugaEkle([r])} aria-label={`İndir: ${ad}, ${fmt(size)}`}>
        <IcoDownload />
        İndir
      </button>
    ) : null;
  }

  return (
    <div class={'kt-item' + (ready ? ' ready' : '')} data-testid="lib-store-item" data-pack={r.file} data-state={durum}>
      <div class="kt-item-t">
        <b>{ad}</b>
        {(r.entry?.desc || r.desc) && <span>{r.entry?.desc || r.desc}</span>}
      </div>
      <div class="kt-item-m">
        <span>{size ? (r.sizeApprox && !ready ? '~' : '') + fmt(size) : 'boyut bilinmiyor'}</span>
        {!ready && durum === 'yok' && size > 0 && <span class={'kt-fit-' + fit.duzey}>· {fit.metin}</span>}
        {g.dil && <span class="tag">{g.dil}</span>}
        {r.entry?.featured && <span class="tag" style="color:var(--accent2)">Önerilen</span>}
      </div>
      {(active || durum === 'duraklatildi') && dl && (
        <div class="progress" role="progressbar" aria-label={`${ad} indiriliyor`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p}>
          <div style={{ width: (dl.status === 'verifying' ? 100 : p) + '%' }} />
        </div>
      )}
      {(alt || dugme) && (
        <div class="kt-item-b">
          <span class="grow" data-testid="lib-store-state">
            {alt}
          </span>
          {dugme}
        </div>
      )}
      {r.entry && (
        <details class="kt-details" data-testid="lib-store-details">
          <summary>Ayrıntılar</summary>
          <div class="kt-details-in">
            <dl class="kt-dl-list">
              <dt>Kaynak</dt>
              <dd>{r.entry.source}</dd>
              <dt>Lisans</dt>
              <dd>{r.entry.license}</dd>
              <dt>Düzey</dt>
              <dd>{TIER_LABEL[r.entry.tier]}</dd>
              {r.entry.minRamGB ? (
                <>
                  <dt>Bellek</dt>
                  <dd>{r.entry.minRamGB} GB ve üstü önerilir</dd>
                </>
              ) : null}
              <dt>Dosya</dt>
              <dd>{(r.device ?? r.server)?.id ?? r.entry.file}</dd>
              <dt>İndirme</dt>
              <dd>
                {r.entry.urls.length} adresten{r.entry.sha256 ? ', bozulmaya karşı denetlenir' : ''}
              </dd>
            </dl>
          </div>
        </details>
      )}
    </div>
  );
}
