// Paylaş sekmesi: bilgi noktası, içerik paketleri, internetsiz yayılma,
// pil tasarrufu ve lisanslar.
import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';
import '../styles/paylas.css';
import { setState, useAppState } from '../lib/store';
import { formatSize, importFile, kindOf, type PackKind } from '../lib/packs';
import { importRehberPack } from '../content/pack-guides';
import { KIND_LABEL, TIER_LABEL } from '../lib/manifest';
import { canSaveToDevice, requestPersist } from '../lib/downloader';
import { native } from '../lib/native';
import { PackRow, UpdateBanner, usePackRows } from '../lib/packs-ui';
import { IconWifi } from '../icons';

// ---- yerel ikonlar ----
const ic = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': 'true' as const,
});
const IconBox = () => (
  <svg {...ic()}>
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);
const IconPhone = () => (
  <svg {...ic()}>
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M11 18h2" />
  </svg>
);
const IconShare = () => (
  <svg {...ic()}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
const IconBattery = () => (
  <svg {...ic()}>
    <rect x="2" y="7" width="17" height="10" rx="2" />
    <path d="M22 11v2" />
    <path d="M6 10v4" />
  </svg>
);

// ---- bilgi noktası durumu ----
interface ServerStatus {
  server: true;
  name: string;
  addresses: string[];
  port: number;
  clients: number;
  apk: boolean;
  /** Bu telefonun kendi (Android) bilgi noktası */
  local?: boolean;
}

async function fetchStatus(): Promise<ServerStatus | null> {
  // Android uygulamasında sayfa WebView'den gelir; bilgi noktası yerel eklentidedir.
  if (native.isAndroid()) {
    const n = await native.getInfoPointStatus();
    if (!n?.running) return null;
    return { server: true, name: 'Bu telefon', addresses: n.addresses ?? [], port: n.port ?? 8080, clients: n.clients ?? 0, apk: true, local: true };
  }
  try {
    const res = await fetch('./api/status', { cache: 'no-store' });
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return null;
    const d = await res.json();
    return d && d.server === true ? (d as ServerStatus) : null;
  } catch {
    return null;
  }
}

// Bilgi noktası açılıp kapatılınca durumu hemen yenilemek için
const statusListeners = new Set<() => void>();
const refreshStatus = () => statusListeners.forEach((f) => f());

function useServerStatus() {
  const [st, setSt] = useState<ServerStatus | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    let timer: any;
    const tick = async () => {
      const s = await fetchStatus();
      if (!alive) return;
      setSt(s);
      // Sunucu yoksa seyrek dene (bilgi noktası sonradan açılabilir)
      timer = setTimeout(tick, s ? 5000 : 20000);
    };
    const now = () => {
      clearTimeout(timer);
      tick();
    };
    statusListeners.add(now);
    tick();
    return () => {
      alive = false;
      statusListeners.delete(now);
      clearTimeout(timer);
    };
  }, []);
  return st;
}

function serverUrls(s: ServerStatus): string[] {
  const here = typeof location !== 'undefined' ? location.hostname : '';
  const list = s.addresses.map((a) => `http://${a}:${s.port}`);
  // Telefonun şu an kullandığı adres önce
  const cur = list.find((u) => new URL(u).hostname === here);
  const sorted = cur ? [cur, ...list.filter((u) => u !== cur)] : list;
  if (!sorted.length && !s.local && typeof location !== 'undefined') sorted.push(location.origin);
  return sorted;
}

function QrImage({ text, large, testid }: { text: string; large?: boolean; testid?: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text, { margin: 1, width: 400, errorCorrectionLevel: 'M', color: { dark: '#0b0e13', light: '#ffffff' } })
      .then((u) => alive && setSrc(u))
      .catch(() => alive && setSrc(''));
    return () => {
      alive = false;
    };
  }, [text]);
  return src ? (
    <img class={'sh-qr' + (large ? ' lg' : '')} src={src} alt={'QR kod: ' + text} data-testid={testid} />
  ) : (
    <div class={'sh-qr' + (large ? ' lg' : '')} data-testid={testid} />
  );
}

