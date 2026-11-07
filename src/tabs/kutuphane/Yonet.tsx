// Yer aç ve yönet: telefondaki koleksiyonlar boyuta göre; silince ne kadar yer açılacağı yazılı,
// satır içi onay. Güncellemeler ve bilgi noktasındaki koleksiyonlar da burada.
import { useState } from 'preact/hooks';
import { deleteDevicePack } from '../../lib/packs';
import { UpdateBanner } from '../../lib/packs-ui';
import { go } from '../../lib/store';
import { IcoBack, IcoTrash, IcoWifi, KategoriIkon } from './ikonlar';
import { fmt, okunanlariSil, zamanOnce } from './veri';
import { setEkran, type Koleksiyon, type useKoleksiyonlar } from './durum';

type K = ReturnType<typeof useKoleksiyonlar>;

export function Yonet({ k }: { k: K }) {
  const telefonda = k.koleksiyonlar.filter((c) => !c.bilgiNoktasi).sort((a, b) => b.boyut - a.boyut);
  const uzakta = k.koleksiyonlar.filter((c) => c.bilgiNoktasi);
  const toplam = telefonda.reduce((a, c) => a + c.boyut, 0);
  const free = k.storage && k.storage.quota ? k.storage.quota - k.storage.usage : null;
  const zims = k.rows.filter((r) => r.kind === 'zim');
  return (
    <div class="pad kt" data-testid="lib-manage-panel">
      <div class="kt-top">
        <button class="kt-back" data-testid="lib-manage-back" aria-label="Geri: Kitaplığım" onClick={() => setEkran({ ad: 'ana' })}>
          <IcoBack />
          <span>Kitaplığım</span>
        </button>
      </div>
      <header>
        <h1 class="kt-h1">Yer aç ve yönet</h1>
        <p class="kt-sub">
          {toplam ? `Kitaplığınız telefonda ${fmt(toplam)} yer kaplıyor` : 'Telefonda kayıtlı koleksiyon yok'}
          {free != null && free > 0 ? ` · ${fmt(free)} boş` : ''}.
        </p>
      </header>
      {free != null && free > 0 && toplam > 0 && (
        <span class="kt-meter" aria-hidden="true">
          {telefonda.map((c) => (
            <i key={c.id} class="on" style={{ width: (c.boyut / (toplam + free)) * 100 + '%', borderRight: '2px solid var(--bg)' }} />
          ))}
        </span>
      )}
      <UpdateBanner rows={zims} dlFor={k.dlFor} />
      {telefonda.length ? (
        <div class="kt-man-wrap">
          {telefonda.map((c) => (
            <Satir key={c.id} c={c} />
          ))}
        </div>
      ) : null}
      {uzakta.length > 0 && (
        <>
          <h2 class="kt-h2">Bilgi noktasında</h2>
          <p class="kt-note">Bunlar telefonda yer kaplamaz; bilgi noktasına bağlıyken okunur.</p>
          <div class="kt-man-wrap">
            {uzakta.map((c) => (
              <div class={'kt-man kt-k-' + c.kategori} key={c.id}>
                <span class="kt-dot" aria-hidden="true">
                  <KategoriIkon k={c.kategori} size={18} />
                </span>
                <span class="kt-man-t">
                  <b>{c.ad}</b>
                  <span style="display:inline-flex;gap:4px;align-items:center">
                    <IcoWifi size={12} /> {fmt(c.boyut)}
                  </span>
                </span>
                <button class="btn" onClick={() => setEkran({ ad: 'koleksiyon', id: c.id })}>
                  Aç
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <p class="kt-note">
        Haritalar, Fener modelleri ve öteki dosyalar için{' '}
        <button class="kt-link" style="min-height:0;display:inline;padding:0" data-testid="lib-manage-tools" onClick={() => go.tool('paylas')}>
          Araçlar → Paketler
        </button>
        .
      </p>
    </div>
  );
}

function Satir({ c }: { c: Koleksiyon }) {
  const [sor, setSor] = useState(false);
  const [busy, setBusy] = useState(false);
  const dev = c.row?.device;
  return (
    <div class={'kt-man kt-k-' + c.kategori} style="flex-wrap:wrap" data-testid="pack-row" data-pack={c.id}>
      <span class="kt-dot" aria-hidden="true">
        <KategoriIkon k={c.kategori} size={18} />
      </span>
      <span class="kt-man-t">
        <b>{c.ad}</b>
        <span>
          {fmt(c.boyut)} · {c.sonOkuma ? `okundu: ${zamanOnce(c.sonOkuma)}` : 'hiç açılmadı'}
        </span>
      </span>
      {dev && !sor && (
        <button class="btn" style="display:inline-flex;align-items:center;gap:6px" data-testid="pack-delete" aria-label={`Sil: ${c.ad}`} onClick={() => setSor(true)}>
          <IcoTrash />
          Sil
        </button>
      )}
      {dev && sor && (
        <div class="kt-confirm" style="flex-basis:100%" data-testid="pack-delete-q">
          <p>
            "{c.ad}" silinsin mi? {fmt(c.boyut)} yer açılır.
          </p>
          <div class="row" style="flex-wrap:wrap">
            <button class="btn" data-testid="pack-delete-no" disabled={busy} onClick={() => setSor(false)}>
              Vazgeç
            </button>
            <button
              class="btn"
              data-testid="pack-delete-yes"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await deleteDevicePack(dev.id);
                  okunanlariSil(c.id);
                } finally {
                  setBusy(false);
                  setSor(false);
                }
              }}
            >
              {busy ? 'Siliniyor…' : 'Evet, sil'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
