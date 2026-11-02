// Fener model paneli: hangi modeller indirildi, hangisi etkin, istenen model seçilir;
// katalogdaki diğer modeller buradan doğrudan indirilir.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { go, useAppState } from '../lib/store';
import { formatSize, type InstalledPack } from '../lib/packs';
import { deviceProfile, engine, fitFor, fitForGroup, getModelOverride, getNativeInfo, listModels, loadNativeInfo, setModelOverride, type ModelGroup } from '../lib/fener/engine';
import { chooseModel, FIT_LABEL } from '../lib/fener/models';
import { loadManifest, matchInstalled, type ManifestPack } from '../lib/manifest';
import { isActive, pauseDownload, startDownload, useDownloads, type DlState } from '../lib/downloader';

function paramsLabel(b: number): string {
  if (!b) return '';
  return (b < 1 ? `${Math.round(b * 1000)}M` : `${String(Math.round(b * 10) / 10).replace('.', ',')}B`) + ' parametre';
}

function useEngineState() {
  const [s, set] = useState(engine.getState());
  useEffect(() => engine.subscribe(set), []);
  return s;
}

/** Katalogdaki bir model (bölünmüş modelin parçaları tek kayıt) */
interface CatalogModel {
  key: string;
  name: string;
  desc: string;
  size: number;
  parts: ManifestPack[];
  minRamGB?: number;
}

function catalogModels(packs: ManifestPack[]): CatalogModel[] {
  const map = new Map<string, CatalogModel>();
  for (const p of packs) {
    if (p.kind !== 'model') continue;
    const key = p.group ?? p.id;
    const e = map.get(key) ?? {
      key,
      name: p.name.replace(/\s+—\s+parça\s+\d+\/\d+\s*$/i, '').replace(/^Fener modeli\s+—\s+/i, ''),
      desc: p.desc,
      size: 0,
      parts: [],
      minRamGB: p.minRamGB,
    };
    e.parts.push(p);
    e.size += p.size;
    map.set(key, e);
  }
  return [...map.values()].sort((a, b) => a.size - b.size);
}

function dlSummary(parts: ManifestPack[], dls: Record<string, DlState>) {
  let received = 0;
  let total = 0;
  let active = false;
  let error: string | null = null;
  let started = false;
  for (const p of parts) {
    const d = dls[p.file];
    total += d?.total || p.size;
    if (!d) continue;
    started = true;
    received += d.received;
    if (isActive(d)) active = true;
    if (d.status === 'error') error = d.error ?? 'İndirme hatası';
  }
  return { received, total, active, error, started, pct: total ? Math.min(100, Math.floor((received / total) * 100)) : 0 };
}