async function copyText(t: string) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function InfoPointCard({ status }: { status: ServerStatus | null | undefined }) {
  const [copied, setCopied] = useState(false);
  const [nativeMsg, setNativeMsg] = useState('');
  const isAndroid = native.isAndroid();

  if (status) {
    const urls = serverUrls(status);
    const main = urls[0] ?? '';
    return (
      <section class="card sh-card" aria-labelledby="sh-ip">
        <div class="sh-head">
          <div class="sh-ico">
            <IconWifi size={20} />
          </div>
          <h2 id="sh-ip" class="grow">
            Bilgi noktası
          </h2>
          <span class="sh-status on" data-testid="share-status">
            <span class="dot on" />
            açık
          </span>
        </div>
        <p class="sh-p">
          {status.local ? 'Bu telefon bilgi noktası olarak yayında.' : 'Bu cihaz bir bilgi noktasına bağlı.'} Aynı Wi-Fi'daki herkes aşağıdaki adresi açarak uygulamayı ve paketleri internetsiz
          kullanabilir.
        </p>
        {!main && <p class="sh-small">Ağ adresi yok. Erişim noktasını açın; adres birkaç saniye içinde burada görünür.</p>}
        <div class="sh-qr-wrap">
          {main ? <QrImage text={main} testid="share-qr" /> : <div class="sh-qr" />}
          <div class="sh-urls grow">
            <div class="sh-stat">
              <b data-testid="share-clients">{status.clients}</b>
              <span>bağlı cihaz (son 2 dk)</span>
            </div>
            <div class="sh-stat">
              <b>{status.port}</b>
              <span>port</span>
            </div>
          </div>
        </div>
        <div class="sh-urls">
          <span class="label">Adres</span>
          {urls.map((u, i) => (
            <span class="sh-url" data-testid={i === 0 ? 'share-url' : undefined} key={u}>
              {u}
            </span>
          ))}
          <button
            class="btn"
            style="align-self:flex-start"
            data-testid="share-copy"
            disabled={!main}
            onClick={async () => {
              setCopied(await copyText(main));
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Kopyalandı' : 'Adresi kopyala'}
          </button>
        </div>
        <ol class="sh-steps">
          {!status.local && (
          <li>
            Bilgisayarda: <b>Bu bilgisayarın Wi-Fi paylaşımını açın</b> (Ayarlar → Ağ ve İnternet → Mobil etkin nokta) ya da
            herkesi aynı modeme bağlayın.
          </li>
          )}
          <li>Telefonda erişim noktası: Ayarlar → Erişim noktası (Android) / Kişisel Erişim Noktası (iPhone).</li>
          <li>Diğer telefonlar QR kodu kamerayla okutsun ya da adresi tarayıcıya yazsın.</li>
        </ol>
        {status.local && (
          <p class="sh-small" data-testid="infopoint-packs-hint">
            Telefondan yalnızca uygulama ve APK yayınlanır. Paket de yayınlamak için dosyaları USB ile telefondaki{' '}
            <b>Android/data/org.akilcantasi.app/files/packs</b> klasörüne kopyalayın.
          </p>
        )}
        {status.local ? (
          <div class="sh-actions">
            <button class="btn" onClick={() => native.openHotspotSettings()}>
              Erişim noktası ayarları
            </button>
            <button
              class="btn"
              data-testid="infopoint-stop"
              onClick={async () => {
                await native.stopInfoPoint();
                refreshStatus();
              }}
            >
              Yayını durdur
            </button>
          </div>
        ) : (
          status.apk && (
            <a class="btn primary" href="./download/akil-cantasi.apk" download data-testid="share-apk">
              APK'yı indir (Android)
            </a>
          )
        )}
      </section>
    );
  }

  return (
    <section class="card sh-card" aria-labelledby="sh-ip">
      <div class="sh-head">
        <div class="sh-ico">
          <IconWifi size={20} />
        </div>
        <h2 id="sh-ip" class="grow">
          Bilgi noktası
        </h2>
        <span class="sh-status" data-testid="share-status">
          <span class="dot" />
          {status === undefined ? 'bakılıyor' : 'kapalı'}
        </span>
      </div>
      <p class="sh-p">
        Bilgi noktası, bir bilgisayarın ya da telefonun uygulamayı ve tüm paketleri yakındaki herkese Wi-Fi üzerinden sunmasıdır.
        İnternet gerekmez; diğer telefonlarda uygulama kurulu olması da gerekmez.
      </p>
      <div class="sh-switch-row">
        <button
          class="sh-switch"
          role="switch"
          aria-checked="false"
          aria-label="Bilgi noktasını başlat"
          disabled={!isAndroid}
          data-testid="infopoint-switch"
          onClick={async () => {
            const r = await native.startInfoPoint();
            if (r?.running) {
              setNativeMsg('Bilgi noktası başlatıldı.');
              refreshStatus();
              if (!r.addresses?.length) await native.openHotspotSettings();
              return;
            }
            const opened = await native.openHotspotSettings();
            setNativeMsg(opened ? 'Erişim noktasını açın, sonra uygulamaya dönün.' : 'Bu sürümde desteklenmiyor.');
          }}
        />
        <div class="grow">
          <div style="font-size:14px;font-weight:500">Bu telefondan yayınla</div>
          <p class="sh-small">
            {isAndroid ? nativeMsg || 'Erişim noktası ayarlarını açar.' : 'Yalnızca Android uygulamasında. Tarayıcıda kullanılamaz.'}
          </p>
        </div>
      </div>
      <ol class="sh-steps">
        <li>Bilgisayarda Akıl Çantası klasöründeki <b>server/start-windows.cmd</b> dosyasını çalıştırın.</li>
        <li>Bu bilgisayarın Wi-Fi paylaşımını açın (Ayarlar → Ağ ve İnternet → Mobil etkin nokta).</li>
        <li>Ekranda çıkan QR kodu telefonlara okutun.</li>
      </ol>
    </section>
  );
}

// ---- paketler ----

const KIND_ORDER: PackKind[] = ['zim', 'rehber', 'model', 'ses', 'map', 'poi', 'hava'];

function PacksCard(_: { status: ServerStatus | null | undefined }) {
  const { manifest, rows, dlFor, rec, storage, memGB } = usePackRows();
  const [importing, setImporting] = useState<{ name: string; done: number; total: number } | null>(null);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setImportMsg('');
    let ok = 0;
    const errs: string[] = [];
    for (const f of Array.from(files)) {
      try {
        setImporting({ name: f.name, done: 0, total: f.size });
        // Rehber paketi önce doğrulanır (bozuk dosya cihaza kopyalanmaz)
        if (kindOf(f.name) === 'rehber') await importRehberPack(f);
        else await importFile(f, (done, total) => setImporting({ name: f.name, done, total }));
        ok++;
      } catch (e) {
        errs.push(`${f.name}: ${(e as Error).message}`);
      }
    }
    setImporting(null);
    if (fileRef.current) fileRef.current.value = '';
    void requestPersist();
    setImportMsg([ok ? `${ok} paket içe aktarıldı.` : '', ...errs].filter(Boolean).join(' '));
  };

  const free = storage && storage.quota ? storage.quota - storage.usage : null;

  return (
    <section class="card sh-card" aria-labelledby="sh-pk">
      <div class="sh-head">
        <div class="sh-ico">
          <IconBox />
        </div>
        <h2 id="sh-pk" class="grow">
          İçerik paketleri
        </h2>
      </div>
      <UpdateBanner rows={rows} dlFor={dlFor} />
      <button class="btn primary" data-testid="open-kurulum" onClick={() => setState({ kurulum: true })}>
        Hazırlık sihirbazı: önerilenleri tek dokunuşla indir
      </button>
      <div class="sh-hint" data-testid="tier-hint">
        <span>
          Bu cihaz için önerilen: <b>{TIER_LABEL[rec.tier]}</b>
          <span class="muted"> ({rec.reason})</span>
        </span>
      </div>
      {!canSaveToDevice() && (
        <p class="sh-small">
          Bu bağlantı güvenli değil (http). Paketler cihaza kaydedilemez; bilgi noktasından okunur. Kalıcı kopya için Android
          uygulamasını kurun.
        </p>
      )}

      {KIND_ORDER.map((k) => {
        const list = rows.filter((r) => r.kind === k);
        if (!list.length) return null;
        return (
          <div class="sh-group" key={k}>
            <span class="label">{KIND_LABEL[k]}</span>
            {list.map((r) => (
              <PackRow key={r.key} row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} />
            ))}
          </div>
        );
      })}
      {!manifest && <p class="empty">Paket listesi yükleniyor…</p>}

      <input
        ref={fileRef}
        type="file"
        accept=".zim,.gguf,.pmtiles,.geojson,.json,.rehber.json,.tar"
        multiple
        hidden
        onChange={(e) => onFiles((e.currentTarget as HTMLInputElement).files)}
        data-testid="pack-import-input"
      />
      <button class="btn" data-testid="pack-import" disabled={!!importing || !canSaveToDevice()} onClick={() => fileRef.current?.click()}>
        Dosyadan içe aktar
      </button>
      {importing && (
        <div class="sh-storage">
          <span>
            İçe aktarılıyor: {importing.name} · {importing.total ? Math.floor((importing.done / importing.total) * 100) : 0}%
          </span>
          <div class="progress">
            <div style={{ width: (importing.total ? (importing.done / importing.total) * 100 : 0) + '%' }} />
          </div>
        </div>
      )}
      {importMsg && <p class="sh-small">{importMsg}</p>}
      <div class="sh-storage" data-testid="storage-line">
        {storage?.quota ? (
          <span>
            Depolama: {formatSize(storage.usage)} kullanılıyor · {formatSize(free ?? 0)} boş
            {storage.persisted ? ' · kalıcı' : ''}
          </span>
        ) : (
          <span>Depolama bilgisi alınamadı</span>
        )}
      </div>
    </section>
  );
}

