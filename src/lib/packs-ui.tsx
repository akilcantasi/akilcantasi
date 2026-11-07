// İçerik paketi satırları: Araçlar → Paketler ve Kütüphane sekmesi aynı bileşenleri kullanır.
// Katalog (packs-manifest.json) + kurulu paketler + süren indirmeler tek bir satır modelinde birleşir.
import { useEffect, useMemo, useState } from 'preact/hooks';
import '../styles/paylas.css';
import { useAppState } from './store';
import { deleteDevicePack, formatSize, kindOf, listPacks, type InstalledPack, type PackKind } from './packs';
import {
  TIER_LABEL,
  loadManifest,
  matchInstalled,
  recommendTier,
  refreshRemoteManifest,
  tierIncludes,
  type Manifest,
  type ManifestPack,
  type Tier,
} from './manifest';
import {
  canSaveToDevice,
  cancelDownload,
  isActive,
  pauseDownload,
  scanPartFiles,
  startDownload,
  storageInfo,
  useDownloads,
  type DlState,
  type StorageInfo,
} from './downloader';

export type RowModel = {
  key: string;
  entry?: ManifestPack;
  kind: PackKind;
  name: string;
  desc: string;
  file: string;
  size: number;
  sizeApprox: boolean;
  tier?: Tier;
  device?: InstalledPack;
  server?: InstalledPack;
  /** Katalogda bu paketin daha yeni sürümü var */
  outdated?: boolean;
  /** Güncelleme bitince silinecek eski cihaz kopyaları (farklı tarihli dosya adı) */
  oldDevice?: InstalledPack[];
};

/**
 * Kurulu paket katalogdakinden eski mi? Kiwix paketlerinde dosya adındaki tarih değişir;
 * harita/nokta paketlerinde ad aynı kalır, boyut değişir (aylık yenileme).
 */
export function isOutdated(entry: Pick<ManifestPack, 'file' | 'size' | 'sizeApprox'>, inst: Pick<InstalledPack, 'id' | 'size'> | undefined): boolean {
  if (!inst) return false;
  if (inst.id !== entry.file) return true;
  return !entry.sizeApprox && entry.size > 0 && inst.size > 0 && inst.size !== entry.size;
}

export function sizeLabel(size: number, approx: boolean) {
  if (!size) return 'boyut bilinmiyor';
  return (approx ? '~' : '') + formatSize(size);
}

/** " · 12,4 MB/sn · ~3 dk kaldı" */
export function speedText(dl: DlState): string {
  const sp = dl.speed ?? 0;
  if (sp < 1024) return '';
  const mbs = sp / (1024 * 1024);
  let out = ' · ' + (mbs >= 1 ? mbs.toFixed(mbs >= 10 ? 0 : 1).replace('.', ',') + ' MB/sn' : Math.round(sp / 1024) + ' KB/sn');
  if (dl.total > dl.received) {
    const sec = (dl.total - dl.received) / sp;
    out += ' · ~' + (sec < 60 ? 'bir dakikadan az' : sec < 3600 ? Math.ceil(sec / 60) + ' dk' : (sec / 3600).toFixed(1).replace('.', ',') + ' sa') + ' kaldı';
  }
  return out;
}

export function pct(s: DlState) {
  if (s.status === 'hashing') return s.received ? Math.min(100, Math.floor(((s.hashed ?? 0) / s.received) * 100)) : 0;
  return s.total ? Math.min(100, Math.floor((s.received / s.total) * 100)) : 0;
}

/**
 * Satırdaki paketi indirmeye başlar (bilgi noktasında varsa oradan, yoksa katalog adreslerinden).
 * Katalogdaki SHA-256 ve aynalar yalnız inen dosya katalogdakiyle AYNI sürümse kullanılır: bilgi
 * noktasında başka tarihli/boyutlu bir sürüm varsa onun özeti katalogdakine uymaz (doğrulama
 * boşuna başarısız olup dosya silinirdi) ve aynalardaki dosyayla karışmamalıdır.
 */
