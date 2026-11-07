// Elinizdeki dosyayı ekleyin: .zim koleksiyonu ya da .rehber.json rehber paketi (USB, bilgisayar, Bluetooth…)
import { useRef, useState } from 'preact/hooks';
import { importFile, kindOf } from '../../lib/packs';
import { canSaveToDevice, requestPersist } from '../../lib/downloader';
import { importRehberPack } from '../../content/pack-guides';
import { IcoFile } from './ikonlar';
import { fmt } from './veri';

/** İçe aktarma iletisi (paket listesi değişince ekran yeniden kurulsa da kaybolmasın) */
let sonMesaj = '';

export function DosyadanEkle({ link = false }: { link?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<{ name: string; done: number; total: number } | null>(null);
  const [msg, setMsgState] = useState(sonMesaj);
  const setMsg = (m: string) => setMsgState((sonMesaj = m));
  const ok = canSaveToDevice();

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setMsg('');
    const out: string[] = [];
    for (const f of Array.from(files)) {
      try {
        const kind = kindOf(f.name);
        if (kind === 'rehber') {
          const r = await importRehberPack(f);
          out.push(`"${r.name}" eklendi (${r.guides} rehber); Rehber sekmesinde, "Kendine Yetmek" bölümünde.` + (r.warnings.length ? ` ${r.warnings.length} bozuk öğe atlandı.` : ''));
        } else if (kind === 'zim') {
          setBusy({ name: f.name, done: 0, total: f.size });
          await importFile(f, (done, total) => setBusy({ name: f.name, done, total }));
          out.push(`${f.name} eklendi; Kitaplığım'da.`);
        } else {
          out.push(`${f.name}: bu dosya kütüphaneye eklenemez (.zim ya da .rehber.json olmalı). Harita ve Fener dosyaları için Araçlar → Paketler.`);
        }
      } catch (e) {
        out.push(`${f.name}: ${(e as Error).message}`);
      }
    }
    setBusy(null);
    if (ref.current) ref.current.value = '';
    void requestPersist();
    setMsg(out.join(' '));
  };

  return (
    <div class="kt" style="gap:8px" data-testid="lib-import">
      <input ref={ref} type="file" accept=".zim,.json,.rehber.json,application/json" multiple hidden data-testid="lib-import-input" onChange={(e) => onFiles((e.currentTarget as HTMLInputElement).files)} />
      <button
        class={link ? 'kt-link' : 'btn'}
        style={link ? '' : 'display:inline-flex;align-items:center;gap:8px;align-self:flex-start'}
        data-testid="lib-import-btn"
        disabled={!!busy || !ok}
        onClick={() => ref.current?.click()}
      >
        <IcoFile />
        {busy ? `Ekleniyor… %${busy.total ? Math.floor((busy.done / busy.total) * 100) : 0}` : 'Elinizdeki dosyayı ekleyin'}
      </button>
      {busy && (
        <p class="kt-note" role="status">
          {busy.name} · {fmt(busy.done)} / {fmt(busy.total)}
        </p>
      )}
      {!ok && <p class="kt-note">Bu bağlantıda (http) dosya telefona kaydedilemez.</p>}
      {msg && (
        <p class="kt-note" role="status" data-testid="lib-import-msg">
          {msg}
        </p>
      )}
    </div>
  );
}