// ---- internetsiz yay ----

function SpreadCard({ status }: { status: ServerStatus | null | undefined }) {
  const [open, setOpen] = useState<'app' | 'packs' | null>(null);
  const [msg, setMsg] = useState('');
  const isAndroid = native.isAndroid();
  const base = status ? serverUrls(status)[0] : '';

  return (
    <section class="card sh-card" aria-labelledby="sh-yay">
      <div class="sh-head">
        <div class="sh-ico">
          <IconShare />
        </div>
        <h2 id="sh-yay" class="grow">
          İnternetsiz yay
        </h2>
      </div>
      <p class="sh-small">Uygulamayı ve paketleri internet olmadan, yanınızdakilere aktarın.</p>
      <button
        class="sh-bigbtn"
        aria-expanded={open === 'app'}
        data-testid="share-app"
        onClick={async () => {
          if (isAndroid && !status) {
            const ok = await native.shareApk();
            setMsg(ok ? '' : 'Paylaşım menüsü açılamadı.');
            setOpen(ok ? null : 'app');
            return;
          }
          setOpen(open === 'app' ? null : 'app');
        }}
      >
        <IconPhone />
        <span class="grow">Uygulamayı başka telefona aktar</span>
      </button>
      {open === 'app' && (
        <div class="sh-panel" data-testid="share-app-panel">
          {status && status.apk ? (
            <>
              <p class="sh-p">Android telefon bu QR kodu okutup APK'yı indirsin, sonra "Bilinmeyen kaynaklara izin ver" diyerek kursun.</p>
              <QrImage text={base + '/download/akil-cantasi.apk'} large />
              <span class="sh-url">{base}/download/akil-cantasi.apk</span>
              <p class="sh-small">iPhone'larda kuruluma gerek yok: {base} adresini Safari'de açmaları yeterli.</p>
            </>
          ) : status ? (
            <>
              <p class="sh-p">Bu bilgi noktasında APK yok. Telefonlar uygulamayı doğrudan tarayıcıdan kullanabilir:</p>
              <QrImage text={base} large />
              <span class="sh-url">{base}</span>
              <p class="sh-small">APK eklemek için dosyayı bilgisayardaki data/akil-cantasi.apk konumuna koyun.</p>
            </>
          ) : (
            <>
              {msg && <p class="sh-small" style="color:var(--danger)">{msg}</p>}
              <ul class="sh-steps">
                <li>Android uygulamasında bu düğme APK'yı Bluetooth / Quick Share ile gönderir.</li>
                <li>Bilgisayarda bilgi noktası açıksa, diğer telefonlar oradaki QR kodla APK'yı indirebilir.</li>
                <li>iPhone'lar için kurulum gerekmez: bilgi noktasının adresini Safari'de açmaları yeterli.</li>
              </ul>
            </>
          )}
        </div>
      )}
      <button class="sh-bigbtn" aria-expanded={open === 'packs'} data-testid="share-packs" onClick={() => setOpen(open === 'packs' ? null : 'packs')}>
        <IconBox />
        <span class="grow">İçerik paketlerini paylaş</span>
      </button>
      {open === 'packs' && (
        <div class="sh-panel" data-testid="share-packs-panel">
          <ul class="sh-steps">
            <li>
              <b>En kolayı:</b> bir bilgisayarda bilgi noktasını başlatın, paket dosyalarını data/ klasörüne koyun. Herkes adresi
              açınca paketleri kullanır; isteyen "Cihaza kaydet" ile kopyalar.
            </li>
            <li>
              <b>USB / kablo ile:</b> .zim, .gguf, .pmtiles, .geojson ve .tar (ses) dosyalarını diğer telefona kopyalayın. O telefonda bu sekmede
              "Dosyadan içe aktar"a basıp dosyaları seçin.
            </li>
            <li>Bluetooth büyük dosyalar için çok yavaştır; mümkünse Wi-Fi ya da kablo kullanın.</li>
          </ul>
        </div>
      )}
    </section>
  );
}