export function downloadRequestFor(row: RowModel, here = typeof location !== 'undefined' ? location.href : 'http://localhost/') {
  const file = row.device ? row.device.id : row.server ? row.server.id : row.file;
  const size = row.server ? row.server.size : row.size;
  const e = row.entry;
  const exact = !!e && file === e.file && (!!e.sizeApprox || !e.size || !size || size === e.size);
  const urls: string[] = [];
  if (row.server?.url) urls.push(new URL(row.server.url, here).href);
  if (e && exact) urls.push(...e.urls);
  return { file, urls, sha256: exact ? e!.sha256 || undefined : undefined, size, sizeApprox: row.server ? false : row.sizeApprox };
}

export function startRow(row: RowModel) {
  return startDownload(downloadRequestFor(row));
}

/** Yeni sürümü katalog adreslerinden indirir; eski dosya, yenisi tamamen inene kadar yerinde kalır. */
export function startUpdate(row: RowModel) {
  if (!row.entry) return;
  return startDownload({
    file: row.entry.file,
    urls: row.entry.urls,
    sha256: row.entry.sha256,
    size: row.entry.size,
    sizeApprox: !!row.entry.sizeApprox,
  });
}

export function PackRow({ row, dl, memGB, recommended }: { row: RowModel; dl?: DlState; memGB: number | null; recommended: Tier }) {
  const [askDel, setAskDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const saveable = canSaveToDevice();
  const active = isActive(dl);
  const ready = !!row.device || (!!row.server && !dl);
  const begin = () => startRow(row);

  const heavy = row.entry?.minRamGB && memGB && memGB < row.entry.minRamGB;

  let state: any;
  let actions: any = null;
  if (dl && (active || dl.status === 'paused' || dl.status === 'error')) {
    const p = pct(dl);
    if (active) {
      const txt = dl.label
        ? dl.label
        : dl.status === 'hashing'
          ? `Önceki kısım doğrulanıyor %${p}`
          : dl.status === 'verifying'
            ? 'Doğrulanıyor…'
            : `İndiriliyor${dl.total ? ' %' + p : ''} · ${formatSize(dl.received)}${dl.total ? ' / ' + formatSize(dl.total) : ''}${speedText(dl)}`;
      state = (
        <div class="sh-pack-state" data-testid="pack-progress">
          {txt}
          {dl.remote && <span class="sh-remote"> · bilgi noktası indiriyor</span>}
        </div>
      );
      actions = (
        <>
          <button class="btn" data-testid="pack-pause" onClick={() => pauseDownload(dl.file)}>
            Duraklat
          </button>
          <button class="btn" data-testid="pack-cancel" onClick={() => cancelDownload(dl.file)}>
            İptal
          </button>
        </>
      );
    } else if (dl.status === 'paused') {
      state = (
        <div class="sh-pack-state">
          {dl.label ? `Duraklatıldı · ${dl.label.split(' · ').slice(0, 2).join(' · ')} — kaldığı yerden sürer` : `Duraklatıldı${dl.total ? ` %${p}` : ''} · ${formatSize(dl.received)}`}
        </div>
      );
      actions = (
        <>
          <button class="btn primary" data-testid="pack-resume" onClick={begin}>
            Devam
          </button>
          <button class="btn" data-testid="pack-cancel" onClick={() => cancelDownload(dl.file)}>
            İptal
          </button>
        </>
      );
    } else {
      state = <div class="sh-pack-state err">Hata: {dl.error ?? 'bilinmeyen hata'}</div>;
      actions = (
        <>
          <button class="btn" data-testid="pack-download" onClick={begin}>
            Tekrar dene
          </button>
          {dl.received > 0 && (
            <button class="btn" data-testid="pack-cancel" onClick={() => cancelDownload(dl.file)}>
              Sil
            </button>
          )}
        </>
      );
    }
    return (
      <div class="sh-pack" data-testid="pack-row" data-pack={row.file} data-state={dl.status}>
        <PackHead row={row} recommended={recommended} heavy={!!heavy} />
        {(active || dl.status === 'paused') && (
          <div class="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p}>
            <div style={{ width: (dl.status === 'verifying' ? 100 : p) + '%' }} />
          </div>
        )}
        <div class="sh-pack-bottom">
          {state}
          {actions}
        </div>
      </div>
    );
  }

  if (row.device && askDel) {
    // Satır içi onay (confirm() otomatik testleri ve WebView'i kilitler)
    return (
      <div class="sh-pack ready" data-testid="pack-row" data-pack={row.file} data-state="ready">
        <PackHead row={row} recommended={recommended} heavy={!!heavy} />
        <p class="sh-p" data-testid="pack-delete-q">
          Bu paket cihazdan silinsin mi? {formatSize(row.device.size)} yer açılır.
        </p>
        <div class="sh-actions">
          <button class="btn" data-testid="pack-delete-no" disabled={deleting} onClick={() => setAskDel(false)}>
            Vazgeç
          </button>
          <button
            class="btn danger"
            data-testid="pack-delete-yes"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              try {
                await deleteDevicePack(row.device!.id);
              } finally {
                setDeleting(false);
                setAskDel(false);
              }
            }}
          >
            {deleting ? 'Siliniyor…' : 'Evet, sil'}
          </button>
        </div>
      </div>
    );
  }

  if (row.outdated && row.entry && (row.device || row.server)) {
    state = (
      <div class="sh-pack-state upd" data-testid="pack-outdated">
        Güncelleme var · {sizeLabel(row.entry.size, !!row.entry.sizeApprox)}
      </div>
    );
    actions = (
      <button class="btn primary" data-testid="pack-update" onClick={() => startUpdate(row)} disabled={!saveable && !row.server}>
        Güncelle
      </button>
    );
  } else if (row.device) {
    state = <div class="sh-pack-state ok">Hazır · cihazda</div>;
    actions = (
      <button class="btn danger" data-testid="pack-delete" onClick={() => setAskDel(true)}>
        Sil
      </button>
    );
  } else if (row.server) {
    state = <div class="sh-pack-state ok">Hazır · bilgi noktasında</div>;
    actions = saveable ? (
      <button class="btn" data-testid="pack-download" onClick={begin} title="Bilgi noktasından ayrıldıktan sonra da kullanmak için">
        Cihaza kaydet
      </button>
    ) : null;
  } else {
    state = <div class="sh-pack-state">{saveable ? 'Cihazda yok' : 'Bu bağlantıda indirilemez'}</div>;
    actions = saveable ? (
      <button class="btn primary" data-testid="pack-download" onClick={begin}>
        İndir
      </button>
    ) : null;
  }
  return (
    <div class={'sh-pack' + (ready ? ' ready' : '')} data-testid="pack-row" data-pack={row.file} data-state={ready ? 'ready' : 'none'}>
      <PackHead row={row} recommended={recommended} heavy={!!heavy} />
      <div class="sh-pack-bottom">
        {state}
        {actions}
      </div>
    </div>
  );
}