export function ModelPanel({ onClose, onChange, batterySaver }: { onClose: () => void; onChange: () => void; batterySaver: boolean }) {
  const app = useAppState();
  const eng = useEngineState();
  const dls = useDownloads();
  const [groups, setGroups] = useState<ModelGroup<InstalledPack>[] | null>(null);
  const [override, setOverride] = useState<string | null>(getModelOverride());
  const [catalog, setCatalog] = useState<ManifestPack[]>([]);
  const [installed, setInstalled] = useState<InstalledPack[]>([]);

  const [nat, setNat] = useState(getNativeInfo());
  useEffect(() => {
    let alive = true;
    // Yerel motor varsa gerçek RAM'e göre uygunluk hesaplanır
    loadNativeInfo()
      .then((d) => alive && setNat(d))
      .catch(() => {});
    listModels()
      .then((g) => {
        if (!alive) return;
        setGroups(g);
        setInstalled(g.flatMap((x) => x.parts));
      })
      .catch(() => alive && setGroups([]));
    loadManifest()
      .then((m) => alive && setCatalog(m.packs))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [app.packsVersion]);

  const prof = deviceProfile();
  const overrideMissing = !!override && !!groups && !groups.some((g) => g.id === override && g.complete);
  const manual = !!override && !overrideMissing;
  const active = groups ? chooseModel(groups, prof, manual ? override : null, fitForGroup) : null;

  const choose = (id: string | null) => {
    setModelOverride(id);
    setOverride(id);
    onChange();
  };

  // İndirilmemiş katalog modelleri
  const toGet = useMemo(
    () => catalogModels(catalog).filter((c) => !c.parts.every((p) => matchInstalled(p, installed).length > 0)),
    [catalog, installed],
  );

  let engineLine = 'İlk soruda belleğe yüklenir.';
  if (active && eng.model?.id === active.id) {
    if (eng.status === 'loading') engineLine = `Belleğe yükleniyor${eng.progress != null ? ` %${Math.round(eng.progress * 100)}` : '…'}`;
    else if (eng.status === 'ready') engineLine = eng.backend === 'yerel' ? `Belleğe yüklü, hazır (hızlı yerel motor${eng.gpu ? ', GPU ile' : ''}).` : 'Belleğe yüklü, hazır.';
    else if (eng.status === 'generating') engineLine = 'Şu an cevap yazıyor.';
    else if (eng.status === 'error') engineLine = 'Yüklenemedi: ' + (eng.error ?? 'bilinmeyen hata');
  }

  return (
    <div class="fener-models card" data-testid="fener-model-panel" role="dialog" aria-label="Fener modeli seçimi">
      <div class="row">
        <strong class="grow">Fener modeli</strong>
        <button type="button" class="link-btn fener-models-close" data-testid="fener-model-close" onClick={onClose}>
          Kapat
        </button>
      </div>
      {batterySaver && <div class="fener-models-note warn">Pil tasarrufu açık: model kullanılmaz, Fener rehberden yanıt verir.</div>}

      {groups === null ? (
        <div class="muted fener-small" role="status">
          Modeller aranıyor…
        </div>
      ) : (
        <>
          <div class="fener-active" data-testid="fener-model-active" data-id={active?.id ?? ''}>
            <span class="fener-active-k">Etkin model</span>
            {active ? (
              <>
                <span class="fener-active-name">{active.name}</span>
                <span class="fener-active-meta">
                  {formatSize(active.size)}
                  {active.paramsB ? ` · ${paramsLabel(active.paramsB)}` : ''} · {manual ? 'sizin seçiminiz' : 'otomatik seçildi'}
                </span>
                <span class="fener-active-meta">{engineLine}</span>
                {nat && (
                  <span class="fener-active-meta" data-testid="fener-native">
                    Hızlı yerel motor: {Math.round(nat.ram / 1e9)} GB RAM, {nat.threads} iş parçacığı{nat.arkaUclar?.gpu && !nat.gpuKapali ? ', GPU var' : ''}
                  </span>
                )}
              </>
            ) : (
              <span class="fener-active-meta">Model yok — Fener doğrulanmış rehberlerden yanıt verir.</span>
            )}
          </div>

          <div class="fener-models-h">İndirdiğiniz modeller ({groups.length})</div>
          {groups.length === 0 ? (
            <div class="fener-models-empty" data-testid="fener-model-empty">
              <p class="empty">Bu cihazda ya da bağlı bilgi noktasında model yok. Aşağıdan bir model indirin.</p>
            </div>
          ) : (
            <div class="fener-models-list" role="radiogroup" aria-label="Kullanılacak model">
              {groups.map((g) => {
                const fit = fitForGroup(g);
                const on = active?.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={manual && on}
                    disabled={!g.complete}
                    class={'fener-model-opt' + (on ? ' on' : '')}
                    data-testid="fener-model-opt"
                    data-id={g.id}
                    data-fit={fit}
                    data-active={String(on)}
                    onClick={() => choose(g.id)}
                  >
                    <span class="fener-model-radio" aria-hidden="true" />
                    <span class="fener-model-body">
                      <span class="fener-model-name">{g.name}</span>
                      <span class="fener-model-meta mono">
                        {formatSize(g.size)}
                        {g.quant ? ` · ${g.quant}` : ''}
                        {g.paramsB ? ` · ${paramsLabel(g.paramsB)}` : ''}
                        {g.split ? ` · ${g.total} parça` : ''}
                        {g.parts.some((p) => p.origin === 'server') ? ' · bilgi noktasında' : ' · bu cihazda'}
                      </span>
                      <span class={'fener-model-fit fit-' + fit}>
                        {fit === 'incomplete' ? `${g.parts.length}/${g.total} parça var — eksik: ${g.missing.join(', ')}` : FIT_LABEL[fit]}
                      </span>
                    </span>
                    <span class={'fener-model-state' + (on ? ' on' : '')}>{on ? 'Etkin' : g.complete ? 'Kullan' : ''}</span>
                  </button>
                );
              })}
            </div>
          )}

          {groups.length > 0 && (
            <button
              type="button"
              role="switch"
              aria-checked={!manual}
              class={'fener-auto' + (!manual ? ' on' : '')}
              data-testid="fener-model-auto"
              onClick={() => choose(manual ? null : active?.id ?? null)}
            >
              <span class="fener-auto-sw" aria-hidden="true" />
              <span class="fener-model-body">
                <span class="fener-model-name">Otomatik seç</span>
                <span class="fener-model-meta">
                  {(() => {
                    const auto = chooseModel(groups, prof, null, fitForGroup);
                    return auto ? `Açıkken bu cihaz için en uygun olan kullanılır: ${auto.name}` : 'Uygun model yok';
                  })()}
                </span>
              </span>
            </button>
          )}

          {toGet.length > 0 && (
            <>
              <div class="fener-models-h">İndirilebilecek modeller</div>
              <div class="fener-models-list" data-testid="fener-model-catalog">
                {toGet.map((c) => {
                  const s = dlSummary(c.parts, dls);
                  const heavy = c.minRamGB && prof.memGB && prof.memGB < c.minRamGB;
                  const begin = () => {
                    for (const p of c.parts) {
                      if (matchInstalled(p, installed).length) continue;
                      void startDownload({ file: p.file, urls: p.urls, sha256: p.sha256, size: p.size, sizeApprox: p.sizeApprox });
                    }
                  };
                  return (
                    <div class="fener-cat" key={c.key} data-testid="fener-model-get-row" data-id={c.key}>
                      <div class="fener-model-body grow">
                        <span class="fener-model-name">{c.name}</span>
                        <span class="fener-model-meta">
                          {formatSize(c.size)}
                          {c.parts.length > 1 ? ` · ${c.parts.length} parça` : ''}
                          {c.minRamGB ? ` · en az ${c.minRamGB} GB RAM` : ''}
                        </span>
                        <span class="fener-model-meta">{c.desc}</span>
                        {heavy ? <span class="fener-model-fit fit-heavy">Bu cihazın belleğine ağır gelebilir</span> : null}
                        {s.active && <span class="fener-model-fit" role="status">İniyor %{s.pct}</span>}
                        {!s.active && s.error && <span class="fener-model-fit fit-incomplete">{s.error}</span>}
                        {!s.active && !s.error && s.started && s.pct > 0 && <span class="fener-model-meta">Duraklatıldı · %{s.pct}</span>}
                      </div>
                      {s.active ? (
                        <button type="button" class="btn fener-cat-btn" onClick={() => c.parts.forEach((p) => pauseDownload(p.file))}>
                          Duraklat
                        </button>
                      ) : (
                        <button type="button" class="btn primary fener-cat-btn" data-testid="fener-model-download" onClick={begin}>
                          {s.error ? 'Yeniden dene' : s.started && s.pct > 0 ? 'Devam et' : 'İndir'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <button type="button" class="link-btn fener-models-more" data-testid="fener-model-get" onClick={() => go.tool('paylas')}>
            Dosyadan model ekle / paketleri yönet
          </button>
        </>
      )}
      <p class="fener-models-hint muted">
        İstediğiniz kadar model indirebilirsiniz; hangisine dokunursanız Fener onu kullanır. Büyük model daha iyi yanıt verir ama daha
        yavaştır ve daha çok bellek ister. 2 GB üstü tek dosyalar yüklenirken otomatik bölünür. Seçiminiz bu cihazda saklanır.
      </p>
    </div>
  );
}