// ---- pil ----

function SaverCard() {
  const s = useAppState();
  return (
    <section class="card sh-card">
      <div class="sh-switch-row">
        <div class="sh-ico" style="width:34px;height:34px;border-radius:10px;background:var(--bg2);border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0">
          <IconBattery />
        </div>
        <div class="grow">
          <div id="sh-saver" style="font-size:16px;font-weight:600">
            Pil tasarrufu modu
          </div>
          <p class="sh-small">Fener'in yapay zekâ modeli ve animasyonlar kapanır, harita daha az çizer. Rehber, kütüphane ve Fener'in rehber yanıtları çalışır.</p>
        </div>
        <button
          class="sh-switch"
          role="switch"
          aria-checked={s.batterySaver ? 'true' : 'false'}
          aria-labelledby="sh-saver"
          data-testid="saver-switch"
          onClick={() => setState({ batterySaver: !s.batterySaver })}
        />
      </div>
    </section>
  );
}

// ---- lisanslar ----

const LICENSES: { name: string; lic: string; note: string }[] = [
  { name: 'OpenStreetMap', lic: 'ODbL 1.0', note: 'Harita ve afet noktası verileri © OpenStreetMap katkıcıları' },
  { name: 'Vikipedi', lic: 'CC BY-SA 4.0', note: 'Madde metinleri © Vikipedi katkıcıları' },
  { name: 'WikiMed (mdwiki)', lic: 'CC BY-SA 4.0', note: 'Tıbbi maddeler © WikiProjectMed katkıcıları' },
  { name: 'Kiwix / libzim', lic: 'GPL-3.0', note: 'ZIM biçimi ve Vikipedi paketleri' },
  { name: 'llama.cpp', lic: 'MIT', note: 'Cihaz üzerinde dil modeli çalıştırma' },
  { name: 'wllama', lic: 'MIT', note: 'llama.cpp WebAssembly sürümü' },
  { name: 'MapLibre GL JS', lic: 'BSD-3-Clause', note: 'Harita çizimi' },
  { name: 'PMTiles (Protomaps)', lic: 'BSD-3-Clause', note: 'Tek dosyalık harita biçimi' },
  // Model lisansları public/packs-manifest.json'daki "license" alanlarıyla aynı tutulur.
  { name: 'Qwen2.5 / Qwen3.5 (Alibaba Cloud)', lic: 'Apache-2.0', note: 'Fener modelleri; GGUF dönüşümü: Unsloth' },
  { name: 'Gemma 4 E2B (Google DeepMind)', lic: 'Apache-2.0', note: 'Fener modeli (bilgi noktası için ikinci seçenek)' },
  { name: 'OpenAI Whisper', lic: 'MIT', note: 'Sesli soru (konuşma tanıma); ONNX dönüşümü: onnx-community' },
  { name: 'Transformers.js', lic: 'Apache-2.0', note: 'Konuşma tanımayı cihazda çalıştırma' },
  { name: 'fzstd, xz-decompress', lic: 'MIT', note: 'Sıkıştırılmış paketleri açma' },
  { name: 'Capacitor', lic: 'MIT', note: 'Android uygulaması ve sesli okuma' },
  { name: 'Preact', lic: 'MIT', note: 'Arayüz' },
  { name: 'hash-wasm', lic: 'MIT', note: 'İndirme doğrulaması (SHA-256)' },
  { name: 'node-qrcode', lic: 'MIT', note: 'QR kodlar' },
  { name: 'IBM Plex', lic: 'OFL-1.1', note: 'Yazı tipi' },
  { name: 'Akıl Çantası', lic: 'GPL-3.0-or-later', note: 'Bu uygulama özgür yazılımdır; kaynak kodu paylaşılabilir ve değiştirilebilir.' },
];

function LicensesCard() {
  return (
    <section class="card">
      <details class="sh-lic" data-testid="licenses">
        <summary>Kaynaklar ve lisanslar</summary>
        <ul>
          {LICENSES.map((l) => (
            <li key={l.name}>
              <b>{l.name}</b> <span>· {l.lic}</span>
              <br />
              {l.note}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export function PaylasTab() {
  const status = useServerStatus();
  // Araçlar → "Paketler ve paylaşım" içinde açılır; dış .pad aracın kendisinde
  return (
    <div class="sh-root">
      <InfoPointCard status={status} />
      <PacksCard status={status} />
      <SpreadCard status={status} />
      <SaverCard />
      <LicensesCard />
    </div>
  );
}