export function PackHead({ row, recommended, heavy }: { row: RowModel; recommended: Tier; heavy: boolean }) {
  const size = row.device?.size ?? row.server?.size ?? row.size;
  const approx = row.device || row.server ? false : row.sizeApprox;
  return (
    <>
      <div class="sh-pack-top">
        <div class="grow">
          <div class="sh-pack-name">{row.name}</div>
          {row.desc && <div class="sh-pack-desc">{row.desc}</div>}
        </div>
      </div>
      <div class="sh-tags">
        <span class="tag">{sizeLabel(size, approx)}</span>
        {row.tier && <span class={'tag' + (tierIncludes(recommended, row.tier) ? ' rec' : '')}>{TIER_LABEL[row.tier]}</span>}
        {row.entry?.minRamGB && <span class="tag">{row.entry.minRamGB}+ GB RAM</span>}
        {/* Uyarı (tehlike değil): kehribar, kırmızı yalnız 112/SOS ve gerçek tehlike için */}
        {heavy && <span class="tag" style="color:var(--accent2)">bu cihaz için ağır</span>}
      </div>
    </>
  );
}


/** Katalog, kurulu paketler ve indirmeleri birleştirir. refreshKey değişince kurulu paketler yeniden okunur. */
export function usePackRows(refreshKey?: unknown) {
  const app = useAppState();
  const downloads = useDownloads();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [installed, setInstalled] = useState<InstalledPack[]>([]);
  /** Kurulu paketler en az bir kez okundu mu (boş liste ile "henüz bilinmiyor" ayrımı) */
  const [installedLoaded, setInstalledLoaded] = useState(false);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const memGB: number | null = (navigator as any).deviceMemory ?? null;

  useEffect(() => {
    let alive = true;
    loadManifest().then((m) => {
      if (!alive) return;
      setManifest(m);
      refreshRemoteManifest().then((r) => alive && r && setManifest(r));
    });
    scanPartFiles();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    listPacks(true).then((p) => {
      if (!alive) return;
      setInstalled(p);
      setInstalledLoaded(true);
    });
    storageInfo().then((s) => alive && setStorage(s));
    return () => {
      alive = false;
    };
  }, [app.packsVersion, refreshKey]);

  const rec = recommendTier({ memGB, freeBytes: storage && storage.quota ? storage.quota - storage.usage : null });

  const rows = useMemo(() => {
    const out: RowModel[] = [];
    const used = new Set<InstalledPack>();
    for (const e of manifest?.packs ?? []) {
      const m = matchInstalled(e, installed);
      m.forEach((x) => used.add(x));
      // Aynı paketin birden çok sürümü varsa katalogdaki adı taşıyan tercih edilir
      const pick = (origin: 'device' | 'server') => m.find((x) => x.origin === origin && x.id === e.file) ?? m.find((x) => x.origin === origin);
      const device = pick('device');
      const server = pick('server');
      const exactDevice = m.some((x) => x.origin === 'device' && x.id === e.file);
      out.push({
        key: e.id,
        entry: e,
        kind: e.kind,
        name: e.name,
        desc: e.desc,
        file: e.file,
        size: e.size,
        sizeApprox: !!e.sizeApprox,
        tier: e.tier,
        device,
        server,
        outdated: isOutdated(e, device ?? server),
        oldDevice: exactDevice ? m.filter((x) => x.origin === 'device' && x.id !== e.file) : [],
      });
    }
    for (const p of installed) {
      if (used.has(p)) continue;
      out.push({
        key: p.origin + ':' + p.id,
        kind: p.kind,
        name: p.id,
        desc: p.origin === 'server' ? 'Bilgi noktasındaki paket' : 'İçe aktarılan paket',
        file: p.id,
        size: p.size,
        sizeApprox: false,
        device: p.origin === 'device' ? p : undefined,
        server: p.origin === 'server' ? p : undefined,
      });
    }
    // Katalogda olmayan yarım indirmeler
    for (const d of Object.values(downloads)) {
      if (out.some((r) => r.file === d.file || r.server?.id === d.file || r.device?.id === d.file)) continue;
      out.push({ key: 'dl:' + d.file, kind: kindOf(d.file) ?? 'zim', name: d.file, desc: 'Yarım kalan indirme', file: d.file, size: d.total, sizeApprox: false });
    }
    return out;
  }, [manifest, installed, downloads]);

  // Güncelleme tamamlanınca eski tarihli cihaz kopyaları silinir (yeni dosya tamamen inmiş olmalı)
  useEffect(() => {
    const olds = rows.flatMap((r) => (r.device && r.device.id === r.file && !downloads[r.file] ? (r.oldDevice ?? []) : []));
    if (!olds.length) return;
    void Promise.all(olds.map((o) => deleteDevicePack(o.id).catch(() => {})));
  }, [rows]);

  const dlFor = (r: RowModel) => downloads[r.file] ?? (r.server ? downloads[r.server.id] : undefined) ?? (r.device ? downloads[r.device.id] : undefined);


  return { manifest, rows, dlFor, rec, storage, memGB, installed, loaded: !!manifest && installedLoaded };
}

/** Kurulu paketlerden güncellemesi olanlar için tek satırlık uyarı ve "Hepsini güncelle" */
export function UpdateBanner({ rows, dlFor }: { rows: RowModel[]; dlFor: (r: RowModel) => DlState | undefined }) {
  const list = rows.filter((r) => r.outdated && r.entry && !isActive(dlFor(r)));
  if (!list.length) return null;
  const total = list.reduce((a, r) => a + (r.entry?.size ?? 0), 0);
  return (
    <div class="sh-upd" role="status" data-testid="update-banner">
      <span class="grow">
        <b>{list.length} paketin yeni sürümü var</b>
        <span> · {list.map((r) => r.name).slice(0, 3).join(', ')}{list.length > 3 ? '…' : ''} · {formatSize(total)}</span>
      </span>
      <button class="btn primary" data-testid="update-all" onClick={() => list.forEach((r) => void startUpdate(r))}>
        Hepsini güncelle
      </button>
    </div>
  );
}
